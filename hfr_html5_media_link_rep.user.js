// ==UserScript==
// @name          [HFR] html5 media link replacer
// @version       1.8.0
// @namespace     roger21.free.fr
// @description   remplace les liens vers des fichiers sons ou videos supportés par le lecteur html5 de firefox (wav, mp3, ogg, webm, mp4, gifv et gfycat) par le lecteur audio ou video ad-hoc
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @connect       i.4cdn.org
// @connect       i.imgur.com
// @connect       gfycat.com
// @connect       *
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// ==/UserScript==

// $Rev: 181 $

// historique :
// 1.8.0 (13/05/2018) :
// - amélioration du code et check du code dans tm
// - ajout du mode anonyme sur le gm_xhr de la requête HEAD pour le content-type
// - ajout d'une protection suplémentaire sur les liens en forum.hardware.fr
// - ajout d'une option en dur pour n'afficher les vidéos que par clic (needclick)
// - ajout de la gestion des liens quotés (en affichage par clic)
// - ajout d'un style distinctif pour les liens vidéos cliquables (l'émoji play)
// - ajout des metadata @connect pour tm
// - suppression des @grant inutiles
// - maj de la metadata @homepageURL
// 1.7.2 (28/11/2017) :
// - passage au https
// 1.7.1 (29/12/2016) :
// - remplacement de l'espace entre la video et le lien par un espace insécable
// 1.7.0 (09/12/2016) :
// - ajout du lien vers le lien :o (à côté du media)
// - léger nettoyage du code
// 1.6.1 (23/09/2016) :
// - ajout du support du mp3
// 1.6.0 (06/08/2016) :
// - gestion des gifv avec les deux sources (webm et mp4)
// - ajout d'un support pour les gfycat
// 1.5.0 (02/01/2016) :
// - optimization des images
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.4.1 (22/03/2015) :
// - ajout d'un vertical-align:bottom sur le lecteur (pour faire comme les images avec le style hfr images smileys)
// 1.4.0 (07/03/2015) :
// - ajout du support pour le mp4 (à l'arache, pas testé)
// 1.3.1 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.3.0 (20/02/2015) :
// - ajout d'un bouton pour boucler (ou non) le media
// - correction et ammélioration de la gestion des medias dans des liens
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.2.0 (16/02/2015) :
// - ajout des parametres pour limiter (ou non) la taille des vidéos
// 1.1.0 (16/02/2015) :
// - ajout d'un support pour les gifv d'imgur
// 1.0.0 (19/01/2015) :
// - création

var needclick = false; // passer à true pour n'afficher les vidéos que par clic

var default_max_height = 288;
var default_max_width = 512;

var img_loop = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd%2BUAAADT0lEQVR42u1W30uTURj%2B5nSKhSBZEF6ImgbmhRchItF%2FIBp60ZUY3SiFWtKNoMySxEiSrsTM%2Ff6WmlPKC39QoW3NmRrqtDJwVk6bjGZbudZadh47Jz4%2BzX39vvHA4ft2vvM%2Bz%2Fu%2B53nfMy6K4%2Fh%2FObldwv9GGMlxBvaukMl4juN0ZLbjGR0RsWXPbxHKCBAB1pKppkS6E3l5A7d4%2Fmlhfv4gXVPLKOFOxJw4CkwF8RheC6LQHs3KunO%2BosJ8tqxshPxuu6hU2jboWPN4%2FBeqqizUKQPDkUSIp5w8yeQLCwoGjQbD3Kzdvurz%2BQIAv0SICOgNZW3td0I27g0NOcg3jexnIoSXl%2BvrH2%2F8YOyPj%2B8ke%2FRpycnd9XV1YzMzMy7h94H%2B%2FgVgyH4Q5ZYzRHQxcjn%2FyGJZAsAXMhjYosPhAVhMZCTSDedUiEhZUzMqJD1TWjqMM5UsGmw%2BnJpq8vv9QSGpur3dDgKolHlPBdXWIMjK8vKyF44x9UoivN7c%2FEScztMlJQ%2FEntNj0CMzLxcX19je3Ozsu1gPS0jVqXU6ne9gGAgEPhMgz%2Fr6%2BidEjW%2FCs2HvZP1mZ0fHM0Z4tbFxfLu0biFEunCGzPDNyorvUFJSd011tRVRiBUoaAKqKw0N48xOr9XOYi0sIQDTU1JMzPDF%2FLwbqYG3YtWxdGakp%2Ffg%2B7Wmpklm19rSMiWJECAHiPSFytwbHW0E8HYFjcaAjoMatFqtS8zuXHn5QwgsLCHSiXNyu90fYBgMBkPHcnL6YCwmowrV2AW1GAqFNhW9Ly6uQ1Id0jPR9JhM8wyEJ90GohCLBY4hnR7S2oTl093V9RzplFQWFEhzPDe3T1gSVZWVZtpX9cgC3adGqYjLZ2R4%2BBXtq3pJdSinYAadbk4I1EuiTkpMvA0wlgmdRjO7XQscs9mcexQKo5iU2%2Bn%2BA6nFbH4tBpucmFihpaBF2bB1r9f7cXpqyqVVqewni4qGYqOijBFikYUhRDno21pbp4WEtHVpjpDzW3W53uNGOVVcfD8rM7MX6%2BxiliQaISFNG0hVGWlpJojHsbDw1jY66gRg7LeU6SiJmt0Sv3zjs7qD2mgJbHp%2BMCGhS9gK4dgf%2FYsh6pmIWCeVYPdv4l%2BfXwGbYs%2FAvBNOBgAAAABJRU5ErkJggg%3D%3D";
var img_no_loop = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd%2BUAAAGDElEQVR42qVWaUxUVxgdYNqSuBS17R9jUBRorUkbEmrVWDX2jxoTCSipqQkVBEVBoYQYlNVSkTJg0AYEZmdmYGYYbdGUyCg1tWWpQIOyuiFVFotCgEoRZ16%2F83h38hhAqX3JzRse997zLeeceyVvSCT62Q7pxFvn9E33X%2FaQzAKE39CV3hKJREND5TTUNIpnCy55FdCbLi56YWPNsiVLfvjU39%2B6eePGa59v2nTts3Xrrq708bnk7uZmoP8r3GgN5mOt9HUABaDi7Vu3%2FvZtevrjc%2Fn5Y4aSEq6srIyzWCyc0WTiFAqFPTs7ezBi377mdzw8zDRf6fKSjCXTAQlg6k%2F8%2FCrPnDkzotfrOZPZzJUQWF5e3mgOAaSnp%2Fenpqb2y%2BVyPgCDwcCp1Wruy927G2itdqYyS2bITPFFcHB9cXExD4KN9kdEtHt7ef20cN48ZKEPCgiovGCx3I2Jjv59Z2DgjaysrBHMB3BKSkoPAKcDlUyXGcBKS0s5bPB1bOyfizw8LCs8PU0HwsOrwkNDr9KcguTExBpOeB739Q3GxcRcjzp4sE2j0XAltBYtEIhWPC0g%2Fwf1zN%2FP7zKAqDccLR7WabXNTU1NPSMjI8%2Bx%2BYmUlFqaV5iSlFTLOT0KubyvoKDArtVqOT1leogCQLVApEmAUoFdiOYs9UypVHJWq5Wz2%2B02503fXbDAiHney5aVfZOWVnfr5s0%2B%2Bmyrqanh1JRdYWGh%2FURaWh%2FagN5%2FvGpVBXo6JUNkBzYisvz8fNsVq%2FURAAjUzsA6798fgDzcpVLMR7nkyKCosPAvAFB2XEtLCxcWEmJNSkzsRVuSk5IeYW83QSoSsahRdxNRfX94eDtpzjg6OjouBlUpFLfQY6Y1%2FD586NBtMBVlbGhomAiss7OfMrsMQGqNzXf58nLM5ddIJ7LjRQ2dgZUfeHtXZGZkTOlRaEhIFdMm3lGRke0lArnCw8KaH3R2PmFzN2%2FYUCHLyho0k2S2bdnyK%2BazkvICh4NA1FTOf%2Ba5u5u6urqeYuHY2NgL2mjg2bNnzylSC7O3mMOH7wAMfQIYffveZDS2McDk48evR0dF3TWTfok87cjQ0UNsALuCgOEab8%2BZU4pKYmFvT88wSaIsMSGhWhC0IzNUQwBTYGSePHmDAZ7Ly6sneTUZjUbuWEJCFwLlickA4Y1lZFffZWY%2B%2FdDH5wJbeLujo5%2BVECP2yBFHZvtCQ9HTovdXrEDm6hyZrIGtOy2T1QXv3PkH%2BkgEejgFcP3atVcRTW5u7rD30qUXxMx8y9UVZVeKMxPAcFLIS%2FT61iuVlferq6sfsnVf7dlTGXngQAdIGBsTc8dRUsY2uD6MGARY7ul5kUo5iIXj4%2BO2datX%2F0gO0%2BaUmVzIXC1okX9sNhtaYfeYO7f0VEZGP6pGmd4Qk4YXvLurqyFbJhtEH7dv21an1%2Blusk2o8UOgPnxS6BmvK5SJAj0%2FMDAwKpaPQae7tWj%2BfAtsTqfTcXAvhyxEwlfgiEEGOTk5f69fs%2BYiAq6treVUKhUH99kVFNSInjGrAjCk4iyfn6uq7kaTPlFOcEIq8lSHtSFinGdwDESFTHJPn36EKOEgjY2N3MXy8nbPxYvNDgJQ1Fq1utkZcGhoiA8QvQ4MCKhj5ZxkbcIGSpxnKB2cA0YME4ddMZngaaiv7xEkooFs2Hcq7XB7W9sQmInAM0%2BdesKcadrjyWWCBNrU5ORuEERDoDDis7m50NcLtnF3d%2FcQNiL5nO%2Fr7R1WK5VNQTt2VOwKDPyFdDyCChUVFb2AeyGomc5D1hf%2B4ISvwsjRv%2BPHjvXsDg6uNptMHa0tLd3XqEfopSB4zXsLF54P27u3FScF1pCZj6%2F09b3ESjnjecj%2BAUAYOs4zHZEI%2BgSZSMCP4%2BPjHyQcPXovMiKiJT4u7h6R4gnKB4LAGlFGITMVM%2FlXXjFEmSo%2BovMMRwxcH0YMcARRSm%2BAQGcoIdgoEARmoJn1JUp83RCIxPunj5dXOVwfRgxvhF3BQSBq6EzQpUp0TdS91kUYw23yJVgt%2FNYIvyddhv%2F3zZsRShwxshBT%2FWUZOY9%2FAVSDQeaYVUvnAAAAAElFTkSuQmCC";
var img_blank = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd%2BUAAAAGklEQVR42u3BMQEAAADCoPVPbQhfoAAAAH4DDFwAAS4EN7cAAAAASUVORK5CYII%3D";
var img_link = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA8ElEQVR42mNgwAEeKHbJAfFrIP6OhL8i4c9AfJwBHwAq8ALin0D8Hwf%2BzkAIABX5APFvvAYAGQVAfBWInwPxSyhuhMrl4XUBkCiCcv5C%2FfUeiKcDMRMQ5%2BDRDDfgJtSfWmhOJ6QZbgAopF%2BiaY6CugiXxr%2FIBrzHYsBePJpnArEf1NU4DajAoXk2KGyQovg9VgOgCqZisRkcsEhqNHAaAFVQB8QXoTRIcxkoFaIrwmkAFgOfYzPgNQkGgBLYZ3TBu9AQVSCgWQaaoR6iS9RAAwmUwx7iwZ%2Bh6hrRDQAFTjMQP4Ua8h0L%2FgqVB6ljQdYPAMDbiNWgxT3XAAAAAElFTkSuQmCC";

var extensions = ["wav", "mp3", "oga", "ogv", "ogg", "ogx", "webm", "m4v", "mp4", "gifv", "gfycat"];
var audio_mime = ["audio/wave", "audio/wav", "audio/x-wav", "audio/x-pn-wav", "audio/mpeg", "audio/ogg", "audio/webm"];
var video_mime = ["video/ogg", "application/ogg", "video/webm", "video/mp4"];

var gfycat_re = /^http(?:s)?:\/\/gfycat\.com\/([\w]+)$/;

var links = document.querySelectorAll("td.messCase2 > div[id^='para'] > p > a.cLink, table.spoiler a.cLink");
var linksq = document.querySelectorAll("table.quote a.cLink, table.citation a.cLink, table.oldcitation a.cLink");

GM_registerMenuCommand("[HFR] html5 media link replacer -> hauteur maximale des vidéos", set_max_height);

function set_max_height() {
  let l_max_height = GM_getValue("max_height", default_max_height);
  l_max_height = window.prompt("[HFR] html5 media link replacer -> hauteur maximale des vidéos (défaut : " +
    default_max_height + ")\n\n" +
    "-1 : désactivé (hauteur originale de la video)\n" +
    "0 : auto (adapté à la hauteur d'affichage de la page)\n\n", l_max_height);
  if(l_max_height === null) return;
  if(parseInt(l_max_height) === -1) GM_setValue("max_height", -1);
  else if(parseInt(l_max_height) >= 0) GM_setValue("max_height", parseInt(l_max_height));
  else GM_setValue("max_height", default_max_height);
}

var max_height = GM_getValue("max_height", default_max_height);
if(max_height === -1) max_height = null;
if(max_height === 0) max_height = window.innerHeight - 20;

GM_registerMenuCommand("[HFR] html5 media link replacer -> largeur maximale des vidéos", set_max_width);

function set_max_width() {
  let l_max_width = GM_getValue("max_width", default_max_width);
  l_max_width = window.prompt("[HFR] html5 media link replacer -> largeur maximale des vidéos (défaut : " +
    default_max_width + ")\n\n" +
    "-1 : désactivé (largeur originale de la video)\n" +
    "0 : auto (adapté à la largeur d'affichage de la page)\n\n", l_max_width);
  if(l_max_width === null) return;
  if(parseInt(l_max_width) === -1) GM_setValue("max_width", -1);
  else if(parseInt(l_max_width) >= 0) GM_setValue("max_width", parseInt(l_max_width));
  else GM_setValue("max_width", default_max_width);
}

var max_width = GM_getValue("max_width", default_max_width);
if(max_width === -1) max_width = null;
if(max_width === 0) max_width = window.innerWidth - 275;

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent = "a.cLink.gmhtml5mlr::after{content:\"\\0020\\25b6\\fe0f\";}";
document.getElementsByTagName("head")[0].appendChild(style);

function replace(links, p_needclick) {
  for(let link of links) {
    if(link.href.match(/^https?:\/\/forum\.hardware\.fr\/.*$/g) === null) {
      let ext = null;
      if(gfycat_re.test(link.href)) {
        ext = "gfycat";
      } else {
        let idx = link.href.lastIndexOf(".");
        if(idx !== -1) ext = link.href.substring(idx + 1);
      }
      if(ext) {
        if(extensions.indexOf(ext) !== -1) {
          GM_xmlhttpRequest({
            method: "HEAD",
            url: link.href,
            mozAnon: true,
            anonymous: true,
            headers: {
              "Cookie": ""
            },
            onload: function(response) {
              let mime = /^Content-Type: (.*)$/m.exec(response.responseHeaders);
              if(mime) {
                mime = mime[1];
                let media_type = "";
                if(audio_mime.indexOf(mime) !== -1) media_type = "audio";
                else if((video_mime.indexOf(mime) !== -1) || (ext === "gifv") || (ext === "gfycat")) media_type = "video";
                if(media_type !== "") {
                  link.classList.add("gmhtml5mlr");
                  let media = document.createElement(media_type);
                  if(ext === "gifv") {
                    let source_webm = document.createElement("source");
                    source_webm.setAttribute("type", "video/webm");
                    source_webm.setAttribute("src", link.href.replace(/.gifv$/, ".webm"));
                    let source_mp4 = document.createElement("source");
                    source_mp4.setAttribute("type", "video/mp4");
                    source_mp4.setAttribute("src", link.href.replace(/.gifv$/, ".mp4"));
                    media.appendChild(source_webm);
                    media.appendChild(source_mp4);
                  } else if(ext === "gfycat") {
                    let gfycat = link.href.match(gfycat_re)[1];
                    let source_zippy = document.createElement("source");
                    source_zippy.setAttribute("type", "video/webm");
                    source_zippy.setAttribute("src", "https://zippy.gfycat.com/" + gfycat + ".webm");
                    let source_fat = document.createElement("source");
                    source_fat.setAttribute("type", "video/webm");
                    source_fat.setAttribute("src", "https://fat.gfycat.com/" + gfycat + ".webm");
                    let source_giant = document.createElement("source");
                    source_giant.setAttribute("type", "video/webm");
                    source_giant.setAttribute("src", "https://giant.gfycat.com/" + gfycat + ".webm");
                    media.appendChild(source_zippy);
                    media.appendChild(source_fat);
                    media.appendChild(source_giant);
                  } else {
                    media.setAttribute("src", link.href);
                  }
                  media.setAttribute("controls", "controls");
                  media.setAttribute("title", link.href);
                  if(max_height !== null) media.style.maxHeight = max_height + "px";
                  if(max_width !== null) media.style.maxWidth = max_width + "px";
                  media.style.verticalAlign = "bottom";
                  let loop = document.createElement("img");
                  loop.style.cursor = "pointer";
                  if(media_type === "video") {
                    loop.style.position = "absolute";
                    loop.style.zIndex = "100";
                    loop.style.opacity = 0.5;
                    loop.src = img_blank;
                  } else {
                    loop.src = img_no_loop;
                  }
                  loop.addEventListener("click", function(e) {
                    if(media.hasAttribute("loop")) {
                      loop.src = img_no_loop;
                      media.removeAttribute("loop");
                    } else {
                      loop.src = img_loop;
                      media.setAttribute("loop", "loop");
                    }
                  }, false);
                  if(media_type === "video") {
                    loop.addEventListener("mouseover", function(e) {
                      if(media.hasAttribute("loop")) loop.src = img_loop;
                      else loop.src = img_no_loop;
                    }, false);
                    media.addEventListener("mouseover", function(e) {
                      if(media.hasAttribute("loop")) loop.src = img_loop;
                      else loop.src = img_no_loop;
                    }, false);
                    loop.addEventListener("mouseout", function(e) {
                      loop.src = img_blank;
                    }, false);
                    media.addEventListener("mouseout", function(e) {
                      loop.src = img_blank;
                    }, false);
                  }
                  media.style.verticalAlign = "bottom";
                  var external_link = document.createElement("a");
                  external_link.setAttribute("href", link.href);
                  external_link.setAttribute("title", link.href);
                  external_link.setAttribute("class", "cLink");
                  var img_external_link = document.createElement("img");
                  img_external_link.setAttribute("src", img_link);
                  img_external_link.style.verticalAlign = "bottom";
                  external_link.appendChild(img_external_link);
                  if(link.textContent.indexOf(link.href.substr(0, 34)) === 0 && !p_needclick) {
                    link.parentNode.insertBefore(external_link, link.nextSibling);
                    link.parentNode.insertBefore(document.createTextNode("\u00A0"), link.nextSibling);
                    link.parentNode.replaceChild(media, link);
                    media.parentNode.insertBefore(loop, media);
                  } else {
                    link.addEventListener("click", function(e) {
                      e.preventDefault();
                      link.parentNode.insertBefore(external_link, link.nextSibling);
                      link.parentNode.insertBefore(document.createTextNode("\u00A0"), link.nextSibling);
                      link.parentNode.replaceChild(media, link);
                      media.parentNode.insertBefore(loop, media);
                    }, false);
                    if(link.children.length) {
                      for(var i = 0; i < link.children.length; ++i) {
                        link.children[i].addEventListener("click", function(e) {
                          e.preventDefault();
                          link.parentNode.insertBefore(external_link, link.nextSibling);
                          link.parentNode.insertBefore(document.createTextNode("\u00A0"), link.nextSibling);
                          link.parentNode.replaceChild(media, link);
                          media.parentNode.insertBefore(loop, media);
                        }, false);
                      } // for children
                    } // if children
                  } // p_needclick
                } // if media_type
              } // if mime
            } // function onload
          }); // objet gm_xhr
        } //if extensions
      } // if ext
    } // if forum
  } // for links
} // function replace

replace(links, false || needclick);
replace(linksq, true);
