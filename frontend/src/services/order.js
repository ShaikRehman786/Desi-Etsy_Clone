// services/order.js
import api from "../services/../utils/api";

export const placeOrder = async (orderData) => {
  try {
    const res = await api.post("/orders", orderData);
    return res.data;
  } catch (err) {
    console.error("Error placing order:", err);
    throw err;
  }
};
