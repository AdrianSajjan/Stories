import React from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import { connect } from "react-redux";
import DefaultImage from "../../assets/images/sample-profile-picture.png";
import "./Sidebar.css";

const Sidebar = ({ _profile }) => {
  // Sidebar
  const { profile } = _profile;

  const SidebarOptions = [
    {
      id: 1,
      path: "/home",
      name: "Home",
      icon: "home",
    },
    {
      id: 2,
      path: "/home/chats",
      name: "Chats",
      icon: "envelope",
    },
    {
      id: 3,
      path: "/home/notification",
      name: "Notification",
      icon: "bell",
    },
    {
      id: 4,
      path: "/home/profile",
      name: "Profile",
      icon: "user",
    },
    {
      id: 5,
      path: "/home/account",
      name: "Account",
      icon: "wrench",
    },
    {
      id: 6,
      path: "/home/logout",
      name: "Logout",
      icon: "sign-out",
    },
  ];

  const SidebarOption = (id, path, name, icon) => (
    <Route
      key={id}
      path={path}
      exact
      children={({ match }) => (
        <Link
          className={
            "sidebar-option mt-2" + (match ? " sidebar-option-active" : "")
          }
          to={path}
        >
          <i className={`fa fa-${icon} fa-lg option-icon`}></i>
          <span className="option-name">{name}</span>
        </Link>
      )}
    />
  );

  return (
    <section className="sidebar fixed-top">
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2>
            <Link to="/home" className="heading brand-name text-primary">
              STORIES!
            </Link>
          </h2>
          <button className="toggle-sidebar-btn mb-2">
            <span className="close-icon">&times;</span>
          </button>
        </div>
        <div className="sidebar-profile mt-4">
          <img
            src={DefaultImage}
            alt="profile"
            className="sidebar-profile-img"
          />
          <p className="sidebar-profile-name mb-1 mt-1">
            {profile === null ? "" : profile.username}
          </p>
          <div className="sidebar-profile-details d-flex">
            <div className="sidebar-following d-flex flex-column mr-2">
              <span className="details-text">Following</span>
              <span className="following-amount text-center mr-1">
                {profile === null ? "0" : profile.following.length.toString()}
              </span>
            </div>
            <div className="sidebar-followers d-flex flex-column ml-2">
              <span className="details-text">Followers</span>
              <span className="following-amount text-center mr-1">
                {profile === null ? "0" : profile.followers.length.toString()}
              </span>
            </div>
          </div>
        </div>
        <div className="sidebar-options mt-3">
          {SidebarOptions.map(({ id, name, path, icon }) =>
            SidebarOption(id, path, name, icon)
          )}
        </div>
      </div>
    </section>
  );
};

Sidebar.propTypes = {
  _profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  _profile: state.profile,
});

export default connect(mapStateToProps)(Sidebar);
