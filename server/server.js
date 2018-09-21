
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

//deploying to heroku :
//1)port setup, port = process.env.PORT , this environment variable on heroku server, contains the PORT value which Heroku runs their apps on it
//2)add start script to package.json file "start": "npm server/server.js", which tells heroku how to deploy our node.js app
//3)in package.json file there is object called "engines" contains some configurations which heroku uses like node version(v8.11.3)
//4)now we need to setup the Mongo DB on heroku server, that will be throw "Heroku addons"
  //4.1) go to heroku.com --> press on any app you deployed before --> click on configure addons --> click on find more addons
  //--> we will find many addons we want one called "mLab MongoDB" (it integrates our local mongo DB server and Heroku Mongo DB server)
  //4.2)run command "heroku create" to create new APP
  //4.3)run command "heroku addons:create mongolab:sandbox"  install addon mongolab and sandbox refers to free plan installation
  //4.4)run command "heroku config" will return the mongodb url to connect to our mongodb on heroku, but best to use this environment variable "process.env.MONGODB_URI" 

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {


  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then( (doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });

})


app.get('/todos', (req, res) => {
    Todo.find().then( (todos) => {
      res.send({ todos: todos });
    }, (e) => {
      res.status(400).send(e);  //return error object to user
    });
});

//here is how i pass variable throw url :id
app.get('/todos/:id', (req, res) => {
    //res.send(req.params);    req.params is object contains the the variables sent in the url like :id
    var id = req.params.id;

    //Validate id using is valid
      //400 -- empty res body
    if(!ObjectID.isValid(id)){
      return res.status(400).send();  //i write return to break execution of the rest of the function   //send() returns empty response
    }

   //findById
    //success
      //if todo send it back
      //if no todo -- 404 with empty body
    //fail
      //400 -- with empty body
    Todo.findById(id).then( (todo) => {
      if(!todo){
        return res.status(404).send(todo);
      }

      res.status(200).send({todo});   //return todo object inside another object gives us the flexability to add another elements i response like custom status code
    }).catch( (e) => {
        res.status(400).send();
    });

});

//git commit -am "Add GET /todos/:id"    //replace of -a -m --> -am
//git push

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = {app};
