import { GET_ALL_CHATS, SET_ALL_CHATS, SEND_MESSAGE } from './types'
import { SET_USER_CHAT, GET_USER_CHAT, SET_USER_CHAT_ERROR } from './types'
import { setAlert } from './alert'
import axios from 'axios'

export const getAllChats = () => async (dispatch) => {
  dispatch({ type: GET_ALL_CHATS })
  try {
    const res = await axios.get('/api/chat')
    dispatch({ type: SET_ALL_CHATS, payload: res.data })
  } catch (err) {
    dispatch({ type: SET_ALL_CHATS, payload: [] })
  }
}

export const getUserChat = (id) => async (dispatch) => {
  dispatch({ type: GET_USER_CHAT })
  try {
    const res = await axios.get(`/api/chat/${id}`)
    dispatch({ type: SET_USER_CHAT, payload: res.data })
  } catch (err) {
    dispatch({ type: SET_USER_CHAT_ERROR, payload: err.response.data })
  }
}

export const resetUserChat = () => (dispatch) => {
  dispatch({ type: GET_USER_CHAT })
}

export const sendMessage = (message, id) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/chat/${id}`, { message })
    dispatch({ type: SEND_MESSAGE, payload: res.data })
  } catch (err) {
    console.log(err)
    dispatch(setAlert('Message Not Sent!', err.response.data || err.response, 'danger'))
  }
}
