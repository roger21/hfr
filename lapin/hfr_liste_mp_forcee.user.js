// ==UserScript==
// @name          [HFR] Liste MP forcée
// @version       0.9.0
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @namespace     roger21.free.fr
// @description   remplace le lien "Vous avez 1 nouveau message privé" par le lien générique de la page des messages privés, au lieu d'ouvrir directement un éventuel MP non lu.
// @include       https://forum.hardware.fr/*
// @noframes
// ==/UserScript==
 

// historique :
// 0.9.0 (09/03/2018) :
// - création
 

var element = document.querySelector("table > tbody > tr > td > .left > .left > a" );
if (element != null)
 element.setAttribute ("href", "https://forum.hardware.fr/forum1.php?config=hfr.inc&cat=prive&page=1&subcat=&sondage=0&owntopic=0&trash=0&trash_post=0&moderation=0&new=0&nojs=0&subcatgroup=0" );
