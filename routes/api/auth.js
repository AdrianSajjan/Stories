const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const auth = require("../../middleware/token-auth");

const router = express.Router();

//@type: GET
//@desc: Return User Info
//@access: Private
router.get("/", auth, async (req, res) => {
  const userID = req.user.id;

  try {
    const user = await User.findById(userID).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//@type: POST
//@desc: Login an User
//@access: Public
router.post("/", async (req, res) => {
  // Destructure Body
  const { email, password } = req.body;
  // Start Async Process
  try {
    // Check Email in Database
    const user = await User.findOne({ email });
    // If User not found
    if (!user)
      return res.status(404).json({
        type: "Authentication",
        error: {
          param: "email",
          msg: "Account doesn't exist",
        },
      });
    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    // If not match
    if (!isMatch)
      return res.status(403).json({
        type: "Authentication",
        error: {
          param: "password",
          msg: "Password is incorrect",
        },
      });
    // Create Payload
    const payload = {
      user: {
        id: user.id,
      },
    };
    // Sign the payload
    jwt.sign(payload, config.get("JWT_SECRET"), (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
    // Catch Errors
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error! Please Try Again!");
  }
});

module.exports = router;
