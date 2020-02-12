// ==UserScript==
// @name Image quote preview
// @namespace http://untitled-document.info/
// @description Adds a preview on image quoted in mes discussions
// @include http://forum.hardware.fr/*
// ==/UserScript==

function $x(p, context) {
  if (!context) context = document;
  var i, arr = [], xpr = document.evaluate(p, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (i = 0; item = xpr.snapshotItem(i); i++) arr.push(item);
  return arr;
}

function testLinkToImage(link) {
	return link.href.match(/\.(jpeg|jpg|png|gif)$/i);
}

function loading(element) {
	var dyn = "";
	return  setInterval(function() {
		dyn+= ".";
		if(dyn.length == 4) dyn = "";
		element.innerHTML ="Loading" + dyn;
	},500);
}

var base = document.getElementById('mesdiscussions');
var links = $x('//table[@class="oldcitation"]//a | //table[@class="citation"]//a',base);

links.filter(testLinkToImage).forEach(function(link) {
	var container;
	var loadingText;
	var img;
	var bePatient;
	
	link.addEventListener('mouseover',function() {
		loadingText = document.createElement('p');
		loadingText.style.marginLeft = '50px';
		loadingText.style.fontFamily = 'arial,sans-serif';
		loadingText.style.fontWeight = 'bold';
		loadingText.innerHTML = "Loading";
		
		bePatient = loading(loadingText);
		
		container = document.createElement('div');
		container.style.position = "absolute";
		container.style.background = "white";
		container.style.width = "300px";
		container.style.border = "1px solid black";
		container.style.top = window.scrollY+10+"px";
		container.style.right = "10px";
		
		document.body.appendChild(container);
		container.appendChild(loadingText);
		
		img = new Image();
		img.style.display='block';
		img.style.margin = "auto";
		img.addEventListener('load',function() {
			var setWidth;
		
			if(loadingText.parentNode)	loadingText.parentNode.removeChild(loadingText);
			
			[].slice.apply(container.getElementsByTagName('img')).forEach(function(item) {
				item.parentNode.removeChild(item);
			});
			
			
			if(this.naturalWidth > 300)
				setWidth = 300 +"px"; 
			else
				setWidth = this.naturalWidth + "px";
				
			this.style.width = setWidth;
			container.appendChild(this);
			clearInterval(bePatient);
		},false);
		
		img.src = this.href;
	},false);
	
	link.addEventListener('mouseout',function() {
		if(container) {
			container.parentNode.removeChild(container);
		}
		[container,loadingText,img,bePatient].forEach(function(item) {
			delete item;
		});

	},false);
});