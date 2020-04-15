import {
  CREATE_POST,
  GET_CURRENT_USER_POSTS,
  GET_POST_BY_ID,
  GET_POSTS_BY_USER,
  GET_POSTS_FROM_FOLLOWING,
  SET_POSTS_FROM_FOLLOWING,
  REMOVE_ALL_POSTS,
  REMOVE_POSTS_BY_USER,
  REMOVE_POST_BY_ID,
} from "../actions/types";

const initialState = {
  postByID: {
    post: null,
    loading: true,
  },
  postsByUser: {
    posts: [],
    loading: true,
  },
  postsByFollowing: {
    posts: [],
    loading: true,
  },
  userPosts: {
    posts: [],
    loading: true,
  },
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_POST:
      return {
        ...state,
        userPosts: { ...state.userPosts, posts: [...state.userPosts, payload] },
      };
    case GET_CURRENT_USER_POSTS:
      return { ...state, userPosts: { posts: payload, loading: false } };
    case GET_POSTS_BY_USER:
      return { ...state, postsByUser: { posts: payload, loading: false } };
    case REMOVE_POSTS_BY_USER:
      return { ...state, postsByUser: { posts: [], loading: true } };
    case GET_POST_BY_ID:
      return { ...state, postByID: { post: payload, loading: false } };
    case REMOVE_POST_BY_ID:
      return { ...state, postByID: { post: null, loading: true } };
    case GET_POSTS_FROM_FOLLOWING:
      return {
        ...state,
        postsByFollowing: { ...state.postsByFollowing, loading: true },
      };
    case SET_POSTS_FROM_FOLLOWING:
      return {
        ...state,
        postsByFollowing: {
          loading: false,
          posts: [...state.postsByFollowing.posts, ...payload],
        },
      };
    case REMOVE_ALL_POSTS:
      return initialState;
    default:
      return state;
  }
}
