const express = require("express");
const { generateToken } = require("../config/generateToken");
const { verifyToken } = require("../middlewares/authentication");
const User = require("../models/User");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { name, email, password, pic } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please fill all the required field" });
    }

    const userAvailable = await User.findOne({ email });
    userAvailable && res.status(400).json("user already exists");

    const newUser = new User({
      name,
      email,
      password,
      pic,
    });
    const savedUser = await newUser.save();

    const token = await generateToken(savedUser._doc._id);

    res.status(201).json({
      message: `${name}, your account has been created!`,
      data: {
        _id: savedUser._doc._id,
        name: savedUser._doc.name,
        email: savedUser._doc.email,
        pic: savedUser._doc.pic,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json({ message: "Invalid Email credential" });

    if (!(await user.matchPassword(req.body.password))) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    res.status(200).json({
      message: "Login Successfull",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//search users
router.get("/", verifyToken, async (req, res) => {
  try {
    const searchContent = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(searchContent)
      .find({
        _id: { $ne: req.user._id },
      })
      .select("-password");

    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
