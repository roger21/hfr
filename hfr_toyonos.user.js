// ==UserScript==
// @name          [HFR] toyonos
// @version       2.2.0
// @namespace     roger21.free.fr
// @description   T.oYonos écrit en lettres d'or :o
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 240 $

// historique :
// 2.2.0 (26/05/2018) :
// - améliorations et compactage du code et check du code dans tm
// - gestion plus propre et plus homogène de tous les cas
// - gestion plus propre et complète de tous les types de citations
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 2.1.1 (28/11/2017) :
// - passage au https
// 2.1.0 (30/01/2016) :
// - ajout du support pour les citations
// - ajout de commentaires dans le code -__-
// 2.0.2 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 2.0.1 (28/04/2014) :
// - nouvelle description
// 2.0.0 (02/04/2014) :
// - ajout de la gestion des tableaux de topics
// - ajout de la gestion de la casse
// - changement du nom du script (t.oyonos -> [HFR] toyonos)
// - ajout de la version, de la description et de l'historique (avec dates)
// - maj des metadata @grant avec une icone
// - meilleur javascript

function addSpan(elt, before = false) {
  let span = document.createElement("span");
  span.textContent = "T.oYonos";
  span.style.color = "gold";
  if(before) {
    elt.insertBefore(span, elt.firstChild);
  } else {
    elt.appendChild(span);
  }
}

// pseudals des messages dans les topics,
// psudals des auteurs des topics dans les tableaux des topics
// psudals des auteurs des derniers messages dans les tableaux des topics
var pseudals1 = document.querySelectorAll("b.s2, a.Tableau, a.Tableau > b");
for(var pseudal of pseudals1) {
  if(pseudal.textContent.toLowerCase() === "toyonos") {
    pseudal.textContent = "";
    addSpan(pseudal);
  }
}
// psudals des auteurs des derniers messages dans le tableaux des cats de la racine
var pseudals2 = document.querySelectorAll("td.catCase3 > b");
for(let pseudal of pseudals2) {
  if(pseudal.textContent.toLowerCase() === "par mjules") {
    pseudal.textContent = "par ";
    addSpan(pseudal);
  }
}
// pseudals des citations, oldcitations, fakecitations et citations avec nom dans les topics
var pseudals3 = document.querySelectorAll("table.citation b.s1 a, table.oldcitation b.s1 a, table.citation b.s1, table.oldcitation b.s1");
for(let pseudal of pseudals3) {
  if(pseudal.firstElementChild === null && pseudal.textContent.toLowerCase().indexOf("toyonos ") === 0) {
    pseudal.textContent = pseudal.textContent.substr(7);
    addSpan(pseudal, true);
  }
}
