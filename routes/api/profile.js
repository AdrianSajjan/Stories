const express = require("express");
const ObjectID = require("mongoose").Types.ObjectId;
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const auth = require("../../middleware/token-auth");

const router = express.Router();

//@type: POST
//@desc: Get user profile
//@access: Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "email"]);

    if (!profile)
      return res.status(404).json({
        type: "Unfound",
        msg: "Profile doesn't exist",
      });

    res.json(profile);
    // Handle Errors
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error. Please Try Again.");
  }
});

//@type: POST
//@desc:  Add user profile
//@access: Private
router.post(
  // Path
  "/",
  [
    // Validate Token
    auth,
    // Express Validator
    [
      // Validate Username
      check("username")
        .not()
        .isEmpty()
        .withMessage("Username cannot be empty")
        .custom(async (value, { req }) => {
          const profile = await Profile.findOne({ username: value });
          if (profile && profile.user != req.user.id)
            throw new Error("Username is already taken");
          return true;
        }),
      // Validate DOB
      check("dob")
        .not()
        .isEmpty()
        .withMessage("Date of Birth cannot be empty")
        .custom((value) => {
          const time = Date.parse(value) / 3.154e10;
          const currentTime = Date.parse(new Date()) / 3.154e10;
          if (!time || currentTime < time || Math.trunc(time) < -50)
            throw new Error("Provide a valid date of birth");
          return true;
        }),
    ],
  ],
  // Handle Request
  async (req, res) => {
    //Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        type: "Validation",
        errors: errors.array({ onlyFirstError: true }),
      });
    // Destructure req body and extract user ID
    const { username, dob, address, bio } = req.body;
    const userID = req.user.id;
    // Create Profile Data Object
    const profileData = {};
    profileData.username = username;
    profileData.user = userID;
    profileData.dob = new Date(`${dob}T00:00:00.000Z`);
    if (address) profileData.address = address;
    if (bio) profileData.bio = bio;
    // Async Function
    try {
      // Check for profile
      let profile = await Profile.findOne({ user: userID });
      // Update Profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: userID },
          { $set: profileData },
          { new: true }
        );
        return res.send(profile);
      }
      // Create Profile
      profile = new Profile(profileData);
      // Save Profile
      await profile.save();
      // Return Profile
      res.json(profile);
      // Catch Errors
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Internal Server Error. Please Try Again.");
    }
  }
);

//@type: GET
//@desc:  View another profile by User ID
//@access: Private
router.get("/:user_id", auth, (req, res) => {
  // Fetch User ID from Params
  const user_id = req.params.user_id;
  // Check if Valid User ID
  if (!ObjectID.isValid(user_id) || new ObjectID(user_id) != user_id)
    return res.status(400).json({
      type: "Validation",
      errors: [
        {
          msg: "Profile Not Found",
        },
      ],
    });
  // Fetch Profile from database
});

module.exports = router;
