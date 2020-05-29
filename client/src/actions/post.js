import axios from 'axios'
import {
  CREATE_POST,
  POST_ERROR,
  GET_CURRENT_USER_POSTS,
  REMOVE_POSTS_BY_USER,
  GET_POSTS_BY_USER,
  GET_POSTS_FROM_FOLLOWING,
  SET_POSTS_FROM_FOLLOWING,
  CHECK_NEW_TIMELINE_POSTS,
  REMOVE_ALL_POSTS,
  POSTS_FROM_FOLLOWING_END,
  POST_LIKE,
  POST_COMMENT
} from './types'

const config = {
  header: {
    'Content-Type': 'application/json'
  }
}

export const createPost = (post, addToast) => async (dispatch) => {
  try {
    const res = await axios.post('/api/post', { content: post }, config)

    dispatch({ type: CREATE_POST, payload: res.data })
    addToast('Your post has been published', { appearance: 'success' })
  } catch (err) {
    const error = err.response.data

    if (error.type && error.type === 'VALIDATION') {
      dispatch({ type: POST_ERROR, payload: error.errors })
    } else {
      addToast(err.msg || 'Post upload failed!', { appearance: 'error' })
    }
  }
}

export const editPost = (post, postID, addToast) => async (dispatch) => {
  try {
    const res = await axios.put(
      `/api/post/${postID}`,
      { content: post },
      config
    )

    dispatch({ type: CREATE_POST, payload: res.data })
    addToast('Your post has been updated!', { appearance: 'success' })
  } catch (err) {
    const error = err.response.data
    if (error.type && error.type === 'VALIDATION') {
      dispatch({
        type: POST_ERROR,
        payload: error.errors
      })
    } else {
      addToast(error.msg || 'Post upload failed!', { appearance: 'error' })
    }
  }
}

export const getCurrentUserPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/post/me', config)
    dispatch({ type: GET_CURRENT_USER_POSTS, payload: res.data })
  } catch (err) {
    dispatch({ type: GET_CURRENT_USER_POSTS, payload: [] })
  }
}

export const getTimelinePosts = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_POSTS_FROM_FOLLOWING })

    const length = getState().post.postsByFollowing.posts.length
    const lastID =
      length > 0 ? getState().post.postsByFollowing.posts[length - 1]._id : ''

    const res = await axios.get(`/api/post?postID=${lastID}`, config)

    if (res.data.length > 0) {
      dispatch({ type: SET_POSTS_FROM_FOLLOWING, payload: res.data })
    } else {
      dispatch({ type: POSTS_FROM_FOLLOWING_END })
    }
  } catch (err) {
    dispatch({ type: POSTS_FROM_FOLLOWING_END })
  }
}

export const checkNewTimelinePosts = () => async (dispatch, getState) => {
  try {
    const length = getState().post.postsByFollowing.posts.length
    if (length === 0) return

    const lastID = getState().post.postsByFollowing.posts[0]._id
    const res = await axios.get(`/api/post/new?postID=${lastID}`, config)

    dispatch({ type: CHECK_NEW_TIMELINE_POSTS, payload: res.data })
  } catch (err) {
    dispatch({ type: CHECK_NEW_TIMELINE_POSTS, payload: [] })
  }
}

export const getPostsByUser = (userID) => async (dispatch) => {
  dispatch({ type: REMOVE_POSTS_BY_USER })
  try {
    const res = await axios.get(`/api/post/user/${userID}`)
    dispatch({ type: GET_POSTS_BY_USER, payload: res.data })
  } catch (err) {
    dispatch({ type: GET_POSTS_BY_USER, payload: [] })
  }
}

export const likePost = (post) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/post/like/${post}`)
    dispatch({ type: POST_LIKE, payload: res.data })
  } catch (err) {
    console.error(err.response)
  }
}

export const commentPost = (post, comment) => async (dispatch, getState) => {
  try {
    const res = await axios.put(`/api/post/comment/${post}`, { comment })
    dispatch({ type: POST_COMMENT, payload: res.data.post })

    if (res.data.activity) {
      const socket = getState().auth.socket
      if (socket) socket.emit('new-notification', res.data.activity, post.user)
    }
  } catch (err) {
    console.error(err.response)
  }
}

export const deleteCommentPost = (comment) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/post/comment/${comment}`)
    dispatch({
      type: POST_COMMENT,
      payload: res.data
    })
  } catch (err) {
    console.err(err.response)
  }
}

export const removeAllPosts = () => (dispatch) => {
  dispatch({
    type: REMOVE_ALL_POSTS
  })
}
