const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/devenv', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDB server');

    db.collection('users').find({_id:new ObjectID('5c093a1dae723a3018c3deba')}).toArray().then((docs) => {
        console.log('Data');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch data', err);
    });

    db.close();
});