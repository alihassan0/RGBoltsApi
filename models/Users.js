var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  _id: String, // Overriding the id with our locally generated id
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
