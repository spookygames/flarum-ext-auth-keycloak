module.exports=function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=8)}([function(e,t){e.exports=flarum.core.compat.app},function(e,t){e.exports=flarum.core.compat.extend},function(e,t){e.exports=flarum.core.compat["components/SettingsPage"]},function(e,t){e.exports=flarum.core.compat["components/LogInModal"]},function(e,t){e.exports=flarum.core.compat["components/HeaderSecondary"]},function(e,t){e.exports=flarum.core.compat["components/Button"]},,,function(e,t,o){"use strict";o.r(t);var n=o(1),r=o(0),a=o.n(r),c=o(4),u=o.n(c),i=o(2),p=o.n(i),f=o(5),s=o.n(f),l=o(3),m=o.n(l);a.a.initializers.add("spookygames-auth-keycloak",function(){function e(e){e.add("logIn",s.a.component({className:"Button LogInButton--keycloak LogInButton",icon:"fab arrow-right",onclick:function(){var e=$(window);window.open(a.a.forum.attribute("baseUrl")+"/auth/keycloak","logInPopup","width=600,height=515,top="+(e.height()/2-257.5)+",left="+(e.width()/2-300)+",status=no,resizable=no")}},a.a.translator.trans("core.forum.header.log_in_link")))}Object(n.extend)(u.a.prototype,"items",function(t){t.has("logIn")&&(t.remove("logIn"),e(t)),t.has("signUp")&&t.remove("signUp")}),Object(n.extend)(p.a.prototype,"accountItems",function(e){e.remove("changeEmail"),e.remove("changePassword")}),Object(n.extend)(p.a.prototype,"settingsItems",function(e){e.has("account")&&0===e.get("account").props.children.length&&e.remove("account")}),Object(n.extend)(m.a.prototype,"fields",function(t){return t.remove("identification"),t.remove("password"),t.remove("remember"),t.remove("submit"),e(t),t}),Object(n.override)(m.a.prototype,"footer",function(){return[]})})}]);
//# sourceMappingURL=forum.js.map