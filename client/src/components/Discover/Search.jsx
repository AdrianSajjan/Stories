import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Row, Col, Spinner } from "reactstrap";
import Discover from "./Discover";
import { openSidebar } from "../../actions/sidebar";
import { connect } from "react-redux";
import {
  loadSearchProfileResult,
  clearSearchProfileResult,
} from "../../actions/profile";
import "./Search.css";

const Search = ({ openSidebar, searchProfiles, currentProfile }) => {
  const { profiles, loading: searchLoading } = searchProfiles;
  const { profile, loading: profileLoading } = currentProfile;
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
            <form className="search-form mx-auto w-75">
              <input
                type="text"
                name="search"
                className="search-bar-input"
                placeholder="Search by username..."
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
              {profiles.length === 0 ? (
                searchLoading && (
                  <Spinner color="primary" className="d-block mx-auto mt-4" />
                )
              ) : (
                <div className="search-result mt-4">
                  <div className="search-result-container py-2">
                    <p className="search-result-title text-center text-secondary">
                      Search Results
                    </p>
                    <hr />
                  </div>
                </div>
              )}
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
  currentProfile: PropTypes.func.isRequired,
  searchProfiles: PropTypes.object.isRequired,
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
