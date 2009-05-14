	
	/*  LEAF JavaScript Library
	 *  Leonardo Dutra
	 *  v0.6.090513a
	 *  WORKING DRAFT
	 *
	 *  Copyright (c) 2009, Leonardo Dutra.
	 *  All rights reserved.
	 *
	 *  Only owners, holders and contribuitors should use and modify this source and binary forms and:
	 *
	 *      * Have in mind that this is only a working draft.
	 *
	 *      * Versions of source code must retain the above copyright notice,
	 *        this list of conditions and the following disclaimer.
	 *
	 *      * Versions in binary form must reproduce the above copyright notice,
	 *        this list of conditions and the following disclaimer in the documentation
	 *        and/or other materials provided with the distribution.
	 *
	 *      * Neither the name of Leonardo Dutra nor the names of its
	 *        contributors may be used to endorse or promote products derived from this
	 *        software.
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
	
	
	leaf.Mouse.doSelect = function (mouseEvent) {
		/* add in a Document listener for mousedown to start a selection pane
		 * TODO: must not leak memory, must use less resources
		 */
		
		if ((mouseEvent = leaf.Mouse.getPosition(mouseEvent))) 
		{
			alert(mouseEvent.targetObject)
			var d = (leaf.Mouse.doSelect.dom = new leaf.DOMElement());
			d.createElement('div', null, (d.startX = mouseEvent.x), (d.startY = mouseEvent.y), 999, 0, 0);
			d.getStyle().lineHeight = '0px';
			d.setBorder('#007', 2);
			d.setBackground('#00f');
			d.setOpacity(0.2);
			leaf.Mouse.doSelect.fn = function ($) {
				var o = leaf.Mouse;
				var mx = ($ = o.getPosition(($ = $||event))).x;
				var my = $.y;
				var x = (o = o.doSelect.dom).startX;
				var y = o.startY;
				var w = ($ = o.getSize()).width;
				var h = $.height;
				if (mx < x)
				{	
					w = x - mx;
					x = mx;
				}
				else {
					w = mx -x;
				}
				if (my < y)
				{	
					h = y - my;
					y = my;
				}
				else {
					h = my -y;
				}
				o.setArea(x, y, null, w, h);
			};
			leaf.Document.addEvent('mousemove',leaf.Mouse.doSelect.fn);
			leaf.Document.addEvent('mouseup', function (e) {
				leaf.Document.removeEvent('mousemove', leaf.Mouse.doSelect.fn)
				leaf.Document.removeEvent('mouseup', arguments.callee);
				leaf.Mouse.doSelect.dom.purgeElement();
				leaf.Mouse.doSelect.dom = null;
			});
			d.appendElement();
		}
	};
	
	
	
	
	/* Constructor */
	leaf.AJAX = function (method, uri, responseHandler, isAsync, user, password) {
		if (this instanceof leaf.AJAX) {
			this.AJAX(method, uri, responseHandler, isAsync, user, password);
		}
	};
	
	leaf.AJAX.createXMLHttpRequest = function() {
		return this.core.createXMLHttpRequest();
	};
	
	leaf.AJAX.core = {
		createXMLHttpRequest: function()
		{
			/* constant for optimization */
			var W = window;
			if (W.XMLHttpRequest) 
			{
				return new W.XMLHttpRequest();
			}
			else 
			{
				/* add more ActiveX versions in this array */
				var v = ['MSXML2.XMLHTTP.3.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
				var i = v.length;
				var o;
				while (i--) 
				{
					try 
					{
						o = new W.ActiveXObject(v[i]);
						return o;
					} 
					catch (o) 
					{
					}
				}
			}
			return null;
		}
	};
	
	/* W3C http://www.w3.org/TR/XMLHttpRequest/ "MUST SUPPORT" methods */
	leaf.AJAX.Methods = {
		GET:  'GET',
		POST: 'POST',
		PUT:  'PUT',
		HEAD: 'HEAD',
		DELETE:  'DELETE',
		OPTIONS: 'OPTIONS'
	};
	
	leaf.AJAX.prototype = {

		AJAX: function (method, uri, responseHandler, isAsync, user, password) {
			var self = this;
			var o = self.xhr;
			if (!o) 
			{
				
				(o = self.core.createXMLHttpRequest()).onreadystatechange = function () {
					var a = self;
					var x = a.xhr;
					if (x.readyState===4 && x.status === 200) {
						if (a.responseHandler) {
							a.responseHandler();
						}
					}
					a = (x = null);
				};
				self.xhr = o;
				self.setResponseHandler(responseHandler);
			}
			self.open(method, uri, isAsync, user, password);
		},
		
		open: function (method, uri, isAsync, user, password) {
			var o = this.xhr;
			if (o && 'string'===typeof method && 'string'===typeof uri) {
				var l = uri.indexOf('\?')+1;
				/* decache */
				if (l) {
					l = uri.substr(p).length;
					uri += '&decache=' +(new Date()).getTime();
				}
				else {
					var f = '?decache=' +(new Date()).getTime();
					l = f.length -1;
					uri += f;
				}
				o.open(method, uri, isAsync||isAsync===undefined ? true : false, user||'', password||'');
				if (method.toLowerCase()==='post') {
					o.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					/* params length */
					o.setRequestHeader("Content-length", l);
					o.setRequestHeader("Connection", "close");
				}
			}
		},
		
		send: function () {
			this.xhr.send(null);
		},
		
		getStatus: function () {
			return this.xhr.status;
		},
		
		getReadyState: function () {
			return this.xhr.readyState;
		},
		
		getResponseText: function () {
			return this.xhr.responseText||'';
		},
		
		getResponseXML: function () {
			return this.xhr.responseXML;
		},
		
		getAllResponseHeaders: function () {
			return this.xhr.getAllResponseHeaders();
		},
		
		getResponseHeader: function (header) {
			if ('string'===typeof header) 
			{
				return this.xhr.getResponseHeader(header);
			}
			return null;
		},
		
		setRequestHeader: function (header, value) {
			if ('string'===typeof header && 'string'===typeof value)
			{
				this.xhr.setRequestHeader(header, value);
			}
		},
		
		setResponseHandler: function (responseHandler) {
			this.responseHandler = 'function'===typeof responseHandler ? responseHandler : null;
		}
	};
	
	leaf.AJAX.prototype.core = leaf.AJAX.core;
	leaf.AJAX = leaf.AJAX;
	