
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

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


app.get('/todos', (req, res) => {
    Todo.find().then( (todos) => {
      res.send({ todos: todos });  //it's best practise to send the json array to the user inside object which allows us to add another elements if we need it in the future
        // i can write res.send({ todos }); , ES6 syntax :)
    }, (e) => {
      res.status(400).send(e);  //return error object to user
    });
});

//commit our new changes to server.js file
//git status
//git commit -a -m ""   //-a command adds all new modified files to the next commit -- modified files not new files 


app.listen(3000, () => {
  console.log('Started on port 3000.');
});

module.exports = {app};
