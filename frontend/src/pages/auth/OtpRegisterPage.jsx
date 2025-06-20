import { useState } from "react";
import { registerUser, verifyOtp } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OtpRegisterPage() {
  const { login } = useAuth();
  const [step, setStep] = useState(1); // Step 1: Registration, Step 2: OTP
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // or "artisan"
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      toast.success("OTP sent to your email/phone");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
    console.log("Verification Response:", res);
    login(res); // ✅ store full response that includes role

      toast.success("Registration & OTP verified!");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        {step === 1 ? "Register" : "Verify OTP"}
      </h2>

      {step === 1 ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="customer">Customer</option>
            <option value="artisan">Artisan</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Register & Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>
      )}

      <ToastContainer />
    </div>
  );
}
