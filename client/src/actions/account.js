import axios from 'axios'
import { toast } from 'react-toastify'
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

export const updateName = (name) => async (dispatch) => {
  try {
    const res = await axios.post('/api/user/update/name', { name })
    toast.success(res.data.msg)
    dispatch({ type: UPDATE_NAME, payload: res.data.name })
  } catch (err) {
    const data = err.response.data
    if (data && data.type) {
      if (data.type === 'VALIDATION') dispatch({ type: UPDATE_NAME_ERROR, payload: err.response.data.errors })
      else toast.error(data.msg || "Coudn't update name")
    } else {
      toast.error("Coudn't update name")
    }
  }
}

export const updateEmail = (email) => async (dispatch) => {
  try {
    const res = await axios.post('/api/user/update/email', { email })
    dispatch({ type: UPDATE_EMAIL, payload: res.data })
    toast.success(res.data.msg)
  } catch (err) {
    const data = err.response.data
    if (data && data.type) {
      if (data.type === 'VALIDATION') dispatch({ type: UPDATE_EMAIL_ERROR, payload: err.response.data.errors })
      else toast.error(data.msg || "Coudn't update email")
    } else {
      toast.error("Coudn't update email")
    }
  }
}

export const updatePassword = (password) => async (dispatch) => {
  try {
    const res = await axios.post('/api/user/update/password', password)
    toast.success(res.data.msg)
  } catch (err) {
    const data = err.response.data
    if (data && data.type) {
      if (data.type === 'VALIDATION') dispatch({ type: UPDATE_PASSWORD_ERROR, payload: err.response.data.errors })
      else toast.error(data.msg || "Coudn't update password")
    } else {
      toast.error("Coudn't update password")
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

export const requestVerificationToken = (setState) => (dispatch) => {
  axios
    .get('/api/user/confirm/request_token')
    .then((res) => {
      toast.success(res.data.msg)
      setState(false)
    })
    .catch((err) => {
      toast.error(err.response.data.msg || 'Unable to send token')
      setState(false)
    })
}
