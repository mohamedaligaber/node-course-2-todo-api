/*

//to install the package which allows me to play with hashing "npm i crypto-js --save"
const {SHA256} = require('crypto-js');  //256 refers to the number of bits of the resulting hash //SHA256 is funcion

var message = 'I am user number 3';
var hash = SHA256(message).toString();   //use toString() because the return is an object

console.log(`Message : ${message}`);
console.log(`Hash : ${hash}`);   //will print the hashed result of message value

//hashing is one way algorithm, which means i can not get the original value from the hashing value.
//the hash value of message will be the same every time i run this script unless i change the message value
//the passwords of users must be stored in DB as hash value not plain text value

//Concept of JWT : json web token
//it's not right to send the user his id in my system because he may try to increase or decrement it and control data of anotehr user
var data = {
  id: 4
};

var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

//the flow of our App will be:
//1)i get data of user --> var data = {id :4}.
//2)i genrate data with token and send it to user --> var token = { data, hash : valueOfHashing }
//3)the user may change value of id and guess that i hashing the data object and try to guess the hashing algorithm(SHA256) and change the value of hashing too and send it back to me(salting).
//4)to prevent this salting i add some somesecret string to my hasing value to prevent user from this salting


//User salting
//token.data.id = 5;
//token.data.hash = SHA256(JSON.stringify(token.data)).toString();


var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(resultHash === token.hash){
  console.log('Data was not changed');
}else{
  console.log('Data was changed. Do not trust!');
}

*/

//replacement of this all code we can use and use of "crypto-js" libarary we can use another libarary(jsonwebtoken) which creates those JWTs easily
//"npm i jsonwebtoken --save"
const jwt = require('jsonwebtoken');

var data = {
  id: 5
};
var token = jwt.sign(data, 'mySecretString');   //function takes 2 arguments (objectToEncrypt, 'YourSecretStringToPreventSalting') and return token
console.log(token);   //you can go to www.jwt.io and copy your hash there and write your secrect to decode this hash.

var decoded = jwt.verify(token, 'mySecretString');  //funcion
console.log('decoded: ', decoded);


//now i can send the token to the user not his id, to prevent any try from oone user to change the data of another user
