import React from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { closeSidebar } from "../../actions/sidebar";
import { connect } from "react-redux";
import DefaultImage from "../../assets/images/sample-profile-picture.png";
import "./Sidebar.css";

const Sidebar = ({ currentProfile, toggleState, closeSidebar }) => {
  // Sidebar
  const { profile } = currentProfile;

  const SidebarOptions = [
    {
      id: 1,
      path: "/home",
      name: "Home",
      icon: "home",
      exact: true,
    },
    {
      id: 2,
      path: "/home/chats",
      name: "Chats",
      icon: "envelope",
      exact: false,
    },
    {
      id: 3,
      path: "/home/notification",
      name: "Notification",
      icon: "bell",
      exact: false,
    },
    {
      id: 4,
      path: "/home/profile",
      name: "Profile",
      icon: "user",
      exact: false,
    },
    {
      id: 5,
      path: "/home/account",
      name: "Account",
      icon: "wrench",
      exact: false,
    },
    {
      id: 6,
      path: "/logout",
      name: "Logout",
      icon: "sign-out",
      exact: false,
    },
  ];

  const SidebarOption = (id, path, name, icon, exact) => (
    <Route
      exact={exact}
      key={id}
      path={path}
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
            {SidebarOptions.map(({ id, name, path, icon, exact }) =>
              SidebarOption(id, path, name, icon, exact)
            )}
          </div>
        </div>
      </section>
    </CSSTransition>
  );
};

Sidebar.propTypes = {
  currentProfile: PropTypes.object.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  toggleState: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  toggleState: state.sidebar,
});

const mapDispatchToProps = (dispatch) => ({
  closeSidebar: () => dispatch(closeSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
