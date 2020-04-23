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

## Keycloak setup

Written for Keycloak version 4.8.3-final, your mileage may vary.

From the _Clients_ tab, add a new client for your Flarum instance (or use an existing one). Root URL should be the URL of your Flarum instance.

![Add Keycloak client](https://github.com/spookygames/flarum-ext-auth-keycloak/raw/master/images/keycloak-add-client.png "Add Keycloak client")

In order to map Keycloak roles onto Flarum groups, you have to make roles visible from the userinfo endpoint. To this extent, add a mapper to your new client.

![Create Keycloak mapper](https://github.com/spookygames/flarum-ext-auth-keycloak/raw/master/images/keycloak-create-mapper-1.png "Create Keycloak mapper")

![Add role mapper to Keycloak client](https://github.com/spookygames/flarum-ext-auth-keycloak/raw/master/images/keycloak-create-mapper-2.png "Add role mapper to Keycloak client")

From the _Realm Settings_ tab, find the key used by the OpenId Connect workflow (by default, RS256). Copy the algorithm as well as the public key.

![Find Keycloak keys](https://github.com/spookygames/flarum-ext-auth-keycloak/raw/master/images/keycloak-find-keys.png "Find Keycloak keys")

In the end, extension settings will be:
* Server URL: the URL to your Keycloak instance, like https://keycloak.example.com/auth. Beware the "auth" with no trailing slash.
* Realm: the authentication realm you created for your Flarum.
* Client ID: the name of the client you created above.
* Client Secret: defaults to client ID if you do not override.
* Encryption algorithm: defaults to RS256.
* Encryption key (or cert): you may copy here the content of what was displayed after you pressed the "Public key" button on Keycloak.
* Role-to-group mapping: An associative array with roles as keys and group names as values, in JSON format. Example: `{"ROLE_MEMBER":"Member","ROLE_MODERATOR":"Mods","ROLE_ADMIN":"Admin"}`.
