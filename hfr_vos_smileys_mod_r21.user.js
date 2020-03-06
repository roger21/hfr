// ==UserScript==
// @name          [HFR] Vos smileys favoris mod_r21
// @version       3.0.0
// @namespace     roger21.free.fr
// @description   Permet de gérer une liste illimitée de smileys favoris.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    fred82
// @modifications corrections, améliorations, nettoyage, évolutions, compatibilité, réécriture
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_vos_smileys_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_vos_smileys_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_vos_smileys_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.openInTab
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1714 $

// historique :
// 3.0.0 (07/03/2020) :
// - refonte complète / fresh restart

/*

format de stockage des smileys en JSON :

{

  "[:roger21:2]":                 // code du smiley
  {
    c: "[:roger21:2]",            // code du smiley (string)
    s: 2,                         // nombre de fois utilisé ou 0 (number)
    d: 20191229154525,            // date YYYYMMDDHHMMSS ou 0 (number)
    f: true                       // favori true ou false (boolean)
  },

  ":D":                           // code du smiley
  {
    c: ":D",                      // code du smiley (string)
    s: 5,                         // nombre de fois utilisé ou 0 (number)
    d: 20200102070910,            // date YYYYMMDDHHMMSS ou 0 (number)
    f: false                      // favori true ou false (boolean)
  },

  "[:rhaegal:1]":                 // code du smiley
  {
    c: "[:rhaegal:1]",            // code du smiley (string)
    s: 0,                         // nombre de fois utilisé ou 0 (number)
    d: 0,                         // date YYYYMMDDHHMMSS ou 0 (number)
    f: true                       // favori true ou false (boolean)
  }

}

format d'import/export des smileys en JSON pour la rétro-compatibilité :

{

  "[:roger21:2]":                 // code du smiley
  {
    c: "[:roger21:2]",            // code du smiley (string)
    s: 2,                         // nombre de fois utilisé ou 0 (number)
    d: "2019/12/29 15:45:25",     // date "YYYY/M/D H:M:S" ou "1970/1/1 0:0:0" (string)
    fav: true                     // favori true ou absent (boolean)
  },

  ":D":                           // code du smiley
  {
    c: ":D",                      // code du smiley (string)
    s: 5,                         // nombre de fois utilisé ou 0 (number)
    d: "2020/1/1 7/9/10"          // date "YYYY/M/D H:M:S" ou "1970/1/1 0:0:0" (string)
  },

  "[:rhaegal:1]":                 // code du smiley
  {
    c: "[:rhaegal:1]",            // code du smiley (string)
    s: 0,                         // nombre de fois utilisé ou 0 (number)
    d: "1970/1/1 0:0:0",          // date "YYYY/M/D H:M:S" ou "1970/1/1 0:0:0" (string)
    fav: true                     // favori true ou absent (boolean)
  }

}

*/

/* -------------- */
/* options en dur */
/* -------------- */

// affichage des mots-clés dans le title/tooltip des smileys (true) ou dans un tooltip/popup en html (false)
const in_title = false;

// activer les box-shadow (true) ou pas (false) sur les tooltip et popup des mots-clés
const box_shadow = true;

// ajouter une espace finale dans la popup d'édition des mots-clés (true) ou pas (false)
const add_final_space = false;

/* ---------------------------- */
/* gestion de compatibilité gm4 */
/* ---------------------------- */

if(typeof GM === "undefined") {
  this.GM = {};
}
if(typeof GM_getValue !== "undefined" && typeof GM.getValue === "undefined") {
  GM.getValue = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_getValue.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
if(typeof GM_setValue !== "undefined" && typeof GM.setValue === "undefined") {
  GM.setValue = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_setValue.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
if(typeof GM_openInTab !== "undefined" && typeof GM.openInTab === "undefined") {
  GM.openInTab = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_openInTab.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}

/* ---------- */
/* les images */
/* ---------- */

var img_star = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAYAAAB3AH1ZAAADi0lEQVR42p1U7UuTexi2D%2FYlKYy5%2FOBRO2JmKJwOHjjG6UMH5ETv9kZCnwqF8KCiNHUWTqdr6aaJOme6Sl22NV%2FO1G0eNt%2FPWbOtNiE59CGE6g9oEARBXef6TQpsL6QPXDzb87svrvu57ut%2B4uJiXHBKpMT2uC1e3d3d0q6urq3xYZPugG33e0zu7tsKX6fT7Whra3tP9G2tAUuiBv5fgL9TAYvkh83ym5ubNdPT0%2Bjt7UVra%2Bvm%2BDBJ4mGSvsXaaWC1ADAmmjfDV6lU8Wq1%2Bu3q6io8Hg8aGhrMm2tgSFoE92%2FAyjHgv1PAaHqQDUm%2Bl9%2FU1FTkcDiwvLwMv9%2BPzs7OIBuKzIduTzwGky9jaI8WD5I8MEhewJL5Ab7jwFPCdwJw%2Fw7cT3qFgaQVDEqHWatAX3Ke4NfX18dT8DIt1zY2NnoUCsULhu%2BD2%2B3G0tISxH1mZka48EqpVK6wdphgmSJvvYGJ1MMY4Jxt%2BYC%2FEHh%2BDlg%2BA%2FxzYh3%2FngSe0IVnZ%2BnIeWCOzYwcBEwpn%2BBIlzDlhzljWCwW%2BHy%2BEITtCwsLWFxcDEE04vV6EQgEYLPZYDAYoNVqP%2Bn1ekkczGkJeJT%2BGnZa7qTYjMCpcMwSLp65eJ%2F8GXiUdkO8QHt7ewLxenR0NPSms7OzmJubC7sLfDk3Go3gdtzYOApD2ktM%2FQHY6YLjTDjsDKSN%2BOsQYEhVRQjey4mJCTidzjC4XC6IjRC5MJlM4LhUEYK3fxdup6%2Fh4VGKnA3HGBvro0s9GcpIWero6Ngll8vXzGZzSOhb2O120HIhroye%2Frq9BWhnFh6fC4flAnAz602s9FdUVBRwHKE5T01NfYX4L1BdXf0m9vpV%2FXgHHUe49xQbYuAGKDx4fv33MJ%2Bp8xGLX1paeodfQIhRjI%2BPY2xsLASr1Rp6JsIau4E%2F9wagZ8geXKQwxa2XKEz7jUXAPTZxiyOQZeZF45eUlAREwL4Ii9AJcfH2IyMj0Gg0KCsry4vewLWMj7BcBXT8%2Bil%2FCkKeWYi6rB6o%2BUm2XmEDXMHrWXXR%2BMXFxR%2Fn5%2BfR398P7nmwqqqqUCaT9TCgoXUU46msrIzMhzxnJ%2Bpygrj16zvUHNBvPMvdB1mWlyP4zJq7kfg1NTU7a2trgy0tLe8ouoHPcO6jsJcOfGbN3egO1OZk4Pr%2BlIhnlbnbIMvOZk1CND5DlsEgRuSXl5dvoyPZrNnA%2Fx%2BzI%2BiAcKxsLQAAAABJRU5ErkJggg%3D%3D";
var img_fav = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABcklEQVR42mNgGDTghost4y1THb87Ztor71rpz7xlpmMKk7tlrmd810pvBlBuxS1jbf8bDpZMGAZcszOdf8VY%2Ff9FbaX%2FF7UU%2F18xUvt%2F09cl5pa%2Fe9QVQzWw2CVtoDhQzTUbo0Uoms%2FZmged1lH6f1xR%2Bv9xJShWkPp%2FxkDtIwiD2HBxoBqQ2nPWJqFwAw5qKXbuV5H5v09ZGhUrQTGaOEjtAU2FbrgBu%2FQ0qrcqSP7fBlRMDAap3aWrVgc3YLeLvdk6ecn%2F64DOIwavBard5WhrhRIOa031Fy%2BRFfu%2FTFEKLwapWWOkswwjFnbFRQovUFe8MUdO4v9cYKBhwyC5BRpKt3bGRohiTQt74qKUpipIvZ0iJ%2Fl%2FirwUGpb8P1Ve6vWe2AgVvAlqlpmhxnQV%2BXsTgBp6oHgC0PbpqvIPphloqxGVKl3FRfhL5CS3dgM1gnCJrOR2L2kJAZKSNlCDvLewwHIgXgFik5U%2FQBrJ1kwsAAC8lOiuvmntngAAAABJRU5ErkJggg%3D%3D";
var img_fav_plus = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACFElEQVR42mNgoAdgZmYWZmVlzQFhFhYWYayKbrjYMt4y1fG7Y6a98q6V%2FsxbZjqmMLmypMS1d%2B7c%2BX%2Ft2rX%2F5VGR2284WDJhGHDNznT%2BFWP1%2Fxe1lf5f1FL8f8VI7f9NX5eYW%2F7uURP9vf%2BfOnXq%2F5EjR%2F73%2BXr8v2ZjtAhF8zlb86DTOkr%2FjytK%2Fz%2BuBME7ZCX%2Bd%2Fh4%2FOwE4pqkxP%2B7d%2B%2F%2Bv23btv9lMdH%2Fm5zs%2Fqd6ee5mY2ODeOeglmLnfhWZ%2F%2FuUpeE4X0zo%2F759%2B%2F5v3779%2F8aNG%2F%2BvWbPm%2F7Jly%2F4vXLjw%2F5w5c%2F7PmDHjPwcHRy7YgF16GtVbFST%2FbwPaDMPZQAPWr1%2F%2Ff%2Fny5f8XLVr0f%2B7cuf%2BnT5%2F%2Bf9KkSf97enr%2Bd3Z2IgzY7WJvtk5e8v86oBdgeIGc5P9iW2swTg3w%2F9%2FX1%2Fe%2Fo6Pjf5ynx%2F9sU6P%2FfvZ2W4AGiMLDYa2p%2FuIlsmL%2FlylKYWCQhvr6%2Bv%2BVlZX%2F0%2FV1%2F68x0lmGEQu74iKFF6gr3pgjJ%2FF%2FroIUCk7S1%2FlfWFj4Pzs7%2B3%2BMge6HnbERoljTwp64KKWpClJvpwCdP0VeCo47gTESISr0P0xU6EuVnbUJ3lQ3y8xQY7qK%2FL0JwDDpgeIJQFdMV5V%2FMM1AW42opOsqLsJfIie5tRuoEYRLZCW3e0lLCJCU%2FoEa5L2FBZYD8QoQm6xMBNJItmZiAQB4ogWPlqwaKAAAAABJRU5ErkJggg%3D%3D";
var img_fav_conf = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACYklEQVR42mNgGDTghost4y1THb87Ztor71rpz7xlpmMKk7tlrmd810pvBlBuxS1jbf8bDpZMGAZcszOdf8VY%2Ff9FbaX%2FF7UU%2F18xUvt%2F09cl5pa%2Fe9QVQzWw2CVtoDhQzTUbo0Uoms%2FZmged1lH6f1xR%2Bv9xJShWkPp%2FxkDtIwjvAIovV5b9vwskD8QgteesTULhBhzUUuzcryLzf5%2ByNBzvVZL6v0VB8v8iGbH%2FpUkJ%2F2fNmvU%2FwtPj%2FzZFyf%2BbgHiPulw33IBdehrVW4GKtwFtBmGQxgkqcv8rvD3%2FF3m6%2F1%2B7YsX%2FW7du%2FZ85Y%2Fr%2FMhen%2FyWuzv9ztTXWwA3Y7WJvtk5e8v86oPNAeKWSzP%2FcmOj%2Fhw4d%2Br9%2F%2F%2F7%2Fmzdv%2Fj950qT%2FO3bs%2BL9q1SowLikoeAbUKg83ZK2p%2FuIlsmL%2FlylK%2FV8IxCnurv83bNjwf%2F369f8boiL%2Bt%2Bhr%2F090c%2Fm%2FdevW%2F8uXLfvv4%2BNzAqhNFuGNuEjhBeqKN%2BbISfyfCwzADg3l%2F01NTf8nTpjwv1ZXCywWL8gHDos5c%2Bb8AGrJxojKPXFRSlMVpN72y0n%2BD3J2%2Fr8MaNOSJUv%2BRzk6%2FI8R4v%2FvqK%2F3Z%2FHixf%2BnTZv239vb%2BzZQiyaGIbPMDDUmqcg%2FiPDyBDsfZMiiRYv%2B9%2Ff3%2F587dy5Yc19f3%2F%2FExMT7KGGADFzFRfhDZSVPOhsb%2Fvexsvzf0tz8D%2Bjs%2F9XV1f%2BNjIzOWFlZXeTi4srAm7S9pCXkvYUFlrsI8q0NCQ4%2BV1lZ%2BcPU1PQKshpZWVkmgoaAMA8Pj6u0tHQBCwuLA9UzIQBlLSZyIabkGgAAAABJRU5ErkJggg%3D%3D";
var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var img_reset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";
var img_info = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";
var img_conf = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA5ElEQVR42qWTSw6CQAyGB8Jel%2BMB4DK6NeoJOADjAZR4ItyCCbDxTCywk%2FwlpYFk1CZfMulr2pnWmHXZETWwJkAiIiFinK%2FEABx0MXyipeCc6IkH8SRGRQVbD99ZEp%2B1UwENcQIvZWsRM4kvrYTxTaTqBn%2FOYPM%2BN8TMHLjsVOg3gCUT7UwXWDwYl82Gg%2FiFvbiI23H8OzVeekS%2FXraq7wY6L0foBsTOElwCEpx1Aotyvm2hkAP2yyOaf77xrr8xwYSFDlKnB4lHuUUl1coolwjO1%2FZBLpMTy1SIVheXaUlsyDp%2FAAuRYD49hpMKAAAAAElFTkSuQmCC";
var img_up = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAASklEQVR42mNgwA8agLiDgUwA0vwfijso0UyyIdg0E20IsuZ6JHY5sYaUI2lmQNKETQ4nsEdiIxuALkcUQDeAYdSAwQ7%2Bk4ipYwAAyd1CTxfHBGwAAAAASUVORK5CYII%3D";
var img_down = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAARUlEQVR42mNgQID%2FJGIMQLEBgxNQ7NyRaoA9HgPsCWlugGrowGIAuhxeA%2F4TYOMF5XiSbz2x4VBOiWZshtSTG40NhPwMAPJ2QjcfNuJcAAAAAElFTkSuQmCC";
var img_button = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAAIElEQVR42mOYiQcwzPyPE4Akz%2BACo5KjkoNXEm%2BKxwMAaetgI9c2CgEAAAAASUVORK5CYII%3D";
var img_throbber = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACGFjVEwAAAAYAAAAANndHFMAAAAaZmNUTAAAAAAAAAAQAAAAEAAAAAAAAAAAAB8D6AEAHV58pwAAAWlJREFUeNpjYMABREVFeYBgJQiD2AykAmZm5hYg9R%2BEoWz8QENDw1JRUXGPkpLSHCsrK16gpqlIBkz9%2F%2F8%2F1%2BbNmxu3bNkye9u2bXoomoGSjCDNQPwfhFVVVdO5uLgkgRqXgjBQidS%2BffuCgZpvAw25CcSzMVwAshmkWUFB4Z%2BysnIAujxQsyMQX4Ya0ojNFxxAQzKgmpnQJUGuhBoSeubMGVa4hIeHB7uLi0u5q6tre1RUlCChsAL6nw9oSAkQp69atYqNwc3NbbqTk9M3Z2fn30A8g5ABQOe3gLwBxNeBuJ5yA2BeAOJ2CwsLIZK9AAMgTlZWVmx2drY7KMCIDkQYAGruBeJ3QPwMiD1IjkagplWZmZmvgfh9RkZG7MyZM0WmTJnSCcI9PT0iQKeH4E1IeXl5xiBDoC7hmTZtWgVQ82MQnjx5ciXQ2biTMjYA1JQ9derUeyAMYpOcG3t7ezmBmltBGMTGpQ4AtqrwBlDMdgwAAAAaZmNUTAAAAAEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8Sqm5QAAAXpmZEFUAAAAAnjaY2DAAURFRXmEhYWXgTCIzUAq4OXlbeLi4voPwkB2I0ENRkZGFrq6ujv19PRmWVlZAfXwToIZwMPDM%2Fn%2F%2F%2F9cmzdvbtyyZcvsbdu26WEYANKsra39T0dH57%2B%2Bvn4qUKMkUOMSEAZKS%2B3evTsYqPk20JCbQDwbwwCQzSDNQPwTaJg%2FujxQsyMQX4YagukleXl5DqDGNENDQ7%2F6%2BnomdHmgFxihhoSeOXOGFS7h4eHBHhAQUBoYGNiSn58vQCisgP7nAxpSAsTpq1atYmMICgqa4u%2Fv%2F9HPz%2B8b0KCphAwAOr8F5A0gvg7E9ZQbAPMCELfa2NgIkuwFGABxKioqooHYDRRgRAciDJSXl3cD8SsgflRWVuZOcjQCNS4H4udAza9KS0uj161bJ7x48eI2EF64cKEw0OkheBNSVVWVEcgQoBe6srKyeJYsWVIG1HwfhEFsoLPxJ2V0ANSUAdR8C4RBbJJzIzBQOYEam0AYxMalDgDCHPiOgVAEawAAABpmY1RMAAAAAwAAABAAAAAQAAAAAAAAAAAAHwPoAQEcvHUMAAABbmZkQVQAAAAEeNpjYMABtLS0eGRlZReDMIjNQCqQkJCoFxUV%2FQ%2FCIDZBDTY2NuYWFhbbLC0tp%2Fv5%2BfGKi4tPEBMT%2Bw%2FCQEMm%2FP%2F%2Fn2vz5s2NW7Zsmb1t2zY9DANAms3NzX8B8V9ra%2BtkoCYJoCGLQJiLi0ty9%2B7dwUDNt4GG3ATi2RgGgGwGaQbir0DDfNHlgZodgfgy1JBGDAPk5eU5gBpTgLaDNDOhywO9wAg1JPTMmTOscInc3Fz22NjY4ri4uKb8%2FHwBQmEF9D8f0JASIE5ftWoVGwNQ48SYmJi3QPwJaNBkQgYAnd8C8gYQXwfiesoNQPaCt7e3IMlegAEQp7W1NQqIXUEBRnQgwgBQY0dLS8tzIL7f3NzsRnI0Ag1YAsRPQIY0NTVFAROOMMi%2FILxu3TphoNND8Cak9vZ2Q6ghHfX19TwgfwIV3gFhEHvTpk34kzI6AGpIh4b0dRCb5NwIDFROoI0NIAxi41IHAFxMAhn8b9WWAAAAGmZjVEwAAAAFAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfF2B3YAAAGfZmRBVAAAAAZ42mNgwAG0tLR41NXVF4AwiM1AKlBSUqpVUFD4D8IgNkz8%2F%2F%2F%2FjFg1uLm5mbm4uGwG4qmhoaE8QE19ioqK%2F0FYRUWlF6iEj5mZeTEQH%2BDg4LDBMACk2cnJ6buzs%2FMvoGFJ8vLyEkDNC0AY6AUJFhaWHJADQJiJiekohktANoM0A%2FEnoAE%2B6BawsbGFMjIygg0AumIJhguAzmQHuiAZpLm%2Bvp4Jiy%2BZgIaEAGmQS7jgorm5uexZWVmF2dnZDR0dHfyEAhfodIEdO3aUbNmyJX3VqlVsDECNfZmZma%2BA%2BD3QoAmEDNi8eXMLUPNtIL4OxPWUGwDzAtCABn9%2FfwFCBmzbto0PqBHhBSS%2FsU6bNi1iypQpztgSC0gMqMkRiEPPnDnDimEyUGMbED%2BePHnybaBBLujyUM2XQc4HeqMRmwELp06d%2BgBqSMTu3buFQf4F4XXr1gkDnR4C1XwTiGdjM8AAakhrd3c3N8ifQIV3QBjE3rRpExfIZiB7NtAwPYKZCaghHRrS10FsknMjMIQ5gTY2gDCIjUsdAEaa8bn5NffYAAAAGmZjVEwAAAAHAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARzg1J8AAAGgZmRBVAAAAAh42p2Tv0sCYRjHr8Dk7tLzx1B%2FgJN3XiCEQ1OOBf6qXK1JuJCW8AcRFbYJDm0iBqk4OEjo4eIQNLsFSSSNLUFL0BbX96mjzFMOe%2BHLfXnv%2FX6e53nhZZgpS5Zl3u%2F3V0jkmVmXz%2Bc7EkXxg0TeNBCNRlfD4fB1JBK5UBRlEaGCJEkaibzL5bJjXdlsthun07lmAFA4FAq9Qe%2BxWGzX6%2FUuI1ghBQKBJYT3eZ7XOI7TALnVNG3uD4AqUxigV3SzOV5AEIQtApCoE0MHHo%2FHCsAeqm8Y6N9rniAsyyrw3M9uKpWyZjKZg2w2e1wqlQSzuwLc0e12D1VVTTabzQUml8sVAHiGXtLpdNEM0Ol0zhF%2BhAbQyRcAwf8DRkdIJBIOMwDatyP4O8LIbJZGoxGvVqvBSZdIewitQzv9ft9iINdqtXy9Xn%2BC7gEKjv%2FXw3fUPsY4mwS4hIYEwTfe6%2FXcNC%2Bp1Wq50fq2Hn6AygYAWl%2FRIXl4nubEwSGJfLvd5qgyfBkw2fRtIJDUb3pAfubXiBtmUfGURH7auU%2FutPojzjsHHQAAABpmY1RMAAAACQAAABAAAAAQAAAAAAAAAAAAHwPoAQHxk%2BXDAAABg2ZkQVQAAAAKeNqlU79LAmEYvgINKzQM9bzZuSlQDhwSHBqL2rxrFIVwaYmCS7xTo6FZHdoFHfS4sf6B2xpEbGsIGhraWrqeh65fenJIHzx8D%2B%2F3Ps%2F7Az5BmHPy%2BfxaNpttE%2BTCoieTyZym0%2Bk3gtxXoCjKtqqqPeC6XC6vQ3gJvBOyLDej0WhYFMWbeDx%2BK0mSPGNQKBR6MHnB%2FQoTFcIEKreJXC6XgLgEsROLxRzcd47jLP0xYGWKgWfw3ekCMNinmGAnMx2kUqkVdHBE8Yz751lOJpN7MCiBh76jmqYFDcM4rtfrZ61WK%2BK3K5hHLMs6MU2z2O12g0Kj0Wjquv4IPMHoys9gOBzqEE%2BAEaD93%2BBrhFqtdl6pVDb8DNB%2BGMKfEX7NFkDwENjxWiJjfGOObdsBr9aqbmv3TJx%2Bd8V8mzDXy6ADjJmANg%2F6%2Ff4m5yXIGXPFY%2BZ6zbaFBJpUB4PBKucEfyDIGXO77DDX929AUHQ3PSJf%2BDdiwyFUvCDI5%2BV9ABJsBKxZnW%2FPAAAAGmZjVEwAAAALAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARwFNioAAAGKZmRBVAAAAAx42qWTu0%2FCUBjFW4mi2ODga%2BSdMLk4OcrLjpLgZlwJz8nEMCHx1YXFAprgbuzAAISp%2F4WDIZg4mLiY6OZiYj0nFgYKAeJNfunX755z7qOpIIwZ0Wh0ORaL3RDWwqwjEomchEKhL8J6oiGfz2%2Bn02kNlIvFogTTVTgc%2FiaoL%2F1%2Bv9Pr9d55PB49GAzuWAJoTqVS7%2BAzm80eYuVNGG9JPB7fgDkJs2GiG4YhDgeUwQd4A%2FLwAj6fb9%2Ftdv8wgDux7ECWZTtWP8pkMnuW9L8xx5BAIJDM5XL2QVfTtAVVVTPVarXQ6XScU9zvms1muwZnLpdrUYDxolKpvIDXWq2mTHLDeI%2BHQSRJevh%2FQP8IoKAoysoUR1gXRVEdHKE%2FcHHz7Xb7AOyOukT2OKfregK1wxLbarVKEPTAI4XD8%2ByZcz1qRwXUQZcCfI1Eo9FYxfs5Yc2eae5SawmAYAsChpSazaYD9THqZ8KaPXOXdWon3hQMSYifCOuZ%2F0Z8nSWseEpYj9P9AmHJ8O96azpYAAAAGmZjVEwAAAANAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfHPRFAAAAGYZmRBVAAAAA542pWTv0sCYRzGLeiHp95y5OrooJ56U2uD5ZQ%2FsKlb%2B7G41Z24mCENORW15KZW4OCgIgT%2BAQ5uDWEGQUvg1hQtXc8DKuQp6gsf%2BN73%2BzzPe%2B97nMUyZamqaovH4zeEtWXRFY1GTyORyBdhPdOQTqcVXdcfU6nUZT6ft8GYA98kFovl3G63Q5blO5%2FP96QoyqYpgGbwqWlaHyH7oVDIiZ1vCY7ghPHA6%2FUaHo%2FnlyGmAO6MgD74QMjO%2BDwQCEQQ8MMQvokpIBwOr8GsImjbMIyl8Xkmk1kOBoO7fr%2F%2FMJlMro0GlUpltVwuHwOt3W6Lc9yvJIrilcPhyLpcrnULjOelUukVvIOLWW4Y7wVBMIgkSQ8LB9jt9v8BwyMUi0UdAfMcYQMh16MjDFen01lpNBp7YGvSJbLHWavVSqC2mmLr9XoWgh54pnB8zt5g1qN2UkABdCloNpuJarUq4TlHWLM3MHepNQVAIEPAkGytVhNQn6B%2BI6zZG7xlgdqZNwXDEcQvhPXCfyO%2BjhU7nhHW03R%2FhFP4ipu3x5gAAAAaZmNUTAAAAA8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHFmXuQAAAYZmZEFUAAAAEHjapZOxSwJxFMevIEvjXOzyFvE%2FCJpOT5eG2hoEbyjUSXRyyt0uz1NwKRoa3KrJwUHlwP%2FAwa1BpKAlaGoJWoK4vl84g7yTS%2FrBBx7v977fe%2B%2FdnSAsOaVSKVQoFK4IY2HVk8%2Fnz3K53Bth7CtoNpv7jUbjHrTa7fY2hBfgnaALXVVVMZlM3iQSCSudTisuA0f8YhjGq2maJ5lMZhdPviaVSkWCsKgoyhf4pImXQYti8Fyv148W71Op1DHEHzRhJy4DTdMCMDkFh7Ztr3lMuU4TjFJER5s%2F2W63GxgOh2XLsqrj8TjstytRFCPRaPRSluVaPB7fEiCugSl4HAwGhp8BxLeSJNkkFovd%2Fd9gPgKoYozwHz6RnV8jzM9kMtmAiQYOvJbIHO9Go1EWcdBli%2FZ1jgEeWLh4z5xzx1F1L4MOmLEAo2R7vV6EOyGMmXPEM9a6DFCwhwKa6P1%2BP8SdIH4ijJlzuuyw1ndTEJSdtzNlvPLfiLcTxBPPCeNldd%2BFTAEoC6ckLQAAABpmY1RMAAAAEQAAABAAAAAQAAAAAAAAAAAAHwPoAQHwWCCpAAABqGZkQVQAAAASeNqlkz9IAnEUx%2B9Ou06jAsXFxb%2FgFk0h0pInTo0eteqgaN4Qubh0CtVYgZ4ILWlNDg4q4tgSOLg1SNgQtrUELUHL9X2QBd7JET34cI979%2F2%2B33s%2FjmEWRDqdtudyuQuCcuavAeFhNpt9JSg3FVSr1U3QUFX1tNlsrkBYAm9EPp9XIpHIaiwWU0E3Ho9vGRmQ%2BBnPl3q9vpdMJl3ofEkUi0WXKIop8BmNRj%2FIxMjgjMSVSmVSq9Vi83V03YXBO5nQSXQGkiTxEO%2FDRNQ0jZ2vK4rCkQlIybK8%2FFNotVp8r9fL9Pv9wnA4XDPbldvtdvr9%2FvNgMHjs8XgEBmIFjMGk2%2B2emBkEAoFrn8%2Bneb1eLRQKNf5vMBsBFDCG6QjhcNgBk98RZjEajZZgIoEdoyUiOJ7nE1ar9QC5TVfF8cs0Bnggk%2Fk6iVmW1ZBqFovl1sjgCjySCUZJtNttJ%2B2EmE6nDo7jZBITyO91p4RoA2IyKXc6HTvtBPkTMRgMjvDJOjrfgDtBELZN%2Fw2YZL5vZ0z57P2C%2FegDt2ND9xJB%2BaLvvgDI3vA4tCR%2FkQAAABpmY1RMAAAAEwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdzvNAAAABkWZkQVQAAAAUeNqlk79LAnEYxq8g8U7u5Kw2%2FwO14KCpQaqtA3%2F1Y3YTCmko%2FEHIJbYZDa5hkDo5SKiIW9DsFiSRNDi0BC1BW1zPA%2BagJ4f0hQ%2F33r33PO%2F3fb93gjBjGYYhZbPZImEszLvS6fRJKpV6J4xtBZVKZb1ard6CQrPZlCDMQfhBMplMLhQKyZFIpBQOh%2B%2Bj0ejGlMFIPKjVam%2B4HiaTyVWYXBO0sAJhHCbf4IsmVgYFisEz4p3JPKrqEH7ShDuxGpqDldHKtmmaC5N5PovFYrsgXq%2FXHeMEb9rtdgKcdTodxW5WXq%2FXEwgErsB5MBh0ChAaoA9eW63WpZ0BhGW%2F32%2F6fL4fTdPK%2FzeYtwVd11WYFMct%2FK1er7cEkwOwZTVErEW3272nKMoRYudUFtvPsw3wRJPJPMUul8skMLmzMrgBLzRBK%2FuNRmOZMyHD4dAjiuIxxZIkmbIsP07tEqI1iGmS56fMmSAekG63e8pNsDLED6qqbtr%2BGzBJjE6nz3juvxGnI6L6BWE8671fIqf6HRySx%2B0AAAAaZmNUTAAAABUAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ASBOgAAAWxmZEFUAAAAFnjaY2DAAerr67na29s7QBjEZiAVtLa25ra0tDwGYRCboIZt27bpbdmyZfbmzZsbz5w5wwXUWA3U%2BByE29raqkNDQ3ni4uL6gXhtbGysCYYBQI0gzTeBhtwGGhYCdLYIUHM3CPf09IjExMTEAfEnoOZ3QHotNgMaQZqB%2BDIQO6LLA232BGp8BTIE5BIMA4DOZgVqDAVp%2Fv%2F%2FPyO6PEgMZAjQBfGrVq1ig0uAOEBN6UBcAnQ6H6Gw0tLSEjI3N%2B%2B0sLCo9PDwYGcAaqwH4usg5wO90ULIAKDGWUAD%2FgHxT1tb21mUG0CqF6KiogQtLS0RXiA2EIGASVJSMlBCQiITyOYgORqBGoNERUX%2FgzCQPZ9gQlq3bp0wKExA%2BNGjR0LCwsKZYmJiYAOA9H4MVyIn5U2bNnGBwgTIvgPCQLkSoBJ%2BkM1AzfukpKSsCOYNoCHp0Ni5DmKTnBuBscMJtL0BhEFsXOoAUt0FcAi6YW0AAAAaZmNUTAAAABcAAAAQAAAAEAAAAAAAAAAAAB8D6AEBHZJS0wAAAXNmZEFUAAAAGHjaY2DAAXp7ezmnTp3aCsIgNgOpYPLkydlAzfdAGMQmqGHbtm16W7Zsmb158%2BbGM2fOcAE1VU6ZMuUxCE%2BbNq0iKyuLB4h7gXhVXl6eMYYBQI0gzTeBhtwGGhbS09MjAtTcCcIzZ84UycjIiM3MzHwPxK9BhmAzoBGkGYgvA7EjujxQkwcQPwPidyCXYBgAdDYrUGMoSPP%2F%2F%2F8Z0eVBYtnZ2e5AzbGrVq1ig0uAOEBN6UBcAnQ6H6GwsrCwEHJxcWkH4nIPDw92BqDGeiC%2BDnI%2B0BsthAwAapzh7Oz828nJ6Zubm9t0kg0AakY1gFQvREVFCbq6uiK8QGwgAgGTsrJygJKSUgaQzUFyNII0Kygo%2FFNUVPwPNGQO3oS0b9%2B%2BYKCQFDMz81IQ5uLiklRVVU0HaYbiPRiuRE7KQEkuoMapoOgHYRDbysqKF2QzSLOGhoYlwbwB1NSCZEALyblRVFSUBwhWgjCIjUsdAJsS8AnByX%2BOAAAAGmZjVEwAAAAZAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfDhY48AAAF5ZmRBVAAAABp42mNgwAFWrVrFuWTJkiYQBrEZSAVAjRmLFy%2B%2BBcIgNkEN27Zt09uyZcvszZs3N545c4YLqKkMqPk%2BCIPYWVlZPBUVFV3l5eXLq6qqjDAMAGoEab4JNOQ20LCQhQsXCgM1t4HwunXrhEtLS6PLyspeAQ14DjIEmwGNIM1AfBmIHdHlgZrdgRofAfErkEswDAA6mxWoMRSk%2Bf%2F%2F%2F4zo8iAxoEY3II4GBiobcmizATWlA3EJ0Ol8hMLKxsZGMCAgoBWISz08PNgZgBrrgfg6yPlAb7QQMgCocaqfn983f3%2F%2Fj0FBQVMoN4BUL%2BTn5wsEBga2wL1AbCDW19czGRoa%2Bunq6qbJy8tzkByNQI3%2BOjo6P4H4v56e3iy8CWn37t3BQCEpHh6eJSDMxcUlqa%2BvnwrSrK2t%2FQ9o2E68SRnoBS6gxslAjf9BmJeXd5KVlRUvyGaQZiMjIwuCeQOoqRHJgCaSc6OoqCiPsLDwMhAGsXGpAwBEpviQbN5BdAAAABpmY1RMAAAAGwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdd7BmAAABbmZkQVQAAAAceNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWrYtm2bHlDxbKCNjUANXEB2CZB9B4RB7Pr6ep7W1tYOIF7S3t5uiGEAUCFI802g4ttAw0LWrVsnDOS3gPDu3buFm5qaolpaWp4DDXgCMgSbAY0gzUB8GYgd0eWbm5vdgAbchxrSgWHAmTNnWIEaQ0Ga%2F%2F%2F%2Fz4guDxIDanQF4ihgoLIhhzYbUBMowEqATucjFFbe3t6CcXFxTbGxscW5ubnsDECN9dDQvg3yLyEDgBonx8TEfALit0CDJlJuAKleyM%2FPF0DxArGBCARM1tbWvhYWFiny8vIcJEcjUKOvubn5VyD%2Ba2lpOR1vQgImnGAuLi5JcXHxRSAsKioqAbQ9GaQZiH8BDduGNykDvcAF1DRBTEzsPwgDDZng5%2BfHC7IZpNnGxsacYN6QkJCoBxryH4RBbJJzo5aWFo%2BsrOxiEAaxcakDADqJAhkT68NIAAAAGmZjVEwAAAAdAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfC9whwAAAGhZmRBVAAAAB542qWTPUgCcRjG7049zcQEFzc%2FEASHaGpqyTucAhcPnGsIv4bANVSoEKQI%2FFhajJocHDwRwaWlza0hwoagrSVoCVqu54EiuVNE%2BsODz93%2F%2F%2FzufV%2FvBGHB6na7a7quVyh6YdXV7%2FcPB4PBI0W%2FNDAcDjdx%2BApPrCLghi%2FBP1P09Xp9vdVqnTabzWtoywLAQYafcHgKWLrX6%2FlxfUKNx2N%2Fo9HIIPgKyAsh8wBVhqEHaNe83263VUCmhEBnFsBkMnEgqDFsGIZo3uc9BBWAMvCO2WnLCHFgJZTuXTarVCrly2azlVwud1QsFp0CguWfaU%2FZ7zIAgpcAvENv%2BXz%2B4v%2BA3xZGo1EJvfmWAWq12gaCfy3MLDdUkGU5jV%2FJHCyXy1IymdxLJBIH0WjUaSHbbLZbDlsURQMQzbzPsKIoH9CXqqoty18kSdI9LWW32wvxeDwQDoc7VDAYDACwzzAq%2BARAt1Tgcrl2UMUddINLL8o8R9igIpHIhaZpHj6ZYcC25w5o9gVC6DgUChkU%2FcpfI1rwxGKxDkW%2F6Nw37k3xuSzoMScAAAAaZmNUTAAAAB8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHSsR9QAAAZ9mZEFUAAAAIHjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlq2LZtmx5Q8WygjY1ADVxAdgmQfQeEQexFixZxL168uBmI5wHZ%2BhgGABWCNN8EKr4NNCxk3bp1wkB%2BCwjv3r1bGKgxbMmSJfeA9B2QIdgMaARpBuLLQOyILr9s2TInoAHXoIY0Yxhw5swZVqDGUJDm%2F%2F%2F%2FM6LLg8SATncCGhQGZLMihzYbUBMowEqATucjFFbx8fECFRUVteXl5fm5ubnsDECN9dDQvg3yLyEDysrK%2BoCaXwPpZ5WVld2UGwDzAtD5JUC%2FCRAyYObMmfwoXkACXJycnFn8%2FPzBQDYTtkAMCgry8vPzS1RRUWHHMJmPj28hNzf3fxCGGoICAgMDvf39%2Fd8BDfgWEBAwCcN0Xl7eQ1xcXGADgIZlm5ubi%2Bvq6s4FYS0tLQmg7QkgzUD8GWjQBgwXCAoKWgMN2Q9yiZCQEB9QY7eOjs5%2FEAaxs7KyeEA2gzQDXWNKMG8ANVVra2v%2FBWEQm%2BTcqKenx21kZDQXhEFsXOoAfEH6IOWuH2wAAAAaZmNUTAAAACEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB88%2BqfQAAAYJmZEFUAAAAInjapVOxSwJhHLVAwwoN40692bkpODlwSLihschNrzEUwsUlCi65OzUamrWhXdDhPBzrH7itIcK2hqChoa2l6z24QjzlkD543Lvf7733%2Fb4Pvkhkwer3%2B%2FHRaHRJkEeWXbZtnziO80SQhxrG4%2FEOxLfYsQnDOngD%2FIUgZ409aqgNBKBJ8zMEEwiOhsPhNv5Ngpw19qihdl4A0yfAI7A322fN7zGkGQhwXTeKZolCz%2FNWZvus%2BSEl8Oj0bcdQ5IU1MGYi7K7q9fqWYRgXlmWd6roe42i6f9sczQwLgPHaNM034LXdbnf%2BH%2FB7BIzfwNmSYQHdbjfZarXO%2F44wteKCIFSz2ewB%2BOq8S9Q0bb9SqRzncrm1QHImk7lDgEeAH872aS6Xy%2B%2FAJ%2FhNIF0UxQea8WVAtVgspvP5fI%2BQZTkNk0YzJvjAdxCYQJIkBeZ7TpJKpRKKonRg%2FPZxVavVNrkzMEDIbujbwM5nMH4R5Eu%2FRlVVNwqFQo8gX6T7AfzqBKx3VEm7AAAAGmZjVEwAAAAjAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR5ZeZQAAAGNZmRBVAAAACR42qWTvUsCYRzH75Ky7LCht1E9FZxamhp9ObsxobZoFT11CqLJpLdbWjq1oPboBgcVp%2FsvGiIMGoKWoLaWoOv7BS3qlEt64APf5%2Fn9ft%2Ff88IjCEOGaZpTrVZrj1ALo45ms5ltt9u3hNq1oNPpLCH5Ah0rKPBBb0PfE2quMcYc5joMEGTxHRK6SFhvNBqzmB8Qaq4xxhzmDjKgexfcgPjvONd6MZpUHAa2bfssy2KXOLQ4IC72TDagx78CgUBg0uPx7IuiaGA673ZXuq7PGIaxCzS8zoQgSZLJBgRGV24G9Xpdr1arj%2BChVqsd0uD6Xwb9I4BTxOf%2B8Nx%2BFH4foT%2BKxaI3Go1mw%2BHwGqZjgy5R07TVXC63paqq1%2BEsy%2FJlKBSyg8HgR8%2Fkx8jn8yp4Ai%2FgxOGOYosGBGbZTCazkEqlzkkikVgsFAqb6P4KnmFgOnYQi8VWaMKdRCIRPwqPksnkO4E%2BLpfLEjuzuFQqLbv%2BDRTtoPMboR75NyqKMp1Op88I9bC8T5%2BU8PAz88iaAAAAGmZjVEwAAAAlAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfOTC%2B4AAAGWZmRBVAAAACZ42qWTu0%2FCUBjFwcQHhXZpZGVkAMpjcmVAmSwQnezqY2FTSlgQQxxk0uiiG6AmDAxASEz4AxjYHIxiYuJiwuZkXKznJMBAIZV4k5Oce8%2F3%2FW7vba7NNmPUajVHs9k8puht845Go7HfarWeKHrLhna7raD4BjsW0CDAH8K%2FUvRcY8Ya1poACNn8jII%2BCrbq9bqMeZGi5xoz1rB2GoD0PvQIRSdzrg0zQgomgGEYjk6nw12i8PYpuX0I2e71eovjwOPxrIiiWHC5XBeYrlrdVaVSkcrlsl6tVg%2Fwd5ZssizfCYJgUIDc%2FgFwCr1BL4Cc%2FB8wOoIkSefIZStAt9uV0JgZH2E00un0cjAY3AuHw5v5fH5h2iVms9l1Xde1eDy%2BbCIrinLt9%2FsN6DsUCqmTeSaT2UDzOzQA6MwECAQCDz6f74cQ%2BF1N09yJROKKisVibjTtADIA4AO6NwEikcgaIfwSr9crJpPJoqqqX0MVS6WSkzuzOZfLRSzfBnY%2BQuMnRT%2F3a8QRnKlU6pKin1X3C2Zv%2BIepEdLNAAAAGmZjVEwAAAAnAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR4F2AcAAAGGZmRBVAAAACh42mNgwAFWrVrFuXnz5gYQBrEZSAWbNm1K37Jly3UQBrEJati2bZseUPFsoI2NQA1cQHYJkH0HhEFskBhIDqQGpBbDAKAkSPNNoILbQAUh69atEwbyW0AYxAaJgeRAakBqsRkAMv02EF8GYkd0eZAYVA5kSCOGAf%2F%2F%2F%2BfcuXMnyBZHIJsRizwj1JDQM2fOsMIl5OXlOSQkJOpFRUUnALkiRIQVHyhMgDgdGDtsDLKysouBmv%2BDsLi4%2BCJCBoDCBOpVUAzVU24AzAtAzRN4eXmFCRlw4sQJPqA3EF6AgdzcXHYrK6sUa2trXyCXCVsgtra2ugJxVGhoKBuGyZaWltPNzc3%2FAvFXqCEooLm52a2lpeU%2BED8HGtKBYYCFhcU2oOZfIEOA7BSgi0RjY2Mng3BgYKBYW1tbJFTzEyBegmGAjY2NOcgQkEuAXuGNi4trjImJ%2BQTFTd3d3dwgm0Ga29vbDQnmDaDNxUCNb0EYxCY5N6alpXEBXTERhEFsXOoALlABImtNWOoAAAAaZmNUTAAAACkAAAAQAAAAEAAAAAAAAAAAAB8D6AEB83bpWwAAAaRmZEFUAAAAKnjaY2DAAVatWsW5efPmBhAGsRmIAf%2F%2F%2F2eEsTdt2pS%2BZcuW6yAMYhPUzMHBYcPMzHwAiBcDufw7duwoBtp%2BB4SBhpQADeECshuB7Nnbtm3Tw7CZiYnpKIgJwkB27qNHj4SAGlpAeN26dcJATSFAzbeB%2FJtAPBvDBUCbl4A0MzIy%2FmdjYwtBlwdqdgTiy1BDGrH5gpOFhSUbqpkJW%2FhADQk9c%2BYMK1xCXl6eQ0VFpU5ZWbnPwsJCiFBYAb3CBwoTIE4Hxg4bg7q6%2BkIFBYX%2FioqK%2F4GGLCBkAChMQN6AxlA95QbAvKCkpNQnJSUlTMiAEydO8AG9gfACDOTm5rK7ubklAbFPfX091kCcMmWK8%2BTJkyNCQ0PZMEx2cXGZ6uzs%2FAuIP4EMQZefNm2aC1DzbaAhj4G4DZsBm52cnL5DDUmqrKwUzcrKmgDCiYmJojNmzAgHaZ46deoDIL0QwwCgrWYgQ0AusbKy4s3JyanPzMx8D8UNixYt4gZqbgVpBmIDgnkDaHMhUOMrEAaxGUgFaWlpXECN%2FSAMYuNSBwBOIvA4wVgLqgAAABpmY1RMAAAAKwAAABAAAAAQAAAAAAAAAAAAHwPoAQEe4DqyAAABkWZkQVQAAAAseNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWoQFBS05uXl3c%2FHx7cQyOXfsWNHMdD2OyAMNKQEaAgXkN0IZM%2Fetm2bHorm%2F%2F%2F%2FMwI1H%2BLi4vrPzc39n5OTM%2FvRo0dCQA0tILxu3TphoKYQoObbQP5NIJ6N4QKQzSDNIMzPzx%2BMLg%2FU7AjEl6GGNGLzBQfQkCyoZiZ0SZAroYaEnjlzhhUuYW9vz6Grq1sNxN3e3t6ChMIK6BU%2BUJgAcTowdtgYjIyM5mpra%2F%2FV0dH5DzRkLiEDQGEC8gY0huopNwDJCz0yMjJCJHsBKeWxBQUFJQCxFyjAsAXiokWLnBYvXhxWX1%2FPhmFyQEDAJD8%2Fv2%2F%2B%2Fv7vAgMDvdHlgRqdlyxZcg2I7wHZzRgGADVuABrwGWpIAtAWkbKysj4Qzs3NFQXZDNV8B4jnYRgAtNUUZAjUJbwVFRW15eXlr0EYaEgtKCmDbAZpBnpFn2DeAGrMB2p8BsIgNsm5EegFrsrKym4QBrFxqQMANXn6HYPJ7D8AAAAaZmNUTAAAAC0AAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ypIyAAAAWtmZEFUAAAALnjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlqkJKSshITE9snISExH8jl37ZtWwnQ9jsgDDSkBGgIF5DdCGTPBsrpoWj%2B%2F%2F8%2FI1DzflFR0f9A%2Br%2BwsHDmo0ePhIAaWkB43bp1wkBNIUDNt4H8m0A8G8MFIJtBBoAwkB2ELg%2FU7AjEl6GGNGLzBQdQY6akpGQgkM2ELglyJdSQ0DNnzrDCJTw8PNgtLCwqLS0tO6OiogQJhRXQK3ygMAHidGDssDHY2trOMjc3%2FwnE%2F4AGzSJkAChMQN6AxlA95QbAvAA0oFNLS0uIZC8gpTy22NjY%2BLi4OE9QgBEdiDAA1NgfExPzCYhfgQwhORqBGtcCXfAOakhcT0%2BPSGtrazcI19fXixBMSEDNJkCb14JcEhoaytPW1lYN1PwchFtaWqqBzsadlLEBoMZcoMbHIAxik5wbgc7mam9v7wBhEBuXOgDZvgVwR0IA4QAAAABJRU5ErkJggg%3D%3D";

/* ------------------------- */
/* les paramètres par défaut */
/* ------------------------- */

// global
var vsf_smileys_number_default = 100;
var vsf_alert_new_smiley_default = false;
var vsf_confirm_delete_default = true;
var vsf_include_fav_default = true;
var vsf_sort_fav_by_name_default = false;
var vsf_no_space_default = false;
var vsf_smileys_last_tab_default = "top"; // "top", "historique", "favoris"
var vsf_preferences_last_tab_default = "pref1"; // "pref1", "pref2"
var vsf_add_button_default = true;
var vsf_add_button_img_default = img_fav_plus;
var vsf_panel_img_default = img_fav;
var vsf_panel_settings_img_default = img_fav_conf;
var vsf_smileys_default = "{}";
// réponse rapide
var vsf_quick_panel_default = true;
var vsf_quick_panel_closed_default = false;
var vsf_quick_panel_start_closed_default = false;
var vsf_quick_panel_top_default = true;
var vsf_quick_panel_width_default = "500px"; // correspond à la largeur de la réponse rapide par défaut
var vsf_quick_panel_height_default = "108px"; // correspond à la hauteurs de 2 smileys (2 x 54px)
// réponse normale
var vsf_normal_tabs_default = true;
var vsf_normal_tabs_top_default = false;
var vsf_normal_tabs_last_tab_default = "top"; // "top", "historique", "favoris"
var vsf_normal_tabs_width_default = "283px"; // largeur minimale pour les onglets et les boutons
var vsf_normal_tabs_height_default = "238px"; // hauteur pour 3 lignes de smileys et le texte
var vsf_hide_smileys_forum_default = false;
var vsf_normal_panel_default = false;
var vsf_normal_panel_closed_default = false;
var vsf_normal_panel_start_closed_default = false;
var vsf_normal_panel_top_default = true;
var vsf_normal_panel_height_default = "108px"; // correspond à la hauteurs de 2 smileys (2 x 54px)

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

// global
var vsf_smileys_number;
var vsf_alert_new_smiley;
var vsf_confirm_delete;
var vsf_include_fav;
var vsf_sort_fav_by_name;
var vsf_no_space;
var vsf_smileys_last_tab;
var vsf_preferences_last_tab;
var vsf_add_button;
var vsf_add_button_img;
var vsf_panel_img;
var vsf_panel_settings_img;
var vsf_smileys;
// réponse rapide
var vsf_quick_panel;
var vsf_quick_panel_closed;
var vsf_quick_panel_start_closed;
var vsf_quick_panel_top;
var vsf_quick_panel_width;
var vsf_quick_panel_height;
// réponse normale
var vsf_normal_tabs;
var vsf_normal_tabs_top;
var vsf_normal_tabs_last_tab;
var vsf_normal_tabs_width;
var vsf_normal_tabs_height;
var vsf_hide_smileys_forum;
var vsf_normal_panel;
var vsf_normal_panel_closed;
var vsf_normal_panel_start_closed;
var vsf_normal_panel_top;
var vsf_normal_panel_height;
// elements html
var top_tab_conf;
var historique_tab_conf;
var favoris_tab_conf;
var top_tab_normal;
var historique_tab_normal;
var favoris_tab_normal;
var quick_panel;
var quick_link;
var quick_br;
var quick_buttons;
var normal_panel;
var normal_br;
var normal_button;
var normal_top_down;
var normal_row;
// divers
var all_tabs = {};
var add_fav_close;
var panel_size_timer;
var last_quick_panel_width;
var last_quick_panel_height;
var last_normal_panel_height;
var last_content_width;
var last_content_height;
var access_keywords_last_call = 0;
var access_keywords_timer;
var click_smiley_last_call = 0;
var click_smiley_timer;
var keywords_tooltip_timer;
var tooltip_canceled = false;
var initial_message = "";
var initial_message_rapide = {};

/* -------------- */
/* les constantes */
/* -------------- */

const script_name = "[HFR] Vos smileys favoris";
const base_smileys = {
  ":)": "smile",
  ":(": "frown",
  ":D": "biggrin",
  ";)": "wink",
  ":o": "redface",
  ":??:": "confused",
  ":p": "tongue",
  ":'(": "ohill",
  ":/": "ohwell",
};
const base_smileys_url = "https://forum-images.hardware.fr/icones/";
const extended_smileys_url = "https://forum-images.hardware.fr/icones/smilies/";
const smileys_persos_url = "https://forum-images.hardware.fr/images/perso/";
const panel_size_time = 500;
const hash_check_input = document.querySelector("input[type=\"hidden\"][name=\"hash_check\"]");
const hash_check = hash_check_input ? hash_check_input.value.trim() : "";
const get_keywords_url = "https://forum.hardware.fr/wikismilies.php?config=hfr.inc&detail=";
const smileys_keywords_regexp = /name="keywords0" value="(.*?)" onkeyup/;
const set_keywords_url = "https://forum.hardware.fr/wikismilies.php?config=hfr.inc&option_wiki=0&withouttag=0";
const set_keywords_arg_modif = "modif0";
const set_keywords_arg_smiley = "smiley0";
const set_keywords_arg_keywords = "keywords0";
const set_keywords_arg_hash_check = "hash_check";
const access_keywords_time = 250;
const click_smiley_time = 300;
const set_keywords_time = 1500;
const keywords_tooltip_time = 450;
const edition_rapide_time = 75;
const quotemsg_regexp = /\[quotemsg=[0-9,]+\](?![^]*?\[quotemsg=[0-9,]+\])[^]*?\[\/quotemsg\]/;
const citation_regexp = /\[citation=[0-9,]+\](?![^]*?\[citation=[0-9,]+\])[^]*?\[\/citation\]/;
const base_smiley_regexps = [
  /:\)/g,
  /:\(/g,
  /:D/g,
  /;\)/g,
  /:o/g,
  /:\?\?:/g,
  /:p/g,
  /:'\(/g, // '/,
  /:\//g,
];
const extended_smiley_regexps = [
  /:lol:/g,
  /:foudtag:/g,
  /:crazy:/g,
  /:hebe:/g,
  /:na:/g,
  /:ange:/g,
  /:hello:/g,
  /:mouais:/g,
  /:sol:/g,
  /:dtc:/g,
  /:fouyaya:/g,
  /:mmmfff:/g,
  /:fou:/g,
  /:love:/g,
  /:ouch:/g,
  /:eek2:/g,
  /:bounce:/g,
  /:sum:/g,
  /:hap:/g,
  /:eek:/g,
  /:calimero:/g,
  /:mad:/g,
  /:benetton:/g,
  /:cry:/g,
  /:pfff:/g,
  /:ouimaitre:/g,
  /:24:/g,
  /:sweat:/g,
  /:hot:/g,
  /:evil:/g,
  /:vomi:/g,
  /:wahoo:/g,
  /:spamafote:/g,
  /:heink:/g,
  /:fuck:/g,
  /:int:/g,
  /:non:/g,
  /:whistle:/g,
  /:gun:/g,
  /:spookie:/g,
  /:sleep:/g,
  /:jap:/g,
  /:kaola:/g,
  /:gratgrat:/g,
  /:sarcastic:/g,
  /:pouah:/g,
  /:bug:/g,
  /:bic:/g,
  /:miam:/g,
  /:pt1cable:/g,
];
const smileys_persos_regexp = /\[:[^\]\n\r\t\v\f\\\0\/]{1,28}\]/g; // n'importe quels caractères mais pas trop

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // style pour les boutons d'ajout de favoris sur les posts
  "img.gm_hfr_vsf_r21_add_button{cursor:pointer;width:16px;height:16px;}" +
  // styles pour la fenêtre d'aide
  "#gm_hfr_vsf_r21_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;z-index:1003;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;text-align:justify;}" +
  "img.gm_hfr_vsf_r21_help_button{cursor:help;vertical-align:text-bottom;}" +
  // styles pour la fenêtre de configuration
  "#gm_hfr_vsf_r21_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_hfr_vsf_r21_config_window{position:fixed;width:700px;height:auto;background-color:#e0e0e0;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;z-index:1002;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;color:#000000;}" +
  "#gm_hfr_vsf_r21_config_window div.gm_hfr_vsf_r21_main_title{font-size:16px;text-align:center;" +
  "font-weight:bold;margin:0 0 16px;position:relative;cursor:default;}" +
  /*
  "#gm_hfr_vsf_r21_config_window div.gm_hfr_vsf_r21_main_title img{position:absolute;right:0;" +
  "top:calc(50% - 8px);cursor:pointer;}" +
  */
  "#gm_hfr_vsf_r21_config_window fieldset{margin:0 0 14px;border:1px solid #888888;padding:6px 10px 10px;}" +
  "#gm_hfr_vsf_r21_config_window fieldset:last-child{margin:0;}" +
  "#gm_hfr_vsf_r21_config_window legend{font-size:14px;cursor:default;}" +
  // -- styles pour les elements des formulaires
  "#gm_hfr_vsf_r21_config_window input[type=\"radio\"]{margin:0 0 2px;vertical-align:text-bottom;}" +
  "#gm_hfr_vsf_r21_config_window input[type=\"text\"]{padding:0 1px;border:1px solid #c0c0c0;height:14px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;}" +
  "#gm_hfr_vsf_r21_config_window input.gm_hfr_vsf_r21_right[type=\"text\"]{text-align:right;}" +
  "#gm_hfr_vsf_r21_config_window input[type=\"checkbox\"]{margin:0 0 1px;vertical-align:text-bottom;}" +
  // -- styles pour les p et les div
  "#gm_hfr_vsf_r21_config_window p{margin:0 0 0 4px;cursor:default;}" +
  "#gm_hfr_vsf_r21_config_window p:not(:last-child){margin-bottom:4px;}" +
  "#gm_hfr_vsf_r21_config_window img.gm_hfr_vsf_r21_test{margin:0 3px 0 0;width:16px;" +
  "height:16px;vertical-align:text-bottom;}" +
  "#gm_hfr_vsf_r21_config_window img.gm_hfr_vsf_r21_reset{cursor:pointer;margin:0 0 0 3px;}" +
  "div.gm_hfr_vsf_r21_save_close_div{text-align:right;margin:16px 0 0;cursor:default;}" +
  "div.gm_hfr_vsf_r21_save_close_div div.gm_hfr_vsf_r21_info_reload_div{float:left;}" +
  "div.gm_hfr_vsf_r21_save_close_div div.gm_hfr_vsf_r21_info_reload_div " +
  "img{vertical-align:text-bottom;}" +
  "div.gm_hfr_vsf_r21_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  "#gm_hfr_vsf_r21_config_window div.gm_hfr_vsf_r21_action_save{height:150px;display:flex;" +
  "justify-content:space-evenly;flex-direction:column;align-items:center;border:1px solid #888888;" +
  "background-color:#ffffff;}" +
  "#gm_hfr_vsf_r21_config_window div.gm_hfr_vsf_r21_action_smileys{display:flex;font-size:10px;" +
  "justify-content:space-between;margin:4px 0 0 0;}" +
  "#gm_hfr_vsf_r21_config_window span.gm_hfr_vsf_r21_action{display:block;cursor:pointer;}" +
  "#gm_hfr_vsf_r21_config_window span.gm_hfr_vsf_r21_action:hover{text-decoration:underline;}" +
  // style des panneaux
  ".gm_hfr_vsf_r21_panel{position:relative;padding:2px;border:1px solid #888888;text-align:center;" +
  "overflow:auto;min-height:54px;}" +
  // -- quick panel
  "span.gm_hfr_vsf_r21_quick_panel{display:none;resize:both;background-color:#f0f0f0;min-width:100px;}" +
  ".gm_hfr_vsf_r21_quick_panel_top{margin-top:2px;}" +
  ".gm_hfr_vsf_r21_quick_panel_bottom{margin-bottom:2px;}" +
  "br.gm_hfr_vsf_r21_quick_br{display:none;}" +
  "span.gm_hfr_vsf_r21_quick_link{display:none;cursor:pointer;}" +
  "div#mesdiscussions img.gm_hfr_vsf_r21_quick_link_img{vertical-align:text-bottom;margin:0 4px 0 0;" +
  "width:16px;height:16px;}" +
  "span.gm_hfr_vsf_r21_quick_link:hover span.gm_hfr_vsf_r21_quick_link_span{text-decoration:underline;}" +
  "div.gm_hfr_vsf_r21_quick_buttons{position:absolute;display:inline-flex;flex-direction:column;" +
  "margin-left:2px;}" +
  "img.gm_hfr_vsf_r21_quick_buttons_img{width:16px;height:16px;display:block;cursor:pointer;opacity:0.3;}" +
  "img.gm_hfr_vsf_r21_quick_buttons_img:hover{opacity:1;}" +
  "div#mesdiscussions img.gm_hfr_vsf_r21_quick_buttons_img_top{margin-top:-2px;}" +
  "div#mesdiscussions img.gm_hfr_vsf_r21_quick_buttons_img_bottom{margin-top:auto;margin-bottom:-1px;}" +
  // -- normal panel
  "span.gm_hfr_vsf_r21_normal_panel{display:none;width:calc(100% - 6px);margin-bottom:2px;resize:vertical;" +
  "background-color:#f0f0f0;}" +
  "br.gm_hfr_vsf_r21_normal_br{display:none;}" +
  "div.gm_hfr_vsf_r21_normal_button{margin:0 0 0 -2px;background-image:url(" + img_button + ");" +
  "width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;}" +
  "img.gm_hfr_vsf_r21_normal_button_img{width:16px;height:16px;display:block;}" +
  // -- fake padding
  "div.gm_hfr_vsf_r21_fake_padding{position:absolute;opacity:0;width:1px;height:2px;}" +
  // styles pour les smileys
  "div.gm_hfr_vsf_r21_smiley{display:inline-block;margin:2px;}" +
  "#gm_hfr_vsf_r21 div.gm_hfr_vsf_r21_smiley > img{display:block;margin:0 auto;}" +
  "div.gm_hfr_vsf_r21_smiley > img[data-clickable=\"true\"]{cursor:pointer;}" +
  "div.gm_hfr_vsf_r21_smiley > img[data-clickable=\"true\"]:hover{opacity:0.4;}" +
  "div.gm_hfr_vsf_r21_smiley > div.gm_hfr_vsf_r21_smiley_buttons{display:flex;margin:2px 0 0 0;" +
  "justify-content:space-evenly;align-items:center;}" +
  "div.gm_hfr_vsf_r21_smiley > div.gm_hfr_vsf_r21_smiley_buttons > img{display:block;cursor:pointer;}" +
  // -- le nombre (de fois ou ordre)
  "div.gm_hfr_vsf_r21_smiley > div.gm_hfr_vsf_r21_smiley_buttons > " +
  "div.gm_hfr_vsf_r21_smiley_number{font-size:10px;cursor:default;}" +
  // -- les boutons
  "div#gm_hfr_vsf_r21 div.gm_hfr_vsf_r21_smiley > div.gm_hfr_vsf_r21_smiley_buttons > " +
  "img.gm_hfr_vsf_r21_button_favori{width:16px;height:16px;object-position:-16px 0;object-fit:none;" +
  "margin:0 2px;}" +
  "div#gm_hfr_vsf_r21 div.gm_hfr_vsf_r21_smiley > div.gm_hfr_vsf_r21_smiley_buttons > " +
  "img.gm_hfr_vsf_r21_button_favori.gm_hfr_vsf_r21_favori{object-position:0 0;}" +
  "div.gm_hfr_vsf_r21_smiley > div.gm_hfr_vsf_r21_smiley_buttons > img:hover{opacity:0.4;}" +
  // styles pour la fenêtre d'ajout de favoris
  "#gm_hfr_vsf_r21_add_fav_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_hfr_vsf_r21_add_fav_window{position:fixed;resize:both;overflow:hidden;background-color:#f0f0f0;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;z-index:1002;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;min-width:343px;width:343px;" +
  "min-height:142px;height:142px;color:#000000;}" +
  "#gm_hfr_vsf_r21_add_fav_window.gm_hfr_vsf_r21_no_smiley{cursor:pointer;min-height:18px;height:18px;" +
  "resize:none;}" +
  "#gm_hfr_vsf_r21_add_fav_window.gm_hfr_vsf_r21_no_smiley *{cursor:pointer;}" +
  "#gm_hfr_vsf_r21_add_fav_window div.gm_hfr_vsf_r21_add_fav_title{font-size:14px;" +
  "font-weight:bold;text-align:center;line-height:18px;}" +
  "#gm_hfr_vsf_r21_add_fav_window div.gm_hfr_vsf_r21_add_fav_panel{margin:14px 0 0 0;" +
  "width:clalc(100% - 6px);height:calc(100% - 70px);overflow:auto;background-color:#ffffff;}" +
  // styles pour les onlets et leur contenu
  "div.gm_hfr_vsf_r21_vos_smileys_normal{min-width:285px;}" +
  "div.gm_hfr_vsf_r21_div_tabs{display:flex;justify-content:center;align-items:center;" +
  "border-bottom:1px solid #888888;}" +
  "div#mesdiscussions img.gm_hfr_vsf_r21_img_tab{display:block;margin:0 4px -1px;cursor:pointer;" +
  "opacity:0.3;}" +
  "div#mesdiscussions img.gm_hfr_vsf_r21_img_tab:hover{opacity:1;}" +
  "span.gm_hfr_vsf_r21_span_tab{display:block;margin:0 4px -1px;cursor:pointer;border:1px solid #888888;" +
  "font-size:12px;padding:4px 8px;border-radius:0.1px 0.1px 0 0;font-weight:normal;" +
  "background-color:#d7d7d7;color:#000000;}" +
  "span.gm_hfr_vsf_r21_span_tab:not(.gm_hfr_vsf_r21_tab_active):hover{background-color:#f0f0f0;" +
  "color:#000000;}" +
  "span.gm_hfr_vsf_r21_span_tab.gm_hfr_vsf_r21_tab_active{background-color:#f0f0f0;" +
  "border-bottom:1px solid #f0f0f0;color:#000000;}" +
  "div.gm_hfr_vsf_r21_div_content_tab_general " +
  "span.gm_hfr_vsf_r21_span_tab{background-color:#e7e7e7;color:#000000;}" +
  "div.gm_hfr_vsf_r21_div_content_tab_general " +
  "span.gm_hfr_vsf_r21_span_tab:not(.gm_hfr_vsf_r21_tab_active):hover{background-color:#ffffff;" +
  "color:#000000;}" +
  "div.gm_hfr_vsf_r21_div_content_tab_general " +
  "span.gm_hfr_vsf_r21_span_tab.gm_hfr_vsf_r21_tab_active{background-color:#ffffff;" +
  "border-bottom:1px solid #ffffff;color:#000000;}" +
  "div.gm_hfr_vsf_r21_div_content{overflow:auto;border:1px solid #888888;border-top:0;" +
  "background-color:#f0f0f0;color:#000000;}" +
  "div.gm_hfr_vsf_r21_div_content_tab_general div.gm_hfr_vsf_r21_div_content{background-color:#ffffff;}" +
  "div.gm_hfr_vsf_r21_div_content.gm_hfr_vsf_r21_div_content_normal{resize:both;" +
  "min-width:283px;min-height:238px;}" +
  "div.gm_hfr_vsf_r21_div_content_tab{display:none;}" +
  "div.gm_hfr_vsf_r21_div_content_tab_general{padding:16px;}" +
  "div.gm_hfr_vsf_r21_div_content_tab_preferences{padding:16px;}" +
  "div.gm_hfr_vsf_r21_div_content_tab_smileys{position:relative;padding:2px;text-align:center;}" +
  "div.gm_hfr_vsf_r21_div_content_tab_general " +
  "div.gm_hfr_vsf_r21_div_content_tab_smileys{max-height:250px;}" +
  "div.gm_hfr_vsf_r21_div_content_tab_text{font-weight:bold;font-size:10px;padding:2px;cursor:default;}" +
  // styles pour la tooltip d'affichage des mots-clés
  "div#gm_hfr_vsf_r21_keywords_tooltip{position:absolute;max-width:350px;height:auto;padding:4px 8px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border-radius:10px;font-size:11px;border:1px solid;" +
  "background:linear-gradient(#ffffff, #f7f7ff);left:0;top:0;text-align:justify;color:#000000;display:none;" +
  "z-index:1005;cursor:default;}" +
  // styles pour la popup d'édition des mots-clés
  "div#gm_hfr_vsf_r21_keywords_popup{display:none;position:absolute;left:0;top:0;width:auto;height:auto;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;padding:4px;overflow:auto;" +
  "resize:both;min-width:356px;min-height:70px;background:linear-gradient(#ffffff, #f7f7ff);color:#000000;" +
  "z-index:1006;}" +
  "div#gm_hfr_vsf_r21_keywords_popup.gm_hfr_vsf_r21_keywords_no_edit" +
  "{resize:none;width:416px;min-height:30px;height:30px;}" +
  "div.gm_hfr_vsf_r21_keywords_nothing{display:flex;justify-content:center;align-items:center;" +
  "cursor:pointer;width:auto;height:100%;}" +
  "span.gm_hfr_vsf_r21_keywords_text{display:block;font-size:14px;}" +
  "textarea.gm_hfr_vsf_r21_keywords_textarea{margin:0;padding:1px 2px;border:1px solid #c0c0c0;" +
  "font-size:11px;font-family:Verdana,Arial,Sans-serif,Helvetica;display:block;width:calc(100% - 6px);" +
  "height:calc(100% - 24px);background-color:transparent;resize:none;overflow:auto;}" +
  "div.gm_hfr_vsf_r21_keywords_div{margin-top:4px;height:16px;}" +
  "span.gm_hfr_vsf_r21_keywords_span{font-size:11px;color:#707070;padding:0 0 0 1px;cursor:default;" +
  "display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:auto;}" +
  "span.gm_hfr_vsf_r21_keywords_span_link{cursor:pointer;}" +
  "img.gm_hfr_vsf_r21_keywords_throbber{display:none;float:right;padding:0 15px 0 0;cursor:default;}" +
  "div.gm_hfr_vsf_r21_keywords_answer{display:none;float:right;text-align:right;font-size:11px;" +
  "color:#ff0000;font-weight:bold;padding:0 15px 0 0;cursor:default;}" +
  "div.gm_hfr_vsf_r21_keywords_answer.gm_hfr_vsf_r21_success{color:#007f00;}" +
  "div.gm_hfr_vsf_r21_keywords_answer.gm_hfr_vsf_r21_wait{color:#ff7f00;}" +
  "div.gm_hfr_vsf_r21_keywords_buttons{float:right;text-align:right;padding:0 15px 0 0;}" +
  "div.gm_hfr_vsf_r21_keywords_buttons > img{margin-left:8px;cursor:pointer;}";
if(box_shadow) {
  style.textContent += "div#gm_hfr_vsf_r21_keywords_tooltip, div#gm_hfr_vsf_r21_keywords_popup" +
    "{box-shadow:4px 4px 4px 0 rgba(0, 0, 0, 0.4);}";
}
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// fonction de désactivation de l'action par défaut sur un événement
function prevent_default(p_event) {
  p_event.preventDefault();
}

// création de la fenêtre d'aide
var help_window = document.createElement("div");
help_window.setAttribute("id", "gm_hfr_vsf_r21_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(p_width, p_text) {
  let l_help_button = document.createElement("img");
  l_help_button.setAttribute("src", img_help);
  l_help_button.setAttribute("class", "gm_hfr_vsf_r21_help_button");
  l_help_button.addEventListener("mouseover", function(e) {
    help_window.style.width = p_width + "px";
    help_window.textContent = p_text;
    help_window.style.left = (e.clientX + 32) + "px";
    help_window.style.top = (e.clientY - 16) + "px";
    help_window.style.visibility = "visible";
  }, false);
  l_help_button.addEventListener("mouseout", function(e) {
    help_window.style.visibility = "hidden";
  }, false);
  return l_help_button;
}

// création du voile de fond pour la fenêtre de configuration
var config_background = document.createElement("div");
config_background.setAttribute("id", "gm_hfr_vsf_r21_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gm_hfr_vsf_r21_config_window");
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.setAttribute("class", "gm_hfr_vsf_r21_main_title");
main_title.textContent = "Configuration du script " + script_name;
/*
var main_title_close_button = document.createElement("img");
main_title_close_button.setAttribute("src", img_close);
main_title_close_button.setAttribute("title", "Fermer");
main_title_close_button.addEventListener("click", hide_config_window, false);
main_title.appendChild(main_title_close_button);
*/
config_window.appendChild(main_title);

// les onglets généraux
var general = document.createElement("div");
all_tabs.general = {};
// -- les onglets
var general_tabs = document.createElement("div");
general_tabs.setAttribute("class", "gm_hfr_vsf_r21_div_tabs");
// -- -- l'onglet préférences
var tab_pref = document.createElement("span");
tab_pref.setAttribute("class", "gm_hfr_vsf_r21_span_tab");
tab_pref.dataset.parent = "general";
tab_pref.dataset.tab = "pref";
tab_pref.textContent = "Préférences";
tab_pref.addEventListener("click", show_tab, false);
all_tabs.general.pref = {
  tab: tab_pref,
};
general_tabs.appendChild(tab_pref);
// -- -- l'onglet sauvegarde
var tab_save = document.createElement("span");
tab_save.setAttribute("class", "gm_hfr_vsf_r21_span_tab");
tab_save.dataset.parent = "general";
tab_save.dataset.tab = "save";
tab_save.textContent = "Sauvegarde";
tab_save.addEventListener("click", show_tab, false);
all_tabs.general.save = {
  tab: tab_save,
};
general_tabs.appendChild(tab_save);
// -- -- l'onglet vos smileys
var tab_smileys = document.createElement("span");
tab_smileys.setAttribute("class", "gm_hfr_vsf_r21_span_tab");
tab_smileys.dataset.parent = "general";
tab_smileys.dataset.tab = "smileys";
tab_smileys.textContent = "Vos smileys";
tab_smileys.addEventListener("click", show_tab, false);
all_tabs.general.smileys = {
  tab: tab_smileys,
};
general_tabs.appendChild(tab_smileys);
general.appendChild(general_tabs);
// -- les contenus
var general_content = document.createElement("div");
general_content.setAttribute("id", "gm_hfr_vsf_r21"); // pour avoir un selecteur CSS de plus haut niveau
general_content.setAttribute("class", "gm_hfr_vsf_r21_div_content");
// -- -- le contenu préférences
var content_pref = document.createElement("div");
content_pref.setAttribute("class",
  "gm_hfr_vsf_r21_div_content_tab gm_hfr_vsf_r21_div_content_tab_general");
all_tabs.general.pref.content = content_pref;
general_content.appendChild(content_pref);
// -- -- le contenu sauvegarde
var content_save = document.createElement("div");
content_save.setAttribute("class",
  "gm_hfr_vsf_r21_div_content_tab gm_hfr_vsf_r21_div_content_tab_general");
all_tabs.general.save.content = content_save;
general_content.appendChild(content_save);
// -- -- le contenu vos smileys
var content_smileys = document.createElement("div");
content_smileys.setAttribute("class",
  "gm_hfr_vsf_r21_div_content_tab gm_hfr_vsf_r21_div_content_tab_general");
all_tabs.general.smileys.content = content_smileys;
general_content.appendChild(content_smileys);
general.appendChild(general_content);
config_window.appendChild(general);

// les onglets préférences
var preferences = document.createElement("div");
all_tabs.preferences = {};
// -- les onglets
var preferences_tabs = document.createElement("div");
preferences_tabs.setAttribute("class", "gm_hfr_vsf_r21_div_tabs");
// -- -- l'onglet 1
var tab_pref1 = document.createElement("span");
tab_pref1.setAttribute("class", "gm_hfr_vsf_r21_span_tab");
tab_pref1.dataset.parent = "preferences";
tab_pref1.dataset.tab = "pref1";
tab_pref1.textContent = "Générales";
tab_pref1.addEventListener("click", show_tab, false);
all_tabs.preferences.pref1 = {
  tab: tab_pref1,
};
preferences_tabs.appendChild(tab_pref1);
// -- -- l'onglet 2
var tab_pref2 = document.createElement("span");
tab_pref2.setAttribute("class", "gm_hfr_vsf_r21_span_tab");
tab_pref2.dataset.parent = "preferences";
tab_pref2.dataset.tab = "pref2";
tab_pref2.textContent = "Réponses";
tab_pref2.addEventListener("click", show_tab, false);
all_tabs.preferences.pref2 = {
  tab: tab_pref2,
};
preferences_tabs.appendChild(tab_pref2);
preferences.appendChild(preferences_tabs);
// -- les contenus
var preferences_content = document.createElement("div");
preferences_content.setAttribute("class", "gm_hfr_vsf_r21_div_content");
// -- -- le contenu 1
var content_pref1 = document.createElement("div");
content_pref1.setAttribute("class",
  "gm_hfr_vsf_r21_div_content_tab gm_hfr_vsf_r21_div_content_tab_preferences");
all_tabs.preferences.pref1.content = content_pref1;
preferences_content.appendChild(content_pref1);
// -- -- le contenu 2
var content_pref2 = document.createElement("div");
content_pref2.setAttribute("class",
  "gm_hfr_vsf_r21_div_content_tab gm_hfr_vsf_r21_div_content_tab_preferences");
all_tabs.preferences.pref2.content = content_pref2;
preferences_content.appendChild(content_pref2);
preferences.appendChild(preferences_content);
content_pref.appendChild(preferences);

// préférences 1 générales
// -- smileys_number
var smileys_number_p = document.createElement("p");
var smileys_number_label = document.createElement("label");
smileys_number_label.textContent = "nombre de smileys dans les onglets \u00ab\u202fTop\u202f\u00bb et " +
  "\u00ab\u202fHistorique\u202f\u00bb : ";
smileys_number_label.setAttribute("for", "gm_hfr_tdi_r21_smileys_number_input");
smileys_number_p.appendChild(smileys_number_label);
var smileys_number_input = document.createElement("input");
smileys_number_input.setAttribute("type", "text");
smileys_number_input.setAttribute("id", "gm_hfr_tdi_r21_smileys_number_input");
smileys_number_input.setAttribute("class", "gm_hfr_vsf_r21_right");
smileys_number_input.setAttribute("size", "4");
smileys_number_input.setAttribute("maxLength", "5");
smileys_number_input.setAttribute("pattern", "[0-9]+");
smileys_number_input.setAttribute("title", "au moins 10");
smileys_number_input.setAttribute("placeholder", "10");
smileys_number_p.appendChild(smileys_number_input);
content_pref1.appendChild(smileys_number_p);
// -- alert_new_smiley
var alert_new_smiley_p = document.createElement("p");
var alert_new_smiley_checkbox = document.createElement("input");
alert_new_smiley_checkbox.setAttribute("type", "checkbox");
alert_new_smiley_checkbox.setAttribute("id", "gm_hfr_vsf_r21_alert_new_smiley_checkbox");
alert_new_smiley_p.appendChild(alert_new_smiley_checkbox);
var alert_new_smiley_label = document.createElement("label");
alert_new_smiley_label.textContent = " signaler lorsque de nouveaux smileys sont trouvés dans vos messages";
alert_new_smiley_label.setAttribute("for", "gm_hfr_vsf_r21_alert_new_smiley_checkbox");
alert_new_smiley_p.appendChild(alert_new_smiley_label);
content_pref1.appendChild(alert_new_smiley_p);
// -- confirm_delete
var confirm_delete_p = document.createElement("p");
var confirm_delete_checkbox = document.createElement("input");
confirm_delete_checkbox.setAttribute("type", "checkbox");
confirm_delete_checkbox.setAttribute("id", "gm_hfr_vsf_r21_confirm_delete_checkbox");
confirm_delete_p.appendChild(confirm_delete_checkbox);
var confirm_delete_label = document.createElement("label");
confirm_delete_label.textContent = " confirmer la supppression des smileys";
confirm_delete_label.setAttribute("for", "gm_hfr_vsf_r21_confirm_delete_checkbox");
confirm_delete_p.appendChild(confirm_delete_label);
content_pref1.appendChild(confirm_delete_p);
// -- include_fav
var include_fav_p = document.createElement("p");
var include_fav_checkbox = document.createElement("input");
include_fav_checkbox.setAttribute("type", "checkbox");
include_fav_checkbox.setAttribute("id", "gm_hfr_vsf_r21_include_fav_checkbox");
include_fav_p.appendChild(include_fav_checkbox);
var include_fav_label = document.createElement("label");
include_fav_label.textContent = " inclure les smileys favoris dans les onglets \u00ab\u202fTop\u202f\u00bb et " +
  "\u00ab\u202fHistorique\u202f\u00bb";
include_fav_label.setAttribute("for", "gm_hfr_vsf_r21_include_fav_checkbox");
include_fav_p.appendChild(include_fav_label);
content_pref1.appendChild(include_fav_p);
// -- sort_fav_by_name
var sort_fav_by_name_p = document.createElement("p");
var sort_fav_by_name_checkbox = document.createElement("input");
sort_fav_by_name_checkbox.setAttribute("type", "checkbox");
sort_fav_by_name_checkbox.setAttribute("id", "gm_hfr_vsf_r21_sort_fav_by_name_checkbox");
sort_fav_by_name_p.appendChild(sort_fav_by_name_checkbox);
var sort_fav_by_name_label = document.createElement("label");
sort_fav_by_name_label.textContent = " trier les smileys favoris par nom au lieu de les trier par " +
  "\u00ab\u202fTop\u202f\u00bb";
sort_fav_by_name_label.setAttribute("for", "gm_hfr_vsf_r21_sort_fav_by_name_checkbox");
sort_fav_by_name_p.appendChild(sort_fav_by_name_label);
content_pref1.appendChild(sort_fav_by_name_p);
// -- no_space
var no_space_p = document.createElement("p");
var no_space_checkbox = document.createElement("input");
no_space_checkbox.setAttribute("type", "checkbox");
no_space_checkbox.setAttribute("id", "gm_hfr_vsf_r21_no_space_checkbox");
no_space_p.appendChild(no_space_checkbox);
var no_space_label = document.createElement("label");
no_space_label.textContent = " ne pas rajouter d'espaces autour des smileys lors de leur insertion " +
  "dans les messages";
no_space_label.setAttribute("for", "gm_hfr_vsf_r21_no_space_checkbox");
no_space_p.appendChild(no_space_label);
content_pref1.appendChild(no_space_p);
// -- add_button
var add_button_p = document.createElement("p");
var add_button_checkbox = document.createElement("input");
add_button_checkbox.setAttribute("type", "checkbox");
add_button_checkbox.setAttribute("id", "gm_hfr_vsf_r21_add_button_checkbox");
add_button_p.appendChild(add_button_checkbox);
var add_button_label = document.createElement("label");
add_button_label.textContent = " permettre l'ajout de smileys favoris depuis les messages existants";
add_button_label.setAttribute("for", "gm_hfr_vsf_r21_add_button_checkbox");
add_button_p.appendChild(add_button_label);
content_pref1.appendChild(add_button_p);
// -- add_button_img
var add_button_img_p = document.createElement("p");
var add_button_img_label = document.createElement("label");
add_button_img_label.textContent = "icône du bouton d'ajout de smileys favoris : ";
add_button_img_label.setAttribute("for", "gm_hfr_vsf_r21_add_button_img_input");
add_button_img_p.appendChild(add_button_img_label);
var add_button_img_test_img = document.createElement("img");
add_button_img_test_img.setAttribute("class", "gm_hfr_vsf_r21_test");
add_button_img_p.appendChild(add_button_img_test_img);
var add_button_img_input = document.createElement("input");
add_button_img_input.setAttribute("id", "gm_hfr_vsf_r21_add_button_img_input");
add_button_img_input.setAttribute("type", "text");
add_button_img_input.setAttribute("spellcheck", "false");
add_button_img_input.setAttribute("size", "23");
add_button_img_input.setAttribute("title", "url de l'icône (http ou data)");
add_button_img_input.addEventListener("click", function() {
  add_button_img_input.select();
}, false);

function add_button_img_do_test_img() {
  add_button_img_test_img.setAttribute("src", add_button_img_input.value.trim());
  add_button_img_input.setSelectionRange(0, 0);
  add_button_img_input.blur();
}
add_button_img_input.addEventListener("input", add_button_img_do_test_img, false);
add_button_img_p.appendChild(add_button_img_input);
var add_button_img_reset_img = document.createElement("img");
add_button_img_reset_img.setAttribute("src", img_reset);
add_button_img_reset_img.setAttribute("class", "gm_hfr_vsf_r21_reset");
add_button_img_reset_img.setAttribute("title", "remettre l'icône par défaut");

function add_button_img_do_reset_img() {
  add_button_img_input.value = vsf_add_button_img_default;
  add_button_img_do_test_img();
}
add_button_img_reset_img.addEventListener("click", add_button_img_do_reset_img, false);
add_button_img_p.appendChild(add_button_img_reset_img);
content_pref1.appendChild(add_button_img_p);
// -- panel_img
var panel_img_p = document.createElement("p");
var panel_img_label = document.createElement("label");
panel_img_label.textContent = "icône du bouton d'ouverture des panneaux des favoris : ";
panel_img_label.setAttribute("for", "gm_hfr_vsf_r21_panel_img_input");
panel_img_p.appendChild(panel_img_label);
var panel_img_test_img = document.createElement("img");
panel_img_test_img.setAttribute("class", "gm_hfr_vsf_r21_test");
panel_img_p.appendChild(panel_img_test_img);
var panel_img_input = document.createElement("input");
panel_img_input.setAttribute("id", "gm_hfr_vsf_r21_panel_img_input");
panel_img_input.setAttribute("type", "text");
panel_img_input.setAttribute("spellcheck", "false");
panel_img_input.setAttribute("size", "23");
panel_img_input.setAttribute("title", "url de l'icône (http ou data)");
panel_img_input.addEventListener("click", function() {
  panel_img_input.select();
}, false);

function panel_img_do_test_img() {
  panel_img_test_img.setAttribute("src", panel_img_input.value.trim());
  panel_img_input.setSelectionRange(0, 0);
  panel_img_input.blur();
}
panel_img_input.addEventListener("input", panel_img_do_test_img, false);
panel_img_p.appendChild(panel_img_input);
var panel_img_reset_img = document.createElement("img");
panel_img_reset_img.setAttribute("src", img_reset);
panel_img_reset_img.setAttribute("class", "gm_hfr_vsf_r21_reset");
panel_img_reset_img.setAttribute("title", "remettre l'icône par défaut");

function panel_img_do_reset_img() {
  panel_img_input.value = vsf_panel_img_default;
  panel_img_do_test_img();
}
panel_img_reset_img.addEventListener("click", panel_img_do_reset_img, false);
panel_img_p.appendChild(panel_img_reset_img);
content_pref1.appendChild(panel_img_p);
// -- panel_settings_img
var panel_settings_img_p = document.createElement("p");
var panel_settings_img_label = document.createElement("label");
panel_settings_img_label.textContent = "icône du bouton de configuration pour les panneaux des favoris : ";
panel_settings_img_label.setAttribute("for", "gm_hfr_vsf_r21_panel_settings_img_input");
panel_settings_img_p.appendChild(panel_settings_img_label);
var panel_settings_img_test_img = document.createElement("img");
panel_settings_img_test_img.setAttribute("class", "gm_hfr_vsf_r21_test");
panel_settings_img_p.appendChild(panel_settings_img_test_img);
var panel_settings_img_input = document.createElement("input");
panel_settings_img_input.setAttribute("id", "gm_hfr_vsf_r21_panel_settings_img_input");
panel_settings_img_input.setAttribute("type", "text");
panel_settings_img_input.setAttribute("spellcheck", "false");
panel_settings_img_input.setAttribute("size", "23");
panel_settings_img_input.setAttribute("title", "url de l'icône (http ou data)");
panel_settings_img_input.addEventListener("click", function() {
  panel_settings_img_input.select();
}, false);

function panel_settings_img_do_test_img() {
  panel_settings_img_test_img.setAttribute("src", panel_settings_img_input.value.trim());
  panel_settings_img_input.setSelectionRange(0, 0);
  panel_settings_img_input.blur();
}
panel_settings_img_input.addEventListener("input", panel_settings_img_do_test_img, false);
panel_settings_img_p.appendChild(panel_settings_img_input);
var panel_settings_img_reset_img = document.createElement("img");
panel_settings_img_reset_img.setAttribute("src", img_reset);
panel_settings_img_reset_img.setAttribute("class", "gm_hfr_vsf_r21_reset");
panel_settings_img_reset_img.setAttribute("title", "remettre l'icône par défaut");

function panel_settings_img_do_reset_img() {
  panel_settings_img_input.value = vsf_panel_settings_img_default;
  panel_settings_img_do_test_img();
}
panel_settings_img_reset_img.addEventListener("click", panel_settings_img_do_reset_img, false);
panel_settings_img_p.appendChild(panel_settings_img_reset_img);
content_pref1.appendChild(panel_settings_img_p);

// préférences 2 réponses
// -- section réponse rapide
var quick_fieldset = document.createElement("fieldset");
var quick_legend = document.createElement("legend");
quick_legend.textContent = "Réponse rapide";
quick_fieldset.appendChild(quick_legend);
content_pref2.appendChild(quick_fieldset);
// -- -- quick_panel
var quick_panel_p = document.createElement("p");
var quick_panel_checkbox = document.createElement("input");
quick_panel_checkbox.setAttribute("type", "checkbox");
quick_panel_checkbox.setAttribute("id", "gm_hfr_vsf_r21_quick_panel_checkbox");
quick_panel_p.appendChild(quick_panel_checkbox);
var quick_panel_label = document.createElement("label");
quick_panel_label.textContent = " afficher le panneau des favoris à côté de la réponse rapide";
quick_panel_label.setAttribute("for", "gm_hfr_vsf_r21_quick_panel_checkbox");
quick_panel_p.appendChild(quick_panel_label);
quick_fieldset.appendChild(quick_panel_p);
// -- -- quick_panel_start_closed
var quick_panel_start_closed_p = document.createElement("p");
var quick_panel_start_closed_checkbox = document.createElement("input");
quick_panel_start_closed_checkbox.setAttribute("type", "checkbox");
quick_panel_start_closed_checkbox.setAttribute("id", "gm_hfr_vsf_r21_quick_panel_start_closed_checkbox");
quick_panel_start_closed_p.appendChild(quick_panel_start_closed_checkbox);
var quick_panel_start_closed_label = document.createElement("label");
quick_panel_start_closed_label.textContent = " toujours afficher le panneau des favoris initialement fermé";
quick_panel_start_closed_label.setAttribute("for", "gm_hfr_vsf_r21_quick_panel_start_closed_checkbox");
quick_panel_start_closed_p.appendChild(quick_panel_start_closed_label);
quick_fieldset.appendChild(quick_panel_start_closed_p);
// -- -- quick_panel_position
var quick_panel_position_p = document.createElement("p");
quick_panel_position_p.appendChild(document.createTextNode("position du panneau des favoris : "));
var quick_panel_position_dessus_label = document.createElement("label");
quick_panel_position_dessus_label.textContent = "dessus ";
quick_panel_position_dessus_label.setAttribute("for", "gm_hfr_vsf_r21_quick_panel_position_dessus_radio");
quick_panel_position_p.appendChild(quick_panel_position_dessus_label);
var quick_panel_position_dessus_radio = document.createElement("input");
quick_panel_position_dessus_radio.setAttribute("type", "radio");
quick_panel_position_dessus_radio.setAttribute("id", "gm_hfr_vsf_r21_quick_panel_position_dessus_radio");
quick_panel_position_dessus_radio.setAttribute("name", "gm_hfr_vsf_r21_quick_panel_position_radio");
quick_panel_position_p.appendChild(quick_panel_position_dessus_radio);
quick_panel_position_p.appendChild(document.createTextNode(" "));
var quick_panel_position_dessous_radio = document.createElement("input");
quick_panel_position_dessous_radio.setAttribute("type", "radio");
quick_panel_position_dessous_radio.setAttribute("id", "gm_hfr_vsf_r21_quick_panel_position_dessous_radio");
quick_panel_position_dessous_radio.setAttribute("name", "gm_hfr_vsf_r21_quick_panel_position_radio");
quick_panel_position_p.appendChild(quick_panel_position_dessous_radio);
var quick_panel_position_dessous_label = document.createElement("label");
quick_panel_position_dessous_label.textContent = " dessous";
quick_panel_position_dessous_label.setAttribute("for", "gm_hfr_vsf_r21_quick_panel_position_dessous_radio");
quick_panel_position_p.appendChild(quick_panel_position_dessous_label);
quick_fieldset.appendChild(quick_panel_position_p);
// -- section réponse normale
var normal_fieldset = document.createElement("fieldset");
var normal_legend = document.createElement("legend");
normal_legend.textContent = "Réponse normale";
normal_fieldset.appendChild(normal_legend);
content_pref2.appendChild(normal_fieldset);
// -- -- normal_tabs
var normal_tabs_p = document.createElement("p");
var normal_tabs_checkbox = document.createElement("input");
normal_tabs_checkbox.setAttribute("type", "checkbox");
normal_tabs_checkbox.setAttribute("id", "gm_hfr_vsf_r21_normal_tabs_checkbox");
normal_tabs_p.appendChild(normal_tabs_checkbox);
var normal_tabs_label = document.createElement("label");
normal_tabs_label.textContent =
  " afficher les onglets \u00ab\u202fVos smileys\u202f\u00bb sur la réponse normale";
normal_tabs_label.setAttribute("for", "gm_hfr_vsf_r21_normal_tabs_checkbox");
normal_tabs_p.appendChild(normal_tabs_label);
normal_fieldset.appendChild(normal_tabs_p);
// -- -- hide_smileys_forum
var hide_smileys_forum_p = document.createElement("p");
var hide_smileys_forum_checkbox = document.createElement("input");
hide_smileys_forum_checkbox.setAttribute("type", "checkbox");
hide_smileys_forum_checkbox.setAttribute("id", "gm_hfr_vsf_r21_hide_smileys_forum_checkbox");
hide_smileys_forum_p.appendChild(hide_smileys_forum_checkbox);
var hide_smileys_forum_label = document.createElement("label");
hide_smileys_forum_label.textContent =
  " enlever les smileys personnels et favoris de la réponse normale";
hide_smileys_forum_label.setAttribute("for", "gm_hfr_vsf_r21_hide_smileys_forum_checkbox");
hide_smileys_forum_p.appendChild(hide_smileys_forum_label);
normal_fieldset.appendChild(hide_smileys_forum_p);
// -- -- normal_panel
var normal_panel_p = document.createElement("p");
var normal_panel_checkbox = document.createElement("input");
normal_panel_checkbox.setAttribute("type", "checkbox");
normal_panel_checkbox.setAttribute("id", "gm_hfr_vsf_r21_normal_panel_checkbox");
normal_panel_p.appendChild(normal_panel_checkbox);
var normal_panel_label = document.createElement("label");
normal_panel_label.textContent = " afficher le panneau des favoris à côté de la réponse normale";
normal_panel_label.setAttribute("for", "gm_hfr_vsf_r21_normal_panel_checkbox");
normal_panel_p.appendChild(normal_panel_label);
normal_fieldset.appendChild(normal_panel_p);
// -- -- normal_panel_start_closed
var normal_panel_start_closed_p = document.createElement("p");
var normal_panel_start_closed_checkbox = document.createElement("input");
normal_panel_start_closed_checkbox.setAttribute("type", "checkbox");
normal_panel_start_closed_checkbox.setAttribute("id", "gm_hfr_vsf_r21_normal_panel_start_closed_checkbox");
normal_panel_start_closed_p.appendChild(normal_panel_start_closed_checkbox);
var normal_panel_start_closed_label = document.createElement("label");
normal_panel_start_closed_label.textContent = " toujours afficher le panneau des favoris initialement fermé";
normal_panel_start_closed_label.setAttribute("for", "gm_hfr_vsf_r21_normal_panel_start_closed_checkbox");
normal_panel_start_closed_p.appendChild(normal_panel_start_closed_label);
normal_fieldset.appendChild(normal_panel_start_closed_p);
// -- -- normal_panel_position
var normal_panel_position_p = document.createElement("p");
normal_panel_position_p.appendChild(document.createTextNode("position du panneau des favoris : "));
var normal_panel_position_dessus_label = document.createElement("label");
normal_panel_position_dessus_label.textContent = "dessus ";
normal_panel_position_dessus_label.setAttribute("for", "gm_hfr_vsf_r21_normal_panel_position_dessus_radio");
normal_panel_position_p.appendChild(normal_panel_position_dessus_label);
var normal_panel_position_dessus_radio = document.createElement("input");
normal_panel_position_dessus_radio.setAttribute("type", "radio");
normal_panel_position_dessus_radio.setAttribute("id", "gm_hfr_vsf_r21_normal_panel_position_dessus_radio");
normal_panel_position_dessus_radio.setAttribute("name", "gm_hfr_vsf_r21_normal_panel_position_radio");
normal_panel_position_p.appendChild(normal_panel_position_dessus_radio);
normal_panel_position_p.appendChild(document.createTextNode(" "));
var normal_panel_position_dessous_radio = document.createElement("input");
normal_panel_position_dessous_radio.setAttribute("type", "radio");
normal_panel_position_dessous_radio.setAttribute("id", "gm_hfr_vsf_r21_normal_panel_position_dessous_radio");
normal_panel_position_dessous_radio.setAttribute("name", "gm_hfr_vsf_r21_normal_panel_position_radio");
normal_panel_position_p.appendChild(normal_panel_position_dessous_radio);
var normal_panel_position_dessous_label = document.createElement("label");
normal_panel_position_dessous_label.textContent = " dessous";
normal_panel_position_dessous_label.setAttribute("for", "gm_hfr_vsf_r21_normal_panel_position_dessous_radio");
normal_panel_position_p.appendChild(normal_panel_position_dessous_label);
normal_fieldset.appendChild(normal_panel_position_p);

// rechargement de la page et boutons de validation et de fermeture pour les préférences
var save_close_div = document.createElement("div");
save_close_div.setAttribute("class", "gm_hfr_vsf_r21_save_close_div");
var info_reload_div = document.createElement("div");
info_reload_div.setAttribute("class", "gm_hfr_vsf_r21_info_reload_div");
var info_reload_checkbox = document.createElement("input");
info_reload_checkbox.setAttribute("type", "checkbox");
info_reload_checkbox.setAttribute("id", "gm_hfr_vsf_r21_info_reload_checkbox");
info_reload_div.appendChild(info_reload_checkbox);
var info_reload_label = document.createElement("label");
info_reload_label.textContent = " recharger la page ";
info_reload_label.setAttribute("for", "gm_hfr_vsf_r21_info_reload_checkbox");
info_reload_div.appendChild(info_reload_label);
info_reload_div.appendChild(create_help_button(255,
  "La modification des préférences n'est visible que sur les nouvelles pages ou après le rechargement " +
  "de la page courante. Cette option permet de recharger automatiquement la page courante lors de la " +
  "validation."));
save_close_div.appendChild(info_reload_div);
var save_button = document.createElement("img");
save_button.setAttribute("src", img_save);
save_button.setAttribute("title", "Valider");
save_button.addEventListener("click", save_config_window, false);
save_close_div.appendChild(save_button);
var close_button = document.createElement("img");
close_button.setAttribute("src", img_close);
close_button.setAttribute("title", "Annuler / Fermer");
close_button.addEventListener("click", hide_config_window, false);
save_close_div.appendChild(close_button);
content_pref.appendChild(save_close_div);

// sauvegarde
// -- actions de sauvegarde
var action_save_div = document.createElement("div");
action_save_div.setAttribute("class", "gm_hfr_vsf_r21_action_save");
// -- -- sauvegarde
var save_backup_span = document.createElement("span");
save_backup_span.setAttribute("class", "gm_hfr_vsf_r21_action");
save_backup_span.textContent = "Sauvegarder vos smileys";
save_backup_span.addEventListener("click", save_backup, false);
action_save_div.appendChild(save_backup_span);
var fake_link = document.createElement("a");
fake_link.style.display = "none";
action_save_div.appendChild(fake_link);
// -- -- restauration
var restore_backup_span = document.createElement("span");
restore_backup_span.setAttribute("class", "gm_hfr_vsf_r21_action");
restore_backup_span.textContent = "Restaurer une sauvegarde";
restore_backup_span.addEventListener("click", restore_backup, false);
action_save_div.appendChild(restore_backup_span);
var fake_input = document.createElement("input");
fake_input.setAttribute("type", "file");
fake_input.addEventListener("change", read_backup, false);
fake_input.style.display = "none";
action_save_div.appendChild(fake_input);
content_save.appendChild(action_save_div);
// -- info "sans rechargement" et bouton de fermeture pour la sauvegarde
var save_save_close_div = document.createElement("div");
save_save_close_div.setAttribute("class", "gm_hfr_vsf_r21_save_close_div");
var save_info_reload_div = document.createElement("div");
save_info_reload_div.setAttribute("class", "gm_hfr_vsf_r21_info_reload_div");
var save_info_reload_img = document.createElement("img");
save_info_reload_img.setAttribute("src", img_info);
save_info_reload_div.appendChild(save_info_reload_img);
save_info_reload_div.appendChild(document.createTextNode(" sans rechargement "));
save_info_reload_div.appendChild(create_help_button(255,
  "Les actions sur vos smileys sont prises en compte immédiatement, " +
  "il n'est pas nécessaire de recharger la page."));
save_save_close_div.appendChild(save_info_reload_div);
var save_close_button = document.createElement("img");
save_close_button.setAttribute("src", img_close);
save_close_button.setAttribute("title", "Fermer");
save_close_button.addEventListener("click", hide_config_window, false);
save_save_close_div.appendChild(save_close_button);
content_save.appendChild(save_save_close_div);

// vos smileys
// -- actions sur les smileys
var action_smileys_div = document.createElement("div");
action_smileys_div.setAttribute("class", "gm_hfr_vsf_r21_action_smileys");
// -- -- importer vos smileys personnels et favoris
var import_smileys_span = document.createElement("span");
import_smileys_span.setAttribute("class", "gm_hfr_vsf_r21_action");
import_smileys_span.textContent = "Importer vos smileys personnels et favoris";
import_smileys_span.addEventListener("click", import_smileys, false);
action_smileys_div.appendChild(import_smileys_span);
// -- -- supprimer tous vos smileys
var reset_smileys_span = document.createElement("span");
reset_smileys_span.setAttribute("class", "gm_hfr_vsf_r21_action");
reset_smileys_span.textContent = "Supprimer tous vos smileys";
reset_smileys_span.addEventListener("click", reset_smileys, false);
action_smileys_div.appendChild(reset_smileys_span);
content_smileys.appendChild(action_smileys_div);
// -- info "sans rechargement" et bouton de fermeture pour vos smileys
var smileys_save_close_div = document.createElement("div");
smileys_save_close_div.setAttribute("class", "gm_hfr_vsf_r21_save_close_div");
var smileys_info_reload_div = document.createElement("div");
smileys_info_reload_div.setAttribute("class", "gm_hfr_vsf_r21_info_reload_div");
var smileys_info_reload_img = document.createElement("img");
smileys_info_reload_img.setAttribute("src", img_info);
smileys_info_reload_div.appendChild(smileys_info_reload_img);
smileys_info_reload_div.appendChild(document.createTextNode(" sans rechargement "));
smileys_info_reload_div.appendChild(create_help_button(255,
  "Les actions sur vos smileys sont prises en compte immédiatement, " +
  "il n'est pas nécessaire de recharger la page."));
smileys_save_close_div.appendChild(smileys_info_reload_div);
var smileys_close_button = document.createElement("img");
smileys_close_button.setAttribute("src", img_close);
smileys_close_button.setAttribute("title", "Fermer");
smileys_close_button.addEventListener("click", hide_config_window, false);
smileys_save_close_div.appendChild(smileys_close_button);
content_smileys.appendChild(smileys_save_close_div);

// fonction de validation de la fenêtre de configuration
function save_config_window() {
  // récupération des paramètres
  // -- préférences 1 générales
  let vsf_smileys_number = parseInt(smileys_number_input.value.trim(), 10);
  vsf_smileys_number = Math.max(vsf_smileys_number, 10);
  if(isNaN(vsf_smileys_number)) {
    vsf_smileys_number = vsf_smileys_number_default;
  }
  vsf_alert_new_smiley = alert_new_smiley_checkbox.checked;
  vsf_confirm_delete = confirm_delete_checkbox.checked;
  vsf_include_fav = include_fav_checkbox.checked;
  vsf_sort_fav_by_name = sort_fav_by_name_checkbox.checked;
  vsf_no_space = no_space_checkbox.checked;
  vsf_add_button = add_button_checkbox.checked;
  vsf_add_button_img = add_button_img_input.value.trim();
  if(vsf_add_button_img === "") {
    vsf_add_button_img = vsf_add_button_img_default;
  }
  vsf_panel_img = panel_img_input.value.trim();
  if(vsf_panel_img === "") {
    vsf_panel_img = vsf_panel_img_default;
  }
  vsf_panel_settings_img = panel_settings_img_input.value.trim();
  if(vsf_panel_settings_img === "") {
    vsf_panel_settings_img = vsf_panel_settings_img_default;
  }
  // -- préférences 2 réponses
  vsf_quick_panel = quick_panel_checkbox.checked;
  vsf_quick_panel_start_closed = quick_panel_start_closed_checkbox.checked;
  vsf_quick_panel_top = quick_panel_position_dessus_radio.checked;
  vsf_normal_tabs = normal_tabs_checkbox.checked;
  vsf_hide_smileys_forum = hide_smileys_forum_checkbox.checked;
  vsf_normal_panel = normal_panel_checkbox.checked;
  vsf_normal_panel_start_closed = normal_panel_start_closed_checkbox.checked;
  vsf_normal_panel_top = normal_panel_position_dessus_radio.checked;
  // fermeture de la fenêtre
  hide_config_window();
  // enregistrement des paramètres
  Promise.all([
    // préférences 1 générales
    GM.setValue("vsf_smileys_number", vsf_smileys_number),
    GM.setValue("vsf_alert_new_smiley", vsf_alert_new_smiley),
    GM.setValue("vsf_confirm_delete", vsf_confirm_delete),
    GM.setValue("vsf_include_fav", vsf_include_fav),
    GM.setValue("vsf_sort_fav_by_name", vsf_sort_fav_by_name),
    GM.setValue("vsf_no_space", vsf_no_space),
    GM.setValue("vsf_add_button", vsf_add_button),
    GM.setValue("vsf_add_button_img", vsf_add_button_img),
    GM.setValue("vsf_panel_img", vsf_panel_img),
    GM.setValue("vsf_panel_settings_img", vsf_panel_settings_img),
    // préférences 2 réponses
    GM.setValue("vsf_quick_panel", vsf_quick_panel),
    GM.setValue("vsf_quick_panel_start_closed", vsf_quick_panel_start_closed),
    GM.setValue("vsf_quick_panel_top", vsf_quick_panel_top),
    GM.setValue("vsf_normal_tabs", vsf_normal_tabs),
    GM.setValue("vsf_hide_smileys_forum", vsf_hide_smileys_forum),
    GM.setValue("vsf_normal_panel", vsf_normal_panel),
    GM.setValue("vsf_normal_panel_start_closed", vsf_normal_panel_start_closed),
    GM.setValue("vsf_normal_panel_top", vsf_normal_panel_top),
  ]).then(function() {
    if(info_reload_checkbox.checked) {
      window.location.reload(true);
    }
  });
}

// fonction de fermeture de la fenêtre de configuration
function hide_config_window() {
  config_window.style.opacity = "0";
  config_background.style.opacity = "0";
}

// fonction de fermeture de la fenêtre de configuration par la touche echap
function esc_config_window(p_event) {
  if(p_event.key === "Escape") {
    hide_config_window();
  }
}

// fonction de gestion de la fin de la transition d'affichage / disparition de la fenêtre de configuration
function background_transitionend() {
  if(config_background.style.opacity === "0") {
    config_window.style.visibility = "hidden";
    config_background.style.visibility = "hidden";
    document.removeEventListener("keydown", esc_config_window, false);
  }
  if(config_background.style.opacity === "0.8") {
    document.addEventListener("keydown", esc_config_window, false);
  }
}

// fonction d'affichage de la fenêtre de configuration
function show_config_window(p_event) {
  // initialisation des paramètres
  info_reload_checkbox.checked = false;
  // -- préférences 1 générales
  smileys_number_input.value = vsf_smileys_number;
  alert_new_smiley_checkbox.checked = vsf_alert_new_smiley;
  confirm_delete_checkbox.checked = vsf_confirm_delete;
  include_fav_checkbox.checked = vsf_include_fav;
  sort_fav_by_name_checkbox.checked = vsf_sort_fav_by_name;
  no_space_checkbox.checked = vsf_no_space;
  add_button_checkbox.checked = vsf_add_button;
  add_button_img_input.value = vsf_add_button_img;
  add_button_img_do_test_img();
  panel_img_input.value = vsf_panel_img;
  panel_img_do_test_img();
  panel_settings_img_input.value = vsf_panel_settings_img;
  panel_settings_img_do_test_img();
  // -- préférences 2 réponses
  quick_panel_checkbox.checked = vsf_quick_panel;
  quick_panel_start_closed_checkbox.checked = vsf_quick_panel_start_closed;
  quick_panel_position_dessus_radio.checked = vsf_quick_panel_top;
  quick_panel_position_dessous_radio.checked = !vsf_quick_panel_top;
  normal_tabs_checkbox.checked = vsf_normal_tabs;
  hide_smileys_forum_checkbox.checked = vsf_hide_smileys_forum;
  normal_panel_checkbox.checked = vsf_normal_panel;
  normal_panel_start_closed_checkbox.checked = vsf_normal_panel_start_closed;
  normal_panel_position_dessus_radio.checked = vsf_normal_panel_top;
  normal_panel_position_dessous_radio.checked = !vsf_normal_panel_top;
  // affichage d'un onglet en fonction du contexte
  if(typeof p_event !== "undefined" &&
    typeof p_event.currentTarget.dataset.onglet !== "undefined" &&
    p_event.currentTarget.dataset.onglet === "smileys") {
    // affichage de l'onglet vos smileys
    display_tab("general", "smileys");
  } else {
    // affichage de l'onglet préférences
    display_tab("general", "pref");
  }
  // affichage de la fenêtre
  config_window.style.visibility = "visible";
  config_background.style.visibility = "visible";
  config_window.style.left =
    parseInt((document.documentElement.clientWidth - config_window.offsetWidth) / 2, 10) + "px";
  config_window.style.top =
    parseInt((document.documentElement.clientHeight - config_window.offsetHeight) / 2, 10) + "px";
  config_background.style.width = document.documentElement.scrollWidth + "px";
  config_background.style.height = document.documentElement.scrollHeight + "px";
  config_window.style.opacity = "1";
  config_background.style.opacity = "0.8";
}

// fonction d'ouverture de la fenêtre de configuration sur un clic droit
function mouseup_config(p_event) {
  p_event.preventDefault();
  if(p_event.button === 2) {
    show_config_window(p_event);
  }
}

// ajout d'une entrée de configuration dans le menu greasemonkey si c'est possible (pas gm4 yet)
if(typeof GM_registerMenuCommand !== "undefined") {
  GM_registerMenuCommand(script_name + " -> Configuration", show_config_window);
}

/* ----------------------------------------- */
/* création de la fenêtre d'ajout de favoris */
/* ----------------------------------------- */

// création du voile de fond pour la fenêtre d'ajout de favoris
var add_fav_background = document.createElement("div");
add_fav_background.setAttribute("id", "gm_hfr_vsf_r21_add_fav_background");
add_fav_background.addEventListener("click", hide_add_fav_window, false);
add_fav_background.addEventListener("transitionend", add_fav_background_transitionend, false);
document.body.appendChild(add_fav_background);

// création de la fenêtre d'ajout de favoris
var add_fav_window = document.createElement("div");
add_fav_window.setAttribute("id", "gm_hfr_vsf_r21_add_fav_window");
document.body.appendChild(add_fav_window);

// titre de la fenêtre d'ajout de favoris
var add_fav_title = document.createElement("div");
add_fav_title.setAttribute("class", "gm_hfr_vsf_r21_add_fav_title");
add_fav_window.appendChild(add_fav_title);

// panneau des favoris de la fenêtre d'ajout de favoris
var add_fav_panel = document.createElement("div");
add_fav_panel.setAttribute("id", "gm_hfr_vsf_r21"); // pour avoir un selecteur CSS de plus haut niveau
add_fav_panel.setAttribute("class", "gm_hfr_vsf_r21_panel gm_hfr_vsf_r21_add_fav_panel");
add_fav_panel.setAttribute("data-type", "add_fav");
var add_fav_panel_fake_padding = document.createElement("div");
add_fav_panel_fake_padding.setAttribute("class", "gm_hfr_vsf_r21_fake_padding");
add_fav_panel.appendChild(add_fav_panel_fake_padding);
add_fav_window.appendChild(add_fav_panel);

// info "sans rechargement" et bouton de fermeture
var add_fav_save_close_div = document.createElement("div");
add_fav_save_close_div.setAttribute("class", "gm_hfr_vsf_r21_save_close_div");
var add_fav_info_reload_div = document.createElement("div");
add_fav_info_reload_div.setAttribute("class", "gm_hfr_vsf_r21_info_reload_div");
var add_fav_info_reload_img = document.createElement("img");
add_fav_info_reload_img.setAttribute("src", img_info);
add_fav_info_reload_div.appendChild(add_fav_info_reload_img);
add_fav_info_reload_div.appendChild(document.createTextNode(" sans rechargement "));
add_fav_info_reload_div.appendChild(create_help_button(255,
  "Les actions sur vos smileys sont prises en compte immédiatement, " +
  "il n'est pas nécessaire de recharger la page."));
add_fav_save_close_div.appendChild(add_fav_info_reload_div);
var add_fav_close_button = document.createElement("img");
add_fav_close_button.setAttribute("src", img_close);
add_fav_close_button.setAttribute("title", "Fermer");
add_fav_close_button.addEventListener("click", hide_add_fav_window, false);
add_fav_save_close_div.appendChild(add_fav_close_button);
add_fav_window.appendChild(add_fav_save_close_div);

// fonction de nettoyage de la fenêtre d'ajout de favoris
function clean_add_fav_window() {
  add_fav_title.textContent = "Il n'y a pas de smiley dans ce message";
  add_fav_window.setAttribute("class", "gm_hfr_vsf_r21_no_smiley");
  add_fav_window.style.width = "343px";
  add_fav_window.style.height = "18px";
  add_fav_panel.style.display = "none";
  add_fav_save_close_div.style.display = "none";
  add_fav_close = true;
  // nettoyage des favoris
  let l_smileys = add_fav_panel.querySelectorAll(":scope > div.gm_hfr_vsf_r21_smiley");
  for(let l_smiley of l_smileys) {
    add_fav_panel.removeChild(l_smiley);
  }
}

// fonction de fermeture de la fenêtre d'ajout de favoris
function hide_add_fav_window() {
  add_fav_window.style.opacity = "0";
  add_fav_background.style.opacity = "0";
}

// fonction de fermeture de la fenêtre d'ajout de favoris par la touche echap
function esc_add_fav_window(p_event) {
  if(p_event.key === "Escape") {
    hide_add_fav_window();
  }
}

// fonction de gestion de la fin de la transition d'affichage / disparition de la fenêtre d'ajout de favoris
function add_fav_background_transitionend() {
  if(add_fav_window.style.opacity === "0") {
    add_fav_window.style.visibility = "hidden";
    add_fav_background.style.visibility = "hidden";
    document.removeEventListener("keydown", esc_add_fav_window, false);
    if(add_fav_close) {
      add_fav_window.removeEventListener("click", hide_add_fav_window, false);
    }
  }
  if(add_fav_window.style.opacity === "1") {
    document.addEventListener("keydown", esc_add_fav_window, false);
    if(add_fav_close) {
      add_fav_window.addEventListener("click", hide_add_fav_window, false);
    }
  }
}

// fonction d'affichage de la fenêtre d'ajout de favoris
function show_add_fav_window(p_list) {
  // nettoyage de la fenêtre d'ajout de favoris
  clean_add_fav_window();
  // affichage du titre, du bouton de fermeture et des favoris
  if(p_list.length !== 0) {
    add_fav_title.textContent = "Ajouter des favoris";
    add_fav_window.removeAttribute("class");
    add_fav_window.style.height = "142px";
    add_fav_panel.style.display = "block";
    add_fav_save_close_div.style.display = "block";
    add_fav_close = false;
    // ajout des favoris
    for(let l_smiley of p_list) {
      add_fav_panel.insertBefore(build_smiley({
          c: l_smiley,
          s: 0,
          d: 0,
          f: typeof vsf_smileys[l_smiley] !== "undefined" && vsf_smileys[l_smiley].f,
        }, "favoris add", 0, false),
        add_fav_panel_fake_padding);
    }
  }
  // affichage de la fenêtre
  add_fav_window.style.visibility = "visible";
  add_fav_background.style.visibility = "visible";
  add_fav_window.style.left =
    parseInt((document.documentElement.clientWidth - add_fav_window.offsetWidth) / 2, 10) + "px";
  add_fav_window.style.top =
    parseInt((document.documentElement.clientHeight - add_fav_window.offsetHeight) / 2, 10) + "px";
  add_fav_background.style.width = document.documentElement.scrollWidth + "px";
  add_fav_background.style.height = document.documentElement.scrollHeight + "px";
  add_fav_window.style.opacity = "1";
  add_fav_background.style.opacity = "0.8";
}

// fonction de gestion du clic sur le bouton d'ajout de favoris
function add_fav(p_event) {
  p_event.preventDefault();
  let l_list = [];
  let l_imgs = this.parentElement.parentElement.nextElementSibling.querySelectorAll(
    "img[alt][src^=\"" + base_smileys_url + "\"]:not([src*=\"/message/\"]):not([onload]), " +
    "img[alt][src^=\"" + smileys_persos_url + "\"]:not([src*=\"/tempo/\"]):not([onload])");
  for(let l_img of l_imgs) {
    let l_alt = l_img.getAttribute("alt").toLowerCase().replace(/^:d$/, ":D");
    if(!l_list.includes(l_alt) && (l_alt.startsWith("[:") || l_alt.startsWith(":") || l_alt === ";)")) {
      l_list.push(l_alt);
    }
  }
  show_add_fav_window(l_list);
}

/* ------------------------------------------------ */
/* création de la tooltip d'affichage des mots-clés */
/* ------------------------------------------------ */

// création de la tooltip d'affichage des mots-clés
var keywords_tooltip = document.createElement("div");
keywords_tooltip.setAttribute("id", "gm_hfr_vsf_r21_keywords_tooltip");
document.body.appendChild(keywords_tooltip);

// fonction d'affichage de la tooltip d'affichage des mots-clés
function show_tooltip(p_event) {
  // fermeture de la tooltip (si elle est ouverte ailleurs)
  hide_tooltip();
  tooltip_canceled = false;
  // récupération du smiley
  let l_smiley_img = p_event.currentTarget;
  // récupération des mots-clés et affichage de la tooltip
  keywords_tooltip_timer = window.setTimeout(function() {
    access_keywords(get_keywords, function(p_smiley_img, p_keywords) {
      if(tooltip_canceled) {
        return;
      }
      // ajout du texte (smiley et mots-clés)
      keywords_tooltip.textContent = p_smiley_img.getAttribute("alt") + " {\u00a0" + p_keywords + "\u00a0}";
      // affichage de la tooltip
      keywords_tooltip.style.display = "block";
      // positionnement de la tooltip
      let l_page_width = document.documentElement.scrollWidth;
      let l_tooltip_width = 368;
      let l_tooltip_height = keywords_tooltip.offsetHeight;
      if(window.scrollX + p_event.clientX + 8 + l_tooltip_width < l_page_width) {
        keywords_tooltip.style.left = (window.scrollX + p_event.clientX + 8) + "px";
      } else {
        keywords_tooltip.style.left = (window.scrollX + p_event.clientX - 8 - l_tooltip_width) + "px";
      }
      if(window.scrollY + p_event.clientY - 8 - l_tooltip_height > 0) {
        keywords_tooltip.style.top = (window.scrollY + p_event.clientY - 8 - l_tooltip_height) + "px";
      } else {
        keywords_tooltip.style.top = (window.scrollY + p_event.clientY + 8) + "px";
      }
    }, l_smiley_img);
  }, keywords_tooltip_time);
}

// fonction de fermeture de la tooltip d'affichage des mots-clés
function hide_tooltip(p_event) {
  tooltip_canceled = true;
  window.clearTimeout(keywords_tooltip_timer);
  keywords_tooltip.style.display = "none";
}

// gestion de la fermeture de la tooltip avec un clic n'importe où
document.addEventListener("mousedown", hide_tooltip, false);

// gestion de la fermeture de la tooltip en passant la sourris dessus
keywords_tooltip.addEventListener("mouseover", hide_tooltip, false);

/* -------------------------------------------- */
/* création de la popup d'édition des mots-clés */
/* -------------------------------------------- */

// création de la popup d'édition des mots-clés
var keywords_popup = document.createElement("div");
keywords_popup.setAttribute("id", "gm_hfr_vsf_r21_keywords_popup");
var keywords_nothing = document.createElement("div");
keywords_nothing.setAttribute("class", "gm_hfr_vsf_r21_keywords_nothing");
keywords_nothing.setAttribute("title", script_name);
keywords_nothing.addEventListener("click", hide_popup, false);
var keywords_text = document.createElement("span");
keywords_text.setAttribute("class", "gm_hfr_vsf_r21_keywords_text");
keywords_text.textContent = "Vous devez vous identifier pour modifier les mots-clés.";
keywords_nothing.appendChild(keywords_text);
keywords_popup.appendChild(keywords_nothing);
var keywords_textarea = document.createElement("textarea");
keywords_textarea.setAttribute("class", "gm_hfr_vsf_r21_keywords_textarea");
keywords_textarea.setAttribute("type", "text");
keywords_textarea.setAttribute("spellcheck", "false");
keywords_popup.appendChild(keywords_textarea);
var keywords_div = document.createElement("div");
keywords_div.setAttribute("class", "gm_hfr_vsf_r21_keywords_div");
var keywords_span = document.createElement("span");
keywords_span.setAttribute("class", "gm_hfr_vsf_r21_keywords_span");
keywords_span.textContent = "Mots-clés de ";
keywords_span.setAttribute("title", script_name);
var keywords_span_link = document.createElement("span");
keywords_span_link.setAttribute("class", "gm_hfr_vsf_r21_keywords_span_link");
keywords_span_link.setAttribute("title", "Page du smiley sur le wiki");
keywords_span_link.addEventListener("mousedown", prevent_default, false);
keywords_span_link.addEventListener("mouseup", open_wiki, false);
keywords_span.appendChild(keywords_span_link);
keywords_div.appendChild(keywords_span);
var keywords_throbber = document.createElement("img");
keywords_throbber.setAttribute("class", "gm_hfr_vsf_r21_keywords_throbber");
keywords_throbber.setAttribute("src", img_throbber);
keywords_div.appendChild(keywords_throbber);
var keywords_answer = document.createElement("div");
keywords_answer.setAttribute("class", "gm_hfr_vsf_r21_keywords_answer");
keywords_div.appendChild(keywords_answer);
var keywords_buttons = document.createElement("div");
keywords_buttons.setAttribute("class", "gm_hfr_vsf_r21_keywords_buttons");
var keywords_save = document.createElement("img");
keywords_save.setAttribute("src", img_save);
keywords_save.setAttribute("title", "Valider");
keywords_save.addEventListener("click", save_keywords, false);
keywords_buttons.appendChild(keywords_save);
var keywords_close = document.createElement("img");
keywords_close.setAttribute("src", img_close);
keywords_close.setAttribute("title", "Annuler");
keywords_close.addEventListener("click", hide_popup, false);
keywords_buttons.appendChild(keywords_close);
keywords_div.appendChild(keywords_buttons);
keywords_popup.appendChild(keywords_div);
document.body.appendChild(keywords_popup);

// fonction d'ouverture de la page du smiley sur le wiki dans un nouvel onglet
function open_wiki(p_event) {
  if(p_event.button === 0 || p_event.button === 1) {
    GM.openInTab(get_keywords_url + encodeURIComponent(this.textContent), p_event.button === 1);
  }
}

// fonction d'enregistrement des mots-clés
function save_keywords() {
  keywords_buttons.style.display = "none";
  keywords_throbber.style.display = "block";
  access_keywords(set_keywords, function(p_answer) {
    keywords_answer.textContent = p_answer;
    if(p_answer === "done!") {
      keywords_answer.classList.add("gm_hfr_vsf_r21_success");
    } else if(p_answer === "attendez 5 min") {
      keywords_answer.classList.add("gm_hfr_vsf_r21_wait");
    }
    keywords_throbber.style.display = "none";
    keywords_answer.style.display = "block";
    keywords_span.style.width = "calc(100% - " + (keywords_answer.clientWidth + 10) + "px)";
    window.setTimeout(hide_popup, set_keywords_time);
  }, keywords_popup.dataset.smiley, keywords_textarea.value.trim());
}

// fonction d'affichage de la popup d'édition des mots-clés
function show_popup(p_event) {
  // fermeture de la popup (si elle est ouverte ailleurs)
  hide_popup();
  // positionnement de la popup
  let l_page_width = document.documentElement.scrollWidth;
  let l_page_height = document.documentElement.scrollHeight;
  let l_popup_width = 366;
  let l_popup_height = 80;
  if(hash_check === "") {
    l_popup_width = 426;
    l_popup_height = 40;
  }
  if(window.scrollX + p_event.clientX + 8 + l_popup_width < l_page_width) {
    keywords_popup.style.left = (window.scrollX + p_event.clientX + 8) + "px";
  } else {
    keywords_popup.style.left = (window.scrollX + p_event.clientX - 8 - l_popup_width) + "px";
  }
  if(window.scrollY + p_event.clientY + 8 + l_popup_height < l_page_height) {
    keywords_popup.style.top = (window.scrollY + p_event.clientY + 8) + "px";
  } else {
    keywords_popup.style.top = (window.scrollY + p_event.clientY - 8 - l_popup_height) + "px";
  }
  // vérification de la possibilité d'éditer les mots-clés
  if(hash_check !== "") {
    // récupération du smiley
    let l_smiley_img = p_event.currentTarget;
    let l_code = l_smiley_img.getAttribute("alt");
    // initialisation de la popup
    keywords_popup.dataset.smiley = l_code;
    keywords_popup.classList.remove("gm_hfr_vsf_r21_keywords_no_edit");
    keywords_popup.style.width = "356px";
    keywords_popup.style.height = "70px";
    keywords_nothing.style.display = "none";
    keywords_textarea.value = "";
    keywords_textarea.style.display = "block";
    keywords_span_link.textContent = l_code;
    keywords_span.style.width = "auto";
    keywords_throbber.style.display = "none";
    keywords_answer.textContent = "";
    keywords_answer.classList.remove("gm_hfr_vsf_r21_success");
    keywords_answer.classList.remove("gm_hfr_vsf_r21_wait");
    keywords_answer.style.display = "none";
    keywords_buttons.style.display = "block";
    keywords_div.style.display = "block";
    // récupération des mots-clés et affichage de la popup
    access_keywords(get_keywords, function(p_smiley_img, p_keywords) {
      keywords_textarea.value = add_final_space ? p_keywords + " " : p_keywords;
      keywords_textarea.selectionStart = 0;
      keywords_textarea.selectionEnd = 0;
      // fermeture de la tooltip (pour plus de clareté)
      hide_tooltip();
      // affichage de la popup
      keywords_popup.style.display = "block";
    }, l_smiley_img);
  }
  // l'édition des mots-clés n'est pas possible ici (affichage du texte idoine)
  else {
    // initialisation de la popup
    keywords_popup.classList.add("gm_hfr_vsf_r21_keywords_no_edit");
    keywords_textarea.style.display = "none";
    keywords_div.style.display = "none";
    keywords_nothing.style.display = "flex";
    // fermeture de la tooltip (pour plus de clareté)
    hide_tooltip();
    // affichage de la popup
    keywords_popup.style.display = "block";
  }
}

// fonction de fermeture de la popup d'édition des mots-clés
function hide_popup(p_event) {
  keywords_popup.style.display = "none";
}

/* ------------------ */
/* fonctions globales */
/* ------------------ */

// fonction de conversion du code d'un smiley en son url
function code_to_url(p_code) {
  if(p_code.startsWith("[:")) {
    p_code = p_code.substring(2, p_code.length - 1).split(":");
    if(p_code.length === 1) {
      return smileys_persos_url + p_code[0] + ".gif";
    } else {
      return smileys_persos_url + p_code[1] + "/" + p_code[0] + ".gif";
    }
  } else {
    if(typeof base_smileys[p_code] !== "undefined") {
      return base_smileys_url + base_smileys[p_code] + ".gif";
    } else {
      return extended_smileys_url + p_code.substring(1, p_code.length - 1) + ".gif";
    }
  }
}

// fonction de conversion de la date numérique (YYYYMMJJHHMMSS) en date lisible (DD/MM/YYYY à HH:MM:SS)
function date_to_display(p_date) {
  if(p_date) {
    let l_string = p_date.toString(10);
    return l_string.substring(6, 8) + "/" + l_string.substring(4, 6) + "/" + l_string.substring(0, 4) + " à " +
      l_string.substring(8, 10) + ":" + l_string.substring(10, 12) + ":" + l_string.substring(12);
  } else {
    return p_date;
  }
}

// fonction de fermeture de le tooltip d'affichage et de la popup d'édition des mots-clés par la touche echap
function esc_popup(p_event) {
  if(p_event.key === "Escape") {
    hide_tooltip();
    hide_popup();
  }
}
document.addEventListener("keydown", esc_popup, false);

// fonction d'insertion d'un smiley dans un message
function insert_smiley(p_smiley_img) {
  if(p_smiley_img.dataset.clickable === "true") {
    let l_area = document.querySelector("textarea[id^=\"rep_editin_\"], textarea#content_form");
    if(l_area) {
      let l_smiley = p_smiley_img.getAttribute("alt");
      if(!vsf_no_space) {
        l_smiley = " " + l_smiley + " ";
      }
      let l_start_pos = l_area.selectionStart;
      let l_end_pos = l_area.selectionEnd;
      l_area.value = l_area.value.substring(0, l_start_pos) + l_smiley + l_area.value.substring(l_end_pos);
      l_area.selectionStart = l_start_pos + l_smiley.length;
      l_area.selectionEnd = l_start_pos + l_smiley.length;
      l_area.focus();
    }
  }
}

// fonction de gestion du (double-)clic sur les smileys (insertion dans le message ou édition des mots-clés)
function click_smiley(p_event) {
  window.clearTimeout(click_smiley_timer);
  let l_click_smiley_last_call = Date.now();
  if((l_click_smiley_last_call - click_smiley_last_call) < click_smiley_time) {
    if(this.dataset.editable === "true") {
      show_popup(p_event);
    }
  } else {
    click_smiley_timer = window.setTimeout(insert_smiley, click_smiley_time, this);
  }
  click_smiley_last_call = l_click_smiley_last_call;
}

// fonction de gestion du mouseover sur les smileys (affichage des mots-clés dans le title)
function update_title(p_event) {
  access_keywords(get_keywords, function(p_smiley_img, p_keywords) {
    p_smiley_img.setAttribute("title", p_smiley_img.getAttribute("alt") + " {\u00a0" + p_keywords + "\u00a0}");
  }, this);
}

// fonction générique d'édition des mots-clés des smileys
function set_keywords(p_callback, p_smiley_code, p_keywords) {
  let l_url_params = new URLSearchParams();
  l_url_params.append(set_keywords_arg_modif, "1");
  l_url_params.append(set_keywords_arg_smiley, p_smiley_code);
  l_url_params.append(set_keywords_arg_keywords, p_keywords);
  l_url_params.append(set_keywords_arg_hash_check, hash_check);
  fetch(set_keywords_url, {
    method: "POST",
    mode: "same-origin",
    credentials: "same-origin",
    body: l_url_params,
    cache: "reload",
    referrer: "",
    referrerPolicy: "no-referrer",
  }).then(function(p_response) {
    return p_response.text();
  }).then(function(p_text) {
    if(p_text.includes("Vos modifications sur les mots clés ont été enregistrés avec succès")) {
      p_callback("done!");
    } else if(p_text.includes(
        "Vous ne pouvez pas modifier plusieurs fois le même smiley dans un intervale de 5 minutes")) {
      p_callback("attendez 5 min");
    } else if(p_text.includes(
        "Vous devez être identifié pour modifier les mots clés d'un smiley")) {
      p_callback("vous devez vous identifier");
    } else {
      console.log(script_name + " ERROR set_keywords : ", p_text);
      p_callback("error");
    }
  }).catch(function(e) {
    console.log(script_name + " ERROR fetch set_keywords : ", e);
    p_callback("fetch error");
  });
}

// fonction générique de récupération des mots-clés des smileys
function get_keywords(p_callback, p_smiley_img) {
  fetch(get_keywords_url + encodeURIComponent(p_smiley_img.getAttribute("alt")), {
    method: "GET",
    mode: "same-origin",
    credentials: "omit",
    cache: "reload",
    referrer: "",
    referrerPolicy: "no-referrer",
  }).then(function(p_response) {
    return p_response.text();
  }).then(function(p_text) {
    let l_keywords = p_text.match(smileys_keywords_regexp).pop().trim();
    p_callback(p_smiley_img, l_keywords);
  }).catch(function(e) {
    console.log(script_name + " ERROR fetch get_keywords : ", e);
    p_callback(p_smiley_img, "error");
  });
}

// fonction générique et temporisée d'accès aux mots-clés des smileys
function access_keywords(p_access_function, p_callback, p_param_1, p_param_2) {
  window.clearTimeout(access_keywords_timer);
  let l_last_call = Date.now();
  let l_wait_time = Math.max(access_keywords_time - (l_last_call - access_keywords_last_call), 0);
  access_keywords_last_call = l_last_call;
  access_keywords_timer = window.setTimeout(p_access_function, l_wait_time, p_callback, p_param_1, p_param_2);
}

// fonction pour l'ajout / suppression d'un favori
function switch_favori(p_event) {
  let l_smiley = this.dataset.smiley;
  // favoris -> pas favoris
  if(this.classList.contains("gm_hfr_vsf_r21_favori")) {
    vsf_smileys[l_smiley].f = false;
    GM.setValue("vsf_smileys", JSON.stringify(vsf_smileys));
    // smileys à supprimer
    let l_smileys_to_delete = document.querySelectorAll(
      ".gm_hfr_vsf_r21_panel[data-type=\"panneau\"] > " +
      "div.gm_hfr_vsf_r21_smiley[data-smiley=\"" + l_smiley + "\"]," +
      ".gm_hfr_vsf_r21_div_content_tab[data-type=\"favoris\"] > " +
      "div.gm_hfr_vsf_r21_smiley[data-smiley=\"" + l_smiley + "\"]");
    for(let l_delete of l_smileys_to_delete) {
      l_delete.parentNode.removeChild(l_delete);
    }
    // smileys à inverser
    let l_smileys_to_switch = document.querySelectorAll(
      ".gm_hfr_vsf_r21_panel[data-type=\"add_fav\"] > " +
      "div.gm_hfr_vsf_r21_smiley[data-smiley=\"" + l_smiley + "\"]," +
      ".gm_hfr_vsf_r21_div_content_tab[data-type=\"top\"] > " +
      "div.gm_hfr_vsf_r21_smiley[data-smiley=\"" + l_smiley + "\"]," +
      ".gm_hfr_vsf_r21_div_content_tab[data-type=\"historique\"] > " +
      "div.gm_hfr_vsf_r21_smiley[data-smiley=\"" + l_smiley + "\"]");
    for(let l_switch of l_smileys_to_switch) {
      let l_favori = l_switch.querySelector("div.gm_hfr_vsf_r21_smiley_buttons > " +
        "img.gm_hfr_vsf_r21_button_favori");
      l_favori.classList.remove("gm_hfr_vsf_r21_favori");
      l_favori.setAttribute("title", "Ajouter " + l_smiley + " à vos favoris");
    }
    // panneaux à reconstruire (ajout de smileys)
    if(!vsf_include_fav) {
      let l_list = Object.values(vsf_smileys).filter(p_smiley => !p_smiley.f);
      let l_list_top = Array.from(l_list).sort(sort_by_top);
      let l_list_historique = Array.from(l_list).sort(sort_by_historique);
      populate_panel(l_list_top, top_tab_conf, "top", false);
      populate_panel(l_list_top, top_tab_normal, "top", true);
      populate_panel(l_list_historique, historique_tab_conf, "historique", false);
      populate_panel(l_list_historique, historique_tab_normal, "historique", true);
    }
  }
  // pas favoris -> favoris
  else {
    if(typeof vsf_smileys[l_smiley] !== "undefined") {
      vsf_smileys[l_smiley].f = true;
    } else {
      vsf_smileys[l_smiley] = {
        c: l_smiley,
        s: 0,
        d: 0,
        f: true,
      };
    }
    GM.setValue("vsf_smileys", JSON.stringify(vsf_smileys));
    // smileys à supprimer
    if(!vsf_include_fav) {
      let l_smileys_to_delete = document.querySelectorAll(
        ".gm_hfr_vsf_r21_div_content_tab[data-type=\"top\"] > " +
        "div.gm_hfr_vsf_r21_smiley[data-smiley=\"" + l_smiley + "\"]," +
        ".gm_hfr_vsf_r21_div_content_tab[data-type=\"historique\"] > " +
        "div.gm_hfr_vsf_r21_smiley[data-smiley=\"" + l_smiley + "\"]");
      for(let l_delete of l_smileys_to_delete) {
        l_delete.parentNode.removeChild(l_delete);
      }
    }
    // smileys à inverser
    let l_smileys_to_switch = document.querySelectorAll(
      ".gm_hfr_vsf_r21_panel[data-type=\"add_fav\"] > " +
      "div.gm_hfr_vsf_r21_smiley[data-smiley=\"" + l_smiley + "\"]");
    for(let l_switch of l_smileys_to_switch) {
      let l_favori = l_switch.querySelector("div.gm_hfr_vsf_r21_smiley_buttons > " +
        "img.gm_hfr_vsf_r21_button_favori");
      l_favori.classList.add("gm_hfr_vsf_r21_favori");
      l_favori.setAttribute("title", "Enlever " + l_smiley + " de vos favoris");
    }
    // panneaux à reconstruire (ajout de smileys)
    if(vsf_include_fav) {
      let l_list = Object.values(vsf_smileys);
      let l_list_top = Array.from(l_list).sort(sort_by_top);
      let l_list_historique = Array.from(l_list).sort(sort_by_historique);
      populate_panel(l_list_top, top_tab_conf, "top", false);
      populate_panel(l_list_top, top_tab_normal, "top", true);
      populate_panel(l_list_historique, historique_tab_conf, "historique", false);
      populate_panel(l_list_historique, historique_tab_normal, "historique", true);
    }
    let l_list_fav = Object.values(vsf_smileys).filter(p_smiley => p_smiley.f).sort(sort_by_favoris);
    populate_panel(l_list_fav, quick_panel, "panneau", true);
    populate_panel(l_list_fav, normal_panel, "panneau", true);
    populate_panel(l_list_fav, favoris_tab_conf, "favoris", false);
    populate_panel(l_list_fav, favoris_tab_normal, "favoris", true);
  }
}

// fonction pour la suppression d'un smiley
function delete_smiley(p_event) {
  let l_smiley = this.dataset.smiley;
  if(!vsf_confirm_delete ||
    (vsf_confirm_delete && window.confirm(script_name + " :\n\nVoulez-vous supprimer " + l_smiley +
      " de vos smileys ?") === true)) {
    delete vsf_smileys[l_smiley];
    GM.setValue("vsf_smileys", JSON.stringify(vsf_smileys));
    // smileys à supprimer
    let l_smileys_to_delete = document.querySelectorAll(
      "div.gm_hfr_vsf_r21_smiley[data-smiley=\"" + l_smiley + "\"]");
    for(let l_delete of l_smileys_to_delete) {
      l_delete.parentNode.removeChild(l_delete);
    }
  }
}

// fonction de tri des smileys par top
function sort_by_top(p_s1, p_s2) {
  return p_s2.s - p_s1.s || p_s2.d - p_s1.d || p_s1.c.localeCompare(p_s2.c);
}

// fonction de tri des smileys par historique
function sort_by_historique(p_s1, p_s2) {
  return p_s2.d - p_s1.d || p_s2.s - p_s1.s || p_s1.c.localeCompare(p_s2.c);
}

// fonction de tri des smileys par favoris
function sort_by_favoris(p_s1, p_s2) {
  if(vsf_sort_fav_by_name) {
    return p_s1.c.localeCompare(p_s2.c);
  } else {
    return sort_by_top(p_s1, p_s2);
  }
}

// fonction de nettoyage / remplissage des panneaux et des onglets avec les smileys correspondants
function populate_panel(p_list, p_panel, p_type, p_click) {
  if(p_panel) {
    // nettoyage des smileys existants
    let l_smileys_to_delete = p_panel.querySelectorAll("div.gm_hfr_vsf_r21_smiley");
    for(let l_delete of l_smileys_to_delete) {
      p_panel.removeChild(l_delete);
    }
    // tri des smileys si non fournis
    if(p_list === null) {
      p_list = Object.values(vsf_smileys);
      if(p_type === "favoris" || p_type === "panneau") {
        p_list = p_list.filter(p_smiley => p_smiley.f);
        p_list.sort(sort_by_favoris);
      } else {
        if(!vsf_include_fav) {
          p_list = p_list.filter(p_smiley => !p_smiley.f);
        }
        if(p_type === "top") {
          p_list.sort(sort_by_top);
        } else {
          p_list.sort(sort_by_historique);
        }
      }
    }
    // ajout des smileys
    let l_limit = p_type === "favoris" ? p_list.length : Math.min(vsf_smileys_number, p_list.length);
    for(let l_item = 0; l_item < l_limit; ++l_item) {
      let l_number = p_type === "historique" ? l_item + 1 : p_list[l_item].s;
      p_panel.insertBefore(build_smiley(p_list[l_item], p_type, l_number, p_click), p_panel.lastElementChild);
    }
  }
}

// fonction de création des smileys dans les panneaux et onglets
// p_type : "top", "historique", "favoris", "panneau", "favoris add"
function build_smiley(p_smiley, p_type, p_number, p_click) {
  // div du smiley
  let l_smiley = document.createElement("div");
  l_smiley.setAttribute("class", "gm_hfr_vsf_r21_smiley");
  l_smiley.setAttribute("data-smiley", p_smiley.c);
  // img du smiley
  let l_img = document.createElement("img");
  l_img.setAttribute("src", code_to_url(p_smiley.c));
  l_img.setAttribute("title", p_smiley.c);
  l_img.setAttribute("alt", p_smiley.c);
  if(p_click) {
    l_img.dataset.clickable = "true";
  } else {
    l_img.dataset.clickable = "false";
  }
  if(p_smiley.c.startsWith("[:")) {
    if(in_title) {
      l_img.addEventListener("mouseover", update_title, false);
    } else {
      l_img.removeAttribute("title");
      l_img.addEventListener("mouseover", show_tooltip, false);
      l_img.addEventListener("mouseout", hide_tooltip, false);
    }
    l_img.dataset.editable = "true";
  } else {
    l_img.dataset.editable = "false";
  }
  if(p_click || p_smiley.c.startsWith("[:")) {
    l_img.addEventListener("click", click_smiley, false);
  }
  l_smiley.appendChild(l_img);
  if(p_type !== "panneau") {
    // div des boutons
    let l_buttons = document.createElement("div");
    l_buttons.setAttribute("class", "gm_hfr_vsf_r21_smiley_buttons");
    // le nombre (de fois ou ordre)
    if(p_type !== "favoris add") {
      let l_number = document.createElement("div");
      l_number.setAttribute("class", "gm_hfr_vsf_r21_smiley_number");
      l_number.textContent = p_number;
      if(p_type === "historique") {
        l_number.setAttribute("title", p_smiley.d ?
          "Utilisé le " + date_to_display(p_smiley.d) : "Jamais utilisé");
      } else {
        l_number.setAttribute("title", p_smiley.s ?
          "Utilisé " + p_smiley.s + " fois" : "Jamais utilisé");
      }
      l_buttons.appendChild(l_number);
    }
    // le bouton favori
    let l_favori = document.createElement("img");
    l_favori.setAttribute("src", img_star);
    if(p_smiley.f) {
      l_favori.setAttribute("class", "gm_hfr_vsf_r21_button_favori gm_hfr_vsf_r21_favori");
      l_favori.setAttribute("title", "Enlever " + p_smiley.c + " de vos favoris");
    } else {
      l_favori.setAttribute("class", "gm_hfr_vsf_r21_button_favori");
      l_favori.setAttribute("title", "Ajouter " + p_smiley.c + " à vos favoris");
    }
    l_favori.dataset.smiley = p_smiley.c;
    l_favori.addEventListener("click", switch_favori, false);
    l_buttons.appendChild(l_favori);
    // le bouton supprimer
    if(p_type !== "favoris add") {
      let l_delete = document.createElement("img");
      l_delete.setAttribute("class", "gm_hfr_vsf_r21_button_delete");
      l_delete.setAttribute("src", img_reset);
      l_delete.setAttribute("title", "Supprimer " + p_smiley.c + " de vos smileys");
      l_delete.dataset.smiley = p_smiley.c;
      l_delete.addEventListener("click", delete_smiley, false);
      l_buttons.appendChild(l_delete);
    }
    l_smiley.appendChild(l_buttons);
  }
  return l_smiley;
}

// fonction d'affichage d'un onglet en cliquant
function show_tab(p_event) {
  // sauvegarde de l'onglet sélectionné pour vos smileys
  if(this.dataset.parent === "normal") {
    GM.setValue("vsf_normal_tabs_last_tab", this.dataset.tab)
  }
  if(this.dataset.parent === "conf") {
    GM.setValue("vsf_smileys_last_tab", this.dataset.tab)
  }
  // sauvegarde de l'onglet sélectionné pour les préférences
  if(this.dataset.parent === "preferences") {
    GM.setValue("vsf_preferences_last_tab", this.dataset.tab)
  }
  // affichage de l'onglet sélectionné
  display_tab(this.dataset.parent, this.dataset.tab);
}

// fonction d'affichage d'un onglet spécifique
function display_tab(p_parent, p_tab) {
  for(let l_tab in all_tabs[p_parent]) {
    all_tabs[p_parent][l_tab].tab.removeEventListener("click", show_tab, false);
    all_tabs[p_parent][l_tab].tab.addEventListener("click", show_tab, false);
    all_tabs[p_parent][l_tab].tab.classList.remove("gm_hfr_vsf_r21_tab_active");
    all_tabs[p_parent][l_tab].content.style.display = "none";
  }
  all_tabs[p_parent][p_tab].tab.removeEventListener("click", show_tab, false);
  all_tabs[p_parent][p_tab].tab.classList.add("gm_hfr_vsf_r21_tab_active");
  all_tabs[p_parent][p_tab].content.style.display = "block";
  all_tabs[p_parent][p_tab].content.parentElement.scrollTop = 0;
  all_tabs[p_parent][p_tab].content.parentElement.scrollLeft = 0;
}

// fonction de déplacement (monter <-> descendre) des onglets vos smileys sur la réponse normale
function top_down() {
  let l_go_top = normal_top_down.dataset.status === "down";
  GM.setValue("vsf_normal_tabs_top", l_go_top);
  normal_top_down.dataset.status = l_go_top ? "top" : "down";
  normal_top_down.setAttribute("title", l_go_top ? "Descendre" : "Monter");
  normal_top_down.setAttribute("src", l_go_top ? img_down : img_up);
  normal_row.querySelector("th.repCase1 > div:first-of-type").style.display = l_go_top ? "none" : "block";
}

// fonction de création des onglets vos smileys et leur contenu
function create_vos_smileys(normal) {
  // div principale
  let l_vos_smileys = document.createElement("div");
  if(normal) {
    l_vos_smileys.setAttribute("class", "gm_hfr_vsf_r21_vos_smileys_normal");
    l_vos_smileys.appendChild(document.createElement("br"));
  }
  all_tabs[normal ? "normal" : "conf"] = {};
  // div des onglets
  let l_tabs = document.createElement("div");
  l_tabs.setAttribute("class", "gm_hfr_vsf_r21_div_tabs");
  // -- le bouton monter <-> descendre
  if(normal) {
    normal_top_down = document.createElement("img");
    normal_top_down.setAttribute("class", "gm_hfr_vsf_r21_img_tab");
    normal_top_down.dataset.status = "down";
    normal_top_down.setAttribute("title", "Monter");
    normal_top_down.setAttribute("src", img_up);
    normal_top_down.setAttribute("alt", "VSF");
    normal_top_down.addEventListener("click", top_down, false);
    if(vsf_normal_tabs_top) {
      top_down();
    }
    l_tabs.appendChild(normal_top_down);
  }
  // -- l'onglet top
  let l_span_top = document.createElement("span");
  l_span_top.setAttribute("class", "gm_hfr_vsf_r21_span_tab");
  l_span_top.dataset.parent = normal ? "normal" : "conf";
  l_span_top.dataset.tab = "top";
  l_span_top.textContent = "Top";
  l_span_top.addEventListener("click", show_tab, false);
  all_tabs[normal ? "normal" : "conf"].top = {
    tab: l_span_top,
  };
  l_tabs.appendChild(l_span_top);
  // -- l'onglet historique
  let l_span_historique = document.createElement("span");
  l_span_historique.setAttribute("class", "gm_hfr_vsf_r21_span_tab");
  l_span_historique.dataset.parent = normal ? "normal" : "conf";
  l_span_historique.dataset.tab = "historique";
  l_span_historique.textContent = "Historique";
  l_span_historique.addEventListener("click", show_tab, false);
  all_tabs[normal ? "normal" : "conf"].historique = {
    tab: l_span_historique,
  };
  l_tabs.appendChild(l_span_historique);
  // -- l'onglet favoris
  let l_span_favoris = document.createElement("span");
  l_span_favoris.setAttribute("class", "gm_hfr_vsf_r21_span_tab");
  l_span_favoris.dataset.parent = normal ? "normal" : "conf";
  l_span_favoris.dataset.tab = "favoris";
  l_span_favoris.textContent = "Favoris";
  l_span_favoris.addEventListener("click", show_tab, false);
  all_tabs[normal ? "normal" : "conf"].favoris = {
    tab: l_span_favoris,
  };
  l_tabs.appendChild(l_span_favoris);
  // -- le bouton configuration
  if(normal) {
    let l_conf_button = document.createElement("img");
    l_conf_button.setAttribute("class", "gm_hfr_vsf_r21_img_tab");
    l_conf_button.setAttribute("title", "Configuration");
    l_conf_button.setAttribute("src", img_conf);
    l_conf_button.setAttribute("alt", "VSF");
    l_conf_button.addEventListener("contextmenu", prevent_default, false);
    l_conf_button.addEventListener("click", show_config_window, false);
    l_conf_button.addEventListener("mouseup", mouseup_config, false);
    l_tabs.appendChild(l_conf_button);
  }
  l_vos_smileys.appendChild(l_tabs);
  // la div du contenu
  let l_content = document.createElement("div");
  l_content.setAttribute("id", "gm_hfr_vsf_r21"); // pour avoir un selecteur CSS de plus haut niveau
  l_content.setAttribute("class", "gm_hfr_vsf_r21_div_content");
  if(normal) {
    l_content.setAttribute("class", "gm_hfr_vsf_r21_div_content gm_hfr_vsf_r21_div_content_normal");
  }
  // -- la div top
  let l_content_top = document.createElement("div");
  l_content_top.setAttribute("class",
    "gm_hfr_vsf_r21_div_content_tab gm_hfr_vsf_r21_div_content_tab_smileys");
  l_content_top.setAttribute("data-type", "top");
  let l_content_top_text = document.createElement("div");
  l_content_top_text.setAttribute("class", "gm_hfr_vsf_r21_div_content_tab_text");
  l_content_top_text.textContent = "Vos " + vsf_smileys_number + " smileys les plus utilisés";
  l_content_top.appendChild(l_content_top_text);
  let l_fake_padding_top = document.createElement("div");
  l_fake_padding_top.setAttribute("class", "gm_hfr_vsf_r21_fake_padding");
  l_content_top.appendChild(l_fake_padding_top);
  // -- -- ajout des smileys top
  populate_panel(null, l_content_top, "top", normal ? true : false);
  if(normal) {
    top_tab_normal = l_content_top;
  } else {
    top_tab_conf = l_content_top;
  }
  all_tabs[normal ? "normal" : "conf"].top.content = l_content_top;
  l_content.appendChild(l_content_top);
  // -- la div historique
  let l_content_historique = document.createElement("div");
  l_content_historique.setAttribute("class",
    "gm_hfr_vsf_r21_div_content_tab gm_hfr_vsf_r21_div_content_tab_smileys");
  l_content_historique.setAttribute("data-type", "historique");
  let l_content_historique_text = document.createElement("div");
  l_content_historique_text.setAttribute("class", "gm_hfr_vsf_r21_div_content_tab_text");
  l_content_historique_text.textContent = "Vos " + vsf_smileys_number + " smileys les plus récents";
  l_content_historique.appendChild(l_content_historique_text);
  let l_fake_padding_historique = document.createElement("div");
  l_fake_padding_historique.setAttribute("class", "gm_hfr_vsf_r21_fake_padding");
  l_content_historique.appendChild(l_fake_padding_historique);
  // -- -- ajout des smileys historique
  populate_panel(null, l_content_historique, "historique", normal ? true : false);
  if(normal) {
    historique_tab_normal = l_content_historique;
  } else {
    historique_tab_conf = l_content_historique;
  }
  all_tabs[normal ? "normal" : "conf"].historique.content = l_content_historique;
  l_content.appendChild(l_content_historique);
  // -- la div favoris
  let l_content_favoris = document.createElement("div");
  l_content_favoris.setAttribute("class",
    "gm_hfr_vsf_r21_div_content_tab gm_hfr_vsf_r21_div_content_tab_smileys");
  l_content_favoris.setAttribute("data-type", "favoris");
  let l_content_favoris_text = document.createElement("div");
  l_content_favoris_text.setAttribute("class", "gm_hfr_vsf_r21_div_content_tab_text");
  l_content_favoris_text.textContent = "Tous vos smileys favoris";
  l_content_favoris.appendChild(l_content_favoris_text);
  let l_fake_padding_favoris = document.createElement("div");
  l_fake_padding_favoris.setAttribute("class", "gm_hfr_vsf_r21_fake_padding");
  l_content_favoris.appendChild(l_fake_padding_favoris);
  // -- -- ajout des smileys favoris
  populate_panel(null, l_content_favoris, "favoris", normal ? true : false);
  if(normal) {
    favoris_tab_normal = l_content_favoris;
  } else {
    favoris_tab_conf = l_content_favoris;
  }
  all_tabs[normal ? "normal" : "conf"].favoris.content = l_content_favoris;
  l_content.appendChild(l_content_favoris);
  l_vos_smileys.appendChild(l_content);
  // ajout de la div principal dans le document
  if(normal) {
    l_content.style.width = vsf_normal_tabs_width;
    l_content.style.height = vsf_normal_tabs_height;
    // gestion de la mémorisation des dimensions du contenu
    function save_content_sizes() {
      window.clearTimeout(panel_size_timer);
      panel_size_timer = window.setTimeout(function() {
        let l_content_width = Math.max(parseInt(l_content.style.width), 283) + "px";
        let l_content_height = Math.max(parseInt(l_content.style.height), 238) + "px";
        if(l_content_width === last_content_width && l_content_height === last_content_height) {
          return;
        }
        last_content_width = l_content_width;
        last_content_height = l_content_height;
        l_content.style.width = l_content_width;
        l_content.style.height = l_content_height;
        GM.setValue("vsf_normal_tabs_width", l_content_width);
        GM.setValue("vsf_normal_tabs_height", l_content_height);
      }, panel_size_time);
    }
    let l_observer_content = new MutationObserver(save_content_sizes);
    l_observer_content.observe(l_content, {
      attributes: true,
      childList: false,
      characterData: false,
      subtree: false,
      attributeFilter: ["style"],
    });
    normal_row.querySelector("th.repCase1").appendChild(l_vos_smileys);
  } else {
    content_smileys.insertBefore(l_vos_smileys, action_smileys_div);
  }
  // affichage du dernier onglet sélectionné
  display_tab(normal ? "normal" : "conf", normal ? vsf_normal_tabs_last_tab : vsf_smileys_last_tab);
}

// fonction d'import des smileys personnels et favoris
function import_smileys() {
  fetch("https://forum.hardware.fr/user/editprofil.php?config=hfr.inc&page=5", {
    method: "GET",
    mode: "same-origin",
    credentials: "same-origin",
    cache: "reload",
    referrer: "",
    referrerPolicy: "no-referrer"
  }).then(function(p_response) {
    return p_response.text();
  }).then(function(p_response) {
    // la page des smileys personnels et favoris
    let l_parser = new DOMParser();
    let l_document = l_parser.parseFromString(p_response, "text/html");
    let l_smileys = [];
    // les smlileys personnels
    let l_nb_persos = 0;
    let l_persos = l_document.documentElement.querySelectorAll("form[name=\"ONSENFOU\"] table.main " +
      "tr.profil:nth-child(3) td.profilCase3:nth-child(3) img[alt][src^=\"" + smileys_persos_url + "\"]");
    for(let l_perso of l_persos) {
      ++l_nb_persos;
      l_smileys.push("[:" + l_perso.getAttribute("alt") + "]");
    }
    // les smileys favoris
    let l_nb_favoris = 0;
    let l_favoris = l_document.documentElement.querySelectorAll("form[name=\"ONSENFOU\"] table.main " +
      "tr.profil:nth-child(4) td.profilCase3:nth-child(3) img[alt][src^=\"" + smileys_persos_url + "\"]");
    for(let l_favori of l_favoris) {
      ++l_nb_favoris;
      l_smileys.push(l_favori.getAttribute("alt"));
    }
    // ajout des smileys
    for(let l_smiley of l_smileys) {
      if(typeof vsf_smileys[l_smiley] !== "undefined") {
        vsf_smileys[l_smiley].f = true;
      } else {
        vsf_smileys[l_smiley] = {
          c: l_smiley,
          s: 0,
          d: 0,
          f: true,
        };
      }
    }
    GM.setValue("vsf_smileys", JSON.stringify(vsf_smileys));
    // mise à jour des panneaux et onglets
    populate_panel(null, quick_panel, "panneau", true);
    populate_panel(null, normal_panel, "panneau", true);
    populate_panel(null, top_tab_conf, "top", false);
    populate_panel(null, top_tab_normal, "top", true);
    populate_panel(null, historique_tab_conf, "historique", false);
    populate_panel(null, historique_tab_normal, "historique", true);
    populate_panel(null, favoris_tab_conf, "favoris", false);
    populate_panel(null, favoris_tab_normal, "favoris", true);
    // message final
    // -- 0 0
    if(l_nb_persos === 0 && l_nb_favoris === 0) {
      alert(script_name + " :\n\nAucun smiley personnel ni aucun smiley favori n'a été importé dans vos " +
        "smileys favoris.");
    }
    // -- 1 0
    else if(l_nb_persos === 1 && l_nb_favoris === 0) {
      alert(script_name + " :\n\nUn smiley personnel a été importé dans vos smileys favoris.");
    }
    // -- + 0
    else if(l_nb_persos > 1 && l_nb_favoris === 0) {
      alert(script_name + " :\n\n" + l_nb_persos + " smileys personnels ont été importés dans vos smileys " +
        "favoris.");
    }
    // -- 0 1
    else if(l_nb_persos === 0 && l_nb_favoris === 1) {
      alert(script_name + " :\n\nUn smiley favori a été importé dans vos smileys favoris.");
    }
    // -- 0 +
    else if(l_nb_persos === 0 && l_nb_favoris > 1) {
      alert(script_name + " :\n\n" + l_nb_favoris + " smileys favoris ont été importés dans vos smileys " +
        "favoris.");
    }
    // -- 1 1
    else if(l_nb_persos === 1 && l_nb_favoris === 1) {
      alert(script_name + " :\n\nUn smiley personnel et un smiley favori ont été importés dans vos smileys " +
        "favoris.");
    }
    // -- + 1
    else if(l_nb_persos > 1 && l_nb_favoris === 1) {
      alert(script_name + " :\n\n" + l_nb_persos + " smileys personnels et un smiley favori ont été importés " +
        "dans vos smileys favoris.");
    }
    // -- 1 +
    else if(l_nb_persos === 1 && l_nb_favoris > 1) {
      alert(script_name + " :\n\nUn smiley personnel et " + l_nb_favoris + " smileys favoris ont été importés " +
        "dans vos smileys favoris.");
    }
    // -- + +
    else if(l_nb_persos > 1 && l_nb_favoris > 1) {
      alert(script_name + " :\n\n" + l_nb_persos + " smileys personnels et " + l_nb_favoris + " smileys " +
        "favoris ont été importés dans vos smileys favoris.");
    }
  }).catch(function(e) {
    console.log(script_name + " ERROR fetch import_smileys : " + e);
  });
}

// fonction de suppression de tous les smileys
function reset_smileys() {
  // demande de confirmation
  if(window.confirm(script_name + " :\n\nAttention, vous êtes sur le point de supprimer tous vos smileys !" +
      "\n\nÊtes-vous sûr de vouloir continuer ?") === true) {
    // suppression de tous les smileys
    vsf_smileys = {};
    GM.setValue("vsf_smileys", vsf_smileys_default);
    // nettoyage des panneaux et onglets
    populate_panel([], quick_panel, "panneau", true);
    populate_panel([], normal_panel, "panneau", true);
    populate_panel([], top_tab_conf, "top", false);
    populate_panel([], top_tab_normal, "top", true);
    populate_panel([], historique_tab_conf, "historique", false);
    populate_panel([], historique_tab_normal, "historique", true);
    populate_panel([], favoris_tab_conf, "favoris", false);
    populate_panel([], favoris_tab_normal, "favoris", true);
  }
}

// fonction de creation d'une date numérique (YYYYMMDDHHMMSS) à partir d'une date fournie
function create_date_number(p_date) {
  let l_year = p_date.getFullYear() + "";
  let l_month = (p_date.getMonth() + 1) < 10 ? "0" + (p_date.getMonth() + 1) : (p_date.getMonth() + 1) + "";
  let l_day = p_date.getDate() < 10 ? "0" + p_date.getDate() : p_date.getDate() + "";
  let l_hours = p_date.getHours() < 10 ? "0" + p_date.getHours() : p_date.getHours() + "";
  let l_minutes = p_date.getMinutes() < 10 ? "0" + p_date.getMinutes() : p_date.getMinutes() + "";
  let l_seconds = p_date.getSeconds() < 10 ? "0" + p_date.getSeconds() : p_date.getSeconds() + "";
  return parseInt(l_year + l_month + l_day + l_hours + l_minutes + l_seconds, 10);
}

// fonction de convertion de la date des smileys pour créer une sauvegrade
// (pour la rétro-compatibilité)
function convert_date_for_save(p_date) {
  // YYYYMMDDHHMMSS (number) -> YYYY/M/D H:M:S (string)
  if(p_date) {
    let l_string = p_date.toString(10);
    return l_string.substring(0, 4) + "/" + parseInt(l_string.substring(4, 6), 10) + "/" +
      parseInt(l_string.substring(6, 8), 10) + " " + parseInt(l_string.substring(8, 10), 10) + ":" +
      parseInt(l_string.substring(10, 12), 10) + ":" + parseInt(l_string.substring(12), 10);
  } else {
    return "1970/1/1 0:0:0";
  }
}

// fonction de convertion de la date des smileys de la sauvegarde pour la restauration
// (pour la rétro-compatibilité)
function convert_date_for_restore(p_date) {
  //  YYYY/M/D H:M:S (string) -> YYYYMMDDHHMMSS (number)
  if(p_date === "1970/1/1 0:0:0") {
    return 0;
  } else {
    return create_date_number(new Date(p_date));
  }
}

// fonction de conversion du format de stockage des smileys pour créer une sauvegrade
// (pour la rétro-compatibilité)
function convert_smileys_for_save() {
  let l_smileys_for_save = {};
  let l_smileys = Object.values(vsf_smileys);
  for(let l_smiley of l_smileys) {
    l_smileys_for_save[l_smiley.c] = {
      c: l_smiley.c,
      s: l_smiley.s,
      d: convert_date_for_save(l_smiley.d),
    };
    if(l_smiley.f === true) {
      l_smileys_for_save[l_smiley.c].fav = true;
    }
  }
  return l_smileys_for_save;
}

// fonction de convertion du format de stockage des smileys de la sauvegarde pour la restauration
// (pour la rétro-compatibilité)
function convert_smileys_for_restore(p_smileys) {
  let l_smileys_for_restore = {};
  let l_smileys = Object.values(p_smileys);
  for(let l_smiley of l_smileys) {
    l_smileys_for_restore[l_smiley.c] = {
      c: l_smiley.c,
      s: l_smiley.s,
      d: convert_date_for_restore(l_smiley.d),
      f: typeof l_smiley.fav !== "undefined" && l_smiley.fav === true,
    };
  }
  return l_smileys_for_restore;
}

// fonction de création d'une sauvegarde
function save_backup() {
  let l_blob = new Blob([JSON.stringify(convert_smileys_for_save(), null, 2)], {
    type: "application/json",
  });
  let l_url = window.URL.createObjectURL(l_blob);
  fake_link.setAttribute("href", l_url);
  fake_link.setAttribute("download", "hfr_vos_smileys_favoris_" + create_date_number(new Date()) + ".json");
  fake_link.click();
}

// function de gestion de la récuperation du fichier de sauvegarde lors de la restauration
function read_backup(p_event) {
  let l_file = this.files[0];
  l_file.text().then(function(p_text) {
    let l_backup;
    try {
      l_backup = JSON.parse(p_text);
    } catch (e) {
      alert(script_name + " :\n\nLe fichier fourni pour la restauration n'a pas pu être lu.");
      return;
    }
    // demande de confirmation
    if(window.confirm(script_name + " :\n\nAttention, cette opération va remplacer tous vos smileys actuels " +
        "par ceux de la sauvegarde !\n\nÊtes-vous sûr de vouloir continuer ?") === true) {
      // restauration des smileys
      vsf_smileys = convert_smileys_for_restore(l_backup);
      GM.setValue("vsf_smileys", JSON.stringify(vsf_smileys));
      // mise à jour des panneaux et onglets
      populate_panel(null, quick_panel, "panneau", true);
      populate_panel(null, normal_panel, "panneau", true);
      populate_panel(null, top_tab_conf, "top", false);
      populate_panel(null, top_tab_normal, "top", true);
      populate_panel(null, historique_tab_conf, "historique", false);
      populate_panel(null, historique_tab_normal, "historique", true);
      populate_panel(null, favoris_tab_conf, "favoris", false);
      populate_panel(null, favoris_tab_normal, "favoris", true);
    }
  }).catch(function(e) {
    console.log(script_name + " ERROR read_backup : " + e);
  });
}

// function de restauration d'une sauvegarde
function restore_backup() {
  fake_input.value = "";
  fake_input.click();
}

// fonction de récupération de la liste des smileys présents dans un message pour les statistiques
function get_smiley_list(p_message) {
  let l_smiley_list = {};
  if(p_message !== "") {
    let l_smileys = [];
    // suppression des "https?:/" pour éviter une fausse détection du smiley ":/"
    p_message = p_message.replace(/http:\//gi, " ");
    // récupération des smileys persos [:roger21], [:roger21:1], ...
    let l_list = p_message.match(smileys_persos_regexp);
    if(l_list !== null) {
      l_smileys = l_smileys.concat(l_list);
    }
    // suppression des smileys persos
    p_message = p_message.replace(smileys_persos_regexp, " ");
    // récupération des smileys de base étendus :lol:, :crazy:, ...
    for(let l_regexp of extended_smiley_regexps) {
      let l_list = p_message.match(l_regexp);
      if(l_list !== null) {
        l_smileys = l_smileys.concat(l_list);
      }
      // suppression des smileys de base étendus
      p_message = p_message.replace(l_regexp, " ");
    }
    // récupération des smileys de base :o, :/, :D, ...
    p_message = p_message.replace(/:d/g, ":D");
    for(let l_regexp of base_smiley_regexps) {
      let l_list = p_message.match(l_regexp);
      if(l_list !== null) {
        l_smileys = l_smileys.concat(l_list);
      }
      // suppression des smileys de base
      p_message = p_message.replace(l_regexp, " ");
    }
    // tri
    l_smileys.sort((p_1, p_2) => p_1.localeCompare(p_2));
    // comptage
    for(let l_smiley of l_smileys) {
      if(typeof l_smiley_list[l_smiley] === "undefined") {
        l_smiley_list[l_smiley] = {
          code: l_smiley,
          count: 1,
        };
      } else {
        ++l_smiley_list[l_smiley].count;
      }
    }
  }
  return l_smiley_list;
}

// fonction de suppression des quotes dans les messages à analyser
function remove_quotes(p_message) {
  // suppression des quotemsg (quotes normale)
  while(quotemsg_regexp.test(p_message)) {
    p_message = p_message.replace(quotemsg_regexp, " ");
  }
  // suppression des citation (quotes bidouillées)
  while(citation_regexp.test(p_message)) {
    p_message = p_message.replace(citation_regexp, " ");
  }
  return p_message;
}

// fonction d'analyse du message avant envoie pour mettre à jour les statistiques des smileys
function analyse_message(p_event, p_message_number) {
  // récupération du message initial
  let l_initial_message = typeof p_message_number === "undefined" ?
    initial_message : initial_message_rapide[p_message_number];
  // récupération du message à poster
  let l_message_to_post = typeof p_message_number === "undefined" ?
    document.querySelector("div#mesdiscussions.mesdiscussions form[name=\"hop\"] " +
      "textarea#content_form.reponserapide, div#mesdiscussions.mesdiscussions form#hop table.main " +
      "textarea#content_form.contenu").value :
    document.querySelector("div#mesdiscussions.mesdiscussions " +
      "table.messagetable tbody tr.message td.messCase2 div#para" + p_message_number +
      " textarea#rep_editin_" + p_message_number).value;
  // récupération des smileys dans le message initial et dans le message à poster
  let l_imitial_smiley_list = get_smiley_list(remove_quotes(l_initial_message.trim().toLowerCase()));
  let l_smiley_list_to_post = get_smiley_list(remove_quotes(l_message_to_post.trim().toLowerCase()));
  // mise a jour des stats
  let l_smileys_to_post = Object.values(l_smiley_list_to_post);
  let l_new_smileys = [];
  let l_date = create_date_number(new Date());
  for(let l_smiley of l_smileys_to_post) {
    // comparaison des deux messages sur l'utilisation de chaque smiley
    if(typeof l_imitial_smiley_list[l_smiley.code] !== "undefined") {
      l_smiley.count -= l_imitial_smiley_list[l_smiley.code].count;
    }
    // le smiley a été utilisé dans le nouveau message
    if(l_smiley.count > 0) {
      if(typeof vsf_smileys[l_smiley.code] !== "undefined") {
        // le smiley est déjà présent dans les stats (maj des stats et de la date)
        vsf_smileys[l_smiley.code].s += l_smiley.count;
        vsf_smileys[l_smiley.code].d = l_date;
      } else {
        // le smiley n'est pas déjà présent dans les stats (création)
        vsf_smileys[l_smiley.code] = {
          c: l_smiley.code,
          s: l_smiley.count,
          d: l_date,
          f: false,
        };
        // enregistrement des nouveau smiley pour le signalement
        l_new_smileys.push(l_smiley.code);
      }
    }
  }
  // enregistrement des stats
  GM.setValue("vsf_smileys", JSON.stringify(vsf_smileys));
  // mise à jour des panneaux et des onglets qui dépendent des stats en cas d'édition rapide
  if(typeof p_message_number !== "undefined") {
    populate_panel(null, top_tab_conf, "top", false);
    populate_panel(null, historique_tab_conf, "historique", false);
    if(!vsf_sort_fav_by_name) {
      populate_panel(null, quick_panel, "panneau", true);
      populate_panel(null, favoris_tab_conf, "favoris", false);
    }
  }
  // signalement des nouveaux smileys trouvés
  if(vsf_alert_new_smiley && l_new_smileys.length > 0) {
    let l_alert_message = "";
    if(l_new_smileys.length === 1) {
      l_alert_message = "Un nouveau smiley a été trouvé dans votre message :\n\n" + l_new_smileys[0];
    } else {
      l_alert_message = l_new_smileys.length + " nouveaux smileys ont été trouvés dans votre message :\n\n" +
        l_new_smileys.join("\n");
    }
    alert(script_name + " :\n\n" + l_alert_message);
  }
  // log
  console.log(script_name + " | analyse_message | smileys distincts avant/après/nouveaux dans les stats : " +
    Object.values(l_imitial_smiley_list).length + "/" + l_smileys_to_post.length + "/" + l_new_smileys.length +
    (typeof p_message_number !== "undefined" ? " | edition rapide " + p_message_number : ""));
}

// fonction de gestion de l'ajout de l'analyse du message avant envoie sur l'édition rapide
function edition_rapide() {
  // récupération du numéro du message
  let l_number = this.getAttribute("onclick").match(/^edit_in\((.*?)\); return false$/)[1].split(",")[3];
  // récupération du champ d'édition rapide
  let l_edition_rapide_timer = window.setInterval(function() {
    let l_edition_rapide = document.querySelector("div#mesdiscussions.mesdiscussions " +
      "table.messagetable tbody tr.message td.messCase2 div#para" + l_number +
      " textarea#rep_editin_" + l_number);
    if(l_edition_rapide !== null) {
      window.clearInterval(l_edition_rapide_timer);
      // sauvegarde du message initiale
      initial_message_rapide[l_number] = l_edition_rapide.value;
      // ajout de la fonction d'analyse du message sur le bonton de validation
      let l_validate_button = l_edition_rapide.parentElement
        .querySelector("input[type=\"button\"][onclick^=\"edit_in_post('hfr.inc'\"]");
      if(l_validate_button) {
        l_validate_button.addEventListener("click", function(p_event) {
          analyse_message(p_event, l_number);
        }, true);
      }
    }
  }, edition_rapide_time);
}

/* --------------------------------------------------------- */
/* récupération des paramètres et mise en place des éléments */
/* --------------------------------------------------------- */

Promise.all([
  // global
  GM.getValue("vsf_smileys_number", vsf_smileys_number_default),
  GM.getValue("vsf_alert_new_smiley", vsf_alert_new_smiley_default),
  GM.getValue("vsf_confirm_delete", vsf_confirm_delete_default),
  GM.getValue("vsf_include_fav", vsf_include_fav_default),
  GM.getValue("vsf_sort_fav_by_name", vsf_sort_fav_by_name_default),
  GM.getValue("vsf_no_space", vsf_no_space_default),
  GM.getValue("vsf_smileys_last_tab", vsf_smileys_last_tab_default),
  GM.getValue("vsf_preferences_last_tab", vsf_preferences_last_tab_default),
  GM.getValue("vsf_add_button", vsf_add_button_default),
  GM.getValue("vsf_add_button_img", vsf_add_button_img_default),
  GM.getValue("vsf_panel_img", vsf_panel_img_default),
  GM.getValue("vsf_panel_settings_img", vsf_panel_settings_img_default),
  GM.getValue("vsf_smileys", vsf_smileys_default),
  // réponse rapide
  GM.getValue("vsf_quick_panel", vsf_quick_panel_default),
  GM.getValue("vsf_quick_panel_closed", vsf_quick_panel_closed_default),
  GM.getValue("vsf_quick_panel_start_closed", vsf_quick_panel_start_closed_default),
  GM.getValue("vsf_quick_panel_top", vsf_quick_panel_top_default),
  GM.getValue("vsf_quick_panel_width", vsf_quick_panel_width_default),
  GM.getValue("vsf_quick_panel_height", vsf_quick_panel_height_default),
  // réponse normale
  GM.getValue("vsf_normal_tabs", vsf_normal_tabs_default),
  GM.getValue("vsf_normal_tabs_top", vsf_normal_tabs_top_default),
  GM.getValue("vsf_normal_tabs_last_tab", vsf_normal_tabs_last_tab_default),
  GM.getValue("vsf_normal_tabs_width", vsf_normal_tabs_width_default),
  GM.getValue("vsf_normal_tabs_height", vsf_normal_tabs_height_default),
  GM.getValue("vsf_hide_smileys_forum", vsf_hide_smileys_forum_default),
  GM.getValue("vsf_normal_panel", vsf_normal_panel_default),
  GM.getValue("vsf_normal_panel_closed", vsf_normal_panel_closed_default),
  GM.getValue("vsf_normal_panel_start_closed", vsf_normal_panel_start_closed_default),
  GM.getValue("vsf_normal_panel_top", vsf_normal_panel_top_default),
  GM.getValue("vsf_normal_panel_height", vsf_normal_panel_height_default),
]).then(function([
  // global
  vsf_smileys_number_value,
  vsf_alert_new_smiley_value,
  vsf_confirm_delete_value,
  vsf_include_fav_value,
  vsf_sort_fav_by_name_value,
  vsf_no_space_value,
  vsf_smileys_last_tab_value,
  vsf_preferences_last_tab_value,
  vsf_add_button_value,
  vsf_add_button_img_value,
  vsf_panel_img_value,
  vsf_panel_settings_img_value,
  vsf_smileys_value,
  // réponse rapide
  vsf_quick_panel_value,
  vsf_quick_panel_closed_value,
  vsf_quick_panel_start_closed_value,
  vsf_quick_panel_top_value,
  vsf_quick_panel_width_value,
  vsf_quick_panel_height_value,
  // réponse normale
  vsf_normal_tabs_value,
  vsf_normal_tabs_top_value,
  vsf_normal_tabs_last_tab_value,
  vsf_normal_tabs_width_value,
  vsf_normal_tabs_height_value,
  vsf_hide_smileys_forum_value,
  vsf_normal_panel_value,
  vsf_normal_panel_closed_value,
  vsf_normal_panel_start_closed_value,
  vsf_normal_panel_top_value,
  vsf_normal_panel_height_value,
]) {
  // initialisation des variables globales
  // -- global
  vsf_smileys_number = vsf_smileys_number_value;
  vsf_alert_new_smiley = vsf_alert_new_smiley_value;
  vsf_confirm_delete = vsf_confirm_delete_value;
  vsf_include_fav = vsf_include_fav_value;
  vsf_sort_fav_by_name = vsf_sort_fav_by_name_value;
  vsf_no_space = vsf_no_space_value;
  vsf_smileys_last_tab = vsf_smileys_last_tab_value;
  vsf_preferences_last_tab = vsf_preferences_last_tab_value;
  vsf_add_button = vsf_add_button_value;
  vsf_add_button_img = vsf_add_button_img_value;
  vsf_panel_img = vsf_panel_img_value;
  vsf_panel_settings_img = vsf_panel_settings_img_value;
  vsf_smileys = JSON.parse(vsf_smileys_value);
  // -- réponse rapide
  vsf_quick_panel = vsf_quick_panel_value;
  vsf_quick_panel_closed = vsf_quick_panel_closed_value;
  vsf_quick_panel_start_closed = vsf_quick_panel_start_closed_value;
  vsf_quick_panel_top = vsf_quick_panel_top_value;
  vsf_quick_panel_width = vsf_quick_panel_width_value;
  vsf_quick_panel_height = vsf_quick_panel_height_value;
  // -- réponse normale
  vsf_normal_tabs = vsf_normal_tabs_value;
  vsf_normal_tabs_top = vsf_normal_tabs_top_value;
  vsf_normal_tabs_last_tab = vsf_normal_tabs_last_tab_value;
  vsf_normal_tabs_width = vsf_normal_tabs_width_value;
  vsf_normal_tabs_height = vsf_normal_tabs_height_value;
  vsf_hide_smileys_forum = vsf_hide_smileys_forum_value;
  vsf_normal_panel = vsf_normal_panel_value;
  vsf_normal_panel_closed = vsf_normal_panel_closed_value;
  vsf_normal_panel_start_closed = vsf_normal_panel_start_closed_value;
  vsf_normal_panel_top = vsf_normal_panel_top_value;
  vsf_normal_panel_height = vsf_normal_panel_height_value;
  // affichage du bouton d'ajout de favoris sur les posts
  if(vsf_add_button) {
    let l_toolbars = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable tbody " +
      "tr.message td.messCase1 + td.messCase2 div.toolbar");
    for(let l_toolbar of l_toolbars) {
      let l_add_div = document.createElement("div");
      l_add_div.setAttribute("class", "right");
      let l_add_img = document.createElement("img");
      l_add_img.setAttribute("class", "gm_hfr_vsf_r21_add_button");
      l_add_img.setAttribute("src", vsf_add_button_img);
      l_add_img.setAttribute("alt", "VSF");
      l_add_img.setAttribute("title", "Ajouter des favoris\n(clic droit pour configurer)");
      l_add_img.addEventListener("contextmenu", prevent_default, false);
      l_add_img.addEventListener("click", add_fav, false);
      l_add_img.addEventListener("mouseup", mouseup_config, false);
      l_add_div.appendChild(l_add_img);
      let l_spacer_div = l_toolbar.querySelector("div.spacer");
      l_toolbar.insertBefore(l_add_div, l_spacer_div);
    }
  }
  // réponse rapide
  let l_quick_response = document.querySelector("div#mesdiscussions form[name=\"hop\"] " +
    "textarea#content_form.reponserapide");
  if(l_quick_response) {
    // correnction du style de la réponse rapide
    l_quick_response.style.marginTop = "2px";
    l_quick_response.style.marginBottom = "2px";
    // ajout de la fonction d'analyse du message sur le bonton de validation
    let l_validate_button = document.querySelector("div#mesdiscussions form[name=\"hop\"] " +
      "input#submitreprap[type=\"submit\"][name=\"submit\"]");
    if(l_validate_button) {
      l_validate_button.addEventListener("click", analyse_message, true);
    }
    // modification des boutons d'édition rapide pour permettre d'inclure la fonction d'analyse du message
    let l_edit_raps = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable tbody " +
      "tr.message td.messCase2 div.toolbar a[onclick^=\"edit_in('hfr.inc'\"] " +
      "img[title=\"Edition rapide\"][alt=\"Edition rapide\"]");
    for(let l_edit_rap of l_edit_raps) {
      l_edit_rap.parentElement.addEventListener("click", edition_rapide, false);
    }
    // affichage du panneau des favoris en réponse rapide
    if(vsf_quick_panel) {
      // création du panneau des favoris
      quick_panel = document.createElement("span");
      quick_panel.setAttribute("id", "gm_hfr_vsf_r21"); // pour avoir un selecteur CSS de plus haut niveau
      quick_panel.setAttribute("class", "gm_hfr_vsf_r21_panel gm_hfr_vsf_r21_quick_panel");
      quick_panel.setAttribute("data-type", "panneau");
      let l_fake_padding = document.createElement("div");
      l_fake_padding.setAttribute("class", "gm_hfr_vsf_r21_fake_padding");
      quick_panel.appendChild(l_fake_padding);
      quick_panel.style.width = vsf_quick_panel_width;
      quick_panel.style.height = vsf_quick_panel_height;
      quick_br = document.createElement("br");
      quick_br.setAttribute("class", "gm_hfr_vsf_r21_quick_br");
      // gestion de la mémorisation des dimensions du panneau
      function save_quick_panel_sizes() {
        quick_buttons.style.height = (Math.max(parseInt(quick_panel.style.height), 54) + 6) + "px";
        window.clearTimeout(panel_size_timer);
        panel_size_timer = window.setTimeout(function() {
          let l_quick_panel_width = Math.max(parseInt(quick_panel.style.width), 100) + "px";
          let l_quick_panel_height = Math.max(parseInt(quick_panel.style.height), 54) + "px";
          if(l_quick_panel_width === last_quick_panel_width && l_quick_panel_height === last_quick_panel_height) {
            return;
          }
          last_quick_panel_width = l_quick_panel_width;
          last_quick_panel_height = l_quick_panel_height;
          quick_panel.style.width = l_quick_panel_width;
          quick_panel.style.height = l_quick_panel_height;
          GM.setValue("vsf_quick_panel_width", l_quick_panel_width);
          GM.setValue("vsf_quick_panel_height", l_quick_panel_height);
        }, panel_size_time);
      }
      let l_observer_quick_panel = new MutationObserver(save_quick_panel_sizes);
      l_observer_quick_panel.observe(quick_panel, {
        attributes: true,
        childList: false,
        characterData: false,
        subtree: false,
        attributeFilter: ["style"],
      });
      // ajout des smileys
      populate_panel(null, quick_panel, "panneau", true);
      // ajout du lien d'ouverture et des boutons
      // -- fonction de gestion du clic sur le lien d'ouverture
      function open_quick_panel() {
        GM.setValue("vsf_quick_panel_closed", false);
        quick_link.style.display = "none";
        quick_panel.style.display = "inline-block";
        quick_br.style.display = "unset";
        quick_buttons.style.display = "inline-flex";
        window.scrollBy(0, quick_panel.offsetHeight + 2);
      }
      // -- fonction de gestion du clic sur le bouton de fermeture
      function close_quick_panel() {
        GM.setValue("vsf_quick_panel_closed", true);
        quick_link.style.display = "inline";
        quick_panel.style.display = "none";
        quick_br.style.display = "none";
        quick_buttons.style.display = "none";
      }
      // -- lien d'ouverture du panneau
      quick_link = document.createElement("span");
      quick_link.setAttribute("class", "gm_hfr_vsf_r21_quick_link s1Ext");
      quick_link.setAttribute("title", "Afficher vos favoris\n(clic droit pour configurer)");
      quick_link.addEventListener("contextmenu", prevent_default, false);
      quick_link.addEventListener("click", open_quick_panel, false);
      quick_link.addEventListener("mouseup", mouseup_config, false);
      let l_quick_link_img = document.createElement("img");
      l_quick_link_img.setAttribute("class", "gm_hfr_vsf_r21_quick_link_img");
      l_quick_link_img.setAttribute("src", vsf_panel_img);
      l_quick_link_img.setAttribute("alt", "VSF");
      let l_quick_link_span = document.createElement("span");
      l_quick_link_span.setAttribute("class", "gm_hfr_vsf_r21_quick_link_span");
      l_quick_link_span.textContent = "Vos favoris";
      quick_link.appendChild(l_quick_link_img);
      quick_link.appendChild(l_quick_link_span);
      l_quick_response.parentNode.insertBefore(quick_link,
        l_quick_response.previousElementSibling.previousElementSibling);
      l_quick_response.parentNode.insertBefore(document.createTextNode(" "), quick_link);
      // -- div des boutons
      quick_buttons = document.createElement("div");
      quick_buttons.setAttribute("class", "gm_hfr_vsf_r21_quick_buttons");
      quick_buttons.style.height = "calc(" + quick_panel.style.height + " + 6px)";
      // -- bouton de fermeture du panneau
      let l_close_button = document.createElement("img");
      l_close_button.setAttribute("class", "gm_hfr_vsf_r21_quick_buttons_img " +
        "gm_hfr_vsf_r21_quick_buttons_img_top");
      l_close_button.setAttribute("src", img_close);
      l_close_button.setAttribute("alt", "VSF");
      l_close_button.setAttribute("title", "Fermer vos favoris");
      l_close_button.addEventListener("click", close_quick_panel, false);
      quick_buttons.appendChild(l_close_button);
      // -- bouton d'ouverture de la fenêtre de configuration
      let l_conf_button = document.createElement("img");
      l_conf_button.setAttribute("class", "gm_hfr_vsf_r21_quick_buttons_img " +
        "gm_hfr_vsf_r21_quick_buttons_img_bottom");
      l_conf_button.setAttribute("src", vsf_panel_settings_img);
      l_conf_button.setAttribute("alt", "VSF");
      l_conf_button.setAttribute("title", "Gérer vos smileys");
      l_conf_button.dataset.onglet = "smileys";
      l_conf_button.addEventListener("contextmenu", prevent_default, false);
      l_conf_button.addEventListener("click", show_config_window, false);
      l_conf_button.addEventListener("mouseup", mouseup_config, false);
      quick_buttons.appendChild(l_conf_button);
      // positionnement du panneau et des boutons
      if(vsf_quick_panel_top) {
        quick_panel.classList.add("gm_hfr_vsf_r21_quick_panel_top");
        quick_buttons.classList.add("gm_hfr_vsf_r21_quick_panel_top");
        l_quick_response.parentNode.insertBefore(quick_panel, l_quick_response);
        l_quick_response.parentNode.insertBefore(quick_buttons, l_quick_response);
        l_quick_response.parentNode.insertBefore(quick_br, l_quick_response);
      } else {
        let l_next = l_quick_response.nextSibling;
        quick_panel.classList.add("gm_hfr_vsf_r21_quick_panel_bottom");
        quick_buttons.classList.add("gm_hfr_vsf_r21_quick_panel_bottom");
        l_quick_response.parentNode.insertBefore(quick_br, l_next);
        l_quick_response.parentNode.insertBefore(quick_panel, l_next);
        l_quick_response.parentNode.insertBefore(quick_buttons, l_next);
      }
      // affichage initial du panneau
      if(!vsf_quick_panel_start_closed && !vsf_quick_panel_closed) {
        open_quick_panel();
      } else {
        close_quick_panel();
      }
    }
  }
  // réponse normale
  let l_normal_response = document.querySelector("div#mesdiscussions form#hop table.main " +
    "textarea#content_form.contenu");
  if(l_normal_response) {
    normal_row = l_normal_response.parentElement.parentElement;
    // suppression des br en trop
    let l_brs = normal_row.querySelectorAll("td.repCase2 div.spacer + br, th.repCase1 > br");
    for(let l_br of l_brs) {
      l_br.parentNode.removeChild(l_br);
    }
    // ajout d'un br mieux placés
    let l_new_br = normal_row.querySelector("th.repCase1 > div:first-of-type > div.center:first-child > " +
      "br:first-child");
    if(!l_new_br) {
      var l_div_smiley = normal_row.querySelector("th.repCase1 > div:first-of-type > div.center:first-child > " +
        "div.smiley");
      if(l_div_smiley) {
        l_div_smiley.parentNode.removeChild(l_div_smiley.previousSibling);
        l_div_smiley.parentNode.removeChild(l_div_smiley.previousElementSibling);
        l_div_smiley.parentNode.insertBefore(document.createElement("br"), l_div_smiley.previousElementSibling);
        l_div_smiley.parentNode.insertBefore(document.createElement("br"), l_div_smiley);
        l_div_smiley.parentNode.insertBefore(document.createElement("br"), l_div_smiley);
      }
    }
    // correnction du style de la réponse normale
    l_normal_response.style.marginTop = "0";
    l_normal_response.style.marginBottom = "2px";
    l_normal_response.style.width = "calc(100% - 6px)";
    l_normal_response.style.resize = "vertical";
    // suvegarde du message initial
    initial_message = l_normal_response.value;
    // ajout de la fonction d'analyse du message sur le bonton de validation
    let l_validate_button = normal_row.querySelector("td.repCase2 input[type=\"submit\"][name=\"submit\"]");
    if(l_validate_button) {
      l_validate_button.addEventListener("click", analyse_message, true);
    }
    // affichage des onglets vos smileys en réponse normale
    if(vsf_normal_tabs) {
      create_vos_smileys(true);
    }
    // masquage des smileys personnels et favoris du forum
    if(vsf_hide_smileys_forum) {
      let l_dynamic_smilies = document.getElementById("dynamic_smilies");
      if(l_dynamic_smilies) {
        while(l_dynamic_smilies.hasChildNodes()) {
          l_dynamic_smilies.removeChild(l_dynamic_smilies.lastChild);
        }
      }
    }
    // affichage du panneau des favoris en réponse normal
    if(vsf_normal_panel) {
      // création du panneau des favoris
      normal_panel = document.createElement("span");
      normal_panel.setAttribute("id", "gm_hfr_vsf_r21"); // pour avoir un selecteur CSS de plus haut niveau
      normal_panel.setAttribute("class", "gm_hfr_vsf_r21_panel gm_hfr_vsf_r21_normal_panel");
      normal_panel.setAttribute("data-type", "panneau");
      let l_fake_padding = document.createElement("div");
      l_fake_padding.setAttribute("class", "gm_hfr_vsf_r21_fake_padding");
      normal_panel.appendChild(l_fake_padding);
      normal_panel.style.height = vsf_normal_panel_height;
      normal_br = document.createElement("br");
      normal_br.setAttribute("class", "gm_hfr_vsf_r21_normal_br");
      // gestion de la mémorisation de la heuteur du panneau
      function save_normal_panel_height() {
        window.clearTimeout(panel_size_timer);
        panel_size_timer = window.setTimeout(function() {
          let l_normal_panel_height = Math.max(parseInt(normal_panel.style.height), 54) + "px";
          if(l_normal_panel_height === last_normal_panel_height) {
            return;
          }
          last_normal_panel_height = l_normal_panel_height;
          normal_panel.style.height = l_normal_panel_height
          GM.setValue("vsf_normal_panel_height", l_normal_panel_height);
        }, panel_size_time);
      }
      let l_observer_normal_panel = new MutationObserver(save_normal_panel_height);
      l_observer_normal_panel.observe(normal_panel, {
        attributes: true,
        childList: false,
        characterData: false,
        subtree: false,
        attributeFilter: ["style"],
      });
      // ajout des smileys
      populate_panel(null, normal_panel, "panneau", true);
      // ajout des boutons
      let l_spacer = normal_row.querySelector("td.repCase2 div.left + div.spacer");
      // -- fonction de gestion de l'ouverture / fermeture du panneau
      function open_close_normal_panel() {
        let l_do_open = normal_button.dataset.status === "closed";
        GM.setValue("vsf_normal_panel_closed", !l_do_open);
        normal_button.dataset.status = l_do_open ? "opened" : "closed";
        normal_br.style.display = l_do_open ? "unset" : "none";
        normal_panel.style.display = l_do_open ? "inline-block" : "none";
        normal_button.setAttribute("title", l_do_open ? "Fermer vos favoris" : "Afficher vos favoris");
        normal_button.firstElementChild.setAttribute("src", l_do_open ? img_close : vsf_panel_img);
      }
      // -- bouton d'ouverture / fermeture du panneau
      normal_button = document.createElement("div");
      normal_button.setAttribute("class", "left gm_hfr_vsf_r21_normal_button");
      normal_button.setAttribute("title", "Afficher vos favoris");
      normal_button.dataset.status = "closed";
      normal_button.addEventListener("click", open_close_normal_panel, false);
      let l_normal_button_img = document.createElement("img");
      l_normal_button_img.setAttribute("class", "gm_hfr_vsf_r21_normal_button_img");
      l_normal_button_img.setAttribute("src", vsf_panel_img);
      l_normal_button_img.setAttribute("alt", "VSF");
      normal_button.appendChild(l_normal_button_img);
      l_spacer.parentNode.insertBefore(normal_button, l_spacer);
      // -- bouton d'ouverture de la fenêtre de configuration
      let l_conf_button = document.createElement("div");
      l_conf_button.setAttribute("class", "left gm_hfr_vsf_r21_normal_button");
      l_conf_button.setAttribute("title", "Gérer vos smileys");
      l_conf_button.dataset.onglet = "smileys";
      l_conf_button.addEventListener("contextmenu", prevent_default, false);
      l_conf_button.addEventListener("click", show_config_window, false);
      l_conf_button.addEventListener("mouseup", mouseup_config, false);
      let l_conf_button_img = document.createElement("img");
      l_conf_button_img.setAttribute("class", "gm_hfr_vsf_r21_normal_button_img");
      l_conf_button_img.setAttribute("src", vsf_panel_settings_img);
      l_conf_button_img.setAttribute("alt", "VSF");
      l_conf_button.appendChild(l_conf_button_img);
      l_spacer.parentNode.insertBefore(l_conf_button, l_spacer);
      // positionnement du panneau
      if(vsf_normal_panel_top) {
        l_normal_response.parentNode.insertBefore(normal_panel, l_normal_response);
        l_normal_response.parentNode.insertBefore(normal_br, l_normal_response);
      } else {
        l_normal_response.parentNode.insertBefore(normal_panel, l_normal_response.nextSibling);
        l_normal_response.parentNode.insertBefore(normal_br, l_normal_response.nextSibling);
      }
      // affichage initial du panneau
      if(!vsf_normal_panel_start_closed && !vsf_normal_panel_closed) {
        open_close_normal_panel();
      }
    }
  }
  // création des onglets vos smileys dans la fenêtre de configuration
  create_vos_smileys();
  // affichage du dernier onglet sélectionné pour les préférences dans la fenêtre de configuration
  display_tab("preferences", vsf_preferences_last_tab);
});
