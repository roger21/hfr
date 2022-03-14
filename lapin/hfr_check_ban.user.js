// ==UserScript==
// @name         [HFR] Check ban
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @version      0.4
// @description  Vérifie si un message a été alerté au survol du pointeur sur l'icone de modération
// @author       Garath_
// @include      https://forum.hardware.fr/*
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/users/70059
// ==/UserScript==

function checkBan(link) {
  var listener = function() {
    GM_xmlhttpRequest({
      method: "GET",
      url: link.href,
      onload: function(response) {
        link.removeEventListener("mouseover", listener);
        var page = document.createElement('html');
        page.innerHTML = response.responseText;
        var el = page.querySelector("div.hop");
        if(el == null) {
          link.innerHTML = "<img src=\"https://forum-images.hardware.fr/images/perso/o_non.gif\" alt=\"Faire la poucave ?\">";
          link.title = "Faire la poucave ?";
        } else {
          link.innerHTML = "<img src=\"https://forum-images.hardware.fr/images/perso/tt4.gif\" alt=\"Le message a déjà été alerté. Voulez-vous vous joindre à la curée ?\">";
          link.title = "Le message a déjà été alerté. Voulez-vous vous joindre à la curée ?";
        }
      }
    });
  };
  link.addEventListener("mouseover", listener);
}

var links = document.getElementById("mesdiscussions").querySelectorAll(
  "table.messagetable td.messCase2 div.toolbar div.right > a[target=_blank] ");
for(let link of links) {
  checkBan(link);
}
