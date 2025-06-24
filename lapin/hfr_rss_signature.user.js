// ==UserScript==
// @name [HFR] RSS Signature
// @version 0.1.3.3
// @namespace http://toyonos.info
// @description Permet d'avoir une signature dynamique qui reprend le dernier élément d'un flux RSS
// @include https://forum.hardware.fr/*
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
// @connect url.super-h.fr
// ==/UserScript==


// historique modifs r21 :
// 0.1.3.3 (25/04/2023) :
// - nouveau service de compactage d'URL (hébergé par LibreArbitre)
// - désactivation du module d'auto update de toyo (service mort)
// 0.1.3.2 (10/12/2017) :
// - commentage des alert XML
// 0.1.3.1 (03/12/2017) :
// - passage au https


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
				else req.send();
			}
		}
	}

	function processReqChange(req, responseHandler)
	{
		return function()
		{
			try
			{
				// only if req shows "loaded"
				if (req.readyState == 4)
				{
					// only if "OK"
					if (req.status == 200)
					{
						var content = req.responseXML != null && req.responseXML.documentElement != null ? req.responseXML.documentElement : req.responseText;
						if (responseHandler != null) responseHandler(content);
					}
					else
					{
						//alert("There was a problem retrieving the XML data:\n" +
						//req.statusText);
					}
				}
			}
			catch (e) {}
		}
	}

	// Public members

	return {
		"loadDoc": function(url, method, arguments, responseHandler)
		{
			try
			{
				loadPage(url, method, arguments, responseHandler);
			}
			catch (e)
			{
				var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
				alert("Unable to get data:\n" + msg);
				return;
			}
		}
	};
})();

var getElementByXpath = function(path, element)
{
	var arr = Array(),
		xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (; item = xpr.iterateNext();) arr.push(item);
	return arr;
};

var rssSignature = {
	signatureSize: 255,

	rssPattern: '###LAST_ENTRY###',

	get signatureTemplate()
	{
		return GM_getValue('signature_template', null);
	},

	get updateInterval()
	{
		return GM_getValue('update_interval', 86400000);
	},

	get lastUpdate()
	{
		return GM_getValue('last_update', 0);
	},

	get rssFeed()
	{
		return GM_getValue('rss_feed', null);
	},

	reduceUrl: function(url, cbf)
	{
		GM_xmlhttpRequest({
			method: "GET",
			url: 'https://url.super-h.fr/short.php?token=57fe85b7-3761-4ad4-b4fe-4867d0c6d6ff&url=' + encodeURIComponent(url),
			onload: function(response)
			{
				let newUrl = url;
				if (response.status == 200)
				{
					var respJson = JSON.parse(response.responseText);
					newUrl = respJson.short_url ? "https://url.super-h.fr/" + respJson.short_url : url;
				}
				cbf(newUrl);
			}
		});
	},

	retrieveLastEntry: function(cbf)
	{
		var self = this;
		var rssFeed = this.rssFeed;

		GM_xmlhttpRequest({
			method: "GET",
			url: rssFeed,
			onload: function(response)
			{
				var root = new DOMParser().parseFromString(response.responseText, 'text/xml').documentElement;
				// Test avec item
				var items = root.getElementsByTagName('item');
				if (items.length > 0)
				{
					var title = items[0].getElementsByTagName('title').item(0).firstChild.nodeValue;
					title = title.replace(new RegExp("[\r\n]", "g"), " ");
					var url = items[0].getElementsByTagName('link').item(0).firstChild.nodeValue;
					self.reduceUrl(url, function(newUrl)
					{
						cbf({
							title: title,
							url: newUrl
						});
					});
				}
				else
				{
					// Test avec entry
					var items = root.getElementsByTagName('entry');
					if (items.length > 0)
					{
						var title = items[0].getElementsByTagName('title').item(0).firstChild.nodeValue;
						title = title.replace(new RegExp("[\r\n]", "g"), " ");
						var linkNode = items[0].getElementsByTagName('link').item(0);
						var url = linkNode.firstChild ? linkNode.firstChild.nodeValue : linkNode.getAttribute('href');
						self.reduceUrl(url, function(newUrl)
						{
							cbf({
								title: title,
								url: newUrl
							});
						});
					}
				}
			}
		});
	},

	retrieveSignature: function(cbf)
	{
		var signature = this.signatureTemplate;
		if (signature == null)
		{
			toyoAjaxLib.loadDoc('https://forum.hardware.fr/user/editprofil.php', 'get', 'config=hfr.inc&page=2', function(pageContent)
			{
				var contentNode = document.createElement('div');
				contentNode.innerHTML = pageContent;
				signature = getElementByXpath('.//textarea[@id="signature"]', contentNode).pop().innerHTML;
				GM_setValue('signature_template', signature);
				cbf(signature);
			});
		}
		else cbf(signature);
	},

	insertGmMenuCommands: function()
	{
		var self = this;

		GM_registerMenuCommand("[HFR] RSS Signature -> Template de la signature", function()
		{
			var param = prompt("Template de la signature ? (Pattern = " + self.rssPattern + ")", self.signatureTemplate);
			if (param == null) return;
			GM_setValue('signature_template', param);
		});

		GM_registerMenuCommand("[HFR] RSS Signature -> Intervalle d'update", function()
		{
			var param = prompt("Intervalle d'update (en heures)", self.updateInterval / 3600000);
			if (param == null) return;
			GM_setValue('update_interval', param * 3600000);
		});

		GM_registerMenuCommand("[HFR] RSS Signature -> Url du flux RSS", function()
		{
			var param = prompt("Url du flux RSS ?", self.rssFeed);
			if (param == null) return;
			GM_setValue('rss_feed', param);
		});

		GM_registerMenuCommand("[HFR] RSS Signature -> Forcer la mise à jour", function()
		{
			GM_setValue('last_update', '0');
			self.updateSignature(self.signatureTemplate);
		});
	},

	updateSignature: function(signature)
	{
		var self = this;

		// Le pattern n'apparait pas dans la signature, on arrête là.
		if (signature.indexOf(self.rssPattern) == -1) return;

		// On récupère le hash_check
		var tmp = getElementByXpath('//input[@name="hash_check"]', document);
		var hashCheck = tmp.length > 0 ? tmp.pop().value : null;
		if (hashCheck == null) return;

		// Si l'intervale de mise à jour est dépassé...
		if ((new Date().getTime() - self.lastUpdate) > self.updateInterval)
		{
			GM_setValue('last_update', new Date().getTime() + '');
			var freeSize = self.signatureSize - signature.length + self.rssPattern.length;
			var entry = self.retrieveLastEntry(function(entry)
			{
				// Il faut un minimum de place : BB Code + url + 10 caractères mini pour le titre
				if (freeSize >= (12 + entry.url.length + 10))
				{
					var bbCode = '[url=' + entry.url + ']'
					bbCode += freeSize >= (12 + entry.url.length + entry.title.length) ? entry.title : entry.title.substr(0, (freeSize - 12 - entry.url.length - 3)) + '...';
					bbCode += '[/url]';
					signature = signature.replace(self.rssPattern, bbCode);

					toyoAjaxLib.loadDoc('https://forum.hardware.fr/user/editprofil.php', 'get', 'config=hfr.inc&page=2', function(pageContent)
					{
						var contentNode = document.createElement('div');
						contentNode.innerHTML = pageContent;

						var args = 'page=2&signature=' + encodeURIComponent(signature) + '&hash_check=' + hashCheck;
						args += '&citation=' + encodeURIComponent(getElementByXpath('.//input[@name="citation"]', contentNode).pop().value);
						args += '&active_signature=' + encodeURIComponent(getElementByXpath('.//select[@name="active_signature"]', contentNode).pop().value);
						args += '&configuration=' + encodeURIComponent(getElementByXpath('.//textarea[@name="configuration"]', contentNode).pop().innerHTML);
						toyoAjaxLib.loadDoc('https://forum.hardware.fr/user/editprofil_validation.php?config=hfr.inc', 'post', args, null);
					});
				}
			});
		}
	},

	launch: function()
	{
		var self = this;
		if (!document.getElementById('mesdiscussions')) return;

		self.retrieveSignature(function(signature)
		{
			self.insertGmMenuCommands();
			self.updateSignature(signature);
		});
	}
}

rssSignature.launch();

// ============ Module d'auto update du script ============
({
	check4Update: function()
	{
		var autoUpdate = this;
		var mirrorUrl = GM_getValue('mirrorUrl', 'null');
		if (mirrorUrl == 'null') autoUpdate.retrieveMirrorUrl();

		var currentVersion = GM_getValue('currentVersion', '0.1.3');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.1.3', currentVersion))
		{
			GM_setValue('currentVersion', '0.1.3');
			currentVersion = '0.1.3';
		}
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.1.3'))
		{
			GM_registerMenuCommand("[HFR] RSS Signature -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'hfr_rss_signature.user.js');
			});
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] RSS Signature');
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
						if (confirm('Une nouvelle version de [HFR] RSS Signature est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'hfr_rss_signature.user.js');
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

	max: function(v1, v2)
	{
		var tabV1 = v1.split('.');
		var tabV2 = v2.split('.');

		if (isNaN(tabV1[2].substring(tabV1[2].length - 1))) tabV1[2] = tabV1[2].substring(0, tabV1[2].length - 1);
		if (isNaN(tabV2[2].substring(tabV2[2].length - 1))) tabV2[2] = tabV2[2].substring(0, tabV2[2].length - 1);

		if ((tabV1[0] > tabV2[0]) ||
			(tabV1[0] == tabV2[0] && tabV1[1] > tabV2[1]) ||
			(tabV1[0] == tabV2[0] && tabV1[1] == tabV2[1] && tabV1[2] > tabV2[2]))
		{
			return v1;
		}
		else
		{
			return v2;
		}
	},

	isLater: function(v1, v2)
	{
		return v1 != v2 && this.max(v1, v2) == v1;
	},

	retrieveMirrorUrl: function()
	{
		var mirrors = 'http://hfr.toyonos.info/gm/;http://hfr-mirror.toyonos.info/gm/'.split(';');
		var checkMirror = function(i)
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
