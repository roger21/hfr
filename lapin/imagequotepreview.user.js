// ==UserScript==
// @name [HFR] Image quote preview
// @version 0.1.0.1
// @namespace http://untitled-document.info/
// @description Adds a preview on image quoted in mes discussions
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
// ==/UserScript==


// historique modifs r21 :
// 0.1.0.1 (03/12/2017) :
// - passage au https


function $x(p, context) {
  if (!context) context = document;
  var i, arr = [], xpr = document.evaluate(p, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (i = 0; item = xpr.snapshotItem(i); i++) arr.push(item);
  return arr;
}

function testLinkToImage(link) {
	return link.href.match(/\.(jpeg|jpg|png|gif)$/i);
}

function loading(element) {
	var dyn = "";
	return  setInterval(function() {
		dyn+= ".";
		if(dyn.length == 4) dyn = "";
		element.innerHTML ="Loading" + dyn;
	},500);
}

var base = document.getElementById('mesdiscussions');
var links = $x('//table[@class="oldcitation"]//a | //table[@class="citation"]//a',base);

links.filter(testLinkToImage).forEach(function(link) {
	var container;
	var loadingText;
	var img;
	var bePatient;
	
	link.addEventListener('mouseover',function() {
		loadingText = document.createElement('p');
		loadingText.style.marginLeft = '50px';
		loadingText.style.fontFamily = 'arial,sans-serif';
		loadingText.style.fontWeight = 'bold';
		loadingText.innerHTML = "Loading";
		
		bePatient = loading(loadingText);
		
		container = document.createElement('div');
		container.style.position = "absolute";
		container.style.background = "white";
		container.style.width = "300px";
		container.style.border = "1px solid black";
		container.style.top = window.scrollY+10+"px";
		container.style.right = "10px";
		
		document.body.appendChild(container);
		container.appendChild(loadingText);
		
		img = new Image();
		img.style.display='block';
		img.style.margin = "auto";
		img.addEventListener('load',function() {
			var setWidth;
		
			if(loadingText.parentNode)	loadingText.parentNode.removeChild(loadingText);
			
			[].slice.apply(container.getElementsByTagName('img')).forEach(function(item) {
				item.parentNode.removeChild(item);
			});
			
			
			if(this.naturalWidth > 300)
				setWidth = 300 +"px"; 
			else
				setWidth = this.naturalWidth + "px";
				
			this.style.width = setWidth;
			container.appendChild(this);
			clearInterval(bePatient);
		},false);
		
		img.src = this.href;
	},false);
	
	link.addEventListener('mouseout',function() {
		if(container) {
			container.parentNode.removeChild(container);
		}
		[container,loadingText,img,bePatient].forEach(function(item) {
			delete item;
		});

	},false);
});


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
			GM_registerMenuCommand("[HFR] Image quote preview -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'others/imagequotepreview.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Image quote preview');
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
						if (confirm('Une nouvelle version de [HFR] Image quote preview est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'others/imagequotepreview.user.js');
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
