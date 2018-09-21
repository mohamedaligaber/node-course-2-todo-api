const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js'); //i can remove .js extention
const {Todo} = require('./../models/todo.js');  //i can remove .js extention

//before each is testing life cycle method run before any test case

beforeEach( (done) => {  // i takes one argument callbackfunction, the callbackfunction takes done as parameter
  Todo.remove({}).then( () => done() );  //pass empty object to delete function to delete all Documents of Todo collection
});

//group related test cases
describe('POST /todos', () => {
  it('should create a new todo', (done) => {  //done beacuse http request are async code we need to call done() at end of our code.

      var text = 'Test todo text';

      request(app)   //path app as argument(the app we want to make request to it)
      .post('/todos')   //HTTP_METHOD and path of the REST API service
      .send({text})   // {text} equals to {text: text} it's ES6 syntax, supertest will consider content-type = application/json beacuse of {text}
      .expect(200)   //expect status code === 200
      .expect( (res) => {   //custom expect, don't forget custom expects takes function as parameter and the http response is argument to this function
          expect(res.body.text).toBe(text);
      })
      .end( (err, res) => {  //i can pass done to end end(done) or pass callbackfunction and to handle errors
        if(err){
          return done(err);
        }

        //thses test assumes there is not todos in Todos collection, so we will make a work around (before each)
        Todo.find().then( (todos) => {   //return array of todocs
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        })
        .catch( (e) => done(e) );
      });
    });

    it('Should not create todo with invalid body data', (done) => {
        var text = '    ';

        request(app)
        .post('/todos')
        .send({text})
        .expect(400)
        .end( (err, res) => {
          if(err){
            return done(err);  //sending err object to done will print it on terminal
          }

          Todo.find().then( (todos) => {   //return array of todocs
            expect(todos.length).toBe(0);
            done();
          })
          .catch( (e) => done(e) );

        });
    });

});
