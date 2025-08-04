import axiosInstance from "../AxiosInstance";

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/user/fetchProducts");
    return response
  } catch (error) {
    throw error;
  }
};




export const getProductSizeForUser = async (productId, userId, size) => {
  try {
    const response = await axiosInstance.get(
      `/user/size/${productId}/${userId}/${size}`
    );
    return response
  } catch (error) {
    throw error;
  }
};


export const fetchNewArrivalsAPI = async ({
  page,
  limit,
  category,
  size,
  search,
  sortBy,
}) => {
  try {
    const response = await axiosInstance.get("/user/fetchProducts", {
      params: {
        page,
        limit,
        category: category?.join(","),
        size: size?.join(","),
        search,
        sortBy,
      },
    });

    return response
  } catch (error) {
    throw error;
  }
};

export const checkProductAvailabilityAPI = async (cartItems) => {
  try {
    const response = await axiosInstance.post("/user/product/available", {
      cartItems,
    });
    return response
  } catch (error) {
    throw error;
  }
};

export const addProduct = async (productData) => {
  return await axiosInstance.post("/admin/addProduct", productData);
};

export const fetchProductById = async (productId) => {
  return await axiosInstance.get(`/admin/product/${productId}`);
};


export const editProduct = async (productData) => {
  return await axiosInstance.put("/admin/editProduct", productData);
};

export const toggleProductStatus = async (_id, isActive) => {
  return await axiosInstance.put("/admin/productStatus", {
    _id,
    isActive: !isActive,
  });
};

export const adminFetchProducts = async (page, limit) => {
  return await axiosInstance.get(`/admin/fetchProducts?page=${page}&limit=${limit}`);
};

export const lockAllItems = async (cartItems) => {
  return await axiosInstance.post("/user/product/lock-item", { cartItems });
};


export const unlockItems = async (cartItems) => {
  return await axiosInstance.post("/user/product/unlock-items", {
    cartItems,
  });
};