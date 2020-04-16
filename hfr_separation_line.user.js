// ==UserScript==
// @name          [HFR] Separation Line
// @version       1.0.0
// @namespace     roger21.free.fr
// @description   Affiche une ligne de séparation entre le post cible et le suivant.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_separation_line.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_separation_line.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_separation_line.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
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

// $Rev: 1914 $

// historique :
// 1.0.0 (16/04/2020) :
// - création

/* ------------- */
/* configuration */
/* ------------- */

// couleur de la ligne de séparation
var split_color = "#3bea2c"; // une couleur compatible CSS avec les " "

// ligne de séparation transparente ou non
var split_trans = false; // true ou false

// épaisseur de la ligne de séparation en pixels
var split_thick = 8; // une valeur entière sans " "

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var split_table;
var offset_height = 1;
var last_post = null;
var last_table = null;

/* ------------ */
/* le style css */
/* ------------ */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  "div#mesdiscussions.mesdiscussions table#gm_hfr_seli_split_line" +
  "{border-left:0;border-right:0;box-sizing:border-box;display:none;}";
document.getElementsByTagName("head")[0].appendChild(style);

/* ---------------------------------- */
/* création de la ligne de séparation */
/* ---------------------------------- */

// fonction de mise à jour de la ligne de séparation
function update_line() {
  let l_last_post = null;
  if(window.location.hash !== "" && window.location.hash.substring(1, 2) === "t") {
    l_last_post = parseInt(window.location.hash.substring(2), 10);
  }
  l_last_post = l_last_post !== null ? l_last_post : (last_post !== null ? last_post : null);
  if(l_last_post !== null) {
    last_post = l_last_post;
    last_table = null;
    let l_posts = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody > " +
      "tr.message > td.messCase1 > a[name^=\"t\"]");
    for(let l_post of l_posts) {
      let l_post_number = parseInt(l_post.getAttribute("name").substring(1), 10);
      if(l_post_number <= l_last_post) {
        last_table = l_post.parentElement.parentElement.parentElement.parentElement;
      }
    }
    if(last_table !== null) {
      last_table.parentNode.insertBefore(split_table, last_table.nextSibling);
      split_table.style.backgroundColor = split_trans ? "transparent" : split_color;
      split_table.style.height = (split_thick + offset_height) + "px";
      split_table.style.display = "table";
    } else {
      split_table.style.display = "none";
    }
  }
}

// création de la ligne de séparation
let l_root = document.querySelector("div#mesdiscussions.mesdiscussions");
if(l_root) {
  split_table = document.createElement("table");
  split_table.setAttribute("id", "gm_hfr_seli_split_line");
  let l_style = document.querySelector("head link[href^=\"/include/the_style1.php?color_key=\"]");
  if(l_style) {
    l_style = l_style.getAttribute("href").split("/");
    if(l_style[31] === "0") {
      split_table.style.borderBottom = "1px solid #" + l_style[17];
    } else {
      split_table.style.border = "0";
      offset_height = 0;
    }
  } else {
    split_table.style.borderBottom = "1px solid #c0c0c0";
  }
  l_root.appendChild(split_table);
  update_line();
  window.addEventListener("hashchange", update_line, false);
}
