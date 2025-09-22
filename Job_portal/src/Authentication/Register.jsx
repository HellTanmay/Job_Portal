import React, { useState, useContext } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import { LoginContext } from './Auth_context';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import {toast} from 'react-toastify'

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: '' });
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res =await axiosInstance.post('/auth/register', formData);
      const data = res.data;
      console.log(data)
      if (res.status=== 200) {
        toast.success(data.message)
        login({ username: data.user.username, role: data.user.role });
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[700px] m-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        
        {/* Role Selection */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            type="button"
            onClick={() => selectRole('user')}
            className={`py-2 px-4 rounded ${formData.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => selectRole('employer')}
            className={`py-2 px-4 rounded ${formData.role === 'employer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Employer
          </button>
        </div>

        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Register
        </button>
      </form>
    </Layout>
  );
};

export default Register;
