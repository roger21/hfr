// ==UserScript==
// @name          [HFR] smart auto rehost mod_r21
// @version       5.4.5
// @namespace     http://mycrub.info
// @description   Rehost automatiquement (sur reho.st) les images provenant d'une liste modifiable de sites donnés
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @author        mycrub
// @modifications ajout du support pour reho.st et ajout du traitement des liens vers des images en plus des images
// @modtype       évolution de fonctionnalités
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @connect       *
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// ==/UserScript==

// modifications roger21 $Rev: 433 $

// historique :
// 5.4.5 (15/08/2018) :
// - correction de l'ajout du burger pour éviter d'en avoir deux, signalé par minipouss :jap:
// - et suppression des getElementByXpath remplacés par des querySelector si besoin
// 5.4.4 (13/08/2018) :
// - correction d'une fôte, signalée par minipouss :jap:
// 5.4.3 (10/06/2018) :
// - amélioration de la regexp de détection des gifs
// - exclusion des gifs de la détection du content-type
// 5.4.2 (13/05/2018) :
// - ajout de la metadata @connect pour tm
// - ajout d'une protection suplémentaire sur les liens en forum.hardware.fr
// - petites optimisations et améliorations (oui encore) du code
// - maj de la metadata @homepageURL
// 5.4.1 (28/04/2018) :
// - petites améliorations du code et check du code dans tm
// - suppression des @grant inutiles
// 5.4.0 (06/12/2017) :
// - passage au https pour reho.st avec convesion auto du site de reho.st
// 5.3.2 (28/11/2017) :
// - passage au https
// 5.3.1 (11/02/2017) :
// - correction du style font-fammily à Verdana,Arial,Sans-serif,Helvetica (HFR Style)
// 5.3.0 (16/12/2016) :
// - désactivation du rehostage des .gif (trop gros passera pas)
// 5.2.0 (15/12/2016) :
// - tri des listes d'hosts dans la fenêtre de configuration
// - meilleure gestion de l'affichage des données dans la fenêtre de configuration
// - correction des polices et de leur tailles dans la fenêtre de configuration
// - légère remise en forme de la fenêtre de configuration
// 5.1.3 (15/08/2016) :
// - correction du string.contains en string.includes (par cytrouille pour firefox 48+)
// 5.1.2 (19/04/2016) :
// - ajout du mode anonyme de GM_xmlhttpRequest (GM 3.8)
// 5.1.1 (24/11/2015) :
// - correction de la regexp du content-type pour matcher image/jpg (qui n'existe pas !)
// - légère modification de la regexp du content-type (plus robuste ?)
// 5.1.0 (22/11/2015) :
// - correction d'une connerie (bravo!) dans la detection du content-type
// - amélioration du code pour marquer que le lien est reho.sté
// - nouveau nom : [HFR] Smart Auto Rehost mod_r21 -> [HFR] smart auto rehost mod_r21
// 5.0.0 (21/11/2015) :
// - desactivation des spellcheck dans la fenetre de conf
// - ajout de l'ouverture de la fenetre de conf en double cliquant sur le burger
// - modification du title sur le burger
// - légères modification de code et des noms des fonctions
// - suppression d'une ligne vide
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - remplacement des ' par des " (pasque !)
// - ajout du traitement des liens vers des images ->
// permet notamment à [HFR] Image quote preview de prendre l'url de rehost au lieu de l'url source ->
// (quand le rehost est apliqué à cet host)
// - ajout d'un test sur la detection des nouveaux hosts a réhoster pour eviter de laisser passer ->
// un bug avec les url en data:image
// - lors de l'ajout d'un host à rehoster, retraitetement de la page entière, pas seulment du post concerné ->
// le même host peut être utilisé dans d'autres posts, autant tout traiter
// - nouveau numéro de version : 4.0.7 -> 5.0.0
// - nouveau nom : [HFR] Smart Auto Rehost -> [HFR] Smart Auto Rehost mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 4.0.7 (17/10/2015) :
// - génocide de code non utilisé et de commentaires
// - uniformisation du nom du script : "Auto Rehost" -> "Smart Auto Rehost"
// 4.0.6.14 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 4.0.6.13 (20/01/15) :
// - suppression du support de hfr-rehost.net
// 4.0.6.12 (19/01/2015) :
// - compactage du css
// - reencodage des images en base64
// - decoupage des lignes de code trop longue
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - suppression de certains commentaires inutiles
// - suppression de bouts de code mort
// - suppression de code commenté (log et dé-rehostage)
// - suppression du module d'auto-update (code mort)
// 4.0.6.11 (06/04/2014) :
// - suppression du systeme de dé-rehostage qui sert (plus) à rien et qui pue
// 4.0.6.10 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 4.0.6.9 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 4.0.6.8 (25/10/2013) :
// - ajout d'un . dans Rehosted (Reho.sted) dans les titles et alt
// 4.0.6.7 (10/10/2013) :
// - passage de http://hfr-rehost.net/ à http://reho.st/ pour le rehost
// 4.0.6.6 (22/11/2012) :
// - ajout du support pour le https
// 4.0.6.5 (22/11/2012) :
// - nouveau code pour le dé-rehostage (check avant rehost au lieu de corriger apreès rehost) c'est plus léger
// 4.0.6.4 (21/11/2012) :
// - ajout d'un test de dé-rehostage (quand hfr-rehost ne renvoie rien) ->
// en attente d'une nouvelle image "trop gros, passera pas"
// 4.0.6.3 (14/09/2012) :
// - ajout des metadata @grant
// 4.0.6.2 (30/08/2012) :
// - modification des attributs alt et title en cas de un-rehostage
// - ajout de l'historique
// - gestion des atttributs avec les methodes accesseurs
// 4.0.6.1 (05/08/2012) :
// - ajout d'un caca pour un-rehoster les images trop grosses (selon hfr-rehost.net)
// - commentage du log (on s'en branle :o )
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

var doubleClickInterval = 250;
var lastClickTime = 0;

var rehost = GM_getValue("ar_rehost_site", "https://reho.st/");
if(rehost === "http://hfr-rehost.net/" || rehost === "http://reho.st/") {
  GM_setValue("ar_rehost_site", "https://reho.st/");
  rehost = "https://reho.st/";
}

var gifre = /.*\.gif([&?].*)?$/i;

function processImgs(node) {
  let toRehost = getRehostableRegExps();
  let imgs = node.querySelectorAll("td.messCase2 > div[id^='para'] img");
  for(let img of imgs) {
    let src = img.src;
    if(src && !gifre.test(src)) {
      for(let j = 0; j < toRehost.length; ++j) {
        if(src.match(toRehost[j])) {
          img.setAttribute("alt", "Reho.sted: " + src);
          img.setAttribute("title", "Reho.sted: " + src);
          img.setAttribute("src", rehost + src);
        }
      }
    }
  }
}

function processLinks(node) {
  let toRehost = getRehostableRegExps();
  let links = node.querySelectorAll("td.messCase2 > div[id^='para'] a");
  for(let link of links) {
    let href = link.href;
    if(href && !gifre.test(href) && href.match(/^https?:\/\/forum\.hardware\.fr\/.*$/g) === null) {
      for(let j = 0; j < toRehost.length; ++j) {
        if(href.match(toRehost[j])) {
          GM_xmlhttpRequest({
            method: "HEAD",
            url: href,
            mozAnon: true,
            anonymous: true,
            onload: function(r) {
              if(r.responseHeaders.match(/^.*content-type.*image\/(?:jpe?g|png).*$/im)) {
                link.setAttribute("href", rehost + href);
                if(link.firstChild && link.firstChild.nodeType === 3) {
                  link.insertBefore(document.createTextNode("Reho.sted: "), link.firstChild);
                }
              }
            }
          });
        }
      }
    }
  }
}

function getRehostableRegExps() {
  let rehostables = getCurrentRehostables().split("\n");
  let result = [];
  for(let i = 0; i < rehostables.length; ++i) {
    if(rehostables[i] && rehostables[i].length > 0) {
      result[result.length] = "^https?://([^/:])*" + rehostables[i] + "/.*";
    }
  }
  return result;
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
};

function getCurrentImgUrl() {
  return GM_getValue("ar_icon", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAMAAAAs2N9uAAAAAXNSR0IArs4c6QAAAwBQTFRFAAAAgAAAAIAAgIAAAACAgACAAICAgICAwMDA/wAAAP8A//8AAAD//wD/AP//////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzAABmAACZAADMAAD/ADMAADMzADNmADOZADPMADP/AGYAAGYzAGZmAGaZAGbMAGb/AJkAAJkzAJlmAJmZAJnMAJn/AMwAAMwzAMxmAMyZAMzMAMz/AP8AAP8zAP9mAP+ZAP/MAP//MwAAMwAzMwBmMwCZMwDMMwD/MzMAMzMzMzNmMzOZMzPMMzP/M2YAM2YzM2ZmM2aZM2bMM2b/M5kAM5kzM5lmM5mZM5nMM5n/M8wAM8wzM8xmM8yZM8zMM8z/M/8AM/8zM/9mM/+ZM//MM///ZgAAZgAzZgBmZgCZZgDMZgD/ZjMAZjMzZjNmZjOZZjPMZjP/ZmYAZmYzZmZmZmaZZmbMZmb/ZpkAZpkzZplmZpmZZpnMZpn/ZswAZswzZsxmZsyZZszMZsz/Zv8AZv8zZv9mZv+ZZv/MZv//mQAAmQAzmQBmmQCZmQDMmQD/mTMAmTMzmTNmmTOZmTPMmTP/mWYAmWYzmWZmmWaZmWbMmWb/mZkAmZkzmZlmmZmZmZnMmZn/mcwAmcwzmcxmmcyZmczMmcz/mf8Amf8zmf9mmf+Zmf/Mmf//zAAAzAAzzABmzACZzADMzAD/zDMAzDMzzDNmzDOZzDPMzDP/zGYAzGYzzGZmzGaZzGbMzGb/zJkAzJkzzJlmzJmZzJnMzJn/zMwAzMwzzMxmzMyZzMzMzMz/zP8AzP8zzP9mzP+ZzP/MzP///wAA/wAz/wBm/wCZ/wDM/wD//zMA/zMz/zNm/zOZ/zPM/zP//2YA/2Yz/2Zm/2aZ/2bM/2b//5kA/5kz/5lm/5mZ/5nM/5n//8wA/8wz/8xm/8yZ/8zM/8z///8A//8z//9m//+Z///M////RGKwUAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QYQCDgpfYIwVwAAAKJJREFUGNN10DEOwyAMBdBIHXo/OvUisOC74C5JlpyiWcBdwj1KF8ga22nVdsiXkNCTsWW67jA35Aw/AJg4jSj/QSm1tXed8yHFWJSy2ugw3IVqbeuqBBbnOcWnFi0gdHEoVmJphBayEqD2D54DD6azMXL31vKhLDReh2nqvfF46pes1AGAD/KU++8ThfZm9UWflRzPxDklRPru7ByPpeNP2QA+xXyJjelK2QAAAABJRU5ErkJggg==");
}

function getCurrentRehostables() {
  return GM_getValue("ar_rehost_hostnames", "xs.to\nebaumsworld.com\nexplosm.net\ntinypic.com\nthreadbombing.com\nnoelshack.com\nggpht.com\nmyspacecdn.com\nmegaportail.com\nimagup.com\nxkcd.com\nskyrock.com\nytmnd.com\ni.pbase.com\nencyclopediadramatica.com\nlivejournal.com\nmuchosucko.com\ntinypic.com\nmoviesmedia.ign.com\ndvdrama.com\nsmugmug.com\nimagup.com\nhotflick.net\nchickencrap.com\nkoreus.com\nworldofwarcraft.com\njeuxvideo.com\njoystiq.com\nstereomaker.net\nimageshack.us\nwordpress.com\nbouletcorp.com\ndeviantart.com\nnofrag.com\nalkaspace.com\njj.am\ninexes.com\nmmo-champion.com\nlolpix.com\ngiftube.com\nflickr.com\nfacebook.com\nphotobucket.com\nnnm.ru\nse7en.ru\nb3ta.com\nimagehaven.net\nzimagez.com\nafrojacks.com\ncanardpc.com\ngopix.fr\njudgehype.com\nfohguild.org\nno-ip.org\narchive-host.com\nlelombrik.net\nhaluze.sk\nhostingpics.net\nfbcdn.net\nseries-80.net\ndrugs-plaza.com\nfree.fr\ndynamictic.info\nratemyeverything.net\nsmog.pl\nuppix.net\necho.cx\ntuxboard.com\nhumour.com\nmac.com\ntbn..google.com\n4gifs.com\nleboncoin.fr");
}

function getCurrentBl() {
  let temp = GM_getValue("ar_bl_hostnames", "hardware.fr\nreho.st");
  if(!temp.includes("reho.st")) {
    temp += "\nreho.st";
    GM_setValue("ar_bl_hostnames", temp);
  }
  return (temp);
}

var hostRegExp = new RegExp("^https?://([^/]*\\.)*([^\\./]+\\.[^\./]+)/.*", "i");

function getHostname(url) {
  let ex = hostRegExp.exec(url);
  return (ex && ex.length > 0) ? ex[2] : null;
}

var cmScript = {
  backgroundDiv: null,

  configDiv: null,

  timer: null,

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
    let key = event.which;
    if(key == 27) {
      clearInterval(cmScript.timer);
      cmScript.hideConfigWindow();
    } else if(event.altKey || (event.target.nodeName.toLowerCase() != "input" && key >= 33 && key <= 40)) {
      event.preventDefault();
    }
  },

  disableTabUp: function(elt) {
    elt.addEventListener("keydown", function(event) {
      let key = event.which;
      if(key == 9 && event.shiftKey) event.preventDefault();
    }, false);
  },

  disableTabDown: function(elt) {
    elt.addEventListener("keydown", function(event) {
      let key = event.which;
      if(key == 9 && !event.shiftKey) event.preventDefault();
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
    } else {
      cmScript.enableScroll();
      window.removeEventListener("resize", cmScript.setDivsPosition, false);
    }
  },

  buildBackground: function() {
    if(!document.getElementById("ar_back")) {
      cmScript.backgroundDiv = document.createElement("div");
      cmScript.backgroundDiv.id = "ar_back";
      cmScript.backgroundDiv.addEventListener("click", function() {
        clearInterval(cmScript.timer);
        cmScript.hideConfigWindow();
      }, false);
      cssManager.addCssProperties("#ar_back{display:none;position:absolute;left:0px;top:0px;" +
        "background-color:#242424;z-index:1001;}");
      document.body.appendChild(cmScript.backgroundDiv);
    }
  },

  buildConfigWindow: function() {
    if(top.location != self.document.location) {
      return;
    }

    if(!document.getElementById("ar_front")) {
      cmScript.configDiv = document.createElement("div");
      cmScript.configDiv.id = "ar_front";
      cmScript.configDiv.style.width = "400px";
      cssManager.addCssProperties("#ar_front{display:none;vertical-align:bottom;position:absolute;" +
        "background-color:#F7F7F7;z-index:1003;border:1px dotted #000;" +
        "padding:16px;text-align:center;font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:14px;}");
      cssManager.addCssProperties("#ar_front span.sar_title{font-size:16px;}");
      cssManager.addCssProperties("#ar_front input,#ar_front textarea{font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:13px;}");
      cssManager.addCssProperties("#ar_front div{margin-top:16px;text-align:right;}");
      cssManager.addCssProperties("#ar_front div input[type=image]{margin-left:8px;cursor:pointer;}");

      let label = document.createElement("span");
      label.setAttribute("class", "sar_title");
      label.innerHTML = "<b>Conf du script [HFR] smart auto rehost</b>";
      cmScript.configDiv.appendChild(label);

      let iconContainer = document.createElement("p");
      let iconLabel = document.createElement("span");
      iconLabel.innerHTML = "Icone du bouton : ";
      iconContainer.appendChild(iconLabel);
      let inputIcon = document.createElement("input");
      inputIcon.type = "text";
      inputIcon.spellcheck = false;
      inputIcon.id = "ar_icon";
      inputIcon.size = "45";
      iconContainer.appendChild(inputIcon);
      cmScript.configDiv.appendChild(iconContainer);

      let rehostSiteContainer = document.createElement("p");
      let rehostSiteLabel = document.createElement("span");
      rehostSiteLabel.innerHTML = "Site de rehost : ";
      rehostSiteContainer.appendChild(rehostSiteLabel);
      let inputRehostSite = document.createElement("input");
      inputRehostSite.type = "text";
      inputRehostSite.spellcheck = false;
      inputRehostSite.id = "ar_rehost_site";
      inputRehostSite.size = "45";
      rehostSiteContainer.appendChild(inputRehostSite);
      cmScript.configDiv.appendChild(rehostSiteContainer);

      let rehostListContainer = document.createElement("p");
      let rehostListLabel = document.createElement("span");
      rehostListLabel.innerHTML = "Noms de domaine à rehoster : ";
      rehostListContainer.appendChild(rehostListLabel);
      let inputRehostList = document.createElement("textarea");
      inputRehostList.spellcheck = false;
      inputRehostList.id = "ar_rehost_hostnames";
      inputRehostList.cols = "45";
      inputRehostList.rows = "8";
      rehostListContainer.appendChild(inputRehostList);
      cmScript.configDiv.appendChild(rehostListContainer);

      let blackListContainer = document.createElement("p");
      let blackListLabel = document.createElement("span");
      blackListLabel.innerHTML = "Noms de domaine à <b>NE PAS</b> rehoster : ";
      blackListContainer.appendChild(blackListLabel);
      let blackRehostList = document.createElement("textarea");
      blackRehostList.spellcheck = false;
      blackRehostList.id = "ar_bl_hostnames";
      blackRehostList.cols = "45";
      blackRehostList.rows = "3";
      blackListContainer.appendChild(blackRehostList);
      cmScript.configDiv.appendChild(blackListContainer);

      let buttonsContainer = document.createElement("div");
      let inputOk = document.createElement("input");
      inputOk.type = "image";
      inputOk.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKfSURBVDjLpZPrS1NhHMf9O3bOdmwDCWREIYKEUHsVJBI7mg3FvCxL09290jZj2EyLMnJexkgpLbPUanNOberU5taUMnHZUULMvelCtWF0sW%2Fn7MVMEiN64AsPD8%2Fn83uucQDi%2Fid%2FDBT4Dolypw%2Fqsz0pTMbj%2FWHpiDgsdSUyUmeiPt2%2BV7SrIM%2BbSss8ySGdR4abQQv6lrui6VxsRonrGCS9VEjSQ9E7CtiqdOZ4UuTqnBHO1X7YXl6Daa4yGq7vWO1D40wVDtj4kWQbn94myPGkCDPdSesczE2sCZShwl8CzcwZ6NiUs6n2nYX99T1cnKqA2EKui6%2BTwphA5k4yqMayopU5mANV3lNQTBdCMVUA9VQh3GuDMHiVcLCS3J4jSLhCGmKCjBEx0xlshjXYhApfMZRP5CyYD%2BUkG08%2Bxt%2B4wLVQZA1tzxthm2tEfD3JxARH7QkbD1ZuozaggdZbxK5kAIsf5qGaKMTY2lAU%2FrH5HW3PLsEwUYy%2BYCcERmIjJpDcpzb6l7th9KtQ69fi09ePUej9l7cx2DJbD7UrG3r3afQHOyCo%2BV3QQzE35pvQvnAZukk5zL5qRL59jsKbPzdheXoBZc4saFhBS6AO7V4zqCpiawuptwQG%2BUAa7Ct3UT0hh9p9EnXT5Vh6t4C22QaUDh6HwnECOmcO7K%2B6kW49DKqS2DrEZCtfuI%2B9GrNHg4fMHVSO5kE7nAPVkAxKBxcOzsajpS4Yh4ohUPPWKTUh3PaQEptIOr6BiJjcZXCwktaAGfrRIpwblqOV3YKdhfXOIvBLeREWpnd8ynsaSJoyESFphwTtfjN6X1jRO2%2BFxWtCWksqBApeiFIR9K6fiTpPiigDoadqCEag5YUFKl6Yrciw0VOlhOivv%2FFf8wtn0KzlebrUYwAAAABJRU5ErkJggg%3D%3D";
      inputOk.alt = "Valider";
      inputOk.addEventListener("click", cmScript.validateConfig, false);

      let inputCancel = document.createElement("input");
      inputCancel.type = "image";
      inputCancel.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184%2Bd18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX%2BAv2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30%2BNlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2%2BDl1h7IdA%2Bi97A%2FgeP65WhbmrnZZ0GIJpr6OqZqYAd5%2FgJpKox4Mg7pD2YoC2b0%2F54rJQuJZdm6Izcgma4TW1WZ0h%2By8BfbyJMwBmSxkjw%2BVObNanp5h%2FadwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1%2FvwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY%2BP8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok%2BnsNTipIEVnkywo%2FFHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa%2BDt9XfxoFSNYF%2FBh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs%2FQZyu6TH2%2B2%2BFAAAAABJRU5ErkJggg%3D%3D";
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
    let inputs = document.getElementById("ar_front").querySelectorAll("*[id^=\"ar_\"]");
    for(let input of inputs) {
      GM_setValue(input.id, input.value);
    }
    cmScript.hideConfigWindow();
  },

  initBackAndFront: function() {
    if(document.getElementById("ar_back")) {
      cmScript.setBackgroundPosition();
      cmScript.backgroundDiv.style.opacity = 0;
      cmScript.backgroundDiv.style.display = "block";
    }
  },

  showConfigWindow: function() {
    cmScript.alterWindow(true);
    cmScript.initBackAndFront();
    let opacity = 0;
    cmScript.timer = setInterval(function() {
      opacity = Math.round((opacity + 0.1) * 100) / 100;
      cmScript.backgroundDiv.style.opacity = opacity;
      if(opacity >= 0.8) {
        clearInterval(cmScript.timer);
        cmScript.configDiv.querySelector("#ar_icon").value = getCurrentImgUrl();
        cmScript.configDiv.querySelector("#ar_rehost_site").value = GM_getValue("ar_rehost_site", "https://reho.st/");
        cmScript.configDiv.querySelector("#ar_rehost_hostnames").value = getCurrentRehostables().split("\n").sort().join("\n").trim();
        cmScript.configDiv.querySelector("#ar_bl_hostnames").value = getCurrentBl().split("\n").sort().join("\n").trim();
        cmScript.configDiv.style.display = "block";
        cmScript.setConfigWindowPosition();
      }
    }, 1);
  },

  hideConfigWindow: function() {
    cmScript.configDiv.style.display = "none";
    let opacity = cmScript.backgroundDiv.style.opacity;
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
    GM_registerMenuCommand("[HFR] smart auto rehost -> configuration", this.showConfigWindow);
  }
};

cmScript.setUp();
cmScript.createConfigMenu();
processImgs(document);
processLinks(document);

var root = document.getElementById("mesdiscussions");
var toolbars = root.querySelectorAll("table.messagetable tr.message td.messCase2 div.toolbar");
for(let toolbar of toolbars) {
  let newImg = document.createElement("img");
  newImg.src = getCurrentImgUrl();
  newImg.alt = newImg.title = "clic -> rehoster les images\n" +
    "double-clic -> ouvrir la fenêtre de configuration";
  newImg.style.cursor = "pointer";
  newImg.style.marginRight = "3px";
  newImg.addEventListener("click",
    function(event) {
      let clickTime = new Date().getTime();
      if(clickTime - lastClickTime > doubleClickInterval) {
        lastClickTime = clickTime;
        setTimeout(
          function() {
            if(lastClickTime == clickTime) {
              let knownHosts = getCurrentRehostables().split("\n");
              let blHosts = getCurrentBl().split("\n");
              let imgs = toolbar.nextSibling.getElementsByTagName("img");
              let hostnames = [];
              for(let i = 0; i < imgs.length; ++i) {
                let host = getHostname(imgs[i].src);
                if(host) {
                  let isKnown = false;
                  for(let j = 0; j < blHosts.length && !isKnown; ++j) {
                    if(blHosts[j] == host) {
                      isKnown = true;
                    }
                  }
                  for(let k = 0; k < knownHosts.length && !isKnown; ++k) {
                    if(knownHosts[k] == host) {
                      isKnown = true;
                    }
                  }
                  if(!isKnown) {
                    hostnames[hostnames.length] = host;
                    knownHosts[knownHosts.length] = host;
                  }
                }
              }
              if(hostnames.length > 0) {
                if(confirm("Voulez-vous rehoster les serveurs suivants :\n" + hostnames.join("\n"))) {
                  GM_setValue("ar_rehost_hostnames", knownHosts.join("\n"));
                  processImgs(document);
                  processLinks(document);
                }
              } else {
                alert("Rien de neuf à rehoster");
              }
            }
          }, doubleClickInterval);
      } else {
        lastClickTime = clickTime;
        cmScript.showConfigWindow();
      }
    }, false);
  let newDiv = document.createElement("div");
  newDiv.className = "right";
  newDiv.appendChild(newImg);
  toolbar.insertBefore(newDiv, toolbar.lastChild);
}
