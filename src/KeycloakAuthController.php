<?php

namespace SpookyGames\Auth\Keycloak;

use Exception;
use Flarum\Forum\Auth\Registration;
use Flarum\Forum\Auth\ResponseFactory;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Flarum\User\RegistrationToken;
use Flarum\User\Command\RegisterUser;
use Illuminate\Contracts\Bus\Dispatcher;
use League\OAuth2\Client\Token\AccessToken;
use Stevenmaguire\OAuth2\Client\Provider\Keycloak;
use Stevenmaguire\OAuth2\Client\Provider\KeycloakResourceOwner;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\RedirectResponse;

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
                'clientId'              => $this->settings->get('spookygames-auth-keycloak.app_id'),
                'clientSecret'          => $this->settings->get('spookygames-auth-keycloak.app_secret'),
                'redirectUri'           => $redirectUri,
                'encryptionAlgorithm'   => $this->settings->get('spookygames-auth-keycloak.encryption_algorithm'),
                'encryptionKey'         => $this->settings->get('spookygames-auth-keycloak.encryption_key')
            ]);

        $session = $request->getAttribute('session');
        $queryParams = $request->getQueryParams();

        $code = array_get($queryParams, 'code');

        if (! $code) {
            // If we don't have an authorization code then get one
            $authUrl = $provider->getAuthorizationUrl();
            $session->put('oauth2state', $provider->getState());
            header('Location: '.$authUrl);

            // return new RedirectResponse($authUrl.'&display=popup');
            return new RedirectResponse($authUrl);
        }

        $state = array_get($queryParams, 'state');

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

        // We got an access token, let's now get user details
        try {

            /** @var KeycloakResourceOwner $user */
            $user = $provider->getResourceOwner($token);

        } catch (Exception $e) {
            exit('Failed to get resource owner: '.$e->getMessage());
        }

        $actor = $request->getAttribute('actor');

        return $this->response->make(
            'keycloak', $user->getId(),
            function (Registration $registration) use ($user, $provider, $token, $actor) {

                $userArray = $user->toArray();
                $userName = array_get($userArray, 'preferred_username');

                $registration
                    ->provideTrustedEmail($user->getEmail())
                    ->suggestUsername($userName)
                    ->setPayload($userArray);

                $pic = array_get($userArray, 'picture');
                if ($pic) {
                    $registration->provideAvatar($pic);
                }

                $provided = $registration->getProvided();

                if ($localUser = User::where(array_only($provided, 'email'))->first()) {

                    // User exists
                    // Update with latest information
                    $localUser
                        ->rename($userName)
                        ->changeEmail($user->getEmail());
                    $localUser->save();

                } else {

                    // User does not exist (yet)
                    // Automatically create it

                    $registrationToken = RegistrationToken::generate('keycloak', $user->getId(), $provided, $registration->getPayload());
                    $registrationToken->save();

                    $data = [
                        'attributes' => array_merge($provided, $registration->getSuggested(), [
                                'token' => $registrationToken->token,
                                'provided' => array_keys($provided)
                            ])
                    ];

                    try {
                        // Create user
                        $created = $this->bus->dispatch(new RegisterUser($actor, $data));
                        // Remove its new login provider (will be re-created right afterwards)
                        $created->loginProviders()->delete();
                    } catch (Exception $e) {
                        exit('Failed to create Flarum user: '.$e->getMessage());
                    }

                }
            }
        );
    }
}
