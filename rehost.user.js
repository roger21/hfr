// ==UserScript==
// @name          Rehost
// @version       2.0.5
// @namespace     roger21.free.fr
// @description   Permet de générer dans le presse-papier le BBCode de réhébergement d'une image sur images.weserv.nl à partir du menu contextuel de l'image.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAABsUlEQVR42mP4T2PAMGoBSRYwYABMceJFBs4CigJkgC1ABsuVy4hE5FtAjJNJswBZGr8FhzMW7o2aQYw7iLLgw%2FXnaNp2%2BEwA2kEdC54fvrVSs%2Br5kZs0CaJ3V59ssGw5UbJio3Xr%2B%2BvPIFL7Ymfti51NjgVoTnt37SnQ9DsrTgK5d5af2Gjb9uHm8%2FPtW%2FZFztwTMf18x1ZKLdho1Qox3dbWVlZW1khdT51PXltMxcLcwtLcQltcxVBJW51HztLS0tzcnJwggpgOseDv37%2F%2F%2Fv27PH3PwbT5nx6%2FA7J%2Ff%2Ft5smr1VIcyoBRQAUWpCGIBhP1wy4VDGQt%2BffwOZJ85fRqofv%2F%2B%2FWRaAEdA%2FSkafjv9Jy50rTOX0AEy4KjbOvf9%2B%2FdwC8gsiyA%2BePHihYmJSVBQUFkZ1HPa2torVqyAKCA5ktEsgJi%2BdSso5RQWFlZUVISHh9fX1wMF9%2B7dSwUL5OXlt2zZAhdxdXV1c3MDMu7fvw%2B0Q1dXl9IggrgdGeTl5dXU1AAZd%2B%2Fe1dfXJzmS0SyQkwOldzSgqKgIYfDz81NkwdCp0Siv7gfagtGm44BYAAAXG4T0FK1wwAAAAABJRU5ErkJggg%3D%3D
// @include       *
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/rehost.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/rehost.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/rehost.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.setClipboard
// @grant         GM_setClipboard
// @grant         GM.notification
// @grant         GM_notification
// @grant         GM_registerMenuCommand
// ==/UserScript==

/*

Copyright © 2018-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 2732 $

// historique :
// 2.0.5 (27/12/2020) :
// - correction du rehost sans rehost
// - correction du rehost moyen (800)
// 2.0.4 (25/09/2020) :
// - possible amélioration de la gestion de la récupération de l'url de l'image
// 2.0.3 (25/09/2020) :
// - correction de la gestion des urls pour images.weserv.nl
// 2.0.2 (16/07/2020) :
// - correction du margin et du padding des legends des fieldsets
// 2.0.1 (16/07/2020) :
// - mise à jour des icônes du script
// 2.0.0 (16/07/2020) :
// - utilisation du service images.weserv.nl et adaptations ad-hoc à la place de reho.st
// - ajout des formats grand (1000px) et large (1200px)
// - réduction du temps d'affichage de la motification de 6,7s à 3,5s (pour tm)
// - ajout de fieldsets dans la fenêtre de configuration
// 1.1.7 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 1.1.6 (11/01/2020) :
// - mise à jour des images des boutons de la fenêtre de configuration
// 1.1.5 (10/11/2019) :
// - réduction des temps des transitions de 0.7s à 0.3s
// 1.1.4 (25/10/2019) :
// - correction d'une fôte [:vizera]
// 1.1.3 (12/10/2019) :
// - ajout d'une info "sans rechargement" dans la fenêtre de configuration
// - correction de la gestion du sous-menu pour les gifs
// 1.1.2 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 1.1.1 (18/09/2019) :
// - ajout de la directive @inject-into content pour isoler les scripts sous violentmonkey
// 1.1.0 (05/09/2019) :
// - petite sécurisation du css et petit nettoyage du code
// - bordure solide pour la fenêtre de configuration
// 1.0.0 (28/11/2018) :
// - ajout de l'avis de licence AGPL v3+
// 0.9.3 (13/11/2018) :
// - augmentation du z-index de la fenêtre de conf pour permettre son affichage sur certains sites
// 0.9.2 (26/08/2018) :
// - utilisation de la visibility plutot que le display pour gérer la fenêtre de conf
// 0.9.1 (11/08/2018) :
// - sécurisation de certains styles de la fenêtre de conf (contaminés par les styles de la page)
// - amélioration du calcul de la position de la fenêtre de conf (pour les pages spéciales)
// 0.9.0 (05/08/2018) :
// - ajout de la fenêtre de configuration
// 0.8.3 (28/07/2018) :
// - amélioration de la récupération du body
// 0.8.2 (08/07/2018) :
// - ajout d'une gestion pour les gifs
// 0.8.1 (30/06/2018) :
// - corection d'un ] oublié dans le bbcode :/
// 0.8.0 (29/06/2018) :
// - création

/* ----------------- */
/* images des icones */
/* ----------------- */

var iconSans = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAB%2FElEQVQ4y62SO2tUURSFv73PvZMxk2GIeZiHgvgIhBhfRUSwUDBW%2FgMtLARLSWHlH9DCnyBiaSumFOwUrGLCWPkiD0jIw0kyz3vP2RaTYWYSsNEFB86GfdZe66wN%2FwgBWHz5%2FoUZ9%2BqJZdMgR5usu1Y1YmevrjyanYsAzLh%2FfvbckMvnRVzmrxN9ErB6jeK7pQdAk6CeWI%2FL5WXh7Qa1ZJXt2icmpiPiTAkfjHKph88fdhg%2BfpOIEW4%2FnMJMBUABvAeJM6jC790FJi4oLlqmWl%2BlUf2Jyyxz8VqW7c0vOCfQYTNqXcwCqork9nFxhXp1B9EyUMOxRdwbU95fR0cVgscsHCYAEcFST5J6kAoSSqANDMN8FcwTRYp1fGoXgaoilQK1ciDqySDqwRI8BSpbWfp6TzR7RNuJtKMSRISBgct8W0iorEQ09oZp7I2w9z3P0seU0fGrRM51pdKMUQQC4IS%2B3GlODd1hbf4Jx7LrpD5g9QITN56Ty53BzGMdHtoWRGjs3iU0AqJG%2F%2B4GlyYnMTPWiz9YqTymtB%2FwwYDFQwTBEDNOzjxra5taI91cIfpVZPDpHINxlk67B0vcUmAHpwOFMSiMkZ6dObqOqt0KMpGWLKkW%2BsdvgQqEFqF0%2BW09tmoF1ebECMA5efN1vng9TW26Je1vUDWc8Jr%2FgT9jGdZbgZJ%2BWgAAAABJRU5ErkJggg%3D%3D";
var iconFull = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACKUlEQVQ4y62TTWsUQRCGn%2BqZ2Y9ZzGKWuIQoSAhBQ4IQIkQED4L4D7zoDxDBgwfBPyHBk6iI6EUEEcGz5KA3PyBEVBRCooSQj2V3s9nM7kxPl4dJdhOvWlDQdDdPvfV2NfxjCMCjVx%2FvutRcbXW00EmybUGyYwFR3buuKEo%2BUMI8T25cmbkFwIOXn9fbraZz1qqmejjd4Yysaivq6r3nn%2BoAPkArcvlCIZS5N1tEbFKXBSZPrFLK1UjUsVEv8X6xQlmnCRhi7vo4qTPSA3QTMMbHF6Hr%2FWZyeJVi4Rv1qEaSdskVS0yPj7HwZYBqoYpzve4xmROCCnieEOkahdwmtfYGO8k2290mW9EKQXGNerRMEHgoIJL54u%2BzUsAzBo0dnTQmsru04x06rkPqLEgMLiVnDNozdV8BoApGhBIjNFplHCG7LiZKuoiUaTYGqRRH8X0DKj2A3wO4rIWyf5Kfv1YZKi1zZCCgaGIaGwMsrYwyVjmN78negx4AOMApiBHKuWFGS%2Bf5Mf%2BM6uA7jIVce4qJM7cph8exqcVpn%2BDvy1eFD2tHsQ6sg7M7cOnUGA74vrTI48YMtgaJhZso7pAC5xCFaxfeAgZB8GZrtFrrhCvzHLt8nzt%2BkJVVRR04p395gKIKgqICNhzEhhWi6kTfZfra9WALYU6auLg8O3IRTN8g9MD6QCRJTOBlg%2BADFAJ58fD113Mdy1RGlt6k9Weu%2F6ECX8l7POV%2FxB%2FDRRbjiYtbHQAAAABJRU5ErkJggg%3D%3D";
var iconLargGran = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABv0lEQVQ4y82STWtTQRSGnzP3TpIb0rQJIZSKNoilSIqg4M6V%2BAOKontx51%2Fwr6hbEbRuhbrzB4hdaS1%2BoAs%2FSj40Hzd37sxxoWkazV7PamCYh%2Bc988K%2FHpke7j1%2BcdfG8fbIYb0XBDm6FQVQAkoUQQhu5%2FaNCzcB4inA2nj72uUz9WEmojhim2GMRxRcbnBZjNci1UrMo93XV4F5wChTO5xEcv%2F5R%2FLSHquNPYr2E5l3fOvVOXh3Fh2e5871LYIeic8APggiAmbE8tIHTPSG7uQ9aZ6CrVFdsnQHm%2Bgs9TwAIIgBcnzoM8gO6U06jH0X0ZRJ6CB4VAGdvTHHAapgSUjTBmleZugHDN0XUrdCNl6jXCj%2FWu4iA%2F1NTeJlOr0N8s4rkup3Cv4UXz9vkg22aKzU%2FvrGOYAPGS4cUokqdF%2BOWbXPMAGMW2ewUUOlQ2DteIIZIABIn0L5AXEitNpF2vYW8Y999pdP8La0C5pjohZBdYFBCBSLCedOXwERpOUYZyPicZ9m%2FSRNERSlXCqjYYFBycooiYrVdvPiXEl1LrFiKRCZBQYuz588fHpwaeJZ12lR5M%2FOK8YozuU7%2FDfzE%2B0PvACiZWk5AAAAAElFTkSuQmCC";
var iconMedPrev = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABYklEQVQ4y92Rv0scYRCGn9lbc3juuaDgoYKmyWEjaaOWNtY2kipiq42KhaWQMsGksBZLSWVpb2ejYmF7hxwo4nk%2F3Nv9vttvUojiwt0fkLzdMPM%2B7wwD%2F7zkfbH18%2FTXUDC4inpv3dQR5jxPjU1VxLWSuHO4v720%2Berx3wOCYOjbxnI5LBSKvYKkndjw4M%2FFKtAbgEhYKBS5qTU5q%2BwQDj8QGUv1fpT5ie98mZlEJJfZ2s%2F6oQt0nSMI7hkcGMGR4D5UuKtHOHWI6HBfgKo2VQlbkaEex6T6TNsmPEYxdRJQQZVmX4DpxqEqtGJHpfYJl7%2BmbSOe6tOUS%2FmeX%2FCyZR7n4KmT8rm0y1pjjMULj8WPP%2FB9HwVEpP8JqCIoV7frWGs5NwYzPoC5XsFay9eFc1SzkX52HVfV1EztLZ%2FwMqcZg7UWVBt9AVEUH%2F8%2BvpxzeLOeJwiECg1eIeJ4bneO%2BL%2F0F2ZFngSiQbBTAAAAAElFTkSuQmCC";
var iconThumb = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABAElEQVR42mNgGAUYoKh354TamYc%2B1M44AsEzj%2F0rn3L4b8XUgx8Ke3f0EzSgbuaR969ev%2Fr%2F5et3FPzi3af%2FQIPfEzZg1tF%2FIA3dBxz%2Bzzzu%2F7%2F3kMf%2F5FWG%2F19%2B%2BP4fKPeBoAH1s4%2F%2B%2BwA0IGdZ6v%2BstZb%2F41bo%2F%2Feb7vf%2F%2Bfuv%2F%2BtnH%2FlH0ICKaYf%2Fv%2Fn4%2Ff%2B8fXf%2Bn5nnD8a9m679f%2Fbu23%2BQ4YQNmHro%2F9uP3%2F4XLHL%2Fnz3X6X9Ut%2BH%2F0Dad%2F8%2Fegr1A2ICqqQcevnn34f%2FHLz%2F%2BfwDi95%2B%2Fg%2FErYCCCApigAQXdO7pqpx88XD39MDAKjyBF56EPoCgeTeiYAAAQA8BFxRnPewAAAABJRU5ErkJggg%3D%3D";
var iconConf = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAzRJREFUOMt1k11oHHUUxX%2F%2Fmdmd3SSbTXbTajfQgG1ikZqCzdem20hqUmoNNoigUqwWW4KFglKpIcXSNx%2BUgi%2B%2BiBUUP8AioRZFsGgtMaZJY9U01mo%2BKM1mYz73K93ZnZnrQ7YSHzxwH8%2B593LOUayDJxhRgBfwAw6wCgjgAzxADsgXknG5x9H4L4zdsda6jz98v%2BfM6b5uoBwoe7nnyJ5PP%2FqgJ7Yr%2BmBRiP8VaG5s2N4Wi9Ue6HoiCjQBTU8%2F1d0Z29Va17V%2FX7R44b9QxbON4pherzd2dfCHjlBlhUfXND%2BA40rOsix7d3vnlURi7lLxNQewdd0XMKMtzXXHeo60X%2Fv5euXpU70tjQ07%2FWs8sVwRC3B0XRcFgaGrI1bf6689kk5nnERiLqU8wUjo3HvvvrC347EHcrkcps%2Fnuq7kASYmp1zHcair3aoBaJryZrNZray0jO%2B%2Bv3z7%2BcNHz2kC7tfffHtn9Pqvyx6vmXVdWQXsvjfOZNs7Hx%2Fu2Nc13HvqdBawXVdW%2Ff6S7F%2BTU8mBwaE5AZRRHvEC96No%2B3P8l1rTNNXExKS0790%2FJMIwgFLsvNh%2FvqX%2B4e1aJpORh3Y0TCFcAWYMFK6Cu8BqoVBwTNMUw2MoBRkUSQAFmRK%2F3wUcj8ejFCyJYgUo6LovUHri1ePtZ996c0c4XJUHnMqKoFi53IaRa6OrCjb2HD3c2n3gSQOwDcNwO%2FY8Wq3AGRsbnzUEzMimTRurq6uzCwuLbjgcRgT6ek%2BWHXzumS6AmpoaHNe9C5DJZlV9fb3MzMS3fvLZ56O65gvoN8Z%2Fl9%2FGbpgnTvblRaQ02tyUFxErWFFhB4PBgiuSA9y3z75jHDv%2BSvLOzEzq%2FBf9NxeXluLKKI8YQKCYf39JqT86cPlSZTgUkvWJW1hYVI2tbfOO7YwAVjFMSc1OxW2BpMAcivmXXjwk4VDI%2FnHwJ7V5y7b85i3bnJt%2F3JKqqrB96OCzNoqEQFxg2U7FbR1ArLSIlRbNF9D%2Bnl%2Fw5iwr3H%2Fhy5Xp6dsDwHQyndowO5tQFy5%2BdWt5ZWXWScULYqWl6NC6JpVHdKACCLFm7XyxcPcVS7TE2mbnHucfEGJoU7krLCIAAAAASUVORK5CYII%3D"
var iconRehost = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAADTElEQVR42mP4T2PAQCcL9sfNXq5cRjl6uPkCdguAcuvMGg8mzyMb7QqYBDTk8sTdOC0AKqIkKN5efER9C16euPN41xVaWfDu2lNIuB%2FOWEgTC4Buh1iw1rCeJhb8%2FPjtRNkqoOn31pwm04INVq37omfQKpIPpS1crgQKgStT9mA18cH6c%2BRbcDRnCVDkQPK8LS5dQMbVaXvRtB0vXQkUB5LkWHAEbPqR7MVA9qf7rzc7dQK516bvh%2Bu5vfQ4KHpVy4HkneUnSLPgaC7CdAj4dPfVJocOkB0zD8BNX2vUcHv5ibVG9UD23ZUnibUAYvrh7EVw6UWLFuXm5mYlpvlJW3vym4TpewBJHzGL9KikgoICIAlkA0USvSMzY1KAjBj7oAIwmDx5MroFGyxb0NwOBM7OzsLCwoaGhvrauiqCssp8Usr80nqaOoYwAGSrCMgAxTXkVIGklrwaUFBcXFxFRQXFgmXgLINmOsSCpKQkaMFw9PbOwMk7%2FSc%2B2HgeJUtffbonYjpQHIhug6OkqakJ3QKg6Xsjp2OmRWQLQAF96fGBxLlAg9CK5XdXnsxwrYzV8JxW3InTAqw5Gc0CIPh499X%2BhDkgf2xBsSPCO5iBgYGXi%2Bf9%2B%2FfYLdji1HV99kE0ZKFpFOrkd3%2F9WTjaP33jjTmH9oSDwgSoAC6%2BoGgC0IIgO2%2FsPlhv3oy1htLhlHeTMYOELxBNti9hY2atNIkHsnfABJHRg43nsFvw%2FdUnYOGOiWxNrKIDw99dfgxEZ7YeVpZX5OTg5OPh3blkI0QQLpUdnw5kQEzDYgEuAI%2BDO3fuqKura2hoXLx40cbGBph2T548CY35t2%2Fl5eWB4dPY2EimBRDTgQDIAAoCo9HKykpMTOz06dNA0y0sLIAJPzY2FmjHhAkTSLYgNDQU6HC46XBXQ8zV1dUFkkCbgILFxcVAOyZOnEiCBfb29gICAmpqardv30aTevTokZCQEBMT09KlS%2BGChYWFQDu8vb1J8AHQjZimQ8D9%2B%2Ff19PRkZGSAEQMXBBZEQDuAgqRFMi7w%2FPlzYOEjJyd3%2BfJluGBMTAwJPgC6sQYvADoZGA1KSkrl5eUQEVtbW2ItAIapFhFAAwyQRaKjo%2Bnb%2BKUdAAB3wjLfKhLqdgAAAABJRU5ErkJggg%3D%3D";

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
if(typeof GM_notification !== "undefined" && typeof GM.notification === "undefined") {
  GM.notification = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_notification.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}
var gmNotif = false;
if(typeof GM.notification !== "undefined") {
  gmNotif = true;
}
if(typeof GM_setClipboard !== "undefined" && typeof GM.setClipboard === "undefined") {
  GM.setClipboard = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_setClipboard.apply(null, args));
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

/* -------------------------- */
/* actions du menu contextuel */
/* -------------------------- */

const REHOST_URL = "https://images.weserv.nl/?n=-1&default=i.imgur.com/Q9fqKbD.png";

var currentUrl;

function setCurrentUrl(e) {
  currentUrl = this.src;
}

var currentRstIcons;
var currentRstNotifs;
var currentRstReturn;

function doRst(e, type) {
  let rstRehostLink = "";
  let rstRehostSize = "";
  let rstRehostParam = "";
  let messageType = "";
  let imageUrl = "";
  switch (type) {
    case "sans":
      rstRehostLink = "";
      rstRehostSize = "";
      rstRehostParam = "";
      imageUrl = currentUrl;
      messageType = "de l'image sans rehost ";
      break;
    case "full":
      rstRehostLink = REHOST_URL;
      rstRehostSize = "";
      rstRehostParam = "&url=";
      imageUrl = encodeURIComponent(currentUrl);
      messageType = "de l'image ";
      break;
    case "large":
      rstRehostLink = REHOST_URL;
      rstRehostSize = "&w=1200&we";
      rstRehostParam = "&url=";
      imageUrl = encodeURIComponent(currentUrl);
      messageType = "de l'image large ";
      break;
    case "grand":
      rstRehostLink = REHOST_URL;
      rstRehostSize = "&w=1000&we";
      rstRehostParam = "&url=";
      imageUrl = encodeURIComponent(currentUrl);
      messageType = "de l'image grande ";
      break;
    case "moyen":
      rstRehostLink = REHOST_URL;
      rstRehostSize = "&w=800&we";
      rstRehostParam = "&url=";
      imageUrl = encodeURIComponent(currentUrl);
      messageType = "de l'image moyenne ";
      break;
    case "preview":
      rstRehostLink = REHOST_URL;
      rstRehostSize = "&w=600&we";
      rstRehostParam = "&url=";
      imageUrl = encodeURIComponent(currentUrl);
      messageType = "de l'aperçu ";
      break;
    case "thumb":
      rstRehostLink = REHOST_URL;
      rstRehostSize = "&w=230&h=230&we";
      rstRehostParam = "&url=";
      imageUrl = encodeURIComponent(currentUrl);
      messageType = "de la vignette ";
      break;
  }
  let rstReturn = currentRstReturn ? "\n" : "";
  if(e.shiftKey) {
    GM.setClipboard(rstRehostLink + rstRehostSize + rstRehostParam + imageUrl + rstReturn);
    if(gmNotif && currentRstNotifs) {
      GM.notification({
        text: "Le lien " + messageType + "a été copié dans le presse-papiers.",
        title: "Rehost",
        image: iconRehost,
        timeout: 3500,
      });
    }
  } else if(e.ctrlKey) {
    GM.setClipboard("[img]" + rstRehostLink + rstRehostSize + rstRehostParam +
      imageUrl + "[/img]" + rstReturn);
    if(gmNotif && currentRstNotifs) {
      GM.notification({
        text: "Le BBCode sans lien " + messageType + "a été copié dans le presse-papiers.",
        title: "Rehost",
        image: iconRehost,
        timeout: 3500,
      });
    }
  } else {
    GM.setClipboard("[url=" + rstRehostLink + rstRehostParam + imageUrl + "][img]" +
      rstRehostLink + rstRehostSize + rstRehostParam + imageUrl + "[/img][/url]" +
      rstReturn);
    if(gmNotif && currentRstNotifs) {
      GM.notification({
        text: "Le BBCode " + messageType + "a été copié dans le presse-papiers.",
        title: "Rehost",
        image: iconRehost,
        timeout: 3500,
      });
    }
  }
}

function doRstSans(e) {
  doRst(e, "sans");
}

function doRstFull(e) {
  doRst(e, "full");
}

function doRstLarge(e) {
  doRst(e, "large");
}

function doRstGrand(e) {
  doRst(e, "grand");
}

function doRstMoyen(e) {
  doRst(e, "moyen");
}

function doRstPreview(e) {
  doRst(e, "preview");
}

function doRstThumb(e) {
  doRst(e, "thumb");
}

function doRstConf() {
  showConfigWindow();
}

function doRstIcons() {
  currentRstIcons = !currentRstIcons;
  GM.setValue("rst_icons", currentRstIcons).then(createRehostMenu);
}

function doRstNotifs() {
  currentRstNotifs = !currentRstNotifs;
  GM.setValue("rst_notifs", currentRstNotifs).then(createRehostMenu);
}

function doRstReturn() {
  currentRstReturn = !currentRstReturn;
  GM.setValue("rst_return", currentRstReturn).then(createRehostMenu);
}

/* -------------------------------------------------------------- */
/* récupération des paramètres et construction du menu contextuel */
/* -------------------------------------------------------------- */

const REHOST_MENU_ID = "gmr21_rehost_menu_id";

function createRehostMenu() {
  Promise.all([
    GM.getValue("rst_sans", "2"), // "1", "2" ou "0"
    GM.getValue("rst_full", "2"), // "1", "2" (obligatoire)
    GM.getValue("rst_large", "2"), // "1", "2" ou "0"
    GM.getValue("rst_grand", "2"), // "1", "2" ou "0"
    GM.getValue("rst_moyen", "2"), // "1", "2" ou "0"
    GM.getValue("rst_preview", "2"), // "1", "2" ou "0"
    GM.getValue("rst_thumb", "2"), // "1", "2" ou "0"
    GM.getValue("rst_conf", "2"), // "1", "2" ou "0" si gmMenu sinon  "1", "2"
    GM.getValue("rst_options", true), // true ou false
    GM.getValue("rst_icons", true), // true ou false
    GM.getValue("rst_notifs", true), // true ou false
    GM.getValue("rst_return", false), // true ou false
  ]).then(function([
    rstSans,
    rstFull,
    rstLarge,
    rstGrand,
    rstMoyen,
    rstPreview,
    rstThumb,
    rstConf,
    rstOptions,
    rstIcons,
    rstNotifs,
    rstReturn,
  ]) {
    currentRstIcons = rstIcons;
    currentRstNotifs = rstNotifs;
    currentRstReturn = rstReturn;
    // correction de la valeur de rstConf si pas de gmMenu
    if(rstConf === "0" && !gmMenu) {
      rstConf = "2";
    }
    // suppression de l'ancien menu contextuel
    let oldMenu = document.getElementById(REHOST_MENU_ID);
    if(oldMenu) oldMenu.parentNode.removeChild(oldMenu);
    // nouveau menu contextuel
    let rehostMenu = document.createElement("menu");
    rehostMenu.setAttribute("id", REHOST_MENU_ID);
    rehostMenu.setAttribute("type", "context");
    // nouveau sous-menu
    let rehostSubMenu = document.createElement("menu");
    rehostSubMenu.setAttribute("label", "Rehost");
    // rehost sans
    if(rstSans !== "0") {
      let rehostMenuItemSans = document.createElement("menuitem");
      rehostMenuItemSans.setAttribute("label", "Rehost sans rehost");
      if(rstIcons) rehostMenuItemSans.setAttribute("icon", iconSans);
      rehostMenuItemSans.addEventListener("click", doRstSans, false);
      if(rstSans === "1") {
        rehostMenu.appendChild(rehostMenuItemSans);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemSans);
      }
    }
    // rehost full (obliatoire)
    let rehostMenuItemFull = document.createElement("menuitem");
    rehostMenuItemFull.setAttribute("label", "Rehost taille originale");
    if(rstIcons) rehostMenuItemFull.setAttribute("icon", iconFull);
    rehostMenuItemFull.addEventListener("click", doRstFull, false);
    if(rstFull === "1") {
      rehostMenu.appendChild(rehostMenuItemFull);
    } else {
      rehostSubMenu.appendChild(rehostMenuItemFull);
    }
    // rehost large
    if(rstLarge !== "0") {
      let rehostMenuItemLarge = document.createElement("menuitem");
      rehostMenuItemLarge.setAttribute("label", "Rehost large (1200px)");
      if(rstIcons) rehostMenuItemLarge.setAttribute("icon", iconLargGran);
      rehostMenuItemLarge.addEventListener("click", doRstLarge, false);
      if(rstLarge === "1") {
        rehostMenu.appendChild(rehostMenuItemLarge);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemLarge);
      }
    }
    // rehost grand
    if(rstGrand !== "0") {
      let rehostMenuItemGrand = document.createElement("menuitem");
      rehostMenuItemGrand.setAttribute("label", "Rehost grand (1000px)");
      if(rstIcons) rehostMenuItemGrand.setAttribute("icon", iconLargGran);
      rehostMenuItemGrand.addEventListener("click", doRstGrand, false);
      if(rstGrand === "1") {
        rehostMenu.appendChild(rehostMenuItemGrand);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemGrand);
      }
    }
    // rehost moyen
    if(rstMoyen !== "0") {
      let rehostMenuItemMoyen = document.createElement("menuitem");
      rehostMenuItemMoyen.setAttribute("label", "Rehost moyen (800px)");
      if(rstIcons) rehostMenuItemMoyen.setAttribute("icon", iconMedPrev);
      rehostMenuItemMoyen.addEventListener("click", doRstMoyen, false);
      if(rstMoyen === "1") {
        rehostMenu.appendChild(rehostMenuItemMoyen);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemMoyen);
      }
    }
    // rehost preview
    if(rstPreview !== "0") {
      let rehostMenuItemPreview = document.createElement("menuitem");
      rehostMenuItemPreview.setAttribute("label", "Rehost aperçu (600px)");
      if(rstIcons) rehostMenuItemPreview.setAttribute("icon", iconMedPrev);
      rehostMenuItemPreview.addEventListener("click", doRstPreview, false);
      if(rstPreview === "1") {
        rehostMenu.appendChild(rehostMenuItemPreview);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemPreview);
      }
    }
    // rehost thumb
    if(rstThumb !== "0") {
      let rehostMenuItemThumb = document.createElement("menuitem");
      rehostMenuItemThumb.setAttribute("label", "Rehost vignette (230px)");
      if(rstIcons) rehostMenuItemThumb.setAttribute("icon", iconThumb);
      rehostMenuItemThumb.addEventListener("click", doRstThumb, false);
      if(rstThumb === "1") {
        rehostMenu.appendChild(rehostMenuItemThumb);
      } else {
        rehostSubMenu.appendChild(rehostMenuItemThumb);
      }
    }
    // hr 1
    if((rstSans === "2" || rstFull === "2" || rstLarge === "2" || rstGrand === "2" ||
        rstMoyen === "2" || rstPreview === "2" || rstThumb === "2") && rstConf === "2") {
      rehostSubMenu.appendChild(document.createElement("hr"));
    }
    // configuration
    if(rstConf !== "0") {
      let rehostMenuItemConf = document.createElement("menuitem");
      if(rstIcons) rehostMenuItemConf.setAttribute("icon", iconConf);
      rehostMenuItemConf.addEventListener("click", doRstConf, false);
      if(rstConf === "1") {
        rehostMenuItemConf.setAttribute("label", "Configuration de Rehost");
        rehostMenu.appendChild(rehostMenuItemConf);
      } else {
        rehostMenuItemConf.setAttribute("label", "Configuration");
        rehostSubMenu.appendChild(rehostMenuItemConf);
      }
    }
    // hr 2
    if((rstSans === "2" || rstFull === "2" || rstLarge === "2" || rstGrand === "2" ||
        rstMoyen === "2" || rstPreview === "2" || rstThumb === "2" || rstConf === "2") && rstOptions) {
      rehostSubMenu.appendChild(document.createElement("hr"));
    }
    // options
    if(rstOptions) {
      // option icons
      let rehostMenuItemIcons = document.createElement("menuitem");
      rehostMenuItemIcons.setAttribute("type", "checkbox");
      if(rstIcons) {
        rehostMenuItemIcons.setAttribute("checked", true);
      }
      rehostMenuItemIcons.setAttribute("label", "Afficher les icônes");
      rehostMenuItemIcons.addEventListener("click", doRstIcons, false);
      rehostSubMenu.appendChild(rehostMenuItemIcons);
      // option notifications
      let rehostMenuItemNotifs = document.createElement("menuitem");
      rehostMenuItemNotifs.setAttribute("type", "checkbox");
      if(gmNotif && rstNotifs) {
        rehostMenuItemNotifs.setAttribute("checked", true);
      }
      if(!gmNotif) {
        rehostMenuItemNotifs.setAttribute("disabled", true);
      }
      rehostMenuItemNotifs.setAttribute("label", "Notifications");
      rehostMenuItemNotifs.addEventListener("click", doRstNotifs, false);
      rehostSubMenu.appendChild(rehostMenuItemNotifs);
      // option retour
      let rehostMenuItemReturn = document.createElement("menuitem");
      rehostMenuItemReturn.setAttribute("type", "checkbox");
      if(rstReturn) {
        rehostMenuItemReturn.setAttribute("checked", true);
      }
      rehostMenuItemReturn.setAttribute("label", "Ajouter un retour");
      rehostMenuItemReturn.addEventListener("click", doRstReturn, false);
      rehostSubMenu.appendChild(rehostMenuItemReturn);
    }
    // ajout du sous-menu
    if(rstSans === "2" || rstFull === "2" || rstLarge === "2" || rstGrand === "2" ||
      rstMoyen === "2" || rstPreview === "2" || rstThumb === "2" || rstConf === "2" || rstOptions) {
      rehostMenu.appendChild(rehostSubMenu);
    }
    // ajout du menu
    if(!document.body) {
      new MutationObserver((mutations, observer) => {
        if(document.body) {
          observer.disconnect();
          document.body.appendChild(rehostMenu);
        }
      }).observe(document.documentElement, {
        childList: true
      });
    } else {
      document.body.appendChild(rehostMenu);
    }
  });
}
createRehostMenu();

/* -------------------------------------------------- */
/* ajout du menu contextuel sur les images de la page */
/* -------------------------------------------------- */

function setContextMenuAttribute() {
  let imgs = document.querySelectorAll("img[src]:not([src^='data']):not([contextmenu='" + REHOST_MENU_ID + "'])");
  for(let img of imgs) {
    img.addEventListener("mouseover", setCurrentUrl, true);
    img.setAttribute("contextmenu", REHOST_MENU_ID);
  }
}
setContextMenuAttribute();
var o = new MutationObserver(setContextMenuAttribute);
o.observe(document, {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true
});

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// styles css pour la fenêtre de configuration
var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  "#gm_rst_r21_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:10003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;" +
  "text-align:justify;}" +
  "#gm_rst_r21_config_background{position:fixed;left:0;top:0;background-color:#242424;z-index:10001;" +
  "display:block;visibility:hidden;opacity:0;transition:opacity 0.3s ease 0s;}" +
  "#gm_rst_r21_config_window{position:fixed;width:500px;height:auto;background:#ffffff;z-index:10002;" +
  "visibility:hidden;transition:opacity 0.3s ease 0s;border:1px solid black;padding:16px;display:block;" +
  "box-sizing:content-box;color:#000000;font-variant:normal;opacity:0;}" +
  "#gm_rst_r21_config_window *{box-sizing:content-box;text-align:left;background:#ffffff;color:#000000;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:12px;line-height:1;margin:0;padding:0;border:0;}" +
  "#gm_rst_r21_config_window fieldset{margin:0 0 8px;border:1px solid #888888;padding:10px 12px 8px;}" +
  "#gm_rst_r21_config_window legend{font-size:14px;cursor:default;padding:0 2px;margin:0 0 0 -2px;}" +
  "#gm_rst_r21_config_window div{display:block;}" +
  "#gm_rst_r21_config_window img{position:static;display:inline;width:auto;height:auto;}" +
  "#gm_rst_r21_config_window input{display:inline;width:auto;height:auto;}" +
  "#gm_rst_r21_config_window label{font-weight:normal;display:inline;}" +
  "#gm_rst_r21_config_window label:before{content:none;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_main_title{font-size:16px;text-align:center;font-weight:bold;" +
  "margin:0 0 14px;cursor:default;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row{font-size:12px;margin:0 0 6px;display:flex;" +
  "flex-direction:row;cursor:default;align-items:flex-end;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row:last-child{margin:0;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell{}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell:first-of-type{width:45%;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell img{vertical-align:text-bottom;" +
  "margin:0 8px 0 0;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell input[type=\"radio\"]{" +
  "vertical-align:text-bottom;margin:0 4px 1px 32px;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell input[type=\"radio\"]:first-of-type{" +
  "margin-left:0;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p{font-size:12px;margin:0 0 6px;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p:last-child{margin:0;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p input[type=\"checkbox\"]{vertical-align:text-bottom;" +
  "margin:0 8px 1px 0;}" +
  "#gm_rst_r21_config_window label.gm_rst_r21_disabled{color:#808080;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div{text-align:right;margin:16px 0 0;cursor:default;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div div.gm_rst_r21_info_reload_div{float:left;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div div.gm_rst_r21_info_reload_div img" +
  "{vertical-align:text-bottom;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  "#gm_rst_r21_config_window img.gm_rst_r21_help_button{margin-right:1px;cursor:help;}";
document.getElementsByTagName("head")[0].appendChild(style);

// images des boutons de validation et de fermeture
var saveImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var closeImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var helpImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";
var infoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";

// création de la fenêtre d'aide
var helpWindow = document.createElement("div");
helpWindow.setAttribute("id", "gm_rst_r21_help_window");
document.body.appendChild(helpWindow);
helpWindow.style.visibility = "hidden";

// fonction de création du bouton d'aide
function createHelpButton(width, text) {
  let helpButton = document.createElement("img");
  helpButton.setAttribute("src", helpImg);
  helpButton.setAttribute("class", "gm_rst_r21_help_button");
  helpButton.addEventListener("mouseover", function(e) {
    helpWindow.style.width = width + "px";
    helpWindow.textContent = text;
    helpWindow.style.left = (e.clientX + 32) + "px";
    helpWindow.style.top = (e.clientY - 16) + "px";
    helpWindow.style.visibility = "visible";
  }, false);
  helpButton.addEventListener("mouseout", function(e) {
    helpWindow.style.visibility = "hidden";
  }, false);
  return helpButton;
}

// création du voile de fond pour la fenêtre de configuration
var configBackground = document.createElement("div");
configBackground.id = "gm_rst_r21_config_background";
configBackground.addEventListener("click", hideConfigWindow, false);
configBackground.addEventListener("transitionend", backgroundTransitionend, false);
document.body.appendChild(configBackground);
configBackground.style.visibility = "hidden";

// création de la fenêtre de configuration
var configWindow = document.createElement("div");
configWindow.id = "gm_rst_r21_config_window";
document.body.appendChild(configWindow);
configWindow.style.visibility = "hidden";

// titre de la fenêtre de configuration
var mainTitle = document.createElement("div");
mainTitle.className = "gm_rst_r21_main_title";
mainTitle.textContent = "Configuration du script Rehost";
configWindow.appendChild(mainTitle);

// section de la configuration des menus
var menuTitleFieldset = document.createElement("fieldset");
var menuTitleLegend = document.createElement("legend");
menuTitleLegend.textContent = "Organisation des menus";
menuTitleFieldset.appendChild(menuTitleLegend);
configWindow.appendChild(menuTitleFieldset);

// sans
var sansRow = document.createElement("div");
sansRow.className = "gm_rst_r21_row";
var sansTitle = document.createElement("div");
sansTitle.className = "gm_rst_r21_cell";
var sansIcon = document.createElement("img");
sansIcon.src = iconSans;
sansTitle.appendChild(sansIcon);
sansTitle.appendChild(document.createTextNode("Rehost sans rehost :"));
sansRow.appendChild(sansTitle);
var sansRadios = document.createElement("div");
sansRadios.className = "gm_rst_r21_cell";
var sansRadio1 = document.createElement("input");
sansRadio1.type = "radio";
sansRadio1.id = "gm_rst_r21_sans_radio_1";
sansRadio1.name = "gm_rst_r21_sans_radio";
sansRadios.appendChild(sansRadio1);
var sansRadio1Label = document.createElement("label");
sansRadio1Label.htmlFor = "gm_rst_r21_sans_radio_1";
sansRadio1Label.textContent = "menu";
sansRadios.appendChild(sansRadio1Label);
var sansRadio2 = document.createElement("input");
sansRadio2.type = "radio";
sansRadio2.id = "gm_rst_r21_sans_radio_2";
sansRadio2.name = "gm_rst_r21_sans_radio";
sansRadios.appendChild(sansRadio2);
var sansRadio2Label = document.createElement("label");
sansRadio2Label.htmlFor = "gm_rst_r21_sans_radio_2";
sansRadio2Label.textContent = "sous-menu";
sansRadios.appendChild(sansRadio2Label);
var sansRadio0 = document.createElement("input");
sansRadio0.type = "radio";
sansRadio0.id = "gm_rst_r21_sans_radio_0";
sansRadio0.name = "gm_rst_r21_sans_radio";
sansRadios.appendChild(sansRadio0);
var sansRadio0Label = document.createElement("label");
sansRadio0Label.htmlFor = "gm_rst_r21_sans_radio_0";
sansRadio0Label.textContent = "aucun";
sansRadios.appendChild(sansRadio0Label);
sansRow.appendChild(sansRadios);
menuTitleFieldset.appendChild(sansRow);

// full
var fullRow = document.createElement("div");
fullRow.className = "gm_rst_r21_row";
var fullTitle = document.createElement("div");
fullTitle.className = "gm_rst_r21_cell";
var fullIcon = document.createElement("img");
fullIcon.src = iconFull;
fullTitle.appendChild(fullIcon);
fullTitle.appendChild(document.createTextNode("Rehost taille originale :"));
fullRow.appendChild(fullTitle);
var fullRadios = document.createElement("div");
fullRadios.className = "gm_rst_r21_cell";
var fullRadio1 = document.createElement("input");
fullRadio1.type = "radio";
fullRadio1.id = "gm_rst_r21_full_radio_1";
fullRadio1.name = "gm_rst_r21_full_radio";
fullRadios.appendChild(fullRadio1);
var fullRadio1Label = document.createElement("label");
fullRadio1Label.htmlFor = "gm_rst_r21_full_radio_1";
fullRadio1Label.textContent = "menu";
fullRadios.appendChild(fullRadio1Label);
var fullRadio2 = document.createElement("input");
fullRadio2.type = "radio";
fullRadio2.id = "gm_rst_r21_full_radio_2";
fullRadio2.name = "gm_rst_r21_full_radio";
fullRadios.appendChild(fullRadio2);
var fullRadio2Label = document.createElement("label");
fullRadio2Label.htmlFor = "gm_rst_r21_full_radio_2";
fullRadio2Label.textContent = "sous-menu";
fullRadios.appendChild(fullRadio2Label);
fullRow.appendChild(fullRadios);
menuTitleFieldset.appendChild(fullRow);

// large
var largeRow = document.createElement("div");
largeRow.className = "gm_rst_r21_row";
var largeTitle = document.createElement("div");
largeTitle.className = "gm_rst_r21_cell";
var largeIcon = document.createElement("img");
largeIcon.src = iconLargGran;
largeTitle.appendChild(largeIcon);
largeTitle.appendChild(document.createTextNode("Rehost large (1200px) :"));
largeRow.appendChild(largeTitle);
var largeRadios = document.createElement("div");
largeRadios.className = "gm_rst_r21_cell";
var largeRadio1 = document.createElement("input");
largeRadio1.type = "radio";
largeRadio1.id = "gm_rst_r21_large_radio_1";
largeRadio1.name = "gm_rst_r21_large_radio";
largeRadios.appendChild(largeRadio1);
var largeRadio1Label = document.createElement("label");
largeRadio1Label.htmlFor = "gm_rst_r21_large_radio_1";
largeRadio1Label.textContent = "menu";
largeRadios.appendChild(largeRadio1Label);
var largeRadio2 = document.createElement("input");
largeRadio2.type = "radio";
largeRadio2.id = "gm_rst_r21_large_radio_2";
largeRadio2.name = "gm_rst_r21_large_radio";
largeRadios.appendChild(largeRadio2);
var largeRadio2Label = document.createElement("label");
largeRadio2Label.htmlFor = "gm_rst_r21_large_radio_2";
largeRadio2Label.textContent = "sous-menu";
largeRadios.appendChild(largeRadio2Label);
var largeRadio0 = document.createElement("input");
largeRadio0.type = "radio";
largeRadio0.id = "gm_rst_r21_large_radio_0";
largeRadio0.name = "gm_rst_r21_large_radio";
largeRadios.appendChild(largeRadio0);
var largeRadio0Label = document.createElement("label");
largeRadio0Label.htmlFor = "gm_rst_r21_large_radio_0";
largeRadio0Label.textContent = "aucun";
largeRadios.appendChild(largeRadio0Label);
largeRow.appendChild(largeRadios);
menuTitleFieldset.appendChild(largeRow);

// grand
var grandRow = document.createElement("div");
grandRow.className = "gm_rst_r21_row";
var grandTitle = document.createElement("div");
grandTitle.className = "gm_rst_r21_cell";
var grandIcon = document.createElement("img");
grandIcon.src = iconLargGran;
grandTitle.appendChild(grandIcon);
grandTitle.appendChild(document.createTextNode("Rehost grand (1000px) :"));
grandRow.appendChild(grandTitle);
var grandRadios = document.createElement("div");
grandRadios.className = "gm_rst_r21_cell";
var grandRadio1 = document.createElement("input");
grandRadio1.type = "radio";
grandRadio1.id = "gm_rst_r21_grand_radio_1";
grandRadio1.name = "gm_rst_r21_grand_radio";
grandRadios.appendChild(grandRadio1);
var grandRadio1Label = document.createElement("label");
grandRadio1Label.htmlFor = "gm_rst_r21_grand_radio_1";
grandRadio1Label.textContent = "menu";
grandRadios.appendChild(grandRadio1Label);
var grandRadio2 = document.createElement("input");
grandRadio2.type = "radio";
grandRadio2.id = "gm_rst_r21_grand_radio_2";
grandRadio2.name = "gm_rst_r21_grand_radio";
grandRadios.appendChild(grandRadio2);
var grandRadio2Label = document.createElement("label");
grandRadio2Label.htmlFor = "gm_rst_r21_grand_radio_2";
grandRadio2Label.textContent = "sous-menu";
grandRadios.appendChild(grandRadio2Label);
var grandRadio0 = document.createElement("input");
grandRadio0.type = "radio";
grandRadio0.id = "gm_rst_r21_grand_radio_0";
grandRadio0.name = "gm_rst_r21_grand_radio";
grandRadios.appendChild(grandRadio0);
var grandRadio0Label = document.createElement("label");
grandRadio0Label.htmlFor = "gm_rst_r21_grand_radio_0";
grandRadio0Label.textContent = "aucun";
grandRadios.appendChild(grandRadio0Label);
grandRow.appendChild(grandRadios);
menuTitleFieldset.appendChild(grandRow);

// moyen
var moyenRow = document.createElement("div");
moyenRow.className = "gm_rst_r21_row";
var moyenTitle = document.createElement("div");
moyenTitle.className = "gm_rst_r21_cell";
var moyenIcon = document.createElement("img");
moyenIcon.src = iconMedPrev;
moyenTitle.appendChild(moyenIcon);
moyenTitle.appendChild(document.createTextNode("Rehost moyen (800px) :"));
moyenRow.appendChild(moyenTitle);
var moyenRadios = document.createElement("div");
moyenRadios.className = "gm_rst_r21_cell";
var moyenRadio1 = document.createElement("input");
moyenRadio1.type = "radio";
moyenRadio1.id = "gm_rst_r21_moyen_radio_1";
moyenRadio1.name = "gm_rst_r21_moyen_radio";
moyenRadios.appendChild(moyenRadio1);
var moyenRadio1Label = document.createElement("label");
moyenRadio1Label.htmlFor = "gm_rst_r21_moyen_radio_1";
moyenRadio1Label.textContent = "menu";
moyenRadios.appendChild(moyenRadio1Label);
var moyenRadio2 = document.createElement("input");
moyenRadio2.type = "radio";
moyenRadio2.id = "gm_rst_r21_moyen_radio_2";
moyenRadio2.name = "gm_rst_r21_moyen_radio";
moyenRadios.appendChild(moyenRadio2);
var moyenRadio2Label = document.createElement("label");
moyenRadio2Label.htmlFor = "gm_rst_r21_moyen_radio_2";
moyenRadio2Label.textContent = "sous-menu";
moyenRadios.appendChild(moyenRadio2Label);
var moyenRadio0 = document.createElement("input");
moyenRadio0.type = "radio";
moyenRadio0.id = "gm_rst_r21_moyen_radio_0";
moyenRadio0.name = "gm_rst_r21_moyen_radio";
moyenRadios.appendChild(moyenRadio0);
var moyenRadio0Label = document.createElement("label");
moyenRadio0Label.htmlFor = "gm_rst_r21_moyen_radio_0";
moyenRadio0Label.textContent = "aucun";
moyenRadios.appendChild(moyenRadio0Label);
moyenRow.appendChild(moyenRadios);
menuTitleFieldset.appendChild(moyenRow);

// preview
var previewRow = document.createElement("div");
previewRow.className = "gm_rst_r21_row";
var previewTitle = document.createElement("div");
previewTitle.className = "gm_rst_r21_cell";
var previewIcon = document.createElement("img");
previewIcon.src = iconMedPrev;
previewTitle.appendChild(previewIcon);
previewTitle.appendChild(document.createTextNode("Rehost aperçu (600px) :"));
previewRow.appendChild(previewTitle);
var previewRadios = document.createElement("div");
previewRadios.className = "gm_rst_r21_cell";
var previewRadio1 = document.createElement("input");
previewRadio1.type = "radio";
previewRadio1.id = "gm_rst_r21_preview_radio_1";
previewRadio1.name = "gm_rst_r21_preview_radio";
previewRadios.appendChild(previewRadio1);
var previewRadio1Label = document.createElement("label");
previewRadio1Label.htmlFor = "gm_rst_r21_preview_radio_1";
previewRadio1Label.textContent = "menu";
previewRadios.appendChild(previewRadio1Label);
var previewRadio2 = document.createElement("input");
previewRadio2.type = "radio";
previewRadio2.id = "gm_rst_r21_preview_radio_2";
previewRadio2.name = "gm_rst_r21_preview_radio";
previewRadios.appendChild(previewRadio2);
var previewRadio2Label = document.createElement("label");
previewRadio2Label.htmlFor = "gm_rst_r21_preview_radio_2";
previewRadio2Label.textContent = "sous-menu";
previewRadios.appendChild(previewRadio2Label);
var previewRadio0 = document.createElement("input");
previewRadio0.type = "radio";
previewRadio0.id = "gm_rst_r21_preview_radio_0";
previewRadio0.name = "gm_rst_r21_preview_radio";
previewRadios.appendChild(previewRadio0);
var previewRadio0Label = document.createElement("label");
previewRadio0Label.htmlFor = "gm_rst_r21_preview_radio_0";
previewRadio0Label.textContent = "aucun";
previewRadios.appendChild(previewRadio0Label);
previewRow.appendChild(previewRadios);
menuTitleFieldset.appendChild(previewRow);

// thumb
var thumbRow = document.createElement("div");
thumbRow.className = "gm_rst_r21_row";
var thumbTitle = document.createElement("div");
thumbTitle.className = "gm_rst_r21_cell";
var thumbIcon = document.createElement("img");
thumbIcon.src = iconThumb;
thumbTitle.appendChild(thumbIcon);
thumbTitle.appendChild(document.createTextNode("Rehost vignette (230px) :"));
thumbRow.appendChild(thumbTitle);
var thumbRadios = document.createElement("div");
thumbRadios.className = "gm_rst_r21_cell";
var thumbRadio1 = document.createElement("input");
thumbRadio1.type = "radio";
thumbRadio1.id = "gm_rst_r21_thumb_radio_1";
thumbRadio1.name = "gm_rst_r21_thumb_radio";
thumbRadios.appendChild(thumbRadio1);
var thumbRadio1Label = document.createElement("label");
thumbRadio1Label.htmlFor = "gm_rst_r21_thumb_radio_1";
thumbRadio1Label.textContent = "menu";
thumbRadios.appendChild(thumbRadio1Label);
var thumbRadio2 = document.createElement("input");
thumbRadio2.type = "radio";
thumbRadio2.id = "gm_rst_r21_thumb_radio_2";
thumbRadio2.name = "gm_rst_r21_thumb_radio";
thumbRadios.appendChild(thumbRadio2);
var thumbRadio2Label = document.createElement("label");
thumbRadio2Label.htmlFor = "gm_rst_r21_thumb_radio_2";
thumbRadio2Label.textContent = "sous-menu";
thumbRadios.appendChild(thumbRadio2Label);
var thumbRadio0 = document.createElement("input");
thumbRadio0.type = "radio";
thumbRadio0.id = "gm_rst_r21_thumb_radio_0";
thumbRadio0.name = "gm_rst_r21_thumb_radio";
thumbRadios.appendChild(thumbRadio0);
var thumbRadio0Label = document.createElement("label");
thumbRadio0Label.htmlFor = "gm_rst_r21_thumb_radio_0";
thumbRadio0Label.textContent = "aucun";
thumbRadios.appendChild(thumbRadio0Label);
thumbRow.appendChild(thumbRadios);
menuTitleFieldset.appendChild(thumbRow);

// conf
var confRow = document.createElement("div");
confRow.className = "gm_rst_r21_row";
var confTitle = document.createElement("div");
confTitle.className = "gm_rst_r21_cell";
var confIcon = document.createElement("img");
confIcon.src = iconConf;
confTitle.appendChild(confIcon);
confTitle.appendChild(document.createTextNode("Configuration de Rehost :"));
confRow.appendChild(confTitle);
var confRadios = document.createElement("div");
confRadios.className = "gm_rst_r21_cell";
var confRadio1 = document.createElement("input");
confRadio1.type = "radio";
confRadio1.id = "gm_rst_r21_conf_radio_1";
confRadio1.name = "gm_rst_r21_conf_radio";
confRadios.appendChild(confRadio1);
var confRadio1Label = document.createElement("label");
confRadio1Label.htmlFor = "gm_rst_r21_conf_radio_1";
confRadio1Label.textContent = "menu";
confRadios.appendChild(confRadio1Label);
var confRadio2 = document.createElement("input");
confRadio2.type = "radio";
confRadio2.id = "gm_rst_r21_conf_radio_2";
confRadio2.name = "gm_rst_r21_conf_radio";
confRadios.appendChild(confRadio2);
var confRadio2Label = document.createElement("label");
confRadio2Label.htmlFor = "gm_rst_r21_conf_radio_2";
confRadio2Label.textContent = "sous-menu";
confRadios.appendChild(confRadio2Label);
var confRadio0 = document.createElement("input");
confRadio0.type = "radio";
confRadio0.id = "gm_rst_r21_conf_radio_0";
confRadio0.name = "gm_rst_r21_conf_radio";
confRadios.appendChild(confRadio0);
var confRadio0Label = document.createElement("label");
confRadio0Label.htmlFor = "gm_rst_r21_conf_radio_0";
confRadio0Label.textContent = "aucun";
confRadios.appendChild(confRadio0Label);
confRow.appendChild(confRadios);
menuTitleFieldset.appendChild(confRow);

// section des options
var optionsFieldset = document.createElement("fieldset");
var optionsLegend = document.createElement("legend");
optionsLegend.textContent = "Options";
optionsFieldset.appendChild(optionsLegend);
configWindow.appendChild(optionsFieldset);

// options
var optionsP = document.createElement("p");
optionsP.className = "gm_rst_r21_p";
var optionsCheckbox = document.createElement("input");
optionsCheckbox.type = "checkbox";
optionsCheckbox.id = "gm_rst_r21_options_checkbox";
optionsP.appendChild(optionsCheckbox);
var optionsCheckboxLabel = document.createElement("label");
optionsCheckboxLabel.htmlFor = "gm_rst_r21_options_checkbox";
optionsCheckboxLabel.textContent = "Afficher les options dans le sous-menu";
optionsP.appendChild(optionsCheckboxLabel);
optionsFieldset.appendChild(optionsP);

// icons
var iconsP = document.createElement("p");
iconsP.className = "gm_rst_r21_p";
var iconsCheckbox = document.createElement("input");
iconsCheckbox.type = "checkbox";
iconsCheckbox.id = "gm_rst_r21_icons_checkbox";
iconsP.appendChild(iconsCheckbox);
var iconsCheckboxLabel = document.createElement("label");
iconsCheckboxLabel.htmlFor = "gm_rst_r21_icons_checkbox";
iconsCheckboxLabel.textContent = "Afficher les icônes dans les menus";
iconsP.appendChild(iconsCheckboxLabel);
optionsFieldset.appendChild(iconsP);

// notifs
var notifsP = document.createElement("p");
notifsP.className = "gm_rst_r21_p";
var notifsCheckbox = document.createElement("input");
notifsCheckbox.type = "checkbox";
notifsCheckbox.id = "gm_rst_r21_notifs_checkbox";
notifsP.appendChild(notifsCheckbox);
var notifsCheckboxLabel = document.createElement("label");
notifsCheckboxLabel.htmlFor = "gm_rst_r21_notifs_checkbox";
notifsCheckboxLabel.textContent = "Afficher les notifications";
notifsP.appendChild(notifsCheckboxLabel);
optionsFieldset.appendChild(notifsP);

// return
var returnP = document.createElement("p");
returnP.className = "gm_rst_r21_p";
var returnCheckbox = document.createElement("input");
returnCheckbox.type = "checkbox";
returnCheckbox.id = "gm_rst_r21_return_checkbox";
returnP.appendChild(returnCheckbox);
var returnCheckboxLabel = document.createElement("label");
returnCheckboxLabel.htmlFor = "gm_rst_r21_return_checkbox";
returnCheckboxLabel.textContent = "Ajouter un retour à la ligne après l'image";
returnP.appendChild(returnCheckboxLabel);
optionsFieldset.appendChild(returnP);

// info "sans rechargement" et boutons de validation et de fermeture
var saveCloseDiv = document.createElement("div");
saveCloseDiv.className = "gm_rst_r21_save_close_div";
var infoReloadDiv = document.createElement("div");
infoReloadDiv.className = "gm_rst_r21_info_reload_div";
var infoReloadImg = document.createElement("img");
infoReloadImg.setAttribute("src", infoImg);
infoReloadDiv.appendChild(infoReloadImg);
infoReloadDiv.appendChild(document.createTextNode(" sans rechargement "));
infoReloadDiv.appendChild(createHelpButton(255,
  "Les paramètres de cette fenêtre de configuration sont appliqués immédiatement à la validation, " +
  "il n'est pas nécessaire de recharger la page."));
saveCloseDiv.appendChild(infoReloadDiv);
var saveButton = document.createElement("img");
saveButton.src = saveImg;
saveButton.setAttribute("title", "Valider");
saveButton.addEventListener("click", saveConfigWindow, false);
saveCloseDiv.appendChild(saveButton);
var closeButton = document.createElement("img");
closeButton.src = closeImg;
closeButton.setAttribute("title", "Annuler");
closeButton.addEventListener("click", hideConfigWindow, false);
saveCloseDiv.appendChild(closeButton);
configWindow.appendChild(saveCloseDiv);

// fonction de validation de la fenêtre de configuration
function saveConfigWindow() {
  // fermeture de la fenêtre
  hideConfigWindow();
  // sauvegarde des paramètres de la fenêtre de configuration
  let rstSans = sansRadio1.checked ? "1" : sansRadio2.checked ? "2" : "0";
  let rstFull = fullRadio1.checked ? "1" : "2";
  let rstLarge = largeRadio1.checked ? "1" : largeRadio2.checked ? "2" : "0";
  let rstGrand = grandRadio1.checked ? "1" : grandRadio2.checked ? "2" : "0";
  let rstMoyen = moyenRadio1.checked ? "1" : moyenRadio2.checked ? "2" : "0";
  let rstPreview = previewRadio1.checked ? "1" : previewRadio2.checked ? "2" : "0";
  let rstThumb = thumbRadio1.checked ? "1" : thumbRadio2.checked ? "2" : "0";
  let rstConf = confRadio1.checked ? "1" : confRadio2.checked ? "2" : "0";
  let rstOptions = optionsCheckbox.checked;
  let rstIcons = iconsCheckbox.checked;
  let rstNotifs = notifsCheckbox.checked;
  if(!gmNotif) {
    rstNotifs = notifsCheckbox.dataset.value === "true";
  }
  let rstReturn = returnCheckbox.checked;
  currentRstIcons = rstIcons;
  currentRstNotifs = rstNotifs;
  currentRstReturn = rstReturn;
  Promise.all([
    GM.setValue("rst_sans", rstSans),
    GM.setValue("rst_full", rstFull),
    GM.setValue("rst_large", rstLarge),
    GM.setValue("rst_grand", rstGrand),
    GM.setValue("rst_moyen", rstMoyen),
    GM.setValue("rst_preview", rstPreview),
    GM.setValue("rst_thumb", rstThumb),
    GM.setValue("rst_conf", rstConf),
    GM.setValue("rst_options", rstOptions),
    GM.setValue("rst_icons", rstIcons),
    GM.setValue("rst_notifs", rstNotifs),
    GM.setValue("rst_return", rstReturn),
  ]).then(function() {
    createRehostMenu();
  });
}

// fonction de fermeture de la fenêtre de configuration
function hideConfigWindow() {
  configWindow.style.opacity = "0";
  configBackground.style.opacity = "0";
}

// fonction de fermeture de la fenêtre de configuration par la touche echap
function escConfigWindow(e) {
  if(e.key === "Escape") {
    hideConfigWindow();
  }
}

// fonction de gestion de la fin de la transition d'affichage / disparition de la fenêtre de configuration
function backgroundTransitionend() {
  if(configBackground.style.opacity === "0") {
    configWindow.style.visibility = "hidden";
    configBackground.style.visibility = "hidden";
    document.removeEventListener("keydown", escConfigWindow, false);
  }
  if(configBackground.style.opacity === "0.8") {
    document.addEventListener("keydown", escConfigWindow, false);
  }
}

// fonction d'affichage de la fenêtre de configuration
function showConfigWindow() {
  // initialisation des paramètres de la fenêtre de configuration
  Promise.all([
    GM.getValue("rst_sans", "2"), // "1", "2" ou "0"
    GM.getValue("rst_full", "2", ), // "1", "2" (obligatoire)
    GM.getValue("rst_large", "2"), // "1", "2" ou "0"
    GM.getValue("rst_grand", "2"), // "1", "2" ou "0"
    GM.getValue("rst_moyen", "2"), // "1", "2" ou "0"
    GM.getValue("rst_preview", "2"), // "1", "2" ou "0"
    GM.getValue("rst_thumb", "2"), // "1", "2" ou "0"
    GM.getValue("rst_conf", "2"), // "1", "2" ou "0" si gmMenu sinon  "1", "2"
    GM.getValue("rst_options", true), // true ou false
    GM.getValue("rst_icons", true), // true ou false
    GM.getValue("rst_notifs", true), // true ou false
    GM.getValue("rst_return", false), // true ou false
  ]).then(function([
    rstSans,
    rstFull,
    rstLarge,
    rstGrand,
    rstMoyen,
    rstPreview,
    rstThumb,
    rstConf,
    rstOptions,
    rstIcons,
    rstNotifs,
    rstReturn,
  ]) {
    if(!gmMenu) {
      confRadio0.disabled = true;
      confRadio0Label.className = "gm_rst_r21_disabled";
      if(rstConf === "0") {
        rstConf = "2";
      }
    }
    sansRadio1.checked = rstSans === "1";
    sansRadio2.checked = rstSans === "2";
    sansRadio0.checked = rstSans === "0";
    fullRadio1.checked = rstFull === "1";
    fullRadio2.checked = rstFull === "2";
    largeRadio1.checked = rstLarge === "1";
    largeRadio2.checked = rstLarge === "2";
    largeRadio0.checked = rstLarge === "0";
    grandRadio1.checked = rstGrand === "1";
    grandRadio2.checked = rstGrand === "2";
    grandRadio0.checked = rstGrand === "0";
    moyenRadio1.checked = rstMoyen === "1";
    moyenRadio2.checked = rstMoyen === "2";
    moyenRadio0.checked = rstMoyen === "0";
    previewRadio1.checked = rstPreview === "1";
    previewRadio2.checked = rstPreview === "2";
    previewRadio0.checked = rstPreview === "0";
    thumbRadio1.checked = rstThumb === "1";
    thumbRadio2.checked = rstThumb === "2";
    thumbRadio0.checked = rstThumb === "0";
    confRadio1.checked = rstConf === "1";
    confRadio2.checked = rstConf === "2";
    confRadio0.checked = rstConf === "0";
    optionsCheckbox.checked = rstOptions;
    iconsCheckbox.checked = rstIcons;
    notifsCheckbox.checked = rstNotifs;
    returnCheckbox.checked = rstReturn;
    if(!gmNotif) {
      notifsCheckbox.checked = false;
      notifsCheckbox.disabled = true;
      notifsCheckboxLabel.className = "gm_rst_r21_disabled";
      notifsCheckbox.dataset.value = rstNotifs;
    }
    // affichage de la fenêtre de configuration
    configWindow.style.visibility = "visible";
    configBackground.style.visibility = "visible";
    configWindow.style.left =
      parseInt((document.documentElement.clientWidth - configWindow.offsetWidth) / 2, 10) + "px";
    configWindow.style.top = document.documentElement.clientHeight ?
      parseInt((document.documentElement.clientHeight - configWindow.offsetHeight) / 2, 10) + "px" :
      "calc((100vh - " + configWindow.offsetHeight + "px) / 2)";
    configBackground.style.width = document.documentElement.scrollWidth + "px";
    configBackground.style.height = document.documentElement.scrollHeight ?
      document.documentElement.scrollHeight + "px" : "100vh";
    configWindow.style.opacity = "1";
    configBackground.style.opacity = "0.8";
  });
}

// ajout de l'ouverture de la fenêtre configuration dans le menu greasemonkey si c'est possible
if(gmMenu) {
  GM_registerMenuCommand("Rehost -> Configuration", showConfigWindow);
}
