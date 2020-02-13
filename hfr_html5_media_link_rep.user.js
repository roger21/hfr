// ==UserScript==
// @name          [HFR] HTML5 Media Link Replacer
// @version       2.3.1
// @namespace     roger21.free.fr
// @description   Remplace les liens vers des fichiers multimédias (wav, mp3, ogg, webm, mp4, gifv et gfycat) par le lecteur HTML5 du navigateur.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_html5_media_link_rep.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_html5_media_link_rep.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_html5_media_link_rep.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @connect       i.4cdn.org
// @connect       i.imgur.com
// @connect       gfycat.com
// @connect       *
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.xmlHttpRequest
// @grant         GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2015-2020 roger21@free.fr

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
// 2.3.1 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.3.0 (30/01/2020) :
// - correction du support des gfycat (il faut utiliser le lien de l'iframe maintenant)
// 2.2.9 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 2.2.8 (10/11/2019) :
// - réduction des temps des transitions de 0.7s à 0.3s
// 2.2.7 (02/11/2019) :
// - gestion des liens vides (induits pas le quote des images en .gifv)
// 2.2.6 (29/10/2019) :
// - prise en compte des liens à paramètres
// 2.2.5 (27/10/2019) :
// - meilleur gestion des liens avec du contenu
// 2.2.4 (13/10/2019) :
// - ajout d'une option pour recharger la page sur la fenêtre de configuration
// 2.2.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 2.2.2 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.2.1 (05/09/2019) :
// - mises en forme du code et corrections de commentaires
// 2.2.0 (28/08/2019) :
// - correction de la sélection des liens et des liens quotés
// - nouvelle gestion de l'affichage des médias pour éviter la séparation du média et du lien externe
// - non propagation des clics pour éviter l'inversion des spoilers
// - ajout d'un target="_blank" sur les liens externes
// - gestion complète du masquage des contrôles
// - correction de la taille "largeur de la fenêtre" de "fenêtre -275px" à "fenêtre -330px"
// - bordure solide pour la fenêtre de configuration
// 2.1.3 (31/07/2019) :
// - nouvelle correction des espaces entre les blocs sur la fenêtre de configuration
// - nettoyage de bouts de code inutiles
// 2.1.2 (28/07/2019) :
// - nouvelle description
// 2.1.1 (28/07/2019) :
// - correction des espaces entre les blocs sur la fenêtre de configuration
// 2.1.0 (08/06/2019) :
// - nettoyage du code et amélioration du code pour chrome
// - ajout de la possibilité d'ajouter une aide contextuelle
// 2.0.1 (02/06/2019) :
// - nettoyage de debug et commentaires de developpement
// 2.0.0 (02/06/2019) :
// - nouveau nom : [HFR] html5 media link replacer -> [HFR] HTML5 Media Link Replacer
// - ajout de l'avis de licence AGPL v3+
// - ajout de la metadata @author (roger21)
// - gestion de la compatibilité gm4
// - réécriture de la metadata @description
// - ajout d'une fenêtre de configuration
// - ajout des options autoplay, autoloop, controls et muted
// - check et correction du code dans tm
// 1.8.0 (13/05/2018) :
// - amélioration du code et check du code dans tm
// - ajout du mode anonyme sur le gm_xhr de la requête HEAD pour le content-type
// - ajout d'une protection suplémentaire sur les liens en forum.hardware.fr
// - ajout d'une option en dur pour n'afficher les vidéos que par clic (needclick)
// - ajout de la gestion des liens quotés (en affichage par clic)
// - ajout d'un style distinctif pour les liens vidéos cliquables (l'émoji play)
// - ajout des metadata @connect pour tm
// - suppression des @grant inutiles
// - maj de la metadata @homepageURL
// 1.7.2 (28/11/2017) :
// - passage au https
// 1.7.1 (29/12/2016) :
// - remplacement de l'espace entre la video et le lien par un espace insécable
// 1.7.0 (09/12/2016) :
// - ajout du lien vers le lien :o (à côté du media)
// - léger nettoyage du code
// 1.6.1 (23/09/2016) :
// - ajout du support du mp3
// 1.6.0 (06/08/2016) :
// - gestion des gifv avec les deux sources (webm et mp4)
// - ajout d'un support pour les gfycat
// 1.5.0 (02/01/2016) :
// - optimization des images
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.4.1 (22/03/2015) :
// - ajout d'un vertical-align:bottom sur le lecteur ->
// (pour faire comme les images avec le style hfr images smileys)
// 1.4.0 (07/03/2015) :
// - ajout du support pour le mp4 (à l'arache, pas testé)
// 1.3.1 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.3.0 (20/02/2015) :
// - ajout d'un bouton pour boucler (ou non) le media
// - correction et ammélioration de la gestion des medias dans des liens
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.2.0 (16/02/2015) :
// - ajout des parametres pour limiter (ou non) la taille des vidéos
// 1.1.0 (16/02/2015) :
// - ajout d'un support pour les gifv d'imgur
// 1.0.0 (19/01/2015) :
// - création

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
if(typeof GM_xmlhttpRequest !== "undefined" && typeof GM.xmlHttpRequest === "undefined") {
  GM.xmlHttpRequest = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_xmlhttpRequest.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
// info du navigateur pour les différences d'affichage ff / ch
var ff = navigator.userAgent && navigator.userAgent.indexOf("Firefox") !== -1;

/* ---------- */
/* les images */
/* ---------- */

var img_buttons = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAADwCAYAAABykyYvAAAOjklEQVR42u1cCVBUVxalZRcEQYEggkFFoyAKggFkkTVqJhGN0WQSNS6o0THGyVRmNBlHx%2BhonKjRJGKMcRlLY5maMZPRCiCyKItGUSkkYoAWF0Q2UbC7ZZ1%2FmPnJ4%2FWn%2B%2F%2F%2Bv6Er%2Bbfqldr9%2Bv3z773vvvve9R0zM1lkkUUWWWSRRRZZZJFFFllkkUUWWWSRRRZZZJFFll%2BvfGfiTQYoA%2FxlAIyNjc07duzYLWtr61STBBgeHp7TwUhtba1m9erVRSYD0MXFJd3Pzy9r5cqVV9va2toZAc6O3Nzcai8vr4xeA%2Bjj45OZl5dXU19fr2lubu5EBXBsg6hUqtbk5OTSHgUIjX311VcVHf8XEhRXg1y7dq3BysoqxegAx44dmw2t8AHGgvv%2B%2B%2B9rHR0dTxtdgwD36NGjZi4QkLt376rIz%2B7du6desWLFVXqcOXPmXIqMjMyVFKCrq2s6NMcF7tChQzfNzc1TwsLCclpbWzs%2FPHXqVKVCodAy6apVqwrx%2FcOHD59ICvD48eO3SLNClEplI2YvGQeLiooa4uLi8rjG2L17dyk7BiQ%2FP79GEoC%2Bvr5ZtM8BHN2PS2Ns69evX9rt27dV5DjMzG%2BD1kUDhJPT2vP3988S6uwA2dTU1EKO8%2FXXX98WBRC%2B9%2BDBAw056JEjRyoMnZHbtm27QfuwKIDQVEtLSzs5oIh49l1wcPA52hpTpkzJNxjgtGnTLpADcvme0EZrcMOGDT8YDBDrKwkQ%2FigWIBMfVeRs3rdvX7mpAVRLBjAxMVFyE9M%2BKMrEWN7oSSImIQ0JCZF2knCFGSxthgLctWtXqaRhBu38%2BfO11ArQDs0KBde3b99U2hpYQkUDDAoKOksvdcjvuuvv4OCQRi97WEUqKyu7LHUAi7goSbLAJqjsm2%2FdurWEq9%2BIESMyGxsbm21sbFJJwAgttGkvXrxYJ2m61dDQ8AQDr1u3rpj%2BHgnpwYMHlWxuCIBRUVG5e%2FfuLcM%2BhbbA%2Ffv31RYWFimSJqyenp4ZSUlJBfTnU6dOPf%2FkyZM2riSWK8uGD%2FM0rbhN05AhQzKys7OrhaT%2FVVVVaoHgDAOIGcn4WgvfTRO0hh2grpxRcg0iq1mzZk0RlzlJQdwMCAjI7rWNu7u7%2B5nLly%2FXk7N87dq1xTyz5Z45%2BoDppk%2BffkGKnNGop1sAmpqaWkXGQfn4TQYoA5QBygBlgL8QgM6jJ%2BX5L%2FvHLYWFidZJ%2BvuE5jy3X9URveuOxnvqH0ynTmJpPzDdzsM3yyt%2B%2BdWELx%2B3M60DQCe8l1Ft7ezZe3USW9dhmRPez6yJ%2BaRSE%2F%2FFo3aAAji24d9xe%2BpbR83b2bN1EmjM%2F81DFQBAg%2BJq6BP2waUGM3NL49dJ7D3HZEMrfICx4J5de7bW3LYH6iT2nv7Zsburm7lAoEVtK1WRn0VtV6q94t7UqpO4h756qf%2FIcGnrJJb9XNKhOS5wfklf3DRTmKc4Dg%2FJSdjX1OmLgb8%2FUWlmpr2DG5KwohDfx352X9o6ydhlh2%2BRZsXfIz78oRGzl4yDYR9cbHD2jeGsk4ya%2B3EpO0an6d%2FPkqZOYjdoVBbtcwCn3bf7PW8fa%2Fu0yI9%2BVJHjMDO%2FDVoXDRBOTmvPfrCf4DoJQMYl17aQ44xdfkRcnQS%2BF%2FPpPQ056JglBwyuk4x8ZcsN2odFAYSmEvY1tncZ0PB49p2D9%2FhztDUG%2BicYfgTsEvCbC%2BSA3L4nrNEaHD59reGH6FhfSYDwR7EAo7aXq8jZ7LsgudzEACrVkgF0CXhBchPTPijKxFh76UkiJiF1HDZB2knCFWY6lzYDAT7z2vZSScNMZ6D%2Bc3YttQK0Q7OCA7WVbSptDSyhogE6eAeepZe6zvyum%2F7mNv3S6GUPq0jU9rIuSx3AIi5KkiywCSr75iNmbeKsk9i6Dc%2BMTa5pVlj%2BfD4IwAgttGlD%2FpJTJ2m6FftZ1RMMPGzae1p1EiSkjG8q2dwQAJ1GRuSOnv9pGfYptAUmfVyhNusjcZ3E2mlwhkfUfK06yUD%2F587H733YxpXEcmXZ8GGephW3abIZ4JUR%2FKe0aiHpf9SOm2qB4AwDiBnJ%2BFoL300TtIYdoK6cUfp9MZPVeD%2F%2FbhGXOdnP2LjZz2ts79VJrByfOhO6Pr%2BenOVDX1hdzDNb7qmjD0WKa%2BCLF6TIGY18uqVIGf%2FOt1VkHJSP32SAMkAZoAxQBvgLAegW5MGcD8bfUlj2Mc06ycCxT%2BW8mr%2B0Y0bKG5rRcwNMp05i1d8m3XGoU9aI2WOuvpK3pJ1pHQAatzexuq%2BbXe%2FVSewHO2TGfZFY81LafM3sc4vbAQrg2IZ%2Fz8pa1Br0x4ierZNAY2Eb4ioAgAbF1dBnytFZDQoLhfHrJI7DnbOhFT7AWHAJ%2B2fUWthbGr9O0t9nQPbMMwubuUCgTfv2dRX5WeLJOWqfl%2F206iRPT%2Fa55DLOXdo6ibWTTTo0xwUuZG30TbM%2BZikD%2Fd1yXsld0umLUdumVpopzFK0z6j9C%2FH9zPQF0tZJJm6Mv0WaFX9%2F4V%2B%2FbcTsJePglCOzGtyCPTjrJEHvRpSyY%2BDP%2BH3TpamTOHg7ZdE%2BB3BafTk09vPRiEXai%2F9%2BXUWOw8z8NmhdNEA4Oa09ZrIIrpMA5MuZC1vIcSZuShBXJ4HvIc6Rg4aujzW4ThKwMuwG7cOiAEJTs3MWt5MDiohnTD3P5RxtDfdQT8OPgD0inr5ADsjpewIbrcExi4MNP0TH%2BkoChD%2BKBcjERxU5mye8N6nc1ACqJQPoESm9iWkfFGVirL1ak0REQjrAz1XaScIVZjqXNgMBjn8nvFTSMIMW%2F%2BX0WmoFaIdmhRe0zVNpa2AJFQ3QeZTLWXqpQ37XXX8LO8s0etnDKjLtP3O6LnUMWMRFSZIFNkFl33zcipAS7tqeY%2BbLGQub%2B1iZp5KAEVq08sQDM%2BokTbdeOr3gCQb2WxSkVSdBQsr4ppLNDQHQJcA9N3h1VBn2KbQFEk%2FNVZuZK6Stk9i62mUMfXFUgfZ%2F1PE6P%2FtcUhtXEsuVZcOHeZpW3Kap71P2GbHJ06qFpP%2BJJ%2BeqBYIzsE7CzEjG11r4bpqgNewAdeWMkmsQWc3oeQFFXOZkP2PjZv%2BRA3qvTmIzwPbMc4dm1pOz3HfB%2BGKe2XIPHX0wphsc5X1BipzRuKdbDNBJHz9fRcZB%2BfhNBigDlAHKAGWAMkDjA4yJickFwQ3uraPhYrQBF52NB3Dz5s0lHZQsXLiwwGQAspRDpHBd1jcqQDABgBRCqVQ2eXt7Z1BkETU0QDAE0BQH5eXljWA0E0hzxQ9cTU2Nhn04WAECAwPPsjRV7H13UnDhHt%2BhT0RERI5KpfqpD15SUoAs7xEtJOjupKysrBGsFPTnhYWFD3CZXxKALOOTlAIyCDs7uzRJAA4bNiyTJaCTQsDA4ubmli7pJAkNDT2n66Hww7q6Og0a6Ku66wd2s%2Fj4%2BDyjhBk8nHwYWAHwwGXLll0B1QYu4aOBd%2FDtt98u5AKICcbT94QBRODl0gZmaLd1kYCAbI1G00a%2F1Pz58wtEA4yOjs7duHHj9aNHj1YwsauGK5QsXbr0Mh8yMPp3IFVEPDx8%2BHAFnqGHYEdYaCF9zsPD4wxfIiZdcuLEiTuCAMKPCgoK6nQNCjJOvmYqKSl5qGusnJyc6l4FeOPGjUe6xoK5BZsYb9VTJtbDotd93GMmwZVNmzZd379%2FvxIaowdevnz5FX3gdu7cWUr%2FDmvxgQMHlJggCFEk0aLBYSYpKeky19vrGhwvqVarW%2BnfzJs3r8AogbqioqKJfhgAQMt03x07dvzIBe7x48ctAgiZ%2BANEQNa3HoOPC01XH7BIYYsgKUCw1pL5nFgBI6kA%2FiP9nZDTSZ1uMe7ymGdmrR8gdmpc6zCYQGkSJg5ttXD1KS0tfSSZBp2dnU%2BTSSvyOaRMoE0DWRjLakYK9h9ICjAhJk%2BenE8mDfBTATSB%2FGdxcXFxAzJhOtlkGfaoTVOXSjoAgY4X7iKQE4k%2FQKToXGk6322nk5PTaQPIwcTvXbds2aK1cUdgN5mNO445Tp48WQlTY4%2F8zTff3NGzfMmHRzJAGaAMUAYoA5QB%2FpoAOo%2BKygXBDe6to%2BFitAEXnY0H0GfmhhLyTjGaR%2BQbplMnYSmHyMZ1Wd%2BoAMEEAFKIiK0%2FNNkMfDqDIouooQGCIYCmOIj4sLgRjGYCaa74gZu087aGfThYAfoNGXeWpali77uTDRfu8V3nVY8RE3Pi9tT%2F1AcvKSlAlveIbiTo7lr4lmuNYKWgPw%2F964UHuMwvCUCW8UnKBjKIPlYS1UlsXYZmsgR0UjQwsFg6SFwncRz%2B7DldD4UfxnxyV4MG%2Bqru%2BoHdbIBvrHHqJHh4l4d1sp40tXvGLL4Cqo3%2FET0oUsA76BX%2Fu0IugJhgPH1PGEAEXi5tYIZ29xsQQMTvbWijX2pQ%2BBzxB5hOz0TmDp%2Bx7rr%2F0oMVTOyq4Qolg6MX6d2cgwxMywc%2FqdQgHo5Zsr8CzwAzn2CA3YUW0uesnQbxOkTXN2nGvXXsjkCAipSQdXl1ugYFGSdfM038W%2BFDXWNNWHOmurcBPtIJkDG3YBPjrXrKxHpY9LqPe4Ojk674vLT%2Buu%2FCPUpojB7YM3aJ3jrJM699VEr%2FDmux36LPlZggCFEk0aLhYSZqwWWut9c1OF4y%2FvMHrfRvBoW9Zpw6SeTfS5q0Ai8DAFrWCi%2Bvbv2RC1zcnroWAYRMAm7HMgFZ33oMPi40XX3AIoUtgqQAwVpL5nNiGxhJBfAf6e%2BEnE7qdItxl8c8M2v9ALFT41qHwQRKkzBxaKuFq0%2F45iLp6iQWdk6nyaQV%2BRxSJtCmgSyMZTXrEkqY%2FUdnUsBMiAFj4vPJpAF%2BKoAmkP8snrixoAGZMJ1ssgx7XTdNn5V3vd5hnQo6XriLQE4kIYRgdmlcaTrfbadF3%2F6nDSAHk2Lj%2FoH2xp0J7CazcccxR%2BCqf1bC1Ngjj3vr%2BB09y5d8eCQDlAH%2BagD%2BFyKhIyueS0jpAAAAAElFTkSuQmCC";
var img_link = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA8ElEQVR42mNgwAEeKHbJAfFrIP6OhL8i4c9AfJwBHwAq8ALin0D8Hwf%2BzkAIABX5APFvvAYAGQVAfBWInwPxSyhuhMrl4XUBkCiCcv5C%2FfUeiKcDMRMQ5%2BDRDDfgJtSfWmhOJ6QZbgAopF%2BiaY6CugiXxr%2FIBrzHYsBePJpnArEf1NU4DajAoXk2KGyQovg9VgOgCqZisRkcsEhqNHAaAFVQB8QXoTRIcxkoFaIrwmkAFgOfYzPgNQkGgBLYZ3TBu9AQVSCgWQaaoR6iS9RAAwmUwx7iwZ%2Bh6hrRDQAFTjMQP4Ua8h0L%2FgqVB6ljQdYPAMDbiNWgxT3XAAAAAElFTkSuQmCC";
var img_params_ext = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABBElEQVR42mNgQANv1SazAjEvFnHet6qTmRnwgbfqkxWAChcC8TEgDkISDwbyTwDxLCCWx22A2uRDQPwfij8CcSIQZwPxLyTxs%2FgM2IOkEBc%2Bic%2BAOIIGqE9OxxcGs4lwwUJ0W8VxOB0kxgHEXEC8F4v8biDmAxlQiNUm3VmsSJYIoAUkDDeBnF2JzQA0V3ID8R8s6tpBktJAfBOIPwPxXyTJtWCNqkAvqE9eiST%2BF6r21luNyQLItoASEXogfgLib1D2Pyg9H4ilcMVCAhGxkI0vHWxHU%2Fwbi9%2BP4DPgAJJCkNOzgLgAzZBT%2BAyQAeLFQHwf6B1XJHFPIH4IxDOBWIyBmgAAk%2FCE2HYfdn8AAAAASUVORK5CYII%3D";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAE1UlEQVR42s1UbUxTZxi9P5b92M9pHMsSN1scMBgILoqiuM2MEZwS7SKDIZnRqaFhARXHZIXh6MCNgZ8ICoGUAdaBLcJAKzC6drRa21GGgr21UOReURCQ214lzpy9926jISH88sducnI%2F8pzzPue5530p6nlfmp6n0gbbjEJteULXXee5GhPHVRmn6Qr9pKKsc0K6ILnewstqzV7WPvIUvcM8bK5pEXa3F2anF0UtLFvYNCKbl6zq5mSVhinPTeYJuvrGoLxAI6nEgu1F15Gp6kWzmYV1cBqH62hPpmpgrkh516SktGOc6R3h0WQZRTwh7VfZQY%2FycIx6UdLiRIzSgOqOQZgck9hT2sPsPGGVzAoUt7I53TSHdvs44gpMeDe7C96ZZwT4F88QX6BHTF4nGk0MGroZbFMacmYFci8M0lbiNUt1E9HZnViT1Q6a9aLsihP1Rjd4IlBvdCEsXYM9ZWYY%2BsfwfpaOnhXIqOrnba4pxOXrEfmlDuH7m0mxFud0DoxNz2B4jIei1org1AZEHtTC7JhAuFzLzwrsOmHlrc4pfHBEj7AMLUK%2F0CAkTYMp%2Fi8MMNOIkDcgYFcdlhNEyNUw0eNYllLvE5ApjbRxYBzycivC05sRIm9E0L4LCNxdL8J%2Fhwr%2ByVWQJFdiu%2FIKdHYGi7ZV%2BiwQPzlVOie0ZgaRGc2zxNHJJ2AmeCxNqhDhn1QOVYcD%2BcTOCzGnfUOMkDdJQvc2Mq0WBtXtNMJS1ZCkVCP1RKcIgbws4TSOqm1Q652goksYKqpYMicLS5NqZX4JKo%2FG5Ea9wYWP81sRtLMSAcnnsFmhRbWuH3VdNKhVP3iolYXzp%2FGluHLZi7GlbK7qOtpsI9D3j4posQwjs9wIKlzJUqH5soV307piKbWmSEGtOkpTEQUcFabkqJAjNBWcp6ACc6XU%2F%2F8a6W6S3jU0KIa7ztPuX%2Bu4oXYV57pcSd9pPaugL51a2AIhydydP7FTrl5M0FaM95tETDhuYKzPiFt1%2BWxfTe78QxzUVctcbRUegXzP0gZ7xSEYFJugPxyDG8f3gojj4YAZttI0D3mfK%2BJsOSOhm04yk3d6MKxXoytro0h65L4lgqyMyxnr4Ww%2BjQe9epi%2BS2CM38T7gtSvLswZ%2B9MA9loLrh6IhnpfJJ4%2B9syB8P1SWhSGOmpA5oKOAxt8USbt0oJX68l9Irn289V4NNSH2w1FGLxSJQoI9zPJEcLqGLVdxfm9kb7NZCnZzQsCbenrUbN7Fc6mrBSLb18sxuOH98DdcwneceyTFaj87B3RxsmkFb7tbMzbyo%2Ff%2FF1sUSCe%2BjRcKMAMNwFhqMKzcmsIviUQngW7efHBPgHih77f0wlzYSLKd0TgeOIK%2FLg9DIWyt0XkbA7C1x%2F9A1ILxnQJaRv9fRaInxyH5hhIcMT2%2FyN6HwzDc9%2BNr%2BICRWRvCgQJE%2F4oS0fi6qW%2BIZK2JGRF5u5vP4P8TtFr7pa3QKyJEMiHYgNgP3cQJJHYGv4asyXs1bnnASmSZX4Y4CFJBIkudPujRc9C%2Bxr5Wji0x3HnlzLEhvh5NgYtmT%2BNO6PekO1Y8zprPZWKu8aL4u8SIHR27ftkvBe4hF2%2FfPHC5wFpTbop1E8RE%2FwKTQjchjcXc%2Bv8F9NrpYsUqyUvP%2F%2Fz4G%2FT2pQ4ev%2B2BAAAAABJRU5ErkJggg%3D%3D";
var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";

/* ---------------------- */
/* des variables globales */
/* ---------------------- */

var extensions = ["wav", "mp3", "oga", "ogv", "ogg", "ogx", "webm", "m4v", "mp4", "gifv", "gfycat"];
var extensions_re = /^.*\.(wav|mp3|oga|ogv|ogg|ogx|webm|m4v|mp4|gifv)(?:[&?].*)?$/i;
var audio_mime = ["audio/wave", "audio/wav", "audio/x-wav", "audio/x-pn-wav",
  "audio/mpeg", "audio/ogg", "audio/webm"
];
var video_mime = ["video/ogg", "application/ogg", "video/webm", "video/mp4"];
var gfycat_re_1 = /^https?:\/\/gfycat\.com\/(?:[\w]+\/)?([\w]+)(?:[\w-]*?)?$/;
var gfycat_re_2 = /[A-Z]/g;
var default_width = 512;
var default_height = 288;
var helps = {
  "gmhtml5mlr_help_size": "<fieldset><legend>Tailles maximales</legend></fieldset>",
  "gmhtml5mlr_help_display": "<fieldset><legend>Mode d'affichage</legend><p>En mode «\u202fautomatique\u202f», les liens simples du post original qui pointent vers des vidéos sont automatiquement convertis en vidéos au chargement de la page. Les liens dans des quotes ou sur des images ou avec un texte modifié deviennent des liens cliquables avec le petit emoji \u0020\u25b6\ufe0f pour les distinguer.</p><p>En mode «\u202fen cliquant\u202f» tous les liens qui pointent vers des vidéos deviennent des liens cliquables avec le petit emoji \u0020\u25b6\ufe0f pour les distinguer.</p></fieldset>",
  "gmhtml5mlr_help_options": "<fieldset><legend>Options de lecture</legend></fieldset>"
};

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // style pour les liens cliquables (transformables)
  "a.cLink.gmhtml5mlr_link::after{content:\"\\0020\\25b6\\fe0f\";}" +
  // styles pour le media et les boutons
  "div.gmhtml5mlr_outer_div{display:inline-block;vertical-align:bottom;white-space:nowrap;position:relative;}" +
  "div.gmhtml5mlr_div{display:inline-block;vertical-align:bottom;position:relative;}" +
  ".gmhtml5mlr_media{vertical-align:bottom;" + (ff ? "" : "background-color:rgba(0,0,0,0.72);") + "}" +
  "div.gmhtml5mlr_button{cursor:pointer;width:40px;height:40px;top:0;background-image:url(" + img_buttons + ");" +
  "background-position:0% 0%;background-size:100% 600%;}" +
  "div.gmhtml5mlr_button_over{position:absolute;z-index:100;}" +
  "div.gmhtml5mlr_button_inline{display:inline-block;vertical-align:bottom;}" +
  "img.gmhtml5mlr_params_ext{position:absolute;cursor:pointer;top:0;right:1px;}" +
  // styles pour la fenêtre de configuration
  "#gmhtml5mlr_help_popup{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:1003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;" +
  "text-align:justify;}" +
  "#gmhtml5mlr_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gmhtml5mlr_config_window{position:fixed;width:auto;height:auto;background:transparent;z-index:1002;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s,left 0.3s ease 0s;font-size:12px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;display:flex;}" +
  "#gmhtml5mlr_config_window #gmhtml5mlr_content{box-sizing:border-box;width:402px;border:1px solid #242424;" +
  "padding:16px;background:#ffffff;}" +
  "#gmhtml5mlr_config_window #gmhtml5mlr_help{box-sizing:border-box;width:0;padding:16px 0;border-width:0;" +
  "border-style:solid;border-color:#242424;background-color:#e3ebf5;overflow:hidden;" +
  "transition:width 0.3s ease 0s,padding 0.3s ease 0s,border-width 0.3s ease 0s;}" +
  "#gmhtml5mlr_config_window .gmhtml5mlr_help_button{vertical-align:text-bottom;margin:0 0 0 2px;" +
  "cursor:pointer;width:16px;height:16px;object-fit:none;object-position:0 0;}" +
  "#gmhtml5mlr_config_window div.gmhtml5mlr_main_title{font-size:16px;text-align:center;font-weight:bold;" +
  "margin:0 0 10px;}" +
  "#gmhtml5mlr_config_window fieldset{margin:0 0 8px;border:1px solid #888888;padding:6px 10px 10px;}" +
  "#gmhtml5mlr_config_window #gmhtml5mlr_help fieldset{margin:0;box-sizing:border-box;height:100%;" +
  "overflow:hidden;}" +
  "#gmhtml5mlr_config_window legend{font-size:14px;}" +
  "#gmhtml5mlr_config_window div.gmhtml5mlr_table{display:table;width:100%;}" +
  "#gmhtml5mlr_config_window div.gmhtml5mlr_cell{display:table-cell;width:50%;}" +
  "#gmhtml5mlr_config_window div.gmhtml5mlr_left{text-align:right;padding-right:4px;}" +
  "#gmhtml5mlr_config_window div.gmhtml5mlr_right{text-align:left;padding-left:4px;}" +
  "#gmhtml5mlr_config_window p{margin:0 0 0 4px;}" +
  "#gmhtml5mlr_config_window p:not(:last-child){margin-bottom:4px;}" +
  "#gmhtml5mlr_config_window #gmhtml5mlr_help p{margin:0 4px;box-sizing:border-box;text-align:justify;}" +
  "#gmhtml5mlr_config_window #gmhtml5mlr_help p:not(:last-child){margin-bottom:10px;}" +
  "#gmhtml5mlr_config_window input[type=\"radio\"]{margin:0 0 2px;vertical-align:text-bottom;}" +
  "#gmhtml5mlr_config_window input[type=\"text\"]{padding:0 1px;border:1px solid #c0c0c0;height:14px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;text-align:right;}" +
  "#gmhtml5mlr_config_window input[type=\"checkbox\"]{margin:0 0 1px;vertical-align:text-bottom;}" +
  "#gmhtml5mlr_config_window div.gmhtml5mlr_save_close_div{text-align:right;margin:16px 0 0;}" +
  "#gmhtml5mlr_config_window div.gmhtml5mlr_save_close_div div.gmhtml5mlr_info_reload_div" +
  "{float:left;}" +
  "#gmhtml5mlr_config_window div.gmhtml5mlr_save_close_div div.gmhtml5mlr_info_reload_div img" +
  "{vertical-align:text-bottom;}" +
  "#gmhtml5mlr_config_window div.gmhtml5mlr_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  "#gmhtml5mlr_config_window img.gmhtml5mlr_help_dot{margin-right:1px;cursor:help;" +
  "width:16px;height:16px;object-fit:none;object-position:0 0;}";
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// création de la fenêtre d'aide
var help_popup = document.createElement("div");
help_popup.setAttribute("id", "gmhtml5mlr_help_popup");
document.body.appendChild(help_popup);

// fonction de création du bouton d'aide
function create_help_dot(width, text) {
  let help_dot = document.createElement("img");
  help_dot.setAttribute("src", img_help);
  help_dot.setAttribute("class", "gmhtml5mlr_help_dot");
  help_dot.addEventListener("mouseover", function(e) {
    help_popup.style.width = width + "px";
    help_popup.textContent = text;
    help_popup.style.left = (e.clientX + 32) + "px";
    help_popup.style.top = (e.clientY - 16) + "px";
    help_popup.style.visibility = "visible";
  }, false);
  help_dot.addEventListener("mouseout", function(e) {
    help_popup.style.visibility = "hidden";
  }, false);
  return help_dot;
}

// création du voile de fond pour la fenêtre de configuration
var config_background = document.createElement("div");
config_background.setAttribute("id", "gmhtml5mlr_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gmhtml5mlr_config_window");
document.body.appendChild(config_window);

// création des blocs contenu et aide
var content_window = document.createElement("div");
content_window.setAttribute("id", "gmhtml5mlr_content");
config_window.appendChild(content_window);
var help_window = document.createElement("div");
help_window.setAttribute("id", "gmhtml5mlr_help");
config_window.appendChild(help_window);

// gestion des boutons d'aide
var last_help = null;
var help_width = "240px"

function ask_for_help(e) {
  if(last_help === this.id) {
    this.style.objectPosition = "0 0";
    help_window.style.width = "0";
    help_window.style.padding = "16px 0";
    help_window.style.borderWidth = "0";
    config_window.style.left = "calc(" + config_window.style.left + " + (" + help_width + " / 2))";
    last_help = null;
  } else {
    this.style.objectPosition = "0 -16px";
    help_window.innerHTML = helps[this.id];
    if(last_help !== null) {
      document.getElementById(last_help).style.objectPosition = "0 0";
    } else {
      help_window.style.borderWidth = "1px 1px 1px 0";
      help_window.style.padding = "16px";
      help_window.style.width = help_width;
      config_window.style.left = "calc(" + config_window.style.left + " - (" + help_width + " / 2))";
    }
    last_help = this.id;
  }
}

function create_help_button(help_id, title) {
  let help_button = document.createElement("img");
  help_button.setAttribute("id", help_id);
  help_button.setAttribute("title", title);
  help_button.className = "gmhtml5mlr_help_button";
  help_button.setAttribute("src", img_help);
  help_button.addEventListener("click", ask_for_help, false);
  return help_button;
}

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.className = "gmhtml5mlr_main_title";
main_title.appendChild(document.createTextNode("Configuration du script"));
main_title.appendChild(document.createElement("br"));
main_title.appendChild(document.createTextNode("[HFR] HTML5 Media Link Replacer"));
content_window.appendChild(main_title);

// section tailles
var size_fieldset = document.createElement("fieldset");
var size_legend = document.createElement("legend");
size_legend.textContent = "Tailles maximales";
//size_legend.appendChild(create_help_button("gmhtml5mlr_help_size", "Aide des tailles maximales"));
size_fieldset.appendChild(size_legend);
content_window.appendChild(size_fieldset);

// block des tailles
var size_div = document.createElement("div");
size_div.className = "gmhtml5mlr_table";
size_fieldset.appendChild(size_div);

// block largeur
var largeur_div = document.createElement("div");
largeur_div.className = "gmhtml5mlr_cell";
var largeur_fixe_p = document.createElement("p");
var largeur_fixe_radio = document.createElement("input");
largeur_fixe_radio.setAttribute("type", "radio");
largeur_fixe_radio.setAttribute("id", "gmhtml5mlr_largeur_fixe_radio");
largeur_fixe_radio.setAttribute("name", "gmhtml5mlr_largeur_radios");
largeur_fixe_p.appendChild(largeur_fixe_radio);
var largeur_fixe_label_radio = document.createElement("label");
largeur_fixe_label_radio.textContent = " largeur fixe ";
largeur_fixe_label_radio.setAttribute("for", "gmhtml5mlr_largeur_fixe_radio");
largeur_fixe_p.appendChild(largeur_fixe_label_radio);
var largeur_fixe_input = document.createElement("input");
largeur_fixe_input.setAttribute("type", "text");
largeur_fixe_input.setAttribute("id", "gmhtml5mlr_largeur_fixe_input");
largeur_fixe_input.setAttribute("size", "3");
largeur_fixe_input.setAttribute("maxLength", "4");
largeur_fixe_input.setAttribute("pattern", "[1-9]([0-9])*");
largeur_fixe_input.addEventListener("click", function() {
  largeur_fixe_input.select();
}, false);
largeur_fixe_p.appendChild(largeur_fixe_input);
var largeur_fixe_label_input = document.createElement("label");
largeur_fixe_label_input.textContent = " px";
largeur_fixe_label_input.setAttribute("for", "gmhtml5mlr_largeur_fixe_input");
largeur_fixe_p.appendChild(largeur_fixe_label_input);
largeur_div.appendChild(largeur_fixe_p);
var largeur_fenetre_p = document.createElement("p");
var largeur_fenetre_radio = document.createElement("input");
largeur_fenetre_radio.setAttribute("type", "radio");
largeur_fenetre_radio.setAttribute("id", "gmhtml5mlr_largeur_fenetre_radio");
largeur_fenetre_radio.setAttribute("name", "gmhtml5mlr_largeur_radios");
largeur_fenetre_p.appendChild(largeur_fenetre_radio);
var largeur_fenetre_label = document.createElement("label");
largeur_fenetre_label.textContent = " largeur de la fenêtre";
largeur_fenetre_label.setAttribute("for", "gmhtml5mlr_largeur_fenetre_radio");
largeur_fenetre_p.appendChild(largeur_fenetre_label);
largeur_div.appendChild(largeur_fenetre_p);
var largeur_video_p = document.createElement("p");
var largeur_video_radio = document.createElement("input");
largeur_video_radio.setAttribute("type", "radio");
largeur_video_radio.setAttribute("id", "gmhtml5mlr_largeur_video_radio");
largeur_video_radio.setAttribute("name", "gmhtml5mlr_largeur_radios");
largeur_video_p.appendChild(largeur_video_radio);
var largeur_video_label = document.createElement("label");
largeur_video_label.textContent = " largeur de la vidéo";
largeur_video_label.setAttribute("for", "gmhtml5mlr_largeur_video_radio");
largeur_video_p.appendChild(largeur_video_label);
largeur_div.appendChild(largeur_video_p);
size_div.appendChild(largeur_div);

// block hauteur
var hauteur_div = document.createElement("div");
hauteur_div.className = "gmhtml5mlr_cell";
var hauteur_fixe_p = document.createElement("p");
var hauteur_fixe_radio = document.createElement("input");
hauteur_fixe_radio.setAttribute("type", "radio");
hauteur_fixe_radio.setAttribute("id", "gmhtml5mlr_hauteur_fixe_radio");
hauteur_fixe_radio.setAttribute("name", "gmhtml5mlr_hauteur_radios");
hauteur_fixe_p.appendChild(hauteur_fixe_radio);
var hauteur_fixe_label_radio = document.createElement("label");
hauteur_fixe_label_radio.textContent = " hauteur fixe ";
hauteur_fixe_label_radio.setAttribute("for", "gmhtml5mlr_hauteur_fixe_radio");
hauteur_fixe_p.appendChild(hauteur_fixe_label_radio);
var hauteur_fixe_input = document.createElement("input");
hauteur_fixe_input.setAttribute("type", "text");
hauteur_fixe_input.setAttribute("id", "gmhtml5mlr_hauteur_fixe_input");
hauteur_fixe_input.setAttribute("size", "3");
hauteur_fixe_input.setAttribute("maxLength", "4");
hauteur_fixe_input.setAttribute("pattern", "[1-9]([0-9])*");
hauteur_fixe_input.addEventListener("click", function() {
  hauteur_fixe_input.select();
}, false);
hauteur_fixe_p.appendChild(hauteur_fixe_input);
var hauteur_fixe_label_input = document.createElement("label");
hauteur_fixe_label_input.textContent = " px";
hauteur_fixe_label_input.setAttribute("for", "gmhtml5mlr_hauteur_fixe_input");
hauteur_fixe_p.appendChild(hauteur_fixe_label_input);
hauteur_div.appendChild(hauteur_fixe_p);
var hauteur_fenetre_p = document.createElement("p");
var hauteur_fenetre_radio = document.createElement("input");
hauteur_fenetre_radio.setAttribute("type", "radio");
hauteur_fenetre_radio.setAttribute("id", "gmhtml5mlr_hauteur_fenetre_radio");
hauteur_fenetre_radio.setAttribute("name", "gmhtml5mlr_hauteur_radios");
hauteur_fenetre_p.appendChild(hauteur_fenetre_radio);
var hauteur_fenetre_label = document.createElement("label");
hauteur_fenetre_label.textContent = " hauteur de la fenêtre";
hauteur_fenetre_label.setAttribute("for", "gmhtml5mlr_hauteur_fenetre_radio");
hauteur_fenetre_p.appendChild(hauteur_fenetre_label);
hauteur_div.appendChild(hauteur_fenetre_p);
var hauteur_video_p = document.createElement("p");
var hauteur_video_radio = document.createElement("input");
hauteur_video_radio.setAttribute("type", "radio");
hauteur_video_radio.setAttribute("id", "gmhtml5mlr_hauteur_video_radio");
hauteur_video_radio.setAttribute("name", "gmhtml5mlr_hauteur_radios");
hauteur_video_p.appendChild(hauteur_video_radio);
var hauteur_video_label = document.createElement("label");
hauteur_video_label.textContent = " hauteur de la vidéo";
hauteur_video_label.setAttribute("for", "gmhtml5mlr_hauteur_video_radio");
hauteur_video_p.appendChild(hauteur_video_label);
hauteur_div.appendChild(hauteur_video_p);
size_div.appendChild(hauteur_div);

// section affichage
var display_fieldset = document.createElement("fieldset");
var display_legend = document.createElement("legend");
display_legend.textContent = "Mode d'affichage";
//display_legend.appendChild(create_help_button("gmhtml5mlr_help_display", "Aide du mode d'affichage"));
display_fieldset.appendChild(display_legend);
content_window.appendChild(display_fieldset);

// table des affichage
var display_div = document.createElement("div");
display_div.className = "gmhtml5mlr_table";
display_fieldset.appendChild(display_div);

// block auto
var display_auto_div = document.createElement("div");
display_auto_div.className = "gmhtml5mlr_cell gmhtml5mlr_left";
var display_auto_label = document.createElement("label");
display_auto_label.textContent = "automatique ";
display_auto_label.setAttribute("for", "gmhtml5mlr_display_auto_radio");
display_auto_div.appendChild(display_auto_label);
var display_auto_radio = document.createElement("input");
display_auto_radio.setAttribute("type", "radio");
display_auto_radio.setAttribute("id", "gmhtml5mlr_display_auto_radio");
display_auto_radio.setAttribute("name", "gmhtml5mlr_display_radios");
display_auto_div.appendChild(display_auto_radio);
display_div.appendChild(display_auto_div);

// block click
var display_click_div = document.createElement("div");
display_click_div.className = "gmhtml5mlr_cell  gmhtml5mlr_right";
var display_click_radio = document.createElement("input");
display_click_radio.setAttribute("type", "radio");
display_click_radio.setAttribute("id", "gmhtml5mlr_display_click_radio");
display_click_radio.setAttribute("name", "gmhtml5mlr_display_radios");
display_click_div.appendChild(display_click_radio);
var display_click_label = document.createElement("label");
display_click_label.textContent = " en cliquant";
display_click_label.setAttribute("for", "gmhtml5mlr_display_click_radio");
display_click_div.appendChild(display_click_label);
display_div.appendChild(display_click_div);

// section options
var options_fieldset = document.createElement("fieldset");
var options_legend = document.createElement("legend");
options_legend.textContent = "Options de lecture";
//options_legend.appendChild(create_help_button("gmhtml5mlr_help_options", "Aides des options de lecture"));
options_fieldset.appendChild(options_legend);
content_window.appendChild(options_fieldset);

// table des options
var options_div = document.createElement("div");
options_div.className = "gmhtml5mlr_table";
options_fieldset.appendChild(options_div);

// block de gauche
var options_left_div = document.createElement("div");
options_left_div.className = "gmhtml5mlr_cell";
var controls_p = document.createElement("p");
var controls_checkbox = document.createElement("input");
controls_checkbox.setAttribute("type", "checkbox");
controls_checkbox.setAttribute("id", "gmhtml5mlr_controls_checkbox");
controls_p.appendChild(controls_checkbox);
var controls_label = document.createElement("label");
controls_label.textContent = " afficher les contrôles";
controls_label.setAttribute("for", "gmhtml5mlr_controls_checkbox");
controls_p.appendChild(controls_label);
options_left_div.appendChild(controls_p);
var muted_p = document.createElement("p");
var muted_checkbox = document.createElement("input");
muted_checkbox.setAttribute("type", "checkbox");
muted_checkbox.setAttribute("id", "gmhtml5mlr_muted_checkbox");
muted_p.appendChild(muted_checkbox);
var muted_label = document.createElement("label");
muted_label.textContent = " couper le son";
muted_label.setAttribute("for", "gmhtml5mlr_muted_checkbox");
muted_p.appendChild(muted_label);
options_left_div.appendChild(muted_p);
options_div.appendChild(options_left_div);

// block de droite
var options_right_div = document.createElement("div");
options_right_div.className = "gmhtml5mlr_cell";
var autoplay_p = document.createElement("p");
var autoplay_checkbox = document.createElement("input");
autoplay_checkbox.setAttribute("type", "checkbox");
autoplay_checkbox.setAttribute("id", "gmhtml5mlr_autoplay_checkbox");
autoplay_p.appendChild(autoplay_checkbox);
var autoplay_label = document.createElement("label");
autoplay_label.textContent = " lecture automatique";
autoplay_label.setAttribute("for", "gmhtml5mlr_autoplay_checkbox");
autoplay_p.appendChild(autoplay_label);
options_right_div.appendChild(autoplay_p);
var autoloop_p = document.createElement("p");
var autoloop_checkbox = document.createElement("input");
autoloop_checkbox.setAttribute("type", "checkbox");
autoloop_checkbox.setAttribute("id", "gmhtml5mlr_autoloop_checkbox");
autoloop_p.appendChild(autoloop_checkbox);
var autoloop_label = document.createElement("label");
autoloop_label.textContent = " lecture en boucle";
autoloop_label.setAttribute("for", "gmhtml5mlr_autoloop_checkbox");
autoloop_p.appendChild(autoloop_label);
options_right_div.appendChild(autoloop_p);
options_div.appendChild(options_right_div);

// rechargement de la page et boutons de validation et de fermeture
var save_close_div = document.createElement("div");
save_close_div.className = "gmhtml5mlr_save_close_div";
var info_reload_div = document.createElement("div");
info_reload_div.className = "gmhtml5mlr_info_reload_div";
var info_reload_checkbox = document.createElement("input");
info_reload_checkbox.setAttribute("type", "checkbox");
info_reload_checkbox.setAttribute("id", "gmhtml5mlr_info_reload_checkbox");
info_reload_div.appendChild(info_reload_checkbox);
var info_reload_label = document.createElement("label");
info_reload_label.textContent = " recharger la page ";
info_reload_label.setAttribute("for", "gmhtml5mlr_info_reload_checkbox");
info_reload_div.appendChild(info_reload_label);
info_reload_div.appendChild(create_help_dot(255,
  "La modification des paramètres de cette fenêtre de configuration n'est visible que sur les nouvelles " +
  "pages ou après le rechargement de la page courante. Cette option permet de recharger automatiquement la " +
  "page courante lors de la validation."));
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
content_window.appendChild(save_close_div);

// fonction de validation de la fenêtre de configuration
function save_config_window() {
  // fermeture de la fenêtre
  hide_config_window();
  // analyse des paramètres
  let widthtype = 0;
  if(largeur_fenetre_radio.checked) {
    widthtype = 1;
  }
  if(largeur_video_radio.checked) {
    widthtype = 2;
  }
  let maxwidth = parseInt(largeur_fixe_input.value, 10);
  maxwidth = maxwidth > 0 ? maxwidth : default_width;
  let heighttype = 0;
  if(hauteur_fenetre_radio.checked) {
    heighttype = 1;
  }
  if(hauteur_video_radio.checked) {
    heighttype = 2;
  }
  let maxheight = parseInt(hauteur_fixe_input.value, 10);
  maxheight = maxheight > 0 ? maxheight : default_height;
  let needclick = display_click_radio.checked;
  let autoplay = autoplay_checkbox.checked;
  let autoloop = autoloop_checkbox.checked;
  let controls = controls_checkbox.checked;
  let muted = muted_checkbox.checked;
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("maxwidth", maxwidth),
    GM.setValue("widthtype", widthtype),
    GM.setValue("maxheight", maxheight),
    GM.setValue("heighttype", heighttype),
    GM.setValue("needclick", needclick),
    GM.setValue("autoplay", autoplay),
    GM.setValue("autoloop", autoloop),
    GM.setValue("controls", controls),
    GM.setValue("muted", muted),
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
  if(last_help !== null) {
    document.getElementById(last_help).style.objectPosition = "0 0";
    config_window.style.left = "calc(" + config_window.style.left + " + (275px / 2))";
  }
  help_window.style.width = "0";
  help_window.style.padding = "16px 0";
  help_window.style.borderWidth = "0";
  last_help = null;
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
  // récupération des paramètres
  Promise.all([
    GM.getValue("maxwidth", default_width),
    GM.getValue("widthtype", 0), // 0, 1, 2
    GM.getValue("maxheight", default_height),
    GM.getValue("heighttype", 0), // 0, 1, 2
    GM.getValue("needclick", false),
    GM.getValue("autoplay", false),
    GM.getValue("autoloop", false),
    GM.getValue("controls", true),
    GM.getValue("muted", true),
  ]).then(function([
    maxwidth,
    widthtype,
    maxheight,
    heighttype,
    needclick,
    autoplay,
    autoloop,
    controls,
    muted,
  ]) {
    // initialisation des paramètres
    largeur_fixe_radio.checked = (widthtype === 0);
    largeur_fixe_input.value = maxwidth;
    largeur_fenetre_radio.checked = (widthtype === 1);
    largeur_video_radio.checked = (widthtype === 2);
    hauteur_fixe_radio.checked = (heighttype === 0);
    hauteur_fixe_input.value = maxheight;
    hauteur_fenetre_radio.checked = (heighttype === 1);
    hauteur_video_radio.checked = (heighttype === 2);
    display_auto_radio.checked = !needclick;
    display_click_radio.checked = needclick;
    autoplay_checkbox.checked = autoplay;
    autoloop_checkbox.checked = autoloop;
    controls_checkbox.checked = controls;
    muted_checkbox.checked = muted;
    info_reload_checkbox.checked = false;
    // affichage de la fenêtre
    config_window.style.visibility = "visible";
    config_background.style.visibility = "visible";
    config_window.style.left =
      parseInt((document.documentElement.clientWidth - config_window.offsetWidth) / 2, 10) + "px";
    config_window.style.top =
      parseInt((document.documentElement.clientHeight - config_window.offsetHeight) / 2, 10) + "px";
    help_window.style.height = config_window.offsetHeight + "px";
    config_background.style.width = document.documentElement.scrollWidth + "px";
    config_background.style.height = document.documentElement.scrollHeight + "px";
    config_window.style.opacity = "1";
    config_background.style.opacity = "0.8";
  });
}

// ajout d'une entrée de configuration dans le menu greasemonkey si c'est possible (pas gm4 yet)
if(typeof GM_registerMenuCommand !== "undefined") {
  GM_registerMenuCommand("[HFR] HTML5 Media Link Replacer -> Configuration", show_config_window);
}

/* ------------------------------------------ */
/* récupération des liens et des liens quotés */
/* ------------------------------------------ */

var links = document.querySelectorAll(
  "td.messCase2 > div[id^='para'] > span:not(.signature) a.cLink, " +
  "td.messCase2 > div[id^='para'] > div:not(.edited) a.cLink, " +
  "td.messCase2 > div[id^='para'] > *:not(span):not(div) a.cLink"
);
var linksq = document.querySelectorAll(
  "td.messCase2 > div[id^='para'] table.quote a.cLink, " +
  "td.messCase2 > div[id^='para'] table.citation a.cLink, " +
  "td.messCase2 > div[id^='para'] table.oldcitation a.cLink"
);
links = Array.from(links);
linksq = Array.from(linksq);
var filtered_links = [];
for(let l of links) {
  if(!linksq.includes(l)) {
    filtered_links.push(l)
  }
}
links = filtered_links;

/* ----------------------------------------- */
/* les fonctions de transformation des liens */
/* ----------------------------------------- */

function add_media(p_media_div, p_media, p_media_type, p_link,
  p_external_link, p_loop, p_params, p_params_ext, p_autoplay) {
  let outer_media_div = document.createElement("div");
  outer_media_div.className = "gmhtml5mlr_outer_div";
  outer_media_div.appendChild(p_media_div);
  outer_media_div.appendChild(document.createTextNode("\u00A0"));
  if(p_params_ext) {
    outer_media_div.appendChild(p_params_ext);
  }
  outer_media_div.appendChild(p_external_link);
  p_link.parentNode.replaceChild(outer_media_div, p_link);
  if(p_media_type !== "video") {
    p_loop.style.width = p_media.clientHeight + "px";
    p_loop.style.height = p_media.clientHeight + "px";
    p_params.style.width = p_media.clientHeight + "px";
    p_params.style.height = p_media.clientHeight + "px";
  }
  if(p_autoplay) {
    p_media.play();
  }
}

function replace(links, p_maxwidth, p_maxheight, p_needclick, p_autoplay, p_autoloop, p_controls, p_muted) {
  for(let link of links) {
    if(link.firstChild) {
      if(link.href.match(/^https?:\/\/forum\.hardware\.fr\/.*$/g) === null) {
        let ext = null;
        let gfycat = gfycat_re_1.exec(link.href);
        if(gfycat && gfycat_re_2.test(gfycat[1])) {
          gfycat = gfycat[1];
          ext = "gfycat";
        } else {
          ext = extensions_re.exec(link.href);
          ext = (ext && ext.length > 0) ? ext[1] : null;
        }
        if(ext) {
          if(extensions.indexOf(ext) !== -1) {
            GM.xmlHttpRequest({
              method: "HEAD",
              url: link.href,
              mozAnon: true,
              anonymous: true,
              headers: {
                "Cookie": ""
              },
              onload: function(response) {
                let mime = /^ *content-type *: *(.*?) *$/im.exec(response.responseHeaders);
                if(mime) {
                  mime = mime[1];
                  let media_type = "";
                  if(audio_mime.indexOf(mime) !== -1) {
                    media_type = "audio";
                  } else if((video_mime.indexOf(mime) !== -1) || (ext === "gifv") || (ext === "gfycat")) {
                    media_type = "video";
                  }
                  if(media_type !== "") {
                    // construction du media et de sa source
                    let media_div = document.createElement("div");
                    media_div.className = "gmhtml5mlr_div";
                    let media = document.createElement(media_type);
                    media.setAttribute("title", link.href);
                    media.className = "gmhtml5mlr_media";
                    if(ext === "gifv") {
                      let source_webm = document.createElement("source");
                      source_webm.setAttribute("type", "video/webm");
                      source_webm.setAttribute("src", link.href.replace(/.gifv/, ".webm"));
                      let source_mp4 = document.createElement("source");
                      source_mp4.setAttribute("type", "video/mp4");
                      source_mp4.setAttribute("src", link.href.replace(/.gifv/, ".mp4"));
                      media.appendChild(source_webm);
                      media.appendChild(source_mp4);
                    } else if(ext === "gfycat") {
                      let source_zippy = document.createElement("source");
                      source_zippy.setAttribute("type", "video/webm");
                      source_zippy.setAttribute("src", "https://zippy.gfycat.com/" + gfycat + ".webm");
                      let source_fat = document.createElement("source");
                      source_fat.setAttribute("type", "video/webm");
                      source_fat.setAttribute("src", "https://fat.gfycat.com/" + gfycat + ".webm");
                      let source_giant = document.createElement("source");
                      source_giant.setAttribute("type", "video/webm");
                      source_giant.setAttribute("src", "https://giant.gfycat.com/" + gfycat + ".webm");
                      media.appendChild(source_zippy);
                      media.appendChild(source_fat);
                      media.appendChild(source_giant);
                    } else {
                      media.setAttribute("src", link.href);
                    }
                    media.addEventListener("click", function(e) {
                      e.stopPropagation();
                    }, false);
                    media_div.appendChild(media);
                    // application des paramètres de configuration sur le media
                    if(p_maxwidth !== null) {
                      media.style.maxWidth = p_maxwidth + "px";
                    }
                    if(p_maxheight !== null) {
                      media.style.maxHeight = p_maxheight + "px";
                    }
                    media.loop = p_autoloop;
                    if(media_type === "video") {
                      media.controls = p_controls;
                      if(!p_controls) {
                        media.addEventListener("click", function(e) {
                          if(this.paused) {
                            this.play();
                          } else {
                            this.pause();
                          }
                        }, false);
                      }
                    } else {
                      media.controls = true;
                    }
                    media.muted = p_muted;
                    // construction des boutons boucle et configuration
                    let loop = null;
                    let params = null;
                    if(p_controls || media_type !== "video") {
                      loop = document.createElement("div");
                      loop.className = "gmhtml5mlr_button";
                      if(media.loop) {
                        loop.setAttribute("title", "Ne pas boucler");
                      } else {
                        loop.setAttribute("title", "Boucler");
                      }
                      params = document.createElement("div");
                      params.className = "gmhtml5mlr_button";
                      params.setAttribute("title", "Configuration");
                      if(media_type === "video") {
                        loop.classList.add("gmhtml5mlr_button_over");
                        loop.style.left = "0";
                        loop.style.backgroundPosition = "0% 0%";
                        params.classList.add("gmhtml5mlr_button_over");
                        params.style.right = "0";
                        params.style.backgroundPosition = "0% 0%";
                      } else {
                        loop.classList.add("gmhtml5mlr_button_inline");
                        if(media.loop) {
                          loop.style.backgroundPosition = "0% 60%";
                        } else {
                          loop.style.backgroundPosition = "0% 20%";
                        }
                        params.classList.add("gmhtml5mlr_button_inline");
                        params.style.backgroundPosition = "0% 80%";
                      }
                      loop.addEventListener("click", function(e) {
                        e.stopPropagation();
                        if(media.loop) {
                          media.loop = false;
                          loop.setAttribute("title", "Boucler");
                          loop.style.backgroundPosition = "0% 20%";
                        } else {
                          media.loop = true;
                          loop.setAttribute("title", "Ne pas boucler");
                          loop.style.backgroundPosition = "0% 60%";
                        }
                      }, false);
                      params.addEventListener("click", function(e) {
                        e.stopPropagation();
                        show_config_window();
                      }, false);
                      loop.addEventListener("mouseover", function(e) {
                        loop.style.backgroundPosition = "0% 40%";
                      }, false);
                      loop.addEventListener("mouseout", function(e) {
                        if(media_type === "video") {
                          loop.style.backgroundPosition = "0% 0%";
                        } else {
                          if(media.loop) {
                            loop.style.backgroundPosition = "0% 60%";
                          } else {
                            loop.style.backgroundPosition = "0% 20%";
                          }
                        }
                      }, false);
                      params.addEventListener("mouseover", function(e) {
                        params.style.backgroundPosition = "0% 100%";
                      }, false);
                      params.addEventListener("mouseout", function(e) {
                        if(media_type === "video") {
                          params.style.backgroundPosition = "0% 0%";
                        } else {
                          params.style.backgroundPosition = "0% 80%";
                        }
                      }, false);
                      if(media_type === "video") {
                        media_div.addEventListener("mouseover", function(e) {
                          if(media.loop) {
                            loop.style.backgroundPosition = "0% 60%";
                          } else {
                            loop.style.backgroundPosition = "0% 20%";
                          }
                          params.style.backgroundPosition = "0% 80%";
                        }, true);
                        media_div.addEventListener("mouseleave", function(e) {
                          loop.style.backgroundPosition = "0% 0%";
                          params.style.backgroundPosition = "0% 0%";
                        }, false);
                      }
                      media_div.insertBefore(loop, media);
                      media_div.appendChild(params);
                    }
                    // construction du bouton de configuration exterieur
                    let params_ext = null;
                    if(!p_controls && media_type === "video") {
                      params_ext = document.createElement("img");
                      params_ext.setAttribute("src", img_params_ext);
                      params_ext.className = "gmhtml5mlr_params_ext";
                      params_ext.setAttribute("title", "Configuration");
                      params_ext.addEventListener("click", function(e) {
                        e.stopPropagation();
                        show_config_window();
                      }, false);
                    }
                    // construction du lien exterieur vers le media
                    let external_link = document.createElement("a");
                    external_link.setAttribute("href", link.href);
                    external_link.setAttribute("target", "_blank");
                    external_link.setAttribute("title", link.href);
                    external_link.setAttribute("class", "cLink");
                    external_link.addEventListener("click", function(e) {
                      e.stopPropagation();
                    }, false);
                    let img_external_link = document.createElement("img");
                    img_external_link.setAttribute("src", img_link);
                    img_external_link.style.verticalAlign = "bottom";
                    external_link.appendChild(img_external_link);
                    // transformation du lien en media ou ajout du click sur le lien pour le transformer en media
                    if(!p_needclick && link.firstChild && link.firstChild.nodeType === 3 &&
                      link.firstChild.nodeValue.indexOf(link.href.substr(0, 34)) === 0) {
                      add_media(media_div, media, media_type, link,
                        external_link, loop, params, params_ext, p_autoplay);
                    } else {
                      link.classList.add("gmhtml5mlr_link");
                      link.addEventListener("click", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        add_media(media_div, media, media_type, link,
                          external_link, loop, params, params_ext, p_autoplay);
                      }, true);
                    } // p_needclick
                  } // if media_type
                } // if mime
              } // function onload
            }); // objet gm.xhr
          } //if extensions
        } // if ext
      } // if forum
    } // if firstchild
  } // for links
} // function replace

/* ------------------------------------------------------- */
/* récupération des paramètres et transformation des liens */
/* ------------------------------------------------------- */

Promise.all([
  GM.getValue("maxwidth", default_width),
  GM.getValue("widthtype", 0), // 0, 1, 2
  GM.getValue("maxheight", default_height),
  GM.getValue("heighttype", 0), // 0, 1, 2
  GM.getValue("needclick", false),
  GM.getValue("autoplay", false),
  GM.getValue("autoloop", false),
  GM.getValue("controls", true),
  GM.getValue("muted", true),
]).then(function([
  maxwidth,
  widthtype,
  maxheight,
  heighttype,
  needclick,
  autoplay,
  autoloop,
  controls,
  muted,
]) {
  if(widthtype === 1) {
    maxwidth = window.innerWidth - 330;
  }
  if(widthtype === 2) {
    maxwidth = null;
  }
  if(heighttype === 1) {
    maxheight = window.innerHeight - 20;
  }
  if(heighttype === 2) {
    maxheight = null;
  }
  replace(links, maxwidth, maxheight, false || needclick, autoplay, autoloop, controls, muted);
  replace(linksq, maxwidth, maxheight, true, autoplay, autoloop, controls, muted);
});
