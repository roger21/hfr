// ==UserScript==
// @name          [HFR] Better Quote Links In Search Results
// @version       1.0.0
// @namespace     roger21.free.fr
// @description   Corrige les liens des quotes dans les résultats des recherches intra-topic filtrés.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/forum2.php?post=*&cat=*&config=hfr.inc*&spseudo=*&filter=1*
// @include       https://forum.hardware.fr/forum2.php?post=*&cat=*&config=hfr.inc*&word=*&filter=1*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_better_quote_links.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_better_quote_links.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_better_quote_links.user.js
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

// $Rev: 2171 $

// historique :
// 1.0.0 (15/06/2020) :
// - nouveau nom : [HFR] Better Quotes In Search Results -> [HFR] Better Quote Links In Search Results
// - ajout des metadata de mise à jour
// 0.9.0 (11/06/2020) :
// - création sur une idée de frankie_flowers

// la constante
const script_name = "[HFR] Better Quote Links In Search Results";

// récupération des identifiants du topic
var topic_id = null;
var cat_id = null;
var url_data = /\?post=([0-9]+)&cat=([0-9]+)&/.exec(window.location.href);
if(url_data !== null && typeof url_data[1] !== "undefined" && typeof url_data[2] !== "undefined") {
  topic_id = url_data[1];
  cat_id = url_data[2];
} else {
  console.log(script_name + " ERROR topic_id et cat_id non trouvés : \n" + window.location.href);
}

// recherche des quotes et correction des liens
if(topic_id && cat_id) {
  var quotes = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions table.messagetable div.container > table.citation " +
    "tbody > tr.none > td > b.s1 > a.Topic, " +
    "div#mesdiscussions.mesdiscussions table.messagetable div.container > table.oldcitation " +
    "tbody > tr.none > td > b.s1 > a.Topic");
  for(let l_quote of quotes) {
    // récupération du numéro de post
    let l_post_id = /^.*#t([0-9]+)$/.exec(l_quote.href);
    if(l_post_id !== null && typeof l_post_id[1] !== "undefined") {
      l_post_id = l_post_id[1];
      l_quote.href = "https://forum.hardware.fr/forum2.php?config=hfr.inc&cat=" + cat_id + "&post=" + topic_id +
        "&numreponse=" + l_post_id;
    } else {
      console.log(script_name + " ERROR post_id non trouvés : \n" + window.location.href + "\n" + l_quote.href);
    }
  }
}
