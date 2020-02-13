// ==UserScript==
// @name          [HFR] citation rapide mod_r21
// @version       2.0.5
// @namespace     http://toyonos.info
// @description   Rajoute le systeme de citation dans la zone de réponse rapide via un double clic sur les icônes correspondantes
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @author        toyonos
// @modifications correction d'un bug de compatibilité avec firefox depuis la version 8 (par fred82) et ajout du ctrl-clic sur le bouton quote simple
// @modtype       correction de bug
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_citation_rap_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_citation_rap_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_citation_rap_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM_info
// @grant         GM_deleteValue
// @grant         GM_getValue
// @grant         GM_listValues
// @grant         GM_setValue
// @grant         GM_getResourceText
// @grant         GM_getResourceURL
// @grant         GM_addStyle
// @grant         GM_log
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
// @grant         GM_setClipboard
// @grant         GM_xmlhttpRequest
// ==/UserScript==

// modifications roger21 $Rev: 1590 $

// historique :
// 2.0.5 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.0.4 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 2.0.3 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.0.2 (20/01/2018) :
// - correction d'un bug ch/tm et nettoyage des alertes de syntaxe de tm
// 2.0.1 (28/11/2017) :
// - passage au https
// 2.0.0 (07/08/2016) :
// - suppression de commetaires et de lignes vides
// - léger restylage de bouts de code
// - remplacement des ' par des " (pasque !)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - nouveau numéro de version : 0.1.4.7 -> 2.0.0
// - nouveau nom : [HFR] Citation dans la reponse rapide -> [HFR] citation rapide mod_r21
// 0.1.4.7 (24/07/2016) :
// - ajout de la gestion du ctrl-clic sur le bouton "quote simple" pour make install
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.1.4.6 (22/11/2015) :
// - suppression du module d'auto-update (code mort)
// 0.1.4.5 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.1.4.4 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.1.4.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.1.4.2 (14/09/2012) :
// - ajout des metadata @grant
// 0.1.4.1 (28/11/2011) :
// - compatibilité avec firefox 8 : ajout des toString() sur les getSelection() (par fred82)
// - désactivation du message d'erreur XML dans la toyolib
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

var getElementByXpath = function(path, element) {
  var arr = Array();
  var xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  var item = xpr.iterateNext();
  while(item) {
    arr.push(item);
    item = xpr.iterateNext();
  }
  return arr;
};

RegExp.escape = function(text) {
  if(!arguments.callee.sRE) {
    var specials = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
    arguments.callee.sRE = new RegExp("(\\" + specials.join("|\\") + ")", "g");
  }
  return text.replace(arguments.callee.sRE, "\\$1");
};

var trim = function(myString) {
  return myString.replace(/^\s+/g, "").replace(/\s+$/g, "");
};

var root = document.getElementById("mesdiscussions");
var delay = 300;

getElementByXpath("//table//tr[starts-with(@class, \"message\")]//a[starts-with(@href, \"/message.php\" )]", root).filter(function(link) {
  return link.firstChild.alt == "answer";
}).forEach(function(link) {
  link.setAttribute("onclick", "return false;");
  var timerQuote;
  var firstClickQuoteTime = null;
  link.addEventListener("click", function(event) {
    if(firstClickQuoteTime !== null && new Date().getTime() - firstClickQuoteTime < delay) {
      clearTimeout(timerQuote);
      firstClickQuoteTime = null;
      toyoAjaxLib.loadDoc(this.href, "get", null, function(pageContent) {
        var quote = html_entity_decode(pageContent.match(/<textarea.*name="content_form".*>([^þ]*)<\/textarea>/).pop());
        var selection = RegExp.escape(trim(document.getSelection().toString()));
        var regexpExists = new RegExp(selection);
        var regexpDebut = new RegExp("\\[quotemsg=[0-9]+,[0-9]+,[0-9]+\\]\\s*" + selection);
        var regexpFin = new RegExp(selection + "\\s*\\[/quotemsg\\]");
        if(document.getSelection().toString() && regexpExists.test(quote)) {
          document.getElementById("content_form").value = quote.match(/\[quotemsg=[0-9]+,[0-9]+,[0-9]+\]/).pop();
          if(!regexpDebut.test(quote)) document.getElementById("content_form").value += "[…] ";
          document.getElementById("content_form").value += document.getSelection().toString();
          if(!regexpFin.test(quote)) document.getElementById("content_form").value += " […]";
          document.getElementById("content_form").value += "[/quotemsg]\n";
        } else {
          document.getElementById("content_form").value = quote;
        }
        document.getElementById("content_form").focus();
      });
    } else {
      firstClickQuoteTime = new Date().getTime();
      if(event.ctrlKey) {
        timerQuote = setTimeout(GM_openInTab, delay, this.href);
      } else {
        timerQuote = setTimeout("document.location = '" + this.href + "';", delay);
      }
    }
  }, false);
});

getElementByXpath("//table//tr[starts-with(@class, \"message\")]//a[starts-with(@href, \"/message.php\" )]", root).filter(function(link) {
  return link.firstChild.alt == "answer +";
}).forEach(function(link) {
  var saveOnClick = link.getAttribute("onclick").replace(/return false;/, "");
  link.setAttribute("onclick", "return false;");
  var timerMultiQuote;
  var firstClickMultiQuoteTime = null;
  link.addEventListener("click", function(event) {
    if(firstClickMultiQuoteTime !== null && new Date().getTime() - firstClickMultiQuoteTime < delay) {
      clearTimeout(timerMultiQuote);
      firstClickMultiQuoteTime = null;
      toyoAjaxLib.loadDoc(this.href, "get", null, function(pageContent) {
        var quote = html_entity_decode(pageContent.match(/<textarea.*name="content_form".*>([^þ]*)<\/textarea>/).pop());
        var selection = RegExp.escape(trim(document.getSelection().toString()));
        var regexpExists = new RegExp(selection);
        var regexpDebut = new RegExp("\\[quotemsg=[0-9]+,[0-9]+,[0-9]+\\]\\s*" + selection);
        var regexpFin = new RegExp(selection + "\\s*\\[/quotemsg\\]");
        if(document.getSelection().toString() && regexpExists.test(quote)) {
          document.getElementById("content_form").value += quote.match(/\[quotemsg=[0-9]+,[0-9]+,[0-9]+\]/).pop();
          if(!regexpDebut.test(quote)) document.getElementById("content_form").value += "[…] ";
          document.getElementById("content_form").value += document.getSelection().toString();
          if(!regexpFin.test(quote)) document.getElementById("content_form").value += " […]";
          document.getElementById("content_form").value += "[/quotemsg]\n";
        } else {
          document.getElementById("content_form").value += quote;
        }
      });
    } else {
      firstClickMultiQuoteTime = new Date().getTime();
      timerMultiQuote = setTimeout(saveOnClick, delay);
    }
  }, false);
});

var toyoAjaxLib = (function() {
  function loadPage(url, method, t_arguments, responseHandler) {
    var req;
    method = method.toUpperCase();
    if(method === "GET" && t_arguments !== null) url += "?" + t_arguments;
    if(window.XMLHttpRequest) {
      req = new XMLHttpRequest();
      req.onreadystatechange = processReqChange(req, responseHandler);
      req.open(method, url, true);
      if(method == "POST") req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      t_arguments = method == "POST" ? t_arguments : null;
      req.send(t_arguments);
    } else if(window.ActiveXObject) {
      req = new ActiveXObject("Microsoft.XMLHTTP");
      if(req) {
        req.onreadystatechange = processReqChange(req, responseHandler);
        req.open(method, url, true);
        if(method == "POST") req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if(method == "POST") req.send(t_arguments);
        else req.send();
      }
    }
  }

  function processReqChange(req, responseHandler) {
    return function() {
      try {
        if(req.readyState == 4) {
          if(req.status == 200) {
            var content = req.responseXML !== null && req.responseXML.documentElement !== null ? req.responseXML.documentElement : req.responseText;
            if(responseHandler !== null) responseHandler(content);
          } else {
            //alert("There was a problem retrieving the XML data:\n" +
            //req.statusText);
          }
        }
      } catch(e) {}
    };
  }
  return {
    "loadDoc": function(url, method, t_arguments, responseHandler) {
      try {
        loadPage(url, method, t_arguments, responseHandler);
      } catch(e) {
        var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
        alert("Unable to get data:\n" + msg);
        return;
      }
    }
  };
})();

var html_entity_decode = function(texte) {
  texte = texte.replace(/&#(\d+);/g, function() {
    return String.fromCharCode(RegExp.$1);
  });
  texte = texte.replace(/&quot;/g, "\""); // 34 22
  texte = texte.replace(/&amp;/g, "&"); // 38 26
  texte = texte.replace(/&#39;/g, "'"); // 39 27
  texte = texte.replace(/&lt;/g, "<"); // 60 3C
  texte = texte.replace(/&gt;/g, ">"); // 62 3E
  texte = texte.replace(/&circ;/g, "^"); // 94 5E
  texte = texte.replace(/&lsquo;/g, "‘"); // 145 91
  texte = texte.replace(/&rsquo;/g, "’"); // 146 92
  texte = texte.replace(/&ldquo;/g, "“"); // 147 93
  texte = texte.replace(/&rdquo;/g, "”"); // 148 94
  texte = texte.replace(/&bull;/g, "•"); // 149 95
  texte = texte.replace(/&ndash;/g, "–"); // 150 96
  texte = texte.replace(/&mdash;/g, "—"); // 151 97
  texte = texte.replace(/&tilde;/g, "˜"); // 152 98
  texte = texte.replace(/&trade;/g, "™"); // 153 99
  texte = texte.replace(/&scaron;/g, "š"); // 154 9A
  texte = texte.replace(/&rsaquo;/g, "›"); // 155 9B
  texte = texte.replace(/&oelig;/g, "œ"); // 156 9C
  texte = texte.replace(/&#357;/g, ""); // 157 9D
  texte = texte.replace(/&#382;/g, "ž"); // 158 9E
  texte = texte.replace(/&Yuml;/g, "Ÿ"); // 159 9F
  texte = texte.replace(/&nbsp;/g, " "); // 160 A0
  texte = texte.replace(/&iexcl;/g, "¡"); // 161 A1
  texte = texte.replace(/&cent;/g, "¢"); // 162 A2
  texte = texte.replace(/&pound;/g, "£"); // 163 A3
  texte = texte.replace(/&curren;/g, " "); // 164 A4
  texte = texte.replace(/&yen;/g, "¥"); // 165 A5
  texte = texte.replace(/&brvbar;/g, "¦"); // 166 A6
  texte = texte.replace(/&sect;/g, "§"); // 167 A7
  texte = texte.replace(/&uml;/g, "¨"); // 168 A8
  texte = texte.replace(/&copy;/g, "©"); // 169 A9
  texte = texte.replace(/&ordf;/g, "ª"); // 170 AA
  texte = texte.replace(/&laquo;/g, "«"); // 171 AB
  texte = texte.replace(/&not;/g, "¬"); // 172 AC
  texte = texte.replace(/&shy;/g, "­"); // 173 AD
  texte = texte.replace(/&reg;/g, "®"); // 174 AE
  texte = texte.replace(/&macr;/g, "¯"); // 175 AF
  texte = texte.replace(/&deg;/g, "°"); // 176 B0
  texte = texte.replace(/&plusmn;/g, "±"); // 177 B1
  texte = texte.replace(/&sup2;/g, "²"); // 178 B2
  texte = texte.replace(/&sup3;/g, "³"); // 179 B3
  texte = texte.replace(/&acute;/g, "´"); // 180 B4
  texte = texte.replace(/&micro;/g, "µ"); // 181 B5
  texte = texte.replace(/&para/g, "¶"); // 182 B6
  texte = texte.replace(/&middot;/g, "·"); // 183 B7
  texte = texte.replace(/&cedil;/g, "¸"); // 184 B8
  texte = texte.replace(/&sup1;/g, "¹"); // 185 B9
  texte = texte.replace(/&ordm;/g, "º"); // 186 BA
  texte = texte.replace(/&raquo;/g, "»"); // 187 BB
  texte = texte.replace(/&frac14;/g, "¼"); // 188 BC
  texte = texte.replace(/&frac12;/g, "½"); // 189 BD
  texte = texte.replace(/&frac34;/g, "¾"); // 190 BE
  texte = texte.replace(/&iquest;/g, "¿"); // 191 BF
  texte = texte.replace(/&Agrave;/g, "À"); // 192 C0
  texte = texte.replace(/&Aacute;/g, "Á"); // 193 C1
  texte = texte.replace(/&Acirc;/g, "Â"); // 194 C2
  texte = texte.replace(/&Atilde;/g, "Ã"); // 195 C3
  texte = texte.replace(/&Auml;/g, "Ä"); // 196 C4
  texte = texte.replace(/&Aring;/g, "Å"); // 197 C5
  texte = texte.replace(/&AElig;/g, "Æ"); // 198 C6
  texte = texte.replace(/&Ccedil;/g, "Ç"); // 199 C7
  texte = texte.replace(/&Egrave;/g, "È"); // 200 C8
  texte = texte.replace(/&Eacute;/g, "É"); // 201 C9
  texte = texte.replace(/&Ecirc;/g, "Ê"); // 202 CA
  texte = texte.replace(/&Euml;/g, "Ë"); // 203 CB
  texte = texte.replace(/&Igrave;/g, "Ì"); // 204 CC
  texte = texte.replace(/&Iacute;/g, "Í"); // 205 CD
  texte = texte.replace(/&Icirc;/g, "Î"); // 206 CE
  texte = texte.replace(/&Iuml;/g, "Ï"); // 207 CF
  texte = texte.replace(/&ETH;/g, "Ð"); // 208 D0
  texte = texte.replace(/&Ntilde;/g, "Ñ"); // 209 D1
  texte = texte.replace(/&Ograve;/g, "Ò"); // 210 D2
  texte = texte.replace(/&Oacute;/g, "Ó"); // 211 D3
  texte = texte.replace(/&Ocirc;/g, "Ô"); // 212 D4
  texte = texte.replace(/&Otilde;/g, "Õ"); // 213 D5
  texte = texte.replace(/&Ouml;/g, "Ö"); // 214 D6
  texte = texte.replace(/&times;/g, "×"); // 215 D7
  texte = texte.replace(/&Oslash;/g, "Ø"); // 216 D8
  texte = texte.replace(/&Ugrave;/g, "Ù"); // 217 D9
  texte = texte.replace(/&Uacute;/g, "Ú"); // 218 DA
  texte = texte.replace(/&Ucirc;/g, "Û"); // 219 DB
  texte = texte.replace(/&Uuml;/g, "Ü"); // 220 DC
  texte = texte.replace(/&Yacute;/g, "Ý"); // 221 DD
  texte = texte.replace(/&THORN;/g, "Þ"); // 222 DE
  texte = texte.replace(/&szlig;/g, "ß"); // 223 DF
  texte = texte.replace(/&agrave;/g, "à"); // 224 E0
  texte = texte.replace(/&aacute;/g, "á"); // 225 E1
  texte = texte.replace(/&acirc;/g, "â"); // 226 E2
  texte = texte.replace(/&atilde;/g, "ã"); // 227 E3
  texte = texte.replace(/&auml;/g, "ä"); // 228 E4
  texte = texte.replace(/&aring;/g, "å"); // 229 E5
  texte = texte.replace(/&aelig;/g, "æ"); // 230 E6
  texte = texte.replace(/&ccedil;/g, "ç"); // 231 E7
  texte = texte.replace(/&egrave;/g, "è"); // 232 E8
  texte = texte.replace(/&eacute;/g, "é"); // 233 E9
  texte = texte.replace(/&ecirc;/g, "ê"); // 234 EA
  texte = texte.replace(/&euml;/g, "ë"); // 235 EB
  texte = texte.replace(/&igrave;/g, "ì"); // 236 EC
  texte = texte.replace(/&iacute;/g, "í"); // 237 ED
  texte = texte.replace(/&icirc;/g, "î"); // 238 EE
  texte = texte.replace(/&iuml;/g, "ï"); // 239 EF
  texte = texte.replace(/&eth;/g, "ð"); // 240 F0
  texte = texte.replace(/&ntilde;/g, "ñ"); // 241 F1
  texte = texte.replace(/&ograve;/g, "ò"); // 242 F2
  texte = texte.replace(/&oacute;/g, "ó"); // 243 F3
  texte = texte.replace(/&ocirc;/g, "ô"); // 244 F4
  texte = texte.replace(/&otilde;/g, "õ"); // 245 F5
  texte = texte.replace(/&ouml;/g, "ö"); // 246 F6
  texte = texte.replace(/&divide;/g, "÷"); // 247 F7
  texte = texte.replace(/&oslash;/g, "ø"); // 248 F8
  texte = texte.replace(/&ugrave;/g, "ù"); // 249 F9
  texte = texte.replace(/&uacute;/g, "ú"); // 250 FA
  texte = texte.replace(/&ucirc;/g, "û"); // 251 FB
  texte = texte.replace(/&uuml;/g, "ü"); // 252 FC
  texte = texte.replace(/&yacute;/g, "ý"); // 253 FD
  texte = texte.replace(/&thorn;/g, "þ"); // 254 FE
  texte = texte.replace(/&yuml;/g, "ÿ"); // 255 FF
  return texte;
};
