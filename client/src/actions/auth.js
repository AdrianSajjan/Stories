import axios from 'axios'
import setAuthToken from '../utils/set-auth-token'
import { toast } from 'react-toastify'
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
    if (localStorage.token) setAuthToken(localStorage.token)
    const res = await axios.get('/api/auth', config)
    dispatch({ type: USER_LOADED, payload: res.data })
    if (ownProps && redirect) ownProps.history.push(redirect)
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

export const register = (data, ownProps) => async (dispatch) => {
  try {
    dispatch({ type: REGISTRATION_REQUEST })
    const res = await axios.post('/api/user', data, config)

    dispatch({ type: REGISTER_SUCCESS, payload: res.data })
    dispatch(loadUser(ownProps, '/home/profile/edit'))

    addToast(res.data.msg || 'Registration successful!', {
      appearance: 'success'
    })
  } catch (err) {
    const data = err.response.data

    if (data.type && data.type === 'VALIDATION') {
      dispatch(setRegistrationErrors(data.errors))
    } else {
      addToast(data.msg || 'Registration failed!', { appearance: 'error' })
    }

    dispatch({ type: REGISTER_FAILED })
  }
}

export const login = (data, ownProps, redirect) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST })

    const res = await axios.post('/api/auth', data, config)

    dispatch({ type: LOGIN_SUCCESS, payload: res.data })
    dispatch(loadUser(ownProps, redirect))
  } catch (err) {
    const data = err.response.data

    dispatch({ type: LOGIN_FAILED })

    if (
      data.type &&
      (data.type === 'VALIDATION' || data.type === 'AUTHENTICATION')
    ) {
      dispatch(setLoginErrors(data.errors))
    } else {
      addToast(data.msg || 'Login failed!', { appearance: 'error' })
    }
  }
}

export const logout = () => (dispatch) => {
  dispatch({ type: REMOVE_ALL_POSTS })
  dispatch({ type: CLEAR_PROFILES })
  dispatch({ type: LOGOUT })
}
