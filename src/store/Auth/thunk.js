import actionTypes from "./actions/actionTypes";
import mockDatabase from "../../data/mockDatabase.js";
import storageService from "../../services/storageService";

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
      // Use hybrid storage service
      const result = await storageService.login(data);

      if (result.success) {
        const userData = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        };

        localStorage.setItem("mk", data.password);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("userRole", result.user.role);

        dispatch({
          type: actionTypes.LOGIN,
          payload: userData,
        });
        dispatch({
          type: actionTypes.SET_USER_ROLE,
          payload: result.user.role,
        });

        return {
          success: true,
          user: userData,
          message: result.message
        };
      } else {
        throw new Error(result.error);
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

export const logout = () => async (dispatch) => {
  try {
    // Use hybrid storage service
    await storageService.logout();

    localStorage.removeItem("mk");
    localStorage.removeItem("adminToken");

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
      // Try server login first
      try {
        const result = await storageService.login(credentials);
        if (result.success && result.user.role === 'admin') {
          const adminData = {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role
          };

          // Store both tokens for compatibility
          localStorage.setItem("adminToken", `admin_token_${result.user.id}`);
          localStorage.setItem("authToken", localStorage.getItem("authToken") || `admin_token_${result.user.id}`);
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

          return { success: true, user: adminData, message: result.message };
        } else if (result.success && result.user.role !== 'admin') {
          throw new Error("Tài khoản này không có quyền admin");
        }
      } catch (serverError) {
        console.log('Server admin login failed, trying localStorage:', serverError.message);
      }

      // Fallback to localStorage check
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

        // Store both tokens for compatibility
        localStorage.setItem("adminToken", `admin_token_${admin.id}`);
        localStorage.setItem("authToken", `admin_token_${admin.id}`);
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

        return { success: true, user: adminData, message: "Đăng nhập admin thành công! (LocalStorage)" };
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
