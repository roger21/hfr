// ==UserScript==
// @name          [HFR] Postal Recall
// @version       3.0.0
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
// @require       https://github.com/w3c/IntersectionObserver/raw/main/polyfill/intersection-observer.js
// ==/UserScript==

/*

Copyright © 2015-2022 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 3465 $

// historique :
// 3.0.0 (06/02/2022) :
// - ajout d'options en dur pour la position et l'affichage du nom rajouté
// 2.0.0 (23/03/2021) :
// - recodage en css position sticky
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

/* -------------- */
/* options en dur */
/* -------------- */

// position du nom rajouté par rapport au bas de la page (défaut : 4) :
// - soit "center" (avec les "") pour centrer verticalement le pseudo sur la page
// - soit un nombre de pixels (exemple : 30)
const position_page = 4;

// position du nom rajouté par rapport au bas des messages (défaut : 4) :
// un nombre de pixels (exemple : 30)
const position_bottom = 4;

// toujours afficher le nom rajouté (true ou false, défaut : true) :
// - à true le nom rajouté est toujours présent si le message est assez haut
// - à false le nom rajouté disparait quand le nom d'en haut apparaît complètement
const always_display = true;

// ajouter un effet de transition pour l'affichage du nom rajouté (true ou false, défaut : false) :
// n'est pris en compte que si always_display est à false
// - à true le nom rajouté passe progressivement d'un état à l'autre (visible ou invisible)
// - à false le nom rajouté disparaît et apparaît immédiatement
const smooth_display = false;

/* ---- */
/* code */
/* ---- */

function pseudal_recall(pseudals) {
  pseudals.forEach(pseudal => {
    if(pseudal.intersectionRatio === 1) {
      pseudal.target.parentElement.parentElement.querySelector("div[postalrecall]").style.opacity = "0";
    } else {
      pseudal.target.parentElement.parentElement.querySelector("div[postalrecall]").style.opacity = "1";
    }
  });
}

let l_observer = new IntersectionObserver(pseudal_recall, {
  root: null,
  threshold: 1
});

window.setTimeout(function() {
  var posters = document.getElementById("mesdiscussions").querySelectorAll("table.messagetable td.messCase1");
  for(let poster of posters) {
    if(poster.clientHeight > 196 + position_bottom) {
      poster.style.position = "relative";
      if(!always_display) {
        l_observer.observe(poster.querySelector("div > b.s2"));
      }
      let pr_div = document.createElement("div");
      pr_div.setAttribute("postalrecall", "postalrecall");
      pr_div.style.position = "absolute";
      pr_div.style.padding = "0 0 " + position_bottom + "px 4px";
      pr_div.style.bottom = "0";
      pr_div.style.left = "0";
      pr_div.style.boxSizing = "border-box";
      pr_div.style.height = "calc(100% - 180px)";
      if(!always_display) {
        pr_div.style.opacity = "0";
        if(smooth_display) {
          pr_div.style.transition = "opacity 0.3s ease 0s";
        }
      }
      if(position_page !== "center") {
        pr_div.style.display = "flex";
        pr_div.style.flexDirection = "column";
        pr_div.style.justifyContent = "flex-end";
      }
      let pr_b = document.createElement("b");
      pr_b.setAttribute("class", "s2");
      pr_b.style.position = "sticky";
      if(position_page === "center") {
        pr_b.style.top = "50%";
      } else {
        pr_b.style.bottom = position_page + "px";
      }
      pr_b.appendChild(document.createTextNode(poster.querySelector("div > b.s2").textContent));
      pr_div.appendChild(pr_b);
      poster.appendChild(pr_div);
    }
  }
}, 5000);
