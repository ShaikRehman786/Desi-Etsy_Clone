// src/components/RazorpayButton.js
import React from 'react';

export default function RazorpayButton({ amount }) {
  const handlePayment = async () => {
    try {
      // 1. Create Order from your backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100 }) // Convert to paise
      });

      const order = await res.json();

      // 2. Load Razorpay script
      const scriptLoaded = await new Promise((resolve) => {
        if (document.getElementById('razorpay-script')) return resolve(true);

        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK');
        return;
      }

      // 3. Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ Correct Razorpay Key for Vite
        amount: order.amount,
        currency: order.currency,
        name: 'Your Store',
        description: 'Purchase Order',
        order_id: order.id,
        handler: async function (response) {
          // 4. Verify Payment on Backend
          const verifyRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });

          const verifyData = await verifyRes.json();

          if (verifyData.status === 'success') {
            alert('Payment Successful!');
          } else {
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Your store address'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Error initiating payment.');
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: '10px 20px',
        background: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '6px'
      }}
    >
      Pay ₹{amount}
    </button>
  );
}
