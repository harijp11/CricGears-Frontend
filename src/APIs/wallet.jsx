import axiosInstance from "../AxiosInstance";

export const addMoneytoWalletApi = async (amount, _id) => {
  return await axiosInstance.post("/user/wallet/AddMoney", { amount, _id });
};

export const fetchWalletInfoApi = async (_id,page,limit = 6) => {
  return await axiosInstance.get("/user/wallet", {
    params: {
      _id,
      page,
      limit,
    },
  });
};
