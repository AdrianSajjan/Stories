import React from 'react'
import { connect } from 'react-redux'
import { readActivity } from '../../../actions/activity'
import { Spinner } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import DefaultImage from '../../../assets/images/sample-profile-picture.png'

const SingleActivity = ({ activity, readActivity }) => {
  const history = useHistory()

  const handleClick = (e) => {
    if (!activity.seen) {
      readActivity(activity._id)
    }

    history.push(activity.link)
  }

  const getProfileImage = () => {
    const profile = activity.activity.profile
    if (profile.avatar && profile.avatar.url && profile.avatar.url.length) return profile.avatar.url
    else return DefaultImage
  }

  return (
    <button className={`activity-list py-2 ${!activity.seen && 'unread'}`} onClick={handleClick}>
      <img className="activity-avatar" src={getProfileImage()} alt="user" />
      <p className={`text-secondary ${!activity.seen && 'font-weight-bold'} m-0 ml-3`}>{activity.activity.message}</p>
    </button>
  )
}

const ActivityList = ({ activity, readActivity }) => {
  const { activities, loading } = activity

  if (!activities || !activities.length)
    return loading ? (
      <Spinner color="primary" className="mt-4 mx-auto d-block" />
    ) : (
      <p className="lead text-danger text-center mt-4">No Activity Found</p>
    )

  return (
    <div className="side-area-container activity-list-container">
      {activities.map((_activity) => (
        <SingleActivity key={_activity._id} activity={_activity} readActivity={readActivity} />
      ))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  activity: state.activity
})

const mapDispatchToProps = (dispatch) => ({
  readActivity: (id) => dispatch(readActivity(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList)
