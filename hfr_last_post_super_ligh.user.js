// ==UserScript==
// @name          [HFR] Last Post Super Light
// @version       1.1.1
// @namespace     roger21.free.fr
// @description   Version fortement allégée de [HFR] Last Post Highlight, sans fenêtre de configuration ni sections optionnelles ni réparation d'ancres (configuration possible des couleurs des leds et de la ligne de séparation dans le code).
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_last_post_super_ligh.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_last_post_super_ligh.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_last_post_super_ligh.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2019-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1590 $

// historique :
// 1.1.1 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 1.1.0 (30/01/2020) :
// - ajout d'une option de configuration pour permettre la navigation sur les leds
// 1.0.0 (24/11/2019) :
// - création

/* ------------- */
/* configuration */
/* ------------- */

// couleur des leds des posts lus
var led_read = "green"; // "grey", "white", "red", "orange", "yellow", "green" ou "blue"

// couleur des leds des posts non lus
var led_unread = "grey"; // "grey", "white", "red", "orange", "yellow", "green" ou "blue"

// activation ou non de la ligne de séparation
var split_line = false; // true ou false

// couleur de la ligne de séparation
var split_color = "#3bea2c"; // une couleur compatible CSS avec les " "

// ligne de séparation transparente ou non
var split_trans = false; // true ou false

// épaisseur de la ligne de séparation en pixels
var split_thick = 8; // une valeur entière sans " "

// navigation sur les leds
var enable_navigation = false; // true ou false

/* -------- */
/* les leds */
/* -------- */

var led_grey = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACK0lEQVR42oWSS4jSURTG%2F6M2TTS0GVrNpja6EKGFpItcND4wxI2CkoQYpCi%2B8IGKbVSUEkQlfCGKqfgWdZFmBOO4ENFcBRFt2hREMTRNVNRA%2F9u5MgWCMRcOd3O%2B8%2FvOdy9BrDmJRGIDinJaG8RZx%2B12UxQKxSWBQLAnEoluC4VCmUqlumGz2ba73S6V%2BA%2BFymAwbjKZzAccDmefz%2BdPxGLxQiqV7kskEq9er7%2BOe1ZEQKGAQE6n0wdAGsVisbe1Wu1TNps98vl8h1qt9rVMJnuq0%2BmurZC5XO5lECWxqN1uv5nP5yeTyYTs9XoolUr9hkFfPR7PS41G44VB20sRTKWwWKx72F6n03m1WCxOxuMx6vf7qFQqoXw%2Bj4rFIpnL5Y5dLtczi8WytwwsFArRQPgQ02az2bvpdEoOh0NULpdRoVBA1WoVgW3UbDZ%2FBgKBA6PRqMJpE8FgcJPNZkfVavVwNBp9HAwGS9JfEa5Go4FardavcDh8YDAY7oIDKiZSeTyeS6lUTqHpGBqW9jARk05pCPb9AcInDofjFggpyz3B5hW5XN6BIV%2BSySSJiViAaVgEu5NAPfR6vY%2Bgdv6lCja34M3sZrP5BU6wXq%2BTkC7ChUVwf45EIs%2BtVqsC7nMrbwlR7wDVY7fbm0D9UKlUvgP1G9zv%2FX7%2FY7B4J5PJXFz7e0wm0wWgXwWyz%2Bl0pkCQAmv34ezC%2B22e%2BWej0SgtHo%2BfT6fTW5AubV3PH8ERO2Jz5Yz2AAAAAElFTkSuQmCC";
var led_white = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAB%2BklEQVR42oWSzUtiURjG7er0QdEmWrWp%2F6BVqza1a9tAMDGboIW4cKEwRC4MN7kKSUxXOjsl1JU0o2G1cAwtFZP8%2Fv52vI52%2FWAKurfnSEaC0YGX98J5f%2Bd5znMujzdiFQqFMRT1WmO8z1Y8HqfMZvOsWq1e12q13zQazabNZluNRCIzNE3zeR%2Bo8EUi0ZpYLD6Uy%2BUXKpXqj06nuzUYDBd6vX7f4%2FGskJkhyGKxUAC%2BCoXCM6hc5nK59F%2BsUqnUTCaTtMvlihiNxl9ut3t5SFmhUMwD0hAIG7Fut%2FvU6XTYRqPBQeUZBzG4xp3T6dxPpVIzfahcLlMSiWSX2AN03%2Bv1ntrtNtdsNrlqtcpVKhXSWcw9xGIxezAYXO8Hlk6nBVKpVIkwLqFUIEqtVusNqtVqHFxz9Xr9P9SufD7fNkmbgOMymezIbrf%2FZhim9l6JQO%2FAx0wmc%2BX1enewzycgX6lU%2FrBardcYesAAB1t9mACDwjV6AG3RaHQDe1T%2Fnoh90WQyWXFICzbYATRQA8Si04lE4hg195aqw%2BGYBCwJBAI3%2BXyewRCLYe61WLj4l81mz0Oh0Bb6l6G3RNRzUN0Lh8OnUK1ArYsDOuhFhPITFr8Xi8XpkX%2BP3%2B%2BfgvoSlA8weALgBNZkqAV8j3%2F6z%2BLBBbA8AeVJpCsYNfMCVaTBP1R0V4cAAAAASUVORK5CYII%3D";
var led_red = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACA0lEQVR42oWSX0iTURjGH7%2BtZUwTka5CXF4I3u0qEBLZ7kJEaJGVmQzGQETEIUNbskRZidCFsF2kRFcRCXkjqyhtIllQFyFUdBNBQiXin2GhYufp%2Bb5CGCw88HIOnPc5v%2Fd93gMUWaa5uURh%2FYsSHLZMebn1HDieAYJTwKU7wLnXwBkDlDGVcuE%2FFNdFIHAVuDkAzE8AL%2B8Cbx%2FofB%2B49h04becUiOYBS4LQeSArygs2NX1mf%2F%2BqaWvbYHX12hfg4yzweAXwF5CvAyckSjui4eFPXFzcYzZrzPg4TWvrbzY25o3Xu%2FxBZPp8ZY6I7e1WBIjY5XF09D2XlvY4M0OTTpPd3WRnJxmNGnZ0bNHjebqt%2Fh3DWF%2FvjgK3pmzawsJXzs0ZTk6SPT1kOEz29VFlk0NDO6ytza0Dl223wbo6Twy4%2FQ54wunpHwekSITs7SVjMXJwkEwmd%2Bn351aBMLu6XDbRlQLiOeCVkraUQJVFXf4l2ZFI0IyN%2FZJwlsBZ3VlOn7LdlwUeib6pMoxDtAU2TSKOjBhR10xl5YSpqKg6cHUZKJU4lgfeMBDIMx43cpdO2KJkcp0NDc92gAvajxTMUlZXiTqwDzw0LS3f1N9PPbCtfYU1NfdU4hUTCnmL%2Fp5N4Jjop0S%2BocSMZpZReQnFSZ09h%2F5ZDdzNYPCohl8qd93Fcv4AZnMki27Mp7kAAAAASUVORK5CYII%3D";
var led_orange = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACJElEQVR42oWSb0iTURjFj9tahlaE9Cki60MQREiQEBjlvkSEFE5K%2Bz9YA43%2BjTB1lloyDUlB2AoNiSiLFha1pkvdZsspVCBCiR8KyUElYjosTOqenneFMFh44eG%2B8D7n%2Fs49zwWSLOXZmyKl%2B1cpWGypxuW6HitWuPfDdMuMopZ85A%2BWIEfVIZ0Rpx7%2FoegLtyD32FbUle1CoDkP%2FW0FePOgCIH2QlR8cSBb60kQBU5CJwJzwWb4hBLkvZ0fGbgwoZ4c%2FEbX2smxixjxnkBntBxZCeRKE1aLyBUXvaoZ5Xh4nh98Sg02UD3a95t3d8TU9bTh93ZU8EZmelzEp4d11m2wavYYqX3HaGSeo4%2Bp3rpI%2FynSe5zssik%2BOzrDBqN%2F9gpM8cDYuslgy0a9hBHkp75xjvUqDrWSL06Tzy1kz3mKbfLlpTne3BCauoxDWtpgy0ajPQeNQ2fQxRHP1wVSp5XsPkv22slQORmu%2Bsm2rNBEJSz0F%2Bs1ot65G6UhGwakaUYaKLZEXPyXpFWfg2rg2g8RelmPPfJPF7%2BnxJ7ps6BD6NNiQ8WJmkCjiYj9V5VQJ1XTqmbVtDJjIdXhc0gVsT1Wg9dsz40xWKokXcZLE4Wrpnhne%2FdcLQ7IviRhlhJ1hlDLfjnxUHnyPsv9vssBs7JH6V53WyweUR3mtKSvZ7oay4S%2BXsjV0uiWmbnFnkNqjXwbF32zMnAD75uWyvBTJV1Dsp4%2Fn6tXslRwGRgAAAAASUVORK5CYII%3D";
var led_yellow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACPklEQVR42mNgwAJeXEtiBGImKGZkIAQenNBhWjpJnK%2BlVMips0o4sr1COGjDHAmb%2B8fked4%2Fns7MgMMWZl9nbsdgL%2B72zFj%2BfQ1FQke7q4XPTG4Q3TepSaTq9BZZM5AaFE3Lp4gzATUEezlxbQPasv%2FZ5Yh7bx%2B0v3p1Pef9ozNWb46sk7k%2Br0ds%2B4lNMgYoNucm8osCNU0FaXr%2FeOLN7x9P%2F%2Fr2%2FsC%2FD09n%2FX95I%2FXvs8thnx6c0Lq0Z7lU1eOztjxgTa9uFTBF%2BPGkgJz3%2FvHUq98%2Fn%2F%2F19e3O%2Fx%2BfL%2F7%2F5l7d%2F9e3i%2F%2B%2FuVv179Wtoo8PTqjtvLZPzgkcYE%2FOu7BE%2BfF0AANj%2F%2FePJx9%2F%2B3Ds36cXK4CaGv6%2FvlP6%2F%2B395v9AZ%2F9%2F97Dvx%2BNz9gcu7pKNAoU2UKMTW0okX9%2F2RZI7vrzZ9hJu051KoKZGIG4Faur6%2F%2B7RhJ9PL3ofOLtNNvHN3RpmkI3MZZkCZSumShwHKvoIVPAf6Cyg82rANkFs6%2Fn%2F4cmMb0CNW%2B4fV%2FQEyjGB%2FQkMdoUFfWLrgLZ%2FADrjH8hGsCawbT3%2F3z%2Be%2FA9o65uHp%2FQnPTipJwwP1R1LpDiAmouu7JU7%2FfxK5Kd3Dzv%2BAUP3PwQDNT2a8O7Z5aDdNw%2FKhwFpVpS4BAa1MNDWirtH5Fe9uJ7yHOi%2Fr0ADvgDpJ4%2FPWi8AOjHm5Y1Mbqyp59JuOU6g7YpAmxuACqcB42wa0HnVQCwNZLMRTLPACGd5fjWaHRj5HMDQZcGmBgBqYG9%2FOd9%2FowAAAABJRU5ErkJggg%3D%3D";
var led_green = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACS0lEQVR42mNgwAZeMDACMRMUMzIQBHuACps0%2BBiyGJwY8hgiGXIYghh6GWwYNjHwZH9iYGbAYQszgx2DI4sTSzt3EPc%2BvmS%2Bozy5PGfECrj3sZawVknPYTADq0EBbUCbnBmCmayZtkmnSO%2FP2BF%2Fr%2FJawavI84HvTbaYvJGYyn%2Bdt4ZpO8MCBgNUmyMYRIGapoI0dd1ovLno76xf3f%2Ba%2F6W8C%2FlvddXor%2BUpzU%2BqG4QuiUxkrWI4xcAD0fQJaJsbQwrIeR136q6u%2BrvoV%2FPfkv8p30L%2Bm7zS%2Ba%2FyUua%2F8Svlf5YPND6qrOXbKbGEyQkSYBcYWBg8GDoEMwT3L%2Fw74%2FHkf93%2FUn6F%2FLcGapJ5J%2FJf5pfIf2Ugtvuq9kP6sOABpuVMUeDQttrLwMYQyNAn1ym8o%2FFnxcuUbzFgm5TBmnj%2BC%2F9j%2Ba%2F8j%2Be%2F%2BU%2B5n9JngRqXMCUyfMpmBtnIzBvNUCbayHM86InXR%2BdPNv%2BVXwI1feP5L%2FMPgpX%2Fify3%2FafzTe6M8BamLUyeQI1MEH%2FmMygIV3OtM9in8UHrpvI%2F5U8iYA0Q20T%2BG%2F9T%2Fuf2weSN4hbRScz7mIURoTqZgYMln6VIeqHQacPzmp%2BMvyn%2F0%2Fkn8x%2BEQZrsv5q9UzsnvVtyOUcYw20GVpSolO5nEBasYalQWiaxyv6S3nOXlyZfXd5af3F5Yf1Ea7f8Aok1HDH6Dxm4sSYeuQUMnJI9HIpyC4QaxNaKTVPaLzYN6Lxq3j280sD4YyOYZNnvsLOwPmRlZ3mmw8H%2Bg50FmxoAFVjscNYPt9YAAAAASUVORK5CYII%3D";
var led_blue = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACIElEQVR42oVSbUiTYRR93ZYZXfqR6NCx2WygWZFgjIL6oYRhlEGBlFSwSiGypGFlmjhF1CwTq9knYaFEhtGPzD5gBjL8kX3YpwqKVBiFlIqFDXpP55lFDBY%2BcHkeuPc859xzr6aFOdsOIoJh%2BBMR2mwnzgmD2HsXiLU1Q2y3tov15hZZ3L9GUiDeFhi1%2F7AYJTY%2FXWILaiS%2B2ifWa36xtfdKQqdPEjpKJHnaqWpCQJL4zEDAVonZfY8sXRv3YLjyHL7kFeNbyjqMSdL4O7F3d0rSVGoIs8TXxRDkVaCGqxh4NYiA%2Fzn0SzeAnYfwa4MLk%2BaVeCmO0ZLl6yFB0L7j7Mvs3qvknb2ON2%2BHEPD1AC13gGN1wIFyoKga%2Bv4yTCxMxQNZgoygYc5smMRcVEszuvr68eHpa%2BhtHUDpKaCwAihvACgbJy9jekUWHksycpXbWtomREqc57Q4Ru4%2F7Mbnv0zuKqCsHvA0AjXngfor%2BLk2RwEDrqO17JOMRrF4j0jiix4WTbAAlAUmg0wqTlwELrTiB4F3ZSmymDPMmGNrXyR2%2F22yj1OGrhgVQLEpUGMzdLKOWVfjjGUVov%2B56ngfRbCbjT%2FJzsNklRc63YUKBaKKr5m78Ij5HN5zQmfpGI0mazG3pC23EJ%2FY33d%2BMMX747JMNFPiDtdhzA%2B7PfxxHtntvD0sbOLMmiivlGHhO3LWneXATZvzMZfDj6K7pnA1vwF1cUHO48ciTwAAAABJRU5ErkJggg%3D%3D";

/* ------------ */
/* la constante */
/* ------------ */

const leds = {
  grey: led_grey,
  white: led_white,
  red: led_red,
  orange: led_orange,
  yellow: led_yellow,
  green: led_green,
  blue: led_blue,
};

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var split_table;
var offset_height = 1;
var last_post = null;
var last_table = null;
var next_table = null;

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // style pour les leds
  "#mesdiscussions div.toolbar div.left img.gm_hfr_lpsl_led{margin-bottom:-1px;}" +
  // style pour la ligne de séparation
  "div#mesdiscussions.mesdiscussions table#gm_hfr_lpsl_split_line" +
  "{border-left:0;border-right:0;box-sizing:border-box;display:none;}";
document.getElementsByTagName("head")[0].appendChild(style);

/* ---------------------------------------------- */
/* création des leds et de la ligne de séparation */
/* ---------------------------------------------- */

// function permettant de connaitre la position absolue d'un element
function get_offset(p_element) {
  var _x = 0;
  var _y = 0;
  while(p_element && !isNaN(p_element.offsetLeft) && !isNaN(p_element.offsetTop)) {
    _x += p_element.offsetLeft - p_element.scrollLeft;
    _y += p_element.offsetTop - p_element.scrollTop;
    p_element = p_element.offsetParent;
  }
  return {
    top: _y,
    left: _x
  };
}

// fonction permettant de scroller la page vers un élement donné
function scroll_to_element(p_element) {
  window.scrollTo(0, get_offset(p_element).top);
}

// fonction de gestion de la navigation sur les leds
function navigate(p_event) {
  p_event.preventDefault();
  if(enable_navigation && p_event.button === 0) {
    if(this.dataset.lastpost === "true") {
      if(next_table) {
        scroll_to_element(next_table);
      }
    } else {
      if(last_table) {
        scroll_to_element(last_table);
      }
    }
  }
}

// fonction de création et de mise à jour des leds et de la ligne de séparation
function update_leds_and_line() {
  let l_last_post = null;
  if(window.location.hash !== "" && window.location.hash.substring(1, 2) === "t") {
    l_last_post = parseInt(window.location.hash.substring(2), 10);
  }
  l_last_post = l_last_post !== null ? l_last_post : (last_post !== null ? last_post : null);
  if(l_last_post !== null) {
    last_post = l_last_post;
    last_table = null;
    next_table = null;
    let l_posts = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody > " +
      "tr.message > td.messCase1 > a[name^=\"t\"]");
    let l_split = false;
    for(let l_post of l_posts) {
      let l_post_number = parseInt(l_post.getAttribute("name").substring(1), 10);
      let l_led_img = l_post.parentElement.parentElement.cells[1]
        .querySelector(":scope > div.toolbar > div.left > img.gm_hfr_lpsl_led");
      if(!l_led_img) {
        l_led_img = document.createElement("img");
        l_led_img.setAttribute("class", "gm_hfr_lpsl_led");
        l_led_img.addEventListener("mouseup", navigate, false);
        l_post.parentElement.parentElement.cells[1].firstElementChild.firstElementChild.insertBefore(l_led_img,
          l_post.parentElement.parentElement.cells[1].firstElementChild.firstElementChild.firstChild);
      }
      l_led_img.dataset.lastpost = "false";
      if(enable_navigation) {
        l_led_img.setAttribute("title", "Rejoindre le dernier post lu");
        l_led_img.style.cursor = "pointer";
      }
      if(l_post_number <= l_last_post) {
        l_led_img.setAttribute("src", leds[led_read]);
        if(!l_split) {
          last_table = l_post.parentElement.parentElement.parentElement.parentElement;
        }
        if(l_post_number === l_last_post) {
          l_led_img.dataset.lastpost = "true";
          if(enable_navigation) {
            l_led_img.setAttribute("title", "Rejoindre le post juste après");
          }
        }
      } else {
        if(!l_split) {
          next_table = l_post.parentElement.parentElement.parentElement.parentElement;
        }
        l_split = true;
        l_led_img.setAttribute("src", leds[led_unread]);
      }
    }
    if(split_line && last_table) {
      last_table.parentNode.insertBefore(split_table, last_table.nextSibling);
      split_table.style.backgroundColor = split_trans ? "transparent" : split_color;
      split_table.style.height = (split_thick + offset_height) + "px";
      split_table.style.display = "table";
    } else {
      split_table.style.display = "none";
    }
  }
}

// création des leds et de la ligne de séparation
let l_root = document.querySelector("div#mesdiscussions.mesdiscussions");
if(l_root) {
  split_table = document.createElement("table");
  split_table.setAttribute("id", "gm_hfr_lpsl_split_line");
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
  update_leds_and_line();
  window.addEventListener("hashchange", update_leds_and_line, false);
}
