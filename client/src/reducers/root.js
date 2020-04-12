import { combineReducers } from "redux";
import alert from "./alert";
import error from "./error";
import auth from "./auth";
import profile from "./profile";

export default combineReducers({
  alert,
  error,
  auth,
  profile,
});
