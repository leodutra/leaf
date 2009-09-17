	
	/*  LEAF JavaScript Library
	 *  Leonardo Dutra
	 *  v0.8.5a
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
	 *     .AJAX       (in reseach for more)
	 *     .Window
	 *     .Document   (in reseach for more)
	 *     .Mouse
	 *     .Util       (util functions)
	 *     .ElementHandler (handles any node of type element with an amazing performance. For group operations use inside of Array.each)
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
			if (array instanceof Array && 'function' === typeof itemHandler) 
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
		
		extend: function(superObject, extension)
		{
			if (superObject && extension)
			{
				var o = function () {};
				o.prototype = superObject;
				o = new o();
				for (var n in extension) 
				{
					o[n] = extension[n];
				}
				return o;
			}
			return null;
		}
	};
	
	
	/// WINDOW
	
	leaf.Window = {
	
		addListener: function(type, handlerFn)
		{
			leaf.Util.core.addListener(window, type, handlerFn);
		},
		removeListener: function(type, handlerFn)
		{
			leaf.Util.core.removeListener(window, type, handlerFn);
		},
		dispatchEvent: function(type)
		{
			leaf.Util.core.addListener(window, type);
		}
	};
	
	
	/// DOCUMENT
	
	leaf.Document = {
		
		addListener: function(type, handlerFn)
		{
			leaf.Util.core.addListener(document, type, handlerFn);
		},
		removeListener: function(type, handlerFn)
		{
			leaf.Util.core.removeListener(document, type, handlerFn);
		},
		dispatchEvent: function(type)
		{
			leaf.Util.core.addListener(document, type);
		}
	};
	
	
	/// AJAX
	
	leaf.Ajax = {};
	
if (window.XMLHttpRequest) {
	
	leaf.Ajax.createRequester = function()
	{
		return new XMLHttpRequest();
	};
}
else {
	
	leaf.Ajax.createRequester = function()
	{	
		// if no return, fix for IE
		var A = ActiveXObject; // cache
		// array of ActiveX versions
		var V = [
			'Microsoft.XMLHTTP',
			'MSXML2.XMLHTTP',
			'MSXML2.XMLHTTP.3.0',
			'MSXML2.XMLHTTP.4.0',
			'MSXML2.XMLHTTP.5.0',
			'MSXML2.XMLHTTP.6.0'
		]; 
		var i = 6;
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
		return null;
	};
}
	
	
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
				var o = document;
				var H = o.documentElement;
				if ((o = o.body)) // needed sometimes depending on browser and version since body can have a 1px rounder
				{
					return {
						// clientLeft/Top IE adjust
						x: mouseEvent.clientX + (H.scrollLeft || o.scrollLeft) - (H.clientLeft || 0),
						y: mouseEvent.clientY + (H.scrollTop || o.scrollTop) - (H.clientTop || 0)
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
	
	leaf.Util = {
		
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

if (window.addEventListener) 
{

	leaf.Util.core.addListener = function(o, t, f)
	{
		if (o && 'string' === typeof t && 'function' === typeof f) 
		{
			o.addEventListener(t, f, false);
		}
	};
	
	leaf.Util.core.removeListener = function(o, t, f)
	{
		if (o && 'string' === typeof t && 'function' === typeof f) 
		{
			o.removeEventListener(t, f, false);
		}
	};
	
	leaf.Util.core.dispatchEvent = function(o, t)
	{
		if (o && 'string' === typeof t) 
		{
			var e = document.createEvent('HTMLEvents');
			e.initEvent(t, true, true); // event type, bubbling, cancelable
			o.dispatchEvent(e);
		}
	};
	
}
else
{

	leaf.Util.core.addListener = function(o, t, f)
	{
		if (o && 'string' === typeof t && 'function' === typeof f) 
		{
			// uses hash name to fix IE problems
			// base code by John Resig of JQuery (Event Contest - www.quirksmode.com)
			var h = t + f;
			o['on' + h] = f;
			o.attachEvent('on' + t, (o[h] = function()
			{
				o['on' + h](event);
			}));
		}
	};
	
	leaf.Util.core.removeListener = function(o, t, f)
	{
		if (o && 'string' === typeof t && 'function' === typeof f) 
		{
			// uses hash name to fix IE problems
			// base code by John Resig of JQuery, (Event Contest - www.quirksmode.com)
			o.detachEvent('on' + t, o[(t += f)]);
			o[t] = null;
			o['on' + t] = null;
		}
	};
	
	leaf.Util.core.dispatchEvent = function(o, t)
	{
		if (o && 'string' === typeof t) 
		{
			// dispatch for IE
			o.fireEvent('on' + t, document.createEventObject());
		}
	};
}

	
	/// ElementHandler
	
	leaf.ElementHandler = function(element)
	{
		if (this instanceof leaf.ElementHandler) 
		{
			this.ElementHandler(element);
		}
	};
	
	leaf.ElementHandler.prototype = {
	
		// internal vars
		element: null,
		style:   null,
		core:    null, // used later on code
		
		ElementHandler: function(element)
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
		
		
		/// CLASS
		
		// TODO: benchmark
		addClass: function(classNames)
		{
			var E = this.element;
			if (E && 'string' === typeof E.className && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) 
			{
				var R = new RegExp('(?:\\s|^)' + E.className.replace(/(?:^\s+|\s+$)/g, '').replace(/\s+/g, '\|') + '(?:\\s|$)', '');
				var L = classNames.length;
				var K = [];
				var n = 0;
				var i = 0;
				while (i < L) 
				{
				// test avoids residual className problem
					if (R.test(classNames[i])) 
					{
						i += 1;
					}
					else 
					{
						K[n++] = classNames[i++];
					}
				}
				E.className += ' ' + K.join(' ');
			}
		},
		
		removeClass: function(classNames)
		{
			var E = this.element;
			if (E && ('string' === typeof classNames ? classNames = [classNames] : classNames instanceof Array)) 
			{
				var c = E.className;
				if (c) 
				{
					var R = new RegExp('(:?\\s|^)(?:' + classNames.join('\|') + ')(?:\\s|$)', '');
					var L = (c = c.split(/\s+/)).length;
					var K = [];
					var n = 0;
					var i = 0;
					while (i < L) 
					{
						if (R.test(c[i])) 
						{
							i += 1;	
						}
						else
						{
							K[n++] = c[i++];
						}
					}
					E.className = K.join(' ');
				}
			}
		},
		
		
		/// POSITION	
		
		setPosition: function(top, right, bottom, left, zIndex, type)
		{
			var S = this.style;
			if (S) 
			{
				if ('string' === typeof type)
				{
					S.position = type;
				}
				
				if ('number' === typeof top) 
				{
					S.top = top +'px';
					bottom = '';
				}
				else 
				{
					if ('string' === typeof top) 
					{
						S.top = top;
						bottom = '';
					}
				}
				
				if ('number' === typeof bottom) 
				{
					S.bottom = bottom +'px';
					S.top = '';
				}
				else 
				{
					if ('string' === typeof bottom) 
					{
						S.bottom = bottom;
						S.top = '';
					}
				}
				
				if ('number' === typeof left) 
				{
					S.left = left +'px';
					right = '';
				}
				else 
				{
					if ('string' === typeof left) 
					{
						S.left = left;
						right = '';
					}
				}
				
				if ('number' === typeof right) 
				{
					S.right = right +'px';
					S.left = '';
				}
				else 
				{
					if ('string' === typeof right) 
					{
						S.right = right;
						S.left = '';
					}
				}
				
				if ('number' === typeof zIndex) 
				{
					S.zIndex = parseInt(zIndex, 10);
				}
			}
		},
		
		getPosition: function(keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				if (keepAsValues) 
				{
					return {
						top: S.top,
						right: S.right,
						bottom: S.bottom,
						left: S.left,
						zIndex: S.zIndex,
						position: S.position
					};
				}
				else 
				{
					return {
						top: parseFloat(S.top)||0,
						right: parseFloat(S.right)||0,
						bottom: parseFloat(S.bottom)||0,
						left: parseFloat(S.left)||0,
						zIndex: S.zIndex,
						position: S.position
					};
				}
			}
			return null;
		},
		
		setXY: function (x, y)
		{
			var S = this.style;
			if (S) 
			{
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
			}
		},
		
		getXY: function (keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				if (keepAsValues) 
				{
					return {
						x: S.left || S.right,
						y: S.top || S.bottom
					};
				}
				else 
				{
					return {
						x: parseFloat(S.left || S.right) || 0,
						y: parseFloat(S.top || S.bottom) || 0
					};
				}
			}
			return null;
		},
		
				
		invertXY: function(x, y)
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
		
		getSize: function(keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				if (keepAsValues) 
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
		
		setArea: function(width, height, x, y)
		{
			this.setSize(width, height);
			this.setXY(x, y);
		},
		
		getArea: function(keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				if (keepAsValues) 
				{
					return {
						x: S.left || S.right,
						y: S.top || S.bottom,
						width: S.width,
						height: S.height
					};
				}
				else 
				{
					return {
						x: parseFloat(S.left || S.right) || 0,
						y: parseFloat(S.top || S.bottom) || 0,
						width: parseFloat(S.width) || 0,
						height: parseFloat(S.height) || 0
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
		
		getBackground: function(keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				var P = S.backgroundPosition.split(' ');
				if (keepAsValues) 
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
		
		getFont: function(keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				if (keepAsValues) 
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
		
		getBorder: function(keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				return {
					color: S.borderColor,
					width: keepAsValues ? S.borderWidth : parseFloat(S.borderWidth),
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
		
		getPadding: function(keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				if (keepAsValues) 
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
		
		getMargin: function(keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				if (keepAsValues) 
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
		
		getText: function(keepAsValues)
		{
			var S = this.style;
			if (S) 
			{
				if (keepAsValues) 
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
		
		
		/// NODE
		
		createElement: function(tagName, id, classNames, cssObj)
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
					this.addClass(classNames);
					this.setCSS(cssObj);
				}
			}
		},
		
		createChildElement: function (tagName, id, cssObj, content)
		{
			if (this.element && 'string' === typeof tagName) 
			{
				// reuse tagName
				if ((tagName = document.createElement(tagName))) 
				{
					if ('string' === typeof id) 
					{
						tagName.id = id;
					}
					tagName = new leaf.ElementHandler(tagName);
					tagName.setCSS(cssObj);
					tagName.append(this.element);
					tagName.setContent(content);
				}
			}
		},
		
		append: function(parent)
		{
			var E = this.element;
			if (E && !E.parentNode) 
			{
				// optimum if for parent
				if (parent ? 'string' === typeof parent ? parent = document.getElementById(parent) :
				(parent.nodeType === 1 || parent.nodeType === 11) : parent = document.body) 
				{
					parent.appendChild(E);
				}
			}
		},
		
		insertBefore: function(node)
		{
			var E = this.element;
			if (E && !E.parentNode && (node.nodeType && node.parentNode ||(node = document.getElementById(node)))) 
			{
				node.parentNode.insertBefore(E, node);
			}
		},
		
		insertAfter: function(node)
		{
			var E = this.element;
			if (E && !E.parentNode && (node.nodeType && node.parentNode ||(node = document.getElementById(node)))) 
			{
				if (node.nextSibling) 
				{
					node.parentNode.insertBefore(E, node.nextSibling);
				}
				else 
				{
					node.parentNode.appendChild(E);
				}
			}
		},
		
		insertAsFirst: function(parent)
		{
			var E = this.element;
			if (E && !E.parentNode) 
			{	
				// optimum if for parent
				if (parent ? 'string' === typeof parent ? parent = document.getElementById(parent) :
				(parent.nodeType === 1 || parent.nodeType === 11) : parent = document.body) 
				{
					if (parent.firstChild) 
					{
						parent.insertBefore(E, parent.firstChild);
					}
					else 
					{
						parent.appendChild(E);
					}
				}
			}
		},
		
		remove: function()
		{
			var E = this.element;
			if (E) 
			{
				if (E.parentNode)
				{
					E.parentNode.removeChild(E);
				}
			}
		},
		
		getParent: function ()
		{
			return this.element && this.element.parentNode || null;
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
		
		getChild: function(index)
		{
			return this.element && this.element.childNodes[index] || null;
		},
		
		isChild: function(node)
		{
			return this.element && node && node.parentNode === this.element || false;		
		},
		
		getChildElements: function()
		{
			var e = this.element;
			if (e) 
			{
				var K = [];
				var n = 0;
				e = e.firstChild; // cannot be inside of while question
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
		
		getChildElement: function(elementIndex)
		{
			var e = this.element;
			if (e && 'number' === typeof elementIndex)
			{
				var K = [];
				var n = 0;
				e = e.firstChild; // cannot be inside of while question
				while (e) 
				{
					if (e.nodeType === 1 && n++ === elementIndex) 
					{
						return e;
					}
					e = e.nextSibling;
				}
				return null;
			}
		},
		
		setChildElement: function(elementIndex)
		{
			this.setElement(this.getChildElement(elementIndex));
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
		
		appendChild: function(childNode)
		{
			if (this.element && childNode && !childNode.parentNode && childNode.nodeType) 
			{
				this.element.appendChild(childNode);
			}
		},
		
		appendChildren: function(childNodes)
		{
			var E = this.element;
			if (E && childNodes) 
			{
				var l = childNodes.length;
				var i = 0;
				var k;
				while (i < l) 
				{
					if ((k = childNodes[i++]) && !k.parentNode && k.nodeType) 
					{
						E.appendChild(k);
					}
				}
			}
		},
		
		removeChild: function(index)
		{
			if (this.element && (index = this.getChild(index))) 
			{
				this.element.removeChild(index);
			}
		},
		
		removeChildElement: function(elementIndex)
		{
			if (this.element && (elementIndex = this.getChildElement(elementIndex))) 
			{
				this.element.removeChild(elementIndex);
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
		
		purge: function ()
		{
			this.core.purgeDOM(this.element);
			this.removeElement();
		},
		
		purgeChildElement: function(elementIndex)
		{
			if ((elementIndex = this.getChildElement(elementIndex))) 
			{
				this.core.purgeDOM(elementIndex);
				this.removeChild(elementIndex);
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
		
		cloneChild: function(index, cloneAttrAndChilds)
		{
			return (index = this.getChild(index)) ? index.cloneNode(!!cloneAttrAndChilds) : null;
		},
		
		cloneChildElement: function(elementIndex, cloneAttrAndChilds)
		{
			return (elementIndex = this.getChildElement(elementIndex)) ? elementIndex.cloneNode(!!cloneAttrAndChilds) : null;
		},
		
		hasCollision: function(collisorElement)
		{
			var E = this.element;
			if (E && collisorElement && collisorElement.style) 
			{
				var R = document.documentElement;
				var eX = 0;
				var eY = 0;
				var o = E;
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
				if (!(eX < cX - E.offsetWidth || cX + collisorElement.offsetWidth < eX)) 
				{
					return !(eY < cY - E.offsetHeight || cY + collisorElement.offsetHeight < eY);
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
	
	
(function ()
{	
	var S = document.documentElement.style;
	
	
	/// OPACITY
	
	if (S.opacity===undefined)
	{
		leaf.ElementHandler.prototype.setOpacity = function(opacity)
		{
			if (this.style && 'number' === typeof opacity) 
			{
				this.style.filter ='alpha(opacity=' +
				(opacity < 0 ? 0 : 1 < opacity ? 1 : opacity.toFixed(2) * 100) + ')'; // use IE filter
			}
		};
		
		leaf.ElementHandler.prototype.getOpacity = function()
		{
			if (this.element) 
			{
				var o;
				try 
				{
					o = this.element.filters.alpha.opacity / 100;
					return o;
				} 
				catch (o) 
				{
					return (o = (/opacity=(\d+)/i).exec(this.style.cssText)) ? o[1] / 100 : 1;
				}
			}
			return null;
		};
	}
	else
	{
		leaf.ElementHandler.prototype.setOpacity = function(opacity)
		{
			if (this.style && 'number' === typeof opacity) 
			{
				this.style.opacity = opacity < 0 ? 0 : 1 < opacity ? 1 : opacity.toFixed(2);
			}
		};
		
		leaf.ElementHandler.prototype.getOpacity = function()
		{
			var o = this.style;
			if (o) 
			{
				return isNaN(o = parseFloat(o.opacity)) ? 1 : o;
			}
			return null;
		};
	}
	
	
	/// CSS
	
	if (S.cssText===undefined)
	{
		leaf.ElementHandler.prototype.setCSS = function(cssObj)
		{
			var E = this.element;
			if (E && cssObj instanceof Object) 
			{
				var K = [];
				var n = 0;
				var c;
				for (c in cssObj) 
				{
					K[n++] = c + ': ' + cssObj[c] + '\; ';
				}
				E.setAttribute('style', (E.getAttribute('style') || '') + K.join(''));
			}
		};
		
		leaf.ElementHandler.prototype.getCSS = function(property)
		{
			var o = this.element;
			if (o && (o = o.getAttribute('style')) && 'string' === typeof property) 
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
		leaf.ElementHandler.prototype.setCSS = function(cssObj)
		{
			var S = this.style;
			if (S && cssObj instanceof Object) 
			{
				var K = [];
				var n = 0;
				var c;
				for (c in cssObj) 
				{
					K[n++] = c + ': ' + cssObj[c] + '\; ';
				}
				S.cssText = ((c = S.cssText) && (c.charAt(c.length - 1) === '\;' ? c : c + '; ') || '') + K.join('');
			}
		};
		
		leaf.ElementHandler.prototype.getCSS = function(property)
		{
			var o = this.style;
			if (o && (o = o.cssText) && 'string' === typeof property) 
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
})();

	leaf.ElementHandler.prototype.core = leaf.Util.core;