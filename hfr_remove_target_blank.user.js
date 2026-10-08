// ==UserScript==
// @name          [HFR] Remove Target Blank
// @version       1.5.0
// @namespace     roger21.free.fr
// @description   Permet de visualiser les liens ayant un attribut « target="_blank" » et de supprimer cet attribut sur les types de liens configurés.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_remove_target_blank.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_remove_target_blank.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_remove_target_blank.user.js
// @supportURL    https://forum.hardware.fr/hfr/Programmation/Divers-6/sujet_148758_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.registerMenuCommand
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2026 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 5029 $

// historique :
// 1.5.0 (08/10/2026) :
// - ajout des choix "hash" (nouveau défaut) et "topic" pour la configuration des types ->
// de liens (proposé par brisssou)
// - ajout d'une option pour visualiser les liens ayant un attribut « target="_blank" » ->
// (l'icône habituelle des liens externes)
// - application des choix des configurations à la validation
// 1.0.0 (07/09/2026) :
// - création

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
let gmMenu = GM.registerMenuCommand || GM_registerMenuCommand;

/* ---------- */
/* constantes */
/* ---------- */

const script_name = "[HFR] Remove Target Blank";
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
const starts_with_forum = "https://forum.hardware.fr/";
const dark_icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+CiAgPHBhdGggZmlsbD0iIzMwMzAzMCIgZD0iTTMyMCAwYTMxLjk3IDMxLjk3IDAgMCAwLTMyIDMyIDMxLjk3IDMxLjk3IDAgMCAwIDMyIDMyaDgyLjdMMjAxLjMgMjY1LjRjLTEyLjUgMTIuNS0xMi41IDMyLjggMCA0NS4zczMyLjggMTIuNSA0NS4zIDBMNDQ4IDEwOS4zVjE5MmEzMS45NyAzMS45NyAwIDEgMCA2NCAwVjMyYTMxLjk3IDMxLjk3IDAgMCAwLTMyLTMyek04MCA5NmMtNDQuMiAwLTgwIDM1LjgtODAgODB2MjU2YzAgNDQuMiAzNS44IDgwIDgwIDgwaDI1NmM0NC4yIDAgODAtMzUuOCA4MC04MHYtODBhMzEuOTcgMzEuOTcgMCAxIDAtNjQgMHY4MGMwIDguOC03LjIgMTYtMTYgMTZIODBjLTguOCAwLTE2LTcuMi0xNi0xNlYxNzZjMC04LjggNy4yLTE2IDE2LTE2aDgwYTMxLjk3IDMxLjk3IDAgMSAwIDAtNjR6Ij48L3BhdGg+Cjwvc3ZnPgo=";
const light_icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+CiAgPHBhdGggZmlsbD0iI2UwZTBlMCIgZD0iTTMyMCAwYTMxLjk3IDMxLjk3IDAgMCAwLTMyIDMyIDMxLjk3IDMxLjk3IDAgMCAwIDMyIDMyaDgyLjdMMjAxLjMgMjY1LjRjLTEyLjUgMTIuNS0xMi41IDMyLjggMCA0NS4zczMyLjggMTIuNSA0NS4zIDBMNDQ4IDEwOS4zVjE5MmEzMS45NyAzMS45NyAwIDEgMCA2NCAwVjMyYTMxLjk3IDMxLjk3IDAgMCAwLTMyLTMyek04MCA5NmMtNDQuMiAwLTgwIDM1LjgtODAgODB2MjU2YzAgNDQuMiAzNS44IDgwIDgwIDgwaDI1NmM0NC4yIDAgODAtMzUuOCA4MC04MHYtODBhMzEuOTcgMzEuOTcgMCAxIDAtNjQgMHY4MGMwIDguOC03LjIgMTYtMTYgMTZIODBjLTguOCAwLTE2LTcuMi0xNi0xNlYxNzZjMC04LjggNy4yLTE2IDE2LTE2aDgwYTMxLjk3IDMxLjk3IDAgMSAwIDAtNjR6Ij48L3BhdGg+Cjwvc3ZnPgo=";

/* ------------------ */
/* options par défaut */
/* ------------------ */

const rtb_types_defaut = "hash"; // aucun, hash, page, topic, forum, tous
const rtb_visual_defaut = "non"; // oui, non

/* ------------------ */
/* variables globales */
/* ------------------ */

let rtb_types;
let rtb_visual;
let last_types;
let last_visual;
let topic_id;
let topic_page;
let starts_with_hash;
let color_message_1;
let color_message_2;
let color_citation;
let color_moderation;

/* ------------------------------------------------------------------ */
/* fonction d'identification du topic et de la page à partir de l'URL */
/* ------------------------------------------------------------------ */

// retourne [topic_id, topic_page, ]
// topic_id = catid_topicid
function get_topic_data(url) {
  // URL de recherche
  let l_r = /^https:\/\/forum\.hardware\.fr\/forum2\.php\?post=([0-9]+).*&cat=([0-9]+)&.*$/.exec(url);
  if(l_r !== null) {
    // la page n'a pas de sens sur l'URL de recherche
    return [l_r[2] + "_" + l_r[1], null, ];
  }
  // URL à paramètres
  let l_p = /^https:\/\/forum\.hardware\.fr\/forum2\.php\?.*&cat=([0-9]+).*&post=([0-9]+)&page=([0-9]+)&.*$/.exec(url);
  if(l_p !== null) {
    if(url.includes("&print=1&")) {
      // mode impression, la page n'est pas prise en compte
      return [l_p[1] + "_" + l_p[2], null, ];
    }
    return [l_p[1] + "_" + l_p[2], l_p[3], ];
  }
  // URL permalien
  let l_e = /^https:\/\/forum\.hardware\.fr\/forum2\.php\?.*&cat=([0-9]+).*&post=([0-9]+)&.*$/.exec(url);
  if(l_e !== null) {
    return [l_e[1] + "_" + l_e[2], null, ];
  }
  // URL verbeuse
  let l_v = /^https:\/\/forum\.hardware\.fr\/hfr\/([^\/]+)\/(?:[^\/]+\/)?.*sujet_([0-9]+)_([0-9]+)\.htm.*$/.exec(url);
  if(l_v !== null) {
    return [cat2id[l_v[1]] + "_" + l_v[2], l_v[3], ];
  }
  // pas un topic
  return [null, null, ];
}

/* ------------------------------------------------- */
/* fonctions de gestion de la modification des liens */
/* ------------------------------------------------- */

// restauration des liens dans leur état original
function restore_links() {
  let l_links = document.getElementById("mesdiscussions").querySelectorAll(
    "table.messagetable td.messCase2 div[id^=\"para\"] " +
    "a.cLink[hfr_removed_target_blank=\"hfr_removed_target_blank\"]");
  for(let l_link of l_links) {
    l_link.setAttribute("target", "_blank");
    l_link.removeAttribute("hfr_removed_target_blank");
  }
}

// suppression de l'attribut « target="_blank" » dans les liens à l'intérieur des posts
function update_links() {
  if(rtb_types !== "aucun") {

    // l_starts_with
    let l_starts_with = ""; // tous
    if(rtb_types === "forum") {
      l_starts_with = starts_with_forum; // forum
    }
    if(rtb_types === "hash") {
      l_starts_with = starts_with_hash; // hash
    }

    // DEBUG
    //console.log(script_name, "update_links", rtb_types, "l_starts_with", l_starts_with);

    // traitement des liens
    let l_links = document.getElementById("mesdiscussions").querySelectorAll(
      "table.messagetable td.messCase2 div[id^=\"para\"] a.cLink[target=\"_blank\"]");
    for(let l_link of l_links) {

      // tous, forum ou hash (avec l_starts_with)
      if(rtb_types === "tous" || rtb_types === "forum" || rtb_types === "hash") {

        if(l_link.href.startsWith(l_starts_with)) {
          l_link.removeAttribute("target");
          l_link.setAttribute("hfr_removed_target_blank", "hfr_removed_target_blank");

          // DEBUG
          //console.log(script_name, "update_links", rtb_types, "removed 1", l_link.href);

        }
      }

      // page ou topic (avec topic_id et topic_page)
      else {

        let l_topic_id, l_topic_page;
        [l_topic_id, l_topic_page, ] = get_topic_data(l_link.href);

        if((rtb_types === "page" &&
            topic_id === l_topic_id && topic_page === l_topic_page) ||
          (rtb_types === "topic" && topic_id === l_topic_id)) {
          l_link.removeAttribute("target");
          l_link.setAttribute("hfr_removed_target_blank", "hfr_removed_target_blank");

          // DEBUG
          //console.log(script_name, "update_links", rtb_types, "removed 2", l_link.href);

        }
      }
    }
  }
}

/* -------------------------------------------------- */
/* fonctions de gestion de la visualisation des liens */
/* -------------------------------------------------- */

// black or white
function mj(p_color) {
  let l_r = parseInt(p_color.substr(0, 2), 16);
  let l_g = parseInt(p_color.substr(2, 2), 16);
  let l_b = parseInt(p_color.substr(4, 2), 16);
  return (((0.299 * l_r) + (0.587 * l_g) + (0.114 * l_b)) / 255) > 0.5 ?
    dark_icon : light_icon;
}

// met à jour l'affichage de l'icône « lien externe » si besoin
function update_visual() {
  let l_style = document.getElementById("hfr_remove_target_blank_visual");
  if(rtb_visual === "oui" && l_style === null) {
    l_style = document.createElement("style");
    l_style.setAttribute("type", "text/css");
    l_style.setAttribute("id", "hfr_remove_target_blank_visual");
    l_style.textContent = `

  /* messages */
  #mesdiscussions table.messagetable tr.message
    td.messCase2 div[id^="para"]
    a[class="cLink"][target="_blank"]:not(:empty):not(:has(a))::after {
    content: " ";
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    display: inline-block;
    vertical-align: baseline;
    height: 9px;
    width: 13px;
  }

  /* signatures */
  #mesdiscussions table.messagetable tr.message
    td.messCase2 div[id^="para"]
    span.signature
    a[class="cLink"][target="_blank"]:not(:empty):not(:has(a))::after {
    height: 8px;
    width: 12px;
  }

  /* couleur des messages 1 : Premier fond du tableau */
  #mesdiscussions table.messagetable tr.message.cBackCouleurTab1
    td.messCase2 div[id^="para"]
    a[class="cLink"][target="_blank"]:not(:empty):not(:has(a))::after {
    background-image: url(${mj(color_message_1)});
  }

  /* couleur des messages 2 : Deuxième fond du tableau */
  #mesdiscussions table.messagetable tr.message.cBackCouleurTab2
    td.messCase2 div[id^="para"]
    a[class="cLink"][target="_blank"]:not(:empty):not(:has(a))::after {
    background-image: url(${mj(color_message_2)});
  }

  /* couleur des citations et des spoilers : Fond des citations */
  #mesdiscussions table.messagetable tr.message
    td.messCase2 div[id^="para"]
    table:is(.quote, .citation, .spoiler, .oldspoiler) :not(:is(table))
    a[class="cLink"][target="_blank"]:not(:empty):not(:has(a))::after {
    background-image: url(${mj(color_citation)});
  }

  /* couleur des modérations : Couleur du fond des messages de modération générique */
  #mesdiscussions table.messagetable tr.message.caseModoGeneric
    td.messCase2 div[id^="para"]
    a[class="cLink"][target="_blank"]:not(:empty):not(:has(a))::after {
    background-image: url(${mj(color_moderation)});
  }

  /* couleur des fixed et code : fond toujours blanc */
  #mesdiscussions table.messagetable tr.message
    td.messCase2 div[id^="para"]
    table:is(.fixed, .code) :not(:is(table))
    a[class="cLink"][target="_blank"]:not(:empty):not(:has(a))::after {
    background-image: url(${dark_icon});
  }

  /* taille pour les code en pre */
  #mesdiscussions table.messagetable tr.message
    td.messCase2 div[id^="para"]
    table.code :not(:is(table)) pre
    a[class="cLink"][target="_blank"]:not(:empty):not(:has(a))::after {
    height: 8px;
    width: 12px;
    vertical-align: -0.4em;
  }

`;
    document.getElementsByTagName("head")[0].appendChild(l_style);
  }
  if(rtb_visual === "non" && l_style !== null) {
    l_style.parentNode.removeChild(l_style);
  }
}

/* ------------------------------------- */
/* récupération des paramètres et action */
/* ------------------------------------- */

Promise.all([
  GM.getValue("rtb_types", rtb_types_defaut),
  GM.getValue("rtb_visual", rtb_visual_defaut),
]).then(function([
  rtb_types_value,
  rtb_visual_value,
]) {
  rtb_types = rtb_types_value;
  rtb_visual = rtb_visual_value;
  last_types = rtb_types;
  last_visual = rtb_visual;

  // gestion de la configuration du paramètre des types de liens à modifier
  let prompt_types = "\u200b" + script_name + " -> Types de liens";
  gmMenu(prompt_types, set_types);

  function set_types() {
    let l_rtb_types = window.prompt(prompt_types +
      "\n\nTypes de liens à modifier :\n\n" +
      "aucun : aucun lien (désactivation de la fonction)\n" +
      "hash : les liens dont seul le hash change (défaut)\n" +
      "page : les liens vers la même page\n" +
      "topic : les liens vers le même topic\n" +
      "forum : les liens vers le forum\n" +
      "tous : tous les liens à l'intérieur les posts\n", rtb_types);
    if(l_rtb_types === null) {
      return;
    }
    if(["aucun", "hash", "page", "topic", "forum", "tous", ].includes(l_rtb_types)) {
      GM.setValue("rtb_types", l_rtb_types);
      rtb_types = l_rtb_types;
    } else {
      GM.setValue("rtb_types", rtb_types_defaut);
      rtb_types = rtb_types_defaut;
    }
    if(last_types !== rtb_types) {
      last_types = rtb_types;
      restore_links();
      update_links();
    }
  }

  // gestion de la configuration du paramètre de visualisation des liens
  let prompt_visual = "\u200b" + script_name + " -> Affichage";
  gmMenu(prompt_visual, set_visual);

  function set_visual() {
    let l_rtb_visual = window.prompt(prompt_visual +
      "\n\nAffichage d'une icône à côté des liens :\n\n" +
      "oui : affichage de l'icône « lien externe »\n" +
      "non : laisse les liens inchangés (défaut)\n", rtb_visual);
    if(l_rtb_visual === null) {
      return;
    }
    if(l_rtb_visual === "oui") {
      GM.setValue("rtb_visual", l_rtb_visual);
      rtb_visual = l_rtb_visual;
    } else {
      GM.setValue("rtb_visual", rtb_visual_defaut);
      rtb_visual = rtb_visual_defaut;
    }
    if(last_visual !== rtb_visual) {
      last_visual = rtb_visual;
      update_visual();
    }
  }

  // DEBUG
  //console.log(script_name, "rtb_types", rtb_types, "rtb_visual", rtb_visual);

  // couleurs de fond par défaut
  color_message_1 = "f7f7f7";
  color_message_2 = "dedfdf";
  color_citation = "ffffff";
  color_moderation = "ffeeee";

  // récupération des couleurs de fond du profil
  let the_style1 =
    document.querySelector("head link[href^=\"/include/the_style1.php?color_key=\"]");
  if(the_style1) {
    the_style1 = the_style1.getAttribute("href").split("/");
    if(the_style1.length >= 27) {
      color_message_1 = the_style1[13].toLowerCase();
      color_message_2 = the_style1[14].toLowerCase();
      color_citation = the_style1[19].toLowerCase();
      color_moderation = the_style1[26].toLowerCase();
    }
  }

  // DEBUG
  //console.log(script_name, "color_message_1", color_message_1,
  //  "color_message_2", color_message_2,
  //  "color_citation", color_citation,
  //  "color_moderation", color_moderation);

  // configuration des variables globales
  let current_page = window.location.href;
  // topic_id et topic_page
  [topic_id, topic_page, ] = get_topic_data(current_page);
  // starts_with_hash
  let hash_index = current_page.indexOf("#");
  if(hash_index !== -1) {
    starts_with_hash = current_page.substring(0, hash_index + 1);
  } else {
    starts_with_hash = current_page + "#";
  }

  // DEBUG
  //console.log(script_name, "topic_id", topic_id, "topic_page", topic_page);

  update_links();
  update_visual();

});