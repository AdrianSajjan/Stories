import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../actions/auth'

const Logout = ({ logout }) => {
  useEffect(
    () => {
      logout()
      window.location.reload()
    }, //eslint-disable-next-line
    []
  )
  return <Redirect to="/login" />
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
})

export default connect(null, mapDispatchToProps)(Logout)
