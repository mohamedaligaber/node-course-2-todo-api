var mongoose = require('mongoose');

var Todo =  mongoose.model('Todos', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true

  }, completed: {
    type: Boolean,
    default: false
  }, completedAt: {
    type: Number,
    default: null
  },
  _creator: {   //this field will store the id of the user which created this Todo
    type: mongoose.Schema.Types.ObjectId,  //this is the Type of any _id field in mongoDB
    require: true,

  }
});


module.exports = {Todo};
