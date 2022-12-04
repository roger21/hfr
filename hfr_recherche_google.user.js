// ==UserScript==
// @name          [HFR] Recherche Google et DuckDuckGo
// @version       2.1.1
// @namespace     roger21.free.fr
// @description   Remplace le bouton de recherche du forum (en haut à droite) par un champ de recherche par Google, DuckDuckGo ou les deux.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_recherche_google.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_recherche_google.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_recherche_google.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.openInTab
// @grant         GM_openInTab
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.registerMenuCommand
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2012-2022 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 3673 $

// historique :
// 2.1.1 (04/12/2022) :
// - détection du topic sur la page de réponse / édition normale
// 2.1.0 (01/09/2022) :
// - Why Not Both?
// 2.0.0 (20/08/2022) :
// - nouveau nom : [HFR] Recherche Google -> [HFR] Recherche Google et DuckDuckGo
// - possibilité de choisir entre Google et DuckDuckGo
// - possibilité de contextualiser la recherhce jusqu'au topic
// - ajout d'une fenêtre de configuration
// - refonte de l'interface
// 1.5.6 (03/01/2022) :
// - mise à jour des cats / sous-cats (ajout de la sous-cat windows 11)
// 1.5.5 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur ->
// (free.fr -> github.com)
// 1.5.4 (01/01/2020) :
// - mise à jour des cats / sous-cats
// 1.5.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 1.5.2 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.5.1 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+
// 1.5.0 (12/08/2018) :
// - nouveau nom : [HFR] recherche google -> [HFR] Recherche Google
// - ajout de la metadata @author (roger21)
// 1.4.0 (26/05/2018) :
// - ajout du support pour la cat shop
// - gestion de la compatibilité gm4
// - utilisation de keydown au lieu de keypress
// - recodage en event.key au lieu de event.keyCode deprecated
// - check du code dans tm et restylage du code (moins barbare)
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.3.1 (28/11/2017) :
// - passage au https
// 1.3.0 (30/10/2016) :
// - force l'ouverture de la recherche google au premier plan (ajout d'un paramètre ->
// modifiable dans le code)
// 1.2.8 (06/08/2016) :
// - compression de l'image du bouton (pngoptimizer)
// - correction des styles css du bouton et du champ de recherche
// - mise à jour des cats / sous-cats mais y'avait rien de nouveau :o
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.2.7 (20/01/2016) :
// - correction d'un deprecated dans string.replace()
// - ajout d'un padding left dans l'input de recherche pour voir ce con de curseur :o
// 1.2.6 (29/11/2015) :
// - nouvelle mise à jour des cats / sous-cats (nouvelle cat diy)
// 1.2.5 (11/11/2015) :
// - mise à jour des cats / sous-cats
// 1.2.4 (05/09/2015) :
// - nouveau logo google
// 1.2.3 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame ->
// pour plus de sécurité)
// 1.2.2 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.2.1 (18/03/2014) :
// - modification de la description
// - maj des metadata @grant et indentation des metadata
// - correction d'une typo dans l'historique
// 1.2.0 (14/09/2013) :
// - nodeValue -> textContent pour gérer les nodes element des pages > 1
// 1.1.1 (14/09/2012) :
// - ajout des metadata @grant
// 1.1.0 (02/09/2012):
// - gestion des NO_BREAK_SPACE qui apparaissent comme ça par magie, merci md de merde

/* ---------------------------- */
/* gestion de compatibilité gm4 */
/* ---------------------------- */

if(typeof GM === "undefined") {
  this.GM = {};
}
if(typeof GM_openInTab !== "undefined" && typeof GM.openInTab === "undefined") {
  GM.openInTab = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_openInTab.apply(null, args));
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
let gmMenu = GM.registerMenuCommand || GM_registerMenuCommand;

/* ---------- */
/* les images */
/* ---------- */

const img_google = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm%2B48GgAAAgNJREFUOI2lkjto02EUxX%2Ff90%2BszaPB0iaVLkaCQiIIidJKl1gf6FCXVuiondwEJw0SpWhRxKEiLdJB3Yov8AHSksRQxKFJXBRxEotV0epi0zzJ%2FzqYpDESEL3T5Xyc851z74X%2FLNUMfD%2Fc12EWK2OCGkHhA1wotSxCXAzzes98%2BnVLgZX9u8Ii6i7Q1eJDE1FRd2LxYg2w1Jqv%2B3YfEuERYK1CAiyB5EH5qnhRNOlGRQ2QjXg9KG6vk%2BWZVkbAHU953fG039igu4BJUzPkiS3O%2FRGhHLOcKWa6J%2FLxXtDyMltwDniTyUKLGL9VNYIabgt9w9Kbo%2FRi8%2FnuqUydvHd8NYBVb2wmGmUpxaKOV7UZ%2BACMnlzZGX47x1SDRUPdx5TtzQKmwQ%2FApf%2FGZouy1iMUTWO5TVdcHyr27FkJ9kNiYd2CuopIJ4CIdCilItWHT3WBdxXH8%2FclZ%2BDy2s5NRVNfCt88Npg8fqsAkIjYZ2pagxPZ08ivXkSSUF3jlXwwOr4W%2FFwUA5Tak21ffdp356i%2FRgw9HrL1z0yeQ8wLVUi0oW5AwyWGZkcOKuQJDYcksKQgC2wFbEbej%2B3LCbTpuhaPOE7WHQBkRu%2FNK60PACv19LAF2AHYACrtb8h5pmc7ffZT9RE1j3bg4RFnKW8dA4YFtQ3EBXwEWVAwnRp9kGq1ln%2Bqn%2FOsr7FXPj6GAAAAAElFTkSuQmCC";
const img_duckduckgo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm%2B48GgAAAV9QTFRFAAAA2Vkz21Ux3F0u3Vcy3lg03lcz4Fw54Fs44Fs44Fw45oRp5oVq5oZr5oRp5oVq54Zr6pV96pZ%2B6pV96paA65mE6pV96pZ%2B6pd%2F65mC65qD6piD65qE7qiV7qqW762aZbxHabxLbblGno49ur%2FSvHQ5wnA4wszeyOe90OrG193p3lgz3lkz3lk13lo131sy31wx314632pL4JR14WIw4WdF4WhH4WlI4mpJ4pR%2B4pqF4vLc5G8s5IRq5LKZ5Xtd5n9i5n9j5oBk5oFl5oNn5qKR54No54Rp54Vp54Vq54Zr57er6H4m6IAr6aOL6fTn6oUk6qGM6rKl6u706%2FXs7NHK7Y8g7ban7ffp7pIg7pYe766c766d76%2Bd77Cf8J0c8LWl8Obk8bam8b%2By8qUZ8ryt8%2FDh9Pb59rUc9vb3%2BMEj%2BPn6%2Buzo%2Bvr8%2Bvv8%2FNEk%2FPz9%2Fvv6%2F%2Fnd%2F%2Fvq%2F%2F%2F%2F%2FjITPgAAACB0Uk5TABQVFlJUVYKDhIXY2dna2tv19fb29vf39%2Ff3%2BPj%2B%2Fv66jP7VAAAAz0lEQVQYV2NgwAaYufilpfk5mWF8NolodzMz9xgxVihf1iE81V5bW9tRFizCLO6gF5hTmGCore0kzAQU4IrWtg3OK0kPAqqJ5QAKCHhou%2BZqlRSo6Gpre%2FIABWTMtC2z1UtK0nzjA8ylgAJSptpGmSVF%2BVkpPjpmokABPjdt7cSS4ozIsCh9L5AWziRt7dCSEgsTGwPtOHaQtRIu2t4R1sZqqtrOQowgh7DKu1lpKigqKTvLsUCcyiqS7K8R4mcnCOUzMDBx8EpLcrOD1WMAAG67I%2F%2Bh5MSaAAAAAElFTkSuQmCC";
const img_gooduck = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhklEQVQ4y63Tv2tTURjG8c/NzaVSapFY6mBdK4oOqbq4dOgiLiJk6Ryc/QMC1aWruAkK/kQIuHQTpBkyOAhCxUmEDG5qurRNk+aHNw65SW8Nhg4903sO7/t9n/c553DSa2ft4vt2Radd8XGpXLifLxeCSfmZ9GZ7OX8lrmdvIcLNfKb3GM+ODUAxrmdHm4VMF4r5cmH5f4Bs0rmCWVzu1w+Z58IePXAX1UkKXuE6pqHfngZnM51h3sFxRniOnxC3ToHTQQ9aeDMRMFfdej1X3SqiCDoDH3LhAWxgO120st5YXFlvXBt5kPhwFU8g3psSzjM1ULCK1Xy58B3vcrWXOdxL1F4YmriATcxDvxMOPAj30o0XUYqjXZnuLJxPe/BgWAzxTgSioDs2cz9sD8NaGrB0JKsbJB78GAPE2f1h+CENOGJS/CsaxdGYggY08SgNWEsOE8Lh87+dbf2jYHcfdyqlmVr6Gj/hBl7g659vURNd/A4CX/AZbwkeNs88vVQpzWye2O/9C4nYcy1K62IBAAAAAElFTkSuQmCC";
let img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII=";
let img_info = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg==";
let img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
let img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg==";

/* -------------- */
/* les constantes */
/* -------------- */

const script_name = "[HFR] Recherche Google et DuckDuckGo";
const google_url = "https://www.google.com/search?q=";
const duckduckgo_url = "https://duckduckgo.com/?q=";
const insite = " site:forum.hardware.fr";

/* ------------------------- */
/* les paramètres par défaut */
/* ------------------------- */

// "google", "duckduckgo" ou "both"
const gmhfrrgedr21_search_engine_default = "duckduckgo";
// 0, 1, 2 ou 3 (forum, cat, sous-cat ou topic)
const gmhfrrgedr21_max_context_level_default = 2;
// true ou false
const gmhfrrgedr21_open_in_foreground_default = true;

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

let gmhfrrgedr21_search_engine;
let gmhfrrgedr21_max_context_level;
let gmhfrrgedr21_open_in_foreground;
let cat, subcat, topic, search_input, search_img;
let do_debug = false;

/* -------------------------------------------- */
/* les correspondances cats / sous-cats <=> url */
/* -------------------------------------------- */

let cats = {
  cat0: {
    key: "service-client-shophfr",
    name: "Service client shop.hardware.fr"
  },
  cat1: {
    key: "Hardware",
    name: "Hardware",
    subcats: {
      subcat0: {
        key: "carte-mere",
        name: "Carte mère"
      },
      subcat1: {
        key: "Memoire",
        name: "Mémoire"
      },
      subcat2: {
        key: "Processeur",
        name: "Processeur"
      },
      subcat3: {
        key: "2D-3D",
        name: "Carte graphique"
      },
      subcat4: {
        key: "Boitier",
        name: "Boitier"
      },
      subcat5: {
        key: "Alimentation",
        name: "Alimentation"
      },
      subcat6: {
        key: "HDD",
        name: "Disque dur"
      },
      subcat7: {
        key: "SSD",
        name: "Disque SSD"
      },
      subcat8: {
        key: "lecteur-graveur",
        name: "CD/DVD/BD"
      },
      subcat9: {
        key: "minipc",
        name: "Mini PC"
      },
      subcat10: {
        key: "Benchs",
        name: "Bench"
      },
      subcat11: {
        key: "Materiels-problemes-divers",
        name: "Matériels & problèmes divers"
      },
      subcat12: {
        key: "conseilsachats",
        name: "Conseil d'achat"
      },
      subcat13: {
        key: "hfr",
        name: "HFR"
      },
      subcat14: {
        key: "actualites",
        name: "Actus"
      }
    }
  },
  cat2: {
    key: "HardwarePeripheriques",
    name: "Hardware - Périphériques",
    subcats: {
      subcat0: {
        key: "Ecran",
        name: "Ecran"
      },
      subcat1: {
        key: "Imprimante",
        name: "Imprimante"
      },
      subcat2: {
        key: "Scanner",
        name: "Scanner"
      },
      subcat3: {
        key: "webcam-camera-ip",
        name: "Webcam / Caméra IP"
      },
      subcat4: {
        key: "Clavier-Souris",
        name: "Clavier / Souris"
      },
      subcat5: {
        key: "Joys",
        name: "Joys"
      },
      subcat6: {
        key: "Onduleur",
        name: "Onduleur"
      },
      subcat7: {
        key: "Divers",
        name: "Divers"
      }
    }
  },
  cat3: {
    key: "OrdinateursPortables",
    name: "Ordinateurs portables",
    subcats: {
      subcat0: {
        key: "portable",
        name: "Portable"
      },
      subcat1: {
        key: "Ultraportable",
        name: "Ultraportable"
      },
      subcat2: {
        key: "Transportable",
        name: "Transportable"
      },
      subcat3: {
        key: "Netbook",
        name: "Netbook"
      },
      subcat4: {
        key: "Composant",
        name: "Composant"
      },
      subcat5: {
        key: "Accessoire",
        name: "Accessoire"
      },
      subcat6: {
        key: "Conseils-d-achat",
        name: "Conseils d'achat"
      },
      subcat7: {
        key: "SAV",
        name: "SAV"
      }
    }
  },
  cat4: {
    key: "OverclockingCoolingModding",
    name: "Overclocking, Cooling & Modding",
    subcats: {
      subcat0: {
        key: "CPU",
        name: "CPU"
      },
      subcat1: {
        key: "GPU",
        name: "GPU"
      },
      subcat2: {
        key: "Air-Cooling",
        name: "Air Cooling"
      },
      subcat3: {
        key: "Water-Xtreme-Cooling",
        name: "Water & Xtreme Cooling"
      },
      subcat4: {
        key: "Silence",
        name: "Silence"
      },
      subcat5: {
        key: "Modding",
        name: "Modding"
      },
      subcat6: {
        key: "Divers-8",
        name: "Divers"
      }
    }
  },
  cat5: {
    key: "electroniquedomotiquediy",
    name: "Electronique, domotique, DIY",
    subcats: {
      subcat0: {
        key: "conception_depannage_mods",
        name: "Conception, dépannage, mods"
      },
      subcat1: {
        key: "nano-ordinateur_microcontroleurs_fpga",
        name: "Nano-ordinateur, microcontrôleurs, FPGA"
      },
      subcat2: {
        key: "domotique_maisonconnectee",
        name: "Domotique et maison connectée"
      },
      subcat3: {
        key: "mecanique_prototypage",
        name: "Mécanique, prototypage"
      },
      subcat4: {
        key: "imprimantes3D",
        name: "Imprimantes 3D"
      },
      subcat5: {
        key: "robotique_modelisme",
        name: "Robotique et modélisme"
      },
      subcat6: {
        key: "divers",
        name: "Divers"
      }
    }
  },
  cat6: {
    key: "gsmgpspda",
    name: "Technologies Mobiles",
    subcats: {
      subcat0: {
        key: "autres-os-mobiles",
        name: "Autres OS Mobiles"
      },
      subcat1: {
        key: "operateur",
        name: "Opérateur"
      },
      subcat2: {
        key: "telephone-android",
        name: "Téléphone Android"
      },
      subcat3: {
        key: "telephone-windows-phone",
        name: "Téléphone Windows Phone"
      },
      subcat4: {
        key: "telephone",
        name: "Téléphone"
      },
      subcat5: {
        key: "tablette",
        name: "Tablette"
      },
      subcat6: {
        key: "android",
        name: "Android"
      },
      subcat7: {
        key: "windows-phone",
        name: "Windows Phone"
      },
      subcat8: {
        key: "GPS-PDA",
        name: "GPS / PDA"
      },
      subcat9: {
        key: "accessoires",
        name: "Accessoires"
      }
    }
  },
  cat7: {
    key: "apple",
    name: "Apple",
    subcats: {
      subcat0: {
        key: "Mac-OS-X",
        name: "Mac OS X"
      },
      subcat1: {
        key: "Applications",
        name: "Applications"
      },
      subcat2: {
        key: "Mac",
        name: "Mac"
      },
      subcat3: {
        key: "Macbook",
        name: "Macbook"
      },
      subcat4: {
        key: "Iphone-amp-Ipod",
        name: "Iphone & Ipod"
      },
      subcat5: {
        key: "Ipad",
        name: "Ipad"
      },
      subcat6: {
        key: "Peripheriques",
        name: "Périphériques"
      }
    }
  },
  cat8: {
    key: "VideoSon",
    name: "Video & Son",
    subcats: {
      subcat0: {
        key: "HiFi-HomeCinema",
        name: "HiFi & Home Cinema"
      },
      subcat1: {
        key: "Materiel",
        name: "Matériel"
      },
      subcat2: {
        key: "Traitement-Audio",
        name: "Traitement Audio"
      },
      subcat3: {
        key: "Traitement-Video",
        name: "Traitement Vidéo"
      }
    }
  },
  cat9: {
    key: "Photonumerique",
    name: "Photo numérique",
    subcats: {
      subcat0: {
        key: "Appareil",
        name: "Appareil"
      },
      subcat1: {
        key: "Objectif",
        name: "Objectif"
      },
      subcat2: {
        key: "Accessoire",
        name: "Accessoire"
      },
      subcat3: {
        key: "Photos",
        name: "Photos"
      },
      subcat4: {
        key: "Technique",
        name: "Technique"
      },
      subcat5: {
        key: "Logiciels-Retouche",
        name: "Logiciels & Retouche"
      },
      subcat6: {
        key: "Argentique",
        name: "Argentique"
      },
      subcat7: {
        key: "Concours",
        name: "Concours"
      },
      subcat8: {
        key: "Galerie-Perso",
        name: "Galerie Perso"
      },
      subcat9: {
        key: "Divers-7",
        name: "Divers"
      }
    }
  },
  cat10: {
    key: "JeuxVideo",
    name: "Jeux Video",
    subcats: {
      subcat0: {
        key: "PC",
        name: "PC"
      },
      subcat1: {
        key: "Consoles",
        name: "Consoles"
      },
      subcat2: {
        key: "Achat-Ventes",
        name: "Achat & Ventes"
      },
      subcat3: {
        key: "Teams-LAN",
        name: "Teams & LAN"
      },
      subcat4: {
        key: "Tips-Depannage",
        name: "Tips & Dépannage"
      },
      subcat5: {
        key: "VR-Realite-Virtuelle",
        name: "Réalité virtuelle"
      },
      subcat6: {
        key: "mobiles",
        name: "Mobiles"
      }
    }
  },
  cat11: {
    key: "WindowsSoftware",
    name: "Windows & Software",
    subcats: {
      subcat0: {
        key: "windows-11",
        name: "Win 11"
      },
      subcat1: {
        key: "windows-10",
        name: "Win 10"
      },
      subcat2: {
        key: "windows-8",
        name: "Win 8"
      },
      subcat3: {
        key: "Windows-7-seven",
        name: "Win 7"
      },
      subcat4: {
        key: "Windows-vista",
        name: "Win Vista"
      },
      subcat5: {
        key: "Windows-nt-2k-xp",
        name: "Win NT/2K/XP"
      },
      subcat6: {
        key: "Win-9x-me",
        name: "Win 9x/Me"
      },
      subcat7: {
        key: "Securite",
        name: "Sécurité"
      },
      subcat8: {
        key: "Virus-Spywares",
        name: "Virus/Spywares"
      },
      subcat9: {
        key: "Stockage-Sauvegarde",
        name: "Stockage/Sauvegarde"
      },
      subcat10: {
        key: "Logiciels",
        name: "Logiciels"
      },
      subcat11: {
        key: "Tutoriels",
        name: "Tutoriels"
      }
    }
  },
  cat12: {
    key: "reseauxpersosoho",
    name: "Réseaux grand public / SoHo",
    subcats: {
      subcat0: {
        key: "FAI",
        name: "FAI"
      },
      subcat1: {
        key: "Reseaux",
        name: "Réseaux"
      },
      subcat2: {
        key: "Routage-et-securite",
        name: "Sécurité"
      },
      subcat3: {
        key: "WiFi-et-CPL",
        name: "WiFi et CPL"
      },
      subcat4: {
        key: "Hebergement",
        name: "Hébergement"
      },
      subcat5: {
        key: "Tel-TV-sur-IP",
        name: "Tel / TV sur IP"
      },
      subcat6: {
        key: "Chat-visio-et-voix",
        name: "Chat, visio et voix"
      },
      subcat7: {
        key: "Tutoriels",
        name: "Tutoriels"
      }
    }
  },
  cat13: {
    key: "systemereseauxpro",
    name: "Systèmes & Réseaux Pro",
    subcats: {
      subcat0: {
        key: "Reseaux",
        name: "Réseaux"
      },
      subcat1: {
        key: "Securite",
        name: "Sécurité"
      },
      subcat2: {
        key: "Telecom",
        name: "Télécom"
      },
      subcat3: {
        key: "Infrastructures-serveurs",
        name: "Infrastructures serveurs"
      },
      subcat4: {
        key: "Stockage",
        name: "Stockage"
      },
      subcat5: {
        key: "Logiciels-entreprise",
        name: "Logiciels d'entreprise"
      },
      subcat6: {
        key: "Management-SI",
        name: "Management du SI"
      },
      subcat7: {
        key: "poste-de-travail",
        name: "Poste de travail"
      }
    }
  },
  cat14: {
    key: "OSAlternatifs",
    name: "Linux et OS Alternatifs",
    subcats: {
      subcat0: {
        key: "Codes-scripts",
        name: "Codes et scripts"
      },
      subcat1: {
        key: "Debats",
        name: "Débats"
      },
      subcat2: {
        key: "Divers-2",
        name: "Divers"
      },
      subcat3: {
        key: "Hardware-2",
        name: "Hardware"
      },
      subcat4: {
        key: "Installation",
        name: "Installation"
      },
      subcat5: {
        key: "Logiciels-2",
        name: "Logiciels"
      },
      subcat6: {
        key: "Multimedia",
        name: "Multimédia"
      },
      subcat7: {
        key: "reseaux-securite",
        name: "réseaux et sécurité"
      }
    }
  },
  cat15: {
    key: "Programmation",
    name: "Programmation",
    subcats: {
      subcat0: {
        key: "ADA",
        name: "Ada"
      },
      subcat1: {
        key: "Algo",
        name: "Algo"
      },
      subcat2: {
        key: "Android",
        name: "Android"
      },
      subcat3: {
        key: "API-Win32",
        name: "API Win32"
      },
      subcat4: {
        key: "ASM",
        name: "ASM"
      },
      subcat5: {
        key: "ASP",
        name: "ASP"
      },
      subcat6: {
        key: "Big-Data",
        name: "BI/Big Data"
      },
      subcat7: {
        key: "C",
        name: "C"
      },
      subcat8: {
        key: "CNET-managed",
        name: "C#/.NET managed"
      },
      subcat9: {
        key: "C-2",
        name: "C++"
      },
      subcat10: {
        key: "Delphi-Pascal",
        name: "Delphi/Pascal"
      },
      subcat11: {
        key: "Flash-ActionScript",
        name: "Flash/ActionScript"
      },
      subcat12: {
        key: "HTML-CSS-Javascript",
        name: "HTML/CSS"
      },
      subcat13: {
        key: "iOS",
        name: "iOS"
      },
      subcat14: {
        key: "Java",
        name: "Java"
      },
      subcat15: {
        key: "Javascript-Node-js",
        name: "Javascript/Node.js"
      },
      subcat16: {
        key: "Langages-fonctionnels",
        name: "Langages fonctionnels"
      },
      subcat17: {
        key: "Perl",
        name: "Perl"
      },
      subcat18: {
        key: "PHP",
        name: "PHP"
      },
      subcat19: {
        key: "Python",
        name: "Python"
      },
      subcat20: {
        key: "Ruby",
        name: "Ruby/Rails"
      },
      subcat21: {
        key: "Shell-Batch",
        name: "Shell/Batch"
      },
      subcat22: {
        key: "SGBD-SQL",
        name: "SQL/NoSQL"
      },
      subcat23: {
        key: "VB-VBA-VBS",
        name: "VB/VBA/VBS"
      },
      subcat24: {
        key: "Windows-Phone",
        name: "Windows Phone"
      },
      subcat25: {
        key: "XML-XSL",
        name: "XML/XSL"
      },
      subcat26: {
        key: "Divers-6",
        name: "Divers"
      }
    }
  },
  cat16: {
    key: "Graphisme",
    name: "Graphisme",
    subcats: {
      subcat0: {
        key: "Cours",
        name: "Cours"
      },
      subcat1: {
        key: "Galerie",
        name: "Galerie"
      },
      subcat2: {
        key: "Infographie-2D",
        name: "Infographie 2D"
      },
      subcat3: {
        key: "PAO-Desktop-Publishing",
        name: "PAO / Desktop Publishing"
      },
      subcat4: {
        key: "Infographie-3D",
        name: "Infographie 3D"
      },
      subcat5: {
        key: "Webdesign",
        name: "Web design"
      },
      subcat6: {
        key: "Arts-traditionnels",
        name: "Arts traditionnels"
      },
      subcat7: {
        key: "Concours-2",
        name: "Concours"
      },
      subcat8: {
        key: "Ressources",
        name: "Ressources"
      },
      subcat9: {
        key: "Divers-5",
        name: "Divers"
      }
    }
  },
  cat17: {
    key: "AchatsVentes",
    name: "Achats & Ventes",
    subcats: {
      subcat0: {
        key: "Hardware",
        name: "Hardware"
      },
      subcat1: {
        key: "pc-portables",
        name: "PC Portables"
      },
      subcat2: {
        key: "tablettes",
        name: "Tablettes"
      },
      subcat3: {
        key: "Photo-Audio-Video",
        name: "Photo"
      },
      subcat4: {
        key: "audio-video",
        name: "Audio, Vidéo"
      },
      subcat5: {
        key: "Telephonie",
        name: "Téléphonie"
      },
      subcat6: {
        key: "Softs-livres",
        name: "Softs, livres"
      },
      subcat7: {
        key: "Divers-4",
        name: "Divers"
      },
      subcat8: {
        key: "Avis-estimations",
        name: "Avis, estimations"
      },
      subcat9: {
        key: "Feedback",
        name: "Feed-back"
      },
      subcat10: {
        key: "Regles-coutumes",
        name: "Règles et coutumes"
      }
    }
  },
  cat18: {
    key: "EmploiEtudes",
    name: "Emploi & Etudes",
    subcats: {
      subcat0: {
        key: "Marche-emploi",
        name: "Marché de l'emploi"
      },
      subcat1: {
        key: "Etudes-Orientation",
        name: "Etudes / Orientation"
      },
      subcat2: {
        key: "Annonces-emplois",
        name: "Annonces d'emplois"
      },
      subcat3: {
        key: "Feedback-entreprises",
        name: "Feedback sur les entreprises"
      },
      subcat4: {
        key: "Aide-devoirs",
        name: "Aide aux devoirs"
      }
    }
  },
  cat19: {
    key: "Setietprojetsdistribues",
    name: "Seti et projets distribués",
    subcats: {
      subcat0: {
        key: "BOINC",
        name: "BOINC"
      },
      subcat1: {
        key: "SETI",
        name: "SETI"
      },
      subcat2: {
        key: "projets-distribues",
        name: "Autres projets distribués"
      },
      subcat3: {
        key: "Divers-3",
        name: "Divers"
      }
    }
  },
  cat20: {
    key: "Discussions",
    name: "Discussions",
    subcats: {
      subcat0: {
        key: "Actualite",
        name: "Actualité"
      },
      subcat1: {
        key: "politique",
        name: "Politique"
      },
      subcat2: {
        key: "Societe",
        name: "Société"
      },
      subcat3: {
        key: "Cinema",
        name: "Cinéma"
      },
      subcat4: {
        key: "Musique",
        name: "Musique"
      },
      subcat5: {
        key: "Arts-Lecture",
        name: "Arts & Lecture"
      },
      subcat6: {
        key: "TV-Radio",
        name: "TV, Radio"
      },
      subcat7: {
        key: "Sciences",
        name: "Sciences"
      },
      subcat8: {
        key: "Sante",
        name: "Santé"
      },
      subcat9: {
        key: "Sports",
        name: "Sports"
      },
      subcat10: {
        key: "Auto-Moto",
        name: "Auto / Moto"
      },
      subcat11: {
        key: "Cuisine",
        name: "Cuisine"
      },
      subcat12: {
        key: "Loisirs",
        name: "Loisirs"
      },
      subcat13: {
        key: "voyages",
        name: "Voyages"
      },
      subcat14: {
        key: "Viepratique",
        name: "Vie pratique"
      }
    }
  }
};

/* -------------- */
/* les styles css */
/* -------------- */

let l_style = document.createElement("style");
l_style.setAttribute("type", "text/css");
l_style.textContent =
  // styles pour la fenêtre d'aide
  "#gmhfrrgedr21_help_window{position:fixed;width:200px;height:auto;z-index:1003;" +
  "background-color:#e3ebf5;visibility:hidden;border:2px solid #6995c3;border-radius:8px;" +
  "padding:4px 7px 5px;font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;" +
  "font-weight:bold;text-align:justify;}" +
  "img.gmhfrrgedr21_help_button{cursor:help;vertical-align:text-bottom;}" +
  // styles pour la fenêtre de configuration
  "#gmhfrrgedr21_config_background{position:fixed;left:0;top:0;background-color:#242424;" +
  "z-index:1001;visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gmhfrrgedr21_config_window{position:fixed;min-width:400px;height:auto;z-index:1002;" +
  "background-color:#ffffff;visibility:hidden;opacity:0;font-size:12px;padding:16px;" +
  "transition:opacity 0.3s ease 0s;color:#000000;border:1px solid #242424;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;}" +
  "#gmhfrrgedr21_config_window div.gmhfrrgedr21_main_title{font-size:16px;" +
  "text-align:center;cursor:default;font-weight:bold;margin:0 0 12px;white-space:nowrap;}" +
  "#gmhfrrgedr21_config_window fieldset{margin:0 0 12px;border:1px solid #888888;" +
  "padding:8px 10px 10px;cursor:default;}" +
  "#gmhfrrgedr21_config_window legend{font-size:14px;cursor:default;}" +
  "#gmhfrrgedr21_config_window div.gmhfrrgedr21_div{display:flex;cursor:default;" +
  "justify-content:space-evenly;align-items:center;}" +
  "#gmhfrrgedr21_config_window input[type=\"radio\"]{margin:0 0 1px;" +
  "vertical-align:text-bottom;}" +
  "#gmhfrrgedr21_config_window p{margin:0 4px;cursor:default;white-space:nowrap;}" +
  "#gmhfrrgedr21_config_window input[type=\"checkbox\"]{margin:0 0 1px;" +
  "vertical-align:text-bottom;}" +
  "#gmhfrrgedr21_config_window div.gmhfrrgedr21_save_close_div{text-align:right;" +
  "margin:16px 0 0 0;cursor:default;}" +
  "#gmhfrrgedr21_config_window div.gmhfrrgedr21_save_close_div > img{margin:0 0 0 8px;" +
  "cursor:pointer;vertical-align:text-bottom;}" +
  "#gmhfrrgedr21_config_window div.gmhfrrgedr21_save_close_div " +
  "div.gmhfrrgedr21_info_reload_div{float:left;}" +
  "#gmhfrrgedr21_config_window div.gmhfrrgedr21_save_close_div " +
  "div.gmhfrrgedr21_info_reload_div img{vertical-align:text-bottom;}" +
  // styles pour le champ de recherche
  "div#gmhfrrgedr21_search_div{display:inline-block;width:auto;height:18px;margin:0;" +
  "border:0;padding:0;position:relative;}" +
  "input#gmhfrrgedr21_search_input{box-sizing:border-box;width:200px;height:18px;" +
  "padding:0 17px 0 1px;border:1px solid black;margin:0;display:block;z-index:200;}" +
  "img#gmhfrrgedr21_search_img{width:16px;height:16px;margin:0;padding:0;border:0;" +
  "display:block;position:absolute;top:1px;right:1px;cursor:pointer;z-index:201;}"
document.getElementsByTagName("head")[0].appendChild(l_style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// fonction de désactivation de l'action par défaut sur un événement
function prevent_default(p_event) {
  p_event.preventDefault();
}

// création de la fenêtre d'aide
let help_window = document.createElement("div");
help_window.setAttribute("id", "gmhfrrgedr21_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(p_width, p_text) {
  let l_help_button = document.createElement("img");
  l_help_button.setAttribute("src", img_help);
  l_help_button.setAttribute("alt", "Aide");
  l_help_button.setAttribute("class", "gmhfrrgedr21_help_button");
  l_help_button.addEventListener("mouseover", function(p_event) {
    help_window.style.width = p_width + "px";
    help_window.textContent = p_text;
    help_window.style.left = (p_event.clientX + 32) + "px";
    help_window.style.top = (p_event.clientY - 16) + "px";
    help_window.style.visibility = "visible";
  }, false);
  l_help_button.addEventListener("mouseout", function() {
    help_window.style.visibility = "hidden";
  }, false);
  return l_help_button;
}

// création du voile de fond pour la fenêtre de configuration
let config_background = document.createElement("div");
config_background.setAttribute("id", "gmhfrrgedr21_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
config_background.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
let config_window = document.createElement("div");
config_window.setAttribute("id", "gmhfrrgedr21_config_window");
config_window.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
let main_title = document.createElement("div");
main_title.setAttribute("class", "gmhfrrgedr21_main_title");
main_title.appendChild(document.createTextNode("Configuration du script"));
main_title.appendChild(document.createElement("br"));
main_title.appendChild(document.createTextNode(script_name));
config_window.appendChild(main_title);

// section moteur de recherche
let engine_fieldset = document.createElement("fieldset");
let engine_legend = document.createElement("legend");
engine_legend.textContent = "Moteur de recherche ";
engine_legend.appendChild(create_help_button(200,
  "Goggle a tendance à bloquer les recherches répétées faites " +
  "à partir de ce script, DuckDuckGo est plus sympa."));
engine_fieldset.appendChild(engine_legend);
config_window.appendChild(engine_fieldset);

// div moteur
let engine_div = document.createElement("div");
engine_div.setAttribute("class", "gmhfrrgedr21_div");
engine_fieldset.appendChild(engine_div);

// google
let google_div = document.createElement("div");
let google_radio = document.createElement("input");
google_radio.setAttribute("type", "radio");
google_radio.setAttribute("id", "gmhfrrgedr21_google_radio");
google_radio.setAttribute("name", "gmhfrrgedr21_engine_radios");
google_div.appendChild(google_radio);
let google_label = document.createElement("label");
google_label.textContent = " Google";
google_label.setAttribute("for", "gmhfrrgedr21_google_radio");
google_div.appendChild(google_label);
engine_div.appendChild(google_div);

// duckduckgo
let duckduckgo_div = document.createElement("div");
let duckduckgo_radio = document.createElement("input");
duckduckgo_radio.setAttribute("type", "radio");
duckduckgo_radio.setAttribute("id", "gmhfrrgedr21_duckduckgo_radio");
duckduckgo_radio.setAttribute("name", "gmhfrrgedr21_engine_radios");
duckduckgo_div.appendChild(duckduckgo_radio);
let duckduckgo_label = document.createElement("label");
duckduckgo_label.textContent = " DuckDuckGo";
duckduckgo_label.setAttribute("for", "gmhfrrgedr21_duckduckgo_radio");
duckduckgo_div.appendChild(duckduckgo_label);
engine_div.appendChild(duckduckgo_div);

// both
let both_div = document.createElement("div");
let both_radio = document.createElement("input");
both_radio.setAttribute("type", "radio");
both_radio.setAttribute("id", "gmhfrrgedr21_both_radio");
both_radio.setAttribute("name", "gmhfrrgedr21_engine_radios");
both_div.appendChild(both_radio);
let both_label = document.createElement("label");
both_label.textContent = " Why Not Both?";
both_label.setAttribute("for", "gmhfrrgedr21_both_radio");
both_div.appendChild(both_label);
engine_div.appendChild(both_div);

// section niveau de contextualisation
let context_fieldset = document.createElement("fieldset");
let context_legend = document.createElement("legend");
context_legend.appendChild(document.createTextNode("Niveau de contextualisation maximal "));
context_legend.appendChild(create_help_button(280,
  "La contextualisation au niveau \u00ab\u202ftopic\u202f\u00bb peut donner des " +
  "résultats assez pauvres et il peut être intéressant de rester au niveau " +
  "\u00ab\u202fcat\u202f\u00bb ou \u00ab\u202fsous-cat\u202f\u00bb pour faire " +
  "des recherches de topics plutôt que d'essayer de faire des recherches intra-topic."));
context_fieldset.appendChild(context_legend);
config_window.appendChild(context_fieldset);

// div contexte
let context_div = document.createElement("div");
context_div.setAttribute("class", "gmhfrrgedr21_div");
context_fieldset.appendChild(context_div);

// forum
let forum_div = document.createElement("div");
let forum_radio = document.createElement("input");
forum_radio.setAttribute("type", "radio");
forum_radio.setAttribute("id", "gmhfrrgedr21_forum_radio");
forum_radio.setAttribute("name", "gmhfrrgedr21_context_radios");
forum_div.appendChild(forum_radio);
let forum_label = document.createElement("label");
forum_label.textContent = " forum";
forum_label.setAttribute("for", "gmhfrrgedr21_forum_radio");
forum_div.appendChild(forum_label);
context_div.appendChild(forum_div);

// cat
let cat_div = document.createElement("div");
let cat_radio = document.createElement("input");
cat_radio.setAttribute("type", "radio");
cat_radio.setAttribute("id", "gmhfrrgedr21_cat_radio");
cat_radio.setAttribute("name", "gmhfrrgedr21_context_radios");
cat_div.appendChild(cat_radio);
let cat_label = document.createElement("label");
cat_label.textContent = " cat";
cat_label.setAttribute("for", "gmhfrrgedr21_cat_radio");
cat_div.appendChild(cat_label);
context_div.appendChild(cat_div);

// sous-cat
let subcat_div = document.createElement("div");
let subcat_radio = document.createElement("input");
subcat_radio.setAttribute("type", "radio");
subcat_radio.setAttribute("id", "gmhfrrgedr21_subcat_radio");
subcat_radio.setAttribute("name", "gmhfrrgedr21_context_radios");
subcat_div.appendChild(subcat_radio);
let subcat_label = document.createElement("label");
subcat_label.textContent = " sous-cat";
subcat_label.setAttribute("for", "gmhfrrgedr21_subcat_radio");
subcat_div.appendChild(subcat_label);
context_div.appendChild(subcat_div);

// topic
let topic_div = document.createElement("div");
let topic_radio = document.createElement("input");
topic_radio.setAttribute("type", "radio");
topic_radio.setAttribute("id", "gmhfrrgedr21_topic_radio");
topic_radio.setAttribute("name", "gmhfrrgedr21_context_radios");
topic_div.appendChild(topic_radio);
let topic_label = document.createElement("label");
topic_label.textContent = " topic";
topic_label.setAttribute("for", "gmhfrrgedr21_topic_radio");
topic_div.appendChild(topic_label);
context_div.appendChild(topic_div);

// section divers
let misc_fieldset = document.createElement("fieldset");
let misc_legend = document.createElement("legend");
misc_legend.textContent = "Divers";
misc_fieldset.appendChild(misc_legend);
config_window.appendChild(misc_fieldset);

// ouverture au premier plan
let open_foreground_p = document.createElement("p");
let open_foreground_checkbox = document.createElement("input");
open_foreground_checkbox.setAttribute("id", "gmhfrrgedr21_open_foreground_checkbox");
open_foreground_checkbox.setAttribute("type", "checkbox");
open_foreground_p.appendChild(open_foreground_checkbox);
let open_foreground_label = document.createElement("label");
open_foreground_label.textContent = " ouvrir les recherches au premier plan";
open_foreground_label.setAttribute("for", "gmhfrrgedr21_open_foreground_checkbox");
open_foreground_p.appendChild(open_foreground_label);
misc_fieldset.appendChild(open_foreground_p);

// info "sans rechargement" et boutons de validation et de fermeture
let save_close_div = document.createElement("div");
save_close_div.setAttribute("class", "gmhfrrgedr21_save_close_div");
let info_reload_div = document.createElement("div");
info_reload_div.setAttribute("class", "gmhfrrgedr21_info_reload_div");
let info_reload_img = document.createElement("img");
info_reload_img.setAttribute("src", img_info);
info_reload_img.setAttribute("alt", "Information");
info_reload_div.appendChild(info_reload_img);
info_reload_div.appendChild(document.createTextNode(" sans rechargement "));
info_reload_div.appendChild(create_help_button(255,
  "Les paramètres de cette fenêtre de configuration sont appliqués immédiatement " +
  "à la validation, il n'est pas nécessaire de recharger la page."));
save_close_div.appendChild(info_reload_div);
let save_button = document.createElement("img");
save_button.setAttribute("src", img_save);
save_button.setAttribute("alt", "Valider");
save_button.setAttribute("title", "Valider");
save_button.addEventListener("click", save_config_window, false);
save_close_div.appendChild(save_button);
let close_button = document.createElement("img");
close_button.setAttribute("src", img_close);
close_button.setAttribute("alt", "Annuler");
close_button.setAttribute("title", "Annuler");
close_button.addEventListener("click", hide_config_window, false);
save_close_div.appendChild(close_button);
config_window.appendChild(save_close_div);

// fonction de validation de la fenêtre de configuration
function save_config_window() {
  // fermeture de la fenêtre
  hide_config_window();
  // récupération des paramètres
  gmhfrrgedr21_search_engine = google_radio.checked ? "google" :
    (duckduckgo_radio.checked ? "duckduckgo" : "both");
  gmhfrrgedr21_max_context_level =
    forum_radio.checked ? 0 : (cat_radio.checked ? 1 : (subcat_radio.checked ? 2 : 3));
  gmhfrrgedr21_open_in_foreground = open_foreground_checkbox.checked;
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("gmhfrrgedr21_search_engine", gmhfrrgedr21_search_engine),
    GM.setValue("gmhfrrgedr21_max_context_level", gmhfrrgedr21_max_context_level),
    GM.setValue("gmhfrrgedr21_open_in_foreground", gmhfrrgedr21_open_in_foreground),
  ]);
  // mise à jour du champ de recherche
  update_search();
}

// fonction de fermeture de la fenêtre de configuration
function hide_config_window() {
  config_window.style.opacity = "0";
  config_background.style.opacity = "0";
}

// fonction de fermeture de la fenêtre de configuration par la touche echap
function esc_config_window(p_event) {
  if(p_event.key === "Escape") {
    hide_config_window();
  }
}

// fonction de gestion de la fin de la transition d'affichage /
// disparition de la fenêtre de configuration
function background_transitionend() {
  if(config_background.style.opacity === "0") {
    config_window.style.visibility = "hidden";
    config_background.style.visibility = "hidden";
    document.removeEventListener("keydown", esc_config_window, false);
  }
  if(config_background.style.opacity === "0.8") {
    document.addEventListener("keydown", esc_config_window, false);
  }
}

// fonction d'affichage de la fenêtre de configuration
function show_config_window() {
  // initialisation des paramètres
  google_radio.checked = gmhfrrgedr21_search_engine === "google";
  duckduckgo_radio.checked = gmhfrrgedr21_search_engine === "duckduckgo";
  both_radio.checked = gmhfrrgedr21_search_engine === "both";
  forum_radio.checked = gmhfrrgedr21_max_context_level === 0;
  cat_radio.checked = gmhfrrgedr21_max_context_level === 1;
  subcat_radio.checked = gmhfrrgedr21_max_context_level === 2;
  topic_radio.checked = gmhfrrgedr21_max_context_level === 3;
  open_foreground_checkbox.checked = gmhfrrgedr21_open_in_foreground;
  // affichage de la fenêtre
  config_window.style.visibility = "visible";
  config_background.style.visibility = "visible";
  config_window.style.left = parseInt((document.documentElement.clientWidth -
    config_window.offsetWidth) / 2, 10) + "px";
  config_window.style.top = parseInt((document.documentElement.clientHeight -
    config_window.offsetHeight) / 2, 10) + "px";
  config_background.style.width = document.documentElement.scrollWidth + "px";
  config_background.style.height = document.documentElement.scrollHeight + "px";
  config_window.style.opacity = "1";
  config_background.style.opacity = "0.8";
}

// ajout d'une entrée de configuration dans le menu de l'extension
gmMenu("\u200b" + script_name + " -> Configuration", show_config_window);

/* ------------------ */
/* fonctions globales */
/* ------------------ */

function update_search() {
  if(search_input && search_img) {
    let search_title, search_image;
    if(gmhfrrgedr21_search_engine === "google") {
      search_title = "[HFR] Recherche Google";
      search_image = img_google;
    } else if(gmhfrrgedr21_search_engine === "duckduckgo") {
      search_title = "[HFR] Recherche DuckDuckGo";
      search_image = img_duckduckgo;
    } else {
      search_title = script_name;
      search_image = img_gooduck;
    }
    let context = gmhfrrgedr21_max_context_level === 0 ? "forum" :
      (gmhfrrgedr21_max_context_level === 1 ? "cat" :
        (gmhfrrgedr21_max_context_level === 2 ? "sous-cat" : "topic"));
    search_title += " (" + context + ")";
    search_input.setAttribute("title", search_title);
    search_img.setAttribute("src", search_image);
    search_img.setAttribute("title", search_title);
  }
}

function gogogo() {
  let inurl = "";
  if(gmhfrrgedr21_max_context_level > 0 && cat) inurl += " inurl:" + cat.key;
  if(gmhfrrgedr21_max_context_level > 1 && subcat) inurl += "/" + subcat.key;
  if(gmhfrrgedr21_max_context_level > 2 && topic) inurl += "/" + topic;
  if(gmhfrrgedr21_search_engine !== "duckduckgo") { // "google" ou "both"
    GM.openInTab(google_url + encodeURIComponent(search_input.value + insite + inurl),
      !gmhfrrgedr21_open_in_foreground);
  }
  if(gmhfrrgedr21_search_engine !== "google") { // "duckduckgo" ou "both"
    GM.openInTab(duckduckgo_url + encodeURIComponent(search_input.value + insite + inurl),
      !gmhfrrgedr21_open_in_foreground);
  }
}

function goinput(p_event) {
  if(p_event.key === "Enter") {
    p_event.preventDefault();
    gogogo();
  }
}

function goimg(p_event) {
  p_event.preventDefault();
  if(p_event.button === 2) {
    show_config_window();
  } else {
    gogogo();
  }
}

/* ------------------------ */
/* récupération du contexte */
/* ------------------------ */

// cat
let tree2 = document.querySelector("#md_arbo_tree_2");
tree2 = tree2 ?
  (tree2.nodeName.toUpperCase() == "H1" ?
    tree2.lastChild.textContent.replace(/\u00A0/g, " ").trim() :
    (tree2.nodeName.toUpperCase() == "SPAN" ?
      tree2.lastElementChild.firstChild.textContent.replace(/\u00A0/g, " ").trim() :
      null)) :
  null;
// debug
if(do_debug) console.log(script_name, "tree2 :", tree2);
if(tree2) {
  for(let i in cats) {
    if(tree2 === cats[i].name) {
      cat = cats[i];
      break;
    }
  }
}
// debug
if(do_debug) {
  if(cat) console.log(script_name, "cat :", cat.key);
}

// sous-cat
let tree3 = document.querySelector("#md_arbo_tree_3");
tree3 = tree3 ?
  (tree3.nodeName.toUpperCase() == "H1" ?
    tree3.lastChild.textContent.replace(/\u00A0/g, " ").trim() :
    (tree3.nodeName.toUpperCase() == "SPAN" ?
      tree3.lastElementChild.firstChild.textContent.replace(/\u00A0/g, " ").trim() :
      null)) :
  null;
// debug
if(do_debug) console.log(script_name, "tree3 :", tree3);
if(cat && tree3) {
  for(let j in cat.subcats) {
    if(tree3 === cat.subcats[j].name) {
      subcat = cat.subcats[j];
      break;
    }
  }
}
// debug
if(do_debug) {
  if(subcat) console.log(script_name, "subcat :", subcat.key);
}

// topic
let formsearch = document.querySelector("div#mesdiscussions.mesdiscussions " +
  "table.main tr th form[action=\"/transsearch.php\"], " +
  "div#mesdiscussions.mesdiscussions > " +
  "form#hop[action=\"/bddpost.php?config=hfr.inc\"]");
if(formsearch !== null &&
  formsearch.querySelector("input[name=\"cat\"]") !== null &&
  formsearch.querySelector("input[name=\"post\"]") !== null) {
  let cat = formsearch.querySelector("input[name=\"cat\"]").value.trim();
  let post = formsearch.querySelector("input[name=\"post\"]").value.trim();
  fetch("https://forum.hardware.fr/forum2.php?config=hfr.inc&cat=" + cat +
    "&post=" + post, {
      method: "GET",
      mode: "same-origin",
      credentials: "omit",
      cache: "reload",
      referrer: "",
      referrerPolicy: "no-referrer"
    }).then(function(r) {
    let retopic = r.url.match(/\/([^\/]+)-sujet_/);
    if(retopic !== null) {
      topic = retopic[1];
      // debug
      if(do_debug) {
        if(topic) console.log(script_name, "topic :", topic);
      }
    }
  }).catch(function(e) {
    console.log(script_name, "ERROR fetch topic url :", e);
  });
}

/* ----------------------------------------------------------------- */
/* récupération des paramètres et construction du champ de recherche */
/* ----------------------------------------------------------------- */

Promise.all([
  GM.getValue("gmhfrrgedr21_search_engine", gmhfrrgedr21_search_engine_default),
  GM.getValue("gmhfrrgedr21_max_context_level", gmhfrrgedr21_max_context_level_default),
  GM.getValue("gmhfrrgedr21_open_in_foreground", gmhfrrgedr21_open_in_foreground_default),
]).then(function([
  gmhfrrgedr21_search_engine_value,
  gmhfrrgedr21_max_context_level_value,
  gmhfrrgedr21_open_in_foreground_value,
]) {
  gmhfrrgedr21_search_engine = gmhfrrgedr21_search_engine_value;
  gmhfrrgedr21_max_context_level = gmhfrrgedr21_max_context_level_value;
  gmhfrrgedr21_open_in_foreground = gmhfrrgedr21_open_in_foreground_value;
  let search = document.querySelector("table.hfrheadmenu td[align=right]");
  if(search) {
    while(search.firstChild) {
      search.removeChild(search.firstChild);
    }
    let search_div = document.createElement("div");
    search_div.setAttribute("id", "gmhfrrgedr21_search_div");
    search.appendChild(search_div);
    search_input = document.createElement("input");
    search_input.setAttribute("id", "gmhfrrgedr21_search_input");
    search_input.setAttribute("type", "text");
    search_input.setAttribute("class", "fastsearchInput");
    search_input.addEventListener("keydown", goinput, false);
    search_img = document.createElement("img");
    search_img.setAttribute("id", "gmhfrrgedr21_search_img");
    search_img.addEventListener("click", prevent_default, false);
    search_img.addEventListener("contextmenu", prevent_default, false);
    search_img.addEventListener("mousedown", prevent_default, false);
    search_img.addEventListener("mouseup", goimg, false);
    search_div.appendChild(search_input);
    search_div.appendChild(search_img);
  }
  update_search();
});