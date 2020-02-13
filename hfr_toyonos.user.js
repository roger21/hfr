// ==UserScript==
// @name          [HFR] Toyonos
// @version       2.3.3
// @namespace     roger21.free.fr
// @description   T.oYonos écrit en lettres d'or.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_toyonos.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_toyonos.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_toyonos.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2014-2020 roger21@free.fr

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
// 2.3.3 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.3.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 2.3.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.3.0 (29/11/2018) :
// - nouveau nom : [HFR] toyonos -> [HFR] Toyonos
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// - correction d'une boulette (code de test non enlevé)
// 2.2.0 (26/05/2018) :
// - améliorations et compactage du code et check du code dans tm
// - gestion plus propre et plus homogène de tous les cas
// - gestion plus propre et complète de tous les types de citations
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 2.1.1 (28/11/2017) :
// - passage au https
// 2.1.0 (30/01/2016) :
// - ajout du support pour les citations
// - ajout de commentaires dans le code -__-
// 2.0.2 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 2.0.1 (28/04/2014) :
// - nouvelle description
// 2.0.0 (02/04/2014) :
// - ajout de la gestion des tableaux de topics
// - ajout de la gestion de la casse
// - changement du nom du script (t.oyonos -> [HFR] toyonos)
// - ajout de la version, de la description et de l'historique (avec dates)
// - maj des metadata @grant avec une icone
// - meilleur javascript

function addSpan(elt, before = false) {
  let span = document.createElement("span");
  span.textContent = "T.oYonos";
  span.style.color = "gold";
  if(before) {
    elt.insertBefore(span, elt.firstChild);
  } else {
    elt.appendChild(span);
  }
}

// pseudals des messages dans les topics,
// psudals des auteurs des topics dans les tableaux des topics
// psudals des auteurs des derniers messages dans les tableaux des topics
var pseudals1 = document.querySelectorAll("b.s2, a.Tableau, a.Tableau > b");
for(var pseudal of pseudals1) {
  if(pseudal.textContent.toLowerCase() === "toyonos") {
    pseudal.textContent = "";
    addSpan(pseudal);
  }
}
// psudals des auteurs des derniers messages dans le tableaux des cats de la racine
var pseudals2 = document.querySelectorAll("td.catCase3 > b");
for(let pseudal of pseudals2) {
  if(pseudal.textContent.toLowerCase() === "par toyonos") {
    pseudal.textContent = "par ";
    addSpan(pseudal);
  }
}
// pseudals des citations, oldcitations, fakecitations et citations avec nom dans les topics
var pseudals3 = document.querySelectorAll("table.citation b.s1 a, table.oldcitation b.s1 a, table.citation b.s1, table.oldcitation b.s1");
for(let pseudal of pseudals3) {
  if(pseudal.firstElementChild === null && pseudal.textContent.toLowerCase().indexOf("toyonos ") === 0) {
    pseudal.textContent = pseudal.textContent.substr(7);
    addSpan(pseudal, true);
  }
}
