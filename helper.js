/*
 * helper v0.1
 * Simple vanilla JS offering
 * some common helpers to accompany
 * your vanilla JS:ing. Some is written
 * by jrudenstam but not where other 
 * source is providen, but it might have been improved
 *
 * Author: jrudenstam
 * http://typisktmig.se
 */

define(function(){
	var helper = {
		// http://stackoverflow.com/questions/7238177/detect-htmlcollection-nodelist-in-javascript
		isNodeList: function( nodes ) {
			var result = Object.prototype.toString.call(nodes);
			if (typeof nodes === 'object' && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(result) && (nodes.length == 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0))) {
				return true;
			}
			return false;
		},

		/*
		 * Cross browser getElementsByClassName, which uses native
		 * if it exists. Modified version of Dustin Diaz function:
		 * http://www.dustindiaz.com/getelementsbyclass
		 */
		getByClass: (function() {
			if (document.getElementsByClassName) {
				return function( searchClass, node, single ) {
					if (single) {
						return node.getElementsByClassName(searchClass)[0];
					} else {
						return node.getElementsByClassName(searchClass);
					}
				};
			} else {
				return function( searchClass, node, single ) {
					var classElements = [],
						tag = '*';
					if (node == null) {
						node = document;
					}
					var els = node.getElementsByTagName(tag);
					var elsLen = els.length;
					var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
					for (var i = 0, j = 0; i < elsLen; i++) {
						if ( pattern.test(els[i].className) ) {
							if (single) {
								return els[i];
							} else {
								classElements[j] = els[i];
								j++;
							}
						}
					}
					return classElements;
				};
			}
		})(),

		// (elm, attribute) Source: http://stackoverflow.com/questions/3755227/cross-browser-javascript-getattribute-method
		getAttribute: function( ele, attr ) {
			var result = (ele.getAttribute && ele.getAttribute(attr)) || null;
			if( !result ) {
				var attrs = ele.attributes;
				var length = attrs.length;
				for(var i = 0; i < length; i++) {
					if (attr[i] !== undefined) {
						if(attr[i].nodeName === attr) {
							result = attr[i].nodeValue;
						}
					}
				}
			}
			return result;
		},

		hasClass: function( ele, classN ) {
			var classes = this.getAttribute(ele, 'class') || this.getAttribute(ele, 'className') || "";
			return (classes.search(classN) > -1);
		},

		addClass: function( ele, classN ) {
			if (!this.hasClass(ele, classN)) {
				var classes = this.getAttribute(ele, 'class') || this.getAttribute(ele, 'className') || "";
				classes = classes + ' ' + classN + ' ';
				classes = classes.replace(/\s{2,}/g, ' ');
				ele.setAttribute('class', classes);
			}
		},

		removeClass: function( ele, classN ) {
			if (this.hasClass(ele, classN)) {
				var classes = this.getAttribute(ele, 'class') || this.getAttribute(ele, 'className') || "";
				classes = classes.replace(classN, '');
				ele.setAttribute('class', classes);
			}
		},

		getByAttr: (function(){
			if(document.querySelector && document.querySelectorAll){
				return function( searchAttr, node, single ) {
					var node = node || document;
					if (single) {
						return node.querySelector('['+searchAttr+']');
					} else {
						return node.querySelectorAll('['+searchAttr+']');
					}
				};
			} else {
				return function( searchAttr, node, single ) {
					var node = node || document,
					attrElements = [],
					tag = '*',
					els = node.getElementsByTagName(tag),
					bools = ['checked', 'selected', 'async', 'autofocus', 'autoplay', 'controls', 'defer', 'disabled', 'hidden', 'ismap', 'loop', 'multiple', 'open', 'readonly', 'required', 'scoped'];

					for (var i = 0; i < els.length; i++) {
						// IE returnerar tom sträng när man anger attribut utan värde (boolean) undefined om attributet inte är angivet
						// Moderna webbläsare returnerar false när man inte angett bool-attribut
						// men tom sträng om man inte anget ett värde-attribut (som placeholder ex.).
						// Därför kollar vi först om det är en bool vi letar efter för att veta
						// hur vi kan testa om den är angiven eller ej i moderna webbläsare
						if ((bools.indexOf(searchAttr) >= 0 && (els[i][searchAttr] !== undefined || els[i][searchAttr] === true)) || (!bools.indexOf(searchAttr) >= 0 && (els[i][searchAttr] !== undefined && els[i][searchAttr] !== '')) ) {
							if (single) {
								return els[i];
							} else {
								attrElements.push(els[i]);
							}
						}
					}
					return attrElements;
				};
			}
		})(),

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FObject%2Fcreate
		create: (function(){
			if (!Object.create) {
				function F(){};

				return function( prototype ){
					if (arguments.length != 1) {
						throw new Error('Object.create implementation only accepts one parameter.');
					}

					F.prototype = prototype;
					return new F();
				}
			} else {
				return Object.create;
			}
		})(),

		registerEventHandler: (function(){
			if ( document.addEventListener ) {
				return function( node, type, callback ){
					node.addEventListener(type, callback, false );
				};
			} else if ( document.attachEvent ){
				return function( node, type, callback ) {
					node.attachEvent( 'on' + type, callback );
				};
			}
		})(),

		unregisterEventHandler: (function(){
			if ( document.addEventListener ) {
				return function( node, type, callback ){
					node.removeEventListener(type, callback, false );
				};
			} else if ( document.attachEvent ){
				return function( node, type, callback ) {
					node.detachEvent( 'on' + type, callback );
				};
			}
		})(),

		addEvent: function(node, type, callback, ctx) {
			var ctx = ctx || window,
			wrapCallback = (function( helper ){
				return function( event ){
					callback.apply(ctx, [helper.normaliseEvent(event || window.event)]);
				}
			})(this);

			this.registerEventHandler(node, type, wrapCallback);

			// Return object to make event handler easy to detach
			return {
				node: node,
				type: type,
				callback: wrapCallback
			};
		},

		removeEvent: function( object ) {
			this.unregisterEventHandler( object.node, object.type, object.callback );
		},

		normaliseEvent: function( event ) {
			if (!event.stopPropagation) {
				event.stopPropagation = function() {this.cancelBubble = true;};
				event.preventDefault = function() {this.returnValue = false;};
			}

			if (!event.stop) {
				event.stop = function() {
					this.stopPropagation();
					this.preventDefault();
				};
			}

			if (event.srcElement && !event.target) {
				event.target = event.srcElement;
			}

			return event;
		},

		ajaxObject: (function(){
			var factories = [
				function () {return new XMLHttpRequest()},
				function () {return new ActiveXObject("Msxml2.XMLHTTP")},
				function () {return new ActiveXObject("Msxml3.XMLHTTP")},
				function () {return new ActiveXObject("Microsoft.XMLHTTP")}
			],
			xmlhttp = false;

			for (var i=0;i<factories.length;i++) {
				try {
					xmlhttp = factories[i]();
				}
				catch (e) {
					continue;
				}
				// Return function that creates new object
				// not an instance
				xmlhttp = factories[i];
				break;
			}

			return xmlhttp;
		})(),

		ajax: function( url, callback, data, async ) {
			var method = data ? 'POST' : 'GET', // Default to 'GET'
			async = async || true, // Default to async mode
			req = this.ajaxObject();

			if (!req) {
				return;
			}
			
			req.open(method,url,async);

			// Set extra headers passed to ajax()
			if (arguments.length > 4) {
				for (var i = 4; i < arguments.length; i++){
					if (arguments[i][0] && arguments[i][0]){
						req.setRequestHeader(arguments[i][0], arguments[i][1]);
					}
				}
			}

			if (data) {
				req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			}

			req.onreadystatechange = function () {
				if (req.readyState != 4) {
					return;
				}

				if (req.status != 200 && req.status != 304) {
					return;
				}

				callback(req);
			}

			if (req.readyState == 4) {
				return;
			}

			req.send(data);
		},

		jsonpCallback: function(){},

		jsonp: function( url, callback, data ) {
			var data = data || {},
			src = url + (url.indexOf("?")+1 ? "&" : "?"),
			head = document.getElementsByTagName("head")[0],
			newScript = document.createElement("script"),
			params = [];

			this.jsonpCallback = callback;
			data.callback = 'this.jsonpCallback';

			for(var paramName in data){  
				params.push(paramName + "=" + encodeURIComponent(data[paramName]));
			}

			src += params.join("&")
			newScript.type = "text/javascript";
			newScript.src = src;

			head.appendChild(newScript); 
		}
	}

	return helper;
});