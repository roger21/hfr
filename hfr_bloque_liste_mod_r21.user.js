// ==UserScript==
// @name          [HFR] Bloque liste mod_r21
// @version       4.2.0
// @namespace     roger21.free.fr
// @description   Permet de filtrer les messages des utilisateurs.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    roger21
// @modifications Refonte du code, ajout d'une fenêtre de configuration et ajout d'options de filtrage par catégorie, par topic et par utilisateur.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_bloque_liste_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_bloque_liste_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_bloque_liste_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.registerMenuCommand
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2021-2022 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 3669 $

// historique :
// 4.2.0 (03/12/2022) :
// - gestion du masquage des messages de la page de réponse normale
// 4.1.2 (23/08/2022) :
// - nouvelle correction de la détection des citations
// 4.1.1 (10/01/2022) :
// - signalement de la présence d'une citation non bloquée sur l'aperçu des messages ->
// contenant une citation bloquée
// 4.1.0 (21/07/2021) :
// - ajout du filtrage intermédiaire "sauf pour les citations" pour les utilisateurs
// - désactivation de l'option "sauf pour les citations" si l'option "masquer les aperçus" n'est pas cochée
// - ajout d'un style sur les popups lorsque la bloque liste est désactivée
// 4.0.1 (21/07/2021) :
// - correction de la détection des citations (signalé par cosmoschtroumpf)
// 4.0.0 (20/07/2021) :
// - refonte du code / nouveau départ, ajout d'une fenêtre de configuration ->
// et ajout d'options de filtrage par catégorie, par topic et par utilisateur

/* ------------- */
/* option en dur */
/* ------------- */

// activer les box-shadow (true) ou pas (false) sur les popups
const box_shadow = true;

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
let gmMenu = GM.registerMenuCommand || GM_registerMenuCommand;

/* ---------- */
/* les images */
/* ---------- */

let img_bl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABTklEQVR42n2SSY8BQRzFfUzfwhYkODDEOr4EJ0FiSRwkQkTCZJyMQ6tpy9CWSXoIQyzd5k1VNSfdXvKSOtSv3vtXlcl0E%2FF6ITidGDC7XBi43SAeD3ffbPaajCTGE9CTlM9j8AwWozFdcEcILrsdxHBYHxZj%2BuBPp8NT78lPQUWWMc5mMUylMEqn8TuZ4E9VwcZ5BBOveKarokCMRI3BebWKea2GVauFZaOBCa04LZdxPZ%2F5nIbgd7uNVbPJD1jW63w9LZVuYOQRHCaTHBznchhlMvgqFPh6VqlA7nahHo%2F4DIWMQXayst%2FjvN1qpk9x3Gw0MKgD3j8AqyfRlAWtKtHZpGIRM5quHA4g%2FhcdkN4Y0%2Fqjj3WfuteD%2FPZ%2Bc5e3IP6A3jvGoV4uvOr1dOLVmFkSM68aCD6CxOeD4HBAsNs122yarVYIFgs3%2B%2Fj3%2Ff%2B40dLJkfsmTwAAAABJRU5ErkJggg%3D%3D";
let img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
let img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
let img_add = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAYElEQVR42mNgoBawXKhpC8RLgPgMFIPYtvg0cAHxaiD%2BjwOD5LiwacSnCa4Zm%2FNQFJ17cBaMsWi2Rda4hASNS5A1nkHX8PbzWzDGYsAZqmgk26nkBQ7Z0UFRAiA7yZEKADXvBrx5cOoRAAAAAElFTkSuQmCC";
let img_remove = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAbElEQVR42mNgoBbYIStrB8SLgfgMFIPYdvg0cAHxaiD%2BjwOD5LiwacSnCa4Zm%2FPgCk63t2NlQ7EdssbFyAr%2F%2F%2Fv3%2F%2FqKFWAMYqNpXoys8QyyqTANMAPQbDxDFY1kO5W8wCE7OihKAGQnOVIBAHwiAQDE5M%2BDAAAAAElFTkSuQmCC";
let img_reset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";
let img_info = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";
let img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";

/* -------------- */
/* les constantes */
/* -------------- */

const text_encoder = new TextEncoder();
const text_decoder = new TextDecoder();
const zero_width_space = ",226,128,139,";
const opacity_value_format = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
});
const do_debug = false;

/* ------------------------- */
/* les paramètres par défaut */
/* ------------------------- */

const gmhfrblr21_img_bl_default = img_bl;
const gmhfrblr21_color_hidden_default = true;
const gmhfrblr21_color_hidden_color_default = "#ffbfbf";
const gmhfrblr21_color_hidden_opacity_default = "1";
const gmhfrblr21_color_posts_with_hidden_default = true;
const gmhfrblr21_color_posts_with_hidden_color_default = "#ffd3aa";
const gmhfrblr21_color_posts_with_hidden_opacity_default = "1";
const gmhfrblr21_always_color_snippets_default = true;
const gmhfrblr21_parameters_default =
  "{\"global\":{\"a\":true,\"d\":false,\"h\":false,\"s\":false,\"e\":false}," +
  "\"prive\":{\"a\":true,\"d\":false,\"h\":false,\"s\":false,\"e\":false}}"; // json
const gmhfrblr21_bloque_liste_default = "[]"; // json
const gmhfrblr21_always_hide_snippets_list_default = "[]"; // json
const gmhfrblr21_soft_always_hide_snippets_list_default = "[]"; // json

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

let gmhfrblr21_img_bl;
let gmhfrblr21_color_hidden;
let gmhfrblr21_color_hidden_color;
let gmhfrblr21_color_hidden_opacity;
let gmhfrblr21_color_posts_with_hidden;
let gmhfrblr21_color_posts_with_hidden_color;
let gmhfrblr21_color_posts_with_hidden_opacity;
let gmhfrblr21_always_color_snippets;
let gmhfrblr21_parameters;
let gmhfrblr21_bloque_liste;
let gmhfrblr21_always_hide_snippets_list;
let gmhfrblr21_soft_always_hide_snippets_list;
let user_quote_color;
let config_position;
let category = null;
let topic = null;
let profile_2;
let profile_1;
let profile_active;
let profile;
let profile_type;

/* -------------- */
/* les styles css */
/* -------------- */

let l_style = document.createElement("style");
l_style.setAttribute("type", "text/css");
l_style.textContent =
  // styles pour la fenêtre d'aide
  "#gmhfrblr21_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:1003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;text-align:justify;}" +
  "img.gmhfrblr21_help_button{cursor:help;vertical-align:text-bottom;}" +
  // styles pour la fenêtre de configuration
  "#gmhfrblr21_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gmhfrblr21_config_window{position:fixed;min-width:200px;height:auto;background-color:#ffffff;z-index:1002;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;color:#000000;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_main_title{font-size:16px;text-align:center;cursor:default;" +
  "font-weight:bold;margin:0 0 12px;}" +
  "#gmhfrblr21_config_window fieldset{margin:0 0 12px;border:1px solid #888888;padding:8px 10px 10px;}" +
  "#gmhfrblr21_config_window legend{font-size:14px;cursor:default;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_icon_div{display:flex;justify-content:center;margin:0 4px;" +
  "align-items:center;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_icon_div > *{display:block;}" +
  "#gmhfrblr21_config_window img.gmhfrblr21_test{max-width:16px;max-height:16px;}" +
  "#gmhfrblr21_config_window input[type=\"text\"]{padding:0px 1px;border:1px solid #c0c0c0;font-size:12px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;margin:0 4px;width:350px;}" +
  "#gmhfrblr21_config_window img.gmhfrblr21_reset{cursor:pointer;}" +
  "#gmhfrblr21_config_window p{margin:0 4px;cursor:default;}" +
  "#gmhfrblr21_config_window input[type=\"checkbox\"]{margin:0 0 1px;vertical-align:text-bottom;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_color_div{margin:6px 4px 10px;cursor:default;display:flex;" +
  "justify-content:space-around;align-items:center;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_color_div > div{display:flex;justify-content:center;cursor:default;" +
  "align-items:center;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_color_div > div > *{display:block;}" +
  "#gmhfrblr21_config_window input[type=color]{padding:0;width:30px;height:15px;border:1px solid #c0c0c0;" +
  "margin:0 8px;}" +
  "#gmhfrblr21_config_window input[type=\"range\"]{padding:0;border:0;margin:0 8px;font-size:12px;width:100px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;-webkit-appearance:none;background:transparent;}" +
  "#gmhfrblr21_config_window input[type=\"range\"]:focus{outline:none;}" +
  "#gmhfrblr21_config_window input[type=\"range\"]:focus::-webkit-slider-runnable-track{background:#888888;}" +
  "#gmhfrblr21_config_window input[type=\"range\"]::-moz-range-thumb{background-color:#ffffff;width:3px;" +
  "height:11px;border:1px solid #666666;border-radius:2px;}" +
  "#gmhfrblr21_config_window input[type=\"range\"]::-webkit-slider-thumb{-webkit-appearance:none;" +
  "background-color:#ffffff;width:5px;height:13px;border:1px solid #666666;border-radius:2px;margin-top:-6px;}" +
  "#gmhfrblr21_config_window input[type=\"range\"]::-moz-range-track{background:#888888;height:1px;border:0;}" +
  "#gmhfrblr21_config_window input[type=\"range\"]::-webkit-slider-runnable-track{background:#888888;" +
  "height:1px;border:0;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_color_div > div > span{margin:0 8px 0 0;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_save_close_div{text-align:right;margin:16px 0 0 0;" +
  "cursor:default;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_save_close_div > img{margin:0 0 0 8px;cursor:pointer;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_save_close_div div.gmhfrblr21_info_reload_div{float:left;}" +
  "#gmhfrblr21_config_window div.gmhfrblr21_save_close_div div.gmhfrblr21_info_reload_div " +
  "img{vertical-align:text-bottom;}" +
  // styles pour la gestion du masquage et de l'affichage des messages et des citations
  "div#mesdiscussions.mesdiscussions table.messagetable.gmhfrblr21_blocked_type.gmhfrblr21_hidden > " +
  "tbody > tr:not(.gmhfrblr21_snippet_type), " +
  "div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr > td.messCase2 " +
  "div.container.gmhfrblr21_blocked_type.gmhfrblr21_hidden > table:not(.gmhfrblr21_snippet_type), " +
  "div#mesdiscussions.mesdiscussions table.gmhfrblr21_with_blocked_quote_type.gmhfrblr21_hidden > " +
  "tbody > tr:not(.gmhfrblr21_snippet_type), " +
  "div#mesdiscussions.mesdiscussions > " +
  "form#hop ~ form#apercu_form ~ table.gmhfrblr21_blocked_type.gmhfrblr21_hidden > " +
  "tbody > tr.message:not(.gmhfrblr21_snippet_type), " +
  "div#mesdiscussions.mesdiscussions > " +
  "form#hop ~ form#apercu_form ~ table > tbody > tr.message > td.messCase1bis + td " +
  "div.container.gmhfrblr21_blocked_type.gmhfrblr21_hidden > table:not(.gmhfrblr21_snippet_type), " +
  "div#mesdiscussions.mesdiscussions > " +
  "form#hop ~ form#apercu_form ~ table.gmhfrblr21_with_blocked_quote_type.gmhfrblr21_hidden > " +
  "tbody > tr.message:not(.gmhfrblr21_snippet_type), " +
  ".gmhfrblr21_hide_snippets, " +
  ".gmhfrblr21_always_hide_snippets, " +
  ".gmhfrblr21_soft_always_hide_snippets, " +
  ".gmhfrblr21_with_always_hide_snippets{display:none;}" +
  // styles pour les pastille de filtrage par utilisateur
  "div.gmhfrblr21_dot{width:8px;height:8px;border:1px solid #c0c0c0;border-radius:20px;cursor:pointer;" +
  "box-sizing:border-box;}" +
  "div.gmhfrblr21_dot.gmhfrblr21_dot_on{border:0;background-color:#b81d1d;}" +
  "div.gmhfrblr21_dot.gmhfrblr21_dot_soft{border:0;background-color:#1d60b8;}" +
  // styles pour les popups
  "div.gmhfrblr21_popup{position:absolute;font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:12px;" +
  "border:1px solid #242424;padding:8px 12px;background:linear-gradient(#ffffff, #f7f7ff);color:#000000;" +
  "z-index:1001;cursor:default;}" +
  "div.gmhfrblr21_popup.gmhfrblr21_disabled{background:linear-gradient(#ffffff, #fff0f0);}" +
  "div.gmhfrblr21_popup > div.gmhfrblr21_title{font-weight:bold;cursor:default;margin:0 0 8px 0;}" +
  "div.gmhfrblr21_popup > div.gmhfrblr21_title > img{display:block;float:right;margin:0 0 0 8px;" +
  "cursor:pointer;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex{display:flex;align-items:center;height:16px;cursor:default;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex > label{display:block;flex-grow:1;cursor:pointer;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex > label.gmhfrblr21_disabled{color:#c0c0c0;cursor:default;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex > input[type=\"checkbox\"]{display:block;margin:0 0 0 8px;" +
  "cursor:pointer;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex > input[type=\"checkbox\"]:disabled{cursor:default;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex > input[type=\"radio\"]{display:block;margin:0;cursor:pointer;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex.gmhfrblr21_profile{margin:0 0 4px 0;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex.gmhfrblr21_profile > input:first-of-type{margin:0 4px 0 8px;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex.gmhfrblr21_profile > label:last-of-type{margin:0 0 0 4px;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex.gmhfrblr21_profile > input:last-of-type{margin:0 0 0 8px;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex.gmhfrblr21_snippets > label:first-of-type{flex-grow:0;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex.gmhfrblr21_snippets > input:first-of-type{margin:0 8px 0 8px;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex.gmhfrblr21_between{justify-content:space-between;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex.gmhfrblr21_add{margin:8px 0 2px 0;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex > input[type=\"text\"]{display:block;flex-grow:1;padding:0 1px;" +
  "border:1px solid #c0c0c0;height:16px;font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;" +
  "box-sizing:border-box;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex > img{display:block;margin:0 0 0 8px;cursor:pointer;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_remove_grid{display:grid;grid-template-columns:1fr 1fr 1fr;" +
  "grid-column-gap:8px;column-gap:8px;padding:4px 0 0 0;cursor:default;}" +
  "div.gmhfrblr21_popup div.gmhfrblr21_flex > div.gmhfrblr21_dot{margin:2px 0 0 4px;}" +
  "div.gmhfrblr21_popup > div.gmhfrblr21_buttons{margin:8px 0 0 0;cursor:default;display:flex;" +
  "justify-content:space-between;align-items:center;}" +
  "div.gmhfrblr21_popup > div.gmhfrblr21_buttons > div > img{margin:0 0 0 8px;cursor:pointer;}" +
  // styles pour les boutons
  "img.gmhfrblr21_tab_img{max-width:16px;max-height:16px;}" +
  "div#mesdiscussions.mesdiscussions img.gmhfrblr21_pseudo_img{cursor:pointer;max-width:16px;max-height:16px;" +
  "margin:0 0 0 0;}" +
  "img.gmhfrblr21_tab_img.gmhfrblr21_disabled_img, div#mesdiscussions.mesdiscussions " +
  "img.gmhfrblr21_pseudo_img.gmhfrblr21_disabled_img{filter:saturate(0) brightness(95%);}" +
  // styles pour les aperçus
  ".gmhfrblr21_snippet_type td{font-size:10px;padding:4px;}" +
  ".gmhfrblr21_snippet_type span{cursor:pointer;}" +
  ".gmhfrblr21_snippet_type span:hover{text-decoration:underline;}" +
  "div#mesdiscussions.mesdiscussions table.gmhfrblr21_snippet_type{border-collapse:collapse;}" +
  "table.gmhfrblr21_snippet_type > tbody > tr > td{padding-left:6px;}";
if(box_shadow) {
  l_style.textContent += "div.gmhfrblr21_popup{box-shadow:4px 4px 4px 0 rgba(0, 0, 0, 0.4);}";
}
document.getElementsByTagName("head")[0].appendChild(l_style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// fonction de désactivation de l'action par défaut sur un événement
function prevent_default(p_event) {
  p_event.preventDefault();
}

// création de la fenêtre d'aide
let help_window = document.createElement("div");
help_window.setAttribute("id", "gmhfrblr21_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(p_width, p_text) {
  let l_help_button = document.createElement("img");
  l_help_button.setAttribute("src", img_help);
  l_help_button.setAttribute("alt", "Aide");
  l_help_button.setAttribute("class", "gmhfrblr21_help_button");
  l_help_button.addEventListener("mouseover", function(p_event) {
    help_window.style.width = p_width + "px";
    help_window.textContent = p_text;
    help_window.style.left = (p_event.clientX + 32) + "px";
    help_window.style.top = (p_event.clientY - 16) + "px";
    help_window.style.visibility = "visible";
  }, false);
  l_help_button.addEventListener("mouseout", function() {
    help_window.style.visibility = "hidden";
  }, false);
  return l_help_button;
}

// création du voile de fond pour la fenêtre de configuration
let config_background = document.createElement("div");
config_background.setAttribute("id", "gmhfrblr21_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
config_background.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
let config_window = document.createElement("div");
config_window.setAttribute("id", "gmhfrblr21_config_window");
config_window.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
let main_title = document.createElement("div");
main_title.setAttribute("class", "gmhfrblr21_main_title");
main_title.textContent = "Conf du script [HFR] Bloque liste";
config_window.appendChild(main_title);

// section icône des boutons
let icon_fieldset = document.createElement("fieldset");
let icon_legend = document.createElement("legend");
icon_legend.textContent = "Icône des boutons";
icon_fieldset.appendChild(icon_legend);
config_window.appendChild(icon_fieldset);
let icon_div = document.createElement("div");
icon_div.setAttribute("class", "gmhfrblr21_icon_div");
let icon_test = document.createElement("img");
icon_test.setAttribute("class", "gmhfrblr21_test");
icon_div.appendChild(icon_test);
let icon_input = document.createElement("input");
icon_input.setAttribute("type", "text");
icon_input.setAttribute("spellcheck", "false");
icon_input.setAttribute("size", "50");
icon_input.setAttribute("title", "url de l'icône (http ou data)");
icon_input.addEventListener("focus", function() {
  icon_input.select();
}, false);

function icon_changed() {
  icon_test.setAttribute("src", icon_input.value.trim());
  icon_input.setSelectionRange(0, 0);
  icon_input.blur();
}
icon_input.addEventListener("input", icon_changed, false);
icon_div.appendChild(icon_input);
let icon_reset = document.createElement("img");
icon_reset.setAttribute("src", img_reset);
icon_reset.setAttribute("alt", "Réinitialiser");
icon_reset.setAttribute("class", "gmhfrblr21_reset");
icon_reset.setAttribute("title", "remettre l'icône par défaut");

function icon_do_reset() {
  icon_input.value = gmhfrblr21_img_bl_default;
  icon_changed();
}
icon_reset.addEventListener("click", icon_do_reset, false);
icon_div.appendChild(icon_reset);
icon_fieldset.appendChild(icon_div);

// section couleur des contenus masqués
let color_fieldset = document.createElement("fieldset");
let color_legend = document.createElement("legend");
color_legend.textContent = "Couleurs des contenus masqués";
color_fieldset.appendChild(color_legend);
config_window.appendChild(color_fieldset);

// colorer les messages et les citations bloqués
let color_hidden_p = document.createElement("p");
let color_hidden_checkbox = document.createElement("input");
color_hidden_checkbox.setAttribute("id", "gmhfrblr21_color_hidden_checkbox");
color_hidden_checkbox.setAttribute("type", "checkbox");
color_hidden_p.appendChild(color_hidden_checkbox);
let color_hidden_label = document.createElement("label");
color_hidden_label.textContent = " colorer les messages et les citations bloqués";
color_hidden_label.setAttribute("for", "gmhfrblr21_color_hidden_checkbox");
color_hidden_p.appendChild(color_hidden_label);
color_fieldset.appendChild(color_hidden_p);

// couleur et opacité des messages et des citations bloqués
let color_hidden_div = document.createElement("div");
color_hidden_div.setAttribute("class", "gmhfrblr21_color_div");
color_fieldset.appendChild(color_hidden_div);

// couleur des messages et des citations bloqués
let color_hidden_color_div = document.createElement("div");
let color_hidden_color_label = document.createElement("label");
color_hidden_color_label.textContent = "couleur :";
color_hidden_color_label.setAttribute("for", "gmhfrblr21_color_hidden_color");
color_hidden_color_div.appendChild(color_hidden_color_label);
let color_hidden_color_color = document.createElement("input");
color_hidden_color_color.setAttribute("id", "gmhfrblr21_color_hidden_color");
color_hidden_color_color.setAttribute("type", "color");

function color_hidden_color_changed() {
  color_hidden_color_color.setAttribute("title",
    color_hidden_color_color.value.toLowerCase());
}
color_hidden_color_color.addEventListener("change", color_hidden_color_changed, false);
color_hidden_color_div.appendChild(color_hidden_color_color);
let color_hidden_color_reset = document.createElement("img");
color_hidden_color_reset.setAttribute("src", img_reset);
color_hidden_color_reset.setAttribute("alt", "Réinitialiser");
color_hidden_color_reset.setAttribute("class", "gmhfrblr21_reset");
color_hidden_color_reset.setAttribute("title", "remettre la couleur par défaut");

function color_hidden_color_do_reset() {
  color_hidden_color_color.value = gmhfrblr21_color_hidden_color_default;
  color_hidden_color_changed();
}
color_hidden_color_reset.addEventListener("click", color_hidden_color_do_reset, false);
color_hidden_color_div.appendChild(color_hidden_color_reset);
color_hidden_div.appendChild(color_hidden_color_div);

// opacité des messages et des citations bloqués
let color_hidden_opacity_div = document.createElement("div");
let color_hidden_opacity_label = document.createElement("label");
color_hidden_opacity_label.textContent = "opacité :";
color_hidden_opacity_label.setAttribute("for", "gmhfrblr21_color_hidden_opacity");
color_hidden_opacity_div.appendChild(color_hidden_opacity_label);
let color_hidden_opacity_range = document.createElement("input");
color_hidden_opacity_range.setAttribute("id", "gmhfrblr21_color_hidden_opacity");
color_hidden_opacity_range.setAttribute("type", "range");
color_hidden_opacity_range.setAttribute("min", "0");
color_hidden_opacity_range.setAttribute("max", "1");
color_hidden_opacity_range.setAttribute("step", "0.01");

function color_hidden_opacity_changed() {
  color_hidden_opacity_span.textContent =
    opacity_value_format.format(color_hidden_opacity_range.value);
}
color_hidden_opacity_range.addEventListener("input", color_hidden_opacity_changed, false);
color_hidden_opacity_div.appendChild(color_hidden_opacity_range);
let color_hidden_opacity_span = document.createElement("span");
color_hidden_opacity_div.appendChild(color_hidden_opacity_span);
let color_hidden_opacity_reset = document.createElement("img");
color_hidden_opacity_reset.setAttribute("src", img_reset);
color_hidden_opacity_reset.setAttribute("alt", "Réinitialiser");
color_hidden_opacity_reset.setAttribute("class", "gmhfrblr21_reset");
color_hidden_opacity_reset.setAttribute("title", "remettre l'opacité par défaut");

function color_hidden_opacity_do_reset() {
  color_hidden_opacity_range.value = gmhfrblr21_color_hidden_opacity_default;
  color_hidden_opacity_changed();
}
color_hidden_opacity_reset.addEventListener("click", color_hidden_opacity_do_reset, false);
color_hidden_opacity_div.appendChild(color_hidden_opacity_reset);
color_hidden_div.appendChild(color_hidden_opacity_div);

// colorer les messages contenant une citation bloquée
let color_posts_with_hidden_p = document.createElement("p");
let color_posts_with_hidden_checkbox = document.createElement("input");
color_posts_with_hidden_checkbox.setAttribute("id", "gmhfrblr21_color_posts_with_hidden_checkbox");
color_posts_with_hidden_checkbox.setAttribute("type", "checkbox");
color_posts_with_hidden_p.appendChild(color_posts_with_hidden_checkbox);
let color_posts_with_hidden_label = document.createElement("label");
color_posts_with_hidden_label.textContent = " colorer les messages contenant une citation bloquée";
color_posts_with_hidden_label.setAttribute("for", "gmhfrblr21_color_posts_with_hidden_checkbox");
color_posts_with_hidden_p.appendChild(color_posts_with_hidden_label);
color_fieldset.appendChild(color_posts_with_hidden_p);

// couleur et opacité des messages contenant une citation bloquée
let color_posts_with_hidden_div = document.createElement("div");
color_posts_with_hidden_div.setAttribute("class", "gmhfrblr21_color_div");
color_fieldset.appendChild(color_posts_with_hidden_div);

// couleur des messages contenant une citation bloquée
let color_posts_with_hidden_color_div = document.createElement("div");
let color_posts_with_hidden_color_label = document.createElement("label");
color_posts_with_hidden_color_label.textContent = "couleur :";
color_posts_with_hidden_color_label.setAttribute("for", "gmhfrblr21_color_posts_with_hidden_color");
color_posts_with_hidden_color_div.appendChild(color_posts_with_hidden_color_label);
let color_posts_with_hidden_color_color = document.createElement("input");
color_posts_with_hidden_color_color.setAttribute("id", "gmhfrblr21_color_posts_with_hidden_color");
color_posts_with_hidden_color_color.setAttribute("type", "color");

function color_posts_with_hidden_color_changed() {
  color_posts_with_hidden_color_color.setAttribute("title",
    color_posts_with_hidden_color_color.value.toLowerCase());
}
color_posts_with_hidden_color_color.addEventListener("change", color_posts_with_hidden_color_changed, false);
color_posts_with_hidden_color_div.appendChild(color_posts_with_hidden_color_color);
let color_posts_with_hidden_color_reset = document.createElement("img");
color_posts_with_hidden_color_reset.setAttribute("src", img_reset);
color_posts_with_hidden_color_reset.setAttribute("alt", "Réinitialiser");
color_posts_with_hidden_color_reset.setAttribute("class", "gmhfrblr21_reset");
color_posts_with_hidden_color_reset.setAttribute("title", "remettre la couleur par défaut");

function color_posts_with_hidden_color_do_reset() {
  color_posts_with_hidden_color_color.value = gmhfrblr21_color_posts_with_hidden_color_default;
  color_posts_with_hidden_color_changed();
}
color_posts_with_hidden_color_reset.addEventListener("click", color_posts_with_hidden_color_do_reset, false);
color_posts_with_hidden_color_div.appendChild(color_posts_with_hidden_color_reset);
color_posts_with_hidden_div.appendChild(color_posts_with_hidden_color_div);

// opacité des messages contenant une citation bloquée
let color_posts_with_hidden_opacity_div = document.createElement("div");
let color_posts_with_hidden_opacity_label = document.createElement("label");
color_posts_with_hidden_opacity_label.textContent = "opacité :";
color_posts_with_hidden_opacity_label.setAttribute("for", "gmhfrblr21_color_posts_with_hidden_opacity");
color_posts_with_hidden_opacity_div.appendChild(color_posts_with_hidden_opacity_label);
let color_posts_with_hidden_opacity_range = document.createElement("input");
color_posts_with_hidden_opacity_range.setAttribute("id", "gmhfrblr21_color_posts_with_hidden_opacity");
color_posts_with_hidden_opacity_range.setAttribute("type", "range");
color_posts_with_hidden_opacity_range.setAttribute("min", "0");
color_posts_with_hidden_opacity_range.setAttribute("max", "1");
color_posts_with_hidden_opacity_range.setAttribute("step", "0.01");

function color_posts_with_hidden_opacity_changed() {
  color_posts_with_hidden_opacity_span.textContent =
    opacity_value_format.format(color_posts_with_hidden_opacity_range.value);
}
color_posts_with_hidden_opacity_range.addEventListener("input", color_posts_with_hidden_opacity_changed, false);
color_posts_with_hidden_opacity_div.appendChild(color_posts_with_hidden_opacity_range);
let color_posts_with_hidden_opacity_span = document.createElement("span");
color_posts_with_hidden_opacity_div.appendChild(color_posts_with_hidden_opacity_span);
let color_posts_with_hidden_opacity_reset = document.createElement("img");
color_posts_with_hidden_opacity_reset.setAttribute("src", img_reset);
color_posts_with_hidden_opacity_reset.setAttribute("alt", "Réinitialiser");
color_posts_with_hidden_opacity_reset.setAttribute("class", "gmhfrblr21_reset");
color_posts_with_hidden_opacity_reset.setAttribute("title", "remettre l'opacité par défaut");

function color_posts_with_hidden_opacity_do_reset() {
  color_posts_with_hidden_opacity_range.value = gmhfrblr21_color_posts_with_hidden_opacity_default;
  color_posts_with_hidden_opacity_changed();
}
color_posts_with_hidden_opacity_reset.addEventListener("click", color_posts_with_hidden_opacity_do_reset, false);
color_posts_with_hidden_opacity_div.appendChild(color_posts_with_hidden_opacity_reset);
color_posts_with_hidden_div.appendChild(color_posts_with_hidden_opacity_div);

// toujours colorer les aperçus
let always_color_snippets_p = document.createElement("p");
let always_color_snippets_checkbox = document.createElement("input");
always_color_snippets_checkbox.setAttribute("id", "gmhfrblr21_always_color_snippets_checkbox");
always_color_snippets_checkbox.setAttribute("type", "checkbox");
always_color_snippets_p.appendChild(always_color_snippets_checkbox);
let always_color_snippets_label = document.createElement("label");
always_color_snippets_label.textContent = " toujours colorer les aperçus";
always_color_snippets_label.setAttribute("for", "gmhfrblr21_always_color_snippets_checkbox");
always_color_snippets_p.appendChild(always_color_snippets_label);
color_fieldset.appendChild(always_color_snippets_p);

// info "sans rechargement" et boutons de validation et de fermeture
let save_close_div = document.createElement("div");
save_close_div.setAttribute("class", "gmhfrblr21_save_close_div");
let info_reload_div = document.createElement("div");
info_reload_div.setAttribute("class", "gmhfrblr21_info_reload_div");
let info_reload_img = document.createElement("img");
info_reload_img.setAttribute("src", img_info);
info_reload_img.setAttribute("alt", "Information");
info_reload_div.appendChild(info_reload_img);
info_reload_div.appendChild(document.createTextNode(" sans rechargement "));
info_reload_div.appendChild(create_help_button(255,
  "Les paramètres de cette fenêtre de configuration sont appliqués immédiatement à la validation, " +
  "il n'est pas nécessaire de recharger la page."));
save_close_div.appendChild(info_reload_div);
let save_button = document.createElement("img");
save_button.setAttribute("src", img_save);
save_button.setAttribute("alt", "Valider");
save_button.setAttribute("title", "Valider");
save_button.addEventListener("click", save_config_window, false);
save_close_div.appendChild(save_button);
let close_button = document.createElement("img");
close_button.setAttribute("src", img_close);
close_button.setAttribute("alt", "Annuler");
close_button.setAttribute("title", "Annuler");
close_button.addEventListener("click", hide_config_window, false);
save_close_div.appendChild(close_button);
config_window.appendChild(save_close_div);

// fonction de validation de la fenêtre de configuration
function save_config_window() {
  // fermeture de la fenêtre
  hide_config_window();
  // récupération des paramètres
  gmhfrblr21_img_bl = icon_input.value.trim();
  if(gmhfrblr21_img_bl === "") {
    gmhfrblr21_img_bl = gmhfrblr21_img_bl_default;
  }
  gmhfrblr21_color_hidden = color_hidden_checkbox.checked;
  gmhfrblr21_color_hidden_color = color_hidden_color_color.value;
  gmhfrblr21_color_hidden_opacity = color_hidden_opacity_range.value;
  gmhfrblr21_color_posts_with_hidden = color_posts_with_hidden_checkbox.checked;
  gmhfrblr21_color_posts_with_hidden_color = color_posts_with_hidden_color_color.value;
  gmhfrblr21_color_posts_with_hidden_opacity = color_posts_with_hidden_opacity_range.value;
  gmhfrblr21_always_color_snippets = always_color_snippets_checkbox.checked;
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("gmhfrblr21_img_bl", gmhfrblr21_img_bl),
    GM.setValue("gmhfrblr21_color_hidden", gmhfrblr21_color_hidden),
    GM.setValue("gmhfrblr21_color_hidden_color", gmhfrblr21_color_hidden_color),
    GM.setValue("gmhfrblr21_color_hidden_opacity", gmhfrblr21_color_hidden_opacity),
    GM.setValue("gmhfrblr21_color_posts_with_hidden", gmhfrblr21_color_posts_with_hidden),
    GM.setValue("gmhfrblr21_color_posts_with_hidden_color", gmhfrblr21_color_posts_with_hidden_color),
    GM.setValue("gmhfrblr21_color_posts_with_hidden_opacity", gmhfrblr21_color_posts_with_hidden_opacity),
    GM.setValue("gmhfrblr21_always_color_snippets", gmhfrblr21_always_color_snippets),
  ]);
  // mise à jour des boutons et des couleurs
  update_buttons();
  update_styles();
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
function show_config_window() {
  // fermeture des popups ouvertes
  close_popups();
  // initialisation des paramètres
  icon_input.value = gmhfrblr21_img_bl;
  icon_changed();
  color_hidden_checkbox.checked = gmhfrblr21_color_hidden;
  color_hidden_color_color.value = gmhfrblr21_color_hidden_color;
  color_hidden_color_changed();
  color_hidden_opacity_range.value = gmhfrblr21_color_hidden_opacity;
  color_hidden_opacity_changed();
  color_posts_with_hidden_checkbox.checked = gmhfrblr21_color_posts_with_hidden;
  color_posts_with_hidden_color_color.value = gmhfrblr21_color_posts_with_hidden_color;
  color_posts_with_hidden_color_changed();
  color_posts_with_hidden_opacity_range.value = gmhfrblr21_color_posts_with_hidden_opacity;
  color_posts_with_hidden_opacity_changed();
  always_color_snippets_checkbox.checked = gmhfrblr21_always_color_snippets;
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

// ajout d'une entrée de configuration dans le menu de l'extension
gmMenu("[HFR] Bloque liste -> Configuration", show_config_window);

/* --------------------------------------- */
/* fonctions de gestion de la bloque liste */
/* --------------------------------------- */

// fonction de mormalisation un pseudo : sans zero width space et en minuscules
function normalize_pseudo(p_pseudo) {
  return p_pseudo.replace(/\u200b/g, "").toLowerCase();
}

// fonction d'ajout d'un bug d'encodage du forum qui n'existe pas sur les pseudos des citations
function add_buggy_encoding_and_normalize_pseudo(p_pseudo) {
  if(p_pseudo.length > 10) {
    let l_bytes = text_encoder.encode(p_pseudo);
    let l_temp_string = "";
    let l_cpt = 0;
    while(l_cpt < l_bytes.length) {
      l_temp_string += l_bytes.slice(l_cpt, l_cpt + 10).join(",");
      if(l_cpt + 10 < l_bytes.length) {
        l_temp_string += zero_width_space;
      }
      l_cpt += 10;
    }
    let l_buggy_bytes =
      Uint8Array.from(l_temp_string.split(",").map(l_byte_string => parseInt(l_byte_string, 10)));
    p_pseudo = text_decoder.decode(l_buggy_bytes);
  }
  return normalize_pseudo(p_pseudo);
}

// fonction d'ajout un pseudo à la bloque liste
function add_pseudo(p_pseudo) {

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste add_pseudo " +
      "gmhfrblr21_bloque_liste avant : ",
      JSON.stringify(gmhfrblr21_bloque_liste));
  }

  gmhfrblr21_bloque_liste.push(normalize_pseudo(p_pseudo));
  gmhfrblr21_bloque_liste
    .sort((p_pseudo_a, p_pseudo_b) => p_pseudo_a.localeCompare(p_pseudo_b, "fr", {
      usage: "sort",
      sensitivity: "base",
      ignorePunctuation: false,
      numeric: false,
    }));
  GM.setValue("gmhfrblr21_bloque_liste",
    JSON.stringify(gmhfrblr21_bloque_liste));

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste add_pseudo " +
      "gmhfrblr21_bloque_liste après : ",
      JSON.stringify(gmhfrblr21_bloque_liste));
  }

}

// fonction de suppression d'un pseudo de la bloque liste
function remove_pseudo(p_pseudo) {

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste remove_pseudo " +
      "gmhfrblr21_bloque_liste avant : ",
      JSON.stringify(gmhfrblr21_bloque_liste));
  }

  remove_always_hidden_pseudo(p_pseudo);
  remove_soft_always_hidden_pseudo(p_pseudo);

  let l_index = gmhfrblr21_bloque_liste.indexOf(normalize_pseudo(p_pseudo));
  if(l_index >= 0) {
    gmhfrblr21_bloque_liste.splice(l_index, 1);
    GM.setValue("gmhfrblr21_bloque_liste",
      JSON.stringify(gmhfrblr21_bloque_liste));
  }

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste remove_pseudo " +
      "gmhfrblr21_bloque_liste après : ",
      JSON.stringify(gmhfrblr21_bloque_liste));
  }

}

// fonction de vérification si un pseudo est dans la bloque liste
function is_pseudo_blocked(p_pseudo) {
  return gmhfrblr21_bloque_liste.includes(normalize_pseudo(p_pseudo));
}

// fonction de vérification si le pseudo d'une citation est dans la bloque liste
function is_quoted_pseudo_blocked(p_quoted_pseudo) {
  return gmhfrblr21_bloque_liste.includes(add_buggy_encoding_and_normalize_pseudo(p_quoted_pseudo));
}

// fonction de vérification si un pseudo normalisé est dans la bloque liste
function is_normalized_pseudo_blocked(p_normalized_pseudo) {
  return gmhfrblr21_bloque_liste.includes(p_normalized_pseudo);
}

// fonction d'ajout d'un pseudo à la liste des pseudos toujours masqués
function add_always_hidden_pseudo(p_pseudo) {

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste add_always_hidden_pseudo " +
      "gmhfrblr21_always_hide_snippets_list avant : ",
      JSON.stringify(gmhfrblr21_always_hide_snippets_list));
  }

  gmhfrblr21_always_hide_snippets_list.push(normalize_pseudo(p_pseudo));
  gmhfrblr21_always_hide_snippets_list
    .sort((p_pseudo_a, p_pseudo_b) => p_pseudo_a.localeCompare(p_pseudo_b, "fr", {
      usage: "sort",
      sensitivity: "base",
      ignorePunctuation: false,
      numeric: false,
    }));
  GM.setValue("gmhfrblr21_always_hide_snippets_list",
    JSON.stringify(gmhfrblr21_always_hide_snippets_list));

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste add_always_hidden_pseudo " +
      "gmhfrblr21_always_hide_snippets_list après : ",
      JSON.stringify(gmhfrblr21_always_hide_snippets_list));
  }

}

// fonction de suppression d'un pseudo de la liste des pseudos toujours masqués
function remove_always_hidden_pseudo(p_pseudo) {

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste remove_always_hidden_pseudo " +
      "gmhfrblr21_always_hide_snippets_list avant : ",
      JSON.stringify(gmhfrblr21_always_hide_snippets_list));
  }

  let l_index = gmhfrblr21_always_hide_snippets_list.indexOf(normalize_pseudo(p_pseudo));
  if(l_index >= 0) {
    gmhfrblr21_always_hide_snippets_list.splice(l_index, 1);
    GM.setValue("gmhfrblr21_always_hide_snippets_list",
      JSON.stringify(gmhfrblr21_always_hide_snippets_list));
  }

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste remove_always_hidden_pseudo " +
      "gmhfrblr21_always_hide_snippets_list après : ",
      JSON.stringify(gmhfrblr21_always_hide_snippets_list));
  }

}

// fonction de vérification si un pseudo est dans la liste des pseudos toujours masqués
function is_pseudo_always_hidden(p_pseudo) {
  return gmhfrblr21_always_hide_snippets_list.includes(normalize_pseudo(p_pseudo));
}

// fonction de vérification si le pseudo d'une citation est dans la liste des pseudos toujours masqués
function is_quoted_pseudo_always_hidden(p_quoted_pseudo) {
  return gmhfrblr21_always_hide_snippets_list.includes(add_buggy_encoding_and_normalize_pseudo(p_quoted_pseudo));
}

// fonction de vérification si un pseudo normalisé est dans la liste des pseudos toujours masqués
function is_normalized_pseudo_always_hidden(p_normalized_pseudo) {
  return gmhfrblr21_always_hide_snippets_list.includes(p_normalized_pseudo);
}

// fonction d'ajout d'un pseudo à la liste des pseudos toujours masqués mais pas trop
function add_soft_always_hidden_pseudo(p_pseudo) {

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste add_soft_always_hidden_pseudo " +
      "gmhfrblr21_soft_always_hide_snippets_list avant : ",
      JSON.stringify(gmhfrblr21_soft_always_hide_snippets_list));
  }

  gmhfrblr21_soft_always_hide_snippets_list.push(normalize_pseudo(p_pseudo));
  gmhfrblr21_soft_always_hide_snippets_list
    .sort((p_pseudo_a, p_pseudo_b) => p_pseudo_a.localeCompare(p_pseudo_b, "fr", {
      usage: "sort",
      sensitivity: "base",
      ignorePunctuation: false,
      numeric: false,
    }));
  GM.setValue("gmhfrblr21_soft_always_hide_snippets_list",
    JSON.stringify(gmhfrblr21_soft_always_hide_snippets_list));

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste add_soft_always_hidden_pseudo " +
      "gmhfrblr21_soft_always_hide_snippets_list après : ",
      JSON.stringify(gmhfrblr21_soft_always_hide_snippets_list));
  }

}

// fonction de suppression d'un pseudo de la liste des pseudos toujours masqués mais pas trop
function remove_soft_always_hidden_pseudo(p_pseudo) {

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste remove_soft_always_hidden_pseudo " +
      "gmhfrblr21_soft_always_hide_snippets_list avant : ",
      JSON.stringify(gmhfrblr21_soft_always_hide_snippets_list));
  }

  let l_index = gmhfrblr21_soft_always_hide_snippets_list.indexOf(normalize_pseudo(p_pseudo));
  if(l_index >= 0) {
    gmhfrblr21_soft_always_hide_snippets_list.splice(l_index, 1);
    GM.setValue("gmhfrblr21_soft_always_hide_snippets_list",
      JSON.stringify(gmhfrblr21_soft_always_hide_snippets_list));
  }

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste remove_soft_always_hidden_pseudo " +
      "gmhfrblr21_soft_always_hide_snippets_list après : ",
      JSON.stringify(gmhfrblr21_soft_always_hide_snippets_list));
  }

}

// fonction de vérification si un pseudo est dans la liste des pseudos toujours masqués mais pas trop
function is_pseudo_soft_always_hidden(p_pseudo) {
  return gmhfrblr21_soft_always_hide_snippets_list
    .includes(normalize_pseudo(p_pseudo));
}

// fonction de vérification si le pseudo d'une citation est dans la liste
// des pseudos toujours masqués mais pas trop
function is_quoted_pseudo_soft_always_hidden(p_quoted_pseudo) {
  return gmhfrblr21_soft_always_hide_snippets_list
    .includes(add_buggy_encoding_and_normalize_pseudo(p_quoted_pseudo));
}

// fonction de vérification si un pseudo normalisé est dans la liste des pseudos toujours masqués mais pas trop
function is_normalized_pseudo_soft_always_hidden(p_normalized_pseudo) {
  return gmhfrblr21_soft_always_hide_snippets_list
    .includes(p_normalized_pseudo);
}

// fonction de vérification si un pseudo est dans la liste des pseudos toujours masqués
// ou dans la liste des pseudos toujours masqués mais pas trop
function pseudo_always_hidden_status(p_pseudo) {
  let l_normalize_pseudo = normalize_pseudo(p_pseudo);
  return gmhfrblr21_always_hide_snippets_list.includes(l_normalize_pseudo) ? "on" :
    (gmhfrblr21_soft_always_hide_snippets_list.includes(l_normalize_pseudo) ? "soft" : "off");
}

/* --------------------------------------------------------- */
/* fonction de mise à jour des couleurs des contenus masqués */
/* --------------------------------------------------------- */

// récupération de la couleur de fond des citations du thème de l'utilisateur
let the_style = document.querySelector("head link[href^=\"/include/the_style1.php?color_key=\"]");
if(the_style) {
  the_style = the_style.getAttribute("href").split("/");
  user_quote_color = "#" + the_style[19].toLowerCase();
} else {
  user_quote_color = "#ffffff";
}

// DEBUG
if(do_debug) {
  console.log(
    "DEBUG [HFR] Bloque liste the_style user_quote_color : ",
    user_quote_color);
}

// fonction de conversion d'une couleur rgb hexadécimale plus opacité en couleur rgba décimale
function hex_to_rgba(p_hex, p_opacity) {
  let l_r = parseInt(p_hex.substr(1, 2), 16);
  let l_g = parseInt(p_hex.substr(3, 2), 16);
  let l_b = parseInt(p_hex.substr(5, 2), 16);
  return "rgba(" + l_r + ", " + l_g + ", " + l_b + ", " + p_opacity + ")";
}

// fonction de combinaison de deux couleurs rgb hexadécimales plus opacité en une couleur rgb décimale
function combine_hex_to_rgb(p_first, p_second, p_opacity) {
  let l_opacity = parseFloat(p_opacity);
  let l_r = Math.round((parseInt(p_first.substr(1, 2), 16) * (1 - l_opacity)) +
    (parseInt(p_second.substr(1, 2), 16) * l_opacity));
  let l_g = Math.round((parseInt(p_first.substr(3, 2), 16) * (1 - l_opacity)) +
    (parseInt(p_second.substr(3, 2), 16) * l_opacity));
  let l_b = Math.round((parseInt(p_first.substr(5, 2), 16) * (1 - l_opacity)) +
    (parseInt(p_second.substr(5, 2), 16) * l_opacity));
  return "rgb(" + l_r + ", " + l_g + ", " + l_b + ")";
}

// fonction de mise à jour des styles des couleurs des contenus masqués
function update_styles() {
  let l_hidden_rgba =
    hex_to_rgba(gmhfrblr21_color_hidden_color, gmhfrblr21_color_hidden_opacity);
  let l_hidden_rgb_combined =
    combine_hex_to_rgb(user_quote_color, gmhfrblr21_color_hidden_color, gmhfrblr21_color_hidden_opacity);
  let l_posts_with_hidden_rgba =
    hex_to_rgba(gmhfrblr21_color_posts_with_hidden_color, gmhfrblr21_color_posts_with_hidden_opacity);

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste update_styles l_hidden_rgba : ",
      l_hidden_rgba);
    console.log(
      "DEBUG [HFR] Bloque liste update_styles l_hidden_rgb_combined : ",
      l_hidden_rgb_combined);
    console.log(
      "DEBUG [HFR] Bloque liste update_styles l_posts_with_hidden_rgba : ",
      l_posts_with_hidden_rgba);
  }

  let l_old_blocked_style = document.getElementById("gmhfrblr21_blocked_style_id");
  if(l_old_blocked_style !== null) {
    l_old_blocked_style.parentNode.removeChild(l_old_blocked_style);
  }
  let l_old_with_blocked_quote_style = document.getElementById("gmhfrblr21_with_blocked_quote_style_id");
  if(l_old_with_blocked_quote_style !== null) {
    l_old_with_blocked_quote_style.parentNode.removeChild(l_old_with_blocked_quote_style);
  }
  if(gmhfrblr21_color_hidden) {
    let l_new_blocked_style = document.createElement("style");
    l_new_blocked_style.setAttribute("id", "gmhfrblr21_blocked_style_id");
    l_new_blocked_style.setAttribute("type", "text/css");
    l_new_blocked_style.textContent = gmhfrblr21_always_color_snippets ?
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_blocked_type > " +
      "tbody > tr > td{background-color:" + l_hidden_rgba + ";}" +
      "div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr > td.messCase2 " +
      "div.container.gmhfrblr21_blocked_type > " +
      "table.citation{background-color:" + l_hidden_rgb_combined + ";}" +
      "div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr > td.messCase2 " +
      "div.container.gmhfrblr21_blocked_type > " +
      "table.oldcitation{background-color:" + l_hidden_rgba + ";}" +
      // réponse normale
      "div#mesdiscussions.mesdiscussions > " +
      "form#hop ~ form#apercu_form ~ table.gmhfrblr21_blocked_type > " +
      "tbody > tr > td{background-color:" + l_hidden_rgba + ";}" +
      "div#mesdiscussions.mesdiscussions > " +
      "form#hop ~ form#apercu_form ~ table > tbody > tr.message > td.messCase1bis + td " +
      "div.container.gmhfrblr21_blocked_type > " +
      "table.citation{background-color:" + l_hidden_rgb_combined + ";}" +
      "div#mesdiscussions.mesdiscussions > " +
      "form#hop ~ form#apercu_form ~ table > tbody > tr.message > td.messCase1bis + td " +
      "div.container.gmhfrblr21_blocked_type > " +
      "table.oldcitation{background-color:" + l_hidden_rgba + ";}" :
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_blocked_type:not(.gmhfrblr21_hidden) > " +
      "tbody > tr > td{background-color:" + l_hidden_rgba + ";}" +
      "div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr > td.messCase2 " +
      "div.container.gmhfrblr21_blocked_type:not(.gmhfrblr21_hidden) > " +
      "table.citation{background-color:" + l_hidden_rgb_combined + ";}" +
      "div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr > td.messCase2 " +
      "div.container.gmhfrblr21_blocked_type:not(.gmhfrblr21_hidden) > " +
      "table.oldcitation{background-color:" + l_hidden_rgba + ";}" +
      // réponse normale
      "div#mesdiscussions.mesdiscussions > " +
      "form#hop ~ form#apercu_form ~ table.gmhfrblr21_blocked_type:not(.gmhfrblr21_hidden) > " +
      "tbody > tr > td{background-color:" + l_hidden_rgba + ";}" +
      "div#mesdiscussions.mesdiscussions > " +
      "form#hop ~ form#apercu_form ~ table > tbody > tr.message > td.messCase1bis + td " +
      "div.container.gmhfrblr21_blocked_type:not(.gmhfrblr21_hidden) > " +
      "table.citation{background-color:" + l_hidden_rgb_combined + ";}" +
      "div#mesdiscussions.mesdiscussions > " +
      "form#hop ~ form#apercu_form ~ table > tbody > tr.message > td.messCase1bis + td " +
      "div.container.gmhfrblr21_blocked_type:not(.gmhfrblr21_hidden) > " +
      "table.oldcitation{background-color:" + l_hidden_rgba + ";}";
    document.getElementsByTagName("head")[0].appendChild(l_new_blocked_style);
  }
  if(gmhfrblr21_color_posts_with_hidden) {
    let l_new_with_blocked_quote_style = document.createElement("style");
    l_new_with_blocked_quote_style.setAttribute("id", "gmhfrblr21_with_blocked_quote_style_id");
    l_new_with_blocked_quote_style.setAttribute("type", "text/css");
    l_new_with_blocked_quote_style.textContent = gmhfrblr21_always_color_snippets ?
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_with_blocked_quote_type > " +
      "tbody > tr > td{background-color:" + l_posts_with_hidden_rgba + ";}" +
      // réponse normale
      "div#mesdiscussions.mesdiscussions > " +
      "form#hop ~ form#apercu_form ~ table.gmhfrblr21_with_blocked_quote_type > " +
      "tbody > tr > td{background-color:" + l_posts_with_hidden_rgba + ";}" :
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_with_blocked_quote_type:not(.gmhfrblr21_hidden) > " +
      "tbody > tr > td{background-color:" + l_posts_with_hidden_rgba + ";}" +
      // réponse normale
      "div#mesdiscussions.mesdiscussions > form#hop ~ form#apercu_form ~ " +
      "table.gmhfrblr21_with_blocked_quote_type:not(.gmhfrblr21_hidden) > " +
      "tbody > tr > td{background-color:" + l_posts_with_hidden_rgba + ";}";
    document.getElementsByTagName("head")[0].appendChild(l_new_with_blocked_quote_style);
  }
}

/* ------------------------------------------------------------- */
/* fonctions de création et de gestion des popups et des boutons */
/* ------------------------------------------------------------- */

// fonction d'ajout des boutons (dans les onglets et à côté des pseudos)
function add_buttons() {
  // ajout du bouton dans les onglets
  let l_tabs = document.querySelector("div#mesdiscussions.mesdiscussions > table.none > tbody > tr > td > " +
    "div.cadreonglet");
  if(l_tabs) {
    let l_tab_before_9 = l_tabs.querySelector("div#befor9");
    let l_tab_before_2 = l_tabs.querySelector("div#befor2");
    if(l_tab_before_9 || l_tab_before_2) {
      let l_tab_before = l_tab_before_9 ? l_tab_before_9 : l_tab_before_2;
      let l_bl_tab_before = document.createElement("div");
      l_bl_tab_before.setAttribute("id", "beforBL");
      l_bl_tab_before.setAttribute("class", "beforonglet");
      let l_bl_tab_after = document.createElement("div");
      l_bl_tab_after.setAttribute("id", "afterBL");
      l_bl_tab_after.setAttribute("class", "afteronglet");
      let l_bl_tab = document.createElement("a");
      l_bl_tab.setAttribute("id", "ongletBL");
      l_bl_tab.setAttribute("class", "onglet");
      l_bl_tab.setAttribute("title", "[HFR] Bloque liste -> Gestion de la bloque liste\n" +
        "(clic droit pour configurer)");
      l_bl_tab.addEventListener("click", prevent_default, false);
      l_bl_tab.addEventListener("contextmenu", prevent_default, false);
      l_bl_tab.addEventListener("mousedown", prevent_default, false);
      l_bl_tab.addEventListener("mouseup", display_config, false);
      let l_bl_tab_img = document.createElement("img");
      l_bl_tab_img.setAttribute("class", "gmhfrblr21_tab_img");
      l_bl_tab_img.setAttribute("src", gmhfrblr21_img_bl);
      l_bl_tab_img.setAttribute("alt", "BL");
      l_bl_tab.appendChild(l_bl_tab_img);
      l_tabs.insertBefore(l_bl_tab_before, l_tab_before);
      l_tabs.insertBefore(l_bl_tab, l_tab_before);
      l_tabs.insertBefore(l_bl_tab_after, l_tab_before);
    }
  }
  // ajout du bouton à coté des pseudos
  let l_pseudos = document.querySelectorAll("div#mesdiscussions.mesdiscussions > table.messagetable > " +
    "tbody > tr.message > td.messCase1 > div:not([postalrecall]) > b.s2");
  for(let l_pseudo of l_pseudos) {
    let l_bl_pseudo = document.createElement("div");
    l_bl_pseudo.setAttribute("class", "right");
    let l_bl_pseudo_img = document.createElement("img");
    l_bl_pseudo_img.setAttribute("class", "gmhfrblr21_pseudo_img");
    l_bl_pseudo_img.setAttribute("src", gmhfrblr21_img_bl);
    l_bl_pseudo_img.setAttribute("alt", "BL");
    l_bl_pseudo_img.setAttribute("title", "Bloquer ou débloquer cet utilisateur");
    l_bl_pseudo_img.addEventListener("click", prevent_default, false);
    l_bl_pseudo_img.addEventListener("contextmenu", prevent_default, false);
    l_bl_pseudo_img.addEventListener("mousedown", prevent_default, false);
    l_bl_pseudo_img.addEventListener("mouseup", display_question, false);
    l_bl_pseudo.appendChild(l_bl_pseudo_img);
    l_pseudo.parentElement.parentElement.insertBefore(l_bl_pseudo, l_pseudo.parentElement);
  }
}

// fonction de mise à jour des icônes des boutons
function update_buttons() {
  let l_buttons = document.querySelectorAll("img.gmhfrblr21_tab_img, img.gmhfrblr21_pseudo_img");
  for(let l_button of l_buttons) {
    l_button.setAttribute("src", gmhfrblr21_img_bl);
  }
}

// fermeture des popups ouvertes en cliquant en dehors
document.addEventListener("mouseup", function() {
  close_popups();
}, false);

// fermeture des popups ouvertes avec la touche echap
document.addEventListener("keydown", function(p_event) {
  if(p_event.key === "Escape") {
    close_popups();
  }
}, false);

// fonction de fermeture des popups ouvertes
function close_popups(p_event) {
  if(typeof p_event !== "undefined") {
    p_event.preventDefault();
    p_event.stopPropagation();
  }
  let l_config = document.getElementById("gmhfrblr21_config");
  if(l_config) {
    l_config.parentNode.removeChild(l_config);
  }
  let l_question = document.getElementById("gmhfrblr21_question");
  if(l_question) {
    l_question.parentNode.removeChild(l_question);
  }
}

// fonction de gestion du clic sur les pastilles de filtrage par utilisateur
function dot_changed(p_this) {
  if(p_this.dataset.status === "on") { // de "on" à "soft"
    p_this.dataset.status = "soft";
    p_this.classList.remove("gmhfrblr21_dot_on");
    p_this.classList.add("gmhfrblr21_dot_soft");
    remove_always_hidden_pseudo(p_this.dataset.pseudo);
    add_soft_always_hidden_pseudo(p_this.dataset.pseudo);
    if(gmhfrblr21_parameters[profile].d === false) {
      remove_always_hide_snippets();
      add_soft_always_hide_snippets();
    }
  } else if(p_this.dataset.status === "soft") { // de "soft" à "off"
    p_this.dataset.status = "off";
    p_this.classList.remove("gmhfrblr21_dot_soft");
    remove_soft_always_hidden_pseudo(p_this.dataset.pseudo);
    if(gmhfrblr21_parameters[profile].d === false) {
      remove_soft_always_hide_snippets();
    }
  } else { // de "off" à "on"
    p_this.dataset.status = "on";
    p_this.classList.add("gmhfrblr21_dot_on");
    add_always_hidden_pseudo(p_this.dataset.pseudo);
    if(gmhfrblr21_parameters[profile].d === false) {
      add_always_hide_snippets();
    }
  }
}

// fonction de création des pastilles de filtrage par utilisateur
function create_dot(p_pseudo, p_status, p_close) {
  let l_dot = document.createElement("div");
  l_dot.setAttribute("class", "gmhfrblr21_dot");
  l_dot.setAttribute("title", "Toujours masquer les aperçus pour " +
    p_pseudo + " (rouge)\nou \u00ab sauf pour les citations \u00bb (bleu)");
  l_dot.dataset.pseudo = p_pseudo;
  l_dot.dataset.status = p_status;
  l_dot.classList.toggle("gmhfrblr21_dot_on", p_status === "on");
  l_dot.classList.toggle("gmhfrblr21_dot_soft", p_status === "soft");
  l_dot.addEventListener("click", prevent_default, false);
  l_dot.addEventListener("contextmenu", prevent_default, false);
  l_dot.addEventListener("mousedown", prevent_default, false);
  l_dot.addEventListener("mouseup", function(p_event) {
    dot_changed(this);
    if(p_close) {
      close_popups();
    }
  }, false);
  return l_dot;
}

// fonction de mise à jour de l'option "sauf pour les citations" en fonction de l'option "masquer les aperçus"
function update_except_quote(p_enabled) {
  if(p_enabled) {
    document.querySelector("label[for=\"gmhfrblr21_except_quotes_input\"]")
      .classList.remove("gmhfrblr21_disabled");
    document.getElementById("gmhfrblr21_except_quotes_input").removeAttribute("disabled");
  } else {
    document.querySelector("label[for=\"gmhfrblr21_except_quotes_input\"]")
      .classList.add("gmhfrblr21_disabled");
    document.getElementById("gmhfrblr21_except_quotes_input").setAttribute("disabled", "disabled");
  }
}

// fonction de gestion du changement de profil
function profile_changed(p_event) {

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste profile_changed gmhfrblr21_parameters avant : ",
      JSON.stringify(gmhfrblr21_parameters));
  }

  // désactivation de l'ancien profil
  if(profile_type === "topic" || (profile_type === "category" && this.dataset.type === "global")) {
    gmhfrblr21_parameters[profile].a = false;
  }
  // création si besoin et activation du nouveau profil
  let l_old_profile = profile;
  profile_active = this.dataset.active;
  profile = this.value;
  profile_type = this.dataset.type;
  if(typeof gmhfrblr21_parameters[profile] === "undefined") {
    gmhfrblr21_parameters[profile] = {
      "a": true,
      "d": false,
      "h": false,
      "s": false,
      "e": false,
    };
  } else {
    gmhfrblr21_parameters[profile].a = true;
  }
  GM.setValue("gmhfrblr21_parameters", JSON.stringify(gmhfrblr21_parameters));

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste profile_changed gmhfrblr21_parameters après : ",
      JSON.stringify(gmhfrblr21_parameters));
  }

  // affichage du nouveau profil dans la popup
  let l_disabled_text = profile_type === "global" ? "Désactiver la bloque liste globalement" :
    (profile_type === "category" ? "Désactiver la bloque liste pour cette catégorie" :
      "Désactiver la bloque liste pour ce topic");
  document.querySelector("label[for=\"gmhfrblr21_disabled_input\"]").setAttribute("title", l_disabled_text);
  document.querySelector("label[for=\"gmhfrblr21_disabled_input\"]").textContent = l_disabled_text;
  document.getElementById("gmhfrblr21_disabled_input").setAttribute("title", l_disabled_text);
  document.getElementById("gmhfrblr21_disabled_input").checked = gmhfrblr21_parameters[profile].d;
  document.getElementById("gmhfrblr21_hide_posts_with_input").checked = gmhfrblr21_parameters[profile].h;
  document.getElementById("gmhfrblr21_hide_snippets_input").checked = gmhfrblr21_parameters[profile].s;
  document.getElementById("gmhfrblr21_except_quotes_input").checked = gmhfrblr21_parameters[profile].e;
  update_except_quote(gmhfrblr21_parameters[profile].s);
  document.getElementById("gmhfrblr21_config")
    .classList.toggle("gmhfrblr21_disabled", gmhfrblr21_parameters[profile].d);
  // mise en place du nouveau profil
  if(gmhfrblr21_parameters[l_old_profile].d === false && gmhfrblr21_parameters[profile].d === false) {
    disable_bloque_liste();
    enable_bloque_liste();
  } else if(gmhfrblr21_parameters[l_old_profile].d === false && gmhfrblr21_parameters[profile].d === true) {
    disable_bloque_liste();
  } else if(gmhfrblr21_parameters[l_old_profile].d === true && gmhfrblr21_parameters[profile].d === false) {
    enable_bloque_liste();
  }
}

// fonction de création de la popup de gestion de la bloque liste
function display_config(p_event) {
  if(typeof p_event !== "undefined") {
    p_event.preventDefault();
    p_event.stopPropagation();
    config_position = {
      top: (window.scrollY + p_event.clientY + 16) + "px",
      left: (window.scrollX + p_event.clientX + 16) + "px",
    };
    if(p_event.button === 2) {
      show_config_window();
      return;
    }
  }
  // fermeture des popups ouvertes
  close_popups();
  // construction de la popup
  let l_popup_config = document.createElement("div");
  l_popup_config.setAttribute("id", "gmhfrblr21_config");
  l_popup_config.setAttribute("class", "gmhfrblr21_popup");
  l_popup_config.classList.toggle("gmhfrblr21_disabled", gmhfrblr21_parameters[profile].d);
  l_popup_config.addEventListener("contextmenu", prevent_default, false);
  l_popup_config.addEventListener("mouseup", function(p_event) {
    p_event.preventDefault();
    p_event.stopPropagation();
  }, false);
  // titre de la popup
  let l_title = document.createElement("div");
  l_title.setAttribute("class", "gmhfrblr21_title");
  l_title.textContent = "Gestion de la bloque liste";
  // bouton de fermeture de la popup
  let l_close = document.createElement("img");
  l_close.setAttribute("src", img_close);
  l_close.setAttribute("alt", "Fermer");
  l_close.setAttribute("title", "Fermer");
  l_close.addEventListener("click", prevent_default, false);
  l_close.addEventListener("contextmenu", prevent_default, false);
  l_close.addEventListener("mousedown", prevent_default, false);
  l_close.addEventListener("mouseup", close_popups, false);
  l_title.appendChild(l_close);
  l_popup_config.appendChild(l_title);
  // option de choix du profil
  if(profile_2 !== null) {
    let l_profile_div = document.createElement("div");
    l_profile_div.setAttribute("class", "gmhfrblr21_flex gmhfrblr21_profile");
    // profil 1
    let l_profile_1_text = profile_1 === "global" ? "Profil global" : "Profil pour cette catégorie";
    let l_profile_1_value = profile_1 === "global" ? "global" : category;
    let l_profile_1_label = document.createElement("label");
    l_profile_1_label.setAttribute("for", "gmhfrblr21_profile_1_input");
    l_profile_1_label.setAttribute("title", l_profile_1_text);
    l_profile_1_label.textContent = l_profile_1_text;
    l_profile_div.appendChild(l_profile_1_label);
    let l_profile_1_input = document.createElement("input");
    l_profile_1_input.setAttribute("id", "gmhfrblr21_profile_1_input");
    l_profile_1_input.setAttribute("type", "radio");
    l_profile_1_input.setAttribute("name", "gmhfrblr21_profile_name");
    l_profile_1_input.setAttribute("value", l_profile_1_value);
    l_profile_1_input.setAttribute("title", l_profile_1_text);
    l_profile_1_input.dataset.active = "1";
    l_profile_1_input.dataset.type = profile_1;
    l_profile_1_input.checked = profile_active === "1";
    l_profile_1_input.addEventListener("contextmenu", prevent_default, false);
    l_profile_1_input.addEventListener("change", profile_changed, false);
    l_profile_div.appendChild(l_profile_1_input);
    // profil 2
    let l_profile_2_text = profile_2 === "category" ? "Profil pour cette catégorie" : "Profil pour ce topic";
    let l_profile_2_value = profile_2 === "category" ? category : topic;
    let l_profile_2_label = document.createElement("label");
    l_profile_2_label.setAttribute("for", "gmhfrblr21_profile_2_input");
    l_profile_2_label.setAttribute("title", l_profile_2_text);
    l_profile_2_label.textContent = l_profile_2_text;
    l_profile_div.appendChild(l_profile_2_label);
    let l_profile_2_input = document.createElement("input");
    l_profile_2_input.setAttribute("id", "gmhfrblr21_profile_2_input");
    l_profile_2_input.setAttribute("type", "radio");
    l_profile_2_input.setAttribute("name", "gmhfrblr21_profile_name");
    l_profile_2_input.setAttribute("value", l_profile_2_value);
    l_profile_2_input.setAttribute("title", l_profile_2_text);
    l_profile_2_input.dataset.active = "2";
    l_profile_2_input.dataset.type = profile_2;
    l_profile_2_input.checked = profile_active === "2";
    l_profile_2_input.addEventListener("contextmenu", prevent_default, false);
    l_profile_2_input.addEventListener("change", profile_changed, false);
    l_profile_div.appendChild(l_profile_2_input);
    l_popup_config.appendChild(l_profile_div);
  }
  // option de désactivation de la bloque liste
  let l_disabled_div = document.createElement("div");
  l_disabled_div.setAttribute("class", "gmhfrblr21_flex");
  let l_disabled_text = profile_type === "global" ? "Désactiver la bloque liste globalement" :
    (profile_type === "category" ? "Désactiver la bloque liste pour cette catégorie" :
      "Désactiver la bloque liste pour ce topic");
  let l_disabled_label = document.createElement("label");
  l_disabled_label.setAttribute("for", "gmhfrblr21_disabled_input");
  l_disabled_label.setAttribute("title", l_disabled_text);
  l_disabled_label.textContent = l_disabled_text;
  l_disabled_div.appendChild(l_disabled_label);
  let l_disabled_input = document.createElement("input");
  l_disabled_input.setAttribute("id", "gmhfrblr21_disabled_input");
  l_disabled_input.setAttribute("type", "checkbox");
  l_disabled_input.setAttribute("title", l_disabled_text);
  l_disabled_input.checked = gmhfrblr21_parameters[profile].d;
  l_disabled_input.addEventListener("contextmenu", prevent_default, false);
  l_disabled_input.addEventListener("change", function() {
    gmhfrblr21_parameters[profile].d = this.checked;
    GM.setValue("gmhfrblr21_parameters", JSON.stringify(gmhfrblr21_parameters));
    l_popup_config.classList.toggle("gmhfrblr21_disabled", gmhfrblr21_parameters[profile].d);

    // DEBUG
    if(do_debug) {
      console.log(
        "DEBUG [HFR] Bloque liste display_config change l_disabled_input gmhfrblr21_parameters : ",
        JSON.stringify(gmhfrblr21_parameters));
    }

    gmhfrblr21_parameters[profile].d ? disable_bloque_liste() : enable_bloque_liste();
  }, false);
  l_disabled_div.appendChild(l_disabled_input);
  l_popup_config.appendChild(l_disabled_div);
  // option de masquage des messages contenant une citation bloquée
  let l_hide_posts_with_div = document.createElement("div");
  l_hide_posts_with_div.setAttribute("class", "gmhfrblr21_flex");
  let l_hide_posts_with_label = document.createElement("label");
  l_hide_posts_with_label.setAttribute("for", "gmhfrblr21_hide_posts_with_input");
  l_hide_posts_with_label.setAttribute("title", "Masquer les messages contenant une citation bloquée");
  l_hide_posts_with_label.textContent = "Masquer les messages contenant une citation bloquée";
  l_hide_posts_with_div.appendChild(l_hide_posts_with_label);
  let l_hide_posts_with_input = document.createElement("input");
  l_hide_posts_with_input.setAttribute("id", "gmhfrblr21_hide_posts_with_input");
  l_hide_posts_with_input.setAttribute("type", "checkbox");
  l_hide_posts_with_input.setAttribute("title", "Masquer les messages contenant une citation bloquée");
  l_hide_posts_with_input.checked = gmhfrblr21_parameters[profile].h;
  l_hide_posts_with_input.addEventListener("contextmenu", prevent_default, false);
  l_hide_posts_with_input.addEventListener("change", function() {
    gmhfrblr21_parameters[profile].h = this.checked;
    GM.setValue("gmhfrblr21_parameters", JSON.stringify(gmhfrblr21_parameters));

    // DEBUG
    if(do_debug) {
      console.log(
        "DEBUG [HFR] Bloque liste display_config change l_hide_posts_with_input gmhfrblr21_parameters : ",
        JSON.stringify(gmhfrblr21_parameters));
    }

    if(gmhfrblr21_parameters[profile].d === false) {
      rehide_contents();
      gmhfrblr21_parameters[profile].h ? hide_posts_with_blocked_quote() : show_posts_with_blocked_quote();
    }
  }, false);
  l_hide_posts_with_div.appendChild(l_hide_posts_with_input);
  l_popup_config.appendChild(l_hide_posts_with_div);
  // option de masquage des aperçus
  let l_snippets_div = document.createElement("div");
  l_snippets_div.setAttribute("class", "gmhfrblr21_flex gmhfrblr21_snippets");
  let l_hide_snippets_label = document.createElement("label");
  l_hide_snippets_label.setAttribute("for", "gmhfrblr21_hide_snippets_input");
  l_hide_snippets_label.setAttribute("title", "Masquer les aperçus");
  l_hide_snippets_label.textContent = "Masquer les aperçus";
  l_snippets_div.appendChild(l_hide_snippets_label);
  let l_hide_snippets_input = document.createElement("input");
  l_hide_snippets_input.setAttribute("id", "gmhfrblr21_hide_snippets_input");
  l_hide_snippets_input.setAttribute("type", "checkbox");
  l_hide_snippets_input.setAttribute("title", "Masquer les aperçus");
  l_hide_snippets_input.checked = gmhfrblr21_parameters[profile].s;
  l_hide_snippets_input.addEventListener("contextmenu", prevent_default, false);
  l_hide_snippets_input.addEventListener("change", function() {
    gmhfrblr21_parameters[profile].s = this.checked;
    GM.setValue("gmhfrblr21_parameters", JSON.stringify(gmhfrblr21_parameters));
    update_except_quote(this.checked);

    // DEBUG
    if(do_debug) {
      console.log(
        "DEBUG [HFR] Bloque liste display_config change l_hide_snippets_input gmhfrblr21_parameters : ",
        JSON.stringify(gmhfrblr21_parameters));
    }

    if(gmhfrblr21_parameters[profile].d === false) {
      rehide_contents();
      update_snippets();
    }
  }, false);
  l_snippets_div.appendChild(l_hide_snippets_input);
  // option d'exception pour les citations
  let l_except_quotes_label = document.createElement("label");
  l_except_quotes_label.setAttribute("for", "gmhfrblr21_except_quotes_input");
  l_except_quotes_label.setAttribute("title",
    "Ne pas masquer les aperçus pour les citations\net pour les messages contenant une citation");
  l_except_quotes_label.textContent = "sauf pour les citations";
  l_snippets_div.appendChild(l_except_quotes_label);
  let l_except_quotes_input = document.createElement("input");
  l_except_quotes_input.setAttribute("id", "gmhfrblr21_except_quotes_input");
  l_except_quotes_input.setAttribute("type", "checkbox");
  l_except_quotes_input.setAttribute("title",
    "Ne pas masquer les aperçus pour les citations\net pour les messages contenant une citation");
  l_except_quotes_input.checked = gmhfrblr21_parameters[profile].e;
  l_except_quotes_input.addEventListener("contextmenu", prevent_default, false);
  l_except_quotes_input.addEventListener("change", function() {
    gmhfrblr21_parameters[profile].e = this.checked;
    GM.setValue("gmhfrblr21_parameters", JSON.stringify(gmhfrblr21_parameters));

    // DEBUG
    if(do_debug) {
      console.log(
        "DEBUG [HFR] Bloque liste display_config change l_except_quotes_input gmhfrblr21_parameters : ",
        JSON.stringify(gmhfrblr21_parameters));
    }

    if(gmhfrblr21_parameters[profile].d === false) {
      rehide_contents();
      update_snippets();
    }
  }, false);
  l_snippets_div.appendChild(l_except_quotes_input);
  l_popup_config.appendChild(l_snippets_div);
  // ligne d'ajout d'un utilisateur à la bloque liste
  let l_add_div = document.createElement("div");
  l_add_div.setAttribute("class", "gmhfrblr21_flex gmhfrblr21_add");
  let l_add_input = document.createElement("input");
  l_add_input.setAttribute("type", "text");
  l_add_input.setAttribute("title", "Ajouter un nouvel utilisateur à la bloque liste");
  l_add_div.appendChild(l_add_input);
  let l_add_img = document.createElement("img");
  l_add_img.setAttribute("src", img_add);
  l_add_img.setAttribute("alt", "Ajouter");
  l_add_img.setAttribute("title", "Ajouter un nouvel utilisateur à la bloque liste");
  l_add_img.addEventListener("click", prevent_default, false);
  l_add_img.addEventListener("contextmenu", prevent_default, false);
  l_add_img.addEventListener("mousedown", prevent_default, false);
  l_add_img.addEventListener("mouseup", function(p_event) {
    let l_pseudo = l_add_input.value.trim();

    // DEBUG
    if(do_debug) {
      console.log(
        "DEBUG [HFR] Bloque liste display_config add pseudo : ",
        l_pseudo);
    }

    p_event.preventDefault();
    p_event.stopPropagation();
    if(l_pseudo !== "") {
      if(!is_pseudo_blocked(l_pseudo)) {
        add_pseudo(l_pseudo);
        if(gmhfrblr21_parameters[profile].d === false) {
          hide_posts();
          hide_quotes();
        }
        display_config();
      } else {
        window.alert("Cet utilisateur est déjà présent dans la bloque liste.");
      }
    }
  }, false);
  l_add_div.appendChild(l_add_img);
  l_popup_config.appendChild(l_add_div);
  // grille de suppression des utilisateurs de la bloque liste
  if(gmhfrblr21_bloque_liste.length) {
    let l_remove_grid = document.createElement("div");
    l_remove_grid.setAttribute("class", "gmhfrblr21_remove_grid");
    for(let l_pseudo of gmhfrblr21_bloque_liste) {
      let l_remove_div = document.createElement("div");
      l_remove_div.setAttribute("class", "gmhfrblr21_flex gmhfrblr21_between");
      let l_pseudo_div = document.createElement("div");
      l_pseudo_div.setAttribute("class", "gmhfrblr21_flex");
      let l_div_text = document.createElement("div");
      l_div_text.textContent = l_pseudo;
      l_pseudo_div.appendChild(l_div_text);
      l_pseudo_div.appendChild(create_dot(l_pseudo, pseudo_always_hidden_status(l_pseudo), false));
      l_remove_div.appendChild(l_pseudo_div);
      let l_remove_img = document.createElement("img");
      l_remove_img.setAttribute("src", img_remove);
      l_remove_img.setAttribute("alt", "Enlever");
      l_remove_img.setAttribute("title", "Enlever " + l_pseudo + " de la bloque liste");
      l_remove_img.addEventListener("click", prevent_default, false);
      l_remove_img.addEventListener("contextmenu", prevent_default, false);
      l_remove_img.addEventListener("mousedown", prevent_default, false);
      l_remove_img.addEventListener("mouseup", function(p_event) { // eslint-disable-line no-loop-func

        // DEBUG
        if(do_debug) {
          console.log(
            "DEBUG [HFR] Bloque liste display_config remove pseudo : ",
            l_pseudo);
        }

        p_event.preventDefault();
        p_event.stopPropagation();
        if(window.confirm("Êtes-vous sûr de vouloir enlever " + l_pseudo + " de la bloque liste ?") === true) {
          remove_pseudo(l_pseudo);
          if(gmhfrblr21_parameters[profile].d === false) {
            show_posts();
            show_quotes();
          }
          display_config();
        }
      }, false);
      l_remove_div.appendChild(l_remove_img);
      l_remove_grid.appendChild(l_remove_div);
    }
    l_popup_config.appendChild(l_remove_grid);
  }
  // positionnement et affichage de la popup
  l_popup_config.style.top = config_position.top;
  l_popup_config.style.left = config_position.left;
  document.body.appendChild(l_popup_config);
  update_except_quote(gmhfrblr21_parameters[profile].s);
}

// fonction de création de la popup de blocage ou de déblocage d'un utilisateur
function display_question(p_event) {
  p_event.preventDefault();
  p_event.stopPropagation();
  // fermeture des popups ouvertes
  close_popups();
  // récupération du pseudo
  let l_pseudo = this.parentElement.parentElement.querySelector("div > b.s2").firstChild.nodeValue;
  // construction de la popup
  let l_popup_question = document.createElement("div");
  l_popup_question.setAttribute("id", "gmhfrblr21_question");
  l_popup_question.setAttribute("class", "gmhfrblr21_popup");
  l_popup_question.classList.toggle("gmhfrblr21_disabled", gmhfrblr21_parameters[profile].d);
  l_popup_question.addEventListener("click", prevent_default, false);
  l_popup_question.addEventListener("contextmenu", prevent_default, false);
  l_popup_question.addEventListener("mousedown", prevent_default, false);
  l_popup_question.addEventListener("mouseup", function(p_event) {
    p_event.preventDefault();
    p_event.stopPropagation();
  }, false);
  // texte de la popup
  let l_question = document.createElement("div");
  l_popup_question.appendChild(l_question);
  // boutons de la popup
  let l_buttons = document.createElement("div");
  l_buttons.setAttribute("class", "gmhfrblr21_buttons");
  let l_save_close = document.createElement("div");
  // bouton de validation
  let l_save = document.createElement("img");
  l_save.setAttribute("src", img_save);
  l_save.setAttribute("alt", "Valider");
  l_save.setAttribute("title", "Valider");
  if(is_pseudo_blocked(l_pseudo)) {
    l_question.innerHTML = "Enlever <b>" + l_pseudo + "</b> de la bloque liste ?";
    // pastille de filtrage par utilisateur
    l_buttons.appendChild(create_dot(l_pseudo, pseudo_always_hidden_status(l_pseudo), true));
    l_save.addEventListener("click", prevent_default, false);
    l_save.addEventListener("contextmenu", prevent_default, false);
    l_save.addEventListener("mousedown", prevent_default, false);
    l_save.addEventListener("mouseup", function(p_event) {

      // DEBUG
      if(do_debug) {
        console.log(
          "DEBUG [HFR] Bloque liste display_question remove pseudo : ",
          l_pseudo);
      }

      p_event.preventDefault();
      p_event.stopPropagation();
      if(window.confirm("Êtes-vous sûr de vouloir enlever " + l_pseudo + " de la bloque liste ?") === true) {
        remove_pseudo(l_pseudo);
        if(gmhfrblr21_parameters[profile].d === false) {
          show_posts();
          show_quotes();
        }
        close_popups();
      }
    }, false);
  } else {
    l_question.innerHTML = "Ajouter <b>" + l_pseudo + "</b> à la bloque liste ?";
    // dummy div
    l_buttons.appendChild(document.createElement("div"));
    l_save.addEventListener("click", prevent_default, false);
    l_save.addEventListener("contextmenu", prevent_default, false);
    l_save.addEventListener("mousedown", prevent_default, false);
    l_save.addEventListener("mouseup", function(p_event) {

      // DEBUG
      if(do_debug) {
        console.log(
          "DEBUG [HFR] Bloque liste display_question add pseudo : ",
          l_pseudo);
      }

      p_event.preventDefault();
      p_event.stopPropagation();
      add_pseudo(l_pseudo);
      if(gmhfrblr21_parameters[profile].d === false) {
        hide_posts();
        hide_quotes();
      }
      close_popups();
    }, false);
  }
  l_save_close.appendChild(l_save);
  // bouton d'annulation / fermeture
  let l_close = document.createElement("img");
  l_close.setAttribute("src", img_close);
  l_close.setAttribute("alt", "Annuler");
  l_close.setAttribute("title", "Annuler");
  l_close.addEventListener("click", prevent_default, false);
  l_close.addEventListener("contextmenu", prevent_default, false);
  l_close.addEventListener("mousedown", prevent_default, false);
  l_close.addEventListener("mouseup", close_popups, false);
  l_save_close.appendChild(l_close);
  l_buttons.appendChild(l_save_close);
  l_popup_question.appendChild(l_buttons);
  // positionnement et affichage de la popup
  l_popup_question.style.top = (window.scrollY + p_event.clientY + 16) + "px";
  l_popup_question.style.left = (window.scrollX + p_event.clientX + 16) + "px";
  document.body.appendChild(l_popup_question);
}

/* -------------------------------------------------------------------------------- */
/* fonctions de gestion du masquage et de l'affichage des messages et des citations */
/* -------------------------------------------------------------------------------- */

// fonction de masquage des messages des utilisateurs bloqués
function hide_posts() {
  let l_post_authors = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable:not(.gmhfrblr21_blocked_type) > " +
    "tbody > tr > td.messCase1 > div:not([postalrecall]) > b.s2");
  for(let l_post_author of l_post_authors) {
    let l_pseudo =
      l_post_author.firstChild.nodeValue;
    let l_normalized_pseudo = normalize_pseudo(l_pseudo);
    if(is_normalized_pseudo_blocked(l_normalized_pseudo)) {
      let l_post_tr = l_post_author.parentElement.parentElement.parentElement;
      l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_blocked_type");
      l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
      l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_with_blocked_quote_type");
      let l_snippet_with_blocked_quote = l_post_tr.parentElement.querySelector("tr.gmhfrblr21_snippet_type");
      if(l_snippet_with_blocked_quote !== null) {
        l_post_tr.parentElement.removeChild(l_snippet_with_blocked_quote);
      }
      let l_snippet = document.createElement("tr");
      l_snippet.setAttribute("id", l_post_tr.querySelector(":scope > td.messCase1 > a[name]")
        .getAttribute("name"));
      l_snippet.classList.add("gmhfrblr21_snippet_type");
      l_snippet.classList.add(l_post_tr.classList.contains("cBackCouleurTab1") ?
        "cBackCouleurTab1" : "cBackCouleurTab2");
      if(gmhfrblr21_parameters[profile].s) {
        l_snippet.classList.add("gmhfrblr21_hide_snippets");
      }
      // masquage des aperçus des messages des utilisateurs toujours masqués
      if(is_normalized_pseudo_always_hidden(l_normalized_pseudo)) {
        l_snippet.classList.add("gmhfrblr21_always_hide_snippets");
      }
      // masquage des aperçus des messages des utilisateurs toujours masqués mais pas trop
      if(is_normalized_pseudo_soft_always_hidden(l_normalized_pseudo)) {
        l_snippet.classList.add("gmhfrblr21_soft_always_hide_snippets");
      }
      let l_snippet_td = document.createElement("td");
      l_snippet_td.setAttribute("colspan", "2");
      let l_snippet_span = document.createElement("span");
      l_snippet_span.setAttribute("class", "cLink");
      l_snippet_span.innerHTML =
        "Afficher le message de <b>" + l_pseudo + "</b> qui est bloqué";
      l_snippet_span.dataset.status = "hidden";
      l_snippet_span.addEventListener("click", prevent_default, false);
      l_snippet_span.addEventListener("contextmenu", prevent_default, false);
      l_snippet_span.addEventListener("mousedown", prevent_default, false);
      l_snippet_span.addEventListener("mouseup", function(p_event) {
        p_event.preventDefault();
        if(this.dataset.status === "hidden") {
          this.dataset.status = "shown";
          l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_hidden");
          this.innerHTML =
            "Masquer le message de <b>" + l_pseudo + "</b> qui est bloqué";
        } else {
          this.dataset.status = "hidden";
          l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
          this.innerHTML =
            "Afficher le message de <b>" + l_pseudo + "</b> qui est bloqué";
        }
      }, false);
      l_snippet_td.appendChild(l_snippet_span);
      l_snippet.appendChild(l_snippet_td);
      l_post_tr.parentElement.insertBefore(l_snippet, l_post_tr);
    }
  }
  hide_posts_normal();
}

// fonction de masquage des messages des utilisateurs bloqués sur la page de réponse normale
function hide_posts_normal() {
  let l_post_authors = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions > form#hop ~ form#apercu_form ~ table > " +
    "tbody > tr.message > td.messCase1bis");
  for(let l_post_author of l_post_authors) {
    let l_pseudo =
      l_post_author.firstChild.nodeValue;
    let l_normalized_pseudo = normalize_pseudo(l_pseudo);
    if(is_normalized_pseudo_blocked(l_normalized_pseudo)) {
      let l_post_tr = l_post_author.parentElement;
      l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_blocked_type");
      l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
      l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_with_blocked_quote_type");
      let l_snippet_with_blocked_quote = l_post_tr.parentElement.querySelector("tr.gmhfrblr21_snippet_type");
      if(l_snippet_with_blocked_quote !== null) {
        l_post_tr.parentElement.removeChild(l_snippet_with_blocked_quote);
      }
      let l_snippet = document.createElement("tr");
      l_snippet.classList.add("gmhfrblr21_snippet_type");
      l_snippet.style.backgroundColor = l_post_tr.style.backgroundColor;
      if(gmhfrblr21_parameters[profile].s) {
        l_snippet.classList.add("gmhfrblr21_hide_snippets");
      }
      // masquage des aperçus des messages des utilisateurs toujours masqués
      if(is_normalized_pseudo_always_hidden(l_normalized_pseudo)) {
        l_snippet.classList.add("gmhfrblr21_always_hide_snippets");
      }
      // masquage des aperçus des messages des utilisateurs toujours masqués mais pas trop
      if(is_normalized_pseudo_soft_always_hidden(l_normalized_pseudo)) {
        l_snippet.classList.add("gmhfrblr21_soft_always_hide_snippets");
      }
      let l_snippet_td = document.createElement("td");
      l_snippet_td.setAttribute("colspan", "2");
      let l_snippet_span = document.createElement("span");
      l_snippet_span.setAttribute("class", "cLink");
      l_snippet_span.innerHTML =
        "Afficher le message de <b>" + l_pseudo + "</b> qui est bloqué";
      l_snippet_span.dataset.status = "hidden";
      l_snippet_span.addEventListener("click", prevent_default, false);
      l_snippet_span.addEventListener("contextmenu", prevent_default, false);
      l_snippet_span.addEventListener("mousedown", prevent_default, false);
      l_snippet_span.addEventListener("mouseup", function(p_event) {
        p_event.preventDefault();
        if(this.dataset.status === "hidden") {
          this.dataset.status = "shown";
          l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_hidden");
          this.innerHTML =
            "Masquer le message de <b>" + l_pseudo + "</b> qui est bloqué";
        } else {
          this.dataset.status = "hidden";
          l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
          this.innerHTML =
            "Afficher le message de <b>" + l_pseudo + "</b> qui est bloqué";
        }
      }, false);
      l_snippet_td.appendChild(l_snippet_span);
      l_snippet.appendChild(l_snippet_td);
      l_post_tr.parentElement.insertBefore(l_snippet, l_post_tr);
    }
  }
}

// fonction de masquage des citations des utilisateurs bloqués
function hide_quotes() {
  let l_quotes = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable > tbody > tr > td.messCase2 " +
    "div.container:not(.gmhfrblr21_blocked_type) > table.citation, " +
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable > tbody > tr > td.messCase2 " +
    "div.container:not(.gmhfrblr21_blocked_type) > table.oldcitation");
  for(let l_quote of l_quotes) {
    let l_title =
      l_quote.querySelector(":scope > tbody > tr.none > td > b.s1 > a.Topic");
    if(l_title !== null && l_title.firstChild && l_title.firstChild.nodeValue !== null) {
      let l_pseudo =
        l_title.firstChild.nodeValue.replace(/ a écrit :$/, "");
      let l_buggy_and_normalized_pseudo = add_buggy_encoding_and_normalize_pseudo(l_pseudo);
      if(is_normalized_pseudo_blocked(l_buggy_and_normalized_pseudo)) {
        l_quote.parentElement.classList.add("gmhfrblr21_blocked_type");
        l_quote.parentElement.classList.add("gmhfrblr21_hidden");
        let l_snippet = document.createElement("table");
        l_snippet.classList.add("gmhfrblr21_snippet_type");
        l_snippet.classList.add(l_quote.classList.contains("citation") ?
          "citation" : "oldcitation");
        if(gmhfrblr21_parameters[profile].s && !gmhfrblr21_parameters[profile].e) {
          l_snippet.classList.add("gmhfrblr21_hide_snippets");
        }
        // masquage des aperçus des citations des utilisateurs toujours masqués
        if(is_normalized_pseudo_always_hidden(l_buggy_and_normalized_pseudo)) {
          l_snippet.classList.add("gmhfrblr21_always_hide_snippets");
        }
        let l_snippet_tbody = document.createElement("tbody");
        let l_snippet_tr = document.createElement("tr");
        l_snippet_tr.setAttribute("class", "none");
        let l_snippet_td = document.createElement("td");
        let l_snippet_span = document.createElement("span");
        l_snippet_span.setAttribute("class", "cLink");
        l_snippet_span.innerHTML =
          "Afficher la citation de <b>" + l_pseudo + "</b> qui est bloqué";
        l_snippet_span.dataset.status = "hidden";
        l_snippet_span.addEventListener("click", prevent_default, false);
        l_snippet_span.addEventListener("contextmenu", prevent_default, false);
        l_snippet_span.addEventListener("mousedown", prevent_default, false);
        l_snippet_span.addEventListener("mouseup", function(p_event) {
          p_event.preventDefault();
          if(this.dataset.status === "hidden") {
            this.dataset.status = "shown";
            l_quote.parentElement.classList.remove("gmhfrblr21_hidden");
            this.innerHTML =
              "Masquer la citation de <b>" + l_pseudo + "</b> qui est bloqué";
            l_snippet.style.marginBottom = "-9px";
          } else {
            this.dataset.status = "hidden";
            l_quote.parentElement.classList.add("gmhfrblr21_hidden");
            this.innerHTML =
              "Afficher la citation de <b>" + l_pseudo + "</b> qui est bloqué";
            l_snippet.style.marginBottom = "";
          }
        }, false);
        l_snippet_td.appendChild(l_snippet_span);
        l_snippet_tr.appendChild(l_snippet_td);
        l_snippet_tbody.appendChild(l_snippet_tr);
        l_snippet.appendChild(l_snippet_tbody);
        l_quote.parentElement.insertBefore(l_snippet, l_quote);
      }
    }
  }
  // masquage des aperçus des messages des utilisateurs bloqués
  // contenant une citation d'un utilisateur toujours masqué
  if(gmhfrblr21_parameters[profile].h) {
    let l_snippets = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_blocked_type > " +
      "tbody > tr.gmhfrblr21_snippet_type:not(.gmhfrblr21_with_always_hide_snippets)");
    for(let l_snippet of l_snippets) {
      if(l_snippet.parentElement.querySelector("div.container.gmhfrblr21_blocked_type > " +
          "table.gmhfrblr21_snippet_type.gmhfrblr21_always_hide_snippets") !== null) {
        l_snippet.classList.add("gmhfrblr21_with_always_hide_snippets");
      }
    }
  }
  hide_posts_with_blocked_quote();
  hide_quotes_normal();
}

// fonction de masquage des citations des utilisateurs bloqués sur la page de réponse normale
function hide_quotes_normal() {
  let l_quotes = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions > form#hop ~ form#apercu_form ~ table > " +
    "tbody > tr > td.messCase1bis + td " +
    "div.container:not(.gmhfrblr21_blocked_type) > table.citation, " +
    "div#mesdiscussions.mesdiscussions > form#hop ~ form#apercu_form ~ table > " +
    "tbody > tr > td.messCase1bis + td " +
    "div.container:not(.gmhfrblr21_blocked_type) > table.oldcitation");
  for(let l_quote of l_quotes) {
    let l_title =
      l_quote.querySelector(":scope > tbody > tr.none > td > b.s1 > a.Topic");
    if(l_title !== null && l_title.firstChild && l_title.firstChild.nodeValue !== null) {
      let l_pseudo =
        l_title.firstChild.nodeValue.replace(/ a écrit :$/, "");
      let l_buggy_and_normalized_pseudo = add_buggy_encoding_and_normalize_pseudo(l_pseudo);
      if(is_normalized_pseudo_blocked(l_buggy_and_normalized_pseudo)) {
        l_quote.parentElement.classList.add("gmhfrblr21_blocked_type");
        l_quote.parentElement.classList.add("gmhfrblr21_hidden");
        let l_snippet = document.createElement("table");
        l_snippet.classList.add("gmhfrblr21_snippet_type");
        l_snippet.classList.add(l_quote.classList.contains("citation") ?
          "citation" : "oldcitation");
        if(gmhfrblr21_parameters[profile].s && !gmhfrblr21_parameters[profile].e) {
          l_snippet.classList.add("gmhfrblr21_hide_snippets");
        }
        // masquage des aperçus des citations des utilisateurs toujours masqués
        if(is_normalized_pseudo_always_hidden(l_buggy_and_normalized_pseudo)) {
          l_snippet.classList.add("gmhfrblr21_always_hide_snippets");
        }
        let l_snippet_tbody = document.createElement("tbody");
        let l_snippet_tr = document.createElement("tr");
        l_snippet_tr.setAttribute("class", "none");
        let l_snippet_td = document.createElement("td");
        let l_snippet_span = document.createElement("span");
        l_snippet_span.setAttribute("class", "cLink");
        l_snippet_span.innerHTML =
          "Afficher la citation de <b>" + l_pseudo + "</b> qui est bloqué";
        l_snippet_span.dataset.status = "hidden";
        l_snippet_span.addEventListener("click", prevent_default, false);
        l_snippet_span.addEventListener("contextmenu", prevent_default, false);
        l_snippet_span.addEventListener("mousedown", prevent_default, false);
        l_snippet_span.addEventListener("mouseup", function(p_event) {
          p_event.preventDefault();
          if(this.dataset.status === "hidden") {
            this.dataset.status = "shown";
            l_quote.parentElement.classList.remove("gmhfrblr21_hidden");
            this.innerHTML =
              "Masquer la citation de <b>" + l_pseudo + "</b> qui est bloqué";
            l_snippet.style.marginBottom = "-9px";
          } else {
            this.dataset.status = "hidden";
            l_quote.parentElement.classList.add("gmhfrblr21_hidden");
            this.innerHTML =
              "Afficher la citation de <b>" + l_pseudo + "</b> qui est bloqué";
            l_snippet.style.marginBottom = "";
          }
        }, false);
        l_snippet_td.appendChild(l_snippet_span);
        l_snippet_tr.appendChild(l_snippet_td);
        l_snippet_tbody.appendChild(l_snippet_tr);
        l_snippet.appendChild(l_snippet_tbody);
        l_quote.parentElement.insertBefore(l_snippet, l_quote);
      }
    }
  }
  // masquage des aperçus des messages des utilisateurs bloqués
  // contenant une citation d'un utilisateur toujours masqué
  if(gmhfrblr21_parameters[profile].h) {
    let l_snippets = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions > form#hop ~ form#apercu_form ~ " +
      "table.gmhfrblr21_blocked_type > " +
      "tbody > tr.gmhfrblr21_snippet_type:not(.gmhfrblr21_with_always_hide_snippets)");
    for(let l_snippet of l_snippets) {
      if(l_snippet.parentElement.querySelector("div.container.gmhfrblr21_blocked_type > " +
          "table.gmhfrblr21_snippet_type.gmhfrblr21_always_hide_snippets") !== null) {
        l_snippet.classList.add("gmhfrblr21_with_always_hide_snippets");
      }
    }
  }
  hide_posts_with_blocked_quote_normal();
}

// fonction de masquage des messages contenant une citation d'un utilisateur bloqué
function hide_posts_with_blocked_quote() {
  if(gmhfrblr21_parameters[profile].h) {
    // mise à jour de la présence d'une citation non bloquée
    let l_post_trs = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_with_blocked_quote_type > " +
      "tbody > tr:not(.gmhfrblr21_snippet_type)");
    for(let l_post_tr of l_post_trs) {
      let l_quote = l_post_tr.querySelector(
        "div.container:not(.gmhfrblr21_blocked_type) > table.citation, " +
        "div.container:not(.gmhfrblr21_blocked_type) > table.oldcitation");
      if(l_quote !== null) {
        l_post_tr.previousElementSibling.querySelector("span.gmhfrblr21_quote").innerHTML =
          " (<b>et au moins une citation non bloquée</b>)";
      } else {
        l_post_tr.previousElementSibling.querySelector("span.gmhfrblr21_quote").textContent = "";
      }
    }
    l_post_trs = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable:not(.gmhfrblr21_blocked_type):not(.gmhfrblr21_with_blocked_quote_type) > " +
      "tbody > tr");
    for(let l_post_tr of l_post_trs) {
      if(l_post_tr.querySelector("div.container.gmhfrblr21_blocked_type") !== null) {
        let l_pseudo =
          l_post_tr.querySelector(":scope > td.messCase1 > div:not([postalrecall]) > b.s2")
          .firstChild.nodeValue;
        l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_with_blocked_quote_type");
        l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
        let l_snippet = document.createElement("tr");
        l_snippet.setAttribute("id", l_post_tr.querySelector(":scope > td.messCase1 > a[name]")
          .getAttribute("name"));
        l_snippet.classList.add("gmhfrblr21_snippet_type");
        l_snippet.classList.add(l_post_tr.classList.contains("cBackCouleurTab1") ?
          "cBackCouleurTab1" : "cBackCouleurTab2");
        if(gmhfrblr21_parameters[profile].s && !gmhfrblr21_parameters[profile].e) {
          l_snippet.classList.add("gmhfrblr21_hide_snippets");
        }
        // masquage des aperçus des messages contenant une citation d'un utilisateur toujours masqué
        if(l_post_tr.querySelector("div.container.gmhfrblr21_blocked_type > " +
            "table.gmhfrblr21_snippet_type.gmhfrblr21_always_hide_snippets") !== null) {
          l_snippet.classList.add("gmhfrblr21_with_always_hide_snippets");
        }
        // la présence d'une citation non bloquée
        let l_quote_text = "";
        let l_quote = l_post_tr.querySelector(
          "div.container:not(.gmhfrblr21_blocked_type) > table.citation, " +
          "div.container:not(.gmhfrblr21_blocked_type) > table.oldcitation");
        if(l_quote !== null) {
          l_quote_text = " (<b>et au moins une citation non bloquée</b>)";
        }
        let l_snippet_td = document.createElement("td");
        l_snippet_td.setAttribute("colspan", "2");
        let l_snippet_span = document.createElement("span");
        l_snippet_span.setAttribute("class", "cLink");
        l_snippet_span.innerHTML =
          "<span class=\"gmhfrblr21_action\">Afficher</span> le message de <b>" + l_pseudo +
          "</b> qui contient au moins une citation bloquée<span class=\"gmhfrblr21_quote\">" +
          l_quote_text + "</span>";
        l_snippet_span.dataset.status = "hidden";
        l_snippet_span.addEventListener("click", prevent_default, false);
        l_snippet_span.addEventListener("contextmenu", prevent_default, false);
        l_snippet_span.addEventListener("mousedown", prevent_default, false);
        l_snippet_span.addEventListener("mouseup", function(p_event) {
          p_event.preventDefault();
          if(this.dataset.status === "hidden") {
            this.dataset.status = "shown";
            l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_hidden");
            this.querySelector("span.gmhfrblr21_action").firstChild.nodeValue = "Masquer";
          } else {
            this.dataset.status = "hidden";
            l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
            this.querySelector("span.gmhfrblr21_action").firstChild.nodeValue = "Afficher";
          }
        }, false);
        l_snippet_td.appendChild(l_snippet_span);
        l_snippet.appendChild(l_snippet_td);
        l_post_tr.parentElement.insertBefore(l_snippet, l_post_tr);
      }
    }
  }
}

// fonction de masquage des messages contenant une citation d'un utilisateur bloqué sur la page de réponse normale
function hide_posts_with_blocked_quote_normal() {
  if(gmhfrblr21_parameters[profile].h) {
    // mise à jour de la présence d'une citation non bloquée
    let l_post_trs = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions > " +
      "form#hop ~ form#apercu_form ~ table.gmhfrblr21_with_blocked_quote_type > " +
      "tbody > tr.message:not(.gmhfrblr21_snippet_type)");
    for(let l_post_tr of l_post_trs) {
      let l_quote = l_post_tr.querySelector(
        "div.container:not(.gmhfrblr21_blocked_type) > table.citation, " +
        "div.container:not(.gmhfrblr21_blocked_type) > table.oldcitation");
      if(l_quote !== null) {
        l_post_tr.previousElementSibling.querySelector("span.gmhfrblr21_quote").innerHTML =
          " (<b>et au moins une citation non bloquée</b>)";
      } else {
        l_post_tr.previousElementSibling.querySelector("span.gmhfrblr21_quote").textContent = "";
      }
    }
    l_post_trs = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions > form#hop ~ form#apercu_form ~ " +
      "table:not(.gmhfrblr21_blocked_type):not(.gmhfrblr21_with_blocked_quote_type) > " +
      "tbody > tr.message");
    for(let l_post_tr of l_post_trs) {
      if(l_post_tr.querySelector("div.container.gmhfrblr21_blocked_type") !== null) {
        let l_pseudo =
          l_post_tr.querySelector(":scope > td.messCase1bis").firstChild.nodeValue;
        l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_with_blocked_quote_type");
        l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
        let l_snippet = document.createElement("tr");
        l_snippet.classList.add("gmhfrblr21_snippet_type");
        l_snippet.style.backgroundColor = l_post_tr.style.backgroundColor;
        if(gmhfrblr21_parameters[profile].s && !gmhfrblr21_parameters[profile].e) {
          l_snippet.classList.add("gmhfrblr21_hide_snippets");
        }
        // masquage des aperçus des messages contenant une citation d'un utilisateur toujours masqué
        if(l_post_tr.querySelector("div.container.gmhfrblr21_blocked_type > " +
            "table.gmhfrblr21_snippet_type.gmhfrblr21_always_hide_snippets") !== null) {
          l_snippet.classList.add("gmhfrblr21_with_always_hide_snippets");
        }
        // la présence d'une citation non bloquée
        let l_quote_text = "";
        let l_quote = l_post_tr.querySelector(
          "div.container:not(.gmhfrblr21_blocked_type) > table.citation, " +
          "div.container:not(.gmhfrblr21_blocked_type) > table.oldcitation");
        if(l_quote !== null) {
          l_quote_text = " (<b>et au moins une citation non bloquée</b>)";
        }
        let l_snippet_td = document.createElement("td");
        l_snippet_td.setAttribute("colspan", "2");
        let l_snippet_span = document.createElement("span");
        l_snippet_span.setAttribute("class", "cLink");
        l_snippet_span.innerHTML =
          "<span class=\"gmhfrblr21_action\">Afficher</span> le message de <b>" + l_pseudo +
          "</b> qui contient au moins une citation bloquée<span class=\"gmhfrblr21_quote\">" +
          l_quote_text + "</span>";
        l_snippet_span.dataset.status = "hidden";
        l_snippet_span.addEventListener("click", prevent_default, false);
        l_snippet_span.addEventListener("contextmenu", prevent_default, false);
        l_snippet_span.addEventListener("mousedown", prevent_default, false);
        l_snippet_span.addEventListener("mouseup", function(p_event) {
          p_event.preventDefault();
          if(this.dataset.status === "hidden") {
            this.dataset.status = "shown";
            l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_hidden");
            this.querySelector("span.gmhfrblr21_action").firstChild.nodeValue = "Masquer";
          } else {
            this.dataset.status = "hidden";
            l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
            this.querySelector("span.gmhfrblr21_action").firstChild.nodeValue = "Afficher";
          }
        }, false);
        l_snippet_td.appendChild(l_snippet_span);
        l_snippet.appendChild(l_snippet_td);
        l_post_tr.parentElement.insertBefore(l_snippet, l_post_tr);
      }
    }
  }
}

// fonction de re-masquage des messages et des citations bloqués qui ont été affichés
function rehide_contents() {
  // messages des utilisateurs bloqués
  let l_post_authors = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_blocked_type:not(.gmhfrblr21_hidden) > " +
    "tbody > tr > td.messCase1 > div:not([postalrecall]) > b.s2");
  for(let l_post_author of l_post_authors) {
    let l_pseudo =
      l_post_author.firstChild.nodeValue;
    let l_post_tr = l_post_author.parentElement.parentElement.parentElement;
    l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
    let l_snippet_span =
      l_post_tr.parentElement.querySelector("tr.gmhfrblr21_snippet_type > td > span");
    l_snippet_span.dataset.status = "hidden";
    l_snippet_span.innerHTML =
      "Afficher le message de <b>" + l_pseudo + "</b> qui est bloqué";
  }
  // citations des utilisateurs bloqués
  let l_quotes = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable > tbody > tr > td.messCase2 " +
    "div.container.gmhfrblr21_blocked_type:not(.gmhfrblr21_hidden) > " +
    "table:not(.gmhfrblr21_snippet_type)");
  for(let l_quote of l_quotes) {
    let l_title =
      l_quote.querySelector(":scope > tbody > tr.none > td > b.s1 > a.Topic");
    if(l_title !== null && l_title.firstChild && l_title.firstChild.nodeValue !== null) {
      let l_pseudo =
        l_title.firstChild.nodeValue.replace(/ a écrit :$/, "");
      l_quote.parentElement.classList.add("gmhfrblr21_hidden");
      let l_snippet_span =
        l_quote.parentElement.querySelector("table.gmhfrblr21_snippet_type > tbody > tr > td > span");
      l_snippet_span.dataset.status = "hidden";
      l_snippet_span.innerHTML =
        "Afficher la citation de <b>" + l_pseudo + "</b> qui est bloqué";
      l_snippet_span.parentElement.parentElement.parentElement.style.marginBottom = "";
    }
  }
  // messages contenant une citation d'un utilisateur bloqué
  if(gmhfrblr21_parameters[profile].h) {
    let l_post_with_blocked_quote_authors = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_with_blocked_quote_type:not(.gmhfrblr21_hidden) > " +
      "tbody > tr > td.messCase1 > div:not([postalrecall]) > b.s2");
    for(let l_post_author of l_post_with_blocked_quote_authors) {
      let l_pseudo =
        l_post_author.firstChild.nodeValue;
      let l_post_tr = l_post_author.parentElement.parentElement.parentElement;
      l_post_tr.parentElement.parentElement.classList.add("gmhfrblr21_hidden");
      let l_snippet_span =
        l_post_tr.parentElement.querySelector("tr.gmhfrblr21_snippet_type > td > span");
      l_snippet_span.dataset.status = "hidden";
      l_snippet_span.querySelector("span.gmhfrblr21_action").firstChild.nodeValue = "Afficher";
    }
  }
}

// fonction d'affichage des messages des utilisateurs enlevés de la bloque liste
function show_posts() {
  let l_post_authors = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_blocked_type > " +
    "tbody > tr > td.messCase1 > div:not([postalrecall]) > b.s2");
  for(let l_post_author of l_post_authors) {
    let l_pseudo =
      l_post_author.firstChild.nodeValue;
    if(!is_pseudo_blocked(l_pseudo)) {
      let l_post_tr = l_post_author.parentElement.parentElement.parentElement;
      l_post_tr.parentElement.removeChild(l_post_tr.previousElementSibling); // l'aperçu
      l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_blocked_type");
      l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_hidden");
    }
  }
  hide_posts_with_blocked_quote();
}

// function d'affichage des citations des utilisateurs enlevés de la bloque liste
function show_quotes() {
  let l_quotes = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable > tbody > tr > td.messCase2 " +
    "div.container.gmhfrblr21_blocked_type > " +
    "table:not(.gmhfrblr21_snippet_type)");
  for(let l_quote of l_quotes) {
    let l_title =
      l_quote.querySelector(":scope > tbody > tr.none > td > b.s1 > a.Topic");
    if(l_title !== null && l_title.firstChild && l_title.firstChild.nodeValue !== null) {
      let l_pseudo =
        l_title.firstChild.nodeValue.replace(/ a écrit :$/, "");
      if(!is_quoted_pseudo_blocked(l_pseudo)) {
        l_quote.parentElement.removeChild(l_quote.previousElementSibling); // l'aperçu
        l_quote.parentElement.classList.remove("gmhfrblr21_blocked_type");
        l_quote.parentElement.classList.remove("gmhfrblr21_hidden");
      }
    }
  }
  show_posts_with_blocked_quote();
  // réaffichage des aperçus des messages ne contenant plus de citation d'un utilisateur toujours masqué
  if(gmhfrblr21_parameters[profile].h) {
    let l_snippets = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_blocked_type > " +
      "tbody > tr.gmhfrblr21_snippet_type.gmhfrblr21_with_always_hide_snippets, " +
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_with_blocked_quote_type > " +
      "tbody > tr.gmhfrblr21_snippet_type.gmhfrblr21_with_always_hide_snippets");
    for(let l_snippet of l_snippets) {
      if(l_snippet.parentElement.querySelector("div.container.gmhfrblr21_blocked_type > " +
          "table.gmhfrblr21_snippet_type.gmhfrblr21_always_hide_snippets") === null) {
        l_snippet.classList.remove("gmhfrblr21_with_always_hide_snippets");
      }
    }
  }
}

// fonction d'affichage des messages ne contenant plus de citations d'utilisateurs bloqués
// ou de désactivation du masquage des messages contenant une citation d'un utilisateur bloqué
function show_posts_with_blocked_quote() {
  let l_post_trs = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_with_blocked_quote_type > " +
    "tbody > tr:not(.gmhfrblr21_snippet_type)");
  for(let l_post_tr of l_post_trs) {
    if((l_post_tr.querySelector("div.container.gmhfrblr21_blocked_type") === null) ||
      (gmhfrblr21_parameters[profile].h === false)) {
      l_post_tr.parentElement.removeChild(l_post_tr.previousElementSibling); // l'aperçu
      l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_with_blocked_quote_type");
      l_post_tr.parentElement.parentElement.classList.remove("gmhfrblr21_hidden");
    } else {
      // mise à jour de la présence d'une citation non bloquée
      let l_quote = l_post_tr.querySelector(
        "div.container:not(.gmhfrblr21_blocked_type) > table.citation, " +
        "div.container:not(.gmhfrblr21_blocked_type) > table.oldcitation");
      if(l_quote !== null) {
        l_post_tr.previousElementSibling.querySelector("span.gmhfrblr21_quote").innerHTML =
          " (<b>et au moins une citation non bloquée</b>)";
      } else {
        l_post_tr.previousElementSibling.querySelector("span.gmhfrblr21_quote").textContent = "";
      }
    }
  }
}

// fonction de masquage ou d'affichage des aperçus en fonction des options
function update_snippets() {
  let l_post_snippets = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_blocked_type > " +
    "tbody > tr.gmhfrblr21_snippet_type");
  for(let l_snippet of l_post_snippets) {
    l_snippet.classList.toggle("gmhfrblr21_hide_snippets",
      gmhfrblr21_parameters[profile].s);
  }
  let l_quote_snippets = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable > tbody > tr > td.messCase2 " +
    "div.container.gmhfrblr21_blocked_type > " +
    "table.gmhfrblr21_snippet_type");
  for(let l_snippet of l_quote_snippets) {
    l_snippet.classList.toggle("gmhfrblr21_hide_snippets",
      gmhfrblr21_parameters[profile].s && !gmhfrblr21_parameters[profile].e);
  }
  let l_post_with_blocked_quote_snippets = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_with_blocked_quote_type > " +
    "tbody > tr.gmhfrblr21_snippet_type");
  for(let l_snippet of l_post_with_blocked_quote_snippets) {
    l_snippet.classList.toggle("gmhfrblr21_hide_snippets",
      gmhfrblr21_parameters[profile].s && !gmhfrblr21_parameters[profile].e);
  }
}

// fonction de masquage des aperçus pour les utilisateurs toujours masqués
function add_always_hide_snippets() {
  rehide_contents();
  // masquage des aperçus des messages des utilisateurs toujours masqués
  let l_post_snippets = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_blocked_type > " +
    "tbody > tr.gmhfrblr21_snippet_type:not(.gmhfrblr21_always_hide_snippets)");
  for(let l_snippet of l_post_snippets) {
    let l_pseudo =
      l_snippet.parentElement.querySelector("tr > td.messCase1 > div:not([postalrecall]) > b.s2")
      .firstChild.nodeValue;
    if(is_pseudo_always_hidden(l_pseudo)) {
      l_snippet.classList.add("gmhfrblr21_always_hide_snippets");
    }
  }
  // masquage des aperçus des citations des utilisateurs toujours masqués
  let l_quote_snippets = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable > tbody > tr > td.messCase2 " +
    "div.container.gmhfrblr21_blocked_type > " +
    "table.gmhfrblr21_snippet_type:not(.gmhfrblr21_always_hide_snippets)");
  for(let l_snippet of l_quote_snippets) {
    let l_title =
      l_snippet.parentElement.querySelector(":scope > table > tbody > tr.none > td > b.s1 > a.Topic");
    if(l_title !== null && l_title.firstChild && l_title.firstChild.nodeValue !== null) {
      let l_pseudo =
        l_title.firstChild.nodeValue.replace(/ a écrit :$/, "");
      if(is_quoted_pseudo_always_hidden(l_pseudo)) {
        l_snippet.classList.add("gmhfrblr21_always_hide_snippets");
      }
    }
  }
  // masquage des aperçus des messages contenant une citation d'un utilisateur toujours masqué
  if(gmhfrblr21_parameters[profile].h) {
    let l_post_with_quote_snippets = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_blocked_type > " +
      "tbody > tr.gmhfrblr21_snippet_type:not(.gmhfrblr21_with_always_hide_snippets), " +
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_with_blocked_quote_type > " +
      "tbody > tr.gmhfrblr21_snippet_type:not(.gmhfrblr21_with_always_hide_snippets)");
    for(let l_snippet of l_post_with_quote_snippets) {
      if(l_snippet.parentElement.querySelector("div.container.gmhfrblr21_blocked_type > " +
          "table.gmhfrblr21_snippet_type.gmhfrblr21_always_hide_snippets") !== null) {
        l_snippet.classList.add("gmhfrblr21_with_always_hide_snippets");
      }
    }
  }
}

// fonction de réaffichage des aperçus pour les utilisateurs qui ne sont plus toujours masqués
function remove_always_hide_snippets() {
  rehide_contents();
  // réaffichage des aperçus des messages des utilisateurs qui ne sont plus toujours masqués
  let l_post_snippets = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_blocked_type > " +
    "tbody > tr.gmhfrblr21_snippet_type.gmhfrblr21_always_hide_snippets");
  for(let l_snippet of l_post_snippets) {
    let l_pseudo =
      l_snippet.parentElement.querySelector("tr > td.messCase1 > div:not([postalrecall]) > b.s2")
      .firstChild.nodeValue;
    if(!is_pseudo_always_hidden(l_pseudo)) {
      l_snippet.classList.remove("gmhfrblr21_always_hide_snippets");
    }
  }
  // réaffichage des aperçus des citations des utilisateurs qui ne sont plus toujours masqués
  let l_quote_snippets = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable > tbody > tr > td.messCase2 " +
    "div.container.gmhfrblr21_blocked_type > " +
    "table.gmhfrblr21_snippet_type.gmhfrblr21_always_hide_snippets");
  for(let l_snippet of l_quote_snippets) {
    let l_title =
      l_snippet.parentElement.querySelector(":scope > table > tbody > tr.none > td > b.s1 > a.Topic");
    if(l_title !== null && l_title.firstChild && l_title.firstChild.nodeValue !== null) {
      let l_pseudo =
        l_title.firstChild.nodeValue.replace(/ a écrit :$/, "");
      if(!is_quoted_pseudo_always_hidden(l_pseudo)) {
        l_snippet.classList.remove("gmhfrblr21_always_hide_snippets");
      }
    }
  }
  // réaffichage des aperçus des messages ne contenant plus de citation d'un utilisateur toujours masqué
  if(gmhfrblr21_parameters[profile].h) {
    let l_post_with_always_hide_quote_snippets = document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_blocked_type > " +
      "tbody > tr.gmhfrblr21_snippet_type.gmhfrblr21_with_always_hide_snippets, " +
      "div#mesdiscussions.mesdiscussions " +
      "table.messagetable.gmhfrblr21_with_blocked_quote_type > " +
      "tbody > tr.gmhfrblr21_snippet_type.gmhfrblr21_with_always_hide_snippets");
    for(let l_snippet of l_post_with_always_hide_quote_snippets) {
      if(l_snippet.parentElement.querySelector("div.container.gmhfrblr21_blocked_type > " +
          "table.gmhfrblr21_snippet_type.gmhfrblr21_always_hide_snippets") === null) {
        l_snippet.classList.remove("gmhfrblr21_with_always_hide_snippets");
      }
    }
  }
}

// fonction de masquage des aperçus pour les utilisateurs toujours masqués mais pas trop
function add_soft_always_hide_snippets() {
  rehide_contents();
  // masquage des aperçus des messages des utilisateurs toujours masqués mais pas trop
  let l_post_snippets = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_blocked_type > " +
    "tbody > tr.gmhfrblr21_snippet_type:not(.gmhfrblr21_soft_always_hide_snippets)");
  for(let l_snippet of l_post_snippets) {
    let l_pseudo =
      l_snippet.parentElement.querySelector("tr > td.messCase1 > div:not([postalrecall]) > b.s2")
      .firstChild.nodeValue;
    if(is_pseudo_soft_always_hidden(l_pseudo)) {
      l_snippet.classList.add("gmhfrblr21_soft_always_hide_snippets");
    }
  }
}

// fonction de réaffichage des aperçus pour les utilisateurs qui ne sont plus toujours masqués mais pas trop
function remove_soft_always_hide_snippets() {
  rehide_contents();
  // réaffichage des aperçus des messages des utilisateurs qui ne sont plus toujours masqués mais pas trop
  let l_post_snippets = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_blocked_type > " +
    "tbody > tr.gmhfrblr21_snippet_type.gmhfrblr21_soft_always_hide_snippets");
  for(let l_snippet of l_post_snippets) {
    let l_pseudo =
      l_snippet.parentElement.querySelector("tr > td.messCase1 > div:not([postalrecall]) > b.s2")
      .firstChild.nodeValue;
    if(!is_pseudo_soft_always_hidden(l_pseudo)) {
      l_snippet.classList.remove("gmhfrblr21_soft_always_hide_snippets");
    }
  }
}

// fonction de désactivation de la bloque liste
function disable_bloque_liste() {
  // désactivation des boutons
  let l_tab_img = document.querySelector("img.gmhfrblr21_tab_img");
  if(l_tab_img !== null) {
    l_tab_img.classList.add("gmhfrblr21_disabled_img");
    l_tab_img.parentElement.setAttribute("title", "[HFR] Bloque liste -> Gestion de la bloque liste\n" +
      "La bloque liste est désactivée (clic droit pour configurer)");
  }
  let l_buttons = document.querySelectorAll("img.gmhfrblr21_pseudo_img");
  for(let l_button of l_buttons) {
    l_button.classList.add("gmhfrblr21_disabled_img");
    l_button.setAttribute("title", "Bloquer ou débloquer cet utilisateur\nLa bloque liste est désactivée");
  }
  // affichage des contenus masqués
  let l_posts = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_blocked_type");
  for(let l_post of l_posts) {
    l_post.classList.remove("gmhfrblr21_blocked_type");
    l_post.classList.remove("gmhfrblr21_hidden");
  }
  let l_quotes = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable > tbody > tr > td.messCase2 " +
    "div.container.gmhfrblr21_blocked_type");
  for(let l_quote of l_quotes) {
    l_quote.classList.remove("gmhfrblr21_blocked_type");
    l_quote.classList.remove("gmhfrblr21_hidden");
  }
  let l_posts_with_blocked_quote = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions " +
    "table.messagetable.gmhfrblr21_with_blocked_quote_type");
  for(let l_post of l_posts_with_blocked_quote) {
    l_post.classList.remove("gmhfrblr21_with_blocked_quote_type");
    l_post.classList.remove("gmhfrblr21_hidden");
  }
  // suppression des aperçus
  let l_snippets = document.querySelectorAll(
    "tr.gmhfrblr21_snippet_type, table.gmhfrblr21_snippet_type");
  for(let l_snippet of l_snippets) {
    l_snippet.parentElement.removeChild(l_snippet);
  }
}

// fonction d'activation de la bloque liste
function enable_bloque_liste() {
  // activation des boutons
  let l_tab_img = document.querySelector("img.gmhfrblr21_tab_img");
  if(l_tab_img !== null) {
    l_tab_img.classList.remove("gmhfrblr21_disabled_img");
    l_tab_img.parentElement.setAttribute("title", "[HFR] Bloque liste -> Gestion de la bloque liste\n" +
      "(clic droit pour configurer)");
  }
  let l_buttons = document.querySelectorAll("img.gmhfrblr21_pseudo_img");
  for(let l_button of l_buttons) {
    l_button.classList.remove("gmhfrblr21_disabled_img");
    l_button.setAttribute("title", "Bloquer ou débloquer cet utilisateur");
  }
  // masquage des contenus
  hide_posts();
  hide_quotes();
}

/* ------------------------------------------------------------------------------------------------- */
/* récupération des paramètres, mise en place des éléments et masquage des messages et des citations */
/* ------------------------------------------------------------------------------------------------- */

Promise.all([
  GM.getValue("gmhfrblr21_img_bl", gmhfrblr21_img_bl_default),
  GM.getValue("gmhfrblr21_color_hidden", gmhfrblr21_color_hidden_default),
  GM.getValue("gmhfrblr21_color_hidden_color", gmhfrblr21_color_hidden_color_default),
  GM.getValue("gmhfrblr21_color_hidden_opacity", gmhfrblr21_color_hidden_opacity_default),
  GM.getValue("gmhfrblr21_color_posts_with_hidden", gmhfrblr21_color_posts_with_hidden_default),
  GM.getValue("gmhfrblr21_color_posts_with_hidden_color", gmhfrblr21_color_posts_with_hidden_color_default),
  GM.getValue("gmhfrblr21_color_posts_with_hidden_opacity", gmhfrblr21_color_posts_with_hidden_opacity_default),
  GM.getValue("gmhfrblr21_always_color_snippets", gmhfrblr21_always_color_snippets_default),
  GM.getValue("gmhfrblr21_parameters", gmhfrblr21_parameters_default),
  GM.getValue("gmhfrblr21_bloque_liste", gmhfrblr21_bloque_liste_default),
  GM.getValue("gmhfrblr21_always_hide_snippets_list", gmhfrblr21_always_hide_snippets_list_default),
  GM.getValue("gmhfrblr21_soft_always_hide_snippets_list", gmhfrblr21_soft_always_hide_snippets_list_default),
]).then(function([
  gmhfrblr21_img_bl_value,
  gmhfrblr21_color_hidden_value,
  gmhfrblr21_color_hidden_color_value,
  gmhfrblr21_color_hidden_opacity_value,
  gmhfrblr21_color_posts_with_hidden_value,
  gmhfrblr21_color_posts_with_hidden_color_value,
  gmhfrblr21_color_posts_with_hidden_opacity_value,
  gmhfrblr21_always_color_snippets_value,
  gmhfrblr21_parameters_value,
  gmhfrblr21_bloque_liste_value,
  gmhfrblr21_always_hide_snippets_list_value,
  gmhfrblr21_soft_always_hide_snippets_list_value,
]) {

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste promises gmhfrblr21_parameters_value : ",
      JSON.stringify(gmhfrblr21_parameters_value));
    console.log(
      "DEBUG [HFR] Bloque liste promises gmhfrblr21_bloque_liste_value : ",
      JSON.stringify(gmhfrblr21_bloque_liste_value));
    console.log(
      "DEBUG [HFR] Bloque liste promises gmhfrblr21_always_hide_snippets_list_value : ",
      JSON.stringify(gmhfrblr21_always_hide_snippets_list_value));
    console.log(
      "DEBUG [HFR] Bloque liste promises gmhfrblr21_always_hide_snippets_list_value : ",
      JSON.stringify(gmhfrblr21_soft_always_hide_snippets_list_value));
  }

  gmhfrblr21_img_bl = gmhfrblr21_img_bl_value;
  gmhfrblr21_color_hidden = gmhfrblr21_color_hidden_value;
  gmhfrblr21_color_hidden_color = gmhfrblr21_color_hidden_color_value;
  gmhfrblr21_color_hidden_opacity = gmhfrblr21_color_hidden_opacity_value;
  gmhfrblr21_color_posts_with_hidden = gmhfrblr21_color_posts_with_hidden_value;
  gmhfrblr21_color_posts_with_hidden_color = gmhfrblr21_color_posts_with_hidden_color_value;
  gmhfrblr21_color_posts_with_hidden_opacity = gmhfrblr21_color_posts_with_hidden_opacity_value;
  gmhfrblr21_always_color_snippets = gmhfrblr21_always_color_snippets_value;
  gmhfrblr21_parameters = JSON.parse(gmhfrblr21_parameters_value);
  gmhfrblr21_bloque_liste = JSON.parse(gmhfrblr21_bloque_liste_value);
  gmhfrblr21_always_hide_snippets_list = JSON.parse(gmhfrblr21_always_hide_snippets_list_value);
  gmhfrblr21_soft_always_hide_snippets_list = JSON.parse(gmhfrblr21_soft_always_hide_snippets_list_value);

  // récupération de la catégorie et du topic si ils existent
  let l_fastsearch =
    document.querySelector("a.cHeader.fastsearchHeader[href^=\"/search.php?config=hfr.inc&cat=\"]");
  if(l_fastsearch !== null) {
    category = /&cat=([0-9]*|prive)&subcat=/.exec(l_fastsearch.getAttribute("href"))[1];
    category = category === "" ? null : category;
    if(category !== null) {
      let l_transsearch =
        document.querySelector("form[action=\"/transsearch.php\"] > input[name=\"post\"]");
      if(l_transsearch !== null) {
        topic = category + "_" + l_transsearch.value;
      }
    }
  }

  // détermination des profils
  if(topic !== null) {
    profile_2 = "topic";
    if(typeof gmhfrblr21_parameters[topic] !== "undefined" &&
      gmhfrblr21_parameters[topic].a === true) {
      profile_active = "2";
      profile = topic;
      profile_type = "topic";
    } else {
      profile_active = "1";
    }
    if(typeof gmhfrblr21_parameters[category] !== "undefined" &&
      gmhfrblr21_parameters[category].a === true) {
      profile_1 = "category";
      if(profile_active === "1") {
        profile = category;
        profile_type = "category";
      }
    } else {
      profile_1 = "global";
      if(profile_active === "1") {
        profile = "global";
        profile_type = "global";
      }
    }
  } else {
    if(category !== null) {
      profile_2 = "category";
      profile_1 = "global";
      if(typeof gmhfrblr21_parameters[category] !== "undefined" &&
        gmhfrblr21_parameters[category].a === true) {
        profile_active = "2";
        profile = category;
        profile_type = "category";
      } else {
        profile_active = "1";
        profile = "global";
        profile_type = "global";
      }
    } else {
      profile_2 = null;
      profile_1 = "global";
      profile_active = "1";
      profile = "global";
      profile_type = "global";
    }
  }

  // DEBUG
  if(do_debug) {
    console.log(
      "DEBUG [HFR] Bloque liste category : ",
      category);
    console.log(
      "DEBUG [HFR] Bloque liste topic : ",
      topic);
    console.log(
      "DEBUG [HFR] Bloque liste profile_2: ",
      profile_2);
    console.log(
      "DEBUG [HFR] Bloque liste profile_1 : ",
      profile_1);
    console.log(
      "DEBUG [HFR] Bloque liste profile_active : ",
      profile_active);
    console.log(
      "DEBUG [HFR] Bloque liste profile : ",
      profile);
    console.log(
      "DEBUG [HFR] Bloque liste profile_type : ",
      profile_type);
  }

  // lessgooo!
  update_styles();
  add_buttons();
  gmhfrblr21_parameters[profile].d ? disable_bloque_liste() : enable_bloque_liste();
});