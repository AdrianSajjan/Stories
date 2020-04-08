import { combineReducers } from "redux";
import alert from "./alert";
import error from "./error";

export default combineReducers({
  alert,
  error,
});
