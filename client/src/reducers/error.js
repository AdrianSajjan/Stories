import {
  SET_LOGIN_ERRORS,
  REMOVE_LOGIN_ERROR,
  SET_REGISTRATION_ERRORS,
  REMOVE_REGISTRATION_ERROR,
  RESET_FORM_ERRORS,
  UPDATE_PASSWORD_ERROR,
  REMOVE_PASSWORD_ERROR,
  RESET_ACCOUNT_ERROR,
  UPDATE_EMAIL_ERROR,
  UPDATE_NAME_ERROR
} from '../actions/types'

const initialState = {
  loginErrors: [],
  registrationErrors: [],
  accountErrors: []
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_REGISTRATION_ERRORS:
      return { loginErrors: [], registrationErrors: payload }
    case REMOVE_REGISTRATION_ERROR:
      return {
        loginErrors: [],
        registrationErrors: state.registrationErrors.filter(
          (error) => error.param !== payload
        )
      }
    case SET_LOGIN_ERRORS:
      return { loginErrors: payload, registrationErrors: [] }
    case REMOVE_LOGIN_ERROR:
      return {
        registrationErrors: [],
        loginErrors: state.loginErrors.filter(
          (error) => error.param !== payload
        )
      }
    case RESET_FORM_ERRORS:
      return initialState

    case UPDATE_NAME_ERROR:
      return {
        ...state,
        accountErrors: payload
      }

    case UPDATE_EMAIL_ERROR:
      return {
        ...state,
        accountErrors: payload
      }

    case UPDATE_PASSWORD_ERROR:
      return {
        ...state,
        accountErrors: payload
      }
    case REMOVE_PASSWORD_ERROR:
      return {
        ...state,
        accountErrors: state.accountErrors.filter(
          (error) => error.param !== payload
        )
      }

    case RESET_ACCOUNT_ERROR:
      return {
        ...state,
        accountErrors: []
      }

    default:
      return state
  }
}
