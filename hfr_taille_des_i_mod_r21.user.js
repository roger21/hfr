// ==UserScript==
// @name          [HFR] Taille des images mod_r21
// @version       3.0.9
// @namespace     roger21.free.fr
// @description   Permet de limiter la taille des images dans les posts et de leur rendre leur taille originale en cliquant sur un bouton intégré à l'image.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    toyonos
// @modifications Basé sur la version b - Désactivation de la fonctionnalité de redimensionnement du forum pour permettre au script de continuer à fonctionner, gestion de la compatibilité gm4 et ajout d'une fenêtre de configuration.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_taille_des_i_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_taille_des_i_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_taille_des_i_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.registerMenuCommand
// @grant         GM_registerMenuCommand
// @grant         unsafeWindow
// ==/UserScript==

/*

Copyright © 2012, 2014-2017, 2019-2021 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 2833 $

// historique :
// 3.0.9 (02/02/2021) :
// - ajout du support pour GM.registerMenuCommand() (pour gm4)
// 3.0.8 (17/03/2020) :
// - conversion des click -> select() en focus -> select() sur les champs de saisie
// 3.0.7 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 3.0.6 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 3.0.5 (22/12/2019) :
// - prise en compte des nouveaux titles de [HFR] Smart Auto Rehost mod_r21 6.0.3
// 3.0.4 (10/11/2019) :
// - réduction des temps des transitions de 0.7s à 0.3s
// 3.0.3 (03/11/2019) :
// - prise en compte des nouveaux titles de [HFR] Smart Auto Rehost mod_r21 6.0.0
// 3.0.2 (13/10/2019) :
// - ajout d'une option pour recharger la page sur la fenêtre de configuration
// - ajout d'un prevent default sur le mouseup des boutons (because why not, not sure tho)
// 3.0.1 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 3.0.0 (20/09/2019) :
// - gestion de la compatibilité gm4
// - ajout d'une fenêtre de configuration (clic droit sur les boutons de redimensionnement)
// - non propagation des clics pour éviter l'inversion des spoilers
// - optimisation et amélioration du code pour gérer les multiples chargements des images ->
// (en cas de rehost typiquement)
// - ajout de la directive "@inject-into page" pour explicitement autoriser le script à accéder ->
// à la page (unsafeWindow) sous violentmonkey et sécuridsation de l'objet GM
// - nouveau nom : [HFR] limitation de la taille des images mod_r21 -> [HFR] Taille des images mod_r21
// - ajout de l'avis de licence AGPL v3+ *si toyonos est d'accord*
// - maj de la metadata @homepageURL
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (toyonos)
// - réécriture des metadata @description, @modifications et @modtype
// - suppression des @grant inutiles
// 2.1.3 (21/04/2019) :
// - amélioration du code de redimensionnement des images pour prendre en compte une contrainte CSS exterieur...
// 2.1.2 (28/11/2017) :
// - passage au https
// 2.1.1 (06/08/2016) :
// - ajout du nom de la version de base dans la metadata @modifications
// 2.1.0 (22/11/2015) :
// - nouveau nom : [HFR] Limitation de la taille des images mod_r21 ->
// [HFR] limitation de la taille des images mod_r21
// 2.0.0 (21/11/2015) :
// - ajout de la prise en compte des titles déjà modifiés par [HFR] Smart Auto Rehost
// - nouveau numéro de version : 0.2.4b.10 -> 2.0.0
// - nouveau nom : [HFR] Limitation de la taille des images -> [HFR] Limitation de la taille des images mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.2.4b.10 (22/08/2015) :
// - ajout des images dans le code en base64
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - remplacement des ' par des " (pasque !)
// - amélioration des fonctions de saisie des tailles
// 0.2.4b.9 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.2.4b.8 (08/09/2014) :
// - repassage à reho.st (au lieu de free.fr) pour l'hebergement des images et icones utilisés par le script
// - suppression du module d'auto-update (code mort)
// 0.2.4b.7 (01/09/2014) :
// - ajout du support pour le nouveau SDK de unsafeWindow (ff 30+ / gm 2+)
// 0.2.4b.6 (14/05/2014) :
// - repassage à free.fr (au lieu de reho.st) pour l'hebergement des images et icones utilisés par le script
// 0.2.4b.5 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.2.4b.4 (18/03/2014) :
// - utilisation de reho.st pour les images du script (au lieu de roger21.free.fr)
// - ajout de la metadata @grant unsafeWindow
// - maj des metadata @grant et indentation des metadata
// 0.2.4b.3 (14/09/2012) :
// - ajout des metadata @grant
// 0.2.4b.1 à 0.2.4b.2 (13/05/2012) :
// - changement de l'image d'"expand"
// - ajout d'un image de "reduce"
// - "compatibilité" avec md_verif_size
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

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
var gmMenu = GM.registerMenuCommand || GM_registerMenuCommand;

/* ---------------------------------------------------------------- */
/* désactivation de la fonctionnalité de redimensionnement du forum */
/* ---------------------------------------------------------------- */

unsafeWindow.md_verif_size = function() {};

/* ---------- */
/* les images */
/* ---------- */

var img_expand_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAbCAAAAADgoHZMAAAAAnRSTlMAAHaTzTgAAAGFSURBVHja7dTJS8NAFAbw%2FtdfqtQtdQFTlVK3uoFSaZUoKooFFxRKXU96KCKo1CJa0t2Ytsbnm7Gth6Z40FPxO0yS92Z%2BTAYSl6vtgl%2BljtAv8o%2F8gLyqMltnapjoVp2xRaFf237nnq5u8vim%2BiyibbVY5I53dP%2B9GSnBG%2BGc234kqpryIAvLXuwRmZ3w8HITYEtHocCd0CBWnZDg1%2F5S7qEoNmqFNAJEMUzgRCJK6gvhTkVTDAfEd87JE%2B0Cg1YNucEU0VhXxu0XyAgCH3WEorhwQGRuiPIKDmTBMzYMXFKSN76AR0YiOuINJIZjB2Q8zakQRYC%2Bkij0zs6vJIjWED5ahC4Qs69nsY4cildsdSYJaLsIfRfK3XKLHosRuuS7GjKHpAOixTlX1gDuqj5cN5AL7JimuYFTgVBQIlo8FsY0tTqTgI51ontFfa0jk3jm8Ql%2Bibx0CITjXio1I7Yhk88aVX7KGWXbKMhZmay8ZDO2IZYVDFtMzVX%2Bv%2BKfkb%2F4x7ZRPgEZvEEtbQUTgQAAAABJRU5ErkJggg%3D%3D";
var img_reduce_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAbCAAAAAAPYh1yAAAAAnRSTlMAAHaTzTgAAAFsSURBVHja7ZTRS8JQFIf9r4%2BSD9IshWYZJmTlg5TaqIcwCgzMCMxIg6AiyAWRRVFN1E20NT2dXeeVnNiDPYm%2Fh8sH%2B92P3XPZHI5JDIyXngXHydTCordHWRoCxReRuyAI%2B6jS6l3KGARbVEgIKuKZH1zRz35n0KKBV5JiTneDgSQVsE4Q98EOwRoVNqCOWQgcxmCuxTt2i1lNQqkLFLZZF50KtzTdvi%2FE3eUn3rFbVjXtRYR3DQIFSs16hTQUueUOUt2dvGO3mJk5tgDuLUsOTrnlAjI9i9WxWxaLYTgxIfxB0S1LFs5VBuugXsEBQdPod4bNpeWHS%2Fw9F4xC%2BRsCBEHQKxDsIO555BFzoQcP4FE1EPOUa7KI%2Bdw2RBBDkLpNQ8gcfuLmyDnb5J3hd5SCpHXmFbJQXJsa4tsC0XyZbixuwiPyzqClrdRpNZRKW2GpoQlVdnTsvJaeDUZVuWwg8s70m%2F7b8i%2F%2F3cnKD1rzVBgEeLGGAAAAAElFTkSuQmCC";
var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var img_reset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";

/* ------------------------------------------------ */
/* les options par défaut et les variables globales */
/* ------------------------------------------------ */

var width_type_default = 1; // 0 = fixed, 1 = auto
var width_default = 900;
var height_type_default = 2; // 0 = fixed, 1 = auto, 2 = off
var height_default = 500;
var opacity_default = "0.4";
var width, height, img_expand, img_reduce, opacity;
var opacity_value_format = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2
});

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // styles pour l'affichage des images et des boutons
  "span.gm_hfr_tdi_r21_img_span{display:inline-block;position:relative;}" +
  "#mesdiscussions img.gm_hfr_tdi_r21_resize_button{position:absolute;top:0;left:0;z-index:100;cursor:pointer;" +
  "margin:5px;}#mesdiscussions img.gm_hfr_tdi_r21_resize_button:hover{opacity:1 !important;}" +
  // styles pour la fenêtre de configuration
  "#gm_hfr_tdi_r21_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:1003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;" +
  "text-align:justify;}" +
  "#gm_hfr_tdi_r21_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_hfr_tdi_r21_config_window{position:fixed;min-width:400px;height:auto;background:#ffffff;z-index:1002;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;}" +
  "#gm_hfr_tdi_r21_config_window div.gm_hfr_tdi_r21_main_title{font-size:16px;text-align:center;" +
  "font-weight:bold;margin:0 0 10px;}" +
  "#gm_hfr_tdi_r21_config_window fieldset{margin:0 0 8px;border:1px solid #888888;padding:6px 10px 10px;}" +
  "#gm_hfr_tdi_r21_config_window legend{font-size:14px;}" +
  "#gm_hfr_tdi_r21_config_window div.gm_hfr_tdi_r21_table{display:table;width:100%;}" +
  "#gm_hfr_tdi_r21_config_window div.gm_hfr_tdi_r21_cell{display:table-cell;width:50%;}" +
  "#gm_hfr_tdi_r21_config_window p{margin:0 0 0 4px;}" +
  "#gm_hfr_tdi_r21_config_window p:not(:last-child){margin-bottom:4px;}" +
  "#gm_hfr_tdi_r21_config_window p.gm_hfr_tdi_r21_no_margin{margin-bottom:2px;}" +
  "#gm_hfr_tdi_r21_config_window div.gm_hfr_tdi_r21_div_img{display:flex;justify-content:center;" +
  "align-items:center;margin:0 0 4px 0;}" +
  "#gm_hfr_tdi_r21_config_window div.gm_hfr_tdi_r21_div_img > *{display:block;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"radio\"]{margin:0 0 2px;vertical-align:text-bottom;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"text\"]{padding:0 1px;border:1px solid #c0c0c0;height:14px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;text-align:right;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"range\"]{padding:0;border:0;margin:-1px 0 0 0;" +
  "vertical-align:text-bottom;font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;width:265px;" +
  "-webkit-appearance:none;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"range\"]:focus{outline:none;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"range\"]:focus::-webkit-slider-runnable-track{" +
  "background:#888888;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"range\"]::-moz-range-thumb{background-color:#ffffff;" +
  "width:3px;height:11px;border:1px solid #666666;border-radius:2px;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"range\"]::-webkit-slider-thumb{-webkit-appearance:none;" +
  "background-color:#ffffff;width:5px;height:13px;border:1px solid #666666;border-radius:2px;margin-top:-6px;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"range\"]::-moz-range-track{background:#888888;height:1px;" +
  "border:0;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"range\"]::-webkit-slider-runnable-track{background:#888888;" +
  "height:1px;border:0;margin-top:-16px;}" +
  "#gm_hfr_tdi_r21_config_window input[type=\"checkbox\"]{margin:0 0 1px;vertical-align:text-bottom;}" +
  "#gm_hfr_tdi_r21_config_window img.gm_hfr_tdi_r21_test_img{margin:0 4px 0 0;}" +
  "#gm_hfr_tdi_r21_config_window img.gm_hfr_tdi_r21_test_img:hover{opacity:1 !important;}" +
  "#gm_hfr_tdi_r21_config_window img.gm_hfr_tdi_r21_reset_img{cursor:pointer;margin:0 0 0 4px;}" +
  "#gm_hfr_tdi_r21_config_window div.gm_hfr_tdi_r21_save_close_div{text-align:right;margin:16px 0 0;}" +
  "#gm_hfr_tdi_r21_config_window div.gm_hfr_tdi_r21_save_close_div div.gm_hfr_tdi_r21_info_reload_div" +
  "{float:left;}" +
  "#gm_hfr_tdi_r21_config_window div.gm_hfr_tdi_r21_save_close_div div.gm_hfr_tdi_r21_info_reload_div img" +
  "{vertical-align:text-bottom;}" +
  "#gm_hfr_tdi_r21_config_window div.gm_hfr_tdi_r21_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  "#gm_hfr_tdi_r21_config_window img.gm_hfr_tdi_r21_help_button{margin-right:1px;cursor:help;}";
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// création de la fenêtre d'aide
var help_window = document.createElement("div");
help_window.setAttribute("id", "gm_hfr_tdi_r21_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(width, text) {
  let help_button = document.createElement("img");
  help_button.setAttribute("src", img_help);
  help_button.setAttribute("class", "gm_hfr_tdi_r21_help_button");
  help_button.addEventListener("mouseover", function(e) {
    help_window.style.width = width + "px";
    help_window.textContent = text;
    help_window.style.left = (e.clientX + 32) + "px";
    help_window.style.top = (e.clientY - 16) + "px";
    help_window.style.visibility = "visible";
  }, false);
  help_button.addEventListener("mouseout", function(e) {
    help_window.style.visibility = "hidden";
  }, false);
  return help_button;
}

// création du voile de fond pour la fenêtre de configuration
var config_background = document.createElement("div");
config_background.setAttribute("id", "gm_hfr_tdi_r21_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
config_background.addEventListener("contextmenu", function(e) {
  e.preventDefault();
}, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gm_hfr_tdi_r21_config_window");
config_window.addEventListener("contextmenu", function(e) {
  e.preventDefault();
}, false);
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.className = "gm_hfr_tdi_r21_main_title";
main_title.textContent = "Conf du script [HFR] Taille des images";
config_window.appendChild(main_title);

// section tailles
var size_fieldset = document.createElement("fieldset");
var size_legend = document.createElement("legend");
size_legend.textContent = "Tailles maximales des images";
size_fieldset.appendChild(size_legend);
config_window.appendChild(size_fieldset);

// table des tailles
var size_div = document.createElement("div");
size_div.className = "gm_hfr_tdi_r21_table";
size_fieldset.appendChild(size_div);

// block largeur
var width_div = document.createElement("div");
width_div.className = "gm_hfr_tdi_r21_cell";
var width_fixed_p = document.createElement("p");
var width_fixed_radio = document.createElement("input");
width_fixed_radio.setAttribute("type", "radio");
width_fixed_radio.setAttribute("id", "gm_hfr_tdi_r21_width_fixed_radio");
width_fixed_radio.setAttribute("name", "gm_hfr_tdi_r21_width_radios");
width_fixed_p.appendChild(width_fixed_radio);
var width_fixed_label_radio = document.createElement("label");
width_fixed_label_radio.textContent = " largeur fixe ";
width_fixed_label_radio.setAttribute("for", "gm_hfr_tdi_r21_width_fixed_radio");
width_fixed_p.appendChild(width_fixed_label_radio);
var width_fixed_input = document.createElement("input");
width_fixed_input.setAttribute("type", "text");
width_fixed_input.setAttribute("id", "gm_hfr_tdi_r21_width_fixed_input");
width_fixed_input.setAttribute("size", "3");
width_fixed_input.setAttribute("maxLength", "4");
width_fixed_input.setAttribute("pattern", "[1-9]([0-9])*");
width_fixed_input.addEventListener("focus", function() {
  width_fixed_input.select();
}, false);
width_fixed_p.appendChild(width_fixed_input);
var width_fixed_label_input = document.createElement("label");
width_fixed_label_input.textContent = " px";
width_fixed_label_input.setAttribute("for", "gm_hfr_tdi_r21_width_fixed_input");
width_fixed_p.appendChild(width_fixed_label_input);
width_div.appendChild(width_fixed_p);
var width_window_p = document.createElement("p");
var width_window_radio = document.createElement("input");
width_window_radio.setAttribute("type", "radio");
width_window_radio.setAttribute("id", "gm_hfr_tdi_r21_width_window_radio");
width_window_radio.setAttribute("name", "gm_hfr_tdi_r21_width_radios");
width_window_p.appendChild(width_window_radio);
var width_window_label = document.createElement("label");
width_window_label.textContent = " largeur de la fenêtre";
width_window_label.setAttribute("for", "gm_hfr_tdi_r21_width_window_radio");
width_window_p.appendChild(width_window_label);
width_div.appendChild(width_window_p);
size_div.appendChild(width_div);

// block hauteur
var height_div = document.createElement("div");
height_div.className = "gm_hfr_tdi_r21_cell";
var height_fixed_p = document.createElement("p");
var height_fixed_radio = document.createElement("input");
height_fixed_radio.setAttribute("type", "radio");
height_fixed_radio.setAttribute("id", "gm_hfr_tdi_r21_height_fixed_radio");
height_fixed_radio.setAttribute("name", "gm_hfr_tdi_r21_height_radios");
height_fixed_p.appendChild(height_fixed_radio);
var height_fixed_label_radio = document.createElement("label");
height_fixed_label_radio.textContent = " hauteur fixe ";
height_fixed_label_radio.setAttribute("for", "gm_hfr_tdi_r21_height_fixed_radio");
height_fixed_p.appendChild(height_fixed_label_radio);
var height_fixed_input = document.createElement("input");
height_fixed_input.setAttribute("type", "text");
height_fixed_input.setAttribute("id", "gm_hfr_tdi_r21_height_fixed_input");
height_fixed_input.setAttribute("size", "3");
height_fixed_input.setAttribute("maxLength", "4");
height_fixed_input.setAttribute("pattern", "[1-9]([0-9])*");
height_fixed_input.addEventListener("focus", function() {
  height_fixed_input.select();
}, false);
height_fixed_p.appendChild(height_fixed_input);
var height_fixed_label_input = document.createElement("label");
height_fixed_label_input.textContent = " px";
height_fixed_label_input.setAttribute("for", "gm_hfr_tdi_r21_height_fixed_input");
height_fixed_p.appendChild(height_fixed_label_input);
height_div.appendChild(height_fixed_p);
var height_window_p = document.createElement("p");
var height_window_radio = document.createElement("input");
height_window_radio.setAttribute("type", "radio");
height_window_radio.setAttribute("id", "gm_hfr_tdi_r21_height_window_radio");
height_window_radio.setAttribute("name", "gm_hfr_tdi_r21_height_radios");
height_window_p.appendChild(height_window_radio);
var height_window_label = document.createElement("label");
height_window_label.textContent = " hauteur de la fenêtre";
height_window_label.setAttribute("for", "gm_hfr_tdi_r21_height_window_radio");
height_window_p.appendChild(height_window_label);
height_div.appendChild(height_window_p);
var height_nope_p = document.createElement("p");
var height_nope_radio = document.createElement("input");
height_nope_radio.setAttribute("type", "radio");
height_nope_radio.setAttribute("id", "gm_hfr_tdi_r21_height_nope_radio");
height_nope_radio.setAttribute("name", "gm_hfr_tdi_r21_height_radios");
height_nope_p.appendChild(height_nope_radio);
var height_nope_label = document.createElement("label");
height_nope_label.textContent = " hauteur non contrainte";
height_nope_label.setAttribute("for", "gm_hfr_tdi_r21_height_nope_radio");
height_nope_p.appendChild(height_nope_label);
height_div.appendChild(height_nope_p);
size_div.appendChild(height_div);

// section boutons
var buttons_fieldset = document.createElement("fieldset");
var buttons_legend = document.createElement("legend");
buttons_legend.textContent = "Images des boutons de redimensionnement";
buttons_fieldset.appendChild(buttons_legend);
config_window.appendChild(buttons_fieldset);

// agrandissement
var img_expand_p = document.createElement("p");
img_expand_p.className = "gm_hfr_tdi_r21_no_margin";
var img_expand_label = document.createElement("label");
img_expand_label.textContent = "bouton d'agrandissement : ";
img_expand_label.setAttribute("for", "gm_hfr_tdi_r21_img_expand_input");
img_expand_p.appendChild(img_expand_label);
buttons_fieldset.appendChild(img_expand_p);
var img_expand_div = document.createElement("div");
img_expand_div.className = "gm_hfr_tdi_r21_div_img";
var img_expand_test_img = document.createElement("img");
img_expand_test_img.className = "gm_hfr_tdi_r21_test_img";
img_expand_div.appendChild(img_expand_test_img);
var img_expand_input = document.createElement("input");
img_expand_input.setAttribute("id", "gm_hfr_tdi_r21_img_expand_input");
img_expand_input.setAttribute("type", "text");
img_expand_input.setAttribute("spellcheck", "false");
img_expand_input.setAttribute("size", "30");
img_expand_input.setAttribute("title", "url de l'image (http ou data)");
img_expand_input.addEventListener("focus", function() {
  img_expand_input.select();
}, false);

function img_expand_do_test_img() {
  img_expand_test_img.setAttribute("src", img_expand_input.value.trim());
  img_expand_input.setSelectionRange(0, 0);
  img_expand_input.blur();
}
img_expand_input.addEventListener("input", img_expand_do_test_img, false);
img_expand_div.appendChild(img_expand_input);
var img_expand_reset_img = document.createElement("img");
img_expand_reset_img.setAttribute("src", img_reset);
img_expand_reset_img.className = "gm_hfr_tdi_r21_reset_img";
img_expand_reset_img.setAttribute("title", "remettre l'image par défaut");

function img_expand_do_reset_img() {
  img_expand_input.value = img_expand_default;
  img_expand_do_test_img();
}
img_expand_reset_img.addEventListener("click", img_expand_do_reset_img, false);
img_expand_div.appendChild(img_expand_reset_img);
buttons_fieldset.appendChild(img_expand_div);

// réduction
var img_reduce_p = document.createElement("p");
img_reduce_p.className = "gm_hfr_tdi_r21_no_margin";
var img_reduce_label = document.createElement("label");
img_reduce_label.textContent = "bouton de réduction : ";
img_reduce_label.setAttribute("for", "gm_hfr_tdi_r21_img_reduce_input");
img_reduce_p.appendChild(img_reduce_label);
buttons_fieldset.appendChild(img_reduce_p);
var img_reduce_div = document.createElement("div");
img_reduce_div.className = "gm_hfr_tdi_r21_div_img";
var img_reduce_test_img = document.createElement("img");
img_reduce_test_img.className = "gm_hfr_tdi_r21_test_img";
img_reduce_div.appendChild(img_reduce_test_img);
var img_reduce_input = document.createElement("input");
img_reduce_input.setAttribute("id", "gm_hfr_tdi_r21_img_reduce_input");
img_reduce_input.setAttribute("type", "text");
img_reduce_input.setAttribute("spellcheck", "false");
img_reduce_input.setAttribute("size", "30");
img_reduce_input.setAttribute("title", "url de l'image (http ou data)");
img_reduce_input.addEventListener("focus", function() {
  img_reduce_input.select();
}, false);

function img_reduce_do_test_img() {
  img_reduce_test_img.setAttribute("src", img_reduce_input.value.trim());
  img_reduce_input.setSelectionRange(0, 0);
  img_reduce_input.blur();
}
img_reduce_input.addEventListener("input", img_reduce_do_test_img, false);
img_reduce_div.appendChild(img_reduce_input);
var img_reduce_reset_img = document.createElement("img");
img_reduce_reset_img.setAttribute("src", img_reset);
img_reduce_reset_img.className = "gm_hfr_tdi_r21_reset_img";
img_reduce_reset_img.setAttribute("title", "remettre l'image par défaut");

function img_reduce_do_reset_img() {
  img_reduce_input.value = img_reduce_default;
  img_reduce_do_test_img();
}
img_reduce_reset_img.addEventListener("click", img_reduce_do_reset_img, false);
img_reduce_div.appendChild(img_reduce_reset_img);
buttons_fieldset.appendChild(img_reduce_div);

// opacité
var opacity_p = document.createElement("p");
var opacity_label = document.createElement("label");
opacity_label.textContent = "opacité : ";
opacity_label.setAttribute("for", "gm_hfr_tdi_r21_opacity_range");
opacity_p.appendChild(opacity_label);
var opacity_range = document.createElement("input");
opacity_range.setAttribute("type", "range");
opacity_range.setAttribute("id", "gm_hfr_tdi_r21_opacity_range");
opacity_range.setAttribute("min", "0");
opacity_range.setAttribute("max", "1");
opacity_range.setAttribute("step", "0.01");
opacity_p.appendChild(opacity_range);
var opacity_label_value = document.createElement("label");
opacity_label_value.setAttribute("for", "gm_hfr_tdi_r21_opacity_range");
opacity_p.appendChild(opacity_label_value);
var opacity_reset_img = document.createElement("img");
opacity_reset_img.setAttribute("src", img_reset);
opacity_reset_img.className = "gm_hfr_tdi_r21_reset_img";
opacity_reset_img.setAttribute("title", "remettre la valeur par défaut");

function opacity_do_reset() {
  opacity_range.value = opacity_default;
  opacity_do_value();
}
opacity_reset_img.addEventListener("click", opacity_do_reset, false);
opacity_p.appendChild(opacity_reset_img);

function opacity_do_value() {
  opacity_label_value.textContent = " " + opacity_value_format.format(opacity_range.value);
  img_expand_test_img.style.opacity = opacity_range.value;
  img_reduce_test_img.style.opacity = opacity_range.value;
}
opacity_range.addEventListener("input", opacity_do_value, false);
buttons_fieldset.appendChild(opacity_p);

// rechargement de la page et boutons de validation et de fermeture
var save_close_div = document.createElement("div");
save_close_div.className = "gm_hfr_tdi_r21_save_close_div";
var info_reload_div = document.createElement("div");
info_reload_div.className = "gm_hfr_tdi_r21_info_reload_div";
var info_reload_checkbox = document.createElement("input");
info_reload_checkbox.setAttribute("type", "checkbox");
info_reload_checkbox.setAttribute("id", "gm_hfr_tdi_r21_info_reload_checkbox");
info_reload_div.appendChild(info_reload_checkbox);
var info_reload_label = document.createElement("label");
info_reload_label.textContent = " recharger la page ";
info_reload_label.setAttribute("for", "gm_hfr_tdi_r21_info_reload_checkbox");
info_reload_div.appendChild(info_reload_label);
info_reload_div.appendChild(create_help_button(255,
  "La modification des paramètres de cette fenêtre de configuration n'est visible que sur les nouvelles " +
  "pages ou après le rechargement de la page courante. Cette option permet de recharger automatiquement la " +
  "page courante lors de la validation."));
save_close_div.appendChild(info_reload_div);
var save_button = document.createElement("img");
save_button.setAttribute("src", img_save);
save_button.setAttribute("title", "Valider");
save_button.addEventListener("click", save_config_window, false);
save_close_div.appendChild(save_button);
var close_button = document.createElement("img");
close_button.setAttribute("src", img_close);
close_button.setAttribute("title", "Annuler");
close_button.addEventListener("click", hide_config_window, false);
save_close_div.appendChild(close_button);
config_window.appendChild(save_close_div);

// fonction de validation de la fenêtre de configuration
function save_config_window() {
  // fermeture de la fenêtre
  hide_config_window();
  // analyse des paramètres
  let width_type = 0;
  if(width_window_radio.checked) {
    width_type = 1;
  }
  let width = parseInt(width_fixed_input.value, 10);
  width = width > 0 ? width : width_default;
  let height_type = 0;
  if(height_window_radio.checked) {
    height_type = 1;
  }
  if(height_nope_radio.checked) {
    height_type = 2;
  }
  let height = parseInt(height_fixed_input.value, 10);
  height = height > 0 ? height : height_default;
  img_expand = img_expand_input.value.trim();
  if(img_expand === "") {
    img_expand = img_expand_default;
  }
  img_reduce = img_reduce_input.value.trim();
  if(img_reduce === "") {
    img_reduce = img_reduce_default;
  }
  let opacity = opacity_range.value;
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("width_type", width_type),
    GM.setValue("width", width),
    GM.setValue("height_type", height_type),
    GM.setValue("height", height),
    GM.setValue("img_expand", img_expand),
    GM.setValue("img_reduce", img_reduce),
    GM.setValue("opacity", opacity),
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
function esc_config_window(e) {
  if(e.key === "Escape") {
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
  // récupération des paramètres
  Promise.all([
    GM.getValue("width_type", width_type_default),
    GM.getValue("width", width_default),
    GM.getValue("height_type", height_type_default),
    GM.getValue("height", height_default),
    GM.getValue("img_expand", img_expand_default),
    GM.getValue("img_reduce", img_reduce_default),
    GM.getValue("opacity", opacity_default),
  ]).then(function([
    width_type_value,
    width_value,
    height_type_value,
    height_value,
    img_expand_value,
    img_reduce_value,
    opacity_value,
  ]) {
    // initialisation des paramètres
    width_fixed_radio.checked = width_type_value === 0;
    width_window_radio.checked = width_type_value === 1;
    width_fixed_input.value = width_value;
    height_fixed_radio.checked = height_type_value === 0;
    height_window_radio.checked = height_type_value === 1;
    height_nope_radio.checked = height_type_value === 2;
    height_fixed_input.value = height_value;
    img_expand_input.value = img_expand_value;
    img_expand_do_test_img();
    img_reduce_input.value = img_reduce_value;
    img_reduce_do_test_img();
    opacity_range.value = opacity_value;
    opacity_do_value();
    info_reload_checkbox.checked = false;
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
  });
}

// ajout d'une entrée de configuration dans le menu de l'extension
gmMenu("[HFR] Taille des images -> Configuration", show_config_window);

/* ----------------------------------------- */
/* fonctions de redimensionnement des images */
/* ----------------------------------------- */

function add_button(img) {
  let img_span = document.createElement("span");
  img_span.className = "gm_hfr_tdi_r21_img_span";
  let resize_button = document.createElement("img");
  resize_button.className = "gm_hfr_tdi_r21_resize_button";
  resize_button.style.opacity = opacity;
  resize_button.setAttribute("src", img_expand);
  resize_button.setAttribute("alt", "Agrandir");
  resize_button.setAttribute("title", "Agrandir l'image\n(clic droit pour configurer)");
  resize_button.dataset.state = "expand";
  resize_button.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    img.style.maxWidth = (img.style.maxWidth === "none") ? (width + "px") : "none";
    if(height !== null) {
      img.style.maxHeight = (img.style.maxHeight === "none") ? (height + "px") : "none";
    }
    if(this.dataset.state === "expand") {
      this.setAttribute("src", img_reduce);
      this.setAttribute("alt", "Rétrécir");
      this.setAttribute("title", "Rétrécir l'image\n(clic droit pour configurer)");
      this.dataset.state = "reduce";
    } else {
      this.setAttribute("src", img_expand);
      this.setAttribute("alt", "Agrandir");
      this.setAttribute("title", "Agrandir l'image\n(clic droit pour configurer)");
      this.dataset.state = "expand";
    }
  }, false);
  resize_button.addEventListener("mouseup", function(e) {
    e.preventDefault();
    if(e.button === 2) {
      show_config_window();
    }
  }, false);
  resize_button.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  }, false);
  img_span.appendChild(resize_button);
  img = img.parentNode.replaceChild(img_span, img);
  img_span.appendChild(img);
}

function resize_image(img) {
  // récupération de l'image en cas d'appel sur un load event
  if(img instanceof Event) {
    img = this;
  }
  // nettoyage de l'image de tout le bordel et des contraintes de taille ajoutées par le forum
  img.removeAttribute("width");
  img.removeAttribute("onload");
  img.removeAttribute("onclick");
  img.removeAttribute("onmouseover");
  img.removeAttribute("onmouseout");
  img.style.width = "auto";
  // nouvelles contraintes des tailles de l'image en fonction des paramètres du script
  img.style.maxWidth = width + "px";
  if(height !== null) {
    img.style.maxHeight = height + "px";
  }
  // nettaoyage du title de l'image, le forum y met un truc du genre "cliquer pour agrandir"
  if(!img.title.startsWith("Rehost: ") &&
    !img.title.startsWith("UnRehost: ") &&
    !img.title.startsWith("Stealth rehost: ")) {
    img.alt = img.title = img.src;
  }
  // ajout du bouton si l'image en a besoin et qu'il n'a pas déjà été ajouté
  if(img.naturalWidth > width || (height !== null && img.naturalHeight > height)) {
    if(!img.parentElement || img.parentElement.className !== "gm_hfr_tdi_r21_img_span") {
      add_button(img);
    }
  }
}

/* ----------------------------------------------------------- */
/* récupération des paramètres et redimensionnement des images */
/* ----------------------------------------------------------- */

Promise.all([
  GM.getValue("width_type", width_type_default),
  GM.getValue("width", width_default),
  GM.getValue("height_type", height_type_default),
  GM.getValue("height", height_default),
  GM.getValue("img_expand", img_expand_default),
  GM.getValue("img_reduce", img_reduce_default),
  GM.getValue("opacity", opacity_default),
]).then(function([
  width_type_value,
  width_value,
  height_type_value,
  height_value,
  img_expand_value,
  img_reduce_value,
  opacity_value,
]) {
  width = width_value;
  if(width_type_value === 1) {
    width = window.innerWidth - 315;
  }
  height = height_value;
  if(height_type_value === 1) {
    height = window.innerHeight - 20;
  }
  if(height_type_value === 2) {
    height = null;
  }
  img_expand = img_expand_value;
  img_reduce = img_reduce_value;
  opacity = opacity_value;
  let images = document.querySelectorAll("td.messCase2 > div[id^='para'] img" +
    ":not([src^=\"http://forum-images.hardware.fr\"])" +
    ":not([src^=\"https://forum-images.hardware.fr\"])" +
    ":not([src^=\"data:image\"])");
  for(let img of images) {
    if(img.complete) {
      resize_image(img);
    }
    img.addEventListener("load", resize_image, false);
  }
});
