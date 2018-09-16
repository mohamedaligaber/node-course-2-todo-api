
//Object deStructuring
var user = { name: 'mohamed', age: 24};
var {name} = user;    //this ES6 syntax equals to : var name = user.name;
console.log(name);

const {MongoClient, ObjectID} = require('mongodb'); //by object deStructuring i can easly creating many variables in only one line

var objectid = new ObjectID();
console.log(objectid);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    console.log('Unable to connect to MongoDB server');
    return;  //to break current function execution
  }
  console.log('Connected to MongoDB server');

/*
  db.collection('Todos').insertOne({
    completed: false
  }, (err, result) => {
    if(err){
      return console.log('Unable to insert todo', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });
*/

/*
  db.collection('Users').insertOne({
    name: 'mohamed',
    age: 24,
    location: 'Alexandria'
  }, (err, result) => {
    if(err){
      return console.log('Unable to insert user', err);
    }

    //to get timestamp when Document created  result.ops[0]._id.getTimestamp();
    console.log(JSON.stringify(result.ops, undefined, 2));
  });
*/



  db.close();  //to close the connection with MongoDB
});
