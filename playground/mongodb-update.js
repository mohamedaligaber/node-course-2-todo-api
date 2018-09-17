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
  //findOneAndUpdate(filterObject, updateObject, optionaloptions , optionalcallbackfuction)
  //very important note: the functions of collection return promise only if i didn't callbackfuction as argument to it.
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5b9fcb5fe33ad91cecb7482e')
  }, {
    //update object is depends on something called operators "search about mongodb update operators"
    $set: {    // $set operators contains the Fileds which we want to update and their new values
        completed: true
    }
  }, {
      //this object conatins some elements we can see it and what it do in the documentation
      returnOriginal: false  //means return the updated document not the old document
    })
    .then( (result) => {
    console.log(JSON.stringify(result, undefined, 2));
  } );   //not mandatory to handle rejected case on the promise
*/


  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b9fdb1ae33ad91cecb74972')
  }, {
    $set: {
        name: 'ali'
    },
    $inc: {  //$inc is operator in to increment any value by specify the value we want to increment it by.
      age: 1
      //age: -1  //to decrement age value by 1
    }
  }, {
      returnOriginal: false
    })
    .then( (result) => {
    console.log(JSON.stringify(result, undefined, 2));
  } );


  //push our new changes to our GitHub repository :
  //git status
  //git add .
  //git status    //to check the file which have changes are added to commit
  //git commit -m "Add update script"
  //git push              //default value is origin and default branch is master // i can change origin with heroku for example to push our code to heroku repo and deploy it

  db.close();  //to close the connection with MongoDB
});
