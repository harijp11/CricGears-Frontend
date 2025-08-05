import axiosInstance from "../AxiosInstance";

export const getUsersAPI = async (page, limit = 5,search = "") => {
  const response = await axiosInstance.get(`/admin/users?page=${page}=${limit}&search=${encodeURIComponent(search)}`);
  return response
};


export const toggleUserStatusAPI = async (_id, isActive) => {
  const response = await axiosInstance.put("/admin/users/block", {
    _id,
    isActive,
  });
  return response
};



export const fetchSalesDataAPI = async ({ page, limit, filterType, startDate, endDate }) => {
  const response = await axiosInstance.get(`/admin/sales?page=${page}&limit=${limit}`, {
    params: { filterType, startDate, endDate },
  });
  return response
};


export const downloadSalesPDFAPI = async ({ filterType, startDate, endDate }) => {
  const response = await axiosInstance.get("/admin/sales/download/pdf", {
    params: { filterType, startDate, endDate },
    responseType: "blob",
  });
  return response
};


export const downloadSalesExcelAPI = async ({ filterType, startDate, endDate }) => {
  const response = await axiosInstance.get("/admin/sales/download/excel", {
    params: { filterType, startDate, endDate },
    responseType: "blob",
  });
  return response
};



export const fetchAdminDashboardAPI = async (timeFilter) => {
  const response = await axiosInstance.get("/admin/dashboard", {
    params: { timeFilter },
  });
  return response
};
