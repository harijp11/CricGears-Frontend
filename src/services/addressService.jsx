import axiosInstance from "../AxiosInstance";

// Fetch all addresses for a user
export const getUserAddressesAPI = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user/address/${userId}`);
    return response
  } catch (error) {
    throw error;
  }
};


export const addUserAddressAPI = async (userId, newAddress) => {
  try {
    const response = await axiosInstance.post("/user/address", {
      newAddress,
      userId,
    });
    return response
  } catch (error) {
    throw error;
  }
};

export const editUserAddressAPI = async (userId, newAddress) => {
  try {
    const response = await axiosInstance.post("/user/address/edit", {
      newAddress,
      userId,
    });
    return response
  } catch (error) {
    throw error;
  }
};

export const deleteUserAddressAPI = async (addressId) => {
  try {
    const response = await axiosInstance.delete(`/user/address/delete/${addressId}`);
    return response
  } catch (error) {
    throw error;
  }
};