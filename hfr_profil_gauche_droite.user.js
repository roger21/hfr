// ==UserScript==
// @name          [HFR] profil gauche droite
// @version       1.1.0
// @namespace     roger21.free.fr
// @description   ajoute des flèches de navigation sur la page des profils
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/hfr/profil*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 240 $

// historique :
// 1.1.0 (26/05/2018) :
// - restylage et améliorations du code et check du code dans tm
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles (tous)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.0.5 (06/04/2018) :
// - remplacement des window.location par des window.location.href pour plus de clarté
// 1.0.4 (28/11/2017) :
// - passage au https
// 1.0.3 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.2 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.1 (18/03/2014) :
// - modification de le description
// - maj des metadata @grant et indentation des metadata
// 1.0.0 (01/10/2013) :
// - première mouture (avec tous les bugs qui vont bien :o)

var profil = /profil-([0-9]+)\.htm/.exec(window.location.href);
if(profil) {
  profil = parseInt(profil[1]);
  var profil_gauche = profil - 1 < 0 ? 0 : profil - 1;
  var profil_droite = profil + 1;
  var gauche = document.createElement("a");
  gauche.setAttribute("href", "https://forum.hardware.fr/hfr/profil-" + profil_gauche + ".htm");
  gauche.textContent = "<<";
  gauche.style.display = "block";
  gauche.style.position = "absolute";
  gauche.style.left = "10px";
  gauche.style.top = "0";
  var droite = document.createElement("a");
  droite.setAttribute("href", "https://forum.hardware.fr/hfr/profil-" + profil_droite + ".htm");
  droite.textContent = ">>";
  droite.style.display = "block";
  droite.style.position = "absolute";
  droite.style.right = "10px";
  droite.style.top = "0";
  var div = document.querySelector("div.container > div#mesdiscussions");
  var h4 = div.querySelector("h4.Ext");
  if(h4) {
    var new_h4 = document.createElement("h4");
    new_h4.setAttribute("class", "Ext");
    new_h4.style.position = "relative";
    new_h4.appendChild(gauche);
    new_h4.appendChild(document.createTextNode(h4.textContent));
    new_h4.appendChild(droite);
    div.replaceChild(new_h4, h4);
  } else {
    var hop = div.querySelector("div.hop");
    if(hop) {
      var new_hop = document.createElement("div");
      new_hop.setAttribute("class", "hop");
      new_hop.style.position = "relative";
      new_hop.appendChild(gauche);
      new_hop.appendChild(document.createTextNode(hop.firstChild.nodeValue));
      new_hop.appendChild(droite);
      new_hop.appendChild(document.createElement("br"));
      new_hop.appendChild(document.createElement("br"));
      new_hop.appendChild(div.querySelector("a.Topic"));
      div.replaceChild(new_hop, hop);
    }
  }
}
