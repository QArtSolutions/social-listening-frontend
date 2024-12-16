import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import Select from "react-select";
import axios from "axios";
import { getBackendUrl } from "../../utils/apiUrl";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    competitors: [],
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const customStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: "16px",
      fontFamily: "Segoe UI",
      color: "#1E1E1E",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "16px",
      fontFamily: "Segoe UI",
      color: "#1E1E1E",
    }),
  };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const apiUrl = getBackendUrl(); // Ensure this function is defined and returns the base URL
  
      try {
        const response = await fetch(`${apiUrl}/api/users/details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
  
        const userDetails = await response.json();
  
        if (!response.ok) {
          throw new Error(userDetails.message || "Failed to fetch user details");
        }
  
        setFormData((prevData) => ({
          ...prevData,
          name: userDetails.username,
          email: userDetails.email,
        }));
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };
  
      const fetchPreferences = async () => {
        const userId = localStorage.getItem("userId");
        const apiUrl = getBackendUrl();
    
        try {
          const response = await axios.post(`${apiUrl}/api/users/get-preferences`, { userId });
          const { company, industry, competitors } = response.data;
    
          setFormData((prevData) => ({
            ...prevData,
            company,
            industry,
            competitors: competitors.map((comp) => ({ value: comp, label: comp })),
          }));
        } catch (error) {
          console.error("Error fetching preferences:", error);
        }
      };
    
   fetchPreferences();  
   fetchUserDetails();
  }, []);
  





  const companyOptions = [
    { value: "QArt Solutions", label: "QArt Solutions" },
    { value: "Lifestyle Clothing", label: "Lifestyle Clothing" },
    { value: "Ludhiana Dresses", label: "Ludhiana Dresses" },
  ];
  const industryOptions = [
    { value: "Fashion Tech", label: "Fashion Tech" },
  ];
  const competitorOptions = [
    { value: "Levis", label: "Levis" },
    { value: "Raymond", label: "Raymond" },
    { value: "Mufti", label: "Mufti" },
    { value: "Pepe Jeans", label: "Pepe Jeans" },
    { value: "Blackberrys", label: "Blackberrys" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (selectedOptions) => {
    setFormData({ ...formData, competitors: selectedOptions });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    if (!formData.company || !formData.industry || formData.competitors.length === 0) {
      setError("Please fill all the below fields: Company, Industry, and Competitors.");
      return;
    }
   
    const userId = localStorage.getItem("userId");
    const apiUrl = getBackendUrl();
    
    try {
      console.log("Sending Data:", {
        userId,
        company: formData.company,
        industry: formData.industry,
        competitors: formData.competitors.map((comp) => comp.value),
      });
  
      await axios.post(`${apiUrl}/api/users/save-preferences`, {
        userId,
        company: formData.company,
        industry: formData.industry,
        competitors: formData.competitors.map((comp) => comp.value),
      });
  
      console.log("Preferences saved successfully!");
      navigate("/mentions");

    } catch (error) {
      console.error("Error saving preferences:", error);
    }
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
            {/* <h2 className="text-lg font-semibold mb-4">Profile</h2> */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-[#5C5C5C] text-[16px] font-[Segoe UI]">Name</label>
                <div
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-[#5C5C5C] text-[16px] leading-[21.28px] font-[400] font-[Segoe UI]"
                >
                  {formData.name}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-[#5C5C5C] text-[16px] font-[Segoe UI]">Email</label>
                <div
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-[#5C5C5C] text-[16px] leading-[21.28px] font-[400] font-[Segoe UI]"
                >
                  {formData.email}
                </div>
              </div>

              {/* Company Dropdown */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-[#5C5C5C] text-[16px] font-[Segoe UI]">Company Name</label>
                <Select
                  styles={customStyles}
                  options={companyOptions}
                  value={companyOptions.find((option) => option.value === formData.company)}
                  onChange={(option) => setFormData({ ...formData, company: option.value })}
                  placeholder="Select Company"
                />
              </div>

              {/* Industry Dropdown */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-[#5C5C5C] text-[16px] font-[Segoe UI]">Industry</label>
                <Select
                  styles={customStyles}
                  options={industryOptions}
                  value={industryOptions.find((option) => option.value === formData.industry)}
                  onChange={(option) => setFormData({ ...formData, industry: option.value })}
                  placeholder="Select Industry"
                />
              </div>

              {/* Competitors Multi-Select */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-[#5C5C5C] text-[16px] font-[Segoe UI]">Competitors</label>
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
                  className="bg-[#0A66C2] text-white px-4 py-2 rounded-md hover:bg-blue-600 text-[14px] font-[Segoe UI]"
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
