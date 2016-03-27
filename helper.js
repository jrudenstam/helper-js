/*
 * Helper JS v0.12
 * Simple vanilla JS offering
 * some common helpers to accompany
 * your vanilla JS:ing. Some is written
 * by jrudenstam but not where other 
 * source is providen, but it might have been improved
 *
 * Author: jrudenstam
 * http://typisktmig.se
 */

 (function (root, factory) {
 	// https://github.com/umdjs/umd/blob/master/amdWeb.js
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		root.helper = factory();
	}
}(this, function () {
	return {
		// http://stackoverflow.com/questions/7238177/detect-htmlcollection-nodelist-in-javascript
		isNodeList: function( nodes ) {
			var result = Object.prototype.toString.call(nodes);
			if (typeof nodes === 'object' && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(result) && (nodes.length == 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0))) {
				return true;
			}
			return false;
		},

		// https://davidwalsh.name/nodelist-array
		// https://toddmotto.com/a-comprehensive-dive-into-nodelists-arrays-converting-nodelists-and-understanding-the-dom/
		nodeListToArray: (function(){
			if( typeof(window.NodeList) != 'function' ) {
				return function( nodeList ) {
					var l = [];

					for (var i = 0; i < nodeList.length; i++) {
						l.push(nodeList[i]);
					};

					return l;
				}

			} else {

				return function( nodeList ) {
					return [].slice.call( nodeList );
				}

			}
		})(),

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
					node = node == null ? document : node,
					els = node.getElementsByTagName('*'),
					pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");

					for (var i = 0, j = 0; i < els.length; i++) {
						if ( pattern.test(els[i].className) ) {
							if (single) {
								return els[i];
							} else {
								classElements[j] = els[i];
								j++;
							}
						}
					}

					// To be consistent with getElementsByClassName-implementation
					return classElements.length<1 && single ? undefined : classElements;
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

		// padding on classes to not match substrings in classnames
		// https://github.com/jquery/jquery/blob/master/src/attributes/classes.js
		hasClass: function( classN, ele ) {
			var rclass = /[\t\r\n\f]/g,
			classN = ' ' + classN + ' ';
			classes = this.getAttribute(ele, 'class') || this.getAttribute(ele, 'className') || '';
			return ( (' ' + classes + ' ').replace(rclass, ' ').indexOf( classN ) > -1 );
		},

		addClass: function( classN, ele ) {
			if (!this.hasClass(classN, ele)) {
				var classes = this.getAttribute(ele, 'class') || this.getAttribute(ele, 'className') || "";
				classes = classes + ' ' + classN + ' ';
				classes = classes.replace(/\s{2,}/g, ' ');
				ele.setAttribute('class', classes);
			}
		},

		removeClass: function( classN, ele ) {
			if (this.hasClass(classN, ele)) {
				var classes = this.getAttribute(ele, 'class') || this.getAttribute(ele, 'className') || "";
				classes = classes.replace(classN, '');
				ele.setAttribute('class', classes);
			}
		},

		toggleClass: function( classN, ele ) {
			if (this.hasClass(classN, ele)) {
				this.removeClass(classN, ele);
			} else {
				this.addClass(classN, ele);
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

		// Traverse the DOM upward until filter function returns true
		// filter function runs in context passed to up()
		up: function( startNode, filterFunction, ctx ) {
			ctx = ctx || this;
			if (filterFunction.apply(ctx, [startNode])) {
				return startNode;
			} else if(startNode.parentNode && startNode.parentNode !== document) {
				return this.up(startNode.parentNode, filterFunction, ctx);
			} else {
				return false;
			}
		},

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FObject%2Fcreate
		create: (function(){
			if (!Object.create) {
				function F(){};

				return function( prototype, properties ){
					F.prototype = prototype;
					var r = new F();

					if ( properties ) {
						for ( var prop in properties ) {
							r[prop] = properties[prop];
						}
					}

					return r;
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
					node.attachEvent( 'on' + type, function( event ){
						callback.apply(node, [event]);
					} );
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

		addEvent: function(node, type, callback, sender) {
			var wrapCallback = (function( helper ){
				return function( event ){
					callback.apply(this, [helper.normaliseEvent(event || window.event), sender]);
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

		ajax: function( url, callback, data, async, ctx, args ) {
			var method = data ? 'POST' : 'GET', // Default to 'GET'
			async = async || true, // Default to async mode
			req = this.ajaxObject(),
			ctx = ctx || window;

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

				/*
				 * Pass on any extra arguments the callback
				 */
				callback.apply(ctx, [req, args]);
			}

			if (req.readyState == 4) {
				return;
			}

			req.send(data);
		},

		jsonpCallback:function( callback ){
			window.cbs = window.cbs || [];
			window.cbs.push((function(cb, count){
				return function(data){
					var newScript=document.getElementById('jsonpScript_'+count);
					newScript.parentNode.removeChild(newScript);
					cb(data);
				}
			})(callback, window.cbs.length));
			return 'window.cbs['+(window.cbs.length-1)+']';
		},

		jsonp: function( url, callback, data ) {
			var data = data || {},
			src = url + (url.indexOf("?")+1 ? "&" : "?"),
			head = document.getElementsByTagName("head")[0],
			newScript = document.createElement("script"),
			params = [];

			data.callback = this.jsonpCallback(callback);
			newScript.id="jsonpScript_"+(window.cbs.length-1);

			for(var paramName in data){  
				params.push(paramName + "=" + encodeURIComponent(data[paramName]));
			}

			src += params.join("&")
			newScript.type = "text/javascript";
			newScript.src = src;

			head.appendChild(newScript); 
		},

		// http://stackoverflow.com/questions/871399/cross-browser-method-for-detecting-the-scrolltop-of-the-browser-window
		scrollTop: function( el ) {
			// If el is window and browser support pageYOffset
			if (el === window) {
				if (typeof pageYOffset!= 'undefined') {
					return pageYOffset;
				} else {
					var B= document.body, //IE 'quirks'
					D= document.documentElement; //IE with doctype
					D = (D.clientHeight) ? D : B;
					return D.scrollTop;
				}
			} else {
				return el.scrollTop;
			}
		}
	};
}));