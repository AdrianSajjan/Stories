import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { openSidebar } from '../../actions/sidebar'
import Discover from '../Discover/Discover'
import ActivityList from './Activity-List/Activity-List'

const Activity = ({ openSidebar }) => {
  return (
    <Fragment>
      <Row>
        <Col className="main-area" sm={{ size: 10, offset: 1 }} md={{ size: 12, offset: 0 }} lg="8">
          <div className="main-area-header sticky-top bg-light">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <h1 className="main-title text-primary">Activity</h1>
          </div>
          <ActivityList />
        </Col>
        <Col lg="4" className="side-area d-none d-lg-block">
          <Discover />
        </Col>
      </Row>
    </Fragment>
  )
}

Activity.propTypes = {
  openSidebar: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar())
})

export default connect(null, mapDispatchToProps)(Activity)
