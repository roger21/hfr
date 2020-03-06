// ==UserScript==
// @name          [HFR] Old Favicon
// @version       1.3.5
// @namespace     roger21.free.fr
// @description   Remplace l'icône du forum et du site par le précédent en noir et blanc.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAAAg0lEQVR42sWTXQ6AIAyDe%2F9T9WYYtoljbiIvSuIf%2FbK1CGiLgY8AyNDnfH8PpMU3gMLeDaB6AXU%2BtuApyoUQU12T8sWmVSJgc0MPLax312lvaQrRUcfsPkatZKEAlzSYvEQvR4AuTdJCw7Fe6hWAGvC%2Fe3L4vB%2BWwN6Wy7bsDvDz2TwAMXIqGblpZe4AAAAASUVORK5CYII%3D
// @include       http://forum.hardware.fr/*
// @include       https://forum.hardware.fr/*
// @include       http://www.hardware.fr/*
// @include       https://www.hardware.fr/*
// @exclude       http://shop.hardware.fr/*
// @exclude       https://shop.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_old_favicon.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_old_favicon.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_old_favicon.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
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

// $Rev: 1705 $

// historique :
// 1.3.5 (06/03/2020) :
// - double installation du favicon, avec et sans tempo pour une meilleur efficacité
// 1.3.4 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// - ajout d'une fausse tempo pour forcer la mise-à-jour du favicon (good ol' javascript trick)
// 1.3.3 (11/01/2020) :
// - retour à une image en data:image
// 1.3.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 1.3.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.3.0 (29/11/2018) :
// - nouveau nom : [HFR] old favicon -> [HFR] Old Favicon
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// 1.2.0 (26/05/2018) :
// - améliorations et nettoyage du code et check du code dans tm
// - retour à reho.st en https au lieu du data:image
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.1.0 (09/12/2017) :
// - réécriture des règles include / exclude
// 1.0.10 (06/12/2017) :
// - inclusion de www.hardware.fr (en http)
// - exclusion du shop en https
// 1.0.9 (28/11/2017) :
// - passage au https
// 1.0.8 (04/08/2016) :
// - compression de l'image de l'icone (pngoptimizer)
// - utilisation d'une image en url:data au lieu d'un lien pour l'icone
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.0.7 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.6 (08/09/2014) :
// - repassage à reho.st (au lieu de free.fr) pour l'hebergement des images et icones utilisés par le script
// 1.0.5 (14/05/2014) :
// - repassage à free.fr (au lieu de reho.st) pour l'hebergement des images et icones utilisés par le script
// 1.0.4 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.3 (18/03/2014) :
// - conversion de l'icone en png
// - utilisation de reho.st pour l'heberger (au lieu de roger21.free.fr)
// - modification de l'attribut type en accord
// - maj des metadata @grant et indentation des metadata
// 1.0.2 (15/03/2014) :
// - changement du chemin de l'icone
// 1.0.1 (14/09/2012) :
// - ajout des metadata @grant

function favicon(){
  var head = document.getElementsByTagName("head")[0];
  if(head) {
    var link = document.createElement("link");
    link.setAttribute("rel", "icon");
    link.setAttribute("type", "image/png");
    link.setAttribute("href", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAT0lEQVR42nWOiw3AQAhC2X8qNrN%2BwKZ3qYkmTxFFHIFMYoLFECZ0asQWM5lSLod3i9lLsfNUxzbKR9bivYwX9IhtfQ1jqPLTwKXwI9%2BG4wEGx6xs3T841gAAAABJRU5ErkJggg%3D%3D");
    head.appendChild(link);
  }
}
favicon();
window.setTimeout(favicon, 1);
