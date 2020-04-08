import { SET_SIGNUP_ERRORS, REMOVE_SIGNUP_ERRORS } from "../actions/types";

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_SIGNUP_ERRORS:
      return payload;
    case REMOVE_SIGNUP_ERROR:
      return state.filter((error) => error.param !== payload);
    case REMOVE_SIGNUP_ERRORS:
      return [];
    default:
      return state;
  }
}
