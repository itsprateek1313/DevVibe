const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

//Creating an API to save user inside the database using the model
authRouter.post("/signup", async (req, res) => {
  try {
    //First Validate the incoming data
    validateSignUpData(req);
    //Get the password from req body
    const { firstName, lastName, emailId, password, about, skills, gender } =
      req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("passwordHash: " + passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      about,
      skills,
      gender,
    });
    // const user = new User(req.body);
    console.log(user);
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Create JWT token
      const token = await user.getJWT();
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

authRouter.post("/logout", async (req, res) => {
  // Set the token cookie to expire immediately
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
  });
  res.send("Logout successful!");
});

// authRouter.post("/logout", (req, res) => {
//   // Clear the JWT token stored in cookies
//   res.clearCookie("token", { httpOnly: true, secure: true });
//   res.send("Logout successful!");
// });

module.exports = authRouter;
