const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/devenv', (err, db)=>{
    if(err){
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDB server');

     db.collection('users').insertOne({
        name : 'Sara',
        completed: false
     }, (err, result)=>{
        if(err){
            return console.log('Unable to insert data', err);
        }
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
     })

    db.close();
});