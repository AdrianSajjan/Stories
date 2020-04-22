import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Spinner } from "reactstrap";
import Discover from "./Discover";
import ProfileCard from "../Profile/Profile-Card/Profile-Card";
import { openSidebar } from "../../actions/sidebar";
import { connect } from "react-redux";
import {
  loadSearchProfileResult,
  clearSearchProfileResult,
} from "../../actions/profile";
import "./Search.css";

const Search = ({
  openSidebar,
  searchProfiles,
  currentProfile,
  loadSearchProfileResult,
  clearSearchProfileResult,
}) => {
  const { profiles, loading: searchLoading, endOfProfiles } = searchProfiles;
  const { profile, loading: profileLoading } = currentProfile;

  const [match, setMatch] = useState(searchProfiles.queryString);
  const [error, setError] = useState("");

  const SearchCards = () => {
    if (error.length > 0)
      return <p className="text-danger text-center my-3">{error}</p>;

    if (profiles.length === 0 && searchLoading)
      return <Spinner color="primary" className="d-block mx-auto my-4" />;

    if (profiles.length === 0 && !searchLoading) {
      if (endOfProfiles)
        return (
          <p className="text-danger text-center my-3">No Profiles Found</p>
        );
      else
        return (
          <p className="text-muted text-center my-3">
            Start Typing And Hit Search
          </p>
        );
    }

    return profiles.map((profile) => (
      <ProfileCard key={profile._id} profile={profile} isDismissable={false} />
    ));
  };

  const SearchResults = () => {
    return (
      <Fragment>
        <div className="search-result mt-4">
          <div className="search-result-container py-2">
            <p className="search-result-title text-center text-secondary">
              Search Results
            </p>
            <hr />
            <SearchCards />
          </div>
        </div>
      </Fragment>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (match.length === 0) {
      clearSearchProfileResult();
      setError("Search cannot be empty");
    } else if (match.length < 3) {
      clearSearchProfileResult();
      setError("Please provide atleast 3 letters.");
    } else {
      setError("");
      loadSearchProfileResult(match);
    }
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
          <div className="main-area-header sticky-top bg-light py-3">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <form className="search-form mx-auto w-75" onSubmit={handleSubmit}>
              <input
                type="text"
                name="search"
                className="search-bar-input"
                placeholder="Search by username..."
                value={match}
                onChange={(e) => setMatch(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="fa fa-search"></i>
              </button>
            </form>
          </div>
          {!profile ? (
            profileLoading && (
              <Spinner color="primary" className="d-block mx-auto mt-4" />
            )
          ) : (
            <Fragment>
              <SearchResults />
              <div className="discover-results mt-4">
                <Discover />
              </div>
            </Fragment>
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

Search.propTypes = {
  openSidebar: PropTypes.func.isRequired,
  currentProfile: PropTypes.object.isRequired,
  searchProfiles: PropTypes.object.isRequired,
  loadSearchProfileResult: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  searchProfiles: state.profile.searchResults,
});

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar()),
  loadSearchProfileResult: (query) => dispatch(loadSearchProfileResult(query)),
  clearSearchProfileResult: () => dispatch(clearSearchProfileResult()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
