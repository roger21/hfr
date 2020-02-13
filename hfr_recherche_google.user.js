// ==UserScript==
// @name          [HFR] Recherche Google
// @version       1.5.5
// @namespace     roger21.free.fr
// @description   Remplace le champ de recherche du forum (en haut à droite) par un champ de recherche par Google.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEX%2F%2F%2F8AAADxjxvylSrzmzf5wYLzmjb%2F9er%2F%2Fv70nj32q1b5woT70qT82rT827b%2F%2B%2FjxkSHykybykyfylCjylCnzmDDzmjX0nTv1o0b1qFH2qVL2qlT3tGn4tmz4uHD4uXL5vHf83Lf83Lj937394MH%2B587%2B69f%2F8%2BX%2F8%2Bf%2F9On%2F9uz%2F%2BPH%2F%2BvT%2F%2FPmRE1AgAAAAwElEQVR42s1SyRbCIAysA7W2tdZ93%2Ff1%2F39PEtqDEt6rXnQOEMhAMkmC4E9QY9j9da1OkP%2BtTiBo1caOjGisDLRDANCk%2FVIHwwkBZGReh9avnGj2%2FWFg%2Feg5hD1bLZTwqdgU%2FlTSdrqZJWN%2FKImPOnGjiBJKhYqMvikxtlhLNTuz%2FgkxjmJRRza5mbcXpbz4zldLJ0lVEBY5nRL4CJx%2FMEfXE4L9j4Qr%2BZakpiandMpX6FO7%2FaPxxUTJI%2FsJ4cd4AoSOBgZnPvgtAAAAAElFTkSuQmCC
// @include       https://forum.hardware.fr/*
// @author        roger21
// @updateURL     https://raw.githubusercontent.com/roger21/hfr/master/hfr_recherche_google.user.js
// @installURL    https://raw.githubusercontent.com/roger21/hfr/master/hfr_recherche_google.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/hfr/master/hfr_recherche_google.user.js
// @supportURL    https://forum.hardware.fr/hfr/Discussions/Viepratique/sujet_116015_1.htm
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         GM.openInTab
// @grant         GM_openInTab
// ==/UserScript==

/*

Copyright © 2012-2020 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// $Rev: 1590 $

// historique :
// 1.5.5 (13/02/2020) :
// - utilisation d'une url en data pour l'icône du script et changement d'hébergeur (free.fr -> github.com)
// 1.5.4 (01/01/2020) :
// - mise à jour des cats / sous-cats
// 1.5.3 (02/10/2019) :
// - suppression de la directive "@inject-into" (mauvaise solution, changer solution)
// - correction de la gestion de la compatibilité gm4 (pour violentmonkey)
// 1.5.2 (18/09/2019) :
// - ajout de la directive "@inject-into content" pour isoler le script sous violentmonkey
// 1.5.1 (29/11/2018) :
// - ajout de l'avis de licence AGPL v3+
// 1.5.0 (12/08/2018) :
// - nouveau nom : [HFR] recherche google -> [HFR] Recherche Google
// - ajout de la metadata @author (roger21)
// 1.4.0 (26/05/2018) :
// - ajout du support pour la cat shop
// - gestion de la compatibilité gm4
// - utilisation de keydown au lieu de keypress
// - recodage en event.key au lieu de event.keyCode deprecated
// - check du code dans tm et restylage du code (moins barbare)
// - maj de la metadata @homepageURL
// - suppression des @grant inutiles
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.3.1 (28/11/2017) :
// - passage au https
// 1.3.0 (30/10/2016) :
// - force l'ouverture de la recherche google au premier plan (ajout d'un paramètre modifiable dans le code)
// 1.2.8 (06/08/2016) :
// - compression de l'image du bouton (pngoptimizer)
// - correction des styles css du bouton et du champ de recherche
// - mise à jour des cats / sous-cats mais y'avait rien de nouveau :o
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.2.7 (20/01/2016) :
// - correction d'un deprecated dans string.replace()
// - ajout d'un padding left dans l'input de recherche pour voir ce con de curseur :o
// 1.2.6 (29/11/2015) :
// - nouvelle mise à jour des cats / sous-cats (nouvelle cat diy)
// 1.2.5 (11/11/2015) :
// - mise à jour des cats / sous-cats
// 1.2.4 (05/09/2015) :
// - nouveau logo google
// 1.2.3 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.2.2 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.2.1 (18/03/2014) :
// - modification de la description
// - maj des metadata @grant et indentation des metadata
// - correction d'une typo dans l'historique
// 1.2.0 (14/09/2013) :
// - nodeValue -> textContent pour gérer les nodes element des pages > 1
// 1.1.1 (14/09/2012) :
// - ajout des metadata @grant
// 1.1.0 (02/09/2012):
// - gestion des NO_BREAK_SPACE qui apparaissent comme ça par magie, merci md de merde


// ouverture de l'onglet de recherche google au premier plan
// (mettre à false pour forcer l'ouverture en arrière plan)
var open_in_foreground = true;


// compatibilité gm4
if(typeof GM === "undefined") {
  this.GM = {};
}
if(typeof GM_openInTab !== "undefined" && typeof GM.openInTab === "undefined") {
  GM.openInTab = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_openInTab.apply(null, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}

// les cats / sous-cats
var cats = {
  cat0: {
    key: "service-client-shophfr",
    name: "Service client shop.hardware.fr"
  },
  cat1: {
    key: "Hardware",
    name: "Hardware",
    subcats: {
      subcat0: {
        key: "carte-mere",
        name: "Carte mère"
      },
      subcat1: {
        key: "Memoire",
        name: "Mémoire"
      },
      subcat2: {
        key: "Processeur",
        name: "Processeur"
      },
      subcat3: {
        key: "2D-3D",
        name: "Carte graphique"
      },
      subcat4: {
        key: "Boitier",
        name: "Boitier"
      },
      subcat5: {
        key: "Alimentation",
        name: "Alimentation"
      },
      subcat6: {
        key: "HDD",
        name: "Disque dur"
      },
      subcat7: {
        key: "SSD",
        name: "Disque SSD"
      },
      subcat8: {
        key: "lecteur-graveur",
        name: "CD/DVD/BD"
      },
      subcat9: {
        key: "minipc",
        name: "Mini PC"
      },
      subcat10: {
        key: "Benchs",
        name: "Bench"
      },
      subcat11: {
        key: "Materiels-problemes-divers",
        name: "Matériels & problèmes divers"
      },
      subcat12: {
        key: "conseilsachats",
        name: "Conseil d'achat"
      },
      subcat13: {
        key: "hfr",
        name: "HFR"
      },
      subcat14: {
        key: "actualites",
        name: "Actus"
      }
    }
  },
  cat2: {
    key: "HardwarePeripheriques",
    name: "Hardware - Périphériques",
    subcats: {
      subcat0: {
        key: "Ecran",
        name: "Ecran"
      },
      subcat1: {
        key: "Imprimante",
        name: "Imprimante"
      },
      subcat2: {
        key: "Scanner",
        name: "Scanner"
      },
      subcat3: {
        key: "webcam-camera-ip",
        name: "Webcam / Caméra IP"
      },
      subcat4: {
        key: "Clavier-Souris",
        name: "Clavier / Souris"
      },
      subcat5: {
        key: "Joys",
        name: "Joys"
      },
      subcat6: {
        key: "Onduleur",
        name: "Onduleur"
      },
      subcat7: {
        key: "Divers",
        name: "Divers"
      }
    }
  },
  cat3: {
    key: "OrdinateursPortables",
    name: "Ordinateurs portables",
    subcats: {
      subcat0: {
        key: "portable",
        name: "Portable"
      },
      subcat1: {
        key: "Ultraportable",
        name: "Ultraportable"
      },
      subcat2: {
        key: "Transportable",
        name: "Transportable"
      },
      subcat3: {
        key: "Netbook",
        name: "Netbook"
      },
      subcat4: {
        key: "Composant",
        name: "Composant"
      },
      subcat5: {
        key: "Accessoire",
        name: "Accessoire"
      },
      subcat6: {
        key: "Conseils-d-achat",
        name: "Conseils d'achat"
      },
      subcat7: {
        key: "SAV",
        name: "SAV"
      }
    }
  },
  cat4: {
    key: "OverclockingCoolingModding",
    name: "Overclocking, Cooling & Modding",
    subcats: {
      subcat0: {
        key: "CPU",
        name: "CPU"
      },
      subcat1: {
        key: "GPU",
        name: "GPU"
      },
      subcat2: {
        key: "Air-Cooling",
        name: "Air Cooling"
      },
      subcat3: {
        key: "Water-Xtreme-Cooling",
        name: "Water & Xtreme Cooling"
      },
      subcat4: {
        key: "Silence",
        name: "Silence"
      },
      subcat5: {
        key: "Modding",
        name: "Modding"
      },
      subcat6: {
        key: "Divers-8",
        name: "Divers"
      }
    }
  },
  cat5: {
    key: "electroniquedomotiquediy",
    name: "Electronique, domotique, DIY",
    subcats: {
      subcat0: {
        key: "conception_depannage_mods",
        name: "Conception, dépannage, mods"
      },
      subcat1: {
        key: "nano-ordinateur_microcontroleurs_fpga",
        name: "Nano-ordinateur, microcontrôleurs, FPGA"
      },
      subcat2: {
        key: "domotique_maisonconnectee",
        name: "Domotique et maison connectée"
      },
      subcat3: {
        key: "mecanique_prototypage",
        name: "Mécanique, prototypage"
      },
      subcat4: {
        key: "imprimantes3D",
        name: "Imprimantes 3D"
      },
      subcat5: {
        key: "robotique_modelisme",
        name: "Robotique et modélisme"
      },
      subcat6: {
        key: "divers",
        name: "Divers"
      }
    }
  },
  cat6: {
    key: "gsmgpspda",
    name: "Technologies Mobiles",
    subcats: {
      subcat0: {
        key: "autres-os-mobiles",
        name: "Autres OS Mobiles"
      },
      subcat1: {
        key: "operateur",
        name: "Opérateur"
      },
      subcat2: {
        key: "telephone-android",
        name: "Téléphone Android"
      },
      subcat3: {
        key: "telephone-windows-phone",
        name: "Téléphone Windows Phone"
      },
      subcat4: {
        key: "telephone",
        name: "Téléphone"
      },
      subcat5: {
        key: "tablette",
        name: "Tablette"
      },
      subcat6: {
        key: "android",
        name: "Android"
      },
      subcat7: {
        key: "windows-phone",
        name: "Windows Phone"
      },
      subcat8: {
        key: "GPS-PDA",
        name: "GPS / PDA"
      },
      subcat9: {
        key: "accessoires",
        name: "Accessoires"
      }
    }
  },
  cat7: {
    key: "apple",
    name: "Apple",
    subcats: {
      subcat0: {
        key: "Mac-OS-X",
        name: "Mac OS X"
      },
      subcat1: {
        key: "Applications",
        name: "Applications"
      },
      subcat2: {
        key: "Mac",
        name: "Mac"
      },
      subcat3: {
        key: "Macbook",
        name: "Macbook"
      },
      subcat4: {
        key: "Iphone-amp-Ipod",
        name: "Iphone & Ipod"
      },
      subcat5: {
        key: "Ipad",
        name: "Ipad"
      },
      subcat6: {
        key: "Peripheriques",
        name: "Périphériques"
      }
    }
  },
  cat8: {
    key: "VideoSon",
    name: "Video & Son",
    subcats: {
      subcat0: {
        key: "HiFi-HomeCinema",
        name: "HiFi & Home Cinema"
      },
      subcat1: {
        key: "Materiel",
        name: "Matériel"
      },
      subcat2: {
        key: "Traitement-Audio",
        name: "Traitement Audio"
      },
      subcat3: {
        key: "Traitement-Video",
        name: "Traitement Vidéo"
      }
    }
  },
  cat9: {
    key: "Photonumerique",
    name: "Photo numérique",
    subcats: {
      subcat0: {
        key: "Appareil",
        name: "Appareil"
      },
      subcat1: {
        key: "Objectif",
        name: "Objectif"
      },
      subcat2: {
        key: "Accessoire",
        name: "Accessoire"
      },
      subcat3: {
        key: "Photos",
        name: "Photos"
      },
      subcat4: {
        key: "Technique",
        name: "Technique"
      },
      subcat5: {
        key: "Logiciels-Retouche",
        name: "Logiciels & Retouche"
      },
      subcat6: {
        key: "Argentique",
        name: "Argentique"
      },
      subcat7: {
        key: "Concours",
        name: "Concours"
      },
      subcat8: {
        key: "Galerie-Perso",
        name: "Galerie Perso"
      },
      subcat9: {
        key: "Divers-7",
        name: "Divers"
      }
    }
  },
  cat10: {
    key: "JeuxVideo",
    name: "Jeux Video",
    subcats: {
      subcat0: {
        key: "PC",
        name: "PC"
      },
      subcat1: {
        key: "Consoles",
        name: "Consoles"
      },
      subcat2: {
        key: "Achat-Ventes",
        name: "Achat & Ventes"
      },
      subcat3: {
        key: "Teams-LAN",
        name: "Teams & LAN"
      },
      subcat4: {
        key: "Tips-Depannage",
        name: "Tips & Dépannage"
      },
      subcat5: {
        key: "VR-Realite-Virtuelle",
        name: "Réalité virtuelle"
      },
      subcat6: {
        key: "mobiles",
        name: "Mobiles"
      }
    }
  },
  cat11: {
    key: "WindowsSoftware",
    name: "Windows & Software",
    subcats: {
      subcat0: {
        key: "windows-10",
        name: "Win 10"
      },
      subcat1: {
        key: "windows-8",
        name: "Win 8"
      },
      subcat2: {
        key: "Windows-7-seven",
        name: "Win 7"
      },
      subcat3: {
        key: "Windows-vista",
        name: "Win Vista"
      },
      subcat4: {
        key: "Windows-nt-2k-xp",
        name: "Win NT/2K/XP"
      },
      subcat5: {
        key: "Win-9x-me",
        name: "Win 9x/Me"
      },
      subcat6: {
        key: "Securite",
        name: "Sécurité"
      },
      subcat7: {
        key: "Virus-Spywares",
        name: "Virus/Spywares"
      },
      subcat8: {
        key: "Stockage-Sauvegarde",
        name: "Stockage/Sauvegarde"
      },
      subcat9: {
        key: "Logiciels",
        name: "Logiciels"
      },
      subcat10: {
        key: "Tutoriels",
        name: "Tutoriels"
      }
    }
  },
  cat12: {
    key: "reseauxpersosoho",
    name: "Réseaux grand public / SoHo",
    subcats: {
      subcat0: {
        key: "FAI",
        name: "FAI"
      },
      subcat1: {
        key: "Reseaux",
        name: "Réseaux"
      },
      subcat2: {
        key: "Routage-et-securite",
        name: "Sécurité"
      },
      subcat3: {
        key: "WiFi-et-CPL",
        name: "WiFi et CPL"
      },
      subcat4: {
        key: "Hebergement",
        name: "Hébergement"
      },
      subcat5: {
        key: "Tel-TV-sur-IP",
        name: "Tel / TV sur IP"
      },
      subcat6: {
        key: "Chat-visio-et-voix",
        name: "Chat, visio et voix"
      },
      subcat7: {
        key: "Tutoriels",
        name: "Tutoriels"
      }
    }
  },
  cat13: {
    key: "systemereseauxpro",
    name: "Systèmes & Réseaux Pro",
    subcats: {
      subcat0: {
        key: "Reseaux",
        name: "Réseaux"
      },
      subcat1: {
        key: "Securite",
        name: "Sécurité"
      },
      subcat2: {
        key: "Telecom",
        name: "Télécom"
      },
      subcat3: {
        key: "Infrastructures-serveurs",
        name: "Infrastructures serveurs"
      },
      subcat4: {
        key: "Stockage",
        name: "Stockage"
      },
      subcat5: {
        key: "Logiciels-entreprise",
        name: "Logiciels d'entreprise"
      },
      subcat6: {
        key: "Management-SI",
        name: "Management du SI"
      },
      subcat7: {
        key: "poste-de-travail",
        name: "Poste de travail"
      }
    }
  },
  cat14: {
    key: "OSAlternatifs",
    name: "Linux et OS Alternatifs",
    subcats: {
      subcat0: {
        key: "Codes-scripts",
        name: "Codes et scripts"
      },
      subcat1: {
        key: "Debats",
        name: "Débats"
      },
      subcat2: {
        key: "Divers-2",
        name: "Divers"
      },
      subcat3: {
        key: "Hardware-2",
        name: "Hardware"
      },
      subcat4: {
        key: "Installation",
        name: "Installation"
      },
      subcat5: {
        key: "Logiciels-2",
        name: "Logiciels"
      },
      subcat6: {
        key: "Multimedia",
        name: "Multimédia"
      },
      subcat7: {
        key: "reseaux-securite",
        name: "réseaux et sécurité"
      }
    }
  },
  cat15: {
    key: "Programmation",
    name: "Programmation",
    subcats: {
      subcat0: {
        key: "ADA",
        name: "Ada"
      },
      subcat1: {
        key: "Algo",
        name: "Algo"
      },
      subcat2: {
        key: "Android",
        name: "Android"
      },
      subcat3: {
        key: "API-Win32",
        name: "API Win32"
      },
      subcat4: {
        key: "ASM",
        name: "ASM"
      },
      subcat5: {
        key: "ASP",
        name: "ASP"
      },
      subcat6: {
        key: "Big-Data",
        name: "BI/Big Data"
      },
      subcat7: {
        key: "C",
        name: "C"
      },
      subcat8: {
        key: "CNET-managed",
        name: "C#/.NET managed"
      },
      subcat9: {
        key: "C-2",
        name: "C++"
      },
      subcat10: {
        key: "Delphi-Pascal",
        name: "Delphi/Pascal"
      },
      subcat11: {
        key: "Flash-ActionScript",
        name: "Flash/ActionScript"
      },
      subcat12: {
        key: "HTML-CSS-Javascript",
        name: "HTML/CSS"
      },
      subcat13: {
        key: "iOS",
        name: "iOS"
      },
      subcat14: {
        key: "Java",
        name: "Java"
      },
      subcat15: {
        key: "Javascript-Node-js",
        name: "Javascript/Node.js"
      },
      subcat16: {
        key: "Langages-fonctionnels",
        name: "Langages fonctionnels"
      },
      subcat17: {
        key: "Perl",
        name: "Perl"
      },
      subcat18: {
        key: "PHP",
        name: "PHP"
      },
      subcat19: {
        key: "Python",
        name: "Python"
      },
      subcat20: {
        key: "Ruby",
        name: "Ruby/Rails"
      },
      subcat21: {
        key: "Shell-Batch",
        name: "Shell/Batch"
      },
      subcat22: {
        key: "SGBD-SQL",
        name: "SQL/NoSQL"
      },
      subcat23: {
        key: "VB-VBA-VBS",
        name: "VB/VBA/VBS"
      },
      subcat24: {
        key: "Windows-Phone",
        name: "Windows Phone"
      },
      subcat25: {
        key: "XML-XSL",
        name: "XML/XSL"
      },
      subcat26: {
        key: "Divers-6",
        name: "Divers"
      }
    }
  },
  cat16: {
    key: "Graphisme",
    name: "Graphisme",
    subcats: {
      subcat0: {
        key: "Cours",
        name: "Cours"
      },
      subcat1: {
        key: "Galerie",
        name: "Galerie"
      },
      subcat2: {
        key: "Infographie-2D",
        name: "Infographie 2D"
      },
      subcat3: {
        key: "PAO-Desktop-Publishing",
        name: "PAO / Desktop Publishing"
      },
      subcat4: {
        key: "Infographie-3D",
        name: "Infographie 3D"
      },
      subcat5: {
        key: "Webdesign",
        name: "Web design"
      },
      subcat6: {
        key: "Arts-traditionnels",
        name: "Arts traditionnels"
      },
      subcat7: {
        key: "Concours-2",
        name: "Concours"
      },
      subcat8: {
        key: "Ressources",
        name: "Ressources"
      },
      subcat9: {
        key: "Divers-5",
        name: "Divers"
      }
    }
  },
  cat17: {
    key: "AchatsVentes",
    name: "Achats & Ventes",
    subcats: {
      subcat0: {
        key: "Hardware",
        name: "Hardware"
      },
      subcat1: {
        key: "pc-portables",
        name: "PC Portables"
      },
      subcat2: {
        key: "tablettes",
        name: "Tablettes"
      },
      subcat3: {
        key: "Photo-Audio-Video",
        name: "Photo"
      },
      subcat4: {
        key: "audio-video",
        name: "Audio, Vidéo"
      },
      subcat5: {
        key: "Telephonie",
        name: "Téléphonie"
      },
      subcat6: {
        key: "Softs-livres",
        name: "Softs, livres"
      },
      subcat7: {
        key: "Divers-4",
        name: "Divers"
      },
      subcat8: {
        key: "Avis-estimations",
        name: "Avis, estimations"
      },
      subcat9: {
        key: "Feedback",
        name: "Feed-back"
      },
      subcat10: {
        key: "Regles-coutumes",
        name: "Règles et coutumes"
      }
    }
  },
  cat18: {
    key: "EmploiEtudes",
    name: "Emploi & Etudes",
    subcats: {
      subcat0: {
        key: "Marche-emploi",
        name: "Marché de l'emploi"
      },
      subcat1: {
        key: "Etudes-Orientation",
        name: "Etudes / Orientation"
      },
      subcat2: {
        key: "Annonces-emplois",
        name: "Annonces d'emplois"
      },
      subcat3: {
        key: "Feedback-entreprises",
        name: "Feedback sur les entreprises"
      },
      subcat4: {
        key: "Aide-devoirs",
        name: "Aide aux devoirs"
      }
    }
  },
  cat19: {
    key: "Setietprojetsdistribues",
    name: "Seti et projets distribués",
    subcats: {
      subcat0: {
        key: "BOINC",
        name: "BOINC"
      },
      subcat1: {
        key: "SETI",
        name: "SETI"
      },
      subcat2: {
        key: "projets-distribues",
        name: "Autres projets distribués"
      },
      subcat3: {
        key: "Divers-3",
        name: "Divers"
      }
    }
  },
  cat20: {
    key: "Discussions",
    name: "Discussions",
    subcats: {
      subcat0: {
        key: "Actualite",
        name: "Actualité"
      },
      subcat1: {
        key: "politique",
        name: "Politique"
      },
      subcat2: {
        key: "Societe",
        name: "Société"
      },
      subcat3: {
        key: "Cinema",
        name: "Cinéma"
      },
      subcat4: {
        key: "Musique",
        name: "Musique"
      },
      subcat5: {
        key: "Arts-Lecture",
        name: "Arts & Lecture"
      },
      subcat6: {
        key: "TV-Radio",
        name: "TV, Radio"
      },
      subcat7: {
        key: "Sciences",
        name: "Sciences"
      },
      subcat8: {
        key: "Sante",
        name: "Santé"
      },
      subcat9: {
        key: "Sports",
        name: "Sports"
      },
      subcat10: {
        key: "Auto-Moto",
        name: "Auto / Moto"
      },
      subcat11: {
        key: "Cuisine",
        name: "Cuisine"
      },
      subcat12: {
        key: "Loisirs",
        name: "Loisirs"
      },
      subcat13: {
        key: "voyages",
        name: "Voyages"
      },
      subcat14: {
        key: "Viepratique",
        name: "Vie pratique"
      }
    }
  }
};

var tree2 = document.querySelector("#md_arbo_tree_2");
tree2 = tree2 ?
  (tree2.nodeName.toUpperCase() == "H1" ?
    tree2.lastChild.textContent.replace(/\u00A0/g, " ").trim() :
    (tree2.nodeName.toUpperCase() == "SPAN" ?
      tree2.lastElementChild.firstChild.textContent.replace(/\u00A0/g, " ").trim() :
      null)) :
  null;

//console.log("tree2 : |" + tree2 + "|");

var tree3 = document.querySelector("#md_arbo_tree_3");
tree3 = tree3 ?
  (tree3.nodeName.toUpperCase() == "H1" ?
    tree3.lastChild.textContent.replace(/\u00A0/g, " ").trim() :
    (tree3.nodeName.toUpperCase() == "SPAN" ?
      tree3.lastElementChild.firstChild.textContent.replace(/\u00A0/g, " ").trim() :
      null)) :
  null;

//console.log("tree3 : |" + tree3 + "|");

var cat = null;
if(tree2) {
  for(let i in cats) {
    if(tree2 === cats[i].name) {
      cat = cats[i];
      break;
    }
  }
}

var subcat = null;
if(cat && tree3) {
  for(let j in cat.subcats) {
    if(tree3 === cat.subcats[j].name) {
      subcat = cat.subcats[j];
      break;
    }
  }
}

function geturl() {
  let inurl = " ";
  if(cat) inurl += "inurl:" + cat.key + " ";
  if(subcat) inurl += "inurl:" + subcat.key + " ";
  return "https://www.google.fr/search?hl=fr&q=" +
    encodeURIComponent("site:forum.hardware.fr" + inurl + input.value);
}

function goinput(e) {
  if(e.key === "Enter") {
    e.preventDefault();
    GM.openInTab(geturl(), !open_in_foreground);
  }
}

function goimg(e) {
  GM.openInTab(geturl(), !open_in_foreground);
}

var input, img, search = document.querySelector("table.hfrheadmenu td[align=right]");
if(search) {
  while(search.firstChild) {
    search.removeChild(search.firstChild);
  }
  input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("class", "fastsearchInput");
  input.setAttribute("title", "[HFR] recherche google");
  input.style.width = "200px";
  input.style.height = "16px";
  input.style.padding = "0 0 0 1px";
  input.style.border = "1px solid black";
  input.style.borderRight = "0";
  input.style.margin = "0";
  input.addEventListener("keydown", goinput, false);
  img = document.createElement("img");
  img.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABWklEQVR42mP4jwT%2B%2Ffv3FwP8RwUMcBamHLIU0CwUDRDV%2F37%2B%2FLZm6bvM2NdeNq%2Fcrd6lRX1duQgoiKyHAa7676sX75IjXjmboqEPZTnIhjJA9AGNeZsUBpR%2B7Wn9Zc7UX5fO%2F7py8cvcaW%2Fjgv48fojiB4i%2B3%2BcnvQkyf%2BVm8evKBTTno3kGquHPSdOfm7i%2BLcn%2BjxcgNPzex%2F17D%2Bu%2FN9vgck6tX5BR9arvqBr2coE0vN6KS0PpMlQNH4%2FovN0juOFiL6Yzmtb9AGro3foDRcPZa50eq7wtVoWde3UVWfWNZ3%2Fd2kE2HL7xB6oBIvHzz6%2Fw7YUmK4KtVkVMvLDozMsr515dm31lldfimY5tH9LnfoNENDAOEBH38uubCLAeNBSxvu%2FFh3%2BIiIOnOZA9f38tv7kldleZ1eoIoFWRO4rmXl3z7fcP5JTGgJxO8QQ%2FltQKl0MD8HQKAQBEpJSVpDvcPwAAAABJRU5ErkJggg%3D%3D");
  img.setAttribute("title", "[HFR] recherche google");
  img.style.border = "1px solid black";
  img.style.borderLeft = "0";
  img.style.margin = "0";
  img.style.verticalAlign = "bottom";
  img.addEventListener("click", goimg, false);
  search.appendChild(input);
  search.appendChild(img);
}
