const express = require("express");
const app = express();
app.listen(3000, () => {
  console.log("Server is successfully up and running on port 3000.......");
});

//Importing 
const {adminAuth,userAuth} = require("./middlewares/auth");

// "/user" API will be called only when userAuth is valid
app.use("/user",userAuth);

// "/admin" API will be called only when adminAuth is valid
app.use("/admin",adminAuth);

app.get("/user",(req,res,next) => {
    res.send("User access");
});
app.get("/admin",(req,res)=>{
    res.send("Admin access");
});
