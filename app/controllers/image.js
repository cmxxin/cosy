var mongoose  = require('mongoose'),
    Image     = mongoose.model('Image'),
    parse     = require('co-busboy'),
    fs        = require('fs'),
    path      = require('path');

exports.newImage = function *(next) {
  var parts = parse(this),
      part,
      date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth() * 1 + 1,
      data = [],
      rs=[];

  month = month < 10 ? '0'+month : month;
  fs.stat('public/upload/', function(err, stats){
    if(!stats){
      fs.mkdir('public/upload/')
    }
    fs.stat('public/upload/'+year, function(err, stats){
      if(!stats){
        fs.mkdir('public/upload/'+year)
      }
      fs.stat('public/upload/'+year+'/'+month, function(err, stats){
        if(!stats){
          fs.mkdir('public/upload/'+year+'/'+month)
        }
      })
    })
  })


  while (part = yield parts) {
    var date    = new Date().getTime(),
        random  = parseInt(Math.random()*100000)+'',
        extName = path.extname(part.filename),
        stream  = fs.createWriteStream(path.join('public/upload/'+year+'/'+month, date+random+extName)),
        img     = '/upload/'+year+'/'+month+'/'+date+random+extName;
        
    rs.push(img);

    data.push({baseName: part.filename, imgUrl: img, userId: this.session.user._id})
    part.pipe(stream);
  }
  
  var img =  Image.create(data);
  this.body = rs
}

exports.getImgList = function *(next){
  var page = this.request.query.page - 1,
      pageSize = 9;
  console.log('====================')
  console.log(page*pageSize)
  pageCount = yield Image.find({userId: this.session.user._id}).exec();
  imgList = yield Image.find({userId: this.session.user._id}).skip(page*pageSize).limit(pageSize).sort('meta.updateAt').exec();

  this.body = {
    pageCount: Math.ceil(pageCount.length/pageSize) ,
    imgList: imgList
  }

}