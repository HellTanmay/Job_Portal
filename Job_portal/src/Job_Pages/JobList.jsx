import { useEffect, useState } from 'react';
import { 
  MapPinIcon, 
  BuildingOfficeIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  BriefcaseIcon 
} from '@heroicons/react/24/outline'; // Assuming Heroicons are installed
import Layout from '../Layout/Layout';
import axiosInstance from '../utils/axiosInstance';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('job/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">Available Jobs</h2>
          <p className="text-center text-gray-600 mb-12">Discover exciting opportunities near you</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <div
                  key={job.id || index} // Use job.id if available for better key
                  className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                >
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          {job.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <span>Salary: {job.salary}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <span>Start Date: {job.startDate ? new Date(job.startDate).toLocaleDateString() : 'TBD'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 transform hover:scale-105">
                      View Details & Apply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No jobs available at the moment.</p>
                <p className="text-gray-400 mt-2">Check back later for new opportunities!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default JobList;
