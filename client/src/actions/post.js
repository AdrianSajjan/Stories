import {
  CREATE_POST,
  POST_ERROR,
  GET_CURRENT_USER_POSTS,
  REMOVE_POSTS_BY_USER,
  GET_POSTS_BY_USER,
  GET_POSTS_FROM_FOLLOWING,
  SET_POSTS_FROM_FOLLOWING,
  REMOVE_ALL_POSTS,
  POSTS_FROM_FOLLOWING_END,
  POST_LIKE,
  POST_COMMENT,
} from "./types";

import axios from "axios";
import { setAlert } from "./alert";

const config = {
  header: {
    "Content-Type": "application/json",
  },
};

export const createPost = (post) => async (dispatch) => {
  try {
    const res = await axios.post("/api/post", { content: post }, config);
    dispatch({
      type: CREATE_POST,
      payload: res.data,
    });
    dispatch(setAlert("Success", "Your post has been published!", "success"));
  } catch (err) {
    if (err.response.data.type) {
      if (err.response.data.type === "VALIDATION") {
        dispatch({
          type: POST_ERROR,
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

export const getCurrentUserPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/post/me", config);
    dispatch({
      type: GET_CURRENT_USER_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_CURRENT_USER_POSTS,
      payload: [],
    });
  }
};

export const getTimelinePosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: GET_POSTS_FROM_FOLLOWING });
    const res = await axios.get(`/api/post?page=${page}`, config);

    if (res.data.length > 0)
      dispatch({
        type: SET_POSTS_FROM_FOLLOWING,
        payload: res.data,
      });
    else
      dispatch({
        type: POSTS_FROM_FOLLOWING_END,
      });
  } catch (err) {
    dispatch({
      type: POSTS_FROM_FOLLOWING_END,
    });
  }
};

export const getPostsByUser = (userID) => async (dispatch) => {
  dispatch({
    type: REMOVE_POSTS_BY_USER,
  });
  try {
    const res = await axios.get(`/api/post/user/${userID}`);
    dispatch({
      type: GET_POSTS_BY_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_POSTS_BY_USER,
      payload: [],
    });
  }
};

export const likePost = (post) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/post/like/${post}`);
    dispatch({
      type: POST_LIKE,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.response);
  }
};

export const commentPost = (post, comment) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/post/comment/${post}`, { comment });
    dispatch({
      type: POST_COMMENT,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.response);
  }
};

export const deleteCommentPost = (comment) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/post/comment/${comment}`);
    dispatch({
      type: POST_COMMENT,
      payload: res.data,
    });
  } catch (err) {
    console.err(err.response);
  }
};

export const removeAllPosts = () => (dispatch) => {
  dispatch({
    type: REMOVE_ALL_POSTS,
  });
};
