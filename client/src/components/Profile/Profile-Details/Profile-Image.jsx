import React, { useState, useEffect } from "react";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";
import { connect } from "react-redux";
import { uploadProfileImage } from "../../../actions/profile";

const ProfileImage = ({ profile, uploadProfileImage, upload }) => {
  // ProfileImage
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  useEffect(() => {
    if (image) {
      const _previewURL = URL.createObjectURL(image);
      setPreviewURL(_previewURL);

      return () => {
        URL.revokeObjectURL(_previewURL);
        setPreviewURL(null);
      };
    }
  }, [image]);

  const handleChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!image || upload) return;

    const formData = new FormData();
    formData.append("profile", image);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    uploadProfileImage(formData, config);
  };

  if (!profile)
    return (
      <p className="text-info text-center px-3">
        Create Your Profile To Access More Features.
      </p>
    );

  const getProfileImage = () => {
    if (!previewURL)
      if (profile.avatar && profile.avatar.url && profile.avatar.url.length)
        return profile.avatar.url;
      else return DefaultImage;

    return previewURL;
  };

  return (
    <form className="image-upload-form" onSubmit={handleSubmit}>
      <img src={getProfileImage()} alt="profile" className="profile-image" />
      <input
        type="file"
        name="upload-profile-image"
        id="image-upload-input"
        accept="image/*"
        onChange={handleChange}
      />
      <div className="image-btn-field">
        <label
          className="btn btn-primary image-upload-label"
          htmlFor="image-upload-input"
        >
          Select
        </label>
        <button
          type="submit"
          className="btn btn-primary mb-2 ml-2"
          disabled={image !== null && !upload ? false : true}
        >
          Upload
        </button>
      </div>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  uploadProfileImage: (formData, config) =>
    dispatch(uploadProfileImage(formData, config)),
});

export default connect(null, mapDispatchToProps)(ProfileImage);
