// ==UserScript==
// @name          [HFR] navigateur de laureka
// @version       2.2.3
// @namespace     roger21.free.fr
// @description   ajoute une barre de navigation qui permet de naviguer directement d'un laureka à l'autre sur le topic culture générale
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/forum2.php?config=hfr.inc&cat=13&subcat=423&post=95092*
// @include       https://forum.hardware.fr/hfr/Discussions/Societe/*sujet_95092_*.htm*
// @homepage      http://roger21.free.fr/hfr/
// @noframes
// @grant         GM_info
// @grant         GM_deleteValue
// @grant         GM_getValue
// @grant         GM_listValues
// @grant         GM_setValue
// @grant         GM_getResourceText
// @grant         GM_getResourceURL
// @grant         GM_addStyle
// @grant         GM_log
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
// @grant         GM_setClipboard
// @grant         GM_xmlhttpRequest
// ==/UserScript==

// $Rev: 391 $

// historique :
// 2.2.3 (05/08/2018) :
// - correction d'un bug sur la gestion des tooltips, signalé par pilou92 :jap:
// 2.2.2 (06/12/2017) :
// - correction d'une incompatibilité avec vm sur le changement de page
// 2.2.1 (28/11/2017) :
// - passage au https
// 2.2.0 (17/09/2017) :
// - ajout d'un selecteur de couleur pour la coloration des posts
// - et adoucissement de la couleur par défaut
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 2.1.0 (29/01/2017) :
// - ajout des boutons page précédente et page suivante parceque des fois on veut juste faire ça
// 2.0.3 (06/09/2016) :
// - correction d'un (nouveau ?) débordement de 1px
// 2.0.2 (15/08/2016) :
// - correction des string.contains en string.includes (par cytrouille pour firefox 48+)
// 2.0.1 (24/01/2016) :
// - suppression de la coloration du post de reprise simple (non issue de la navigation) ->
// pas logique, auccun sens, bref c'était une connerie :o
// 2.0.0 (24/01/2016) :
// - support des questions en citation ... :/ [:palm]
// - gestion d'un mode kontinue, permet de reprendre la navigation au niveau d'un post arbitraire sur lequel on a cliqué
// - ajout d'une coloration des posts (désactivable)
// - gestion des laureka d'argent dans la navigation (désactivable)
// - ajout d'un mode blink ... humm c'est heu ... utile ... whatever (désactivable)
// - ajout de tooltips détaillés sur chaque bouton (désactivable)
// - refonte des images - plus moches mais plus simples :o
// 1.1.4 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.1.3 (04/11/2014) :
// - correction de l'include sur l'url verbeuse
// 1.1.2 (28/04/2014) :
// - ajout d'une marge plus importante en bas pour ne pas gêner la réponse rapide ->
// à cause de la suppression des <br /> autour des sujets relatifs dans "[HFR] last post highlight"
// - ajout d'un id à la navtable pour être pris en compte par "[HFR] reponse rapide"
// 1.1.1 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// 1.1.0 (23/03/2014) :
// - ajout d'une gestion de masquage et de ré-affichage de la barre
// 1.0.0 (23/03/2014) :
// - corrections sur les commentaires
// - correction de code mal ordonné ou en double
// 0.9.0 (22/03/2014) :
// - création

// temps maximal entre une action et son execution sur un changement de page
// si le delai (en secondes) est dépassé l'action en cours (au chargement de la page) est abandonnée
// cela permet surtout de ne pas conserver l'action si l'on quite le topic en cours d'action
// une sorte de protection ou de mode panique, si le script s'embale ou que l'on ne comprend pas ce qu'il fait,
// il suffit de le fermer et d'attendre le delai avant de le réouvrir et toute action est adandonnée
// note1 : une ouverture depuis un drapo ou un lien de post, désactive également toute action en cours
// note2 : le délai doit correspondre au temps maximal de chargement d'une page, il n'a pas de raison
//         d'être plus long mais il doit être suffisent pour prendre en compte les connexions lentes

var delai_page_max = 20; // secondes

// message de confirmation de changement de page

var message_page = "Etes-vous prêt à changer de page ?"

// couleur des posts

var couleur = GM_getValue("couleur", "#ffff7f");


// ***** les images

// image de fermeture

var close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAV0lEQVR42mNgGAVYwf%2F%2F%2F1XRxf79%2B6dCtGag4nog7Ykk5gkSI8UQLyAGaXAB0iCMYiCxhsA0grALOeHgAnUF6QaAvAD1M%2BleAGrCGYhAWoXsaCRa8wgEANdzdvYcqa1%2BAAAAAElFTkSuQmCC";

// images des questions

var questionoui = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA%2FklEQVR42mNgGJTg379%2FskBs%2Bf%2F%2FfwkgbQqkFYnSCFTIAtQQB6QvAfE6INYA4qlAsWtAOgtIs%2BKzlRGIo4D4JxD%2FB%2BJoqKEW%2FyHgFxAX4zNAEojPgFRCDbCGiovBxIDgBhDr4zJAHaoIBnShLuBBMhTE9MZlgAZMERRrQw3gRXIBiPbHZYAcUP4xkguMoeISSJqfALEWLgNYgWpqkGwLBNLTgHQtktfKgbgCiGVwGcIPxHOhiicAsTPUOz%2BAuAPIVwbi20CsQyg9%2BAA1zARibyD7LtRVn%2F9BwAcgViA6VQL1qgA1XIca8hdIlQJpDpKSNigpA7EbKHkDMefgyngABhh0Sgl6Bd0AAAAASUVORK5CYII%3D";

var questionall = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABAUlEQVR42mNgGJTAzu6fLBBb2tv%2FlwDSpkBakSiNQIUsQA1xQPoSEK8DYg0gngoUuwaks4A0Kz5bGYE4Coh%2FAvF%2FII6GGmoBxP%2BB%2BBcQF%2BMzQBKIz4AUQw2whoqLwcSA9A0g1sdlgDpUEQzrQl3Ag2QoSNwblwEaMEVQrA01gBfJBSDaH5cBckAFj5FcYAwVl0DS%2FASItXAZwApUVINkWyCQngaka5G8Vg7EFUAsg8sQfiCeC1U8AYidod75AcQdQL4yEN8GYh1C6cEHqGEmEHsD2XehrvoMxP%2BA%2BAMQKxCdKoGaVYAarkMN%2BQukS4E0B0lJG5SUgdgNlLyBmHNwZTwAkD7Wu2%2FdTA8AAAAASUVORK5CYII%3D";

var questionnon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABAUlEQVR42mNgGJSgrq5OFogt6%2BvrJYC0KZBWJEojUCELUEMckL4ExOuAWAOIpwLFrgHpLCDNis9WRiCOAuKfQPwfiKOhhloA8X8g%2FgXExfgMkATiMyDFUAOsoeJiMDEgfQOI9XEZoA5VBMO6UBfwIBkKEvfGZYAGTBEUa0MN4EVyAYj2x2WAHFDBYyQXGEPFJZA0PwFiLVwGsAIV1SDZFgikpwHpWiSvlQNxBRDL4DKEH4jnQhVPAGJnqHd%2BAHEHkK8MxLeBWIdQevABapgJxN5A9l2oqz4D8T8g%2FgDECkSnSqBmFaCG61BD%2FgLpUiDNQVLSBiVlIHYDJW8g5hxcGQ8A3v7Wu50bKiIAAAAASUVORK5CYII%3D";

// images des laureka

var laurekaor = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACRUlEQVR42p2SW0jTYRjGfx3QTC9MiAglEqKLuirpKgIvihAMghgEHRCSDuLIwgsv0jxkuvCwXJrJ0iZrtQ2bTlwsq4HghYWgSZhtitrAQ6HLzELq%2F%2FX991eMXGA98Nx87%2Fs87%2BmDCGjKYJOvlriberbqT5HkqCLB6yW2MJWNkfJJSyPabSI5S0dcwWmOdFbS0dfMfKADMdmNGH%2BF8PcQdJkxnD%2FLjhYTBx8Vs09KN1CjJ%2Fp%2BPlctBq63milyGggFPZpwuh8x8x5FUsy8RXwaQNQZ6LEaKbLd4EH1JQ5zRUeio4SH6Sls9ti562ng21yvTJYMDSLmRjTOS6OFAKK6nBa16%2BJMUmz5lGG8zDbpZlMfjx5iu%2BsOFYuy4uIoQplCiGmUMIMofh%2Fz4bYl3EZKy7I5QaGOKJuBSlsFmWrAWUvuD78mVmaXDIIaB58zoeZYK8mxG2lUxw8vMSmJmHYLDQ4zBW1NFCsffqseXGHAx2yDiayndqqkbN2qazgt1Hc%2Bxi9CWtthE1U8onHIy%2BKLJwQyTrJzlTg7k2S7GZdMmFQNpHil%2BpJBwMtPZyMlNeUcW2Wgk7vwtbHrXgXHF8a19uUoijIsxxnWDLqstKtL1C%2FPHgmp8rf5nJR8l6dbrizeofS76S08RwJrRfNtzox1M%2Fp5gC%2FPGjHJp1j%2BFXt3c8BlwcN%2FIuallfqPQ0zFx0fY%2Bt%2Bg20OU4xq3xh2MhV5r5%2FwaYKLPxZu6PLasyeRiOonmXC54zVR1tVLjbiKvNIf9MrT%2Bz9xfmiZDLbbFtZgAAAAASUVORK5CYII%3D";

var laurekagris = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1%2BjfqAAABdUlEQVR42mNggIM0jsk8WaIRMl1Ca7g9WRDiDC7s%2FYrBPLGuvVsXfNnwf9%2F%2Fg%2F%2F3PZnaGSnXZ91gyMDMkMteXdRSP7Wx7cNmoOTx%2F%2Bf%2Fnf9%2F%2Bv%2FJ%2F00nuxqbFmS6MIRKNy015Vowfer3Y%2F%2BP%2Fj%2F7%2FxIQXvh36X%2FDWgaGZOPadoY88aZlDAzWkv09F%2F9f%2FX%2F3%2F71%2F9%2F7d%2FLf9C9Bwht7WrGCGCLbW3vYUBob%2BkktA6Yf%2FQdI3%2F215zsDQUdA9L5cd6EgpzpmzptRNb7oB1n8TDLe%2F78pa0MfACPfJjBkLbj8CGn73%2F81%2FV4Fw06%2Bld4IV4NJxilPWL33x6N9dsG6Qgs1%2FpzY3%2BMIV%2BLMtV2kNuAa04Ma%2FK%2F%2BvABXM38zAnMrOgAysWRY3X%2F4P0n3x35qzSUIM2EBX7N4Hpz7PnMzAzYALqJjO2MaAB3DOm3H2Jb8CVjkDttquVQ%2BPAL168fnKS2WCWJT4SJekT%2B9bPmlGRY4RAxNMFABn2Mi%2FqHIQCQAAAABJRU5ErkJggg%3D%3D";

var laurekaoui = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAADPklEQVR42p2SXUyTdxTGH8pU5hZBEyOJJmaTuGQ3xLnMcOPiMmO2IUbJFiEZWk1gZIaLkVBtG8CP0qx7bWUY3trQrliLZZQUaVMpBbeI0K3QjwGlrVamKOJ0xCW6qZX3f%2FaXJbvaiPIkz%2BX55XnOOcACqj92JFNRXfSqwSBktwmy121Hl%2BUe2rt%2BKV5We3ciY6wTOd1t%2BbvspvecomH7ia%2FVbypNDfn9phPviy2nqjd1dHRmvxDsohbrh1tRlvKjZzoEuhOBdD2wJC1o3qbv7cKcw1hOHpf5SW9vb5vP5yvU6XQ5%2FwtTFOONn0S4Ux7QvTDowTXQQ%2B4nKdA5y%2B7Zn4d%2BIG97JRu87KZgMEgDAwNkt9uVJSUlK%2FV6fda%2FILEeqxynUWCugzHuRHo2yGEJsMe3wOZmID2cAA37S%2B%2BGR%2Fw01F%2FLYrEoGx0dZZFIhFwu1w2lUqnSarXFHLwUZhUyW1QoshtQ1nkG3eFOzKavgtIcRrOQ2AyYNAWKX1onXfmxgcZ%2FucAmJ29KqVRKGhwclKxWq7mqqmqrSqX6sqKiIg81pXjFcgRlTg127f8cazoaUSvxiuzevJ%2FDGE2DpodkNOB%2Biw1daWbx%2BLiUTCaZ2%2B2OPW%2FI021Uq9VHOXTDfGVrHba0adFwXotcfS0%2BeDCGceJA%2Bo0nvMV9HeyvcVDE9y4bHvZJicQEC4VC5HA4jBxSIAiCWFNTUySXyzPngd%2FVY7lNh49cZpw8b4I%2B7McYPeJAvj%2B6%2FQ%2Fw2a8yGvHv4%2Fu7JsXjCcYvLNlsthFRFMu51ykUCtl%2FXtphga6vAzPP7uMpT0h0g1eeBLsfXEGhQCuLTVylaDTKurq6bhuNRoGPZC34h5Zv8Ul7C%2FbfDKP10SR%2BT6cwl05iLuApvBMMJZ4GAoEZr9frbGpq2l5ZWblao9HkvtCDf3MYq%2Frbl8ujXhiCbgQtRnlXtycgnmoUP9yzZ%2FdrWIw%2BLa3LUx9vPea0vhNNjuRNRXrWNsXaUYDF6kDJjrUXmj%2F2TF9eSX9OZVO4b%2FMf507vKF80sPELbOxpyND1mVZ4Lzo29Z5tOSgY9Ib8RQM%2F24qMQzuRfebwspyzzduWVH8lzyosLJYtNPM3subDcuxbl50AAAAASUVORK5CYII%3D";

var laurekanon = laurekaor;

// images des tillow

var tillowoui = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAcUlEQVR42tWSyw0AIQhELYJaqJlWrIUiMHPYLOIPj07ixTBPBinlBdninI3MbLVWi8IdEdm1MUKGTkA9Gb06AMyqui32cBHpAMeXAV8OEpmzmg3wKvdsgMsidPa1639myB%2BzOuNuqf5LEDMLkl3Xx9QAmpN6iJlC5oQAAAAASUVORK5CYII%3D";

var tillownon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAc0lEQVR42tVSyw1AIQjzzAquxQqs4JXRMT28PPyiR0m4EFrbSkovlC06BuacTURMVZvGjIjsGtiTDErAGgF9NwQAl1K2y56cmRuC8GWQL4OE51PZswCvfM8CXC5B2SfX%2F8zgv%2FfqgLuj%2BodgPDmQ03N9rCoykv0weYHp6wAAAABJRU5ErkJggg%3D%3D";

// images des color

var coloroui = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAYElEQVR42mNgGF7g%2F3t9ViDWB2I%2FIA5Cw35QOVZ8BoAUnALib0D8Ew1%2Fg8rp4zPAD6rwPw4MkvPDZ0AQ1DZcBoDkQoe5ARQHIigaz%2BCJxjOEopELKSGFomFYQuIaZvkHAOKaGuoxrQfGAAAAAElFTkSuQmCC";

var colornon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAYElEQVR42mNgGF6gvr6eFYj1gdgPiIPQsB9UjhWfASAFp4D4GxD%2FRMPfoHL6%2BAzwgyr8jwOD5PzwGRAEtQ2XASC50GFuAMWBCIrGM3ii8QyhaORCSkihaBiWkLiGWf4BAHap3FtPlEipAAAAAElFTkSuQmCC";

// images des kontinue

var kontinueoui = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAWklEQVR42mNgGH7A%2Fr%2B9IhC3QrEiOQaANP6D4jNA3EGSQUDF04EYGZJmEBYDSDMIjwHIBoEMYR0QA86S6wWQxm4gVsVpM45oJF4jWkLqgGLiNaIZwkqWxgEBALpftJBeu%2FEvAAAAAElFTkSuQmCC";

var kontinuenon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAW0lEQVR42mNgGH6gvr5eEYhboViRHANAGv9B8Rkg7iDJIKDi6UD8HwmTZhAWA0gzCI8ByAaBDGEdEAPOkusFkMZuIFbFaTOOaCReI1pC6oBi4jWiGcJKlsYBAQC6X7SQZtz9vgAAAABJRU5ErkJggg%3D%3D";

// images des pagealert

var pagealertoui = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAoklEQVR42mNgGHTA3v4%2FFxA7A3ElEE8C4glQNkiMn5BmESCuAeJXQPwPiP9D8T%2BoGEhOBJ%2FNIAU%2FQJrQAdQgkFwDVpdAnfgKWTPMBWh8kBo3bAaUwZxNwACQmkpsBkxA8jMuzTAMUstK0AAcmnEaUIYW8rgMwOkFeCASwDgDESUacbgAdzQiJaQGPAmpAWdCwpGUp0CTM3FJGc0gVmRMs8wHAEkgUXjlNtmbAAAAAElFTkSuQmCC";

var pagealertnon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAoklEQVR42mNgGHSgvr6eC4idgbgSiCcB8QQoGyTGT0izCBDXAPErIP4HxP%2Bh%2BB9UDCQngs9mkIIfIE3oAGoQSK4Bq0ugTnyFrBnmAjQ%2BSI0bNgPKYM4mYABITSU2AyYg%2BRmXZhgGqWUlaAAOzTgNKEMLeVwG4PQCPBAJYJyBiBKNOFyAOxqRElIDnoTUgDMh4UjKU6DJmbikjGYQKzKmWeYDAKGgUXi2VUTpAAAAAElFTkSuQmCC";

var pagealertblink = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAoklEQVR42mNgGHTgv709FxA7A3ElEE8C4glQNkiMn5BmESCuAeJXQPwPiP9D8T%2BoGEhOBJ%2FNIAU%2FwJrQAcQgkFwDVpdAnfgKRTPMBah8kBo3bAaUwZ2N3wCQmkpsBkxA8jMuzTAMUstK2ADsmnEaUIYW8rgMwOkFRCDixzgDETUasbsAdzQiJaQGPAmpAWdCwpGUp0CTM3FJGc0gVmRMs8wHAPogUXg97yrUAAAAAElFTkSuQmCC";

// images des tooltip

var tooltipoui = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAm0lEQVR42mNgGHTA3v4%2FFxA7A3ElEE8C4glQNkiMn5BmESCuAeJXQPwPiP9D8T%2BoGEhOBJ%2FNIAU%2FYBphAMkgkFwDVpdAnfgKSTE2A%2F5D1bhhM6AMzdm4MEhNJTYDJmCzHYsL%2FkPVsuI1AI8XcBqA4QUcBuD0AsWBiBKN6IBgNCIlpAY8CakBZ0LCkZSnQJMzcUkZzSBWZEyzzAcA%2BCVM%2BFKxl14AAAAASUVORK5CYII%3D";

var tooltipnon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAm0lEQVR42mNgGHSgvr6eC4idgbgSiCcB8QQoGyTGT0izCBDXAPErIP4HxP%2Bh%2BB9UDCQngs9mkIIfMI0wgGQQSK4Bq0ugTnyFpBibAf%2BhatywGVCG5mxcGKSmEpsBE7DZjsUF%2F6FqWfEagMcLOA3A8AIOA3B6geJARIlGdEAwGpESUgOehNSAMyHhSMpToMmZuKSMZhArMqZZ5gMAUvRM%2BJ2%2BFIUAAAAASUVORK5CYII%3D";


// ***** les tooltips

// tooltip de fermeture

var titleclose = "Fermer le navigateur, réouvrir avec le laureka dans la barre du topic.";

// tooltips des questions

var titlequestionoui = "Le navigateur s'arrête sur les questions, cliquez pour changer.";

var titlequestionall = "Le navigateur s'arrête sur les questions et les questions quotées, cliquez pour changer.";

var titlequestionnon = "Le navigateur ne s'arrête pas sur les questions, cliquez pour changer.";

// tooltips des laureka

var titlelaurekaor = "Ouvrir le navigateur de laureka.";

var titlelaurekagris = "Fermer le navigateur de laureka.";

var titlelaurekaoui = "Le navigateur s'arrête sur les laureka d'argent, cliquez pour désactiver.";

var titlelaurekanon = "Le navigateur ne s'arrête pas sur les laureka d'argent, cliquez pour activer.";

// tooltips des tillow

var titletillowoui = "Le navigateur s'arrête sur les laurekalembours, cliquez pour désactiver.";

var titletillownon = "Le navigateur de ne s'arrête pas sur les laurekalembours, cliquez pour activer.";

// tooltips des color

var titlecoloroui = "Le navigateur colore les posts, cliquez pour désactiver.\nDouble-cliquez pour changer la couleur.";

var titlecolornon = "Le navigateur ne colore pas les posts, cliquez pour activer.\nDouble-cliquez pour changer la couleur.";

// tooltips des kontinue

var titlekontinueoui = "Le navigateur repart du dernier saut ou du dernier post cliqué, cliquez pour changer.";

var titlekontinuenon = "Le navigateur repart du dernier saut, cliquez pour changer.";

// tooltips des pagealert

var titlepagealertoui = "Le navigateur demande avant de passer à la page suivante, cliquez pour changer.";

var titlepagealertnon = "Le navigateur passe à la page suivante sans demander, cliquez pour changer.";

var titlepagealertblink = "Le navigateur blink au lieu de passer à la page suivante, cliquez pour changer.";

// tooltips des tooltip

var titletooltipoui = "Les tooltips sont activés, cliquez pour les désactiver.";

// tooltips des flèches

var titleprevbt = "Naviguer vers l'occident.";

var titleprevbtpage = "Naviguer vers l'occident, le prochain saut vous fera changer de page.";

var titleprevbtblink = "Naviguer vers l'occident, le prochain saut fera un blink.";

var titlenextbt = "Naviguer vers l'orient.";

var titlenextbtpage = "Naviguer vers l'orient, le prochain saut vous fera changer de page.";

var titlenextbtblink = "Naviguer vers l'orient, le prochain saut fera un blink.";

// tooltips des pages

var titlepageprev = "Simplement la page précédente.";

var titlepagenext = "Simplement la page suivante.";


// function permettant de connaitre la position absolue d'un element

function getOffset(el) {
  var _x = 0;
  var _y = 0;
  while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return {
    top: _y,
    left: _x
  };
}

// div et fonction pour le blink

GM_addStyle("#navlaublink{position:absolute;left:0;top:0;background-color:white;z-index:1009;display:none;opacity:0.5;}");
var navlaublink = document.createElement("div");
navlaublink.setAttribute("id", "navlaublink");
document.body.appendChild(navlaublink);

function blink() {
  navlaublink.style.width = document.documentElement.scrollWidth + "px";
  navlaublink.style.height = document.documentElement.scrollHeight + "px";
  navlaublink.style.display = "block";
  window.setTimeout("navlaublink.style.display='none'", 100);
}

// color picker caché

var color_picker = document.createElement("input");
color_picker.setAttribute("type", "color");
color_picker.setAttribute("value", couleur);
color_picker.style.display = "none";
color_picker.addEventListener("change", change_couleur, false);
document.body.appendChild(color_picker);

// récupération des pages prev et next si elles existent

var pageprev = document.querySelector("td.padding > div.left + div.pagepresuiv + div.pagepresuiv > a");
if(pageprev !== null) pageprev = pageprev.getAttribute("href");
var pagenext = document.querySelector("td.padding > div.left + div.pagepresuiv > a");
if(pagenext !== null) pagenext = pagenext.getAttribute("href");

// récupération de la position de lecture si elle existe

var lastpost = window.location.href.match(/^.*#t([0-9]+)$/);
if(lastpost !== null) lastpost = parseInt(lastpost.pop());

// récupération et gestion de l'affichage de la barre

var display = GM_getValue("display", true);

function displayed() {
  if(display) {
    navtable.style.display = "none";
    laurekabt.setAttribute("src", laurekaor);
    if(tooltip) laurekabt.setAttribute("title", titlelaurekaor);
    display = false;
  } else {
    navtable.style.display = "table";
    laurekabt.setAttribute("src", laurekagris);
    if(tooltip) laurekabt.setAttribute("title", titlelaurekagris);
    display = true;
  }
  GM_setValue("display", display);
}

// récupération et gestion des questions (oui > tous > non > oui)

var question = GM_getValue("question", true);

function questioned() {
  if(question === true) { // true -> all
    questionimg.setAttribute("src", questionall);
    if(tooltip) questionimg.setAttribute("title", titlequestionall);
    question = "all";
  } else if(question === "all") { // all -> false
    questionimg.setAttribute("src", questionnon);
    if(tooltip) questionimg.setAttribute("title", titlequestionnon);
    question = false;
  } else { // false -> true
    questionimg.setAttribute("src", questionoui);
    if(tooltip) questionimg.setAttribute("title", titlequestionoui);
    question = true;
  }
  GM_setValue("question", question);
  initnav();
}

// récupération et gestion des laureka

var laureka = GM_getValue("laureka", true);

function laurekaed() {
  if(laureka) {
    laurekaimg.setAttribute("src", laurekanon);
    if(tooltip) laurekaimg.setAttribute("title", titlelaurekanon);
    laureka = false;
  } else {
    laurekaimg.setAttribute("src", laurekaoui);
    if(tooltip) laurekaimg.setAttribute("title", titlelaurekaoui);
    laureka = true;
  }
  GM_setValue("laureka", laureka);
  initnav();
}

// récupération et gestion des tillow

var tillow = GM_getValue("tillow", true);

function tillowed() {
  if(tillow) {
    tillowimg.setAttribute("src", tillownon);
    if(tooltip) tillowimg.setAttribute("title", titletillownon);
    tillow = false;
  } else {
    tillowimg.setAttribute("src", tillowoui);
    if(tooltip) tillowimg.setAttribute("title", titletillowoui);
    tillow = true;
  }
  GM_setValue("tillow", tillow);
  initnav();
}

// récupération et gestion des color

var color = GM_getValue("color", false);

function colored() {
  if(color) {
    colorimg.setAttribute("src", colornon);
    if(tooltip) colorimg.setAttribute("title", titlecolornon);
    color = false;
  } else {
    colorimg.setAttribute("src", coloroui);
    if(tooltip) colorimg.setAttribute("title", titlecoloroui);
    color = true;
  }
  GM_setValue("color", color);
  if(lasthigh !== null) {
    if(color) {
      document.getElementById("para" + lastpost).parentElement.parentElement.style.backgroundColor = couleur;
    } else {
      document.getElementById("para" + lastpost).parentElement.parentElement.style.backgroundColor = lasthigh;
    }
  }
}

function change_couleur() {
  couleur = color_picker.value;
  GM_setValue("couleur", couleur);
  if(color) {
    document.getElementById("para" + lastpost).parentElement.parentElement.style.backgroundColor = couleur;
  }
}

function open_color_picker() {
  color_picker.click();
}

// récupération et gestion des kontinue

var kontinue = GM_getValue("kontinue", false);

function kontinueed() {
  if(kontinue) {
    kontinueimg.setAttribute("src", kontinuenon);
    if(tooltip) kontinueimg.setAttribute("title", titlekontinuenon);
    kontinue = false;
  } else {
    kontinueimg.setAttribute("src", kontinueoui);
    if(tooltip) kontinueimg.setAttribute("title", titlekontinueoui);
    kontinue = true;
  }
  GM_setValue("kontinue", kontinue);
  initnav();
}

// récupération et gestion du pagealert (oui > non > blink > oui)

var pagealert = GM_getValue("pagealert", true);

function pagealerted() {
  if(pagealert === true) { // true -> false
    pagealertimg.setAttribute("src", pagealertnon);
    if(tooltip) pagealertimg.setAttribute("title", titlepagealertnon);
    pagealert = false;
  } else if(pagealert === "blink") { // blink -> true
    pagealertimg.setAttribute("src", pagealertoui);
    if(tooltip) pagealertimg.setAttribute("title", titlepagealertoui);
    pagealert = true;
  } else { // false -> blink
    pagealertimg.setAttribute("src", pagealertblink);
    if(tooltip) pagealertimg.setAttribute("title", titlepagealertblink);
    pagealert = "blink";
  }
  GM_setValue("pagealert", pagealert);
  initnav();
}

// récupération et gestion du tooltip

var tooltip = GM_getValue("tooltip", true);

function tooltiped() {
  if(tooltip) {
    tooltipimg.setAttribute("src", tooltipnon);
    tooltip = false;
  } else {
    tooltipimg.setAttribute("src", tooltipoui);
    tooltip = true;
  }
  GM_setValue("tooltip", tooltip);
  set_tooltips();
  initnav(); // pour maj des tooltips des flèches
}

function set_tooltips() {
  if(tooltip) {
    if(display) laurekabt.setAttribute("title", titlelaurekagris);
    else laurekabt.setAttribute("title", titlelaurekaor);
    displayimg.setAttribute("title", titleclose);
    if(question === true) questionimg.setAttribute("title", titlequestionoui);
    else if(question === "all") questionimg.setAttribute("title", titlequestionall);
    else questionimg.setAttribute("title", titlequestionnon);
    if(laureka) laurekaimg.setAttribute("title", titlelaurekaoui);
    else laurekaimg.setAttribute("title", titlelaurekanon);
    if(tillow) tillowimg.setAttribute("title", titletillowoui);
    else tillowimg.setAttribute("title", titletillownon);
    if(color) colorimg.setAttribute("title", titlecoloroui);
    else colorimg.setAttribute("title", titlecolornon);
    if(kontinue) kontinueimg.setAttribute("title", titlekontinueoui);
    else kontinueimg.setAttribute("title", titlekontinuenon);
    if(pagealert === true) pagealertimg.setAttribute("title", titlepagealertoui);
    else if(pagealert === "blink") pagealertimg.setAttribute("title", titlepagealertblink);
    else pagealertimg.setAttribute("title", titlepagealertnon);
    tooltipimg.setAttribute("title", titletooltipoui);
    if(pageprev) pageprevbt.setAttribute("title", titlepageprev);
    if(pagenext) pagenextbt.setAttribute("title", titlepagenext);
  } else {
    laurekabt.removeAttribute("title");
    displayimg.removeAttribute("title");
    questionimg.removeAttribute("title");
    laurekaimg.removeAttribute("title");
    tillowimg.removeAttribute("title");
    colorimg.removeAttribute("title");
    kontinueimg.removeAttribute("title");
    pagealertimg.removeAttribute("title");
    tooltipimg.removeAttribute("title");
    prevbt.removeAttribute("title");
    nextbt.removeAttribute("title");
    if(pageprev) pageprevbt.removeAttribute("title");
    if(pagenext) pagenextbt.removeAttribute("title");
  }
}

// récupération des laureka, tillow et questions de la page et enregistrement dans list

var laurekas = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message:first-of-type > td.messCase2:nth-of-type(2) > div[id^=\"para\"]:nth-of-type(2) > p > img[src=\"https://forum-images.hardware.fr/images/perso/laureka.gif\"]");
var laurekanoels = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message:first-of-type > td.messCase2:nth-of-type(2) > div[id^=\"para\"]:nth-of-type(2) > p > img[src=\"https://forum-images.hardware.fr/images/perso/1/e-nyar.gif\"]");
var laurekaargents = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message:first-of-type > td.messCase2:nth-of-type(2) > div[id^=\"para\"]:nth-of-type(2) > p > img[src=\"https://forum-images.hardware.fr/images/perso/aardpeer.gif\"]");
var tillows = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message:first-of-type > td.messCase2:nth-of-type(2) > div[id^=\"para\"]:nth-of-type(2) > p > img[src=\"https://forum-images.hardware.fr/images/perso/1/tillow.gif\"]");
var questions = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message:first-of-type > td.messCase2:nth-of-type(2) > div[id^=\"para\"]:nth-of-type(2) > p > strong, div#mesdiscussions.mesdiscussions > table.messagetable > tbody > tr.message:first-of-type > td.messCase2:nth-of-type(2) > div[id^=\"para\"]:nth-of-type(2) > div.container > table.quote > tbody > tr.none > td > p > strong");
var questionalls = document.querySelectorAll("div#mesdiscussions.mesdiscussions table.messagetable > tbody > tr.message:first-of-type > td.messCase2:nth-of-type(2) > div[id^=\"para\"]:nth-of-type(2) p strong");

var list = {};
var key = null;

if(laurekas)
  for(var laureka_ka of laurekas) {
    key = parseInt(laureka_ka.parentElement.parentElement.getAttribute("id").substring(4));
    list[key] = "";
  }
if(laurekanoels)
  for(var laurekanoel_noel of laurekanoels) {
    key = parseInt(laurekanoel_noel.parentElement.parentElement.getAttribute("id").substring(4));
    list[key] = "";
  }
if(laurekaargents)
  for(var laurekaargent_argent of laurekaargents) {
    key = parseInt(laurekaargent_argent.parentElement.parentElement.getAttribute("id").substring(4));
    if(list[key] === undefined)
      list[key] = "argent";
  }
if(tillows)
  for(var tillow_low of tillows) {
    key = parseInt(tillow_low.parentElement.parentElement.getAttribute("id").substring(4));
    if(list[key] === undefined)
      list[key] = "tillow";
    else if(list[key] === "argent")
      list[key] = "argenttillow";
  }
if(questions)
  for(var question_on of questions) {
    var parent = question_on.parentElement.parentElement;
    while(parent) {
      if(parent.getAttribute("id") && (parent.getAttribute("id").substring(0, 4) === "para")) {
        key = parent.getAttribute("id").substring(4);
        break;
      }
      parent = parent.parentElement;
    }
    if(question_on.textContent === "Reprise du message précédent :") {
      // marquage des posts de reprise pour ne plus les prendre en compte
      list[key] = "reprise";
      continue;
    }
    if(list[key] === undefined)
      list[key] = "question";
    else if(list[key] === "argent")
      list[key] = "argentquestion";
    else if(list[key] === "tillow")
      list[key] = "tillowquestion";
    else if(list[key] === "argenttillow")
      list[key] = "argenttillowquestion";
  }
if(questionalls)
  for(var questionall_nall of questionalls) {
    var parent = questionall_nall.parentElement.parentElement;
    while(parent) {
      if(parent.getAttribute("id") && (parent.getAttribute("id").substring(0, 4) === "para")) {
        key = parent.getAttribute("id").substring(4);
        break;
      }
      parent = parent.parentElement;
    }
    if(list[key] === undefined)
      list[key] = "qnall";
    else if(list[key] === "argent")
      list[key] = "argentqnall";
    else if(list[key] === "tillow")
      list[key] = "tillowqnall";
    else if(list[key] === "argenttillow")
      list[key] = "argenttillowqnall";
  }

// création du bouton laureka dans la barre des boutons en haut

var laurekabt = document.createElement("img");
laurekabt.style.marginRight = "5px";
laurekabt.style.cursor = "pointer";
if(display) laurekabt.setAttribute("src", laurekagris);
else laurekabt.setAttribute("src", laurekaor);
laurekabt.addEventListener("click", displayed, false);

var mycrub = document.createElement("div");
mycrub.setAttribute("class", "right");
mycrub.appendChild(laurekabt);

var toolbar = document.querySelector("div#mesdiscussions.mesdiscussions > table.main > tbody > tr > th > div:last-of-type");
toolbar.insertBefore(mycrub, toolbar.lastElementChild);

// récupération de tablemain pour s'en servir de reférence pour la taille et la position de la navtable

var tablemain = document.querySelector("div#mesdiscussions.mesdiscussions > table.main");

// création de la navtable

var navtable = document.createElement("table");
if(display) navtable.style.display = "table";
else navtable.style.display = "none";
navtable.setAttribute("id", "navtablelaureka");
navtable.style.borderCollapse = "collapse";
navtable.style.opacity = "0.875";
navtable.style.position = "fixed";
navtable.style.bottom = "0";
navtable.setAttribute("class", "main");
var navtr = document.createElement("tr");
navtr.setAttribute("class", "cBackHeader fondForum2PagesBas");
navtable.appendChild(navtr);

var displaytd = document.createElement("td");
displaytd.style.padding = "2px";
displaytd.style.width = "15%";
displaytd.style.verticalAlign = "middle";
displaytd.style.textAlign = "left";
var displayimg = document.createElement("img");
displayimg.style.marginLeft = "5px";
displayimg.style.cursor = "pointer";
displayimg.setAttribute("src", close);
displayimg.addEventListener("click", displayed, false);
displaytd.appendChild(displayimg);
navtr.appendChild(displaytd);

var pageprevtd = document.createElement("td");
pageprevtd.style.padding = "2px";
pageprevtd.style.borderLeft = "0";
pageprevtd.style.width = "25%";
pageprevtd.style.verticalAlign = "middle";
pageprevtd.style.textAlign = "center";
if(pageprev) {
  var pageprevbt = document.createElement("a");
  pageprevbt.appendChild(document.createTextNode("Page Précédente"));
  pageprevbt.setAttribute("href", pageprev);
  pageprevbt.setAttribute("class", "cHeader");
  pageprevtd.appendChild(pageprevbt);
}
navtr.appendChild(pageprevtd);

var prevtd = document.createElement("td");
prevtd.style.padding = "2px";
prevtd.style.borderLeft = "0";
prevtd.style.width = "10%";
prevtd.style.verticalAlign = "middle";
prevtd.style.textAlign = "right";
var prevbt = document.createElement("a");
prevbt.appendChild(document.createTextNode("<<< "));
prevbt.setAttribute("href", "#");
prevbt.setAttribute("class", "cHeader");
prevbt.addEventListener("click", goprev, false);
prevtd.appendChild(prevbt);
navtr.appendChild(prevtd);

var imgtd = document.createElement("td");
imgtd.style.padding = "2px";
imgtd.style.borderLeft = "0";
imgtd.style.whiteSpace = "nowrap";
imgtd.style.verticalAlign = "middle";
imgtd.style.textAlign = "center";
var questionimg = document.createElement("img");
questionimg.style.marginLeft = "20px";
questionimg.style.marginRight = "5px";
questionimg.style.cursor = "pointer";
if(question === true) questionimg.setAttribute("src", questionoui);
else if(question === "all") questionimg.setAttribute("src", questionall);
else questionimg.setAttribute("src", questionnon);
questionimg.addEventListener("click", questioned, false);
imgtd.appendChild(questionimg);
var laurekaimg = document.createElement("img");
laurekaimg.style.marginLeft = "5px";
laurekaimg.style.marginRight = "5px";
laurekaimg.style.cursor = "pointer";
if(laureka) laurekaimg.setAttribute("src", laurekaoui);
else laurekaimg.setAttribute("src", laurekanon);
laurekaimg.addEventListener("click", laurekaed, false);
imgtd.appendChild(laurekaimg);
var tillowimg = document.createElement("img");
tillowimg.style.marginLeft = "5px";
tillowimg.style.marginRight = "20px";
tillowimg.style.cursor = "pointer";
if(tillow) tillowimg.setAttribute("src", tillowoui);
else tillowimg.setAttribute("src", tillownon);
tillowimg.addEventListener("click", tillowed, false);
imgtd.appendChild(tillowimg);
navtr.appendChild(imgtd);

var nexttd = document.createElement("td");
nexttd.style.padding = "2px";
nexttd.style.borderLeft = "0";
nexttd.style.width = "10%";
nexttd.style.verticalAlign = "middle";
nexttd.style.textAlign = "left";
var nextbt = document.createElement("a");
nextbt.appendChild(document.createTextNode(" >>>"));
nextbt.setAttribute("href", "#");
nextbt.setAttribute("class", "cHeader");
nextbt.addEventListener("click", gonext, false);
nexttd.appendChild(nextbt);
navtr.appendChild(nexttd);

var pagenexttd = document.createElement("td");
pagenexttd.style.padding = "2px";
pagenexttd.style.borderLeft = "0";
pagenexttd.style.width = "25%";
pagenexttd.style.verticalAlign = "middle";
pagenexttd.style.textAlign = "center";
if(pagenext) {
  var pagenextbt = document.createElement("a");
  pagenextbt.appendChild(document.createTextNode("Page Suivante"));
  pagenextbt.setAttribute("href", pagenext);
  pagenextbt.setAttribute("class", "cHeader");
  pagenexttd.appendChild(pagenextbt);
}
navtr.appendChild(pagenexttd);

var conftd = document.createElement("td");
conftd.style.padding = "2px";
conftd.style.borderLeft = "0";
conftd.style.width = "15%";
conftd.style.verticalAlign = "middle";
conftd.style.textAlign = "right";
var colorimg = document.createElement("img");
colorimg.style.cursor = "pointer";
if(color) colorimg.setAttribute("src", coloroui);
else colorimg.setAttribute("src", colornon);
colorimg.addEventListener("click", colored, false);
colorimg.addEventListener("dblclick", open_color_picker, false);
conftd.appendChild(colorimg);
var kontinueimg = document.createElement("img");
kontinueimg.style.cursor = "pointer";
if(kontinue) kontinueimg.setAttribute("src", kontinueoui);
else kontinueimg.setAttribute("src", kontinuenon);
kontinueimg.addEventListener("click", kontinueed, false);
conftd.appendChild(kontinueimg);
var pagealertimg = document.createElement("img");
pagealertimg.style.marginLeft = "5px";
pagealertimg.style.cursor = "pointer";
if(pagealert === true) pagealertimg.setAttribute("src", pagealertoui);
else if(pagealert === "blink") pagealertimg.setAttribute("src", pagealertblink);
else pagealertimg.setAttribute("src", pagealertnon);
pagealertimg.addEventListener("click", pagealerted, false);
conftd.appendChild(pagealertimg);
var tooltipimg = document.createElement("img");
tooltipimg.style.marginLeft = "5px";
tooltipimg.style.marginRight = "5px";
tooltipimg.style.cursor = "pointer";
if(tooltip) tooltipimg.setAttribute("src", tooltipoui);
else tooltipimg.setAttribute("src", tooltipnon);
tooltipimg.addEventListener("click", tooltiped, false);
conftd.appendChild(tooltipimg);
navtr.appendChild(conftd);

document.getElementById("mesdiscussions").appendChild(navtable);

// initialisation des tooltips

set_tooltips();

// function de gestion de la position et de la taille de la navtable pour son initialisation
// et en cas de resize ou de scroll horizontal de la fenêtre

function display_navtable(e) {
  navtable.style.left = (getOffset(tablemain).left - window.scrollX) + "px";
  navtable.style.width = (tablemain.offsetWidth - 1) + "px";
}

// fonction d'initaialisation des boutons de navigation

function initnav() {
  prev = 0;
  next = Number.MAX_VALUE;
  for(var key in list) {
    if(list[key] !== "reprise") {
      if((key < lastpost) && (key > prev) &&
        ((list[key] === "") || (list[key].includes("argent") && laureka) || (list[key].includes("tillow") && tillow) ||
          (list[key].includes("question") && ((question === true) || (question === "all"))) ||
          (list[key].includes("qnall") && (question === "all")))) {
        prev = key;
      }
      if((key > lastpost) && (key < next) &&
        ((list[key] === "") || (list[key].includes("argent") && laureka) || (list[key].includes("tillow") && tillow) ||
          (list[key].includes("question") && ((question === true) || (question === "all"))) ||
          (list[key].includes("qnall") && (question === "all")))) {
        next = key;
      }
    }
  }
  if(prev === 0) {
    if(!pageprev) {
      prevbt.style.display = "none";
    } else {
      prev = pageprev;
      prevbt.style.display = "inline";
      if(pagealert === "blink") {
        prevbt.textContent = "<< B";
        if(tooltip) prevbt.setAttribute("title", titleprevbtblink);
      } else {
        prevbt.textContent = "<< P";
        if(tooltip) prevbt.setAttribute("title", titleprevbtpage);
      }
    }
  } else {
    prevbt.style.display = "inline";
    prevbt.textContent = "<<< ";
    if(tooltip) prevbt.setAttribute("title", titleprevbt);
  }
  if(next === Number.MAX_VALUE) {
    if(!pagenext) {
      nextbt.style.display = "none";
    } else {
      next = pagenext;
      nextbt.style.display = "inline";
      if(pagealert === "blink") {
        nextbt.textContent = "B >>";
        if(tooltip) nextbt.setAttribute("title", titlenextbtblink);
      } else {
        nextbt.textContent = "P >>";
        if(tooltip) nextbt.setAttribute("title", titlenextbtpage);
      }
    }
  } else {
    nextbt.style.display = "inline";
    nextbt.textContent = " >>>";
    if(tooltip) nextbt.setAttribute("title", titlenextbt);
  }
}

// fonctions de navigation

function goprev(e) {
  if(e) e.preventDefault();
  if(prev === pageprev) {
    if((pagealert !== "blink") && ((pagealert === false) || confirm(message_page))) {
      GM_setValue("go", "prev");
      GM_setValue("lastpagecall", Date.now());
      window.location.assign(pageprev);
    } else if(pagealert === "blink") {
      blink();
    }
  } else if(prev === 0) {
    // lol nope
  } else {
    gethigh(prev, true);
    initnav();
  }
}

function gonext(e) {
  if(e) e.preventDefault();
  if(next === pagenext) {
    if((pagealert !== "blink") && ((pagealert === false) || confirm(message_page))) {
      GM_setValue("go", "next");
      GM_setValue("lastpagecall", Date.now());
      window.location.assign(pagenext);
    } else if(pagealert === "blink") {
      blink();
    }
  } else if(next === Number.MAX_VALUE) {
    // lol nope
  } else {
    gethigh(next, true);
    initnav();
  }
}

// fonction pour se déplacer sur le post, le colorer et le mémoriser

var lasthigh = null;

function gethigh(post, scroll) {
  if(color) {
    if(lasthigh !== null) {
      document.getElementById("para" + lastpost).parentElement.parentElement.style.backgroundColor = lasthigh;
    }
  }
  lasthigh = document.getElementById("para" + post).parentElement.parentElement.style.backgroundColor;
  if(color) {
    document.getElementById("para" + post).parentElement.parentElement.style.backgroundColor = couleur;
  }
  if(scroll) {
    window.scrollTo(
      0, getOffset(document.getElementById("para" + post).parentElement.parentElement.parentElement.parentElement).top);
  }
  lastpost = post;
}

// initialisation de la page

window.addEventListener("scroll", display_navtable, false);
window.addEventListener("resize", display_navtable, false);
display_navtable();
document.body.style.marginBottom = 4 + navtable.offsetHeight + "px";

// initialisation des boutons de navigation et reprise de l'action en cours si il y a lieu

var prev;
var next;

var go = GM_getValue("go");
GM_deleteValue("go");
var lastpagecall = GM_getValue("lastpagecall");
GM_deleteValue("lastpagecall");

if((lastpost === null) && go && lastpagecall && (lastpagecall > (Date.now() - (delai_page_max * 1000)))) {
  if(go === "prev") {
    lastpost = Number.MAX_VALUE;
    initnav();
    goprev();
  }
  if(go === "next") {
    lastpost = 0;
    initnav();
    gonext();
  }
} else {
  if(lastpost === null) {
    lastpost = 0;
  /*} else {
    if(color) {
      lasthigh = document.getElementById("para" + lastpost).parentElement.parentElement.style.backgroundColor;
      document.getElementById("para" + lastpost).parentElement.parentElement.style.backgroundColor = couleur;
    }*/
  }
  initnav();
}

// fonction de gestion du klick sur un post pour le mode kontinue

function klick(e) {
  if(kontinue) {
    var target = e.target;
    while(target) {
      if((target.nodeName === "TD") &&
        target.hasAttribute("class") &&
        ((target.getAttribute("class") === "messCase1") || (target.getAttribute("class") === "messCase2")) &&
        (target.parentElement.parentElement.parentElement.nodeName === "TABLE") &&
        target.parentElement.parentElement.parentElement.hasAttribute("class") &&
        (target.parentElement.parentElement.parentElement.getAttribute("class") === "messagetable"))
        break;
      target = target.parentElement;
    }
    if(target) {
      var localpost = target.parentElement.querySelector("td.messCase2:nth-of-type(2) > div[id^=\"para\"]:nth-of-type(2)");
      if(localpost) {
        localpost = localpost.getAttribute("id").substring(4);
        gethigh(localpost, false);
        initnav();
      }
    }
  }
}

document.addEventListener("click", klick, false);
