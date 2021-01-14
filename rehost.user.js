// ==UserScript==
// @name          Rehost
// @version       3.0.0
// @namespace     roger21.free.fr
// @description   Permet de générer dans le presse-papier le BBCode de réhébergement d'une image sur reho.st ou images.weserv.nl à partir du menu contextuel de l'image.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQAAAABbAUdZAAAALElEQVR42mP4DwQMaMQHg8P8EOLz%2F%2F%2FnIcR%2FOPEZpARGUEH2w2EefgiBxS0ARNpzyS9f0t0AAAAASUVORK5CYII%3D
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

Copyright © 2018-2021 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 2794 $

// historique :
// 3.0.0 (14/01/2021) :
// - possibilité de choisir entre reho.st et images.weserv.nl
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

/* ------------------------ */
/* les images et les icônes */
/* ------------------------ */

var iconSans = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAB%2FElEQVQ4y62SO2tUURSFv73PvZMxk2GIeZiHgvgIhBhfRUSwUDBW%2FgMtLARLSWHlH9DCnyBiaSumFOwUrGLCWPkiD0jIw0kyz3vP2RaTYWYSsNEFB86GfdZe66wN%2FwgBWHz5%2FoUZ9%2BqJZdMgR5usu1Y1YmevrjyanYsAzLh%2FfvbckMvnRVzmrxN9ErB6jeK7pQdAk6CeWI%2FL5WXh7Qa1ZJXt2icmpiPiTAkfjHKph88fdhg%2BfpOIEW4%2FnMJMBUABvAeJM6jC790FJi4oLlqmWl%2BlUf2Jyyxz8VqW7c0vOCfQYTNqXcwCqork9nFxhXp1B9EyUMOxRdwbU95fR0cVgscsHCYAEcFST5J6kAoSSqANDMN8FcwTRYp1fGoXgaoilQK1ciDqySDqwRI8BSpbWfp6TzR7RNuJtKMSRISBgct8W0iorEQ09oZp7I2w9z3P0seU0fGrRM51pdKMUQQC4IS%2B3GlODd1hbf4Jx7LrpD5g9QITN56Ty53BzGMdHtoWRGjs3iU0AqJG%2F%2B4GlyYnMTPWiz9YqTymtB%2FwwYDFQwTBEDNOzjxra5taI91cIfpVZPDpHINxlk67B0vcUmAHpwOFMSiMkZ6dObqOqt0KMpGWLKkW%2BsdvgQqEFqF0%2BW09tmoF1ebECMA5efN1vng9TW26Je1vUDWc8Jr%2FgT9jGdZbgZJ%2BWgAAAABJRU5ErkJggg%3D%3D";
var iconFull = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACKUlEQVQ4y62TTWsUQRCGn%2BqZ2Y9ZzGKWuIQoSAhBQ4IQIkQED4L4D7zoDxDBgwfBPyHBk6iI6EUEEcGz5KA3PyBEVBRCooSQj2V3s9nM7kxPl4dJdhOvWlDQdDdPvfV2NfxjCMCjVx%2FvutRcbXW00EmybUGyYwFR3buuKEo%2BUMI8T25cmbkFwIOXn9fbraZz1qqmejjd4Yysaivq6r3nn%2BoAPkArcvlCIZS5N1tEbFKXBSZPrFLK1UjUsVEv8X6xQlmnCRhi7vo4qTPSA3QTMMbHF6Hr%2FWZyeJVi4Rv1qEaSdskVS0yPj7HwZYBqoYpzve4xmROCCnieEOkahdwmtfYGO8k2290mW9EKQXGNerRMEHgoIJL54u%2BzUsAzBo0dnTQmsru04x06rkPqLEgMLiVnDNozdV8BoApGhBIjNFplHCG7LiZKuoiUaTYGqRRH8X0DKj2A3wO4rIWyf5Kfv1YZKi1zZCCgaGIaGwMsrYwyVjmN78negx4AOMApiBHKuWFGS%2Bf5Mf%2BM6uA7jIVce4qJM7cph8exqcVpn%2BDvy1eFD2tHsQ6sg7M7cOnUGA74vrTI48YMtgaJhZso7pAC5xCFaxfeAgZB8GZrtFrrhCvzHLt8nzt%2BkJVVRR04p395gKIKgqICNhzEhhWi6kTfZfra9WALYU6auLg8O3IRTN8g9MD6QCRJTOBlg%2BADFAJ58fD113Mdy1RGlt6k9Weu%2F6ECX8l7POV%2FxB%2FDRRbjiYtbHQAAAABJRU5ErkJggg%3D%3D";
var iconLargGran = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABv0lEQVQ4y82STWtTQRSGnzP3TpIb0rQJIZSKNoilSIqg4M6V%2BAOKontx51%2Fwr6hbEbRuhbrzB4hdaS1%2BoAs%2FSj40Hzd37sxxoWkazV7PamCYh%2Bc988K%2FHpke7j1%2BcdfG8fbIYb0XBDm6FQVQAkoUQQhu5%2FaNCzcB4inA2nj72uUz9WEmojhim2GMRxRcbnBZjNci1UrMo93XV4F5wChTO5xEcv%2F5R%2FLSHquNPYr2E5l3fOvVOXh3Fh2e5871LYIeic8APggiAmbE8tIHTPSG7uQ9aZ6CrVFdsnQHm%2Bgs9TwAIIgBcnzoM8gO6U06jH0X0ZRJ6CB4VAGdvTHHAapgSUjTBmleZugHDN0XUrdCNl6jXCj%2FWu4iA%2F1NTeJlOr0N8s4rkup3Cv4UXz9vkg22aKzU%2FvrGOYAPGS4cUokqdF%2BOWbXPMAGMW2ewUUOlQ2DteIIZIABIn0L5AXEitNpF2vYW8Y999pdP8La0C5pjohZBdYFBCBSLCedOXwERpOUYZyPicZ9m%2FSRNERSlXCqjYYFBycooiYrVdvPiXEl1LrFiKRCZBQYuz588fHpwaeJZ12lR5M%2FOK8YozuU7%2FDfzE%2B0PvACiZWk5AAAAAElFTkSuQmCC";
var iconMedPrev = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABYklEQVQ4y92Rv0scYRCGn9lbc3juuaDgoYKmyWEjaaOWNtY2kipiq42KhaWQMsGksBZLSWVpb2ejYmF7hxwo4nk%2F3Nv9vttvUojiwt0fkLzdMPM%2B7wwD%2F7zkfbH18%2FTXUDC4inpv3dQR5jxPjU1VxLWSuHO4v720%2Berx3wOCYOjbxnI5LBSKvYKkndjw4M%2FFKtAbgEhYKBS5qTU5q%2BwQDj8QGUv1fpT5ie98mZlEJJfZ2s%2F6oQt0nSMI7hkcGMGR4D5UuKtHOHWI6HBfgKo2VQlbkaEex6T6TNsmPEYxdRJQQZVmX4DpxqEqtGJHpfYJl7%2BmbSOe6tOUS%2FmeX%2FCyZR7n4KmT8rm0y1pjjMULj8WPP%2FB9HwVEpP8JqCIoV7frWGs5NwYzPoC5XsFay9eFc1SzkX52HVfV1EztLZ%2FwMqcZg7UWVBt9AVEUH%2F8%2BvpxzeLOeJwiECg1eIeJ4bneO%2BL%2F0F2ZFngSiQbBTAAAAAElFTkSuQmCC";
var iconThumb = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABAElEQVR42mNgGAUYoKh354TamYc%2B1M44AsEzj%2F0rn3L4b8XUgx8Ke3f0EzSgbuaR969ev%2Fr%2F5et3FPzi3af%2FQIPfEzZg1tF%2FIA3dBxz%2Bzzzu%2F7%2F3kMf%2F5FWG%2F19%2B%2BP4fKPeBoAH1s4%2F%2B%2BwA0IGdZ6v%2BstZb%2F41bo%2F%2Feb7vf%2F%2Bfuv%2F%2BtnH%2FlH0ICKaYf%2Fv%2Fn4%2Ff%2B8fXf%2Bn5nnD8a9m679f%2Fbu23%2BQ4YQNmHro%2F9uP3%2F4XLHL%2Fnz3X6X9Ut%2BH%2F0Dad%2F8%2Fegr1A2ICqqQcevnn34f%2FHLz%2F%2BfwDi95%2B%2Fg%2FErYCCCApigAQXdO7pqpx88XD39MDAKjyBF56EPoCgeTeiYAAAQA8BFxRnPewAAAABJRU5ErkJggg%3D%3D";
var iconConf = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAzRJREFUOMt1k11oHHUUxX%2F%2Fmdmd3SSbTXbTajfQgG1ikZqCzdem20hqUmoNNoigUqwWW4KFglKpIcXSNx%2BUgi%2B%2BiBUUP8AioRZFsGgtMaZJY9U01mo%2BKM1mYz73K93ZnZnrQ7YSHzxwH8%2B593LOUayDJxhRgBfwAw6wCgjgAzxADsgXknG5x9H4L4zdsda6jz98v%2BfM6b5uoBwoe7nnyJ5PP%2FqgJ7Yr%2BmBRiP8VaG5s2N4Wi9Ue6HoiCjQBTU8%2F1d0Z29Va17V%2FX7R44b9QxbON4pherzd2dfCHjlBlhUfXND%2BA40rOsix7d3vnlURi7lLxNQewdd0XMKMtzXXHeo60X%2Fv5euXpU70tjQ07%2FWs8sVwRC3B0XRcFgaGrI1bf6689kk5nnERiLqU8wUjo3HvvvrC347EHcrkcps%2Fnuq7kASYmp1zHcair3aoBaJryZrNZray0jO%2B%2Bv3z7%2BcNHz2kC7tfffHtn9Pqvyx6vmXVdWQXsvjfOZNs7Hx%2Fu2Nc13HvqdBawXVdW%2Ff6S7F%2BTU8mBwaE5AZRRHvEC96No%2B3P8l1rTNNXExKS0790%2FJMIwgFLsvNh%2FvqX%2B4e1aJpORh3Y0TCFcAWYMFK6Cu8BqoVBwTNMUw2MoBRkUSQAFmRK%2F3wUcj8ejFCyJYgUo6LovUHri1ePtZ996c0c4XJUHnMqKoFi53IaRa6OrCjb2HD3c2n3gSQOwDcNwO%2FY8Wq3AGRsbnzUEzMimTRurq6uzCwuLbjgcRgT6ek%2BWHXzumS6AmpoaHNe9C5DJZlV9fb3MzMS3fvLZ56O65gvoN8Z%2Fl9%2FGbpgnTvblRaQ02tyUFxErWFFhB4PBgiuSA9y3z75jHDv%2BSvLOzEzq%2FBf9NxeXluLKKI8YQKCYf39JqT86cPlSZTgUkvWJW1hYVI2tbfOO7YwAVjFMSc1OxW2BpMAcivmXXjwk4VDI%2FnHwJ7V5y7b85i3bnJt%2F3JKqqrB96OCzNoqEQFxg2U7FbR1ArLSIlRbNF9D%2Bnl%2Fw5iwr3H%2Fhy5Xp6dsDwHQyndowO5tQFy5%2BdWt5ZWXWScULYqWl6NC6JpVHdKACCLFm7XyxcPcVS7TE2mbnHucfEGJoU7krLCIAAAAASUVORK5CYII%3D"
var iconRehost = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuklEQVR42u2XTUsCYRCAtaMdpLOeFeyHRCR16lB066jXIIIi7CBEEEGRXYpOQXSIiqBDWqFSCH3tCuUxqtsaBJG6rdNMjKHruom7rgb7wgMy7M4874fLvA6HPaoGADgRF%2BJBfEjAJPyck3I79Yr3IUPIOpJC7hHRIALninFuqtGjJeDiB04RCSkhZZOQkTwS5xouLQEPz1zil9ox8rwSXi0BHy%2BVDO0blDvNZ8KpFgjwnv%2FOfmA2UcPq4SMUZQUOLp9havMGRqNJGJxLQHD%2BDMYWU7C8%2F9CMhMC1NAVEPYGZ7TuYXLmqi1c4zrw0I5BF%2BlsS0GMcV6CEq2OZwPTWLawd5SCyI8DIwgXsJZ%2BaPQfGBIYj55DJSTUZ3z9K8Fn8skbg5PrV6D%2BhdYGJpTQoSrlzAtHdrBnfgtYF6DtgC9gCXS1QKBQgHA6D2%2B3%2BgX5TzDKBUCgElKoailkmQLNWC1DsXwkIRgRoz9UCFFMNsVFDUteSteEQ6rZkHm4YO9aUVtryOD9oZnNKzcIbkkCCSO9fF5MYL5XAh8YIIufa4OLaFxPV1czL%2BxTgE2sUP%2BdsfDVrIGMaXXsh%2FgYxMyaxXsAjHwAAAABJRU5ErkJggg%3D%3D";
var iconWeserv = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAADTElEQVR42mP4T2PAQCcL9sfNXq5cRjl6uPkCdguAcuvMGg8mzyMb7QqYBDTk8sTdOC0AKqIkKN5efER9C16euPN41xVaWfDu2lNIuB%2FOWEgTC4Buh1iw1rCeJhb8%2FPjtRNkqoOn31pwm04INVq37omfQKpIPpS1crgQKgStT9mA18cH6c%2BRbcDRnCVDkQPK8LS5dQMbVaXvRtB0vXQkUB5LkWHAEbPqR7MVA9qf7rzc7dQK516bvh%2Bu5vfQ4KHpVy4HkneUnSLPgaC7CdAj4dPfVJocOkB0zD8BNX2vUcHv5ibVG9UD23ZUnibUAYvrh7EVw6UWLFuXm5mYlpvlJW3vym4TpewBJHzGL9KikgoICIAlkA0USvSMzY1KAjBj7oAIwmDx5MroFGyxb0NwOBM7OzsLCwoaGhvrauiqCssp8Usr80nqaOoYwAGSrCMgAxTXkVIGklrwaUFBcXFxFRQXFgmXgLINmOsSCpKQkaMFw9PbOwMk7%2FSc%2B2HgeJUtffbonYjpQHIhug6OkqakJ3QKg6Xsjp2OmRWQLQAF96fGBxLlAg9CK5XdXnsxwrYzV8JxW3InTAqw5Gc0CIPh499X%2BhDkgf2xBsSPCO5iBgYGXi%2Bf9%2B%2FfYLdji1HV99kE0ZKFpFOrkd3%2F9WTjaP33jjTmH9oSDwgSoAC6%2BoGgC0IIgO2%2FsPlhv3oy1htLhlHeTMYOELxBNti9hY2atNIkHsnfABJHRg43nsFvw%2FdUnYOGOiWxNrKIDw99dfgxEZ7YeVpZX5OTg5OPh3blkI0QQLpUdnw5kQEzDYgEuAI%2BDO3fuqKura2hoXLx40cbGBph2T548CY35t2%2Fl5eWB4dPY2EimBRDTgQDIAAoCo9HKykpMTOz06dNA0y0sLIAJPzY2FmjHhAkTSLYgNDQU6HC46XBXQ8zV1dUFkkCbgILFxcVAOyZOnEiCBfb29gICAmpqardv30aTevTokZCQEBMT09KlS%2BGChYWFQDu8vb1J8AHQjZimQ8D9%2B%2Ff19PRkZGSAEQMXBBZEQDuAgqRFMi7w%2FPlzYOEjJyd3%2BfJluGBMTAwJPgC6sQYvADoZGA1KSkrl5eUQEVtbW2ItAIapFhFAAwyQRaKjo%2Bnb%2BKUdAAB3wjLfKhLqdgAAAABJRU5ErkJggg%3D%3D";
var saveImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACdklEQVR42q2TX0iTYRTGz1UXCRIMMWOIbKi4pJSU%2FWEbTpnQNowxYyYW1Ihwig4klGijDAtn1IaTqTTRiTbcaAqFCS4skUAkuuvPRxGCIypsoOz26XwftBZkVx544L14f8857znnJTrsqIyTUjFP3tIoCUWPaE82wQqTIAuRtzBAyv%2FC5TFyyKOUNkbluJFyY3jdK2lgtRO14WOgIUrTIDn%2BCXNWR%2FE07V9ZsiG06Uffi6uwLzVKEs%2FBzWF0LDSB%2Bmif9bdJWZQUxRHaEWHxYnOyHqZELfQLp2FkNbDM8TMIvL6LC3MmkJt26BopcgbyCPm0UyVSZhEWQW3sJNTzVVDPVUI3V4XI1iisMQ2CbKIYPAK6TL6cQdEECQOpTnhSLpjiNdA8VjFYAc0sK1qB6TdhZDIZvN3eQs%2BzDvQtdYDaSMgZHA1Q9v7GLbQk9TDEqrmSEax%2BXIZ2pgpTW2MS%2FGP3O3qeXoR1pgbDqQGQjbJ%2FmnCPsv51H2wJLVoSBnz%2B%2BkmCPqTf5WD3Yht04VJYIqfgT%2FWDmvMNBkm4vuxC78olGGdVcMbN2P72RYJ3f%2B7C%2FeQ86kMl0LNBV7IVvTEnqCnvCXSTfKqRAgQ27sA8o4IuokTrfAPW3q%2BgZ7EddaPHoQ6egDFUhsBLHwo9BGrMayJ5eCQ8GmdUjwevbqNxshyG8TJox%2BTQBEWJcCkernlhG6sB6XiMurwxSuHi5WinfXukHkE26U46YZmsxtlxFbr5CQGGLaFqUB0vku6AbWQDB9kpLesn9CacGHruwdCyB%2B6YHQVdXLaaV1l7EPw7zvGHsZKXuyyQgfYY2OOMAsvL2ZWH%2Fnt%2FATnRYAIAzln5AAAAAElFTkSuQmCC";
var closeImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABzElEQVR42p2Sz0sCURDHH%2BbiU9ToB4LiD8Iu8ihQKBI0WEEUwYMdOkiXLp0i69CpDkERUVBQRBAUHTp0MCEKCipJi37QD%2Bj%2FWZlmXhpKu0UNPHaWt5%2BZ73xnGftjXPn9NsPLh3g8gEcY3V%2F6%2FeLM6y0cu93DuvBTIgGPqgp3g4NCD74OBKASCsGhy3W0390d%2Bga%2FZrPy3A8NQbWv76vIuc8nsADcRiLwkskA5dudnYU1p9PUKMDvo9HaczoN7%2Fk8UDEsANiRJEu4Gg4D3ddhbdXhUFok3g4M8Gp%2Fv%2FYQi8FbLgf0LPf0AHaXxZ6SSZlvtrcTzHVNwvk4QhpJpVGoI4GkCJXABsIrRnCTWfzU6609p1JwgR0xBxwR1p3O2q8wxYnHQ3PLbWAOJTzoD80N81ar%2BBHGjwV1vOntlR4QiCuV7hfdbliy22FaUYQhTB3LwaAEqTOapS3a7TXcOVSEgAOXC2YtFhhnrLUI%2Flmi1ATjO6x8wnzOauUziqJtdXRIZTs4ymRbG4w2F8E%2FSyWI1laswws225dhCPAJk4nWB7tdXTBlNsMIY2qLCjRJ3UOpyygZzfrm9hhjPM%2BYpgs3Ak1S9eBGoGxuCP83PgCikeJyFDsSMAAAAABJRU5ErkJggg%3D%3D";
var helpImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACmUlEQVR42q2TX0haYRjGz8XYxW53s6sgbVQUiQ6i2IgxmIxgBDkKpAXRaCPZqFgsFhaFUrEoCIqkRDkjxTA0jEZSoigpiZKxMPzEKDwHQUnxz6Fo8exMhhFEV33wu%2FueHzwv70tR9%2F0s%2B5dCc%2FBCafKfE8Mel%2FvpzeV0nixZdqWVi44z4Z1ho5%2BTrfgKbCh%2BiYNTDsFYtkjopABftIDpDZadXI%2FLbg3TuzmZ1p3JHzLncP5OQr1KIJ%2F1o216D4P0AWw%2BFoHjLL4bSH6QProp0TjTgoWdFHMQ57DuT6CFDw3QIZAEh0iigNmNKKRqN%2FQ7x%2FBG0uhZ2Ge65gKCkmBmkx3ZJTlsh1JonvDi5bAThYsrHvznCi0TLkjHHFjzMjDvMmhVu0dKgtHVYxLguw7Rh2gadqBxaBuELWBxKwqj5wQcLzB6YhD1WdCz6IM7nMSrITspCfp1YS4Yy6BZ5ULDNzvEAzb%2BsxVL9giS2QucJjkoVwKo6TWj4asVvsgZxAorVxJ0zwW4QDSD1%2BMuiPqtqPtiQe1nCzLcHxwxWUgUZlR2G%2FCUR6IwwUtSKO80Xgtkag%2FxHKWg0AQg7rOhVrGG6k%2BrqPpgLFLxnkZFhw6CDi3a1Fuwhxg8btVeV%2BD7jOjsUVh9DBr6baVgIn0O5oxDmXy5SIVcA3onAhVf54F0%2FnqIEsW6oO7jGrPpZ6DfJhD1miDo1KN3zlHkX7i8fR5TpiBMriioplmGej4juLELZfIV2ZN2Om%2FxnsDojuGdahPVXVpUdizhrdIKvT0Mg5OAqv%2BRp55N3r6Nj5o1sodvFthReg%2B%2FgnG4wokiG%2F5TDGo8oMRqlqpTye6%2BphczQqpxWknVTxFKMpGjROocVTtOqJoxJVU1Krz36%2F0Lr2rVjUwVEAIAAAAASUVORK5CYII%3D";
var infoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABG0lEQVR42mNgoAZwrZy1C4jfAfFrIjFI7SpkAz4D8X907FEzF4yxyQHxC2QDPiBLupTP%2BO9Xv%2BD%2FjN2X%2Fs%2Fae%2Fm%2FX8MCsBiaAc9wGuBYNv1%2F9vQt%2F2Egb8ZWsBjRBoBscyqb8b9j3bH%2F03dd%2BB%2FQtJB4F4AUhrUu%2Bd%2B%2F5dT%2FvTde%2Fd917fn%2FxL41%2F52INQCkMGXiuv%2F3v8B98D99ykbSvOAOxIWztyMMmLQR6KXppAUiyNm%2FyDUApDiuZ9X%2F70DNf4E4qX8d6bEwC5gGYGDW7sukpQMXIC6Ytf3%2FpvOP%2Fm%2B68AjI3orNgKfIBnxxr5r9HxmDkrB37TwwBrHR5YGWvIQbIBJcvkc6ouatdFjVa6JwRM07kcCy1VTJyQAWb%2BM0%2Fl9lTAAAAABJRU5ErkJggg%3D%3D";

/* -------------- */
/* les constantes */
/* -------------- */

const REHOST_URL = "https://reho.st/";
const WESERV_URL = "https://images.weserv.nl/?n=-1&default=i.imgur.com/Q9fqKbD.png";
const MENU_ID = "gm_rst_r21_rehost_menu_id";
const GIF_REGEXP = /.*\.gif([&?].*)?$/i;

/* ------------------------- */
/* les paramètres par défaut */
/* ------------------------- */

const rstChoiceDefault = "rehost"; // "rehost" ou "weserv"
const rstSansDefault = "2"; // "1", "2" ou "0"
const rstFullDefault = "2"; // "1", "2" (obligatoire)
const rstLargeDefault = "2"; // "1", "2" ou "0"
const rstGrandDefault = "2"; // "1", "2" ou "0"
const rstMoyenDefault = "2"; // "1", "2" ou "0"
const rstPreviewDefault = "2"; // "1", "2" ou "0"
const rstThumbDefault = "2"; // "1", "2" ou "0"
const rstConfDefault = "2"; // "1", "2" ou "0" si gmMenu sinon  "1", "2"
const rstOptionsDefault = true; // true ou false
const rstIconsDefault = true; // true ou false
const rstNotifsDefault = true // true ou false
const rstLinkDefault = "image"; // "image" ou "page"
const rstReturnDefault = true; // true ou false

/* ---------------------- */
/* les variables globales */
/* ---------------------- */

var currentRstChoice;
var currentRstSans;
var currentRstFull;
var currentRstLarge;
var currentRstGrand;
var currentRstMoyen;
var currentRstPreview;
var currentRstThumb;
var currentRstConf;
var currentRstOptions;
var currentRstIcons;
var currentRstNotifs;
var currentRstLink;
var currentRstReturn;
var currentImageUrl;
var currentIsGif;

/* -------------------------------- */
/* les fonctions du menu contextuel */
/* -------------------------------- */

function doRst(e, type) {
  let rehostLink = "";
  let rehostImage = "";
  let rehostSize = "";
  let rehostParam = "";
  let messageType = "";
  let imageUrl = "";
  let iconImage = "";
  switch (type) {
    case "sans":
      rehostLink = "";
      rehostSize = "";
      rehostParam = "";
      imageUrl = currentImageUrl;
      messageType = "de l'image sans rehost ";
      break;
    case "full":
      if(currentRstChoice === "rehost") {
        rehostLink = REHOST_URL + (currentRstLink === "image" ? "" : "view/");
        rehostImage = REHOST_URL;
        rehostSize = "";
        rehostParam = "";
        messageType = "de l'image ";
        imageUrl = currentImageUrl;
        iconImage = iconRehost;
      } else {
        rehostLink = WESERV_URL;
        rehostImage = WESERV_URL;
        rehostSize = "";
        rehostParam = "&url=";
        messageType = "de l'image ";
        imageUrl = encodeURIComponent(currentImageUrl);
        iconImage = iconWeserv;
      }
      break;
    case "large":
      if(currentRstChoice === "rehost") {
        rehostLink = REHOST_URL + (currentRstLink === "image" ? "" : "view/");
        rehostImage = REHOST_URL;
        rehostSize = "medium/";
        rehostParam = "";
        messageType = "de l'image moyenne ";
        imageUrl = currentImageUrl;
        iconImage = iconRehost;
      } else {
        rehostLink = WESERV_URL;
        rehostImage = WESERV_URL;
        rehostSize = "&w=1200&we";
        rehostParam = "&url=";
        messageType = "de l'image large ";
        imageUrl = encodeURIComponent(currentImageUrl);
        iconImage = iconWeserv;
      }
      break;
    case "grand":
      if(currentRstChoice === "rehost") {
        rehostLink = REHOST_URL + (currentRstLink === "image" ? "" : "view/");
        rehostImage = REHOST_URL;
        rehostSize = "medium/";
        rehostParam = "";
        messageType = "de l'image moyenne ";
        imageUrl = currentImageUrl;
        iconImage = iconRehost;
      } else {
        rehostLink = WESERV_URL;
        rehostImage = WESERV_URL;
        rehostSize = "&w=1000&we";
        rehostParam = "&url=";
        messageType = "de l'image grande ";
        imageUrl = encodeURIComponent(currentImageUrl);
        iconImage = iconWeserv;
      }
      break;
    case "moyen":
      if(currentRstChoice === "rehost") {
        rehostLink = REHOST_URL + (currentRstLink === "image" ? "" : "view/");
        rehostImage = REHOST_URL;
        rehostSize = "medium/";
        rehostParam = "";
        messageType = "de l'image moyenne ";
        imageUrl = currentImageUrl;
        iconImage = iconRehost;
      } else {
        rehostLink = WESERV_URL;
        rehostImage = WESERV_URL;
        rehostSize = "&w=800&we";
        rehostParam = "&url=";
        messageType = "de l'image moyenne ";
        imageUrl = encodeURIComponent(currentImageUrl);
        iconImage = iconWeserv;
      }
      break;
    case "preview":
      if(currentRstChoice === "rehost") {
        rehostLink = REHOST_URL + (currentRstLink === "image" ? "" : "view/");
        rehostImage = REHOST_URL;
        rehostSize = "preview/";
        rehostParam = "";
        messageType = "de l'aperçu ";
        imageUrl = currentImageUrl;
        iconImage = iconRehost;
      } else {
        rehostLink = WESERV_URL;
        rehostImage = WESERV_URL;
        rehostSize = "&w=600&we";
        rehostParam = "&url=";
        messageType = "de l'aperçu ";
        imageUrl = encodeURIComponent(currentImageUrl);
        iconImage = iconWeserv;
      }
      break;
    case "thumb":
      if(currentRstChoice === "rehost") {
        rehostLink = REHOST_URL + (currentRstLink === "image" ? "" : "view/");
        rehostImage = REHOST_URL;
        rehostSize = "thumb/";
        rehostParam = "";
        messageType = "de la vignette ";
        imageUrl = currentImageUrl;
        iconImage = iconRehost;
      } else {
        rehostLink = WESERV_URL;
        rehostImage = WESERV_URL;
        rehostSize = "&w=230&h=230&we";
        rehostParam = "&url=";
        messageType = "de la vignette ";
        imageUrl = encodeURIComponent(currentImageUrl);
        iconImage = iconWeserv;
      }
      break;
  }
  let addReturn = currentRstReturn ? "\n" : "";
  if(e.shiftKey) {
    GM.setClipboard(rehostImage + rehostSize + rehostParam + imageUrl + addReturn);
    if(gmNotif && currentRstNotifs) {
      GM.notification({
        text: "Le lien " + messageType + "a été copié dans le presse-papiers.",
        title: "Rehost",
        image: iconImage,
        timeout: 3500,
      });
    }
  } else if(e.ctrlKey) {
    GM.setClipboard("[img]" + rehostImage + rehostSize + rehostParam + imageUrl + "[/img]" + addReturn);
    if(gmNotif && currentRstNotifs) {
      GM.notification({
        text: "Le BBCode sans lien " + messageType + "a été copié dans le presse-papiers.",
        title: "Rehost",
        image: iconImage,
        timeout: 3500,
      });
    }
  } else {
    GM.setClipboard("[url=" + rehostLink + rehostParam + imageUrl + "][img]" +
      rehostImage + rehostSize + rehostParam + imageUrl + "[/img][/url]" + addReturn);
    if(gmNotif && currentRstNotifs) {
      GM.notification({
        text: "Le BBCode " + messageType + "a été copié dans le presse-papiers.",
        title: "Rehost",
        image: iconImage,
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

function doRstLinkToImage() {
  currentRstLink = "image";
  GM.setValue("rst_link", currentRstLink).then(createRehostMenu);
}

function doRstLinkToPage() {
  currentRstLink = "page";
  GM.setValue("rst_link", currentRstLink).then(createRehostMenu);
}

function doRstReturn() {
  currentRstReturn = !currentRstReturn;
  GM.setValue("rst_return", currentRstReturn).then(createRehostMenu);
}

/* ------------------------------- */
/* construction du menu contextuel */
/* ------------------------------- */

function createRehostMenu() {
  // correction de currentRstConf si pas de gmMenu
  let localCurrentRstConf = currentRstConf;
  if(!gmMenu && localCurrentRstConf === "0") {
    localCurrentRstConf = "2";
  }
  // correction de currentRstNotifs si pas de gmNotif
  let localCurrentRstNotifs = currentRstNotifs;
  if(!gmNotif) {
    localCurrentRstNotifs = false;
  }
  // correction de currentRstLink si pas reho.st
  let localCurrentRstLink = currentRstLink;
  if(currentRstChoice !== "rehost") {
    localCurrentRstLink = "image";
  }
  // correction de currentRstLarge et currentRstGrand si reho.st
  let localCurrentRstLarge = currentRstLarge;
  let localCurrentRstGrand = currentRstGrand;
  if(currentRstChoice === "rehost") {
    localCurrentRstLarge = "0";
    localCurrentRstGrand = "0";
  }
  // correction de currentRstMoyen, currentRstPreview et currentRstThumb si currentIsGif
  let localCurrentRstMoyen = currentRstMoyen;
  let localCurrentRstPreview = currentRstPreview;
  let localCurrentRstThumb = currentRstThumb;
  if(currentIsGif) {
    localCurrentRstMoyen = "0";
    localCurrentRstPreview = "0";
    localCurrentRstThumb = "0";
  }
  // suppression de l'ancien menu contextuel
  let oldMenu = document.getElementById(MENU_ID);
  if(oldMenu) oldMenu.parentNode.removeChild(oldMenu);
  // nouveau menu contextuel
  let rehostMenu = document.createElement("menu");
  rehostMenu.setAttribute("id", MENU_ID);
  rehostMenu.setAttribute("type", "context");
  // nouveau sous-menu
  let rehostSubMenu = document.createElement("menu");
  rehostSubMenu.setAttribute("label", "Rehost");
  // rehost sans
  if(currentRstSans !== "0") {
    let rehostMenuItemSans = document.createElement("menuitem");
    rehostMenuItemSans.setAttribute("label", "Rehost sans rehost");
    if(currentRstIcons) {
      rehostMenuItemSans.setAttribute("icon", iconSans);
    }
    rehostMenuItemSans.addEventListener("click", doRstSans, false);
    if(currentRstSans === "1") {
      rehostMenu.appendChild(rehostMenuItemSans);
    } else {
      rehostSubMenu.appendChild(rehostMenuItemSans);
    }
  }
  // rehost full (obliatoire)
  let rehostMenuItemFull = document.createElement("menuitem");
  rehostMenuItemFull.setAttribute("label", "Rehost taille originale" + (currentIsGif ? " (gif)" : ""));
  if(currentRstIcons) {
    rehostMenuItemFull.setAttribute("icon", iconFull);
  }
  rehostMenuItemFull.addEventListener("click", doRstFull, false);
  if(currentRstFull === "1") {
    rehostMenu.appendChild(rehostMenuItemFull);
  } else {
    rehostSubMenu.appendChild(rehostMenuItemFull);
  }
  // rehost large
  if(localCurrentRstLarge !== "0") {
    let rehostMenuItemLarge = document.createElement("menuitem");
    rehostMenuItemLarge.setAttribute("label", "Rehost large (1200px)");
    if(currentRstIcons) {
      rehostMenuItemLarge.setAttribute("icon", iconLargGran);
    }
    rehostMenuItemLarge.addEventListener("click", doRstLarge, false);
    if(localCurrentRstLarge === "1") {
      rehostMenu.appendChild(rehostMenuItemLarge);
    } else {
      rehostSubMenu.appendChild(rehostMenuItemLarge);
    }
  }
  // rehost grand
  if(localCurrentRstGrand !== "0") {
    let rehostMenuItemGrand = document.createElement("menuitem");
    rehostMenuItemGrand.setAttribute("label", "Rehost grand (1000px)");
    if(currentRstIcons) {
      rehostMenuItemGrand.setAttribute("icon", iconLargGran);
    }
    rehostMenuItemGrand.addEventListener("click", doRstGrand, false);
    if(localCurrentRstGrand === "1") {
      rehostMenu.appendChild(rehostMenuItemGrand);
    } else {
      rehostSubMenu.appendChild(rehostMenuItemGrand);
    }
  }
  // rehost moyen
  if(localCurrentRstMoyen !== "0") {
    let rehostMenuItemMoyen = document.createElement("menuitem");
    rehostMenuItemMoyen.setAttribute("label", "Rehost moyen (800px)");
    if(currentRstIcons) {
      rehostMenuItemMoyen.setAttribute("icon", iconMedPrev);
    }
    rehostMenuItemMoyen.addEventListener("click", doRstMoyen, false);
    if(localCurrentRstMoyen === "1") {
      rehostMenu.appendChild(rehostMenuItemMoyen);
    } else {
      rehostSubMenu.appendChild(rehostMenuItemMoyen);
    }
  }
  // rehost preview
  if(localCurrentRstPreview !== "0") {
    let rehostMenuItemPreview = document.createElement("menuitem");
    rehostMenuItemPreview.setAttribute("label", "Rehost aperçu (600px)");
    if(currentRstIcons) {
      rehostMenuItemPreview.setAttribute("icon", iconMedPrev);
    }
    rehostMenuItemPreview.addEventListener("click", doRstPreview, false);
    if(localCurrentRstPreview === "1") {
      rehostMenu.appendChild(rehostMenuItemPreview);
    } else {
      rehostSubMenu.appendChild(rehostMenuItemPreview);
    }
  }
  // rehost thumb
  if(localCurrentRstThumb !== "0") {
    let rehostMenuItemThumb = document.createElement("menuitem");
    rehostMenuItemThumb.setAttribute("label", "Rehost vignette (230px)");
    if(currentRstIcons) {
      rehostMenuItemThumb.setAttribute("icon", iconThumb);
    }
    rehostMenuItemThumb.addEventListener("click", doRstThumb, false);
    if(localCurrentRstThumb === "1") {
      rehostMenu.appendChild(rehostMenuItemThumb);
    } else {
      rehostSubMenu.appendChild(rehostMenuItemThumb);
    }
  }
  // hr 1
  if((currentRstSans === "2" ||
      currentRstFull === "2" ||
      localCurrentRstLarge === "2" ||
      localCurrentRstGrand === "2" ||
      localCurrentRstMoyen === "2" ||
      localCurrentRstPreview === "2" ||
      localCurrentRstThumb === "2") &&
    localCurrentRstConf === "2") {
    rehostSubMenu.appendChild(document.createElement("hr"));
  }
  // configuration
  if(localCurrentRstConf !== "0") {
    let rehostMenuItemConf = document.createElement("menuitem");
    if(currentRstIcons) {
      rehostMenuItemConf.setAttribute("icon", iconConf);
    }
    rehostMenuItemConf.addEventListener("click", doRstConf, false);
    if(localCurrentRstConf === "1") {
      rehostMenuItemConf.setAttribute("label", "Configuration de Rehost");
      rehostMenu.appendChild(rehostMenuItemConf);
    } else {
      rehostMenuItemConf.setAttribute("label", "Configuration");
      rehostSubMenu.appendChild(rehostMenuItemConf);
    }
  }
  // hr 2
  if((currentRstSans === "2" ||
      currentRstFull === "2" ||
      localCurrentRstLarge === "2" ||
      localCurrentRstGrand === "2" ||
      localCurrentRstMoyen === "2" ||
      localCurrentRstPreview === "2" ||
      localCurrentRstThumb === "2" ||
      localCurrentRstConf === "2") &&
    currentRstOptions) {
    rehostSubMenu.appendChild(document.createElement("hr"));
  }
  // options
  if(currentRstOptions) {
    // option icons
    let rehostMenuItemIcons = document.createElement("menuitem");
    rehostMenuItemIcons.setAttribute("type", "checkbox");
    if(currentRstIcons) {
      rehostMenuItemIcons.checked = true;
    }
    rehostMenuItemIcons.setAttribute("label", "Afficher les icônes");
    rehostMenuItemIcons.addEventListener("click", doRstIcons, false);
    rehostSubMenu.appendChild(rehostMenuItemIcons);
    // option notifications
    let rehostMenuItemNotifs = document.createElement("menuitem");
    rehostMenuItemNotifs.setAttribute("type", "checkbox");
    if(localCurrentRstNotifs) {
      rehostMenuItemNotifs.checked = true;
    }
    if(!gmNotif) {
      rehostMenuItemNotifs.disabled = true;
    }
    rehostMenuItemNotifs.setAttribute("label", "Notifications");
    rehostMenuItemNotifs.addEventListener("click", doRstNotifs, false);
    rehostSubMenu.appendChild(rehostMenuItemNotifs);
    // option lien image
    let rehostMenuItemLinkToImage = document.createElement("menuitem");
    rehostMenuItemLinkToImage.setAttribute("type", "radio");
    rehostMenuItemLinkToImage.setAttribute("radiogroup", "gm_rst_r21_rehost_link_to");
    if(localCurrentRstLink === "image") {
      rehostMenuItemLinkToImage.checked = true;
    }
    rehostMenuItemLinkToImage.setAttribute("label", "Lien vers l'image");
    rehostMenuItemLinkToImage.addEventListener("click", doRstLinkToImage, false);
    rehostSubMenu.appendChild(rehostMenuItemLinkToImage);
    // option lien page
    let rehostMenuItemLinkToPage = document.createElement("menuitem");
    rehostMenuItemLinkToPage.setAttribute("type", "radio");
    rehostMenuItemLinkToPage.setAttribute("radiogroup", "gm_rst_r21_rehost_link_to");
    if(localCurrentRstLink !== "image") {
      rehostMenuItemLinkToPage.checked = true;
    }
    rehostMenuItemLinkToPage.setAttribute("label", "Lien vers la page");
    rehostMenuItemLinkToPage.addEventListener("click", doRstLinkToPage, false);
    rehostSubMenu.appendChild(rehostMenuItemLinkToPage);
    if(currentRstChoice !== "rehost") {
      rehostMenuItemLinkToImage.disabled = true;
      rehostMenuItemLinkToPage.disabled = true;
    }
    // option retour
    let rehostMenuItemReturn = document.createElement("menuitem");
    rehostMenuItemReturn.setAttribute("type", "checkbox");
    if(currentRstReturn) {
      rehostMenuItemReturn.checked = true;
    }
    rehostMenuItemReturn.setAttribute("label", "Ajouter un retour");
    rehostMenuItemReturn.addEventListener("click", doRstReturn, false);
    rehostSubMenu.appendChild(rehostMenuItemReturn);
  }
  // ajout du sous-menu
  if(currentRstSans === "2" ||
    currentRstFull === "2" ||
    localCurrentRstLarge === "2" ||
    localCurrentRstGrand === "2" ||
    localCurrentRstMoyen === "2" ||
    localCurrentRstPreview === "2" ||
    localCurrentRstThumb === "2" ||
    localCurrentRstConf === "2" ||
    currentRstOptions) {
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
}

/* --------------------------------------- */
/* création de la fenêtre de configuration */
/* --------------------------------------- */

// styles css pour la fenêtre de configuration
var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  "#gm_rst_r21_help_window{position:fixed;width:200px;height:auto;background-color:#e3ebf5;z-index:10003;" +
  "visibility:hidden;border:2px solid #6995c3;border-radius:8px;padding:4px 7px 5px;" +
  "font-family:Verdana,Arial,Sans-serif,Helvetica;font-size:11px;font-weight:bold;text-align:justify;}" +
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
  "#gm_rst_r21_config_window div.gm_rst_r21_table{display:table;width:100%;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_table div.gm_rst_r21_cell{display:table-cell;width:50%;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_table div.gm_rst_r21_left{text-align:right;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_table div.gm_rst_r21_right{text-align:left;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_table div.gm_rst_r21_cell input[type=\"radio\"]{margin:0 4px 1px;" +
  "vertical-align:text-bottom;}" +
  "#gm_rst_r21_config_window img{position:static;display:inline;width:auto;height:auto;}" +
  "#gm_rst_r21_config_window input{display:inline;width:auto;height:auto;}" +
  "#gm_rst_r21_config_window label{font-weight:normal;display:inline;}" +
  "#gm_rst_r21_config_window label:before{content:none;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_main_title{font-size:16px;text-align:center;font-weight:bold;" +
  "margin:0 0 14px;cursor:default;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row{font-size:12px;margin:0 0 6px;display:flex;cursor:default;" +
  "flex-direction:row;align-items:flex-end;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row:last-child{margin:0;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell{}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell:first-of-type{width:45%;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell img{vertical-align:text-bottom;" +
  "margin:0 8px 0 0;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell input[type=\"radio\"]" +
  "{vertical-align:text-bottom;margin:0 4px 1px 32px;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_row div.gm_rst_r21_cell input[type=\"radio\"]:first-of-type" +
  "{margin-left:0;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p{font-size:12px;margin:0 0 6px;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p:last-child{margin:0;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p input[type=\"radio\"]{vertical-align:text-bottom;margin:0 4px 1px;}" +
  "#gm_rst_r21_config_window p.gm_rst_r21_p input[type=\"checkbox\"]{vertical-align:text-bottom;" +
  "margin:0 8px 1px 0;}" +
  "#gm_rst_r21_config_window *.gm_rst_r21_disabled{color:#808080;}" +
  "#gm_rst_r21_config_window *.gm_rst_r21_disabled *{color:#808080;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div{text-align:right;margin:16px 0 0;cursor:default;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div div.gm_rst_r21_info_reload_div{float:left;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div div.gm_rst_r21_info_reload_div img" +
  "{vertical-align:text-bottom;}" +
  "#gm_rst_r21_config_window div.gm_rst_r21_save_close_div > img{margin-left:8px;cursor:pointer;}" +
  "#gm_rst_r21_config_window img.gm_rst_r21_help_button{margin-right:1px;cursor:help;}";
document.getElementsByTagName("head")[0].appendChild(style);

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
configBackground.setAttribute("id", "gm_rst_r21_config_background");
configBackground.addEventListener("click", hideConfigWindow, false);
configBackground.addEventListener("transitionend", backgroundTransitionend, false);
document.body.appendChild(configBackground);
configBackground.style.visibility = "hidden";

// création de la fenêtre de configuration
var configWindow = document.createElement("div");
configWindow.setAttribute("id", "gm_rst_r21_config_window");
document.body.appendChild(configWindow);
configWindow.style.visibility = "hidden";

// titre de la fenêtre de configuration
var mainTitle = document.createElement("div");
mainTitle.setAttribute("class", "gm_rst_r21_main_title");
mainTitle.textContent = "Configuration du script Rehost";
configWindow.appendChild(mainTitle);

// section du choix du serveur
var choiceFieldset = document.createElement("fieldset");
var choiceLegend = document.createElement("legend");
choiceLegend.textContent = "Choix du serveur";
choiceFieldset.appendChild(choiceLegend);
configWindow.appendChild(choiceFieldset);

// table des serveurs
var choiceDiv = document.createElement("div");
choiceDiv.setAttribute("class", "gm_rst_r21_table");
choiceFieldset.appendChild(choiceDiv);

// block rehost
var choiceRehostDiv = document.createElement("div");
choiceRehostDiv.setAttribute("class", "gm_rst_r21_cell gm_rst_r21_left");
var choiceRehostLabel = document.createElement("label");
choiceRehostLabel.textContent = "reho.st ";
choiceRehostLabel.setAttribute("for", "gm_rst_r21_choice_rehost_radio");
choiceRehostDiv.appendChild(choiceRehostLabel);
var choiceRehostRadio = document.createElement("input");
choiceRehostRadio.setAttribute("type", "radio");
choiceRehostRadio.setAttribute("id", "gm_rst_r21_choice_rehost_radio");
choiceRehostRadio.setAttribute("name", "gm_rst_r21_choice_radios");
choiceRehostRadio.addEventListener("change", updateChoice, false);
choiceRehostDiv.appendChild(choiceRehostRadio);
choiceDiv.appendChild(choiceRehostDiv);

// block weserv
var choiceWeservDiv = document.createElement("div");
choiceWeservDiv.setAttribute("class", "gm_rst_r21_cell gm_rst_r21_right");
var choiceWeservRadio = document.createElement("input");
choiceWeservRadio.setAttribute("type", "radio");
choiceWeservRadio.setAttribute("id", "gm_rst_r21_choice_weserv_radio");
choiceWeservRadio.setAttribute("name", "gm_rst_r21_choice_radios");
choiceWeservRadio.addEventListener("change", updateChoice, false);
choiceWeservDiv.appendChild(choiceWeservRadio);
var choiceWeservLabel = document.createElement("label");
choiceWeservLabel.textContent = " images.weserv.nl";
choiceWeservLabel.setAttribute("for", "gm_rst_r21_choice_weserv_radio");
choiceWeservDiv.appendChild(choiceWeservLabel);
choiceDiv.appendChild(choiceWeservDiv);

// section de la configuration des menus
var menuFieldset = document.createElement("fieldset");
var menuLegend = document.createElement("legend");
menuLegend.textContent = "Organisation des menus";
menuFieldset.appendChild(menuLegend);
configWindow.appendChild(menuFieldset);

// sans
var sansRow = document.createElement("div");
sansRow.setAttribute("class", "gm_rst_r21_row");
var sansTitle = document.createElement("div");
sansTitle.setAttribute("class", "gm_rst_r21_cell");
var sansIcon = document.createElement("img");
sansIcon.setAttribute("src", iconSans);
sansTitle.appendChild(sansIcon);
sansTitle.appendChild(document.createTextNode("Rehost sans rehost :"));
sansRow.appendChild(sansTitle);
var sansRadios = document.createElement("div");
sansRadios.setAttribute("class", "gm_rst_r21_cell");
var sansRadio1 = document.createElement("input");
sansRadio1.setAttribute("type", "radio");
sansRadio1.setAttribute("id", "gm_rst_r21_sans_radio_1");
sansRadio1.setAttribute("name", "gm_rst_r21_sans_radio");
sansRadios.appendChild(sansRadio1);
var sansRadio1Label = document.createElement("label");
sansRadio1Label.setAttribute("for", "gm_rst_r21_sans_radio_1");
sansRadio1Label.textContent = "menu";
sansRadios.appendChild(sansRadio1Label);
var sansRadio2 = document.createElement("input");
sansRadio2.setAttribute("type", "radio");
sansRadio2.setAttribute("id", "gm_rst_r21_sans_radio_2");
sansRadio2.setAttribute("name", "gm_rst_r21_sans_radio");
sansRadios.appendChild(sansRadio2);
var sansRadio2Label = document.createElement("label");
sansRadio2Label.setAttribute("for", "gm_rst_r21_sans_radio_2");
sansRadio2Label.textContent = "sous-menu";
sansRadios.appendChild(sansRadio2Label);
var sansRadio0 = document.createElement("input");
sansRadio0.setAttribute("type", "radio");
sansRadio0.setAttribute("id", "gm_rst_r21_sans_radio_0");
sansRadio0.setAttribute("name", "gm_rst_r21_sans_radio");
sansRadios.appendChild(sansRadio0);
var sansRadio0Label = document.createElement("label");
sansRadio0Label.setAttribute("for", "gm_rst_r21_sans_radio_0");
sansRadio0Label.textContent = "aucun";
sansRadios.appendChild(sansRadio0Label);
sansRow.appendChild(sansRadios);
menuFieldset.appendChild(sansRow);

// full
var fullRow = document.createElement("div");
fullRow.setAttribute("class", "gm_rst_r21_row");
var fullTitle = document.createElement("div");
fullTitle.setAttribute("class", "gm_rst_r21_cell");
var fullIcon = document.createElement("img");
fullIcon.setAttribute("src", iconFull);
fullTitle.appendChild(fullIcon);
fullTitle.appendChild(document.createTextNode("Rehost taille originale :"));
fullRow.appendChild(fullTitle);
var fullRadios = document.createElement("div");
fullRadios.setAttribute("class", "gm_rst_r21_cell");
var fullRadio1 = document.createElement("input");
fullRadio1.setAttribute("type", "radio");
fullRadio1.setAttribute("id", "gm_rst_r21_full_radio_1");
fullRadio1.setAttribute("name", "gm_rst_r21_full_radio");
fullRadios.appendChild(fullRadio1);
var fullRadio1Label = document.createElement("label");
fullRadio1Label.setAttribute("for", "gm_rst_r21_full_radio_1");
fullRadio1Label.textContent = "menu";
fullRadios.appendChild(fullRadio1Label);
var fullRadio2 = document.createElement("input");
fullRadio2.setAttribute("type", "radio");
fullRadio2.setAttribute("id", "gm_rst_r21_full_radio_2");
fullRadio2.setAttribute("name", "gm_rst_r21_full_radio");
fullRadios.appendChild(fullRadio2);
var fullRadio2Label = document.createElement("label");
fullRadio2Label.setAttribute("for", "gm_rst_r21_full_radio_2");
fullRadio2Label.textContent = "sous-menu";
fullRadios.appendChild(fullRadio2Label);
fullRow.appendChild(fullRadios);
menuFieldset.appendChild(fullRow);

// large
var largeRow = document.createElement("div");
largeRow.setAttribute("class", "gm_rst_r21_row");
var largeTitle = document.createElement("div");
largeTitle.setAttribute("class", "gm_rst_r21_cell");
var largeIcon = document.createElement("img");
largeIcon.setAttribute("src", iconLargGran);
largeTitle.appendChild(largeIcon);
largeTitle.appendChild(document.createTextNode("Rehost large (1200px) :"));
largeRow.appendChild(largeTitle);
var largeRadios = document.createElement("div");
largeRadios.setAttribute("class", "gm_rst_r21_cell");
var largeRadio1 = document.createElement("input");
largeRadio1.setAttribute("type", "radio");
largeRadio1.setAttribute("id", "gm_rst_r21_large_radio_1");
largeRadio1.setAttribute("name", "gm_rst_r21_large_radio");
largeRadio1.dataset.value = "1";
largeRadio1.addEventListener("change", saveCurrentRstLarge, false);
largeRadios.appendChild(largeRadio1);
var largeRadio1Label = document.createElement("label");
largeRadio1Label.setAttribute("for", "gm_rst_r21_large_radio_1");
largeRadio1Label.textContent = "menu";
largeRadios.appendChild(largeRadio1Label);
var largeRadio2 = document.createElement("input");
largeRadio2.setAttribute("type", "radio");
largeRadio2.setAttribute("id", "gm_rst_r21_large_radio_2");
largeRadio2.setAttribute("name", "gm_rst_r21_large_radio");
largeRadio2.dataset.value = "2";
largeRadio2.addEventListener("change", saveCurrentRstLarge, false);
largeRadios.appendChild(largeRadio2);
var largeRadio2Label = document.createElement("label");
largeRadio2Label.setAttribute("for", "gm_rst_r21_large_radio_2");
largeRadio2Label.textContent = "sous-menu";
largeRadios.appendChild(largeRadio2Label);
var largeRadio0 = document.createElement("input");
largeRadio0.setAttribute("type", "radio");
largeRadio0.setAttribute("id", "gm_rst_r21_large_radio_0");
largeRadio0.setAttribute("name", "gm_rst_r21_large_radio");
largeRadio0.dataset.value = "0";
largeRadio0.addEventListener("change", saveCurrentRstLarge, false);
largeRadios.appendChild(largeRadio0);
var largeRadio0Label = document.createElement("label");
largeRadio0Label.setAttribute("for", "gm_rst_r21_large_radio_0");
largeRadio0Label.textContent = "aucun";
largeRadios.appendChild(largeRadio0Label);
largeRow.appendChild(largeRadios);
menuFieldset.appendChild(largeRow);

// grand
var grandRow = document.createElement("div");
grandRow.setAttribute("class", "gm_rst_r21_row");
var grandTitle = document.createElement("div");
grandTitle.setAttribute("class", "gm_rst_r21_cell");
var grandIcon = document.createElement("img");
grandIcon.setAttribute("src", iconLargGran);
grandTitle.appendChild(grandIcon);
grandTitle.appendChild(document.createTextNode("Rehost grand (1000px) :"));
grandRow.appendChild(grandTitle);
var grandRadios = document.createElement("div");
grandRadios.setAttribute("class", "gm_rst_r21_cell");
var grandRadio1 = document.createElement("input");
grandRadio1.setAttribute("type", "radio");
grandRadio1.setAttribute("id", "gm_rst_r21_grand_radio_1");
grandRadio1.setAttribute("name", "gm_rst_r21_grand_radio");
grandRadio1.dataset.value = "1";
grandRadio1.addEventListener("change", saveCurrentRstGrand, false);
grandRadios.appendChild(grandRadio1);
var grandRadio1Label = document.createElement("label");
grandRadio1Label.setAttribute("for", "gm_rst_r21_grand_radio_1");
grandRadio1Label.textContent = "menu";
grandRadios.appendChild(grandRadio1Label);
var grandRadio2 = document.createElement("input");
grandRadio2.setAttribute("type", "radio");
grandRadio2.setAttribute("id", "gm_rst_r21_grand_radio_2");
grandRadio2.setAttribute("name", "gm_rst_r21_grand_radio");
grandRadio2.dataset.value = "2";
grandRadio2.addEventListener("change", saveCurrentRstGrand, false);
grandRadios.appendChild(grandRadio2);
var grandRadio2Label = document.createElement("label");
grandRadio2Label.setAttribute("for", "gm_rst_r21_grand_radio_2");
grandRadio2Label.textContent = "sous-menu";
grandRadios.appendChild(grandRadio2Label);
var grandRadio0 = document.createElement("input");
grandRadio0.setAttribute("type", "radio");
grandRadio0.setAttribute("id", "gm_rst_r21_grand_radio_0");
grandRadio0.setAttribute("name", "gm_rst_r21_grand_radio");
grandRadio0.dataset.value = "0";
grandRadio0.addEventListener("change", saveCurrentRstGrand, false);
grandRadios.appendChild(grandRadio0);
var grandRadio0Label = document.createElement("label");
grandRadio0Label.setAttribute("for", "gm_rst_r21_grand_radio_0");
grandRadio0Label.textContent = "aucun";
grandRadios.appendChild(grandRadio0Label);
grandRow.appendChild(grandRadios);
menuFieldset.appendChild(grandRow);

// moyen
var moyenRow = document.createElement("div");
moyenRow.setAttribute("class", "gm_rst_r21_row");
var moyenTitle = document.createElement("div");
moyenTitle.setAttribute("class", "gm_rst_r21_cell");
var moyenIcon = document.createElement("img");
moyenIcon.setAttribute("src", iconMedPrev);
moyenTitle.appendChild(moyenIcon);
moyenTitle.appendChild(document.createTextNode("Rehost moyen (800px) :"));
moyenRow.appendChild(moyenTitle);
var moyenRadios = document.createElement("div");
moyenRadios.setAttribute("class", "gm_rst_r21_cell");
var moyenRadio1 = document.createElement("input");
moyenRadio1.setAttribute("type", "radio");
moyenRadio1.setAttribute("id", "gm_rst_r21_moyen_radio_1");
moyenRadio1.setAttribute("name", "gm_rst_r21_moyen_radio");
moyenRadios.appendChild(moyenRadio1);
var moyenRadio1Label = document.createElement("label");
moyenRadio1Label.setAttribute("for", "gm_rst_r21_moyen_radio_1");
moyenRadio1Label.textContent = "menu";
moyenRadios.appendChild(moyenRadio1Label);
var moyenRadio2 = document.createElement("input");
moyenRadio2.setAttribute("type", "radio");
moyenRadio2.setAttribute("id", "gm_rst_r21_moyen_radio_2");
moyenRadio2.setAttribute("name", "gm_rst_r21_moyen_radio");
moyenRadios.appendChild(moyenRadio2);
var moyenRadio2Label = document.createElement("label");
moyenRadio2Label.setAttribute("for", "gm_rst_r21_moyen_radio_2");
moyenRadio2Label.textContent = "sous-menu";
moyenRadios.appendChild(moyenRadio2Label);
var moyenRadio0 = document.createElement("input");
moyenRadio0.setAttribute("type", "radio");
moyenRadio0.setAttribute("id", "gm_rst_r21_moyen_radio_0");
moyenRadio0.setAttribute("name", "gm_rst_r21_moyen_radio");
moyenRadios.appendChild(moyenRadio0);
var moyenRadio0Label = document.createElement("label");
moyenRadio0Label.setAttribute("for", "gm_rst_r21_moyen_radio_0");
moyenRadio0Label.textContent = "aucun";
moyenRadios.appendChild(moyenRadio0Label);
moyenRow.appendChild(moyenRadios);
menuFieldset.appendChild(moyenRow);

// preview
var previewRow = document.createElement("div");
previewRow.setAttribute("class", "gm_rst_r21_row");
var previewTitle = document.createElement("div");
previewTitle.setAttribute("class", "gm_rst_r21_cell");
var previewIcon = document.createElement("img");
previewIcon.setAttribute("src", iconMedPrev);
previewTitle.appendChild(previewIcon);
previewTitle.appendChild(document.createTextNode("Rehost aperçu (600px) :"));
previewRow.appendChild(previewTitle);
var previewRadios = document.createElement("div");
previewRadios.setAttribute("class", "gm_rst_r21_cell");
var previewRadio1 = document.createElement("input");
previewRadio1.setAttribute("type", "radio");
previewRadio1.setAttribute("id", "gm_rst_r21_preview_radio_1");
previewRadio1.setAttribute("name", "gm_rst_r21_preview_radio");
previewRadios.appendChild(previewRadio1);
var previewRadio1Label = document.createElement("label");
previewRadio1Label.setAttribute("for", "gm_rst_r21_preview_radio_1");
previewRadio1Label.textContent = "menu";
previewRadios.appendChild(previewRadio1Label);
var previewRadio2 = document.createElement("input");
previewRadio2.setAttribute("type", "radio");
previewRadio2.setAttribute("id", "gm_rst_r21_preview_radio_2");
previewRadio2.setAttribute("name", "gm_rst_r21_preview_radio");
previewRadios.appendChild(previewRadio2);
var previewRadio2Label = document.createElement("label");
previewRadio2Label.setAttribute("for", "gm_rst_r21_preview_radio_2");
previewRadio2Label.textContent = "sous-menu";
previewRadios.appendChild(previewRadio2Label);
var previewRadio0 = document.createElement("input");
previewRadio0.setAttribute("type", "radio");
previewRadio0.setAttribute("id", "gm_rst_r21_preview_radio_0");
previewRadio0.setAttribute("name", "gm_rst_r21_preview_radio");
previewRadios.appendChild(previewRadio0);
var previewRadio0Label = document.createElement("label");
previewRadio0Label.setAttribute("for", "gm_rst_r21_preview_radio_0");
previewRadio0Label.textContent = "aucun";
previewRadios.appendChild(previewRadio0Label);
previewRow.appendChild(previewRadios);
menuFieldset.appendChild(previewRow);

// thumb
var thumbRow = document.createElement("div");
thumbRow.setAttribute("class", "gm_rst_r21_row");
var thumbTitle = document.createElement("div");
thumbTitle.setAttribute("class", "gm_rst_r21_cell");
var thumbIcon = document.createElement("img");
thumbIcon.setAttribute("src", iconThumb);
thumbTitle.appendChild(thumbIcon);
thumbTitle.appendChild(document.createTextNode("Rehost vignette (230px) :"));
thumbRow.appendChild(thumbTitle);
var thumbRadios = document.createElement("div");
thumbRadios.setAttribute("class", "gm_rst_r21_cell");
var thumbRadio1 = document.createElement("input");
thumbRadio1.setAttribute("type", "radio");
thumbRadio1.setAttribute("id", "gm_rst_r21_thumb_radio_1");
thumbRadio1.setAttribute("name", "gm_rst_r21_thumb_radio");
thumbRadios.appendChild(thumbRadio1);
var thumbRadio1Label = document.createElement("label");
thumbRadio1Label.setAttribute("for", "gm_rst_r21_thumb_radio_1");
thumbRadio1Label.textContent = "menu";
thumbRadios.appendChild(thumbRadio1Label);
var thumbRadio2 = document.createElement("input");
thumbRadio2.setAttribute("type", "radio");
thumbRadio2.setAttribute("id", "gm_rst_r21_thumb_radio_2");
thumbRadio2.setAttribute("name", "gm_rst_r21_thumb_radio");
thumbRadios.appendChild(thumbRadio2);
var thumbRadio2Label = document.createElement("label");
thumbRadio2Label.setAttribute("for", "gm_rst_r21_thumb_radio_2");
thumbRadio2Label.textContent = "sous-menu";
thumbRadios.appendChild(thumbRadio2Label);
var thumbRadio0 = document.createElement("input");
thumbRadio0.setAttribute("type", "radio");
thumbRadio0.setAttribute("id", "gm_rst_r21_thumb_radio_0");
thumbRadio0.setAttribute("name", "gm_rst_r21_thumb_radio");
thumbRadios.appendChild(thumbRadio0);
var thumbRadio0Label = document.createElement("label");
thumbRadio0Label.setAttribute("for", "gm_rst_r21_thumb_radio_0");
thumbRadio0Label.textContent = "aucun";
thumbRadios.appendChild(thumbRadio0Label);
thumbRow.appendChild(thumbRadios);
menuFieldset.appendChild(thumbRow);

// conf
var confRow = document.createElement("div");
confRow.setAttribute("class", "gm_rst_r21_row");
var confTitle = document.createElement("div");
confTitle.setAttribute("class", "gm_rst_r21_cell");
var confIcon = document.createElement("img");
confIcon.setAttribute("src", iconConf);
confTitle.appendChild(confIcon);
confTitle.appendChild(document.createTextNode("Configuration de Rehost :"));
confRow.appendChild(confTitle);
var confRadios = document.createElement("div");
confRadios.setAttribute("class", "gm_rst_r21_cell");
var confRadio1 = document.createElement("input");
confRadio1.setAttribute("type", "radio");
confRadio1.setAttribute("id", "gm_rst_r21_conf_radio_1");
confRadio1.setAttribute("name", "gm_rst_r21_conf_radio");
confRadios.appendChild(confRadio1);
var confRadio1Label = document.createElement("label");
confRadio1Label.setAttribute("for", "gm_rst_r21_conf_radio_1");
confRadio1Label.textContent = "menu";
confRadios.appendChild(confRadio1Label);
var confRadio2 = document.createElement("input");
confRadio2.setAttribute("type", "radio");
confRadio2.setAttribute("id", "gm_rst_r21_conf_radio_2");
confRadio2.setAttribute("name", "gm_rst_r21_conf_radio");
confRadios.appendChild(confRadio2);
var confRadio2Label = document.createElement("label");
confRadio2Label.setAttribute("for", "gm_rst_r21_conf_radio_2");
confRadio2Label.textContent = "sous-menu";
confRadios.appendChild(confRadio2Label);
var confRadio0 = document.createElement("input");
confRadio0.setAttribute("type", "radio");
confRadio0.setAttribute("id", "gm_rst_r21_conf_radio_0");
confRadio0.setAttribute("name", "gm_rst_r21_conf_radio");
confRadios.appendChild(confRadio0);
var confRadio0Label = document.createElement("label");
confRadio0Label.setAttribute("for", "gm_rst_r21_conf_radio_0");
confRadio0Label.textContent = "aucun";
confRadios.appendChild(confRadio0Label);
confRow.appendChild(confRadios);
menuFieldset.appendChild(confRow);

// section des options
var optionsFieldset = document.createElement("fieldset");
var optionsLegend = document.createElement("legend");
optionsLegend.textContent = "Options";
optionsFieldset.appendChild(optionsLegend);
configWindow.appendChild(optionsFieldset);

// options
var optionsP = document.createElement("p");
optionsP.setAttribute("class", "gm_rst_r21_p");
var optionsCheckbox = document.createElement("input");
optionsCheckbox.setAttribute("type", "checkbox");
optionsCheckbox.setAttribute("id", "gm_rst_r21_options_checkbox");
optionsP.appendChild(optionsCheckbox);
var optionsCheckboxLabel = document.createElement("label");
optionsCheckboxLabel.setAttribute("for", "gm_rst_r21_options_checkbox");
optionsCheckboxLabel.textContent = "Afficher les options dans le sous-menu";
optionsP.appendChild(optionsCheckboxLabel);
optionsFieldset.appendChild(optionsP);

// icons
var iconsP = document.createElement("p");
iconsP.setAttribute("class", "gm_rst_r21_p");
var iconsCheckbox = document.createElement("input");
iconsCheckbox.setAttribute("type", "checkbox");
iconsCheckbox.setAttribute("id", "gm_rst_r21_icons_checkbox");
iconsP.appendChild(iconsCheckbox);
var iconsCheckboxLabel = document.createElement("label");
iconsCheckboxLabel.setAttribute("for", "gm_rst_r21_icons_checkbox");
iconsCheckboxLabel.textContent = "Afficher les icônes dans les menus";
iconsP.appendChild(iconsCheckboxLabel);
optionsFieldset.appendChild(iconsP);

// notifs
var notifsP = document.createElement("p");
notifsP.setAttribute("class", "gm_rst_r21_p");
var notifsCheckbox = document.createElement("input");
notifsCheckbox.setAttribute("type", "checkbox");
notifsCheckbox.setAttribute("id", "gm_rst_r21_notifs_checkbox");
notifsP.appendChild(notifsCheckbox);
var notifsCheckboxLabel = document.createElement("label");
notifsCheckboxLabel.setAttribute("for", "gm_rst_r21_notifs_checkbox");
notifsCheckboxLabel.textContent = "Afficher les notifications";
notifsP.appendChild(notifsCheckboxLabel);
optionsFieldset.appendChild(notifsP);

// link
var linkP = document.createElement("p");
linkP.setAttribute("class", "gm_rst_r21_p");
linkP.appendChild(document.createTextNode("Lien sur l'image : "));
var linkImageRadioLabel = document.createElement("label");
linkImageRadioLabel.setAttribute("for", "gm_rst_r21_link_image_radio");
linkImageRadioLabel.textContent = "vers la taille originale";
linkP.appendChild(linkImageRadioLabel);
var linkImageRadio = document.createElement("input");
linkImageRadio.setAttribute("type", "radio");
linkImageRadio.setAttribute("id", "gm_rst_r21_link_image_radio");
linkImageRadio.setAttribute("name", "gm_rst_r21_link_radio");
linkImageRadio.dataset.value = "image";
linkImageRadio.addEventListener("change", saveCurrentRstLink, false);
linkP.appendChild(linkImageRadio);
var linkPageRadio = document.createElement("input");
linkPageRadio.setAttribute("type", "radio");
linkPageRadio.setAttribute("id", "gm_rst_r21_link_page_radio");
linkPageRadio.setAttribute("name", "gm_rst_r21_link_radio");
linkPageRadio.dataset.value = "page";
linkPageRadio.addEventListener("change", saveCurrentRstLink, false);
linkP.appendChild(linkPageRadio);
var linkPageRadioLabel = document.createElement("label");
linkPageRadioLabel.setAttribute("for", "gm_rst_r21_link_page_radio");
linkPageRadioLabel.textContent = "vers la page de partage";
linkP.appendChild(linkPageRadioLabel);
optionsFieldset.appendChild(linkP);

// return
var returnP = document.createElement("p");
returnP.setAttribute("class", "gm_rst_r21_p");
var returnCheckbox = document.createElement("input");
returnCheckbox.setAttribute("type", "checkbox");
returnCheckbox.setAttribute("id", "gm_rst_r21_return_checkbox");
returnP.appendChild(returnCheckbox);
var returnCheckboxLabel = document.createElement("label");
returnCheckboxLabel.setAttribute("for", "gm_rst_r21_return_checkbox");
returnCheckboxLabel.textContent = "Ajouter un retour à la ligne après l'image";
returnP.appendChild(returnCheckboxLabel);
optionsFieldset.appendChild(returnP);

// info "sans rechargement" et boutons de validation et de fermeture
var saveCloseDiv = document.createElement("div");
saveCloseDiv.setAttribute("class", "gm_rst_r21_save_close_div");
var infoReloadDiv = document.createElement("div");
infoReloadDiv.setAttribute("class", "gm_rst_r21_info_reload_div");
var infoReloadImg = document.createElement("img");
infoReloadImg.setAttribute("src", infoImg);
infoReloadDiv.appendChild(infoReloadImg);
infoReloadDiv.appendChild(document.createTextNode(" sans rechargement "));
infoReloadDiv.appendChild(createHelpButton(255,
  "Les paramètres de cette fenêtre de configuration sont appliqués immédiatement à la validation, " +
  "il n'est pas nécessaire de recharger la page."));
saveCloseDiv.appendChild(infoReloadDiv);
var saveButton = document.createElement("img");
saveButton.setAttribute("src", saveImg);
saveButton.setAttribute("title", "Valider");
saveButton.addEventListener("click", saveConfigWindow, false);
saveCloseDiv.appendChild(saveButton);
var closeButton = document.createElement("img");
closeButton.setAttribute("src", closeImg);
closeButton.setAttribute("title", "Annuler");
closeButton.addEventListener("click", hideConfigWindow, false);
saveCloseDiv.appendChild(closeButton);
configWindow.appendChild(saveCloseDiv);

// fonction de sauvegarde du choix pour currentRstLarge
function saveCurrentRstLarge() {
  largeRow.dataset.value = this.dataset.value;
}

// fonction de sauvegarde du choix pour currentRstGrand
function saveCurrentRstGrand() {
  grandRow.dataset.value = this.dataset.value;
}

// fonction de sauvegarde du choix pour currentRstLink
function saveCurrentRstLink() {
  linkP.dataset.value = this.dataset.value;
}

// fonction de mise à jour des options en fonction du choix du serveur
function updateChoice() {
  if(choiceRehostRadio.checked) {
    largeRow.classList.add("gm_rst_r21_disabled");
    largeRadio1.disabled = true;
    largeRadio2.disabled = true;
    largeRadio0.disabled = true;
    largeRadio1.checked = false;
    largeRadio2.checked = false;
    largeRadio0.checked = true;
    grandRow.classList.add("gm_rst_r21_disabled");
    grandRadio1.disabled = true;
    grandRadio2.disabled = true;
    grandRadio0.disabled = true;
    grandRadio1.checked = false;
    grandRadio2.checked = false;
    grandRadio0.checked = true;
    linkP.classList.remove("gm_rst_r21_disabled");
    linkImageRadio.disabled = false;
    linkPageRadio.disabled = false;
    linkImageRadio.checked = linkP.dataset.value === "image";
    linkPageRadio.checked = linkP.dataset.value !== "image";
  } else {
    largeRow.classList.remove("gm_rst_r21_disabled");
    largeRadio1.disabled = false;
    largeRadio2.disabled = false;
    largeRadio0.disabled = false;
    largeRadio1.checked = largeRow.dataset.value === "1";
    largeRadio2.checked = largeRow.dataset.value === "2";
    largeRadio0.checked = largeRow.dataset.value === "0";
    grandRow.classList.remove("gm_rst_r21_disabled");
    grandRadio1.disabled = false;
    grandRadio2.disabled = false;
    grandRadio0.disabled = false;
    grandRadio1.checked = grandRow.dataset.value === "1";
    grandRadio2.checked = grandRow.dataset.value === "2";
    grandRadio0.checked = grandRow.dataset.value === "0";
    linkP.classList.add("gm_rst_r21_disabled");
    linkImageRadio.disabled = true;
    linkPageRadio.disabled = true;
    linkImageRadio.checked = true;
    linkPageRadio.checked = false;
  }
}

// fonction de validation de la fenêtre de configuration
function saveConfigWindow() {
  // fermeture de la fenêtre
  hideConfigWindow();
  // sauvegarde des paramètres de la fenêtre de configuration
  currentRstChoice = choiceRehostRadio.checked ? "rehost" : "weserv";
  currentRstSans = sansRadio1.checked ? "1" : sansRadio2.checked ? "2" : "0";
  currentRstFull = fullRadio1.checked ? "1" : "2";
  currentRstLarge = largeRow.dataset.value;
  currentRstGrand = grandRow.dataset.value;
  currentRstMoyen = moyenRadio1.checked ? "1" : moyenRadio2.checked ? "2" : "0";
  currentRstPreview = previewRadio1.checked ? "1" : previewRadio2.checked ? "2" : "0";
  currentRstThumb = thumbRadio1.checked ? "1" : thumbRadio2.checked ? "2" : "0";
  currentRstConf = confRadio1.checked ? "1" : confRadio2.checked ? "2" : "0";
  currentRstOptions = optionsCheckbox.checked;
  currentRstIcons = iconsCheckbox.checked;
  currentRstNotifs = notifsCheckbox.checked;
  currentRstLink = linkP.dataset.value;
  currentRstReturn = returnCheckbox.checked;
  Promise.all([
    GM.setValue("rst_choice", currentRstChoice),
    GM.setValue("rst_sans", currentRstSans),
    GM.setValue("rst_full", currentRstFull),
    GM.setValue("rst_large", currentRstLarge),
    GM.setValue("rst_grand", currentRstGrand),
    GM.setValue("rst_moyen", currentRstMoyen),
    GM.setValue("rst_preview", currentRstPreview),
    GM.setValue("rst_thumb", currentRstThumb),
    GM.setValue("rst_conf", currentRstConf),
    GM.setValue("rst_options", currentRstOptions),
    GM.setValue("rst_icons", currentRstIcons),
    GM.setValue("rst_notifs", currentRstNotifs),
    GM.setValue("rst_link", currentRstLink),
    GM.setValue("rst_return", currentRstReturn),
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
  // correction de currentRstConf si pas de gmMenu
  let localCurrentRstConf = currentRstConf;
  if(!gmMenu) {
    confRadio0.disabled = true;
    confRadio0Label.setAttribute("class", "gm_rst_r21_disabled");
    if(localCurrentRstConf === "0") {
      localCurrentRstConf = "2";
    }
  }
  // correction de currentRstNotifs si pas de gmNotif
  let localCurrentRstNotifs = currentRstNotifs;
  if(!gmNotif) {
    notifsCheckbox.disabled = true;
    notifsCheckboxLabel.setAttribute("class", "gm_rst_r21_disabled");
    localCurrentRstNotifs = false;
  }
  choiceRehostRadio.checked = currentRstChoice === "rehost";
  choiceWeservRadio.checked = currentRstChoice !== "rehost";
  sansRadio1.checked = currentRstSans === "1";
  sansRadio2.checked = currentRstSans === "2";
  sansRadio0.checked = currentRstSans === "0";
  fullRadio1.checked = currentRstFull === "1";
  fullRadio2.checked = currentRstFull === "2";
  largeRadio1.checked = currentRstLarge === "1";
  largeRadio2.checked = currentRstLarge === "2";
  largeRadio0.checked = currentRstLarge === "0";
  largeRow.dataset.value = currentRstLarge;
  grandRadio1.checked = currentRstGrand === "1";
  grandRadio2.checked = currentRstGrand === "2";
  grandRadio0.checked = currentRstGrand === "0";
  grandRow.dataset.value = currentRstGrand;
  moyenRadio1.checked = currentRstMoyen === "1";
  moyenRadio2.checked = currentRstMoyen === "2";
  moyenRadio0.checked = currentRstMoyen === "0";
  previewRadio1.checked = currentRstPreview === "1";
  previewRadio2.checked = currentRstPreview === "2";
  previewRadio0.checked = currentRstPreview === "0";
  thumbRadio1.checked = currentRstThumb === "1";
  thumbRadio2.checked = currentRstThumb === "2";
  thumbRadio0.checked = currentRstThumb === "0";
  confRadio1.checked = localCurrentRstConf === "1";
  confRadio2.checked = localCurrentRstConf === "2";
  confRadio0.checked = localCurrentRstConf === "0";
  optionsCheckbox.checked = currentRstOptions;
  iconsCheckbox.checked = currentRstIcons;
  notifsCheckbox.checked = localCurrentRstNotifs;
  linkImageRadio.checked = currentRstLink === "image";
  linkPageRadio.checked = currentRstLink !== "image";
  linkP.dataset.value = currentRstLink;
  returnCheckbox.checked = currentRstReturn;
  updateChoice();
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
}

/* ------------------------------------------------------------ */
/* récupération des paramètres et gestion des images de la page */
/* ------------------------------------------------------------ */

function addContextmenuAttribute() {
  currentImageUrl = this.src;
  currentIsGif = false;
  if(currentRstChoice === "rehost" && GIF_REGEXP.test(currentImageUrl)) {
    currentIsGif = true;
  }
  createRehostMenu();
  this.setAttribute("contextmenu", MENU_ID);
}

function removeContextmenuAttribute() {
  this.removeAttribute("contextmenu");
}

function addMouseEventsOnImages() {
  let imgs = document.querySelectorAll("img[src]:not([src^='data']):not([contextmenu='" + MENU_ID + "'])");
  for(let img of imgs) {
    img.addEventListener("mouseover", addContextmenuAttribute, true);
    img.addEventListener("mouseout", removeContextmenuAttribute, true);
  }
}

var observer = new MutationObserver(addMouseEventsOnImages);

Promise.all([
  GM.getValue("rst_choice", rstChoiceDefault),
  GM.getValue("rst_sans", rstSansDefault),
  GM.getValue("rst_full", rstFullDefault),
  GM.getValue("rst_large", rstLargeDefault),
  GM.getValue("rst_grand", rstGrandDefault),
  GM.getValue("rst_moyen", rstMoyenDefault),
  GM.getValue("rst_preview", rstPreviewDefault),
  GM.getValue("rst_thumb", rstThumbDefault),
  GM.getValue("rst_conf", rstConfDefault),
  GM.getValue("rst_options", rstOptionsDefault),
  GM.getValue("rst_icons", rstIconsDefault),
  GM.getValue("rst_notifs", rstNotifsDefault),
  GM.getValue("rst_link", rstLinkDefault),
  GM.getValue("rst_return", rstReturnDefault),
]).then(function([
  rstChoice,
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
  rstLink,
  rstReturn,
]) {
  // initialisation des variables globales
  currentRstChoice = rstChoice;
  currentRstSans = rstSans;
  currentRstFull = rstFull;
  currentRstLarge = rstLarge;
  currentRstGrand = rstGrand;
  currentRstMoyen = rstMoyen;
  currentRstPreview = rstPreview;
  currentRstThumb = rstThumb;
  currentRstConf = rstConf;
  currentRstOptions = rstOptions;
  currentRstIcons = rstIcons;
  currentRstNotifs = rstNotifs;
  currentRstLink = rstLink;
  currentRstReturn = rstReturn;
  // gestion des images de la page
  addMouseEventsOnImages();
  observer.observe(document, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
  });
  // ajout d'une entrée de configuration dans le menu greasemonkey si c'est possible (pas gm4 yet)
  if(gmMenu) {
    GM_registerMenuCommand("Rehost -> Configuration", showConfigWindow);
  }
});
