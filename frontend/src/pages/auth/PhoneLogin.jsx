// src/pages/PhoneLogin.jsx
import { useState } from "react";
// import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../";
import { toast } from "react-toastify";


export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const sendOTP = async () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => sendOTP()
    });

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier);
      setConfirmation(confirmationResult);
      toast.success("OTP sent!");
    } catch (err) {
      toast.error("Failed to send OTP");
      console.error(err);
    }
  };

  const verifyOTP = async () => {
    try {
      const result = await confirmation.confirm(otp);
      const token = await result.user.getIdToken();
      toast.success("Phone verified!");
      
      // Send token to backend
      await fetch("/api/auth/phone-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: result.user.phoneNumber }),
      });
    } catch (err) {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-sm mx-auto">
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone" className="border p-2 w-full" />
      <button onClick={sendOTP} className="bg-blue-600 text-white p-2 w-full">Send OTP</button>
      <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" className="border p-2 w-full" />
      <button onClick={verifyOTP} className="bg-green-600 text-white p-2 w-full">Verify OTP</button>
      <div id="recaptcha-container"></div>
    </div>
  );
}


