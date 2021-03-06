// ==UserScript==
// @name          [HFR] Rehost Https
// @version       1.0.0
// @namespace     roger21.free.fr
// @description   Corrige en https les liens et images vers reho.st s'ils sont en http (indispensable pour afficher les images réparées).
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_rehost_https.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_rehost_https.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_rehost_https.user.js
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

// $Rev: 2509 $

// historique :
// 1.0.0 (05/09/2020) :
// - version 1.0.0
// 0.9.0 (05/09/2020) :
// - création

(function() {
  let l_rehost_https = "https://reho.st/";
  let l_magic_number = 34;
  let l_rehost_http = "http://reho.st/";
  let l_rehost_http_length = 15;
  let l_imgs = document.querySelectorAll("img[src^=\"" + l_rehost_http + "\"]");
  for(let l_img of l_imgs) {
    let l_new_src = l_rehost_https + l_img.getAttribute("src").substring(l_rehost_http_length);
    l_img.setAttribute("src", l_new_src);
    l_img.setAttribute("alt", l_new_src);
    l_img.setAttribute("title", l_new_src);
  }
  let l_links = document.querySelectorAll("a[href^=\"" + l_rehost_http + "\"]");
  for(let l_link of l_links) {
    let l_old_href = l_link.getAttribute("href");
    l_link.setAttribute("href", l_rehost_https + l_old_href.substring(l_rehost_http_length));
    if(l_link.firstChild && l_link.firstChild.nodeType === 3 &&
      l_link.firstChild.nodeValue.startsWith(l_old_href.substring(0, l_magic_number))) {
      l_link.firstChild.nodeValue =
        l_rehost_https + l_link.firstChild.nodeValue.substring(l_rehost_http_length);
    }
  }
  let l_rehost_www_http = "http://www.reho.st/";
  let l_rehost_www_http_length = 19;
  let l_imgs_www = document.querySelectorAll("img[src^=\"" + l_rehost_www_http + "\"]");
  for(let l_img of l_imgs_www) {
    let l_new_src = l_rehost_https + l_img.getAttribute("src").substring(l_rehost_www_http_length);
    l_img.setAttribute("src", l_new_src);
    l_img.setAttribute("alt", l_new_src);
    l_img.setAttribute("title", l_new_src);
  }
  let l_links_www = document.querySelectorAll("a[href^=\"" + l_rehost_www_http + "\"]");
  for(let l_link of l_links_www) {
    let l_old_href = l_link.getAttribute("href");
    l_link.setAttribute("href", l_rehost_https + l_old_href.substring(l_rehost_www_http_length));
    if(l_link.firstChild && l_link.firstChild.nodeType === 3 &&
      l_link.firstChild.nodeValue.startsWith(l_old_href.substring(0, l_magic_number))) {
      l_link.firstChild.nodeValue =
        l_rehost_https + l_link.firstChild.nodeValue.substring(l_rehost_www_http_length);
    }
  }
})();
