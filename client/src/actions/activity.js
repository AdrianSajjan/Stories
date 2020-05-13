import { GET_ACTIVITIES, SET_ACTIVITIES, PUSH_ACTIVITY, READ_ACTIVITY } from './types'
import axios from 'axios'

const config = {
  header: {
    'Content-Type': 'application/json'
  }
}

export const getActivities = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ACTIVITIES })

    const res = await axios.get('/api/activity', config)
    dispatch({ type: SET_ACTIVITIES, payload: res.data })
  } catch (err) {
    dispatch({ type: SET_ACTIVITIES, payload: [] })
  }
}

export const readActivity = (activityID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/activity/${activityID}`, config)
    dispatch({ type: READ_ACTIVITY, payload: res.data })
  } catch (err) {
    //Do Nothing
  }
}

export const pushActivity = (activity) => (dispatch) => {
  dispatch({ type: PUSH_ACTIVITY, payload: activity })
}
