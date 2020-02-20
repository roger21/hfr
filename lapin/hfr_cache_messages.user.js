// ==UserScript==
// @author        BZHDeveloper, roger21
// @name          [HFR] Cache-Messages
// @version       0.0.3.2
// @namespace     forum.hardware.fr
// @description   Cache les messages à partir d'une certaine date
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @downloadURL   http://breizhodrome.free.fr/hfr/scripts/hfr_cache_messages.user.js
// @updateURL     http://breizhodrome.free.fr/hfr/scripts/hfr_cache_messages.user.js
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/forum1f.php*
// @include       https://forum.hardware.fr/forum1.php*
// @include       https://forum.hardware.fr/hfr/*
// @noframes
// @grant         GM.info
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM_info
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// ==/UserScript==

var enable_url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABmJLR0QA/wADAAOoaJMQAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4gYSDyc4G5M3WwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABqSURBVCjPrZNRDsAgCEOp8f5X7j4WFzZKhDi+TOOrRRGmi0LDTqCZGRlZAIHxMBWUmMDDJfBrMJJoz1ppPvbr1LWhos1wzSJ+1tLc9NWHAYSIymDYQY3bGC1oPZWMTbLU8y8Tdjzb7V91AUfQNSld3n8nAAAAAElFTkSuQmCC";
var disable_url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABmJLR0QA/wADAAOoaJMQAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4gYSDywuDLNbwQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABfSURBVCjPrVNBDsAgCGsJ//8yOy1xpgjE9UJsUrRYCI0QHCsiGkoqcQRqcCmcCPcGlnnggVvPn1spJpZx3hlzZskLX3MxxRNVA8MFDAA5FL1f5Vk2O55/Sdh1tsdb9QAeZhcj7S6OugAAAABJRU5ErkJggg==";

if (typeof GM_registerMenuCommand == 'undefined') {
  GM_registerMenuCommand = (caption, commandFunc, accessKey) => {
    if (!document.body) {
      if (document.readyState === 'loading'
        && document.documentElement && document.documentElement.localName === 'html') {
        new MutationObserver((mutations, observer) => {
          if (document.body) {
            observer.disconnect();
            GM_registerMenuCommand(caption, commandFunc, accessKey);
          }
        }).observe(document.documentElement, {childList: true});
      } else {
        console.error('GM_registerMenuCommand got no body.');
      }
      return;
    }
    let contextMenu = document.body.getAttribute('contextmenu');
    let menu = (contextMenu ? document.querySelector('menu#' + contextMenu) : null);
    if (!menu) {
      menu = document.createElement('menu');
      menu.setAttribute('id', 'gm-registered-menu');
      menu.setAttribute('type', 'context');
      document.body.appendChild(menu);
      document.body.setAttribute('contextmenu', 'gm-registered-menu');
    }
    let menuItem = document.createElement('menuitem');
    menuItem.textContent = caption;
    menuItem.addEventListener('click', commandFunc, true);
    menu.appendChild(menuItem);
  };
}

function isGM4() {
	if (typeof (GM) !== "object")
		return false;
	if (typeof (GM.info) !== "object")
		return false;
	return GM.info.scriptHandler == "Greasemonkey" && parseFloat(GM.info.version) >= 4;
}

var HFR = {
	setValue : function (key, data) {
		if (!isGM4()) {
			GM_setValue (key, data);
			return;
		}
		if (typeof (data) === "object")
			localStorage.setItem (GM.info.script.name + " :: " + key, JSON.stringify (data));
		else
			localStorage.setItem (GM.info.script.name + " :: " + key, data);
	},
	getValue : function (key, default_value) {
		if (!isGM4())
			return GM_getValue (key, default_value);
		var rk = GM.info.script.name + " :: " + key;
		if (!localStorage.hasOwnProperty (key))
			return default_value;
		return localStorage.getItem (rk);
	}
};

GM_registerMenuCommand("[HFR] Cache-Messages -> Limite d'affichage des messages", function() {
	var param = prompt ("Indiquez la durée en secondes de dissimulation des messages. Les messages de l'instant T jusqu'à l'instant T moins la limite seront cachés. Valeur par défaut : 3600s (1 h)", HFR.getValue ("hfr-cache-messages-temps", "3600"));
	var value = param;
	if (isNaN(parseInt(param)))
		value = "3600";
	HFR.setValue ("hfr-cache-messages-temps", value);
});

GM_registerMenuCommand("[HFR] Cache-Messages -> Activation du script", function() {
	var param = prompt ("Indiquez 'oui' ou 'non' pour l'activation du script", HFR.getValue ("hfr-cache-messages-actif", "oui"));
	var value = param;
	if (param != "oui")
		value = "non";
	HFR.setValue ("hfr-cache-messages-actif", value);
});

var toolbar = document.querySelector ("table.main > tbody > tr > th > div.right");
if (toolbar == null)
	return;
var hop = document.querySelector ("form[name='hop']");
var id = hop.querySelector ("[name='cat']").getAttribute ("value") + ":" + hop.querySelector ("[name='subcat']").getAttribute ("value") + ":" + hop.querySelector ("[name='post']").getAttribute ("value");
var table = JSON.parse (HFR.getValue ("hfr-cache-message-table", "{}"));
var img = document.createElement ("img");
img.setAttribute ("src", table[id] == true ? enable_url : disable_url);
	img.setAttribute ("title", "Cache-Messages : " + (table[id] == true ? "actif" : "inactif"));
img.enable = table[id] == true;
img.addEventListener ("click", function (event) {
	img.enable = !img.enable;
	table[id] = img.enable;
	HFR.setValue ("hfr-cache-message-table", JSON.stringify (table));
	img.setAttribute ("src", img.enable ? enable_url : disable_url);
	img.setAttribute ("title", "Cache-Messages : " + (img.enable ? "actif" : "inactif"));
}, false);
toolbar.insertBefore (img, toolbar.lastChild);

console.log (table);
console.log (id);
console.log (table[id]);

if (table[id] != true)
	return;

var limit = parseInt(HFR.getValue ("hfr-cache-messages-temps")) * 1000;
var now = new Date();
let messages = document.querySelectorAll(".messagetable");
for (let message of messages) {
	var dstr = message.querySelector(".toolbar > .left").firstChild.nodeValue;
	var ymd = dstr.split ("Posté le")[1].split ("à")[0].trim();
	ymd = ymd.split("-")[2] + "-" + ymd.split("-")[1] + "-" + ymd.split("-")[0];
	var hms = dstr.split ("à")[1].trim();
	var date = new Date(ymd + "T" + hms);
	if ((now - date) < limit) {
		var odiv = message.querySelector("div[id^=\"para\"]");
		var div = document.createElement ("div");
		div.classList.add ("container");
		div.innerHTML = `<table class="spoiler" onclick="javascript:swap_spoiler_states(this)" style="cursor:pointer;"><tbody><tr class="none"><td><b class="s1Topic">Spoiler :</b><br><br><div class="Topic masque"></div></td></tr></tbody></table>`;
		var topic = div.querySelector (".Topic");
		var tmp = [];
		for (var i = 0; i < odiv.children.length; i++) {
			var child = odiv.children.item (i);
			if (child.classList.contains ("edited") || child.classList.contains ("signature"))
				break;
			tmp.push (child);
		}
		for (var i = 0; i < tmp.length; i++) {
			tmp[i].parentElement.removeChild (tmp[i]);
			topic.appendChild (tmp[i]);
		}
		odiv.insertBefore (div, odiv.firstChild);
	}
}

// now - limit