import { useEffect, useState } from 'react';
import { 
  MapPinIcon, 
  BuildingOfficeIcon, 
  CurrencyDollarIcon, 
  BriefcaseIcon,
  UserGroupIcon,
  CalendarIcon  // For start_date and duration
} from '@heroicons/react/24/outline';
import Layout from '../Layout/Layout';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [recommendJobs, setRecommendJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Helper function to truncate description to 100 words
  const truncateDescription = (description, wordLimit = 100) => {
    if (!description) return '';
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  // Helper function to format job type (e.g., 'full-time' -> 'Full Time')
  const formatJobType = (jobType) => {
    if (!jobType) return 'Not specified';
    return jobType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to format salary
  const formatSalary = (salary) => {
    if (!salary || salary === 0) return 'Salary: Not specified';
    return `Salary: $${salary.toLocaleString()}`;
  };

  // New: Helper for start_date
  const formatStartDate = (startDate) => {
    if (!startDate) return 'Start Date: Not specified';
    return `Start Date: ${new Date(startDate).toLocaleDateString()}`;
  };

  // New: Helper for duration
  const formatDuration = (duration) => {
    if (!duration || duration === 0) return 'Duration: Not specified';
    return `Duration: ${duration} year${duration > 1 ? 's' : ''}`;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('job/jobs');
        if (res.status === 200) {
          setJobs(res.data.jobs || res.data);  // Adjust based on backend response structure
        }
        const recres = await axiosInstance.get('job/recommended-job');
        if (recres.status === 200) {
          setRecommendJobs(recres.data.data.similar_jobs || []);
        }
      } catch (err) {
        console.error(err);
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

  const renderJobCard = (job, index) => (
    <div
      key={job._id || index}  // Use _id for MongoDB consistency
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

      {/* Job Details Grid - Now includes start_date and duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
          <span>{formatSalary(job.salary)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
          <span>{formatJobType(job.jobType)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <UserGroupIcon className="h-5 w-5 mr-2 text-gray-400" />
          <span>{job.applicant_count || 0} applicants</span>
        </div>
        {/* New: Start Date */}
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
          <span>{formatStartDate(job.start_date)}</span>
        </div>
        {/* New: Duration */}
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />  {/* Reuse; or use ClockIcon */}
          <span>{formatDuration(job.duration)}</span>
        </div>
      </div>

      {/* Truncated Description */}
      <div className="mt-4">
        <p className="text-gray-700 leading-relaxed">
          {truncateDescription(job.description)}
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate(`/viewjob/${job._id}`)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 transform hover:scale-105"
        >
          View Details & Apply
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {recommendJobs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">Recommended Jobs</h2>
              <p className="text-center text-gray-600 mb-8">Discover exciting opportunities near you</p>
              <div className="space-y-6">
                {recommendJobs.map((job, index) => renderJobCard(job, index))}
              </div>
            </div>
          )}

          {/* Available Jobs Section */}
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">
            {recommendJobs.length > 0 ? 'All Available Jobs' : 'Available Jobs'}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {recommendJobs.length > 0 
              ? 'Browse all job opportunities' 
              : 'Discover exciting opportunities near you'
            }
          </p>
          <div className="space-y-6">
            {jobs.length > 0 ? (
              jobs.map((job, index) => renderJobCard(job, index))
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
