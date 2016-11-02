var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    ObjectId  = Schema.Types.ObjectId;

var ImageSchema = new mongoose.Schema({
  baseName: String,
  imgUrl: String,
  userId: ObjectId,
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

ImageSchema.pre('save', function (next) {
  var user = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});
  

ImageSchema.statics = {
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
  }
}

module.exports = mongoose.model('Image', ImageSchema);