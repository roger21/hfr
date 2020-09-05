// ==UserScript==
// @name          [HFR] Warning Message
// @version       1.0.0
// @namespace     roger21.free.fr
// @description   Affiche un message de confirmation à la fermeture de l'onglet lorsque le champ de saisie de la réponse (rapide ou normale) n'est pas vide.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_warning_message.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_warning_message.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_warning_message.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==
/*

Copyright © 2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 2510 $

// historique :
// 1.0.0 (05/09/2020) :
// - petite esthétisation du code
// 0.9.0 (28/08/2020) :
// - création

(function() {

  let l_reponse = document.querySelector("textarea#content_form");
  let l_submit = document.querySelector("input[type=\"submit\"][name=\"submit\"]");

  if(l_reponse) {

    function onbeforeunload(p_event) {
      if(l_reponse.value !== "") {
        p_event.preventDefault();
        p_event.returnValue = true;
      }
    }

    window.addEventListener("beforeunload", onbeforeunload, false);

    if(l_submit) {

      function removeonbeforeunload(p_event) {
        window.removeEventListener("beforeunload", onbeforeunload, false);
      }

      l_submit.addEventListener("click", removeonbeforeunload, true);

    }

  }

})();
