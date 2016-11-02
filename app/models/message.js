var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    ObjectId  = Schema.Types.ObjectId;

var MessageSchema = new mongoose.Schema({
  name: String,
  age: Number,
  avatar: String,
  articles:{type: ObjectId, ref: 'Article'},
  status: {type: Boolean, default: false},
  email: String,
  siteUrl: String,
  message: String,
  reply:[{type: ObjectId, ref: 'Message'}],
  isChild: Boolean,
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

MessageSchema.pre('save', function (next) {
  var user = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});
  

MessageSchema.statics = {
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

module.exports = mongoose.model('Message', MessageSchema);