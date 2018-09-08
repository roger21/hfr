// ==UserScript==
// @name [HFR] Private Chat
// @version 0.1.7.3
// @namespace http://toyonos.info
// @description Permet de communiquer par chat avec tout membre du forum, en sa basant sur le système des mps
// @include https://forum.hardware.fr/*
// @exclude https://forum.hardware.fr/bddpost.php
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
// 0.1.7.3 (10/12/2017) :
// - commentage des alert XML
// 0.1.7.2 (09/12/2017) :
// - correction du selecteur de messages (evol du forum) par PetitJean
// 0.1.7.1 (03/12/2017) :
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

var cssManager = 
{
	cssContent : '',
	
	addCssProperties : function(properties)
	{
		cssManager.cssContent += properties;
	},
	
	insertStyle : function()
	{
		GM_addStyle(cssManager.cssContent);
		cssManager.cssContent = '';
	}
};

var getElementByXpath = function(path, element, doc)
{
	if (doc == null) doc = document;	
	var arr = Array(), xpr = doc.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
};

/******************************************************************/

var hfrPrivateChat =
{
	minimizeImg : "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0D%00%00%00%0D%08%03%00%00%00E5%14N%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%00%EAPLTE%E4%EC%EF%E3%ED%EE%C4%C2%C3%E7%EC%F0%C3%C3%C1%C4%C4%C4%E3%ED%EF%DB%E4%E9%C6%C4%C7%E6%F0%F1%DC%E5%EA%E4%ED%EC%C5%C7%C6%E4%EE%ED%C0%C4%C3%E2%EE%EE%E3%EB%ED%E1%EB%EC%C7%C7%C7%C9%D7%DA%E5%EE%F3%C5%C5%C3%C5%D7%DB%D8%E5%EB%D4%E3%E8%E4%EF%F1%DD%DD%DD%E7%EC%F2v%91%98%E5%EA%F0%C3%C3%C5%C5%C5%C7%E6%EF%EE%C4%C5%C7%83%9E%A5%E8%ED%F3%C9%D8%DB%C2%C2%C2%E3%EF%EF%E5%EE%EDu%92%98%E2%EC%EE%C2%C4%C1v%94%9E%C3%C4%C6t%95%9E%E4%EF%F3%E6%EB%EF%E6%EF%F4y%94%9D%D9%D7%D8%E5%F1%F1%C7%C5%C6%C2%C4%C3%C6%C6%C6%DB%E6%E8%DC%DA%DBw%94%9A%E3%EE%F0%E8%ED%F0%E0%E9%EE%D8%D8%D8%E3%EF%ED%E5%EC%F2%DB%E6%EC%E6%EE%F1%C2%C3%C5%C8%D7%DC%E4%EC%EE%E4%EE%EF%E6%EE%F0%E5%EF%F0%C3%C3%C3%E5%ED%F0%E5%EF%F1%E5%ED%EF%C5%C5%C5%E4%EE%F0%EE%96%9C%17%00%00%00%A5IDATx%DA%0C%8CU%12%C2%40%10%05%07%02%04wwww%87%84%F5%DD%B9%FFu%D8%FE%7BU%FD%1A%EA%C7%92I%F6BI%13%8Dv%AE%90%CF%05%12%B3F7%B2!%40%0C%84%89%97%D9%3AE%B5%E6%0A%05%9C%89%C3%E4%1B)%9B%A8%9A%00%03%9C%A2F%A9%A9%3C%F8%60%12%FA%12w%DDo%BC%D2%D2A0%81O%BFy%5B%ECV%D3j%CA.%90%C3%9F%A5%5Cx%A25%B3%0F%8E%1Ez%14%99%B6%95%08%B3mD%CD%B5%1E%D9%1F%97j%8C1v%971%1F%84T%0A%F9%80z%CC!Kx%B5%C5%5C%04%FDp%E8%24%D2%FB%BF%00%03%00%FB_!%05%D4%3F%F0%DF%00%00%00%00IEND%AEB%60%82",
	
	maximizeImg : "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0D%00%00%00%0D%08%03%00%00%00E5%14N%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%01%11PLTE%E5%EF%EE%C3%C3%C5%E4%F0%F0%E4%EE%ED%E4%EB%F1%E3%ED%EF%E4%EF%F1%E5%EE%F3%E6%EE%F0%D6%E3%E9%E4%ED%F2%DC%E5%EA%E4%EC%EF%E5%F1%F1%C5%C5%C7%E4%EC%EE%E6%EF%EE%E6%F0%F2%C1%C3%C2%E2%EC%ED%E6%EE%F1%E1%EC%F0%DD%E4%EA%CA%D4%DD%D0%D1%D5%E7%EC%EF%C2%C2%C0u%92%98%DA%E5%E9%CD%D1%D2%C7%D6%DB%E3%EB%EDy%90%98x%93%9E%C6%C6%C6%E7%EF%F1r%95%99t%92%9C%C6%C6%C8%E8%ED%F1%C5%C3%C4%C3%C5%C4%D2%D3%D7%CA%D7%DD%C0%C3%C8%80%9D%A3%DB%E4%EBv%94%9E%E0%F0%EF%C2%C2%C4%C2%C4%C3u%95%A0%C2%C2%C2%C9%D6%DE%C3%C1%C2%83%9E%A5%BF%C3%C4%E1%EA%E9%C1%C5%C8%E3%EC%EBw%94%9Ay%94%9F%C4%C3%C8%C4%C4%C6%C5%C6%C8%DB%E4%E9u%93%9B%C1%C2%C6%E7%EC%F2%C4%C2%C3%C8%D7%DA%CD%D2%D8%E3%EA%F0w%94%9C%E5%EC%F2%C5%C5%C5%C5%C3%C6%C5%C3%C8%C8%D5%DD%C3%C5%C2%E6%F0%F1%C3%C3%C3%E5%ED%F0%E5%ED%EF%E5%EF%F0%C2%C3%C5%E4%EE%F0%E3%ED%EE%C4%C4%C4%E5%EF%F1%E4%EE%EF%FC%BD%8A%D2%00%00%00%B3IDATx%DA%04%C1%87%22Ba%18%00%D0%EF%EE%DB%BC%B7%A9%A1d%86%06%A2%85%86(Q%F4%EF%F5%FE%0F%D29p%BF%E4J%A9%97%C5%0Eg_%BF%E1f%EA%BD%C9%2F'2%5EZfa%2FM%F8k%FC%CBP%23c%81%926%04t%EC%16%B5%B0-%F8s%09%23%EC%5C8%19%94y%82%BBBx%FAQ%BEJ%A5%FA%AE%E0%A0%DA%A4w%FD3%7BX%B5%12%FA%16.%0Ag%9D%FF%CD%7Bsx%B25%0A%E62'l%F6L%1DD%D9%08%0Ei%FAX%0D%EA%3A%19%25I%0DT%C9%20%1D%24%3C%1F%7C%9D%07%9E3%B1%14%94A%AC%8B%1C%1A%83%09_%5B8%8F%F1g%B7r%14%60%00%E5%8C!%0C%03%3D%CAL%00%00%00%00IEND%AEB%60%82",
	
	myPseudo : null,
	
	activePostId : null,
	
	autoRefreshTimers : Array(),
	
	notifyTimers : Array(),
	
	lockPost : false,

	get mpsNumber()
	{
		return GM_getValue('hfr_hpc_mpsNumber', 5);	
	},

	get refreshRate()
	{
		// En secondes
		return GM_getValue('hfr_hpc_refreshRate', 120);	
	},
	
	get chatImgUrl()
	{
		return GM_getValue('hfr_hpc_chatImgUrl', '');	
	},
	
	getHeader : function (postId)
	{
		var chatContent = document.getElementById('hpc_content_' + postId);
		return chatContent != null ? chatContent.previousSibling : null;
	},
	
	isMinimized : function(postId)
	{
		var minimizedPostsIds = GM_getValue('hfr_hpc_minimizedPostsIds', '');
		var ids = minimizedPostsIds != '' ? minimizedPostsIds.split(',') : new Array();
		return ids.indexOf(postId) != -1; 
	},
	
	toggleMinimize : function(postId)
	{
		var chatHeader = hfrPrivateChat.getHeader(postId);
		var chatContent = chatHeader.nextSibling;
		
		// On change l'icône (minimize ou maximise)
		var imgToggle = chatHeader.firstChild.nextSibling.firstChild;
		imgToggle.src = imgToggle.src == hfrPrivateChat.minimizeImg ? hfrPrivateChat.maximizeImg : hfrPrivateChat.minimizeImg;
		// On stop éventuellement la notification
		hfrPrivateChat.stopNotify(postId, chatHeader);

		var minimizedPostsIds =  GM_getValue('hfr_hpc_minimizedPostsIds', '');
		var ids = minimizedPostsIds != '' ? minimizedPostsIds.split(',') : new Array();
		
		// On maximise...
		if (ids.indexOf(postId) != -1)
		{
			ids = ids.slice(0, ids.indexOf(postId)).concat(ids.slice(ids.indexOf(postId) + 1, ids.length));
			GM_setValue('hfr_hpc_minimizedPostsIds', ids.join(','));
			// Réaffichage du chat
			chatContent.style.display = 'block';
			// On lance un refresh
			hfrPrivateChat.getMPsContent(postId, chatContent.firstChild, true);
			// On donne le focus
			chatContent.firstChild.nextSibling.firstChild.focus();
		}
		// ...ou on minimise
		else
		{
			ids.push(postId);
			chatContent.style.display = 'none';
			GM_setValue('hfr_hpc_minimizedPostsIds', ids.join(','));
		}
	},
	
	get postsIds()
	{
		var postsIds = GM_getValue('hfr_hpc_postsIds', '');
		return postsIds != '' ? postsIds.split(',') : new Array();
	},
	
	isClosed : function(postId)
	{
		var postsIds = GM_getValue('hfr_hpc_postsIds', '');
		var ids = postsIds != '' ? postsIds.split(',') : new Array();
		return ids.indexOf(postId) == -1;
	},	
	
	toggleClose : function(postId)
	{
		var postsIds = GM_getValue('hfr_hpc_postsIds', '');
		var ids = postsIds != '' ? postsIds.split(',') : new Array();
		if (ids.indexOf(postId) != -1)
		{
			var idsToShift = ids.slice(ids.indexOf(postId) + 1, ids.length);
			ids = ids.slice(0, ids.indexOf(postId)).concat(idsToShift);
			document.getElementById('hpc_content_' + postId).parentNode.style.display = 'none';
			// Réorganisation des fenêtres de chat
			idsToShift.forEach(function(id)
			{
				var currentWindow = document.getElementById('hpc_content_' + id).parentNode;
				currentWindow.style.right = (parseInt(currentWindow.style.right) - 307) + 'px'; 
			}
			);
		}
		else
		{
			ids.push(postId);
		}
		GM_setValue('hfr_hpc_postsIds', ids.join(','));	
	},
	
	startAutoRefreshProcess : function(postId)
	{
		hfrPrivateChat.autoRefreshTimers[postId] = setInterval(function()
		{
			hfrPrivateChat.getMPsContent(postId, document.getElementById('hpc_content_' + postId).firstChild);
		}
		, hfrPrivateChat.refreshRate*1000);					
	},
	
	doNotify : function(postId)
	{
		var chatHeader = hfrPrivateChat.getHeader(postId);
		clearInterval(hfrPrivateChat.notifyTimers[postId]);
		hfrPrivateChat.notifyTimers[postId] = setInterval(function()
		{
			chatHeader.style.backgroundColor = chatHeader.style.backgroundColor == 'rgb(192, 192, 192)' ? 'rgb(51, 102, 153)' : 'rgb(192, 192, 192)';
			chatHeader.firstChild.style.color = chatHeader.firstChild.style.color == 'rgb(0, 0, 0)' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
		}
		, 500);
	},
	
	stopNotify : function(postId, chatHeader)
	{
		clearInterval(hfrPrivateChat.notifyTimers[postId]);
	},
	
	getMPsContent : function(postId, chatMps)
	{
		var disableNotify = hfrPrivateChat.getMPsContent.arguments.length > 2 ? hfrPrivateChat.getMPsContent.arguments[2] : false;
		var flood = hfrPrivateChat.getMPsContent.arguments.length > 3 ? hfrPrivateChat.getMPsContent.arguments[3] : false;
		
		if (!hfrPrivateChat.isMinimized(postId))
		{
			var chatHeader = hfrPrivateChat.getHeader(postId);
			var waitImg = document.createElement('img');
			waitImg.src = "data:image/gif;base64,R0lGODlhEAALAPQAAP%2F%2F%2FwAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6%2BviYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh%2BQQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5%2By967tYLyicBYE7EYkYAgAh%2BQQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W%2FHISxGBzdHTuBNOmcJVCyoUlk7CEAAh%2BQQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ%2BYrBH%2BhWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C%2B4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa%2F7txxwlwv2isSacYUc%2Bl4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r%2Fu3HHCXC%2FaKxJpxhRz6Xi0ANAZDWa%2BkEAA7AAAAAAAAAAAA";
			waitImg.alt = waitImg.title = 'Loading...';
			chatHeader.firstChild.nextSibling.insertBefore(waitImg, chatHeader.firstChild.nextSibling.firstChild);
		}
		
		hfrPrivateChat.retrieveMetaInfosByPage(postId, 1, disableNotify, flood, chatMps);
	},
	
	retrieveMetaInfosByPage : function(postId, pageNumber, disableNotify, flood, chatMps)
	{
		var tmp;
		var url = 'https://forum.hardware.fr/forum1.php';
		var args = 'config=hfr.inc&cat=prive';
		args += pageNumber != null ? '&page=' + pageNumber : '';
		toyoAjaxLib.loadDoc(url, 'get', args, function(pageContent)
		{		
			var pageMax = (tmp = pageContent.match(/([0-9]+)<\/a><\/div><div class="pagepresuiv">/)) != null ? tmp.pop() : null;
			var regexp = new RegExp('<img.*?title=".*?Message privé.*?" alt="(.+?)".*\\s*.*?title="Sujet n°' + postId + '">(.+?)</a>.*?<td class="sujetCase4">(.+?)</td>.*?class="Tableau">(.+?)</a>.*\\s*.*\\s*.*\\s*.*?<br /><b>(.+?)</b></a>');
			var infos = pageContent.match(regexp);
			if (infos == null)
			{
				// Pas la bonne page, on passe à la suivante si on est pas arrivé à la dernière et si il y a plus d'une seule page de mps
				if (pageNumber != null && pageNumber < pageMax) hfrPrivateChat.retrieveMetaInfosByPage(postId, pageNumber + 1, disableNotify, flood, chatMps);
			}
			else
			{
				var lastMpPseudo = infos.pop();
				var interlocutorPseudo = infos.pop();
				var maxPage = (tmp = infos.pop().match(/class="cCatTopic">(.+?)<\/a>/)) != null ? tmp.pop() : null;
				var postTitle = infos.pop();
				var newMp = infos.pop() == 'On' && interlocutorPseudo.toLowerCase() == lastMpPseudo.toLowerCase() && !disableNotify;
				hfrPrivateChat.getHeader(postId).firstChild.innerHTML = postTitle;

				if (hfrPrivateChat.isMinimized(postId))
				{
					// Si nouveau mp, notification d'un nouveau message
					if (newMp) hfrPrivateChat.doNotify(postId);
				}
				else
				{
					hfrPrivateChat.retrieveMpsByPage(postId, maxPage, hfrPrivateChat.mpsNumber, newMp, flood, chatMps);
				}			
			}
		}
		);	
	},
	
	retrieveMpsByPage : function(postId, pageNumber, remainingMps, newMp, flood, chatMps)
	{	
		var url = 'https://forum.hardware.fr/forum2.php';
		var args = 'config=hfr.inc&cat=prive&post=' + postId;
		args += pageNumber != null ? '&page=' + pageNumber : '';
		toyoAjaxLib.loadDoc(url, 'get', args, function(pageContent)
		{
			var chatHeader = hfrPrivateChat.getHeader(postId);
			var waitImg = chatHeader.firstChild.nextSibling.firstChild;
			if (waitImg.nodeName.toLowerCase() == 'img')
			{
				chatHeader.firstChild.nextSibling.removeChild(waitImg);
				chatMps.innerHTML = '';
			}

			if (hfrPrivateChat.myPseudo == null) hfrPrivateChat.myPseudo = pageContent.match(/<input type="hidden" name="pseudo" value="(.+?)" \/>/).pop();
			
			var contentNode = document.createElement('div');
			contentNode.innerHTML = pageContent;
			var currentMps = getElementByXpath('.//table[starts-with(@class, "messagetable")]', contentNode);
			for (var ind in currentMps = currentMps.reverse())
			{
				var mpDiv = document.createElement('div');
				mpDiv.className = 'hpc_mp';
			
				var pseudo = getElementByXpath('.//b[@class="s2"]', currentMps[ind]).pop().innerHTML;
				var postUrl = getElementByXpath('.//div[@class="right"]', currentMps[ind]).pop().innerHTML.match(/href="(.*?)"/).pop();
				var tmp, mpContent = getElementByXpath('.//div[starts-with(@id, "para")]', currentMps[ind]).pop();
				if ((tmp = getElementByXpath('.//div[@class="edited"]', mpContent)).length > 0)
				{
					mpContent.removeChild(tmp.pop());
					mpDiv.className += ' mp_edited';
				}
				
				if (mpContent.innerHTML.match(/<strong>Reprise du message précédent :<\/strong>/) != null) continue;
				
				var newLink = document.createElement('a');
				newLink.innerHTML = pseudo + ' :';
				newLink.className = 'hpc_pseudo';
				newLink.href = url + '?' + args + postUrl;
				newLink.title = 'Aller sur le message correspondant';
				mpDiv.appendChild(newLink);
				mpDiv.innerHTML += mpContent.innerHTML;

				getElementByXpath('.//table[@class="spoiler"]', mpDiv).forEach(function(spoiler)
				{
					spoiler.removeAttribute('onclick');
					spoiler.addEventListener('click', function()
					{
						var divToHide = getElementByXpath('.//div[@class="Topic masque"]', this).pop();
						divToHide.style.visibility = divToHide.style.visibility == 'visible' ? 'hidden' : 'visible';
					}, false);
				}
				);

				getElementByXpath('.//table[@class="code"]', mpDiv).forEach(function(code)
				{
					code.removeAttribute('ondblclick');
				}
				);
				
				chatMps.insertBefore(mpDiv, chatMps.firstChild);
				if (--remainingMps == 0) break;
			}

			if (flood)
			{
				var mpDiv = document.createElement('div');
				mpDiv.className = 'hpc_mp flood';
				mpDiv.innerHTML = 'Flood interdit <img src="https://forum-images.hardware.fr/images/perso/o_non.gif" alt="[:o_non]" title="[:o_non]" />';
				chatMps.appendChild(mpDiv);				
			}
			
			if (remainingMps > 0 && pageNumber > 1)
			{
				// Il reste des messages à récupérer, on va les chercher à la page précédente si on n'est pas déja arrivé à la page 1
				hfrPrivateChat.retrieveMpsByPage(postId, pageNumber-1, remainingMps, newMp, flood, chatMps);
			}
			else
			{
				setTimeout(function(){ chatMps.scrollTop = chatMps.scrollHeight; }, 100);
				document.getElementById('hpc_post_' + postId).firstChild.readOnly = false;
				// Si nouveau mp, notification d'un nouveau message (sauf si la fenêtre à déjà le focus)
				if (newMp && postId != hfrPrivateChat.activePostId) hfrPrivateChat.doNotify(postId);
			}
		}
		);
	},

	insertStyle : function()
	{
		// Style général
		cssManager.addCssProperties("div.hfr_private_chat span, div.hfr_private_chat div, div.hfr_private_chat textarea {font-family: Verdana, Geneva, Arial, Helvetica, sans-serif;}");
		cssManager.addCssProperties("div.hfr_private_chat {width: 300px; position: fixed; border: 1px solid black; border-bottom: 0; bottom: 0; background-color: #fff;}");
		cssManager.addCssProperties("div.hpc_header {background-color: #c0c0c0; height: 20px; text-align: right; padding-top: 6px;}");
		cssManager.addCssProperties("div.hpc_header div {text-align: right;}");
		cssManager.addCssProperties("div.hpc_header input{ padding-right: 3px;}");
		cssManager.addCssProperties("div.hpc_header img { padding-right: 5px; vertical-align: 0px;}");
		cssManager.addCssProperties("div.hpc_header a:link, div.hpc_header a:visited {text-align: left; padding-left: 5px; width: 200px; font-size: 0.75em; color: #000; font-weight: bold; display: block; float: left; white-space: nowrap; overflow: hidden;}");
		cssManager.addCssProperties("div.hpc_header a:hover, div.hpc_header a:active {text-decoration: underline;}");
		cssManager.addCssProperties("div.hpc_mps {background-color: #f7f7f7; height: 150px; overflow: auto}");
		cssManager.addCssProperties("img.hpc_wait {display: block; margin: auto !important; margin-top: 59px !important;}");
		cssManager.addCssProperties("div.hpc_mp {padding: 5px; border-bottom: 1px solid #c0c0c0; font-size: 0.7em; text-align: left;}");
		cssManager.addCssProperties("div.hpc_mp table[class='spoiler'], div.hpc_mp table[class='oldcitation'] {font-size: 1em;}");
		cssManager.addCssProperties("div.hpc_mp table[class='code'], div.hpc_mp table[class='oldquote'], div.hpc_mp table[class='fixed'] {font-size: 1.1em;}");
		cssManager.addCssProperties("div.hpc_mp a.hpc_pseudo:link, div.hpc_mp a.hpc_pseudo:visited {font-weight: bold; color: #000;}");
		cssManager.addCssProperties("div.hpc_mp a.hpc_pseudo:hover, div.hpc_mp a.hpc_pseudo:active {text-decoration: underline;}");
		cssManager.addCssProperties("div.hpc_mp p {margin: 0; padding: 0;}");
		cssManager.addCssProperties("div.hpc_mp img {max-width: 150px;}");
		cssManager.addCssProperties("div.mp_edited {background-color: #ededed;}");
		cssManager.addCssProperties("div.hpc_mp img[src^='https://forum-images.hardware.fr'] {display: inline; width: auto;}");
		cssManager.addCssProperties("div.flood {color: red; font-weight: bold;}");
		cssManager.addCssProperties("div[id^='hpc_post'] {padding: 10px; background-color: #F7F7F7;}");
		cssManager.addCssProperties("div[id^='hpc_post'] textarea {border: 1px solid black; width: 100%; font-size: 0.75em;}");
		cssManager.insertStyle();	
	},
	
	displayWindow : function(postId)
	{
		// Construction de la fenêtre
		var chatDiv = document.createElement('div');
		chatDiv.className = 'hfr_private_chat';
		chatDiv.style.right = ((hfrPrivateChat.postsIds.indexOf(postId) * 307) + 5) + 'px';
		//document.body.appendChild(chatDiv);
		document.getElementById('mesdiscussions').appendChild(chatDiv);
		
		var chatHeader = document.createElement('div');
		chatHeader.className = 'hpc_header';
		chatDiv.appendChild(chatHeader);
		var titleLink = document.createElement('a');
		titleLink.innerHTML = '&nbsp;';
		titleLink.href = 'https://forum.hardware.fr/forum2.php?config=hfr.inc&cat=prive&post=' + postId;
		titleLink.title = 'Aller sur le MP correspondant';
		chatHeader.appendChild(titleLink);

		var inputMinimize = document.createElement('input');
		inputMinimize.type = 'image';
		inputMinimize.src = hfrPrivateChat.isMinimized(postId) ? hfrPrivateChat.maximizeImg : hfrPrivateChat.minimizeImg;
		inputMinimize.alt = 'minimiser';
		inputMinimize.addEventListener('click', function(){	hfrPrivateChat.toggleMinimize(postId); }, false);
		
		var inputClose = document.createElement('input');
		inputClose.type = 'image';
		inputClose.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0D%00%00%00%0D%08%02%00%00%00%FD%89s%2B%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%A7IDATx%DA%8DQ%5B%0E%C20%0C%CB%A19%09%9F%1C%86%D5y%88%FCLbCh%88%03%F0%0D7%20e%DAVm%D3F%D4Vj%E2%3AvC%ED%ADSs%B0%CA%10%00DLU%99Y%F5%92%D4%EB%F6Af%FEz%7F%B6W%A0I%D9%FA%8Bw%CFYy%CC%04%2FE%A3%3Eu8%9EJh%99%C98e_%16f%CFB0%85%81%25G%9C%A5%00%8C%7DW%DBM%3EX%C2%AF%AD%F2%95%D0%E0%22%F9C%1F'%84%3E%EC%FA%05%AAI%DF%C6%FF%25%06%85%97%DDyd%BFu%D3B%F8%CC%92G%8C%3C%D2%D8A%C0%BFH%B0%8A%FD%DA%DC%BF0%EF%A77%E9o%D0%81%00%00%00%00IEND%AEB%60%82";
		inputClose.alt = 'fermer';
		inputClose.addEventListener('click', function()
		{
			// On stop éventuellement la notification
			hfrPrivateChat.stopNotify(postId, chatHeader);
			// On ferme la fenêtre de chat
			hfrPrivateChat.toggleClose(postId);
			// Si la fenêtre était minimisée, on la maximise pour la prochaine fois
			if (hfrPrivateChat.isMinimized(postId)) hfrPrivateChat.toggleMinimize(postId);
		}
		, false);
		
		var buttonsContainer = document.createElement('div');
		chatHeader.appendChild(buttonsContainer);
		buttonsContainer.appendChild(inputMinimize);
		buttonsContainer.appendChild(inputClose);
		
		var chatContent = document.createElement('div');
		chatContent.id = 'hpc_content_' + postId;
		chatContent.style.display = hfrPrivateChat.isMinimized(postId) ? 'none' : 'block';
		chatDiv.appendChild(chatContent);
		
		var chatMps = document.createElement('div');
		chatMps.className = 'hpc_mps';
		chatContent.appendChild(chatMps);
		
		var chatPost = document.createElement('div');
		chatPost.id = 'hpc_post_' + postId;
		chatContent.appendChild(chatPost);
		var newTA = document.createElement('textarea');
		newTA.readOnly = true;
		newTA.setAttribute('accesskey', 'b');
		newTA.addEventListener('keydown', function(event)
		{
			if (event.which == 13)
			{
				if (hfrPrivateChat.lockPost) return;
				if (event.ctrlKey)
				{
					var ssSave = this.selectionStart;
					var stSave = this.scrollTop;
					this.value = this.value.slice(0, this.selectionStart) + "\n" + this.value.slice(this.selectionStart);
					this.setSelectionRange(ssSave + 1, ssSave + 1);
					this.scrollTop = stSave + 16;
				}
				else
				{	
					if (this.value != '')
					{
						hfrPrivateChat.lockPost = true;
						this.readOnly = true;
						var url = 'https://forum.hardware.fr/bddpost.php?config=hfr.inc';
						var args = 'content_form=' + encodeURIComponent(this.value) + '&post=' + postId + '&pseudo=' + encodeURIComponent(hfrPrivateChat.myPseudo) + '&cat=prive&verifrequet=1100&sujet=DTC';
						args += '&hash_check=' + getElementByXpath('//input[@name="hash_check"]', document).pop().value;
						toyoAjaxLib.loadDoc(url, 'post', args, function(response)
						{
							hfrPrivateChat.lockPost = false;
							var ta = document.getElementById('hpc_post_' + postId).firstChild;
							ta.value = '';
							ta.focus();
							var flood = response.match(/flood/) != null;
							hfrPrivateChat.getMPsContent(postId, chatMps, false, flood);
						}
						);
					}
					event.preventDefault();
				}
			}
		}
		, false);
		newTA.addEventListener('focus', function()
		{
			hfrPrivateChat.stopNotify(postId, chatHeader);
			hfrPrivateChat.activePostId = postId;
			chatHeader.style.backgroundColor = 'rgb(51, 102, 153)';
			chatHeader.firstChild.style.color = 'rgb(255, 255, 255)';
		}
		, false);
		newTA.addEventListener('blur', function()
		{
			hfrPrivateChat.activePostId = null;
			chatHeader.style.backgroundColor = 'rgb(192, 192, 192)';
			chatHeader.firstChild.style.color = 'rgb(0, 0, 0)';
		}
		, false);
		chatPost.appendChild(newTA);
		
		// On active l'autoresfresh
		hfrPrivateChat.startAutoRefreshProcess(postId);
		// On va récupérer les mps
		hfrPrivateChat.getMPsContent(postId, chatMps);	
	},
	
	displayWindows : function()
	{			
		hfrPrivateChat.postsIds.forEach(function(postId){ hfrPrivateChat.displayWindow(postId); });
	},
	
	generateImg : function(postId)
	{
		var newImg = document.createElement('img');
		newImg.src = hfrPrivateChat.chatImgUrl == '' ? "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%83IDAT8%CB%8D%D1ML%D2q%1C%06p%EB%D0%96%1E%3Au%E8%ED%80d%1D%D2%D6%8B%CE9%B6%88%F0%D0X%BA%E6%40%86%A8%C8BL%C9%A1%22%19%06d%82%A5%5B%8A%FE%C1%3FZ)%94%E8%DFR%0C%CD%11%EB%A2%07m%A6%E2%7BXk%83C%0A%DD%9A9k%CB%F0%89%D82%9B%CC%3C%3C%A7%DF%BE%9F%3D%7B~Q%00%A2v%8A%9A%7BX%3Co%8E%5BY%EA%3C%02%AF%95%B6n%91%C7%B6%A5'%C7%EE%FB%F3%BE%E3%B1%9Cs%94%ED%EB%A0%05%97%BB%0EakZe%F4%C6%5D%01m%A2%83%C4r_%22%FC%AE%7C%7C%1B%AB%87%DF%CE%C02u%0C%0Bf%FA%97%5D%01%24%F7%40%7D%60%C6%85%95Q%12%EB3O%B0%FA%86%C4%D2%B4%13C%BA%B3%BE%5D%01%19%9CL%A9%C7V%B6%F1u%B6%17%C1%C5%3E%AC-8%10%18%26P%9D%7B%D1%1E%11%90%B2%E2%C4%CD%E2K%2BD%0E%0Bd%1E%7B%BD%90%9F0IT%C8~%04%EC%0A%7C%EA%BF%8B%C0%80%06%23-7p%3A%FF%943I%19%1F%F3%0F%20b%1Cg7%8BS%83%8DB%16%B6%A6%DD%20%87%B1U%8F%3A%93%06w%1E(%D1%FF%CE%86%9A%A1j%24hOZ%CF(NDo%02%06%FE%B9%91%87%85W%D1Wu%0D%9E.5%3A%15%3C%109l%B4%14%A4%C22%A3%86y%AA%02%0D%EER%D4%BA%CB%D0%F3%BE%0D%25%8Eb%A4%14%26%91%9B%80%89O%EF%F98Dm%1B%8C%AAd%C10u%0Bun%25t%13%25%B8%3DQ%04%D5%DB%22%88%C9%3Cx%C9%F4%FF%0FV%A7%E3%C24%ADBC%A8%81a%EA%26%9AB)%1F%94!%CB%90%05%FF%A3%2B%7F%81%BD%E7%9BT%26U%F1%B6%C1%E2y%E5%90%D8%B2q%BD%5B%80%02J%00IG%26.%E8%19%3E%A5%B4%AA%CAk%11%08%C3%C7%7B%18%DD%92%0C%85%7Bu%F83p%EF%B9%1D%9Av%0AJ%C2%8A%C7%E3%DF%A14-a%7FJ%B75%86%D9%1A%1D%E9%AB%A3h%9C%16%1EO%3E%B86%B0%18%84%DE%03%E4%8F%03%B9%C3%40%E6%20%C0%A7%00b%14%10j%3C%88c%D7%90%11%819%7D%E2%CF%C9%5E%23%14%2F%02%10%B9%00%91c%03Bj%03%3Ck%10if%20%CD%18%C4S%CB%CB%F0%60%11%01_%13%D3%DF%5BS%0A%81v%0C%D2%D7%80%F8U%A8%81%03%C8%19%00%B2%7F%B7%A8%F5B%AB%B8%1F%1E%2C%22%F0%A1%A3%20%C5Y%9DQ%99%CC%B39%12K%26%C0%D2%CE%852%0F%96z%16%CCJ7%E8%97%9F%F9%8C%E5%92%F0%60%91%80_A%7F%B2%00%90%B7%7CA%00%00%00%00IEND%AEB%60%82" : hfrPrivateChat.chatImgUrl;
		newImg.alt = newImg.title = 'Lancer un chat';
		newImg.style.cursor = 'pointer';
		newImg.addEventListener('click', function()
		{
			if (hfrPrivateChat.isClosed(postId))
			{
				hfrPrivateChat.toggleClose(postId);
				hfrPrivateChat.displayWindow(postId);
				document.getElementById('hpc_post_' + postId).firstChild.focus();
			}
			else
			{
				var chatContent = document.getElementById('hpc_content_' + postId);
				// Fenêtre déjà ouverte et minimisée, on maximise et on rafraichit
				if (hfrPrivateChat.isMinimized(postId)) hfrPrivateChat.toggleMinimize(postId);
				// Et on donne le focus au textarea
				chatContent.firstChild.nextSibling.firstChild.focus();
			}
		}
		, false);
		return newImg;
	},
	
	insertShortcuts : function()
	{
		if (('' + document.location).match(/https:\/\/forum.hardware.fr\/forum.*?cat=prive/) != null)
		{
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
				if (getElementByXpath('.//img[@alt="closed"]', tr).length == 0)
				{
					var newImg = hfrPrivateChat.generateImg(getElementByXpath('.//td//input[@type="checkbox"]', tr).pop().value);
					newTd.appendChild(newImg);
				}
				else
				{
					newTd.innerHTML = '&nbsp;';
				}
				tr.insertBefore(newTd, tr.firstChild.nextSibling.nextSibling);
			}
			);
		}
	},
	
	insertQuickOpener : function ()
	{
		var url = 'https://forum.hardware.fr/forum1.php';
		var args = 'config=hfr.inc&cat=prive&page=1';
		toyoAjaxLib.loadDoc(url, 'get', args, function(pageContent)
		{
			var contentNode = document.createElement('div');
			contentNode.innerHTML = pageContent;
			var newMps = new Array();
			getElementByXpath('.//table//tr[starts-with(@class, "sujet ligne_booleen")]', contentNode).forEach(function(tr)
			{
				if (getElementByXpath('.//td[starts-with(@class, "sujetCase1")]//img[@alt="On"]', tr).length == 1)
				{
					newMps.push(getElementByXpath('.//td[@class="sujetCase10"]//input[@type="checkbox"]', tr).pop().value);
				}
			}
			);

			if (newMps.length >= 1)
			{
				var mpDiv = getElementByXpath('.//div[@class="left"]//div[@class="left"]', document).pop();
				if (!mpDiv) return;
				
				var newA = document.createElement('a');
				newA.innerHTML = '(Ouvrir dans des fenêtres de chat)';
				newA.style.paddingLeft = '5px';
				newA.className = 's1Ext';
				newA.href = 'javascript:void(0);';
				newA.addEventListener('click', function(event)
				{
					for (var i = 0; i < newMps.length; i++)
					{
						var postId = newMps[i];
						if (hfrPrivateChat.isClosed(postId))
						{
							hfrPrivateChat.toggleClose(postId);
							hfrPrivateChat.displayWindow(postId);
							document.getElementById('hpc_post_' + postId).firstChild.focus();
						}
						else
						{
							var chatContent = document.getElementById('hpc_content_' + postId);
							// Fenêtre déjà ouverte et minimisée, on maximise et on rafraichit
							if (hfrPrivateChat.isMinimized(postId)) hfrPrivateChat.toggleMinimize(postId);
							// Et on donne le focus au textarea
							chatContent.firstChild.nextSibling.firstChild.focus();
						}		
					}		
				}
				, false);
				mpDiv.appendChild(newA);
			}
		}
		);	
	},
	
	insertGmMenuCommands : function()
	{
		GM_registerMenuCommand("[HFR] Private chat -> Url de l'image", function()
		{
			var imgUrl = prompt("Url de l'image ?", hfrPrivateChat.chatImgUrl);
			if (imgUrl == null) return;
			GM_setValue('hfr_hpc_chatImgUrl', imgUrl);		
		}
		);
		
		GM_registerMenuCommand("[HFR] Private chat -> Fréquence de rafraîchissement", function()
		{
			var refreshRate = prompt("Fréquence de rafraîchissement de la fenêtre de chat (en secondes) ?", hfrPrivateChat.refreshRate);
			if (!refreshRate) return;
			GM_setValue('hfr_hpc_refreshRate', refreshRate);		
		}
		);
		
		GM_registerMenuCommand("[HFR] Private chat -> Nombre de MPs affichés", function()
		{
			var mpsNumber = prompt("Nombre de MPs affichés par fenêtre de chat ?", hfrPrivateChat.mpsNumber);
			if (!mpsNumber) return;
			GM_setValue('hfr_hpc_mpsNumber', mpsNumber);		
		}
		);
	},
	
	launch : function()
	{
		hfrPrivateChat.insertGmMenuCommands();
		hfrPrivateChat.insertShortcuts();
		hfrPrivateChat.insertQuickOpener();
		hfrPrivateChat.insertStyle();
		hfrPrivateChat.displayWindows();
	}
};

hfrPrivateChat.launch();

// ============ Module d'auto update du script ============
({
	check4Update : function()
	{
		var autoUpdate = this;
		var mirrorUrl = GM_getValue('mirrorUrl', 'null');
		if (mirrorUrl == 'null') autoUpdate.retrieveMirrorUrl();

		var currentVersion = GM_getValue('currentVersion', '0.1.7');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.1.7', currentVersion))
		{
			GM_setValue('currentVersion', '0.1.7');
			currentVersion = '0.1.7';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.1.7'))
		{
			GM_registerMenuCommand("[HFR] Private Chat -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'hfr_private_chat.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Private Chat');
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
						if (confirm('Une nouvelle version de [HFR] Private Chat est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'hfr_private_chat.user.js');
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
