import api from "../../src/utils/api";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};


export const verifyOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};