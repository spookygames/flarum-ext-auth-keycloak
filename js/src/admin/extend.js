import Extend from "flarum/common/extenders";
import app from "flarum/admin/app";

export default [
  new Extend.Admin()
    .setting(() => ({
      setting: "spookygames-auth-keycloak.keycloak_version",
      type: "text",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.keycloak_version_label"),
      placeholder: "21.1.1",
    }))
    .setting(() => ({
      setting: "spookygames-auth-keycloak.server_url",
      type: "url",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.server_url_label"),
      placeholder: "https://keycloak.example.com",
    }))
    .setting(() => ({
      setting: "spookygames-auth-keycloak.realm",
      type: "text",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.realm_label"),
      placeholder: "my_realm",
    }))
    .setting(() => ({
      setting: "spookygames-auth-keycloak.app_id",
      type: "text",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.client_id_label"),
      placeholder: "flarum",
    }))
    .setting(() => ({
      setting: "spookygames-auth-keycloak.app_secret",
      type: "password",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.client_secret_label"),
      placeholder: "88a44c58-17c4-414c-85ed-4c56594131ba",
    }))
    .setting(() => ({
      setting: "spookygames-auth-keycloak.encryption_algorithm",
      type: "text",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.encryption_algorithm_label"),
      placeholder: "RS256",
    }))
    .setting(() => ({
      setting: "spookygames-auth-keycloak.encryption_key",
      type: "textarea",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.encryption_key_label"),
      placeholder: "-----BEGIN PUBLIC KEY----- MIIBIjANsomethingIDAQAB -----END PUBLIC KEY-----",
    }))
    .setting(() => ({
      setting: "spookygames-auth-keycloak.role_mapping",
      type: "textarea",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.role_mapping_label"),
      placeholder: '{"ROLE_MEMBER":"Member","ROLE_MODERATOR":"Mods","ROLE_ADMIN":"Admin"}',
    }))
    .setting(() => ({
      setting: "spookygames-auth-keycloak.attribute_mapping",
      type: "textarea",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.attribute_mapping_label"),
      placeholder: '{"moniker":"nickname","badges":"badges"}',
    }))
    .setting(() => ({
      setting: "spookygames-auth-keycloak.delegate_avatars",
      type: "boolean",
      label: app.translator.trans("flarum-ext-auth-keycloak.admin.keycloak_settings.delegate_avatars_label"),
      default: false,
    })),
];
