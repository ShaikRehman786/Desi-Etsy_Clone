import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const errs = {};
    if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format 📭';
    if (password.length < 6) errs.password = 'Too short! At least 6 chars 🔐';
    return errs;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let user;

    try {
      setIsLoading(true);
      const res = await API.post('/auth/login', { email, password });
      const { token } = res.data;
      user = res.data.user;

      localStorage.setItem('token', token);
      await login(user, token);

      toast.success('🎉 Welcome back!');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Login Failed 😬');
    } finally {
      setIsLoading(false);
      if (user) {
        navigate(user.role === 'Artisan' ? '/artisan/dashboard' : '/');
      }
    }
  };

  // Google login handler
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name, picture, sub: googleId } = decoded;

      const res = await API.post('/auth/google-login', {
        email,
        name,
        avatar: picture,
        googleId,
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      await login(user, token);

      toast.success(`🎉 Welcome ${user.name}`);
      navigate(user.role === 'Artisan' ? '/artisan/dashboard' : '/');
    } catch (error) {
      console.error(error);
      toast.error('Google login failed ❌');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google auth was cancelled or failed ❌');
  };

  return (
    <motion.form
      onSubmit={handleLogin}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-blue-600">🔐 Log In</h2>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <div className={`flex items-center border rounded px-3 py-2 focus-within:ring-2 ${
  errors.email ? 'ring-red-500' : 'focus-within:ring-blue-500'
}`}>
          <Mail className="w-5 h-5 text-gray-500 mr-2" />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full focus:outline-none"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
            disabled={isLoading}
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              className="text-sm text-red-600 mt-1 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <AlertCircle className="w-4 h-4" /> {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block mb-1 font-medium">Password</label>
        <div className={`flex items-center border rounded px-3 py-2 focus-within:ring-2 ${
          errors.password ? 'ring-red-500' : 'focus-within:ring-blue-500'
        }`}>
          <Lock className="w-5 h-5 text-gray-500 mr-2" />
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full focus:outline-none"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
            disabled={isLoading}
          />
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p
              className="text-sm text-red-600 mt-1 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <AlertCircle className="w-4 h-4" /> {errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 font-semibold text-white rounded-lg transition-colors ${
          isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Logging you in...' : 'Login'}
      </button>

      {/* Divider */}
      <div className="text-center text-gray-500">or</div>

      {/* Google Login */}
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        width="100%"
      />
    </motion.form>
  );
}

export default LoginPage;
