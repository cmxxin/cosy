var router = require('koa-router')();

router.get('/', function *(next) {
  yield this.render('tree', {
    title: 'Hello World Koa!'
  });
});

module.exports = router;