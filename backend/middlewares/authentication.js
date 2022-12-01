const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      let token = req.headers.authorization.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
        if (err) return res.status(403).json({ message: "Token is Invalid" });

        req.user = await User.findById(data.id);

        next();
      });
    } catch (error) {
      res.status(401).json("You are unauthenticated");
    }
  }
};

module.exports = { verifyToken };
