import {
  SET_SIGNUP_ERRORS,
  REMOVE_SIGNUP_ERROR,
  REMOVE_SIGNUP_ERRORS,
} from "./types";

export const setSignUpError = (errors) => (dispatch) => {
  dispatch({
    type: SET_SIGNUP_ERRORS,
    payload: errors,
  });
};

export const removeSignUpError = (param) => (dispatch) => {
  dispatch({
    type: REMOVE_SIGNUP_ERROR,
    payload: param,
  });
};

export const removeSignUpError = () => (dispatch) => {
  dispatch({
    type: REMOVE_SIGNUP_ERRORS,
  });
};
