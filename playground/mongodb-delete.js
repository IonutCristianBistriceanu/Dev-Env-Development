const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/devenv', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('users').deleteMany({text:'eat lunch'}).then((result)=>{
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('users').deleteOne({text:'eat lunch'}).then((result)=>{
    //     console.log(result);
    // });

    //findOneAndDelete
    // db.collection('users').findOneAndDelete({text:'eat lunch'}).then((result)=>{
    //     console.log(result);
    // })
    // db.close();
});