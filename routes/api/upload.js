const express = require("express");
const Profile = require("../../models/Profile");
const auth = require("../../middleware/token-auth");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

require("dotenv").config();
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "uploads",
  allowedFormats: ["jpg", "png", "jpeg"],
});

const parser = multer({ storage: storage });

/**
 * @route : POST api/upload/profile
 */
router.post("/profile", [auth, parser.single("profile")], async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    })
      .populate("user", ["name", "email"])
      .populate("following.profile")
      .populate("followers.profile");

    if (!profile)
      return res.status(404).json({
        type: NOTFOUND,
        msg: "Profile doesn't exist",
      });

    let avatar = {
      public_id: req.file.public_id,
      url: req.file.url,
    };

    if (profile.avatar && profile.avatar.public_id.length) {
      cloudinary.v2.uploader.destroy(
        profile.avatar.public_id,
        async (error, result) => {
          profile.avatar = avatar;
          await profile.save();

          console.log(`Result: ${result} | Error: ${error}`);
          return res.json(profile);
        }
      );
    } else {
      profile.avatar = avatar;

      await profile.save();

      return res.json(profile);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

module.exports = router;
