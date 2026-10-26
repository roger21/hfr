// ==UserScript==
// @name          [HFR] Permalien
// @version       3.0.0
// @namespace     roger21.free.fr
// @description   Ajoute un lien permanent sur les posts (dans la barre des boutons des posts, à droite) et un lien minimal sur le topic (dans la barre de recherche du topic en haut, à droite).
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_permalien.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_permalien.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_permalien.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   https://roger21.pages-perso.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.setClipboard
// @grant         GM_setClipboard
// @grant         GM.registerMenuCommand
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2017-2021, 2026 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 5146 $

// historique :
// 3.0.0 (26/10/2026) :
// - ajout d'un lien minimal sur le topic dans la barre de recherche du topic, à droite
// - possibilité de copier le lien permanent et le lien minimal dans le presse-papier ->
// avec un clic simple au lieu d'ouvrir le lien (configurable et désactivé par défaut)
// - ajout de 4 autres options en dur dans le code
// - correction des regexps
// 2.1.8 (08/09/2026) :
// - mise à jour des cats (nouvelle cat ia)
// - simplification du code de gestion des cats
// 2.1.7 (13/01/2026) :
// - réorganisation de la liste des cats
// 2.1.6 (04/03/2021) :
// - ajout du support pour les résultats des recherches intra-topic
// 2.1.5 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.1.4 (04/01/2020) :
// - ajout d'un title sur le lien
// 2.1.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 2.1.2 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.1.1 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+
// 2.1.0 (15/08/2018) :
// - nouveau nom : [HFR] permalien -> [HFR] Permalien
// - ajout de la metadata @author (roger21)
// 2.0.2 (26/05/2018) :
// - ajout du support pour la cat shop
// 2.0.1 (13/05/2018) :
// - maj de la metadata @homepageURL
// 2.0.0 (12/04/2018) :
// - nouveau nom : [HFR] urgo -> [HFR] permalien
// - nouvelle icône pour le lien (dans la barre du message à droite)
// - gestion des urls verbeuses
// - nouvelle description
// - suppression des @grant inutiles (tous)
// 1.1.2 (28/11/2017) :
// - passage au https
// 1.1.1 (28/07/2017) :
// - commentage des logs de debug
// - légère amélioration du code
// 1.1.0 (15/07/2017) :
// - ajout du support pour les topics sans sous cat
// 1.0.0 (15/01/2017) :
// - ça a l'air bon :o
// - commentage des logs de debug
// 0.9.0 (15/01/2017) :
// - création

/* -------------- */
/* options en dur */
/* -------------- */

// affichage de la tooltip sur le clic (pour la copie dans le presse-papier)
// mettre à false pour désactiver
const tooltip_display = true; // true, false

// ouverture des liens dans un nouvel onglet (avec un « target="_blank" »)
// mettre à true pour activer
const target_blank = false; // false, true

// ajout de la page courante dans le lien minimal
// mettre à true pour activer
const minilink_page = false; // false, true

// version avec paramètres du lien minimal (au lieu de la version verbeuse)
// mettre à true pour activer
const minilink_params = false; // false, true

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
let gmMenu = GM.registerMenuCommand || GM_registerMenuCommand;

/* ---------- */
/* constantes */
/* ---------- */

const script_name = "[HFR] Permalien";
const class_name = "hfr_permalien_click";
const data_name = "hfrpermalienclick";
const tooltip_id = "hfr_permalien_tooltip";
const tooltip_time = 1500; // 1,5s

const cat2id = {
  "Hardware": "1",
  "HardwarePeripheriques": "16",
  "OrdinateursPortables": "15",
  "OverclockingCoolingModding": "2",
  "electroniquedomotiquediy": "30",
  "gsmgpspda": "23",
  "apple": "25",
  "VideoSon": "3",
  "Photonumerique": "14",
  "JeuxVideo": "5",
  "WindowsSoftware": "4",
  "reseauxpersosoho": "22",
  "systemereseauxpro": "21",
  "OSAlternatifs": "11",
  "Programmation": "10",
  "ia": "32",
  "Graphisme": "12",
  "AchatsVentes": "6",
  "EmploiEtudes": "8",
  "Discussions": "13",
  "service-client-shophfr": "31",
  "Setietprojetsdistribues": "9",
};

const id2caturl = {
  "1": "Hardware",
  "16": "HardwarePeripheriques",
  "15": "OrdinateursPortables",
  "2": "OverclockingCoolingModding",
  "30": "electroniquedomotiquediy",
  "23": "gsmgpspda",
  "25": "apple",
  "3": "VideoSon",
  "14": "Photonumerique",
  "5": "JeuxVideo",
  "4": "WindowsSoftware",
  "22": "reseauxpersosoho",
  "21": "systemereseauxpro",
  "11": "OSAlternatifs",
  "10": "Programmation",
  "32": "ia",
  "12": "Graphisme",
  "6": "AchatsVentes",
  "8": "EmploiEtudes",
  "13": "Discussions",
  "31": "service-client-shophfr",
  "9": "Setietprojetsdistribues",
};

const img_link = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABV0lEQVR42r2Su0oDQRSG15DCJtiqiakSgnkPIWAtbjSFlqI+gq1PYJFGgnGzc9lZC0F7kajgBW18DbVSBNFvkhECrsnGwoGfnWHPd86cf47npVydWGSCWEx4f1kiUgUVqQaqi0gWxoJlJKtK6zut9Qf6VFrdSC2rKWFVBnpAT4DLnH32byS8IElpKAwwidoOrg0kXbA3QdujEuTQI9VOgHZEJCq9BEY2XIKNYZUtPIWaLtj2voYfK+58Fho5neC2LBN40K+smlTedcA7LxC7fTc0YSHJ7Xl+3qNnrn06UBlQ7bG/QvtBIqxVnp/X6IVEi7bnPkxl4MAEOW4w2zpuZ39e24gMQav2nfnWndMV9utA2lZmkPK/um3HE6BnDoA/8FxLro1W6+gwO2JUxRwVbwl+pYUa8h18idvFdFOneyPb/TYPneN2cby5N7IEuEWizY4JZ7z/WF87+x0mY0rJLAAAAABJRU5ErkJggg==";
const img_link_topic = img_link;

/* ----------------- */
/* option par défaut */
/* ----------------- */

const hfr_permalien_click_default = "non"; // non, oui

/* ------------------ */
/* variables globales */
/* ------------------ */

let cat;
let topic;
let page;
let hfr_permalien_click;
let tooltip;
let tooltip_timer;
let recherche = false;

/* ----------------------------------------------- */
/* fonctions pour la gestion du clic sur les liens */
/* ----------------------------------------------- */

function create_tooltip() {
  let style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent = `div#${tooltip_id}{
    position:absolute;
    top:0;
    left:0;
    display:block;
    visibility:hidden;
    opacity:0;
    z-index:1001;
    cursor:pointer;
    box-sizing:border-box;
    padding:2px 6px 3px;
    border-radius:5px;
    font-family:Verdana,Arial,Sans-serif,Helvetica;
    font-size:11px;
    color:#fff;
    background-color:#333;
    text-align:center;
    white-space:nowrap;
    transition:opacity 0.5s ease-in-out 0s;
  }`;
  document.getElementsByTagName("head")[0].appendChild(style);
  tooltip = document.createElement("div");
  tooltip.setAttribute("id", tooltip_id);
  tooltip.appendChild(document.createTextNode(
    "Le lien a été copié dans le presse-papier."));
  tooltip.addEventListener("transitionend", transitionend, false);
  tooltip.addEventListener("click", force_hide_tooltip, false);
  document.body.appendChild(tooltip);
}

function hide_tooltip() {
  tooltip.style.visibility = "hidden";
  tooltip.style.top = "0";
  tooltip.style.left = "0";
}

function transitionend() {
  if(tooltip.style.opacity === "0") {
    hide_tooltip();
  }
}

function force_hide_tooltip() {
  window.clearTimeout(tooltip_timer);
  tooltip.style.transition = "none";
  tooltip.style.opacity = "0";
  hide_tooltip();
}

function show_tooltip(p_img) {
  force_hide_tooltip();
  // positionnement de la tooltip par rapport à l'icône du lien
  let l_img_rect = p_img.getBoundingClientRect();
  let l_img_mid_x = window.scrollX + l_img_rect.x + l_img_rect.width / 2;
  let l_img_y = window.scrollY + l_img_rect.y;
  let l_tooltip_width = tooltip.offsetWidth;
  let l_tooltip_height = tooltip.offsetHeight;
  let l_page_width = document.documentElement.scrollWidth;
  let l_left = "" + Math.round(l_img_mid_x - l_tooltip_width / 2) + "px";
  let l_top = "" + Math.round(l_img_y - 8 - l_tooltip_height) + "px";
  // gestion du dépassement à gauche en restant à 8px du bord
  if(l_tooltip_width / 2 > l_img_mid_x - 8) {
    l_left = "8px";
  }
  // gestion du dépassement à droite en restant à 8px du bord
  else if((l_tooltip_width / 2) + l_img_mid_x > l_page_width - 8) {
    l_left = "" + Math.round(l_page_width - 8 - l_tooltip_width) + "px";
  }
  // affichage de la tooltip
  tooltip.style.left = l_left;
  tooltip.style.top = l_top;
  tooltip.style.transition = "";
  tooltip.style.opacity = ".95";
  tooltip.style.visibility = "visible";
  // gestion du masquage de la tooltip après tooltip_time
  tooltip_timer = window.setTimeout(function() {
    tooltip.style.opacity = "0";
  }, tooltip_time);
}

async function permalien_click(e) {
  e.preventDefault();
  await GM.setClipboard(this.href);
  if(tooltip_display) {
    if(!tooltip) create_tooltip();
    show_tooltip(this.firstElementChild);
  }
}

/* ------------------------------------ */
/* fonctions pour la création des liens */
/* ------------------------------------ */

// création des liens permanents
function permalink(p_cat, p_topic) {
  // récupération des posts
  let l_posts = document.querySelectorAll("table.messagetable > tbody > " +
    "tr.message > td.messCase1 > div.right > a[href^=\"#t\"]");
  for(let l_post of l_posts) {
    // numéro du post
    let l_num = /^.*#t([0-9]+)$/.exec(l_post.href);
    if(l_num !== null) {
      l_num = l_num[1];
      // construction du lien permanent
      let l_newlink = document.createElement("a");
      l_newlink.setAttribute("class", class_name);
      l_newlink.setAttribute("data-" + data_name, "non");

      // https://forum.hardware.fr/forum2.php?cat=10&post=148758&numreponse=2524630

      l_newlink.href = "https://forum.hardware.fr/forum2.php?cat=" + p_cat +
        "&post=" + p_topic + "&numreponse=" + l_num;
      l_newlink.setAttribute("title", "Lien permanent vers ce post");
      if(target_blank) l_newlink.setAttribute("target", "_blank");
      let l_newimg = document.createElement("img");
      l_newimg.src = img_link;
      l_newlink.appendChild(l_newimg);
      // ajout du lien permanent
      let l_newdiv = document.createElement("div");
      l_newdiv.setAttribute("class", "right");
      l_newdiv.appendChild(l_newlink);
      let l_toolbar = l_post.parentElement.parentElement.parentElement
        .querySelector("td.messCase2 > div.toolbar");
      let l_spacer = l_toolbar.querySelector("div.spacer");
      l_toolbar.insertBefore(l_newdiv, l_spacer);
    }
  }
}

// création du lien minimal
function minilink(p_cat, p_topic, p_page) {
  // construction du lien minimal
  let l_newlink = document.createElement("a");
  l_newlink.setAttribute("class", class_name);
  l_newlink.setAttribute("data-" + data_name, "non");
  if(minilink_params) {
    if(minilink_page && !recherche) {

      // https://forum.hardware.fr/forum2.php?cat=10&post=148758&page=300
      // https://forum.hardware.fr/forum2.php?cat=13&post=116015&page=300

      l_newlink.href = "https://forum.hardware.fr/forum2.php?cat=" + p_cat +
        "&post=" + p_topic + "&page=" + p_page;
    } else {

      // https://forum.hardware.fr/forum2.php?cat=10&post=148758
      // https://forum.hardware.fr/forum2.php?cat=13&post=116015

      l_newlink.href = "https://forum.hardware.fr/forum2.php?cat=" + p_cat +
        "&post=" + p_topic;
    }
  } else {
    if(minilink_page && !recherche) {

      // https://forum.hardware.fr/hfr/Programmation/sujet_148758_300.htm
      // https://forum.hardware.fr/hfr/Discussions/sujet_116015_300.htm

      l_newlink.href = "https://forum.hardware.fr/hfr/" + id2caturl[p_cat] +
        "/sujet_" + p_topic + "_" + p_page + ".htm";
    } else {

      // https://forum.hardware.fr/hfr/Programmation/sujet_148758_1.htm
      // https://forum.hardware.fr/hfr/Discussions/sujet_116015_1.htm

      l_newlink.href = "https://forum.hardware.fr/hfr/" + id2caturl[p_cat] +
        "/sujet_" + p_topic + "_1.htm";
    }
  }
  if(minilink_page && !recherche) {
    l_newlink.setAttribute("title", "Lien minimal vers cette page");
  } else {
    l_newlink.setAttribute("title", "Lien minimal vers ce topic");
  }
  if(target_blank) l_newlink.setAttribute("target", "_blank");
  l_newlink.style.marginRight = "5px";
  let l_newimg = document.createElement("img");
  l_newimg.src = img_link_topic;
  l_newlink.appendChild(l_newimg);
  // ajout du lien minimal
  let l_newdiv = document.createElement("div");
  l_newdiv.setAttribute("class", "right");
  l_newdiv.appendChild(l_newlink);
  let l_toolbar = document.querySelector("div#mesdiscussions.mesdiscussions > " +
    "table.main > tbody > tr > th > div:last-of-type");
  l_toolbar.insertBefore(l_newdiv, l_toolbar.lastElementChild);
}

// mise à jour de la gestion du clic sur les liens
function update_links(p_hfr_permalien_click) {
  if(p_hfr_permalien_click === "oui") {
    let l_links = document.querySelectorAll("a." + class_name +
      "[data-" + data_name + "=\"non\"]");
    for(let l_link of l_links) {
      l_link.dataset[data_name] = "oui";
      l_link.addEventListener("click", permalien_click, false);
    }
  } else {
    let l_links = document.querySelectorAll("a." + class_name +
      "[data-" + data_name + "=\"oui\"]");
    for(let l_link of l_links) {
      l_link.dataset[data_name] = "non";
      l_link.removeEventListener("click", permalien_click, false);
    }
  }
}

/* ----------------------------------- */
/* récupération du paramètre et action */
/* ----------------------------------- */

Promise.all([
  GM.getValue("hfr_permalien_click", hfr_permalien_click_default),
]).then(function([
  hfr_permalien_click_value,
]) {
  hfr_permalien_click = hfr_permalien_click_value;

  // gestion de la configuration du paramètre de la gestion du clic
  let prompt_click = "\u200b" + script_name + " -> Gestion du clic";
  gmMenu(prompt_click, set_click);

  function set_click() {
    let l_hfr_permalien_click = window.prompt(prompt_click +
      "\n\nCopier le lien dans le presse-papier au lieu de " +
      "l'ouvrir normalement ( oui / non ) ?\n", hfr_permalien_click);
    if(l_hfr_permalien_click === null) {
      return;
    }
    if(l_hfr_permalien_click === "oui") {
      GM.setValue("hfr_permalien_click", l_hfr_permalien_click);
      hfr_permalien_click = l_hfr_permalien_click;
    } else {
      GM.setValue("hfr_permalien_click", hfr_permalien_click_default);
      hfr_permalien_click = hfr_permalien_click_default;
    }
    update_links(hfr_permalien_click);
  }

  // récupération de la cat, du topic et de la page dans l'URL de la page
  let resultr = /^https:\/\/forum\.hardware\.fr\/forum2\.php\?post=([0-9]+).*&cat=([0-9]+)&.*$/.exec(window.location.href);
  if(resultr !== null) { // URL de recherche
    cat = resultr[2];
    topic = resultr[1];
    page = "1"; // la page n'a pas de sens sur l'URL de recherche
    recherche = true;
  } else {
    let resultp = /^https:\/\/forum\.hardware\.fr\/forum2\.php\?.*&cat=([0-9]+).*&post=([0-9]+)&page=([0-9]+)&.*$/.exec(window.location.href);
    if(resultp !== null) { // URL à paramètres
      cat = resultp[1];
      topic = resultp[2];
      page = resultp[3];
    } else {
      let resultv = /^https:\/\/forum\.hardware\.fr\/hfr\/([^\/]+)\/(?:[^\/]+\/)?.*sujet_([0-9]+)_([0-9]+)\.htm.*$/.exec(window.location.href);
      if(resultv !== null) { // URL verbeuse
        cat = cat2id[resultv[1]];
        topic = resultv[2];
        page = resultv[3];
      }
    }
  }

  // construction des liens permanents et du lien minimal
  if(cat && topic) {
    permalink(cat, topic);
    minilink(cat, topic, page);
    update_links(hfr_permalien_click);
  }

});