// ==UserScript==
// @name [HFR] Nombre de pages en retard
// @version 1.3.0.1
// @namespace https://forum.hardware.fr
// @description Affiche le nombre de pages en retard dans la liste des sujets
// @include https://forum.hardware.fr/forum1f.php*
// @include https://forum.hardware.fr/forum1.php*
// @include https://forum.hardware.fr/*liste_sujet*
// @require http://code.jquery.com/jquery-1.8.2.min.js
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
// 1.3.0.1 (03/12/2017) :
// - passage au https


/*
	Authors : Fred82 && cytrouille
	Creation date : 12/09/2010
*/

// 1.3 : Correction sur l'obtention des couleurs, pour que cela marche quel que soit le thème choisi par le forumeur.

/*
	Get an HTML element by his XPath notation (see google for documentation)
*/
var getElementByXpath = function(path, element) {
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (; item = xpr.iterateNext(); ) arr.push(item);
	return arr;
}
 
// Number of maximal pages to display the end of the gradient
var getMaxPages = function() {
	return GM_getValue("hfr_pnl_pages", 10);
}
var setMaxPages = function() {
	var maxPages = prompt("Nombre de pages en retard pour atteindre la fin du dégradé", getMaxPages());
	if (isNaN(maxPages) || maxPages.length > 5) {
		alert("Valeur incorrecte, la valeur précédente est conservée" );
		maxPages = getMaxPages();
	}
	GM_setValue("hfr_pnl_pages", maxPages);
}
GM_registerMenuCommand("[HFR] Pages en retard -> Nombre de pages de retard pour atteindre la fin du dégradé", function() { setMaxPages() });
 
// Colors of the gradient : "#123456 > #123456" or "auto"
var getGradient = function() {
	return GM_getValue("hfr_pnl_gradient", "auto" );
}
var setGradient = function() {
	var gradient = prompt("Couleurs du dégradé : \"#ff0000 > #ff00ff\" ou \"auto\"", getGradient());
	var degradeRegexp = new RegExp("^#[\\da-fA-F]{6} > #[\\da-fA-F]{6}$" );
	if ((!gradient.match(degradeRegexp) && gradient != "auto" )) {
		alert("Valeur incorrecte, la valeur précédente est conservée" );
		gradient = getGradient();
	}
	GM_setValue("hfr_pnl_gradient", gradient);
}
GM_registerMenuCommand("[HFR] Pages en retard -> Dégradé de couleurs", function() { setGradient() });
 
/*
	Get URL parameter from query string
*/
function gup(query_string, name )
{
	name = name.replace(/[\[]/,"\\\[" ).replace(/[\]]/,"\\\]" );
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(query_string);
	if (results == null)
		return "";
	else
		return results[1];
}
 
// Get root
var root = document.getElementById("mesdiscussions" );
 
// Get list of topic rows
var res = getElementByXpath('//table[@class="main"]/tbody/tr', root);
 
 // Get user colors
var colors = $('link[href*="the_style1\\.php"]')[0].href.split(new RegExp("/" ));
 
// Compute colors
var startColors, endColors;
if (getGradient() == "auto" ) {
	startColors = colors[15];
	endColors = colors[8];
} else {
	startColors = getGradient().substring(1, 7);
	endColors = getGradient().substring(11, 17);
}
// Red
var startRed = parseInt(startColors.substring(0, 2), 16);
var endRed = parseInt(endColors.substring(0, 2), 16);
// Green
var startGreen = parseInt(startColors.substring(2, 4), 16);
var endGreen = parseInt(endColors.substring(2, 4), 16);
// Blue
var startBlue = parseInt(startColors.substring(4, 6), 16);
var endBlue = parseInt(endColors.substring(4, 6), 16);
// Gradients
var redGradient = Math.abs((endRed - startRed) / getMaxPages());
var greenGradient = Math.abs((endGreen - startGreen) / getMaxPages());
var blueGradient = Math.abs((endBlue - startBlue) / getMaxPages());
 
// For each row of topic
for each(var item in res) {
	// Get the last page data
	var last_page_container = getElementByXpath('td[@class="sujetCase4"]', item)[0];
 
	if (last_page_container != undefined) {
		var last_page_a = last_page_container.childNodes[0];
		var last_page = 0;
 
		if(last_page_a.nodeName != "A" ) {
			last_page = 1;
		} else {
			last_page = last_page_a.innerHTML;
		}
 
		// Get the current page data
		var current_page_container = last_page_container.nextSibling;
		var current_page_a = current_page_container.childNodes[0];
		if(current_page_a.nodeName != "A" ) {
			// No flag found
			continue;
		}
		var current_page = 0;
 
		// Extract the current page data
		if(current_page_a.href.indexOf(".htm" ) != -1) {
			// HFR textual notation for url
 
			var begin = current_page_a.href.lastIndexOf("_" );
			var end = current_page_a.href.indexOf(".htm" );
			current_page = current_page_a.href.substring(begin + 1, end);
		} else {
			// HFR parameters notation for url
			current_page = gup(current_page_a.href, 'page');
		}
 
		// Difference betwwen last page and current page
		var diff = last_page - current_page;
 
		// Background color of the cell
		var red, green, blue;
		if (diff < getMaxPages()) {
			red = Math.abs(Math.round(startRed - redGradient * diff));
			green = Math.abs(Math.round(startGreen - greenGradient * diff));
			blue = Math.abs(Math.round(startBlue - blueGradient * diff));
		} else {
			red = endRed;
			green = endGreen;
			blue = endBlue;
		}
		current_page_container.style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + " )";
 
		// Displays number of pages
		if (diff > 0) {
			var span = document.createElement("span" );
			span.style.fontSize = "xx-small";
			span.style.color = "#" + colors[14];
			span.innerHTML = "/" + diff;
			last_page_container.appendChild(span);
		}
	}
}


// ============ Module d'auto update du script ============
({
	check4Update : function()
	{
		var autoUpdate = this;
		var mirrorUrl = GM_getValue('mirrorUrl', 'null');
		if (mirrorUrl == 'null') autoUpdate.retrieveMirrorUrl();

		var currentVersion = GM_getValue('currentVersion', '1.3.0');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('1.3.0', currentVersion))
		{
			GM_setValue('currentVersion', '1.3.0');
			currentVersion = '1.3.0';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '1.3.0'))
		{
			GM_registerMenuCommand("[HFR] Nombre de pages en retard -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'others/hfr_nombre_pages_retard.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Nombre de pages en retard');
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
						if (confirm('Une nouvelle version de [HFR] Nombre de pages en retard est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'others/hfr_nombre_pages_retard.user.js');
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
