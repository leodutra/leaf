	
	/*  LEAF JavaScript Library
	 *  Leonardo Dutra
	 *  v0.7.XXXXXXa
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
	 *      * Neither the name of Leonardo Dutra nor the names of LEAF and its
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
	 *     .DOM        (its core is a object that wraps private vars and common functions, making then public for possible extensions)
	 *     .DOMElement (handles only elements, a box you put some element inside and mod using DOM)
	 */
	
	// check LEAF "namespace"
	if (!window.leaf) 
	{
		window.leaf = {};
	}
	
	
/// ARRAY

	leaf.Array = {
		each: function(array, itemHandler)
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
		}
	};


/// OBJECT

	leaf.Object = {
		extend: function(object, sourceObject, noOverride)
		{
			if (object && sourceObject) 
			{
				noOverride = !noOverride;
				for (var n in sourceObject) 
				{
					if (object[n] === undefined || noOverride) 
					{
						object[n] = sourceObject[n];
					}
				}
			}
		}
	};
	
	
/// WINDOW

	leaf.Window = {
		addEvent: function(type, handlerFn) {
			leaf.DOM.core.addEvent(window, type, handlerFn);
		},
		removeEvent: function(type, handlerFn) {
			leaf.DOM.core.removeEvent(window, type, handlerFn);
		},
		dispatchEvent: function(type) {
			leaf.DOM.core.addEvent(window, type);
		}
	};
	
	
/// DOCUMENT

	leaf.Document = {
		addEvent: function(type, handlerFn) {
			leaf.DOM.core.addEvent(document, type, handlerFn);
		},
		removeEvent: function(type, handlerFn) {
			leaf.DOM.core.removeEvent(document, type, handlerFn);
		},
		dispatchEvent: function(type) {
			leaf.DOM.core.addEvent(document, type);
		}
	};



/// AJAX

	leaf.Ajax = {
		createRequester: function()
		{
			if (window.XMLHttpRequest) 
			{
				return new window.XMLHttpRequest();
			}
			
			// if no return, is IE like
			var c; // cache
			if ((c = window.ActiveXObject)) 
			{
				var V = this.core.requesterActiveXs; // array of ActiveX versions
				var i = V.length;
				var o;
				while (i--) // optimum JavaScript iterator
 				{
					try // try catch allow iteration thru versions
 					{
						o = new c(V[i]);
						return o;
					} 
					catch (o) 
					{
					}
				}
			}
			return null;
		},
		
		listRequesterActiveX: function()
		{
			// return array with versions for requester creation (ascending)
			return this.core.requesterActiveXs;
		},
		
		core: {
			// used in descending iteration
			requesterActiveXs: [
				'Microsoft.XMLHTTP',
				'MSXML2.XMLHTTP',
				'MSXML2.XMLHTTP.3.0',
				'MSXML2.XMLHTTP.4.0',
				'MSXML2.XMLHTTP.5.0',
				'MSXML2.XMLHTTP.6.0'
			]
		}
	};
	

/// MOUSE

	leaf.Mouse = {
		getPosition: function(mouseEvent)
		{
			if ('object' === typeof(mouseEvent = mouseEvent || event)) 
			{
				// pageX/Y is the best case on most browsers, but not W3Clike yet
				if ('number' === typeof mouseEvent.pageY) 
				{
					return {
						x: mouseEvent.pageX,
						y: mouseEvent.pageY
					};
				}
				var H = document.documentElement;
				var B = document.body;
				if (B) // needed sometimes depending on browser and version since body can have a 1px rounder
				{
					return {
						// clientLeft/Top IE adjust
						x: mouseEvent.clientX + (H.scrollLeft || B.scrollLeft) - (H.clientLeft || 0),
						y: mouseEvent.clientY + (H.scrollTop  || B.scrollTop)  - (H.clientTop  || 0)
					};
				}
				return {
					// clientLeft/Top IE adjust
					x: mouseEvent.clientX + H.scrollLeft - (H.clientLeft || 0),
					y: mouseEvent.clientY + H.scrollTop  - (H.clientTop  || 0)
				};
			}
			return null;
		}
	};


/// DOM

	leaf.DOM = {
		getById: function(ids)
		{
			if (ids instanceof Array) 
			{
				var D = document;
				var L = ids.length;
				var n = 0;
				var i = 0;
				var K = [];
				var o;
				while (i < L) 
				{
					if ((o = D.getElementById(ids[i++]))) 
					{
						K[n++] = o;
					}
				}
				return n ? K : null; // null if no match
			}
			return document.getElementById(ids); // null if no match
		},
		
		// TODO: study optimization
		getByTag: function(tagNames, rootNode)
		{
			rootNode = this.core.getElement(rootNode) || document;
			if (tagNames instanceof Array) 
			{
				var L = tagNames.length;
				var n = 0;
				var i = 0;
				var j = 0;
				var K = [];
				var l;
				var o;
				while (i < L) 
				{
					l = (o = rootNode.getElementsByTagName(tagNames[i++])).length;
					while (j < l) 
					{
						K[n++] = o[j++];
					}
					j = 0;
				}
				return n ? K : null; // null if no match
			}
			return rootNode.getElementsByTagName(tagNames);
		},
		
		// TODO: benchmark
		getByClass: function(classNames, rootNode)
		{
			if ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array && classNames.length) 
			{
				var R = new RegExp('\\b(?:' + classNames.join('\|') + ')\\b');
				var K = [];
				var n = 0;
				
				// depth search
				var Q = function(o)
				{
					if (o.nodeType === 1 && R.test(o.className)) 
					{
						K[n++] = o;
					}
					if ((o = o.childNodes)) 
					{
						var L = o.length;
						var i = 0;
						while (i < L) 
						{
							Q(o[i++]);
						}
					}
				};
				Q(this.core.getElement(rootNode) || document);
				
				// null if no match
				if (n) 
				{
					return K;
				}
			}
			return null;
		},
		
		purgeDOM: function(domObj)
		{
			// base code: www.crockford.com
			if (domObj) 
			{
				var a = domObj.attributes;
				if (a) 
				{
					var i = a.length;
					var n;
					while (i--) 
					{
						if ('function' === typeof domObj[(n = a[i].name)]) 
						{
							domObj[n] = null;
						}
					}
				}
				if ((domObj = domObj.childNodes)) 
				{
					var o = this; // private is faster than this
					a = domObj.length;
					while (a--) 
					{
						o.purgeDOM(domObj[a]);
					}
				}
			}
		},
		
		core: {
			
			addEvent: function(o, t, f)
			{
				if (o && 'string' === typeof t && 'function' === typeof f) 
				{
					// uses hash name to fix IE problems
					// base code by John Resig of JQuery (Event Contest - www.quirksmode.com)
					if (o.addEventListener) 
					{
						o.addEventListener(t, f, false);
					}
					else 
					{
						if (o.attachEvent) 
						{
							var h = t + f;
							o['e' + h] = f;
							o.attachEvent('on' + t, (o[h] = function()
							{
								o['e' + h](event);
							}));
						}
					}
				}
			},
			
			removeEvent: function(o, t, f)
			{
				if (o && 'string' === typeof t && 'function' === typeof f) 
				{
					// uses hash name to fix IE problems
					// base code by John Resig of JQuery, (Event Contest - www.quirksmode.com)
					if (o.removeEventListener) 
					{
						o.removeEventListener(t, f, false);
					}
					else 
					{
						if (o.detachEvent) 
						{
							o.detachEvent('on' + t, o[(t = t + f)]);
							o[t] = null;
							o['e' + t] = null;
						}
					}
				}
			},
			
			dispatchEvent: function(o, t)
			{
				var D = document;
				if (o && 'string' === typeof t) 
				{
					if (o.dispatchEvent) 
					{
						// dispatch for firefox and others
						var e = D.createEvent('HTMLEvents');
						e.initEvent(t, true, true); // event type, bubbling, cancelable
						o.dispatchEvent(e);
					}
					else 
					{
						if (D.createEventObject) 
						{
							// dispatch for IE
							o.fireEvent('on' + t, D.createEventObject());
						}
					}
				}
			},
			
			getElement: function (e)
			{
				return e ? e.style ? e : document.getElementById(e) : null;
			}
		}
	};


/// DOMELEMENT

	leaf.DOMElement = function(element) {
		if (this instanceof leaf.DOMElement) {
			this.DOMElement(element);
		}
	};
	
	leaf.DOMElement.prototype = {
		
		// internal vars
        element: null,
        style:   null,
        core:    null, // used later on code
        
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
        
        getStyle: function()
        {
			return this.style;
        },
	

	/// CLASSES
		
		// TODO: benchmark
		addClass: function(classNames)
		{
			var e = this.element;
			if (e && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) 
			{
				var c = e.className;
				if ('string' === typeof c) 
				{
					var R = new RegExp('\\b' + c.replace(/(?:^\s+|\s+$)/g, '').replace(/\s+/g, '\|') + '\\b');
					var L = classNames.length;
					var k = [];
					var n = 0;
					var i = 0;
					while (i < L) 
					{
						// test avoids residual className problem
						if (R.test((c = classNames[i++]))) 
						{
							continue;
						}
						k[n++] = c;
					}
					e.className += ' ' + k.join(' ').replace(/\s{2,}/g, ' ');
				}
			}
		},
		
		removeClass: function(classNames)
		{
			var e = this.element;
			if (e && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) 
			{
				var C = e.className;
				if ('string' === typeof C) 
				{
					e.className = C.replace(new RegExp('\\b(?:' + classNames.join('\|') + ')\\b', 'g'), '');
				}
			}
		},
		
		
	/// POSITION	
	
		setPosition: function(x, y, z, type)
		{
			var s = this.style;
			if (s) 
			{
				s.position = 'string' === typeof type ? type : s.position || 'absolute';
				
				if ('number' === typeof x) 
				{
					if (s.right) 
					{
						s.left = '';
						s.right = x + 'px';
					}
					else 
					{
						s.left = x + 'px';
						s.right = '';
					}
				}
				else 
				{
					if ('string' === typeof x) 
					{
						if (s.right) 
						{
							s.left = '';
							s.right = x;
						}
						else 
						{
							s.left = x;
							s.right = '';
						}
					}
				}
				if ('number' === typeof y) 
				{
					if (s.bottom) 
					{
						s.top = '';
						s.bottom = y + 'px';
					}
					else 
					{
						s.top = y + 'px';
						s.bottom = '';
					}
				}
				else 
				{
					if ('string' === typeof y) 
					{
						if (s.bottom) 
						{
							s.top = '';
							s.bottom = y;
						}
						else 
						{
							s.top = y;
							s.bottom = '';
						}
					}
				}
				if ('number' === typeof z) 
				{
					s.zIndex = parseInt(z, 10);
				}
			}
		},
	
		getPosition: function(keepUnits)
		{
			var s = this.style;
			if (s) 
			{
				if (keepUnits) 
				{
					return {
						x: s.left || s.right,
						y: s.top  || s.bottom,
						z: s.zIndex,
						position: s.position
					};
				}
				else 
				{
					return {
						x: parseFloat(s.left || s.right)  || 0,
						y: parseFloat(s.top  || s.bottom) || 0,
						z: s.zIndex,
						position: s.position
					};
				}
			}
			return null;
		},
	
		getOffset: function()
		{
			var E = this.element;
			if (E) 
			{
				return {
					x: E.offsetLeft,
					y: E.offsetTop,
					width: E.offsetWidth,
					height: E.offsetHeight,
					parent: E.offsetParent
				};
			}
			return null;
		},
	
		invertXYAxis: function(x, y)
		{
			var s = this.style;
			if (s) 
			{
				if (x) 
				{
					if (s.right) 
					{
						s.left = s.right;
						s.right = '';
					}
					else 
					{
						s.right = s.left;
						s.left = '';
					}
				}
				if (y) 
				{
					if (s.bottom) 
					{
						s.top = s.bottom;
						s.bottom = '';
					}
					else 
					{
						s.bottom = s.top;
						s.top = '';
					}
				}
			}
		},
	
		
	/// SIZE
	
		setSize: function(width, height)
		{
			var s = this.style;
			if (s) 
			{
				if ('number' === typeof width) 
				{
					s.width = width + 'px';
				}
				else 
				{
					if ('string' === typeof width) 
					{
						s.width = width;
					}
				}
				if ('number' === typeof height) 
				{
					s.height = height + 'px';
				}
				else 
				{
					if ('string' === typeof height) 
					{
						s.height = height;
					}
				}
			}
		},
	
		getSize: function(keepUnits)
		{
			var s = this.style;
			if (s) 
			{
				if (keepUnits) 
				{
					return {
						width:  s.width,
						height: s.height
					};
				}
				else 
				{
					return {
						width:  parseFloat(s.width)  || 0,
						height: parseFloat(s.height) || 0
					};
				}
			}
			return null;
		},	
	

	/// AREA
	
		setArea: function(width, height, x, y, z, positionType)
		{
			this.setSize(width, height);
			this.setPosition(x, y, z, positionType);
		},
		
		getArea: function(keepUnits)
		{
			var s = this.style;
			if (s) 
			{
				if (keepUnits) 
				{
					return {
						x: s.left || s.right,
						y: s.top  || s.bottom,
						z: s.zIndex,
						width: s.width,
						height: s.height,
						position: s.position
					};
				}
				else 
				{
					return {
						x: parseFloat(s.left || s.right) || 0,
						y: parseFloat(s.top  || s.bottom) || 0,
						z: s.zIndex,
						width:  parseFloat(s.width)  || 0,
						height: parseFloat(s.height) || 0,
						position: s.position
					};
				}
			}
			return null;
		},
		
	
	/// CONTENT
	
		setContent: function(value)
		{
			/* FIXME: IE6 dont allow changes to innerHTML when element was not appended yet */
			var E = this.element;
			if (E && !(value === null && value === undefined)) 
			{
				E.innerHTML = value;
			}
		},
		
		getContent: function()
		{
			var E = this.element;
			return E && E.innerHTML || null;
		},
		
		addContent: function(value)
		{
			/* FIXME: IE6 dont allow changes to innerHTML when element was not appended yet */
			var E = this.element;
			if (E && !(value === null && value === undefined)) 
			{
				E.innerHTML += String(value);
			}
		},
		
	
	/// BACKGROUND
	
		setBackground: function(color, src, x, y, repeat)
		{
			var s = this.style;
			if (s) 
			{
				if ('string' === typeof color) 
				{
					s.backgroundColor = color;
				}
				
				if ('string' === typeof src) 
				{
					s.backgroundImage = 'url(\'' + src + '\')';
				}
				
				src = s.backgroundPosition.split(' '); // outside of logical sequence
				s.backgroundPosition = ('number' === typeof x ? x + 'px' : 'string' === typeof x ? x : (src[0] || '50%')) + ' ' +
				('number' === typeof y ? y + 'px' : 'string' === typeof y ? y : (src[1] || '50%'));
				
				s.backgroundRepeat = repeat ? repeat : 'no-repeat';
			}
		},
		
		getBackground: function(keepUnits)
		{
			var s = this.style;
			if (s) 
			{
				var P = s.backgroundPosition.split(' ');
				if (keepUnits) 
				{
					return {
						x: P[0] || '',
						y: P[1] || '',
						color: s.backgroundColor,
						src: s.backgroundImage,
						repeat: s.backgroundRepeat
					};
				}
				else 
				{
					return {
						x: parseFloat(P[0]) || 0,
						y: parseFloat(P[1]) || 0,
						color: s.backgroundColor,
						src: s.backgroundImage,
						repeat: s.backgroundRepeat
					};
				}
			}
			return null;
		},

	
	/// FONT
	
		setFont: function(color, size, family, weight, style, spacing, lineHeight, useSmallCaps)
		{
			var s = this.style;
			if (s)  
			{
				if ('string' === typeof color) 
				{
					s.color = color;
				}
				if ('string' === typeof family) 
				{
					s.fontFamily = family;
				}
				if ('string' === typeof style) 
				{
					s.fontStyle = style;
				}
				if ('string' === typeof weight || 'number' === typeof weight) 
				{
					s.fontWeight = weight;
				}
				if ('number' === typeof size) 
				{
					s.fontSize = size + 'pt';
				}
				else 
				{
					if ('string' === typeof size) 
					{
						s.fontSize = size;
					}
				}
				if ('number' === typeof spacing) 
				{
					s.letterSpacing = spacing + 'px';
				}
				else 
				{
					if ('string' === typeof spacing) 
					{
						s.letterSpacing = spacing;
					}
				}
				if ('number' === typeof lineHeight) 
				{
					s.lineHeight = lineHeight + 'px';
				}
				else 
				{
					if ('string' === typeof lineHeight) 
					{
						s.lineHeight = lineHeight;
					}
				}
				if (useSmallCaps !== null && useSmallCaps !== undefined) 
				{
					s.fontVariant = useSmallCaps ? 'small-caps' : 'normal';
				}
			}
		},	
		
		getFont: function(keepUnits)
		{
			var s = this.style;
			if (s)  
			{
				if (keepUnits) 
				{
					return {
						color: s.color,
						size: s.fontSize,
						family: s.fontFamily,
						weight: s.fontWeight,
						style: s.fontStyle,
						spacing: s.letterSpacing,
						lineHeight: s.lineHeight,
						variant: s.fontVariant
					};
				}
				else 
				{
					return {
						color: s.color,
						size: parseFloat(s.fontSize) || 0,
						family: s.fontFamily,
						weight: s.fontWeight,
						style: s.fontStyle,
						spacing: parseFloat(s.letterSpacing) || 0,
						lineHeight: parseFloat(s.lineHeight) || 0,
						variant: s.fontVariant
					};
				}
				
			}
			return null;
		},
		
	
	/// BORDER
	
		setBorder: function(color, width, style)
		{
			var s = this.style;
			if (s) 
			{
				if ('string' === typeof color) 
				{
					s.borderColor = color;
				}
				if ('number' === typeof width) 
				{
					s.borderWidth = width + 'px';
				}
				else 
				{
					if ('string' === typeof width) 
					{
						s.borderWidth = width;
					}
				}
				s.borderStyle = 'string' === typeof style ? style : s.borderStyle || 'solid';
			}
		},
		
		getBorder: function(keepUnits)
		{
			var s = this.style;
			if (s) 
			{
				return {
					color: s.borderColor,
					width: keepUnits ? s.borderWidth : parseFloat(s.borderWidth),
					style: s.borderStyle
				};
			}
			return null;
		},
	

/// PADDING

	setPadding: function(e, top, right, bottom, left)
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
	},	
		
	getPadding: function(e, keepUnits)
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
	},	
	

/// MARGIN

	setMargin: function(e, top, right, bottom, left)
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
	},	
	
	getMargin: function(e, keepUnits)
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
	},
	

/// TEXT

	setText: function(e, align, decoration, wordSpacing, whiteSpace, indent, transform)
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
	},	
	
	getText: function(e, keepUnits)
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
	},	


/// SCROLL

	setScroll: function(e, top, left)
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
	},	
	
	
	getScroll: function(e)
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
	},


/// OPACITY

	// FIXME: IE6 does not apply opacity on static elements if no dimension is set
	setOpacity: function(e, opacity)
	{
		if ((e = e && e.style) && 'number'===typeof opacity) 
		{
			opacity = opacity < 0 ? 0 : 1 < opacity ? 1 : opacity.toFixed(2);
			if (e.opacity === undefined)
			{
				// use IE filter
				e.filter = 'alpha(opacity=' + (opacity * 100) + ')';
			}
			else 
			{
				e.opacity = opacity;
			}
		}
	},	
	
	getOpacity: function(e)
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
	},	
	

/// NODE

	createElement: function(tagName, id, width, height, x, y, z, positionType)
	{
		if ('string' === typeof tagName) 
		{
			// reuse tagName
			if ((tagName = document.createElement(tagName))) 
			{
				if ('string' === typeof id) 
				{
					tagName.id = id;
				}
				this.setArea(tagName, width, height, x, y, z, positionType);
				return tagName;
			}
		}
		return null;
	},
	
	append: function(e, parent)
	{
		if (e && e.nodeType && !e.parentNode) 
		{
			((parent && parent.nodeType ? parent : document.getElementById(parent)) || document.body).appendChild(e);
		}
	},
	
	insertBefore: function(e, node)
	{
		if (e && e.style && !e.parentNode && (node = this.core.get(node)) && node.parentNode) 
		{
			node.parentNode.insertBefore(e, node);
		}
	},
	
	insertAfter: function(e, node)
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
	},
	
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
	},
	
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
	},

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
	},
	
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
	},
	
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
	},
	
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
	},
	
	getChildElements: function()
	{
		var e = this.element;
		if (e) 
		{
			var k = [];
			var n = 0;
			e = e.firstChild; // cannot be inside while question
			while (e) 
			{
				if (e.nodeType === 1) 
				{
					k[n++] = e;
				}
				e = e.nextSibling;
			}
			if (n) 
			{
				return k;
			}
		}
		return null;
	},
	
	setChild: function(child)
	{
		var e = this.getChild(child);
		this.style = (this.element = e) ? e.style : null;
	},
	
	setParent: function()
	{
		var e = this.getParent();
		this.style = (this.element = e) ? e.style : null;
	},
	
	setFirst: function()
	{
		var e = this.getFirst();
		this.style = (this.element = e) ? e.style : null;
	},
	
	setPrevious: function()
	{
		var e = this.getPrevious();
		this.style = (this.element = e) ? e.style : null;
	},
		
	setNext: function()
	{
		var e = this.getNext();
		this.style = (this.element = e) ? e.style : null;
	},
		
	setLast: function()
	{
		var e = this.getLast();
		this.style = (this.element = e) ? e.style : null;
	},
	
	getChild: function(child)
	{
		var E = this.element;
		return E.childNodes[child] || (child = this.core.get(child)) && E === child.parentNode && child || null;
	},
	
	appendChild: function(childNode)
	{
		var E = this.element;
		if (E && childNode && 'number' === typeof childNode.nodeType && !childNode.parentNode) 
		{
			E.appendChild(childNode);
		}
	},
	
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
	},
	
	removeChild: function(child)
	{
		var E = this.element;
		if (E && (child = this.getChild(child))) 
		{
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
			while (i--) 
			{
				E.removeChild($[i]);
			}
		}
	},
	
	purgeChild: function(child)
	{
		if ((child = this.getChild(child))) 
		{
			this.purgeDOM(child);
			this.removeChild(child);
		}
	},
	
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
	},
		
	cloneChild: function(child, cloneAttrAndChilds)
	{
		return (child = this.getChild(child)) ? child.cloneNode(!!cloneAttrAndChilds) : null;
	},
	
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
	},

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
	},
	
	getAttribute: function(attribute)
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
	}
};

(function() {

	if (document.createElement('div').style.cssText === undefined) 
	{
	
		leaf.DOMElement.prototype.setCSS = function(cssObj)
		{
			var e = this.element;
			if (e && cssObj instanceof Object) 
			{
				var k = [];
				var n = 0;
				var c;
				for (c in cssObj) 
				{
					k[n++] = c + ': ' + cssObj[c] + '\; ';
				}
				e.setAttribute('style', (e.getAttribute('style') || '') + k.join(''));
			}
		};
		
		leaf.getCSS = function(property)
		{
			var o = this.element;
			if (o && 'string' === typeof property && (o = o.getAttribute('style'))) 
			{
				/* RegExp does not 'compile' on AIR 1.0
				 * This code is a little more faster than using pure RegExp
				 */
				if (-1 < (i = o.search(new RegExp('(?:\\\;|\\s|^)' + property + '\\\:', 'i')))) 
				{
					return o.substring((i = o.indexOf(':', i) + 2), (i = o.indexOf('\;', i)) === -1 ? o.length : i);
				}
			}
			return null;
		};
	}
	else
	{
	
		leaf.setCSS = function(cssObj)
		{
			var s = this.style;
			if (s && cssObj instanceof Object) 
			{
				var k = [];
				var n = 0;
				var c;
				for (c in cssObj) 
				{
					k[n++] = c + ': ' + cssObj[c] + '\; ';
				}
				s.cssText = (((c = s.cssText) && (c.charAt(c.length - 1) === '\;' ? c : c + '; ')) || '') + k.join('');
			}
		};
		
		leaf.getCSS = function(property)
		{
			var s = this.style;
			if (s && 'string' === typeof property && (s = s.cssText)) 
			{
				/* RegExp does not 'compile' on AIR 1.0
				 * This code is a little more faster than using pure RegExp
				 */
				if (-1 < (i = s.search(new RegExp('(?:\\\;|\\s|^)' + property + '\\\:', 'i')))) 
				{
					return s.substring((i = s.indexOf(':', i) + 2), (i = s.indexOf('\;', i)) === -1 ? s.length : i);
				}
			}
			return null;
		};
	}
})();
