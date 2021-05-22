// ==UserScript==
// @name          [HFR] Alerte Qualitaÿ mod_r21
// @version       3.0.3
// @namespace     roger21.free.fr
// @description   Permet de signaler une Alerte Qualitaÿ à la communauté.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*/*-sujet_*_*.htm*
// @exclude       https://forum.hardware.fr/forum2.php*cat=prive*
// @author        roger21
// @authororig    toyonos
// @modifications refonte du code, modernisation, fenêtre de configuration et compatibilité
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_alerte_quali_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_alerte_quali_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_alerte_quali_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @connect       alerte-qualitay.toyonos.info
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.xmlHttpRequest
// @grant         GM_xmlhttpRequest
// @grant         GM.registerMenuCommand
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2011-2012, 2014-2021 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 2898 $

// historique :
// 3.0.3 (22/05/2021) :
// - ajout d'une confirmation avant l'accès au formulaire de l'alerte ->
// (pour éviter une éventuelle confusion avec une alerte de modération)
// 3.0.2 (02/02/2021) :
// - ajout du support pour GM.registerMenuCommand() (pour gm4)
// 3.0.1 (09/06/2020) :
// - correction de la gestion du blocage du menu contextuel
// 3.0.0 (25/05/2020) :
// - refonte du code et ajout d'une fenêtre de configuration pour les images
// - simplification de l'interface : alerte 1 <-> n posts
// - nouveau nom : [HFR] alerte qualitaÿ mod_r21 -> [HFR] Alerte Qualitaÿ mod_r21
// - ajout de l'avis de licence AGPL v3+ *si toyonos est d'accord*
// - appropriation des metadata @namespace et @author (passage en roger21)
// - ajout de la metadata @authororig (toyonos)
// - réécriture des metadata @description, @modifications et @modtype
// 2.0.6 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 2.0.5 (11/02/2020) :
// - utilisation d'une url en data au lieu de l'url chez reho.st pour l'image de fond
// 2.0.4 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// 2.0.3 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.0.2 (13/05/2018) :
// - check du code dans tm
// - ajout de la metadata @connect pour tm
// - suppression des @grant inutiles
// - maj de la metadata @homepageURL
// 2.0.1 (28/11/2017) :
// - passage au https
// 2.0.0 (19/04/2016) :
// - nouveau numéro de version : 0.1.3.8 -> 2.0.0
// - nouveau nom : [HFR] Alerte Qualitaÿ -> [HFR] alerte qualitaÿ mod_r21
// - suppression de la toyoAjaxLib qui n'a jamais été utilisée
// - genocide de commentaires et de lignes vides
// - remplacement des ' par des " (pasque !)
// - compactage du css
// - decoupage des lignes de code trop longue
// - recoddage de petits bouts (ajout d'accollades, séparation de déclarations multiples)
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 0.1.3.8 (22/11/2015) :
// - correction d'un bug sur la fonction de changement de l'icone
// 0.1.3.7 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.1.3.6 (08/09/2014) :
// - repassage à reho.st (au lieu de free.fr) pour l'hebergement des images et icones utilisés par le script
// - reencodage en base64 des images codées en dur
// - suppression du module d'auto-update (code mort)
// - limitation de la taille du bouton à 16px de haut
// 0.1.3.5 (14/05/2014) :
// - repassage à free.fr (au lieu de reho.st) pour l'hebergement des images et icones utilisés par le script
// 0.1.3.4 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.1.3.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.1.3.2 (14/09/2012) :
// - ajout des metadata @grant
// 0.1.3.1 (28/11/2011) :
// - changement de l'image de fond (moins génante)
// - correction de l'alignement du bouton
// - désactivation du message d'erreur XML dans la toyolib
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

/* ------------- */
/* option en dur */
/* ------------- */

// activer les box-shadow (true) ou pas (false) sur la popup
const box_shadow = true;

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
var gmMenu = GM.registerMenuCommand || GM_registerMenuCommand;
// info du navigateur pour les différences d'affichage ff / ch
var ff = navigator.userAgent && navigator.userAgent.indexOf("Firefox") !== -1;

/* ---------- */
/* les images */
/* ---------- */

var img_black = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAABwCAYAAABW%2BhjoAAAKtElEQVR42u2d2bLcKgxFGfP%2Fn3xfcm46qW4b0IBwr1XFS1LtYwZthIQhJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBXCk0AAOBLpQkAAHz5RRMAAPgLb6YZAAB8hZc4LwCAs%2FAS5wUAcKL8Ft5OU4D17P6uaC61%2BsXfsfAu8s3f0yySeo%2BU%2Fru0332SJwVkR8kG7TBSysQ4by%2F%2F1wbqsbM9oxTCL8qz%2B6%2BbgWkl7lYd6mUkXVhvSbmbrOpGA%2FVsh5FJMN%2BM7zpoA98uvOAkiF7ep3YG2Ut0agCv%2B9Ok1TYZZ9%2Foec9MxH3wHfF6EV53cfLyPrWJsLT1NNKysQ3uvMSy6e%2FejfVR4a1BJrTdhZi3Ywy0OAi8RYfuimXuXOrvaoO7MeMlVFerj3bTZnmyn79ReNnloUBzbOw7z6ttmlROSKytCl4OJLwRE2vvBDWiF09i7Qu9XS1vlMTadd3flfrb2Pvi%2B5T0ZzfEVVnZXXFXIq4%2BRsZem3x%2BQ3jBMv5pLfLaHVoHjVRavOpdjPuqGY6BkXaoxv2RBz3ZkuYnWhJrYOYNFuO%2F5x1GaUHa2aLforVXCWDQZeLvz9pCQXjBwtuVxnnrhg6NsGSyqLeVcVi2147E6uw7zIQbvlV82dGwIfYp8Xh2eJ8RhNei3lbGYdlePe1ffXyyhf7GsRi1kfxl4tuQTztBsvBKvbeoRFjaWohZNmpL6%2FaKnrBZCTd8muSeLL4k1gwEqQwMmnyI4T1VeKtRW1q2Vz7AoPub9yiIL8JrLQR9UCysjFr7U%2BGW4idzZuv95MRaFOH9tdjmfXHCOa1wKPwCNckTC83I8CwN6c5gWvqzV%2Faq1E2CU9L4XtFVAdudWJ3ZH%2FxTipFtlDcC2gffPwvqz46GB5InxLQqN35L%2FpnSCImFJhAc74yzpUdq9YGBpvCWAc9OMvnltO%2FMDHY0bKQlvczs7HLjKWfwVuV6R1kGWoeCTvG%2BRiZZ6Sf25WABZkeDobdrEed9yqfCJYjgnPZxyyneVx1s05mVTL6wydNCECTWFD2vvGAsVUn0TzuDtyjXW0uApO1nGQqymgQtvK88MTa74rvm9Pe5HE0h7ITwbqYsGlRTMsQnncGbAwiOhSFYhoLKYSLQJsb6SqgqB2tHdjRs8HaLwGvU8j5POoM3gtddDUTnWxJrI7%2B5uxpIY1XTFt4%2FgvCCUmcVgcEUBeHfdQbvz8CfLdped%2Ftnablj8FuHgvqgiFr2xeuYXrWbajTB9pfJ9N0FplFiwexoCOD5zSw%2F%2BWJtvP168l%2FufdOnwjN7f2echNO3ibGjQRHrWXJkBox6Bm8E4S2LIlid20vi6exIrN55vE347v2DV%2Fp08SWxFsDbHRUwzuCdr7d3uMEyFBRl9fHvJJMV3v%2FTxNkRXrzd3VnOiGfw1iDtvzpxaNfh6WfwvsZNy8JkUm4mpXzxu9drm17j%2BZzR8EA8D%2Ba4M0rO4J2vt%2BVBON7tFeEM3voSHigDHutKn1ic4cEZDYfhOaM2oeHtOIPXY%2BaWeqxeS79vSKyNfipfbsZzHrCt0a1%2Bp3m97GgQGtLsNippqOAXwrskONXJGHafwesR9ukDfdEm6jq6vaulv7eJlXRumIEdDYJBtmqobVHIZs4xXS2rnkRXKMVQ%2FEfDRVKPcfcZvFp90oSrh9UJOb8I6pN3NZBYEwz04vxc6zhWX%2FBuPAajlhc5%2BgGGpTfocQavpUc2k%2B%2FwXHUhvA9il%2BdSN8WxqsC7sczyah04U5J9tvnET4WtJv%2FuZIvsaPgibzcbDqQu8Ng0jc37mhUPL9Iy%2FpY3i7qH8Na0x7t7mvCCs7c7KiY7Bt%2FOa7UlJ1bNGHZLdh7JiWfwWuyJnt2f%2B23Cy46GxVldY5kwe2BO3mBsnjHF6uRFFuH7SMZNxDN4Lb4CvGuDkuIdB8qOhs1kp0abjfPuSKydElO08p4iJdZKEGGQ9O%2B7kh8ivLsuFH2U8GofnXc1oEYH5N17SUteaAvNstof2aCPV%2Fva4l1fn%2B3VH3lxzJaX93wtAAAAAAAAAAAAAAAAAAAAn%2Fn3AOnXg1Ck2fZPf0%2Ba0dfeFeD9%2FE9%2Fw5IsqJPljomobZkNxkHZ0O%2FHipL1vr2rE6A%2BFY16zezDbYrCY7XXNisKlMfBJd6fijZBnaz2ymp8pVWN2rIk3b36LfHBhMg4Tv6WW3pJYDESNe9n7DaQvEF4JZOV1ccyzagdtSbirvTsiujKG%2BvUb7m1vBaJ%2BBaFwVcMB3BOPt%2FQlw1GKBH6qMcftmR7%2BI6G11sSZzKoGOCJ33KPiG5P4wdMrw7qd5NZ3fCMWQ%2FHw6u2jPUVoeFHFN6SfD7fl3i9xdgjfxyRrwwpigO0petzELqyCHWF%2BvTk691YiGN3Ft6q4LVdlZ4%2B34dmlVi7myS1PMpP4%2BJuss%2BI7p4leQThLQrPaYoiFDmxZnUqmVU7RPKwvcXF%2B2bovvB8bpcwMMATTqfXnHE1lnKRE2ufPEKL5etpibWIE8knD9dK5MqkiHZEV26Ap%2B5oaIoGp7FlJ2pi7UoIvbYpRU6srdSnO9toufh3a4fMcoX4FUROqM0OaO29qBpeWtTE2tUy3EKwTkus7eiTlXFoPaGNeL2r8eCv5oTropvAuKXGJvWeIybW7kTJQiRPS6xFmkiu2s4jhHPlDGl%2FcPEVnHJ9SBEMkGIw6LLw97tjlXfPs%2FDmSKzZee7WbXvl9bJX94EhhhmDKUYDUPLMiIm1kaWp9vKVxJptPTxWE1xaaegRnJxYs1haSsU8WmItDxryDrH3ECxPL9QzXNIc4qujq2P26j4gxDBjMBazvtTAoiXWZgxU06hIrNlNkp4TG6Ir5ISE2qzBWAwEqScRKbE2671rTmQk1mzHnlWYbcZhY9vYwqB8wo4Gr%2FhuEf5%2BV6xSY7Ktiu3oHUY7KbGmtSK18EARXcXly%2BmJNYvkjdSLiJRY0zLkrjjmLDk9sdaT726gyH35CBrC%2B%2FH3I20lPRavKwhmUxIKrzORSaztmSS9EmzsYnDs0IifCktFuw%2B0VXYWHI3YqHZoadZz%2FIbEmuZEEu2mi7u683WaY4eeIryzR9j1C%2B%2B5ORtoVhC%2BfNEuI%2FeCaSxfSazJ3r0P9lXbFAIhvuvo9US8dWJ24M2uALKSEUkGuYbH3IS%2Fn%2FVwSKz5TLQ57Ylts4VsskNOKDNGPvv54ozwam7fGhmoVeE9NMIl0smDxJrvRGuZYCOxptChT0qsjYRT%2BodnjYjvagxrds%2Fjz7XaXSlep1EXiy%2F3RpfOq1eLn5hY05gktVYo3nV%2FJOVg0dW%2B7ufdFfTWeyF3JbW0rv6WLl%2Bbc91PTaxpearNsP4k1jYZ%2FinXuZcAE4D2u2gk1MoGUejO4%2BDExFpVHPuazxrpSxJrht7GacIbTXwlic2edLZvSbwe7a8JvROskRNr2pNkSXYxbhJrgx3aDy8aV9vMTD4t3d9M7DUR9KSb0JOIz6qQayV1ayBx0PYmtSfJnGwSbCTWYGnQ%2FOxzbP8I%2B89%2B1nwzyLSWqz93ZLU3k8y7d1mtq%2BZ14qvP%2FPQ7y8Sadt2tny%2Btr9czPdoW4P8VA1eYAAA4w6wOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCK%2FwD%2Ba9aP166N7wAAAABJRU5ErkJggg%3D%3D";
var img_white = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAABwCAYAAABW%2BhjoAAAK%2BUlEQVR42u2d2W7EKBBFhy3%2F%2F8eZGakTtaK2zVIb9jkST1HcBsOtoorln38AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfvn%2B%2Fs60AgCArfAWWgEAwFZ4v2gFAABj4f2vJFoCAMBWeInzAgAYCy9xXgAAI9HNL%2BFttAZoW%2FdPJQv%2BRjv5HXHv4v%2F43MXviZXFeveU9ir1JQppUEA8SlJoh56SB%2Fp5fftbvaqHc3tGKYRfhK3711nHVBR3lQ9qOEjaYr1XSrn47eI1QI3b4dIIHhji2tFW1aMeUQuKaSSIht5nEq6XleiUAF53Pvj96jRAm5fnPWiIW%2Bc74vUivLbiZOV9KtQtwtQ2e04BDdvgykvMHr%2Fb0dd7hbcEMWjehZi3YQw0Gwh8U6ifSyzTc6rv2AanfcZQqM5mH%2FWszTrGQyLkwCoPCWGqVo3d4XlVJ6OyQ2JtSvAs26BDeCMm1j6FESJ68STWHujtinijJNbO635Qyss4tpn3eT2jdZSZ1RWnJejso8dY1UGvtyK8oBb%2FNBB5aeHtmeKn1WJV7xFDojX7Uf7%2BRfN7XLxDHWhnT6NCYu3Gy8fEhdEpsVYtQxsW9e79btHay%2BP7j77DyuzsSSEH1NM%2B218Wfq84CK%2F7lEmj3orCq2l4zROrE%2B8wEm54qviyosEh9rni8Zh7n0GEV7zeWoNDWXib9%2BzjZCy0v47FwBhJDxPfioLqCZJGjM90iUqEqa2GmPXGSqO1V%2FSEzWS44Sjem0mswUinyB2dJu0w8G4svEWjLTXbyyOxuuCR5wkBfZL4IrzCQtA6xUJlUCtsFa7Rkzmj9b5zYi2Q8H5NCmibNDi7FQ6FF04u9CYWqsbA0xxIHWtS69ta2bNSPATn9Zyq6ZF4J1ZH1ge%2Flaw0NvIHAW2d758W6s%2BKhhuKbuoV06uOouBN7bJVuArX%2B0xwTDPOyom1Gn3a%2B8FIpoV65IPx11jR8DzhrYKZ2TT423c5g7cI1zvENFA7FLSL99VjZFe32P9ZRcGKBrzdocGShQfeLluFcwTB2W1zyy7e14eZ3uoxm%2B3IYL3GZCGxdm%2FhbaOejJTnd7MzeLNwvUUEaLX9NENBikZQY913GhgfTepdX7%2F7fi5HFQg7IbzOoptnBtTFYGySA88xsaY2lTdaTpSN2qsEFN6sNF7qwBgZDlUph4NY0bCJt5tnvUZB73ObM3iDeN1FITTziMRa5wqSNBCOm53V1ImwVWZFwz283SvhrRIdP%2BgZvPXkGMbDouB11z9TS4%2BEUlJOrPXUS%2FVbvPfphXFTlAxs%2BzGmny4wDRQLZkVDkOROEXqHp%2B5YK5MilXZqr0hxw5G1v4OJ6N2XibGiYYMEU7cFjHoGbxDhzZPTyWLcXiuJtRQpbvgzu1h893bgld5dfEmsBfB2uwSMM3inbsE1DTdohoKizD4%2BGJkk8P5HhrMhvHi7rlnOoGfwlgjtv5iMKobttfsZvL9x0zchrULGo54sN%2Ft7bdN7PJ8zGm4ouimKFeQM3qnrx7Ol13v3M3hf4tfe1sqeeqyT30TjDA%2FOaNhMeGuUgLvDVuEcwXKveqxWU78nJNZ6t8r%2FHER04dBcja2upX4ber2saFgcSKPLqJZCBREPPw8ivFczhWIxGAKcwWsR9rky%2Fr8nvw3Uq%2Bf71D%2FLxPLGYQZWNCx0stnrYOqMkI2cYzpbFjyJJlCylvgPhIvyYn%2FxPoNX6pvUxdnDlEF%2BC1%2FUm69qILG20NGz5XMN4lhtwrtR74xSXmTvBgxlb9DiDF41j2wk32E860J4byS8Xp5LcYpjlQXvRi3LK3XgzOxli4ESa3UHI6gRx%2BTWCbxdkYab6bAG3mee9W40s7ySXqRm%2FM1gq%2FBXAOEtHt7d3YQXhTX2dnvFxKnzeV6rvXJi1cjRklUxPrnjGbwaa6KH1uc%2BUHhZ0TBp1ZPAb9Ro3qdzTLFYeJEDxqQo9JuIZ%2FCK7wLsSPjlgMeBsqLBWXSTRaONxnmdEmv1Lom1GfEIlljLEYRh5fselHQT4XW5UPRuwit6dN5Fh%2BrqkFfvJVDSaFtIltnvsbhkSfSYRI13%2FfNsq%2B%2BRJvtsfnvP34KqAAAAAAAAAAAAAAAAAADAMR8OkG5vB0nnb507x5Yy%2BtKrAqyff%2FQbyt85zdZJc8VE1LY8qXMS7lcsHztoKO11e4cnQB0VoXpVq51Ff35ba61tEhQoi7vqTLeKHnzvrDwOLI7aLBpteVLnKtj%2BbJgYGODb7uUWuCQwa4ia9TO8B4h2HaSNleJmmarRjoI7SJvEs092LSK6A4215V5uQa9l5QStvNr5JJ4xOZAlT9PK1oNwReijHn94YRA0bwyRuEOOMxkGB%2BB2e7k7RbcNHDCdBY1ZsX7GhIdj4VVnxf6cVwZ%2BROHtuf1FuU%2Bsbmdm157h1Mq8s3bc2np2DkKTFKGD52XrZywYp6w4mDWFtwh4bWelHd2HppVY63AQmqLR6rnHLyG6PlNyd%2BG9qEteNEIz5xWETaxpnUqm1Q6RPGxrcXG4GboJ3n%2FIKgbjaZXp6fSSFldiKhc5sXbkESqdtbxVYi2oITkKlWnNUPLgqXkN0V0fgFuuaDjxVJNUuwh0XvfE2pkQGi5TCptY044fC%2FXFoxu6tb36L80Z4lNEN23g7bbFumRpcVocMO6JtbNpuJLwbpVY8%2Fgmk0YyKy8BvPR6Z%2BPBTxfeHa6LrguDuy22z%2BrtDuESa1eipCGSuyXWIhmSs7azCOGcOUPSGy6eIrq7XB%2BSFzpIdhbecIm1q%2Bcpedgk1pQ8dwPhzSc3aLBW94Yhhu4Bc9QJPOOEERNrPVNT6ekriTXdeljMJri0Utcj2DaxpjG1XBXzaIm1E2ObvMXeQrB2iR%2BP9umDsVyE3yVLrj4ixHAf4W0KYYbVnU%2BhEmsjA1RyUJFY0zOSloYN0dUJ1u%2B%2BokG8I6x6EpESa6Peu6QhI7GmbiSzRehDYmPSk0W37OTtDqxoMInvDu6gC5NYEzK2RaodHcJo2yTWBGekGsk%2BRFdw%2BrJ7Yk08eSMQ3w2TWBMcyE2qz1nHd3dKrAnOSLOFfqCsc57A44X3IG62tHVWIs4oFbvzPBOZxJpr%2FsUiwcYqBsMPGnGr8Kpot462SpaCIxQjlg4tjZ538YTEWtU0Gp43XXTUnd1phh90F%2BEdPcKunYRjquUAHclqTzzj8ujC0QNSNI1HMGFUMyQH7946v1V1CoEQ3zX0esLdOjHa8SZmABLXnrTFTi7hMdfF%2Fx9dDkdizcDQShhq79j53UQ37ertDi7dGtq%2BOCi8Ysu3Ok%2FwL4pnEidD40FizdbQah5iT2JN4IPeJrHWGU5pn57VKb6zS6iG1jy%2BXavdJOJ1EnVR2rnXO3Weulp8x8SahJGUmqF4xc7vJrp5Y9GVvu7n0xX0qmshvZJaUld%2FC0x%2Fq2Xdd02sCc6yqlb9Saw9IKG2eL9Z9jYACu8ikVDL1qIgNdu6c2JNykhKP4vEmmwnub3wBhTflcRmE1q%2B1YSNdzU0%2FM1TGDXjxwpGMism%2F0isdX7QtnmRuNpmxPjUq5uJDQ1BE07oZWED3hZERTPBulViTcFIJo0EG4k1mO00P%2Bsc67uwv61nTRedrAq9y88dWfWvkfn0Lgt1lbxOfOqZR%2F%2BnnFgTrbv281fra%2FVMi7YFeJ8xcIUJAICxAGPVAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABC8S%2FyZa4ySaprLAAAAABJRU5ErkJggg%3D%3D";
var img_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAQCAIAAADS0huhAAAE%2F0lEQVR42tVWTWgTTxQf6MWD14onQaF%2BgFgEL3opvfQgHlooePADLKU1pSZQSolpaAyhCtYQYtAgsYVopNiSutAgqT2sBlNDG0NkQ5aGNKVrQw0Ss6WrS13L%2BuZNEre13v%2F%2F4RHeZN%2FM%2FOZ9%2FN4Q8r8Y91DGUNyEeAnxERIgZJyQICGThEwRMkNIhJAoIfOE8ITECIkTkiAkSUgaRUBhehIlgTYxXBLF5RzuFsJtoz09fjxrDE93EGInZAhlkJABFEsd4mgN5WgNKKxMz8wo%2BTwDmvR4dE3jaij1XE7%2F%2BVPf3gZROK704AHTdUVRI5HiyEh1qmlgpqZSmihSHeTXL%2Bn1a%2BH58%2BL797qu5969o%2Fug2S5hlsvL%2FXWILgTHfhlcX2OjjsOP7pSXl0Gv%2B5J90rJZPZOR7HY9n6fTt2%2F1799BUcJhbWmJ2ahLSzm4Hg45k1Gy2ZjdrhQK6pcv8I8Yj%2Bv%2FHsX1dZMRYl0ciFLKZJgdNzAAKPWdHbhcCCPOt7TQD58%2FF6en052dEE16adjx7l19YwMUobExgdfQcjlweez8eWq%2FsSFOT893dUFMYMPCwkIRj0i%2FefMviPzcXLcRosMg3tZWsJj3%2B%2Bl5c3NePK%2F06VMIM0nw%2Beq7FNzuRM2pbEDQWSJSneMgC8WaF2EkHj2CmAQPH%2BYsltLaWiGVondbXRU%2BfiwUCnsgjns8fyCyVGUCehmdUY1UpRI6dYpeNxgMYqYXFxdhyuoGSiHd1ATT8tOnLMqsYiRIR9D7%2BsBMRvspLBFw4WRzc3ltLXTpEkRZkeViPq9sbe3rxcGmpn0g2iDzenrgc%2BDyZXCtEItRNPfv%2F1kH221uGjeSHj%2Bm7mxvVyYmaMI9eQIQFZ4HndWyXqkY7eNoT4%2B4cMF94IDRHXsG4NsF0VYTb1vbeH%2B%2FA6MPIeZstuCZM9Hh4Xm7PTYyEr14Md7bm3Y4BIdDvHNHuHZNaG6WnE6RkBy43%2BkqdHYCRLGjozA8zCPEhNmcdLkSTmfc6YzcuDF59mwUFJvNf%2FQoJL2vrS04OBgwm30mk9dkcptMY93dYzdvjl6%2Fvj%2FEEAaIFYeuqvqPH0q5DEwZOnZMwRqUeH4G6U1dXWXsCHWQREYsXr2qy3KVGg8d0vL5WI0Ocy9fJjyeSUPW5hYWGB1KKytBq5VxYVmWgQsHDx4sff1qaWjoJaR3D0T77sSvDx%2F%2BP282h5jS0sKhAhBFkwniyNibEiHmIkyle%2Feg5JkXKUkpCt%2FVFcJUBpvgkSM%2BZN%2Fow4c0yxMJGzK2KAhxntd2dvyjowDOhLILYno%2FlpLX17m%2BPrVcZp2GQmxtjV%2B5AqfC8cVwWP3wATCVAgFaLqpaxIpWFxdLr17Vmwqsmqn1Fca1rIHR1Jyd1ba3WV9xHT9OLV%2B8YOD6jRDBwtvevq8LgXQiQ0Nw%2FFRDgypJlCkhcBMT2soKLQVVzVmtjGJ0QYD00OJxSkObm1DODCJ%2F8mQdIm%2B1apVKAKkRYq1ubhZgla6zSh3CfVjfsyDEfqMXk9EoOAYKVpPlatnC79YWd%2BsWbMfAUTaWJIAYO3euOk2loAuXQiFldpbG9%2FZtPZulEJGAaFGfOJEeGJBTKQ47k%2FjsmRgOVwOiKKxBa9%2B%2BuU%2BfBgzujg5IzXp3thh7dJ26XbU2yF4VPryu8TER%2Besxkag9GoxSf0DwKH%2B%2FIViP8RmeEa5avrGXxN5nxH98%2FAYDFsrQFD2vjwAAAABJRU5ErkJggg%3D%3D";
var img_reset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";
var img_select = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAIAQMAAAAY6OeMAAAABlBMVEV1bGWIiIhRreupAAAAAXRSTlMAQObYZgAAAB9JREFUeNpjYGBgqP%2FAYP%2BAQf4AA38DAzsDAxNQiAEAP1wEBmEVxtQAAAAASUVORK5CYII%3D";
var img_info = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";
var img_help = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";
var img_save = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var img_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var img_throbber = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACGFjVEwAAAAYAAAAANndHFMAAAAaZmNUTAAAAAAAAAAQAAAAEAAAAAAAAAAAAB8D6AEAHV58pwAAAWlJREFUeNpjYMABREVFeYBgJQiD2AykAmZm5hYg9R%2BEoWz8QENDw1JRUXGPkpLSHCsrK16gpqlIBkz9%2F%2F8%2F1%2BbNmxu3bNkye9u2bXoomoGSjCDNQPwfhFVVVdO5uLgkgRqXgjBQidS%2BffuCgZpvAw25CcSzMVwAshmkWUFB4Z%2BysnIAujxQsyMQX4Ya0ojNFxxAQzKgmpnQJUGuhBoSeubMGVa4hIeHB7uLi0u5q6tre1RUlCChsAL6nw9oSAkQp69atYqNwc3NbbqTk9M3Z2fn30A8g5ABQOe3gLwBxNeBuJ5yA2BeAOJ2CwsLIZK9AAMgTlZWVmx2drY7KMCIDkQYAGruBeJ3QPwMiD1IjkagplWZmZmvgfh9RkZG7MyZM0WmTJnSCcI9PT0iQKeH4E1IeXl5xiBDoC7hmTZtWgVQ82MQnjx5ciXQ2biTMjYA1JQ9derUeyAMYpOcG3t7ezmBmltBGMTGpQ4AtqrwBlDMdgwAAAAaZmNUTAAAAAEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8Sqm5QAAAXpmZEFUAAAAAnjaY2DAAURFRXmEhYWXgTCIzUAq4OXlbeLi4voPwkB2I0ENRkZGFrq6ujv19PRmWVlZAfXwToIZwMPDM%2Fn%2F%2F%2F9cmzdvbtyyZcvsbdu26WEYANKsra39T0dH57%2B%2Bvn4qUKMkUOMSEAZKS%2B3evTsYqPk20JCbQDwbwwCQzSDNQPwTaJg%2FujxQsyMQX4YagukleXl5DqDGNENDQ7%2F6%2BnomdHmgFxihhoSeOXOGFS7h4eHBHhAQUBoYGNiSn58vQCisgP7nAxpSAsTpq1atYmMICgqa4u%2Fv%2F9HPz%2B8b0KCphAwAOr8F5A0gvg7E9ZQbAPMCELfa2NgIkuwFGABxKioqooHYDRRgRAciDJSXl3cD8SsgflRWVuZOcjQCNS4H4udAza9KS0uj161bJ7x48eI2EF64cKEw0OkheBNSVVWVEcgQoBe6srKyeJYsWVIG1HwfhEFsoLPxJ2V0ANSUAdR8C4RBbJJzIzBQOYEam0AYxMalDgDCHPiOgVAEawAAABpmY1RMAAAAAwAAABAAAAAQAAAAAAAAAAAAHwPoAQEcvHUMAAABbmZkQVQAAAAEeNpjYMABtLS0eGRlZReDMIjNQCqQkJCoFxUV%2FQ%2FCIDZBDTY2NuYWFhbbLC0tp%2Fv5%2BfGKi4tPEBMT%2Bw%2FCQEMm%2FP%2F%2Fn2vz5s2NW7Zsmb1t2zY9DANAms3NzX8B8V9ra%2BtkoCYJoCGLQJiLi0ty9%2B7dwUDNt4GG3ATi2RgGgGwGaQbir0DDfNHlgZodgfgy1JBGDAPk5eU5gBpTgLaDNDOhywO9wAg1JPTMmTOscInc3Fz22NjY4ri4uKb8%2FHwBQmEF9D8f0JASIE5ftWoVGwNQ48SYmJi3QPwJaNBkQgYAnd8C8gYQXwfiesoNQPaCt7e3IMlegAEQp7W1NQqIXUEBRnQgwgBQY0dLS8tzIL7f3NzsRnI0Ag1YAsRPQIY0NTVFAROOMMi%2FILxu3TphoNND8Cak9vZ2Q6ghHfX19TwgfwIV3gFhEHvTpk34kzI6AGpIh4b0dRCb5NwIDFROoI0NIAxi41IHAFxMAhn8b9WWAAAAGmZjVEwAAAAFAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfF2B3YAAAGfZmRBVAAAAAZ42mNgwAG0tLR41NXVF4AwiM1AKlBSUqpVUFD4D8IgNkz8%2F%2F%2F%2FjFg1uLm5mbm4uGwG4qmhoaE8QE19ioqK%2F0FYRUWlF6iEj5mZeTEQH%2BDg4LDBMACk2cnJ6buzs%2FMvoGFJ8vLyEkDNC0AY6AUJFhaWHJADQJiJiekohktANoM0A%2FEnoAE%2B6BawsbGFMjIygg0AumIJhguAzmQHuiAZpLm%2Bvp4Jiy%2BZgIaEAGmQS7jgorm5uexZWVmF2dnZDR0dHfyEAhfodIEdO3aUbNmyJX3VqlVsDECNfZmZma%2BA%2BD3QoAmEDNi8eXMLUPNtIL4OxPWUGwDzAtCABn9%2FfwFCBmzbto0PqBHhBSS%2FsU6bNi1iypQpztgSC0gMqMkRiEPPnDnDimEyUGMbED%2BePHnybaBBLujyUM2XQc4HeqMRmwELp06d%2BgBqSMTu3buFQf4F4XXr1gkDnR4C1XwTiGdjM8AAakhrd3c3N8ifQIV3QBjE3rRpExfIZiB7NtAwPYKZCaghHRrS10FsknMjMIQ5gTY2gDCIjUsdAEaa8bn5NffYAAAAGmZjVEwAAAAHAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARzg1J8AAAGgZmRBVAAAAAh42p2Tv0sCYRjHr8Dk7tLzx1B%2FgJN3XiCEQ1OOBf6qXK1JuJCW8AcRFbYJDm0iBqk4OEjo4eIQNLsFSSSNLUFL0BbX96mjzFMOe%2BHLfXnv%2FX6e53nhZZgpS5Zl3u%2F3V0jkmVmXz%2Bc7EkXxg0TeNBCNRlfD4fB1JBK5UBRlEaGCJEkaibzL5bJjXdlsthun07lmAFA4FAq9Qe%2BxWGzX6%2FUuI1ghBQKBJYT3eZ7XOI7TALnVNG3uD4AqUxigV3SzOV5AEIQtApCoE0MHHo%2FHCsAeqm8Y6N9rniAsyyrw3M9uKpWyZjKZg2w2e1wqlQSzuwLc0e12D1VVTTabzQUml8sVAHiGXtLpdNEM0Ol0zhF%2BhAbQyRcAwf8DRkdIJBIOMwDatyP4O8LIbJZGoxGvVqvBSZdIewitQzv9ft9iINdqtXy9Xn%2BC7gEKjv%2FXw3fUPsY4mwS4hIYEwTfe6%2FXcNC%2Bp1Wq50fq2Hn6AygYAWl%2FRIXl4nubEwSGJfLvd5qgyfBkw2fRtIJDUb3pAfubXiBtmUfGURH7auU%2FutPojzjsHHQAAABpmY1RMAAAACQAAABAAAAAQAAAAAAAAAAAAHwPoAQHxk%2BXDAAABg2ZkQVQAAAAKeNqlU79LAmEYvgINKzQM9bzZuSlQDhwSHBqL2rxrFIVwaYmCS7xTo6FZHdoFHfS4sf6B2xpEbGsIGhraWrqeh65fenJIHzx8D%2B%2F3Ps%2F7Az5BmHPy%2BfxaNpttE%2BTCoieTyZym0%2Bk3gtxXoCjKtqqqPeC6XC6vQ3gJvBOyLDej0WhYFMWbeDx%2BK0mSPGNQKBR6MHnB%2FQoTFcIEKreJXC6XgLgEsROLxRzcd47jLP0xYGWKgWfw3ekCMNinmGAnMx2kUqkVdHBE8Yz751lOJpN7MCiBh76jmqYFDcM4rtfrZ61WK%2BK3K5hHLMs6MU2z2O12g0Kj0Wjquv4IPMHoys9gOBzqEE%2BAEaD93%2BBrhFqtdl6pVDb8DNB%2BGMKfEX7NFkDwENjxWiJjfGOObdsBr9aqbmv3TJx%2Bd8V8mzDXy6ADjJmANg%2F6%2Ff4m5yXIGXPFY%2BZ6zbaFBJpUB4PBKucEfyDIGXO77DDX929AUHQ3PSJf%2BDdiwyFUvCDI5%2BV9ABJsBKxZnW%2FPAAAAGmZjVEwAAAALAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARwFNioAAAGKZmRBVAAAAAx42qWTu0%2FCUBjFW4mi2ODga%2BSdMLk4OcrLjpLgZlwJz8nEMCHx1YXFAprgbuzAAISp%2F4WDIZg4mLiY6OZiYj0nFgYKAeJNfunX755z7qOpIIwZ0Wh0ORaL3RDWwqwjEomchEKhL8J6oiGfz2%2Bn02kNlIvFogTTVTgc%2FiaoL%2F1%2Bv9Pr9d55PB49GAzuWAJoTqVS7%2BAzm80eYuVNGG9JPB7fgDkJs2GiG4YhDgeUwQd4A%2FLwAj6fb9%2Ftdv8wgDux7ECWZTtWP8pkMnuW9L8xx5BAIJDM5XL2QVfTtAVVVTPVarXQ6XScU9zvms1muwZnLpdrUYDxolKpvIDXWq2mTHLDeI%2BHQSRJevh%2FQP8IoKAoysoUR1gXRVEdHKE%2FcHHz7Xb7AOyOukT2OKfregK1wxLbarVKEPTAI4XD8%2ByZcz1qRwXUQZcCfI1Eo9FYxfs5Yc2eae5SawmAYAsChpSazaYD9THqZ8KaPXOXdWon3hQMSYifCOuZ%2F0Z8nSWseEpYj9P9AmHJ8O96azpYAAAAGmZjVEwAAAANAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfHPRFAAAAGYZmRBVAAAAA542pWTv0sCYRzGLeiHp95y5OrooJ56U2uD5ZQ%2FsKlb%2B7G41Z24mCENORW15KZW4OCgIgT%2BAQ5uDWEGQUvg1hQtXc8DKuQp6gsf%2BN73%2BzzPe%2B97nMUyZamqaovH4zeEtWXRFY1GTyORyBdhPdOQTqcVXdcfU6nUZT6ft8GYA98kFovl3G63Q5blO5%2FP96QoyqYpgGbwqWlaHyH7oVDIiZ1vCY7ghPHA6%2FUaHo%2FnlyGmAO6MgD74QMjO%2BDwQCEQQ8MMQvokpIBwOr8GsImjbMIyl8Xkmk1kOBoO7fr%2F%2FMJlMro0GlUpltVwuHwOt3W6Lc9yvJIrilcPhyLpcrnULjOelUukVvIOLWW4Y7wVBMIgkSQ8LB9jt9v8BwyMUi0UdAfMcYQMh16MjDFen01lpNBp7YGvSJbLHWavVSqC2mmLr9XoWgh54pnB8zt5g1qN2UkABdCloNpuJarUq4TlHWLM3MHepNQVAIEPAkGytVhNQn6B%2BI6zZG7xlgdqZNwXDEcQvhPXCfyO%2BjhU7nhHW03R%2FhFP4ipu3x5gAAAAaZmNUTAAAAA8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHFmXuQAAAYZmZEFUAAAAEHjapZOxSwJxFMevIEvjXOzyFvE%2FCJpOT5eG2hoEbyjUSXRyyt0uz1NwKRoa3KrJwUHlwP%2FAwa1BpKAlaGoJWoK4vl84g7yTS%2FrBBx7v977fe%2B%2FdnSAsOaVSKVQoFK4IY2HVk8%2Fnz3K53Bth7CtoNpv7jUbjHrTa7fY2hBfgnaALXVVVMZlM3iQSCSudTisuA0f8YhjGq2maJ5lMZhdPviaVSkWCsKgoyhf4pImXQYti8Fyv148W71Op1DHEHzRhJy4DTdMCMDkFh7Ztr3lMuU4TjFJER5s%2F2W63GxgOh2XLsqrj8TjstytRFCPRaPRSluVaPB7fEiCugSl4HAwGhp8BxLeSJNkkFovd%2Fd9gPgKoYozwHz6RnV8jzM9kMtmAiQYOvJbIHO9Go1EWcdBli%2FZ1jgEeWLh4z5xzx1F1L4MOmLEAo2R7vV6EOyGMmXPEM9a6DFCwhwKa6P1%2BP8SdIH4ijJlzuuyw1ndTEJSdtzNlvPLfiLcTxBPPCeNldd%2BFTAEoC6ckLQAAABpmY1RMAAAAEQAAABAAAAAQAAAAAAAAAAAAHwPoAQHwWCCpAAABqGZkQVQAAAASeNqlkz9IAnEUx%2B9Ou06jAsXFxb%2FgFk0h0pInTo0eteqgaN4Qubh0CtVYgZ4ILWlNDg4q4tgSOLg1SNgQtrUELUHL9X2QBd7JET34cI979%2F2%2B33s%2FjmEWRDqdtudyuQuCcuavAeFhNpt9JSg3FVSr1U3QUFX1tNlsrkBYAm9EPp9XIpHIaiwWU0E3Ho9vGRmQ%2BBnPl3q9vpdMJl3ofEkUi0WXKIop8BmNRj%2FIxMjgjMSVSmVSq9Vi83V03YXBO5nQSXQGkiTxEO%2FDRNQ0jZ2vK4rCkQlIybK8%2FFNotVp8r9fL9Pv9wnA4XDPbldvtdvr9%2FvNgMHjs8XgEBmIFjMGk2%2B2emBkEAoFrn8%2Bneb1eLRQKNf5vMBsBFDCG6QjhcNgBk98RZjEajZZgIoEdoyUiOJ7nE1ar9QC5TVfF8cs0Bnggk%2Fk6iVmW1ZBqFovl1sjgCjySCUZJtNttJ%2B2EmE6nDo7jZBITyO91p4RoA2IyKXc6HTvtBPkTMRgMjvDJOjrfgDtBELZN%2Fw2YZL5vZ0z57P2C%2FegDt2ND9xJB%2BaLvvgDI3vA4tCR%2FkQAAABpmY1RMAAAAEwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdzvNAAAABkWZkQVQAAAAUeNqlk79LAnEYxq8g8U7u5Kw2%2FwO14KCpQaqtA3%2F1Y3YTCmko%2FEHIJbYZDa5hkDo5SKiIW9DsFiSRNDi0BC1BW1zPA%2BagJ4f0hQ%2F33r33PO%2F3fb93gjBjGYYhZbPZImEszLvS6fRJKpV6J4xtBZVKZb1ard6CQrPZlCDMQfhBMplMLhQKyZFIpBQOh%2B%2Bj0ejGlMFIPKjVam%2B4HiaTyVWYXBO0sAJhHCbf4IsmVgYFisEz4p3JPKrqEH7ShDuxGpqDldHKtmmaC5N5PovFYrsgXq%2FXHeMEb9rtdgKcdTodxW5WXq%2FXEwgErsB5MBh0ChAaoA9eW63WpZ0BhGW%2F32%2F6fL4fTdPK%2FzeYtwVd11WYFMct%2FK1er7cEkwOwZTVErEW3272nKMoRYudUFtvPsw3wRJPJPMUul8skMLmzMrgBLzRBK%2FuNRmOZMyHD4dAjiuIxxZIkmbIsP07tEqI1iGmS56fMmSAekG63e8pNsDLED6qqbtr%2BGzBJjE6nz3juvxGnI6L6BWE8671fIqf6HRySx%2B0AAAAaZmNUTAAAABUAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ASBOgAAAWxmZEFUAAAAFnjaY2DAAerr67na29s7QBjEZiAVtLa25ra0tDwGYRCboIZt27bpbdmyZfbmzZsbz5w5wwXUWA3U%2BByE29raqkNDQ3ni4uL6gXhtbGysCYYBQI0gzTeBhtwGGhYCdLYIUHM3CPf09IjExMTEAfEnoOZ3QHotNgMaQZqB%2BDIQO6LLA232BGp8BTIE5BIMA4DOZgVqDAVp%2Fv%2F%2FPyO6PEgMZAjQBfGrVq1ig0uAOEBN6UBcAnQ6H6Gw0tLSEjI3N%2B%2B0sLCo9PDwYGcAaqwH4usg5wO90ULIAKDGWUAD%2FgHxT1tb21mUG0CqF6KiogQtLS0RXiA2EIGASVJSMlBCQiITyOYgORqBGoNERUX%2FgzCQPZ9gQlq3bp0wKExA%2BNGjR0LCwsKZYmJiYAOA9H4MVyIn5U2bNnGBwgTIvgPCQLkSoBJ%2BkM1AzfukpKSsCOYNoCHp0Ni5DmKTnBuBscMJtL0BhEFsXOoAUt0FcAi6YW0AAAAaZmNUTAAAABcAAAAQAAAAEAAAAAAAAAAAAB8D6AEBHZJS0wAAAXNmZEFUAAAAGHjaY2DAAXp7ezmnTp3aCsIgNgOpYPLkydlAzfdAGMQmqGHbtm16W7Zsmb158%2BbGM2fOcAE1VU6ZMuUxCE%2BbNq0iKyuLB4h7gXhVXl6eMYYBQI0gzTeBhtwGGhbS09MjAtTcCcIzZ84UycjIiM3MzHwPxK9BhmAzoBGkGYgvA7EjujxQkwcQPwPidyCXYBgAdDYrUGMoSPP%2F%2F%2F8Z0eVBYtnZ2e5AzbGrVq1ig0uAOEBN6UBcAnQ6H6GwsrCwEHJxcWkH4nIPDw92BqDGeiC%2BDnI%2B0BsthAwAapzh7Oz828nJ6Zubm9t0kg0AakY1gFQvREVFCbq6uiK8QGwgAgGTsrJygJKSUgaQzUFyNII0Kygo%2FFNUVPwPNGQO3oS0b9%2B%2BYKCQFDMz81IQ5uLiklRVVU0HaYbiPRiuRE7KQEkuoMapoOgHYRDbysqKF2QzSLOGhoYlwbwB1NSCZEALyblRVFSUBwhWgjCIjUsdAJsS8AnByX%2BOAAAAGmZjVEwAAAAZAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfDhY48AAAF5ZmRBVAAAABp42mNgwAFWrVrFuWTJkiYQBrEZSAVAjRmLFy%2B%2BBcIgNkEN27Zt09uyZcvszZs3N545c4YLqKkMqPk%2BCIPYWVlZPBUVFV3l5eXLq6qqjDAMAGoEab4JNOQ20LCQhQsXCgM1t4HwunXrhEtLS6PLyspeAQ14DjIEmwGNIM1AfBmIHdHlgZrdgRofAfErkEswDAA6mxWoMRSk%2Bf%2F%2F%2F4zo8iAxoEY3II4GBiobcmizATWlA3EJ0Ol8hMLKxsZGMCAgoBWISz08PNgZgBrrgfg6yPlAb7QQMgCocaqfn983f3%2F%2Fj0FBQVMoN4BUL%2BTn5wsEBga2wL1AbCDW19czGRoa%2Bunq6qbJy8tzkByNQI3%2BOjo6P4H4v56e3iy8CWn37t3BQCEpHh6eJSDMxcUlqa%2BvnwrSrK2t%2FQ9o2E68SRnoBS6gxslAjf9BmJeXd5KVlRUvyGaQZiMjIwuCeQOoqRHJgCaSc6OoqCiPsLDwMhAGsXGpAwBEpviQbN5BdAAAABpmY1RMAAAAGwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdd7BmAAABbmZkQVQAAAAceNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWrYtm2bHlDxbKCNjUANXEB2CZB9B4RB7Pr6ep7W1tYOIF7S3t5uiGEAUCFI802g4ttAw0LWrVsnDOS3gPDu3buFm5qaolpaWp4DDXgCMgSbAY0gzUB8GYgd0eWbm5vdgAbchxrSgWHAmTNnWIEaQ0Ga%2F%2F%2F%2Fz4guDxIDanQF4ihgoLIhhzYbUBMowEqATucjFFbe3t6CcXFxTbGxscW5ubnsDECN9dDQvg3yLyEDgBonx8TEfALit0CDJlJuAKleyM%2FPF0DxArGBCARM1tbWvhYWFiny8vIcJEcjUKOvubn5VyD%2Ba2lpOR1vQgImnGAuLi5JcXHxRSAsKioqAbQ9GaQZiH8BDduGNykDvcAF1DRBTEzsPwgDDZng5%2BfHC7IZpNnGxsacYN6QkJCoBxryH4RBbJJzo5aWFo%2BsrOxiEAaxcakDADqJAhkT68NIAAAAGmZjVEwAAAAdAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfC9whwAAAGhZmRBVAAAAB542qWTPUgCcRjG7049zcQEFzc%2FEASHaGpqyTucAhcPnGsIv4bANVSoEKQI%2FFhajJocHDwRwaWlza0hwoagrSVoCVqu54EiuVNE%2BsODz93%2F%2F%2FzufV%2FvBGHB6na7a7quVyh6YdXV7%2FcPB4PBI0W%2FNDAcDjdx%2BApPrCLghi%2FBP1P09Xp9vdVqnTabzWtoywLAQYafcHgKWLrX6%2FlxfUKNx2N%2Fo9HIIPgKyAsh8wBVhqEHaNe83263VUCmhEBnFsBkMnEgqDFsGIZo3uc9BBWAMvCO2WnLCHFgJZTuXTarVCrly2azlVwud1QsFp0CguWfaU%2FZ7zIAgpcAvENv%2BXz%2B4v%2BA3xZGo1EJvfmWAWq12gaCfy3MLDdUkGU5jV%2FJHCyXy1IymdxLJBIH0WjUaSHbbLZbDlsURQMQzbzPsKIoH9CXqqoty18kSdI9LWW32wvxeDwQDoc7VDAYDACwzzAq%2BARAt1Tgcrl2UMUddINLL8o8R9igIpHIhaZpHj6ZYcC25w5o9gVC6DgUChkU%2FcpfI1rwxGKxDkW%2F6Nw37k3xuSzoMScAAAAaZmNUTAAAAB8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHSsR9QAAAZ9mZEFUAAAAIHjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlq2LZtmx5Q8WygjY1ADVxAdgmQfQeEQexFixZxL168uBmI5wHZ%2BhgGABWCNN8EKr4NNCxk3bp1wkB%2BCwjv3r1bGKgxbMmSJfeA9B2QIdgMaARpBuLLQOyILr9s2TInoAHXoIY0Yxhw5swZVqDGUJDm%2F%2F%2F%2FM6LLg8SATncCGhQGZLMihzYbUBMowEqATucjFFbx8fECFRUVteXl5fm5ubnsDECN9dDQvg3yLyEDysrK%2BoCaXwPpZ5WVld2UGwDzAtD5JUC%2FCRAyYObMmfwoXkACXJycnFn8%2FPzBQDYTtkAMCgry8vPzS1RRUWHHMJmPj28hNzf3fxCGGoICAgMDvf39%2Fd8BDfgWEBAwCcN0Xl7eQ1xcXGADgIZlm5ubi%2Bvq6s4FYS0tLQmg7QkgzUD8GWjQBgwXCAoKWgMN2Q9yiZCQEB9QY7eOjs5%2FEAaxs7KyeEA2gzQDXWNKMG8ANVVra2v%2FBWEQm%2BTcqKenx21kZDQXhEFsXOoAfEH6IOWuH2wAAAAaZmNUTAAAACEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB88%2BqfQAAAYJmZEFUAAAAInjapVOxSwJhHLVAwwoN40692bkpODlwSLihschNrzEUwsUlCi65OzUamrWhXdDhPBzrH7itIcK2hqChoa2l6z24QjzlkD543Lvf7733%2Fb4Pvkhkwer3%2B%2FHRaHRJkEeWXbZtnziO80SQhxrG4%2FEOxLfYsQnDOngD%2FIUgZ409aqgNBKBJ8zMEEwiOhsPhNv5Ngpw19qihdl4A0yfAI7A322fN7zGkGQhwXTeKZolCz%2FNWZvus%2BSEl8Oj0bcdQ5IU1MGYi7K7q9fqWYRgXlmWd6roe42i6f9sczQwLgPHaNM034LXdbnf%2BH%2FB7BIzfwNmSYQHdbjfZarXO%2F44wteKCIFSz2ewB%2BOq8S9Q0bb9SqRzncrm1QHImk7lDgEeAH872aS6Xy%2B%2FAJ%2FhNIF0UxQea8WVAtVgspvP5fI%2BQZTkNk0YzJvjAdxCYQJIkBeZ7TpJKpRKKonRg%2FPZxVavVNrkzMEDIbujbwM5nMH4R5Eu%2FRlVVNwqFQo8gX6T7AfzqBKx3VEm7AAAAGmZjVEwAAAAjAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR5ZeZQAAAGNZmRBVAAAACR42qWTvUsCYRzH75Ky7LCht1E9FZxamhp9ObsxobZoFT11CqLJpLdbWjq1oPboBgcVp%2FsvGiIMGoKWoLaWoOv7BS3qlEt64APf5%2Fn9ft%2Ff88IjCEOGaZpTrVZrj1ALo45ms5ltt9u3hNq1oNPpLCH5Ah0rKPBBb0PfE2quMcYc5joMEGTxHRK6SFhvNBqzmB8Qaq4xxhzmDjKgexfcgPjvONd6MZpUHAa2bfssy2KXOLQ4IC72TDagx78CgUBg0uPx7IuiaGA673ZXuq7PGIaxCzS8zoQgSZLJBgRGV24G9Xpdr1arj%2BChVqsd0uD6Xwb9I4BTxOf%2B8Nx%2BFH4foT%2BKxaI3Go1mw%2BHwGqZjgy5R07TVXC63paqq1%2BEsy%2FJlKBSyg8HgR8%2Fkx8jn8yp4Ai%2FgxOGOYosGBGbZTCazkEqlzkkikVgsFAqb6P4KnmFgOnYQi8VWaMKdRCIRPwqPksnkO4E%2BLpfLEjuzuFQqLbv%2BDRTtoPMboR75NyqKMp1Op88I9bC8T5%2BU8PAz88iaAAAAGmZjVEwAAAAlAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfOTC%2B4AAAGWZmRBVAAAACZ42qWTu0%2FCUBjFwcQHhXZpZGVkAMpjcmVAmSwQnezqY2FTSlgQQxxk0uiiG6AmDAxASEz4AxjYHIxiYuJiwuZkXKznJMBAIZV4k5Oce8%2F3%2FW7vba7NNmPUajVHs9k8puht845Go7HfarWeKHrLhna7raD4BjsW0CDAH8K%2FUvRcY8Ya1poACNn8jII%2BCrbq9bqMeZGi5xoz1rB2GoD0PvQIRSdzrg0zQgomgGEYjk6nw12i8PYpuX0I2e71eovjwOPxrIiiWHC5XBeYrlrdVaVSkcrlsl6tVg%2Fwd5ZssizfCYJgUIDc%2FgFwCr1BL4Cc%2FB8wOoIkSefIZStAt9uV0JgZH2E00un0cjAY3AuHw5v5fH5h2iVms9l1Xde1eDy%2BbCIrinLt9%2FsN6DsUCqmTeSaT2UDzOzQA6MwECAQCDz6f74cQ%2BF1N09yJROKKisVibjTtADIA4AO6NwEikcgaIfwSr9crJpPJoqqqX0MVS6WSkzuzOZfLRSzfBnY%2BQuMnRT%2F3a8QRnKlU6pKin1X3C2Zv%2BIepEdLNAAAAGmZjVEwAAAAnAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR4F2AcAAAGGZmRBVAAAACh42mNgwAFWrVrFuXnz5gYQBrEZSAWbNm1K37Jly3UQBrEJati2bZseUPFsoI2NQA1cQHYJkH0HhEFskBhIDqQGpBbDAKAkSPNNoILbQAUh69atEwbyW0AYxAaJgeRAakBqsRkAMv02EF8GYkd0eZAYVA5kSCOGAf%2F%2F%2F%2BfcuXMnyBZHIJsRizwj1JDQM2fOsMIl5OXlOSQkJOpFRUUnALkiRIQVHyhMgDgdGDtsDLKysouBmv%2BDsLi4%2BCJCBoDCBOpVUAzVU24AzAtAzRN4eXmFCRlw4sQJPqA3EF6AgdzcXHYrK6sUa2trXyCXCVsgtra2ugJxVGhoKBuGyZaWltPNzc3%2FAvFXqCEooLm52a2lpeU%2BED8HGtKBYYCFhcU2oOZfIEOA7BSgi0RjY2Mng3BgYKBYW1tbJFTzEyBegmGAjY2NOcgQkEuAXuGNi4trjImJ%2BQTFTd3d3dwgm0Ga29vbDQnmDaDNxUCNb0EYxCY5N6alpXEBXTERhEFsXOoALlABImtNWOoAAAAaZmNUTAAAACkAAAAQAAAAEAAAAAAAAAAAAB8D6AEB83bpWwAAAaRmZEFUAAAAKnjaY2DAAVatWsW5efPmBhAGsRmIAf%2F%2F%2F2eEsTdt2pS%2BZcuW6yAMYhPUzMHBYcPMzHwAiBcDufw7duwoBtp%2BB4SBhpQADeECshuB7Nnbtm3Tw7CZiYnpKIgJwkB27qNHj4SAGlpAeN26dcJATSFAzbeB%2FJtAPBvDBUCbl4A0MzIy%2FmdjYwtBlwdqdgTiy1BDGrH5gpOFhSUbqpkJW%2FhADQk9c%2BYMK1xCXl6eQ0VFpU5ZWbnPwsJCiFBYAb3CBwoTIE4Hxg4bg7q6%2BkIFBYX%2FioqK%2F4GGLCBkAChMQN6AxlA95QbAvKCkpNQnJSUlTMiAEydO8AG9gfACDOTm5rK7ubklAbFPfX091kCcMmWK8%2BTJkyNCQ0PZMEx2cXGZ6uzs%2FAuIP4EMQZefNm2aC1DzbaAhj4G4DZsBm52cnL5DDUmqrKwUzcrKmgDCiYmJojNmzAgHaZ46deoDIL0QwwCgrWYgQ0AusbKy4s3JyanPzMx8D8UNixYt4gZqbgVpBmIDgnkDaHMhUOMrEAaxGUgFaWlpXECN%2FSAMYuNSBwBOIvA4wVgLqgAAABpmY1RMAAAAKwAAABAAAAAQAAAAAAAAAAAAHwPoAQEe4DqyAAABkWZkQVQAAAAseNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWoQFBS05uXl3c%2FHx7cQyOXfsWNHMdD2OyAMNKQEaAgXkN0IZM%2Fetm2bHorm%2F%2F%2F%2FMwI1H%2BLi4vrPzc39n5OTM%2FvRo0dCQA0tILxu3TphoKYQoObbQP5NIJ6N4QKQzSDNIMzPzx%2BMLg%2FU7AjEl6GGNGLzBQfQkCyoZiZ0SZAroYaEnjlzhhUuYW9vz6Grq1sNxN3e3t6ChMIK6BU%2BUJgAcTowdtgYjIyM5mpra%2F%2FV0dH5DzRkLiEDQGEC8gY0huopNwDJCz0yMjJCJHsBKeWxBQUFJQCxFyjAsAXiokWLnBYvXhxWX1%2FPhmFyQEDAJD8%2Fv2%2F%2B%2Fv7vAgMDvdHlgRqdlyxZcg2I7wHZzRgGADVuABrwGWpIAtAWkbKysj4Qzs3NFQXZDNV8B4jnYRgAtNUUZAjUJbwVFRW15eXlr0EYaEgtKCmDbAZpBnpFn2DeAGrMB2p8BsIgNsm5EegFrsrKym4QBrFxqQMANXn6HYPJ7D8AAAAaZmNUTAAAAC0AAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ypIyAAAAWtmZEFUAAAALnjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlqkJKSshITE9snISExH8jl37ZtWwnQ9jsgDDSkBGgIF5DdCGTPBsrpoWj%2B%2F%2F8%2FI1DzflFR0f9A%2Br%2BwsHDmo0ePhIAaWkB43bp1wkBNIUDNt4H8m0A8G8MFIJtBBoAwkB2ELg%2FU7AjEl6GGNGLzBQdQY6akpGQgkM2ELglyJdSQ0DNnzrDCJTw8PNgtLCwqLS0tO6OiogQJhRXQK3ygMAHidGDssDHY2trOMjc3%2FwnE%2F4AGzSJkAChMQN6AxlA95QbAvAA0oFNLS0uIZC8gpTy22NjY%2BLi4OE9QgBEdiDAA1NgfExPzCYhfgQwhORqBGtcCXfAOakhcT0%2BPSGtrazcI19fXixBMSEDNJkCb14JcEhoaytPW1lYN1PwchFtaWqqBzsadlLEBoMZcoMbHIAxik5wbgc7mam9v7wBhEBuXOgDZvgVwR0IA4QAAAABJRU5ErkJggg%3D%3D";

/* ------------------------- */
/* les paramètres par défaut */
/* ------------------------- */

var hfraq_img_black_default = img_black;
var hfraq_img_white_default = img_white;
var hfraq_img_icon_default = img_icon;

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var hfraq_img_black;
var hfraq_img_white;
var hfraq_img_icon;
var topic_id = "";
var topic_title = "";
var pseudal = "";
var topic_alertes = {};
var color_1;
var color_2;
var hfraq_img_1;
var hfraq_img_2;
var alerte_default = null;

/* -------------- */
/* les constantes */
/* -------------- */

const script_name = "[HFR] Alerte Qualitaÿ";
const get_alertes_url = "http://alerte-qualitay.toyonos.info/api/getAlertesByTopic.php5";
const add_alerte_url = "http://alerte-qualitay.toyonos.info/api/addAlerte.php5";
const answer_time = 2500;

/* -------------- */
/* les styles css */
/* -------------- */

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // style pour les boutons de signalement d'une alerte qualitaÿ sur les posts
  "img.gm_hfraq_r21_aq_button{cursor:pointer;height:16px;}" +
  // styles pour la fenêtre d'aide
  "#gm_hfraq_r21_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;z-index:1003;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;text-align:justify;}" +
  "img.gm_hfraq_r21_help_button{cursor:help;vertical-align:text-bottom;}" +
  // styles pour la fenêtre de configuration
  "#gm_hfraq_r21_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_hfraq_r21_config_window{position:fixed;min-width:200px;height:auto;background-color:#ffffff;" +
  "visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;font-size:12px;padding:16px;z-index:1002;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;color:#000000;}" +
  "#gm_hfraq_r21_config_window div.gm_hfraq_r21_main_title{font-size:16px;text-align:center;" +
  "font-weight:bold;margin:0 0 10px;position:relative;cursor:default;}" +
  "#gm_hfraq_r21_config_window fieldset{margin:0 0 8px;border:1px solid #888888;padding:8px 10px 10px;}" +
  "#gm_hfraq_r21_config_window legend{font-size:14px;cursor:default;}" +
  "#gm_hfraq_r21_config_window input[type=\"text\"]{padding:0 1px;border:1px solid #c0c0c0;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;height:16px;}" +
  "#gm_hfraq_r21_config_window input[type=\"checkbox\"]{margin:0 0 1px;vertical-align:text-bottom;}" +
  "#gm_hfraq_r21_config_window div.gm_hfraq_r21_div_img{display:flex;justify-content:center;" +
  "align-items:center;}" +
  "#gm_hfraq_r21_config_window div.gm_hfraq_r21_div_img > *{display:block;}" +
  "#gm_hfraq_r21_config_window img.gm_hfraq_r21_test_img_button{margin:0 5px 0 0;height:16px;}" +
  "#gm_hfraq_r21_config_window img.gm_hfraq_r21_reset_img{cursor:pointer;margin:0 0 0 3px;}" +
  "#gm_hfraq_r21_config_window p.gm_hfraq_r21_p_img{margin:0 0 4px 4px;cursor:default;}" +
  "#gm_hfraq_r21_config_window img.gm_hfraq_r21_test_img{display:block;margin: 0 auto;}" +
  "#gm_hfraq_r21_config_window img.gm_hfraq_r21_test_img:not(:last-child){margin: 0 auto 8px;}" +
  "#gm_hfraq_r21_config_window img.gm_hfraq_r21_test_img.gm_hfraq_r21_light{background:#efefef;}" +
  "#gm_hfraq_r21_config_window img.gm_hfraq_r21_test_img.gm_hfraq_r21_dark{background:#3f3f3f;}" +
  "#gm_hfraq_r21_config_window div.gm_hfraq_r21_save_close_div{text-align:right;margin:16px 0 0;" +
  "cursor:default;}" +
  "#gm_hfraq_r21_config_window div.gm_hfraq_r21_save_close_div div.gm_hfraq_r21_info_reload_div{float:left;}" +
  "#gm_hfraq_r21_config_window div.gm_hfraq_r21_save_close_div div.gm_hfraq_r21_info_reload_div img" +
  "{vertical-align:text-bottom;}" +
  "#gm_hfraq_r21_config_window div.gm_hfraq_r21_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  // styles pour la popup de signalement
  "div#gm_hfraq_r21_alerte_popup{display:none;position:absolute;right:0;top:0;width:auto;height:auto;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;border:1px solid #242424;font-size:12px;padding:4px 6px;" +
  "background:linear-gradient(#ffffff, #f7f7ff);color:#000000;z-index:999;min-width:400px;" +
  "background-color:#ffffff;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_plus_new_post_div{font-size:11px;font-weight:bold;" +
  "margin:0 0 4px;white-space:pre-line;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_plus_new_post_div.gm_hfraq_r21_disabled{color:#808080;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_plus_new_post_div.gm_hfraq_r21_pixel{padding-left:1px;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_plus_new_post_div " +
  "input[type=\"radio\"]{margin:0 0 1px;vertical-align:text-bottom;}" +
  "div#gm_hfraq_r21_alerte_popup input[type=\"text\"]{padding:1px 4px;border:1px solid #c0c0c0;margin:0 0 4px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;display:block;box-sizing:border-box;" +
  "width:100%;height:20px;}" +
  "div#gm_hfraq_r21_alerte_popup select{padding:0 20px 0 0;border:1px solid #c0c0c0;margin:0 0 4px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;display:block;box-sizing:border-box;" +
  "width:100%;appearance:none;-moz-appearance:none;-webkit-appearance:none;background-repeat:no-repeat;" +
  "background-image:url(\"" + img_select + "\");background-position:right 5px center;height:20px;}" +
  "div#gm_hfraq_r21_alerte_popup select option{appearance:none;-moz-appearance:none;-webkit-appearance:none;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_plus_title{margin:0 0 4px;white-space:pre-line;" +
  "padding:0 1px;}" +
  "div#gm_hfraq_r21_alerte_popup textarea{padding:1px 4px;border:1px solid #c0c0c0;margin:0 0 4px;" +
  "font-size:12px;font-family:Verdana,Arial,Sans-serif,Helvetica;display:block;box-sizing:border-box;" +
  "width:100%;height:50px;resize:none;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_save_close{height:16px;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_save_close " +
  "img.gm_hfraq_r21_throbber{display:none;float:right;cursor:default;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_save_close " +
  "div.gm_hfraq_r21_answer{display:none;float:right;text-align:right;font-size:11px;" +
  "color:#ff0000;font-weight:bold;cursor:default;padding:0 1px;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_save_close " +
  "div.gm_hfraq_r21_answer.gm_hfraq_r21_success{color:#007f00;}" +
  "div#gm_hfraq_r21_alerte_popup div.gm_hfraq_r21_save_close " +
  "div.gm_hfraq_r21_answer.gm_hfraq_r21_meh{color:#ff7f00;}" +
  "div.gm_hfraq_r21_buttons{float:right;text-align:right;}" +
  "div.gm_hfraq_r21_buttons > img{margin-left:8px;cursor:pointer;}";
if(box_shadow) {
  style.textContent += "div#gm_hfraq_r21_alerte_popup{box-shadow:4px 4px 4px 0 rgba(0, 0, 0, 0.4);}";
}
if(!ff) {
  style.textContent += "div#gm_hfraq_r21_alerte_popup select:not(.ff){padding:0 24px 0 4px;}"
}
document.getElementsByTagName("head")[0].appendChild(style);

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// création de la fenêtre d'aide
var help_window = document.createElement("div");
help_window.setAttribute("id", "gm_hfraq_r21_help_window");
document.body.appendChild(help_window);

// fonction de création du bouton d'aide
function create_help_button(p_width, p_text) {
  let l_help_button = document.createElement("img");
  l_help_button.setAttribute("src", img_help);
  l_help_button.setAttribute("class", "gm_hfraq_r21_help_button");
  l_help_button.addEventListener("mouseover", function(e) {
    help_window.style.width = p_width + "px";
    help_window.textContent = p_text;
    help_window.style.left = (e.clientX + 32) + "px";
    help_window.style.top = (e.clientY - 16) + "px";
    help_window.style.visibility = "visible";
  }, false);
  l_help_button.addEventListener("mouseout", function(e) {
    help_window.style.visibility = "hidden";
  }, false);
  return l_help_button;
}

// création du voile de fond pour la fenêtre de configuration
var config_background = document.createElement("div");
config_background.setAttribute("id", "gm_hfraq_r21_config_background");
config_background.addEventListener("click", hide_config_window, false);
config_background.addEventListener("transitionend", background_transitionend, false);
config_background.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_background);

// création de la fenêtre de configuration
var config_window = document.createElement("div");
config_window.setAttribute("id", "gm_hfraq_r21_config_window");
config_window.addEventListener("contextmenu", prevent_default, false);
document.body.appendChild(config_window);

// titre de la fenêtre de configuration
var main_title = document.createElement("div");
main_title.setAttribute("class", "gm_hfraq_r21_main_title");
main_title.textContent = "Configuration du script " + script_name;
config_window.appendChild(main_title);

// section button
var button_fieldset = document.createElement("fieldset");
var button_legend = document.createElement("legend");
button_legend.textContent = "Icône du bouton de signalement d'une Alerte Qualitaÿ";
button_fieldset.appendChild(button_legend);
config_window.appendChild(button_fieldset);
var button_div = document.createElement("div");
button_div.setAttribute("class", "gm_hfraq_r21_div_img");
var button_test_img = document.createElement("img");
button_test_img.setAttribute("class", "gm_hfraq_r21_test_img_button");
button_div.appendChild(button_test_img);
var button_input = document.createElement("input");
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
button_div.appendChild(button_input);
var button_reset_img = document.createElement("img");
button_reset_img.setAttribute("src", img_reset);
button_reset_img.setAttribute("class", "gm_hfraq_r21_reset_img");
button_reset_img.setAttribute("title", "remettre l'icône par défaut");

function button_do_reset_img() {
  button_input.value = hfraq_img_icon_default;
  button_do_test_img();
}
button_reset_img.addEventListener("click", button_do_reset_img, false);
button_div.appendChild(button_reset_img);
button_fieldset.appendChild(button_div);

// section images
var images_fieldset = document.createElement("fieldset");
var images_legend = document.createElement("legend");
images_legend.textContent = "Images de fond pour les posts de qualitaÿ";
images_fieldset.appendChild(images_legend);
config_window.appendChild(images_fieldset);

// img_black (fond clair)
var img_black_p = document.createElement("p");
img_black_p.setAttribute("class", "gm_hfraq_r21_p_img");
var img_black_label = document.createElement("label");
img_black_label.textContent = "\u25cf image de fond pour fond clair (sur fond clair) : ";
img_black_label.setAttribute("for", "gm_hfraq_r21_img_black_input");
img_black_p.appendChild(img_black_label);
var img_black_input = document.createElement("input");
img_black_input.setAttribute("id", "gm_hfraq_r21_img_black_input");
img_black_input.setAttribute("type", "text");
img_black_input.setAttribute("spellcheck", "false");
img_black_input.setAttribute("size", "30");
img_black_input.setAttribute("title", "url de l'image (http ou data)");
img_black_input.addEventListener("focus", function() {
  img_black_input.select();
}, false);

function img_black_do_test_img() {
  img_black_test_img.setAttribute("src", img_black_input.value.trim());
  img_black_input.setSelectionRange(0, 0);
  img_black_input.blur();
}
img_black_input.addEventListener("input", img_black_do_test_img, false);
img_black_p.appendChild(img_black_input);
var img_black_reset_img = document.createElement("img");
img_black_reset_img.setAttribute("src", img_reset);
img_black_reset_img.setAttribute("class", "gm_hfraq_r21_reset_img");
img_black_reset_img.setAttribute("title", "remettre l'image par défaut");

function img_black_do_reset_img() {
  img_black_input.value = hfraq_img_black_default;
  img_black_do_test_img();
}
img_black_reset_img.addEventListener("click", img_black_do_reset_img, false);
img_black_p.appendChild(img_black_reset_img);
images_fieldset.appendChild(img_black_p);
var img_black_test_img = document.createElement("img");
img_black_test_img.setAttribute("class", "gm_hfraq_r21_test_img gm_hfraq_r21_light");
images_fieldset.appendChild(img_black_test_img);

// img_white (fond sombre)
var img_white_p = document.createElement("p");
img_white_p.setAttribute("class", "gm_hfraq_r21_p_img");
var img_white_label = document.createElement("label");
img_white_label.textContent = "\u25cf image de fond pour fond sombre (sur fond sombre) : ";
img_white_label.setAttribute("for", "gm_hfraq_r21_img_white_input");
img_white_p.appendChild(img_white_label);
var img_white_input = document.createElement("input");
img_white_input.setAttribute("id", "gm_hfraq_r21_img_white_input");
img_white_input.setAttribute("type", "text");
img_white_input.setAttribute("spellcheck", "false");
img_white_input.setAttribute("size", "30");
img_white_input.setAttribute("title", "url de l'image (http ou data)");
img_white_input.addEventListener("focus", function() {
  img_white_input.select();
}, false);

function img_white_do_test_img() {
  img_white_test_img.setAttribute("src", img_white_input.value.trim());
  img_white_input.setSelectionRange(0, 0);
  img_white_input.blur();
}
img_white_input.addEventListener("input", img_white_do_test_img, false);
img_white_p.appendChild(img_white_input);
var img_white_reset_img = document.createElement("img");
img_white_reset_img.setAttribute("src", img_reset);
img_white_reset_img.setAttribute("class", "gm_hfraq_r21_reset_img");
img_white_reset_img.setAttribute("title", "remettre l'image par défaut");

function img_white_do_reset_img() {
  img_white_input.value = hfraq_img_white_default;
  img_white_do_test_img();
}
img_white_reset_img.addEventListener("click", img_white_do_reset_img, false);
img_white_p.appendChild(img_white_reset_img);
images_fieldset.appendChild(img_white_p);
var img_white_test_img = document.createElement("img");
img_white_test_img.setAttribute("class", "gm_hfraq_r21_test_img gm_hfraq_r21_dark");
images_fieldset.appendChild(img_white_test_img);

// info "sans rechargement" et boutons de validation et de fermeture
var save_close_div = document.createElement("div");
save_close_div.setAttribute("class", "gm_hfraq_r21_save_close_div");
var info_reload_div = document.createElement("div");
info_reload_div.setAttribute("class", "gm_hfraq_r21_info_reload_div");
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
  hfraq_img_black = img_black_input.value.trim();
  if(hfraq_img_black === "") {
    hfraq_img_black = hfraq_img_black_default;
  }
  hfraq_img_white = img_white_input.value.trim();
  if(hfraq_img_white === "") {
    hfraq_img_white = hfraq_img_white_default;
  }
  hfraq_img_icon = button_input.value.trim();
  if(hfraq_img_icon === "") {
    hfraq_img_icon = hfraq_img_icon_default;
  }
  // fermeture de la fenêtre
  hide_config_window();
  // enregistrement des paramètres
  Promise.all([
    GM.setValue("hfraq_img_black", hfraq_img_black),
    GM.setValue("hfraq_img_white", hfraq_img_white),
    GM.setValue("hfraq_img_icon", hfraq_img_icon),
  ]);
  // mise à jour de la configuration
  update_config();
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
function show_config_window(p_event) {
  // initialisation des paramètres
  button_input.value = hfraq_img_icon;
  button_do_test_img();
  img_black_input.value = hfraq_img_black;
  img_black_do_test_img();
  img_white_input.value = hfraq_img_white;
  img_white_do_test_img();
  // affichage de la fenêtre
  config_window.style.visibility = "visible";
  config_background.style.visibility = "visible";
  window.setTimeout(function() {
    config_window.style.left =
      parseInt((document.documentElement.clientWidth - config_window.offsetWidth) / 2, 10) + "px";
    config_window.style.top =
      parseInt((document.documentElement.clientHeight - config_window.offsetHeight) / 2, 10) + "px";
    config_background.style.width = document.documentElement.scrollWidth + "px";
    config_background.style.height = document.documentElement.scrollHeight + "px";
    config_window.style.opacity = "1";
    config_background.style.opacity = "0.8";
  }, 100);
}

// fonction d'ouverture de la fenêtre de configuration sur un clic droit
function mouseup_config(p_event) {
  p_event.preventDefault();
  if(p_event.button === 2) {
    show_config_window(p_event);
  }
}

// ajout d'une entrée de configuration dans le menu de l'extension
gmMenu(script_name + " -> Configuration", show_config_window);

/* ---------------------------------------------------------------- */
/* création de la popup de signalement / association / plussoiement */
/* ---------------------------------------------------------------- */

// création de la popup de signalement / association / plussoiement
var alerte_popup = document.createElement("div");
alerte_popup.setAttribute("id", "gm_hfraq_r21_alerte_popup");
document.body.appendChild(alerte_popup);

// radio de signalement d'une nouvelle alerte qualitaÿ
var new_div = document.createElement("div");
new_div.setAttribute("class", "gm_hfraq_r21_plus_new_post_div");
var new_radio = document.createElement("input");
new_radio.setAttribute("id", "gm_hfraq_r21_new_radio");
new_radio.setAttribute("name", "gm_hfraq_r21_new_post_radio");
new_radio.setAttribute("type", "radio");
new_radio.addEventListener("change", new_post_changed, false);
new_div.appendChild(new_radio);
var new_label = document.createElement("label");
new_label.textContent = " Signaler une nouvelle Alerte Qualitaÿ";
new_label.setAttribute("for", "gm_hfraq_r21_new_radio");
new_div.appendChild(new_label);
alerte_popup.appendChild(new_div);

// radio d'association du post à une alerte qualitaÿ existante
var post_div = document.createElement("div");
post_div.setAttribute("class", "gm_hfraq_r21_plus_new_post_div");
var post_radio = document.createElement("input");
post_radio.setAttribute("id", "gm_hfraq_r21_post_radio");
post_radio.setAttribute("name", "gm_hfraq_r21_new_post_radio");
post_radio.setAttribute("type", "radio");
post_radio.addEventListener("change", new_post_changed, false);
post_div.appendChild(post_radio);
var post_label = document.createElement("label");
post_label.textContent = " Associer ce post à une Alerte Qualitaÿ existante";
post_label.setAttribute("for", "gm_hfraq_r21_post_radio");
post_div.appendChild(post_label);
alerte_popup.appendChild(post_div);

// entête du signalement quand il n'y a pas encore d'alerte qualitaÿ sur le topic
var new_only_div = document.createElement("div");
new_only_div.setAttribute("class", "gm_hfraq_r21_plus_new_post_div gm_hfraq_r21_pixel");
new_only_div.textContent = "Signaler une Alerte Qualitaÿ";
alerte_popup.appendChild(new_only_div);

// entête du plussoiement de l'alerte qualitaÿ correspondante
var plus_div = document.createElement("div");
plus_div.setAttribute("class", "gm_hfraq_r21_plus_new_post_div");
plus_div.textContent = "Plussoyer l'Alerte Qualitaÿ";
alerte_popup.appendChild(plus_div);

// input text pour le nom de la nouvelle alerte qualitaÿ à signaler
var new_title = document.createElement("input");
new_title.setAttribute("type", "text");
new_title.setAttribute("spellcheck", "false");
new_title.setAttribute("placeholder", "Nom de l'Alerte Qualitaÿ (obligatoire)");
new_title.setAttribute("title", "Nom de l'Alerte Qualitaÿ (obligatoire)");
alerte_popup.appendChild(new_title);

// select pour le choix de l'alerte qualitaÿ existante à associer à un post
var post_alerte = document.createElement("select");
alerte_popup.appendChild(post_alerte);

// nom de l'alerte qualitaÿ à plussoyer
var plus_title = document.createElement("div");
plus_title.setAttribute("class", "gm_hfraq_r21_plus_title");
alerte_popup.appendChild(plus_title);

// textarea pour le commentaire de l'alerte qualitaÿ
var comment = document.createElement("textarea");
comment.setAttribute("spellcheck", "false");
comment.setAttribute("placeholder", "Commentaire (facultatif)");
comment.setAttribute("title", "Commentaire (facultatif)");
alerte_popup.appendChild(comment);

// throbber, message et boutons
var save_close = document.createElement("div");
save_close.setAttribute("class", "gm_hfraq_r21_save_close");
var throbber = document.createElement("img");
throbber.setAttribute("class", "gm_hfraq_r21_throbber");
throbber.setAttribute("src", img_throbber);
save_close.appendChild(throbber);
var answer = document.createElement("div");
answer.setAttribute("class", "gm_hfraq_r21_answer");
save_close.appendChild(answer);
var buttons = document.createElement("div");
buttons.setAttribute("class", "gm_hfraq_r21_buttons");
var save = document.createElement("img");
save.setAttribute("src", img_save);
save.setAttribute("title", "Valider");
save.addEventListener("click", save_alerte, false);
buttons.appendChild(save);
var close = document.createElement("img");
close.setAttribute("src", img_close);
close.setAttribute("title", "Annuler");
close.addEventListener("click", hide_popup, false);
buttons.appendChild(close);
save_close.appendChild(buttons);
alerte_popup.appendChild(save_close);

// fonction de la gestion du changement du choix entre les radios de signalement et d'association
function new_post_changed(p_event) {
  if(new_radio.checked === true) {
    new_title.style.display = "block";
    post_alerte.style.display = "none";
  } else {
    new_title.style.display = "none";
    post_alerte.style.display = "block";
  }
}

// fonction de gestion du log de la réponse, de l'affichage de la réponse et de la fermeture de la popup
function do_answer(p_message, p_response, p_alerte_id, p_title, p_topic_id, p_topic_title,
  p_pseudal, p_poster, p_post_id, p_post_url, p_comment, p_class) {
  console.log(script_name + " : " + p_message + " (" + p_response + ")\n" +
    "alerte_id : |" + p_alerte_id + "|\n" +
    "title : |" + p_title + "|\n" +
    "topic_id : |" + p_topic_id + "|\n" +
    "topic_title : |" + p_topic_title + "|\n" +
    "pseudal : |" + p_pseudal + "|\n" +
    "poster : |" + p_poster + "|\n" +
    "post_id : |" + p_post_id + "|\n" +
    "post_url : |" + p_post_url + "|\n" +
    "comment : |" + p_comment + "|");
  if(typeof p_class !== "undefined") {
    answer.classList.add(p_class);
  }
  answer.textContent = p_message;
  throbber.style.display = "none";
  answer.style.display = "block";
  window.setTimeout(hide_popup, answer_time);
}

// fonction de gestion de l'enregistrement de l'alerte
function save_alerte(p_event) {
  // détermination de l'id de l'alerte
  let l_alerte_id = save.getAttribute("data-alerte");
  if(l_alerte_id !== "") {
    l_alerte_id = topic_alertes[l_alerte_id].id;
  } else if(alerte_default !== null && post_radio.checked) {
    l_alerte_id = post_alerte.value;
  } else {
    l_alerte_id = "-1"; // i.e. nouvelle alerte
  }
  // vérification de la présence du nom de l'alerte en cas de nouvelle alerte
  let l_title = new_title.value.trim();
  if(l_alerte_id === "-1" && l_title === "") {
    // si le nom n'est pas renseigné, affichage de l'erreur et arrêt de l'enregistrement de l'alerte
    new_title.required = true;
    new_title.reportValidity();
    return;
  }
  // récupération des paramètres transmis
  let l_poster = save.getAttribute("data-poster");
  let l_post_id = save.getAttribute("data-post-id");
  let l_post_url = save.getAttribute("data-post-url");
  // récupération du commentaire
  let l_comment = comment.value.trim();
  if(l_comment === "") {
    // construction d'un commentaire par défaut si le commentaire n'est pas renseigné
    l_comment = "post de " + l_poster;
  }
  // affichage du throbber
  buttons.style.display = "none";
  throbber.style.display = "block";
  // vérification des paramètres
  if((l_alerte_id === "-1" && (l_title === "" || topic_id === "" || topic_title === "")) ||
    pseudal === "" || l_poster === "" || l_post_id === "" || l_post_url === "") {
    // si il manque un parramètre, affichage de l'erreur et arrêt de l'enregistrement de l'alerte
    do_answer("erreur : un des paramètres est absent", "-1", l_alerte_id, l_title, topic_id, topic_title, pseudal,
      l_poster, l_post_id, l_post_url, l_comment);
    return;
  }
  // construction de la requête
  let l_params = new URLSearchParams();
  l_params.append("alerte_qualitay_id", l_alerte_id);
  if(l_alerte_id === "-1") {
    l_params.append("nom", l_title);
    l_params.append("topic_id", topic_id);
    l_params.append("topic_titre", topic_title);
  }
  l_params.append("pseudo", pseudal);
  l_params.append("post_id", l_post_id);
  l_params.append("post_url", l_post_url);
  if(l_comment !== "") {
    l_params.append("commentaire", l_comment);
  }
  // envoie de la requête
  GM.xmlHttpRequest({
    method: "POST",
    url: add_alerte_url,
    data: l_params.toString(),
    mozAnon: true,
    anonymous: true,
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Cookie": ""
    },
    // gestion de la réponse
    onload: function(p_response) {
      let l_response = p_response.responseText;
      switch(l_response) {
        case "1":
          do_answer("Ce post a été signalé avec succès !", l_response, l_alerte_id, l_title, topic_id,
            topic_title, pseudal, l_poster, l_post_id, l_post_url, l_comment, "gm_hfraq_r21_success");
          break;
        case "-2":
          do_answer("erreur : l'alerte spécifiée n'existe pas", l_response, l_alerte_id, l_title, topic_id,
            topic_title, pseudal, l_poster, l_post_id, l_post_url, l_comment);
          break;
        case "-3":
          do_answer("erreur : un des paramètres est manquant", l_response, l_alerte_id, l_title, topic_id,
            topic_title, pseudal, l_poster, l_post_id, l_post_url, l_comment);
          break;
        case "-4":
          do_answer("vous ne pouvez pas signaler plusieurs fois la même alerte", l_response, l_alerte_id, l_title,
            topic_id, topic_title, pseudal, l_poster, l_post_id, l_post_url, l_comment, "gm_hfraq_r21_meh");
          break;
        default:
          do_answer("une erreur imprévue est survenue", l_response, l_alerte_id, l_title, topic_id, topic_title,
            pseudal, l_poster, l_post_id, l_post_url, l_comment);
          console.log(p_response);
      }
    },
    // gestion des erreurs
    onerror: function(p_response) {
      do_answer("une erreur inconnue est survenue", "-1", l_alerte_id, l_title, topic_id, topic_title, pseudal,
        l_poster, l_post_id, l_post_url, l_comment);
      console.log(p_response);
    },
    ontimeout: function(p_response) {
      do_answer("erreur : la demande n'a pas aboutit", "-1", l_alerte_id, l_title, topic_id, topic_title, pseudal,
        l_poster, l_post_id, l_post_url, l_comment);
      console.log(p_response);
    },
  });
}

// fonction d'affichage de la popup de signalement / association / plussoiement
function show_popup(p_event) {
  // fermeture de la popup (si elle est ouverte ailleurs)
  hide_popup();
  // réinitialisation du contenu de la popup
  new_radio.checked = true;
  new_div.style.display = "none";
  post_radio.checked = false;
  post_div.style.display = "none";
  new_only_div.style.display = "none";
  plus_div.style.display = "none";
  new_title.required = false;
  new_title.value = "";
  new_title.style.display = "none";
  post_alerte.value = alerte_default;
  post_alerte.style.display = "none";
  plus_title.value = "";
  plus_title.style.display = "none";
  comment.value = "";
  throbber.style.display = "none";
  answer.textContent = "";
  answer.classList.remove("gm_hfraq_r21_success");
  answer.classList.remove("gm_hfraq_r21_meh");
  answer.style.display = "none";
  buttons.style.display = "block";
  // transmission des données de l'alerte (si le post est déjà signalé)
  // et des données du post sur le bouton valider de la popup
  save.setAttribute("data-alerte", p_event.currentTarget.getAttribute("data-alerte"));
  save.setAttribute("data-poster", p_event.currentTarget.getAttribute("data-poster"));
  save.setAttribute("data-post-id", p_event.currentTarget.getAttribute("data-post-id"));
  save.setAttribute("data-post-url", p_event.currentTarget.getAttribute("data-post-url"));
  // affichage des éléments de la popup en fonction du type
  if(p_event.currentTarget.hasAttribute("data-alerte") &&
    p_event.currentTarget.getAttribute("data-alerte") !== "") {
    // le post est déjà signalé, on ne peut que plussoyer
    let l_alerte = topic_alertes[p_event.currentTarget.getAttribute("data-alerte")];
    plus_div.style.display = "block";
    plus_title.textContent =
      l_alerte.nom + " (par " + l_alerte.pseudal + ", le " + cuter_date(l_alerte.date) + ")";
    plus_title.style.display = "block";
  } else {
    // le post n'est pas déjà signalé
    if(alerte_default === null) {
      // il n'existe pas d'alerte qualitaÿ sur le topic, on ne peut qu'en signaler une nouvelle
      new_only_div.style.display = "block";
    } else {
      // il existe des alertes qualitaÿ sur le topic on autorise le choix entre signalement et association
      new_div.style.display = "block";
      post_div.style.display = "block";
    }
    // par défaut le choix signalement est sélectionné et le champ nom (input text) est affiché
    new_title.style.display = "block";
  }
  // positionnement de la popup
  alerte_popup.style.right =
    (document.documentElement.scrollWidth - window.scrollX - p_event.clientX + 16) + "px";
  alerte_popup.style.top = (window.scrollY + p_event.clientY + 16) + "px";
  // affichage de la popup
  alerte_popup.style.display = "block";
}

// fonction de fermeture de la popup de signalement
function hide_popup(p_event) {
  alerte_popup.style.display = "none";
}

// fonction de fermeture de la popup de signalement par la touche echap
function esc_popup(p_event) {
  if(p_event.key === "Escape") {
    hide_popup();
  }
}
document.addEventListener("keydown", esc_popup, false);

/* ------------------ */
/* fonctions globales */
/* ------------------ */

// fonction de désactivation de l'action par défaut sur un événement
function prevent_default(p_event) {
  p_event.preventDefault();
}

// fonction permettant de choisir l'image de signalement en fonction de la couleur de fond du post
function mj(p_color) {
  let l_r = parseInt(p_color.substr(0, 2), 16);
  let l_g = parseInt(p_color.substr(2, 2), 16);
  let l_b = parseInt(p_color.substr(4, 2), 16);
  return (((0.299 * l_r) + (0.587 * l_g) + (0.114 * l_b)) / 255) > 0.5 ?
    hfraq_img_black : hfraq_img_white;
}

// fonction de mise à jour de la configuration
function update_config() {
  hfraq_img_1 = mj(color_1);
  hfraq_img_2 = mj(color_2);
  let l_posts = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > " +
    "tbody > tr.message");
  for(let l_post of l_posts) {
    if(l_post.hasAttribute("data-alerte") && l_post.getAttribute("data-alerte") !== "") {
      l_post.style.backgroundImage = "url(" + (l_post.classList.contains("cBackCouleurTab1") ?
        hfraq_img_1 : hfraq_img_2) + ")";
    }
    l_post.querySelector(":scope > td.messCase1 + td.messCase2 div.toolbar > div.right > " +
      "img.gm_hfraq_r21_aq_button").setAttribute("src", hfraq_img_icon);
  }
}

// fonction de remplacement des - en / dans les dates des alertes reçues
function cuter_date(p_date) {
  return p_date.replace(/-/g, "/");
}

/* --------------------------------------------------------- */
/* récupération des paramètres et mise en place des éléments */
/* --------------------------------------------------------- */

Promise.all([
  GM.getValue("hfraq_img_black", hfraq_img_black_default),
  GM.getValue("hfraq_img_white", hfraq_img_white_default),
  GM.getValue("hfraq_img_icon", hfraq_img_icon_default),
]).then(function([
  hfraq_img_black_value,
  hfraq_img_white_value,
  hfraq_img_icon_value,
]) {
  // initialisation des variables globales
  hfraq_img_black = hfraq_img_black_value;
  hfraq_img_white = hfraq_img_white_value;
  hfraq_img_icon = hfraq_img_icon_value;
  // récupération des couleurs de fond utilisées pour les posts
  let l_the_style = document.querySelector("head link[href^=\"/include/the_style1.php?color_key=\"]")
    .getAttribute("href").split("/");
  color_1 = l_the_style[13].toLowerCase();
  color_2 = l_the_style[14].toLowerCase();
  // détermination des images de signalement à utiliser pour les posts en fonction des couleurs de fond
  hfraq_img_1 = mj(color_1);
  hfraq_img_2 = mj(color_2);
  // récupération de l'id du topic
  if(window.location.href.indexOf(".htm") !== -1) { // url verbeuse
    topic_id = /sujet_([0-9]+)_[0-9]+\.htm/.exec(window.location.href);
  } else { // url à paramètres
    topic_id = /&post=([0-9]+)&page=/.exec(window.location.href);
  }
  topic_id = topic_id !== "" && topic_id !== null && typeof topic_id[1] !== "undefined" ? topic_id[1] : "";
  // récupération du titre du topic
  topic_title = document.querySelector("div#mesdiscussions.mesdiscussions table.main " +
    "tr.cBackHeader.fondForum2Title th div.left h3");
  topic_title = topic_title !== null ? topic_title.textContent.trim() : "";
  // récupération du pseudal si connecté
  pseudal = document.querySelector("div#mesdiscussions.mesdiscussions form[name=\"hop\"] " +
    "input[type=\"hidden\"][name=\"pseudo\"]");
  pseudal = pseudal !== null ? pseudal.value.trim() : "";
  // récupération de la liste des alertes qualitaÿ du topic
  if(topic_id !== "") {
    GM.xmlHttpRequest({
      method: "GET",
      url: get_alertes_url + "?topic_id=" + topic_id,
      mozAnon: true,
      anonymous: true,
      headers: {
        "Cookie": ""
      },
      onload: function(p_response) {
        // traitement de la liste des alertes qualitaÿ du topic
        let l_alertes = new DOMParser().parseFromString(p_response.responseText, "text/xml")
          .documentElement.getElementsByTagName("alerte");
        for(let l_alerte of l_alertes) {
          // enregistrement de la première alerte qualitaÿ du topic (la plus récente)
          if(alerte_default === null) {
            alerte_default = l_alerte.getAttribute("id");
          }
          // construction des options du select pour le choix de l'alerte qualitaÿ existante à associer à un post
          let l_option = document.createElement("option");
          l_option.textContent = l_alerte.getAttribute("nom") + " (par " +
            l_alerte.getAttribute("pseudoInitiateur") + ", le " +
            cuter_date(l_alerte.getAttribute("date")) + ")";
          l_option.setAttribute("value", l_alerte.getAttribute("id"));
          post_alerte.appendChild(l_option);
          // construction de la liste des alertes qualitaÿ du topic par post associé
          let l_post_ids = l_alerte.getAttribute("postsIds").split(",");
          for(let l_post_id of l_post_ids) {
            if(typeof topic_alertes[l_post_id] === "undefined") {
              topic_alertes[l_post_id] = {
                id: l_alerte.getAttribute("id"),
                nom: l_alerte.getAttribute("nom"),
                pseudal: l_alerte.getAttribute("pseudoInitiateur"),
                date: l_alerte.getAttribute("date"),
              };
            }
          }
        }
        // désactivation du radio d'association d'un post à une alerte qualitaÿ ->
        // si il n'y a pas encore d'alerte qualitaÿ sur le topic (la fonctionalité est en fait masquée au final)
        if(alerte_default === null) {
          post_radio.disabled = true;
          post_div.classList.add("gm_hfraq_r21_disabled");
          post_div.setAttribute("title", "Il n'existe pas encore d'Alerte Qualitaÿ sur ce topic");
        }
        // récupération de la liste des posts pour la mise en valeur des posts signalés
        // et l'ajout du bouton de signalement d'une alerte qualitaÿ
        let l_posts = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > " +
          "tbody > tr.message");
        for(let l_post of l_posts) {
          // récupération de l'auteur, de l'id et de l'url du post
          let l_poster = l_post.querySelector(":scope > td.messCase1 > div b.s2");
          l_poster = l_poster !== null ? l_poster.textContent.trim().replace(/\u200b/g, "") : "";
          let l_post_id = l_post.querySelector(":scope > td.messCase1 > a[name^=\"t\"]");
          l_post_id = l_post_id !== null ? l_post_id.getAttribute("name").trim().substring(1) : "";
          // gestion de la compatibilité avec [HFR] Chat pour récupérer l'url du post
          let l_post_url = l_post.querySelector(":scope div.right > a[href^=\"#t\"] > " +
            "img[src^=\"https://forum-images.hardware.fr/\"][alt][title]");
          l_post_url = l_post_url !== null ? l_post_url.parentElement.href.trim() : "";
          if(l_post_id !== "") {
            // vérification si ce post est signalé
            let l_data_alerte = "";
            if(alerte_default !== null && typeof topic_alertes[l_post_id] !== "undefined") {
              // ajout de l'image de signalement en fonction de la couleur de fond du post
              l_post.style.backgroundImage = "url(" + (l_post.classList.contains("cBackCouleurTab1") ?
                hfraq_img_1 : hfraq_img_2) + ")";
              l_post.style.backgroundPosition = "center";
              l_data_alerte = l_post_id;
              l_post.setAttribute("data-alerte", l_data_alerte);
            }
            // ajout du bouton de signalement d'une alerte qualitaÿ sur tous les posts si connecté ->
            // et que les autres champs nécéssaires pour faire une alerte qualitaÿ sont présents
            if(topic_title !== "" && pseudal !== "" && l_poster !== "" && l_post_url !== "") {
              // récupération de la toolbar du post
              let l_toolbar = l_post.querySelector(":scope > td.messCase1 + td.messCase2 div.toolbar");
              // construction du bouton
              let l_aq_div = document.createElement("div");
              l_aq_div.setAttribute("class", "right");
              let l_aq_img = document.createElement("img");
              l_aq_img.setAttribute("class", "gm_hfraq_r21_aq_button");
              l_aq_img.setAttribute("src", hfraq_img_icon);
              l_aq_img.setAttribute("alt", "AQ");
              l_aq_img.setAttribute("title", "Signaler une Alerte Qualitaÿ\n(clic droit pour configurer)");
              // ajout des données de l'alerte (si le post est déjà signalé) et des données du post sur le bouton
              l_aq_img.setAttribute("data-alerte", l_data_alerte);
              l_aq_img.setAttribute("data-poster", l_poster);
              l_aq_img.setAttribute("data-post-id", l_post_id);
              l_aq_img.setAttribute("data-post-url", l_post_url);
              // ajout de la gestion des clics pour signaler ou ouvrir la fenêtre de configuarion
              l_aq_img.addEventListener("contextmenu", prevent_default, false);
              l_aq_img.addEventListener("click", function(p_event) {
                if(window.confirm(
                    "Bonjour, vous êtes sur le point de signaler une Alerte Qualitaÿ,\n\n\n" +
                    "IL NE S'AGIT PAS D'UNE ALERTE DE MODÉRATION.\n\n\n" +
                    "Si vous vouliez faire une alerte de modération, merci de cliquer sur Annuler, " +
                    "sinon cliquez sur OK pour continuer.") === true) {
                  show_popup(p_event);
                }
              }, false);
              l_aq_img.addEventListener("mouseup", mouseup_config, false);
              // ajout du bouton
              l_aq_div.appendChild(l_aq_img);
              let l_spacer_div = l_toolbar.querySelector("div.spacer");
              l_toolbar.insertBefore(l_aq_div, l_spacer_div);
            }
          }
        }
      },
    });
  }
});
