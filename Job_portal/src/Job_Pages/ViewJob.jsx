import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  BuildingOfficeIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  BriefcaseIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  UserIcon,  // For posted by and experience
  UserGroupIcon  // For applicants
} from '@heroicons/react/24/outline';
import Layout from '../Layout/Layout';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

function ViewJob() {
  const { id } = useParams(); // Get job ID from URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);  // For apply button loading state

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`job/jobs/${id}`); // Adjust endpoint if needed
        setJob(res.data); // Assuming API returns the job object (populated if needed)
      } catch (err) {
        console.error(err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleApply = async () => {
    if (applying) return;  // Prevent multiple clicks
    setApplying(true);
    try {
      const res = await axiosInstance.put(`job/jobs/${id}`);  // Assuming PUT adds current user to applied
      if (res.status === 200) {
        toast.success(res?.data?.message || 'Application submitted successfully!');
        // Optionally refetch job to update applicant_count
        const updatedRes = await axiosInstance.get(`job/jobs/${id}`);
        setJob(updatedRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  // Helper to format salary
  const formatSalary = (salary) => {
    if (!salary || salary === 0) return 'Not specified';
    return `$${salary.toLocaleString()}`;
  };

  // Helper to format job type and experience
  const formatTypeOrLevel = (value) => {
    if (!value) return 'Not specified';
    return value.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper to format date (for createdAt and start_date)
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // New: Helper for start_date (uses formatDate)
  const formatStartDate = (startDate) => {
    if (!startDate) return 'Not specified';
    return formatDate(startDate);
  };

  // New: Helper for duration
  const formatDuration = (duration) => {
    if (!duration || duration === 0) return 'Not specified';
    return `${duration} year${duration > 1 ? 's' : ''}`;
  };

  // Helper to parse string to list (e.g., comma-separated skills or requirements)
  const parseToList = (text) => {
    if (!text) return [];
    return text.split(',').map(item => item.trim()).filter(item => item);
  };

  // Helper to check if user has applied (assuming current user ID is available, e.g., from context/store)
  // For now, placeholder - implement based on your auth state
  const hasApplied = () => {
    // Example: return job.applied.some(app => app.applicant.toString() === currentUser Id);
    return false;  // Placeholder - replace with actual logic
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <CheckCircleIcon className="h-12 w-12 mx-auto" /> {/* Or use an error icon */}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
            <button
              onClick={() => navigate(-1)} // Go back
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl mt-4"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
            <button
              onClick={() => navigate(-1)} // Go back
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl"
            >
              Go Back to Jobs
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 font-medium transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>

          {/* Job Details Card */}
          <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-200">
            {/* Job Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-lg text-gray-600 flex items-center mt-1">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    {job.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Meta Info - Expanded Grid for All Fields Including New Ones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">Location: {job.location}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                <CurrencyDollarIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">Salary: {formatSalary(job.salary)}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                <BriefcaseIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">Type: {formatTypeOrLevel(job.jobType)}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                <UserGroupIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">Applicants: {job.applicant_count || 0}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">Posted: {formatDate(job.createdAt)}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">Experience: {formatTypeOrLevel(job.experience)}</span>
              </div>
              {/* New: Start Date */}
              <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">Start Date: {formatStartDate(job.start_date)}</span>
              </div>
              {/* New: Duration */}
              <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />  {/* Reuse icon; import ClockIcon for distinction if needed */}
                <span className="font-medium">Duration: {formatDuration(job.duration)}</span>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">{job.requirements}</p>
                  {/* If comma-separated, render as list */}
                  {parseToList(job.requirements).length > 0 && (
                    <ul className="space-y-2">
                      {parseToList(job.requirements).map((req, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {parseToList(job.skills).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Posted By */}
            {job.postedBy && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Posted By</h2>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{job.postedBy.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600">{job.postedBy.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleApply}
                disabled={applying || hasApplied()}  // Disable if applying or already applied
                className={`flex-1 py-3 px-8 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 transform hover:scale-105 ${
                  applying || hasApplied()
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500'
                }`}
              >
                {applying ? 'Applying...' : hasApplied() ? 'Applied!' : 'Apply Now'}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 flex-1"
              >
                Save Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ViewJob;
