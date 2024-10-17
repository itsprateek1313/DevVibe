const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
const jwt = require('jsonwebtoken');


//Creating an API to save user inside the database using the model
app.post("/signup", async (req, res) => {
  try {
    //First Validate the incoming data
    validateSignUpData(req);
    //Get the password from req body
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("passwordHash: " + passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    // const user = new User(req.body);
    console.log(user);
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

app.get("/profile", async (req, res) => {
  try {
    //Getting the token --> const cookies = req.cookies; const { token } = cookies;
    const token = req.cookies.token;
  
    // Check if the token is provided
    if (!token) {
      return res.status(401).send("Access Denied: No token provided");
    }

    // Verify the JWT token
    const decodedMessage = jwt.verify(token, "DEV@VIBE#159");
    const { emailId, _id } = decodedMessage; // Extract emailId and _id from token

    // Find user by the _id extracted from the token
    const user = await User.findById(_id);

    // If the user exists, send a success message
    if (user) {
      res.send(`Welcome back, ${emailId}`);
    } else {
      // If user does not exist, send an error
      throw new Error(`User with email ${emailId} does not exist.`);
    }
  } catch (error) {
    // Proper error handling
    res.status(400).send(`Error: ${error.message}`);
  }
});


app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //Create JWT token
      const token = jwt.sign(
        { _id: user._id, emailId: emailId },
        "DEV@VIBE#159"
      );
      //Add this token to the cookies and send this response back to the user
      res.cookie("token", token, { httpOnly: true });
      res.send("Login Successfull");
    } else {
      throw new Error("Password entered is not correct.Please try again!!!");
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
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
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User Deleted successfully");
  } catch (error) {
    res.status(400).send("Cannot delete user");
  }
});

// Updating data of the user
// Any data which is not a part of the original schema will be ignored by mongoose
// its not like it will create a new field in the schema
app.patch("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowedUpdates = ["photoURL", "about", "skills", "age"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Sorry for the inconvenience, Update is not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Sorry, skills cannot be more than 10.");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "After",
      runValidators: true,
    });
    console.log(updatedUser);
    // const updatedUser = await User.findByIdAndUpdate({_id:userId}, data);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
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
