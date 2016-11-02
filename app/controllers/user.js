var mongoose  = require('mongoose');
    User      = mongoose.model('User');

exports.register = function *(next){
  yield this.render('/admin/login', {
    type: 'Register'
  })
}

exports.login = function *(next){
  yield this.render('/admin/login', {
    type: 'Login'
  })
}

exports.isAdmin = function *(next){
  if (this.session.user) {
    yield next;
  } else {
    this.redirect('/admin/login');
    this.status = 302;
  }
}

exports.signup = function *(next){
  var body      = this.request.body,
      email     = body.username,
      password  = body.password,
      status    = 1;

  var user = yield User.findOne({name: email}).exec();
  if(user){
    this.body = {
      msg: '用户名已存在...',
      status: 0
    }
    return
  }

  var newUser = new User({name: email, password: password});
  newUser = newUser.save();
  if(newUser){
    this.body = {
      msg: '恭喜您注册成功...',
      status: 1
    }
  }else{
    this.body = {
      msg: '注册失败，请稍后重试...',
      status: 0
    }
  }
  
}


exports.signin = function *(next){
  var ctx = this;
  var body      = this.request.body,
      email     = body.username,
      password  = body.password,
      isMatch,
      status;

  yield User.findOne({name: email}, function(err, user){
    if(!user){
      status = 0;
    }else{
      user.comparePassword(password, function(err, isMatch){
        if(isMatch){
          user = user.toObject();
          delete user.password;
          ctx.session.user = user;
          status = 1;
        }else{
          status = 0;
        }
      })
    }

  });

  if(status){
    this.body = {
      status : 1
    }
  }else{
    this.body = { 
      msg: '用户名或密码输入错误...',
      status: 0
    }
  }
  
}