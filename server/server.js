//we need to install express to setup out REST API and body-parser to parse the body of the requests which sent to the server
//npm i express@4.14.0 body-parser@1.15.2 --save
//it's recommended to impoort libraries first and then local imports and keep spaces between them
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

//please take care of the new structure of the application

var app = express();

app.use(bodyParser.json());  //this piece of middleware allows object request to has element called "body" contains the json body of the request

app.post('/todos', (req, res) => {
  //console.log(req.body);  //this body property added becuase of app.use(bodyParser.json()); this line

  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then( (doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);  //to see all HTTP status codes : www.httpstatuses.com  //try this filed by pass "text": "" empty in the request
  });

})

//commit your code


app.listen(3000, () => {
  console.log('Started on port 3000.');
});
