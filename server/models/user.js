const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

/*
{
  email: 'mohamed@example.com',
  password: 'adafkjadfjdajkfhaj',  //passwords must be stored in DB as hashed value
  //tokens are array of objects which contains "access" element which contains a value of what i can do like "auth" authentacation and
  //"token" element contains the value which will allows me to verify you has access to value of "access" element
  tokens: [{
      access: "auth",
      token: "asnfdlkjafddafkjakjdf" // hashed password for example
  }]
}
*/

//Scehma allows us to create something like class wher i can define attributes and functions, not attributes only
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,  //check is email not exist in DB  //to allows these changes to occur on the DB we must drop the database and restart the our App
    //to add email custom validation to check email is in appropiate format, we can search about mongoose custom validation
    //you can validate email by setup "validator" NPM package which allows us to valiate emails "npm i validator --save"
    validate: {
      validator: (value) => {
        return validator.isEmail(value);  //return true if valid and false if not vaild
      },
      //another simple way "validator: validator.isEmail" it will takes value of email and apply this function on it
      message: '{VALUE} is not a valid email'  //this message will be thrown as error if this custom validation failed
    }
  },
  password:{
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
},{
  usePushEach: true   //mandtory option in the newer versions of mongo db
});

//this function will return only the fields should return to user, not all fields which exist in user Document
UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();  //toObject() is mongoose function return object with only the fields exist in user Collection

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){   //methods is an object conatins the instance methods of our UserSchema, now any User object can access this function.
  //i assign var user to the user object whihc calls this instance method (like constructor in Java)
  var user = this;    //i not use arrow function because arrow function don't use this keyword don't forget
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, 'secretvalue').toString();

  user.tokens = user.tokens.concat([{
    access,
    token
  }]);
  //user.tokens.push(); this line makes confilcts with mongodb so i used the up above line

  return user.save().then( () => {  //return token to the main genrateAuthToken function
    return token;
  });

  //if the user object model has _id element and it's _id value exists in the DB, and i tried to save it again , it will work like update not save

};


var User = mongoose.model('User', UserSchema);

module.exports = {User};
