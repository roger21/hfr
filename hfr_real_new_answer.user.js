// ==UserScript==
// @name          [HFR] Real New Answer
// @version       1.2.3
// @namespace     roger21.free.fr
// @description   Signale sur la page des drapals si un de vos posts a été quoté depuis votre dernière visite d'un topic flaggé cyan ou fav.
// @icon          https://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/forum1.php*
// @include       https://forum.hardware.fr/forum1f.php*
// @include       https://forum.hardware.fr/*/liste_sujet-*.htm
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2017-2019 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1153 $

// historique :
// 1.2.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - retour des requêtes fetch en mode "same-origin" au lieu de "cors"
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 1.2.2 (23/09/2019) :
// - passage des requêtes fetch en mode "cors" pour éviter un plantage sous ch+vm en mode "same-origin"
// 1.2.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.2.0 (02/12/2018) :
// - nouveau nom : [HFR] real new answer -> [HFR] Real New Answer
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - réécriture de la metadata @description
// - gestion de la compatibilité gm4
// - utilisation de l'image de Heeks par défaut pour le "new" :jap:
// 1.1.3 (26/05/2018) :
// - ajout du support pour la cat shop
// 1.1.2 (13/05/2018) :
// - maj de la metadata @homepageURL
// 1.1.1 (11/05/2018) :
// - check du code dans tm
// 1.1.0 (28/04/2018) :
// - recodage en fetch
// - suppression des @grant inutiles
// 1.0.3 (16/02/2018) :
// - ajout d'une compatbilité avec vm pour le mode anonyme de gm_xhr (via http cookie) par PetitJean
// 1.0.2 (28/11/2017) :
// - passage au https
// 1.0.1 (17/09/2017) :
// - centrage vertical de l'image de signalement
// 1.0.0 (17/09/2017) :
// - ajout de la désactivation du script au double-clic sur l'indicateur de progression
// - commentage des logs
// 0.9.12 (03/08/2017) :
// - correction de la compatibilité avec [HFR] new page number version 2.2.0+ (j'ai oublié un petit bout)
// 0.9.11 (28/07/2017) :
// - getsion de la compatibilité avec [HFR] new page number version 2.2.0+
// 0.9.10 (15/07/2017) :
// - ajout d'un test pour ne pas rentrer en conflit avec un script de breizhodrome
// 0.9.9 (27/06/2017) :
// - suppression de le sauvegarde du pseudal pour fonctionner avec les multis
// 0.9.8 (21/06/2017) :
// - correction de la regexp de cat des drapals (pour les topics sans sous-cat) par breizhodrome
// 0.9.7 (21/06/2017) :
// - ajout d'une tempo entre les téléchargements d'urls
// - ajout de log de debug
// 0.9.6 (18/06/2017) :
// - correction du param distinctif pour les 2 types d'url et changement pour gmRNAr21
// 0.9.5 (18/06/2017) :
// - correction du title de l'indicateur quand y'a rien à chercher
// - ajout d'un param distinctif (gmrnar21) sur les urls de recherche pour eventuellemet ->
// permettre à sly/marc d'évaluer la charge...
// 0.9.4 (18/06/2017) :
// - ajout d'un système pour ne pas télécharger les pages trops vieilles plus d'une fois
// - ajout d'un indicateur de progression
// 0.9.3 (03/06/2017) :
// - nouveau code pour recup l'url du quote par breizhodrome
// 0.9.2 (03/06/2017) :
// - correction du querySelector pour l'url du quote (problème de l'icone smartphone)
// 0.9.1 (03/06/2017) :
// - ajout d'un tag anti-cache sur l'url (sert à rien mais on garde quand même :o )
// 0.9.0 (27/05/2017) :
// - création sur une proposition de demars


/* ---------------------------- */
/* gestion de compatibilité gm4 */
/* ---------------------------- */

if(typeof GM === "undefined") {
  this.GM = {};
}
if(typeof GM_getValue !== "undefined" && typeof GM.getValue === "undefined") {
  GM.getValue = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_getValue.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
if(typeof GM_setValue !== "undefined" && typeof GM.setValue === "undefined") {
  GM.setValue = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_setValue.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
var gmMenu = false;
if(typeof GM_registerMenuCommand !== "undefined") {
  gmMenu = true;
}


/* ---------- */
/* constantes */
/* ---------- */

var script_name = "[HFR] Real New Answer";
var default_max_page = 5;
var default_img_new = "data:image/gif;base64,R0lGODlhGQAJALMAAAAAAIAAAACAAICAAAAAgIAAgACAgICAgMDAwP8AAAD%2FAP%2F%2FAAAA%2F%2F8A%2FwD%2F%2F%2F%2F%2F%2FyH%2FC05FVFNDQVBFMi4wAwHoAwAh%2BQQJCgAPACwAAAAAGQAJAAMEN3CtR%2BWkVWK7wV2eZXmdCJLgCaypGL6tF44SHNfpitr8dLYfWepxqwhNLBbRtFGxTJohpsmcUiMAIfkECQoADwAsAAAAABkACQADBDeQsUflpFViu8FlnmV5nQiS4AmsqRi%2BrReOEhzX6Yra%2FHS2H1nqcasITSwW0bRRsUyaIabJnFIjACH5BAkKAA8ALAAAAAAZAAkAAwQ3UIhH5aRVYrvBFZ5leZ0IkuAJrKkYvq0XjhIc1%2BmK2vx0th9Z6nGrCE0sFtG0UbFMmiGmyZxSIwAh%2BQQJCgAPACwAAAAAGQAJAAMENzClR%2BWkVWK7wU2eZXmdCJLgCaypGL6tF44SHNfpitr8dLYfWepxqwhNLBbRtFGxTJohpsmcUiMAIf4hTkVXIENvbG9yIGJ5IGF0ckBiaXRjb20gaXQncyBGUkVFACH%2B71RoaXMgR0lGIGZpbGUgd2FzIGFzc2VtYmxlZCB3aXRoIEdJRiBDb25zdHJ1Y3Rpb24gU2V0IGZyb206DQoNCkFsY2hlbXkgTWluZHdvcmtzIEluYy4NClAuTy4gQm94IDUwMA0KQmVldG9uLCBPbnRhcmlvDQpMMEcgMUEwDQpDQU5BREEuDQoNClRoaXMgY29tbWVudCBibG9jayB3aWxsIG5vdCBhcHBlYXIgaW4gZmlsZXMgY3JlYXRlZCB3aXRoIGEgcmVnaXN0ZXJlZCB2ZXJzaW9uIG9mIEdJRiBDb25zdHJ1Y3Rpb24gU2V0ACH%2FC0dJRkNPTm5iMS4wAgMADgwAAgAFAAAAAAAAAAAADG5ld2JsYXUuR0lGAA4NAAIABwAAAAAAAAAAAA1uZXdncnVlbi5HSUYADgsAAgAJAAAAAAAAAAAAC25ld3JvdC5HSUYAADs%3D";
default_img_new = "data:image/gif;base64,R0lGODlhGQARAPAAAMwAAP%2F%2F%2FyH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQFRgABACwAAAAAGQARAAACKIyPqcvtD6OcdIJzgc6BM214YUd%2BZLad5XJ1otqymAtuYIXn%2Bs73VQEAIfkEBUYAAQAsEwAEAAMACQAAAghMcGkGvcheAQA7";
var max_page_before = 3;
var display_progress = true; // <- là
var la_tempo = 250;
var cat2cat = {
  "service-client-shophfr": 31,
  Hardware: 1,
  HardwarePeripheriques: 16,
  OrdinateursPortables: 15,
  OverclockingCoolingModding: 2,
  electroniquedomotiquediy: 30,
  gsmgpspda: 23,
  apple: 25,
  VideoSon: 3,
  Photonumerique: 14,
  JeuxVideo: 5,
  WindowsSoftware: 4,
  reseauxpersosoho: 22,
  systemereseauxpro: 21,
  OSAlternatifs: 11,
  Programmation: 10,
  Graphisme: 12,
  AchatsVentes: 6,
  EmploiEtudes: 8,
  Setietprojetsdistribues: 9,
  Discussions: 13
};


/* ------------------------------------------ */
/* récupération des paramètres et c'est parti */
/* ------------------------------------------ */

Promise.all([
  GM.getValue("script_enabled", true),
  GM.getValue("max_page", default_max_page),
  GM.getValue("img_new", default_img_new),
  GM.getValue("topics", "{}"),
]).then(function([
  script_enabled,
  real_max_page,
  img_new,
  topics,
]) {

  // conversion des paramètres
  var max_page = real_max_page;
  if(max_page === -1) {
    max_page = Number.POSITIVE_INFINITY;
  }
  topics = JSON.parse(topics);

  //console.log(script_name + " DEBUG topics :", topics);

  // ajout des menus si disponible
  if(gmMenu) {

    // le nombre maximal de pages à rechercher
    var prompt_string_max = script_name + " -> Nombre de pages à analyser";
    GM_registerMenuCommand(prompt_string_max, set_max_page);

    function set_max_page() {
      let l_max_page = window.prompt(prompt_string_max + "\n\n(défaut : " +
        default_max_page + ", toutes les pages : -1, désactivé : 0)\n\n", real_max_page);
      if(l_max_page === null) {
        return;
      }
      if(parseInt(l_max_page) === -1) {
        GM.setValue("max_page", -1);
        real_max_page = l_max_page;
        max_page = Number.POSITIVE_INFINITY;
      } else if(parseInt(l_max_page) >= 0) {
        GM.setValue("max_page", parseInt(l_max_page));
        real_max_page = parseInt(l_max_page);
        max_page = parseInt(l_max_page);
      } else {
        GM.setValue("max_page", default_max_page);
        real_max_page = default_max_page;
        max_page = default_max_page;
      }
    }

    // l'image de signalement
    var prompt_string_img = script_name + " -> Image de signalement";
    GM_registerMenuCommand(prompt_string_img, set_img_new);

    function set_img_new() {
      let l_img_new = window.prompt(prompt_string_img + "\n\n", img_new);
      if(l_img_new === null) {
        return;
      }
      if(l_img_new.trim() !== "") {
        GM.setValue("img_new", l_img_new);
        img_new = l_img_new;
      } else {
        GM.setValue("img_new", default_img_new);
        img_new = default_img_new;
      }
    }
  }

  // fonction d'ajout du lien qui clignotte et qu'est affreux même pas honte :o
  function add_new(elmt, url) {
    elmt.style.position = "relative";
    var new_a = document.createElement("a");
    new_a.href = url;
    new_a.style.position = "absolute";
    new_a.style.display = "flex";
    new_a.style.alignItems = "center";
    new_a.style.right = "5px";
    new_a.style.top = "0";
    new_a.style.height = "100%";
    new_a.title = "Vous avez une nouvelle réponse, cliquez moi\ndessus pour aller directement sur la réponse.";
    var new_img = document.createElement("img");
    new_img.src = img_new;
    new_img.style.display = "block";
    new_a.appendChild(new_img);
    elmt.appendChild(new_a);
  }

  // fonctions de sauvegarde et recherche des pages déjà chargées
  function not_checked_already(page, topic) {
    if(typeof topics[topic] === "undefined") {
      return true;
    } else {
      if(topics[topic].indexOf(page) === -1) {
        return true;
      } else {
        return false;
      }
    }
  }

  function add_to_already_checked(page, topic) {
    if(typeof topics[topic] === "undefined") {
      topics[topic] = [page];
    } else {
      if(topics[topic].indexOf(page) === -1) {
        topics[topic].push(page);
      }
    }

    //console.log(script_name + " DEBUG add_to_already_checked :", page, topic, topics);

    GM.setValue("topics", JSON.stringify(topics));
  }

  // fonction de mise à jour du title de l'indicateur de progression
  var progress_cpt = 0;
  var progress_count = 0;

  function set_onglet_title(onglet) {
    if(onglet) {
      if(script_enabled) {
        if(progress_cpt === progress_count) {
          onglet.setAttribute("title", script_name + " -> j'ai fini !\nDouble-cliquez pour me désactiver.");
        } else {
          onglet.setAttribute("title", script_name +
            " -> je chercher, je cherche ...\nDouble-cliquez pour me désactiver.");
        }
        onglet.style.color = "";
      } else {
        onglet.setAttribute("title", script_name + " -> désactivé :'(\nDouble-cliquez pour me ré-activer.");
        onglet.style.color = "crimson";
      }
    }
  }

  // fonction d'activation / désactivation du script
  function toggle_script(e) {
    e.preventDefault();
    script_enabled = !script_enabled;
    GM.setValue("script_enabled", script_enabled);
    var onglet = document.querySelector("div#ongletRNA");
    set_onglet_title(onglet);
    if(script_enabled && progress_cpt !== progress_count) {
      do_the_next();
    }
  }

  // fonctions de gestion de l'indicateur de progression
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent =
    "table.none tr td div#ongletRNA{min-width:40px;width:auto;cursor:default;padding:3px 0 0;height:15px;}" +
    "div#ongletRNA.mozUserSelect{-moz-user-select:none;-webkit-user-select:none;}";
  document.getElementsByTagName("head")[0].appendChild(style);

  function init_progress() {
    if(display_progress) {
      var top_row = document.querySelector("table.none tr");
      if(top_row && top_row.cells[0] && top_row.cells[0].firstElementChild) {
        var district9 = top_row.cells[0].firstElementChild.querySelector("div#befor9");
        if(district9) {
          var div_avant = document.createElement("div");
          div_avant.setAttribute("id", "beforRNA");
          div_avant.setAttribute("class", "beforonglet");
          var div_apres = document.createElement("div");
          div_apres.setAttribute("id", "afterRNA");
          div_apres.setAttribute("class", "afteronglet");
          var onglet = document.createElement("div");
          onglet.setAttribute("id", "ongletRNA");
          onglet.setAttribute("class", "onglet cBackHeader mozUserSelect");
          set_onglet_title(onglet);
          onglet.appendChild(document.createTextNode(progress_cpt + " / " + progress_count));
          onglet.addEventListener("dblclick", toggle_script, false);
          top_row.cells[0].firstElementChild.insertBefore(div_avant, district9);
          top_row.cells[0].firstElementChild.insertBefore(onglet, district9);
          top_row.cells[0].firstElementChild.insertBefore(div_apres, district9);
        }
      }
    }
  }

  function progress_plus_plus() {
    ++progress_cpt;
    if(display_progress) {
      var onglet = document.querySelector("div#ongletRNA");
      if(onglet) {
        onglet.firstChild.textContent = progress_cpt + " / " + progress_count;
        set_onglet_title(onglet);
      }
    }
  }

  // fonction de recherche des quotes dans les flags
  function do_the_next() {
    if(script_enabled && hi < flags.length) {

      //console.log(script_name + " DEBUG topic : " + flags[hi].topic +
      //" - page : " + flags[hi].page + " - last page : " + flags[hi].last_page +
      //" - indice : " + flags[hi].indice + " - max : " + flags[hi].max +
      //" - max page before : " + max_page_before);

      if((flags[hi].page >= flags[hi].last_page - max_page_before) ||
        not_checked_already(flags[hi].page, flags[hi].topic)) {
        window.setTimeout(function() {
          fetch(flags[hi].urls[flags[hi].indice] +
            ((/\?/).test(flags[hi].urls[flags[hi].indice]) ? "&gmRNAr21=" : "?gmRNAr21=") +
            (new Date()).getTime(), {
              method: "GET",
              mode: "same-origin",
              credentials: "omit",
              cache: "reload",
              referrer: "",
              referrerPolicy: "no-referrer"
            }).then(function(r) {

            //console.log(script_name + " DEBUG fetch url :", r.url);

            return r.text();
          }).then(function(r) {
            var p = new DOMParser();
            var d = p.parseFromString(r, "text/html");
            var quotes = d.documentElement.querySelectorAll("div.container > table.oldcitation > tbody > " +
              "tr.none > td > b.s1 > a.Topic, div.container > table.citation > tbody > tr.none > td > b.s1 > " +
              "a.Topic, div.container > table.oldcitation > tbody > tr.none > td > b.s1");
            var post_url = "";
            loop_quotes: for(var quote of quotes) {

              //console.log(script_name + " DEBUG quote trouvé : " + quote.textContent + " " +
              //(quote.textContent.indexOf(pseudal + " a écrit") === 0));

              if(quote.textContent.indexOf(pseudal + " a écrit") === 0) {
                var parent = quote.parentElement;
                while(parent) {
                  if((parent.nodeName.toLowerCase() === "tr") &&
                    parent.hasAttribute("class") && (parent.getAttribute("class").indexOf("message") === 0)) {
                    if(flags[hi].indice === 0) {
                      var current_hash =
                        parseInt(parent.querySelector("td.messCase1 > a[name]").getAttribute("name").substring(1),
                          10);

                      //console.log(script_name + " DEBUG comparaison des hash current / flag : " +
                      //current_hash + " / " + flags[hi].hash);

                      if(current_hash <= flags[hi].hash) {

                        //console.log(script_name + " DEBUG NON avant le flag");

                        continue loop_quotes;
                      }
                    }
                    post_url = flags[hi].urls[flags[hi].indice] + "#" +
                      parent.querySelector("td.messCase1 > a[name]").name;

                    //console.log(script_name + " DEBUG OUI trouvé :", post_url);

                    break loop_quotes;
                  }
                  parent = parent.parentElement;
                }
              }
            }
            if(post_url !== "") {
              add_new(flags[hi].titre, post_url);
              progress_cpt += flags[hi].max - flags[hi].indice - 1;
              ++hi;
            } else {
              add_to_already_checked(flags[hi].page, flags[hi].topic);
              if(flags[hi].indice + 1 < flags[hi].max) {
                ++flags[hi].indice;
                ++flags[hi].page;
              } else {
                ++hi;
              }
            }
            progress_plus_plus();
            do_the_next();
          }).catch(function(e) {
            console.log(script_name + " ERROR fetch flag : " + e);
          });
        }, la_tempo);
      } else {
        if(flags[hi].indice + 1 < flags[hi].max) {
          ++flags[hi].indice;
          ++flags[hi].page;
        } else {
          ++hi;
        }
        progress_plus_plus();
        do_the_next();
      }
    }
  }

  // recherche des topics flaggés (cyan et fav)
  var flags = [];
  var hi = 0;

  function get_the_flags() {

    //console.log(script_name + " DEBUG le pseudal :", pseudal);

    if(max_page !== 0) {
      var flags_img = document.documentElement.querySelectorAll("html body div.container " +
        "div#mesdiscussions.mesdiscussions table.main tbody tr.sujet.ligne_booleen td.sujetCase5 a " +
        "img[src$=\"/favoris.gif\"], html body div.container div#mesdiscussions.mesdiscussions " +
        "table.main tbody tr.sujet.ligne_booleen td.sujetCase5 a img[src$=\"/flag1.gif\"]");
      for(var flag of flags_img) {
        var a = flag.parentElement;
        var href = null;
        if(a.hasAttribute("href")) {
          href = a.href;
        } else if(a.dataset.href) {
          href = a.dataset.href;
        }
        if(href.indexOf("&cat=prive&post=") !== -1) {
          continue;
        }
        var last_page_number = 1;
        if(a.parentElement.previousElementSibling.firstElementChild) {
          last_page_number =
            parseInt(a.parentElement.previousElementSibling.firstElementChild.firstChild.nodeValue.trim(), 10);
        }
        var page_number, cat, topic;
        if(href.indexOf(".htm") !== -1) { // url verbeuse
          page_number = parseInt(/_([0-9]+)\.htm/.exec(href)[1], 10);
          cat = cat2cat[/\/hfr\/([^\/]+)\//.exec(href)[1]];
          topic = parseInt(/sujet_([0-9]+)_[0-9]+\.htm/.exec(href)[1], 10);
        } else { // url à paramètres
          page_number = parseInt(/&page=([0-9]+)&p=/.exec(href)[1], 10);
          cat = parseInt(/&cat=([0-9]+)&(subcat|post)=/.exec(href)[1], 10);
          topic = parseInt(/&post=([0-9]+)&page=/.exec(href)[1], 10);
        }
        topic = "topic_" + cat + "_" + topic;
        var diff = last_page_number - page_number;
        var local_max_page = Math.min(max_page - 1, diff);
        var base_url = /^(.*)#t[0-9]+$/.exec(href)[1];
        var urls = [base_url];
        ++progress_count;
        if(base_url.indexOf(".htm") !== -1) { // url verbeuse
          for(let i = 0; i < local_max_page; ++i) {
            urls.push(base_url.replace(/_[0-9]+\.htm/, "_" + ++page_number + ".htm"));
            ++progress_count;
          }
        } else { // url à paramètres
          for(let i = 0; i < local_max_page; ++i) {
            urls.push(base_url.replace(/&page=[0-9]+&p=/, "&page=" + ++page_number + "&p="));
            ++progress_count;
          }
        }
        flags.push({
          hash: parseInt(/^.*#t([0-9]+)$/.exec(href)[1], 10),
          titre: a.parentElement.previousElementSibling.previousElementSibling,
          indice: 0,
          max: local_max_page + 1,
          urls: urls,
          page: page_number,
          topic: topic,
          last_page: last_page_number
        });
      }

      //console.log(script_name + " DEBUG les flags :", flags);

      init_progress();
      // go go go
      do_the_next();
    }
  }

  // récupération du pseudal
  var pseudal;
  fetch("https://forum.hardware.fr/hfr/Discussions/nouveau_sujet.htm", {
    method: "GET",
    mode: "same-origin",
    credentials: "same-origin",
    cache: "reload",
    referrer: "",
    referrerPolicy: "no-referrer"
  }).then(function(r) {
    return r.text();
  }).then(function(r) {
    var p = new DOMParser();
    var d = p.parseFromString(r, "text/html");
    pseudal = d.documentElement.querySelector("html body div.container div#mesdiscussions.mesdiscussions " +
      "form#hop table.main tbody tr#pseudoform.reponse.pseudoform td.repCase2 input").value;
    // et c'est parti
    get_the_flags();
  }).catch(function(e) {
    console.log(script_name + " ERROR fetch pseudal : " + e);
  });

});
