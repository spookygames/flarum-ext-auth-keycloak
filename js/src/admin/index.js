import app from 'flarum/app';

import KeycloakSettingsModal from './components/KeycloakSettingsModal';

app.initializers.add('spookygames-auth-keycloak', () => {
  app.extensionSettings['spookygames-auth-keycloak'] = () => app.modal.show(new KeycloakSettingsModal());
});
