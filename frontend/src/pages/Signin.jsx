import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your agent dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              onChange={handleChange} 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
              required 
            />
          </div>

          {/* Password with Toggle */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <a href="/signup" className="text-blue-600 font-semibold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Signin;