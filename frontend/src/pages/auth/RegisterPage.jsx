import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, UserCog, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import API from '../../utils/api';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Customer' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Don’t be shy — tell us your name!';
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Hmm, that email looks odd 🤔';
    if (form.password.length < 6) newErrors.password = 'Password too weak! Beef it up 💪';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post('/auth/register', form);
      toast.success('🎉 Registered Successfully!');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Oops! Something went wrong.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email } = decoded;

      const res = await API.post('/auth/google', { name, email });
      toast.success('🎉 Google login successful!');
      navigate(res.data.user.role === 'Artisan' ? '/artisan/dashboard' : '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed 😢');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-xl space-y-6 bg-white ${
        shake ? 'animate-shake' : ''
      }`}
      noValidate
    >
      <h2 className="text-3xl font-bold text-center text-blue-700">🧠 Register Smartly</h2>

      {['name', 'email', 'password'].map((field) => (
        <div key={field}>
          <label htmlFor={field} className="block mb-1 font-medium capitalize">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <div
            className={`flex items-center gap-2 border rounded px-3 py-2 transition ring-1 ${
              errors[field]
                ? 'ring-red-500'
                : 'focus-within:ring-2 focus-within:ring-blue-500'
            }`}
          >
            {field === 'name' && <User className="w-5 h-5 text-gray-500" />}
            {field === 'email' && <Mail className="w-5 h-5 text-gray-500" />}
            {field === 'password' && <Lock className="w-5 h-5 text-gray-500" />}
            <input
              id={field}
              name={field}
              type={field === 'password' ? 'password' : field}
              placeholder={
                field === 'name'
                  ? 'e.g. Frodo Baggins 🧝‍♂️'
                  : field === 'email'
                  ? 'e.g. you@middleearth.com'
                  : 'Minimum 6 characters'
              }
              value={form[field]}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full focus:outline-none"
            />
          </div>
          <AnimatePresence>
            {errors[field] && (
              <motion.p
                className="text-sm text-red-600 mt-1 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <AlertCircle className="w-4 h-4" /> {errors[field]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}

      <div>
        <label htmlFor="role" className="block mb-1 font-medium">Role</label>
        <div className="flex items-center gap-2 border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <UserCog className="w-5 h-5 text-gray-500" />
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full bg-transparent focus:outline-none"
          >
            <option value="Customer">🛍️ Customer</option>
            <option value="Artisan">🎨 Artisan</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 text-white font-semibold rounded-xl transition-all duration-300 ${
          isSubmitting
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
        }`}
      >
        {isSubmitting ? 'Loading magic... ✨' : 'Register'}
      </button>

      <div className="mt-6 text-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google sign-in failed.')}
        />
      </div>
    </motion.form>
  );
}

export default RegisterPage;
