// ==UserScript==
// @name          [HFR] wiki smileys et raccourcis mod_r21
// @version       2.3.9
// @namespace     http://toyonos.info
// @description   Rajoute le wiki smilies et des raccourcis clavier pour la mise en forme, dans la réponse rapide et dans l'édition rapide
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        toyonos
// @modifications basé sur la version 1 (ou a) - simplification de l'edition des mots-clé (reduction des délais d'affichage et suppression de la popup de confirmation), contournement d'un problème pour le raccourcis url, ajout du support pour reho.st, unification des fonctionalités pour chaque mode d'édition et ajout de trois raccourcis
// @modtype       modification de fonctionnalités
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_wiki_smileys_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_wiki_smileys_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_wiki_smileys_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @connect       hfr-mirror.toyonos.info
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// ==/UserScript==

// modifications roger21 $Rev: 1590 $

// historique :
// 2.3.9 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.3.8 (11/02/2020) :
// - adaptation du code pour fonctionner avec [HFR] Vos smileys favoris mod_r21 3.0.0 (à venir)
// - correction des marges autour des smileys
// 2.3.7 (11/01/2020) :
// - petites modifications des styles pour être homogène avec [HFR] Vos smileys favoris mod_r21 3.0.0 (à venir)
// - nettoyage du code relatif aux stickers
// 2.3.6 (17/12/2019) :
// - correction de la taille de la réponse normale et limitation au resize vertical
// 2.3.5 (14/12/2019) :
// - correction de la mise en page de la colonne de gauche sur la réponse normale
// 2.3.4 (21/11/2019) :
// - deplace le curseur après le = pour l'insertion d'url (proposé par Heeks)
// 2.3.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 2.3.2 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.3.1 (28/10/2018) :
// - modification de la gestion des raccourcis pour prendre en compte la nouvelle gestion de altGr depuis ff63 ->
// https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/63#DOM_events
// - modification du raccourcis puce par défaut de '*' (mal géré) à 'x'
// 2.3.0 (13/05/2018) :
// - check du code dans tm
// - ajout de la metadata @connect pour tm
// - suppression des @grant inutiles
// - maj de la metadata @homepageURL
// 2.2.1 (28/11/2017) :
// - passage au https
// 2.2.0 (12/11/2017) :
// - ajout de 2 tempos pour éviter de spammer hfr (risque de ban ip) sur l'affichage des mots-clés et sur la recherche par mot(s)-clé(s) ->
// il ne peut plus y avoir plusieurs requêtes en même temps et il y a toujours un délais de 250ms et 500ms entre les requêtes ->
// et les requêtes pour l'affichage des mots-clés ne sont faites qu'une fois
// - meilleure gestion de la distinction des recherches par mot(s)-clé(s) l'orsqu'il y en a plusieurs d'ouvertes (en cas d'editions rapide)
// 2.1.1 (11/02/2017) :
// - correction du style font-fammily à Verdana,Arial,Sans-serif,Helvetica (HFR Style)
// 2.1.0 (15/12/2016) :
// - ajout de trois raccourcis : smiley (m), orange (5) et violet (6)
// - ajout de l'ouverture de la fenêtre de configuration en double-cliquant sur le bouton d'aide
// 2.0.1 (11/11/2016) :
// - correction d'un "bug" d'affichage en réponse normale (pour certains) sur la disposition ->
// des smileys de base (passage de 152px à 155px de large pour les afficher)
// 2.0.0 (11/11/2016) :
// - nouveau numéro de version : 0.7.11 -> 2.0.0
// - nouveau nom : [HFR] Wiki smilies & raccourcis dans la reponse/edition rapide -> [HFR] wiki smileys et raccourcis mod_r21
// - léger restylage de la fenêtre de configuration
// - compression des images (pngoptimizer)
// - genocide de lignes vides et de commentaires ([:roger21:2])
// - découpage des décalarations multiples
// - remplacement des ' par des " (pasque !)
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 0.7.11 (06/08/2016) :
// - ajout du nom de la version de base dans la metadata @modifications
// 0.7.10 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.7.9 (21/01/2015) :
// - ajout d'encodeURIComponent sur les requetes ajax comme dans Edition rapide du Wiki smilies, ça semble plus sain
// - amelioration de la position de la popup d'edition rapide (encore)
// - compactage du css
// - decoupage des lignes de code trop longue
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 0.7.8 (21/01/2015) :
// - amelioration de la position de la popup d'edition rapide
// 0.7.7 (20/01/2015) :
// - suppression des raccourcis media et webm devenu inutiles avec le nouveau script "html5 media link replacer"
// 0.7.6 (05/09/2014) :
// - correction d'un problème sur la position de l'aide contextuel (smilies_helper) en cas de reponse flotante
// 0.7.5 (05/09/2014) :
// - gestion d'une différence d'affichage entre win7 et winXP pour cet espace
// 0.7.4 (05/09/2014) :
// - ajout d'un espace identique entre la réponse rapide et les boutons en cas de désactivation de feeligo
// 0.7.3 (24/08/2014) :
// - modification de l'insertion de l'icone d'aide et du lien générateurs sur la réponse rapide pour éviter ->
// un conflit avec le script "vos smileys favoris"
// 0.7.2 (20/08/2014) :
// - correction du bold sur le lien de suppression des smileys favoris hfr sur la page de réponse normale
// 0.7.1 (29/04/2014) :
// - ajout d'un scroll à l'ouverture des stickers
// 0.7.0 (28/04/2014) :
// - nouvelle numérotation des versions
// 0.6.2a.10 (28/04/2014) :
// - ajout d'un <br /> entre l'arbo du bas et la reponse rapide
// - reencodage en png/64 et déclaration unique des images
// - ajustement et homogénéisation des marges autour des textarea
// 0.6.2a.9 (27/04/2014) :
// - supression du fade et de la transparency variable sur la réponse rapide flotante
// - ajout d'une div d'espace autoadaptative quand la réponse rapide est flotante
// - meilleure gestion des marges pour les recherches de smileys et la reponse flotante
// 0.6.2a.8 (26/04/2014) :
// - suppression du module d'auto-update (code mort)
// - ajout de l'aide, du lien des générateurs et du smilies helper sur l'edition rapide
// - restylage du code pour une meilleur indentation automatique (rend le diff pratiquement illisible)
// - intégration du script dans la page de réponse normale
// 0.6.2a.7 (07/04/2014) :
// - ajout du support pour 4chan webm ([webm][/webm]) avec ctrl+alt+n (attention aussi un raccourcis tab mix plus)
// 0.6.2a.6 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.6.2a.5 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.6.2a.4 (10/10/2013) :
// - passage de http://hfr-rehost.net/ vers http://reho.st/ pour le raccourci rehost
// 0.6.2a.3 (14/09/2012) :
// - ajout des metadata @grant
// 0.6.2a.1 @ 0.6.2a.2 (07/12/2011) :
// - activation du script pour la page d'edition pas radide
// - ajout du support pour la balise media
// - désactivation de la popup pour le racourci url (bug sur le paste d'url dans la popup)
// - suppression de la popup de validation de modification du wiki smiley
// - changement du message de confirmation de modification du wiki smiley
// - réduction du délais d'affichage de la popup de confirmation de modification du wiki smiley
// - désactivation du message d'erreur XML dans la toyolib
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

var imgHelpPngLol = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACnElEQVR42q2T3U%2BSYRjG%2FVvgT2it5mrVap3V1jjooAOn5ifQ1HK1DJazdJjTLCk1M50KauqcigJvAiKIJsqXIPBiIl%2FKx0B44VWz7eqNNZyb88hn%2B50912%2B77t13Xt5FPx15xNa6DwUa5wGp2qSpH%2FY0pbBR5JwlKZgx7bPPDaudNGfekQl5wkfY2qPhDlJZPLsZOAIZjC1HQyNLYc6ZYWIjzZFbU%2BntyAHMv%2BKQLvghmnCicWwTPcQWDI4oXCEK31T%2BdA%2Bxc1oiMydZ0%2BuJ4FaYxpIzhnom1E144I%2FR8MUymFgOoE5qhXI9BLsvifZpMtg66WLlBOMrUeGGP401TwLCYTue95mROTxm%2BPOfY9QPW1A3aMKiPQLtRgQNUqswJxhYCJEupmsvsY3aPhNqetfgj2YwsxqA2rYLmhGobUFwO3Von3HA6o3jRa%2BRzAm6FF7aHUxBKLGg%2BqsRvG4D81mPWaMPceoQe3Ea%2FfMulHdoUf1FD4dvHzyxns4J2iZdtCuQwsshC7hdelR%2B1qHikw4p%2Bjd2IhT4Yi1K2lR4zMAXa2D3J1DYoj4RvJHaSNtOAmKZC7xOAyrEiyj7uIDS9%2Bosxe8IFDcrUNQsR6N0FUZPBA8b5CcVmD5ChTEAvSOC6i5DLhhLHiCyT6NANJelWCQDse6DhKlzr27qZIh88RKr8sNicMUZgXLND26HBkUtSnRMmrL8Cxc2TWFU44bGEsDd2ong7afjrFO7UCCa5zxqItI6%2By7U1iDeSlZQ1ipHSfMsXvfroTR6oTL7cbPqe%2Fr6k5Gzt%2FGBUMa5%2F2o6NEBs4qc7DIs3lmXZuYcemQ35PGnoaqWEc%2B493Hk2zr5VMya4UTVKXuMPU%2FlcKXWlYoi8XD4ouFQ6wL7w6%2F0LXCsKj6bCqcQAAAAASUVORK5CYII%3D";

var imgOkPngLol = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACl0lEQVR42q2T60uTYRiH%2FTv2bnttAwlkRCGChFD7FCQSm2ZDMQ%2FL0nRnj7TNGDbTooychzFSSssstdqc8zB1anNrSpm47FVCzH3pQLVhdLBfzztoJlifvOEHz4fnuu7nGBe311XgOyLMnTmsz%2FakMBljB8OSEVFY4kpkJM5Efbp9v%2FC%2FcJ43VSrzJId0HhluBy3oW%2BmKpnOpGSWuExD30iFxDy3dFSZdpZkTSZHr80Y41%2Fphe3UDpvnKaNixY60PjbNVOGTjRZJtvJ2SHE%2BKINOdtMHC7MSaQBkq%2FCXQzJ6DjqScpNp3HvY3D3B5ugIiC3dDdJMriAlk7iSDajwr2pmFWVDlPQPFTCEU0wVQTxfCvT4Ig1cJB5Hk9hxDwjWuISbIGBExncFmWINNqPAVQ%2FlUTsB8KKdIPPmYeOsCW6HIOtpeNMI234j4ei4TExy3J2w%2BWr2L2oAGWm8RWckAlj4uQDVZiPH1oSj8c%2BsH2p5fgWGyGH3BTvCN1GZMIH5Ib%2FavdMPoV6HWr8Xnb5%2Bi0Iev72KwZa4ealc29O6z6A92gF%2Fzt6CHZm4tNKF98Sp0U3KYfdWIfP8Shbd%2BbcHy7BLKnFnQEEFLoA7tXjPoKmp7C6l3%2BAb5QBrsq%2FdRPSmH2n0adTPlWH6%2FiLa5BpQOnoTCcQo6Zw7sr7uRbj0KupLaPsRkK09wgFyN2aPBY%2BYeKkfzoB3OgWpIBqWDDQtn48lyF4xDxeCrORu0mhLseAuJTVxpfAMVMbnL4CCS1oAZ%2BtEiXBiWo5VswU5gvbMIvFJOhMC7v8Z9DVwpbaJCkg4x2v1m9L60onfBCovXhLSWVPAVnBCt%2Bgf8p%2BiLXCFtoPR0DcXwtZwwX8UJk44MiZ4upYR7%2Fnt%2FA%2Bw9sdKFchsrAAAAAElFTkSuQmCC";

var imgCancelPngLol = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACEklEQVR42q1S%2FU9SYRhlbW13%2FQ0V5Woub05zfZkCXhUhpmmb8v3h5ZKoCQjcwVBi1Q%2B19Zf0d2lWxpeR3AuX93J8qGVjgK2tZ3u3d3t2znmecx6D4R%2BrsS5dGdiEnDXS4weCQ2Fe9QUSdafH3B%2Bc3UM7k4OeSPWQNIIi3xAjaG5u48fz1Y%2B1peU7PWAU3qBNT0%2FKaG3tnJOogXWe1NGKJYB8AZ3%2Fic2RqMxaL%2F0iSGe4dlLW23uvgPcfoOfyHQI0RYlX%2FSGe1KHtxAHqqyERJwtPWUWYv9w1oh5PcuxlnOlyFnj7DiydQSMcAalD244Buf2f%2F6rVTuA5rq9JregW15Q2WCu2S%2Bu8BvYLBMwD2RxUfxDVeRurzMxyF8cUFDnFG9CRo3V8QcDtA%2BQMqnMLetkicH%2FNWfH4O1EBlAacHmDVBeymaG87ipPT%2FMVgt49XvH5okSiQkgmYBuK0DhmorrlQMVnwdXyiP0nd5eUVjw%2BatAFQjIrbCzKLlabN%2BunSChDdRP3ZCor3H%2BJoeKSbhC6LJ3Vo4RekmoRCo5NZrDRl5oqPJrnjiQesZrUBYQmndgeOR8dweGPoDwldllB3uqGJEpQ1N8gsVnpiOjfsy%2Bg493nkLvtuEaA4FvFt7B4OrhmFrinosoTa4jLK5hmdzOpx%2B%2Bj2MPdp6BbrC%2F5dZZNFKD6eGhjVofEmd3D1umD4n3UGltFKFDkd60gAAAAASUVORK5CYII%3D";

var doubleClickInterval = 250;
var lastClickTime = 0;
var keywordsTitleTimeout = null;
var inputSearchTimeout = null;

var cssManager = {
  cssContent: "",
  addCssProperties: function(properties) {
    cssManager.cssContent += properties;
  },
  insertStyle: function() {
    GM_addStyle(cssManager.cssContent);
    cssManager.cssContent = "";
  }
}

var getElementByXpath = function(path, element) {
  let arr = Array();
  let xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  let item = xpr.iterateNext();
  while(item) {
    arr.push(item);
    item = xpr.iterateNext();
  }
  return arr;
}

var $ = function() {
  var elements = new Array();
  for(var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if(typeof element == "string") {
      element = document.getElementById(element);
    }
    if(arguments.length == 1) {
      return element;
    }
    elements.push(element);
  }
  return elements;
}

function getOffset(el) {
  var _x = 0;
  var _y = 0;
  while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return {
    top: _y,
    left: _x
  };
}

var cmScript = {
  shortcuts: {
    "ws_spoiler": {
      left: "[spoiler]",
      sample: "texte",
      right: "[/spoiler]",
      key: 83
    },
    "ws_b": {
      left: "[b]",
      sample: "texte",
      right: "[/b]",
      key: 66
    },
    "ws_i": {
      left: "[i]",
      sample: "texte",
      right: "[/i]",
      key: 73
    },
    "ws_u": {
      left: "[u]",
      sample: "texte",
      right: "[/u]",
      key: 85
    },
    "ws_img": {
      left: "[img]",
      sample: "image",
      right: "[/img]",
      key: 80
    },
    "ws_img_rehost": {
      left: "[img]https://reho.st/",
      sample: "image",
      right: "[/img]",
      key: 72
    },
    "ws_quote": {
      left: "[quote]",
      sample: "texte",
      right: "[/quote]",
      key: 81
    },
    "ws_url": {
      left: "[url]",
      sample: "url",
      right: "[/url]",
      key: 76
    },
    "ws_code": {
      left: "[code]",
      sample: "code",
      right: "[/code]",
      key: 67
    },
    "ws_fixed": {
      left: "[fixed]",
      sample: "texte",
      right: "[/fixed]",
      key: 70
    },
    "ws_strike": {
      left: "[strike]",
      sample: "texte",
      right: "[/strike]",
      key: 82
    },
    "ws_puce": {
      left: "[*]",
      sample: "texte",
      right: "",
      key: 88
    },
    "ws_smiley": {
      left: "[:",
      sample: "smiley",
      right: "]",
      key: 77
    },
    "ws_color_red": {
      left: "[#ff0000]",
      sample: "<span style=\"color:#ff0000;\">texte</span>",
      right: "[/#ff0000]",
      key: 97
    },
    "ws_color_blue": {
      left: "[#0000ff]",
      sample: "<span style=\"color:#0000ff;\">texte</span>",
      right: "[/#0000ff]",
      key: 98
    },
    "ws_color_yellow": {
      left: "[#ffff00]",
      sample: "<span style=\"color:#ffff00;\">texte</span>",
      right: "[/#ffff00]",
      key: 99
    },
    "ws_color_green": {
      left: "[#00ff00]",
      sample: "<span style=\"color:#00ff00;\">texte</span>",
      right: "[/#00ff00]",
      key: 100
    },
    "ws_color_orange": {
      left: "[#ff7f00]",
      sample: "<span style=\"color:#ff7f00;\">texte</span>",
      right: "[/#ff7f00]",
      key: 101
    },
    "ws_color_purple": {
      left: "[#bf00ff]",
      sample: "<span style=\"color:#bf00ff;\">texte</span>",
      right: "[/#bf00ff]",
      key: 102
    },
    "ws_alerte": {
      left: "[img]http://hfr.toyonos.info/generateurs/alerte/?smiley&t=",
      sample: "Scripts",
      right: "[/img]",
      key: 87
    },
    "ws_nazi": {
      left: "[img]http://hfr.toyonos.info/generateurs/nazi/?t=",
      sample: "Grammar",
      right: "[/img]",
      key: 90
    },
    "ws_fb": {
      left: "[img]http://hfr.toyonos.info/generateurs/fb/?t=",
      sample: "HFR",
      right: "[/img]",
      key: 75
    },
    "ws_seagal": {
      left: "[img]http://hfr.toyonos.info/generateurs/StevenSeagal/?t=",
      sample: "Happy",
      right: "[/img]",
      key: 86
    },
    "ws_bulle": {
      left: "[img]http://hfr.toyonos.info/generateurs/bulle/?t=",
      sample: "C Ratal",
      right: "[/img]",
      key: 84
    }
  },
  keysBinding: {
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    96: "numpad 0",
    97: "numpad 1",
    98: "numpad 2",
    99: "numpad 3",
    100: "numpad 4",
    101: "numpad 5",
    102: "numpad 6",
    103: "numpad 7",
    104: "numpad 8",
    105: "numpad 9"
  },
  backgroundDiv: null,
  configDiv: null,
  timer: null,
  getShortcutKey: function(id) {
    return GM_getValue(id, cmScript.shortcuts[id].key);
  },
  get templateSmileyLeft() {
    return GM_getValue("ws_template_smiley_left", " ");
  },
  get templateSmileyRight() {
    return GM_getValue("ws_template_smiley_right", " ");
  },
  get alwaysNotSticky() {
    return GM_getValue("ws_always_not_sticky", false);
  },
  get activeOnMq() {
    return GM_getValue("ws_active_on_mq", false);
  },
  setDivsPosition: function() {
    cmScript.setBackgroundPosition();
    cmScript.setConfigWindowPosition();
  },
  setBackgroundPosition: function() {
    cmScript.backgroundDiv.style.width = document.documentElement.clientWidth + "px";
    cmScript.backgroundDiv.style.height = document.documentElement.clientHeight + "px";
    cmScript.backgroundDiv.style.top = window.scrollY + "px";
  },
  setConfigWindowPosition: function() {
    cmScript.configDiv.style.left = (document.documentElement.clientWidth / 2) -
      (parseInt(cmScript.configDiv.style.width) / 2) + window.scrollX + "px";
    cmScript.configDiv.style.top = (document.documentElement.clientHeight / 2) -
      (parseInt(cmScript.configDiv.clientHeight) / 2) + window.scrollY + "px";
  },
  disableKeys: function(event) {
    var key = event.which;
    if(key == 27) {
      clearInterval(cmScript.timer);
      cmScript.hideConfigWindow();
    } else if(key == 13) {
      cmScript.validateConfig();
    } else if(event.altKey || (event.target.nodeName.toLowerCase() != "input" && key >= 33 && key <= 40)) {
      event.preventDefault();
    }
  },
  disableTabUp: function(elt) {
    elt.addEventListener("keydown", function(event) {
      var key = event.which;
      if(key == 9 && event.shiftKey) {
        event.preventDefault();
      }
    }, false);
  },
  disableTabDown: function(elt) {
    elt.addEventListener("keydown", function(event) {
      var key = event.which;
      if(key == 9 && !event.shiftKey) {
        event.preventDefault();
      }
    }, false);
  },
  disableScroll: function() {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", cmScript.disableKeys, false);
  },
  enableScroll: function() {
    document.body.style.overflow = "visible";
    window.removeEventListener("keydown", cmScript.disableKeys, false);
  },
  alterWindow: function(opening) {
    if(opening) {
      cmScript.disableScroll();
      window.addEventListener("resize", cmScript.setDivsPosition, false);
      getElementByXpath("//iframe", document.body).forEach(function(iframe) {
        iframe.style.visibility = "hidden";
      });
    } else {
      cmScript.enableScroll();
      window.removeEventListener("resize", cmScript.setDivsPosition, false);
      getElementByXpath("//iframe", document.body).forEach(function(iframe) {
        iframe.style.visibility = "visible";
      });
    }
  },
  buildBackground: function() {
    if(!$("ws_back")) {
      cmScript.backgroundDiv = document.createElement("div");
      cmScript.backgroundDiv.id = "ws_back";
      cmScript.backgroundDiv.addEventListener("click", function() {
        clearInterval(cmScript.timer);
        cmScript.hideConfigWindow();
      }, false);
      cssManager.addCssProperties("#ws_back{display:none;position:absolute;left:0px;top:0px;" +
        "background-color:#242424;z-index:1000;}");
      document.body.appendChild(cmScript.backgroundDiv);
    }
  },
  selectMenuItem: function(item, tableId) {
    item.className = "selected";
    var items = item.parentNode.childNodes;
    for(var i = 0; i < items.length; i++) {
      if(items[i] != item) {
        items[i].className = "";
      }
    }
    var table = $(tableId);
    table.style.display = "table";
    getElementByXpath(".//table", cmScript.configDiv).filter(function(t) {
      return t != table;
    }).forEach(function(t) {
      t.style.display = "none";
    });
  },
  refreshSmileyTemplateExemple: function() {
    $("ws_template_smiley_exemple").innerHTML = "texte" + $("ws_template_smiley_left").value.replace(/ /g, "&nbsp;") +
      "[:smiley]" + $("ws_template_smiley_right").value.replace(/ /g, "&nbsp;") + "texte";
  },
  buildConfigWindow: function() {
    if(!$("ws_front")) {
      cmScript.configDiv = document.createElement("div");
      cmScript.configDiv.id = "ws_front";
      cmScript.configDiv.style.width = "600px";
      cmScript.configDiv.style.height = "auto";
      cssManager.addCssProperties("#ws_front{display:none;vertical-align:bottom;position:absolute;" +
        "background-color:#F7F7F7;z-index:1001;border:1px dotted #000;" +
        "padding:16px;text-align:right;font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:14px;}");
      cssManager.addCssProperties("#ws_front input[type=text]{text-align:center;border:1px solid black;}");
      cssManager.addCssProperties("#ws_front div{margin:16px 0 0;}");
      cssManager.addCssProperties("#ws_front div input{float:right;margin:0 0 0 8px;}");
      cssManager.addCssProperties("#ws_front table{text-align:left;margin:16px 0 0;width:100%;" +
        "font-size:smaller;font-weight:bold;border-collapse:collapse;}");
      var menu = document.createElement("ul");
      menu.id = "ws_front_menu";
      cssManager.addCssProperties("#ws_front_menu{margin:4px 0 0;padding:0;width:100%;text-align:left;}");
      cssManager.addCssProperties("#ws_front_menu li{display:inline;list-style-type:none;padding:3px;" +
        "margin-right:8px;border:1px solid black;font-size:smaller;" +
        "background-color:#DEDFDF;cursor:pointer;}");
      cssManager.addCssProperties("#ws_front_menu li.selected{font-weight:bold;font-style:italic;}");
      cmScript.configDiv.appendChild(menu);
      var newTable = document.createElement("table");
      newTable.id = "ws_front_rc";
      newTable.style.display = "table";
      var newTr, newTd, newInput, firstShortcut = true;
      for(var id in cmScript.shortcuts) {
        newTr = document.createElement("tr");
        newTd = document.createElement("td");
        newTd.innerHTML = cmScript.shortcuts[id].left + "<span style=\"font-weight:normal;\">" +
          cmScript.shortcuts[id].sample + "</span>" + cmScript.shortcuts[id].right;
        newTr.appendChild(newTd);
        newTd = document.createElement("td");
        newTd.style.textAlign = "right";
        newInput = document.createElement("input");
        newInput.id = id;
        newInput.type = "text";
        newInput.size = "10";
        newInput.setAttribute("key", cmScript.getShortcutKey(id));
        newInput.addEventListener("keydown", function(event) {
          if(event.which != 9) {
            event.preventDefault();
          }
        }, false);
        newInput.addEventListener("keyup", function(event) {
          var key = event.which;
          if(key == 8 || key == 46 || key == 110) {
            this.value = "";
            this.setAttribute("key", "");
          } else if(key != 9 && cmScript.keysBinding[key] != undefined) {
            this.value = cmScript.keysBinding[key];
            this.setAttribute("key", key);
          } else if(key != 9) {
            event.preventDefault();
          }
        }, false);
        if(firstShortcut) {
          cmScript.disableTabUp(newInput);
          firstShortcut = false;
        }
        newTd.appendChild(newInput);
        newTr.appendChild(newTd);
        newTable.appendChild(newTr);
      }
      cmScript.configDiv.appendChild(newTable);
      var menuElt = document.createElement("li");
      menuElt.className = "selected";
      menuElt.innerHTML = "Raccourcis clavier";
      menuElt.addEventListener("click", function() {
        cmScript.selectMenuItem(this, "ws_front_rc");
      }, false);
      menu.appendChild(menuElt);
      newTable = document.createElement("table");
      newTable.id = "ws_front_ps";
      newTable.style.display = "none";
      newTr = document.createElement("tr");
      newTd = document.createElement("td");
      var helpImg = document.createElement("img");
      helpImg.src = imgHelpPngLol;
      helpImg.alt = "help";
      helpImg.title = "Caractères qui seront insérés avant et après un smiley lors d'un clic sur ce dernier";
      helpImg.style.verticalAlign = "text-bottom";
      helpImg.style.cursor = "help";
      newTd.innerHTML = "Template d'insertion du smiley ";
      newTd.appendChild(helpImg);
      newTd.rowSpan = "2";
      newTr.appendChild(newTd);
      newTd = document.createElement("td");
      newTd.style.textAlign = "right";
      newTd.style.fontWeight = "normal";
      newInput = document.createElement("input");
      newInput.id = "ws_template_smiley_left";
      newInput.type = "text";
      newInput.size = "2";
      newInput.maxLength = "5";
      newInput.addEventListener("keyup", cmScript.refreshSmileyTemplateExemple, false);
      cmScript.disableTabUp(newInput);
      newTd.appendChild(newInput);
      newTd.appendChild(document.createTextNode("[:smiley]"));
      newInput = document.createElement("input");
      newInput.id = "ws_template_smiley_right";
      newInput.type = "text";
      newInput.size = "2";
      newInput.maxLength = "5";
      newInput.addEventListener("keyup", cmScript.refreshSmileyTemplateExemple, false);
      newTd.appendChild(newInput);
      newTr.appendChild(newTd);
      newTable.appendChild(newTr);
      newTr = document.createElement("tr");
      newTd = document.createElement("td");
      newTd.id = "ws_template_smiley_exemple";
      newTd.style.textAlign = "right";
      newTd.style.fontStyle = "italic";
      newTd.style.fontWeight = "normal";
      newTr.appendChild(newTd);
      newTable.appendChild(newTr);
      cmScript.configDiv.appendChild(newTable);
      newTr = document.createElement("tr");
      newTd = document.createElement("td");
      helpImg = document.createElement("img");
      helpImg.src = imgHelpPngLol;
      helpImg.alt = "help";
      helpImg.title = "Activer en permance la zone de réponse flottante au chargement d'une page";
      helpImg.style.verticalAlign = "text-bottom";
      helpImg.style.cursor = "help";
      newTd.innerHTML = "Zone de réponse flottante permanente ? ";
      newTd.appendChild(helpImg);
      newTr.appendChild(newTd);
      newTd = document.createElement("td");
      newTd.style.textAlign = "right";
      newInput = document.createElement("input");
      newInput.id = "ws_always_not_sticky";
      newInput.type = "checkbox";
      newTd.appendChild(newInput);
      newTr.appendChild(newTd);
      newTable.appendChild(newTr);
      newTr = document.createElement("tr");
      newTd = document.createElement("td");
      helpImg = document.createElement("img");
      helpImg.src = imgHelpPngLol;
      helpImg.alt = "help";
      helpImg.title = "Activer la zone de réponse flottante par un double clic sur l'icône de multi-quotes";
      helpImg.style.verticalAlign = "text-bottom";
      helpImg.style.cursor = "help";
      newTd.innerHTML = "Zone de réponse flottante pour le multi-quotes ? ";
      newTd.appendChild(helpImg);
      newTr.appendChild(newTd);
      newTd = document.createElement("td");
      newTd.style.textAlign = "right";
      newInput = document.createElement("input");
      newInput.id = "ws_active_on_mq";
      newInput.type = "checkbox";
      newTd.appendChild(newInput);
      newTr.appendChild(newTd);
      newTable.appendChild(newTr);
      menuElt = document.createElement("li");
      menuElt.innerHTML = "Paramétrage divers";
      menuElt.addEventListener("click", function() {
        cmScript.selectMenuItem(this, "ws_front_ps");
      }, false);
      menu.appendChild(menuElt);
      var buttonsContainer = document.createElement("div");
      var inputOk = document.createElement("input");
      inputOk.type = "image";
      inputOk.src = imgOkPngLol;
      inputOk.title = "Valider";
      inputOk.addEventListener("click", cmScript.validateConfig, false);
      var inputCancel = document.createElement("input");
      inputCancel.type = "image";
      inputCancel.src = imgCancelPngLol;
      inputCancel.title = "Annuler";
      inputCancel.addEventListener("click", cmScript.hideConfigWindow, false);
      cmScript.disableTabDown(inputCancel);
      buttonsContainer.appendChild(inputCancel);
      buttonsContainer.appendChild(inputOk);
      cmScript.configDiv.appendChild(buttonsContainer);
      document.body.appendChild(cmScript.configDiv);
    }
  },
  validateConfig: function() {
    getElementByXpath(".//table[contains(@style, \"table\")]//input[starts-with(@id, \"ws_\")]",
      $("ws_front")).forEach(function(input) {
      var value = null;
      if(input.getAttribute("key")) {
        value = input.getAttribute("key");
      } else if(input.type == "checkbox") {
        value = input.checked;
      } else {
        value = input.value;
      }
      GM_setValue(input.id, value);
    });
    cmScript.hideConfigWindow();
  },
  initBackAndFront: function() {
    if($("ws_back")) {
      cmScript.setBackgroundPosition();
      cmScript.backgroundDiv.style.opacity = 0;
      cmScript.backgroundDiv.style.display = "block";
    }
    if($("ws_front")) {
      for(var id in cmScript.shortcuts) {
        if(cmScript.getShortcutKey(id) != "") {
          $(id).value = cmScript.keysBinding[cmScript.getShortcutKey(id)];
        }
      }
      $("ws_template_smiley_left").value = cmScript.templateSmileyLeft;
      $("ws_template_smiley_right").value = cmScript.templateSmileyRight;
      $("ws_always_not_sticky").checked = cmScript.alwaysNotSticky == true;
      $("ws_active_on_mq").checked = cmScript.activeOnMq == true;
      cmScript.refreshSmileyTemplateExemple();
    }
  },
  showConfigWindow: function() {
    cmScript.alterWindow(true);
    cmScript.initBackAndFront();
    var opacity = 0;
    cmScript.timer = setInterval(function() {
      opacity = Math.round((opacity + 0.1) * 100) / 100;
      cmScript.backgroundDiv.style.opacity = opacity;
      if(opacity >= 0.8) {
        clearInterval(cmScript.timer);
        cmScript.configDiv.style.display = "block";
        cmScript.setConfigWindowPosition();
      }
    }, 1);
  },
  hideConfigWindow: function() {
    cmScript.configDiv.style.display = "none";
    var opacity = cmScript.backgroundDiv.style.opacity;
    cmScript.timer = setInterval(function() {
      opacity = Math.round((opacity - 0.1) * 100) / 100;
      cmScript.backgroundDiv.style.opacity = opacity;
      if(opacity <= 0) {
        clearInterval(cmScript.timer);
        cmScript.backgroundDiv.style.display = "none";
        cmScript.alterWindow(false);
      }
    }, 1);
  },
  setUp: function() {
    cmScript.buildBackground();
    cmScript.buildConfigWindow();
    cssManager.insertStyle();
  },
  createConfigMenu: function() {
    GM_registerMenuCommand("[HFR] wiki smileys et raccourcis -> configuration",
      this.showConfigWindow);
  }
};

cmScript.setUp();
cmScript.createConfigMenu();

var getKeyWords = function(code, cbf) {
  toyoAjaxLib.loadDoc("https://forum.hardware.fr/wikismilies.php", "get",
    "config=hfr.inc&detail=" + encodeURIComponent(code),
    function(pageContent) {
      var keyWords = pageContent.match(/name="keywords0"\s*value="(.*)"\s*onkeyup/).pop();
      cbf(keyWords);
    });
}

if($("content_form")) {
  $("content_form").style.marginTop = "2px";
  $("content_form").style.marginBottom = "2px";
  var addCommentMessage = document.getElementById("addCommentMessage");
  var newDiv = document.createElement("div");
  newDiv.setAttribute("style", "display:inline;");
  newDiv.innerHTML = " <input id=\"search_smilies_pouet\" type=\"text\" style=\"height:16px;width:100px;\" " +
    "accesskey=\"q\" autocomplete=\"off\" />";
  if(addCommentMessage) {
    // suppression des br en trop
    let l_brs = document.querySelectorAll("tr.reponse > td.repCase2 div.spacer + br, " +
      "tr.reponse > th.repCase1 > br");
    for(let l_br of l_brs) {
      l_br.parentNode.removeChild(l_br);
    }
    // ajout de br mieux placés
    let l_new_br = document.querySelector("tr.reponse > th.repCase1 > div:first-of-type > " +
      "div.center:first-child > br:first-child");
    if(!l_new_br) {
      var l_div_smiley = document.querySelector("tr.reponse > th.repCase1 > div:first-of-type > " +
        "div.center:first-child > div.smiley");
      if(l_div_smiley) {
        l_div_smiley.parentNode.removeChild(l_div_smiley.previousSibling);
        l_div_smiley.parentNode.removeChild(l_div_smiley.previousElementSibling);
        l_div_smiley.parentNode.insertBefore(document.createElement("br"), l_div_smiley.previousElementSibling);
        l_div_smiley.parentNode.insertBefore(document.createElement("br"), l_div_smiley);
        l_div_smiley.parentNode.insertBefore(document.createElement("br"), l_div_smiley);
      }
    }
    var style = document.createElement("style");
    document.head.appendChild(style);
    style.sheet.insertRule("div.smiley img{margin:0 !important;padding:2px !important;" +
      "vertical-align:middle !important;}", 0);
    style.sheet.insertRule("div#dynamic_smilies img{margin:0 !important;padding:4px 2px 0 2px !important;" +
      "vertical-align:middle !important;}", 0);
    style.sheet.insertRule("div.smiley{width:147px !important;}", 0);
    style.sheet.insertRule("div#dynamic_smilies{font-weight:normal !important;}", 0);
    style.sheet.insertRule("div#dynamic_smilies a.s1Topic{font-weight:bold !important;}", 0);
    var helpGenDiv = document.createElement("div");
    helpGenDiv.setAttribute("style", "display:inline;");
    helpGenDiv.appendChild(document.createTextNode(" "));
    $("content_form").parentNode.insertBefore(newDiv, addCommentMessage);
    $("content_form").parentNode.insertBefore(helpGenDiv, addCommentMessage);
    $("content_form").style.marginTop = "0";
    $("content_form").style.width = "calc(100% - 6px)";
    $("content_form").style.resize = "vertical";
    $("content_form").parentNode.style.fontSize = "small";
  } else {
    var br1 = document.createElement("br");
    document.getElementById("md_arbo_bottom").parentNode
      .insertBefore(br1, document.getElementById("md_arbo_bottom").nextElementSibling.nextElementSibling);
    $("content_form").parentNode.appendChild(newDiv);
  }
  newDiv = document.createElement("div");
  newDiv.id = "dynamic_smilies_pouet";
  newDiv.setAttribute("style", "text-align:center;");
  if(addCommentMessage) {
    newDiv.setAttribute("class", "reponse");
  }
  $("content_form").parentNode.appendChild(newDiv);

  function putSmiley(code, textAreaId) {
    insertBBCode(textAreaId, cmScript.templateSmileyLeft + code + cmScript.templateSmileyRight, "");
  }
  var insertBBCode = function(textAreaId, left, right, offset = 0) {
    var content = $(textAreaId);
    if(content.selectionStart || content.selectionStart == 0) {
      if(content.selectionEnd > content.value.length) {
        content.selectionEnd = content.value.length;
      }
      var firstPos = content.selectionStart;
      var secondPos = content.selectionEnd + left.length;
      var contenuScrollTop = content.scrollTop;
      content.value = content.value.slice(0, firstPos) + left + content.value.slice(firstPos);
      content.value = content.value.slice(0, secondPos) + right + content.value.slice(secondPos);
      content.selectionStart = firstPos + left.length;
      content.selectionEnd = secondPos;
      if(offset !== 0) {
        content.selectionStart = content.selectionStart + offset;
        content.selectionEnd = content.selectionStart;
      }
      content.focus();
      content.scrollTop = contenuScrollTop;
    }
  }
  var proceedShortcut = function(event, textAreaId) {
    var key = event.keyCode ? event.keyCode : event.which;
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_spoiler")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[spoiler]", "[/spoiler]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_b")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[b]", "[/b]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_i")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[i]", "[/i]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_u")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[u]", "[/u]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_img")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[img]", "[/img]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_img_rehost")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[img]https://reho.st/", "[/img]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_quote")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[quote]", "[/quote]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_url")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[url=]", "[/url]", -1);
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_code")) {
      event.preventDefault();
      var language = window.prompt("Entrez le nom du langage :");
      insertBBCode(textAreaId, language == null || language == "" ? "[code]" : "[code=" + language + "]", "[/code]")
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_fixed")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[fixed]", "[/fixed]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_strike")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[strike]", "[/strike]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_puce")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[*]", "");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_smiley")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[:", "]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_color_red")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[#ff0000]", "[/#ff0000]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_color_blue")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[#0000ff]", "[/#0000ff]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_color_yellow")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[#ffff00]", "[/#ffff00]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_color_green")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[#00ff00]", "[/#00ff00]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_color_orange")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[#ff7f00]", "[/#ff7f00]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_color_purple")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[#bf00ff]", "[/#bf00ff]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_alerte")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[img]http://hfr.toyonos.info/generateurs/alerte/?smiley&t=", "[/img]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_nazi")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[img]http://hfr.toyonos.info/generateurs/nazi/?t=", "[/img]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_fb")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[img]http://hfr.toyonos.info/generateurs/fb/?t=", "[/img]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_seagal")) {
      event.preventDefault();
      insertBBCode(textAreaId, "[img]http://hfr.toyonos.info/generateurs/StevenSeagal/?t=", "[/img]");
    }
    if(((event.altKey && event.ctrlKey) || event.getModifierState("AltGraph")) && key == cmScript.getShortcutKey("ws_bulle")) {
      event.preventDefault();
      var url = "http://hfr.toyonos.info/generateurs/bulle/?t=";
      var text = window.prompt("Entrez le contenu de la bulle :");
      url += text;
      var smiley = window.prompt("Entrez le code du smiley si nécessaire :");
      if(smiley != null && smiley != "") {
        url += "&s=" + smiley;
        var rang = window.prompt("Quel est son rang ?", "0");
        if(rang != null && rang != "" && rang != "0") {
          url += "&r=" + rang;
        }
      } else {
        var delta = window.prompt("Décalage du smiley (en pixels) :");
        if(delta != null && delta != "") {
          url += "&d=" + delta;
        }
      }
      insertBBCode(textAreaId, "[img]" + url, "[/img]");
    }
  }
  var findSmilies = function(inputId, targetId) {
    var hashCheck = getElementByXpath("//input[@name=\"hash_check\"]", document).pop().value;
    var searchkeyword = $(inputId).value;
    var divsmilies = $(targetId);
    if(searchkeyword.length > 2 && (searchkeyword !== findSmiliesBuffer || inputId !== lastSearchId)) {
      divsmilies.innerHTML = "<img style=\"padding-top:4px;\" class=\"ws_toyo_smilies\" " +
        "src=\"https://forum-images.hardware.fr/icones/mm/wait.gif\" alt=\"\" />";
      document.documentElement.scrollTop += divsmilies.clientHeight;
      lastSearchId = inputId;
      findSmiliesBuffer = searchkeyword;
      toyoAjaxLib.loadDoc("https://forum.hardware.fr/message-smi-mp-aj.php", "get",
        "config=hfr.inc&findsmilies=" + encodeURIComponent(searchkeyword),
        function(reponse) {
          if(reponse.indexOf("<") === -1) {
            divsmilies.innerHTML = "<div style=\"margin-top:4px;\">" + reponse + "</div>";
          } else {
            divsmilies.innerHTML = reponse;
          }
          document.documentElement.scrollTop += divsmilies.clientHeight;
          getElementByXpath(".//img", divsmilies).forEach(function(img) {
            var smileyCode = img.title;
            img.removeAttribute("onclick");
            img.style.padding = "4px 2px 0 2px";
            img.style.verticalAlign = "middle";
            img.setAttribute("class", "ws_toyo_smilies");
            img.addEventListener("mouseover", function() {
              var currentImg = this;
              if(currentImg.title.indexOf(" { ") === -1) {
                clearTimeout(keywordsTitleTimeout);
                keywordsTitleTimeout = window.setTimeout(function() {
                  getKeyWords(currentImg.alt, function(keyWords) {
                    currentImg.title = currentImg.alt + " { " + keyWords + " }";
                  });
                }, 250);
              }
            }, false);
            var timer;
            var firstClickTime = null;
            var delay = 300;
            img.addEventListener("click", function(event) {
              if(firstClickTime != null && new Date().getTime() - firstClickTime < delay) {
                clearTimeout(timer);
                firstClickTime = null;
                var theEvent = event;
                var theImg = this;
                getKeyWords(this.alt, function(keyWords) {
                  var newDiv;
                  var width = 300;
                  if($("edit_wiki_smilies")) {
                    newDiv = $("edit_wiki_smilies");
                  } else {
                    newDiv = document.createElement("div");
                    newDiv.setAttribute("id", "edit_wiki_smilies");
                    newDiv.style.position = "absolute";
                    newDiv.style.border = "1px solid black";
                    newDiv.style.background = "white";
                    newDiv.style.zIndex = "1001";
                    newDiv.className = "signature";
                    newDiv.style.textAlign = "right";
                    newDiv.style.width = (width + 14) + "px";
                    newDiv.style.paddingBottom = "5px";
                    var inputKeyWords = document.createElement("input");
                    inputKeyWords.type = "text";
                    inputKeyWords.style.display = "block";
                    inputKeyWords.style.margin = "5px";
                    inputKeyWords.style.fontSize = "1.1em";
                    inputKeyWords.style.width = width + "px";
                    var inputOk = document.createElement("input");
                    inputOk.type = "image";
                    inputOk.src = imgOkPngLol;
                    inputOk.alt = "valider";
                    inputOk.style.marginRight = "6px";
                    inputOk.addEventListener("click", function() {
                      var smiley = this.parentNode.lastChild.value;
                      var keyWords = this.parentNode.firstChild.value;
                      var url = "https://forum.hardware.fr/wikismilies.php?config=hfr.inc&option_wiki=0&withouttag=0";
                      var arguments = "modif0=1&smiley0=" + encodeURIComponent(smiley) +
                        "&keywords0=" + encodeURIComponent(keyWords);
                      arguments += "&hash_check=" + hashCheck;
                      toyoAjaxLib.loadDoc(url, "post", arguments, function(pageContent) {
                        var newP = document.createElement("p");
                        newP.style.fontSize = "0.85em";
                        newP.style.paddingLeft = newP.style.paddingRight = "5px";
                        newP.style.margin = "0px";
                        newP.innerHTML = "done!";
                        newDiv.insertBefore(newP, inputOk);
                        newP.nextSibling.style.display = "none";
                        newP.nextSibling.nextSibling.style.display = "none";
                        newDiv.style.textAlign = "justify";
                        setTimeout(function() {
                          newDiv.style.display = "none";
                          newDiv.style.textAlign = "right";
                          newP.nextSibling.style.display = "inline";
                          newP.nextSibling.nextSibling.style.display = "inline";
                          newDiv.removeChild(newP);
                        }, 1000);
                      });
                    }, false);
                    var inputCancel = document.createElement("input");
                    inputCancel.type = "image";
                    inputCancel.src = imgCancelPngLol;
                    inputCancel.alt = "annuler";
                    inputCancel.style.marginRight = "5px";
                    inputCancel.addEventListener("click", function() {
                      newDiv.style.display = "none";
                    }, false);
                    var inputHidden = document.createElement("input");
                    inputHidden.type = "hidden";
                    inputHidden.name = "code_smiley";
                    newDiv.appendChild(inputKeyWords);
                    newDiv.appendChild(inputOk);
                    newDiv.appendChild(inputCancel);
                    newDiv.appendChild(inputHidden);
                    root.appendChild(newDiv);
                  }
                  newDiv.style.display = "block";
                  if(theEvent.clientX + 8 + newDiv.offsetWidth >= document.documentElement.clientWidth) {
                    newDiv.style.left = "";
                    newDiv.style.right = (document.documentElement.clientWidth - theEvent.clientX + 8) + "px";
                  } else {
                    newDiv.style.left = (theEvent.clientX + 8) + "px";
                    newDiv.style.right = "";
                  }
                  if(window.scrollY + theEvent.clientY + 8 + newDiv.offsetHeight >= document.documentElement.offsetHeight) {
                    newDiv.style.top = (window.scrollY + theEvent.clientY - 8 - newDiv.offsetHeight) + "px";
                  } else {
                    newDiv.style.top = (window.scrollY + theEvent.clientY + 8) + "px";
                  }
                  newDiv.firstChild.value = keyWords;
                  newDiv.lastChild.value = theImg.alt;
                });
              } else {
                firstClickTime = new Date().getTime();
                timer = setTimeout(function() {
                  putSmiley(smileyCode, divsmilies.parentNode.getElementsByTagName("textarea")[0].id);
                  divsmilies.parentNode.getElementsByTagName("textarea")[0].focus();
                }, delay);
              }
            }, false);
          });
        });
    }
  }
  var firstClickTime;
  var ctrl = 0;
  var currentTextarea = null;
  var lastSearchId = "";
  var findSmiliesBuffer = "";
  var hideSmileysList = function() {
    if($("smilies_helper")) {
      $("smilies_helper").style.display = "none";
    }
  }
  var insertSmiley = function(repRapId) {
    var ta;
    if(repRapId) {
      ta = $(repRapId);
    } else {
      ta = $("content_form");
    }
    var taScrollTop = ta.scrollTop;
    var pos1;
    var pos2 = 0;
    while(pos2 < ta.selectionStart && pos2 != -1) {
      pos1 = pos2 + 1;
      pos2 = ta.value.indexOf("[:", pos1);
    }
    pos1--;
    var pattern = ta.value.substr(pos1 + 2, ta.selectionStart - pos1 - 2);
    ta.value = ta.value.slice(0, pos1 + 2) + $("smilies_helper").firstChild.value + "]" +
      ta.value.slice(pos1 + 2 + pattern.length);
    ta.focus();
    ta.scrollTop = taScrollTop;
    ta.selectionStart = ta.selectionEnd = pos1 + 3 + $("smilies_helper").firstChild.value.length;
  }
  var generatePreview = function() {
    if(!$("smilies_helper") || $("smilies_helper").style.display == "none") {
      return;
    }
    var smileyTab = $("smilies_helper").firstChild.value.split(":");
    var code = smileyTab[0];
    var rang = smileyTab.length > 1 ? smileyTab[1] : null;
    var url = "https://forum-images.hardware.fr/images/perso/";
    if(rang != null) {
      url += rang + "/";
    }
    url += code + ".gif";
    var preview;
    var container = $("smilies_helper");
    if(container.lastChild.nodeName.toLowerCase() == "img") {
      preview = container.lastChild;
    } else {
      preview = document.createElement("img");
      preview.style.border = "1px solid black";
      preview.style.opacity = "0.9";
      preview.style.backgroundColor = "white";
      preview.style.padding = "15px";
      preview.style.position = "absolute";
      container.appendChild(preview);
    }
    preview.alt = "[:" + this.value + "]";
    preview.src = url;
    preview.style.top = (container.clientHeight / 2 - preview.height / 2 - parseInt(preview.style.padding)) + "px";
    preview.style.left = (container.clientWidth + 15) + "px";
  }

  function pouetKeyDown(event) {
    if(!$("smilies_helper") || $("smilies_helper").style.display == "none") {
      return;
    }
    var key = event.which;
    if(key == 38 || key == 40 || key == 13 || key == 9 || (event.shiftKey && key == 9)) {
      event.preventDefault();
    }
  }
  var timer = null;

  function pouetKeyUp(event, repRapId) {
    var ta;
    if(repRapId) {
      ta = $(repRapId);
    } else {
      ta = $("content_form");
    }
    var key = event.which;
    if($("smilies_helper") && $("smilies_helper").style.display == "block") {
      var select = $("smilies_helper").firstChild;
      if(key == 27) {
        hideSmileysList();
      } else if(key == 40 || key == 9) {
        select.focus();
        select.selectedIndex = 0;
        generatePreview();
      } else if(key == 38) {
        select.focus();
        select.selectedIndex = select.childNodes.length - 1;
        generatePreview();
      } else if(key == 13) {
        if(select.childNodes.length == 1) {
          select.selectedIndex = 0;
          insertSmiley(repRapId);
        } else {
          insertBBCode("content_form", "\n", "");
        }
        hideSmileysList();
      }
    }
    if(key != 27 && key != 9 && key != 16 &&
      (!$("smilies_helper") || $("smilies_helper").style.display == "none" || (key != 38 && key != 40 && key != 13))) {
      var text = ta.value.substr(0, ta.selectionStart);
      var wraps = text.split("\n");
      var newSpan = document.createElement("span");
      document.body.appendChild(newSpan);
      newSpan.style.border = 0;
      newSpan.style.margin = 0;
      newSpan.style.padding = 0;
      newSpan.style.height = "1em";
      newSpan.style.width = "auto";
      newSpan.style.whiteSpace = "nowrap";
      newSpan.style.overflow = "scroll";
      newSpan.style.fontSize = "small";
      newSpan.style.fontFamily = "Verdana, Arial, Sans-serif, Helvetica";
      newSpan.innerHTML = wraps[wraps.length - 1].replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var lineNumber = Math.floor(parseInt(newSpan.offsetWidth) / parseInt(ta.offsetWidth));
      var textWidth = (parseInt(newSpan.offsetWidth) + lineNumber * 40) % parseInt(ta.offsetWidth);
      var textHeight = 0;
      for(var i = 0; i < wraps.length; i++) {
        newSpan.innerHTML = wraps[i].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if(newSpan.innerHTML == "") {
          newSpan.innerHTML = "a";
        }
        lineNumber = Math.floor(parseInt(newSpan.offsetWidth) / parseInt(ta.offsetWidth)) + 1;
        textHeight += lineNumber * newSpan.offsetHeight;
      }
      document.body.removeChild(newSpan);
      var newDiv;
      if($("smilies_helper")) {
        newDiv = $("smilies_helper");
      } else {
        newDiv = document.createElement("div");
        newDiv.id = "smilies_helper";
        newDiv.style.position = "absolute";
        document.body.appendChild(newDiv);
      }
      newDiv.style.display = "none";
      var top = getOffset(ta).top + textHeight + 3 - ta.scrollTop;
      var left = getOffset(ta).left + textWidth + 5;
      if(repRapId === null) {
        var zone = $("content_form").parentNode;
        newDiv.style.position = zone.className.indexOf("zoneRepFlot") != -1 ? "fixed" : "absolute";
      }
      text = wraps[wraps.length - 1];
      var pos1 = text.lastIndexOf("[:");
      var pos2 = text.lastIndexOf("]");
      var pattern = text.substr(pos1 + 2);
      if(timer) {
        clearTimeout(timer);
      }
      if(pos1 != -1 && (pos2 == -1 || pos2 < pos1) && ta.selectionStart == ta.selectionEnd && pattern.length >= 2) {
        timer = setTimeout(function() {
          GM_xmlhttpRequest({
            method: "GET",
            url: "http://hfr-mirror.toyonos.info/smileys/getByName.php5?pattern=" + pattern,
            onload: function(response) {
              newDiv.innerHTML = "";
              var smilies = response.responseText.trim();
              if(smilies != "" && $("search_smilies_pouet").parentNode.style.display != "block") {
                var select = document.createElement("select");
                select.style.border = "1px solid #000";
                select.style.fontStyle = "italic";
                select.style.opacity = "0.9";
                select.style.fontFamily = "\"trebuchet ms\", trebuchet, arial, sans-serif";
                select.style.fontSize = "0.8em";
                var nb = smilies.split(";").length;
                if(nb == 1) {
                  nb++;
                }
                if(nb > 10) {
                  nb = 10;
                }
                select.size = nb;
                var selectSmiley = function(event) {
                  var key = event.which;
                  if(key == 27) {
                    hideSmileysList();
                    ta.focus();
                  } else if(key == 13 || key == 1 || key == null) {
                    insertSmiley(repRapId);
                    hideSmileysList();
                  }
                }
                select.addEventListener("click", function(event) {
                  selectSmiley(event);
                }, false);
                select.addEventListener("keyup", function(event) {
                  selectSmiley(event);
                }, false);
                select.addEventListener("keydown", function(event) {
                  if(event.which == 9) {
                    event.preventDefault();
                    ta.focus();
                  }
                }, false);
                select.addEventListener("blur", hideSmileysList, false);
                select.addEventListener("change", generatePreview, false);
                smilies.split(";").forEach(function(smiley) {
                  if(smiley != "") {
                    var opt = document.createElement("option");
                    opt.innerHTML = smiley;
                    select.appendChild(opt);
                  }
                });
                newDiv.appendChild(select);
                newDiv.style.top = top + "px";
                newDiv.style.left = left + "px";
                newDiv.style.display = "block";
              }
            }
          });
        }, 250);
      }
    }
  }
  $("content_form").addEventListener("keydown", function(event) {
    proceedShortcut(event, "content_form");
  }, false);
  $("content_form").addEventListener("keydown", function(event) {
    pouetKeyDown(event);
  }, false);
  $("content_form").addEventListener("keyup", function(event) {
    pouetKeyUp(event, null);
  }, false);
  var root = $("mesdiscussions");
  getElementByXpath(".//table//tr[starts-with(@class, \"message\")]//div[@class=\"left\"]" +
      "//a[starts-with(@href, \"/message.php\")]//img[@alt=\"Edition rapide\"]", root)
    .forEach(function(img) {
      var onclickCommand = img.parentNode.getAttribute("onclick");
      var numreponse = onclickCommand.match(/edit_in\('.*','.*',[0-9]+,([0-9]+),''\)/).pop();
      img.parentNode.addEventListener("click", function() {
        if($("rep_editin_" + numreponse)) {
          $("rep_editin_" + numreponse).id = "";
        }
        var timer = setInterval(function() {
          if($("rep_editin_" + numreponse)) {
            clearInterval(timer);
            $("rep_editin_" + numreponse).style.marginTop = "0";
            $("rep_editin_" + numreponse).style.marginBottom = "2px";
            var newDiv = document.createElement("div");
            newDiv.setAttribute("style", "display:inline;");
            newDiv.innerHTML = " <input id=\"search_smilies_edit_" + numreponse +
              "\" type=\"text\" style=\"height:16px;width:100px;\" accesskey=\"q\" />"
            $("rep_editin_" + numreponse).nextSibling.appendChild(newDiv);
            var helpGenDivRapide = document.createElement("div");
            helpGenDivRapide.id = "helpGenDivRapide_" + numreponse;
            helpGenDivRapide.setAttribute("style", "display:inline;");
            helpGenDivRapide.appendChild(document.createTextNode(" "));
            $("rep_editin_" + numreponse).nextSibling.appendChild(helpGenDivRapide);
            helpGen(numreponse);
            newDiv = document.createElement("div");
            newDiv.id = "dynamic_smilies_edit_" + numreponse;
            newDiv.style.textAlign = "center";
            $("rep_editin_" + numreponse).parentNode.appendChild(newDiv);
            $("search_smilies_edit_" + numreponse).addEventListener("keyup", function() {
              clearTimeout(inputSearchTimeout);
              inputSearchTimeout = window.setTimeout(function(numreponse) {
                findSmilies("search_smilies_edit_" + numreponse, "dynamic_smilies_edit_" + numreponse);
              }, 500, numreponse);
            }, false);
            $("rep_editin_" + numreponse).addEventListener("keydown", function(event) {
              proceedShortcut(event, "rep_editin_" + numreponse);
            }, false);
            $("rep_editin_" + numreponse).addEventListener("keydown", function(event) {
              pouetKeyDown(event);
            }, false);
            $("rep_editin_" + numreponse).addEventListener("keyup", function(event) {
              pouetKeyUp(event, "rep_editin_" + numreponse);
            }, false);
          }
        }, 50);
      }, false);
    });
  $("search_smilies_pouet").addEventListener("keyup", function() {
    clearTimeout(inputSearchTimeout);
    inputSearchTimeout = window.setTimeout(function() {
      findSmilies("search_smilies_pouet", "dynamic_smilies_pouet");
    }, 500);
  }, false);

  function helpGen(num) {
    var helpImg = document.createElement("img");
    helpImg.src = imgHelpPngLol;
    helpImg.alt = "help";
    helpImg.style.cursor = "help";
    helpImg.style.verticalAlign = "text-bottom";
    helpImg.style.marginRight = "4px";
    helpImg.setAttribute("class", "ws_toyo_help_icon");
    helpImg.setAttribute("title", "double-cliquez pour ouvrir\nla fenêtre de configuration");
    if(addCommentMessage) {
      helpImg.style.verticalAlign = "-3px";
      helpGenDiv.appendChild(helpImg);
    } else if(num) {
      $("helpGenDivRapide_" + num).appendChild(helpImg);
    } else {
      $("content_form").parentNode.insertBefore(helpImg, $("content_form")
        .parentNode.querySelector("b:first-of-type").nextSibling.nextSibling);
    }
    helpImg.addEventListener("mouseover", function(event) {
      var helpDiv;
      if($("ws_help_shortcuts")) {
        helpDiv = $("ws_help_shortcuts");
      } else {
        helpDiv = document.createElement("div");
        helpDiv.setAttribute("id", "ws_help_shortcuts");
        helpDiv.className = "signature";
        var newTable = document.createElement("table");
        for(var id in cmScript.shortcuts) {
          var newTr = document.createElement("tr");
          var newTd = document.createElement("td");
          newTd.className = "ws_hs_left";
          newTd.innerHTML = cmScript.shortcuts[id].left + "<span>" + cmScript.shortcuts[id].sample + "</span>" +
            cmScript.shortcuts[id].right;
          newTr.appendChild(newTd);
          newTd = document.createElement("td");
          newTd.className = "ws_hs_right";
          newTd.innerHTML = "Ctrl-Alt-<span>" + cmScript.keysBinding[cmScript.getShortcutKey(id)] + "</span>";
          newTr.appendChild(newTd);
          newTable.appendChild(newTr);
        }
        helpDiv.appendChild(newTable);
        root.appendChild(helpDiv);
        cssManager.addCssProperties("#ws_help_shortcuts{position:absolute;border:1px solid black;" +
          "background-color:white;padding:3px;z-index:1001;}");
        cssManager.addCssProperties("#ws_help_shortcuts table,#ws_help_shortcuts td{border:0;}");
        cssManager.addCssProperties("#ws_help_shortcuts td{padding:2px;}");
        cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_left{font-weight:bold;white-space:nowrap;" +
          "text-align:left;padding-right:25px;}");
        cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_left span{font-weight:normal;}");
        cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_right{text-align:right;}");
        cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_right span{color:red;white-space:nowrap;" +
          "font-weight:bold;text-transform:uppercase;}");
        cssManager.insertStyle();
        helpDiv.setAttribute("lolWidth", helpDiv.scrollWidth);
      }
      var lolWidth = parseInt(helpDiv.getAttribute("lolWidth"));
      helpDiv.style.left = Math.min(window.innerWidth - lolWidth - 20, event.clientX - 100 - 20) + "px";
      helpDiv.style.display = "block";
      helpDiv.style.top = (window.scrollY + event.clientY - 20 - helpDiv.clientHeight) + "px";
    }, false);
    helpImg.addEventListener("mouseout", function(event) {
      if($("ws_help_shortcuts")) {
        $("ws_help_shortcuts").style.display = "none";
      }
    }, false);
    helpImg.addEventListener("click", function(event) {
      var clickTime = new Date().getTime();
      if(clickTime - lastClickTime <= doubleClickInterval) {
        cmScript.showConfigWindow();
      }
      lastClickTime = clickTime;
    }, false);
    var newA = document.createElement("a");
    newA.href = "http://hfr.toyonos.info/generateurs/";
    newA.target = "_blank";
    newA.className = "s1Ext";
    newA.innerHTML = "Générateurs";
    if(addCommentMessage) {
      helpGenDiv.appendChild(newA);
    } else if(num) {
      $("helpGenDivRapide_" + num).appendChild(newA);
    } else {
      $("content_form").parentNode.insertBefore(newA, $("content_form").parentNode
        .querySelector("b:first-of-type").nextSibling.nextSibling.nextSibling);
    }
  }
  helpGen(null);
  if(addCommentMessage === null) {
    var zone = $("content_form").parentNode;
    var baseClassName = zone.className;
    if(document.getElementById("navtablelaureka")) {
      var navtablespaceheight = 4 + document.getElementById("navtablelaureka").offsetHeight;
      cssManager.addCssProperties(".zoneRepFlot{position:fixed;left:10%;right:10%;bottom:" + navtablespaceheight +
        "px;background-color:#fff;border:1px dashed #000;padding:5px;max-height:50%;overflow:auto;opacity:0.95;}");
    } else {
      cssManager.addCssProperties(".zoneRepFlot{position:fixed;left:10%;right:10%;bottom:20px;" +
        "background-color:#fff;border:1px dashed #000;padding:5px;max-height:50%;" +
        "overflow:auto;opacity:0.95;}");
    }
    cssManager.insertStyle();
    var dummyDiv = document.createElement("div");
    dummyDiv.style.opacity = "0";
    dummyDiv.style.display = "none";
    zone.parentNode.insertBefore(dummyDiv, zone);
    var observer = new MutationObserver(function(mutations, observer) {
      if(document.getElementById("navtablelaureka")) {
        dummyDiv.style.height = zone.offsetHeight + "px";
      } else {
        dummyDiv.style.height = zone.offsetHeight + 12 + "px";
      }
    });
    observer.observe(zone, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
    var dummyDiv2 = document.createElement("div");
    dummyDiv2.style.opacity = "0";
    dummyDiv2.style.display = "none";
    dummyDiv2.style.height = "5px";
    dummyDiv2.style.width = "1px";
    dummyDiv2.style.position = "absolute";
    zone.appendChild(dummyDiv2);
    var updatePin = function(pinImg, pinOn) {
      pinImg.src = pinOn ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAANBAMAAABvB5JxAAAAElBMVEUACQCAgACGhobAwMD%2F%2B%2FD%2F%2F%2F%2FkWO99AAAAAXRSTlMAQObYZgAAAFBJREFUeNo1jNEJgDAQQ2MnuJb2%2F%2B7AAcQJVDJA6e0%2Fi61gPvJ4EAL8sayzU2NZQl6KrUQMgd3kI6g9ogt2NpqixpHnsvH0CRu%2BkIqbfl8OvKo4CbA4p1NwAAAAAElFTkSuQmCC" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAANBAMAAABvB5JxAAAAFVBMVEVvcm0AAACAgACAgIDAwMD%2F%2B%2FD%2F%2F%2F8Lxa3yAAAAAXRSTlMAQObYZgAAAFFJREFUeNoVzNENgCAQA9AqGzjCEfkmXHQAWMHcAGj3X8HSn%2BZ9tACSZSiNswonKdod0YWL7NijRBgSJ98sPWYVO7%2FRKlIZrsLhrtnmlhfWH359iw0e%2B5YI1wAAAABJRU5ErkJggg%3D%3D";
      pinImg.title = pinOn ? "La zone de réponse est fixée" : "La zone de réponse est flottante";
      pinImg.alt = pinOn ? "zone_fixe" : "zone_flottante";
    }
    var pinIt = function(pinImg, pinOn) {
      dummyDiv.style.display = pinOn ? "none" : "block";
      dummyDiv2.style.display = pinOn ? "none" : "block";
      zone.className = pinOn ? baseClassName : baseClassName + " zoneRepFlot";
      updatePin(pinImg, pinOn);
      if($("smilies_helper")) {
        $("smilies_helper").style.display = "none";
      }
      if(!pinOn) {
        $("content_form").focus();
      }
    }
    var fade = function(zone, out, cbf) {
      var opacity = out ? parseInt(zone.style.opacity) : 0;
      var step = out ? -0.1 : 0.1;
      var timer = setInterval(function() {
        opacity = Math.round((opacity + step) * 100) / 100;
        zone.style.opacity = opacity;
        if(opacity >= 1 || opacity <= 0) {
          clearInterval(timer);
          if(cbf) {
            zone.style.opacity = 1;
            cbf();
          }
        }
      }, 10);
    }
    var fadeTimer = null;
    var newA = document.createElement("a");
    newA.setAttribute("accesskey", "p");
    newA.style.marginRight = "5px";
    newA.style.cursor = "pointer";
    newA.addEventListener("click", function() {
      var pinImg = this.firstChild;
      var fnct = function() {
        pinIt(pinImg, zone.className.indexOf("zoneRepFlot") != -1);
      };
      if(zone.className.indexOf("zoneRepFlot") != -1) {
        fnct();
      } else {
        fnct();
      }
    }, false);
    var pin = document.createElement("img");
    newA.appendChild(pin);
    $("content_form").parentNode.insertBefore(newA, $("content_form").parentNode.firstChild);
    if(cmScript.activeOnMq) {
      getElementByXpath("//table//tr[starts-with(@class, \"message\")]//a[starts-with(@href, \"/message.php\" )]", root)
        .filter(function(link) {
          return link.firstChild.alt == "answer +";
        }).forEach(function(link) {
          var timerClick;
          var firstClickTime = null;
          var delay = 300;
          link.addEventListener("click", function(event) {
            if(firstClickTime != null && new Date().getTime() - firstClickTime < delay) {
              clearTimeout(timerClick);
              firstClickTime = null;
              pinIt(pin, false);
            } else {
              firstClickTime = new Date().getTime();
            }
          }, false);
        });
    }
    pinIt(pin, !cmScript.alwaysNotSticky);
  }
}

var toyoAjaxLib = (function() {
  function loadPage(url, method, arguments, responseHandler) {
    var req;
    method = method.toUpperCase();
    if(method == "GET" && arguments != null) {
      url += "?" + arguments;
    }
    req = new XMLHttpRequest();
    req.onreadystatechange = processReqChange(req, responseHandler);
    req.open(method, url, true);
    if(method == "POST") {
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    arguments = method == "POST" ? arguments : null;
    req.send(arguments);
  }

  function processReqChange(req, responseHandler) {
    return function() {
      try {
        if(req.readyState == 4) {
          if(req.status == 200) {
            var content = req.responseXML != null && req.responseXML.documentElement != null ?
              req.responseXML.documentElement : req.responseText;
            if(responseHandler != null) {
              responseHandler(content);
            }
          } else {}
        }
      } catch (e) {}
    }
  }
  return {
    "loadDoc": function(url, method, arguments, responseHandler) {
      try {
        loadPage(url, method, arguments, responseHandler);
      } catch (e) {
        var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
        alert("Unable to get data:\n" + msg);
        return;
      }
    }
  };
})();
