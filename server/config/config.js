const env = process.env.NODE_ENV || 'development';
console.log('env ******** ', env)

//to configure our app on heroku we have that done throw heroku CLI locally on our machine or throw my account on herkou  website.
//it is not best to put my configure for test and development environment in a config file inside the app, and not good to push this file to GitHub repo.

if(env === 'development' || env === 'test'){
  var config = require('./config.json');  //once i require a json file(which contains Json object or array) it will parsed and set to the variable config
  var envConfig = config[env];  //here is the syntax to access specific element of config object( test, development ), now test or development object is set to envConfig

  //Object.keys(envConfig)  is function takes a object and return all keys, result ==> ['PORT', 'MONGODB_URI']
  Object.keys(envConfig).forEach( (key) => {  //you know forEach called on array and loop on every element of this array
      process.env[key] = envConfig[key];
  });
}

//now we has a config file which hide all data like DB url, now we must ignore config.json from GitHub repo by putting it in .gitignore file

//the next setp is to hide the jwt(which is used to sign token and verify it) secret inside the config.json file to avoid pushing it to the GitHub repository
//and go ahead to any sign or verify function and set the secret argument to process.env.JWT_SECRET (models/user.js file and tests/seed/seed.js file)
//note: JWT secret should be big and random value(write any charcters on the keyboards)

//by this we properly configured the App on test and development environemnts.

//by command "heroku config" is CLI command which shows up the environemnt variables which we configured on the heroku server, there are some of them note-
//visable to us because those managed by the heroku itslef, and others are visable like MONGODB_URI because that we are configuring it.

//we can set config environemnt variables on heroku server throw this command : "heroku config:set EN_VAR_NAME=EN_VAR_VALUE" and access this environemnt
//variables throw process.env.EN_VAR_NAME in our node.js app, now hit "heroku config" you will see your new var is setup.

//to fetch environemnt variable value on herkou : "heroku config:get EN_VAR_NAME"
//to remove an environemnt variable value on herkou : "heroku config:unset EN_VAR_NAME"

//now on PRODUCTION environemnt we must set "JWT_SECRET" environemnt variable to make our app works properly on PRODUCTION environemnt
// 1) heroku config:set JWT_SECRET=afdhsalhfdafaslfdsa38ur9843r
// 2) heroku config:get JWT_SECRET   //to make sure the variable is set properly


/*
if(env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp'
}else if(env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest'  //now when we run our test cases we will not wipe database of development environemnt
}
*/
