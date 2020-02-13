// ==UserScript==
// @name          [HFR] Pas d'alerte light
// @version       1.0.6
// @namespace     roger21.free.fr
// @description   Permet de savoir - de manière légère et rapide - si une alerte de modération a été lancée en passant la souris sur le bouton.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_pas_d_alerte_light.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_pas_d_alerte_light.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_pas_d_alerte_light.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
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

// $Rev: 1590 $

// historique :
// 1.0.6 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 1.0.5 (11/02/2020) :
// - utilisation d'une image en url en data au lieu de l'url chez reho.st pour le throbber
// 1.0.4 (02/01/2020) :
// - correction de l'effacement des title sur les bouton d'alert
// 1.0.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - retour des requêtes fetch en mode "same-origin" au lieu de "cors"
// 1.0.2 (23/09/2019) :
// - passage des requêtes fetch en mode "cors" pour éviter un plantage sous ch+vm en mode "same-origin"
// 1.0.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.0.0 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+
// 0.9.1 (20/08/2018) :
// - ajout d'une gestion du changement de l'image du bouton au lieu de l'effet shadow ->
// désactivé par défaut, mettre la variable icons à true dans le code pour pour l'utiliser
// - désactivation du check à chaque passage de souris et ajout d'une option pour le ré-autoriser
// - ajout d'une tempo de 200ms (pasque faut pas déconner)
// 0.9.0 (18/08/2018) :
// - création


// à mettre à true pour utiliser des images plutôt que l'effet shadow
var icons = false; // true ou false

// et vous pouvez changer les images ici (en url ou en data)
var ouf = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACHklEQVR42q2T60sUYRTG%2FVt2v5WihaaipRBEUV5HSzHSRFFKYzOJvMyI2tbiZWNTUwTZkhTJjUgryrDLrvf7BUwdRUN2v%2FZhl%2F1mj%2Be88M6yIH5y4MAMM7%2Fnec55z0REnPZVvvjSXLbgUIvn2%2FW7c23%2BorlWf8GMTc%2BbfqbmTDWZT4QJVAj0EYi2LRece99E8X3%2BzHOkezTfdU%2B9cixcMm9nOFC37oTrwIOWzXe4t9ghyvZnCMMHblSv9uLyr8eB1J%2FV4SIEmiiqV8L0LOrw%2F6GoO7MtIsHbv%2BOoWOrExa8Wb%2FLnByZDgGCNKgzmZylA%2FSN3qhnZk414vTeGK79rkOgq1wwB%2BkDnPjkqg9JRCjCYMdGAGx4VT9b6wEnjB0p0Q4A%2BCPbvfwfNQYDSUQoweNVdK5yvuevg2P6AOGdR0BCgyQZ52uwuo7Lj8r8dIcAgDQ80PHFv33qP8923QwL0UrduDEJbf2NEZcenGwPo2f0kwJTxKlwas4D2BA9XehDjyAu1QC81SiHOXEZlR9kCgzR5JI9WivhJH%2B8juj03NEQ%2BkqSRCm%2Fpwgv07n4xHPncuRhkiOFb01ZE2bK9kdYsU9guJAyXKfGDpQHewq6dEVQudSHlxyMhRBsqYJ4PgYHI5szjt%2FFCf7ES21foo0SwLHeD58JzYDEyAIG%2Bs43pyon%2Fw7lXBeaYjnw12n5Tpz79FNdPrjqB6pmGNPOp%2F71Hj9TBXSsdptUAAAAASUVORK5CYII%3D";
var ttt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACSElEQVQ4y62TPUyTYRDH%2F1agCFh5JUEosQgtDCYsEl0Mg8EQB%2BPSxRA%2BEib8QBM3nVx1ZTIxKvKhDk2cNCExDg6GRAUxmBZKUbRFPopFaWnf57n%2F49DkLUiY9MZL7ve7u9wB%2Fxj7%2Fk4MXVF%2BY0wnyR6SNRQDkj9IPiY5dnXYmt8T8OiyHTTGDOridK0vUIIKTxEA4PeGQiycgZ1yLZEcuPHsSGgX4OGlXJDkkMdnlzcEypBc1Fj5agAA1T4XDvtcmAv%2FwrfpbJpk783nvpADeNCfbaSRN9ZR5a1vKsfHcRsA0He%2FDABwr28TAHCiowSRmQ3MfdhMuIy03X7ZFHMBgFbSJSWZHcUAndFIQhnB2xcZNB734ECV8W7ZugsA8gCtu%2BsDpVheEACEIqEK9VAkROch8fkc%2FC2HoJTqLgBE1XmsYqx%2B0VAsGB2AESgjEBIL0SwOWsXQWtcVAEogxuTNRhzj4owCAAiJnAhsEZCEIaC1xvYR4uvJHKp8LqdVZQRTr7bw%2BukmbBEHXnOsCMm1DLSS%2BHbAcGQ6heqG%2FU6rORFcuObBmYsVUEZAk7d7%2FW6E361Aaz3sAJRSI6mEnQh%2F%2BomT58oc49jddYzeSeZ3QqLtfCXCk6uIz6YSWuuRHYd0q30mmNMcaj5VWR5osfA9lkUsmoUxBvV%2BN%2Boa3IhMreH9%2BGKaZO9IpD2065Svn54Misig5S2tbW6tgsdywxiDjfUsPk8sIxFNLZEcGJ09G9rzmfpbJ%2FwkO0n2iEgNyR3P9CTaMY%2F%2FGX8AjJyPf96i%2B6EAAAAASUVORK5CYII%3D";

// à mettre à true pour autoriser la verification à chaque passage de la souris
var check_every_time = false; // true ou false


let style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  "img.hfr_gm_pdal_r21_white{background:transparent;border-radius:unset;box-shadow:unset;}" +
  "img.hfr_gm_pdal_r21_green{background:#2ecc40;border-radius:8px;box-shadow:0 0 8px 0 #2ecc40;}" +
  "img.hfr_gm_pdal_r21_red{background:#ff4136;border-radius:8px;box-shadow:0 0 8px 0 #ff4136;}";
document.getElementsByTagName("head")[0].appendChild(style);

var timer = null;
var target = null;
var throbber = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACGFjVEwAAAAYAAAAANndHFMAAAAaZmNUTAAAAAAAAAAQAAAAEAAAAAAAAAAAAB8D6AEAHV58pwAAAWlJREFUeNpjYMABREVFeYBgJQiD2AykAmZm5hYg9R%2BEoWz8QENDw1JRUXGPkpLSHCsrK16gpqlIBkz9%2F%2F8%2F1%2BbNmxu3bNkye9u2bXoomoGSjCDNQPwfhFVVVdO5uLgkgRqXgjBQidS%2BffuCgZpvAw25CcSzMVwAshmkWUFB4Z%2BysnIAujxQsyMQX4Ya0ojNFxxAQzKgmpnQJUGuhBoSeubMGVa4hIeHB7uLi0u5q6tre1RUlCChsAL6nw9oSAkQp69atYqNwc3NbbqTk9M3Z2fn30A8g5ABQOe3gLwBxNeBuJ5yA2BeAOJ2CwsLIZK9AAMgTlZWVmx2drY7KMCIDkQYAGruBeJ3QPwMiD1IjkagplWZmZmvgfh9RkZG7MyZM0WmTJnSCcI9PT0iQKeH4E1IeXl5xiBDoC7hmTZtWgVQ82MQnjx5ciXQ2biTMjYA1JQ9derUeyAMYpOcG3t7ezmBmltBGMTGpQ4AtqrwBlDMdgwAAAAaZmNUTAAAAAEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8Sqm5QAAAXpmZEFUAAAAAnjaY2DAAURFRXmEhYWXgTCIzUAq4OXlbeLi4voPwkB2I0ENRkZGFrq6ujv19PRmWVlZAfXwToIZwMPDM%2Fn%2F%2F%2F9cmzdvbtyyZcvsbdu26WEYANKsra39T0dH57%2B%2Bvn4qUKMkUOMSEAZKS%2B3evTsYqPk20JCbQDwbwwCQzSDNQPwTaJg%2FujxQsyMQX4YagukleXl5DqDGNENDQ7%2F6%2BnomdHmgFxihhoSeOXOGFS7h4eHBHhAQUBoYGNiSn58vQCisgP7nAxpSAsTpq1atYmMICgqa4u%2Fv%2F9HPz%2B8b0KCphAwAOr8F5A0gvg7E9ZQbAPMCELfa2NgIkuwFGABxKioqooHYDRRgRAciDJSXl3cD8SsgflRWVuZOcjQCNS4H4udAza9KS0uj161bJ7x48eI2EF64cKEw0OkheBNSVVWVEcgQoBe6srKyeJYsWVIG1HwfhEFsoLPxJ2V0ANSUAdR8C4RBbJJzIzBQOYEam0AYxMalDgDCHPiOgVAEawAAABpmY1RMAAAAAwAAABAAAAAQAAAAAAAAAAAAHwPoAQEcvHUMAAABbmZkQVQAAAAEeNpjYMABtLS0eGRlZReDMIjNQCqQkJCoFxUV%2FQ%2FCIDZBDTY2NuYWFhbbLC0tp%2Fv5%2BfGKi4tPEBMT%2Bw%2FCQEMm%2FP%2F%2Fn2vz5s2NW7Zsmb1t2zY9DANAms3NzX8B8V9ra%2BtkoCYJoCGLQJiLi0ty9%2B7dwUDNt4GG3ATi2RgGgGwGaQbir0DDfNHlgZodgfgy1JBGDAPk5eU5gBpTgLaDNDOhywO9wAg1JPTMmTOscInc3Fz22NjY4ri4uKb8%2FHwBQmEF9D8f0JASIE5ftWoVGwNQ48SYmJi3QPwJaNBkQgYAnd8C8gYQXwfiesoNQPaCt7e3IMlegAEQp7W1NQqIXUEBRnQgwgBQY0dLS8tzIL7f3NzsRnI0Ag1YAsRPQIY0NTVFAROOMMi%2FILxu3TphoNND8Cak9vZ2Q6ghHfX19TwgfwIV3gFhEHvTpk34kzI6AGpIh4b0dRCb5NwIDFROoI0NIAxi41IHAFxMAhn8b9WWAAAAGmZjVEwAAAAFAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfF2B3YAAAGfZmRBVAAAAAZ42mNgwAG0tLR41NXVF4AwiM1AKlBSUqpVUFD4D8IgNkz8%2F%2F%2F%2FjFg1uLm5mbm4uGwG4qmhoaE8QE19ioqK%2F0FYRUWlF6iEj5mZeTEQH%2BDg4LDBMACk2cnJ6buzs%2FMvoGFJ8vLyEkDNC0AY6AUJFhaWHJADQJiJiekohktANoM0A%2FEnoAE%2B6BawsbGFMjIygg0AumIJhguAzmQHuiAZpLm%2Bvp4Jiy%2BZgIaEAGmQS7jgorm5uexZWVmF2dnZDR0dHfyEAhfodIEdO3aUbNmyJX3VqlVsDECNfZmZma%2BA%2BD3QoAmEDNi8eXMLUPNtIL4OxPWUGwDzAtCABn9%2FfwFCBmzbto0PqBHhBSS%2FsU6bNi1iypQpztgSC0gMqMkRiEPPnDnDimEyUGMbED%2BePHnybaBBLujyUM2XQc4HeqMRmwELp06d%2BgBqSMTu3buFQf4F4XXr1gkDnR4C1XwTiGdjM8AAakhrd3c3N8ifQIV3QBjE3rRpExfIZiB7NtAwPYKZCaghHRrS10FsknMjMIQ5gTY2gDCIjUsdAEaa8bn5NffYAAAAGmZjVEwAAAAHAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARzg1J8AAAGgZmRBVAAAAAh42p2Tv0sCYRjHr8Dk7tLzx1B%2FgJN3XiCEQ1OOBf6qXK1JuJCW8AcRFbYJDm0iBqk4OEjo4eIQNLsFSSSNLUFL0BbX96mjzFMOe%2BHLfXnv%2FX6e53nhZZgpS5Zl3u%2F3V0jkmVmXz%2Bc7EkXxg0TeNBCNRlfD4fB1JBK5UBRlEaGCJEkaibzL5bJjXdlsthun07lmAFA4FAq9Qe%2BxWGzX6%2FUuI1ghBQKBJYT3eZ7XOI7TALnVNG3uD4AqUxigV3SzOV5AEIQtApCoE0MHHo%2FHCsAeqm8Y6N9rniAsyyrw3M9uKpWyZjKZg2w2e1wqlQSzuwLc0e12D1VVTTabzQUml8sVAHiGXtLpdNEM0Ol0zhF%2BhAbQyRcAwf8DRkdIJBIOMwDatyP4O8LIbJZGoxGvVqvBSZdIewitQzv9ft9iINdqtXy9Xn%2BC7gEKjv%2FXw3fUPsY4mwS4hIYEwTfe6%2FXcNC%2Bp1Wq50fq2Hn6AygYAWl%2FRIXl4nubEwSGJfLvd5qgyfBkw2fRtIJDUb3pAfubXiBtmUfGURH7auU%2FutPojzjsHHQAAABpmY1RMAAAACQAAABAAAAAQAAAAAAAAAAAAHwPoAQHxk%2BXDAAABg2ZkQVQAAAAKeNqlU79LAmEYvgINKzQM9bzZuSlQDhwSHBqL2rxrFIVwaYmCS7xTo6FZHdoFHfS4sf6B2xpEbGsIGhraWrqeh65fenJIHzx8D%2B%2F3Ps%2F7Az5BmHPy%2BfxaNpttE%2BTCoieTyZym0%2Bk3gtxXoCjKtqqqPeC6XC6vQ3gJvBOyLDej0WhYFMWbeDx%2BK0mSPGNQKBR6MHnB%2FQoTFcIEKreJXC6XgLgEsROLxRzcd47jLP0xYGWKgWfw3ekCMNinmGAnMx2kUqkVdHBE8Yz751lOJpN7MCiBh76jmqYFDcM4rtfrZ61WK%2BK3K5hHLMs6MU2z2O12g0Kj0Wjquv4IPMHoys9gOBzqEE%2BAEaD93%2BBrhFqtdl6pVDb8DNB%2BGMKfEX7NFkDwENjxWiJjfGOObdsBr9aqbmv3TJx%2Bd8V8mzDXy6ADjJmANg%2F6%2Ff4m5yXIGXPFY%2BZ6zbaFBJpUB4PBKucEfyDIGXO77DDX929AUHQ3PSJf%2BDdiwyFUvCDI5%2BV9ABJsBKxZnW%2FPAAAAGmZjVEwAAAALAAAAEAAAABAAAAAAAAAAAAAfA%2BgBARwFNioAAAGKZmRBVAAAAAx42qWTu0%2FCUBjFW4mi2ODga%2BSdMLk4OcrLjpLgZlwJz8nEMCHx1YXFAprgbuzAAISp%2F4WDIZg4mLiY6OZiYj0nFgYKAeJNfunX755z7qOpIIwZ0Wh0ORaL3RDWwqwjEomchEKhL8J6oiGfz2%2Bn02kNlIvFogTTVTgc%2FiaoL%2F1%2Bv9Pr9d55PB49GAzuWAJoTqVS7%2BAzm80eYuVNGG9JPB7fgDkJs2GiG4YhDgeUwQd4A%2FLwAj6fb9%2Ftdv8wgDux7ECWZTtWP8pkMnuW9L8xx5BAIJDM5XL2QVfTtAVVVTPVarXQ6XScU9zvms1muwZnLpdrUYDxolKpvIDXWq2mTHLDeI%2BHQSRJevh%2FQP8IoKAoysoUR1gXRVEdHKE%2FcHHz7Xb7AOyOukT2OKfregK1wxLbarVKEPTAI4XD8%2ByZcz1qRwXUQZcCfI1Eo9FYxfs5Yc2eae5SawmAYAsChpSazaYD9THqZ8KaPXOXdWon3hQMSYifCOuZ%2F0Z8nSWseEpYj9P9AmHJ8O96azpYAAAAGmZjVEwAAAANAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfHPRFAAAAGYZmRBVAAAAA542pWTv0sCYRzGLeiHp95y5OrooJ56U2uD5ZQ%2FsKlb%2B7G41Z24mCENORW15KZW4OCgIgT%2BAQ5uDWEGQUvg1hQtXc8DKuQp6gsf%2BN73%2BzzPe%2B97nMUyZamqaovH4zeEtWXRFY1GTyORyBdhPdOQTqcVXdcfU6nUZT6ft8GYA98kFovl3G63Q5blO5%2FP96QoyqYpgGbwqWlaHyH7oVDIiZ1vCY7ghPHA6%2FUaHo%2FnlyGmAO6MgD74QMjO%2BDwQCEQQ8MMQvokpIBwOr8GsImjbMIyl8Xkmk1kOBoO7fr%2F%2FMJlMro0GlUpltVwuHwOt3W6Lc9yvJIrilcPhyLpcrnULjOelUukVvIOLWW4Y7wVBMIgkSQ8LB9jt9v8BwyMUi0UdAfMcYQMh16MjDFen01lpNBp7YGvSJbLHWavVSqC2mmLr9XoWgh54pnB8zt5g1qN2UkABdCloNpuJarUq4TlHWLM3MHepNQVAIEPAkGytVhNQn6B%2BI6zZG7xlgdqZNwXDEcQvhPXCfyO%2BjhU7nhHW03R%2FhFP4ipu3x5gAAAAaZmNUTAAAAA8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHFmXuQAAAYZmZEFUAAAAEHjapZOxSwJxFMevIEvjXOzyFvE%2FCJpOT5eG2hoEbyjUSXRyyt0uz1NwKRoa3KrJwUHlwP%2FAwa1BpKAlaGoJWoK4vl84g7yTS%2FrBBx7v977fe%2B%2FdnSAsOaVSKVQoFK4IY2HVk8%2Fnz3K53Bth7CtoNpv7jUbjHrTa7fY2hBfgnaALXVVVMZlM3iQSCSudTisuA0f8YhjGq2maJ5lMZhdPviaVSkWCsKgoyhf4pImXQYti8Fyv148W71Op1DHEHzRhJy4DTdMCMDkFh7Ztr3lMuU4TjFJER5s%2F2W63GxgOh2XLsqrj8TjstytRFCPRaPRSluVaPB7fEiCugSl4HAwGhp8BxLeSJNkkFovd%2Fd9gPgKoYozwHz6RnV8jzM9kMtmAiQYOvJbIHO9Go1EWcdBli%2FZ1jgEeWLh4z5xzx1F1L4MOmLEAo2R7vV6EOyGMmXPEM9a6DFCwhwKa6P1%2BP8SdIH4ijJlzuuyw1ndTEJSdtzNlvPLfiLcTxBPPCeNldd%2BFTAEoC6ckLQAAABpmY1RMAAAAEQAAABAAAAAQAAAAAAAAAAAAHwPoAQHwWCCpAAABqGZkQVQAAAASeNqlkz9IAnEUx%2B9Ou06jAsXFxb%2FgFk0h0pInTo0eteqgaN4Qubh0CtVYgZ4ILWlNDg4q4tgSOLg1SNgQtrUELUHL9X2QBd7JET34cI979%2F2%2B33s%2FjmEWRDqdtudyuQuCcuavAeFhNpt9JSg3FVSr1U3QUFX1tNlsrkBYAm9EPp9XIpHIaiwWU0E3Ho9vGRmQ%2BBnPl3q9vpdMJl3ofEkUi0WXKIop8BmNRj%2FIxMjgjMSVSmVSq9Vi83V03YXBO5nQSXQGkiTxEO%2FDRNQ0jZ2vK4rCkQlIybK8%2FFNotVp8r9fL9Pv9wnA4XDPbldvtdvr9%2FvNgMHjs8XgEBmIFjMGk2%2B2emBkEAoFrn8%2Bneb1eLRQKNf5vMBsBFDCG6QjhcNgBk98RZjEajZZgIoEdoyUiOJ7nE1ar9QC5TVfF8cs0Bnggk%2Fk6iVmW1ZBqFovl1sjgCjySCUZJtNttJ%2B2EmE6nDo7jZBITyO91p4RoA2IyKXc6HTvtBPkTMRgMjvDJOjrfgDtBELZN%2Fw2YZL5vZ0z57P2C%2FegDt2ND9xJB%2BaLvvgDI3vA4tCR%2FkQAAABpmY1RMAAAAEwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdzvNAAAABkWZkQVQAAAAUeNqlk79LAnEYxq8g8U7u5Kw2%2FwO14KCpQaqtA3%2F1Y3YTCmko%2FEHIJbYZDa5hkDo5SKiIW9DsFiSRNDi0BC1BW1zPA%2BagJ4f0hQ%2F33r33PO%2F3fb93gjBjGYYhZbPZImEszLvS6fRJKpV6J4xtBZVKZb1ard6CQrPZlCDMQfhBMplMLhQKyZFIpBQOh%2B%2Bj0ejGlMFIPKjVam%2B4HiaTyVWYXBO0sAJhHCbf4IsmVgYFisEz4p3JPKrqEH7ShDuxGpqDldHKtmmaC5N5PovFYrsgXq%2FXHeMEb9rtdgKcdTodxW5WXq%2FXEwgErsB5MBh0ChAaoA9eW63WpZ0BhGW%2F32%2F6fL4fTdPK%2FzeYtwVd11WYFMct%2FK1er7cEkwOwZTVErEW3272nKMoRYudUFtvPsw3wRJPJPMUul8skMLmzMrgBLzRBK%2FuNRmOZMyHD4dAjiuIxxZIkmbIsP07tEqI1iGmS56fMmSAekG63e8pNsDLED6qqbtr%2BGzBJjE6nz3juvxGnI6L6BWE8671fIqf6HRySx%2B0AAAAaZmNUTAAAABUAAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ASBOgAAAWxmZEFUAAAAFnjaY2DAAerr67na29s7QBjEZiAVtLa25ra0tDwGYRCboIZt27bpbdmyZfbmzZsbz5w5wwXUWA3U%2BByE29raqkNDQ3ni4uL6gXhtbGysCYYBQI0gzTeBhtwGGhYCdLYIUHM3CPf09IjExMTEAfEnoOZ3QHotNgMaQZqB%2BDIQO6LLA232BGp8BTIE5BIMA4DOZgVqDAVp%2Fv%2F%2FPyO6PEgMZAjQBfGrVq1ig0uAOEBN6UBcAnQ6H6Gw0tLSEjI3N%2B%2B0sLCo9PDwYGcAaqwH4usg5wO90ULIAKDGWUAD%2FgHxT1tb21mUG0CqF6KiogQtLS0RXiA2EIGASVJSMlBCQiITyOYgORqBGoNERUX%2FgzCQPZ9gQlq3bp0wKExA%2BNGjR0LCwsKZYmJiYAOA9H4MVyIn5U2bNnGBwgTIvgPCQLkSoBJ%2BkM1AzfukpKSsCOYNoCHp0Ni5DmKTnBuBscMJtL0BhEFsXOoAUt0FcAi6YW0AAAAaZmNUTAAAABcAAAAQAAAAEAAAAAAAAAAAAB8D6AEBHZJS0wAAAXNmZEFUAAAAGHjaY2DAAXp7ezmnTp3aCsIgNgOpYPLkydlAzfdAGMQmqGHbtm16W7Zsmb158%2BbGM2fOcAE1VU6ZMuUxCE%2BbNq0iKyuLB4h7gXhVXl6eMYYBQI0gzTeBhtwGGhbS09MjAtTcCcIzZ84UycjIiM3MzHwPxK9BhmAzoBGkGYgvA7EjujxQkwcQPwPidyCXYBgAdDYrUGMoSPP%2F%2F%2F8Z0eVBYtnZ2e5AzbGrVq1ig0uAOEBN6UBcAnQ6H6GwsrCwEHJxcWkH4nIPDw92BqDGeiC%2BDnI%2B0BsthAwAapzh7Oz828nJ6Zubm9t0kg0AakY1gFQvREVFCbq6uiK8QGwgAgGTsrJygJKSUgaQzUFyNII0Kygo%2FFNUVPwPNGQO3oS0b9%2B%2BYKCQFDMz81IQ5uLiklRVVU0HaYbiPRiuRE7KQEkuoMapoOgHYRDbysqKF2QzSLOGhoYlwbwB1NSCZEALyblRVFSUBwhWgjCIjUsdAJsS8AnByX%2BOAAAAGmZjVEwAAAAZAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfDhY48AAAF5ZmRBVAAAABp42mNgwAFWrVrFuWTJkiYQBrEZSAVAjRmLFy%2B%2BBcIgNkEN27Zt09uyZcvszZs3N545c4YLqKkMqPk%2BCIPYWVlZPBUVFV3l5eXLq6qqjDAMAGoEab4JNOQ20LCQhQsXCgM1t4HwunXrhEtLS6PLyspeAQ14DjIEmwGNIM1AfBmIHdHlgZrdgRofAfErkEswDAA6mxWoMRSk%2Bf%2F%2F%2F4zo8iAxoEY3II4GBiobcmizATWlA3EJ0Ol8hMLKxsZGMCAgoBWISz08PNgZgBrrgfg6yPlAb7QQMgCocaqfn983f3%2F%2Fj0FBQVMoN4BUL%2BTn5wsEBga2wL1AbCDW19czGRoa%2Bunq6qbJy8tzkByNQI3%2BOjo6P4H4v56e3iy8CWn37t3BQCEpHh6eJSDMxcUlqa%2BvnwrSrK2t%2FQ9o2E68SRnoBS6gxslAjf9BmJeXd5KVlRUvyGaQZiMjIwuCeQOoqRHJgCaSc6OoqCiPsLDwMhAGsXGpAwBEpviQbN5BdAAAABpmY1RMAAAAGwAAABAAAAAQAAAAAAAAAAAAHwPoAQEdd7BmAAABbmZkQVQAAAAceNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWrYtm2bHlDxbKCNjUANXEB2CZB9B4RB7Pr6ep7W1tYOIF7S3t5uiGEAUCFI802g4ttAw0LWrVsnDOS3gPDu3buFm5qaolpaWp4DDXgCMgSbAY0gzUB8GYgd0eWbm5vdgAbchxrSgWHAmTNnWIEaQ0Ga%2F%2F%2F%2Fz4guDxIDanQF4ihgoLIhhzYbUBMowEqATucjFFbe3t6CcXFxTbGxscW5ubnsDECN9dDQvg3yLyEDgBonx8TEfALit0CDJlJuAKleyM%2FPF0DxArGBCARM1tbWvhYWFiny8vIcJEcjUKOvubn5VyD%2Ba2lpOR1vQgImnGAuLi5JcXHxRSAsKioqAbQ9GaQZiH8BDduGNykDvcAF1DRBTEzsPwgDDZng5%2BfHC7IZpNnGxsacYN6QkJCoBxryH4RBbJJzo5aWFo%2BsrOxiEAaxcakDADqJAhkT68NIAAAAGmZjVEwAAAAdAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfC9whwAAAGhZmRBVAAAAB542qWTPUgCcRjG7049zcQEFzc%2FEASHaGpqyTucAhcPnGsIv4bANVSoEKQI%2FFhajJocHDwRwaWlza0hwoagrSVoCVqu54EiuVNE%2BsODz93%2F%2F%2FzufV%2FvBGHB6na7a7quVyh6YdXV7%2FcPB4PBI0W%2FNDAcDjdx%2BApPrCLghi%2FBP1P09Xp9vdVqnTabzWtoywLAQYafcHgKWLrX6%2FlxfUKNx2N%2Fo9HIIPgKyAsh8wBVhqEHaNe83263VUCmhEBnFsBkMnEgqDFsGIZo3uc9BBWAMvCO2WnLCHFgJZTuXTarVCrly2azlVwud1QsFp0CguWfaU%2FZ7zIAgpcAvENv%2BXz%2B4v%2BA3xZGo1EJvfmWAWq12gaCfy3MLDdUkGU5jV%2FJHCyXy1IymdxLJBIH0WjUaSHbbLZbDlsURQMQzbzPsKIoH9CXqqoty18kSdI9LWW32wvxeDwQDoc7VDAYDACwzzAq%2BARAt1Tgcrl2UMUddINLL8o8R9igIpHIhaZpHj6ZYcC25w5o9gVC6DgUChkU%2FcpfI1rwxGKxDkW%2F6Nw37k3xuSzoMScAAAAaZmNUTAAAAB8AAAAQAAAAEAAAAAAAAAAAAB8D6AEBHSsR9QAAAZ9mZEFUAAAAIHjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlq2LZtmx5Q8WygjY1ADVxAdgmQfQeEQexFixZxL168uBmI5wHZ%2BhgGABWCNN8EKr4NNCxk3bp1wkB%2BCwjv3r1bGKgxbMmSJfeA9B2QIdgMaARpBuLLQOyILr9s2TInoAHXoIY0Yxhw5swZVqDGUJDm%2F%2F%2F%2FM6LLg8SATncCGhQGZLMihzYbUBMowEqATucjFFbx8fECFRUVteXl5fm5ubnsDECN9dDQvg3yLyEDysrK%2BoCaXwPpZ5WVld2UGwDzAtD5JUC%2FCRAyYObMmfwoXkACXJycnFn8%2FPzBQDYTtkAMCgry8vPzS1RRUWHHMJmPj28hNzf3fxCGGoICAgMDvf39%2Fd8BDfgWEBAwCcN0Xl7eQ1xcXGADgIZlm5ubi%2Bvq6s4FYS0tLQmg7QkgzUD8GWjQBgwXCAoKWgMN2Q9yiZCQEB9QY7eOjs5%2FEAaxs7KyeEA2gzQDXWNKMG8ANVVra2v%2FBWEQm%2BTcqKenx21kZDQXhEFsXOoAfEH6IOWuH2wAAAAaZmNUTAAAACEAAAAQAAAAEAAAAAAAAAAAAB8D6AEB88%2BqfQAAAYJmZEFUAAAAInjapVOxSwJhHLVAwwoN40692bkpODlwSLihschNrzEUwsUlCi65OzUamrWhXdDhPBzrH7itIcK2hqChoa2l6z24QjzlkD543Lvf7733%2Fb4Pvkhkwer3%2B%2FHRaHRJkEeWXbZtnziO80SQhxrG4%2FEOxLfYsQnDOngD%2FIUgZ409aqgNBKBJ8zMEEwiOhsPhNv5Ngpw19qihdl4A0yfAI7A322fN7zGkGQhwXTeKZolCz%2FNWZvus%2BSEl8Oj0bcdQ5IU1MGYi7K7q9fqWYRgXlmWd6roe42i6f9sczQwLgPHaNM034LXdbnf%2BH%2FB7BIzfwNmSYQHdbjfZarXO%2F44wteKCIFSz2ewB%2BOq8S9Q0bb9SqRzncrm1QHImk7lDgEeAH872aS6Xy%2B%2FAJ%2FhNIF0UxQea8WVAtVgspvP5fI%2BQZTkNk0YzJvjAdxCYQJIkBeZ7TpJKpRKKonRg%2FPZxVavVNrkzMEDIbujbwM5nMH4R5Eu%2FRlVVNwqFQo8gX6T7AfzqBKx3VEm7AAAAGmZjVEwAAAAjAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR5ZeZQAAAGNZmRBVAAAACR42qWTvUsCYRzH75Ky7LCht1E9FZxamhp9ObsxobZoFT11CqLJpLdbWjq1oPboBgcVp%2FsvGiIMGoKWoLaWoOv7BS3qlEt64APf5%2Fn9ft%2Ff88IjCEOGaZpTrVZrj1ALo45ms5ltt9u3hNq1oNPpLCH5Ah0rKPBBb0PfE2quMcYc5joMEGTxHRK6SFhvNBqzmB8Qaq4xxhzmDjKgexfcgPjvONd6MZpUHAa2bfssy2KXOLQ4IC72TDagx78CgUBg0uPx7IuiaGA673ZXuq7PGIaxCzS8zoQgSZLJBgRGV24G9Xpdr1arj%2BChVqsd0uD6Xwb9I4BTxOf%2B8Nx%2BFH4foT%2BKxaI3Go1mw%2BHwGqZjgy5R07TVXC63paqq1%2BEsy%2FJlKBSyg8HgR8%2Fkx8jn8yp4Ai%2FgxOGOYosGBGbZTCazkEqlzkkikVgsFAqb6P4KnmFgOnYQi8VWaMKdRCIRPwqPksnkO4E%2BLpfLEjuzuFQqLbv%2BDRTtoPMboR75NyqKMp1Op88I9bC8T5%2BU8PAz88iaAAAAGmZjVEwAAAAlAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAfOTC%2B4AAAGWZmRBVAAAACZ42qWTu0%2FCUBjFwcQHhXZpZGVkAMpjcmVAmSwQnezqY2FTSlgQQxxk0uiiG6AmDAxASEz4AxjYHIxiYuJiwuZkXKznJMBAIZV4k5Oce8%2F3%2FW7vba7NNmPUajVHs9k8puht845Go7HfarWeKHrLhna7raD4BjsW0CDAH8K%2FUvRcY8Ya1poACNn8jII%2BCrbq9bqMeZGi5xoz1rB2GoD0PvQIRSdzrg0zQgomgGEYjk6nw12i8PYpuX0I2e71eovjwOPxrIiiWHC5XBeYrlrdVaVSkcrlsl6tVg%2Fwd5ZssizfCYJgUIDc%2FgFwCr1BL4Cc%2FB8wOoIkSefIZStAt9uV0JgZH2E00un0cjAY3AuHw5v5fH5h2iVms9l1Xde1eDy%2BbCIrinLt9%2FsN6DsUCqmTeSaT2UDzOzQA6MwECAQCDz6f74cQ%2BF1N09yJROKKisVibjTtADIA4AO6NwEikcgaIfwSr9crJpPJoqqqX0MVS6WSkzuzOZfLRSzfBnY%2BQuMnRT%2F3a8QRnKlU6pKin1X3C2Zv%2BIepEdLNAAAAGmZjVEwAAAAnAAAAEAAAABAAAAAAAAAAAAAfA%2BgBAR4F2AcAAAGGZmRBVAAAACh42mNgwAFWrVrFuXnz5gYQBrEZSAWbNm1K37Jly3UQBrEJati2bZseUPFsoI2NQA1cQHYJkH0HhEFskBhIDqQGpBbDAKAkSPNNoILbQAUh69atEwbyW0AYxAaJgeRAakBqsRkAMv02EF8GYkd0eZAYVA5kSCOGAf%2F%2F%2F%2BfcuXMnyBZHIJsRizwj1JDQM2fOsMIl5OXlOSQkJOpFRUUnALkiRIQVHyhMgDgdGDtsDLKysouBmv%2BDsLi4%2BCJCBoDCBOpVUAzVU24AzAtAzRN4eXmFCRlw4sQJPqA3EF6AgdzcXHYrK6sUa2trXyCXCVsgtra2ugJxVGhoKBuGyZaWltPNzc3%2FAvFXqCEooLm52a2lpeU%2BED8HGtKBYYCFhcU2oOZfIEOA7BSgi0RjY2Mng3BgYKBYW1tbJFTzEyBegmGAjY2NOcgQkEuAXuGNi4trjImJ%2BQTFTd3d3dwgm0Ga29vbDQnmDaDNxUCNb0EYxCY5N6alpXEBXTERhEFsXOoALlABImtNWOoAAAAaZmNUTAAAACkAAAAQAAAAEAAAAAAAAAAAAB8D6AEB83bpWwAAAaRmZEFUAAAAKnjaY2DAAVatWsW5efPmBhAGsRmIAf%2F%2F%2F2eEsTdt2pS%2BZcuW6yAMYhPUzMHBYcPMzHwAiBcDufw7duwoBtp%2BB4SBhpQADeECshuB7Nnbtm3Tw7CZiYnpKIgJwkB27qNHj4SAGlpAeN26dcJATSFAzbeB%2FJtAPBvDBUCbl4A0MzIy%2FmdjYwtBlwdqdgTiy1BDGrH5gpOFhSUbqpkJW%2FhADQk9c%2BYMK1xCXl6eQ0VFpU5ZWbnPwsJCiFBYAb3CBwoTIE4Hxg4bg7q6%2BkIFBYX%2FioqK%2F4GGLCBkAChMQN6AxlA95QbAvKCkpNQnJSUlTMiAEydO8AG9gfACDOTm5rK7ubklAbFPfX091kCcMmWK8%2BTJkyNCQ0PZMEx2cXGZ6uzs%2FAuIP4EMQZefNm2aC1DzbaAhj4G4DZsBm52cnL5DDUmqrKwUzcrKmgDCiYmJojNmzAgHaZ46deoDIL0QwwCgrWYgQ0AusbKy4s3JyanPzMx8D8UNixYt4gZqbgVpBmIDgnkDaHMhUOMrEAaxGUgFaWlpXECN%2FSAMYuNSBwBOIvA4wVgLqgAAABpmY1RMAAAAKwAAABAAAAAQAAAAAAAAAAAAHwPoAQEe4DqyAAABkWZkQVQAAAAseNpjYMABVq1axbl58%2BYGEAaxGUgFmzZtSt%2ByZct1EAaxCWoQFBS05uXl3c%2FHx7cQyOXfsWNHMdD2OyAMNKQEaAgXkN0IZM%2Fetm2bHorm%2F%2F%2F%2FMwI1H%2BLi4vrPzc39n5OTM%2FvRo0dCQA0tILxu3TphoKYQoObbQP5NIJ6N4QKQzSDNIMzPzx%2BMLg%2FU7AjEl6GGNGLzBQfQkCyoZiZ0SZAroYaEnjlzhhUuYW9vz6Grq1sNxN3e3t6ChMIK6BU%2BUJgAcTowdtgYjIyM5mpra%2F%2FV0dH5DzRkLiEDQGEC8gY0huopNwDJCz0yMjJCJHsBKeWxBQUFJQCxFyjAsAXiokWLnBYvXhxWX1%2FPhmFyQEDAJD8%2Fv2%2F%2B%2Fv7vAgMDvdHlgRqdlyxZcg2I7wHZzRgGADVuABrwGWpIAtAWkbKysj4Qzs3NFQXZDNV8B4jnYRgAtNUUZAjUJbwVFRW15eXlr0EYaEgtKCmDbAZpBnpFn2DeAGrMB2p8BsIgNsm5EegFrsrKym4QBrFxqQMANXn6HYPJ7D8AAAAaZmNUTAAAAC0AAAAQAAAAEAAAAAAAAAAAAB8D6AEB8ypIyAAAAWtmZEFUAAAALnjaY2DAAVatWsW5efPmBhAGsRlIBZs2bUrfsmXLdRAGsQlqkJKSshITE9snISExH8jl37ZtWwnQ9jsgDDSkBGgIF5DdCGTPBsrpoWj%2B%2F%2F8%2FI1DzflFR0f9A%2Br%2BwsHDmo0ePhIAaWkB43bp1wkBNIUDNt4H8m0A8G8MFIJtBBoAwkB2ELg%2FU7AjEl6GGNGLzBQdQY6akpGQgkM2ELglyJdSQ0DNnzrDCJTw8PNgtLCwqLS0tO6OiogQJhRXQK3ygMAHidGDssDHY2trOMjc3%2FwnE%2F4AGzSJkAChMQN6AxlA95QbAvAA0oFNLS0uIZC8gpTy22NjY%2BLi4OE9QgBEdiDAA1NgfExPzCYhfgQwhORqBGtcCXfAOakhcT0%2BPSGtrazcI19fXixBMSEDNJkCb14JcEhoaytPW1lYN1PwchFtaWqqBzsadlLEBoMZcoMbHIAxik5wbgc7mam9v7wBhEBuXOgDZvgVwR0IA4QAAAABJRU5ErkJggg%3D%3D";

function update() {
  fetch(target.parentElement.href, {
    method: "GET",
    mode: "same-origin",
    credentials: "same-origin",
    cache: "reload",
    referrer: "",
    referrerPolicy: "no-referrer"
  }).then(function(r) {
    return r.text();
  }).then(function(r) {
    if(!check_every_time) {
      target.removeEventListener("mouseover", mouseover, false);
      target.removeEventListener("mouseout", mouseout, false);
    }
    if(r.includes("formulaire est destiné UNIQUEMENT à demander aux modérateurs")) {
      if(icons) {
        target.src = ouf;
      } else {
        target.src = target.dataset.src;
        target.className = "hfr_gm_pdal_r21_green";
      }
    } else {
      if(icons) {
        target.src = ttt;
      } else {
        target.src = target.dataset.src;
        target.className = "hfr_gm_pdal_r21_red";
      }
    }
  }).catch(function(e) {
    console.log("[HFR] Pas d'alerte light ERROR fetch target : " + e);
  });
}

function mouseover(e) {
  window.clearTimeout(timer);
  target = this;
  if(!icons) {
    target.className = "hfr_gm_pdal_r21_white";
  }
  target.src = throbber;
  timer = window.setTimeout(update, 200);
}

function mouseout(e) {
  window.clearTimeout(timer);
  if(target && target.dataset.src && target.src === throbber) {
    target.src = target.dataset.src;
  }
}

var buttons = document.querySelectorAll("a[href^=\"/user/modo.php?\"] > img[src$=\"exclam.gif\"]");
for(let button of buttons) {
  button.removeAttribute("alt");
  button.removeAttribute("title");
  button.parentElement.removeAttribute("title");
  button.addEventListener("mouseover", mouseover, false);
  button.addEventListener("mouseout", mouseout, false);
  button.dataset.src = button.src;
  button.style.width = button.naturalWidth + "px";
  button.style.height = button.naturalHeight + "px";
}
