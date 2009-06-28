	
	/*  LEAF JavaScript Library
	 *  Leonardo Dutra
	 *  version Alpha
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
	 * leaf.Array
	 *     .Object
	 *     .AJAX
	 *     .Window
	 *     .Document
	 *     .Mouse
	 *     .DOM        (core is a kind of "private" object, but it's public for advanced purpouses like extensions)
	 *     .DOMElement (handles only elements, think in it as a box that you put some element inside and mod)
	 */
	
	
	/* check LEAF "namespace" */
	if (!window.leaf) 
	{
		window.leaf = {};
	}


	/* Array
	 */
	
	/* BENCHMARKIT */
	leaf.Array = {

		each: function (array, itemHandler)
		{
			var l;
			if (array && !(array instanceof String) && 'function'===typeof itemHandler && (l = array.length))
			{
				var i = 0;
				var k;
				while (i < l)  {
					if ((k = array[i])) {
						itemHandler.call(k, i++);
					}
				}
			}
		}
	};
	

	/* Object
	 */
	leaf.Object = {

		extend: function(object, sourceObject, noOverride)
		{
			if (object && sourceObject) 
			{
				for (var n in sourceObject) 
				{	
					if (object[n]!==undefined && noOverride) 
					{
						continue;
					}
					object[n] = sourceObject[n];
				}
			}
		}
	};
	
	/* Ajax
	 * Factory optimization
	 * TODO: replace with the new AJAX prototype
	 */
	leaf.AJAX = {
		
		getActiveXList: function (version)
		{
			return this.core.activeX;
		},
		
		core: {
			activeX: [
				'Microsoft.XMLHTTP',
				'MSXML2.XMLHTTP',
				'MSXML2.XMLHTTP.3.0',
				'MSXML2.XMLHTTP.4.0',
				'MSXML2.XMLHTTP.5.0',
				'MSXML2.XMLHTTP.6.0'
			]
		}
	};
	
	(function () {
		var W = window;
		if (W.XMLHttpRequest) {
			leaf.AJAX.createRequester = function()
			{
				return new window.XMLHttpRequest();
			};
		}
		else
		{
			leaf.AJAX.createRequester = function()
			{
				var W = window;				// constant for optimization
				var A = this.core.activeX;	// ActiveX versions in this array
				var i = A.length;
				var o;
				while (i--)					//reverse loop because is optimum
				{
					try 
					{
						o = new W.ActiveXObject(A[i]);
						return o;
					} 
					catch (o) {}
				}
				return null;
			};
		}
	})();
	
	
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
	 * TODO: factory optimization
	 */
	leaf.Mouse = {

		getPosition: function(mouseEvent)
		{
			if ('object'===typeof (mouseEvent = mouseEvent||event)) 
			{
				var D = document.documentElement;
				var P = 'number' === typeof mouseEvent.pageY;
				return {
					/* IE adjusted using client properties */
					x: P ? mouseEvent.pageX : mouseEvent.clientX +D.scrollLeft -(D.clientLeft||0),
					y: P ? mouseEvent.pageY : mouseEvent.clientY +D.scrollTop  -(D.clientTop ||0)
				};
			}
			return null;
		}
	};
	
	
	leaf.DOM = {

		getById: function(ids)
		{
			if (ids instanceof Array) 
			{
				var d = document;
				var L = ids.length;
				var n = 0;
				var i = 0;
				var $ = [];
				var o;
				while (i < L) 
				{
					if ((o = d.getElementById(ids[i++]))) {
						$[n++] = o;
					}
				}
				/* check if array is empty */
				if (n) 
				{
					return $;
				}
			}
			return document.getElementById(ids);
		},
		
		/* TODO: better code for check empty and null arrays */
		getByTag: function(tagNames, rootNode)
		{
			rootNode = this.core.getElement(rootNode)||document;
			if (tagNames instanceof Array) 
			{
				var L = tagNames.length;
				var n = 0;
				var i = 0;
				var j = 0;
				var $ = [];
				var k;
				var o;
				while (i < L) 
				{
					k = (o = rootNode.getElementsByTagName(tagNames[i++])).length;
					while (j < k) 
					{
						$[n++] = o[j++];
					}
					j = 0;
				}
				/* check if array is empty */
				if (n) 
				{
					return $;
				}
			}
			return rootNode.getElementsByTagName(tagNames);
		},
	
		/* BENCHMARKIT */
		getByClass: function(classNames, rootNode)
		{
			if ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array && classNames.length) 
			{
				var R = new RegExp('(?:\\s|^)(?:' +classNames.join('\|') +')(?:\\s|$)');
				var $ = [];
				var n = 0;
				/* Depth search */
				var Q = function (o)
				{
					if (o.nodeType === 1 && R.test(o.className)) 
					{
						$[n++] = o;
					}
					if ((o = o.childNodes)) 
					{
						var L = o.length;
						for (var i = 0; i < L;) 
						{
							Q(o[i++]);
						}
					}
				};
				Q(this.core.getElement(rootNode)||document);
				/* check if array is empty */
				if (n) 
				{
					return $;
				}
			}
			return null;
		},
		
		hasCollision: function(elementA, elementB)
		{
			/* check two elements collision */
			var C = this.core;
			C.hasCollision(C.getElement(elementA), C.getElement(elementB));
		},
		
		purgeElement: function(element)
		{
			/* removes functions to prevent memory leak */
			var c = this.core;
			if ((element = c.getElement(element))) {
				c.purgeElement(element);
				if ((c = element.parentNode)) 
				{
					c.removeChild(element);
				}
			}
		},
		
		addEvent: function(element, event, handlerFn)
		{
			var C = this.core;
			C.addEvent(C.getElement(element), event, handlerFn);
		},
		
		removeEvent: function(element, event, handlerFn)
		{
			var C = this.core;
			C.removeEvent(C.getElement(element), event, handlerFn);
		},
		
		dispatchEvent: function(element, event)
		{
			var C = this.core;
			C.dispatchEvent(C.getElement(element), event);
		},
		
		
		/* DOM Core
		 * core contains functions used in many internal operations
		 */
		core: {

			addEvent: function(o, e, fn)
			{
				if (o && 'string' === typeof e && 'function' === typeof fn) 
				{
					/* base code by John Resig
					 * uses hash name to fix IE problems
					 */
					if (o.addEventListener) 
					{
						o.addEventListener(e, fn, false);
					}
					else 
					{
						if (o.attachEvent) 
						{
							var h = e +fn;
							o['e' +h] = fn;
							o.attachEvent('on' +e, (o[h] = function()
							{
								o['e' +h](event);
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
					 * uses hash to fix IE problems
					 */
					if (o.removeEventListener) 
					{
						o.removeEventListener(e, fn, false);
					}
					else 
					{
						if (o.detachEvent) 
						{
							o.detachEvent('on' +e, o[(e = e +fn)]);
							o[e] = null;
							o['e' +e] = null;
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
							o.fireEvent('on' +e, document.createEventObject());
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
					while (o !== B) 
					{
						aX += o.offsetLeft;
						aY += o.offsetTop;
						o = o.parentNode;
					}
					var bX = 0;
					var bY = 0;
					o = b;
					while (o !== B) 
					{
						bX += o.offsetLeft;
						bY += o.offsetTop;
						o = o.parentNode;
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
				/* base code on crockford.com */
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
			},
			
			getElement: function($)
			{
				return $ ? $.nodeType === 1 ? $ : document.getElementById($) : null;
			}
		}
	};
	
		
	/* DOMElement
	 */
	leaf.DOMElement = function(element)
	{
		/* some intellisenses need this kind of initilization */
		if (this instanceof leaf.DOMElement) 
		{
			this.DOMElement(element);
		}
	};
	
	
	
	/* DOM Prototype
	 */
	leaf.DOMElement.prototype = {
		
		element: null,
		style:   null,
		core:    null,
	
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
		
		/* BENCHMARKIT */
		setCSS: function(cssObj)
		{
			var E = this.element;
			if (E && cssObj instanceof Object) {
				var s = E.style;
				var $ = [];
				var n = 0;
				var c;
				for (c in cssObj) {
					$[n++] = c +': ' +cssObj[c] +'\; ';
				}
				if (s.cssText===undefined) {
					E.setAttribute('style', (E.getAttribute('style')||'') +$.join(''));
				}
				else {					
					s.cssText = ((c = s.cssText) && (c.charAt(c.length-1)==='\;' ? c:c+'; ')||'')+$.join('');
				}
			}
		},
		
		getCSS: function(property)
		{
			if ('string' === typeof property) {
				var o = this.element;
				if (o) {
					if ((o = o.style.cssText===undefined ? o.getAttribute('style') : o.style.cssText)) {
						/* RegExp does not 'compile' on AIR 1.0
						 * This code is a little more faster than using pure RegExp
						 */
						if (-1 < (i = o.search(new RegExp('(?:\\\;|\\s|^)' +property +'\\\:', 'i')))) {
							return o.substring((i = o.indexOf(':', i) +2), (i = o.indexOf('\;', i)) === -1 ? o.length : i);
						}
						
					}
				}
			}
			return null;
		},
		
		/* Class operations needs new regexp
		 * code cannot only add or remove because classNames keeps residual values on some browsers
		 */
		
		/* BENCHMARKIT */
		addClass: function(classNames)
		{
			var E = this.element;
			if (E && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) {
				var k = E.className;
				if ('string' === typeof k) {
					var R = new RegExp('(?:\\s|^)' +k.replace(/(?:^\s+|\s+$)/g, '').replace(/\s+/g, '\|') +'(?:\\s|$)');
					var L = classNames.length;
					var $ = [];
					var n = 0;
					var i = 0;
					while (i < L) {
						if (R.test((k = classNames[i++])))
						{
							continue;
						}
						$[n++] = k;
					}
					E.className += ' ' +$.join(' ').replace(/\s{2,}/g, ' ');
				}			
			}
		},
		
		removeClass: function(classNames)
		{
			var E = this.element;
			if (E && ('string' === typeof classNames? classNames = [classNames]:classNames instanceof Array)) {
				var C = E.className;
				if ('string'===typeof C) {
					E.className = C.replace(new RegExp('(?:\\s|\\b)(?:' +classNames.join('\|') +')(?:\\s|$)', 'gi'), '');
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
						$.right = x +'px';
					}
					else {
						$.left = x +'px';
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
						x: $.left||$.right,
						y: $.top ||$.bottom,
						z: $.zIndex,
						position: $.position
					};
				}
				else {
					return {
						x: parseFloat($.left||$.right) ||0,
						y: parseFloat($.top ||$.bottom)||0,
						z: $.zIndex,
						position: $.position
					};
				}
			}
			return null;
		},
		
		getOffset: function()
		{
			var E = this.element;
			if (E) {
				return {
					x:      E.offsetLeft,
					y:      E.offsetTop,
					width:  E.offsetWidth,
					height: E.offsetHeight,
					parent: E.offsetParent
				};
			}
			return null;
		},
		
		invertXY: function(x, y)
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
						width:  $.width,
						height: $.height
					};
				}
				else {
					return {
						width:  parseFloat($.width)  || 0,
						height: parseFloat($.height) || 0
					};
				}
			}
			return null;
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
			var $ = this.style;
			if ($) {
				if (keepUnits) {
					return {
						x: $.left||$.right,
						y: $.top ||$.bottom,
						z: $.zIndex,
						width:    $.width,
						height:   $.height,
						position: $.position
					};
				}
				else {
					return {
						x: parseFloat($.left||$.right) ||0,
						y: parseFloat($.top ||$.bottom)||0,
						z: $.zIndex,
						width:    parseFloat($.width) ||0,
						height:   parseFloat($.height)||0,
						position: $.position
					};
				}
			}
			return null;
		},
		
		
		/* Content */
		setContent: function(value)
		{
			/* FIXME: IE6 dont allow changes to innerHTML when element was not appended yet */
			var E = this.element;
			if (E && !(value === null && value === undefined)) {
				E.innerHTML = value;
			}
		},
		
		getContent: function()
		{
			var E = this.element;
			return E && E.innerHTML||null;
		},
		
		addContent: function(value)
		{
			/* FIXME: IE6 dont allow changes to innerHTML when element was not appended yet */
			var E = this.element;
			if (E && !(value === null && value === undefined)) {
				E.innerHTML += String(value);
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
				$.backgroundPosition =
					('number' === typeof x ? x + 'px' : 'string' === typeof x ? x : (src[0] || '50%')) +' ' +
					('number' === typeof y ? y + 'px' : 'string' === typeof y ? y : (src[1] || '50%'));
					
				$.backgroundRepeat = repeat ? repeat : 'no-repeat';
			}
		},
		
		getBackground: function(keepUnits)
		{
			var $ = this.style;
			if ($) {
				var P = $.backgroundPosition.split(' ');
				if (keepUnits) {
					return {
						x:      P[0]||'',
						y:      P[1]||'',
						color:  $.backgroundColor,
						src:    $.backgroundImage,
						repeat: $.backgroundRepeat
					};
				}
				else {
					return {
						x:      parseFloat(P[0])||0,
						y:      parseFloat(P[1])||0,
						color:  $.backgroundColor,
						src:    $.backgroundImage,
						repeat: $.backgroundRepeat
					};
				}
			}
			return null;
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
						color:      $.color,
						size:       $.fontSize,
						family:     $.fontFamily,
						weight:     $.fontWeight,
						style:      $.fontStyle,
						spacing:    $.letterSpacing,
						lineHeight: $.lineHeight,
						variant:    $.fontVariant
					};
				}
				else {
					return {
						color:      $.color,
						size:       parseFloat($.fontSize)||0,
						family:     $.fontFamily,
						weight:     $.fontWeight,
						style:      $.fontStyle,
						spacing:    parseFloat($.letterSpacing)||0,
						lineHeight: parseFloat($.lineHeight)   ||0,
						variant:    $.fontVariant
					};
				}
				
			}
			return null;
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
			return null;
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
						top:    $.paddingTop,
						right:  $.paddingRight,
						bottom: $.paddingBottom,
						left:   $.paddingLeft
					};
				}
				else {
					return {
						top:    parseFloat($.paddingTop)   ||0,
						right:  parseFloat($.paddingRight) ||0,
						bottom: parseFloat($.paddingBottom)||0,
						left:   parseFloat($.paddingLeft)  ||0
					};
				}
			}
			return null;
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
						top:    $.marginTop,
						right:  $.marginRight,
						bottom: $.marginBottom,
						left:   $.marginLeft
					};
				}
				else {
					return {
						top:    parseFloat($.marginTop)   ||0,
						right:  parseFloat($.marginRight) ||0,
						bottom: parseFloat($.marginBottom)||0,
						left:   parseFloat($.marginLeft)  ||0
					};
				}
			}
			return null;
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
						align:       $.textAlign,
						decoration:  $.textDecoration,
						wordSpacing: $.wordSpacing,
						whiteSpace:  $.whiteSpace,
						indent:      $.textIndent,
						transform:   $.textTransform
					};
				}
				else {
					return {
						align:       $.textAlign,
						decoration:  $.textDecoration,
						wordSpacing: parseFloat($.wordSpacing)||0,
						whiteSpace:  $.whiteSpace,
						indent:      parseFloat($.textIndent) ||0,
						transform:   $.textTransform
					};
				}
			}
			return null;
		},
		
		
		/* Scroll */
		
		setScroll: function(top, left)
		{
			var E = this.element;
			if (E) {
				if ('number' === typeof top) {
					if (!(top < 0 || E.scrollHeight < top)) {
						E.scrollTop = top;
					}
				}
				if ('number' === typeof left) {
					if (!(left < 0 || E.scrollWidth < left)) {
						E.scrollLeft = left;
					}
				}
			}
		},
		
		getScroll: function()
		{
			var E = this.element;
			if (E) {
				return {
					top:    E.scrollTop,
					left:   E.scrollLeft,
					height: E.scrollHeight,
					width:  E.scrollWidth
				};
			}
			return null;
		},
		
		
		/* Opacity
		 * FIXME: IE6 does not apply opacity on static elements if no dimension is set 
		 */
		setOpacity: function(opacity)
		{
			var $ = this.style;
			if ($ && 'number' === typeof opacity) {
				opacity = opacity < 0 ? 0 : 1 < opacity ? 1 : opacity.toFixed(2);
				if ($.opacity===undefined) // use IE 'filters'
				{
					$.filter = 'alpha(opacity=' +(opacity * 100) +')';
				}
				else {
					$.opacity = opacity;
				}
			}
		},

		getOpacity: function()
		{
			var E = this.element;
			if (E) {
				var $ = E.style;
				if ($.opacity===undefined) {
					try {
						$ = E.filters.alpha.opacity /100;
						return $;
					}
					catch ($) { 
						return ($ = (/opacity=(\d+)/i).exec(E.style.cssText)) ? $[1]/100 : 1;
					}
				}
				else {
					return ($ = parseFloat($.opacity)) ? $ : 1;
				}
				return 1;
			}
			return null;
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
		
		appendElement: function(parent)
		{
			var E = this.element;
			if (E && !E.parentNode)
			{
				((parent && parent.nodeType ? parent : document.getElementById(parent))||document.body).appendChild(E);
			}
		},
		
		insertBefore: function(node)
		{
			var E = this.element;
			var p;
			if (E && !E.parentNode && (node = this.core.getElement(node)) && (p = node.parentNode)) {
				p.insertBefore(E, node);
			}
		},
		
		insertAfter: function(node)
		{
			var E = this.element;
			var p;
			if (E && !E.parentNode && (node = this.core.getElement(node)) && (p = node.parentNode)) {
				if ((node = node.nextSibling)) 
				{
					p.insertBefore(E, node);
				}
				else {
					p.appendChild(E);
				}
			}
		},
		
		insertAsFirst: function (parent) {
			var E = this.element;
			if (E && !E.parentNode)
			{
				if (!(parent && parent.nodeType)) {
			  		parent = document.getElementById(parent)||document.body;
				}
				if (parent.firstChild) {
					parent.insertBefore(E, parent.firstChild);
				}
				else {
					parent.appendChild(E);
				}
			}
		},
		
		removeElement: function()
		{
			var E = this.element;
			if (E) {
				var P = E.parentNode;
				if (P) {
					P.removeChild(E);
				}
			}
		},
		
		cloneElement: function(cloneAttrAndChildren)
		{
			var E = this.element;
			return E && E.cloneNode(!!cloneAttrAndChildren)||null;
		},
		
		purgeElement: function()
		{
			var E = this.element;
			if (E) {
				this.core.purgeElement(E);
				this.removeElement(E);
				this.element = (this.style = null);
			}
		},
		
		getFirst: function()
		{
			var e = this.element;
			if (e) 
			{
				e = e.firstChild;
				while (e) 
				{
					if (e.nodeType === 1) {
						return e;
					}
					e = e.nextSibling;
				}
			}
			return null;
		},
		
		getNext: function()
		{
			var e = this.element;
			if (e) 
			{	
				while ((e = e.nextSibling)) 
				{
					if (e.nodeType === 1) {
						return e;
					}
				}
			}
			return null;
		},
		
		getPrevious: function()
		{
			var e = this.element;
			if (e) 
			{	
				while ((e = e.previousSibling)) 
				{
					if (e.nodeType === 1) {
						return e;
					}
				}
			}
			return null;
		},

		getLast: function()
		{
			var e = this.element;
			if (e) 
			{
				e = e.lastChild;
				while (e) 
				{
					if (e.nodeType === 1) {
						return e;
					}
					e = e.previousSibling;
				}
			}
			return null;
		},
		
		getChildElements: function()
		{
			var e = this.element;
			if (e) 
			{
				var $ = [];
				var n = 0;
				e = e.firstChild;
				while (e) 
				{
					if (e.nodeType===1) 
					{
						$[n++] = e;
					}
					e = e.nextSibling;
				}
				if (n) 
				{
					return $;
				}
			}
			return null;
		},
		
		setChild: function (child) {
			var e = this.getChild(child);
			this.style = (this.element = e) ? e.style : null;
		},
		
		setParent: function () {
			var e = this.getParent();
			this.style = (this.element = e) ? e.style : null;
		},
		
		setFirst: function () {
			var e = this.getFirst();
			this.style = (this.element = e) ? e.style : null;
		},
		
		setPrevious: function () {
			var e = this.getPrevious();
			this.style = (this.element = e) ? e.style : null;
		},
		
		setNext: function () {
			var e = this.getNext();
			this.style = (this.element = e) ? e.style : null;
		},
		
		setLast: function () {
			var e = this.getLast();
			this.style = (this.element = e) ? e.style : null;
		},
		
		getChild: function(child)
		{
			var E = this.element;
			return E.childNodes[child]||(child = this.core.getElement(child)) && E===child.parentNode && child||null;
		},
		
		appendChild: function(childNode)
		{
			var E = this.element;
			if (E && childNode && 'number'===typeof childNode.nodeType && !childNode.parentNode)
			{
				E.appendChild(childNode);
			} 
		},
		
		appendChildren: function(childNodes)
		{
			var E = this.element;
			var l;
			if (E && childNodes && (l = childNodes.length)) {
				var i = 0;
				var k;
				while (i < l) {
					if (!(k = childNodes[i++]).parentNode && 'number'===typeof k.nodeType)
					{
						E.appendChild(k);
					}
				}
			}
		},
		
		removeChild: function(child)
		{
			var E = this.element;
			if (E && (child = this.getChild(child))) {
				E.removeChild(child);
			}
		},
		
		removeChildren: function()
		{
			var E = this.element;
			if (E)
			{
				var $ = E.childNodes;
				var i = $.length;
				var k;
				while (i--) {
					E.removeChild($[i]);
				}
			}
		},
		
		purgeChild: function(child)
		{
			if ((child = this.getChild(child))) {
				this.core.purgeElement(child);
				this.removeChild(child);
			}
		},
		
		purgeChildren: function()
		{
			var E = this.element;
			if (E) {
				/* local purge function for best performance */
				var P = function (o) {
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
							P(o[$]);
						}
					}
				};
				var $ = E.childNodes;
				var i = $.length;
				var k;
				while (i--) {
					if ((k = $[i]).nodeType === 1) 
					{
						P(k);
					}
					E.remove(k);
				}
			}
		},
		
		cloneChild: function(child, cloneAttrAndChilds)
		{
			return (child = this.getChild(child)) ? child.cloneNode(!!cloneAttrAndChilds) : null;
		},
		
		getParent: function()
		{
			var E = this.element;
			return E && E.parentNode||null;
		},
		
		hasCollision: function(collisorElement)
		{
			return this.core.hasCollision(this.element, this.core.getElement(collisorElement));
		},
		
		setAttribute: function (attribute, value) {
			var E = this.element;
			if (E && value !== undefined) 
			{
				if ('string' === typeof attribute) 
				{
					if ('style'===attribute && E.style.cssText!==undefined) {
						E.style.cssText = value;
					}
					else {
						E.setAttribute(attribute, value);
					}
				}
				else 
				{
					if ('number' === typeof attribute) 
					{
						if ('object'===typeof E.attributes[attribute])
						{
							E.attributes[attribute].nodeValue = value;
						}
						else {
							E.attributes[attribute] = value;
						}
					}
				}
			}
		},
		
		getAttribute: function (attribute) {
			var o = this.element;
			if (o && (o = o[attribute]||o.getAttribute(attribute)||o.attributes[attribute])) {
				if ('style' === attribute && o.cssText !== undefined) 
				{
					return o.cssText.toLowerCase();
				}
				if ('object' === typeof o) 
				{
					return o.nodeValue||'';
				}
			}
			if ('string' === typeof o) 
			{
				return o;
			}
			return null;
		},

		/* Event */
		addEvent: function(type, handlerFn)
		{
			this.core.addEvent(this.element, type, handlerFn);
		},
		removeEvent: function(type, handlerFn)
		{
			this.core.removeEvent(this.element, type, handlerFn);
		},
		
		dispatchEvent: function (type) {
			this.core.dispatchEvent(this.element, type);
		}
	};
	leaf.DOMElement.prototype.core = leaf.DOM.core;	
		
	/* Aptana intellisense adjust */
	leaf.DOMElement = leaf.DOMElement;