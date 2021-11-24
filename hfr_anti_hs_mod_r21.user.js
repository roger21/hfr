// ==UserScript==
// @name          [HFR] Anti HS mod_r21
// @version       3.3.1
// @namespace     roger21.free.fr
// @description   Permet de filtrer les messages sans intérêts d'un topic via un ensemble de règles configurables.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*/*-sujet_*_*.htm*
// @exclude       https://forum.hardware.fr/forum2.php*&quote_only=1*
// @author        roger21
// @authororig    mycrub
// @modifications Ajout d'un mode OU, ajout d'un filtre sur les vidéos, le nombre de fois cité, les spoilers, les liens internes, les mots obligatoires, les gifs, les tags et les messages récents et refonte de l'interface et du code.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_anti_hs_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_anti_hs_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_anti_hs_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.registerMenuCommand
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2012, 2014-2021 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 3283 $

// historique :
// 3.3.1 (24/11/2021) :
// - prise en compte des gifv (quand utilisés en images) dans la détection des gifs (signalé par H00d)
// 3.3.0 (02/02/2021) :
// - ajout du support pour GM.registerMenuCommand() (pour gm4)
// 3.2.9 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 3.2.8 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 3.2.7 (05/11/2019) :
// - ajout d'une espace après les liens de page dans les tableaux des topics
// - réduction des temps des transitions de 0.7s à 0.3s
// 3.2.6 (25/10/2019) :
// - compactage de la fenêtre de configuration
// - simplification d'un label
// 3.2.5 (13/10/2019) :
// - nouvelle (la dernière !) correction de la gestion de la compatibilité gm4 pour vm
// 3.2.4 (12/10/2019) :
// - correction du nom de deux paramètres d'une fonction (pour homogénéité du code)
// 3.2.3 (12/10/2019) :
// - ajout d'une info "sans rechargement" dans la fenêtre de configuration
// - passage du double-clic au clic-droit pour ouvrir la fenêtre de configuration
// - simplification des titles sur les boutons
// - désactivation du redimensionnement sur les textarea
// - correction de la gestion du curseur sur les ET / OU
// 3.2.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 3.2.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 3.2.0 (09/09/2019) :
// - nouvelle gestion de l'affichage de la fenêtre de configuration
// - bordure solide pour la fenêtre de configuration
// - petites mises en forme et corrections et nettoyage du code
// 3.1.7 (01/06/2019) :
// - amélioration de la gestion de l'affichage du nombre de messages filtrés
// 3.1.6 (16/04/2019) :
// - exclusion des pages de résultats de recherche par quote
// 3.1.5 (23/12/2018) :
// - petite homogénéisation des espaces dans la fenêtre de configuration
// 3.1.4 (01/12/2018) :
// - petites améliorations des espaces entre les titres de la fenêtre de configuration
// 3.1.3 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+ *si mycrub est d'accord*
// - check du code dans tm et corrections diverses
// 3.1.2 (05/08/2018) :
// - ajout d'une majuscule dans la commande du menu GM
// 3.1.1 (30/07/2018) :
// - correction d'une fôte, signalée par Daphne :jap:
// 3.1.0 (28/07/2018) :
// - nouveau nom : [HFR] Anti HS mod_r21_gm4 -> [HFR] Anti HS mod_r21
// - ajout du nombre de messages filtrés dans l'entête du topic
// - ajout d'un filtre sur les messages récents
// - utilisation d'une classe css au lieu de l'attribut style pour masquer les messages ->
// plus propre et permet de fonctionner avec d'autres scripts comme black liste
// 3.0.0 (09/06/2018) :
// - gestion de la compatibilité gm4
// - nouveau nom : [HFR] anti hs mod_r21 -> [HFR] Anti HS mod_r21_gm4
// - refonte complète du code et check du code dans tm
// - gestion des #HashTags en plus des tags dans le filtre sur les tags
// - ajout d'un filtre supplémentaire sur les gifs en lien avec le filtre images
// - prise en compte des citations pour les mots interdits et obligatoires
// - compactage de la fenêtre de configuration ->
// choix du mode de filtrage dans le titre des règles
// - suppression des @grant inutiles
// - maj de la metadata @homepageURL
// - amélioration des @include
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (mycrub)
// - réécriture des metadata @description, @modifications et @modtype
// 2.6.0 (23/04/2018) :
// - ajout du filtre sur les tags
// - petites corrections de code et check du code dans tm
// 2.5.7 (23/12/2017) :
// - suppression de la bordure rouge qui plait a personne ...
// 2.5.6 (09/12/2017) :
// - correction du selecteur de messages (evol du forum) par PetitJean
// 2.5.5 (28/11/2017) :
// - passage au https
// 2.5.4 (09/10/2017) :
// - désactivation de la tooltip "Le topic est filtré par [HFR] anti hs"
// 2.5.3 (28/07/2017) :
// - prise en compte des urls verbeuses pour les topics sans sous-cat
// 2.5.2 (09/04/2017) :
// - correction d'un bug sur la detection du nombre de quotes (chaine non convertie en int, signalé par nahouto)
// 2.5.1 (30/03/2017) :
// - resémentisation de l'interface :o (nan mais c'est encore plus clair là normalement)
// 2.5.0 (19/03/2017)
// - ajout des filtres sur les sploiers, les liens internes et les mots obligatoires
// - suppresson des fonctions d'anti-scroll sur la fenêtre de configuration (et passage en fixed)
// - compactage / simplification de la fenêtre de configuration
// 2.4.0 (11/02/2017) :
// - ajout du filtre sur le nombre de quotes
// - léger restylage de bouts de code
// - correction du style font-fammily à Verdana,Arial,Sans-serif,Helvetica (HFR Style)
// - compression des images (pngoptimizer)
// - légers restylages de la fenêtre de conf (oui, encore :o )
// 2.3.0 (15/12/2016) :
// - correction de la taille des polices dans la fenêtre de configuration
// - légère remise en forme de la fenêtre de configuration
// - ajout de la détection des videos (<video>, <audio> ou <iframe>)
// 2.2.0 (24/11/2015) :
// - nouveau nom (oui encore :o ) : [HFR] image anti hs mod_r21 -> [HFR] anti hs mod_r21
// - remplacement des ' par des " (pasque !)
// 2.1.0 (22/11/2015) :
// - nouveau nom : [HFR] Image Anti HS mod_r21 -> [HFR] image anti hs mod_r21
// 2.0.0 (21/11/2015) :
// - ajout d'une bordure rouge et d'un tooltip explicite en mode filtré
// - reformatage du tooltip sur le bouton HS
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - nouveau numéro de version : 0.2.3 -> 2.0.0
// - nouveau nom : [HFR] Image Anti HS -> [HFR] Image Anti HS mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.2.3 (17/10/2015) :
// - uniformisation du nom du script : "Anti HS" -> "Image Anti HS"
// - genocide de commentaires et de lignes vides
// - ajout de la commande de configuration dans le menu greasemonkey (puisqu'elle existe) et avec le bon nom
// 0.2.2.8 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.2.2.7 (19/01/2015) :
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - + reformatage allin (emacs)
// 0.2.2.6 (19/01/2015) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - restylage de la fenêtre de conf
// - ajout d'un mode OU sur les filtres (en plus du mode ET implicite précédent)
// - meilleure gestion de l'affichage des parametres sélectionnés sur la fenêtre de conf
// - réactivation du filtrage des images quotés (comportement par défaut)
// - meilleure sémantique de l'affichage du bouton HS et de son title (tooltip)
// - meilleure gestion de l'affichage du bouton HS au niveau du DOM (plus d'element perdus et recréés)
// - suppression du log d'activité
// - inversion de la sémantique du bouton HS : "gris" devient "désactivé" et "couleur" devient "activé"
// - nouveaux titles (tooltip) pour le bouton HS
// - nouvelles icones pour le bouton HS
// - compactage du css
// - reencodage des images en base64
// - decoupage des lignes de code trop longue
// - suppression de certains commentaires inutiles
// - suppression de bouts de code mort
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - suppression du module d'auto-update (code mort)
// 0.2.2.5 (27/03/2014) :
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.2.2.4 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.2.2.3 (14/09/2012) :
// - ajout des metadata @grant
// 0.2.2.1 à 0.2.2.2 (15/02/2012) :
// - désactive le filtrage des images quotés
// - modification de la marge à 5px au lieu de 3px
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

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
var gmMenu = GM.registerMenuCommand || GM_registerMenuCommand;

(function() {

  /* ---------------------------------------------------- */
  /* construction des variables globales et vérifications */
  /* ---------------------------------------------------- */

  // élément racine pour les recherches en querySelector
  var root = document.querySelector("div#mesdiscussions.mesdiscussions");

  // verification de l'élément racine
  if(root === null) {
    console.log("[HFR] Anti HS md_r21 ERROR root is null")
    return;
  }

  // identifiant du topic (cat_post)
  var topic = null;

  // construction de l'identifiant du topic (cat_post)
  let result_topic = /.*forum2\.php\?.*&cat=(\d*)&.*&post=(\d*)&.*/.exec(document.location.href);
  if(result_topic !== null) {
    let cat = result_topic[1];
    let post = result_topic[2];
    topic = cat + "_" + post;
  } else {
    let search = root.querySelector("table.main tr th form[action=\"/transsearch.php\"]");
    if(search !== null &&
      search.querySelector("input[name=\"cat\"]") !== null &&
      search.querySelector("input[name=\"post\"]") !== null) {
      let cat = search.querySelector("input[name=\"cat\"]").value.trim();
      let post = search.querySelector("input[name=\"post\"]").value.trim();
      topic = cat + "_" + post;
    }
  }

  // verification de la construction de l'identifiant du topic
  if(topic === null) {
    console.log("[HFR] Anti HS md_r21 ERROR topic is null")
    return;
  }

  // valeurs de filtrage par défaut
  var default_min_message_length = 500;
  var default_min_quoted_number = 4;
  var default_recent_messages_seconds = 60;

  // regexp des dates
  var date_regexp = "([0-9]{2})-([0-9]{2})-([0-9]{4}).*((?:[0-9]{2}:){2}[0-9]{2})";
  var post_regexp = new RegExp("^.*Posté le " + date_regexp + ".*$");
  var edit_regexp = new RegExp("^.*Message édité par .* le " + date_regexp + ".*$");

  /* -------------------------------- */
  /* gestion du message d'information */
  /* -------------------------------- */

  // construction de la div
  var info_div = null;
  var topic_bar = root.querySelector("table.main tbody tr.cBackHeader td.padding div.pagepresuiv:last-of-type");
  var topic_bar_simple = root.querySelector("table.main tbody tr.cBackHeader th.padding > a.cHeader");
  if(topic_bar && topic_bar.parentElement) {
    info_div = document.createElement("div");
    info_div.style.fontWeight = "bold";
    info_div.style.color = "crimson";
    topic_bar.parentElement.appendChild(info_div);
  } else if(topic_bar_simple && topic_bar_simple.parentElement) {
    info_div = document.createElement("div");
    info_div.style.fontWeight = "bold";
    info_div.style.color = "crimson";
    let pagepresuiv_div = document.createElement("div");
    pagepresuiv_div.className = "pagepresuiv";
    topic_bar_simple.parentElement.appendChild(pagepresuiv_div);
    topic_bar_simple.parentElement.appendChild(info_div);
    pagepresuiv_div.appendChild(topic_bar_simple);
  }

  // amélioration de l'affichage du forum ajout d'une espace après les liens de page
  var first_pagepresuivs = root.querySelectorAll("table tbody tr.cBackHeader .padding " +
    "div:not(.pagepresuiv) + div.pagepresuiv, table tbody tr.cBackHeader .padding div.pagepresuiv:first-of-type");
  for(let first_pagepresuiv of first_pagepresuivs) {
    if(first_pagepresuiv && first_pagepresuiv.parentElement) {
      let space_div = document.createElement("div");
      space_div.className = "pagepresuiv";
      space_div.style.margin = "0";
      space_div.textContent = "\u00a0";
      first_pagepresuiv.parentElement.insertBefore(space_div, first_pagepresuiv);
    }
  }

  // function d'affichage du message
  function display_count(cpt) {
    if(info_div) {
      if(cpt === 0) {
        info_div.textContent = "Aucun message filtré par [HFR] Anti HS";
      } else if(cpt === 1) {
        info_div.textContent = "Un message filtré par [HFR] Anti HS";
      } else {
        info_div.textContent = cpt + " messages filtrés par [HFR] Anti HS";
      }
    }
  }

  // function de masquage du message
  function hide_count() {
    if(info_div) {
      info_div.textContent = "";
    }
  }

  /* ------------------------------------ */
  /* construction des boutons de filtrage */
  /* ------------------------------------ */

  // images des boutons de fitrage
  var enabled_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAB40lEQVR42oVTsUtCcRD%2BoTTk0mxUZjT0FySvwRoajCiHanAtCLcKaigUMYICEYJGh6QhaJGgKZIIjSAQgqZagkQRMS1fviyL93X3eJr1lA4O7%2FzdfXf33T0hWsizEBLpFmlMV7Yl8Z%2BUhBghfXgRola2WNTXnh7IVivY5v%2F4jWNaJheFWKAqaqWvD1%2Fr60AyCRQKQC4HJBL42thAxWYDxxDIiqEyP1SdTuD0FC3l%2FR21mRmUzWZQN6yjzQAPjN42meRzfl5L%2FnC5oNjtDJCuJ0vkfN663SAXTxR8nEo1bJY7hwMUjV3S3s5OpCYmUKaOKc%2FJAFtMUjIYNALIMmoej5Z82NGh%2Bec3N7gIBCB3dXEXOwwQY6bPIhEtqVmLU1NcCVHdHxofx%2Fb%2BPpDJgMkmgBMDwHU2i0g0ijDZRKzWgUwELoVC6B4e1mIONjd%2FAfwegdq8lyQ86h2wzC4v415RkFZVCJMJR15vfYQ9A4nFyUk80W9YB2MZHBtrjOUmAt%2FW1n5IbF7jB89MFWpzc23XiXgcysDAzxqbD6m%2BZ1SrbZOr1I1%2BSNN%2Fr3GRH%2FhIVJ8PuLoCSiUgnwcuL6H6%2FfXKrKstvwc%2BT26N52OSlP5%2BjW229ZnThsptgJzMMK9J170GYX%2FkGyk57Hc0wG6yAAAAAElFTkSuQmCC";
  var disabled_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAB1ElEQVR42oVTu2pCQRT0H%2FwJawvBIPEDhFj5Awai4PuFWFgI4rMR06n4QBBFuE2wUbT0F%2ByiiGKpIIoPcHJn8RoTNTlwYPeendk5c%2FaqVHfC6XTq5YzLKZ2Ta73qv5APPbnd7s9AIHCIRqOnZDKJRCIBrvmNNZ65C3Y4HK8ej%2BeUSqXQ7XYxnU6x3%2B%2Bx3W7FutfrIZ1Og2dcLpfv5mYWCoUCxuMxHkWj0UAkEoHP54OsxnghoDSy%2FwWWJEmAq9UqstksvF7vVJGul%2Fs75nI5yFshezAYiPXhcBBgemG322E0GqFWq5HJZBAKhU7yxc8kiNOkWq12ASkEy%2BUSrVYLNpsNFotF7IfDISqVCmKxGNtIkUCi0%2B12W4Cus1QqIRwOw2w2i71Op0M%2Bn8d6vQbNlgk%2BbghGoxHK5TIMBgOCwaBQsNlsOEpoNBpxhiTXBD9aoEwWKZsKGFarFYvFAqvVSpxh%2FdzC%2B42JBPn9fqGAZAytVntpy2QyodPpfJt4PcZ6vS5G1Ww2H45zMpn8HOP1Q1Lm%2FBe4WCwqD%2Bnl92t8Y4Hs%2FX4f8%2Fkcx%2BMRu90Os9lMfGPtDA7e%2FR%2F4PCmN%2FdEkAhTD%2BI21m5sfED3TYY7pnO8Xw37FF%2BtGGhEY747bAAAAAElFTkSuQmCC";

  // boutons d'activation et de désactivation du filtrage
  var enabled_button;
  var disabled_button;


  // désactivation de l'action par défaut sur les évenements
  function prevent_default(event) {
    event.preventDefault();
  }

  // action du clic sur le bouton en mode non filtré
  function disabled_button_click_action(event) {
    event.preventDefault();
    topic_has_filters(function(has_filters) {
      if(has_filters) { // si le topic a des filtres
        // passe en mode filtré
        set_topic_filtered_status(true).then(function() {
          // filtre la page
          process_page();
        });
      } else { // sinon
        // affiche la fenêtre de configuration
        show_config_window();
      }
    });
  }

  // action du clic sur le bouton en mode filtré
  function enabled_button_click_action(event) {
    event.preventDefault();
    // passe en mode non filtré
    set_topic_filtered_status(false).then(function() {
      // dé-filtre la page
      process_page();
    });
  }

  // action du clic droit sur les boutons
  function button_mouseup_action(event) {
    event.preventDefault();
    if(event.button === 2) {
      // affiche la fenêtre de configuration
      show_config_window();
    }
  }

  // création des boutons d'activation et de désactivation du filtrage
  var buttons_div = document.createElement("div");
  buttons_div.className = "right";
  disabled_button = document.createElement("img");
  disabled_button.src = disabled_img;
  disabled_button.style.cursor = "pointer";
  disabled_button.style.marginRight = "5px";
  disabled_button.addEventListener("contextmenu", prevent_default, false);
  disabled_button.addEventListener("click", disabled_button_click_action, false);
  disabled_button.addEventListener("mouseup", button_mouseup_action, false);
  enabled_button = document.createElement("img");
  enabled_button.src = enabled_img;
  enabled_button.style.cursor = "pointer";
  enabled_button.style.marginRight = "5px";
  enabled_button.addEventListener("contextmenu", prevent_default, false);
  enabled_button.addEventListener("click", enabled_button_click_action, false);
  enabled_button.addEventListener("mouseup", button_mouseup_action, false);
  buttons_div.appendChild(enabled_button);
  buttons_div.appendChild(disabled_button);
  root.querySelector("table.main tbody tr th div.right").appendChild(buttons_div);

  // fonction de traitement de la page et de filtrage des messages
  function process_page() {
    let messages = root.querySelectorAll("table[class~=\"messagetable\"]");
    get_topic_filtered_status().then(function(status) {
      if(status) {
        disabled_button.style.display = "none";
        enabled_button.style.display = "inline";
        filter_messages(messages);
        enabled_button.title =
          "Désactiver le filtrage du topic\n(clic droit pour configurer)";
      } else {
        disabled_button.style.display = "inline";
        enabled_button.style.display = "none";
        for(let message of messages) {
          message.classList.remove("gmhfrr21_ah_hide");
        }
        topic_has_filters(function(has_filters) {
          if(has_filters) {
            disabled_button.title =
              "Activer le filtrage du topic\n(clic droit pour configurer)";
          } else {
            disabled_button.title = "Configurer le filtrage du topic";
          }
        });
        hide_count();
      }
    });
  }

  /* ------------------------------------------------------- */
  /* fonctions d'accès aux paramètres de filtrage configurés */
  /* ------------------------------------------------------- */

  // retourne l'état du topic (filtré ou non filtré)
  async function get_topic_filtered_status() {
    let value = await GM.getValue("ah_topic_filtered_status." + topic, false);
    return value;
  }

  // enregistre l'état du topic (filtré ou non filtré)
  async function set_topic_filtered_status(status) {
    await GM.setValue("ah_topic_filtered_status." + topic, status);
  }

  // filtrage du topic en ET
  async function filter_on_and() {
    let value = await GM.getValue("ah_filter_on_and." + topic, true);
    return value;
  }

  // filtrage du topic sur les images
  async function filter_on_images() {
    let value = await GM.getValue("ah_filter_on_images." + topic, false);
    return value;
  }

  // filtrage du topic sur les gifs
  async function filter_on_gifs() {
    let value = await GM.getValue("ah_filter_on_gifs." + topic, false);
    return value;
  }

  // filtrage du topic sur les citations
  async function filter_on_quotes() {
    let value = await GM.getValue("ah_filter_on_quotes." + topic, false);
    return value;
  }

  // filtrage du topic sur les citations extra-pages
  async function filter_on_extra_page_quotes() {
    let value = await GM.getValue("ah_filter_on_extra_page_quotes." + topic, false);
    return value;
  }

  // filtrage du topic sur la longueur minimale du message
  async function filter_on_min_message_length() {
    let value = await GM.getValue("ah_filter_on_min_message_length." + topic, false);
    return value;
  }

  // filtrage du topic sur les liens internes
  async function filter_on_internal_links() {
    let value = await GM.getValue("ah_filter_on_internal_links." + topic, false);
    return value;
  }

  // filtrage du topic sur les liens externes
  async function filter_on_external_links() {
    let value = await GM.getValue("ah_filter_on_external_links." + topic, false);
    return value;
  }

  // filtrage du topic sur le nombre minimal de fois cité
  async function filter_on_min_quoted_number() {
    let value = await GM.getValue("ah_filter_on_min_quoted_number." + topic, false);
    return value;
  }

  // filtrage du topic sur les vidéos
  async function filter_on_videos() {
    let value = await GM.getValue("ah_filter_on_videos." + topic, false);
    return value;
  }

  // filtrage du topic sur les spoilers
  async function filter_on_spoilers() {
    let value = await GM.getValue("ah_filter_on_spoilers." + topic, false);
    return value;
  }

  // filtrage du topic sur les tags et les #HashTags
  async function filter_on_tags() {
    let value = await GM.getValue("ah_filter_on_tags." + topic, false);
    return value;
  }

  // filtrage du topic sur les messages récents
  async function filter_on_recent_messages() {
    let value = await GM.getValue("ah_filter_on_recent_messages." + topic, false);
    return value;
  }

  // filtrage du topic sur les messages récents avec edit
  async function filter_on_recent_messages_with_edit() {
    let value = await GM.getValue("ah_filter_on_recent_messages_with_edit." + topic, false);
    return value;
  }

  // filtrage du topic sur les mots interdits
  async function filter_on_forbidden_words() {
    let value = await GM.getValue("ah_filter_on_forbidden_words." + topic, false);
    return value;
  }

  // filtrage du topic sur les mots obligatoires
  async function filter_on_mandatory_words() {
    let value = await GM.getValue("ah_filter_on_mandatory_words." + topic, false);
    return value;
  }

  // test si le topic est déjà configuré avec des filtres
  function topic_has_filters(callback) {
    Promise.all([
      filter_on_images(),
      filter_on_quotes(),
      filter_on_extra_page_quotes(),
      filter_on_min_message_length(),
      filter_on_internal_links(),
      filter_on_external_links(),
      filter_on_min_quoted_number(),
      filter_on_videos(),
      filter_on_spoilers(),
      filter_on_tags(),
      filter_on_recent_messages(),
      filter_on_forbidden_words(),
      filter_on_mandatory_words(),
    ]).then(function([
      on_images,
      on_quotes,
      on_extra_page_quotes,
      on_min_message_length,
      on_internal_links,
      on_external_links,
      on_min_quoted_number,
      on_videos,
      on_spoilers,
      on_tags,
      on_recent_messages,
      on_forbidden_words,
      on_mandatory_words,
    ]) {
      callback(on_images ||
        on_quotes ||
        on_extra_page_quotes ||
        on_min_message_length ||
        on_internal_links ||
        on_external_links ||
        on_min_quoted_number || on_videos ||
        on_spoilers ||
        on_tags ||
        on_recent_messages ||
        on_forbidden_words ||
        on_mandatory_words);
    });
  }

  // retourne la longueur minimale du message configuré pour le topic
  async function get_topic_min_message_length() {
    let value = await GM.getValue("ah_topic_min_message_length." + topic, default_min_message_length);
    return value;
  }

  // retourne le nombre minimal de fois cité configuré pour le topic
  async function get_topic_min_quoted_number() {
    let value = await GM.getValue("ah_topic_min_quoted_number." + topic, default_min_quoted_number);
    return value;
  }

  // retourne le nombre de secondes pour les messages récents configuré pour le topic
  async function get_topic_recent_messages_seconds() {
    let value = await GM.getValue("ah_topic_recent_messages_seconds." + topic, default_recent_messages_seconds);
    return value;
  }

  // retourne la liste des mots interdits
  async function get_forbidden_words() {
    let words = await GM.getValue("ah_forbidden_words", "");
    return words.split(/\s*\n\s*/);
  }

  // retourne la liste des mots obligatoires
  async function get_mandatory_words() {
    let words = await GM.getValue("ah_mandatory_words", "");
    return words.split(/\s*\n\s*/);
  }

  /* -------------------------------- */
  /* fonctions d'analyse des messages */
  /* -------------------------------- */

  // test si le message a des images
  function message_has_images(message) {
    let images = message.querySelectorAll(
      "div[id^=\"para\"] img:not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])");
    let quoted_images = message.querySelectorAll(
      "div[id^=\"para\"] table.citation img:not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.oldcitation img:not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])");
    return images.length - quoted_images.length > 0;
  }

  // test si le message a des gifs
  function message_has_gifs(message) {
    let gifs = message.querySelectorAll(
      "div[id^=\"para\"] img[src$=\".gif\" i]:not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] img[src*=\".gif?\" i]:not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] img[src*=\".gif&\" i]:not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] img[src$=\".gifv\" i]:not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] img[src*=\".gifv?\" i]:not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] img[src*=\".gifv&\" i]:not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])");
    let quoted_gifs = message.querySelectorAll(
      "div[id^=\"para\"] table.citation img[src$=\".gif\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.citation img[src*=\".gif?\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.citation img[src*=\".gif&\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.oldcitation img[src$=\".gif\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.oldcitation img[src*=\".gif?\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.oldcitation img[src*=\".gif&\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.citation img[src$=\".gifv\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.citation img[src*=\".gifv?\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.citation img[src*=\".gifv&\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.oldcitation img[src$=\".gifv\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.oldcitation img[src*=\".gifv?\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])," +
      "div[id^=\"para\"] table.oldcitation img[src*=\".gifv&\" i]" +
      ":not([src^=\"http://forum-images.hardware.fr\"])" +
      ":not([src^=\"https://forum-images.hardware.fr\"]):not([src^=\"data:image\"])");
    return gifs.length - quoted_gifs.length > 0;
  }

  // test si le message a des citations
  function message_has_quotes(message) {
    let quotes = message.querySelectorAll(
      "div[id^=\"para\"] table.citation," +
      "div[id^=\"para\"] table.oldcitation");
    return quotes.length > 0;
  }

  // test si le message a des citations extra-pages
  function message_has_extra_page_quotes(message) {
    let quotes = message.querySelectorAll(
      "div[id^=\"para\"] table.citation b.s1 a," +
      "div[id^=\"para\"] table.oldcitation b.s1 a");
    for(let quote of quotes) {
      let href = quote.href;
      let anchor = href.substring(href.lastIndexOf("#") + 1);
      if(document.getElementsByName(anchor).length === 0) {
        return true;
      }
    }
    return false;
  }

  // retourne le texte du message (hors citations)
  function get_message_text(message) {
    let text = "";
    let ps = message.querySelectorAll("div[id^=\"para\"] > p");
    for(let p of ps) {
      text += p.textContent + " ";
    }
    return text;
  }

  // retourne le texte du message (avec citations)
  function get_message_full_text(message) {
    let text = "";
    let els = message.querySelectorAll("div[id^=\"para\"] p");
    for(let el of els) {
      text += el.textContent + " ";
    }
    return text;
  }

  // test si le message a des liens internes
  function message_has_internal_links(message) {
    let links = message.querySelectorAll(
      "div[id^=\"para\"] p a[href^=\"http://forum.hardware.fr\"]," +
      "div[id^=\"para\"] p a[href^=\"https://forum.hardware.fr\"]");
    let quoted_links = message.querySelectorAll(
      "div[id^=\"para\"] table.citation p a[href^=\"http://forum.hardware.fr\"]," +
      "div[id^=\"para\"] table.citation p a[href^=\"https://forum.hardware.fr\"]," +
      "div[id^=\"para\"] table.oldcitation p a[href^=\"http://forum.hardware.fr\"]," +
      "div[id^=\"para\"] table.oldcitation p a[href^=\"https://forum.hardware.fr\"]");
    return links.length - quoted_links.length > 0;
  }

  // test si le message a des liens externes
  function message_has_external_links(message) {
    let links = message.querySelectorAll(
      "div[id^=\"para\"] p a:not([href^=\"http://forum.hardware.fr\"])" +
      ":not([href^=\"https://forum.hardware.fr\"])");
    let quoted_links = message.querySelectorAll(
      "div[id^=\"para\"] table.citation p a:not([href^=\"http://forum.hardware.fr\"])" +
      ":not([href^=\"https://forum.hardware.fr\"])," +
      "div[id^=\"para\"] table.oldcitation p a:not([href^=\"http://forum.hardware.fr\"])" +
      ":not([href^=\"https://forum.hardware.fr\"])");
    return links.length - quoted_links.length > 0;
  }

  // retourne le nombre de fois cité du message
  function get_message_quoted_number(message) {
    let quoted = message.querySelector("div.edited > a");
    if(quoted !== null) {
      return parseInt(quoted.firstChild.nodeValue.match(/^.*Message[^0-9]+([0-9]+)[^0-9]+fois.*$/)[1], 10);
    } else {
      return 0;
    }
  }

  // test si le message a des videos
  function message_has_videos(message) {
    let videos = message.querySelectorAll(
      "div[id^=\"para\"] video");
    let audios = message.querySelectorAll(
      "div[id^=\"para\"] audio");
    let iframes = message.querySelectorAll(
      "div[id^=\"para\"] iframe");
    let quoted_videos = message.querySelectorAll(
      "div[id^=\"para\"] table.citation video," +
      "div[id^=\"para\"] table.oldcitation video");
    let quoted_audios = message.querySelectorAll(
      "div[id^=\"para\"] table.citation audio," +
      "div[id^=\"para\"] table.oldcitation audio");
    let quoted_iframes = message.querySelectorAll(
      "div[id^=\"para\"] table.citation iframe," +
      "div[id^=\"para\"] table.oldcitation iframe");
    return videos.length + audios.length + iframes.length -
      quoted_videos.length + quoted_audios.length + quoted_iframes.length > 0;
  }

  // test si le message a des spoilers
  function message_has_spoilers(message) {
    let spoilers = message.querySelectorAll(
      "div[id^=\"para\"] table.spoiler");
    let quoted_spoilers = message.querySelectorAll(
      "div[id^=\"para\"] table.citation table.spoiler," +
      "div[id^=\"para\"] table.oldcitation table.spoiler");
    return spoilers.length - quoted_spoilers.length > 0;
  }

  // test si le message a des tags ou des #HashTags
  function message_has_tags(message) {
    let text = get_message_text(message);
    let re_tag_1 = /(:?^|[^0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF])(tag[0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF]+)(?:[^0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF]|$)/gi;
    let re_tag_2 = /^[^0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF]?(tags|tague|tagues|taguee|taguees|taguer|tagué|tagués|taguée|taguées|tagge|tagges|taggee|taggees|taggé|taggés|taggée|taggées|tagger)[^0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF]?$/i;
    let results_tag = text.match(re_tag_1);
    if(results_tag !== null) {
      for(let tag of results_tag) {
        if(re_tag_2.test(tag) === false) {
          return true;
        }
      }
    } else {
      let re_hash_1 = /(:?^|[^0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF])(#[0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF]+)(?:[^0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF]|$)/gi;
      let re_hash_2 = /^[^0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF]?(#(?:[0-9a-fA-F]{3}){1,2})[^0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF-\u024F\u1E00-\u1EFF]?$/i;
      let results_hash = text.match(re_hash_1);
      if(results_hash !== null) {
        for(let hash of results_hash) {
          if(re_hash_2.test(hash) === false) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // retourne la date du message en secondes
  function get_message_timestamp(message) {
    let timestamp = 0;
    let post = message.querySelector("tr.message td.messCase2 div.toolbar");
    if(post) {
      let result = post_regexp.exec(post.textContent);
      if(result !== null) {
        let date = new Date(result[3] + "-" + result[2] + "-" + result[1] + "T" + result[4]);
        timestamp = date.getTime();
      }
    }
    return timestamp;
  }

  // retourne la date du message en secondes
  function get_message_edit_timestamp(message) {
    let timestamp = 0;
    let edit = message.querySelector("tr.message td.messCase2 div[id^=\"para\"] div.edited");
    if(edit) {
      let result = edit_regexp.exec(edit.textContent);
      if(result !== null) {
        let date = new Date(result[3] + "-" + result[2] + "-" + result[1] + "T" + result[4]);
        timestamp = date.getTime();
      }
    }
    return timestamp;
  }

  // test si le message a un des mots fournis
  function message_has_words(message, words) {
    let text = get_message_full_text(message);
    for(let word of words) {
      if(word.trim() !== "") {
        if(text.toLowerCase().includes(word.trim().toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }

  // styles css pour le masquage des messages
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent = ".gmhfrr21_ah_hide{display:none;}";
  document.getElementsByTagName("head")[0].appendChild(style);

  // filtrage des messages
  function filter_messages(messages) {
    Promise.all([
      filter_on_and(),
      filter_on_images(),
      filter_on_gifs(),
      filter_on_quotes(),
      filter_on_extra_page_quotes(),
      filter_on_min_message_length(),
      get_topic_min_message_length(),
      filter_on_internal_links(),
      filter_on_external_links(),
      filter_on_min_quoted_number(),
      get_topic_min_quoted_number(),
      filter_on_videos(),
      filter_on_spoilers(),
      filter_on_tags(),
      filter_on_recent_messages(),
      filter_on_recent_messages_with_edit(),
      get_topic_recent_messages_seconds(),
      filter_on_forbidden_words(),
      filter_on_mandatory_words(),
      get_forbidden_words(),
      get_mandatory_words()
    ]).then(function([
      on_and,
      on_images,
      on_gifs,
      on_quotes,
      on_extra_page_quotes,
      on_min_message_length,
      min_message_length,
      on_internal_links,
      on_external_links,
      on_min_quoted_number,
      min_quoted_number,
      on_videos,
      on_spoilers,
      on_tags,
      on_recent_messages,
      on_recent_messages_with_edit,
      recent_messages_seconds,
      on_forbidden_words,
      on_mandatory_words,
      forbidden_words,
      mandatory_words
    ]) {
      let now = new Date().getTime();
      let cpt = 0;
      for(let message of messages) {
        let is_ok = false;
        if(on_and) {
          is_ok = (!on_images || (on_images && !on_gifs && message_has_images(message)) ||
              (on_images && on_gifs && message_has_gifs(message))) &&
            (!on_quotes || (on_quotes && message_has_quotes(message))) &&
            (!on_extra_page_quotes || (on_extra_page_quotes && message_has_extra_page_quotes(message))) &&
            (!on_min_message_length ||
              (on_min_message_length && get_message_text(message).length >= min_message_length)) &&
            (!on_internal_links || (on_internal_links && message_has_internal_links(message))) &&
            (!on_external_links || (on_external_links && message_has_external_links(message))) &&
            (!on_min_quoted_number ||
              (on_min_quoted_number && get_message_quoted_number(message) >= min_quoted_number)) &&
            (!on_videos || (on_videos && message_has_videos(message))) &&
            (!on_spoilers || (on_spoilers && message_has_spoilers(message))) &&
            (!on_tags || (on_tags && message_has_tags(message))) &&
            (!on_recent_messages ||
              (on_recent_messages && !on_recent_messages_with_edit &&
                get_message_timestamp(message) < (now - (recent_messages_seconds * 1000))) ||
              (on_recent_messages && on_recent_messages_with_edit &&
                get_message_timestamp(message) < (now - (recent_messages_seconds * 1000)) &&
                get_message_edit_timestamp(message) < (now - (recent_messages_seconds * 1000)))) &&
            (!on_forbidden_words || (on_forbidden_words && !message_has_words(message, forbidden_words))) &&
            (!on_mandatory_words || (on_mandatory_words && message_has_words(message, mandatory_words)));
        } else {
          is_ok = (on_images && !on_gifs && message_has_images(message)) ||
            (on_images && on_gifs && message_has_gifs(message)) ||
            (on_quotes && message_has_quotes(message)) ||
            (on_extra_page_quotes && message_has_extra_page_quotes(message)) ||
            (on_min_message_length && get_message_text(message).length >= min_message_length) ||
            (on_internal_links && message_has_internal_links(message)) ||
            (on_external_links && message_has_external_links(message)) ||
            (on_min_quoted_number && get_message_quoted_number(message) >= min_quoted_number) ||
            (on_videos && message_has_videos(message)) ||
            (on_spoilers && message_has_spoilers(message)) ||
            (on_tags && message_has_tags(message)) ||
            (on_recent_messages && !on_recent_messages_with_edit &&
              get_message_timestamp(message) < (now - (recent_messages_seconds * 1000))) ||
            (on_recent_messages && on_recent_messages_with_edit &&
              get_message_timestamp(message) < (now - (recent_messages_seconds * 1000)) &&
              get_message_edit_timestamp(message) < (now - (recent_messages_seconds * 1000))) ||
            (on_forbidden_words && !message_has_words(message, forbidden_words)) ||
            (on_mandatory_words && message_has_words(message, mandatory_words));
        }
        if(is_ok) {
          message.classList.remove("gmhfrr21_ah_hide");
        } else {
          ++cpt;
          message.classList.add("gmhfrr21_ah_hide");
        }
      }
      display_count(cpt);
    });
  }

  /* --------------------------------------- */
  /* création de la fenêtre de configuration */
  /* --------------------------------------- */

  // styles css pour la fenêtre de configuration
  style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent =
    "#ah_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:1003;" +
    "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
    "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;" +
    "text-align:justify;}" +
    "#ah_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
    "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
    "#ah_config_window{position:fixed;width:420px;height:auto;background:#ffffff;z-index:1002;" +
    "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;border:1px solid #000000;padding:16px;" +
    "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;}" +
    "#ah_config_window div.ah_main_title{font-size:16px;text-align:center;font-weight:bold;}" +
    "#ah_config_window .ah_title{margin:10px 0 8px;font-size:14px;}" +
    "#ah_config_window p.ah_input{margin:0 0 4px 2px;}" +
    "#ah_config_window input[type=\"radio\"]{margin:0 0 2px;vertical-align:text-bottom;}" +
    "#ah_config_window input[type=\"checkbox\"]{margin:0 0 1px;vertical-align:text-bottom;}" +
    "#ah_config_window input[type=text]{padding:0 1px;border:1px solid #c0c0c0;height:12px;" +
    "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;text-align:right;}" +
    "#ah_config_window label.ah_words_title{margin:4px 0;display:block;float:left;width:50%;font-size:14px;}" +
    "#ah_config_window div.ah_clear{clear:both;}" +
    "#ah_config_window div.ah_clear textarea{padding:1px;border:1px solid #c0c0c0;width:206px;height:80px;" +
    "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;margin:0 0 12px;float:left;resize:none;}" +
    "#ah_config_window div.ah_save_close_div{text-align:right;}" +
    "#ah_config_window div.ah_save_close_div div.ah_info_reload_div{float:left;}" +
    "#ah_config_window div.ah_save_close_div div.ah_info_reload_div img{vertical-align:text-bottom;}" +
    "#ah_config_window div.ah_save_close_div > img{margin-left:8px;cursor:pointer;}" +
    "#ah_config_window .ah_help{text-decoration:underline dotted;cursor:help;}" +
    "#ah_config_window img.ah_help_button{margin-right:1px;cursor:help;}";
  document.getElementsByTagName("head")[0].appendChild(style);

  // images des boutons de validation et de fermeture
  var save_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
  var close_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
  var img_info = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";
  var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";

  // création de la fenêtre d'aide
  var help_window = document.createElement("div");
  help_window.setAttribute("id", "ah_help_window");
  document.body.appendChild(help_window);

  // fonction de création du bouton d'aide
  function create_help_button(width, text) {
    let help_button = document.createElement("img");
    help_button.setAttribute("src", img_help);
    help_button.setAttribute("class", "ah_help_button");
    help_button.addEventListener("mouseover", function(e) {
      help_window.style.width = width + "px";
      help_window.textContent = text;
      help_window.style.left = (e.clientX + 32) + "px";
      help_window.style.top = (e.clientY - 16) + "px";
      help_window.style.visibility = "visible";
    }, false);
    help_button.addEventListener("mouseout", function(e) {
      help_window.style.visibility = "hidden";
    }, false);
    return help_button;
  }

  // création du voile de fond pour la fenêtre de configuration
  var config_background = document.createElement("div");
  config_background.id = "ah_config_background";
  config_background.addEventListener("click", hide_config_window, false);
  config_background.addEventListener("transitionend", background_transitionend, false);
  config_background.addEventListener("contextmenu", prevent_default, false);
  document.body.appendChild(config_background);

  // création de la fenêtre de configuration
  var config_window = document.createElement("div");
  config_window.id = "ah_config_window";
  config_window.addEventListener("contextmenu", prevent_default, false);
  document.body.appendChild(config_window);

  // titre de la fenêtre de configuration
  var main_title = document.createElement("div");
  main_title.className = "ah_main_title";
  main_title.textContent = "Configuration du script [HFR] Anti HS";
  config_window.appendChild(main_title);

  // titre du mode de combinaison des règles (ET ou OU)
  var criteria_title = document.createElement("div");
  criteria_title.className = "ah_title";
  criteria_title.appendChild(document.createTextNode("Mode de combinaison des règles : "));
  // ET
  var and_label = document.createElement("label");
  and_label.htmlFor = "ah_and_radio";
  and_label.className = "ah_help";
  and_label.textContent = "ET";
  and_label.setAttribute("title", "Le message doit respecter toutes les règles cochées");
  criteria_title.appendChild(and_label);
  criteria_title.appendChild(document.createTextNode(" "));
  var and_radio = document.createElement("input");
  and_radio.type = "radio";
  and_radio.id = "ah_and_radio";
  and_radio.name = "ah_and_or_radio";
  criteria_title.appendChild(and_radio);
  criteria_title.appendChild(document.createTextNode(" "));
  // OU
  var or_radio = document.createElement("input");
  or_radio.type = "radio";
  or_radio.id = "ah_or_radio";
  or_radio.name = "ah_and_or_radio";
  criteria_title.appendChild(or_radio);
  criteria_title.appendChild(document.createTextNode(" "));
  var or_label = document.createElement("label");
  or_label.htmlFor = "ah_or_radio";
  or_label.className = "ah_help";
  or_label.textContent = "OU";
  or_label.setAttribute("title", "Le message doit respecter au moins une règle cochée");
  criteria_title.appendChild(or_label);
  config_window.appendChild(criteria_title);

  // images
  var images_p = document.createElement("p");
  images_p.className = "ah_input";
  var images_checkbox = document.createElement("input");
  images_checkbox.type = "checkbox";
  images_checkbox.id = "ah_images_checkbox";
  images_p.appendChild(images_checkbox);
  var images_label = document.createElement("label");
  images_label.htmlFor = "ah_images_checkbox";
  images_label.textContent = " Le message doit contenir au moins une image ";
  images_p.appendChild(images_label);
  var gifs_checkbox = document.createElement("input");
  gifs_checkbox.type = "checkbox";
  gifs_checkbox.id = "ah_gifs_checkbox";
  images_p.appendChild(gifs_checkbox);
  var gifs_label = document.createElement("label");
  gifs_label.htmlFor = "ah_gifs_checkbox";
  gifs_label.textContent = " dont un gif";
  images_p.appendChild(gifs_label);
  config_window.appendChild(images_p);

  // citations
  var quotes_p = document.createElement("p");
  quotes_p.className = "ah_input";
  var quotes_checkbox = document.createElement("input");
  quotes_checkbox.type = "checkbox";
  quotes_checkbox.id = "ah_quotes_checkbox";
  quotes_p.appendChild(quotes_checkbox);
  var quotes_label = document.createElement("label");
  quotes_label.htmlFor = "ah_quotes_checkbox";
  quotes_label.textContent = " Le message doit contenir au moins une citation";
  quotes_p.appendChild(quotes_label);
  config_window.appendChild(quotes_p);

  // citations extra page
  var extra_page_quotes_p = document.createElement("p");
  extra_page_quotes_p.className = "ah_input";
  var extra_page_quotes_checkbox = document.createElement("input");
  extra_page_quotes_checkbox.type = "checkbox";
  extra_page_quotes_checkbox.id = "ah_extra_page_quotes_checkbox";
  extra_page_quotes_p.appendChild(extra_page_quotes_checkbox);
  var extra_page_quotes_label = document.createElement("label");
  extra_page_quotes_label.htmlFor = "ah_extra_page_quotes_checkbox";
  extra_page_quotes_label.textContent = " Le message doit contenir au moins une citation extra-page";
  extra_page_quotes_p.appendChild(extra_page_quotes_label);
  config_window.appendChild(extra_page_quotes_p);

  // longueur du message
  var min_message_length_p = document.createElement("p");
  min_message_length_p.className = "ah_input";
  var min_message_length_checkbox = document.createElement("input");
  min_message_length_checkbox.type = "checkbox";
  min_message_length_checkbox.id = "ah_min_message_length_checkbox";
  min_message_length_p.appendChild(min_message_length_checkbox);
  var min_message_length_label_1 = document.createElement("label");
  min_message_length_label_1.htmlFor = "ah_min_message_length_checkbox";
  min_message_length_label_1.textContent = " Le message doit faire au moins ";
  min_message_length_p.appendChild(min_message_length_label_1);
  var min_message_length_input = document.createElement("input");
  min_message_length_input.type = "text";
  min_message_length_input.id = "ah_min_message_length_input";
  min_message_length_input.size = 3;
  min_message_length_input.maxLength = 5;
  min_message_length_input.pattern = "[0-9]+";
  min_message_length_p.appendChild(min_message_length_input);
  var min_message_length_label_2 = document.createElement("label");
  min_message_length_label_2.htmlFor = "ah_min_message_length_input";
  min_message_length_label_2.textContent = " caractères";
  min_message_length_p.appendChild(min_message_length_label_2);
  config_window.appendChild(min_message_length_p);

  // liens internes
  var internal_links_p = document.createElement("p");
  internal_links_p.className = "ah_input";
  var internal_links_checkbox = document.createElement("input");
  internal_links_checkbox.type = "checkbox";
  internal_links_checkbox.id = "ah_internal_links_checkbox";
  internal_links_p.appendChild(internal_links_checkbox);
  var internal_links_label = document.createElement("label");
  internal_links_label.htmlFor = "ah_internal_links_checkbox";
  internal_links_label.textContent = " Le message doit contenir au moins un lien interne";
  internal_links_p.appendChild(internal_links_label);
  config_window.appendChild(internal_links_p);

  // liens externes
  var external_links_p = document.createElement("p");
  external_links_p.className = "ah_input";
  var external_links_checkbox = document.createElement("input");
  external_links_checkbox.type = "checkbox";
  external_links_checkbox.id = "ah_external_links_checkbox";
  external_links_p.appendChild(external_links_checkbox);
  var external_links_label = document.createElement("label");
  external_links_label.htmlFor = "ah_external_links_checkbox";
  external_links_label.textContent = " Le message doit contenir au moins un lien externe";
  external_links_p.appendChild(external_links_label);
  config_window.appendChild(external_links_p);

  // nombre de fois cité
  var min_quoted_number_p = document.createElement("p");
  min_quoted_number_p.className = "ah_input";
  var min_quoted_number_checkbox = document.createElement("input");
  min_quoted_number_checkbox.type = "checkbox";
  min_quoted_number_checkbox.id = "ah_min_quoted_number_checkbox";
  min_quoted_number_p.appendChild(min_quoted_number_checkbox);
  var min_quoted_number_label_1 = document.createElement("label");
  min_quoted_number_label_1.htmlFor = "ah_min_quoted_number_checkbox";
  min_quoted_number_label_1.textContent = " Le message doit être cité au moins ";
  min_quoted_number_p.appendChild(min_quoted_number_label_1);
  var min_quoted_number_input = document.createElement("input");
  min_quoted_number_input.type = "text";
  min_quoted_number_input.id = "ah_min_quoted_number_input";
  min_quoted_number_input.size = 1;
  min_quoted_number_input.maxLength = 2;
  min_quoted_number_input.pattern = "[0-9]+";
  min_quoted_number_p.appendChild(min_quoted_number_input);
  var min_quoted_number_label_2 = document.createElement("label");
  min_quoted_number_label_2.htmlFor = "ah_min_quoted_number_input";
  min_quoted_number_label_2.textContent = " fois";
  min_quoted_number_p.appendChild(min_quoted_number_label_2);
  config_window.appendChild(min_quoted_number_p);

  // vidéos
  var videos_p = document.createElement("p");
  videos_p.className = "ah_input";
  var videos_checkbox = document.createElement("input");
  videos_checkbox.type = "checkbox";
  videos_checkbox.id = "ah_videos_checkbox";
  videos_p.appendChild(videos_checkbox);
  var videos_label = document.createElement("label");
  videos_label.htmlFor = "ah_videos_checkbox";
  videos_label.textContent = " Le message doit contenir au moins une vidéo";
  videos_p.appendChild(videos_label);
  config_window.appendChild(videos_p);

  // spoilers
  var spoilers_p = document.createElement("p");
  spoilers_p.className = "ah_input";
  var spoilers_checkbox = document.createElement("input");
  spoilers_checkbox.type = "checkbox";
  spoilers_checkbox.id = "ah_spoilers_checkbox";
  spoilers_p.appendChild(spoilers_checkbox);
  var spoilers_label = document.createElement("label");
  spoilers_label.htmlFor = "ah_spoilers_checkbox";
  spoilers_label.textContent = " Le message doit contenir au moins un spoiler";
  spoilers_p.appendChild(spoilers_label);
  config_window.appendChild(spoilers_p);

  // tags et #HashTags
  var tags_p = document.createElement("p");
  tags_p.className = "ah_input";
  var tags_checkbox = document.createElement("input");
  tags_checkbox.type = "checkbox";
  tags_checkbox.id = "ah_tags_checkbox";
  tags_p.appendChild(tags_checkbox);
  var tags_label = document.createElement("label");
  tags_label.htmlFor = "ah_tags_checkbox";
  tags_label.textContent = " Le message doit contenir au moins un tag ou un #HashTag";
  tags_p.appendChild(tags_label);
  config_window.appendChild(tags_p);

  // messages récents
  var recent_messages_p = document.createElement("p");
  recent_messages_p.className = "ah_input";
  var recent_messages_checkbox = document.createElement("input");
  recent_messages_checkbox.type = "checkbox";
  recent_messages_checkbox.id = "ah_recent_messages_checkbox";
  recent_messages_p.appendChild(recent_messages_checkbox);
  var recent_messages_label = document.createElement("label");
  recent_messages_label.htmlFor = "ah_recent_messages_checkbox";
  recent_messages_label.textContent = " Le message ";
  recent_messages_p.appendChild(recent_messages_label);
  var recent_messages_with_edit_checkbox = document.createElement("input");
  recent_messages_with_edit_checkbox.type = "checkbox";
  recent_messages_with_edit_checkbox.id = "ah_recent_messages_with_edit_checkbox";
  recent_messages_p.appendChild(recent_messages_with_edit_checkbox);
  var recent_messages_with_edit_label = document.createElement("label");
  recent_messages_with_edit_label.htmlFor = "ah_recent_messages_with_edit_checkbox";
  recent_messages_with_edit_label.textContent = " ou son edit doit avoir plus de ";
  recent_messages_p.appendChild(recent_messages_with_edit_label);
  var recent_messages_input = document.createElement("input");
  recent_messages_input.type = "text";
  recent_messages_input.id = "ah_recent_messages_input";
  recent_messages_input.size = 4;
  recent_messages_input.maxLength = 5;
  recent_messages_input.pattern = "[0-9]+";
  recent_messages_p.appendChild(recent_messages_input);
  var recent_messages_input_label = document.createElement("label");
  recent_messages_input_label.htmlFor = "ah_recent_messages_input";
  recent_messages_input_label.textContent = " secondes";
  recent_messages_p.appendChild(recent_messages_input_label);
  config_window.appendChild(recent_messages_p);

  // mots interdits
  var forbidden_words_p = document.createElement("p");
  forbidden_words_p.className = "ah_input";
  var forbidden_words_checkbox = document.createElement("input");
  forbidden_words_checkbox.type = "checkbox";
  forbidden_words_checkbox.id = "ah_forbidden_words_checkbox";
  forbidden_words_p.appendChild(forbidden_words_checkbox);
  var forbidden_words_label = document.createElement("label");
  forbidden_words_label.htmlFor = "ah_forbidden_words_checkbox";
  forbidden_words_label.textContent = " Le message ne doit contenir aucun mot interdit";
  forbidden_words_p.appendChild(forbidden_words_label);
  config_window.appendChild(forbidden_words_p);

  // mots obligatoires
  var mandatory_words_p = document.createElement("p");
  mandatory_words_p.className = "ah_input";
  var mandatory_words_checkbox = document.createElement("input");
  mandatory_words_checkbox.type = "checkbox";
  mandatory_words_checkbox.id = "ah_mandatory_words_checkbox";
  mandatory_words_p.appendChild(mandatory_words_checkbox);
  var mandatory_words_label = document.createElement("label");
  mandatory_words_label.htmlFor = "ah_mandatory_words_checkbox";
  mandatory_words_label.textContent = " Le message doit contenir au moins un mot obligatoire";
  mandatory_words_p.appendChild(mandatory_words_label);
  config_window.appendChild(mandatory_words_p);

  // titres des mots interdits et obligatoires
  var words_title_div = document.createElement("div");
  words_title_div.setAttribute("title", "Un mot ou phrase par ligne");
  var forbidden_words_title = document.createElement("label");
  forbidden_words_title.htmlFor = "ah_forbidden_words_textarea";
  forbidden_words_title.className = "ah_words_title";
  forbidden_words_title.textContent = "Mots interdits :";
  words_title_div.appendChild(forbidden_words_title);
  var mandatory_words_title = document.createElement("label");
  mandatory_words_title.htmlFor = "ah_mandatory_words_textarea";
  mandatory_words_title.className = "ah_words_title";
  mandatory_words_title.textContent = "Mots obligatoires :";
  words_title_div.appendChild(mandatory_words_title);
  config_window.appendChild(words_title_div);

  // mots interdits et obligatoires
  var words_textarea_div = document.createElement("div");
  words_textarea_div.setAttribute("title", "Un mot ou phrase par ligne");
  words_textarea_div.className = "ah_clear";
  var forbidden_words_textarea = document.createElement("textarea");
  forbidden_words_textarea.id = "ah_forbidden_words_textarea";
  forbidden_words_textarea.setAttribute("spellcheck", "false");
  words_textarea_div.appendChild(forbidden_words_textarea);
  var mandatory_words_textarea = document.createElement("textarea");
  mandatory_words_textarea.id = "ah_mandatory_words_textarea";
  mandatory_words_textarea.setAttribute("spellcheck", "false");
  words_textarea_div.appendChild(mandatory_words_textarea);
  config_window.appendChild(words_textarea_div);

  // info "sans rechargement" et boutons de validation et de fermeture
  var save_close_div = document.createElement("div");
  save_close_div.className = "ah_save_close_div ah_clear";
  var info_reload_div = document.createElement("div");
  info_reload_div.className = "ah_info_reload_div";
  var info_reload_img = document.createElement("img");
  info_reload_img.setAttribute("src", img_info);
  info_reload_div.appendChild(info_reload_img);
  info_reload_div.appendChild(document.createTextNode(" sans rechargement "));
  info_reload_div.appendChild(create_help_button(255,
    "Les paramètres de cette fenêtre de configuration sont appliqués immédiatement à la validation, " +
    "il n'est pas nécessaire de recharger la page."));
  save_close_div.appendChild(info_reload_div);
  var save_button = document.createElement("img");
  save_button.src = save_img;
  save_button.setAttribute("title", "Valider");
  save_button.addEventListener("click", save_config_window, false);
  save_close_div.appendChild(save_button);
  var close_button = document.createElement("img");
  close_button.src = close_img;
  close_button.setAttribute("title", "Annuler");
  close_button.addEventListener("click", hide_config_window, false);
  save_close_div.appendChild(close_button);
  config_window.appendChild(save_close_div);

  // fonction de validation de la fenêtre de configuration
  function save_config_window() {
    // sauvegarde des paramètres de la fenêtre de configuration
    let length = parseInt(min_message_length_input.value.trim(), 10);
    if(isNaN(length) || length < 1) {
      length = default_min_message_length;
    }
    let number = parseInt(min_quoted_number_input.value.trim(), 10);
    if(isNaN(number) || number < 1) {
      number = default_min_quoted_number;
    }
    let seconds = parseInt(recent_messages_input.value.trim(), 10);
    if(isNaN(seconds) || seconds < 1) {
      seconds = default_recent_messages_seconds;
    }
    Promise.all([
      GM.setValue("ah_filter_on_and." + topic, and_radio.checked),
      GM.setValue("ah_filter_on_images." + topic, images_checkbox.checked),
      GM.setValue("ah_filter_on_gifs." + topic, gifs_checkbox.checked),
      GM.setValue("ah_filter_on_quotes." + topic, quotes_checkbox.checked),
      GM.setValue("ah_filter_on_extra_page_quotes." + topic, extra_page_quotes_checkbox.checked),
      GM.setValue("ah_filter_on_min_message_length." + topic, min_message_length_checkbox.checked),
      GM.setValue("ah_topic_min_message_length." + topic, length),
      GM.setValue("ah_filter_on_internal_links." + topic, internal_links_checkbox.checked),
      GM.setValue("ah_filter_on_external_links." + topic, external_links_checkbox.checked),
      GM.setValue("ah_filter_on_min_quoted_number." + topic, min_quoted_number_checkbox.checked),
      GM.setValue("ah_topic_min_quoted_number." + topic, number),
      GM.setValue("ah_filter_on_videos." + topic, videos_checkbox.checked),
      GM.setValue("ah_filter_on_spoilers." + topic, spoilers_checkbox.checked),
      GM.setValue("ah_filter_on_tags." + topic, tags_checkbox.checked),
      GM.setValue("ah_filter_on_recent_messages." + topic, recent_messages_checkbox.checked),
      GM.setValue("ah_filter_on_recent_messages_with_edit." + topic, recent_messages_with_edit_checkbox.checked),
      GM.setValue("ah_topic_recent_messages_seconds." + topic, seconds),
      GM.setValue("ah_filter_on_forbidden_words." + topic, forbidden_words_checkbox.checked),
      GM.setValue("ah_filter_on_mandatory_words." + topic, mandatory_words_checkbox.checked),
      GM.setValue("ah_forbidden_words", forbidden_words_textarea.value.trim()),
      GM.setValue("ah_mandatory_words", mandatory_words_textarea.value.trim())
    ]).then(function() {
      topic_has_filters(function(has_filters) {
        set_topic_filtered_status(has_filters).then(function() {
          // traitement de la page et filtrage des messages
          process_page();
          // fermeture de la fenêtre de configuration
          hide_config_window();
        });
      });
    });
  }

  // fonction de fermeture de la fenêtre de configuration
  function hide_config_window() {
    config_window.style.opacity = "0";
    config_background.style.opacity = "0";
  }

  // fonction de fermeture de la fenêtre de configuration par la touche echap
  function esc_config_window(e) {
    if(e.key === "Escape") {
      hide_config_window();
    }
  }

  // fonction de gestion de la fin de la transition d'affichage / disparition de la fenêtre de configuration
  function background_transitionend() {
    if(config_background.style.opacity === "0") {
      config_window.style.visibility = "hidden";
      config_background.style.visibility = "hidden";
      document.removeEventListener("keydown", esc_config_window, false);
    }
    if(config_background.style.opacity === "0.8") {
      document.addEventListener("keydown", esc_config_window, false);
    }
  }

  // fonction d'affichage de la fenêtre de configuration
  function show_config_window() {
    // affichage de la fenêtre de configuration
    config_window.style.visibility = "visible";
    config_background.style.visibility = "visible";
    config_window.style.left =
      parseInt((document.documentElement.clientWidth - config_window.offsetWidth) / 2, 10) + "px";
    config_window.style.top =
      parseInt((document.documentElement.clientHeight - config_window.offsetHeight) / 2, 10) + "px";
    config_background.style.width = document.documentElement.scrollWidth + "px";
    config_background.style.height = document.documentElement.scrollHeight + "px";
    config_window.style.opacity = "1";
    config_background.style.opacity = "0.8";
    // initialisation des paramètres de la fenêtre de configuration
    Promise.all([
      filter_on_and(),
      filter_on_images(),
      filter_on_gifs(),
      filter_on_quotes(),
      filter_on_extra_page_quotes(),
      filter_on_min_message_length(),
      get_topic_min_message_length(),
      filter_on_internal_links(),
      filter_on_external_links(),
      filter_on_min_quoted_number(),
      get_topic_min_quoted_number(),
      filter_on_videos(),
      filter_on_spoilers(),
      filter_on_tags(),
      filter_on_recent_messages(),
      filter_on_recent_messages_with_edit(),
      get_topic_recent_messages_seconds(),
      filter_on_forbidden_words(),
      filter_on_mandatory_words(),
      get_forbidden_words(),
      get_mandatory_words()
    ]).then(function([
      on_and,
      on_images,
      on_gifs,
      on_quotes,
      on_extra_page_quotes,
      on_min_message_length,
      min_message_length,
      on_internal_links,
      on_external_links,
      on_min_quoted_number,
      min_quoted_number,
      on_videos,
      on_spoilers,
      on_tags,
      on_recent_messages,
      on_recent_messages_with_edit,
      recent_messages_seconds,
      on_forbidden_words,
      on_mandatory_words,
      forbidden_words,
      mandatory_words
    ]) {
      and_radio.checked = on_and;
      or_radio.checked = !on_and;
      images_checkbox.checked = on_images;
      gifs_checkbox.checked = on_gifs;
      quotes_checkbox.checked = on_quotes;
      extra_page_quotes_checkbox.checked = on_extra_page_quotes;
      min_message_length_checkbox.checked = on_min_message_length;
      min_message_length_input.value = min_message_length;
      internal_links_checkbox.checked = on_internal_links;
      external_links_checkbox.checked = on_external_links;
      min_quoted_number_checkbox.checked = on_min_quoted_number;
      min_quoted_number_input.value = min_quoted_number;
      videos_checkbox.checked = on_videos;
      spoilers_checkbox.checked = on_spoilers;
      tags_checkbox.checked = on_tags;
      recent_messages_checkbox.checked = on_recent_messages;
      recent_messages_with_edit_checkbox.checked = on_recent_messages_with_edit;
      recent_messages_input.value = recent_messages_seconds;
      forbidden_words_checkbox.checked = on_forbidden_words;
      mandatory_words_checkbox.checked = on_mandatory_words;
      forbidden_words_textarea.value = forbidden_words.join("\n");
      mandatory_words_textarea.value = mandatory_words.join("\n");
    });
  }

  // ajout d'une entrée de configuration dans le menu de l'extension
  gmMenu("[HFR] Anti HS -> Configuration", show_config_window);

  // traitement de la page et filtrage des messages
  process_page();

})();
