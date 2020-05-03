import { GET_ALL_CHATS, SET_ALL_CHATS, SEND_MESSAGE } from '../actions/types'
import { GET_USER_CHAT, SET_USER_CHAT, SET_USER_CHAT_ERROR } from '../actions/types'

const initialState = {
  allChats: {
    chats: [],
    loading: false
  },
  userChat: {
    chat: null,
    error: null,
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
          chat: null,
          error: null,
          loading: true
        }
      }
    case SET_USER_CHAT:
      return {
        ...state,
        userChat: {
          chat: payload,
          error: null,
          loading: false
        }
      }
    case SET_USER_CHAT_ERROR:
      return {
        ...state,
        userChat: {
          chat: null,
          error: payload,
          loading: false
        }
      }

    case SEND_MESSAGE:
      const { receiver } = payload

      const isActiveChat = state.useChat.chat && state.userChat.chat.receiver.user === receiver.user
      if (isActiveChat) {
        state.userChat.chat = payload
      }

      const isExistingChat = state.allChats.chats.find((chat) => chat.receiver.user === receiver.user)
      if (isExistingChat) {
        state.allChats.chats = state.allChats.chats.map((chat) => (chat.receiver.user === receiver.user ? chat : payload))
      } else {
        state.allChats.chats = [...state.allChats.chats, payload]
      }

      return state

    default:
      return state
  }
}
