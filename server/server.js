//this lesson for seperate the development database from test cases and the changes(or wipe) they made to development database

//there are 3 environemnts : test, development and production
//test environment when i use "test" script of package.json file
//development environment when i run my app on terminal throw --> node "APP_FULL_PATH.js"
//production environment when i deploy my app on heroku and heroku uses "start" script of package.json file to run my app on production.

//on production environemnt there is environemnt variable called "NODE_ENV" whcih may has value of "test, development or production"
//heroku set this environemnt variable "NODE_ENV" to 'production' by default
//depends on the value of this environemnt variable "NODE_ENV" when can change some configurations like the database connection url and database name

//we will configure this "NODE_ENV" environemnt variable for test environemnt, please see how in "test" script in package
//this configure will set

//very important node: the changing values of those environemnt variable will be on level of my app only, when my app terminated those-
//environemnt variables which i changed their values will be deleted


require('./config/config.js');  //require the file by this way, will import the code inside it here. 

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
const port = process.env.PORT;

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



app.delete('/todos/:id', (req, res) => {
  //get the id
  var id = req.params.id;
  //validate id if not valide return 404 with empty res
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  //delete and return todo by id
  //success
    //found doc:send back 200 -- with todo as res body
    //not-found doc: send back 404 -- with empty res body
  //failed
      //send back 400 -- with empty res body
  Todo.findByIdAndRemove(id).then( (todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.status(200).send({todo});  //this line like res.send({todo}); because the default status_code is 200
  }).catch( (e) => res.status(400).send() );

});


//note: i can post todo which deletes todo or post todo which updates todo, but it's best practice and general guidlines
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);  //i don't want to allow user update _id or completedAt fields because these fields should be updated
  //with us so i filterd the body and get text and completed properties only, now body object should be conatins text and completed elements only if they exist in req.body

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed)  && body.completed){
    body.completedAt = new Date().getTime();  //return times with milli seconds from 1/1/1970 12am
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body  //$set takes an object if key:value paires contains the fieldname:value like body object so we put it as value to $set
  }, {
    new: true            //the third and last argument of update funcion is take same options which controls how our update function works
  })
  .then( (todo) => {
      if(!todo){
          res.status(404).send();
      }

      res.status(200).send({todo});
  }).catch( (e) => res.status(400).send() );

});


//git commit -am "Add GET /todos/:id"    //replace of -a -m --> -am
//git push

//heroku uses only one branch it is the master branch, don't like github which has concept of branching

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = {app};
