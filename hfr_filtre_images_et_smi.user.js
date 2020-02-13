// ==UserScript==
// @name          [HFR] Filtre images et smileys
// @version       1.2.3
// @namespace     roger21.free.fr
// @description   Efface les avatars, les images et les smileys dans les posts et les remplace par des liens neutres.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*/*-sujet_*_*.htm*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_filtre_images_et_smi.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_filtre_images_et_smi.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_filtre_images_et_smi.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2012, 2014-2015, 2017-2020 roger21@free.fr

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
// - nouveau nom : [HFR] filtre images et smileys -> [HFR] Filtre images et smileys
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// 1.1.0 (26/05/2018) :
// - simplification du code et check du code dans tm
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - amélioration des @include
// 1.0.7 (24/03/2018) :
// - ajustement de la description pour la publication
// 1.0.6 (13/02/2018) :
// - passage au https
// 1.0.5 (28/07/2017) :
// - prise en compte des urls verbeuses pour les topics sans sous-cat
// 1.0.4 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.3 (27/03/2014) :
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.2 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.0.1 (14/09/2012) :
// - ajout des metadata @grant

var images = document.querySelectorAll("td.messCase2 > div[id^=\"para\"] img");
for(let image of images) {
  let link = document.createElement("a");
  link.style.color = "gray";
  link.style.textDecoration = "none";
  link.setAttribute("href", image.src);
  link.appendChild(document.createElement("strong"));
  if(/^https:\/\/forum-images\.hardware\.fr\/.*$/.test(image.src)) {
    link.firstElementChild.appendChild(document.createTextNode(image.alt));
  } else {
    link.setAttribute("title", image.src);
    link.firstElementChild.appendChild(document.createTextNode("[IMAGE]"));
  }
  image.parentNode.replaceChild(link, image);
}
var avatars = document.querySelectorAll("td.messCase1 > div.avatar_center > img");
for(let avatar of avatars) {
  let link = document.createElement("a");
  link.style.color = "gray";
  link.style.textDecoration = "none";
  link.style.fontSize = "small";
  link.setAttribute("href", avatar.src);
  link.appendChild(document.createElement("strong"));
  link.firstElementChild.appendChild(document.createTextNode("[AVATAR]"));
  avatar.parentNode.replaceChild(link, avatar);
}
