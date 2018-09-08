// ==UserScript==
// @name Mes Discussions Video Link Replacer
// @namespace http://noledgedis.com/
// @description Replace a youtube, dailymotion or vimeo link by an embed video
// @include http://forum.hardware.fr/*
// @version 0.1.7
// ==/UserScript==

(function() {
  var SELECTOR = '.spoiler .cLink, .messCase2 > div[id] > p > .cLink';
  var HEIGHT = 315;
  var WIDTH = 560;
  var HASH = /#.*$/;

  var matchers = [
    /http(?:s)?\:\/\/(?:www\.)?(youtu)be\.com\/.+v=([\w\-_]+)/,
    /http(?:s)?\:\/\/(youtu)\.be\/([\w\-_]+)/,
    /http(?:s)?\:\/\/(?:www\.)?(dailymotion)\.com(\/video\/[\w\-_]+)/,
    /http\:\/\/(vimeo)\.com\/([\w\-_]+)/
  ];

  var roots = {
    youtu:  'http://www.youtube.com/embed/',
    dailymotion: 'http://www.dailymotion.com/embed/',
    vimeo: 'http://player.vimeo.com/video/'
  };

  function onClickReplaceWith(el, iframe) {
    el.addEventListener('click', function(e) {
      el.parentNode.replaceChild(iframe, el);
      e.preventDefault();
    });
  }

  var i, l, link, links = document.querySelectorAll(SELECTOR);

  for(i = 0, l = links.length; i < l; i += 1) {
    link = links[i];
    var href = link.href;
    var img = link.querySelector('img');
    var text = link.textContent;
    var h = href.match(HASH);

    matchers.forEach(function(matcher) {
      if(matcher.test(href)) {
        var tokens = href.match(matcher);
        var name = tokens[1]
        var src = tokens[2];
        var hash = h ? h[0] : '';

        var iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('webkitAllowFullScreen', '');
        iframe.setAttribute('mozallowfullscreen', '');
        iframe.setAttribute('src', roots[name] + src + hash);
        iframe.setAttribute('width', WIDTH);
        iframe.setAttribute('height', HEIGHT);

        if(text.indexOf('http') === 0) {
          link.parentNode.replaceChild(iframe, link);
        } else {
          onClickReplaceWith(img || link, iframe);
        }
      }
    });
  }
}());