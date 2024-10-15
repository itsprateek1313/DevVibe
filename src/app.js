const express = require("express");
const connectDB = require("./config/database");
const app = express();

//Importing the User model
const User = require("./models/user");
//Creating an API to save user inside the database using the model
app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Ankur",
    lastName: "Srivastava",
    emailId: "ankur@gmail.com",
    password: "ankur123",
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving user");
  }
});

connectDB()
  // If the connection is successful, this '.then()' block runs.
  // It listens on the server only when the connection is established
  .then(() => {
    console.log("DataBase connection established...");
    // Starting the server on port 3000.
    app.listen(3000, () => {
      console.log("Server is successfully up and running on port 3000.......");
    });
  })
  // If the connection fails (e.g., wrong credentials, network issue), this '.catch()' block runs.
  // It logs an error message to the console.
  .catch((err) => {
    console.log("Database connection cannot be established...");
  });
