import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import LandingPromotion from "../../components/Landing-Promotion/Landing-Promotion";
import Register from "../../components/Register/Register";
import Login from "../../components/Login/Login";
import { connect } from "react-redux";
import "./Landing.css";

const Landing = ({ User }) => {
  // Landing
  const { isAuthenticated, loading } = User;

  if (isAuthenticated) return <Redirect to="/home" />;

  if (loading) return null;

  return (
    <div className="landing-page">
      <div className="grid-row">
        <div className="grid-col grid-col-branding bg-charcoal">
          <h1 className="brand-name text-light m-0">stories!</h1>
          <p className="lead text-jellybean m-0 brand-text">
            Because words are special
          </p>
        </div>
        <div className="grid-col grid-col-form d-flex flex-column justify-content-center bg-light py-5">
          <Switch>
            <Route path="/" exact component={LandingPromotion} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

Landing.propTypes = {
  User: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  User: state.auth,
});

export default connect(mapStateToProps)(Landing);
