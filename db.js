require('dotenv').config()
const mongoose = require("mongoose");
const mongodb = module.exports = () => {
    let mongoDB = process.env.MONGO_URI;

    mongoose
        .connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            // useFindAndModify: false,
            // serverApi: ServerApiVersion.v1,
        })
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error(err + "could not connect to mongoDB"));


}



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://akshat:akshat@ask-ietians.zhpy466.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true,  });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log("Connected to MongoDB atlas")
//   // perform actions on the collection object
//   // client.close();
// });