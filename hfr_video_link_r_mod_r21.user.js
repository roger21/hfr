// ==UserScript==
// @name          [HFR] Video Link Replacer mod_r21
// @version       3.1.0
// @namespace     roger21.free.fr
// @description   Remplace les liens vers des videos par les lecteurs intégrés correspondants (youtube, dailymotion, vimeo, twitch, vine, coub et streamable) voir les options en dur dans le code pour choisir les hébergeurs de vidéos à activer ou à désactiver (tous activés par défaut)
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    shinuza
// @modifications Mise à jour des liens supportés, du https, des urls courtes, des start-time, ajout du lien original à coté du lecteur, gestion des liens en citation et ajout des supports pour twitch, vine, coub et streamable
// @modtype       évolution de fonctionnalités
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// modifications roger21 $Rev: 349 $

// historique :
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


/* ----------------- */
/* INFOS IMPORTANTES */
/* ----------------- */

// dans firefox, si vous activez la "protection contre le pistage" en permanance, il ne faut pas
// utiliser la "liste de blocage" strict mais rester sur la basique (sinon le script ne marchera pas)

// dans firefox toujours, pour que les lecteurs intégrés conservent les réglages de volume, il faut autoriser les cookies tiers

// pour tous, pour choisir les hébergeurs de vidéos à activer ou à désactiver, voir la section suivante juste dessous (les options en dur)


/* ------------------ */
/* les options en dur */
/* ------------------ */

// pour activer un hébergeur de vidéos il faut enlever les // au début de la ligne correspondante dans le tableau suivant
// pour désactiver un hébergeur de vidéos il faut rajouter // au début de la ligne correspondante dans le tableau suivant
var matchers = [
  /^http(?:s)?:\/\/(?:www\.|m\.|gaming\.)?(youtu)be\.com\/.+v=([\w-]+)/, // youtube
  /^http(?:s)?:\/\/(youtu)\.be\/([\w-]+)/, // youtube urls courtes
  /^http(?:s)?:\/\/(?:www\.)?(dai)lymotion\.com\/video\/([\w-]+)/, // dailymotion
  /^http(?:s)?:\/\/(dai)\.ly\/([\w-]+)/, // dailymotion urls courtes
  /^http(?:s)?:\/\/(vimeo)\.com\/(?:[\a-zA-Z]+\/)*([0-9]+)/, // vimeo
  /^https:\/\/www\.twitch\.tv\/(videos)\/([0-9]+)\/?/, // twitch vods
  /^https:\/\/www\.(twitch)\.tv\/([\w]+?)\/?$/, // twitch channels
  /^https:\/\/(clips)\.twitch\.tv\/([\w]+?)\/?$/, // twitch clips
  /^https:\/\/(vine)\.co\/v\/([\w]+)/, // vine
  /^https:\/\/(coub)\.com\/view\/([\w]+)/, // coub
  /^https:\/\/(streamable)\.com\/([\w]+)/, // streamable
];

// passer à true pour n'afficher les vidéos que par clic
var NEEDCLICK = false;

// les tailles par défaut des lecteurs (que vous pouvez changer ici)
// voir ce lien pour une liste des formats 16/9 : https://pacoup.com/2011/06/12/list-of-true-169-resolutions/
var WIDTH = 512;
var HEIGHT = 288;


/* ---------------- */
/* le reste du code */
/* ---------------- */

var ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA8ElEQVR42mNgwAEcMx%2FKAfFrIP6OhL8i4c9AfJwBHwAq8ALin0D8Hwf%2BzkAIABX5APFvvAYAGQVAfBWInwPxSyhuhMrl4XUBkCiCcv5C%2FfUeiKcDMRMQ5%2BDRDDfgJtSfWmhOJ6QZbgAopF%2BiaY6CugiXxr%2FIBrzHYsBePJpnArEf1NU4DajAoXk2KGyQovg9VgOgCqZisRkcsEhqNHAaAFVQB8QXoTRIcxkoFaIrwmkAFgOfYzPgNQkGgBLYZ3TBu9AQVSCgWQaaoR6iS9RAAwmUwx7iwZ%2Bh6hrRDQAFTjMQP4Ua8h0L%2FgqVB6ljQdYPACFXiNVuDbLIAAAAAElFTkSuQmCC";
var LINKS = "td.messCase2 > div[id^='para'] > p > a.cLink, table.spoiler a.cLink";
var LINKSQ = "table.quote a.cLink, table.citation a.cLink, table.oldcitation a.cLink";
var STARTY = /(?:\?|&)t=(?:([0-9]+)h)?(?:([0-9]+)m)?([0-9]+)s$/;
var STARTD = /\?start=[0-9]+$/;
var STARTV = /\?t=[0-9]+h[0-9]+m[0-9]+s$/;

var roots = {
  youtu: "https://www.youtube.com/embed/",
  dai: "//www.dailymotion.com/embed/video/",
  vimeo: "https://player.vimeo.com/video/",
  videos: "https://player.twitch.tv/?autoplay=false&video=v",
  twitch: "https://player.twitch.tv/?autoplay=false&channel=",
  clips: "https://clips.twitch.tv/embed?autoplay=false&clip=",
  vine: "https://vine.co/v/",
  coub: "//coub.com/embed/",
  streamable: "https://streamable.com/s/",
};

var tails = {
  youtu: "",
  dai: "",
  vimeo: "",
  videos: "",
  twitch: "",
  clips: "",
  vine: "/embed/simple",
  coub: "",
  streamable: "",
};

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent = "a.cLink.gmhfrvlrr21::after{content:\"\\0020\\25b6\\fe0f\";}";
document.getElementsByTagName("head")[0].appendChild(style);

function replace(links, needClick) {
  for(let link of links) {
    let href = link.href;
    for(let matcher of matchers) {
      if(matcher.test(href)) {
        let tokens = href.match(matcher);
        let name = tokens[1];
        let src = tokens[2];
        let start = "";
        let starty = href.match(STARTY);
        if(starty && name === "youtu") {
          start = 0;
          start += starty[1] ? parseInt(starty[1], 10) * 3600 : 0;
          start += starty[2] ? parseInt(starty[2], 10) * 60 : 0;
          start += starty[3] ? parseInt(starty[3], 10) : 0;
          start = "?start=" + start;
        } else {
          let startd = href.match(STARTD);
          if(startd) {
            start = startd[0];
          } else {
            let startv = href.match(STARTV);
            if(startv) {
              start = "&" + startv[0].substr(1);
            }
          }
        }
        link.classList.add("gmhfrvlrr21");
        let iframe = document.createElement("iframe");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("webkitAllowFullScreen", "");
        iframe.setAttribute("mozallowfullscreen", "");
        iframe.setAttribute("src", roots[name] + src + tails[name] + start);
        iframe.setAttribute("width", WIDTH);
        iframe.setAttribute("height", HEIGHT);
        iframe.style.verticalAlign = "bottom";
        let external_link = document.createElement("a");
        external_link.setAttribute("href", href);
        external_link.setAttribute("title", href);
        external_link.setAttribute("class", "cLink");
        let img_external_link = document.createElement("img");
        img_external_link.setAttribute("src", ICON);
        img_external_link.style.verticalAlign = "bottom";
        external_link.appendChild(img_external_link);
        if(link.textContent.indexOf(href.substr(0, 34)) === 0 && !needClick) {
          link.parentNode.insertBefore(external_link, link.nextSibling);
          link.parentNode.insertBefore(document.createTextNode("\u00A0"), link.nextSibling);
          link.parentNode.replaceChild(iframe, link);
        } else {
          link.addEventListener("click", function(e) {
            e.preventDefault();
            link.parentNode.insertBefore(external_link, link.nextSibling);
            link.parentNode.insertBefore(document.createTextNode("\u00A0"), link.nextSibling);
            link.parentNode.replaceChild(iframe, link);
          }, false);
          if(link.children.length) {
            for(let i = 0; i < link.children.length; ++i) {
              link.children[i].addEventListener("click", function(e) {
                e.preventDefault();
                link.parentNode.insertBefore(external_link, link.nextSibling);
                link.parentNode.insertBefore(document.createTextNode("\u00A0"), link.nextSibling);
                link.parentNode.replaceChild(iframe, link);
              }, false);
            }
          }
        }
      }
    }
  }
}

replace(document.querySelectorAll(LINKS), false || NEEDCLICK);
replace(document.querySelectorAll(LINKSQ), true);
