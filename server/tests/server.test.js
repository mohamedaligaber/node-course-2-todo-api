const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js'); //i can remove .js extention
const {Todo} = require('./../models/todo.js');  //i can remove .js extention


var todos = [{
    text: "First test todo"
}, {
    text: "Second test todo"
}];
//here we will delete all todos and add only 2, to allow us to test the returned todos and so on
beforeEach( (done) => {
  Todo.remove({}).then( () => {
      return Todo.insertMany(todos);  //i write return here to allows us to chain the second then()
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
