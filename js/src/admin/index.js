import app from 'flarum/app';

const settingsPrefix = 'spookygames-auth-keycloak.';
const translationPrefix = 'flarum-ext-auth-keycloak.admin.keycloak_settings.';

app.initializers.add('spookygames-auth-keycloak', app => {
  app.extensionData
    .for('spookygames-auth-keycloak')
    .registerSetting(
      {
        setting: settingsPrefix + 'server_url',
        label: app.translator.trans(translationPrefix + 'server_url_label'),
        type: 'text',
        placeholder: 'https://keycloak.example.com/auth',
      }
    )
    .registerSetting(
      {
        setting: settingsPrefix + 'realm',
        label: app.translator.trans(translationPrefix + 'realm_label'),
        type: 'text',
        placeholder: 'my_realm',
      }
    )
    .registerSetting(
      {
        setting: settingsPrefix + 'app_id',
        label: app.translator.trans(translationPrefix + 'client_id_label'),
        type: 'text',
        placeholder: 'flarum',
      }
    )
    .registerSetting(
      {
        setting: settingsPrefix + 'app_secret',
        label: app.translator.trans(translationPrefix + 'client_secret_label'),
        type: 'text',
        placeholder: '88a44c58-17c4-414c-85ed-4c56594131ba',
      }
    )
    .registerSetting(
      {
        setting: settingsPrefix + 'encryption_algorithm',
        label: app.translator.trans(translationPrefix + 'encryption_algorithm_label'),
        type: 'text',
        placeholder: 'RS256',
      }
    )
    .registerSetting(
      {
        setting: settingsPrefix + 'encryption_key',
        label: app.translator.trans(translationPrefix + 'encryption_key_label'),
        type: 'text',
        placeholder: '-----BEGIN PUBLIC KEY----- MIIBIjANsomethingIDAQAB -----END PUBLIC KEY-----',
      }
    )
    .registerSetting(
      {
        setting: settingsPrefix + 'role_mapping',
        label: app.translator.trans(translationPrefix + 'role_mapping_label'),
        type: 'text',
        placeholder: '{"ROLE_MEMBER":"Member","ROLE_MODERATOR":"Mods","ROLE_ADMIN":"Admin"}',
      }
    )
    .registerSetting(
      {
        setting: settingsPrefix + 'attribute_mapping',
        label: app.translator.trans(translationPrefix + 'attribute_mapping_label'),
        type: 'text',
        placeholder: '{"moniker":"nickname","badges":"badges"}',
      }
    )
    .registerSetting(
      {
        setting: settingsPrefix + 'delegate_avatars',
        label: app.translator.trans(translationPrefix + 'delegate_avatars_label'),
        type: 'boolean',
        default: 'false',
      }
    )
});
