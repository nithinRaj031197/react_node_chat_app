const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const access_token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return access_token;
};

module.exports = { generateToken };
