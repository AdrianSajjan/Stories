import { combineReducers } from "redux";
import alert from "./alert";
import error from "./error";
import auth from "./auth";
import profile from "./profile";
import sidebar from "./sidebar";
import post from "./post";

export default combineReducers({
  alert,
  error,
  auth,
  profile,
  sidebar,
  post,
});
