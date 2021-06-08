import app from 'flarum/app';

import KeycloakSettingsModal from './components/KeycloakSettingsModal';

app.initializers.add('spookygames-auth-keycloak', app => {
  app.extensionSettings['spookygames-auth-keycloak'] = () => app.modal.show(KeycloakSettingsModal);
});
