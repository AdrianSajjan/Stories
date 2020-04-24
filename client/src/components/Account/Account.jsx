import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Switch, Link, Route } from "react-router-dom";
import { Row, Col, Button, Spinner } from "reactstrap";
import { openSidebar } from "../../actions/sidebar";
import Discover from "../Discover/Discover";
import { connect } from "react-redux";
import "./Account.css";

const Account = ({ openSidebar, currentProfile }) => {
  const tabList = [
    { name: "Change Name", color: "info", route: "update/name" },
    { name: "Update Email", color: "info", route: "update/email" },
    { name: "Change Password", color: "info", route: "update/password" },
    { name: "Delete Account", color: "danger", route: "delete" },
  ];

  const { profile, loading: userLoading } = currentProfile;

  const AccountTabs = () => {
    return (
      <Fragment>
        {tabList.map(({ route, color, name }) => (
          <Link
            to={`/home/account/${route}`}
            className={`btn btn-${color} account-tab mt-2`}
          >
            {name}
          </Link>
        ))}
        <Button color="success" className="account-tab mt-2">
          Resend Email Token
        </Button>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Row>
        <Col
          className="main-area"
          sm={{ size: 10, offset: 1 }}
          md={{ size: 12, offset: 0 }}
          lg="8"
        >
          <div className="main-area-header sticky-top bg-light">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <h1 className="main-title text-primary">Account</h1>
          </div>
          <div className="main-account-area py-2">
            <Switch>
              <Route exact path="/home/account" component={AccountTabs} />
            </Switch>
          </div>
        </Col>
        <Col lg="4" className="side-area d-none d-lg-block">
          {profile === null ? (
            userLoading && (
              <Spinner color="primary" className="d-block mx-auto my-5" />
            )
          ) : (
            <Discover />
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

Account.propTypes = {
  openSidebar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
});

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
