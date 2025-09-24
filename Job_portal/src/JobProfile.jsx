import { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"; // Assuming Heroicons are installed
import Layout from "../Layout/Layout";
import axiosInstance from "../utils/axiosInstance";

function JobProfile() {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    about: "",
    fullname: "",
    email: "",
      country: "",
    city: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Assuming an endpoint like '/user/profile' to fetch current user's profile
        const res = await axiosInstance.get("/auth/profile"); // Adjust endpoint as needed
        setProfileData(res.data.data);
        console.log(profileData)
        // Pre-populate form if editing
        if (res.data) {
          const fullname =res.data.data.firstName ;
          setFormData({
            username: res.data.data?.username || "",
            about: res.data.data?.about || "",
            fullname: fullname,
            email: res.data.data?.email || "",
            address: {
              country: res.data?.data?.address?.country || "",
              city: res.data?.data?.address?.city || "",
            },
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setResult(null); // Clear any previous messages
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setResumeFile(null);
    setResult(null);
    // Reset form to original data
    if (profileData) {
          const fullname =res.data.data.firstName ;

       setFormData({
            username: res.data.data?.username || "",
            about: res.data.data?.about || "",
            fullname: fullname,
            email: res.data.data?.email || "",
            address: {
              country: res.data?.data?.address?.country || "",
              city: res.data?.data?.address?.city || "",
            },
          });
    }
  };
console.log(formData)
  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();

    if (resumeFile) {
      data.append("resume", resumeFile);
    }
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axiosInstance.put("/auth/profile/edit", data);
      setResult(res.data.data);
      console.log(res.data);

      // Update profile data on success
      setProfileData({ ...profileData, ...formData });

      // Switch back to view mode
      setIsEditing(false);
      setResumeFile(null);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !profileData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
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
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {isEditing ? (
              // Edit Mode: Form
              <form onSubmit={submitForm} className="space-y-8">
                {/* Profile Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <PencilIcon className="h-6 w-6 mr-2 text-blue-600" />
                    Edit Profile
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update your information below.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="janesmith"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        About
                      </label>
                      <textarea
                        name="about"
                        id="about"
                        rows="4"
                        placeholder="Write a few sentences about yourself"
                        value={formData.about}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="resume"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Resume
                      </label>
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                      />
                      {profileData?.resumeUrl && (
                        <p className="text-sm text-gray-500 mt-1">
                          Current:{" "}
                          <a
                            href={profileData.resumeUrl}
                            className="text-blue-600 hover:underline"
                          >
                            Download Resume
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Country
                      </label>
                      <select
                        name="country"
                        id="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      >
                        <option value="">Select Country</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Mexico">Mexico</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 disabled:opacity-50 transition duration-200 flex items-center space-x-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                    {error}
                  </div>
                )}
                {result && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                    {result.message || "Profile updated successfully!"}
                  </div>
                )}
              </form>
            ) : (
              // View Mode: Display Profile
              <>
                <div className="flex justify-between items-start mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <UserIcon className="h-8 w-8 mr-3 text-blue-600" />
                    My Profile
                  </h1>
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Profile Summary Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* About & Resume Section */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="h-6 w-6 mr-2 text-gray-600" />
                        About Me
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {profileData?.about ||
                          "No about information provided yet."}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-600" />
                        Resume
                      </h3>
                      {profileData?.resumeUrl ? (
                        <a
                          href={profileData.resumeUrl}
                          download
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200"
                        >
                          <DocumentTextIcon className="h-5 w-5 mr-2" />
                          Download Resume
                        </a>
                      ) : (
                        <p className="text-gray-500">No resume uploaded yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Personal Info Section */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Personal Information
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-700">
                          <UserIcon className="h-5 w-5 mr-3 text-blue-600" />
                          <span className="font-medium">
                            {profileData?.firstName} {profileData?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <EnvelopeIcon className="h-5 w-5 mr-3 text-blue-600" />
                          <span>
                            {profileData?.email || "No email provided"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPinIcon className="h-5 w-5 mr-3 text-blue-600" />
                          <span>
                            {profileData?.city},{" "}
                            {profileData?.country || "No location provided"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                          <span className="font-medium">
                            @{profileData?.username || "No username set"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default JobProfile;
