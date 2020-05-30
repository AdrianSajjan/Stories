import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_FAILED,
  LOGIN_REQUEST,
  REGISTRATION_REQUEST,
  USER_LOADED,
  AUTH_ERROR,
  UPDATE_TOKENS,
  LOGOUT,
  UPDATE_NAME,
  UPDATE_EMAIL,
  VERIFY_EMAIL,
  LOGIN_SUCCESS,
  INIT_SOCKET
} from '../actions/types'

const initialState = {
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  socket: null,
  request: {
    loginRequest: false,
    registrationRequest: false
  }
}

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case INIT_SOCKET:
      return {
        ...state,
        socket: payload
      }

    case LOGIN_REQUEST:
      return {
        ...state,
        request: {
          ...state.request,
          loginRequest: true
        }
      }
    case REGISTRATION_REQUEST:
      return {
        ...state,
        request: {
          ...state.request,
          registrationRequest: true
        }
      }
    case USER_LOADED:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
        request: {
          loginRequest: false,
          registrationRequest: false
        }
      }
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('access_token', payload.access_token)
      localStorage.setItem('refresh_token', payload.refresh_token)
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        request: {
          loginRequest: false,
          registrationRequest: false
        }
      }

    case UPDATE_TOKENS:
      localStorage.setItem('access_token', payload.access_token)
      localStorage.setItem('refresh_token', payload.refresh_token)
      return {
        ...state,
        ...payload
      }

    case UPDATE_NAME:
      return {
        ...state,
        user: {
          ...state.user,
          name: payload
        },
        errors: []
      }

    case UPDATE_EMAIL:
      return {
        ...state,
        user: {
          ...state.user,
          email: payload.email,
          validated: payload.validated
        },
        errors: []
      }

    case VERIFY_EMAIL:
      return {
        ...state,
        user: {
          ...state.user,
          validated: payload
        }
      }

    case REGISTER_FAILED:
    case AUTH_ERROR:
    case LOGIN_FAILED:
    case LOGOUT:
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        request: {
          loginRequest: false,
          registrationRequest: false
        }
      }
    default:
      return state
  }
}
