var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

mongoose.Promise = global.Promise;

module.exports = {
  mongoose
}
