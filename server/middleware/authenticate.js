var {User} = require('./../models/user');

//the authenticate function i will need it to make any route i want private so will make it as middleware function to allow any route to reuse it
var authenticate = (req, res, next) => {   //any midlleware function must take this three arguments //next() is function called at end of my middleware function
  var token = req.header('x-auth');  //return the value of this header

  //this is custom model function which we should implement it.
  User.findByToken(token).then( (user) =>  {    //this method called on model level(User) not instance level(user) because it's general method not like save() method
    if(!user){
      return Promise.reject();   // 401 HTTP header --> authentication required
      //i can write return Promise.reject();   //this line will fire catch block
    }

    req.user = user;
    req.token = token;
    next();
  }).catch( (err) => {
    res.status(401).send();   // 401 HTTP header --> authentication required
  });
}


module.exports = {
  authenticate
}
