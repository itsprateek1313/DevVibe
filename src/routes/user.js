const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills";
const User = require("../models/user");
//This API gets all the pending(only interested) connection requests
//for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

//This API will give all the acceppted connections that the loggedIn user has
// Example Flow:
// Logged-in User makes a GET request to /user/connections.
// The system looks for all accepted connection requests where the user is either the sender or receiver.
// For each accepted connection:
// If the user is the sender, it adds the receiver's details.
// If the user is the receiver, it adds the sender's details.
// The API returns an array of users with whom the logged-in user has accepted connections.
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).send(`ERROR:${error.message}`);
  }
});

//In the feed users should see all the users except:
// 1. own profile
// 2. his accepted connections already
// 3. ignored people
// 4. already sent connection requests ie pending ones
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hidesUserFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hidesUserFromFeed.add(req.fromUserId.toString());
      hidesUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hidesUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (error) {
    res.status(400).send(`ERROR:${error.message}`);
  }
});

module.exports = userRouter;
