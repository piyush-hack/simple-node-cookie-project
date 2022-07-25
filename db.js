const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://Piyush:piyush2001@cluster0.iltke.mongodb.net/test";
const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo Successfully");
    })
}
module.exports = connectToMongo;