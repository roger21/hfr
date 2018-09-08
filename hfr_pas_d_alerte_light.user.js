// ==UserScript==
// @name          [HFR] Pas d'alerte light
// @version       0.9.1
// @namespace     roger21.free.fr
// @description   Permet de savoir - de manière légère et rapide - si une alerte de modération a été lancée en passant la souris sur le bouton.
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 474 $

// historique :
// 0.9.1 (20/08/2018) :
// - ajout d'une gestion du changement de l'image du bouton au lieu de l'effet shadow ->
// désactivé par défaut, mettre la variable icons à true dans le code pour pour l'utiliser
// - désactivation du check à chaque passage de souris et ajout d'une option pour le ré-autoriser
// - ajout d'une tempo de 200ms (pasque faut pas déconner)
// 0.9.0 (18/08/2018) :
// - création


// à mettre à true pour utiliser des images plutôt que l'effet shadow
var icons = false; // true ou false

// et vous pouvez changer les images ici (en url ou en data)
var ouf = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACHklEQVR42q2T60sUYRTG%2FVt2v5WihaaipRBEUV5HSzHSRFFKYzOJvMyI2tbiZWNTUwTZkhTJjUgryrDLrvf7BUwdRUN2v%2FZhl%2F1mj%2Be88M6yIH5y4MAMM7%2Fnec55z0REnPZVvvjSXLbgUIvn2%2FW7c23%2BorlWf8GMTc%2BbfqbmTDWZT4QJVAj0EYi2LRece99E8X3%2BzHOkezTfdU%2B9cixcMm9nOFC37oTrwIOWzXe4t9ghyvZnCMMHblSv9uLyr8eB1J%2FV4SIEmiiqV8L0LOrw%2F6GoO7MtIsHbv%2BOoWOrExa8Wb%2FLnByZDgGCNKgzmZylA%2FSN3qhnZk414vTeGK79rkOgq1wwB%2BkDnPjkqg9JRCjCYMdGAGx4VT9b6wEnjB0p0Q4A%2BCPbvfwfNQYDSUQoweNVdK5yvuevg2P6AOGdR0BCgyQZ52uwuo7Lj8r8dIcAgDQ80PHFv33qP8923QwL0UrduDEJbf2NEZcenGwPo2f0kwJTxKlwas4D2BA9XehDjyAu1QC81SiHOXEZlR9kCgzR5JI9WivhJH%2B8juj03NEQ%2BkqSRCm%2Fpwgv07n4xHPncuRhkiOFb01ZE2bK9kdYsU9guJAyXKfGDpQHewq6dEVQudSHlxyMhRBsqYJ4PgYHI5szjt%2FFCf7ES21foo0SwLHeD58JzYDEyAIG%2Bs43pyon%2Fw7lXBeaYjnw12n5Tpz79FNdPrjqB6pmGNPOp%2F71Hj9TBXSsdptUAAAAASUVORK5CYII%3D";
var ttt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACSElEQVQ4y62TPUyTYRDH%2F1agCFh5JUEosQgtDCYsEl0Mg8EQB%2BPSxRA%2BEib8QBM3nVx1ZTIxKvKhDk2cNCExDg6GRAUxmBZKUbRFPopFaWnf57n%2F49DkLUiY9MZL7ve7u9wB%2Fxj7%2Fk4MXVF%2BY0wnyR6SNRQDkj9IPiY5dnXYmt8T8OiyHTTGDOridK0vUIIKTxEA4PeGQiycgZ1yLZEcuPHsSGgX4OGlXJDkkMdnlzcEypBc1Fj5agAA1T4XDvtcmAv%2FwrfpbJpk783nvpADeNCfbaSRN9ZR5a1vKsfHcRsA0He%2FDABwr28TAHCiowSRmQ3MfdhMuIy03X7ZFHMBgFbSJSWZHcUAndFIQhnB2xcZNB734ECV8W7ZugsA8gCtu%2BsDpVheEACEIqEK9VAkROch8fkc%2FC2HoJTqLgBE1XmsYqx%2B0VAsGB2AESgjEBIL0SwOWsXQWtcVAEogxuTNRhzj4owCAAiJnAhsEZCEIaC1xvYR4uvJHKp8LqdVZQRTr7bw%2BukmbBEHXnOsCMm1DLSS%2BHbAcGQ6heqG%2FU6rORFcuObBmYsVUEZAk7d7%2FW6E361Aaz3sAJRSI6mEnQh%2F%2BomT58oc49jddYzeSeZ3QqLtfCXCk6uIz6YSWuuRHYd0q30mmNMcaj5VWR5osfA9lkUsmoUxBvV%2BN%2Boa3IhMreH9%2BGKaZO9IpD2065Svn54Misig5S2tbW6tgsdywxiDjfUsPk8sIxFNLZEcGJ09G9rzmfpbJ%2FwkO0n2iEgNyR3P9CTaMY%2F%2FGX8AjJyPf96i%2B6EAAAAASUVORK5CYII%3D";

// à mettre à true pour autoriser la verification à chaque passage de la souris
var check_every_time = false; // true ou false


let style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  "img.hfr_gm_pdal_r21_white{background:transparent;border-radius:unset;box-shadow:unset;}" +
  "img.hfr_gm_pdal_r21_green{background:#2ecc40;border-radius:8px;box-shadow:0 0 8px 0 #2ecc40;}" +
  "img.hfr_gm_pdal_r21_red{background:#ff4136;border-radius:8px;box-shadow:0 0 8px 0 #ff4136;}";
document.getElementsByTagName("head")[0].appendChild(style);

var timer = null;
var target = null;
var throbber = "https://reho.st/self/dac55ec424cfc42fd04392c6d7b984ee4dd9d4be.png";

function update() {
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
    if(!check_every_time) {
      target.removeEventListener("mouseover", mouseover, false);
      target.removeEventListener("mouseout", mouseout, false);
    }
    if(r.includes("formulaire est destiné UNIQUEMENT à demander aux modérateurs")) {
      if(icons) {
        target.src = ouf;
      } else {
        target.src = target.dataset.src;
        target.className = "hfr_gm_pdal_r21_green";
      }
    } else {
      if(icons) {
        target.src = ttt;
      } else {
        target.src = target.dataset.src;
        target.className = "hfr_gm_pdal_r21_red";
      }
    }
  }).catch(function(e) {
    console.log("[HFR] Pas d'alerte light ERROR fetch target : " + e);
  });
}

function mouseover(e) {
  window.clearTimeout(timer);
  target = this;
  if(!icons) {
    target.className = "hfr_gm_pdal_r21_white";
  }
  target.src = throbber;
  timer = window.setTimeout(update, 200);
}

function mouseout(e) {
  window.clearTimeout(timer);
  if(target && target.dataset.src && target.src === throbber) {
    target.src = target.dataset.src;
  }
}

var buttons = document.querySelectorAll("a[href^=\"/user/modo.php?\"] > img[src$=\"exclam.gif\"]");
for(let button of buttons) {
  button.parentElement.removeAttribute("title");
  button.addEventListener("mouseover", mouseover, false);
  button.addEventListener("mouseout", mouseout, false);
  button.dataset.src = button.src;
  button.style.width = button.naturalWidth + "px";
  button.style.height = button.naturalHeight + "px";
}
