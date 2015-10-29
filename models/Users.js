var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  levels: [{
    levelName: String,
    numberOfBlocks: Number,
    elapsedTime: Number,
    time: {
      type: Date,
      default: Date.now
    }
  }]
});

var Users = mongoose.model('Users', userSchema);
module.exports = Users;
