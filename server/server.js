const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const {ObjectID} = require('mongodb');


require('./config/config.js');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate');



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
      res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
      return res.status(400).send();
    }

    Todo.findById(id).then( (todo) => {
      if(!todo){
        return res.status(404).send(todo);
      }

      res.status(200).send({todo});
    }).catch( (e) => {
        res.status(400).send();
    });

});



app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }


  Todo.findByIdAndRemove(id).then( (todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.status(200).send({todo});
  }).catch( (e) => res.status(400).send() );

});


app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed)  && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  })
  .then( (todo) => {
      if(!todo){
          res.status(404).send();
      }

      res.status(200).send({todo});
  }).catch( (e) => res.status(400).send() );

});

//------------------------------ User Routes ------------------------------------------------------

//POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    var user = new User({
      email: body.email,
      password: body.password
    });



    user.save().then( (user) => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).status(200).send(user);
    })
    .catch( (err) => {
        res.status(400).send(err);
    });
});


//new /users/me route after add authenticate middleware function(./middleware/authenticate.js)
app.get('/users/me', authenticate, (req, res) => {   //pass authenticate function as second arguement means it will be executed before thrid arguement callback function
    res.status(200).send(req.user);
});

//Setup a login route to allows the users to authenticate and send back to them their tokens
//we will create a model level function in user.js model to findByCredentials by email and password
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then( (user) => {
        //res.status(200).send(user);  //here i am not checked is null or not because i checked that inside findByCredentials(), if user is not exist i call
        //reject() funtion which will fire the catch block here , and if the user exist i will call resolved() inside the Promise which i created in findByCredentials()
        //which will fire the then() block here.

        //we must return a new token to the user and save it in the users Collection, note : the a token new value generated every login from the user
        //the token is not reusable it's renewable
         return user.generateAuthToken().then( (token) => {
            res.header('x-auth', token).send(user);   //if error occured here it will be catched by the last catch block
         });

    }).catch( (e) => {
        res.status(400).send();
    });

});

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = {app};
