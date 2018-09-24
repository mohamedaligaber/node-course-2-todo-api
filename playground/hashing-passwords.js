//it's not the best thing to use the password which the user send it to me and store it in the DB, it's the best to encrpt it with specifc secret key and store it into the DB
//we will use a npm library callde "bcryptjs" to encrpt our passwords with secret key and store them into our DB "npm i bcryptjs --save"

const bcrypt = require('bcryptjs');

var password = 'abc123!';

//generate salt value, this is the value which i will add to the user password to hash them
//the hacker may guess the password and try to hash it, but he will need to guess the salt value to generate the right hash
//also the salt is not fixed statement it's variable every time genSalt() functions generate new salt of 10 digits
bcrypt.genSalt(10, (err, salt) => {  //first argument is the number of salt digits which i want to be generated
  bcrypt.hash(password, salt, (err, hash) => {   //genSalt() function is Async so it will go to life cycle of async code , and the compare function will be executed first don't forget :)
    console.log(salt);
    console.log(hash);
  });
});


var hashedPassword = '$2a$10$9vGd8TsDN0F7BRuRSFQl8.CEgUY5xmFCaPlmb66f0K1zyt9OF1uc6';

var hashedPassword1 = '$2a$10$oXpmS99P31Dns6L83/FjB.t4dJXz6BcCbjQNRBki2ruVFctrUqJq2';

//this fucntion compares the original password to the hashed value to check if this password will generate this hashed value
bcrypt.compare(password, hashedPassword1, (err, result) => {  //compare password to hashedPassword or hashedPassword1 will return true
  console.log(result);
});


//now we will use a middleware function of mongoose framework, go to user.js and see function called "UserSchema.pre" to check if any new user will-
//be saved to database or updated to generate or update it's hashed password
