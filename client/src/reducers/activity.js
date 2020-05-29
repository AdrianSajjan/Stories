import {
  GET_ACTIVITIES,
  SET_ACTIVITIES,
  READ_ACTIVITY,
  PUSH_ACTIVITY
} from '../actions/types'

const initialState = {
  activities: [],
  loading: false
}

export default function (state = initialState, action) {
  const { payload, type } = action
  switch (type) {
    case GET_ACTIVITIES:
      return {
        ...state,
        loading: true
      }
    case SET_ACTIVITIES:
      return {
        ...state,
        activities: payload,
        loading: false
      }

    case READ_ACTIVITY: {
      return {
        ...state,
        activities: state.activities.map((activity) =>
          activity._id === payload._id ? payload : activity
        )
      }
    }
    case PUSH_ACTIVITY:
      return {
        ...state,
        activities: [...state.activities, payload]
      }

    default:
      return state
  }
}
