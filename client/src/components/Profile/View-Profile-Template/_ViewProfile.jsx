import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

const ViewProfile = ({ image, profile, owner }) => {
  const GetLocation = ({ locality, state, country }) => {
    let location = "";
    if (locality) location = location.concat(`${locality}, `);
    if (state) location = location.concat(`${state}, `);
    return location.concat(country);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex align-items-center justify-content-center px-5">
        <img src={image} alt="profile" className="profile-picture mr-3" />
        <div className="d-flex flex-column ml-3 details-col-1">
          <div>
            <p className="text-dark profile-label">Username:</p>
            <p className="text-muted profile-info">@{profile.username}</p>
          </div>
          <div>
            <p className="text-dark profile-label">Age:</p>
            <p className="text-muted profile-info">
              {moment().diff(profile.dob, "year", false)} Years
            </p>
          </div>
          <div>
            <p className="text-dark profile-label">Location:</p>
            <p className="text-muted profile-info">{GetLocation(profile)}</p>
          </div>
        </div>
      </div>
      {profile.bio && (
        <div className="profile-bio px-5 mt-4">
          <p className="font-weight-bold text-muted">{profile.bio}</p>
        </div>
      )}
      {owner ? (
        <Link
          to="/home/profile/edit"
          className={"btn btn-primary " + (profile.bio ? "mt-2" : "mt-4")}
        >
          Edit Profile
        </Link>
      ) : (
        <Button color="primary" className="mt-4">
          Follow User
        </Button>
      )}
    </div>
  );
};

ViewProfile.propTypes = {
  image: PropTypes.any.isRequired,
  profile: PropTypes.object.isRequired,
  owner: PropTypes.bool.isRequired,
};

export default ViewProfile;
