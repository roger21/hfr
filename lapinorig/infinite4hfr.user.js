// ==UserScript==
// @name        InfinitScrol@HFR
// @namespace   http://forum.hardware.fr/forum2.php
// @include     http://forum.hardware.fr/forum2.php*
// @version     1
// @grant       none
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var paginate = '.fondForum2PagesBas';
var message  = '.messagetable';
var nextpage = '.pagepresuiv:first a';

var load     = false;
var offset   = $(paginate) .offset() .top;

var ajoutePage = function (html) {
    $(paginate).closest('table').remove();

	var $html     = $(html);
	var $messages = $html.find(message);
	var $page     = $html.find(paginate).closest('table');
	$messages.first().hide();

    $(message+':last').after($page).after($messages);

    offset = $(paginate) .offset() .top;
    load   = false;
};

$(window).scroll(function () {
    var height   = window.innerHeight;
    var scrollY  = window.scrollY;
    if ((!load) && (scrollY > (offset - height))) {
        load            = true;
        var $pagination = $(paginate);
        var $url        = $pagination.find(nextpage);
        if ($url.length>0) { 
            var url      = $url.get(0).href;

            $.ajax({
                url: url,
                success: ajoutePage,
                error: function (error) {
                    alert('ko');
                    console.log(error);
                },
            });
        } else {
           // $pagination.empty().html('<center>Plus de page.</center>');
        }
    }

});
