const express = require("express");

const { verifyToken } = require("../middlewares/authentication");
const Chat = require("../models/Chat");
const User = require("../models/User");

const router = express.Router();

//accessChat (One on One)
router.post("/", verifyToken, async (req, res) => {
  !req.body["userId"] &&
    res.status(400).json({ message: "UserId not available" });

  const { userId } = req.body;

  !userId &&
    res.status(400).json({ message: "UserId query not sent with request" });

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.status(200).json({ data: isChat[0] });
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdchat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdchat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json({ message: `Chat with ur friend`, data: fullChat });
    } catch (error) {
      res.status(400).json(error);
    }
  }
});

//fetchChat
router.get("/", verifyToken, async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).json({ message: `Complete chat data`, data: result });
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

//createGroupChat
router.post("/group", verifyToken, async (req, res) => {
  if (!req.body.chatName || !req.body.users) {
    return res
      .status(400)
      .json({ message: "Provide Group name and new users list" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2)
    return res
      .status(400)
      .json({ message: "More than two users are required to create a group" });

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      isGroupChat: true,
      users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({ message: `Group created`, data: fullGroupChat });
  } catch (error) {
    res.status(500).json(error);
  }
});

//renameGroup
router.put("/rename", verifyToken, async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName)
      return res.status(400).json({ message: "Provide chatName and chatId" });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: { chatName },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    !updatedChat
      ? res.status(400).json({ message: "Chat not found" })
      : res
          .status(200)
          .json({ message: `Renamed Successfully`, data: updatedChat });
  } catch (error) {
    res.status(500).json(error);
  }
});

//remove user from group
router.put("/groupremove", verifyToken, async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId)
      return res.status(400).json({ message: "Provide userId and chatId" });

    const removedUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    !removedUser
      ? res.status(400).json({ message: "User not found" })
      : res.status(200).json({ message: `Removed  user`, data: removedUser });
  } catch (error) {
    res.status(500).json(error);
  }
});

//add user to Group
router.put("/groupadd", verifyToken, async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId)
      return res.status(400).json({ message: "Provide userId and chatId" });

    const addedUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    !addedUser
      ? res.status(400).json({ message: "User not found" })
      : res.status(200).json({ message: `Added new user`, data: addedUser });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
