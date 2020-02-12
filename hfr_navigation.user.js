// ==UserScript==
// @name          [HFR] Navigation
// @version       0.9.6
// @namespace     roger21.free.fr
// @description   Permet de naviger sur le forum avec des raccourcis clavier (Alt + d b n v t u).
// @icon          https://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2015, 2017-2019 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1153 $

// historique :
// 0.9.6 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 0.9.5 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 0.9.4 (29/11/2018) :
// - nouveau nom : [HFR] navigation -> [HFR] Navigation
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// 0.9.3 (17/05/2018) :
// - amélioration et check du code dans tm
// - utilisation d'une balise style pour ne pas dépendre de GM_addStyle
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - maj de la metadata @homepageURL
// - version compressée de l'icône du script
// - gestion de la compatibilité avec chrome (keydown au lieu de keypress et u au lieu de s)
// 0.9.2 (06/04/2018) :
// - remplacement des window.location par des window.location.href pour plus de clarté et pour fonctionner avec vm
// 0.9.1 (28/11/2017) :
// - passage au https
// 0.9.0 (24/10/2015) :
// - création

// alt +
// d pour les drapeaux
// b (before) pour la page d'avant
// n (next) pour la page suivante
// v (sorte de fleche vers le bas) bas de page
// t (top) haut de page
// u (up) pour remonter d'un cran dans la hierarchie du forum jusqu'a la racine

// pour le "code" des touches : https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code

var codes = {
  "KeyD": "drap",
  "KeyB": "pprec",
  "KeyN": "psuiv",
  "KeyV": "bas",
  "KeyT": "haut",
  "KeyU": "up"
};

var actions = {
  "drap": null,
  "pprec": null,
  "psuiv": null,
  "bas": null,
  "haut": null,
  "up": null
};

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent = "#hfr_nav_bg{position:absolute;left:0;top:0;background-color:white;z-index:1009;display:none;opacity:0.5;}";
document.getElementsByTagName("head")[0].appendChild(style);

var hfr_nav_bg = document.createElement("div");
hfr_nav_bg.setAttribute("id", "hfr_nav_bg");
document.body.appendChild(hfr_nav_bg);

function blink() {
  hfr_nav_bg.style.display = "none";
}

function dont_blink() {
  hfr_nav_bg.style.width = document.documentElement.scrollWidth + "px";
  hfr_nav_bg.style.height = document.documentElement.scrollHeight + "px";
  hfr_nav_bg.style.display = "block";
  window.setTimeout(blink, 100);
}

if(window.location.href.indexOf("https://forum.hardware.fr/forum1f.php?config=hfr.inc&owntopic=1") === -1) {
  actions.drap = "https://forum.hardware.fr/forum1f.php?config=hfr.inc&owntopic=1";
}
var pprec = document.querySelector("div.pagepresuiv > a.cHeader[accesskey='w']");
if(pprec) {
  actions.pprec = pprec.href;
}
var psuiv = document.querySelector("div.pagepresuiv > a.cHeader[accesskey='x']");
if(psuiv) {
  actions.psuiv = psuiv.href;
}
var bas = document.querySelector("div.pagepresuiv > a.cHeader[href='#bas']");
if(bas) {
  actions.bas = bas.href;
}
var haut = document.querySelector("div.pagepresuiv > a.cHeader[href='#haut']");
if(haut) {
  actions.haut = haut.href;
}
var up = document.querySelector("span#md_arbo_tree_3 > a.Ext");
if(up) {
  actions.up = up.href;
} else {
  up = document.querySelector("span#md_arbo_tree_2 > a.Ext");
  if(up) {
    actions.up = up.href;
  } else {
    up = document.querySelector("span#md_arbo_tree_1 > a.Ext");
    if(up && window.location.href !== "https://forum.hardware.fr/") {
      actions.up = up.href;
    }
  }
}

document.addEventListener("keydown", function(e) {
  if(e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
    if(typeof codes[e.code] !== "undefined") {
      e.preventDefault();
      if(actions[codes[e.code]] !== null) {
        window.location.href = actions[codes[e.code]];
      } else {
        dont_blink();
      }
    }
  }
}, false);
