// ==UserScript==
// @name [HFR] Sleath Rehost
// @version 0.1.0
// @namespace http://toyonos.info
// @description Permet de remplacer le domaine hfr-rehost.net par un alias dans les liens et les images
// @include http://forum.hardware.fr/*
// @exclude http://forum.hardware.fr/message.php*
// ==/UserScript==

var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var cssManager = 
{
	cssContent : '',
	
	addCssProperties : function (properties)
	{
		cssManager.cssContent += properties;
	},
	
	insertStyle : function()
	{
		GM_addStyle(cssManager.cssContent);
		cssManager.cssContent = '';
	}
}

var sleathRehost =
{
	get currentAliasUrl()
	{
		return GM_getValue('sr_alias_url', 'hfr-rehost.net');
	},

	launch : function()
	{
		var thisScript = this;
		var prefix = 'http://hfr-rehost.net';
		Array.forEach(document.getElementsByTagName('img'), function(img)
		{
			if (img.src.substr(0, prefix.length) == prefix)
			{
				img.src = img.title = img.alt = 'http://' + thisScript.currentAliasUrl + img.src.substr(prefix.length);
			}
		}
		);
		
		Array.forEach(document.getElementsByTagName('a'), function(a)
		{
			if (a.href.substr(0, prefix.length) == prefix)
			{
				a.href = 'http://' + thisScript.currentAliasUrl + a.href.substr(prefix.length);
			}
		}
		);
	}
};

sleathRehost.launch();


// Script de création du menu de configuration
var cmScript =
{
	backgroundDiv : null,
	
	configDiv : null,
	
	timer : null,
	
	aliases : null,
	
	aliasesUrl : 'http://nazztazz.ovh.org/rehost.xml',
	
	thumbUrl : '/thumb/http://self/pic/ee3db761946b74326ab79ae177e9d17add96fdea.jpeg',
	
	retrieveAliasList : function (cbf)
	{		
		GM_xmlhttpRequest({
			method: "GET",
			url: cmScript.aliasesUrl,
			onload: function(response)
			{
				var aliasNodes = new DOMParser().parseFromString(response.responseText, 'text/xml').documentElement.getElementsByTagName('alias');
				cmScript.aliases = Array();
				Array.forEach(aliasNodes, function(aliasNode)
			  	{
					cmScript.aliases[aliasNode.getAttribute('name')] = aliasNode.getAttribute('domain');
				}
				);
				cbf();
			}
		});
		
	},	
	
	setDivsPosition : function ()
	{		
		cmScript.setBackgroundPosition();
		cmScript.setConfigWindowPosition();
	},
	
	setBackgroundPosition : function ()
	{				
		cmScript.backgroundDiv.style.width = document.documentElement.clientWidth + 'px';	
		cmScript.backgroundDiv.style.height = document.documentElement.clientHeight + 'px';
		cmScript.backgroundDiv.style.top = window.scrollY + 'px';
	},

	setConfigWindowPosition : function ()
	{
		cmScript.configDiv.style.left = (document.documentElement.clientWidth / 2) - (parseInt(cmScript.configDiv.style.width) / 2) + window.scrollX + 'px';
		cmScript.configDiv.style.top = (document.documentElement.clientHeight / 2) - (parseInt(cmScript.configDiv.clientHeight) / 2) + window.scrollY + 'px';
	},	
	
	disableKeys : function (event)
	{
		var key = event.which;
		if (key == 27)
		{
			clearInterval(cmScript.timer);
			cmScript.hideConfigWindow();
		}
		else if (key == 13) cmScript.validateConfig();
		else if (event.altKey || (event.target.nodeName.toLowerCase() != 'input' && key >= 33 && key <= 40)) event.preventDefault();
	},
	
	disableTabUp : function (elt)
	{
		elt.addEventListener('keydown', function(event)
		{
			var key = event.which;
			if (key == 9 && event.shiftKey) event.preventDefault();
		}
		, false);
	},
	
	disableTabDown : function (elt)
	{
		elt.addEventListener('keydown', function(event)
		{
			var key = event.which;
			if (key == 9 && !event.shiftKey) event.preventDefault();
		}
		, false);
	},
	
	disableScroll : function ()
	{
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', cmScript.disableKeys, false);
	},
	
	enableScroll : function ()
	{
		document.body.style.overflow = 'visible';
		window.removeEventListener('keydown', cmScript.disableKeys, false);
	},
	
	alterWindow : function (opening)
	{
		if (opening)
		{
			// On fige la fenêtre
			cmScript.disableScroll();
			// A chaque resize, repositionnement des divs
			window.addEventListener('resize', cmScript.setDivsPosition, false);
			// On cache les iframes de m%$!§
			getElementByXpath('//iframe', document.body).forEach(function(iframe){ iframe.style.visibility = 'hidden'; });		
		}
		else
		{
			cmScript.enableScroll();
			window.removeEventListener('resize', cmScript.setDivsPosition, false);
			getElementByXpath('//iframe', document.body).forEach(function(iframe){ iframe.style.visibility = 'visible'; });
		}
	},
	
	buildBackground : function ()
	{
		if (!document.getElementById('sr_back'))
		{
			cmScript.backgroundDiv = document.createElement("div");
			cmScript.backgroundDiv.id = 'sr_back';
			cmScript.backgroundDiv.addEventListener('click', function()
			{
				clearInterval(cmScript.timer);
				cmScript.hideConfigWindow();
			}
			, false);
			cssManager.addCssProperties("#sr_back { display: none; position: absolute; left: 0px; top: 0px; background-color: #242424; z-index: 1001;}");
			document.body.appendChild(cmScript.backgroundDiv);
		}
	},
	
	buildConfigWindow : function ()
	{
		if (!document.getElementById('sr_front'))
		{	
			cmScript.configDiv = document.createElement("div");
			cmScript.configDiv.id = 'sr_front';
			cmScript.configDiv.style.width = '300px'; 
			cssManager.addCssProperties("#sr_front { display: none; vertical-align: bottom; height: 110px; position: absolute; background-color: #F7F7F7; z-index: 1002; border: 1px dotted #000; padding: 8px; text-align: center; font-family: Verdana;}");
			cssManager.addCssProperties("#sr_front span { font-size: 0.8em;}");
			cssManager.addCssProperties("#sr_front select { border: 1px solid black; font-family: Verdana; font-size: 0.75em;}");
			cssManager.addCssProperties("#sr_front img { display: block; margin-top: 10px; margin-left: auto; margin-right: auto;}");
			cssManager.addCssProperties("#sr_front div { position: absolute; bottom: 8px; right: 8px;}");
			cssManager.addCssProperties("#sr_front input[type=image] { margin: 2px; }");
			
			var label = document.createElement('span');
			label.innerHTML = "Choix de l'alias : ";
			cmScript.configDiv.appendChild(label);
			cmScript.retrieveAliasList(function()
			{
				var aliasList = document.createElement('select');
				aliasList.id = 'sr_alias_url';
				aliasList.addEventListener('change', function()
				{
					this.nextSibling.src = 'http://' + this.value + cmScript.thumbUrl;
					this.nextSibling.alt = 'Alias indisponible';
					this.nextSibling.title = 'L\'alias est-il disponible ?';
				}
				, false);

				for (var name in cmScript.aliases)
				{
					var domain = cmScript.aliases[name];
					var alias = document.createElement('option');
					alias.value = domain;
					if (domain == sleathRehost.currentAliasUrl) alias.selected = 'selected';
					alias.innerHTML = name;
					aliasList.appendChild(alias);
				}
				cmScript.configDiv.insertBefore(aliasList, cmScript.configDiv.firstChild.nextSibling);
			}
			);
			
			var newImg = document.createElement('img');
			newImg.src = 'http://' + sleathRehost.currentAliasUrl + cmScript.thumbUrl;
			newImg.alt = 'Alias indisponible';
			newImg.title = 'L\'alias est-il disponible ?';
			cmScript.configDiv.appendChild(newImg);
			
			var buttonsContainer = document.createElement('div');
			var inputOk = document.createElement('input');
			inputOk.type = 'image';
			inputOk.src = 'http://www.izipik.com/images/20081007/gnndzom4alg0hqh7uh-accept.png';
			inputOk.alt = 'Valider';
			inputOk.addEventListener('click', cmScript.validateConfig, false);
			
			var inputCancel = document.createElement('input');
			inputCancel.type = 'image';
			inputCancel.src = 'http://www.izipik.com/images/20081007/klmnxxj9h2uqkjzjef-cross.png';
			inputCancel.alt = 'Annuler';
			inputCancel.addEventListener('click', cmScript.hideConfigWindow, false);
			cmScript.disableTabDown(inputCancel);
			
			buttonsContainer.appendChild(inputOk);
			buttonsContainer.appendChild(inputCancel);
			cmScript.configDiv.appendChild(buttonsContainer);

			document.body.appendChild(cmScript.configDiv);
		}
	},
	
	validateConfig : function()
	{
		getElementByXpath('.//*[starts-with(@id, "sr_")]', document.getElementById('sr_front')).forEach(function(input)
		{
			GM_setValue(input.id, input.value);
		}
		);
		cmScript.hideConfigWindow();	
	},
	
	initBackAndFront : function()
	{
		if (document.getElementById('sr_back'))
		{
			cmScript.setBackgroundPosition();
			cmScript.backgroundDiv.style.opacity = 0;
			cmScript.backgroundDiv.style.display = 'block';
		}
		
		if (document.getElementById('sr_front'))
		{
			document.getElementById('sr_alias_url').value = sleathRehost.currentAliasUrl;
		}
	},
	
	showConfigWindow : function ()
	{
		cmScript.alterWindow(true);
		cmScript.initBackAndFront();
		var opacity = 0;
		cmScript.timer = setInterval(function()
		{
			opacity = Math.round((opacity + 0.1) * 100) / 100;
			cmScript.backgroundDiv.style.opacity = opacity;
			if (opacity >= 0.8)
			{
				clearInterval(cmScript.timer);
				cmScript.configDiv.style.display = 'block';
				cmScript.setConfigWindowPosition();
			}
		}
		, 1);
	},
	
	hideConfigWindow : function ()
	{
		cmScript.configDiv.style.display = 'none';
		var opacity = cmScript.backgroundDiv.style.opacity;
		cmScript.timer = setInterval(function()
		{
			opacity = Math.round((opacity - 0.1) * 100) / 100;
			cmScript.backgroundDiv.style.opacity = opacity;
			if (opacity <= 0)
			{
				clearInterval(cmScript.timer);
				cmScript.backgroundDiv.style.display = 'none';
				cmScript.alterWindow(false);
			}
		}
		, 1);
	},
	
	setUp : function()
	{
		// On construit l'arrière plan
		cmScript.buildBackground();
		// On construit la fenêtre de config
		cmScript.buildConfigWindow();
		// On ajoute la css
		cssManager.insertStyle();
	},
	
	createConfigMenu : function ()
	{
		GM_registerMenuCommand("[HFR] Sleath Rehost -> Configuration", this.showConfigWindow);
	}
};

cmScript.setUp();
cmScript.createConfigMenu();

// ============ Module d'auto update du script ============
({
	check4Update : function()
	{
		var autoUpdate = this;
		var mirrorUrl = GM_getValue('mirrorUrl', 'null');
		if (mirrorUrl == 'null') autoUpdate.retrieveMirrorUrl();

		var currentVersion = GM_getValue('currentVersion', '0.1.0');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.1.0', currentVersion))
		{
			GM_setValue('currentVersion', '0.1.0');
			currentVersion = '0.1.0';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.1.0'))
		{
			GM_registerMenuCommand("[HFR] Sleath Rehost -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'hfr_sleath_rehost.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Sleath Rehost');
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
						if (confirm('Une nouvelle version de [HFR] Sleath Rehost est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'hfr_sleath_rehost.user.js');
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