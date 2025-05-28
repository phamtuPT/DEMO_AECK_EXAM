import actionTypes from "./actions/actionTypes";
import mockDatabase from "../../data/mockDatabase.js";

export const signUp = (data) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SIGN_UP,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = (data) => {
  return async (dispatch) => {
    try {
      // Check credentials against mock database
      const users = mockDatabase.getUsers();
      const user = users.find(u =>
        u.email === data.email &&
        u.password === data.password &&
        u.role === "student" &&
        u.isActive
      );

      if (user) {
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };

        localStorage.setItem("mk", data.password);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("userRole", "student");

        dispatch({
          type: actionTypes.LOGIN,
          payload: userData,
        });
        dispatch({
          type: actionTypes.SET_USER_ROLE,
          payload: "student",
        });

        return { success: true, user: userData };
      } else {
        throw new Error("Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  };
};

export const isLogin = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.USER_IS_LOGIN,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const logout = () => (dispatch) => {
  try {
    localStorage.removeItem("mk");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userRole");
    dispatch({
      type: actionTypes.LOGOUT,
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = (email) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.FORGOT_PASSWORD_REQUEST,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, we'll simulate success
      // In real app, this would be an actual API call
      const response = {
        success: true,
        message: "Email đặt lại mật khẩu đã được gửi thành công!"
      };

      if (response.success) {
        dispatch({
          type: actionTypes.FORGOT_PASSWORD_SUCCESS,
          payload: response.message,
        });
      } else {
        throw new Error("Email không tồn tại trong hệ thống");
      }
    } catch (error) {
      dispatch({
        type: actionTypes.FORGOT_PASSWORD_FAILURE,
        payload: error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    }
  };
};

export const resetPassword = (token, newPassword) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.RESET_PASSWORD_REQUEST,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, we'll simulate success
      const response = {
        success: true,
        message: "Mật khẩu đã được đặt lại thành công!"
      };

      if (response.success) {
        dispatch({
          type: actionTypes.RESET_PASSWORD_SUCCESS,
          payload: response.message,
        });
      } else {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
    } catch (error) {
      dispatch({
        type: actionTypes.RESET_PASSWORD_FAILURE,
        payload: error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    }
  };
};

export const adminLogin = (credentials) => {
  return async (dispatch) => {
    try {
      // Check credentials against mock database
      const users = mockDatabase.getUsers();
      const admin = users.find(user =>
        user.email === credentials.email &&
        user.password === credentials.password &&
        user.role === "admin" &&
        user.isActive
      );

      if (admin) {
        const adminData = {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        };

        localStorage.setItem("adminToken", `admin_token_${admin.id}`);
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userInfo", JSON.stringify(adminData));

        dispatch({
          type: actionTypes.ADMIN_LOGIN,
          payload: adminData,
        });

        dispatch({
          type: actionTypes.SET_USER_ROLE,
          payload: "admin",
        });

        dispatch({
          type: actionTypes.USER_IS_LOGIN,
          payload: true,
        });

        return { success: true, user: adminData };
      } else {
        throw new Error("Thông tin đăng nhập admin không đúng");
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};

export const setUserRole = (role) => (dispatch) => {
  dispatch({
    type: actionTypes.SET_USER_ROLE,
    payload: role,
  });
};
