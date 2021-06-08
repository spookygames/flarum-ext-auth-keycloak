import { extend, override } from "flarum/extend";
import app from "flarum/app";
import HeaderSecondary from "flarum/components/HeaderSecondary";
import SettingsPage from "flarum/components/SettingsPage";
import Button from 'flarum/components/Button';
import LogInModal from 'flarum/components/LogInModal';

app.initializers.add('spookygames-auth-keycloak', () => {

    function addKeycloakLoginButton(items) {
        items.add('logIn',
          Button.component(
  				  {
              className: 'Button LogInButton--keycloak LogInButton',
              icon: 'fab arrow-right',
              onclick: function() {
                  const width = 600;
                  const height = 515;
                  const $window = $(window);

                  window.open(app.forum.attribute('baseUrl') + '/auth/keycloak', 'logInPopup',
                    `width=${width},` +
                    `height=${height},` +
                    `top=${$window.height() / 2 - height / 2},` +
                    `left=${$window.width() / 2 - width / 2},` +
                    'status=no,resizable=no');
                }
  				  },
            app.translator.trans('core.forum.header.log_in_link')
  				)
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
        if (items.has('account')) {
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
