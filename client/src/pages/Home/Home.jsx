import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import Sidebar from "../../components/Sidebar/Sidebar";
import Timeline from "../../components/Timeline/Timeline";
import Profile from "../../components/Profile/Profile";
import Disccover from "../../components/Discover/Discover";
import { getCurrentProfile } from "../../actions/profile";
import { getCurrentUserPosts } from "../../actions/post";
import { connect } from "react-redux";
import "./Home.css";

const Home = ({ getCurrentProfile, getCurrentUserPosts }) => {
  // Home
  useEffect(() => {
    getCurrentProfile();
    getCurrentUserPosts();
    // eslint-disable-next-line
  }, []);

  return (
    <section className="w-100 bg-light">
      <Sidebar />
      <main className="main">
        <Container className="main-container" fluid={true}>
          <Switch>
            <Route path="/home" component={Timeline} exact />
            <Route path="/home/profile" component={Profile} />
            <Route path="/home/discover" component={Disccover} />
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
  getCurrentUserPosts: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  getCurrentProfile: () => dispatch(getCurrentProfile()),
  getCurrentUserPosts: () => dispatch(getCurrentUserPosts()),
});

export default connect(null, mapDispatchToProps)(Home);
