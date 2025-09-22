import { useState } from "react";
import Layout from "../Layout/Layout";
import axiosInstance from "../utils/axiosInstance";

function JobProfile() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
  });

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitResume = async () => {
    const data = new FormData();
    data.append("resume", file);
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axiosInstance.post("/job/upload", data);
      setResult(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
        {/* Upload Box */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 mb-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Upload Resume & Info
          </h2>

          {/* User Info */}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
            <input
              type="text"
              name="experience"
              placeholder="Experience (e.g., 2 years)"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />

            {/* Resume Upload */}
            <input
              type="file"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />

            {/* Submit */}
            <button
              onClick={submitResume}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Submit
            </button>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-green-100 text-green-700 rounded-md">
            <p>Upload successful!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default JobProfile;
