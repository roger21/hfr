// ==UserScript==
// @name [HFR] Informations rapides sur le profil
// @version 0.2.5c
// @namespace http://toyonos.info
// @description Rajoute un accès rapide à certaines infos du profil d'un membre au passage de la souris sur le pseudo
// @include http://forum.hardware.fr/*
// @exclude http://forum.hardware.fr/message.php*
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

function getRealPseudo(pseudoValue)
{
	// Suppression du caractère spécial dans les pseudos longs
	return pseudoValue.split(String.fromCharCode(8203)).join('');
}

var root = document.getElementById('mesdiscussions');
var profilUrl = 'http://forum.hardware.fr/profilebdd.php?config=hfr.inc&pseudo=';
var cancel = false;

var pseudos = getElementByXpath('.//table//td[@class="messCase1"]//b[@class="s2"]', root);
pseudos.filter(function(pseudo)
{
	return pseudo.innerHTML.match(/Profil su.*prim.*/) == null;
}
).forEach(function(pseudo)
{
	pseudo.style.cursor = 'help';
	pseudo.addEventListener('click', function(){ window.open(profilUrl + getRealPseudo(this.innerHTML)); }, false);
	enhancePseudo(pseudo);
}
);

var pseudosCitation = getElementByXpath('.//table[@class="oldcitation" or @class="citation"]//td//b[@class="s1"]//a', root);
pseudosCitation.forEach(function(pseudo)
{
	var pseudoValue = pseudo.innerHTML.substr(0, (pseudo.innerHTML.length - ' a écrit :'.length));
	enhancePseudo(pseudo, pseudoValue);
}
);

function enhancePseudo(pseudo)
{
	var pseudoValue = enhancePseudo.arguments.length > 1 ? enhancePseudo.arguments[1] : getRealPseudo(pseudo.innerHTML);
	
	pseudo.addEventListener('mouseover', function(event)
	{
		cancel = false;
		toyoAjaxLib.loadDoc(profilUrl + pseudoValue, 'get', null, function(profilContent)
		{
			if (profilContent == null) return;
			
			var tmp;
			var nbPosts = profilContent.match(/<td class=\"profilCase2\">Nombre de messages .*&nbsp;: <\/td>\s*<td class=\"profilCase3\">([0-9]+)<\/td>/).pop();
			var dateInscription = profilContent.match(/<td class=\"profilCase2\">Date .* sur le forum&nbsp;: <\/td>\s*<td class=\"profilCase3\">([0-9]{2}\/[0-9]{2}\/[0-9]{4})<\/td>/).pop();
			var smileyPerso = (tmp = profilContent.match(/<img src=\"(http:\/\/forum-images\.hardware\.fr\/images\/perso\/.*\.gif)\" alt=\"smilie perso\" \/>/)) != null ? tmp.pop() : null;
			var smileyPerso1 = (tmp = profilContent.match(/<img src=\"(http:\/\/forum-images\.hardware\.fr\/images\/perso\/1\/.*\.gif)\".*\/>/)) != null ? tmp.pop() : null;
			var smileyPerso2 = (tmp = profilContent.match(/<img src=\"(http:\/\/forum-images\.hardware\.fr\/images\/perso\/2\/.*\.gif)\".*\/>/)) != null ? tmp.pop() : null;
			var smileyPerso3 = (tmp = profilContent.match(/<img src=\"(http:\/\/forum-images\.hardware\.fr\/images\/perso\/3\/.*\.gif)\".*\/>/)) != null ? tmp.pop() : null;
			var smileyPerso4 = (tmp = profilContent.match(/<img src=\"(http:\/\/forum-images\.hardware\.fr\/images\/perso\/4\/.*\.gif)\".*\/>/)) != null ? tmp.pop() : null;
			var smileyPerso5 = (tmp = profilContent.match(/<img src=\"(http:\/\/forum-images\.hardware\.fr\/images\/perso\/5\/.*\.gif)\".*\/>/)) != null ? tmp.pop() : null;
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
				if (dateNaissance.substring(3,5)-1 == new Date().getMonth() && dateNaissance.substring(0,2) == new Date().getDate())
				{
					age = '<span style="color: red;font-weight: bold">' + age + '</span>&nbsp;<img style="vertical-align: bottom;" alt="gateau" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAI2SURBVDjLhVPfa1JRHPepnnrrT%2FAl6KG%2FYG9RD0EPFXsJCkaMHjMKIamVNQhqQW3LFqtZq9Yg1KXVcBhdZ9ZDgyblT9y8Z1fdvXo3Ua9D1E%2Fne6c3bUIHPtxzPr%2B%2B5164JgCmDsJ%2B0%2FFI2BTu5v6n9xgSEZNWLh0BN9r6FfTTewyx1f3QqsOIre5r9ZvY0aM%2Fd%2FU9Be%2BWHiO4PIg5n70mCEIizgM0MRQ4W%2BBn93PPOJY%2Bn8H4G6vUU8BFM8fYtL8I17ctTH7IQ9M0GBP5s1AowP5WguOjjIsTSYUyRsFXweNkjOHJooL5oIoJrwJazve7E2c8o%2Fr52ksJDxc2YZlKgzJGQVAINPjC6y8qN8jwr5T0wJ35LByfZNx4JelnhyuPq9MMroCMZWFxxygICb5WvV7Hv%2Bv6rIRH3k1YXzCDazabkGUZye%2B2hlHAVizNRDwKeo3Oohs53DlYnzEsCEWdU1UV8dhv5NM%2BKOFDfwu2QgcatcxtpJJR%2FWPlcjkwcQ0bG0wHFSuKgvW1FEqZpyAvZYyC7MjhVmFmGJXUXShMQEmcRU0cNaCJ97HN5lAV70FL2UFeyhgFRe%2FBhvzgHCTLKSiTQ9j2XkLlh003E2hPHGnkIS9lul9hp5a5hVLgCpSpC8jaBiEOncD66aM6aE8caeQhL2W6C5zlXye5cLPn6n3BPeSlTHeBmWOMo1aOHEMlfh5a%2BjI3j%2BigPXGkkaftNe%2F5Fzg5wGHjcHMkOKptJNocaQPdmT%2FbXw90YXDpsgAAAABJRU5ErkJggg%3D%3D" />';
				}
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
			if (smileyPerso != null) container.innerHTML += '<br /><img style="vertical-align: middle; padding: 3px;" src="' + smileyPerso + '" alt="' + pseudoValue + '" />';
			if (smileyPerso1 != null) container.innerHTML += '<img style="vertical-align: middle; padding: 3px;" src="' + smileyPerso1 + '" alt="' + pseudoValue + ':1" />';
			if (smileyPerso2 != null) container.innerHTML += '<img style="vertical-align: middle; padding: 3px;" src="' + smileyPerso2 + '" alt="' + pseudoValue + ':2" />';
			if (smileyPerso3 != null) container.innerHTML += '<br /><img style="vertical-align: middle; padding: 3px;" src="' + smileyPerso3 + '" alt="' + pseudoValue + ':3" />';
			if (smileyPerso4 != null) container.innerHTML += '<img style="vertical-align: middle; padding: 3px;" src="' + smileyPerso4 + '" alt="' + pseudoValue + ':4" />';
			if (smileyPerso5 != null) container.innerHTML += '<img style="vertical-align: middle; padding: 3px;" src="' + smileyPerso5 + '" alt="' + pseudoValue + ':5" />';
			
			setTimeout(function()
			{
				if (cancel) return;
				document.getElementById('infos_membre').style.display = 'block';
			}
			, 500);
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

	pseudo.addEventListener('mouseout', function(event)
	{
		cancel = true;
		if (document.getElementById('infos_membre')) document.getElementById('infos_membre').style.display = 'none';
	}
	, false);
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
					else if (req.status == 404)
					{
						if (responseHandler != null) responseHandler(null);
					}
					else
					{
						alert("There was a problem retrieving the XML data:\n" +
						req.statusText);
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

		var currentVersion = GM_getValue('currentVersion', '0.2.5c');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.2.5c', currentVersion))
		{
			GM_setValue('currentVersion', '0.2.5c');
			currentVersion = '0.2.5c';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.2.5c'))
		{
			GM_registerMenuCommand("[HFR] Informations rapides sur le profil -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'infos_profil_hfr_v3.user.js');
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
							GM_openInTab(mirrorUrl + 'infos_profil_hfr_v3.user.js');
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