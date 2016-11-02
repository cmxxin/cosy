$(function(){
	$(document)

	.on('click', '.login-box a', function(){
		var userName = $('#email').val(),
				passWord = $('#password').val(),
				url 		 = $(this).hasClass('login-btn') ? '/admin/signin' : '/admin/signup';

		$.ajax({
			url: url,
			type: 'POST',
			data: {username: userName, password: passWord},
			success: function(data){
				if(data.status){
					if(url == '/admin/signup'){
						alert('success')
						window.location.href = '/admin/login';
					}else{
						window.location.href = '/admin/list';
					}
				}else{
					alert(data.msg);
				}
			}
		})
	})
})