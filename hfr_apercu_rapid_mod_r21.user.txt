// ==UserScript==
// @name [HFR] Apercu des posts dans la reponse/edition rapide
// @version 0.2.4
// @namespace http://toyonos.info
// @description Rajoute l'aperçu du message dans la réponse rapide et dans l'édition rapide du forum hardware.fr
// @include http://forum.hardware.fr/*
// @exclude http://forum.hardware.fr/message.php*
// ==/UserScript==

//Lib de generation de l'apercu (provenant de mdenhance)
// uses code from Freekil (hfrenhance v1)
var BBParser = {

  lieu : "http://forum-images.hardware.fr/icones/", //"../../../icones/";
  lieuPerso : "http://forum-images.hardware.fr/images/perso/", //"../../../images/perso/";

  parse: function(str) {
 
	str = str.replace(/,/gi,'&#44;');
 
	// Trouve les balises fixed
	var fixed = str.match(/(\[fixed\])((\n|.)+?)(\[\/fixed\])/gi);
	if (fixed) {
	  fixed = fixed.toString();
	}
 
	// Trouve les balises cpp
	var cpp = str.match(/(\[cpp\])((\n|.)+?)(\[\/cpp\])/gi);
	if (cpp) {
	  cpp = cpp.toString();
	}
 
	// Trouve les balises code
	var code = str.match(/(\[code(=[a-z0-9]+)?\])((\n|.)+?)(\[\/code\])/gi);
	if (code) {
	  code = code.toString();
	}
 
	str = str.replace(/&#44;/gi,',');
 
	str = BBParser.htmlSpecialChars(str);
 
	str = BBParser.parseOwnSmilies(str);
	str = BBParser.parseBaseSmilies(str);
   
	str = BBParser.parseStyle(str);
 
	str = BBParser.parseExternal(str);
   
	str = BBParser.parseLists(str);
   
	str = BBParser.parseBlocks(str);
 
	// Special pour les balises fixed
	if (fixed) {
	  fixed = fixed.split(',');
 
	  for(i=0;i<fixed.length;i++) {
		thisfixed = fixed[i].replace(/(\[fixed\])((\n|.)+?)(\[\/fixed\])/,'$2');
		thisfixed = thisfixed.replace(/\n/g, "<br/>\n" );
		thisfixed = thisfixed.replace(/ /gi,'&nbsp;');
		str = str.replace( /(\[fixed\])((\n|.)+?)(\[\/fixed\])/,'<table class="fixed"><tbody><tr class="none"><td>'+thisfixed+'</td></tr></tbody></table>');
	  }
	}
   
	// Special pour les balises cpp
	if (cpp) {
	  cpp = cpp.split(',');
 
	  for(i=0;i<cpp.length;i++) {
		thiscode = cpp[i].replace(/(\[cpp\])((\n|.)+?)(\[\/cpp\])/,'$2');
		thiscode = thiscode.replace(/ /gi,'&nbsp;');
		thiscode = thiscode.replace(/\t/gi,'&nbsp;&nbsp;'); // a tab equals two spaces
		thiscode = thiscode.replace( /(^|\[cpp\])(.*?)($|\[\/cpp\])/mgi, '<li><div class="de1">$2&nbsp;</div></li>'); // each line is an ol list element
		thiscode = thiscode.replace(/\n/gi,''); // we're using a pre block, so we must remove line breaks
		str = str.replace( /(\[cpp\])((\n|.)+?)(\[\/cpp\])/,'<table ondblclick="switchNumbering2(this);" class="code"><tbody><tr class="none"><td><b class="s1" style="font-family: Verdana,Helvetica,Arial,Sans-serif;"> Code : </b><br><pre class="cpp"><ol>'+thiscode+'</ol></pre></td></tr></tbody></table>');
	  }
	} 
 
	// Special pour les balises code
	if (code) {
	  code = code.split(',');
 
	  for(i=0;i<code.length;i++) {
		thiscode = code[i].replace(/(\[code(=[a-z0-9]+)?\])((\n|.)+?)(\[\/code\])/,'$3');
		thiscode = thiscode.replace(/ /gi,'&nbsp;');
		thiscode = thiscode.replace(/\t/gi,'&nbsp;&nbsp;');
		thiscode = thiscode.replace( /(^|\[code\])(.*?)($|\[\/code\])/mgi, '<li><div class="de1">$2&nbsp;</div></li>');
		thiscode = thiscode.replace(/\n/gi,'');
		str = str.replace( /(\[code(=[a-z0-9]+)?\])((\n|.)+?)(\[\/code\])/,'<table ondblclick="switchNumbering2(this);" class="code"><tbody><tr class="none"><td><b class="s1" style="font-family: Verdana,Helvetica,Arial,Sans-serif;"> Code : </b><br><pre class="cpp"><ol>'+thiscode+'</ol></pre></td></tr></tbody></table>');
	  }
	}
   
	//str = htmlSpecialChars(str);
   
	return str;
 
  },

  parseBaseSmilies: function(str) {
 
	var smilies = {
   
	  gratgrat: ':gratgrat:',
	  ange: ':ange:',
	  benetton: ':benetton:',
	  bic: ':bic:',
	  bounce: ':bounce:',
	  bug: ':bug:',
	  crazy: ':crazy:',
	  cry: ':cry:',
	  dtc: ':dtc:',
	  eek: ':eek:',
	  eek2: ':eek2:',
	  evil: ':evil:',
	  fou: ':fou:',
	  foudtag: ':foudtag:',
	  fouyaya: ':fouyaya:',
	  fuck: ':fuck:',
	  gun: ':gun:',
	  hebe: ':hebe:',
	  heink: ':heink:',
	  hello: ':hello:',
	  hot: ':hot:',
	  //int: ':int:', //can't use int, reserved word, see below
	  jap: ':jap:',
	  kaola: ':kaola:',
	  lol: ':lol:',
	  love: ':love:',
	  mad: ':mad:',
	  mmmfff: ':mmmfff:',
	  na: ':na:',
	  non: ':non:',
	  ouch: ':ouch:',
	  ouimaitre: ':ouimaitre:',
	  pfff: ':pfff:',
	  pouah: ':pouah:',
	  pt1cable: ':pt1cable:',
	  sarcastic: ':sarcastic:',
	  sleep: ':sleep:',
	  sol: ':sol:',
	  spamafote: ':spamafote:',
	  spookie: ':spookie:',
	  sum: ':sum:',
	  sweat: ':sweat:',
	  vomi: ':vomi:',
	  wahoo: ':wahoo:',
	  whistle: ':whistle:'
   
	}
   
	var regexp;
   
	for (code in smilies) {
	  regexp = new RegExp(smilies[code], 'gi'); // get regexp from object
	  str = str.replace(regexp, '<img src="' + BBParser.lieu + 'smilies/' + code + '.gif" alt="' + code + '" />');   
	}
   
	// fix for 'int' smiley
	str = str.replace(/:int:/gi, '<img src="' + BBParser.lieu + 'smilies/int.gif" alt="int" />');
   
	var smilies2 = {
 
	  confused: /([^\[]|^):\?\?:/gi,
	  smile: /([^\[]|^):\)/gi,
	  frown: /([^\[]|^):\(/gi,
	  redface: /([^\[]|^):o/gi,
	  biggrin: /([^\[]|^):D/gi,
	  wink: /([^\[]|^);\)/gi,
	  tongue: /([^\[]|^):p/gi,
	  ohill: /([^\[]|^):\'\(/gi,
	  ohwell: /([^\[]|^)(:\/)(?!\/)/gi // this one need a particular regex to avoid mixing up with urls
	 
	}
   
	for (code in smilies2) {
	  str = str.replace(smilies2[code], '$1<img src="' + BBParser.lieu  + code + '.gif" alt="' + code + '" />');   
	}
   
	return str;
 
  },
 
  parseOwnSmilies: function(str) {
   
	str = str.replace( /\[:([^\]]+):(\d+)]/gi, '<img src="' + BBParser.lieuPerso + '$2/$1.gif" alt="[:$1:$2]" />');
	str = str.replace( /\[:([^\]:]+)]/gi, '<img src="' + BBParser.lieuPerso + '$1.gif" alt="[:$1]" />');
   
	return str;
 
  },
 
  parseStyle: function(str) { 
 
	str = str.replace( /\[[su]\]((\n|.)+?)\[\/[su]\]/gi, '<span class="u">$1</span>');
	str = str.replace( /\[[bg]\]((\n|.)+?)\[\/[bg]\]/gi, '<strong>$1</strong>');
	str = str.replace( /\[i\]((\n|.)+?)\[\/i\]/gi, '<em>$1</em>');
	str = str.replace( /\[strike\]((\n|.)+?)\[\/strike\]/gi, '<strike>$1</strike>');
	str = str.replace( /\[(#[a-f0-9]{6})\]((\n|.)+?)\[\/#([a-f0-9]{6})\]/gi, '<span style="color: $1;">$2</span>' );
	 
	return str;
   
  },
 
  parseExternal: function(str) { 
 
	str = str.replace( /\[img\]([a-z]+:\/\/[^ \n\r]+?)\[\/img\]/gi, '<img src="$1" alt="$1" />');
	str = str.replace( /\[url=([a-z]+:\/\/(www\.)?[^ \n\r\[\<]+)\](.+?)\[\/url\]/gi, '<a href="$1" target="_blank" class="cLink">$3</a>');
	str = str.replace( /\[url\]([a-z]+:\/\/(www\.)?[^ \n\r\[\<]+)\[\/url\]/gi, '<a href="$1" target="_blank" class="cLink">$1</a>');
	str = str.replace( /\[email\]([\w\.-]+@[\w\.-]+)\[\/email\]/gi, '<a href="mailto:$1" class="cLink">$1</a>');
	str = str.replace( /(^|[\r\n \]\>])([a-z]+:\/\/(www\.)?[^ \n\r\<\[]+)/gi, '$1<a href="$2" target="_blank" class="cLink">$2</a>');
 
	return str;
   
  },
 
  parseLists: function(str) {
 
	str = str.replace( /((\[\*\](.*)(\r)?(\n))*(\[\*\][^\n]*))/gi, "<ul>$1</ul>");
	str = str.replace( /\[\*\]([^\n]*(\n|$))/gi, "<li>$1</li>" );
   
	return str;
 
  },
 
  parseBlocks: function(str) {

	var debutSpoiler, finSpoiler;
 
	var spoilers = str.match( /\[spoiler\]((\n|.)+?)\[\/spoiler\]/gi, debutSpoiler+"$1"+finSpoiler );
	if (spoilers) {
 
	  for(i=0; i<spoilers.length; i++) {	 
		debutSpoiler = '<table class="spoiler" onclick="javascript:montrer_spoiler('+i+')" style="cursor:pointer;"><tbody><tr class="none">  <td><b class="s1Topic">Spoiler :</b><br /><br /><div style="visibility:hidden" class="Topic masque" id="'+i+'"><p>';
		finSpoiler = '</p></div></td></tr></tbody></table></div>';
		str = str.replace( /\[spoiler\]((\n|.)+?)\[\/spoiler\]/i, debutSpoiler+"$1"+finSpoiler );
	  }
	}
 
	var debutCit = '<div class="container"><table class="citation"><tbody><tr class="none"><td>';
	var finCit = '</td></tr></tbody></table></div>';
 
	str = str.replace( /\[citation\]\[nom\](.+?)\[\/nom]((\n|.)+?)\[\/citation\]/gi, debutCit+'<b class="s1">$1</b><br><br><p>$2</p>'+finCit );
	str = str.replace( /\[quotemsg=(.+?)\]((.|\n)+?)\[\/quotemsg\]/gi, debutCit+'<b class="s1"><a class="Topic">Quelqu\'un a ecrit</a></b><br><br><p>$2</p>'+finCit );
 
 
	var debutQuote = '<div class="container"><table class="quote"><tbody><tr class="none"><td><b class="s1">Citation :</b><br /><br /><p>';
	var finQuote = '</p></td></tr></tbody></table></div>'; 
 
	str = str.replace( /(\[quote\])((\n|.)+?)(\[\/quote\])/gi, debutQuote+"$2"+finQuote ); 
 
	// Special quotes imbriques
	var quotes = str.match(/\[quote\]((\n|.)+?)\[\/quote\]/gi);
	if (quotes) {
 
	  for(i=0;i<quotes.length;i++) {
		str = str.replace( /\[quote\]((\n|.)+?)\[\/quote\]/gi, debutQuote+"$1"+finQuote );
	  }
	}
   
	return str;
 
  },
 
  htmlSpecialChars : function (str) {

	  str = str.replace(/&/gi,'&amp;');
	  str = str.replace(/"/gi,'&quot;');
	  str = str.replace(/'/gi,'&#039;');
	  str = str.replace(/</gi,'&lt;');
	  str = str.replace(/>/gi,'&gt;');
	  str = str.replace(/,/gi,'&#44;'); // fix code with a , in it
	  str = str.replace(/  /gi, '&nbsp; ');  // fix for multiple spaces
	  str = str.replace(/\n/g, "<br/>\n" );
	 
	  return str;
  }
}

/***************************************************************/

var timer;
var timerOpacity;

var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var clearPreview = function()
{
	var container = document.getElementById('apercu_reponse');
	container.style.display = 'none';
	container.style.opacity = 1;		   
}

var fadeAway = function()
{
	var opacity = 1;
	timerOpacity = setInterval(function()
	{
		var container = document.getElementById('apercu_reponse');
		opacity -= 0.01;
		container.style.opacity = opacity;
		if (opacity < 0) clearPreview()
	}
	, 1);   
}

var launchFading = function()
{
	clearTimeout(timer);
	clearInterval(timerOpacity);
	document.getElementById('apercu_reponse').style.opacity = 1;
	timer = setTimeout(fadeAway, 5000);   
}

var generatePreview = function (textAreaId)
{
	var container;
	if (!document.getElementById('apercu_reponse'))
	{
		container = document.createElement('div');
		container.id = 'apercu_reponse';
		container.style.position = 'absolute';
		container.style.textAlign = 'left';
		container.style.backgroundColor = 'rgb(247, 247, 247)';
		container.style.overflow = 'auto';
		container.style.padding = '5px';
		container.style.width = '80%';
		container.style.maxHeight = '200px';
		container.style.border = '1px solid black';
		container.style.fontSize = '13px';
		container.style.left = '10%';   
		container.addEventListener('scroll', launchFading, false);
		document.getElementById('mesdiscussions').appendChild(container);
	}
	else
	{
		container = document.getElementById('apercu_reponse');
	}
   
	var content = document.getElementById(textAreaId);
	container.style.top = window.scrollY + 10 + 'px';
	container.innerHTML = BBParser.parse(content.value);
	if (container.scrollTop == 0 || container.style.display == 'block') launchFading();
	container.style.display = content.value == '' ? 'none' : 'block';
	
	var pourcentage = content.value.slice(0, content.selectionStart).split('\n').length * 100 / content.value.split('\n').length;
	pourcentage = pourcentage < 1 ? 0 : pourcentage;
	var noScrollLimit = parseInt(container.style.maxHeight) * 100 / container.scrollHeight;
	container.scrollTop = pourcentage > noScrollLimit ? (container.scrollHeight * (pourcentage - noScrollLimit + 1) / 100) + (parseInt(container.style.maxHeight) / 2) : 0;
}

window.addEventListener('scroll', function()
{
	var container = document.getElementById('apercu_reponse');
	if (container && container.style.opacity == 1)
	{
		container.style.top = window.scrollY + 10 + 'px';
	}
}
, false);

/* Gestion de la reponse rapide */

if (document.getElementById('content_form'))
{
	document.getElementById('content_form').addEventListener('keyup', function ()
	{
		generatePreview('content_form');
	}
	, false);
}

/* Gestion de l'edit rapide */

var root = document.getElementById('mesdiscussions');

getElementByXpath('.//table//tr[starts-with(@class, "message")]//div[@class="left"]//a[starts-with(@href, "/message.php")]//img[@alt="Edition rapide"]', root)
.forEach(function(img)
{
	var onclickCommand = img.parentNode.getAttribute('onclick');
	var numreponse = onclickCommand.match(/edit_in\('.*','.*',[0-9]+,([0-9]+),''\)/).pop();
	img.parentNode.addEventListener('click', function()
	{
		var timer = setInterval(function()
		{
			if (document.getElementById('rep_editin_' + numreponse))
			{
				clearInterval(timer);
				document.getElementById('rep_editin_' + numreponse).addEventListener('keyup', function ()
				{
					generatePreview('rep_editin_' + numreponse);
				}
				, false);
				
				var buttonValide = document.getElementById('rep_editin_' + numreponse).nextSibling.firstChild;
				buttonValide.addEventListener('click', clearPreview, false);
				buttonValide.nextSibling.addEventListener('click', clearPreview, false);
			}
		}
		, 500);
	}
	, false);
});

// ============ Module d'auto update du script ============
({
	check4Update : function()
	{
		var autoUpdate = this;
		var mirrorUrl = GM_getValue('mirrorUrl', 'null');
		if (mirrorUrl == 'null') autoUpdate.retrieveMirrorUrl();

		var currentVersion = GM_getValue('currentVersion', '0.2.4');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.2.4', currentVersion))
		{
			GM_setValue('currentVersion', '0.2.4');
			currentVersion = '0.2.4';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.2.4'))
		{
			GM_registerMenuCommand("[HFR] Apercu des posts dans la reponse/edition rapide -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'apercu_reponse_rapide.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Apercu des posts dans la reponse/edition rapide');
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
						if (confirm('Une nouvelle version de [HFR] Apercu des posts dans la reponse/edition rapide est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'apercu_reponse_rapide.user.js');
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