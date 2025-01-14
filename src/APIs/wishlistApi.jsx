import axiosInstance from "../AxiosInstance";

export const addToWishListApi = async (product_id, user_id) => {
    return await axiosInstance.post("/user/addToWishlist", {
      product_id,
      user_id,
    });
  };

export const removeFromWishListApi = async (product_id, user_id) => {
    return await axiosInstance.post("/user/wishlist/remove", {
      product_id,
      user_id,
    });
  };

  export const checkIsExistOnWishlistApi = async (product_id, user_id) => {
    return await axiosInstance.get("/user/wishlist/exist", {
      params: { product_id, user_id },
    });
  };

  export const fetchWishlistApi = async (user_id) => {
    return await axiosInstance.get("/user/wishlist", {
      params: { user_id },
    });
  };

  export const moveItemtoCartApi = async (product_id, user_id) => {
    return await axiosInstance.post("/user/wishlist/moveToCart", {
      product_id,
      user_id,
    });
  };

  export const checkisExistonCart = async (product_id, size) => {
    return await axiosInstance.post("/user/wishlist/isOnCart", {
      product_id,
      size,
    });
  };
  