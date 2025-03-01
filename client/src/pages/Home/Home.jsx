import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import io from 'socket.io-client'

import { useToasts } from 'react-toast-notifications'
import { Route, Switch, useLocation } from 'react-router-dom'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'

import Sidebar from '../../components/Sidebar/Sidebar'
import Timeline from '../../components/Timeline/Timeline'
import Profile from '../../components/Profile/Profile'
import Search from '../../components/Discover/Search'
import Account from '../../components/Account/Account'
import Chats from '../../components/Chats/Chats'
import Activity from '../../components/Activity/Activity'
import Error404 from '../../components/Error-404/Error-404'

import { getCurrentProfile } from '../../actions/profile'
import { getCurrentUserPosts } from '../../actions/post'
import { getAllChats, receiveMessage } from '../../actions/chat'
import { getActivities, pushActivity } from '../../actions/activity'
import { initSocket } from '../../actions/auth'

import './Home.css'

const Home = ({
  getCurrentProfile,
  getCurrentUserPosts,
  getAllChats,
  initSocket,
  user,
  receiveMessage,
  getActivities,
  pushActivity
}) => {
  const { addToast } = useToasts()
  const location = useLocation()

  useEffect(() => {
    getCurrentProfile()
    getCurrentUserPosts()
    getAllChats()
    getActivities()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (user) {
      const socket = io()
      initSocket(socket)
      socket.emit('login', user._id)
      socket.on('receive-message', (payload) => {
        receiveMessage(payload)
        if (!location.pathname.includes('/chats'))
          addToast('You have a new message', { appearance: 'info' })
      })
      socket.on('receive-notification', (payload) => {
        pushActivity(payload)
        if (!location.pathname.includes('/activities'))
          addToast('You have a new activity', { appearance: 'info' })
      })
    }
    // eslint-disable-next-line
  }, [user])

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
            <Route path="/home/activities" component={Activity} />
            <Route component={Error404} />
          </Switch>
        </Container>
      </main>
    </section>
  )
}

Home.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getCurrentUserPosts: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user
})

const mapDispatchToProps = (dispatch) => ({
  getCurrentProfile: () => dispatch(getCurrentProfile()),
  getCurrentUserPosts: () => dispatch(getCurrentUserPosts()),
  getAllChats: () => dispatch(getAllChats()),
  initSocket: (socket) => dispatch(initSocket(socket)),
  receiveMessage: (payload) => dispatch(receiveMessage(payload)),
  getActivities: () => dispatch(getActivities()),
  pushActivity: (payload) => dispatch(pushActivity(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
