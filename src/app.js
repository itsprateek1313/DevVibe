const express = require("express");
const app = express();
app.listen(3000, () => {
  console.log("Server is successfully up and running on port 3000.......");
});

//Importing 
const {adminAuth,userAuth} = require("./middlewares/auth");

// "/user" API will be called only when userAuth is valid
app.get("/user",userAuth,(req,res,next) => {
    res.send("User access");
});

//Login API can be accessed by anyone
app.get("/user/login",(req,res,next) => {
    res.send("Logged in successfully");
});

// "/admin" API will be called only when adminAuth is valid
app.get("/admin",adminAuth,(req,res)=>{
    res.send("Admin access");
});



