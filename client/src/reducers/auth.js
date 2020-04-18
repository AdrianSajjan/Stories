import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_REQUEST,
  REGISTRATION_REQUEST,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  request: {
    loginRequest: false,
    registrationRequest: false,
  },
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        request: {
          ...state.request,
          loginRequest: true,
        },
      };
    case REGISTRATION_REQUEST:
      return {
        ...state,
        request: {
          ...state.request,
          registrationRequest: true,
        },
      };
    case USER_LOADED:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
        request: {
          loginRequest: false,
          registrationRequest: false,
        },
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        request: {
          loginRequest: false,
          registrationRequest: false,
        },
      };
    case REGISTER_FAILED:
    case AUTH_ERROR:
    case LOGIN_FAILED:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        request: {
          loginRequest: false,
          registrationRequest: false,
        },
      };
    default:
      return state;
  }
}
