const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // Now 'user' is available here thanks to the middleware -->userAuth
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Sorry you cannot edit. Invalid edit data.");
    }
    //userAuth already attached user to req body
    const loggedInUser = req.user;
    //Do this For every data or use loop
    // loggedInUser.firstName = req.body.firstName;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    // res.send(`${loggedInUser.firstName}, your profile updated successfully.`);
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully.`,
      data: loggedInUser,
    });
    
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

module.exports = profileRouter;

