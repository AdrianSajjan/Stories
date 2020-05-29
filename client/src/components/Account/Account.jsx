import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { useToasts } from 'react-toast-notifications'
import { Switch, Link, Route } from 'react-router-dom'
import { Row, Col, Button, Spinner } from 'reactstrap'
import { openSidebar } from '../../actions/sidebar'
import Discover from '../Discover/Discover'
import { connect } from 'react-redux'
import { requestVerificationToken } from '../../actions/account'
import UpdateName from './Update-Name/UpdateName'
import UpdateEmail from './Update-Email/UpdateEmail'
import UpdatePassword from './Update-Password/UpdatePassword'
import VerifyEmail from './Verify-Email/Verify-Email'
import DeleteAccount from './Delete-Account/DeleteAccount'
import './Account.css'

const Account = ({
  user,
  openSidebar,
  currentProfile,
  requestVerificationToken
}) => {
  const tabList = [
    { name: 'Change Name', color: 'info', route: 'update/name' },
    { name: 'Update Email', color: 'info', route: 'update/email' },
    { name: 'Change Password', color: 'info', route: 'update/password' },
    { name: 'Delete Account', color: 'danger', route: 'delete' }
  ]

  const { addToast } = useToasts()
  const { profile, loading: userLoading } = currentProfile

  const [requestVerification, setRequestVerification] = useState(false)

  const requestToken = () => {
    if (requestVerification) return
    setRequestVerification(true)
    requestVerificationToken(setRequestVerification, addToast)
  }

  const AccountTabs = () => {
    return (
      <div className="account-tabs">
        {!user.validated && (
          <Fragment>
            <p className="text-danger px-3 text-center">
              <i className="fa fa-exclamation-triangle"></i> Your email address{' '}
              <strong>{user.email}</strong> is not verified. Check your email
              for a verification link or request a new one.
            </p>
            <Button
              color="success"
              className="account-tab mb-4"
              disabled={requestVerification}
              onClick={requestToken}
            >
              {requestVerification ? 'Requesting...' : 'Verify Email'}
            </Button>
          </Fragment>
        )}
        {tabList.map(({ route, color, name }, index) => (
          <Link
            key={index}
            to={`/home/account/${route}`}
            className={`btn btn-${color} account-tab mt-2`}
          >
            {name}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <Fragment>
      <Row>
        <Col
          className="main-area"
          sm={{ size: 10, offset: 1 }}
          md={{ size: 12, offset: 0 }}
          lg="8"
        >
          <div className="main-area-header sticky-top bg-light">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <h1 className="main-title text-primary">Account</h1>
          </div>
          <div className="main-account-area py-2">
            <Switch>
              <Route exact path="/home/account" component={AccountTabs} />
              <Route
                exact
                path="/home/account/update/name"
                component={UpdateName}
              />
              <Route
                exact
                path="/home/account/update/email"
                component={UpdateEmail}
              />
              <Route
                exact
                path="/home/account/update/password"
                component={UpdatePassword}
              />
              <Route
                exact
                path="/home/account/verify/:token"
                component={VerifyEmail}
              />
              <Route
                exact
                path="/home/account/delete"
                component={DeleteAccount}
              />
            </Switch>
          </div>
        </Col>
        <Col lg="4" className="side-area d-none d-lg-block">
          {profile === null ? (
            userLoading && (
              <Spinner color="primary" className="d-block mx-auto my-5" />
            )
          ) : (
            <Discover />
          )}
        </Col>
      </Row>
    </Fragment>
  )
}

Account.propTypes = {
  openSidebar: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  user: state.auth.user
})

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar()),
  requestVerificationToken: (setState, addToast) =>
    dispatch(requestVerificationToken(setState, addToast))
})

export default connect(mapStateToProps, mapDispatchToProps)(Account)
