	
	/*  LEAF JavaScript Library
	 *  Leonardo Dutra
	 *  v0.6.090515.1a
	 *
	 *  Copyright (c) 2009, Leonardo Dutra.
	 *  All rights reserved.
	 *
	 *  Redistribution and use in source and binary forms, with or without modification,
	 *  are permitted provided that the following conditions are met:
	 *
	 *      * Redistributions of source code must retain the above copyright notice,
	 *        this list of conditions and the following disclaimer.
	 *
	 *      * Redistributions in binary form must reproduce the above copyright notice,
	 *        this list of conditions and the following disclaimer in the documentation
	 *        and/or other materials provided with the distribution.
	 *
	 *      * Neither the name of Leonardo Dutra nor the names of its
	 *        contributors may be used to endorse or promote products derived from this
	 *        software without specific prior written permission.
	 *
	 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	 *  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
	 *  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
	 *  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	
	/* This ALPHA version implements:
	 * 
	 * leaf.Object
	 *     .AJAX
	 *     .Window
	 *     .Document
	 *     .Mouse
	 *     .DOM        (core is a kind of "private" object, but it's public for advanced purpouses like extensions)
	 *     .DOMElement (handles only elements, think in it as a box that you put some element inside and mod)
	 */
	
	
	/* check LEAF "namespace" */
	if ('object' !== typeof window.leaf) 
	{
		window.leaf = {};
	}


	/* Object
	 */
	leaf.Object = {
	
		inherit: function(object, sourceObject)
		{
			if (object && sourceObject) 
			{
				for (var n in sourceObject) 
				{
					object[n] = sourceObject[n];
				}
			}
		},
		
		extend: function(object, sourceObject)
		{
			if (object && sourceObject) 
			{
				for (var n in sourceObject) 
				{
					if (object[n]) 
					{
						continue;
					}
					else {
						object[n] = sourceObject[n];
					}
				}
			}
		}
	};
	
	
	/* Ajax
	 * TODO: replace with the new AJAX prototype
	 */
	leaf.AJAX = {
	
		createRequester: function()
		{
			/* constant for optimization */
			var W = window;
			if (W.XMLHttpRequest) 
			{
				return new W.XMLHttpRequest();
			}
			else 
			{
				/* ActiveX versions in this array */
				var v = ['MSXML2.XMLHTTP.3.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
				var i = v.length;
				var o;
				while (i--) 
				{
					try 
					{
						o = new W.ActiveXObject(v[i]);
						return o;
					} 
					catch (o) 
					{
					}
				}
			}
			return null;
		}
	};
	
	
	/* Window
	 */
	leaf.Window = {
	
		/* ease event handling */
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

		/* ease event handling */	
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
		 
		getPosition: function(mouseEvent)
		{
			if ('object'===typeof (mouseEvent = mouseEvent||event)) 
			{
				var D = document.documentElement;
				return {
					/* IE adjusted using client properties */
					x: 'number' === typeof mouseEvent.pageX ? mouseEvent.pageX : mouseEvent.clientX + D.scrollLeft - (D.clientLeft || 0)||0,
					y: 'number' === typeof mouseEvent.pageY ? mouseEvent.pageY : mouseEvent.clientY + D.scrollTop - (D.clientTop || 0)||0
				};
			}
			return null;
		}
	};
	
	
	leaf.DOM = {
	
		importXML: function(uri)
		{
			/*	XML security and access vary from browser to browser */
			if ((/.\.xml$/i).test(uri)) 
			{
				var o = leaf.AJAX.createXMLHttpRequest();
				if (o) 
				{
					try 
					{
						o.open('GET', uri +'?decachexml=' +(new Date()).getTime(), false);
						o.send(null);
						if (o.readyState === 4 && o.status === 200) 
						{
							return o.responseXML;
						}
					} 
					catch (o) 
					{
					}
				}
			}
			return null;
		},
		
		buildXML: function(XMLText)
		{
			/* constant for optimization */
			var W = window;
			if (W.DOMParser) 
			{
				return (new W.DOMParser()).parseFromString(XMLText, 'text/xml');
			}
			var o;
			try 
			{
				o = new W.ActiveXObject('Microsoft.XMLDOM');
				o.async = false;
				o.loadXML(XMLText);
				return o;
			} 
			catch (o) 
			{
			}
			return null;
		},
		
		/* TODO: better code for check empty and null arrays */
		getById: function(ids)
		{
			if (ids instanceof Array) 
			{
				var i = ids.length;
				while (i--) 
				{
					ids[i] = document.getElementById(ids[i]);
				}
				/* check if array is empty */
				return ids.toString().replace(/\,/g, '') ? ids : null;
			}
			return document.getElementById(ids);
		},
		
		/* TODO: better code for check empty and null arrays */
		getByTag: function(tagNames, rootNode)
		{
			rootNode = this.core.getElement(rootNode)||document;
			if (tagNames instanceof Array) 
			{
				var l = tagNames.length;
				var $ = [];
				var i = 0;
				var n = 0;
				var j;
				var k;
				var o;
				while (i < l) 
				{
					k = (o = rootNode.getElementsByTagName(tagNames[i++])).length;
					j = 0;
					while (j < k) 
					{
						$[n++] = o[j++];
					}
				}
				/* check if array is empty */
				return $.toString().replace(/\,/g, '') ? $ : null;
			}
			return rootNode.getElementsByTagName(tagNames);
		},

		/* TODO: better code for check empty and null arrays */		
		getByClass: function(classNames, rootNode)
		{
			if ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array && classNames.length) 
			{
				var r = new RegExp('(?:\\\s|^)(?:' +classNames.toString().replace(/\,/g,'\|') +')(?:\\\s|$)');
				var $ = [];
				function q(n)
				{
					if (n.nodeType === 1 && r.test(n.className)) 
					{
						$[$.length] = n;
					}
					if ((n = n.childNodes)) 
					{
						var l = n.length;
						for (var i = 0; i < l; i++) 
						{
							q(n[i]);
						}
					}
				}
				q(this.core.getElement(rootNode) || document);
				/* check if array is empty */
				if ($.toString().replace(/\,/g, '')) 
				{
					return $;
				}
			}
			return null;
		},
		
		hasCollision: function(elementA, elementB)
		{
			/* check two elements collision */
			var c = this.core;
			c.hasCollision(c.getElement(elementA), c.getElement(elementB));
		},
		
		purgeElement: function(element)
		{
			/* removes functions to prevent memory leak */
			var c = this.core;
			c.purgeElement(c.getElement(element));
			if ((c = element.parentNode)) 
			{
				c.removeChild(element);
			}
		},
		
		addEvent: function(element, event, handlerFn)
		{
			var c = this.core;
			c.addEvent(c.getElement(element), event, handlerFn);
		},
		
		removeEvent: function(element, event, handlerFn)
		{
			var c = this.core;
			c.removeEvent(c.getElement(element), event, handlerFn);
		},
		
		dispatchEvent: function(element, event)
		{
			var c = this.core;
			c.dispatchEvent(c.getElement(element), event);
		},
		
		
		/* DOM Core
		 */
		core: {
			addEvent: function(o, e, fn)
			{
				if (o && 'string' === typeof e && 'function' === typeof fn) 
				{
					/* base code by John Resig
					 * uses hashing name for IE fix
					 */
					if (o.addEventListener) 
					{
						o.addEventListener(e, fn, false);
					}
					else 
					{
						if (o.attachEvent) 
						{
							var h = e + fn;
							o['e' + h] = fn;
							o.attachEvent('on' + e, (o[h] = function()
							{
								o['e' + h](event);
							}));
						}
					}
				}
			},
			
			removeEvent: function(o, e, fn)
			{
				if (o && 'string' === typeof e && 'function' === typeof fn) 
				{
					/* base code by John Resig
					 * uses hashing name for IE fix
					 */
					if (o.removeEventListener) 
					{
						o.removeEventListener(e, fn, false);
					}
					else 
					{
						if (o.detachEvent) 
						{
							o.detachEvent('on' + e, o[(e = e + fn)]);
							o[e] = null;
							o['e' + e] = null;
						}
					}
				}
			},
			
			dispatchEvent: function(o, e)
			{
				if (o && 'string' === typeof e) 
				{
					if (o.dispatchEvent) 
					{
						/* dispatch for firefox and others */
						var $ = document.createEvent('HTMLEvents');
						/* event type, bubbling, cancelable */
						$.initEvent(e, true, true);
						o.dispatchEvent($);
					}
					else 
					{
						if (document.createEventObject) 
						{
							/* dispatch for IE */
							o.fireEvent('on' + e, document.createEventObject());
						}
					}
				}
			},
			
			hasCollision: function(a, b)
			{
				if (a && b) 
				{
					var B = document.body;
					var aX = 0;
					var aY = 0;
					var o = a;
					for (; o !== B; o = o.parentNode) 
					{
						aX += o.offsetLeft;
						aY += o.offsetTop;
					}
					var bX = 0;
					var bY = 0;
					for (o = b; o !== B; o = o.parentNode) 
					{
						bX += o.offsetLeft;
						bY += o.offsetTop;
					}
					if (!(aX < bX - a.offsetWidth || bX + b.offsetWidth < aX)) 
					{
						return !(aY < bY - a.offsetHeight || bY + b.offsetHeight < aY);
					}
				}
				return false;
			},
			
			purgeElement: function(o)
			{
				/* based on crockford.com purge */
				if (o) 
				{
					var $ = o.attributes;
					if ($) 
					{
						var i = $.length;
						var n;
						while (i--) 
						{
							if ('function' === typeof o[(n = $[i].name)]) 
							{
								o[n] = null;
							}
						}
					}
					if ((o = o.childNodes)) 
					{
						$ = o.length;
						while ($--) 
						{
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
		}
	};
	
	
		
	/* DOMElement
	 */
	leaf.DOMElement = function(element)
	{
		if (this instanceof leaf.DOMElement) 
		{
			this.DOMElement(element);
		}
	};
	
	
	
	/* DOM Prototype
	 */
	leaf.DOMElement.prototype = {
	
		/* Constructor */
		DOMElement: function(element)
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
			var e = this.element;
			if (e && cssObj instanceof Object) {
				var s = e.style;
				var c;
				var $ = '';
				for (c in cssObj) {
					$ += c +': ' +cssObj[c] +'\; ';
				}
				if (s.cssText===undefined) {
					e.setAttribute('style', (e.getAttribute('style')||'') +$);
				}
				else {					
					s.cssText = ((c = s.cssText) && (c.charAt(c.length-1)==='\;' ? c:c+'; ')||'')+$;
				}
			}
		},
		
		getCSS: function(property)
		{
			if ('string' === typeof property) {
				var o = this.element;
				if (o) {
					if ((o = o.style.cssText===undefined ? o.getAttribute('style') : o.style.cssText)) {
						/* RegExp does not 'compile' on AIR 1.0 */
						if (-1 < (i = o.search(new RegExp('(?:^|\\\;| )' + property + '\\\:', 'i')))) {
							return o.substring((i = o.indexOf(':', i) + 2), (i = o.indexOf('\;', i)) === -1 ? o.length : i);
						}
					}
				}
			}
			return '';
		},
		
		/* Class operations needs new regexp
		 * replace doesn't work with this one similar
		 */
		addClass: function(classNames)
		{
			var e = this.element;
			if (e && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) {
				var c = e.className;
				if ('string' === typeof c) {
					var l = classNames.length;
					var i = 0;
					var k;
					while (i < l) {
						// RegExp does not 'compile' on AIR 1.0
						if ((new RegExp('(?:\\\s|^)' + (k = classNames[i++]) + '(?:\\\s|$)')).test(c)) {
							continue;
						}
						c += ' ' +k;
					}
					e.className = c;
				}			
			}
		},
		
		removeClass: function(classNames)
		{
			var e = this.element;
			if (e && ('string' === typeof classNames? classNames = [classNames]:classNames instanceof Array)) {
				var c = e.className;
				if ('string' === typeof c) {
					var i = classNames.length;
					var k;
					e.className = c.replace(new RegExp('(?:\\\s|^)(?:' +classNames.toString().replace(/\,/g,'\|') +')(?:\\\s|$)'), '');
				}
			}
		},

		
		/* Position */
		
		setPosition: function(x, y, z, type)
		{
			/* large but optimum code */
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
					x:   e.offsetLeft,
					y:    e.offsetTop,
					width:  e.offsetWidth,
					height: e.offsetHeight,
					parent: e.offsetParent
				};
			}
			return {
				x: 0,
				y: 0,
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
		 * nice for UI and effects
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
			/* FIXME: IE6 dont allow changes to innerHTML when element was not appended yet */
			var e = this.element;
			if (!(value === null && value === undefined) && e) {
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
			/* FIXME: IE6 dont allow changes to innerHTML when element was not appended yet */
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
					$.backgroundImage = 'url(\'' +src + '\')';
				}
				
				/* reusing var */
				src = $.backgroundPosition.split(' ');
				
				x = 'number' === typeof x ? x + 'px' : 'string' === typeof x ? x : (src[0] || '50%');
				y = 'number' === typeof y ? y + 'px' : 'string' === typeof y ? y : (src[1] || '50%');
				
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
			if ($) 
			{
				return {
					color: $.borderColor,
					width: keepUnits ? $.borderWidth : parseFloat($.borderWidth),
					style: $.borderStyle
				};
			}
			return {
				color: '',
				width: 0,
				style: ''
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
				/* reusing var tagName */
				if ((tagName = document.createElement(tagName))) {
					if ('string' === typeof id) {
						tagName.id = id;
					}
					this.style = (this.element = tagName).style;
					this.setArea(x, y, z, width, height, positionType);
				}
			}
		},
		
		addElement: function(parent)
		{
			var e = this.element;
			if (e && !e.parentNode && (parent = this.core.getElement(parent)||document.body)) {
				parent.appendChild(e);
			}
		},
		
		insertBefore: function(node)
		{
			var e = this.element;
			if (e && (node = this.core.getElement(node))) {
				try {
					node.parentNode.insertBefore(e, node);
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
		
		addChild: function(childNode)
		{
			var e;
			try {
				this.element.appendChild(childNode);
			} 
			catch (e) {
			}
		},
		
		removeChild: function(child)
		{
			var e = this.element;
			if (e && (child = this.getChild(child))) {
				e.removeChild(child);
			}
		},
		
		setChild: function(child)
		{
			this.setElement(this.getChild(child));
		},
		
		getChild: function(child)
		{
			var e = this.element;
			if (e) {
				return e.childNodes[child]||((child = this.core.getElement(child)) && e===child.parentNode ? child : null);
			}
			return null;
		},
		
		purgeChild: function(child)
		{
			if ((child = this.getChild(child))) {
				this.core.purgeElement(child);
				this.removeChild(child);
			}
		},
		
		cloneChild: function(child, cloneAttrAndChilds)
		{
			if ((child = this.getChild(child))) {
				return child.cloneNode(!!cloneAttrAndChilds);
			}
			return null;
		},
		
		getParent: function()
		{
			var e = this.element;
			if (e) {
				return e.parentNode||null;
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
		
	/* Aptana intellisense adjust */
	leaf.DOMElement.prototype.core = leaf.DOM.core;
	leaf.DOMElement = leaf.DOMElement;
	leaf.DOM = leaf.DOM;
