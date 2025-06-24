// ==UserScript==
// @name [HFR] Suppression rapide de mps
// @version 0.2.3.3
// @namespace http://toyonos.info
// @description Permet de supprimer un mp donné via un bouton dans la liste des mps et dans le mp lui-même
// @include  https://forum.hardware.fr/forum*cat=prive*
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
// 0.2.3.3 (24/06/2025) :
// - désactivation du module d'auto-update (service mort)
// 0.2.3.2 (10/12/2017) :
// - commentage des alert XML
// 0.2.3.1 (03/12/2017) :
// - passage au https


// Menu pour selectionner l'url de l'image
GM_registerMenuCommand("[HFR] Suppression rapide de mps -> Url de l'image", function()
{
	var imgUrl = prompt("Url de l'image ?", getCurrentImgUrl());
	if (!imgUrl) return;
	GM_setValue('hfr_srmp_imgUrl', imgUrl);		
}
);

var getCurrentImgUrl = function()
{
	return GM_getValue('hfr_srmp_imgUrl', 'https://forum-images.hardware.fr/images/perso/damnbloodyseagull.gif');	
}


var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var generateImg = function (idMp, hashCheck, action)
{
	var newImg = document.createElement('img');
	newImg.src = getCurrentImgUrl();
	newImg.alt = newImg.title = 'Supprimer ce MP';
	newImg.style.cursor = 'pointer';
	newImg.addEventListener('click', function()
	{
		if (confirm('Supprimer ce MP ?'))
		{
			var url = 'https://forum.hardware.fr/modo/manageaction.php?config=hfr.inc&cat=prive&type_page=forum1&moderation=0';
			var arguments = 'action_reaction=valid_eff_prive&topic1=' + idMp + '&hash_check=' + hashCheck;
			toyoAjaxLib.loadDoc(url, 'post', arguments, action);
		}
	}
	, false);
	return newImg;
}

var root = document.getElementById('mesdiscussions');
var tr = null;

// Icônes dans la page qui liste les MPs
tr = getElementByXpath('//table//tr[@class="cBackHeader fondForum1Subcat"]', root);
if (tr.length > 0)
{
	var th = tr.pop().firstChild;
	th.setAttribute('colspan', parseInt(th.getAttribute('colspan')) + 1);
}

tr = getElementByXpath('//table//tr[@class="cBackHeader fondForum1PagesHaut"]', root);
if (tr.length > 0)
{
	var th = tr.pop().firstChild;
	th.setAttribute('colspan', parseInt(th.getAttribute('colspan')) + 1);
}

tr = getElementByXpath('//table//tr[@class="cBackHeader fondForum1PagesBas"]', root);
if (tr.length > 0)
{
	var th = tr.pop().firstChild;
	th.setAttribute('colspan', parseInt(th.getAttribute('colspan')) + 1);
}

tr = getElementByXpath('//table//tr[@class="cBackHeader fondForum1Description"]', root);
if (tr.length > 0)
{
	tr = tr.pop();
	var newTh = document.createElement('th');
	newTh.setAttribute('scope', 'col');
	newTh.innerHTML = '&nbsp;&nbsp;&nbsp;';
	tr.insertBefore(newTh, tr.firstChild);
}

getElementByXpath('//table//tr[starts-with(@class, "sujet ligne_booleen")]', root).forEach(function(tr)
{
	var newTd = document.createElement('td');
	var idMp = getElementByXpath('.//td//input[@type="checkbox"]', tr).pop().value;
	var hashCheck = getElementByXpath('//input[@name="hash_check"]', document).pop().value;
	var newImg = generateImg(idMp, hashCheck, function ()
	{
		tr.style.display = 'none';
	}
	);
	newTd.appendChild(newImg);
	tr.insertBefore(newTd, tr.firstChild.nextSibling.nextSibling);
}
);

// Icône dans la page de détail d'un MP
var div = getElementByXpath('//table//tr[@class="cBackHeader fondForum2Fonctions"]//div[@class="right"]', root);
if (div.length > 0)
{
	div = div.pop();
	var idMp = getElementByXpath('//table//tr[@class="cBackHeader fondForum2Fonctions"]//form//input[@name="post"]', root).pop().value;
	var hashCheck = getElementByXpath('//input[@name="hash_check"]', document).pop().value;
	var newImg = generateImg(idMp, hashCheck, function ()
	{
		document.location = 'https://forum.hardware.fr/forum1.php?config=hfr.inc&cat=prive';
	}
	);
	div.insertBefore(newImg, div.firstChild);
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

		var currentVersion = GM_getValue('currentVersion', '0.2.3');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.2.3', currentVersion))
		{
			GM_setValue('currentVersion', '0.2.3');
			currentVersion = '0.2.3';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.2.3'))
		{
			GM_registerMenuCommand("[HFR] Suppression rapide de mps -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'hfr_suppression_rapide_mps.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Suppression rapide de mps');
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
						if (confirm('Une nouvelle version de [HFR] Suppression rapide de mps est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'hfr_suppression_rapide_mps.user.js');
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
})//.check4Update();
