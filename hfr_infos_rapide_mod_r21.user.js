// ==UserScript==
// @name          [HFR] infos rapides mod_r21
// @version       3.3.2
// @namespace     http://toyonos.info
// @description   Rajoute un accès rapide à certaines infos du profil d'un membre au passage de la souris sur le pseudo
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @author        toyonos
// @modifications basé sur la version 3 (ou c) - ajout du statut (membre, modal, etc.) dans la popup d'information, suppression de l'info de region (désactivée sur le forum), meilleur calcul de l'age et ajout de l'avatar sur les pseudo de citation (et ceux de [HFR] postal recall)
// @modtype       évolution de fonctionnalités
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// modifications roger21 $Rev: 474 $

// historique :
// 3.3.2 (26/08/2018) :
// - changement du delai avant l'affichage de 1s à 666ms
// 3.3.1 (17/05/2018) :
// - suppression des cookies dans la requête fetch (parce que pas besoin donc bon :o)
// - re-check du code et petite correction [:roger21:2]
// 3.3.0 (13/05/2018) :
// - check du code dans tm (et petites améliorations du codes)
// - recodage en fetch (pour ne pas dépendre de GM_xmlhttpRequest)
// - recodage en window.open (pour ne pas dépendre GM_openInTab)
// - suppression du code des regions (code mort)
// - suppression des @grant inutiles (tous)
// - maj de la metadata @homepageURL
// 3.2.3 (10/12/2017) :
// - correcton du passage au https
// 3.2.2 (28/11/2017) :
// - passage au https
// 3.2.1 (22/09/2017) :
// - gestion de la nouvelle limite du nombre de smileys persos (11) :o
// 3.2.0 (17/09/2017) :
// - gestion de la nouvelle limite du nombre de smileys persos (10)
// 3.1.3 (06/08/2016) :
// - ajout du nom de la version de base dans la metadata @modifications
// 3.1.2 (01/02/2016) :
// - retour du canceled avec une meilleure gestion
// 3.1.1 (28/01/2016) :
// - correction d'un cas particulier sur la regexp des smileys
// - meilleur gestion du timer (et suppression du canceled)
// 3.1.0 (20/01/2016) :
// - ajout de l'avatar sur les infos rapides des citations et des recalls
// 3.0.0 (17/01/2016) :
// - suppression du getElementByXpath -> querySelectorAll
// - suppression de la toyoAjaxLib -> GM_xmlhttpRequest
// - suppression du window.open -> GM_openInTab
// - refactorisation, renommage des variables et des fonctions et compactage du css
// - meilleur calcul de l'age
// - ajout de trim() où utile et de comparaisons stricts partout
// - passage en html 5 pour les br et les img
// - prise en compte de certains cas particuiers
// - meileur gestion du timeout et des appels (pour éviter de multiples requêtes inutiles)
// - découpage des regexp en morceaux (et factorisation quand possible)
// - remplacement des ' par des " (pasque !)
// - optimisation du png du birthday cake (complètement annihilé par ce commentaire)
// 2.3.0 (16/01/2016) :
// - ajout du support pour [HFR] postal recall (si présent)
// - meilleur positionnement de la popup
// 2.2.0 (29/11/2015) :
// - nouveau nom : [HFR] informations rapides sur le profil mod_r21 -> [HFR] infos rapides mod_r21
// 2.1.0 (22/11/2015) :
// - nouveau nom : [HFR] Informations rapides sur le profil mod_r21 -> [HFR] informations rapides sur le profil mod_r21
// 2.0.0 (21/11/2015) :
// - suppression de certains commentaires et de certaines lignes vides
// - découpage de certaines longues lignes (quand c'est possible)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - nouveau numéro de version : 0.2.4c.6 -> 2.0.0
// - nouveau nom : [HFR] Informations rapides sur le profil -> [HFR] Informations rapides sur le profil mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// - suppression du module d'auto-update (code mort)
// 0.2.4c.6 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.2.4c.5 (04/07/2014) :
// - suppression de l'info de region (désactivée sur le forum)
// 0.2.4c.4 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.2.4c.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.2.4c.2 (14/09/2012) :
// - ajout des metadata @grant
// 0.2.4c.1 (28/11/2011) :
// - ajout du statut (membre, modal, etc.) dans la popup
// - désactivation du message d'erreur XML dans la toyolib
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

var root = document.getElementById("mesdiscussions");
var profil_url = "https://forum.hardware.fr/profilebdd.php?config=hfr.inc&pseudo=";
var canceled = false;
var timer = null;

var html_image_1 = "<img style=\"vertical-align:middle;padding:3px;\" src=\"";
var html_image_2 = "\" alt=\"";
var html_image_3 = "\">";

var regexp_avatar = "<img src=\"(https:\/\/forum-images\.hardware\.fr\/images\/mesdiscussions-.*?)\" alt=\"[^\"]+\" \/>";

var regexp_smiley_1 = "<img src=\"(https:\/\/forum-images\.hardware\.fr\/images\/perso\/";
var regexp_smiley_2 = "[^\/]*\.gif)\".*?\/>";

function div_int(a, b) {
  return((a - (a % b)) / b);
}

function get_real_pseudal_value(pseudal_value) {
  return pseudal_value.replace("\u200B", "").replace(" a écrit", "").replace(" :", "");
}

function add_info_pseudal(pseudal, profillink, avatarimg) {
  var real_pseudal = get_real_pseudal_value(pseudal.firstChild.textContent.trim());
  if(real_pseudal !== "Profil supprimé") {
    if(profillink) {
      pseudal.style.cursor = "help";
      pseudal.addEventListener("click", function() {
        window.open(profil_url + real_pseudal);
      }, false);
    }
    add_popup(pseudal, real_pseudal, avatarimg);
  }
}

var pseudos = root.querySelectorAll("table.messagetable td.messCase1 > div:not([postalrecall]) > b.s2");
for(let pseudal of pseudos) {
  add_info_pseudal(pseudal, true, false);
}

var pseudos_citation = root.querySelectorAll("table.messagetable td.messCase2 div.container table.citation td b.s1, " +
  "table.messagetable td.messCase2 div.container table.oldcitation td b.s1");
for(let pseudal of pseudos_citation) {
  add_info_pseudal(pseudal, false, true);
}

window.setTimeout(function() {
  var pseudos_recall = root.querySelectorAll("table.messagetable td.messCase1 > div[postalrecall] > b.s2");
  for(let pseudal of pseudos_recall) {
    add_info_pseudal(pseudal, true, true);
  }
}, 10000);

function add_popup(pseudal, real_pseudal, avatarimg) {
  // ajout du mouseover
  pseudal.addEventListener("mouseover", function(event) {
    // réinitialisation du canceled
    canceled = false;
    if(timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      var infos_div = document.getElementById("infos_pseudal");
      // creation de la div infos si pas déjà fait
      if(infos_div === null) {
        infos_div = document.createElement("div");
        infos_div.setAttribute("id", "infos_pseudal");
        infos_div.style.position = "absolute";
        infos_div.style.border = "1px solid black";
        infos_div.style.background = "white";
        infos_div.style.padding = "3px";
        infos_div.style.maxWidth = "228px";
        infos_div.style.zIndex = "1001";
        infos_div.style.display = "none";
        infos_div.className = "signature";
        root.appendChild(infos_div);
      }
      // recupération du profil et remplissage de la div infos
      fetch(profil_url + real_pseudal, {
        method: "GET",
        mode: "same-origin",
        credentials: "omit",
        cache: "reload",
        referrer: "",
        referrerPolicy: "no-referrer"
      }).then(function(r) {
        return r.text();
      }).then(function(profil) {
        // récuprération des infos
        var tmp;
        var avatar = (tmp = profil.match(new RegExp(regexp_avatar, ""))) !== null ? tmp.pop() : null;
        var status = profil.match(new RegExp("<td class=\"profilCase2\">Statut.*&nbsp;: <\/td>\\s*" +
          "<td class=\"profilCase3\">([^<]+)<\/td>", "")).pop().trim();
        var nb_posts = profil.match(new RegExp("<td class=\"profilCase2\">Nombre de messages .*&nbsp;: <\/td>\\s*" +
          "<td class=\"profilCase3\">([0-9]+)<\/td>", "")).pop();
        var date_insc = profil.match(new RegExp("<td class=\"profilCase2\">Date .* sur le forum&nbsp;: <\/td>\\s*" +
          "<td class=\"profilCase3\">([0-9]{2}\/[0-9]{2}\/[0-9]{4})<\/td>", "")).pop();
        var smiley_perso_0 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_1 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "1\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_2 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "2\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_3 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "3\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_4 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "4\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_5 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "5\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_6 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "6\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_7 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "7\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_8 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "8\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_9 = (tmp = profil.match(new RegExp(regexp_smiley_1 + "9\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var smiley_perso_a = (tmp = profil.match(new RegExp(regexp_smiley_1 + "10\/" +
          regexp_smiley_2, ""))) !== null ? tmp.pop() : null;
        var date_birth = (tmp = profil.match(new RegExp("<td class=\"profilCase2\">Date de naissance&nbsp;: <\/td>\\s*" +
          "<td class=\"profilCase3\">([0-9]{2}\/[0-9]{2}\/[0-9]{4})<\/td>", ""))) !== null ? tmp.pop() : null;
        var sexe = (tmp = profil.match(new RegExp("<td class=\"profilCase2\">[s|S]exe&nbsp;: <\/td>\\s*" +
          "<td class=\"profilCase3\">(homme|femme)<\/td>", ""))) !== null ? tmp.pop() : null;
        var ville = (tmp = profil.match(new RegExp("<td class=\"profilCase2\">[v|V]ille&nbsp;: <\/td>\\s*" +
          "<td class=\"profilCase3\">(.*?)<\/td>", ""))) !== null ? tmp.pop().trim() : null;
        var date_mess = profil.match(new RegExp("<td class=\"profilCase2\">Date du dernier message&nbsp;: <\/td>\\s*" +
          "<td class=\"profilCase3\">\\s*([0-9]{2})-([0-9]{2})-([0-9]{4})&nbsp;." +
          "&nbsp;([0-9]{2})\:([0-9]{2})\\s*<\/td>", ""));
        if(date_mess !== null) {
          date_mess.shift();
        }
        var age;
        if(date_birth !== null) {
          var year = parseInt(date_birth.substring(6, 10));
          var month = parseInt(date_birth.substring(3, 5));
          var day = parseInt(date_birth.substring(0, 2));
          var date = new Date();
          if(((month - 1) === date.getMonth()) && (day === date.getDate())) {
            age = "<span style=\"color:red;font-weight:bold\">" + (date.getFullYear() - year) + " ans</span>&nbsp;<img style=\"vertical-align: bottom;\" alt=\"gateau\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACNElEQVR42p1TTWsTURSdla7c%2BROyEVz4C7oTXQguVLoRFIoUl0aUgEGr0YKgFbStsVJttGotSJKaqCUl4qQxurBgg%2BaTtJnXSdKZJO2QZFJCkuO703RMbUXwwmHeu%2BfjvvdgBKGrIgHhaDQiRIS%2F1L94IRkV9Ip2CFxo%2Fx9eiC%2FuhV7rR3xxT3u3iVt87Psmv6PezD1EaL4XU35HXRTFZIIbaGI4eLrI956n3mHMfTyF4Vc2eZuRkxaOofFACe4vaxh9V4Cu6zAn8m%2BxWITjtQznewXnR1IqecyAz6LXxRjDo1kV06EyRnwqqFxvNydOeAeN%2FZXnMu7PrMI6lgF5zICQGGzywstPZS5QEFjQDMOt6RycHxRceyEbe6e7gMvjDO6ggnlxdsMMCIv%2BdqPRwJ91dVLGA98qbM%2BY2Wu1WlAUBamv9qYZwBasrWQiBrrGVtGJnJ48bE8YZsSS0SuXy0jEf6KQ8UONHPgdsBbe16xnbyKdihmPlc%2FnwaQlrKwwAxSsqiqWl9LQso9BWvKYAbmBg%2B3iRD%2Bq6dtQmQhNmkRdGjShS3exzqZQk%2B5ATztAWvKYASXf%2FqZy7wxk6wmoo31Y911A9ZvdEBNoTT3iSENa8nRfYaOevQEteAnq2Dnk7L2Q%2Bo5h%2BeRhA7SmHnGkIS15ugNclR%2FHOXF929F3BdeQljzdARaOIY56JXoE1cRZ6JmLXDxggNbUI440Ha1lx7%2FAmz0cdg4PR5Kj1kGy0yOup9vzC42qUyLKPOo1AAAAAElFTkSuQmCC\">";
          } else if((month - 1) < date.getMonth()) {
            age = (date.getFullYear() - year) + " ans";
          } else if((month - 1) > date.getMonth()) {
            age = (date.getFullYear() - year - 1) + " ans";
          } else if((month - 1) === date.getMonth()) {
            if(day < date.getDate()) {
              age = (date.getFullYear() - year) + " ans";
            } else {
              age = (date.getFullYear() - year - 1) + " ans";
            }
          }
        } else {
          age = " &acirc;ge non pr&eacute;cis&eacute;";
        }
        switch(sexe) {
          case "homme":
            date_insc = "Inscrit le " + date_insc;
            sexe = "Homme";
            break;
          case "femme":
            date_insc = "Inscrite le " + date_insc;
            sexe = "Femme";
            break;
          default:
            date_insc = "Inscrit(e) le " + date_insc;
            sexe = "Ange";
        }
        ville = ville !== "" && ville !== null ? ville : "Ville non pr&eacute;cis&eacute;e";
        var time_inact = "N'a jamais posté";
        if(date_mess !== null) {
          time_inact = div_int(new Date().getTime() -
            new Date(date_mess[2], date_mess[1] - 1, date_mess[0], date_mess[3], date_mess[4]).getTime(), 1000);
          if(time_inact <= 360) {
            time_inact = "moins de 5min";
          } else if(time_inact < 3600) {
            time_inact = div_int(time_inact, 60) + "min";
          } else if(time_inact < 86400) {
            time_inact = div_int(time_inact, 3600) + "h";
          } else {
            time_inact = div_int(time_inact, 86400) + " jours";
          }
          time_inact = "Dernier post il y a " + time_inact;
        }
        // remplissage de la div infos
        var html = "";
        if(avatarimg && avatar !== null) {
          html += html_image_1 + avatar + html_image_2 + real_pseudal + html_image_3 + "<br>";
        }
        html += sexe + ", " + age + "<br>" + ville + "<br>" + date_insc + " (" + status +
          ")<br>" + nb_posts + " posts<br>" + time_inact + "<br>";
        if(smiley_perso_0 !== null) {
          html += html_image_1 + smiley_perso_0 + html_image_2 + real_pseudal + html_image_3;
        }
        if(smiley_perso_1 !== null) {
          html += html_image_1 + smiley_perso_1 + html_image_2 + real_pseudal + ":1" + html_image_3;
        }
        if(smiley_perso_2 !== null) {
          html += html_image_1 + smiley_perso_2 + html_image_2 + real_pseudal + ":2" + html_image_3;
        }
        if(smiley_perso_3 !== null) {
          html += html_image_1 + smiley_perso_3 + html_image_2 + real_pseudal + ":3" + html_image_3;
        }
        if(smiley_perso_4 !== null) {
          html += html_image_1 + smiley_perso_4 + html_image_2 + real_pseudal + ":4" + html_image_3;
        }
        if(smiley_perso_5 !== null) {
          html += html_image_1 + smiley_perso_5 + html_image_2 + real_pseudal + ":5" + html_image_3;
        }
        if(smiley_perso_6 !== null) {
          html += html_image_1 + smiley_perso_6 + html_image_2 + real_pseudal + ":6" + html_image_3;
        }
        if(smiley_perso_7 !== null) {
          html += html_image_1 + smiley_perso_7 + html_image_2 + real_pseudal + ":7" + html_image_3;
        }
        if(smiley_perso_8 !== null) {
          html += html_image_1 + smiley_perso_8 + html_image_2 + real_pseudal + ":8" + html_image_3;
        }
        if(smiley_perso_9 !== null) {
          html += html_image_1 + smiley_perso_9 + html_image_2 + real_pseudal + ":9" + html_image_3;
        }
        if(smiley_perso_a !== null) {
          html += html_image_1 + smiley_perso_a + html_image_2 + real_pseudal + ":10" + html_image_3;
        }
        infos_div.innerHTML = html;
        // affichage de la div infos
        if(canceled) {
          return;
        }
        infos_div.style.display = "block";
        infos_div.style.left = (event.clientX + 8) + "px";
        if(event.clientY + 8 + infos_div.offsetHeight >= document.documentElement.clientHeight) {
          infos_div.style.top = (window.scrollY + event.clientY - 8 - infos_div.offsetHeight) + "px";
        } else {
          infos_div.style.top = (window.scrollY + event.clientY + 8) + "px";
        }
      }).catch(function(e) {
        console.log("[HFR] infos rapides mod_r21 ERROR fetch : " + e);
      });
    }, 666);
  }, false);
  // ajout du mouseout
  pseudal.addEventListener("mouseout", function(event) {
    // activation du canceled
    canceled = true;
    if(timer) {
      clearTimeout(timer);
    }
    if(document.getElementById("infos_pseudal")) {
      document.getElementById("infos_pseudal").style.display = "none";
    }
  }, false);
}
