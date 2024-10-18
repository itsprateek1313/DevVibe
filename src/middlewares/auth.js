const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Token checking
const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Token not valid!!!!");
    }
    const decodedMessage = await jwt.verify(token, "DEV@VIBE#159");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    // Pass control to the next middleware/route handle
    next();
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
};

module.exports = {
  userAuth,
};
