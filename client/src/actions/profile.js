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
    dispatch({ type: GET_PROFILE, payload: profile.data })
  } catch (err) {
    dispatch({ type: GET_PROFILE, payload: null })
  }
}

export const setProfile = (data, addToast) => async (dispatch) => {
  try {
    const res = await axios.post('/api/profile', data, config)

    dispatch({ type: SET_PROFILE, payload: res.data })
    dispatch({ type: RESET_PROFILE_ERRORS })

    addToast('Profile has been updated!', { appearance: 'success' })
  } catch (err) {
    const data = err.response.data
    if (data && data.validation) {
      dispatch({ type: PROFILE_ERROR, payload: data.errors })
    } else {
      addToast(data.msg || "Coudn't set profile", { appearance: 'warning' })
    }
  }
}

export const uploadProfileImage = (formData, config, addToast) => async (
  dispatch
) => {
  try {
    dispatch({ type: GET_PROFILE_IMAGE })
    const res = await axios.post('/api/uploads/profile', formData, config)
    dispatch({ type: SET_PROFILE_IMAGE, payload: res.data })
    addToast('Profile updated successfully', { appearance: 'success' })
  } catch (err) {
    addToast(err.response.data.msg || 'Image upload failed', {
      appearance: 'error'
    })
  }
}

export const getProfileByID = (userID) => async (dispatch) => {
  dispatch({ type: REMOVE_PROFILE_BY_ID })
  try {
    const res = await axios.get(`/api/profile/${userID}`, config)
    dispatch({ type: GET_PROFILE_BY_ID, payload: res.data })
  } catch (err) {
    dispatch({ type: GET_PROFILE_BY_ID, payload: null })
  }
}

export const loadDiscoverProfiles = (page) => async (dispatch) => {
  dispatch({ type: GET_DISCOVER_PROFILES })
  try {
    const res = await axios.get(`/api/profile/discover?page=${page}`, config)

    if (res.data.length > 0) {
      dispatch({ type: SET_DISCOVER_PROFILES, payload: res.data })
    } else {
      dispatch({ type: DISCOVER_PROFILES_END })
    }
  } catch (err) {
    dispatch({ type: DISCOVER_PROFILES_END })
  }
}

export const dismissProfileCard = (profile) => (dispatch) => {
  dispatch({ type: REMOVE_DISCOVER_PROFILE, payload: profile })
}

export const loadSearchProfileResult = (match) => async (dispatch) => {
  try {
    dispatch(clearSearchProfileResult())
    dispatch({ type: GET_SEARCH_PROFILES, payload: match })

    const res = await axios.get(`/api/profile/search?match=${match}`, config)

    if (res.data.length > 0) {
      dispatch({ type: SET_SEARCH_PROFILES, payload: res.data })
    } else {
      dispatch({ type: END_OF_SEARCH_PROFILES })
    }
  } catch (err) {
    dispatch({ type: SET_SEARCH_PROFILES, payload: [] })
  }
}

export const clearSearchProfileResult = () => (dispatch) => {
  dispatch({ type: CLEAR_SEARCH_PROFILES })
}

export const updateFollowing = (id, addToast) => async (dispatch, getState) => {
  try {
    const res = await axios.put(`/api/profile/follow/${id}`, config)
    dispatch({ type: SET_PROFILE, payload: res.data.profile })
    if (res.data.activity) {
      const socket = getState().auth.socket
      if (socket) socket.emit('new-notification', res.data.activity, id)
    }
  } catch (err) {
    addToast(err.response.data.msg || "Coudn't follow user", {
      appearance: 'error'
    })
  }
}
