// ==UserScript==
// @name          [HFR] Black List mod_r21
// @version       3.5.7
// @namespace     roger21.free.fr
// @description   Permet de filtrer les posts des utilisateurs.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*/*-sujet_*_*.htm*
// @author        roger21
// @authororig    nykal
// @modifications Refonte du code, simplification de l'interface, compatibilité GM4, gestion de la liste via GM au lieu des cookies et gestion des messages contenant une citation bloquée.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_black_list_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_black_list_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_black_list_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// ==/UserScript==

/*

Copyright © 2011, 2014-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1751 $

// historique :
// 3.5.7 (12/03/2020) :
// - adaptation du code de détection des quotes pour fonctionner avec [HFR] Chat
// 3.5.6 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 3.5.5 (11/01/2020) :
// - mise à jour des images des boutons de l'interface
// 3.5.4 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 3.5.3 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 3.5.2 (28/11/2018) :
// - correction d'erreurs signalées par tm (problème de déclaration des variables)
// 3.5.1 (06/11/2018) :
// - gestion de la redirection quote -> post pour les posts masqués, signalé par Heeks
// 3.5.0 (25/10/2018) :
// - nouveau nom : [HFR] black liste mod_r21 -> [HFR] Black List mod_r21
// - ajout de l'avis de licence AGPL v3+ *si nykal est d'accord*
// - gestion de la compatibilité gm4
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (nykal)
// - maj de la metadata @homepageURL
// - réécriture des metadata @description, @modifications et @modtype
// - suppression du code de migration des cookies
// - suppression des @grant inutiles
// - meilleur (?) gestion des includes
// - fermeture des fenêtres en cliquant en dehors
// 3.3.4 (25/10/2018) :
// - meilleur gestion de la recherche des pseudo (et compatibilité avec [HFR] ColorTag)
// - ne cherche plus à gérer les fausses quotes (et ne plante plus sur les quotes instagram ou twitter)
// 3.3.3 (09/03/2018) :
// - nouveau pattern pour les messages contenant une citation bloquée
// - ajustement du contraste des patterns
// 3.3.2 (09/03/2018) :
// - compression des images des patterns [:roger21:2]
// 3.3.1 (09/03/2018) :
// - changement de la couleur de fond par un pattern pour les contenus affichés manuellement
// 3.3.0 (08/03/2018) :
// - ajout d'une couleur de fond sur les contenus affichés manuellement
// - correction pour la gestion des multiquotes
// - correction de la récupération du pseudo dans les quotes sans lien
// 3.2.0 (07/03/2018) :
// - gestion des quotes sans lien (fausses quotes)
// - gestion des quotes imbriquées (sécurisation des querySelector)
// 3.1.0 (07/03/2018) :
// - homogénéisation des actions : chaque action reinitialise le masquage des contenus affichés manuellement
// - maj de la metadata @modifications
// 3.0.0 (06/03/2018) :
// - gestion du masquage des messages contenant une citation bloquée
// - petites améliorations des curseurs et des tooltips dans les fenêtres
// 2.2.2 (28/11/2017) :
// - passage au https
// 2.2.1 (07/10/2017) :
// - adaptation de l'ajout du bouton en haut pour cohabiter avec [HFR] Multi MP
// 2.2.0 (05/08/2017) :
// - reduction des warnings et fausses erreurs dans l'editeur tampermonkey
// - suppression du title sur le bouton du pseudal (pas gérable)
// 2.1.0 (02/08/2017) :
// - permet de black lister Profil supprimé et Modération
// - support des citations de [HFR] toyonos
// 2.0.0 (01/08/2017) :
// - passage de la sauvegarde en cookies à une sauvegarde standard par greasemonkey ->
// avec gestion de la conversion des cookies si présents
// - refonte complète du code et simplification de l'interface
// - nouveau numéro de version : 0.7.0.7 -> 2.0.0
// - nouveau nom : [HFR] Black List -> [HFR] black liste mod_r21
// 0.7.0.7 (24/07/2016) :
// - ajout d'un bout de code commenté permettant de masquer les posts contenants un quote d'une ->
// personne blacklistée, à décommenter pour activer (moyennement testé) pour leroimerlinbis
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.7.0.6 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.7.0.5 (24/01/2015) :
// - suppression/réorganisation de certaines lignes vides et de certains commentaires
// - compactage du css
// - decoupage des lignes de code trop longue
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - suppression du module d'auto-update (code mort)
// - arret de la publication, toyo ayant corrigé le bug
// 0.7.0.4 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.7.0.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.7.0.2 (14/09/2012) :
// - ajout des metadata @grant
// 0.7.0.1 (28/11/2011) :
// - correction du bug d'affichage de l'image d'un bouton dans la fenêtre de contrôle
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

// compatibilité gm4
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

// récupération des paramètres
Promise.all([
  GM.getValue("masquage_complet", false),
  GM.getValue("messages_avec_citation", false),
  GM.getValue("ignore_list", "[]"),
]).then(function([
  masquage_complet,
  messages_avec_citation,
  ignore_list,
]) {
  let root = document.querySelector("div#mesdiscussions.mesdiscussions");
  if(root) {

    // la black list
    let blacklist = JSON.parse(ignore_list);

    // icônes et boutons
    let img_blacklist = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAPCAAAAAAXVmrsAAAAAnRSTlMAAHaTzTgAAAA4SURBVHjaY2CAgLVgAg6AbFYQOMbKCmMDmXA2K4x9DAiAMtjEgRhTnBUsTLz6tWshNiAcd2ztWgBEsTPkB3369AAAAABJRU5ErkJggg%3D%3D";
    let img_ok = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
    let img_cancel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
    let img_add = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACeUlEQVR42rWQb0hTYRTG7UNJka1tjRAEYyFYsShUggqxsclyasKCWTPbzPwz0XAUalPDsraWOrFs1pbKcN6tmTEtzSkZZGSxlX%2BG0KdBWYTQwFIXKvfp3kuIQky%2F9MDDOe%2FL%2B%2FzO4Q0L%2Bx9SJ%2Byqqpdw5hqlO2GQsFAlZM8r4ni1Gwrnx3HK7qezSXMmBw8o35WxoUthoTRxByk9yK1ZF2CSstBGBQ1USCelzcbNVB6unOAgK441uy5Al7gdL0yVmO43YNRSipIkHjSiSBSJ%2Bcg7xl60lqeFhwSYs6N%2FBL9%2FwuwbE74ONmDccQ3%2B57cR8HtBFOydnWhXbwkJaFLsHwm878SMx4mFMYKynekDXgIPcwSekOHdUtvmmONqK1Ecj98eC4K%2Bp4wXPtrQfTkegsSCJzyxees%2Fw7wUIpwr6SiMkgzB93kODm067No0xnT%2FeuoXopJfgiN8dIkrbNm2Jsw96dgUkexQRqeOYGp6AR3TgMYHFL4DLrwCzvcB5c5uaExK5DWcgvyGMCgpO1S9Ajgga80QnTbAObqMlnGg%2BC2JgmESuQMksl0kVGYCNU4VnvmaMfbNDeOgGnKjAEeKIusYwIfK2OWZ3nLca%2B2Fsp%2BaSk1U9ZA410XijI2q%2BhS4JhvhmmoCrbqhizAO5dOAIAMYr9pHBtzXkZnXhtrBeSi6gLN2EnIrCZmFRKr2MPp8FqxWz0QzDQADmLQWV3grYpZUqltLCcphqKjVc1b5aAkfd9w50LmVTFg3oFy7AS2%2FvTCi%2Bmotd09Gb0t0UvsXvvjxPD%2B5a5Evci4K5FlLsrpY1Ltzmcl0pc8rf7ARUY%2F1lH%2FSa%2F%2Btevr%2BD5zsjQszBEUQAAAAAElFTkSuQmCC";
    let img_remove = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACjUlEQVR42rWTa0jTURiHlbmki61tjQqM5UrKwr6onyqxtb8s50Qy0DIvU7GprFAs70liSgtDLNPyytC2NdNK1Hkpi6xMnGWJ0Ica5YowWkhuirPz6zhIDEL90gs%2FzsuB53lfDhwXl%2F9RqQGbC8qkvOly2SaopRwUiLm2aD9B8arg0368rBthXFITxcNNmmsRXJSGcJAeuJHI9vMvriioknHQQEE1hUplC%2BHiUqgA5w7zcMqPM7WioDRwA4xV%2BbB0qTFYm44zQQJkSLYhjREh%2BQB3TpMtd19WUBMr%2FD7z9R2mnlXhc%2B9VjOoLYe64DKvZBK1y59SbxtQ1ywoqovcOWIduY3LYAPtrLY3O2VtNWtxK8B1eFt4ia2Z7H0zVaFX%2BmB2uxcxYmzP2V81ozfSHb6DyroCpWftPWBCidedLm1I8pX0Y%2BzQNfV4YdHlyZxb6p%2BM%2F4Rn8CDxx3Vm%2BuHrdXzD%2FqN7VI1gfLwwdwLjFjiYLkDEGpLwEEh8DcZ1AY3klnsT4oFfMxj1mvbWTYecuCvZF1IdLjqthGJxH9SigekGg7CdI6iaIvU9wpagSI5mHMNNRBjJuhE2XgaE03189R9xUTsFI%2Fp75yfZsXK9vR3wXnUonKh4QxLQQnGgmMITvgp3CqJADWVygxAvf1EHolrA%2BOAWjBT7E2lOEqOQGFPfaEN0CnNQRRGoIImoJ%2BujaxNSKpfWjcCu9dyNOwVuNKseU4%2B1QKEocAfH9UNDVE5ak7ZgQ03WJAIVmz7vASvNRyUI3w7IsvoNZl%2BJxIbeYvyO8vVoY1DghYu7YRMEtcyKJYS4zNM7xPHE3vmR5YTKHjfdJrngod5s3MqzcVf%2FQgcjt2XSieWFtek78gX8DzXKLfuxv8GoAAAAASUVORK5CYII%3D";
    let img_bkgnd = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAABGklEQVR42u3ZQQqDMBRFUSfZirvPNrKukoHyQUP1N4NQzoGATsPlUeq2AQAAAAAAAAAAAAAAAAAAAAAAAAAAAADAF7XW3S2QjufJcVO8DquUcjmttfNZWEwJK0YlLKYulrCYElZfqXjicgkLi8W6ixXfhYXFYs2w7tZKWFgs%2FMbCYgmLfFjHN8HR%2F1luilRco9Oj8iEaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB%2BUGvd3QLpeJ4cN8XrsEopl9NaO5%2BFxZSwYlTCYupiCYspYfWViicul7CwWKy7WPFdWFgs1gzrbq2EhcXCbywslrDIh3V8Exz9n%2BWmSMU1Oj0qH6IBAAAAAAAAAAAAAPgXH8XjYT4KbLBkAAAAAElFTkSuQmCC";
    let img_bkgnd_with_quote = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAADwUlEQVR42u3ayYpiTRCG4b7nuIXa1z2IA46gOKOU84BFleKIC3UhKoJQi3Iox58IcNc0nq7mh6bfB4I8ylklH5mRyfnxAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwzwuHwxIIBMTv99uoFQwGJRKJyNPTk5RKJWGW4Fgmk5Hb7fbTWq%2FXEgqFpFgsEi44k06nfxms%2FX4vqVRKkskk4cKfCdZyuZTNZmMBSyQStnoxY%2Fj2VjibzaTT6cjLy4tEo1F5fn4mWHAerI%2BPD2k0GlIul6VWq9m4Wq3keDzK9XoVfZcZw7dXLK3z%2BWzBulwu1msxY3hINpu1APX7fel2u9Lr9WQ0GslgMJBmsynv7%2B8ynU4tYAQLjoOlYRqPxzIcDi1gGjR9fnt7k8ViYcHiZIiH5XI5C5auTlr1el1arZY9t9ttmUwm8vn5adthPB4nWHAWrK%2BvL%2BujdNS7q91uZ%2BN2u7UiWPitrfD19VUqlYqtWFq6YhUKBTsd5vN5CxzBguNTofZXWvfeSvssvcPS7VB%2FHw4HicViBAuP0Zt33QKr1ao16Vrz%2BdwuR7X0RKijbot6ScqM4eFg3e%2BrtE6nk5X2VLr93Xsu%2FY8VCw%2FTz2b0kxmfz2fl9XqtPB6PuN1uK5fLZaO%2Bx4wBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2BNuFw2EJBALi9%2Ftt1AoGgxKJROTp6UlKpZIwS3Ask8nI7Xb7aa3XawmFQlIsFgkXnEmn078M1n6%2Fl1QqJclkknDhzwRruVzKZrOxgCUSCVu9mDF8eyuczWbS6XTk5eVFotGoPD8%2FEyw4D9bHx4c0Gg0pl8tSq9VsXK1Wcjwe5Xq9ir7LjOHbK5bW%2BXy2YF0uF%2Bu1mDE8JJvNWoD6%2Fb50u13p9XoyGo1kMBhIs9mU9%2Fd3mU6nFjCCBcfB0jCNx2MZDocWMA2aPr%2B9vclisbBgcTLEw3K5nAVLVyeter0urVbLntvttkwmE%2Fn8%2FLTtMB6PEyw4C9bX15f1UTrq3dVut7Nxu91aESz81lb4%2BvoqlUrFViwtXbEKhYKdDvP5vAWOYMHxqVD7K617b6V9lt5h6Xaovw%2BHg8RiMYKFx%2BjNu26B1WrVmnSt%2BXxul6NaeiLUUbdFvSRlxvBwsO73VVqn08lKeyrd%2Fu49l%2F7HioWH6Wcz%2BsmMz%2Bez8nq9Vh6PR9xut5XL5bJR32PGAAAAAAAAAAAAAAAAAAAAAPyP%2FgN6xFwlEUspjwAAAABJRU5ErkJggg%3D%3D";

    // styles css
    let style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.textContent = ".hfrCitationListeNoire, .hfrMessageListeNoire, .hfrMessageAvecCitationListeNoire, " +
      ".hfrMasquageComplet{display:none;} div#mesdiscussions.mesdiscussions table.none tbody tr td div.left " +
      "div.left{padding-left:10px;padding-right:10px;} div#hfrBlackListManagement table, " +
      "div#hfrBlackListManagement table td{border:none;} .hfrStyleListeNoire" +
      "{background-image:url(" + img_bkgnd + ");} " +
      ".hfrStyleMessageAvecCitationListeNoire{background-image:url(" + img_bkgnd_with_quote + ");} " +
      "td.messCase1 div.colortag.right{margin-left:3px;}";
    document.getElementsByTagName("head")[0].appendChild(style);

    // position de la fenêtre de gestion
    let divBlackListManagementPosition;

    // ajoute les boutons (en haut du tableau et à côté des pseudos)
    function addButtons() {
      // ajoute le bouton en haut du tableau si le liem des mp existe
      let mp = root.querySelector("table.none > tbody > tr > td > div.left");
      if(mp !== null) {
        let divListeNoire = document.createElement("div");
        divListeNoire.setAttribute("class", "left");
        let imgListenoire = document.createElement("img");
        imgListenoire.setAttribute("src", img_blacklist);
        imgListenoire.style.verticalAlign = "bottom";
        divListeNoire.appendChild(imgListenoire);
        divListeNoire.appendChild(document.createTextNode("\u00a0"));
        let aListeNoire = this.document.createElement("a");
        aListeNoire.setAttribute("class", "s1Ext hfrLinkListeNoire");
        aListeNoire.setAttribute("href", "javascript:void(null);");
        aListeNoire.appendChild(document.createTextNode("Liste\u00a0noire"));
        aListeNoire.addEventListener("click", displayBlackListManagement, false);
        divListeNoire.appendChild(aListeNoire);
        mp.appendChild(divListeNoire);
      }
      // ajoute le bouton à coté des pseudos
      let pseudos = root.querySelectorAll("table.messagetable > tbody > tr > td.messCase1 > " +
        "div:not([postalrecall]) > b.s2");
      for(let pseudo of pseudos) {
        // construction du bouton
        let divListeNoirePseudo = document.createElement("div");
        divListeNoirePseudo.setAttribute("class", "right");
        let imgListenoirePseudo = document.createElement("img");
        imgListenoirePseudo.setAttribute("src", img_blacklist);
        imgListenoirePseudo.style.verticalAlign = "bottom";
        imgListenoirePseudo.style.cursor = "pointer";
        imgListenoirePseudo.style.marginRight = "1px";
        imgListenoirePseudo.style.marginLeft = "3px";
        // ouverture de la fenetre de confiramtion/gestion sur le clic du bouton
        imgListenoirePseudo.addEventListener("click", displayBlackListQuestion, false);
        divListeNoirePseudo.appendChild(imgListenoirePseudo);
        pseudo.parentElement.parentElement.insertBefore(divListeNoirePseudo, pseudo.parentElement);
      }
    }

    // affichage de la fenêtre de gestion de la black liste
    function displayBlackListManagement(event) {
      if(typeof event !== "undefined") {
        event.preventDefault();
        event.stopPropagation();
        divBlackListManagementPosition = {
          top: (window.pageYOffset + event.clientY + 8) + "px",
          left: (event.clientX + 8) + "px"
        };
      }
      // suppression des fenêtres ouvertes
      hidePopups();
      // construction de la fenêtre
      let divBlackListManagement = document.createElement("div");
      divBlackListManagement.setAttribute("id", "hfrBlackListManagement");
      divBlackListManagement.style.position = "absolute";
      divBlackListManagement.style.border = "1px solid grey";
      divBlackListManagement.style.padding = "8px";
      divBlackListManagement.style.background = "white";
      divBlackListManagement.style.zIndex = "1001";
      divBlackListManagement.style.fontSize = "8pt";
      divBlackListManagement.style.textAlign = "left";
      divBlackListManagement.style.cursor = "default";
      let divTitle = document.createElement("div");
      divTitle.style.fontWeight = "bold";
      divTitle.appendChild(document.createTextNode("Gestion de la liste noire"));
      let inputClose = document.createElement("input");
      inputClose.setAttribute("type", "image");
      inputClose.setAttribute("src", img_cancel);
      inputClose.style.display = "block";
      inputClose.style.float = "right";
      inputClose.style.marginLeft = "8px";
      inputClose.setAttribute("title", "Fermer");
      inputClose.addEventListener("click", function() {
        hidePopups();
      }, false);
      divTitle.appendChild(inputClose);
      divBlackListManagement.appendChild(divTitle);
      let tableList = document.createElement("table");
      tableList.style.marginTop = "8px";
      tableList.style.borderCollapse = "collapse";
      let trWithQuote = document.createElement("tr");
      trWithQuote.setAttribute("title", "Masquer les messages contenant une citation bloquée");
      let tdLabelWithQuote = document.createElement("td");
      tdLabelWithQuote.style.verticalAlign = "bottom";
      let labelWithQuote = document.createElement("label");
      labelWithQuote.setAttribute("for", "hfrInputWithQuote");
      labelWithQuote.style.cursor = "pointer";
      labelWithQuote.appendChild(document.createTextNode("Messages avec citation :"));
      tdLabelWithQuote.appendChild(labelWithQuote);
      trWithQuote.appendChild(tdLabelWithQuote);
      let tdInputWithQuote = document.createElement("td");
      tdInputWithQuote.style.textAlign = "right";
      let inputWithQuote = document.createElement("input");
      inputWithQuote.setAttribute("type", "checkbox");
      inputWithQuote.setAttribute("id", "hfrInputWithQuote");
      inputWithQuote.style.margin = "0 1px 0 8px";
      inputWithQuote.style.verticalAlign = "bottom";
      inputWithQuote.style.cursor = "pointer";
      inputWithQuote.checked = messages_avec_citation;
      inputWithQuote.addEventListener("change", function() {
        hidePosts();
        hideQuotes();
        messages_avec_citation = this.checked;
        GM.setValue("messages_avec_citation", messages_avec_citation);
        hidePosts();
        hideQuotes();
        showPostsWithQuote();
      }, false);
      tdInputWithQuote.appendChild(inputWithQuote);
      trWithQuote.appendChild(tdInputWithQuote);
      tableList.appendChild(trWithQuote);
      let trFullHide = document.createElement("tr");
      trFullHide.setAttribute("title", "Masquer complètement les messages et les citations bloquées");
      let tdLabelFullHide = document.createElement("td");
      tdLabelFullHide.style.verticalAlign = "bottom";
      let labelFullHide = document.createElement("label");
      labelFullHide.setAttribute("for", "hfrInputFullHide");
      labelFullHide.style.cursor = "pointer";
      labelFullHide.appendChild(document.createTextNode("Masquage complet :"));
      tdLabelFullHide.appendChild(labelFullHide);
      trFullHide.appendChild(tdLabelFullHide);
      let tdInputFullHide = document.createElement("td");
      tdInputFullHide.style.textAlign = "right";
      let inputFullHide = document.createElement("input");
      inputFullHide.setAttribute("type", "checkbox");
      inputFullHide.setAttribute("id", "hfrInputFullHide");
      inputFullHide.style.margin = "0 1px 0 8px";
      inputFullHide.style.verticalAlign = "bottom";
      inputFullHide.style.cursor = "pointer";
      inputFullHide.checked = masquage_complet;
      inputFullHide.addEventListener("change", function() {
        masquage_complet = this.checked;
        GM.setValue("masquage_complet", masquage_complet);
        hidePosts();
        hideQuotes();
        let infos = document.querySelectorAll(".hfrInfoListeNoire");
        for(let info of infos) {
          info.classList.toggle("hfrMasquageComplet", masquage_complet);
        }
      }, false);
      tdInputFullHide.appendChild(inputFullHide);
      trFullHide.appendChild(tdInputFullHide);
      tableList.appendChild(trFullHide);
      let trAdd = document.createElement("tr");
      trAdd.setAttribute("title", "Ajouter un nouveau pseudo à la liste noire");
      let tdAddPseudo = document.createElement("td");
      tdAddPseudo.style.paddingTop = "6px";
      tdAddPseudo.style.paddingBottom = "2px";
      let inputPseudo = document.createElement("input");
      inputPseudo.setAttribute("type", "text");
      inputPseudo.style.fontSize = "8pt";
      inputPseudo.style.fontFamily = "Verdana,Arial,sans-serif,Helvetica";
      inputPseudo.style.padding = "1px 2px";
      tdAddPseudo.appendChild(inputPseudo);
      trAdd.appendChild(tdAddPseudo);
      let tdInputAdd = document.createElement("td");
      tdInputAdd.style.textAlign = "right";
      tdInputAdd.style.paddingTop = "6px";
      tdInputAdd.style.paddingBottom = "2px";
      let inputAdd = document.createElement("input");
      inputAdd.setAttribute("type", "image");
      inputAdd.setAttribute("src", img_add);
      inputAdd.style.marginLeft = "8px";
      inputAdd.addEventListener("click", function() {
        let pseudo = this.parentElement.parentElement.firstElementChild.firstElementChild.value.trim();
        if(pseudo !== "") {
          if(!isPseudoBlacklisted(pseudo)) {
            addToBlacklist(pseudo);
            hidePosts();
            hideQuotes();
            displayBlackListManagement();
          } else {
            alert("Ce pseudo est déjà présent dans la liste noire.");
          }
        }
      }, false);
      tdInputAdd.appendChild(inputAdd);
      trAdd.appendChild(tdInputAdd);
      tableList.appendChild(trAdd);
      for(let pseudo of blacklist) {
        let trRemove = document.createElement("tr");
        trRemove.setAttribute("title", "Enlever " + pseudo + " de la liste noire");
        let tdRemovePseudo = document.createElement("td");
        tdRemovePseudo.style.verticalAlign = "bottom";
        tdRemovePseudo.appendChild(document.createTextNode(pseudo));
        tdRemovePseudo.style.cursor = "default";
        trRemove.appendChild(tdRemovePseudo);
        let tdInputRemove = document.createElement("td");
        tdInputRemove.style.textAlign = "right";
        let inputRemove = document.createElement("input");
        inputRemove.setAttribute("type", "image");
        inputRemove.setAttribute("src", img_remove);
        inputRemove.dataset.pseudo = pseudo;
        inputRemove.style.marginLeft = "8px";
        inputRemove.addEventListener("click", function() {
          let pseudo = this.dataset.pseudo;
          removeFromBlacklist(pseudo);
          hidePosts();
          hideQuotes();
          showPosts();
          showQuotes();
          displayBlackListManagement();
        }, false);
        tdInputRemove.appendChild(inputRemove);
        trRemove.appendChild(tdInputRemove);
        tableList.appendChild(trRemove);
      }
      divBlackListManagement.appendChild(tableList);
      // positionnement et affichage de la fenêtre
      divBlackListManagement.style.top = divBlackListManagementPosition.top;
      divBlackListManagement.style.left = divBlackListManagementPosition.left;
      divBlackListManagement.style.display = "block";
      root.appendChild(divBlackListManagement);
    }

    // affichage de la fenêtre d'ajout / suppression d'un pseudal
    function displayBlackListQuestion(event) {
      event.stopPropagation();
      let pseudoValue = this.parentElement.parentElement.querySelector("div > b.s2").firstChild.nodeValue;
      // suppression des fenêtres ouvertes
      hidePopups();
      // construction de la fenêtre
      let divBlackListQuestion = document.createElement("div");
      divBlackListQuestion.setAttribute("id", "hfrBlackListQuestion");
      divBlackListQuestion.style.position = "absolute";
      divBlackListQuestion.style.border = "1px solid grey";
      divBlackListQuestion.style.padding = "8px";
      divBlackListQuestion.style.background = "white";
      divBlackListQuestion.style.zIndex = "1001";
      divBlackListQuestion.style.cursor = "default";
      let divQuestion = document.createElement("div");
      divQuestion.style.fontSize = "8pt";
      let divValidation = document.createElement("div");
      divValidation.style.marginTop = "8px";
      divValidation.style.textAlign = "right";
      let inputOk = document.createElement("input");
      inputOk.setAttribute("type", "image");
      inputOk.setAttribute("src", img_ok);
      inputOk.setAttribute("title", "Valider");
      if(isPseudoBlacklisted(pseudoValue)) {
        divQuestion.appendChild(document.createTextNode("Enlever " + pseudoValue + " de la liste noire ?"));
        inputOk.addEventListener("click", function() {
          removeFromBlacklist(pseudoValue);
          hidePosts();
          hideQuotes();
          showPosts();
          showQuotes();
          hidePopups();
        }, false);
      } else {
        divQuestion.appendChild(document.createTextNode("Ajouter " + pseudoValue + " à la liste noire ?"));
        inputOk.addEventListener("click", function() {
          addToBlacklist(pseudoValue);
          hidePosts();
          hideQuotes();
          hidePopups();
        }, false);
      }
      let inputCancel = document.createElement("input");
      inputCancel.setAttribute("type", "image");
      inputCancel.setAttribute("src", img_cancel);
      inputCancel.style.marginLeft = "8px";
      inputCancel.setAttribute("title", "Annuler");
      inputCancel.addEventListener("click", function() {
        hidePopups();
      }, false);
      divValidation.appendChild(inputOk);
      divValidation.appendChild(inputCancel);
      divBlackListQuestion.appendChild(divQuestion);
      divBlackListQuestion.appendChild(divValidation);
      // positionnement et affichage de la fenêtre
      divBlackListQuestion.style.top = (window.pageYOffset + event.clientY + 8) + "px";
      divBlackListQuestion.style.left = (event.clientX + 8) + "px";
      divBlackListQuestion.style.display = "block";
      root.appendChild(divBlackListQuestion);
    }

    // suppression des fenêtres ouvertes
    function hidePopups() {
      if(document.getElementById("hfrBlackListManagement")) {
        let divBlackListManagement = document.getElementById("hfrBlackListManagement");
        divBlackListManagement.parentElement.removeChild(divBlackListManagement);
      }
      if(document.getElementById("hfrBlackListQuestion")) {
        let divBlackListQuestion = document.getElementById("hfrBlackListQuestion");
        divBlackListQuestion.parentElement.removeChild(divBlackListQuestion);
      }
    }

    // suppression des fenêtres ouvertes en cliquant en dehors
    document.addEventListener("click", function(e) {
      let target = e.target;
      while(target !== null && target.id !== "hfrBlackListManagement" && target.id !== "hfrBlackListQuestion") {
        target = target.parentNode;
      }
      if(target === null) {
        hidePopups();
      }
    }, false);

    // masque les messages des pseudos blacklistés
    function hidePosts() {
      let posts = root.querySelectorAll("table.messagetable > tbody > tr:not(.hfrMessageListeNoire) > " +
        "td.messCase1 > div:not([postalrecall]) > b.s2");
      for(let post of posts) {
        let pseudo = post.firstChild.nodeValue;
        post = post.parentElement.parentElement.parentElement;
        if(isPseudoBlacklisted(pseudo)) {
          post.classList.add("hfrMessageListeNoire");
          post.classList.add("hfrStyleListeNoire");
          post.classList.remove("hfrMessageAvecCitationListeNoire");
          post.classList.remove("hfrStyleMessageAvecCitationListeNoire");
          let oldtr = post.parentElement.querySelector("tr.hfrInfoListeNoire");
          if(oldtr !== null) {
            post.parentElement.removeChild(oldtr);
          }
          let tr = this.document.createElement("tr");
          tr.setAttribute("id", post.querySelector("td.messCase1 > a[name]").getAttribute("name"));
          tr.classList.add("hfrInfoListeNoire");
          if(masquage_complet) {
            tr.classList.add("hfrMasquageComplet");
          }
          let td = this.document.createElement("td");
          let p = this.document.createElement("p");
          p.setAttribute("style", "font-size:8pt");
          p.appendChild(document.createTextNode(pseudo + " a été bloqué "));
          let a = this.document.createElement("a");
          a.setAttribute("href", "javascript:void(null);");
          a.appendChild(this.document.createTextNode("Afficher le message"));
          a.addEventListener("click", function(event) {
            event.preventDefault();
            let post = this.parentElement.parentElement.parentElement.nextElementSibling;
            post.parentElement.removeChild(post.previousElementSibling);
            post.classList.remove("hfrMessageListeNoire");
          }, false);
          p.appendChild(a);
          td.appendChild(p);
          tr.appendChild(td);
          post.parentElement.insertBefore(tr, post);
        } else {
          post.classList.remove("hfrStyleListeNoire");
        }
      }
    }

    // affiche les messages des pseudos retirés de la black liste
    function showPosts() {
      let posts = root.querySelectorAll("table.messagetable > tbody > tr.hfrMessageListeNoire > " +
        "td.messCase1 > div:not([postalrecall]) > b.s2");
      for(let post of posts) {
        let pseudo = post.firstChild.nodeValue;
        if(!isPseudoBlacklisted(pseudo)) {
          post = post.parentElement.parentElement.parentElement;
          post.parentElement.removeChild(post.previousElementSibling);
          post.classList.remove("hfrMessageListeNoire");
          post.classList.remove("hfrStyleListeNoire");
        }
      }
      hidePostsWithQuote();
    }

    // masque les citation des pseudos blacklistés
    function hideQuotes() {
      let quotes = root.querySelectorAll("div.container > " +
        "table.citation:not(.hfrCitationListeNoire):not(.hfrInfoListeNoire), " +
        "div.container > table.oldcitation:not(.hfrCitationListeNoire):not(.hfrInfoListeNoire)");
      for(let quote of quotes) {
        let title = quote.querySelector("tbody > tr.none > td > b.s1 > a.Topic");
        if(title && title.textContent.includes(" a écrit :")) {
          title = title.textContent;
          let pseudo = title.substring(0, title.length - " a écrit :".length);
          if(isPseudoBlacklisted(pseudo)) {
            let citation = quote.classList.contains("citation") ? "citation" : "oldcitation";
            quote.classList.add("hfrCitationListeNoire");
            quote.classList.add("hfrStyleListeNoire");
            let quoteListeNoire = this.document.createElement("table");
            quoteListeNoire.classList.add(citation);
            quoteListeNoire.classList.add("hfrInfoListeNoire");
            if(masquage_complet) {
              quoteListeNoire.classList.add("hfrMasquageComplet");
            }
            let trListeNoire = document.createElement("tr");
            trListeNoire.setAttribute("class", "none");
            let tdListeNoire = document.createElement("td");
            let bListeNoire = document.createElement("p");
            bListeNoire.setAttribute("class", "s1");
            bListeNoire.appendChild(document.createTextNode(pseudo + " a été bloqué "));
            let aListeNoire = document.createElement("a");
            aListeNoire.setAttribute("href", "javascript:void(null);");
            aListeNoire.appendChild(document.createTextNode("Afficher la citation"));
            aListeNoire.addEventListener("click", function(event) {
              event.preventDefault();
              let quote = this.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
              quote.parentElement.removeChild(quote.previousElementSibling);
              quote.classList.remove("hfrCitationListeNoire");
            }, false);
            bListeNoire.appendChild(aListeNoire);
            tdListeNoire.appendChild(bListeNoire);
            trListeNoire.appendChild(tdListeNoire);
            quoteListeNoire.appendChild(trListeNoire);
            quote.parentElement.insertBefore(quoteListeNoire, quote);
          } else {
            quote.classList.remove("hfrStyleListeNoire");
          }
        }
      }
      hidePostsWithQuote();
    }

    // affiche les citations des pseudos retirés de la black liste
    function showQuotes() {
      let quotes = root.querySelectorAll("div.container > table.citation.hfrCitationListeNoire, " +
        "div.container > table.oldcitation.hfrCitationListeNoire");
      for(let quote of quotes) {
        let title = quote.querySelector("tbody > tr.none > td > b.s1 > a.Topic");
        if(title && title.textContent.includes(" a écrit :")) {
          title = title.textContent;
          let pseudo = title.substring(0, title.length - " a écrit :".length);
          if(!isPseudoBlacklisted(pseudo)) {
            quote.parentElement.removeChild(quote.previousElementSibling);
            quote.classList.remove("hfrCitationListeNoire");
            quote.classList.remove("hfrStyleListeNoire");
          }
        }
      }
      showPostsWithQuote();
    }

    // masque les messages contenant des citations des pseudos blacklistés
    function hidePostsWithQuote() {
      if(messages_avec_citation) {
        let posts = root.querySelectorAll("table.messagetable > tbody > " +
          "tr:not(.hfrMessageListeNoire):not(.hfrMessageAvecCitationListeNoire)");
        for(let post of posts) {
          if(post.querySelector("div.container > table.citation.hfrCitationListeNoire, " +
              "div.container > table.oldcitation.hfrCitationListeNoire") !== null) {
            let pseudo = post.querySelector("td.messCase1 > div:not([postalrecall]) > b.s2").firstChild.nodeValue;
            post.classList.add("hfrMessageAvecCitationListeNoire");
            post.classList.add("hfrStyleMessageAvecCitationListeNoire");
            let tr = this.document.createElement("tr");
            tr.classList.add("hfrInfoListeNoire");
            if(masquage_complet) {
              tr.classList.add("hfrMasquageComplet");
            }
            let td = this.document.createElement("td");
            let p = this.document.createElement("p");
            p.setAttribute("style", "font-size:8pt");
            p.appendChild(document.createTextNode("Le message de " + pseudo + " contient une citation bloquée "));
            let a = this.document.createElement("a");
            a.setAttribute("href", "javascript:void(null);");
            a.appendChild(this.document.createTextNode("Afficher le message"));
            a.addEventListener("click", function(event) {
              event.preventDefault();
              let post = this.parentElement.parentElement.parentElement.nextElementSibling;
              post.parentElement.removeChild(post.previousElementSibling);
              post.classList.remove("hfrMessageAvecCitationListeNoire");
            }, false);
            p.appendChild(a);
            td.appendChild(p);
            tr.appendChild(td);
            post.parentElement.insertBefore(tr, post);
          } else {
            post.classList.remove("hfrStyleMessageAvecCitationListeNoire");
          }
        }
      }
    }

    // affiche les messages contenant des citations des pseudos retirés de la black liste
    function showPostsWithQuote() {
      let posts = root.querySelectorAll("table.messagetable > tbody > tr.hfrMessageAvecCitationListeNoire");
      for(let post of posts) {
        if((post.querySelector("div.container > table.citation.hfrCitationListeNoire, " +
            "div.container > table.oldcitation.hfrCitationListeNoire") === null) ||
          (messages_avec_citation === false)) {
          if(post.previousElementSibling) {
            post.parentElement.removeChild(post.previousElementSibling);
          }
          post.classList.remove("hfrMessageAvecCitationListeNoire");
          post.classList.remove("hfrStyleMessageAvecCitationListeNoire");
        }
      }
    }

    // suppression du caractère spécial dans les pseudos longs et conversion en minuscules
    function getNormalPseudo(pseudo) {
      return pseudo.replace(/\u200b/g, "").toLowerCase();
    }

    // ajoute un pseudo à la black liste
    function addToBlacklist(pseudoAAjouter) {
      blacklist.push(getNormalPseudo(pseudoAAjouter));
      blacklist.sort();
      GM.setValue("ignore_list", JSON.stringify(blacklist));
    }

    // vérifie si un pseudo est dans la black liste
    function isPseudoBlacklisted(pseudoAVerifier) {
      return blacklist.indexOf(getNormalPseudo(pseudoAVerifier)) >= 0;
    }

    // enlève un pseudo de la black liste
    function removeFromBlacklist(pseudoAEnlever) {
      let i = blacklist.indexOf(getNormalPseudo(pseudoAEnlever));
      if(i >= 0) {
        blacklist.splice(i, 1);
        GM.setValue("ignore_list", JSON.stringify(blacklist));
      }
    }

    // leggo!
    addButtons();
    hidePosts();
    hideQuotes();

  }
});
