// ==UserScript==
// @name          [HFR] Drapal Easy Click
// @version       1.8.8
// @namespace     roger21.free.fr
// @description   Permet de cliquer sur la case du drapal au lieu d'avoir à viser le drapal.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/forum1.php*
// @include       https://forum.hardware.fr/forum1f.php*
// @include       https://forum.hardware.fr/*/liste_sujet-*.htm
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_drapal_easy_click.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_drapal_easy_click.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_drapal_easy_click.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.openInTab
// @grant         GM_openInTab
// ==/UserScript==

/*

Copyright © 2012, 2014-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1988 $

// historique :
// 1.8.8 (05/05/2020) :
// - ajout de l'option en dur pour ouvrir les onglets à la fin pour Violentmonkey et Tampermonkey
// 1.8.7 (04/05/2020) :
// - nouvelle gestion de l'ouverture des onglets pour Violentmonkey et Tampermonkey ->
// ouverture "à la fin" pour permettre de respecter l'ordre des "séquences" d'ouvertures
// 1.8.6 (20/02/2020) :
// - prise en compte des attributs de [HFR] New Page Number pour l'ouverture des drapals dans un nouvel onglet
// 1.8.5 (18/02/2020) :
// - prise en compte de l'attribut target _blank sur les drapals
// - correction de l'option en dur drapals_refresh à false par défaut
// 1.8.4 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
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

// options en dur
var open_at_end = true;
var drapals_refresh = false;
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

// variables globales
var open_in_background = {
  active: false,
  insert: !open_at_end,
};
var open_in_foreground = {
  active: true,
  insert: !open_at_end,
};
var gm4 = false;
if(GM && GM.info && GM.info.scriptHandler === "Greasemonkey") {
  gm4 = true;
}

// gestion du refresh
function page_refresh() {
  window.location.reload(true);
}
var refresh_timer = null;

// fonction de gestion du mouseup sur la case du drapal
function mouseup(e) {
  e.preventDefault();
  if(e.target === this) {
    if(this.firstElementChild.hasAttribute("data-npn-open-new-tab") &&
      (this.firstElementChild.getAttribute("data-npn-open-new-tab") === "true") &&
      (e.button === 0) && !e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      let did_open = false;
      let foreground = this.firstElementChild.hasAttribute("data-npn-new-tab-foreground") &&
        (this.firstElementChild.getAttribute("data-npn-new-tab-foreground") === "true");
      if(this.firstElementChild.hasAttribute("href")) {
        did_open = true;
        GM.openInTab(this.firstElementChild.href, foreground ?
          (gm4 ? false : open_in_foreground) : open_in_background);
      } else if(this.firstElementChild.dataset.href) {
        did_open = true;
        GM.openInTab(this.firstElementChild.dataset.href, foreground ?
          (gm4 ? false : open_in_foreground) : open_in_background);
      }
      if(did_open && drapals_refresh) {
        window.clearTimeout(refresh_timer);
        refresh_timer = window.setTimeout(page_refresh, refresh_delay);
      }
    } else if((this.firstElementChild.hasAttribute("target") &&
        (this.firstElementChild.getAttribute("target") === "_blank")) ||
      ((e.button === 0) && !e.altKey && !e.shiftKey && !e.metaKey && e.ctrlKey) ||
      ((e.button === 1) && !e.altKey && !e.shiftKey && !e.metaKey)) {
      let did_open = false;
      if(this.firstElementChild.hasAttribute("href")) {
        did_open = true;
        GM.openInTab(this.firstElementChild.href, open_in_background);
      } else if(this.firstElementChild.dataset.href) {
        did_open = true;
        GM.openInTab(this.firstElementChild.dataset.href, open_in_background);
      }
      if(did_open && drapals_refresh) {
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
}

// fonction de gestion du dblclick sure la case du topic
function dblclick(e) {
  e.preventDefault();
  let drapal = this.parentElement.querySelector("td.sujetCase5 a");
  if(drapal.hasAttribute("data-npn-open-new-tab") && (drapal.getAttribute("data-npn-open-new-tab") === "true")) {
    let did_open = false;
    let foreground = drapal.hasAttribute("data-npn-new-tab-foreground") &&
      (drapal.getAttribute("data-npn-new-tab-foreground") === "true");
    if(drapal.hasAttribute("href")) {
      did_open = true;
      GM.openInTab(drapal.href, foreground ? (gm4 ? false : open_in_foreground) : open_in_background);
    } else if(drapal.dataset.href) {
      did_open = true;
      GM.openInTab(drapal.dataset.href, foreground ? (gm4 ? false : open_in_foreground) : open_in_background);
    }
    if(did_open && drapals_refresh) {
      window.clearTimeout(refresh_timer);
      refresh_timer = window.setTimeout(page_refresh, refresh_delay);
    }
  } else if(drapal.hasAttribute("target") && (drapal.getAttribute("target") === "_blank")) {
    let did_open = false;
    if(drapal.hasAttribute("href")) {
      did_open = true;
      GM.openInTab(drapal.href, open_in_background);
    } else if(drapal.dataset.href) {
      did_open = true;
      GM.openInTab(drapal.dataset.href, open_in_background);
    }
    if(did_open && drapals_refresh) {
      window.clearTimeout(refresh_timer);
      refresh_timer = window.setTimeout(page_refresh, refresh_delay);
    }
  } else {
    if(drapal.hasAttribute("href")) {
      window.location.href = drapal.href;
    } else if(drapal.dataset.href) {
      window.location.href = drapal.dataset.href;
    }
  }
}

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
      if(e.button === 1 || e.ctrlKey) {
        e.preventDefault();
      }
    }, false);
    cell.addEventListener("mouseup", mouseup, false);
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
    topic.addEventListener("dblclick", dblclick, false);
  }
}
