const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const auth = require("../../middleware/token-auth");
const {
  VALIDATION,
  SERVER,
  NOTFOUND,
  AUTHENTICATION,
} = require("../../config/errors");

require("dotenv").config();

const router = express.Router();
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

/**
 * @route : POST api/user
 * @desc : Register an User
 * @access : Public
 */
router.post(
  "/",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name cannot be empty")
      .isLength({ min: 3 })
      .withMessage("Enter your full name"),

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

    check("password")
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty")
      .isLength({ min: 6 })
      .withMessage("Password cannot be less than 6 letters"),

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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true }),
      });

    try {
      const { name, email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hash,
      });

      const data = await user.save();

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
    } catch (err) {
      console.log(err.message);
      res.status(500).send(SERVER);
    }
  }
);

/**
 * @route : GET api/user/confirm/:email_token
 * @desc : Validate an User
 * @access : Private
 */
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

    user.validated = true;
    await user.save();

    res.send("Email Validated");
  } catch (err) {
    console.log(err);
    res.status(500).send(SERVER);
  }
});

/**
 * @route : POST api/user/delete
 * @desc : Delete an User
 * @access : Private
 */
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

      if (!user)
        return res.status(404).json({
          type: NOTFOUND,
          errors: [{ msg: "Account doesn't exist" }],
        });

      const isMatch = await bcrypt.compare(password, user.password);

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

      await Profile.findOneAndRemove({ user: userID });
      await user.remove();
      await Post.deleteMany({ user: userID });
      res.send({ msg: "Account Deleted" });
    } catch (err) {
      console.log(err.message);
      res.status(500).send(SERVER);
    }
  }
);

module.exports = router;
