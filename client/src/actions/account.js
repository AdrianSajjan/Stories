import axios from 'axios'

import {
  UPDATE_NAME,
  UPDATE_NAME_ERROR,
  UPDATE_EMAIL,
  UPDATE_EMAIL_ERROR,
  UPDATE_PASSWORD_ERROR,
  REMOVE_PASSWORD_ERROR,
  RESET_ACCOUNT_ERROR,
  VERIFY_EMAIL
} from './types'

const config = {
  header: {
    'Content-Type': 'application/json'
  }
}

export const updateName = (name, addToast) => async (dispatch) => {
  try {
    const res = await axios.post('/api/user/update/name', { name }, config)
    addToast(res.data.msg || 'Name has been updated!', {
      appearance: 'success'
    })
    dispatch({ type: UPDATE_NAME, payload: res.data.name })
  } catch (err) {
    const data = err.response.data
    if (data && data.validation) {
      dispatch({ type: UPDATE_NAME_ERROR, payload: data.errors })
    } else {
      addToast(data.msg || 'Name update failed!', { appearance: 'error' })
    }
  }
}

export const updateEmail = (email, addToast) => async (dispatch) => {
  try {
    const res = await axios.post('/api/user/update/email', { email }, config)
    dispatch({ type: UPDATE_EMAIL, payload: res.data })
    addToast(res.data.msg || 'Email has been updated!', {
      appearance: 'success'
    })
  } catch (err) {
    const data = err.response.data
    if (data && data.validation) {
      dispatch({
        type: UPDATE_EMAIL_ERROR,
        payload: data.errors
      })
    } else {
      addToast(data.msg || 'Email update failed!', { appearance: 'error' })
    }
  }
}

export const updatePassword = (password, addToast) => async (dispatch) => {
  try {
    const res = await axios.post('/api/user/update/password', password, config)
    addToast(res.data.msg || 'Password updated!', { appearance: 'success' })
  } catch (err) {
    const data = err.response.data
    if (data && data.validation) {
      dispatch({
        type: UPDATE_PASSWORD_ERROR,
        payload: data.errors
      })
    } else {
      addToast(data.msg || "Coudn't update password", { appearance: 'error' })
    }
  }
}

export const removePasswordError = (param) => (dispatch) => {
  dispatch({ type: REMOVE_PASSWORD_ERROR, payload: param })
}

export const resetAccountError = () => (dispatch) => {
  dispatch({ type: RESET_ACCOUNT_ERROR })
}

export const verifyEmail = (verify) => (dispatch) => {
  dispatch({ type: VERIFY_EMAIL, payload: verify })
}

export const requestVerificationToken = (setState, addToast) => (dispatch) => {
  axios
    .get('/api/user/confirm/request_token', config)
    .then((res) => {
      addToast(res.data.msg || 'Verification token sent!', {
        appearance: 'success',
        autoDismiss: false
      })
      setState(false)
    })
    .catch((err) => {
      addToast(err.response.data.msg || 'Unable to send token', {
        appearance: 'error'
      })
      setState(false)
    })
}
