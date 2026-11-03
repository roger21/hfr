// ==UserScript==
// @name          [HFR] Liens explicites mod_r21
// @version       4.0.0
// @namespace     roger21.free.fr
// @description   Remplace le texte des liens vers la racine du forum, les topics ou les catégories par le nom du forum, du topic ou de la catégorie avec la page.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @exclude       https://forum.hardware.fr/message.php*
// @author        roger21
// @authororig    turlogh
// @modifications Recodage en fetch pour ne pas niquer ses drapoils, uniformisation et simplification des liens et du fonctionnement, mise à jour des cats et des sous-cats, amélioration des fonctionnalités et amélioration du code.
// @modtype       réécriture et évolutions
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_liens_explic_mod_r21.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_liens_explic_mod_r21.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_liens_explic_mod_r21.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   https://roger21.pages-perso.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

/*

Copyright © 2011-2012, 2014-2022, 2026 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 5194 $

// historique :
// 4.0.0 (03/11/2026) :
// - nouvelle gestion pour la récupération du titre du topic, ->
// permet d'avoir le titre réel au lieu du titre de la page (version SEO)
// - unicité, sérialisation et temporisation des requêtes (c'est mieux :o)
// - retour à la récupération du titre du topic en local quand c'est possible
// - distinction entre les recherches filtrées et non filtrées
// - gestion explicite du lien vers la racine du forum
// 3.0.0 (16/09/2026) :
// - meilleure gestion des urls verbeuses et corrections diverses
// - meilleure gestion des liens vers les catégories et gestion de la page
// - meilleure gestion des permaliens
// - utilisation de guillemets françaises (...but why?)
// - utilisation de URL.parse() au lieu de parseUri 1.2.1 (c) Steven Levithan
// - correction de l'identification des topics ("cat + post" au lieu de "post")
// - correction de la détection des liens déjà transformés
// - suppression du support pour le http
// - clarification et simplification (...you sure?) du code
// - nouvelle description
// 2.6.8 (08/09/2026) :
// - mise à jour des cats et des sous-cats (nouvelle cat ia)
// - correction et simplification du code de gestion des cats et des sous-cats
// 2.6.7 (13/01/2026) :
// - réorganisation de la liste des cats et des sous-cats
// 2.6.6 (03/01/2022) :
// - mise à jour des cats / sous-cats (ajout de la sous-cat windows 11)
// 2.6.5 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur ->
// (free.fr -> github.com)
// 2.6.4 (01/01/2020) :
// - mise à jour des cats et sous-cats
// 2.6.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - retour des requêtes fetch en mode "same-origin" au lieu de "cors"
// 2.6.2 (23/09/2019) :
// - passage des requêtes fetch en mode "cors" pour éviter un plantage sous ch+vm en ->
// mode "same-origin"
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
// - retour du support partiel pour les liens en http (support qui avait disparu avec ->
// le passage en fetch car cross-origin)
// - remplacement du getElementByXpath par un querySelectorAll
// - remplacement des innerHTML par des textContent et nodeValue (et complications ->
// associées [:palm])
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
// - passage à gm_xhr au lieu de xhr pour la compatibilite ch (le xhr de ch n'a pas ->
// le mode anonyme)
// - et ajout d'une compatbilité avec vm pour le mode anonyme de gm_xhr (via http ->
// cookie) par PetitJean
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
// - utilisation du mode anonyme de xmlHttpRequest pour ne pas envoyer les cookies et ->
// niquer les drapoils
// - suppression des rewriteurl (inutile avec le mode anonyme, utilisation du href à ->
// la place)
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
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame ->
// pour plus de sécurité)
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
// - renomage du script (ajout du [HFR] au début) pour ne pas faire tache dans la liste ->
// des scripts greasemonkey
// - désactivation du message d'erreur XML dans la toyolib
// - ajout d'un .1 sur le numero de version
// - suppression des lignes vides en bas

/* ------------------------------- */
/* liste des cats et des sous-cats */
/* ------------------------------- */

const cat2id = {
  "Hardware": "1",
  "HardwarePeripheriques": "16",
  "OrdinateursPortables": "15",
  "OverclockingCoolingModding": "2",
  "electroniquedomotiquediy": "30",
  "gsmgpspda": "23",
  "apple": "25",
  "VideoSon": "3",
  "Photonumerique": "14",
  "JeuxVideo": "5",
  "WindowsSoftware": "4",
  "reseauxpersosoho": "22",
  "systemereseauxpro": "21",
  "OSAlternatifs": "11",
  "Programmation": "10",
  "ia": "32",
  "Graphisme": "12",
  "AchatsVentes": "6",
  "EmploiEtudes": "8",
  "Discussions": "13",
  "service-client-shophfr": "31",
  "Setietprojetsdistribues": "9",
};

const id2cat = {
  "1": "Hardware",
  "16": "Hardware - Périphériques",
  "15": "Ordinateurs portables",
  "2": "Overclocking, Cooling & Modding",
  "30": "Electronique, domotique, DIY",
  "23": "Technologies Mobiles",
  "25": "Apple",
  "3": "Video & Son",
  "14": "Photo numérique",
  "5": "Jeux Video",
  "4": "Windows & Software",
  "22": "Réseaux grand public / SoHo",
  "21": "Systèmes & Réseaux Pro",
  "11": "Linux et OS Alternatifs",
  "10": "Programmation",
  "32": "Intelligence Artificielle",
  "12": "Graphisme",
  "6": "Achats & Ventes",
  "8": "Emploi & Etudes",
  "13": "Discussions",
  "31": "Service client shop.hardware.fr",
  "9": "Seti et projets distribués",
};

const id2caturl = {
  "1": "Hardware",
  "16": "HardwarePeripheriques",
  "15": "OrdinateursPortables",
  "2": "OverclockingCoolingModding",
  "30": "electroniquedomotiquediy",
  "23": "gsmgpspda",
  "25": "apple",
  "3": "VideoSon",
  "14": "Photonumerique",
  "5": "JeuxVideo",
  "4": "WindowsSoftware",
  "22": "reseauxpersosoho",
  "21": "systemereseauxpro",
  "11": "OSAlternatifs",
  "10": "Programmation",
  "32": "ia",
  "12": "Graphisme",
  "6": "AchatsVentes",
  "8": "EmploiEtudes",
  "13": "Discussions",
  "31": "service-client-shophfr",
  "9": "Setietprojetsdistribues",
};

const scat2id = {
  // Hardware
  "1": {
    "carte-mere": "108",
    "Memoire": "534",
    "Processeur": "533",
    "2D-3D": "109",
    "Boitier": "466",
    "Alimentation": "532",
    "HDD": "110",
    "SSD": "531",
    "lecteur-graveur": "467",
    "minipc": "507",
    "Benchs": "252",
    "Materiels-problemes-divers": "253",
    "conseilsachats": "481",
    "hfr": "546",
    "actualites": "578",
  },
  // Hardware - Périphériques
  "16": {
    "Ecran": "451",
    "Imprimante": "452",
    "Scanner": "453",
    "webcam-camera-ip": "462",
    "Clavier-Souris": "454",
    "Joys": "455",
    "Onduleur": "530",
    "Divers": "456",
  },
  // Ordinateurs portables
  "15": {
    "portable": "448",
    "Ultraportable": "512",
    "Transportable": "516",
    "Netbook": "520",
    "Composant": "515",
    "Accessoire": "517",
    "Conseils-d-achat": "513",
    "SAV": "479",
  },
  // Overclocking, Cooling & Modding
  "2": {
    "CPU": "458",
    "GPU": "119",
    "Air-Cooling": "117",
    "Water-Xtreme-Cooling": "118",
    "Silence": "400",
    "Modding": "461",
    "Divers-8": "121",
  },
  // Electronique, domotique, DIY
  "30": {
    "conception_depannage_mods": "571",
    "nano-ordinateur_microcontroleurs_fpga": "572",
    "domotique_maisonconnectee": "573",
    "mecanique_prototypage": "574",
    "imprimantes3D": "575",
    "robotique_modelisme": "576",
    "divers": "577",
  },
  // Technologies Mobiles
  "23": {
    "autres-os-mobiles": "567",
    "operateur": "510",
    "telephone-android": "553",
    "telephone-windows-phone": "554",
    "telephone": "529",
    "tablette": "540",
    "android": "550",
    "windows-phone": "551",
    "GPS-PDA": "509",
    "accessoires": "561",
  },
  // Apple
  "25": {
    "Mac-OS-X": "522",
    "Applications": "528",
    "Mac": "523",
    "Macbook": "524",
    "Iphone-amp-Ipod": "525",
    "Ipad": "535",
    "Peripheriques": "526",
  },
  // Video & Son
  "3": {
    "HiFi-HomeCinema": "130",
    "Materiel": "129",
    "Traitement-Audio": "131",
    "Traitement-Video": "134",
  },
  // Photo numérique
  "14": {
    "Appareil": "442",
    "Objectif": "519",
    "Accessoire": "443",
    "Photos": "444",
    "Technique": "445",
    "Logiciels-Retouche": "446",
    "Argentique": "447",
    "Concours": "476",
    "Galerie-Perso": "478",
    "Divers-7": "457",
  },
  // Jeux Video
  "5": {
    "PC": "249",
    "Consoles": "250",
    "Achat-Ventes": "251",
    "Teams-LAN": "412",
    "Tips-Depannage": "413",
    "VR-Realite-Virtuelle": "579",
    "mobiles": "569",
  },
  // Windows & Software
  "4": {
    "windows-11": "580",
    "windows-10": "570",
    "windows-8": "555",
    "Windows-7-seven": "521",
    "Windows-vista": "505",
    "Windows-nt-2k-xp": "406",
    "Win-9x-me": "504",
    "Securite": "437",
    "Virus-Spywares": "506",
    "Stockage-Sauvegarde": "435",
    "Logiciels": "407",
    "Tutoriels": "438",
  },
  // Réseaux grand public / SoHo
  "22": {
    "FAI": "496",
    "Reseaux": "503",
    "Routage-et-securite": "497",
    "WiFi-et-CPL": "498",
    "Hebergement": "499",
    "Tel-TV-sur-IP": "500",
    "Chat-visio-et-voix": "501",
    "Tutoriels": "502",
  },
  // Systèmes & Réseaux Pro
  "21": {
    "Reseaux": "487",
    "Securite": "488",
    "Telecom": "489",
    "Infrastructures-serveurs": "491",
    "Stockage": "492",
    "Logiciels-entreprise": "493",
    "Management-SI": "494",
    "poste-de-travail": "544",
  },
  // Linux et OS Alternatifs
  "11": {
    "Codes-scripts": "209",
    "Debats": "205",
    "Divers-2": "420",
    "Hardware-2": "472",
    "Installation": "204",
    "Logiciels-2": "208",
    "Multimedia": "207",
    "reseaux-securite": "206",
  },
  // Programmation
  "10": {
    "ADA": "381",
    "Algo": "382",
    "Android": "562",
    "API-Win32": "518",
    "ASM": "384",
    "ASP": "383",
    "Big-Data": "565",
    "C": "440",
    "CNET-managed": "405",
    "C-2": "386",
    "Delphi-Pascal": "391",
    "Flash-ActionScript": "473",
    "HTML-CSS-Javascript": "389",
    "iOS": "563",
    "Java": "390",
    "Javascript-Node-js": "566",
    "Langages-fonctionnels": "484",
    "Perl": "392",
    "PHP": "393",
    "Python": "394",
    "Ruby": "483",
    "Shell-Batch": "404",
    "SGBD-SQL": "395",
    "VB-VBA-VBS": "396",
    "Windows-Phone": "564",
    "XML-XSL": "439",
    "Divers-6": "388",
  },
  // Graphisme
  "12": {
    "Cours": "475",
    "Galerie": "469",
    "Infographie-2D": "227",
    "PAO-Desktop-Publishing": "470",
    "Infographie-3D": "228",
    "Webdesign": "402",
    "Arts-traditionnels": "441",
    "Concours-2": "229",
    "Ressources": "230",
    "Divers-5": "231",
  },
  // Achats & Ventes
  "6": {
    "Hardware": "169",
    "pc-portables": "536",
    "tablettes": "560",
    "Photo-Audio-Video": "171",
    "audio-video": "537",
    "Telephonie": "173",
    "Softs-livres": "170",
    "Divers-4": "174",
    "Avis-estimations": "398",
    "Feedback": "416",
    "Regles-coutumes": "399",
  },
  // Emploi & Etudes
  "8": {
    "Marche-emploi": "233",
    "Etudes-Orientation": "235",
    "Annonces-emplois": "234",
    "Feedback-entreprises": "464",
    "Aide-devoirs": "465",
  },
  // Discussions
  "13": {
    "Actualite": "422",
    "politique": "482",
    "Societe": "423",
    "Cinema": "424",
    "Musique": "425",
    "Arts-Lecture": "426",
    "TV-Radio": "427",
    "Sciences": "428",
    "Sante": "429",
    "Sports": "430",
    "Auto-Moto": "431",
    "Cuisine": "433",
    "Loisirs": "434",
    "voyages": "557",
    "Viepratique": "432",
  },
  // Seti et projets distribués
  "9": {
    "BOINC": "477",
    "SETI": "184",
    "projets-distribues": "185",
    "Divers-3": "401",
  },
};

const id2scat = {
  // Hardware
  "1": {
    "108": "Carte mère",
    "534": "Mémoire",
    "533": "Processeur",
    "109": "Carte graphique",
    "466": "Boitier",
    "532": "Alimentation",
    "110": "Disque dur",
    "531": "Disque SSD",
    "467": "CD/DVD/BD",
    "507": "Mini PC",
    "252": "Bench",
    "253": "Matériels & problèmes divers",
    "481": "Conseil d'achat",
    "546": "HFR",
    "578": "Actus",
  },
  // Hardware - Périphériques
  "16": {
    "451": "Ecran",
    "452": "Imprimante",
    "453": "Scanner",
    "462": "Webcam / Caméra IP",
    "454": "Clavier / Souris",
    "455": "Joys",
    "530": "Onduleur",
    "456": "Divers",
  },
  // Ordinateurs portables
  "15": {
    "448": "Portable",
    "512": "Ultraportable",
    "516": "Transportable",
    "520": "Netbook",
    "515": "Composant",
    "517": "Accessoire",
    "513": "Conseils d'achat",
    "479": "SAV",
  },
  // Overclocking, Cooling & Modding
  "2": {
    "458": "CPU",
    "119": "GPU",
    "117": "Air Cooling",
    "118": "Water & Xtreme Cooling",
    "400": "Silence",
    "461": "Modding",
    "121": "Divers",
  },
  // Electronique, domotique, DIY
  "30": {
    "571": "Conception, dépannage, mods",
    "572": "Nano-ordinateur, microcontrôleurs, FPGA",
    "573": "Domotique et maison connectée",
    "574": "Mécanique, prototypage",
    "575": "Imprimantes 3D",
    "576": "Robotique et modélisme",
    "577": "Divers",
  },
  // Technologies Mobiles
  "23": {
    "567": "Autres OS Mobiles",
    "510": "Opérateur",
    "553": "Téléphone Android",
    "554": "Téléphone Windows Phone",
    "529": "Téléphone",
    "540": "Tablette",
    "550": "Android",
    "551": "Windows Phone",
    "509": "GPS / PDA",
    "561": "Accessoires",
  },
  // Apple
  "25": {
    "522": "Mac OS X",
    "528": "Applications",
    "523": "Mac",
    "524": "Macbook",
    "525": "Iphone & Ipod",
    "535": "Ipad",
    "526": "Périphériques",
  },
  // Video & Son
  "3": {
    "130": "HiFi & Home Cinema",
    "129": "Matériel",
    "131": "Traitement Audio",
    "134": "Traitement Vidéo",
  },
  // Photo numérique
  "14": {
    "442": "Appareil",
    "519": "Objectif",
    "443": "Accessoire",
    "444": "Photos",
    "445": "Technique",
    "446": "Logiciels & Retouche",
    "447": "Argentique",
    "476": "Concours",
    "478": "Galerie Perso",
    "457": "Divers",
  },
  // Jeux Video
  "5": {
    "249": "PC",
    "250": "Consoles",
    "251": "Achat & Ventes",
    "412": "Teams & LAN",
    "413": "Tips & Dépannage",
    "579": "Réalité virtuelle",
    "569": "Mobiles",
  },
  // Windows & Software
  "4": {
    "580": "Win 11",
    "570": "Win 10",
    "555": "Win 8",
    "521": "Win 7",
    "505": "Win Vista",
    "406": "Win NT/2K/XP",
    "504": "Win 9x/Me",
    "437": "Sécurité",
    "506": "Virus/Spywares",
    "435": "Stockage/Sauvegarde",
    "407": "Logiciels",
    "438": "Tutoriels",
  },
  // Réseaux grand public / SoHo
  "22": {
    "496": "FAI",
    "503": "Réseaux",
    "497": "Sécurité",
    "498": "WiFi et CPL",
    "499": "Hébergement",
    "500": "Tel / TV sur IP",
    "501": "Chat, visio et voix",
    "502": "Tutoriels",
  },
  // Systèmes & Réseaux Pro
  "21": {
    "487": "Réseaux",
    "488": "Sécurité",
    "489": "Télécom",
    "491": "Infrastructures serveurs",
    "492": "Stockage",
    "493": "Logiciels d'entreprise",
    "494": "Management du SI",
    "544": "Poste de travail",
  },
  // Linux et OS Alternatifs
  "11": {
    "209": "Codes et scripts",
    "205": "Débats",
    "420": "Divers",
    "472": "Hardware",
    "204": "Installation",
    "208": "Logiciels",
    "207": "Multimédia",
    "206": "réseaux et sécurité",
  },
  // Programmation
  "10": {
    "381": "Ada",
    "382": "Algo",
    "562": "Android",
    "518": "API Win32",
    "384": "ASM",
    "383": "ASP",
    "565": "BI/Big Data",
    "440": "C",
    "405": "C#/.NET managed",
    "386": "C++",
    "391": "Delphi/Pascal",
    "473": "Flash/ActionScript",
    "389": "HTML/CSS",
    "563": "iOS",
    "390": "Java",
    "566": "Javascript/Node.js",
    "484": "Langages fonctionnels",
    "392": "Perl",
    "393": "PHP",
    "394": "Python",
    "483": "Ruby/Rails",
    "404": "Shell/Batch",
    "395": "SQL/NoSQL",
    "396": "VB/VBA/VBS",
    "564": "Windows Phone",
    "439": "XML/XSL",
    "388": "Divers",
  },
  // Graphisme
  "12": {
    "475": "Cours",
    "469": "Galerie",
    "227": "Infographie 2D",
    "470": "PAO / Desktop Publishing",
    "228": "Infographie 3D",
    "402": "Web design",
    "441": "Arts traditionnels",
    "229": "Concours",
    "230": "Ressources",
    "231": "Divers",
  },
  // Achats & Ventes
  "6": {
    "169": "Hardware",
    "536": "PC Portables",
    "560": "Tablettes",
    "171": "Photo",
    "537": "Audio, Vidéo",
    "173": "Téléphonie",
    "170": "Softs, livres",
    "174": "Divers",
    "398": "Avis, estimations",
    "416": "Feed-back",
    "399": "Règles et coutumes",
  },
  // Emploi & Etudes
  "8": {
    "233": "Marché de l'emploi",
    "235": "Etudes / Orientation",
    "234": "Annonces d'emplois",
    "464": "Feedback sur les entreprises",
    "465": "Aide aux devoirs",
  },
  // Discussions
  "13": {
    "422": "Actualité",
    "482": "Politique",
    "423": "Société",
    "424": "Cinéma",
    "425": "Musique",
    "426": "Arts & Lecture",
    "427": "TV, Radio",
    "428": "Sciences",
    "429": "Santé",
    "430": "Sports",
    "431": "Auto / Moto",
    "433": "Cuisine",
    "434": "Loisirs",
    "557": "Voyages",
    "432": "Vie pratique",
  },
  // Seti et projets distribués
  "9": {
    "477": "BOINC",
    "184": "SETI",
    "185": "Autres projets distribués",
    "401": "Divers",
  },
};

/* ---------- */
/* constantes */
/* ---------- */

const script_name = "[HFR] Liens explicites";
const query_title = "#mesdiscussions table.main tr.fondForum2Title th.padding h3";

/* ----------------------------- */
/* fonctions d'analyse des liens */
/* ----------------------------- */

function parse_hfr(p_url) {
  let l_parsed_hfr = {};
  let l_parsed_url = URL.parse(p_url);
  let l_params_url = l_parsed_url.searchParams;
  let l_last_slash = l_parsed_url.pathname.lastIndexOf("/");
  l_parsed_hfr.directory = l_parsed_url.pathname.substring(0, l_last_slash + 1);
  l_parsed_hfr.file = l_parsed_url.pathname.substring(l_last_slash + 1);
  if(l_parsed_url.origin === "https://forum.hardware.fr") {
    // racine
    if(l_parsed_hfr.directory === "/" && l_parsed_hfr.file === "") {
      l_parsed_hfr.root = "FORUM HardWare.fr";
      l_parsed_hfr.ok = true;
    }
    // params
    else if(l_parsed_hfr.file === "forum2.php") {
      l_parsed_hfr.cat = l_params_url.get("cat");
      if(l_parsed_hfr.cat && l_params_url.get("post")) {
        l_parsed_hfr.scat = l_params_url.get("subcat");
        l_parsed_hfr.topic = l_parsed_hfr.cat + "_" + l_params_url.get("post");
        l_parsed_hfr.page = l_params_url.get("page") ?
          ", page " + l_params_url.get("page") :
          (l_params_url.has("numreponse") ? ", permalien" : ", page 1");
        l_parsed_hfr.mot = l_params_url.get("word");
        l_parsed_hfr.pseudo = l_params_url.get("spseudo") ?
          l_params_url.get("spseudo").replace(/\+/g, " ") : null;
        l_parsed_hfr.filter = l_params_url.get("filter") === "1";
        l_parsed_hfr.ok = true;
      }
    }
    // verbal
    else {
      let l_cats = l_parsed_hfr.directory.match(/^\/hfr\/([^\/]+)\/(?:([^\/]+)\/)?$/);
      if(l_cats !== null) {
        l_parsed_hfr.cat = cat2id[l_cats[1]];
        if(l_parsed_hfr.cat) {
          l_parsed_hfr.scat = typeof l_cats[2] !== "undefined" ?
            scat2id[l_parsed_hfr.cat][l_cats[2]] : null;
          let l_sujet =
            l_parsed_hfr.file.match(/^([\w-]*)sujet[_-]([0-9]+)(?:_([0-9]+))?.htm$/);
          if(l_sujet !== null) {
            if(l_sujet[1] === "liste_") {
              l_parsed_hfr.page = ", page " + l_sujet[2];
            } else {
              l_parsed_hfr.topic = l_parsed_hfr.cat + "_" + l_sujet[2];
              l_parsed_hfr.page = ", page " + l_sujet[3];
            }
            l_parsed_hfr.ok = true;
          }
        }
      }
    }
  }
  return l_parsed_hfr;
}

function naked_link(p_link) {
  if(p_link.href && p_link.textContent) {
    let l_href = p_link.href;
    let l_parts = p_link.textContent.split(" [...] ");
    if((l_parts.length === 1 && l_href === l_parts[0]) ||
      (l_parts.length === 2 && l_href.indexOf(l_parts[0]) === 0 &&
        l_href.indexOf(l_parts[1]) + l_parts[1].length === l_href.length)) {
      return true;
    }
  }
  return false;
}

/* -------------------- */
/* traitement des liens */
/* -------------------- */

// les topics
let topic_titles = {};

// la page courante
const current_url = parse_hfr(window.location.href);
if(current_url.topic) {
  topic_titles[current_url.topic] = document.querySelector(query_title).textContent.trim();
}

// les liens
const links = document.getElementById("mesdiscussions").querySelectorAll(
  "table.messagetable td.messCase2 div[id^='para'] > span:not(.signature) a.cLink, " +
  "table.messagetable td.messCase2 div[id^='para'] > div:not(.edited) a.cLink, " +
  "table.messagetable td.messCase2 div[id^='para'] > *:not(span):not(div) a.cLink");

// premier traitement des liens
for(let link of links) {
  // lien déjà transformé -> on passe
  if(!naked_link(link)) {
    continue;
  }
  // analyse du lien
  let link_url = parse_hfr(link.href);
  // pas la racine, ni un topic, ni une cat -> on passe
  if(!link_url.ok) {
    continue;
  }
  // la tooltip
  link.title = script_name;
  // la racine
  if(link_url.root) {
    link.textContent = link_url.root;
    // rien d'autre à faire -> on passe
    continue;
  }
  // la cat / sous-cat
  let cat_text = " cat «\u202f" + id2cat[link_url.cat] + (link_url.scat ?
    " / " + id2scat[link_url.cat][link_url.scat] : "") + "\u202f»";
  // la page
  if(link_url.topic === current_url.topic && link_url.page === current_url.page) {
    link_url.page = ", cette page";
  }
  let page_text = link_url.page;
  // lien de type recherche sur topic
  if(link_url.mot || link_url.pseudo) {
    let search_text = " avec";
    if(link_url.mot) {
      search_text += " le mot «\u202f" + link_url.mot + "\u202f»";
    }
    if(link_url.mot && link_url.pseudo) {
      search_text += " et";
    }
    if(link_url.pseudo) {
      search_text += " le pseudo «\u202f" + link_url.pseudo + "\u202f»";
    }
    if(link_url.filter) {
      link.textContent =
        "Recherche filtrée sur un topic de la" + cat_text + search_text;
    } else {
      link.textContent =
        "Recherche sur un topic de la" + cat_text + search_text + page_text;
      link.setAttribute("hfr_liens_explicites_page", page_text);
    }
    link.setAttribute("hfr_liens_explicites_recherche", search_text);
    link.setAttribute("data-hfr-liens-explicites-topic", link_url.topic);
  }
  // lien de type topic
  else if(link_url.topic) {
    link.textContent = "Topic de la" + cat_text + page_text;
    link.setAttribute("hfr_liens_explicites_page", page_text);
    link.setAttribute("data-hfr-liens-explicites-topic", link_url.topic);
  }
  // lien de type catégorie (liste de topics)
  else {
    link.textContent = "Liste des sujets de la" + cat_text + page_text;
  }
}

// les liens à mettre à jour
const links_todo = document.getElementById("mesdiscussions").querySelectorAll(
  "a.cLink[data-hfr-liens-explicites-topic]");
let links_index = 0;

// fonction de mise à jour du titre du topic dans le lien
function update_title(p_link, p_title) {
  if(p_link.hasAttribute("hfr_liens_explicites_recherche")) {
    if(p_link.hasAttribute("hfr_liens_explicites_page")) {
      p_link.textContent = "Recherche sur «\u202f" + p_title + "\u202f»" +
        p_link.getAttribute("hfr_liens_explicites_recherche") +
        p_link.getAttribute("hfr_liens_explicites_page");
    } else {
      p_link.textContent = "Recherche filtrée sur «\u202f" + p_title + "\u202f»" +
        p_link.getAttribute("hfr_liens_explicites_recherche");
    }
  } else {
    p_link.textContent = "Topic «\u202f" + p_title + "\u202f»" +
      p_link.getAttribute("hfr_liens_explicites_page");
  }
}

// variables pour la temporisation
let last_call = 0;
const call_delay = 250; // 250ms

// compteur de requêtes
//let counter = 0;

// deuxième traitement des liens, mise à jour du titre des topics dans les liens
function update_next() {
  const l_link_item = links_todo.item(links_index);
  if(l_link_item) {
    const l_link_topic = l_link_item.getAttribute("data-hfr-liens-explicites-topic");
    if(typeof topic_titles[l_link_topic] === "undefined") {
      const l_last_call = Date.now();
      const l_wait_time = Math.max(call_delay - (l_last_call - last_call), 0);
      last_call = l_last_call;
      const [l_cat, l_topic] = l_link_topic.split("_");
      const l_topic_url = "https://forum.hardware.fr/hfr/" + id2caturl[l_cat] +
        "/sujet_" + l_topic + "_1.htm";
      window.setTimeout(function() {
        fetch(l_topic_url, {
          method: "GET",
          mode: "same-origin",
          credentials: "omit",
        }).then(function(p_response) {
          return p_response.text();
        }).then(function(p_response) {
          let l_parser = new DOMParser();
          let l_document = l_parser.parseFromString(p_response, "text/html");
          let l_title = l_document.documentElement.querySelector(query_title)
            .textContent.trim();

          // DEBUG
          //console.log(script_name, "counter", ++counter, "index", links_index,
          //  "FETCH", l_topic_url, l_link_topic, l_title);

          topic_titles[l_link_topic] = l_title
          update_title(l_link_item, l_title);
          ++links_index;
          update_next();
        }).catch(function(p_error) {
          console.log(script_name + " ERROR fetch : " + p_error);
        });
      }, l_wait_time);
    } else {

      // DEBUG
      //console.log(script_name, "index", links_index,
      //  l_link_topic, topic_titles[l_link_topic]);

      update_title(l_link_item, topic_titles[l_link_topic]);
      ++links_index;
      update_next();
    }
  }
}
update_next();