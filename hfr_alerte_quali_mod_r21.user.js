// ==UserScript==
// @name          [HFR] alerte qualitaÿ mod_r21
// @version       2.0.2
// @namespace     http://toyonos.info
// @description   Permet de signaler une alerte qualitaÿ à la communauté
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
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

// modifications roger21 $Rev: 181 $

// historique :
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
            switch(response.responseText) {
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
              "url(\"http://reho.st/self/7f4220bf61ed03e36ede5ef8cb2217dd1d520471.png\")";
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
