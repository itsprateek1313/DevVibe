const express = require("express");
require("./config/database");

const app = express();
app.listen(3000, () => {
  console.log("Server is successfully up and running on port 3000.......");
});




