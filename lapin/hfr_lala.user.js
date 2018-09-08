// ==UserScript==
// @name Stable Anchor
// @namespace hfr_0x90
// @description Stabe anchor during image loading
// @include http://forum.hardware.fr/*
// ==/UserScript==

hfr_dest = document.location.hash;

function hfr_lala(event)
{
	document.location.hash = hfr_dest;
}

if (hfr_dest.length) {
	hfr_plist = document.getElementsByTagName("img");
	for (i=0; i<hfr_plist.length; i++) {
		hfr_plist.item(i).addEventListener('load', hfr_lala, true);
	}
}