// ==UserScript==
// @name          [HFR] Profil gauche droite
// @version       1.2.3
// @namespace     roger21.free.fr
// @description   Ajoute des flèches de navigation sur la page des profils.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/hfr/profil*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_profil_gauche_droite.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_profil_gauche_droite.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_profil_gauche_droite.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2013-2015, 2017-2020 roger21@free.fr

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
// 1.2.3 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 1.2.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 1.2.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.2.0 (29/11/2018) :
// - nouveau nom : [HFR] profil gauche droite -> [HFR] Profil gauche droite
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// 1.1.0 (26/05/2018) :
// - restylage et améliorations du code et check du code dans tm
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.0.5 (06/04/2018) :
// - remplacement des window.location par des window.location.href pour plus de clarté
// 1.0.4 (28/11/2017) :
// - passage au https
// 1.0.3 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.2 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.1 (18/03/2014) :
// - modification de le description
// - maj des metadata @grant et indentation des metadata
// 1.0.0 (01/10/2013) :
// - première mouture (avec tous les bugs qui vont bien :o)

var profil = /profil-([0-9]+)\.htm/.exec(window.location.href);
if(profil) {
  profil = parseInt(profil[1]);
  var profil_gauche = profil - 1 < 0 ? 0 : profil - 1;
  var profil_droite = profil + 1;
  var gauche = document.createElement("a");
  gauche.setAttribute("href", "https://forum.hardware.fr/hfr/profil-" + profil_gauche + ".htm");
  gauche.textContent = "<<";
  gauche.style.display = "block";
  gauche.style.position = "absolute";
  gauche.style.left = "10px";
  gauche.style.top = "0";
  var droite = document.createElement("a");
  droite.setAttribute("href", "https://forum.hardware.fr/hfr/profil-" + profil_droite + ".htm");
  droite.textContent = ">>";
  droite.style.display = "block";
  droite.style.position = "absolute";
  droite.style.right = "10px";
  droite.style.top = "0";
  var div = document.querySelector("div.container > div#mesdiscussions");
  var h4 = div.querySelector("h4.Ext");
  if(h4) {
    var new_h4 = document.createElement("h4");
    new_h4.setAttribute("class", "Ext");
    new_h4.style.position = "relative";
    new_h4.appendChild(gauche);
    new_h4.appendChild(document.createTextNode(h4.textContent));
    new_h4.appendChild(droite);
    div.replaceChild(new_h4, h4);
  } else {
    var hop = div.querySelector("div.hop");
    if(hop) {
      var new_hop = document.createElement("div");
      new_hop.setAttribute("class", "hop");
      new_hop.style.position = "relative";
      new_hop.appendChild(gauche);
      new_hop.appendChild(document.createTextNode(hop.firstChild.nodeValue));
      new_hop.appendChild(droite);
      new_hop.appendChild(document.createElement("br"));
      new_hop.appendChild(document.createElement("br"));
      new_hop.appendChild(div.querySelector("a.Topic"));
      div.replaceChild(new_hop, hop);
    }
  }
}
