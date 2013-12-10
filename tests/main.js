require(['../helper'], function( helper ){
	// Scroll top text
	helper.addEvent(window, 'scroll', function(){
		console.log(helper.scrollTop(window));
	}, this);

	helper.addEvent(document.getElementsByClassName('scroll-top')[0], 'scroll', function(){
		console.log(helper.scrollTop(document.getElementsByClassName('scroll-top')[0]));
	}, this);
});