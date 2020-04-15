import React from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { closeSidebar } from "../../actions/sidebar";
import { connect } from "react-redux";
import DefaultImage from "../../assets/images/sample-profile-picture.png";
import "./Sidebar.css";

const Sidebar = ({ profile, toggleState, closeSidebar }) => {
  // Sidebar
  const { currentProfile } = profile;

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
      path: "/logout",
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
          onClick={closeSidebar}
        >
          <i className={`fa fa-${icon} fa-lg option-icon`}></i>
          <span className="option-name">{name}</span>
        </Link>
      )}
    />
  );

  return (
    <CSSTransition in={toggleState} timeout={300} classNames="sidebar">
      <section className="sidebar bg-light fixed-top">
        <div className="sidebar-container">
          <div className="sidebar-header">
            <h2>
              <Link to="/home" className="heading brand-name text-primary">
                STORIES!
              </Link>
            </h2>
            <button className="toggle-sidebar-btn" onClick={closeSidebar}>
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
              {currentProfile === null ? "" : currentProfile.username}
            </p>
            <div className="sidebar-profile-details d-flex">
              <div className="sidebar-following d-flex flex-column mr-2">
                <span className="details-text">Following</span>
                <span className="following-amount text-center mr-1">
                  {currentProfile === null
                    ? "0"
                    : currentProfile.following.length.toString()}
                </span>
              </div>
              <div className="sidebar-followers d-flex flex-column ml-2">
                <span className="details-text">Followers</span>
                <span className="following-amount text-center mr-1">
                  {currentProfile === null
                    ? "0"
                    : currentProfile.followers.length.toString()}
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
    </CSSTransition>
  );
};

Sidebar.propTypes = {
  profile: PropTypes.object.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  toggleState: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  toggleState: state.sidebar,
});

const mapDispatchToProps = (dispatch) => ({
  closeSidebar: () => dispatch(closeSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
