import {
  SET_FORM_ERRORS,
  REMOVE_FORM_ERRORS,
  REMOVE_FORM_ERROR,
} from "../actions/types";

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_FORM_ERRORS:
      return payload;
    case REMOVE_FORM_ERROR:
      return state.filter((error) => error.param !== payload);
    case REMOVE_FORM_ERRORS:
      return [];
    default:
      return state;
  }
}
