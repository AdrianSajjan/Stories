import {
  CREATE_POST,
  GET_CURRENT_USER_POSTS,
  REMOVE_POSTS_BY_USER,
  REMOVE_POST_BY_ID,
  GET_POST_BY_ID,
  GET_POSTS_BY_USER,
  GET_POSTS_FROM_FOLLOWING,
  SET_POSTS_FROM_FOLLOWING,
} from "./types";

import axios from "axios";
//import { setAlert } from "./alert";

const config = {
  header: {
    "Content-Type": "application/json",
  },
};

export const createPost = (post) => async (dispatch) => {
  try {
    const res = await axios.post("/api/post", post, config);

    dispatch({
      type: CREATE_POST,
      payload: res.data,
    });
  } catch (err) {
    //
  }
};

export const getCurrentUserPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/post/me", config);
    dispatch({
      type: GET_CURRENT_USER_POSTS,
      payload: res.data.posts,
    });
  } catch (err) {
    //setAlert("Error", err.response, "danger");
  }
};

export const getTimelinePosts = () => async (dispatch) => {
  try {
    dispatch({ type: GET_POSTS_FROM_FOLLOWING });

    const res = await axios.get("/api/post", config);

    dispatch({
      type: SET_POSTS_FROM_FOLLOWING,
      payload: res.data.posts,
    });
  } catch (err) {
    //setAlert("Error", err.response, "danger");
  }
};

export const getPostByID = (postID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/post/${postID}`);
    dispatch({
      type: GET_POST_BY_ID,
      payload: res.data,
    });
  } catch (err) {
    //setAlert("Error", err.response, "danger");
  }
};

export const removePostByID = () => (dispatch) => {
  dispatch({
    type: REMOVE_POST_BY_ID,
  });
};

export const getPostsByUser = (userID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/post/user/${userID}`);
    dispatch({
      type: GET_POSTS_BY_USER,
      payload: res.data,
    });
  } catch (err) {
    //setAlert("Error", err.response, "danger");
  }
};

export const removePostsByUser = () => (dispatch) => {
  dispatch({
    type: REMOVE_POSTS_BY_USER,
  });
};
