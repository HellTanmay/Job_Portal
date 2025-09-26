import { useState } from 'react';
import Layout from '../Layout/Layout';
import axiosInstance from '../utils/axiosInstance';

function AddJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [requirements, setRequirements] = useState('');
  const [jobType, setJobType] = useState('full-time');
  const [experience, setExperience] = useState('entry');
  const [skills, setSkills] = useState('');
  const [startDate, setStartDate] = useState('');  // New: For start_date
  const [duration, setDuration] = useState(1);     // New: For duration (default 1)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/job/jobs', {
        title,
        description,
        company,
        location,
        salary,
        requirements,
        jobType,
        experience,
        skills,
        start_date: startDate ? new Date(startDate) : undefined,  // Convert to Date
        duration: parseInt(duration, 10),  // Ensure Number
      });
      alert('Job added successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setCompany('');
      setLocation('');
      setSalary('');
      setRequirements('');
      setJobType('full-time');
      setExperience('entry');
      setSkills('');
      setStartDate('');
      setDuration(1);
    } catch (error) {
      console.error(error);
      alert('Error adding job');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Job</h2>
            <p className="text-gray-600">Fill in the details to post a new job opportunity.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Existing fields: title, description, company, location, salary, jobType, experience, requirements, skills */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Senior Software Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what the job entails..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                id="company"
                type="text"
                placeholder="e.g., TechCorp Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                id="location"
                type="text"
                placeholder="e.g., Remote or New York, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                Salary (optional)
              </label>
              <input
                id="salary"
                type="text"
                placeholder="e.g., $80,000 - $120,000 annually"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                id="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (5+ years)</option>
              </select>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                id="requirements"
                placeholder="List the key requirements, qualifications, or must-have skills..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Skills (comma-separated)
              </label>
              <textarea
                id="skills"
                placeholder="e.g., JavaScript, React, Node.js, SQL"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
              />
            </div>

            {/* New: Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date (optional)
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* New: Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (years, optional - default: 1)
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                step="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md"
            >
              Add Job
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AddJob;
