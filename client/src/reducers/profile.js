import {
  GET_PROFILE,
  SET_PROFILE,
  PROFILE_ERROR,
  REMOVE_PROFILE_ERROR,
  CLEAR_PROFILES,
  RESET_PROFILE_ERRORS,
} from "../actions/types";

const initialState = {
  currentProfile: null,
  profileByID: null,
  profiles: [],
  loading: true,
  errors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case SET_PROFILE:
      return { ...state, currentProfile: payload, loading: false, errors: [] };
    case PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        errors: [...state.errors, ...payload],
      };
    case REMOVE_PROFILE_ERROR:
      return {
        ...state,
        errors: state.errors.filter((error) => error.param !== payload),
      };
    case RESET_PROFILE_ERRORS:
      return { ...state, errors: [] };
    case CLEAR_PROFILES:
      return initialState;
    default:
      return state;
  }
}
