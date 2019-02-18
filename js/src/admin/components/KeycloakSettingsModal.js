import SettingsModal from 'flarum/components/SettingsModal';
import app from 'flarum/app';

export default class KeycloakSettingsModal extends SettingsModal {
  className() {
    return 'KeycloakSettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.title');
  }

  form() {
    return [
      <div className="Form-group">
        <label>{app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.server_url_label')}</label>
        <input className="FormControl" bidi={this.setting('spookygames-auth-keycloak.server_url')}/>
      </div>,

      <div className="Form-group">
        <label>{app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.realm_label')}</label>
        <input className="FormControl" bidi={this.setting('spookygames-auth-keycloak.realm')}/>
      </div>,

      <div className="Form-group">
        <label>{app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.client_id_label')}</label>
        <input className="FormControl" bidi={this.setting('spookygames-auth-keycloak.app_id')}/>
      </div>,

      <div className="Form-group">
        <label>{app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.client_secret_label')}</label>
        <input className="FormControl" bidi={this.setting('spookygames-auth-keycloak.app_secret')}/>
      </div>,

      <div className="Form-group">
        <label>{app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.encryption_algorithm_label')}</label>
        <input className="FormControl" bidi={this.setting('spookygames-auth-keycloak.encryption_algorithm')}/>
      </div>,

      <div className="Form-group">
        <label>{app.translator.trans('flarum-ext-auth-keycloak.admin.keycloak_settings.encryption_key_label')}</label>
        <input className="FormControl" bidi={this.setting('spookygames-auth-keycloak.encryption_key')}/>
      </div>
    ];
  }
}
