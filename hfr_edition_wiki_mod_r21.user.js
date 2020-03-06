// ==UserScript==
// @name          [HFR] Edition du wiki partout mod_r21
// @version       3.2.4
// @namespace     roger21.free.fr
// @description   Permet d'afficher les mots-clés des smileys persos en passant la souris sur le smiley et permet de modifier facilement les mots-clés des smileys persos via un double-clic sur le smiley.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    toyonos
// @modifications Simplification des étapes de modification des mots-clés, réécriture et modernisation du code.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_edition_wiki_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_edition_wiki_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_edition_wiki_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.openInTab
// @grant         GM_openInTab
// @grant         unsafeWindow
// ==/UserScript==

/*

Copyright © 2011-2012, 2014-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1689 $

// historique :
// 3.2.4 (04/03/2020) :
// - ajout de prevent default pour éviter l'aparition de l'universal scroll sur l'ouverture du wiki
// 3.2.3 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 3.2.2 (30/01/2020) :
// - ajout du lien vers la page du smiley sur le wiki sur le code du smiley dans la popup d'édition
// 3.2.1 (28/01/2020) :
// - minuscules homogénéisations du code avec [HFR] Infos rapides mod_r21 4.0.0
// 3.2.0 (26/01/2020) :
// - gestion de l'enregistrement / restauration du hash_check pour pouvoir éditer le wiki ->
// sur les pages sans hash_check (aperçu normal et pages des profils)
// - correction du code pour éviter les tooltips zombies (ajout d'un canceled)
// - gestion de la fermeture de la tooltip en passant la souris dessus
// 3.1.1 (17/01/2020) :
// - gestion de la fermeture de la tooltip en cliquant n'importe où
// 3.1.0 (13/01/2020) :
// - passage à un textarea au lieu de l'input pour l'édition (pour plus de place)
// - légère augmentation du delai d'affichage de la tooltip (400 -> 450)
// - meilleur gestion de la taille pour le message d'edition impossible ici
// - meilleur gestion de la fermeture de la tooltip à l'affichage de la popup
// - fermeture de la tooltip avec la touche echap (comme la popup)
// - ajout d'une option en dur pour ajouter une espace finale dans la popup d'edition ->
// (pour faciliter l'ajout de nouveaux mots-clés) désactivé par défaut
// 3.0.0 (12/01/2020) :
// - refonte, réécriture, modernisation, sécurisation
// - nouveau nom : [HFR] édition rapide du wiki smileys mod_r21 -> [HFR] Edition du wiki partout mod_r21
// - ajout de l'avis de licence AGPL v3+ *si toyonos est d'accord*
// - maj de la metadata @homepageURL
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (toyonos)
// - réécriture des metadata @description, @modifications et @modtype
// - suppression des @grant inutiles
// 2.1.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 2.1.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.1.0 (23/04/2018) :
// - gestion des pages ne permettant pas l'édition (au lieu d'une erreur fatale)
// - correction du passage au https (pour la page des profils)
// - petites corrections de code et check du code dans tm
// 2.0.1 (28/11/2017) :
// - passage au https
// 2.0.0 (11/11/2016) :
// - nouveau numéro de version : 0.1.3.10 -> 2.0.0
// - nouveau nom : [HFR] Edition rapide du Wiki smilies -> [HFR] édition rapide du wiki smileys mod_r21
// - compression des images (pngoptimizer)
// - genocide de lignes vides et de commentaires ([:roger21:2])
// - remplacement des ' par des " (pasque !)
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 0.1.3.10 (09/11/2016) :
// - corection de la xpath query pour ne pas prendre en compte les smileys tempo
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.1.3.9 (15/05/2015) :
// - ajout du support pour les posts de modération (rose)
// - leger reformatage de certain bouts de code
// 0.1.3.8 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.1.3.7 (20/02/2015) :
// - désactivation de l'edition si le smiley est dans un lien
// 0.1.3.6 (21/01/2015) :
// - suppression d'un include inutile
// - amelioration de la position de la popup d'edition rapide
// - decoupage des lignes de code trop longue
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - reencodage des images en base64
// - suppression du module d'auto-update (code mort)
// 0.1.3.5 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.1.3.4 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.1.3.3 (14/09/2012) :
// - ajout des metadata @grant
// 0.1.3.1 à 0.1.3.2 (07/12/2011) :
// - ajout de l'affichage des mots-clés sur la page des profils (avec minipouss)
// - suppression de la popup de validation
// - changement du message de confirmation
// - réduction du délais d'affichage de la popup de confirmation
// - désactivation du message d'erreur XML dans la toyolib
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

/* -------------- */
/* options en dur */
/* -------------- */

// affichage des mots-clés dans le title/tooltip des smileys (true) ou dans un tooltip/popup en html (false)
const in_title = false;

// activer les box-shadow (true) ou pas (false)
const box_shadow = true;

// ajouter une espace finale dans la popup d'édition (true) ou pas (false)
const add_final_space = false;

/* ------------------------------- */
/* gestion de la compatibilité gm4 */
/* ------------------------------- */

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

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var access_keywords_last_call = 0;
var access_keywords_timer;
var click_smiley_last_call = 0;
var click_smiley_timer;
var keywords_tooltip_timer;
var tooltip_canceled = false;

/* -------------- */
/* les constantes */
/* -------------- */

const script_name = "[HFR] Edition du wiki partout";
const smileys_persos_url = "https://forum-images.hardware.fr/images/perso/";
const query_smileys_persos =
  "img[alt][src^=\"" + smileys_persos_url + "\"]:not([src*=\"/tempo/\"]):not([onload]):not([data-edwi-done])";
const hash_check_input = document.querySelector("input[type=\"hidden\"][name=\"hash_check\"]");
var hash_check = hash_check_input ? hash_check_input.value.trim() : "";
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
  // styles pour la tooltip
  "div#gm_hfr_edwi_r21_keywords_tooltip{position:absolute;max-width:350px;height:auto;padding:4px 8px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border-radius:10px;font-size:11px;border:1px solid;" +
  "background:linear-gradient(#ffffff, #f7f7ff);left:0;top:0;text-align:justify;color:#000000;display:none;" +
  "z-index:1005;cursor:default;}" +
  // styles pour la popup
  "div#gm_hfr_edwi_r21_keywords_popup{display:none;position:absolute;left:0;top:0;width:auto;height:auto;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;padding:4px;overflow:auto;" +
  "resize:both;min-width:356px;min-height:70px;background:linear-gradient(#ffffff, #f7f7ff);color:#000000;" +
  "z-index:1006;}" +
  "div#gm_hfr_edwi_r21_keywords_popup.gm_hfr_edwi_r21_keywords_no_edit" +
  "{resize:none;width:416px;min-height:30px;height:30px;}" +
  "div.gm_hfr_edwi_r21_keywords_nothing{display:flex;justify-content:center;align-items:center;cursor:pointer;" +
  "width:auto;height:100%;}" +
  "span.gm_hfr_edwi_r21_keywords_text{display:block;font-size:14px;}" +
  "textarea.gm_hfr_edwi_r21_keywords_textarea{margin:0;padding:1px 2px;border:1px solid #c0c0c0;" +
  "font-size:11px;font-family:Verdana,Arial,Sans-serif,Helvetica;display:block;width:calc(100% - 6px);" +
  "height:calc(100% - 24px);background:transparent;resize:none;overflow:auto;}" +
  "div.gm_hfr_edwi_r21_keywords_div{margin-top:4px;height:16px;}" +
  "span.gm_hfr_edwi_r21_keywords_span{font-size:11px;color:#707070;padding:0 0 0 1px;cursor:default;" +
  "display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:auto;}" +
  "span.gm_hfr_edwi_r21_keywords_span_link{cursor:pointer;}" +
  "img.gm_hfr_edwi_r21_keywords_throbber{display:none;float:right;padding:0 15px 0 0;cursor:default;}" +
  "div.gm_hfr_edwi_r21_keywords_answer{display:none;float:right;text-align:right;font-size:11px;" +
  "color:#ff0000;font-weight:bold;padding:0 15px 0 0;cursor:default;}" +
  "div.gm_hfr_edwi_r21_keywords_answer.gm_hfr_edwi_r21_success{color:#007f00;}" +
  "div.gm_hfr_edwi_r21_keywords_answer.gm_hfr_edwi_r21_wait{color:#ff7f00;}" +
  "div.gm_hfr_edwi_r21_keywords_buttons{float:right;text-align:right;padding:0 15px 0 0;}" +
  "div.gm_hfr_edwi_r21_keywords_buttons > img{margin-left:8px;cursor:pointer;}";
if(box_shadow) {
  style.textContent += "div#gm_hfr_edwi_r21_keywords_tooltip, div#gm_hfr_edwi_r21_keywords_popup" +
    "{box-shadow:4px 4px 4px 0 rgba(0, 0, 0, 0.4);}";
}
document.getElementsByTagName("head")[0].appendChild(style);

/* ------------------------------------------------ */
/* création de la tooltip d'affichage des mots-clés */
/* ------------------------------------------------ */

// création de la tooltip d'affichage des mots-clés
var keywords_tooltip = document.createElement("div");
keywords_tooltip.setAttribute("id", "gm_hfr_edwi_r21_keywords_tooltip");
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
    access_keywords(get_keywords, function(p_smiley_img, p_keywords) {
      if(tooltip_canceled) {
        return;
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
keywords_popup.setAttribute("id", "gm_hfr_edwi_r21_keywords_popup");
var keywords_nothing = document.createElement("div");
keywords_nothing.setAttribute("class", "gm_hfr_edwi_r21_keywords_nothing");
keywords_nothing.setAttribute("title", script_name);
keywords_nothing.addEventListener("click", hide_popup, false);
var keywords_text = document.createElement("span");
keywords_text.setAttribute("class", "gm_hfr_edwi_r21_keywords_text");
keywords_text.textContent = "Vous devez vous identifier pour modifier les mots-clés.";
keywords_nothing.appendChild(keywords_text);
keywords_popup.appendChild(keywords_nothing);
var keywords_textarea = document.createElement("textarea");
keywords_textarea.setAttribute("class", "gm_hfr_edwi_r21_keywords_textarea");
keywords_textarea.setAttribute("type", "text");
keywords_textarea.setAttribute("spellcheck", "false");
keywords_popup.appendChild(keywords_textarea);
var keywords_div = document.createElement("div");
keywords_div.setAttribute("class", "gm_hfr_edwi_r21_keywords_div");
var keywords_span = document.createElement("span");
keywords_span.setAttribute("class", "gm_hfr_edwi_r21_keywords_span");
keywords_span.textContent = "Mots-clés de ";
keywords_span.setAttribute("title", script_name);
var keywords_span_link = document.createElement("span");
keywords_span_link.setAttribute("class", "gm_hfr_edwi_r21_keywords_span_link");
keywords_span_link.setAttribute("title", "Page du smiley sur le wiki");
keywords_span_link.addEventListener("mousedown", prevent_default, false);
keywords_span_link.addEventListener("mouseup", open_wiki, false);
keywords_span.appendChild(keywords_span_link);
keywords_div.appendChild(keywords_span);
var keywords_throbber = document.createElement("img");
keywords_throbber.setAttribute("class", "gm_hfr_edwi_r21_keywords_throbber");
keywords_throbber.setAttribute("src", img_throbber);
keywords_div.appendChild(keywords_throbber);
var keywords_answer = document.createElement("div");
keywords_answer.setAttribute("class", "gm_hfr_edwi_r21_keywords_answer");
keywords_div.appendChild(keywords_answer);
var keywords_buttons = document.createElement("div");
keywords_buttons.setAttribute("class", "gm_hfr_edwi_r21_keywords_buttons");
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
      keywords_answer.classList.add("gm_hfr_edwi_r21_success");
    } else if(p_answer === "attendez 5 min") {
      keywords_answer.classList.add("gm_hfr_edwi_r21_wait");
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
  let l_popup_width = 366;
  let l_popup_height = 80;
  if(hash_check === "") {
    l_popup_width = 426;
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
    keywords_popup.classList.remove("gm_hfr_edwi_r21_keywords_no_edit");
    keywords_popup.style.width = "356px";
    keywords_popup.style.height = "70px";
    keywords_nothing.style.display = "none";
    keywords_textarea.value = "";
    keywords_textarea.style.display = "block";
    keywords_span_link.textContent = l_code;
    keywords_span.style.width = "auto";
    keywords_throbber.style.display = "none";
    keywords_answer.textContent = "";
    keywords_answer.classList.remove("gm_hfr_edwi_r21_success");
    keywords_answer.classList.remove("gm_hfr_edwi_r21_wait");
    keywords_answer.style.display = "none";
    keywords_buttons.style.display = "block";
    keywords_div.style.display = "block";
    // récupération des mots-clés et affichage de la popup
    access_keywords(get_keywords, function(p_smiley_img, p_keywords) {
      keywords_textarea.value = add_final_space ? p_keywords + " " : p_keywords;
      keywords_textarea.selectionStart = 0;
      keywords_textarea.selectionEnd = 0;
      // fermeture de la tooltip (pour plus de clareté)
      hide_tooltip();
      // affichage de la popup
      keywords_popup.style.display = "block";
    }, l_smiley_img);
  }
  // l'édition des mots-clés n'est pas possible ici (affichage du texte idoine)
  else {
    // initialisation de la popup
    keywords_popup.classList.add("gm_hfr_edwi_r21_keywords_no_edit");
    keywords_textarea.style.display = "none";
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

// fonction de fermeture de le tooltip d'affichage et de la popup d'édition par la touche echap
function esc_popup(p_event) {
  if(p_event.key === "Escape") {
    hide_tooltip();
    hide_popup();
  }
}
document.addEventListener("keydown", esc_popup, false);

// fonction de gestion du double-clic sur les smileys (édition des mots-clés)
function edit_keywords(p_event) {
  p_event.stopPropagation();
  let l_click_smiley_last_call = Date.now();
  if((l_click_smiley_last_call - click_smiley_last_call) < click_smiley_time) {
    show_popup(p_event);
  }
  click_smiley_last_call = l_click_smiley_last_call;
}

// fonction de gestion du (double-)clic sur les smileys du wiki en réponse normale
// (insertion du smiley ou édition des mots-clés)
function insert_or_edit_keywords(p_event) {
  window.clearTimeout(click_smiley_timer);
  let l_click_smiley_last_call = Date.now();
  if((l_click_smiley_last_call - click_smiley_last_call) < click_smiley_time) {
    show_popup(p_event);
  } else {
    click_smiley_timer = window.setTimeout(unsafeWindow.putSmiley, click_smiley_time,
      this.getAttribute("alt"), this.getAttribute("src"));
  }
  click_smiley_last_call = l_click_smiley_last_call;
}

// fonction de gestion du mouseover sur les smileys (affichage des mots-clés dans le title)
function update_title(p_event) {
  access_keywords(get_keywords, function(p_smiley_img, p_keywords) {
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
    } else {
      console.log(script_name + " ERROR set_keywords : ", p_text);
      p_callback("error");
    }
  }).catch(function(e) {
    console.log(script_name + " ERROR fetch set_keywords : ", e);
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
    p_callback(p_smiley_img, l_keywords);
  }).catch(function(e) {
    console.log(script_name + " ERROR fetch get_keywords : ", e);
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

/* ---------------------------------------------------------------------- */
/* recherche des smileys persos dans la page et ajout des fonctionnalités */
/* ---------------------------------------------------------------------- */

// traitement particulier des smileys persos de la page des profils
var brs_smileys = document.querySelectorAll("body#unique__user_page__view_user_profile table.main tr.profil " +
  "td.profilCase4 br");
for(let l_br of brs_smileys) {
  l_br.parentNode.removeChild(l_br);
}
var smileys_profil = document.querySelectorAll("body#unique__user_page__view_user_profile table.main tr.profil " +
  "td.profilCase4 " + query_smileys_persos);
for(let l_smiley of smileys_profil) {
  l_smiley.setAttribute("alt", l_smiley.previousSibling.nodeValue.trim());
  l_smiley.setAttribute("title", l_smiley.previousSibling.nodeValue.trim());
  l_smiley.previousSibling.nodeValue = " ";
  l_smiley.setAttribute("data-edwi-done", "true");
  if(in_title) {
    l_smiley.addEventListener("mouseover", update_title, false);
  } else {
    l_smiley.removeAttribute("title");
    l_smiley.addEventListener("mouseover", show_tooltip, false);
    l_smiley.addEventListener("mouseout", hide_tooltip, false);
  }
  l_smiley.addEventListener("click", edit_keywords, false);
}

// gestion particulière des smileys persos du wiki de la page de réponse / édition normale
var wiki_smiley = document.querySelector("table.main tr.reponse th.repCase1 div.center div#dynamic_smilies");
if(wiki_smiley) {
  function update_smileys_wiki() {
    let l_smileys = wiki_smiley.querySelectorAll(query_smileys_persos);
    for(let l_smiley of l_smileys) {
      l_smiley.setAttribute("data-edwi-done", "true");
      l_smiley.removeAttribute("onclick");
      if(in_title) {
        l_smiley.addEventListener("mouseover", update_title, false);
      } else {
        l_smiley.removeAttribute("title");
        l_smiley.addEventListener("mouseover", show_tooltip, false);
        l_smiley.addEventListener("mouseout", hide_tooltip, false);
      }
      l_smiley.addEventListener("click", insert_or_edit_keywords, false);
    }
  }
  update_smileys_wiki();
  var observer_wiki = new MutationObserver(update_smileys_wiki);
  observer_wiki.observe(wiki_smiley, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: false,
  });
}

// traitement des autres smileys persos du forum (en cherchant a ne pas inclure les smileys rajoutés par
// d'autres scripts pour éviter des conflits ou des incohérences)
// - aperçu normal de la réponse / édition normale (en frame, ne marche pas avec gm4 yet)
// - les posts
// - les pages du wiki (oui c'est con mais ça dérange pas :o)
var smileys_page = document.querySelectorAll("body#mesdiscussions.reponse " + query_smileys_persos + ", " +
  "div#mesdiscussions.mesdiscussions table.messagetable tbody tr.message td.messCase1 + td.messCase2 " +
  "div[id^='para'] " + query_smileys_persos + ", body#unique__other_page__wikismilies " + query_smileys_persos);
for(let l_smiley of smileys_page) {
  l_smiley.setAttribute("data-edwi-done", "true");
  if(in_title) {
    l_smiley.addEventListener("mouseover", update_title, false);
  } else {
    l_smiley.removeAttribute("title");
    l_smiley.addEventListener("mouseover", show_tooltip, false);
    l_smiley.addEventListener("mouseout", hide_tooltip, false);
  }
  l_smiley.addEventListener("click", edit_keywords, false);
}

/* ------------------------------------------- */
/* enregistrement / restauration du hash_check */
/* ------------------------------------------- */

if(hash_check === "") {
  GM.getValue("hash_check", "").then(function(p_hash_check) {
    hash_check = p_hash_check;
  });
} else {
  GM.setValue("hash_check", hash_check);
}
