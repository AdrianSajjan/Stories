import {
  GET_PROFILE,
  SET_PROFILE,
  PROFILE_ERROR,
  REMOVE_PROFILE_ERROR,
  CLEAR_PROFILES,
  RESET_PROFILE_ERRORS,
} from "../actions/types";

const initialState = {
  currentProfile: {
    profile: null,
    loading: true,
    errors: [],
  },
  profileByID: {
    profile: null,
    loading: true,
  },
  discoverProfiles: {
    profiles: [],
    loading: true,
  },
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case SET_PROFILE:
      return {
        ...state,
        currentProfile: { profile: payload, loading: false, errors: [] },
      };
    case PROFILE_ERROR:
      return {
        ...state,
        currentProfile: {
          ...state.currentProfile,
          loading: false,
          errors: payload,
        },
      };
    case REMOVE_PROFILE_ERROR:
      return {
        ...state,
        currentProfile: {
          ...state.currentProfile,
          loading: false,
          errors: state.currentProfile.errors.filter(
            (error) => error.param !== payload
          ),
        },
      };
    case RESET_PROFILE_ERRORS:
      return {
        ...state,
        currentProfile: { ...state.currentProfile, errors: [] },
      };
    case CLEAR_PROFILES:
      return initialState;
    default:
      return state;
  }
}
