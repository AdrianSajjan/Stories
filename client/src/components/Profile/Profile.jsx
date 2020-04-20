import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { openSidebar } from "../../actions/sidebar";
import ProfileInfo from "./Profile-Details/Profile-Info";
import "./Profile.css";
import ViewCurrentProfile from "./View-Current-Profile/View-Current-Profile";
import ViewOtherProfile from "./View-Other-Profile/View-Other-Profile";

const Profile = ({ openSidebar }) => {
  // Profile
  return (
    <Fragment>
      <Row>
        <Col className="main-area p-0" sm="8" md="12" lg="8">
          <div className="main-area-header sticky-top bg-light">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <h1 className="main-title text-primary">Profile</h1>
          </div>
          <div className="main-profile-info mt-5">
            <Switch>
              <Route path="/home/profile/edit" component={ProfileInfo} exact />
              <Route
                path="/home/profile/"
                component={ViewCurrentProfile}
                exact
              />
              <Route
                path="/home/profile/view/:id"
                component={ViewOtherProfile}
                exact
              />
            </Switch>
          </div>
        </Col>
        <Col className="side-area bg-light d-sm-block d-md-none d-lg-block"></Col>
      </Row>
    </Fragment>
  );
};

Profile.propTypes = {
  openSidebar: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar()),
});

export default connect(null, mapDispatchToProps)(Profile);
