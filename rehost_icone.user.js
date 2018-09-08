// ==UserScript==
// @name          rehost icone
// @version       1.4.0
// @namespace     roger21.free.fr
// @description   ajoute une icone au site reho.st
// @icon          http://reho.st/self/f87acf6712efa617e6edcd330fdc1f6c0d34a086.png
// @include       http://reho.st/*
// @include       https://reho.st/*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 240 $

// historique :
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
  link.setAttribute("href", "https://reho.st/self/6d50ea2e126c2b5ec77dc28e0afcafddf9dbf70f.png");
  head.appendChild(link);
}
