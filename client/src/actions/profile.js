import {
  GET_PROFILE,
  PROFILE_ERROR,
  SET_PROFILE,
  RESET_PROFILE_ERRORS,
  GET_PROFILE_BY_ID,
  REMOVE_PROFILE_BY_ID,
} from "./types";
import { setAlert } from "./alert";
import axios from "axios";

const config = {
  header: {
    "Content-Type": "application/json",
  },
};

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const profile = await axios.get("/api/profile/me", config);
    dispatch({
      type: GET_PROFILE,
      payload: profile.data,
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILE,
      payload: null,
    });
  }
};

export const setProfile = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/api/profile", data, config);
    dispatch({
      type: SET_PROFILE,
      payload: res.data,
    });
    dispatch({
      type: RESET_PROFILE_ERRORS,
    });
    dispatch(setAlert("Success", "Profile Updated Successfully!", "success"));
  } catch (err) {
    if (err.response.data.type) {
      if (err.response.data.type === "VALIDATION") {
        dispatch({
          type: PROFILE_ERROR,
          payload: err.response.data.errors,
        });
      } else {
        dispatch(
          setAlert("Failed!", err.response.data.errors[0].msg, "danger")
        );
      }
    } else {
      dispatch(setAlert("Failed!", err.response, "danger"));
    }
  }
};

export const getProfileByID = (userID) => async (dispatch) => {
  dispatch({
    type: REMOVE_PROFILE_BY_ID,
  });
  try {
    const res = await axios.get(`/api/profile/${userID}`, config);
    dispatch({
      type: GET_PROFILE_BY_ID,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILE_BY_ID,
      payload: null,
    });
  }
};
