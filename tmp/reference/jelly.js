/*!
 *	Jelly JavaScript, Copyright (c) 2008 Pete Boere.
 *	MIT Style License: http://www.opensource.org/licenses/mit-license.php
 */
var JELLY = function()
{
	var isDefined = function(obj)
	{
		return typeof obj !== 'undefined';
	}, toArray = function(obj)
	{
		var result = [], n = obj.length, i = 0;
		for (i; i < n; i++) 
		{
			result[i] = obj[i];
		}
		return result;
	}, isArray = function(obj)
	{
		return obj.constructor === Array;
	}, isString = function(obj)
	{
		return typeof obj === 'string';
	}, getElement = function(obj)
	{
		return typeof obj === 'string' ? doc.getElementById(obj) : obj;
	}, win = window, doc = win.document, rootElement = doc.documentElement, standardEventModel = 'addEventListener' in doc, IE = 'ActiveXObject' in win;
	
	return {
	
		// ------>  Elements  <-------
		
		addClass: function(el, cn)
		{
			el.className += el.className ? ' ' + cn : cn;
		},
		removeClass: function(el, cn)
		{
			var patt = new RegExp('(^|\\s|\\b)' + cn + '(\\s|$)', 'g');
			el.className = el.className.replace(patt, ' ').normalize();
		},
		hasClass: function(el, cn)
		{
			return (' ' + el.className + ' ').indexOf(cn) !== -1;
		},
		toggleClass: function(el, cn)
		{
			if (JELLY.hasClass(el, cn)) 
			{
				JELLY.removeClass(el, cn);
			}
			else 
			{
				JELLY.addClass(el, cn);
			}
		},
		createElement: function(type, args)
		{
			var el = doc.createElement(type), i;
			for (i in args) 
			{
				switch (i)
				{
					case 'setHTML':
						el.innerHTML = args[i];
						break;
					case 'setText':
						el.appendChild(doc.createTextNode(args[i]));
						break;
					case 'class':
						el.className = args[i];
						break;
					case 'style':
						el.style.cssText = args[i];
						break;
					default:
						el.setAttribute(i, args[i]);
				}
			}
			return el;
		},
		createBranch: function()
		{
			var args = toArray(arguments), refs = {}, parseNode = function(arg)
			{
				if (isString(arg)) 
				{
					return JELLY.createElement(arg);
				}
				else 
				{
					return arg.cloneNode(true);
				}
			}, indexRef = function(node)
			{
				var tagName = node.nodeName.toLowerCase();
				if (!refs[tagName]) 
				{
					refs[tagName] = [node];
				}
				else 
				{
					refs[tagName].push(node);
				}
			}, currentContext = [parseNode(args.shift())];
			refs.root = currentContext[0];
			indexRef(currentContext[0]);
			args.each(function(item)
			{
				var store = [];
				for (var i = 0; i < currentContext.length; i++) 
				{
					if (!isArray(item)) 
					{
						item = [item];
					}
					for (var j = 0; j < item.length; j++) 
					{
						(function()
						{
							var node = parseNode(item[j]);
							currentContext[i].appendChild(node);
							store.push(node);
							indexRef(node);
						})();
					}
				}
				currentContext = store;
			});
			return refs;
		},
		insertElement: function(el, datum, type)
		{
			type = type || 'bottom';
			switch (type)
			{
				case 'before':
					return datum.parentNode.insertBefore(el, datum);
				case 'after':
					return datum.parentNode.insertBefore(el, datum.nextSibling);
				case 'top':
					return datum.insertBefore(el, datum.firstChild);
			}
			return datum.appendChild(el);
		},
		replaceElement: function(el, replacement)
		{
			return el.parentNode.replaceChild(replacement, el);
		},
		removeElement: function(el)
		{
			return el.parentNode.removeChild(el);
		},
		getFirst: function(el)
		{
			el = el.firstChild;
			while (el && el.nodeType !== 1) 
			{
				el = el.nextSibling;
			}
			return el;
		},
		getLast: function(el)
		{
			el = el.lastChild;
			while (el && el.nodeType !== 1) 
			{
				el = el.previousSibling;
			}
			return el;
		},
		getNext: function(el)
		{
			el = el.nextSibling;
			while (el && el.nodeType !== 1) 
			{
				el = el.nextSibling;
			}
			return el;
		},
		getPrevious: function(el)
		{
			el = el.previousSibling;
			while (el && el.nodeType !== 1) 
			{
				el = el.previousSibling;
			}
			return el;
		},
		getChildren: function(el)
		{
			var elements = [], el = el.firstChild;
			while (el) 
			{
				if (el.nodeType === 1) 
				{
					elements[elements.length] = el;
				}
				el = el.nextSibling;
			}
			return elements;
		},
		getXY: function(el)
		{
			var xy = [0, 0];
			do 
			{
				xy[0] += el.offsetLeft;
				xy[1] += el.offsetTop;
			}
			while ((el = el.offsetParent));
			return xy;
		},
		getX: function(el)
		{
			return JELLY.getXY(el)[0];
		},
		getY: function(el)
		{
			return JELLY.getXY(el)[1];
		},
		setXY: function(el, X, Y, unit)
		{
			unit = unit || 'px';
			el.style.left = X + unit;
			el.style.top = Y + unit;
		},
		getAttribute: function()
		{
			if (!isDefined(rootElement.hasAttibute) && IE) 
			{
				return function(node, attr)
				{
					switch (attr)
					{
						case 'for':
							return node.attributes[attr].nodeValue || null;
						case 'class':
							return node.className || null;
						case 'href':
						case 'src':
							return node.getAttribute(attr, 2) || null;
						case 'style':
							return node.getAttribute(attr).cssText.toLowerCase() || null;
					}
					return node.getAttribute(attr) || null;
				};
			}
			return function(node, attr)
			{
				return node.getAttribute(attr);
			};
		}
()		,
		getStyle: function(el, prop, parseInteger)
		{
			prop = JELLY.Str.toCamelCase(prop);
			var value;
			if (prop === 'opacity') 
			{
				if (el.__opacity === undefined) 
				{
					el.__opacity = 1;
				}
				return el.__opacity;
			}
			if (el.style[prop]) 
			{
				value = el.style[prop];
			}
			else 
				if ('getComputedStyle' in win) 
				{
					value = win.getComputedStyle(el, null)[prop];
				}
				else 
					if ('currentStyle' in el) 
					{
						value = el.currentStyle[prop];
					}
			return parseInteger === true ? parseInt(value, 10) : value;
		},
		setOpacity: function()
		{
			if ('filters' in rootElement) 
			{
				return function(el, val)
				{
					if (el.__opacity === undefined) 
					{
						el.__opacity = 1;
					}
					el.style.filter = val === 1 ? '' : 'alpha(opacity=' + val * 100 + ')';
					el.__opacity = val;
				};
			}
			return function(el, val)
			{
				if (el.__opacity === undefined) 
				{
					el.__opacity = 1;
				}
				el.style.opacity = el.__opacity = val;
			};
		}
()		,
		
		// ------>  Events  <-------
		
		addEvent: function(obj, type, fn)
		{
			obj = getElement(obj);
			var J = JELLY, mouseEnter = type.indexOf('mouseenter') !== -1, mouseLeave = type.indexOf('mouseleave') !== -1, host = J.addEvent, wrapper, ref;
			host.log = host.log || [];
			if (!standardEventModel) 
			{
				wrapper = function(e)
				{
					e = J.fixEvent(e);
					fn.call(obj, e);
				};
			}
			if (mouseEnter || mouseLeave) 
			{
				wrapper = function(e)
				{
					e = J.fixEvent(e);
					if (!J.mouseEnterLeave.call(obj, e)) 
					{
						return;
					}
					fn.call(obj, e);
				};
				type = mouseEnter ? 'mouseover' : 'mouseout';
			}
			ref = [obj, type, wrapper || fn];
			host.log.push(ref);
			if (standardEventModel) 
			{
				obj.addEventListener(type, wrapper || fn, false);
			}
			else 
			{
				obj.attachEvent('on' + type, wrapper);
			}
			return ref;
		},
		removeEvent: function()
		{
			if (standardEventModel) 
			{
				return function(arr)
				{
					arr[0].removeEventListener(arr[1], arr[2], false);
				};
			}
			return function(arr)
			{
				arr[0].detachEvent('on' + arr[1], arr[2]);
			};
		}
()		,
		purgeEventLog: function()
		{
			var J = JELLY;
			if (J.addEvent.log.length > 1) 
			{
				var arr = J.addEvent.log, i, c;
				for (i = 0; arr[i]; i++) 
				{
					c = arr[i];
					if (c[0] === win && c[1] === 'unload') 
					{
						continue;
					}
					J.removeEvent(c);
				}
			}
		},
		fixEvent: function()
		{
			if (standardEventModel) 
			{
				return function(e)
				{
					return e;
				};
			}
			return function(e)
			{
				e = window.event;
				e.target = e.srcElement;
				switch (e.type)
				{
					case 'mouseover':
						e.relatedTarget = e.fromElement;
					case 'mouseout':
						e.relatedTarget = e.toElement;
				}
				//e.relatedTarget = e.type === 'mouseover' ? e.fromElement : (e.type === 'mouseout' ? e.toElement : undefined);
				e.stopPropagation = function()
				{
					e.cancelBubble = true;
				};
				e.preventDefault = function()
				{
					e.returnValue = false;
				};
				e.pageX = e.clientX + rootElement.scrollLeft;
				e.pageY = e.clientY + rootElement.scrollTop;
				return e;
			};
		}
()		,
		mouseEnterLeave: function(e)
		{
			var related, i;
			if (e.relatedTarget) 
			{
				related = e.relatedTarget;
				if (related.nodeType !== 1 || related === this) 
				{
					return false;
				}
				var children = this.getElementsByTagName('*');
				for (i = 0; children[i]; i++) 
				{
					if (related === children[i]) 
					{
						return false;
					}
				}
			}
			return true;
		},
		stopEvent: function(e)
		{
			e = JELLY.fixEvent(e);
			e.stopPropagation();
			e.preventDefault();
		},
		
		// ------>  Flash  <-------
		
		getFlashVersion: function()
		{
			var version = {
				major: null,
				build: null
			}, description, versionString, aXflash;
			if (navigator.plugins && typeof navigator.plugins['Shockwave Flash'] === 'object') 
			{
				description = navigator.plugins['Shockwave Flash'].description;
				if (description !== null) 
				{
					versionString = description.replace(/^[^\d]+/, '');
					version.major = parseInt(versionString.replace(/^(.*)\..*$/, '$1'), 10);
					version.build = parseInt(versionString.replace(/^.*r(.*)$/, '$1'), 10);
				}
			}
			else 
				if (IE) 
				{
					try 
					{
						aXflash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
						description = aXflash.GetVariable('$version');
						if (description !== null) 
						{
							versionString = description.replace(/^\S+\s+(.*)$/, '$1').split(',');
							version.major = parseInt(versionString[0], 10);
							version.build = parseInt(versionString[2], 10);
						}
					} 
					catch (ex) 
					{
					}
				}
			return version;
		},
		createFlashObject: function(opts)
		{
			var path = opts.path, attributes = opts.attributes ||
			{}, params = opts.params ||
			{}, vars = opts.vars ||
			{}, fallback = opts.fallback ||
			'<a href="http://www.adobe.com/go/getflashplayer">' +
			'<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" ' +
			'alt="You need the latest Adobe Flash Player to view this content" /></a>', data = [], output = '<object';
			if (IE) 
			{
				attributes.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
				params.movie = path;
			}
			else 
			{
				attributes.data = path;
				attributes.type = 'application/x-shockwave-flash';
			}
			attributes.width = opts.width;
			attributes.height = opts.height;
			for (var i in attributes) 
			{
				output += ' ' + i + '="' + attributes[i] + '"';
			}
			output += '>\n';
			for (var i in vars) 
			{
				data.push(i + '=' + encodeURIComponent(vars[i]));
			}
			if (data.length > 0) 
			{
				params.flashvars = data.join('&');
			}
			for (var i in params) 
			{
				output += '\t<param name="' + i + '" value="' + params[i] + '" />\n';
			}
			return output + fallback + '\n</object>';
		},
		
		// ------>  Utilities  <-------
		
		Str: {
			toCamelCase: function(str)
			{
				return str.replace(/-\D/gi, function(m)
				{
					return m.charAt(m.length - 1).toUpperCase();
				});
			},
			toCssCase: function(str)
			{
				return str.replace(/([A-Z])/g, '-$1').toLowerCase();
			},
			rgbToHex: function(str)
			{
				var rgb = str.match(/[\d]{1,3}/g), hex = [], i;
				for (i = 0; i < 3; i++) 
				{
					var bit = (rgb[i] - 0).toString(16);
					hex.push(bit.length === 1 ? '0' + bit : bit);
				}
				return '#' + hex.join('');
			},
			hexToRgb: function(str, array)
			{
				var hex = str.match(/^#([\w]{1,2})([\w]{1,2})([\w]{1,2})$/), rgb = [], i;
				for (i = 1; i < hex.length; i++) 
				{
					if (hex[i].length === 1) 
					{
						hex[i] += hex[i];
					}
					rgb.push(parseInt(hex[i], 16));
				}
				return array ? rgb : 'rgb(' + rgb.join(',') + ')';
			},
			parseColour: function(str, mode)
			{
				var rgbToHex = JELLY.Str.rgbToHex, hexToRgb = JELLY.Str.hexToRgb, hex = /^#/.test(str), tempArray = [], temp;
				switch (mode)
				{
					case 'hex':
						return hex ? str : rgbToHex(str);
					case 'rgb':
						return hex ? hexToRgb(str) : str;
					case 'rgb-array':
						if (hex) 
						{
							return hexToRgb(str, true);
						}
						else 
						{
							temp = str.replace(/rgb| |\(|\)/g, '').split(',');
							temp.each(function(item)
							{
								tempArray.push(parseInt(item, 10));
							});
							return tempArray;
						}
				}
			}
		},
		getCookie: function(name)
		{
			var result = new RegExp(name + '=([^; ]+)').exec(doc.cookie);
			if (!result) 
			{
				return null;
			}
			return unescape(result[1]);
		},
		setCookie: function(name, value, expires, path, domain, secure)
		{
			if (expires) 
			{
				expires = new Date(new Date().getTime() + ((1000 * 60 * 60 * 24) * expires)).toGMTString();
			}
			doc.cookie = name + '=' + escape(value) +
			(expires ? ';expires=' + expires : '') +
			(path ? ';path=' + path : '') +
			(domain ? ';domain=' + domain : '') +
			(secure ? ';secure' : '');
		},
		removeCookie: function(name, path, domain)
		{
			if (JELLY.getCookie(name)) 
			{
				doc.cookie = name + '=' +
				(path ? ';path=' + path : '') +
				(domain ? ';domain=' + domain : '') +
				(';expires=' + new Date(0));
			}
		},
		getViewport: function()
		{
			if (isDefined(win.innerWidth)) 
			{
				return function()
				{
					return [win.innerWidth, win.innerHeight];
				};
			}
			if (isDefined(rootElement) && isDefined(rootElement.clientWidth) && rootElement.clientWidth !== 0) 
			{
				return function()
				{
					return [rootElement.clientWidth, rootElement.clientHeight];
				};
			}
			return function()
			{
				return [doc.body.clientWidth || 0, doc.body.clientHeight || 0];
			};
		}
()		,
		getWindowScroll: function()
		{
			if (isDefined(win.pageYOffset)) 
			{
				return function()
				{
					return [win.pageXOffset, win.pageYOffset];
				};
			}
			return function()
			{
				if (isDefined(rootElement.scrollTop) &&
				(rootElement.scrollTop > 0 || rootElement.scrollLeft > 0)) 
				{
					return [rootElement.scrollLeft, rootElement.scrollTop];
				}
				return [doc.body.scrollLeft, doc.body.scrollTop];
			};
		}
()		,
		parseQueryString: function(el)
		{
			el = el || win.location;
			if (/\?/.test(el.href)) 
			{
				var queries = el.href.split('?')[1].split('&'), i = queries.length - 1, pairs = {}, parts;
				do 
				{
					parts = queries[i].split('=');
					pairs[parts[0]] = parts[1];
				}
				while (i--);
				return pairs;
			}
			return null;
		},
		extend: function(a, b, overwrite)
		{
			for (var i in b) 
			{
				if (isDefined(a[i]) && overwrite === false) 
				{
					continue;
				}
				a[i] = b[i];
			}
			return a;
		},
		bind: function()
		{
			var args = toArray(arguments), obj = args.shift(), func = args.shift();
			return function()
			{
				return func.apply(obj, args);
			};
		},
		bindEventListener: function()
		{
			var args = toArray(arguments), obj = args.shift(), func = args.shift();
			return function(e)
			{
				return func.apply(obj, [e].concat(args));
			};
		},
		browser: function()
		{
			var nav = win.navigator, ua = nav.userAgent, ActiveX = 'ActiveXObject' in win, XHR = 'XMLHttpRequest' in win, SecurityPolicy = 'securityPolicy' in nav, TaintEnabled = 'taintEnabled' in nav, Opera = /opera/i.test(ua), Firefox = /firefox/i.test(ua), Webkit = /webkit/i.test(ua);
			return {
				ie: ActiveX,
				ie6: ActiveX && !XHR,
				ie7: ActiveX && XHR,
				opera: Opera,
				firefox: Firefox || (SecurityPolicy && !ActiveX && !Opera),
				webkit: Webkit || (!TaintEnabled && !ActiveX && !Opera),
				safariMobile: /safari/i.test(ua) && /mobile/i.test(ua),
				chrome: Webkit && /chrome/i.test(ua)
			};
		}
()		,
		trace: function()
		{
			if (win.console && win.console.log) 
			{
				console.log(arguments);
			}
		},
		local: "for(var i in JELLY){if(i!='local')eval('var '+i+'=JELLY.'+i)};",
		isDefined: function(obj)
		{
			return isDefined(obj);
		},
		toArray: function(obj)
		{
			return toArray(obj);
		},
		isArray: function(obj)
		{
			return isArray(obj);
		},
		isString: function(obj)
		{
			return isString(obj);
		},
		getElement: function(obj)
		{
			return getElement(obj);
		}
	};
}
();

/*! 
 Onload routines  */
(function()
{
	var browser = JELLY.browser, addClass = JELLY.addClass, rootElement = document.documentElement, classname = 'unknown';
	for (var i in browser) 
	{
		if (browser[i]) 
		{
			if (classname === 'unknown') 
			{
				classname = '';
			}
			classname += ' ' + i;
		}
	}
	addClass(rootElement, classname.replace(/^\s+/, ''));
	addClass(rootElement, 'js');
	if (browser.ie6) 
	{
		try 
		{
			document.execCommand('BackgroundImageCache', false, true);
		} 
		catch (ex) 
		{
		};
			}
})();

/*! 
 OnUnload routines  */
JELLY.addEvent(window, 'unload', JELLY.purgeEventLog);

/*! 
 Prototype Extensions */
JELLY.extend(Array.prototype, {
	forEach: function(fn, obj)
	{
		for (var i = 0, j = this.length; i < j; i++) 
		{
			fn.call(obj, this[i], i, this);
		}
	}
}, false);
Array.prototype.each = Array.prototype.forEach;

JELLY.extend(String.prototype, {
	trim: function()
	{
		return this.replace(/^\s+|\s+$/g, '');
	},
	normalize: function()
	{
		return this.replace(/\s{2,}/g, ' ').trim();
	}
});

/*! 
 Selector Engine */
JELLY.Q = function()
{
	if ('querySelectorAll' in document) 
	{
		return function(a, b)
		{
			try 
			{
				return JELLY.toArray(b ? a.querySelectorAll(b) : document.querySelectorAll(a));
			} 
			catch (ex) 
			{
			}
		};
	}
	return function(a, b)
	{
		var J = JELLY, toArray = J.toArray, getNext = J.getNext, getPrevious = J.getPrevious, IE = J.browser.ie, win = window, doc = win.document, loc = win.location, rootElement = doc.documentElement, unMark = function(collection, mark)
		{
			var n = collection.length, i = 0;
			for (i; i < n; i++) 
			{
				collection[i][mark] = undefined;
			}
		}, contains = function()
		{
			if (rootElement.contains) 
			{
				return function(needle, haystack)
				{
					return haystack.contains(needle);
				};
			}
			return function(needle, haystack)
			{
				return !!(haystack.compareDocumentPosition(needle) & 16);
			};
		}
(), mergeId = function(tkn)
		{
			var tag = tkn.val[0], id = tkn.val[1];
			if (tkn.mode === 'filter') 
			{
				var tags = collection, n = collection.length, i = 0;
				for (i; i < n; i++) 
				{
					if (tag) 
					{
						if ((tags[i].tagName.toLowerCase() === tag && tags[i].id === id) !== tkn.not) 
						{
							tmp[tmp.length] = tags[i];
						}
					}
					else 
						if ((tags[i].id === id) !== tkn.not) 
						{
							tmp[tmp.length] = tags[i];
						}
					if (!tkn.not && tmp[0]) 
					{
						return;
					}
				}
			}
			else 
			{
				if (!tag) 
				{
					tmp[0] = doc.getElementById(id);
				}
				else 
				{
					var elem = doc.getElementById(id);
					if (elem && elem.tagName.toLowerCase() === tag) 
					{
						tmp[0] = elem;
					}
				}
				if (!firstRun && tmp[0]) 
				{
					var tags = collection, n = collection.length, flag = false, i = 0;
					for (i; i < n; i++) 
					{
						if (contains(tmp[0], tags[i])) 
						{
							flag = true;
							break;
						}
					}
					if (!flag) 
					{
						tmp[0] = null;
					}
				}
			}
		}, mergeTags = function(tkn)
		{
			var tags, n, test, i = 0, extra = (tkn.val === '*' && IE);
			if (firstRun) 
			{
				tags = doc.getElementsByTagName(tkn.val);
				n = tags.length;
				for (i; i < n; i++) 
				{
					if (extra) 
					{
						if (tags[i].nodeType === 1) 
						{
							tmp[tmp.length] = tags[i];
						}
					}
					else 
					{
						tmp[tmp.length] = tags[i];
					}
				}
			}
			else 
				if (tkn.not || tkn.mode === 'filter') 
				{
					tags = collection;
					n = tags.length;
					test = tkn.val.toUpperCase();
					for (i; i < n; i++) 
					{
						if ((tags[i].nodeName.toUpperCase() === test) !== tkn.not) 
						{
							tmp[tmp.length] = tags[i];
						}
					}
				}
				else 
				{
					tags = collection;
					n = tags.length;
					for (i; i < n; i++) 
					{
						var tags2 = tags[i].getElementsByTagName(tkn.val), n2 = tags2.length, j;
						for (j = 0; j < n2; j++) 
						{
							if (extra) 
							{
								if (tags2[j].nodeType === 1) 
								{
									tmp[tmp.length] = tags2[j];
								}
							}
							else 
							{
								tmp[tmp.length] = tags2[j];
							}
						}
					}
				}
		}, mergeClass = function(tkn)
		{
			var tags = collection, val = tkn.val, not = tkn.not, n = tags.length, i = 0;
			if (tkn.mode === 'fetch') 
			{
				if (firstRun) 
				{
					tmp = toArray(doc.getElementsByClassName(val));
				}
				else 
				{
					for (i; i < n; i++) 
					{
						var tags2 = tags[i].getElementsByClassName(val), n2 = tags2.length, j = 0;
						for (j; j < n2; j++) 
						{
							tmp[tmp.length] = tags2[j];
						}
					}
				}
			}
			else 
			{
				var patt = new RegExp('(^|\\s)' + val + '(\\s|$)'), cn;
				for (i; i < n; i++) 
				{
					cn = tags[i].className;
					if (!cn) 
					{
						if (not) 
						{
							tmp[tmp.length] = tags[i];
						}
						continue;
					}
					if (patt.test(cn) !== not) 
					{
						tmp[tmp.length] = tags[i];
					}
				}
			}
		}, attributeTests = {
			'=': function(attr, val)
			{
				return attr === val;
			},
			'^=': function(attr, val)
			{
				return attr.indexOf(val) === 0;
			},
			'$=': function(attr, val)
			{
				return attr.substr(attr.length - val.length) === val;
			},
			'*=': function(attr, val)
			{
				return attr.indexOf(val) !== -1;
			},
			'|=': function(attr, val)
			{
				return attr.indexOf(val) === 0;
			},
			'~=': function(attr, val)
			{
				return (' ' + attr + ' ').indexOf(' ' + val + ' ') !== -1;
			}
		}, mergeAttribute = function(tkn)
		{
			var tags = collection, n = tags.length, getAttribute = J.getAttribute, attrValue = tkn.val, i = 0;
			if (/=/.test(attrValue)) 
			{
				var parts = /([\w-]+)([^=]?=)(.+)/.exec(attrValue), attr, mode = attributeTests, val = tkn.spValue !== undefined ? tkn.spValue : parts[3];
				for (i; i < n; i++) 
				{
					attr = getAttribute(tags[i], parts[1]);
					if ((attr !== null && mode[parts[2]](attr, val)) !== tkn.not) 
					{
						tmp[tmp.length] = tags[i];
					}
				}
			}
			else 
			{
				for (i; i < n; i++) 
				{
					if ((getAttribute(tags[i], attrValue) !== null) !== tkn.not) 
					{
						tmp[tmp.length] = tags[i];
					}
				}
			}
		}, mergeDirectSibling = function(tkn)
		{
			var tags = collection, n = tags.length, next, i = 0;
			for (i; i < n; i++) 
			{
				next = getNext(tags[i]);
				if (next) 
				{
					tmp[tmp.length] = next;
				}
			}
		}, mergeAdjacentSibling = function(tkn)
		{
			var tags = collection, n = tags.length, store = [], sibs = [], i = 0;
			for (i; i < n; i++) 
			{
				var parental = tags[i].parentNode;
				parental.__jelly = true;
				store[store.length] = {
					parent: parental,
					child: tags[i]
				};
			}
			for (i = 0; i < store.length; i++) 
			{
				if (store[i].parent.__jelly !== undefined) 
				{
					store[i].parent.__jelly = undefined;
					sibs[sibs.length] = store[i].child;
				}
			}
			for (i = 0; i < sibs.length; i++) 
			{
				var next = sibs[i].nextSibling;
				while (next) 
				{
					if (next.nodeType === 1) 
					{
						tmp[tmp.length] = next;
					}
					next = next.nextSibling;
				}
			}
		}, filterChildren = function()
		{
			var tags = collection, n = tags.length, n2 = tmp.length, result = [], i = 0;
			for (i; i < n2; i++) 
			{
				var parentElem = tmp[i].parentNode;
				for (var j = 0; j < n; j++) 
				{
					if (tags[j] === parentElem) 
					{
						result[result.length] = tmp[i];
						break;
					}
				}
			}
			tmp = result;
		}, mergePseudo = function(tkn)
		{
			var tags = collection, n = tags.length, i = 0;
			if (/^(nth-|first-of|last-of)/.test(tkn.kind)) 
			{
				tmp = pseudoTests[tkn.kind](tags, tkn);
			}
			else 
				if (tkn.kind === 'root' && !tkn.not) 
				{
					tmp[0] = rootElement;
				}
				else 
					if (tkn.kind === 'target' && !tkn.not) 
					{
						var hash = loc.href.split('#')[1] || null;
						tmp[0] = doc.getElementById(hash) || doc.getElementsByName(hash)[0];
					}
					else 
					{
						for (i; i < n; i++) 
						{
							if (pseudoTests[tkn.kind](tags[i], tkn) !== tkn.not) 
							{
								tmp[tmp.length] = tags[i];
							}
						}
					}
		}, parseNthExpr = function(expr)
		{
			var obj = {};
			obj.direction = /^\-/.test(expr) ? 'neg' : 'pos';
			if (/^n$/.test(expr)) 
			{
				obj.mode = 'all';
				return obj;
			}
			else 
				if (/^\d+$/.test(expr)) 
				{
					obj.mode = 'child';
					obj.val = parseInt(expr, 10);
					return obj;
				}
			obj.mode = 'an+b';
			if (/^(even|2n|2n\+2)$/.test(expr)) 
			{
				obj.oddEven = 0;
			}
			else 
				if (/^(odd|2n\+1)$/.test(expr)) 
				{
					obj.oddEven = 1;
				}
			var pts = expr.split('n');
			obj.start = pts[1] ? parseInt(pts[1], 10) : 1;
			obj.jump = pts[0] && !/^\-$/.test(pts[0]) ? parseInt(pts[0].replace(/^\-/, ''), 10) : 1;
			return obj;
		}, nthChildFilter = function(collection, expr, oftype, last, not)
		{
			expr = parseNthExpr(expr);
			if (expr.mode === 'all') 
			{
				return collection;
			}
			var result = [], parentCache = [], n = collection.length, i = 0, nodeName = collection[0].nodeName, testType = oftype ? function(el)
			{
				return el.nodeType === 1 && el.nodeName === nodeName;
			}
 : function(el)
			{
				return el.nodeType === 1;
			}, append = function(cond)
			{
				if (cond) 
				{
					result[result.length] = collection[i];
				}
			};
			for (i; i < n; i++) 
			{
				var pnt = collection[i].parentNode, c = 1;
				if (!pnt._indexedChilden) 
				{
					parentCache[parentCache.length] = pnt;
					if (!last) 
					{
						for (var el = pnt.firstChild; el; el = el.nextSibling) 
						{
							if (testType(el)) 
							{
								el.nodeIndex = c++;
							}
						}
					}
					else 
					{
						for (var el = pnt.lastChild; el; el = el.previousSibling) 
						{
							if (testType(el)) 
							{
								el.nodeIndex = c++;
							}
						}
					}
					pnt._indexedChilden = true;
				}
				if (expr.mode === 'child') 
				{
					append(((collection[i].nodeIndex === expr.val) !== not));
				}
				else 
					if (expr.oddEven !== undefined) 
					{
						append((collection[i].nodeIndex % 2 === expr.oddEven) !== not);
					}
					else 
					{
						if (expr.direction === 'pos') 
						{
							if (collection[i].nodeIndex < expr.start) 
							{
								if (not) 
								{
									append(true);
								}
								else 
								{
									continue;
								}
							}
							else 
							{
								append(((collection[i].nodeIndex - expr.start) % expr.jump === 0) !== not);
							}
						}
						else 
						{
							if (collection[i].nodeIndex > expr.start) 
							{
								if (not) 
								{
									append(true);
								}
								else 
								{
									continue;
								}
							}
							else 
							{
								append(((expr.start - collection[i].nodeIndex) % expr.jump === 0) !== not);
							}
						}
					}
			}
			unMark(parentCache, '_indexedChilden');
			return expr.direction === 'neg' ? result.reverse() : result;
		}, pseudoTests = {
			'nth-child': function(tags, tkn)
			{
				return nthChildFilter(tags, tkn.val, false, false, tkn.not);
			},
			'nth-of-type': function(tags, tkn)
			{
				return nthChildFilter(tags, tkn.val, true, false, tkn.not);
			},
			'nth-last-child': function(tags, tkn)
			{
				return nthChildFilter(tags, tkn.val, false, true, tkn.not);
			},
			'nth-last-of-type': function(tags, tkn)
			{
				return nthChildFilter(tags, tkn.val, true, true, tkn.not);
			},
			'first-of-type': function(tags, tkn)
			{
				return nthChildFilter(tags, '1', true, false, tkn.not);
			},
			'last-of-type': function(tags, tkn)
			{
				return nthChildFilter(tags, '1', true, true, tkn.not);
			},
			'only-child': function(el)
			{
				return !getNext(el) && !getPrevious(el);
			},
			'only-of-type': function(el)
			{
				var tags = el.parentNode.getElementsByTagName(el.nodeName);
				if (tags.length === 1 && tags[0].parentNode === el.parentNode) 
				{
					return true;
				}
				else 
				{
					var bool = true, n = tags.length, i = 0, c = 0;
					for (i; i < n; i++) 
					{
						if (el.parentNode === tags[i].parentNode) 
						{
							c++;
							if (c > 1) 
							{
								return false;
							}
						}
					}
					return true;
				}
			},
			'first-child': function(el)
			{
				return !getPrevious(el);
			},
			'last-child': function(el)
			{
				return !getNext(el);
			},
			'checked': function(el)
			{
				return el.checked;
			},
			'enabled': function(el)
			{
				return !el.disabled;
			},
			'disabled': function(el)
			{
				return el.disabled;
			},
			'empty': function(el)
			{
				return !el.firstChild;
			},
			'lang': function(el, tkn)
			{
				return el.getAttribute('lang') === tkn.val;
			},
			'root': function(el)
			{
				return el === rootElement;
			},
			'target': function(el)
			{
				var hash = loc.href.split('#')[1] || null;
				return el.id === hash || el.name === hash;
			}
		}, filterUnique = function(collection)
		{
			var c, n = collection.length, uniques = [];
			while (n) 
			{
				c = collection[--n];
				if (!c.__jelly) 
				{
					c.__jelly = true;
					uniques[uniques.length] = c;
				}
			}
			n = uniques.length;
			while (n) 
			{
				uniques[--n].__jelly = undefined;
			}
			return uniques.reverse();
		}, parseTokenComponent = function(part, fetchOrFilter)
		{
			var obj = {
				mode: fetchOrFilter ? 'fetch' : 'filter',
				not: false
			};
			if (/^(\w+)?#[^\s]+$/.test(part)) 
			{
				obj.type = 'ID';
				obj.val = part.split('#');
			}
			else 
				if (/^(\w+|\*)$/.test(part)) 
				{
					obj.type = 'TAG';
					obj.val = part;
				}
				else 
					if (/^\.[^\s]+$/.test(part)) 
					{
						obj.type = 'CLASS';
						obj.val = part.replace(/^\./, '');
					}
					else 
						if (/^\[[^\s]+$/.test(part)) 
						{
							obj.type = 'ATTR';
							obj.val = part.replace(/^\[|\]$/g, '');
						}
						else 
							if (/^\+|>|~$/.test(part)) 
							{
								obj.type = 'COMBI';
								obj.val = part;
							}
							else 
								if (/^\:not[\s\S]+$/.test(part)) 
								{
									var tmp = part.replace(/^\:not\(|\)$/g, '');
									obj = parseTokenComponent(tmp);
									obj.not = true;
								}
								else 
									if (/^:[^\s]+$/.test(part)) 
									{
										var tmp = part.replace(/^\:|\)$/g, '').split('(');
										obj.type = 'PSEUDO';
										obj.kind = tmp[0];
										obj.val = tmp[1];
									}
			return obj;
		}, parseSelector = function(feed)
		{
			// Seperate out the combinators + > ~, then split
			var result = [], parts = feed.replace(/(>|~(?!=)|\+(?!\d))/g, ' $1 ').normalize().split(' '), universal = {
				mode: 'fetch',
				type: 'TAG',
				val: '*'
			}, getByClass = 'getElementsByClassName' in doc, sibling = false;
			for (var i = 0; i < parts.length; i++) 
			{
				var tmp = parts[i].replace(/([^\(\#\.\[])(:)/g, '$1 $2').replace(/([^\(])(\[|\.)/g, '$1 $2').replace(/\:not\(\s*/g, ':not(').trim().split(' ');
				for (var j = 0; j < tmp.length; j++) 
				{
					var obj = parseTokenComponent(tmp[j], !j);
					if (sibling) 
					{
						obj.mode = 'filter';
					}
					else 
						if (j === 0 && (/PSEUDO|ATTR/.test(obj.type) || (obj.type === 'CLASS' && !getByClass) || obj.not)) 
						{
							result[result.length] = universal;
							obj.mode = 'filter';
						}
					if (tmp[j].indexOf(uniqueKey) !== -1) 
					{
						obj[obj.type === 'ATTR' ? 'spValue' : 'val'] = strings.shift();
					}
					result[result.length] = obj;
					sibling = /^(~|\+)$/.test(obj.val);
				}
			}
			result.postFilter = !(parts.length === 1 || parts.length === 3 && /^[\+~]$/.test(parts[1]));
			return result;
		};
		
		/* ---------------------------------------------------------------------------------------- */
		var selector = b || a, quoteMarkTest = /('|")([^\1]*?)\1/, Q = J.Q, uniqueKey = Q.uniqueKey, strings = Q.strings, m;
		
		if (Q.firstRun) 
		{
			while (selector.indexOf(uniqueKey) !== -1) 
			{
				uniqueKey += uniqueKey;
			}
			m = quoteMarkTest.exec(selector);
			while (m) 
			{
				strings[strings.length] = m[2];
				selector = selector.split(m[0]);
				selector =[selector[0],uniqueKey,selector[1]] .join('');
				m = quoteMarkTest.exec(selector);
			}
		}
		
		// Split and recurse for comma chained selectors
		if (/,/.test(selector)) 
		{
			var combo = [], parts = selector.split(','), i = 0;
			Q.firstRun = false;
			for (i; i < parts.length; i++) 
			{
				combo = combo.concat(Q(parts[i]));
			}
			Q.firstRun = true;
			return filterUnique(combo);
		}
		
		var tokens = parseSelector(selector), collection = b ? [a] : [], firstRun = true && !b, children = null, k = 0;
		
		for (k; k < tokens.length; k++) 
		{
			var tmp = [], tkn = tokens[k];
			switch (tkn.type)
			{
				case 'ID':
					mergeId(tkn);
					break;
				case 'TAG':
					mergeTags(tkn);
					break;
				case 'CLASS':
					mergeClass(tkn);
					break;
				case 'ATTR':
					mergeAttribute(tkn);
					break;
				case 'PSEUDO':
					mergePseudo(tkn);
					break
				case 'COMBI':
					if (tkn.val === '+') 
					{
						mergeDirectSibling(tkn);
					}
					else 
						if (tkn.val === '~') 
						{
							mergeAdjacentSibling(tkn);
						}
			}
			if (children) 
			{
				filterChildren();
			}
			if (tkn.val === '>') 
			{
				children = true;
				continue;
			}
			if (!tmp[0]) 
			{
				return [];
			}
			children = null;
			collection = tmp;
			firstRun = false;
		}
		if (tokens.postFilter) 
		{
			return filterUnique(collection);
		}
		return collection;
	};
}
();
JELLY.Q.strings = [];
JELLY.Q.uniqueKey = '@@';
JELLY.Q.firstRun = true;

/*! 
 Ajax Class */
JELLY.Ajax = function(file, data, opts)
{
	var t = this;
	t.file = file;
	t.data = data || null;
	JELLY.extend(t, opts);
};
JELLY.Ajax.prototype = {
	onSuccess: function()
	{
	},
	onComplete: function()
	{
	},
	onTimeout: function()
	{
	},
	timeout: 15000,
	noCache: false,
	async: true,
	requestHeaders: {},
	method: 'GET',
	cleanUp: true,
	send: function()
	{
		var t = this, xhr;
		xhr = t.xhr = t.getXHR();
		if (t.inProgress || !xhr) 
		{
			return false;
		}
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState === 4 &&
			((xhr.status >= 200 && xhr.status < 300) ||
			xhr.status === 304 ||
			(xhr.status === undefined && JELLY.browser.webkit))) 
			{
				clearTimeout(t.timer);
				t.onSuccess.call(xhr);
				t.onComplete.call(xhr);
				if (t.cleanUp) 
				{
					xhr = null;
				}
			}
		};
		if (/get/i.test(t.method)) 
		{
			if (t.noCache) 
			{
				t.requestHeaders['If-Modifed-Since'] = 'Sat, 1 Jan 2000 00:00:00 GMT';
			}
			t.file += '?' + t.data;
			t.data = null;
		}
		else 
			if (/post/i.test(t.method)) 
			{
				t.requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
				t.requestHeaders['Content-length'] = t.data.length;
			}
		t.timer = setTimeout(function()
		{
			xhr.abort();
			t.onTimeout();
		}, t.timeout);
		xhr.open(t.method.toUpperCase(), t.file, t.async);
		for (var i in t.requestHeaders) 
		{
			xhr.setRequestHeader(i, t.requestHeaders[i]);
		}
		xhr.send(t.data);
		return true;
	},
	getXHR: function()
	{
		if ('XMLHttpRequest' in window) 
		{
			return function()
			{
				return new XMLHttpRequest();
			};
		}
		return function()
		{
			var xhr = false;
			try 
			{
				xhr = new ActiveXObject('Msxml2.XMLHTTP');
			} 
			catch (ex) 
			{
				try 
				{
					xhr = new ActiveXObject('Microsoft.XMLHTTP');
				} 
				catch (ex) 
				{
				}
			}
			return xhr;
		};
	}
()
};

JELLY.Ajax.getFormParams = function(form)
{
	form = JELLY.parseElement(form);
	var append = function(name, val)
	{
		data[data.length] = name + '=' + encodeURIComponent(val).replace(/%20/g, '+');
	}, data = [], i = 0;
	for (i; i < form.elements.length; i++) 
	{
		var field = form.elements[i], name = field.name, value = field.value;
		switch (field.type.toLowerCase())
		{
			case 'checkbox':
				if (field.checked) 
				{
					append(name, value || 'on');
				}
				break;
			case 'radio':
				if (field.checked) 
				{
					append(name, value);
				}
				break;
			case 'text':
			case 'select':
			case 'textarea':
				append(name, value);
		}
	}
	return data.join('&');
};

JELLY.Ajax.formSubmit = function(form, file, callback)
{
	form = JELLY.parseElement(form);
	var J = JELLY, opts = {
		method: 'post',
		requestHeaders: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}, ajax = new J.Ajax(file, J.Ajax.getFormParams(form), opts), handler = function(e)
	{
		ajax.data = J.Ajax.getFormParams(form);
		if (ajax.send()) 
		{
			J.stopEvent(e);
		}
	};
	ajax.onSuccess = callback ||
	function()
	{
	};
	J.addEvent(form, 'submit', handler);
};

/*! 
 Animation Module. Credits: Moofx, Transition equations by Robert Penner. */
JELLY.Transitions = {
	linear: function(B, A, D, C)
	{
		return D * B / C + A
	},
	quadIn: function(B, A, D, C)
	{
		return D * (B /= C) * B + A
	},
	quadOut: function(B, A, D, C)
	{
		return -D * (B /= C) * (B - 2) + A
	},
	quadInOut: function(B, A, D, C)
	{
		if ((B /= C / 2) < 1) 
		{
			return D / 2 * B * B + A
		}
		return -D / 2 * ((--B) * (B - 2) - 1) + A
	},
	cubicIn: function(B, A, D, C)
	{
		return D * (B /= C) * B * B + A
	},
	cubicOut: function(B, A, D, C)
	{
		return D * ((B = B / C - 1) * B * B + 1) + A
	},
	cubicInOut: function(B, A, D, C)
	{
		if ((B /= C / 2) < 1) 
		{
			return D / 2 * B * B * B + A
		}
		return D / 2 * ((B -= 2) * B * B + 2) + A
	},
	quartIn: function(B, A, D, C)
	{
		return D * (B /= C) * B * B * B + A
	},
	quartOut: function(B, A, D, C)
	{
		return -D * ((B = B / C - 1) * B * B * B - 1) + A
	},
	quartInOut: function(B, A, D, C)
	{
		if ((B /= C / 2) < 1) 
		{
			return D / 2 * B * B * B * B + A
		}
		return -D / 2 * ((B -= 2) * B * B * B - 2) + A
	},
	quintIn: function(B, A, D, C)
	{
		return D * (B /= C) * B * B * B * B + A
	},
	quintOut: function(B, A, D, C)
	{
		return D * ((B = B / C - 1) * B * B * B * B + 1) + A
	},
	quintInOut: function(B, A, D, C)
	{
		if ((B /= C / 2) < 1) 
		{
			return D / 2 * B * B * B * B * B + A
		}
		return D / 2 * ((B -= 2) * B * B * B * B + 2) + A
	},
	sineIn: function(B, A, D, C)
	{
		return -D * Math.cos(B / C * (Math.PI / 2)) + D + A
	},
	sineOut: function(B, A, D, C)
	{
		return D * Math.sin(B / C * (Math.PI / 2)) + A
	},
	sineInOut: function(B, A, D, C)
	{
		return -D / 2 * (Math.cos(Math.PI * B / C) - 1) + A
	},
	expoIn: function(B, A, D, C)
	{
		return (B == 0) ? A : D * Math.pow(2, 10 * (B / C - 1)) + A
	},
	expoOut: function(B, A, D, C)
	{
		return (B == C) ? A + D : D * (-Math.pow(2, -10 * B / C) + 1) + A
	},
	expoInOut: function(B, A, D, C)
	{
		if (B == 0) 
		{
			return A
		}
		if (B == C) 
		{
			return A + D
		}
		if ((B /= C / 2) < 1) 
		{
			return D / 2 * Math.pow(2, 10 * (B - 1)) + A
		}
		return D / 2 * (-Math.pow(2, -10 * --B) + 2) + A
	},
	circIn: function(B, A, D, C)
	{
		return -D * (Math.sqrt(1 - (B /= C) * B) - 1) + A
	},
	circOut: function(B, A, D, C)
	{
		return D * Math.sqrt(1 - (B = B / C - 1) * B) + A
	},
	circInOut: function(B, A, D, C)
	{
		if ((B /= C / 2) < 1) 
		{
			return -D / 2 * (Math.sqrt(1 - B * B) - 1) + A
		}
		return D / 2 * (Math.sqrt(1 - (B -= 2) * B) + 1) + A
	},
	elasticIn: function(C, A, G, F, B, E)
	{
		if (C == 0) 
		{
			return A
		}
		if ((C /= F) == 1) 
		{
			return A + G
		}
		if (!E) 
		{
			E = F * 0.3
		}
		if (!B) 
		{
			B = 1
		}
		if (B < Math.abs(G)) 
		{
			B = G;
			var D = E / 4
		}
		else 
		{
			var D = E / (2 * Math.PI) * Math.asin(G / B)
		}
		return -(B * Math.pow(2, 10 * (C -= 1)) * Math.sin((C * F - D) * (2 * Math.PI) / E)) + A
	},
	elasticOut: function(C, A, G, F, B, E)
	{
		if (C == 0) 
		{
			return A
		}
		if ((C /= F) == 1) 
		{
			return A + G
		}
		if (!E) 
		{
			E = F * 0.3
		}
		if (!B) 
		{
			B = 1
		}
		if (B < Math.abs(G)) 
		{
			B = G;
			var D = E / 4
		}
		else 
		{
			var D = E / (2 * Math.PI) * Math.asin(G / B)
		}
		return B * Math.pow(2, -10 * C) * Math.sin((C * F - D) * (2 * Math.PI) / E) + G + A
	},
	elasticInOut: function(C, A, G, F, B, E)
	{
		if (C == 0) 
		{
			return A
		}
		if ((C /= F / 2) == 2) 
		{
			return A + G
		}
		if (!E) 
		{
			E = F * (0.3 * 1.5)
		}
		if (!B) 
		{
			B = 1
		}
		if (B < Math.abs(G)) 
		{
			B = G;
			var D = E / 4
		}
		else 
		{
			var D = E / (2 * Math.PI) * Math.asin(G / B)
		}
		if (C < 1) 
		{
			return -0.5 * (B * Math.pow(2, 10 * (C -= 1)) * Math.sin((C * F - D) * (2 * Math.PI) / E)) + A
		}
		return B * Math.pow(2, -10 * (C -= 1)) * Math.sin((C * F - D) * (2 * Math.PI) / E) * 0.5 + G + A
	},
	backOffset: 1.70158,
	backIn: function(B, A, E, D, C)
	{
		if (!C) 
		{
			C = JELLY.Transitions.backOffset
		}
		return E * (B /= D) * B * ((C + 1) * B - C) + A
	},
	backOut: function(B, A, E, D, C)
	{
		if (!C) 
		{
			C = JELLY.Transitions.backOffset
		}
		return E * ((B = B / D - 1) * B * ((C + 1) * B + C) + 1) + A
	},
	backInOut: function(B, A, E, D, C)
	{
		if (!C) 
		{
			C = JELLY.Transitions.backOffset
		}
		if ((B /= D / 2) < 1) 
		{
			return E / 2 * (B * B * (((C *= (1.525)) + 1) * B - C)) + A
		}
		return E / 2 * ((B -= 2) * B * (((C *= (1.525)) + 1) * B + C) + 2) + A
	},
	bounceIn: function(B, A, D, C)
	{
		return D - JELLY.Transitions.bounceOut(C - B, 0, D, C) + A
	},
	bounceOut: function(B, A, D, C)
	{
		if ((B /= C) < (1 / 2.75)) 
		{
			return D * (7.5625 * B * B) + A
		}
		else 
		{
			if (B < (2 / 2.75)) 
			{
				return D * (7.5625 * (B -= (1.5 / 2.75)) * B + 0.75) + A
			}
			else 
			{
				if (B < (2.5 / 2.75)) 
				{
					return D * (7.5625 * (B -= (2.25 / 2.75)) * B + 0.9375) + A
				}
				else 
				{
					return D * (7.5625 * (B -= (2.625 / 2.75)) * B + 0.984375) + A
				}
			}
		}
	},
	bounceInOut: function(B, A, D, C)
	{
		if (B < C / 2) 
		{
			return JELLY.Transitions.bounceIn(B * 2, 0, D, C) * 0.5 + A
		}
		return JELLY.Transitions.bounceOut(B * 2 - C, 0, D, C) * 0.5 + D * 0.5 + A
	}
};

JELLY.Tween = function(el, opts)
{
	this.el = JELLY.getElement(el);
	JELLY.extend(this, opts ||
	{});
};
JELLY.Tween.prototype = {
	transition: JELLY.Transitions.sineInOut,
	duration: 500,
	unit: 'px',
	timerSpeed: 20,
	onComplete: function()
	{
	},
	setDuration: function(val)
	{
		this.duration = val;
		return this;
	},
	setTransition: function(val)
	{
		this.transition = JELLY.Transitions[val];
		return this;
	},
	setOpacity: function(val)
	{
		JELLY.setOpacity(this.el, val);
		return this;
	},
	chain: function(fn)
	{
		this.chains = this.chains || [];
		this.chains.push(fn);
		return this;
	},
	stop: function()
	{
		clearInterval(this.timer);
		this.timer = null;
		return this;
	},
	start: function(props, values)
	{
		var t = this, J = JELLY, isArray = J.isArray, parseColour = J.Str.parseColour, getStyle = J.getStyle;
		if (t.timer) 
		{
			clearInterval(t.timer);
		}
		if (isArray(props)) 
		{
			t.props = props;
			t.vals = values;
		}
		else 
		{
			t.props = [props];
			t.vals = [values];
		}
		var i = t.vals.length - 1;
		do 
		{
			t.props[i] = J.Str.toCamelCase(t.props[i]);
			if (/color/i.test(t.props[i])) 
			{
				if (!isArray(t.vals[i])) 
				{
					t.vals[i] = [parseColour(getStyle(t.el, t.props[i]), 'rgb-array'), parseColour(t.vals[i], 'rgb-array')];
				}
				else 
				{
					t.vals[i] = [parseColour(t.vals[i][0], 'rgb-array'), parseColour(t.vals[i][1], 'rgb-array')];
				}
				t.vals[i].color = true;
			}
			else 
				if (/backgroundPosition/.test(t.props[i])) 
				{
					if (!isArray(t.vals[i])) 
					{
						t.vals[i] = [[0, t.vals[i]], [0, 0]];
					}
					else 
						if (!isArray(t.vals[i][0])) 
						{
							t.vals[i] = [[0, t.vals[i][0]], [0, t.vals[i][1]]];
						}
					t.vals[i].backgroundPosition = true;
				}
				else 
				{
					if (!isArray(t.vals[i])) 
					{
						t.vals[i] = [getStyle(t.el, t.props[i], true), t.vals[i]];
					}
				}
		}
		while (i--)
		t.startTime = new Date().getTime();
		t.timer = setInterval(function()
		{
			t.step.call(t)
		}, t.timerSpeed);
		return t;
	},
	step: function()
	{
		var t = this, currentTime = new Date().getTime();
		if (currentTime < t.startTime + t.duration) 
		{
			t.elapsedTime = currentTime - t.startTime;
		}
		else 
		{
			t.stop();
			t.tidyUp();
			t.onComplete();
			return t.callChain();
		}
		t.increase();
	},
	tidyUp: function()
	{
		var t = this, i = t.props.length - 1;
		do 
		{
			if (t.vals[i].color) 
			{
				t.el.style[t.props[i]] = 'rgb(' + t.vals[i][1].join(',') + ')';
			}
			else 
				if (t.vals[i].backgroundPosition) 
				{
					t.el.style.backgroundPosition = t.vals[i][0][1] + t.unit + ' ' +
					t.vals[i][1][1] +
					t.unit;
				}
				else 
				{
					t.setStyle(t.props[i], t.vals[i][1]);
				}
		}
		while (i--)
	},
	increase: function()
	{
		var t = this, i = t.props.length - 1;
		do 
		{
			if (t.vals[i].color) 
			{
				t.el.style[t.props[i]] = 'rgb(' +
				Math.round(t.compute(t.vals[i][0][0], t.vals[i][1][0])) +
				',' +
				Math.round(t.compute(t.vals[i][0][1], t.vals[i][1][1])) +
				',' +
				Math.round(t.compute(t.vals[i][0][2], t.vals[i][1][2])) +
				')'
			}
			else 
				if (t.vals[i].backgroundPosition) 
				{
					t.el.style.backgroundPosition = t.compute(t.vals[i][0][0], t.vals[i][0][1]) + t.unit + ' ' +
					t.compute(t.vals[i][1][0], t.vals[i][1][1]) +
					t.unit;
				}
				else 
				{
					t.setStyle(t.props[i], t.compute(t.vals[i][0], t.vals[i][1]));
				}
		}
		while (i--)
	},
	compute: function(from, to)
	{
		return this.transition(this.elapsedTime, from, (to - from), this.duration);
	},
	setStyle: function(p, val)
	{
		if (p === 'opacity') 
		{
			this.setOpacity(val);
		}
		else 
		{
			this.el.style[p] = val + this.unit;
		}
	},
	setBackgroundPosition: function(val)
	{
		this.el.style.backgroundPosition = val[0] + this.unit + ' 0';
	},
	callChain: function()
	{
		var t = this;
		if (t.chains && t.chains.length) 
		{
			setTimeout(function()
			{
				(t.chains.shift()).call(t)
			}, 10);
		}
	}
};

/*! 
 Scroll Class */
JELLY.Scroll = function(el, opts)
{
	this.el = JELLY.getElement(el);
	JELLY.extend(this, opts ||
	{});
};
JELLY.Scroll.prototype = JELLY.extend(new JELLY.Tween(), {
	start: function(x, y)
	{
		var t = this, J = JELLY, el = t.el, isArray = J.isArray;
		if (t.timer) 
		{
			clearInterval(t.timer);
		}
		if (el === window) 
		{
			var winpos = J.getWindowScroll();
			if (!isArray(x)) 
			{
				x = [winpos[0], x];
			}
			if (!isArray(y)) 
			{
				y = [winpos[1], y];
			}
			t.increase = function()
			{
				el.scrollTo(t.compute(t.vals[0][0], t.vals[0][1]), t.compute(t.vals[1][0], t.vals[1][1]));
			};
		}
		else 
		{
			if (!isArray(x)) 
			{
				x = [el.scrollLeft, x];
			}
			if (!isArray(y)) 
			{
				y = [el.scrollTop, y];
			}
			t.increase = function()
			{
				el.scrollLeft = t.compute(t.vals[0][0], t.vals[0][1]);
				el.scrollTop = t.compute(t.vals[1][0], t.vals[1][1]);
			};
		}
		t.vals = [x, y];
		t.startTime = new Date().getTime();
		t.timer = setInterval(function()
		{
			t.step.call(t)
		}, t.timerSpeed);
		return t;
	},
	tidyUp: function()
	{
		var t = this;
		if (t.el === window) 
		{
			t.el.scrollTo(t.vals[0][1], t.vals[1][1]);
		}
		else 
		{
			t.el.scrollLeft = t.vals[0][1];
			t.el.scrollTop = t.vals[1][1];
		}
	}
});
