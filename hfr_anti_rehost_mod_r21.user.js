// ==UserScript==
// @name          [HFR] Anti Rehost mod_r21
// @version       2.4.4
// @namespace     roger21.free.fr
// @description   Supprime le réhostage des images quand c'est possible (utile quand reho.st est innaccessible).
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    mycrub
// @modifications Gestion du passage à reho.st et au https, gestion de toutes les adresses possibles et traitement des liens en plus des images.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_anti_rehost_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_anti_rehost_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_anti_rehost_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2012-2015, 2017-2020 roger21@free.fr

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
// 2.4.4 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// - correction pour la prise en compte des urls uploadées pour les gifs (à ne pas dé-rého.ster)
// 2.4.3 (11/02/2020) :
// - correction des regexp pour exclure les urls brutes (i.e. sans contenu)
// 2.4.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 2.4.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.4.0 (29/11/2018) :
// - nouveau nom : [HFR] anti rehost mod_r21 -> [HFR] Anti Rehost mod_r21
// - ajout de l'avis de licence AGPL v3+ *si mycrub est d'accord*
// - ajout de la metadata @author (roger21)
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (mycrub)
// - réécriture des metadata @description, @modifications et @modtype
// 2.3.0 (26/05/2018) :
// - simplification et restylage du code et check du code dans tm
// - suppression du code de replacement qui n'a jamais servi
// - suppression des @grant inutiles (tous)
// - maj de la metadata @homepageURL
// 2.2.0 (06/12/2017) :
// - ajout des urls en https pour reho.st
// - suppression de la gestion de hfr-rehost.net
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 2.1.1 (28/11/2017) :
// - passage au https
// 2.1.0 (22/11/2015) :
// - nouveau nom : [HFR] Anti Rehost mod_r21 -> [HFR] anti rehost mod_r21
// 2.0.0 (21/11/2015) :
// - ajout du support des formats "medium" de reho.st
// - ajout du traitement des liens en plus des images
// - légères modifications du code
// - légères modifications des logs (commentés)
// - nouveau numéro de version : 1.0.8 -> 2.0.0
// - nouveau nom : [HFR] Anti Rehost -> [HFR] Anti Rehost mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.0.8 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.7 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.6 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.0.5 (10/10/2013) :
// - prise en compte des liens en http://reho.st/
// - gestion d'un truc pas clair sur la conversion (par le forum) des urls qui contiennent http
// - gestion du changement de format des urls d'images uploadés de /http://self/ en /self/
// 1.0.4 (14/09/2012) :
// - ajout des metadata @grant
// 1.0.1 à 1.0.3 (10/01/2012) :
// - prise en compte du self (ne fait rien dans ce cas)
// - prise en compte effective du preview et du thumb
// - suppression du remplacement (y'en a pas qui existe)
// - mise en commentaire du log
// - restylage du code
// - reformulation de la description
// - ajout d'une version 1.0 avec un .1 en plus

var rehost = [
  "http://reho.st/medium/(?:https?://)?self/",
  "http://reho.st/preview/(?:https?://)?self/",
  "http://reho.st/thumb/(?:https?://)?self/",
  "http://reho.st/view/(?:https?://)?self/",
  "http://reho.st/view/gif/",
  "http://reho.st/fullview/(?:https?://)?self/",
  "http://reho.st/fullsize/(?:https?://)?self/",
  "http://reho.st/gif/",
  "http://reho.st/(?:https?://)?self/",
  "https://reho.st/medium/(?:https?://)?self/",
  "https://reho.st/preview/(?:https?://)?self/",
  "https://reho.st/thumb/(?:https?://)?self/",
  "https://reho.st/view/(?:https?://)?self/",
  "https://reho.st/view/gif/",
  "https://reho.st/fullview/(?:https?://)?self/",
  "https://reho.st/fullsize/(?:https?://)?self/",
  "https://reho.st/gif/",
  "https://reho.st/(?:https?://)?self/",
  "http://reho.st/medium/",
  "http://reho.st/preview/",
  "http://reho.st/thumb/",
  "http://reho.st/view/",
  "http://reho.st/fullview/",
  "http://reho.st/fullsize/",
  "http://reho.st/",
  "https://reho.st/medium/",
  "https://reho.st/preview/",
  "https://reho.st/thumb/",
  "https://reho.st/view/",
  "https://reho.st/fullview/",
  "https://reho.st/fullsize/",
  "https://reho.st/",
];

var rehost_not_rehost_limit = 18;

var imgs = document.querySelectorAll("td.messCase2 > div[id^='para'] img");
for(let img of imgs) {
  let src = img.src;
  for(let j = 0; j < rehost.length; ++j) {
    if(src && src.match("^" + rehost[j] + ".+")) {
      //console.log(rehost[j] + " matches old img.src " + src);
      if(j < rehost_not_rehost_limit) {
        break;
      }
      let new_src = src.substring(rehost[j].length);
      if(!new_src.match("^https?://")) {
        new_src = "http://" + new_src;
      }
      img.setAttribute("src", new_src);
      img.setAttribute("alt", new_src);
      img.setAttribute("title", new_src);
      //console.log(rehost[j] + " new img.src " + new_src);
      break;
    }
  }
}

var links = document.querySelectorAll("td.messCase2 > div[id^='para'] a");
for(let link of links) {
  let href = link.href;
  for(let j = 0; j < rehost.length; ++j) {
    if(href && href.match("^" + rehost[j] + ".+")) {
      //console.log(rehost[j] + " matches old link.href " + href);
      if(j < rehost_not_rehost_limit) {
        break;
      }
      let new_href = href.substring(rehost[j].length);
      if(!new_href.match("^https?://")) {
        new_href = "http://" + new_href;
      }
      link.setAttribute("href", new_href);
      if(link.textContent && link.textContent.match("^" + rehost[j] + ".+")) {
        link.textContent = link.textContent.substring(rehost[j].length);
      }
      //console.log(rehost[j] + " new link.href " + new_href);
      break;
    }
  }
}
