import axios from 'axios'
import { setLoginErrors, setRegistrationErrors } from './error'
import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADED,
  LOGIN_REQUEST,
  REGISTRATION_REQUEST,
  INIT_SOCKET,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  UPDATE_TOKENS,
  LOGOUT,
  CLEAR_PROFILES,
  REMOVE_ALL_POSTS
} from './types'

const config = {
  header: {
    'Content-Type': 'application/json'
  }
}

export const initSocket = (socket) => (dispatch) => {
  dispatch({ type: INIT_SOCKET, payload: socket })
}

export const loadUser = (ownProps, redirect) => async (dispatch) => {
  try {
    const res = await axios.get('/api/auth', config)
    dispatch({ type: USER_LOADED, payload: res.data })

    if (ownProps && redirect) ownProps.history.push(redirect)
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

export const register = (data, addToast, ownProps) => async (dispatch) => {
  try {
    dispatch({ type: REGISTRATION_REQUEST })
    const res = await axios.post('/api/user', data, config)

    dispatch({ type: REGISTER_SUCCESS, payload: res.data })
    dispatch(loadUser(ownProps, '/home/profile/edit'))

    addToast(res.data.msg || 'Registration successful!', {
      appearance: 'success',
      autoDismiss: false
    })
  } catch (err) {
    const data = err.response.data

    if (data && data.validation) {
      dispatch(setRegistrationErrors(data.errors))
    } else {
      addToast(data.msg || 'Registration failed!', { appearance: 'error' })
    }

    dispatch({ type: REGISTER_FAILED })
  }
}

export const login = (data, addToast, ownProps, redirect) => async (
  dispatch
) => {
  try {
    dispatch({ type: LOGIN_REQUEST })

    const res = await axios.post('/api/auth', data, config)

    dispatch({ type: LOGIN_SUCCESS, payload: res.data })
    dispatch(loadUser(ownProps, redirect))
  } catch (err) {
    const data = err.response.data

    dispatch({ type: LOGIN_FAILED })

    if (data && (data.validation || data.authentication)) {
      dispatch(setLoginErrors(data.errors))
    } else {
      addToast(data.msg || 'Login failed!', { appearance: 'error' })
    }
  }
}

export const updateTokens = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_TOKENS,
    payload
  })
}

export const logout = () => (dispatch) => {
  dispatch({ type: REMOVE_ALL_POSTS })
  dispatch({ type: CLEAR_PROFILES })
  dispatch({ type: LOGOUT })
}
