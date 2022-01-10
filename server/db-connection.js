const mongoose = require('mongoose');
const CONNECTION_STRING = process.env.MONGO_URI ;

module.exports = () => {
    mongoose.connect(CONNECTION_STRING, {
        useCreateIndex: true,
        useNewUrlParser: true,
        poolSize: 5,
        useUnifiedTopology: true
    })
        .then(db => console.log('Connected with MongoDB.'))
        .catch(err => console.log(`Unable to connect with MongoDB: ${err.message}`));
}