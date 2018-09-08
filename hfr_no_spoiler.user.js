// ==UserScript==
// @name          [HFR] no spoiler
// @version       1.1.0
// @namespace     roger21.free.fr
// @description   affiche le contenu des spoilers par défaut
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 240 $

// historique :
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
