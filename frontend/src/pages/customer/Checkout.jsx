import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ import auth context
import { toast } from "react-toastify";

export default function Checkout() {
  const { cartItems, getTotal, refreshCart } = useCart();
  const { user } = useAuth(); // ✅ get user with token
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePaymentSuccess = async (response) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(response),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Payment successful! Order placed.");
        await refreshCart();
        navigate("/orders");
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during payment verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.warn("Cart is empty");
      return;
    }

    setLoading(true);

    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ amount: getTotal() * 100 }),
        }
      );

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CraftKart",
        description: "Order Payment",
        order_id: orderData.id,
        handler: (response) => handlePaymentSuccess(response),
        prefill: {
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", (response) => {
        toast.error("Payment failed: " + response.error.description);
        setLoading(false);
      });

      paymentObject.on("popup.closed", () => {
        setLoading(false);
      });

      paymentObject.open();
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="mb-4">
            {cartItems.map(({ product, quantity }, idx) => (
              <li
                key={product ? product._id : `missing-${idx}`}
                className="border-b py-2 flex justify-between"
              >
                <span>
                  {product ? product.name : "Product not found"} × {quantity}
                </span>
                <span>₹{product ? product.price * quantity : 0}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>₹{getTotal()}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Processing..." : "🛒 Pay with Razorpay"}
          </button>
        </>
      )}
    </div>
  );
}
