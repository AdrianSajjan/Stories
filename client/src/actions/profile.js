import { GET_PROFILE, PROFILE_ERROR, SET_PROFILE } from "./types";
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
    console.log(err);
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response.data,
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
    dispatch(setAlert("Success", "Profile Updated Successfully!", "success"));
  } catch (err) {
    if (err.response.data.type) {
      if (err.response.data.type === "VALIDATION") {
        dispatch({
          type: PROFILE_ERROR,
          payload: err.response.data.errors,
        });
      } else {
        dispatch(setAlert("Failed!", err.response.data.msg, "danger"));
      }
    } else {
      dispatch(setAlert("Failed!", err.response.data, "danger"));
    }
  }
};
