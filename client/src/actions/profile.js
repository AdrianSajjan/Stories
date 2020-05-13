import { setAlert } from './alert'
import axios from 'axios'
import {
  GET_PROFILE,
  PROFILE_ERROR,
  SET_PROFILE,
  RESET_PROFILE_ERRORS,
  GET_PROFILE_BY_ID,
  REMOVE_PROFILE_BY_ID,
  GET_DISCOVER_PROFILES,
  SET_DISCOVER_PROFILES,
  DISCOVER_PROFILES_END,
  GET_SEARCH_PROFILES,
  SET_SEARCH_PROFILES,
  END_OF_SEARCH_PROFILES,
  CLEAR_SEARCH_PROFILES,
  REMOVE_DISCOVER_PROFILE,
  GET_PROFILE_IMAGE,
  SET_PROFILE_IMAGE
} from './types'

const config = {
  header: {
    'Content-Type': 'application/json'
  }
}

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const profile = await axios.get('/api/profile/me', config)
    dispatch({
      type: GET_PROFILE,
      payload: profile.data
    })
  } catch (err) {
    dispatch({
      type: GET_PROFILE,
      payload: null
    })
  }
}

export const setProfile = (data) => async (dispatch) => {
  try {
    const res = await axios.post('/api/profile', data, config)
    dispatch({
      type: SET_PROFILE,
      payload: res.data
    })
    dispatch({
      type: RESET_PROFILE_ERRORS
    })
    dispatch(setAlert('Success', 'Profile Updated Successfully!', 'success'))
  } catch (err) {
    if (err.response.data.type) {
      if (err.response.data.type === 'VALIDATION') {
        dispatch({
          type: PROFILE_ERROR,
          payload: err.response.data.errors
        })
      } else {
        dispatch(setAlert('Failed!', err.response.data.errors[0].msg, 'danger'))
      }
    } else {
      dispatch(setAlert('Failed!', err.response, 'danger'))
    }
  }
}

export const uploadProfileImage = (formData, config) => async (dispatch) => {
  dispatch({
    type: GET_PROFILE_IMAGE
  })

  try {
    const res = await axios.post('/api/uploads/profile', formData, config)
    dispatch({
      type: SET_PROFILE_IMAGE,
      payload: res.data
    })
    dispatch(setAlert('Success', 'Profile Updated Successfully!', 'success'))
  } catch (err) {
    dispatch(setAlert('Failed', err.response.data ? err.response.data : err.response, 'danger'))
  }
}

export const getProfileByID = (userID) => async (dispatch) => {
  dispatch({
    type: REMOVE_PROFILE_BY_ID
  })
  try {
    const res = await axios.get(`/api/profile/${userID}`, config)
    dispatch({
      type: GET_PROFILE_BY_ID,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: GET_PROFILE_BY_ID,
      payload: null
    })
  }
}

export const loadDiscoverProfiles = (page) => async (dispatch) => {
  dispatch({ type: GET_DISCOVER_PROFILES })
  try {
    const res = await axios.get(`/api/profile/discover?page=${page}`)

    if (res.data.length > 0)
      dispatch({
        type: SET_DISCOVER_PROFILES,
        payload: res.data
      })
    else dispatch({ type: DISCOVER_PROFILES_END })
  } catch (err) {
    dispatch({ type: DISCOVER_PROFILES_END })
  }
}

export const dismissProfileCard = (profile) => (dispatch) => {
  dispatch({
    type: REMOVE_DISCOVER_PROFILE,
    payload: profile
  })
}

export const loadSearchProfileResult = (match) => async (dispatch) => {
  dispatch(clearSearchProfileResult())

  dispatch({ type: GET_SEARCH_PROFILES, payload: match })

  try {
    const res = await axios.get(`/api/profile/search?match=${match}`)

    if (res.data.length > 0) dispatch({ type: SET_SEARCH_PROFILES, payload: res.data })
    else dispatch({ type: END_OF_SEARCH_PROFILES })
  } catch (err) {
    dispatch({ type: SET_SEARCH_PROFILES, payload: [] })
  }
}

export const clearSearchProfileResult = () => (dispatch) => {
  dispatch({ type: CLEAR_SEARCH_PROFILES })
}

export const updateFollowing = (id) => async (dispatch, getState) => {
  try {
    const res = await axios.put(`/api/profile/follow/${id}`)
    console.log(res.data)
    dispatch({ type: SET_PROFILE, payload: res.data.profile })

    if (res.data.activity) {
      const socket = getState().auth.socket
      if (socket) socket.emit('new-notification', res.data.activity, id)
    }
  } catch (err) {
    if (err.response) setAlert(`Error: ${err.response.status}`, err.response.data, 'danger')
  }
}
