// ==UserScript==
// @name [HFR] Informations rapides sur le profil
// @version 0.2.6a.2
// @namespace http://toyonos.info
// @description Rajoute un bouton pour avoir un accès rapide à certaines infos du profil d'un membre
// @include https://forum.hardware.fr/*
// @exclude https://forum.hardware.fr/message.php*
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


// historique modifs r21 :
// 0.2.6a.2 (10/12/2017) :
// - commentage des alert XML
// 0.2.6a.1 (03/12/2017) :
// - passage au https


// Menu pour selectionner l'url de l'image
GM_registerMenuCommand("[HFR] Informations rapides sur le profil -> Url de l'image", function()
{
	var imgUrl = prompt("Url de l'image ?", getCurrentImgUrl());
	if (!imgUrl) return;
	GM_setValue('hfr_irp_imgUrl', imgUrl);		
}
);

var getCurrentImgUrl = function()
{
	return GM_getValue('hfr_irp_imgUrl', 'https://forum-images.hardware.fr/images/perso/mister_k.gif');	
}

function getElementByXpath(path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

function di(a,b)
{
  return ((a - (a%b)) / b);
}

var root = document.getElementById('mesdiscussions');
var pseudos = getElementByXpath('//table//td[@class="messCase1"]//b[@class="s2"]', root); 
var linksMsg = getElementByXpath('//table//td[@class="messCase1"]//div[@class="right"]//a[starts-with(@href, "#t" )]', root); 
var linksProfil = getElementByXpath('//table//tr[starts-with(@class, "message")]//a[starts-with(@href, "/hfr/profil" ) and contains(@href, "#im") = false]', root);

var j = 0;
linksMsg = linksMsg.filter(function(link)
{
	if (pseudos[j++].innerHTML.match(/Profil su.*prim.*/) == null) 
	{
		return link
	}
});

for(var i = 0; i < linksMsg.length; i++)
{
	var newImg = document.createElement('img');
	newImg.src = getCurrentImgUrl();
	newImg.alt = newImg.title = 'Afficher des infos sur ce membre';
	newImg.style.cursor = 'pointer';
	newImg.style.marginRight = '3px';
	newImg.setAttribute('profilUrl', linksProfil[i]);
	newImg.addEventListener('click', function(event)
	{
		toyoAjaxLib.loadDoc(this.getAttribute('profilUrl'), 'get', null, function(profilContent)
		{
			var nbPosts = profilContent.match(/<td class=\"profilCase2\">Nombre de messages .*&nbsp;: <\/td>\s*<td class=\"profilCase3\">([0-9]+)<\/td>/).pop();
			var dateInscription = profilContent.match(/<td class=\"profilCase2\">Date .* sur le forum&nbsp;: <\/td>\s*<td class=\"profilCase3\">([0-9]{2}\/[0-9]{2}\/[0-9]{4})<\/td>/).pop();
			var tmp, smileyPerso = (tmp = profilContent.match(/<td class=\"profilCase4\" rowspan=\"\d\">\s*.*\s*<img src=\"(https:\/\/forum-images\.hardware\.fr\/images\/perso\/.*\.gif)\" alt=\"smilie perso\" \/>\s*&nbsp;<\/td>/)) != null ? tmp.pop() : null;
			var dateNaissance = (tmp = profilContent.match(/<td class=\"profilCase2\">Date de naissance&nbsp;: <\/td>\s*<td class=\"profilCase3\">([0-9]{2}\/[0-9]{2}\/[0-9]{4})<\/td>/)) != null ? tmp.pop() : null;
			var sexe = (tmp = profilContent.match(/<td class=\"profilCase2\">[s|S]exe&nbsp;: <\/td>\s*<td class=\"profilCase3\">(homme|femme)<\/td>/)) != null ? tmp.pop() : null;
			var ville = (tmp = profilContent.match(/<td class=\"profilCase2\">[v|V]ille&nbsp;: <\/td>\s*<td class=\"profilCase3\">(.*?)<\/td>/)) != null ? tmp.pop() : null;
			var dateMessage = profilContent.match(/<td class=\"profilCase2\">Date du dernier message&nbsp;: <\/td>\s*<td class=\"profilCase3\">\s*([0-9]{2})-([0-9]{2})-([0-9]{4})&nbsp;.&nbsp;([0-9]{2})\:([0-9]{2})\s*<\/td>/);
			dateMessage.shift();

			var region = '';
			var match = true, splitRegion = Array();
			var r = new RegExp('<a class="cLink" href="\/hfr\/carte\/.*?">(.*?)<\/a>', 'g');
			while (match != null)
			{
				match = r.exec(profilContent);
				splitRegion.push(match != null ? match.pop() : null);
			}
			splitRegion.reverse().shift();
			for (var i = 0; i < (splitRegion.length < 2 ? splitRegion.length : 2); i++) region += i != 0 ? ', ' + splitRegion[i] : splitRegion[i];

			var age;
			if (dateNaissance != null)
			{
				var secondes = new Date().getTime() - new Date(dateNaissance.substring(6,10), dateNaissance.substring(3,5)-1, dateNaissance.substring(0,2)).getTime();
				age = (secondes - (secondes % 31557600000)) / 31557600000 + " ans";
				if (dateNaissance.substring(3,5)-1 == new Date().getMonth() && dateNaissance.substring(0,2) == new Date().getDate()) age = '<span style="color: red;font-weight: bold">'+age+'</span>';
			}
			else age = ' &acirc;ge non pr&eacute;cis&eacute;';
			
			switch (sexe)
			{
				case "homme" :
					dateInscription = "Inscrit le " + dateInscription;
					sexe = "Homme";
					break;
				case "femme" :
					dateInscription = "Inscrite le " + dateInscription;
					sexe = "Femme";
					break;
				default :
					dateInscription = "Inscrit(e) le " + dateInscription;
					sexe = "Ange";
			}
			
			ville = ville != "" && ville != null ? ville : 'Ville non pr&eacute;cis&eacute;e';

			// Durée d'inactivité, suppose que l'heure locale de l'ordi est synchro avec le fuseau horaire utilisé par le forum
			var timeInac = di(new Date().getTime() -
			 (new Date (dateMessage[2],
				 dateMessage[1]-1,
				 dateMessage[0],
				 dateMessage[3],
				 dateMessage[4]).getTime()
			  ), 1000);
			if (timeInac <= 360) timeInac = "<5 min";
			else if (timeInac < 3600) timeInac =  di(timeInac,60) + " min";
			else if (timeInac < 86400) timeInac = di(timeInac,3600) + " h";
			else timeInac = di(timeInac,86400) + " jours";

			var container = document.getElementById('infos_membre');
			container.innerHTML = sexe + ", " + age + '<br />' + ville + ' (' + region + ')<br />' +dateInscription + '<br />' + nbPosts + ' posts';
			container.innerHTML += '<br />Dernier post il y a ' + timeInac;
			if (smileyPerso != null) container.innerHTML += '<br /><img src="' + smileyPerso + '" alt="' + smileyPerso + '" />';
			container.style.display = 'block';
		});
		
		var newDiv;
		if (document.getElementById('infos_membre'))
		{
			newDiv = document.getElementById('infos_membre');
		}
		else
		{
			newDiv = document.createElement('div');
			newDiv.setAttribute('id', 'infos_membre');
			newDiv.style.position = 'absolute';
			newDiv.style.border = '1px solid black';
			newDiv.style.background = "white";
			newDiv.style.padding = '3px';
			newDiv.style.zIndex = '1001';
			newDiv.style.display = 'none';
			newDiv.className = 'signature';
			root.appendChild(newDiv);
		}
		newDiv.style.left = (event.clientX + 8) + 'px';
		newDiv.style.top = (window.scrollY + event.clientY + 8) + 'px';
	}
	, false);
	
	newImg.addEventListener('mouseout', function(event)
	{
		if (document.getElementById('infos_membre')) document.getElementById('infos_membre').style.display = 'none';
	}
	, false);	
	
	linksMsg[i].parentNode.insertBefore(newImg, linksMsg[i]);
}

/******************************************************************/

var toyoAjaxLib = (function()
{
	// Private members
	
	function loadPage(url, method, arguments, responseHandler)
	{
		var req;
		method = method.toUpperCase();
		if (method == 'GET' && arguments != null) url += '?' + arguments;
		// branch for native XMLHttpRequest object
		if (window.XMLHttpRequest)
		{
			req = new XMLHttpRequest();
	 		req.onreadystatechange = processReqChange(req, responseHandler);
			req.open(method, url, true);
			if (method == 'POST') req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
			arguments = method == 'POST' ? arguments : null;
			req.send(arguments);
		} 
		else if (window.ActiveXObject)
		{
			// branch for IE/Windows ActiveX version
			req = new ActiveXObject("Microsoft.XMLHTTP");
			if (req)
			{
				req.onreadystatechange = processReqChange(req, responseHandler);
				req.open(method, url, true);
				if (method == 'POST') req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
				if (method == 'POST') req.send(arguments);
				else  req.send();
			}
		}
	}
		
	function processReqChange(req, responseHandler)
	{
		return function ()
		{
			try
			{
				// only if req shows "loaded"
				if (req.readyState == 4)
				{
					// only if "OK"
					if (req.status == 200)
					{
						var content = req.responseXML != null && req.responseXML.documentElement != null  ? req.responseXML.documentElement : req.responseText;
						if (responseHandler != null) responseHandler(content);
					}
					else
					{	
						//alert("There was a problem retrieving the XML data:\n" +
						//req.statusText);
					}
				}
			}
			catch(e){}
		}
	}
	
	// Public members
	
	return {
		"loadDoc" : function(url, method, arguments, responseHandler)
		{
			try
			{
				loadPage(url, method, arguments, responseHandler);	
			}
			catch(e)
			{
				var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
				alert("Unable to get data:\n" + msg);
				return;
			}
		}
	};
})();

// ============ Module d'auto update du script ============
({
	check4Update : function()
	{
		var autoUpdate = this;
		var mirrorUrl = GM_getValue('mirrorUrl', 'null');
		if (mirrorUrl == 'null') autoUpdate.retrieveMirrorUrl();

		var currentVersion = GM_getValue('currentVersion', '0.2.6a');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.2.6a', currentVersion))
		{
			GM_setValue('currentVersion', '0.2.6a');
			currentVersion = '0.2.6a';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.2.6a'))
		{
			GM_registerMenuCommand("[HFR] Informations rapides sur le profil -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'infos_profil_hfr.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Informations rapides sur le profil');
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
						if (confirm('Une nouvelle version de [HFR] Informations rapides sur le profil est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'infos_profil_hfr.user.js');
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
