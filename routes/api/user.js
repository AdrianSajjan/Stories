const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

const router = express.Router();

//@type: POST
//@desc: Register an User
//@access: Public
router.post(
  //Path
  "/",
  // Express Validator Check
  [
    // Validate Name
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name cannot be empty")
      .isLength({ min: 3 })
      .withMessage("Enter your full name"),

    // Validate Email
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email cannot be empty")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) throw new Error("Email already in use");
        return true;
      }),

    // Validate Password
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty")
      .isLength({ min: 6 })
      .withMessage("Password cannot be less than 6 letters"),

    // Validate Confirm Password
    check("confirmPassword")
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty")
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error("Passwords don't match");
        return true;
      }),
  ],
  // Handle Request
  async (req, res) => {
    // Check if validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        type: "Validation",
        errors: errors.array({ onlyFirstError: true }),
      });
    // Continue to store in database
    try {
      // Destructure the req
      const { name, email, password } = req.body;
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      // Create a new model
      const user = new User({
        name,
        email,
        password: hash,
      });
      // Save the new model
      const data = await user.save();
      // Create JSON WEB TOKEN Payload
      const payload = {
        user: {
          id: data.id,
        },
      };
      // Sign the payload synchronously
      jwt.sign(payload, config.get("JWT_SECRET"), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
      //Catch Errors
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal Server Error. Please Try Again.");
    }
  }
);

module.exports = router;
