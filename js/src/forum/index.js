import {extend, override} from "flarum/extend";
import app from "flarum/app";
import HeaderSecondary from "flarum/components/HeaderSecondary";
import SettingsPage from "flarum/components/SettingsPage";
import LogInModal from "flarum/components/LogInModal";

import LogInButtons from 'flarum/components/LogInButtons';
import LogInButton from 'flarum/components/LogInButton';

app.initializers.add('spookygames-auth-keycloak', () => {

    extend(HeaderSecondary.prototype, 'items', function(items) {

        // Replace login button with redirection to Keycloak
        if (items.has('logIn')) {
            items.replace('logIn',
                <LogInButton
                  className="Button LogInButton--keycloak"
                  icon="fab arrow-right"
                  path="/auth/keycloak">
                  {app.translator.trans('core.forum.header.log_in_link')}
                </LogInButton>
            );
        }


        // Simply remove signup button
        if (items.has('signUp')) {
            items.remove('signUp');
        }
    });

    extend(SettingsPage.prototype, 'accountItems', function(items) {
        items.remove('changeEmail');
        items.remove('changePassword');
    });

    extend(SettingsPage.prototype, 'settingsItems', function(items) {
        if (items.has('account')
            && items.get('account').props.children.length === 0) {
            items.remove('account');
        }
    });
});
