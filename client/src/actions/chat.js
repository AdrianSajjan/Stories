import { GET_ALL_CHATS, SET_ALL_CHATS, SEND_MESSAGE, RECEIVE_MESSAGE } from './types'
import { SET_USER_CHAT, GET_USER_CHAT, SET_USER_CHAT_ERROR } from './types'
import { toast } from 'react-toastify'
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

export const sendMessage = (message, id, socket, profile) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/chat/${id}`, { message })
    dispatch({ type: SEND_MESSAGE, payload: res.data })
    let editedProfile = { ...profile }
    editedProfile.user = profile.user._id
    if (socket) socket.emit('send-message', { receiver: editedProfile, chat: res.data.chat }, id)
  } catch (err) {
    toast.error(err.response.data.msg || 'Unable to send message')
  }
}

export const receiveMessage = (payload) => (dispatch) => {
  dispatch({ type: RECEIVE_MESSAGE, payload: payload })
}
