const jwt = require('jsonwebtoken');

const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'ali@example.com',
  password: 'userOnePass',
  tokens:[{  //filling this array will require us to see the implemntation of generateAuthToken() function in models/user.js
    access: 'auth',
    token: jwt.sign( { _id: userOneId, access : 'auth'} , process.env.JWT_SECRET).toString()
  }]
},{
  _id: userTwoId,
  email: 'mohamed@example.com',
  password: 'abc123!',
  tokens:[{
    access: 'auth',
    token: jwt.sign( { _id: userTwoId, access : 'auth'} , process.env.JWT_SECRET).toString()
  }]
}];

const todos = [{
    _id: new ObjectID(),
    text: "First test todo",
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];


const populateTodos = (done) => {
 Todo.remove({}).then( () => {
     return Todo.insertMany(todos);
 }).then( () => done() );
}

const populateUsers = (done) => {
 User.remove({}).then( () => {
     //will populate users DB with another way than Todos
     var userOne = new User(users[0]).save();   //userOne this Promise don't forget
     var userTwo = new User(users[1]).save();  //usersTwo is promise don't forget

     //i can call the then function on the userOne promise and userTwo promise like this: Promise.all([userOne, userTwo]).then();
     return Promise.all([userOne, userTwo]);

 }).then( () => done() );  // i return the Promise.all and called the then() function on the 2 promises here
}


module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};
