import axiosInstance from "../AxiosInstance";

export const addToCart = async (userId, product) => {
  try {
    const response = await axiosInstance.post("/user/addToCart", {
      userId,
      product,
    });
    return response 
  } catch (error) {
    throw error;
  }
};


export const fetchCartItemsAPI = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user/fetchCart/${userId}`);
    return response
  } catch (error) {
    throw error;
  }
};


export const incrementCartItemAPI = async (itemId, userId) => {
  try {
    const response = await axiosInstance.patch(`/user/cart/plus/${itemId}/${userId}`);
    return response
  } catch (error) {
    throw error;
  }
};

export const removeCartItemAPI = async (itemId, userId) => {
  try {
    const response = await axiosInstance.delete(`/user/cart/remove/${itemId}/${userId}`);
    return response
  } catch (error) {
    throw error;
  }
};
