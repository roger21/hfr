// ==UserScript==
// @name          [HFR] Ouverture en masse mod_r21
// @version       3.2.0
// @namespace     http://toyonos.info
// @description   Permet d'ouvrir ses drapeaux dans de nouveaux onglets pour une catégorie donnée
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/forum1.php*
// @include       https://forum.hardware.fr/forum1f.php*
// @include       https://forum.hardware.fr/*/liste_sujet-*.htm
// @author        toyonos
// @modifications refonte du code, ajout du support pour le clic-milieu (même effet), augmentation du délai d'auto-refresh à 5 secondes, ajout du tooltip sur les mps, sauvegarde des topics bloqués, gestion de toutes les pages de drapals et gestion des nouveaux topics
// @modtype       évolution de fonctionnalités
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
// ==/UserScript==

// modifications roger21 $Rev: 397 $

// historique :
// 3.2.0 (05/08/2018) :
// - nouveau nom : [HFR] ouverture de drapeaux en masse mod_r21 -> [HFR] Ouverture en masse mod_r21
// - ajout d'une vérification sur la cat pour éviter un plantage avec Multi MP
// - correction de la gestion de la checkbox (plus dépandante de la présence du drapal)
// 3.1.1 (26/05/2018) :
// - ajout du support pour la cat shop
// - ajout d'une petite astuce esthétique pour que le titre de la cat reste ->
// centré malgré le bouton (et uniquement si le bouton fait 16px :o)
// 3.1.0 (13/05/2018) :
// - check du code dans tm
// - recodage en fetch (pour ne pas dépendre de GM_xmlhttpRequest)
// - suppression des @grant inutiles
// - maj de la metadata @homepageURL
// 3.0.2 (28/11/2017) :
// - passage au https
// 3.0.1 (09/10/2017) :
// - ajout du paramètre open_in_background à true
// 3.0.0 (17/09/2017) :
// - gestion de l'enregistrement des topics bloqués
// - gestion des pages de drapals par cat
// - gestion des pages des nouveaux topics
// - suppression de la toyoAjaxLib, remplacée par GM_xmlhttpRequest
// - suppression de getElementByXpath, remplacée par des querySelector
// - refonte, simplification et modernisation du code
// 2.1.0 (29/07/2017) :
// - getsion de la compatibilité avec [HFR] new page number version 2.2.0+
// 2.0.1 (11/12/2016) :
// - suppression de la majuscule sur les titles (tooltips) (j'aime pas les majuscules !)
// - ajout du title (tooltip) sur le bouton des mps quand y'a ouverture en masse de mps
// - homogénéisation du code des auto-refresh
// 2.0.0 (02/12/2016) :
// - nouveau numéro de version : 0.2.4.10 -> 2.0.0
// - nouveau nom : [HFR] Ouverture de drapeaux en masse -> [HFR] ouverture de drapeaux en masse mod_r21
// - mise a jour des metadata pour la publication (@modifications, @modtype)
// - ajout du support pour le clic-milieu (en mouseup) (même effet)
// - augmentation du délai d'auto-refresh de 1 seconde à 5 secondes
// - raccourcissement des textes dans les tooltip (title)
// - légère modification des messages de configuration
// - remplacement des ' par des " (pasque !)
// - compression de l'image (pngoptimizer)
// 0.2.4.10 (03/11/2016) :
// - amélioration du bidouillage d'alignement des icones
// 0.2.4.9 (26/10/2016) :
// - bidouillage pour améliorer le centrage de l'icone par cat
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.2.4.8 (22/11/2015) :
// - correction de bugs sur les fonctions de modification des paramètres
// 0.2.4.7 (16/08/2015) :
// - suppression du contournement
// 0.2.4.6 (03/08/2015) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'un contournement pour l'imposssibilité de réouvrir les onglets fermés
// - reencodage de l'image en base64
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - suppression du module d'auto-update (code mort)
// 0.2.4.5 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.2.4.4 (27/03/2014) :
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.2.4.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.2.4.2 (14/09/2012) :
// - ajout des metadata @grant
// 0.2.4.1 (28/11/2011) :
// - désactivation du message d'erreur XML dans la toyolib
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

// délai d'auto refresh à 5 secondes (si activé via le menu)
var refreshTimeout = 5000;

// force l'ouverture des onglets en arrière plan
var open_in_background = true;

// image initiale des 2 boutons (modifiable via les menus)
var baseImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABeklEQVQ4y8WTO0tDQRCFv31gp0IMiE9EEAyiQRQUW7EQrfwHt1UbO8FaSGOlsZKk18YHpPCBiCEEbGI0dkpIQDCaIqQwJFzX4upNfGHAwgPLzCw7Z3bO7ghjDH%2BB5I%2F4fwINEA6HJ4FVYKzOvDtgybKsff22se73%2B3ytrV4AhAAQb37VOr7g8THfe3FxGQRcAq%2FH00wm80ClYju9SekmCSHcWGtNR0cLgNdtwYFAKYVtG%2FdwLUmVQCGl%2BqjBe0WlNFrzIeGzVUoihPxKIIREKYkx%2BtvqiUyMy2yM4nOBcqWMV3ZrsBChUMj09HQxNDTgilcVzIlPEgeknqKM%2BEbp9PRxmtolfn1OU7HfuUE6nSWdzv74Zme5beZmprGljb9tiuObHcYHJ9jZi4Ax5tc1uzJsItdbphb7yaAZW2gzdf3EfCFXSt3HCBxZAAQOLW5zSYBSXQQv5mUtnozRgObgapMGoYkmzgCCot5xHl9sDwDzQCNQBDbjG%2FfLr4sBmbSALg9yAAAAAElFTkSuQmCC";

// gestion des paramètres et des menus pour les modifier
var tabsNumber = GM_getValue("hfr_odm_tabsNumber", 10);
// tabsNumber
function setTabsNumber() {
  let l_tabsNumber = prompt("Nombre de topics à ouvrir simultanément ?", tabsNumber);
  if(l_tabsNumber === null || l_tabsNumber.match(/^([0-9]+)$/) === null) return;
  GM_setValue("hfr_odm_tabsNumber", l_tabsNumber);
  tabsNumber = l_tabsNumber;
  let l_generalButton = document.querySelector("img.hfr_odm_generalButton");
  if(l_generalButton !== null) {
    l_generalButton.title = "ouvrir les " + tabsNumber + " premiers " + topicsType;
  }
  let l_catButtons = document.querySelectorAll("img.hfr_odm_catButton");
  for(let l_catButton of l_catButtons) {
    l_catButton.title = "ouvrir les " + tabsNumber + " premiers " + topicsType + " de cette catégorie";
  }
}
GM_registerMenuCommand("[HFR] Ouverture en masse -> Nombre de topics", setTabsNumber);
var imgUrl2 = GM_getValue("hfr_odm_imgUrl2", "");
// imgUrl2
function setImgUrl2() {
  let l_imgUrl2 = prompt("Url de l'image toutes cats ? (vide = image par défaut)", imgUrl2);
  if(l_imgUrl2 === null) return;
  GM_setValue("hfr_odm_imgUrl2", l_imgUrl2);
  imgUrl2 = l_imgUrl2;
  let l_generalButton = document.querySelector("img.hfr_odm_generalButton");
  if(l_generalButton !== null) {
    l_generalButton.src = imgUrl2;
  }
}
GM_registerMenuCommand("[HFR] Ouverture en masse -> Url de l'image toutes cats", setImgUrl2);
var imgUrl = GM_getValue("hfr_odm_imgUrl", "");
// imgUrl
function setImgUrl() {
  let l_imgUrl = prompt("Url de l'image par cat ? (vide = image par défaut)", imgUrl);
  if(l_imgUrl === null) return;
  GM_setValue("hfr_odm_imgUrl", l_imgUrl);
  imgUrl = l_imgUrl;
  let l_catButtons = document.querySelectorAll("img.hfr_odm_catButton");
  for(let l_catButton of l_catButtons) {
    l_catButton.src = imgUrl;
  }
}
GM_registerMenuCommand("[HFR] Ouverture en masse -> Url de l'image par cat", setImgUrl);
var refreshLocation = GM_getValue("hfr_odm_refreshLocation", "true");
// refreshLocation
function setRefreshLocation() {
  let l_refreshLocation = prompt("Auto-rafraîchissement de la page des drapals ? (true ou false)", refreshLocation);
  if(l_refreshLocation !== "true" && l_refreshLocation !== "false") return;
  GM_setValue("hfr_odm_refreshLocation", l_refreshLocation);
  refreshLocation = l_refreshLocation;
}
GM_registerMenuCommand("[HFR] Ouverture en masse -> Auto-rafraîchissement", setRefreshLocation);

// récupération de la liste des topics
var newTopics = false;
var topicsType = "drapaux";
if(window.location.href.indexOf("&new=1&") !== -1) {
  newTopics = true;
  topicsType = "nouveaux topics";
}
var topics = null;
if(newTopics) {
  topics = document.querySelectorAll("tr.sujet.ligne_booleen:not(.ligne_sticky) td.sujetCase3 a");
} else {
  topics = document.querySelectorAll("tr.sujet.ligne_booleen td.sujetCase5 a");
  topics_checkbox = document.querySelectorAll("tr.sujet.ligne_booleen");
}

// gestion des topics bloqués
if(!newTopics) {
  var topicsBloques = JSON.parse(GM_getValue("hfr_odm_topicsBloques", JSON.stringify([])));
  // ajout de la fonction de gestion sur les checkboxes et mise à jour des checkboxes en fonction de la liste des topics bloqués
  for(let l_drapal of topics_checkbox) {
    let l_checkbox = l_drapal.querySelector("td.sujetCase10 input[name^=\"topic\"][type=\"checkbox\"]");
    if(l_checkbox !== null) {
      let l_cat = l_checkbox.parentElement.querySelector("input[name^=\"valuecat\"][type=\"hidden\"]").value;
      let l_topic = l_cat + "_" + l_checkbox.value;
      l_checkbox.dataset.topic = l_topic;
      l_checkbox.checked = (topicsBloques.indexOf(l_topic) !== -1);
      l_checkbox.addEventListener("change", toggleTopic, false);
    }
  }
}
// fonction de gestion ajout/suppression d'un topic bloqué
function toggleTopic() {
  let l_topic = this.dataset.topic;
  let l_index = topicsBloques.indexOf(l_topic);
  if(l_index === -1) {
    topicsBloques.push(l_topic);
  } else {
    topicsBloques.splice(l_index, 1);
  }
  GM_setValue("hfr_odm_topicsBloques", JSON.stringify(topicsBloques));
}

// gestion de l'ouverture en masse
var cat2cat = {
  "service-client-shophfr": "31",
  Hardware: "1",
  HardwarePeripheriques: "16",
  OrdinateursPortables: "15",
  OverclockingCoolingModding: "2",
  electroniquedomotiquediy: "30",
  gsmgpspda: "23",
  apple: "25",
  VideoSon: "3",
  Photonumerique: "14",
  JeuxVideo: "5",
  WindowsSoftware: "4",
  reseauxpersosoho: "22",
  systemereseauxpro: "21",
  OSAlternatifs: "11",
  Programmation: "10",
  Graphisme: "12",
  AchatsVentes: "6",
  EmploiEtudes: "8",
  Setietprojetsdistribues: "9",
  Discussions: "13"
};
// fonction de récupération de la cat du topic
function getTopicCat(p_href) {
  if(p_href.indexOf(".htm") !== -1) { // url verbeuse
    return cat2cat[/\/hfr\/([^\/]+)\//.exec(p_href)[1]];
  } else { // url à paramètres
    return /&cat=([0-9]+)&(subcat|post)=/.exec(p_href)[1];
  }
}
// fonction d'ouverture en masse
function openAll(p_event) {
  if(p_event.button === 0 || p_event.button === 1) {
    // récupération de la cat du bouton si elle existe
    let l_cat = (typeof this.dataset !== "undefined" && typeof this.dataset.cat !== "undefined") ? this.dataset.cat : null;
    // ouverture des topics
    let l_openMax = tabsNumber;
    for(let l_topic of topics) {
      if(l_openMax > 0) {
        let l_href = l_topic.hasAttribute("href") ? l_topic.href : (typeof l_topic.dataset.href !== "undefined") ? l_topic.dataset.href : null;
        if(l_href !== null && (l_cat === null || l_cat === getTopicCat(l_href))) {
          let l_checkbox = l_topic.parentElement.parentElement.querySelector("td.sujetCase10 input[name^=\"topic\"][type=\"checkbox\"]");
          if(l_checkbox === null || !l_checkbox.checked) {
            GM_openInTab(l_href, open_in_background);
            --l_openMax;
          }
        }
      }
    }
    // rafraichissement de la page si configuré
    if(refreshLocation === "true") {
      setTimeout(function() {
        window.location.reload(true);
      }, refreshTimeout);
    }
  }
}
// construction de la liste des cats ayant des topics
var cats = [];
for(let l_topic of topics) {
  let l_href = l_topic.hasAttribute("href") ? l_topic.href : (typeof l_topic.dataset.href !== "undefined") ? l_topic.dataset.href : null;
  if(l_href !== null) {
    let l_cat = getTopicCat(l_href);
    if(cats.indexOf(l_cat) === -1) {
      cats.push(l_cat);
    }
  }
}

// ajout du bouton toutes cats
var generalTr = document.querySelector("table.main tr.cBackHeader.fondForum1Description");
if(generalTr && topics.length > 0) {
  let l_generalButton = document.createElement("img");
  l_generalButton.style.cursor = "pointer";
  l_generalButton.style.marginLeft = "5px";
  l_generalButton.src = (imgUrl2 === "") ? baseImg : imgUrl2;
  l_generalButton.alt = "ODM";
  l_generalButton.title = "ouvrir les " + tabsNumber + " premiers " + topicsType;
  l_generalButton.setAttribute("class", "hfr_odm_generalButton");
  l_generalButton.addEventListener("mouseup", openAll, false);
  generalTr.firstElementChild.textContent = "";
  generalTr.firstElementChild.style.textAlign = "left";
  generalTr.firstElementChild.appendChild(l_generalButton);
}

// ajout des boutons par cat
var catTrs = document.querySelectorAll("table.main tr.cBackHeader.fondForum1fCat th.padding");
for(let l_catTr of catTrs) {
  if(l_catTr.querySelector("a.cHeader") && l_catTr.querySelector("a.cHeader").href) {
    let l_cat = l_catTr.querySelector("a.cHeader").href.match(/&cat=([0-9]+)&/);
    if(l_cat) {
      l_cat = l_cat.pop();
      if(cats.indexOf(l_cat) !== -1) {
        let l_catButton = document.createElement("img");
        l_catButton.dataset.cat = l_cat;
        l_catButton.style.cursor = "pointer";
        l_catButton.style.float = "left";
        l_catButton.style.marginLeft = "7px";
        l_catButton.style.marginRight = "-23px";
        l_catButton.src = (imgUrl === "") ? baseImg : imgUrl;
        l_catButton.alt = "ODM";
        l_catButton.title = "ouvrir les " + tabsNumber + " premiers " + topicsType + " de cette catégorie";
        l_catButton.setAttribute("class", "hfr_odm_catButton");
        l_catButton.addEventListener("mouseup", openAll, false);
        l_catTr.insertBefore(l_catButton, l_catTr.firstElementChild);
      }
    }
  }
}

// le bouton des mps
var newMps = document.querySelector("table.none tr td div.left div.left a.red");
if(newMps) {
  // récupération des mps
  fetch("https://forum.hardware.fr/forum1.php?config=hfr.inc&cat=prive&page=1", {
    method: "GET",
    mode: "same-origin",
    credentials: "same-origin",
    cache: "reload",
    referrer: "",
    referrerPolicy: "no-referrer"
  }).then(function(r) {
    return r.text();
  }).then(function(r) {
    let mps = [];
    let p = new DOMParser();
    let d = p.parseFromString(r, "text/html");
    let l = d.documentElement.querySelectorAll("table tr.sujet.ligne_booleen td.sujetCase1 img[alt=\"On\"]");
    for(let m of l) {
      mps.push(m.parentElement.parentElement.querySelector("td.sujetCase9 a").href);
    }
    // modification du lien si besoin
    if(mps.length > 1) {
      newMps.removeAttribute("href");
      newMps.style.cursor = "pointer";
      newMps.title = "ouvrir les " + mps.length + " nouveaux mps";
      newMps.addEventListener("mouseup", function(event) {
        if(event.button === 0 || event.button === 1) {
          for(let mp of mps) {
            GM_openInTab(mp, open_in_background);
          }
          // rafraichissement de la page si configuré
          if(refreshLocation === "true") {
            setTimeout(function() {
              window.location.reload(true);
            }, refreshTimeout);
          }
        }
      }, false);
    }
  }).catch(function(e) {
    console.log("[HFR] Ouverture en masse mod_r21 ERROR fetch : " + e);
  });
}
