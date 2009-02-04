		
	/*	LEAF JavaScript Library
	 * 	Leonardo Dutra
	 *	v0.4a
	 *
	 *	CHANGES:
	 *
	 	todo:
	 		- test if replace would speedup getByClass RegExp mount
	 		- check best situations for using "while" or "for"
	 
	 	090202:
			- added getOffset
			- added setClasses and getClasses
			- removed offsets from getPosition and getSize returns
			
		090204:
			- added XMLHTTP version to IE XHR
			- added getAvailCenter to Screen
			- optimizations
	 */
	
	
	/* Check if exists */
	if ('object' !== typeof window.leaf) {
	    leaf = {};
	}
	
	
	/* Object
	 */
	leaf.Object = {
	    inherit: function(object, sourceObject)
	    {
	        if (object!==null && object!==undefined && sourceObject!==null && sourceObject!==undefined) {
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
					catch (e) {}
				}
	        }
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
	
	
	/* Screen
	 */
	leaf.Screen = {
	    getSize: function()
	    {
	        var S = screen;
	        return {
	            width:  S.width,
	            height: S.height
	        };
	    },
	    
	    getAvailSize: function()
	    {
	        var S = screen;
	        return {
	            width:  S.availWidth,
	            height: S.availHeight
	        };
	    },
	    
	    getCenter: function()
	    {
	        var S = screen;
	        return {
	            x: S.width  /2,
	            y: S.height /2
	        };
	    },
		
		getAvailCenter: function ()
		{
			var S = screen;
	        return {
	            x:  S.availWidth/2,
	            y: S.availHeight/2
	        };
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
	            var x = 'number' === typeof event.pageX ? event.pageX : event.clientX +D.scrollLeft -(D.clientLeft || 0);
	            var y = 'number' === typeof event.pageY ? event.pageY : event.clientY +D.scrollTop  -(D.clientLeft || 0);
	            return {
	                x: 0 < x ? x : 0,
	                y: 0 < y ? y : 0
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
	    /*	XML access may vary */
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
	        catch (o) {    }
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
	    rootNode = leaf.DOM.core.getElement(rootNode)||document;
	    if (tagNames instanceof Array) {
	        var l = tagNames.length;
	        var n = [];
			var i = 0;
			var j;
	        var k;
	        var o;
	        while(i < l) {
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
	    if (('string' === typeof classNames? [classNames] : classNames) instanceof Array) {
	        var $ = [];
	        var i = classNames.length;
	        var o;
	        var r = '';
	        while (i--) {
				r += classNames[i] +(i ? '|' : '');
	        }
	        r = new RegExp('(?:\\\s|^)(?:' +r +')(?:\\\s|$)');
	        function q(n)
	        {
	            if (n.nodeType===1 && r.test(n.className)) {
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
	    leaf.DOM.core.hasCollision(elementA, elementB);
	};
	
	leaf.DOM.purgeElement = function(element)
	{
	    leaf.DOM.core.purgeElement(element);
	};
	
	
	/* DOM Core
	 */
	leaf.DOM.core = {
	
	    addEvent: function(o, e, fn)
	    {
	        /* code by John Resig of JQuery */
	        if (o.addEventListener) {
	            o.addEventListener(e, fn, false);
	        }
	        else {
	            if (o.attachEvent) {
	                o['e' +e +fn] = fn;
	                o[e +fn] = function()
	                {
	                    o['e' + e + fn](window.event);
	                };
	                o.attachEvent('on'+ e, o[e + fn]);
	            }
	        }
	    },
	    
	    removeEvent: function(o, e, fn)
	    {
	        /* base code by John Resig of JQuery */
	        if (o.removeEventListener) {
	            o.removeEventListener(e, fn, false);
	        }
	        else {
	            if (o.detachEvent) {
	                o.detachEvent('on' +e, o[(e = e +fn)]);
	                o[e] = null;
	                o['e'+e] = null;
	            }
	        }
	    },
	    
	    hasCollision: function(a, b)
	    {
	        var g = this.getElement;
	        if ((a = g(a)) && (b = g(b))) {
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
	        if ((o = this.getElement(o))) {
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
	    
	    isHTML: function(o)
	    {
	        return o && o.nodeType === 1 && 'object' === typeof o.style;
	    },
	    
	    getElement: function($)
	    {
	        if ($) {
	            if ($.nodeType === 1 && 'object' === typeof $.style) {
	                return $;
	            }
	            return document.getElementById($);
	        }
	        return null;
	    },
		
		expObj: new RegExp(),
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
	    
	    setStyle: function(cssObj)
	    {
	        if (cssObj instanceof Object && !(cssObj instanceof Array))
	        {
	            var e = this.element;
	            if (e) {
	              	var ie = this.core.isIE;
	                var s = ie ? e.style.cssText : e.getAttribute('style');
					var r = this.core.expObj;
					var i;
					var k;
	                for (var n in cssObj) {
						if ('string'===typeof (k = cssObj[n])||'number'===typeof k) {
							r.compile('(?:^|\\\;|\s)' + n + '\\\:', 'i');
							if (-1 === (i = s ? s.search(r) : -1)) {
								s = n + '\: ' +k +'\; ' + s;
							}
							else {
								/* if property found, substitutes value... preventing errors on some browsers */
								s = s.substr(0, (i += n.length)) + ': ' +k + s.substr(s.indexOf('\;', i));
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
	    
	    getStyle: function(property)
	    {
	        if ('string' === typeof property) {
	            var o = this.element;
	            if (o) {
					var ie = this.core.isIE;
					if (ie ? e.style.cssText : e.getAttribute('style')) {
						var r = this.core.expObj;
						r.compile('(?:^|\\\;| )' + property + '\\\:', 'i');
						if (-1 < (i = o.search(r))) {
							return o.substring((i = o.indexOf(':', i)+2), (i = o.indexOf('\;', i))===-1 ?o.length:i);
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
				if ('string' === typeof classNames) {
					classNames = [classNames];
				}
				if (classNames instanceof Array) {
					var c = e.className;
					if ('string'===typeof c) {
						var l = classNames.length;
						var r = this.core.expObj;
						var i = 0;
						var k;
						while (i < l) {
							r.compile('(?:\\\s|^)' + (k = classNames[i++]) +'(?:\\\s|$)');
							if (!(r.test(c))) {
								c += ' '+k;
							}
						}
						e.className = c;
					}
				}
			}
		},
		
		removeClass: function (classNames) {
			var e = this.element;
			if (e) {
				if ('string' === typeof classNames) {
					classNames = [classNames];
				}
				if (classNames instanceof Array) {
					var c = e.className;
					if ('string'===typeof c) {
						var i = classNames.length;
						var r = this.core.expObj;
						var k;
						while (i--) {
							r.compile('(?:\\\s|^)' +(k = classNames[i]) +'(?:\\\s|$)');
							if ((c.search(r)!==-1)) {
								c = c.replace(k, '');
							}
						}
						e.className = c;
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
				
	            if ('number'===typeof y) {
	                if ($.bottom) {
	                    $.top = '';
	                    $.bottom = y+'px';
	                }
	                else {
	                    $.top = y+'px';
	                    $.bottom = '';
	                }
	            }
				else {
					if ('string'===typeof y) {
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
	        var e = this.element;
	        if (e) {
	            var $ = e.style;
	            
	            var x = $.left || $.right;
	            var y = $.top  || $.bottom;
	            var z = $.zIndex;
	            
	            if (!keepUnits) {
	                x = parseFloat(x) || 0;
	                y = parseFloat(y) || 0;
	            }
	            return {
	                x: x,
	                y: y,
	                z: z,
	                position: $.position
	            };
	        }
	        return {
	            x: 0,
	            y: 0,
	            z: 0,
	            position: ''
	        };
	    },
		
		getOffset: function ()
		{
			var e = this.element;
			if (e) {
				var x = e.offsetLeft;
				var y = e.offsetTop;
				return {
					left:   x,
					top:    y,
					width:  e.offsetWidth,
					height: e.offsetHeight,
					parent: e.offsetParent
				};
			}
			return {
				left:   0,
				top:    0,
				width:  0,
				height: 0,
				parent: null
			};
		},
	    
	    invertPosition: function(invertX, invertY)
	    {
	        var $ = this.style;
	        if ($) {
	            if (invertX) {
	                if ($.right) {
	                    $.left = $.right;
	                    $.right = '';
	                }
	                else {
	                    $.right = $.left;
	                    $.left = '';
	                }
	            }
	            if (invertY) {
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
	        var e = this.element;
	        if (e) {
	            var $ = e.style;
	            var w = $.width;
	            var h = $.height;
	            if (!keepUnits) {
	                w = parseFloat(w) || 0;
	                h = parseFloat(h) || 0;
	            }
	            return {
	                width: w,
	                height: h
	            };
	        }
	        return {
	            width: 0,
	            height: 0
	        };
	    },
	    
	    
	    /* Area */
	    
	    setArea: function(x, y, z, width, height, positionType)
	    {
	        this.setPosition(x, y, z, positionType);
	        this.setSize(width, height);
	    },
	    
	    getArea: function(keepUnits)
	    {
	        var o = this.getPosition(keepUnits);
	        leaf.Object.inherit(o, this.getSize(keepUnits));
	        return o;
	    },
	    
	    
	    /* Content */
	    
	    setContent: function(value)
	    {
	        if (value !== null && value !== undefined) {
	            var e = this.element;
	            if (e) {
	                e.innerHTML = value;
	            }
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
	        if (value !== null && value !== undefined) {
	            var e = this.element;
	            if (e) {
	                e.innerHTML += String(value);
	            }
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
	            
	            if (src !== null && src !== undefined) {
	                $.backgroundImage = 'url(\'' + src + '\')';
	            }
	            
	            var p = $.backgroundPosition.split(' ');
	            
	            x = 'number' === typeof x ? x + 'px' : 'string'===typeof x ? x:(p[0]||'50%');
	            y = 'number' === typeof y ? y + 'px' : 'string'===typeof y ? y:(p[1]||'50%');
	            
		        $.backgroundPosition = x +' ' +y;
	            $.backgroundRepeat = repeat ? repeat : 'no-repeat';
	        }
	    },
	    
	    getBackground: function(keepUnits)
	    {
	        var $ = this.style;
	        if ($) {
	            var p = $.backgroundPosition.split(' ');
	            var x = p[0];
	            var y = p[1];
	            
	            if (!keepUnits) {
	                x = parseFloat(x) || 0;
	                y = parseFloat(y) || 0;
	            }
	            return {
	                x: x,
	                y: y,
	                color: $.backgroundColor,
	                src: $.backgroundImage,
	                repeat: $.backgroundRepeat
	            };
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
	            if ('string'===typeof weight||'number'===typeof weight) {
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
	            if (useSmallCaps!==null && useSmallCaps!==undefined) {
	                $.fontVariant = useSmallCaps ? 'small-caps' : 'normal';
	            }
	        }
	    },
	    
	    getFont: function(keepUnits)
	    {
	        var $ = this.style;
	        if ($) {
	            var s = $.fontSize;
	            var p = $.letterSpacing;
	            var h = $.lineHeight;
	            
	            if (!keepUnits) {
	                s = parseFloat(s) || 0;
	                p = parseFloat(p) || 0;
	                h = parseFloat(h) || 0;
	            }
	            return {
	                color: $.color,
	                size: s,
	                family: $.fontFamily,
	                weight: $.fontWeight,
	                style: $.fontStyle,
	                spacing: p,
	                lineHeight: h,
	                variant: $.fontVariant
	            };
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
	        var w = this.style;
	        if (w) {
	            w = w.borderWidth;
	            if (!keepUnits) {
	                w = parseFloat(w) || 0;
	            }
	            return {
	                color: $.borderColor,
	                width: w,
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
	                $.paddingBottom = bottom+ 'px';
	            }
				else {
					if ('string' === typeof bottom) {
	                	$.paddingBottom = bottom;
	            	}
				}
				if ('number' === typeof left) {
	                $.paddingLeft = left +'px';
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
	            var t = $.paddingTop;
	            var r = $.paddingRight;
	            var b = $.paddingBottom;
	            var l = $.paddingLeft;
	            
	            if (!keepUnits) {
	                t = parseFloat(t) || 0;
	                r = parseFloat(r) || 0;
	                b = parseFloat(b) || 0;
	                l = parseFloat(l) || 0;
	            }
	            return {
	                top: t,
	                right: r,
	                bottom: b,
	                left: l
	            };
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
	                $.marginBottom = bottom+ 'px';
	            }
				else {
					if ('string' === typeof bottom) {
	                	$.marginBottom = bottom;
	            	}
				}
				if ('number' === typeof left) {
	                $.marginLeft = left +'px';
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
	            var t = $.marginTop;
	            var r = $.marginRight;
	            var b = $.marginBottom;
	            var l = $.marginLeft;
	            
	            if (!keepUnits) {
	                t = parseFloat(t) || 0;
	                r = parseFloat(r) || 0;
	                b = parseFloat(b) || 0;
	                l = parseFloat(l) || 0;
	            }
	            return {
	                top: t,
	                right: r,
	                bottom: b,
	                left: l
	            };
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
	            var s = $.wordSpacing;
	            var i = $.textIndent;
	            if (!keepUnits) {
	                s = parseFloat(s) || 0;
	                i = parseFloat(i) || 0;
	            }
	            return {
	                align: $.textAlign,
	                decoration: $.textDecoration,
	                wordSpacing: s,
	                whiteSpace: $.whiteSpace,
	                indent: i,
	                transform: $.textTransform
	            };
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
	                if (!(top < 0 || e.scrollHeight < top)) {
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
	                if (this.core.isIE) /* IE6, IE7 brute force for 'filters' attribute */
	                {
	                    var s = $.cssText;
	                    var i = s.search(/filter/i);
	                    $.cssText = s.substr(0, i) + 'filter: alpha(opacity=' + parseInt(opacity * 100, 10) + ')' + s.substr(s.indexOf('\;', i));
	                }
	                $.opacity = opacity;
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
	    },
	    
	    
	    /* Nodal */
	    
	    createElement: function(tagName, id, x, y, z, width, height, positionType)
	    {
	        if ('string' === typeof tagName) {
	            var e = document.createElement(tagName);
	            var $ = e.style;
	            if ('string' === typeof id) {
	                e.id = id;
	            }
	            this.setElement(e);
	            this.setArea(x, y, z, width, height, positionType);
	            return e;
	        }
	        return null;
	    },
	    
	    appendElement: function(parent)
	    {
	        var e = this.element;
	        if (e && !e.parentNode) {
	            var p = this.core.getElement(parent) || document.body;
	            if (p) {
	                p.appendChild(this.element);
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
	        var e = this.element;
	        if (e) {
	            if (this.core.isHTML(childNode)) {
	                e.appendChild(childNode);
	            }
	        }
	    },
	    
	    removeChild: function(childIndex)
	    {
	        var e = this.element;
	        if (e) {
	            var c = this.getChild(childIndex);
	            if (c && c.parentNode===e) {
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
	        if ('number' === typeof childIndex) {
	            var e = this.element;
	            if (e) {
	                return e.childNodes[childIndex] || null;
	            }
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
	        return this.core.hasCollision(this.element, collisorElement);
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
