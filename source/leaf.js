	
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
			if (array && !(array instanceof String) && 'function' === typeof itemHandler) 
			{
				var l = array.length;
				var i = 0;
				var k;
				while (i < l) 
				{
					if ((k = array[i])) 
					{
						itemHandler.call(array, k, i++);
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
	
		addListener: function(type, handlerFn)
		{
			leaf.DOM.core.addListener(window, type, handlerFn);
		},
		removeListener: function(type, handlerFn)
		{
			leaf.DOM.core.removeListener(window, type, handlerFn);
		},
		dispatchEvent: function(type)
		{
			leaf.DOM.core.addListener(window, type);
		}
	};
	
	
	/// DOCUMENT
	
	leaf.Document = {
		
		addListener: function(type, handlerFn)
		{
			leaf.DOM.core.addListener(document, type, handlerFn);
		},
		removeListener: function(type, handlerFn)
		{
			leaf.DOM.core.removeListener(document, type, handlerFn);
		},
		dispatchEvent: function(type)
		{
			leaf.DOM.core.addListener(document, type);
		}
	};
	
	
	/// AJAX
	
	leaf.Ajax = {
		
		createRequester: function()
		{
			if (window.XMLHttpRequest) 
			{
				return new XMLHttpRequest();
			}
			
			// if no return, is IE like
			var A = window.ActiveXObject; // cache
			if (A) 
			{
				var V = this.core.requesterActiveXs; // array of ActiveX versions
				var i = V.length;
				var o;
				while (i--) // optimum JavaScript iterator
	 			{
					try // try catch allow iteration thru versions
	 				{
						o = new A(V[i]);
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
						y: mouseEvent.clientY + (H.scrollTop || B.scrollTop) - (H.clientTop || 0)
					};
				}
				return {
					// clientLeft/Top IE adjust
					x: mouseEvent.clientX + H.scrollLeft - (H.clientLeft || 0),
					y: mouseEvent.clientY + H.scrollTop - (H.clientTop || 0)
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
				var R = new RegExp('(?:\\s|^)(?:' + classNames.join('\|') + ')(?:\\s|$)');
				var K = [];
				var n = 0;
				
				// depth search
				var q = function(o)
				{
					if (o.style && R.test(o.className)) 
					{
						K[n++] = o;
					}
					if ((o = o.childNodes)) 
					{
						var L = o.length;
						var i = 0;
						while (i < L) 
						{
							q(o[i++]);
						}
					}
				};
				q(this.core.getElement(rootNode) || document);
				
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
			if (domObj) 
			{
				this.core.purgeDOM(domObj);
				if (domObj.parentNode) {
					domObj.parentNode.removeChild(domObj);
				}
			}
		},
		
		core: {
		
			addListener: function(o, t, f)
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
			
			removeListener: function(o, t, f)
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
				if (o && 'string' === typeof t) 
				{
					if (o.dispatchEvent) 
					{
						// dispatch for firefox and others
						var e = document.createEvent('HTMLEvents');
						e.initEvent(t, true, true); // event type, bubbling, cancelable
						o.dispatchEvent(e);
					}
					else 
					{
						if (document.createEventObject) 
						{
							// dispatch for IE
							o.fireEvent('on' + t, document.createEventObject());
						}
					}
				}
			},
			
			// TODO: verify if arguments.callee leaks. If leaks, review all purge use
			purgeDOM:  function(o)
			{
				// base code: www.crockford.com
				var a = o.attributes;
				if (a) 
				{
					var i = a.length;
					var n;
					while (i--) 
					{
						if ('function' === typeof o[(n = a[i].name)]) 
						{
							o[n] = null;
						}
					}
				}
				if ((o = o.childNodes)) 
				{
					var p = arguments.callee; // does it leaks ? 
					a = o.length;
					while (a--) 
					{
						p(o[a]);
					}
				}
			},
			
			getElement: function(e)
			{
				return e ? e.style ? e : document.getElementById(e) : null;
			}
		}
	};
	
	
	/// DOMELEMENT
	
	leaf.DOMElement = function(element)
	{
		if (this instanceof leaf.DOMElement) 
		{
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
		
		
		/// EVENT
		
		addListener: function(type, handlerFn)
		{
			this.core.addListener(this.element, type, handlerFn);
		},
		
		removeListener: function(type, handlerFn)
		{
			this.core.removeListener(this.element, type, handlerFn);
		},
		
		dispatchEvent: function(type)
		{
			this.core.dispatchEvent(this.element, type);
		},
		
		setCSS: function(cssObj)
		{
			var E = this.element;
			if (E && cssObj instanceof Object) 
			{
				var S = E.style;
				var K = [];
				var n = 0;
				var c;
				for (c in cssObj) 
				{
					K[n++] = c + ': ' + cssObj[c] + '\; ';
				}
				if (S.cssText === undefined) 
				{
					E.setAttribute('style', (E.getAttribute('style') || '') + K.join(''));
				}
				else 
				{
					S.cssText = ((c = S.cssText) && (c.charAt(c.length - 1) === '\;' ? c : c + '; ') || '') + K.join('');
				}
			}
		},
		
		getCSS: function(property)
		{
			if ('string' === typeof property) 
			{
				var o = this.element;
				if (o) 
				{
					if ((o = o.style.cssText === undefined ? o.getAttribute('style') : o.style.cssText)) 
					{
						/* RegExp does not 'compile' on AIR 1.0
						 * This code is a little more faster than using pure RegExp
						 */
						if (-1 < (i = o.search(new RegExp('(?:\\\;|\\s|^)' + property + '\\\:', 'i')))) 
						{
							return o.substring((i = o.indexOf(':', i) + 2), (i = o.indexOf('\;', i)) === -1 ? o.length : i);
						}
						
					}
				}
			}
			return null;
		},
		
		
		/// CLASS
		
		// TODO: benchmark
		addClass: function(classNames)
		{
			var E = this.element;
			if (E && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) 
			{
				var c = E.className;
				if ('string' === typeof c) 
				{
					var R = new RegExp('(?:\\s|^)' + k.replace(/(?:^\s+|\s+$)/g, '').replace(/\s+/g, '\|') + '(?:\\s|$)');
					var L = classNames.length;
					var K = [];
					var n = 0;
					var i = 0;
					while (i < L) 
					{
						// test avoids residual className problem
						if (R.test((c = classNames[i++]))) 
						{
							continue;
						}
						K[n++] = c;
					}
					E.className += ' ' + K.join(' ');
				}
			}
		},
		
		removeClass: function(classNames)
		{
			var E = this.element;
			if (E && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) 
			{
				var C = E.className;
				if ('string' === typeof C) 
				{
					E.className = C.replace(new RegExp('(?:\\s+|^)(?:' + classNames.join('\|') + ')(?:\\s+|$)', 'gi'), ' ');
				}
			}
		},
		
		
		/// POSITION	
		
		setPosition: function(x, y, z, type)
		{
			var S = this.style;
			if (S) 
			{
				if ('string' === typeof type)
				{
					S.position = type;
				}
				
				if ('number' === typeof x) 
				{
					if (S.right) 
					{
						S.left = '';
						S.right = x + 'px';
					}
					else 
					{
						S.left = x + 'px';
						S.right = '';
					}
				}
				else 
				{
					if ('string' === typeof x) 
					{
						if (S.right) 
						{
							S.left = '';
							S.right = x;
						}
						else 
						{
							S.left = x;
							S.right = '';
						}
					}
				}
				if ('number' === typeof y) 
				{
					if (S.bottom) 
					{
						S.top = '';
						S.bottom = y + 'px';
					}
					else 
					{
						S.top = y + 'px';
						S.bottom = '';
					}
				}
				else 
				{
					if ('string' === typeof y) 
					{
						if (S.bottom) 
						{
							S.top = '';
							S.bottom = y;
						}
						else 
						{
							S.top = y;
							S.bottom = '';
						}
					}
				}
				if ('number' === typeof z) 
				{
					S.zIndex = parseInt(z, 10);
				}
			}
		},
		
		getPosition: function(keepUnits)
		{
			var S = this.style;
			if (S) 
			{
				if (keepUnits) 
				{
					return {
						x: S.left || S.right,
						y: S.top || S.bottom,
						z: S.zIndex,
						position: S.position
					};
				}
				else 
				{
					return {
						x: parseFloat(S.left || S.right) || 0,
						y: parseFloat(S.top || S.bottom) || 0,
						z: S.zIndex,
						position: S.position
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
			var S = this.style;
			if (S) 
			{
				if (x) 
				{
					if (S.right) 
					{
						S.left = S.right;
						S.right = '';
					}
					else 
					{
						S.right = S.left;
						S.left = '';
					}
				}
				if (y) 
				{
					if (S.bottom) 
					{
						S.top = S.bottom;
						S.bottom = '';
					}
					else 
					{
						S.bottom = S.top;
						S.top = '';
					}
				}
			}
		},
		
		
		/// SIZE
		
		setSize: function(width, height)
		{
			var S = this.style;
			if (S) 
			{
				if ('number' === typeof width) 
				{
					S.width = width + 'px';
				}
				else 
				{
					if ('string' === typeof width) 
					{
						S.width = width;
					}
				}
				if ('number' === typeof height) 
				{
					S.height = height + 'px';
				}
				else 
				{
					if ('string' === typeof height) 
					{
						S.height = height;
					}
				}
			}
		},
		
		getSize: function(keepUnits)
		{
			var S = this.style;
			if (S) 
			{
				if (keepUnits) 
				{
					return {
						width: S.width,
						height: S.height
					};
				}
				else 
				{
					return {
						width: parseFloat(S.width) || 0,
						height: parseFloat(S.height) || 0
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
			var S = this.style;
			if (S) 
			{
				if (keepUnits) 
				{
					return {
						x: S.left || S.right,
						y: S.top || S.bottom,
						z: S.zIndex,
						width: S.width,
						height: S.height,
						position: S.position
					};
				}
				else 
				{
					return {
						x: parseFloat(S.left || S.right) || 0,
						y: parseFloat(S.top || S.bottom) || 0,
						z: S.zIndex,
						width: parseFloat(S.width) || 0,
						height: parseFloat(S.height) || 0,
						position: S.position
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
			return E && E.innerHTML || '';
		},
		
		addContent: function(value)
		{
			/* FIXME: IE6 dont allow changes to innerHTML when element was not appended yet */
			var E = this.element;
			if (E && !(value === null && value === undefined)) 
			{
				E.innerHTML += value;
			}
		},
		
		
		/// BACKGROUND
		
		setBackground: function(color, src, x, y, repeat)
		{
			var S = this.style;
			if (S) 
			{
				if ('string' === typeof color) 
				{
					S.backgroundColor = color;
				}
				
				if ('string' === typeof src) 
				{
					S.backgroundImage = 'url(\'' + src + '\')';
				}
				
				src = S.backgroundPosition.split(' '); // keep on outside of logical sequence
				S.backgroundPosition = ('number' === typeof x ? x + 'px' : 'string' === typeof x ? x : (src[0] || '50%')) + ' ' +
				('number' === typeof y ? y + 'px' : 'string' === typeof y ? y : (src[1] || '50%'));
				
				S.backgroundRepeat = repeat ? repeat : 'no-repeat';
			}
		},
		
		getBackground: function(keepUnits)
		{
			var S = this.style;
			if (S) 
			{
				var P = S.backgroundPosition.split(' ');
				if (keepUnits) 
				{
					return {
						x: P[0] || '',
						y: P[1] || '',
						color: S.backgroundColor,
						src: S.backgroundImage,
						repeat: S.backgroundRepeat
					};
				}
				else 
				{
					return {
						x: parseFloat(P[0]) || 0,
						y: parseFloat(P[1]) || 0,
						color: S.backgroundColor,
						src: S.backgroundImage,
						repeat: S.backgroundRepeat
					};
				}
			}
			return null;
		},
		
		
		/// FONT
		
		setFont: function(color, size, family, weight, style, spacing, lineHeight, useSmallCaps)
		{
			var S = this.style;
			if (S) 
			{
				if ('string' === typeof color) 
				{
					S.color = color;
				}
				if ('string' === typeof family) 
				{
					S.fontFamily = family;
				}
				if ('string' === typeof style) 
				{
					S.fontStyle = style;
				}
				if ('string' === typeof weight || 'number' === typeof weight) 
				{
					S.fontWeight = weight;
				}
				if ('number' === typeof size) 
				{
					S.fontSize = size + 'pt';
				}
				else 
				{
					if ('string' === typeof size) 
					{
						S.fontSize = size;
					}
				}
				if ('number' === typeof spacing) 
				{
					S.letterSpacing = spacing + 'px';
				}
				else 
				{
					if ('string' === typeof spacing) 
					{
						S.letterSpacing = spacing;
					}
				}
				if ('number' === typeof lineHeight) 
				{
					S.lineHeight = lineHeight + 'px';
				}
				else 
				{
					if ('string' === typeof lineHeight) 
					{
						S.lineHeight = lineHeight;
					}
				}
				if (useSmallCaps !== null && useSmallCaps !== undefined) 
				{
					S.fontVariant = useSmallCaps ? 'small-caps' : 'normal';
				}
			}
		},
		
		getFont: function(keepUnits)
		{
			var S = this.style;
			if (S) 
			{
				if (keepUnits) 
				{
					return {
						color: S.color,
						size: S.fontSize,
						family: S.fontFamily,
						weight: S.fontWeight,
						style: S.fontStyle,
						spacing: S.letterSpacing,
						lineHeight: S.lineHeight,
						variant: S.fontVariant
					};
				}
				else 
				{
					return {
						color: S.color,
						size: parseFloat(S.fontSize) || 0,
						family: S.fontFamily,
						weight: S.fontWeight,
						style: S.fontStyle,
						spacing: parseFloat(S.letterSpacing) || 0,
						lineHeight: parseFloat(S.lineHeight) || 0,
						variant: S.fontVariant
					};
				}
				
			}
			return null;
		},
		
		
		/// BORDER
		
		setBorder: function(color, width, style)
		{
			var S = this.style;
			if (S) 
			{
				if ('string' === typeof color) 
				{
					S.borderColor = color;
				}
				if ('number' === typeof width) 
				{
					S.borderWidth = width + 'px';
				}
				else 
				{
					if ('string' === typeof width) 
					{
						S.borderWidth = width;
					}
				}
				S.borderStyle = 'string' === typeof style ? style : S.borderStyle || 'solid';
			}
		},
		
		getBorder: function(keepUnits)
		{
			var S = this.style;
			if (S) 
			{
				return {
					color: S.borderColor,
					width: keepUnits ? S.borderWidth : parseFloat(S.borderWidth),
					style: S.borderStyle
				};
			}
			return null;
		},
		
		
		/// PADDING
		
		setPadding: function(top, right, bottom, left)
		{
			var S = this.style;
			if (S) 
			{
				if ('number' === typeof top) 
				{
					S.paddingTop = top + 'px';
				}
				else 
				{
					if ('string' === typeof top) 
					{
						S.paddingTop = top;
					}
				}
				if ('number' === typeof right) 
				{
					S.paddingRight = right + 'px';
				}
				else 
				{
					if ('string' === typeof right) 
					{
						S.paddingRight = right;
					}
				}
				if ('number' === typeof bottom) 
				{
					S.paddingBottom = bottom + 'px';
				}
				else 
				{
					if ('string' === typeof bottom) 
					{
						S.paddingBottom = bottom;
					}
				}
				if ('number' === typeof left) 
				{
					S.paddingLeft = left + 'px';
				}
				else 
				{
					if ('string' === typeof left) 
					{
						S.paddingLeft = left;
					}
				}
			}
		},
		
		getPadding: function(keepUnits)
		{
			var S = this.style;
			if (S) 
			{
				if (keepUnits) 
				{
					return {
						top: S.paddingTop,
						right: S.paddingRight,
						bottom: S.paddingBottom,
						left: S.paddingLeft
					};
				}
				else 
				{
					return {
						top: parseFloat(S.paddingTop) || 0,
						right: parseFloat(S.paddingRight) || 0,
						bottom: parseFloat(S.paddingBottom) || 0,
						left: parseFloat(S.paddingLeft) || 0
					};
				}
			}
			return null;
		},
		
		
		/// MARGIN
		
		setMargin: function(top, right, bottom, left)
		{
			var S = this.style;
			if (S) 
			{
				if ('number' === typeof top) 
				{
					S.marginTop = top + 'px';
				}
				else 
				{
					if ('string' === typeof top) 
					{
						S.marginTop = top;
					}
				}
				if ('number' === typeof right) 
				{
					S.marginRight = right + 'px';
				}
				else 
				{
					if ('string' === typeof right) 
					{
						S.marginRight = right;
					}
				}
				if ('number' === typeof bottom) 
				{
					S.marginBottom = bottom + 'px';
				}
				else 
				{
					if ('string' === typeof bottom) 
					{
						S.marginBottom = bottom;
					}
				}
				if ('number' === typeof left) 
				{
					S.marginLeft = left + 'px';
				}
				else 
				{
					if ('string' === typeof left) 
					{
						S.marginLeft = left;
					}
				}
			}
		},
		
		getMargin: function(keepUnits)
		{
			var S = this.style;
			if (S) 
			{
				if (keepUnits) 
				{
					return {
						top: S.marginTop,
						right: S.marginRight,
						bottom: S.marginBottom,
						left: S.marginLeft
					};
				}
				else 
				{
					return {
						top: parseFloat(S.marginTop) || 0,
						right: parseFloat(S.marginRight) || 0,
						bottom: parseFloat(S.marginBottom) || 0,
						left: parseFloat(S.marginLeft) || 0
					};
				}
			}
			return null;
		},
		
		
		/// TEXT
		
		setText: function(align, decoration, wordSpacing, whiteSpace, indent, transform)
		{
			var S = this.style;
			if (S) 
			{
				if ('string' === typeof align) 
				{
					S.textAlign = align;
				}
				if ('string' === typeof decoration) 
				{
					S.textDecoration = decoration;
				}
				if ('string' === typeof whiteSpace) 
				{
					S.whiteSpace = whiteSpace;
				}
				if ('string' === typeof transform) 
				{
					S.textTransform = transform;
				}
				if ('number' === typeof indent) 
				{
					S.textIndent = indent + 'px';
				}
				else 
				{
					if ('string' === typeof indent) 
					{
						S.textIndent = indent;
					}
				}
				if ('number' === typeof wordSpacing) 
				{
					S.wordSpacing = wordSpacing + 'px';
				}
				else 
				{
					if ('string' === typeof wordSpacing) 
					{
						S.wordSpacing = wordSpacing;
					}
				}
			}
		},
		
		getText: function(keepUnits)
		{
			var S = this.style;
			if (S) 
			{
				if (keepUnits) 
				{
					return {
						align: S.textAlign,
						decoration: S.textDecoration,
						wordSpacing: S.wordSpacing,
						whiteSpace: S.whiteSpace,
						indent: S.textIndent,
						transform: S.textTransform
					};
				}
				else 
				{
					return {
						align: S.textAlign,
						decoration: S.textDecoration,
						wordSpacing: parseFloat(S.wordSpacing) || 0,
						whiteSpace: S.whiteSpace,
						indent: parseFloat(S.textIndent) || 0,
						transform: S.textTransform
					};
				}
			}
			return null;
		},
		
		
		/// SCROLL
		
		setScroll: function(top, left)
		{
			var E = this.element;
			if (E) 
			{
				if ('number' === typeof top) 
				{
					E.scrollTop = top < 0 ? 0 : E.scrollHeight < top ? E.scrollHeight : top;
				}
				if ('number' === typeof left) 
				{
					E.scrollLeft = left < 0 ? 0 : E.scrollWidth < left ? E.scrollWidth : left;
				}
			}
		},
		
		
		getScroll: function()
		{
			var E = this.element;
			if (E) 
			{
				return {
					top: E.scrollTop,
					left: E.scrollLeft,
					height: E.scrollHeight,
					width: E.scrollWidth
				};
			}
			return null;
		},
		
		
		/// OPACITY
		
		// FIXME: IE6 does not apply opacity on static elements if no dimension is set
		setOpacity: function(opacity)
		{
			var S = this.style;
			if (S && 'number' === typeof opacity) 
			{
				opacity = opacity < 0 ? 0 : 1 < opacity ? 1 : opacity.toFixed(2);
				if (S.opacity === undefined) 
				{
					S.filter = 'alpha(opacity=' + (opacity * 100) + ')'; // use IE filter
				}
				else 
				{
					S.opacity = opacity;
				}
			}
		},
		
		getOpacity: function()
		{
			var E = this.element;
			if (E) 
			{
				var o = E.style.opacity;
				if (o === undefined) 
				{
					try 
					{
						o = E.filters.alpha.opacity / 100;
						return o;
					} 
					catch (o) 
					{
						return (o = (/opacity=(\d+)/i).exec(E.style.cssText)) ? o[1] / 100 : 1;
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
					this.style = (this.element = tagName).style;
					this.setArea(width, height, x, y, z, positionType);
				}
			}
		},
		
		append: function(parent)
		{
			var E = this.element;
			if (E && !E.parentNode) 
			{
				(this.core.getElement(parent) || document.body).appendChild(E);
			}
		},
		
		insertBefore: function(node)
		{
			var E = this.element;
			if (E && !E.parentNode && (node = this.core.getElement(node)) && node.parentNode) 
			{
				node.parentNode.insertBefore(e, node);
			}
		},
		
		insertAfter: function(e, node)
		{
			var p;
			if (e && e.style && !e.parentNode && (node = this.core.getElement(node)) && (p = node.parentNode)) 
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
				var K = [];
				var n = 0;
				e = e.firstChild; // cannot be inside while question
				while (e) 
				{
					if (e.nodeType === 1) 
					{
						K[n++] = e;
					}
					e = e.nextSibling;
				}
				if (n) 
				{
					return K;
				}
			}
			return null;
		},
		
		setChild: function(child)
		{
			this.setElement(this.getChild(child));
		},
		
		setParent: function()
		{
			this.setElement(this.getParent());
		},
		
		setFirst: function()
		{
			this.setElement(this.getFirst());
		},
		
		setPrevious: function()
		{
			this.setElement(this.getPrevious());
		},
		
		setNext: function()
		{
			this.setElement(this.getNext());
		},
		
		setLast: function()
		{
			this.setElement(this.getLast());
		},
		
		getChild: function(child)
		{
			var E = this.element;
			return E.childNodes[child] || (child = this.core.getElement(child)) && E === child.parentNode && child || null;
		},
		
		appendChild: function(childNode)
		{
			var E = this.element;
			if (E && childNode && !childNode.parentNode && childNode.nodeType) 
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
					if (!(k = childNodes[i++]).parentNode && k.nodeType) 
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
				var K = E.childNodes;
				var i = K.length;
				while (i--) 
				{
					E.removeChild(K[i]);
				}
			}
		},
		
		purgeElement: function ()
		{
			this.core.purgeDOM(this.element);
			this.removeElement();
		},
		
		purgeChild: function(child)
		{
			if ((child = this.getChild(child))) 
			{
				this.core.purgeDOM(child);
				this.removeChild(child);
			}
		},
		
		purgeChildren: function()
		{
			var E = this.element;
			if (E) 
			{
				// local purge for best performance
				var p = this.core.purgeDOM;
				var C = E.childNodes;
				var i = C.length;
				var k;
				while (i--) 
				{
					if ((k = C[i]).nodeType === 1) 
					{
						p(k);
					}
					E.removeChild(k);
				}
			}
		},
		
		cloneChild: function(child, cloneAttrAndChilds)
		{
			return (child = this.getChild(child)) ? child.cloneNode(!!cloneAttrAndChilds) : null;
		},
		
		hasCollision: function(collisorElement)
		{
			var E = this.element;
			var o;
			if ((o = E) && collisorElement && collisorElement.style && collisorElement.parentNode) 
			{
				var R = document.documentElement;
				var eX = 0;
				var eY = 0;
				while (o !== R) 
				{
					eX += o.offsetLeft;
					eY += o.offsetTop;
					o = o.parentNode;
				}
				var cX = 0;
				var cY = 0;
				o = collisorElement;
				while (o !== R) 
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

	leaf.DOMElement.prototype.core = leaf.DOM.core;