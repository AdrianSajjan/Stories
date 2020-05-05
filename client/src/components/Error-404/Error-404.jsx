import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './Error-404.css'

const Error404 = ({ isAuthenticated }) => {
  return (
    <Fragment>
      <div className="center-banner">
        <h1 className="m-0 font-weight-bold text-secondary text-center">Error 404</h1>
        <p className="lead my-1 text-muted text-center">The page you are looking for doesn't exist.</p>
        <p className="text-primary text-center lead font-weight-bold">
          <Link to={isAuthenticated ? '/home' : '/'}>Home</Link>
        </p>
      </div>
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Error404)
