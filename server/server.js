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

//to associate the user to Todo we first create a new field inside todos called _creator will hold the user_id who create the Todo
//to make this route a private route i will add authenticate middleware to it
//we must update the test cases in server.test.js for this route and send 'x-auth' header to avoid failure
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then( (doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });

})

//here we will update get Todos route to fetch only todos array of the requested user
//and we will make this route a private route
//we must update the test cases in server.test.js for this route and send 'x-auth' header to avoid failure
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
      _creator: req.user._id
    }).then( (todos) => {
      res.send({ todos: todos });
    }, (e) => {
      res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate,(req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
      return res.status(400).send();
    }

    Todo.findOne({
      _id: id,
      _creator: req.user._id
    }).then( (todo) => {   //we will change findById to findOne to select by todo _id and user _id
      if(!todo){
        return res.status(404).send(todo);
      }

      res.status(200).send({todo});
    }).catch( (e) => {
        res.status(400).send();
    });

});



app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }


  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then( (todo) => {   //will replcae findByIdAndRemove to findOneAndRemove to remove todo with it's _id and user _id
    if(!todo){
      return res.status(404).send();
    }

    res.status(200).send({todo});
  }).catch( (e) => res.status(400).send() );

});


app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
    }, {   //will replcae findByIdAndUpdate by findOneAndUpdate to update by todo _id and user _id
    $set: body
  }, {
    new: true
  })
  .then( (todo) => {
      if(!todo){
          return res.status(404).send();
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


app.get('/users/me', authenticate, (req, res) => {
    res.status(200).send(req.user);
});


app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then( (user) => {
         return user.generateAuthToken().then( (token) => {
            res.header('x-auth', token).send(user);
         });

    }).catch( (e) => {
        res.status(400).send();
    });

});

//here is a new route to delete the token of the request user to log him out, first i will call authenticate middleware function to check the user is authenticated
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.deleteToken(req.token).then( () => {    //deleteToken will be instnace method
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = {app};
