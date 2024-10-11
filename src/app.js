// Import the Express module
const express = require('express');

// Create an Express application
const app = express();

// This is the request handler, it will handle requests based on the URL
// Here, localhost:3000/test will be handlled by this
app.use("/hello",(req,res)=>{
    res.send("Hello HelloHelloHelloHelloHelloHelloHelloHelloHello ");
});

app.use("/test",(req,res)=>{
    res.send("test testtesttesttesttesttesttesttesttesttesttesttest");
});

// This line is used to start the server and make it listen for incoming requests on a specified port.
// app.listen(port, callback)
app.listen(3000, ()=>{
    console.log("Server is successfully up and running on port 3000.......");
});


