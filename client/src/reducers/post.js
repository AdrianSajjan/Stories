import {
  CREATE_POST,
  POST_ERROR,
  GET_CURRENT_USER_POSTS,
  REMOVE_POSTS_BY_USER,
  GET_POST_BY_ID,
  REMOVE_POST_BY_ID,
  GET_POSTS_BY_USER,
  GET_POSTS_FROM_FOLLOWING,
  SET_POSTS_FROM_FOLLOWING,
  POSTS_FROM_FOLLOWING_END,
  REMOVE_ALL_POSTS,
} from "../actions/types";

const initialState = {
  postsByUser: {
    posts: [],
    loading: true,
  },
  postsByFollowing: {
    posts: [],
    loading: true,
    currentPage: 0,
    endOfPosts: false,
  },
  userPosts: {
    posts: [],
    loading: true,
  },
  errors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_POST:
      return {
        ...state,
        userPosts: {
          ...state.userPosts,
          posts: [payload, ...state.userPosts.posts],
        },
        errors: [],
      };
    case POST_ERROR:
      return { ...state, errors: payload };
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
          ...state.postsByFollowing,
          loading: false,
          posts: [...state.postsByFollowing.posts, ...payload],
          currentPage: state.postsByFollowing.currentPage + 1,
        },
      };
    case POSTS_FROM_FOLLOWING_END:
      return {
        ...state,
        postsByFollowing: {
          ...state.postsByFollowing,
          loading: false,
          endOfPosts: true,
        },
      };
    case REMOVE_ALL_POSTS:
      return initialState;
    default:
      return state;
  }
}
