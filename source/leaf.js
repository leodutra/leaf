
/*
 LEAF JavaScript Library
 Version 0.10.6a
 
 MIT License:
 Copyright (c) 2009-2010 Leonardo Dutra Constâncio
 
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 
 TODO:
 - Future JSON.parse() and JSON.stringfy() from http://www.json.org/
 - Animation + Tween based on Robert functions and MooFx
 - Implement [].reduce(), [].reduceRight (MozillaDC has some base code) and more ECMA 5 goodies
 - Build class for XHR, allowing intellisense and cross-browser fix
 - Deep test set/getBackground
 - Function.prototype.bind()
 - Date.now() && Date.prototype.toISOString()
 - enhance setCSS with cross compatibility (opacity, bg, etc)
 - any better option to "instanceof Array"
 - Remake: addClasses, removeClasses, setAttribute & getAttribute & getByClasses (http://www.quirksmode.org/dom/w3c_core.html#attributes);
 */
(function(window, undefined)
{
	var document = window.document;
	leaf = window.leaf || {};
	
	/*
	 if (!this.JSON)
	 {
	 JSON =
	 {
	 parse: function(...) {...},
	 stringfy: function(...) {...}
	 };
	 }
	 // */
	/*
	 if (!Date.prototype.toISOString)
	 {
	 Date.prototype.toISOString = function() {};
	 }
	 // */
	if (!Date.prototype.toJSON)//ok
	{
		// from http://json.org/json2.js
		Date.prototype.toJSON = function(key)
		{
			function f(n)
			{
				return n < 10 ? '0' + n : n;
			}
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
			f(this.getUTCMonth() + 1) +
			'-' +
			f(this.getUTCDate()) +
			'T' +
			f(this.getUTCHours()) +
			':' +
			f(this.getUTCMinutes()) +
			':' +
			f(this.getUTCSeconds()) +
			'Z' : null;
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key)
		{
			return this.valueOf();
		};
	}
	
	if (!String.prototype.trim)//ok
	{
		String.prototype.trim = function()
		{
			return this.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
		};
		String.prototype.trimLeft = function()
		{
			return this.replace(/^(\s|\u00A0)+/, '');
		};
		String.prototype.trimRight = function()
		{
			return this.replace(/(\s|\u00A0)+$/, '');
		};
	}
	Array.isArray = function(array)
	{
		// array && array.constructor === Array has issues
		return Object.prototype.toString.call(array) === '[object Array]'; // from ejohn.org
	};
	
	if (!Array.prototype.some)//ok
	{
		// from Mozilla - MDC and ECMA 5
		Array.prototype.some = function(callback, thisObject)
		{
			if (typeof callback === 'function') 
			{
				var L = this.length >> 0;
				for (var i = -1; ++i < L;) 
				{
					if (i in this && callback.call(thisObject, this[i], i, this)) 
					{
						return true;
					}
				}
			}
			return false;
		};
		
		Array.prototype.forEach = function(callback, thisObject)
		{
			if (typeof callback === 'function') 
			{
				var L = this.length >> 0;
				for (var i = -1; ++i < L;) 
				{
					if (i in this) 
					{
						callback.call(thisObject, this[i], i, this);
					}
				}
			}
		};
		
		Array.prototype.every = function(callback, thisObject)
		{
			if (typeof callback === 'function') 
			{
				var L = this.length >> 0;
				for (var i = -1; ++i < L;) 
				{
					if (i in this && !callback.call(thisObject, this[i], i, this)) 
					{
						return false;
					}
				}
			}
			return true;
		};
		
		Array.prototype.indexOf = function(searchElement, fromIndex) // very optimized, ok
		{
			var L = this.length >> 0;
			var i = fromIndex >> 0; // ceil negative, floor positive
			if (i-- < 0) // care here
			{
				// -1, -1.1, -1.2, etc
				i += L;
			}
			while (++i < L) // care here
 			{
				if (i in this && this[i] === searchElement) 
				{
					return i;
				}
			}
			return -1;
		};
		Array.prototype.lastIndexOf = function(searchElement, fromIndex)
		{
			var L = this.length >> 0;
			var i = Number(fromIndex);
			if (i === i) // false if is NaN 
			{
				if ((i >>= 0) < 0) 
				{
					i += L;
				}
				else 
				{
					if (L <= i) 
					{
						i = L - 1;
					}
				}
			}
			else 
			{
				i = L - 1;
			}
			while (~ i) // ~ = -(N+1)
 			{
				if (i in this && this[i] === searchElement) 
				{
					return i;
				}
				--i;
			}
			return -1;
		};
		Array.prototype.filter = function(callback, thisObject)
		{
			if (typeof callback === 'function') 
			{
				var L = this.length >> 0;
				var R = [];
				var n = 0;
				var v; // prevents object mutation
				for (var i = -1; ++i < L;) 
				{
					if (i in this && callback.call(thisObject, v = this[i], i, this)) 
					{
						R[n++] = v;
					}
				}
				return R;
			}
			return null;
		};
		Array.prototype.map = function(callback, thisObject)
		{
			if (typeof callback === 'function') 
			{
				var L = this.length >> 0;
				var R = [];
				for (var i = -1; ++i < L;) 
				{
					if (i in this) 
					{
						R[i] = callback.call(thisObject, this[i], i, this);
					}
				}
				return R;
			}
			return null;
		};
	}
	
	leaf.extend = function(superObj, extension)//ok
	{
		// cannot use on internals (IE and some others)
		if (superObj && extension) 
		{
			var n = function()
			{
			};
			n.prototype = superObj;
			superObj = new n;
			for (n in extension) 
			{
				if (extension[n] !== undefined) 
				{
					superObj[n] = extension[n];
				}
			}
			return superObj;
		}
		return null;
	};
	leaf.clone = function(obj)//ok
	{
		if (JSON.parse) 
		{
			return JSON.parse(JSON.stringify(obj));
		}
		var c = function(o)
		{
			var R = {};
			var k;
			for (k in o) 
			{
				R[k] = typeof o[k] === 'object' && o[k] ? c(o[k]) : o[k];
			}
			return R;
		};
		return c(obj);
	};
	if (this.XMLHttpRequest)//ok
	{
		leaf.createXHR = function()
		{
			return new XMLHttpRequest();
		};
	}
	else 
		if (this.ActiveXObject) 
		{
			leaf.createXHR = function()
			{
				if (!leaf.createXHR.activeX) 
				{
					leaf.createXHR.activeX = (function()
					{
						var A = ActiveXObject; // cache
						var V = ['MSXML2.XMLHTTP', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP.6.0', 'MSXML3.XMLHTTP'];
						// 'MSXML2.XMLHTTP.4.0' & 'MSXML2.XMLHTTP.5.0' have issues 
						// TODO check if MSXML3 has issues
						var i = 4;
						var o;
						while (i--) 
						{
							try 
							{
								new A(V[i]);
								return V[i];
							} 
							catch (o) 
							{
							}
						}
						return 'Microsoft.XMLHTTP';
					})();
				}
				return new ActiveXObject(leaf.createXHR.activeX);
			};
		}
		else 
		{
			leaf.createXHR = function()
			{
				return null;
			};
		}
	
	
	leaf.getMouseXY = function(event)//ok
	{
		if ((event = event || window.event)) 
		{
			if (typeof event.pageY === 'number') 
			{
				return {
					x: event.pageX,
					y: event.pageY
				};
			}
			var H = document.documentElement;
			var B = document.body;
			if (B) 
			{
				return {
					x: event.clientX + (H.scrollLeft || B.scrollLeft) - (H.clientLeft >> 0) - (B.clientLeft >> 0),
					y: event.clientY + (H.scrollTop || B.scrollTop) - (H.clientTop >> 0) - (B.clientTop >> 0)
				};
			}
			return {
				x: event.clientX + H.scrollLeft - (H.clientLeft >> 0),
				y: event.clientY + H.scrollTop - (H.clientTop >> 0)
			};
		}
		return null;
	};
	
	
	leaf.purge = function(domObj) // use to destroy elements
	{
		// base by Crookford (http://javascript.crockford.com/memory/leak.html)
		// this fixes the IE6- issue: elements with listeneres are not garbaged
		if (domObj) 
		{
			var a = domObj.attributes;
			if (a) 
			{
				var i = a.length;
				while (i--) 
				{
					if (typeof domObj[a[i].name] === 'function') // no cache for name. Few functions expected
					{
						domObj[a[i].name] = null;
					}
				}
			}
			if ((domObj = domObj.childNodes)) 
			{
				var p = leaf.purge;
				a = domObj.length;
				while (a--) 
				{
					p(domObj[a]);
				}
			}
			if (domObj.parentNode) // instant remove
			{
				domObj.parentNode.removeChild(domObj);
			}
		}
	};
	leaf.getByIds = function(ids)//ok
	{
		if (typeof ids === 'object') 
		{
			var D = document;
			var L = ids.length >> 0;
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
			return K;
		}
		return (ids = document.getElementById(ids)) ? [ids] : [];
	};
	leaf.getByTags = function(tagNames, rootNode)//ok
	{
		rootNode = rootNode ? rootNode.getElementsByTagName ? rootNode : document.getElementById(rootNode) || document : document;
		if (typeof tagNames === 'object') 
		{
			var L = tagNames.length >> 0;
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
			return K;
		}
		return rootNode.getElementsByTagName(tagNames);
	};
	if (document.getElementsByClassName) 
	{
		leaf.getByClasses = function(classNames, rootNode)
		{
			rootNode = rootNode ? rootNode.getElementsByClassName ? rootNode : document.getElementById(rootNode) || document : document;
			if (typeof classNames === 'object') 
			{
				var L = classNames.length >> 0;
				var n = 0;
				var i = 0;
				var j = 0;
				var K = [];
				var l;
				var o;
				while (i < L) 
				{
					l = (o = rootNode.getElementsByClassName(classNames[i++])).length;
					while (j < l) 
					{
						K[n++] = o[j++];
					}
					j = 0;
				}
				return K;
			}
			return rootNode.getElementsByClassName(classNames);
		};
	}
	else 
	{
		leaf.getByClasses = function(classNames, rootNode)//TODO fix to allow className: "test test1" as getElementByClassName
		{
			var K = [];
			if (typeof classNames === 'string' ? classNames = [classNames] : classNames && classNames.length && classNames.join) 
			{
				var R = new RegExp('(?:\\s|^)(?:' + classNames.join('\|') + ')(?:\\s|$)');
				var n = 0;
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
				q(rootNode ? rootNode.getElementsByTagName ? rootNode : document.getElementById(rootNode) || document : document); // by tagName cause of no by class
			}
			return K;
		};
	}
	if (this.addEventListener) 
	{
		leaf.addListener = function(domObj, type, listener)
		{
			if (domObj && domObj.addEventListener && typeof type === 'string' && typeof listener === 'function') 
			{
				domObj.addEventListener(type, listener, false);
			}
		};
		leaf.removeListener = function(domObj, type, listener)
		{
			if (domObj && domObj.removeEventListener && typeof type === 'string' && typeof listener === 'function') 
			{
				domObj.removeEventListener(type, listener, false);
			}
		};
		leaf.dispatchEvent = function(domObj, type)
		{
			if (domObj && domObj.dispatchEvent && typeof type === 'string') 
			{
				var e = document.createEvent('HTMLEvents');
				e.initEvent(type, true, true);
				domObj.dispatchEvent(e);
			}
		};
	}
	else 
		if (this.attachEvent) 
		{
			leaf.addListener = function(domObj, type, listener)
			{
				if (domObj && domObj.attachEvent && typeof type === 'string' && typeof listener === 'function') 
				{
					var h = type + listener;
					domObj['on' + h] = listener;
					domObj.attachEvent('on' + type, (domObj[h] = function()
					{
						domObj['on' + h](event);
					}));
				}
			};
			leaf.removeListener = function(domObj, type, listener)
			{
				if (domObj && domObj.detachEvent && typeof type === 'string' && typeof listener === 'function') 
				{
					domObj.detachEvent('on' + type, domObj[(type += listener)]);
					domObj[type] = null;
					domObj['on' + type] = null;
				}
			};
			leaf.dispatchEvent = function(domObj, type)
			{
				if (domObj && domObj.fireEvent && typeof type === 'string') 
				{
					domObj.fireEvent('on' + type, document.createEventObject());
				}
			};
		}
		else 
		{
			leaf.addListener = function(domObj, type, listener)
			{
			};
			leaf.removeListener = function(domObj, type, listener)
			{
			};
			leaf.dispatchEvent = function(domObj, type)
			{
			};
		}
	
	leaf.ElementHandler = function(element)
	{
		if (this instanceof leaf.ElementHandler) 
		{
			var _ = this; // avoids common intellisense errors
			_.setElement(element);
		}
	};
	leaf.ElementHandler.prototype = {
	
		/* do not handle this vars directly */
		element: null,
		style: null,
		
		setElement: function(element)
		{
			this.style = (this.element = element ? element.style ? element : document.getElementById(element) : null) ? this.element.style : null;
			return this;
		},
		getElement: function()
		{
			return this.element;
		},
		getStyle: function()
		{
			return this.style;
		},
		addListener: function(type, listener)
		{
			leaf.addListener(this.element, type, listener);
			return this;
		},
		removeListener: function(type, listener)
		{
			leaf.removeListener(this.element, type, listener);
			return this;
		},
		dispatchEvent: function(type)
		{
			leaf.dispatchEvent(this.element, type);
			return this;
		},
		addClasses: function(classNames)
		{
			var E = this.element;
			if (E && typeof E.className === 'string' && (typeof classNames === 'string' ? classNames = [classNames] : typeof classNames === 'object')) 
			{
				var R = new RegExp('(?:\\s|^)' + E.className.trim().replace(/\s+/g, '\|') + '(?:\\s|$)', '');
				var L = classNames.length >> 0;
				var n = 0;
				var i = -1; //opt
				var K = [];
				while (++i < L) 
				{
					if (R.test(classNames[i])) 
					{
						continue;
					}
					K[n++] = classNames[i];
				}
				E.className += ' ' + K.join(' ');
			}
			return this;
		},
		removeClasses: function(classNames)
		{
			var E = this.element;
			if (E && (typeof classNames === 'string' ? classNames = [classNames] : typeof classNames === 'object')) 
			{
				var c = E.className;
				if (c) 
				{
					var R = new RegExp('(:?\\s|^)(?:' + classNames.join('\|') + ')(?:\\s|$)', '');
					var L = (c = c.split(/\s+/)).length >> 0;
					var n = 0;
					var i = -1; //opt
					var K = [];
					while (++i < L) 
					{
						if (R.test(c[i])) 
						{
							continue;
						}
						K[n++] = c[i];
					}
					E.className = K.join(' ');
				}
			}
			return this;
		},
		setScroll: function(top, left)
		{
			var E = this.element;
			if (E) 
			{
				if (typeof top === 'number') 
				{
					E.scrollTop = top < 0 ? 0 : E.scrollHeight < top ? E.scrollHeight : top;
				}
				if (typeof left === 'number') 
				{
					E.scrollLeft = left < 0 ? 0 : E.scrollWidth < left ? E.scrollWidth : left;
				}
			}
			return this;
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
		create: function(tagName, id, classNames, cssObj, content)
		{
			if (typeof tagName === 'string' && (tagName = document.createElement(tagName))) 
			{
				if (typeof id === 'string') 
				{
					tagName.id = id;
				}
				this.style = (this.element = tagName).style;
				this.addClass(classNames);
				this.setCSS(cssObj);
				this.setContent(content);
			}
			else 
			{
				this.element = this.style = null;
			}
			return this;
		},
		createChildElement: function(tagName, id, cssObj, content)
		{
			var E = this.element;
			return this.create(tagName, id, classNames, cssObj, content).append(this.element).setElement(E);
		},
		append: function(parent)
		{
			if (this.element && (typeof parent === 'string' ? parent = document.getElementById(parent) : parent && (parent.nodeType === 1 || parent.nodeType === 11) || (parent = document.body))) 
			{
				this.remove();
				parent.appendChild(this.element);
			}
			return this;
		},
		insertBefore: function(node)
		{
			if (this.element && (typeof node === 'string' ? node = document.getElementById(node) : node) && node.parentNode) 
			{
				this.remove();
				node.parentNode.insertBefore(this.element, node);
			}
			return this;
		},
		insertAfter: function(node)
		{
			if (this.element && (typeof node === 'string' ? node = document.getElementById(node) : node) && node.parentNode) 
			{
				this.remove();
				if (node.nextSibling) 
				{
					node.parentNode.insertBefore(this.element, node.nextSibling);
				}
				else 
				{
					node.parentNode.appendChild(this.element);
				}
			}
			return this;
		},
		insertAsFirst: function(parent)
		{
			if (this.element && typeof parent === 'string' ? parent = document.getElementById(parent) : parent && (parent.nodeType === 1 || parent.nodeType === 11) || (parent = document.body)) 
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
			return this;
		},
		remove: function()
		{
			var E = this.element;
			if (E && E.parentNode) 
			{
				E.parentNode.removeChild(E);
			}
			return this;
		},
		getParent: function()
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
		hasChild: function(node)
		{
			return this.element && node && node.parentNode === this.element || false;
		},
		getChildElements: function()
		{
			// element.children[] has issues
			var e = this.element;
			var K = [];
			if (e) 
			{
				var n = 0;
				e = e.firstChild;
				while (e) 
				{
					if (e.nodeType === 1) 
					{
						K[n++] = e;
					}
					e = e.nextSibling;
				}
			}
			return K;
		},
		getChildElement: function(elementIndex)
		{
			// element.children[] has issues
			var e = this.element;
			if (e && typeof elementIndex === 'number') 
			{
				var n = 0;
				e = e.firstChild;
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
			return this;
		},
		setParent: function()
		{
			this.setElement(this.getParent());
			return this;
		},
		setFirst: function()
		{
			this.setElement(this.getFirst());
			return this;
		},
		setPrevious: function()
		{
			this.setElement(this.getPrevious());
			return this;
		},
		setNext: function()
		{
			this.setElement(this.getNext());
			return this;
		},
		setLast: function()
		{
			this.setElement(this.getLast());
			return this;
		},
		appendChild: function(childNode)
		{
			if (this.element && childNode && childNode.nodeType) 
			{
				if (childNode.parentNode) 
				{
					childNode.parentNode.removeChild(childNode);
				}
				this.element.appendChild(childNode);
			}
			return this;
		},
		appendChildren: function(childNodes)
		{
			var E = this.element;
			if (E && typeof childNodes === 'object') 
			{
				var l = childNodes.length >> 0;
				var i = 0;
				var k;
				while (i < l) 
				{
					if ((k = childNodes[i++]) && k.nodeType) 
					{
						if (k.parentNode) 
						{
							k.parentNode.removeChild(k);
						}
						E.appendChild(k);
					}
				}
			}
			return this;
		},
		removeChild: function(index)
		{
			if (this.element && (index = this.getChild(index))) 
			{
				this.element.removeChild(index);
			}
			return this;
		},
		removeChildElement: function(elementIndex)
		{
			if (this.element && (elementIndex = this.getChildElement(elementIndex))) 
			{
				this.element.removeChild(elementIndex);
			}
			return this;
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
			return this;
		},
		purge: function()
		{
			leaf.purge(this.element);
			this.element = this.style = null;
			return this;
		},
		purgeChildElement: function(elementIndex)
		{
			leaf.purge(this.getChildElement(elementIndex));
			return this;
		},
		purgeChildren: function()
		{
			var E = this.element;
			if (E) 
			{
				var p = leaf.purge;
				var C = E.childNodes;
				var i = C.length;
				while (i--) 
				{
					if (C[i].nodeType === 1) 
					{
						p(C[i]);
					}
				}
			}
			return this;
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
				if (typeof attribute === 'string') 
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
					if (typeof attribute === 'number') 
					{
						if (typeof E.attributes[attribute] === 'object') 
						{
							E.attributes[attribute].nodeValue = value;
						}
						else 
						{
							E.attributes[attribute] = value;
						}
					}
			}
			return this;
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
				if (typeof o === 'object') 
				{
					return o.nodeValue || '';
				}
			}
			if (typeof o === 'string') 
			{
				return o;
			}
			return null;
		}
	};
	
	var S = document.createElement('div').style;
	if (S.opacity === undefined) 
	{
		leaf.ElementHandler.prototype.setOpacity = function(opacity)
		{
			if (this.style && typeof opacity === 'number') 
			{
				this.style.filter = 'alpha(opacity=' + (1 < opacity ? 1 : opacity < 0 ? 0 : opacity * 100 >> 0) + ')';
			}
			return this;
		};
		leaf.ElementHandler.prototype.getOpacity = function()
		{
			if (this.element) 
			{
				var o;
				try 
				{
					return this.element.filters.alpha.opacity / 100;
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
			if (this.style && typeof opacity === 'number') 
			{
				this.style.opacity = 1 < opacity ? 1 : opacity < 0 ? 0 : (opacity * 100 >> 0) * 0.01;
			}
			return this;
		};
		leaf.ElementHandler.prototype.getOpacity = function()
		{
			var o = this.style;
			if (o) 
			{
				return (o = parseFloat(o.opacity)) === o ? o : 1; // comparison is false if is NaN 
			}
			return null;
		};
	}
	if (S.cssText === undefined) 
	{
		leaf.ElementHandler.prototype.setCSS = function(cssObj)
		{
			var E = this.element;
			if (E && cssObj) 
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
			return this;
		};
		leaf.ElementHandler.prototype.getCSS = function(property)
		{
			var o = this.element;
			if (o && typeof property === 'string' && (o = o.getAttribute('style')) && ~ (i = o.search(new RegExp('(?:\\\;|\\s|\\u00A0|^)' + property + '\\\:', 'i')))) 
			{
				return o.substring((i = o.indexOf(':', i) + 2), (i = o.indexOf('\;', i)) === -1 ? o.length : i);
			}
			return null;
		};
	}
	else 
	{
		leaf.ElementHandler.prototype.setCSS = function(cssObj)
		{
			var S = this.style;
			if (S && cssObj) 
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
			return this;
		};
		leaf.ElementHandler.prototype.getCSS = function(property)
		{
			var o = this.style;
			if (o && (o = o.cssText) && typeof property === 'string' && ~ (i = o.search(new RegExp('(?:\\\;|\\s|^)' + property + '\\\:', 'i')))) 
			{
				return o.substring((i = o.indexOf(':', i) + 2), (i = o.indexOf('\;', i)) === -1 ? o.length : i);
			}
			return null;
		};
	}
	
})(this);
