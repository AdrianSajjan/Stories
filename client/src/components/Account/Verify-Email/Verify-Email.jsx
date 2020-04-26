import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { verifyEmail } from "../../../actions/account";
import { Spinner } from "reactstrap";

const VerifyEmail = ({ user, verifyEmail }) => {
  const [error, setError] = useState("");
  const [res, setRes] = useState("");
  const { token } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!user.validated) verifyToken();
    else history.push("/home/account");
    //eslint-disable-next-line
  }, []);

  const verifyToken = async () => {
    try {
      const res = await axios.get(`/api/user/confirm/${token}`);
      setRes(res.data.msg);
      verifyEmail(res.data.validated);
      setError("");
    } catch (err) {
      setError(err.response.data ? err.response.data : err.response);
      setRes("");
    }
  };

  if (!user || (error.length === 0 && res.length === 0))
    return <Spinner color="primary" className="d-block mx-auto my-4" />;

  if (error.length > 0 && res.length === 0)
    return (
      <Fragment>
        <p className="text-center my-4 lead text-danger px-3">{error}</p>
      </Fragment>
    );

  if (res.length > 0 && error.length === 0)
    return (
      <Fragment>
        <p className="text-center my-4 lead text-success px-3">{res}</p>
      </Fragment>
    );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  verifyEmail: (verify) => dispatch(verifyEmail(verify)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
