// Importing the Mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Defining/Declaring an asynchronous function to establish a connection with MongoDB
const connectDB = async () => {
  // Using await to connect to MongoDB Atlas, passing the connection string.
  // The function pauses at 'await' until the connection is either successful or fails.
  await mongoose.connect(
    "mongodb+srv://itsprateek313:Ium301sKp7coV5ne@cluster0.0e378.mongodb.net/DevVibe"
  );
};
module.exports = connectDB;



