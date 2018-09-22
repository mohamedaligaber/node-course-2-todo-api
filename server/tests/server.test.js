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
    text: "Second test todo",
    completed: true,
    completedAt: 333
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


describe('DELETE /todos/:id', () => {

    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
          .delete(`/todos/${hexId}`)
          .expect(200)
          .expect((res) => {
              expect(res.body.todo._id).toBe(hexId);
          })
          .end( (err, res) => {
            if(err){
              return console.log(err);
            }

            Todo.findById(hexId).then( (todo) => {
                expect(todo).toNotExist();
                done();
            }).catch( (e) => done(e) );
          });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
          .delete(`/todos/${hexId}`)
          .expect(404)
          .expect( (res) => {
            expect(res.body).toEqual({});
          })
          .end(done);
    });

    it('should return 404 if ObjectID is invalid', (done) => {
      request(app)
        .delete('/todos/5ba514fd')
        .expect(404)
        .end(done);
    });


});


describe('PATCH /todos/:id', () => {

  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'First test todo updated';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
          text,
          completed: true,
          completedAt: new Date().getTime()
      })
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'Second test todo updated';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
          text,
          completed: false
      })
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });


    it('should return 404 if ObjectID is invalid', (done) => {
      request(app)
        .patch('/todos/5ba514fd')
        .expect(404)
        .end(done);
    });

});
