import actionTypes from "../actions/actionTypes";
import { produce } from "immer";

const initialState = {
  isLogin: !!localStorage.getItem("userInfo"), // Check if user is logged in
  userIsSignUp: null,
  userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
  userRole: localStorage.getItem("userRole") || "student", // student, admin
  forgotPassword: {
    loading: false,
    success: false,
    error: null,
    message: null,
  },
  resetPassword: {
    loading: false,
    success: false,
    error: null,
    message: null,
  },
};

const reducer = (state = initialState, { type, payload }) => {
  return produce(state, (draft) => {
    if (type === actionTypes.LOG_IN) {
      draft.isLogin = payload;
    } else if (type === actionTypes.USER_IS_LOGIN) {
      draft.isLogin = payload;
    } else if (type === actionTypes.SIGNUP) {
      draft.userInfo = payload;
    } else if (type === actionTypes.LOGIN) {
      draft.userInfo = payload;
      draft.isLogin = true;
    } else if (type === actionTypes.ADMIN_LOGIN) {
      draft.userInfo = payload;
      draft.isLogin = true;
      draft.userRole = "admin";
    } else if (type === actionTypes.SET_USER_ROLE) {
      draft.userRole = payload;
    } else if (type === actionTypes.LOGOUT) {
      draft.isLogin = false;
      draft.userInfo = null;
      draft.userRole = "student";
    } else if (type === actionTypes.FORGOT_PASSWORD_REQUEST) {
      draft.forgotPassword.loading = true;
      draft.forgotPassword.success = false;
      draft.forgotPassword.error = null;
      draft.forgotPassword.message = null;
    } else if (type === actionTypes.FORGOT_PASSWORD_SUCCESS) {
      draft.forgotPassword.loading = false;
      draft.forgotPassword.success = true;
      draft.forgotPassword.error = null;
      draft.forgotPassword.message = payload;
    } else if (type === actionTypes.FORGOT_PASSWORD_FAILURE) {
      draft.forgotPassword.loading = false;
      draft.forgotPassword.success = false;
      draft.forgotPassword.error = payload;
      draft.forgotPassword.message = null;
    } else if (type === actionTypes.RESET_PASSWORD_REQUEST) {
      draft.resetPassword.loading = true;
      draft.resetPassword.success = false;
      draft.resetPassword.error = null;
      draft.resetPassword.message = null;
    } else if (type === actionTypes.RESET_PASSWORD_SUCCESS) {
      draft.resetPassword.loading = false;
      draft.resetPassword.success = true;
      draft.resetPassword.error = null;
      draft.resetPassword.message = payload;
    } else if (type === actionTypes.RESET_PASSWORD_FAILURE) {
      draft.resetPassword.loading = false;
      draft.resetPassword.success = false;
      draft.resetPassword.error = payload;
      draft.resetPassword.message = null;
    }
    return draft;
  });
};

export default reducer;
