// ==UserScript==
// @name          [HFR] Image Preview mod_r21
// @version       2.7.6
// @namespace     roger21.free.fr
// @description   Permet d'afficher un aperçu d'une image en passant la souris sur un lien vers cette image.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @modifications Gestion de tous les liens images, pas seulement ceux dans les quotes ni seulement ceux se terminant par .gif, .jpe?g ou .png et ajout d'une icône à coté des liens previewables.
// @modtype       réécriture et évolutions
// @author        roger21
// @authororig    shinuza
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_image_previe_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_image_previe_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_image_previe_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @connect       *
// @grant         GM.xmlHttpRequest
// @grant         GM_xmlhttpRequest
// ==/UserScript==

/*

Copyright © 2011-2012, 2014-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1590 $

// historique :
// 2.7.6 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.7.5 (24/12/2019) :
// - gestion des svg sans taille définie
// 2.7.4 (05/11/2019) :
// - gestion des svg
// 2.7.3 (02/11/2019) :
// - gestion des webp
// 2.7.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 2.7.1 (20/09/2019) :
// - ajout du support pour [HFR] Taille des images mod_r21
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.7.0 (03/11/2018) :
// - nouveau nom : [HFR] image preview mod_r21 -> [HFR] Image Preview mod_r21
// - ajout de l'avis de licence AGPL v3+ *si shinuza est d'accord*
// - gestion de la compatibilité gm4
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (shinuza)
// - réécriture des metadata @description, @modifications et @modtype
// - suppression de la gestion du changement d'icône pour simplifier la compatibilité gm4 ->
// il faut la modifier directement dans le code maintenant
// - meilleur gestion de la destruction de la popup et de l'affichage de la dernière image demandée
// - correction de la gestion de l'affichage du message de chargement (Loading...)
// 2.6.2 (09/06/2018) :
// - suppression de lemde.fr des urls shortener (lemonde.fr)
// - remise en place des logs de débug en commentés
// 2.6.1 (13/05/2018) :
// - ajout de la metadata @connect pour tm
// - petite correction sur la regexp de l'url du forum
// - maj de la metadata @homepageURL
// 2.6.0 (28/04/2018) :
// - amélioration du code et check du code dans tm
// - suppression des @grant inutiles
// 2.5.4 (29/03/2018) :
// - ajout d'un filtre pour éliminer les urls (trop) mal formées
// 2.5.3 (16/02/2018) :
// - ajout d'une compatbilité avec vm pour le mode anonyme de gm_xhr (via http cookie) par PetitJean
// 2.5.2 (10/12/2017) :
// - correcton du passage au https
// 2.5.1 (28/11/2017) :
// - passage au https
// 2.5.0 (15/01/2017) :
// - recodages divers : absolute -> fxed, limitation de la hauteur, utilisation des maxWidth et ->
// maxHeight (au lieu du width calculé), passage de 300px de large à 450px
// 2.4.2 (19/04/2016) :
// - ajout du mode anonyme de GM_xmlhttpRequest (GM 3.8) ->
// (sans autre modification, les autres protections ne sont pas gênantes)
// 2.4.1 (03/01/2016) :
// - ajout d'un trim sur l'url de l'image
// 2.4.0 (02/01/2016) :
// - ajout de la possibilité de changer l'image (dragon ball 4) à côté des liens image previewable
// 2.3.0 (29/11/2015) :
// - ajout d'une image (dragon ball 4) à coté des liens image previewable
// - ne traite pas les liens vides
// - correction de la selection des liens hors signature (toute foireuse !)
// 2.2.1 (24/11/2015) :
// - correction de la regexp du content-type pour matcher image/jpg (qui n'existe pas !)
// - légère modification de la regexp du content-type (plus robuste ?)
// 2.2.0 (22/11/2015) :
// - ne traite pas les liens contenant déjà une image
// 2.1.0 (22/11/2015) :
// - ne traite pas les liens en signature (ni le nombre de quotes)
// - ne traite pas les liens vers des url-shortener
// 2.0.0 (21/11/2015) :
// - remplacement de la recherche par xpath par une recherche par querySelectorAll (plus simple)
// - gestion de tous les liens images dans les posts, pas seulement ceux dans les quotes ->
// ni seulement ceux se terminant par \.(?:gif|jpe?g|png)
// - génocide de lignes vides
// - remplacement des ' par des " (pasque !)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - nouveau numéro de version : 1.0.5 -> 2.0.0
// - nouveau nom : [HFR] Image quote preview -> [HFR] image preview mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.0.5 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.4 (27/03/2014) :
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.0.2 (14/09/2012) :
// - ajout des metadata @grant
// 1.0.1 (28/11/2011) :
// - renomage du script (ajout du [HFR] au début) pour ne pas faire tache dans la liste des scripts greasemonkey
// - remplacement du namespace anonyme par roger21.free.fr
// - modification de la couleur de fond et du padding
// - suppression du test sur l'extenssion (trop limitant)
// - prise en compte des citation "quote" (citation simple)
// - ajout d'une version avec un .1 en plus


// gestion de la compatibilité gm4

if(typeof GM === "undefined") {
  this.GM = {};
}
if(typeof GM_xmlhttpRequest !== "undefined" && typeof GM.xmlHttpRequest === "undefined") {
  GM.xmlHttpRequest = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_xmlhttpRequest.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}


// image de l'icône et autres varibales globales

var iconImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACsklEQVQ4y2WTPYxUZRSGn%2Fe7352fu8yiLBoNsKyTLDKTQIeyFhoLs1pCYk9FjA2JBXagxs5CJZAQGmNjIQqVxppmCxElRIaAO%2BAKcXd1Z2Eus3Pv3J9jMVnD6mnOOcl537w5ySP%2BU%2FE7hPXXXJvJA3NKV1okyxjqAAvDv%2Bxm4wTZk%2Fd6ctk4x2ytPf8DBz6Y1vAPz2ARHlyE9WuYKaewpaSnN6N37c6mxm0Ooy84Ut%2F7wm0dOttUuuxJ7sKwCz4ADwrxCmnWd9rt0Zcc3WIQn9Gsn%2BASkzPQv2E8vg7xDRj8AoOfwQPOwAeGD%2FB1fRuf0SyAeu8Rbn919y13%2BELTNrrG4idSFGHDVZSvYQIKUPQcRIewUqbeTyofPbj76A4v%2BkaLtvafmGZjCfWviux30m%2BgMg%2BEoBEkX3u0p0nl7d0ICStR2t%2FT2Bu3nXnmSO57%2Btfgz4uUa5B8CsUVxtEj0LpDLkQ1QILKFNR2eENzXl4t%2FfY5Fgp5Q0%2FBts%2FATQMBmEH1ZAa1dWyUIaqYC8aGTi1XFGAIyca9AsFB0NRYLIDMYHgPRssYoPwxlj6kKEp8kVtnmELVgXOAjZ9W3gc9D1Sh%2BBWy7%2FtUjl1Bz%2ByiGPRI478hp%2BOd00JZWp6m%2BKA0wlAM3jcUw7avgAwsg%2FQqBG%2FFlOpQZEBJ7pwW1P9IYThjtwpHUwHmasgWwVag%2BgZYDpaARVD2hXa%2BbqguW%2Fqum93Tfjd5yrJsRfPOwApUJphmwB2GbAB5CoUCbPQ0NFrmZ45JSY9shfnJ05b9y8LGBY5Q51IpkAMFY1I00cRNvYzb8QrgKK5%2FSLG%2BenTiOJe3sBAd53K6qn1BqS4FuWVguUONg7jtLwGVvOyc6w6XVvdtiv9HI8Dax4TRLrXL0ubkaKEAgkZHo4cL8Y%2FcfPb8Vpz%2FAQdYLHdXVhJgAAAAAElFTkSuQmCC";
var maxWidth = "450px";
var maxHeight = parseInt((document.documentElement.clientHeight - 20 - 12), 10) + "px";
var containerId = "gm_hip_r21_container_id";
var container;
var loadingTimer;
var loadingText;
var loadingTextInit = "Loading";
var previwIconClass = "gm_hip_r21_preview_icon_class";
var lastCall;

function loading(elt) {
  loadingText = "";
  loadingTimer = window.setInterval(function(elt) {
    loadingText += ".";
    if(loadingText.length === 4) {
      loadingText = "";
    }
    elt.textContent = loadingTextInit + loadingText;
  }, 500, elt);
}

function destructPreview(destruct = true) {
  window.clearInterval(loadingTimer);
  let containerEl = document.getElementById(containerId);
  if(containerEl) {
    while(containerEl.firstChild) {
      containerEl.firstChild.remove();
    }
    if(destruct) {
      containerEl.remove();
      lastCall = null;
    }
  }
}

function imagePreview(link) {
  //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] OK 0");
  // ne traite pas les lien contenant déjà une image
  if(!link.firstElementChild ||
    (link.firstElementChild.nodeName.toUpperCase() !== "IMG" &&
      (link.firstElementChild.nodeName.toUpperCase() !== "SPAN" ||
        !link.firstElementChild.firstElementChild ||
        link.firstElementChild.firstElementChild.nodeName.toUpperCase() !== "IMG"))) {
    //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] OK 1");
    // ne traite pas les liens vide (bug du forum ?)
    if(link.firstChild) {
      //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] OK 2");
      // ne traite pas les liens vers le forum, sauf si c'est des images explicites,
      // et ne traite pas les liens (trop) mal formés
      if(link.href && (link.href.match(/^.*\.(?:gif|jpe?g|png|webp|svg)$/gi) ||
          (link.href.match(/^https?:\/\/forum\.hardware\.fr\/.*$/g) === null)) &&
        link.href.match(/^https?:\/\/[^\s\/$.?#].[^\s]*$/)) {
        //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] OK 3");
        // ne traite pas les liens vers des url shorteners (pour eviter de niquer ses drapoils)
        // basé sur http://bit.do/list-of-url-shorteners.php et http://dig.do/about/url-shortener
        if(link.href.match(/^https?:\/\/(?:[^\/]+\.)?(?:1click\.im|1dl\.us|1o2\.ir|1y\.lt|2tag\.nl|4ks\.net|4u2bn\.com|4zip\.in|9en\.us|ad4\.us|ad7\.biz|adbooth\.com|adbooth\.net|adf\.ly|adfa\.st|adfoc\.us|adfro\.gs|adlock\.in|adnld\.com|adshor\.tk|adspl\.us|adurl\.biz|adzip\.us|articleshrine\.com|asso\.in|at5\.us|awe\.sm|b2s\.me|bc\.vc|bih\.cc|bit\.do|bit\.ly|biturl\.net|bizz\.cc|budurl\.com|buraga\.org|cc\.cr|cf\.ly|cf6\.co|clicky\.me|cutt\.us|dai3\.net|dollarfalls\.info|domainonair\.com|dstats\.net|fur\.ly|goo\.gl|gooplu\.com|hide4\.me|hotshorturl\.com|iiiii\.in|ik\.my|ilikear\.ch|infovak\.com|is\.gd|ity\.im|itz\.bz|j\.gs|jetzt-hier-klicken\.de|kaaf\.com|kly\.so|l1nks\.org|lst\.bz|magiclinker\.com|miniurl\.com|mrte\.ch|multiurl\.com|multiurlscript\.com|nicbit\.com|nowlinks\.net|nsyed\.com|omani\.ac|onelink\.ir|ooze\.us|ozn\.st|prettylinkpro\.com|rlu\.ru|s2r\.co|scriptzon\.com|seomafia\.net|short2\.in|shortxlink\.com|shr\.tn|shrinkonce\.com|shrt\.in|sitereview\.me|sk\.gy|snpurl\.biz|socialcampaign\.com|soo\.gd|swyze\.com|t\.co|tab\.bz|theminiurl\.com|tiny\.cc|tinylord\.com|tinyurl\.ms|tip\.pe|ty\.by|1url\.com|7vd\.cn|adcraft\.co|adcrun\.ch|aka\.gr|bitly\.com|buzurl\.com|crisco\.com|cur\.lv|db\.tt|dft\.ba|filoops\.info|j\.mp|lnkd\.in|ow\.ly|q\.gs|qr\.ae|qr\.net|scrnch\.me|tinyarrows\.com|tinyurl\.com|tr\.im|tweez\.me|twitthis\.com|u\.bb|u\.to|v\.gd|viralurl\.biz|viralurl\.com|virl\.ws|vur\.me|vurl\.bz|vzturl\.com|x\.co|yourls\.org)\/.*$/gi) === null) {
          //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] OK 4");
          GM.xmlHttpRequest({
            method: "HEAD",
            url: link.href,
            mozAnon: true,
            anonymous: true,
            headers: {
              "Cookie": ""
            },
            onload: function(r) {
              //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] OK headers :\n" +
              //  r.responseHeaders);
              //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] OK content-type : " +
              //  r.responseHeaders.match(/^.*content-type.*$/im));
              let type = r.responseHeaders.match(/^.*content-type.*image\/(gif|jpe?g|png|webp|svg).*$/im);
              if(type) {
                //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] OK 5");
                let svg = type[1].toLowerCase() === "svg";
                //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] SVG " + svg);
                let previewIcon = document.createElement("img");
                previewIcon.setAttribute("src", iconImg);
                previewIcon.setAttribute("title", "[HFR] image preview");
                previewIcon.style.verticalAlign = "bottom";
                previewIcon.style.border = previewIcon.style.padding = "0";
                previewIcon.style.setProperty("margin", "0 5px", "important");
                link.appendChild(previewIcon);
                link.addEventListener("mouseover", function() {
                  link = this;
                  destructPreview();
                  container = document.createElement("div");
                  container.setAttribute("id", containerId);
                  container.style.position = "fixed";
                  container.style.background = "#dedfdf";
                  container.style.width = "200px";
                  container.style.padding = "5px";
                  container.style.border = "1px solid black";
                  container.style.top = "10px";
                  container.style.right = "10px";
                  let loadingElt = document.createElement("p");
                  loadingElt.style.marginLeft = "50px";
                  loadingElt.style.fontFamily = "arial,sans-serif";
                  loadingElt.style.fontWeight = "bold";
                  loadingElt.textContent = loadingTextInit;
                  container.appendChild(loadingElt);
                  document.body.appendChild(container);
                  loading(loadingElt);
                  let img = new Image();
                  img.style.display = "block";
                  img.style.margin = "auto";
                  img.style.maxWidth = maxWidth;
                  img.style.maxHeight = maxHeight;
                  img.dataset.lastCall = Date.now();
                  lastCall = img.dataset.lastCall;
                  img.addEventListener("load", function() {
                    if(this.dataset.lastCall !== lastCall) {
                      return;
                    }
                    destructPreview(false);
                    container.style.width = "auto";
                    if(svg && (this.naturalWidth === 0 || /* firefox */
                        this.naturalHeight === 150 || this.naturalHeight === 300 /* chrome */ )) {
                      //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] SVG NO WIDTH " +
                      //  this.naturalWidth + " " + this.naturalHeight);
                      this.style.width = maxWidth;
                    }
                    container.appendChild(this);
                  }, false);
                  img.src = link.href;
                }, false);
                link.addEventListener("mouseout", function() {
                  destructPreview();
                }, false);
              }
            }
          });
        }
      }
    }
  }
}

//window.setTimeout(function(){

var links = document.getElementById("mesdiscussions").querySelectorAll(
  "table.messagetable td.messCase2 div[id^='para'] > span:not(.signature) a.cLink, " +
  "table.messagetable td.messCase2 div[id^='para'] > div:not(.edited) a.cLink, " +
  "table.messagetable td.messCase2 div[id^='para'] > *:not(span):not(div) a.cLink");
for(let link of links) {
  //console.log(link.href + " [ HFR IMAGE PREVIEW DEBUG ] OK -1");
  imagePreview(link);
}

destructPreview();

//}, 5000);
