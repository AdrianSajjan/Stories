import { GET_ALL_CHATS, GET_USER_CHAT, SET_ALL_CHATS, SET_USER_CHAT } from '../actions/types'

const initialState = {
  allChats: {
    chats: [],
    loading: false
  },
  userChat: {
    chat: [],
    loading: false
  }
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_ALL_CHATS:
      return {
        ...state,
        allChats: {
          ...state.allChats,
          loading: true
        }
      }
    case SET_ALL_CHATS:
      return {
        ...state,
        allChats: {
          chats: [...state.allChats.chats, ...payload],
          loading: false
        }
      }

    case GET_USER_CHAT:
      return {
        ...state,
        userChat: {
          chat: [],
          loading: true
        }
      }
    case SET_USER_CHAT:
      return {
        ...state,
        userChat: {
          chat: payload,
          loading: false
        }
      }
    default:
      return state
  }
}
