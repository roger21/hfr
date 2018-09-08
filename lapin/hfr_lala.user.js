// ==UserScript==
// @name Stable Anchor
// @version 0.0.0.1
// @namespace hfr_0x90
// @description Stabe anchor during image loading
// @include https://forum.hardware.fr/*
// ==/UserScript==


// historique modifs r21 :
// 0.0.0.1 (03/12/2017) :
// - passage au https


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
