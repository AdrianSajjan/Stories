import { GET_ALL_CHATS, GET_USER_CHAT, SET_ALL_CHATS, SET_USER_CHAT } from './types'
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
