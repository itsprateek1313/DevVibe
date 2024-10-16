const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter your name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email");
  } else if (password === firstName) {
    throw new Error("Password cannot be your name");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a strong password");
  }
};

module.exports = {
  validateSignUpData,
};
