const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
    min: 0,
  },
  gender: {
    type: String,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
