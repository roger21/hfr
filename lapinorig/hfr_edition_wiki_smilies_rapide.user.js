// ==UserScript==
// @name [HFR] Edition rapide du Wiki smilies
// @version 0.1.4
// @namespace http://toyonos.info
// @description Permet de faire rapidement des modifications dans le wiki smilies via un double clic sur un smiley perso donné
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

({
	getElementByXpath : function (path, element)
	{
		var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		for (;item = xpr.iterateNext();) arr.push(item);
		return arr;
	},
	
	getKeyWords : function (code, cbf)
	{
		toyoAjaxLib.loadDoc('http://forum.hardware.fr/wikismilies.php', 'get', 'config=hfr.inc&detail=' + encodeURIComponent(code), function(pageContent)
		{
			var keyWords = pageContent.match(/name="keywords0"\s*value="(.*)"\s*onkeyup/).pop();
			cbf(keyWords);
		}
		);
	},

	launch : function ()
	{	
		var root = document.getElementById('mesdiscussions');
		var hashCheck = this.getElementByXpath('//input[@name="hash_check"]', document).pop().value;
		var thisScript = this;
		this.getElementByXpath('//table//td[@class="messCase2"]//div[starts-with(@id, "para" )]//img[starts-with(@src, "http://forum-images.hardware.fr/images/perso/" )]', root).forEach(function (img)
		{		
			// Mouseover (texte alternatif / titre)
			img.addEventListener('mouseover', function()
			{
				var currentImg = this;
				thisScript.getKeyWords(this.alt, function(keyWords)
				{
					currentImg.title = currentImg.alt + ' { ' + keyWords + ' }';
				}
				);
			}
			, false);
		
			// Double clic, le popup de modification
			var saveUrl = null
			// Smiley dans une url
			if (img.parentNode.nodeName.toLowerCase() == 'a')
			{
				saveUrl = img.parentNode.href;
				img.parentNode.removeAttribute('href');
				img.style.cursor = 'pointer';
			}
			var timer;
			var firstClickTime = null;
			var delay = 300;
			img.addEventListener('click', function(event)
			{
				if (firstClickTime != null && new Date().getTime() - firstClickTime < delay)
				{
					clearTimeout(timer);
					firstClickTime = null;
					// Création du popup de modification des mots-clés
					var theEvent = event;
					var theImg = this;
					thisScript.getKeyWords(this.alt, function(keyWords)
					{
						var newDiv;
						var width = 300;
						if (document.getElementById('edit_wiki_smilies'))
						{
							newDiv = document.getElementById('edit_wiki_smilies');
						}
						else
						{
							newDiv = document.createElement('div');
							newDiv.setAttribute('id', 'edit_wiki_smilies');
							newDiv.style.position = 'absolute';
							newDiv.style.border = '1px solid black';
							newDiv.style.background = "white";
							newDiv.style.zIndex = '1001';
							newDiv.className = 'signature';
							newDiv.style.textAlign = 'right';
							newDiv.style.width = width + 14 + 'px';
							newDiv.style.paddingBottom = '5px';
							
							var inputKeyWords = document.createElement('input');
							inputKeyWords.type = 'text';
							inputKeyWords.style.display = 'block';
							inputKeyWords.style.margin = '5px';
							inputKeyWords.style.fontSize = '1.1em';
							inputKeyWords.style.width = width + 'px';
							
							var inputOk = document.createElement('input');
							inputOk.type = 'image';
							inputOk.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%9FIDAT8%CB%A5%93%EBKSa%1C%C7%FD%3Bv%CEvl%03%09dD!%82%84P%7B%15%24%12%3B%9A%0D%C5%BC%2CK%D3%DD%BD%D26c%D8L%8B2r%5E%C6H)-%B3%D4jsNm%EA%D4%E6%D6%942q%D9QB%CC%BD%E9B%B5at%B1o%E7%EC%C5L%12%23z%E0%0B%0F%0F%CF%E7%F3%7B%AEq%00%E2%FE'%7F%0C%14%F8%0E%89r%A7%0F%EA%B3%3D)L%C6%E3%FDa%E9%888%2Cu%252Rg%A2%3E%DD%BEW%B4%AB%20%CF%9BJ%CB%3C%C9!%9DG%86%9BA%0B%FA%96%BB%A2%E9%5ClF%89%EB%18%24%BDTH%D2C%D1%3B%0A%D8%AAt%E6xR%E4%EA%9C%11%CE%D5~%D8%5E%5E%83i%AE2%1A%AE%EFX%EDC%E3L%15%0E%D8%F8%91d%1B%9F%DE%26%C8%F1%A4%083%DDI%EB%1C%CCM%AC%09%94%A1%C2_%02%CD%CC%19%E8%D8%94%B3%A9%F6%9D%85%FD%F5%3D%5C%9C%AA%80%D8B%AE%8B%AF%93%C2%98%40%E6N2%A8%C6%B2%A2%959%98%03U%DESPL%17B1U%00%F5T!%DCk%830x%95p%B0%92%DC%9E%23H%B8B%1Ab%82%8C%111%D3%19l%865%D8%84%0A_1%94O%E4%2C%98%0F%E5%24%1BO%3E%C6%DF%B8%C0%B5Pd%0Dm%CF%1Ba%9BkD%7C%3D%C9%C4%04G%ED%09%1B%0FVn%A36%A0%81%D6%5B%C4%AEd%00%8B%1F%E6%A1%9A(%C4%D8%DAP%14%FE%B1%F9%1Dm%CF.%C10Q%8C%BE%60'%04Fb%23%26%90%DC%A76%FA%97%BBa%F4%ABP%EB%D7%E2%D3%D7%8FQ%E8%FD%97%B71%D82%5B%0F%B5%2B%1Bz%F7i%F4%07%3B%20%A8%F9%5D%D0C17%E6%9B%D0%BEp%19%BAI9%CC%BEjD%BE%7D%8E%C2%9B%3F7ayz%01e%CE%2ChXAK%A0%0E%ED%5E3%A8*bk%0B%A9%B7%04%06%F9%40%1A%EC%2BwQ%3D!%87%DA%7D%12u%D3%E5Xz%B7%80%B6%D9%06%94%0E%1E%87%C2q%02%3Ag%0E%EC%AF%BA%91n%3D%0C%AA%92%D8%3A%C4d%2B_%B8%8F%BD%1A%B3G%83%87%CC%1DT%8E%E6A%3B%9C%03%D5%90%0CJ%07%17%0E%CE%C6%A3%A5.%18%87%8A!P%F3%D6)5!%DC%F6%90%12%9BH%3A%BE%81%88%98%DCep%B0%92%D6%80%19%FA%D1%22%9C%1B%96%A3%95%DD%82%9D%85%F5%CE%22%F0Ky%11%16%A6w%7C%CA%7B%1AH%9A2%11!i%87%04%ED~3z_X%D1%3Bo%85%C5kBZK*%04%0A%5E%88R%11%F4%AE%9F%89%3AO%8A(%03%A1%A7j%08F%A0%E5%85%05*%5E%98%AD%C8%B0%D1S%A5%84%E8%AF%BF%F1_%F3%0Bg%D0%AC%E5y%BA%D4c%00%00%00%00IEND%AEB%60%82";
							inputOk.style.marginRight = '6px';
							inputOk.addEventListener('click', function()
							{
								if (confirm('Modifier les mots clés de ce smiley ?'))
								{
									var smiley = this.parentNode.lastChild.value;
									var keyWords = this.parentNode.firstChild.value;
									var url = 'http://forum.hardware.fr/wikismilies.php?config=hfr.inc&option_wiki=0&withouttag=0';
									var arguments = 'modif0=1&smiley0='+ encodeURIComponent(smiley) +'&keywords0=' + encodeURIComponent(keyWords);
									arguments += '&hash_check=' + hashCheck;
									toyoAjaxLib.loadDoc(url, 'post', arguments, function (pageContent)
									{
										var newP = document.createElement('p');
										newP.style.fontSize = '0.85em';
										newP.style.paddingLeft = newP.style.paddingRight = '5px';
										newP.style.margin = '0px';
										newP.innerHTML = pageContent.match(/<div class="hop">([^þ]*)<\/div>/).pop();
										newDiv.insertBefore(newP, inputOk);
										newP.nextSibling.style.display = 'none';
										newP.nextSibling.nextSibling.style.display = 'none';
										newDiv.style.textAlign = 'justify';
										setTimeout(function()
										{
											newDiv.style.display = 'none';
											newDiv.style.textAlign = 'right';
											newP.nextSibling.style.display = 'inline';
											newP.nextSibling.nextSibling.style.display = 'inline';
											newDiv.removeChild(newP);
										}
										, 3000);
									}
									);
								}
							}
							, false);
							
							var inputCancel = document.createElement('input');
							inputCancel.type = 'image';
							inputCancel.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02!IDAT8%CB%95%93%EBN%13Q%14%85%89%89%C9%89%CF%A0V%89%86%C8%91%80%C4%1BB%5B%06(%AD%0D%08%26%D0%FB%85%5E%A4%80%B4%A5%ED%A4M%A16%EA%0FM%7C%12%9F%0BD%C5%DE%B0%D2%99v%3A%D3%E5%AE%98J-%25%E1%C7N%CEd%CE%FA%F6%AC%B5%F7%0C%00%18%B8L%D5%D7B%D7%CE%3Ew_%103%3A*%DEW%EC%0Fr%D9%ED%8D%D7lNC%2F%A0-%CE%EC%A2%95%CEB%8B'%7B%20u_%80%D7%03a46%B6%F0%EB%E5%CA%E7%EA%E2%D2%BD%7F%80%BFb%E4%DF%A1E%A5%25D47%B7%3B%10%D9%BB%C6%A9%3B%9A%D18%90%CB%A3%7D%3E6%5B%E3%E5%19%D3%95S%40*%CDZ%09Qk%ED%BE%01%3E~%82%96%CD%B5%01h%04B%5C%F6%F89u%87%B2%1D%03%E8%BD%EC%0F%E0x%FE%B9Z%16%E6%AEvY%D0b%09%A6%BE%8E%A9%9A%98%01%DE%7F%80%9AJ%A3%1E%0C%83%BAC%D9%8A%02%D9%BD%3F%E7%8A%C9B%E2Yvn%88%CD%C8%26k%84%D6%D5ft%87%EC%BC%05%F6%F2%24%CC%01%99%2Cd%8F%0F%959%B3Z%9E%9Ea%FD%A7p%1A%16%93%5C%5E%0DY%B2%E3%F6%01%0E7%20%A6Q%99%9D%D7JF%81%FD%7F%BF%07%209%3D%EDQ%014%0D%D8%9C%C0%8A%1D%D8I%92o%0B%0A%13S%FCB%80%E4ps%C9%E5%81%12%8E%00I%91%84)%20Fv(%40y%D5%8E%B2%DE%88%EFc%E3%FC%5C%40%CD%EE%E2%92%D3%0D%25%B4%0E%D0%18%25%87%0B%14%96Z%9C2h'%8B%CB%40d%03%B5%17%CB(%3C%7C%8C%C3%A1a%DE%05%A0%CD%E2%D4%1DJ%F0%15uM%40%A2O%A7%B0%D4%E2%A4%81%15%9EL%B0%A3%F1Gj%D5d%06%82!%9CX%AC8%1A%19%C5%C1%ADA%DE%01%D0f%095%9B%03J%20%04i%D5%01%0AK-%3E%D3w%02%FB62%C6%BE%0E%DFW%7F%1A%05H%D6%05%FC%18%7D%80%FD%1B%3A%A1%CB%02m%96P%5DXB%C90%ADQX%3Di%1F%DE%1Db_%06%EF%A8g%C5%3D!%96%F4F%A1%F0t%92%F5%FB%99%0Et%B7%D9%FE%F5%9B%C2%85c%BCl%FD%06r%BB%A4%C7%DB%ED%BE%14%00%00%00%00IEND%AEB%60%82";
							inputCancel.style.marginRight = '5px';
							inputCancel.addEventListener('click', function()
							{
								newDiv.style.display = 'none';
							}
							, false);
							
							var inputHidden = document.createElement('input');
							inputHidden.type = 'hidden';
							inputHidden.name = 'code_smiley';

							newDiv.appendChild(inputKeyWords);
							newDiv.appendChild(inputOk);
							newDiv.appendChild(inputCancel);
							newDiv.appendChild(inputHidden);
							root.appendChild(newDiv);
						}
						if (theEvent.clientX + width + 25 > document.documentElement.clientWidth) newDiv.style.left = (document.documentElement.clientWidth - width - 25) + 'px'; 
						else newDiv.style.left = (theEvent.clientX + 8) + 'px';
						newDiv.style.top = (window.scrollY + theEvent.clientY + 8) + 'px';
						newDiv.style.display = 'block';
						newDiv.firstChild.value = keyWords;
						newDiv.lastChild.value = theImg.alt;
					}
					);
				}
				else
				{
					firstClickTime = new Date().getTime();
					if (saveUrl != null) timer = setTimeout(function() { window.open(saveUrl); }, delay);
				}
			}
			, false);	
		}
		);
	}
}).launch();

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

		var currentVersion = GM_getValue('currentVersion', '0.1.4');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.1.4', currentVersion))
		{
			GM_setValue('currentVersion', '0.1.4');
			currentVersion = '0.1.4';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.1.4'))
		{
			GM_registerMenuCommand("[HFR] Edition rapide du Wiki smilies -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'hfr_edition_wiki_smilies_rapide.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Edition rapide du Wiki smilies');
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
						if (confirm('Une nouvelle version de [HFR] Edition rapide du Wiki smilies est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'hfr_edition_wiki_smilies_rapide.user.js');
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