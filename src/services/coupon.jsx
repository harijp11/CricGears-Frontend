import axiosInstance from "../AxiosInstance";

export const  AddCouponApi = async (coupon)=>{
    return await axiosInstance.post("/admin/addCoupon",{coupon})
}

export const editCoupon = async (coupon) => {
    const response = await axiosInstance.put("/admin/editCoupon", { coupon });
    return response
  }

  export const fetchCouponById = async (couponId) => {
    const response = await axiosInstance.get(`/admin/fetchById/${couponId}`);
    return response
  }

export const FetchCouponsApi = async ({ page, limit,search }) => {
    return await axiosInstance.get("/admin/fetchCoupons",{
      params:{ page, limit,search }}
    );
  };

  export const FetchCoupons = async () => {
    return await axiosInstance.get("/user/coupons");
  };


  
  //delete coupon
  export const deleteCouponApi = async (_id) => {
    return await axiosInstance.delete("/admin/deleteCoupon", { params: { _id } });
  };

  export const applyCouponApi = async (couponCode) => {
    return await axiosInstance.get("/user/coupon", { params: { couponCode } });
  };

  export const updateCouponDataApi = async (coupon_id,user_id)=>{
    return await axiosInstance.patch("/user/coupon/update",{coupon_id , user_id})
  }