	
	/*  LEAF JavaScript Library
	 *  Leonardo Dutra
	 *  v0.8.XXXXXXa
	 *
	 *  Copyright (c) 2009, Leonardo Dutra Constâncio.
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
	
	leaf.core = {
		requesterActiveXs: [
			'Microsoft.XMLHTTP',
			'MSXML2.XMLHTTP',
			'MSXML2.XMLHTTP.3.0',
			'MSXML2.XMLHTTP.4.0',
			'MSXML2.XMLHTTP.5.0',
			'MSXML2.XMLHTTP.6.0'
		],
		
		getElement: function ($) {
			return $ ? $.nodeType ? $ : document.getElementById($) : null;
		}
	};
	
	leaf.each = function(array, itemHandler)
	{
		var l;
		if (array && !(array instanceof String) && 'function' === typeof itemHandler && (l = array.length)) 
		{
			var i = 0;
			var k;
			while (i < l) 
			{
				if ((k = array[i])) 
				{
					itemHandler.call(k, i++);
				}
			}
		}
	};

	leaf.extend = function(object, sourceObject, noOverride)
	{
		if (object && sourceObject) 
		{
			for (var n in sourceObject) 
			{
				if (object[n] !== undefined && noOverride) 
				{
					continue;
				}
				object[n] = sourceObject[n];
			}
		}
	};
	
	leaf.createRequester = function()
	{
		var W = window; // constant for optimization
		if (W.XMLHttpRequest) 
		{
			return new W.XMLHttpRequest();
		}
		// if no return
		if (W.ActiveXObject) 
		{
			var A = this.core.requesterActiveXs; // ActiveX versions in this array
			var i = A.length;
			var o;
			while (i--) // optimum
 			{
				try // try catch allow infinite versions
 				{
					o = new W.ActiveXObject(A[i]);
					return o;
				} 
				catch (o) 
				{
				}
			}
		}
		return null;
	};
		
	leaf.requesterActiveXs = function()
	{
		// return array with version list (ascending)
		return this.core.requesterActiveXs;
	};

	leaf.getMousePosition = function(mouseEvent)
	{
		if ('object' === typeof(mouseEvent = mouseEvent || event)) 
		{
			if ('number' === typeof mouseEvent.pageY) 
			{
				return {
					x: mouseEvent.pageX,
					y: mouseEvent.pageY
				};
			}
			var H = document.documentElement;
			var B = document.body;
			if (B) 
			{
				return {
					x: mouseEvent.clientX + (H.scrollLeft || B.scrollLeft) - (H.clientLeft || 0),
					y: mouseEvent.clientY + (H.scrollTop  || B.scrollTop)  - (H.clientTop  || 0)
				};
			}
			return {
				x: mouseEvent.clientX + H.scrollLeft - (H.clientLeft || 0),
				y: mouseEvent.clientY + H.scrollTop  - (H.clientTop || 0)
			};
		}
		return null;
	};
	
	leaf.getById = function(ids)
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
				if ((o = d.getElementById(ids[i++]))) 
				{
					$[n++] = o;
				}
			}
			if (n) 
			{
				return $;
			}
		}
		return document.getElementById(ids);
	};
		
	/* TODO: optimize */
	leaf.getByTag = function(tagNames, rootNode)
	{
		rootNode = this.core.get(rootNode) || document;
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
			if (n) 
			{
				return $;
			}
		}
		return rootNode.getElementsByTagName(tagNames);
	};
		
	// BENCHMARKIT
	leaf.getByClass = function(classNames, rootNode)
	{
		if ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array && classNames.length) 
		{
			var R = new RegExp('(?:\\s|^)(?:' + classNames.join('\|') + ')(?:\\s|$)');
			var $ = [];
			var n = 0;
			/* Depth search */
			var Q = function(o)
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
			Q(this.core.get(rootNode) || document);
			/* check if array is empty */
			if (n) 
			{
				return $;
			}
		}
		return null;
	};

	leaf.addEvent = function(object, type, handlerFn)
	{
		if (object && (object.nodeType===1||object===window||object===document) && 'string' === typeof type && 'function' === typeof handlerFn) 
		{
			/* base code by John Resig
			 * uses hash name to fix IE problems
			 */
			if (object.addEventListener) 
			{
				object.addEventListener(type, handlerFn, false);
			}
			else 
			{
				if (object.attachEvent) 
				{
					var h = type + handlerFn;
					object['e' + h] = handlerFn;
					object.attachEvent('on' + type, (object[h] = function()
					{
						object['e' + h](event);
					}));
				}
			}
		}
	};
			
	leaf.removeEvent = function(object, type, handlerFn)
	{
		if (object && (object.nodeType===1||object===window||object===document) && 'string' === typeof type && 'function' === typeof handlerFn) 
		{
			/* base code by John Resig
			 * uses hash to fix IE problems
			 */
			if (object.removeEventListener) 
			{
				object.removeEventListener(type, handlerFn, false);
			}
			else 
			{
				if (object.detachEvent) 
				{
					object.detachEvent('on' + type, object[(type = type + handlerFn)]);
					object[type] = null;
					object['e' + type] = null;
				}
			}
		}
	};
			
	leaf.dispatchEvent = function(object, type)
	{
		if (object && (object.nodeType===1||object===window||object===document) && 'string' === typeof type) 
		{
			if (object.dispatchEvent) 
			{
				/* dispatch for firefox and others */
				var $ = document.createEvent('HTMLEvents');
				/* event type, bubbling, cancelable */
				$.initEvent(type, true, true);
				object.dispatchEvent($);
			}
			else 
			{
				if (document.createEventObject) 
				{
					/* dispatch for IE */
					object.fireEvent('on' + type, document.createEventObject());
				}
			}
		}
	};
			
	leaf.purgeDOM = function(object)
	{
		/* base code on crockford.com */
		if (object) 
		{
			var $ = object.attributes;
			if ($) 
			{
				var i = $.length;
				var n;
				while (i--) 
				{
					if ('function' === typeof object[(n = $[i].name)]) 
					{
						object[n] = null;
					}
				}
			}
			if ((object = object.childNodes)) 
			{
				$ = object.length;
				while ($--) 
				{
					this.purgeDOM(object[$]);
				}
			}
		}
	};
	
	
	
	// BENCHMARKIT
	leaf.setCSS = function(e, cssObj)
	{
		var s;
		if (e && (s = e.style) && cssObj instanceof Object) 
		{
			var $ = [];
			var n = 0;
			var c;
			for (c in cssObj) 
			{
				$[n++] = c + ': ' + cssObj[c] + '\; ';
			}
			if (s.cssText === undefined) 
			{
				e.setAttribute('style', (e.getAttribute('style') || '') + $.join(''));
			}
			else 
			{
				s.cssText = ((c = s.cssText) && (c.charAt(c.length - 1) === '\;' ? c : c + '; ') || '') + $.join('');
			}
		}
	};
	
	leaf.getCSS = function(e, property)
	{
		var s;
		if (e && (s = e.style) && 'string' === typeof property) 
		{
			if ((e = s.cssText === undefined ? e.getAttribute('style') : s.cssText)) 
			{
				/* RegExp does not 'compile' on AIR 1.0
				 * This code is a little more faster than using pure RegExp
				 */
				if (-1 < (i = e.search(new RegExp('(?:\\\;|\\s|^)' + property + '\\\:', 'i')))) 
				{
					return e.substring((i = e.indexOf(':', i) + 2), (i = e.indexOf('\;', i)) === -1 ? e.length : i);
				}
				
			}
		}
		return null;
	};	
	
	// BENCHMARKIT
	leaf.addClass = function(e, classNames)
	{
		if (e && e.nodeType===1 && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) 
		{
			var k = e.className;
			if ('string' === typeof k) 
			{
				var R = new RegExp('(?:\\s|^)' + k.replace(/(?:^\s+|\s+$)/g, '').replace(/\s+/g, '\|') + '(?:\\s|$)');
				var L = classNames.length;
				var $ = [];
				var n = 0;
				var i = 0;
				while (i < L) 
				{
					// test avoids residual className problem
					if (R.test((k = classNames[i++]))) 
					{
						continue;
					}
					$[n++] = k;
				}
				e.className += ' ' + $.join(' ').replace(/\s{2,}/g, ' ');
			}
		}
	};	
	
	leaf.removeClass = function(e, classNames)
	{
		if (e && e.nodeType===1 && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) 
		{
			var C = e.className;
			if ('string' === typeof C) 
			{
				e.className = C.replace(new RegExp('(?:\\s|\\b)(?:' + classNames.join('\|') + ')(?:\\s|$)', 'gi'), '');
			}
		}
	};	
	
	leaf.setPosition = function(e, x, y, z, type)
	{
		if ((e = e && e.style)) 
		{
		
			e.position = 'string' === typeof type ? type : e.position || 'absolute';
			
			if ('number' === typeof x) 
			{
				if (e.right) 
				{
					e.left = '';
					e.right = x + 'px';
				}
				else 
				{
					e.left = x + 'px';
					e.right = '';
				}
			}
			else 
			{
				if ('string' === typeof x) 
				{
					if (e.right) 
					{
						e.left = '';
						e.right = x;
					}
					else 
					{
						e.left = x;
						e.right = '';
					}
				}
			}
			if ('number' === typeof y) 
			{
				if (e.bottom) 
				{
					e.top = '';
					e.bottom = y + 'px';
				}
				else 
				{
					e.top = y + 'px';
					e.bottom = '';
				}
			}
			else 
			{
				if ('string' === typeof y) 
				{
					if (e.bottom) 
					{
						e.top = '';
						e.bottom = y;
					}
					else 
					{
						e.top = y;
						e.bottom = '';
					}
				}
			}
			if ('number' === typeof z) 
			{
				e.zIndex = parseInt(z, 10);
			}
		}
	};
	
	
	leaf.getPosition = function(e, keepUnits)
	{
		if ((e = e && e.style)) 
		{
			if (keepUnits) 
			{
				return {
					x: e.left || e.right,
					y: e.top || e.bottom,
					z: e.zIndex,
					position: e.position
				};
			}
			else 
			{
				return {
					x: parseFloat(e.left || e.right)  || 0,
					y: parseFloat(e.top  || e.bottom) || 0,
					z: e.zIndex,
					position: e.position
				};
			}
		}
		return null;
	};	
	
	leaf.invertXY = function(e, x, y)
	{
		if ((e = e && e.style)) 
		{
			if (x) 
			{
				if (e.right) 
				{
					e.left = e.right;
					e.right = '';
				}
				else 
				{
					e.right = e.left;
					e.left = '';
				}
			}
			if (y) 
			{
				if (e.bottom) 
				{
					e.top = e.bottom;
					e.bottom = '';
				}
				else 
				{
					e.bottom = e.top;
					e.top = '';
				}
			}
		}
	};	
	
	leaf.setSize = function(e, width, height)
	{
		if ((e = e && e.style)) 
		{
			if ('number' === typeof width) 
			{
				e.width = width + 'px';
			}
			else 
			{
				if ('string' === typeof width) 
				{
					e.width = width;
				}
			}
			if ('number' === typeof height) 
			{
				e.height = height + 'px';
			}
			else 
			{
				if ('string' === typeof height) 
				{
					e.height = height;
				}
			}
		}
	};	
	
	leaf.getSize = function(e, keepUnits)
	{
		if ((e = e && e.style)) 
		{
			if (keepUnits) 
			{
				return {
					width: e.width,
					height: e.height
				};
			}
			else 
			{
				return {
					width:  parseFloat(e.width)  || 0,
					height: parseFloat(e.height) || 0
				};
			}
		}
		return null;
	};	
	

	leaf.setArea = function(e, x, y, z, width, height, positionType)
	{
		this.setPosition(e, x, y, z, positionType);
		this.setSize(e, width, height);
	};	
	
	leaf.getArea = function(e, keepUnits)
	{
		if ((e = e && e.style)) 
		{
			if (keepUnits) 
			{
				return {
					x: e.left || e.right,
					y: e.top || e.bottom,
					z: e.zIndex,
					width: e.width,
					height: e.height,
					position: e.position
				};
			}
			else 
			{
				return {
					x: parseFloat(e.left || e.right) || 0,
					y: parseFloat(e.top || e.bottom) || 0,
					z: e.zIndex,
					width:  parseFloat(e.width)  || 0,
					height: parseFloat(e.height) || 0,
					position: e.position
				};
			}
		}
		return null;
	};	
	
	
	leaf.setBackground = function(e, color, src, x, y, repeat)
	{
		if ((e = e && e.style)) 
		{
			if ('string' === typeof color) 
			{
				e.backgroundColor = color;
			}
			
			if ('string' === typeof src) 
			{
				e.backgroundImage = 'url(\'' + src + '\')';
			}
			
			/* reusing var */
			src = e.backgroundPosition.split(' ');
			e.backgroundPosition = ('number' === typeof x ? x + 'px' : 'string' === typeof x ? x : (src[0] || '50%')) + ' ' +
			('number' === typeof y ? y + 'px' : 'string' === typeof y ? y : (src[1] || '50%'));
			
			e.backgroundRepeat = repeat ? repeat : 'no-repeat';
		}
	};	
	
	leaf.getBackground = function(e, keepUnits)
	{
		if ((e = e && e.style)) 
		{
			var P = e.backgroundPosition.split(' ');
			if (keepUnits) 
			{
				return {
					x: P[0] || '',
					y: P[1] || '',
					color: e.backgroundColor,
					src: e.backgroundImage,
					repeat: e.backgroundRepeat
				};
			}
			else 
			{
				return {
					x: parseFloat(P[0]) || 0,
					y: parseFloat(P[1]) || 0,
					color: e.backgroundColor,
					src: e.backgroundImage,
					repeat: e.backgroundRepeat
				};
			}
		}
		return null;
	};	
	
	
	leaf.setFont = function(e, color, size, family, weight, style, spacing, lineHeight, useSmallCaps)
	{
		if ((e = e && e.style))  
		{
			if ('string' === typeof color) 
			{
				e.color = color;
			}
			if ('string' === typeof family) 
			{
				e.fontFamily = family;
			}
			if ('string' === typeof style) 
			{
				e.fontStyle = style;
			}
			if ('string' === typeof weight || 'number' === typeof weight) 
			{
				e.fontWeight = weight;
			}
			if ('number' === typeof size) 
			{
				e.fontSize = size + 'pt';
			}
			else 
			{
				if ('string' === typeof size) 
				{
					e.fontSize = size;
				}
			}
			if ('number' === typeof spacing) 
			{
				e.letterSpacing = spacing + 'px';
			}
			else 
			{
				if ('string' === typeof spacing) 
				{
					e.letterSpacing = spacing;
				}
			}
			if ('number' === typeof lineHeight) 
			{
				e.lineHeight = lineHeight + 'px';
			}
			else 
			{
				if ('string' === typeof lineHeight) 
				{
					e.lineHeight = lineHeight;
				}
			}
			if (useSmallCaps !== null && useSmallCaps !== undefined) 
			{
				e.fontVariant = useSmallCaps ? 'small-caps' : 'normal';
			}
		}
	};	
	
	leaf.getFont = function(e, keepUnits)
	{
		if ((e = e && e.style))  
		{
			if (keepUnits) 
			{
				return {
					color: e.color,
					size: e.fontSize,
					family: e.fontFamily,
					weight: e.fontWeight,
					style: e.fontStyle,
					spacing: e.letterSpacing,
					lineHeight: e.lineHeight,
					variant: e.fontVariant
				};
			}
			else 
			{
				return {
					color: e.color,
					size: parseFloat(e.fontSize) || 0,
					family: e.fontFamily,
					weight: e.fontWeight,
					style: e.fontStyle,
					spacing: parseFloat(e.letterSpacing) || 0,
					lineHeight: parseFloat(e.lineHeight) || 0,
					variant: e.fontVariant
				};
			}
			
		}
		return null;
	};	
	
	
	leaf.setBorder = function(e, color, width, style)
	{
		if ((e = e && e.style)) 
		{
			if ('string' === typeof color) 
			{
				e.borderColor = color;
			}
			if ('number' === typeof width) 
			{
				e.borderWidth = width + 'px';
			}
			else 
			{
				if ('string' === typeof width) 
				{
					e.borderWidth = width;
				}
			}
			e.borderStyle = 'string' === typeof style ? style : e.borderStyle || 'solid';
		}
	};	
	
	leaf.getBorder = function(e, keepUnits)
	{
		if ((e = e && e.style)) 
		{
			return {
				color: e.borderColor,
				width: keepUnits ? e.borderWidth : parseFloat(e.borderWidth),
				style: e.borderStyle
			};
		}
		return null;
	};	
	

	leaf.setPadding = function(e, top, right, bottom, left)
	{
		if ((e = e && e.style)) 
		{
			if ('number' === typeof top) 
			{
				e.paddingTop = top + 'px';
			}
			else 
			{
				if ('string' === typeof top) 
				{
					e.paddingTop = top;
				}
			}
			if ('number' === typeof right) 
			{
				e.paddingRight = right + 'px';
			}
			else 
			{
				if ('string' === typeof right) 
				{
					e.paddingRight = right;
				}
			}
			if ('number' === typeof bottom) 
			{
				e.paddingBottom = bottom + 'px';
			}
			else 
			{
				if ('string' === typeof bottom) 
				{
					e.paddingBottom = bottom;
				}
			}
			if ('number' === typeof left) 
			{
				e.paddingLeft = left + 'px';
			}
			else 
			{
				if ('string' === typeof left) 
				{
					e.paddingLeft = left;
				}
			}
		}
	};	
	
	
	leaf.getPadding = function(e, keepUnits)
	{
		if ((e = e && e.style)) 
		{
			if (keepUnits) 
			{
				return {
					top: e.paddingTop,
					right: e.paddingRight,
					bottom: e.paddingBottom,
					left: e.paddingLeft
				};
			}
			else 
			{
				return {
					top: parseFloat(e.paddingTop) || 0,
					right: parseFloat(e.paddingRight) || 0,
					bottom: parseFloat(e.paddingBottom) || 0,
					left: parseFloat(e.paddingLeft) || 0
				};
			}
		}
		return null;
	};	
	

	leaf.setMargin = function(e, top, right, bottom, left)
	{
		if ((e = e && e.style)) 
		{
			if ('number' === typeof top) 
			{
				e.marginTop = top + 'px';
			}
			else 
			{
				if ('string' === typeof top) 
				{
					e.marginTop = top;
				}
			}
			if ('number' === typeof right) 
			{
				e.marginRight = right + 'px';
			}
			else 
			{
				if ('string' === typeof right) 
				{
					e.marginRight = right;
				}
			}
			if ('number' === typeof bottom) 
			{
				e.marginBottom = bottom + 'px';
			}
			else 
			{
				if ('string' === typeof bottom) 
				{
					e.marginBottom = bottom;
				}
			}
			if ('number' === typeof left) 
			{
				e.marginLeft = left + 'px';
			}
			else 
			{
				if ('string' === typeof left) 
				{
					e.marginLeft = left;
				}
			}
		}
	};	
	
	leaf.getMargin = function(e, keepUnits)
	{
		if ((e = e && e.style)) 
		{
			if (keepUnits) 
			{
				return {
					top: e.marginTop,
					right: e.marginRight,
					bottom: e.marginBottom,
					left: e.marginLeft
				};
			}
			else 
			{
				return {
					top: parseFloat(e.marginTop) || 0,
					right: parseFloat(e.marginRight) || 0,
					bottom: parseFloat(e.marginBottom) || 0,
					left: parseFloat(e.marginLeft) || 0
				};
			}
		}
		return null;
	};	
	
	
	leaf.setText = function(e, align, decoration, wordSpacing, whiteSpace, indent, transform)
	{
		if ((e = e && e.style)) 
		{
			if ('string' === typeof align) 
			{
				e.textAlign = align;
			}
			if ('string' === typeof decoration) 
			{
				e.textDecoration = decoration;
			}
			if ('string' === typeof whiteSpace) 
			{
				e.whiteSpace = whiteSpace;
			}
			if ('string' === typeof transform) 
			{
				e.textTransform = transform;
			}
			if ('number' === typeof indent) 
			{
				e.textIndent = indent + 'px';
			}
			else 
			{
				if ('string' === typeof indent) 
				{
					e.textIndent = indent;
				}
			}
			if ('number' === typeof wordSpacing) 
			{
				e.wordSpacing = wordSpacing + 'px';
			}
			else 
			{
				if ('string' === typeof wordSpacing) 
				{
					e.wordSpacing = wordSpacing;
				}
			}
		}
	};	
	
	leaf.getText = function(keepUnits)
	{
		if ((e = e && e.style)) 
		{
			if (keepUnits) 
			{
				return {
					align: e.textAlign,
					decoration: e.textDecoration,
					wordSpacing: e.wordSpacing,
					whiteSpace: e.whiteSpace,
					indent: e.textIndent,
					transform: e.textTransform
				};
			}
			else 
			{
				return {
					align: e.textAlign,
					decoration: e.textDecoration,
					wordSpacing: parseFloat(e.wordSpacing) || 0,
					whiteSpace: e.whiteSpace,
					indent: parseFloat(e.textIndent) || 0,
					transform: e.textTransform
				};
			}
		}
		return null;
	};	
	
	leaf.setScroll = function(e, top, left)
	{
		if (e && e.style) 
		{
			if ('number' === typeof top) 
			{
				e.scrollTop = top < 0 ? 0 : e.scrollHeight < top ? e.scrollHeight : top;
			}
			if ('number' === typeof left) 
			{
				e.scrollLeft = left < 0 ? 0 : e.scrollWidth < left ? e.scrollWidth : left;
			}
		}
	};	
	
	
	leaf.getScroll = function(e)
	{
		if (e && e.style) 
		{
			return {
				top: e.scrollTop,
				left: e.scrollLeft,
				height: e.scrollHeight,
				width: e.scrollWidth
			};
		}
		return null;
	};	
	
	// FIXME: IE6 does not apply opacity on static elements if no dimension is set
	leaf.setOpacity = function(opacity)
	{
		if ((e = e && e.style) && 'number'===typeof opacity) 
		{
			opacity = opacity < 0 ? 0 : 1 < opacity ? 1 : opacity.toFixed(2);
			if (e.opacity === undefined) // use IE 'filters'
			{
				e.filter = 'alpha(opacity=' + (opacity * 100) + ')';
			}
			else 
			{
				e.opacity = opacity;
			}
		}
	};	
	
	leaf.getOpacity = function()
	{
		var s;
		if (e && (s = e.style)) 
		{
			var o = s.opacity;
			if (o === undefined) 
			{
				try 
				{
					o = e.filters.alpha.opacity / 100;
					return o;
				} 
				catch (o) 
				{
					return (o = (/opacity=(\d+)/i).exec(s.cssText)) ? o[1] / 100 : 1;
				}
			}
			return isNaN(o = parseFloat(o)) ? 1 : o;
		}
		return null;
	};	
	

	leaf.createElement = function(tagName, id, x, y, z, width, height, positionType)
	{
		if ('string' === typeof tagName) 
		{
			/* reusing var tagName */
			if ((tagName = document.createElement(tagName))) 
			{
				if ('string' === typeof id) 
				{
					tagName.id = id;
				}
				this.setArea(tagName, x, y, z, width, height, positionType);
				return tagName;
			}
		}
		return null;
	};	
	
	
	leaf.appendElement = function(e, parent)
	{
		if (e && e.style && !e.parentNode) 
		{
			((parent && parent.nodeType ? parent : document.getElementById(parent)) || document.body).appendChild(e);
		}
	};	
	/*
	leaf.insertBefore = function(e, node)
	{
		if (e && e.style && !e.parentNode && (node = this.core.get(node)) && node.parentNode) 
		{
			node.parentNode.insertBefore(e, node);
		}
	};	
	
	leaf.insertAfter = function(e, node)
	{
		var p;
		if (e && e.style && !e.parentNode && (node = this.core.get(node)) && (p = node.parentNode)) 
		{
			if ((node = this.getNext(e))) 
			{
				p.insertBefore(e, node);
			}
			else 
			{
				p.appendChild(e);
			}
		}
	};	
	
	insertAsFirst: function(e, parent)
	{
		var E = this.element;
		if (E && !E.parentNode) 
		{
			if (!(parent && parent.nodeType)) 
			{
				parent = document.getElementById(parent) || document.body;
			}
			if (parent.firstChild) 
			{
				parent.insertBefore(E, parent.firstChild);
			}
			else 
			{
				parent.appendChild(E);
			}
		}
	};	
	removeElement: function()
	{
		var E = this.element;
		if (E) 
		{
			var P = E.parentNode;
			if (P) 
			{
				P.removeChild(E);
			}
		}
	};	


	getFirst: function()
	{
		var e = this.element;
		if (e) 
		{
			e = e.firstChild;
			while (e) 
			{
				if (e.nodeType === 1) 
				{
					return e;
				}
				e = e.nextSibling;
			}
		}
		return null;
	};	
	getNext: function()
	{
		var e = this.element;
		if (e) 
		{
			while ((e = e.nextSibling)) 
			{
				if (e.nodeType === 1) 
				{
					return e;
				}
			}
		}
		return null;
	};	
	getPrevious: function()
	{
		var e = this.element;
		if (e) 
		{
			while ((e = e.previousSibling)) 
			{
				if (e.nodeType === 1) 
				{
					return e;
				}
			}
		}
		return null;
	};	
	getLast: function()
	{
		var e = this.element;
		if (e) 
		{
			e = e.lastChild;
			while (e) 
			{
				if (e.nodeType === 1) 
				{
					return e;
				}
				e = e.previousSibling;
			}
		}
		return null;
	};	
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
				if (e.nodeType === 1) 
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
	};	
	setChild: function(child)
	{
		var e = this.getChild(child);
		this.style = (this.element = e) ? e.style : null;
	};	
	setParent: function()
	{
		var e = this.getParent();
		this.style = (this.element = e) ? e.style : null;
	};	
	setFirst: function()
	{
		var e = this.getFirst();
		this.style = (this.element = e) ? e.style : null;
	};	
	setPrevious: function()
	{
		var e = this.getPrevious();
		this.style = (this.element = e) ? e.style : null;
	};	
	setNext: function()
	{
		var e = this.getNext();
		this.style = (this.element = e) ? e.style : null;
	};	
	setLast: function()
	{
		var e = this.getLast();
		this.style = (this.element = e) ? e.style : null;
	};	
	getChild: function(child)
	{
		var E = this.element;
		return E.childNodes[child] || (child = this.core.get(child)) && E === child.parentNode && child || null;
	};	
	appendChild: function(childNode)
	{
		var E = this.element;
		if (E && childNode && 'number' === typeof childNode.nodeType && !childNode.parentNode) 
		{
			E.appendChild(childNode);
		}
	};	
	appendChildren: function(childNodes)
	{
		var E = this.element;
		var l;
		if (E && childNodes && (l = childNodes.length)) 
		{
			var i = 0;
			var k;
			while (i < l) 
			{
				if (!(k = childNodes[i++]).parentNode && 'number' === typeof k.nodeType) 
				{
					E.appendChild(k);
				}
			}
		}
	};	
	removeChild: function(child)
	{
		var E = this.element;
		if (E && (child = this.getChild(child))) 
		{
			E.removeChild(child);
		}
	};	
	removeChildren: function()
	{
		var E = this.element;
		if (E) 
		{
			var $ = E.childNodes;
			var i = $.length;
			var k;
			while (i--) 
			{
				E.removeChild($[i]);
			}
		}
	};	
	purgeChild: function(child)
	{
		if ((child = this.getChild(child))) 
		{
			this.purgeDOM(child);
			this.removeChild(child);
		}
	};	
	purgeChildren: function()
	{
		var E = this.element;
		if (E) 
		{
			// local purge function for best performance
			var P = function(o)
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
						P(o[$]);
					}
				}
			};
			var $ = E.childNodes;
			var i = $.length;
			var k;
			while (i--) 
			{
				if ((k = $[i]).nodeType === 1) 
				{
					P(k);
				}
				E.remove(k);
			}
		}
	};	
	cloneChild: function(child, cloneAttrAndChilds)
	{
		return (child = this.getChild(child)) ? child.cloneNode(!!cloneAttrAndChilds) : null;
	};	
	
	hasCollision: function(collisorElement)
	{
		var e = this.element;
		var o;
		if ((o = e) && collisorElement) 
		{
			var B = document.body;
			var eX = 0;
			var eY = 0;
			while (o !== B) 
			{
				eX += o.offsetLeft;
				eY += o.offsetTop;
				o = o.parentNode;
			}
			var cX = 0;
			var cY = 0;
			o = collisorElement;
			while (o !== B) 
			{
				cX += o.offsetLeft;
				cY += o.offsetTop;
				o = o.parentNode;
			}
			if (!(eX < cX - e.offsetWidth || cX + collisorElement.offsetWidth < eX)) 
			{
				return !(eY < cY - e.offsetHeight || cY + collisorElement.offsetHeight < eY);
			}
		}
		return false;
	};	
	setAttribute: function(attribute, value)
	{
		var E = this.element;
		if (E && value !== undefined) 
		{
			if ('string' === typeof attribute) 
			{
				if ('style' === attribute && E.style.cssText !== undefined) 
				{
					E.style.cssText = value;
				}
				else 
				{
					E.setAttribute(attribute, value);
				}
			}
			else 
			{
				if ('number' === typeof attribute) 
				{
					if ('object' === typeof E.attributes[attribute]) 
					{
						E.attributes[attribute].nodeValue = value;
					}
					else 
					{
						E.attributes[attribute] = value;
					}
				}
			}
		}
	};	
	getAttribute= function(attribute)
	{
		var o = this.element;
		if (o && (o = o[attribute] || o.getAttribute(attribute) || o.attributes[attribute])) 
		{
			if ('style' === attribute && o.cssText !== undefined) 
			{
				return o.cssText.toLowerCase();
			}
			if ('object' === typeof o) 
			{
				return o.nodeValue || '';
			}
		}
		if ('string' === typeof o) 
		{
			return o;
		}
		return null;
	};
	
	*/
