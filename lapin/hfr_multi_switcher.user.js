// ==UserScript==
// @name [HFR] Multi Switcher
// @version 0.1.2.2
// @namespace http://toyonos.info
// @description Permet de poster rapidement avec un multi sans avoir besoin de se déconnecter du forum
// @include https://forum.hardware.fr/*
// @exclude https://forum.hardware.fr/message.php*
// @exclude https://forum.hardware.fr/forum*cat=prive*
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
// 0.1.2.2 (10/12/2017) :
// - commentage des alert XML
// 0.1.2.1 (03/12/2017) :
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

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
function hex_hmac_md5(k, d)
  { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_md5(k, d)
  { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_md5(k, d, e)
  { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of a raw string
 */
function rstr_md5(s)
{
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}

/*
 * Calculate the HMAC-MD5, of a key and some data (raw strings)
 */
function rstr_hmac_md5(key, data)
{
  var bkey = rstr2binl(key);
  if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var i, j, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. All remainders are stored for later
   * use.
   */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)));
  var remainders = Array(full_length);
  for(j = 0; j < full_length; j++)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[j] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
  return output;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
function binl_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/******************************************************************/

var cssManager = 
{
	cssContent : '',
	
	addCssProperties : function (properties)
	{
		cssManager.cssContent += properties;
	},
	
	insertStyle : function ()
	{
		GM_addStyle(cssManager.cssContent);
		cssManager.cssContent = '';
	}

};

var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
};

var multiSwitcher =
{
	mainUser : null,
	
	hashCheck : null,
	
	readCookie : function (name)
	{
		var begin = document.cookie.indexOf(name + '=');
		if (begin >= 0)
		{
			begin += name.length + 1;
			var end = document.cookie.indexOf(';', begin);
			return decodeURIComponent(document.cookie.substring(begin, end == -1 ? document.cookie.length : end));
		}
		else return null;
	},

	writeCookie : function (name, value)
	{
		var argv = this.writeCookie.arguments;
		var argc = this.writeCookie.arguments.length;
		var expires = argc > 2 ? argv[2] : null;
		var path = argc > 3 ? argv[3] : null;
		var domain = argc > 4 ? argv[4] : null;
		var secure = argc > 5 ? argv[5] : false;
		document.cookie = name + '=' + encodeURIComponent(value) +
		(expires == null ? '' : '; expires=' + expires.toGMTString()) +
		(path == null ? '' : '; path=' + path) +
		(domain == null ? '' : '; domain=' + domain) +
		(secure ? '; secure' : '');
	},
	
	/*generateStyle : function ()
	{
		//cssManager.addCssProperties("...");
	},*/
	
	get identities()
	{
		return eval('(' + GM_getValue('identities', '{}') + ')');
	},
	
	get identitiesLength()
	{
		var i = 0;
		for (var user in this.identities) i++;
		return i;
	},
	
	get currentUser()
	{
		return this.readCookie('md_user').replace(/\+/g, " ");
	},

	saveIdentities : function (identities)
	{
		var jsonStr = '{';
		if (identities[this.mainUser] != null) jsonStr += '\'' + this.mainUser.replace(/'/g, "\\'") + '\' : \'' + identities[this.mainUser] + '\', ';
		for (var user in identities)
		{
			if (user != this.mainUser) jsonStr += '\'' + user.replace(/'/g, "\\'") + '\' : \'' + identities[user] + '\', ';
		}
		jsonStr += '}';
		GM_setValue('identities', jsonStr);
	},
	
	addIdentity : function (user, pass)
	{
		var identities = this.identities;
		identities[user] = pass;
		this.saveIdentities(identities);
	},

	removeIdentity : function (user)
	{
		var identities = this.identities;
		delete identities[user];
		this.saveIdentities(identities);
	},
	
	isUserConnected : function (pseudo)
	{
		return this.currentUser == pseudo;
	},

	switchCookies : function (user, pass)
	{
		this.writeCookie('md_user', user, null, '/', '.hardware.fr');	
		this.writeCookie('md_passs', pass, null, '/', '.hardware.fr');	
	},

	switchIdentity : function (user, pass)
	{
		var self = this;
		
		// Si le pseudo selectionné est déjà connecté, on ne fait rien
		if (self.isUserConnected(user)) return;

		if (!document.getElementById('switch_multi').checked) GM_setValue('restore_identity', self.currentUser);	
		
		self.switchCookies(user, pass);
		getElementByXpath('//input[@name="hash_check"]', document).forEach(function(hashCheckInput)
		{
			hashCheckInput.value = self.hashCheck;
		}
		);

		var pseudoInput = getElementByXpath('//input[@name="pseudo"]', document).pop();
		pseudoInput.value = user;
	},
	
	retrieveHashCheck : function (user, pass)
	{
		var self = this;
		
		var submitButton = document.getElementById('submitreprap');
		submitButton.disabled = 'disabled';

		// On sauvegarde le user courant
		var currentUser = self.currentUser;
		self.switchCookies(user, pass);
		toyoAjaxLib.loadDoc(document.location, 'get', null, function(pageContent)
		{
			var contentNode = document.createElement('div');
			contentNode.innerHTML = pageContent;

			self.hashCheck = getElementByXpath('.//input[@name="hash_check"]', contentNode).pop().value;
			submitButton.disabled = '';
			self.switchCookies(currentUser, self.identities[currentUser]);
		}
		);		
	},
	
	launch : function ()
	{	
		var self = this;
		var identitiesLength = this.identitiesLength;
		var identities = this.identities;
		
		// Pseudo principal non défini, on arrête là
		if (identitiesLength == 0) return;

		// Le premier pseudo de la liste est le pseudo principal
		for (var user in identities)
		{
			self.mainUser = user;
			break;
		}

		// On repositionne si besoin est, le cookie sur le pseudo principal
		if (GM_getValue('restore_identity', 0) != 0 && document.location == 'https://forum.hardware.fr/bddpost.php')
		{
			var user2Restore = GM_getValue('restore_identity');
			self.switchCookies(user2Restore, identities[user2Restore]);
			GM_setValue('restore_identity', 0);
		}
		
		// On s'assure de la présence du bouton de réponse
		var submitButton = document.getElementById('submitreprap');
		if (submitButton == null) return;

		// Il faut qu'il y ait au moins un multi pour continuer
		if (identitiesLength < 2) return;
		
		// Création de la liste des multis
		var multisList = document.createElement('select');
		multisList.addEventListener('change', function()
		{
			if (document.getElementById('switch_multi').checked)
			{
				if (!self.isUserConnected(this.value))
				{
					// Changement permanent avec rechargement de la page
					self.switchCookies(this.value, identities[this.value]);
					window.location.reload();
				}
			}
			else
			{
				// Changement temporaire, on ne fait que récupérer la valeur du hashcheck
				self.retrieveHashCheck(this.value, identities[this.value]);
			}
		}
		, false);
		
		var tmpArray = new Array();
		for (var user in identities) if (user != self.mainUser) tmpArray.push(user);
		tmpArray.sort();
		
		var multi = document.createElement('option');
		multi.value = self.mainUser;
		multi.innerHTML = self.mainUser;
		if (self.isUserConnected(self.mainUser)) multi.selected = 'selected';
		multisList.appendChild(multi);
		
		tmpArray.forEach(function (user)
		{
			var multi = document.createElement('option');
			multi.value = user;
			multi.innerHTML = user;
			if (self.isUserConnected(user)) multi.selected = 'selected';
			multisList.appendChild(multi);
		}
		);
		submitButton.parentNode.insertBefore(multisList, submitButton.nextSibling);
		
		var newSpan = document.createElement('span');
		newSpan.innerHTML = ' en tant que ';
		submitButton.parentNode.insertBefore(newSpan, multisList);
		
		var formRep = getElementByXpath('//form[@name="hop"]', document).pop();
		formRep.addEventListener('submit', function()
		{
			self.switchIdentity(multisList.value, identities[multisList.value]);
		}
		, false);
		
		var newLabel = document.createElement('label');
		newLabel.innerHTML = ' Changement immédiat & permanent ? ';
		newLabel.setAttribute('for', 'switch_multi');
		submitButton.parentNode.insertBefore(newLabel, multisList.nextSibling);
		
		var newCheckbox = document.createElement('input');
		newCheckbox.type = 'checkbox';
		newCheckbox.id = 'switch_multi';
		submitButton.parentNode.insertBefore(newCheckbox, newLabel.nextSibling);
	}
}

multiSwitcher.launch();

// Script de création du menu de configuration
var cmScript =
{
	backgroundDiv : null,
	
	configDiv : null,
	
	timer : null,
	
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
		//else if (key == 13) cmScript.validateConfig();
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
		if (!document.getElementById('ms_back'))
		{
			cmScript.backgroundDiv = document.createElement("div");
			cmScript.backgroundDiv.id = 'ms_back';
			cmScript.backgroundDiv.addEventListener('click', function()
			{
				clearInterval(cmScript.timer);
				cmScript.hideConfigWindow();
			}
			, false);
			cssManager.addCssProperties("#ms_back { display: none; position: absolute; left: 0px; top: 0px; background-color: #242424; z-index: 1001;}");
			document.body.appendChild(cmScript.backgroundDiv);
		}
	},
	
	buildConfigWindow : function ()
	{
		if (!document.getElementById('ms_front'))
		{	
			cmScript.configDiv = document.createElement("div");
			cmScript.configDiv.id = 'ms_front';
			cmScript.configDiv.style.width = '480px'; 
			cssManager.addCssProperties("#ms_front { display: none; vertical-align: bottom; height: 90px; position: absolute; background-color: #F7F7F7; z-index: 1002; border: 1px dotted #000; padding: 8px; text-align: left; font-family: Verdana;}");
			cssManager.addCssProperties("#ms_front span { font-size: 0.8em;}");
			cssManager.addCssProperties("#ms_front > span { font-weight: bold; display: block;}");
			cssManager.addCssProperties("#ms_front select { display: block; float: left; margin-right: 10px; width: 200px;}");
			cssManager.addCssProperties("#ms_front div { margin: 5px 10px;}");
			cssManager.addCssProperties("#ms_front input[type=image] { margin: -2px 3px; }");
			
			var multisList = document.createElement('select');
			multisList.size = 5;
			cmScript.configDiv.appendChild(multisList);
			cmScript.disableTabUp(multisList);
			
			var inputLogin = null;
			var inputPass = null;

			var label = document.createElement('span');
			label.innerHTML = "Ajouter/Modifier un multi ";
			cmScript.configDiv.appendChild(label);

			var inputOk = document.createElement('input');
			inputOk.type = 'image';
			inputOk.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%9FIDAT8%CB%A5%93%EBKSa%1C%C7%FD%3Bv%CEvl%03%09dD!%82%84P%7B%15%24%12%3B%9A%0D%C5%BC%2CK%D3%DD%BD%D26c%D8L%8B2r%5E%C6H)-%B3%D4jsNm%EA%D4%E6%D6%942q%D9QB%CC%BD%E9B%B5at%B1o%E7%EC%C5L%12%23z%E0%0B%0F%0F%CF%E7%F3%7B%AEq%00%E2%FE'%7F%0C%14%F8%0E%89r%A7%0F%EA%B3%3D)L%C6%E3%FDa%E9%888%2Cu%252Rg%A2%3E%DD%BEW%B4%AB%20%CF%9BJ%CB%3C%C9!%9DG%86%9BA%0B%FA%96%BB%A2%E9%5ClF%89%EB%18%24%BDTH%D2C%D1%3B%0A%D8%AAt%E6xR%E4%EA%9C%11%CE%D5~%D8%5E%5E%83i%AE2%1A%AE%EFX%EDC%E3L%15%0E%D8%F8%91d%1B%9F%DE%26%C8%F1%A4%083%DDI%EB%1C%CCM%AC%09%94%A1%C2_%02%CD%CC%19%E8%D8%94%B3%A9%F6%9D%85%FD%F5%3D%5C%9C%AA%80%D8B%AE%8B%AF%93%C2%98%40%E6N2%A8%C6%B2%A2%959%98%03U%DESPL%17B1U%00%F5T!%DCk%830x%95p%B0%92%DC%9E%23H%B8B%1Ab%82%8C%111%D3%19l%865%D8%84%0A_1%94O%E4%2C%98%0F%E5%24%1BO%3E%C6%DF%B8%C0%B5Pd%0Dm%CF%1Ba%9BkD%7C%3D%C9%C4%04G%ED%09%1B%0FVn%A36%A0%81%D6%5B%C4%AEd%00%8B%1F%E6%A1%9A(%C4%D8%DAP%14%FE%B1%F9%1Dm%CF.%C10Q%8C%BE%60'%04Fb%23%26%90%DC%A76%FA%97%BBa%F4%ABP%EB%D7%E2%D3%D7%8FQ%E8%FD%97%B71%D82%5B%0F%B5%2B%1Bz%F7i%F4%07%3B%20%A8%F9%5D%D0C17%E6%9B%D0%BEp%19%BAI9%CC%BEjD%BE%7D%8E%C2%9B%3F7ayz%01e%CE%2ChXAK%A0%0E%ED%5E3%A8*bk%0B%A9%B7%04%06%F9%40%1A%EC%2BwQ%3D!%87%DA%7D%12u%D3%E5Xz%B7%80%B6%D9%06%94%0E%1E%87%C2q%02%3Ag%0E%EC%AF%BA%91n%3D%0C%AA%92%D8%3A%C4d%2B_%B8%8F%BD%1A%B3G%83%87%CC%1DT%8E%E6A%3B%9C%03%D5%90%0CJ%07%17%0E%CE%C6%A3%A5.%18%87%8A!P%F3%D6)5!%DC%F6%90%12%9BH%3A%BE%81%88%98%DCep%B0%92%D6%80%19%FA%D1%22%9C%1B%96%A3%95%DD%82%9D%85%F5%CE%22%F0Ky%11%16%A6w%7C%CA%7B%1AH%9A2%11!i%87%04%ED~3z_X%D1%3Bo%85%C5kBZK*%04%0A%5E%88R%11%F4%AE%9F%89%3AO%8A(%03%A1%A7j%08F%A0%E5%85%05*%5E%98%AD%C8%B0%D1S%A5%84%E8%AF%BF%F1_%F3%0Bg%D0%AC%E5y%BA%D4c%00%00%00%00IEND%AEB%60%82";
			inputOk.alt = inputOk.title = 'Ajouter ou modifier ce multi';
			inputOk.addEventListener('click', function ()
			{
				if (multisList.value == null || inputLogin.value == '' || inputPass.value == '') return;
				if (multisList.value != -1) multiSwitcher.removeIdentity(multisList.value);
				
				// Cas particulier du pseudo principal
				if (multisList.value == multiSwitcher.mainUser || multiSwitcher.identitiesLength == 0)
				{
					multiSwitcher.mainUser = inputLogin.value;
				}
				
				multiSwitcher.addIdentity(inputLogin.value, hex_md5(inputPass.value));
				cmScript.refreshMultisList(multisList);
				inputLogin.value = '';
				inputPass.value = '';
			}
			, false);
			label.appendChild(inputOk);
			
			var inputDelete = document.createElement('input');
			inputDelete.type = 'image';
			inputDelete.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02!IDAT8%CB%95%93%EBN%13Q%14%85%89%89%C9%89%CF%A0V%89%86%C8%91%80%C4%1BB%5B%06(%AD%0D%08%26%D0%FB%85%5E%A4%80%B4%A5%ED%A4M%A16%EA%0FM%7C%12%9F%0BD%C5%DE%B0%D2%99v%3A%D3%E5%AE%98J-%25%E1%C7N%CEd%CE%FA%F6%AC%B5%F7%0C%00%18%B8L%D5%D7B%D7%CE%3Ew_%103%3A*%DEW%EC%0Fr%D9%ED%8D%D7lNC%2F%A0-%CE%EC%A2%95%CEB%8B'%7B%20u_%80%D7%03a46%B6%F0%EB%E5%CA%E7%EA%E2%D2%BD%7F%80%BFb%E4%DF%A1E%A5%25D47%B7%3B%10%D9%BB%C6%A9%3B%9A%D18%90%CB%A3%7D%3E6%5B%E3%E5%19%D3%95S%40*%CDZ%09Qk%ED%BE%01%3E~%82%96%CD%B5%01h%04B%5C%F6%F89u%87%B2%1D%03%E8%BD%EC%0F%E0x%FE%B9Z%16%E6%AEvY%D0b%09%A6%BE%8E%A9%9A%98%01%DE%7F%80%9AJ%A3%1E%0C%83%BAC%D9%8A%02%D9%BD%3F%E7%8A%C9B%E2Yvn%88%CD%C8%26k%84%D6%D5ft%87%EC%BC%05%F6%F2%24%CC%01%99%2Cd%8F%0F%959%B3Z%9E%9Ea%FD%A7p%1A%16%93%5C%5E%0DY%B2%E3%F6%01%0E7%20%A6Q%99%9D%D7JF%81%FD%7F%BF%07%209%3D%EDQ%014%0D%D8%9C%C0%8A%1D%D8I%92o%0B%0A%13S%FCB%80%E4ps%C9%E5%81%12%8E%00I%91%84)%20Fv(%40y%D5%8E%B2%DE%88%EFc%E3%FC%5C%40%CD%EE%E2%92%D3%0D%25%B4%0E%D0%18%25%87%0B%14%96Z%9C2h'%8B%CB%40d%03%B5%17%CB(%3C%7C%8C%C3%A1a%DE%05%A0%CD%E2%D4%1DJ%F0%15uM%40%A2O%A7%B0%D4%E2%A4%81%15%9EL%B0%A3%F1Gj%D5d%06%82!%9CX%AC8%1A%19%C5%C1%ADA%DE%01%D0f%095%9B%03J%20%04i%D5%01%0AK-%3E%D3w%02%FB62%C6%BE%0E%DFW%7F%1A%05H%D6%05%FC%18%7D%80%FD%1B%3A%A1%CB%02m%96P%5DXB%C90%ADQX%3Di%1F%DE%1Db_%06%EF%A8g%C5%3D!%96%F4F%A1%F0t%92%F5%FB%99%0Et%B7%D9%FE%F5%9B%C2%85c%BCl%FD%06r%BB%A4%C7%DB%ED%BE%14%00%00%00%00IEND%AEB%60%82";
			inputDelete.alt = inputDelete.title = 'Supprimer ce multi';
			inputDelete.addEventListener('click', function ()
			{
				if (multisList.value == null || multisList.value == multiSwitcher.mainUser || multisList.value == -1) return;
				multiSwitcher.removeIdentity(multisList.value);
				cmScript.refreshMultisList(multisList);
				inputLogin.value = '';
				inputPass.value = '';
			}
			, false);
			label.appendChild(inputDelete);
			
			var loginContainer = document.createElement('div');	
			var labelLogin = document.createElement('span');
			labelLogin.innerHTML = "Login : ";
			loginContainer.appendChild(labelLogin);
			var inputLogin = document.createElement('input');
			inputLogin.type = 'text';
			loginContainer.appendChild(inputLogin);
			cmScript.configDiv.appendChild(loginContainer);
			
			var passContainer = document.createElement('div');	
			var labelPass = document.createElement('span');
			labelPass.innerHTML = "Mot de passe : ";
			passContainer.appendChild(labelPass);
			inputPass = document.createElement('input');
			inputPass.type = 'password';
			passContainer.appendChild(inputPass);
			cmScript.disableTabDown(inputPass);
			cmScript.configDiv.appendChild(passContainer);

			cmScript.refreshMultisList(multisList);
			multisList.addEventListener('click', function ()
			{
				inputLogin.value = this.value == -1 ? '' : this.value;
				inputPass.value = '';
			}
			, false);

			document.body.appendChild(cmScript.configDiv);
		}
	},
	
	refreshMultisList : function (multisList)
	{
		multisList.innerHTML = '';
		var multi = document.createElement('option');
		multi.value = '-1';
		multi.innerHTML = '++ Nouveau multi ++';
		multisList.appendChild(multi);
		
		var tmpArray = new Array();
		for (var user in multiSwitcher.identities) if (user != multiSwitcher.mainUser) tmpArray.push(user);
		tmpArray.sort();
		
		var multi = document.createElement('option');
		multi.style.fontWeight = 'bold';
		multi.value = multiSwitcher.mainUser;
		multi.innerHTML = multiSwitcher.mainUser;
		multisList.appendChild(multi);
		
		tmpArray.forEach(function (user)
		{
			var multi = document.createElement('option');
			multi.value = user;
			multi.innerHTML = user;
			multisList.appendChild(multi);
		}
		);
		multisList.selectedIndex = 0;
		multisList.focus();
	},
	
	initBackAndFront : function ()
	{
		if (document.getElementById('ms_back'))
		{
			cmScript.setBackgroundPosition();
			cmScript.backgroundDiv.style.opacity = 0;
			cmScript.backgroundDiv.style.display = 'block';
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
		GM_registerMenuCommand("[HFR] Multi Switcher -> Configuration", this.showConfigWindow);
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

		var currentVersion = GM_getValue('currentVersion', '0.1.2');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.1.2', currentVersion))
		{
			GM_setValue('currentVersion', '0.1.2');
			currentVersion = '0.1.2';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.1.2'))
		{
			GM_registerMenuCommand("[HFR] Multi Switcher -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'hfr_multi_switcher.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Multi Switcher');
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
						if (confirm('Une nouvelle version de [HFR] Multi Switcher est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'hfr_multi_switcher.user.js');
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
