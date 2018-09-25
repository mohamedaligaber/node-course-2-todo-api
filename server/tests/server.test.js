const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js'); //i can remove .js extention
const {Todo} = require('./../models/todo.js');  //i can remove .js extention
const {User} = require('./../models/user.js');  //i can remove .js extention
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

//group related test cases(all test cases for POST /todos)
describe('POST /todos', () => {
  it('should create a new todo', (done) => {

      var text = 'Test todo text';

      request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
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
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect( (res) => {
              expect(res.body.todos.length).toBe(1);  //i changed this toBe(1) because i now select from todos array by user _id
          })
          .end(done);
    });

});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)  //toHexString() function to convert ObjectID to string
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should not return todo doc created by other user', (done) => {
      request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)  //try to fetch second todo which created by user[1] not user[0]
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if todo doc not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
          .get(`/todos/${hexId}`)
          .set('x-auth', users[0].tokens[0].token)
          .expect(404)
          .expect( (res) => {
            expect(res.body).toEqual({});
          })
          .end(done);
    });

    it('should return 400 if id object is non-valid', (done) => {
        request(app)
          .get('/todos/abcdefd')
          .set('x-auth', users[0].tokens[0].token)
          .expect(400)
          .end(done);
    });
});


describe('DELETE /todos/:id', () => {

    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
          .delete(`/todos/${hexId}`)
          .set('x-auth', users[1].tokens[0].token)   //will reomve the todo because _creator equals the _id of users[1]
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

    it('should not remove a todo of other user', (done) => {
        var hexId = todos[0]._id.toHexString();   //the users[1] can not delete todo[0] because he is not the creator of it

        request(app)
          .delete(`/todos/${hexId}`)
          .set('x-auth', users[1].tokens[0].token)
          .expect(404)
          .end( (err, res) => {
            if(err){
              return console.log(err);
            }

            Todo.findById(hexId).then( (todo) => {
                expect(todo).toExist();  //i use todo _id exist but the delete operation should be executed so the todo must be still exist in DB not deleted
                done();
            }).catch( (e) => done(e) );
          });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
          .delete(`/todos/${hexId}`)
          .set('x-auth', users[1].tokens[0].token)
          .expect(404)
          .expect( (res) => {
            expect(res.body).toEqual({});
          })
          .end(done);
    });

    it('should return 404 if ObjectID is invalid', (done) => {
      request(app)
        .delete('/todos/5ba514fd')
        .set('x-auth', users[1].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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


  it('should not update the todo of other user', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'First test todo updated';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
          text,
          completed: true,
          completedAt: new Date().getTime()
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'Second test todo updated';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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
        .set('x-auth', users[1].tokens[0].token)   //in this test case use token of users[0] or users[1] will not effect because the issue is in ObjectId
        .expect(404)
        .end(done);
    });

});


describe('GET /users/me', () => {
  it('should return user is authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)  //set HTTP request header by set function
      .expect(200)
      .expect( (res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 user is not authenticated', (done) => {
      request(app)
        .get('/users/me')
        .expect(401)
        .expect( (res) => {
          expect(res.body).toEqual({});
        })
        .end(done);
  });

});


describe('POST /users', () => {
    it('should create a user', (done) => {
      var email = 'mohamedali@example.com';
      var password = 'ABCmnb';

        request(app)
          .post('/users')
          .send({
            email,
            password
          })
          .expect(200)
          .expect( (res) => {
              expect(res.header['x-auth']).toExist();
              expect(res.body._id).toExist();
              expect(res.body.email).toBe(email);
          })
          .end( (error) => {
            if(error){
              return done(error);
            }

            User.findOne({email}).then( (user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);   //check the password in the DB is hashed
                done();
            }).catch( e => done(e) );
          });
    });

    it('should return validation errors if requst invalid', (done) => {
      var email = 'example.com';   //this email invalid email format
      var password = '123';        //this is invalid password

      request(app)
        .post('/users')
        .send({
          email,
          password
        })
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done) => {
      var email = users[0].email;   //this email is already exist in users array with we insert into TestDB before any "npm test"
      var password = '1234567';

      request(app)
        .post('/users')
        .send({
          email,
          password
        })
        .expect(400)
        .end(done);
    });
});


describe('POST /users/login', () => {
    it('should login and return auth token', (done) => {
        request(app)
          .post('/users/login')
          .send({
              email: users[1].email,
              password: users[1].password
          })
          .expect(200)
          .expect( (res) => {
              expect(res.headers['x-auth']).toExist();
          })
          .end( (error, res) => {
              if(error){
                return done(error);
              }

              return User.findById(users[1]._id).then( (user) =>  {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
              }).catch( e => done(e) );  //if i don't add this catch block and the then() function fails due to any assertion conflict the test case will time out and no error will be appear
          });
    });

    it('should reject invalid login', (done) => {
      request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password + 1
        })
        .expect(400)
        .expect( (res) => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end( (error, res) => {
            if(error){
              return done(error);
            }

            return User.findById(users[1]._id).then( (user) =>  {
                  expect(user.tokens.length).toBe(1);
                  done();
            }).catch( e => done(e) );  //if i don't add this catch block and the then() function fails due to any assertion conflict the test case will time out and no error will be appear
        });
    });
});


//Add DELETE /users/me/token test cases
describe('DELETE /users/me/token', () => {

    it('Should remove auth token on logout', (done) => {
        request(app)
          .delete('/users/me/token')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .end( (err, res) => {
            if(err){
              return done(err);
            }

            User.findById(users[0]._id).then( (user) => {
              expect(user.tokens.length).toBe(0);
              done();
            }).catch( (e) => done(e) );
          });
    });
});

//git diff command shows us the the new changes in every file since the last commit
