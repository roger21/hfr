// ==UserScript==
// @name          [HFR] Remove Target Blank
// @version       1.0.0
// @namespace     roger21.free.fr
// @description   Permet de supprimer les « target="_blank" » dans les liens.
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

// $Rev: 4938 $

// historique :
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

/* --------- */
/* constante */
/* --------- */

var script_name = "[HFR] Remove Target Blank";

/* ----------------- */
/* option par défaut */
/* ----------------- */

let rtb_target_blank_defaut = "page"; // aucun, page, forum, tous

/* ---------------- */
/* variable globale */
/* ---------------- */

let rtb_target_blank;

/* ----------------------------------- */
/* récupération du paramètre et action */
/* ----------------------------------- */

Promise.all([
  GM.getValue("rtb_target_blank", rtb_target_blank_defaut),
]).then(function([
  rtb_target_blank_value,
]) {
  rtb_target_blank = rtb_target_blank_value;

  // gestion de la configuration du paramètre
  let prompt_target_blank = "\u200b" + script_name + " -> Configuration";
  gmMenu(prompt_target_blank, set_target_blank);

  function set_target_blank() {
    let l_target_blank = window.prompt(prompt_target_blank +
      "\n\naucun : aucun lien (désactivation du script)\n" +
      "page (défaut) : les liens qui pointent vers la page\n" +
      "forum : les liens qui pointent vers le forum\n" +
      "tous : tous les liens dans les posts\n", rtb_target_blank);
    if(l_target_blank === null) {
      return;
    }
    if(l_target_blank === "aucun" || l_target_blank === "forum" || l_target_blank === "tous") {
      GM.setValue("rtb_target_blank", l_target_blank);
      rtb_target_blank = l_target_blank;
    } else {
      GM.setValue("rtb_target_blank", rtb_target_blank_defaut);
      rtb_target_blank = rtb_target_blank_defaut;
    }
  }

  // suppression des target="_blank" dans les liens
  if(rtb_target_blank !== "aucun") {
    let links = document.getElementById("mesdiscussions").querySelectorAll(
      "table.messagetable td.messCase2 div[id^='para'] a.cLink[target=\"_blank\"]");
    let starts_with = "";
    if(rtb_target_blank === "page") {
      let page = window.location.href;
      let hash_index = page.indexOf("#")
      if(hash_index !== -1) {
        starts_with = page.substring(0, hash_index);
      } else {
        starts_with = page;
      }
    }
    if(rtb_target_blank === "forum") {
      starts_with = "https://forum.hardware.fr/"
    }
    for(let link of links) {
      if(link.href.startsWith(starts_with)) {
        link.removeAttribute("target");
      }
    }
  }
});