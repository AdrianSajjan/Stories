import {
  GET_PROFILE,
  SET_PROFILE,
  PROFILE_ERROR,
  REMOVE_PROFILE_ERROR,
} from "../actions/types";

const initialState = {
  profile: null,
  loading: true,
  errors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case SET_PROFILE:
      return { ...state, profile: payload, loading: false, errors: [] };
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
    default:
      return state;
  }
}
