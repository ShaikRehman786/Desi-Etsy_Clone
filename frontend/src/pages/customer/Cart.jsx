import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; // ✅ assuming you have this

export default function Cart() {
  const { cartItems, removeFromCart, getTotal, updateQuantity } = useCart();
  const { user } = useAuth(); // ✅ Get the current logged-in user
  const navigate = useNavigate();

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Error removing item");
    }
  };

  const handleQuantityChange = async (cartItemId, action) => {
    try {
      await updateQuantity(cartItemId, action);
      toast.success("Cart updated");
    } catch (error) {
      console.error("Failed to update cart:", error);
      toast.error("Failed to update cart");
    }
  };

  // Filter out cart items with missing product info
  const validCartItems = cartItems.filter((item) => item.product !== null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {validCartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {validCartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-600">
                  ₹{item.product.price} x {item.quantity}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, "decrease")}
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    disabled={item.quantity === 1}
                    aria-label={`Decrease quantity of ${item.product.name}`}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, "increase")}
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    aria-label={`Increase quantity of ${item.product.name}`}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <p className="font-semibold">
                  ₹{item.product.price * item.quantity}
                </p>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Cart Total and Checkout */}
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-xl font-bold">Total: ₹{getTotal()}</h3>
            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please log in to proceed to checkout");
                  navigate("/login");
                } else {
                  navigate("/checkout");
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
