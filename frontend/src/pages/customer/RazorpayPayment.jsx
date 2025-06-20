import React, { useState } from 'react';
import axios from 'axios';

const RazorpayPayment = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Failed to load Razorpay SDK. Are you online?');
      setLoading(false);
      return;
    }

    try {
      // Create order on backend
      const { data: order } = await axios.post('/api/payment/create-order', {
        amount: amount * 100, // amount in paise
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Your Company Name',
        description: 'Test Transaction',
        handler: async function (response) {
          // Send payment details to backend for verification
          try {
            const verifyRes = await axios.post('/api/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.status === 'success') {
              alert('Payment successful!');
            } else {
              alert('Payment verification failed.');
            }
          } catch (error) {
            alert('Error verifying payment.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      alert('Server error, unable to create order.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Pay with Razorpay</h2>
      <input
        type="number"
        placeholder="Enter amount in INR"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default RazorpayPayment;
