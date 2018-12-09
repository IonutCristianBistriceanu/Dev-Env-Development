const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// Todo.remove({}).then((result)=>{
//    console.log(result);
// });

//todo findoneandremove
//todofindbyidandremove

Todo.findByIdAndRemove('5c0cfaacbdfbc1a21082341a').then((todo)=>{
    console.log(todo);
});