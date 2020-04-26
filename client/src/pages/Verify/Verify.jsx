import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";

const Verify = ({ auth }) => {
  const { isAuthenticated, loading } = auth;
  const { token } = useParams();

  if (!isAuthenticated)
    if (loading)
      return <Spinner color="primary" className="d-block mx-auto my-4" />;
    else return <Redirect to={`/login?next=/home/account/verify/${token}`} />;

  return <Redirect to={`/home/account/verify/${token}`} />;
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Verify);
