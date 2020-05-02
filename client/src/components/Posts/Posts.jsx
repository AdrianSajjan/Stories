import React from 'react'
import PropTypes from 'prop-types'
import Post from '../Single-Post/Post'

const Posts = ({ posts }) => posts.map((post) => <Post key={post._id} post={post} />)

Posts.propTypes = {
  posts: PropTypes.array.isRequired
}

export default Posts
