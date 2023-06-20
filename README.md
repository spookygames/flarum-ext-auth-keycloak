# flarum-ext-auth-keycloak

Keycloak OAuth Flarum Extension

Allows users to login/logout using Keycloak.

## Installation

To install, use composer:
```
composer require spookygames/flarum-ext-auth-keycloak
```
## Usage
* Install extension via Composer / Packagist
* Enable extension in the admin/extensions of Flarum
* Fill in the settings field for the extension
* Make sure signup is Open in admin/permissions ([here's why](https://github.com/spookygames/flarum-ext-auth-keycloak/issues/22))

## Keycloak setup

Written for Keycloak version 4.8.3-final, tested up to 13.0.1, and Flarum 1.3.0. Your mileage may vary.

From the _Clients_ tab, add a new client for your Flarum instance (or use an existing one). Root URL should be the URL of your Flarum instance.

![Add Keycloak client](https://github.com/spookygames/flarum-ext-auth-keycloak/raw/master/images/keycloak-add-client.png "Add Keycloak client")

In order to map Keycloak roles onto Flarum groups, you have to make roles visible from the userinfo endpoint. To this extent, add a mapper to your new client.

![Create Keycloak mapper](https://github.com/spookygames/flarum-ext-auth-keycloak/raw/master/images/keycloak-create-mapper-1.png "Create Keycloak mapper")

![Add role mapper to Keycloak client](https://github.com/spookygames/flarum-ext-auth-keycloak/raw/master/images/keycloak-create-mapper-2.png "Add role mapper to Keycloak client")

From the _Realm Settings_ tab, find the key used by the OpenId Connect workflow (by default, RS256). Copy the algorithm as well as the public key.

![Find Keycloak keys](https://github.com/spookygames/flarum-ext-auth-keycloak/raw/master/images/keycloak-find-keys.png "Find Keycloak keys")

## Extension settings

In the end, extension settings will be:
* Server URL: the URL to your Keycloak instance, like https://keycloak.example.com/auth. Beware the "auth" with no trailing slash.
* Realm: the authentication realm you created for your Flarum.
* Client ID: the name of the client you created above.
* Client Secret: defaults to client ID if you do not override.
* Encryption algorithm: defaults to RS256.
* Encryption key (or cert): you may copy here the content of what was displayed after you pressed the "Public key" button on Keycloak.
* Role-to-group mapping: An associative array with roles as keys and group names as values, in JSON format. Example: `{"ROLE_MEMBER":"Member","ROLE_MODERATOR":"Mods","ROLE_ADMIN":"Admin"}`.
* Attribute mapping: An associative array with Keycloak attributes as keys and Flarum User attributes as values, in JSON format. Might be used for other extensions. Do not forget client mappers on Keycloak! Example: `{"moniker":"nickname","badges":"badges"}`.
* Delegate avatars: if enabled, the "picture" attribute from Keycloak will be used to handle user avatar instead of Flarum's default behaviour.

## Troubleshooting

### User created with an odd name that does not match actual user name like 'tgtplwexeowwluxnqid4cjgw' ([original issue](https://github.com/spookygames/flarum-ext-auth-keycloak/issues/21))

Flarum only allows user names that match the regular expression `/[^a-z0-9-_]/i`.
Every Keycloak user with a "preferred_username" not matching this expression will instead be assigned a random name, as well as a proper Flarum "nickname".
In order to see the nickname instead of the random user name, activate the Nicknames extension and use the User Display Name driver named _nickname_.
