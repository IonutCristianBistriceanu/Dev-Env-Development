const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5c0ce2c6e1c1fd143c52503611';

// if(!ObjectID.isValid(id)){
//     console.log('Id not valid');
//     return;
// }
// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log('Todos', todos);
// });


// Todo.findOne({
//     _id:id
// }).then((todo)=>{
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Todo by id', todo);
// }).catch((e)=>{
//     console.log(e);
// })




// User.findById

// query works with no user 

// user was found

// print error object

var id = '5c0bd2bf31adf32c2b48e024';

User.findById(id).then((user)=>{
    if(!user){
        return console.log('User not found');
    }
    console.log('User: ', JSON.stringify(user, undefined,2));
}).catch((e)=>{
    console.log(e);
});
