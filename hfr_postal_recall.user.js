// ==UserScript==
// @name          [HFR] Postal Recall
// @version       1.4.3
// @namespace     roger21.free.fr
// @description   Rajoute le nom du posteur en bas sur la partie gauche des posts, permet de savoir qui est l'auteur du post sur les posts longs sans avoir à revenir en haut du post.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_postal_recall.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_postal_recall.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_postal_recall.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2015-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1590 $

// historique :
// 1.4.3 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 1.4.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 1.4.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.4.0 (29/11/2018) :
// - nouveau nom : [HFR] postal recall -> [HFR] Postal Recall
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// 1.3.2 (17/05/2018) :
// - suppression des @grant inutiles (tous)
// - maj de la metadata @homepageURL
// - passage de la hauteur minimal à 250
// 1.3.1 (28/11/2017) :
// - passage au https
// 1.3.0 (31/01/2016) :
// - meilleure gestion de la détection de la scrollbar horizontale
// - suppression des logs et du code commenté (nettoyage quoi)
// 1.2.0 (30/12/2015) :
// - meilleure gestion de la taille minimale pour l'ajout du recall
// - activation du script au lancement (pas seulement au scroll)
// 1.1.0 (29/12/2015) :
// - ajout d'une tempo (5sec) avant le lancement du script ->
// -> permet une meilleur gestion des zooms et de la présence ou non de la scrollbar
// 1.0.1 (27/12/2015) :
// - completement différent
// 0.9.0 (29/11/2015) :
// - création

window.setTimeout(function() {

  function getOffset(el) {
    let _x = 0;
    let _y = 0;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return {
      top: _y,
      left: _x
    };
  }

  function postalrecall(e) {
    scrollbar = document.documentElement.scrollWidth > document.documentElement.clientWidth ? scrollbarheight : 0;
    scrollcheat = scrollbar ? 1 : 0;
    if(oldprtop) {
      // oldprtop.style.display = "none";
      oldprtop.style.bottom = 0;
    }
    if(oldprbottom) {
      // oldprbottom.style.display = "none";
      oldprbottom.style.bottom = 0;
    }
    let postertop = document.elementFromPoint(posterleft, 0);
    if((postertop.nodeName.toUpperCase() === "TD") &&
      postertop.hasAttribute("class") &&
      (postertop.getAttribute("class") === "messCase1")) {
      let prtop = postertop.querySelector("div[postalrecall]");
      if(prtop) {
        // prtop.style.display = "block";
        oldprtop = prtop;
        if(((window.scrollY + window.innerHeight - scrollbar) >
            (getOffset(postertop).top + postertop.clientHeight)) ||
          ((window.scrollY + window.innerHeight - scrollbar) <
            (getOffset(postertop).top + minsize))) {
          prtop.style.bottom = 0;
        } else {
          prtop.style.bottom = ((getOffset(postertop).top + postertop.clientHeight) -
            (window.scrollY + window.innerHeight - scrollbar + scrollcheat)) + "px";
        }
      }
    }
    let posterbottom = document.elementFromPoint(posterleft, window.innerHeight - scrollbar - 1);
    if((posterbottom.nodeName.toUpperCase() === "TD") &&
      posterbottom.hasAttribute("class") &&
      (posterbottom.getAttribute("class") === "messCase1")) {
      let prbottom = posterbottom.querySelector("div[postalrecall]");
      if(prbottom) {
        // prbottom.style.display = "block";
        oldprbottom = prbottom;
        if(((window.scrollY + window.innerHeight - scrollbar) >
            (getOffset(posterbottom).top + posterbottom.clientHeight)) ||
          ((window.scrollY + window.innerHeight - scrollbar) <
            (getOffset(posterbottom).top + minsize))) {
          prbottom.style.bottom = 0;
        } else {
          prbottom.style.bottom = ((getOffset(posterbottom).top + posterbottom.clientHeight) -
            (window.scrollY + window.innerHeight - scrollbar + scrollcheat)) + "px";
        }
      }
    }
  }

  var messcase = false;
  var posterleft = 0;
  var oldprtop = null;
  var oldprbottom = null;
  var minsize = 250;
  var scrollbar = 0;
  var scrollcheat = 0;

  var scrolldiv = document.createElement("div");
  scrolldiv.style.width = "100px";
  scrolldiv.style.height = "100px";
  scrolldiv.style.overflow = "scroll";
  scrolldiv.style.position = "fixed";
  scrolldiv.style.top = "-9999px";
  scrolldiv.style.left = "-9999px";
  document.body.appendChild(scrolldiv);
  var scrollbarheight = scrolldiv.offsetHeight - scrolldiv.clientHeight;
  document.body.removeChild(scrolldiv);

  var posters = document.getElementById("mesdiscussions").querySelectorAll("table.messagetable td.messCase1");
  for(let poster of posters) {
    if(!messcase) {
      messcase = true;
    }
    if(!posterleft) {
      posterleft = getOffset(poster).left + 1;
    }
    if(poster.clientHeight > minsize) {
      poster.style.position = "relative";
      let pr_div = document.createElement("div");
      // pr_div.style.display = "none";
      pr_div.style.position = "absolute";
      pr_div.style.padding = "4px";
      pr_div.style.bottom = "0";
      pr_div.style.left = "0";
      pr_div.setAttribute("postalrecall", "postalrecall");
      let pr_b = document.createElement("b");
      pr_b.setAttribute("class", "s2");
      pr_b.appendChild(document.createTextNode(poster.querySelector("div > b.s2").textContent));
      pr_div.appendChild(pr_b);
      poster.appendChild(pr_div);
    }
  }

  if(messcase) {
    window.addEventListener("scroll", postalrecall, false);
    postalrecall();
  }

}, 5000);
