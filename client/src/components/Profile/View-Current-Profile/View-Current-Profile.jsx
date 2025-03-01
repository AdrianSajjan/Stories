import React, { Fragment, useState } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Spinner } from 'reactstrap'
import { connect } from 'react-redux'
import ViewProfile from '../View-Profile-Template/_ViewProfile'
import Posts from '../../Posts/Posts'
import Followers from '../Followers/Followers'
import Following from '../Following/Following'
import DefaultImage from '../../../assets/images/sample-profile-picture.png'

const ViewCurrentProfile = ({ currentProfile, userPosts }) => {
  const { profile, loading: profileLoading } = currentProfile
  const { posts, loading: postsLoading } = userPosts

  const [tab, setTab] = useState(0)

  if (!profile)
    if (profileLoading) return <Spinner color="primary" className="d-block my-5 mx-auto" />
    else return <Redirect to="/home/profile/edit/" />

  const tabList = [
    {
      name: 'Posts',
      count: 0
    },
    {
      name: `Followers`,
      count: 1
    },
    {
      name: `Following`,
      count: 2
    }
  ]

  const ViewPosts = () => {
    if (!posts.length && postsLoading) return <Spinner color="primary" className="d-block my-2 mx-auto" />
    if (!posts.length && !postsLoading) return <p className="text-center text-muted mt-4 mb-2">No Posts Found</p>

    return (
      <Fragment>
        <Posts posts={posts} />
        <p className="text-center text-muted my-3">End of Posts</p>
      </Fragment>
    )
  }

  const ProfileTab = ({ name, data, count }) => {
    return (
      <button className={`profile-tab ${tab === count && `active`}`} onClick={() => setTab(count)}>
        {name}
      </button>
    )
  }

  const getProfileImage = () => {
    if (profile.avatar && profile.avatar.url && profile.avatar.url.length) return profile.avatar.url
    else return DefaultImage
  }

  return (
    <Fragment>
      <ViewProfile profile={profile} image={getProfileImage()} owner={true} />
      <div className="view-posts mt-5">
        <div className="profile-tabs d-flex">
          {tabList.map(({ name, count }, index) => (
            <ProfileTab key={index} name={name} count={count} />
          ))}
        </div>
        {tab === 0 && <ViewPosts />}
        {tab === 1 && <Followers owner={true} profile={profile} />}
        {tab === 2 && <Following owner={true} profile={profile} />}
      </div>
    </Fragment>
  )
}

ViewCurrentProfile.propTypes = {
  currentProfile: PropTypes.object.isRequired,
  userPosts: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  userPosts: state.post.userPosts
})

export default connect(mapStateToProps)(ViewCurrentProfile)
