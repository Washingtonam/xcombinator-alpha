import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Hash, Lock } from 'lucide-react';
import axios from 'axios'; // Import axios

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nin: '',
    fullName: '',
    phone: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Constraint: NIN must be only 11 digits
    if (name === 'nin') {
      value = value.replace(/[^0-9]/g, '').slice(0, 11);
    }

    setFormData({ ...formData, [name]: value });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (formData.nin.length !== 11) return alert("NIN must be 11 digits.");
        if (formData.password.length < 8) return alert("Password must be 8+ chars.");

        try {
            const apiBase = import.meta.env.VITE_API_URL || (typeof process !== 'undefined' ? process.env.REACT_APP_API_URL : undefined);
            if (!apiBase) {
                throw new Error('VITE_API_URL or REACT_APP_API_URL must be defined in your environment variables');
            }
            const response = await axios.post(`${apiBase}/api/users/register`, formData);
            
            alert("Account created successfully!");
            console.log(response.data);
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Registration failed");
        }
    };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NIN Field - Enforced Digits */}
          <div className="relative">
            <Hash className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              name="nin" 
              value={formData.nin}
              placeholder="11-Digit NIN" 
              onChange={handleChange} 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
            />
          </div>

          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input type="text" name="fullName" placeholder="Full Name" 
              onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input type="tel" name="phone" placeholder="Phone Number" 
              onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input type="email" name="email" placeholder="Email Address" 
              onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
          </div>

          {/* Password - Enforced Length */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password (min 8 chars)" 
              onChange={handleChange} className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-200">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;