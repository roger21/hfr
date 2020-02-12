// ==UserScript==
// @name          [HFR] alerte qualitaÿ mod_r21
// @version       2.0.5
// @namespace     http://toyonos.info
// @description   Permet de signaler une alerte qualitaÿ à la communauté
// @icon          http://roger21.free.fr/sav/roger21_hfr.png
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @exclude       https://forum.hardware.fr/forum*cat=prive*
// @author        toyonos
// @modifications remplacement de l'image de fond par une image transparente moins gênante et allignement du bouton
// @modtype       modification de fonctionnalités
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @connect       alerte-qualitay.toyonos.info
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// ==/UserScript==

// modifications roger21 $Rev: 1573 $

// historique :
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

var cssManager = {
  cssContent: "",
  addCssProperties: function(properties) {
    cssManager.cssContent += properties;
  },
  insertStyle: function() {
    GM_addStyle(cssManager.cssContent);
    cssManager.cssContent = "";
  }
};

({
  getElementByXpath: function(path, element) {
    let arr = Array();
    let xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    let item = xpr.iterateNext();
    while(item) {
      arr.push(item);
      item = xpr.iterateNext();
    }
    return arr;
  },
  readCookie: function(name) {
    var begin = document.cookie.indexOf(name + "=");
    if(begin >= 0) {
      begin += name.length + 1;
      var end = document.cookie.indexOf(";", begin);
      return decodeURIComponent(document.cookie.substring(begin, end == -1 ? document.cookie.length : end));
    } else {
      return null;
    }
  },
  get imgUrl() {
    return GM_getValue("hfr_aq_imgUrl", "");
  },
  setImgUrl: function() {
    var imgUrl = prompt("Url de l'image ? (vide = image par défault)", this.imgUrl);
    if(imgUrl === null) {
      return;
    }
    GM_setValue("hfr_aq_imgUrl", imgUrl);
  },
  getAlertesUrl: "http://alerte-qualitay.toyonos.info/api/getAlertesByTopic.php5",
  addAlertesUrl: "http://alerte-qualitay.toyonos.info/api/addAlerte.php5",
  nomAlerteDV: "Nom de l'alerte",
  comAlerteDV: "Commentaire (facultatif)",
  currentPostId: null,
  currentPostUrl: null,
  generateStyle: function() {
    cssManager.addCssProperties("#alerte_qualitay{position:absolute;border:1px solid black;background:white;" +
      "z-index:1001;text-align:left;padding-bottom:5px;}");
    cssManager.addCssProperties("#alerte_qualitay select, #alerte_qualitay input[type=text], " +
      "#alerte_qualitay textarea{display:block;margin:5px;font-size:1.1em;}");
    cssManager.addCssProperties("#alerte_qualitay select{font-weight:bold;}");
    cssManager.addCssProperties("#alerte_qualitay input[type=text], #alerte_qualitay textarea{margin-top:0;}");
    cssManager.addCssProperties("#alerte_qualitay input[type=image]{margin-right:5px;float:right;}");
    cssManager.addCssProperties("#alerte_qualitay p{font-size:0.95em;margin:0;margin-left:5px;margin-right:5px;" +
      "text-align:justify;width:100%;}");
  },
  generatePopup: function(topicId) {
    var self = this;
    var newDiv = document.createElement("div");
    newDiv.setAttribute("id", "alerte_qualitay");
    newDiv.className = "signature";
    var inputNom = document.createElement("input");
    inputNom.type = "text";
    inputNom.tabIndex = 2;
    inputNom.value = self.nomAlerteDV;
    inputNom.addEventListener("focus", function() {
      if(this.value == self.nomAlerteDV) {
        this.value = "";
      }
    }, false);
    inputNom.style.width = "300px";
    var inputCom = document.createElement("textarea");
    inputCom.tabIndex = 3;
    inputCom.rows = 3;
    inputCom.value = self.comAlerteDV;
    inputCom.addEventListener("focus", function() {
      if(this.value == self.comAlerteDV) {
        this.value = "";
      }
    }, false);
    inputCom.style.width = "300px";
    var inputOk = document.createElement("input");
    inputOk.type = "image";
    inputOk.tabIndex = 4;
    inputOk.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKfSURBVDjLpZPrS1NhHMf9O3bOdmwDCWREIYKEUHsVJBI7mg3FvCxL09290jZj2EyLMnJexkgpLbPUanNOberU5taUMnHZUULMvelCtWF0sW%2Fn7MVMEiN64AsPD8%2Fn83uucQDi%2Fid%2FDBT4Dolypw%2Fqsz0pTMbj%2FWHpiDgsdSUyUmeiPt2%2BV7SrIM%2BbSss8ySGdR4abQQv6lrui6VxsRonrGCS9VEjSQ9E7CtiqdOZ4UuTqnBHO1X7YXl6Daa4yGq7vWO1D40wVDtj4kWQbn94myPGkCDPdSesczE2sCZShwl8CzcwZ6NiUs6n2nYX99T1cnKqA2EKui6%2BTwphA5k4yqMayopU5mANV3lNQTBdCMVUA9VQh3GuDMHiVcLCS3J4jSLhCGmKCjBEx0xlshjXYhApfMZRP5CyYD%2BUkG08%2Bxt%2B4wLVQZA1tzxthm2tEfD3JxARH7QkbD1ZuozaggdZbxK5kAIsf5qGaKMTY2lAU%2FrH5HW3PLsEwUYy%2BYCcERmIjJpDcpzb6l7th9KtQ69fi09ePUej9l7cx2DJbD7UrG3r3afQHOyCo%2BV3QQzE35pvQvnAZukk5zL5qRL59jsKbPzdheXoBZc4saFhBS6AO7V4zqCpiawuptwQG%2BUAa7Ct3UT0hh9p9EnXT5Vh6t4C22QaUDh6HwnECOmcO7K%2B6kW49DKqS2DrEZCtfuI%2B9GrNHg4fMHVSO5kE7nAPVkAxKBxcOzsajpS4Yh4ohUPPWKTUh3PaQEptIOr6BiJjcZXCwktaAGfrRIpwblqOV3YKdhfXOIvBLeREWpnd8ynsaSJoyESFphwTtfjN6X1jRO2%2BFxWtCWksqBApeiFIR9K6fiTpPiigDoadqCEag5YUFKl6Yrciw0VOlhOivv%2FFf8wtn0KzlebrUYwAAAABJRU5ErkJggg%3D%3D";
    inputOk.addEventListener("click", function() {
      if(confirm("Signaler ce post ?")) {
        var parameters = "";
        var alerteId = newDiv.firstChild.value;
        parameters += "alerte_qualitay_id=" + encodeURIComponent(alerteId);
        if(alerteId == "-1") {
          if(inputNom.value == "" || inputNom.value == self.nomAlerteDV) {
            alert("Le nom de l'alerte est obligatoire !");
            inputNom.value = "";
            inputNom.focus();
            return;
          }
          parameters += "&nom=" + encodeURIComponent(inputNom.value);
          parameters += "&topic_id=" + encodeURIComponent(topicId);
          parameters += "&topic_titre=" +
            encodeURIComponent(self.getElementByXpath(".//table[@class=\"main\"]//h3", document).pop().innerHTML);
        }
        parameters += "&pseudo=" + encodeURIComponent(self.readCookie("md_user"));
        parameters += "&post_id=" + encodeURIComponent(self.currentPostId);
        parameters += "&post_url=" + encodeURIComponent(self.currentPostUrl);
        if(inputCom.value != "" && inputCom.value != self.comAlerteDV) {
          parameters += "&commentaire=" + encodeURIComponent(inputCom.value);
        }
        GM_xmlhttpRequest({
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          },
          url: self.addAlertesUrl,
          data: parameters,
          onload: function(response) {
            var newP = document.createElement("p");
            switch (response.responseText) {
              case "1":
                newP.innerHTML = "Ce post a été signalé avec succès !";
                break;
              case "-2":
                newP.innerHTML = "L'alerte spécifiée est inexistante !";
                break;
              case "-3":
                newP.innerHTML = "Un ou plusieurs paramètres d'appel sont manquants !";
                break;
              case "-4":
                newP.innerHTML = "Vous avez déjà signalé cette qualitaÿ !";
                break;
              default:
                newP.innerHTML = "Une erreur imprévue est survenue durant la signalisation de ce post !";
            }
            newDiv.insertBefore(newP, inputCancel);
            inputOk.style.display = "none";
            inputCancel.style.display = "none";
            setTimeout(function() {
              newDiv.style.display = "none";
              inputOk.style.display = "inline";
              inputCancel.style.display = "inline";
              newDiv.removeChild(newP);
              inputNom.value = self.nomAlerteDV;
              inputCom.value = self.comAlerteDV;
            }, 3000);
          }
        });
      }
    }, false);
    var inputCancel = document.createElement("input");
    inputCancel.type = "image";
    inputCancel.tabIndex = 5;
    inputCancel.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184%2Bd18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX%2BAv2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30%2BNlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2%2BDl1h7IdA%2Bi97A%2FgeP65WhbmrnZZ0GIJpr6OqZqYAd5%2FgJpKox4Mg7pD2YoC2b0%2F54rJQuJZdm6Izcgma4TW1WZ0h%2By8BfbyJMwBmSxkjw%2BVObNanp5h%2FadwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1%2FvwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY%2BP8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok%2BnsNTipIEVnkywo%2FFHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa%2BDt9XfxoFSNYF%2FBh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs%2FQZyu6TH2%2B2%2BFAAAAABJRU5ErkJggg%3D%3D";
    inputCancel.addEventListener("click", function() {
      newDiv.style.display = "none";
    }, false);
    newDiv.appendChild(inputNom);
    newDiv.appendChild(inputCom);
    newDiv.appendChild(inputCancel);
    newDiv.appendChild(inputOk);
    return newDiv;
  },
  launch: function() {
    var self = this;
    var root = document.getElementById("mesdiscussions");
    var tmp
    var topicId = (tmp = self.getElementByXpath(".//input[@name=\"post\"]", document)).length > 0 ? tmp.pop().value : null;
    GM_registerMenuCommand("[HFR] alerte qualitaÿ -> Url de l'image (vide = image par défault)", function() {
      self.setImgUrl();
    });
    GM_xmlhttpRequest({
      method: "GET",
      url: self.getAlertesUrl + "?topic_id=" + topicId,
      onload: function(response) {
        var alerteNodes = new DOMParser().parseFromString(response.responseText, "text/xml").
        documentElement.getElementsByTagName("alerte");

        var postsIds = new Array();
        Array.forEach(alerteNodes, function(alerteNode) {
          var ids = alerteNode.getAttribute("postsIds").split(/,/);
          postsIds = postsIds.concat(ids);
        });
        self.getElementByXpath(".//table//tr[starts-with(@class, \"message\")]//div[@class=\"toolbar\"]", root).
        forEach(function(toolbar) {
          if(postsIds.indexOf(self.getElementByXpath(".//a[starts-with(@name, \"t\")]",
              toolbar.parentNode.previousSibling).pop().name.substring(1)) != -1) {
            toolbar.parentNode.parentNode.style.backgroundImage =
              "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAACZCAYAAACi7wp2AAAmyklEQVR42u1dC3NUx5W2BBixRsBYZYIRmkHGSDBstmzf32rNSBADduwkDibvxM7Dm2CTJYR1qlKb7CbZWjveSsrxr4h66B4dWv1%2B3%2BH7qrpA0sztvn379nfO6fN45hkAAAAAAAAAAAAAAAAAAAAAAAAAKI%2BdnZ3Bfttg%2F2I2AAAAAEBPlh1pIE0AAAAAUBDmcL%2BNHv7q3mn2L%2FsZswIAAAAAhwlzzIiS%2F58R5hizAgAAAAAgTAAAAAAIIsyrjCj%2F8Y9%2FLHHC7DArAAAAAHCYMDuhYU5ef0yY%2B%2B0IZgYAAAAANIR55%2B13XoTjDwAAAABYCJP%2FjHNMAAAAAABhAkD4yzLgcVhbAS15ZpD965136HeTN%2FHzlf12IfM8PR8xTzHtJd6c7nX%2FbyfY3%2FnnYvql8zsi%2F2fPZynx3G5wx5PNQnM6ku5T%2FMzGsGEY35b0LHK2TfIMxbyw53omJ2ESx5%2Br2B0B4DBZdgnaINF4LkWO43JGsuwaa5c0ZFlyDFd5SAITJE4Fzu3lBudW1rZaG98Zw3wO%2BTO5qvh3g3zuGGlzL1n2t5t71zfEOabhemhpGp1PnBs3TpizzeDRvXun%2F%2FCHP6z4NpIZZDsVee9NpkNbv48e%2FGaVNfHzZ59%2BepS%2F5GwzWckwT7NMKI%2FufRw0TzHtk4cPT7JG7%2FX6%2Fhzxez0mjXObjfOD737vLPtcTL90fn99%2F%2F4p8f%2Fp4%2Betah3%2Fd9V3Xtmz%2B%2Fvf%2F75M%2B8zZ6P2wPsXPbAzkXpaIoDRifxPPo8QYHzx4sCqeIfv%2FbNy%2F%2BFAIuBua%2Bdzc0T8fcV%2BbGsF0pNgbxpbroaVvIM2WtUvmRs42g1jSTUdK906HfJ%2B4wy9nmKuxvKHUxBt7e0I4OG46i8oNsW4%2B%2BtnPB4pN%2BUTf5lVez1RQamFs3FzaqcylYqy7O5O5aVX%2Bd5cINjem06HcdIRJrxOzVwD6dyjlXgrk2RiiCCo1UcVunjkXW2kicr1X%2BSyx9jh%2F%2Bf4Ha2zDJuMb9IkwiYZ5tcXxWQjTOlZKmLa%2BpuSzTAPHjlnk2eLsuFGyPJJqcyWm0I0GCHOcYa6WZ5p4e4Q5ln63ysYpNIyaYCZhF9JsTRCR57Y1wrz7zjde1L1rqQmTHLc094xAmEAV7ZIFKbfyoGNfzIyEORMIvn7z1nrLL5Z4pkzLa2Gc0oY7UMzrUg8I8wlnmNrg2jubs6OKcVvHundw9j3ymIvZ56cgzSqCMNDGg0kqOad40A0TZlObpkHDbO480ESa4gz96zdvrrcyXqIZD1vUgHWmeNexsnNKeoZp64%2BZYoVw1to7sGj4wZ07X4HTT8Pa5Ru7exsprpdCw5ybPV8P25zYpptrsTV6jqXSMMctms4IaY5Umjv7eytjJefxJxo2xXeh2johzM6FMCWS7kCYGdfewTwfx2wssHYpO0rEkPit%2FfPQyMWWw0O2KemahJRstK4JK4ho0APNvaOEzjySW7YsUG39puX94YQ58iFMZuKnoSfwki0rDAF1H8rsxUp9HhH7sFN5yKbOQMOvDQ%2FZdFrmsGWNWHV%2B2QpBmCw5Ptq6WD97jnNPS36xxmJDsZOWE4aAug9lKBIVpLwucUE%2FEjiuJkNK%2BmKWa3Gctg2hB4TZ9PhCrQtyfKULWNIEeMyCMJ9K7TKHGYyfIQaHlsRsTjndsfevOTNHfev2m%2BuhY0vxPaHlMOme3%2BsVaZwXZubDgHPpL774Yun%2F%2FudPx3%2F%2F%2B9%2BfYI39nzbWN%2FtM7FwSs%2FmgJx6yUYQpJw7wXQ%2FyZ3lIifKc3meslPh8vOTp91py1FoEIKSkXe1ylFq7FBu6LqDacWytesjONolPPr5%2FKuL7qVsnJ1%2FnSbpHIeayqVuu1BEjPEagoXNJzbLUyYttFqyxsYtUcOL%2F7PcsdV2MgMeuJ4QN2tiaFX2wv9P8qbFrMmPatH%2FThJQ4EyYRujofwvzdY49ZkT94xLI7YVdNA16DNDqWHUi7%2BWczMcVISCKJQui5KknLlsND9mqodyCL2yTmr5iEzPRnZaWSmGdLSPhl3i5L7QpvMwKJIU1JgxuFJEMPsHzIwsaha5N2mY9tKQFhqp7l1Yg1MFSRZQi5i7n45i13ywl5x%2BeaZksezn3GniY3NFBZu8xpSgnV8liVC9%2BXl4JkGjqV4Z6CPTljz3VLCEPM1Koy8Wr6EFLwKNREqzjHFGWzrhJi3iL%2Fv5qAuDoibFyRrn2FVlwh35slXf%2Fa7u5GyXchsK9Vn%2FNrKcH8KGJOQZqJLVk5nBaBxrRL%2BaEHfG9GeKEmnlY9ZEu%2BBKHj5ITZuRAm72emaYZ6joYQSQpNL1TADEm6Xvo8SggyPhmeKGEKk7UriGn9cg6P%2B6eYMOHw08jDGMQkBShAmFHxeBk9ZIPNciliUwuO04cwWfmw7vPPPz9a4lmxIO5KhBksYKbKrewrcDIik0uvsXeeCaLyu8WPMbpQQZWc915k%2F7IsNUhqAMJcpIfh7Ozz8fs%2FXWMeeb79EC%2FIU6U2p5yLbf%2Ba%2FxITqlHqJYgxt3%2F762%2Bf589s3bGvFIQ59r03tiGXFFr6YoqnArHtDJi%2BY7%2B999ETidVD7pN8%2F1X2L0srCNIEYfb9Qaz6SOhkk%2FEmiVDnm4Y9ZGeb9c%2B%2B9%2F0XfL9b0iwXI3D4OhsIk2zIGWYIgSUIN%2BpiCDPE9FzjPIqT5oYiX%2B8p%2FvtD80hCwYK0TClPcNdamsO%2BACElbRGmVwULkgZr9OWXX4ZKncXOqHKaPlNpvpJDyxXFz1c0DiljF%2BEjkYesS8D7udROP4WEgY2AcaY4u74S0S4kXsuHBADq%2FHMzMCWlgjRnTkDQNMusU6Diph%2FrPRe4Ic7MSWzRhPQXmzAh12b94MGDVc%2BwCVOow9BlM4wxq3mQZceSG4TMCRfGvCwQpYQB6XvLCUzxXYK2lXAtbzzOH7s71Ah1wXGVxLIETbPgOgUyaZeuZ1s8%2FVXH3fq9vecCTW5RyRRIfcAjGeYvyhlJBOCLAHk5YN7UhCbgIoAk0oa2uWazrdB25iT%2B4Y9%2FshaqXZIE7KslNb1QcglNus6eO02%2BENKI49BKorWsrAbEQrno801ImnAEyrxOgcoaEnHamTmCvBXgRBLgBdlkDtnYzTrxyzQ2%2FH0pEWEaNV22FkI1ywjrQ%2FC9RSbSqF5FJYfjkOpdI%2FU%2Ft8VchxYgl8yzr8ZYjp4W4PyyHbJc9Y2RIuaZpVCTlK95oWEP2SO1Y8x0eWOVmkPEGTBrzOuVaY7iX9pS3IuqWknOZxBJmONGBKUu8TWV98XyD5OUhd45Zg2keUkIXEijB8Lsg5rvLC2%2BkSiPpq9knCgGM5uHbGjS9RRgWWZUeWOlcW7EOG2UJgDZi9PlGYRmp6oRg1nKshCzplV7Ank%2BzKv2q%2BxndtyRgDRHsebep2SvRkhJbe0yILckTVkWRJjE4%2BuCY79do1VKqm%2BaLsJHy0WjxTNiZ1mB4UbBzyBEo02xJhsnzNm%2BoCJCkshgxDX7TfZ%2F5iQUsrbY%2FJMz61epeR8OQWnWKVBAklSB1Lrbit2sXMyIpI9jMeccfLE15yGbQStbanmcjs%2BIbZrHSz0D4gw28OzzVImsWKkJc%2F%2Bzz%2B03Jpg8FzKnUpHoU%2FyzL8e8n0RY6mRtkz0fhJ88WfIOzFXnRTsiTCoBG%2FN58rtZuahPA8pFub7swpwYanIj2uwgwzz2wizXMmFKprlByWcQ4SE7EzbvffDT52vNm1xmzJEsqaPWcyHCNPF0nQs34hwy1DzLBGiyDkbcIrIpxiqIMzQ38QLs1%2FCQbUG7dD20Z8kJVBtzgs3KhTCT5JBtLel6YcLsWiTMWLKMvbc%2Bn18SU%2Bayzzv%2F8%2B%2F%2F4AUb0dqcAYn5%2FCL5zsw8G1pNSICUWut4DtpNOQzladqrS%2BabBhK98OyMgi%2FYYQzxhkhNrYaUxIZqpIDL%2Bez%2B3060WC2Cr6lYslyNubcIwqx%2BJhzjae4oZBnvUZUTOja5AdVip0%2FW1BxT71yaNJ6tIxb2ImufbNzsd%2BwoiZFwzpKFLQjFQL7JH%2BgO9W0PjIcnLJEWfL5YgjAzO%2FxEBa6nACsrpRJkVEIN21RaWH88CF5sei%2FHmMp9z%2BEXScMMOL%2BcE6DLO2E7CpGSEIjzzFMpvV3ZNaTi3p1UMFuX9UouBD7qc6wnCLP%2B5HeuWXOkVHjKNokLLRnkMrnFJNbOrWWw78VqKMQs93zLm7u09kau%2BW9zEhfZiIt7yPqexcnr5Ifv3T0bkz4wlbBqI82Ua0dVlsw1dWSfzbgx6xRIpF36bvSMEHUtVMJ3cZWONXtmJszYWoijVK1186EkeF1t4RmEZslJlDUpRXvNJyUenavr07kj3JqLBi%2FnlnUgzdn3WLKDHOtI7B%2FsKEg3P0yYXITzTmL6fiodnmoTZlRO1tKmBkHwoQH3xF29qZASohlS81JIy1qlhIddHGqh3pCpTUspEsoHJF1PklnI8znLnx%2F65o%2Blc%2FXJx%2FeFFnjR4Xsv20ysGtK8jEQE6SyCmIk6k9%2BUt6QDYUYRPJHOjmcYey9qIWbKITtq4eWvmXQ9NLtT6fMopkVyb9O54OSj7buaWGXSpN9DcvV8eySQWbuMdfsuTJgL6SFbUmpMHXYRo9URz9hhzWdQK%2Bn6r3%2Fx4aDkeRQnyycEHSHgEevB0HEdWCuLKEhzZvoNzTn7tAM5ZOuSU3PB6zbiaNhD9qivp3GNl0CElKQ0ocbmpU0lMYtxlDYPJzo3PVPo%2FWKaZbdvgp2T5n8%2BevSc7xwwC41IXWdLWSeR5kgkSGFe2tA0oWH2ZdIHqsKwrRCmzjTZMGHyhN%2B3mjbLxYSU8AxJI0XsbRXNTqfphWZ%2FqRGDWfo8io717Vu312UnsVvX1dmCePjYkJ6TU4dBF9Lk5%2FTCOakT4WcgTXcgh2xlYmrF2UfA5AGWIjFAxiolwUTOYyeLvAS50saFXjcxYQbfW2iid95vL0zxqrGqvKqJ0Hqa%2F8zMuP8qOXp5kybDT%2B5%2B5yy5xldpqAcjz88MKTUFsT7NBEsKhMNxqrR2GSONF1gQG4pxR9Wa%2FPX9mSfgKIcZOmazfv873z3L7%2FmFHhNmsJZFnvmpWvdGvJR9E72v1DADB%2FZ1Wn5%2F%2Fvzok%2BeuS3P20U9%2F9jwf1yY58xy9%2B%2BZb66ox%2B5ImAw%2F%2F6EjWnrEh2cChdnN3r%2BmydLkVHbBY2Ukftqhd2jSO2LMyqQJCbBumJqLIcBKnEJME5sOx5m8boc4cpETURuS6Lm4aFSZuljggYq0nf%2B6qxBVirIwQbWOT0tCNWNjJzCT4y3tnNCbbgU9uV6ZJvrvvVbyrTzww1r1704ar7IAwF1i7bNW0oduYYwPuqYaZqA0TmuVytWEK86HNdCo0rRBhhoc0RCeT6GPS9YzP%2FVC2J9%2BxzutQ7pOkQrh7XrO3vCpySfu%2Bp48e%2FGbVdl%2BMaJ9mkywcfupol15xjGyBsoTFLo0taLbw2f8zEGZrKd3G%2FP8nWqiFaJvHmDy%2FLhmSap5jilJVoQm1%2B5xD9hDxaPIJxwqcE4dMUtx79qu%2BJloAhNnqhHu%2F4I45GpU5G1OaHRomzJkQws4iGyfMmdk0JO6WJ0g3mk2jzhAP1thq4L3O7i0k9VlMir4WCZMUwX4%2B2fM58HC96DAnR8TzEPsAM7s%2FrbUrU4EpI3w%2Br2A2CmqXPvkciRvzlmO7wp0FkqcoaykrkUSYTRZjVhBmcNiFS57VmHlguYdjPIVj1puLMGDot2s1ljnl%2B0OuuebxnQEpwdXRNIpC8xQlt7A720EK31%2FAbDSoXRJTmbcbc8zmTLwmV8n1mjF7ypXtWyRMlZkzl4esLJCFZo6KMTfF3BvZiI559rnUMmFKv1uOeX%2BIs0%2FnK9TwDD8bfE9Qlt7C7uys5SPpeqGXaOBbdoudc4a8IIm0jSckfhZywX7XQg1HWYJvkTDvvvONFxVzGDROV5Nl7KZcizAjkq4PYxLPl7Is8N%2FNhFBWlST0ujxBuyC5l3y0TY3mOW6lck5P9nB4yBacbG9nn2mgdhmrYaocTFoKhZEXbotaBpFGj6YYp0fKtBTnmCHJ63vnIVuYMK%2BmirsmOWc7nmpvLWKsY2iY%2BQVKIEC79FmYsbUKbdXZHQhTNic2I4lK55e9MMslSg6flTB5YVzvs8RS99Zzwkw6Vknb7FKUGMNODcLsrXYZunmRPp%2BNyVWrcFhp1UP2SIvB1DoP2ZCQEmYG96hiMQwNJwgNLxF9hsSA1qpSkgvcFD9KHVLiSJyUPJ00TxBmGQUGyCwJx0ozsUTSstlTFVISmnS9IGEGb0wkTOGEQ79roeEdoesuUfKAoknXc4GYtY9KY03y%2Fnzx%2Bf8fffDzXwxkoYP9%2B6P37p5VkOdaH7X01pCz8D2gkL59TKPc2Sc6GXgiN%2FallghTDn9o8YVXxWvl9pAlnz2e6Lmf8vhO8L2F1uPsmYfsWqqxXieE%2BCNDOkCueXa2uE0QpqMg9Hq%2BwvdAGu0yOiN%2BzMtAtJojQlttwRuRb7DzkJcWX3gSlnMhIWGOSzx3klf2fIn%2BQl31Rdak65Npi%2BXx5PNLUQPzVMI%2BOsf0fGuG60RlZ3rK9nGcX5bUMFmyAmYetbVQidvUNzs3Y2Q3ceh%2Fwj9PNzIarsCuIz6n%2Bi79%2F2Tn8Ofl300U1xBjZf%2FSz5J6kNvyPX5td9dpflVN9KH62XXeRLt%2BMMYnwiRoCMREM2fy%2FYv%2BfdeD6rlPNM9I7jukcgntb2LoYz4Gvo74Of0TzzNEwxTrRL5P1X3Lf5%2FaPvP64TU9kdaJ%2BAw7FtCcX675VAJxbNskNETVvM4w0fzzQgP5SPOyZ1q7lxP2fSmiIshIIdXWbtvyWR6br0bGpq2mwse5GXitzcLP%2FXJATGRof2zDPilaoKbVUhvT%2ByFtja%2FdVO%2FASZfmMIcnEo5rUdsYZFmeNI8T86apPZuh72P82ssO%2FS%2Fzz6sKSC9Ln1N9l%2F27Lr2EcynNpJ1pygwNeVjOsikTDPcKPhLQbCR2zXHeRDtmIhtpnrZsRGlKhef53JfJ%2F7ccNolrLk5Giv6WDetkmW%2FQY19hw6JpHuVNvk%2F55yOKv9Pf2dbClvS9o%2FzfYeMbvu%2F58MDhGYUKcrbrbhXck9cd7xNnvIVMseMeSlPbvhul5p5nxHdjOh3%2B9S%2F%2F6yUEsM%2Bz70nk6R1j5mxKZMV5b7%2B5rmoxCcld%2Bn7z%2Bo0NVb97DrljI85itP2S%2Bw4ylTr0vy3S96larWwqByZz9dhuHZiqVxTf7Uz3VLP5zieNGTddd%2Fdgfa77Xlt3zVtSyssCZGm9z8nBvoh0eLlfvh63zoc0iUY5EgTkS5I6EI9h1l5L%2BTLZnFUyE6axby4weOdXddkkXNIz5iAuce44MZenquJcYXseJEH8SdWchubvLXBfvoTpFMfL3m9foUrEIpuuncrh0TKOFb6XGPcpfo9dDsERUEicfRw7D5Jn43%2FB4wXrBFHmGtdP7n7nbOrDd9smmUvLc1kjk8D8qi7anYswE5Mmz7JRdTcM%2BVRbJUzdfPjMaUXCHDt%2Bdt1n7wrw3rZmPCPVmYYZ54SZ1kdsT3ERNny0aCBQuwzJetICiHesS5D8RUFipTYMQpqXcpNWLvOg8DqeFtS0qPnZ5fPMZKszQcaOQbdR%2FfbeR6dreSM6roWmi6rHaoG%2B5B%2BY5MKqwebUMsX%2BccuyP0%2FgGduGpNqD8buUkVriXpEj30xCf%2Fvb35Z1zfUa5HzzUsR9zmJL9yqYB4Ukz0y%2BJfrmz%2Buaz7ok55jFTODknHBQeM2vPI4zDiLMZq1JxIy87jAHs3fKp5pSiBWkppbpeo%2Fk7BfOPplfvEHfvapsGzXdfG84lipiZPjwl786s3vYA%2FYJTzT2d%2FY5F%2FKkTkExL4%2BOtELOaDz6NkryqcnKdq8Ftdwgs2cpq5BO89Vt4PP45Ebfd5%2F5DBH0dwOPLGpoma7mZvLeI0lBqRevhRJYIXBJhC00yztvvWXNBMOI7%2Fb1uecb9cLVtTl5uhBnjNnEw%2BFnPcM6KXZ26iLE%2FfW%2F%2FniigJa73FeHH5Pmm8LJztJvtuvL%2B5bOTPmjb757LlaDrallujr5SESNc8vaL17fNUwep2bVLBnR%2FfDOe18hi4%2BR4YX9dsbS9xka08YkWBtpEu%2FZlZTPappR2yl5dio2Q3Y%2BqPr7%2B%2B9%2B%2B9ydW7fXCxDmbJM0nR31zeFHmuNxYHPpN%2FTaLtVt5mSi%2BvuXX345E6LZvymtMCW1TFcnH5xbln3pVmPKabUA4ok61C1wm9MIIzhCNq%2BESGqcOEUQuZE0TWM2XN81vCGHw0%2Bxs1ObGUpYFHTzkNJEaiPukOeY6HlUCXVpJcTGZo7%2Bzb6lh41TRZgxYyylZbo6%2BVBtHmxW5sWbLTxWTaOv90A8ZFd8Nl6Bv%2Fzxv1ekxNDPJphTK2m6ljKSpOoq4Q0u54kJCdN4Vio2Q92mnTIW1CPudKXwe1tlLQjCqBliYyMtoV2yz7C1knqMubVMVycfQsxbzwBFXroji5BCSadVubibS2S5nnBMQ1GVQkeav7t%2FUEQ3hVSdM7zB8ew0RWm3ocmLmZxXa9dtSucjD%2FPjUuE1b1wLuTRfG1kUikccmcYgBCrWvqEx28c8t5xaZoCTT3Hv7Kdeu7zz9jsvLgBhjlX3ZpKEGZGRRXcuw7heYtf%2Bjw%2F%2FfeBL9iGbN4lBzBEHVuTs1NYP2QyvmIowp9By%2Buzwk0vzrR1iY8v6RLVL09nzbqSDWg4tE04%2B7RPNQhRhlTctl%2Fg96cxyPdO4TttMs5zkRo6ODgvt8EPz1Dpol4wwu8yEaU0f1wOHn6VF6NfVakQEqqGJWImn7CBwHMm1TFcnHxKaBiefgi%2FcqqgV2ef7UJnf5pqzIYSEhF%2BMMs%2FzrIQXM%2F3GbLo1suxIkm%2FWcyub1yPDtw6e2YVChGncnEmgeGmHn%2BVKDj9VNW6b1UjSLgemsSZyzEmmZbo6%2BRBT%2B6VngKIvXe%2BdfR6bViaHTCs2KZiYYscF5vlcaDYWlUSr074yE6bxvCxFsgRbH0S7HPPPXzA5daTwlLWto92MOXtd1kLpUJfaITYe5voh%2F%2FxVXWhJIiEviZbp6uRD3rPXSjuZgTAXyxw7NwHZpFBGlswRp6T9X2gqOrOsiynVllwiZ3hD7mQJto2HkSXVLvl3ZpvjtzReuyk8ZW33Xbukl06zqeXwk3kNDkVJKxftkhBml4swU2iZPonjcW5ZWbtk2tmCEObYU7ssWvpGZAOynGMaHTRqhjfkPjsVyfB1sY5cu%2Byk53zEpLnHesrarp9bm0qk%2BRZ1%2BMnoaGTV5Jg3LP%2FMBvmeC2F2ucdm0jLFnNqcfHaRnADaZSxUKfFsi7e0dsnHNDMfPtSYD100tBpltXi%2FWZMlCAnbFEZCntmFgHFFxdr10eEnY%2FKKWv0aw0iIdil7ys8EUZ2Zf5LOsztIyxT3ZatJSjT3TbBX%2BZdtdRFiL1Wbls3Lkpxdbhce45nH3pa3gxKmV3b4yXp2anOs%2BfRPfxLFcLcU380WWuJYmBkOP%2Fn7tYaR3DgQqDak7540xWLGesrGaJk4t%2BwPwSyEsw%2FDD%2B7c%2BYq0CI2bHE9SwBb2y4Xn%2FDkTYdo2m9JltVTrRWcujUmWYDtvZkRItIAXNYTZ1SDMihVKqoS6VOzXKFB99ue%2FmASq5dyesoFaptUjXPEdnFtWIszxomiX5OzsuMu9EdPeucJzfjKG8EqX1fJZL6HJElxiZYnX40hzDSNhxpBaaGHmAmupSqhLjX5dwkjIMz5f8zm6aJm0XiWSqveDLAct18ELuJ%2F5mUnNxOQFNMxiZbV8%2Bw51%2BLHlppWSFOjygc7Ohn%2F83l3lxhPqKRtTmLm2wJsr1KVGv7Y%2BTdoluUbW0JJQLRPFoPtBMNYH2kPCFOeXxmoatc4vE2mYXSVniyxnpy7SOCNBGlNnIrbbmvPVUM27RNxpxDOpovmWXoOeYSTnLYSZ1VPWZ12LLD0mr1hiKkYx6Irkcny%2FvbpIEotEmCyReafL7lMjnISM03gGadqAS5bV0o07tcOPYxjJiK%2FX44brZPGUdXT4KX6uVCvUpXS%2FLsQjJykwXIulm%2BuYNqr6e%2BqzaBelxOYVi6TqDWmXzFFmEe7ns08%2FPcoX1hW6uesIkxeGrnJ4bovDNIWVlCyrpRm3VhoOrOlpDSORkxSU1rgadvgxal25NN%2FS%2FXqEkbiknDtfwlPWh%2BxNwLllO4Q5XiTt8o3dvQ0p84uLYwz7%2FMmGCXPV97nVdPgJCVS3PSdVkgLL9ZKGlrRSILklzbdkv7YwEgZVkoJQ7ThHObLQoy%2BSVB3nlpXJcmUREq2bpHyP9G21CDMoNV7LFUp8kyW4hJGokhQ4EGYyT9maRbpb1XxL9msTqHRJCgzXKx4%2FGqJlIql6W4Q5dHFj7tk9PXFY3yphihJfu4EOE4vi8OMSRkKTFPD%2BaVtS%2FLxkS8Lu6ylbs0h3i5pvyX4PUna6JSlQrBFdK%2BYpG6JlIjlBe%2BQyXjQ13zeHbEXCXHcsIj3WmZMqOfwkPTt1uR7RVLybLgm7r8m6doHk1jTfkv16hJEEtRKesiFaJpITtEUsswe3N5kuzCGyJofszPb%2Fu%2Fv3TzVGmEZzLKs%2BYkjMbCSZnOENKc9OXTePXZ4qLKTpYjEDiL1phx%2Bd5pvjLK5kvy65e9kYJhFrREeYGU3ZVi0TxaDbI8yZCUNXFqqP4CTTSUWj10xesoQwzxWc%2B1ktzOsGYWXPXPona1mtGOLwSZYghBldGElpa4Thc8t9dfjJpfmW6DfWszQWqT1lA4QNnFs2QpbC41DrRdhHTNWZ%2F41xmDXyyLK%2BWJ%2Bs75ANuJbDjzDD7SU4O3XxemyIMKsWSG5R8y3Rry2MJDcyaudNmvcBi4RjOjfq6X0d2qxtTiqxiQt8U34J7XIaaI51eeEyOvxYncQ8SGjbpd5fTrh689oSzecskOwi%2BC6iw08LAlXG%2BWvSvA8EPrBFIkz%2Be61Zh6TG6wL62yTOA0NdbtNA7VJnjq0WD5jq%2FFIQ0F7lNeia57Rmke4WNd8S%2FbYgUOWYv5bjeQH1wzixSInWXRaabcO7fX1uAln36Gudh4XIXnfrDt%2FRapet1sAUm%2BQ0Mv7SJYxEkG%2Bq5pC0wpaSbFyjSLerxq8zWebSfG39xpoyXWpCsj7YGWOK5mAx6VK%2FRy2a9wHDYvzgu987u0j3pfKQle9Z92L4mmVF4Wfh5craw8c5LMXGyTTPZ03fcdh81xsjzKHNQcelX5fjAOIh2KVoutAHF2%2FiPjv85NJ8Pfod5Li%2BZIVJ0YqZR3MLG0Dhl6yv4EWjlWmx5hmNDGZZkklm3WEOZy%2FRQykonl2HmPleoaS5%2F%2F%2FLqu9QsNAXWwqsGoTp4q3I61%2BOLFVErNehJMZSAiZoUWRXq0Byinc5l%2Babs19BKCYNjIZc8Io%2FMc1IYBlyymYVNoAMZrUb092Fk152dyZPFI32Xaj0LNN0FknOIJQ5YNnvSEL3V7iTz0uPy01d3zBpl6T%2FNctzdMryk2qj5Bqzi3bZxWqp08TB2o4OUibCrFKY2eG%2Blis5%2FGTrlwu2r7kKVCn3RJ1AlFrja9W8D%2Bg3rIWKvXTdsG35Smcvx0FpoFdkkyq5zlEeQ6lNmi6RZidiLk1kuedRjaBk4nUXBx2XtHBCU9txu87FVrShWoWZHe6riuYr%2Bs1xBufihT1JL1AtF0zxtwyHn%2F4QykLGXvosNBctU9YONdd5ScwlI1mdpsljPEc2siTOGZs%2BG4tJ8EmRVmvngMRdz5MGoZqa63VSE6aN8Grl7HW4ryqab47Sbq4CVcYyZUWKb%2BcUNoD0L9jAVKz4KSFMq7ak0A7XLS%2B4VXs0ISTB8jytodvmIkJeljxf7G2bp6KrNivmfVqhHJnNychSc7RKYeYSgkCufkMdjTwFqqJlylIJRbmEDSDPCzY3x9LG%2Fqb6HYXt87rm89nY63uYMzdNuWVl7VDUYOTVL85Q4uE%2Fz7VNU2ylA6mtp3zJpeuPeCjHkJPtssL6sML%2FPhb3wxx5HK9%2FzRJK4ur1eC2Dg8qxUE9Zlzymib015TZuMHlF8n5dkhTk9B4tlUig1XhewKCVyO7UpKl%2BJ%2F9d9Xmtq7bHZ7tE1x84zMOa%2BL4tKJoRJ9F8otzTU5Klq9am0N5GLnO65xgw7jJ%2BMU4T%2Bbp42Eas%2B%2BBzI9sGRzSC7C3VPdWay4Ta5SDDGjGenZJUdSuR%2FYxbNO8DZtIcSm2s%2BR1tts%2Frms9nY68%2F8JiHdR%2BCE3GWomoG3cim%2FIySmXFdzbJko409Y7zoU8%2BUOdUwKXYq3cOEk6RPXdQdByclF6%2FHEmbNUE%2FZFkKwVE5JHppvFoeflP26OOPl9kQWYWe6s8UUplI4%2FACLYKIe1Ui%2FRc4s1xO86K%2BVLgK%2B4%2BjR6%2BL16OMdXMDktiR9r9tpMJep7X5qOfyE9Othrs8pUC2Xyo3bYjwvAPiQ5mxT1FUzyQESeL2VwMwzJ83cDl0k7MOFLAe1vB59N2WVg4xLgeRWCbNWhRJfRyMXTblUXcjcnrKtxvMCQIjkd81WaDo1yLldKk3zmjAR59CY9548A3VxrrpYOkmBbWP28ZR10Y5zQ2cKLBUGEUgqneO1mhGoXISB2PPFVuN5ASBkMS9RbTOFxsmId2oJy5DOMocJ7uGiuIdUxEkk%2FBH3MHZxrLKm78uRpMAwHmN4CN%2BYn8gl3ML5pcprslaoS%2Bp%2BWQrLWapIQ63LSSGBqoTW3mo8LwDEvDRrKo9gtnG5aBrsM3saz2IHKdo5cYGDxrwte726mmsZkRHtV7Sx57nUvITRVNNyej2aTGITTdNpmJOKzRDu0u3Yv5fD4zhZv0LDdLj%2FUaH1MdwJeBYJ1x%2FMsUDvNc6xQ7jNyBCes0adi0x97jnmkQ0kzs4zjMEaB%2BjQvy2EZbtkgmle1m7bJyQoc4ylS2PjPaHZ3JOENwWQSrJ%2BXcKcCr%2F3I99nkXP9AUBfCXRFCrdRBZiLEJcVnfRqeil4pZIsLw43p8nhQqZ7SFWZYYmbZw%2B1is%2FSazy6z5doqe%2Bl1hyGXKvWGtGt2RbnDgAWmXSNYSw7iTVMAAAAAOg7aXay9yXOMAAAAADgMGmui7jJPZ4yrqRzAwAAAAD0iTRXeIiGOD%2FcwqwAAAAAgJ44j6AyAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMLhn54xzB4CfISCAAAAAElFTkSuQmCC\")";
          }
          var newImg = document.createElement("img");
          newImg.src = self.imgUrl == "" ? "data:image/jpeg;base64,%2F9j%2F4AAQSkZJRgABAQAAAQABAAD%2F7QAcUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAD%2F2wBDAAICAgICAQICAgICAgIDAwYEAwMDAwcFBQQGCAcICAgHCAgJCg0LCQkMCggICw8LDA0ODg4OCQsQEQ8OEQ0ODg7%2F2wBDAQICAgMDAwYEBAYOCQgJDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg7%2FwAARCAAWAEUDASIAAhEBAxEB%2F8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL%2F8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4%2BTl5ufo6erx8vP09fb3%2BPn6%2F8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL%2F8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3%2BPn6%2F9oADAMBAAIRAxEAPwD86dE0LQm8BaJLJomkO7afCzMbKMlj5a5J45Nfo54h%2FYb8H6L%2ByL8I9RuPCOpWvxM1nxho2n%2BI5LiyCWf2fUyxWKAFcF4g0KOw6PuH08V%2FYn%2BEtr8YP2lfAWj6w7Q%2BGNJ0qLVtYlEgT93EieWgJ4y0rRj%2FAHd3pX6tfHTwT4U%2BF3hQ674Q8U%2BNrnxPr3iZvEF7bjXfts2pT6bZ3WoBIUlV1jdmhRBsXChshSQor5LB4eUoTqS223P6n4qz2jh8Tg8BhklPlUnaKs9NFJ9Fbmk9H9n1Pzs8H%2FsxfAbXv%2BCj37QPhHUNCsrP4U%2FD7SL24i%2B3aotkvnQNDComvDG2yMyGXLbTgdjjB9H%2BFn7IP7O%2FxKs%2FEes23w60e4sP%2BE3g8N6Ra2PxFRoJIorRbi%2BvLe6a1BvCqsWESxgkRtyACa19L%2BOnxn17SbX4m%2BIrnUPA%2Bux6TrRk0q1tAE1zS7bTftsEyJOryYW6lgVpVbbIr9tjV514T8XfFPUdG%2BFXjbxP4yvbO80e81P4ga1dXNzaaYJWmxp9hbI0oSGOW7%2Bz3CqW%2FwCWTu4BCCuqnOmntf5f1tc8zGYLMKkJNzjBqMY6Sb96Kd9kk3OUdZXv7yW9zl4%2FgZ%2Byiv7LHjPxbpPgHxJ40ni%2BJzeCPCOrjXFtU1Z5yz29z5IgGFiRowy4zIVJ%2BTdgO%2BPnwE%2FZU%2BF%2Fx60rwNo3gr%2B3rW21V01680HxsuoaraW0FsWuDcWBtgLXEjq24yMdkT4GTxz3xUuvE3w2%2BG3ivT9H1K8g0vTfjX%2Fa%2FgeC32TQWTLZ%2FbZboEKRMSt3YKrOWXCnH3jn1mH9or4m2Pxgil8XajB4q1Dwl8IpPEGr32oR%2BTLDf3lkJPLXyPLXEjXdhA6urcI23aWYm41I7PR6dDSWXYhSjiKUueD53bnab0jy9LaN2a0XNJ2TSR714U%2F4J%2B%2Fsf%2BLV%2B1TaB43UXUu63ksLoPGuSPkdEhYx4J%2BWQ%2FupUKSI5DELl%2FtC%2FwDBO%2F8AZZ%2BEf7FHxJ%2BI%2BmaR4qbVdD0WSbTxc6ojxG5YiOHcvlDcvmOmR3rw7RviP8Tvgv8Asaa9q%2FhnXYPDPii3vdN8Var4Z0zWIXh0qwuZ0tzpf2WR5LmAMj287scBDOqqQd2eA%2Fac%2BP3jq5%2BF958Lr74peKvH9p4pa016ePUreK3TSdLmRLuwsGVI0MlyVeKSaQ5UbY1Xq5reVakoO8dTwcDw%2FnNXMafJir0lPVXeqjyuWyaWj72fQ%2FK%2Fx1Y2MA0ryLKzh3ebu8uBVz9z0FFW%2FiB00j%2Ftr%2F7JRVYWT9kjk42oU451WSikvd6f3YnoGj%2FEzQrXwhpNs1trPmRWUUblIkwSqAHHz9K0IPi1ptlqtvfWDeI7G%2Bt5BJb3MBWOSJxyGVlkypHqDmiivBdCHM3Y%2FVcNneN%2BrQXPpyrou3obmo%2FtH%2BI9U1%2FSdXv%2FABb8QbzV9LDjTdQmvi1zaB%2FvLHL5u9VP90HHJ45Oeb1j403GvSXra3q%2FjDWGvLhLi7N9cmbz5UQojvukO5lVmVSeQCQMA0UVvGnGxgszxEbcrSt%2Fdj3v276%2Bpdt%2F2h%2FFVjo0%2Bm2PjT4j2enTLtmtYNWlSKQeWsWGUS4I8tETn%2BFVHQAVy83xYea71CeXUPE8k9%2FCsV9I82WuUQoUSQmTLqpjjIByAUXHQUUV0KnE5%2F7TxEXdNL%2Ft2P8AkQzfFRrnUdXvLjUPE093qqsuqTSTbnvQzrIRMxkzIC6qx3Z5UHqBVa9%2BI9rqWoteajLrt%2FdsiI09yRI5VFCINzOThVVVA7AADgUUVXsojWb4pbS%2FBf5HAeL%2FABLYakNO8iK8Xy%2FM3eYijrt9GPpRRRXpYeCVNH4%2FxVja1TNKspS107fyo%2F%2FZ" : self.imgUrl;
          newImg.alt = newImg.title = "Signaler une alerte qualitaÿ";
          newImg.style.cursor = "pointer";
          newImg.style.marginRight = "3px";
          newImg.style.height = "16px";
          newImg.addEventListener("click", function(event) {
            var newDiv;
            self.currentPostId = self.getElementByXpath(".//a[starts-with(@name, \"t\")]",
              toolbar.parentNode.previousSibling).pop().name.substring(1);
            self.currentPostUrl = self.getElementByXpath(".//div[@class=\"right\"]//a",
              toolbar.parentNode.previousSibling).pop().href;
            if(document.getElementById("alerte_qualitay")) {
              newDiv = document.getElementById("alerte_qualitay");
            } else {
              self.generateStyle();
              cssManager.insertStyle();
              newDiv = self.generatePopup(topicId);
              root.appendChild(newDiv);
            }
            var defaultAlerte = true;
            newDiv.style.display = "none";
            newDiv.firstChild.nextSibling.style.display = "block";
            var alerteDiv = document.getElementById("alerte_qualitay");
            var inputAlertes = document.createElement("select");
            inputAlertes.tabIndex = 1;
            inputAlertes.addEventListener("change", function() {
              this.nextSibling.style.display = this.value == "-1" ? "block" : "none";
            }, false);
            var newAlerteOpt = document.createElement("option");
            newAlerteOpt.value = "-1";
            newAlerteOpt.innerHTML = "-- Nouvelle alerte --";
            inputAlertes.appendChild(newAlerteOpt);
            self.alertes = new Array();
            Array.forEach(alerteNodes, function(alerteNode) {
              var alerteOpt = document.createElement("option");
              alerteOpt.value = alerteNode.getAttribute("id");
              var ids = alerteNode.getAttribute("postsIds").split(/,/);
              if(ids.indexOf(self.currentPostId) != -1) {
                alerteOpt.selected = "selected";
                defaultAlerte = false;
              }
              alerteOpt.innerHTML = "[" + alerteNode.getAttribute("date") + "] " +
                alerteNode.getAttribute("nom") + " (" + alerteNode.getAttribute("pseudoInitiateur") + ")";
              inputAlertes.appendChild(alerteOpt);
            });
            if(alerteDiv.firstChild.nodeName.toLowerCase() != "select") {
              alerteDiv.insertBefore(inputAlertes, alerteDiv.firstChild);
            } else {
              alerteDiv.replaceChild(inputAlertes, alerteDiv.firstChild);
            }
            if(!defaultAlerte) {
              newDiv.firstChild.nextSibling.style.display = "none";
            }
            alerteDiv.style.display = "block";
            alerteDiv.style.left = (event.clientX - newDiv.offsetWidth) + "px";
            alerteDiv.style.top = (window.scrollY + event.clientY + 8) + "px";
          }, false);
          var lastDiv = toolbar.lastChild.previousSibling;
          if(lastDiv.className == "right") {
            lastDiv.appendChild(newImg);
          } else {
            var newDiv = document.createElement("div");
            newDiv.className = "right";
            newDiv.appendChild(newImg);
            toolbar.insertBefore(newDiv, toolbar.lastChild);
          }
        });
      }
    });
  }
}).launch();
