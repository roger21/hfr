// ==UserScript==
// @name [HFR] Wiki smilies & raccourcis dans la reponse/edition rapide
// @version 0.6.4b
// @namespace http://toyonos.info
// @description Rajoute le wiki smilies et des raccourcis clavier pour la mise en forme, dans la réponse rapide et dans l'édition rapide du forum hardware.fr
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

var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var $ = function ()
{
	var elements = new Array();
	for (var i = 0; i < arguments.length; i++)
	{
		var element = arguments[i];
		if (typeof element == 'string') element = document.getElementById(element);
		if (arguments.length == 1) return element;
		elements.push(element);
	}
	return elements;
}

// Script de création du menu de configuration
var cmScript =
{
	shortcuts : {
	'ws_spoiler' : {left : '[spoiler]', sample : 'texte', right : '[/spoiler]', key : 83},
	'ws_b' : {left : '[b]', sample : 'texte', right : '[/b]', key : 66},
	'ws_i' : {left : '[i]', sample : 'texte', right : '[/i]', key : 73},
	'ws_u' : {left : '[u]', sample : 'texte', right : '[/u]', key : 85},
	'ws_img' : {left : '[img]', sample : 'image', right : '[/img]', key : 80},
	'ws_img_rehost' : {left : '[img]http://hfr-rehost.net/', sample : 'image', right : '[/img]', key : 72},
	'ws_quote' : {left : '[quote]', sample : 'texte', right : '[/quote]', key : 81},
	'ws_url' : {left : '[url]', sample : 'url', right : '[/url]', key : 76},
	'ws_code' : {left : '[code]', sample : 'code', right : '[/code]', key : 67},
	'ws_fixed' : {left : '[fixed]', sample : 'texte', right : '[/fixed]', key : 70},
	'ws_strike' : {left : '[strike]', sample : 'texte', right : '[/strike]', key : 82},
	'ws_puce' : {left : '[*]', sample : 'texte', right : '', key : 220},
	'ws_color_red' : {left : '[#ff0000]', sample : '<span style="color: #ff0000">texte</span>', right : '[/#ff0000]', key : 97},
	'ws_color_blue' : {left : '[#0000ff]', sample : '<span style="color: #0000ff">texte</span>', right : '[/#0000ff]', key : 98},
	'ws_color_yellow' : {left : '[#ffff00]', sample : '<span style="color: #ffff00">texte</span>', right : '[/#ffff00]', key : 99},
	'ws_color_green' : {left : '[#00ff00]', sample : '<span style="color: #00ff00">texte</span>', right : '[/#00ff00]', key : 100},
	'ws_alerte' : {left : '[img]http://hfr.toyonos.info/generateurs/alerte/?smiley&t=', sample : 'Scripts', right : '[/img]', key : 87},
	'ws_nazi' : {left : '[img]http://hfr.toyonos.info/generateurs/nazi/?t=', sample : 'Grammar', right : '[/img]', key : 90},
	'ws_fb' : {left : '[img]http://hfr.toyonos.info/generateurs/fb/?t=', sample : 'HFR', right : '[/img]', key : 75},
	'ws_seagal' : {left : '[img]http://hfr.toyonos.info/generateurs/StevenSeagal/?t=', sample : 'Happy', right : '[/img]', key : 86},
	'ws_bulle' : {left : '[img]http://hfr.toyonos.info/generateurs/bulle/?t=', sample : 'C Ratal', right : '[/img]', key : 84}
	},
	
	//8 : "backspace", 9 : "tab", 13 : "enter", 16 : "shift", 17 : "ctrl", 18 : "alt", 19 : "pause/break", 20 : "caps lock", 27 : "escape", 33 : "page up", 34 : "page down", 35 : "end", 36 : "home", 37 : "left arrow", 38 : "up arrow", 39 : "right arrow", 40 : "down arrow", 45 : "insert", 46 : "delete", 48 : "0", 49 : "1", 50 : "2", 51 : "3", 52 : "4", 53 : "5", 54 : "6", 55 : "7", 56 : "8", 57 : "9", 65 : "a", 66 : "b", 67 : "c", 68 : "d", 69 : "e", 70 : "f", 71 : "g", 72 : "h", 73 : "i", 74 : "j", 75 : "k", 76 : "l", 77 : "m", 78 : "n", 79 : "o", 80 : "p", 81 : "q", 82 : "r", 83 : "s", 84 : "t", 85 : "u", 86 : "v", 87 : "w", 88 : "x", 89 : "y", 90 : "z", 91 : "left window key", 92 : "right window key", 93 : "select key", 96 : "numpad 0", 97 : "numpad 1", 98 : "numpad 2", 99 : "numpad 3", 100 : "numpad 4", 101 : "numpad 5", 102 : "numpad 6", 103 : "numpad 7", 104 : "numpad 8", 105 : "numpad 9", 106 : "multiply", 107 : "add", 109 : "subtract", 110 : "decimal point", 111 : "divide", 112 : "f1", 113 : "f2", 114 : "f3", 115 : "f4", 116 : "f5", 117 : "f6", 118 : "f7", 119 : "f8", 120 : "f9", 121 : "f10", 122 : "f11", 123 : "f12", 144 : "num lock", 145 : "scroll lock", 186 : "semi-colon", 187 : "equal sign", 188 : "comma", 189 : "dash", 190 : "period", 191 : "forward slash", 192 : "grave accent", 219 : "open bracket", 220 : "back slash", 221 : "close braket", 222 : "single quote"
	keysBinding : {65 : "a", 66 : "b", 67 : "c", 68 : "d", 70 : "f", 71 : "g", 72 : "h", 73 : "i", 74 : "j", 75 : "k", 76 : "l", 77 : "m", 78 : "n", 79 : "o", 80 : "p", 81 : "q", 82 : "r", 83 : "s", 84 : "t", 85 : "u", 86 : "v", 87 : "w", 88 : "x", 89 : "y", 90 : "z", 96 : "numpad 0", 97 : "numpad 1", 98 : "numpad 2", 99 : "numpad 3", 100 : "numpad 4", 101 : "numpad 5", 102 : "numpad 6", 103 : "numpad 7", 104 : "numpad 8", 105 : "numpad 9", 220 : "*"},

	backgroundDiv : null,
	
	configDiv : null,
	
	timer : null,
	
	getShortcutKey : function(id)
	{
		return GM_getValue(id, cmScript.shortcuts[id].key);	
	},
	
	get templateSmileyLeft()
	{
		return GM_getValue('ws_template_smiley_left', ' ');	
	},
	
	get templateSmileyRight()
	{
		return GM_getValue('ws_template_smiley_right', ' ');	
	},
	
	get tempoCtrl()
	{
		return GM_getValue('ws_tempo_ctrl', '500');	
	},
	
	get alwaysNotSticky()
	{
		return GM_getValue('ws_always_not_sticky', false);	
	},
	
	get activeOnMq()
	{
		return GM_getValue('ws_active_on_mq', false);	
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
		if (!$('ws_back'))
		{
			cmScript.backgroundDiv = document.createElement("div");
			cmScript.backgroundDiv.id = 'ws_back';
			cmScript.backgroundDiv.addEventListener('click', function()
			{
				clearInterval(cmScript.timer);
				cmScript.hideConfigWindow();
			}
			, false);
			cssManager.addCssProperties("#ws_back { display: none; position: absolute; left: 0px; top: 0px; background-color: #242424; z-index: 1000;}");
			document.body.appendChild(cmScript.backgroundDiv);
		}
	},
	
	selectMenuItem : function (item, tableId)
	{
		item.className = 'selected';
		var items = item.parentNode.childNodes;
		for (var i = 0; i < items.length; i++)
		{
			if (items[i] != item) items[i].className = '';
		}
		
		var table = $(tableId);
		table.style.display = 'table';
		getElementByXpath('.//table', cmScript.configDiv).filter(function(t){ return t != table; }).forEach(function(t)
		{
			t.style.display = 'none';
		}
		);
	},
	
	refreshSmileyTemplateExemple : function()
	{
		$('ws_template_smiley_exemple').innerHTML = 'texte' + $('ws_template_smiley_left').value.replace(/ /g, '&nbsp;') + '[:smiley]' + $('ws_template_smiley_right').value.replace(/ /g, '&nbsp;') + 'texte';
	},
	
	buildConfigWindow : function ()
	{
		if (!$('ws_front'))
		{	
			cmScript.configDiv = document.createElement("div");
			cmScript.configDiv.id = 'ws_front';
			cmScript.configDiv.style.width = '500px';
			var wheight = 0;
			for (var id in cmScript.shortcuts) wheight += 26;
			cmScript.configDiv.style.height = (60 + wheight) + 'px';
			cssManager.addCssProperties("#ws_front { display: none; vertical-align: bottom; position: absolute; background-color: #F7F7F7; z-index: 1001; border: 1px dotted #000; padding: 8px; text-align: right; font-family: Verdana;}");
			cssManager.addCssProperties("#ws_front input[type=text] { text-align: center; border: 1px solid black;}");
			cssManager.addCssProperties("#ws_front div { position: absolute; bottom: 8px; right: 8px;}");
			cssManager.addCssProperties("#ws_front input[type=image] { margin: 2px; }");
			cssManager.addCssProperties("#ws_front table { text-align: left; margin-bottom: 5px; width: 100%; font-size: 0.75em; font-weight: bold;}");

			// Construction du menu
			var menu = document.createElement('ul');
			menu.id = 'ws_front_menu';
			cssManager.addCssProperties("#ws_front_menu { margin: 8px 0 10px 0px; padding: 0; width : 100%; text-align: left;}");
			cssManager.addCssProperties("#ws_front_menu li { display: inline; list-style-type: none; padding: 3px; margin-right: 5px; border: 1px solid black; font-size: 0.7em; background-color: #DEDFDF; cursor: pointer;}");
			cssManager.addCssProperties("#ws_front_menu li.selected { font-weight: bold; font-style: italic;}");
			cmScript.configDiv.appendChild(menu);
			
			// Le panneau de configuration des raccourcis claviers...
			var newTable = document.createElement('table');
			newTable.id = 'ws_front_rc';
			newTable.style.display = 'table';
			var firstShortcut = true;
			for (var id in cmScript.shortcuts)
			{
				var newTr = document.createElement('tr');
				var newTd = document.createElement('td');
				newTd.innerHTML = cmScript.shortcuts[id].left + '<span style="font-weight: normal;">' + cmScript.shortcuts[id].sample + '</span>' + cmScript.shortcuts[id].right;
				newTr.appendChild(newTd);
				newTd = document.createElement('td');
				newTd.style.textAlign = 'right';
				var newInput = document.createElement('input');
				newInput.id = id;
				newInput.type = 'text';
				newInput.size = '10';
				newInput.setAttribute('key', cmScript.getShortcutKey(id));
				newInput.addEventListener('keydown', function(event){ if (event.which != 9) event.preventDefault(); }, false);
				newInput.addEventListener('keyup', function(event)
				{
					var key = event.which;
					if (key == 8 || key == 46 || key == 110)
					{
						this.value = '';
						this.setAttribute('key', '');
					}
					else if (key != 9 && cmScript.keysBinding[key] != undefined)
					{
						this.value = cmScript.keysBinding[key];
						this.setAttribute('key', key);
					}
					else if (key != 9) event.preventDefault();
				}
				, false);
				if (firstShortcut)
				{
					cmScript.disableTabUp(newInput);
					firstShortcut = false;
				}
				newTd.appendChild(newInput);
				newTr.appendChild(newTd);
				newTable.appendChild(newTr);
			}
			cmScript.configDiv.appendChild(newTable);
			// ... et son menu
			var menuElt = document.createElement('li');
			menuElt.className = 'selected';
			menuElt.innerHTML = 'Raccourcis clavier';
			menuElt.addEventListener('click', function(){ cmScript.selectMenuItem(this, 'ws_front_rc'); }, false);
			menu.appendChild(menuElt);
			
			// Le panneau de configuration des smilies
			newTable = document.createElement('table');
			newTable.id = 'ws_front_ps';
			newTable.style.display = 'none';
			// Template d'insertion des smilies
			var newTr = document.createElement('tr');
			var newTd = document.createElement('td');
			var helpImg = document.createElement('img');
			helpImg.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%A4IDAT8%CB%A5%93%DDO%92a%18%C6%FD%5B%E0Oh%AD%E6j%D5j%9D%D5%D68%E8%A0%03%A7%E6'%D0%D4r%B5%0C%96%B3t%98%D3%2C)53%9D%0Aj%EA%9C%8A%02o%02%22%88%26%CA%97%20%F0b%22_%CA%C7Dx%E1U%B3%ED%EA%8D5%9C%CB%D9Z%07%BF%93%7B%CF%F5%DB%AEg%F7%9D%03%20%E7%7F%F8c%A0%23%0F%D9Z%F7%81%40%E3%DC'U%EB4%F5%C5%9E%A2%146%8A%9C%B1%24%04S%A6%3D%F6%99%02%B5%93%E6%CC%3A%D2!O%F8%10%1B%3B4%DCA*%83g%3B%0DG%20%8D%91%C5hhh!%CC9U%40%AC%A58rk2%B5%19%D9%87%F9%DB.%A4s~%88%C6%9C%A8%1FYG%17%B1%01%83%23%0AW%88%C2'%95%3F%D5ElqN%08d%E6%04kr5%1E%DC%08%D3Xp%C6P%CB%84%3A%09%0F%FC1%1A%BEX%1Ac%8B%01%D4H%ADP%AE%86%60%F7%25%D0%3AI%06%9B%C7%5D%AC%AC%60t)*%5C%F3%A7%B0%E2%89C8h%C7%E3%1E3%D2%07G%0C%3F~s%84%DAA%0Bj%FAM%98%B7G%A0%5D%8B%A0Nj%15f%05%7Ds!%D2%C5t%ED%266Q%DDcBU%F7%0A%FC%D14%A6%96%03P%DB%B6A3%02%B5-%08n%BB%0E%ADS%0EX%BD%BBx%D2m%24%B3%82%0E%85%97v%07%93%10J%2C%A8%FCh%04%AF%D3%C0%3C%D6c%DA%E8%C3.u%80%9D%5D%1A%BD%B3.%94%B6iQ%F9A%0F%87o%0F%3C%B1%9E%CE%0AZ%C6%5D%B4%2B%90%C4%D3%01%0B%B8%1Dz%94%BF%D7%A1%EC%9D%0EI%FA%3B%B6%22%14%F8b-%8AZT%B8%CF%C0%17k%60%F7%C7%91%DF%A4%3E%16%BC%90%DAH%DBV%1Cb%99%0B%BCv%03%CA%C4%F3(y%3B%87%E2%D7%EA%0C%85%AF%08%146*P%D0(G%BDt%19FO%04w%EB%E4%C7%15%98%3EB%851%00%BD%23%82%CA%0EC6%18K%EC%23%B2G%23O4%93%A1P%24%03%B1%EA%83%84%A9s%ABf%E2%F8%13%F9%E2%05V%F9%9B%F9%E0%923%02%E5%8A%1F%DC6%0D%0A%9A%94h%1B7e%F8%15%CEo%98%C0%B0%C6%0D%8D%25%80%9B%D5c%C1%EB%0FGY'%16)O4%CB%B9%D7%40%A4t%F6m%A8%ADA%BC%94%2C%A1%A4Y%8E%A2%C6i%3C%EF%D5Ci%F4Be%F6%E3j%C5%E7%D4%E5%07C%9CSW%F9%8EP%C6%B9%FDl2%D4G%AC%E3%AB%3B%0C%8B7%96a%D1%B9%83.%99%0D%B9%3Ci%E8b%B9%84s%E61%DDx4%CA%BEV5%22%B8R1L%5E%E2%0FR%B9%5C)u%A1l%80%3C_%DA%2F8W%DC%C7%FE%EB5%FE%2B%3F%01%D7%AF%05%A2%BDM%BD%C4%00%00%00%00IEND%AEB%60%82";
			helpImg.alt = 'help';
			helpImg.title = "Caractères qui seront insérés avant et après un smiley lors d'un clic sur ce dernier";
			helpImg.style.verticalAlign = 'text-bottom';
			helpImg.style.cursor = 'help';
			newTd.innerHTML = 'Template d\'insertion du smiley ';
			newTd.appendChild(helpImg);
			newTd.rowSpan = '2';
			newTr.appendChild(newTd);
			newTd = document.createElement('td');
			newTd.style.textAlign = 'right';
			newTd.style.fontWeight = 'normal';
			var newInput = document.createElement('input');
			newInput.id = 'ws_template_smiley_left';
			newInput.type = 'text';
			newInput.size = '2';
			newInput.maxLength = '5';
			newInput.addEventListener('keyup', cmScript.refreshSmileyTemplateExemple, false);
			cmScript.disableTabUp(newInput);
			newTd.appendChild(newInput);
			newTd.appendChild(document.createTextNode('[:smiley]'));
			newInput = document.createElement('input');
			newInput.id = 'ws_template_smiley_right';
			newInput.type = 'text';
			newInput.size = '2';
			newInput.maxLength = '5';
			newInput.addEventListener('keyup', cmScript.refreshSmileyTemplateExemple, false);
			newTd.appendChild(newInput);
			newTr.appendChild(newTd);
			newTable.appendChild(newTr);
			newTr = document.createElement('tr');
			newTd = document.createElement('td');
			newTd.id = 'ws_template_smiley_exemple';
			newTd.style.textAlign = 'right';
			newTd.style.fontStyle = 'italic';
			newTd.style.fontWeight = 'normal';
			newTr.appendChild(newTd);
			newTable.appendChild(newTr);			
			cmScript.configDiv.appendChild(newTable);
			// Temporisation du double ctrl
			newTr = document.createElement('tr');
			newTd = document.createElement('td');
			helpImg = document.createElement('img');
			helpImg.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%A4IDAT8%CB%A5%93%DDO%92a%18%C6%FD%5B%E0Oh%AD%E6j%D5j%9D%D5%D68%E8%A0%03%A7%E6'%D0%D4r%B5%0C%96%B3t%98%D3%2C)53%9D%0Aj%EA%9C%8A%02o%02%22%88%26%CA%97%20%F0b%22_%CA%C7Dx%E1U%B3%ED%EA%8D5%9C%CB%D9Z%07%BF%93%7B%CF%F5%DB%AEg%F7%9D%03%20%E7%7F%F8c%A0%23%0F%D9Z%F7%81%40%E3%DC'U%EB4%F5%C5%9E%A2%146%8A%9C%B1%24%04S%A6%3D%F6%99%02%B5%93%E6%CC%3A%D2!O%F8%10%1B%3B4%DCA*%83g%3B%0DG%20%8D%91%C5hhh!%CC9U%40%AC%A58rk2%B5%19%D9%87%F9%DB.%A4s~%88%C6%9C%A8%1FYG%17%B1%01%83%23%0AW%88%C2'%95%3F%D5ElqN%08d%E6%04kr5%1E%DC%08%D3Xp%C6P%CB%84%3A%09%0F%FC1%1A%BEX%1Ac%8B%01%D4H%ADP%AE%86%60%F7%25%D0%3AI%06%9B%C7%5D%AC%AC%60t)*%5C%F3%A7%B0%E2%89C8h%C7%E3%1E3%D2%07G%0C%3F~s%84%DAA%0Bj%FAM%98%B7G%A0%5D%8B%A0Nj%15f%05%7Ds!%D2%C5t%ED%266Q%DDcBU%F7%0A%FC%D14%A6%96%03P%DB%B6A3%02%B5-%08n%BB%0E%ADS%0EX%BD%BBx%D2m%24%B3%82%0E%85%97v%07%93%10J%2C%A8%FCh%04%AF%D3%C0%3C%D6c%DA%E8%C3.u%80%9D%5D%1A%BD%B3.%94%B6iQ%F9A%0F%87o%0F%3C%B1%9E%CE%0AZ%C6%5D%B4%2B%90%C4%D3%01%0B%B8%1Dz%94%BF%D7%A1%EC%9D%0EI%FA%3B%B6%22%14%F8b-%8AZT%B8%CF%C0%17k%60%F7%C7%91%DF%A4%3E%16%BC%90%DAH%DBV%1Cb%99%0B%BCv%03%CA%C4%F3(y%3B%87%E2%D7%EA%0C%85%AF%08%146*P%D0(G%BDt%19FO%04w%EB%E4%C7%15%98%3EB%851%00%BD%23%82%CA%0EC6%18K%EC%23%B2G%23O4%93%A1P%24%03%B1%EA%83%84%A9s%ABf%E2%F8%13%F9%E2%05V%F9%9B%F9%E0%923%02%E5%8A%1F%DC6%0D%0A%9A%94h%1B7e%F8%15%CEo%98%C0%B0%C6%0D%8D%25%80%9B%D5c%C1%EB%0FGY'%16)O4%CB%B9%D7%40%A4t%F6m%A8%ADA%BC%94%2C%A1%A4Y%8E%A2%C6i%3C%EF%D5Ci%F4Be%F6%E3j%C5%E7%D4%E5%07C%9CSW%F9%8EP%C6%B9%FDl2%D4G%AC%E3%AB%3B%0C%8B7%96a%D1%B9%83.%99%0D%B9%3Ci%E8b%B9%84s%E61%DDx4%CA%BEV5%22%B8R1L%5E%E2%0FR%B9%5C)u%A1l%80%3C_%DA%2F8W%DC%C7%FE%EB5%FE%2B%3F%01%D7%AF%05%A2%BDM%BD%C4%00%00%00%00IEND%AEB%60%82";
			helpImg.alt = 'help';
			helpImg.title = "Temps maximum autorisé pour effectuer le double contrôle (en ms)";
			helpImg.style.verticalAlign = 'text-bottom';
			helpImg.style.cursor = 'help';
			newTd.innerHTML = 'Temporisation double contrôle ';
			newTd.appendChild(helpImg);
			newTr.appendChild(newTd);
			newTd = document.createElement('td');
			newTd.style.textAlign = 'right';
			var newInput = document.createElement('input');
			newInput.id = 'ws_tempo_ctrl';
			newInput.type = 'text';
			newInput.size = '3';
			newInput.maxLength = '4';
			newTd.appendChild(newInput);
			newTr.appendChild(newTd);
			newTable.appendChild(newTr);
			// Zone de réponse détachable
			newTr = document.createElement('tr');
			newTd = document.createElement('td');
			helpImg = document.createElement('img');
			helpImg.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%A4IDAT8%CB%A5%93%DDO%92a%18%C6%FD%5B%E0Oh%AD%E6j%D5j%9D%D5%D68%E8%A0%03%A7%E6'%D0%D4r%B5%0C%96%B3t%98%D3%2C)53%9D%0Aj%EA%9C%8A%02o%02%22%88%26%CA%97%20%F0b%22_%CA%C7Dx%E1U%B3%ED%EA%8D5%9C%CB%D9Z%07%BF%93%7B%CF%F5%DB%AEg%F7%9D%03%20%E7%7F%F8c%A0%23%0F%D9Z%F7%81%40%E3%DC'U%EB4%F5%C5%9E%A2%146%8A%9C%B1%24%04S%A6%3D%F6%99%02%B5%93%E6%CC%3A%D2!O%F8%10%1B%3B4%DCA*%83g%3B%0DG%20%8D%91%C5hhh!%CC9U%40%AC%A58rk2%B5%19%D9%87%F9%DB.%A4s~%88%C6%9C%A8%1FYG%17%B1%01%83%23%0AW%88%C2'%95%3F%D5ElqN%08d%E6%04kr5%1E%DC%08%D3Xp%C6P%CB%84%3A%09%0F%FC1%1A%BEX%1Ac%8B%01%D4H%ADP%AE%86%60%F7%25%D0%3AI%06%9B%C7%5D%AC%AC%60t)*%5C%F3%A7%B0%E2%89C8h%C7%E3%1E3%D2%07G%0C%3F~s%84%DAA%0Bj%FAM%98%B7G%A0%5D%8B%A0Nj%15f%05%7Ds!%D2%C5t%ED%266Q%DDcBU%F7%0A%FC%D14%A6%96%03P%DB%B6A3%02%B5-%08n%BB%0E%ADS%0EX%BD%BBx%D2m%24%B3%82%0E%85%97v%07%93%10J%2C%A8%FCh%04%AF%D3%C0%3C%D6c%DA%E8%C3.u%80%9D%5D%1A%BD%B3.%94%B6iQ%F9A%0F%87o%0F%3C%B1%9E%CE%0AZ%C6%5D%B4%2B%90%C4%D3%01%0B%B8%1Dz%94%BF%D7%A1%EC%9D%0EI%FA%3B%B6%22%14%F8b-%8AZT%B8%CF%C0%17k%60%F7%C7%91%DF%A4%3E%16%BC%90%DAH%DBV%1Cb%99%0B%BCv%03%CA%C4%F3(y%3B%87%E2%D7%EA%0C%85%AF%08%146*P%D0(G%BDt%19FO%04w%EB%E4%C7%15%98%3EB%851%00%BD%23%82%CA%0EC6%18K%EC%23%B2G%23O4%93%A1P%24%03%B1%EA%83%84%A9s%ABf%E2%F8%13%F9%E2%05V%F9%9B%F9%E0%923%02%E5%8A%1F%DC6%0D%0A%9A%94h%1B7e%F8%15%CEo%98%C0%B0%C6%0D%8D%25%80%9B%D5c%C1%EB%0FGY'%16)O4%CB%B9%D7%40%A4t%F6m%A8%ADA%BC%94%2C%A1%A4Y%8E%A2%C6i%3C%EF%D5Ci%F4Be%F6%E3j%C5%E7%D4%E5%07C%9CSW%F9%8EP%C6%B9%FDl2%D4G%AC%E3%AB%3B%0C%8B7%96a%D1%B9%83.%99%0D%B9%3Ci%E8b%B9%84s%E61%DDx4%CA%BEV5%22%B8R1L%5E%E2%0FR%B9%5C)u%A1l%80%3C_%DA%2F8W%DC%C7%FE%EB5%FE%2B%3F%01%D7%AF%05%A2%BDM%BD%C4%00%00%00%00IEND%AEB%60%82";
			helpImg.alt = 'help';
			helpImg.title = "Activer en permance la zone de réponse flottante au chargement d'une page";
			helpImg.style.verticalAlign = 'text-bottom';
			helpImg.style.cursor = 'help';
			newTd.innerHTML = 'Zone de réponse flottante permanente ? ';
			newTd.appendChild(helpImg);
			newTr.appendChild(newTd);
			newTd = document.createElement('td');
			newTd.style.textAlign = 'right';
			var newInput = document.createElement('input');
			newInput.id = 'ws_always_not_sticky';
			newInput.type = 'checkbox';
			newTd.appendChild(newInput);
			newTr.appendChild(newTd);
			newTable.appendChild(newTr);
			// Activation zone détachable sur clic multi quote
			newTr = document.createElement('tr');
			newTd = document.createElement('td');
			helpImg = document.createElement('img');
			helpImg.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%A4IDAT8%CB%A5%93%DDO%92a%18%C6%FD%5B%E0Oh%AD%E6j%D5j%9D%D5%D68%E8%A0%03%A7%E6'%D0%D4r%B5%0C%96%B3t%98%D3%2C)53%9D%0Aj%EA%9C%8A%02o%02%22%88%26%CA%97%20%F0b%22_%CA%C7Dx%E1U%B3%ED%EA%8D5%9C%CB%D9Z%07%BF%93%7B%CF%F5%DB%AEg%F7%9D%03%20%E7%7F%F8c%A0%23%0F%D9Z%F7%81%40%E3%DC'U%EB4%F5%C5%9E%A2%146%8A%9C%B1%24%04S%A6%3D%F6%99%02%B5%93%E6%CC%3A%D2!O%F8%10%1B%3B4%DCA*%83g%3B%0DG%20%8D%91%C5hhh!%CC9U%40%AC%A58rk2%B5%19%D9%87%F9%DB.%A4s~%88%C6%9C%A8%1FYG%17%B1%01%83%23%0AW%88%C2'%95%3F%D5ElqN%08d%E6%04kr5%1E%DC%08%D3Xp%C6P%CB%84%3A%09%0F%FC1%1A%BEX%1Ac%8B%01%D4H%ADP%AE%86%60%F7%25%D0%3AI%06%9B%C7%5D%AC%AC%60t)*%5C%F3%A7%B0%E2%89C8h%C7%E3%1E3%D2%07G%0C%3F~s%84%DAA%0Bj%FAM%98%B7G%A0%5D%8B%A0Nj%15f%05%7Ds!%D2%C5t%ED%266Q%DDcBU%F7%0A%FC%D14%A6%96%03P%DB%B6A3%02%B5-%08n%BB%0E%ADS%0EX%BD%BBx%D2m%24%B3%82%0E%85%97v%07%93%10J%2C%A8%FCh%04%AF%D3%C0%3C%D6c%DA%E8%C3.u%80%9D%5D%1A%BD%B3.%94%B6iQ%F9A%0F%87o%0F%3C%B1%9E%CE%0AZ%C6%5D%B4%2B%90%C4%D3%01%0B%B8%1Dz%94%BF%D7%A1%EC%9D%0EI%FA%3B%B6%22%14%F8b-%8AZT%B8%CF%C0%17k%60%F7%C7%91%DF%A4%3E%16%BC%90%DAH%DBV%1Cb%99%0B%BCv%03%CA%C4%F3(y%3B%87%E2%D7%EA%0C%85%AF%08%146*P%D0(G%BDt%19FO%04w%EB%E4%C7%15%98%3EB%851%00%BD%23%82%CA%0EC6%18K%EC%23%B2G%23O4%93%A1P%24%03%B1%EA%83%84%A9s%ABf%E2%F8%13%F9%E2%05V%F9%9B%F9%E0%923%02%E5%8A%1F%DC6%0D%0A%9A%94h%1B7e%F8%15%CEo%98%C0%B0%C6%0D%8D%25%80%9B%D5c%C1%EB%0FGY'%16)O4%CB%B9%D7%40%A4t%F6m%A8%ADA%BC%94%2C%A1%A4Y%8E%A2%C6i%3C%EF%D5Ci%F4Be%F6%E3j%C5%E7%D4%E5%07C%9CSW%F9%8EP%C6%B9%FDl2%D4G%AC%E3%AB%3B%0C%8B7%96a%D1%B9%83.%99%0D%B9%3Ci%E8b%B9%84s%E61%DDx4%CA%BEV5%22%B8R1L%5E%E2%0FR%B9%5C)u%A1l%80%3C_%DA%2F8W%DC%C7%FE%EB5%FE%2B%3F%01%D7%AF%05%A2%BDM%BD%C4%00%00%00%00IEND%AEB%60%82";
			helpImg.alt = 'help';
			helpImg.title = "Activer la zone de réponse flottante par un double clic sur l'icône de multi-quotes";
			helpImg.style.verticalAlign = 'text-bottom';
			helpImg.style.cursor = 'help';
			newTd.innerHTML = 'Zone de réponse flottante pour le multi-quotes ? ';
			newTd.appendChild(helpImg);
			newTr.appendChild(newTd);
			newTd = document.createElement('td');
			newTd.style.textAlign = 'right';
			var newInput = document.createElement('input');
			newInput.id = 'ws_active_on_mq';
			newInput.type = 'checkbox';
			newTd.appendChild(newInput);
			newTr.appendChild(newTd);
			newTable.appendChild(newTr);			
			// ... et le menu
			menuElt = document.createElement('li');
			menuElt.innerHTML = 'Paramétrage divers';
			menuElt.addEventListener('click', function(){ cmScript.selectMenuItem(this, 'ws_front_ps'); }, false);
			menu.appendChild(menuElt);
			
			var buttonsContainer = document.createElement('div');
			var inputOk = document.createElement('input');
			inputOk.type = 'image';
			inputOk.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%9FIDAT8%CB%A5%93%EBKSa%1C%C7%FD%3Bv%CEvl%03%09dD!%82%84P%7B%15%24%12%3B%9A%0D%C5%BC%2CK%D3%DD%BD%D26c%D8L%8B2r%5E%C6H)-%B3%D4jsNm%EA%D4%E6%D6%942q%D9QB%CC%BD%E9B%B5at%B1o%E7%EC%C5L%12%23z%E0%0B%0F%0F%CF%E7%F3%7B%AEq%00%E2%FE'%7F%0C%14%F8%0E%89r%A7%0F%EA%B3%3D)L%C6%E3%FDa%E9%888%2Cu%252Rg%A2%3E%DD%BEW%B4%AB%20%CF%9BJ%CB%3C%C9!%9DG%86%9BA%0B%FA%96%BB%A2%E9%5ClF%89%EB%18%24%BDTH%D2C%D1%3B%0A%D8%AAt%E6xR%E4%EA%9C%11%CE%D5~%D8%5E%5E%83i%AE2%1A%AE%EFX%EDC%E3L%15%0E%D8%F8%91d%1B%9F%DE%26%C8%F1%A4%083%DDI%EB%1C%CCM%AC%09%94%A1%C2_%02%CD%CC%19%E8%D8%94%B3%A9%F6%9D%85%FD%F5%3D%5C%9C%AA%80%D8B%AE%8B%AF%93%C2%98%40%E6N2%A8%C6%B2%A2%959%98%03U%DESPL%17B1U%00%F5T!%DCk%830x%95p%B0%92%DC%9E%23H%B8B%1Ab%82%8C%111%D3%19l%865%D8%84%0A_1%94O%E4%2C%98%0F%E5%24%1BO%3E%C6%DF%B8%C0%B5Pd%0Dm%CF%1Ba%9BkD%7C%3D%C9%C4%04G%ED%09%1B%0FVn%A36%A0%81%D6%5B%C4%AEd%00%8B%1F%E6%A1%9A(%C4%D8%DAP%14%FE%B1%F9%1Dm%CF.%C10Q%8C%BE%60'%04Fb%23%26%90%DC%A76%FA%97%BBa%F4%ABP%EB%D7%E2%D3%D7%8FQ%E8%FD%97%B71%D82%5B%0F%B5%2B%1Bz%F7i%F4%07%3B%20%A8%F9%5D%D0C17%E6%9B%D0%BEp%19%BAI9%CC%BEjD%BE%7D%8E%C2%9B%3F7ayz%01e%CE%2ChXAK%A0%0E%ED%5E3%A8*bk%0B%A9%B7%04%06%F9%40%1A%EC%2BwQ%3D!%87%DA%7D%12u%D3%E5Xz%B7%80%B6%D9%06%94%0E%1E%87%C2q%02%3Ag%0E%EC%AF%BA%91n%3D%0C%AA%92%D8%3A%C4d%2B_%B8%8F%BD%1A%B3G%83%87%CC%1DT%8E%E6A%3B%9C%03%D5%90%0CJ%07%17%0E%CE%C6%A3%A5.%18%87%8A!P%F3%D6)5!%DC%F6%90%12%9BH%3A%BE%81%88%98%DCep%B0%92%D6%80%19%FA%D1%22%9C%1B%96%A3%95%DD%82%9D%85%F5%CE%22%F0Ky%11%16%A6w%7C%CA%7B%1AH%9A2%11!i%87%04%ED~3z_X%D1%3Bo%85%C5kBZK*%04%0A%5E%88R%11%F4%AE%9F%89%3AO%8A(%03%A1%A7j%08F%A0%E5%85%05*%5E%98%AD%C8%B0%D1S%A5%84%E8%AF%BF%F1_%F3%0Bg%D0%AC%E5y%BA%D4c%00%00%00%00IEND%AEB%60%82";
			inputOk.alt = 'valider';
			inputOk.addEventListener('click', cmScript.validateConfig, false);
			
			var inputCancel = document.createElement('input');
			inputCancel.type = 'image';
			inputCancel.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02!IDAT8%CB%95%93%EBN%13Q%14%85%89%89%C9%89%CF%A0V%89%86%C8%91%80%C4%1BB%5B%06(%AD%0D%08%26%D0%FB%85%5E%A4%80%B4%A5%ED%A4M%A16%EA%0FM%7C%12%9F%0BD%C5%DE%B0%D2%99v%3A%D3%E5%AE%98J-%25%E1%C7N%CEd%CE%FA%F6%AC%B5%F7%0C%00%18%B8L%D5%D7B%D7%CE%3Ew_%103%3A*%DEW%EC%0Fr%D9%ED%8D%D7lNC%2F%A0-%CE%EC%A2%95%CEB%8B'%7B%20u_%80%D7%03a46%B6%F0%EB%E5%CA%E7%EA%E2%D2%BD%7F%80%BFb%E4%DF%A1E%A5%25D47%B7%3B%10%D9%BB%C6%A9%3B%9A%D18%90%CB%A3%7D%3E6%5B%E3%E5%19%D3%95S%40*%CDZ%09Qk%ED%BE%01%3E~%82%96%CD%B5%01h%04B%5C%F6%F89u%87%B2%1D%03%E8%BD%EC%0F%E0x%FE%B9Z%16%E6%AEvY%D0b%09%A6%BE%8E%A9%9A%98%01%DE%7F%80%9AJ%A3%1E%0C%83%BAC%D9%8A%02%D9%BD%3F%E7%8A%C9B%E2Yvn%88%CD%C8%26k%84%D6%D5ft%87%EC%BC%05%F6%F2%24%CC%01%99%2Cd%8F%0F%959%B3Z%9E%9Ea%FD%A7p%1A%16%93%5C%5E%0DY%B2%E3%F6%01%0E7%20%A6Q%99%9D%D7JF%81%FD%7F%BF%07%209%3D%EDQ%014%0D%D8%9C%C0%8A%1D%D8I%92o%0B%0A%13S%FCB%80%E4ps%C9%E5%81%12%8E%00I%91%84)%20Fv(%40y%D5%8E%B2%DE%88%EFc%E3%FC%5C%40%CD%EE%E2%92%D3%0D%25%B4%0E%D0%18%25%87%0B%14%96Z%9C2h'%8B%CB%40d%03%B5%17%CB(%3C%7C%8C%C3%A1a%DE%05%A0%CD%E2%D4%1DJ%F0%15uM%40%A2O%A7%B0%D4%E2%A4%81%15%9EL%B0%A3%F1Gj%D5d%06%82!%9CX%AC8%1A%19%C5%C1%ADA%DE%01%D0f%095%9B%03J%20%04i%D5%01%0AK-%3E%D3w%02%FB62%C6%BE%0E%DFW%7F%1A%05H%D6%05%FC%18%7D%80%FD%1B%3A%A1%CB%02m%96P%5DXB%C90%ADQX%3Di%1F%DE%1Db_%06%EF%A8g%C5%3D!%96%F4F%A1%F0t%92%F5%FB%99%0Et%B7%D9%FE%F5%9B%C2%85c%BCl%FD%06r%BB%A4%C7%DB%ED%BE%14%00%00%00%00IEND%AEB%60%82";
			inputCancel.alt = 'annuler';
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
		getElementByXpath('.//table[contains(@style, "table")]//input[starts-with(@id, "ws_")]', $('ws_front')).forEach(function(input)
		{
			var value = null;
			if (input.getAttribute('key'))
			{
				value = input.getAttribute('key');
			}
			else if (input.type == 'checkbox')
			{
				value = input.checked;
			}
			else
			{
				value = input.value;
			}
			GM_setValue(input.id, value);
		}
		);
		cmScript.hideConfigWindow();	
	},
	
	initBackAndFront : function()
	{
		if ($('ws_back'))
		{
			cmScript.setBackgroundPosition();
			cmScript.backgroundDiv.style.opacity = 0;
			cmScript.backgroundDiv.style.display = 'block';
		}
		
		if ($('ws_front'))
		{
			for (var id in cmScript.shortcuts)
			{
				if (cmScript.getShortcutKey(id) != '') $(id).value = cmScript.keysBinding[cmScript.getShortcutKey(id)];
			}
			$('ws_template_smiley_left').value = cmScript.templateSmileyLeft;
			$('ws_template_smiley_right').value = cmScript.templateSmileyRight;
			$('ws_tempo_ctrl').value = cmScript.tempoCtrl;
			$('ws_always_not_sticky').checked = cmScript.alwaysNotSticky == true;
			$('ws_active_on_mq').checked = cmScript.activeOnMq == true;
			cmScript.refreshSmileyTemplateExemple();
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
		GM_registerMenuCommand("[HFR] Wiki smilies & raccourcis dans la réponse/édition rapide -> Configuration", this.showConfigWindow);
	}
};

cmScript.setUp();
cmScript.createConfigMenu();

var getKeyWords = function (code, cbf)
{
	toyoAjaxLib.loadDoc('http://forum.hardware.fr/wikismilies.php', 'get', 'config=hfr.inc&detail=' + code, function(pageContent)
	{
		var keyWords = pageContent.match(/name="keywords0"\s*value="(.*)"\s*onkeyup/).pop();
		cbf(keyWords);
	}
	);
}

if ($('content_form'))
{
	var newDiv = document.createElement("div" );
	newDiv.setAttribute("style","position: absolute;display: none;");
	newDiv.innerHTML = '<input id="search_smilies" type="text" style="height: 16px;width: 100px" autocomplete="off" />';
	$('content_form').parentNode.appendChild(newDiv);
	
	newDiv = document.createElement("div" );
	newDiv.id = 'dynamic_smilies';
	newDiv.setAttribute("style","text-align: center;");	
	$('content_form').parentNode.appendChild(newDiv);
	
	var hideWikiSmilies = function ()
	{
		$("search_smilies").parentNode.style.display = "none";
		findSmiliesBuffer = '';
	}
	
	var searchSmilies = function (event, textAreaId, targetId, changeDisplay)
	{
		if (ctrl == 1 && (new Date().getTime() - firstClickTime) > cmScript.tempoCtrl) ctrl = 0;
		if (ctrl == 0) firstClickTime = new Date().getTime();
		var key = event.keyCode ? event.keyCode : event.which;
		ctrl = key == 17 ? ctrl+1 : 0;
		if (ctrl == 2)
		{
			ctrl = 0;
			var ss = $("search_smilies").parentNode;
			if (ss.style.display != "block")
			{
				// Preparation du champ de recherche...
				
				// Vidage des smilies
				$(targetId).innerHTML = '';
				
				// Disposition
				var c = $(textAreaId);
				var cw = c.clientWidth;
				var ch = c.clientHeight;
				if (changeDisplay) c.style.position = 'absolute';
				var offsetLeft = GetDomOffset(c, "offsetLeft");
				ss.style.left = ((cw / 2) - 50 + offsetLeft) + "px";
				
				var offsetTop = GetDomOffset(c, "offsetTop");
				ss.style.top = ((ch / 2) - 12 + offsetTop) + "px";
				
				if (changeDisplay) c.style.position = 'static';
				ss.style.display = "block";
				
				// Initialisation
				ss.firstChild.value = '';
				ss.firstChild.focus();
				currentTextarea = c;
				currentTarget = targetId;
			}
			else
			{
				currentTextarea.focus();
			}
		}
	}
	
	function putSmiley(code, textAreaId)
	{
		insertBBCode(textAreaId, cmScript.templateSmileyLeft + code + cmScript.templateSmileyRight, '');
		$("search_smilies").parentNode.style.display = "none";
	}
	
	var insertBBCode = function (textAreaId, left, right)
	{
		var content = $(textAreaId);
		if (content.selectionStart || content.selectionStart == 0)
		{
			if (content.selectionEnd > content.value.length) content.selectionEnd = content.value.length;
			var firstPos = content.selectionStart;
			var secondPos = content.selectionEnd + left.length;
			var contenuScrollTop=content.scrollTop;
			
			content.value = content.value.slice(0,firstPos) + left + content.value.slice(firstPos);
			content.value = content.value.slice(0,secondPos) + right + content.value.slice(secondPos);
			
			content.selectionStart = firstPos + left.length;
			content.selectionEnd = secondPos;
			content.focus();
			content.scrollTop = contenuScrollTop;
		}
	}
	
	var proceedShortcut = function (event, textAreaId)
	{
		var key = event.keyCode ? event.keyCode : event.which;
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_spoiler')) insertBBCode(textAreaId, "[spoiler]", "[/spoiler]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_b')) insertBBCode(textAreaId, "[b]", "[/b]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_i')) insertBBCode(textAreaId, "[i]", "[/i]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_u')) insertBBCode(textAreaId, "[u]", "[/u]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_img')) insertBBCode(textAreaId, "[img]", "[/img]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_img_rehost')) insertBBCode(textAreaId, "[img]http://hfr-rehost.net/", "[/img]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_quote')) insertBBCode(textAreaId, "[quote]", "[/quote]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_url'))
		{
			var url = window.prompt('Entrez l\'url :', 'http://');
			var left = url == null || url == '' ? "[url=" : "[url=" + url + "]"
			var right = url == null || url == '' ? "][/url]" : "[/url]"
			insertBBCode(textAreaId, left, right);
		}
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_code'))
		{
			var language = window.prompt('Entrez le nom du langage :');
			insertBBCode(textAreaId, language == null || language == '' ? "[code]" : "[code=" + language + "]", "[/code]")
		};
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_fixed')) insertBBCode(textAreaId, "[fixed]", "[/fixed]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_strike')) insertBBCode(textAreaId, "[strike]", "[/strike]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_puce')) insertBBCode(textAreaId, "[*]", "");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_color_red')) insertBBCode(textAreaId, "[#ff0000]", "[/#ff0000]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_color_blue')) insertBBCode(textAreaId, "[#0000ff]", "[/#0000ff]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_color_yellow')) insertBBCode(textAreaId, "[#ffff00]", "[/#ffff00]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_color_green')) insertBBCode(textAreaId, "[#00ff00]", "[/#00ff00]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_alerte')) insertBBCode(textAreaId, "[img]http://hfr.toyonos.info/generateurs/alerte/?smiley&t=", "[/img]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_nazi')) insertBBCode(textAreaId, "[img]http://hfr.toyonos.info/generateurs/nazi/?t=", "[/img]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_fb')) insertBBCode(textAreaId, "[img]http://hfr.toyonos.info/generateurs/fb/?t=", "[/img]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_seagal')) insertBBCode(textAreaId, "[img]http://hfr.toyonos.info/generateurs/StevenSeagal/?t=", "[/img]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_bulle'))
		{
			var url = 'http://hfr.toyonos.info/generateurs/bulle/?t=';
			var text = window.prompt('Entrez le contenu de la bulle :');
			url += text;
			
			var smiley = window.prompt('Entrez le code du smiley si nécessaire :');
			if (smiley != null && smiley != '')
			{
				url += '&s=' + smiley;
				var rang = window.prompt('Quel est son rang ?', '0');
				if (rang != null && rang != '' && rang != '0') url += '&r=' + rang;
			}
			else
			{
				var delta = window.prompt('Décalage du smiley (en pixels) :');
				if (delta != null && delta != '') url += '&d=' + delta;
			}

			insertBBCode(textAreaId, "[img]" + url, "[/img]");
		}
	}
	
	var findSmilies = function (inputId, targetId)
	{
		clearTimeout(timerSmilies);
		var hashCheck = getElementByXpath('//input[@name="hash_check"]', document).pop().value;
		timerSmilies = setTimeout(function()
		{
			var searchkeyword = $(inputId).value;
			var divsmilies = $(targetId);

			if (searchkeyword.length > 2 && searchkeyword != findSmiliesBuffer)
			{
				divsmilies.innerHTML = '<br /><img src="http://forum-images.hardware.fr/icones/mm/wait.gif" alt="" />';
				findSmiliesBuffer = searchkeyword;
				toyoAjaxLib.loadDoc('http://forum.hardware.fr/message-smi-mp-aj.php', 'get', 'config=hfr.inc&findsmilies=' + encodeURIComponent(searchkeyword), function (reponse)
				{
					divsmilies.innerHTML = reponse;
					if (getElementByXpath('.//img', divsmilies).length > 0) document.documentElement.scrollTop += divsmilies.clientHeight;
					getElementByXpath('.//img', divsmilies).forEach(function (img)
					{
						var smileyCode = img.title;
						img.removeAttribute('onclick');
						img.style.margin = '5px';
						
						// Mouseover (texte alternatif / titre) -> mots clés
						img.addEventListener('mouseover', function()
						{
							var currentImg = this;
							getKeyWords(this.alt, function(keyWords)
							{
								currentImg.title = currentImg.alt + ' { ' + keyWords + ' }';
							}
							);
						}
						, false);
						
						// Double clic, le popup de modification
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
								getKeyWords(this.alt, function(keyWords)
								{
									var newDiv;
									var width = 300;
									if ($('edit_wiki_smilies'))
									{
										newDiv = $('edit_wiki_smilies');
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
										inputOk.alt = 'valider';
										inputOk.style.marginRight = '6px';
										inputOk.addEventListener('click', function()
										{
											if (confirm('Modifier les mots clés de ce smiley ?'))
											{
												var smiley = this.parentNode.lastChild.value;
												var keyWords = this.parentNode.firstChild.value;
												var url = 'http://forum.hardware.fr/wikismilies.php?config=hfr.inc&option_wiki=0&withouttag=0';
												var arguments = 'modif0=1&smiley0='+ smiley +'&keywords0=' + encodeURIComponent(keyWords);
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
										inputCancel.alt = 'annuler';
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
								timer = setTimeout(function()
								{
									putSmiley(smileyCode, currentTextarea.id);
									currentTextarea.focus();
								}
								, delay);
							}
						}
						, false);
					}
					);
				}
				);
			}
		}, 300);
	}
	
	var firstClickTime, timerSmilies, ctrl = 0, currentTextarea = null, findSmiliesBuffer = '', currentTarget = null;
	
	/* Gestion de la reponse rapide */
	
	var hideSmileysList = function ()
	{
		if ($('smilies_helper')) $('smilies_helper').style.display = 'none';
	}
	
	var insertSmiley = function ()
	{
		var ta = $('content_form');
		var taScrollTop = ta.scrollTop;
		var pos1;
		var pos2 = 0;
		while (pos2 < ta.selectionStart && pos2 != -1)
		{
			pos1 = pos2 + 1;
			pos2 = ta.value.indexOf('[:', pos1);
		}
		pos1--;
		var pattern = ta.value.substr(pos1 + 2 , ta.selectionStart - pos1 - 2);
		ta.value = ta.value.slice(0, pos1 + 2) + $('smilies_helper').firstChild.value + ']' + ta.value.slice(pos1 + 2 + pattern.length);
		ta.focus();
		ta.scrollTop = taScrollTop;
		ta.selectionStart = ta.selectionEnd = pos1 + 3 + $('smilies_helper').firstChild.value.length;
	}
	
	var generatePreview = function ()
	{
		if (!$('smilies_helper') || $('smilies_helper').style.display == 'none') return;

		var smileyTab = $('smilies_helper').firstChild.value.split(':');
		var code = smileyTab[0];
		var rang = smileyTab.length > 1 ?  smileyTab[1] : null;
		var url = 'http://forum-images.hardware.fr/images/perso/';
		if (rang != null) url += rang + '/';
		url += code + '.gif';
	
		var preview;
		var container = $('smilies_helper');
		if (container.lastChild.nodeName.toLowerCase() == 'img')
		{
			preview = container.lastChild;
		}
		else
		{
			preview = document.createElement('img');
			preview.style.border = '1px solid black';
			preview.style.opacity = '0.9';
			preview.style.backgroundColor = 'white';
			preview.style.padding = '15px';
			preview.style.position = 'absolute';
			container.appendChild(preview);
		}								
		preview.alt = '[:' + this.value + ']';
		preview.src = url;
		preview.style.top = (container.clientHeight / 2 - preview.height / 2 - parseInt(preview.style.padding)) + 'px';
		preview.style.left = (container.clientWidth + 15) + 'px';
	}

	$('content_form').addEventListener('keydown', function(event)
	{
		if (!$('smilies_helper') || $('smilies_helper').style.display == 'none') return;
	
		var key = event.which;
		if (key == 38 || key == 40 || key == 13 || key == 9 || (event.shiftKey && key == 9)) // Down arrow, Up arrow, Enter, Tab or Shit Tab
		{
			event.preventDefault();
		}
	}
	, false);
	
	// Wiki Smilies & auto-completion
	var timer = null;
	$('content_form').addEventListener('keyup', function(event)
	{
		var key = event.which;

		if ($('smilies_helper') && $('smilies_helper').style.display == 'block')
		{
			var select = $('smilies_helper').firstChild;
			if (key == 27) // Echap
			{
				hideSmileysList();
			}
			else if (key == 40 || key == 9) // Down arrow or Tab
			{
				select.focus();
				select.selectedIndex = 0;	
				generatePreview();
			}
			else if (key == 38) // Up arrow
			{
				select.focus();
				select.selectedIndex = select.childNodes.length - 1;
				generatePreview();
			}
			else if (key == 13) // Enter
			{
				if (select.childNodes.length == 1)
				{
					select.selectedIndex = 0;
					insertSmiley();
				}
				else
				{
					insertBBCode('content_form', "\n", '');
				}
				hideSmileysList();
			}
		}		

		if (key != 27 && key != 9 && key != 16 && // Echap, Tab or shift
		     (!$('smilies_helper') || $('smilies_helper').style.display == 'none' 
			  || (key != 38 && key != 40 && key != 13) // Down arrow, Up arrow or Enter
		     )
		   )
		{
			var ta = this;
			var text = this.value.substr(0, this.selectionStart);
			var wraps = text.split('\n');

			var newSpan = document.createElement('span');
			document.body.appendChild(newSpan);
			newSpan.style.border = 0;
			newSpan.style.margin = 0;
			newSpan.style.padding = 0;
			newSpan.style.height = '1em';
			newSpan.style.width = 'auto';
			newSpan.style.whiteSpace = 'nowrap';
			newSpan.style.overflow = 'scroll';
			newSpan.style.fontSize = 'small';
			newSpan.style.fontFamily = 'Verdana,Arial,Sans-serif,Helvetica';
			
			newSpan.innerHTML = wraps[wraps.length - 1].replace(/</g, "&lt;").replace(/>/g, "&gt;");
			var lineNumber = Math.floor(parseInt(newSpan.offsetWidth) / parseInt(this.offsetWidth));
			var textWidth = (parseInt(newSpan.offsetWidth) + lineNumber * 40)%parseInt(this.offsetWidth);
			var textHeight = 0;
			for (var i = 0; i < wraps.length; i++)
			{
				newSpan.innerHTML = wraps[i].replace(/</g, "&lt;").replace(/>/g, "&gt;");
				if (newSpan.innerHTML == '') newSpan.innerHTML = 'a';
				var lineNumber = Math.floor(parseInt(newSpan.offsetWidth) / parseInt(this.offsetWidth)) + 1;
				textHeight += lineNumber * newSpan.offsetHeight;
			}
			document.body.removeChild(newSpan);

			var newDiv;
			if ($('smilies_helper'))
			{
				newDiv = $('smilies_helper');
			}
			else
			{
				newDiv = document.createElement('div');
				newDiv.id = 'smilies_helper';
				newDiv.style.position = 'absolute';
				document.body.appendChild(newDiv);
			}
			newDiv.style.display = 'none';
			
			var top = this.offsetTop + textHeight + 3 - this.scrollTop;
			var left = this.offsetLeft + textWidth + 5;

			var zone = $('content_form').parentNode;
			newDiv.style.position = zone.className.indexOf('zoneRepFlot') != -1 ? 'fixed' : 'absolute';
			if (zone.className.indexOf('zoneRepFlot') != -1)
			{
				top += zone.offsetTop;
				left += zone.offsetLeft;
			}
			
			var text = wraps[wraps.length - 1];
			var pos1 = text.lastIndexOf('[:');
			var pos2 = text.lastIndexOf(']');
			var pattern = text.substr(pos1 + 2);
			if (timer) clearTimeout(timer);
			if (pos1 != -1 && (pos2 == -1 || pos2 < pos1) && this.selectionStart == this.selectionEnd && pattern.length >= 2)
			{
				timer = setTimeout(function()
				{
					GM_xmlhttpRequest({
						method: "GET",
						url: 'http://hfr-mirror.toyonos.info/smileys/getByName.php5?pattern=' + pattern,
						onload: function(response)
						{
							newDiv.innerHTML = '';
							var smilies = response.responseText.trim();
							if (smilies != '' && $("search_smilies").parentNode.style.display != 'block')
							{
								var select = document.createElement('select');
								select.style.border = '1px solid #000';
								select.style.fontStyle = 'italic';
								select.style.opacity = '0.9';
								select.style.fontFamily = '"trebuchet ms", trebuchet, arial, sans-serif';
								select.style.fontSize = '0.8em';
								var nb = smilies.split(';').length;
								if (nb == 1) nb++;
								if (nb > 10) nb = 10;
								select.size = nb;
								
								var selectSmiley = function (event)
								{
									var key = event.which;
									if (key == 27) // Echap
									{
										hideSmileysList();
										ta.focus();
									}
									else if (key == 13 || key == 1 || key == null) // Enter, left click or default
									{
										insertSmiley();
										hideSmileysList();
									}
								}
								
								select.addEventListener('click', function (event) { selectSmiley(event); } , false);
								select.addEventListener('keyup', function (event) { selectSmiley(event); } , false);
								select.addEventListener('keydown', function(event)
								{
									if (event.which == 9)
									{
										event.preventDefault();
										ta.focus();
									}
								}
								, false);
								select.addEventListener('blur', hideSmileysList, false);
								select.addEventListener('change', generatePreview, false);

								smilies.split(';').forEach(function (smiley)
								{
									if (smiley != '')
									{
										var opt = document.createElement('option');
										opt.innerHTML = smiley;
										select.appendChild(opt);
									}
								});
								newDiv.appendChild(select);
								newDiv.style.top = top + 'px';
								newDiv.style.left = left + 'px';
								newDiv.style.display = 'block';
							}
						}
					});
				}, 250);
			}
			
			searchSmilies(event, 'content_form', 'dynamic_smilies', false);
		}
	}	
	, false);

	// Raccourcis
	$('content_form').addEventListener('keydown', function(event) { proceedShortcut(event, 'content_form') }, false);
	
	/* Gestion de l'edit rapide */
	
	var root = $('mesdiscussions');

	getElementByXpath('.//table//tr[starts-with(@class, "message")]//div[@class="left"]//a[starts-with(@href, "/message.php")]//img[@alt="Edition rapide"]', root)
	.forEach(function(img)
	{
		var onclickCommand = img.parentNode.getAttribute('onclick');
		var numreponse = onclickCommand.match(/edit_in\('.*','.*',[0-9]+,([0-9]+),''\)/).pop();
		img.parentNode.addEventListener('click', function()
		{
			if ($('rep_editin_' + numreponse)) $('rep_editin_' + numreponse).id = '';
			var timer = setInterval(function()
			{
				if ($('rep_editin_' + numreponse))
				{
					clearInterval(timer);
					var newDiv = document.createElement('div');
					newDiv.id = 'dynamic_smilies_edit_' + numreponse;
					newDiv.style.textAlign = 'center';
					$('rep_editin_' + numreponse).parentNode.appendChild(newDiv);
			
					// Wiki Smilies
					$('rep_editin_' + numreponse).addEventListener('keyup', function(event) { searchSmilies(event, 'rep_editin_' + numreponse, 'dynamic_smilies_edit_' + numreponse, true) }, false);
					// Raccourcis
					$('rep_editin_' + numreponse).addEventListener('keydown', function(event) { proceedShortcut(event, 'rep_editin_' + numreponse) }, false);
					
					var buttonValide = $('rep_editin_' + numreponse).nextSibling.firstChild;
					buttonValide.addEventListener('click', hideWikiSmilies, false);
					buttonValide.nextSibling.addEventListener('click', hideWikiSmilies, false);
				}
			}
			, 50);
		}
		, false);
	});
	
	/* Ajout des evenements sur le champ de recherche des smilies */
	
	$('search_smilies').addEventListener('keyup', function(event) { searchSmilies(event); }, false);
	$('search_smilies').addEventListener('keyup', function() { findSmilies('search_smilies', currentTarget); }, false);
	$('search_smilies').addEventListener('blur', hideWikiSmilies, false);
	
	/* Ajout de l'aide pour les raccourcis clavier */

	var helpImg = document.createElement('img');
	helpImg.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%A4IDAT8%CB%A5%93%DDO%92a%18%C6%FD%5B%E0Oh%AD%E6j%D5j%9D%D5%D68%E8%A0%03%A7%E6'%D0%D4r%B5%0C%96%B3t%98%D3%2C)53%9D%0Aj%EA%9C%8A%02o%02%22%88%26%CA%97%20%F0b%22_%CA%C7Dx%E1U%B3%ED%EA%8D5%9C%CB%D9Z%07%BF%93%7B%CF%F5%DB%AEg%F7%9D%03%20%E7%7F%F8c%A0%23%0F%D9Z%F7%81%40%E3%DC'U%EB4%F5%C5%9E%A2%146%8A%9C%B1%24%04S%A6%3D%F6%99%02%B5%93%E6%CC%3A%D2!O%F8%10%1B%3B4%DCA*%83g%3B%0DG%20%8D%91%C5hhh!%CC9U%40%AC%A58rk2%B5%19%D9%87%F9%DB.%A4s~%88%C6%9C%A8%1FYG%17%B1%01%83%23%0AW%88%C2'%95%3F%D5ElqN%08d%E6%04kr5%1E%DC%08%D3Xp%C6P%CB%84%3A%09%0F%FC1%1A%BEX%1Ac%8B%01%D4H%ADP%AE%86%60%F7%25%D0%3AI%06%9B%C7%5D%AC%AC%60t)*%5C%F3%A7%B0%E2%89C8h%C7%E3%1E3%D2%07G%0C%3F~s%84%DAA%0Bj%FAM%98%B7G%A0%5D%8B%A0Nj%15f%05%7Ds!%D2%C5t%ED%266Q%DDcBU%F7%0A%FC%D14%A6%96%03P%DB%B6A3%02%B5-%08n%BB%0E%ADS%0EX%BD%BBx%D2m%24%B3%82%0E%85%97v%07%93%10J%2C%A8%FCh%04%AF%D3%C0%3C%D6c%DA%E8%C3.u%80%9D%5D%1A%BD%B3.%94%B6iQ%F9A%0F%87o%0F%3C%B1%9E%CE%0AZ%C6%5D%B4%2B%90%C4%D3%01%0B%B8%1Dz%94%BF%D7%A1%EC%9D%0EI%FA%3B%B6%22%14%F8b-%8AZT%B8%CF%C0%17k%60%F7%C7%91%DF%A4%3E%16%BC%90%DAH%DBV%1Cb%99%0B%BCv%03%CA%C4%F3(y%3B%87%E2%D7%EA%0C%85%AF%08%146*P%D0(G%BDt%19FO%04w%EB%E4%C7%15%98%3EB%851%00%BD%23%82%CA%0EC6%18K%EC%23%B2G%23O4%93%A1P%24%03%B1%EA%83%84%A9s%ABf%E2%F8%13%F9%E2%05V%F9%9B%F9%E0%923%02%E5%8A%1F%DC6%0D%0A%9A%94h%1B7e%F8%15%CEo%98%C0%B0%C6%0D%8D%25%80%9B%D5c%C1%EB%0FGY'%16)O4%CB%B9%D7%40%A4t%F6m%A8%ADA%BC%94%2C%A1%A4Y%8E%A2%C6i%3C%EF%D5Ci%F4Be%F6%E3j%C5%E7%D4%E5%07C%9CSW%F9%8EP%C6%B9%FDl2%D4G%AC%E3%AB%3B%0C%8B7%96a%D1%B9%83.%99%0D%B9%3Ci%E8b%B9%84s%E61%DDx4%CA%BEV5%22%B8R1L%5E%E2%0FR%B9%5C)u%A1l%80%3C_%DA%2F8W%DC%C7%FE%EB5%FE%2B%3F%01%D7%AF%05%A2%BDM%BD%C4%00%00%00%00IEND%AEB%60%82";
	helpImg.alt = 'help';
	helpImg.style.cursor = 'help';
	helpImg.style.verticalAlign = 'text-bottom';
	helpImg.style.marginTop = '5px';
	helpImg.style.marginRight = '5px';
	$('content_form').parentNode.insertBefore(helpImg, $('content_form').previousSibling.previousSibling);
	helpImg.addEventListener('mouseover', function(event)
	{
		var helpDiv;
		if ($('ws_help_shortcuts'))
		{
			helpDiv = $('ws_help_shortcuts');
		}
		else
		{
			helpDiv = document.createElement('div');
			helpDiv.setAttribute('id', 'ws_help_shortcuts');
			helpDiv.className = 'signature';
			
			var newTable = document.createElement('table');
			for (var id in cmScript.shortcuts)
			{
				var newTr = document.createElement('tr');
				var newTd = document.createElement('td');
				newTd.className = 'ws_hs_left';
				newTd.innerHTML = cmScript.shortcuts[id].left + '<span>' + cmScript.shortcuts[id].sample + '</span>' + cmScript.shortcuts[id].right;
				newTr.appendChild(newTd);
				newTd = document.createElement('td');
				newTd.className = 'ws_hs_right';
				newTd.innerHTML = 'Ctrl-Alt-<span>' + cmScript.keysBinding[cmScript.getShortcutKey(id)] + '</span>';
				newTr.appendChild(newTd);
				newTable.appendChild(newTr);
			}
			helpDiv.appendChild(newTable);
			root.appendChild(helpDiv);
			
			cssManager.addCssProperties("#ws_help_shortcuts {position: absolute; border: 1px solid black; background-color: white; padding: 3px; z-index: 1001;}");
			cssManager.addCssProperties("#ws_help_shortcuts table, #ws_help_shortcuts td {border: 0;}");
			cssManager.addCssProperties("#ws_help_shortcuts td {padding: 2px;}");
			cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_left {font-weight: bold; text-align: left; padding-right: 25px;}");
			cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_left span {font-weight: normal;}");
			cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_right {text-align: right;}");
			cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_right span {color: red; font-weight: bold; text-transform: uppercase;}");
			cssManager.insertStyle();
		}
		helpDiv.style.left = (event.clientX - 100) + 'px';
		helpDiv.style.display = 'block';
		helpDiv.style.top = (window.scrollY + event.clientY - 20 - helpDiv.clientHeight) + 'px';
	}
	, false);

	helpImg.addEventListener('mouseout', function(event)
	{
		if ($('ws_help_shortcuts')) $('ws_help_shortcuts').style.display = 'none';
	}
	, false);
	
	/* Lien pour la page des générateurs */

	var newA = document.createElement('a');
	newA.href = 'http://hfr.toyonos.info/generateurs/';
	newA.target = '_blank';
	newA.className = 's1Ext';
	newA.innerHTML = 'Générateurs';
	$('content_form').parentNode.insertBefore(newA, $('content_form').previousSibling.previousSibling);
	
	/* Zone de réponse flottante */

	var zone = $('content_form').parentNode;
	zone.style.opacity = 1;
	var baseClassName = zone.className;
	cssManager.addCssProperties(".zoneRepFlot { position: fixed; width: 80%; left: 10%; bottom: 20px; background-color: #fff; border: 1px dashed #000; padding: 5px; max-height: 50%; overflow: auto;}");
	cssManager.insertStyle();

	var updatePin = function (pinImg, pinOn)
	{
		pinImg.src = pinOn ? "data:image/gif;base64,R0lGODlhDAANAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwNTQyAAAMzMAADMAMwAzMxYWFhwcHCIiIikpKVVVVU1NTUJCQjk5Of98gP9QUNYAk8zs%2F%2B%2FWxufn1q2pkDP%2FAGYAAJkAAMwAAAAzADMzAGYzAJkzAMwzAP8zAABmADNmAGZmAJlmAMxmAP9mAACZADOZAGaZAJmZAMyZAP%2BZAADMADPMAGbMAJnMAMzMAP%2FMAGb%2FAJn%2FAMz%2FAAD%2FMzMA%2F2YAM5kAM8wAM%2F8AMwAz%2FzMzM2YzM5kzM8wzM%2F8zMwBmMzNmM2ZmM5lmM8xmM%2F9mMwCZMzOZM2aZM5mZM8yZM%2F%2BZMwDMMzPMM2bMM5nMM8zMM%2F%2FMMzP%2FM2b%2FM5n%2FM8z%2FM%2F%2F%2FMwAAZjMAZmYAZpkAZswAZv8AZgAzZjMzZmYzZpkzZswzZv8zZgBmZjNmZmZmZplmZsxmZgCZZjOZZmaZZpmZZsyZZv%2BZZgDMZjPMZpnMZszMZv%2FMZgD%2FZjP%2FZpn%2FZsz%2FZv8AzMwA%2FwCZmZkzmZkAmcwAmQAAmTMzmWYAmcwzmf8AmQBmmTNmmWYzmZlmmcxmmf8zmTOZmWaZmZmZmcyZmf%2BZmQDMmTPMmWbMZpnMmczMmf%2FMmQD%2FmTP%2FmWbMmZn%2Fmcz%2Fmf%2F%2FmQAAzDMAmWYAzJkAzMwAzAAzmTMzzGYzzJkzzMwzzP8zzABmzDNmzGZmmZlmzMxmzP9mmQCZzDOZzGaZzJmZzMyZzP%2BZzADMzDPMzGbMzJnMzMzMzP%2FMzAD%2FzDP%2FzGb%2FmZn%2FzMz%2FzP%2F%2FzDMAzGYA%2F5kA%2FwAzzDMz%2F2Yz%2F5kz%2F8wz%2F%2F8z%2FwBm%2FzNm%2F2ZmzJlm%2F8xm%2F%2F9mzACZ%2FzOZ%2F2aZ%2F5mZ%2F8yZ%2F%2F%2BZ%2FwDM%2FzPM%2F2bM%2F5nM%2F8zM%2F%2F%2FM%2FzP%2F%2F2b%2FzJn%2F%2F8z%2F%2F%2F9mZmb%2FZv%2F%2FZmZm%2F%2F9m%2F2b%2F%2F6UAIV9fX3d3d4aGhpaWlsvLy7KystfX193d3ePj4%2Brq6vHx8fj4%2BP%2F78DpupYCAgP8AAAD%2FAP%2F%2FAAAA%2F%2F8A%2FwD%2F%2F%2F%2F%2F%2FyH%2BHUJ1aWx0IHdpdGggR0lGIE1vdmllIEdlYXIgNC4wACH5BAEKAPkALAAAAAAMAA0AAAhRAPMJHEiwYD52AxKyM4jwn71%2FAxYORPiwYkSBCh1qPDDg4AB77Co65JjvI0SNDxMe1DhAI8KFJu1xTHix5MYD7F4KbIgzp86dEX3WnEgzJ8GAADs%3D" : "data:image/gif;base64,R0lGODlhDAANAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwNTQyAAAMzMAADMAMwAzMxYWFhwcHCIiIikpKVVVVU1NTUJCQjk5Of98gP9QUNYAk8zs%2F%2B%2FWxufn1q2pkDP%2FAGYAAJkAAMwAAAAzADMzAGYzAJkzAMwzAP8zAABmADNmAGZmAJlmAMxmAP9mAACZADOZAGaZAJmZAMyZAP%2BZAADMADPMAGbMAJnMAMzMAP%2FMAGb%2FAJn%2FAMz%2FAAD%2FMzMA%2F2YAM5kAM8wAM%2F8AMwAz%2FzMzM2YzM5kzM8wzM%2F8zMwBmMzNmM2ZmM5lmM8xmM%2F9mMwCZMzOZM2aZM5mZM8yZM%2F%2BZMwDMMzPMM2bMM5nMM8zMM%2F%2FMMzP%2FM2b%2FM5n%2FM8z%2FM%2F%2F%2FMwAAZjMAZmYAZpkAZswAZv8AZgAzZjMzZmYzZpkzZswzZv8zZgBmZjNmZmZmZplmZsxmZgCZZjOZZmaZZpmZZsyZZv%2BZZgDMZjPMZpnMZszMZv%2FMZgD%2FZjP%2FZpn%2FZsz%2FZv8AzMwA%2FwCZmZkzmZkAmcwAmQAAmTMzmWYAmcwzmf8AmQBmmTNmmWYzmZlmmcxmmf8zmTOZmWaZmZmZmcyZmf%2BZmQDMmTPMmWbMZpnMmczMmf%2FMmQD%2FmTP%2FmWbMmZn%2Fmcz%2Fmf%2F%2FmQAAzDMAmWYAzJkAzMwAzAAzmTMzzGYzzJkzzMwzzP8zzABmzDNmzGZmmZlmzMxmzP9mmQCZzDOZzGaZzJmZzMyZzP%2BZzADMzDPMzGbMzJnMzMzMzP%2FMzAD%2FzDP%2FzGb%2FmZn%2FzMz%2FzP%2F%2FzDMAzGYA%2F5kA%2FwAzzDMz%2F2Yz%2F5kz%2F8wz%2F%2F8z%2FwBm%2FzNm%2F2ZmzJlm%2F8xm%2F%2F9mzACZ%2FzOZ%2F2aZ%2F5mZ%2F8yZ%2F%2F%2BZ%2FwDM%2FzPM%2F2bM%2F5nM%2F8zM%2F%2F%2FM%2FzP%2F%2F2b%2FzJn%2F%2F8z%2F%2F%2F9mZmb%2FZv%2F%2FZmZm%2F%2F9m%2F2b%2F%2F6UAIV9fX3d3d4aGhpaWlsvLy7KystfX193d3ePj4%2Brq6vHx8fj4%2BP%2F78DpupYCAgP8AAAD%2FAP%2F%2FAAAA%2F%2F8A%2FwD%2F%2F%2F%2F%2F%2FyH%2BHUJ1aWx0IHdpdGggR0lGIE1vdmllIEdlYXIgNC4wACH5BAEKAPkALAAAAAAMAA0AAAhXAPMJFIhvgEF8AwcW%2FGfv3wCECgc0nPhQ4EGGGA8MyFfQHr6JDDXmk%2BgQY0ODHDEOwFgQIUl7Gg1WHJnxAL6WBFfavIlTIICHPGfmA3BT5s2BPxMqzRcQADs%3D";
		pinImg.title = pinOn ? 'La zone de réponse est fixée' : 'La zone de réponse est flottante';
		pinImg.alt = pinOn ? 'zone_fixe' : 'zone_flottante';
	}
	
	var pinIt = function (pinImg, pinOn)
	{
		zone.className = pinOn ? baseClassName : baseClassName + ' zoneRepFlot';
		updatePin(pinImg, pinOn);
		if ($('smilies_helper')) $('smilies_helper').style.display = 'none';
		if (!pinOn) $('content_form').focus();
	}

	var fade = function (zone, out, cbf)
	{
		var opacity = out ? parseInt(zone.style.opacity) : 0;
		var step = out ? -0.1 : 0.1;
		var timer = setInterval(function()
		{
			opacity = Math.round((opacity + step) * 100) / 100;
			zone.style.opacity = opacity;
			if (opacity >= 1 || opacity <= 0)
			{
				clearInterval(timer);
				if (cbf)
				{
					zone.style.opacity = 1;
					cbf();
				}
			}
		}
		, 10);	
	}

	var fadeTimer = null;
	var newA = document.createElement('a');
	newA.setAttribute('accesskey', 'p');
	newA.style.marginRight = '5px';
	newA.style.cursor = 'pointer';
	newA.addEventListener('click', function()
	{
		var pinImg = this.firstChild;
		var fnct = function () { pinIt(pinImg, zone.className.indexOf('zoneRepFlot') != -1); };
		
		if (zone.className.indexOf('zoneRepFlot') != -1)
		{
			fade(zone, true, fnct);
		}
		else
		{
			fnct();
			fade(zone, false);
		}		
	}
	, false);
	var pin = document.createElement('img');
	newA.appendChild(pin);
	$('content_form').parentNode.insertBefore(newA, $('content_form').parentNode.firstChild);

	var focus = function () { if (zone.className.indexOf('zoneRepFlot') != -1) zone.style.opacity = '1'; };
	var blur = function () { if (zone.className.indexOf('zoneRepFlot') != -1) zone.style.opacity = '0.3'; };
	$('content_form').addEventListener('focus', focus, false);
	$('content_form').addEventListener('blur', blur, false);
	$('submitreprap').addEventListener('focus', focus, false);
	$('submitreprap').addEventListener('blur', blur, false);
	
	if (cmScript.activeOnMq)
	{
		getElementByXpath('//table//tr[starts-with(@class, "message")]//a[starts-with(@href, "/message.php" )]', root).filter(function(link)
		{
			return link.firstChild.alt == 'answer +';
		}
		).forEach(function(link)
		{
			var timerClick;
			var firstClickTime = null;
			var delay = 300;
			link.addEventListener('click', function(event)
			{
				if (firstClickTime != null && new Date().getTime() - firstClickTime < delay)
				{
					clearTimeout(timerClick);
					firstClickTime = null;
					pinIt(pin, false);
				}
				else
				{
					firstClickTime = new Date().getTime();
				}
			}
			, false);
		}
		);
	}

	pinIt(pin, !cmScript.alwaysNotSticky);
}

/*
Récupère la position réelle d'un objet dans la page (en tenant compte de tous ses parents)
IN 	: Obj => Javascript Object ; Prop => Offset voulu (offsetTop,offsetLeft,offsetBottom,offsetRight)
OUT	: Numérique => position réelle d'un objet sur la page.

ex : var offsetLeft = GetDomOffset( document.getElementById('c'), 'offsetLeft' );

*/
function GetDomOffset( Obj, Prop ) {
	var iVal = 0;
	while (Obj && Obj.tagName != 'BODY') {
		eval('iVal += Obj.' + Prop + ';');
		Obj = Obj.offsetParent;
	}
	return iVal;
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
				else req.send();
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

		var currentVersion = GM_getValue('currentVersion', '0.6.4b');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.6.4b', currentVersion))
		{
			GM_setValue('currentVersion', '0.6.4b');
			currentVersion = '0.6.4b';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.6.4b'))
		{
			GM_registerMenuCommand("[HFR] Wiki smilies & raccourcis dans la reponse/edition rapide -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'wiki_smilies_rapide_v2.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Wiki smilies & raccourcis dans la reponse/edition rapide');
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
						if (confirm('Une nouvelle version de [HFR] Wiki smilies & raccourcis dans la reponse/edition rapide est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'wiki_smilies_rapide_v2.user.js');
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