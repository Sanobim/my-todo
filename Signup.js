import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope 
} from 'react-icons/fa';

function Signup({ darkMode = false, onSignup }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', data);

      // Call parent signup handler
      onSignup(response.data.token, response.data.username);

      // Redirect to todos page
      navigate('/todos');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`
        min-h-screen flex items-center justify-center p-4
        ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-brand-50 to-white'}
      `}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`
          w-full max-w-md p-8 space-y-6 rounded-3xl shadow-2xl
          ${darkMode 
            ? 'bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-gray-700' 
            : 'bg-white bg-opacity-80 backdrop-blur-sm border border-gray-100'}
        `}
      >
        {/* Brand Header */}
        <div className="text-center">
          <h1 className={`
            text-4xl font-bold mb-2
            ${darkMode ? 'text-brand-200' : 'text-brand-700'}
          `}>
            TaskFlow
          </h1>
          <p className={`
            text-sm mb-6
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            Create your account and start organizing!
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="bg-red-500 text-white p-3 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className={`
                ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                ${errors.username ? 'text-red-500' : ''}
              `} />
            </div>
            <input
              {...register('username', { 
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                }
              })}
              type="text"
              placeholder="Username"
              className={`
                w-full pl-10 p-3 rounded-lg transition-all duration-300
                ${darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-500' 
                  : 'bg-brand-50 text-gray-800 placeholder-gray-500'}  
                ${errors.username ? 'border-2 border-red-500' : 'border border-transparent'}
                focus:outline-none focus:ring-2 focus:ring-brand-500
              `}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className={`
                ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                ${errors.email ? 'text-red-500' : ''}
              `} />
            </div>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              placeholder="Email"
              className={`
                w-full pl-10 p-3 rounded-lg transition-all duration-300
                ${darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-500' 
                  : 'bg-brand-50 text-gray-800 placeholder-gray-500'}  
                ${errors.email ? 'border-2 border-red-500' : 'border border-transparent'}
                focus:outline-none focus:ring-2 focus:ring-brand-500
              `}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className={`
                ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                ${errors.password ? 'text-red-500' : ''}
              `} />
            </div>
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`
                w-full pl-10 pr-10 p-3 rounded-lg transition-all duration-300
                ${darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-500' 
                  : 'bg-brand-50 text-gray-800 placeholder-gray-500'}  
                ${errors.password ? 'border-2 border-red-500' : 'border border-transparent'}
                focus:outline-none focus:ring-2 focus:ring-brand-500
              `}
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </motion.button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className={`
                ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                ${errors.confirmPassword ? 'text-red-500' : ''}
              `} />
            </div>
            <input
              {...register('confirmPassword', { 
                required: 'Confirm Password is required',
                validate: (value) => value === watch('password') || 'Passwords do not match'
              })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className={`
                w-full pl-10 pr-10 p-3 rounded-lg transition-all duration-300
                ${darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-500' 
                  : 'bg-brand-50 text-gray-800 placeholder-gray-500'}  
                ${errors.confirmPassword ? 'border-2 border-red-500' : 'border border-transparent'}
                focus:outline-none focus:ring-2 focus:ring-brand-500
              `}
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </motion.button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full p-3 rounded-xl transition-all duration-300 shadow-soft
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
              ${darkMode 
                ? 'bg-brand-600 text-white hover:bg-brand-500' 
                : 'bg-brand-500 text-white hover:bg-brand-600'}
            `}
          >
            Sign Up
          </motion.button>
        </form>

        {/* Login Link */}
        <motion.div className="text-center">
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Already have an account? {' '}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/login')}
              className={`
                font-bold underline
                ${darkMode 
                  ? 'text-brand-300 hover:text-brand-200' 
                  : 'text-brand-600 hover:text-brand-700'}
              `}
            >
              Login
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Signup;
