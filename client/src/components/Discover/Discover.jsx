import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { openSidebar } from "../../actions/sidebar";

const Discover = ({ openSidebar }) => {
  return (
    <Fragment>
      <Row>
        <Col className="main-area p-0" sm="8" md="12" lg="8">
          <div className="main-area-header sticky-top bg-light">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <h1 className="main-title text-secondary">Discover</h1>
          </div>
        </Col>
        <Col className="side-area bg-light d-sm-block d-md-none d-lg-block"></Col>
      </Row>
    </Fragment>
  );
};

Discover.propTypes = {
  openSidebar: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar()),
});

export default connect(null, mapDispatchToProps)(Discover);
