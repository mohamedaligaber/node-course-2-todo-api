const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js'); //i can remove .js extention
const {Todo} = require('./../models/todo.js');  //i can remove .js extention


var todos = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "Second test todo"
}];

beforeEach( (done) => {
  Todo.remove({}).then( () => {
      return Todo.insertMany(todos);
  }).then( () => done() );
});

//group related test cases(all test cases for POST /todos)
describe('POST /todos', () => {
  it('should create a new todo', (done) => {

      var text = 'Test todo text';

      request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect( (res) => {
          expect(res.body.text).toBe(text);
      })
      .end( (err, res) => {
        if(err){
          return done(err);
        }

        Todo.find({text}).then( (todos) => {
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
            return done(err);
          }

          Todo.find().then( (todos) => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch( (e) => done(e) );

        });
    });

});


describe('GET /todos', () => {

    //should return the 2 todos which we added in the beforeEach() function
    it('should get all todos', (done) => {
        request(app)
          .get('/todos')
          .expect(200)
          .expect( (res) => {
              expect(res.body.todos.length).toBe(2);
          })
          .end(done);
    });

});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)  //toHexString() function to convert ObjectID to string
        .expect(200)
        .expect( (res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo doc not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
          .get(`/todos/${hexId}`)
          .expect(404)
          .expect( (res) => {
            expect(res.body).toEqual({});
          })
          .end(done);
    });

    it('should return 400 if id object is non-valid', (done) => {
        request(app)
          .get('/todos/5ba514fd65a429c842abca9c22334455')
          .expect(400)
          .end(done);
    });
});


//git commit -am "Add test cases for GET /todos/:id"
//git push
