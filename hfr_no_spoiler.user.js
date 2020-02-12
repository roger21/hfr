// ==UserScript==
// @name          [HFR] No Spoiler
// @version       1.2.2
// @namespace     roger21.free.fr
// @description   Affiche le contenu des spoilers par défaut.
// @icon          https://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2014-2015, 2017-2019 roger21@free.fr

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
// 1.2.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 1.2.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.2.0 (29/11/2018) :
// - nouveau nom : [HFR] no spoiler -> [HFR] No Spoiler
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// 1.1.0 (26/05/2018) :
// - check du code dans tm
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.0.3 (28/11/2017) :
// - passage au https
// 1.0.2 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.1 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.0 (18/03/2014) :
// - clarification de le description
// - ajout de l'historique
// - maj des metadata @grant
// 0.9.0 (04/02/2014) :
// - création

var spoilers = document.querySelectorAll("div.Topic.masque");
for(let spoiler of spoilers) {
  spoiler.style.visibility = "visible";
}
