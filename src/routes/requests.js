const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `${status} is invalid status type.` });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        console.log(toUser);
        return res.status(400).send(`User not found`);
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          //reversed,see as key-value,checks connection in reverse order
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: `Connection already exists`,
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({
        message: `Connection Request sent successfully.`,
        data,
      });
    } catch (error) {
      res.status(400).send(`ERROR: ${error.message}`);
    }
  }
);


//API to accept or reject connections request
//Logged In user will send :status (accepted or rejected) and :requestId
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      //Getting the logged In user and status,requestId
      //Logged In user Id = toUserId
      const loggedInUser = req.user;
      const {status,requestId} = req.params;
      //Only "accepted" or "rejected" are allowed
      const allowedStatus = ["accepted","rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"Status not allowed"});
      }
      //Now find the connectionRequest which user wants
      //user wants to see which people sent him request
      const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested",
      });
      console.log(connectionRequest);
      if(!connectionRequest){
        return res.status(400).json({message:"Connection request not found!!!!!!!!!"});
      }
      //This line means connection is found
      //In the request params user has also sent whther he is interest or not
      //ie accepted,rejected,update the status of the requestId you found above
      //accordingly
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({message:"Connection request "+ status, data});
    } catch (error) {
      res.status(400).send(`ERROR: ${error.message}`);
    }
  }
);

module.exports = requestRouter;
