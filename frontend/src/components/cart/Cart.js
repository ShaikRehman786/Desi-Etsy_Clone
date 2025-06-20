import React from "react";
import { useCart } from "../../context/CartContext"; // Adjust path if needed

export default function Cart() {
  const { cartItems, removeFromCart, getTotal } = useCart();

  // Show message if cart is empty
  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      <ul>
        {cartItems.map((item) => (
          <li key={item._id} className="mb-4 border-b pb-2 flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price per item: ₹{item.price}</p>
            </div>
            <div>
              <p className="font-bold">₹{item.product.price * item.quantity}</p>

              <button
                onClick={() => removeFromCart(item._id)}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-lg font-bold">Total: ₹{getTotal()}</h3>
    </div>
  );
}
