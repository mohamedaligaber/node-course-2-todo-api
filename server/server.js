
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');


//to test our REST API we need to install Mocha for testing ,expect for assertions, supertest for testing Express
//npm i expect@1.20.2 mocha@3.0.2 nodemon@1.10.2 supertest@2.0.0 --save-dev
//maybe you will not find all these packages installed in CMD but you will find it inside node_modules and package.json because NPM may cached them and import them directly without installation

var app = express();

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

//commit your code


app.listen(3000, () => {
  console.log('Started on port 3000.');
});

module.exports = {app};
