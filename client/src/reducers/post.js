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
  POST_LIKE,
  POST_COMMENT,
  CHECK_NEW_TIMELINE_POSTS
} from '../actions/types'

const initialState = {
  postsByUser: {
    posts: [],
    loading: true
  },
  postsByFollowing: {
    posts: [],
    loading: false,
    endOfPosts: false
  },
  userPosts: {
    posts: [],
    loading: true
  },
  errors: []
}

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case CREATE_POST:
      return {
        ...state,
        userPosts: {
          ...state.userPosts,
          posts: [payload, ...state.userPosts.posts]
        },
        errors: []
      }

    case POST_LIKE:
      if (state.postsByFollowing.posts.some((post) => post._id === payload._id))
        if (state.postsByUser.posts.some((post) => post._id === payload._id))
          return {
            ...state,
            postsByFollowing: {
              ...state.postsByFollowing,
              posts: state.postsByFollowing.posts.map((post) => (post._id === payload._id ? payload : post))
            },
            postsByUser: {
              ...state.postsByUser,
              posts: state.postsByUser.posts.map((post) => (post._id === payload._id ? payload : post))
            }
          }
        else
          return {
            ...state,
            postsByFollowing: {
              ...state.postsByFollowing,
              posts: state.postsByFollowing.posts.map((post) => (post._id === payload._id ? payload : post))
            }
          }
      else
        return {
          ...state,
          userPosts: {
            ...state.userPosts,
            posts: state.userPosts.posts.map((post) => (post._id === payload._id ? payload : post))
          }
        }

    case POST_COMMENT:
      if (state.postsByFollowing.posts.some((post) => post._id === payload._id))
        if (state.postsByUser.posts.some((post) => post._id === payload._id))
          return {
            ...state,
            postsByFollowing: {
              ...state.postsByFollowing,
              posts: state.postsByFollowing.posts.map((post) => (post._id === payload._id ? payload : post))
            },
            postsByUser: {
              ...state.postsByUser,
              posts: state.postsByUser.posts.map((post) => (post._id === payload._id ? payload : post))
            }
          }
        else
          return {
            ...state,
            postsByFollowing: {
              ...state.postsByFollowing,
              posts: state.postsByFollowing.posts.map((post) => (post._id === payload._id ? payload : post))
            }
          }
      else
        return {
          ...state,
          userPosts: {
            ...state.userPosts,
            posts: state.userPosts.posts.map((post) => (post._id === payload._id ? payload : post))
          }
        }

    case POST_ERROR:
      return { ...state, errors: payload }

    case GET_CURRENT_USER_POSTS:
      return { ...state, userPosts: { posts: payload, loading: false } }
    case GET_POSTS_BY_USER:
      return { ...state, postsByUser: { posts: payload, loading: false } }
    case REMOVE_POSTS_BY_USER:
      return { ...state, postsByUser: { posts: [], loading: true } }
    case GET_POST_BY_ID:
      return { ...state, postByID: { post: payload, loading: false } }
    case REMOVE_POST_BY_ID:
      return { ...state, postByID: { post: null, loading: true } }

    case GET_POSTS_FROM_FOLLOWING:
      return {
        ...state,
        postsByFollowing: { ...state.postsByFollowing, loading: true }
      }
    case CHECK_NEW_TIMELINE_POSTS:
      return {
        ...state,
        postsByFollowing: {
          ...state.postsByFollowing,
          posts: [...payload, ...state.postsByFollowing.posts]
        }
      }
    case SET_POSTS_FROM_FOLLOWING:
      return {
        ...state,
        postsByFollowing: {
          ...state.postsByFollowing,
          loading: false,
          posts: [...state.postsByFollowing.posts, ...payload]
        }
      }
    case POSTS_FROM_FOLLOWING_END:
      return {
        ...state,
        postsByFollowing: {
          ...state.postsByFollowing,
          loading: false,
          endOfPosts: true
        }
      }

    case REMOVE_ALL_POSTS:
      return initialState
    default:
      return state
  }
}
