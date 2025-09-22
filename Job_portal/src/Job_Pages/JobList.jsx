import { useEffect, useState } from 'react';

import Layout from '../Layout/Layout';
import axiosInstance from '../utils/axiosInstance';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axiosInstance.get('job/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Available Jobs</h2>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-white shadow-md rounded-lg p-6">
          {jobs.map((job, index) => (
            <div key={index} className="p-4 cursor-pointer rounded-md hover:shadow-lg transition-shadow duration-300 bg-gray-50">
              <h4 className="text-xl font-semibold text-blue-600">{job.title}</h4>
              <p className="text-gray-700 mt-2">{job.description}</p>
              <p>Salary: {job.salary}</p>
            </div>
            
          ))}
          {jobs.length === 0 && (
            <p className="text-center text-gray-500 mt-4 col-span-full">No jobs available at the moment.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default JobList;
