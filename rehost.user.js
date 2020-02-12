// ==UserScript==
// @name          Rehost
// @version       1.1.6
// @namespace     roger21.free.fr
// @description   Version en script Greasemonkey de l'extension reho.st pour Firefox qui permet de générer, dans le presse-papier, le BBCode de réhébergement d'une image sur reho.st à partir du menu contextuel de l'image.
// @icon          https://reho.st/self/f87acf6712efa617e6edcd330fdc1f6c0d34a086.png
// @include       *
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.setClipboard
// @grant         GM_setClipboard
// @grant         GM.notification
// @grant         GM_notification
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2018-2020 roger21@free.fr

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
// 1.1.6 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 1.1.5 (10/11/2019) :
// - réduction des temps des transitions de 0.7s à 0.3s
// 1.1.4 (25/10/2019) :
// - correction d'une fôte [:vizera]
// 1.1.3 (12/10/2019) :
// - ajout d'une info "sans rechargement" dans la fenêtre de configuration
// - correction de la gestion du sous-menu pour les gifs
// 1.1.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 1.1.1 (18/09/2019) :
// - ajout de la directive @inject-into content pour isoler les scripts sous violentmonkey
// 1.1.0 (05/09/2019) :
// - petite sécurisation du css et petit nettoyage du code
// - bordure solide pour la fenêtre de configuration
// 1.0.0 (28/11/2018) :
// - ajout de l'avis de licence AGPL v3+
// 0.9.3 (13/11/2018) :
// - augmentation du z-index de la fenêtre de conf pour permettre son affichage sur certains sites
// 0.9.2 (26/08/2018) :
// - utilisation de la visibility plutot que le display pour gérer la fenêtre de conf
// 0.9.1 (11/08/2018) :
// - sécurisation de certains styles de la fenêtre de conf (contaminés par les styles de la page)
// - amélioration du calcul de la position de la fenêtre de conf (pour les pages spéciales)
// 0.9.0 (05/08/2018) :
// - ajout de la fenêtre de configuration
// 0.8.3 (28/07/2018) :
// - amélioration de la récupération du body
// 0.8.2 (08/07/2018) :
// - ajout d'une gestion pour les gifs
// 0.8.1 (30/06/2018) :
// - corection d'un ] oublié dans le bbcode :/
// 0.8.0 (29/06/2018) :
// - création

/* ----------------- */
/* images des icones */
/* ----------------- */

var iconSans = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAB%2FElEQVQ4y62SO2tUURSFv73PvZMxk2GIeZiHgvgIhBhfRUSwUDBW%2FgMtLARLSWHlH9DCnyBiaSumFOwUrGLCWPkiD0jIw0kyz3vP2RaTYWYSsNEFB86GfdZe66wN%2FwgBWHz5%2FoUZ9%2BqJZdMgR5usu1Y1YmevrjyanYsAzLh%2FfvbckMvnRVzmrxN9ErB6jeK7pQdAk6CeWI%2FL5WXh7Qa1ZJXt2icmpiPiTAkfjHKph88fdhg%2BfpOIEW4%2FnMJMBUABvAeJM6jC790FJi4oLlqmWl%2BlUf2Jyyxz8VqW7c0vOCfQYTNqXcwCqork9nFxhXp1B9EyUMOxRdwbU95fR0cVgscsHCYAEcFST5J6kAoSSqANDMN8FcwTRYp1fGoXgaoilQK1ciDqySDqwRI8BSpbWfp6TzR7RNuJtKMSRISBgct8W0iorEQ09oZp7I2w9z3P0seU0fGrRM51pdKMUQQC4IS%2B3GlODd1hbf4Jx7LrpD5g9QITN56Ty53BzGMdHtoWRGjs3iU0AqJG%2F%2B4GlyYnMTPWiz9YqTymtB%2FwwYDFQwTBEDNOzjxra5taI91cIfpVZPDpHINxlk67B0vcUmAHpwOFMSiMkZ6dObqOqt0KMpGWLKkW%2BsdvgQqEFqF0%2BW09tmoF1ebECMA5efN1vng9TW26Je1vUDWc8Jr%2FgT9jGdZbgZJ%2BWgAAAABJRU5ErkJggg%3D%3D";
var iconFull = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAB8ElEQVQ4y6WTPWtUQRSGnzP33r33Jgu7kI1hI1GSgGARxFRG%2F4CFhY1VUlhI%2BoCNP8LfIKaz0MpCLEz%2BQUCwCIQVQc0X%2BdhsNtm5O3PGImbJboIIGaabmeec9533SAiB66wYYPnj2mtVmT8pNLPuilsDNZIYsoQ3L57OLsUAGmThyaOJ0SzLRCT6Z8WOgnddPnzZeA6cAU6spmmayfLqAR32aMk6k2M75EkTF5T9o5xvGxWGwl1iRnj5bBKvIj0JhQNjIoxAYbaYrO2Qln7QtC2cd8RpytREne%2BNYaqlGqoDHgAoYIxgwy6l5IDD0ybWdyicw4U2aZrStjkjuSEQesb0A0QITrG%2BS8dZTruWQh1eAekS1BMb4eLPmZ7R4QyQMUqrPUwgwarHOo9IiXarTLk0ThQZCHJZQghnEsrRTX5tbVPJNhkaNqTiON4fYnurTr0yRWzkcg7CRUByg%2FH8Pj%2FXVqiWfyPek3RGuTW9QDmr41X7YtHXwfreIl4Vr8odu8vcxG0UaGxu8%2Bn4FXqkqCrweaCDEBDg8exS7yCaOeSkvUe2%2BZXaw0Xmo6Qvmec%2BxgByRV59XsXnVWxt%2Boo8DpiYJdJEu5V7Yw9A5C8qnO9Lj50riCMJPUAplnfvVxpzhQ8z%2FzOccQSJ4S2AXHec%2FwAGb9qTrxXEvwAAAABJRU5ErkJggg%3D%3D";
var iconMedPrev = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABYklEQVQ4y92Rv0scYRCGn9lbc3juuaDgoYKmyWEjaaOWNtY2kipiq42KhaWQMsGksBZLSWVpb2ejYmF7hxwo4nk%2F3Nv9vttvUojiwt0fkLzdMPM%2B7wwD%2F7zkfbH18%2FTXUDC4inpv3dQR5jxPjU1VxLWSuHO4v720%2Berx3wOCYOjbxnI5LBSKvYKkndjw4M%2FFKtAbgEhYKBS5qTU5q%2BwQDj8QGUv1fpT5ie98mZlEJJfZ2s%2F6oQt0nSMI7hkcGMGR4D5UuKtHOHWI6HBfgKo2VQlbkaEex6T6TNsmPEYxdRJQQZVmX4DpxqEqtGJHpfYJl7%2BmbSOe6tOUS%2FmeX%2FCyZR7n4KmT8rm0y1pjjMULj8WPP%2FB9HwVEpP8JqCIoV7frWGs5NwYzPoC5XsFay9eFc1SzkX52HVfV1EztLZ%2FwMqcZg7UWVBt9AVEUH%2F8%2BvpxzeLOeJwiECg1eIeJ4bneO%2BL%2F0F2ZFngSiQbBTAAAAAElFTkSuQmCC";
var iconThumb = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABAElEQVR42mNgGAUYoKh354TamYc%2B1M44AsEzj%2F0rn3L4b8XUgx8Ke3f0EzSgbuaR969ev%2Fr%2F5et3FPzi3af%2FQIPfEzZg1tF%2FIA3dBxz%2Bzzzu%2F7%2F3kMf%2F5FWG%2F19%2B%2BP4fKPeBoAH1s4%2F%2B%2BwA0IGdZ6v%2BstZb%2F41bo%2F%2Feb7vf%2F%2Bfuv%2F%2BtnH%2FlH0ICKaYf%2Fv%2Fn4%2Ff%2B8fXf%2Bn5nnD8a9m679f%2Fbu23%2BQ4YQNmHro%2F9uP3%2F4XLHL%2Fnz3X6X9Ut%2BH%2F0Dad%2F8%2Fegr1A2ICqqQcevnn34f%2FHLz%2F%2BfwDi95%2B%2Fg%2FErYCCCApigAQXdO7pqpx88XD39MDAKjyBF56EPoCgeTeiYAAAQA8BFxRnPewAAAABJRU5ErkJggg%3D%3D";
var iconConf = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAzRJREFUOMt1k11oHHUUxX%2F%2Fmdmd3SSbTXbTajfQgG1ikZqCzdem20hqUmoNNoigUqwWW4KFglKpIcXSNx%2BUgi%2B%2BiBUUP8AioRZFsGgtMaZJY9U01mo%2BKM1mYz73K93ZnZnrQ7YSHzxwH8%2B593LOUayDJxhRgBfwAw6wCgjgAzxADsgXknG5x9H4L4zdsda6jz98v%2BfM6b5uoBwoe7nnyJ5PP%2FqgJ7Yr%2BmBRiP8VaG5s2N4Wi9Ue6HoiCjQBTU8%2F1d0Z29Va17V%2FX7R44b9QxbON4pherzd2dfCHjlBlhUfXND%2BA40rOsix7d3vnlURi7lLxNQewdd0XMKMtzXXHeo60X%2Fv5euXpU70tjQ07%2FWs8sVwRC3B0XRcFgaGrI1bf6689kk5nnERiLqU8wUjo3HvvvrC347EHcrkcps%2Fnuq7kASYmp1zHcair3aoBaJryZrNZray0jO%2B%2Bv3z7%2BcNHz2kC7tfffHtn9Pqvyx6vmXVdWQXsvjfOZNs7Hx%2Fu2Nc13HvqdBawXVdW%2Ff6S7F%2BTU8mBwaE5AZRRHvEC96No%2B3P8l1rTNNXExKS0790%2FJMIwgFLsvNh%2FvqX%2B4e1aJpORh3Y0TCFcAWYMFK6Cu8BqoVBwTNMUw2MoBRkUSQAFmRK%2F3wUcj8ejFCyJYgUo6LovUHri1ePtZ996c0c4XJUHnMqKoFi53IaRa6OrCjb2HD3c2n3gSQOwDcNwO%2FY8Wq3AGRsbnzUEzMimTRurq6uzCwuLbjgcRgT6ek%2BWHXzumS6AmpoaHNe9C5DJZlV9fb3MzMS3fvLZ56O65gvoN8Z%2Fl9%2FGbpgnTvblRaQ02tyUFxErWFFhB4PBgiuSA9y3z75jHDv%2BSvLOzEzq%2FBf9NxeXluLKKI8YQKCYf39JqT86cPlSZTgUkvWJW1hYVI2tbfOO7YwAVjFMSc1OxW2BpMAcivmXXjwk4VDI%2FnHwJ7V5y7b85i3bnJt%2F3JKqqrB96OCzNoqEQFxg2U7FbR1ArLSIlRbNF9D%2Bnl%2Fw5iwr3H%2Fhy5Xp6dsDwHQyndowO5tQFy5%2BdWt5ZWXWScULYqWl6NC6JpVHdKACCLFm7XyxcPcVS7TE2mbnHucfEGJoU7krLCIAAAAASUVORK5CYII%3D"
var iconRehost = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuklEQVR42u2XTUsCYRCAtaMdpLOeFeyHRCR16lB066jXIIIi7CBEEEGRXYpOQXSIiqBDWqFSCH3tCuUxqtsaBJG6rdNMjKHruom7rgb7wgMy7M4874fLvA6HPaoGADgRF%2BJBfEjAJPyck3I79Yr3IUPIOpJC7hHRIALninFuqtGjJeDiB04RCSkhZZOQkTwS5xouLQEPz1zil9ox8rwSXi0BHy%2BVDO0blDvNZ8KpFgjwnv%2FOfmA2UcPq4SMUZQUOLp9havMGRqNJGJxLQHD%2BDMYWU7C8%2F9CMhMC1NAVEPYGZ7TuYXLmqi1c4zrw0I5BF%2BlsS0GMcV6CEq2OZwPTWLawd5SCyI8DIwgXsJZ%2BaPQfGBIYj55DJSTUZ3z9K8Fn8skbg5PrV6D%2BhdYGJpTQoSrlzAtHdrBnfgtYF6DtgC9gCXS1QKBQgHA6D2%2B3%2BgX5TzDKBUCgElKoailkmQLNWC1DsXwkIRgRoz9UCFFMNsVFDUteSteEQ6rZkHm4YO9aUVtryOD9oZnNKzcIbkkCCSO9fF5MYL5XAh8YIIufa4OLaFxPV1czL%2BxTgE2sUP%2BdsfDVrIGMaXXsh%2FgYxMyaxXsAjHwAAAABJRU5ErkJggg%3D%3D";

/* ---------------------------- */
/* gestion de compatibilité gm4 */
/* ---------------------------- */

if(typeof GM === "undefined") {
  this.GM = {};
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
if(typeof GM_notification !== "undefined" && typeof GM.notification === "undefined") {
  GM.notification = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_notification.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
var gmNotif = false;
if(typeof GM.notification !== "undefined") {
  gmNotif = true;
}
var gm4 = false;
if(GM && GM.info && GM.info.scriptHandler === "Greasemonkey") {
  gm4 = true;
}
if(typeof GM_setClipboard !== "undefined" && typeof GM.setClipboard === "undefined") {
  GM.setClipboard = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_setClipboard.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
var gmMenu = false;
if(typeof GM_registerMenuCommand !== "undefined") {
  gmMenu = true;
}

/* -------------------------- */
/* actions du menu contextuel */
/* -------------------------- */

const REHOST_URL = "https://reho.st/";

var currentUrl;

var lastIsGif = false;

var gifre = /.*\.gif([&?].*)?$/i;

function setCurrentUrl(e) {
  currentUrl = this.src;
  if(gifre.test(currentUrl)) {
    lastIsGif = true;
  } else {
    lastIsGif = false;
  }
  createRehostMenu();
}

var currentRstIcons;
var currentRstNotifs;
var currentRstLink;
var currentRstReturn;

var messageTitle = "Rehost"
var messageLien = "Le lien ";
var messageBBCode = "Le BBCode ";
var messagePressePapier = "a été copié dans le presse-papiers.";
var timeOut = 6666;

function doRst(e, type) {
  let messageType = (type === "sans") ?
    (lastIsGif ? "du gif sans reho.st " : "de l'image sans reho.st ") :
    (lastIsGif ? "du gif " :
      ((type === "full") ? "de l'image " :
        ((type === "medium") ? "du médium " :
          ((type === "preview") ? "de l'aperçu " :
            "de la vignette "))));
  let messageSansLien = type === "sans" ? "" : "sans lien ";
  let rstRehostLink = type === "sans" ? "" : currentRstLink === "image" ? REHOST_URL : REHOST_URL + "view/";
  let rstRehostUrl = type === "sans" ? "" : (type === "full" || lastIsGif) ? REHOST_URL : REHOST_URL + type + "/";
  let rstReturn = currentRstReturn ? "\n" : "";
  if(e.shiftKey) {
    GM.setClipboard(rstRehostUrl + currentUrl + rstReturn);
    if(gmNotif && currentRstNotifs) {
      if(gm4) {
        GM.notification(messageLien + messageType + messagePressePapier, messageTitle, iconRehost);
      } else {
        GM.notification({
          title: messageTitle,
          text: messageLien + messageType + messagePressePapier,
          image: iconRehost,
          timeout: timeOut,
        });
      }
    }
  } else if(e.ctrlKey) {
    GM.setClipboard("[img]" + rstRehostUrl + currentUrl + "[/img]" + rstReturn);
    if(gmNotif && currentRstNotifs) {
      if(gm4) {
        GM.notification(messageBBCode + messageSansLien + messageType + messagePressePapier,
          messageTitle, iconRehost);
      } else {
        GM.notification({
          title: messageTitle,
          text: messageBBCode + messageSansLien + messageType + messagePressePapier,
          image: iconRehost,
          timeout: timeOut,
        });
      }
    }
  } else {
    GM.setClipboard("[url=" + rstRehostLink + currentUrl + "][img]" +
      rstRehostUrl + currentUrl + "[/img][/url]" + rstReturn);
    if(gmNotif && currentRstNotifs) {
      if(gm4) {
        GM.notification(messageBBCode + messageType + messagePressePapier, messageTitle, iconRehost);
      } else {
        GM.notification({
          title: messageTitle,
          text: messageBBCode + messageType + messagePressePapier,
          image: iconRehost,
          timeout: timeOut,
        });
      }
    }
  }
}

function doRstSans(e) {
  doRst(e, "sans");
}

function doRstFull(e) {
  doRst(e, "full");
}

function doRstMedium(e) {
  doRst(e, "medium");
}

function doRstPreview(e) {
  doRst(e, "preview");
}

function doRstThumb(e) {
  doRst(e, "thumb");
}

function doRstConf() {
  showConfigWindow();
}

function doRstIcons() {
  currentRstIcons = !currentRstIcons;
  GM.setValue("rst_icons", currentRstIcons).then(createRehostMenu);
}

function doRstNotifs() {
  currentRstNotifs = !currentRstNotifs;
  GM.setValue("rst_notifs", currentRstNotifs).then(createRehostMenu);
}

function doRstLinkToImage() {
  currentRstLink = "image";
  GM.setValue("rst_link", currentRstLink).then(createRehostMenu);
}

function doRstLinkToPage() {
  currentRstLink = "page";
  GM.setValue("rst_link", currentRstLink).then(createRehostMenu);
}

function doRstReturn() {
  currentRstReturn = !currentRstReturn;
  GM.setValue("rst_return", currentRstReturn).then(createRehostMenu);
}

/* -------------------------------------------------------------- */
/* récupération des paramètres et construction du menu contextuel */
/* -------------------------------------------------------------- */

const REHOST_MENU_ID = "gmr21_rehost_menu_id";

function createRehostMenu() {
  Promise.all([
    GM.getValue("rst_sans", "2"), // "1", "2" ou "0"
    GM.getValue("rst_full", "2"), // "1", "2" (obligatoire)
    GM.getValue("rst_medium", "2"), // "1", "2" ou "0"
    GM.getValue("rst_preview", "2"), // "1", "2" ou "0"
    GM.getValue("rst_thumb", "2"), // "1", "2" ou "0"
    GM.getValue("rst_conf", "2"), // "1", "2" ou "0" si gmMenu sinon  "1", "2"
    GM.getValue("rst_options", true), // true ou false
    GM.getValue("rst_icons", true), // true ou false
    GM.getValue("rst_notifs", true), // true ou false
    GM.getValue("rst_link", "image"), // "image" ou "page"
    GM.getValue("rst_return", false), // true ou false
  ]).then(function([
    rstSans,
    rstFull,
    rstMedium,
    rstPreview,
    rstThumb,
    rstConf,
    rstOptions,
    rstIcons,
    rstNotifs,
    rstLink,
    rstReturn,
  ]) {
    currentRstIcons = rstIcons;
    currentRstNotifs = rstNotifs;
    currentRstLink = rstLink;
    currentRstReturn = rstReturn;
    // correction de la valeur de rstConf si pas de gmMenu
    if(rstConf === "0" && !gmMenu) {
      rstConf = "2";
    }
    // suppression de l'ancien menu contextuel
    let oldMenu = document.getElementById(REHOST_MENU_ID);
    if(oldMenu) oldMenu.parentNode.removeChild(oldMenu);
    // nouveau menu contextuel
    let rehostMenu = document.createElement("menu");
    rehostMenu.setAttribute("id", REHOST_MENU_ID);
    rehostMenu.setAttribute("type", "context");
    // nouveau sous-menu
    let rehostSubMenu = document.createElement("menu");
    rehostSubMenu.setAttribute("label", "Rehost");
    // rehost sans
    if(rstSans !== "0") {
      let rehostMenuItemSans = document.createElement("menuitem");
      rehostMenuItemSans.setAttribute("label", "Rehost sans reho.st");
      if(rstIcons) rehostMenuItemSans.setAttribute("icon", iconSans);
      rehostMenuItemSans.addEventListener("click", doRstSans, false);
      if(rstSans === "1") {
        rehostMenu.appendChild(rehostMenuItemSans);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemSans);
      }
    }
    // rehost full (obliatoire)
    let rehostMenuItemFull = document.createElement("menuitem");
    let isGif = lastIsGif ? " (gif)" : "";
    rehostMenuItemFull.setAttribute("label", "Rehost taille originale" + isGif);
    if(rstIcons) rehostMenuItemFull.setAttribute("icon", iconFull);
    rehostMenuItemFull.addEventListener("click", doRstFull, false);
    if(rstFull === "1") {
      rehostMenu.appendChild(rehostMenuItemFull);
    } else {
      rehostSubMenu.appendChild(rehostMenuItemFull);
    }
    // rehost medium
    if(!lastIsGif && rstMedium !== "0") {
      let rehostMenuItemMedium = document.createElement("menuitem");
      rehostMenuItemMedium.setAttribute("label", "Rehost médium (800px)");
      if(rstIcons) rehostMenuItemMedium.setAttribute("icon", iconMedPrev);
      rehostMenuItemMedium.addEventListener("click", doRstMedium, false);
      if(rstMedium === "1") {
        rehostMenu.appendChild(rehostMenuItemMedium);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemMedium);
      }
    }
    // rehost preview
    if(!lastIsGif && rstPreview !== "0") {
      let rehostMenuItemPreview = document.createElement("menuitem");
      rehostMenuItemPreview.setAttribute("label", "Rehost aperçu (600px)");
      if(rstIcons) rehostMenuItemPreview.setAttribute("icon", iconMedPrev);
      rehostMenuItemPreview.addEventListener("click", doRstPreview, false);
      if(rstPreview === "1") {
        rehostMenu.appendChild(rehostMenuItemPreview);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemPreview);
      }
    }
    // rehost thumb
    if(!lastIsGif && rstThumb !== "0") {
      let rehostMenuItemThumb = document.createElement("menuitem");
      rehostMenuItemThumb.setAttribute("label", "Rehost vignette (230px)");
      if(rstIcons) rehostMenuItemThumb.setAttribute("icon", iconThumb);
      rehostMenuItemThumb.addEventListener("click", doRstThumb, false);
      if(rstThumb === "1") {
        rehostMenu.appendChild(rehostMenuItemThumb);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemThumb);
      }
    }
    // hr 1
    if((rstSans === "2" ||
        rstFull === "2" ||
        (rstMedium === "2" && !lastIsGif) ||
        (rstPreview === "2" && !lastIsGif) ||
        (rstThumb === "2" && !lastIsGif)) &&
      (rstConf === "2")) {
      rehostSubMenu.appendChild(document.createElement("hr"));
    }
    // configuration
    if(rstConf !== "0") {
      let rehostMenuItemConf = document.createElement("menuitem");
      if(rstIcons) rehostMenuItemConf.setAttribute("icon", iconConf);
      rehostMenuItemConf.addEventListener("click", doRstConf, false);
      if(rstConf === "1") {
        rehostMenuItemConf.setAttribute("label", "Configuration de Rehost");
        rehostMenu.appendChild(rehostMenuItemConf);
      } else {
        rehostMenuItemConf.setAttribute("label", "Configuration");
        rehostSubMenu.appendChild(rehostMenuItemConf);
      }
    }
    // hr 2
    if((rstSans === "2" ||
        rstFull === "2" ||
        (rstMedium === "2" && !lastIsGif) ||
        (rstPreview === "2" && !lastIsGif) ||
        (rstThumb === "2" && !lastIsGif) ||
        rstConf === "2") &&
      rstOptions) {
      rehostSubMenu.appendChild(document.createElement("hr"));
    }
    // options
    if(rstOptions) {
      // option icons
      let rehostMenuItemIcons = document.createElement("menuitem");
      rehostMenuItemIcons.setAttribute("type", "checkbox");
      if(rstIcons) {
        rehostMenuItemIcons.setAttribute("checked", true);
      }
      rehostMenuItemIcons.setAttribute("label", "Afficher les icônes");
      rehostMenuItemIcons.addEventListener("click", doRstIcons, false);
      rehostSubMenu.appendChild(rehostMenuItemIcons);
      // option notifications
      let rehostMenuItemNotifs = document.createElement("menuitem");
      rehostMenuItemNotifs.setAttribute("type", "checkbox");
      if(gmNotif && rstNotifs) {
        rehostMenuItemNotifs.setAttribute("checked", true);
      }
      if(!gmNotif) {
        rehostMenuItemNotifs.setAttribute("disabled", true);
      }
      rehostMenuItemNotifs.setAttribute("label", "Notifications");
      rehostMenuItemNotifs.addEventListener("click", doRstNotifs, false);
      rehostSubMenu.appendChild(rehostMenuItemNotifs);
      // option lien image
      let rehostMenuItemLinkToImage = document.createElement("menuitem");
      rehostMenuItemLinkToImage.setAttribute("type", "radio");
      rehostMenuItemLinkToImage.setAttribute("radiogroup", "linkTo");
      if(rstLink === "image") {
        rehostMenuItemLinkToImage.setAttribute("checked", true);
      }
      rehostMenuItemLinkToImage.setAttribute("label", "Lien vers l'image");
      rehostMenuItemLinkToImage.addEventListener("click", doRstLinkToImage, false);
      rehostSubMenu.appendChild(rehostMenuItemLinkToImage);
      // option lien page
      let rehostMenuItemLinkToPage = document.createElement("menuitem");
      rehostMenuItemLinkToPage.setAttribute("type", "radio");
      rehostMenuItemLinkToPage.setAttribute("radiogroup", "linkTo");
      if(rstLink === "page") {
        rehostMenuItemLinkToPage.setAttribute("checked", true);
      }
      rehostMenuItemLinkToPage.setAttribute("label", "Lien vers la page");
      rehostMenuItemLinkToPage.addEventListener("click", doRstLinkToPage, false);
      rehostSubMenu.appendChild(rehostMenuItemLinkToPage);
      // option retour
      let rehostMenuItemReturn = document.createElement("menuitem");
      rehostMenuItemReturn.setAttribute("type", "checkbox");
      if(rstReturn) {
        rehostMenuItemReturn.setAttribute("checked", true);
      }
      rehostMenuItemReturn.setAttribute("label", "Ajouter un retour");
      rehostMenuItemReturn.addEventListener("click", doRstReturn, false);
      rehostSubMenu.appendChild(rehostMenuItemReturn);
    }
    // ajout du sous-menu
    if(rstSans === "2" ||
      rstFull === "2" ||
      (rstMedium === "2" && !lastIsGif) ||
      (rstPreview === "2" && !lastIsGif) ||
      (rstThumb === "2" && !lastIsGif) ||
      rstConf === "2" ||
      rstOptions) {
      rehostMenu.appendChild(rehostSubMenu);
    }
    // ajout du menu
    if(!document.body) {
      new MutationObserver((mutations, observer) => {
        if(document.body) {
          observer.disconnect();
          document.body.appendChild(rehostMenu);
        }
      }).observe(document.documentElement, {
        childList: true
      });
    } else {
      document.body.appendChild(rehostMenu);
    }
  });
}
createRehostMenu();

/* -------------------------------------------------- */
/* ajout du menu contextuel sur les images de la page */
/* -------------------------------------------------- */

function setContextMenuAttribute() {
  let imgs = document.querySelectorAll("img[src]:not([src^='data']):not([contextmenu='" + REHOST_MENU_ID + "'])");
  for(let img of imgs) {
    img.setAttribute("contextmenu", REHOST_MENU_ID);
    img.addEventListener("mouseover", setCurrentUrl, false);
  }
}
setContextMenuAttribute();
var o = new MutationObserver(setContextMenuAttribute);
o.observe(document, {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true
});

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// styles css pour la fenêtre de configuration
var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  "#gm_rst_r21_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:10003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;" +
  "text-align:justify;}" +
  "#gm_rst_r21_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:10001;" +
  "display:block;visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_rst_r21_config_window{position:fixed;width:480px;height:auto;background:#ffffff;z-index:10002;opacity:0;" +
  "visibility:hidden;transition:opacity 0.3s ease 0s;border:1px solid black;padding:16px;display:block;" +
  "box-sizing:content-box;color:#000000;font-variant:normal;}" +
  "#gm_rst_r21_config_window *{box-sizing:content-box;text-align:left;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;" +
  "background:#ffffff;color:#000000;margin:0;padding:0;border:0;font-size:12px;line-height:1.2;}" +
  "#gm_rst_r21_config_window div{display:block;}" +
  "#gm_rst_r21_config_window img{position:static;display:inline;width:auto;height:auto;}" +
  "#gm_rst_r21_config_window input{display:inline;width:auto;height:auto;}" +
  "#gm_rst_r21_config_window label{font-weight:normal;display:inline;}" +
  "#gm_rst_r21_config_window label:before{content:none;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_main_title{font-size:16px;text-align:center;font-weight:bold;" +
  "margin:0 0 16px;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_title{font-size:14px;margin:16px 0 12px;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row{font-size:12px;margin:8px 0 0;display:flex;padding:0 4px;" +
  "flex-direction:row;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell{}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell:first-of-type{width:45%;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell img{vertical-align:bottom;" +
  "margin:0 8px 0 0;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell input[type=\"radio\"]{" +
  "vertical-align:text-bottom;margin:0 4px 1px 32px;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell input[type=\"radio\"]:first-of-type{" +
  "margin-left:0;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p{font-size:12px;margin:8px 0 0;padding:0 4px;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p input[type=\"checkbox\"]{vertical-align:text-bottom;" +
  "margin:0 8px 1px 0;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p input[type=\"radio\"]{vertical-align:text-bottom;margin:0 4px 1px;}" +
  "#gm_rst_r21_config_window label.gm_rst_r21_disabled{color:#808080;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div{text-align:right;margin:16px 0 0;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div div.gm_rst_r21_info_reload_div{float:left;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div div.gm_rst_r21_info_reload_div img" +
  "{vertical-align:text-bottom;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  "#gm_rst_r21_config_window img.gm_rst_r21_help_button{margin-right:1px;cursor:help;}";
document.getElementsByTagName("head")[0].appendChild(style);

// images des boutons de validation et de fermeture
var saveImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var closeImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var helpImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";
var infoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";

// création de la fenêtre d'aide
var helpWindow = document.createElement("div");
helpWindow.setAttribute("id", "gm_rst_r21_help_window");
document.body.appendChild(helpWindow);
helpWindow.style.visibility = "hidden";

// fonction de création du bouton d'aide
function createHelpButton(width, text) {
  let helpButton = document.createElement("img");
  helpButton.setAttribute("src", helpImg);
  helpButton.setAttribute("class", "gm_rst_r21_help_button");
  helpButton.addEventListener("mouseover", function(e) {
    helpWindow.style.width = width + "px";
    helpWindow.textContent = text;
    helpWindow.style.left = (e.clientX + 32) + "px";
    helpWindow.style.top = (e.clientY - 16) + "px";
    helpWindow.style.visibility = "visible";
  }, false);
  helpButton.addEventListener("mouseout", function(e) {
    helpWindow.style.visibility = "hidden";
  }, false);
  return helpButton;
}

// création du voile de fond pour la fenêtre de configuration
var configBackground = document.createElement("div");
configBackground.id = "gm_rst_r21_config_background";
configBackground.addEventListener("click", hideConfigWindow, false);
configBackground.addEventListener("transitionend", backgroundTransitionend, false);
document.body.appendChild(configBackground);
configBackground.style.visibility = "hidden";

// création de la fenêtre de configuration
var configWindow = document.createElement("div");
configWindow.id = "gm_rst_r21_config_window";
document.body.appendChild(configWindow);
configWindow.style.visibility = "hidden";

// titre de la fenêtre de configuration
var mainTitle = document.createElement("div");
mainTitle.className = "gm_rst_r21_main_title";
mainTitle.textContent = "Configuration du script Rehost";
configWindow.appendChild(mainTitle);

// titre de la configuration des menus
var menuTitle = document.createElement("div");
menuTitle.className = "gm_rst_r21_title";
menuTitle.textContent = "Organisation des menus";
configWindow.appendChild(menuTitle);

// sans
var sansRow = document.createElement("div");
sansRow.className = "gm_rst_r21_row";
var sansTitle = document.createElement("div");
sansTitle.className = "gm_rst_r21_cell";
var sansIcon = document.createElement("img");
sansIcon.src = iconSans;
sansTitle.appendChild(sansIcon);
sansTitle.appendChild(document.createTextNode("Rehost sans reho.st :"));
sansRow.appendChild(sansTitle);
var sansRadios = document.createElement("div");
sansRadios.className = "gm_rst_r21_cell";
var sansRadio1 = document.createElement("input");
sansRadio1.type = "radio";
sansRadio1.id = "gm_rst_r21_sans_radio_1";
sansRadio1.name = "gm_rst_r21_sans_radio";
sansRadios.appendChild(sansRadio1);
var sansRadio1Label = document.createElement("label");
sansRadio1Label.htmlFor = "gm_rst_r21_sans_radio_1";
sansRadio1Label.textContent = "menu";
sansRadios.appendChild(sansRadio1Label);
var sansRadio2 = document.createElement("input");
sansRadio2.type = "radio";
sansRadio2.id = "gm_rst_r21_sans_radio_2";
sansRadio2.name = "gm_rst_r21_sans_radio";
sansRadios.appendChild(sansRadio2);
var sansRadio2Label = document.createElement("label");
sansRadio2Label.htmlFor = "gm_rst_r21_sans_radio_2";
sansRadio2Label.textContent = "sous-menu";
sansRadios.appendChild(sansRadio2Label);
var sansRadio0 = document.createElement("input");
sansRadio0.type = "radio";
sansRadio0.id = "gm_rst_r21_sans_radio_0";
sansRadio0.name = "gm_rst_r21_sans_radio";
sansRadios.appendChild(sansRadio0);
var sansRadio0Label = document.createElement("label");
sansRadio0Label.htmlFor = "gm_rst_r21_sans_radio_0";
sansRadio0Label.textContent = "aucun";
sansRadios.appendChild(sansRadio0Label);
sansRow.appendChild(sansRadios);
configWindow.appendChild(sansRow);

// full
var fullRow = document.createElement("div");
fullRow.className = "gm_rst_r21_row";
var fullTitle = document.createElement("div");
fullTitle.className = "gm_rst_r21_cell";
var fullIcon = document.createElement("img");
fullIcon.src = iconFull;
fullTitle.appendChild(fullIcon);
fullTitle.appendChild(document.createTextNode("Rehost taille originale :"));
fullRow.appendChild(fullTitle);
var fullRadios = document.createElement("div");
fullRadios.className = "gm_rst_r21_cell";
var fullRadio1 = document.createElement("input");
fullRadio1.type = "radio";
fullRadio1.id = "gm_rst_r21_full_radio_1";
fullRadio1.name = "gm_rst_r21_full_radio";
fullRadios.appendChild(fullRadio1);
var fullRadio1Label = document.createElement("label");
fullRadio1Label.htmlFor = "gm_rst_r21_full_radio_1";
fullRadio1Label.textContent = "menu";
fullRadios.appendChild(fullRadio1Label);
var fullRadio2 = document.createElement("input");
fullRadio2.type = "radio";
fullRadio2.id = "gm_rst_r21_full_radio_2";
fullRadio2.name = "gm_rst_r21_full_radio";
fullRadios.appendChild(fullRadio2);
var fullRadio2Label = document.createElement("label");
fullRadio2Label.htmlFor = "gm_rst_r21_full_radio_2";
fullRadio2Label.textContent = "sous-menu";
fullRadios.appendChild(fullRadio2Label);
fullRow.appendChild(fullRadios);
configWindow.appendChild(fullRow);

// medium
var mediumRow = document.createElement("div");
mediumRow.className = "gm_rst_r21_row";
var mediumTitle = document.createElement("div");
mediumTitle.className = "gm_rst_r21_cell";
var mediumIcon = document.createElement("img");
mediumIcon.src = iconMedPrev;
mediumTitle.appendChild(mediumIcon);
mediumTitle.appendChild(document.createTextNode("Rehost médium (800px) :"));
mediumRow.appendChild(mediumTitle);
var mediumRadios = document.createElement("div");
mediumRadios.className = "gm_rst_r21_cell";
var mediumRadio1 = document.createElement("input");
mediumRadio1.type = "radio";
mediumRadio1.id = "gm_rst_r21_medium_radio_1";
mediumRadio1.name = "gm_rst_r21_medium_radio";
mediumRadios.appendChild(mediumRadio1);
var mediumRadio1Label = document.createElement("label");
mediumRadio1Label.htmlFor = "gm_rst_r21_medium_radio_1";
mediumRadio1Label.textContent = "menu";
mediumRadios.appendChild(mediumRadio1Label);
var mediumRadio2 = document.createElement("input");
mediumRadio2.type = "radio";
mediumRadio2.id = "gm_rst_r21_medium_radio_2";
mediumRadio2.name = "gm_rst_r21_medium_radio";
mediumRadios.appendChild(mediumRadio2);
var mediumRadio2Label = document.createElement("label");
mediumRadio2Label.htmlFor = "gm_rst_r21_medium_radio_2";
mediumRadio2Label.textContent = "sous-menu";
mediumRadios.appendChild(mediumRadio2Label);
var mediumRadio0 = document.createElement("input");
mediumRadio0.type = "radio";
mediumRadio0.id = "gm_rst_r21_medium_radio_0";
mediumRadio0.name = "gm_rst_r21_medium_radio";
mediumRadios.appendChild(mediumRadio0);
var mediumRadio0Label = document.createElement("label");
mediumRadio0Label.htmlFor = "gm_rst_r21_medium_radio_0";
mediumRadio0Label.textContent = "aucun";
mediumRadios.appendChild(mediumRadio0Label);
mediumRow.appendChild(mediumRadios);
configWindow.appendChild(mediumRow);

// preview
var previewRow = document.createElement("div");
previewRow.className = "gm_rst_r21_row";
var previewTitle = document.createElement("div");
previewTitle.className = "gm_rst_r21_cell";
var previewIcon = document.createElement("img");
previewIcon.src = iconMedPrev;
previewTitle.appendChild(previewIcon);
previewTitle.appendChild(document.createTextNode("Rehost aperçu (600px) :"));
previewRow.appendChild(previewTitle);
var previewRadios = document.createElement("div");
previewRadios.className = "gm_rst_r21_cell";
var previewRadio1 = document.createElement("input");
previewRadio1.type = "radio";
previewRadio1.id = "gm_rst_r21_preview_radio_1";
previewRadio1.name = "gm_rst_r21_preview_radio";
previewRadios.appendChild(previewRadio1);
var previewRadio1Label = document.createElement("label");
previewRadio1Label.htmlFor = "gm_rst_r21_preview_radio_1";
previewRadio1Label.textContent = "menu";
previewRadios.appendChild(previewRadio1Label);
var previewRadio2 = document.createElement("input");
previewRadio2.type = "radio";
previewRadio2.id = "gm_rst_r21_preview_radio_2";
previewRadio2.name = "gm_rst_r21_preview_radio";
previewRadios.appendChild(previewRadio2);
var previewRadio2Label = document.createElement("label");
previewRadio2Label.htmlFor = "gm_rst_r21_preview_radio_2";
previewRadio2Label.textContent = "sous-menu";
previewRadios.appendChild(previewRadio2Label);
var previewRadio0 = document.createElement("input");
previewRadio0.type = "radio";
previewRadio0.id = "gm_rst_r21_preview_radio_0";
previewRadio0.name = "gm_rst_r21_preview_radio";
previewRadios.appendChild(previewRadio0);
var previewRadio0Label = document.createElement("label");
previewRadio0Label.htmlFor = "gm_rst_r21_preview_radio_0";
previewRadio0Label.textContent = "aucun";
previewRadios.appendChild(previewRadio0Label);
previewRow.appendChild(previewRadios);
configWindow.appendChild(previewRow);

// thumb
var thumbRow = document.createElement("div");
thumbRow.className = "gm_rst_r21_row";
var thumbTitle = document.createElement("div");
thumbTitle.className = "gm_rst_r21_cell";
var thumbIcon = document.createElement("img");
thumbIcon.src = iconThumb;
thumbTitle.appendChild(thumbIcon);
thumbTitle.appendChild(document.createTextNode("Rehost vignette (230px) :"));
thumbRow.appendChild(thumbTitle);
var thumbRadios = document.createElement("div");
thumbRadios.className = "gm_rst_r21_cell";
var thumbRadio1 = document.createElement("input");
thumbRadio1.type = "radio";
thumbRadio1.id = "gm_rst_r21_thumb_radio_1";
thumbRadio1.name = "gm_rst_r21_thumb_radio";
thumbRadios.appendChild(thumbRadio1);
var thumbRadio1Label = document.createElement("label");
thumbRadio1Label.htmlFor = "gm_rst_r21_thumb_radio_1";
thumbRadio1Label.textContent = "menu";
thumbRadios.appendChild(thumbRadio1Label);
var thumbRadio2 = document.createElement("input");
thumbRadio2.type = "radio";
thumbRadio2.id = "gm_rst_r21_thumb_radio_2";
thumbRadio2.name = "gm_rst_r21_thumb_radio";
thumbRadios.appendChild(thumbRadio2);
var thumbRadio2Label = document.createElement("label");
thumbRadio2Label.htmlFor = "gm_rst_r21_thumb_radio_2";
thumbRadio2Label.textContent = "sous-menu";
thumbRadios.appendChild(thumbRadio2Label);
var thumbRadio0 = document.createElement("input");
thumbRadio0.type = "radio";
thumbRadio0.id = "gm_rst_r21_thumb_radio_0";
thumbRadio0.name = "gm_rst_r21_thumb_radio";
thumbRadios.appendChild(thumbRadio0);
var thumbRadio0Label = document.createElement("label");
thumbRadio0Label.htmlFor = "gm_rst_r21_thumb_radio_0";
thumbRadio0Label.textContent = "aucun";
thumbRadios.appendChild(thumbRadio0Label);
thumbRow.appendChild(thumbRadios);
configWindow.appendChild(thumbRow);

// conf
var confRow = document.createElement("div");
confRow.className = "gm_rst_r21_row";
var confTitle = document.createElement("div");
confTitle.className = "gm_rst_r21_cell";
var confIcon = document.createElement("img");
confIcon.src = iconConf;
confTitle.appendChild(confIcon);
confTitle.appendChild(document.createTextNode("Configuration de Rehost :"));
confRow.appendChild(confTitle);
var confRadios = document.createElement("div");
confRadios.className = "gm_rst_r21_cell";
var confRadio1 = document.createElement("input");
confRadio1.type = "radio";
confRadio1.id = "gm_rst_r21_conf_radio_1";
confRadio1.name = "gm_rst_r21_conf_radio";
confRadios.appendChild(confRadio1);
var confRadio1Label = document.createElement("label");
confRadio1Label.htmlFor = "gm_rst_r21_conf_radio_1";
confRadio1Label.textContent = "menu";
confRadios.appendChild(confRadio1Label);
var confRadio2 = document.createElement("input");
confRadio2.type = "radio";
confRadio2.id = "gm_rst_r21_conf_radio_2";
confRadio2.name = "gm_rst_r21_conf_radio";
confRadios.appendChild(confRadio2);
var confRadio2Label = document.createElement("label");
confRadio2Label.htmlFor = "gm_rst_r21_conf_radio_2";
confRadio2Label.textContent = "sous-menu";
confRadios.appendChild(confRadio2Label);
var confRadio0 = document.createElement("input");
confRadio0.type = "radio";
confRadio0.id = "gm_rst_r21_conf_radio_0";
confRadio0.name = "gm_rst_r21_conf_radio";
confRadios.appendChild(confRadio0);
var confRadio0Label = document.createElement("label");
confRadio0Label.htmlFor = "gm_rst_r21_conf_radio_0";
confRadio0Label.textContent = "aucun";
confRadios.appendChild(confRadio0Label);
confRow.appendChild(confRadios);
configWindow.appendChild(confRow);

// titre des options
var optionsTitle = document.createElement("div");
optionsTitle.className = "gm_rst_r21_title";
optionsTitle.textContent = "Options";
configWindow.appendChild(optionsTitle);

// options
var optionsP = document.createElement("p");
optionsP.className = "gm_rst_r21_p";
var optionsCheckbox = document.createElement("input");
optionsCheckbox.type = "checkbox";
optionsCheckbox.id = "gm_rst_r21_options_checkbox";
optionsP.appendChild(optionsCheckbox);
var optionsCheckboxLabel = document.createElement("label");
optionsCheckboxLabel.htmlFor = "gm_rst_r21_options_checkbox";
optionsCheckboxLabel.textContent = "Afficher les options dans le sous-menu";
optionsP.appendChild(optionsCheckboxLabel);
configWindow.appendChild(optionsP);

// icons
var iconsP = document.createElement("p");
iconsP.className = "gm_rst_r21_p";
var iconsCheckbox = document.createElement("input");
iconsCheckbox.type = "checkbox";
iconsCheckbox.id = "gm_rst_r21_icons_checkbox";
iconsP.appendChild(iconsCheckbox);
var iconsCheckboxLabel = document.createElement("label");
iconsCheckboxLabel.htmlFor = "gm_rst_r21_icons_checkbox";
iconsCheckboxLabel.textContent = "Afficher les icônes dans les menus";
iconsP.appendChild(iconsCheckboxLabel);
configWindow.appendChild(iconsP);

// notifs
var notifsP = document.createElement("p");
notifsP.className = "gm_rst_r21_p";
var notifsCheckbox = document.createElement("input");
notifsCheckbox.type = "checkbox";
notifsCheckbox.id = "gm_rst_r21_notifs_checkbox";
notifsP.appendChild(notifsCheckbox);
var notifsCheckboxLabel = document.createElement("label");
notifsCheckboxLabel.htmlFor = "gm_rst_r21_notifs_checkbox";
notifsCheckboxLabel.textContent = "Afficher les notifications";
notifsP.appendChild(notifsCheckboxLabel);
configWindow.appendChild(notifsP);

// link
var linkP = document.createElement("p");
linkP.className = "gm_rst_r21_p";
linkP.appendChild(document.createTextNode("Lien sur l'image : "));
var linkImageRadioLabel = document.createElement("label");
linkImageRadioLabel.htmlFor = "gm_rst_r21_link_image_radio";
linkImageRadioLabel.textContent = "vers la taille originale";
linkP.appendChild(linkImageRadioLabel);
var linkImageRadio = document.createElement("input");
linkImageRadio.type = "radio";
linkImageRadio.id = "gm_rst_r21_link_image_radio";
linkImageRadio.name = "gm_rst_r21_link_radio";
linkP.appendChild(linkImageRadio);
var linkPageRadio = document.createElement("input");
linkPageRadio.type = "radio";
linkPageRadio.id = "gm_rst_r21_link_page_radio";
linkPageRadio.name = "gm_rst_r21_link_radio";
linkP.appendChild(linkPageRadio);
var linkPageRadioLabel = document.createElement("label");
linkPageRadioLabel.htmlFor = "gm_rst_r21_link_page_radio";
linkPageRadioLabel.textContent = "vers la page de partage";
linkP.appendChild(linkPageRadioLabel);
configWindow.appendChild(linkP);

// return
var returnP = document.createElement("p");
returnP.className = "gm_rst_r21_p";
var returnCheckbox = document.createElement("input");
returnCheckbox.type = "checkbox";
returnCheckbox.id = "gm_rst_r21_return_checkbox";
returnP.appendChild(returnCheckbox);
var returnCheckboxLabel = document.createElement("label");
returnCheckboxLabel.htmlFor = "gm_rst_r21_return_checkbox";
returnCheckboxLabel.textContent = "Ajouter un retour à la ligne après l'image";
returnP.appendChild(returnCheckboxLabel);
configWindow.appendChild(returnP);

// info "sans rechargement" et boutons de validation et de fermeture
var saveCloseDiv = document.createElement("div");
saveCloseDiv.className = "gm_rst_r21_save_close_div";
var infoReloadDiv = document.createElement("div");
infoReloadDiv.className = "gm_rst_r21_info_reload_div";
var infoReloadImg = document.createElement("img");
infoReloadImg.setAttribute("src", infoImg);
infoReloadDiv.appendChild(infoReloadImg);
infoReloadDiv.appendChild(document.createTextNode(" sans rechargement "));
infoReloadDiv.appendChild(createHelpButton(255,
  "Les paramètres de cette fenêtre de configuration sont appliqués immédiatement à la validation, " +
  "il n'est pas nécessaire de recharger la page."));
saveCloseDiv.appendChild(infoReloadDiv);
var saveButton = document.createElement("img");
saveButton.src = saveImg;
saveButton.setAttribute("title", "Valider");
saveButton.addEventListener("click", saveConfigWindow, false);
saveCloseDiv.appendChild(saveButton);
var closeButton = document.createElement("img");
closeButton.src = closeImg;
closeButton.setAttribute("title", "Annuler");
closeButton.addEventListener("click", hideConfigWindow, false);
saveCloseDiv.appendChild(closeButton);
configWindow.appendChild(saveCloseDiv);

// fonction de validation de la fenêtre de configuration
function saveConfigWindow() {
  // fermeture de la fenêtre
  hideConfigWindow();
  // sauvegarde des paramètres de la fenêtre de configuration
  let rstSans = sansRadio1.checked ? "1" : sansRadio2.checked ? "2" : "0";
  let rstFull = fullRadio1.checked ? "1" : "2";
  let rstMedium = mediumRadio1.checked ? "1" : mediumRadio2.checked ? "2" : "0";
  let rstPreview = previewRadio1.checked ? "1" : previewRadio2.checked ? "2" : "0";
  let rstThumb = thumbRadio1.checked ? "1" : thumbRadio2.checked ? "2" : "0";
  let rstConf = confRadio1.checked ? "1" : confRadio2.checked ? "2" : "0";
  let rstOptions = optionsCheckbox.checked;
  let rstIcons = iconsCheckbox.checked;
  let rstNotifs = notifsCheckbox.checked;
  if(!gmNotif) {
    rstNotifs = notifsCheckbox.dataset.value === "true";
  }
  let rstLink = linkImageRadio.checked ? "image" : "page";
  let rstReturn = returnCheckbox.checked;
  currentRstIcons = rstIcons;
  currentRstNotifs = rstNotifs;
  currentRstLink = rstLink;
  currentRstReturn = rstReturn;
  Promise.all([
    GM.setValue("rst_sans", rstSans),
    GM.setValue("rst_full", rstFull),
    GM.setValue("rst_medium", rstMedium),
    GM.setValue("rst_preview", rstPreview),
    GM.setValue("rst_thumb", rstThumb),
    GM.setValue("rst_conf", rstConf),
    GM.setValue("rst_options", rstOptions),
    GM.setValue("rst_icons", rstIcons),
    GM.setValue("rst_notifs", rstNotifs),
    GM.setValue("rst_link", rstLink),
    GM.setValue("rst_return", rstReturn),
  ]).then(function() {
    createRehostMenu();
  });
}

// fonction de fermeture de la fenêtre de configuration
function hideConfigWindow() {
  configWindow.style.opacity = "0";
  configBackground.style.opacity = "0";
}

// fonction de fermeture de la fenêtre de configuration par la touche echap
function escConfigWindow(e) {
  if(e.key === "Escape") {
    hideConfigWindow();
  }
}

// fonction de gestion de la fin de la transition d'affichage / disparition de la fenêtre de configuration
function backgroundTransitionend() {
  if(configBackground.style.opacity === "0") {
    configWindow.style.visibility = "hidden";
    configBackground.style.visibility = "hidden";
    document.removeEventListener("keydown", escConfigWindow, false);
  }
  if(configBackground.style.opacity === "0.8") {
    document.addEventListener("keydown", escConfigWindow, false);
  }
}

// fonction d'affichage de la fenêtre de configuration
function showConfigWindow() {
  // initialisation des paramètres de la fenêtre de configuration
  Promise.all([
    GM.getValue("rst_sans", "2"), // "1", "2" ou "0"
    GM.getValue("rst_full", "2", ), // "1", "2" (obligatoire)
    GM.getValue("rst_medium", "2"), // "1", "2" ou "0"
    GM.getValue("rst_preview", "2"), // "1", "2" ou "0"
    GM.getValue("rst_thumb", "2"), // "1", "2" ou "0"
    GM.getValue("rst_conf", "2"), // "1", "2" ou "0" si gmMenu sinon  "1", "2"
    GM.getValue("rst_options", true), // true ou false
    GM.getValue("rst_icons", true), // true ou false
    GM.getValue("rst_notifs", true), // true ou false
    GM.getValue("rst_link", "image"), // "image" ou "page"
    GM.getValue("rst_return", false), // true ou false
  ]).then(function([
    rstSans,
    rstFull,
    rstMedium,
    rstPreview,
    rstThumb,
    rstConf,
    rstOptions,
    rstIcons,
    rstNotifs,
    rstLink,
    rstReturn,
  ]) {
    if(!gmMenu) {
      confRadio0.disabled = true;
      confRadio0Label.className = "gm_rst_r21_disabled";
      if(rstConf === "0") {
        rstConf = "2";
      }
    }
    currentRstIcons = rstIcons;
    currentRstNotifs = rstNotifs;
    currentRstLink = rstLink;
    currentRstReturn = rstReturn;
    sansRadio1.checked = rstSans === "1";
    sansRadio2.checked = rstSans === "2";
    sansRadio0.checked = rstSans === "0";
    fullRadio1.checked = rstFull === "1";
    fullRadio2.checked = rstFull === "2";
    mediumRadio1.checked = rstMedium === "1";
    mediumRadio2.checked = rstMedium === "2";
    mediumRadio0.checked = rstMedium === "0";
    previewRadio1.checked = rstPreview === "1";
    previewRadio2.checked = rstPreview === "2";
    previewRadio0.checked = rstPreview === "0";
    thumbRadio1.checked = rstThumb === "1";
    thumbRadio2.checked = rstThumb === "2";
    thumbRadio0.checked = rstThumb === "0";
    confRadio1.checked = rstConf === "1";
    confRadio2.checked = rstConf === "2";
    confRadio0.checked = rstConf === "0";
    optionsCheckbox.checked = rstOptions;
    iconsCheckbox.checked = rstIcons;
    notifsCheckbox.checked = rstNotifs;
    linkImageRadio.checked = rstLink === "image";
    linkPageRadio.checked = rstLink === "page";
    returnCheckbox.checked = rstReturn;
    if(!gmNotif) {
      notifsCheckbox.checked = false;
      notifsCheckbox.disabled = true;
      notifsCheckboxLabel.className = "gm_rst_r21_disabled";
      notifsCheckbox.dataset.value = rstNotifs;
    }
    // affichage de la fenêtre de configuration
    configWindow.style.visibility = "visible";
    configBackground.style.visibility = "visible";
    configWindow.style.left =
      parseInt((document.documentElement.clientWidth - configWindow.offsetWidth) / 2, 10) + "px";
    configWindow.style.top = document.documentElement.clientHeight ?
      parseInt((document.documentElement.clientHeight - configWindow.offsetHeight) / 2, 10) + "px" :
      "calc((100vh - " + configWindow.offsetHeight + "px) / 2)";
    configBackground.style.width = document.documentElement.scrollWidth + "px";
    configBackground.style.height = document.documentElement.scrollHeight ?
      document.documentElement.scrollHeight + "px" :
      "100vh";
    configWindow.style.opacity = "1";
    configBackground.style.opacity = "0.8";
  });
}

// ajout de l'ouverture de la fenêtre configuration dans le menu greasemonkey si c'est possible
if(gmMenu) {
  GM_registerMenuCommand("Rehost -> Configuration", showConfigWindow);
}
