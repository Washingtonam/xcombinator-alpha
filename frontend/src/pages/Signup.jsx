import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);
      alert('Registration Successful!');
      console.log(response.data);
    } catch (error) {
      alert('Error: ' + error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-5">Create Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input className="border p-2" placeholder="Full Name" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
        <input className="border p-2" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input className="border p-2" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button className="bg-blue-600 text-white p-2 rounded">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;