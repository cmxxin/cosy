var router = require('koa-router')();

router.get('/', function *(next) {
  yield this.render('admin/edit', {
    title: 'Hello World Koa!'
  });
});

module.exports = router;
