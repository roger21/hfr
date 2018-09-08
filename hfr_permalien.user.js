// ==UserScript==
// @name          [HFR] permalien
// @version       2.0.2
// @namespace     roger21.free.fr
// @description   ajoute un lien permanent pour les messages (dans la barre du message à droite)
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 240 $

// historique :
// 2.0.2 (26/05/2018) :
// - ajout du support pour la cat shop
// 2.0.1 (13/05/2018) :
// - maj de la metadata @homepageURL
// 2.0.0 (12/04/2018) :
// - nouveau nom : [HFR] urgo -> [HFR] permalien
// - nouvelle icône pour le lien (dans la barre du message à droite)
// - gestion des urls verbeuses
// - nouvelle description
// - suppression des @grant inutiles (tous)
// 1.1.2 (28/11/2017) :
// - passage au https
// 1.1.1 (28/07/2017) :
// - commentage des logs de debug
// - légère amélioration du code
// 1.1.0 (15/07/2017) :
// - ajout du support pour les topics sans sous cat
// 1.0.0 (15/01/2017) :
// - ça a l'air bon :o
// - commentage des logs de debug
// 0.9.0 (15/01/2017) :
// - création

var id2cat = {
  31: "service-client-shophfr",
  1: "Hardware",
  16: "HardwarePeripheriques",
  15: "OrdinateursPortables",
  2: "OverclockingCoolingModding",
  30: "electroniquedomotiquediy",
  23: "gsmgpspda",
  25: "apple",
  3: "VideoSon",
  14: "Photonumerique",
  5: "JeuxVideo",
  4: "WindowsSoftware",
  22: "reseauxpersosoho",
  21: "systemereseauxpro",
  11: "OSAlternatifs",
  10: "Programmation",
  12: "Graphisme",
  6: "AchatsVentes",
  8: "EmploiEtudes",
  9: "Setietprojetsdistribues",
  13: "Discussions"
};

function indexObj(obj, str) {
  for(let prop in obj) {
    if(obj[prop] === str) {
      return prop;
    }
  }
  return null;
}

var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABV0lEQVR42r2Su0oDQRSG15DCJtiqiakSgnkPIWAtbjSFlqI%2Bgq1PYJFGgnGzc9lZC0F7kajgBW18DbVSBNFvkhECrsnGwoGfnWHPd86cf47npVydWGSCWEx4f1kiUgUVqQaqi0gWxoJlJKtK6zut9Qf6VFrdSC2rKWFVBnpAT4DLnH32byS8IElpKAwwidoOrg0kXbA3QdujEuTQI9VOgHZEJCq9BEY2XIKNYZUtPIWaLtj2voYfK%2B58Fho5neC2LBN40K%2BsmlTedcA7LxC7fTc0YSHJ7Xl%2B3qNnrn06UBlQ7bG%2FQvtBIqxVnp%2FX6IVEi7bnPkxl4MAEOW4w2zpuZ39e24gMQav2nfnWndMV9utA2lZmkPK%2Fum3HE6BnDoA%2F8FxLro1W6%2BgwO2JUxRwVbwl%2BpYUa8h18idvFdFOneyPb%2FTYPneN2cby5N7IEuEWizY4JZ7z%2FWF87%2Bx0mY0rJLAAAAABJRU5ErkJggg%3D%3D";

var cat = null;
var topic = null;

function permalink(cat, topic) {
  // récupération des posts
  let posts = document.querySelectorAll("table.messagetable > tbody > tr.message > td.messCase1 > div.right > a[href^=\"#t\"]");
  for(let post of posts) {
    // noméro du post
    let num = /^.*#t([0-9]+)$/.exec(post.href);
    if(num !== null) {
      num = num[1];
      // construction du lien permanent
      let newdiv = document.createElement("div");
      newdiv.setAttribute("class", "right");
      let newlink = document.createElement("a");
      newlink.href = "https://forum.hardware.fr/forum2.php?config=hfr.inc&cat=" + cat + "&post=" + topic + "&numreponse=" + num;
      let newimg = document.createElement("img");
      newimg.src = img;
      newlink.appendChild(newimg);
      newdiv.appendChild(newlink);
      // ajout du lien permanent
      let toolbar = post.parentElement.parentElement.parentElement.querySelector("td.messCase2 > div.toolbar");
      let spacer = toolbar.querySelector("div.spacer");
      toolbar.insertBefore(newdiv, spacer);
    }
  }
}

// récupération de la cat et du topic dans l'url de la page
var resultp = /^.*&cat=([0-9]+).*&post=([0-9]+)&.*$/.exec(window.location.href);
if(resultp !== null) { // url à paramètres
  cat = resultp[1];
  topic = resultp[2];
} else {
  var resultv = /^https:\/\/forum.hardware.fr\/hfr\/([^\/]+)\/.*sujet_([0-9]+)_[0-9]+\.htm.*$/.exec(window.location.href);
  if(resultv !== null) { // url verbeuse
    cat = indexObj(id2cat, resultv[1]);
    topic = resultv[2];
  }
}

// construction des liens permanents
if(cat && topic) {
  permalink(cat, topic);
}
