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
// Calling the above declared async function to connect to the database
connectDB()
  // If the connection is successful, this '.then()' block runs.
  // It logs a success message to the console.
  .then(() => {
    console.log("DataBase connection established...");
  })
  // If the connection fails (e.g., wrong credentials, network issue), this '.catch()' block runs.
  // It logs an error message to the console.
  .catch((err) => {
    console.log("Database connection cannot be established...");
  });

  