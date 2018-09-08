// ==UserScript==
// @name          rehost upload
// @version       1.3.0
// @namespace     roger21.free.fr
// @description   remplace les liens vers la page de visualisation par des liens vers l'image pleine taille dans le bbcode des images uploadées
// @icon          http://reho.st/self/f87acf6712efa617e6edcd330fdc1f6c0d34a086.png
// @include       http://reho.st/upload
// @include       https://reho.st/upload
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 240 $

// historique :
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
