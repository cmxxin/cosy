require('../app/models/user')
require('../app/models/article')
require('../app/models/category')
require('../app/models/message')
require('../app/models/image')

var User 			= require('../app/controllers/user');
var Article 	= require('../app/controllers/article');
var Category  = require('../app/controllers/category');
var Image 		= require('../app/controllers/image')

module.exports = function(app) {
	app.get('/', Article.list)
	app.get('/cat/:name', Article.catList)
	app.get('/search/:name', Article.searchList)
	app.get('/article/:id', Article.detail)
	app.post('/reply', Article.reply)
	app.get('/admin/register', User.register)
	app.get('/admin/login', User.login)
	app.post('/admin/signup', User.signup)
	app.post('/admin/signin', User.signin)
	app.get('/admin/list', User.isAdmin, Article.adminList)
	app.get('/admin/article/del/:id', User.isAdmin, Article.delArticle)	
	app.get('/admin/article/edit/:id', User.isAdmin, Article.edit)
	app.get('/admin/article/new', User.isAdmin, Article.new)
	app.post('/admin/article/modify', User.isAdmin, Article.modify)
	app.post('/admin/article/add', User.isAdmin, Article.add)
	app.post('/admin/article/reject', User.isAdmin, Article.reject)
	app.post('/admin/Image/add', User.isAdmin, Image.newImage)
	app.get('/admin/Image/list', User.isAdmin, Image.getImgList)
	app.get('/404', function *(next){
		// yield this.render('/404', {
	 //    title: 'CosyHTML'
	 //  })
		this.body = 'Page not Found Cmax'
	})
	// app.get('/detail/:id', Article.index)
	// app.get('/admin/login', User.login)
	// app.get('/admin/list', User.isLogin, User.isAdmin, Article.list)
	// app.get('/admin/article', User.isLogin, User.isAdmin, Article.article)
}
