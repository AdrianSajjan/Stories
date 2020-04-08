const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const {
  VALIDATION,
  SERVER,
  NOTFOUND,
  AUTHENTICATION,
} = require("../../config/errors");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const auth = require("../../middleware/token-auth");

const router = express.Router();
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
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
        type: VALIDATION,
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
      const payload_ID = {
        user: {
          id: data.id,
        },
      };

      const payload_EMAIL = {
        user: {
          email: data.email,
        },
      };
      // Sign the payload synchronously
      jwt.sign(
        payload_EMAIL,
        process.env.EMAIL_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          const url = `http://localhost:5000/api/user/confirm/${token}`;
          transporter.sendMail({
            from: process.env.ADMIN_MAIL,
            to: data.email,
            subject: "Confirm STORIES! Account",
            html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
          });
        }
      );

      jwt.sign(payload_ID, process.env.ID_SECRET, (err, token) => {
        if (err) throw err;
        res.json({
          token,
          validated: data.validated,
          msg: `Verification mail sent to ${data.email}. It will expire in 1 hour`,
        });
      });
      //Catch Errors
    } catch (err) {
      console.log(err.message);
      res.status(500).send(SERVER);
    }
  }
);

//@type: GET
//@desc: Validate an User
//@access: Private
router.get("/confirm/:email_token", async (req, res) => {
  const token = req.params.email_token;

  try {
    const decode = jwt.decode(token, process.env.EMAIL_SECRET);
    const email = decode.user.email;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        type: NOTFOUND,
        errors: [{ msg: "Account doesn't exist " }],
      });
    //@todo - validate account
    user.validated = true;
    await user.save();

    res.send("Email Validated");
  } catch (err) {
    console.log(err);
    res.status(500).send(SERVER);
  }
});

//@type: POST
//@desc: Delete an User
//@access: Private
router.delete(
  "/",
  [
    auth,
    [check("password").not().isEmpty().withMessage("Password cannot be empty")],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true }),
      });

    const userID = req.user.id;
    const { password } = req.body;
    try {
      const user = await User.findById(userID);
      //Check if User Exists
      if (!user)
        return res.status(404).json({
          type: NOTFOUND,
          errors: [{ msg: "Account doesn't exist" }],
        });
      // Check Password
      const isMatch = await bcrypt.compare(password, user.password);
      // If not match
      if (!isMatch)
        return res.status(403).json({
          type: AUTHENTICATION,
          errors: [
            {
              param: "password",
              msg: "Password is incorrect",
            },
          ],
        });
      // Delete User and Profile
      await Profile.findOneAndRemove({ user: userID });
      await user.remove();
      await Post.deleteMany({ user: userID });
      res.send({ msg: "Account Deleted" });
      //Handle Errors
    } catch (err) {
      console.log(err.message);
      res.status(500).send(SERVER);
    }
  }
);

module.exports = router;
