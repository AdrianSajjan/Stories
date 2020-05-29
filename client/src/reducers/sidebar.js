import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from '../actions/types'

const initialState = false

export default function (state = initialState, action) {
  const { type } = action
  switch (type) {
    case OPEN_SIDEBAR:
      return true
    case CLOSE_SIDEBAR:
      return false
    default:
      return state
  }
}
