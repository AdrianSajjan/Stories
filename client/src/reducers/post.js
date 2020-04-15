import {
  CREATE_POST,
  GET_CURRENT_USER_POSTS,
  GET_POST_BY_ID,
  GET_POSTS_BY_USER,
  GET_POSTS_FROM_FOLLOWING,
  REMOVE_ALL_POSTS,
} from "../actions/types";

const initialState = {
  postByID: null,
  postsByUser: [],
  postsByFollowing: [],
  userPosts: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_POST:
      return { ...state, userPosts: [...state.userPosts, payload] };
    case GET_CURRENT_USER_POSTS:
      return { ...state, userPosts: payload };
    case GET_POSTS_BY_USER:
      return { ...state, postsByUser: payload };
    case GET_POST_BY_ID:
      return { ...state, postByID: payload };
    case GET_POSTS_FROM_FOLLOWING:
      return {
        ...state,
        postsByFollowing: [...state.postsByFollowing, ...payload],
      };
    case REMOVE_ALL_POSTS:
      return initialState;
    default:
      return state;
  }
}
