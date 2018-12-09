const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/devenv', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDB server');

    db.collection('users').findOneAndUpdate({
        _id: new ObjectID('5c095991bdfbc1a21082148f')
    }, {
        $set: {
            name: 'Cristian'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    // db.close();
});