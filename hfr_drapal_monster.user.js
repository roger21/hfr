// ==UserScript==
// @name          [HFR] drapal monster
// @version       1.2.0
// @namespace     roger21.free.fr
// @description   permet de faire disparaitre un drapal sans avoir à l'ouvrir
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/forum1f.php*&owntopic=*
// @include       https://forum.hardware.fr/forum1.php*&owntopic=*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 181 $

// historique :
// 1.2.0 (13/05/2018) :
// - amélioration du code et check du code dans tm
// - recodage en fetch (pour ne pas dépendre de GM_xmlhttpRequest)
// - suppression des @grant inutiles (tous)
// - suppression du code mort
// - ajouts de commentaires (une chiée !)
// - ajout de la gestion des pages des drapals par cat
// - gestion d'une certaine compatibilité avec new page number et drapal easy click
// - ajout d'un mode refresh qui recharge la page (désactivé par défaut) ->
// pour une meilleur compatibilité avec tous les autres scripts
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - maj de la metadata @homepageURL
// 1.1.7 (28/11/2017) :
// - passage au https
// 1.1.6 (26/10/2016) :
// - suppression du return hors fonction
// - remplacement des nodeValue (obsolètes) sur les attributs par des value
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.1.5 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.1.4 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.1.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.1.2 (25/12/2013) :
// - message plus lisible ?
// 1.1.1 (14/09/2012) :
// - ajout des metadata @grant
// 1.1.0 (17/06/2012) :
// - ajout d'une confirmation

var refresh = false; // passer à true pour activer le rafraichessiment de la page après avoir mangé un drapal
var scriptname = "[HFR] drapal monster";
var parcat = /^https:\/\/forum\.hardware\.fr\/forum1f\.php.+$/.exec(window.location.href) === null;
var owntopic = /^.+&owntopic\=([123]).+$/.exec(window.location.href);
// vérification de la présence et de la valeur de owntopic dans l'url de la page
if(owntopic !== null) {
  owntopic = owntopic[1]; // 1 = fav+cyan, 2 = red, 3 = fav only
  // récupération de la liste des topics dans le tableau
  let rows = document.querySelectorAll("tr[class^=\"sujet ligne_booleen\"]");
  for(let row of rows) {
    // verification de la présence d'un drapal à manger sur ce topic
    // sur les pages fav only ou par cat il n'y a pas forcement de drapal à manger pour chaque topic
    if(row.cells[4].firstElementChild != null) {
      // récupération de l'url à ouvrir pour manger le drapal
      let url;
      if(row.cells[3].firstElementChild != null) {
        // récupération de l'url de la dernière page si présente
        url = row.cells[3].firstElementChild.href;
      } else {
        // sinon récupération de l'url du drapal si pas de dernière page (on est encore en page 1)
        url = row.cells[4].firstElementChild.href;
      }
      // construction du monster
      let img = document.createElement("img");
      img.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAf1JREFUKM9NkU1IFHEAxX//ndndFj9W3XULjEq03LKCCCIFEQT3EAZBBeJBJCoSpJt07oMOXerooUNQBB4KJALtAw0vBUYXsxRdZyZ3tV0d13Vr2Zn5779DCj54t9+Dx3uCParUqHs+Ut95OH61RWlVNUhjc2nu7VzvYOFTuUx+L8ujYboWv1z/kE2939rKTCs3N6YKqScqt9CfmxuPTTwc5jyADjByl87unuGnR07dbhQihHBMKK0pPSAFhMPh5qaEUBst0Vp5SbvSTayvv//B8XNDbcioEp4p8JbBM8ExBH8N8ApEI3aNbbthffBGy7Ha2Nkex2vGr+YFjgVyRVG0BGUDx0mWfW5y08wUM2ubrOqO3n4wUt/gD6gVRcncCVjC3jbcjeyvj1k7PTMxXZy695gpQOqyHNJ8Pg9KSZAr4Fj/7Rr8XPyRe/bGGX09xuzuONqtgf2RoO4fqK7QBcUlKBsgTRXC0g7Vbbcm2rh8MUF70WVpdp60Fg4ueCeOBk7GooEmXEvhWgLHELLwG+VDBDUqG+qIJzq42RonoH3+Rr7jTDIXCZmJqn1uBa6FdNJ4CgWInSZi1WYjvc59DeDVOAun4/nlqmCqSZa2D/h1xC6c/4O3usXXyRmGrt1hUux9e6CXxr4LdNVU06prVHuS3LrN95cTvHsxSgrgHxU35zJIt/dcAAAAAElFTkSuQmCC");
      img.setAttribute("title", scriptname + " : manger ce drapal !");
      img.style.cursor = "pointer";
      // ajout de l'action sur le monster
      img.addEventListener("click", function() {
        // demande de confirmation
        if(confirm("Voulez vous vraiment manger le drapal de \u00ab\u00a0" + img.parentNode.parentNode.cells[2].querySelector("a").textContent + "\u00a0\u00bb ?")) {
          // appel de l'url à ouvrir pour manger le drapal
          fetch(url, {
            method: "GET",
            mode: "same-origin",
            credentials: "same-origin",
            cache: "reload",
            referrer: "",
            referrerPolicy: "no-referrer"
          }).then(function(r) {
            // suppression visuelle du drapal en fonction du type de page
            if(owntopic === "3" || parcat) { // fav only ou par cat
              // suppression de la puce du topic, du drapal et du monster
              img.parentNode.parentNode.cells[0].textContent = "";
              let cell5 = img.parentNode.parentNode.cells[5];
              let cell4 = document.createElement("td");
              cell4.setAttribute("class", "sujetCase5");
              img.parentNode.parentNode.removeChild(img.parentNode.parentNode.cells[4]);
              img.parentNode.parentNode.insertBefore(cell4, cell5);
              img.parentNode.removeChild(img);
            } else { // fav + cyan et red
              // suppresion de la ligne du topic dans le tableau
              img.parentNode.parentNode.parentNode.removeChild(img.parentNode.parentNode);
            }
            // rafraichissement de la page si activé
            if(refresh) {
              window.location.reload(true);
            }
          }).catch(function(e) {
            console.log(scriptname + " ERROR fetch : " + e);
          });
        } // fin if : demande de confirmation
      }, true);
      // ajout du monster dans la dernière colonne du tableau des topics
      row.cells[9].style.whiteSpace = "nowrap";
      row.cells[9].appendChild(img);
    } // fin if : verification de la présence d'un drapal à manger sur ce topic
  } // fin for : sur la liste des topics
} // fin if : vérification de la présence et de la valeur de owntopic dans l'url de la page
