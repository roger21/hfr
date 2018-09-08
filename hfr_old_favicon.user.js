// ==UserScript==
// @name          [HFR] old favicon
// @version       1.2.0
// @namespace     roger21.free.fr
// @description   remplace l'icone du forum et de hardware.fr par le precedent en noir et blanc
// @icon          http://reho.st/self/31635c0818281a71f4412f0a9b63118f8658bfd4.png
// @include       http://forum.hardware.fr/*
// @include       https://forum.hardware.fr/*
// @include       http://www.hardware.fr/*
// @include       https://www.hardware.fr/*
// @exclude       http://shop.hardware.fr/*
// @exclude       https://shop.hardware.fr/*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 240 $

// historique :
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

var head = document.getElementsByTagName("head")[0];
if(head) {
  var link = document.createElement("link");
  link.setAttribute("rel", "icon");
  link.setAttribute("type", "image/png");
  link.setAttribute("href", "https://reho.st/self/5c2bc8d0fd9b7b5f2437e2cf84e89cb33c4e9c10.png");
  head.appendChild(link);
}
