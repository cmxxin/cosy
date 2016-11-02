$(function(){
	$(document)

	.on('click', '.menuBtn', function(){
		var menu = $($('nav.menu')),
				height = menu.find('a').length * 32 + 30 +'px';
		menu.toggleClass('in');
		menu.css('height', menu.hasClass('in') ? height : 0)
	})

	.on('keyup', '.search-bar input', function(e){
		if(e.keyCode == 13){
			window.location.href = '/search/'+encodeURI($(this).val());
		}
	})

	.on('click', '.call-dialog', function(){
		$('html').css('overflow', 'hidden');
		$('.overlay, .dialog').addClass('show');
	})

	.on('click', '.goBack', function(){
		window.location=document.referrer;
	})

	.on('click', '.close-dialog', closeDialog)
	$('.overlay').on('click', closeDialog)

	function closeDialog() {
		$('.overlay, .dialog').removeClass('show');
		$('html').css('overflow', 'visible');
	}


	var scrollCtrl = function(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        docHeight = $(document).height(),
        winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;

    winHeight / 2 < scrollTop ? $('.fixed-bar').removeClass("hide") : $('.fixed-bar').addClass("hide");
	}

	$(window).on("scroll", function(){
		var a = new scrollCtrl();
	});
	

})
