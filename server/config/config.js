//if this app in test or production environemnt it will be set by "NODE_ENV" if in development environemnt it will be not set so i use || 'development'
const env = process.env.NODE_ENV || 'development';
console.log('env ******** ', env)

//in production environemnt all environemnt variables which we use will be set by production server, "PORT, NODE_ENV, MONGODB_URI"
//but in test and development environemnts we must set those environemnt variables manually
if(env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
}else if(env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'  //now when we run our test cases we will not wipe database of development environemnt
}
