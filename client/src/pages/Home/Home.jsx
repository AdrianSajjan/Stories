import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import Sidebar from "../../components/Sidebar/Sidebar";
import Timeline from "../../components/Timeline/Timeline";
import Profile from "../../components/Profile/Profile";
import Search from "../../components/Discover/Search";
import Account from "../../components/Account/Account";
import Chats from "../../components/Chats/Chats";
import Notification from "../../components/Notification/Notification";
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
            <Route path="/home/discover" component={Search} />
            <Route path="/home/chats" component={Chats} />
            <Route path="/home/account" component={Account} />
            <Route path="/home/notification" component={Notification} />
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
