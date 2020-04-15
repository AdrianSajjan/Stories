import {
  CREATE_POST,
  GET_CURRENT_USER_POSTS,
  GET_POST_BY_ID,
  GET_POSTS_BY_USER,
  GET_POSTS_FROM_FOLLOWING,
} from "./types";

import axios from "axios";

const config = {
  header: {
    "Content-Type": "application/json",
  },
};

export const getCurrentUserPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/post/me", config);
    dispatch({
      type: GET_CURRENT_USER_POSTS,
      payload: res.data.posts,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getTimelinePosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/post", config);
    dispatch({
      type: GET_POSTS_FROM_FOLLOWING,
      payload: res.data.posts,
    });
  } catch (err) {
    console.log(err);
  }
};
