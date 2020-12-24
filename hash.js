const bcrypt = require('bcrypt');
const password = 'password123';
const jwt = require('jsonwebtoken');

const id = '1000';
const secret = 'supersecret';
const receivedToken = 'eyJhbGciOiJIUzI1NiJ9.MTAwMA.L9PmEqLlZjettygguzj25agunJu6NkvVtG9RFRBnK2Y';


//const token = jwt.sign(id, secret); //this creates the receivedToken
const decodeToken = jwt.verify(receivedToken, secret); //this returns the id
//console.log(token);
console.log(decodeToken);

// bcrypt.genSalt(10, (err, salt) => {
//     if(err){
//         return next(err);
//     }
//     console.log(salt);
//     console.log(password);
//     bcrypt.hash(password, salt, (err, hash) => {
//         if(err){
//             return next(err);
//         }

//         console.log(hash)
//     })
// });