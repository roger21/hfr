// ==UserScript==
// @name          Rehost Upload BBCode
// @version       1.4.3
// @namespace     roger21.free.fr
// @description   Remplace les liens vers la page de visualisation par des liens vers l'image pleine taille dans le BBCode des images uploadées sur reho.st.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAA3UlEQVR42mP4T2PAMGoBSRYwYABMceJFBs4CigJkgC2gQpQOsAWUBxFRyRRNxYV77xbvu7%2F55JMfP%2F9sOvFkyb57W08%2FpaYFQNPda%2FeHtB12qd7nWLEHSE7YcJ2aQQSxAIgS%2B4%2Bfuvlm3dFH7z79%2FPfvH9UiGWKBY%2BXe33%2F%2B4jKXChakTDxJq1QEsSBt8klapSJMC%2BABRTDEyLTg8ePHXGAAZNAkiBobGyEqgQwqRPLcnXesS3bH9hxD9gEnGJDsA%2FwAM%2Bgx42BQlkWDy4LBUWVSUt0PtAWjTccBsQAADls0nT6oOB0AAAAASUVORK5CYII%3D
// @include       http://reho.st/upload
// @include       https://reho.st/upload
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/rehost_upload_bbcode.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/rehost_upload_bbcode.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/rehost_upload_bbcode.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2013-2015, 2018-2020 roger21@free.fr

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
// 1.4.0 (28/11/2018) :
// - nouveau nom : rehost upload -> Rehost Upload BBCode
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// 1.3.0 (26/05/2018) :
// - améliorations du code et check du code dans tm
// - ajout de la gestion des gif
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.2.2 (31/03/2018) :
// - ajout du https
// 1.2.1 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.2.0 (19/01/2015) :
// - changement de nom
// - suppression du support pour hfr-rehost.net
// - changement de l'icone du script
// 1.1.2 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.1.1 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.1.0 (10/10/2013) :
// - ajout de l'include en http://reho.st/
// 1.0.0 (14/09/2013) :
// - première mouture (avec tous les bugs qui vont bien :o)

var codes = document.querySelectorAll("div#maincontent div code");
for(let code of codes) {
  code.textContent = code.textContent.replace("/view/gif/", "/gif/");
  code.textContent = code.textContent.replace("/view/self/", "/self/");
}
