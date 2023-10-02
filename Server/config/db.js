const mongoose = require("mongoose");

const connection = () => {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.Mongo_URI, () => {
            console.log("Successful Connected to database...");
        })
    } catch (error) {
        console.log("Error Occuredd");
    }
}

module.exports = connection;