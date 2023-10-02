const mongoose = require("mongoose");

const connection = () => {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.Mongo_URI, () => {
            console.log("Successfuly Connected to database...");
        })
    } catch (error) {
        console.log("Error: Connecting to database...");
    }
}

module.exports = connection;