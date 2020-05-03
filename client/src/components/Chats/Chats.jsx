import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { openSidebar } from '../../actions/sidebar'
import FollowingList from './Following-List/Following-List'
import ChatList from './Chat-List/Chat-List'
import './Chats.css'

const Chats = ({ openSidebar }) => {
  return (
    <Fragment>
      <Row>
        <Col className="main-area" sm={{ size: 10, offset: 1 }} md={{ size: 12, offset: 0 }} lg="8">
          <div className="main-area-header sticky-top bg-light">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <h1 className="main-title text-primary">Chats</h1>
          </div>
          <ChatList />
        </Col>
        <Col lg="4" className="side-area d-none d-lg-block">
          <FollowingList />
        </Col>
      </Row>
    </Fragment>
  )
}

Chats.propTypes = {
  openSidebar: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar())
})

export default connect(null, mapDispatchToProps)(Chats)
