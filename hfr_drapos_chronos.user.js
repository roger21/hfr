// ==UserScript==
// @name          [HFR] Drapos Chronos
// @version       1.0.0
// @namespace     roger21.free.fr
// @description   Trie les topics par date de dernier message, toutes catégories confondues, sur les pages des drapos rouges et cyans (avec switch d'activation / désactivation).
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/forum1f.php?config=hfr.inc&owntopic=2&new=0&nojs=0
// @include       https://forum.hardware.fr/forum1f.php?config=hfr.inc&owntopic=1&new=0&nojs=0
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_drapos_chronos.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_drapos_chronos.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_drapos_chronos.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// ==/UserScript==

/*

Copyright © 2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 2172 $

// historique :
// 1.0.0 (15/06/2020) :
// - correction du pointer de la souris pour plus de clareté
// - ajout des metadata de mise à jour
// 0.9.2 (14/06/2020) :
// - ajout d'un switch pour activer ou désactiver le tri
// - ajout d'une option en dur pour toujours démarrer désactivé
// 0.9.1 (12/06/2020) :
// - correction de la liaison des topics avec le formulaire de suppression des drapos ->
// signalé par david42fr
// - ajout de la metadata @supportURL
// - ajout de la metadata @author (roger21)
// - ajout de l'avis de licence AGPL v3+
// 0.9.0 (11/06/2020) :
// - création sur une idée de david42fr

/* --------------- */
/* l'option en dur */
/* --------------- */

// mettre à true pour toujours démarrer désactivé
const always_start_off = false;

/* ------------------------------- */
/* la gestion de compatibilité gm4 */
/* ------------------------------- */

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

/* ----------------------- */
/* le paramètre par défaut */
/* ----------------------- */

const drap_chro_active_default = true;

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var drap_chro_active;
var le_tbody;
var les_lignes = [];
var init_ok = false;
var sort_chronos = false;
var waiting = false;
var wait_timer;
var observer;
var le_bouton = null;

/* -------------- */
/* les constantes */
/* -------------- */

const script_name = "[HFR] Drapos Chronos";
const le_tbody_query = "div.container > div#mesdiscussions.mesdiscussions > table.main > tbody > "
const le_tr_header_query = "tr.cBackHeader.fondForum1Description";
const le_form_query = "form[name=\"form1\"][action^=\"/modo/manageaction.php\"]"
const le_form_id = "gm_hfr_drapos_chronos_form1_modo_id";
const la_tempo = 250;

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent = ".gm_hfr_drapos_chronos_display_off{display:none;}" +
  "div#onglet_drapos_chronos > label{cursor:pointer;display:inline-block;position:relative;" +
  "box-sizing:border-box;height:16px;}" +
  "div#onglet_drapos_chronos > label:before{display:block;position:absolute;box-sizing:border-box;content:\"\";" +
  "left:calc(50% - 10px);bottom:1px;width:20px;height:12px;border-radius:5px;pointer-events:all;" +
  "background-color:#c0c0c0;transition:background-color .15s ease-in-out;}" +
  "div#onglet_drapos_chronos > label:after{display:block;position:absolute;box-sizing:border-box;content:\"\";" +
  "left:calc(50% - 8px);bottom:3px;width:8px;height:8px;border-radius:10px;background-color:#888888;" +
  "transition:transform .15s ease-in-out,background-color .15s ease-in-out;}" +
  "div#onglet_drapos_chronos > label.gm_hfr_drapos_chronos_active:before{background-color:#50d080;}" +
  "div#onglet_drapos_chronos > label.gm_hfr_drapos_chronos_active:after{background-color:#ffffff;" +
  "transform:translateX(8px);}" +
  "div#onglet_drapos_chronos > label.gm_hfr_drapos_chronos_off:before{background-color:#6090f0;}" +
  "div#onglet_drapos_chronos > label.gm_hfr_drapos_chronos_off:after{background-color:#ffffff;}" +
  "div#onglet_drapos_chronos > label.gm_hfr_drapos_chronos_error:before{background-color:#f0c0c0;}" +
  "div#onglet_drapos_chronos > label.gm_hfr_drapos_chronos_error:after{}";
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------- */
/* la création du switch */
/* --------------------- */

var before_9 = document.querySelector("table.none > tbody > tr > td > div.cadreonglet > div#befor9");
if(before_9) {
  let l_before = document.createElement("div");
  l_before.setAttribute("id", "before_drapos_chronos");
  l_before.setAttribute("class", "beforonglet");
  let l_after = document.createElement("div");
  l_after.setAttribute("id", "after_drapos_chronos");
  l_after.setAttribute("class", "afteronglet");
  let l_onglet = document.createElement("div");
  l_onglet.setAttribute("id", "onglet_drapos_chronos");
  l_onglet.setAttribute("class", "onglet cBackHeader");
  l_onglet.style.cursor = "default";
  le_bouton = document.createElement("label");
  le_bouton.setAttribute("title", script_name + " (initialisation...)");
  l_onglet.appendChild(le_bouton);
  before_9.parentElement.insertBefore(l_before, before_9);
  before_9.parentElement.insertBefore(l_onglet, before_9);
  before_9.parentElement.insertBefore(l_after, before_9);
}

/* ---------------------- */
/* les fonctions globales */
/* ---------------------- */

// fonction d'initialisation des données
function init_drapos_chronos() {
  // le tableau
  le_tbody = document.querySelector(le_tbody_query + le_tr_header_query);
  le_tbody = le_tbody ? le_tbody.parentElement : null;
  if(le_tbody == null) {
    console.log(script_name + " ERROR le tableau des topics n'a pas été trouvé");
    return;
  }
  // le formulaire
  let le_form = le_tbody.parentElement.querySelector(":scope > " + le_form_query);
  if(le_form == null) {
    console.log(script_name + " ERROR le formulaire des topics n'a pas été trouvé");
    return;
  }
  le_form.setAttribute("id", le_form_id);
  // les lignes du tableau
  let l_num = 0;
  let l_lignes = le_tbody.querySelectorAll(":scope > " + le_tr_header_query + " ~ tr");
  for(let l_ligne of l_lignes) {
    let l_topic = l_ligne.classList.contains("sujet");
    let l_date = l_ligne.querySelector(":scope > td.sujetCase9 > a");
    if(l_date !== null) {
      l_date = l_date.firstChild.textContent.trim();
      l_date = parseInt(l_date.substring(6, 10) + l_date.substring(3, 5) + l_date.substring(0, 2) +
        l_date.substring(13, 15) + l_date.substring(16), 10);
    } else {
      l_date = 0;
    }
    if(l_topic && l_date !== null) {
      l_ligne.querySelectorAll("input").forEach((p_input) => {
        p_input.setAttribute("form", le_form_id);
      });
    }
    les_lignes.push({
      order: l_num++,
      date: l_date,
      topic: l_ligne
    });
  }
  init_ok = true;
}

// fonction de mise à jour du switch
function update_switch(p_first) {
  if(le_bouton) {
    if(init_ok) {
      if(p_first === true) {
        le_bouton.addEventListener("click", switch_sort, false);
      }
      if(drap_chro_active) {
        le_bouton.setAttribute("title", script_name + " (activé)");
        le_bouton.setAttribute("class", "gm_hfr_drapos_chronos_active");
      } else {
        le_bouton.setAttribute("title", script_name + " (désactivé)");
        le_bouton.setAttribute("class", "gm_hfr_drapos_chronos_off");
      }
    } else {
      le_bouton.setAttribute("title", script_name + " (erreur)");
      le_bouton.setAttribute("class", "gm_hfr_drapos_chronos_error");
    }
  }
}

// fonction d'inversion du trie des topics
function switch_sort() {
  drap_chro_active = !drap_chro_active;
  update_switch();
  Promise.all([
    GM.setValue("drap_chro_active", drap_chro_active),
  ]);
  sort_topics();
}

// fonction de trie des topics
function sort_topics() {
  if(init_ok) {
    let l_need_sort = false;
    let l_sort_date = false;
    if(drap_chro_active && !sort_chronos) {
      les_lignes.sort((p_ligne_1, p_ligne_2) => p_ligne_2.date - p_ligne_1.date);
      l_need_sort = true;
      l_sort_date = true;
      sort_chronos = true;
    } else if(!drap_chro_active && sort_chronos) {
      les_lignes.sort((p_ligne_1, p_ligne_2) => p_ligne_1.order - p_ligne_2.order)
      l_need_sort = true;
      sort_chronos = false;
    }
    if(l_need_sort) {
      for(let l_topic of les_lignes) {
        le_tbody.appendChild(l_topic.topic);
        l_topic.topic.classList.remove("gm_hfr_drapos_chronos_display_off");
        if(l_sort_date && l_topic.date === 0) {
          l_topic.topic.classList.add("gm_hfr_drapos_chronos_display_off");
        }
      }
    }
  }
}

// action quand l'observer n'est plus déclenché
function act() {
  // désactivation de l'observer
  observer.disconnect();
  // initialisation des données
  init_drapos_chronos();
  // mise à jour du switch
  update_switch(true);
  // trie des topics (si nécessaire)
  sort_topics();
}

// attente tant que l'observer est déclenché
function wait() {
  waiting = true;
  window.clearTimeout(wait_timer);
  wait_timer = window.setTimeout(act, la_tempo);
}

// action si l'observer n'est pas déclenché
function act_if_not_waiting() {
  if(!waiting) {
    act();
  }
}

/* ---------------------------------------------------------- */
/* la récupération du paramètre et trie des topics si demandé */
/* ---------------------------------------------------------- */

Promise.all([
  GM.getValue("drap_chro_active", drap_chro_active_default),
]).then(function([
  drap_chro_active_value,
]) {
  // initialisation de la variable globale
  drap_chro_active = drap_chro_active_value && !always_start_off;
  // lancement de l'observer et de la tempo
  observer = new MutationObserver(wait);
  observer.observe(document, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
  });
  window.setTimeout(act_if_not_waiting, la_tempo);
});
