require(['../helper'], function( helper ){

	// Scroll top text
	helper.addEvent(window, 'scroll', function(){
		console.log(helper.scrollTop(window));
	}, this);

	helper.addEvent(document.getElementsByClassName('scroll-top')[0], 'scroll', function(){
		console.log(helper.scrollTop(document.getElementsByClassName('scroll-top')[0]));
	}, this);

	var h4s = document.getElementsByTagName('h4');

	for (var i = 0; i < h4s.length; i++) {
		helper.addEvent( h4s[i], 'click', function(){
			var no = document.getElementById('elementNo'),
			elems = document.getElementsByTagName('h4'),
			arrList = helper.nodeListToArray( elems ),
			index = arrList.indexOf(this);

			no.innerHTML = index;
		} );
	};

});