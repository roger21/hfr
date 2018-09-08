// ==UserScript==
// @name [HFR] Black List
// @version 0.7.2
// @namespace http://nykal.fr
// @description Mask messages from black listed users on forum.hardware.fr
// @include http://forum.hardware.fr/*
// @exclude http://forum.hardware.fr/message.php*
// @exclude http://forum.hardware.fr/forum1.php*
// @exclude http://forum.hardware.fr/forum1f.php*
// @grant GM_info
// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_addStyle
// @grant GM_log
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// ==/UserScript==

// file:  hfr_black_list.user.js
// author:  Nykal
// author:  anonymous contributors
// license: This file is in the public domain and comes with no warranty.
// history: 0.1 2008/12/21 first revision
// history: 0.2 2008/12/27 ajout de la fenetre d'édition. Correction du réaffichage des messages masqués
// history: 0.3 2009/02/17 petits correctifs
// history: 0.4 2009/03/02 blocage des quotes
// history: 0.5 2009/03/03 refont présentation
// history: 0.6 2009/05/11 Ajout masquage total des messages et quotes. Ajout actualisation du masquage de quotes à l'ajout.
// history: 0.7 2010/11/16 Gestion des pseudos longs (caractère zwsp).
// version: $$

var cle_masquage_total = "hfr_black_list_masquage_total";
masquerQuotesBloques();
(function () {

  injectCSS(".rightListeNoire{float:right;text-align:right}");
  var root = document.getElementById('mesdiscussions');
  var mp = getElementByXpath('table//tr//td//div[@class="left"]//div[@class="left"]', root)[0];

  var imgListenoire = document.createElement('img');
  imgListenoire.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAMUExURQUFBa2trcbGxv///8qXddIAAAAEdFJOU////wBAKqn0AAAAd0lEQVR42mJghgFGMAkQQAxABhwA+QABBOIzgAATAwOIDxBAMD6QC+YDBBBcHsoHCCAwnwkIgCpAfIAAQpcHCCCYPBCD+QABhC4PEEAQPlgazAcIIHR5gABC1w8QQOjyAAEE5jMyQlwA5AMEEAMz3ENMIA8BBBgAqWIBXrOfingAAAAASUVORK5CYII=';
  imgListenoire.setAttribute("style", "vertical-align: bottom");

  var divListeNoire = document.createElement('div');
  divListeNoire.setAttribute("class", "left");

  var textListeNoire=document.createTextNode("\u00a0");
  //divListeNoire.innerHTML="Liste noire";

  var aListeNoire = this.document.createElement('span');
  aListeNoire.setAttribute("class", "s1Ext linkListeNoire");
  //aListeNoire.setAttribute("style", "cursor: pointer;");
  injectCSS("span.linkListeNoire:hover {text-decoration:underline;} span.linkListeNoire{cursor: pointer;margin-left:0.5em;}");

  //aListeNoire.setAttribute('href', '#');
  divListeNoire.addEventListener('click', hfr_edition_liste_noire, false);
  aListeNoire.appendChild(this.document.createTextNode("Liste\u00a0noire"));

  divListeNoire.appendChild(textListeNoire);
  divListeNoire.appendChild(imgListenoire);
  divListeNoire.appendChild(aListeNoire);

  if (mp != null) {
    mp.parentNode.appendChild(divListeNoire);
  }


  // liste des auteurs de message
  var pseudos = getElementByXpath('//table//td[@class="messCase1"]//b[@class="s2"]', root);
  var linksProfil = getElementByXpath('//table//tr[@class="message"]//a[starts-with(@href, "/hfr/profil" ) and contains(@href, "#im") = false]', root);
  var cancel = false;

  // Supression de profil supprime de la liste des pseudos
  pseudos = pseudos.filter(function(pseudo){
    if (pseudo.innerHTML.match(/Profil su.*prim.*/) == null)
    {
      return pseudo;
    }
  });

  var blacklist = hfr_GM_getValue("ignore_list", new Array());
  // parcours de la liste des pseudos pour ajouter les boutons d'edition de la blacklist
  for(var i = 0; i < pseudos.length; i++)
  {
    var pseudo = pseudos[i];

    var imgListenoire = document.createElement('img');
    imgListenoire.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAMUExURQUFBa2trcbGxv///8qXddIAAAAEdFJOU////wBAKqn0AAAAd0lEQVR42mJghgFGMAkQQAxABhwA+QABBOIzgAATAwOIDxBAMD6QC+YDBBBcHsoHCCAwnwkIgCpAfIAAQpcHCCCYPBCD+QABhC4PEEAQPlgazAcIIHR5gABC1w8QQOjyAAEE5jMyQlwA5AMEEAMz3ENMIA8BBBgAqWIBXrOfingAAAAASUVORK5CYII=';
    imgListenoire.setAttribute("style", "vertical-align: bottom");
    var divListeNoire = document.createElement('div');
    divListeNoire.setAttribute("class", "right");
    divListeNoire.appendChild(imgListenoire);
    //pseudo.parentNode.previousSibling.appendChild(divListeNoire);

    pseudo.parentNode.parentNode.insertBefore(divListeNoire, pseudo.parentNode);

    // masque le message si l'utilisateur est sur la liste noire
    if (hfr_isPseudoBlacklist(pseudo.innerHTML)) {
      hfr_masquer_message(pseudo.parentNode.parentNode.parentNode, pseudo.innerHTML);
    }

    // associe la fenetre de gestion de la liste noire au clic sur un pseudo
    divListeNoire.addEventListener('click', function(event)
      {
        var theEvent = event;
        var pseudoClique = event.target.parentNode.nextSibling.textContent;

        var width = 450;
        var newDivBL;

        // Suppression d'une fenetre d'edition de liste noire déjà ouverte
        if (document.getElementById('edit_black_list'))
        {
          newDivBL = document.getElementById('edit_black_list');
          newDivBL.parentNode.removeChild(newDivBL);
        }

        // pop up de gestion de la liste noire
        newDivBL = document.createElement('div');
        newDivBL.setAttribute('id', 'edit_black_list');
        newDivBL.style.position = 'absolute';
        newDivBL.style.border = '1px solid black';
        newDivBL.style.background = "white";
        newDivBL.style.zIndex = '1001';
        newDivBL.style.width = 'auto';
        newDivBL.style.paddingBottom = '5px';

        newDivBL.style.textAlign = 'justify';


        // Message de la popup
        var divQuestion = document.createElement('div');
        //divQuestion.style.display = 'block';
        divQuestion.style.margin = '5px';
        divQuestion.style.fontSize = '8pt';
        divQuestion.style.width = 'auto';

        var divBas = document.createElement('div');
        divBas.style.clear = 'none';
        divBas.style.width = '100%';
        divBas.style.display = 'inline';

        var divView = document.createElement('div');
        //divView.style.textAlign ='left';
        //divView.style.float ='left';
        //divView.style.width ='70px';

        var viewListe = document.createElement('input');
        viewListe.type = 'image';
        viewListe.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKASURBVDjLxVNLTxNRFP7udDp9TCEtFSzloUBwY4FUF0ZjVDYsTDSw0/gjXBii/gk2GjZudO1G4wONK40CGkQSRKTybqGAfVHa6dy5M/d6WwMhccnCk3yLk3u+L9+55xwihMBRQsERQz2crK+vX3Txyn1SyfXDMnyE24AjwR0Q4qLQw1M82H4vGo1+3OeQ/RZSqdQTV2XnhkKzmqaoYJaJQj4P27LgcQGNdTocRmFzyWiJv2zqil0/EJDkt67C0oAGhtTmJpLpHEwSAPNEwBwCy+bQ7W1EsYlYWxiKdMSjvbPhniu96tra2ohmbAxovILZxCq0E5dh6M1g0jllAqYEZRw7lhRp1ZDdewW9tILAykRPingfk9Ti7BbJJ47viiC645cwNm2gYPAaefhWH4TgGB79JoU4vG6Cu0MNyMx/Bv8+hkzJtlWWW27yRfrQ0dhS+4sq0aAOqHQgOK8JGJbMKZf9/h1asPssyv56sBejqupuinEtEHI5jgNFURCuA5JZB6a0fPvBF1BLClbsmoPT7X5wKVqrbWhFqDMmFFHcKLLiNmzbBmMM7WEFAY2jbDCUJbFsMpQkjgUI4ifVWk21lqaXoBQ2mMJ94adi6wes5AxoMYOw7uBcl4JTEQFVULhhId5GcO2MJtuUEykXQRc+gb1/hLTl/VobY2JmctyfnTvvUwlEqCMPvdGEHrKgevj+wlTrxO8VL1+ebLaSc1gwA2kj9bPlYJGmPrx7bm0lrkbIrhrwewFPPbjbj+pzdSPtUh7YXsRqpiT2gp1T9NfEhcGR1zY5fEzjo3c8ud3SIKV0SJrp1wgCLjiS7/CKaU5LPCOcj918+Gb+n1X+b9f4B22tbKhgZZpBAAAAAElFTkSuQmCC';

        viewListe.style.marginLeft = '6px';
        viewListe.style.textAlign = 'left';
        viewListe.setAttribute("pseudo", pseudoClique);
        viewListe.addEventListener('click', hfr_edition_liste_noire_bis, false);

        var divValidation = document.createElement('div');
        divValidation.setAttribute("class", "rightListeNoire");

        // bouton de validation de la popup
        var inputOk = document.createElement('input');
        inputOk.type = 'image';
        inputOk.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKfSURBVDjLpZPrS1NhHMf9O3bOdmwDCWREIYKEUHsVJBI7mg3FvCxL09290jZj2EyLMnJexkgpLbPUanNOberU5taUMnHZUULMvelCtWF0sW/n7MVMEiN64AsPD8/n83uucQDi/id/DBT4Dolypw/qsz0pTMbj/WHpiDgsdSUyUmeiPt2+V7SrIM+bSss8ySGdR4abQQv6lrui6VxsRonrGCS9VEjSQ9E7CtiqdOZ4UuTqnBHO1X7YXl6Daa4yGq7vWO1D40wVDtj4kWQbn94myPGkCDPdSesczE2sCZShwl8CzcwZ6NiUs6n2nYX99T1cnKqA2EKui6+TwphA5k4yqMayopU5mANV3lNQTBdCMVUA9VQh3GuDMHiVcLCS3J4jSLhCGmKCjBEx0xlshjXYhApfMZRP5CyYD+UkG08+xt+4wLVQZA1tzxthm2tEfD3JxARH7QkbD1ZuozaggdZbxK5kAIsf5qGaKMTY2lAU/rH5HW3PLsEwUYy+YCcERmIjJpDcpzb6l7th9KtQ69fi09ePUej9l7cx2DJbD7UrG3r3afQHOyCo+V3QQzE35pvQvnAZukk5zL5qRL59jsKbPzdheXoBZc4saFhBS6AO7V4zqCpiawuptwQG+UAa7Ct3UT0hh9p9EnXT5Vh6t4C22QaUDh6HwnECOmcO7K+6kW49DKqS2DrEZCtfuI+9GrNHg4fMHVSO5kE7nAPVkAxKBxcOzsajpS4Yh4ohUPPWKTUh3PaQEptIOr6BiJjcZXCwktaAGfrRIpwblqOV3YKdhfXOIvBLeREWpnd8ynsaSJoyESFphwTtfjN6X1jRO2+FxWtCWksqBApeiFIR9K6fiTpPiigDoadqCEag5YUFKl6Yrciw0VOlhOivv/Ff8wtn0KzlebrUYwAAAABJRU5ErkJggg==';

        inputOk.style.marginRight = '6px';

        // si le pseudo cliqué est sur la liste noire le message et le bouton de validation seront différents
        if (hfr_isPseudoBlacklist(pseudoClique)) {

          divQuestion.innerHTML = "Supprimer " + pseudoClique + " de la liste des utilisateurs bloqués ?";
          inputOk.addEventListener('click', function(event)
            {
              hfr_removeFromBlacklist(pseudoClique);
              hfr_show_blacklisted(pseudoClique);
              afficherQuotesBloques(pseudoClique);
              newDivBL.style.display = 'none';
            }
                                   , false);
        } else {
          divQuestion.innerHTML = "Ajouter " + pseudoClique + " à la liste des utilisateurs bloqués ?";
          inputOk.addEventListener('click', function(event)
            {
              hfr_addToBlacklist(pseudoClique);
              hfr_hide_new_blacklisted(pseudoClique);
              masquerQuotesBloques();
              newDivBL.style.display = 'none';
            }
                                   , false);
        };

        // bouton d'annnulation de la popup
        var inputCancel = document.createElement('input');
        inputCancel.type = 'image';
        inputCancel.src =  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==';
        inputCancel.style.marginRight = '5px';
        inputCancel.addEventListener('click', function(event)
          {
            newDivBL.style.display = 'none';
          }
                                     , false);

        divValidation.appendChild(inputOk);
        divValidation.appendChild(inputCancel);
        divView.appendChild(viewListe);
        divBas.appendChild(divValidation);
        divBas.appendChild(divView);

        newDivBL.appendChild(divQuestion);
        newDivBL.appendChild(divBas);


        //positionnement de la popup
        if (theEvent.clientX + width + 25 > document.documentElement.clientWidth) {
          newDivBL.style.left = (document.documentElement.clientWidth - width - 25) + 'px';
        } else {
          newDivBL.style.left = (theEvent.clientX + 8) + 'px';
        }

        newDivBL.style.display = 'block';
        newDivBL.style.top = (window.pageYOffset + theEvent.clientY + 8) + 'px';
        root.appendChild(newDivBL);
      }
                                   , false);

  };
})();



function masquerQuotesBloques() {

  injectCSS(".citationListeNoire {display:none}");
  var classNameCitation = "citation";
  //var xpathResultCitation = document.evaluate("//*[@class = '"+classNameCitation+"']", document, null, 0, null);
  var quoteBloques = hfr_getElementsByClassName(document, classNameCitation);
  //var quoteBloques = new Array();
  //var elt = xpathResultCitation.iterateNext();
  //while (elt) {
  var elt;

  for( var i = 0; i < quoteBloques.length; i++ ) {

    elt = quoteBloques[i];


    var titreQuote = elt.firstChild.firstChild.firstChild.firstChild.textContent;
    var pseudoQuote = titreQuote.substring(0, titreQuote.length - " a ecrit :".length).toLowerCase();

    if (hfr_isPseudoBlacklist(pseudoQuote)){
      elt.setAttribute("class", "citation citationListeNoire");
      if (!hfr_GM_getValue(cle_masquage_total, false)) {
        var quoteListeNoire = this.document.createElement('table');
        quoteListeNoire.setAttribute("class", classNameCitation);
        quoteListeNoire.setAttribute("quoteBloque", pseudoQuote);
        var aListeNoire = document.createElement('a');
        aListeNoire.appendChild(document.createTextNode(pseudoQuote + " a été bloqué"));
        aListeNoire.setAttribute("class", "Topic");
        aListeNoire.addEventListener('click', function(event)
          {
            event.target.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            event.target.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild.setAttribute("class", "citation");
          }
                                     , false);

        var trListeNoire = document.createElement('tr');
        trListeNoire.setAttribute("class", "none")
          var bListeNoire = document.createElement('b');
        bListeNoire.setAttribute("class", "s1")
          quoteListeNoire.appendChild(trListeNoire).appendChild(document.createElement('td')).appendChild(bListeNoire).appendChild(aListeNoire);

        elt.parentNode.appendChild(quoteListeNoire);
      }
    }
  }

}

function afficherQuotesBloques(pseudoDebloque) {


  var xpathResult = document.evaluate("//*[@quoteBloque = '"+pseudoDebloque.toLowerCase()+"']", document, null, 0, null);
  var outArray = new Array();
  var elt = xpathResult.iterateNext();
  while (elt) {
    outArray[outArray.length] = elt;
    elt.style.display = 'none';
    elt.parentNode.firstChild.setAttribute("class", "citation");
    elt = xpathResult.iterateNext();
  }



}



/** récupère les éléments d'une classe donnée */
function hfr_getElementsByClassName(doc, className) {
  var xpathResult = doc.evaluate("//*[@class = '"+className+"']", doc, null, 0, null);
  var outArray = new Array();
  var elt = xpathResult.iterateNext();
  while (elt) {
    outArray[outArray.length] = elt;
    elt = xpathResult.iterateNext();
  }
  return outArray;
}



/** Masque les messages d'un utilisateur black listé */
function hfr_hide_new_blacklisted(blackListed) {

  var blacklist = hfr_GM_getValue("ignore_list", new Array());
  if (blacklist.length == 0) { return; }
  var nicks = hfr_getElementsByClassName(this.document, 's2');

  for (var i=0, j=nicks.length; i<j; i++) {
    var name = '';

    for (var k=0, l=nicks[i].childNodes.length; k<l; k++) {
      var node = nicks[i].childNodes[k];
      if (node.nodeType=="3") {// Text node
        name+=node.data;
      }
    }

    if (blackListed.toLowerCase() == name.toLowerCase()) {
      hfr_masquer_message(nicks[i].parentNode.parentNode.parentNode, name);
    }
  }
}

/** Masque un message et le remplace par un lien pour l'afficher */
function hfr_masquer_message(message, auteur) {
  message.style.display = 'none';
  if (!hfr_GM_getValue(cle_masquage_total, false)) {
    var tr = this.document.createElement('tr');
    var td = this.document.createElement('td');
    var a = this.document.createElement('a');
    var p = this.document.createElement('p');

    p.setAttribute('style', 'font-size:8pt');

    //p.appendChild(this.document.createTextNode(auteur + " a ete bloque "));
    p.innerHTML = auteur + " a été bloqué ";


    a.setAttribute('href', '#');

    a.addEventListener('click', hfr_blacklist_showPost, false);
    a.appendChild(this.document.createTextNode("Afficher le message"));
    p.appendChild(a);

    td.appendChild(p);
    tr.appendChild(td);
    message.parentNode.insertBefore(tr, message);
  }
}



function hfr_gestion_masquage(event) {
  if (hfr_GM_getValue(cle_masquage_total, false)) {
    hfr_GM_setValue(cle_masquage_total, false);
    event.target.src = event.target.getAttribute("srcImgExclamation");
  } else {
    hfr_GM_setValue(cle_masquage_total, true);
    event.target.src = event.target.getAttribute("srcImgAccept");
  }
}

function creerDivMasquage() {
  var divMasquageTotal = document.createElement('div');
  divMasquageTotal.style.display = 'block';
  divMasquageTotal.style.margin = '5px';
  divMasquageTotal.style.fontSize = '8pt';
  divMasquageTotal.style.width = 'auto';
  divMasquageTotal.innerHTML="Masquer les message bloqués : ";

  var inputMasquage = document.createElement('input');

  inputMasquage.setAttribute('srcImgExclamation', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJPSURBVDjLpZPLS5RhFMYfv9QJlelTQZwRb2OKlKuINuHGLlBEBEOLxAu46oL0F0QQFdWizUCrWnjBaDHgThCMoiKkhUONTqmjmDp2GZ0UnWbmfc/ztrC+GbM2dXbv4ZzfeQ7vefKMMfifyP89IbevNNCYdkN2kawkCZKfSPZTOGTf6Y/m1uflKlC3LvsNTWArr9BT2LAf+W73dn5jHclIBFZyfYWU3or7T4K7AJmbl/yG7EtX1BQXNTVCYgtgbAEAYHlqYHlrsTEVQWr63RZFuqsfDAcdQPrGRR/JF5nKGm9xUxMyr0YBAEXXHgIANq/3ADQobD2J9fAkNiMTMSFb9z8ambMAQER3JC1XttkYGGZXoyZEGyTHRuBuPgBTUu7VSnUAgAUAWutOV2MjZGkehgYUA6O5A0AlkAyRnotiX3MLlFKduYCqAtuGXpyH0XQmOj+TIURt51OzURTYZdBKV2UBSsOIcRp/TVTT4ewK6idECAihtUKOArWcjq/B8tQ6UkUR31+OYXP4sTOdisivrkMyHodWejlXwcC38Fvs8dY5xaIId89VlJy7ACpCNCFCuOp8+BJ6A631gANQSg1mVmOxxGQYRW2nHMha4B5WA3chsv22T5/B13AIicWZmNZ6cMchTXUe81Okzz54pLi0uQWp+TmkZqMwxsBV74Or3od4OISPr0e3SHa3PX0f3HXKofNH/UIG9pZ5PeUth+CyS2EMkEqs4fPEOBJLsyske48/+xD8oxcAYPzs4QaS7RR2kbLTTOTQieczfzfTv8QPldGvTGoF6/8AAAAASUVORK5CYII=');
  inputMasquage.setAttribute('srcImgAccept',  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKfSURBVDjLpZPrS1NhHMf9O3bOdmwDCWREIYKEUHsVJBI7mg3FvCxL09290jZj2EyLMnJexkgpLbPUanNOberU5taUMnHZUULMvelCtWF0sW/n7MVMEiN64AsPD8/n83uucQDi/id/DBT4Dolypw/qsz0pTMbj/WHpiDgsdSUyUmeiPt2+V7SrIM+bSss8ySGdR4abQQv6lrui6VxsRonrGCS9VEjSQ9E7CtiqdOZ4UuTqnBHO1X7YXl6Daa4yGq7vWO1D40wVDtj4kWQbn94myPGkCDPdSesczE2sCZShwl8CzcwZ6NiUs6n2nYX99T1cnKqA2EKui6+TwphA5k4yqMayopU5mANV3lNQTBdCMVUA9VQh3GuDMHiVcLCS3J4jSLhCGmKCjBEx0xlshjXYhApfMZRP5CyYD+UkG08+xt+4wLVQZA1tzxthm2tEfD3JxARH7QkbD1ZuozaggdZbxK5kAIsf5qGaKMTY2lAU/rH5HW3PLsEwUYy+YCcERmIjJpDcpzb6l7th9KtQ69fi09ePUej9l7cx2DJbD7UrG3r3afQHOyCo+V3QQzE35pvQvnAZukk5zL5qRL59jsKbPzdheXoBZc4saFhBS6AO7V4zqCpiawuptwQG+UAa7Ct3UT0hh9p9EnXT5Vh6t4C22QaUDh6HwnECOmcO7K+6kW49DKqS2DrEZCtfuI+9GrNHg4fMHVSO5kE7nAPVkAxKBxcOzsajpS4Yh4ohUPPWKTUh3PaQEptIOr6BiJjcZXCwktaAGfrRIpwblqOV3YKdhfXOIvBLeREWpnd8ynsaSJoyESFphwTtfjN6X1jRO2+FxWtCWksqBApeiFIR9K6fiTpPiigDoadqCEag5YUFKl6Yrciw0VOlhOivv/Ff8wtn0KzlebrUYwAAAABJRU5ErkJggg==');
  inputMasquage.type = 'image';
  inputMasquage.style.marginLeft = '6px';
  if (hfr_GM_getValue(cle_masquage_total, false)) {
    inputMasquage.src = inputMasquage.getAttribute("srcImgAccept");
  } else {
    inputMasquage.src = inputMasquage.getAttribute("srcImgExclamation");
  }
  inputMasquage.addEventListener('click', hfr_gestion_masquage, false);
  divMasquageTotal.appendChild(inputMasquage);
  return divMasquageTotal;

}


/** Affiche la pop up d'édition de la liste des utilisateurs bloqués */
function hfr_edition_liste_noire(event) {

  var width = 450;
  var theEvent = event;

  // Suppression d'une fenetre d'edition de liste noire déjà ouverte
  if (document.getElementById('edit_complete_black_list'))
  {
    var newDivLN = document.getElementById('edit_complete_black_list');
    newDivLN.parentNode.removeChild(newDivLN);
  }
  // pop up de gestion de la liste noire
  var newDivLN = document.createElement('div');
  newDivLN.setAttribute('id', 'edit_complete_black_list');
  newDivLN.style.position = 'absolute';
  newDivLN.style.border = '1px solid black';
  newDivLN.style.background = "white";
  newDivLN.style.zIndex = '1001';
  newDivLN.style.textAlign = 'right';
  newDivLN.style.width = 'auto';
  newDivLN.style.paddingBottom = '5px';
  // Message de la popup
  var divQuestion = document.createElement('div');
  divQuestion.style.display = 'block';
  divQuestion.style.margin = '5px';
  divQuestion.style.fontSize = '8pt';
  divQuestion.style.width = 'auto';
  divQuestion.innerHTML="Editer la liste noire";

  var blacklist = hfr_GM_getValue("ignore_list", new Array());

  var tableLN = document.createElement('table');
  tableLN.setAttribute("class", "s1Ext");

  var newLN = document.createElement('input');
  newLN.type = 'text';
  newLN.style.display = 'block';
  newLN.style.margin = '5px';
  var trLN = document.createElement('tr');
  var tdLNpseudo = document.createElement('td');
  tdLNpseudo.setAttribute("style", 'border-width:0px');
  tdLNpseudo.appendChild(newLN);
  var tdLNbtn = document.createElement('td');
  var inputAdd = document.createElement('input');
  inputAdd.type = 'image';
  inputAdd.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ8SURBVDjLpZB/SFNRFMftj5IiW9saIQjGQrBiUagEFWLDydrUhAWzNNuWTZ1oKIUzf4RlzZY6sWyrLZXhfFszQ1eac2SQkYWW0yH0l1AWITSw1IXK+/beK0RBptCFD+fcyz2fc+4NARDyP6x5qInbVVEn5sw2SHdCL2ahQsiey4jhVW9IkBPDKbmfyibN6Rw8oLgrY0MnYaEofgcpPcitWldglLLQQhXqqSKdlIaNm8k8XDnBQWYMa2ZdgS5+O14YyzHVq8eQpQiFCTwUJ4YjX8SH+hh7wapNCQ0qMGdF/gh8/4SZN0Z87a+H13ENk89vwz85AiJ378xYq2ZLUEFjxv5B//t2TA87MT9KUNiZ3D9C4KFKMBz0Cbults1RxzVWoiAWv4ctCPieMsx/tKHzciwE8blPeCLz1jUFPAkRyhW35UWIPfB9noWjLBX2shQGOn898QsRSS/BET66xBWatq0ScE86NoUlORSRyYOYmJpH2xRQ7APy3gEXXgHnewCtsxPFRgXU9acgvyEMiEsOVS4LDsia0xJP6+EcWoLJCxS8JZE7QCK7j0RWFwmlmUCVU4lnviaMfnPD0K+B3CDAkfzwWkbwoTx6adqlxb1mFxS9VFeqo7KbxLkOEmdsVKyRoGu8AV0TjaBXreciDJ4cWhBgBN6KfaTffR3p6hZU988howM4aycht5KQWUgklx1Gj8+Clat7rIkW/P2IcWtB6Uhp1KJSeWsxTjEAJTW6agVHC/m441ZB51Ywxbo+xeoJaCbteWGVV6u5e9JcpsiE1i980eM5flLHAj/RuSCQZy7KaqNR585mOtOR3i//wUagLtdQ/KTH/hdr6PM/RhGjA91Gi1AAAAAASUVORK5CYII=';
  inputAdd.style.marginRight = '6px';

  inputAdd.addEventListener('click', function()
    {
      var newBlackListed = this.parentNode.parentNode.firstChild.firstChild.value.toLowerCase();
      if (!hfr_isPseudoBlacklist(newBlackListed)) {
        hfr_addToBlacklist(newBlackListed);
      }
      hfr_hide_new_blacklisted(newBlackListed);
      masquerQuotesBloques();
      hfr_edition_liste_noire(theEvent);
    }
                            , false);


  tdLNbtn.appendChild(inputAdd);
  tdLNbtn.setAttribute("style", 'border-width:0px');

  trLN.appendChild(tdLNpseudo);
  trLN.appendChild(tdLNbtn);
  tableLN.appendChild(trLN);

  for (var i=0, j=blacklist.length; i<j; i++) {
    var trLN = document.createElement('tr');

    var tdLNpseudo = document.createElement('td');
    tdLNpseudo.innerHTML=blacklist[i];
    tdLNpseudo.setAttribute("style", 'border-width:0px');

    var tdLNbtn = document.createElement('td');
    var inputDelete = document.createElement('input');
    inputDelete.type = 'image';
    inputDelete.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKRSURBVDjLpZNrSNNRGIeVuaSLrW2NCozlSsrCvqifKrG1vyznRDLQMi9TsamsUCzvSWJKC0Ms0/I2hratmVbi3bLIysRZlgh9qFGuCKOF5KaonV9n+yAGokIHHs7hhd/zvofDcQHg8j8sW0wN2FpQJuVNl8u2QC3loEDMtUX7CYrXJDjrx8u6FcYlNVE83KbciOCiNISD9MDNRHaQf3lVQZWMgwYaVNNQqcwBF1dCBbhwlIczfpypVQWlgZvQVZUPS6cag7XpOBckQIZkB9IYEZIPcee02XL3FQU1scKfM98/YOpFFb72XseooRDm9quwmk3QKXdPvdOkrltRUBG9f8A6dBeTw0bY3+ooeufZatLhToLv8IpX2CZrYnsfTtXqVP6YHa7FzFirE/ubJrRk+sM3UHlfwNSsX1YgCNG586WNKZ7SPox9mYYhLwz6PLkTx/n5+G94Bj8BT1x3ni+u3vCPgH/c4OoRbIgXhg5g3GJHowXIGANSXgOJT4G4DkBTXolnMT7oFbPxgNlo7WDYuYuCAxH14ZKTahgHF1A9CqheESj7CZK6CWIfElwrqsRI5hHMtJeBjHfBps/AUJrvn55jbiqnYCR/38JkWzZu1rchvpN2pR0VjwhimglONREYw/fATsOokANZXKDECz/UQeiWsD45BaMFPsTaU4So5AYU99oQ3Qyc1hNEagkiagn66NjE1IKl61fhdlp3I07Be60qx5TjPa9QlMwHxPdDQUdPWELrCSGm6xIBGpq96AIr5bOShW6GZVl8BbM+xeNSbjF/V3hbtTBIMyFi7tlEwc1zIolxLjM0bv5l4l58y/LCZA4bH5Nc8VjuttDFsHLX/G0HIndm045mx9h0n3CEHfW/dpehdpL0UXsAAAAASUVORK5CYII=';
    inputDelete.style.marginRight = '6px';
    inputDelete.setAttribute("pseudo", blacklist[i]);
    inputDelete.addEventListener('click', function(event)
      {
        var pseudo = event.target.getAttribute("pseudo");
        hfr_removeFromBlacklist(pseudo);
        hfr_show_blacklisted(pseudo);
        hfr_edition_liste_noire(theEvent);
      }
                                 , false);
    tdLNbtn.appendChild(inputDelete);
    tdLNbtn.setAttribute("style", 'border-width:0px');
    trLN.appendChild(tdLNpseudo);
    trLN.appendChild(tdLNbtn);
    tableLN.appendChild(trLN);
  }

  // bouton de validation de la popup

  var inputCancel = document.createElement('input');
  inputCancel.type = 'image';
  inputCancel.src =  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==';
  inputCancel.style.marginLeft = '5px';
  inputCancel.setAttribute("style", "vertical-align: bottom");
  inputCancel.addEventListener('click', function()
    {
      newDivLN.style.display = 'none';
    }
                               , false);
  divQuestion.appendChild(inputCancel);
  newDivLN.appendChild(divQuestion);
  newDivLN.appendChild(creerDivMasquage());
  newDivLN.appendChild(tableLN);
  //positionnement de la popup
  if (theEvent.clientX + width + 25 > document.documentElement.clientWidth) {
    newDivLN.style.left = (document.documentElement.clientWidth - width - 25) + 'px';
  } else {
    newDivLN.style.left = (theEvent.clientX + 8) + 'px';
  }

  newDivLN.style.display = 'block';
  newDivLN.style.top = (window.pageYOffset + theEvent.clientY + 8) + 'px';

  var root = document.getElementById('mesdiscussions');
  root.appendChild(newDivLN);

}


/** Affiche la pop up d'édition de la liste des utilisateurs bloqués */
function hfr_edition_liste_noire_bis(event) {
  var width = 450;
  var theEvent = event;

  var pseudoClique = event.target.getAttribute("pseudo").toLowerCase();

  // Suppression d'une fenetre d'edition de liste noire déjà ouverte
  if (document.getElementById('edit_complete_black_list_bis'))
  {
    var newDivLN = document.getElementById('edit_complete_black_list_bis');
    newDivLN.parentNode.removeChild(newDivLN);
    event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKASURBVDjLxVNLTxNRFP7udDp9TCEtFSzloUBwY4FUF0ZjVDYsTDSw0/gjXBii/gk2GjZudO1G4wONK40CGkQSRKTybqGAfVHa6dy5M/d6WwMhccnCk3yLk3u+L9+55xwihMBRQsERQz2crK+vX3Txyn1SyfXDMnyE24AjwR0Q4qLQw1M82H4vGo1+3OeQ/RZSqdQTV2XnhkKzmqaoYJaJQj4P27LgcQGNdTocRmFzyWiJv2zqil0/EJDkt67C0oAGhtTmJpLpHEwSAPNEwBwCy+bQ7W1EsYlYWxiKdMSjvbPhniu96tra2ohmbAxovILZxCq0E5dh6M1g0jllAqYEZRw7lhRp1ZDdewW9tILAykRPingfk9Ti7BbJJ47viiC645cwNm2gYPAaefhWH4TgGB79JoU4vG6Cu0MNyMx/Bv8+hkzJtlWWW27yRfrQ0dhS+4sq0aAOqHQgOK8JGJbMKZf9/h1asPssyv56sBejqupuinEtEHI5jgNFURCuA5JZB6a0fPvBF1BLClbsmoPT7X5wKVqrbWhFqDMmFFHcKLLiNmzbBmMM7WEFAY2jbDCUJbFsMpQkjgUI4ifVWk21lqaXoBQ2mMJ94adi6wes5AxoMYOw7uBcl4JTEQFVULhhId5GcO2MJtuUEykXQRc+gb1/hLTl/VobY2JmctyfnTvvUwlEqCMPvdGEHrKgevj+wlTrxO8VL1+ebLaSc1gwA2kj9bPlYJGmPrx7bm0lrkbIrhrwewFPPbjbj+pzdSPtUh7YXsRqpiT2gp1T9NfEhcGR1zY5fEzjo3c8ud3SIKV0SJrp1wgCLjiS7/CKaU5LPCOcj918+Gb+n1X+b9f4B22tbKhgZZpBAAAAAElFTkSuQmCC';

  } else {
    event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALbSURBVDiNnZNLaFx1FMZ/9zXve2fSQMdOa9MK3djGLFoLCZJmqoKLFiGCWajgQoMbwVCQIl3WhRsRi6AWhYob0ZYKotZKBVF0oxRaUVJjb3TuZB5xMo/Mnblz/w8XxZIuutAfnMX54IPD4fvQWvOfZnExs3U32cqpUxOcPLmfuzB6dnF/FA6fHy48NfuvZt9hFtrX2qT53aVIuHbSUAKkACWxWv1R3tQJI50jbjQ/2pyfb+YuXPjV0FrfNpNMogHd69E+fph1YsRoRK4XUvzsJyzPxc7nif6qENUaL3nTh84YWmuqq6uXd7z51iOkUhiui+p2Ue02lw7NIAQ89v1lTM/F8fIMgwpRrY547cT18amjk4bv+68nwmApOWzjvf8VZiqF6eWRnTZio4WOBZbr4uQ9hpWAYb1O+Nw02aRNd2/5nFH5/VrN2FgudnSBfZMzyBeXsNIp7LECSAVKgZIMg4BBvYl78TzrKz+jrn9BsyeEGbf+2G4Vp9g7OQO2zefPnGb0dwtiCb4PN2+ClAxqDc48/S4kHAr7DpI8vIAIO7bpbD+gErltSClRSlES65iGvvX9OAYhQAhME+63myilkFJibtvF2H0HtKm7QTfu1hFCIFb/5IH3TmOlMyBiKJWgtAOEIJnP8/DbS0Q3biCEIFpbwWgHsbG6/Ms7ydZvi05okT77MXYmi+N5DNaqhI0mOo5JFwpkS/cQrtUIq1XUKy8Q1X6k4uz8wdBa43958Wrx3CdTdiaD4+UYVGsMmg30hx/4AOLx+T2ZsQLuvbvoV9foBwHLxx9sPvTq2aKhtWbziYWyaZtXnGwWsdlnsN5AvvwkMu2iNZijCHXiDbLj4zjZLJtBwKDXeXT3ysrXt5IItI8dK1uGfWXU7ehvZ3efN21jNmGQs5CGElKN+sOrBz+9Np3Iueao3Tq60/e/AbijaRtHjpT13Fzqrk3cM5eqTEyUt2q3L/i//ANe+reAnTZbeAAAAABJRU5ErkJggg==';
    // pop up de gestion de la liste noire
    var newDivLN = document.createElement('div');
    newDivLN.setAttribute('id', 'edit_complete_black_list_bis');
    newDivLN.style.border = '1px solid black';
    newDivLN.style.backgroundColor = "rgb(250,250,250)";
    newDivLN.style.margin = '5px';
    event.target.parentNode.parentNode.parentNode.appendChild(newDivLN);

    // Message de la popup

    var divQuestion = document.createElement('div');
    divQuestion.style.display = 'block';
    divQuestion.style.margin = '5px';
    divQuestion.style.fontSize = '8pt';
    divQuestion.style.width = 'auto';
    divQuestion.style.textAlign= 'left';

    divQuestion.innerHTML="Editer la liste noire";


    var blacklist = hfr_GM_getValue("ignore_list", new Array());

    var tableLN = document.createElement('table');
    tableLN.setAttribute("class", "s1Ext");

    var newLN = document.createElement('input');
    newLN.type = 'text';
    newLN.style.display = 'block';
    newLN.style.margin = '5px';
    var trLN = document.createElement('tr');
    var tdLNpseudo = document.createElement('td');
    tdLNpseudo.setAttribute("style", 'border-width:0px');
    tdLNpseudo.appendChild(newLN);
    var tdLNbtn = document.createElement('td');
    var inputAdd = document.createElement('input');
    inputAdd.type = 'image';
    inputAdd.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ8SURBVDjLpZB/SFNRFMftj5IiW9saIQjGQrBiUagEFWLDydrUhAWzNNuWTZ1oKIUzf4RlzZY6sWyrLZXhfFszQ1eac2SQkYWW0yH0l1AWITSw1IXK+/beK0RBptCFD+fcyz2fc+4NARDyP6x5qInbVVEn5sw2SHdCL2ahQsiey4jhVW9IkBPDKbmfyibN6Rw8oLgrY0MnYaEofgcpPcitWldglLLQQhXqqSKdlIaNm8k8XDnBQWYMa2ZdgS5+O14YyzHVq8eQpQiFCTwUJ4YjX8SH+hh7wapNCQ0qMGdF/gh8/4SZN0Z87a+H13ENk89vwz85AiJ378xYq2ZLUEFjxv5B//t2TA87MT9KUNiZ3D9C4KFKMBz0Cbults1RxzVWoiAWv4ctCPieMsx/tKHzciwE8blPeCLz1jUFPAkRyhW35UWIPfB9noWjLBX2shQGOn898QsRSS/BET66xBWatq0ScE86NoUlORSRyYOYmJpH2xRQ7APy3gEXXgHnewCtsxPFRgXU9acgvyEMiEsOVS4LDsia0xJP6+EcWoLJCxS8JZE7QCK7j0RWFwmlmUCVU4lnviaMfnPD0K+B3CDAkfzwWkbwoTx6adqlxb1mFxS9VFeqo7KbxLkOEmdsVKyRoGu8AV0TjaBXreciDJ4cWhBgBN6KfaTffR3p6hZU988howM4aycht5KQWUgklx1Gj8+Clat7rIkW/P2IcWtB6Uhp1KJSeWsxTjEAJTW6agVHC/m441ZB51Ywxbo+xeoJaCbteWGVV6u5e9JcpsiE1i980eM5flLHAj/RuSCQZy7KaqNR585mOtOR3i//wUagLtdQ/KTH/hdr6PM/RhGjA91Gi1AAAAAASUVORK5CYII=';
    inputAdd.style.marginRight = '6px';

    inputAdd.addEventListener('click', function()
      {
        var newBlackListed = this.parentNode.parentNode.firstChild.firstChild.value.toLowerCase();
        if (pseudoClique != newBlackListed) {
          if (!hfr_isPseudoBlacklist(newBlackListed)) {
            hfr_addToBlacklist(newBlackListed);
          }
          hfr_hide_new_blacklisted(newBlackListed);
          masquerQuotesBloques();
          hfr_edition_liste_noire_bis(theEvent);
        }
      }
                              , false);

    inputAdd.style.textAlign ='right';
    inputAdd.style.float ='right';


    tdLNbtn.appendChild(inputAdd);
    tdLNbtn.setAttribute("style", 'border-width:0px');

    trLN.appendChild(tdLNpseudo);
    trLN.appendChild(tdLNbtn);
    tableLN.appendChild(trLN);

    for (var i=0, j=blacklist.length; i<j; i++) {

      var trLN = document.createElement('tr');

      var tdLNpseudo = document.createElement('td');
      tdLNpseudo.innerHTML=blacklist[i];
      tdLNpseudo.setAttribute("style", 'border-width:0px');

      var tdLNbtn = document.createElement('td');
      tdLNbtn.style.textAlign="right";
      if (blacklist[i] != pseudoClique) {
        var inputDelete = document.createElement('input');
        inputDelete.type = 'image';
        inputDelete.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKRSURBVDjLpZNrSNNRGIeVuaSLrW2NCozlSsrCvqifKrG1vyznRDLQMi9TsamsUCzvSWJKC0Ms0/I2hratmVbi3bLIysRZlgh9qFGuCKOF5KaonV9n+yAGokIHHs7hhd/zvofDcQHg8j8sW0wN2FpQJuVNl8u2QC3loEDMtUX7CYrXJDjrx8u6FcYlNVE83KbciOCiNISD9MDNRHaQf3lVQZWMgwYaVNNQqcwBF1dCBbhwlIczfpypVQWlgZvQVZUPS6cag7XpOBckQIZkB9IYEZIPcee02XL3FQU1scKfM98/YOpFFb72XseooRDm9quwmk3QKXdPvdOkrltRUBG9f8A6dBeTw0bY3+ooeufZatLhToLv8IpX2CZrYnsfTtXqVP6YHa7FzFirE/ubJrRk+sM3UHlfwNSsX1YgCNG586WNKZ7SPox9mYYhLwz6PLkTx/n5+G94Bj8BT1x3ni+u3vCPgH/c4OoRbIgXhg5g3GJHowXIGANSXgOJT4G4DkBTXolnMT7oFbPxgNlo7WDYuYuCAxH14ZKTahgHF1A9CqheESj7CZK6CWIfElwrqsRI5hHMtJeBjHfBps/AUJrvn55jbiqnYCR/38JkWzZu1rchvpN2pR0VjwhimglONREYw/fATsOokANZXKDECz/UQeiWsD45BaMFPsTaU4So5AYU99oQ3Qyc1hNEagkiagn66NjE1IKl61fhdlp3I07Be60qx5TjPa9QlMwHxPdDQUdPWELrCSGm6xIBGpq96AIr5bOShW6GZVl8BbM+xeNSbjF/V3hbtTBIMyFi7tlEwc1zIolxLjM0bv5l4l58y/LCZA4bH5Nc8VjuttDFsHLX/G0HIndm045mx9h0n3CEHfW/dpehdpL0UXsAAAAASUVORK5CYII=';
        inputDelete.style.marginRight = '6px';
        inputDelete.setAttribute("pseudo", blacklist[i]);
        inputDelete.addEventListener('click', function(event)
          {
            var pseudo = event.target.getAttribute("pseudo");
            hfr_removeFromBlacklist(pseudo);
            hfr_show_blacklisted(pseudo);
            afficherQuotesBloques(pseudo);
            hfr_edition_liste_noire_bis(theEvent);
          }
                                     , false);
        tdLNbtn.appendChild(inputDelete);
      }
      tdLNbtn.setAttribute("style", 'border-width:0px');
      trLN.appendChild(tdLNpseudo);
      trLN.appendChild(tdLNbtn);
      tableLN.appendChild(trLN);
    }


    // bouton de validation de la popup

    var inputCancel = document.createElement('input');
    inputCancel.type = 'image';
    inputCancel.src =  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==';
    inputCancel.style.marginRight = '5px';
    inputCancel.setAttribute("style", "vertical-align: bottom");
    inputCancel.addEventListener('click', function()
      {
        newDivLN.style.display = 'none';
      }
                                 , false);

    var divTitre = document.createElement('div');
    divTitre.style.clear = 'none';
    divTitre.style.width = '100%';
    divTitre.style.display = 'inline';

    var divBouton = document.createElement('div');
    divBouton.style.margin = '5px';

    divBouton.appendChild(inputCancel);
    divBouton.setAttribute("class", "rightListeNoire");
    //divBouton.style.textAlign ='right';
    //divBouton.style.float ='right';



    //divTitre.appendChild(divBouton);
    divTitre.appendChild(divQuestion);
    newDivLN.appendChild(divTitre);
    newDivLN.appendChild(creerDivMasquage());
    newDivLN.appendChild(tableLN);
    //positionnement de la popup
    if (theEvent.clientX + width + 25 > document.documentElement.clientWidth) {
      newDivLN.style.left = (document.documentElement.clientWidth - width - 25) + 'px';
    } else {
      newDivLN.style.left = (theEvent.clientX + 8) + 'px';
    }

    newDivLN.style.display = 'block';
    newDivLN.style.top = (window.pageYOffset + theEvent.clientY + 8) + 'px';
  }
  //var root = document.getElementById('mesdiscussions');
  //root.appendChild(newDivLN);

}


/** Affiche les messages d'un utilisateur rétiré de la liste noire */
function hfr_show_blacklisted(unBlackListed) {
  var nicks = hfr_getElementsByClassName(this.document, 's2');

  for (var i=0, j=nicks.length; i<j; i++) {
    var name = '';

    for (var k=0, l=nicks[i].childNodes.length; k<l; k++) {
      var node = nicks[i].childNodes[k];
      if (node.nodeType=="3") {// Text node
        name+=node.data;
      }
    }
    if (name.toLowerCase() == unBlackListed.toLowerCase()) {
      var nuked = nicks[i].parentNode.parentNode.parentNode;
      nuked.style.removeProperty("display");
      var showpost = nuked.previousSibling;
      if (showpost != null) {
        nuked.parentNode.removeChild(showpost);
      }
    }
  }
}

/** Affiche le message associé au lien sur lequel on a cliqué */
function hfr_blacklist_showPost(event) {
  nuked = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1];
  nuked.style.removeProperty("display");
  var showpost = nuked.previousSibling;
  if (showpost != null) {
    nuked.parentNode.removeChild(showpost);
  }
  event.preventDefault();
}
/** Ajoute un utilisateur à la liste noire */
function hfr_addToBlacklist(pseudoAAjouter) {

  var blacklist = hfr_GM_getValue("ignore_list", new Array());
  blacklist.push(getRealPseudo(pseudoAAjouter).toLowerCase());
  blacklist.sort();
  hfr_GM_setValue("ignore_list", blacklist);
}

/** Vérifie si un utilisateur appartient à la liste noite */
function hfr_isPseudoBlacklist(pseudoAVerifier) {
  var blacklist = hfr_GM_getValue("ignore_list", new Array());

  return (searchArray(getRealPseudo(pseudoAVerifier).toLowerCase(), blacklist) >= 0);

}

function getRealPseudo(pseudoValue)
  {
    // Suppression du caractère spécial dans les pseudos longs
    return pseudoValue.split(String.fromCharCode(8203)).join('');
  }

/** Supprime un utilisateur de la liste noire */
function hfr_removeFromBlacklist(pseudoASupprimer) {

  var blacklist = hfr_GM_getValue('ignore_list', new Array());

  var i = searchArray(pseudoASupprimer.toLowerCase(), blacklist);
  if (i >=0) {
    blacklist.splice(i, 1);
    hfr_GM_setValue('ignore_list', blacklist);
  }

}

/** Récupère un élément via son path */
function getElementByXpath(path, element) {
  var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  for (;item = xpr.iterateNext();) arr.push(item);
  return arr;
}


function hfr_GM_setValue( cookieName, cookieValue, lifeTime ) {
  if( !cookieName ) { return; }
  if( lifeTime == "delete" ) { lifeTime = -10; } else { lifeTime = 31536000; }
  document.cookie = escape( cookieName ) + "=" + escape( hfr_getRecoverableString( cookieValue ) ) +
    ";expires=" + ( new Date( ( new Date() ).getTime() + ( 1000 * lifeTime ) ) ).toGMTString() + ";path=/";
}

function hfr_GM_getValue( cookieName, oDefault ) {
  var cookieJar = document.cookie.split( "; " );
  for( var x = 0; x < cookieJar.length; x++ ) {
    var oneCookie = cookieJar[x].split( "=" );
    if( oneCookie[0] == escape( cookieName ) ) {
      try {
        eval('var footm = '+unescape( oneCookie[1] ));
      } catch(e) { return oDefault; }
      return footm;
    }
  }
  return oDefault;
}

function hfr_getRecoverableString(oVar,notFirst) {
  var oType = typeof(oVar);
  if( ( oType == 'null' ) || ( oType == 'object' && !oVar ) ) {
    //most browsers say that the typeof for null is 'object', but unlike a real
    //object, it will not have any overall value
    return 'null';
  }
  if( oType == 'undefined' ) { return 'window.uDfXZ0_d'; }
  if( oType == 'object' ) {
    //Safari throws errors when comparing non-objects with window/document/etc
    if( oVar == window ) { return 'window'; }
    if( oVar == document ) { return 'document'; }
    if( oVar == document.body ) { return 'document.body'; }
    if( oVar == document.documentElement ) { return 'document.documentElement'; }
  }
  if( oVar.nodeType && ( oVar.childNodes || oVar.ownerElement ) ) { return '{error:\'DOM node\'}'; }
  if( !notFirst ) {
    Object.prototype.toRecoverableString = function (oBn) {
      if( this.tempLockIgnoreMe ) { return '{\'LoopBack\'}'; }
      this.tempLockIgnoreMe = true;
      var retVal = '{', sepChar = '', j;
      for( var i in this ) {
        if( i == 'toRecoverableString' || i == 'tempLockIgnoreMe' || i == 'prototype' || i == 'constructor' ) { continue; }
        if( oBn && ( i == 'index' || i == 'input' || i == 'length' || i == 'toRecoverableObString' ) ) { continue; }
        j = this[i];
        if( !i.match(hfr_basicObPropNameValStr) ) {
          //for some reason, you cannot use unescape when defining peoperty names inline
          for( var x = 0; x < cleanStrFromAr.length; x++ ) {
            i = i.replace(cleanStrFromAr[x],cleanStrToAr[x]);
          }
          i = '\''+i+'\'';
        } else if( window.ActiveXObject && navigator.userAgent.indexOf('Mac') + 1 && !navigator.__ice_version && window.ScriptEngine && ScriptEngine() == 'JScript' && i.match(/^\d+$/) ) {
          //IE mac does not allow numerical property names to be used unless they are quoted
          i = '\''+i+'\'';
        }
        retVal += sepChar+i+':'+hfr_getRecoverableString(j,true);
        sepChar = ',';
      }
      retVal += '}';
      this.tempLockIgnoreMe = false;
      return retVal;
    };
    Array.prototype.toRecoverableObString = Object.prototype.toRecoverableString;
    Array.prototype.toRecoverableString = function () {
      if( this.tempLock ) { return '[\'LoopBack\']'; }
      if( !this.length ) {
        var oCountProp = 0;
        for( var i in this ) { if( i != 'toRecoverableString' && i != 'toRecoverableObString' && i != 'tempLockIgnoreMe' && i != 'prototype' && i != 'constructor' && i != 'index' && i != 'input' && i != 'length' ) { oCountProp++; } }
        if( oCountProp ) { return this.toRecoverableObString(true); }
      }
      this.tempLock = true;
      var retVal = '[';
      for( var i = 0; i < this.length; i++ ) {
        retVal += (i?',':'')+hfr_getRecoverableString(this[i],true);
      }

      retVal += ']';
      delete this.tempLock;
      return retVal;
    };
    Boolean.prototype.toRecoverableString = function () {
      return ''+this+'';
    };
    Date.prototype.toRecoverableString = function () {
      return 'new Date('+this.getTime()+')';
    };
    Function.prototype.toRecoverableString = function () {
      return this.toString().replace(/^\s+|\s+$/g,'').replace(/^function\s*\w*\([^\)]*\)\s*\{\s*\[native\s+code\]\s*\}$/i,'function () {[\'native code\'];}');
    };
    Number.prototype.toRecoverableString = function () {
      if( isNaN(this) ) { return 'Number.NaN'; }
      if( this == Number.POSITIVE_INFINITY ) { return 'Number.POSITIVE_INFINITY'; }
      if( this == Number.NEGATIVE_INFINITY ) { return 'Number.NEGATIVE_INFINITY'; }
      return ''+this+'';
    };
    RegExp.prototype.toRecoverableString = function () {
      return '\/'+this.source+'\/'+(this.global?'g':'')+(this.ignoreCase?'i':'');
    };
    String.prototype.toRecoverableString = function () {
      var oTmp = escape(this);
      if( oTmp == this ) { return '\''+this+'\''; }
      return 'unescape(\''+oTmp+'\')';
    };
  }
  if( !oVar.toRecoverableString ) { return '{error:\'internal object\'}'; }

  var oTmp = oVar.toRecoverableString();

  if( !notFirst ) {
    //prevent it from changing for...in loops that the page may be using
    delete Object.prototype.toRecoverableString;
    delete Array.prototype.toRecoverableObString;
    delete Array.prototype.toRecoverableString;
    delete Boolean.prototype.toRecoverableString;
    delete Date.prototype.toRecoverableString;
    delete Function.prototype.toRecoverableString;
    delete Number.prototype.toRecoverableString;
    delete RegExp.prototype.toRecoverableString;
    delete String.prototype.toRecoverableString;
  }

  return oTmp;
}
var hfr_basicObPropNameValStr = /^\w+$/, cleanStrFromAr = new Array(/\\/g,/'/g,/"/g,/\r/g,/\n/g,/\f/g,/\t/g,new RegExp('-'+'->','g'),new RegExp('<!-'+'-','g'),/\//g), cleanStrToAr = new Array('\\\\','\\\'','\\\"','\\r','\\n','\\f','\\t','-\'+\'->','<!-\'+\'-','\\\/');


function searchArray(aChercher, tableau) {
        if (typeof(tableau) == 'undefined' || !tableau.length) return -1;

        var high = tableau.length - 1;
        var low = 0;
        aChercher = aChercher.toLowerCase();

        while (low <= high) {
          mid = parseInt((low + high) / 2)
          element = tableau[mid];
          if (element > aChercher) {
            high = mid - 1;
          } else if (element < aChercher) {
            low = mid + 1;
          } else {
            return mid;
          }
        }

        return -1;
      };

// Inject your own CSS in the page.
// Example: Do not underline link:
//          injectCSS("a{text-decoration: none;}")
function injectCSS(cssdata){
  head = document.getElementsByTagName("head")[0];
  style = document.createElement("style");
  style.setAttribute("type", 'text/css');
  style.innerHTML = cssdata;
  head.appendChild(style);
}



// ============ Module d'auto update du script ============
({
	check4Update : function()
	{
		var autoUpdate = this;
		var mirrorUrl = GM_getValue('mirrorUrl', 'null');
		if (mirrorUrl == 'null') autoUpdate.retrieveMirrorUrl();

		var currentVersion = GM_getValue('currentVersion', '0.7.2');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.7.2', currentVersion))
		{
			GM_setValue('currentVersion', '0.7.2');
			currentVersion = '0.7.2';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.7.2'))
		{
			GM_registerMenuCommand("[HFR] Black List -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'others/hfr_black_list.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Black List');
			if (isNaN(currentVersion.substring(currentVersion.length - 1))) checkUrl += '&sversion=' + currentVersion.substring(currentVersion.length - 1);

			GM_xmlhttpRequest({
				method: "GET",
				url: checkUrl,
				onload: function(response)
				{
					var regExpVersion = new RegExp('^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}[a-zA-Z]?$');
					var lastVersion = response.responseText;
					// Pas d'erreur et nouvelle version plus récente
					if (lastVersion != '-1' && regExpVersion.test(lastVersion) && autoUpdate.isLater(lastVersion, currentVersion))
					{
						if (confirm('Une nouvelle version de [HFR] Black List est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'others/hfr_black_list.user.js');
						}
						else
						{
							// Mémorisation de la version refusée : elle servira de version de référence
							GM_setValue('currentVersion', lastVersion);
						}
					}
					GM_setValue('lastVersionCheck', new Date().getTime() + '');
				}
			});
		}
	},

	max : function(v1, v2)
	{
		var tabV1 = v1.split('.');
		var tabV2 = v2.split('.');
		
		if (isNaN(tabV1[2].substring(tabV1[2].length - 1))) tabV1[2] = tabV1[2].substring(0, tabV1[2].length - 1);
		if (isNaN(tabV2[2].substring(tabV2[2].length - 1))) tabV2[2] = tabV2[2].substring(0, tabV2[2].length - 1);

		if ((tabV1[0] > tabV2[0])
		|| (tabV1[0] == tabV2[0] && tabV1[1] > tabV2[1])
		|| (tabV1[0] == tabV2[0] && tabV1[1] == tabV2[1] && tabV1[2] > tabV2[2]))
		{
			return v1;
		}
		else
		{
			return v2;
		}		
	},

	isLater : function(v1, v2)
	{
		return v1 != v2 && this.max(v1, v2) == v1;
	},

	retrieveMirrorUrl : function()
	{	
		var mirrors = 'http://hfr.toyonos.info/gm/;http://hfr-mirror.toyonos.info/gm/'.split(';');
		var checkMirror = function (i)
		{
			var mirror = mirrors[i];
			GM_xmlhttpRequest({
				url: mirror + 'getLastVersion.php5',
				method: "HEAD",
				onload: function(response)
				{
					// Dès qu'un miroir répond, on le mémorise.
					if (response.status == 200)
					{
						GM_setValue('mirrorUrl', mirror);
					}
					else
					{
						// Sinon on test le prochain
						if ((i + 1) < mirrors.length)
						{
							checkMirror(i + 1);
						}
						else
						{
							GM_setValue('mirrorUrl', 'null');
						}
					}
				}
			});		
		};
		checkMirror(0);
	},
}).check4Update();