import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo(1).png';

function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please enter both email and password.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }

    const apiKey = `${import.meta.env.VITE_API_URL}/admin/login`;

    try {
      setLoading(true);
      const response = await axios.post(apiKey, formData, {withCredentials: true});
      
      if(response.status === 200 || response.status === 201){
        localStorage.setItem("admin", JSON.stringify(response?.data)); 
      }
     
      const adminData = response.data;
      navigate('/dashboard', { state: { adminData } });

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      Swal.fire({
        title: 'Authentication Failed',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#ebb661] opacity-5 transform rotate-45">
          <div className="grid grid-cols-12 grid-rows-12 gap-4 h-full">
            {Array(144).fill().map((_, i) => (
              <div key={i} className="bg-white rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative circle elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-50 rounded-full opacity-20"></div>
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-amber-100 rounded-full opacity-20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-4xl p-6">
        {/* Left side - Brand info */}
        {/* <div className="hidden md:flex flex-col items-center md:items-start text-center md:text-left p-8 md:w-1/2">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Admin Portal</h1>
          <p className="text-lg text-[#ebb661] mb-8">Securely access your administration dashboard</p>
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-[#ebb661]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-amber-900">Secure Access</h3>
                <p className="text-sm text-amber-700">End-to-end encrypted connection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-[#ebb661]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-amber-900">Full Control</h3>
                <p className="text-sm text-amber-700">Manage all system settings</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-amber-50">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-100 rounded-full blur"></div>
                <div className="relative">
                  {/* <h1 className='text-2xl font-medium'>Pora Infratech</h1> */}
                  <img src={logo} alt="Logo" className="h-24 w-24 object-contain rounded-full border-4 border-amber-100 p-1" />
                </div>
              </div>
            </div>
            
            {/* <h2 className="text-2xl font-bold text-center text-amber-800 mb-8">Administrator Login</h2> */}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block  font-medium text-amber-900 " htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#ebb661]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 bg-amber-50 border border-amber-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-medium text-amber-900 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#ebb661]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 bg-amber-50 border border-amber-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    required
                  />
                </div>
              </div>
              
              {/* <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#ebb661] focus:ring-amber-500 border-amber-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-amber-800">
                    Remember me
                  </label>
                </div>
                <div className="text-[#ebb661] hover:text-amber-800 cursor-pointer transition-colors">
                  Forgot password?
                </div>
              </div> */}
              
              <button
                type="submit"
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#ebb661] hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Sign In
                  </span>
                )}
              </button>
            </form>
          </div>
          
          <p className="mt-6 text-center text-sm text-[#ebb661]">
            Need help accessing your account? 
            <a href="tel:9336969289" className="ml-1 font-medium text-amber-800 hover:text-amber-900">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;