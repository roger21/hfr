// ==UserScript==
// @name          [HFR] Pas d'alerte
// @version       0.9.0
// @namespace     roger21.free.fr
// @description   Permet de savoir si une alerte de modération a été lancée en passant la souris sur le bouton.
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 436 $

// historique :
// 0.9.0 (15/08/2018) :
// - création

(function() {

  let throbber = "http://reho.st/self/1daeee82ec61ec02b32a5fb395032ce7694378ea.png";

  let ttt = [
    "https://forum-images.hardware.fr/images/perso/5/balledegolf.gif",
    "https://forum-images.hardware.fr/images/perso/3/sick-boy.gif",
    "https://forum-images.hardware.fr/images/perso/1/fdaniel.gif",
    "https://forum-images.hardware.fr/images/perso/roger21.gif",
  ];

  let ouf = [
    "https://forum-images.hardware.fr/images/perso/sebxoii.gif",
    "https://forum-images.hardware.fr/images/perso/bakk38.gif",
    "https://forum-images.hardware.fr/images/perso/2/moonbloood.gif",
    "https://forum-images.hardware.fr/images/perso/10/anakronik.gif",
    "https://forum-images.hardware.fr/images/perso/3/roger21.gif",
  ];

  let style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent = "#hfr_gm_pda_r21_popup img{display:block;border-radius:8px;}" +
    "#hfr_gm_pda_r21_popup{position:absolute;width:70px;height:50px;z-index:1002;padding:4px;" +
    "display:flex;visibility:hidden;opacity:0;transition:opacity 0.5s ease-in-out 0s;" +
    "align-items:center;justify-content:center;border:2px solid grey;border-radius:12px;}" +
    ".hfr_gm_pda_r21_white{background:#e5e5e5;}" +
    ".hfr_gm_pda_r21_green{background:#2ecc40;}" +
    ".hfr_gm_pda_r21_red{background:#ff4136;}" +
    "img.hfr_gm_pda_r21_white{background:transparent;border-radius:unset;box-shadow:unset;}" +
    "img.hfr_gm_pda_r21_green{border-radius:8px;box-shadow:0 0 8px 0 #2ecc40;}" +
    "img.hfr_gm_pda_r21_red{border-radius:8px;box-shadow:0 0 8px 0 #ff4136;}" +
    "#hfr_gm_pda_r21_popup:before{content:\"\";position:absolute;border:9px solid transparent;" +
    "top:58px;border-top-color:grey;right:10px;}" +
    "#hfr_gm_pda_r21_popup:after{content:\"\";position:absolute;border:6px solid transparent;" +
    "top:58px;right:13px;}" +
    "#hfr_gm_pda_r21_popup.hfr_gm_pda_r21_white:after{border-top-color:#e5e5e5;}" +
    "#hfr_gm_pda_r21_popup.hfr_gm_pda_r21_green:after{border-top-color:#2ecc40;}" +
    "#hfr_gm_pda_r21_popup.hfr_gm_pda_r21_red:after{border-top-color:#ff4136;}";
  document.getElementsByTagName("head")[0].appendChild(style);

  let popup = document.createElement("div");
  popup.id = "hfr_gm_pda_r21_popup";
  popup.addEventListener("transitionend", transitionend, false);
  let popupimg = document.createElement("img");
  popup.appendChild(popupimg);
  document.body.appendChild(popup);

  let timer = null;
  let target = null;
  let targetoffset = null;

  function offset(e) {
    let x = 0;
    let y = 0;
    while(e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop)) {
      x += e.offsetLeft - e.scrollLeft;
      y += e.offsetTop - e.scrollTop;
      e = e.offsetParent;
    }
    return {
      left: x,
      top: y,
    };
  }

  function updateimg() {
    fetch(target.parentElement.href, {
      method: "GET",
      mode: "same-origin",
      credentials: "same-origin",
      cache: "reload",
      referrer: "",
      referrerPolicy: "no-referrer"
    }).then(function(r) {
      return r.text();
    }).then(function(r) {
      if(r.includes("Ce formulaire est destiné UNIQUEMENT à demander aux modérateurs de venir sur le sujet lorsqu'il y a un problème.")) {
        popupimg.src = ouf[Math.floor(Math.random() * ouf.length)];
        popup.className = "hfr_gm_pda_r21_green";
        target.className = "hfr_gm_pda_r21_green";
      } else {
        popupimg.src = ttt[Math.floor(Math.random() * ttt.length)];
        popup.className = "hfr_gm_pda_r21_red";
        target.className = "hfr_gm_pda_r21_red";
      }
    }).catch(function(e) {
      console.log("[HFR] Pas d'alerte ERROR fetch target : " + e);
    });
  }

  function transitionend() {
    if(popup.style.opacity === "0") {
      popup.style.visibility = "hidden";
    }
  }

  function showpopup(e) {
    window.clearTimeout(timer);
    target = this;
    timer = window.setTimeout(updateimg, 421);
    targetoffset = offset(target);
    popupimg.src = throbber;
    popup.className = "hfr_gm_pda_r21_white";
    target.className = "hfr_gm_pda_r21_white";
    popup.style.left = (targetoffset.left - 70 - 8 - 4 + 30) + "px";
    popup.style.top = (targetoffset.top - 50 - 8 - 4 - 15) + "px";
    popup.style.visibility = "visible";
    popup.style.opacity = "1";
  }

  function hidepopup(e) {
    window.clearTimeout(timer);
    popup.style.opacity = "0";
  }

  var boutons = document.querySelectorAll("a[href^=\"/user/modo.php?\"] img[src$=\"exclam.gif\"]");
  for(let bouton of boutons) {
    bouton.parentElement.removeAttribute("title");
    bouton.addEventListener("mouseover", showpopup, false);
    bouton.addEventListener("mouseout", hidepopup, false);
  }

})();
