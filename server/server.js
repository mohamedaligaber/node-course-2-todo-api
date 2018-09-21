
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

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



//git commit -am "Add GET /todos/:id"    //replace of -a -m --> -am
//git push

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = {app};
