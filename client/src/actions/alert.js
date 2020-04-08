import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (header, msg, type) => (dispatch) => {
  dispatch({
    type: SET_ALERT,
    payload: { header, msg, type, active: true },
  });
};

export const removeAlert = () => (dispatch) => {
  dispatch({
    type: REMOVE_ALERT,
  });
};
