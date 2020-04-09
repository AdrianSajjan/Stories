import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, User, ...rest }) => {
  // Private Route
  const { isAuthenticated, loading } = User;
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          !loading ? (
            <Redirect to="/" />
          ) : null
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  User: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  User: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
