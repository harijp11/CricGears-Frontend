import axiosInstance from "../AxiosInstance";

export const forgotPassword = async (email) => {
    const response = await axiosInstance.post("/user/forgotPassword", { email });
    return response
};

export const verifyForgotPasswordOtp = async (email, otp) => {
    const response = await axiosInstance.post("/user/forgotPassword/Otpverify", {
      email,
      otp,
    });
    return response
};


export const adminLoginAPI = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post("/admin/login", { email, password });
    return response
  } catch (error) {
    throw error;
  }
};

export const googleAuth = async (token) => {
  try {
    const response = await axiosInstance.post("/user/googleAuth", {
      token,
    });
    return response
  } catch (error) {
    throw error;
  }
};


export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/user/login", {
      email,
      password,
    });
    return response
  } catch (error) {
    throw error;
  }
};




export const resetPassword = async (id, newPassword, confirmPassword) => {
  try {
    const response = await axiosInstance.post("/user/resetpassword", {
      newPassword,
      confirmPassword,
      _id: id,
    });
    return response
  } catch (error) {
    throw error;
  }
};


export const decrementCartItemAPI = async (itemId, userId) => {
  try {
    const response = await axiosInstance.patch(`/user/cart/minus/${itemId}/${userId}`);
    return response
  } catch (error) {
    throw error;
  }
};

export const updateUserProfileAPI = async ({ userId, email, name, phone }) => {
  try {
    const response = await axiosInstance.put("/user/editUser", {
      userId,
      email,
      name,
      phone,
    });
    return response
  } catch (error) {
    throw error;
  }
};


export const changeUserPasswordAPI = async ({ currentPassword, newPassword, confirmPassword, _Id }) => {
  try {
    const response = await axiosInstance.post("/user/changePassword", {
      currentPassword,
      newPassword,
      confirmPassword,
      _Id,
    });
    return response
  } catch (error) {
    throw error;
  }
};