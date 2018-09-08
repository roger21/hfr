// ==UserScript==
// @name          [HFR] black liste mod_r21
// @version       3.3.3
// @namespace     http://nykal.fr
// @description   Mask messages from black listed users
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @exclude       https://forum.hardware.fr/forum1.php*
// @exclude       https://forum.hardware.fr/forum1f.php*
// @author        nykal
// @modifications refonte complète du code, simplification de l'interface, gestion de la liste via GM au lieu des cookies et gestion des messages contenant une citation bloquée
// @modtype       modification de fonctionnalités
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

// modifications roger21 $Rev: 86 $

// historique :
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

var img_blacklist = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAPCAAAAAAXVmrsAAAAAnRSTlMAAHaTzTgAAAA4SURBVHjaY2CAgLVgAg6AbFYQOMbKCmMDmXA2K4x9DAiAMtjEgRhTnBUsTLz6tWshNiAcd2ztWgBEsTPkB3369AAAAABJRU5ErkJggg%3D%3D";
var img_ok = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACl0lEQVR42q2T60uTYRiH%2FTv2bnttAwlkRCGChFD7FCQSm2ZDMQ%2FL0nRnj7TNGDbTooychzFSSssstdqc8zB1anNrSpm47FVCzH3pQLVhdLBfzztoJlifvOEHz4fnuu7nGBe311XgOyLMnTmsz%2FakMBljB8OSEVFY4kpkJM5Efbp9v%2FC%2FcJ43VSrzJId0HhluBy3oW%2BmKpnOpGSWuExD30iFxDy3dFSZdpZkTSZHr80Y41%2Fphe3UDpvnKaNixY60PjbNVOGTjRZJtvJ2SHE%2BKINOdtMHC7MSaQBkq%2FCXQzJ6DjqScpNp3HvY3D3B5ugIiC3dDdJMriAlk7iSDajwr2pmFWVDlPQPFTCEU0wVQTxfCvT4Ig1cJB5Hk9hxDwjWuISbIGBExncFmWINNqPAVQ%2FlUTsB8KKdIPPmYeOsCW6HIOtpeNMI234j4ei4TExy3J2w%2BWr2L2oAGWm8RWckAlj4uQDVZiPH1oSj8c%2BsH2p5fgWGyGH3BTvCN1GZMIH5Ib%2FavdMPoV6HWr8Xnb5%2Bi0Iev72KwZa4ealc29O6z6A92gF%2Fzt6CHZm4tNKF98Sp0U3KYfdWIfP8Shbd%2BbcHy7BLKnFnQEEFLoA7tXjPoKmp7C6l3%2BAb5QBrsq%2FdRPSmH2n0adTPlWH6%2FiLa5BpQOnoTCcQo6Zw7sr7uRbj0KupLaPsRkK09wgFyN2aPBY%2BYeKkfzoB3OgWpIBqWDDQtn48lyF4xDxeCrORu0mhLseAuJTVxpfAMVMbnL4CCS1oAZ%2BtEiXBiWo5VswU5gvbMIvFJOhMC7v8Z9DVwpbaJCkg4x2v1m9L60onfBCovXhLSWVPAVnBCt%2Bgf8p%2BiLXCFtoPR0DcXwtZwwX8UJk44MiZ4upYR7%2Fnt%2FA%2Bw9sdKFchsrAAAAAElFTkSuQmCC";
var img_cancel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACEklEQVR42q1S%2FU9SYRhlbW13%2FQ0V5Woub05zfZkCXhUhpmmb8v3h5ZKoCQjcwVBi1Q%2B19Zf0d2lWxpeR3AuX93J8qGVjgK2tZ3u3d3t2znmecx6D4R%2BrsS5dGdiEnDXS4weCQ2Fe9QUSdafH3B%2Bc3UM7k4OeSPWQNIIi3xAjaG5u48fz1Y%2B1peU7PWAU3qBNT0%2FKaG3tnJOogXWe1NGKJYB8AZ3%2Fic2RqMxaL%2F0iSGe4dlLW23uvgPcfoOfyHQI0RYlX%2FSGe1KHtxAHqqyERJwtPWUWYv9w1oh5PcuxlnOlyFnj7DiydQSMcAalD244Buf2f%2F6rVTuA5rq9JregW15Q2WCu2S%2Bu8BvYLBMwD2RxUfxDVeRurzMxyF8cUFDnFG9CRo3V8QcDtA%2BQMqnMLetkicH%2FNWfH4O1EBlAacHmDVBeymaG87ipPT%2FMVgt49XvH5okSiQkgmYBuK0DhmorrlQMVnwdXyiP0nd5eUVjw%2BatAFQjIrbCzKLlabN%2BunSChDdRP3ZCor3H%2BJoeKSbhC6LJ3Vo4RekmoRCo5NZrDRl5oqPJrnjiQesZrUBYQmndgeOR8dweGPoDwldllB3uqGJEpQ1N8gsVnpiOjfsy%2Bg493nkLvtuEaA4FvFt7B4OrhmFrinosoTa4jLK5hmdzOpx%2B%2Bj2MPdp6BbrC%2F5dZZNFKD6eGhjVofEmd3D1umD4n3UGltFKFDkd60gAAAAASUVORK5CYII%3D";
var img_add = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACeUlEQVR42rWQb0hTYRTG7UNJka1tjRAEYyFYsShUggqxsclyasKCWTPbzPwz0XAUalPDsraWOrFs1pbKcN6tmTEtzSkZZGSxlX%2BG0KdBWYTQwFIXKvfp3kuIQky%2F9MDDOe%2FL%2B%2FzO4Q0L%2Bx9SJ%2Byqqpdw5hqlO2GQsFAlZM8r4ni1Gwrnx3HK7qezSXMmBw8o35WxoUthoTRxByk9yK1ZF2CSstBGBQ1USCelzcbNVB6unOAgK441uy5Al7gdL0yVmO43YNRSipIkHjSiSBSJ%2Bcg7xl60lqeFhwSYs6N%2FBL9%2FwuwbE74ONmDccQ3%2B57cR8HtBFOydnWhXbwkJaFLsHwm878SMx4mFMYKynekDXgIPcwSekOHdUtvmmONqK1Ecj98eC4K%2Bp4wXPtrQfTkegsSCJzyxees%2Fw7wUIpwr6SiMkgzB93kODm067No0xnT%2FeuoXopJfgiN8dIkrbNm2Jsw96dgUkexQRqeOYGp6AR3TgMYHFL4DLrwCzvcB5c5uaExK5DWcgvyGMCgpO1S9Ajgga80QnTbAObqMlnGg%2BC2JgmESuQMksl0kVGYCNU4VnvmaMfbNDeOgGnKjAEeKIusYwIfK2OWZ3nLca%2B2Fsp%2BaSk1U9ZA410XijI2q%2BhS4JhvhmmoCrbqhizAO5dOAIAMYr9pHBtzXkZnXhtrBeSi6gLN2EnIrCZmFRKr2MPp8FqxWz0QzDQADmLQWV3grYpZUqltLCcphqKjVc1b5aAkfd9w50LmVTFg3oFy7AS2%2FvTCi%2Bmotd09Gb0t0UvsXvvjxPD%2B5a5Evci4K5FlLsrpY1Ltzmcl0pc8rf7ARUY%2F1lH%2FSa%2F%2Btevr%2BD5zsjQszBEUQAAAAAElFTkSuQmCC";
var img_remove = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACjUlEQVR42rWTa0jTURiHlbmki61tjQqM5UrKwr6onyqxtb8s50Qy0DIvU7GprFAs70liSgtDLNPyytC2NdNK1Hkpi6xMnGWJ0Ica5YowWkhuirPz6zhIDEL90gs%2FzsuB53lfDhwXl%2F9RqQGbC8qkvOly2SaopRwUiLm2aD9B8arg0368rBthXFITxcNNmmsRXJSGcJAeuJHI9vMvriioknHQQEE1hUplC%2BHiUqgA5w7zcMqPM7WioDRwA4xV%2BbB0qTFYm44zQQJkSLYhjREh%2BQB3TpMtd19WUBMr%2FD7z9R2mnlXhc%2B9VjOoLYe64DKvZBK1y59SbxtQ1ywoqovcOWIduY3LYAPtrLY3O2VtNWtxK8B1eFt4ia2Z7H0zVaFX%2BmB2uxcxYmzP2V81ozfSHb6DyroCpWftPWBCidedLm1I8pX0Y%2BzQNfV4YdHlyZxb6p%2BM%2F4Rn8CDxx3Vm%2BuHrdXzD%2FqN7VI1gfLwwdwLjFjiYLkDEGpLwEEh8DcZ1AY3klnsT4oFfMxj1mvbWTYecuCvZF1IdLjqthGJxH9SigekGg7CdI6iaIvU9wpagSI5mHMNNRBjJuhE2XgaE03189R9xUTsFI%2Fp75yfZsXK9vR3wXnUonKh4QxLQQnGgmMITvgp3CqJADWVygxAvf1EHolrA%2BOAWjBT7E2lOEqOQGFPfaEN0CnNQRRGoIImoJ%2BujaxNSKpfWjcCu9dyNOwVuNKseU4%2B1QKEocAfH9UNDVE5ak7ZgQ03WJAIVmz7vASvNRyUI3w7IsvoNZl%2BJxIbeYvyO8vVoY1DghYu7YRMEtcyKJYS4zNM7xPHE3vmR5YTKHjfdJrngod5s3MqzcVf%2FQgcjt2XSieWFtek78gX8DzXKLfuxv8GoAAAAASUVORK5CYII%3D";
var img_bkgnd = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAABGklEQVR42u3ZQQqDMBRFUSfZirvPNrKukoHyQUP1N4NQzoGATsPlUeq2AQAAAAAAAAAAAAAAAAAAAAAAAAAAAADAF7XW3S2QjufJcVO8DquUcjmttfNZWEwJK0YlLKYulrCYElZfqXjicgkLi8W6ixXfhYXFYs2w7tZKWFgs%2FMbCYgmLfFjHN8HR%2F1luilRco9Oj8iEaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB%2BUGvd3QLpeJ4cN8XrsEopl9NaO5%2BFxZSwYlTCYupiCYspYfWViicul7CwWKy7WPFdWFgs1gzrbq2EhcXCbywslrDIh3V8Exz9n%2BWmSMU1Oj0qH6IBAAAAAAAAAAAAAPgXH8XjYT4KbLBkAAAAAElFTkSuQmCC";
var img_bkgnd_with_quote = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAADwUlEQVR42u3ayYpiTRCG4b7nuIXa1z2IA46gOKOU84BFleKIC3UhKoJQi3Iox58IcNc0nq7mh6bfB4I8ylklH5mRyfnxAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwzwuHwxIIBMTv99uoFQwGJRKJyNPTk5RKJWGW4Fgmk5Hb7fbTWq%2FXEgqFpFgsEi44k06nfxms%2FX4vqVRKkskk4cKfCdZyuZTNZmMBSyQStnoxY%2Fj2VjibzaTT6cjLy4tEo1F5fn4mWHAerI%2BPD2k0GlIul6VWq9m4Wq3keDzK9XoVfZcZw7dXLK3z%2BWzBulwu1msxY3hINpu1APX7fel2u9Lr9WQ0GslgMJBmsynv7%2B8ynU4tYAQLjoOlYRqPxzIcDi1gGjR9fnt7k8ViYcHiZIiH5XI5C5auTlr1el1arZY9t9ttmUwm8vn5adthPB4nWHAWrK%2BvL%2BujdNS7q91uZ%2BN2u7UiWPitrfD19VUqlYqtWFq6YhUKBTsd5vN5CxzBguNTofZXWvfeSvssvcPS7VB%2FHw4HicViBAuP0Zt33QKr1ao16Vrz%2BdwuR7X0RKijbot6ScqM4eFg3e%2BrtE6nk5X2VLr93Xsu%2FY8VCw%2FTz2b0kxmfz2fl9XqtPB6PuN1uK5fLZaO%2Bx4wBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2BNuFw2EJBALi9%2Ftt1AoGgxKJROTp6UlKpZIwS3Ask8nI7Xb7aa3XawmFQlIsFgkXnEmn078M1n6%2Fl1QqJclkknDhzwRruVzKZrOxgCUSCVu9mDF8eyuczWbS6XTk5eVFotGoPD8%2FEyw4D9bHx4c0Gg0pl8tSq9VsXK1Wcjwe5Xq9ir7LjOHbK5bW%2BXy2YF0uF%2Bu1mDE8JJvNWoD6%2Fb50u13p9XoyGo1kMBhIs9mU9%2Fd3mU6nFjCCBcfB0jCNx2MZDocWMA2aPr%2B9vclisbBgcTLEw3K5nAVLVyeter0urVbLntvttkwmE%2Fn8%2FLTtMB6PEyw4C9bX15f1UTrq3dVut7Nxu91aESz81lb4%2BvoqlUrFViwtXbEKhYKdDvP5vAWOYMHxqVD7K617b6V9lt5h6Xaovw%2BHg8RiMYKFx%2BjNu26B1WrVmnSt%2BXxul6NaeiLUUbdFvSRlxvBwsO73VVqn08lKeyrd%2Fu49l%2F7HioWH6Wcz%2BsmMz%2Bez8nq9Vh6PR9xut5XL5bJR32PGAAAAAAAAAAAAAAAAAAAAAPyP%2FgN6xFwlEUspjwAAAABJRU5ErkJggg%3D%3D";

GM_addStyle(".hfrCitationListeNoire, .hfrMessageListeNoire, .hfrMessageAvecCitationListeNoire, .hfrMasquageComplet{display:none}");
GM_addStyle("div#mesdiscussions.mesdiscussions table.none tbody tr td div.left div.left{padding-left:10px;padding-right:10px;}");
GM_addStyle("div#hfrBlackListManagement table, div#hfrBlackListManagement table td{border:none;}");
GM_addStyle(".hfrStyleListeNoire{background-image:url(" + img_bkgnd + ");}");
GM_addStyle(".hfrStyleMessageAvecCitationListeNoire{background-image:url(" + img_bkgnd_with_quote + ");}");

var root = document.querySelector("div#mesdiscussions.mesdiscussions");
if(!root) {
  throw GM_info.script.name + " : root " + root;
}
var divBlackListQuestion, divBlackListManagement, divBlackListManagementPosition;

// ajoute les boutons (en haut du tableau et à côté des pseudos)
function addButtons() {
  // ajoute le bouton en haut du tableau si le liem des mp existe
  var mp = root.querySelector("table.none > tbody > tr > td > div.left");
  if(mp !== null) {
    var divListeNoire = document.createElement("div");
    divListeNoire.setAttribute("class", "left");
    var imgListenoire = document.createElement("img");
    imgListenoire.setAttribute("src", img_blacklist);
    imgListenoire.style.verticalAlign = "bottom";
    divListeNoire.appendChild(imgListenoire);
    divListeNoire.appendChild(document.createTextNode("\u00a0"));
    var aListeNoire = this.document.createElement("a");
    aListeNoire.setAttribute("class", "s1Ext hfrLinkListeNoire");
    aListeNoire.setAttribute("href", "javascript:void(null);");
    aListeNoire.appendChild(document.createTextNode("Liste\u00a0noire"));
    aListeNoire.addEventListener("click", displayBlackListManager, false);
    divListeNoire.appendChild(aListeNoire);
    mp.appendChild(divListeNoire);
  }
  // ajoute le bouton à coté des pseudos
  var pseudos = root.querySelectorAll("table.messagetable > tbody > tr > td.messCase1 > div:not([postalrecall]) > b.s2");
  for(var pseudo of pseudos) {
    // construction du bouton
    var divListeNoirePseudo = document.createElement("div");
    divListeNoirePseudo.setAttribute("class", "right");
    var imgListenoirePseudo = document.createElement("img");
    imgListenoirePseudo.setAttribute("src", img_blacklist);
    imgListenoirePseudo.style.verticalAlign = "bottom";
    imgListenoirePseudo.style.cursor = "pointer";
    var pseudoValue = pseudo.firstChild.nodeValue;
    // ouverture de la fenetre de confiramtion/gestion sur le clic du bouton
    imgListenoirePseudo.addEventListener("click", function(event) {
      var pseudoValue = this.parentElement.nextElementSibling.firstElementChild.firstChild.nodeValue;
      // suppression des fenêtres ouvertes
      if(document.getElementById("hfrBlackListQuestion")) {
        divBlackListQuestion = document.getElementById("hfrBlackListQuestion");
        divBlackListQuestion.parentElement.removeChild(divBlackListQuestion);
      }
      if(document.getElementById("hfrBlackListManagement")) {
        divBlackListManagement = document.getElementById("hfrBlackListManagement");
        divBlackListManagement.parentElement.removeChild(divBlackListManagement);
      }
      // construction de la fenêtre
      divBlackListQuestion = document.createElement("div");
      divBlackListQuestion.setAttribute("id", "hfrBlackListQuestion");
      divBlackListQuestion.style.position = "absolute";
      divBlackListQuestion.style.border = "1px solid grey";
      divBlackListQuestion.style.padding = "8px";
      divBlackListQuestion.style.background = "white";
      divBlackListQuestion.style.zIndex = "1001";
      divBlackListQuestion.style.cursor = "default";
      var divQuestion = document.createElement("div");
      divQuestion.style.fontSize = "8pt";
      var divValidation = document.createElement("div");
      divValidation.style.marginTop = "8px";
      divValidation.style.textAlign = "right";
      var inputOk = document.createElement("input");
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
          divBlackListQuestion.style.display = "none";
        }, false);
      } else {
        divQuestion.appendChild(document.createTextNode("Ajouter " + pseudoValue + " à la liste noire ?"));
        inputOk.addEventListener("click", function() {
          addToBlacklist(pseudoValue);
          hidePosts();
          hideQuotes();
          divBlackListQuestion.style.display = "none";
        }, false);
      }
      var inputCancel = document.createElement("input");
      inputCancel.setAttribute("type", "image");
      inputCancel.setAttribute("src", img_cancel);
      inputCancel.style.marginLeft = "8px";
      inputCancel.setAttribute("title", "Annuler");
      inputCancel.addEventListener("click", function() {
        divBlackListQuestion.style.display = "none";
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
    }, false);
    divListeNoirePseudo.appendChild(imgListenoirePseudo);
    pseudo.parentElement.parentElement.insertBefore(divListeNoirePseudo, pseudo.parentElement);
  }
}

// masque les messages des pseudos blacklistés
function hidePosts() {
  var posts = root.querySelectorAll("table.messagetable > tbody > tr:not(.hfrMessageListeNoire) > td.messCase1 > div:not([postalrecall]) > b.s2");
  for(var post of posts) {
    var pseudo = post.firstChild.nodeValue;
    post = post.parentElement.parentElement.parentElement;
    if(isPseudoBlacklisted(pseudo)) {
      post.classList.add("hfrMessageListeNoire");
      post.classList.add("hfrStyleListeNoire");
      post.classList.remove("hfrMessageAvecCitationListeNoire");
      post.classList.remove("hfrStyleMessageAvecCitationListeNoire");
      var oldtr = post.parentElement.querySelector("tr.hfrInfoListeNoire");
      if(oldtr !== null) {
        post.parentElement.removeChild(oldtr);
      }
      var tr = this.document.createElement("tr");
      tr.classList.add("hfrInfoListeNoire");
      if(GM_getValue("masquage_complet", false)) {
        tr.classList.add("hfrMasquageComplet");
      }
      var td = this.document.createElement("td");
      var p = this.document.createElement("p");
      p.setAttribute("style", "font-size:8pt");
      p.appendChild(document.createTextNode(pseudo + " a été bloqué "));
      var a = this.document.createElement("a");
      a.setAttribute("href", "javascript:void(null);");
      a.appendChild(this.document.createTextNode("Afficher le message"));
      a.addEventListener("click", function(event) {
        event.preventDefault();
        var post = this.parentElement.parentElement.parentElement.nextElementSibling;
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
  var posts = root.querySelectorAll("table.messagetable > tbody > tr.hfrMessageListeNoire > td.messCase1 > div:not([postalrecall]) > b.s2");
  for(var post of posts) {
    var pseudo = post.firstChild.nodeValue;
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
  var quotes = root.querySelectorAll("div.container > table.citation:not(.hfrCitationListeNoire):not(.hfrInfoListeNoire), " +
    "div.container > table.oldcitation:not(.hfrCitationListeNoire):not(.hfrInfoListeNoire)");
  for(var quote of quotes) {
    var title;
    var pseudo;
    if(quote.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild === null) {
      title = quote.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstChild.nodeValue;
    } else {
      title = quote.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstChild.nodeValue;
    }
    if(title !== null) {
      if(title.indexOf(" a écrit :") !== -1) {
        pseudo = title.substring(0, title.length - " a écrit :".length);
      } else if(title.indexOf(" a écrit ") !== -1) {
        pseudo = title.substring(0, title.length - " a écrit ".length);
      }
    } else {
      pseudo = quote.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstChild.nodeValue;
    }
    if(isPseudoBlacklisted(pseudo)) {
      var citation = quote.classList.contains("citation") ? "citation" : "oldcitation";
      quote.classList.add("hfrCitationListeNoire");
      quote.classList.add("hfrStyleListeNoire");
      var quoteListeNoire = this.document.createElement("table");
      quoteListeNoire.classList.add(citation);
      quoteListeNoire.classList.add("hfrInfoListeNoire");
      if(GM_getValue("masquage_complet", false)) {
        quoteListeNoire.classList.add("hfrMasquageComplet");
      }
      var trListeNoire = document.createElement("tr");
      trListeNoire.setAttribute("class", "none");
      var tdListeNoire = document.createElement("td");
      var bListeNoire = document.createElement("p");
      bListeNoire.setAttribute("class", "s1");
      bListeNoire.appendChild(document.createTextNode(pseudo + " a été bloqué "));
      var aListeNoire = document.createElement("a");
      aListeNoire.setAttribute("href", "javascript:void(null);");
      aListeNoire.appendChild(document.createTextNode("Afficher la citation"));
      aListeNoire.addEventListener("click", function(event) {
        event.preventDefault();
        var quote = this.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
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
  hidePostsWithQuote();
}

// affiche les citations des pseudos retirés de la black liste
function showQuotes() {
  var quotes = root.querySelectorAll("div.container > table.citation.hfrCitationListeNoire, " +
    "div.container > table.oldcitation.hfrCitationListeNoire");
  for(var quote of quotes) {
    var title;
    var pseudo;
    if(quote.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild === null) {
      title = quote.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstChild.nodeValue;
    } else {
      title = quote.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstChild.nodeValue;
    }
    if(title !== null) {
      if(title.indexOf(" a écrit :") !== -1) {
        pseudo = title.substring(0, title.length - " a écrit :".length);
      } else if(title.indexOf(" a écrit ") !== -1) {
        pseudo = title.substring(0, title.length - " a écrit ".length);
      }
    } else {
      pseudo = quote.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstChild.nodeValue;
    }
    if(!isPseudoBlacklisted(pseudo)) {
      quote.parentElement.removeChild(quote.previousElementSibling);
      quote.classList.remove("hfrCitationListeNoire");
      quote.classList.remove("hfrStyleListeNoire");
    }
  }
  showPostsWithQuote();
}

// masque les messages contenant des citations des pseudos blacklistés
function hidePostsWithQuote() {
  if(GM_getValue("messages_avec_citation", false)) {
    var posts = root.querySelectorAll("table.messagetable > tbody > tr:not(.hfrMessageListeNoire):not(.hfrMessageAvecCitationListeNoire)");
    for(var post of posts) {
      if(post.querySelector("div.container > table.citation.hfrCitationListeNoire, " +
          "div.container > table.oldcitation.hfrCitationListeNoire") !== null) {
        var pseudo = post.querySelector("td.messCase1 > div:not([postalrecall]) > b.s2").firstChild.nodeValue;
        post.classList.add("hfrMessageAvecCitationListeNoire");
        post.classList.add("hfrStyleMessageAvecCitationListeNoire");
        var tr = this.document.createElement("tr");
        tr.classList.add("hfrInfoListeNoire");
        if(GM_getValue("masquage_complet", false)) {
          tr.classList.add("hfrMasquageComplet");
        }
        var td = this.document.createElement("td");
        var p = this.document.createElement("p");
        p.setAttribute("style", "font-size:8pt");
        p.appendChild(document.createTextNode("Le message de " + pseudo + " contient une citation bloquée "));
        var a = this.document.createElement("a");
        a.setAttribute("href", "javascript:void(null);");
        a.appendChild(this.document.createTextNode("Afficher le message"));
        a.addEventListener("click", function(event) {
          event.preventDefault();
          var post = this.parentElement.parentElement.parentElement.nextElementSibling;
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
  var posts = root.querySelectorAll("table.messagetable > tbody > tr.hfrMessageAvecCitationListeNoire");
  for(var post of posts) {
    if((post.querySelector("div.container > table.citation.hfrCitationListeNoire, " +
        "div.container > table.oldcitation.hfrCitationListeNoire") === null) ||
      (GM_getValue("messages_avec_citation", false) === false)) {
      if(post.previousElementSibling) {
        post.parentElement.removeChild(post.previousElementSibling);
      }
      post.classList.remove("hfrMessageAvecCitationListeNoire");
      post.classList.remove("hfrStyleMessageAvecCitationListeNoire");
    }
  }
}

// affichage de la fenêtre de gestion de la black liste
function displayBlackListManager(event) {
  if(typeof event !== "undefined") {
    event.preventDefault();
    divBlackListManagementPosition = {
      top: (window.pageYOffset + event.clientY + 8) + "px",
      left: (event.clientX + 8) + "px"
    };
  }
  // suppression des fenêtres ouvertes
  if(document.getElementById("hfrBlackListQuestion")) {
    divBlackListQuestion = document.getElementById("hfrBlackListQuestion");
    divBlackListQuestion.parentElement.removeChild(divBlackListQuestion);
  }
  if(document.getElementById("hfrBlackListManagement")) {
    divBlackListManagement = document.getElementById("hfrBlackListManagement");
    divBlackListManagement.parentElement.removeChild(divBlackListManagement);
  }
  // construction de la fenêtre
  divBlackListManagement = document.createElement("div");
  divBlackListManagement.setAttribute("id", "hfrBlackListManagement");
  divBlackListManagement.style.position = "absolute";
  divBlackListManagement.style.border = "1px solid grey";
  divBlackListManagement.style.padding = "8px";
  divBlackListManagement.style.background = "white";
  divBlackListManagement.style.zIndex = "1001";
  divBlackListManagement.style.fontSize = "8pt";
  divBlackListManagement.style.textAlign = "left";
  divBlackListManagement.style.cursor = "default";
  var divTitle = document.createElement("div");
  divTitle.style.fontWeight = "bold";
  divTitle.appendChild(document.createTextNode("Gestion de la liste noire"));
  var inputClose = document.createElement("input");
  inputClose.setAttribute("type", "image");
  inputClose.setAttribute("src", img_cancel);
  inputClose.style.display = "block";
  inputClose.style.float = "right";
  inputClose.style.marginLeft = "8px";
  inputClose.setAttribute("title", "Fermer");
  inputClose.addEventListener("click", function() {
    divBlackListManagement.style.display = "none";
  }, false);
  divTitle.appendChild(inputClose);
  divBlackListManagement.appendChild(divTitle);
  var tableList = document.createElement("table");
  tableList.style.marginTop = "8px";
  tableList.style.borderCollapse = "collapse";
  var trWithQuote = document.createElement("tr");
  trWithQuote.setAttribute("title", "Masquer les messages contenant une citation bloquée");
  var tdLabelWithQuote = document.createElement("td");
  tdLabelWithQuote.style.verticalAlign = "bottom";
  var labelWithQuote = document.createElement("label");
  labelWithQuote.setAttribute("for", "hfrInputWithQuote");
  labelWithQuote.style.cursor = "pointer";
  labelWithQuote.appendChild(document.createTextNode("Messages avec citation :"));
  tdLabelWithQuote.appendChild(labelWithQuote);
  trWithQuote.appendChild(tdLabelWithQuote);
  var tdInputWithQuote = document.createElement("td");
  tdInputWithQuote.style.textAlign = "right";
  var inputWithQuote = document.createElement("input");
  inputWithQuote.setAttribute("type", "checkbox");
  inputWithQuote.setAttribute("id", "hfrInputWithQuote");
  inputWithQuote.style.margin = "0 1px 0 8px";
  inputWithQuote.style.verticalAlign = "bottom";
  inputWithQuote.style.cursor = "pointer";
  inputWithQuote.checked = GM_getValue("messages_avec_citation", false);
  inputWithQuote.addEventListener("change", function() {
    hidePosts();
    hideQuotes();
    GM_setValue("messages_avec_citation", this.checked);
    hidePosts();
    hideQuotes();
    showPostsWithQuote();
  }, false);
  tdInputWithQuote.appendChild(inputWithQuote);
  trWithQuote.appendChild(tdInputWithQuote);
  tableList.appendChild(trWithQuote);
  var trFullHide = document.createElement("tr");
  trFullHide.setAttribute("title", "Masquer complètement les messages et les citations bloquées");
  var tdLabelFullHide = document.createElement("td");
  tdLabelFullHide.style.verticalAlign = "bottom";
  var labelFullHide = document.createElement("label");
  labelFullHide.setAttribute("for", "hfrInputFullHide");
  labelFullHide.style.cursor = "pointer";
  labelFullHide.appendChild(document.createTextNode("Masquage complet :"));
  tdLabelFullHide.appendChild(labelFullHide);
  trFullHide.appendChild(tdLabelFullHide);
  var tdInputFullHide = document.createElement("td");
  tdInputFullHide.style.textAlign = "right";
  var inputFullHide = document.createElement("input");
  inputFullHide.setAttribute("type", "checkbox");
  inputFullHide.setAttribute("id", "hfrInputFullHide");
  inputFullHide.style.margin = "0 1px 0 8px";
  inputFullHide.style.verticalAlign = "bottom";
  inputFullHide.style.cursor = "pointer";
  inputFullHide.checked = GM_getValue("masquage_complet", false);
  inputFullHide.addEventListener("change", function() {
    GM_setValue("masquage_complet", this.checked);
    hidePosts();
    hideQuotes();
    var infos = document.querySelectorAll(".hfrInfoListeNoire");
    for(var info of infos) {
      info.classList.toggle("hfrMasquageComplet", this.checked);
    }
  }, false);
  tdInputFullHide.appendChild(inputFullHide);
  trFullHide.appendChild(tdInputFullHide);
  tableList.appendChild(trFullHide);
  var trAdd = document.createElement("tr");
  trAdd.setAttribute("title", "Ajouter un nouveau pseudo à la liste noire");
  var tdAddPseudo = document.createElement("td");
  tdAddPseudo.style.paddingTop = "6px";
  tdAddPseudo.style.paddingBottom = "2px";
  var inputPseudo = document.createElement("input");
  inputPseudo.setAttribute("type", "text");
  inputPseudo.style.fontSize = "8pt";
  inputPseudo.style.fontFamily = "Verdana,Arial,sans-serif,Helvetica";
  inputPseudo.style.padding = "1px 2px";
  tdAddPseudo.appendChild(inputPseudo);
  trAdd.appendChild(tdAddPseudo);
  var tdInputAdd = document.createElement("td");
  tdInputAdd.style.textAlign = "right";
  tdInputAdd.style.paddingTop = "6px";
  tdInputAdd.style.paddingBottom = "2px";
  var inputAdd = document.createElement("input");
  inputAdd.setAttribute("type", "image");
  inputAdd.setAttribute("src", img_add);
  inputAdd.style.marginLeft = "8px";
  inputAdd.addEventListener("click", function() {
    var pseudo = this.parentElement.parentElement.firstElementChild.firstElementChild.value.trim();
    if(pseudo !== "") {
      if(!isPseudoBlacklisted(pseudo)) {
        addToBlacklist(pseudo);
        hidePosts();
        hideQuotes();
        displayBlackListManager();
      } else {
        alert("Ce pseudo est déjà présent dans la liste noire.");
      }
    }
  }, false);
  tdInputAdd.appendChild(inputAdd);
  trAdd.appendChild(tdInputAdd);
  tableList.appendChild(trAdd);
  var blackList = JSON.parse(GM_getValue("ignore_list", "[]"));
  for(var pseudo of blackList) {
    var trRemove = document.createElement("tr");
    trRemove.setAttribute("title", "Enlever " + pseudo + " de la liste noire");
    var tdRemovePseudo = document.createElement("td");
    tdRemovePseudo.style.verticalAlign = "bottom";
    tdRemovePseudo.appendChild(document.createTextNode(pseudo));
    tdRemovePseudo.style.cursor = "default";
    trRemove.appendChild(tdRemovePseudo);
    var tdInputRemove = document.createElement("td");
    tdInputRemove.style.textAlign = "right";
    var inputRemove = document.createElement("input");
    inputRemove.setAttribute("type", "image");
    inputRemove.setAttribute("src", img_remove);
    inputRemove.dataset.pseudo = pseudo;
    inputRemove.style.marginLeft = "8px";
    inputRemove.addEventListener("click", function() {
      var pseudo = this.dataset.pseudo;
      removeFromBlacklist(pseudo);
      hidePosts();
      hideQuotes();
      showPosts();
      showQuotes();
      displayBlackListManager();
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

// suppression du caractère spécial dans les pseudos longs et conversion en minuscules
function getNormalPseudo(pseudo) {
  return pseudo.replace(/\u200b/g, "").toLowerCase();
}

// ajoute un pseudo à la black liste
function addToBlacklist(pseudoAAjouter) {
  var blacklist = JSON.parse(GM_getValue("ignore_list", "[]"));
  blacklist.push(getNormalPseudo(pseudoAAjouter));
  blacklist.sort();
  GM_setValue("ignore_list", JSON.stringify(blacklist));
}

// vérifie si un pseudo est dans la black liste
function isPseudoBlacklisted(pseudoAVerifier) {
  var blacklist = JSON.parse(GM_getValue("ignore_list", "[]"));
  return blacklist.indexOf(getNormalPseudo(pseudoAVerifier)) >= 0;
}

// enlève un pseudo de la black liste
function removeFromBlacklist(pseudoAEnlever) {
  var blacklist = JSON.parse(GM_getValue("ignore_list", "[]"));
  var i = blacklist.indexOf(getNormalPseudo(pseudoAEnlever));
  if(i >= 0) {
    blacklist.splice(i, 1);
    GM_setValue("ignore_list", JSON.stringify(blacklist));
  }
}

// conversion des cookies si présents et seulement la première fois
function conversion_des_cookies() {
  if(GM_getValue("ignore_list", null) === null && GM_getValue("masquage_complet", null) === null) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework réduit à l'essentiel utilisé
    var cookies = {
      get: function(key) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"));
      },
      remove: function(key) {
        document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      },
      has: function(key) {
        return(new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
      }
    };
    console.log(GM_info.script.name + " conversion des cookies");
    var temp;
    if(cookies.has("hfr_black_list_masquage_total")) {
      temp = cookies.get("hfr_black_list_masquage_total");
      console.log(GM_info.script.name + " le cookie hfr_black_list_masquage_total a été trouvé : " + temp);
      if(temp === "true") {
        GM_setValue("masquage_complet", true);
        console.log(GM_info.script.name + " le cookie hfr_black_list_masquage_total a été importé");
      } else {
        console.log(GM_info.script.name + " le cookie hfr_black_list_masquage_total n'a pas été importé");
      }
      //cookies.remove("hfr_black_list_masquage_total");
      //console.log(GM_info.script.name + " le cookie hfr_black_list_masquage_total a été detruit");
    } else {
      console.log(GM_info.script.name + " le cookie hfr_black_list_masquage_total n'a pas été trouvé : ");
    }
    if(cookies.has("ignore_list")) {
      temp = cookies.get("ignore_list").replace(new RegExp("'", "g"), "\"");
      console.log(GM_info.script.name + " le cookie ignore_list a été trouvé : " + temp);
      temp = JSON.parse(temp);
      if(Array.isArray(temp) && temp.length > 0) {
        GM_setValue("ignore_list", JSON.stringify(temp));
        console.log(GM_info.script.name + " le cookie ignore_list a été importé");
      } else {
        console.log(GM_info.script.name + " le cookie ignore_list n'a pas été importé");
      }
      //cookies.remove("ignore_list");
      //console.log(GM_info.script.name + " le cookie ignore_list a été detruit");
    } else {
      console.log(GM_info.script.name + " le cookie ignore_list n'a pas été trouvé : ");
    }
  }
}
conversion_des_cookies();

addButtons();
hidePosts();
hideQuotes();
