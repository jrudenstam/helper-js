# Make more vanilla JS
I use this helper to support som of the most common browser inconsistencies and lack of native functionality. Written as a AMD module to be easy to hook up to your require.js project.

## AMD
If you don´t use require.js the module will expose as <code>window.helper</code>.

## Methods
- isNodeList( nodes )
- getByClass( searchClass, node, single )
- getAttribute( ele, attr )
- hasClass( ele, class )
- addClass( ele, class )
- removeClass( ele, class )
- getByAttr( searchAttr, node, single )
- create( prototype )
- up( startNode, filterFunction, context )
- addEvent( node, type, callback, contextToRunCbIn )
- removeEvent( objectReturnedByAddEvent )
- ajax( url, callback, data, async )
- jsonp( url, callback, data )