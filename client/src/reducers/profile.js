import {
  GET_PROFILE,
  SET_PROFILE,
  PROFILE_ERROR,
  REMOVE_PROFILE_ERROR,
  CLEAR_PROFILES,
  RESET_PROFILE_ERRORS,
  GET_PROFILE_BY_ID,
  REMOVE_PROFILE_BY_ID,
  GET_DISCOVER_PROFILES,
  SET_DISCOVER_PROFILES,
  DISCOVER_PROFILES_END,
  REMOVE_DISCOVER_PROFILE,
  GET_SEARCH_PROFILES,
  SET_SEARCH_PROFILES,
  END_OF_SEARCH_PROFILES,
  CLEAR_SEARCH_PROFILES,
  GET_PROFILE_IMAGE,
  SET_PROFILE_IMAGE
} from '../actions/types'

const initialState = {
  currentProfile: {
    profile: null,
    loading: true,
    upload: false
  },
  profileByID: {
    profile: null,
    loading: true
  },
  discoverProfiles: {
    profiles: [],
    loading: true,
    endOfProfiles: false,
    currentPage: 0
  },
  searchResults: {
    queryString: '',
    profiles: [],
    loading: false,
    endOfProfiles: false
  },
  errors: []
}

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case GET_PROFILE:
    case SET_PROFILE:
      return {
        ...state,
        currentProfile: {
          ...state.currentProfile,
          profile: payload,
          loading: false
        }
      }

    case GET_PROFILE_IMAGE:
      return {
        ...state,
        currentProfile: {
          ...state.currentProfile,
          upload: true
        }
      }
    case SET_PROFILE_IMAGE:
      return {
        ...state,
        currentProfile: {
          profile: payload,
          loading: false,
          upload: false
        }
      }

    case PROFILE_ERROR:
      return { ...state, errors: payload }
    case REMOVE_PROFILE_ERROR:
      return {
        ...state,
        errors: state.errors.filter((error) => error.param !== payload)
      }
    case RESET_PROFILE_ERRORS:
      return { ...state, errors: [] }

    case GET_DISCOVER_PROFILES:
      return {
        ...state,
        discoverProfiles: { ...state.discoverProfiles, loading: true }
      }
    case SET_DISCOVER_PROFILES:
      return {
        ...state,
        discoverProfiles: {
          ...state.discoverProfiles,
          loading: false,
          profiles: [...state.discoverProfiles.profiles, ...payload],
          currentPage: state.discoverProfiles.currentPage + 1
        }
      }
    case REMOVE_DISCOVER_PROFILE:
      return {
        ...state,
        discoverProfiles: {
          ...state.discoverProfiles,
          profiles: state.discoverProfiles.profiles.filter(
            (profile) => profile._id !== payload
          )
        }
      }
    case DISCOVER_PROFILES_END:
      return {
        ...state,
        discoverProfiles: {
          ...state.discoverProfiles,
          loading: false,
          endOfProfiles: true
        }
      }

    case GET_PROFILE_BY_ID:
      return { ...state, profileByID: { profile: payload, loading: false } }
    case REMOVE_PROFILE_BY_ID:
      return { ...state, profileByID: initialState.profileByID }

    case GET_SEARCH_PROFILES:
      return {
        ...state,
        searchResults: {
          ...state.searchResults,
          queryString: payload,
          loading: true,
          endOfProfiles: false
        }
      }
    case SET_SEARCH_PROFILES:
      return {
        ...state,
        searchResults: {
          ...state.searchResults,
          loading: false,
          profiles: payload,
          endOfProfiles: false
        }
      }
    case END_OF_SEARCH_PROFILES:
      return {
        ...state,
        searchResults: {
          ...initialState.searchResults,
          queryString: state.searchResults.queryString,
          endOfProfiles: true
        }
      }
    case CLEAR_SEARCH_PROFILES:
      return {
        ...state,
        searchResults: initialState.searchResults
      }

    case CLEAR_PROFILES:
      return initialState
    default:
      return state
  }
}
