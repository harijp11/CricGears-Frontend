import axiosInstance from "../AxiosInstance";

export const fetchCategoriesAPI = async () => {
  try {
    const response = await axiosInstance.get("/user/categories");
    return response
  } catch (error) {
    throw error;
  }
};

export const addCategoryAPI = async ({ name, description }) => {
  return (
    await axiosInstance.post("/admin/addCategories", { name, description })
  )
};


export const getCategoryByIdAPI = async (id) => {
  const response = await axiosInstance.get(`/admin/getCategory/${id}`);
  return response
};

export const editCategoryAPI = async ({ id, name, description }) => {
  const response = await axiosInstance.put("/admin/editCategory", {
    id,
    name,
    description,
  });
  return response
};


export const toggleCategoryStatusAPI = async ({ _id, isActive }) => {
  const response = await axiosInstance.put("/admin/toggleCategories", {
    _id,
    isActive,
  });
  return response
};

export const fetchPaginatedCategoriesAPI = async ({ page, limit, search = "" }) => {
  const response = await axiosInstance.get(
    `/admin/fetchCategories?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return response;
};

export const getAdminCategories = async () => {
  return await axiosInstance.get("/admin/sendCategory");
};