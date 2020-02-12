// ==UserScript==
// @name          [HFR] Signature oui non
// @version       1.1.4
// @namespace     roger21.free.fr
// @description   Permet de forcer ou de désactiver la signature en fonction du topic.
// @icon          https://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*/*-sujet_*_*.htm*
// @include       https://forum.hardware.fr/message.php*
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.deleteValue
// @grant         GM_deleteValue
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// ==/UserScript==

/*

Copyright © 2012, 2014-2015, 2017-2019 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1473 $

// historique :
// 1.1.4 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 1.1.3 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.1.2 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+
// 1.1.1 (09/09/2018) :
// - correction de l'utilisation de GM.getValue (inutilement complexe ici)
// 1.1.0 (12/08/2018) :
// - nouveau nom : [HFR] signature oui non -> [HFR] Signature oui non
// - gestion de la compatibilité gm4
// - amélioration des @include
// - améliorations diverses du code
// - ajout de la metadata @author (roger21)
// - maj de la metadata @homepageURL
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - check du code dans tm
// 1.0.6 (28/11/2017) :
// - passage au https
// 1.0.5 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.4 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - suppression d'un warning (bad code is bad)
// 1.0.3 (23/03/2014) :
// - ajout des dates dans l'historique
// 1.0.2 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.0.1 (14/09/2012) :
// - ajout des metadata @grant

if(typeof GM === "undefined") {
  this.GM = {};
}
if(typeof GM_deleteValue !== "undefined" && typeof GM.deleteValue === "undefined") {
  GM.deleteValue = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_deleteValue.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
if(typeof GM_getValue !== "undefined" && typeof GM.getValue === "undefined") {
  GM.getValue = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_getValue.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
if(typeof GM_setValue !== "undefined" && typeof GM.setValue === "undefined") {
  GM.setValue = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_setValue.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}

var blanc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAa5JREFUOMutk7%2Fr2lAUxT%2BmmaSCTg4KQczgKP6YhA4ZlYBO8i1CcMns4tZOrYvg0kXIooJYBRcJbhL8BwwZ6maGDOosrYtk6KLyrakd2p7lwbucc%2B8779wQDzAM4y2gAo2H0hgwdV3%2F8foy9EB%2BASaiKCJJErIsA7Db7fA8D9%2F3Ad7ruv41IGAYxifgQzqdRlEUfgfLsnBdF%2BCzrusf7wK3zvl8nlwux59g2zabzeY%2BSej65u%2FPOu%2F3e0ajEcvlEsdxSCaT9Pv92yQRAVBFUQyQL5cL7XabcrlMOBwmFosxnU4pFosoioIoigCqADQkSQp0bjabJBIJHMeh1Wph2zar1YrBYADAldMQgbvbr7FYLIhGo0wmExRF4XA4%2FFKXZRnXdRGemTWbzTifz3S7XbLZ7FNThds%2F385arUY8HqdSqTAcDul0OmQymQDxxhGAsed5ACiKQrVaxXEc1us1mqbR6%2FWYz%2BcBgStnLAKm7%2FtYlkWpVELXdSKRCIVCAU3TqNfrCIIQCNQ1leY%2FB%2BkNgGma31RVFY%2FH47vT6UQqlXoa5e12e4vyl%2F%2B7TH%2B7zj8BF%2FXFmFL1oQAAAAAASUVORK5CYII%3D"
var vert = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAgtJREFUOMudkz9IW1EYxX%2B5PvUlJCEBoZAWgyJScAnaDlKh8NwSAgb81zZQulwcO9g1LdgudesgksUGoqbQJTy6SAkd4lgJ2IJgqqTQxkVe80h5jxCeXYwYE0vpWb97znfP4TsuriCdTnuBOJAEooAJFIEsoEsp65ffu66QF4AtR3GEHbaxRiwA3GU3akVFNIUDPJJS5joE0un0C%2BC5NWxhaMYVaeAMgoUg7iM3wIqUMnUhcL45Z46b1Cfq%2FA3ePS%2F%2Bz36AB1LKnOvcc80atoQxbXQQzB8mpUyJww%2BHnJRO8N%2Fyk1pLtX7iE0DcURxhaO3kZqPJzrMdNqOb9Hp6UYMqs7lZQndDGNMGjuIAxAWQtMN2h%2Bf8kzy%2Bmz6WSktMPp2kulfl6OMRMxszANhhGyCpAFOttC%2FjIH%2BAGlDZ39pnSBti%2Bedy29wasfB880yJ68KaezdH43eD3de7rEfWrw1VAEV32Q3AafmUXCLH6o1VRmOjJN4m0F5pDNwe6CCec4oKkFUrapQzyGgZtBWN2FqM40%2FHlDZK1L7XmH8%2F3yGgVlSArALooimcYCEoBu8NokudPl8foTshIo8jjC2MIUS700AhgGgKAL11SIvAtjlhUh%2F%2F50N6KKXc7gHQdf1LPB7v6a%2F231d%2BKdjDdldyoBDA%2B9UL8FJK%2BaZbmRaBbUdxuKZMF5u7tvF%2F6vwHJHnL035O4wIAAAAASUVORK5CYII%3D";
var rouge = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAgtJREFUOMudkz9IG2EYxn%2F5PPUiSUhAKKTFYBApuIi2g1QonJvhQMF%2FbYXS5cOxg11twXapWweRLFaIeoUucnSREjrEsXJgC4I2YqGNi1xzWO4I4eyQRNTTUvqM3%2Fc9z%2Fu%2Bz%2Fc%2BIS4hm81GAB2YBoYBBygAOcCUUp6cfx%2B6RJ4E1hTfFynPo8t1AdgPhzlUVapC%2BMAjKaUREMhmsy%2BA52nXRbPti8rAKZBPJCiGwwDzUsq5M4F6ZaPPceg%2FOeFv2I5E%2BByLATyQUhqh%2BszltOuKIdsOEH44DiuWxYe9PayjI27FYizOzTU6iQpAV3xfaJfIlWqVZ5ubDK%2Bu0tbcTEJVMcbGuJtMMmTbKL4PoAtgOuV5gZmfbGxwMxrFmpnh6cAA26USH4tFlkdGAEh5HsC0Agw23D6Pjd1d4qrK2s4OWmcnP2dnL9x3uS7f2toGxXVmvRsf53elwuutLXqXlq41VQCF%2FZoh7B8fM2oY3FhYINPdzdvRUV5pGrfb2wPEOqegALlDVR0%2BBbSVFeY1jcVMhk8HByxbFt%2FLZd5PTAQEDlUVIKcAZlUIP59IiHsdHUjTJNrSwp1kkse9vUz29CDExUnz8TjV2pnZWKQpYL3fcej790V6KKVcbwIwTfOLrutNpdbW%2B78UhXTtiwLIx%2BN8jUQAXkop31wVpilgXfF9rgnTWeUr0%2Fg%2Fcf4DKVnL06S3U1YAAAAASUVORK5CYII%3D";

if(document.forms.namedItem("hop") &&
  document.forms.namedItem("hop").elements.namedItem("cat") &&
  document.forms.namedItem("hop").elements.namedItem("post")) {

  var cat = document.forms.namedItem("hop").elements.namedItem("cat").value;
  var topic = document.forms.namedItem("hop").elements.namedItem("post").value;

  GM.getValue(cat + "." + topic, null).then(function(ouinon) {

    if(window.location.pathname !== "/message.php") {
      let profil = document.forms.namedItem("hop").elements.namedItem("signature").value;
      let toolbar = document.querySelector("table.main tr th div.right");
      if(toolbar) {
        let bouton = document.createElement("img");
        if(ouinon === null) {
          bouton.src = blanc;
          bouton.setAttribute("calimero", "blanc");
          bouton.title = "La signature est affichée selon les préférences du profil.";
        } else if(ouinon === "oui") {
          bouton.src = vert;
          bouton.setAttribute("calimero", "vert");
          bouton.title = "La signature est toujours affichée sur ce topic.";
        } else if(ouinon === "non") {
          bouton.src = rouge;
          bouton.setAttribute("calimero", "rouge");
          bouton.title = "La signature n'est jamais affichée sur ce topic.";
        }
        bouton.style.cursor = "pointer";
        bouton.style.marginRight = "5px";
        bouton.addEventListener("click", function(bouton, profil) {
          return function() {
            if(bouton.getAttribute("calimero") === "blanc") {
              bouton.src = vert;
              bouton.setAttribute("calimero", "vert");
              bouton.title = "La signature est toujours affichée sur ce topic.";
              document.forms.namedItem("hop").elements.namedItem("signature").value = 1;
              GM.setValue(cat + "." + topic, "oui");
            } else if(bouton.getAttribute("calimero") === "vert") {
              bouton.src = rouge;
              bouton.setAttribute("calimero", "rouge");
              bouton.title = "La signature n'est jamais affichée sur ce topic.";
              document.forms.namedItem("hop").elements.namedItem("signature").value = 0;
              GM.setValue(cat + "." + topic, "non");
            } else if(bouton.getAttribute("calimero") === "rouge") {
              bouton.src = blanc;
              bouton.setAttribute("calimero", "blanc");
              bouton.title = "La signature est affichée selon les préférences du profil.";
              document.forms.namedItem("hop").elements.namedItem("signature").value = profil;
              GM.deleteValue(cat + "." + topic);
            }
          }
        }(bouton, profil), false);
        let mycrub = document.createElement("div");
        mycrub.className = "right";
        mycrub.appendChild(bouton);
        toolbar.insertBefore(mycrub, toolbar.lastChild);
      }
    }

    if(ouinon !== null) {
      if(window.location.pathname === "/message.php") {
        if(ouinon === "non") {
          document.getElementById("signature").checked = false;
          let labelo = document.createElement("span");
          labelo.appendChild(document.createTextNode(" (désactivé par le script [HFR] Signature oui non)"));
          document.getElementById("signature").
          parentNode.insertBefore(labelo, document.getElementById("signature")
                                  .nextElementSibling.nextElementSibling);
        }
        if(ouinon === "oui") {
          document.getElementById("signature").checked = true;
          let labelo = document.createElement("span");
          labelo.appendChild(document.createTextNode(" (forcé par le script [HFR] Signature oui non)"));
          document.getElementById("signature").
          parentNode.insertBefore(labelo, document.getElementById("signature")
                                  .nextElementSibling.nextElementSibling);
        }
      } else {
        if(ouinon === "non") {
          document.forms.namedItem("hop").elements.namedItem("signature").value = 0;
        }
        if(ouinon === "oui") {
          document.forms.namedItem("hop").elements.namedItem("signature").value = 1;
        }
      }
    }

  });

}
