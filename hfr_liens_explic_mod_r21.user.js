// ==UserScript==
// @name          [HFR] Liens explicites mod_r21
// @version       2.6.4
// @namespace     roger21.free.fr
// @description   Remplace le texte des liens internes du forum dans les posts par une description précise du lien.
// @icon          https://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @author        roger21
// @authororig    turlogh
// @modifications Recodage en fetch pour ne pas niquer les drapoils, uniformisation et simplification des liens et du fonctionnement, mise à jour des cats et sous-cats, amélioration des fonctionnalités et amélioration du code.
// @modtype       réécriture et évolutions
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2011-2012, 2014-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1416 $

// historique :
// 2.6.4 (01/01/2020) :
// - mise à jour des cats et sous-cats
// 2.6.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - retour des requêtes fetch en mode "same-origin" au lieu de "cors"
// 2.6.2 (23/09/2019) :
// - passage des requêtes fetch en mode "cors" pour éviter un plantage sous ch+vm en mode "same-origin"
// 2.6.1 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 2.6.0 (29/11/2018) :
// - nouveau nom : [HFR] liens explicites mod_r21 -> [HFR] Liens explicites mod_r21
// - ajout de l'avis de licence AGPL v3+ *si turlogh est d'accord*
// - appropriation de la metadata @author (passage en roger21)
// - ajout de la metadata @authororig (turlogh)
// - réécriture des metadata @description, @modifications et @modtype
// 2.5.0 (26/05/2018) :
// - ajout du support pour la cat shop
// - correction de la deteton de la cat pour la cat shop (qui a des tirets !)
// - retour du support partiel pour les liens en http (support qui avait disparu avec le passage en fetch car cross-origin)
// - remplacement du getElementByXpath par un querySelectorAll
// - remplacement des innerHTML par des textContent et nodeValue (et complications associées [:palm])
// - remplacement des comparaisons par des comparaisons stricts
// - petits restylages de code
// 2.4.3 (13/05/2018) :
// - maj de la metadata @homepageURL
// 2.4.2 (11/05/2018) :
// - mise à jour des @modifications
// 2.4.1 (11/05/2018) :
// - re-check du code dans tm
// 2.4.0 (28/04/2018) :
// - recodage en fetch et recherche imédiate du titre exacte
// - petites améliorations du code et check du code dans tm
// - suppression des @grant inutiles (tous)
// 2.3.0 (16/02/2018) :
// - passage à gm_xhr au lieu de xhr pour la compatibilite ch (le xhr de ch n'a pas le mode anonyme)
// - et ajout d'une compatbilité avec vm pour le mode anonyme de gm_xhr (via http cookie) par PetitJean
// - correction des erreurs signalées par tm
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 2.2.3 (09/02/2018) :
// - correction du passage au https
// 2.2.2 (28/11/2017) :
// - passage au https
// 2.2.1 (06/09/2016) :
// - ajout du support pour les posts de modération (rose)
// - mise à jour des cats / sous-cats mais y'avait rien de nouveau :o
// 2.2.0 (29/11/2015) :
// - maj des cats/sous-cats (nouvelle cat diy)
// - nouvelle meilleur gestion des titres des topics contenant des tirets
// - simplification de la regexp des titres
// 2.1.0 (22/11/2015) :
// - nouveau nom : [HFR] Liens Explicites mod_r21 -> [HFR] liens explicites mod_r21
// 2.0.1 (21/11/2015) :
// - ajout d'un let (oui comme ça)
// - suppression du null (qui sert à rien) dans le send
// 2.0.0 (11/11/2015) :
// - nouveau numéro de version : 0.0.1.6 -> 2.0.0
// - nouveau nom : [HFR] Liens Explicites -> [HFR] Liens Explicites mod_r21
// - suppression complète du log de performance
// - suppression complète des logs
// - remplacement des ' par des " (pasque !)
// - modification de commentaires
// - genocide de commentaires et de lignes vides
// - uniformisation de la syntaxe du code
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - suppression de la toyoAjaxLib remplacé par du code direct (plus simple, moins lourd)
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - utilisation du mode anonyme de xmlHttpRequest pour ne pas envoyer les cookies et niquer les drapoils
// - suppression des rewriteurl (inutile avec le mode anonyme, utilisation du href à la place)
// - suppression du cancel (utilisation d'un timeid à la place)
// - suppression du fetchid (utilisation d'une closure à paramètre à la place)
// - remplacement de this par un e.target (plus clair)
// - gestion du passage unique dans la fonction de recherche du titre de topic
// - mise à jour des cats et sous-cats
// - meilleur gestion des titres des topics contenant des tirets
// - gestion des recherches avec pseudal *et* mot
// - ajout d'un tooltip explicte
// - uniformisation et simplification des formats des liens transformés
// - ajout de la recherche du titre du topic pour les liens de recherche
// - suppression des fonctions logObj et $id rendues inutiles
// - changement de la variable "el" en "lien" à plusieurs endroits
// - changement de la variable "event" en "e" à plusieurs endroits
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 0.0.1.6 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 0.0.1.5 (27/03/2014) :
// - ajout d'une icone au script
// - renplacement du namesapce douteux par roger21.free.fr
// - ajout des dates dans l'historique
// 0.0.1.4 (22/03/2014) :
// - désactivation du log (!)
// 0.0.1.3 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 0.0.1.2 (14/09/2012) :
// - ajout des metadata @grant
// 0.0.1.1 (28/11/2011) :
// - renomage du script (ajout du [HFR] au début) pour ne pas faire tache dans la liste des scripts greasemonkey
// - désactivation du message d'erreur XML dans la toyolib
// - ajout d'un .1 sur le numero de version
// - suppression des lignes vides en bas

/* ====================== Listes de cats et souscats ======================== */

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
  13: "Discussions",
};

var id2nomcat = {
  31: "Service client shop.hardware.fr",
  1: "Hardware",
  16: "Hardware - Périphériques",
  15: "Ordinateurs portables",
  2: "Overclocking, Cooling & Modding",
  30: "Electronique, domotique, DIY",
  23: "Technologies Mobiles",
  25: "Apple",
  3: "Video & Son",
  14: "Photo numérique",
  5: "Jeux Video",
  4: "Windows & Software",
  22: "Réseaux grand public / SoHo",
  21: "Systèmes & Réseaux Pro",
  11: "Linux et OS Alternatifs",
  10: "Programmation",
  12: "Graphisme",
  6: "Achats & Ventes",
  8: "Emploi & Etudes",
  9: "Seti et projets distribués",
  13: "Discussions",
};

var id2subcat = {
  // Hardware
  108: "carte-mere",
  534: "Memoire",
  533: "Processeur",
  109: "2D-3D",
  466: "Boitier",
  532: "Alimentation",
  110: "HDD",
  531: "SSD",
  467: "lecteur-graveur",
  507: "minipc",
  252: "Benchs",
  253: "Materiels-problemes-divers",
  481: "conseilsachats",
  546: "hfr",
  578: "actualites",
  // Hardware - Périphériques
  451: "Ecran",
  452: "Imprimante",
  453: "Scanner",
  462: "webcam-camera-ip",
  454: "Clavier-Souris",
  455: "Joys",
  530: "Onduleur",
  456: "Divers",
  // Ordinateurs portables
  448: "portable",
  512: "Ultraportable",
  516: "Transportable",
  520: "Netbook",
  515: "Composant",
  517: "Accessoire",
  513: "Conseils-d-achat",
  479: "SAV",
  // Overclocking, Cooling & Modding
  458: "CPU",
  119: "GPU",
  117: "Air-Cooling",
  118: "Water-Xtreme-Cooling",
  400: "Silence",
  461: "Modding",
  121: "Divers-8",
  // Electronique, domotique, DIY
  571: "conception_depannage_mods",
  572: "nano-ordinateur_microcontroleurs_fpga",
  573: "domotique_maisonconnectee",
  574: "mecanique_prototypage",
  575: "imprimantes3D",
  576: "robotique_modelisme",
  577: "divers",
  // Technologies Mobiles
  567: "autres-os-mobiles",
  510: "operateur",
  553: "telephone-android",
  554: "telephone-windows-phone",
  529: "telephone",
  540: "tablette",
  550: "android",
  551: "windows-phone",
  509: "GPS-PDA",
  561: "accessoires",
  // Apple
  522: "Mac-OS-X",
  528: "Applications",
  523: "Mac",
  524: "Macbook",
  525: "Iphone-amp-Ipod",
  535: "Ipad",
  526: "Peripheriques",
  // Video & Son
  130: "HiFi-HomeCinema",
  129: "Materiel",
  131: "Traitement-Audio",
  134: "Traitement-Video",
  // Photo numérique
  442: "Appareil",
  519: "Objectif",
  443: "Accessoire",
  444: "Photos",
  445: "Technique",
  446: "Logiciels-Retouche",
  447: "Argentique",
  476: "Concours",
  478: "Galerie-Perso",
  457: "Divers-7",
  // Jeux Video
  249: "PC",
  250: "Consoles",
  251: "Achat-Ventes",
  412: "Teams-LAN",
  413: "Tips-Depannage",
  579: "VR-Realite-Virtuelle",
  569: "mobiles",
  // Windows & Software
  570: "windows-10",
  555: "windows-8",
  521: "Windows-7-seven",
  505: "Windows-vista",
  406: "Windows-nt-2k-xp",
  504: "Win-9x-me",
  437: "Securite",
  506: "Virus-Spywares",
  435: "Stockage-Sauvegarde",
  407: "Logiciels",
  438: "Tutoriels",
  // Réseaux grand public / SoHo
  496: "FAI",
  503: "Reseaux",
  497: "Routage-et-securite",
  498: "WiFi-et-CPL",
  499: "Hebergement",
  500: "Tel-TV-sur-IP",
  501: "Chat-visio-et-voix",
  502: "Tutoriels",
  // Systèmes & Réseaux Pro
  487: "Reseaux",
  488: "Securite",
  489: "Telecom",
  491: "Infrastructures-serveurs",
  492: "Stockage",
  493: "Logiciels-entreprise",
  494: "Management-SI",
  544: "poste-de-travail",
  // Linux et OS Alternatifs
  209: "Codes-scripts",
  205: "Debats",
  420: "Divers-2",
  472: "Hardware-2",
  204: "Installation",
  208: "Logiciels-2",
  207: "Multimedia",
  206: "reseaux-securite",
  // Programmation
  381: "ADA",
  382: "Algo",
  562: "Android",
  518: "API-Win32",
  384: "ASM",
  383: "ASP",
  565: "Big-Data",
  440: "C",
  405: "CNET-managed",
  386: "C-2",
  391: "Delphi-Pascal",
  473: "Flash-ActionScript",
  389: "HTML-CSS-Javascript",
  563: "iOS",
  390: "Java",
  566: "Javascript-Node-js",
  484: "Langages-fonctionnels",
  392: "Perl",
  393: "PHP",
  394: "Python",
  483: "Ruby",
  404: "Shell-Batch",
  395: "SGBD-SQL",
  396: "VB-VBA-VBS",
  564: "Windows-Phone",
  439: "XML-XSL",
  388: "Divers-6",
  // Graphisme
  475: "Cours",
  469: "Galerie",
  227: "Infographie-2D",
  470: "PAO-Desktop-Publishing",
  228: "Infographie-3D",
  402: "Webdesign",
  441: "Arts-traditionnels",
  229: "Concours-2",
  230: "Ressources",
  231: "Divers-5",
  // Achats & Ventes
  169: "Hardware",
  536: "pc-portables",
  560: "tablettes",
  171: "Photo-Audio-Video",
  537: "audio-video",
  173: "Telephonie",
  170: "Softs-livres",
  174: "Divers-4",
  398: "Avis-estimations",
  416: "Feedback",
  399: "Regles-coutumes",
  // Emploi & Etudes
  233: "Marche-emploi",
  235: "Etudes-Orientation",
  234: "Annonces-emplois",
  464: "Feedback-entreprises",
  465: "Aide-devoirs",
  // Seti et projets distribués
  477: "BOINC",
  184: "SETI",
  185: "projets-distribues",
  401: "Divers-3",
  // Discussions
  422: "Actualite",
  482: "politique",
  423: "Societe",
  424: "Cinema",
  425: "Musique",
  426: "Arts-Lecture",
  427: "TV-Radio",
  428: "Sciences",
  429: "Sante",
  430: "Sports",
  431: "Auto-Moto",
  433: "Cuisine",
  434: "Loisirs",
  557: "voyages",
  432: "Viepratique",
};

var id2nomsubcat = {
  // Hardware
  108: "Carte mère",
  534: "Mémoire",
  533: "Processeur",
  109: "Carte graphique",
  466: "Boitier",
  532: "Alimentation",
  110: "Disque dur",
  531: "Disque SSD",
  467: "CD/DVD/BD",
  507: "Mini PC",
  252: "Bench",
  253: "Matériels & problèmes divers",
  481: "Conseil d'achat",
  546: "HFR",
  578: "Actus",
  // Hardware - Périphériques
  451: "Ecran",
  452: "Imprimante",
  453: "Scanner",
  462: "Webcam / Caméra IP",
  454: "Clavier / Souris",
  455: "Joys",
  530: "Onduleur",
  456: "Divers",
  // Ordinateurs portables
  448: "Portable",
  512: "Ultraportable",
  516: "Transportable",
  520: "Netbook",
  515: "Composant",
  517: "Accessoire",
  513: "Conseils d'achat",
  479: "SAV",
  // Overclocking, Cooling & Modding
  458: "CPU",
  119: "GPU",
  117: "Air Cooling",
  118: "Water & Xtreme Cooling",
  400: "Silence",
  461: "Modding",
  121: "Divers",
  // Electronique, domotique, DIY
  571: "Conception, dépannage, mods",
  572: "Nano-ordinateur, microcontrôleurs, FPGA",
  573: "Domotique et maison connectée",
  574: "Mécanique, prototypage",
  575: "Imprimantes 3D",
  576: "Robotique et modélisme",
  577: "Divers",
  // Technologies Mobiles
  567: "Autres OS Mobiles",
  510: "Opérateur",
  553: "Téléphone Android",
  554: "Téléphone Windows Phone",
  529: "Téléphone",
  540: "Tablette",
  550: "Android",
  551: "Windows Phone",
  509: "GPS / PDA",
  561: "Accessoires",
  // Apple
  522: "Mac OS X",
  528: "Applications",
  523: "Mac",
  524: "Macbook",
  525: "Iphone & Ipod",
  535: "Ipad",
  526: "Périphériques",
  // Video & Son
  130: "HiFi & Home Cinema",
  129: "Matériel",
  131: "Traitement Audio",
  134: "Traitement Vidéo",
  // Photo numérique
  442: "Appareil",
  519: "Objectif",
  443: "Accessoire",
  444: "Photos",
  445: "Technique",
  446: "Logiciels & Retouche",
  447: "Argentique",
  476: "Concours",
  478: "Galerie Perso",
  457: "Divers",
  // Jeux Video
  249: "PC",
  250: "Consoles",
  251: "Achat & Ventes",
  412: "Teams & LAN",
  413: "Tips & Dépannage",
  579: "Réalité virtuelle",
  569: "Mobiles",
  // Windows & Software
  570: "Win 10",
  555: "Win 8",
  521: "Win 7",
  505: "Win Vista",
  406: "Win NT/2K/XP",
  504: "Win 9x/Me",
  437: "Sécurité",
  506: "Virus/Spywares",
  435: "Stockage/Sauvegarde",
  407: "Logiciels",
  438: "Tutoriels",
  // Réseaux grand public / SoHo
  496: "FAI",
  503: "Réseaux",
  497: "Sécurité",
  498: "WiFi et CPL",
  499: "Hébergement",
  500: "Tel / TV sur IP",
  501: "Chat, visio et voix",
  502: "Tutoriels",
  // Systèmes & Réseaux Pro
  487: "Réseaux",
  488: "Sécurité",
  489: "Télécom",
  491: "Infrastructures serveurs",
  492: "Stockage",
  493: "Logiciels d'entreprise",
  494: "Management du SI",
  544: "Poste de travail",
  // Linux et OS Alternatifs
  209: "Codes et scripts",
  205: "Débats",
  420: "Divers",
  472: "Hardware",
  204: "Installation",
  208: "Logiciels",
  207: "Multimédia",
  206: "réseaux et sécurité",
  // Programmation
  381: "Ada",
  382: "Algo",
  562: "Android",
  518: "API Win32",
  384: "ASM",
  383: "ASP",
  565: "BI/Big Data",
  440: "C",
  405: "C#/.NET managed",
  386: "C++",
  391: "Delphi/Pascal",
  473: "Flash/ActionScript",
  389: "HTML/CSS",
  563: "iOS",
  390: "Java",
  566: "Javascript/Node.js",
  484: "Langages fonctionnels",
  392: "Perl",
  393: "PHP",
  394: "Python",
  483: "Ruby/Rails",
  404: "Shell/Batch",
  395: "SQL/NoSQL",
  396: "VB/VBA/VBS",
  564: "Windows Phone",
  439: "XML/XSL",
  388: "Divers",
  // Graphisme
  475: "Cours",
  469: "Galerie",
  227: "Infographie 2D",
  470: "PAO / Desktop Publishing",
  228: "Infographie 3D",
  402: "Web design",
  441: "Arts traditionnels",
  229: "Concours",
  230: "Ressources",
  231: "Divers",
  // Achats & Ventes
  169: "Hardware",
  536: "PC Portables",
  560: "Tablettes",
  171: "Photo",
  537: "Audio, Vidéo",
  173: "Téléphonie",
  170: "Softs, livres",
  174: "Divers",
  398: "Avis, estimations",
  416: "Feed-back",
  399: "Règles et coutumes",
  // Emploi & Etudes
  233: "Marché de l'emploi",
  235: "Etudes / Orientation",
  234: "Annonces d'emplois",
  464: "Feedback sur les entreprises",
  465: "Aide aux devoirs",
  // Seti et projets distribués
  477: "BOINC",
  184: "SETI",
  185: "Autres projets distribués",
  401: "Divers",
  // Discussions
  422: "Actualité",
  482: "Politique",
  423: "Société",
  424: "Cinéma",
  425: "Musique",
  426: "Arts & Lecture",
  427: "TV, Radio",
  428: "Sciences",
  429: "Santé",
  430: "Sports",
  431: "Auto / Moto",
  433: "Cuisine",
  434: "Loisirs",
  557: "Voyages",
  432: "Vie pratique",
};

/* ================================= Main ================================== */

var re_title = "(.*?)(?: - Page : [0-9]+)?(?: - (?:Nano-|Feed-)?[^-]+)?(?: - (?:Hardware - )?[^-]+) - FORUM HardWare.fr";
var liens = document.getElementById("mesdiscussions").querySelectorAll(
  "table.messagetable td.messCase2 div[id^='para'] > span:not(.signature) a.cLink, " +
  "table.messagetable td.messCase2 div[id^='para'] > div:not(.edited) a.cLink, " +
  "table.messagetable td.messCase2 div[id^='para'] > *:not(span):not(div) a.cLink");
var currentURL = parseHFR(document.URL);
var timeID;

boucleliens: for(let lien of liens) {
  if(lien.hostname !== "forum.hardware.fr") {
    continue;
  }
  if(!testText(lien)) {
    continue;
  }
  let linkURL = parseHFR(lien.href);
  if(linkURL.type === "!topic") {
    continue;
  }
  lien.setAttribute("title", "[HFR] liens explicites");
  // Gestion des liens intratopics
  if(linkURL.topic === currentURL.topic) {
    let doctitle = document.querySelector("html head title").firstChild.nodeValue.match(re_title).pop();
    if(linkURL.type === "search") {
      lien.textContent = "Recherche topic \"" + doctitle + "\" sur le mot \"" + linkURL.mot + "\"";
    } else if(linkURL.type === "psearch") {
      lien.textContent = "Recherche topic \"" + doctitle + "\" sur le pseudo \"" + linkURL.pseudo + "\"";
    } else if(linkURL.type === "ppsearch") {
      lien.textContent = "Recherche topic \"" + doctitle + "\" sur le mot \"" + linkURL.mot +
        "\" et le pseudo \"" + linkURL.pseudo + "\"";
    } else if(linkURL.type === "native" || linkURL.type === "rewrite") {
      if(linkURL.page === currentURL.page) {
        lien.textContent = "Topic \"" + doctitle + "\", cette page";
      } else {
        lien.textContent = "Topic \"" + doctitle + "\", page " + linkURL.page;
      }
    }
  }
  // Gestion des liens extratopics
  else {
    switch (linkURL.type) {
      case "rewrite":
        lien.textContent = "Topic \"" + linkURL.nomtopic + "\", page " + linkURL.page;
        lien.setAttribute("hlexp_page", linkURL.page);
        break;
      case "native":
        lien.textContent = "Topic de la cat " + id2nomcat[linkURL.cat] +
          (linkURL.souscat ? " / " + id2nomsubcat[linkURL.souscat] : "") +
          ", page " + linkURL.page;
        lien.setAttribute("hlexp_page", linkURL.page);
        break;
      case "search":
        lien.textContent = "Recherche topic de la cat " + id2nomcat[linkURL.cat] +
          (linkURL.souscat ? " / " + id2nomsubcat[linkURL.souscat] : "") +
          " sur le mot \"" + linkURL.mot + "\"";
        lien.setAttribute("hlexp_recherche", " sur le mot \"" + linkURL.mot + "\"");
        break;
      case "psearch":
        lien.textContent = "Recherche topic de la cat " + id2nomcat[linkURL.cat] +
          (linkURL.souscat ? " / " + id2nomsubcat[linkURL.souscat] : "") +
          " sur le pseudo \"" + linkURL.pseudo + "\"";
        lien.setAttribute("hlexp_recherche", " sur le pseudo \"" + linkURL.pseudo + "\"");
        break;
      case "ppsearch":
        lien.textContent = "Recherche topic de la cat " + id2nomcat[linkURL.cat] +
          (linkURL.souscat ? " / " + id2nomsubcat[linkURL.souscat] : "") +
          " sur le mot \"" + linkURL.mot + "\" et le pseudo \"" + linkURL.pseudo + "\"";
        lien.setAttribute("hlexp_recherche", " sur le mot \"" + linkURL.mot +
          "\" et le pseudo \"" + linkURL.pseudo + "\"");
        break;
      case "liste":
        lien.textContent = "Liste de sujets de la cat " + id2nomcat[linkURL.cat] +
          (linkURL.souscat ? " / " + id2nomsubcat[linkURL.souscat] : "");
        continue boucleliens;
    }
    if(linkURL.protocol === currentURL.protocol) {
      fetch(lien.getAttribute("href"), {
        method: "GET",
        mode: "same-origin",
        credentials: "omit",
        referrer: "",
        referrerPolicy: "no-referrer"
      }).then(function(r) {
        return r.text();
      }).then(function(r) {
        lien.setAttribute("title", "[HFR] liens explicites");
        let p = new DOMParser();
        let d = p.parseFromString(r, "text/html");
        let doctitle = d.documentElement.querySelector("html head title").firstChild.nodeValue.match(re_title).pop();
        if(lien.hasAttribute("hlexp_recherche")) {
          lien.textContent = "Recherche topic \"" + doctitle + "\"" + lien.getAttribute("hlexp_recherche");
        } else {
          lien.textContent = "Topic \"" + doctitle + "\", page " + lien.getAttribute("hlexp_page");
        }
      }).catch(function(e) {
        console.log("[HFR] liens explicites mod_r21 ERROR fetch : " + e);
      });
    }
  }
}

/* ========================= Fonctions auxiliaires ========================== */

function parseHFR(str) {
  let parsed = parseUri(str);
  if(parsed.host !== "forum.hardware.fr" || (parsed.protocol !== "https" && parsed.protocol !== "http")) {
    parsed.type = "!topic";
  } else if(parsed.file === "forum2.php") {
    parsed.cat = parsed.queryKey.cat;
    parsed.topic = parsed.queryKey.post;
    if(parsed.cat && parsed.topic) {
      if(parsed.queryKey.subcat) {
        parsed.souscat = parsed.queryKey.subcat;
      }
      parsed.page = parsed.queryKey.page ? parsed.queryKey.page : 1;
      if(parsed.queryKey.word && parsed.queryKey.spseudo) {
        parsed.type = "ppsearch";
        parsed.mot = parsed.queryKey.word;
        parsed.pseudo = parsed.queryKey.spseudo.replace(/\+/g, " ");
      } else if(parsed.queryKey.word) {
        parsed.type = "search";
        parsed.mot = parsed.queryKey.word;
      } else if(parsed.queryKey.spseudo) {
        parsed.type = "psearch";
        parsed.pseudo = parsed.queryKey.spseudo.replace(/\+/g, " ");
      } else {
        parsed.type = "native";
      }
    } else {
      parsed.type = "!topic";
    }
  } else {
    try {
      let dir = parsed.directory.match(/^\/hfr\/([\w-]+)\/(([\w-]+)\/)?$/);
      parsed.cat = indexObj(id2cat, dir[1]);
      if(typeof dir[3] !== "undefined") {
        parsed.souscat = indexObj(id2subcat, dir[3]);
      } else {
        parsed.souscat = "";
      }
      let topic = parsed.file.match(/^([\w-]*)[_-]sujet[_-]([0-9]+)(_([0-9]+))?.htm$/);
      parsed.nomtopic = topic[1].replace(/-/g, " ");
      parsed.topic = topic[2];
      if(typeof topic[4] !== "undefined") {
        parsed.page = topic[4];
      } else {
        parsed.page = 1;
      }
      parsed.type = parsed.topic === "1" ? "liste" : "rewrite";
    } catch (e) {
      parsed.type = "!topic";
    }
  }
  return parsed;
}

function testText(lien) {
  try {
    let link = lien.href;
    let bouts = lien.textContent.split(" [...] ");
    if(bouts.length === 2 && link.indexOf(bouts[0]) === 0 && link.indexOf(bouts[1]) + bouts[1].length === link.length) {
      return true;
    }
  } catch (e) {}
  return false;
}

function parseUri(str) {
  let o = {
    strictMode: true,
    key: [
      "source", "protocol", "authority", "userInfo", "user", "password", "host",
      "port", "relative", "path", "directory", "file", "query", "anchor"
    ],
    q: {
      name: "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  };
  let m = o.parser[o.strictMode ? "strict" : "loose"].exec(str);
  let uri = {};
  let i = 14;
  while(i--) {
    uri[o.key[i]] = m[i] || "";
  }
  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
    if($1) {
      uri[o.q.name][$1] = $2;
    }
  });
  return uri;
}

function indexObj(o, str) {
  for(let prop in o) {
    if(o[prop] === str) {
      return prop;
    }
  }
  return null;
}
