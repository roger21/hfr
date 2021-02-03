// ==UserScript==
// @name          [HFR] Styles et mise en page
// @version       1.0.6
// @namespace     roger21.free.fr
// @description   Permet de supprimer les pieds de page, agrandir la taille de la réponse rapide et la hauteur de la réponse normale, reconvertir certains liens en images dans les quotes et homogénéiser l'affichage des images et des smileys (le tout étant configurable).
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_styles_et_mise_en_pa.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_styles_et_mise_en_pa.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_styles_et_mise_en_pa.user.js
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

Copyright © 2019-2021 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 2832 $

// historique :
// 1.0.6 (02/02/2021) :
// - ajout du support pour GM.registerMenuCommand() (pour gm4)
// 1.0.5 (17/09/2020) :
// - meilleur gestion de la conversion des liens en images avec images.weserv.nl
// 1.0.4 (30/08/2020) :
// - ajout d'un paramètre pour la hauteur de la réponse normale (désactivé par défaut)
// 1.0.3 (17/03/2020) :
// - conversion des click -> select() en focus -> select() sur les champs de saisie
// 1.0.2 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 1.0.1 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 1.0.0 (30/11/2019) :
// - création

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

/* ---------- */
/* les images */
/* ---------- */

var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var img_reset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";
var img_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACSElEQVQoz02SPUiVcRTGf%2B%2FrFe1aiFNZmDW0BJcgbak217JBXdr6IOhrkHAKpIKoJYrIraUhachcKyooIjDsy2rIjLS6iohc0%2Fd%2Fzvve%2F%2Fn7NtyMHnim8zwcnnOeiP8wm%2BSNSxmlpEqHBLaoBzHKqfE2y5k4ujNK17QRwJLPo4rQrsZxZ%2FSo0SpGUTyoR5wxp54RMW6rMXNpb5QXACpCuxgXxehVTzEDficpob4RF2gWo1kD%2FRLY6jyDwHQ06%2FLGinJejH41mpzPeTQ6jGiV8vQ3uk5cIKOAGIhH1Li%2B4rkcV1JKGuiVQJMEWHYZz0aH6eg%2BwvpN7Ux%2BHEc8NRpFZ%2FRknlIsRocYrenfoQZYnC8z8eop87%2BmiYst%2FPj6icWFedRAPZt1lc7YVdminiZnNZPm9SSVBSbfj7Hv2EWm3r5g7N4NaN74b6sYbbEGcAZpgO9TU9w8c4gD527w%2FM5VkjQgzrHn9BCSUctZy0osnlkxXGVZuXWmm4MDQ%2Bzo6mNrRxfDp%2FazfvtusqgBzUFC7T1i%2FIw18EaqzC1LSpYKn189xtdDqW%2BAhclxvjy5iwLldy9JXIYLzKnnTewDExoYiTe0SNfZa4zdH%2BJe%2F2FmJz%2FQ8yBhZX6Gpyd34ZJlqoUGTT0jixkTEcCV1%2Fk2MS6l0JNIKLrqKtW6epIM1EOSGmlcEMl4IMZg%2BXj0vQAgq8yIMajGD1mt603zulZJa5WTgCiFOc24L8btSsrMv66u4fDDfJ0FSmp0itH294o%2FxTO%2BpHxcOBnpmvYPIwWDEcmSnloAAAAASUVORK5CYII%3D";

/* ---------------------- */
/* les options par défaut */
/* ---------------------- */

var smp_afficher_icone_defaut = true;
var smp_image_icone_defaut = img_icon;
var smp_taille_reponse_defaut = false;
var smp_largeur_reponse_defaut = 50;
var smp_largeur_unite_defaut = "vw";
var smp_hauteur_reponse_defaut = 25;
var smp_hauteur_unite_defaut = "vh";
var smp_taille_normale_defaut = false;
var smp_hauteur_normale_defaut = 50;
var smp_unite_normale_defaut = "vh";
var smp_images_smileys_defaut = false;
var smp_supprimer_sujets_defaut = false;
var smp_supprimer_version_defaut = false;
var smp_supprimer_copyright_defaut = false;
var smp_toyonos_quotes_defaut = false;
var smp_emojis_quotes_defaut = false;

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var smp_afficher_icone;
var smp_image_icone;
var smp_taille_reponse;
var smp_largeur_reponse;
var smp_largeur_unite;
var smp_hauteur_reponse;
var smp_hauteur_unite;
var smp_taille_normale;
var smp_hauteur_normale;
var smp_unite_normale;
var smp_images_smileys;
var smp_supprimer_sujets;
var smp_supprimer_version;
var smp_supprimer_copyright;
var smp_toyonos_quotes;
var smp_emojis_quotes;

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // styles pour la fenêtre d'aide
  "#gm_hfr_semep_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:1003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;text-align:justify;}" +
  "#gm_hfr_semep_config_window img.gm_hfr_semep_help_button{cursor:help;vertical-align:text-bottom;}" +
  // styles pour la fenêtre de configuration
  "#gm_hfr_semep_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_hfr_semep_config_window{position:fixed;min-width:450px;height:auto;background:#ffffff;z-index:1002;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;}" +
  "#gm_hfr_semep_config_window div.gm_hfr_semep_main_title{font-size:16px;text-align:center;" +
  "font-weight:bold;margin:0 0 8px;}" +
  "#gm_hfr_semep_config_window fieldset{margin:0 0 8px;border:1px solid #888888;padding:6px 10px 10px;" +
  "background:linear-gradient(to bottom, #ffffff 20px, transparent);transition:background-color 0.3s ease 0s;}" +
  "#gm_hfr_semep_config_window fieldset.gm_hfr_semep_red{background-color:#ffc0b0;}" +
  "#gm_hfr_semep_config_window fieldset.gm_hfr_semep_green{background-color:#c0ffb0;}" +
  "#gm_hfr_semep_config_window legend{font-size:14px;background-color:#ffffff;}" +
  "#gm_hfr_semep_config_window p{margin:0 0 0 4px;}" +
  "#gm_hfr_semep_config_window p:not(:last-child){margin-bottom:4px;}" +
  "#gm_hfr_semep_config_window img.gm_hfr_semep_test{margin:0 3px 1px 0;max-width:16px;max-height:16px;" +
  "vertical-align:text-bottom;}" +
  "#gm_hfr_semep_config_window img.gm_hfr_semep_reset{cursor:pointer;margin:0 0 0 3px;}" +
  "#gm_hfr_semep_config_window div.gm_hfr_semep_mise_en_page_div{display:flex;justify-content:space-around;}" +
  "#gm_hfr_semep_config_window div.gm_hfr_semep_mise_en_page_div:not(:last-child){margin-bottom:8px;}" +
  "#gm_hfr_semep_config_window input[type=\"checkbox\"]{margin:0 0 1px 1px;vertical-align:text-bottom;}" +
  "#gm_hfr_semep_config_window input[type=\"text\"]{padding:0 1px;border:1px solid #c0c0c0;height:14px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;text-align:right;}" +
  "div.gm_hfr_semep_save_close_div{text-align:right;margin:16px 0 0;}" +
  "div.gm_hfr_semep_save_close_div div.gm_hfr_semep_info_reload_div{float:left;}" +
  "div.gm_hfr_semep_save_close_div div.gm_hfr_semep_info_reload_div img{vertical-align:text-bottom;}" +
  "div.gm_hfr_semep_save_close_div > img{margin-left:8px;cursor:pointer;}";
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
help_window.setAttribute("id", "gm_hfr_semep_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(p_width, p_text) {
  let l_help_button = document.createElement("img");
  l_help_button.setAttribute("src", img_help);
  l_help_button.setAttribute("class", "gm_hfr_semep_help_button");
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
config_background.setAttribute("id", "gm_hfr_semep_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
config_background.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gm_hfr_semep_config_window");
config_window.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.setAttribute("class", "gm_hfr_semep_main_title");
main_title.textContent = "Conf de [HFR] Styles et mise en page";
config_window.appendChild(main_title);

// section afficher_icone
var afficher_icone_fieldset = document.createElement("fieldset");
var afficher_icone_legend = document.createElement("legend");
var afficher_icone_checkbox = document.createElement("input");
afficher_icone_checkbox.setAttribute("id", "gm_hfr_semep_afficher_icone_checkbox");
afficher_icone_checkbox.setAttribute("type", "checkbox");

function afficher_icone_changed(p_event) {
  if(afficher_icone_checkbox.checked) {
    afficher_icone_fieldset.setAttribute("class", "gm_hfr_semep_green");
  } else {
    afficher_icone_fieldset.setAttribute("class", "gm_hfr_semep_red");
  }
}
afficher_icone_checkbox.addEventListener("change", afficher_icone_changed, false);
afficher_icone_legend.appendChild(afficher_icone_checkbox);
var afficher_icone_label = document.createElement("label");
afficher_icone_label.textContent = " Afficher le bouton du script en haut des pages ";
afficher_icone_label.setAttribute("for", "gm_hfr_semep_afficher_icone_checkbox");
afficher_icone_legend.appendChild(afficher_icone_label);
afficher_icone_legend.appendChild(create_help_button(250,
  "Le bouton du script permet d'ouvrir cette fenêtre de " +
  "configuration mais cette dernière reste accessible " +
  "via le menu de l'extension."));
afficher_icone_fieldset.appendChild(afficher_icone_legend);
config_window.appendChild(afficher_icone_fieldset);
var image_icone_p = document.createElement("p");
var image_icone_label = document.createElement("label");
image_icone_label.textContent = "icône du bouton : ";
image_icone_label.setAttribute("for", "gm_hfr_semep_image_icone_input");
image_icone_p.appendChild(image_icone_label);
var image_icone_test_img = document.createElement("img");
image_icone_test_img.setAttribute("class", "gm_hfr_semep_test");
image_icone_p.appendChild(image_icone_test_img);
var image_icone_input = document.createElement("input");
image_icone_input.setAttribute("id", "gm_hfr_semep_image_icone_input");
image_icone_input.setAttribute("type", "text");
image_icone_input.setAttribute("spellcheck", "false");
image_icone_input.setAttribute("size", "37");
image_icone_input.setAttribute("title", "url de l'icône (http ou data)");
image_icone_input.addEventListener("focus", function() {
  image_icone_input.select();
}, false);

function image_icone_do_test_img() {
  image_icone_test_img.setAttribute("src", image_icone_input.value.trim());
  image_icone_input.setSelectionRange(0, 0);
  image_icone_input.blur();
}
image_icone_input.addEventListener("input", image_icone_do_test_img, false);
image_icone_p.appendChild(image_icone_input);
var image_icone_reset_img = document.createElement("img");
image_icone_reset_img.setAttribute("src", img_reset);
image_icone_reset_img.setAttribute("class", "gm_hfr_semep_reset");
image_icone_reset_img.setAttribute("title", "remettre l'icône par défaut");

function image_icone_do_reset_img() {
  image_icone_input.value = smp_image_icone_defaut;
  image_icone_do_test_img();
}
image_icone_reset_img.addEventListener("click", image_icone_do_reset_img, false);
image_icone_p.appendChild(image_icone_reset_img);
afficher_icone_fieldset.appendChild(image_icone_p);

// section styles
var styles_fieldset = document.createElement("fieldset");
var styles_legend = document.createElement("legend");
styles_legend.textContent = "Styles";
styles_fieldset.appendChild(styles_legend);
config_window.appendChild(styles_fieldset);

// taille_reponse
var taille_reponse_p = document.createElement("p");
var taille_reponse_checkbox = document.createElement("input");
taille_reponse_checkbox.setAttribute("type", "checkbox");
taille_reponse_checkbox.setAttribute("id", "gm_hfr_semep_taille_reponse_checkbox");
taille_reponse_p.appendChild(taille_reponse_checkbox);
var taille_reponse_label = document.createElement("label");
taille_reponse_label.textContent = " taille de la réponse rapide : ";
taille_reponse_label.setAttribute("for", "gm_hfr_semep_taille_reponse_checkbox");
taille_reponse_p.appendChild(taille_reponse_label);
var largeur_reponse_label = document.createElement("label");
largeur_reponse_label.textContent = "l ";
largeur_reponse_label.setAttribute("for", "gm_hfr_semep_largeur_reponse_input");
taille_reponse_p.appendChild(largeur_reponse_label);
var largeur_reponse_input = document.createElement("input");
largeur_reponse_input.setAttribute("type", "text");
largeur_reponse_input.setAttribute("spellcheck", "false");
largeur_reponse_input.setAttribute("id", "gm_hfr_semep_largeur_reponse_input");
largeur_reponse_input.setAttribute("size", "5");
largeur_reponse_input.setAttribute("maxLength", "6");
largeur_reponse_input.addEventListener("focus", function() {
  largeur_reponse_input.select();
}, false);
taille_reponse_p.appendChild(largeur_reponse_input);
taille_reponse_p.appendChild(document.createTextNode(" x "));
var hauteur_reponse_label = document.createElement("label");
hauteur_reponse_label.textContent = "h ";
hauteur_reponse_label.setAttribute("for", "gm_hfr_semep_hauteur_reponse_input");
taille_reponse_p.appendChild(hauteur_reponse_label);
var hauteur_reponse_input = document.createElement("input");
hauteur_reponse_input.setAttribute("type", "text");
hauteur_reponse_input.setAttribute("spellcheck", "false");
hauteur_reponse_input.setAttribute("id", "gm_hfr_semep_hauteur_reponse_input");
hauteur_reponse_input.setAttribute("size", "5");
hauteur_reponse_input.setAttribute("maxLength", "6");
hauteur_reponse_input.addEventListener("focus", function() {
  hauteur_reponse_input.select();
}, false);
taille_reponse_p.appendChild(hauteur_reponse_input);
taille_reponse_p.appendChild(document.createTextNode(" "));
taille_reponse_p.appendChild(create_help_button(230,
  "Vous pouvez préciser l'unité, soit \u00ab\u202fpx\u202f\u00bb, soit \u00ab\u202f%\u202f\u00bb, " +
  "sans unité \u00ab\u202fpx\u202f\u00bb est retenu et le \u00ab\u202f%\u202f\u00bb est par rapport " +
  "à la taille de la fenêtre."));
styles_fieldset.appendChild(taille_reponse_p);

// taille_normale
var taille_normale_p = document.createElement("p");
var taille_normale_checkbox = document.createElement("input");
taille_normale_checkbox.setAttribute("type", "checkbox");
taille_normale_checkbox.setAttribute("id", "gm_hfr_semep_taille_normale_checkbox");
taille_normale_p.appendChild(taille_normale_checkbox);
var taille_normale_label = document.createElement("label");
taille_normale_label.textContent = " hauteur de la réponse normale : ";
taille_normale_label.setAttribute("for", "gm_hfr_semep_taille_normale_checkbox");
taille_normale_p.appendChild(taille_normale_label);
var hauteur_normale_input = document.createElement("input");
hauteur_normale_input.setAttribute("type", "text");
hauteur_normale_input.setAttribute("spellcheck", "false");
hauteur_normale_input.setAttribute("size", "5");
hauteur_normale_input.setAttribute("maxLength", "6");
hauteur_normale_input.addEventListener("focus", function() {
  hauteur_normale_input.select();
}, false);
taille_normale_p.appendChild(hauteur_normale_input);
taille_normale_p.appendChild(document.createTextNode(" "));
taille_normale_p.appendChild(create_help_button(230,
  "Vous pouvez préciser l'unité, soit \u00ab\u202fpx\u202f\u00bb, soit \u00ab\u202f%\u202f\u00bb, " +
  "sans unité \u00ab\u202fpx\u202f\u00bb est retenu et le \u00ab\u202f%\u202f\u00bb est par rapport " +
  "à la hauteur de la fenêtre."));
styles_fieldset.appendChild(taille_normale_p);

// images_smileys
var images_smileys_p = document.createElement("p");
var images_smileys_checkbox = document.createElement("input");
images_smileys_checkbox.setAttribute("type", "checkbox");
images_smileys_checkbox.setAttribute("id", "gm_hfr_semep_images_smileys_checkbox");
images_smileys_p.appendChild(images_smileys_checkbox);
var images_smileys_label = document.createElement("label");
images_smileys_label.textContent = " homogénéiser l'affichage des images et des smileys ";
images_smileys_label.setAttribute("for", "gm_hfr_semep_images_smileys_checkbox");
images_smileys_p.appendChild(images_smileys_label);
images_smileys_p.appendChild(create_help_button(165,
  "Cette option enlève les marges sur les images et alligne les images et les smileys en bas du texte."));
styles_fieldset.appendChild(images_smileys_p);

// section mise_em_page
var mise_em_page_fieldset = document.createElement("fieldset");
var mise_em_page_legend = document.createElement("legend");
mise_em_page_legend.textContent = "Mise en page";
mise_em_page_fieldset.appendChild(mise_em_page_legend);
config_window.appendChild(mise_em_page_fieldset);

// supprimer
var supprimer_p = document.createElement("p");
supprimer_p.setAttribute("class", "gm_hfr_semep_mise_en_page_p");
supprimer_p.textContent = "Supprimer les éléments de bas de page :";
mise_em_page_fieldset.appendChild(supprimer_p);
var supprimer_div = document.createElement("div");
supprimer_div.setAttribute("class", "gm_hfr_semep_mise_en_page_div");
var sujets_div = document.createElement("div");
var sujets_checkbox = document.createElement("input");
sujets_checkbox.setAttribute("type", "checkbox");
sujets_checkbox.setAttribute("id", "gm_hfr_semep_sujets_checkbox");
sujets_div.appendChild(sujets_checkbox);
var sujets_label = document.createElement("label");
sujets_label.textContent = " sujets relatifs";
sujets_label.setAttribute("for", "gm_hfr_semep_sujets_checkbox");
sujets_div.appendChild(sujets_label);
supprimer_div.appendChild(sujets_div);
var version_div = document.createElement("div");
var version_checkbox = document.createElement("input");
version_checkbox.setAttribute("type", "checkbox");
version_checkbox.setAttribute("id", "gm_hfr_semep_version_checkbox");
version_div.appendChild(version_checkbox);
var version_label = document.createElement("label");
version_label.textContent = " bloc de version";
version_label.setAttribute("for", "gm_hfr_semep_version_checkbox");
version_div.appendChild(version_label);
supprimer_div.appendChild(version_div);
var copyright_div = document.createElement("div");
var copyright_checkbox = document.createElement("input");
copyright_checkbox.setAttribute("type", "checkbox");
copyright_checkbox.setAttribute("id", "gm_hfr_semep_copyright_checkbox");
copyright_div.appendChild(copyright_checkbox);
var copyright_label = document.createElement("label");
copyright_label.textContent = " ligne de copyright";
copyright_label.setAttribute("for", "gm_hfr_semep_copyright_checkbox");
copyright_div.appendChild(copyright_label);
supprimer_div.appendChild(copyright_div);
mise_em_page_fieldset.appendChild(supprimer_div);

// quotes
var quotes_p = document.createElement("p");
quotes_p.setAttribute("class", "gm_hfr_semep_mise_en_page_p");
quotes_p.textContent = "Reconvertir les liens en images dans les quotes pour les :";
mise_em_page_fieldset.appendChild(quotes_p);
var quotes_div = document.createElement("div");
quotes_div.setAttribute("class", "gm_hfr_semep_mise_en_page_div");
var toyonos_div = document.createElement("div");
var toyonos_checkbox = document.createElement("input");
toyonos_checkbox.setAttribute("type", "checkbox");
toyonos_checkbox.setAttribute("id", "gm_hfr_semep_toyonos_checkbox");
toyonos_div.appendChild(toyonos_checkbox);
var toyonos_label = document.createElement("label");
toyonos_label.textContent = " smileys générés de Toyonos";
toyonos_label.setAttribute("for", "gm_hfr_semep_toyonos_checkbox");
toyonos_div.appendChild(toyonos_label);
quotes_div.appendChild(toyonos_div);
var emojis_div = document.createElement("div");
var emojis_checkbox = document.createElement("input");
emojis_checkbox.setAttribute("type", "checkbox");
emojis_checkbox.setAttribute("id", "gm_hfr_semep_emojis_checkbox");
emojis_div.appendChild(emojis_checkbox);
var emojis_label = document.createElement("label");
emojis_label.textContent = " émojis de [HFR] Copié/Collé";
emojis_label.setAttribute("for", "gm_hfr_semep_emojis_checkbox");
emojis_div.appendChild(emojis_label);
quotes_div.appendChild(emojis_div);
mise_em_page_fieldset.appendChild(quotes_div);

// rechargement de la page et boutons de validation et de fermeture
var save_close_div = document.createElement("div");
save_close_div.setAttribute("class", "gm_hfr_semep_save_close_div");
var info_reload_div = document.createElement("div");
info_reload_div.setAttribute("class", "gm_hfr_semep_info_reload_div");
var info_reload_checkbox = document.createElement("input");
info_reload_checkbox.setAttribute("type", "checkbox");
info_reload_checkbox.setAttribute("id", "gm_hfr_semep_info_reload_checkbox");
info_reload_div.appendChild(info_reload_checkbox);
var info_reload_label = document.createElement("label");
info_reload_label.textContent = " recharger la page ";
info_reload_label.setAttribute("for", "gm_hfr_semep_info_reload_checkbox");
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
  // récupération des paramètres
  smp_afficher_icone = afficher_icone_checkbox.checked
  smp_image_icone = image_icone_input.value.trim();
  if(smp_image_icone === "") {
    smp_image_icone = smp_image_icone_defaut;
  }
  smp_taille_reponse = taille_reponse_checkbox.checked;
  let largeur = largeur_reponse_input.value.trim();
  smp_largeur_unite = largeur.substring(largeur.length - 1) === "%" ? "vw" : "px";
  smp_largeur_reponse = parseInt(largeur, 10);
  smp_largeur_reponse = Math.max(smp_largeur_reponse, 1);
  smp_largeur_reponse = Math.min(smp_largeur_reponse, 9999);
  if(isNaN(smp_largeur_reponse)) {
    smp_largeur_reponse = smp_largeur_reponse_defaut;
    smp_largeur_unite = smp_largeur_unite_defaut;
  }
  let hauteur = hauteur_reponse_input.value.trim();
  smp_hauteur_unite = hauteur.substring(hauteur.length - 1) === "%" ? "vh" : "px";
  smp_hauteur_reponse = parseInt(hauteur, 10);
  smp_hauteur_reponse = Math.max(smp_hauteur_reponse, 1);
  smp_hauteur_reponse = Math.min(smp_hauteur_reponse, 9999);
  if(isNaN(smp_hauteur_reponse)) {
    smp_hauteur_reponse = smp_hauteur_reponse_defaut;
    smp_hauteur_unite = smp_hauteur_unite_defaut;
  }
  smp_taille_normale = taille_normale_checkbox.checked;
  let normale = hauteur_normale_input.value.trim();
  smp_unite_normale = normale.substring(normale.length - 1) === "%" ? "vh" : "px";
  smp_hauteur_normale = parseInt(normale, 10);
  smp_hauteur_normale = Math.max(smp_hauteur_normale, 1);
  smp_hauteur_normale = Math.min(smp_hauteur_normale, 9999);
  if(isNaN(smp_hauteur_normale)) {
    smp_hauteur_normale = smp_hauteur_normale_defaut;
    smp_unite_normale = smp_unite_normale_defaut;
  }
  smp_images_smileys = images_smileys_checkbox.checked;
  smp_supprimer_sujets = sujets_checkbox.checked;
  smp_supprimer_version = version_checkbox.checked;
  smp_supprimer_copyright = copyright_checkbox.checked;
  smp_toyonos_quotes = toyonos_checkbox.checked;
  smp_emojis_quotes = emojis_checkbox.checked;
  // fermeture de la fenêtre
  hide_config_window();
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("smp_afficher_icone", smp_afficher_icone),
    GM.setValue("smp_image_icone", smp_image_icone),
    GM.setValue("smp_taille_reponse", smp_taille_reponse),
    GM.setValue("smp_largeur_reponse", smp_largeur_reponse),
    GM.setValue("smp_largeur_unite", smp_largeur_unite),
    GM.setValue("smp_hauteur_reponse", smp_hauteur_reponse),
    GM.setValue("smp_hauteur_unite", smp_hauteur_unite),
    GM.setValue("smp_taille_normale", smp_taille_normale),
    GM.setValue("smp_hauteur_normale", smp_hauteur_normale),
    GM.setValue("smp_unite_normale", smp_unite_normale),
    GM.setValue("smp_images_smileys", smp_images_smileys),
    GM.setValue("smp_supprimer_sujets", smp_supprimer_sujets),
    GM.setValue("smp_supprimer_version", smp_supprimer_version),
    GM.setValue("smp_supprimer_copyright", smp_supprimer_copyright),
    GM.setValue("smp_toyonos_quotes", smp_toyonos_quotes),
    GM.setValue("smp_emojis_quotes", smp_emojis_quotes),
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
function show_config_window() {
  // initialisation des paramètres
  afficher_icone_checkbox.checked = smp_afficher_icone;
  afficher_icone_changed();
  image_icone_input.value = smp_image_icone;
  image_icone_do_test_img();
  taille_reponse_checkbox.checked = smp_taille_reponse;
  largeur_reponse_input.value = smp_largeur_reponse + (smp_largeur_unite === "px" ? "px" : "%");
  hauteur_reponse_input.value = smp_hauteur_reponse + (smp_hauteur_unite === "px" ? "px" : "%");
  taille_normale_checkbox.checked = smp_taille_normale;
  hauteur_normale_input.value = smp_hauteur_normale + (smp_unite_normale === "px" ? "px" : "%");
  images_smileys_checkbox.checked = smp_images_smileys;
  sujets_checkbox.checked = smp_supprimer_sujets;
  version_checkbox.checked = smp_supprimer_version;
  copyright_checkbox.checked = smp_supprimer_copyright;
  toyonos_checkbox.checked = smp_toyonos_quotes;
  emojis_checkbox.checked = smp_emojis_quotes;
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
}

// ajout d'une entrée de configuration dans le menu de l'extension
gmMenu("\u200b[HFR] Styles et mise en page -> Configuration", show_config_window);

/* ----------------------------------------------------------------------------- */
/* récupération des paramètres et mise en place des styles et de la mise en page */
/* ----------------------------------------------------------------------------- */

// fonction de conversion des liens en images dans les quotes
function a2img(p_href) {
  let l_links = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message > td.messCase2 > " +
    "div[id^=\"para\"] table.citation a.cLink[href*=\"" + p_href + "\"], " +
    "div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message > td.messCase2 > " +
    "div[id^=\"para\"] table.oldcitation a.cLink[href*=\"" + p_href + "\"]");
  for(let l_link of l_links) {
    let l_href = l_link.getAttribute("href");
    if(l_link.firstChild && l_href.length > p_href.length) {
      if(l_href.startsWith("https://images.weserv.nl/")) {
        l_href = l_href.replace(p_href, p_href.replace(/^http:\/\//, ""));
      }
      l_href = l_href.replace("'", "%27", "g").replace("\"", "%22", "g");
      let l_img = document.createElement("img");
      l_img.setAttribute("alt", l_href);
      l_img.setAttribute("title", l_href);
      l_img.setAttribute("src", l_href);
      l_link.parentNode.replaceChild(l_img, l_link);
    }
  }
}

Promise.all([
  GM.getValue("smp_afficher_icone", smp_afficher_icone_defaut),
  GM.getValue("smp_image_icone", smp_image_icone_defaut),
  GM.getValue("smp_taille_reponse", smp_taille_reponse_defaut),
  GM.getValue("smp_largeur_reponse", smp_largeur_reponse_defaut),
  GM.getValue("smp_largeur_unite", smp_largeur_unite_defaut),
  GM.getValue("smp_hauteur_reponse", smp_hauteur_reponse_defaut),
  GM.getValue("smp_hauteur_unite", smp_hauteur_unite_defaut),
  GM.getValue("smp_taille_normale", smp_taille_normale_defaut),
  GM.getValue("smp_hauteur_normale", smp_hauteur_normale_defaut),
  GM.getValue("smp_unite_normale", smp_unite_normale_defaut),
  GM.getValue("smp_images_smileys", smp_images_smileys_defaut),
  GM.getValue("smp_supprimer_sujets", smp_supprimer_sujets_defaut),
  GM.getValue("smp_supprimer_version", smp_supprimer_version_defaut),
  GM.getValue("smp_supprimer_copyright", smp_supprimer_copyright_defaut),
  GM.getValue("smp_toyonos_quotes", smp_toyonos_quotes_defaut),
  GM.getValue("smp_emojis_quotes", smp_emojis_quotes_defaut),
]).then(function([
  smp_afficher_icone_value,
  smp_image_icone_value,
  smp_taille_reponse_value,
  smp_largeur_reponse_value,
  smp_largeur_unite_value,
  smp_hauteur_reponse_value,
  smp_hauteur_unite_value,
  smp_taille_normale_value,
  smp_hauteur_normale_value,
  smp_unite_normale_value,
  smp_images_smileys_value,
  smp_supprimer_sujets_value,
  smp_supprimer_version_value,
  smp_supprimer_copyright_value,
  smp_toyonos_quotes_value,
  smp_emojis_quotes_value,
]) {
  // initialisation des variables globales
  smp_afficher_icone = smp_afficher_icone_value;
  smp_image_icone = smp_image_icone_value;
  smp_taille_reponse = smp_taille_reponse_value;
  smp_largeur_reponse = smp_largeur_reponse_value;
  smp_largeur_unite = smp_largeur_unite_value;
  smp_hauteur_reponse = smp_hauteur_reponse_value;
  smp_hauteur_unite = smp_hauteur_unite_value;
  smp_taille_normale = smp_taille_normale_value;
  smp_hauteur_normale = smp_hauteur_normale_value;
  smp_unite_normale = smp_unite_normale_value;
  smp_images_smileys = smp_images_smileys_value;
  smp_supprimer_sujets = smp_supprimer_sujets_value;
  smp_supprimer_version = smp_supprimer_version_value;
  smp_supprimer_copyright = smp_supprimer_copyright_value;
  smp_toyonos_quotes = smp_toyonos_quotes_value;
  smp_emojis_quotes = smp_emojis_quotes_value;
  // affichage du bouton
  if(smp_afficher_icone) {
    let l_onglets = document.querySelector("table.none tr td div.cadreonglet");
    if(l_onglets) {
      let l_before_9 = l_onglets.querySelector("div#befor9");
      let l_before_2 = l_onglets.querySelector("div#befor2");
      if(l_before_9 || l_before_2) {
        let l_before = l_before_9 ? l_before_9 : l_before_2;
        let l_onglet_avant = document.createElement("div");
        l_onglet_avant.setAttribute("id", "beforSMP");
        l_onglet_avant.setAttribute("class", "beforonglet");
        let l_onglet_apres = document.createElement("div");
        l_onglet_apres.setAttribute("id", "afterSMP");
        l_onglet_apres.setAttribute("class", "afteronglet");
        let l_onglet = document.createElement("a");
        l_onglet.setAttribute("id", "ongletSMP");
        l_onglet.setAttribute("class", "onglet");
        l_onglet.setAttribute("title", "[HFR] Styles et mise en page -> Configuration");
        l_onglet.addEventListener("click", prevent_default, false);
        l_onglet.addEventListener("contextmenu", prevent_default, false);
        l_onglet.addEventListener("mousedown", prevent_default, false);
        l_onglet.addEventListener("mouseup", show_config_window, false);
        let l_onglet_img = document.createElement("img");
        l_onglet_img.setAttribute("class", "npn_button");
        l_onglet_img.setAttribute("src", smp_image_icone);
        l_onglet_img.setAttribute("alt", "SMP");
        l_onglet.appendChild(l_onglet_img);
        l_onglets.insertBefore(l_onglet_avant, l_before);
        l_onglets.insertBefore(l_onglet, l_before);
        l_onglets.insertBefore(l_onglet_apres, l_before);
      }
    }
  }
  // taille de la réponse rapide
  if(smp_taille_reponse) {
    let l_reponse_rapide = document.querySelector("div#mesdiscussions.mesdiscussions " +
      "textarea#content_form.reponserapide");
    if(l_reponse_rapide) {
      l_reponse_rapide.style.width = "" + smp_largeur_reponse + smp_largeur_unite;
      l_reponse_rapide.style.height = "" + smp_hauteur_reponse + smp_hauteur_unite;
    }
  }
  // hauteur de la réponse normale
  if(smp_taille_normale) {
    let l_reponse_normale = document.querySelector("div#mesdiscussions.mesdiscussions " +
      "textarea#content_form.contenu");
    if(l_reponse_normale) {
      l_reponse_normale.style.height = "" + smp_hauteur_normale + smp_unite_normale;
    }
  }
  // homogénéiser l'affichage des images et des smileys
  if(smp_images_smileys) {
    let style_images_smileys = document.createElement("style");
    style_images_smileys.setAttribute("type", "text/css");
    style_images_smileys.textContent = "div[id^=\"para\"] img:not(.ws_toyo_smilies):not(.ws_toyo_help_icon), " +
      "div#apercu_reponse img, body#mesdiscussions img{border:0 !important;margin:0 !important;" +
      "padding:0 !important;vertical-align:bottom !important;}span.gm_hfr_tdi_r21_img_span" +
      "{vertical-align:bottom !important;}";
    document.getElementsByTagName("head")[0].appendChild(style_images_smileys);
  }
  // suppression des sujets relatifs
  if(smp_supprimer_sujets) {
    if(document.getElementById("sujetrelatif")) {
      // suppression du <br> avant les sujets relatifs
      if(document.getElementById("sujetrelatif").previousElementSibling &&
        (document.getElementById("sujetrelatif").previousElementSibling.nodeName.toLowerCase() === "br")) {
        document.getElementById("sujetrelatif").parentNode
          .removeChild(document.getElementById("sujetrelatif").previousElementSibling);
      }
      // suppression des sujets relatifs
      document.getElementById("sujetrelatif").parentNode.removeChild(document.getElementById("sujetrelatif"));
    }
  }
  // suppression de la version
  if(smp_supprimer_version) {
    if(document.querySelector("div.copyright")) {
      // suppression du <br> avant la version
      if(document.querySelector("div.copyright").previousElementSibling &&
        (document.querySelector("div.copyright").previousElementSibling.nodeName.toLowerCase() === "br")) {
        document.querySelector("div.copyright").parentNode
          .removeChild(document.querySelector("div.copyright").previousElementSibling);
      }
      // suppression de la version
      document.querySelector("div.copyright").parentNode.removeChild(document.querySelector("div.copyright"));
    }
  }
  // suppression du copyright
  if(smp_supprimer_copyright) {
    let l_centers = document.querySelectorAll("div.container ~ center");
    for(let l_center of l_centers) {
      l_center.parentNode.removeChild(l_center);
    }
  }
  // reconversion des smileys générés de toyonos en images dans les quotes
  if(smp_toyonos_quotes) {
    a2img("http://hfr.toyonos.info/smileys/generate/");
    a2img("http://hfr.toyonos.info/generateurs/");
  }
  // reconversion des émojis de [HFR] Copié/Collé en images dans les quotes
  if(smp_emojis_quotes) {
    a2img("https://gitlab.com/BZHDeveloper/HFR/raw/master/emojis-micro/");
  }
});
