
import axiosInstance from "../AxiosInstance";

export const placeOrderAPI = async (orderData) => {
  try {
    const response = await axiosInstance.post("/user/order", orderData);
    return response
  } catch (error) {
    throw error;
  }
};


export const getOrderByIdAPI = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/user/order/${orderId}`);
    return response
  } catch (error) {
    throw error;
  }
};



// Download invoice as PDF or file (blob)
export const downloadInvoiceAPI = async (orderData) => {
  try {
    const response = await axiosInstance.post(
      "/user/download/invoice",
      { orderData },
      { responseType: "blob" } // important for file downloads
    );
    return response
  } catch (error) {
    throw error;
  }
};


export const getUserOrdersAPI = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/user/orders/${userId}?page=${page}&limit=${limit}`
    );
    return response
  } catch (error) {
    throw error;
  }
};


export const cancelOrderItemAPI = async (orderId, itemId, cancelReason) => {
  try {
    const response = await axiosInstance.put(
      `/user/order/cancel/${orderId}/${itemId}`,
      { cancelReason }
    );
    return response
  } catch (error) {
    throw error;
  }
};


export const requestReturnAPI = async ({ reason, explanation, orderId, itemId }) => {
  try {
    const response = await axiosInstance.post("/user/return/request", {
      reason,
      explanation,
      orderId,
      itemId,
    });
    return response
  } catch (error) {
    throw error;
  }
};


export const finishPaymentAPI = async (orderId) => {
  try {
    const response = await axiosInstance.patch("/user/finishPayment", { orderId });
    return response
  } catch (error) {
    throw error;
  }
};


export const getOrderDetailsByIdAPI = async (id) => {
  const response = await axiosInstance.get(`/admin/order/${id}`);
  return response
};

export const fetchAdminOrdersAPI = async ({ page, limit }) => {
  const response = await axiosInstance.get(`/admin/orders`, {
    params: { page, limit },
  });
  return response
};