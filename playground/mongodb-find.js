const {MongoClient, ObjectID} = require('mongodb'); //by object deStructuring i can easly creating many variables in only one line


//setting up the git repo
//1)git init
//2)git status  --> to check the intracked files
//3)create file .gitignore on the root project folder and add the ignore folders and files
//4)git status --> to check again that the node_modules folder not exist, note: .gitignore file is known by git and will not be committed
//5)git add . --> to add all files to git files to the next commit
//6)git commit -m 'Init commit'  --> commit our code to .git folder
//7)git remote add origin git@github.com:mohamedaligaber/node-course-2-todo-api.git  //link between my local repo and the repo which i have created on GitHub
//8)git push -u origin master  //push our code to the remote repo on Github

var objectid = new ObjectID();
console.log(objectid);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    console.log('Unable to connect to MongoDB server');
    return;  //to break current function execution
  }
  console.log('Connected to MongoDB server');

/*
  db.collection('Todos')
  .find()
  .toArray()
  .then( (docs) => {
      console.log('Todos :');
      console.log(JSON.stringify(docs, undefined, 2));
  } , (err) => {
      console.log('Unable to find Todos');
  });
*/

/*
  //find by query
  db.collection('Todos')
  .find({ completed: false })  //find by query
  .toArray()
  .then( (docs) => {
      console.log('Todos :');
      console.log(JSON.stringify(docs, undefined, 2));
  } , (err) => {
      console.log('Unable to find Todos');
  });
*/

/*
  //find by query, find by _id
  db.collection('Todos')
  .find({ _id: new ObjectID('5b9e8ae5e1dcba29b01cbbe9') })
  .then( (docs) => {
      console.log('Todos :');
      console.log(JSON.stringify(docs, undefined, 2));
  } , (err) => {
      console.log('Unable to find Todos');
  });
*/

  db.collection('Todos')
  .find()
  .count()
  .then( (count) => {
      console.log('Todos count :', count);
  } , (err) => {
      console.log('Unable to fetch Todos');
  });

  db.collection('Users')
  .find({name: 'mohamed'})
  .toArray()
  .then( (users) => {
      console.log(JSON.stringify(users, undefined, 2));
  } , (err) => {
      console.log('Unable to fetch Todos');
  });

  db.close();  //to close the connection with MongoDB
});
