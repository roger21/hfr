// ==UserScript==
// @name          [HFR] stealth rehost mod_r21
// @version       2.2.5
// @namespace     http://toyonos.info
// @description   Permet de remplacer le domaine reho.st par un alias dans les liens et les images
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @author        toyonos
// @modifications remplacement de l'url (morte) des aliases, ajout du support pour reho.st, ajout d'un throbber au chargement de l'image de test, meilleur alignement de l'image de test (et grosse maj des aliases dans http://roger21.free.fr/hfr/stealthrehost.php)
// @modtype       évolution de fonctionnalités
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_stealth_reho_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_stealth_reho_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_stealth_reho_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @connect       roger21.free.fr
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// ==/UserScript==

// modifications roger21 $Rev: 4040 $

// historique :
// 2.2.5 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.2.4 (05/11/2019) :
// - ajout d'un message d'information concernant le passage à [HFR] Smart Auto Rehost mod_r21 6+
// 2.2.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 2.2.2 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.2.1 (13/05/2018) :
// - check du code dans tm
// - suppression des @grant inutiles
// - ajout de la metadata @connect pour tm
// - maj de la metadata @homepageURL
// 2.2.0 (06/12/2017) :
// - ajout du support pour les urls en https pour reho.st
// - suppression de la gestion de hfr-rehost.net
// 2.1.2 (28/11/2017) :
// - passage au https
// 2.1.1 (11/02/2017) :
// - correction du style font-fammily à Verdana,Arial,Sans-serif,Helvetica (HFR Style)
// 2.1.0 (30/12/2015) :
// - meilleure descrition dans @modifications
// 2.0.0 (22/12/2015) :
// - ajout d'un throbber lors du chargement de l'image de test
// - meilleur alignement vertical de l'image de test (et du throbber) et du message d'indisponibilité
// - remplacement des ' par des " (pasque !)
// - genocide de commentaires et de lignes vides
// - compactage du css
// - découpage des lignes trop longues
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - nouveau numéro de version : 0.1.0.9 -> 2.0.0
// - nouveau nom : [HFR] Sleath Rehost -> [HFR] stealth rehost mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.1.0.9 (22/11/2015) :
// - suppression du module d'auto-update (code mort)
// 0.1.0.8 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.1.0.7 (04/04/2014) :
// - changement de l'url des aliases (nouvelle organisation des scripts)
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.1.0.6 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.1.0.5 (11/01/2014) :
// - désactivation de l'activation pour tous les sites (pas pasque ça marche
// pas mais pasque ça me saoul de voir ce script sur toutes les pages)
// @include *
// 0.1.0.4 (23/10/2013) :
// - ajout de Principal 2 : reho.st dans les aliases (exterieur au script)
// pour permetre la conversion hfr-rehost.net -> reho.st
// - activation des pages pour tous les sites (experimental)
// 0.1.0.3 (10/10/2013) :
// - gestion du domaine reho.st
// - remplacement des images toutes mortes de la boîte de dialogue
// 0.1.0.2 (14/09/2012) :
// - ajout des metadata @grant
// 0.1.0.1 (28/11/2011) :
// - modification de l'url des stealth rehost
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs


var info_smart_auto_rehost_displayed_once = GM_getValue("info_smart_auto_rehost_displayed_once", false);
function display_info_smart_auto_rehost() {
  GM_setValue("info_smart_auto_rehost_displayed_once", true);
  window.alert("Information du script \u00ab\u202f[HFR] stealth rehost mod_r21\u202f\u00bb\n\n" +
    "Ce message n'apparaitra automatiquement qu'une seule fois.\n" +
    "Vous pouvez le réafficher manuellement depuis le menu de l'extension " +
    "\u00ab\u202f[HFR] stealth rehost -> information\u202f\u00bb.\n\n" +
    "Les scripts \u00ab\u202f[HFR] stealth rehost mod_r21\u202f\u00bb et " +
    "\u00ab\u202f[HFR] stealth rehost statique mod_r21\u202f\u00bb ne sont plus maintenus, ils\n"+
    "sont remplacés par le script \u00ab\u202f[HFR] Smart Auto Rehost mod_r21\u202f\u00bb " +
    "version 6+ qui intègre la fonctionnalité stealth rehost.\n\n" +
    "Je vous invite donc à envisager la migration vers " +
    "\u00ab\u202f[HFR] Smart Auto Rehost mod_r21\u202f\u00bb version 6+.\n\n" +
    "Bonne journée."
  );
}
GM_registerMenuCommand("[HFR] stealth rehost -> information", display_info_smart_auto_rehost);


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
var sleathRehost = {
  get currentAliasUrl() {
    return GM_getValue("sr_alias_url", "reho.st");
  },
  launch: function() {
    var thisScript = this;
    var prefix1 = "http://reho.st";
    var prefix2 = "https://reho.st";
    Array.forEach(document.getElementsByTagName("img"), function(img) {
      if(img.src.substr(0, prefix1.length) == prefix1) {
        img.src = img.title = img.alt = "http://" + thisScript.currentAliasUrl + img.src.substr(prefix1.length);
      }
      if(img.src.substr(0, prefix2.length) == prefix2) {
        img.src = img.title = img.alt = "http://" + thisScript.currentAliasUrl + img.src.substr(prefix2.length);
      }
    });
    Array.forEach(document.getElementsByTagName("a"), function(a) {
      if(a.href.substr(0, prefix1.length) == prefix1) {
        a.href = "http://" + thisScript.currentAliasUrl + a.href.substr(prefix1.length);
      }
      if(a.href.substr(0, prefix2.length) == prefix2) {
        a.href = "http://" + thisScript.currentAliasUrl + a.href.substr(prefix2.length);
      }
    });
  }
};
sleathRehost.launch();
var cmScript = {
  backgroundDiv: null,
  configDiv: null,
  timer: null,
  aliases: null,
  aliasesUrl: "http://roger21.free.fr/hfr/stealthrehost.php",
  thumbUrl: "/gif/ac25a5d8d4a79449758c9ee51548652221dacb06.gif",
  retrieveAliasList: function(cbf) {
    GM_xmlhttpRequest({
      method: "GET",
      url: cmScript.aliasesUrl,
      onload: function(response) {
        var aliasNodes = new DOMParser().parseFromString(response.responseText, "text/xml").
        documentElement.getElementsByTagName("alias");
        cmScript.aliases = Array();
        Array.forEach(aliasNodes, function(aliasNode) {
          cmScript.aliases[aliasNode.getAttribute("name")] = aliasNode.getAttribute("domain");
        });
        cbf();
      }
    });
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
    if(!document.getElementById("sr_back")) {
      cmScript.backgroundDiv = document.createElement("div");
      cmScript.backgroundDiv.id = "sr_back";
      cmScript.backgroundDiv.addEventListener("click", function() {
        clearInterval(cmScript.timer);
        cmScript.hideConfigWindow();
      }, false);
      cssManager.addCssProperties("#sr_back{display:none;position:absolute;left:0px;top:0px;" +
        "background-color:#242424;z-index:1001;}");
      document.body.appendChild(cmScript.backgroundDiv);
    }
  },
  buildConfigWindow: function() {
    if(!document.getElementById("sr_front")) {
      cmScript.configDiv = document.createElement("div");
      cmScript.configDiv.id = "sr_front";
      cmScript.configDiv.style.width = "300px";
      cssManager.addCssProperties("#sr_front{display:none;vertical-align:bottom;height:110px;position:absolute;" +
        "background-color:#F7F7F7;z-index:1002;border:1px dotted #000;padding:8px;" +
        "text-align:center;font-family:Verdana,Arial,Sans-serif,Helvetica;}");
      cssManager.addCssProperties("#sr_front span{font-size:0.8em;}");
      cssManager.addCssProperties("#sr_front select{border:1px solid black;font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:0.75em;}");
      cssManager.addCssProperties("#sr_front img{display:block;margin-top:12px;margin-left:auto;margin-right:auto;}");
      cssManager.addCssProperties("#sr_front div{position:absolute;bottom:8px;right:8px;}");
      cssManager.addCssProperties("#sr_front input[type=image]{margin:2px;}");
      var label = document.createElement("span");
      label.innerHTML = "Choix de l'alias : ";
      cmScript.configDiv.appendChild(label);
      cmScript.retrieveAliasList(function() {
        var aliasList = document.createElement("select");
        aliasList.id = "sr_alias_url";
        aliasList.addEventListener("change", function() {
          this.nextSibling.style.display = "block";
          this.nextSibling.nextSibling.style.display = "none";
          this.nextSibling.nextSibling.src = "http://" + this.value + cmScript.thumbUrl;
          this.nextSibling.nextSibling.alt = "Alias indisponible";
        }, false);
        for(var name in cmScript.aliases) {
          var domain = cmScript.aliases[name];
          var alias = document.createElement("option");
          alias.value = domain;
          if(domain == sleathRehost.currentAliasUrl) alias.selected = "selected";
          alias.innerHTML = name;
          aliasList.appendChild(alias);
        }
        cmScript.configDiv.insertBefore(aliasList, cmScript.configDiv.firstChild.nextSibling);
      });
      var throbberImg = document.createElement("img");
      throbberImg.src = "data:image/gif;base64,R0lGODlhFAAUAKIFALW1tZmZmWZmZjMzMwAAAP%2F%2F%2FwAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQJCgAFACwEAAQADgAOAAADLVi6S8RQORfZfLXhzMbgiueB4keaABAJwpKmDMsqrxoEhdzS9o3PER8OdKskAAAh%2BQQJCQAFACwCAAgAEAAKAAADK1gA1f6EqMWei5FWW7BcHCQ5QcANg1WWD4o%2BqykIhZvC8ky%2FYaHTvccslAAAIfkECQkABQAsAgAEAA4ADgAAAy1YCqD%2BizX45KSOYRfC5p33heJYfoogUAThqOrTtilcDEMxu%2FWN5zTKL4fCQRIAIfkECQkABQAsAgACAAoAEAAAAylYugXAy7kVQpOq1ks1zBYkCF8xjt9JpmtZDEMJw98cEwRD4%2FjH575cAgAh%2BQQJCQAFACwCAAIADgAOAAADLFi6FcFQOReLEG0WANa92cZ11seMZBlxyjBUjOvCrUzXN0MQ%2Bb7fPh5QWEkAACH5BAkJAAUALAIAAgAQAAoAAAMqWLolwpA5F9cYbZYQ4L3ZxnXWx4xkGXEMQVQLABSuC8ty%2FVb4bMMFWSEBACH5BAkJAAUALAQAAgAOAA4AAAMtWKoz%2B681qAgp0gmxrMXaxhXetYgjaT4b5RZB8C5xPMP1jd8AoPc9HvDnUyQAACH5BAkJAAUALAgAAgAKABAAAAMqWETVros9uMoYr9477e4e6AgCSJLdWabrEwTg%2BzoAUMhwUdd3ru8gXicBADs%3D";
      throbberImg.style.marginTop = "27px";
      var newImg = document.createElement("img");
      newImg.src = "http://" + sleathRehost.currentAliasUrl + cmScript.thumbUrl;
      newImg.alt = "Alias indisponible";
      newImg.style.display = "none";
      newImg.addEventListener("load", function() {
        this.previousSibling.style.display = "none";
        this.style.display = "block";
        this.style.marginTop = "12px";
      }, false);
      newImg.addEventListener("error", function() {
        this.previousSibling.style.display = "none";
        this.style.display = "block";
        this.style.marginTop = "28px";
      }, false);
      cmScript.configDiv.appendChild(throbberImg);
      cmScript.configDiv.appendChild(newImg);
      var buttonsContainer = document.createElement("div");
      var inputOk = document.createElement("input");
      inputOk.type = "image";
      inputOk.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKfSURBVDjLpZPrS1NhHMf9O3bOdmwDCWREIYKEUHsVJBI7mg3FvCxL09290jZj2EyLMnJexkgpLbPUanNOberU5taUMnHZUULMvelCtWF0sW/n7MVMEiN64AsPD8/n83uucQDi/id/DBT4Dolypw/qsz0pTMbj/WHpiDgsdSUyUmeiPt2+V7SrIM+bSss8ySGdR4abQQv6lrui6VxsRonrGCS9VEjSQ9E7CtiqdOZ4UuTqnBHO1X7YXl6Daa4yGq7vWO1D40wVDtj4kWQbn94myPGkCDPdSesczE2sCZShwl8CzcwZ6NiUs6n2nYX99T1cnKqA2EKui6+TwphA5k4yqMayopU5mANV3lNQTBdCMVUA9VQh3GuDMHiVcLCS3J4jSLhCGmKCjBEx0xlshjXYhApfMZRP5CyYD+UkG08+xt+4wLVQZA1tzxthm2tEfD3JxARH7QkbD1ZuozaggdZbxK5kAIsf5qGaKMTY2lAU/rH5HW3PLsEwUYy+YCcERmIjJpDcpzb6l7th9KtQ69fi09ePUej9l7cx2DJbD7UrG3r3afQHOyCo+V3QQzE35pvQvnAZukk5zL5qRL59jsKbPzdheXoBZc4saFhBS6AO7V4zqCpiawuptwQG+UAa7Ct3UT0hh9p9EnXT5Vh6t4C22QaUDh6HwnECOmcO7K+6kW49DKqS2DrEZCtfuI+9GrNHg4fMHVSO5kE7nAPVkAxKBxcOzsajpS4Yh4ohUPPWKTUh3PaQEptIOr6BiJjcZXCwktaAGfrRIpwblqOV3YKdhfXOIvBLeREWpnd8ynsaSJoyESFphwTtfjN6X1jRO2+FxWtCWksqBApeiFIR9K6fiTpPiigDoadqCEag5YUFKl6Yrciw0VOlhOivv/Ff8wtn0KzlebrUYwAAAABJRU5ErkJggg==";
      inputOk.alt = "Valider";
      inputOk.addEventListener("click", cmScript.validateConfig, false);
      var inputCancel = document.createElement("input");
      inputCancel.type = "image";
      inputCancel.src = "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAIQdC4keDIwfDJQdCZkeCY4oGZArGpUyJJ02JKoZHK8dHboZC7UcIqghC6QtGbcmGrcpGqA2JK04JLwgLcoJCcsZGdIJEtkMGdkMHd4LGN4aKswkJsQjM84lNtMsPdkkMNskMtg9OuAZLOEkNsYzQswzQsw1RMs6Tss8TdYsQMZDV8ZHWMtEUsxBU8xDU85EUs5KW91CQt1FQt1HQt1ERN5NSN5MSd1OSdNFVNFPXt1NUN1RTt9TTtNUYdhYZd1fadNldNNre9Zre9hoc9hqddprdthqd9tvfN5wdt11fuBHR+BIReBVVeFeWuRkZORpaORvbOJxdeV1deV1duJ6fuJ6f+V7gduDkN2FkuCLk+CIlOKOmuKOm+iPkeqRjuWQk+WSnOWVmuaVm+iSleiWmOiWmeqYmOqanOmfpeylqPK6uPPBv/XLyfXKyvjX1fjX1vjc2/nd3Png3/ri4fni4vrm5fvo5/vp6fzs6/3z8/75+f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAAQABAAAAjBAP8JHEiwoMF/JDJgAHFw4AgVVrx4qeLBwkENQNBQadKEypkfDApuAHJmCRMaM2TUKOMjAsEPaJa0gYNDBJs5asxQGBjiypQbdPjE+aKHz5MkSCYIvEBmBw0nePhIXdMjh5YCAiuAcRrFjtQ6NmjA2EJAIAclUqDsEZqHzxseRIQkGNhBTBo+cmw4ueMmBZcFBCHoGGPkhIkSLVBwYXGgoIMYYYq8cHGky4oABx80GJIFSxAFBhoKlDBAAALRqAcGBAA7";
      inputCancel.alt = "Annuler";
      inputCancel.addEventListener("click", cmScript.hideConfigWindow, false);
      cmScript.disableTabDown(inputCancel);
      buttonsContainer.appendChild(inputOk);
      buttonsContainer.appendChild(inputCancel);
      cmScript.configDiv.appendChild(buttonsContainer);
      document.body.appendChild(cmScript.configDiv);
    }
  },
  validateConfig: function() {
    getElementByXpath(".//*[starts-with(@id, 'sr_')]", document.getElementById("sr_front")).forEach(function(input) {
      GM_setValue(input.id, input.value);
    });
    cmScript.hideConfigWindow();
  },
  initBackAndFront: function() {
    if(document.getElementById("sr_back")) {
      cmScript.setBackgroundPosition();
      cmScript.backgroundDiv.style.opacity = 0;
      cmScript.backgroundDiv.style.display = "block";
    }
    if(document.getElementById("sr_front")) {
      document.getElementById("sr_alias_url").value = sleathRehost.currentAliasUrl;
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
    GM_registerMenuCommand("[HFR] stealth rehost -> configuration", this.showConfigWindow);
  }
};
cmScript.setUp();
cmScript.createConfigMenu();


if(!info_smart_auto_rehost_displayed_once){
  display_info_smart_auto_rehost();
}
