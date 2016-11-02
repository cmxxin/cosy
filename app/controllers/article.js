var mongoose  = require('mongoose'),
    Article   = mongoose.model('Article'),
    Category  = mongoose.model('Category'),
    User      = mongoose.model('User'),
    Message   = mongoose.model('Message'),
    Image     = mongoose.model('Image'),
    moment    = require('moment'),
    parse     = require('co-busboy'),
    os        = require('os'),
    fs        = require('fs'),
    path      = require('path');

// index page
exports.list = function *(next) {

  var articleList = yield Article.find({status: true}).populate({
      path: 'author',
      select: 'name'
    }).exec();
  console.log(articleList)
  yield this.render('index', {
    moment: moment,
    title: 'CosyHTML',
    articleList: articleList
  });
}

// category list page
exports.catList = function *(next) {
  // this.body = this.params.name
  // var list = yield Article.findOne({name:})
  var catName = this.params.name;
  var regex = new RegExp('^'+catName+'$', 'i');
  var art = yield Category.findOne({name: regex}).exec();

  if(art == '' || art == null || art == undefined){
    this.status = 404;
  }else{
    var articleList = yield Article.find({category: art._id, status:true}).populate({
      path: 'author',
      select: 'name'
    }).exec();
    yield this.render('index', {
      moment: moment,
      title: this.params.name,
      articleList: articleList
    });
  }
}

// search page
exports.searchList = function *(next){
  var name = this.params.name;
  var reg = new RegExp(name, 'i');
  var articleList = yield Article.find({title: reg, status:true}).sort('meta.updateAt').exec();
  yield this.render('index', { 
      moment: moment,
      title: this.params.name,
      articleList: articleList
  });
}


// detail page
exports.detail = function *(next){
  var id = this.params.id,
      messageList;
  var itemInfo = yield Article.findOne({_id: id}).populate({
    path: 'category',
    select: 'name'
  }).exec();

  yield Message.find({articles: id, status: true, isChild: false}).populate({
      path: 'reply',
      match: {status : true},
      select: '_id name avatar message meta.updateAt'
    }).exec(function(err, data){
      if(err) console.log(err);
      messageList = data.length ? data : [];
    });
  yield this.render('detail',{
    moment      : moment,
    title       : itemInfo.title,
    itemInfo    : itemInfo,
    messageList : messageList
  });
}

// reply operation
exports.reply = function *(next){
  var data = this.request.body
      articles = data.articles,
      name = data.name,
      email = data.email,
      siteUrl = data.siteUrl,
      message = data.message,
      msgId = data.msgId,
      isChild = (msgId == '' || msgId == undefined) ? false : true,
      ps = 1;
  console.log()
  msg = new Message({name: name, articles: articles, email: email, siteUrl: siteUrl, message: message, isChild: isChild});
  msg.save(function(err, msg){
    if(err){
      console.log(err)
      ps = 0;
    }

    if(isChild){
      Message.findById(msgId, function(err, res){
        if(err){
          console.log(err);
          ps = 0;
        }else{
          res.reply.push(msg._id);
          res.save(function(err, rs){
            ps = err ? 0 : 1;
          })
        }
      })
    }else{
      ps = 1;
    }
  });
  this.body = ps;

}

exports.adminList = function *(next) {
  var where   = {},
      orderby = {'meta.updateAt': -1},
      query   = this.request.query,
      keyword = '',
      type    = '';
  if(query){
    if(query.keyword){
      keyword = query.keyword
      where.title = new RegExp(keyword, 'i');
    }
    if(query.cat && query.cat != 'All'){
      var reg = new RegExp(query.cat, 'i');
      var cat = yield Category.findOne({name: reg}, '_id').exec();
      where.category = cat;
    }
    if(query.orderby){
      var name = query.orderby
      switch (name){
        case 'time':
          type = 'meta.updateAt';
          orderby = {'meta.updateAt': -1};
          break;
        case 'msg':
          type = 'meta.updateAt';
          orderby = {'meta.updateAt': -1};
          break;
        case 'pv':
          type = 'pv';
          orderby = {'pv': -1};
          break;
      }
    }
    if(query.desc){
      orderby[type] = parseInt(query.desc);
    }
  }
  var catList = yield Category.find({}, "_id name").exec();
  var articleList = yield Article.find(where).populate({
    path: 'author',
    select: 'name'
  }).sort(orderby).exec();
  yield this.render('/admin/list', {
    moment: moment,
    title: 'CosyHTML',
    articleList: articleList,
    catList: catList,
    keyword: keyword,
    category: query.cat || 'All'
  });
}

exports.delArticle = function *(next) {
  var id = this.params.id;
  var art = yield Article.remove({_id:id}).exec();
  if( art.result.n ){
    this.redirect('/admin/list');
  }else{
    this.body = '删除失败';
  }
}

exports.edit = function *(next){
  var id = this.params.id;
  var art = yield Article.findOne({_id: id}).populate({
    path: 'category',
    select: 'name'
  }).exec();
  var cat = yield Category.find({}).exec();
  if(art == '' || art == null || art == undefined){
    this.status = 404;
  }else{
    yield this.render('/admin/edit', {
      title: 'CosyHTML',
      article: art,
      catList: cat,
      h1:'修改文章'
    });
  }
}

// new
exports.new = function *(next) {
  var cat = yield Category.find({}).exec();
  yield this.render('/admin/edit', {
    title: 'CosyHTML',
    article: {},
    catList: cat,
    h1: '撰写新文章'
  })
}

exports.modify = function *(next) {
  var data = this.request.body,
      id = data.id,
      result;
  delete data.id;
  var res = yield Article.update({_id: id}, { $set: data}).exec();
  this.body = res ? 1 : 0;
}

exports.add = function *(next) {
  var data = this.request.body;
  delete data.id;
  data.author = this.session.user._id;
  var art = new Article(data)

  var promise = art.save();
  this.body = 1
}

exports.reject = function *(next) {
  var id = this.request.body.id;
  var res = yield Article.update({_id: id}, {$set:{status: false}}).exec();
  this.body = res ? 1 : 0;
}