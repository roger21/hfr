// ==UserScript==
// @name          [HFR] édition rapide du wiki smileys mod_r21
// @version       2.1.0
// @namespace     http://toyonos.info
// @description   Permet de faire rapidement des modifications dans le wiki smilies via un double clic sur un smiley perso donné
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @author        toyonos
// @modifications ajout de l'affichage des mots-clé sur la page des profils (avec minipouss) et simplification de l'edition des mots-clé (reduction des délais d'affichage et suppression de la popup de confirmation)
// @modtype       modification de fonctionnalités
// @homepage      http://roger21.free.fr/hfr/
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

// modifications roger21 $Rev: 151 $

// historique :
// 2.1.0 (23/04/2018) :
// - gestion des pages ne permettant pas l'édition (au lieu d'une erreur fatale)
// - correction du passage au https (pour la page des profils)
// - petites corrections de code et check du code dans tm
// 2.0.1 (28/11/2017) :
// - passage au https
// 2.0.0 (11/11/2016) :
// - nouveau numéro de version : 0.1.3.10 -> 2.0.0
// - nouveau nom : [HFR] Edition rapide du Wiki smilies -> [HFR] édition rapide du wiki smileys mod_r21
// - compression des images (pngoptimizer)
// - genocide de lignes vides et de commentaires ([:roger21:2])
// - remplacement des ' par des " (pasque !)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 0.1.3.10 (09/11/2016) :
// - corection de la xpath query pour ne pas prendre en compte les smileys tempo
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.1.3.9 (15/05/2015) :
// - ajout du support pour les posts de modération (rose)
// - leger reformatage de certain bouts de code
// 0.1.3.8 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.1.3.7 (20/02/2015) :
// - désactivation de l'edition si le smiley est dans un lien
// 0.1.3.6 (21/01/2015) :
// - suppression d'un include inutile
// - amelioration de la position de la popup d'edition rapide
// - decoupage des lignes de code trop longue
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - reencodage des images en base64
// - suppression du module d'auto-update (code mort)
// 0.1.3.5 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.1.3.4 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.1.3.3 (14/09/2012) :
// - ajout des metadata @grant
// 0.1.3.1 à 0.1.3.2 (07/12/2011) :
// - ajout de l'affichage des mots clé sur la page des profils (avec minipouss)
// - suppression de la popup de validation
// - changement du message de confirmation
// - réduction du délais d'affichage de la popup de confirmation
// - désactivation du message d'erreur XML dans la toyolib
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

({
  getElementByXpath: function(path, element) {
    var arr = Array();
    var xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    var item = xpr.iterateNext();
    while(item) {
      arr.push(item);
      item = xpr.iterateNext();
    }
    return arr;
  },
  getKeyWords: function(code, cbf) {
    toyoAjaxLib.loadDoc("https://forum.hardware.fr/wikismilies.php", "get",
      "config=hfr.inc&detail=" + encodeURIComponent(code),
      function(pageContent) {
        var keyWords = pageContent.match(/name="keywords0"\s*value="(.*)"\s*onkeyup/).pop();
        cbf(keyWords);
      });
  },
  launch: function() {
    var myXpath;
    if(window.location.href.substr(0, 36) == "https://forum.hardware.fr/hfr/profil") {
      myXpath = "//table//tr[@class=\"profil\"]//td[@class=\"profilCase4\"]" +
        "//img[starts-with(@src, \"https://forum-images.hardware.fr/images/perso/\")]";
    } else {
      myXpath = "//table//td[starts-with(@class, \"messCase2\")]//div[starts-with(@id, \"para\")]" +
        "//img[starts-with(@src, \"https://forum-images.hardware.fr/images/perso/\") and not(contains(@src, \"/tempo/\"))]";
    }
    var thisScript = this;
    var root = document.getElementById("mesdiscussions");
    var hashCheck = this.getElementByXpath("//input[@name=\"hash_check\"]", document);
    hashCheck = hashCheck.length ? hashCheck.pop().value : false;
    this.getElementByXpath(myXpath, root).forEach(function(img) {
      img.addEventListener("mouseover", function() {
        var currentImg = this;
        var imgText;
        if(this.alt.substr(0, 2) != "[:")
          imgText = this.previousSibling.nodeValue.trim();
        else
          imgText = this.alt;
        thisScript.getKeyWords(imgText, function(keyWords) {
          currentImg.title = imgText + " { " + keyWords + " }";
        });
      }, false);
      if(img.parentNode.nodeName.toLowerCase() === "a") return;
      if(hashCheck === false) return;
      var timer;
      var firstClickTime = null;
      var delay = 300;
      img.addEventListener("click", function(event) {
        if(firstClickTime != null && new Date().getTime() - firstClickTime < delay) {
          clearTimeout(timer);
          firstClickTime = null;
          var theEvent = event;
          var theImg = this;
          thisScript.getKeyWords(this.alt, function(keyWords) {
            var newDiv;
            var width = 300;
            if(document.getElementById("edit_wiki_smilies")) {
              newDiv = document.getElementById("edit_wiki_smilies");
            } else {
              newDiv = document.createElement("div");
              newDiv.setAttribute("id", "edit_wiki_smilies");
              newDiv.style.position = "absolute";
              newDiv.style.border = "1px solid black";
              newDiv.style.background = "white";
              newDiv.style.zIndex = "1001";
              newDiv.className = "signature";
              newDiv.style.textAlign = "right";
              newDiv.style.width = width + 14 + "px";
              newDiv.style.paddingBottom = "5px";
              var inputKeyWords = document.createElement("input");
              inputKeyWords.type = "text";
              inputKeyWords.style.display = "block";
              inputKeyWords.style.margin = "5px";
              inputKeyWords.style.fontSize = "1.1em";
              inputKeyWords.style.width = width + "px";
              var inputOk = document.createElement("input");
              inputOk.type = "image";
              inputOk.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACl0lEQVR42q2T60uTYRiH%2FTv2bnttAwlkRCGChFD7FCQSm2ZDMQ%2FL0nRnj7TNGDbTooychzFSSssstdqc8zB1anNrSpm47FVCzH3pQLVhdLBfzztoJlifvOEHz4fnuu7nGBe311XgOyLMnTmsz%2FakMBljB8OSEVFY4kpkJM5Efbp9v%2FC%2FcJ43VSrzJId0HhluBy3oW%2BmKpnOpGSWuExD30iFxDy3dFSZdpZkTSZHr80Y41%2Fphe3UDpvnKaNixY60PjbNVOGTjRZJtvJ2SHE%2BKINOdtMHC7MSaQBkq%2FCXQzJ6DjqScpNp3HvY3D3B5ugIiC3dDdJMriAlk7iSDajwr2pmFWVDlPQPFTCEU0wVQTxfCvT4Ig1cJB5Hk9hxDwjWuISbIGBExncFmWINNqPAVQ%2FlUTsB8KKdIPPmYeOsCW6HIOtpeNMI234j4ei4TExy3J2w%2BWr2L2oAGWm8RWckAlj4uQDVZiPH1oSj8c%2BsH2p5fgWGyGH3BTvCN1GZMIH5Ib%2FavdMPoV6HWr8Xnb5%2Bi0Iev72KwZa4ealc29O6z6A92gF%2Fzt6CHZm4tNKF98Sp0U3KYfdWIfP8Shbd%2BbcHy7BLKnFnQEEFLoA7tXjPoKmp7C6l3%2BAb5QBrsq%2FdRPSmH2n0adTPlWH6%2FiLa5BpQOnoTCcQo6Zw7sr7uRbj0KupLaPsRkK09wgFyN2aPBY%2BYeKkfzoB3OgWpIBqWDDQtn48lyF4xDxeCrORu0mhLseAuJTVxpfAMVMbnL4CCS1oAZ%2BtEiXBiWo5VswU5gvbMIvFJOhMC7v8Z9DVwpbaJCkg4x2v1m9L60onfBCovXhLSWVPAVnBCt%2Bgf8p%2BiLXCFtoPR0DcXwtZwwX8UJk44MiZ4upYR7%2Fnt%2FA%2Bw9sdKFchsrAAAAAElFTkSuQmCC";
              inputOk.style.marginRight = "6px";
              inputOk.addEventListener("click", function() {
                var smiley = this.parentNode.lastChild.value;
                var keyWords = this.parentNode.firstChild.value;
                var url = "https://forum.hardware.fr/wikismilies.php?config=hfr.inc&option_wiki=0&withouttag=0";
                var args = "modif0=1&smiley0=" + encodeURIComponent(smiley) +
                  "&keywords0=" + encodeURIComponent(keyWords);
                args += "&hash_check=" + hashCheck;
                toyoAjaxLib.loadDoc(url, "post", args, function(pageContent) {
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
              inputCancel.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACEklEQVR42q1S%2FU9SYRhlbW13%2FQ0V5Woub05zfZkCXhUhpmmb8v3h5ZKoCQjcwVBi1Q%2B19Zf0d2lWxpeR3AuX93J8qGVjgK2tZ3u3d3t2znmecx6D4R%2BrsS5dGdiEnDXS4weCQ2Fe9QUSdafH3B%2Bc3UM7k4OeSPWQNIIi3xAjaG5u48fz1Y%2B1peU7PWAU3qBNT0%2FKaG3tnJOogXWe1NGKJYB8AZ3%2Fic2RqMxaL%2F0iSGe4dlLW23uvgPcfoOfyHQI0RYlX%2FSGe1KHtxAHqqyERJwtPWUWYv9w1oh5PcuxlnOlyFnj7DiydQSMcAalD244Buf2f%2F6rVTuA5rq9JregW15Q2WCu2S%2Bu8BvYLBMwD2RxUfxDVeRurzMxyF8cUFDnFG9CRo3V8QcDtA%2BQMqnMLetkicH%2FNWfH4O1EBlAacHmDVBeymaG87ipPT%2FMVgt49XvH5okSiQkgmYBuK0DhmorrlQMVnwdXyiP0nd5eUVjw%2BatAFQjIrbCzKLlabN%2BunSChDdRP3ZCor3H%2BJoeKSbhC6LJ3Vo4RekmoRCo5NZrDRl5oqPJrnjiQesZrUBYQmndgeOR8dweGPoDwldllB3uqGJEpQ1N8gsVnpiOjfsy%2Bg493nkLvtuEaA4FvFt7B4OrhmFrinosoTa4jLK5hmdzOpx%2B%2Bj2MPdp6BbrC%2F5dZZNFKD6eGhjVofEmd3D1umD4n3UGltFKFDkd60gAAAAASUVORK5CYII%3D";
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
            if(window.scrollY + theEvent.clientY + 8 + newDiv.offsetHeight >=
              document.documentElement.offsetHeight) {
              newDiv.style.top = (window.scrollY + theEvent.clientY - 8 - newDiv.offsetHeight) + "px";
            } else {
              newDiv.style.top = (window.scrollY + theEvent.clientY + 8) + "px";
            }
            newDiv.firstChild.value = keyWords;
            newDiv.lastChild.value = theImg.alt;
          });
        } else {
          firstClickTime = new Date().getTime();
        }
      }, false);
    });
  }
}).launch();

var toyoAjaxLib = (function() {
  function loadPage(url, method, args, responseHandler) {
    var req;
    method = method.toUpperCase();
    if(method == "GET" && args != null) url += "?" + args;
    if(window.XMLHttpRequest) {
      req = new XMLHttpRequest();
      req.onreadystatechange = processReqChange(req, responseHandler);
      req.open(method, url, true);
      if(method == "POST") req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      args = method == "POST" ? args : null;
      req.send(args);
    } else if(window.ActiveXObject) {
      req = new ActiveXObject("Microsoft.XMLHTTP");
      if(req) {
        req.onreadystatechange = processReqChange(req, responseHandler);
        req.open(method, url, true);
        if(method == "POST") req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if(method == "POST") req.send(args);
        else req.send();
      }
    }
  }

  function processReqChange(req, responseHandler) {
    return function() {
      try {
        if(req.readyState == 4) {
          if(req.status == 200) {
            var content = req.responseXML != null && req.responseXML.documentElement != null ?
              req.responseXML.documentElement : req.responseText;
            if(responseHandler != null) responseHandler(content);
          } else {}
        }
      } catch(e) {}
    };
  }
  return {
    "loadDoc": function(url, method, args, responseHandler) {
      try {
        loadPage(url, method, args, responseHandler);
      } catch(e) {
        var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
        alert("Unable to get data:\n" + msg);
        return;
      }
    }
  };
})();
