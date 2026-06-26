import { extend, override } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import HeaderSecondary from 'flarum/forum/components/HeaderSecondary';
import SettingsPage from 'flarum/forum/components/SettingsPage';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';
import AvatarEditor from 'flarum/forum/components/AvatarEditor';

app.initializers.add('spookygames-auth-keycloak', () => {
  function addKeycloakLoginButton(items) {
    items.add(
      'logIn',
      Button.component(
        {
          className: 'Button LogInButton--keycloak LogInButton',
          icon: 'fab arrow-right',
          onclick() {
            const width = 600;
            const height = 515;
            const $window = $(window);

            window.open(
              app.forum.attribute('baseUrl') + '/auth/keycloak',
              'logInPopup',
              `width=${width},` +
                `height=${height},` +
                `top=${$window.height() / 2 - height / 2},` +
                `left=${$window.width() / 2 - width / 2},` +
                'status=no,resizable=no'
            );
          },
        },
        app.translator.trans('core.forum.header.log_in_link')
      )
    );
  }

  extend(HeaderSecondary.prototype, 'items', function (items) {
    if (items.has('logIn')) {
      items.remove('logIn');
      addKeycloakLoginButton(items);
    }

    if (items.has('signUp')) {
      items.remove('signUp');
    }
  });

  extend(SettingsPage.prototype, 'accountItems', function (items) {
    items.remove('changeEmail');
    items.remove('changePassword');
  });

  extend(SettingsPage.prototype, 'settingsItems', function (items) {
    if (items.has('account') && items.get('account').children.length === 0) {
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
    return [];
  });

  extend(AvatarEditor.prototype, 'view', function (vdom) {
    if (app.forum.attribute('spookygames-auth-keycloak.delegate_avatars')) {
      vdom.children.length = 1;
    }

    return vdom;
  });

  extend(AvatarEditor.prototype, 'controlItems', function (items) {
    if (app.forum.attribute('spookygames-auth-keycloak.delegate_avatars')) {
      items._items = {};
    }

    return items;
  });
});
