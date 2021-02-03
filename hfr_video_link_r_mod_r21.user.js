// ==UserScript==
// @name          [HFR] Video Link Replacer mod_r21
// @version       4.1.1
// @namespace     roger21.free.fr
// @description   Remplace les liens vers des videos par les lecteurs intégrés correspondants pour youtube, dailymotion, vimeo, twitch, coub et streamable.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    shinuza
// @modifications Mise à jour des liens supportés, du https, des urls courtes, des start-time, ajout du lien original à coté du lecteur, gestion des liens en citation, ajout des supports pour twitch, coub et streamable et ajout d'une fenêtre de configuration.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_video_link_r_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_video_link_r_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_video_link_r_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
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

Copyright © 2014-2021 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 2834 $

// historique :
// 4.1.1 (02/02/2021) :
// - ajout du support pour GM.registerMenuCommand() (pour gm4)
// 4.1.0 (08/12/2020) :
// - nouvelle gestion des timestamps pour youtube (signalé par Heeks)
// 4.0.9 (15/07/2020) :
// - ajout du paramètre parent pour les videos twitch (nouvelle obligation de twitch)
// - ajout du support partiel pour les liens vers les collections twitch ->
// (non gestion des liens video + collection -> video seulement)
// 4.0.8 (17/03/2020) :
// - conversion des click -> select() en focus -> select() sur les champs de saisie
// 4.0.7 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 4.0.6 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 4.0.5 (10/11/2019) :
// - réduction des temps des transitions de 0.7s à 0.3s
// 4.0.4 (27/10/2019) :
// - meilleur gestion des liens avec du contenu
// 4.0.3 (13/10/2019) :
// - ajout d'une option pour recharger la page sur la fenêtre de configuration
// 4.0.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 4.0.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 4.0.0 (05/09/2019) :
// - ajout d'une fenêtre de configuration
// - amélioration du support pour les urls des vods et des clips twitch
// - suppression du support pour vine.co
// - correction de la gestion du start time pour vimeo
// - mise à jour des metadata @description, @modifications
// 3.2.0 (28/08/2019) :
// - correction de la sélection des liens et des liens quotés
// - nouvelle gestion de l'affichage des vidéos pour éviter la séparation de la vidéo et du lien externe
// - non propagation des clics pour éviter l'inversion des spoilers
// - ajout d'un target="_blank" sur les liens externes
// 3.1.2 (10/08/2019) :
// - amélioration de la recherche des liens non quotés dans les posts
// 3.1.1 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+ *si shinuza est d'accord*
// - réécriture des metadata @description, @modifications et @modtype
// 3.1.0 (08/07/2018) :
// - nouveau nom : [HFR] Video link replacer mod_r21 -> [HFR] Video Link Replacer mod_r21
// - ajout de notes d'infos dans le script
// - activation de tous les hébergeurs de vidéos par défaut et adaptation de la description
// 3.0.0 (16/06/2018) :
// - nouveau nom : [HFR] video link replacer mod_r21 -> [HFR] Video link replacer mod_r21
// - ajout du support pour les liens coub
// - ajout du support pour les liens streamable
// - ajout du support pour les liens en gaming.youtube.com
// - ajout du support pour les channels et les vod twitch (en plus des clips déjà supportés)
// - meilleur gestion du trailing / sur les liens twitch
// - [b]désactivation de tous les supports sauf youtube par défaut ->
// voir les options en dur dans le code pour activer les autres supports[/b]
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (shinuza)
// - réécriture et mise à jour des metadata @description et @modifications
// 2.3.1 (22/05/2018) :
// - meilleur gestion des url vimeo (problème signalé par BrisChri)
// 2.3.0 (13/05/2018) :
// - check du code dans tm et simplifications du code
// - amélioration de la gestion des liens avec un contenu
// 2.2.0 (13/05/2018) :
// - ajout d'une option en dur pour n'afficher les vidéos que par clic (NEEDCLICK)
// - ajout de la gestion des liens quotés (en affichage par clic)
// - ajout d'un style distinctif pour les liens vidéos cliquables (l'émoji play)
// - maj de la metadata @homepageURL
// 2.1.5 (28/04/2018) :
// - suppression des @grant inutiles (tous)
// 2.1.4 (24/04/2018) :
// - prise en compte des urls en m.youtube
// 2.1.3 (07/12/2017) :
// - correction d'un problème avec dailymotion
// 2.1.2 (28/11/2017) :
// - passage au https
// 2.1.1 (29/12/2016) :
// - remplacement de l'espace entre la video et le lien par un espace insécable
// 2.1.0 (09/12/2016) :
// - ajout du lien vers le lien :o (à côté de la frame)
// - correction de la regexp du start time pour les liens youtube long
// - "meilleure" gestion du lien sur image
// 2.0.0 (06/08/2016) :
// - mise à jour du support du start-time dans les liens youtube
// - ajout du support pour les liens courts et du start-time pour dailymotion
// - mise à jour du support de vimeo (https)
// - passage en https pour l'iframe quand proposé par l'hebergeur
// - ajout du support pour les vine.co et les clips.twtch.tv
// - nettoyage des regexps
// - remplacement des ' par des " (pasque !)
// - génocide de lignes vides
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - nouveau numéro de version : 0.1.7.5 -> 2.0.0
// - nouveau nom : [HFR] Video Link Replacer -> [HFR] video link replacer mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// 0.1.7.5 (22/03/2015) :
// - ajout d'un vertical-align:bottom sur l'iframe (pour faire comme les images avec le style hfr images smileys)
// 0.1.7.4 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.1.7.3 (19/01/2015) :
// - léger reformatage du code par endroits
// - réduction de la taille de la video 560x315 -> 512x288
// 0.1.7.2 (27/03/2014) :
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.1.7.1 (18/03/2014) :
// - ajout d'un ; (pour une meilleur indentation auto)
// - changement du nom du script : [Mes Discussions] Video Link Replacer -> [HFR] Video Link Replacer
// - ajout des metadata @grant et indentation des metadata
// - ajout d'un .1 sur le numero de version

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
var gmMenu = GM.registerMenuCommand || GM_registerMenuCommand;
// info du navigateur pour les différences d'affichage ff / ch
var ff = navigator.userAgent && navigator.userAgent.indexOf("Firefox") !== -1;

/* ---------- */
/* les images */
/* ---------- */

var img_link = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA8ElEQVR42mNgwAEcMx%2FKAfFrIP6OhL8i4c9AfJwBHwAq8ALin0D8Hwf%2BzkAIABX5APFvvAYAGQVAfBWInwPxSyhuhMrl4XUBkCiCcv5C%2FfUeiKcDMRMQ5%2BDRDDfgJtSfWmhOJ6QZbgAopF%2BiaY6CugiXxr%2FIBrzHYsBePJpnArEf1NU4DajAoXk2KGyQovg9VgOgCqZisRkcsEhqNHAaAFVQB8QXoTRIcxkoFaIrwmkAFgOfYzPgNQkGgBLYZ3TBu9AQVSCgWQaaoR6iS9RAAwmUwx7iwZ%2Bh6hrRDQAFTjMQP4Ua8h0L%2FgqVB6ljQdYPACFXiNVuDbLIAAAAAElFTkSuQmCC";
var img_params = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA9klEQVR42mNgQAOeYQ9YgZgXizgvEDMz4ANABQpAvBCIjwFxEJJ4MBCfAOJZQCyPz4BDQPwfij8CcSIQZwPxLyTxs%2FgM2IOkEBc%2Bic%2BAOCIMSMdnwGwiDFiIrkkch9NBYhxAzAXEe7HI7wZiPpABhdhsCoh5yIpkiQBaQMJwE0iyEpsBaK7kBuI%2FWNS1gySlgfgmEH8G4r9IkmuhGkFeWIkk%2Fheq9pZ3%2BAMB9ESEHoifgPgblP0PSs8HYilcsZBARCxk44vG7WiKf2Px%2BxF8BhxAUghyehYQF6AZcgqfATJAvBiI7wOxK5K4JxA%2FBOKZQCzGQE0AABQmbExBQIKBAAAAAElFTkSuQmCC";
var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";

/* ------------------------------------------------ */
/* les variables globales et les options par défaut */
/* ------------------------------------------------ */

var re_links = [
  /^http(?:s)?:\/\/(?:www\.|m\.|gaming\.)?(youtu)be\.com\/.+v=([\w-]+)/, // youtube
  /^http(?:s)?:\/\/(youtu)\.be\/([\w-]+)/, // youtube urls courtes
  /^http(?:s)?:\/\/(?:www\.)?(dai)lymotion\.com\/video\/([\w-]+)/, // dailymotion
  /^http(?:s)?:\/\/(dai)\.ly\/([\w-]+)/, // dailymotion urls courtes
  /^http(?:s)?:\/\/(vimeo)\.com\/(?:[\a-zA-Z]+\/)*([0-9]+)/, // vimeo
  /^https:\/\/www\.(twitch)\.tv\/([\w]+?)\/?$/, // twitch channels
  /^https:\/\/www\.twitch\.tv\/(video)s\/([0-9]+)(?:\?.*)?\/?/, // twitch vods 1
  /^https:\/\/www\.twitch\.tv\/[^\/]+\/(video)\/([0-9]+)(?:\?.*)?\/?/, // twitch vods 2
  /^https:\/\/www\.twitch\.tv\/(collections)\/([a-zA-Z0-9]+)(?:\?.*)?\/?/, // twitch collections
  /^https:\/\/(clip)s\.twitch\.tv\/([\w]+?)\/?$/, // twitch clips 1
  /^https:\/\/www\.twitch\.tv\/[^\/]+\/(clip)\/([\w]+?)(?:\?.*)?\/?$/, // twitch clips 2
  /^https:\/\/(coub)\.com\/view\/([\w]+)/, // coub
  /^https:\/\/(streamable)\.com\/([\w]+)/, // streamable
];
var urls_start = {
  "youtu": "https://www.youtube.com/embed/",
  "dai": "//www.dailymotion.com/embed/video/",
  "vimeo": "https://player.vimeo.com/video/",
  "video": "https://player.twitch.tv/?autoplay=false&video=v",
  "twitch": "https://player.twitch.tv/?autoplay=false&channel=",
  "collections": "https://player.twitch.tv/?autoplay=false&collection=",
  "clip": "https://clips.twitch.tv/embed?autoplay=false&clip=",
  "coub": "//coub.com/embed/",
  "streamable": "https://streamable.com/s/",
};
var urls_end = {
  "youtu": "",
  "dai": "",
  "vimeo": "",
  "video": "&parent=forum.hardware.fr",
  "twitch": "&parent=forum.hardware.fr",
  "collections": "&parent=forum.hardware.fr",
  "clip": "&parent=forum.hardware.fr",
  "coub": "",
  "streamable": "",
};
var re_start_youtube = /(?:\?|&)t=(?:([0-9]+)h)?(?:([0-9]+)m)?([0-9]+)s?$/;
var re_start_daily = /\?start=[0-9]+$/;
var re_start_vimeo = /#t=[0-9]+s$/;
var re_start_other = /\?t=[0-9]+h[0-9]+m[0-9]+s$/;
var width_default = 512;
var height_default = 288;
var needclick_default = false;
var allow_youtube_default = true;
var allow_dailymotion_default = true;
var allow_vimeo_default = true;
var allow_twitch_default = true;
var allow_coub_default = true;
var allow_streamable_default = true;
var allows = {
  "youtu": allow_youtube_default,
  "dai": allow_dailymotion_default,
  "vimeo": allow_vimeo_default,
  "video": allow_twitch_default,
  "twitch": allow_twitch_default,
  "clip": allow_twitch_default,
  "coub": allow_coub_default,
  "streamable": allow_streamable_default,
};

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // style pour les liens cliquables (transformables)
  "a.cLink.gmhfrvlrr21_link::after{content:\"\\0020\\25b6\\fe0f\";}" +
  // style pour la video
  "div.gmhfrvlrr21_outer_div{display:inline-block;vertical-align:bottom;white-space:nowrap;position:relative;}" +
  "iframe.gmhfrvlrr21_video{vertical-align:bottom;border:0;}" +
  "img.gmhfrvlrr21_params{position:absolute;cursor:pointer;top:0;right:1px;}" +
  // styles pour la fenêtre de configuration
  "#gmhfrvlrr21_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:1003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;" +
  "text-align:justify;}" +
  "#gmhfrvlrr21_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gmhfrvlrr21_config_window{position:fixed;width:350px;height:auto;background:#ffffff;z-index:1002;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;}" +
  "#gmhfrvlrr21_config_window div.gmhfrvlrr21_main_title{font-size:16px;text-align:center;font-weight:bold;" +
  "margin:0 0 10px;}" +
  "#gmhfrvlrr21_config_window fieldset{margin:0 0 8px;border:1px solid #888888;padding:6px 10px 10px;}" +
  "#gmhfrvlrr21_config_window legend{font-size:14px;}" +
  "#gmhfrvlrr21_config_window div.gmhfrvlrr21_table{display:table;width:100%;}" +
  "#gmhfrvlrr21_config_window div.gmhfrvlrr21_cell{display:table-cell;width:50%;}" +
  "#gmhfrvlrr21_config_window div.gmhfrvlrr21_left{text-align:right;padding-right:4px;}" +
  "#gmhfrvlrr21_config_window div.gmhfrvlrr21_right{text-align:left;padding-left:4px;}" +
  "#gmhfrvlrr21_config_window p{margin:0 0 0 4px;}" +
  "#gmhfrvlrr21_config_window p:not(:last-child){margin-bottom:4px;}" +
  "#gmhfrvlrr21_config_window input[type=\"radio\"]{margin:0 0 2px;vertical-align:text-bottom;}" +
  "#gmhfrvlrr21_config_window input[type=\"text\"]{padding:0 1px;border:1px solid #c0c0c0;height:14px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;text-align:right;}" +
  "#gmhfrvlrr21_config_window input[type=\"checkbox\"]{margin:0 0 1px;vertical-align:text-bottom;}" +
  "#gmhfrvlrr21_config_window div.gmhfrvlrr21_save_close_div{text-align:right;margin:16px 0 0;}" +
  "#gmhfrvlrr21_config_window div.gmhfrvlrr21_save_close_div div.gmhfrvlrr21_info_reload_div" +
  "{float:left;}" +
  "#gmhfrvlrr21_config_window div.gmhfrvlrr21_save_close_div div.gmhfrvlrr21_info_reload_div img" +
  "{vertical-align:text-bottom;}" +
  "#gmhfrvlrr21_config_window div.gmhfrvlrr21_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  "#gmhfrvlrr21_config_window img.gmhfrvlrr21_help_button{margin-right:1px;cursor:help;}";
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// création de la fenêtre d'aide
var help_window = document.createElement("div");
help_window.setAttribute("id", "gmhfrvlrr21_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(width, text) {
  let help_button = document.createElement("img");
  help_button.setAttribute("src", img_help);
  help_button.setAttribute("class", "gmhfrvlrr21_help_button");
  help_button.addEventListener("mouseover", function(e) {
    help_window.style.width = width + "px";
    help_window.textContent = text;
    help_window.style.left = (e.clientX + 32) + "px";
    help_window.style.top = (e.clientY - 16) + "px";
    help_window.style.visibility = "visible";
  }, false);
  help_button.addEventListener("mouseout", function(e) {
    help_window.style.visibility = "hidden";
  }, false);
  return help_button;
}

// création du voile de fond pour la fenêtre de configuration
var config_background = document.createElement("div");
config_background.setAttribute("id", "gmhfrvlrr21_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gmhfrvlrr21_config_window");
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.className = "gmhfrvlrr21_main_title";
main_title.appendChild(document.createTextNode("Configuration du script"));
main_title.appendChild(document.createElement("br"));
main_title.appendChild(document.createTextNode("[HFR] Video Link Replacer"));
config_window.appendChild(main_title);

// section tailles
var size_fieldset = document.createElement("fieldset");
var size_legend = document.createElement("legend");
size_legend.textContent = "Taille des vidéos";
size_fieldset.appendChild(size_legend);
config_window.appendChild(size_fieldset);

// table des tailles
var size_div = document.createElement("div");
size_div.className = "gmhfrvlrr21_table";
size_fieldset.appendChild(size_div);

// block largeur
var width_div = document.createElement("div");
width_div.className = "gmhfrvlrr21_cell";
var width_p = document.createElement("p");
var width_label_1 = document.createElement("label");
width_label_1.textContent = "largeur ";
width_label_1.setAttribute("for", "gmhfrvlrr21_width_input");
width_p.appendChild(width_label_1);
var width_input = document.createElement("input");
width_input.setAttribute("type", "text");
width_input.setAttribute("id", "gmhfrvlrr21_width_input");
width_input.setAttribute("size", "3");
width_input.setAttribute("maxLength", "4");
width_input.setAttribute("pattern", "[1-9]([0-9])*");
width_input.addEventListener("focus", function() {
  width_input.select();
}, false);
width_p.appendChild(width_input);
var width_label_2 = document.createElement("label");
width_label_2.textContent = " px";
width_label_2.setAttribute("for", "gmhfrvlrr21_width_input");
width_p.appendChild(width_label_2);
width_div.appendChild(width_p);
size_div.appendChild(width_div);

// block hauteur
var height_div = document.createElement("div");
height_div.className = "gmhfrvlrr21_cell";
var height_p = document.createElement("p");
var height_label_1 = document.createElement("label");
height_label_1.textContent = "hauteur ";
height_label_1.setAttribute("for", "gmhfrvlrr21_height_input");
height_p.appendChild(height_label_1);
var height_input = document.createElement("input");
height_input.setAttribute("type", "text");
height_input.setAttribute("id", "gmhfrvlrr21_height_input");
height_input.setAttribute("size", "3");
height_input.setAttribute("maxLength", "4");
height_input.setAttribute("pattern", "[1-9]([0-9])*");
height_input.addEventListener("focus", function() {
  height_input.select();
}, false);
height_p.appendChild(height_input);
var height_label_2 = document.createElement("label");
height_label_2.textContent = " px";
height_label_2.setAttribute("for", "gmhfrvlrr21_height_input");
height_p.appendChild(height_label_2);
height_div.appendChild(height_p);
size_div.appendChild(height_div);

// section affichage
var display_fieldset = document.createElement("fieldset");
var display_legend = document.createElement("legend");
display_legend.textContent = "Mode d'affichage";
display_fieldset.appendChild(display_legend);
config_window.appendChild(display_fieldset);

// table des affichages
var display_div = document.createElement("div");
display_div.className = "gmhfrvlrr21_table";
display_fieldset.appendChild(display_div);

// block auto
var display_auto_div = document.createElement("div");
display_auto_div.className = "gmhfrvlrr21_cell gmhfrvlrr21_left";
var display_auto_label = document.createElement("label");
display_auto_label.textContent = "automatique ";
display_auto_label.setAttribute("for", "gmhfrvlrr21_display_auto_radio");
display_auto_div.appendChild(display_auto_label);
var display_auto_radio = document.createElement("input");
display_auto_radio.setAttribute("type", "radio");
display_auto_radio.setAttribute("id", "gmhfrvlrr21_display_auto_radio");
display_auto_radio.setAttribute("name", "gmhfrvlrr21_display_radios");
display_auto_div.appendChild(display_auto_radio);
display_div.appendChild(display_auto_div);

// block click
var display_click_div = document.createElement("div");
display_click_div.className = "gmhfrvlrr21_cell  gmhfrvlrr21_right";
var display_click_radio = document.createElement("input");
display_click_radio.setAttribute("type", "radio");
display_click_radio.setAttribute("id", "gmhfrvlrr21_display_click_radio");
display_click_radio.setAttribute("name", "gmhfrvlrr21_display_radios");
display_click_div.appendChild(display_click_radio);
var display_click_label = document.createElement("label");
display_click_label.textContent = " en cliquant";
display_click_label.setAttribute("for", "gmhfrvlrr21_display_click_radio");
display_click_div.appendChild(display_click_label);
display_div.appendChild(display_click_div);

// section hébergeurs
var options_fieldset = document.createElement("fieldset");
var options_legend = document.createElement("legend");
options_legend.textContent = "Hébergeurs autorisés";
options_fieldset.appendChild(options_legend);
config_window.appendChild(options_fieldset);

// table des hébergeurs
var options_div = document.createElement("div");
options_div.className = "gmhfrvlrr21_table";
options_fieldset.appendChild(options_div);

// bloc de gauche
var options_left_div = document.createElement("div");
options_left_div.className = "gmhfrvlrr21_cell";
var youtube_p = document.createElement("p");
var youtube_checkbox = document.createElement("input");
youtube_checkbox.setAttribute("type", "checkbox");
youtube_checkbox.setAttribute("id", "gmhfrvlrr21_youtube_checkbox");
youtube_p.appendChild(youtube_checkbox);
var youtube_label = document.createElement("label");
youtube_label.textContent = " youtube";
youtube_label.setAttribute("for", "gmhfrvlrr21_youtube_checkbox");
youtube_p.appendChild(youtube_label);
options_left_div.appendChild(youtube_p);
var vimeo_p = document.createElement("p");
var vimeo_checkbox = document.createElement("input");
vimeo_checkbox.setAttribute("type", "checkbox");
vimeo_checkbox.setAttribute("id", "gmhfrvlrr21_vimeo_checkbox");
vimeo_p.appendChild(vimeo_checkbox);
var vimeo_label = document.createElement("label");
vimeo_label.textContent = " vimeo";
vimeo_label.setAttribute("for", "gmhfrvlrr21_vimeo_checkbox");
vimeo_p.appendChild(vimeo_label);
options_left_div.appendChild(vimeo_p);
var coub_p = document.createElement("p");
var coub_checkbox = document.createElement("input");
coub_checkbox.setAttribute("type", "checkbox");
coub_checkbox.setAttribute("id", "gmhfrvlrr21_coub_checkbox");
coub_p.appendChild(coub_checkbox);
var coub_label = document.createElement("label");
coub_label.textContent = " coub";
coub_label.setAttribute("for", "gmhfrvlrr21_coub_checkbox");
coub_p.appendChild(coub_label);
options_left_div.appendChild(coub_p);
options_div.appendChild(options_left_div);

// block de droite
var options_right_div = document.createElement("div");
options_right_div.className = "gmhfrvlrr21_cell";
var dailymotion_p = document.createElement("p");
var dailymotion_checkbox = document.createElement("input");
dailymotion_checkbox.setAttribute("type", "checkbox");
dailymotion_checkbox.setAttribute("id", "gmhfrvlrr21_dailymotion_checkbox");
dailymotion_p.appendChild(dailymotion_checkbox);
var dailymotion_label = document.createElement("label");
dailymotion_label.textContent = " dailymotion";
dailymotion_label.setAttribute("for", "gmhfrvlrr21_dailymotion_checkbox");
dailymotion_p.appendChild(dailymotion_label);
options_right_div.appendChild(dailymotion_p);
var twitch_p = document.createElement("p");
var twitch_checkbox = document.createElement("input");
twitch_checkbox.setAttribute("type", "checkbox");
twitch_checkbox.setAttribute("id", "gmhfrvlrr21_twitch_checkbox");
twitch_p.appendChild(twitch_checkbox);
var twitch_label = document.createElement("label");
twitch_label.textContent = " twitch";
twitch_label.setAttribute("for", "gmhfrvlrr21_twitch_checkbox");
twitch_p.appendChild(twitch_label);
options_right_div.appendChild(twitch_p);
var streamable_p = document.createElement("p");
var streamable_checkbox = document.createElement("input");
streamable_checkbox.setAttribute("type", "checkbox");
streamable_checkbox.setAttribute("id", "gmhfrvlrr21_streamable_checkbox");
streamable_p.appendChild(streamable_checkbox);
var streamable_label = document.createElement("label");
streamable_label.textContent = " streamable";
streamable_label.setAttribute("for", "gmhfrvlrr21_streamable_checkbox");
streamable_p.appendChild(streamable_label);
options_right_div.appendChild(streamable_p);
options_div.appendChild(options_right_div);

// rechargement de la page et boutons de validation et de fermeture
var save_close_div = document.createElement("div");
save_close_div.className = "gmhfrvlrr21_save_close_div";
var info_reload_div = document.createElement("div");
info_reload_div.className = "gmhfrvlrr21_info_reload_div";
var info_reload_checkbox = document.createElement("input");
info_reload_checkbox.setAttribute("type", "checkbox");
info_reload_checkbox.setAttribute("id", "gmhfrvlrr21_info_reload_checkbox");
info_reload_div.appendChild(info_reload_checkbox);
var info_reload_label = document.createElement("label");
info_reload_label.textContent = " recharger la page ";
info_reload_label.setAttribute("for", "gmhfrvlrr21_info_reload_checkbox");
info_reload_div.appendChild(info_reload_label);
info_reload_div.appendChild(create_help_button(255,
  "La modification des paramètres de cette fenêtre de configuration n'est visible que sur les nouvelles " +
  "pages ou après le rechargement de la page courante. Cette option permet de recharger automatiquement la " +
  "page courante lors de la validation."));
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
  if(!(youtube_checkbox.checked || dailymotion_checkbox.checked || vimeo_checkbox.checked ||
      twitch_checkbox.checked || coub_checkbox.checked || streamable_checkbox.checked)) {
    alert("Vous devez au moins autoriser un hébergeur.");
    return;
  }
  // fermeture de la fenêtre
  hide_config_window();
  // analyse des paramètres
  let width = parseInt(width_input.value, 10);
  width = width > 0 ? width : width_default;
  let height = parseInt(height_input.value, 10);
  height = height > 0 ? height : height_default;
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("width", width),
    GM.setValue("height", height),
    GM.setValue("needclick", display_click_radio.checked),
    GM.setValue("allow_youtube", youtube_checkbox.checked),
    GM.setValue("allow_dailymotion", dailymotion_checkbox.checked),
    GM.setValue("allow_vimeo", vimeo_checkbox.checked),
    GM.setValue("allow_twitch", twitch_checkbox.checked),
    GM.setValue("allow_coub", coub_checkbox.checked),
    GM.setValue("allow_streamable", streamable_checkbox.checked),
  ]).then(function() {
    if(info_reload_checkbox.checked) {
      window.location.reload(true);
    }
  });
}

// fonction de fermeture de la fenêtre de configuration
function hide_config_window() {
  config_window.style.opacity = "0";
  config_background.style.opacity = "0";
}

// fonction de fermeture de la fenêtre de configuration par la touche echap
function esc_config_window(e) {
  if(e.key === "Escape") {
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
  // récupération des paramètres
  Promise.all([
    GM.getValue("width", width_default),
    GM.getValue("height", height_default),
    GM.getValue("needclick", needclick_default),
    GM.getValue("allow_youtube", allow_youtube_default),
    GM.getValue("allow_dailymotion", allow_dailymotion_default),
    GM.getValue("allow_vimeo", allow_vimeo_default),
    GM.getValue("allow_twitch", allow_twitch_default),
    GM.getValue("allow_coub", allow_coub_default),
    GM.getValue("allow_streamable", allow_streamable_default),
  ]).then(function([
    width,
    height,
    needclick,
    allow_youtube,
    allow_dailymotion,
    allow_vimeo,
    allow_twitch,
    allow_coub,
    allow_streamable,
  ]) {
    // initialisation des paramètres
    width_input.value = width;
    height_input.value = height;
    display_auto_radio.checked = !needclick;
    display_click_radio.checked = needclick;
    youtube_checkbox.checked = allow_youtube;
    dailymotion_checkbox.checked = allow_dailymotion;
    vimeo_checkbox.checked = allow_vimeo;
    twitch_checkbox.checked = allow_twitch;
    coub_checkbox.checked = allow_coub;
    streamable_checkbox.checked = allow_streamable;
    info_reload_checkbox.checked = false;
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
  });
}

// ajout d'une entrée de configuration dans le menu de l'extension
gmMenu("[HFR] Video Link Replacer -> Configuration", show_config_window);

/* ------------------------------------------ */
/* récupération des liens et des liens quotés */
/* ------------------------------------------ */

var links = document.querySelectorAll(
  "td.messCase2 > div[id^='para'] > span:not(.signature) a.cLink, " +
  "td.messCase2 > div[id^='para'] > div:not(.edited) a.cLink, " +
  "td.messCase2 > div[id^='para'] > *:not(span):not(div) a.cLink"
);
var linksq = document.querySelectorAll(
  "td.messCase2 > div[id^='para'] table.quote a.cLink, " +
  "td.messCase2 > div[id^='para'] table.citation a.cLink, " +
  "td.messCase2 > div[id^='para'] table.oldcitation a.cLink"
);
links = Array.from(links);
linksq = Array.from(linksq);
var filtered_links = [];
for(let l of links) {
  if(!linksq.includes(l)) {
    filtered_links.push(l)
  }
}
links = filtered_links;

/* ----------------------------------------- */
/* les fonctions de transformation des liens */
/* ----------------------------------------- */

function add_video(iframe, params, external_link, link) {
  let outer_div = document.createElement("div");
  outer_div.className = "gmhfrvlrr21_outer_div";
  outer_div.appendChild(iframe);
  outer_div.appendChild(document.createTextNode("\u00A0"));
  outer_div.appendChild(params);
  outer_div.appendChild(external_link);
  link.parentNode.replaceChild(outer_div, link);
}

function replace(links, width, height, needclick, allows) {
  for(let link of links) {
    let href = link.href;
    for(let match of re_links) {
      if(match.test(href)) {
        let tokens = href.match(match);
        let name = tokens[1];
        let src = tokens[2];
        if(allows[name]) {
          let start = "";
          let starty = href.match(re_start_youtube);
          if(starty && name === "youtu") {
            start = 0;
            start += starty[1] ? parseInt(starty[1], 10) * 3600 : 0;
            start += starty[2] ? parseInt(starty[2], 10) * 60 : 0;
            start += starty[3] ? parseInt(starty[3], 10) : 0;
            start = "?start=" + start;
          } else {
            let startd = href.match(re_start_daily);
            if(startd) {
              start = startd[0];
            } else {
              let startv = href.match(re_start_vimeo);
              if(startv) {
                start = startv[0];
              } else {
                let starto = href.match(re_start_other);
                if(starto) {
                  start = "&" + starto[0].substr(1);
                }
              }
            }
          }
          let iframe = document.createElement("iframe");
          iframe.className = "gmhfrvlrr21_video";
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("scrolling", "no");
          iframe.setAttribute("allow", "fullscreen");
          iframe.setAttribute("allowfullscreen", "allowfullscreen");
          iframe.setAttribute("src", urls_start[name] + src + urls_end[name] + start);
          iframe.setAttribute("width", width);
          iframe.setAttribute("height", height);
          let params = document.createElement("img");
          params.setAttribute("src", img_params);
          params.className = "gmhfrvlrr21_params";
          // bug de chrome en sortie du fullscreen
          if(!ff) {
            params.style.left = (width + 3) + "px";
          }
          params.setAttribute("title", "Configuration");
          params.addEventListener("click", function(e) {
            e.stopPropagation();
            show_config_window();
          }, false);
          let external_link = document.createElement("a");
          external_link.setAttribute("href", href);
          external_link.setAttribute("target", "_blank");
          external_link.setAttribute("title", href);
          external_link.setAttribute("class", "cLink");
          external_link.addEventListener("click", function(e) {
            e.stopPropagation();
          }, false);
          let img_external_link = document.createElement("img");
          img_external_link.setAttribute("src", img_link);
          img_external_link.style.verticalAlign = "bottom";
          external_link.appendChild(img_external_link);
          if(!needclick && link.firstChild && link.firstChild.nodeType === 3 &&
            link.firstChild.nodeValue.indexOf(href.substr(0, 34)) === 0) {
            add_video(iframe, params, external_link, link);
          } else {
            link.classList.add("gmhfrvlrr21_link");
            link.addEventListener("click", function(e) {
              e.preventDefault();
              e.stopPropagation();
              add_video(iframe, params, external_link, link);
            }, true);
          }
        }
        break;
      }
    }
  }
}

/* ------------------------------------------------------- */
/* récupération des paramètres et transformation des liens */
/* ------------------------------------------------------- */

Promise.all([
  GM.getValue("width", width_default),
  GM.getValue("height", height_default),
  GM.getValue("needclick", needclick_default),
  GM.getValue("allow_youtube", allow_youtube_default),
  GM.getValue("allow_dailymotion", allow_dailymotion_default),
  GM.getValue("allow_vimeo", allow_vimeo_default),
  GM.getValue("allow_twitch", allow_twitch_default),
  GM.getValue("allow_coub", allow_coub_default),
  GM.getValue("allow_streamable", allow_streamable_default),
]).then(function([
  width,
  height,
  needclick,
  allow_youtube,
  allow_dailymotion,
  allow_vimeo,
  allow_twitch,
  allow_coub,
  allow_streamable,
]) {
  allows.youtu = allow_youtube;
  allows.dai = allow_dailymotion;
  allows.vimeo = allow_vimeo;
  allows.video = allow_twitch;
  allows.twitch = allow_twitch;
  allows.collections = allow_twitch;
  allows.clip = allow_twitch;
  allows.coub = allow_coub;
  allows.streamable = allow_streamable;
  replace(links, width, height, false || needclick, allows);
  replace(linksq, width, height, true, allows);
});
