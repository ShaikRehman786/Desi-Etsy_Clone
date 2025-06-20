const BASE_URL = "http://localhost:5000/api/cart";

const authHeader = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getCartItems = async (token) => {
  const res = await fetch(`${BASE_URL}`, {
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};

export const addToCart = async (productId, token) => {
  const res = await fetch(`${BASE_URL}/add/${productId}`, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ productId }), // can be empty if backend doesn't use it
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to add to cart: ${errorText}`);
  }
};

export const removeFromCart = async (cartItemId, token) => {
  const res = await fetch(`${BASE_URL}/remove/${cartItemId}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error("Failed to remove from cart");
};

export const updateCartItemQuantity = async (cartItemId, action, token) => {
  const res = await fetch(`${BASE_URL}/update/${cartItemId}`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to update quantity");
};
