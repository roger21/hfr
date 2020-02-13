// ==UserScript==
// @name          [HFR] Aperçu rapide mod_r21
// @version       2.2.4
// @namespace     roger21.free.fr
// @description   Rajoute l'aperçu du message en cours d'édition dans la réponse rapide et dans l'édition rapide.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*/*-sujet_*_*.htm*
// @exclude       https://forum.hardware.fr/message.php*
// @author        roger21
// @authororig    toyonos
// @modifications Désactivation de la disparition de l'aperçu quand la souris est dessus, affichage du contenu des spoilers par défaut dans l'aperçu, disparition immédiate de l'aperçu lorsque l'on clique en dehors, apparition immédiate de l'aperçu l'orsque l'on clique dans la zone d'édition.
// @modtype       modifications et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_apercu_rapid_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_apercu_rapid_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_apercu_rapid_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
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

// $Rev: 1590 $

// historique :
// 2.2.4 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.2.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 2.2.2 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.2.1 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+ *si toyonos est d'accord*
// 2.2.0 (12/08/2018) :
// - nouveau nom : [HFR] aperçu rapide mod_r21 -> [HFR] Aperçu rapide mod_r21
// - amélioration des @include
// - suppression des @grant inutiles (tous)
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (toyonos)
// - réécriture des metadata @description, @modifications et @modtype
// - maj de la metadata @homepageURL
// - suppression de getElementByXpath, remplacée par un querySelectorAll
// - check du code dans tm
// 2.1.4 (10/04/2018) :
// - agrandissement de l'apperçu à 300px (modifier la valeur de container.style.maxHeight pour adapter)
// 2.1.3 (28/11/2017) :
// - passage au https
// 2.1.2 (30/09/2017) :
// - sécurisation de la présence de <script></script> dans l'apperçu
// 2.1.1 (11/02/2017) :
// - mise à jour du style font-fammily à Verdana,Arial,Sans-serif,Helvetica (HFR Style)
// 2.1.0 (01/12/2016) :
// - correction d'une boucle infinie / oublie d'un clearInterval (*bravo* *slow clap* *[:roger21:2]*)
// - simplification de l'affichage : absolute -> fixed et simplifications asociées
// - ajout d'un zIndex on sait jammais [:gordon shumway]
// 2.0.0 (05/03/2016) :
// - remplacement du curseur "texte" par le cursor "flêche" sur l'aperçu pour ne pas confondre avec la zone d'édition
// - nouveau numéro de version : 0.2.4.10 -> 2.0.0
// - nouveau nom : [HFR] Apercu des posts dans la reponse/edition rapide -> [HFR] aperçu rapide mod_r21
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 0.2.4.10 (09/07/2015) :
// - ajout de la disparition immédaite de l'aperçu lorsque l'on clique en dehors
// - ajout de l'apparition immédiate de l'aperçu l'orsque l'on clique dans la zone d'édition
// - gestion homogème du scroll de l'apperçu quand il disparait ->
// (je sais pas pkoi c'était géré différement de quand il ne disparait pas)
// - remplacement des ' par des " (pasque !)
// - recoddage de petits bouts (ajout d'accollades, séparation de déclarations multiples)
// - compactage du code (suppression de certaines lignes vides)
// - découpage des lignes trop longues
// - suppression de bouts de code mort ou commentaires inutiles
// - reformatage de certains commentaires
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - suppression du module d'auto-update (code mort)
// 0.2.4.9 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.2.4.8 (01/05/2014) :
// - ajout d'une marge en bas pour pour conserver une marge quand on passe en overflow
// - correction du centrage de la div absolute (left + right au lieu de left + width)
// 0.2.4.7 (28/04/2014) :
// - ajout d'un test d'existance du container dans les fonction sur event (evite une erreur)
// 0.2.4.6 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.2.4.5 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.2.4.4 (14/09/2012) :
// - ajout des metadata @grant
// 0.2.4.1 à 0.2.4.3 (10/01/2012) :
// - désactivation du script dans la fenetre de création de topics
// - activation du script pour les topics avec url verbeuse
// - affichage par défaut du contenu des spoilers dans l'aperçu
// - désactivation de la disparition de l'aperçu si la souris est dessus
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

/***************************************************************/

// Lib de generation de l'apercu (provenant de mdenhance)
// uses code from Freekil (hfrenhance v1)
var BBParser = {

  lieu: "https://forum-images.hardware.fr/icones/",
  lieuPerso: "https://forum-images.hardware.fr/images/perso/",

  parse: function(str) {
    str = str.replace(/,/gi, "&#44;");
    str = str.replace(/<script>/gi, "&lt;script&gt;");
    str = str.replace(/<\/script>/gi, "&lt;/script&gt;");

    // Trouve les balises fixed
    let fixed = str.match(/(\[fixed\])((\n|.)+?)(\[\/fixed\])/gi);
    if(fixed) {
      fixed = fixed.toString();
    }

    // Trouve les balises cpp
    let cpp = str.match(/(\[cpp\])((\n|.)+?)(\[\/cpp\])/gi);
    if(cpp) {
      cpp = cpp.toString();
    }

    // Trouve les balises code
    let code = str.match(/(\[code(=[a-z0-9]+)?\])((\n|.)+?)(\[\/code\])/gi);
    if(code) {
      code = code.toString();
    }

    str = str.replace(/&#44;/gi, ",");
    str = BBParser.htmlSpecialChars(str);
    str = BBParser.parseOwnSmilies(str);
    str = BBParser.parseBaseSmilies(str);
    str = BBParser.parseStyle(str);
    str = BBParser.parseExternal(str);
    str = BBParser.parseLists(str);
    str = BBParser.parseBlocks(str);

    // Special pour les balises fixed
    if(fixed) {
      fixed = fixed.split(",");
      for(let i = 0; i < fixed.length; ++i) {
        let thisfixed = fixed[i].replace(/(\[fixed\])((\n|.)+?)(\[\/fixed\])/, "$2");
        thisfixed = thisfixed.replace(/\n/g, "<br/>\n");
        thisfixed = thisfixed.replace(/ /gi, "&nbsp;");
        str = str.replace(/(\[fixed\])((\n|.)+?)(\[\/fixed\])/,
          "<table class=\"fixed\"><tbody><tr class=\"none\"><td>" + thisfixed + "</td></tr></tbody></table>");
      }
    }

    // Special pour les balises cpp
    if(cpp) {
      cpp = cpp.split(",");
      for(let i = 0; i < cpp.length; ++i) {
        let thiscode = cpp[i].replace(/(\[cpp\])((\n|.)+?)(\[\/cpp\])/, "$2");
        thiscode = thiscode.replace(/ /gi, "&nbsp;");
        thiscode = thiscode.replace(/\t/gi, "&nbsp;&nbsp;"); // a tab equals two spaces
        thiscode = thiscode.replace(/(^|\[cpp\])(.*?)($|\[\/cpp\])/mgi,
          "<li><div class=\"de1\">$2&nbsp;</div></li>"); // each line is an ol list element
        thiscode = thiscode.replace(/\n/gi, ""); // we're using a pre block, so we must remove line breaks
        str = str.replace(/(\[cpp\])((\n|.)+?)(\[\/cpp\])/,
          "<table ondblclick=\"switchNumbering2(this);\" class=\"code\"><tbody><tr class=\"none\">" +
          "<td><b class=\"s1\" style=\"font-family:Verdana,Arial,Sans-serif,Helvetica;\"> Code : " +
          "</b><br><pre class=\"cpp\"><ol>" + thiscode + "</ol></pre></td></tr></tbody></table>");
      }
    }

    // Special pour les balises code
    if(code) {
      code = code.split(",");
      for(let i = 0; i < code.length; ++i) {
        let thiscode = code[i].replace(/(\[code(=[a-z0-9]+)?\])((\n|.)+?)(\[\/code\])/, "$3");
        thiscode = thiscode.replace(/ /gi, "&nbsp;");
        thiscode = thiscode.replace(/\t/gi, "&nbsp;&nbsp;"); // a tab equals two spaces
        thiscode = thiscode.replace(/(^|\[code\])(.*?)($|\[\/code\])/mgi,
          "<li><div class=\"de1\">$2&nbsp;</div></li>"); // each line is an ol list element
        thiscode = thiscode.replace(/\n/gi, ""); // we're using a pre block, so we must remove line breaks
        str = str.replace(/(\[code(=[a-z0-9]+)?\])((\n|.)+?)(\[\/code\])/,
          "<table ondblclick=\"switchNumbering2(this);\" class=\"code\"><tbody><tr class=\"none\">" +
          "<td><b class=\"s1\" style=\"font-family:Verdana,Arial,Sans-serif,Helvetica;\"> Code : " +
          "</b><br><pre class=\"cpp\"><ol>" + thiscode + "</ol></pre></td></tr></tbody></table>");
      }
    }

    return str;
  },

  parseBaseSmilies: function(str) {
    let smilies = {
      gratgrat: ":gratgrat:",
      ange: ":ange:",
      benetton: ":benetton:",
      bic: ":bic:",
      bounce: ":bounce:",
      bug: ":bug:",
      crazy: ":crazy:",
      cry: ":cry:",
      dtc: ":dtc:",
      eek: ":eek:",
      eek2: ":eek2:",
      evil: ":evil:",
      fou: ":fou:",
      foudtag: ":foudtag:",
      fouyaya: ":fouyaya:",
      fuck: ":fuck:",
      gun: ":gun:",
      hebe: ":hebe:",
      heink: ":heink:",
      hello: ":hello:",
      hot: ":hot:",
      //int: ":int:", // can't use int, reserved word, see below
      jap: ":jap:",
      kaola: ":kaola:",
      lol: ":lol:",
      love: ":love:",
      mad: ":mad:",
      mmmfff: ":mmmfff:",
      na: ":na:",
      non: ":non:",
      ouch: ":ouch:",
      ouimaitre: ":ouimaitre:",
      pfff: ":pfff:",
      pouah: ":pouah:",
      pt1cable: ":pt1cable:",
      sarcastic: ":sarcastic:",
      sleep: ":sleep:",
      sol: ":sol:",
      spamafote: ":spamafote:",
      spookie: ":spookie:",
      sum: ":sum:",
      sweat: ":sweat:",
      vomi: ":vomi:",
      wahoo: ":wahoo:",
      whistle: ":whistle:"
    }

    let regexp;

    for(let code in smilies) {
      regexp = new RegExp(smilies[code], "gi"); // get regexp from object
      str = str.replace(regexp, "<img src=\"" + BBParser.lieu + "smilies/" + code + ".gif\" alt=\"" + code + "\" />");
    }

    // fix for "int" smiley
    str = str.replace(/:int:/gi, "<img src=\"" + BBParser.lieu + "smilies/int.gif\" alt=\"int\" />");

    let smilies2 = {
      confused: /([^\[]|^):\?\?:/gi,
      smile: /([^\[]|^):\)/gi,
      frown: /([^\[]|^):\(/gi,
      redface: /([^\[]|^):o/gi,
      biggrin: /([^\[]|^):D/gi,
      wink: /([^\[]|^);\)/gi,
      tongue: /([^\[]|^):p/gi,
      ohill: /([^\[]|^):\'\(/gi,
      ohwell: /([^\[]|^)(:\/)(?!\/)/gi // this one need a particular regex to avoid mixing up with urls
    }

    for(let code in smilies2) {
      str = str.replace(smilies2[code], "$1<img src=\"" + BBParser.lieu + code + ".gif\" alt=\"" + code + "\" />");
    }

    return str;
  },

  parseOwnSmilies: function(str) {
    str = str.replace(/\[:([^\]]+):(\d+)]/gi, "<img src=\"" + BBParser.lieuPerso + "$2/$1.gif\" alt=\"[:$1:$2]\" />");
    str = str.replace(/\[:([^\]:]+)]/gi, "<img src=\"" + BBParser.lieuPerso + "$1.gif\" alt=\"[:$1]\" />");
    return str;
  },

  parseStyle: function(str) {
    str = str.replace(/\[[su]\]((\n|.)+?)\[\/[su]\]/gi, "<span class=\"u\">$1</span>");
    str = str.replace(/\[[bg]\]((\n|.)+?)\[\/[bg]\]/gi, "<strong>$1</strong>");
    str = str.replace(/\[i\]((\n|.)+?)\[\/i\]/gi, "<em>$1</em>");
    str = str.replace(/\[strike\]((\n|.)+?)\[\/strike\]/gi, "<strike>$1</strike>");
    str = str.replace(/\[(#[a-f0-9]{6})\]((\n|.)+?)\[\/#([a-f0-9]{6})\]/gi, "<span style=\"color: $1;\">$2</span>");
    return str;
  },

  parseExternal: function(str) {
    str = str.replace(/\[img\]([a-z]+:\/\/[^ \n\r]+?)\[\/img\]/gi,
      "<img src=\"$1\" alt=\"$1\" />");
    str = str.replace(/\[url=([a-z]+:\/\/(www\.)?[^ \n\r\[\<]+)\](.+?)\[\/url\]/gi,
      "<a href=\"$1\" target=\"_blank\" class=\"cLink\">$3</a>");
    str = str.replace(/\[url\]([a-z]+:\/\/(www\.)?[^ \n\r\[\<]+)\[\/url\]/gi,
      "<a href=\"$1\" target=\"_blank\" class=\"cLink\">$1</a>");
    str = str.replace(/\[email\]([\w\.-]+@[\w\.-]+)\[\/email\]/gi,
      "<a href=\"mailto:$1\" class=\"cLink\">$1</a>");
    str = str.replace(/(^|[\r\n \]\>])([a-z]+:\/\/(www\.)?[^ \n\r\<\[]+)/gi,
      "$1<a href=\"$2\" target=\"_blank\" class=\"cLink\">$2</a>");
    return str;
  },

  parseLists: function(str) {
    str = str.replace(/((\[\*\](.*)(\r)?(\n))*(\[\*\][^\n]*))/gi, "<ul>$1</ul>");
    str = str.replace(/\[\*\]([^\n]*(\n|$))/gi, "<li>$1</li>");
    return str;
  },

  parseBlocks: function(str) {
    let debutSpoiler, finSpoiler;

    let spoilers = str.match(/\[spoiler\]((\n|.)+?)\[\/spoiler\]/gi, debutSpoiler + "$1" + finSpoiler);
    if(spoilers) {
      for(let i = 0; i < spoilers.length; ++i) {
        debutSpoiler = "<table class=\"spoiler\" onclick=\"javascript:montrer_spoiler(" + i +
          ")\" style=\"cursor:default;\"><tbody><tr class=\"none\">  <td><b class=\"s1Topic\">Spoiler :</b><br /><br />" +
          "<div style=\"visibility:visible\" class=\"Topic masque\" id=\"" + i + "\"><p>";
        finSpoiler = "</p></div></td></tr></tbody></table></div>";
        str = str.replace(/\[spoiler\]((\n|.)+?)\[\/spoiler\]/i, debutSpoiler + "$1" + finSpoiler);
      }
    }

    let debutCit = "<div class=\"container\"><table class=\"citation\"><tbody><tr class=\"none\"><td>";
    let finCit = "</td></tr></tbody></table></div>";

    str = str.replace(/\[citation\]\[nom\](.+?)\[\/nom]((\n|.)+?)\[\/citation\]/gi, debutCit +
      "<b class=\"s1\">$1</b><br><br><p>$2</p>" + finCit);
    str = str.replace(/\[quotemsg=(.+?)\]((.|\n)+?)\[\/quotemsg\]/gi, debutCit +
      "<b class=\"s1\"><a class=\"Topic\">Quelqu'un a ecrit</a></b><br><br><p>$2</p>" + finCit);

    let debutQuote = "<div class=\"container\"><table class=\"quote\"><tbody><tr class=\"none\"><td>" +
      "<b class=\"s1\">Citation :</b><br /><br /><p>";
    let finQuote = "</p></td></tr></tbody></table></div>";

    str = str.replace(/(\[quote\])((\n|.)+?)(\[\/quote\])/gi, debutQuote + "$2" + finQuote);

    // Special quotes imbriques
    let quotes = str.match(/\[quote\]((\n|.)+?)\[\/quote\]/gi);
    if(quotes) {
      for(let i = 0; i < quotes.length; ++i) {
        str = str.replace(/\[quote\]((\n|.)+?)\[\/quote\]/gi, debutQuote + "$1" + finQuote);
      }
    }

    return str;
  },

  htmlSpecialChars: function(str) {
    str = str.replace(/&/gi, "&amp;");
    str = str.replace(/\u0022/gi, "&quot;");
    str = str.replace(/\u0027/gi, "&#039;");
    str = str.replace(/</gi, "&lt;");
    str = str.replace(/>/gi, "&gt;");
    str = str.replace(/,/gi, "&#44;"); // fix code with a , in it
    str = str.replace(/  /gi, "&nbsp; "); // fix for multiple spaces
    str = str.replace(/\n/g, "<br/>\n");
    return str;
  }

}

/***************************************************************/

var timer;
var timerOpacity;
var allowFading = true;

var clearPreview = function() {
  clearInterval(timerOpacity);
  let container = document.getElementById("apercu_reponse");
  if(container === null) return;
  container.style.display = "none";
  container.style.opacity = 1;
}

var fadeAway = function() {
  let opacity = 1;
  if(allowFading) {
    timerOpacity = setInterval(function() {
      let container = document.getElementById("apercu_reponse");
      if(container === null) return;
      opacity -= 0.01;
      container.style.opacity = opacity;
      if(opacity < 0) clearPreview()
    }, 1);
  }
}

var stopFading = function() {
  allowFading = false;
  launchFading();
}

var startFading = function() {
  allowFading = true;
  launchFading();
}

var launchFading = function() {
  clearTimeout(timer);
  clearInterval(timerOpacity);
  let container = document.getElementById("apercu_reponse");
  if(container === null) return;
  container.style.opacity = 1;
  if(allowFading) {
    timer = setTimeout(fadeAway, 5000);
  }
}

var generatePreview = function(textAreaId) {
  let container;
  if(!document.getElementById("apercu_reponse")) {
    container = document.createElement("div");
    container.id = "apercu_reponse";
    container.style.position = "fixed";
    container.style.textAlign = "left";
    container.style.backgroundColor = "#F7F7F7";
    container.style.overflow = "auto";
    container.style.padding = "5px";
    container.style.maxHeight = "300px";
    container.style.border = "1px solid black";
    container.style.fontSize = "13px";
    container.style.top = "20px";
    container.style.left = "10%";
    container.style.right = "10%";
    container.style.cursor = "default";
    container.style.zIndex = "99999";
    container.addEventListener("mouseover", stopFading, false);
    container.addEventListener("mouseout", startFading, false);
    document.getElementById("mesdiscussions").appendChild(container);
  } else {
    container = document.getElementById("apercu_reponse");
  }

  let content = document.getElementById(textAreaId);
  container.innerHTML = BBParser.parse(content.value) +
    "<div style=\"opacity:0;display:block;height:5px;width:1px;position:absolute\"></div>";

  if(container.scrollTop == 0 || container.style.display == "block") launchFading();
  container.style.display = content.value == "" ? "none" : "block";

  let pourcentage = content.value.slice(0, content.selectionStart).split("\n").length * 100 /
    content.value.split("\n").length;
  pourcentage = pourcentage < 1 ? 0 : pourcentage;
  let noScrollLimit = parseInt(container.style.maxHeight) * 100 / container.scrollHeight;
  container.scrollTop = pourcentage > noScrollLimit ?
    (container.scrollHeight * (pourcentage - noScrollLimit + 1) / 100) + (parseInt(container.style.maxHeight) / 2) : 0;
}

/* Gestion de la reponse rapide */

if(document.getElementById("content_form")) {
  document.getElementById("content_form").addEventListener("keyup", function() {
    generatePreview("content_form");
  }, false);
  document.getElementById("content_form").addEventListener("click", function() {
    generatePreview("content_form");
  }, false);
}

/* Gestion de l'edit rapide */

var root = document.getElementById("mesdiscussions");

var imgs = root.querySelectorAll("table.messagetable tr.message td div.toolbar " +
  "div.left a[href^=\"/message.php?config=hfr.inc\"] img[alt=\"Edition rapide\"]");

for(let img of imgs) {
  let onclickCommand = img.parentNode.getAttribute("onclick");
  let numreponse = onclickCommand.match(/edit_in\('.*','.*',[0-9]+,([0-9]+),''\)/).pop();
  img.parentNode.addEventListener("click", function() {
    let timer = setInterval(function() {
      if(document.getElementById("rep_editin_" + numreponse)) {
        clearInterval(timer);
        document.getElementById("rep_editin_" + numreponse).addEventListener("keyup", function() {
          generatePreview("rep_editin_" + numreponse);
        }, false);
        document.getElementById("rep_editin_" + numreponse).addEventListener("click", function() {
          generatePreview("rep_editin_" + numreponse);
        }, false);
        let buttonValide = document.getElementById("rep_editin_" + numreponse).nextSibling.firstChild;
        buttonValide.addEventListener("click", clearPreview, false);
        buttonValide.nextSibling.addEventListener("click", clearPreview, false);
      }
    }, 500);
  }, false);
}

document.addEventListener("click", function(e) {
  let target = e.target;
  if(!target.nodeName || (target.nodeName.toLowerCase() !== "textarea")) {
    let apercu = document.getElementById("apercu_reponse");
    while(target !== null && target !== apercu) {
      target = target.parentNode;
    }
    if(target === null) {
      clearPreview();
    }
  }
}, false);
