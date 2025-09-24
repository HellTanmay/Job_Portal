import React, { useState, useContext } from 'react';
import { EyeIcon, EyeSlashIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'; // Assuming Heroicons are installed
import Layout from '../Layout/Layout';
import { LoginContext } from './Auth_context';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', formData);
      const data = res.data;
      console.log(data);
      if (res.status === 200) {
        toast.success(data.message);
        login({ username: data.user.username, role: data.user.role });
        navigate('/profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">Join us today as a User or Employer</p>
          </div>
          <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Select your role
                </label>
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => selectRole('user')}
                    className={`flex items-center justify-center py-3 px-6 rounded-xl border-2 transition duration-200 transform hover:scale-105 ${
                      formData.role === 'user'
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <UserIcon className={`h-5 w-5 mr-2 ${formData.role === 'user' ? 'text-white' : 'text-gray-500'}`} />
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => selectRole('employer')}
                    className={`flex items-center justify-center py-3 px-6 rounded-xl border-2 transition duration-200 transform hover:scale-105 ${
                      formData.role === 'employer'
                        ? 'bg-green-500 text-white border-green-500 shadow-md'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <BuildingOfficeIcon className={`h-5 w-5 mr-2 ${formData.role === 'employer' ? 'text-white' : 'text-gray-500'}`} />
                    Employer
                  </button>
                </div>
                {formData.role && (
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Selected: {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                  </p>
                )}
              </div>

              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.role}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            {/* Alternative Login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a
                  href="#"
                  className="font-medium text-purple-600 hover:text-purple-500"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
