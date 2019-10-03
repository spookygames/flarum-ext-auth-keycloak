import { extend, override } from "flarum/extend";
import app from "flarum/app";
import HeaderSecondary from "flarum/components/HeaderSecondary";
import SettingsPage from "flarum/components/SettingsPage";
import LogInModal from 'flarum/components/LogInModal';

import KeycloakLogInButton from './components/KeycloakLogInButton';

app.initializers.add('spookygames-auth-keycloak', () => {

    function addKeycloakLoginButton(items) {
        items.add('logIn',
            <KeycloakLogInButton
              className="Button LogInButton--keycloak"
              icon="fab arrow-right"
              path="/auth/keycloak">
              {app.translator.trans('core.forum.header.log_in_link')}
            </KeycloakLogInButton>
        );
    }

    extend(HeaderSecondary.prototype, 'items', function(items) {

        // Replace login button with redirection to Keycloak
        if (items.has('logIn')) {
            items.remove('logIn');
            addKeycloakLoginButton(items);
        }

        // Simply remove signup button
        if (items.has('signUp')) {
            items.remove('signUp');
        }
    });

    extend(SettingsPage.prototype, 'accountItems', function(items) {
        // Email/password management is delegated to Keycloak
        // Better hide it from here
        items.remove('changeEmail');
        items.remove('changePassword');
    });

    extend(SettingsPage.prototype, 'settingsItems', function(items) {
        // Account management is mostly delegated to Keycloak
        // Better hide this from here
        if (items.has('account')
            && items.get('account').props.children.length === 0) {
            items.remove('account');
        }
    });

    extend(LogInModal.prototype, 'fields', function (items) {

        items.remove('identification');
        items.remove('password');
        items.remove('remember');
        items.remove('submit');

        addKeycloakLoginButton(items);

        return items;
    });

    override(LogInModal.prototype, 'footer', function () {
      // Hide hint for forgot password etc
      return [ ];
    });

});
