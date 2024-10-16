const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json());
//Creating an API to save user inside the database using the model
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  console.log(user);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving user");
  }
});

//Get User by emailId
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found. Please try again....");
    } else {
      res.send(user);
    }
    console.log(user);
  } catch (error) {
    res.send("Something went wrong");
  }
});

//FEED API --> gets all users and shows it to you
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.send("Something went wrong.");
  }
});

//Delete user
app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({_id:userId});
    res.send("User Deleted successfully");
  } catch (error) {
    res.status(400).send("Cannot delete user");
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
