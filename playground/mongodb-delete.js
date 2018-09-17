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
  //deleteMany
  db.collection('Todos').deleteMany({text : 'Eat Lunch'}).then((result) => {  //deleteMany has condition to delete all documents with text = 'Eat Lunch'
      console.log(result);   //result object contians big data, we care about object called "result{ ok: 1, n: NUMBER_OF_DELETED_DOCUMENTS }"
  }, (err) => {
      console.log(err);
  });
*/

/*
  //deleteOne
  db.collection('Todos').deleteOne({text : 'Eat Lunch'}).then((result) => {  //deleteOne has condition to delete only one documents with text = 'Eat Lunch'
      console.log(result);   //result object contians big data, we care about object called "result{ ok: 1, n: NUMBER_OF_DELETED_DOCUMENTS }"
  }, (err) => {
      console.log(err);
  });
*/

/*
  //findOneAndDelete
  db.collection('Todos').findOneAndDelete({text : 'Eat Lunch'}).then((result) => {  //delete one Document and returns its data(Fields)
      console.log(result);     // the structure of result object is different of other methods : { lastErrorObject: { n:1 } , value:{ _id: 5b9fcb5be33ad91cecb7482c,text: 'Eat Lunch',completed: false },ok: 1 }
  }, (err) => {               //the lastErrorObject may contain other data
      console.log(err);
  });
*/

  //delete all Users without check on success or failure
  //db.collection('Users').deleteMany({name: 'mohamed'});


  //delete one user and access it's data
  db.collection('Users').findOneAndDelete( {
    _id : new ObjectID('5b9ea9f72392d403c21147a8')     //dont't forget _id stored in the DB as ObjectID not string
  }).then( (result) => {
      console.log(JSON.stringify(result, undefined, 2));
  }, (err) => {
      console.log(err);
  });


  //push our new changes to our GitHub repository :
  //git status
  //git add .
  //git commit -m "Add delete script"
  //git push              //default value is origin and default branch is master // i can change origin with heroku for example to push our code to heroku repo and deploy it

  db.close();  //to close the connection with MongoDB
});
