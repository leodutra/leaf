	
	/*	LEAF JavaScript Library
	 *	Leonardo Dutra
	 *	v0.5.090217a
	 *
	 *	Copyright (c) 2009, Leonardo Dutra
	 *	All rights reserved.
	 *
	 *	Redistribution and use in source and binary forms, with or without
	 *	modification, are permitted provided that the following conditions are met:
	 *	   * Redistributions of source code must retain the above copyright
	 *	     notice, this list of conditions and the following disclaimer.
	 *	   * Redistributions in binary form must reproduce the above copyright
	 *	     notice, this list of conditions and the following disclaimer in the
	 *	     documentation and/or other materials provided with the distribution.
	 *	   * Neither the name of the creator nor the
	 *	     names of its contributors may be used to endorse or promote products
	 *	     derived from this software without specific prior written permission.
	 *
	 *	THIS SOFTWARE IS PROVIDED BY LEONARDO DUTRA ''AS IS'' AND ANY
	 *	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	 *	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	 *	DISCLAIMED. IN NO EVENT SHALL LEONARDO DUTRA BE LIABLE FOR ANY
	 *	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	 *	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	 *	LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	 *	ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 *	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	 *	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	/* Check "Package" */
	if ('object' !== typeof window.leaf) {
		window.leaf = {};
	}
	
	
	/* Object
	 */
	leaf.Object = {
		inherit: function(object, sourceObject)
		{
			if (object && sourceObject) {
				for (var n in sourceObject) {
					object[n] = sourceObject[n];
				}
			}
		}
	};
	
	
	/* Ajax
	 */
	leaf.Ajax = {
		createXMLHttpRequest: function()
		{
			var W = window;
			if (W.XMLHttpRequest) {
				return new W.XMLHttpRequest();
			}
			else {
				var e;
				var v = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
				var i = 2;
				while (i--) {
					try {
						e = new W.ActiveXObject(v[i]);
						return e;
					} 
					catch (e) {
					}
				}
			}
			return null;
		}
	};
	
	
	/* Window
	 */
	leaf.Window = {
		addEvent: function(type, handlerFn)
		{
			leaf.DOM.core.addEvent(window, type, handlerFn);
		},
		removeEvent: function(type, handlerFn)
		{
			leaf.DOM.core.removeEvent(window, type, handlerFn);
		}
	};
	
	
	/* Document
	 */
	leaf.Document = {
		addEvent: function(type, handlerFn)
		{
			leaf.DOM.core.addEvent(document, type, handlerFn);
		},
		removeEvent: function(type, handlerFn)
		{
			leaf.DOM.core.removeEvent(document, type, handlerFn);
		}
	};
	
	
	/* Mouse
	 */
	leaf.Mouse = {
		getPosition: function(event)
		{
			if ((event = event || window.event)) {
				var D = document.documentElement;
				return {
					/* fixed using client properties */
					x: 'number' === typeof event.pageX ? event.pageX : event.clientX + D.scrollLeft - (D.clientLeft || 0),
					y: 'number' === typeof event.pageY ? event.pageY : event.clientY + D.scrollTop - (D.clientTop || 0)
				};
			}
			return {
				x: 0,
				y: 0
			};
		}
	};	
	
	
	/* DOM
	 */
	leaf.DOM = function(element)
	{
		if (this instanceof leaf.DOM) {
			this.DOM(element);
		}
	};
	
	leaf.DOM.importXML = function(uri)
	{
		/*	XML "sandbox" vary from browser to browser */
		var o = leaf.Ajax.createXMLHttpRequest();
		if (o) {
			try {
				o.open('GET', uri, false);
				o.send(null);
				if (o.readyState === 4) {
					if (o.status === 200) {
						return o.responseXML;
					}
				}
			} 
			catch (o) {
			}
		}
		return null;
	};
	
	leaf.DOM.buildXML = function(XMLText)
	{
		var W = window;
		if (W.DOMParser) {
			return (new W.DOMParser()).parseFromString(XMLText, 'text/xml');
		}
		var o;
		try {
			o = new W.ActiveXObject('Microsoft.XMLDOM');
			o.async = false;
			o.loadXML(XMLText);
			return o;
		} 
		catch (o) {
			return null;
		}
	};
	
	leaf.DOM.getById = function(ids)
	{
		if (ids instanceof Array) {
			var i = ids.length;
			while (i--) {
				ids[i] = document.getElementById(ids[i]);
			}
			return ids;
		}
		return document.getElementById(ids);
	};
	
	leaf.DOM.getByTag = function(tagNames, rootNode)
	{
		rootNode = leaf.DOM.core.getElement(rootNode) || document;
		if (tagNames instanceof Array) {
			var l = tagNames.length;
			var n = [];
			var i = 0;
			var j;
			var k;
			var o;
			while (i < l) {
				k = (o = rootNode.getElementsByTagName(tagNames[i++])).length;
				j = 0;
				while (j < k) {
					n[n.length] = o[j++];
				}
			}
			return n;
		}
		return rootNode.getElementsByTagName(tagNames);
	};
	
	leaf.DOM.getByClass = function(classNames, rootNode)
	{
		if (('string' === typeof classNames ? [classNames] : classNames) instanceof Array) {
			var $ = [];
			var i = classNames.length;
			var o;
			var r = '(?:\\\s|^)(?:';
			while (i--) {
				r += classNames[i] + (i ? '|' : '');
			}
			r = new RegExp(r +')(?:\\\s|$)');
			function q(n)
			{
				if (n.nodeType === 1 && r.test(n.className)) {
					$[$.length] = n;
				}
				if ((n = n.childNodes)) {
					var l = n.length;
					for (var i = 0; i < l; i++) {
						q(n[i]);
					}
				}
			}
			q(leaf.DOM.core.getElement(rootNode) || document);
			return $;
		}
		return null;
	};
	
	leaf.DOM.hasCollision = function(elementA, elementB)
	{
		var c = leaf.DOM.core;
		c.hasCollision(c.getElement(elementA), c.getElement(elementB));
	};
	
	leaf.DOM.purgeElement = function(element)
	{
		var c = leaf.DOM.core;
		c.purgeElement(c.getElement(element));
	};
	
	leaf.DOM.addEvent = function (element, event, handlerFn) {
		var c = leaf.DOM.core;
		c.addEvent(c.getElement(element), event, handlerFn);
	};
	
	leaf.DOM.removeEvent = function (element, event, handlerFn) {
		var c = leaf.DOM.core;
		c.removeEvent(c.getElement(element), event, handlerFn);
	};
	
	leaf.DOM.dispatchEvent = function (element, event) {
		var c = leaf.DOM.core;
		c.dispatchEvent(c.getElement(element), event);
	};


	/* DOM Core
	 */
	leaf.DOM.core = {
		addEvent: function(o, e, fn)
		{
			if (o && 'string'===typeof e && 'function'===typeof fn) {
				/* code by John Resig of JQuery */
				if (o.addEventListener) {
					o.addEventListener(e, fn, false);
				}
				else {
					if (o.attachEvent) {
						o['e' + e + fn] = fn;
						o[e + fn] = function()
						{
							o['e' + e + fn](window.event);
						};
						o.attachEvent('on' + e, o[e + fn]);
					}
				}
			}
		},
		
		removeEvent: function(o, e, fn)
		{
			if (o && 'string'===typeof e && 'function'===typeof fn) {
				/* base code by John Resig of JQuery */
				if (o.removeEventListener) {
					o.removeEventListener(e, fn, false);
				}
				else {
					if (o.detachEvent) {
						o.detachEvent('on' + e, o[(e = e + fn)]);
						o[e] = null;
						o['e' + e] = null;
					}
				}
			}
		},
		
		dispatchEvent: function (o, e)
		{
			if (o && 'string'===typeof e) {
				if (o.dispatchEvent) {
					// dispatch for firefox + others
					var $ = document.createEvent('HTMLEvents');
					// event type, bubbling, cancelable
					$.initEvent(e, true, true);
					o.dispatchEvent($);
				}
				else {
					if (document.createEventObject) {
						// dispatch for IE
						o.fireEvent('on' + e, document.createEventObject());
					}
				}
			}
		},
		
		hasCollision: function(a, b)
		{
			if (a && b) {
				var B = document.body;
				var aX = 0;
				var aY = 0;
				var o = a;
				for (; o !== B; o = o.parentNode) {
					aX += o.offsetLeft;
					aY += o.offsetTop;
				}
				var bX = 0;
				var bY = 0;
				for (o = b; o !== B; o = o.parentNode) {
					bX += o.offsetLeft;
					bY += o.offsetTop;
				}
				if (!(aX < bX - a.offsetWidth || bX + b.offsetWidth < aX)) {
					return !(aY < bY - a.offsetHeight || bY + b.offsetHeight < aY);
				}
			}
			return false;
		},
		
		purgeElement: function(o)
		{
			/* based on crockford.com purge */
			if (o) {
				var $ = o.attributes;
				if ($) {
					var n;
					var i = $.length;
					while (i--) {
						if ('function' === typeof o[(n = $[i].name)]) {
							o[n] = null;
						}
					}
				}
				if ((o = o.childNodes)) {
					$ = o.length;
					while ($--) {
						this.purgeElement(o[$]);
					}
				}
			}
			o = null;
		},
		
		getElement: function($)
		{
			return $ ? $.nodeType === 1 && 'object' === typeof $.style ? $ : document.getElementById($) : null;
		},
		
		isIE: (/msie/i).test(navigator.userAgent)
	};
	
	
	/* DOM Prototype
	 */
	leaf.DOM.prototype = {
	
		/* Constructor */
		DOM: function(element)
		{
			this.setElement(element);
		},
		
		setElement: function(element)
		{
			this.style = (this.element = (element = this.core.getElement(element))) ? element.style : null;
		},
		
		getElement: function()
		{
			return this.element;
		},
		
		getStyle: function () 
		{
			return this.style;
		},
		
		setCSS: function(cssObj)
		{
			if (cssObj && 'object'===typeof cssObj && !(cssObj instanceof Array)) {
				var e = this.element;
				if (e) {
					var ie = this.core.isIE;
					var s = ie ? e.style.cssText : e.getAttribute('style');
					var i;
					var k;
					for (var n in cssObj) {
						if ('string' === typeof (k = cssObj[n]) || 'number' === typeof k) {
							// RegExp does not 'compile' on AIR 1.0
							if (-1 === (i = s ? s.search(new RegExp('(?:^|\\\;|\s)' + n + '\\\:', 'i')) : -1)) {
								s = n +'\: ' +k +'\; ' +s;
							}
							else {
								/* if property found, substitutes value... preventing errors on some browsers */
								s = s.substr(0, (i += n.length)) + ': ' + k + s.substr(s.indexOf('\;', i));
							}
						}
					}
					if (ie) {
						e.style.cssText = s;
					}
					else {
						e.setAttribute('style', s);
					}
				}
			}
		},
		
		getCSS: function(property)
		{
			if ('string' === typeof property) {
				var o = this.element;
				if (o) {
					if ((o = this.core.isIE ? o.style.cssText : o.getAttribute('style'))) {
						// RegExp does not 'compile' on AIR 1.0
						if (-1 < (i = o.search(new RegExp('(?:^|\\\;| )' + property + '\\\:', 'i')))) {
							return o.substring((i = o.indexOf(':', i) + 2), (i = o.indexOf('\;', i)) === -1 ? o.length : i);
						}
					}
				}
			}
			return '';
		},
		
		
		addClass: function(classNames)
		{
			var e = this.element;
			if (e) {
				if ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array) {
					var c = e.className;
					if ('string' === typeof c) {
						var l = classNames.length;
						var i = 0;
						var k;
						while (i < l) {
							// RegExp does not 'compile' on AIR 1.0
							if (!(new RegExp('(?:\\\s|^)' + (k = classNames[i++]) + '(?:\\\s|$)')).test(c)) {
								c += ' ' +k;
							}
						}
						e.className = c;
					}
				}
			}
		},
		
		removeClass: function(classNames)
		{
			var e = this.element;
			if (e) {
				if ('string' === typeof classNames? classNames = [classNames]:classNames instanceof Array) {
					var c = e.className;
					if ('string' === typeof c) {
						var i = classNames.length;
						var k;
						var r = '(?:\\\s|^)(?:';
						while (i--) {
							r += classNames[i] + (i ? '|' : '');
						}
						e.className = c.replace(new RegExp(r +')(?:\\\s|$)'), '');
					}
				}
			}
		},
		
		
		/* Position */
		
		setPosition: function(x, y, z, type)
		{
			// large but optimum code
			var $ = this.style;
			if ($) {
			
				$.position = 'string' === typeof type ? type : $.position || 'absolute';
				
				if ('number' === typeof x) {
					if ($.right) {
						$.left = '';
						$.right = x + 'px';
					}
					else {
						$.left = x + 'px';
						$.right = '';
					}
				}
				else {
					if ('string' === typeof x) {
						if ($.right) {
							$.left = '';
							$.right = x;
						}
						else {
							$.left = x;
							$.right = '';
						}
					}
				}
				
				if ('number' === typeof y) {
					if ($.bottom) {
						$.top = '';
						$.bottom = y + 'px';
					}
					else {
						$.top = y + 'px';
						$.bottom = '';
					}
				}
				else {
					if ('string' === typeof y) {
						if ($.bottom) {
							$.top = '';
							$.bottom = y;
						}
						else {
							$.top = y;
							$.bottom = '';
						}
					}
				}
				if ('number' === typeof z) {
					$.zIndex = parseInt(z, 10);
				}
			}
		},
		
		getPosition: function(keepUnits)
		{
			var $ = this.style;
			if ($) {
				if (keepUnits) {
					return {
						x: $.left || $.right,
						y: $.top || $.bottom,
						z: $.zIndex,
						position: $.position
					};
				}
				else {
					return {
						x: parseFloat($.left || $.right) || 0,
						y: parseFloat($.top || $.bottom) || 0,
						z: $.zIndex,
						position: $.position
					};
				}
			}
			return {
				x: 0,
				y: 0,
				z: 0,
				position: ''
			};
		},
		
		getOffset: function()
		{
			var e = this.element;
			if (e) {
				return {
					left:   e.offsetLeft,
					top:    e.offsetTop,
					width:  e.offsetWidth,
					height: e.offsetHeight,
					parent: e.offsetParent
				};
			}
			return {
				left: 0,
				top: 0,
				width: 0,
				height: 0,
				parent: null
			};
		},
		
		invertAxis: function(x, y)
		{
			var $ = this.style;
			if ($) {
				if (x) {
					if ($.right) {
						$.left = $.right;
						$.right = '';
					}
					else {
						$.right = $.left;
						$.left = '';
					}
				}
				if (y) {
					if ($.bottom) {
						$.top = $.bottom;
						$.bottom = '';
					}
					else {
						$.bottom = $.top;
						$.top = '';
					}
				}
			}
		},
		
		
		/* Size */
		
		setSize: function(width, height)
		{
			var $ = this.style;
			if ($) {
				if ('number' === typeof width) {
					$.width = width + 'px';
				}
				else {
					if ('string' === typeof width) {
						$.width = width;
					}
				}
				if ('number' === typeof height) {
					$.height = height + 'px';
				}
				else {
					if ('string' === typeof height) {
						$.height = height;
					}
				}
			}
		},
		
		getSize: function(keepUnits)
		{
			var $ = this.style;
			if ($) {
				if (keepUnits) {
					return {
						width: $.width,
						height: $.height
					};
				}
				else {
					return {
						width: parseFloat($.width) || 0,
						height: parseFloat($.height) || 0
					};
				}
			}
			return {
				width: 0,
				height: 0
			};
		},
		
		
		/* Area
		 * nice for UI works
		 */
		setArea: function(x, y, z, width, height, positionType)
		{
			this.setPosition(x, y, z, positionType);
			this.setSize(width, height);
		},
		
		getArea: function(keepUnits)
		{
			var p = this.getPosition(keepUnits);
			var s = this.getSize(keepUnits);
			p.width = s.width;
			p.height = s.height;
			return p;
		},
		
		
		/* Content */
		
		setContent: function(value)
		{
			/* need intelligent fix... IE6 dont allow innerHTML set when element was not appended yet */
			var e = this.element;
			if (value !== null && value !== undefined && e) {
				e.innerHTML = value;
			}
		},
		
		getContent: function()
		{
			var e = this.element;
			if (e) {
				return e.innerHTML;
			}
			return '';
		},
		
		addContent: function(value)
		{
			/* need intelligent fix... IE6 dont allow innerHTML set when element was not appended yet */
			var e = this.element;
			if (value !== null && value !== undefined && e) {
				e.innerHTML += String(value);
			}
		},
		
		
		/* Background */
		
		setBackground: function(color, src, x, y, repeat)
		{
			var $ = this.style;
			if ($) {
				if ('string' === typeof color) {
					$.backgroundColor = color;
				}
				
				if ('string' === typeof src) {
					$.backgroundImage = 'url(\'' + src + '\')';
				}
				
				var p = $.backgroundPosition.split(' ');
				
				x = 'number' === typeof x ? x + 'px' : 'string' === typeof x ? x : (p[0] || '50%');
				y = 'number' === typeof y ? y + 'px' : 'string' === typeof y ? y : (p[1] || '50%');
				
				$.backgroundPosition = x + ' ' + y;
				$.backgroundRepeat = repeat ? repeat : 'no-repeat';
			}
		},
		
		getBackground: function(keepUnits)
		{
			var $ = this.style;
			if ($) {
				var p = $.backgroundPosition.split(' ');
				if (keepUnits) {
					return {
						x: p[0] || '',
						y: p[1] || '',
						color: $.backgroundColor,
						src: $.backgroundImage,
						repeat: $.backgroundRepeat
					};
				}
				else {
					return {
						x: parseFloat(p[0]) || 0,
						y: parseFloat(p[1]) || 0,
						color: $.backgroundColor,
						src: $.backgroundImage,
						repeat: $.backgroundRepeat
					};
				}
			}
			return {
				x: 0,
				y: 0,
				color: '',
				src: '',
				repeat: ''
			};
		},
		
		
		/* Font */
		
		setFont: function(color, size, family, weight, style, spacing, lineHeight, useSmallCaps)
		{
			var $ = this.style;
			if ($) {
				if ('string' === typeof color) {
					$.color = color;
				}
				if ('string' === typeof family) {
					$.fontFamily = family;
				}
				if ('string' === typeof style) {
					$.fontStyle = style;
				}
				if ('string' === typeof weight || 'number' === typeof weight) {
					$.fontWeight = weight;
				}
				if ('number' === typeof size) {
					$.fontSize = size + 'pt';
				}
				else {
					if ('string' === typeof size) {
						$.fontSize = size;
					}
				}
				if ('number' === typeof spacing) {
					$.letterSpacing = spacing + 'px';
				}
				else {
					if ('string' === typeof spacing) {
						$.letterSpacing = spacing;
					}
				}
				if ('number' === typeof lineHeight) {
					$.lineHeight = lineHeight + 'px';
				}
				else {
					if ('string' === typeof lineHeight) {
						$.lineHeight = lineHeight;
					}
				}
				if (useSmallCaps !== null && useSmallCaps !== undefined) {
					$.fontVariant = useSmallCaps ? 'small-caps' : 'normal';
				}
			}
		},
		
		getFont: function(keepUnits)
		{
			var $ = this.style;
			if ($) {
				if (keepUnits) {
					return {
						color: $.color,
						size: $.fontSize,
						family: $.fontFamily,
						weight: $.fontWeight,
						style: $.fontStyle,
						spacing: $.letterSpacing,
						lineHeight: $.lineHeight,
						variant: $.fontVariant
					};
				}
				else {
					return {
						color: $.color,
						size: parseFloat($.fontSize) || 0,
						family: $.fontFamily,
						weight: $.fontWeight,
						style: $.fontStyle,
						spacing: parseFloat($.letterSpacing) || 0,
						lineHeight: parseFloat($.lineHeight) || 0,
						variant: $.fontVariant
					};
				}
				
			}
			return {
				color: '',
				size: 0,
				family: '',
				weight: '',
				style: '',
				spacing: 0,
				lineHeight: 0,
				variant: ''
			};
		},
		
		
		/* Border */
		
		setBorder: function(color, width, style)
		{
			var $ = this.style;
			if ($) {
				if ('string' === typeof color) {
					$.borderColor = color;
				}
				if ('number' === typeof width) {
					$.borderWidth = width + 'px';
				}
				else {
					if ('string' === typeof width) {
						$.borderWidth = width;
					}
				}
				$.borderStyle = 'string' === typeof style ? style : $.borderStyle || 'solid';
			}
		},
		
		getBorder: function(keepUnits)
		{
			var $ = this.style;
			return {
				color: $.borderColor,
				width: $ ? keepUnits ? $.borderWidth : parseFloat($.borderWidth) || 0 : 0,
				style: $.borderStyle
			};
		},
		
		
		/* Padding */
		
		setPadding: function(top, right, bottom, left)
		{
			var $ = this.style;
			if ($) {
				if ('number' === typeof top) {
					$.paddingTop = top + 'px';
				}
				else {
					if ('string' === typeof top) {
						$.paddingTop = top;
					}
				}
				if ('number' === typeof right) {
					$.paddingRight = right + 'px';
				}
				else {
					if ('string' === typeof right) {
						$.paddingRight = right;
					}
				}
				if ('number' === typeof bottom) {
					$.paddingBottom = bottom + 'px';
				}
				else {
					if ('string' === typeof bottom) {
						$.paddingBottom = bottom;
					}
				}
				if ('number' === typeof left) {
					$.paddingLeft = left + 'px';
				}
				else {
					if ('string' === typeof left) {
						$.paddingLeft = left;
					}
				}
			}
		},
		
		getPadding: function(keepUnits)
		{
			var $ = this.style;
			if ($) {
				if (keepUnits) {
					return {
						top: $.paddingTop,
						right: $.paddingRight,
						bottom: $.paddingBottom,
						left: $.paddingLeft
					};
				}
				else {
					return {
						top: parseFloat($.paddingTop) || 0,
						right: parseFloat($.paddingRight) || 0,
						bottom: parseFloat($.paddingBottom) || 0,
						left: parseFloat($.paddingLeft) || 0
					};
				}
			}
			return {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			};
		},
		
		
		/* Margin */
		
		setMargin: function(top, right, bottom, left)
		{
			var $ = this.style;
			if ($) {
				if ('number' === typeof top) {
					$.marginTop = top + 'px';
				}
				else {
					if ('string' === typeof top) {
						$.marginTop = top;
					}
				}
				if ('number' === typeof right) {
					$.marginRight = right + 'px';
				}
				else {
					if ('string' === typeof right) {
						$.marginRight = right;
					}
				}
				if ('number' === typeof bottom) {
					$.marginBottom = bottom + 'px';
				}
				else {
					if ('string' === typeof bottom) {
						$.marginBottom = bottom;
					}
				}
				if ('number' === typeof left) {
					$.marginLeft = left + 'px';
				}
				else {
					if ('string' === typeof left) {
						$.marginLeft = left;
					}
				}
			}
		},
		
		getMargin: function(keepUnits)
		{
			var $ = this.style;
			if ($) {
				if (keepUnits) {
					return {
						top: $.marginTop,
						right: $.marginRight,
						bottom: $.marginBottom,
						left: $.marginLeft
					};
				}
				else {
					return {
						top: parseFloat($.marginTop) || 0,
						right: parseFloat($.marginRight) || 0,
						bottom: parseFloat($.marginBottom) || 0,
						left: parseFloat($.marginLeft) || 0
					};
				}
			}
			return {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			};
		},
		
		
		/* Text */
		
		setText: function(align, decoration, wordSpacing, whiteSpace, indent, transform)
		{
			var $ = this.style;
			if ($) {
				if ('string' === typeof align) {
					$.textAlign = align;
				}
				if ('string' === typeof decoration) {
					$.textDecoration = decoration;
				}
				if ('string' === typeof whiteSpace) {
					$.whiteSpace = whiteSpace;
				}
				if ('string' === typeof transform) {
					$.textTransform = transform;
				}
				if ('number' === typeof indent) {
					$.textIndent = indent + 'px';
				}
				else {
					if ('string' === typeof indent) {
						$.textIndent = indent;
					}
				}
				if ('number' === typeof wordSpacing) {
					$.wordSpacing = wordSpacing + 'px';
				}
				else {
					if ('string' === typeof wordSpacing) {
						$.wordSpacing = wordSpacing;
					}
				}
			}
		},
		
		getText: function(keepUnits)
		{
			var $ = this.style;
			if ($) {
				if (keepUnits) {
					return {
						align: $.textAlign,
						decoration: $.textDecoration,
						wordSpacing: $.wordSpacing,
						whiteSpace: $.whiteSpace,
						indent: $.textIndent,
						transform: $.textTransform
					};
				}
				else {
					return {
						align: $.textAlign,
						decoration: $.textDecoration,
						wordSpacing: parseFloat($.wordSpacing) || 0,
						whiteSpace: $.whiteSpace,
						indent: parseFloat($.textIndent) || 0,
						transform: $.textTransform
					};
				}
			}
			return {
				align: '',
				decoration: '',
				wordSpacing: 0,
				whiteSpace: '',
				indent: 0,
				transform: ''
			};
		},
		
		
		/* Scroll */
		
		setScroll: function(top, left)
		{
			var e = this.element;
			if (e) {
				if ('number' === typeof top) {
					if (!(top < 0 && e.scrollHeight < top)) {
						e.scrollTop = top;
					}
				}
				if ('number' === typeof left) {
					if (!(left < 0 && e.scrollWidth < left)) {
						e.scrollLeft = left;
					}
				}
			}
		},
		
		getScroll: function()
		{
			var e = this.element;
			if (e) {
				return {
					top: e.scrollTop,
					left: e.scrollLeft,
					height: e.scrollHeight,
					width: e.scrollWidth
				};
			}
			return {
				top: 0,
				left: 0,
				height: 0,
				width: 0
			};
		},
		
		
		/* Opacity */
		
		setOpacity: function(opacity)
		{
			if ('number' === typeof opacity) {
				var $ = this.style;
				if ($) {
					opacity = opacity < 0 ? 0 : 1 < opacity ? 1 : opacity.toFixed(2);
					if (this.core.isIE) /* IE6, IE7 brute force for 'filters' */ {
						$.cssText = ($.cssText||'') +'; filter: alpha(opacity=' + parseInt(opacity * 100, 10) + '); ';
					}
					else {
						$.opacity = opacity;
					}
				}
			}
		},
		
		getOpacity: function()
		{
			var e = this.element;
			if (e) {
				var o;
				if (this.core.isIE) {
					if ((e = e.filters)) {
						if ((e = e.alpha)) {
							if ((e = e.opacity)) {
								o = e / 100;
							}
						}
					}
				}
				else {
					o = parseFloat(e.style.opacity);
				}
				return isNaN(o) ? 1 : o;
			}
			return 1;
		},
		
		
		/* Nodal */
		
		createElement: function(tagName, id, x, y, z, width, height, positionType)
		{
			if ('string' === typeof tagName) {
				var e = document.createElement(tagName);
				if (e) {
					if ('string' === typeof id) {
						e.id = id;
					}
					this.style = (this.element = e).style;
					this.setArea(x, y, z, width, height, positionType);
					return e;
				}
			}
			return null;
		},
		
		appendElement: function(parent)
		{
			var e = this.element;
			if (e && !e.parentNode) {
				var p = this.core.getElement(parent) || document.body;
				if (p) {
					p.appendChild(e);
				}
			}
		},
		
		insertBefore: function(node)
		{
			var e = this.element;
			if (e) {
				try {
					node.parentNode.insertBefore(e, this.core.getElement(node) || node);
				} 
				catch (e) {
				}
			}
		},
		
		removeElement: function()
		{
			var e = this.element;
			if (e) {
				var p = e.parentNode;
				if (p) {
					p.removeChild(e);
				}
			}
		},
		
		cloneElement: function(cloneAttributesAndChilds)
		{
			var e = this.element;
			if (e) {
				return e.cloneNode(!!cloneAttributesAndChilds);
			}
			return null;
		},
		
		purgeElement: function()
		{
			var e = this.element;
			if (e) {
				this.core.purgeElement(e);
				this.removeElement(e);
				this.element = (this.style = null);
			}
		},
		
		appendChild: function(childNode)
		{
			var e;
			try {
				this.element.appendChild(childNode);
			} 
			catch (e) {
			}
		},
		
		removeChild: function(childIndex)
		{
			var e = this.element;
			if ('number' === typeof childIndex && e) {
				var c = e.childNodes[childIndex] || null;
				if (c && c.parentNode === e) {
					e.removeChild(c);
				}
			}
		},
		
		setChild: function(childIndex)
		{
			this.setElement(this.getChild(childIndex));
		},
		
		getChild: function(childIndex)
		{
			var e = this.element;
			if ('number' === typeof childIndex && e) {
				return e.childNodes[childIndex]||null;
			}
			return null;
		},
		
		purgeChild: function(childIndex)
		{
			var e = this.getChild(childIndex);
			if (e) {
				this.core.purgeElement(e);
				this.removeChild(childIndex);
			}
		},
		
		cloneChild: function(childIndex, cloneAttrAndChilds)
		{
			var e = this.getChild(childIndex);
			if (e) {
				return e.cloneNode(!!cloneAttrAndChilds);
			}
			return null;
		},
		
		getParent: function()
		{
			var e = this.element;
			if (e) {
				return e.parentNode || null;
			}
			return null;
		},
		
		setParent: function()
		{
			this.setElement(this.getParent());
		},
		
		hasCollision: function(collisorElement)
		{
			return this.core.hasCollision(this.element, this.core.getElement(collisorElement));
		},
		
		
		/* Event */
		
		addEvent: function(type, handlerFn)
		{
			this.core.addEvent(this.element, type, handlerFn);
		},
		removeEvent: function(type, handlerFn)
		{
			this.core.removeEvent(this.element, type, handlerFn);
		}
		
	};
	
	/* Intellisense Fix */
	leaf.DOM.prototype.core = leaf.DOM.core;
	leaf.DOM = leaf.DOM;
