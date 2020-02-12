// ==UserScript==
// @name          [HFR] Drapal Easy Click
// @version       1.8.3
// @namespace     roger21.free.fr
// @description   Permet de cliquer sur la case du drapal au lieu d'avoir à viser le drapal.
// @icon          https://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/forum1.php*
// @include       https://forum.hardware.fr/forum1f.php*
// @include       https://forum.hardware.fr/*/liste_sujet-*.htm
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.openInTab
// @grant         GM_openInTab
// ==/UserScript==

/*

Copyright © 2012, 2014-2019 roger21@free.fr

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
// 1.8.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// - découpage de certaines lignes longues
// 1.8.2 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.8.1 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+
// - réécriture de la metadata @description
// 1.8.0 (11/08/2018) :
// - nouveau nom : [HFR] drapal easy click -> [HFR] Drapal Easy Click
// - ajout de la metadata @author (roger21)
// 1.7.0 (26/05/2018) :
// - gestion de la compatibilité gm4
// - check du code dans tm (reste un warning qui va rester -_-)
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles
// 1.6.2 (06/04/2018) :
// - remplacement des window.location par des window.location.href pour fonctionner avec vm ->
// (problème rapporté par Heeks)
// 1.6.1 (25/12/2017) :
// - remise à false par défaut de drapals_refresh
// 1.6.0 (17/12/2017) :
// - ajout d'une gestion du dblclick sur la case du topic qui renvoi vers le drapal
// 1.5.1 (28/11/2017) :
// - passage au https
// 1.5.0 (10/11/2017) :
// - ajout d'un refresh de la page des drapals (option en dur dans le code, initialement désactivé)
// 1.4.3 (02/09/2017) :
// - correction sur la récupération des href
// 1.4.2 (02/09/2017) :
// - gestion de la compatibilité avec [HFR] new page number version 2.3.0+ ->
// Faux ! Totalement faux ! Pas du tout ça ! Non, j'ai envie de te dire menteur ... Menteur ! voir 1.4.3
// 1.4.1 (02/09/2017) :
// - correction de la gestion du clic pour ne pas réagir sur le clic-droit [:roger21:2]
// - homogénéisation de la gestion des clics et des preventDefault avec [HFR] new page number
// 1.4.0 (28/07/2017) :
// - getsion de la compatibilité avec [HFR] new page number version 2.2.0+
// 1.3.1 (26/12/2016) :
// - ajout d'un preventDefault sur le ctrl+click (mousedown) pour ne pas avoir ->
// l'effet de selection d'element de firefox (problème rapporté par BrisChri)
// 1.3.0 (11/12/2016) :
// - gestion du background color en image transparante pour compatibilité avec le dégradé ->
// de new page number 2.0.0
// 1.2.1 (03/11/2016) :
// - ajout de l'open_in_background en dur
// 1.2.0 (03/11/2016) :
// - recodage en mouseup
// - élargissement de la case des drapals
// 1.1.0 (01/11/2016) :
// - nettoyage/evolution/conformité du code
// - ajout d'un effet mouseover sur la case du drapal
// - ajout de commentaires -__-
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.0.4 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.3 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.2 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.0.1 (14/09/2012) :
// - ajout des metadata @grant

/* options en dur */
var open_in_background = true;
var drapals_refresh = true;
var refresh_delay = 5000; // 5 secondes

// compatibilité gm4
if(typeof GM === "undefined") {
  this.GM = {};
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

// gestion du refresh
function page_refresh() {
  window.location.reload(true);
}
var refresh_timer = null;

// recherche des cases des drapals
var cells = document.querySelectorAll("tr[class^=\"sujet ligne_booleen\"] > td.sujetCase5");
for(let cell of cells) {
  // agrandissement de la case
  cell.style.width = "5%";
  // ajout du background repeat pour le mouse over en image
  cell.style.backgroundRepeat = "repeat";
  // si il y a un drapal
  if((cell.firstElementChild != null) && (cell.firstElementChild.nodeName.toLowerCase() == "a")) {
    // ajout du curseur pointeur
    cell.style.cursor = "pointer";
    // gestion du clic, du ctrl-clic et du clic-milieu
    cell.addEventListener("mousedown", function(e) {
      if(e.ctrlKey) {
        e.preventDefault();
      }
    }, false);
    cell.addEventListener("mouseup", function(e) {
      if(e.target === this) {
        if(((e.button === 0) && !e.altKey && !e.shiftKey && !e.metaKey && e.ctrlKey) ||
           ((e.button === 1) && !e.altKey && !e.shiftKey && !e.metaKey)) {
          if(this.firstElementChild.hasAttribute("href")) {
            GM.openInTab(this.firstElementChild.href, open_in_background);
          } else if(this.firstElementChild.dataset.href) {
            GM.openInTab(this.firstElementChild.dataset.href, open_in_background);
          }
          if(drapals_refresh) {
            window.clearTimeout(refresh_timer);
            refresh_timer = window.setTimeout(page_refresh, refresh_delay);
          }
        } else if((e.button === 0) && !e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
          if(this.firstElementChild.hasAttribute("href")) {
            window.location.href = this.firstElementChild.href;
          } else if(this.firstElementChild.dataset.href) {
            window.location.href = this.firstElementChild.dataset.href;
          }
        }
      }
    }, false);
    // gestion de l'effet sur mouseover
    cell.addEventListener("mouseover", function(e) {
      //this.style.backgroundColor = "rgba(0,0,0,0.3)";
      this.style.backgroundImage = "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGDwAQAAUQBNSuN5HgAAAABJRU5ErkJggg%3D%3D\")";
    }, false);
    cell.addEventListener("mouseout", function(e) {
      //this.style.backgroundColor = "rgba(0,0,0,0)";
      this.style.backgroundImage = "none";
    }, false);
    // gestion du dblclick
    let topic = cell.parentElement.querySelector("td.sujetCase3");
    topic.removeAttribute("ondblclick");
    topic.addEventListener("dblclick", function(e) {
      e.preventDefault();
      if(cell.firstElementChild.hasAttribute("href")) {
        window.location.href = cell.firstElementChild.href;
      } else if(cell.firstElementChild.dataset.href) {
        window.location.href = cell.firstElementChild.dataset.href;
      }
    }, false);
  }
}