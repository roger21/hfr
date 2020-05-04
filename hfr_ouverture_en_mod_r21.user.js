// ==UserScript==
// @name          [HFR] Ouverture en masse mod_r21
// @version       4.2.2
// @namespace     roger21.free.fr
// @description   Permet d'ouvrir ses drapeaux dans de nouveaux onglets avec un seul clic.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    toyonos
// @modifications Refonte du code, gestion de la compatibilité gm4, ajout d'une fenêtre de configuration, sauvegarde des topics bloqués, ajout du support pour toutes les pages des drapals et des nouveaux topics et ajout d'options diverses relatives aux pages des drapals.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_ouverture_en_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_ouverture_en_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_ouverture_en_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.openInTab
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
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

// $Rev: 1976 $

// historique :
// 4.2.2 (04/05/2020) :
// - nouvelle gestion de l'ouverture des onglets pour Violentmonkey et Tampermonkey ->
// ouverture "à la fin" pour permettre de respecter l'ordre des "séquences" d'ouvertures
// 4.2.1 (17/03/2020) :
// - conversion des click -> select() en focus -> select() sur les champs de saisie
// 4.2.0 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 4.1.9 (07/02/2020) :
// - prise en compte du bouton du clic pour l'ouverture des mps quand il n'y en a pas ou qu'un ->
// (gauche -> premier plan, milieu -> arrière plan)
// 4.1.8 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 4.1.7 (30/11/2019) :
// - minuscule amélioration du style de certaines images sur la fenêtre de configuration
// 4.1.6 (07/11/2019) :
// - correction/amélioration du code de détection des catégories vides
// 4.1.5 (05/11/2019) :
// - amélioration du code de compactage des catégories vides pour une meilleur compatibilité
// 4.1.4 (05/11/2019) :
// - ajout d'une double option pour compacter les catégories vides (Sujets compacts)
// - réduction des temps des transitions de 0.7s à 0.3s
// - mise à jour de la metadata @modifications
// 4.1.3 (12/10/2019) :
// - ajout d'une info "sans rechargement" dans la fenêtre de configuration
// - contrainte des icônes des boutons à 16px x 16px
// - suppression des gestions de mouseup redondantes
// 4.1.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - retour des requêtes fetch en mode "same-origin" au lieu de "cors"
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 4.1.1 (23/09/2019) :
// - passage des requêtes fetch en mode "cors" pour éviter un plantage sous ch+vm en mode "same-origin"
// 4.1.0 (20/09/2019) :
// - focus de l'onglet sur l'ouverture de la page des mps ou d'un mp unique
// - nouveaux tooltips sur les boutons
// - mises en forme du code
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 4.0.0 (14/08/2019) :
// - gestion de la compatibilité gm4
// - ajout d'une fenêtre de configuration (clic droit sur les boutons d'ouverture en masse ou via le menu gm)
// - nouvelle correction pour éviter un plantage avec [HFR] Multi MP
// - ajout de la fonctionalité de [HFR] Liste MP forcée
// - ajout de l'avis de licence AGPL v3+ *si toyonos est d'accord*
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (toyonos)
// - réécriture des metadata @description, @modifications et @modtype
// 3.2.0 (05/08/2018) :
// - nouveau nom : [HFR] ouverture de drapeaux en masse mod_r21 -> [HFR] Ouverture en masse mod_r21
// - ajout d'une vérification sur la cat pour éviter un plantage avec [HFR] Multi MP
// - correction de la gestion de la checkbox (plus dépandante de la présence du drapal)
// 3.1.1 (26/05/2018) :
// - ajout du support pour la cat shop
// - ajout d'une petite astuce esthétique pour que le titre de la cat reste ->
// centré malgré le bouton (et uniquement si le bouton fait 16px :o)
// 3.1.0 (13/05/2018) :
// - check du code dans tm
// - recodage en fetch (pour ne pas dépendre de GM_xmlhttpRequest)
// - suppression des @grant inutiles
// - maj de la metadata @homepageURL
// 3.0.2 (28/11/2017) :
// - passage au https
// 3.0.1 (09/10/2017) :
// - ajout du paramètre open_in_background à true
// 3.0.0 (17/09/2017) :
// - gestion de l'enregistrement des topics bloqués
// - gestion des pages de drapals par cat
// - gestion des pages des nouveaux topics
// - suppression de la toyoAjaxLib, remplacée par GM_xmlhttpRequest
// - suppression de getElementByXpath, remplacée par des querySelector
// - refonte, simplification et modernisation du code
// 2.1.0 (29/07/2017) :
// - getsion de la compatibilité avec [HFR] new page number version 2.2.0+
// 2.0.1 (11/12/2016) :
// - suppression de la majuscule sur les titles (tooltips) (j'aime pas les majuscules !)
// - ajout du title (tooltip) sur le bouton des mps quand y'a ouverture en masse de mps
// - homogénéisation du code des auto-refresh
// 2.0.0 (02/12/2016) :
// - nouveau numéro de version : 0.2.4.10 -> 2.0.0
// - nouveau nom : [HFR] Ouverture de drapeaux en masse -> [HFR] ouverture de drapeaux en masse mod_r21
// - mise a jour des metadata pour la publication (@modifications, @modtype)
// - ajout du support pour le clic-milieu (en mouseup) (même effet)
// - augmentation du délai d'auto-refresh de 1 seconde à 5 secondes
// - raccourcissement des textes dans les tooltip (title)
// - légère modification des messages de configuration
// - remplacement des ' par des " (pasque !)
// - compression de l'image (pngoptimizer)
// 0.2.4.10 (03/11/2016) :
// - amélioration du bidouillage d'alignement des icones
// 0.2.4.9 (26/10/2016) :
// - bidouillage pour améliorer le centrage de l'icone par cat
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.2.4.8 (22/11/2015) :
// - correction de bugs sur les fonctions de modification des paramètres
// 0.2.4.7 (16/08/2015) :
// - suppression du contournement
// 0.2.4.6 (03/08/2015) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'un contournement pour l'imposssibilité de réouvrir les onglets fermés
// - reencodage de l'image en base64
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - suppression du module d'auto-update (code mort)
// 0.2.4.5 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.2.4.4 (27/03/2014) :
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.2.4.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.2.4.2 (14/09/2012) :
// - ajout des metadata @grant
// 0.2.4.1 (28/11/2011) :
// - désactivation du message d'erreur XML dans la toyolib
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

var img_all_cat_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACR0lEQVR42s2TX0iTURjGj4P9c3MrcxtuJU2wFCEyEJGKpD83hRcmC8fQhUEMwrsuIgy7mBcGxaDd7mIwdjHYGjn3%2BWn7k25zc5qNjUIDWX5Xoy62dROyfU%2Fft4tp4qTLDvzg4X14n3MO5z2E%2FDfL7%2Fe%2FSKVSX5LJZPYwXC3LeZ4Tm2dnZ88yDINsNsvmcjkchquhUCjA4%2FE8ahiwvb09U6lU2Gq1isOABfYrv9mdcgK%2Brbcf74AIjw3gdp8pFosolUo1yuUySuUi5nIjeJAmMKYFGN8Uw7zVjNEYWTCmieyvgHg8Pre7u4t8Pg%2BG2cMe8x3GWCsmNtowsa7GaFxSg9cPP6vZ%2BzHh%2FnBYoKwH%2BHy%2BuXQ6jUwmg52v3zAVvQFDSgVDQoV7KxLgJ6nBa8OaCmMbGvYW3fSp1my320ecTudaIBAARVGYX%2FLj2gcBhuNq3IxK0L9M6gG85mu8dzskx1W6qYvYbLbXXADcbjfr9Xrx6v00Bmk5BkPN9cajDIakGAq34ZKPPCZWq%2FUNdwo4HA64XC68fPcUl4MKtm9V3jCA9wZoFS7MNz0hJpNpymw2RycnJ6MWiyU6%2Fmws0RWU40pYi951BXQrB40dmwS9SQX6Qlp0z5%2BCPia8fuyzapZEuZ5FHdu92I6OUMtBAKf5Wg%2BlZduXpD8aDpYyLD5%2FerkZnbSO1dNaaGJKaFaV0FNadFI6tnVZBkVI3H%2FieItoyUVpWFZojbRx1zhX40xEBVmk5RfnDfz7LwuKh8iC8DnHNAmK7h61%2FwBwLJjt1YAGnQAAAABJRU5ErkJggg%3D%3D";
var img_cat_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACRklEQVR42s1TXUiTURg%2BDuZ%2B3co2h1tJEyxFiAxEpCLp56bwwmShDF0sCCG86yLCsIvtYkEh5O0uBmMXA9doc%2FPT9pNuuvlpNjaKGQxzV6Obbd2EbOfp%2BwZOC5Uue%2BGBh%2Bfhfc55Oe8h5L8pr9f7IplMfkkkEunD4LQ057lPbLZarWfz%2BTzS6TTNZDI4DE5DoVCA2%2B1%2BdGxANpudrlQqtFqt4jBAgb3KL7pdXoVn6%2B3HOyDCIwO406eLxSJKpVIN5XIZpXIRtswQHrAEo6wAY5simLakGI6R%2BVGWyP4IiMfjtlwuh52dHeTzu9jNf8dorBnjGyqMr7dgOC6ugecPP7fQ%2BzHh3mBYoKwHeDweG8uySKVS2P76DZPRGzAk1TCsqnFvWYz94rlhTY2RDQ29xTR8qjXPzs4OORyONb%2Ffj2AwCN%2BiF9c%2BCDAYb8HNqBi9S6QewHNe473bITmuMg0dZGZm5jUXAJfLRefm5vDq%2FRT6GTn6Q9J6I6W0hv3qD0kwEFbhkoc8JhaL5Q13C9jtdjidTrx89xSXAwrasyI%2FNoD3%2Bhg1LvganhCj0ThpMpmiZrM5OjExER17NrLaEZDjSliL7nUFdMsHI7RtEnQnFOgJadHpOwV9THj9yGfVLDZmuhZ0tHOhFW2hpoMAjvNaV1BLWxclP45dLGVYdP70khTtjI7qGS00MSU0K0rog1q0B3W0eUkGRUjUe%2BJ6NzLii5KwrNAcUXFjnKvhTEQNWaTpJ%2Bf1%2FfsvC4gGyLzwOYcpEmi8%2B7f9G0gWrkniO7BOAAAAAElFTkSuQmCC";
//var img_cat_orig = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABeklEQVQ4y8WTO0tDQRCFv31gp0IMiE9EEAyiQRQUW7EQrfwHt1UbO8FaSGOlsZKk18YHpPCBiCEEbGI0dkpIQDCaIqQwJFzX4upNfGHAwgPLzCw7Z3bO7ghjDH%2BB5I%2F4fwINEA6HJ4FVYKzOvDtgybKsff22se73%2B3ytrV4AhAAQb37VOr7g8THfe3FxGQRcAq%2FH00wm80ClYju9SekmCSHcWGtNR0cLgNdtwYFAKYVtG%2FdwLUmVQCGl%2BqjBe0WlNFrzIeGzVUoihPxKIIREKYkx%2BtvqiUyMy2yM4nOBcqWMV3ZrsBChUMj09HQxNDTgilcVzIlPEgeknqKM%2BEbp9PRxmtolfn1OU7HfuUE6nSWdzv74Zme5beZmprGljb9tiuObHcYHJ9jZi4Ax5tc1uzJsItdbphb7yaAZW2gzdf3EfCFXSt3HCBxZAAQOLW5zSYBSXQQv5mUtnozRgObgapMGoYkmzgCCot5xHl9sDwDzQCNQBDbjG%2FfLr4sBmbSALg9yAAAAAElFTkSuQmCC";
//img_all_cat_default = img_cat_orig;
//img_cat_default = img_cat_orig;
var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var img_reset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";
var img_info = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";

/* ------------------------------------------------ */
/* les options par défaut et les variables globales */
/* ------------------------------------------------ */

var nb_tabs_default = 9;
var reverse_order_default = false;
var enable_pms_default = true;
var more_than_one_default = false;
var always_pm_page_default = false;
var refresh_after_default = false;
var refresh_after_time_default = 5;
var refresh_every_default = false;
var refresh_every_time_default = 10;
var compact_cats_default = false;
var keep_cat_name_default = false;
var excluded_topics_default = [];
var nb_tabs = nb_tabs_default;
var reverse_order = reverse_order_default;
var enable_pms = enable_pms_default;
var more_than_one = more_than_one_default;
var always_pm_page = always_pm_page_default;
var img_all_cat = img_all_cat_default;
var img_cat = img_cat_default;
var refresh_after = refresh_after_default;
var refresh_after_time = refresh_after_time_default;
var refresh_every = refresh_every_default;
var refresh_every_time = refresh_every_time_default;
var compact_cats = compact_cats_default;
var keep_cat_name = keep_cat_name_default;
var excluded_topics = Array.from(excluded_topics_default);
var cat_cat = {
  "service-client-shophfr": "31",
  Hardware: "1",
  HardwarePeripheriques: "16",
  OrdinateursPortables: "15",
  OverclockingCoolingModding: "2",
  electroniquedomotiquediy: "30",
  gsmgpspda: "23",
  apple: "25",
  VideoSon: "3",
  Photonumerique: "14",
  JeuxVideo: "5",
  WindowsSoftware: "4",
  reseauxpersosoho: "22",
  systemereseauxpro: "21",
  OSAlternatifs: "11",
  Programmation: "10",
  Graphisme: "12",
  AchatsVentes: "6",
  EmploiEtudes: "8",
  Setietprojetsdistribues: "9",
  Discussions: "13",
};
var pm_page = "https://forum.hardware.fr/forum1.php?config=hfr.inc&cat=prive&page=1";
var refresh_after_timer = null;
var refresh_every_timer = null;
var scheduled_for_refresh_after = false;
var list_page = false;
var new_topics = false;
var topic_type = "drapaux";
var topics = null;
var all_topics = null;
var pms = [];
var pm_link = null;
var open_in_background = {
  active: false,
  insert: false,
};
var open_in_foreground = {
  active: true,
  insert: false,
};
var gm4 = false;
if(GM && GM.info && GM.info.scriptHandler === "Greasemonkey") {
  gm4 = true;
}

/* ------------------ */
/* fonctions globales */
/* ------------------ */

// fonction de récupération de la cat du topic
function get_cat(p_href) {
  // url verbeuse
  if(p_href.includes(".htm")) {
    let l_cat = /\/hfr\/([^\/]+)\//.exec(p_href);
    if(l_cat !== null) {
      return cat_cat[l_cat[1]];
    }
  }
  // url à paramètres
  let l_cat = /&cat=([0-9]+)&(subcat|post)=/.exec(p_href);
  if(l_cat !== null) {
    return l_cat[1];
  }
  return null;
}

// fonction de désactivation de l'action par défaut
function prevent_default(p_event) {
  p_event.preventDefault();
}

// fonction de mise à jour du lien de réinitialisation des topics bloqués
function update_reinit_topics() {
  reinit_topics_span.textContent = "oublier tous les topics bloqués (" + excluded_topics.length + ")";
}

// fonction de mise à jour des boutons en fonction de la configuration
function update_buttons() {
  let l_main_button = document.getElementById("gm_hfr_oem_main_button");
  if(l_main_button !== null) {
    l_main_button.setAttribute("src", img_all_cat);
    l_main_button.setAttribute("title", "Ouvrir les " + nb_tabs + " premiers " + topic_type +
      "\n(clic droit pour configurer)");
  }
  let l_cat_buttons = document.querySelectorAll("img.gm_hfr_oem_cat_button");
  for(let l_cat_button of l_cat_buttons) {
    l_cat_button.setAttribute("src", img_cat);
    l_cat_button.setAttribute("title", "Ouvrir les " + nb_tabs + " premiers " + topic_type +
      " de cette catégorie\n(clic droit pour configurer)");
  }
}

// fonction de compactage des catégories vides en fonction de la configuration
function compact_empty_cats() {
  let l_tr_compact_cats = document.querySelectorAll("tr.gm_hfr_oem_compact_cats");
  if(!compact_cats) {
    for(let l_tr of l_tr_compact_cats) {
      l_tr.style.display = "";
    }
  } else if(compact_cats && !keep_cat_name) {
    for(let l_tr of l_tr_compact_cats) {
      l_tr.style.display = "none";
    }
  } else if(compact_cats && keep_cat_name) {
    for(let l_tr of l_tr_compact_cats) {
      if(l_tr.classList.contains("gm_hfr_oem_keep_cat_name")) {
        l_tr.style.display = "";
      } else {
        l_tr.style.display = "none";
      }
    }
  }
}

// fonction de mise à jour du lien des mps en fonction de la configuration
function update_pm_link() {
  if(pm_link !== null) {
    if(!always_pm_page && enable_pms && (!more_than_one || (more_than_one && pms.length > 1))) {
      pm_link.removeAttribute("href");
      if(pms.length === 0) {
        pm_link.setAttribute("title", "Ouvrir la page des mps dans un nouvel onglet" +
          "\n(clic droit pour configurer)");
      } else if(pms.length === 1) {
        pm_link.setAttribute("title", "Ouvrir le nouveau mp dans un nouvel onglet" +
          "\n(clic droit pour configurer)");
      } else {
        let l_local_nb_tabs = Math.min(pms.length, nb_tabs);
        pm_link.setAttribute("title", "Ouvrir les " + l_local_nb_tabs +
          (pms.length > nb_tabs ? " premiers " : "") + " nouveaux mps" +
          "\n(clic droit pour configurer)");
      }
      pm_link.addEventListener("contextmenu", prevent_default, false);
      pm_link.addEventListener("mousedown", prevent_default, false);
      pm_link.addEventListener("mouseup", open_pms, false);
    } else {
      if(always_pm_page) {
        pm_link.setAttribute("href", pm_page);
      } else {
        pm_link.setAttribute("href", pm_link.dataset.href);
      }
      pm_link.removeAttribute("title");
      pm_link.removeEventListener("contextmenu", prevent_default, false);
      pm_link.removeEventListener("mousedown", prevent_default, false);
      pm_link.removeEventListener("mouseup", open_pms, false);
    }
  }
}

/* ----------------------------------------- */
/* fonctions de rafraîchissements de la page */
/* ----------------------------------------- */

// fonction générale de rafraîchissements de la page
function do_refresh_page() {
  window.location.reload(true);
}

// fonction de gestion du rafraîchissements de la page après une ouverture en masse
function do_refresh_after() {
  if(refresh_after) {
    scheduled_for_refresh_after = true;
    window.clearTimeout(refresh_after_timer);
    refresh_after_timer = window.setTimeout(do_refresh_page, refresh_after_time * 1000);
  }
}

// fonction de gestion du rafraîchissements de la page toutes les X minutes
function do_refresh_every() {
  if(list_page && refresh_every) {
    window.clearTimeout(refresh_every_timer);
    refresh_every_timer = window.setTimeout(do_refresh_page, refresh_every_time * 60 * 1000);
  }
}

/* ------------------------------ */
/* fonctions d'ouverture en masse */
/* ------------------------------ */

// fonction d'ouverture en masse des topics
function open_topics(p_event) {
  p_event.preventDefault();
  if(p_event.button === 0 || p_event.button === 1) {
    // récupération de la cat sur le bouton cliqué si elle est présente
    let l_cat = (typeof this.dataset !== "undefined" && typeof this.dataset.cat !== "undefined") ?
      this.dataset.cat : null;
    // récupération des topics correspondants et non bloqués
    let l_urls = [];
    for(let l_topic of topics) {
      let l_href = l_topic.hasAttribute("href") ? l_topic.href :
        (typeof l_topic.dataset.href !== "undefined") ? l_topic.dataset.href : null;
      if(l_href !== null && (l_cat === null || l_cat === get_cat(l_href))) {
        let l_checkbox = l_topic.parentElement.parentElement
          .querySelector("td.sujetCase10 input[name^=\"topic\"][type=\"checkbox\"]");
        if(l_checkbox === null || !l_checkbox.checked) {
          l_urls.push(l_href);
        }
      }
    }
    if(l_urls.length > 0) {
      l_urls = l_urls.slice(0, nb_tabs);
      if((gm4 && !reverse_order) || (!gm4 && reverse_order)) {
        l_urls.reverse();
      }
      // ouverture des topics
      for(let l_url of l_urls) {
        GM.openInTab(l_url, open_in_background);
      }
      // rafraîchissements de la page si configuré
      do_refresh_after();
    }
  } else if(p_event.button === 2) {
    show_config_window();
  }
}

// fonction d'ouverture en masse des mps
function open_pms(p_event) {
  p_event.preventDefault();
  if(p_event.button === 0 || p_event.button === 1) {
    let l_pms = Array.from(pms);
    let l_no_pms = l_pms.length === 0;
    let l_less_than_two = l_pms.length < 2;
    if(l_no_pms) {
      l_pms.push(pm_page);
    } else {
      l_pms = l_pms.slice(0, nb_tabs);
      if((gm4 && !reverse_order) || (!gm4 && reverse_order)) {
        l_pms.reverse();
      }
    }
    // ouverture des mps
    for(let l_pm of l_pms) {
      GM.openInTab(l_pm, (!l_less_than_two || p_event.button === 1) ?
        open_in_background : (gm4 ? false : open_in_foreground));
    }
    // rafraîchissements de la page si configuré
    if(!l_no_pms) {
      do_refresh_after();
    }
  } else if(p_event.button === 2) {
    show_config_window();
  }
}

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  "#gm_hfr_oem_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:1003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;text-align:justify;}" +
  "#gm_hfr_oem_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_hfr_oem_config_window{position:fixed;width:550px;height:auto;background:#ffffff;z-index:1002;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;}" +
  "#gm_hfr_oem_config_window div.gm_hfr_oem_main_title{font-size:16px;text-align:center;font-weight:bold;" +
  "margin:0 0 10px;}" +
  "#gm_hfr_oem_config_window fieldset{margin:0 0 8px;border:1px solid #888888;padding:6px 10px 10px;}" +
  "#gm_hfr_oem_config_window legend{font-size:14px;}" +
  "#gm_hfr_oem_config_window p{margin:0 0 0 4px;}" +
  "#gm_hfr_oem_config_window p:not(:last-child){margin-bottom:6px;}" +
  "#gm_hfr_oem_config_window p.gm_hfr_oem_disabled{color:#808080;}" +
  "#gm_hfr_oem_config_window input[type=\"checkbox\"]{margin:0 0 1px;vertical-align:text-bottom;}" +
  "#gm_hfr_oem_config_window input[type=\"text\"]{padding:0 1px;border:1px solid #c0c0c0;height:14px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;text-align:right;}" +
  "#gm_hfr_oem_config_window img.gm_hfr_oem_test_img{margin:0 3px 0 0;vertical-align:text-bottom;" +
  "width:16px;height:16px;}" +
  "#gm_hfr_oem_config_window img.gm_hfr_oem_reset_img{cursor:pointer;margin:0 0 0 3px;vertical-align:baseline;}" +
  "#gm_hfr_oem_config_window span.gm_hfr_oem_reinit_topics{cursor:pointer;}" +
  "#gm_hfr_oem_config_window span.gm_hfr_oem_reinit_topics:hover{text-decoration:underline;}" +
  "#gm_hfr_oem_config_window div.gm_hfr_oem_save_close_div{text-align:right;margin:16px 0 0;}" +
  "#gm_hfr_oem_config_window div.gm_hfr_oem_save_close_div div.gm_hfr_oem_info_reload_div{float:left;}" +
  "#gm_hfr_oem_config_window div.gm_hfr_oem_save_close_div div.gm_hfr_oem_info_reload_div img" +
  "{vertical-align:text-bottom;}" +
  "#gm_hfr_oem_config_window div.gm_hfr_oem_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  "#gm_hfr_oem_config_window img.gm_hfr_oem_help_button{margin-right:1px;cursor:help;}";
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// création de la fenêtre d'aide
var help_window = document.createElement("div");
help_window.setAttribute("id", "gm_hfr_oem_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(p_width, p_text) {
  let help_button = document.createElement("img");
  help_button.setAttribute("src", img_help);
  help_button.setAttribute("class", "gm_hfr_oem_help_button");
  help_button.addEventListener("mouseover", function(e) {
    help_window.style.width = p_width + "px";
    help_window.textContent = p_text;
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
config_background.setAttribute("id", "gm_hfr_oem_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
config_background.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gm_hfr_oem_config_window");
config_window.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.className = "gm_hfr_oem_main_title";
main_title.textContent = "Configuration du script [HFR] Ouverture en masse";
config_window.appendChild(main_title);

// tabs section
var tabs_fieldset = document.createElement("fieldset");
var tabs_legend = document.createElement("legend");
tabs_legend.textContent = "Onglets";
tabs_fieldset.appendChild(tabs_legend);
config_window.appendChild(tabs_fieldset);

// nb tabs
var nb_tabs_p = document.createElement("p");
var nb_tabs_label = document.createElement("label");
nb_tabs_label.textContent = "nombre maximum d'onglets à ouvrir simultanément : ";
nb_tabs_label.setAttribute("for", "gm_hfr_oem_nb_tabs_input");
nb_tabs_p.appendChild(nb_tabs_label);
var nb_tabs_input = document.createElement("input");
nb_tabs_input.setAttribute("id", "gm_hfr_oem_nb_tabs_input");
nb_tabs_input.setAttribute("type", "text");
nb_tabs_input.setAttribute("spellcheck", "false");
nb_tabs_input.setAttribute("size", "2");
nb_tabs_input.setAttribute("maxLength", "2");
nb_tabs_input.setAttribute("pattern", "[1-9]([0-9])?");
nb_tabs_input.setAttribute("title", "de 1 à 99 onglets");
nb_tabs_input.addEventListener("focus", function() {
  nb_tabs_input.select();
}, false);
nb_tabs_p.appendChild(nb_tabs_input);
tabs_fieldset.appendChild(nb_tabs_p);

// reverse order
var reverse_order_p = document.createElement("p");
var reverse_order_checkbox = document.createElement("input");
reverse_order_checkbox.setAttribute("id", "gm_hfr_oem_reverse_order_checkbox");
reverse_order_checkbox.setAttribute("type", "checkbox");
reverse_order_p.appendChild(reverse_order_checkbox);
var reverse_order_label = document.createElement("label");
reverse_order_label.textContent = " inverser l'ordre des onglets";
reverse_order_label.setAttribute("for", "gm_hfr_oem_reverse_order_checkbox");
reverse_order_p.appendChild(reverse_order_label);
tabs_fieldset.appendChild(reverse_order_p);

// pms section
var pms_fieldset = document.createElement("fieldset");
var pms_legend = document.createElement("legend");
pms_legend.textContent = "Messages privés";
pms_fieldset.appendChild(pms_legend);
config_window.appendChild(pms_fieldset);

// enable pms & more than one
var enable_pms_p = document.createElement("p");
var enable_pms_checkbox = document.createElement("input");
enable_pms_checkbox.setAttribute("id", "gm_hfr_oem_enable_pms_checkbox");
enable_pms_checkbox.setAttribute("type", "checkbox");
enable_pms_p.appendChild(enable_pms_checkbox);
var enable_pms_label = document.createElement("label");
enable_pms_label.textContent = " activer l'ouverture en masse sur le lien des mps ";
enable_pms_label.setAttribute("for", "gm_hfr_oem_enable_pms_checkbox");
enable_pms_p.appendChild(enable_pms_label);
var more_than_one_checkbox = document.createElement("input");
more_than_one_checkbox.setAttribute("id", "gm_hfr_oem_more_than_one_checkbox");
more_than_one_checkbox.setAttribute("type", "checkbox");
enable_pms_p.appendChild(more_than_one_checkbox);
var more_than_one_label = document.createElement("label");
more_than_one_label.textContent = " seulement si plus de un mp";
more_than_one_label.setAttribute("for", "gm_hfr_oem_more_than_one_checkbox");
enable_pms_p.appendChild(more_than_one_label);
pms_fieldset.appendChild(enable_pms_p);

// always pm page
var always_pm_page_p = document.createElement("p");
var always_pm_page_checkbox = document.createElement("input");
always_pm_page_checkbox.setAttribute("id", "gm_hfr_oem_always_pm_page_checkbox");
always_pm_page_checkbox.setAttribute("type", "checkbox");

function update_pms() {
  if(always_pm_page_checkbox.checked) {
    enable_pms_p.className = "gm_hfr_oem_disabled";
    enable_pms_checkbox.disabled = true;
    more_than_one_checkbox.disabled = true;
  } else {
    enable_pms_p.className = "";
    enable_pms_checkbox.disabled = false;
    more_than_one_checkbox.disabled = false;
  }
}
always_pm_page_checkbox.addEventListener("input", update_pms, false);
always_pm_page_p.appendChild(always_pm_page_checkbox);
var always_pm_page_label = document.createElement("label");
always_pm_page_label.textContent = " toujours forcer le lien vers la page des mps";
always_pm_page_label.setAttribute("for", "gm_hfr_oem_always_pm_page_checkbox");
always_pm_page_p.appendChild(always_pm_page_label);
pms_fieldset.appendChild(always_pm_page_p);

// buttons section
var buttons_fieldset = document.createElement("fieldset");
var buttons_legend = document.createElement("legend");
buttons_legend.textContent = "Boutons";
buttons_fieldset.appendChild(buttons_legend);
config_window.appendChild(buttons_fieldset);

// img all cat
var img_all_cat_p = document.createElement("p");
var img_all_cat_label = document.createElement("label");
img_all_cat_label.textContent = "icône du bouton général : ";
img_all_cat_label.setAttribute("for", "gm_hfr_oem_img_all_cat_input");
img_all_cat_p.appendChild(img_all_cat_label);
var img_all_cat_test_img = document.createElement("img");
img_all_cat_test_img.className = "gm_hfr_oem_test_img";
img_all_cat_p.appendChild(img_all_cat_test_img);
var img_all_cat_input = document.createElement("input");
img_all_cat_input.setAttribute("id", "gm_hfr_oem_img_all_cat_input");
img_all_cat_input.setAttribute("type", "text");
img_all_cat_input.setAttribute("spellcheck", "false");
img_all_cat_input.setAttribute("size", "37");
img_all_cat_input.setAttribute("title", "url de l'icône (http ou data)");
img_all_cat_input.addEventListener("focus", function() {
  img_all_cat_input.select();
}, false);

function img_all_cat_do_test_img() {
  img_all_cat_test_img.setAttribute("src", img_all_cat_input.value.trim());
  img_all_cat_input.setSelectionRange(0, 0);
  img_all_cat_input.blur();
}
img_all_cat_input.addEventListener("input", img_all_cat_do_test_img, false);
img_all_cat_p.appendChild(img_all_cat_input);
var img_all_cat_reset_img = document.createElement("img");
img_all_cat_reset_img.setAttribute("src", img_reset);
img_all_cat_reset_img.className = "gm_hfr_oem_reset_img";
img_all_cat_reset_img.setAttribute("title", "remettre l'icône par défaut");

function img_all_cat_do_reset_img() {
  img_all_cat_input.value = img_all_cat_default;
  img_all_cat_do_test_img();
}
img_all_cat_reset_img.addEventListener("click", img_all_cat_do_reset_img, false);
img_all_cat_p.appendChild(img_all_cat_reset_img);
buttons_fieldset.appendChild(img_all_cat_p);

// img cat
var img_cat_p = document.createElement("p");
var img_cat_label = document.createElement("label");
img_cat_label.textContent = "icône du bouton par catégories : ";
img_cat_label.setAttribute("for", "gm_hfr_oem_img_cat_input");
img_cat_p.appendChild(img_cat_label);
var img_cat_test_img = document.createElement("img");
img_cat_test_img.className = "gm_hfr_oem_test_img";
img_cat_p.appendChild(img_cat_test_img);
var img_cat_input = document.createElement("input");
img_cat_input.setAttribute("id", "gm_hfr_oem_img_cat_input");
img_cat_input.setAttribute("type", "text");
img_cat_input.setAttribute("spellcheck", "false");
img_cat_input.setAttribute("size", "37");
img_cat_input.setAttribute("title", "url de l'icône (http ou data)");
img_cat_input.addEventListener("focus", function() {
  img_cat_input.select();
}, false);

function img_cat_do_test_img() {
  img_cat_test_img.setAttribute("src", img_cat_input.value.trim());
  img_cat_input.setSelectionRange(0, 0);
  img_cat_input.blur();
}
img_cat_input.addEventListener("input", img_cat_do_test_img, false);
img_cat_p.appendChild(img_cat_input);
var img_cat_reset_img = document.createElement("img");
img_cat_reset_img.setAttribute("src", img_reset);
img_cat_reset_img.className = "gm_hfr_oem_reset_img";
img_cat_reset_img.setAttribute("title", "remettre l'icône par défaut");

function img_cat_do_reset_img() {
  img_cat_input.value = img_cat_default;
  img_cat_do_test_img();
}
img_cat_reset_img.addEventListener("click", img_cat_do_reset_img, false);
img_cat_p.appendChild(img_cat_reset_img);
buttons_fieldset.appendChild(img_cat_p);

// misc section
var misc_fieldset = document.createElement("fieldset");
var misc_legend = document.createElement("legend");
misc_legend.textContent = "Divers";
misc_fieldset.appendChild(misc_legend);
config_window.appendChild(misc_fieldset);

// refresh after
var refresh_after_p = document.createElement("p");
var refresh_after_checkbox = document.createElement("input");
refresh_after_checkbox.setAttribute("id", "gm_hfr_oem_refresh_after_checkbox");
refresh_after_checkbox.setAttribute("type", "checkbox");
refresh_after_p.appendChild(refresh_after_checkbox);
var refresh_after_label = document.createElement("label");
refresh_after_label.textContent = " recharger la page ";
refresh_after_label.setAttribute("for", "gm_hfr_oem_refresh_after_checkbox");
refresh_after_p.appendChild(refresh_after_label);
var refresh_after_time_input = document.createElement("input");
refresh_after_time_input.setAttribute("id", "gm_hfr_oem_refresh_after_time_input");
refresh_after_time_input.setAttribute("type", "text");
refresh_after_time_input.setAttribute("spellcheck", "false");
refresh_after_time_input.setAttribute("size", "2");
refresh_after_time_input.setAttribute("maxLength", "2");
refresh_after_time_input.setAttribute("pattern", "[1-9]([0-9])?");
refresh_after_time_input.setAttribute("title", "de 1 à 99 secondes");
refresh_after_time_input.addEventListener("focus", function() {
  refresh_after_time_input.select();
}, false);
refresh_after_p.appendChild(refresh_after_time_input);
var refresh_after_time_label = document.createElement("label");
refresh_after_time_label.textContent = " secondes après une ouverture en masse";
refresh_after_time_label.setAttribute("for", "gm_hfr_oem_refresh_after_time_input");
refresh_after_p.appendChild(refresh_after_time_label);
misc_fieldset.appendChild(refresh_after_p);

// refresh every
var refresh_every_p = document.createElement("p");
var refresh_every_checkbox = document.createElement("input");
refresh_every_checkbox.setAttribute("id", "gm_hfr_oem_refresh_every_checkbox");
refresh_every_checkbox.setAttribute("type", "checkbox");
refresh_every_p.appendChild(refresh_every_checkbox);
var refresh_every_label = document.createElement("label");
refresh_every_label.textContent = " recharger la page (si liste de topics) toutes les ";
refresh_every_label.setAttribute("for", "gm_hfr_oem_refresh_every_checkbox");
refresh_every_p.appendChild(refresh_every_label);
var refresh_every_time_input = document.createElement("input");
refresh_every_time_input.setAttribute("id", "gm_hfr_oem_refresh_every_time_input");
refresh_every_time_input.setAttribute("type", "text");
refresh_every_time_input.setAttribute("spellcheck", "false");
refresh_every_time_input.setAttribute("size", "2");
refresh_every_time_input.setAttribute("maxLength", "2");
refresh_every_time_input.setAttribute("pattern", "[1-9]([0-9])?");
refresh_every_time_input.setAttribute("title", "de 1 à 99 minutes");
refresh_every_time_input.addEventListener("focus", function() {
  refresh_every_time_input.select();
}, false);
refresh_every_p.appendChild(refresh_every_time_input);
var refresh_every_time_label = document.createElement("label");
refresh_every_time_label.textContent = " minutes";
refresh_every_time_label.setAttribute("for", "gm_hfr_oem_refresh_every_time_input");
refresh_every_p.appendChild(refresh_every_time_label);
misc_fieldset.appendChild(refresh_every_p);

// compact cats & keep cat name
var compact_cats_p = document.createElement("p");
var compact_cats_checkbox = document.createElement("input");
compact_cats_checkbox.setAttribute("id", "gm_hfr_oem_compact_cats_checkbox");
compact_cats_checkbox.setAttribute("type", "checkbox");
compact_cats_p.appendChild(compact_cats_checkbox);
var compact_cats_label = document.createElement("label");
compact_cats_label.textContent = " compacter les catégories vides ";
compact_cats_label.setAttribute("for", "gm_hfr_oem_compact_cats_checkbox");
compact_cats_p.appendChild(compact_cats_label);
var keep_cat_name_checkbox = document.createElement("input");
keep_cat_name_checkbox.setAttribute("id", "gm_hfr_oem_keep_cat_name_checkbox");
keep_cat_name_checkbox.setAttribute("type", "checkbox");
compact_cats_p.appendChild(keep_cat_name_checkbox);
var keep_cat_name_label = document.createElement("label");
keep_cat_name_label.textContent = " mais garder le titre de la catégorie";
keep_cat_name_label.setAttribute("for", "gm_hfr_oem_keep_cat_name_checkbox");
compact_cats_p.appendChild(keep_cat_name_label);
misc_fieldset.appendChild(compact_cats_p);

// reinit topics
var reinit_topics_p = document.createElement("p");
var reinit_topics_span = document.createElement("span");
reinit_topics_span.className = "gm_hfr_oem_reinit_topics";
update_reinit_topics();
reinit_topics_span.addEventListener("click", function() {
  if(excluded_topics.length > 0) {
    if(window.confirm("Êtes-vous sûr de vouloir oublier tous les topics bloqués ?")) {
      excluded_topics = Array.from(excluded_topics_default);
      GM.setValue("excluded_topics", JSON.stringify(excluded_topics));
      if(!new_topics) {
        for(let l_drapal of all_topics) {
          let l_checkbox = l_drapal.querySelector("td.sujetCase10 input[name^=\"topic\"][type=\"checkbox\"]");
          if(l_checkbox !== null) {
            l_checkbox.checked = false;
          }
        }
      }
      update_reinit_topics();
    }
  } else {
    window.alert("Vous n'avez aucun topic bloqué.");
  }
}, false);
reinit_topics_p.appendChild(reinit_topics_span);
misc_fieldset.appendChild(reinit_topics_p);

// info "sans rechargement" et boutons de validation et de fermeture
var save_close_div = document.createElement("div");
save_close_div.className = "gm_hfr_oem_save_close_div";
var info_reload_div = document.createElement("div");
info_reload_div.className = "gm_hfr_oem_info_reload_div";
var info_reload_img = document.createElement("img");
info_reload_img.setAttribute("src", img_info);
info_reload_div.appendChild(info_reload_img);
info_reload_div.appendChild(document.createTextNode(" sans rechargement "));
info_reload_div.appendChild(create_help_button(255,
  "Les paramètres de cette fenêtre de configuration sont appliqués immédiatement à la validation, " +
  "il n'est pas nécessaire de recharger la page."));
save_close_div.appendChild(info_reload_div);
var save_button = document.createElement("img");
save_button.setAttribute("src", img_save);
save_button.setAttribute("title", "Valider");
save_button.addEventListener("click", save_config_window, false);
save_close_div.appendChild(save_button);
var close_button = document.createElement("img");
close_button.setAttribute("src", img_close);
close_button.setAttribute("title", "Annuler");
close_button.addEventListener("click", hide_config_window, false);
save_close_div.appendChild(close_button);
config_window.appendChild(save_close_div);

// fonction de validation de la fenêtre de configuration
function save_config_window() {
  // récupération des paramètres
  // nb tabs
  nb_tabs = parseInt(nb_tabs_input.value.trim(), 10);
  nb_tabs = Math.max(nb_tabs, 1);
  nb_tabs = Math.min(nb_tabs, 99);
  if(isNaN(nb_tabs)) {
    nb_tabs = nb_tabs_default;
  }
  // reverse order
  reverse_order = reverse_order_checkbox.checked;
  // pms
  enable_pms = enable_pms_checkbox.checked;
  more_than_one = more_than_one_checkbox.checked;
  always_pm_page = always_pm_page_checkbox.checked;
  // img all cat
  img_all_cat = img_all_cat_input.value.trim();
  if(img_all_cat === "") {
    img_all_cat = img_all_cat_default;
  }
  // img cat
  img_cat = img_cat_input.value.trim();
  if(img_cat === "") {
    img_cat = img_cat_default;
  }
  // refresh after
  refresh_after = refresh_after_checkbox.checked;
  refresh_after_time = parseInt(refresh_after_time_input.value.trim(), 10);
  refresh_after_time = Math.max(refresh_after_time, 1);
  refresh_after_time = Math.min(refresh_after_time, 99);
  if(isNaN(refresh_after_time)) {
    refresh_after_time = refresh_after_time_default;
  }
  // refresh every
  refresh_every = refresh_every_checkbox.checked;
  refresh_every_time = parseInt(refresh_every_time_input.value.trim(), 10);
  refresh_every_time = Math.max(refresh_every_time, 1);
  refresh_every_time = Math.min(refresh_every_time, 99);
  if(isNaN(refresh_every_time)) {
    refresh_every_time = refresh_every_time_default;
  }
  // compact cats & keep cat name
  compact_cats = compact_cats_checkbox.checked;
  keep_cat_name = keep_cat_name_checkbox.checked;
  // fermeture de la fenêtre
  hide_config_window();
  // mise à jour des boutons en fonction de la configuration
  update_buttons();
  // compactage des catégories vides en fonction de la configuration
  compact_empty_cats();
  // mise à jour du lien des mps en fonction de la configuration
  update_pm_link();
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("nb_tabs", nb_tabs),
    GM.setValue("reverse_order", reverse_order),
    GM.setValue("enable_pms", enable_pms),
    GM.setValue("more_than_one", more_than_one),
    GM.setValue("always_pm_page", always_pm_page),
    GM.setValue("img_all_cat", img_all_cat),
    GM.setValue("img_cat", img_cat),
    GM.setValue("refresh_after", refresh_after),
    GM.setValue("refresh_after_time", refresh_after_time),
    GM.setValue("refresh_every", refresh_every),
    GM.setValue("refresh_every_time", refresh_every_time),
    GM.setValue("compact_cats", compact_cats),
    GM.setValue("keep_cat_name", keep_cat_name),
  ]);
}

// fonction de fermeture de la fenêtre de configuration
function hide_config_window() {
  config_window.style.opacity = "0";
  config_background.style.opacity = "0";
  // réactivation des rafraîchissements de la page
  if(scheduled_for_refresh_after) {
    do_refresh_after();
  }
  do_refresh_every();
}

// fonction de fermeture de la fenêtre de configuration par la touche echap
function esc_config_window(p_event) {
  if(p_event.key === "Escape") {
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
  // désacivation des rafraîchissements de la page
  window.clearTimeout(refresh_after_timer);
  window.clearTimeout(refresh_every_timer);
  // initialisation des paramètres
  nb_tabs_input.value = nb_tabs;
  reverse_order_checkbox.checked = reverse_order;
  enable_pms_checkbox.checked = enable_pms;
  more_than_one_checkbox.checked = more_than_one;
  always_pm_page_checkbox.checked = always_pm_page;
  update_pms();
  img_all_cat_input.value = img_all_cat;
  img_all_cat_do_test_img();
  img_cat_input.value = img_cat;
  img_cat_do_test_img();
  refresh_after_checkbox.checked = refresh_after;
  refresh_after_time_input.value = refresh_after_time;
  refresh_every_checkbox.checked = refresh_every;
  refresh_every_time_input.value = refresh_every_time;
  compact_cats_checkbox.checked = compact_cats;
  keep_cat_name_checkbox.checked = keep_cat_name;
  update_reinit_topics();
  // affichage de la fenêtre
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
}

// ajout d'une entrée de configuration dans le menu greasemonkey si c'est possible (pas gm4 yet)
if(typeof GM_registerMenuCommand !== "undefined") {
  GM_registerMenuCommand("[HFR] Ouverture en masse -> Configuration", show_config_window);
}

/* -------------------------------------------------- */
/* récupération des paramètres et lancement du script */
/* -------------------------------------------------- */

Promise.all([
  GM.getValue("nb_tabs", nb_tabs_default),
  GM.getValue("reverse_order", reverse_order_default),
  GM.getValue("enable_pms", enable_pms_default),
  GM.getValue("more_than_one", more_than_one_default),
  GM.getValue("always_pm_page", always_pm_page_default),
  GM.getValue("img_all_cat", img_all_cat_default),
  GM.getValue("img_cat", img_cat_default),
  GM.getValue("refresh_after", refresh_after_default),
  GM.getValue("refresh_after_time", refresh_after_time_default),
  GM.getValue("refresh_every", refresh_every_default),
  GM.getValue("refresh_every_time", refresh_every_time_default),
  GM.getValue("compact_cats", compact_cats_default),
  GM.getValue("keep_cat_name", keep_cat_name_default),
  GM.getValue("excluded_topics", JSON.stringify(excluded_topics_default)),
]).then(function([
  l_nb_tabs,
  l_reverse_order,
  l_enable_pms,
  l_more_than_one,
  l_always_pm_page,
  l_img_all_cat,
  l_img_cat,
  l_refresh_after,
  l_refresh_after_time,
  l_refresh_every,
  l_refresh_every_time,
  l_compact_cats,
  l_keep_cat_name,
  l_excluded_topics,
]) {
  // initialisation des variables globales
  nb_tabs = l_nb_tabs;
  reverse_order = l_reverse_order;
  enable_pms = l_enable_pms;
  more_than_one = l_more_than_one;
  always_pm_page = l_always_pm_page;
  img_all_cat = l_img_all_cat;
  img_cat = l_img_cat
  refresh_after = l_refresh_after;
  refresh_after_time = l_refresh_after_time;
  refresh_every = l_refresh_every;
  refresh_every_time = l_refresh_every_time;
  compact_cats = l_compact_cats;
  keep_cat_name = l_keep_cat_name;
  excluded_topics = JSON.parse(l_excluded_topics);

  // gestion des listes de topics
  if(window.location.href.indexOf("https://forum.hardware.fr/forum1.php") === 0 ||
    window.location.href.indexOf("https://forum.hardware.fr/forum1f.php") === 0 ||
    /^https:\/\/forum\.hardware\.fr\/.*\/liste_sujet-.*\.htm$/.exec(window.location.href) !== null) {
    list_page = true;

    // récupération des listes des topics de la page
    if(window.location.href.includes("&new=1&")) {
      new_topics = true;
      topic_type = "nouveaux topics";
    }
    if(new_topics) {
      topics = document.querySelectorAll("tr.sujet.ligne_booleen:not(.ligne_sticky) td.sujetCase3 a");
    } else {
      topics = document.querySelectorAll("tr.sujet.ligne_booleen td.sujetCase5 a");
      all_topics = document.querySelectorAll("tr.sujet.ligne_booleen");
    }

    // construction de la liste des cats ayant des topics
    let l_cats = [];
    for(let l_topic of topics) {
      let l_href = l_topic.hasAttribute("href") ? l_topic.href :
        (typeof l_topic.dataset.href !== "undefined") ? l_topic.dataset.href : null;
      if(l_href !== null) {
        let l_cat = get_cat(l_href);
        if(!l_cats.includes(l_cat)) {
          l_cats.push(l_cat);
        }
      }
    }

    // fonction d'ajout/suppression des topics bloqués
    function toggle_topic() {
      let l_topic = this.dataset.topic;
      let l_index = excluded_topics.indexOf(l_topic);
      if(l_index === -1) {
        excluded_topics.push(l_topic);
      } else {
        excluded_topics.splice(l_index, 1);
      }
      GM.setValue("excluded_topics", JSON.stringify(excluded_topics));
    }

    // ajout de la fonction d'ajout/suppression sur les checkboxes des topics
    // et mise à jour des checkboxes en fonction de la liste des topics bloqués
    if(!new_topics) {
      for(let l_drapal of all_topics) {
        let l_checkbox = l_drapal.querySelector("td.sujetCase10 input[name^=\"topic\"][type=\"checkbox\"]");
        if(l_checkbox !== null) {
          let l_cat = l_checkbox.parentElement.querySelector("input[name^=\"valuecat\"][type=\"hidden\"]").value;
          let l_topic = l_cat + "_" + l_checkbox.value;
          l_checkbox.dataset.topic = l_topic;
          l_checkbox.checked = excluded_topics.includes(l_topic);
          l_checkbox.addEventListener("change", toggle_topic, false);
        }
      }
    }

    // ajout du bouton toutes cats
    let l_main_tr = document.querySelector("table.main tr.cBackHeader.fondForum1Description");
    if(l_main_tr !== null && topics.length > 0) {
      let l_main_button = document.createElement("img");
      l_main_button.setAttribute("id", "gm_hfr_oem_main_button");
      l_main_button.style.cursor = "pointer";
      l_main_button.style.width = "16px";
      l_main_button.style.height = "16px";
      l_main_button.style.marginLeft = "5px";
      l_main_button.setAttribute("alt", "OEM");
      l_main_button.addEventListener("contextmenu", prevent_default, false);
      l_main_button.addEventListener("mousedown", prevent_default, false);
      l_main_button.addEventListener("mouseup", open_topics, false);
      l_main_tr.firstElementChild.textContent = "";
      l_main_tr.firstElementChild.style.textAlign = "left";
      l_main_tr.firstElementChild.appendChild(l_main_button);
    }

    // ajout des boutons par cat
    let l_cat_trs = document.querySelectorAll("table.main tr.cBackHeader.fondForum1fCat th.padding");
    for(let l_cat_tr of l_cat_trs) {
      let l_cat_header = l_cat_tr.querySelector("a.cHeader");
      if(l_cat_header !== null && l_cat_header.hasAttribute("href")) {
        let l_cat = /&cat=([0-9]+)&/.exec(l_cat_header.href);
        if(l_cat !== null) {
          l_cat = l_cat[1];
          if(l_cats.includes(l_cat)) {
            let l_cat_button = document.createElement("img");
            l_cat_button.dataset.cat = l_cat;
            l_cat_button.className = "gm_hfr_oem_cat_button";
            l_cat_button.style.cursor = "pointer";
            l_cat_button.style.width = "16px";
            l_cat_button.style.height = "16px";
            l_cat_button.style.float = "left";
            l_cat_button.style.marginLeft = "7px";
            l_cat_button.style.marginRight = "-23px";
            l_cat_button.setAttribute("alt", "OEM");
            l_cat_button.addEventListener("contextmenu", prevent_default, false);
            l_cat_button.addEventListener("mousedown", prevent_default, false);
            l_cat_button.addEventListener("mouseup", open_topics, false);
            l_cat_tr.insertBefore(l_cat_button, l_cat_tr.firstElementChild);
          }
        }
      }
    }

    // mise à jour des boutons en fonction de la configuration
    update_buttons();

    // préparation des catégories pour la fonction de compactage des catégories vides
    let l_tr_cats = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.main tbody " +
      "tr.cBackHeader.fondForum1fCat");
    for(let l_tr of l_tr_cats) {
      if(!l_tr.nextElementSibling ||
        (l_tr.nextElementSibling.classList.contains("cBackHeader") &&
          l_tr.nextElementSibling.classList.contains("fondForum1fCat"))) {
        l_tr.classList.add("gm_hfr_oem_compact_cats");
        l_tr.classList.add("gm_hfr_oem_keep_cat_name");
      } else if(l_tr.nextElementSibling.classList.contains("sujet") &&
        !l_tr.nextElementSibling.classList.contains("ligne_booleen")) {
        l_tr.classList.add("gm_hfr_oem_compact_cats");
        l_tr.classList.add("gm_hfr_oem_keep_cat_name");
        l_tr.nextElementSibling.classList.add("gm_hfr_oem_compact_cats");
      }
    }

    // compactage des catégories vides en fonction de la configuration
    compact_empty_cats();
  }

  // préparation du lien des mps
  pm_link = document.querySelector("table.none tr td div.left div.left a");
  if(pm_link !== null) {
    pm_link.dataset.href = pm_link.href;
    pm_link.style.cursor = "pointer";
  }

  // récupération de la liste des nouveaux mps et mise à jour du lien des mps en fonction de la configuration
  fetch(pm_page, {
    method: "GET",
    mode: "same-origin",
    credentials: "same-origin",
    cache: "reload",
    referrer: "",
    referrerPolicy: "no-referrer"
  }).then(function(r) {
    return r.text();
  }).then(function(r) {
    // récupération de la liste des nouveaux mps
    let p = new DOMParser();
    let d = p.parseFromString(r, "text/html");
    let l = d.documentElement.querySelectorAll("table tr.sujet.ligne_booleen td.sujetCase1 img[alt=\"On\"]");
    for(let m of l) {
      pms.push(m.parentElement.parentElement.querySelector("td.sujetCase9 a").href);
    }

    // mise à jour du lien des mps en fonction de la configuration
    update_pm_link();
  }).catch(function(e) {
    console.log("[HFR] Ouverture en masse mod_r21 ERROR fetch : " + e);
  });

  // lancement du rafraîchissements de la page toutes les X minutes
  do_refresh_every();
});
