import { useState } from "react";

import Layout from "./Layout/Layout";
import axiosInstance from "./utils/axiosInstance";


function UploadResume() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const submitResume = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axiosInstance.post("/job/upload", formData);
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
            Upload Resume
          </h2>
          <div className="space-y-4">
            <input
              type="file"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
            <button
              onClick={submitResume}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Recommended Jobs Grid */}
        {result && (
          <div className="w-full max-w-6xl">
            <h3 className="text-2xl text-center font-semibold text-gray-700 mb-6">
              Recommended Jobs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {result.similar_jobs.map((data, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-md bg-gray-50 shadow hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-medium text-blue-600">
                    {data?.title}
                  </h4>
                  <p className="text-gray-600 mt-1">{data?.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UploadResume;
