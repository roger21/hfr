// ==UserScript==
// @name          [HFR] Arc-en-ciel
// @version       1.2.7
// @namespace     roger21.free.fr
// @description   Permet de colorer le texte sélectionné en arc-en-ciel avec ctrl+alt+g dans les zones d'édition et de rédaction des posts (ou avec le bouton dans la réponse et l'édition normale).
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_arc_en_ciel.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_arc_en_ciel.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_arc_en_ciel.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2013-2015, 2017-2020 roger21@free.fr

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
// 1.2.7 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 1.2.6 (07/01/2020) :
// - amélioration et nettoyage (et correction) du code
// - correction du focus sur la réponse après la coloration
// 1.2.5 (14/12/2019) :
// - recadrage de l'image du bouton en réponse normale
// 1.2.4 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 1.2.3 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.2.2 (17/09/2019) :
// - correction pour avoir le bouton dans l'interface d'édition/rédaction normale des mps ->
// signalé par SOF40 et m00ms :jap:
// 1.2.1 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+
// 1.2.0 (12/08/2018) :
// - nouveau nom : [HFR] arc en ciel -> [HFR] Arc-en-ciel
// - ajout de la metadata @author (roger21)
// 1.1.3 (13/05/2018) :
// - check du code dans tm
// - maj de la metadata @homepageURL
// 1.1.2 (07/04/2018) :
// - suppression des @grant inutiles (tous)
// 1.1.1 (07/04/2018) :
// - nouveau bouton par Heeks
// 1.1.0 (07/04/2018) :
// - ajout d'un bouton dans l'interface d'édition de la réponse normale (en mode standard) ->
// sur une proposition de Kiks67
// - gestion des sélections de 1 caractère
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.0.6 (28/11/2017) :
// - passage au https
// 1.0.5 (17/09/2015) :
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.0.4 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.3 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.2 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.0.1 (14/09/2013) :
// - ajout des metadata @grant
// 1.0.0 (15/08/2013) :
// - première mouture (avec tous les bugs qui vont bien :o)

// fonctions de coloration

function colorize(value) {
  var indice = parseInt(value / 255);
  value = parseInt(value % 255);

  function pad(value) {
    var color = "";
    color = value.toString(16);
    color = value < 16 ? "0" + color : color;
    return (color);
  }

  var color = "";
  switch (indice) {
    case 0:
      color = "ff" + pad(value) + "00";
      break;
    case 1:
      color = pad(255 - value) + "ff00";
      break;
    case 2:
      color = "00ff" + pad(value);
      break;
    case 3:
      color = "00" + pad(255 - value) + "ff";
      break;
    case 4:
      color = pad(value) + "00ff";
      break;
    case 5:
      color = "ff00ff";
      break;
  }
  return (color);
}

function rainbow(textarea) {
  if(textarea) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var size = end - start;
    if(size) {
      var value = textarea.value;
      var selection = value.substring(start, end);
      var arcenciel = "";
      if(size > 1) {
        var step = (255 * 5) / (size - 1);
        for(let i = 0; i < size; ++i) {
          var color = colorize(i * step);
          arcenciel += "[#" + color + "]" + selection[i] + "[/#" + color + "]";
        }
      }
      if(size === 1) {
        arcenciel = "[#ff0000]" + selection + "[/#ff00ff]";
      }
      textarea.value = value.substring(0, start) + arcenciel + value.substring(end);
      textarea.selectionStart = start + arcenciel.length;
      textarea.selectionEnd = start + arcenciel.length;
    }
  }
}

var reponse = document.querySelector("div#mesdiscussions.mesdiscussions textarea#content_form");

function rainbow_keydown(e) {
  if(e.keyCode === 71 && e.ctrlKey && e.altKey) {
    rainbow(this);
  }
}

function rainbow_click() {
  rainbow(reponse);
  reponse.focus();
}

// gestion de la réponse rapide et de la réponse / édition normale

if(reponse) {
  reponse.addEventListener("keydown", rainbow_keydown, false);
}

// gestion des éditions rapides

var observer = new MutationObserver(function(mutations, observer) {
  var textareas = document.querySelectorAll("textarea[id^=\"rep_editin_\"]");
  if(textareas.length) {
    for(var textarea of textareas) {
      textarea.removeEventListener("keydown", rainbow_keydown, false);
      textarea.addEventListener("keydown", rainbow_keydown, false);
    }
  }
});
observer.observe(document, {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true
});

// ajout du bouton en réponse normale

var pepe = "data:image/gif;base64,R0lGODlhPwAcAOf%2FAAQGAg0GGREQDgwTBxMSCC4PJhoUNhEbDSAVIBoaGUIQDCQaFBUhDR4eFFsPChMlCjUcFC0jHS8bdSklKFobBzwiKB4tFiYsIB8yEj4lPz8pFTsel20bRD8sJB02USw4ISU7HCk9FRM3lv8AADU3NyNAFlwxCT81OnsmITY6LxpFQUQ9I1Qp2gBLg109BS5LJPkQGWA3XvsTCkNEQxZYCzdMJUVHOjFQIQZRlnMo%2FxtcAFdHNWwv%2FzlYAn9BJmJKJn87cTZZJGU1%2F01PTHlGJo5BJU5WJT5cIHdLKWA9%2BUBbL1pTM3FOKl1YA1VaCE9WSzliHzxhKnRLZXBTK5BKKkhN%2F0xbbEBoHPEyMUNnK29aLQBtuGhdLf82AEBrKmVYh1BmQkVY%2F0xqPHxJ9mZkLoxQimJiY1VtMX1eUEZyMEZ1J2FsMWFpXKNTlzRq%2F%2F5KAkp7M4VX9FF6NVZ5Nl53NCB1%2F%2BtOTFl6SHply1CBN9hOqf9WAHR1cupWV1aFP41k8KljrP9KslmIORmK%2F1WMPJRp6gWT%2FwKV%2FHx%2Be1iQQJp6XFuSOm2KXP9oAJVw6d1gwQCc%2F%2BZnaf9awgCi%2F2CaQBCi%2BsJzwIGQeQCuzIuMioGG6f9l0eJ3dh2tw%2F5t0RG4pp6J5AC%2FoImfc%2F9z2peZltiA1wfIhv924%2F%2BNAa2S3P%2BTAOqRU1mu5%2F%2BBzwnVaf%2BYAMWci8%2Bcif6cAP%2BE7OmM6lu6xvOPuMuhg8ujc82jetKen%2F%2BK7amrqP%2BjABjiRv%2BO97ap1v%2BQ%2F6q0o%2F%2BT86G5k%2BqrVP%2BV%2B%2F2W%2F7O1sh%2FxIv%2ByANewmP6b%2Fv%2Bd8wz%2FAP2h%2F%2F%2Bk8eW3iLy%2Fu2jgbP%2B%2FAPKvxVvpVDT%2FAOnCVPa3s3HpV%2Fm4rP%2B3w8bIxvm6wL7NtFn%2FAPHBvPa%2B0srMyf665PXFqvXIkHP%2FAKLqV%2F%2FFxYj%2FAP%2FLvf7fAMHpVJX%2FAP%2FRms%2FoV%2F%2FQx%2BfmVLb%2FAMz%2FAPnhytv%2FAOTm4%2F33AOf%2FAP%2Fi4f%2Fj5%2Bru4v7%2FAP3%2F%2FP%2F%2F%2FyH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQJCgD%2FACwAAAAAPwAcAAAI%2FgBJCRxIsKDBgwgTKkzor6HDhxAjSpxIsWJEgf7GadzIsaPHjyBDiuyIcaTJkyhFlkzJsuXIlS5jyhwHc6ZHXgII6NzJk0ADljVBYoFBlKiMjrqKwkChyFy2alCjRjUXLULKoB3tjNjKtatXrg7MpXsWLNgvScbKBjvmLdqCq6QyhuyztZFdu3u%2B3m1kYhszScyMGfs16tfgQGUAYBgAYMAAaSrjiiyGSpWsy5dVodrMGbMsF9sGCw78y7CxNiH8wJHzAg6cA6RCYuVYTFUvarhxK1PFm7es3NRACzbGbNNwY7QQEBIkx0uQNGmyHOAFcvZGefjw9dvOPbt37dyb%2FoQ%2BfnyCl0VRssC5c%2BkOGGQXqksOKW87vfv383Hnbu%2B%2BPSd%2BGYMWYc9I0kYJhCSSBj8nkHDJPRawMYR8coGEjjrgOKOhhte4o86H6pyzoTM0ZLPJLqSNQlwGaQhCCCF5wHGEIFDAMYBs84GkzTU89ujjjz3qsM0sph2XgSBzEMFFHi82WQKOFX40TTKuYNLJlZ2EksyWW%2FqCJSYqbDPMLAKSaVgGL2rhQxFTrEHHmz8AQKFIrBxyCCR44mnnnnbmOYkH72zTyi9rHXNKMEcmKMcaWhDhw6MQQEnnJIOEYamlblQyyaaTHHKpCC8skcstsJRqqiID3OCFIJRQwlwIgnwgI2lIjuSQAw%2B44mrrrrYKwQMLUFAShACNAZDAsQkAcICxADR77ISRRemRI7lWa221LIQQBAC8ABCFBRylkAUB4zCgxBMoWadRKoV049EfhcRbCCgbmTGDRshAy9EME3bjbro52iSwSeoObLBGBR88cMIK27TQwxBHLPHEFFe8UEAAIfkECQoA%2FwAsAAAAAD8AHAAACP4ASQkcSLCgwYMIEypM6K%2Bhw4cQI0qcSLFiRIH%2BxmncyLGjx48gQ4rsiHGkyZMoRZZMybLlyJUuR84YQrOmzSFmWMKMCXJHrluxggoVektRppQ7PUaCIaPjUhhQYdjhqCDaNmjMmA3z9CwrM2PezEVASipjyD4j0qpdy1atg3LNNhkz9mvUrF9zJT3TJQDRuEx8XpYVuarRm7aNEifes9aBPrpz5%2B6K%2FKsMA0FpDmAIciAwyKQdi8lShaq0aVmoUb8yrcrE47nMRkWeWwpDIjiC4KQhBOdCSNAcsVFTpqp4cVnUkicnXvyVi9fGYs%2BmhQAOoTxRgtyAouTGgG4fgf5vlNevH77z6MurN3%2B%2BX5PXgSIzix8jzSIvRxhNGOePj4B7yIQ3WEjw0JPPeuXRo6CC9qz33il40aXXL7Q8YF0ijFxiQQ2i3PBCA9IIaBZI1jgDjjoooniOMyy2mKI6PegzymSw0VYCHHPIQYggOuZWQgKfDQiSNtcUaeSRSBpJwz4RSjJLZHqUkAgSPiCRxSKLJJIIIUCKKFItmJiSzJhj%2BoJJJ2h28gmZydBgDjeSRDfXJr%2BUUgIhhHBBBBU%2BMKGFFkR0EOSIH7ECySGIJnoIJIw2qmgLaLyzTjqUphNPPNk8oCWec6yxhhErQPCbkB9pEkYdk6SaqiFhtNqqG4yqbnFEGgMA0AAGBACgKwEMCPAACDcEod0DfPAyKqEeOcJDDsw2m4MQPEQbbbMBUJIFALzcIEiX45AgSAmZAJAFAyiJp1Eh0qarrroGTBAAL6QMcECIGknDwADFWvBEuaSG9EchABcCjEcB42EwT8cirHBL5i7sMEcNP%2FxwxBIvvNDFGGes8cYcd7xQQAAh%2BQQJCgD%2FACwAAAAAPwAcAAAI%2FgBJCRxIsKDBgwgTKkzor6HDhxAjSpxIsWJEgf7GadzIsaPHjyBDiuyIcaTJkyhFlkzJsuXIlS5jyhwHc6ZHXgII6NzJk0ADljVBYoFBlKiMjrqKwkChyFw4cVCjQq1mLlqElEE72hnBtavXr10dmEsHLViwX5KMmQ12LJ2iAwwQ8ZHLK2RWjn24Ntq7dw9Yvo1MbGMmiZkxY79G%2FTocqAwGQoL8RKG0aIBdUhlDFkOlSpZnz6pQiR79WZaLbIgPG%2F612NiuC4sgR7kBJ0uJGcg%2B3t1YTFUvasCBK1NFnLis4NROHzbGbNNyY7QQZCHkJQicO0oYZQGTSTdmkfLw%2FuHrR768%2BPPjyzdB%2Ffx5GS%2BJCCnxJ2BGQwFsEnjPDFIeeXoAAphPeeXZA6A9TmRjWFqJPSPJMSfAQUh8adwQhBpZeHEASLtphI464DgjoojXuKPOieqcM6IzNHizyS6rjcKcMRGeMYUchPhBCCFyCPIBh9%2BFpM01RBZp5JFF6pDNLK09x8wJPPrgAxJcpEHIInL8UJdHHY4zTTKuYNLJmJ2EksyZZ%2FpCJiYqbDPMLMZIAidrm1SQSHxcTIEEFVT4UAQEuXEZJEisHHIIJIgiauiihiY6iQfvpNPKL2wdc0owxjgmB2WLLCKIICEAcBl%2FH7EyySBhpJqqG5VM4uokh4eoKsILS%2BByCyy45oqrIjs08IAFDDBwAR8qDfqRIznkwMOyyybrbLJC8DBGAlEEIUACAGSbwLYJCADAtVF4oZ9JXTrC7LnonpsEMrwg08047QaqUTfISDMOuyh1mUoh73b0RyEAFwKKTSd1SfDBGxmM8MEKL2xTww7LtNDEFFds8cUYZ7xQQAAh%2BQQJCgD%2FACwAAAAAPwAcAAAI%2FgBJCRxIsKDBgwgTKkzor6HDhxAjSpxIsWJEgf7GadzIsaPHjyBDiuyIcaTJkyhFlkzJsuXIlS5HzhhCs6bNIWZYwowJckeuW7GCChV6S1GmlDs9RoIho%2BNSGFBh2OGoINo2aMyYDfP0LCszY97MRUBKKmPIPiPSql3LVq2Dcs02GTP2a9SsX3MlNfMWAREfadL48AqZtOOqRm%2FaNlq8eM9aB%2Frozp27azJeSwzg%2BHlgQQmGBCALcywmSxWq06hlqVb9CrUqE5HnMhs1eTIzAYLgCPLjZTeDbh9Fb8RGTZmq48dlUVu%2B3PjxVy5iG5tde3qGKIn8RAlyw0uQKAOk%2FnkUrlFev3740qs%2Fzx59%2Bn5NYgeyHejXKQ5QcgdhlILXPV4L%2BDPEeGWJBA89%2BbR3Hj0MMmhPe%2FGdghddkjzzyy%2B0NAAHIYvIQYwFIBADRg0HkEKgWSBZ4ww46rTY4jnOxCiji%2Br0oM8olck2WSkl6CYHIYRs6AccUQx2okjaXKPkkkw2uSQN%2B0woySyTSfIICItw4QMSZ3CYyCKJDBBcgSHVgokpyaSZpi%2BYdOJmJ5%2BomQwN5nAjyXRzbfILM6XckEgiXCBBxZZacEHEAmOi%2BBErkBzi6KOHQCLppJBuocg766SjaTrxxJNOOAwQkgiQcqyxhhFLQGAkSWSCpEkYmHVMIqushoRhq61uzDrJFhhYYAEAB1hAAADEEsAAAAyA8MIN3GEwAyKhtfqRIzzkYO21OQjBw7bbYitBbgyMA0KYG5GSRhQJJBAFCCa%2BJK1HhXAr77z0SoAAAMiMg2y743RzwAECSHPAbyaRx9EfhSRcCDDwKowHTyq9C%2FHEBUtM8cWJYqwxYRZvrPFCIIcs8sgkl2zyQgEBACH5BAkKAP8ALAAAAAA%2FABwAAAj%2BAEkJHEiwoMGDCBMqTOivocOHECNKnEixYkSB%2FsZp3Mixo8ePIEOK7IhxpMmTKEWWTMmy5ciVLmPKHAdzpkdeAgjo3MmTQAOWNUFigUGUqIyOuorCQKHIXLZqUKNGNRctQsqgHe2M2Mq1q1euDsylexYs2C9JxsoGO8btXQReKLFy7LO1kV27e77ebWRiGzNJzIwZ%2BzXql%2BBAzKQwsAAAwAEAfELK3VgMlSpZmDGrQsW5c2ZZLrYNFhz4l2Fjw2IEgSNITpQ8cAZIJpUxZDFVvajp1q1MlW%2FfsnZTCy3YGLNNxQWXsrBIUJ4sN%2BDIyXIA5GSN8vDh68e9u%2Fbv27v%2BNxGdPHmpBnAIRUnjh5F7MZcAfLw%2BTh53evjx5%2Bve3R5%2Be074ZQxahD2DVhlyEEKIHMIIkMI3wjDAhhnz0SYSOuqA48yGG17jjjogqnMOh87QkM0mu5Q2inHHnOCFgoIIkoYXgniRxQXWWRiSNtf06OOPQPqowzaznJYcMycIQgYRRijo5CIWIFNhbSBNk4wrmHSiZSehJOOll75siYkK2wwzy4BnmrZJBYTkMQUVPnCxBh10rLECXB7Rx8ohh0Dip598Bsrnn5B48M42rfyy1jGnBIPkIgrOQcYUSPhgqVVTisTKJIOE4amnblQyyaiTHPIpK1YsgcstsLTqKiyQaDBwQxqEUELJInJ8MAMiOVL5kSM55MDDsMMGa2ywQvAwRgJZpAFAAgAMAIAACVTrmAACNPasAC%2FpCJIjxIYrbrhJCBDCDfIJ4AUDHDGQBQDSlPCClCbRl0oh3Xj0RyH8FgIKRzMMIeUQM3g0BCka8XoSfTY1TJK3Dkfcq8QUZ1rxxRotpPHGHHfs8ccgLxQQACH5BAkKAP8ALAAAAAA%2FABwAAAj%2BAEkJHEiwoMGDCBMqTOivocOHECNKnEixYkSB%2FsZp3Mixo8ePIEOK7IhxpMmTKEWWTMmy5ciVLkfOGEKzps0hZljCjAlyR65bsYIKFXpLUaaUOz1GgiGj41IYUGHY4agg2jZozJgN8%2FQsKzNj3sxFQEoqY8g%2BI9KqXctWrYNyzTYZM%2FZr1KxfcyU18zYWZdKOqxq9aduocOE9ax1sozt37q7GeEs1ADCum%2BVuIf9yLCZLFarPoGWJFv0KtCoTi%2BcyG9W4sSUGcOTcuAEnTYPMZUVio6ZMlW%2FfsqgJF97b9ysXqY2tbm3s2YRFaQTBuZHGCwbKHzVvlNevH77v4Lv%2Bi%2Ff%2BvV%2BT1IEaMwtUt0AQQtPleCmhJEsI7CRzh4RHL9%2F47vQEGKA94513Cl50SfIMXoBEQYggQRBzAR8NAUBKAtnpB5I1zoCjzocfnuPMiCSCqE4P2ZzymGqqZeBFHoQsIkYNL8QGxwPSZGgWSNpc4%2BOPQAb5Iw3ZHJPXLI1tUgEcc2gRIyFQypHHBSBpp1EtmJiSzJZb%2BoJJJ2B28gmXydDwDjeSKDfXJr8wc0Iia%2FjgAxd0CPKgICHwoqNIrEByyJ%2BAHgLJoIQGuoUi76yTzqLpxBNPOitAmYcWRFBBBRGVaqCnR1aOo0kYdUwiqqiGhGGqqW6MOskWGFggAACaDFgAwKwEHHBDIpQkQogfdNBhxAJH7RmSIzzkYOyxOQjBw7LLHssCCYsIMsMBhASR4zgkwOHqBSDMdoOrKmn4USHMlmuuuRtcIccA3RywyAGbSoMBJQBIc0MUACCDzEvihvRHIQAXAoxHAX%2FxxBD7DvFER8g8McM4bCx8Uqc8VYzbjhZnbBLFGnfMcccZLyTyyCSXbPLJKC8UEAAh%2BQQJCgD%2FACwAAAAAPwAcAAAI%2FgBJCRxIsKDBgwgTKkzor6HDhxAjSpxIsWJEgf7GadzIsaPHjyBDiuyIcaTJkyhFlkzJsuXIlS5jyhwHc6ZHXgII6NzJk0ADljVBYoFBlKiMjrqKwkChyFy2alCjRjUXLULKoB3tjNjKtatXrg7MpXsWLNgvScbKBjvG7Z1VlFg59tnaqG7dPV%2FtNjKxjZkkZsaM%2FRr1K3CgUrYWjOvG%2BCWpjCGLoVIlq3JlVagya7Ysy8U2wYEB%2FyrMDMiHKDcugHgxoJvKxyKLqepFrXZtZapy55Zlm5rnwMaYbQJuzBIGQmngeCFEKAgpaSHjbpSHD1%2B%2F69ira7eOvcln4sBp%2Fk1gLijIjSBesrwAEB12SHnX6cmXnw87dnvy7Tnpawzt4GeSFLBcGncwAoYwwjyRghntQQYSOuqA48yEE17jjjoYqnMOhc7QkM0mu4g2CjOl3CAIIYKIwcYAYPDzwQ1vfSSdRtpcY%2BONOOZ4ow7bzFIYcMyUEQQheSxCiBxZEOJFGgMg0qBI0yTjCiadVNlJKMlkmaUvVmKiwjbDzNKfmL%2BUkYYcRSCxxomJLLIIHE6CNOM4rBxyCCR44mnnnnbmOYkH72zTyi9rHXOKmYTMwQQVVEyhBRdcMMGenO6BxMokg4ShqaZuVDLJp5McsqkIACyRyy2wpJoqGlFQkkiimWtwocUUSGiAzJMhOZJDDjz02uuuwO4qBA8bXEFJEAAAMIAACSQggLIMRCHHtHnIcYMAjjn4kSO%2BduutrywwsEgWAszgBZwadTNAIhbwcsANAEjDCy8mzZlKIa519Ech%2FBYCikYDgDDAECRYYAEpG80AAgPdPBGCDVdVatPE9UpM8cUyWozxxhrNybFNC4Us8sgkl2zyyQsFBAAh%2BQQJCgD%2FACwAAAAAPwAcAAAI%2FgBJCRxIsKDBgwgTKkzor6HDhxAjSpxIsWJEgf7GadzIsaPHjyBDiuyIcaTJkyhFlkzJsuXIlS5jyhwHc6ZHXgsWNNjJk%2BeCCCxrhuyWMpMic%2BHEKV269F00oCiFdrQzYgSnq1exVN1qFasCc%2BKaHQv2S5KxYGiDkXvXIaVUjn24yp271cG2Z5KaGdu76dTeQL%2BgtY1KKmPIYqoadVm8%2BM0rVJAhM%2B5CYdvey3t%2F7WUWwwKIBDNszHhZWGSxV7J6qV79qnXr1KtdWN48CrOxGEEICfKShpIfAERBvt0ojx01WciRK2PHvHnyXrL37jKmmbqxUhgE%2BYETBISXKCEA%2FoQcrlFev%2FPo06tH72T2pr2enm0qNSANoSxQolwCwwgEGwHClRZSO%2FPQo14%2B7syjoILptTfKLJf5xUwGcAhCiBL%2BkCCAP9JcQEoCARoGkjbOOHPNiSeWqGKJKF5DwzbTUVddMxfIQUgihMBxQxRqyJEFALyEKNI0ySTT4olFJmkkijSU04xfD1I3zAeCkDEFHYQQskiOggwwnoAgsTIJJq6UWaYph1SiZiWsmOmKEdHU08ovx1B3yi8fUCKHDz5QoYUXWZ6hwZcifsTKIYcYoqiiiDaK6KKTtLADLsvAAkulyyxjASWJ5LHGD0RQwScV4gkZkiZJuDHIqqvWkUQVlrBWEcaqhuAQQhAAAPDAAAAkkAAAA7xg3yJb5jHHBxNkQqhIjvDg7LPQPiuEsxJEQUkUmRywiAXSaAQAHC%2FkygADBzAAADKkFepRKoUUEi0P7cYbBw9CSODFDQFIc0AeF3AkhhcAkBLFDcqeRJ5LyOTqbakbkQDcOLwESZi6NlWsEpgWZ2yqxhyTtNDHIIcs8sgkl6xQQAA7";

var spacer = document.querySelector("form#hop table.main tbody tr.reponse td.repCase2 div.left + div.spacer");

if(spacer) {
  var divfrog = document.createElement("div");
  divfrog.setAttribute("class", "left");
  divfrog.style.textAlign = "right";
  divfrog.style.marginLeft = "-2px";
  var frog = document.createElement("img");
  frog.style.cursor = "pointer";
  frog.setAttribute("title", "Colorer le texte sélectionné en arc-en-ciel");
  frog.setAttribute("alt", "AEC");
  frog.setAttribute("src", pepe);
  frog.addEventListener("click", rainbow_click, false);
  divfrog.appendChild(frog);
  spacer.parentElement.insertBefore(divfrog, spacer);
}
