const express = require("express");
const { verifyToken } = require("../middlewares/authentication");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

//create new mesage or send message
router.post("/", verifyToken, async (req, res) => {
  const { content, chatId } = req.body;

  if (!chatId || !content) {
    return res
      .status(400)
      .json({ message: "Invalid data passed into request" });
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(200).json({ data: message, message: "New message created" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get all messages
router.get("/:chatId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.status(200).json({ data: messages });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
