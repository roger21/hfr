// ==UserScript==
// @name          [HFR] limitation de la taille des images mod_r21
// @version       2.1.2
// @namespace     http://toyonos.info
// @description   Permet de limiter la taille des images dans les posts et de leur rendre leur taille d'origine par un clic sur une icône
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @author        toyonos
// @modifications basé sur la version b - désactivation de la fonctionalité de redimensionnement du forum pour permetre au script de fonctionner comme avant
// @modtype       évolution de fonctionnalités
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
// @grant         unsafeWindow
// ==/UserScript==

// modifications roger21 $Rev: 2 $

// historique :
// 2.1.2 (28/11/2017) :
// - passage au https
// 2.1.1 (06/08/2016) :
// - ajout du nom de la version de base dans la metadata @modifications
// 2.1.0 (22/11/2015) :
// - nouveau nom : [HFR] Limitation de la taille des images mod_r21 -> [HFR] limitation de la taille des images mod_r21
// 2.0.0 (21/11/2015) :
// - ajout de la prise en compte des titles déjà modifiés par [HFR] Smart Auto Rehost
// - nouveau numéro de version : 0.2.4b.10 -> 2.0.0
// - nouveau nom : [HFR] Limitation de la taille des images -> [HFR] Limitation de la taille des images mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.2.4b.10 (22/08/2015) :
// - ajout des images dans le code en base64
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - remplacement des ' par des " (pasque !)
// - amélioration des fonctions de saisie des tailles
// 0.2.4b.9 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.2.4b.8 (08/09/2014) :
// - repassage à reho.st (au lieu de free.fr) pour l'hebergement des images et icones utilisés par le script
// - suppression du module d'auto-update (code mort)
// 0.2.4b.7 (01/09/2014) :
// - ajout du support pour le nouveau SDK de unsafeWindow (ff 30+ / gm 2+)
// 0.2.4b.6 (14/05/2014) :
// - repassage à free.fr (au lieu de reho.st) pour l'hebergement des images et icones utilisés par le script
// 0.2.4b.5 (04/04/2014) :
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 0.2.4b.4 (18/03/2014) :
// - utilisation de reho.st pour les images du script (au lieu de roger21.free.fr)
// - ajout de la metadata @grant unsafeWindow
// - maj des metadata @grant et indentation des metadata
// 0.2.4b.3 (14/09/2012) :
// - ajout des metadata @grant
// 0.2.4b.1 à 0.2.4b.2 (13/05/2012) :
// - changement de l'image d'"expand"
// - ajout d'un image de "reduce"
// - "compatibilité" avec md_verif_size
// - ajout d'un .1 sur le numero de version
// - désactivation de l'auto-update pour conserver les modifs

function killItWithFire() {}
if(typeof exportFunction !== "undefined") {
  exportFunction(killItWithFire, unsafeWindow, {
    defineAs: "killItWithFire"
  });
  unsafeWindow.md_verif_size = unsafeWindow.killItWithFire;
} else {
  unsafeWindow.md_verif_size = killItWithFire;
}

var reduceImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAVCAYAAADxaDaPAAAAAXNSR0IArs4c6QAAA%2FJJREFUWMPtmEssO10Yxn%2FTGnWrul%2BimvyLbpQIS4kmRGwI4rLAztZCYoG1jZWIHSuJhS5IJJW4JEQkDRKS2pAQl9QtLkG1pFFm%2FosvnWgN6su3%2BcKzmjnzzHueZ8573nPOCL29vTI%2FFFEAg4ODP854X18fGn4wfs3%2Fmv8fIRAIIEnSf1PwwvH09MTQ0FAoMSqKlJQUqqqqyMvLU%2BUEUVJSQm1tLT6fj%2BHhYaVdEATi4%2BMpLi7GZrOh1WoVzp8%2Ff2hvb1e4k5OTHBwc0N3dTUJCAgBra2usrq5yd3eHRqMhPz%2Bf%2Bvp6UlNTI9ITkXlZlvH5fOj1egoKCgDw%2B%2F3s7u4yPj5Of3%2B%2FKieIrKws1TgvLy%2B43W4WFxe5vb2lublZ4Tw9Pb0bAJ%2FPhyz%2FsxKvrKwwPz9PRkYGNpuN6%2BtrdnZ2GB0dpaenJyI9EZkPIiMjg9bWVuXebrfjcrk4Pz8nOztblfNVnEAgwMjICFtbW1RWViKK4pfp6ff7WVpaIikpia6uLqKjowGYnp7m7OyMq6srUlJSItYTkXlJknh8fATA4%2FFwdnYGgMFgUDher5fNzc2Q9ywWC4mJiaoxRVGkqKiI5eVljo6OsFgsX4o8Pj4mEAhQWFioGAdoampSroM6v6PnU%2FNHR0cMDAyEzPuamhrS09OVzq6urpiamgp5r7Oz80PzgDKHw1P9I3i9XgDi4%2BO%2F5H5Hz6fmMzMzqaioYGNjA7fbTXV1NTabLYRjMpnepdnbzFDD8%2FMzANHR0QiCwEd1J1gkg6Pt9%2FvfTQdRFNFqtf9Kz6fmExISKCsrw2q1Mjw8zNzcHHq9ntLS0pA0TktL%2B9YSc3h4CEBOTg4xMTEhoxuexjqdDpPJBMD%2B%2Fj6yLCsfbGFhAZfLRUdHh1LUvqMnKhKSTqejpaWFsbExHA4HFotFEfDw8MD6%2Bvq7j2a1WpX7IEeSJE5OTtjb28NsNmM0GgEwGo2cnp7icDjIy8vj9PSUi4sLjEYjoiiSnJxMSUkJLpcLu91OcXEx5%2BfnrK%2BvExcXR05ODq%2BvrxHr%2BZZ5ALPZTHl5OU6nk9nZWerq6gC4vr5mZmYmhJubmxvS2VuORqPBarXS2NioPG9paWFiYgKn04nT6VRStaGhIaS4SZLE9vY229vbCqetrY2YmBglUyLRo%2Bw7ent75fBTnSRJ3N%2FfI4oier1eaX99fcXj8SAIAgaDgfv7e%2FV0iooiMTFRiROEVqslLi5OdXmTZZnLy0t8Ph%2BxsbFkZWWFzOUgPB4PNzc36HQ6srOzFU54X2p6wk91qiOv0WiUdfMttFptSLsaJ5I4ahAE4cPNSHjxUitg3%2Bnr92Dza%2F4HQ%2FjJ%2F%2FD%2BAqH1tibwWW9CAAAAAElFTkSuQmCC";
var expandImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAVCAYAAAAeql2xAAAAAXNSR0IArs4c6QAABGpJREFUWMPtmE1LG2sUx38ZkwZNNFHUqImmBlTE96a%2BbiIWlCKFaqGKS126cacfwYUULV30GxRKMXFTqoUqIsEYTYwlooKWYktBBaNGjcZkurh0rmNic3O3emBgOGfOy%2F%2Bc5%2FnPPKMYHh4WuYOiBBgdHb1ToEdGRhC4o3IP%2FB74XSK3m3J2dsarV6%2FiOtTW1mIwGJienqakpISenh4Atre3effuHXl5efT39xMKhWQxBEFArVZTXl5OR0cHKSkpkm1ycpL19XVqamp49uyZpA%2BFQoyNjZGWlsbg4CBqtRqAjx8%2F4vF4GBoaAmB8fFzyUSgUaDQaqqursdlssjwJJy6KIsFgEIVCQWlpqezKy8vDarWi0%2Bnwer1sbm5ydXWFw%2BHg9PSU9vZ2BEGIiVFcXEwoFGJ%2Bfp65uTkp1%2Fn5OR6Ph2AwiNvt5uLiIqaOvb09ZmZmZA0JBoOIonhrnpmZGex2e3IT%2FyO5ubm8fPkyru3Fixe8efMGh8NBXV0d%2B%2Fv7tLS0UFRUdGuMg4MDxsbG2NjY4MmTJwB4vV6urq4wm818%2F%2F6d1dVVGhsbY%2FI5nU6sVisFBQUJaw2Hw7x%2B%2FZqVlRXa2trIyspKbo%2BfnJywvLwsu46PjwEoKCjAZrNxeHjIly9f0Ov1dHR0%2FHVfHR4e%2FtNt5b%2F9drvdqNVqent7EQSBpaWlGD%2BDwYAoitjtdkQx8feWSqWiqqoKURT59u1b8hPf29vjw4cPMt3AwAAZGRkANDc3Mzc3hyiKNDY2Snvwuuzu7jIxMUE4HObg4ACA%2Bvp6AH78%2BMGvX794%2FPgxmZmZlJaWsrGxwc%2BfPzEajVIMo9GI2WxmaWkJl8v1n8hLq9VKfJU08KKiopilrtPppPtPnz5JE1hYWKChoQGNRiNPoFSi1WoRBAGz2Ux1dTVlZWXStAEikQjz8%2FMSEblcLrq7u2Vxnj59it%2FvZ3p6GovFkhD45eUlAA8ePEgeuEqlIjs7O65tc3MTj8dDTk4OlZWVzM7OMjU1RV9fn%2By5%2FPx8BgYG4hbm8%2Fmkfe71eiXb6uoqnZ2dsudTU1Pp7Ozk%2Ffv3%2BP3%2BhMB3dnak1ZI08OPjYxYXF2OWUElJCZOTkxLJmUwm%2FH4%2Fa2tr1NTUUFFRkbCwr1%2B%2FEgqFsNlstLa2SvrPnz%2FjdDrx%2BXxUVVXJfB49esTKygrb29u31hqNRtnd3WVrawuLxYLJZEoe%2BP7%2BPg6HQ6YrLCxka2uLo6MjmpqaePjwodSAt2%2FfYrfbKS4uTgj8zzK3Wq2kpqZK%2BoaGBpxOJy6XKwY4wPPnzxkfHycSidxaqyAIVFZW0tXVdWt%2BxfDwsHjzdBaNRgkEAvE7pVQSjUaJRqNkZGTIGPro6IhIJIJWq0WpVBIIBFCpVKSnp8dleIVCgV6vj7EFAgFEUUSn0xEIBFCr1TLuODk5IRwOS77Xa01JSSEtLQ2VSvXX01nciQuCEPfdl0iuEx%2Fw1xiZmZm32q43I16Mm438P7XeH1Lugd8RUdzVf26%2FATA60%2FXGpYACAAAAAElFTkSuQmCC";

var defaultWidthMaxSize = 750;
var defaultHeightMaxSize = 0;

({
  getElementByXpath: function(path, element) {
    var arr = Array();
    var xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    for(; item = xpr.iterateNext();) {
      arr.push(item);
    }
    return arr;
  },

  get currentWidthSize() {
    return GM_getValue("widthMaxSize", defaultWidthMaxSize);
  },

  get currentHeightSize() {
    return GM_getValue("heightMaxSize", defaultHeightMaxSize);
  },

  setWidthMaxSize: function() {
    var widthMaxSize = prompt("[HFR] limitation de la taille des images -> largeur maximale des images :\n\n",
      this.currentWidthSize);
    if(widthMaxSize === null) return;
    widthMaxSize = parseInt(widthMaxSize, 10);
    widthMaxSize = isNaN(widthMaxSize) ?
      defaultWidthMaxSize : ((widthMaxSize <= 0) ? defaultWidthMaxSize : widthMaxSize);
    GM_setValue("widthMaxSize", widthMaxSize);
  },

  setHeightMaxSize: function() {
    var heightMaxSize = prompt("[HFR] limitation de la taille des images -> hauteur maximale des images :\n\n" +
      "-1 : désactivée\n 0 : automatique\n x : taille personnalisée\n\n", this.currentHeightSize);
    if(heightMaxSize === null) return;
    heightMaxSize = parseInt(heightMaxSize, 10);
    heightMaxSize = isNaN(heightMaxSize) ?
      defaultHeightMaxSize : ((heightMaxSize < -1) ? defaultHeightMaxSize : heightMaxSize);
    GM_setValue("heightMaxSize", heightMaxSize);
  },

  launch: function() {
    var ltiScript = this;
    GM_registerMenuCommand("[HFR] limitation de la taille des images -> largeur maximale des images",
      function() {
        ltiScript.setWidthMaxSize();
      });
    GM_registerMenuCommand("[HFR] limitation de la taille des images -> hauteur maximale des images",
      function() {
        ltiScript.setHeightMaxSize();
      });
    var root = document.getElementById("mesdiscussions");
    ltiScript.getElementByXpath("//table//td[@class='messCase2']//div[starts-with(@id, 'para' )]//img",
      root).forEach(function(img) {
      var timer = setInterval(function() {
        if(!img.complete) return;
        clearInterval(timer);
        img.removeAttribute("width");
        img.style.width = "auto";
        if((img.width > ltiScript.currentWidthSize) ||
          ((ltiScript.currentHeightSize === 0) && (img.height > window.innerHeight - 20)) ||
          ((ltiScript.currentHeightSize > 0) && (img.height > ltiScript.currentHeightSize))) {
          img.removeAttribute("onclick");
          img.removeAttribute("onmouseover");
          img.removeAttribute("onmouseout");
          if(img.title.indexOf("Reho.sted: ") === -1) {
            img.alt = img.title = img.src;
          }
          img.style.maxWidth = ltiScript.currentWidthSize + "px";
          if(ltiScript.currentHeightSize !== -1) {
            img.style.maxHeight = (ltiScript.currentHeightSize === 0) ?
              (window.innerHeight - 20 + "px") : (ltiScript.currentHeightSize + "px");
          }
          var newImg = document.createElement("img");
          newImg.src = expandImg;
          newImg.alt = newImg.title = "Agrandir / Rétrécir l'image";
          newImg.style.cursor = "pointer";
          newImg.style.position = "absolute";
          newImg.style.zIndex = "100";
          newImg.style.margin = "8px";
          newImg.style.opacity = 0.4;
          newImg.addEventListener("mouseover", function() {
            this.style.opacity = 1;
          }, false);
          newImg.addEventListener("mouseout", function() {
            this.style.opacity = 0.4;
          }, false);
          newImg.addEventListener("click", function(event) {
            event.preventDefault();
            img.style.maxWidth = (img.style.maxWidth !== "") ?
              "" : (ltiScript.currentWidthSize + "px");
            if(ltiScript.currentHeightSize !== -1) {
              img.style.maxHeight = (img.style.maxHeight !== "") ?
                "" : ((ltiScript.currentHeightSize === 0) ?
                  (window.innerHeight - 20 + "px") : (ltiScript.currentHeightSize + "px"));
            }
            if(event.target.src === reduceImg)
              event.target.src = expandImg;
            else
              event.target.src = reduceImg;
          }, false);
          img.parentNode.insertBefore(newImg, img);
        }
      }, 250);
    });
  }
}).launch();
