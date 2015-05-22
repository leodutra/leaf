[leaf](visual/logo.png) # leaf
Automatically exported from code.google.com/p/leaf


<font color="red">*This project is dead.* The standards (HTML5, ECMA,...) are doing great!</font>

*LEAF was created in 2009-2010 to ease the development of web and Adobe AIR apps, gadgets, widgets and APIs.*

It is fully compatible with intellisense editors, like Aptana Studio, JSEclipse, Adobe Dreamweaver and others; just because it has a simple and well thinked data structure. 

*Optimum compatibility, speed and size* are the most important rules of this project. LEAF purpouse is to serve as core in JavaScript implementations. It has only easing and crossbrowser functions; the real needed with the best performance.

You can *download the current alpha version of LEAF*. It's open source and you can modify, customize and distribute.

Collaborate to the project if you have advanced knowledge of JavaScript, DOM, XHTML and all the web context. Let's make a better LEAF together.

*Use and enjoy it!*

<br />
<font color="gray">*LEAF is compatible with: IE 5.5+, FF 1.0+, Chrome 1+, OP 8+, Safari, IPhone, Adobe AIR, (...)*
<br />

*Changes on LEAF v0.10a*
<br />
    - added ECMA 5 functions. These functions will work even on JavaScript 1.5:
{{{
    "string".trim()
    "string".trimLeft()
    "string".trimRight()
    "string".toJSON()

    {Date}.toJSON()
    {Object}.toJSON()
    {Number}.toJSON()

    [].forEach()
    [].every()
    [].filter()
    [].map()
    [].some()
    [].indexOf()
    [].lastIndexOf()

    Array.isArray()
}}}
    - faster createXHR, with the best ActiveX for old IE versions;<br />
    - fast functions and numeric operations (tons of bitwise)<br />

    Soon... animation with easing equations.
<br />
<br />
*Sample of LEAF v0.10a*

</font>
{{{
leaf.addListener(window, 'load', function ()
{
    var box = new leaf.ElementHandler();     // a handler full of features
                                             // it's like a box, for optimum set/get
	
    box.createElement('div', null, null, {   // creates element inside the handler
        width: '40px',                       // args: tagName, id, classNames:Array||String, cssObj:Object, content
        height: '40px',
        position: 'absolute'
    },
    'Hello Web');                        // content set on creation too
    box.setOpacity(0.5);                 // cross-browser (0.00 to 1.00)
    box.append();                        // quick element append (if no node is being passed, append to the <body>)
});

var xmlHttpRequester = leaf.createXHR(); // Native calls, very fast ActiveX setup

[0, 1, 2, 3]                             //.each, .map, .filter, .every and more from ECMA 5, even when using JavaScript 1.5!
alert("   text   ".trim());              // ECMA 5 String.trim()! Even when using JavaScript 1.5 too!
}}}
<br />
<font size="1" face="verdana">Trademarks, enterprises or reserved rights: Adobe, Adobe ActionScript (language), Adobe AIR, Adobe Dreamweaver, Adobe CS4, Aptana, Aptana Studio, Apple iPhone, Apple iPod, Apple Safari, Aptana Studio, Google Chrome, JSEclipse, Microsoft Internet Explorer, Mozilla Firefox, Opera and Sun's Java (language). Names had been cited just to make known the use of LEAF, since LEAF is used to enhance the quality and usage of these softwares.</font>
