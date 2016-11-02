$(function(){
	$(document)
	.on('click', '.call-dialog', function(){
		if($(this).hasClass('reply-to')){
			var msgId = $(this).data('id');
			$('.btn-submit').data('type', 'isChild');
			$('.btn-submit').data('msgId', msgId);

			console.log($('.btn-submit').data('msgId'));
		}else{
			$('.btn-submit').data('type', 'isParent');
		}
	})

	.on('click', '.btn-submit', function(){
		var id 			= $(this).data('artid'),
				name 		= $('#username').val(),
				email 	= $('#email').val(),
				siteUrl = $('#siteUrl').val(),
				message = $('#message').val(),
				isChild = $(this).data('type') == 'isChild' ? true : false,
				msgId 	= $(this).data('msgId');
		$.ajax({
			url: '/reply',
			type: 'POST',
			data: {articles: id, name: name, email: email, siteUrl: siteUrl, message: message, isChild: isChild, msgId: msgId},
			success: function(data){
				if(data){
					alert('回复成功，等待审核中...');
				}else{
					alert('回复失败，请稍后重试...');
				}
				$('.overlay, .dialog').removeClass('show');
				$('html').css('overflow', 'visible');
			}
		})
	})

})