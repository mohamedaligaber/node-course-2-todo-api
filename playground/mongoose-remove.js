const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*
//Todo.reomve
Todo.remove({}).then( (result) => {   //it removes all documents with condtions, {} means remove all docs from Todos Collection
    console.log(result);
});
*/

//Todo.findOneAndRemove({})   //return one docuemnt after removing it from Collection, condition must be inside {}
//Todo.findByIdAndRemove()   //return one docuemnt after removing it from Collection By Id
//these two methods are like each others, but the difierence if the delete condition
Todo.findByIdAndRemove('5ba55b64f19fbdd6cd09cd61').then( (deletedTodo) => {
  console.log(deletedTodo);  // deletedTodo will be null if docuemnt with this id is not exist
});


Todo.findOneAndRemove({ _id: '5ba55b64f19fbdd6cd09cd61'}).then( (deletedTodo) => {
  console.log(deletedTodo);  // deletedTodo will be null if docuemnt with this id is not exist
});
