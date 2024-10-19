const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
const { userAuth } = require("./middlewares/auth");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
// //Get User by emailId
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.find({ emailId: userEmail });
//     if (user.length === 0) {
//       res.status(404).send("User not found. Please try again....");
//     } else {
//       res.send(user);
//     }
//     console.log(user);
//   } catch (error) {
//     res.send("Something went wrong");
//   }
// });

// //FEED API --> gets all users and shows it to you
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (error) {
//     res.send("Something went wrong.");
//   }
// });

//Delete user
// app.delete("/deleteUser", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     const user = await User.findByIdAndDelete({ _id: userId });
//     res.send("User Deleted successfully");
//   } catch (error) {
//     res.status(400).send("Cannot delete user");
//   }
// });

// Updating data of the user
// Any data which is not a part of the original schema will be ignored by mongoose
// its not like it will create a new field in the schema
// app.patch("/update/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   try {
//     const allowedUpdates = ["photoURL", "about", "skills", "age"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       allowedUpdates.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Sorry for the inconvenience, Update is not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("Sorry, skills cannot be more than 10.");
//     }
//     const updatedUser = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "After",
//       runValidators: true,
//     });
//     console.log(updatedUser);
//     // const updatedUser = await User.findByIdAndUpdate({_id:userId}, data);
//     if (!updatedUser) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User updated successfully");
//   } catch (error) {
//     res.status(400).send(`Error: ${error.message}`);
//   }
// });

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
