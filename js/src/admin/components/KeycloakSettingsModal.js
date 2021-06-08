import SettingsModal from 'flarum/components/SettingsModal';

export default class KeycloakSettingsModal extends SettingsModal {
  className() {
    return 'KeycloakSettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.title');
  }

  form() {
    return [
      m('.Form-group', [
        m('label', app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.server_url_label')),
        m('input.FormControl', {
          bidi: this.setting('spookygames-auth-keycloak.server_url'),
          placeholder: 'https://keycloak.example.com/auth'
        })
      ]),

      m('.Form-group', [
        m('label', app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.realm_label')),
        m('input.FormControl', {
          bidi: this.setting('spookygames-auth-keycloak.realm'),
          placeholder: 'my_realm'
        })
      ]),

      m('.Form-group', [
        m('label', app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.client_id_label')),
        m('input.FormControl', {
          bidi: this.setting('spookygames-auth-keycloak.app_id'),
          placeholder: 'flarum'
        })
      ]),

      m('.Form-group', [
        m('label', app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.client_secret_label')),
        m('input.FormControl', {
          bidi: this.setting('spookygames-auth-keycloak.app_secret'),
          placeholder: '88a44c58-17c4-414c-85ed-4c56594131ba'
        })
      ]),

      m('.Form-group', [
        m('label', app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.encryption_algorithm_label')),
        m('input.FormControl', {
          bidi: this.setting('spookygames-auth-keycloak.encryption_algorithm'),
          placeholder: 'RS256'
        })
      ]),

      m('.Form-group', [
        m('label', app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.encryption_key_label')),
        m('input.FormControl', {
          bidi: this.setting('spookygames-auth-keycloak.encryption_key'),
          placeholder: '-----BEGIN PUBLIC KEY----- MIIBIjANsomethingIDAQAB -----END PUBLIC KEY-----'
        })
      ]),

      m('.Form-group', [
        m('label', app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.role_mapping_label')),
        m('input.FormControl', {
          bidi: this.setting('spookygames-auth-keycloak.role_mapping'),
          placeholder: '{"ROLE_MEMBER":"Member","ROLE_MODERATOR":"Mods","ROLE_ADMIN":"Admin"}'
        })
      ])
    ];
  }
}
