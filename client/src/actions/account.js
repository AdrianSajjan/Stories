import axios from "axios";
import {
  UPDATE_NAME,
  UPDATE_NAME_ERROR,
  UPDATE_EMAIL,
  UPDATE_EMAIL_ERROR,
  UPDATE_PASSWORD_ERROR,
  REMOVE_PASSWORD_ERROR,
  RESET_ACCOUNT_ERROR,
} from "./types";
import { setAlert } from "./alert";

export const updateName = (name) => async (dispatch) => {
  try {
    const res = await axios.post("/api/user/update/name", { name });

    dispatch(setAlert("Success", res.data.msg, "success"));

    dispatch({
      type: UPDATE_NAME,
      payload: res.data.name,
    });
  } catch (err) {
    if (err.response.data.type && err.response.data.type === "VALIDATION") {
      dispatch({
        type: UPDATE_NAME_ERROR,
        payload: err.response.data.errors,
      });
    } else {
      dispatch(
        setAlert(
          `Error: ${err.response.status}`,
          err.response.data ? err.response.data : err.response,
          "danger"
        )
      );
    }
  }
};

export const updateEmail = (email) => async (dispatch) => {
  try {
    const res = await axios.post("/api/user/update/email", { email });

    dispatch(setAlert("Success", res.data.msg, "success"));

    dispatch({
      type: UPDATE_EMAIL,
      payload: res.data.email,
    });
  } catch (err) {
    if (err.response.data.type && err.response.data.type === "VALIDATION") {
      dispatch({
        type: UPDATE_EMAIL_ERROR,
        payload: err.response.data.errors,
      });
    } else {
      dispatch(
        setAlert(
          `Error: ${err.response.status}`,
          err.response.data ? err.response.data : err.response,
          "danger"
        )
      );
    }
  }
};

export const updatePassword = (password) => async (dispatch) => {
  try {
    const res = await axios.post("/api/user/update/password", password);

    dispatch(setAlert("Success", res.data.msg, "success"));
  } catch (err) {
    if (err.response.data.type && err.response.data.type === "VALIDATION") {
      dispatch({
        type: UPDATE_PASSWORD_ERROR,
        payload: err.response.data.errors,
      });
    } else {
      dispatch(
        setAlert(
          `Error: ${err.response.status}`,
          err.response.data ? err.response.data : err.response,
          "danger"
        )
      );
    }
  }
};

export const removePasswordError = (param) => (dispatch) => {
  dispatch({
    type: REMOVE_PASSWORD_ERROR,
    payload: param,
  });
};

export const resetAccountError = () => (dispatch) => {
  dispatch({
    type: RESET_ACCOUNT_ERROR,
  });
};
