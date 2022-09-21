// ==UserScript==
// @name          [HFR] Infos rapides mod_r21
// @version       4.1.4
// @namespace     roger21.free.fr
// @description   Rajoute une popup d'informations sur le profil au passage de la souris sur le pseudal.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @author        roger21
// @authororig    toyonos
// @modifications Basé sur la version 3 (ou c) - Ajout du statut (membre, modal, etc.), suppression de l'info de region (désactivée sur le forum), meilleur calcul de l'age, ajout de l'avatar sur les pseudo des citations (et ceux de [HFR] Postal Recall) et ajout de la gestion de l'affichage et de l'édition des mots-clés des smileys persos et de l'insertion des smileys persos dans l'édition rapide ou la réponse rapide.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_infos_rapide_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_infos_rapide_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_infos_rapide_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.openInTab
// @grant         GM_openInTab
// ==/UserScript==

/*

Copyright © 2011-2012, 2014-2022 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 3643 $

// historique :
// 4.1.4 (21/09/2022) :
// - ajout d'un message spécifique en cas de sanction (pour l'édition des mots-clés)
// 4.1.3 (12/02/2022) :
// - meilleur gestion du support pour [HFR] Chat
// 4.1.2 (12/02/2022) :
// - ajout du support pour [HFR] Chat
// 4.1.1 (21/09/2020) :
// - ajout des avatars dans la popup des pseudos quand les avatars sont désactivés (pour cosmoschtroumpf)
// 4.1.0 (21/06/2020) :
// - correction de verrouillé (signalé par garath_)
// 4.0.9 (21/06/2020) :
// - gestion des smileys verrouillés (affichage explicite)
// - passage de l'option en dur "add_final_space" à true par défaut
// 4.0.8 (23/05/2020) :
// - supression de la transparence sur la zone d'édition des mots-clés
// - et petite amélioration du padding de la zonne d'édition
// 4.0.7 (14/05/2020) :
// - correction du z-index de la popup d'info
// 4.0.6 (14/05/2020) :
// - homogénéisation du code
// - homogénéisation de la popup avec les popups des autres scripts
// 4.0.5 (28/04/2020) :
// - correction de la correction précédente pour exclure le profil Modération
// 4.0.4 (25/04/2020) :
// - correction de la requête de récupération du profil (mauvaise gestion des pseudos compliqués)
// - amélioration de la récupération de la page du profil (pour gérer les pseudos mal tronqués par le forum)
// - exclusion du profil "Publicité" (en mode déconnecté)
// 4.0.3 (04/03/2020) :
// - ajout de prevent default pour éviter l'aparition de l'universal scroll sur l'ouverture du wiki et du profil
// 4.0.2 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 4.0.1 (30/01/2020) :
// - ajout du lien vers la page du smiley sur le wiki sur le code du smiley dans la popup d'édition
// - prise en compte du bouton du clic pour l'ouverture du profil (gauche -> premier plan, milieu -> arrière plan)
// 4.0.0 (28/01/2020) :
// - affichage des mots-clés sur les smileys persos comme [HFR] Edition du wiki partout mod_r21 3.0.0+
// - ajout de l'édition des mots-clés (comme [HFR] Edition du wiki partout mod_r21 3.0.0+)
// - ouverture de la page du profil aussi avec un clic-milieu
// - activation par défaut de l'espace autour des smileys à l'insertion (voir les options en dur pour ->
// désactiver)
// 3.6.4 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - retour des requêtes fetch en mode "same-origin" au lieu de "cors"
// 3.6.3 (23/09/2019) :
// - amélioration de la gestion de la tempo sur la récupération des tags des smileys
// 3.6.2 (23/09/2019) :
// - passage des requêtes fetch en mode "cors" pour éviter un plantage sous ch+vm en mode "same-origin"
// 3.6.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 3.6.0 (20/12/2018) :
// - ajout d'une gestion pour faire disparaitre la popup aussi sur le mouseout du pseudal
// 3.5.2 (23/10/2018) :
// - ajout d'un mode "comme avant" en passant la variable comme_avant à true
// 3.5.1 (23/10/2018) :
// - disparition de la popup quand on clic n'importe où en dehors
// 3.5.0 (13/10/2018) :
// - nouveau nom : [HFR] infos rapides mod_r21 -> [HFR] Infos rapides mod_r21
// - ajout de l'avis de licence AGPL v3+ *si toyonos est d'accord*
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (toyonos)
// - réécriture des metadata @description, @modifications et @modtype
// - ajout de la gestion de l'affichage des mots-clés et de l'insertion des smileys perso ->
// sur une proposition de minipouss
// - changement du delai avant l'affichage de 666ms à 450ms
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
// - nouveau nom : [HFR] Informations rapides sur le profil mod_r21 ->
// [HFR] informations rapides sur le profil mod_r21
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

/* -------------- */
/* options en dur */
/* -------------- */

// mode "comme avant" (la popup disparait immédiatement lorsque la souris quitte le pseudal),
// ne permet pas d'accéder aux smileys, passer à true pour activer
const comme_avant = false;

// le caractère autour du smiley quand on l'ajoute (une espace par exemple)
const char_around_smiley_at_insert = " ";

// affichage des mots-clés dans le title/tooltip des smileys (true) ou dans un tooltip/popup en html (false)
const in_title = false;

// activer les box-shadow (true) ou pas (false)
const box_shadow = true;

// ajouter une espace finale dans la popup d'édition (true) ou pas (false)
const add_final_space = true;

/* ------------------------------- */
/* gestion de la compatibilité gm4 */
/* ------------------------------- */

if(typeof GM === "undefined") {
  this.GM = {};
}
if(typeof GM_openInTab !== "undefined" && typeof GM.openInTab === "undefined") {
  GM.openInTab = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_openInTab.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}

/* ---------- */
/* les images */
/* ---------- */

var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var img_throbber = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACGFjVEwAAAAYAAAAANndHFMAAAAaZmNUTAAAAAAAAAAQAAAAEAAAAAAAAAAAAB8D6AEAHV58pwAAAWlJREFUeNpjYMABREVFeYBgJQiD2AykAmZm5hYg9R%2BEoWz8QENDw1JRUXGPkpLSHCsrK16gpqlIBkz9%2F%2F8%2F1%2BbNmxu3bNkye9u2bXoomoGSjCDNQPwfhFVVVdO5uLgkgRqXgjBQidS%2BffuCgZpvAw25CcSzMVwAshmkWUFB4Z%2BysnIAujxQsyMQX4Ya0ojNFxxAQzKgmpnQJUGuhBoSeubMGVa4hIeHB7uLi0u5q6tre1RUlCChsAL6nw9oSAkQp69atYqNwc3NbbqTk9M3Z2fn30A8g5ABQOe3gLwBxNeBuJ5yA2BeAOJ2CwsLIZK9AAMgTlZWVmx2drY7KMCIDkQYAGruBeJ3QPwMiD1IjkagplWZmZmvgfh9RkZG7MyZM0WmTJnSCcI9PT0iQKeH4E1IeXl5xiBDoC7hmTZtWgVQ82MQnjx5ciXQ2biTMjYA1JQ9derUeyAMYpOcG3t7ezmBmltBGMTGpQ4AtqrwBlDMdgwAAAAaZmNUTAAAAAEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8Sqm5QAAAXpmZEFUAAAAAnjaY2DAAURFRXmEhYWXgTCIzUAq4OXlbeLi4voPwkB2I0ENRkZGFrq6ujv19PRmWVlZAfXwToIZwMPDM%2Fn%2F%2F%2F9cmzdvbtyyZcvsbdu26WEYANKsra39T0dH57%2B%2Bvn4qUKMkUOMSEAZKS%2B3evTsYqPk20JCbQDwbwwCQzSDNQPwTaJg%2FujxQsyMQX4YagukleXl5DqDGNENDQ7%2F6%2BnomdHmgFxihhoSeOXOGFS7h4eHBHhAQUBoYGNiSn58vQCisgP7nAxpSAsTpq1atYmMICgqa4u%2Fv%2F9HPz%2B8b0KCphAwAOr8F5A0gvg7E9ZQbAPMCELfa2NgIkuwFGABxKioqooHYDRRgRAciDJSXl3cD8SsgflRWVuZOcjQCNS4H4udAza9KS0uj161bJ7x48eI2EF64cKEw0OkheBNSVVWVEcgQoBe6srKyeJYsWVIG1HwfhEFsoLPxJ2V0ANSUAdR8C4RBbJJzIzBQOYEam0AYxMalDgDCHPiOgVAEawAAABpmY1RMAAAAAwAAABAAAAAQAAAAAAAAAAAAHwPoAQEcvHUMAAABbmZkQVQAAAAEeNpjYMABtLS0eGRlZReDMIjNQCqQkJCoFxUV%2FQ%2FCIDZBDTY2NuYWFhbbLC0tp%2Fv5%2BfGKi4tPEBMT%2Bw%2FCQEMm%2FP%2F%2Fn2vz5s2NW7Zsmb1t2zY9DANAms3NzX8B8V9ra%2BtkoCYJoCGLQJiLi0ty9%2B7dwUDNt4GG3ATi2RgGgGwGaQbir0DDfNHlgZodgfgy1JBGDAPk5eU5gBpTgLaDNDOhywO9wAg1JPTMmTOscInc3Fz22NjY4ri4uKb8%2FHwBQmEF9D8f0JASIE5ftWoVGwNQ48SYmJi3QPwJaNBkQgYAnd8C8gYQXwfiesoNQPaCt7e3IMlegAEQp7W1NQqIXUEBRnQgwgBQY0dLS8tzIL7f3NzsRnI0Ag1YAsRPQIY0NTVFAROOMMi%2FILxu3TphoNND8Cak9vZ2Q6ghHfX19TwgfwIV3gFhEHvTpk34kzI6AGpIh4b0dRCb5NwIDFROoI0NIAxi41IHAFxMAhn8b9WWAAAAGmZjVEwAAAAFAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfF2B3YAAAGfZmRBVAAAAAZ42mNgwAG0tLR41NXVF4AwiM1AKlBSUqpVUFD4D8IgNkz8%2F%2F%2F%2FjFg1uLm5mbm4uGwG4qmhoaE8QE19ioqK%2F0FYRUWlF6iEj5mZeTEQH%2BDg4LDBMACk2cnJ6buzs%2FMvoGFJ8vLyEkDNC0AY6AUJFhaWHJADQJiJiekohktANoM0A%2FEnoAE%2B6BawsbGFMjIygg0AumIJhguAzmQHuiAZpLm%2Bvp4Jiy%2BZgIaEAGmQS7jgorm5uexZWVmF2dnZDR0dHfyEAhfodIEdO3aUbNmyJX3VqlVsDECNfZmZma%2BA%2BD3QoAmEDNi8eXMLUPNtIL4OxPWUGwDzAtCABn9%2FfwFCBmzbto0PqBHhBSS%2FsU6bNi1iypQpztgSC0gMqMkRiEPPnDnDimEyUGMbED%2BePHnybaBBLujyUM2XQc4HeqMRmwELp06d%2BgBqSMTu3buFQf4F4XXr1gkDnR4C1XwTiGdjM8AAakhrd3c3N8ifQIV3QBjE3rRpExfIZiB7NtAwPYKZCaghHRrS10FsknMjMIQ5gTY2gDCIjUsdAEaa8bn5NffYAAAAGmZjVEwAAAAHAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARzg1J8AAAGgZmRBVAAAAAh42p2Tv0sCYRjHr8Dk7tLzx1B%2FgJN3XiCEQ1OOBf6qXK1JuJCW8AcRFbYJDm0iBqk4OEjo4eIQNLsFSSSNLUFL0BbX96mjzFMOe%2BHLfXnv%2FX6e53nhZZgpS5Zl3u%2F3V0jkmVmXz%2Bc7EkXxg0TeNBCNRlfD4fB1JBK5UBRlEaGCJEkaibzL5bJjXdlsthun07lmAFA4FAq9Qe%2BxWGzX6%2FUuI1ghBQKBJYT3eZ7XOI7TALnVNG3uD4AqUxigV3SzOV5AEIQtApCoE0MHHo%2FHCsAeqm8Y6N9rniAsyyrw3M9uKpWyZjKZg2w2e1wqlQSzuwLc0e12D1VVTTabzQUml8sVAHiGXtLpdNEM0Ol0zhF%2BhAbQyRcAwf8DRkdIJBIOMwDatyP4O8LIbJZGoxGvVqvBSZdIewitQzv9ft9iINdqtXy9Xn%2BC7gEKjv%2FXw3fUPsY4mwS4hIYEwTfe6%2FXcNC%2Bp1Wq50fq2Hn6AygYAWl%2FRIXl4nubEwSGJfLvd5qgyfBkw2fRtIJDUb3pAfubXiBtmUfGURH7auU%2FutPojzjsHHQAAABpmY1RMAAAACQAAABAAAAAQAAAAAAAAAAAAHwPoAQHxk%2BXDAAABg2ZkQVQAAAAKeNqlU79LAmEYvgINKzQM9bzZuSlQDhwSHBqL2rxrFIVwaYmCS7xTo6FZHdoFHfS4sf6B2xpEbGsIGhraWrqeh65fenJIHzx8D%2B%2F3Ps%2F7Az5BmHPy%2BfxaNpttE%2BTCoieTyZym0%2Bk3gtxXoCjKtqqqPeC6XC6vQ3gJvBOyLDej0WhYFMWbeDx%2BK0mSPGNQKBR6MHnB%2FQoTFcIEKreJXC6XgLgEsROLxRzcd47jLP0xYGWKgWfw3ekCMNinmGAnMx2kUqkVdHBE8Yz751lOJpN7MCiBh76jmqYFDcM4rtfrZ61WK%2BK3K5hHLMs6MU2z2O12g0Kj0Wjquv4IPMHoys9gOBzqEE%2BAEaD93%2BBrhFqtdl6pVDb8DNB%2BGMKfEX7NFkDwENjxWiJjfGOObdsBr9aqbmv3TJx%2Bd8V8mzDXy6ADjJmANg%2F6%2Ff4m5yXIGXPFY%2BZ6zbaFBJpUB4PBKucEfyDIGXO77DDX929AUHQ3PSJf%2BDdiwyFUvCDI5%2BV9ABJsBKxZnW%2FPAAAAGmZjVEwAAAALAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARwFNioAAAGKZmRBVAAAAAx42qWTu0%2FCUBjFW4mi2ODga%2BSdMLk4OcrLjpLgZlwJz8nEMCHx1YXFAprgbuzAAISp%2F4WDIZg4mLiY6OZiYj0nFgYKAeJNfunX755z7qOpIIwZ0Wh0ORaL3RDWwqwjEomchEKhL8J6oiGfz2%2Bn02kNlIvFogTTVTgc%2FiaoL%2F1%2Bv9Pr9d55PB49GAzuWAJoTqVS7%2BAzm80eYuVNGG9JPB7fgDkJs2GiG4YhDgeUwQd4A%2FLwAj6fb9%2Ftdv8wgDux7ECWZTtWP8pkMnuW9L8xx5BAIJDM5XL2QVfTtAVVVTPVarXQ6XScU9zvms1muwZnLpdrUYDxolKpvIDXWq2mTHLDeI%2BHQSRJevh%2FQP8IoKAoysoUR1gXRVEdHKE%2FcHHz7Xb7AOyOukT2OKfregK1wxLbarVKEPTAI4XD8%2ByZcz1qRwXUQZcCfI1Eo9FYxfs5Yc2eae5SawmAYAsChpSazaYD9THqZ8KaPXOXdWon3hQMSYifCOuZ%2F0Z8nSWseEpYj9P9AmHJ8O96azpYAAAAGmZjVEwAAAANAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfHPRFAAAAGYZmRBVAAAAA542pWTv0sCYRzGLeiHp95y5OrooJ56U2uD5ZQ%2FsKlb%2B7G41Z24mCENORW15KZW4OCgIgT%2BAQ5uDWEGQUvg1hQtXc8DKuQp6gsf%2BN73%2BzzPe%2B97nMUyZamqaovH4zeEtWXRFY1GTyORyBdhPdOQTqcVXdcfU6nUZT6ft8GYA98kFovl3G63Q5blO5%2FP96QoyqYpgGbwqWlaHyH7oVDIiZ1vCY7ghPHA6%2FUaHo%2FnlyGmAO6MgD74QMjO%2BDwQCEQQ8MMQvokpIBwOr8GsImjbMIyl8Xkmk1kOBoO7fr%2F%2FMJlMro0GlUpltVwuHwOt3W6Lc9yvJIrilcPhyLpcrnULjOelUukVvIOLWW4Y7wVBMIgkSQ8LB9jt9v8BwyMUi0UdAfMcYQMh16MjDFen01lpNBp7YGvSJbLHWavVSqC2mmLr9XoWgh54pnB8zt5g1qN2UkABdCloNpuJarUq4TlHWLM3MHepNQVAIEPAkGytVhNQn6B%2BI6zZG7xlgdqZNwXDEcQvhPXCfyO%2BjhU7nhHW03R%2FhFP4ipu3x5gAAAAaZmNUTAAAAA8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHFmXuQAAAYZmZEFUAAAAEHjapZOxSwJxFMevIEvjXOzyFvE%2FCJpOT5eG2hoEbyjUSXRyyt0uz1NwKRoa3KrJwUHlwP%2FAwa1BpKAlaGoJWoK4vl84g7yTS%2FrBBx7v977fe%2B%2FdnSAsOaVSKVQoFK4IY2HVk8%2Fnz3K53Bth7CtoNpv7jUbjHrTa7fY2hBfgnaALXVVVMZlM3iQSCSudTisuA0f8YhjGq2maJ5lMZhdPviaVSkWCsKgoyhf4pImXQYti8Fyv148W71Op1DHEHzRhJy4DTdMCMDkFh7Ztr3lMuU4TjFJER5s%2F2W63GxgOh2XLsqrj8TjstytRFCPRaPRSluVaPB7fEiCugSl4HAwGhp8BxLeSJNkkFovd%2Fd9gPgKoYozwHz6RnV8jzM9kMtmAiQYOvJbIHO9Go1EWcdBli%2FZ1jgEeWLh4z5xzx1F1L4MOmLEAo2R7vV6EOyGMmXPEM9a6DFCwhwKa6P1%2BP8SdIH4ijJlzuuyw1ndTEJSdtzNlvPLfiLcTxBPPCeNldd%2BFTAEoC6ckLQAAABpmY1RMAAAAEQAAABAAAAAQAAAAAAAAAAAAHwPoAQHwWCCpAAABqGZkQVQAAAASeNqlkz9IAnEUx%2B9Ou06jAsXFxb%2FgFk0h0pInTo0eteqgaN4Qubh0CtVYgZ4ILWlNDg4q4tgSOLg1SNgQtrUELUHL9X2QBd7JET34cI979%2F2%2B33s%2FjmEWRDqdtudyuQuCcuavAeFhNpt9JSg3FVSr1U3QUFX1tNlsrkBYAm9EPp9XIpHIaiwWU0E3Ho9vGRmQ%2BBnPl3q9vpdMJl3ofEkUi0WXKIop8BmNRj%2FIxMjgjMSVSmVSq9Vi83V03YXBO5nQSXQGkiTxEO%2FDRNQ0jZ2vK4rCkQlIybK8%2FFNotVp8r9fL9Pv9wnA4XDPbldvtdvr9%2FvNgMHjs8XgEBmIFjMGk2%2B2emBkEAoFrn8%2Bneb1eLRQKNf5vMBsBFDCG6QjhcNgBk98RZjEajZZgIoEdoyUiOJ7nE1ar9QC5TVfF8cs0Bnggk%2Fk6iVmW1ZBqFovl1sjgCjySCUZJtNttJ%2B2EmE6nDo7jZBITyO91p4RoA2IyKXc6HTvtBPkTMRgMjvDJOjrfgDtBELZN%2Fw2YZL5vZ0z57P2C%2FegDt2ND9xJB%2BaLvvgDI3vA4tCR%2FkQAAABpmY1RMAAAAEwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdzvNAAAABkWZkQVQAAAAUeNqlk79LAnEYxq8g8U7u5Kw2%2FwO14KCpQaqtA3%2F1Y3YTCmko%2FEHIJbYZDa5hkDo5SKiIW9DsFiSRNDi0BC1BW1zPA%2BagJ4f0hQ%2F33r33PO%2F3fb93gjBjGYYhZbPZImEszLvS6fRJKpV6J4xtBZVKZb1ard6CQrPZlCDMQfhBMplMLhQKyZFIpBQOh%2B%2Bj0ejGlMFIPKjVam%2B4HiaTyVWYXBO0sAJhHCbf4IsmVgYFisEz4p3JPKrqEH7ShDuxGpqDldHKtmmaC5N5PovFYrsgXq%2FXHeMEb9rtdgKcdTodxW5WXq%2FXEwgErsB5MBh0ChAaoA9eW63WpZ0BhGW%2F32%2F6fL4fTdPK%2FzeYtwVd11WYFMct%2FK1er7cEkwOwZTVErEW3272nKMoRYudUFtvPsw3wRJPJPMUul8skMLmzMrgBLzRBK%2FuNRmOZMyHD4dAjiuIxxZIkmbIsP07tEqI1iGmS56fMmSAekG63e8pNsDLED6qqbtr%2BGzBJjE6nz3juvxGnI6L6BWE8671fIqf6HRySx%2B0AAAAaZmNUTAAAABUAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ASBOgAAAWxmZEFUAAAAFnjaY2DAAerr67na29s7QBjEZiAVtLa25ra0tDwGYRCboIZt27bpbdmyZfbmzZsbz5w5wwXUWA3U%2BByE29raqkNDQ3ni4uL6gXhtbGysCYYBQI0gzTeBhtwGGhYCdLYIUHM3CPf09IjExMTEAfEnoOZ3QHotNgMaQZqB%2BDIQO6LLA232BGp8BTIE5BIMA4DOZgVqDAVp%2Fv%2F%2FPyO6PEgMZAjQBfGrVq1ig0uAOEBN6UBcAnQ6H6Gw0tLSEjI3N%2B%2B0sLCo9PDwYGcAaqwH4usg5wO90ULIAKDGWUAD%2FgHxT1tb21mUG0CqF6KiogQtLS0RXiA2EIGASVJSMlBCQiITyOYgORqBGoNERUX%2FgzCQPZ9gQlq3bp0wKExA%2BNGjR0LCwsKZYmJiYAOA9H4MVyIn5U2bNnGBwgTIvgPCQLkSoBJ%2BkM1AzfukpKSsCOYNoCHp0Ni5DmKTnBuBscMJtL0BhEFsXOoAUt0FcAi6YW0AAAAaZmNUTAAAABcAAAAQAAAAEAAAAAAAAAAAAB8D6AEBHZJS0wAAAXNmZEFUAAAAGHjaY2DAAXp7ezmnTp3aCsIgNgOpYPLkydlAzfdAGMQmqGHbtm16W7Zsmb158%2BbGM2fOcAE1VU6ZMuUxCE%2BbNq0iKyuLB4h7gXhVXl6eMYYBQI0gzTeBhtwGGhbS09MjAtTcCcIzZ84UycjIiM3MzHwPxK9BhmAzoBGkGYgvA7EjujxQkwcQPwPidyCXYBgAdDYrUGMoSPP%2F%2F%2F8Z0eVBYtnZ2e5AzbGrVq1ig0uAOEBN6UBcAnQ6H6GwsrCwEHJxcWkH4nIPDw92BqDGeiC%2BDnI%2B0BsthAwAapzh7Oz828nJ6Zubm9t0kg0AakY1gFQvREVFCbq6uiK8QGwgAgGTsrJygJKSUgaQzUFyNII0Kygo%2FFNUVPwPNGQO3oS0b9%2B%2BYKCQFDMz81IQ5uLiklRVVU0HaYbiPRiuRE7KQEkuoMapoOgHYRDbysqKF2QzSLOGhoYlwbwB1NSCZEALyblRVFSUBwhWgjCIjUsdAJsS8AnByX%2BOAAAAGmZjVEwAAAAZAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfDhY48AAAF5ZmRBVAAAABp42mNgwAFWrVrFuWTJkiYQBrEZSAVAjRmLFy%2B%2BBcIgNkEN27Zt09uyZcvszZs3N545c4YLqKkMqPk%2BCIPYWVlZPBUVFV3l5eXLq6qqjDAMAGoEab4JNOQ20LCQhQsXCgM1t4HwunXrhEtLS6PLyspeAQ14DjIEmwGNIM1AfBmIHdHlgZrdgRofAfErkEswDAA6mxWoMRSk%2Bf%2F%2F%2F4zo8iAxoEY3II4GBiobcmizATWlA3EJ0Ol8hMLKxsZGMCAgoBWISz08PNgZgBrrgfg6yPlAb7QQMgCocaqfn983f3%2F%2Fj0FBQVMoN4BUL%2BTn5wsEBga2wL1AbCDW19czGRoa%2Bunq6qbJy8tzkByNQI3%2BOjo6P4H4v56e3iy8CWn37t3BQCEpHh6eJSDMxcUlqa%2BvnwrSrK2t%2FQ9o2E68SRnoBS6gxslAjf9BmJeXd5KVlRUvyGaQZiMjIwuCeQOoqRHJgCaSc6OoqCiPsLDwMhAGsXGpAwBEpviQbN5BdAAAABpmY1RMAAAAGwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdd7BmAAABbmZkQVQAAAAceNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWrYtm2bHlDxbKCNjUANXEB2CZB9B4RB7Pr6ep7W1tYOIF7S3t5uiGEAUCFI802g4ttAw0LWrVsnDOS3gPDu3buFm5qaolpaWp4DDXgCMgSbAY0gzUB8GYgd0eWbm5vdgAbchxrSgWHAmTNnWIEaQ0Ga%2F%2F%2F%2Fz4guDxIDanQF4ihgoLIhhzYbUBMowEqATucjFFbe3t6CcXFxTbGxscW5ubnsDECN9dDQvg3yLyEDgBonx8TEfALit0CDJlJuAKleyM%2FPF0DxArGBCARM1tbWvhYWFiny8vIcJEcjUKOvubn5VyD%2Ba2lpOR1vQgImnGAuLi5JcXHxRSAsKioqAbQ9GaQZiH8BDduGNykDvcAF1DRBTEzsPwgDDZng5%2BfHC7IZpNnGxsacYN6QkJCoBxryH4RBbJJzo5aWFo%2BsrOxiEAaxcakDADqJAhkT68NIAAAAGmZjVEwAAAAdAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfC9whwAAAGhZmRBVAAAAB542qWTPUgCcRjG7049zcQEFzc%2FEASHaGpqyTucAhcPnGsIv4bANVSoEKQI%2FFhajJocHDwRwaWlza0hwoagrSVoCVqu54EiuVNE%2BsODz93%2F%2F%2FzufV%2FvBGHB6na7a7quVyh6YdXV7%2FcPB4PBI0W%2FNDAcDjdx%2BApPrCLghi%2FBP1P09Xp9vdVqnTabzWtoywLAQYafcHgKWLrX6%2FlxfUKNx2N%2Fo9HIIPgKyAsh8wBVhqEHaNe83263VUCmhEBnFsBkMnEgqDFsGIZo3uc9BBWAMvCO2WnLCHFgJZTuXTarVCrly2azlVwud1QsFp0CguWfaU%2FZ7zIAgpcAvENv%2BXz%2B4v%2BA3xZGo1EJvfmWAWq12gaCfy3MLDdUkGU5jV%2FJHCyXy1IymdxLJBIH0WjUaSHbbLZbDlsURQMQzbzPsKIoH9CXqqoty18kSdI9LWW32wvxeDwQDoc7VDAYDACwzzAq%2BARAt1Tgcrl2UMUddINLL8o8R9igIpHIhaZpHj6ZYcC25w5o9gVC6DgUChkU%2FcpfI1rwxGKxDkW%2F6Nw37k3xuSzoMScAAAAaZmNUTAAAAB8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHSsR9QAAAZ9mZEFUAAAAIHjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlq2LZtmx5Q8WygjY1ADVxAdgmQfQeEQexFixZxL168uBmI5wHZ%2BhgGABWCNN8EKr4NNCxk3bp1wkB%2BCwjv3r1bGKgxbMmSJfeA9B2QIdgMaARpBuLLQOyILr9s2TInoAHXoIY0Yxhw5swZVqDGUJDm%2F%2F%2F%2FM6LLg8SATncCGhQGZLMihzYbUBMowEqATucjFFbx8fECFRUVteXl5fm5ubnsDECN9dDQvg3yLyEDysrK%2BoCaXwPpZ5WVld2UGwDzAtD5JUC%2FCRAyYObMmfwoXkACXJycnFn8%2FPzBQDYTtkAMCgry8vPzS1RRUWHHMJmPj28hNzf3fxCGGoICAgMDvf39%2Fd8BDfgWEBAwCcN0Xl7eQ1xcXGADgIZlm5ubi%2Bvq6s4FYS0tLQmg7QkgzUD8GWjQBgwXCAoKWgMN2Q9yiZCQEB9QY7eOjs5%2FEAaxs7KyeEA2gzQDXWNKMG8ANVVra2v%2FBWEQm%2BTcqKenx21kZDQXhEFsXOoAfEH6IOWuH2wAAAAaZmNUTAAAACEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB88%2BqfQAAAYJmZEFUAAAAInjapVOxSwJhHLVAwwoN40692bkpODlwSLihschNrzEUwsUlCi65OzUamrWhXdDhPBzrH7itIcK2hqChoa2l6z24QjzlkD543Lvf7733%2Fb4Pvkhkwer3%2B%2FHRaHRJkEeWXbZtnziO80SQhxrG4%2FEOxLfYsQnDOngD%2FIUgZ409aqgNBKBJ8zMEEwiOhsPhNv5Ngpw19qihdl4A0yfAI7A322fN7zGkGQhwXTeKZolCz%2FNWZvus%2BSEl8Oj0bcdQ5IU1MGYi7K7q9fqWYRgXlmWd6roe42i6f9sczQwLgPHaNM034LXdbnf%2BH%2FB7BIzfwNmSYQHdbjfZarXO%2F44wteKCIFSz2ewB%2BOq8S9Q0bb9SqRzncrm1QHImk7lDgEeAH872aS6Xy%2B%2FAJ%2FhNIF0UxQea8WVAtVgspvP5fI%2BQZTkNk0YzJvjAdxCYQJIkBeZ7TpJKpRKKonRg%2FPZxVavVNrkzMEDIbujbwM5nMH4R5Eu%2FRlVVNwqFQo8gX6T7AfzqBKx3VEm7AAAAGmZjVEwAAAAjAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR5ZeZQAAAGNZmRBVAAAACR42qWTvUsCYRzH75Ky7LCht1E9FZxamhp9ObsxobZoFT11CqLJpLdbWjq1oPboBgcVp%2FsvGiIMGoKWoLaWoOv7BS3qlEt64APf5%2Fn9ft%2Ff88IjCEOGaZpTrVZrj1ALo45ms5ltt9u3hNq1oNPpLCH5Ah0rKPBBb0PfE2quMcYc5joMEGTxHRK6SFhvNBqzmB8Qaq4xxhzmDjKgexfcgPjvONd6MZpUHAa2bfssy2KXOLQ4IC72TDagx78CgUBg0uPx7IuiaGA673ZXuq7PGIaxCzS8zoQgSZLJBgRGV24G9Xpdr1arj%2BChVqsd0uD6Xwb9I4BTxOf%2B8Nx%2BFH4foT%2BKxaI3Go1mw%2BHwGqZjgy5R07TVXC63paqq1%2BEsy%2FJlKBSyg8HgR8%2Fkx8jn8yp4Ai%2FgxOGOYosGBGbZTCazkEqlzkkikVgsFAqb6P4KnmFgOnYQi8VWaMKdRCIRPwqPksnkO4E%2BLpfLEjuzuFQqLbv%2BDRTtoPMboR75NyqKMp1Op88I9bC8T5%2BU8PAz88iaAAAAGmZjVEwAAAAlAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfOTC%2B4AAAGWZmRBVAAAACZ42qWTu0%2FCUBjFwcQHhXZpZGVkAMpjcmVAmSwQnezqY2FTSlgQQxxk0uiiG6AmDAxASEz4AxjYHIxiYuJiwuZkXKznJMBAIZV4k5Oce8%2F3%2FW7vba7NNmPUajVHs9k8puht845Go7HfarWeKHrLhna7raD4BjsW0CDAH8K%2FUvRcY8Ya1poACNn8jII%2BCrbq9bqMeZGi5xoz1rB2GoD0PvQIRSdzrg0zQgomgGEYjk6nw12i8PYpuX0I2e71eovjwOPxrIiiWHC5XBeYrlrdVaVSkcrlsl6tVg%2Fwd5ZssizfCYJgUIDc%2FgFwCr1BL4Cc%2FB8wOoIkSefIZStAt9uV0JgZH2E00un0cjAY3AuHw5v5fH5h2iVms9l1Xde1eDy%2BbCIrinLt9%2FsN6DsUCqmTeSaT2UDzOzQA6MwECAQCDz6f74cQ%2BF1N09yJROKKisVibjTtADIA4AO6NwEikcgaIfwSr9crJpPJoqqqX0MVS6WSkzuzOZfLRSzfBnY%2BQuMnRT%2F3a8QRnKlU6pKin1X3C2Zv%2BIepEdLNAAAAGmZjVEwAAAAnAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR4F2AcAAAGGZmRBVAAAACh42mNgwAFWrVrFuXnz5gYQBrEZSAWbNm1K37Jly3UQBrEJati2bZseUPFsoI2NQA1cQHYJkH0HhEFskBhIDqQGpBbDAKAkSPNNoILbQAUh69atEwbyW0AYxAaJgeRAakBqsRkAMv02EF8GYkd0eZAYVA5kSCOGAf%2F%2F%2F%2BfcuXMnyBZHIJsRizwj1JDQM2fOsMIl5OXlOSQkJOpFRUUnALkiRIQVHyhMgDgdGDtsDLKysouBmv%2BDsLi4%2BCJCBoDCBOpVUAzVU24AzAtAzRN4eXmFCRlw4sQJPqA3EF6AgdzcXHYrK6sUa2trXyCXCVsgtra2ugJxVGhoKBuGyZaWltPNzc3%2FAvFXqCEooLm52a2lpeU%2BED8HGtKBYYCFhcU2oOZfIEOA7BSgi0RjY2Mng3BgYKBYW1tbJFTzEyBegmGAjY2NOcgQkEuAXuGNi4trjImJ%2BQTFTd3d3dwgm0Ga29vbDQnmDaDNxUCNb0EYxCY5N6alpXEBXTERhEFsXOoALlABImtNWOoAAAAaZmNUTAAAACkAAAAQAAAAEAAAAAAAAAAAAB8D6AEB83bpWwAAAaRmZEFUAAAAKnjaY2DAAVatWsW5efPmBhAGsRmIAf%2F%2F%2F2eEsTdt2pS%2BZcuW6yAMYhPUzMHBYcPMzHwAiBcDufw7duwoBtp%2BB4SBhpQADeECshuB7Nnbtm3Tw7CZiYnpKIgJwkB27qNHj4SAGlpAeN26dcJATSFAzbeB%2FJtAPBvDBUCbl4A0MzIy%2FmdjYwtBlwdqdgTiy1BDGrH5gpOFhSUbqpkJW%2FhADQk9c%2BYMK1xCXl6eQ0VFpU5ZWbnPwsJCiFBYAb3CBwoTIE4Hxg4bg7q6%2BkIFBYX%2FioqK%2F4GGLCBkAChMQN6AxlA95QbAvKCkpNQnJSUlTMiAEydO8AG9gfACDOTm5rK7ubklAbFPfX091kCcMmWK8%2BTJkyNCQ0PZMEx2cXGZ6uzs%2FAuIP4EMQZefNm2aC1DzbaAhj4G4DZsBm52cnL5DDUmqrKwUzcrKmgDCiYmJojNmzAgHaZ46deoDIL0QwwCgrWYgQ0AusbKy4s3JyanPzMx8D8UNixYt4gZqbgVpBmIDgnkDaHMhUOMrEAaxGUgFaWlpXECN%2FSAMYuNSBwBOIvA4wVgLqgAAABpmY1RMAAAAKwAAABAAAAAQAAAAAAAAAAAAHwPoAQEe4DqyAAABkWZkQVQAAAAseNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWoQFBS05uXl3c%2FHx7cQyOXfsWNHMdD2OyAMNKQEaAgXkN0IZM%2Fetm2bHorm%2F%2F%2F%2FMwI1H%2BLi4vrPzc39n5OTM%2FvRo0dCQA0tILxu3TphoKYQoObbQP5NIJ6N4QKQzSDNIMzPzx%2BMLg%2FU7AjEl6GGNGLzBQfQkCyoZiZ0SZAroYaEnjlzhhUuYW9vz6Grq1sNxN3e3t6ChMIK6BU%2BUJgAcTowdtgYjIyM5mpra%2F%2FV0dH5DzRkLiEDQGEC8gY0huopNwDJCz0yMjJCJHsBKeWxBQUFJQCxFyjAsAXiokWLnBYvXhxWX1%2FPhmFyQEDAJD8%2Fv2%2F%2B%2Fv7vAgMDvdHlgRqdlyxZcg2I7wHZzRgGADVuABrwGWpIAtAWkbKysj4Qzs3NFQXZDNV8B4jnYRgAtNUUZAjUJbwVFRW15eXlr0EYaEgtKCmDbAZpBnpFn2DeAGrMB2p8BsIgNsm5EegFrsrKym4QBrFxqQMANXn6HYPJ7D8AAAAaZmNUTAAAAC0AAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ypIyAAAAWtmZEFUAAAALnjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlqkJKSshITE9snISExH8jl37ZtWwnQ9jsgDDSkBGgIF5DdCGTPBsrpoWj%2B%2F%2F8%2FI1DzflFR0f9A%2Br%2BwsHDmo0ePhIAaWkB43bp1wkBNIUDNt4H8m0A8G8MFIJtBBoAwkB2ELg%2FU7AjEl6GGNGLzBQdQY6akpGQgkM2ELglyJdSQ0DNnzrDCJTw8PNgtLCwqLS0tO6OiogQJhRXQK3ygMAHidGDssDHY2trOMjc3%2FwnE%2F4AGzSJkAChMQN6AxlA95QbAvAA0oFNLS0uIZC8gpTy22NjY%2BLi4OE9QgBEdiDAA1NgfExPzCYhfgQwhORqBGtcCXfAOakhcT0%2BPSGtrazcI19fXixBMSEDNJkCb14JcEhoaytPW1lYN1PwchFtaWqqBzsadlLEBoMZcoMbHIAxik5wbgc7mam9v7wBhEBuXOgDZvgVwR0IA4QAAAABJRU5ErkJggg%3D%3D";
var img_aniv = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACNElEQVR42p1TTWsTURSdla7c%2BROyEVz4C7oTXQguVLoRFIoUl0aUgEGr0YKgFbStsVJttGotSJKaqCUl4qQxurBgg%2BaTtJnXSdKZJO2QZFJCkuO703RMbUXwwmHeu%2BfjvvdgBKGrIgHhaDQiRIS%2F1L94IRkV9Ip2CFxo%2Fx9eiC%2FuhV7rR3xxT3u3iVt87Psmv6PezD1EaL4XU35HXRTFZIIbaGI4eLrI956n3mHMfTyF4Vc2eZuRkxaOofFACe4vaxh9V4Cu6zAn8m%2BxWITjtQznewXnR1IqecyAz6LXxRjDo1kV06EyRnwqqFxvNydOeAeN%2FZXnMu7PrMI6lgF5zICQGGzywstPZS5QEFjQDMOt6RycHxRceyEbe6e7gMvjDO6ggnlxdsMMCIv%2BdqPRwJ91dVLGA98qbM%2BY2Wu1WlAUBamv9qYZwBasrWQiBrrGVtGJnJ48bE8YZsSS0SuXy0jEf6KQ8UONHPgdsBbe16xnbyKdihmPlc%2FnwaQlrKwwAxSsqiqWl9LQso9BWvKYAbmBg%2B3iRD%2Bq6dtQmQhNmkRdGjShS3exzqZQk%2B5ATztAWvKYASXf%2FqZy7wxk6wmoo31Y911A9ZvdEBNoTT3iSENa8nRfYaOevQEteAnq2Dnk7L2Q%2Bo5h%2BeRhA7SmHnGkIS15ugNclR%2FHOXF929F3BdeQljzdARaOIY56JXoE1cRZ6JmLXDxggNbUI440Ha1lx7%2FAmz0cdg4PR5Kj1kGy0yOup9vzC42qUyLKPOo1AAAAAElFTkSuQmCC";

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var info_canceled = false;
var info_timer = null;
var info_timer_out = null;
var popup_status = false;
var access_keywords_last_call = 0;
var access_keywords_timer;
var click_smiley_last_call = 0;
var click_smiley_timer;
var keywords_tooltip_timer;
var tooltip_canceled = false;

/* -------------- */
/* les constantes */
/* -------------- */

const script_name = "[HFR] Infos rapides";
const root = document.querySelector("div.container > div#mesdiscussions.mesdiscussions");
const profil_url = "https://forum.hardware.fr/profilebdd.php?config=hfr.inc&pseudo=";
const regexp_avatar =
  "<img src=\"(https:\/\/forum-images\.hardware\.fr\/images\/mesdiscussions-.*?)\" alt=\"[^\"]+\" \/>";
const regexp_smiley_1 = "([^<>]*)<img src=\"(https:\/\/forum-images\.hardware\.fr\/images\/perso\/";
const regexp_smiley_2 = "[^\/]*\.gif)\".*?\/>";
const html_avatar = "<img class=\"gm_hfr_infos_rapides_avatar\" src=\"";
const html_smiley = "<img class=\"gm_hfr_infos_rapides_smiley\" src=\"";
const html_image_2 = "\" alt=\"";
const html_image_3 = "\" title=\"";
const html_image_4 = "\">";
const hide_delay = 300;
const hash_check_input = document.querySelector("input[type=\"hidden\"][name=\"hash_check\"]");
const hash_check = hash_check_input ? hash_check_input.value.trim() : "";
const get_keywords_url = "https://forum.hardware.fr/wikismilies.php?config=hfr.inc&detail=";
const smileys_keywords_regexp = new RegExp("name=\"keywords0\" value=\"(.*?)\" onkeyup", "");
const set_keywords_url = "https://forum.hardware.fr/wikismilies.php?config=hfr.inc&option_wiki=0&withouttag=0";
const set_keywords_arg_modif = "modif0";
const set_keywords_arg_smiley = "smiley0";
const set_keywords_arg_keywords = "keywords0";
const set_keywords_arg_hash_check = "hash_check";
const access_keywords_time = 250;
const click_smiley_time = 300;
const set_keywords_time = 1500;
const keywords_tooltip_time = 450;

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // styles de la popup d'info
  "div#gm_hfr_infos_rapides{position:absolute;border:1px solid #242424;max-width:238px;height:auto;" +
  "background:linear-gradient(#ffffff, #f7f7ff);color:#000000;display:none;padding:4px 6px 6px;z-index:999;" +
  "border-radius:10px;font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:10px;text-align:center;}" +
  "div#gm_hfr_infos_rapides img.gm_hfr_infos_rapides_avatar{padding:2px 0 4px;vertical-align:text-bottom;}" +
  "div#gm_hfr_infos_rapides img.gm_hfr_infos_rapides_smiley{padding:4px 2px 0;vertical-align:text-bottom;}" +
  // styles pour la tooltip d'affichage des mots-clés
  "div#gm_hfr_infrap_r21_keywords_tooltip{position:absolute;max-width:350px;height:auto;padding:4px 8px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border-radius:10px;font-size:11px;border:1px solid;" +
  "background:linear-gradient(#ffffff, #f7f7ff);left:0;top:0;text-align:justify;color:#000000;display:none;" +
  "z-index:1005;cursor:default;}" +
  "div#gm_hfr_infrap_r21_keywords_tooltip.gm_hfr_infrap_r21_locked" +
  "{background:linear-gradient(#ffffff, #fff0f0);}" +
  // styles pour la popup d'édition des mots-clés
  "div#gm_hfr_infrap_r21_keywords_popup{display:none;position:absolute;left:0;top:0;width:auto;height:auto;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;padding:4px;overflow:auto;" +
  "resize:both;min-width:416px;min-height:70px;background:linear-gradient(#ffffff, #f7f7ff);color:#000000;" +
  "z-index:1006;}" +
  "div#gm_hfr_infrap_r21_keywords_popup.gm_hfr_infrap_r21_locked{background:linear-gradient(#ffffff, #fff0f0);}" +
  "div#gm_hfr_infrap_r21_keywords_popup.gm_hfr_infrap_r21_keywords_no_edit" +
  "{resize:none;width:416px;min-height:30px;height:30px;}" +
  "div.gm_hfr_infrap_r21_keywords_nothing{display:flex;justify-content:center;align-items:center;" +
  "cursor:pointer;width:auto;height:100%;}" +
  "span.gm_hfr_infrap_r21_keywords_text{display:block;font-size:14px;}" +
  "div.gm_hfr_infrap_r21_keywords_textarea_div{display:flex;align-items:center;height:calc(100% - 20px);}" +
  "img.gm_hfr_infrap_r21_keywords_smiley_img{display:block;margin:0 4px 0 0;}" +
  "textarea.gm_hfr_infrap_r21_keywords_textarea{margin:0;padding:1px 4px;border:1px solid #c0c0c0;" +
  "font-size:11px;font-family:Verdana,Arial,Sans-serif,Helvetica;display:block;align-self:stretch;" +
  "flex-grow:1;background:#ffffff;resize:none;overflow:auto;}" +
  "textarea.gm_hfr_infrap_r21_keywords_textarea:disabled{background:#f0f0f0;color:#707070;}" +
  "div.gm_hfr_infrap_r21_keywords_div{margin-top:4px;height:16px;}" +
  "span.gm_hfr_infrap_r21_keywords_span{font-size:11px;color:#707070;padding:0 0 0 1px;cursor:default;" +
  "display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:auto;}" +
  "span.gm_hfr_infrap_r21_keywords_span_link{cursor:pointer;}" +
  "img.gm_hfr_infrap_r21_keywords_throbber{display:none;float:right;padding:0 15px 0 0;cursor:default;}" +
  "div.gm_hfr_infrap_r21_keywords_answer{display:none;float:right;text-align:right;font-size:11px;" +
  "color:#ff0000;font-weight:bold;padding:0 15px 0 0;cursor:default;}" +
  "div.gm_hfr_infrap_r21_keywords_answer.gm_hfr_infrap_r21_success{color:#007f00;}" +
  "div.gm_hfr_infrap_r21_keywords_answer.gm_hfr_infrap_r21_wait{color:#ff7f00;}" +
  "div.gm_hfr_infrap_r21_keywords_buttons{float:right;text-align:right;padding:0 15px 0 0;}" +
  "div.gm_hfr_infrap_r21_keywords_buttons > img{margin-left:8px;cursor:pointer;}";
if(box_shadow) {
  style.textContent += "div#gm_hfr_infos_rapides, div#gm_hfr_infrap_r21_keywords_tooltip, " +
    "div#gm_hfr_infrap_r21_keywords_popup{box-shadow:4px 4px 4px 0 rgba(0, 0, 0, 0.4);}";
}
document.getElementsByTagName("head")[0].appendChild(style);

/* ------------------------------------------------ */
/* création de la tooltip d'affichage des mots-clés */
/* ------------------------------------------------ */

// création de la tooltip d'affichage des mots-clés
var keywords_tooltip = document.createElement("div");
keywords_tooltip.setAttribute("id", "gm_hfr_infrap_r21_keywords_tooltip");
document.body.appendChild(keywords_tooltip);

// fonction d'affichage de la tooltip d'affichage des mots-clés
function show_tooltip(p_event) {
  // fermeture de la tooltip (si elle est ouverte ailleurs)
  hide_tooltip();
  tooltip_canceled = false;
  // récupération du smiley
  let l_smiley_img = p_event.currentTarget;
  // récupération des mots-clés et affichage de la tooltip
  keywords_tooltip_timer = window.setTimeout(function() {
    access_keywords(get_keywords, function(p_smiley_img, p_keywords, p_locked) {
      if(tooltip_canceled) {
        return;
      }
      // style pour les smileys verrouillés (ou non)
      keywords_tooltip.classList.remove("gm_hfr_infrap_r21_locked");
      if(p_locked) {
        keywords_tooltip.classList.add("gm_hfr_infrap_r21_locked");
      }
      // ajout du texte (smiley et mots-clés)
      keywords_tooltip.textContent = p_smiley_img.getAttribute("alt") + " {\u00a0" + p_keywords + "\u00a0}";
      // affichage de la tooltip
      keywords_tooltip.style.display = "block";
      // positionnement de la tooltip
      let l_page_width = document.documentElement.scrollWidth;
      let l_tooltip_width = 368;
      let l_tooltip_height = keywords_tooltip.offsetHeight;
      if(window.scrollX + p_event.clientX + 8 + l_tooltip_width < l_page_width) {
        keywords_tooltip.style.left = (window.scrollX + p_event.clientX + 8) + "px";
      } else {
        keywords_tooltip.style.left = (window.scrollX + p_event.clientX - 8 - l_tooltip_width) + "px";
      }
      if(window.scrollY + p_event.clientY - 8 - l_tooltip_height > 0) {
        keywords_tooltip.style.top = (window.scrollY + p_event.clientY - 8 - l_tooltip_height) + "px";
      } else {
        keywords_tooltip.style.top = (window.scrollY + p_event.clientY + 8) + "px";
      }
    }, l_smiley_img);
  }, keywords_tooltip_time);
}

// fonction de fermeture de la tooltip d'affichage des mots-clés
function hide_tooltip(p_event) {
  tooltip_canceled = true;
  window.clearTimeout(keywords_tooltip_timer);
  keywords_tooltip.style.display = "none";
}

// gestion de la fermeture de la tooltip avec un clic n'importe où
document.addEventListener("mousedown", hide_tooltip, false);

// gestion de la fermeture de la tooltip en passant la sourris dessus
keywords_tooltip.addEventListener("mouseover", hide_tooltip, false);

/* -------------------------------------------- */
/* création de la popup d'édition des mots-clés */
/* -------------------------------------------- */

// création de la popup d'édition des mots-clés
var keywords_popup = document.createElement("div");
keywords_popup.setAttribute("id", "gm_hfr_infrap_r21_keywords_popup");
var keywords_nothing = document.createElement("div");
keywords_nothing.setAttribute("class", "gm_hfr_infrap_r21_keywords_nothing");
keywords_nothing.setAttribute("title", script_name);
keywords_nothing.addEventListener("click", hide_popup, false);
var keywords_text = document.createElement("span");
keywords_text.setAttribute("class", "gm_hfr_infrap_r21_keywords_text");
keywords_text.textContent = "Vous devez vous identifier pour modifier les mots-clés.";
keywords_nothing.appendChild(keywords_text);
keywords_popup.appendChild(keywords_nothing);
var keywords_textarea_div = document.createElement("div");
keywords_textarea_div.setAttribute("class", "gm_hfr_infrap_r21_keywords_textarea_div");
var keywords_smiley_img = document.createElement("img");
keywords_smiley_img.setAttribute("class", "gm_hfr_infrap_r21_keywords_smiley_img");
keywords_textarea_div.appendChild(keywords_smiley_img);
var keywords_textarea = document.createElement("textarea");
keywords_textarea.setAttribute("class", "gm_hfr_infrap_r21_keywords_textarea");
keywords_textarea.setAttribute("type", "text");
keywords_textarea.setAttribute("spellcheck", "false");
keywords_textarea_div.appendChild(keywords_textarea);
keywords_popup.appendChild(keywords_textarea_div);
var keywords_div = document.createElement("div");
keywords_div.setAttribute("class", "gm_hfr_infrap_r21_keywords_div");
var keywords_span = document.createElement("span");
keywords_span.setAttribute("class", "gm_hfr_infrap_r21_keywords_span");
keywords_span.textContent = "Mots-clés de ";
keywords_span.setAttribute("title", script_name);
var keywords_span_link = document.createElement("span");
keywords_span_link.setAttribute("class", "gm_hfr_infrap_r21_keywords_span_link");
keywords_span_link.setAttribute("title", "Page du smiley sur le wiki");
keywords_span_link.addEventListener("mousedown", prevent_default, false);
keywords_span_link.addEventListener("mouseup", open_wiki, false);
keywords_span.appendChild(keywords_span_link);
keywords_div.appendChild(keywords_span);
var keywords_throbber = document.createElement("img");
keywords_throbber.setAttribute("class", "gm_hfr_infrap_r21_keywords_throbber");
keywords_throbber.setAttribute("src", img_throbber);
keywords_div.appendChild(keywords_throbber);
var keywords_answer = document.createElement("div");
keywords_answer.setAttribute("class", "gm_hfr_infrap_r21_keywords_answer");
keywords_div.appendChild(keywords_answer);
var keywords_buttons = document.createElement("div");
keywords_buttons.setAttribute("class", "gm_hfr_infrap_r21_keywords_buttons");
var keywords_save = document.createElement("img");
keywords_save.setAttribute("src", img_save);
keywords_save.setAttribute("title", "Valider");
keywords_save.addEventListener("click", save_keywords, false);
keywords_buttons.appendChild(keywords_save);
var keywords_close = document.createElement("img");
keywords_close.setAttribute("src", img_close);
keywords_close.setAttribute("title", "Annuler");
keywords_close.addEventListener("click", hide_popup, false);
keywords_buttons.appendChild(keywords_close);
keywords_div.appendChild(keywords_buttons);
keywords_popup.appendChild(keywords_div);
document.body.appendChild(keywords_popup);

// fonction d'ouverture de la page du smiley sur le wiki dans un nouvel onglet
function open_wiki(p_event) {
  if(p_event.button === 0 || p_event.button === 1) {
    GM.openInTab(get_keywords_url + encodeURIComponent(this.textContent), p_event.button === 1);
  }
}

// fonction d'enregistrement des mots-clés
function save_keywords() {
  keywords_buttons.style.display = "none";
  keywords_throbber.style.display = "block";
  access_keywords(set_keywords, function(p_answer) {
    keywords_answer.textContent = p_answer;
    if(p_answer === "done!") {
      keywords_answer.classList.add("gm_hfr_infrap_r21_success");
    } else if(p_answer === "attendez 5 min") {
      keywords_answer.classList.add("gm_hfr_infrap_r21_wait");
    }
    keywords_throbber.style.display = "none";
    keywords_answer.style.display = "block";
    keywords_span.style.width = "calc(100% - " + (keywords_answer.clientWidth + 10) + "px)";
    window.setTimeout(hide_popup, set_keywords_time);
  }, keywords_popup.dataset.smiley, keywords_textarea.value.trim());
}

// fonction d'affichage de la popup d'édition des mots-clés
function show_popup(p_event) {
  // fermeture de la popup (si elle est ouverte ailleurs)
  hide_popup();
  // positionnement de la popup
  let l_page_width = document.documentElement.scrollWidth;
  let l_page_height = document.documentElement.scrollHeight;
  let l_popup_width = 426;
  let l_popup_height = 80;
  if(hash_check === "") {
    l_popup_height = 40;
  }
  if(window.scrollX + p_event.clientX + 8 + l_popup_width < l_page_width) {
    keywords_popup.style.left = (window.scrollX + p_event.clientX + 8) + "px";
  } else {
    keywords_popup.style.left = (window.scrollX + p_event.clientX - 8 - l_popup_width) + "px";
  }
  if(window.scrollY + p_event.clientY + 8 + l_popup_height < l_page_height) {
    keywords_popup.style.top = (window.scrollY + p_event.clientY + 8) + "px";
  } else {
    keywords_popup.style.top = (window.scrollY + p_event.clientY - 8 - l_popup_height) + "px";
  }
  // vérification de la possibilité d'éditer les mots-clés
  if(hash_check !== "") {
    // récupération du smiley
    let l_smiley_img = p_event.currentTarget;
    let l_code = l_smiley_img.getAttribute("alt");
    // initialisation de la popup
    keywords_popup.dataset.smiley = l_code;
    keywords_popup.classList.remove("gm_hfr_infrap_r21_keywords_no_edit");
    keywords_popup.classList.remove("gm_hfr_infrap_r21_locked");
    keywords_popup.style.width = "416px";
    keywords_popup.style.height = "70px";
    keywords_nothing.style.display = "none";
    keywords_smiley_img.setAttribute("src", l_smiley_img.getAttribute("src"));
    keywords_textarea.value = "";
    keywords_textarea.removeAttribute("title");
    keywords_textarea.removeAttribute("disabled");
    keywords_textarea_div.style.display = "flex";
    keywords_span_link.textContent = l_code;
    keywords_span.style.width = "auto";
    keywords_throbber.style.display = "none";
    keywords_answer.textContent = "";
    keywords_answer.classList.remove("gm_hfr_infrap_r21_success");
    keywords_answer.classList.remove("gm_hfr_infrap_r21_wait");
    keywords_answer.style.display = "none";
    keywords_save.style.display = "inline";
    keywords_buttons.style.display = "block";
    keywords_div.style.display = "block";
    // récupération des mots-clés et affichage de la popup
    access_keywords(get_keywords, function(p_smiley_img, p_keywords, p_locked) {
      keywords_textarea.value = add_final_space ? p_keywords + " " : p_keywords;
      keywords_textarea.selectionStart = 0;
      keywords_textarea.selectionEnd = 0;
      // affichage spécifique des smileys verrouillés
      if(p_locked) {
        keywords_popup.classList.add("gm_hfr_infrap_r21_locked");
        keywords_textarea.setAttribute("title", "smiley verrouillé");
        keywords_textarea.setAttribute("disabled", "disabled");
        keywords_save.style.display = "none";
      }
      // fermeture de la tooltip (pour plus de clareté)
      hide_tooltip();
      // affichage de la popup
      keywords_popup.style.display = "block";
    }, l_smiley_img);
  }
  // l'édition des mots-clés n'est pas possible ici (affichage du texte idoine)
  else {
    // initialisation de la popup
    keywords_popup.classList.add("gm_hfr_infrap_r21_keywords_no_edit");
    keywords_textarea_div.style.display = "none";
    keywords_div.style.display = "none";
    keywords_nothing.style.display = "flex";
    // fermeture de la tooltip (pour plus de clareté)
    hide_tooltip();
    // affichage de la popup
    keywords_popup.style.display = "block";
  }
}

// fonction de fermeture de la popup d'édition des mots-clés
function hide_popup(p_event) {
  keywords_popup.style.display = "none";
}

/* ------------------ */
/* fonctions globales */
/* ------------------ */

// fonction de désactivation de l'action par défaut sur un événement
function prevent_default(p_event) {
  p_event.preventDefault();
}

// fonction de fermeture de le tooltip et des popup par la touche echap
function esc_popup(p_event) {
  if(p_event.key === "Escape") {
    hide_tooltip();
    hide_popup();
    hide_popup_info();
  }
}
document.addEventListener("keydown", esc_popup, false);

// fonction de gestion du (double-)clic sur les smileys (insertion du smiley ou édition des mots-clés)
function insert_or_edit_keywords(p_event) {
  window.clearTimeout(click_smiley_timer);
  let l_click_smiley_last_call = Date.now();
  if((l_click_smiley_last_call - click_smiley_last_call) < click_smiley_time) {
    show_popup(p_event);
  } else {
    click_smiley_timer = window.setTimeout(insert_smiley, click_smiley_time, this.getAttribute("alt"));
  }
  click_smiley_last_call = l_click_smiley_last_call;
}

// fonction d'ajout du smiley dans la première édition rapide ou dans la réponse rapide
function insert_smiley(p_alt) {
  let l_edit_rap = document.querySelector("textarea[id^=\"rep_editin_\"]");
  let l_rep_rap = document.querySelector("textarea#content_form");
  let l_area = l_edit_rap ? l_edit_rap : l_rep_rap;
  if(l_area) {
    let l_text = char_around_smiley_at_insert + p_alt + char_around_smiley_at_insert;
    let l_start_pos = l_area.selectionStart;
    let l_end_pos = l_area.selectionEnd;
    l_area.value = l_area.value.substring(0, l_start_pos) + l_text +
      l_area.value.substring(l_end_pos, l_area.value.length);
    l_area.selectionStart = l_start_pos + l_text.length;
    l_area.selectionEnd = l_start_pos + l_text.length;
  }
}

// fonction de gestion du mouseover sur les smileys (affichage des mots-clés dans le title)
function update_title(p_event) {
  access_keywords(get_keywords, function(p_smiley_img, p_keywords, p_locked) {
    p_smiley_img.setAttribute("title", p_smiley_img.getAttribute("alt") + " {\u00a0" + p_keywords + "\u00a0}");
  }, this);
}

// fonction générique d'édition des mots-clés des smileys
function set_keywords(p_callback, p_smiley_code, p_keywords) {
  let l_url_params = new URLSearchParams();
  l_url_params.append(set_keywords_arg_modif, "1");
  l_url_params.append(set_keywords_arg_smiley, p_smiley_code);
  l_url_params.append(set_keywords_arg_keywords, p_keywords);
  l_url_params.append(set_keywords_arg_hash_check, hash_check);
  fetch(set_keywords_url, {
    method: "POST",
    mode: "same-origin",
    credentials: "same-origin",
    body: l_url_params,
    cache: "reload",
    referrer: "",
    referrerPolicy: "no-referrer",
  }).then(function(p_response) {
    return p_response.text();
  }).then(function(p_text) {
    if(p_text.includes("Vos modifications sur les mots clés ont été enregistrés avec succès")) {
      p_callback("done!");
    } else if(p_text.includes(
        "Vous ne pouvez pas modifier plusieurs fois le même smiley dans un intervale de 5 minutes")) {
      p_callback("attendez 5 min");
    } else if(p_text.includes(
        "Vous devez être identifié pour modifier les mots clés d'un smiley")) {
      p_callback("vous devez vous identifier");
    } else if(p_text.includes(
        "Ce smiley étant vérouillé, vous ne pouvez pas en modifier les mots clés")) {
      p_callback("smiley verrouillé");
    } else if(p_text.includes(
        "Vous ne pouvez pas modifier les mots clés d'un smiley si vous êtes sous le coup d'une sanction")) {
      p_callback("sous le coup d'une sanction");
    } else {
      console.log(script_name + " ERROR set_keywords : ", p_text);
      p_callback("error");
    }
  }).catch(function(p_error) {
    console.log(script_name + " ERROR fetch set_keywords : ", p_error);
    p_callback("fetch error");
  });
}

// fonction générique de récupération des mots-clés des smileys
function get_keywords(p_callback, p_smiley_img) {
  fetch(get_keywords_url + encodeURIComponent(p_smiley_img.getAttribute("alt")), {
    method: "GET",
    mode: "same-origin",
    credentials: "omit",
    cache: "reload",
    referrer: "",
    referrerPolicy: "no-referrer",
  }).then(function(p_response) {
    return p_response.text();
  }).then(function(p_text) {
    let l_keywords = p_text.match(smileys_keywords_regexp).pop().trim();
    let l_locked = !p_text.includes("<input type=\"checkbox\" value=\"1\" name=\"modif0\" id=\"modif0\" />" +
      "<label for=\"modif0\">Modifier les mots clés</label>");
    p_callback(p_smiley_img, l_keywords, l_locked);
  }).catch(function(p_error) {
    console.log(script_name + " ERROR fetch get_keywords : ", p_error);
    p_callback(p_smiley_img, "error");
  });
}

// fonction générique et temporisée d'accès aux mots-clés des smileys
function access_keywords(p_access_function, p_callback, p_param_1, p_param_2) {
  window.clearTimeout(access_keywords_timer);
  let l_last_call = Date.now();
  let l_wait_time = Math.max(access_keywords_time - (l_last_call - access_keywords_last_call), 0);
  access_keywords_last_call = l_last_call;
  access_keywords_timer = window.setTimeout(p_access_function, l_wait_time, p_callback, p_param_1, p_param_2);
}

// division entière pour le calcul de l'age
function div_int(p_a, p_b) {
  return ((p_a - (p_a % p_b)) / p_b);
}

// fonction de nettaoyage du pseudal
function get_real_pseudal_value(p_pseudal_value) {
  return p_pseudal_value.replace("\u200B", "").replace(" a écrit", "").replace(" :", "");
}

// fonction d'ajout des popup d'info sur les pseudals
function add_info_pseudal(p_pseudal, p_profillink, p_avatarimg, p_avatar_not_present) {
  p_pseudal.setAttribute("gm_hfr_infos_rapides_r21", "gm_hfr_infos_rapides_r21");
  let l_real_pseudal = get_real_pseudal_value(p_pseudal.firstChild.textContent.trim());
  if(l_real_pseudal !== "Profil supprimé" && l_real_pseudal !== "Modération" && l_real_pseudal !== "Publicité") {
    let l_profileurl = null;
    if(p_profillink) {
      l_profileurl =
        p_pseudal.parentElement.parentElement.parentElement.querySelector("a[href^=\"/hfr/profil-\"]").href;
      p_pseudal.style.cursor = "help";
      p_pseudal.addEventListener("mousedown", prevent_default, false);
      p_pseudal.addEventListener("mouseup", function(p_event) {
        p_event.preventDefault();
        if(p_event.button === 0 || p_event.button === 1) {
          GM.openInTab(l_profileurl, p_event.button === 1);
        }
      }, false);
    }
    add_popup(p_pseudal, l_real_pseudal, p_avatarimg, l_profileurl, p_avatar_not_present);
  }
}

// récupération des différents pseudal et ajout de la popup d'info
var pseudos = root.querySelectorAll(
  "table.messagetable td.messCase1 > div:not([postalrecall]) > b.s2:not([gm_hfr_infos_rapides_r21])");
for(let l_pseudal of pseudos) {
  let l_avatar_div = l_pseudal.parentElement.parentElement.querySelector("div.avatar_center");
  add_info_pseudal(l_pseudal, true, false, l_avatar_div === null);
}
var pseudos_citation = root.querySelectorAll(
  "table.messagetable td.messCase2 div.container table.citation td b.s1:not([gm_hfr_infos_rapides_r21]), " +
  "table.messagetable td.messCase2 div.container table.oldcitation td b.s1:not([gm_hfr_infos_rapides_r21])");
for(let l_pseudal of pseudos_citation) {
  add_info_pseudal(l_pseudal, false, true, false);
}
window.setTimeout(function() {
  var pseudos_hfr_chat = root.querySelectorAll(
    "table.messagetable td.messCase2 > div.toolbar > span > span > b.s2:not([gm_hfr_infos_rapides_r21])");
  for(let l_pseudal of pseudos_hfr_chat) {
    add_info_pseudal(l_pseudal, true, false, false);
  }
}, 1000); // 1 seconde
window.setTimeout(function() {
  var pseudos_recall = root.querySelectorAll(
    "table.messagetable td.messCase1 > div[postalrecall] > b.s2:not([gm_hfr_infos_rapides_r21])");
  for(let l_pseudal of pseudos_recall) {
    add_info_pseudal(l_pseudal, true, true, false);
  }
}, 10000); // 10 secondes


// fonction de fermeture de la popup d'info en quitant le psuedal
// attend de savoir si on est passé sur la popup d'info ou pas
function wait_before_hide() {
  window.clearTimeout(info_timer_out);
  info_timer_out = window.setTimeout(function() {
    if(popup_status === "mouseover") {
      return;
    }
    hide_popup_info();
  }, hide_delay);
}

// gestion de l'enregistrement de l'information de passage du curseur sur la popup d'info
// et stop la disparition de la popup d'info
function slide_on_popup() {
  popup_status = "mouseover";
  window.clearTimeout(info_timer_out);
}

// fonction de fermeture de la popup d'info en sortant de la popup d'info
// ajout de la tempo pour l'homogénéité du feel
function do_hide_popup_info() {
  popup_status = false;
  window.clearTimeout(info_timer_out);
  info_timer_out = window.setTimeout(function() {
    hide_popup_info();
  }, hide_delay);
}

// fonction de fermeture de la popup d'info (for real this time)
function hide_popup_info() {
  popup_status = false;
  window.clearTimeout(info_timer_out);
  if(document.getElementById("gm_hfr_infos_rapides")) {
    document.getElementById("gm_hfr_infos_rapides").style.display = "none";
  }
}

// fonction de construction de la popup d'info en fonction du profil
function add_popup(p_pseudal, p_real_pseudal, p_avatarimg, p_profileurl, p_avatar_not_present) {
  // ajout du mouseover
  p_pseudal.addEventListener("mouseover", function(p_event) {
    hide_popup_info();
    // réinitialisation du info_canceled
    info_canceled = false;
    window.clearTimeout(info_timer);
    info_timer = window.setTimeout(function() {
      let l_infos_div = document.getElementById("gm_hfr_infos_rapides");
      // creation de la div infos si pas déjà fait
      if(l_infos_div === null) {
        l_infos_div = document.createElement("div");
        l_infos_div.setAttribute("id", "gm_hfr_infos_rapides");
        l_infos_div.addEventListener("mouseenter", slide_on_popup, false);
        l_infos_div.addEventListener("mouseleave", do_hide_popup_info, false);
        document.body.appendChild(l_infos_div);
      }
      // recupération du profil et remplissage de la div infos
      fetch(p_profileurl !== null ? p_profileurl : profil_url + encodeURIComponent(p_real_pseudal), {
        method: "GET",
        mode: "same-origin",
        credentials: "omit",
        cache: "reload",
        referrer: "",
        referrerPolicy: "no-referrer"
      }).then(function(p_response) {
        return p_response.text();
      }).then(function(p_profile) {
        // récuprération des infos
        let l_tmp;
        let l_avatar = (l_tmp = p_profile.match(new RegExp(regexp_avatar, ""))) !== null ? l_tmp.pop() : null;
        let l_status = p_profile.match(new RegExp("<td class=\"profilCase2\">Statut.*&nbsp;: <\/td>\\s*" +
          "<td class=\"profilCase3\">([^<]+)<\/td>", "")).pop().trim();
        let l_nb_posts = p_profile.match(new RegExp("<td class=\"profilCase2\">Nombre de messages .*&nbsp;: " +
          "<\/td>\\s*<td class=\"profilCase3\">([0-9]+)<\/td>", "")).pop();
        let l_date_insc = p_profile.match(new RegExp("<td class=\"profilCase2\">Date .* sur le forum&nbsp;: " +
          "<\/td>\\s*<td class=\"profilCase3\">([0-9]{2}\/[0-9]{2}\/[0-9]{4})<\/td>", "")).pop();
        let l_smileys = p_profile.match(new RegExp("<td class=\"profilCase4\" rowspan=\".\">" +
          "([\\s\\S]*?)<\/td>\\s*<\/tr>", "")).pop().trim();
        let l_smiley_perso_0 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_0 = (l_smiley_perso_0 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_1 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "1\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_1 = (l_smiley_perso_1 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_2 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "2\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_2 = (l_smiley_perso_2 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_3 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "3\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_3 = (l_smiley_perso_3 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_4 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "4\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_4 = (l_smiley_perso_4 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_5 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "5\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_5 = (l_smiley_perso_5 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_6 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "6\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_6 = (l_smiley_perso_6 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_7 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "7\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_7 = (l_smiley_perso_7 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_8 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "8\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_8 = (l_smiley_perso_8 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_9 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "9\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_9 = (l_smiley_perso_9 !== null) ? l_tmp.pop().trim() : null;
        let l_smiley_perso_10 = (l_tmp = l_smileys.match(new RegExp(regexp_smiley_1 + "10\/" +
          regexp_smiley_2, ""))) !== null ? l_tmp.pop() : null;
        let l_smiley_perso_alt_10 = (l_smiley_perso_10 !== null) ? l_tmp.pop().trim() : null;
        let l_date_birth =
          (l_tmp = p_profile.match(new RegExp("<td class=\"profilCase2\">Date de naissance&nbsp;: " +
            "<\/td>\\s*<td class=\"profilCase3\">([0-9]{2}\/[0-9]{2}\/[0-9]{4})<\/td>", ""))) !== null ?
          l_tmp.pop() : null;
        let sexe = (l_tmp = p_profile.match(new RegExp("<td class=\"profilCase2\">[s|S]exe&nbsp;: <\/td>\\s*" +
          "<td class=\"profilCase3\">(homme|femme)<\/td>", ""))) !== null ? l_tmp.pop() : null;
        let l_ville =
          (l_tmp = p_profile.match(new RegExp("<td class=\"profilCase2\">[v|V]ille&nbsp;: <\/td>\\s*" +
            "<td class=\"profilCase3\">(.*?)<\/td>", ""))) !== null ? l_tmp.pop().trim() : null;
        let l_date_mess = p_profile.match(new RegExp("<td class=\"profilCase2\">Date du dernier message&nbsp;: " +
          "<\/td>\\s*<td class=\"profilCase3\">\\s*([0-9]{2})-([0-9]{2})-([0-9]{4})&nbsp;." +
          "&nbsp;([0-9]{2})\:([0-9]{2})\\s*<\/td>", ""));
        if(l_date_mess !== null) {
          l_date_mess.shift();
        }
        let l_age;
        if(l_date_birth !== null) {
          let l_year = parseInt(l_date_birth.substring(6, 10));
          let l_month = parseInt(l_date_birth.substring(3, 5));
          let l_day = parseInt(l_date_birth.substring(0, 2));
          let l_date = new Date();
          if(((l_month - 1) === l_date.getMonth()) && (l_day === l_date.getDate())) {
            l_age = "<span style=\"color:red;font-weight:bold\">" + (l_date.getFullYear() - l_year) +
              " ans</span>&nbsp;<img style=\"vertical-align: bottom;\" alt=\"gateau\" src=\"" + img_aniv + "\">";
          } else if((l_month - 1) < l_date.getMonth()) {
            l_age = (l_date.getFullYear() - l_year) + " ans";
          } else if((l_month - 1) > l_date.getMonth()) {
            l_age = (l_date.getFullYear() - l_year - 1) + " ans";
          } else if((l_month - 1) === l_date.getMonth()) {
            if(l_day < l_date.getDate()) {
              l_age = (l_date.getFullYear() - l_year) + " ans";
            } else {
              l_age = (l_date.getFullYear() - l_year - 1) + " ans";
            }
          }
        } else {
          l_age = " &acirc;ge non pr&eacute;cis&eacute;";
        }
        switch(sexe) {
          case "homme":
            l_date_insc = "Inscrit le " + l_date_insc;
            sexe = "Homme";
            break;
          case "femme":
            l_date_insc = "Inscrite le " + l_date_insc;
            sexe = "Femme";
            break;
          default:
            l_date_insc = "Inscrit(e) le " + l_date_insc;
            sexe = "Ange";
        }
        l_ville = l_ville !== "" && l_ville !== null ? l_ville : "Ville non pr&eacute;cis&eacute;e";
        let l_time_inact = "N'a jamais posté";
        if(l_date_mess !== null) {
          l_time_inact = div_int(new Date().getTime() -
            new Date(l_date_mess[2],
              l_date_mess[1] - 1,
              l_date_mess[0],
              l_date_mess[3],
              l_date_mess[4]).getTime(), 1000);
          if(l_time_inact <= 360) {
            l_time_inact = "moins de 5 minutes";
          } else if(l_time_inact < 3600) {
            l_time_inact = div_int(l_time_inact, 60) + " minutes";
          } else if(l_time_inact < 7200) {
            l_time_inact = "une heure";
          } else if(l_time_inact < 86400) {
            l_time_inact = div_int(l_time_inact, 3600) + " heures";
          } else if(l_time_inact < 172800) {
            l_time_inact = "un jour";
          } else {
            l_time_inact = div_int(l_time_inact, 86400) + " jours";
          }
          l_time_inact = "Dernier post il y a " + l_time_inact;
        }
        // remplissage de la div infos
        let l_html = "";
        if(l_avatar !== null && (p_avatarimg || p_avatar_not_present)) {
          l_html += html_avatar + l_avatar + html_image_2 + p_real_pseudal + html_image_4 + "<br>";
        }
        l_html += sexe + ", " + l_age + "<br>" + l_ville + "<br>" + l_date_insc + " (" + l_status +
          ")<br>" + l_nb_posts + " posts<br>" + l_time_inact + "<br>";
        if(l_smiley_perso_0 !== null) {
          l_html += html_smiley + l_smiley_perso_0 + html_image_2 + l_smiley_perso_alt_0 + html_image_3 +
            l_smiley_perso_alt_0 + html_image_4;
        }
        if(l_smiley_perso_1 !== null) {
          l_html += html_smiley + l_smiley_perso_1 + html_image_2 + l_smiley_perso_alt_1 + html_image_3 +
            l_smiley_perso_alt_1 + html_image_4;
        }
        if(l_smiley_perso_2 !== null) {
          l_html += html_smiley + l_smiley_perso_2 + html_image_2 + l_smiley_perso_alt_2 + html_image_3 +
            l_smiley_perso_alt_2 + html_image_4;
        }
        if(l_smiley_perso_3 !== null) {
          l_html += html_smiley + l_smiley_perso_3 + html_image_2 + l_smiley_perso_alt_3 + html_image_3 +
            l_smiley_perso_alt_3 + html_image_4;
        }
        if(l_smiley_perso_4 !== null) {
          l_html += html_smiley + l_smiley_perso_4 + html_image_2 + l_smiley_perso_alt_4 + html_image_3 +
            l_smiley_perso_alt_4 + html_image_4;
        }
        if(l_smiley_perso_5 !== null) {
          l_html += html_smiley + l_smiley_perso_5 + html_image_2 + l_smiley_perso_alt_5 + html_image_3 +
            l_smiley_perso_alt_5 + html_image_4;
        }
        if(l_smiley_perso_6 !== null) {
          l_html += html_smiley + l_smiley_perso_6 + html_image_2 + l_smiley_perso_alt_6 + html_image_3 +
            l_smiley_perso_alt_6 + html_image_4;
        }
        if(l_smiley_perso_7 !== null) {
          l_html += html_smiley + l_smiley_perso_7 + html_image_2 + l_smiley_perso_alt_7 + html_image_3 +
            l_smiley_perso_alt_7 + html_image_4;
        }
        if(l_smiley_perso_8 !== null) {
          l_html += html_smiley + l_smiley_perso_8 + html_image_2 + l_smiley_perso_alt_8 + html_image_3 +
            l_smiley_perso_alt_8 + html_image_4;
        }
        if(l_smiley_perso_9 !== null) {
          l_html += html_smiley + l_smiley_perso_9 + html_image_2 + l_smiley_perso_alt_9 + html_image_3 +
            l_smiley_perso_alt_9 + html_image_4;
        }
        if(l_smiley_perso_10 !== null) {
          l_html += html_smiley + l_smiley_perso_10 + html_image_2 + l_smiley_perso_alt_10 + html_image_3 +
            l_smiley_perso_alt_10 + html_image_4;
        }
        l_infos_div.innerHTML = l_html;
        for(let l_img of l_infos_div.querySelectorAll("img.gm_hfr_infos_rapides_smiley")) {
          if(in_title) {
            l_img.addEventListener("mouseover", update_title, false);
          } else {
            l_img.removeAttribute("title");
            l_img.addEventListener("mouseover", show_tooltip, false);
            l_img.addEventListener("mouseout", hide_tooltip, false);
          }
          l_img.addEventListener("click", insert_or_edit_keywords, false);
        }
        // affichage de la div infos
        if(info_canceled) {
          return;
        }
        l_infos_div.style.display = "block";
        l_infos_div.style.left = (p_event.clientX + 16) + "px";
        if(p_event.clientY + 16 + l_infos_div.offsetHeight >= document.documentElement.clientHeight) {
          l_infos_div.style.top = (window.scrollY + p_event.clientY - 16 - l_infos_div.offsetHeight) + "px";
        } else {
          l_infos_div.style.top = (window.scrollY + p_event.clientY + 16) + "px";
        }
      }).catch(function(p_error) {
        console.log(script_name + " ERROR fetch profil : " + p_error);
      });
    }, 450);
  }, false);
  // ajout du mouseout
  p_pseudal.addEventListener("mouseout", function(p_event) {
    // activation du info_canceled
    info_canceled = true;
    window.clearTimeout(info_timer);
    if(comme_avant) {
      hide_popup_info();
    } else {
      wait_before_hide();
    }
  }, false);
}

// fonction de gestion du masquage de la popup d'info en cliquant en dehors
document.addEventListener("click", function(p_event) {
  if(p_event.target.id === "gm_hfr_infos_rapides" ||
    p_event.target.className === "gm_hfr_infos_rapides_avatar" ||
    p_event.target.className === "gm_hfr_infos_rapides_smiley") {
    return;
  }
  hide_popup_info();
}, false);
