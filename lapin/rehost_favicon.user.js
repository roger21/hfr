// ==UserScript==
// @name          Rehost Favicon
// @version       1.5.4
// @namespace     roger21.free.fr
// @description   Rajoute une icône au site reho.st.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAA3UlEQVR42mP4T2PAMGoBSRYwYABMceJFBs4CigJkgC2gQpQOsAWUBxFRyRRNxYV77xbvu7%2F55JMfP%2F9sOvFkyb57W08%2FpaYFQNPda%2FeHtB12qd7nWLEHSE7YcJ2aQQSxAIgS%2B4%2Bfuvlm3dFH7z79%2FPfvH9UiGWKBY%2BXe33%2F%2B4jKXChakTDxJq1QEsSBt8klapSJMC%2BABRTDEyLTg8ePHXGAAZNAkiBobGyEqgQwqRPLcnXesS3bH9hxD9gEnGJDsA%2FwAM%2Bgx42BQlkWDy4LBUWVSUt0PtAWjTccBsQAADls0nT6oOB0AAAAASUVORK5CYII%3D
// @include       http://reho.st/*
// @include       https://reho.st/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/rehost_favicon.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/rehost_favicon.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/rehost_favicon.user.js
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
// 1.5.4 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 1.5.3 (11/01/2020) :
// - retour à une image en data:image
// 1.5.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 1.5.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.5.0 (28/11/2018) :
// - nouveau nom : rehost icone -> Rehost Favicon
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// 1.4.0 (26/05/2018) :
// - améliorations du code et check du code dans tm
// - compression de l'icône (pngoptimizer) et passage au https
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.3.2 (31/03/2018) :
// - ajout du https
// 1.3.1 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.3.0 (19/01/2015) :
// - changement de nom et changement d'icone
// - suppression du support pour hfr-rehost.net
// - changement de l'icone du script
// 1.2.3 (08/09/2014) :
// - repassage à reho.st (au lieu de free.fr) pour l'hebergement des images et icones utilisés par le script
// 1.2.2 (14/05/2014) :
// - repassage à free.fr (au lieu de reho.st) pour l'hebergement des images et icones utilisés par le script
// 1.2.1 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.2.0 (18/03/2014) :
// - conversion de l'icone en png
// - utilisation de reho.st pour l'heberger (au lieu de roger21.free.fr)
// - ajout de l'attribut type dans l'element link
// - maj des metadata @grant et indentation des metadata
// 1.1.0 (10/10/2013) :
// - ajout de l'include en http://reho.st/
// 1.0.0 (10/10/2013) :
// - première mouture (avec tous les bugs qui vont bien :o)

var head = document.getElementsByTagName("head")[0];
if(head) {
  var link = document.createElement("link");
  link.setAttribute("rel", "icon");
  link.setAttribute("type", "image/png");
  link.setAttribute("href", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuklEQVR42u2XTUsCYRCAtaMdpLOeFeyHRCR16lB066jXIIIi7CBEEEGRXYpOQXSIiqBDWqFSCH3tCuUxqtsaBJG6rdNMjKHruom7rgb7wgMy7M4874fLvA6HPaoGADgRF%2BJBfEjAJPyck3I79Yr3IUPIOpJC7hHRIALninFuqtGjJeDiB04RCSkhZZOQkTwS5xouLQEPz1zil9ox8rwSXi0BHy%2BVDO0blDvNZ8KpFgjwnv%2FOfmA2UcPq4SMUZQUOLp9havMGRqNJGJxLQHD%2BDMYWU7C8%2F9CMhMC1NAVEPYGZ7TuYXLmqi1c4zrw0I5BF%2BlsS0GMcV6CEq2OZwPTWLawd5SCyI8DIwgXsJZ%2BaPQfGBIYj55DJSTUZ3z9K8Fn8skbg5PrV6D%2BhdYGJpTQoSrlzAtHdrBnfgtYF6DtgC9gCXS1QKBQgHA6D2%2B3%2BgX5TzDKBUCgElKoailkmQLNWC1DsXwkIRgRoz9UCFFMNsVFDUteSteEQ6rZkHm4YO9aUVtryOD9oZnNKzcIbkkCCSO9fF5MYL5XAh8YIIufa4OLaFxPV1czL%2BxTgE2sUP%2BdsfDVrIGMaXXsh%2FgYxMyaxXsAjHwAAAABJRU5ErkJggg%3D%3D");
  head.appendChild(link);
}
