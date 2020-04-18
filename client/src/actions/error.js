import {
  SET_LOGIN_ERRORS,
  REMOVE_LOGIN_ERROR,
  SET_REGISTRATION_ERRORS,
  REMOVE_REGISTRATION_ERROR,
  RESET_FORM_ERRORS,
} from "./types";

export const setLoginErrors = (errors) => (dispatch) => {
  dispatch({
    type: SET_LOGIN_ERRORS,
    payload: errors,
  });
};

export const removeLoginError = (param) => (dispatch) => {
  dispatch({
    type: REMOVE_LOGIN_ERROR,
    payload: param,
  });
};

export const setRegistrationErrors = (errors) => (dispatch) => {
  dispatch({
    type: SET_REGISTRATION_ERRORS,
    payload: errors,
  });
};

export const removeRegistrationError = (param) => (dispatch) => {
  dispatch({
    type: REMOVE_REGISTRATION_ERROR,
    payload: param,
  });
};

export const resetFormErrors = () => (dispatch) => {
  dispatch({
    type: RESET_FORM_ERRORS,
  });
};
