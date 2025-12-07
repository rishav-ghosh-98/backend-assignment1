const mongoose = require("mongoose");
require("dotenv").config()
const mongoUri = process.env.MONGODB;
const initializeDatabase = async() => {
    await mongoose
      .connect(mongoUri)
      .then(() => {
        console.log("Connected to DataBase");
      })
      .catch((error) => console.log("Error Connecting to DataBase", error));

}
module.exports = { initializeDatabase }