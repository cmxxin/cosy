var app       = require('koa')(),
    fs        = require('fs'),
    path      = require('path'),
    koa       = require('koa-router')(),
    logger    = require('koa-logger'),
    json      = require('koa-json'),
    views     = require('koa-views'),
    onerror   = require('koa-onerror'),
    mongoose  = require('mongoose'),
    uristring = 'mongodb://localhost/cosy',
    session   = require('koa-session');

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.keys = ['cmxxin@cmax.cosy.html.com'];
app.use(session(app));

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function *pageNotFound(next){
  yield next;
  if (404 == this.status) 
    this.redirect('/404');
  
})

app.use(require('koa-static')(__dirname + '/public'));

require(__dirname+'/routes/router')(koa)
// mount root routes  
app.use(koa.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

module.exports = app;
