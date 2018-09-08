// ==UserScript==
// @name          [HFR] ego quote
// @version       0.9.4
// @namespace     roger21.free.fr
// @description   colore en bleu les posts contenant une citation de soi
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*/*-sujet_*_*.htm*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 206 $

// historique :
// 0.9.4 (17/05/2018) :
// - simplifications et améliorations du code et check du code dans tm
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - amélioration des @include (page des topics uniquement)
// - maj de la metadata @homepageURL
// - version compressée de l'icône du script
// 0.9.3 (28/11/2017) :
// - passage au https
// 0.9.2 (27/09/2015) :
// - correction de l'icone (hfr au lieu de l'icone neutre roger21)
// - correction de la description pour correspondre à la couleur (by BrisChri)
// 0.9.1 (18/09/2015) :
// - meilleure detection du pseudal pour éviter les faux positifs
// 0.9.0 (17/09/2015) :
// - création sur une idée de BrisChri

if(document.forms && document.forms.namedItem("hop") && document.forms.namedItem("hop").elements.namedItem("pseudo")) {
  let pseudal = document.forms.namedItem("hop").elements.namedItem("pseudo").value.trim();
  if(pseudal !== "") {
    let quotes = document.querySelectorAll("div.container > table.oldcitation > tbody > tr.none > td > b.s1 > a.Topic, " +
      "div.container > table.citation > tbody > tr.none > td > b.s1 > a.Topic, " +
      "div.container > table.oldcitation > tbody > tr.none > td > b.s1");
    for(let quote of quotes) {
      if(quote.textContent.indexOf(pseudal + " a écrit") === 0) {
        let parent = quote.parentElement;
        while(parent) {
          if(parent.nodeName.toUpperCase() === "TR" && parent.classList.contains("message")) {
            parent.style.backgroundColor = "#bdf6f6"; // bleu pale a tendence fluo by BrisChri
            break;
          }
          parent = parent.parentElement;
        }
      }
    }
  }
}
