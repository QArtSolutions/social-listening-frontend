import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import Select from "react-select";
import axios from "axios";
import { getBackendUrl } from "../../utils/apiUrl";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    competitors: [],
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const apiUrl = getBackendUrl();
      try {
        const response = await axios.post(`${apiUrl}/api/users/details`, { userId });
        const userDetails = response.data;
        setFormData((prevData) => ({
          ...prevData,
          name: userDetails.name,
          email: userDetails.email,
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
    checkScreenSize();
  }, []);

  const companyOptions = [
    { value: "QArt Solutions", label: "QArt Solutions" },
    { value: "Brand X", label: "Brand X" },
    { value: "Company Y", label: "Company Y" },
  ];
  const industryOptions = [
    { value: "Social Media Marketing", label: "Social Media Marketing" },
    { value: "E-Commerce", label: "E-Commerce" },
    { value: "Fashion", label: "Fashion" },
  ];
  const competitorOptions = [
    { value: "Brand 24", label: "Brand 24" },
    { value: "Competitor A", label: "Competitor A" },
    { value: "Competitor B", label: "Competitor B" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (selectedOptions) => {
    setFormData({ ...formData, competitors: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  const checkScreenSize = () => {
    const screenInches = getScreenSizeInInches();
    if (screenInches >= 13.5 && screenInches <= 14.5) {
      console.log("14 Inch Screen");
      document.body.style.zoom = "80%";
    }
  };

  const getScreenSizeInInches = () => {
    const dpi = window.devicePixelRatio * 96; // Assuming standard 96 DPI
    const widthInInches = window.screen.width / dpi;
    const heightInInches = window.screen.height / dpi;

    return Math.sqrt(Math.pow(widthInInches, 2) + Math.pow(heightInInches, 2));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-200">
        <Header />

        {/* Form Section */}
        <div className="flex items-center justify-center h-full p-4">
          <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Email Id</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your email"
                />
              </div>

              {/* Company Dropdown */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Company Name</label>
                <Select
                  options={companyOptions}
                  onChange={(option) => setFormData({ ...formData, company: option.value })}
                  placeholder="Select Company"
                />
              </div>

              {/* Industry Dropdown */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Industry</label>
                <Select
                  options={industryOptions}
                  onChange={(option) => setFormData({ ...formData, industry: option.value })}
                  placeholder="Select Industry"
                />
              </div>

              {/* Competitors Multi-Select */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Competitors</label>
                <Select
                  options={competitorOptions}
                  isMulti
                  value={formData.competitors}
                  onChange={handleMultiSelect}
                  placeholder="Select Competitors"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="bg-[#0A66C2] text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
