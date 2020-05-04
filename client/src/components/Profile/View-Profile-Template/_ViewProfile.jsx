import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import { updateFollowing } from '../../../actions/profile'

const ViewProfile = ({ currentProfile, image, profile, owner, updateFollowing }) => {
  const GetLocation = ({ locality, state, country }) => {
    let location = ''
    if (locality) location = location.concat(`${locality}, `)
    if (state) location = location.concat(`${state}, `)
    return location.concat(country)
  }

  const FollowBtn = () => {
    if (owner) return null

    const isFollowing = currentProfile.following.some((follow) => follow.profile._id === profile._id)

    if (isFollowing)
      return (
        <div className="d-flex flex-column flex-sm-row mt-4">
          <Link to={`/home/chats/${profile.user}`} className="mr-sm-2 btn btn-outline-success">
            Message User
          </Link>
          <Button outline color="primary" className="ml-sm-2 mt-2 mt-sm-0" onClick={() => updateFollowing(profile.user)}>
            Unfollow User
          </Button>
        </div>
      )

    return (
      <div className="d-flex flex-column flex-sm-row mt-4">
        <Link to={`/home/chats/${profile.user}`} className="mr-sm-2 btn btn-success">
          Message User
        </Link>
        <Button color="primary" className="ml-sm-2 mt-2 mt-sm-0" onClick={() => updateFollowing(profile.user)}>
          Follow User
        </Button>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column align-items-center">
        <div className="d-flex align-items-center justify-content-center px-5">
          <img src={image} alt="profile" className="profile-picture mr-3" />
          <div className="d-flex flex-column ml-3 details-col-1">
            <div>
              <p className="text-dark profile-label">Username:</p>
              <p className="text-muted profile-info">@{profile.username}</p>
            </div>
            <div>
              <p className="text-dark profile-label">Age:</p>
              <p className="text-muted profile-info">{moment().diff(profile.dob, 'year', false)} Years</p>
            </div>
            <div>
              <p className="text-dark profile-label">Location:</p>
              <p className="text-muted profile-info">{GetLocation(profile)}</p>
            </div>
          </div>
        </div>
        {profile.bio && (
          <div className="profile-bio px-5 mt-4">
            <p className="font-weight-bold text-muted">{profile.bio}</p>
          </div>
        )}
        {owner ? (
          <Link to="/home/profile/edit" className={'btn btn-primary ' + (profile.bio ? 'mt-2' : 'mt-4')}>
            Edit Profile
          </Link>
        ) : (
          <FollowBtn />
        )}
      </div>
    </div>
  )
}

ViewProfile.propTypes = {
  image: PropTypes.any.isRequired,
  profile: PropTypes.object.isRequired,
  owner: PropTypes.bool.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  updateFollowing: (id) => dispatch(updateFollowing(id))
})

export default connect(null, mapDispatchToProps)(ViewProfile)
