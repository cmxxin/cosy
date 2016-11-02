$(function(){
	var um = UM.getEditor('editor',{'setWidth':'100px'});
	um.ready(function(){
    var html = $('#editor').text();
    um.setContent(html)
		$('#editor').css('width', '100%');
		$('.edui-toolbar').append('<div class="edui1_toolbar_mask"></div>')
    var tit = $('.h-tit').val();
    if(tit == '' || tit == undefined){
      $('.edui-editor-body').before('<div class="article-tit"><input type="text" placeholder="请在此输入标题"></div>');
    }else{
      $('.edui-editor-body').before('<div class="article-tit"><input type="text" placeholder="请在此输入标题" value="'+tit+'"></div>');
    }
    if($('#editor').text==""){
		  $('#editor').before('<div class="e-placeholder">从这里开始写正文</div>')
    }
	})
	um.addListener('blur',function(){
    $('.edui1_toolbar_mask').show();
    if($('#editor').text() == ''){
    	$('.e-placeholder').show();
    }
  });
  um.addListener('focus',function(){
    $('.edui1_toolbar_mask').hide();
    $('.e-placeholder').hide();
  });
  $(window).on("scroll", function(){
  	var top = document.documentElement.scrollTop || document.body.scrollTop;
  	if(top > 44){
  		$('.edui-toolbar').css({
  			position: 'absolute',
  			top: top-44+'px'
  		});
  	}
  });

  $(document)
  .on('click', '.goBack', function(){
    window.location=document.referrer;
  })
  
  .on('click', '.save-btn', function(){
    var str = {},
        obj = $(this);
    str.id = $('.h-id').val() || '',
    str.title = $('.article-tit input').val(),
    str.summary = um.getContent(),
    str.poster = $('.tempImg img').attr('src') || '',
    str.category = $('#category').val();
    if(obj.hasClass('save-and-publish')){
      str.status = true;
    }
    var url = str.id ? '/admin/article/modify' : '/admin/article/add';
    $.ajax({
      url: url,
      type: 'POST',
      data: str,
      success: function(res){
        if (res) {
          if(obj.hasClass('save-and-publish')){
            alert('成功保存并发布...')
          }else{
            alert('保存成功...')
          }
        }else{
          alert('系统出错...')
        }
      }
    })
  })


  .on('click', '.cancle-publish', function(){
    var id = $('.h-id').val();
    $.ajax({
      url: '/admin/article/reject',
      type: 'POST',
      data: {id: id},
      success: function(res){
        if(res){
          alert('成功撤销发布...');
        }else{
          alert('系统出错...')
        }
      }
    })
  })

  .on('click', '.dialog li', function(){
  	$(this).addClass('choose').siblings('li').removeClass('choose');
  })

  .on('click', '.dialog .page a', function(){
    var obj  = $(this)
        page = $('.dialog .page').data('page');
    if(obj.hasClass('disabled')) return;
    obj.hasClass('prev-page') ? page-- : page++
    getImgList(page)
  })

 	.on('click', '.chooseFile', function(){
    var page = 1;
		$('html').css('overflow', 'hidden');
		$('.overlay, .dialog').addClass('show');
    getImgList(page);
	})

 	.on('click', '.btn-submit', function(){
 		var imgUrl = $('.dialog .choose img').attr('src');
 		$('.tempImg').html('<img src="'+ imgUrl +'">');
 		closeDialog();
 	})

	.on('click', '.close-dialog', closeDialog)

  .on('change', '.uploadFile input', function(){
    var obj  = $(this),
        form = obj.parent('form'),
        type = ['image/pjpeg','image/jpeg','image/png','image/x-png','image/gif','image/bmp'],
        flag = false;

    var options = {
      url: "/admin/image/add",
      type: "POST",
      dataType: "JSON",
      clearForm:true,
      beforeSubmit: function(arr, $form, options){
        $.each(arr, function(index, val) {
          if($.inArray(this.value.type, type) === -1 || this.value.size > 2*1024*1024){
            flag = true;
            return false;
          }
        });
        if(flag){
          alert("格式错误或文件太大。");
          return false;
        } 
      },
      success: function (data) {
        var img = data[data.length-1]
        $('.tempImg').html('<img src="'+ img +'">');
      }
    };
    $('#uploadImage').ajaxSubmit(options);
  })

	$('.overlay').on('click', closeDialog)

	function closeDialog() {
		$('.overlay, .dialog').removeClass('show');
		$('html').css('overflow', 'visible');
	}

  function getImgList(page) {
    $.ajax({
      url: '/admin/Image/list',
      type: 'GET',
      dataType: 'json',
      data: {page: page},
      success: function(data){
        var html = '';
        for (var i = 0; i < data.imgList.length; i++) {
          html += '<li>'+
                    '<img src="'+ data.imgList[i].imgUrl +'", alt="'+ data.imgList[i].baseName +'">'+
                    '<p>'+ data.imgList[i].baseName +'</p>'+
                    '<div class="selected"></div>'+
                  '</li>'
        }
        $('.dialog .tbody ul').html(html);
        $('.dialog .tbody .page b').text(page);
        $('.dialog .tbody .page').data('page', page);
        $('.dialog .prev-page').addClass('disabled');
        $('.dialog .tbody .page strong').text(data.pageCount);
        var width = $('.dialog li').width();


        $('.dialog li').height(width+20+'px');
        $('.dialog li img').css('max-height', width);
        $('.dialog li .selected').height(width);
      }
    });
  }
})