<?php

use SpookyGames\Auth\Keycloak\KeycloakAuthController;
use SpookyGames\Auth\Keycloak\Listener;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Routes('forum'))
        ->get('/auth/keycloak', 'auth.keycloak', KeycloakAuthController::class),

    function (Dispatcher $events) {
        $events->subscribe(Listener\AddLogoutRedirect::class);
    },

    new Extend\Locales(__DIR__.'/locale'),
];
