const express = require("express");
const ObjectID = require("mongoose").Types.ObjectId;
const { check, validationResult } = require("express-validator");
const {
  VALIDATION,
  SERVER,
  NOTFOUND,
  AUTHENTICATION,
} = require("../../config/errors");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const auth = require("../../middleware/token-auth");

const router = express.Router();

//@type: GET
//@desc: Get current user profile
//@access: Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    })
      .populate("user", ["name", "email"])
      .populate("following.profile", "username")
      .populate("followers.profile", "username");

    if (!profile)
      return res.status(404).json({
        type: NOTFOUND,
        msg: "Profile doesn't exist",
      });

    res.json(profile);
    // Handle Errors
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

//@type: POST
//@desc:  Add or Update user profile
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
        .isLength({ min: 4 })
        .withMessage("Username should be more than 3 letters")
        .custom(async (value, { req }) => {
          const profile = await Profile.findOne({ username: value });
          if (profile && profile.user != req.user.id)
            throw new Error("Username is already taken");
          return true;
        }),
      // Validate Country
      check("country")
        .not()
        .isEmpty()
        .withMessage("Please specify the country you reside presently"),
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
    // Check for authentication error
    const userID = req.user.id;
    let user = await User.findById(userID);
    if (!user)
      return res.status(404).json({
        type: NOTFOUND,
        errors: [{ msg: "User doesn't exist" }],
      });
    if (!user.validated)
      return res.status(401).json({
        type: AUTHENTICATION,
        errors: [{ msg: "Please verify your email before creating profile." }],
      });
    //Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true }),
      });
    // Destructure req body and extract user ID
    const { username, dob, locality, state, country, bio } = req.body;
    // Create Profile Data Object
    const profileData = {};
    profileData.username = username;
    profileData.user = userID;
    profileData.dob = dob;
    profileData.country = country;
    if (locality) profileData.locality = locality;
    if (state) profileData.state = state;
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
      return res.status(500).send(SERVER);
    }
  }
);

//@type: GET
//@desc:  View another profile by User ID
//@access: Private
router.get("/:userID", auth, async (req, res) => {
  // Fetch User ID from Params
  const userID = req.params.userID;
  // Check if Valid User ID
  if (!ObjectID.isValid(userID) || new ObjectID(userID) != userID)
    return res.status(400).json({
      type: NOTFOUND,
      errors: [
        {
          msg: "Profile Not Found",
        },
      ],
    });
  // Fetch Profile from database
  try {
    const profile = await Profile.findOne({
      user: userID,
    })
      .populate("user", ["name", "email"])
      .populate("following.profile", "username")
      .populate("followers.profile", "username");
    // Profile not found
    if (!profile)
      return res.status(400).json({
        type: NOTFOUND,
        errors: [
          {
            msg: "Profile Not Found",
          },
        ],
      });
    // Send the profile to the user
    res.json(profile);
    // Handle Errors
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

//@type: PUT
//@desc:  Update following and followers
//@access: Private
router.put("/follow/:id", auth, async (req, res) => {
  const id = req.user.id;
  const otherUser = req.params.id;
  if (otherUser === id)
    return res.status(400).json({
      type: VALIDATION,
      errors: [
        {
          msg: "You cannot follow yourself",
        },
      ],
    });
  if (!ObjectID.isValid(otherUser) || new ObjectID(otherUser) != otherUser)
    return res.status(400).json({
      type: NOTFOUND,
      errors: [
        {
          msg: "Profile not found!!",
        },
      ],
    });

  try {
    let otherProfile = await Profile.findOne({ user: otherUser });
    if (!otherProfile)
      return res.status(400).json({
        type: NOTFOUND,
        errors: [
          {
            msg: "Profile not found",
          },
        ],
      });

    let profile = await Profile.findOne({ user: id });
    if (!profile)
      return res.status(404).json({
        type: NOTFOUND,
        errors: [
          {
            msg: "Create your profile before following other users",
          },
        ],
      });

    // If Following Unfollow User
    if (profile.following.some((item) => item.user == otherUser)) {
      profile.following = profile.following.filter(
        (item) => item.user != otherUser
      );
      otherProfile.followers = otherProfile.followers.filter(
        (item) => item.user != id
      );
      await profile.save();
      await profile
        .populate("following.profile", "username")
        .populate("followers.profile", "username")
        .execPopulate();
      await otherProfile.save();

      return res.json({ msg: "Unfollowed", profile });
    }

    let body = {
      user: otherUser,
      profile: otherProfile.id,
      date: new Date(),
    };
    profile.following.push(body);
    await profile.save();
    await profile
      .populate("following.profile", "username")
      .populate("followers.profile", "username")
      .execPopulate();

    body = {
      user: id,
      profile: profile.id,
      date: new Date(),
    };
    otherProfile.followers.push(body);
    await otherProfile.save();

    return res.json({ msg: "Followed", profile });
    // Handle Errors
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

module.exports = router;
