const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
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
});

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, 'secretvalue').toString();

  user.tokens = user.tokens.concat([{
    access,
    token
  }]);

  return user.save().then( () => {
    return token;
  });


};


//this is a mongoose middleware function runs before any save action on user model
UserSchema.pre('save', function(next){
    var user = this;

    //check if the user password is modified we will generate a new hash value to the updated password field
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              user.password = hash;
              next();
            });
        });
        //next();  if i put the next function here password will not be hashed, almost it's related to function scopes   
    }else{
      next();
    }
});

//statics "object" is like "methods" object but statics define functions on model level not instance level
//so i can call this function throw User model not user object
UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try{
    //verify function return decodes the token and return the original value, i put this function inside try catch block-
    //because if the token is wrong it will throw error
    decoded = jwt.verify(token, 'secretvalue');  //now decoded conatins the original vlaue which we have encoded
  }catch(e){
    return new Promise( (resolve, reject) => {
      reject();
    });  //this return will fire reject function if implemented or catch block

    //return Promise.reject(); works as the up above return statement
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access':  decoded.access  //'auth'   //because it's stored in Collection as array i must search about token with this syntax
  });   //this will return a promise

};


var User = mongoose.model('User', UserSchema);

module.exports = {User};
