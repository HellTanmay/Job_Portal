import { useState } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import axiosInstance from '../utils/axiosInstance';

function AddJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');


  const submitJob = async () => {
    try {
      const res = await axiosInstance.post('/job/jobs', {
        title,
        description,
        company,
        location,
        salary,
        
      });
      alert('Job added!');
      setTitle('');
      setDescription('');
      setCompany('');
      setLocation('');
      setSalary('');
    
    } catch (error) {
      console.error(error);
      alert('Error adding job');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Job</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
         
            <button
              onClick={submitJob}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Add Job
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddJob;
