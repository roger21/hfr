// ==UserScript==
// @name           [HFR] Anti Rehost
// @namespace      http://mycrub.info
// @description    Supprime automatiquement "http://hfr-rehost.net/" devant le nom d'une image
// @include        http://forum.hardware.fr/*
// ==/UserScript==

var img, src, newSrc;
var rehost = ['http://hfr-rehost.net/', 'http://hfr-rehost.net/preview/'];

//var replacement = '';
var replacement = 'http://pix.nofrag.com/';

var imgs = document.getElementsByTagName('img');

for (var i = 0; i < imgs.length; ++i) {
  img = imgs[i];
  src = img.getAttribute('src');
  for (var j = 0; j < rehost.length; j++) {
    if (src && src.match("^" + rehost[j] + ".*" ))
    {
      newSrc = src.substring(rehost[j].length);
      if (replacement && replacement.length > 0 && !newSrc.match("^" + replacement + ".*" )) {
        newSrc = replacement + newSrc;
      }

      img.setAttribute('src', newSrc);
      img.setAttribute('alt', newSrc);
      img.setAttribute('title', newSrc);
      GM_log(img.getAttribute('src'));
      break;
    }
  }
}
