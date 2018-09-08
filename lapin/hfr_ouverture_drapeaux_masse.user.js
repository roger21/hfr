// ==UserScript==
// @name [HFR] Ouverture de drapeaux en masse
// @version 0.2.5.2
// @namespace http://toyonos.info
// @description Permet d'ouvrir ses drapeaux dans de nouveaux onglets pour une catégorie donnée
// @include https://forum.hardware.fr/forum1f.php*
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
// 0.2.5.2 (10/12/2017) :
// - commentage des alert XML
// 0.2.5.1 (03/12/2017) :
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

/******************************************************************/

({
	getElementByXpath : function (path, element)
	{
		var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		for (;item = xpr.iterateNext();) arr.push(item);
		return arr;
	},
	
	get tabsNumber()
	{
		return GM_getValue('hfr_odm_tabsNumber', 10);	
	},
	
	get imgUrl()
	{
		return GM_getValue('hfr_odm_imgUrl', '');	
	},
	
	get imgUrl2()
	{
		return GM_getValue('hfr_odm_imgUrl2', '');	
	},
	
	get refreshLocation()
	{
		return GM_getValue('hfr_odm_refreshLocation', 'true');	
	},

	setTabsNumber : function()
	{
		var tabsNumber = prompt("Nombre de drapeaux à ouvrir dans des onglets ?", this.tabsNumber);
		if (!tabsNumber || tabsNumber.match(/^([0-9]+)$/) == null) return;
		GM_setValue('hfr_odm_tabsNumber', tabsNumber);	
	},
	
	setImgUrl : function()
	{
		var imgUrl = prompt("Url de l'image ? (vide = image par défault)", this.imgUrl);
		if (imgUrl == null) imgUrl = '';
		GM_setValue('hfr_odm_imgUrl', imgUrl);	
	},
	
	setImgUrl2 : function()
	{
		var imgUrl = prompt("Url de l'image  - pour tous les drapeaux ? (vide = image par défault)", this.imgUrl2);
		if (imgUrl == null) imgUrl = '';
		GM_setValue('hfr_odm_imgUrl2', imgUrl);	
	},
	
	setRefreshLocation : function()
	{
		var refreshLocation = prompt("Auto-rafraîchissement de la page après une ouverture d'onglets ?", this.refreshLocation);
		if (refreshLocation != 'true' && refreshLocation != 'false') return;
		GM_setValue('hfr_odm_refreshLocation', refreshLocation);	
	},

	launch : function ()
	{
		var self = this;
		var root = document.getElementById('mesdiscussions');
		
		GM_registerMenuCommand("[HFR] Ouverture de drapeaux en masse -> Nombre de drapeaux", function () { self.setTabsNumber(); });
		GM_registerMenuCommand("[HFR] Ouverture de drapeaux en masse -> Url de l'image (vide = image par défault)", function () { self.setImgUrl(); });
		GM_registerMenuCommand("[HFR] Ouverture de drapeaux en masse -> Url de l'image - pour tous les drapeaux (vide = image par défault)", function () { self.setImgUrl2(); });
		GM_registerMenuCommand("[HFR] Ouverture de drapeaux en masse -> Auto-rafraîchissement de la page", function () { self.setRefreshLocation(); });

		// Bouton pour ouvrir des onglets quelque soit la catégorie
		self.getElementByXpath('.//table[@class="main"]//tr[@class="cBackHeader fondForum1Description"]', root).forEach(function (tr)
		{
			if (self.getElementByXpath('.//td[@class="sujetCase5"]//a', root).length == 0) return;
			
			var newImg = document.createElement('img');
			newImg.style.cursor = 'pointer';
			newImg.src = self.imgUrl2 == '' ? "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%01zIDAT8%CB%C5%93%3BKCA%10%85%BF%7D%60%A7B%0C%88OD%10%0C%A2A%14%14%5B%B1%10%AD%FC%07%B7U%1B%3B%C1ZHc%A5%B1%92%A4%D7%C6%07%A4%F0%81%88!%04lb4vJH%400%9A%22%A40%24%5C%D7%E2%EAM%7Ca%C0%C2%03%CB%CC%2C%3Bgv%CE%EE%08c%0C%7F%81%E4%8F%F8%7F%02%0D%10%0E%87'%81U%60%AC%CE%BC%3B%60%C9%B2%AC%7D%FD%B6%B1%EE%F7%FB%7C%AD%AD%5E%00%84%00%10o~%D5%3A%BE%E0%F11%DF%7Bqq%19%04%5C%02%AF%C7%D3L%26%F3%40%A5b%3B%BDI%E9%26%09!%DCXkMGG%0B%80%D7m%C1%81%40)%85m%1B%F7p-I%95%40!%A5%FA%A8%C1%7BE%A54Z%F3!%E1%B3UJ%22%84%FCJ%20%84D)%891%FA%DB%EA%89L%8C%CBl%8C%E2s%81r%A5%8CWvk%B0%10%A1P%C8%F4%F4t144%E0%8AW%15%CC%89O%12%07%A4%9E%A2%8C%F8F%E9%F4%F4q%9A%DA%25~%7DNS%B1%DF%B9A%3A%9D%25%9D%CE%FE%F8fg%B9m%E6f%A6%B1%A5%8D%BFm%8A%E3%9B%1D%C6%07'%D8%D9%8B%801%E6%D75%BB2l%22%D7%5B%A6%16%FB%C9%A0%19%5Bh3u%FD%C4%7C!WJ%DD%C7%08%1CY%00%04%0E-nsI%80R%5D%04%2F%E6e-%9E%8C%D1%80%E6%E0j%93%06%A1%89%26%CE%00%82%A2%DEq%1E_l%0F%00%F3%40%23P%046%E3%1B%F7%CB%AF%8B%01%99%B4%80.%0Fr%00%00%00%00IEND%AEB%60%82" : self.imgUrl2;
			newImg.alt = 'icone';
			newImg.title = 'Ouvrir les ' + self.tabsNumber + ' premiers drapeaux toutes catégories confondues dans de nouveaux onglets';
			newImg.addEventListener('click', function(event)
			{
				var tabsLeft = self.tabsNumber;
				self.getElementByXpath('.//td[@class="sujetCase5"]//a', root).forEach(function (flag)
				{
					if (tabsLeft-- <= 0) return;
					GM_openInTab(flag.href);
				}
				);
				if (self.refreshLocation != 'false') setTimeout(function(){ document.location = document.location; }, 1000);
			}
			, false);
			tr.firstChild.innerHTML = '';
			tr.firstChild.appendChild(newImg);
		});		
		
		// Boutons pour ouvrir des onglets par catégorie
		self.getElementByXpath('.//table[@class="main"]//th[@class="padding"]', root).forEach(function (th)
		{
			var currentCat = th.firstChild.nextSibling.href.match(/cat=([0-9]+)&/).pop();
			if (self.getElementByXpath('.//td[@class="sujetCase5"]//a[contains(@href, "&cat=' + currentCat + '&")]', root).length == 0) return;
			
			var newImg = document.createElement('img');
			newImg.style.cursor = 'pointer';
			newImg.style.cssFloat = 'left';
			newImg.style.marginTop = '-2px';
			newImg.style.marginLeft = '3px';
			newImg.src = self.imgUrl == '' ? "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%01zIDAT8%CB%C5%93%3BKCA%10%85%BF%7D%60%A7B%0C%88OD%10%0C%A2A%14%14%5B%B1%10%AD%FC%07%B7U%1B%3B%C1ZHc%A5%B1%92%A4%D7%C6%07%A4%F0%81%88!%04lb4vJH%400%9A%22%A40%24%5C%D7%E2%EAM%7Ca%C0%C2%03%CB%CC%2C%3Bgv%CE%EE%08c%0C%7F%81%E4%8F%F8%7F%02%0D%10%0E%87'%81U%60%AC%CE%BC%3B%60%C9%B2%AC%7D%FD%B6%B1%EE%F7%FB%7C%AD%AD%5E%00%84%00%10o~%D5%3A%BE%E0%F11%DF%7Bqq%19%04%5C%02%AF%C7%D3L%26%F3%40%A5b%3B%BDI%E9%26%09!%DCXkMGG%0B%80%D7m%C1%81%40)%85m%1B%F7p-I%95%40!%A5%FA%A8%C1%7BE%A54Z%F3!%E1%B3UJ%22%84%FCJ%20%84D)%891%FA%DB%EA%89L%8C%CBl%8C%E2s%81r%A5%8CWvk%B0%10%A1P%C8%F4%F4t144%E0%8AW%15%CC%89O%12%07%A4%9E%A2%8C%F8F%E9%F4%F4q%9A%DA%25~%7DNS%B1%DF%B9A%3A%9D%25%9D%CE%FE%F8fg%B9m%E6f%A6%B1%A5%8D%BFm%8A%E3%9B%1D%C6%07'%D8%D9%8B%801%E6%D75%BB2l%22%D7%5B%A6%16%FB%C9%A0%19%5Bh3u%FD%C4%7C!WJ%DD%C7%08%1CY%00%04%0E-nsI%80R%5D%04%2F%E6e-%9E%8C%D1%80%E6%E0j%93%06%A1%89%26%CE%00%82%A2%DEq%1E_l%0F%00%F3%40%23P%046%E3%1B%F7%CB%AF%8B%01%99%B4%80.%0Fr%00%00%00%00IEND%AEB%60%82" : self.imgUrl;
			newImg.alt = 'icone';
			newImg.title = 'Ouvrir les ' + self.tabsNumber + ' premiers drapeaux dans de nouveaux onglets';
			newImg.addEventListener('click', function(event)
			{
				var tabsLeft = self.tabsNumber;
				self.getElementByXpath('.//td[@class="sujetCase5"]//a[contains(@href, "&cat=' + currentCat + '&")]', root).forEach(function (flag)
				{
					if (tabsLeft-- <= 0) return;
					var post = flag.href.match(/post=([0-9]+)&/).pop();
					var openIt = !self.getElementByXpath('.//td[@class="sujetCase10"]//input[@value="' + post + '"]', root).pop().checked;
					if (openIt)
					{
						GM_openInTab(flag.href);
					}
				}
				);
				if (self.refreshLocation != 'false') setTimeout(function(){ document.location.reload(); }, 1000);
			}
			, false);
			th.insertBefore(newImg, th.firstChild);
		});
		
		// Boutons pour les MPs
		var url = 'https://forum.hardware.fr/forum1.php';
		var args = 'config=hfr.inc&cat=prive&page=1';
		toyoAjaxLib.loadDoc(url, 'get', args, function(pageContent)
		{		
			var dumpDiv = document.createElement('div');
			dumpDiv.style.display = 'none';
			document.body.appendChild(dumpDiv);
			dumpDiv.innerHTML = pageContent;
			var newMps = new Array();
			self.getElementByXpath('.//table//tr[starts-with(@class, "sujet ligne_booleen")]', dumpDiv).forEach(function(tr)
			{
				if (self.getElementByXpath('.//td[starts-with(@class, "sujetCase1")]//img[@alt="On"]', tr).length == 1)
				{
					newMps.push(self.getElementByXpath('.//td[starts-with(@class, "sujetCase9")]//a', tr).pop().href);
				}
			}
			);
			document.body.removeChild(dumpDiv);
			
			if (newMps.length >= 2)
			{
				self.getElementByXpath('.//div[@class="left"]//div[@class="left"]//a', document).forEach(function(a)
				{
					a.removeAttribute('href');
					a.style.cursor = 'pointer';
					a.addEventListener('click', function(event)
					{
						for (var i = 0; i < newMps.length; i++)
						{
							GM_openInTab(newMps[i]);
						}
						if (self.refreshLocation != 'false') document.location = document.location;
					}
					, false);
				}
				);
			}
		}
		);
	}
}).launch();

// ============ Module d'auto update du script ============
({
	check4Update : function()
	{
		var autoUpdate = this;
		var mirrorUrl = GM_getValue('mirrorUrl', 'null');
		if (mirrorUrl == 'null') autoUpdate.retrieveMirrorUrl();

		var currentVersion = GM_getValue('currentVersion', '0.2.5');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.2.5', currentVersion))
		{
			GM_setValue('currentVersion', '0.2.5');
			currentVersion = '0.2.5';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.2.5'))
		{
			GM_registerMenuCommand("[HFR] Ouverture de drapeaux en masse -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'hfr_ouverture_drapeaux_masse.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Ouverture de drapeaux en masse');
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
						if (confirm('Une nouvelle version de [HFR] Ouverture de drapeaux en masse est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'hfr_ouverture_drapeaux_masse.user.js');
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
