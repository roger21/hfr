// ==UserScript==
// @name          [HFR] Image Preview mod_r21
// @version       3.0.1
// @namespace     roger21.free.fr
// @description   Permet d'afficher l'aperçu d'une image en passant la souris sur son lien.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @modifications Prise en charge de tous les liens, ajout d'une icône de signalement des liens reconnus et ajout d'une fenêtre de configuration.
// @modtype       réécriture et évolutions
// @author        roger21
// @authororig    shinuza
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_image_previe_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_image_previe_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_image_previe_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @connect       *
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.xmlHttpRequest
// @grant         GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2011-2012, 2014-2020 roger21@free.fr

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
// 3.0.1 (17/09/2020) :
// - meilleur gestion de la conversion des liens réhostés sur images.weserv.nl
// 3.0.0 (03/06/2020) :
// - ajout d'une fenêtre de configuration pour modifier ou désactiver l'image de signalement ->
// et pour modifier les dimensions de la preview (clic sur l'image de signalement ou menu de l'extension)
// 2.7.7 (11/05/2020) :
// - ajout du Referer (https://forum.hardware.fr/) dans la requête HEAD pour reho.st
// 2.7.6 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.7.5 (24/12/2019) :
// - gestion des svg sans taille définie
// 2.7.4 (05/11/2019) :
// - gestion des svg
// 2.7.3 (02/11/2019) :
// - gestion des webp
// 2.7.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 2.7.1 (20/09/2019) :
// - ajout du support pour [HFR] Taille des images mod_r21
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.7.0 (03/11/2018) :
// - nouveau nom : [HFR] image preview mod_r21 -> [HFR] Image Preview mod_r21
// - ajout de l'avis de licence AGPL v3+ *si shinuza est d'accord*
// - gestion de la compatibilité gm4
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (shinuza)
// - réécriture des metadata @description, @modifications et @modtype
// - suppression de la gestion du changement d'icône pour simplifier la compatibilité gm4 ->
// il faut la modifier directement dans le code maintenant
// - meilleur gestion de la destruction de la popup et de l'affichage de la dernière image demandée
// - correction de la gestion de l'affichage du message de chargement (Loading...)
// 2.6.2 (09/06/2018) :
// - suppression de lemde.fr des urls shortener (lemonde.fr)
// - remise en place des logs de débug en commentés
// 2.6.1 (13/05/2018) :
// - ajout de la metadata @connect pour tm
// - petite correction sur la regexp de l'url du forum
// - maj de la metadata @homepageURL
// 2.6.0 (28/04/2018) :
// - amélioration du code et check du code dans tm
// - suppression des @grant inutiles
// 2.5.4 (29/03/2018) :
// - ajout d'un filtre pour éliminer les urls (trop) mal formées
// 2.5.3 (16/02/2018) :
// - ajout d'une compatbilité avec vm pour le mode anonyme de gm_xhr (via http cookie) par PetitJean
// 2.5.2 (10/12/2017) :
// - correcton du passage au https
// 2.5.1 (28/11/2017) :
// - passage au https
// 2.5.0 (15/01/2017) :
// - recodages divers : absolute -> fxed, limitation de la hauteur, utilisation des maxWidth et ->
// maxHeight (au lieu du width calculé), passage de 300px de large à 450px
// 2.4.2 (19/04/2016) :
// - ajout du mode anonyme de GM_xmlhttpRequest (GM 3.8) ->
// (sans autre modification, les autres protections ne sont pas gênantes)
// 2.4.1 (03/01/2016) :
// - ajout d'un trim sur l'url de l'image
// 2.4.0 (02/01/2016) :
// - ajout de la possibilité de changer l'image (dragon ball 4) à côté des liens image previewable
// 2.3.0 (29/11/2015) :
// - ajout d'une image (dragon ball 4) à coté des liens image previewable
// - ne traite pas les liens vides
// - correction de la selection des liens hors signature (toute foireuse !)
// 2.2.1 (24/11/2015) :
// - correction de la regexp du content-type pour matcher image/jpg (qui n'existe pas !)
// - légère modification de la regexp du content-type (plus robuste ?)
// 2.2.0 (22/11/2015) :
// - ne traite pas les liens contenant déjà une image
// 2.1.0 (22/11/2015) :
// - ne traite pas les liens en signature (ni le nombre de quotes)
// - ne traite pas les liens vers des url-shortener
// 2.0.0 (21/11/2015) :
// - remplacement de la recherche par xpath par une recherche par querySelectorAll (plus simple)
// - gestion de tous les liens images dans les posts, pas seulement ceux dans les quotes ->
// ni seulement ceux se terminant par \.(?:gif|jpe?g|png)
// - génocide de lignes vides
// - remplacement des ' par des " (pasque !)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - nouveau numéro de version : 1.0.5 -> 2.0.0
// - nouveau nom : [HFR] Image quote preview -> [HFR] image preview mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.0.5 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.4 (27/03/2014) :
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.0.2 (14/09/2012) :
// - ajout des metadata @grant
// 1.0.1 (28/11/2011) :
// - renomage du script (ajout du [HFR] au début) pour ne pas faire tache dans la liste des scripts greasemonkey
// - remplacement du namespace anonyme par roger21.free.fr
// - modification de la couleur de fond et du padding
// - suppression du test sur l'extenssion (trop limitant)
// - prise en compte des citation "quote" (citation simple)
// - ajout d'une version avec un .1 en plus

/* ------------- */
/* option en dur */
/* ------------- */

// forcer l'affichage de l'image de signalement (pour réactiver l'accès à la fenêtre de configuration sous gm)
const force_display = false;

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
if(typeof GM_xmlhttpRequest !== "undefined" && typeof GM.xmlHttpRequest === "undefined") {
  GM.xmlHttpRequest = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_xmlhttpRequest.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}

/* ---------- */
/* les images */
/* ---------- */

var img_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACsklEQVQ4y2WTPYxUZRSGn%2Fe7352fu8yiLBoNsKyTLDKTQIeyFhoLs1pCYk9FjA2JBXagxs5CJZAQGmNjIQqVxppmCxElRIaAO%2BAKcXd1Z2Eus3Pv3J9jMVnD6mnOOcl537w5ySP%2BU%2FE7hPXXXJvJA3NKV1okyxjqAAvDv%2Bxm4wTZk%2Fd6ctk4x2ytPf8DBz6Y1vAPz2ARHlyE9WuYKaewpaSnN6N37c6mxm0Ooy84Ut%2F7wm0dOttUuuxJ7sKwCz4ADwrxCmnWd9rt0Zcc3WIQn9Gsn%2BASkzPQv2E8vg7xDRj8AoOfwQPOwAeGD%2FB1fRuf0SyAeu8Rbn919y13%2BELTNrrG4idSFGHDVZSvYQIKUPQcRIewUqbeTyofPbj76A4v%2BkaLtvafmGZjCfWviux30m%2BgMg%2BEoBEkX3u0p0nl7d0ICStR2t%2FT2Bu3nXnmSO57%2Btfgz4uUa5B8CsUVxtEj0LpDLkQ1QILKFNR2eENzXl4t%2FfY5Fgp5Q0%2FBts%2FATQMBmEH1ZAa1dWyUIaqYC8aGTi1XFGAIyca9AsFB0NRYLIDMYHgPRssYoPwxlj6kKEp8kVtnmELVgXOAjZ9W3gc9D1Sh%2BBWy7%2FtUjl1Bz%2ByiGPRI478hp%2BOd00JZWp6m%2BKA0wlAM3jcUw7avgAwsg%2FQqBG%2FFlOpQZEBJ7pwW1P9IYThjtwpHUwHmasgWwVag%2BgZYDpaARVD2hXa%2BbqguW%2Fqum93Tfjd5yrJsRfPOwApUJphmwB2GbAB5CoUCbPQ0NFrmZ45JSY9shfnJ05b9y8LGBY5Q51IpkAMFY1I00cRNvYzb8QrgKK5%2FSLG%2BenTiOJe3sBAd53K6qn1BqS4FuWVguUONg7jtLwGVvOyc6w6XVvdtiv9HI8Dax4TRLrXL0ubkaKEAgkZHo4cL8Y%2FcfPb8Vpz%2FAQdYLHdXVhJgAAAAAElFTkSuQmCC";
var img_reset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";
var img_info = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";
var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";

/* ------------------------- */
/* les paramètres par défaut */
/* ------------------------- */

var hfr_imgprev_display_icon_default = true;
var hfr_imgprev_img_icon_default = img_icon;
var hfr_imgprev_maxwidth_auto_default = true;
var hfr_imgprev_maxwidth_default = 450;
var hfr_imgprev_maxheight_auto_default = true;
var hfr_imgprev_maxheight_default = 600;

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var hfr_imgprev_display_icon;
var hfr_imgprev_img_icon;
var hfr_imgprev_maxwidth_auto;
var hfr_imgprev_maxwidth;
var hfr_imgprev_maxheight_auto;
var hfr_imgprev_maxheight;
var preview;
var last_call;
var loading_timer;
var loading_progress;
var window_width;
var window_height;

/* -------------- */
/* les constantes */
/* -------------- */

const script_name = "[HFR] Image Preview";
const loading_text = "Loading";

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // style pour l'image de signalement
  "div#mesdiscussions.mesdiscussions table.messagetable td.messCase2 div[id^='para'] a.cLink > " +
  "img.gm_hfr_imgprev_preview_icon{vertical-align:text-bottom;padding:0;border:0;margin:0 5px !important}" +
  // style pour la preview
  "div#gm_hfr_imgprev_preview_id{position:fixed;top:10px;right:10px;background-color:#dedfdf;width:185px;" +
  "padding:7.5px;border:1px solid #000000;font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:16px;" +
  "font-weight:bold;color:#000000;}" +
  "div#gm_hfr_imgprev_preview_id > p{margin:20px 0 20px 50px;}" +
  "div#gm_hfr_imgprev_preview_id > img{display:block;}" +
  // styles pour la fenêtre d'aide
  "#gm_hfr_imgprev_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;z-index:1003;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;text-align:justify;}" +
  "#gm_hfr_imgprev_config_window img.gm_hfr_imgprev_help_button{cursor:help;vertical-align:text-bottom;}" +
  // styles pour la fenêtre de configuration
  "#gm_hfr_imgprev_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_hfr_imgprev_config_window{position:fixed;min-width:475px;height:auto;background:#ffffff;z-index:1002;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;color:#000000;}" +
  "#gm_hfr_imgprev_config_window div.gm_hfr_imgprev_main_title{font-size:16px;text-align:center;" +
  "font-weight:bold;margin:0 0 10px;cursor:default;cursor:default;}" +
  "#gm_hfr_imgprev_config_window fieldset{margin:0 0 8px;border:1px solid #888888;padding:6px 10px 10px;" +
  "background:linear-gradient(to bottom, #ffffff 20px, transparent);transition:background-color 0.3s ease 0s;}" +
  "#gm_hfr_imgprev_config_window fieldset.gm_hfr_imgprev_red{background-color:#ffc0b0;}" +
  "#gm_hfr_imgprev_config_window fieldset.gm_hfr_imgprev_green{background-color:#c0ffb0;}" +
  "#gm_hfr_imgprev_config_window legend{font-size:14px;background-color:#ffffff;cursor:default;}" +
  "#gm_hfr_imgprev_config_window p{margin:0;}" +
  "#gm_hfr_imgprev_config_window p:not(:last-child){margin-bottom:4px;}" +
  "#gm_hfr_imgprev_config_window p.gm_hfr_imgprev_left{padding-right:4px;text-align:right;}" +
  "#gm_hfr_imgprev_config_window p.gm_hfr_imgprev_right{padding-left:4px;text-align:left;}" +
  "#gm_hfr_imgprev_config_window p.gm_hfr_imgprev_p_flex{display:flex;justify-content:center;" +
  "align-items:center;}" +
  "#gm_hfr_imgprev_config_window p.gm_hfr_imgprev_p_flex > *{display:block;}" +
  "#gm_hfr_imgprev_config_window div.gm_hfr_imgprev_table{display:table;width:100%;}" +
  "#gm_hfr_imgprev_config_window div.gm_hfr_imgprev_cell{display:table-cell;width:50%;}" +
  "#gm_hfr_imgprev_config_window img.gm_hfr_imgprev_test_img{margin:0 4px 0 0;}" +
  "#gm_hfr_imgprev_config_window img.gm_hfr_imgprev_reset_img{cursor:pointer;margin:0 0 0 4px;}" +
  "#gm_hfr_imgprev_config_window input[type=\"checkbox\"]{margin:0 0 1px 1px;vertical-align:text-bottom;}" +
  "#gm_hfr_imgprev_config_window input[type=\"radio\"]{margin:0 0 2px;vertical-align:text-bottom;}" +
  "#gm_hfr_imgprev_config_window input[type=\"text\"]{padding:0 1px;border:1px solid #c0c0c0;height:16px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;text-align:right;}" +
  "#gm_hfr_imgprev_config_window div.gm_hfr_imgprev_cell input[type=\"text\"]{height:13px;}" +
  "#gm_hfr_imgprev_config_window div.gm_hfr_imgprev_save_close_div{text-align:right;margin:16px 0 0;" +
  "cursor:default;}" +
  "#gm_hfr_imgprev_config_window div.gm_hfr_imgprev_save_close_div " +
  "div.gm_hfr_imgprev_info_reload_div{float:left;}" +
  "#gm_hfr_imgprev_config_window div.gm_hfr_imgprev_save_close_div img{vertical-align:text-bottom;}" +
  "#gm_hfr_imgprev_config_window div.gm_hfr_imgprev_save_close_div > img{margin-left:8px;cursor:pointer;}";
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// création de la fenêtre d'aide
var help_window = document.createElement("div");
help_window.setAttribute("id", "gm_hfr_imgprev_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(p_width, p_text) {
  let l_help_button = document.createElement("img");
  l_help_button.setAttribute("src", img_help);
  l_help_button.setAttribute("class", "gm_hfr_imgprev_help_button");
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
config_background.setAttribute("id", "gm_hfr_imgprev_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
config_background.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gm_hfr_imgprev_config_window");
config_window.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.setAttribute("class", "gm_hfr_imgprev_main_title");
main_title.textContent = "Conf du script " + script_name;
config_window.appendChild(main_title);

// section display_icon
var display_icon_fieldset = document.createElement("fieldset");
var display_icon_legend = document.createElement("legend");
var display_icon_checkbox = document.createElement("input");
display_icon_checkbox.setAttribute("id", "gm_hfr_imgprev_display_icon_checkbox");
display_icon_checkbox.setAttribute("type", "checkbox");

function display_icon_changed() {
  if(display_icon_checkbox.checked) {
    display_icon_fieldset.setAttribute("class", "gm_hfr_imgprev_green");
  } else {
    display_icon_fieldset.setAttribute("class", "gm_hfr_imgprev_red");
  }
}
display_icon_checkbox.addEventListener("change", display_icon_changed, false);
display_icon_legend.appendChild(display_icon_checkbox);
var display_icon_label = document.createElement("label");
display_icon_label.textContent = " Afficher l'image de signalement à côté des liens reconnus ";
display_icon_label.setAttribute("for", "gm_hfr_imgprev_display_icon_checkbox");
display_icon_legend.appendChild(display_icon_label);
display_icon_legend.appendChild(create_help_button(320,
  "Si vous désactivez l'image de signalement vous pouvez continuer à acceder à cette " +
  "fenêtre de configuration via le menu de l'extension ou, si vous utilisez Greasemonkey, " +
  "en forçant l'option en dur \u00ab\u202fforce_display\u202f\u00bb à true dans le code " +
  "pour réactiver l'image de signalement."));
display_icon_fieldset.appendChild(display_icon_legend);
var icon_img_p = document.createElement("p");
icon_img_p.setAttribute("class", "gm_hfr_imgprev_p_flex");
var icon_img_test_img = document.createElement("img");
icon_img_test_img.setAttribute("class", "gm_hfr_imgprev_test_img");
icon_img_p.appendChild(icon_img_test_img);
var icon_img_input = document.createElement("input");
icon_img_input.setAttribute("type", "text");
icon_img_input.setAttribute("spellcheck", "false");
icon_img_input.setAttribute("size", "42");
icon_img_input.setAttribute("title", "url de l'icône (http ou data)");
icon_img_input.addEventListener("focus", function() {
  icon_img_input.select();
}, false);

function icon_img_do_test_img() {
  icon_img_test_img.setAttribute("src", icon_img_input.value.trim());
  icon_img_input.setSelectionRange(0, 0);
  icon_img_input.blur();
}
icon_img_input.addEventListener("input", icon_img_do_test_img, false);
icon_img_p.appendChild(icon_img_input);
var icon_img_reset_img = document.createElement("img");
icon_img_reset_img.setAttribute("src", img_reset);
icon_img_reset_img.setAttribute("class", "gm_hfr_imgprev_reset_img");
icon_img_reset_img.setAttribute("title", "remettre l'icône par défaut");

function icon_img_do_reset_img() {
  icon_img_input.value = hfr_imgprev_img_icon_default;
  icon_img_do_test_img();
}
icon_img_reset_img.addEventListener("click", icon_img_do_reset_img, false);
icon_img_p.appendChild(icon_img_reset_img);
display_icon_fieldset.appendChild(icon_img_p);
config_window.appendChild(display_icon_fieldset);

// section preview_size
var preview_size_fieldset = document.createElement("fieldset");
var preview_size_legend = document.createElement("legend");
preview_size_legend.textContent = "Tailles maximales de la preview";
preview_size_fieldset.appendChild(preview_size_legend);
var preview_size_div = document.createElement("div");
preview_size_div.setAttribute("class", "gm_hfr_imgprev_table");
preview_size_fieldset.appendChild(preview_size_div);
// fixed
var preview_fixed_div = document.createElement("div");
preview_fixed_div.className = "gm_hfr_imgprev_cell";
var preview_width_fixed_p = document.createElement("p");
preview_width_fixed_p.setAttribute("class", "gm_hfr_imgprev_left");
var preview_width_fixed_label_radio = document.createElement("label");
preview_width_fixed_label_radio.textContent = "largeur fixe ";
preview_width_fixed_label_radio.setAttribute("for", "gm_hfr_imgprev_preview_width_fixed_radio");
preview_width_fixed_p.appendChild(preview_width_fixed_label_radio);
var preview_width_fixed_input = document.createElement("input");
preview_width_fixed_input.setAttribute("type", "text");
preview_width_fixed_input.setAttribute("size", "3");
preview_width_fixed_input.setAttribute("maxLength", "4");
preview_width_fixed_input.setAttribute("pattern", "[1-9]([0-9])*");
preview_width_fixed_input.addEventListener("focus", function() {
  preview_width_fixed_input.select();
}, false);
preview_width_fixed_p.appendChild(preview_width_fixed_input);
var preview_width_fixed_label_input = document.createElement("label");
preview_width_fixed_label_input.textContent = " px ";
preview_width_fixed_label_input.setAttribute("for", "gm_hfr_imgprev_preview_width_fixed_radio");
preview_width_fixed_p.appendChild(preview_width_fixed_label_input);
var preview_width_fixed_radio = document.createElement("input");
preview_width_fixed_radio.setAttribute("type", "radio");
preview_width_fixed_radio.setAttribute("id", "gm_hfr_imgprev_preview_width_fixed_radio");
preview_width_fixed_radio.setAttribute("name", "gm_hfr_imgprev_preview_width_radios");
preview_width_fixed_p.appendChild(preview_width_fixed_radio);
preview_fixed_div.appendChild(preview_width_fixed_p);
var preview_height_fixed_p = document.createElement("p");
preview_height_fixed_p.setAttribute("class", "gm_hfr_imgprev_left");
var preview_height_fixed_label_radio = document.createElement("label");
preview_height_fixed_label_radio.textContent = "hauteur fixe ";
preview_height_fixed_label_radio.setAttribute("for", "gm_hfr_imgprev_preview_height_fixed_radio");
preview_height_fixed_p.appendChild(preview_height_fixed_label_radio);
var preview_height_fixed_input = document.createElement("input");
preview_height_fixed_input.setAttribute("type", "text");
preview_height_fixed_input.setAttribute("size", "3");
preview_height_fixed_input.setAttribute("maxLength", "4");
preview_height_fixed_input.setAttribute("pattern", "[1-9]([0-9])*");
preview_height_fixed_input.addEventListener("focus", function() {
  preview_height_fixed_input.select();
}, false);
preview_height_fixed_p.appendChild(preview_height_fixed_input);
var preview_height_fixed_label_input = document.createElement("label");
preview_height_fixed_label_input.textContent = " px ";
preview_height_fixed_label_input.setAttribute("for", "gm_hfr_imgprev_preview_height_fixed_radio");
preview_height_fixed_p.appendChild(preview_height_fixed_label_input);
var preview_height_fixed_radio = document.createElement("input");
preview_height_fixed_radio.setAttribute("type", "radio");
preview_height_fixed_radio.setAttribute("id", "gm_hfr_imgprev_preview_height_fixed_radio");
preview_height_fixed_radio.setAttribute("name", "gm_hfr_imgprev_preview_height_radios");
preview_height_fixed_p.appendChild(preview_height_fixed_radio);
preview_fixed_div.appendChild(preview_height_fixed_p);
preview_size_div.appendChild(preview_fixed_div);
// window
var preview_window_div = document.createElement("div");
preview_window_div.className = "gm_hfr_imgprev_cell";
var preview_width_window_p = document.createElement("p");
preview_width_window_p.setAttribute("class", "gm_hfr_imgprev_right");
var preview_width_window_radio = document.createElement("input");
preview_width_window_radio.setAttribute("type", "radio");
preview_width_window_radio.setAttribute("id", "gm_hfr_imgprev_preview_width_window_radio");
preview_width_window_radio.setAttribute("name", "gm_hfr_imgprev_preview_width_radios");
preview_width_window_p.appendChild(preview_width_window_radio);
var preview_width_window_label = document.createElement("label");
preview_width_window_label.textContent = " largeur de la fenêtre / 4";
preview_width_window_label.setAttribute("for", "gm_hfr_imgprev_preview_width_window_radio");
preview_width_window_p.appendChild(preview_width_window_label);
preview_window_div.appendChild(preview_width_window_p);
var preview_height_window_p = document.createElement("p");
preview_height_window_p.setAttribute("class", "gm_hfr_imgprev_right");
var preview_height_window_radio = document.createElement("input");
preview_height_window_radio.setAttribute("type", "radio");
preview_height_window_radio.setAttribute("id", "gm_hfr_imgprev_preview_height_window_radio");
preview_height_window_radio.setAttribute("name", "gm_hfr_imgprev_preview_height_radios");
preview_height_window_p.appendChild(preview_height_window_radio);
var preview_height_window_label = document.createElement("label");
preview_height_window_label.textContent = " hauteur de la fenêtre";
preview_height_window_label.setAttribute("for", "gm_hfr_imgprev_preview_height_window_radio");
preview_height_window_p.appendChild(preview_height_window_label);
preview_window_div.appendChild(preview_height_window_p);
preview_size_div.appendChild(preview_window_div);
config_window.appendChild(preview_size_fieldset);

// info "sans rechargement" et boutons de validation et de fermeture
var save_close_div = document.createElement("div");
save_close_div.setAttribute("class", "gm_hfr_imgprev_save_close_div");
var info_reload_div = document.createElement("div");
info_reload_div.setAttribute("class", "gm_hfr_imgprev_info_reload_div");
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

// fonction de mise à jour de la configuration
function update_config() {
  // seuppression des images de signalement
  let l_icons = document.querySelectorAll("img.gm_hfr_imgprev_preview_icon");
  for(let l_icon of l_icons) {
    l_icon.remove();
  }
  // ré-ajout de l'image de signalement si configuré
  if(hfr_imgprev_display_icon || force_display) {
    let l_links = document.querySelectorAll("a.cLink[data-imgprev-ok=\"true\"]");
    for(let l_link of l_links) {
      l_link.appendChild(create_icon());
    }
  }
}

// fonction de validation de la fenêtre de configuration
function save_config_window() {
  // récupération des paramètres
  hfr_imgprev_display_icon = display_icon_checkbox.checked;
  hfr_imgprev_img_icon = icon_img_input.value.trim();
  if(hfr_imgprev_img_icon === "") {
    hfr_imgprev_img_icon = hfr_imgprev_img_icon_default;
  }
  hfr_imgprev_maxwidth_auto = preview_width_window_radio.checked;
  let maxwidth = parseInt(preview_width_fixed_input.value, 10);
  hfr_imgprev_maxwidth = maxwidth > 0 ? maxwidth : hfr_imgprev_maxwidth_default;
  hfr_imgprev_maxheight_auto = preview_height_window_radio.checked;
  let maxheight = parseInt(preview_height_fixed_input.value, 10);
  hfr_imgprev_maxheight = maxheight > 0 ? maxheight : hfr_imgprev_maxheight_default;
  // fermeture de la fenêtre
  hide_config_window();
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("hfr_imgprev_display_icon", hfr_imgprev_display_icon),
    GM.setValue("hfr_imgprev_img_icon", hfr_imgprev_img_icon),
    GM.setValue("hfr_imgprev_maxwidth_auto", hfr_imgprev_maxwidth_auto),
    GM.setValue("hfr_imgprev_maxwidth", hfr_imgprev_maxwidth),
    GM.setValue("hfr_imgprev_maxheight_auto", hfr_imgprev_maxheight_auto),
    GM.setValue("hfr_imgprev_maxheight", hfr_imgprev_maxheight),
  ]);
  // mise à jour de la configuration
  update_config();
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
  display_icon_checkbox.checked = hfr_imgprev_display_icon;
  display_icon_changed();
  icon_img_input.value = hfr_imgprev_img_icon;
  icon_img_do_test_img();
  preview_width_fixed_input.value = hfr_imgprev_maxwidth;
  preview_width_fixed_radio.checked = !hfr_imgprev_maxwidth_auto;
  preview_width_window_radio.checked = hfr_imgprev_maxwidth_auto;
  preview_height_fixed_input.value = hfr_imgprev_maxheight;
  preview_height_fixed_radio.checked = !hfr_imgprev_maxheight_auto;
  preview_height_window_radio.checked = hfr_imgprev_maxheight_auto;
  // affichage de la fenêtre
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

// ajout d'une entrée de configuration dans le menu de l'extension si c'est possible (pas gm4 yet)
if(typeof GM_registerMenuCommand !== "undefined") {
  GM_registerMenuCommand(script_name + " -> Configuration", show_config_window);
}

/* ---------------------------------- */
/* fonctions de gestion de la preview */
/* ---------------------------------- */

// fonction de désactivation de l'action par défaut sur un événement
function prevent_default(p_event) {
  p_event.preventDefault();
}

// fonction de détermination et de mise à jour de la taille de la fenêtre
function update_window_size() {
  window_width = parseInt(window.innerWidth / 4, 10) + "px";
  window_height = (window.innerHeight - 50) + "px";
}
window.addEventListener("resize", update_window_size);
update_window_size();

// fonction de gestion de l'animation du message de chargement
function loading_animation(p_element) {
  loading_progress = "";
  window.clearInterval(loading_timer);
  loading_timer = window.setInterval(function(p_element) {
    loading_progress += ".";
    if(loading_progress.length === 4) {
      loading_progress = "";
    }
    p_element.textContent = loading_text + loading_progress;
  }, 500, p_element);
}

// fonction de gestion du nettoyage et de la destruction de la preview
function clear_preview(p_destruct) {
  window.clearInterval(loading_timer);
  let l_preview = document.getElementById("gm_hfr_imgprev_preview_id");
  if(l_preview) {
    while(l_preview.firstChild) {
      l_preview.firstChild.remove();
    }
    if(typeof p_destruct !== "undefined" && p_destruct === true) {
      l_preview.remove();
      last_call = null;
    }
  }
}

// fonction de gestion de la destruction de la preview
function destruct_preview() {
  clear_preview(true);
}

// fonction de gestion de la création de l'image de signalement
function create_icon() {
  let l_icon = document.createElement("img");
  l_icon.setAttribute("src", hfr_imgprev_img_icon);
  l_icon.setAttribute("title", script_name + " -> Configuration");
  l_icon.setAttribute("class", "gm_hfr_imgprev_preview_icon");
  l_icon.addEventListener("click", prevent_default, false);
  l_icon.addEventListener("contextmenu", prevent_default, false);
  l_icon.addEventListener("mousedown", prevent_default, false);
  l_icon.addEventListener("mouseup", show_config_window, false);
  return l_icon;
}

// fonction de gestion de l'ajout de la preview sur les liens
function image_preview(p_link) {

  //console.log(p_link.href + " [" + script_name + " DEBUG ] OK 1");

  // ne traite pas les lien contenant déjà une image
  if(!p_link.firstElementChild ||
    (p_link.firstElementChild.nodeName.toUpperCase() !== "IMG" &&
      (p_link.firstElementChild.nodeName.toUpperCase() !== "SPAN" ||
        !p_link.firstElementChild.firstElementChild ||
        p_link.firstElementChild.firstElementChild.nodeName.toUpperCase() !== "IMG"))) {

    //console.log(p_link.href + " [" + script_name + " DEBUG ] OK 2");

    // ne traite pas les liens vide (bug du forum ?)
    if(p_link.firstChild) {

      //console.log(p_link.href + " [" + script_name + " DEBUG ] OK 3");

      // ne traite pas les liens vers le forum, sauf si c'est des images explicites,
      // et ne traite pas les liens (trop) mal formés
      if(p_link.href && (p_link.href.match(/^.*\.(?:gif|jpe?g|png|webp|svg)$/gi) ||
          (p_link.href.match(/^https?:\/\/forum\.hardware\.fr\/.*$/g) === null)) &&
        p_link.href.match(/^https?:\/\/[^\s\/$.?#].[^\s]*$/)) {

        //console.log(p_link.href + " [" + script_name + " DEBUG ] OK 4");

        // ne traite pas les liens vers des url shorteners (pour eviter de niquer ses drapoils)
        // basé sur http://bit.do/list-of-url-shorteners.php et http://dig.do/about/url-shortener
        if(p_link.href.match(/^https?:\/\/(?:[^\/]+\.)?(?:1click\.im|1dl\.us|1o2\.ir|1y\.lt|2tag\.nl|4ks\.net|4u2bn\.com|4zip\.in|9en\.us|ad4\.us|ad7\.biz|adbooth\.com|adbooth\.net|adf\.ly|adfa\.st|adfoc\.us|adfro\.gs|adlock\.in|adnld\.com|adshor\.tk|adspl\.us|adurl\.biz|adzip\.us|articleshrine\.com|asso\.in|at5\.us|awe\.sm|b2s\.me|bc\.vc|bih\.cc|bit\.do|bit\.ly|biturl\.net|bizz\.cc|budurl\.com|buraga\.org|cc\.cr|cf\.ly|cf6\.co|clicky\.me|cutt\.us|dai3\.net|dollarfalls\.info|domainonair\.com|dstats\.net|fur\.ly|goo\.gl|gooplu\.com|hide4\.me|hotshorturl\.com|iiiii\.in|ik\.my|ilikear\.ch|infovak\.com|is\.gd|ity\.im|itz\.bz|j\.gs|jetzt-hier-klicken\.de|kaaf\.com|kly\.so|l1nks\.org|lst\.bz|magiclinker\.com|miniurl\.com|mrte\.ch|multiurl\.com|multiurlscript\.com|nicbit\.com|nowlinks\.net|nsyed\.com|omani\.ac|onelink\.ir|ooze\.us|ozn\.st|prettylinkpro\.com|rlu\.ru|s2r\.co|scriptzon\.com|seomafia\.net|short2\.in|shortxlink\.com|shr\.tn|shrinkonce\.com|shrt\.in|sitereview\.me|sk\.gy|snpurl\.biz|socialcampaign\.com|soo\.gd|swyze\.com|t\.co|tab\.bz|theminiurl\.com|tiny\.cc|tinylord\.com|tinyurl\.ms|tip\.pe|ty\.by|1url\.com|7vd\.cn|adcraft\.co|adcrun\.ch|aka\.gr|bitly\.com|buzurl\.com|crisco\.com|cur\.lv|db\.tt|dft\.ba|filoops\.info|j\.mp|lnkd\.in|ow\.ly|q\.gs|qr\.ae|qr\.net|scrnch\.me|tinyarrows\.com|tinyurl\.com|tr\.im|tweez\.me|twitthis\.com|u\.bb|u\.to|v\.gd|viralurl\.biz|viralurl\.com|virl\.ws|vur\.me|vurl\.bz|vzturl\.com|x\.co|yourls\.org)\/.*$/gi) === null) {

          //console.log(p_link.href + " [" + script_name + " DEBUG ] OK 5");

          // gestion du http:// supprimé par le forum dans les images
          if(p_link.href.startsWith("https://images.weserv.nl/")) {
            p_link.href = p_link.href.replace("url=http://", "url=");
          }

          // lancement d'une requête HEAD sur le lien pour obtenir le content-type
          GM.xmlHttpRequest({
            method: "HEAD",
            url: p_link.href,
            mozAnon: true,
            anonymous: true,
            headers: {
              "Cookie": "",
              "Referer": "https://forum.hardware.fr/",
            },
            onload: function(r) {

              //console.log(p_link.href + " [" + script_name + " DEBUG ] OK headers :\n" +
              //  r.responseHeaders);
              //console.log(p_link.href + " [" + script_name + " DEBUG ] OK content-type : " +
              //  r.responseHeaders.match(/^.*content-type.*$/im));

              let l_image_type = r.responseHeaders.match(/^.*content-type.*image\/(gif|jpe?g|png|webp|svg).*$/im);
              if(l_image_type) {

                //console.log(p_link.href + " [" + script_name + " DEBUG ] OK 6");

                // detection spécifique des images svg
                let l_svg = l_image_type[1].toLowerCase() === "svg";

                //console.log(p_link.href + " [" + script_name + " DEBUG ] SVG " + l_svg);

                // marquage des liens reconnus
                p_link.setAttribute("data-imgprev-ok", "true");
                // ajout de l'image de signalement si configuré
                if(hfr_imgprev_display_icon || force_display) {
                  p_link.appendChild(create_icon());
                }
                // ajout de la gestion du mouseover sur les liens (création de la preview)
                p_link.addEventListener("mouseover", function() {
                  // destruction d'une éventuelle preview existante
                  destruct_preview();
                  // création de la preview
                  preview = document.createElement("div");
                  preview.setAttribute("id", "gm_hfr_imgprev_preview_id");
                  // création du message de chargement
                  let l_loading = document.createElement("p");
                  l_loading.textContent = loading_text;
                  preview.appendChild(l_loading);
                  document.body.appendChild(preview);
                  // lancement de l'animation du message de chargement
                  loading_animation(l_loading);
                  // création de l'image
                  let l_image = new Image();
                  l_image.style.maxWidth =
                    hfr_imgprev_maxwidth_auto ? window_width : hfr_imgprev_maxwidth + "px";
                  l_image.style.maxHeight =
                    hfr_imgprev_maxheight_auto ? window_height : hfr_imgprev_maxheight + "px";
                  l_image.dataset.lastcall = Date.now();
                  last_call = l_image.dataset.lastcall;
                  // gestion de la fin de chargement de l'image
                  l_image.addEventListener("load", function() {
                    if(this.dataset.lastcall !== last_call) {
                      return;
                    }
                    // gestion des images svg sans taille
                    if(l_svg && (this.naturalWidth === 0 || /* firefox */
                        this.naturalHeight === 150 || this.naturalHeight === 300 /* chrome */ )) {

                      //console.log(p_link.href + " [" + script_name + " DEBUG ] SVG NO WIDTH " +
                      //  this.naturalWidth + " " + this.naturalHeight);

                      this.style.width = this.style.maxWidth;
                    }
                    // suppression du message de chargement
                    clear_preview();
                    // ajout de l'image dans la préview
                    preview.style.width = "auto";
                    preview.appendChild(this);
                  }, false);
                  l_image.src = this.href;
                }, false);
                // ajout de la gestion du mouseout sur les liens (destruction de la preview)
                p_link.addEventListener("mouseout", function() {
                  destruct_preview();
                }, false);
              }
            }
          });
        }
      }
    }
  }
}

/* ------------------------------------------------------------------------------ */
/* récupération des paramètres et ajout de la gestion de la preview sur les liens */
/* ------------------------------------------------------------------------------ */

// destruction d'une éventuelle preview existante
destruct_preview();

Promise.all([
  GM.getValue("hfr_imgprev_display_icon", hfr_imgprev_display_icon_default),
  GM.getValue("hfr_imgprev_img_icon", hfr_imgprev_img_icon_default),
  GM.getValue("hfr_imgprev_maxwidth_auto", hfr_imgprev_maxwidth_auto_default),
  GM.getValue("hfr_imgprev_maxwidth", hfr_imgprev_maxwidth_default),
  GM.getValue("hfr_imgprev_maxheight_auto", hfr_imgprev_maxheight_auto_default),
  GM.getValue("hfr_imgprev_maxheight", hfr_imgprev_maxheight_default),
]).then(function([
  hfr_imgprev_display_icon_value,
  hfr_imgprev_img_icon_value,
  hfr_imgprev_maxwidth_auto_value,
  hfr_imgprev_maxwidth_value,
  hfr_imgprev_maxheight_auto_value,
  hfr_imgprev_maxheight_value,
]) {
  hfr_imgprev_display_icon = hfr_imgprev_display_icon_value;
  hfr_imgprev_img_icon = hfr_imgprev_img_icon_value;
  hfr_imgprev_maxwidth_auto = hfr_imgprev_maxwidth_auto_value;
  hfr_imgprev_maxwidth = hfr_imgprev_maxwidth_value;
  hfr_imgprev_maxheight_auto = hfr_imgprev_maxheight_auto_value;
  hfr_imgprev_maxheight = hfr_imgprev_maxheight_value;
  // recherche des liens et ajout de la gestion de la preview
  var links = document.querySelector("div#mesdiscussions.mesdiscussions").querySelectorAll(
    "table.messagetable td.messCase2 div[id^='para'] > span:not(.signature) a.cLink, " +
    "table.messagetable td.messCase2 div[id^='para'] > div:not(.edited) a.cLink, " +
    "table.messagetable td.messCase2 div[id^='para'] > *:not(span):not(div) a.cLink");
  for(let l_link of links) {

    //console.log(l_link.href + " [" + script_name + " DEBUG ] OK 0");

    image_preview(l_link);
  }
});
