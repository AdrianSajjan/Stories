import axios from "axios";
import { setAlert } from "./alert";
import { setFormErrors } from "./error";
import setAuthToken from "../utils/set-auth-token";
import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
} from "./types";

const config = {
  header: {
    "Content-Type": "application/json",
  },
};

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
    // Handle Errors
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const register = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/api/user", data, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(setAlert("Account Created", res.data.msg, "success"));
    dispatch(loadUser());
  } catch (err) {
    const _data = err.response.data;
    if (_data.type === "VALIDATION") dispatch(setFormErrors(_data.errors));
    dispatch({
      type: REGISTER_FAILED,
    });
  }
};

export const login = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/api/auth", data, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const _data = err.response.data;
    if (_data && _data.type) {
      if (_data.type === "VALIDATION" || _data.type === "AUTHENTICATION")
        dispatch(setFormErrors(_data.errors));
      else dispatch(setAlert(`Error: ${err.response.status}`, _data, "danger"));
    }
    dispatch({
      type: LOGIN_FAILED,
    });
  }
};
