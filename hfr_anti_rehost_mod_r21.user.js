// ==UserScript==
// @name          [HFR] Anti Rehost mod_r21
// @version       2.4.3
// @namespace     roger21.free.fr
// @description   Supprime le réhostage des images quand c'est possible (utile quand reho.st est innaccessible).
// @icon          http://roger21.free.fr/sav/roger21_hfr.png
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    mycrub
// @modifications Gestion du passage à reho.st et au https, gestion de toutes les adresses possibles et traitement des liens en plus des images.
// @modtype       réécriture et évolutions
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

// $Rev: 1578 $

// historique :
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
  "http://reho.st/fullview/(?:https?://)?self/",
  "http://reho.st/fullsize/(?:https?://)?self/",
  "http://reho.st/(?:https?://)?self/",
  "https://reho.st/medium/(?:https?://)?self/",
  "https://reho.st/preview/(?:https?://)?self/",
  "https://reho.st/thumb/(?:https?://)?self/",
  "https://reho.st/view/(?:https?://)?self/",
  "https://reho.st/fullview/(?:https?://)?self/",
  "https://reho.st/fullsize/(?:https?://)?self/",
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
  "https://reho.st/"
];

var rehost_not_rehost_limit = 14;

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
