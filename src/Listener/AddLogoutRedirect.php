<?php
namespace SpookyGames\Auth\Keycloak\Listener;
use Flarum\Http\UrlGenerator;
use Flarum\User\Event\LoggedOut;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Stevenmaguire\OAuth2\Client\Provider\Keycloak;

class AddLogoutRedirect
{
    protected $settings;
    protected $url;

    public function __construct(SettingsRepositoryInterface $settings, UrlGenerator $url)
    {
        $this->settings = $settings;
        $this->url = $url;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(LoggedOut::class, [$this, 'addLogoutRedirect']);
    }

    public function addLogoutRedirect(LoggedOut $event)
    {
        $redirectUrl = $this->url->to('forum')->base();

        $provider = new Keycloak([
           'authServerUrl'         => $this->settings->get('spookygames-auth-keycloak.server_url'),
           'realm'                 => $this->settings->get('spookygames-auth-keycloak.realm'),
           'clientId'              => $this->settings->get('spookygames-auth-keycloak.app_id'),
           'clientSecret'          => $this->settings->get('spookygames-auth-keycloak.app_secret'),
           'redirectUri'           => $redirectUrl,
           'encryptionAlgorithm'   => $this->settings->get('spookygames-auth-keycloak.encryption_algorithm'),
           'encryptionKey'         => $this->settings->get('spookygames-auth-keycloak.encryption_key'),
           'version'               => $this->settings->get('spookygames-auth-keycloak.keycloak_version')
        ]);

        $logoutUrl = $provider->getLogoutUrl();

        header('Location: ' . $logoutUrl);
        die();
    }
}
