import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { openSidebar } from "../../actions/sidebar";
import { connect } from "react-redux";
import "./Search.css";

const Search = ({ openSidebar }) => {
  return (
    <Fragment>
      <Row>
        <Col className="main-area p-0" sm="8" md="12" lg="8">
          <div className="main-area-header sticky-top bg-light py-3">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <form className="search-form mx-auto w-75">
              <input
                type="text"
                name="search"
                className="search-bar-input"
                placeholder="Search an user..."
              />
              <button type="submit" className="search-btn">
                <i className="fa fa-search"></i>
              </button>
            </form>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

Search.propTypes = {
  openSidebar: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar()),
});

export default connect(null, mapDispatchToProps)(Search);
