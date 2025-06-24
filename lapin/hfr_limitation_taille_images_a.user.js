// ==UserScript==
// @name [HFR] Limitation de la taille des images
// @version 0.2.5a.2
// @namespace http://toyonos.info
// @description Permet de limiter la taille des images dans les posts et de leur rendre leur taille d'origine par un clic ou un double clic
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
// 0.2.5a.2 (24/06/2025) :
// - désactivation du module d'auto-update (service mort)
// 0.2.5a.1 (03/12/2017) :
// - passage au https


({
	getElementByXpath : function (path, element)
	{
		var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		for (;item = xpr.iterateNext();) arr.push(item);
		return arr;
	},
	
	get currentWidthSize()
	{
		return GM_getValue('hfr_lti_maxSize', 1000);    
	},
	
	get currentHeightSize()
	{
		return GM_getValue('hfr_lti_maxYSize', 0);    
	},
	
	setWidthMaxSize : function()
	{
		var maxSize = prompt("Largeur maximale des images ?", this.currentWidthSize);
		if (!maxSize) return;
		GM_setValue('hfr_lti_maxSize', maxSize);    
	},
	
	setHeightMaxSize : function()
	{
		var maxSize = prompt("Hauteur maximale des images ? [-1 : désactivée | 0 : automatique | x : taille personnalisée", this.currentHeightSize);
		if (!maxSize) return;
		GM_setValue('hfr_lti_maxYSize', maxSize);    
	},
 
	launch : function ()
	{
		// Menu pour sélectionner la taille maximale de l'image
		var ltiScript = this;
		GM_registerMenuCommand("[HFR] Limitation de la taille des images -> Largeur maximale", function () { ltiScript.setWidthMaxSize(); });
		GM_registerMenuCommand("[HFR] Limitation de la taille des images -> Hauteur maximale", function () { ltiScript.setHeightMaxSize(); });
	
		var root = document.getElementById('mesdiscussions');
		ltiScript.getElementByXpath('//table//td[@class="messCase2"]//div[starts-with(@id, "para" )]//img', root).forEach(function (img)
		{
			var timer = setInterval(function()
			{
				if (!img.complete) return;
				clearInterval(timer);        
				if (img.width > ltiScript.currentWidthSize || (ltiScript.currentHeightSize == '0' && img.height > window.innerHeight - 20) || (ltiScript.currentHeightSize > 0 && img.height > ltiScript.currentHeightSize))
				{
					img.style.maxWidth = ltiScript.currentWidthSize + 'px';
					if (ltiScript.currentHeightSize != '-1')
					{
						img.style.maxHeight = ltiScript.currentHeightSize == '0' ? window.innerHeight - 20 + 'px' : ltiScript.currentHeightSize + 'px';
					}
 
					if (img.parentNode.nodeName.toLowerCase() == 'a')
					{
						var timerCursor;
						var currentCursor = '-moz-zoom-in';
						img.addEventListener('mouseover', function()
						{
							timerCursor = setInterval(function () { img.style.cursor = img.style.cursor == 'pointer' ? currentCursor : 'pointer'; }, 500);
						}
						, false);
						img.addEventListener('mouseout', function() { clearInterval(timerCursor); }, false);
						
						var saveUrl = img.parentNode.href;
						img.parentNode.removeAttribute('href');
						var timerClick;
						var firstClickTime = null;
						var delay = 300;
						img.addEventListener('click', function(event)
						{
							if (firstClickTime != null && new Date().getTime() - firstClickTime < delay)
							{
								clearTimeout(timerClick);
								firstClickTime = null;
								this.style.maxWidth = this.style.maxWidth != '' ? '' : ltiScript.currentWidthSize + 'px';
								if (ltiScript.currentHeightSize != '-1')
								{
									this.style.maxHeight = this.style.maxHeight != '' ? '' : (ltiScript.currentHeightSize == '0' ? window.innerHeight - 20 + 'px' : ltiScript.currentHeightSize + 'px');
								}
								currentCursor = currentCursor == '-moz-zoom-in' ? '-moz-zoom-out' : '-moz-zoom-in';
							}
							else
							{
								firstClickTime = new Date().getTime();
								timerClick = setTimeout(function()
								{
									window.open(saveUrl);
								}
								, delay);
							}
						}
						, false);
					}
					else
					{
						img.style.cursor = '-moz-zoom-in';
						img.addEventListener('click', function()
						{
							this.style.maxWidth = this.style.maxWidth != '' ? '' : ltiScript.currentWidthSize + 'px';
							if (ltiScript.currentHeightSize != '-1')
							{
								this.style.maxHeight = this.style.maxHeight != '' ? '' : (ltiScript.currentHeightSize == '0' ? window.innerHeight - 20 + 'px' : ltiScript.currentHeightSize + 'px');
							}
							this.style.cursor = this.style.cursor == '-moz-zoom-in' ? '-moz-zoom-out' : '-moz-zoom-in';
						}
						, false);
					}
				}
			}
			, 250);
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

		var currentVersion = GM_getValue('currentVersion', '0.2.5a');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.2.5a', currentVersion))
		{
			GM_setValue('currentVersion', '0.2.5a');
			currentVersion = '0.2.5a';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.2.5a'))
		{
			GM_registerMenuCommand("[HFR] Limitation de la taille des images -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'hfr_limitation_taille_images_a.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Limitation de la taille des images');
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
						if (confirm('Une nouvelle version de [HFR] Limitation de la taille des images est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'hfr_limitation_taille_images_a.user.js');
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
