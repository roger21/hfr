// ==UserScript==
// @name          [HFR] Last Post Highlight
// @version       2.1.4
// @namespace     roger21.free.fr
// @description   Permet de distinguer les posts lus des posts non lus par l'ajout d'une diode sur les posts et en affichant une ligne de séparation (optionnelle) et répare les ancres cassées (en cas de suppression de post).
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_last_post_highlight.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_last_post_highlight.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_last_post_highlight.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2012, 2014-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 2543 $

// historique :
// 2.1.4 (17/09/2020) :
// - meilleur gestion de la conversion des liens en images avec images.weserv.nl
// 2.1.3 (16/05/2020) :
// - correction d'un wtf (copié / collé foireux ?) dans le code
// - amélioration des styles de la fenêtre de configuration
// 2.1.2 (12/03/2020) :
// - adaptation du code de recherche des leds pour fonctionner avec [HFR] Chat
// 2.1.1 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// - prise en compte des urls non-rého.stées pour la conversion des lien en images dans les quotes ->
// (pour les smileys générés de toyonos et les emojis de [HFR] Copié/Collé)
// 2.1.0 (30/01/2020) :
// - ajout d'une option pour permettre la navigation sur les leds
// 2.0.2 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 2.0.1 (30/11/2019) :
// - ajout de majuscules sur les titres des sections de la fenêtre de configuration
// 2.0.0 (24/11/2019) :
// - ajout d'une fenêtre de configuration (couleur des leds et ligne de séparation)
// - ajout de la ligne de séparation
// - intégration de [HFR] Réparateur d'ancres
// - mise à jour de la description
// - désactivation des sections optionnelles par défaut (avant passage dans un script distinct à terme)
// 1.9.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 1.9.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.9.0 (16/09/2018) :
// - affichage des emojis de [HFR] Copié/Collé dans les quotes (comme des smileys)
// - nouveau nom : [HFR] last post highlight -> [HFR] Last Post Highlight
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - maj de la metadata @description
// 1.8.4 (13/05/2018) :
// - re-check du code dans tm (ff)
// - maj de la metadata @homepageURL
// 1.8.3 (28/04/2018) :
// - petites améliorations du code et check du code dans tm
// 1.8.2 (12/04/2018) :
// - amélioration de l'alignement de la diode
// - suppression des @grant inutiles (tous)
// 1.8.1 (28/11/2017) :
// - passage au https
// 1.8.0 (31/07/2017) :
// - suppression de code obsolète ou inutile
// - adaptation de la description
// 1.7.1 (12/12/2016) :
// - légers recodages / formatages / améliorations
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.7.0 (06/04/2016) :
// - gestion de la navigation interne
// 1.6.5 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.6.4 (05/11/2014) :
// - ajout d'une url pour la detection des stickers
// 1.6.3 (19/08/2014) :
// - correction d'un bug sur la gestion des liens sur les smileys dans les quotes
// 1.6.2 (19/08/2014) :
// - correction d'un bug sur la page de réponse/edition normale
// 1.6.1 (24/07/2014) :
// - correction d'un problème pour l'affichage du bbcode des posts (dû à la suppression de la publicité)
// 1.6.0 (20/07/2014) :
// - l'homogènéisation est débile, retour à l'affichage des leds uniquement quand un post est spécifié
// 1.5.1 (20/07/2014) :
// - prise en compte de la cible #bas
// - utilisation de la propriété hash au lieu de la regexp sur l'url
// 1.5.0 (19/07/2014) :
// - correction d'un bug en mode non connecté
// - suppression des publicités (en mode non connecté)
// - fonctionnement homogène sur toutes les pages (avec ou sans post cible)
// 1.4.0 (29/04/2014) :
// - nouvelle descriptions
// - nettoyage du code
// - nouvelle url d'include pour prendre en compte tout le forum
// - ajout de la suppression de la section mesdiscussions.net (en bas de page)
// - ajout de la suppression de la section copyright hardware.fr (en bas de page)
// - ajout de commentaires détaillés sur les suppressions
// - ajout de l'affichage des stickers dans les quotes (comme les smileys)
// - ajout de commentaires détaillés sur l'afficahe des toyos/stickers
// - amélioration du code pour la gestion des toyos/stickers dans les quotes
// 1.3.4.2 (28/04/2014) :
// - corrections mineures sur le code et les commentaires
// 1.3.4.1 (27/04/2014) :
// - supression des <br /> autour des sujets relatifs
// 1.3.4 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.3.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.3.2 (14/09/2012) :
// - ajout des metadata @grant
// 1.3.1 (18/05/2012) :
// - probleme d'encodage (pas utf-8)
// 1.3.0 (18/05/2012) :
// - suppression des sujets relatifs au lieu du display "none" pour compatibilité avec offcetParent
// 1.2.0 (15/02/2012) :
// - correction d'un bug sur la comparaison des numeros de post
// - commentaires sur les leds
// - commentaires sur les truc en bas
// 1.1.0 (15/02/2012) :
// - ajout d'un numero de version (c'est con hein)

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

/* ---------------------- */
/* les leds et les images */
/* ---------------------- */

var led_grey = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACK0lEQVR42oWSS4jSURTG%2F6M2TTS0GVrNpja6EKGFpItcND4wxI2CkoQYpCi%2B8IGKbVSUEkQlfCGKqfgWdZFmBOO4ENFcBRFt2hREMTRNVNRA%2F9u5MgWCMRcOd3O%2B8%2FvOdy9BrDmJRGIDinJaG8RZx%2B12UxQKxSWBQLAnEoluC4VCmUqlumGz2ba73S6V%2BA%2BFymAwbjKZzAccDmefz%2BdPxGLxQiqV7kskEq9er7%2BOe1ZEQKGAQE6n0wdAGsVisbe1Wu1TNps98vl8h1qt9rVMJnuq0%2BmurZC5XO5lECWxqN1uv5nP5yeTyYTs9XoolUr9hkFfPR7PS41G44VB20sRTKWwWKx72F6n03m1WCxOxuMx6vf7qFQqoXw%2Bj4rFIpnL5Y5dLtczi8WytwwsFArRQPgQ02az2bvpdEoOh0NULpdRoVBA1WoVgW3UbDZ%2FBgKBA6PRqMJpE8FgcJPNZkfVavVwNBp9HAwGS9JfEa5Go4FardavcDh8YDAY7oIDKiZSeTyeS6lUTqHpGBqW9jARk05pCPb9AcInDofjFggpyz3B5hW5XN6BIV%2BSySSJiViAaVgEu5NAPfR6vY%2Bgdv6lCja34M3sZrP5BU6wXq%2BTkC7ChUVwf45EIs%2BtVqsC7nMrbwlR7wDVY7fbm0D9UKlUvgP1G9zv%2FX7%2FY7B4J5PJXFz7e0wm0wWgXwWyz%2Bl0pkCQAmv34ezC%2B22e%2BWej0SgtHo%2BfT6fTW5AubV3PH8ERO2Jz5Yz2AAAAAElFTkSuQmCC";
var led_white = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAB%2BklEQVR42oWSzUtiURjG7er0QdEmWrWp%2F6BVqza1a9tAMDGboIW4cKEwRC4MN7kKSUxXOjsl1JU0o2G1cAwtFZP8%2Fv52vI52%2FWAKurfnSEaC0YGX98J5f%2Bd5znMujzdiFQqFMRT1WmO8z1Y8HqfMZvOsWq1e12q13zQazabNZluNRCIzNE3zeR%2Bo8EUi0ZpYLD6Uy%2BUXKpXqj06nuzUYDBd6vX7f4%2FGskJkhyGKxUAC%2BCoXCM6hc5nK59F%2BsUqnUTCaTtMvlihiNxl9ut3t5SFmhUMwD0hAIG7Fut%2FvU6XTYRqPBQeUZBzG4xp3T6dxPpVIzfahcLlMSiWSX2AN03%2Bv1ntrtNtdsNrlqtcpVKhXSWcw9xGIxezAYXO8Hlk6nBVKpVIkwLqFUIEqtVusNqtVqHFxz9Xr9P9SufD7fNkmbgOMymezIbrf%2FZhim9l6JQO%2FAx0wmc%2BX1enewzycgX6lU%2FrBardcYesAAB1t9mACDwjV6AG3RaHQDe1T%2Fnoh90WQyWXFICzbYATRQA8Si04lE4hg195aqw%2BGYBCwJBAI3%2BXyewRCLYe61WLj4l81mz0Oh0Bb6l6G3RNRzUN0Lh8OnUK1ArYsDOuhFhPITFr8Xi8XpkX%2BP3%2B%2BfgvoSlA8weALgBNZkqAV8j3%2F6z%2BLBBbA8AeVJpCsYNfMCVaTBP1R0V4cAAAAASUVORK5CYII%3D";
var led_red = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACA0lEQVR42oWSX0iTURjGH7%2BtZUwTka5CXF4I3u0qEBLZ7kJEaJGVmQzGQETEIUNbskRZidCFsF2kRFcRCXkjqyhtIllQFyFUdBNBQiXin2GhYufp%2Bb5CGCw88HIOnPc5v%2Fd93gMUWaa5uURh%2FYsSHLZMebn1HDieAYJTwKU7wLnXwBkDlDGVcuE%2FFNdFIHAVuDkAzE8AL%2B8Cbx%2FofB%2B49h04becUiOYBS4LQeSArygs2NX1mf%2F%2BqaWvbYHX12hfg4yzweAXwF5CvAyckSjui4eFPXFzcYzZrzPg4TWvrbzY25o3Xu%2FxBZPp8ZY6I7e1WBIjY5XF09D2XlvY4M0OTTpPd3WRnJxmNGnZ0bNHjebqt%2Fh3DWF%2FvjgK3pmzawsJXzs0ZTk6SPT1kOEz29VFlk0NDO6ytza0Dl223wbo6Twy4%2FQ54wunpHwekSITs7SVjMXJwkEwmd%2Bn351aBMLu6XDbRlQLiOeCVkraUQJVFXf4l2ZFI0IyN%2FZJwlsBZ3VlOn7LdlwUeib6pMoxDtAU2TSKOjBhR10xl5YSpqKg6cHUZKJU4lgfeMBDIMx43cpdO2KJkcp0NDc92gAvajxTMUlZXiTqwDzw0LS3f1N9PPbCtfYU1NfdU4hUTCnmL%2Fp5N4Jjop0S%2BocSMZpZReQnFSZ09h%2F5ZDdzNYPCohl8qd93Fcv4AZnMki27Mp7kAAAAASUVORK5CYII%3D";
var led_orange = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACJElEQVR42oWSb0iTURjFj9tahlaE9Cki60MQREiQEBjlvkSEFE5K%2Bz9YA43%2BjTB1lloyDUlB2AoNiSiLFha1pkvdZsspVCBCiR8KyUElYjosTOqenneFMFh44eG%2B8D7n%2Fs49zwWSLOXZmyKl%2B1cpWGypxuW6HitWuPfDdMuMopZ85A%2BWIEfVIZ0Rpx7%2FoegLtyD32FbUle1CoDkP%2FW0FePOgCIH2QlR8cSBb60kQBU5CJwJzwWb4hBLkvZ0fGbgwoZ4c%2FEbX2smxixjxnkBntBxZCeRKE1aLyBUXvaoZ5Xh4nh98Sg02UD3a95t3d8TU9bTh93ZU8EZmelzEp4d11m2wavYYqX3HaGSeo4%2Bp3rpI%2FynSe5zssik%2BOzrDBqN%2F9gpM8cDYuslgy0a9hBHkp75xjvUqDrWSL06Tzy1kz3mKbfLlpTne3BCauoxDWtpgy0ajPQeNQ2fQxRHP1wVSp5XsPkv22slQORmu%2Bsm2rNBEJSz0F%2Bs1ot65G6UhGwakaUYaKLZEXPyXpFWfg2rg2g8RelmPPfJPF7%2BnxJ7ps6BD6NNiQ8WJmkCjiYj9V5VQJ1XTqmbVtDJjIdXhc0gVsT1Wg9dsz40xWKokXcZLE4Wrpnhne%2FdcLQ7IviRhlhJ1hlDLfjnxUHnyPsv9vssBs7JH6V53WyweUR3mtKSvZ7oay4S%2BXsjV0uiWmbnFnkNqjXwbF32zMnAD75uWyvBTJV1Dsp4%2Fn6tXslRwGRgAAAAASUVORK5CYII%3D";
var led_yellow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACPklEQVR42mNgwAJeXEtiBGImKGZkIAQenNBhWjpJnK%2BlVMips0o4sr1COGjDHAmb%2B8fked4%2Fns7MgMMWZl9nbsdgL%2B72zFj%2BfQ1FQke7q4XPTG4Q3TepSaTq9BZZM5AaFE3Lp4gzATUEezlxbQPasv%2FZ5Yh7bx%2B0v3p1Pef9ozNWb46sk7k%2Br0ds%2B4lNMgYoNucm8osCNU0FaXr%2FeOLN7x9P%2F%2Fr2%2FsC%2FD09n%2FX95I%2FXvs8thnx6c0Lq0Z7lU1eOztjxgTa9uFTBF%2BPGkgJz3%2FvHUq98%2Fn%2F%2F19e3O%2Fx%2BfL%2F7%2F5l7d%2F9e3i%2F%2B%2FuVv179Wtoo8PTqjtvLZPzgkcYE%2FOu7BE%2BfF0AANj%2F%2FePJx9%2F%2B3Ds36cXK4CaGv6%2FvlP6%2F%2B395v9AZ%2F9%2F97Dvx%2BNz9gcu7pKNAoU2UKMTW0okX9%2F2RZI7vrzZ9hJu051KoKZGIG4Faur6%2F%2B7RhJ9PL3ofOLtNNvHN3RpmkI3MZZkCZSumShwHKvoIVPAf6Cyg82rANkFs6%2Fn%2F4cmMb0CNW%2B4fV%2FQEyjGB%2FQkMdoUFfWLrgLZ%2FADrjH8hGsCawbT3%2F3z%2Be%2FA9o65uHp%2FQnPTipJwwP1R1LpDiAmouu7JU7%2FfxK5Kd3Dzv%2BAUP3PwQDNT2a8O7Z5aDdNw%2FKhwFpVpS4BAa1MNDWirtH5Fe9uJ7yHOi%2Fr0ADvgDpJ4%2FPWi8AOjHm5Y1Mbqyp59JuOU6g7YpAmxuACqcB42wa0HnVQCwNZLMRTLPACGd5fjWaHRj5HMDQZcGmBgBqYG9%2FOd9%2FowAAAABJRU5ErkJggg%3D%3D";
var led_green = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACS0lEQVR42mNgwAZeMDACMRMUMzIQBHuACps0%2BBiyGJwY8hgiGXIYghh6GWwYNjHwZH9iYGbAYQszgx2DI4sTSzt3EPc%2BvmS%2Bozy5PGfECrj3sZawVknPYTADq0EBbUCbnBmCmayZtkmnSO%2FP2BF%2Fr%2FJawavI84HvTbaYvJGYyn%2Bdt4ZpO8MCBgNUmyMYRIGapoI0dd1ovLno76xf3f%2Ba%2F6W8C%2FlvddXor%2BUpzU%2BqG4QuiUxkrWI4xcAD0fQJaJsbQwrIeR136q6u%2BrvoV%2FPfkv8p30L%2Bm7zS%2Ba%2FyUua%2F8Svlf5YPND6qrOXbKbGEyQkSYBcYWBg8GDoEMwT3L%2Fw74%2FHkf93%2FUn6F%2FLcGapJ5J%2FJf5pfIf2Ugtvuq9kP6sOABpuVMUeDQttrLwMYQyNAn1ym8o%2FFnxcuUbzFgm5TBmnj%2BC%2F9j%2Ba%2F8j%2Be%2F%2BU%2B5n9JngRqXMCUyfMpmBtnIzBvNUCbayHM86InXR%2BdPNv%2BVXwI1feP5L%2FMPgpX%2Fify3%2FafzTe6M8BamLUyeQI1MEH%2FmMygIV3OtM9in8UHrpvI%2F5U8iYA0Q20T%2BG%2F9T%2Fuf2weSN4hbRScz7mIURoTqZgYMln6VIeqHQacPzmp%2BMvyn%2F0%2Fkn8x%2BEQZrsv5q9UzsnvVtyOUcYw20GVpSolO5nEBasYalQWiaxyv6S3nOXlyZfXd5af3F5Yf1Ea7f8Aok1HDH6Dxm4sSYeuQUMnJI9HIpyC4QaxNaKTVPaLzYN6Lxq3j280sD4YyOYZNnvsLOwPmRlZ3mmw8H%2Bg50FmxoAFVjscNYPt9YAAAAASUVORK5CYII%3D";
var led_blue = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACIElEQVR42oVSbUiTYRR93ZYZXfqR6NCx2WygWZFgjIL6oYRhlEGBlFSwSiGypGFlmjhF1CwTq9knYaFEhtGPzD5gBjL8kX3YpwqKVBiFlIqFDXpP55lFDBY%2BcHkeuPc859xzr6aFOdsOIoJh%2BBMR2mwnzgmD2HsXiLU1Q2y3tov15hZZ3L9GUiDeFhi1%2F7AYJTY%2FXWILaiS%2B2ifWa36xtfdKQqdPEjpKJHnaqWpCQJL4zEDAVonZfY8sXRv3YLjyHL7kFeNbyjqMSdL4O7F3d0rSVGoIs8TXxRDkVaCGqxh4NYiA%2Fzn0SzeAnYfwa4MLk%2BaVeCmO0ZLl6yFB0L7j7Mvs3qvknb2ON2%2BHEPD1AC13gGN1wIFyoKga%2Bv4yTCxMxQNZgoygYc5smMRcVEszuvr68eHpa%2BhtHUDpKaCwAihvACgbJy9jekUWHksycpXbWtomREqc57Q4Ru4%2F7Mbnv0zuKqCsHvA0AjXngfor%2BLk2RwEDrqO17JOMRrF4j0jiix4WTbAAlAUmg0wqTlwELrTiB4F3ZSmymDPMmGNrXyR2%2F22yj1OGrhgVQLEpUGMzdLKOWVfjjGUVov%2B56ngfRbCbjT%2FJzsNklRc63YUKBaKKr5m78Ij5HN5zQmfpGI0mazG3pC23EJ%2FY33d%2BMMX747JMNFPiDtdhzA%2B7PfxxHtntvD0sbOLMmiivlGHhO3LWneXATZvzMZfDj6K7pnA1vwF1cUHO48ciTwAAAABJRU5ErkJggg%3D%3D";
var img_switch = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAAk0lEQVQoz%2BXQPQrCYBCE4ScxEAV%2FGsHCQ8Q7iZaKXkuwEHIPFTuxELS3shESC3%2BIfkfIdPsyy%2BwO9VZkLZd955HcWvRvS2yVxj9sqrSTVFHHUWEepCyVTnqvQLqu2h7uQVChLXE3dEuQaiISB8bofVbjAwYuCrMgeqFw1q%2BiloPSJHhmL%2F3fjq1sKvVkNlZhPfXSE7eWHs%2Bup3UpAAAAAElFTkSuQmCC";
var img_switch_disabled = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAAl0lEQVR42mNgGNGglbF1XevWVn043wDIW9fKiK6MpfVC6%2F%2FWZBSxNKDIxVYWZCHe1tut%2F1rzMWwpAiq928oP4%2FK1fgYK%2FGr90PoRDb5v%2FQ2U%2BdoqAFEoCub%2Bbv0E1IAKP4FlfrYKw8wUb30CtDoPw%2BpCoOjDVhFkIc7WK0C9qRieudTKjq6bqXV16yak4NEH8lZjBM8IAwDu4GM%2Fjllv8AAAAABJRU5ErkJggg%3D%3D";
var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var img_reset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";
var img_info = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";

/* -------------- */
/* les constantes */
/* -------------- */

const leds = {
  grey: led_grey,
  white: led_white,
  red: led_red,
  orange: led_orange,
  yellow: led_yellow,
  green: led_green,
  blue: led_blue,
};
const order = ["grey", "white", "red", "orange", "yellow", "green", "blue"];
const crazy_read = ["grey", "white"];
const crazy_unread = ["red", "orange", "yellow", "green", "blue"];

/* ---------------------- */
/* les options par défaut */
/* ---------------------- */

var led_read_default = "green";
var led_unread_default = "grey";
var crazy_leds_default = true;
var crazy_switch_default = "false";
var split_line_default = false;
var split_color_default = "#3bea2c";
var split_trans_default = false;
var split_thick_default = 8;
var enable_navigation_default = false;

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var led_read;
var led_unread;
var crazy_leds;
var crazy_switch;
var split_line;
var split_color;
var split_trans;
var split_thick;
var enable_navigation;
var split_table;
var its_crazy = false;
var offset_height = 1;
var read_timer_test;
var unread_timer_test;
var read_timer;
var unread_timer;
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
  "#mesdiscussions div.toolbar img.gm_hfr_lph_led{cursor:pointer;margin-bottom:-1px;}" +
  // style pour la ligne de séparation
  "div#mesdiscussions.mesdiscussions table#gm_hfr_lph_split_line" +
  "{border-left:0;border-right:0;box-sizing:border-box;display:none;}" +
  // styles pour la fenêtre d'aide
  "#gm_hfr_lph_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:1003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;text-align:justify;}" +
  "#gm_hfr_lph_config_window img.gm_hfr_lph_help_button{cursor:help;vertical-align:text-bottom;}" +
  // styles pour la fenêtre de configuration
  "#gm_hfr_lph_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_hfr_lph_config_window{position:fixed;min-width:250px;height:auto;background:#ffffff;z-index:1002;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;}" +
  "#gm_hfr_lph_config_window div.gm_hfr_lph_main_title{font-size:16px;text-align:center;" +
  "font-weight:bold;margin:0 0 8px;cursor:default;}" +
  "#gm_hfr_lph_config_window fieldset{margin:0 0 8px;border:1px solid #888888;padding:6px 10px 10px;" +
  "background:linear-gradient(to bottom, #ffffff 20px, transparent);transition:background-color 0.3s ease 0s;}" +
  "#gm_hfr_lph_config_window fieldset.gm_hfr_lph_red{background-color:#ffc0b0;}" +
  "#gm_hfr_lph_config_window fieldset.gm_hfr_lph_green{background-color:#c0ffb0;}" +
  "#gm_hfr_lph_config_window legend{font-size:14px;background-color:#ffffff;cursor:default;}" +
  "#gm_hfr_lph_config_window p{margin:0 0 0 4px;}" +
  "#gm_hfr_lph_config_window p:not(:last-child){margin-bottom:4px;}" +
  "#gm_hfr_lph_config_window div.gm_hfr_lph_led_div_p{display:flex;align-items:center;margin:0 0 0 4px;}" +
  "#gm_hfr_lph_config_window div.gm_hfr_lph_led_div_p:not(:last-child){margin-bottom:4px;}" +
  "#gm_hfr_lph_config_window span.gm_hfr_lph_led_span{display:block;width:110px;cursor:default;}" +
  "#gm_hfr_lph_config_window div.gm_hfr_lph_led_div{display:flex;width:161px;align-items:center;" +
  "justify-content:space-around;}" +
  "#gm_hfr_lph_config_window div.gm_hfr_lph_led_div > img{display:block;padding:2px;border-radius:50px;" +
  "border:1px solid transparent;}" +
  "#gm_hfr_lph_config_window div.gm_hfr_lph_led_div > img.gm_hfr_lph_led_selected, " +
  "#gm_hfr_lph_config_window div.gm_hfr_lph_led_div:not(.gm_hfr_lph_crazy_leds_div) > img:hover" +
  "{border-color:#888888;}" +
  "#gm_hfr_lph_config_window div.gm_hfr_lph_crazy_leds_div_p{display:flex;align-items:center;" +
  "justify-content:space-around;}" +
  "#gm_hfr_lph_config_window div.gm_hfr_lph_led_div.gm_hfr_lph_crazy_leds_div{width:115px;}" +
  "#gm_hfr_lph_config_window img.gm_hfr_lph_crazy_switch_img{display:block;cursor:pointer;}" +
  "#gm_hfr_lph_config_window img.gm_hfr_lph_crazy_switch_img.gm_hfr_lph_disabled{cursor:default;}" +
  "#gm_hfr_lph_config_window img.gm_hfr_lph_reset{cursor:pointer;}" +
  "#gm_hfr_lph_config_window span.gm_hfr_lph_split_thick_span{display:inline-block;width:6ex;" +
  "text-align:right;}" +
  "#gm_hfr_lph_config_window input[type=\"checkbox\"]{margin:0 0 1px 1px;vertical-align:text-bottom;}" +
  "#gm_hfr_lph_config_window input[type=color]{padding:0;width:30px;height:15px;border:1px solid #c0c0c0;}" +
  "#gm_hfr_lph_config_window input[type=\"range\"]{padding:0;border:0;margin:-1px 0 0 0;" +
  "vertical-align:text-bottom;font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;width:140px;" +
  "-webkit-appearance:none;background:transparent;}" +
  "#gm_hfr_lph_config_window input[type=\"range\"]:focus{outline:none;}" +
  "#gm_hfr_lph_config_window input[type=\"range\"]:focus::-webkit-slider-runnable-track{" +
  "background:#888888;}" +
  "#gm_hfr_lph_config_window input[type=\"range\"]::-moz-range-thumb{background-color:#ffffff;" +
  "width:3px;height:11px;border:1px solid #666666;border-radius:2px;}" +
  "#gm_hfr_lph_config_window input[type=\"range\"]::-webkit-slider-thumb{-webkit-appearance:none;" +
  "background-color:#ffffff;width:5px;height:13px;border:1px solid #666666;border-radius:2px;margin-top:-6px;}" +
  "#gm_hfr_lph_config_window input[type=\"range\"]::-moz-range-track{background:#888888;height:1px;" +
  "border:0;}" +
  "#gm_hfr_lph_config_window input[type=\"range\"]::-webkit-slider-runnable-track{background:#888888;" +
  "height:1px;border:0;margin-top:-16px;}" +
  "div.gm_hfr_lph_save_close_div{text-align:right;margin:16px 0 0;cursor:default;}" +
  "div.gm_hfr_lph_save_close_div div.gm_hfr_lph_info_reload_div{float:left;}" +
  "div.gm_hfr_lph_save_close_div div.gm_hfr_lph_info_reload_div img{vertical-align:text-bottom;}" +
  "div.gm_hfr_lph_save_close_div > img{margin-left:8px;cursor:pointer;}";
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// fonction de désactivation de l'action par défaut sur un événement
function prevent_default(p_event) {
  p_event.preventDefault();
}

// création de la fenêtre d'aide
var help_window = document.createElement("div");
help_window.setAttribute("id", "gm_hfr_lph_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(p_width, p_text) {
  let l_help_button = document.createElement("img");
  l_help_button.setAttribute("src", img_help);
  l_help_button.setAttribute("class", "gm_hfr_lph_help_button");
  l_help_button.addEventListener("mouseover", function(e) {
    help_window.style.width = p_width + "px";
    help_window.textContent = p_text;
    help_window.style.left = (e.clientX + 32) + "px";
    help_window.style.top = (e.clientY - 16) + "px";
    help_window.style.visibility = "visible";
  }, false);
  l_help_button.addEventListener("mouseout", function(e) {
    help_window.style.visibility = "hidden";
  }, false);
  return l_help_button;
}

// création du voile de fond pour la fenêtre de configuration
var config_background = document.createElement("div");
config_background.setAttribute("id", "gm_hfr_lph_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
config_background.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gm_hfr_lph_config_window");
config_window.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.setAttribute("class", "gm_hfr_lph_main_title");
main_title.textContent = "[HFR] Last Post Highlight";
config_window.appendChild(main_title);

// section leds
var leds_fieldset = document.createElement("fieldset");
var leds_legend = document.createElement("legend");
leds_legend.textContent = "Couleur des leds";
leds_fieldset.appendChild(leds_legend);
config_window.appendChild(leds_fieldset);

// led_read
var led_read_div_p = document.createElement("div");
led_read_div_p.setAttribute("class", "gm_hfr_lph_led_div_p");
var led_read_hidden = document.createElement("input");
led_read_hidden.setAttribute("type", "hidden");
led_read_div_p.appendChild(led_read_hidden);
var led_read_span = document.createElement("span");
led_read_span.setAttribute("class", "gm_hfr_lph_led_span");
led_read_span.textContent = "posts lus :";
led_read_div_p.appendChild(led_read_span);
var led_read_div = document.createElement("div");
led_read_div.setAttribute("id", "gm_hfr_lph_led_read_div");
led_read_div.setAttribute("class", "gm_hfr_lph_led_div");

function update_led_read(p_event) {
  if(p_event) {
    led_read_hidden.value = this.dataset.color;
  }
  let l_color = led_read_hidden.value;
  let l_old = document.querySelector("div#gm_hfr_lph_led_read_div > img.gm_hfr_lph_led_selected");
  let l_new = document.querySelector("div#gm_hfr_lph_led_read_div > img#gm_hfr_lph_led_read_" + l_color);
  if(!l_old || l_old !== l_new) {
    if(l_old) {
      l_old.removeAttribute("class");
    }
    l_new.setAttribute("class", "gm_hfr_lph_led_selected");
    if(p_event) {
      update_crazy_leds();
    }
  }
}
for(let l_color of order) {
  let l_led = document.createElement("img");
  l_led.setAttribute("src", leds[l_color]);
  l_led.setAttribute("id", "gm_hfr_lph_led_read_" + l_color);
  l_led.setAttribute("data-color", l_color);
  l_led.addEventListener("click", update_led_read, false);
  led_read_div.appendChild(l_led);
}
led_read_div_p.appendChild(led_read_div);
leds_fieldset.appendChild(led_read_div_p);

// led_unread
var led_unread_div_p = document.createElement("div");
led_unread_div_p.setAttribute("class", "gm_hfr_lph_led_div_p");
var led_unread_hidden = document.createElement("input");
led_unread_hidden.setAttribute("type", "hidden");
led_unread_div_p.appendChild(led_unread_hidden);
var led_unread_span = document.createElement("span");
led_unread_span.setAttribute("class", "gm_hfr_lph_led_span");
led_unread_span.textContent = "posts non lus :";
led_unread_div_p.appendChild(led_unread_span);
var led_unread_div = document.createElement("div");
led_unread_div.setAttribute("id", "gm_hfr_lph_led_unread_div");
led_unread_div.setAttribute("class", "gm_hfr_lph_led_div");

function update_led_unread(p_event) {
  if(p_event) {
    led_unread_hidden.value = this.dataset.color;
  }
  let l_color = led_unread_hidden.value;
  let l_old = document.querySelector("div#gm_hfr_lph_led_unread_div > img.gm_hfr_lph_led_selected");
  let l_new = document.querySelector("div#gm_hfr_lph_led_unread_div > img#gm_hfr_lph_led_unread_" + l_color);
  if(!l_old || l_old !== l_new) {
    if(l_old) {
      l_old.removeAttribute("class");
    }
    l_new.setAttribute("class", "gm_hfr_lph_led_selected");
    if(p_event) {
      update_crazy_leds();
    }
  }
}
for(let l_color of order) {
  let l_led = document.createElement("img");
  l_led.setAttribute("src", leds[l_color]);
  l_led.setAttribute("id", "gm_hfr_lph_led_unread_" + l_color);
  l_led.setAttribute("data-color", l_color);
  l_led.addEventListener("click", update_led_unread, false);
  led_unread_div.appendChild(l_led);
}
led_unread_div_p.appendChild(led_unread_div);
leds_fieldset.appendChild(led_unread_div_p);

// section crazy_leds
var crazy_leds_fieldset = document.createElement("fieldset");
var crazy_leds_legend = document.createElement("legend");
var crazy_leds_checkbox = document.createElement("input");
crazy_leds_checkbox.setAttribute("id", "gm_hfr_lph_crazy_leds_checkbox");
crazy_leds_checkbox.setAttribute("type", "checkbox");

function crazy_leds_changed(p_event) {
  if(crazy_leds_checkbox.checked) {
    crazy_leds_fieldset.setAttribute("class", "gm_hfr_lph_green");
  } else {
    crazy_leds_fieldset.setAttribute("class", "gm_hfr_lph_red");
  }
  if(p_event) {
    update_crazy_leds();
  }
}
crazy_leds_checkbox.addEventListener("change", crazy_leds_changed, false);
crazy_leds_legend.appendChild(crazy_leds_checkbox);
var crazy_leds_label = document.createElement("label");
crazy_leds_label.textContent = " Activer les leds clignotantes";
crazy_leds_label.setAttribute("for", "gm_hfr_lph_crazy_leds_checkbox");
crazy_leds_legend.appendChild(crazy_leds_label);
crazy_leds_fieldset.appendChild(crazy_leds_legend);
config_window.appendChild(crazy_leds_fieldset);
var crazy_leds_div_p = document.createElement("div");
crazy_leds_div_p.setAttribute("class", "gm_hfr_lph_crazy_leds_div_p");
crazy_leds_fieldset.appendChild(crazy_leds_div_p);
var crazy_leds_read_div = document.createElement("div");
crazy_leds_read_div.setAttribute("class", "gm_hfr_lph_led_div gm_hfr_lph_crazy_leds_div");
crazy_leds_read_div.setAttribute("title", "posts lus");
for(let l_i = 0; l_i < 5; ++l_i) {
  let l_led = document.createElement("img");
  crazy_leds_read_div.appendChild(l_led);
}
crazy_leds_div_p.appendChild(crazy_leds_read_div);
var crazy_switch_hidden = document.createElement("input");
crazy_switch_hidden.setAttribute("type", "hidden");
crazy_leds_div_p.appendChild(crazy_switch_hidden);
var crazy_switch_img = document.createElement("img");
crazy_switch_img.setAttribute("class", "gm_hfr_lph_crazy_switch_img");
crazy_switch_img.addEventListener("click", function() {
  if(crazy_leds_checkbox.checked) {
    crazy_switch_hidden.value = crazy_switch_hidden.value === "true" ? "false" : "true";
    update_crazy_leds();
  }
}, false);
crazy_leds_div_p.appendChild(crazy_switch_img);
var crazy_leds_unread_div = document.createElement("div");
crazy_leds_unread_div.setAttribute("class", "gm_hfr_lph_led_div gm_hfr_lph_crazy_leds_div");
crazy_leds_unread_div.setAttribute("title", "posts non lus");
for(let l_i = 0; l_i < 5; ++l_i) {
  let l_led = document.createElement("img");
  crazy_leds_unread_div.appendChild(l_led);
}
crazy_leds_div_p.appendChild(crazy_leds_unread_div);

function update_crazy_leds() {
  window.clearInterval(read_timer_test);
  window.clearInterval(unread_timer_test);
  if(crazy_leds_checkbox.checked) {
    crazy_switch_img.setAttribute("src", img_switch);
    crazy_switch_img.setAttribute("class", "gm_hfr_lph_crazy_switch_img");
    crazy_switch_img.setAttribute("title", "inverser les clignotements pour\nles posts lus et les posts non lus");
  } else {
    crazy_switch_img.setAttribute("src", img_switch_disabled);
    crazy_switch_img.setAttribute("class", "gm_hfr_lph_crazy_switch_img gm_hfr_lph_disabled");
    crazy_switch_img.removeAttribute("title");
  }
  crazy_leds_read_div.querySelectorAll(":scope > img").forEach(p_led => {
    p_led.setAttribute("src", leds[led_read_hidden.value]);
  });
  crazy_leds_unread_div.querySelectorAll(":scope > img").forEach(p_led => {
    p_led.setAttribute("src", leds[led_unread_hidden.value]);
  });
  if(its_crazy && crazy_leds_checkbox.checked) {
    read_timer_test = window.setInterval(do_crazy_read_test, 82);
    unread_timer_test = window.setInterval(do_crazy_unread_test, 82);
  }
}

function do_crazy_read_test() {
  if(!crazy_leds_read_div.querySelector(":scope > img:not(.gm_hfr_lph_led_changed_test)")) {
    crazy_leds_read_div.querySelectorAll(":scope > img.gm_hfr_lph_led_changed_test").forEach(p_led => {
      p_led.classList.remove("gm_hfr_lph_led_changed_test");
    });
  }
  let l_crazy_array = crazy_switch_hidden.value === "true" ? crazy_unread : crazy_read;
  let l_leds = crazy_leds_read_div.querySelectorAll(":scope > img:not(.gm_hfr_lph_led_changed_test)");
  let l_led = l_leds[rand_int(l_leds.length)];
  l_led.classList.add("gm_hfr_lph_led_changed_test");
  l_led.setAttribute("src", leds[l_crazy_array[rand_int(l_crazy_array.length)]]);
}

function do_crazy_unread_test() {
  if(!crazy_leds_unread_div.querySelector(":scope > img:not(.gm_hfr_lph_led_changed_test)")) {
    crazy_leds_unread_div.querySelectorAll(":scope > img.gm_hfr_lph_led_changed_test").forEach(p_led => {
      p_led.classList.remove("gm_hfr_lph_led_changed_test");
    });
  }
  let l_crazy_array = crazy_switch_hidden.value === "true" ? crazy_read : crazy_unread;
  let l_leds = crazy_leds_unread_div.querySelectorAll(":scope > img:not(.gm_hfr_lph_led_changed_test)");
  let l_led = l_leds[rand_int(l_leds.length)];
  l_led.classList.add("gm_hfr_lph_led_changed_test");
  l_led.setAttribute("src", leds[l_crazy_array[rand_int(l_crazy_array.length)]]);
}

// section split_line
var split_line_fieldset = document.createElement("fieldset");
var split_line_legend = document.createElement("legend");
var split_line_checkbox = document.createElement("input");
split_line_checkbox.setAttribute("id", "gm_hfr_lph_split_line_checkbox");
split_line_checkbox.setAttribute("type", "checkbox");

function split_line_changed() {
  if(split_line_checkbox.checked) {
    split_line_fieldset.setAttribute("class", "gm_hfr_lph_green");
  } else {
    split_line_fieldset.setAttribute("class", "gm_hfr_lph_red");
  }
}
split_line_checkbox.addEventListener("change", split_line_changed, false);
split_line_legend.appendChild(split_line_checkbox);
var split_line_label = document.createElement("label");
split_line_label.textContent = " Activer la ligne de séparation";
split_line_label.setAttribute("for", "gm_hfr_lph_split_line_checkbox");
split_line_legend.appendChild(split_line_label);
split_line_fieldset.appendChild(split_line_legend);
config_window.appendChild(split_line_fieldset);

// split_color et split_trans
var split_color_p = document.createElement("p");
var split_color_label = document.createElement("label");
split_color_label.textContent = "couleur :";
split_color_label.setAttribute("for", "gm_hfr_lph_split_color_color");
split_color_p.appendChild(split_color_label);
split_color_p.appendChild(document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"));
var split_color_color = document.createElement("input");
split_color_color.setAttribute("id", "gm_hfr_lph_split_color_color");
split_color_color.setAttribute("type", "color");

function split_color_changed() {
  split_color_color.setAttribute("title", split_color_color.value.toLowerCase());
}
split_color_color.addEventListener("change", split_color_changed, false);
split_color_p.appendChild(split_color_color);
split_color_p.appendChild(document.createTextNode(" "));
var split_color_reset = document.createElement("img");
split_color_reset.setAttribute("src", img_reset);
split_color_reset.setAttribute("class", "gm_hfr_lph_reset");
split_color_reset.setAttribute("title", "remettre la couleur par défaut");

function split_color_do_reset() {
  split_color_color.value = split_color_default;
  split_color_changed();
}
split_color_reset.addEventListener("click", split_color_do_reset, false);
split_color_p.appendChild(split_color_reset);
split_color_p.appendChild(document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"));
var split_trans_checkbox = document.createElement("input");
split_trans_checkbox.setAttribute("id", "gm_hfr_lph_split_trans_checkbox");
split_trans_checkbox.setAttribute("type", "checkbox");
split_color_p.appendChild(split_trans_checkbox);
var split_trans_label = document.createElement("label");
split_trans_label.appendChild(document.createTextNode(" transparent"));
split_trans_label.setAttribute("for", "gm_hfr_lph_split_trans_checkbox");
split_color_p.appendChild(split_trans_label);
split_line_fieldset.appendChild(split_color_p);

// split_thick
var split_thick_p = document.createElement("p");
var split_thick_label = document.createElement("label");
split_thick_label.textContent = "épaisseur : ";
split_thick_label.setAttribute("for", "gm_hfr_lph_split_thick_range");
split_thick_p.appendChild(split_thick_label);
var split_thick_range = document.createElement("input");
split_thick_range.setAttribute("type", "range");
split_thick_range.setAttribute("id", "gm_hfr_lph_split_thick_range");
split_thick_range.setAttribute("min", "1");
split_thick_range.setAttribute("max", "50");
split_thick_range.setAttribute("step", "1");

function split_thick_changed() {
  split_thick_span.textContent = split_thick_range.value + " px";
}
split_thick_range.addEventListener("input", split_thick_changed, false);
split_thick_p.appendChild(split_thick_range);
var split_thick_span = document.createElement("span");
split_thick_span.setAttribute("class", "gm_hfr_lph_split_thick_span");
split_thick_p.appendChild(split_thick_span);
split_thick_p.appendChild(document.createTextNode(" "));
var split_thick_reset = document.createElement("img");
split_thick_reset.setAttribute("src", img_reset);
split_thick_reset.setAttribute("class", "gm_hfr_lph_reset");
split_thick_reset.setAttribute("title", "remettre l'épaisseur par défaut");

function split_thick_do_reset() {
  split_thick_range.value = split_thick_default;
  split_thick_changed();
}
split_thick_reset.addEventListener("click", split_thick_do_reset, false);
split_thick_p.appendChild(split_thick_reset);
split_line_fieldset.appendChild(split_thick_p);

// section misc_options
var misc_options_fieldset = document.createElement("fieldset");
var misc_options_legend = document.createElement("legend");
misc_options_legend.textContent = "Options diverses";
misc_options_fieldset.appendChild(misc_options_legend);
config_window.appendChild(misc_options_fieldset);

// enable_navigation
var enable_navigation_p = document.createElement("p");
var enable_navigation_checkbox = document.createElement("input");
enable_navigation_checkbox.setAttribute("id", "gm_hfr_lph_enable_navigation_checkbox");
enable_navigation_checkbox.setAttribute("type", "checkbox");
enable_navigation_p.appendChild(enable_navigation_checkbox);
var enable_navigation_label = document.createElement("label");
enable_navigation_label.textContent = " activer la navigation sur les leds ";
enable_navigation_label.setAttribute("for", "gm_hfr_lph_enable_navigation_checkbox");
enable_navigation_p.appendChild(enable_navigation_label);
enable_navigation_p.appendChild(create_help_button(320,
  "La navigation sur les leds permet, en cliquant sur une led, de rejoindre directement le dernier post lu ou, " +
  "s'il s'agit déjà de la led de ce dernier, de rejoindre le post juste après. Si cette option est activée " +
  "la fenêtre de configuration reste accessible via un clic droit sur les leds."));
misc_options_fieldset.appendChild(enable_navigation_p);

// info "sans rechargement" et boutons de validation et de fermeture
var save_close_div = document.createElement("div");
save_close_div.setAttribute("class", "gm_hfr_lph_save_close_div");
var info_reload_div = document.createElement("div");
info_reload_div.setAttribute("class", "gm_hfr_lph_info_reload_div");
var info_reload_img = document.createElement("img");
info_reload_img.setAttribute("src", img_info);
info_reload_div.appendChild(info_reload_img);
info_reload_div.appendChild(document.createTextNode(" sans rechargement "));
info_reload_div.appendChild(create_help_button(255,
  "Les paramètres de cette fenêtre de configuration sont appliqués immédiatement à la validation, " +
  "il n'est pas nécessaire de recharger la page."));
save_close_div.appendChild(info_reload_div);
var save_button = document.createElement("img");
save_button.setAttribute("src", img_save);
save_button.setAttribute("title", "Valider");
save_button.addEventListener("click", save_config_window, false);
save_close_div.appendChild(save_button);
var close_button = document.createElement("img");
close_button.setAttribute("src", img_close);
close_button.setAttribute("title", "Annuler");
close_button.addEventListener("click", hide_config_window, false);
save_close_div.appendChild(close_button);
config_window.appendChild(save_close_div);

// fonction de validation de la fenêtre de configuration
function save_config_window() {
  // récupération des paramètres
  led_read = led_read_hidden.value;
  led_unread = led_unread_hidden.value;
  crazy_leds = crazy_leds_checkbox.checked;
  crazy_switch = crazy_switch_hidden.value;
  split_line = split_line_checkbox.checked;
  split_color = split_color_color.value;
  split_trans = split_trans_checkbox.checked;
  split_thick = parseInt(split_thick_range.value, 10);
  enable_navigation = enable_navigation_checkbox.checked;
  // fermeture de la fenêtre
  hide_config_window();
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("led_read", led_read),
    GM.setValue("led_unread", led_unread),
    GM.setValue("crazy_leds", crazy_leds),
    GM.setValue("crazy_switch", crazy_switch),
    GM.setValue("split_line", split_line),
    GM.setValue("split_color", split_color),
    GM.setValue("split_trans", split_trans),
    GM.setValue("split_thick", split_thick),
    GM.setValue("enable_navigation", enable_navigation),
  ]);
}

// fonction de fermeture de la fenêtre de configuration
function hide_config_window() {
  window.clearInterval(read_timer_test);
  window.clearInterval(unread_timer_test);
  update_leds_and_line();
  config_window.style.opacity = "0";
  config_background.style.opacity = "0";
}

// fonction de fermeture de la fenêtre de configuration par la touche echap
function esc_config_window(p_event) {
  if(p_event.key === "Escape") {
    hide_config_window();
  }
}

// fonction de gestion de la fin de la transition d'affichage / disparition de la fenêtre de configuration
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
  led_read_hidden.value = led_read;
  update_led_read();
  led_unread_hidden.value = led_unread;
  update_led_unread();
  crazy_leds_checkbox.checked = crazy_leds;
  crazy_leds_changed();
  crazy_switch_hidden.value = crazy_switch;
  update_crazy_leds();
  if(!its_crazy) {
    crazy_leds_fieldset.style.display = "none";
  }
  split_line_checkbox.checked = split_line;
  split_line_changed();
  split_color_color.value = split_color;
  split_color_changed();
  split_trans_checkbox.checked = split_trans;
  split_thick_range.value = split_thick;
  split_thick_changed();
  enable_navigation_checkbox.checked = enable_navigation;
  // affichage de la fenêtre
  window.clearInterval(read_timer);
  window.clearInterval(unread_timer);
  config_window.style.visibility = "visible";
  config_background.style.visibility = "visible";
  config_window.style.left =
    parseInt((document.documentElement.clientWidth - config_window.offsetWidth) / 2, 10) + "px";
  config_window.style.top =
    parseInt((document.documentElement.clientHeight - config_window.offsetHeight) / 2, 10) + "px";
  config_background.style.width = document.documentElement.scrollWidth + "px";
  config_background.style.height = document.documentElement.scrollHeight + "px";
  config_window.style.opacity = "1";
  config_background.style.opacity = "0.8";
}

// ajout d'une entrée de configuration dans le menu greasemonkey si c'est possible (pas gm4 yet)
if(typeof GM_registerMenuCommand !== "undefined") {
  GM_registerMenuCommand("[HFR] Last Post Highlight -> Configuration", show_config_window);
}

/* ----------------------------------------------------------------------------------------------------- */
/* récupération des paramètres, réparation de l'ancre et affichage des leds et de la ligne de séparation */
/* ----------------------------------------------------------------------------------------------------- */

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

// fonction de gestion du click sur les leds (navigation ou affichage de la fenêtre de configuration)
function navigate_or_show_config_window(p_event) {
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
  } else {
    show_config_window();
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
    let l_led_read_nb = 0;
    let l_led_unread_nb = 0;
    for(let l_post of l_posts) {
      let l_post_number = parseInt(l_post.getAttribute("name").substring(1), 10);
      let l_led_img = l_post.parentElement.parentElement.cells[1]
        .querySelector(":scope > div.toolbar img.gm_hfr_lph_led");
      if(!l_led_img) {
        l_led_img = document.createElement("img");
        l_led_img.setAttribute("class", "gm_hfr_lph_led");
        l_led_img.addEventListener("click", prevent_default, false);
        l_led_img.addEventListener("contextmenu", prevent_default, false);
        l_led_img.addEventListener("mousedown", prevent_default, false);
        l_led_img.addEventListener("mouseup", navigate_or_show_config_window, false);
        l_post.parentElement.parentElement.cells[1].firstElementChild.firstElementChild.insertBefore(l_led_img,
          l_post.parentElement.parentElement.cells[1].firstElementChild.firstElementChild.firstChild);
      }
      l_led_img.dataset.lastpost = "false";
      if(enable_navigation) {
        l_led_img.setAttribute("title", "Rejoindre le dernier post lu\n(clic droit pour configurer)");
      } else {
        l_led_img.setAttribute("title", "[HFR] Last Post Highlight -> Configuration");
      }
      if(l_post_number <= l_last_post) {
        l_led_img.setAttribute("src", leds[led_read]);
        l_led_img.setAttribute("class", "gm_hfr_lph_led gm_hfr_lph_led_read");
        ++l_led_read_nb;
        if(!l_split) {
          last_table = l_post.parentElement.parentElement.parentElement.parentElement;
        }
        if(l_post_number === l_last_post) {
          l_led_img.dataset.lastpost = "true";
          if(enable_navigation) {
            l_led_img.setAttribute("title", "Rejoindre le post juste après\n(clic droit pour configurer)");
          }
        }
      } else {
        if(!l_split) {
          next_table = l_post.parentElement.parentElement.parentElement.parentElement;
        }
        l_split = true;
        l_led_img.setAttribute("src", leds[led_unread]);
        l_led_img.setAttribute("class", "gm_hfr_lph_led gm_hfr_lph_led_unread");
        ++l_led_unread_nb;
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
    window.clearInterval(read_timer);
    if(its_crazy && crazy_leds && l_led_read_nb > 0) {
      read_timer = window.setInterval(do_crazy_read, Math.max(10, Math.floor(410 / l_led_read_nb)));
    }
    window.clearInterval(unread_timer);
    if(its_crazy && crazy_leds && l_led_unread_nb > 0) {
      unread_timer = window.setInterval(do_crazy_unread, Math.max(10, Math.floor(410 / l_led_unread_nb)));
    }
  }
}

function rand_int(p_int) {
  return Math.floor(Math.random() * p_int);
}

function do_crazy_read() {
  if(!document.querySelector("img.gm_hfr_lph_led_read:not(.gm_hfr_lph_led_changed)")) {
    document.querySelectorAll("img.gm_hfr_lph_led_read.gm_hfr_lph_led_changed").forEach(p_led => {
      p_led.classList.remove("gm_hfr_lph_led_changed");
    });
  }
  let l_crazy_array = crazy_switch === "true" ? crazy_unread : crazy_read;
  let l_leds = document.querySelectorAll("img.gm_hfr_lph_led_read:not(.gm_hfr_lph_led_changed)");
  let l_led = l_leds[rand_int(l_leds.length)];
  l_led.classList.add("gm_hfr_lph_led_changed");
  l_led.setAttribute("src", leds[l_crazy_array[rand_int(l_crazy_array.length)]]);
}

function do_crazy_unread() {
  if(!document.querySelector("img.gm_hfr_lph_led_unread:not(.gm_hfr_lph_led_changed)")) {
    document.querySelectorAll("img.gm_hfr_lph_led_unread.gm_hfr_lph_led_changed").forEach(p_led => {
      p_led.classList.remove("gm_hfr_lph_led_changed");
    });
  }
  let l_crazy_array = crazy_switch === "true" ? crazy_read : crazy_unread;
  let l_leds = document.querySelectorAll("img.gm_hfr_lph_led_unread:not(.gm_hfr_lph_led_changed)");
  let l_led = l_leds[rand_int(l_leds.length)];
  l_led.classList.add("gm_hfr_lph_led_changed");
  l_led.setAttribute("src", leds[l_crazy_array[rand_int(l_crazy_array.length)]]);
}

Promise.all([
  GM.getValue("led_read", led_read_default),
  GM.getValue("led_unread", led_unread_default),
  GM.getValue("crazy_leds", crazy_leds_default),
  GM.getValue("crazy_switch", crazy_switch_default),
  GM.getValue("split_line", split_line_default),
  GM.getValue("split_color", split_color_default),
  GM.getValue("split_trans", split_trans_default),
  GM.getValue("split_thick", split_thick_default),
  GM.getValue("enable_navigation", enable_navigation_default),
]).then(function([
  led_read_value,
  led_unread_value,
  crazy_leds_value,
  crazy_switch_value,
  split_line_value,
  split_color_value,
  split_trans_value,
  split_thick_value,
  enable_navigation_value,
]) {
  // initialisation des variables globales
  led_read = led_read_value;
  led_unread = led_unread_value;
  crazy_leds = crazy_leds_value;
  crazy_switch = crazy_switch_value;
  split_line = split_line_value;
  split_color = split_color_value;
  split_trans = split_trans_value;
  split_thick = split_thick_value;
  enable_navigation = enable_navigation_value;
  // vérification de la date
  let l_today = new Date();
  if((l_today.getMonth() === 11 &&
      ((l_today.getDate() === 24 && l_today.getHours() >= 22) ||
        (l_today.getDate() === 25 && l_today.getHours() <= 2))) ||
    (l_today.getMonth() === 0 && l_today.getDate() === 1 && l_today.getHours() <= 2)) {
    its_crazy = true;
  } else {
    crazy_leds = crazy_leds_default;
    GM.setValue("crazy_leds", crazy_leds);
  }
  // suppression des espaces en trop sur la date des posts
  let l_dates = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody > " +
    "tr.message > td.messCase2 > div.toolbar > div.left");
  for(let l_date of l_dates) {
    if(l_date.firstChild.nodeType === 3) {
      l_date.firstChild.nodeValue = l_date.firstChild.nodeValue.trim();
    }
  }
  // supression des pubs dans les topics en mode non connecté
  let l_pubs = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody >" +
    "tr.message > td.messCase1 > div.right:first-child");
  for(let l_pub of l_pubs) {
    l_pub.parentElement.parentElement.parentElement.parentElement.parentNode
      .removeChild(l_pub.parentElement.parentElement.parentElement.parentElement);
  }
  // réparation de l'ancre (si nécéssaire)
  if(window.location.hash !== "" && window.location.hash.substring(1, 2) === "t") {
    let l_last_post = parseInt(window.location.hash.substring(2), 10);
    if(document.querySelector("div#mesdiscussions.mesdiscussions table.messagetable > tbody > " +
        "tr.message > td.messCase1 > a[name=\"t" + l_last_post + "\"]") === null) {
      let l_repaired_last_post = 0;
      let l_anchors = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > " +
        "tbody > tr.message > td.messCase1 > a[name^=\"t\"]");
      for(let l_anchor of l_anchors) {
        let l_post_number = parseInt(l_anchor.getAttribute("name").substring(1), 10);
        if(l_post_number < l_last_post && l_post_number > l_repaired_last_post) {
          l_repaired_last_post = l_post_number;
        }
      }
      window.location.hash = "t" + l_repaired_last_post;
    }
  }
  // création des leds et de la ligne de séparation
  let l_root = document.querySelector("div#mesdiscussions.mesdiscussions");
  if(l_root) {
    split_table = document.createElement("table");
    split_table.setAttribute("id", "gm_hfr_lph_split_line");
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
});

/* --------------------------------- */
/* ----- SECTIONS OPTIONNELLES ----- */
/* --------------------------------- */

// fonction de conversion des liens en images dans les quotes
function a2img(p_href) {
  let l_links = document.querySelectorAll(
    "div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message > td.messCase2 > " +
    "div[id^=\"para\"] table.citation a.cLink[href*=\"" + p_href + "\"], " +
    "div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message > td.messCase2 > " +
    "div[id^=\"para\"] table.oldcitation a.cLink[href*=\"" + p_href + "\"]");
  for(let l_link of l_links) {
    let l_href = l_link.getAttribute("href");
    if(l_link.firstChild && l_href.length > p_href.length) {
      if(l_href.startsWith("https://images.weserv.nl/")) {
        l_href = l_href.replace(p_href, p_href.replace(/^http:\/\//, ""));
      }
      l_href = l_href.replace("'", "%27", "g").replace("\"", "%22", "g");
      let l_img = document.createElement("img");
      l_img.setAttribute("alt", l_href);
      l_img.setAttribute("title", l_href);
      l_img.setAttribute("src", l_href);
      l_link.parentNode.replaceChild(l_img, l_link);
    }
  }
}

// OPTIONEL : pour effacer le tableau des sujets relatifs
if(false) { // remplacer false par true pour activer
  if(document.getElementById("sujetrelatif")) {
    // suppression du <br> avant les sujets relatifs
    if(document.getElementById("sujetrelatif").previousElementSibling &&
      (document.getElementById("sujetrelatif").previousElementSibling.nodeName.toLowerCase() === "br")) {
      document.getElementById("sujetrelatif").parentNode
        .removeChild(document.getElementById("sujetrelatif").previousElementSibling);
    }
    // suppression des sujets relatifs
    document.getElementById("sujetrelatif").parentNode.removeChild(document.getElementById("sujetrelatif"));
  }
}

// OPTIONEL : pour effacer la section mesdiscussions.net (en bas de page)
if(false) { // remplacer false par true pour activer
  if(document.querySelector("div.copyright")) {
    // suppression du <br> avant la section mesdiscussions.net
    if(document.querySelector("div.copyright").previousElementSibling &&
      (document.querySelector("div.copyright").previousElementSibling.nodeName.toLowerCase() === "br")) {
      document.querySelector("div.copyright").parentNode
        .removeChild(document.querySelector("div.copyright").previousElementSibling);
    }
    // suppression de la section mesdiscussions.net
    document.querySelector("div.copyright").parentNode.removeChild(document.querySelector("div.copyright"));
  }
}

// OPTIONEL : pour effacer la section copyright hardware.fr (en bas de page)
// et les pubs de prix en mode non connecté
if(false) { // remplacer false par true pour activer
  let l_centers = document.querySelectorAll("div.container ~ center");
  for(let l_center of l_centers) {
    l_center.parentNode.removeChild(l_center);
  }
}

// OPTIONEL : pour afficher les smiley générés de toyonos dans les quotes (comme des smileys donc)
if(false) { // remplacer false par true pour activer
  a2img("http://hfr.toyonos.info/smileys/generate/");
  a2img("http://hfr.toyonos.info/generateurs/");
}

// OPTIONEL : pour afficher les emojis de [HFR] Copié/Collé dans les quotes (comme des smileys donc)
if(false) { // remplacer false par true pour activer
  a2img("https://gitlab.com/BZHDeveloper/HFR/raw/master/emojis-micro/");
}
