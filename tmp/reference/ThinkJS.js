/**
 +-------------------------------------------------------------------------------------------
 * @project ThinkJS
 * @package src
 * @author Mc@Spring <Heresy.Mc@gmail.com>
 * @version $ID: Think.js Created on 2008-03-28 by Mc@Spring at 22:47:28 $
 * @todo TODO
 * @update Modified on 2008-03-28 by Mc@Spring at 22:47:28
 * @link http://groups.google.com/group/mspring
 * @copyright Copyright (C) 2008-2009 MC@Spring Team. All rights reserved.
 * @declare These are inspired by those found in
 *		prototype.js <http://prototypejs.org/>,
 * 	mootools.js <http://mootools.net/>,
 * 	jquery.js <http://jquery.com/>,
 * 	ext.js <http://extjs.com/>
 *
 *                                Licensed under The Apache License
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License
 +-------------------------------------------------------------------------------------------
 */
window['undefined']=window['undefined'];
/**
 * @class ThinkJS
 * ThinkJS core object
 * @singleton
 */
ThinkJS={version:'0.0.2'};

/**
 * @method apply
 * Copy all the properties of servant to main.
 * If defaults is provide that will also be applied for default values
 * @param {Object} The receiver of the properties
 * @param {Object} The source of the properties
 * @param {Object} The default of the properties
 * @return {Object}
 * @member ThinkJS
 */
ThinkJS.apply=function(main,servant,defaults){
	if(defaults){ThinkJS.apply(main,defaults);}
    if(servant && typeof servant=='object'){
		for(var ppt in servant){
			main[ppt]=servant[ppt];
		}
	}
    return main;
};

/**
 * @closure Void
 * ThinkJS core utilties and methods
 * Initialize and extend ThinkJS object properties
 * @param {Void}
 * @return {Void}
 * @singleton
 */
(function(){
	var ua=navigator.userAgent.toLowerCase();
	var opera=/opera/.test(ua),
		safari=/(webkid|khtml)/.test(ua),
		msie=(!opera&&/msie/.test(ua)),
		msie7=(!opera&&/msie 7/.test(ua)),
		mozilla=(!safari&&/mozilla/.test(ua)),
		strict=(document.compatMode=='CSS1Compat'),
		isBB=msie&&!strict;

	if(msie&&!msie7){ // remove IE6 css image flicker
        try{document.execCommand('BackgroundImageCache',false,true);}catch(e){}
    }

	ThinkJS.apply(ThinkJS,{
		isReady:false,
		opera:opera,
		safari:safari,
		msie:msie,
		msie7:msie7,
		mozilla:mozilla,
		strict:strict,
		isBB:isBB,
		debug:true,
		/**
		 * @method is
		 * Return true if the passed in object exists or is 0,otherwise return false.
		 * @param {Mixed} Object to inspect
		 * @return {Boolean}
		 * @member ThinkJS
		 */
		is:function(o){return !!(o||o===0);},
		/**
		 * @method def
		 * Return true if the passed in object is defined,that means is not null or undefined.
		 * @param {Mixed} Object to inspect
		 * @return {Boolean}
		 * @member ThinkJS
		 */
		def:function(o){return (o!=undefined);},
		/**
		 * @method type
		 * Return the type of object that is passed in.
		 * If the object passed in is null or undefined it return *null*.
		 * @param {Mixed} Object to inspect
		 * @return {String}
			[Returns]
				'boolean','number','string','array','regexp','function','object',
				'collection','element','textnode','whitespace',
				'class',
				null
			[/Returns]
		 * @member ThinkJS
		 */
		type:function(o){
			if(o==undefined){return;}
			if(o.htmlElement){return 'element';}
			var T=typeof o;
			if(T=='object'&&o.nodeName){
				switch(o.nodeType){
					case 1:	return 'element';
					case 3:	return (/\S/).test(o.nodeValue)?'textnode':'whitespace';
				}
			}
			if(T=='object'||T=='function'){
				switch(o.constructor){
					case Array:return 'array';
					case RegExp:return 'regexp';
					case this.SimpleObject:return 'class';
				}
				if(typeof o.length=='number'){
					if(o.item){
						return 'collection';
					}else if(o.callee){
						return 'arguments';
					}
				}
			}
			return T;
		},
		/**
		 * @method self
		 * Retrieve script self src string
		 * @param {Void}
		 * @return {String}
		 * @member ThinkJS
		 */
		self:function(){
			var scripts=document.getElementsByTagName('script'),length=scripts.length;
			do{if(scripts[length-1].src!=''){return scripts[length-1].src;}}while(length--);
		},
		/**
		 * @method exec
		 * Eval script string in global enviroment
		 * @param {String} The current script string
		 * @return {Void}
		 * @member ThinkJS
		 */
		exec:function(text){
			var head=document.getElementsByTagName('head')[0]||document.documentElement,script=document.createElement('script');
			script.type='text/javascript';
			if (ThinkJS.msie){
				script.text=text;
			}else{
				script.appendChild(document.createTextNode(text));
			}
			head.insertBefore(script,head.firstChild);
			head.removeChild(script);
		}
	},{
		/**
		 * @method time
		 * Return current unix timestamp
		 * @params {Void}
		 * @return {Integer}
		 * @member ThinkJS
		 */
		time:function(){return +new Date;},
		/**
		 * @method rand
		 * Return a random integer number between the two passed in.
		 * @param {Integer} The min value
		 * @param {Integer} The max value
		 * @return {Integer}
		 * @member ThinkJS
		 */
		rand:function(min,max){return Math.floor(Math.random()*(max-min+1)+min);},
		/**
		 * @method random
		 * Return a seed under the passed in argument
		 * @param {Integer} The base seed
		 * @return {Integer}
		 * @member ThinkJS
		 */
		random:function(i){return Math.ceil((((+new Date)*9301+49297)%233280)/(233280.0)*i);},
		/**
		 * @method pick
		 * Return the first object defined.
		 * If none is selected it will return null.
		 * @params {Mixed} The list of value
		 * @return {Mixed}
		 * @member ThinkJS
		 */
		pick:function(/*arguments*/){
			for(var i=0,l=arguments.length;i<l;i++){
				if(arguments[i]!=undefined){return arguments[i];}
			}
			return null;
		},
		/**
		 * @method splat
		 * Return an array base the argument passed in.
		 * @param {Mixed} Object to inspect
		 * @return {Array}
		 * @member ThinkJS
		 */
		splat:function(o){
			var type=this.type(o);
			return (type)?((type!='array'&&type!='arguments')?[o]:o):[];
		},
		/**
		 * @method merge
		 * Merge any number of objects recursively into a new array,with its sub-object.
		 * @params {Mixed} The list of object
		 * @return {Array}
		 * @member ThinkJS
		 */
		merge:function(/*arguments*/){
			var mix=[],i=0,arg;
			while(arg=arguments[i++]){
				var T=this.type(arg);
				if(T=='array'){
					mix=mix.concat(arg);
				}else if(T=='object'){
					var j=arg.length;
					if(j){
						for(var x=0;x<j;x++){mix=this.merge(mix,arg[x]);}
					}else{
						for(o in arg){mix=this.merge(mix,arg[o]);}
					}
				}else if(T=='collection'){
					for(var x=0,j=arg.length;x<j;x++){mix=this.merge(mix,arg[x]);}
				}else if(arg!=undefined){
					mix.push(arg);
				}
			}
			return mix;
		},
		/**
		 * @method attempt
		 * Tries to execute a function,return false if it fails.
		 * @param {Object} The object bind to
		 * @param {Object} The bind function
		 * @param {Array} The args for function
		 * @return {Object}
		 * @member ThinkJS
		 */
		attempt:function(bind,fn,args){
			try {
				return fn.apply((bind||fn),this.splat(args));
			} catch(e){}
			return false;
		},
		/**
		 * @method foreach
		 * Iterates an array calling the passed function with each,stopping if it return false.
		 * If the passed is not an array,the function is called once with it.
		 * @param {Array} The object list to bind
		 * @param {Object} The bind function
		 * @param {Object} The object that bind to
		 * @return {Object}
		 * @member ThinkJS
		 */
		foreach:function(args,fn,bind){
			var i=0,j=args.length;
			if(j){
				for(var o=args[0];i<j&&fn.apply((bind||o),this.splat(o))!==false;o=args[++i]){}
			}else{
				for(o in args){if(fn.apply((bind||args[o]),this.splat(args[0]))===false){break;}}
			}
		},
		/**
		 * @method Native
		 * Append .extend method to the objects passed in by prototype mode.
		 * Its handy if you don't wanna the .extend method of an object to overwrite existing methods.
		 * @params {Object} The objects to extend
		 * @return {Object} The object with .extend method
		 * @member ThinkJS
		 */
		Native:function(/*arguments*/){
			var i=0;
			while(arguments[i]){
				arguments[i].extend=function(ppts){
					for(var ppt in ppts){
						if(!this.prototype[ppt]){this.prototype[ppt]=ppts[ppt];}
						if(!this[ppt]){
							this[ppt]=(function(){
								return function(bind){
									return this.prototype[ppt].apply(bind,Array.prototype.slice.call(arguments,1));
								};
							})(ppt);
						}
					}
				};
				++i;
			}
		},
		/**
		 * @method SimpleObject
		 * The base class object of the Think JavaScript framework.
		 * Create a new class,its initialize method will fire upon when class instantiation.
		 * This will adds the .extend method to the class that can be used to override members on an instance.
		 * Initialize wont fire on instantiation when pass *null*.
		 * @params {Object} The extend properties
		 * @return {Object}
		 * @member ThinkJS
		 */
		SimpleObject:function(property){
			var cls=function(){
				return (arguments[0]!==null&&this.initialize&&ThinkJS.type(this.initialize)=='function')?this.initialize.apply(this,arguments):this;
			};
			for(var ppt in this){cls[ppt]=this[ppt];}
			cls.prototype=property||{};
			cls.extend=function(ppts){
				for(var ppt in ppts){
					this.prototype[ppt]=ppts[ppt];
					if(!this[ppt]){
						this[ppt]=(function(){
							return function(bind){
								return this.prototype[ppt].apply(bind,Array.prototype.slice.call(arguments,1));
							};
						})(ppt);
					}
				}
			};
			cls.constructor=ThinkJS.SimpleObject;
			return cls;
		}
	});
	window.onerror=function(){return !ThinkJS.debug;};
	ThinkJS.Native(Function,String,Array,Number);
})();

Function.extend({
	/**
	 * @method create
	 * Main function to create closure.
	 * @params {Object} The options passed to closure
	 * @return {Function}
	 * @member Function
	 */
	create:function(opts){
		var that=this;
		this.options=ThinkJS.apply({
			'bind':this,
			'event':false,
			'arguments':null,
			'delay':false,
			'periodical':false,
			'attempt':false
		},opts);
		return function(event){
			var args=ThinkJS.pick(that.options.arguments,arguments);
			if(that.options.event){args=ThinkJS.apply([event||window.event],args);}
			var rs=function(){return that.call(ThinkJS.pick(that.options.bind,that),args);};
			if(that.options.delay){return setTimeout(rs,that.options.delay);}
			if(that.options.periodical){return setInterval(rs,that.options.periodical);}
			if(that.options.attempt){return ThinkJS.attempt(rs);}
			return rs();
		};
	},
	/**
	 * @method bind
	 * Create closure with "this" easily.
	 * @params {Object} The closure bind to
	 * @return {Function}
	 * @member Function
	 */
	bind:function(bind){
		var that = this;
		return function(){return that.apply(bind, Array.prototype.slice.call(arguments, 1));};
	}
});

String.extend({
	/**
	 * @method test
	 * Search for a match between the string and a regular expression.
	 * @param {Mixed} The string or regular expression to match with.
	 * @param {String} If first parameter is a regular,any parameters you want to pass to the regular expression ('g' has no effect).
	 * @return {Boolean} If a match for the regular expression is found in this string return true,otherwise return false.
	 * @member String
	 */
	test:function(reg,sym){
		return ((typeof reg=='string')?new RegExp(reg,sym):reg).test(this);
	},
	/**
	 * @method contain
	 * Check if it the segment is exist in the string.
	 * @param {String} The string to search for.
	 * @param {String} The string that separates the values in this string (eg. Element classNames are separated by a ' ').
	 * @return {Boolean} If the string is contained in this string return true,otherwise return false.
	 * @member String
	 */
	contain:function(string,s){
		return (s?(s+this+s):this).indexOf(s?(s+string+s):string)>-1;
	},
	/**
	 * @method trim
	 * Trim the leading or trailing or both leading and trailing spaces of a string.
	 * @param {Integer} Which type to trim [eg. 1=>left,-1=>right,others are both]
	 * @return {String}
	 * @member String
	 */
	trim:function(){
		var reg=/^\s+|\s+$/g;
		switch(arguments[0]){
			case 1:
				reg=/^\s+/g;
			break;
			case -1:
				reg=/\s+$/g;
			break;
			default:
			break;
		}
		return this.replace(reg,'');
	},
	/**
	 * @method clean
	 * Trim (<String.trim>) a string AND remove all the double spaces in a string.
	 * @params {Void}
	 * @return {String}
	 * @member String
	 */
	clean:function(){
		return this.replace(/\s{2,}/g,' ').trim();
	},
	/**
	 * @method stripTags
	 * Remove all HTML tags in a string AND clean (<String.clean>) it
	 * @params {Void}
	 * @return {String}
	 * @member String
	 */
	stripTags:function(){
		return this.replace(/<\/?[^>]+>/gi,'').clean();
	},
	/**
	 * @method capitalize
	 * Convert the first letter in each word of a string to uppercase.
	 * @params {Void}
	 * @return {String}
	 * @member String
	 */
	capitalize:function(){
		return this.replace(/\b[a-z]/g,function(match){
			return match.toUpperCase();
		});
	},
	/**
	 * @method camelize
	 * Convert a hiphenated string to a camelcase string.
	 * @params {Void}
	 * @return {String}
	 * @member String
	 */
	camelize:function(){
		return this.replace(/-\D/g,function(match){
			return match.charAt(1).toUpperCase();
		});
	},
	/**
	 * @method hyphenate
	 * Convert a camelCased string to a hyphen-ated string.
	 * @params {Void}
	 * @return {String}
	 * @member String
	 */
	hyphenate: function(){
		return this.replace(/\w[A-Z]/g,function(match){
			return (match.charAt(0)+'-'+match.charAt(1).toLowerCase());
		});
	},
	/**
	 * @mehtod escapeRegExp
	 * Filter a string for RegExp
	 * @params {Void}
	 * @return {String}
	 * @member String
	 */
	escapeRegExp:function(){
		return this.replace(/([.*+?^${}()|[\]\/\\])/g,'\\$1');
	},
	/**
	 * @method toInt
	 * Parse a string to an integer.
	 * @params {Integer} The base to use (default to 10).
	 * @return {Integer}
	 * @member String
	 */
	toInt:function(base){
		return parseInt(this,base||10);
	},
	/**
	 * @method toFloat
	 * Parse a string to an float.
	 * @params {Void}
	 * @return {Float}
	 * @member String
	 */
	toFloat:function(){
		return parseFloat(this);
	},
	/**
	 * @method template
	 * Allow you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.
	 * Each token must be unique,and must increment in the format {0},{1},etc.
	 * Example usage:
		<code>
			var cls='my-class',text='Some text';
			var s="";
			var s=s.template('<div class="{0}">{1}</div>',cls,text);
			// s now contains the string: '<div class="my-class">Some text</div>'
		</code>
	 * @params {String} Bouth the template and replace args
	 * @return {String}
	 * @member ThinkJS
	 */
	template:function(/*arguments*/){
		var args=ThinkJS.merge(arguments);
		return this.replace(/\{(\d+)\}/g,function(k,v){
			return args[v];
		});
	},
	/**
	 * @method rgbToHex
	 * Convert an RGB value to hexidecimal.
	 * The string must be in the format of "rgb(255,255,255)" or "rgba(255,255,255,1)";
	 * @params {Boolean} True is return an array,and false for the string
	 * @return {String}
	 * @member String
	 */
	rgbToHex: function(bool){
		var rgb=this.match(new RegExp('([\\d]{1,3})','g'));
		if (rgb[3]==0){return 'transparent';}
		var hex=[];
		for (var i=0;i<3;i++){
			var bit=(rgb[i]-0).toString(16);
			hex.push(bit.length==1?'0'+bit:bit);
		}
		return bool?hex:('#'+hex.join(''));
	},
	/**
	 * @method hexToRgb
	 * Convert a hexidecimal color value to RGB.
	 * Input string must be the hex color value (with or without the hash). Also accepts triplets ('333');
	 * @params {Boolean} True is return an array,and false for the string
	 * @return {String}
	 * @member String
	 */
	hexToRgb: function(bool){
		var hex=this.match(new RegExp('^[#]{0,1}([\\w]{1,2})([\\w]{1,2})([\\w]{1,2})$'));
		var rgb=[];
		for (var i=1;i<hex.length;i++){
			if (hex[i].length==1) hex[i]+=hex[i];
			rgb.push(parseInt(hex[i],16));
		}
		return bool?rgb:('rbg('+rgb.join(',')+')');
	}	
});

Array.extend({
	/**
	 * @method origin
	 * Create a copy of an array,optionally from a specific range.
	 * Useful for applying the array prototypes to iterable objects such as a DOM Node collection or the arguments object.
	 * @param {Integer} The starting index.
	 * @param {Integer} The length of the resulting copied array.
	 * @return {Array}
	 * @member Array
	 */
	origin:function(offset,length){
		offset=offset||0;
		if(offset<0){offset+=this.length;}
		length=length||this.length-offset;
		length+=offset;
		return Array.prototype.slice.call(this,offset,length);
	},
	/**
	 * @method repeat
	 * Padding an array to give length with the template array
	 * @param {Array} The template array
	 * @return {Array}
	 * @member Array
	 */
	repeat:function(tpl){
		var rs=[];
		if(ThinkJS.type(tpl)=='array'){
			var al=tpl.length,TMP=a.slice(0,this.length%al);
			for(var i=0,l=this.length/al;i<l;i++){rs=rs.concat(a);}
			rs=rs.concat(TMP);
		}
		return rs;
	},
	/**
	 * @method merge
	 * Merge an array in another array,without duplicates. (case- and type-sensitive)
	 * @params {Array} The array list
	 * @return {Array}
	 * @member Array
	 */
	merge:function(){
		for (var i=0,l=arguments.length;i<l;i++){
			for(var ii=0,jj=arguments[i].length;ii<jj;ii++){
				if (!this.contain(arguments[i][ii])){this.push(arguments[i][ii]);}
			}
		}
		return this;
	},
	/**
	 * @method contain
	 * Test an array for the presence of an item.
	 * @param {Object} The item to search for in the array.
	 * @param {Integer} The index of the array at which to begin the search.
	 * @return {Boolean}
	 * @member Array
	 */
	contain:function(item,offset){
		var l=this.length;
		offset=((offset<0)?Math.max(0,l+offset):offset)||0;
		for(var i=offset;i<l;i++){
			if(this[i]===item){return true;}
		}
		return false;
	},
	/**
	 * @method remove
	 * Remove all occurrences of an item from the array.
	 * @param {Object} The item to delete from the array.
	 * @return {Array}
	 * @member Array
	 */
	remove: function(item){
		var i=0,l=this.length;
		while (i<l){
			if (this[i]===item){
				this.splice(i,1);
				l--;
			} else {
				i++;
			}
		}
		return this;
	},
	/**
	 * @method each
	 * Call a function for each item in the array.
	 * This function is passed the item and its index in the array.
	 * @param {Function} The function which should be executed on each item in the array.
	 * @param {Object} The object to use as 'this' in the function.
		[code]
			var arr=["one","two","three"];
			arr.each(function(item,index){
				alert(index+"="+item);
			});
			// will alerts "0=one" etc
		[/code]
	 * @return {Array}
	 * @member Array
	 */
	each: function(fn,bind){
		for (var i=0,l=this.length;i<l;i++){
			fn.call(bind,this[i],i,this);
		}
	},
	/**
	 * @method map
	 * Create a new array with the results of calling a provided function on every item in the array.
	 * @param {Function} The function to produce an item of the new Array from an item of the current one.
	 * @param {Object} The object to use as 'this' in the function.
		[code]
			var timesTwo=[1,2,3].map(function(item,index){
				return item * 2;
			});
			//now timesTwo=[2,4,6];
		[/code]
	 * @return {Array}
	 * @member Array
	 */
	map:function(fn,bind){
		var rs=[];
		for(var i=0,l=this.length;i<l;i++){
			rs[i]=fn.call(bind,this[i],i,this);
		}
		return rs;
	},
	/**
	 * @method filter
	 * Call a provided callback function once for each item in an array,and constructs a new array of all the values for which callback returns a true value.
	 * @param {Function} The function to produce an item of the new Array from an item of the current one.
	 * @param {Object} The object to use as 'this' in the function.
		[code]
			var timesTwo=[1,2,3].filter(function(item,index){
				return ite >= 2;
			});
			//now timesTwo=[2,3];
		[/code]
	 * @return {Array}
	 * @member Array
	 */
	filter:function(fn,bind){
		var rs=[];
		for(var i=0,l=this.length;i<l;i++){
			if(fn.call(bind,this[i],i,this)){
				rs.push(this[i]);
			}
		}
		return rs;
	},
	/**
	 * @method include
	 * Include the passed in item in the array,only if its not already present. 
	 * @param {Object} The item that should be added to this array.
	 * @return {Array}
	 * @member Array
	 */
	include: function(item){
		if (!this.contain(item)){this.push(item);}
		return this;
	}
});

Number.extend({
	/**
	 * @method limit
	 * Return integer number between the two passed in values.
	 * @param {Integer} The min value
	 * @param {Integer} The max value
	 * @return {Integer}
	 * @member Number
	 */
	limit:function(min,max){
		return Math.min(max,Math.max(min,this));
	}
});

ThinkJS.Ready=new ThinkJS.SimpleObject({
	initialize:function(){},
	onReady:function(){
		if(ThinkJS.isReady){return;}
		ThinkJS.isReady=true;
		if(this._timer){clearInterval(this._timer);}
		this._callee.each(function(fn){fn();});
		this._callee=null;
	},
	onDomReady:function(fn){
		if(!this._callee){
			var domReady=this.onReady.bind(this);
			if(document.addEventListener){
				document.addEventListener('DOMContentLoaded',domReady,false);
			}
			if(ThinkJS.msie){
				document.write('<script id=_ie_on_load defer src=javascript:void(0)><\/script>');
				document.getElementById('_ie_on_load').onreadystatechange=function() {if (this.readyState=='complete'){domReady();}};
			}
			if(ThinkJS.safari){
				this._timer=setInterval(function(){if(['loaded','complete'].contain(document.readyState)){domReady();}},10);
			}
			if (window.addEventListener) {
				window.addEventListener('load',domReady,false);
			} else {
				if (window.attachEvent) {window.attachEvent('onload',domReady);}
			}
			this._callee=[];
		}
		this._callee.push(fn);
	}
});
 
ThinkJS.Dom=new ThinkJS.SimpleObject({
	_attrs:{
		'class':'className','for':'htmlFor','colspan':'colSpan',
		'rowspan':'rowSpan',	'accesskey':'accessKey','value':'value',
		'tabindex':'tabIndex','maxlength':'maxLength','selected':'selected',
		'readonly':'readOnly','frameborder':'frameBorder',
		'disabled':'disabled','checked':'checked','multiple':'multiple' 
	},
	_flags:{'href':2,'src':2},
	_walk:function(el,brother,start){
		brother+='Sibling';
		var el=start?el[start]:el[brother];
		while(el&&ThinkJS.type(el)!='element'){
			el=el[brother];
		}
		return el;
	},
	initialize:function(args,o){
		this.length=0;
		this.elements=[];
		if(typeof args=='string'){
			this.elements.merge(this._Selector(args,o));
		}else{
			for(var i=0;args[i];i++){
				this.elements.merge(this._Selector(args[i],o));
			}
		}
		this.length=this.elements.length;
		return this;
	},
	_Selector:function(el,o){
		// @tag,tag
		// #id,id
		// .class,tag.class
		// tag[attribute(=|!=|^=|$=|*=|~=)value]
		// [tag|id|class|tag[*]]>[tag|id|class|tag[*]]>....
		var els=[];
		if(typeof el=='string'){
			el=el.replace(/\s+/g,''); // remove all whiteSpace
			if(el.contain('>')){
				this._Selector(el.split('>')[0],o).each(function(io){
					els.merge(this._Selector(el.replace(/[^>]*?>/i,''),io));
				},this);
			}else if(el.contain(',')){
				el.split(',').each(function(ie){
					els.merge(this._Selector(ie,o));
				},this);
			}else if(el.contain('#')){
				els.merge(this._idSelector(el.split('#')[1],o));
			}else if(el.contain('.')){
				var tc=el.split('.');
				els.merge(this._cssSelector(tc[1],tc[0],o));
			}else if(el.contain('@')){
				els.merge(this._tagSelector(el.split('@')[1],o));
			}else if(/\[.*?\]/g.test(el)){
				var ta=[];
				els.merge(this._pptSelector(el.replace(/\[.*?\]/gi,function($1){ta.push($1.replace(/\[|\]/g,''));return '';}),ta,o));
			}else{
				var rs=this._tagSelector(el,o);
				if(rs.length){
					els.merge(rs);
				}else{
					els.merge(this._idSelector(el,o));
				}
			}
		}else{
			els.push(el);
		}
		return els;
	},
	_idSelector:function(id){
		return [document.getElementById(id)];
	},
	_tagSelector:function(tag,o){
		var els=[],i=0,el,rs=(o||document).getElementsByTagName(tag||'*');
		if(ThinkJS.msie){
			while(el=rs[i]){
				if(el&&el.nodeType!=8){els[i]=el;}
				++i;
			}
		}else{
			while(el=rs[i]){els[i++]=el;}
		}
		return els;
	},
	_cssSelector:function(css,tag,o){
		var els=[],css=' '+css+' ';
		this._tagSelector(tag,o).each(function(el){
			if(el&&((' '+el.className+' ').indexOf(css)>-1)){els.push(el);}
		});
		return els;
	},
	_pptSelector:function(tag,ppt,o){
		var els=[],i=0,reg=/^ *([\w-]+) *([~!$^*=]*) *('?"?)(.*)\3 */,rs=this._tagSelector(tag,o);
		while(el=rs[i++]){
			ppt.each(function(p){
				var m=reg.exec(p);
				if(m){
					var attr=ThinkJS.msie?el.attributes[m[1]].nodeValue:el.getAttribute(m[1]);
					if(m[2]==''&&!!attr||
						m[2]=='='&&attr==m[4]||
						m[2]=='!='&&attr!=m[4]||
						m[2]=='^='&&attr&&attr.indexOf(m[4])==0||
						m[2]=='$='&&attr.substr(attr.length-m[4].length)==m[4]||
						m[2]=='*='&&attr.indexOf(m[4])>=0||
						m[2]=='~='&&attr.indexOf(m[4])<0){
						els.push(el);
					}
				}
			});
		}
		return els;
	}
 });
ThinkJS.Dom.extend({
	parent:function(){
		var els=[];
		this.elements.each(function(el){
			if(el.parentNode){els.push(el.parentNode);}
		});
		this.elements=els;
		return this;
	},
	child:function(){
		var els=[];
		this.elements.each(function(el){
			if(el.hasChildNodes()){
				el.childNodes.each(function(node){
					if(node.nodeType==1){els.push(node);}
				});
			}
		});
		this.elements=els;
		return this;
	},
	prev:function(){
		var els=[];
		this.elements.each(function(el){
			els.push(this._walk(el,'previous'));
		});
		this.elements=els;
		return this;
	},
	next:function(){
		var els=[];
		this.elements.each(function(el){
			els.push(this._walk(el,'next'));
		});
		this.elements=els;
		return this;
	},
	first:function(){
		var els=[];
		this.elements.each(function(el){
			els.push(this._walk(el,'next','firstChild'));
		});
		this.elements=els;
		return this;
	},
	last:function(){
		var els=[];
		this.elements.each(function(el){
			els.push(this._walk(el,'previous','lastChild'));
		});
		this.elements=els;
		return this;
	},
	odd:function(){
		this.elements=this.elements.filter(function(e,i){return (i+1)%2;});
		return this;
	},
	even:function(){
		this.elements=this.elements.filter(function(e,i){return i%2;});
		return this;
	},
	replace:function(ie){
		if(typeof ie=='string'){
			ie=this._Selector(ie)[0];
		}
		this.elements.each(function(el){
			if(el.parentNode){el.parentNode.replaceChild(ie,el);}
		});
		return this;
	},
	remove:function(){
		this.elements.each(function(el){
			if(el.parentNode){el.parentNode.removeChild(el);}
		});
		return this;
	},
	empty:function(){
		this.elements.each(function(el){
			if(el.hasChildNodes()){
				ThinkJS.merge(el.childNodes).each(function(ie){
					if(ie.parentNode){ie.parentNode.removeChild(ie);}
				});
			}
		});
		return this;
	},
	setOpacity:function(opt){
		this.elements.each(function(el){
			if(opt==0){
				if(el.style.visibility!='hidden'){el.style.visibility='hidden';}
			}else{
				if(el.style.visibility!='visible'){el.style.visibility='visible';}
			}
			if(!el.currentStyle||el.currentStyle.hasLayout){el.style.zoom=1;}
			if(ThinkJS.msie){el.style.filter=(opt==1)?'':'alpha(opacity='+opt*100+')';}
			el.style.opacity=opt;
		});
		return this;
	},
	setStyle:function(name,value){
		this.elements.each(function(el){
			switch(name){
				case 'opacity':
					return this.setOpacity(value.toFloat());
					break;
				case 'float':
					name=ThinkJS.msie?'styleFloat':'cssFloat';
					break;
			}
			name=name.camelize();
			switch(ThinkJS.type(value)){
				case 'number':
					if(!['zIndex','zoom'].contain(name)){value+='px';}
					break;
				case 'array':
					value='rgb('+value.join(',')+')';
					break;
			}
			el.style[name]=value;
		},this);
		return this;
	},
	setCSS:function(key,value){
		if(ThinkJS.type(key)=='object'){
			this.elements.each(function(el){
				for(o in key){this.setStyle(o,key[o]);}
			},this);
		}else{
			this.setStyle(key,value);
		}
		return this;
	},
	getCSS:function(n){
		var rs,el=this.elements[parseInt(n).limit(0, this.elements.length)];
		var win=(el.ownerDocument||el.documentElement).defaultView;
		if(win&&(el!==win)&&win.getComputedStyle){
			rs=win.getComputedStyle(el,null);
		}else{
			rs=el.style;
		}
		return rs;
	},
	hasClass:function(cn,n){
		this.elements[parseInt(n).limit(0, this.length)].className.contain(cn,' ');
		return this;
	},
	addClass:function(cn){
		this.elements.each(function(el){
			if(!el.className.contain(cn,' ')){el.className=(el.className+' '+cn).clean();}
		});
		return this;
	},
	removeClass:function(cn){
		this.elements.each(function(el){
			if(el.className.contain(cn,' ')){el.className=el.className.replace(new RegExp('(^|\\s)'+cn+'(?:\\s|$)'),'$1').clean();}
		});
		return this;
	},
	toggleClass:function(cn){
		this.elements.each(function(el){
			el.className=(el.className.contain(cn,' ')?el.className.replace(new RegExp('(^|\\s)'+cn+'(?:\\s|$)'),'$1'):(el.className+' '+cn)).clean();
		});
		return this;
	},
	switchClass:function(cn,nc){
		this.elements.each(function(el){
			if(el.className.contain(cn,' ')){
				el.className=(el.className.replace(new RegExp('(^|\\s)'+cn+'(?:\\s|$)'),'$1')+' '+nc).clean();
			}else if(el.className.contain(nc,' ')){
				el.className=(el.className.replace(new RegExp('(^|\\s)'+nc+'(?:\\s|$)'),'$1')+' '+cn).clean();
			}else{
				el.className=(el.className+' '+cn).clean();
			}
		});
		return this;
	},
	getProperty:function(key,n){
		var rs,el=this.elements[parseInt(n).limit(0, this.elements.length)];
		if(this._attrs[key]){
			rs=el[this._attrs[key]];
		}else{
			var ig=this._flags[key]||0;
			 if(!ThinkJS.msie||ig){
				rs=el.getAttribute(key,ig);
			}else{
				var node=el.attributes[key];
				rs=node?node.nodeValue:null;
			}
		}
		return rs;
	},
	setProperty:function(key,value){
		this.elements.each(function(el){
			if(this._attrs[key]){
				el[this._attrs[key]]=value;
			}else{
				el.setAttribute(key,value);
			}
		},this);
		return this;
	},
	removeProperty:function(key){
		this.elements.each(function(el){
			if(this._attrs[key]){
				el[this._attrs[key]]='';
			}else{
				el.removeAttribute(key);
			}
		},this);
		return this;
	},
	getWidth:function(n){
		var rs=0,el=this.elements[parseInt(n).limit(0, this.elements.length)];
		if(el.style.visibility=='hidden'){
			el.style.visibility='visible';
			rs=Math.max(parseInt(el.offsetWidth),parseInt(el.style.width));
			el.style.visibility='hidden';
		}else{
			rs=Math.max(parseInt(el.offsetWidth),parseInt(el.style.width));
		}
		return rs;
	},
	setWidth:function(width,n){
		if(ThinkJS.is(n)){
			this.elements[parseInt(n).limit(0, this.elements.length)].style.width=width+'px';
		}else{
			this.elements.each(function(el){
				el.style.width=width+'px';
			});
		}
		return this;
	},
	getHeight:function(n){
		var rs=0,el=this.elements[parseInt(n).limit(0, this.elements.length)];
		if(el.style.visibility=='hidden'){
			el.style.visibility='visible';
			rs=Math.max(parseInt(el.offsetHeight),parseInt(el.style.height));
			el.style.visibility='hidden';
		}else{
			rs=Math.max(parseInt(el.offsetHeight),parseInt(el.style.height));
		}
		return rs;
	},
	setHeight:function(height,n){
		if(ThinkJS.is(n)){
			this.elements[parseInt(n).limit(0, this.elements.length)].style.height=height+'px';
		}else{
			this.elements.each(function(el){
				el.style.height=height+'px';
			});
		}
		return this;
	},
	getXY:function(n,off){
		var el=this.elements[parseInt(n).limit(0, this.elements.length)],left=0,top=0;
		do{
			left+=el.offsetLeft||0;
			top+=el.offsetTop||0;
		}while(el=el.offsetParent);
		if(off){
			ThinkJS.merge(off).each(function(e){
				left-=e.scrollLeft||0;
				top-=e.scrollTop||0;
			});
		}
		return {'x':left,'y':top};
	},
	setXY:function(x,y){
		this.elements.each(function(el){
			el.style.position='absolute';
			el.style.left=x+'px';
			el.style.top=y+'px';
		});
		return this;
	},
	setHTML:function(where,html){
		where=where.toLowerCase();
		this.elements.each(function(el){
			if(el.insertAdjacentHTML){
				switch(where){
					case 'beforbegin':
						el.insertAdjacentHTML('BeforeBegin',html);
					break;
					case 'afterbegin':
						el.insertAdjacentHTML('AfterBegin',html);
					break;
					case 'beforeend':
						el.insertAdjacentHTML('BeforeEnd',html);
					break;
					case 'afterend':
						el.insertAdjacentHTML('AfterEnd',html);
					break;
				}
			}else{
				var frag,range=el.ownerDocument.createRange();
				switch(where){
					case 'beforbegin':
						range.setStartBefore(el);
		                frag=range.createContextualFragment(html);
		                el.parentNode.insertBefore(frag,el);
					break;
					case 'afterbegin':
						if(el.firstChild){
							range.setStartBefore(el.firstChild);
							frag=range.createContextualFragment(html);
							el.insertBefore(frag,el.firstChild);
						}else{
							el.innerHTML=html;
						}
					break;
					case 'beforeend':
						if(el.lastChild){
		                    range.setStartAfter(el.lastChild);
		                    frag=range.createContextualFragment(html);
		                    el.appendChild(frag);
		                }else{
		                    el.innerHTML=html;
		                }
					break;
					case 'afterend':
						range.setStartAfter(el);
		                frag=range.createContextualFragment(html);
		                el.parentNode.insertBefore(frag,el.nextSibling);
					break;
				}
			}
		});
		return this;
	},
	getHTML:function(n){
		var rs,el=this.elements[parseInt(n).limit(0, this.elements.length)];
		if(el.outerHTML){
			rs=el.outerHTML;
		}else{
			var attr,i=0,attrs=el.attributes;
			rs='<'+el.tagName;
			while(attr=attrs[i++]){
				if(attr.specified){
					rs+=' '+attr.name+'="'+attr.value+'"';
				}
			}
			rs+='>'+(el.innerHTML||'')+'</'+el.tagName+'>';
		}
		return rs;
	},
	getValue:function(n){
		var rs,el=this.elements[parseInt(n).limit(0, this.elements.length)];
		switch(el.tagName.toLowerCase()){
			case 'select':
				ThinkJS.foreach(el.options,function(opt){
					if(opt.selected){rs=ThinkJS.pick(opt.value,opt.text);return;}
				});
				break;
			case 'input':
				if(!(el.checked&&['checkbox','radio'].contain(el.type))&&!['hidden','text','password'].contain(el.type)){break;}
			case 'textarea':
				rs=el.value;
			break;
		}
		return rs;
	}
});
 
ThinkJS.Event=new ThinkJS.SimpleObject({
	initialize:function(e){
		e=e||window.event;
		this.type=e.type;
		this.altKey=e.altKey;
		this.ctrlKey=e.ctrlKey;
		this.shiftKey=e.shiftKey;
		if(ThinkJS.is(e.button)){
			this.button=(typeof(e.which)!=='undefined')?e.button:((e.button===4)?1:((e.button===2)?2:0));
		}
		if(e.type==='keypress'){
			this.charCode=e.charCode||e.keyCode;
		}else if(e.keyCode&&(e.keyCode===46)){
			this.keyCode=127;
		}else{
			this.keyCode=e.keyCode;
		}
		this.clientX=e.clientX;
		this.clientY=e.clientY;
		this.screenX=e.screenX;
		this.screenY=e.screenY;
		this.target=e.target?e.target:e.srcElement;
		while(this.target&&this.target.nodeType==3){this.target=this.target.parentNode;}
		if(this.target){
			this.offsetX=(e.offsetX||(window.pageXOffset + (e.clientX||0) - this.target.offsetLeft));
			this.offsetY=(e.offsetY||(window.pageYOffset + (e.clientY||0) - this.target.offsetTop));
		}
		return this;
	}
 });
ThinkJS.Dom.extend({
	addHandler:function(type,fn){
		this.elements.each(function(el){
			if(el.FNS==undefined){el.FNS={};}
			var BH,FNC=el.FNS[type];
			if(FNC==undefined){el.FNS[type]=FNC=[];}
			if(el.addEventListener){
				BH=function(e){return fn.call(el,new ThinkJS.Event(e));};
				el.addEventListener(type,BH,false);
			}else if(el.attachEvent){
				BH=function(){return fn.call(el,new ThinkJS.Event(window.event));};
				el.attachEvent(('on'+type),BH);
			}
			FNC[FNC.length]={fn:fn,BH:BH};
		});
		return this;
	},
	removeHandler:function(type,fn){
		this.elements.each(function(el){
			if((ThinkJS.type(el.FNS)!=='object')||(el.FNS==null)){return;}
			var BH,FNC=el.FNS[type];
			for(var i=0,l=FNC.length;i<l;i++){if(FNC[i].fn===fn){BH=FNC[i].BH;break;}}
			if(ThinkJS.type(BH)!=='function'){return;}
			if(el.removeEventListener){
				el.removeEventListener(type,BH,false);
			}else if(el.detachEvent){
				el.detachEvent(('on' + type),BH);
			}
			FNC.splice(i,1);
		});
		return this;
	},
	on:function(type,fn){
		return this.addHandler(type,fn);
	},
	off:function(type,fn){
		return this.removeHandler(type,fn);
	},
	clone:function(el,type){
		el=this._Selector(el)[0];
		if(el.FNS){
			if(type!=undefined&&el.FNS[type]){
				el.FNS[type].each(function(fn){
					this.addHandler(type,fn);
				},this);
			}else{
				for(var type in el.FNS){this.clone(el,type);}
			}
		}
		return this;
	},
	fire:function(type,args,delay){
		this.elements.each(function(el){
			if(el.FNS&&el.FNS[type]){
				el.FNS[type].each(function(FNC){FNC.fn.create({'bind':el,'delay':delay,'arguments':args})();});
			}
		});
		return this;
	}
 });

ThinkJS.DD=new ThinkJS.SimpleObject({
	initialize:function(el,root,minX,maxX,minY,maxY,x,y){
		el=(typeof el=='string')?(new ThinkJS.Dom(el)).elements[0]:el;
		this.el=el;
		el.cache={
			cursor:el.style.cursor
		};
		el.onmousedown=this.start();
		el.x=x?false:true;
		el.y=y?false:true;
		el.root=((typeof root=='string')?(new ThinkJS.Dom(root)).elements[0]:root)||el;
		if(el.x&&isNaN(parseInt(el.root.style.left))){
			el.root.style.left='0px';
		}
		if(el.y&&isNaN(parseInt(el.root.style.top))){
			el.root.style.top='0px';
		}
		if(!el.x&&isNaN(parseInt(el.root.style.right))){
			el.root.style.right='0px';
		}
		if(!el.y&&isNaN(parseInt(el.root.style.bottom))){
			el.root.style.bottom='0px';
		}
		el.minX=typeof minX!='undefined'?minX:null;
		el.maxX=typeof maxX!='undefined'?maxX:null;
		el.minY=typeof minY!='undefined'?minY:null;
		el.maxY=typeof maxY!='undefined'?maxY:null;
		el.root.onStart=new Function();
		el.root.onDrag=new Function();
		el.root.onDrop=new Function();
	},
	start:function(){
		var that=this,el=this.el;
		return function(e){
			el.style.cursor='move';
			e=new ThinkJS.Event(e);
			var x=parseInt(el.x?el.root.style.left:el.root.style.right),
				y=parseInt(el.y?el.root.style.top:el.root.style.bottom);
			el.root.onStart(x,y);
			el.lastMX=e.clientX;
			el.lastMY=e.clientY;
			if(el.x){
				if(el.minX!=null){el.minMX=e.clientX-x+el.minX;}
				if(el.maxX!=null){el.maxMX=el.minMX+el.maxX-el.minX;}
			}else{
				if(el.minX!=null){el.maxMX=e.clientX+x-el.minX;}
				if(el.maxX!=null){el.minMX=e.clientX+x-el.maxX;}
			}
			if(el.y){
				if(el.minY!=null){el.minMY=e.clientY-y+el.minY;}
				if(el.maxY!=null){el.maxMY=el.minMY+el.maxY-el.minY;}
			}else{
				if(el.minY!=null){el.maxMY=e.clientY+y-el.minY;}
				if(el.maxY!=null){el.minMY=e.clientY+y-el.maxY;}
			}
			document.onmousemove=that.drag();
			document.onmouseup=that.drop();
			return false;
		};
	},
	drag:function(){
		var that=this,el=this.el;
		return function(e){
			e=new ThinkJS.Event(e);
			var ex=e.clientX,ey=e.clientY;
			var x=parseInt(el.x?el.root.style.left:el.root.style.right),
				y=parseInt(el.y?el.root.style.top:el.root.style.bottom);
			var nx,ny;
			if(el.minX!=null){ex=el.x?Math.max(ex,el.minMX):Math.min(ex,el.maxMX);}
			if(el.maxX!=null){ex=el.x?Math.min(ex,el.maxMX):Math.max(ex,el.minMX);}
			if(el.minY!=null){ey=el.y?Math.max(ey,el.minMY):Math.min(ey,el.maxMY);}
			if(el.maxY!=null){ey=el.y?Math.min(ey,el.maxMY):Math.max(ey,el.minMY);}
			nx=x+((ex-el.lastMX)*(el.x?1:-1));
			ny=y+((ey-el.lastMY)*(el.y?1:-1));
			el.root.style[el.x?'left':'right']=nx+'px';
			el.root.style[el.y?'top':'bottom']=ny+'px';
			el.lastMX=ex;
			el.lastMY=ey;
			el.root.onDrag(nx,ny);
			return false;
		};
	},
	drop:function(){
		var that=this,el=this.el;
		return function(){
			el.style.cursor=el.cache.cursor;
			document.onmousemove=null;
			document.onmouseup=null;
			el.root.onDrop(parseInt(el.root.style[el.x?'left':'right']),parseInt(el.root.style[el.y?'top':'bottom']));
		}
	}
});
ThinkJS.Dom.extend({
	dragable:function(root,minX,maxX,minY,maxY,x,y){
		this.elements.each(function(el){
			new ThinkJS.DD(el,root,minX,maxX,minY,maxY,x,y);
		});
		return this;
	}
});

ThinkJS.XHR=new ThinkJS.SimpleObject({
	initialize:function(){
		this.flag=false;
		this.etag={};
		this.XHR=(function(){
			var xhr;
			if(window.XMLHttpRequest){
				xhr=new XMLHttpRequest();
			}else{
				var MS=[
					'MSXML2.XMLHTTP.6.0',
					'MSXML2.XMLHTTP.5.0',
					'MSXML2.XMLHTTP.4.0',
					'MSXML2.XMLHTTP.3.0',
					'MSXML2.XMLHTTP',
					'Microsoft.XMLHTTP'
				];
				for(var i=0;MS[i];i++){
					try{xhr=new ActiveXObject(MS[i]);break;}catch(e){}
				}
			}
			return xhr;
		})();
		return this;
	},
	AJAX:function(opts){
		this._cfg=ThinkJS.apply({
			url:location.href,
			data:'',
			async:true,
			method:'POST',
			charset:'UTF-8',
			etag:false,
			course:function(){},
			success:function(){},
			failure:function(){},
			filter:null,
			type:'text'
		},opts);
		this._cfg.url+=(this._cfg.url.contain('?')?'&':'?')+'mc='+(+new Date());
		this._cfg.method=this._cfg.method.toUpperCase();
		this._cfg.type=this._cfg.type.toLowerCase();
		if(this.XHR||this.initialize()){
			this.flag=true;
			this.XHR.onreadystatechange=function(){};
			this.XHR.abort();
			try{
				this.XHR.open(this._cfg.method,this._cfg.url,this._cfg.async);
				if(this._cfg.method=='POST'){
					this.XHR.setRequestHeader('Content-Type',('application/x-www-form-urlencoded;charset='+this._cfg.charset));
				}
				if(this._cfg.etag){
					this.XHR.setRequestHeader('If-Modified-Since', this.etag[this._cfg.url]||'Thu, 01 Jan 1970 00:00:00 GMT');
				}
				this.XHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				this.XHR.onreadystatechange=this.handle.bind(this);
				this.XHR.send(this._cfg.data);
				if(!this._cfg.async){this.handle.bing(this);}
			}catch(e){
				if(ThinkJS.type(this._cfg.failure)=='function'){
					this._cfg.failure(e);
				}
			}
		}
		return this;
	},
	handle:function(){
		if(this.XHR.readyState==4){
			try{
				this.flag=(this.XHR.status>=200&&this.XHR.status<300)||this.XHR.status==304||this.XHR.getResponseHeader('Last-Modified')==this.etag[this._cfg.url]||(!this.XHR.status&&location.protocol=='file:')||this.XHR.status==1223||(ThinkJS.safari&&this.XHR.status==undefined);
			}catch(e){}
			if(this.flag){
				if(this._cfg.etag){
					try{
						var rs=this.XHR.getResponseHeader('Last-Modified');
						if(rs){this.etag[this._cfg.url]=rs;}
					}catch(e){}
				}
				if(ThinkJS.type(this._cfg.success)=='function'){
					this._cfg.success(this.data({
						text:this.XHR.responseText,
						xml:this.XHR.responseXML
					}),this.XHR.status);
				}
			}else{
				if(ThinkJS.type(this._cfg.failure)=='function'){
					this._cfg.failure(this.XHR.status);
				}
			}
		}else{
			if(ThinkJS.type(this._cfg.course)=='function'){
				this._cfg.course(this.XHR.status);
			}
		}
	},
	data:function(data){
		switch(this._cfg.type){
			case 'xml':
				data=data.xml;
				break;
			case 'text':
			case 'json':
			case 'script':
			default:
				data=data.text;
				break;
		}
		if(ThinkJS.type(this._cfg.filter)=='function'){
			data=this._cfg.filter(data);
		}
		if(this._cfg.type=='script'){
			ThinkJS.exec(data);
		}
		if(this._cfg.type=='json'){
			data=eval('('+data+')');
		}
		return data;
	},
	set:function(url,data,ok,no,ing,filter,type){
		if(ThinkJS.type(data)=='function'){
			ok=data;
			data=null;
		}
		return this.AJAX({
			url:url,
			data:data,
			async:true,
			method:'POST',
			charset:'UTF-8',
			etag:false,
			course:ing,
			success:ok,
			failure:no,
			filter:filter,
			type:type
		});
	},
	get:function(url,data,ok,no,ing,filter,type){
		if(ThinkJS.type(data)=='function'){
			ok=data;
			data=null;
		}
		return this.AJAX({
			url:url,
			data:data,
			async:true,
			method:'GET',
			charset:'UTF-8',
			etag:true,
			course:ing,
			success:ok,
			failure:no,
			filter:filter,
			type:type
		});
	}
});
ThinkJS.Dom.extend({
	refresh:function(url,where,ing,filter){
		var that=this,where=(['beforebegin','afterbegin','beforeend','afterend'].contain(where)?where:null);
		var ok=function(data,status){
			if(where){
				that.elements.each(function(el){$(el).setHTML(where,data);});
			}else{
				that.elements.each(function(el){$(el).empty().setHTML('afterbegin',data);});
			}
		};
		(new ThinkJS.XHR).get(url,null,ok,null,ing,filter,'text');
		return this;
	},
	submit:function(url,ok,no,ing){
		var QS=[];
		var toQS=function(K,V){
			return (V!=undefined)?QS.push(K+'='+encodeURIComponent(V)):'';
		};
		this.elements.filter(function(tag){
			return (tag.tagName==='FORM');
		}).each(function(el){
			var els=[];
			el.setAttribute('onsubmit', 'return false;');
			els.merge(el.getElementsByTagName('input'));
			els.merge(el.getElementsByTagName('select'));
			els.merge(el.getElementsByTagName('textarea'));
			els.each(function(e){
				var eK=e.name,eV=(new ThinkJS.Dom(el)).getValue(0);
				if(ThinkJS.type(eV)=='array'){eV.each(toQS);}else{toQS(eK,eV);}
			});
		});
		(new ThinkJS.XHR).set(url,QS.join('&'),ok,no,ing,null,'text');
		return this;
	},
	reset:function(){
		this.elements.each(function(el){
			if(['input', 'textarea'].contain(el.tagName.toLowerCase())){el.value='';}
		});
	}
});

var Fx=fx={};
Fx.Transitions={
	linear:function(t,b,c,d) { return c*t/d + b;},
	sineInOut:function(t,b,c,d){return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;}
};
Fx.Effect=new ThinkJS.SimpleObject({
	initialize:function(el,ppt,opts){
		this.el=el;
		this.ppt=ppt;
		this.options=ThinkJS.apply({
			fps:50,
			unit:'px',
			duration:500,
			transition:Fx.Transitions.sineInOut,
			wait:true,
			start:function(){},
			stop:function(){}
		},opts);
	},
	run:function(from,to){
		if (!this.options.wait){this.clear();}
		if (this.timer){return;}
		setTimeout(this.options.start.bind(this,this.el),10);
		this.from=from;
		this.to=to;
		this.time=+new Date();
		this.timer=setInterval(this.step.bind(this),Math.round(1000/this.options.fps));
		return this;
	},
	ing:function(){
		this.now=this.compute(this.from,this.to);
	},
	step:function(){
		var time=+new Date();
		if(time<(this.time+this.options.duration)){
			this._time=time-this.time;
			this.ing();
		}else{
			setTimeout(this.options.stop.bind(this,this.el),10);
			this.clear();
			this.now=this.to;
		}
		this.increase();
	},
	compute:function(from,to){
		return this.options.transition(this._time,from,(to-from),this.options.duration);
	},
	clear:function(){
		clearInterval(this.timer);
		this.timer=null;
		return this;
	},
	custom:function(from,to){
		return this.run(from,to);
	},
	set:function(to){
		this.now=to;
		this.increase();
		return this;
	},
	show:function(){
		return this.set(1);
	},
	hide:function(){
		return this.set(0);
	},
	increase:function(){
		this.setStyle(this.el,this.ppt,this.now);
	},
	setStyle:function(el,ppt,value){
		if (ppt=='opacity'){
			if (value==0&&el.style.visibility!='hidden'){
				el.style.visibility='hidden';
			}else if(el.style.visibility!='visible'){
				el.style.visibility='visible';
			}
			if (window.ActiveXObject){el.style.filter='alpha(opacity='+value*100+')';}
			el.style.opacity=value;
		}else{
			el.style[ppt]=value+this.options.unit;
		}
	}
});
Fx.Opacity=ThinkJS.SimpleObject(new Fx.Effect);
Fx.Opacity.extend({
	initialize:function(el,opts){
		this.el=el;
		this.options=ThinkJS.apply(this.options,opts);
		this.now=1;
	},
	toggle:function(){
		if (this.now>0){
			return this.custom(1,0);
		}else{
			return this.custom(0,1);
		}
	},
	increase:function(){
		this.setStyle(this.el,'opacity',this.now);
	}
});
Fx.Color=ThinkJS.SimpleObject(new Fx.Effect);
Fx.Color.extend({
	initialize:function(el,ppt,hex,opts){
		this.el=el;
		this.ppt=ppt.camelize();
		this.hex=hex;
		this.options=ThinkJS.apply(this.options,opts);
		this.now=[];
	},
	blink:function(){
		return this.custom(this.hex.start,this.hex.end);
	},
	ing:function(){
		[0,1,2].each(function(i){
			this.now[i]=Math.round(this.compute(this.from[i],this.to[i]));
		},this);
	},
	custom:function(from,to){
		return this.run(from.hexToRgb(true),to.hexToRgb(true));
	},
	increase:function(){
		this.el.style[this.ppt]='rgb('+this.now[0]+','+this.now[1]+','+this.now[2]+')';
	}
});
Fx.Scroll=ThinkJS.SimpleObject(new Fx.Effect);
Fx.Scroll.extend({
	initialize:function(el,opts){
		this.el=el;
		this.options=ThinkJS.apply(this.options,opts);
		this.el.style.overflow='hidden';
	},
	up:function(){
		return this.custom(this.el.scrollTop,0);
	},
	down:function(){
		return this.custom(this.el.scrollTop,this.el.scrollHeight-this.el.offsetHeight);
	},
	increase:function(){
		this.el.scrollTop=this.now;
	}
});
Fx.Width=ThinkJS.SimpleObject(new Fx.Effect);
Fx.Width.extend({
	initialize:function(el,opts){
		this.el=el;
		this.options=ThinkJS.apply(this.options,opts);
		this.el.style.overflow='hidden';
		this.iniWidth=this.el.offsetWidth;
	},
	toggle:function(){
		if (this.el.offsetWidth>0){
			return this.custom(this.el.offsetWidth,0);
		}else{
			return this.custom(0,this.iniWidth);
		}
	},
	show:function(){
		return this.set(this.iniWidth);
	},
	increase:function(){
		this.setStyle(this.el,'width',this.now);
	}
});
Fx.Height=ThinkJS.SimpleObject(new Fx.Effect);
Fx.Height.extend({
	initialize:function(el,opts){
		this.el=el;
		this.options=ThinkJS.apply(this.options,opts);
		this.el.style.overflow='hidden';
		this.iniHeight=this.el.offsetHeight;
	},
	toggle:function(){
		if(this.el.offsetHeight>0){
			return this.custom(this.el.offsetHeight,0);
		}else{
			return this.custom(0,this.el.scrollHeight);
		}
	},
	show:function(){
		return this.set(this.el.scrollHeight);
	},
	increase:function(){
		this.setStyle(this.el,'height',this.now);
	}
});

ThinkJS.Dom.extend({
	FxOpacity:function(fn,opts,n){
		var n=parseInt(n).limit(0,(this.elements.length - 1)),FO=[];
		this.elements.each(function(el){
			if(el.FNS==undefined){el.FNS={FX:{O:{}}};}
			if(el.FNS.FX.O[fn]==undefined){el.FNS.FX.O[fn]=new Fx.Opacity(el,opts);}
			FO.push(el.FNS.FX.O[fn]);
		});
		if(ThinkJS.is(n)&&(ThinkJS.type(FO[n][fn])=='function')){
			FO[n][fn]();
		}else{
			FO.each(function(o){if(ThinkJS.type(o[fn])=='function'){o[fn]();}});
		}
		return this;
	},
	FxColor:function(fn,ppt,hex,opts,n){
		var n=parseInt(n).limit(0,(this.elements.length - 1)),FC=[];
		this.elements.each(function(el){
			if(el.FNS==undefined){el.FNS={FX:{C:{}}};}
			if(el.FNS.FX.C[fn]==undefined){el.FNS.FX.C[fn]=new Fx.Color(el,ppt,hex,opts);}
			FC.push(el.FNS.FX.C[fn]);
		});
		if(ThinkJS.is(n)&&(ThinkJS.type(FC[n][fn])=='function')){
			FC[n][fn]();
		}else{
			FC.each(function(o){if(ThinkJS.type(o[fn])=='function'){o[fn]();}});
		}
		return this;
	},
	FxScroll:function(fn,opts,n){
		var n=parseInt(n).limit(0,(this.elements.length - 1)),FS=[];
		this.elements.each(function(el){
			if(el.FNS==undefined){el.FNS={FX:{S:{}}};}
			if(el.FNS.FX.S[fn]==undefined){el.FNS.FX.S[fn]=new Fx.Scroll(el,opts);}
			FS.push(el.FNS.FX.S[fn]);
		});
		if(ThinkJS.is(n)&&(ThinkJS.type(FS[n][fn])=='function')){
			FS[n][fn]();
		}else{
			FS.each(function(o){if(ThinkJS.type(o[fn])=='function'){o[fn]();}});
		}
		return this;
	},
	FxWidth:function(fn,opts,n){
		var n=parseInt(n).limit(0,(this.elements.length - 1)),FW=[];
		this.elements.each(function(el){
			if(el.FNS==undefined){el.FNS={FX:{W:{}}};}
			if(el.FNS.FX.W[fn]==undefined){el.FNS.FX.W[fn]=new Fx.Width(el,opts);}
			FW.push(el.FNS.FX.W[fn]);
		});
		if(ThinkJS.is(n)&&(ThinkJS.type(FW[n][fn])=='function')){
			FW[n][fn]();
		}else{
			FW.each(function(o){if(ThinkJS.type(o[fn])=='function'){o[fn]();}});
		}
		return this;
	},
	FxHeight:function(fn,opts,n){
		var n=parseInt(n).limit(0,(this.elements.length - 1)),FH=[];
		this.elements.each(function(el){
			if(el.FNS==undefined){el.FNS={FX:{H:{}}};}
			if(el.FNS.FX.H[fn]==undefined){el.FNS.FX.H[fn]=new Fx.Height(el,opts);}
			FH.push(el.FNS.FX.H[fn]);
		});
		if(ThinkJS.is(n)&&(ThinkJS.type(FH[n][fn])=='function')){
			FH[n][fn]();
		}else{
			FH.each(function(o){if(ThinkJS.type(o[fn])=='function'){o[fn]();}});
		}
		return this;
	}
});

ThinkJS.apply(window,{
	$:function(/*arguments*/){
		return new ThinkJS.Dom(arguments);
	},
	$$:function(s,o){
		return new ThinkJS.Dom(s,o);
	},
	onReady:function(fn){
		return (new ThinkJS.Ready()).onDomReady(fn);
	},
	getWidth:function(){
		var x=0;
		if(ThinkJS.safari){
			x=this.innerWidth;
		}else if(ThinkJS.opera){
			x=document.body.clientWidth;
		}else{
			x=ThinkJS.strict?document.documentElement.clientWidth:document.body.clientWidth;
		}
		return x;
	},
	getHeight:function(){
		var y=0;
		if(ThinkJS.safari){
			y=this.innerHeight;
		}else if(ThinkJS.opera){
			y=document.body.clientHeight;
		}else{
			y=ThinkJS.strict?document.documentElement.clientHeight:document.body.clientHeight;
		}
		return y;
	},
	getScrollWidth:function(){
		var x=0;
		if (ThinkJS.msie){
			x=Math.max(document.documentElement.offsetWidth,document.documentElement.scrollWidth);
		}else if(ThinkJS.safari){
			x=document.body.scrollWidth;
		}else{
			x=document.documentElement.scrollWidth;
		}
		return x;
	},
	getScrollHeight:function(){
		var y=0;
		if (ThinkJS.msie){
				y=Math.max(document.documentElement.offsetHeight,document.documentElement.scrollHeight);
		}else if(ThinkJS.safari){
			y=document.body.scrollHeight;
		}else{
			y=document.documentElement.scrollHeight;
		}
		return y;
	},
	getScrollX:function(){
		return this.pageXOffset||document.documentElement.scrollLeft;
	},
	getScrollY:function(){
		return this.pageYOffset||document.documentElement.scrollTop;
	},
	getSize:function(){
		return {
			'size':{'x':this.getWidth(),'y':this.getHeight()},
			'scrollSize':{'x':this.getScrollWidth(),'y':this.getScrollHeight()},
			'scroll':{'x':this.getScrollX(),'y':this.getScrollY()}
		};
	}
});