// import api from "../utils/api";

// export const createProduct = async (data) => {
//   const res = await api.post("/products", data);
//   return res.data;
// };

// export const getMyProducts = async () => {
//   const res = await api.get("/products/my");
//   return res.data;
// };

// export const updateProduct = async (id, data) => {
//   const res = await api.put(`/products/${id}`, data);
//   return res.data;
// };

// export const deleteProduct = async (id) => {
//   const res = await api.delete(`/products/${id}`);
//   return res.data;
// };







import api from "../utils/api";

export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

// services/product.js
// axios instance with token in headers

export const getMyProducts = async () => {
  try {
    const res = await api.get("/products");
    return res.data;
  } catch (err) {
    console.error("Error fetching artisan's products:", err);
    return [];
  }
};


export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};


export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  console.log("Attempting to delete product with ID:", id);
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
