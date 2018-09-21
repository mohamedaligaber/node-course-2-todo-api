const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


//var id = '6ba514fd65a429c842abca9c';  //id of document from todos Collection
var id = '6ba514fd65a429c842abca9c12121';  //wrong id format

//check if id is valid
if(!ObjectID.isValid(id)){
  console.log('id is not valid');
}

//there are many ways to find document by id

/*

//way 1
Todo.find({
  _id: id // mongoose will convert id string var to new ObjectId()
}).then( (todos) => {
  console.log('Todos: ', todos);
});  //return array of all todos with the provided id, if id not exist returns empty array [] not error

//way 2  //best way to find document by and Field other than id
Todo.findOne({
  _id: id
}).then( (todo) => {
  console.log('todo: ', todo);
});  //returns only one object of todo with the provided id, if id not exist returns null not error

*/

//way 3    //best way to find document by id
Todo.findById(id).then( (todo) => {
  //if id in correct format but not found todo = null, if id is in non-correct format(like more than 12 byte) then() will throw error, will be catched by catch()
  if(!todo){
    return console.log('No todos found by id: ',id);
  }
  console.log('todo By Id: ', todo);
}).catch( (e) => console.log(e) );  //this catch will be fired if the id value is not valid.

//returns only one object of todo with the provided id, if id not exist returns null not error


//test on users Collection
User.findById('5b9ff99209cf7f200a3b10f8').then( (user) => {
    if(!user){
      return console.log('Unable to find user with this id');
    }

    console.log(JSON.stringify(user, undefined, 2));
}).catch( (e) => {
  console.log(e);
});

//commit your code
//git status
//git add .
//git status
//git commit -m "Add queries playground"
//git push
