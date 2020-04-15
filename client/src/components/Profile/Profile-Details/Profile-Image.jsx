import React, { useState } from "react";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";

const ProfileImage = () => {
  // ProfileImage
  const [image, setImage] = useState(null);

  return (
    <form className="image-upload-form">
      <img
        src={image ? image : DefaultImage}
        alt="profile"
        className="profile-image"
      />
      <input
        type="file"
        name="upload-profile-image"
        id="image-upload-input"
        accept="image/*"
      />
      <div className="image-btn-field">
        <label
          className="btn btn-primary image-upload-label"
          htmlFor="image-upload-input"
        >
          Select
        </label>
        <button type="submit" className="btn btn-primary mb-2 ml-2">
          Upload
        </button>
      </div>
    </form>
  );
};

export default ProfileImage;
