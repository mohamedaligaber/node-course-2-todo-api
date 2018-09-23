const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
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




/*

//we want to make private routes so now one can access these routes unless he has a valid token
//we must grab the token from request header('x-auth') and vlaidate it first , if valid will allow user to access the functionality of this route
//lets make a new private routes
//i will test this private route by send header called "x-auth" in request throw postman, the value of this header will be the value of tokens.token where access='auth'
//if i didn't send this header or send it with wrong value the resposne will be 401(Unauthorized) with empty body
app.get('/users/me', (req, res) => {
    var token = req.header('x-auth');  //return the value of this header

    //this is custom model function which we should implement it.
    User.findByToken(token).then( (user) =>  {    //this method called on model level(User) not instance level(user) because it's general method not like save() method
      if(!user){
        res.status(401).send();   // 401 HTTP header --> authentication required
        //i can write return Promise.reject();   //this line will fire catch block
      }

      res.status(200).send(user);
    }).catch( (err) => {
      res.status(401).send();   // 401 HTTP header --> authentication required
    });
});

*/


//new /users/me route after add authenticate middleware function(./middleware/authenticate.js)
app.get('/users/me', authenticate, (req, res) => {   //pass authenticate function as second arguement means it will be executed before thrid arguement callback function
    res.status(200).send(req.user);
});

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = {app};
