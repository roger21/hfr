// ==UserScript==
// @name          [HFR] filtre images et smileys
// @version       1.1.0
// @namespace     roger21.free.fr
// @description   efface les avatars, les images et les smileys dans les posts et les remplace par des liens neurtres
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*/*-sujet_*_*.htm*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 240 $

// historique :
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
