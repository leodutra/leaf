/*	Leaf JavaScript Library
 * 	DOM Prototype Class
 *	version 0.1a
 * 	Leonardo Dutra
 * 
 *	Works well on Aptana IDE
 */

	if ('object' !== typeof window.leaf) {
		leaf = {};
	}

	Object.prototype.inherits = function (sourceObject)
	{
		for (var n in sourceObject) {
			this[n] = sourceObject[n];
		}
	};

	function isBoolean  (value) { return 'boolean' === typeof value; }
	function isArray    (value) { return value instanceof Array; }
	function isObject   (value) { return value? 'object'  === typeof value:false; }
	function isNumber   (value) { return 'number'  === typeof value && !isNaN(value); }
	function isString   (value) { return 'string'  === typeof value; }
	function isFunction (value) { return 'function'=== typeof value; }
	function hasValue   (value) { return value!==null && value!==undefined; }
	
	leaf.Ajax = {
		createXMLHttpRequest: function () {
			var o;
			if (window.XMLHttpRequest) {
				o = new XMLHttpRequest();
			}
			else if (window.ActiveXObject) {
				o = new ActiveXObject('Microsoft.XMLHTTP');
			}
			return o;
		}
	};
	
	leaf.Browser = {
		isIE:	     /msie/i,
		isFLOCK:     /flock/i,
		isFIREFOX:   /firefox/i,
		isSAFARI:    /safari/i,
		isOPERA:     /opera/i,
		isNETSCAPE:  /netscape/i,
		isSEAMONKEY: /seamonkey/i,
		isAVANT:     /avant/i,
		isAIR:       /adobeair/i,
		isWEBKIT:    /webkit/i,
		isGECKO:     /gecko/i,
		isMOZILLA:   /mozilla/i
	};
		
	leaf.Platform = {
		isMAC:   /mac/i,
		isWIN:   /win/i,
		isLINUX: /linux/i
	};
		
		
	leaf.Window = {
		addEvent: function (eventType, eventFunction)
		{ 
			leaf.DOM.core.addEvent(eventType, eventFunction, window);
		},
		
		removeEvent: function(eventType, eventFunction)
		{
			leaf.DOM.core.removeEvent(eventType, eventFunction, window);
		}
	};
		
		
	leaf.Screen = {
		getSize: function ()
		{
			return {
				width:  screen.width,
				height: screen.height
			};
		},
		
		getAvailSize: function () 
		{
			return {
				width:  screen.availWidth,
				height: screen.availHeight
			};
		},
		
		getCenter: function ()
		{
			return {
				x: screen.width /2,
				y: screen.height/2
			};
		}
	};


	leaf.Document = {
		addEvent: function (eventType, eventFunction)
		{ 
			leaf.DOM.core.addEvent(eventType, eventFunction, document);
		},
		
		removeEvent: function(eventType, eventFunction)
		{
			leaf.DOM.core.removeEvent(eventType, eventFunction, document);
		}
	};
		
		
	leaf.Mouse = {
		getPosition: function (event)
		{
			var err;
			try {
				var e = event||window.event;
				var d = document.documentElement;
				var x = isNumber(e.pageX)? e.pageX:e.clientX +d.scrollLeft -(parseFloat(d.clientLeft)||0);
				var y = isNumber(e.pageY)? e.pageY:e.clientY +d.scrollTop  -(parseFloat(d.clientLeft)||0);
				return {
					x: x>=0? x:0,
					y: y>=0? y:0
				};
			}
			catch(err) { 
				return { 
					x:0,
					y:0
				};
			}
		}
	};
	
	
	/*	Leaf DOM creation and prototype definition
	 */ 
	leaf.DOM = function (elementOrId)
	{
		if (this instanceof leaf.DOM) {
			this.DOM(elementOrId);
		}
	};
	
	leaf.DOM.importXML = function(uri, async){
	/* - App "sandbox" may vary
	 * - IE brute force for implementation.createDocument
	 */
		var e;
		var x;
		try {
			try {
				x = document.implementation.createDocument('', '', null);
			} 
			catch (e) {
				x = new window.ActiveXObject('Microsoft.XMLDOM');
			}
			x.async = !!async;
			x.load(uri);
		} 
		catch (e) {
			try {
				x = new XMLHttpRequest();
           		x.open("GET", uri, !!async);
            	x.send(null);
            	x = x.responseXML;
			}
			catch(e) {}
		}
		return x||null;
	};
	
	leaf.DOM.getById = function(idOrArray, parentNode){
		parentNode = leaf.DOM.core.getElement(parentNode)||document;
		if (isArray(idOrArray)) {
			var l = idOrArray.length;
			var e;
			var i;
			var j;
			var n = [];
			for (i = 0; i<l; i++) {
				e = parentNode.getElementById(idOrArray[i]);
				if (e) {
					n.push(e);
				}
			}
			return n;
		}
		else {
			return parentNode.getElementById(idOrArray);
		}
	};

	leaf.DOM.getByTag = function(tagNameOrArray, parentNode){
		var $ = tagNameOrArray;
		parentNode = leaf.DOM.getElement(parentNode)||document;
		if (isArray($)) {
			var l = $.length;
			var a;
			var i;
			var j;
			var k;
			var n = [];
			for (i = 0; i < l; i++) {
				a = parentNode.getElementsByTagName($[i]);
				k = a.length;
				for (j = 0; j < k; j++) {
					n.push(a[j]);
				}
			}
			return n;
		}
		else {
			return parentNode.getElementsByTagName($);
		}
	};
	
	leaf.DOM.hasCollision = function (elementA, elementB) {
		var _ = leaf.DOM.core;
		elementA = _.getElement(elementA);
		elementB = _.getElement(elementB);
		var err;
		var aX = 0;
		var aY = 0;
		var bX = 0;
		var bY = 0;
		try {
			var body = document.body;
			for (var a = elementA; a !== body; a = a.parentNode) {
				aX += a.offsetLeft;
				aY += a.offsetTop;
			}
			for (var b = elementB; b !== body; b = b.parentNode) {
				bX += b.offsetLeft;
				bY += b.offsetTop;
			}
			var x1 = aX;
  			var x2 = bX - elementA.offsetWidth;
			var x3 = bX + elementB.offsetWidth;
			if (x2 <= x1 && x1 <= x3) {
				var y1 = aY;
				var y2 = bY - elementA.offsetHeight;
				var y3 = bY + elementB.offsetHeight;
				return y2 <= y1 && y1 <= y3;
			}
			else {
				return false;
			}
		}
		catch (err) {
			return false;
		}
	};

	/* Static Core */
	leaf.DOM.core = {		
		addEvent: function (e, fn, o)
		{ 
			if (isString(e) && isFunction(fn)) {
				var err;  
				try { 
					o.addEventListener(e, fn, false);
				} 
				catch (err) {
					try {
						o.attachEvent('on'+e, fn);
					} 
					catch (err) {
					}
				}
			}
		},
		
		removeEvent: function (e, fn, o)
		{
			if (isString(e) && isFunction(fn)) {
				var err;
				try {
					o.removeEventListener(e, fn, false);
				} 
				catch (err) {
					try {
						o.detachEvent('on'+e, fn);
					} 
					catch (err) {
					}
				}
			}
		},
		
		purgeElement: function(o)
		{
			/* based on crockford.com purge */
			o = this.getElement(o);
			if (o) {
				var a = o.attributes;
				var i;
				var l;
				var n;
				if (a) {
					l = a.length;
					for (i = 0; i < l; i++) {
						n = a[i].name;
						if ('function' == typeof(o[n])) {
							o[n] = null;
						}
					}
				}
				a = o.childNodes;
				if (a) {
					l = a.length;
					for (i = 0; i < l; i++) {
						this.purgeElement(o.childNodes[i]);
					}
				}
			}
		},
		
		isHTML: function (o)
		{
			var e;
			try {
				return (/html/i).test(o.ownerDocument.documentElement.nodeName);
			}
			catch(e) {
				return !!document.getElementById(o);
			}
		},
		
		getElement: function ($)
		{
			return document.getElementById($)||(this.isHTML($)? $:null);
		}
	};
	
	
	/* Prototype */
	leaf.DOM.prototype = {
		
		DOM: function (elementOrId)
		{
			/* - core is like private... but it is accessible */
			this.core = {
				element:     null,
				style:       null,
				lastElement: null
			};
			if (!this.setElement(elementOrId)) {
				this.createElement('div');
			}
		},
		
		
	/* Main 
	 */
		setElement: function (elementOrId)
		{
			var e = leaf.DOM.core.getElement(elementOrId);
			if (e) {
				var core = this.core;
				core.lastElement = core.element;
				core.element = e;
				core.style   = e.style;
			}
			return this.core.element;
		},
		
		getElement: function ()
		{
			return this.core.element;
		},
		
		getStyle: function ()
		{
			return this.core.style;
		},
		
		setLastElement: function ()
		{
			this.setElement(this.core.lastElement);
		},
		
		getLastElement: function ()
		{
			return this.core.lastElement;
		},
		
	
	/* Position
	 */
		setPosition: function (x, y, z, type)
		{
			var $ = this.core.style;
			
			$.position = type||$.position||'absolute';
			
			if (hasValue(x)) {
				if (isNumber(x)) {
					x+='px';
				}
				if ($.right) {
					$.left  = '';
					$.right = x;
				}
				else {
					$.left  = x;
					$.right = '';
				}
			}
			if (hasValue(y)) {
				if (isNumber(y)) {
					y+='px';
				}
				if ($.bottom) {
					$.top = '';
					$.bottom = y;
				}
				else {
					$.top = y;
					$.bottom = '';
				}
			}
			if (isNumber(z)) {
				$.zIndex = parseInt(z, 10);
			}
		},
		
		getPosition: function (useFloat)
		{
			var e = this.core.element;
			var $ = e.style;
			var o = {};

			o.x = $.left||$.right ||e.offsetLeft+'px';
			o.y = $.top ||$.bottom||e.offsetTop +'px';
			o.z = $.zIndex;
			o.position = $.position;
			
			if (useFloat) {
				o.x = parseFloat(o.x)||0;
				o.y = parseFloat(o.y)||0;
			}
			return o;
		},
		
		modPosition: function (x, y, z)
		{
			var $ = this.getPosition();
			var k;
			if (isNumber(x)) {
				var $x = $.x;
				k = parseFloat($x);
				x = x +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($x):0);
			}
			else {
				x = null;
			}
			if (isNumber(y)) {
				var $y = $.y;
				k = parseFloat($y);
				y = y +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($y):0);
			}
			else {
				y = null;
			}
			if (isNumber(z)) {
				z = parseInt(z, 10)+(parseInt($.z, 10)||0);
			}
			else {
				z = null;
			}
			this.setPosition(x, y, z);
		},
		
		invertPosition: function (invertX, invertY)
		{
			var $ = this.core.style;
			if (invertX) {
				if ($.right) {
					$.left  = $.right;
					$.right = '';
				}
				else {
					$.right = $.left;
					$.left  = '';
				}
			}
			if (invertY) {
				if ($.bottom) {
					$.top    = $.bottom;
					$.bottom = '';
				}
				else {
					$.bottom = $.top;
					$.top    = '';
				}
			}
		},
		
		
	/* Size
	 */
		setSize: function (width, height)
		{
			var $  = this.core.style;
			if (hasValue(width))  { 
				$.width  = isNumber(width) ? width +'px':width;
			}
			if (hasValue(height)) { 
				$.height = isNumber(height)? height+'px':height;
			}
		},
		
		getSize: function (useFloat)
		{
			var e = this.core.element;
			var $ = e.style;
			var o = {};
			o.width  = $.width ||e.offsetWidth +'px';
			o.height = $.height||e.offsetHeight+'px';
			if (useFloat) {
				o.width  = parseFloat(o.width)||0;
				o.height = parseFloat(o.height)||0;
			}
			return o;
		},
		
		modSize: function (width, height)
		{
			var $ = this.getSize();
			var k;
			if (isNumber(width)) {
				var $w = $.width;
				k = parseFloat($w);
				width = Math.abs(width+(k||0))+(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($w):0);
			}
			else {
				width = null;
			}
			if (isNumber(height)) {
				var $h = $.height;
				k = parseFloat($h);
				height = Math.abs(height+(k||0))+(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($h):0);
			}
			else {
				height = null;
			}
			this.setSize(width, height);
		},
		
		
	/* Area
	 */	
		setArea: function (x, y, z, width, height, positionType)
		{
			this.setPosition(x, y, z, positionType);
			this.setSize(width, height);
		},
		
		getArea: function (useFloat)
		{
			var o = this.getPosition(useFloat);
			o.inherits(this.getSize(useFloat));
			return o;
		},
		
		modArea: function (x, y, z, width, height)
		{
			this.modPosition(x, y, z);
			this.modSize(width, height);
		},
		
		
	/*	Content
	 */	
		setContent: function (value)
		{
			if (hasValue(value)) {
				this.core.element.innerHTML = value;
			}
		},
		
		getContent: function ()
		{
			if (hasValue(value)) {
				return this.core.element.innerHTML;
			}
		},
		
		addContent: function (value)
		{
			if (hasValue(value)) {
				this.core.element.innerHTML += ''+value;
			}
		},
		
		
	/* Background
	 */
		setBackground: function (color, src, x, y, repeat)
		{
			var $ = this.core.style;
			if (isString(color)) { $.backgroundColor = color; }
			if (isString(src))   { $.backgroundImage = 'url(\"' + src + '\")'; }
			
			var p = $.backgroundPosition;
			var i = p.indexOf(' ');
			
			x = hasValue(x)? isNumber(x)? x+'px':x:(p.substr(0,i)||'50%');
			y = hasValue(y)? isNumber(y)? y+'px':y:(p.substr(i)  ||'50%');
			
			$.backgroundPosition = x +' '+ y;
			$.backgroundRepeat = repeat? repeat:'no-repeat';
		},
		
		getBackground: function (useFloat)
		{
			var $ = this.core.style;
			var p = $.backgroundPosition;
			var i = p.indexOf(' ');
			var x = p.substr(0,i);
			var y = p.substr(i);
			var o = {};
			
			o.color  = $.backgroundColor;
			o.src    = $.backgroundImage;
			o.x      = x;
			o.y      = y;
			o.repeat = $.backgroundRepeat;
			
			if (useFloat) {
				o.x = parseFloat(o.x)||0;
				o.y = parseFloat(o.y)||0;
			}
			return o;
		},
		
		modBackground: function (x, y)
		{
			var  p = this.core.style.backgroundPosition;
			var  i = p.indexOf(' ');
			var $x = p.substr(0,i);
			var $y = p.substr(i);
			var  k;
			if (isNumber(x)) {
				k = parseFloat($x);
				x = x +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($x):0);
			}
			else {
				x = null;
			}
			if (isNumber(y)) {
				k = parseFloat($y);
				y = y +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($y):0);
			}
			else {
				y = null;
			}
			this.setBackground(0, 0, x, y);
		},
		
		
	/* Font
	 */
		setFont: function (color, size, family, weight, style, spacing, lineHeight, useSmallCaps)
		{
			var $ = this.core.style;
			if (isString(color))  { $.color = color;  }
			if (isString(family)) { $.fontFamily = family; }
			if (isString(style))  { $.fontStyle  = style;  }
			if (hasValue(weight)) { $.fontWeight = weight; }
			if (hasValue(size)) {
				$.fontSize = isNumber(size)? size+'pt':size;
			}
			if (hasValue(spacing)) {
				$.letterSpacing = isNumber(spacing)? spacing+'px':spacing;
			}
			if (hasValue(lineHeight)) {
				$.lineHeight = isNumber(lineHeight)?lineHeight+'px':lineHeight;
			}
			$.fontVariant = isBoolean(useSmallCaps)?(useSmallCaps?'small-caps':'normal'):$.fontVariant;
		},
		
		getFont: function (useFloat)
		{
			var $ = this.core.style;
			var o = {};
			
			o.color      = $.color;
			o.size       = $.fontSize;
			o.family     = $.fontFamily;
			o.weight     = $.fontWeight;
			o.style      = $.fontStyle;
			o.spacing    = $.letterSpacing;
			o.lineHeight = $.lineHeight;
			o.variant    = $.fontVariant;
		
			if (useFloat) {
				o.size       = parseFloat(o.size)||0;
				o.spacing    = parseFloat(o.spacing)||0;
				o.lineHeight = parseFloat(o.lineHeight)||0;
			}
			return o;
		},
		
		modFont: function (size, spacing)
		{
			var $ = this.core.style;
			var k;
			if (isNumber(size)) {
				var $sz = $.fontSize;
				k = parseFloat($sz);
				size = Math.abs(size+(k||0)) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($sz):0);
			}
			else {
				size = null;
			}
			if (isNumber(spacing)) {
				var $sp = $.letterSpacing;
				k = parseFloat($sp);
				spacing = spacing +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($sp):0);
			}
			else {
				spacing = null;
			}
			this.setFont(0, size, 0, 0, 0, spacing);
		},
		
	
	/*	Border 
	 */
		setBorder: function (color, width, style)
		{
			var $ = this.core.style;
			if (isString(color)) {
				$.borderColor = color;
			}
			if (hasValue(width)) {
				$.borderWidth = isNumber(width)? width+'px':width;
			}
			$.borderStyle = style||$.borderStyle||'solid';
		},
		
		getBorder: function (useFloat)
		{
			var $ = this.core.style;
			var o = {};
			
			o.color = $.borderColor;
			o.width = $.borderWidth;
			o.style = $.borderStyle;
						
			if (useFloat) {
				o.width = parseFloat(o.width)||0;
			}
			return o;
		},
		
		modBorder: function (width)
		{
			var $ = this.core.style.borderWidth;
			if (isNumber(width)) {
				var k = parseFloat($);
				width = width +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($):0);
			}
			else {
				width = null;
			}
			this.setBorder(0, width);
		},
		
	
	/*	Padding 
	 */	
		setPadding: function (top, right, bottom, left)
		{
			var $ = this.core.style;
			
			if (hasValue(top)) {
				$.paddingTop = isNumber(top)? top+'px':top;
			}
			if (hasValue(right)) {
				$.paddingRight = isNumber(right)? right+'px':right;
			}
			if (hasValue(bottom)) {
				$.paddingBottom = isNumber(bottom)? bottom+'px':bottom;
			}
			if (hasValue(left)) {
				$.paddingLeft = isNumber(left)? left+'px':left;
			}			
		},
		
		getPadding: function (useFloat)
		{
			var $ = this.core.style;
			var o = {};

			o.top    = $.paddingTop;
			o.right  = $.paddingRight;
			o.bottom = $.paddingBottom;
			o.left   = $.paddingLeft;
			
			if (useFloat) {
				o.top    = parseFloat(o.top   )||0;
				o.right  = parseFloat(o.right )||0;
				o.bottom = parseFloat(o.bottom)||0;
				o.left   = parseFloat(left    )||0;
			}
			return o;
		},
		
		modPadding: function (top, right, bottom, left)
		{
			var $ = this.core.style;
			var k;
			if (isNumber(top)) {
				var $t = $.paddingTop;
				k = parseFloat($t);
				top = top +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($t):0);
			}
			else {
				top = null;
			}
			if (isNumber(right)) {
				var $r = $.paddingRight;
				k = parseFloat($r);
				right = right +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($r):0);
			}
			else {
				right = null;
			}
			if (isNumber(bottom)) {
				var $b = $.paddingBottom;
				k = parseFloat($b);
				bottom = bottom +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($b):0);
			}
			else {
				bottom = null;
			}
			if (isNumber(left)) {
				var $l = $.paddingLeft;
				k = parseFloat($l);
				left = +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($l):0);
			}
			else {
				left = null;
			}
			this.setPadding(top, right, bottom, left);
		},


	/* 	Text
	 */	
		setText: function (align, decoration, wordSpacing, whiteSpace, indent, transform)
		{
			var $ = this.core.style;
				
			if (isString(align))      { $.textAlign      = align; }
			if (isString(decoration)) { $.textDecoration = decoration; }
			if (isString(whiteSpace)) { $.whiteSpace     = whiteSpace; }
			if (isString(transform))  { $.textTransform  = transform; }
			if (hasValue(indent)) {
				$.textIndent = isNumber(indent)? indent+'px':indent;
			}
			if (hasValue(wordSpacing)) {
				$.wordSpacing = isNumber(wordSpacing)? wordSpacing+'px':wordSpacing;
			}
		},
		
		getText: function (useFloat)
		{
			var $ = this.core.style;
			var o = {};
			
			o.align       = $.textAlign;
			o.decoration  = $.textDecoration;
			o.wordSpacing = $.wordSpacing;
			o.whiteSpace  = $.whiteSpace;
			o.indent      = $.textIndent;
			o.transform   = $.textTransform;
			
			if (useFloat) {
				o.wordSpacing = parseFloat(o.wordSpacing)||0;
				o.indent      = parseFloat(o.indent)||0;
			}
			return o;
		},
		
		modText: function (wordSpacing, indent)
		{
			var $ = this.core.style;
			var k;
			if (isNumber(wordSpacing)) {
				var $w = $.wordSpacing;
				k = parseFloat($w);
				wordSpacing = wordSpacing +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($w):0);
			}
			else {
				wordSpacing = null;
			}
			if (isNumber(indent)) {
				var $i = $.textIndent;
				k = parseFloat($i);
				indent = indent +(k||0) +(isNumber(k)? (/(?:[a-z]{2}|%)$/i).exec($i):0);
			}
			else {
				indent = null;
			}
			this.setText(0, 0, wordSpacing, 0, indent);
		},
		
		invertText: function ()
		{
			var $ = this.core.style;
			$.direction = $.direction == 'rtr'? 'ltr':'rtl';
		},


	/* 	Scroll
	 */	
		setScroll: function (topDistance, leftDistance)
		{
			var e = this.core.element;
			var s = this.getScroll();
			topDistance  = parseFloat(topDistance);
			leftDistance = parseFloat(leftDistance);
			if (topDistance >=0 && topDistance<=s.height) { e.scrollTop  = topDistance; }
			if (leftDistance>=0 && leftDistance<=s.width) { e.scrollLeft = leftDistance; }
		},
		
		getScroll: function ()
		{
			var e = this.core.element;
			return {
				top:    e.scrollTop,
				left:   e.scrollLeft,
				height: e.scrollHeight,
				width:  e.scrollWidth
			};
		},
		
		modScroll: function (topDistance, leftDistance)
		{
			var s = this.getScroll();
			this.setScroll(
				topDistance ? topDistance +s.top :null, 
				leftDistance? leftDistance+s.left:null
			);
		},


	/*	Overflow 
	 */
		setOverflow: function (type)
		{
			if (isString(type)) {
				this.core.style.overflow = type;
			}
		},
		
		getOverflow: function (){
			return this.core.style.overflow;
		},


	/*	Display 
	 */
		setDisplay: function (type)
		{
			if (isString(type)) {
				this.core.style.display = type;
			}
		},
		
		getDisplay: function ()
		{
			return this.core.style.display;
		},


	/*	Opacity 
	 */	
		setOpacity: function (opacity)
		{
			if (isNumber(opacity)) {
				var $ = this.core.style;
				opacity = parseInt((opacity<0.01? 0:opacity>1? 1:opacity)*1000,10)/10;
				/* IE brute force for 'filters' attribute */
				if ((/msie/i).test(navigator.userAgent)) {
					var e;
					try {
						this.core.element.filters.alpha.opacity = opacity;
					}
					catch (e) {
						var i = $.cssText.search(/filter/i);
						if (i > -1) {
							$.cssText = $.cssText.substr(0, i)+$.cssText.substr($.cssText.toLowerCase().indexOf('\;', i));
						}
						$.cssText = 'filter: alpha(opacity=' +opacity +')\;' + $.cssText;
					}
				}
				else {
					$.opacity = (opacity/100).toFixed(2);
				}
			}
		},
		
		getOpacity: function ()
		{
			var e = this.core.element;
			if ((/msie/i).test(navigator.userAgent)) {
				var err;
				try {
					return e.filters.alpha.opacity/100;
				} 
				catch (err) {
					return 1;
				}
			}
			else {
				return parseFloat(e.style.opacity);
			}
		},

		modOpacity: function (opacity)
		{
			if (isNumber(opacity)) {
				this.setOpacity(opacity +this.getOpacity());
			}
		},


	/*	Nodes
	 */
		createElement: function (tagName, id, x, y, z, width, height, positionType)
		{
			if (isString(tagName)) {
				var e = document.createElement(tagName);
				var $ = e.style;
				if (isString(id)) {
					e.id = id;
				}
				$.padding = '0px 0px 0px 0px';
				$.margin  = '0px 0px 0px 0px';
				this.setElement(e);
				this.setArea(x, y, z, width, height, positionType);
				return e;
			}
		},
		
		appendElement: function (parentOrId)
		{
			var e;
			try {
				(leaf.DOM.core.getElement(parentOrId)||document.body).appendChild(this.core.element);
			}
			catch (e) {}
		},
		
		removeElement: function ()
		{
			var e = this.core.element;
			if (leaf.DOM.core.isHTML(e.parentNode)) {
				e.parentNode.removeChild(e);
			}
		},
		
		cloneElement: function (cloneAttributesAndChilds) 
		{
			return this.core.element.cloneNode(!!cloneAttributesAndChilds);
		},
		
		purgeElement: function ()
		{
			var e = this.core.element;
			leaf.DOM.core.purgeElement(e);
			this.removeElement(e);
			this.core.element = document.createElement('div');
		},

		appendChild: function (childNode)
		{
			if (leaf.DOM.core.isHTML(childNode) && isObject(childNode)) {
				this.core.element.appendChild(childNode);
			}
		},
		
		removeChild: function (childIndex)
		{
			var e = this.getChild(childIndex);
			if (e) {
				this.core.element.removeChild(e);
			}
		},
		
		setChild: function (childIndex)
		{
			this.setElement(this.getChild(childIndex));
		},
		
		getChild: function (childIndex)
		{
			if (isNumber(childIndex)) {
				return this.core.element.childNodes[childIndex]||null;
			}
		},
		
		purgeChild: function (childIndex)
		{
			var e = this.getChild(childIndex);
			if (e) {
				leaf.DOM.core.purgeElement(e);
				this.removeChild(childIndex);
			}
		},
		
		cloneChild: function (childIndex, cloneAttrAndChilds)
		{
			var e = this.getChild(childIndex);
			if (e) {
				return e.cloneNode(!!cloneAttrAndChilds);
			}
		},
		
		getParent: function ()
		{
			return this.core.element.parentNode||null;
		},
		
		setParent: function ()
		{
			this.setElement(this.getParent());
		},
	
		hasCollision: function (collisorElement) {
			return leaf.DOM.hasCollision(this.core.element, collisorElement);
		},
	
		
	/*	Visibility
	 */		
		setVisibility : function (booleanValue)
		{
			if (isBoolean(booleanValue)) {
				this.core.style.visibility = booleanValue ? 'visible':'hidden';
			}
		},
		
		getVisibility : function ()
		{
			return this.core.style.visibility == 'visible';
		},


	/*	Event 
	 */
		addEvent: function (eventType, eventFunction)
		{
			leaf.DOM.core.addEvent(eventType, eventFunction, this.core.element);
		},
		
		removeEvent: function (eventType, eventFunction)
		{
			leaf.DOM.core.removeEvent(eventType, eventFunction, this.core.element);
		}
	};
	
(function () {
	var _p = leaf.Platform;
	var _b = leaf.Browser;
	var _a = navigator.userAgent;
	var _o = navigator.platform;
	
	var _n = {
		isIE:       /avant/i,
		isFIREFOX:  /flock/i,
		isNETSCAPE: /msie/i,
		isGECKO:    /safari/i,
		isMOZILLA:  /msie|safari|adobeair|avant/i
	};
	
	var _k;
	var _err;
	for (_k in _p) { 
		try {
			_p[_k] = (_p[_k]).test(_o);
		}
		catch(_err) {}
	}
	for (_k in _b) {
		try {
			_b[_k] = (_n[_k]||(/^$/i)).test(_a)?false:_b[_k].test(_a);
		}
		catch(_err) {}
	}
	
	function initialize() {
		var h = document.documentElement.style;
		var b = document.body.style;
		var z = '0px 0px 0px 0px';
		h.padding = z;
		h.margin  = z;
		b.padding = z;
		b.margin  = z;
	}
	
	leaf.Window.addEvent('load', initialize);
	
	/* Aptana intellisense force */
	leaf.DOM = leaf.DOM;
})();