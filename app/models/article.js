var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    promise   = mongoose.Promise,
    ObjectId  = Schema.Types.ObjectId;

var ArticleSchema = new Schema({
  title: String,
  author: {
    type: ObjectId,
    ref: 'User'
  },
  summary: String,
  poster: String,
  status: {type: Boolean, default: false},
  pv: {
    type: Number,
    default: 0
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  reply:{
    type: ObjectId
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

ArticleSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

ArticleSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  },
  allList: function(cb){
    return this
      .find({status: true})
      .populate({ path: 'author', select: 'name' })
      .exec(cb);
  }
}

module.exports = mongoose.model('Article', ArticleSchema);