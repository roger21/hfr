// ==UserScript==
// @name          [HFR] postal recall
// @version       1.3.2
// @namespace     roger21.free.fr
// @description   rajoute le nom du posteur en bas sur la partie gauche des posts, permet de savoir qui est l'auteur du post sur les posts longs sans avoir à revenir en haut du post
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 206 $

// historique :
// 1.3.2 (17/05/2018) :
// - suppression des @grant inutiles (tous)
// - maj de la metadata @homepageURL
// - passage de la hauteur minimal à 250
// 1.3.1 (28/11/2017) :
// - passage au https
// 1.3.0 (31/01/2016) :
// - meilleure gestion de la détection de la scrollbar horizontale
// - suppression des logs et du code commenté (nettoyage quoi)
// 1.2.0 (30/12/2015) :
// - meilleure gestion de la taille minimale pour l'ajout du recall
// - activation du script au lancement (pas seulement au scroll)
// 1.1.0 (29/12/2015) :
// - ajout d'une tempo (5sec) avant le lancement du script ->
// -> permet une meilleur gestion des zooms et de la présence ou non de la scrollbar
// 1.0.1 (27/12/2015) :
// - completement différent
// 0.9.0 (29/11/2015) :
// - création

window.setTimeout(function() {

  function getOffset(el) {
    let _x = 0;
    let _y = 0;
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

  function postalrecall(e) {
    scrollbar = document.documentElement.scrollWidth > document.documentElement.clientWidth ? scrollbarheight : 0;
    scrollcheat = scrollbar ? 1 : 0;
    if(oldprtop) {
      // oldprtop.style.display = "none";
      oldprtop.style.bottom = 0;
    }
    if(oldprbottom) {
      // oldprbottom.style.display = "none";
      oldprbottom.style.bottom = 0;
    }
    let postertop = document.elementFromPoint(posterleft, 0);
    if((postertop.nodeName.toUpperCase() === "TD") &&
      postertop.hasAttribute("class") &&
      (postertop.getAttribute("class") === "messCase1")) {
      let prtop = postertop.querySelector("div[postalrecall]");
      if(prtop) {
        // prtop.style.display = "block";
        oldprtop = prtop;
        if(((window.scrollY + window.innerHeight - scrollbar) >
            (getOffset(postertop).top + postertop.clientHeight)) ||
          ((window.scrollY + window.innerHeight - scrollbar) <
            (getOffset(postertop).top + minsize))) {
          prtop.style.bottom = 0;
        } else {
          prtop.style.bottom = ((getOffset(postertop).top + postertop.clientHeight) -
            (window.scrollY + window.innerHeight - scrollbar + scrollcheat)) + "px";
        }
      }
    }
    let posterbottom = document.elementFromPoint(posterleft, window.innerHeight - scrollbar - 1);
    if((posterbottom.nodeName.toUpperCase() === "TD") &&
      posterbottom.hasAttribute("class") &&
      (posterbottom.getAttribute("class") === "messCase1")) {
      let prbottom = posterbottom.querySelector("div[postalrecall]");
      if(prbottom) {
        // prbottom.style.display = "block";
        oldprbottom = prbottom;
        if(((window.scrollY + window.innerHeight - scrollbar) >
            (getOffset(posterbottom).top + posterbottom.clientHeight)) ||
          ((window.scrollY + window.innerHeight - scrollbar) <
            (getOffset(posterbottom).top + minsize))) {
          prbottom.style.bottom = 0;
        } else {
          prbottom.style.bottom = ((getOffset(posterbottom).top + posterbottom.clientHeight) -
            (window.scrollY + window.innerHeight - scrollbar + scrollcheat)) + "px";
        }
      }
    }
  }

  var messcase = false;
  var posterleft = 0;
  var oldprtop = null;
  var oldprbottom = null;
  var minsize = 250;
  var scrollbar = 0;
  var scrollcheat = 0;

  var scrolldiv = document.createElement("div");
  scrolldiv.style.width = "100px";
  scrolldiv.style.height = "100px";
  scrolldiv.style.overflow = "scroll";
  scrolldiv.style.position = "fixed";
  scrolldiv.style.top = "-9999px";
  scrolldiv.style.left = "-9999px";
  document.body.appendChild(scrolldiv);
  var scrollbarheight = scrolldiv.offsetHeight - scrolldiv.clientHeight;
  document.body.removeChild(scrolldiv);

  var posters = document.getElementById("mesdiscussions").querySelectorAll("table.messagetable td.messCase1");
  for(let poster of posters) {
    if(!messcase) {
      messcase = true;
    }
    if(!posterleft) {
      posterleft = getOffset(poster).left + 1;
    }
    if(poster.clientHeight > minsize) {
      poster.style.position = "relative";
      let pr_div = document.createElement("div");
      // pr_div.style.display = "none";
      pr_div.style.position = "absolute";
      pr_div.style.padding = "4px";
      pr_div.style.bottom = "0";
      pr_div.style.left = "0";
      pr_div.setAttribute("postalrecall", "postalrecall");
      let pr_b = document.createElement("b");
      pr_b.setAttribute("class", "s2");
      pr_b.appendChild(document.createTextNode(poster.querySelector("div > b.s2").textContent));
      pr_div.appendChild(pr_b);
      poster.appendChild(pr_div);
    }
  }

  if(messcase) {
    window.addEventListener("scroll", postalrecall, false);
    postalrecall();
  }

}, 5000);
