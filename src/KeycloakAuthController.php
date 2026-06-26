<?php

namespace SpookyGames\Auth\Keycloak;

use Exception;
use Flarum\Group\Group;
use Flarum\Forum\Auth\Registration;
use Flarum\Forum\Auth\ResponseFactory;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\LoginProvider;
use Flarum\User\User;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Laminas\Diactoros\Response\RedirectResponse;
use League\OAuth2\Client\Token\AccessToken;
use Stevenmaguire\OAuth2\Client\Provider\Keycloak;
use Stevenmaguire\OAuth2\Client\Provider\KeycloakResourceOwner;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;

class KeycloakAuthController implements RequestHandlerInterface
{
    /**
     * @var ResponseFactory
     */
    protected $response;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Dispatcher
     */
     protected $bus;

    /**
     * @param ResponseFactory $response
     * @param SettingsRepositoryInterface $settings
     * @param Dispatcher $bus
     */
    public function __construct(ResponseFactory $response, SettingsRepositoryInterface $settings, Dispatcher $bus)
    {
        $this->response = $response;
        $this->settings = $settings;
        $this->bus = $bus;
    }

    /**
     * @param Request $request
     * @return ResponseInterface
     * @throws Exception
     */
    public function handle(Request $request): ResponseInterface
    {
        $conf = app('flarum.config');
        $redirectUri = $conf['url'] . "/auth/keycloak";

        $provider = new Keycloak([
                'authServerUrl'         => $this->settings->get('spookygames-auth-keycloak.server_url'),
                'realm'                 => $this->settings->get('spookygames-auth-keycloak.realm'),
                'clientId'              => $this->settings->get('spookygames-auth-keycloak.app_id') ?: $this->settings->get('spookygames-auth-keycloak.client_id'),
                'clientSecret'          => $this->settings->get('spookygames-auth-keycloak.app_secret') ?: $this->settings->get('spookygames-auth-keycloak.client_secret'),
                'redirectUri'           => $redirectUri,
                'encryptionAlgorithm'   => $this->settings->get('spookygames-auth-keycloak.encryption_algorithm'),
                'encryptionKey'         => $this->settings->get('spookygames-auth-keycloak.encryption_key'),
                'version'               => $this->settings->get('spookygames-auth-keycloak.keycloak_version')
            ]);

        $session = $request->getAttribute('session');
        $queryParams = $request->getQueryParams();

        $code = Arr::get($queryParams, 'code');

        if (! $code) {
            // If we don't have an authorization code then get one
            $authUrl = $provider->getAuthorizationUrl();
            $session->put('oauth2state', $provider->getState());

            return new RedirectResponse($authUrl);
        }

        $state = Arr::get($queryParams, 'state');

        // Check given state against previously stored one to mitigate CSRF attack
        if (! $state || $state !== $session->get('oauth2state')) {
            $session->remove('oauth2state');

            throw new Exception('Invalid state');
        }

        // Try to get an access token (using the authorization code grant)
        try {
            $token = $provider->getAccessToken('authorization_code', compact('code'));
        } catch (Exception $e) {
            exit('Failed to get access token: '.$e->getMessage());
        }

        // We got an access token, let's get user details
        try {

            /** @var KeycloakResourceOwner $user */
            $remoteUser = $provider->getResourceOwner($token);

        } catch (Exception $e) {
            throw new Exception('Failed to get resource owner: '.$e->getMessage(), 0, $e);
        }

        // Fine! We now know everything we need about our remote user
        $remoteUserArray = $remoteUser->toArray();

        $groups = $this->resolveGroups($remoteUserArray);
        $additionalAttributes = $this->resolveAdditionalAttributes($remoteUserArray);

        if ($localUser = LoginProvider::logIn('keycloak', $remoteUser->getId())) {
            // User already exists and is synced with Keycloak

            // Update with latest information

            $registration = $this->decorateRegistration(new Registration, $remoteUser);

            $data = $this->buildUpdateData(array_merge($registration->getProvided(), $registration->getSuggested(), $additionalAttributes), $groups);

            try {
                $this->updateUser($localUser, $remoteUser, $data, $this->findFirstAdminUser());
            } catch (Exception $e) {
                if ($localUser->id != 1) {
                    throw new Exception('Failed to update Flarum user: '.$e->getMessage(), 0, $e);
                }
            }
        }

        $registration = $this->decorateRegistration(new Registration, $remoteUser);
        $provided = $registration->getProvided();

        if (! LoginProvider::logIn('keycloak', $remoteUser->getId()) && ! User::where(Arr::only($provided, 'email'))->first()) {
            $this->createLocalUserFromRegistration($registration, $remoteUser, $groups, $additionalAttributes);
        }

        return $this->response->make(
            'keycloak',
            $remoteUser->getId(),
            function (Registration $registration) use ($remoteUser) {
                $this->decorateRegistration($registration, $remoteUser);
            }
        );
    }

    public function resolveGroups(array $remoteUserArray): ?array
    {
        $groups = null;

        // Map Keycloak roles onto Flarum groups
        if ($roleMapping = json_decode($this->settings->get('spookygames-auth-keycloak.role_mapping'), true)) {
            $roles = [];
            $realmAccess = Arr::get($remoteUserArray, 'realm_access');
            $realmAccessRoles = is_array($realmAccess) ? Arr::get($realmAccess, 'roles') : null;
            if (is_array($realmAccessRoles)) {
                $roles = array_merge($roles, $realmAccessRoles);
            }

            // Accept "roles" attribute for simplicity and compatibility with previous versions
            if (isset($remoteUserArray['roles']) && is_array($remoteUserArray['roles'])) {
                $roles = array_merge($roles, $remoteUserArray['roles']);
            }

            $groups = [];
            foreach ($roles as $role) {
                if ($groupName = Arr::get($roleMapping, $role)) {
                    if ($group = $this->findGroupByName($groupName)) {
                        $groups[] = array('id' => $group->id);
                    }
                }
            }
        }

        return $groups;
    }

    public function resolveAdditionalAttributes(array $remoteUserArray): array
    {
        // Map Keycloak attributes with custom mapping, if any
        $additionalAttributes = [];
        if ($attributeMapping = json_decode($this->settings->get('spookygames-auth-keycloak.attribute_mapping'), true)) {
            foreach ($attributeMapping as $sourceAttribute => $targetAttribute) {
                if ($attributeValue = Arr::get($remoteUserArray, $sourceAttribute)) {
                    $additionalAttributes[$targetAttribute] = $attributeValue;
                }
            }
        }

        // Add picture -> avatar_url mapping to perform avatar delegation
        if ($this->settings->get('spookygames-auth-keycloak.delegate_avatars')) {
            $pic = Arr::get($remoteUserArray, 'picture');
            if ($pic) {
                $additionalAttributes['avatar_url'] = $pic;
            }
        }
        return $additionalAttributes;
    }

    public function decorateRegistration(Registration $registration, KeycloakResourceOwner $remoteUser): Registration
    {
        $remoteUserArray = $remoteUser->toArray();

        $registration->provideTrustedEmail($remoteUser->getEmail());

        // Same regex used in Registration.suggestUsername
        $rawUsername = Arr::get($remoteUserArray, 'preferred_username');
        $username = preg_replace('/[^a-z0-9-_]/i', '', $rawUsername);
        if ($username == $rawUsername) {
          $registration->suggestUsername($rawUsername);
        } else {
          $registration->suggestUsername(Str::lower(Str::random(24)));
          $registration->suggest('nickname', $rawUsername);
        }

        $registration->setPayload($remoteUserArray);

        return $registration;
    }

    public function updateUser(User $localUser, KeycloakResourceOwner $remoteUser, array $updateData, User $actor): User
    {
        $attributes = Arr::get($updateData, 'attributes', []);

        if (! empty($attributes['username']) && $attributes['username'] !== $localUser->username) {
            $localUser->rename($attributes['username']);
        }

        if (! empty($attributes['email']) && $attributes['email'] !== $localUser->email) {
            $localUser->changeEmail($attributes['email']);
            $localUser->is_email_confirmed = true;
        }

        foreach ($attributes as $key => $value) {
            if (in_array($key, ['username', 'email', 'avatar_url'], true)) {
                continue;
            }

            $localUser->setAttribute($key, $value);
        }

        if (array_key_exists('avatar_url', $attributes) && $attributes['avatar_url'] !== $localUser->getRawOriginal('avatar_url')) {
            $localUser->changeAvatarPath($attributes['avatar_url']);
        }

        $localUser->save();

        $groups = collect(Arr::get($updateData, 'relationships.groups.data', []))
            ->pluck('id')
            ->filter()
            ->all();

        if ($groups) {
            $localUser->groups()->sync($groups);
        }

        return $localUser;
    }

    public function findFirstAdminUser(): User
    {
        return Group::where('id', '1')->firstOrFail()->users()->first();
    }

     public function findGroupByName($name): ?Group
     {
         return Group::where('name_singular', $name)->orWhere('name_plural', $name)->first();
     }

    public function buildUpdateData(array $attributes, $groups): array
    {
      $data = [
          'attributes' => $attributes
      ];

      if ($groups) {
          $data['relationships'] = array('groups' => array('data' => $groups));
      }

       return $data;
    }

    protected function createLocalUserFromRegistration(Registration $registration, KeycloakResourceOwner $remoteUser, ?array $groups, array $additionalAttributes): User
    {
        $provided = $registration->getProvided();
        $suggested = $registration->getSuggested();

        $username = $provided['username'] ?? $suggested['username'] ?? 'user_'.Str::lower(Str::random(12));
        $baseUsername = $username;
        $suffix = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername.'_'.$suffix;
            $suffix++;
        }

        $email = $provided['email'] ?? null;
        if (! $email) {
            throw new Exception('Keycloak user did not provide an email address');
        }

        $user = new User();
        $user->username = $username;
        $user->email = $email;
        $user->is_email_confirmed = true;
        $user->password = password_hash(Str::random(48), PASSWORD_DEFAULT);
        $user->save();

        $user->loginProviders()->create([
            'provider' => 'keycloak',
            'identifier' => $remoteUser->getId(),
        ]);

        if ($groups) {
            $user->groups()->sync(collect($groups)->pluck('id')->all());
        }

        if (($avatarUrl = Arr::get($additionalAttributes, 'avatar_url'))) {
            $user->avatar_url = $avatarUrl;
            $user->save();
        }

        return $user;
    }
}
