import {
  SET_FORM_ERRORS,
  REMOVE_FORM_ERROR,
  REMOVE_FORM_ERRORS,
} from "./types";

export const setFormErrors = (errors) => (dispatch) => {
  dispatch({
    type: SET_FORM_ERRORS,
    payload: errors,
  });
};

export const removeFormError = (param) => (dispatch) => {
  dispatch({
    type: REMOVE_FORM_ERROR,
    payload: param,
  });
};

export const removeFormErrors = () => (dispatch) => {
  dispatch({
    type: REMOVE_FORM_ERRORS,
  });
};
