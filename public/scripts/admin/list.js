$(function(){
	var translateX = $('.ext-opt').width(),
			isShow = false,
			startTime, startX,
			query=window.location.search;

	if(query.split('?')[1]){
		var params = query.split('?')[1];
		var arr = params.split('&');
		var obj = {}
		for (var i = 0; i < arr.length; i++) {
			var val = arr[i].split('=');
			obj[val[0]] = val[1];
		}

		if(obj.orderby){
			var target;
			if(obj.orderby == 'time'){
				target = $('.filter .time');
			}else if(obj.orderby == 'msg'){
				target = $('.filter .msg');
			}else if(obj.orderby == 'pv'){
				target = $('.filter .pv');
			}

			target.addClass('cur');

			if(obj.desc == 1){
				target.addClass('up').removeClass('down');
			}else{
				target.addClass('down').removeClass('up');
			}
		}
		var val = $('#category').val();
		if(val != "" && val != undefined && val !='All'){
			$('.filter li').eq(0).children('a').addClass('cur')
			$('.filter li').eq(0).children('a').children('span').text(val)
		}else{
			$('.filter li').eq(0).children('a').removeClass('cur').children('span').text('分类')
		}
	}

	$(document)
	.on('keyup', '.search-bar input', function(e){
		if(e.keyCode == 13){
			window.location.href = '/admin/list?keyword='+encodeURI($(this).val());
		}
	})
	.on('click', '.goBack', function(){
		window.location=document.referrer;
	})

	.on('click', '.filter a', function(){
		if($(this).hasClass('by-category')){
			if($('.category').hasClass('show')){
				$('.category').height(0).removeClass('show')
			}else{
				$('.category').height($('.category dl').height()).toggleClass('show');
			}
		}else{
			var type = $(this).data('type');
			var desc = 1;
			$(this).addClass('cur').parent('li').siblings().children('a').removeClass('cur up down');
			if($(this).hasClass('up')){
				desc = -1
			}else{
				desc = 1
			}
			var keyword = $('#keyword').val()
			var cat = $('#category').val();
			window.location.href = '/admin/list?keyword='+keyword+'&cat='+cat+'&orderby='+type+'&desc='+desc;
		}
		
	})

	.on('click', '.category a', function(){
		var id = $(this).text();
		var keyword = $('.search-bar input').val();
		window.location.href = '/admin/list?keyword='+keyword+'&cat='+id;
	})


	.on('touchstart', '.article-list dd>a', function(e){

		if(isShow){
			$('.operation').removeClass('operation').children('a').css('transform', 'translateX(0px)');
		}else{
			startTime = Date.now();
			startX = e.touches[0].pageX;
		}
	})

	.on('touchmove', '.article-list dd>a', function(e){
		var curX = e.touches[0].pageX;
		var rangeX = curX - startX;
		if(Math.abs(rangeX) > 10){
			if(rangeX < 0){
				rangeX = rangeX < -100 ? (rangeX + 100) / 3 - 100 : rangeX;
				$(this).css({
					'transform': 'translateX('+ rangeX +'px)',
					'transition': 'all 0s ease-in'
				});
			}
		}
	})

	.on('touchend', '.article-list dd>a', function(e){
		var endTime = Date.now(),
				endX = e.changedTouches[0].pageX;

		if((endTime - startTime < 200 && endX - startX < -30) || endX - startX < -40){
			$(this).css({'transition': 'all .15s ease-in', 'transform': 'translateX(-100px)'}).parent().addClass('operation');
			isShow = true;
			return false
		}else{
			$(this).css({'transition': 'all .15s ease-in', 'transform': 'translateX(0px)'});
		}

	})
})