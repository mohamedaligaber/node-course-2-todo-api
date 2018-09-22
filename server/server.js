//JWT : is Json Web Tokens, the problem here is any body can hit and access my /todos and /users routes and wipe my database, i want make this action authorized
//no one can access my API, unless he is has valid token to do this, see how to do this inside playground/hashing.js file

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


//POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    var user = new User({
      email: body.email,
      password: body.password
    });   //can make this line simple by write :   var user = new User(body);

    //there are 2 types of methods : 1)User.method() called model method (method related to class)  2)user.method() called intance method (method related to obejct)
    //we neend to define custom model method, to allows all objects of User Model(class) to access and use this method(reusealilty)
    //this method will generate user token value of user object, to generate token and save it to the call user object

    user.save().then( (user) => {
      //  res.status(200).send({user});
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).status(200).send(user);   //i can add custom http response headers
    })
    .catch( (err) => {
        res.status(400).send(err);
    });
});

//git commit -am "Add GET /todos/:id"    //replace of -a -m --> -am
//git push

//heroku uses only one branch it is the master branch, don't like github which has concept of branching

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = {app};
