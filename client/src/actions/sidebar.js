import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from "./types";

export const closeSidebar = () => (dispatch) => {
  dispatch({
    type: CLOSE_SIDEBAR,
  });
};

export const openSidebar = () => (dispatch) => {
  dispatch({
    type: OPEN_SIDEBAR,
  });
};
