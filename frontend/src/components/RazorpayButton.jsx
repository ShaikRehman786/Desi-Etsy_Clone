// src/components/RazorpayButton.js
import React from 'react';

export default function RazorpayButton({ amount }) {
  const handlePayment = async () => {
    // 1. Create Order
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount * 100 }) // Convert to paise
    });

    const order = await res.json();

    // 2. Configure Razorpay
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // from .env
      amount: order.amount,
      currency: order.currency,
      name: 'Your Store',
      description: 'Purchase Order',
      order_id: order.id,
      handler: async function (response) {
        const verifyRes = await fetch('/api/payment/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        });

        const verifyData = await verifyRes.json();

        if (verifyData.status === 'success') {
          alert('Payment Successful!');
          // Optional: Redirect or update UI
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
  };

  return (
    <button onClick={handlePayment} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}>
      Pay ₹{amount}
    </button>
  );
}
