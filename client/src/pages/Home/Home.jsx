import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import Sidebar from "../../components/Sidebar/Sidebar";
import Timeline from "../../components/Timeline/Timeline";
import Profile from "../../components/Profile/Profile";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import "./Home.css";

const Home = ({ auth, getCurrentProfile }) => {
  // Home
  useEffect(
    () => {
      getCurrentProfile();
    }, // eslint-disable-next-line
    []
  );

  return (
    <section className="w-100 bg-light">
      <Sidebar />
      <main className="main">
        <Container className="main-container" fluid={true}>
          <Switch>
            <Route path="/home" component={Timeline} exact />
            <Route path="/home/profile" component={Profile} />
            <Route>
              <h1>Page Not Found</h1>
            </Route>
          </Switch>
        </Container>
      </main>
    </section>
  );
};

Home.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  getCurrentProfile: () => dispatch(getCurrentProfile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
