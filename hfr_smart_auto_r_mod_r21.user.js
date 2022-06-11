// ==UserScript==
// @name          [HFR] Smart Auto Rehost mod_r21
// @version       6.1.3
// @namespace     roger21.free.fr
// @description   Réhost automatiquement les images et les liens vers les images provenant d'une liste modifiable de noms de domaine.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    mycrub
// @modifications Réécriture, compatibilité gm4, gestion des liens vers les images en plus des images, ajout du choix entre reho.st, ses aliases ou un rehost perso, intégration de la fonctionnalité stealth rehost, ajout d'options pour les formats gif, gifv, webp et svg et gestion du choix des noms de domaine à réhoster sur la fenêtre d'ajout des noms de domaine.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_smart_auto_r_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_smart_auto_r_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_smart_auto_r_mod_r21.user.js
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

Copyright © 2012-2022 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 3563 $

// historique :
// 6.1.3 (11/06/2022) :
// - amélioration de la taille de la div pour l'image de test
// - redécoupage de certaines lignes longues dans le code
// 6.1.2 (02/02/2021) :
// - ajout du support pour GM.registerMenuCommand() (pour gm4)
// 6.1.1 (11/01/2021) :
// - réactivation par défaut des options "à ne pas réhoster"
// 6.1.0 (11/01/2021) :
// - retour à reho.st par défaut
// 6.0.9 (25/09/2020) :
// - ajout de reho.st à la liste des noms de domaine à ne pas réhoster ->
// (le service ne permettant pas d'être interrogé autrement que directement depuis une page du forum)
// 6.0.8 (25/09/2020) :
// - correction du code de conversion des urls et passage à images.weserv.nl par défaut
// 6.0.7 (16/07/2020) :
// - homogénéisation de la taille des champs sur la fenêtre de configuration
// 6.0.6 (17/03/2020) :
// - conversion des click -> select() en focus -> select() sur les champs de saisie
// 6.0.5 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur ->
// (free.fr -> github.com)
// 6.0.4 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 6.0.3 (22/12/2019) :
// - gestion du déréhostage lorsque le chargement de l'image réhostée échoue
// 6.0.2 (05/11/2019) :
// - correction des regexp de détection des extensions
// 6.0.1 (05/11/2019) :
// - ajout du type de fichier svg dans les options des formats à ne pas réhoster
// 6.0.0 (03/11/2019) :
// - gestion de la compatibilité gm4
// - ajout du choix entre reho.st, ses aliases ou un rehost perso sur la fenêtre de configuration
// - intégration de la fonctionnalité stealth rehost
// - ajout d'options pour les formats gif, gifv et webp
// - gestion du choix des noms de domaine à réhoster sur la fenêtre d'ajout des noms de domaine
// - changement de l'image du burger par défaut
// - mise à jour de la liste des noms de domaine par défaut
// - passage au clic droit pour ouvrir la fenêtre de configuration au lieu du double clic
// - nouveau nom : [HFR] smart auto rehost mod_r21 -> [HFR] Smart Auto Rehost mod_r21
// - ajout de l'avis de licence AGPL v3+ *si mycrub est d'accord*
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (mycrub)
// - réécriture des metadata @description, @modifications et @modtype
// 5.4.8 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 5.4.7 (30/09/2019) :
// - suppression de la directive @connect inutile (oublie sur la dernière maj)
// 5.4.6 (20/09/2019) :
// - autorisation du rehost des gif (2Mo -> 5Mo)
// - correction de la gestion des liens (sans requête HEAD)
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 5.4.5 (15/08/2018) :
// - correction de l'ajout du burger pour éviter d'en avoir deux, signalé par minipouss :jap:
// - et suppression des getElementByXpath remplacés par des querySelector si besoin
// 5.4.4 (13/08/2018) :
// - correction d'une fôte, signalée par minipouss :jap:
// 5.4.3 (10/06/2018) :
// - amélioration de la regexp de détection des gif
// - exclusion des gif de la détection du content-type
// 5.4.2 (13/05/2018) :
// - ajout de la metadata @connect pour tm
// - ajout d'une protection suplémentaire sur les liens en forum.hardware.fr
// - petites optimisations et améliorations (oui encore) du code
// - maj de la metadata @homepageURL
// 5.4.1 (28/04/2018) :
// - petites améliorations du code et check du code dans tm
// - suppression des @grant inutiles
// 5.4.0 (06/12/2017) :
// - passage au https pour reho.st avec conversion auto du site de reho.st
// 5.3.2 (28/11/2017) :
// - passage au https
// 5.3.1 (11/02/2017) :
// - correction du style font-fammily à Verdana,Arial,Sans-serif,Helvetica (HFR Style)
// 5.3.0 (16/12/2016) :
// - désactivation du rehostage des .gif (trop gros passera pas)
// 5.2.0 (15/12/2016) :
// - tri des listes d'hosts dans la fenêtre de configuration
// - meilleure gestion de l'affichage des données dans la fenêtre de configuration
// - correction des polices et de leur tailles dans la fenêtre de configuration
// - légère remise en forme de la fenêtre de configuration
// 5.1.3 (15/08/2016) :
// - correction du string.contains en string.includes (par cytrouille pour firefox 48+)
// 5.1.2 (19/04/2016) :
// - ajout du mode anonyme de GM_xmlhttpRequest (GM 3.8)
// 5.1.1 (24/11/2015) :
// - correction de la regexp du content-type pour matcher image/jpg (qui n'existe pas !)
// - légère modification de la regexp du content-type (plus robuste ?)
// 5.1.0 (22/11/2015) :
// - correction d'une connerie (bravo!) dans la detection du content-type
// - amélioration du code pour marquer que le lien est reho.sté
// - nouveau nom : [HFR] Smart Auto Rehost mod_r21 -> [HFR] smart auto rehost mod_r21
// 5.0.0 (21/11/2015) :
// - desactivation des spellcheck dans la fenetre de conf
// - ajout de l'ouverture de la fenetre de conf en double cliquant sur le burger
// - modification du title sur le burger
// - légères modification de code et des noms des fonctions
// - suppression d'une ligne vide
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - remplacement des ' par des " (pasque !)
// - ajout du traitement des liens vers des images ->
// permet notamment à [HFR] Image quote preview de prendre l'url de rehost au lieu de l'url ->
// source (quand le rehost est apliqué à cet host)
// - ajout d'un test sur la detection des nouveaux hosts a réhoster pour eviter de laisser ->
// passer un bug avec les url en data:image
// - lors de l'ajout d'un host à rehoster, retraitetement de la page entière, pas seulment ->
// du post concerné, le même host peut être utilisé dans d'autres posts, autant tout traiter
// - nouveau numéro de version : 4.0.7 -> 5.0.0
// - nouveau nom : [HFR] Smart Auto Rehost -> [HFR] Smart Auto Rehost mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 4.0.7 (17/10/2015) :
// - génocide de code non utilisé et de commentaires
// - uniformisation du nom du script : "Auto Rehost" -> "Smart Auto Rehost"
// 4.0.6.14 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour ->
// plus de sécurité)
// 4.0.6.13 (20/01/15) :
// - suppression du support de hfr-rehost.net
// 4.0.6.12 (19/01/2015) :
// - compactage du css
// - reencodage des images en base64
// - decoupage des lignes de code trop longue
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - suppression de certains commentaires inutiles
// - suppression de bouts de code mort
// - suppression de code commenté (log et dé-rehostage)
// - suppression du module d'auto-update (code mort)
// 4.0.6.11 (06/04/2014) :
// - suppression du systeme de dé-rehostage qui sert (plus) à rien et qui pue
// 4.0.6.10 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 4.0.6.9 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 4.0.6.8 (25/10/2013) :
// - ajout d'un . dans Rehosted (Reho.sted) dans les titles et alt
// 4.0.6.7 (10/10/2013) :
// - passage de http://hfr-rehost.net/ à http://reho.st/ pour le rehost
// 4.0.6.6 (22/11/2012) :
// - ajout du support pour le https
// 4.0.6.5 (22/11/2012) :
// - nouveau code pour le dé-rehostage (check avant rehost au lieu de corriger après rehost) ->
// c'est plus léger
// 4.0.6.4 (21/11/2012) :
// - ajout d'un test de dé-rehostage (quand hfr-rehost ne renvoie rien) ->
// en attente d'une nouvelle image "trop gros, passera pas"
// 4.0.6.3 (14/09/2012) :
// - ajout des metadata @grant
// 4.0.6.2 (30/08/2012) :
// - modification des attributs alt et title en cas de un-rehostage
// - ajout de l'historique
// - gestion des atttributs avec les methodes accesseurs
// 4.0.6.1 (05/08/2012) :
// - ajout d'un caca pour un-rehoster les images trop grosses (selon hfr-rehost.net)
// - commentage du log (on s'en branle :o )
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

/* ---------- */
/* les images */
/* ---------- */

var img_burger_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACs0lEQVR42qSTz2tcVRzFP99773vz3ryZZDpNQ2J%2BNF00sQouqmhJCgVxURFd6Kp%2FgK6z6Mq1u9aVIO4EpbpRcCf4C1RcKFgapTjWxEIwQ5wx7YzTmXnvvvvudRERXPeszuYczuFwJITAw8CU7wtRex5OrkM2D3GziTKPocyTNBZXcdaS%2F9UBdvDuF%2BzYM%2BnhurexwyPM%2F%2BxUfIkou0IyewExZ5GojjGB5soRle2Q3%2FsCV9wAdv9LIAAiLUTeJlRXCAHsFJSCYgRKCyqaQ%2BQiUXYRl2%2Bj4zdA3gQwDmKTjz6kf%2Fsyg98hbkLcgHQOlAHvIJ6B4v4xLx%2B0KKfX8WUJvGMO7vPswnRyuWYm6BjECCgBE4HSYGIQDSGAswRnsRPHcBBeL%2FJw11S71PYTQnsJSRIwKqAIIMVxSZmAAu%2FBTcFOYDiCfkVkRVpmO01%2Ffv4DP3lk1mZza9A4pZCoQtWO9T4ADiKB2oKiM%2Bf5eqnOeCX624vvm%2B9PU2y8LIP03Xp28FvJzELK2maJ%2BiOHyNN6NCHdqHPULniwEnMpK1mzTa7eKfZ3Qzg0W0%2BYze5ipUc9w%2FytAr86Rl84xeZWDX06xw9O8M23hs8%2FLZCDCd89lXJzybPb9kuhoZ8xWU%2BW96bpwq0XheqFFoimfWfI0500PF5fls8%2B7jKeWNa2NDtVTL9UrLoxzx2G2cPIJ9LZlnXXUzt7d1XS9RH7MwnvbSruhWFYadfEast6qdhyhuwHR2MvcC6tOLnof8pb4TXpXuMVrflIOQgDiMbQL4ReEUg8JJkicp6mA30CyKBIYFpBVbJt0hpfFgWvjiwv2RrnowbzNRWiMwJagw8eURAUuAobPH%2FGih%2Frmk%2Bs5SsZvAW%2BAutYtiXnk5iNEFhHmNX%2F7i8CSjGMDb%2BK0AFuVp7uNAd52Dv%2FMwASiyshlCXA8AAAAABJRU5ErkJggg%3D%3D";
//var img_burger_orig = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAMAAAAs2N9uAAAAXVBMVEUAAADMmTOZZjNmZgBmZjP%2FzGb%2FmTNmMzOZmWbMmWbMzJn%2FzDPMmQBmMwDMZjOZZgAzMwDMmZn%2FzJkzMzOZZmaZmTOZmZmZzGbMzGYzZjOAgADMZgCAgID%2FmQD%2FmWZdMtP7AAAAAXRSTlMAQObYZgAAAJRJREFUeNp10NsOwyAIBuCKqMVDdd162PH9H7NAt2y76J%2BYmC8Iwa47zAU4%2FQ8gGI4jin%2FgfXLuXRdsNTl7pag2B6h3oZTcOCphgWEw%2BalFKwqdA4j57B1BwaiEoP2r5eCJ6dGa3G0pfCgKzdd%2BWSbbLNymNSp1iGirPOX%2B%2B0ShvVl60WelwDNhMAaAvjuHwGPp%2BFM2SIsFs3WsoRQAAAAASUVORK5CYII%3D";
//var img_burger_default = img_burger_orig;
var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var img_select = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAIAQMAAAAY6OeMAAAABlBMVEV1bGWIiIhRreupAAAAAXRSTlMAQObYZgAAAB9JREFUeNpjYGBgqP%2FAYP%2BAQf4AA38DAzsDAxNQiAEAP1wEBmEVxtQAAAAASUVORK5CYII%3D";
var img_reset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";
var img_info = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";
var img_throbber = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACGFjVEwAAAAYAAAAANndHFMAAAAaZmNUTAAAAAAAAAAQAAAAEAAAAAAAAAAAAB8D6AEAHV58pwAAAWlJREFUeNpjYMABREVFeYBgJQiD2AykAmZm5hYg9R%2BEoWz8QENDw1JRUXGPkpLSHCsrK16gpqlIBkz9%2F%2F8%2F1%2BbNmxu3bNkye9u2bXoomoGSjCDNQPwfhFVVVdO5uLgkgRqXgjBQidS%2BffuCgZpvAw25CcSzMVwAshmkWUFB4Z%2BysnIAujxQsyMQX4Ya0ojNFxxAQzKgmpnQJUGuhBoSeubMGVa4hIeHB7uLi0u5q6tre1RUlCChsAL6nw9oSAkQp69atYqNwc3NbbqTk9M3Z2fn30A8g5ABQOe3gLwBxNeBuJ5yA2BeAOJ2CwsLIZK9AAMgTlZWVmx2drY7KMCIDkQYAGruBeJ3QPwMiD1IjkagplWZmZmvgfh9RkZG7MyZM0WmTJnSCcI9PT0iQKeH4E1IeXl5xiBDoC7hmTZtWgVQ82MQnjx5ciXQ2biTMjYA1JQ9derUeyAMYpOcG3t7ezmBmltBGMTGpQ4AtqrwBlDMdgwAAAAaZmNUTAAAAAEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8Sqm5QAAAXpmZEFUAAAAAnjaY2DAAURFRXmEhYWXgTCIzUAq4OXlbeLi4voPwkB2I0ENRkZGFrq6ujv19PRmWVlZAfXwToIZwMPDM%2Fn%2F%2F%2F9cmzdvbtyyZcvsbdu26WEYANKsra39T0dH57%2B%2Bvn4qUKMkUOMSEAZKS%2B3evTsYqPk20JCbQDwbwwCQzSDNQPwTaJg%2FujxQsyMQX4YagukleXl5DqDGNENDQ7%2F6%2BnomdHmgFxihhoSeOXOGFS7h4eHBHhAQUBoYGNiSn58vQCisgP7nAxpSAsTpq1atYmMICgqa4u%2Fv%2F9HPz%2B8b0KCphAwAOr8F5A0gvg7E9ZQbAPMCELfa2NgIkuwFGABxKioqooHYDRRgRAciDJSXl3cD8SsgflRWVuZOcjQCNS4H4udAza9KS0uj161bJ7x48eI2EF64cKEw0OkheBNSVVWVEcgQoBe6srKyeJYsWVIG1HwfhEFsoLPxJ2V0ANSUAdR8C4RBbJJzIzBQOYEam0AYxMalDgDCHPiOgVAEawAAABpmY1RMAAAAAwAAABAAAAAQAAAAAAAAAAAAHwPoAQEcvHUMAAABbmZkQVQAAAAEeNpjYMABtLS0eGRlZReDMIjNQCqQkJCoFxUV%2FQ%2FCIDZBDTY2NuYWFhbbLC0tp%2Fv5%2BfGKi4tPEBMT%2Bw%2FCQEMm%2FP%2F%2Fn2vz5s2NW7Zsmb1t2zY9DANAms3NzX8B8V9ra%2BtkoCYJoCGLQJiLi0ty9%2B7dwUDNt4GG3ATi2RgGgGwGaQbir0DDfNHlgZodgfgy1JBGDAPk5eU5gBpTgLaDNDOhywO9wAg1JPTMmTOscInc3Fz22NjY4ri4uKb8%2FHwBQmEF9D8f0JASIE5ftWoVGwNQ48SYmJi3QPwJaNBkQgYAnd8C8gYQXwfiesoNQPaCt7e3IMlegAEQp7W1NQqIXUEBRnQgwgBQY0dLS8tzIL7f3NzsRnI0Ag1YAsRPQIY0NTVFAROOMMi%2FILxu3TphoNND8Cak9vZ2Q6ghHfX19TwgfwIV3gFhEHvTpk34kzI6AGpIh4b0dRCb5NwIDFROoI0NIAxi41IHAFxMAhn8b9WWAAAAGmZjVEwAAAAFAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfF2B3YAAAGfZmRBVAAAAAZ42mNgwAG0tLR41NXVF4AwiM1AKlBSUqpVUFD4D8IgNkz8%2F%2F%2F%2FjFg1uLm5mbm4uGwG4qmhoaE8QE19ioqK%2F0FYRUWlF6iEj5mZeTEQH%2BDg4LDBMACk2cnJ6buzs%2FMvoGFJ8vLyEkDNC0AY6AUJFhaWHJADQJiJiekohktANoM0A%2FEnoAE%2B6BawsbGFMjIygg0AumIJhguAzmQHuiAZpLm%2Bvp4Jiy%2BZgIaEAGmQS7jgorm5uexZWVmF2dnZDR0dHfyEAhfodIEdO3aUbNmyJX3VqlVsDECNfZmZma%2BA%2BD3QoAmEDNi8eXMLUPNtIL4OxPWUGwDzAtCABn9%2FfwFCBmzbto0PqBHhBSS%2FsU6bNi1iypQpztgSC0gMqMkRiEPPnDnDimEyUGMbED%2BePHnybaBBLujyUM2XQc4HeqMRmwELp06d%2BgBqSMTu3buFQf4F4XXr1gkDnR4C1XwTiGdjM8AAakhrd3c3N8ifQIV3QBjE3rRpExfIZiB7NtAwPYKZCaghHRrS10FsknMjMIQ5gTY2gDCIjUsdAEaa8bn5NffYAAAAGmZjVEwAAAAHAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARzg1J8AAAGgZmRBVAAAAAh42p2Tv0sCYRjHr8Dk7tLzx1B%2FgJN3XiCEQ1OOBf6qXK1JuJCW8AcRFbYJDm0iBqk4OEjo4eIQNLsFSSSNLUFL0BbX96mjzFMOe%2BHLfXnv%2FX6e53nhZZgpS5Zl3u%2F3V0jkmVmXz%2Bc7EkXxg0TeNBCNRlfD4fB1JBK5UBRlEaGCJEkaibzL5bJjXdlsthun07lmAFA4FAq9Qe%2BxWGzX6%2FUuI1ghBQKBJYT3eZ7XOI7TALnVNG3uD4AqUxigV3SzOV5AEIQtApCoE0MHHo%2FHCsAeqm8Y6N9rniAsyyrw3M9uKpWyZjKZg2w2e1wqlQSzuwLc0e12D1VVTTabzQUml8sVAHiGXtLpdNEM0Ol0zhF%2BhAbQyRcAwf8DRkdIJBIOMwDatyP4O8LIbJZGoxGvVqvBSZdIewitQzv9ft9iINdqtXy9Xn%2BC7gEKjv%2FXw3fUPsY4mwS4hIYEwTfe6%2FXcNC%2Bp1Wq50fq2Hn6AygYAWl%2FRIXl4nubEwSGJfLvd5qgyfBkw2fRtIJDUb3pAfubXiBtmUfGURH7auU%2FutPojzjsHHQAAABpmY1RMAAAACQAAABAAAAAQAAAAAAAAAAAAHwPoAQHxk%2BXDAAABg2ZkQVQAAAAKeNqlU79LAmEYvgINKzQM9bzZuSlQDhwSHBqL2rxrFIVwaYmCS7xTo6FZHdoFHfS4sf6B2xpEbGsIGhraWrqeh65fenJIHzx8D%2B%2F3Ps%2F7Az5BmHPy%2BfxaNpttE%2BTCoieTyZym0%2Bk3gtxXoCjKtqqqPeC6XC6vQ3gJvBOyLDej0WhYFMWbeDx%2BK0mSPGNQKBR6MHnB%2FQoTFcIEKreJXC6XgLgEsROLxRzcd47jLP0xYGWKgWfw3ekCMNinmGAnMx2kUqkVdHBE8Yz751lOJpN7MCiBh76jmqYFDcM4rtfrZ61WK%2BK3K5hHLMs6MU2z2O12g0Kj0Wjquv4IPMHoys9gOBzqEE%2BAEaD93%2BBrhFqtdl6pVDb8DNB%2BGMKfEX7NFkDwENjxWiJjfGOObdsBr9aqbmv3TJx%2Bd8V8mzDXy6ADjJmANg%2F6%2Ff4m5yXIGXPFY%2BZ6zbaFBJpUB4PBKucEfyDIGXO77DDX929AUHQ3PSJf%2BDdiwyFUvCDI5%2BV9ABJsBKxZnW%2FPAAAAGmZjVEwAAAALAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARwFNioAAAGKZmRBVAAAAAx42qWTu0%2FCUBjFW4mi2ODga%2BSdMLk4OcrLjpLgZlwJz8nEMCHx1YXFAprgbuzAAISp%2F4WDIZg4mLiY6OZiYj0nFgYKAeJNfunX755z7qOpIIwZ0Wh0ORaL3RDWwqwjEomchEKhL8J6oiGfz2%2Bn02kNlIvFogTTVTgc%2FiaoL%2F1%2Bv9Pr9d55PB49GAzuWAJoTqVS7%2BAzm80eYuVNGG9JPB7fgDkJs2GiG4YhDgeUwQd4A%2FLwAj6fb9%2Ftdv8wgDux7ECWZTtWP8pkMnuW9L8xx5BAIJDM5XL2QVfTtAVVVTPVarXQ6XScU9zvms1muwZnLpdrUYDxolKpvIDXWq2mTHLDeI%2BHQSRJevh%2FQP8IoKAoysoUR1gXRVEdHKE%2FcHHz7Xb7AOyOukT2OKfregK1wxLbarVKEPTAI4XD8%2ByZcz1qRwXUQZcCfI1Eo9FYxfs5Yc2eae5SawmAYAsChpSazaYD9THqZ8KaPXOXdWon3hQMSYifCOuZ%2F0Z8nSWseEpYj9P9AmHJ8O96azpYAAAAGmZjVEwAAAANAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfHPRFAAAAGYZmRBVAAAAA542pWTv0sCYRzGLeiHp95y5OrooJ56U2uD5ZQ%2FsKlb%2B7G41Z24mCENORW15KZW4OCgIgT%2BAQ5uDWEGQUvg1hQtXc8DKuQp6gsf%2BN73%2BzzPe%2B97nMUyZamqaovH4zeEtWXRFY1GTyORyBdhPdOQTqcVXdcfU6nUZT6ft8GYA98kFovl3G63Q5blO5%2FP96QoyqYpgGbwqWlaHyH7oVDIiZ1vCY7ghPHA6%2FUaHo%2FnlyGmAO6MgD74QMjO%2BDwQCEQQ8MMQvokpIBwOr8GsImjbMIyl8Xkmk1kOBoO7fr%2F%2FMJlMro0GlUpltVwuHwOt3W6Lc9yvJIrilcPhyLpcrnULjOelUukVvIOLWW4Y7wVBMIgkSQ8LB9jt9v8BwyMUi0UdAfMcYQMh16MjDFen01lpNBp7YGvSJbLHWavVSqC2mmLr9XoWgh54pnB8zt5g1qN2UkABdCloNpuJarUq4TlHWLM3MHepNQVAIEPAkGytVhNQn6B%2BI6zZG7xlgdqZNwXDEcQvhPXCfyO%2BjhU7nhHW03R%2FhFP4ipu3x5gAAAAaZmNUTAAAAA8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHFmXuQAAAYZmZEFUAAAAEHjapZOxSwJxFMevIEvjXOzyFvE%2FCJpOT5eG2hoEbyjUSXRyyt0uz1NwKRoa3KrJwUHlwP%2FAwa1BpKAlaGoJWoK4vl84g7yTS%2FrBBx7v977fe%2B%2FdnSAsOaVSKVQoFK4IY2HVk8%2Fnz3K53Bth7CtoNpv7jUbjHrTa7fY2hBfgnaALXVVVMZlM3iQSCSudTisuA0f8YhjGq2maJ5lMZhdPviaVSkWCsKgoyhf4pImXQYti8Fyv148W71Op1DHEHzRhJy4DTdMCMDkFh7Ztr3lMuU4TjFJER5s%2F2W63GxgOh2XLsqrj8TjstytRFCPRaPRSluVaPB7fEiCugSl4HAwGhp8BxLeSJNkkFovd%2Fd9gPgKoYozwHz6RnV8jzM9kMtmAiQYOvJbIHO9Go1EWcdBli%2FZ1jgEeWLh4z5xzx1F1L4MOmLEAo2R7vV6EOyGMmXPEM9a6DFCwhwKa6P1%2BP8SdIH4ijJlzuuyw1ndTEJSdtzNlvPLfiLcTxBPPCeNldd%2BFTAEoC6ckLQAAABpmY1RMAAAAEQAAABAAAAAQAAAAAAAAAAAAHwPoAQHwWCCpAAABqGZkQVQAAAASeNqlkz9IAnEUx%2B9Ou06jAsXFxb%2FgFk0h0pInTo0eteqgaN4Qubh0CtVYgZ4ILWlNDg4q4tgSOLg1SNgQtrUELUHL9X2QBd7JET34cI979%2F2%2B33s%2FjmEWRDqdtudyuQuCcuavAeFhNpt9JSg3FVSr1U3QUFX1tNlsrkBYAm9EPp9XIpHIaiwWU0E3Ho9vGRmQ%2BBnPl3q9vpdMJl3ofEkUi0WXKIop8BmNRj%2FIxMjgjMSVSmVSq9Vi83V03YXBO5nQSXQGkiTxEO%2FDRNQ0jZ2vK4rCkQlIybK8%2FFNotVp8r9fL9Pv9wnA4XDPbldvtdvr9%2FvNgMHjs8XgEBmIFjMGk2%2B2emBkEAoFrn8%2Bneb1eLRQKNf5vMBsBFDCG6QjhcNgBk98RZjEajZZgIoEdoyUiOJ7nE1ar9QC5TVfF8cs0Bnggk%2Fk6iVmW1ZBqFovl1sjgCjySCUZJtNttJ%2B2EmE6nDo7jZBITyO91p4RoA2IyKXc6HTvtBPkTMRgMjvDJOjrfgDtBELZN%2Fw2YZL5vZ0z57P2C%2FegDt2ND9xJB%2BaLvvgDI3vA4tCR%2FkQAAABpmY1RMAAAAEwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdzvNAAAABkWZkQVQAAAAUeNqlk79LAnEYxq8g8U7u5Kw2%2FwO14KCpQaqtA3%2F1Y3YTCmko%2FEHIJbYZDa5hkDo5SKiIW9DsFiSRNDi0BC1BW1zPA%2BagJ4f0hQ%2F33r33PO%2F3fb93gjBjGYYhZbPZImEszLvS6fRJKpV6J4xtBZVKZb1ard6CQrPZlCDMQfhBMplMLhQKyZFIpBQOh%2B%2Bj0ejGlMFIPKjVam%2B4HiaTyVWYXBO0sAJhHCbf4IsmVgYFisEz4p3JPKrqEH7ShDuxGpqDldHKtmmaC5N5PovFYrsgXq%2FXHeMEb9rtdgKcdTodxW5WXq%2FXEwgErsB5MBh0ChAaoA9eW63WpZ0BhGW%2F32%2F6fL4fTdPK%2FzeYtwVd11WYFMct%2FK1er7cEkwOwZTVErEW3272nKMoRYudUFtvPsw3wRJPJPMUul8skMLmzMrgBLzRBK%2FuNRmOZMyHD4dAjiuIxxZIkmbIsP07tEqI1iGmS56fMmSAekG63e8pNsDLED6qqbtr%2BGzBJjE6nz3juvxGnI6L6BWE8671fIqf6HRySx%2B0AAAAaZmNUTAAAABUAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ASBOgAAAWxmZEFUAAAAFnjaY2DAAerr67na29s7QBjEZiAVtLa25ra0tDwGYRCboIZt27bpbdmyZfbmzZsbz5w5wwXUWA3U%2BByE29raqkNDQ3ni4uL6gXhtbGysCYYBQI0gzTeBhtwGGhYCdLYIUHM3CPf09IjExMTEAfEnoOZ3QHotNgMaQZqB%2BDIQO6LLA232BGp8BTIE5BIMA4DOZgVqDAVp%2Fv%2F%2FPyO6PEgMZAjQBfGrVq1ig0uAOEBN6UBcAnQ6H6Gw0tLSEjI3N%2B%2B0sLCo9PDwYGcAaqwH4usg5wO90ULIAKDGWUAD%2FgHxT1tb21mUG0CqF6KiogQtLS0RXiA2EIGASVJSMlBCQiITyOYgORqBGoNERUX%2FgzCQPZ9gQlq3bp0wKExA%2BNGjR0LCwsKZYmJiYAOA9H4MVyIn5U2bNnGBwgTIvgPCQLkSoBJ%2BkM1AzfukpKSsCOYNoCHp0Ni5DmKTnBuBscMJtL0BhEFsXOoAUt0FcAi6YW0AAAAaZmNUTAAAABcAAAAQAAAAEAAAAAAAAAAAAB8D6AEBHZJS0wAAAXNmZEFUAAAAGHjaY2DAAXp7ezmnTp3aCsIgNgOpYPLkydlAzfdAGMQmqGHbtm16W7Zsmb158%2BbGM2fOcAE1VU6ZMuUxCE%2BbNq0iKyuLB4h7gXhVXl6eMYYBQI0gzTeBhtwGGhbS09MjAtTcCcIzZ84UycjIiM3MzHwPxK9BhmAzoBGkGYgvA7EjujxQkwcQPwPidyCXYBgAdDYrUGMoSPP%2F%2F%2F8Z0eVBYtnZ2e5AzbGrVq1ig0uAOEBN6UBcAnQ6H6GwsrCwEHJxcWkH4nIPDw92BqDGeiC%2BDnI%2B0BsthAwAapzh7Oz828nJ6Zubm9t0kg0AakY1gFQvREVFCbq6uiK8QGwgAgGTsrJygJKSUgaQzUFyNII0Kygo%2FFNUVPwPNGQO3oS0b9%2B%2BYKCQFDMz81IQ5uLiklRVVU0HaYbiPRiuRE7KQEkuoMapoOgHYRDbysqKF2QzSLOGhoYlwbwB1NSCZEALyblRVFSUBwhWgjCIjUsdAJsS8AnByX%2BOAAAAGmZjVEwAAAAZAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfDhY48AAAF5ZmRBVAAAABp42mNgwAFWrVrFuWTJkiYQBrEZSAVAjRmLFy%2B%2BBcIgNkEN27Zt09uyZcvszZs3N545c4YLqKkMqPk%2BCIPYWVlZPBUVFV3l5eXLq6qqjDAMAGoEab4JNOQ20LCQhQsXCgM1t4HwunXrhEtLS6PLyspeAQ14DjIEmwGNIM1AfBmIHdHlgZrdgRofAfErkEswDAA6mxWoMRSk%2Bf%2F%2F%2F4zo8iAxoEY3II4GBiobcmizATWlA3EJ0Ol8hMLKxsZGMCAgoBWISz08PNgZgBrrgfg6yPlAb7QQMgCocaqfn983f3%2F%2Fj0FBQVMoN4BUL%2BTn5wsEBga2wL1AbCDW19czGRoa%2Bunq6qbJy8tzkByNQI3%2BOjo6P4H4v56e3iy8CWn37t3BQCEpHh6eJSDMxcUlqa%2BvnwrSrK2t%2FQ9o2E68SRnoBS6gxslAjf9BmJeXd5KVlRUvyGaQZiMjIwuCeQOoqRHJgCaSc6OoqCiPsLDwMhAGsXGpAwBEpviQbN5BdAAAABpmY1RMAAAAGwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdd7BmAAABbmZkQVQAAAAceNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWrYtm2bHlDxbKCNjUANXEB2CZB9B4RB7Pr6ep7W1tYOIF7S3t5uiGEAUCFI802g4ttAw0LWrVsnDOS3gPDu3buFm5qaolpaWp4DDXgCMgSbAY0gzUB8GYgd0eWbm5vdgAbchxrSgWHAmTNnWIEaQ0Ga%2F%2F%2F%2Fz4guDxIDanQF4ihgoLIhhzYbUBMowEqATucjFFbe3t6CcXFxTbGxscW5ubnsDECN9dDQvg3yLyEDgBonx8TEfALit0CDJlJuAKleyM%2FPF0DxArGBCARM1tbWvhYWFiny8vIcJEcjUKOvubn5VyD%2Ba2lpOR1vQgImnGAuLi5JcXHxRSAsKioqAbQ9GaQZiH8BDduGNykDvcAF1DRBTEzsPwgDDZng5%2BfHC7IZpNnGxsacYN6QkJCoBxryH4RBbJJzo5aWFo%2BsrOxiEAaxcakDADqJAhkT68NIAAAAGmZjVEwAAAAdAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfC9whwAAAGhZmRBVAAAAB542qWTPUgCcRjG7049zcQEFzc%2FEASHaGpqyTucAhcPnGsIv4bANVSoEKQI%2FFhajJocHDwRwaWlza0hwoagrSVoCVqu54EiuVNE%2BsODz93%2F%2F%2FzufV%2FvBGHB6na7a7quVyh6YdXV7%2FcPB4PBI0W%2FNDAcDjdx%2BApPrCLghi%2FBP1P09Xp9vdVqnTabzWtoywLAQYafcHgKWLrX6%2FlxfUKNx2N%2Fo9HIIPgKyAsh8wBVhqEHaNe83263VUCmhEBnFsBkMnEgqDFsGIZo3uc9BBWAMvCO2WnLCHFgJZTuXTarVCrly2azlVwud1QsFp0CguWfaU%2FZ7zIAgpcAvENv%2BXz%2B4v%2BA3xZGo1EJvfmWAWq12gaCfy3MLDdUkGU5jV%2FJHCyXy1IymdxLJBIH0WjUaSHbbLZbDlsURQMQzbzPsKIoH9CXqqoty18kSdI9LWW32wvxeDwQDoc7VDAYDACwzzAq%2BARAt1Tgcrl2UMUddINLL8o8R9igIpHIhaZpHj6ZYcC25w5o9gVC6DgUChkU%2FcpfI1rwxGKxDkW%2F6Nw37k3xuSzoMScAAAAaZmNUTAAAAB8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHSsR9QAAAZ9mZEFUAAAAIHjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlq2LZtmx5Q8WygjY1ADVxAdgmQfQeEQexFixZxL168uBmI5wHZ%2BhgGABWCNN8EKr4NNCxk3bp1wkB%2BCwjv3r1bGKgxbMmSJfeA9B2QIdgMaARpBuLLQOyILr9s2TInoAHXoIY0Yxhw5swZVqDGUJDm%2F%2F%2F%2FM6LLg8SATncCGhQGZLMihzYbUBMowEqATucjFFbx8fECFRUVteXl5fm5ubnsDECN9dDQvg3yLyEDysrK%2BoCaXwPpZ5WVld2UGwDzAtD5JUC%2FCRAyYObMmfwoXkACXJycnFn8%2FPzBQDYTtkAMCgry8vPzS1RRUWHHMJmPj28hNzf3fxCGGoICAgMDvf39%2Fd8BDfgWEBAwCcN0Xl7eQ1xcXGADgIZlm5ubi%2Bvq6s4FYS0tLQmg7QkgzUD8GWjQBgwXCAoKWgMN2Q9yiZCQEB9QY7eOjs5%2FEAaxs7KyeEA2gzQDXWNKMG8ANVVra2v%2FBWEQm%2BTcqKenx21kZDQXhEFsXOoAfEH6IOWuH2wAAAAaZmNUTAAAACEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB88%2BqfQAAAYJmZEFUAAAAInjapVOxSwJhHLVAwwoN40692bkpODlwSLihschNrzEUwsUlCi65OzUamrWhXdDhPBzrH7itIcK2hqChoa2l6z24QjzlkD543Lvf7733%2Fb4Pvkhkwer3%2B%2FHRaHRJkEeWXbZtnziO80SQhxrG4%2FEOxLfYsQnDOngD%2FIUgZ409aqgNBKBJ8zMEEwiOhsPhNv5Ngpw19qihdl4A0yfAI7A322fN7zGkGQhwXTeKZolCz%2FNWZvus%2BSEl8Oj0bcdQ5IU1MGYi7K7q9fqWYRgXlmWd6roe42i6f9sczQwLgPHaNM034LXdbnf%2BH%2FB7BIzfwNmSYQHdbjfZarXO%2F44wteKCIFSz2ewB%2BOq8S9Q0bb9SqRzncrm1QHImk7lDgEeAH872aS6Xy%2B%2FAJ%2FhNIF0UxQea8WVAtVgspvP5fI%2BQZTkNk0YzJvjAdxCYQJIkBeZ7TpJKpRKKonRg%2FPZxVavVNrkzMEDIbujbwM5nMH4R5Eu%2FRlVVNwqFQo8gX6T7AfzqBKx3VEm7AAAAGmZjVEwAAAAjAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR5ZeZQAAAGNZmRBVAAAACR42qWTvUsCYRzH75Ky7LCht1E9FZxamhp9ObsxobZoFT11CqLJpLdbWjq1oPboBgcVp%2FsvGiIMGoKWoLaWoOv7BS3qlEt64APf5%2Fn9ft%2Ff88IjCEOGaZpTrVZrj1ALo45ms5ltt9u3hNq1oNPpLCH5Ah0rKPBBb0PfE2quMcYc5joMEGTxHRK6SFhvNBqzmB8Qaq4xxhzmDjKgexfcgPjvONd6MZpUHAa2bfssy2KXOLQ4IC72TDagx78CgUBg0uPx7IuiaGA673ZXuq7PGIaxCzS8zoQgSZLJBgRGV24G9Xpdr1arj%2BChVqsd0uD6Xwb9I4BTxOf%2B8Nx%2BFH4foT%2BKxaI3Go1mw%2BHwGqZjgy5R07TVXC63paqq1%2BEsy%2FJlKBSyg8HgR8%2Fkx8jn8yp4Ai%2FgxOGOYosGBGbZTCazkEqlzkkikVgsFAqb6P4KnmFgOnYQi8VWaMKdRCIRPwqPksnkO4E%2BLpfLEjuzuFQqLbv%2BDRTtoPMboR75NyqKMp1Op88I9bC8T5%2BU8PAz88iaAAAAGmZjVEwAAAAlAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfOTC%2B4AAAGWZmRBVAAAACZ42qWTu0%2FCUBjFwcQHhXZpZGVkAMpjcmVAmSwQnezqY2FTSlgQQxxk0uiiG6AmDAxASEz4AxjYHIxiYuJiwuZkXKznJMBAIZV4k5Oce8%2F3%2FW7vba7NNmPUajVHs9k8puht845Go7HfarWeKHrLhna7raD4BjsW0CDAH8K%2FUvRcY8Ya1poACNn8jII%2BCrbq9bqMeZGi5xoz1rB2GoD0PvQIRSdzrg0zQgomgGEYjk6nw12i8PYpuX0I2e71eovjwOPxrIiiWHC5XBeYrlrdVaVSkcrlsl6tVg%2Fwd5ZssizfCYJgUIDc%2FgFwCr1BL4Cc%2FB8wOoIkSefIZStAt9uV0JgZH2E00un0cjAY3AuHw5v5fH5h2iVms9l1Xde1eDy%2BbCIrinLt9%2FsN6DsUCqmTeSaT2UDzOzQA6MwECAQCDz6f74cQ%2BF1N09yJROKKisVibjTtADIA4AO6NwEikcgaIfwSr9crJpPJoqqqX0MVS6WSkzuzOZfLRSzfBnY%2BQuMnRT%2F3a8QRnKlU6pKin1X3C2Zv%2BIepEdLNAAAAGmZjVEwAAAAnAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR4F2AcAAAGGZmRBVAAAACh42mNgwAFWrVrFuXnz5gYQBrEZSAWbNm1K37Jly3UQBrEJati2bZseUPFsoI2NQA1cQHYJkH0HhEFskBhIDqQGpBbDAKAkSPNNoILbQAUh69atEwbyW0AYxAaJgeRAakBqsRkAMv02EF8GYkd0eZAYVA5kSCOGAf%2F%2F%2F%2BfcuXMnyBZHIJsRizwj1JDQM2fOsMIl5OXlOSQkJOpFRUUnALkiRIQVHyhMgDgdGDtsDLKysouBmv%2BDsLi4%2BCJCBoDCBOpVUAzVU24AzAtAzRN4eXmFCRlw4sQJPqA3EF6AgdzcXHYrK6sUa2trXyCXCVsgtra2ugJxVGhoKBuGyZaWltPNzc3%2FAvFXqCEooLm52a2lpeU%2BED8HGtKBYYCFhcU2oOZfIEOA7BSgi0RjY2Mng3BgYKBYW1tbJFTzEyBegmGAjY2NOcgQkEuAXuGNi4trjImJ%2BQTFTd3d3dwgm0Ga29vbDQnmDaDNxUCNb0EYxCY5N6alpXEBXTERhEFsXOoALlABImtNWOoAAAAaZmNUTAAAACkAAAAQAAAAEAAAAAAAAAAAAB8D6AEB83bpWwAAAaRmZEFUAAAAKnjaY2DAAVatWsW5efPmBhAGsRmIAf%2F%2F%2F2eEsTdt2pS%2BZcuW6yAMYhPUzMHBYcPMzHwAiBcDufw7duwoBtp%2BB4SBhpQADeECshuB7Nnbtm3Tw7CZiYnpKIgJwkB27qNHj4SAGlpAeN26dcJATSFAzbeB%2FJtAPBvDBUCbl4A0MzIy%2FmdjYwtBlwdqdgTiy1BDGrH5gpOFhSUbqpkJW%2FhADQk9c%2BYMK1xCXl6eQ0VFpU5ZWbnPwsJCiFBYAb3CBwoTIE4Hxg4bg7q6%2BkIFBYX%2FioqK%2F4GGLCBkAChMQN6AxlA95QbAvKCkpNQnJSUlTMiAEydO8AG9gfACDOTm5rK7ubklAbFPfX091kCcMmWK8%2BTJkyNCQ0PZMEx2cXGZ6uzs%2FAuIP4EMQZefNm2aC1DzbaAhj4G4DZsBm52cnL5DDUmqrKwUzcrKmgDCiYmJojNmzAgHaZ46deoDIL0QwwCgrWYgQ0AusbKy4s3JyanPzMx8D8UNixYt4gZqbgVpBmIDgnkDaHMhUOMrEAaxGUgFaWlpXECN%2FSAMYuNSBwBOIvA4wVgLqgAAABpmY1RMAAAAKwAAABAAAAAQAAAAAAAAAAAAHwPoAQEe4DqyAAABkWZkQVQAAAAseNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWoQFBS05uXl3c%2FHx7cQyOXfsWNHMdD2OyAMNKQEaAgXkN0IZM%2Fetm2bHorm%2F%2F%2F%2FMwI1H%2BLi4vrPzc39n5OTM%2FvRo0dCQA0tILxu3TphoKYQoObbQP5NIJ6N4QKQzSDNIMzPzx%2BMLg%2FU7AjEl6GGNGLzBQfQkCyoZiZ0SZAroYaEnjlzhhUuYW9vz6Grq1sNxN3e3t6ChMIK6BU%2BUJgAcTowdtgYjIyM5mpra%2F%2FV0dH5DzRkLiEDQGEC8gY0huopNwDJCz0yMjJCJHsBKeWxBQUFJQCxFyjAsAXiokWLnBYvXhxWX1%2FPhmFyQEDAJD8%2Fv2%2F%2B%2Fv7vAgMDvdHlgRqdlyxZcg2I7wHZzRgGADVuABrwGWpIAtAWkbKysj4Qzs3NFQXZDNV8B4jnYRgAtNUUZAjUJbwVFRW15eXlr0EYaEgtKCmDbAZpBnpFn2DeAGrMB2p8BsIgNsm5EegFrsrKym4QBrFxqQMANXn6HYPJ7D8AAAAaZmNUTAAAAC0AAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ypIyAAAAWtmZEFUAAAALnjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlqkJKSshITE9snISExH8jl37ZtWwnQ9jsgDDSkBGgIF5DdCGTPBsrpoWj%2B%2F%2F8%2FI1DzflFR0f9A%2Br%2BwsHDmo0ePhIAaWkB43bp1wkBNIUDNt4H8m0A8G8MFIJtBBoAwkB2ELg%2FU7AjEl6GGNGLzBQdQY6akpGQgkM2ELglyJdSQ0DNnzrDCJTw8PNgtLCwqLS0tO6OiogQJhRXQK3ygMAHidGDssDHY2trOMjc3%2FwnE%2F4AGzSJkAChMQN6AxlA95QbAvAA0oFNLS0uIZC8gpTy22NjY%2BLi4OE9QgBEdiDAA1NgfExPzCYhfgQwhORqBGtcCXfAOakhcT0%2BPSGtrazcI19fXixBMSEDNJkCb14JcEhoaytPW1lYN1PwchFtaWqqBzsadlLEBoMZcoMbHIAxik5wbgc7mam9v7wBhEBuXOgDZvgVwR0IA4QAAAABJRU5ErkJggg%3D%3D";

/* -------------- */
/* les constantes */
/* -------------- */

const reho = {
  st: {
    http: "http://reho.st/",
    https: "https://reho.st/",
  }
};
const hostname_re = /^https?:\/\/(?:[^;\/?:@=&]*\.)?([^.;\/?:@=&]+\.[^.;\/?:@=&]+)\/.*$/i;
const image_re = /^.*\.(?:gif|jpe?g|png|webp|svg)(?:[&?].*)?$/i;
const gif_re = /^.*\.gif(?:[&?].*)?$/i;
const gifv_re = /^.*\.gifv(?:[&?].*)?$/i;
const webp_re = /^.*\.webp(?:[&?].*)?$/i;
const svg_re = /^.*\.svg(?:[&?].*)?$/i;
const rehost_list = [
  reho.st.https,
  "https://rehost.a-suivre.com/",
  "https://rehost.a-suivre.org/",
  "https://rehost.netlib.re/",
  "https://rehost.codelib.re/",
  "https://rehost.changeip.org/",
  "https://rehost.mynumber.org/",
];
const char_list = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const test_rehost_img_src = "http://roger21.free.fr/test/test-sar-";
const test_rehost_img_src_ext = ".png";
const textarea_width_default = "225px";
const textarea_height_default = "145px";

/* ---------------------- */
/* les options par défaut */
/* ---------------------- */

var rehost_type_default = "auto"; // auto ou perso
var rehost_auto_default = reho.st.https;
var rehost_perso_default = "https://images.weserv.nl/?n=-1&url=";
var stealth_rehost_default = false;
var no_rehost_gif_default = true;
var no_rehost_gifv_default = true;
var no_rehost_webp_default = true;
var no_rehost_svg_default = true;
var host_list_default = "2shared.com\n4cdn.org\n4chan.org\n4gifs.com\n4plebs.org\n9cache.com\nabm-enterprises.net\nabricocotier.fr\nac.uk\nafrojacks.com\nagoravox.fr\nakamaihd.net\nakamaized.net\nalkaspace.com\nall-that-is-interesting.com\nallmoviephoto.com\nalternatehistory.com\namazonaws.com\nambinet.pl\nangelfire.com\nanimeclick.it\nanub.ru\narchive-host.com\narwen-undomiel.com\nassiettesgourmandes.fr\naufeminin.com\nauto-moto.com\nazurs.net\nb3ta.com\nb3tards.com\nbangkokpost.com\nbdfci.com\nbighugelabs.com\nbleedingcool.net\nblogger.com\nblogomaniac.fr\nblogspot.com\nboomsbeat.com\nboredpanda.com\nbouletcorp.com\nbrsimg.com\nburrardstreetjournal.com\nbusinessinsider.com\ncanardpc.com\ncannaweed.com\ncasimages.com\ncavemancircus.com\ncdn.li\ncdninstagram.com\ncelebritysizes.com\nchickencrap.com\nchillmag.fr\nchzbgr.com\ncinefaniac.fr\ncinemapassion.com\ncinemotions.com\nclien.net\ncloudfront.net\nco.nz\nco.uk\ncomicartcommunity.com\ncomplex.com\nconcordefly.com\ncoolfunpics.com\ncoolmemes.net\ncopypast.ru\ncosmovisions.com\ncrif.org\ncsf-sonorisation.fr\ndailyscene.com\ndailysilvernews.com\ndandies.fr\ndavisenterprise.com\ndefensereview.com\ndemotivateur.fr\ndeviantart.com\ndeviantart.net\ndosgamesarchive.com\ndrole.net\ndrugs-plaza.com\ndukascopy.com\ndvdactive.com\ndvdbeaver.com\ndvdrama.com\ndynamictic.info\neatmedaily.com\nebaumsworld.com\necho.cx\necranlarge.com\nedgecastcdn.net\nedtruthan.com\negaliteetreconciliation.fr\negloos.com\negotastic.com\nehowa.com\nelbakin.net\nencyclopediadramatica.com\nenglishrussia.com\netsystatic.com\nevilox.com\nexaminer.com\nexplosm.net\neyetricks.com\nezgif.com\nfacebook.com\nfairfaxunderground.com\nfanpop.com\nfbcdn.net\nfilmschoolrejects.com\nfjcdn.com\nflickr.com\nfohguild.org\nfond-ecran-image.com\nfond-ecran-image.fr\nfoodbev.com\nfoundshit.com\nfree.fr\nfreeimagehosting.net\nfunkyimg.com\nfunlol.ru\nfunnyjunk.com\nfuntasticus.com\ngamefabrique.com\ngamefaqs.net\ngannett-cdn.com\ngarageclothing.com\ngentside.com\nggpht.com\ngidilounge.com\ngiftube.com\nglitterphoto.net\ngoldenmoustache.com\ngopix.fr\ngreluche.info\ngrospixels.com\ngtsstatic.com\ngurumed.org\nh6img.com\nhaltbrac-defense.fr\nhaluze.sk\nhiboox.com\nhkgn.info\nhomotron.net\nhorrortalk.com\nhostelworld.com\nhostingpics.net\nhotchyx.com\nhotflick.net\nhumour.com\nhypeful.com\ni.pbase.com\niapdesign.com\nicdn.pro\niespana.es\nifengimg.com\nimagehaven.net\nimages-droles.com\nimagescream.com\nimageshack.us\nimagevenue.com\nimagup.com\nimportantwebsite.com\nindustrytap.com\ninexes.com\ninstagram.com\nizismile.com\njeuxmangas.net\njeuxvideo.com\njj.am\njkbeauty.com\njoelecorbeau.com\njournalofmusic.com\njoystiq.com\njudgehype.com\nkapook.com\nkoreus.com\nleboncoin.fr\nledeguisement.com\nleenks.com\nlelombrik.net\nlequipe.fr\nlesblaguesdroles.com\nley925.com\nlicdn.com\nliveinternet.ru\nlivejournal.com\nlivejournal.net\nliveleak.com\nlivenationinternational.com\nlolpix.com\nloveroms.com\nmac.com\nmalgusto.com\nmarmucommerce.com\nmask9.com\nmaxisciences.com\nmedia-imdb.com\nmegaportail.com\nmemearchive.net\nmemecenter.com\nmetalorgie.com\nmil.ru\nmission0ps.com\nmmo-champion.com\nmonde-diplomatique.fr\nmondespersistants.com\nmotherlessmedia.com\nmoviecovers.com\nmovieia.info\nmoviesmedia.ign.com\nmu.nu\nmuchosucko.com\nmxstatic.com\nmyblog.de\nmypixelz.fr\nmyspace.com\nmyspacecdn.com\nnatgeo.fi\nnaver.net\nnet.co\nnewmuse.com\nnews-de-stars.com\nniketalk.com\nnnm.ru\nno-ip.org\nnocookie.net\nnoelshack.com\nnofrag.com\nnonexiste.net\nnudebabes.ws\noddee.com\nompldr.org\norg.uk\noritive.com\nossiane.net\nover-blog.com\novh.net\nparanoias.es\npeniche-demoiselle.com\npete.com\nphautom.com\nphotobucket.com\nphotographyblog.com\nphotomonde.fr\nphotorumors.com\npigroll.com\npinimg.com\npiximus.net\nplayfire.com\npluizuit.be\npostimage.org\npostimg.org\nprogourmet.fr\nquartermoonsaloon.com\nquenelplus.com\nquizz.biz\nradikal.ru\nratemyeverything.net\nreddit.com\nreplikultes.net\nreversegif.com\nrockingfacts.com\ns2ki.com\nsaintseiyapedia.com\nsankakustatic.com\nse7en.ru\nseries-80.net\nservimg.com\nsfsignal.com\nsharenator.com\nshowlinephoto.com\nskipsfotografen.no\nskoftenmedia.com\nskyrock.com\nslightlywarped.com\nsmog.pl\nsmugmug.com\nsoupcdn.com\nspam.com\nspi0n.com\nsplitscreenpodcast.com\nsports.fr\nstarer.ru\nstereomaker.net\nsts116.com\nsyn.fr\nt-nation.com\ntattoo-tatouages.com\ntechno-science.net\ntheexpressionist.com\nthehighdefinite.com\ntheladbible.com\ntheplanetstoday.com\ntheshadefiles.com\nthg.ru\nthisnext.com\nthreadbombing.com\ntickld.com\ntinypic.com\ntonmo.com\ntoyzoo.com\ntqn.com\ntribalfusion.com\ntruffaut.com\ntryxy.net\ntu-dresden.de\ntumblr.com\ntuxboard.com\ntvmuse.com\ntwimg.com\ntwitpic.com\nucoz.com\nucrazy.ru\nufl.edu\nufunk.net\nuncyc.org\nuppix.net\nupsimple.com\nuserapi.com\nuuuploads.com\nvatican.va\nvermontdailynews.com\nveroniqueetlachouquetterie.fr\nviepratique.fr\nvox-cdn.com\nwallbase.cc\nwallbase2.net\nwallpaper-s.org\nweb-libre.org\nweb-mobile.net\nwhatthemovie.com\nwhitesites.com\nwordpress.com\nworldofwarcraft.com\nwp.com\nxin70.info\nxkcd.com\nxs.to\nyahoo.com\nyandex.ru\nyimg.com\nyionel.fr\nyoupimobile.com\nytmnd.com\nzegagnant.com\nzepload.com\nzgeek.com\nzicabloc.com\nzigonet.com\nzimagez.com\nzimbio.com\nzooplus.de\nzupimages.net";
var white_list_default = "hardware.fr\nreho.st";

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var img_burger;
var rehost_type;
var rehost_auto;
var rehost_perso;
var stealth_rehost;
var no_rehost_gif;
var no_rehost_gifv;
var no_rehost_webp;
var no_rehost_svg;
var host_list;
var white_list;
var the_rehost;
var real_white_list;
var test_result;
var input_timer;
var rehost_close;

/* ---------------------- */
/* les fonctions globales */
/* ---------------------- */

// fonction d'extraction du nom de domaine d'une url
function get_hostname(p_url) {
  let l_matches = hostname_re.exec(p_url);
  return (l_matches && l_matches.length > 0) ? l_matches[1] : null;
}

// fonction de transformation d'une liste (chaine) en liste (tableau) avec nettoyage et de tri
function get_list_from_string(p_string) {
  return p_string.trim().split("\n").map(function(p_elmt) {
    return p_elmt.trim();
  }).sort();
}

// fonction de transformation d'une liste (tableau) en liste (chaine)
function get_string_from_list(p_list) {
  return p_list.join("\n");
}

// fonction de récupération du rehost en fonction des paramètres
function get_rehost() {
  return rehost_type === "auto" ? rehost_auto : rehost_perso;
}

// fonction de désactivation de l'action par défaut sur un événement
function prevent_default(p_event) {
  p_event.preventDefault();
}

/* -------------------------- */
/* les fonctions de réhostage */
/* -------------------------- */

// fonction de la gestion du stealth rehost
function do_stealth_rehost() {
  let l_alt_title = "Stealth rehost: ";
  for(let l_prefix of [reho.st.http, reho.st.https]) {
    let l_imgs = document.querySelectorAll("img[src^=\"" + l_prefix + "\"]");
    for(let l_img of l_imgs) {
      let l_new_src = the_rehost + l_img.getAttribute("src").substr(l_prefix.length);
      l_img.setAttribute("src", l_new_src);
      l_img.setAttribute("alt", l_alt_title + l_new_src);
      l_img.setAttribute("title", l_alt_title + l_new_src);
    }
    let l_links = document.querySelectorAll("a[href^=\"" + l_prefix + "\"]");
    for(let l_link of l_links) {
      let l_href = l_link.getAttribute("href");
      let l_new_href = the_rehost + l_href.substr(l_prefix.length);
      l_link.setAttribute("href", l_new_href);
      l_link.setAttribute("title", l_alt_title + l_new_href);
      if(l_link.firstChild && l_link.firstChild.nodeType === 3 &&
        l_link.firstChild.nodeValue.trim() !== ""
        /*&& l_link.firstChild.nodeValue.indexOf(l_href.substr(0, 34)) === 0*/
      ) {
        l_link.insertBefore(document.createTextNode(l_alt_title), l_link.firstChild);
      }
    }
  }
}

// fonction de réhostage des images et des liens
function do_rehost() {
  let l_alt_title = "Rehost: ";
  let l_alt_title_error = "UnRehost: ";
  let l_imgs =
    document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable tbody " +
      "tr.message td.messCase1 + td.messCase2 > div[id^=\"para\"] " +
      "img[src]:not([src^=\"data:image\"])");
  for(let l_img of l_imgs) {
    let l_src = l_img.getAttribute("src");
    if((!no_rehost_gif || !gif_re.test(l_src)) &&
      (!no_rehost_gifv || !gifv_re.test(l_src)) &&
      (!no_rehost_webp || !webp_re.test(l_src)) &&
      (!no_rehost_svg || !svg_re.test(l_src))) {
      let l_host = get_hostname(l_src);
      if(l_host && !real_white_list.includes(l_host) && host_list.includes(l_host)) {
        let l_new_src = the_rehost + l_src;
        if(rehost_type === "perso") {
          l_new_src = the_rehost + encodeURIComponent(l_src);
        }
        l_img.dataset.host = l_host;
        // gestion du déréhostage en cas d'échec
        l_img.addEventListener("error", function() {
          if(this.getAttribute("src") === l_src) {
            //console.log("SAR UnRehost FAIL " + l_src);
            return;
          }
          //console.log("SAR UnRehost " + l_src);
          l_img.setAttribute("src", l_src);
          l_img.setAttribute("alt", l_alt_title_error + l_src);
          l_img.setAttribute("title", l_alt_title_error + l_src);
        }, false);
        // réhostage
        l_img.setAttribute("src", l_new_src);
        l_img.setAttribute("alt", l_alt_title + l_new_src);
        l_img.setAttribute("title", l_alt_title + l_new_src);
      }
    }
  }
  let l_links =
    document.querySelectorAll(
      "div#mesdiscussions.mesdiscussions table.messagetable tbody tr.message td.messCase1 + " +
      "td.messCase2 div[id^='para'] > span:not(.signature) a.cLink[href], " +
      "div#mesdiscussions.mesdiscussions table.messagetable tbody tr.message td.messCase1 + " +
      "td.messCase2 div[id^='para'] > div:not(.edited) a.cLink[href], " +
      "div#mesdiscussions.mesdiscussions table.messagetable tbody tr.message td.messCase1 + " +
      "td.messCase2 div[id^='para'] > *:not(span):not(div) a.cLink[href]");
  for(let l_link of l_links) {
    let l_href = l_link.getAttribute("href");
    if((!no_rehost_gif || !gif_re.test(l_href)) &&
      //(!no_rehost_gifv || !gifv_re.test(l_href)) &&
      (!no_rehost_webp || !webp_re.test(l_href)) &&
      (!no_rehost_svg || !svg_re.test(l_href))) {
      let l_host = get_hostname(l_href);
      if(l_host && image_re.test(l_href) &&
        !real_white_list.includes(l_host) && host_list.includes(l_host)) {
        let l_new_href = the_rehost + l_href;
        if(rehost_type === "perso") {
          l_new_href = the_rehost + encodeURIComponent(l_href);
        }
        l_link.setAttribute("href", l_new_href);
        l_link.setAttribute("title", l_alt_title + l_new_href);
        if(l_link.firstChild &&
          l_link.firstChild.nodeType === 3 && l_link.firstChild.nodeValue.trim() !== ""
          /*&& l_link.firstChild.nodeValue.indexOf(l_href.substr(0, 34)) === 0*/
        ) {
          l_link.insertBefore(document.createTextNode(l_alt_title), l_link.firstChild);
        }
      }
    }
  }
}

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // style pour les boutons (burger)
  "img.gm_hfr_sar_r21_button{cursor:pointer;width:16px;height:16px;}" +
  // styles pour la fenêtre d'aide
  "#gm_hfr_sar_r21_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-weight:bold;text-align:justify;" +
  "font-size:11px;z-index:1003;}" +
  "img.gm_hfr_sar_r21_help_button{cursor:help;vertical-align:text-bottom;}" +
  // styles pour la fenêtre de configuration
  "#gm_hfr_sar_r21_config_background{position:fixed;left:0;top:0;background-color:#242424;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;z-index:1001;}" +
  "#gm_hfr_sar_r21_config_window{position:fixed;min-width:400px;height:auto;background:#ffffff;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;z-index:1002;}" +
  "#gm_hfr_sar_r21_config_window div.gm_hfr_sar_r21_main_title{font-size:16px;text-align:center;" +
  "font-weight:bold;margin:0 0 10px;}" +
  "#gm_hfr_sar_r21_config_window fieldset{margin:0 0 8px;border:1px solid #888888;" +
  "padding:6px 10px 10px;}" +
  "#gm_hfr_sar_r21_config_window legend{font-size:14px;}" +
  // styles pour les elements des formulaires
  "#gm_hfr_sar_r21_config_window input[type=\"radio\"]{margin:0 0 2px;vertical-align:text-bottom;}" +
  "#gm_hfr_sar_r21_config_window input[type=\"text\"]{padding:1px 4px;border:1px solid #c0c0c0;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;box-sizing:border-box;" +
  "height:20px;}" +
  "#gm_hfr_sar_r21_config_window input[type=\"checkbox\"]" +
  "{margin:0 0 1px;vertical-align:text-bottom;}" +
  "#gm_hfr_sar_r21_config_window select{padding:0;margin:0;border:1px solid #c0c0c0;width:250px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;appearance:none;height:20px;" +
  "-moz-appearance:none;-webkit-appearance:none;background-image:url(\"" + img_select + "\");" +
  "background-repeat:no-repeat;background-position:right 5px center;box-sizing:border-box;}" +
  "#gm_hfr_sar_r21_config_window select option{appearance:none;-moz-appearance:none;" +
  "-webkit-appearance:none;font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;}" +
  "#gm_hfr_sar_r21_config_window textarea{margin:0;padding:0 2px;border:1px solid #c0c0c0;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;display:block;" +
  "min-width:" + textarea_width_default + ";min-height:" + textarea_height_default + ";}" +
  // styles pour les p et les div
  "#gm_hfr_sar_r21_config_window p{margin:0 0 0 4px;}" +
  "#gm_hfr_sar_r21_config_window p.gm_hfr_sar_r21_no_margin{margin-left:0;}" +
  "#gm_hfr_sar_r21_config_window p:not(:last-child){margin-bottom:4px;}" +
  "#gm_hfr_sar_r21_config_window p.gm_hfr_sar_r21_button_p_flex{display:flex;" +
  "justify-content:center;align-items:center;}" +
  "#gm_hfr_sar_r21_config_window p.gm_hfr_sar_r21_button_p_flex > *{display:block;}" +
  "#gm_hfr_sar_r21_config_window img.gm_hfr_sar_r21_test_img{margin:0 4px 0 0;" +
  "width:16px;height:16px;}" +
  "#gm_hfr_sar_r21_config_window img.gm_hfr_sar_r21_reset_img{cursor:pointer;margin:0 0 0 4px;}" +
  "#gm_hfr_sar_r21_config_window div.gm_hfr_sar_r21_rehost_choice_div_flex{display:flex;" +
  "align-items:center;}" +
  "#gm_hfr_sar_r21_config_window div.gm_hfr_sar_r21_rehost_choice_div_img_flex{display:flex;" +
  "align-self:stretch;justify-content:center;align-items:center;flex-grow:1;order:-1;" +
  "margin:0 10px 0 0;border:1px solid #c0c0c0;}" +
  "#gm_hfr_sar_r21_config_window img.gm_hfr_sar_r21_test_rehost_img{display:block;height:auto;}" +
  "#gm_hfr_sar_r21_config_window div.gm_hfr_sar_r21_test_rehost_img_alt{font-weight:bold;" +
  "color:#df5f5f;display:none;height:auto;cursor:default;}" +
  "#gm_hfr_sar_r21_config_window p.gm_hfr_sar_r21_stealth_rehost_p{margin-top:5px;}" +
  "#gm_hfr_sar_r21_config_window " +
  "div.gm_hfr_sar_r21_lists_div_flex{display:flex;justify-content:space-between;}" +
  "#gm_hfr_sar_r21_config_window div.gm_hfr_sar_r21_no_rehost_div_flex" +
  "{display:flex;justify-content:space-around;}" +
  "div.gm_hfr_sar_r21_save_close_div{text-align:right;margin:16px 0 0;}" +
  "div.gm_hfr_sar_r21_save_close_div div.gm_hfr_sar_r21_info_reload_div{float:left;}" +
  "div.gm_hfr_sar_r21_save_close_div div.gm_hfr_sar_r21_info_reload_div " +
  "img{vertical-align:text-bottom;}" +
  "div.gm_hfr_sar_r21_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  // styles pour la fenêtre de rehost
  "#gm_hfr_sar_r21_rehost_background{position:fixed;left:0;top:0;background-color:#242424;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;z-index:1001;}" +
  "#gm_hfr_sar_r21_rehost_window{position:fixed;min-width:200px;height:auto;background:#ffffff;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;z-index:1002;}" +
  "#gm_hfr_sar_r21_rehost_window.gm_hfr_sar_r21_no_choice, " +
  "#gm_hfr_sar_r21_rehost_window.gm_hfr_sar_r21_no_choice *{cursor:default;}" +
  "#gm_hfr_sar_r21_rehost_window div.gm_hfr_sar_r21_rehost_main_title{font-size:14px;" +
  "text-align:center;font-weight:bold;}" +
  "#gm_hfr_sar_r21_rehost_window div.gm_hfr_sar_r21_rehost_title{font-size:12px;font-weight:bold;" +
  "margin:12px 0 6px;}" +
  "#gm_hfr_sar_r21_rehost_window p{margin:0 0 2px 4px;}" +
  "#gm_hfr_sar_r21_rehost_window input[type=\"checkbox\"]{margin:0 0 1px;" +
  "vertical-align:text-bottom;}";
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// création de la fenêtre d'aide
var help_window = document.createElement("div");
help_window.setAttribute("id", "gm_hfr_sar_r21_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(p_width, p_text) {
  let help_button = document.createElement("img");
  help_button.setAttribute("src", img_help);
  help_button.setAttribute("class", "gm_hfr_sar_r21_help_button");
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
config_background.setAttribute("id", "gm_hfr_sar_r21_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
config_background.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gm_hfr_sar_r21_config_window");
config_window.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.className = "gm_hfr_sar_r21_main_title";
main_title.textContent = "Conf du script [HFR] Smart Auto Rehost";
config_window.appendChild(main_title);

// section button
var button_fieldset = document.createElement("fieldset");
var button_legend = document.createElement("legend");
button_legend.textContent = "Icône du bouton";
button_fieldset.appendChild(button_legend);
config_window.appendChild(button_fieldset);
var button_p = document.createElement("p");
button_p.className = "gm_hfr_sar_r21_button_p_flex";
var button_test_img = document.createElement("img");
button_test_img.className = "gm_hfr_sar_r21_test_img";
button_p.appendChild(button_test_img);
var button_input = document.createElement("input");
button_input.setAttribute("id", "gm_hfr_sar_r21_button_input");
button_input.setAttribute("type", "text");
button_input.setAttribute("spellcheck", "false");
button_input.setAttribute("size", "50");
button_input.setAttribute("title", "url de l'icône (http ou data)");
button_input.addEventListener("focus", function() {
  button_input.select();
}, false);

function button_do_test_img() {
  button_test_img.setAttribute("src", button_input.value.trim());
  button_input.setSelectionRange(0, 0);
  button_input.blur();
}
button_input.addEventListener("input", button_do_test_img, false);
button_p.appendChild(button_input);
var button_reset_img = document.createElement("img");
button_reset_img.setAttribute("src", img_reset);
button_reset_img.className = "gm_hfr_sar_r21_reset_img";
button_reset_img.setAttribute("title", "remettre l'icône par défaut");

function button_do_reset_img() {
  button_input.value = img_burger_default;
  button_do_test_img();
}
button_reset_img.addEventListener("click", button_do_reset_img, false);
button_p.appendChild(button_reset_img);
button_fieldset.appendChild(button_p);

// section rehost_choice
var rehost_choice_fieldset = document.createElement("fieldset");
var rehost_choice_legend = document.createElement("legend");
rehost_choice_legend.textContent = "Choix du rehost";
rehost_choice_fieldset.appendChild(rehost_choice_legend);
config_window.appendChild(rehost_choice_fieldset);
var rehost_choice_div = document.createElement("div");
rehost_choice_div.className = "gm_hfr_sar_r21_rehost_choice_div_flex";
rehost_choice_fieldset.appendChild(rehost_choice_div);
var rehost_choice_div_choice = document.createElement("div");
rehost_choice_div.appendChild(rehost_choice_div_choice);

function rand_char() {
  return char_list[Math.floor(Math.random() * char_list.length)];
}

function update_test_rehost_img(p_rehost) {
  if(p_rehost === "") {
    p_rehost = "nope";
  }
  let l_rand = "";
  for(let i = 0; i < 10; ++i) {
    l_rand += rand_char();
  }
  var l_src = p_rehost + test_rehost_img_src + l_rand + test_rehost_img_src_ext;
  test_rehost_img.setAttribute("src", img_throbber);
  window.setTimeout(function() {
    test_rehost_img.setAttribute("src", l_src);
  }, 250);
}

function update_rehost_choice() {
  if(rehost_auto_radio.checked) { // auto
    update_test_rehost_img(rehost_auto_select.value);
    if(rehost_auto_select.value === reho.st.https) {
      stealth_rehost_p.style.display = "none";
    } else {
      stealth_rehost_p.style.display = "block";
    }
  } else { // perso
    update_test_rehost_img(rehost_perso_input.value.trim());
    stealth_rehost_p.style.display = "block";
  }
}

// rehost_auto
var rehost_auto_p = document.createElement("p");
rehost_auto_p.className = "gm_hfr_sar_r21_no_margin";
var rehost_auto_radio = document.createElement("input");
rehost_auto_radio.setAttribute("type", "radio");
rehost_auto_radio.setAttribute("id", "gm_hfr_sar_r21_rehost_auto_radio");
rehost_auto_radio.setAttribute("name", "gm_hfr_sar_r21_rehost_radios");
rehost_auto_radio.addEventListener("change", update_rehost_choice, false);
rehost_auto_p.appendChild(rehost_auto_radio);
var rehost_auto_label = document.createElement("label");
rehost_auto_label.textContent = " reho.st ou alias : ";
rehost_auto_label.setAttribute("for", "gm_hfr_sar_r21_rehost_auto_radio");
rehost_auto_p.appendChild(rehost_auto_label);
var rehost_auto_select = document.createElement("select");
for(let rehost of rehost_list) {
  let option = document.createElement("option");
  option.textContent = rehost;
  option.setAttribute("value", rehost);
  rehost_auto_select.appendChild(option);
}
rehost_auto_select.addEventListener("change", function() {
  if(rehost_auto_radio.checked) {
    update_rehost_choice();
  }
}, false);
rehost_auto_p.appendChild(rehost_auto_select);
rehost_choice_div_choice.appendChild(rehost_auto_p);
// rehost_perso
var rehost_perso_p = document.createElement("p");
rehost_perso_p.className = "gm_hfr_sar_r21_no_margin";
var rehost_perso_radio = document.createElement("input");
rehost_perso_radio.setAttribute("type", "radio");
rehost_perso_radio.setAttribute("id", "gm_hfr_sar_r21_rehost_perso_radio");
rehost_perso_radio.setAttribute("name", "gm_hfr_sar_r21_rehost_radios");
rehost_perso_radio.addEventListener("change", update_rehost_choice, false);
rehost_perso_p.appendChild(rehost_perso_radio);
var rehost_perso_label = document.createElement("label");
rehost_perso_label.textContent = " rehost perso : ";
rehost_perso_label.setAttribute("for", "gm_hfr_sar_r21_rehost_perso_radio");
rehost_perso_p.appendChild(rehost_perso_label);
var rehost_perso_input = document.createElement("input");
rehost_perso_input.setAttribute("type", "text");
rehost_perso_input.setAttribute("spellcheck", "false");
rehost_perso_input.setAttribute("size", "38");
rehost_perso_input.setAttribute("maxLength", "100");
rehost_perso_input.addEventListener("input", function() {
  window.clearTimeout(input_timer);
  input_timer = window.setTimeout(function() {
    if(rehost_perso_radio.checked) {
      update_rehost_choice();
    }
  }, 250);
}, false);
rehost_perso_input.addEventListener("focus", function() {
  rehost_perso_input.select();
}, false);
rehost_perso_p.appendChild(rehost_perso_input);
rehost_choice_div_choice.appendChild(rehost_perso_p);
// test_rehost
var rehost_choice_div_img = document.createElement("div");
rehost_choice_div_img.className = "gm_hfr_sar_r21_rehost_choice_div_img_flex";
rehost_choice_div_img.setAttribute("title", "image de test");
var test_rehost_img = document.createElement("img");
test_rehost_img.className = "gm_hfr_sar_r21_test_rehost_img";
test_rehost_img.addEventListener("load", function() {
  test_result = true;
  test_rehost_img.style.display = "block";
  test_rehost_img_alt.style.display = "none";
}, false);
test_rehost_img.addEventListener("error", function() {
  test_result = false;
  test_rehost_img.style.display = "none";
  test_rehost_img_alt.style.display = "block";
}, false);
rehost_choice_div_img.appendChild(test_rehost_img);
var test_rehost_img_alt = document.createElement("div");
test_rehost_img_alt.className = "gm_hfr_sar_r21_test_rehost_img_alt";
test_rehost_img_alt.textContent = "ÉCHEC";
rehost_choice_div_img.appendChild(test_rehost_img_alt);
rehost_choice_div.appendChild(rehost_choice_div_img);
// stealth_rehost
var stealth_rehost_p = document.createElement("p");
stealth_rehost_p.className = "gm_hfr_sar_r21_stealth_rehost_p";
var stealth_rehost_checkbox = document.createElement("input");
stealth_rehost_checkbox.setAttribute("type", "checkbox");
stealth_rehost_checkbox.setAttribute("id", "gm_hfr_sar_r21_stealth_rehost_checkbox");
stealth_rehost_p.appendChild(stealth_rehost_checkbox);
var stealth_rehost_label = document.createElement("label");
stealth_rehost_label.textContent =
  " convertir les \u00ab\u202freho.st\u202f\u00bb de la page avec le rehost choisi ";
stealth_rehost_label.setAttribute("for", "gm_hfr_sar_r21_stealth_rehost_checkbox");
stealth_rehost_p.appendChild(stealth_rehost_label);
stealth_rehost_p.appendChild(create_help_button(275,
  "Cette option permet de contourner les blocages d'accès à \u00ab\u202freho.st\u202f\u00bb " +
  "mais suivant les situations vous pouvez aussi ne pas cocher cette option et simplement " +
  "rajouter \u00ab\u202freho.st\u202f\u00bb à votre liste des noms de domaine à réhoster."));
rehost_choice_fieldset.appendChild(stealth_rehost_p);

// section no_rehost
var no_rehost_fieldset = document.createElement("fieldset");
var no_rehost_legend = document.createElement("legend");
no_rehost_legend.textContent = "Types de fichiers à ne pas réhoster";
no_rehost_fieldset.appendChild(no_rehost_legend);
config_window.appendChild(no_rehost_fieldset);
var no_rehost_div = document.createElement("div");
no_rehost_div.className = "gm_hfr_sar_r21_no_rehost_div_flex";
no_rehost_fieldset.appendChild(no_rehost_div);
// no_rehost_gif
var no_rehost_gif_div = document.createElement("div");
var no_rehost_gif_checkbox = document.createElement("input");
no_rehost_gif_checkbox.setAttribute("type", "checkbox");
no_rehost_gif_checkbox.setAttribute("id", "gm_hfr_sar_r21_no_rehost_gif_checkbox");
no_rehost_gif_div.appendChild(no_rehost_gif_checkbox);
var no_rehost_gif_label = document.createElement("label");
no_rehost_gif_label.textContent = " .gif ";
no_rehost_gif_label.setAttribute("for", "gm_hfr_sar_r21_no_rehost_gif_checkbox");
no_rehost_gif_div.appendChild(no_rehost_gif_label);
no_rehost_gif_div.appendChild(create_help_button(210,
  "Certains gif, typiquement les gif animés, peuvent être trop gros pour être réhostés."));
no_rehost_div.appendChild(no_rehost_gif_div);
// no_rehost_gifv
var no_rehost_gifv_div = document.createElement("div");
var no_rehost_gifv_checkbox = document.createElement("input");
no_rehost_gifv_checkbox.setAttribute("type", "checkbox");
no_rehost_gifv_checkbox.setAttribute("id", "gm_hfr_sar_r21_no_rehost_gifv_checkbox");
no_rehost_gifv_div.appendChild(no_rehost_gifv_checkbox);
var no_rehost_gifv_label = document.createElement("label");
no_rehost_gifv_label.textContent = " .gifv ";
no_rehost_gifv_label.setAttribute("for", "gm_hfr_sar_r21_no_rehost_gifv_checkbox");
no_rehost_gifv_div.appendChild(no_rehost_gifv_label);
no_rehost_gifv_div.appendChild(create_help_button(340,
  "Les gifv sont parfois utilisés en tant qu'image sur le forum et peuvent alors être affichés " +
  "sous forme de gif ou de webp qui peuvent ne pas être supportés par le rehost choisi. " +
  "Note : les liens vers les gifv ne sont jamais réhostés pour préserver la possibilité de " +
  "les lire en tant que vidéo."));
no_rehost_div.appendChild(no_rehost_gifv_div);
// no_rehost_webp
var no_rehost_webp_div = document.createElement("div");
var no_rehost_webp_checkbox = document.createElement("input");
no_rehost_webp_checkbox.setAttribute("type", "checkbox");
no_rehost_webp_checkbox.setAttribute("id", "gm_hfr_sar_r21_no_rehost_webp_checkbox");
no_rehost_webp_div.appendChild(no_rehost_webp_checkbox);
var no_rehost_webp_label = document.createElement("label");
no_rehost_webp_label.textContent = " .webp ";
no_rehost_webp_label.setAttribute("for", "gm_hfr_sar_r21_no_rehost_webp_checkbox");
no_rehost_webp_div.appendChild(no_rehost_webp_label);
no_rehost_webp_div.appendChild(create_help_button(230,
  "Le webp, qui est un format récent, peut ne pas être géré par le rehost choisi. " +
  "(Pour le moment \u00ab\u202freho.st\u202f\u00bb ne le gère pas.)"));
no_rehost_div.appendChild(no_rehost_webp_div);
// no_rehost_svg
var no_rehost_svg_div = document.createElement("div");
var no_rehost_svg_checkbox = document.createElement("input");
no_rehost_svg_checkbox.setAttribute("type", "checkbox");
no_rehost_svg_checkbox.setAttribute("id", "gm_hfr_sar_r21_no_rehost_svg_checkbox");
no_rehost_svg_div.appendChild(no_rehost_svg_checkbox);
var no_rehost_svg_label = document.createElement("label");
no_rehost_svg_label.textContent = " .svg ";
no_rehost_svg_label.setAttribute("for", "gm_hfr_sar_r21_no_rehost_svg_checkbox");
no_rehost_svg_div.appendChild(no_rehost_svg_label);
no_rehost_svg_div.appendChild(create_help_button(185,
  "Le svg est un format particulier qui n'est pas très bien géré par " +
  "\u00ab\u202freho.st\u202f\u00bb."));
no_rehost_div.appendChild(no_rehost_svg_div);

// section lists
var lists_fieldset = document.createElement("fieldset");
var lists_legend = document.createElement("legend");
lists_legend.textContent = "Listes des noms de domaine";
lists_fieldset.appendChild(lists_legend);
config_window.appendChild(lists_fieldset);
var lists_div = document.createElement("div");
lists_div.className = "gm_hfr_sar_r21_lists_div_flex";
lists_fieldset.appendChild(lists_div);
// host_list
var host_list_div = document.createElement("div");
host_list_div.style.paddingRight = "5px";
lists_div.appendChild(host_list_div);
var host_list_p = document.createElement("p");
var host_list_label = document.createElement("label");
host_list_label.textContent = "à réhoster :";
host_list_label.setAttribute("for", "gm_hfr_sar_r21_host_list_textarea");
host_list_p.appendChild(host_list_label);
host_list_div.appendChild(host_list_p);
var host_list_textarea = document.createElement("textarea");
host_list_textarea.setAttribute("id", "gm_hfr_sar_r21_host_list_textarea");
host_list_textarea.setAttribute("spellcheck", "false");
host_list_div.appendChild(host_list_textarea);
// white_list
var white_list_div = document.createElement("div");
white_list_div.style.paddingLeft = "5px";
lists_div.appendChild(white_list_div);
var white_list_p = document.createElement("p");
var white_list_label = document.createElement("label");
white_list_label.textContent = "à ne pas réhoster : ";
white_list_label.setAttribute("for", "gm_hfr_sar_r21_white_list_textarea");
white_list_p.appendChild(white_list_label);
white_list_p.appendChild(create_help_button(250,
  "Le rehost choisi est automatiquement inclus à la liste des noms de domaine à ne pas réhoster, " +
  "il est inutile de le rajouter ici."));
white_list_div.appendChild(white_list_p);
var white_list_textarea = document.createElement("textarea");
white_list_textarea.setAttribute("id", "gm_hfr_sar_r21_white_list_textarea");
white_list_textarea.setAttribute("spellcheck", "false");
white_list_div.appendChild(white_list_textarea);

// rechargement de la page et boutons de validation et de fermeture
var save_close_div = document.createElement("div");
save_close_div.className = "gm_hfr_sar_r21_save_close_div";
var info_reload_div = document.createElement("div");
info_reload_div.className = "gm_hfr_sar_r21_info_reload_div";
var info_reload_checkbox = document.createElement("input");
info_reload_checkbox.setAttribute("type", "checkbox");
info_reload_checkbox.setAttribute("id", "gm_hfr_sar_r21_info_reload_checkbox");
info_reload_div.appendChild(info_reload_checkbox);
var info_reload_label = document.createElement("label");
info_reload_label.textContent = " recharger la page ";
info_reload_label.setAttribute("for", "gm_hfr_sar_r21_info_reload_checkbox");
info_reload_div.appendChild(info_reload_label);
info_reload_div.appendChild(create_help_button(255,
  "La modification des paramètres de cette fenêtre de configuration n'est visible que sur " +
  "les nouvelles pages ou après le rechargement de la page courante. Cette option permet de " +
  "recharger automatiquement la page courante lors de la validation."));
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
  // vérification et confirmation
  if(!test_result &&
    !confirm("L'image de test est en échec, voulez-vous vraiment valider ?")) {
    return;
  }
  // fermeture de la fenêtre
  hide_config_window();
  // récupération des paramètres
  img_burger = button_input.value.trim();
  if(img_burger === "") {
    img_burger = img_burger_default;
  }
  rehost_type = rehost_auto_radio.checked ? "auto" : "perso";
  rehost_auto = rehost_auto_select.value;
  rehost_perso = rehost_perso_input.value.trim();
  stealth_rehost = stealth_rehost_checkbox.checked;
  no_rehost_gif = no_rehost_gif_checkbox.checked;
  no_rehost_gifv = no_rehost_gifv_checkbox.checked;
  no_rehost_webp = no_rehost_webp_checkbox.checked;
  no_rehost_svg = no_rehost_svg_checkbox.checked;
  host_list = get_list_from_string(host_list_textarea.value);
  white_list = get_list_from_string(white_list_textarea.value);
  the_rehost = get_rehost();
  real_white_list = Array.from(white_list);
  real_white_list.push(get_hostname(the_rehost));
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("img_burger", img_burger),
    GM.setValue("rehost_type", rehost_type),
    GM.setValue("rehost_auto", rehost_auto),
    GM.setValue("rehost_perso", rehost_perso),
    GM.setValue("stealth_rehost", stealth_rehost),
    GM.setValue("no_rehost_gif", no_rehost_gif),
    GM.setValue("no_rehost_gifv", no_rehost_gifv),
    GM.setValue("no_rehost_webp", no_rehost_webp),
    GM.setValue("no_rehost_svg", no_rehost_svg),
    GM.setValue("host_list", get_string_from_list(host_list)),
    GM.setValue("white_list", get_string_from_list(white_list)),
  ]).then(function() {
    if(info_reload_checkbox.checked) {
      window.location.reload(true);
    }
  });
}

// fonction de fermeture de la fenêtre de configuration
function hide_config_window() {
  config_window.style.opacity = "0";
  config_background.style.opacity = "0";
}

// fonction de fermeture de la fenêtre de configuration par la touche echap
function esc_config_window(p_event) {
  if(p_event.key === "Escape") {
    hide_config_window();
  }
}

// fonction de gestion de la fin de la transition d'affichage /
// disparition de la fenêtre de configuration
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
  // initialisation des paramètres
  button_input.value = img_burger;
  button_do_test_img();
  rehost_auto_radio.checked = rehost_type === "auto";
  rehost_auto_select.value = rehost_auto;
  rehost_perso_radio.checked = rehost_type === "perso";
  rehost_perso_input.value = rehost_perso;
  update_rehost_choice();
  stealth_rehost_checkbox.checked = stealth_rehost;
  no_rehost_gif_checkbox.checked = no_rehost_gif;
  no_rehost_gifv_checkbox.checked = no_rehost_gifv;
  no_rehost_webp_checkbox.checked = no_rehost_webp;
  no_rehost_svg_checkbox.checked = no_rehost_svg;
  host_list_textarea.value = get_string_from_list(host_list);
  white_list_textarea.value = get_string_from_list(white_list);
  host_list_textarea.style.width = textarea_width_default;
  host_list_textarea.style.height = textarea_height_default;
  white_list_textarea.style.width = textarea_width_default;
  white_list_textarea.style.height = textarea_height_default;
  info_reload_checkbox.checked = false;
  // affichage de la fenêtre
  config_window.style.visibility = "visible";
  config_background.style.visibility = "visible";
  config_window.style.left =
    parseInt((document.documentElement.clientWidth - config_window.offsetWidth) / 2, 10) + "px";
  config_window.style.top =
    parseInt((document.documentElement.clientHeight - config_window.offsetHeight) / 2, 10) + "px";
  test_rehost_img.style.maxHeight = (rehost_choice_div_choice.offsetHeight - 6) + "px";
  rehost_choice_div_img.style.minWidth =
    Math.ceil(((rehost_choice_div_choice.offsetHeight - 2) / 5 * 7)) + "px";
  config_background.style.width = document.documentElement.scrollWidth + "px";
  config_background.style.height = document.documentElement.scrollHeight + "px";
  config_window.style.opacity = "1";
  config_background.style.opacity = "0.8";
}

// ajout d'une entrée de configuration dans le menu de l'extension
gmMenu("[HFR] Smart Auto Rehost -> Configuration", show_config_window);

/* ------------------------------------------------------------- */
/* création de la fenêtre d'ajout des noms de domaine à réhoster */
/* ------------------------------------------------------------- */

// création de la fenêtre de rehost
var rehost_window = document.createElement("div");
rehost_window.setAttribute("id", "gm_hfr_sar_r21_rehost_window");
rehost_window.addEventListener("transitionend", rehost_window_transitionend, false);
rehost_window.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(rehost_window);

// création du voile de fond pour la fenêtre de rehost
var rehost_background = document.createElement("div");
rehost_background.setAttribute("id", "gm_hfr_sar_r21_rehost_background");
rehost_background.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(rehost_background);

// titre de la fenêtre de rehost
var rehost_title = document.createElement("div");
rehost_title.className = "gm_hfr_sar_r21_rehost_main_title";
rehost_window.appendChild(rehost_title);

// sections de la fenêtre de rehost
var new_hosts_title = document.createElement("div");
new_hosts_title.className = "gm_hfr_sar_r21_rehost_title";
new_hosts_title.textContent = "Nouveaux noms de domaine";
rehost_window.appendChild(new_hosts_title);
var new_hosts_section = document.createElement("div");
new_hosts_section.className = "gm_hfr_sar_r21_rehost_section";
rehost_window.appendChild(new_hosts_section);
var white_list_title = document.createElement("div");
white_list_title.className = "gm_hfr_sar_r21_rehost_title";
white_list_title.textContent = "Noms de domaine à ne pas réhoster";
rehost_window.appendChild(white_list_title);
var white_list_section = document.createElement("div");
white_list_section.className = "gm_hfr_sar_r21_rehost_section";
rehost_window.appendChild(white_list_section);
var host_list_title = document.createElement("div");
host_list_title.className = "gm_hfr_sar_r21_rehost_title";
host_list_title.textContent = "Noms de domaine déjà réhostés";
rehost_window.appendChild(host_list_title);
var host_list_section = document.createElement("div");
host_list_section.className = "gm_hfr_sar_r21_rehost_section";
rehost_window.appendChild(host_list_section);

// info "sans rechargement" et boutons de validation et de fermeture
var rehost_save_close_div = document.createElement("div");
rehost_save_close_div.className = "gm_hfr_sar_r21_save_close_div";
var rehost_info_reload_div = document.createElement("div");
rehost_info_reload_div.className = "gm_hfr_sar_r21_info_reload_div";
var rehost_info_reload_img = document.createElement("img");
rehost_info_reload_img.setAttribute("src", img_info);
rehost_info_reload_div.appendChild(rehost_info_reload_img);
rehost_info_reload_div.appendChild(document.createTextNode(" sans rechargement "));
rehost_info_reload_div.appendChild(create_help_button(255,
  "L'ajout de nouveaux noms de domaine à réhoster est pris en compte immédiatement " +
  "à la validation, il n'est pas nécessaire de recharger la page."));
rehost_save_close_div.appendChild(rehost_info_reload_div);
var rehost_save_button = document.createElement("img");
rehost_save_button.setAttribute("src", img_save);
rehost_save_button.setAttribute("title", "Valider");
rehost_save_button.addEventListener("click", save_rehost_window, false);
rehost_save_close_div.appendChild(rehost_save_button);
var rehost_close_button = document.createElement("img");
rehost_close_button.setAttribute("src", img_close);
rehost_close_button.setAttribute("title", "Annuler");
rehost_close_button.addEventListener("click", hide_rehost_window, false);
rehost_save_close_div.appendChild(rehost_close_button);
rehost_window.appendChild(rehost_save_close_div);

// fonction de nettoyage de la fenêtre de rehost
function clean_rehost_window() {
  new_hosts_title.style.display = "none";
  new_hosts_section.style.display = "none";
  white_list_title.style.display = "none";
  white_list_section.style.display = "none";
  host_list_title.style.display = "none";
  host_list_section.style.display = "none";
  rehost_save_close_div.style.display = "none";
  rehost_window.className = "gm_hfr_sar_r21_no_choice";
  rehost_close = true;
  let l_ps = document.querySelectorAll("#gm_hfr_sar_r21_rehost_window > " +
    "div.gm_hfr_sar_r21_rehost_section > p");
  for(let l_p of l_ps) {
    l_p.parentNode.removeChild(l_p);
  }
}

// fonction d'ajout d'une ligne d'info à la fenêtre de rehost
function add_rehost_info(p_host, p_number, p_section) {
  let l_info_p = document.createElement("p");
  l_info_p.className = "gm_hfr_sar_r21_rehost_p";
  l_info_p.textContent =
    "\u25cf " + p_host + " " + (p_number > 1 ? "(" + p_number + " images)" : "(une image)");
  p_section.appendChild(l_info_p);
}

// fonction d'ajout d'une ligne de choix à la fenêtre de rehost
function add_rehost_choice(p_host, p_number, p_index, p_section) {
  let l_choice_p = document.createElement("p");
  l_choice_p.className = "gm_hfr_sar_r21_rehost_p";
  let l_choice_checkbox = document.createElement("input");
  l_choice_checkbox.setAttribute("type", "checkbox");
  l_choice_checkbox.setAttribute("value", p_host);
  l_choice_checkbox.setAttribute("id", "gm_hfr_sar_r21_rehost_checkbox_" + p_index);
  l_choice_checkbox.checked = true;
  l_choice_p.appendChild(l_choice_checkbox);
  let l_choice_label = document.createElement("label");
  l_choice_label.textContent =
    " " + p_host + " " + (p_number > 1 ? "(" + p_number + " images)" : "(une image)");
  l_choice_label.setAttribute("for", "gm_hfr_sar_r21_rehost_checkbox_" + p_index);
  l_choice_p.appendChild(l_choice_label);
  p_section.appendChild(l_choice_p);
}

// fonction de validation de la fenêtre de rehost
function save_rehost_window() {
  // enregistrement des nouveaux noms de domaine
  let l_new_host = false;
  let l_new_host_checkboxes =
    document.querySelectorAll("#gm_hfr_sar_r21_rehost_window input[type=\"checkbox\"]");
  for(let l_new_host_checkbox of l_new_host_checkboxes) {
    if(l_new_host_checkbox.checked) {
      host_list.push(l_new_host_checkbox.value);
      l_new_host = true;
    }
  }
  if(l_new_host) {
    host_list.sort();
    GM.setValue("host_list", get_string_from_list(host_list));
  }
  // fermeture de la fenêtre
  hide_rehost_window();
  // réhostage
  if(l_new_host) {
    do_rehost();
  }
}

// fonction de fermeture de la fenêtre de rehost
function hide_rehost_window() {
  rehost_window.style.opacity = "0";
  rehost_background.style.opacity = "0";
}

// fonction de fermeture de la fenêtre de rehost par la touche echap
function esc_rehost_window(p_event) {
  if(p_event.key === "Escape") {
    hide_rehost_window();
  }
}

// fonction de fermeture de la fenêtre de rehost par un clic en dehors
function close_rehost_window(p_event) {
  if(rehost_close === true) {
    hide_rehost_window();
    return;
  }
  let l_target = p_event.target;
  while(l_target !== null && l_target.id !== "gm_hfr_sar_r21_rehost_window") {
    l_target = l_target.parentNode;
  }
  if(l_target === null) {
    hide_rehost_window();
  }
}

// fonction de gestion de la fin de la transition d'affichage /
// disparition de la fenêtre de rehost
function rehost_window_transitionend() {
  if(rehost_window.style.opacity === "0") {
    rehost_window.style.visibility = "hidden";
    rehost_background.style.visibility = "hidden";
    document.removeEventListener("keydown", esc_rehost_window, false);
    document.removeEventListener("click", close_rehost_window, false);
  }
  if(rehost_window.style.opacity === "1") {
    document.addEventListener("keydown", esc_rehost_window, false);
    document.addEventListener("click", close_rehost_window, false);
  }
}

// fonction d'affichage de la fenêtre de rehost
function show_rehost_window(p_white_list, p_host_list, p_new_hosts) {
  // nettoyage de la fenêtre de rehost
  clean_rehost_window();
  // affichage du titre et des boutons
  let l_white_list_empty = Object.keys(p_white_list).length === 0;
  let l_host_list_empty = Object.keys(p_host_list).length === 0;
  let l_new_hosts_empty = Object.keys(p_new_hosts).length === 0;
  if(l_host_list_empty && l_new_hosts_empty) {
    rehost_title.textContent = "Rien à réhoster";
  } else if(!l_new_hosts_empty) {
    rehost_title.textContent = "";
    rehost_title.appendChild(document.createTextNode("Voulez-vous réhoster ces"));
    rehost_title.appendChild(document.createElement("br"));
    rehost_title.appendChild(document.createTextNode("nouveaux noms de domaine ?"));
    rehost_save_close_div.style.display = "block";
    rehost_window.className = "";
    rehost_close = false;
  } else {
    rehost_title.textContent = "Rien de neuf à réhoster";
  }
  // affichage des sections
  if(!l_new_hosts_empty) {
    new_hosts_title.style.display = "block";
    new_hosts_section.style.display = "block";
    let l_index = 0;
    for(let l_host in p_new_hosts) {
      add_rehost_choice(l_host, p_new_hosts[l_host], l_index++, new_hosts_section);
    }
  }
  if(!l_white_list_empty) {
    white_list_title.style.display = "block";
    white_list_section.style.display = "block";
    for(let l_host in p_white_list) {
      add_rehost_info(l_host, p_white_list[l_host], white_list_section);
    }
  }
  if(!l_host_list_empty) {
    host_list_title.style.display = "block";
    host_list_section.style.display = "block";
    for(let l_host in p_host_list) {
      add_rehost_info(l_host, p_host_list[l_host], host_list_section);
    }
  }
  // affichage de la fenêtre
  rehost_window.style.visibility = "visible";
  rehost_background.style.visibility = "visible";
  rehost_window.style.left =
    parseInt((document.documentElement.clientWidth - rehost_window.offsetWidth) / 2, 10) + "px";
  rehost_window.style.top =
    parseInt((document.documentElement.clientHeight - rehost_window.offsetHeight) / 2, 10) + "px";
  rehost_background.style.width = document.documentElement.scrollWidth + "px";
  rehost_background.style.height = document.documentElement.scrollHeight + "px";
  rehost_window.style.opacity = "1";
  rehost_background.style.opacity = "0.8";
}

/* -------------------------------------------------- */
/* les fonctions de gestion des clics sur les burgers */
/* -------------------------------------------------- */

// fonction de gestion de l'ajout des nouveaux noms de domaine
function burger_rehost(p_event) {
  p_event.preventDefault();
  let l_white_list = {};
  let l_host_list = {};
  let l_new_hosts = {};
  let l_imgs = this.parentElement.parentElement.nextElementSibling
    .querySelectorAll("img:not([src^=\"data:image\"])");
  for(let l_img of l_imgs) {
    let l_host = get_hostname(l_img.src);
    if(l_img.dataset.host) {
      l_host = l_img.dataset.host;
    }
    if(l_host) {
      if(real_white_list.includes(l_host)) {
        if(typeof l_white_list[l_host] === "undefined") {
          l_white_list[l_host] = 0;
        }
        ++l_white_list[l_host];
      } else if(host_list.includes(l_host)) {
        if(typeof l_host_list[l_host] === "undefined") {
          l_host_list[l_host] = 0;
        }
        ++l_host_list[l_host];
      } else {
        if(typeof l_new_hosts[l_host] === "undefined") {
          l_new_hosts[l_host] = 0;
        }
        ++l_new_hosts[l_host];
      }
    }
  }
  show_rehost_window(l_white_list, l_host_list, l_new_hosts);
}

// fonction d'ouverture de le fenêtre de configuration
function burger_config(p_event) {
  p_event.preventDefault();
  if(p_event.button === 2) {
    show_config_window();
  }
}

/* ----------------------------------------------------------- */
/* récupération des paramètres, ajout des burgers et réhostage */
/* ----------------------------------------------------------- */

Promise.all([
  GM.getValue("img_burger", img_burger_default),
  GM.getValue("rehost_type", rehost_type_default),
  GM.getValue("rehost_auto", rehost_auto_default),
  GM.getValue("rehost_perso", rehost_perso_default),
  GM.getValue("stealth_rehost", stealth_rehost_default),
  GM.getValue("no_rehost_gif", no_rehost_gif_default),
  GM.getValue("no_rehost_gifv", no_rehost_gifv_default),
  GM.getValue("no_rehost_webp", no_rehost_webp_default),
  GM.getValue("no_rehost_svg", no_rehost_svg_default),
  GM.getValue("host_list", host_list_default),
  GM.getValue("white_list", white_list_default),
]).then(function([
  img_burger_value,
  rehost_type_value,
  rehost_auto_value,
  rehost_perso_value,
  stealth_rehost_value,
  no_rehost_gif_value,
  no_rehost_gifv_value,
  no_rehost_webp_value,
  no_rehost_svg_value,
  host_list_value,
  white_list_value,
]) {
  // initialisation des variables globales
  img_burger = img_burger_value;
  rehost_type = rehost_type_value;
  rehost_auto = rehost_auto_value;
  rehost_perso = rehost_perso_value;
  stealth_rehost = stealth_rehost_value;
  no_rehost_gif = no_rehost_gif_value;
  no_rehost_gifv = no_rehost_gifv_value;
  no_rehost_webp = no_rehost_webp_value;
  no_rehost_svg = no_rehost_svg_value;
  host_list = get_list_from_string(host_list_value);
  white_list = get_list_from_string(white_list_value);
  the_rehost = get_rehost();
  real_white_list = Array.from(white_list);
  real_white_list.push(get_hostname(the_rehost));
  // ajout des burgers
  let toolbars =
    document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable tbody " +
      "tr.message td.messCase1 + td.messCase2 div.toolbar");
  for(let toolbar of toolbars) {
    let burger_div = document.createElement("div");
    burger_div.setAttribute("class", "right");
    let burger_img = document.createElement("img");
    burger_img.setAttribute("class", "gm_hfr_sar_r21_button");
    burger_img.setAttribute("src", img_burger);
    burger_img.setAttribute("alt", "SAR");
    burger_img.setAttribute("title",
      "Ajouter des noms de domaine à réhoster\n(clic droit pour configurer)");
    burger_img.addEventListener("contextmenu", prevent_default, false);
    burger_img.addEventListener("click", burger_rehost, false);
    burger_img.addEventListener("mouseup", burger_config, false);
    burger_div.appendChild(burger_img);
    let spacer_div = toolbar.querySelector("div.spacer");
    toolbar.insertBefore(burger_div, spacer_div);
  }
  // stealth rehost
  if(stealth_rehost && (rehost_type !== "auto" || rehost_auto !== reho.st.https)) {
    do_stealth_rehost(true);
  }
  // réhostage
  do_rehost();
});
