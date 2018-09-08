// ==UserScript==
// @name          [HFR] hide drapal menu
// @version       1.1.0
// @namespace     roger21.free.fr
// @description   fait disparaitre le menu de réinitialisation des drapeaux
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 240 $

// historique :
// 1.1.0 (26/05/2018) :
// - check du code dans tm et restylage du code
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.0.5 (28/11/2017) :
// - passage au https
// 1.0.4 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.3 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.2 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.0.1 (14/09/2012) :
// - ajout des metadata @grant

var menu = document.getElementById("onglet_menu5");
if(menu) {
  var hide = menu.querySelector("a:nth-of-type(3)");
  if(hide) {
    hide.style.display = "none";
  }
}
