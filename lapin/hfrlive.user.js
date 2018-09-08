// ==UserScript==
// @name         HFRLive
// @namespace    http://scripts.theboredengineers.com/
// @version      0.3.1.1
// @description  Update automatique des messages sur HFR 
// @author       psykhi
// @downloadURL  http://scripts.theboredengineers.com/HFRLive.user.js
// @include      https://forum.hardware.fr/forum2.php*
// @include      https://forum.hardware.fr/hfr/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// ==/UserScript==


// historique modifs r21 :
// 0.3.1.1 (03/12/2017) :
// - passage au https


//Globals



//jQuery Loader :)
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}



function main(){

    var options =
        {
            refresh_enabled: false,
            refresh_interval: 4000,
            notifications_enabled: false
        };
    /**
 * String that holds the template href to add to the response button
 * @type type
 */
    var href_string;
    var button;
    /**
 * We keep this variable so we know a previous refresh is not running
 * @type Boolean|Boolean|Boolean
 */
var ready_to_refresh = true;

    placeButton();
    //We save the href template to respond to a message
    href_string = getElementByXpath
    ('//*[@id="mesdiscussions"]/table[3]/tbody/tr/td[2]/div[1]/div[1]/span/a/a').
    href;
    href_string = href_string.replace(/numrep=(.*?)&/, "numrep=trav&");
    if(hfr_GM_getValue(getCurrentPageIndex(),false)||hfr_GM_getValue(getCurrentPageIndex()-1,false))
    {
        hfr_GM_setValue(getCurrentPageIndex()-1,false);
        refresh_enabled = true;
        onButtonClick();
    }


    //functions
    function getElementByXpath (path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    /**
 * @brief Finds the URL to a given message
 * @param {type} message
 * @returns {@exp;href_string@call;replace}
 */
    function getMessageLink(message)
    {
        var message_value = message.find('a[href^="#t"]').get(0).hash.substring(2);
        return href_string.replace("trav", message_value);
    }
    /**
 * @brief Fixes the missing href link for the reply button
 * @param {type} message
 * @returns {undefined}
 */
    function appendMissingQuoteHref(message)
    {
        var to_modify = jQ(message).find('img[src="http://forum-images.hardware.fr/themes_static/images_forum/1/quote.gif"]').get(0);
        jQ(to_modify).wrap('<a href ="' + getMessageLink(message) + '"></a>');
    }

    function placeButton(){
        button = document.createElement("button");
        button.setAttribute("id","live_button");
        button.setAttribute("value","LIVE");
        button.style.background = "#f39c12";
        button.className="live_button";
        button.style.fontWeight ="bold";
        buttonText =document.createTextNode("LIVE");
        button.appendChild(buttonText);

        button2 = document.createElement("button");
        button2.setAttribute("id","live_button");
        button2.setAttribute("value","LIVE");
        button2.style.background = "#f39c12";
        button2.className="live_button";
        button2.className+=" pagepresuiv";
        buttonText =document.createTextNode("LIVE");
        button2.appendChild(buttonText);

        //Next to the printer icon
        right=getElementByXpath('//*[@id="mesdiscussions"]/table[2]/tbody/tr[1]/th/div');
        right.insertBefore(button, right.childNodes[0]); 
        jQ(".fondForum2PagesBas ").find(".pagepresuiv").last().after(button2);
        jQ(".live_button").click(onButtonClick);
    }

    /**
 * 
 * @returns current page ex "33256"
 */
    function getCurrentPageIndex()
    {
        return jQ(".cBackHeader").find("b:last").last().get(0).innerHTML;
    }
    /**
 * @brief Gets the latest page index
 * @param {type} html
 * @returns last page ex :"33256"
 */
    function getLatestPageIndex(html)
    {
        return jQ(html).find(".cBackHeader .left ").children().last().get(0).innerHTML;
    }
    /**
 * @brief Goes to the next forum page
 * @param {type} html
 * @returns {undefined}
 */
    function goToNextPage(html)
    {
        var url = jQ(html).find(".pagepresuiv a").get(0).href;
        window.location.href = jQ(html).find(".pagepresuiv a").get(0).href;
        var request =
            {
                redirect: url,
                options: options
            };
    }
    /**
 * @brief Refreshes the page
 * @returns {undefined}
 */
    function refresh()
{
    //console.log("refreshing");
//We look where the last message is
    if (ready_to_refresh) {
        ready_to_refresh = false;
        var page_len = jQ(".messagetable").length;
        jQ.get(document.URL, function(data)
        {
            try {
                // New page HTML
                var html = jQ.parseHTML(data);
                // Message count of current page
                var mess_table = jQ(html).find(".messagetable")
                var mess_count = mess_table.length;
                var current_page = getCurrentPageIndex();
                var last_page = getLatestPageIndex(html);
                if (current_page !== last_page)
                {
                    goToNextPage(html);
                    return;
                }
                if (mess_count !== page_len)
                {
                    var target = jQ(".messagetable").last();
                    var message;
                    for (i = page_len; i < mess_count; i++)
                    {
                        //We append the new message
                        message = mess_table.get(i);
                        appendMissingQuoteHref(jQ(message));
                        jQ(".messagetable").last().after(message).fadeIn(1000);
                    }

                    jQ('html, body').on("scroll mousedown DOMMouseScroll mousewheel keyup", function() {
                        jQ('html, body').stop();
                    });

                    //We scroll to the last read message
                    jQ('html, body').animate({
                        scrollTop: target.offset().top
                    }, 2000, function() {
                        jQ('html, body').off("scroll mousedown DOMMouseScroll mousewheel keyup");
                    });
                }
                ready_to_refresh = true;
            }
            catch (err)
            {
                ready_to_refresh = true;
            }
        });

    }
    else
    {
        //console.log("not ready to refresh.");
    }
}

    function onButtonClick()
    {
        options.refresh_enabled = !options.refresh_enabled;
        if(options.refresh_enabled)
        {
            timer = setInterval(refresh, options.refresh_interval); 
            document.getElementById("live_button").innerHTML = "LIVE";
            jQ(".live_button").css("background","#4BC730");
            hfr_GM_setValue(getCurrentPageIndex(),true);
        }
        else
        {
            clearInterval(timer);
            document.getElementById("live_button").innerHTML = "LIVE";
            jQ(".live_button").css("background", "#f39c12");
            hfr_GM_setValue(getCurrentPageIndex(),false);
        }
    }

    function hfr_GM_setValue( cookieName, cookieValue, lifeTime ) {
        if( !cookieName ) { return; }
        if( lifeTime == "delete" ) { lifeTime = -10; } else { lifeTime = 31536000; }
        document.cookie = escape( cookieName ) + "=" + escape( hfr_getRecoverableString( cookieValue ) ) +
            ";expires=" + ( new Date( ( new Date() ).getTime() + ( 1000 * lifeTime ) ) ).toGMTString() + ";path=/";
    }

    function hfr_GM_getValue( cookieName, oDefault ) {
        var cookieJar = document.cookie.split( "; " );
        for( var x = 0; x < cookieJar.length; x++ ) {
            var oneCookie = cookieJar[x].split( "=" );
            if( oneCookie[0] == escape( cookieName ) ) {
                try {
                    eval('var footm = '+unescape( oneCookie[1] ));
                } catch(e) { return oDefault; }
                return footm;
            }
        }
        return oDefault;
    }
    function hfr_getRecoverableString(oVar,notFirst) {
        var oType = typeof(oVar);
        if( ( oType == 'null' ) || ( oType == 'object' && !oVar ) ) {
            //most browsers say that the typeof for null is 'object', but unlike a real
            //object, it will not have any overall value
            return 'null';
        }
        if( oType == 'undefined' ) { return 'window.uDfXZ0_d'; }
        if( oType == 'object' ) {
            //Safari throws errors when comparing non-objects with window/document/etc
            if( oVar == window ) { return 'window'; }
            if( oVar == document ) { return 'document'; }
            if( oVar == document.body ) { return 'document.body'; }
            if( oVar == document.documentElement ) { return 'document.documentElement'; }
        }
        if( oVar.nodeType && ( oVar.childNodes || oVar.ownerElement ) ) { return '{error:\'DOM node\'}'; }
        if( !notFirst ) {
            Object.prototype.toRecoverableString = function (oBn) {
                if( this.tempLockIgnoreMe ) { return '{\'LoopBack\'}'; }
                this.tempLockIgnoreMe = true;
                var retVal = '{', sepChar = '', j;
                for( var i in this ) {
                    if( i == 'toRecoverableString' || i == 'tempLockIgnoreMe' || i == 'prototype' || i == 'constructor' ) { continue; }
                    if( oBn && ( i == 'index' || i == 'input' || i == 'length' || i == 'toRecoverableObString' ) ) { continue; }
                    j = this[i];
                    if( !i.match(hfr_basicObPropNameValStr) ) {
                        //for some reason, you cannot use unescape when defining peoperty names inline
                        for( var x = 0; x < cleanStrFromAr.length; x++ ) {
                            i = i.replace(cleanStrFromAr[x],cleanStrToAr[x]);
                        }
                        i = '\''+i+'\'';
                    } else if( window.ActiveXObject && navigator.userAgent.indexOf('Mac') + 1 && !navigator.__ice_version && window.ScriptEngine && ScriptEngine() == 'JScript' && i.match(/^\d+jQ/) ) {
                        //IE mac does not allow numerical property names to be used unless they are quoted
                        i = '\''+i+'\'';
                    }
                    retVal += sepChar+i+':'+hfr_getRecoverableString(j,true);
                    sepChar = ',';
                }
                retVal += '}';
                this.tempLockIgnoreMe = false;
                return retVal;
            };
            Array.prototype.toRecoverableObString = Object.prototype.toRecoverableString;
            Array.prototype.toRecoverableString = function () {
                if( this.tempLock ) { return '[\'LoopBack\']'; }
                if( !this.length ) {
                    var oCountProp = 0;
                    for( var i in this ) { if( i != 'toRecoverableString' && i != 'toRecoverableObString' && i != 'tempLockIgnoreMe' && i != 'prototype' && i != 'constructor' && i != 'index' && i != 'input' && i != 'length' ) { oCountProp++; } }
                    if( oCountProp ) { return this.toRecoverableObString(true); }
                }
                this.tempLock = true;
                var retVal = '[';
                for( var i = 0; i < this.length; i++ ) {
                    retVal += (i?',':'')+hfr_getRecoverableString(this[i],true);
                }

                retVal += ']';
                delete this.tempLock;
                return retVal;
            };
            Boolean.prototype.toRecoverableString = function () {
                return ''+this+'';
            };
            Date.prototype.toRecoverableString = function () {
                return 'new Date('+this.getTime()+')';
            };
            Function.prototype.toRecoverableString = function () {
                return this.toString().replace(/^\s+|\s+jQ/g,'').replace(/^function\s*\w*\([^\)]*\)\s*\{\s*\[native\s+code\]\s*\}jQ/i,'function () {[\'native code\'];}');
            };
            Number.prototype.toRecoverableString = function () {
                if( isNaN(this) ) { return 'Number.NaN'; }
                if( this == Number.POSITIVE_INFINITY ) { return 'Number.POSITIVE_INFINITY'; }
                if( this == Number.NEGATIVE_INFINITY ) { return 'Number.NEGATIVE_INFINITY'; }
                return ''+this+'';
            };
            RegExp.prototype.toRecoverableString = function () {
                return '\/'+this.source+'\/'+(this.global?'g':'')+(this.ignoreCase?'i':'');
            };
            String.prototype.toRecoverableString = function () {
                var oTmp = escape(this);
                if( oTmp == this ) { return '\''+this+'\''; }
                return 'unescape(\''+oTmp+'\')';
            };
        }
        if( !oVar.toRecoverableString ) { return '{error:\'internal object\'}'; }

        var oTmp = oVar.toRecoverableString();

        if( !notFirst ) {
            //prevent it from changing for...in loops that the page may be using
            delete Object.prototype.toRecoverableString;
            delete Array.prototype.toRecoverableObString;
            delete Array.prototype.toRecoverableString;
            delete Boolean.prototype.toRecoverableString;
            delete Date.prototype.toRecoverableString;
            delete Function.prototype.toRecoverableString;
            delete Number.prototype.toRecoverableString;
            delete RegExp.prototype.toRecoverableString;
            delete String.prototype.toRecoverableString;
        }

        return oTmp;
    }
}

//Actual scripts


// load jQuery and execute the main function
addJQuery(main);
