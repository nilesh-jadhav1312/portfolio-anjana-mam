import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Save, Loader } from "lucide-react";
import api from "../../services/api";

const ManageContactInfo = () => {
  const [formData, setFormData] = useState({
    email: "",
    emailSubtext: "",
    location: "",
    locationSubtext: "",
    phone: "",
    phoneSubtext: "",
    officeName: "",
    officeMapLink: "",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      facebook: "",
      googleScholar: "",
      gmail: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/contact-info");
      if (data) {
        setFormData({
          email: data.email || "",
          emailSubtext: data.emailSubtext || "",
          location: data.location || "",
          locationSubtext: data.locationSubtext || "",
          phone: data.phone || "",
          phoneSubtext: data.phoneSubtext || "",
          officeName: data.officeName || "",
          officeMapLink: data.officeMapLink || "",
          socialLinks: {
            github: data.socialLinks?.github || "",
            linkedin: data.socialLinks?.linkedin || "",
            twitter: data.socialLinks?.twitter || "",
            instagram: data.socialLinks?.instagram || "",
            facebook: data.socialLinks?.facebook || "",
            googleScholar: data.socialLinks?.googleScholar || "",
            gmail: data.socialLinks?.gmail || "",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to load contact info");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const socialKey = name.split("_")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put("/contact-info", formData);
      toast.success("Contact info updated successfully");
      fetchContactInfo(); // Refresh data
    } catch (error) {
      toast.error("Failed to update contact info");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader className="animate-spin text-[#857567]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-light-text p-6">
      <div className="max-w-4xl mx-auto bg-[#ded6cc]  rounded-2xl shadow-xl p-8 border border-white/10">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold tracking-wide text-light-text">
            Manage Contact Info
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-4 bg-white p-6 rounded-xl border border-white/5">
              <h3 className="text-xl font-semibold text-light-text mb-2 flex items-center gap-2">
                Email Details
              </h3>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full text-light-text border border-black rounded-lg px-4 py-2   focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  Email Subtext
                </label>
                <input
                  type="text"
                  name="emailSubtext"
                  value={formData.emailSubtext}
                  onChange={handleInputChange}
                  className="w-full text-light-text border border-black rounded-lg px-4 py-2   focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4 bg-white p-6 rounded-xl border border-white/5">
              <h3 className="text-xl font-semibold text-light-text mb-2 flex items-center gap-2">
                Location Details
              </h3>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full  border border-black rounded-lg px-4 py-2   focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  Location Subtext
                </label>
                <input
                  type="text"
                  name="locationSubtext"
                  value={formData.locationSubtext}
                  onChange={handleInputChange}
                  className="w-full text-light-text border border-black rounded-lg px-4 py-2   focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-4 bg-white p-6 rounded-xl border border-white md:col-span-2">
              <h3 className="text-xl font-semibold text-light-text mb-2 flex items-center gap-2">
                Phone Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-text mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full   border border-black rounded-lg px-4 py-2  focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-text mb-1">
                    Phone Subtext
                  </label>
                  <input
                    type="text"
                    name="phoneSubtext"
                    value={formData.phoneSubtext}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-lg px-4 py-2  focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
              </div>
              {/* Office Details */}
              <div className="space-y-4 rounded-xl border border-white/5 md:col-span-2">
                <h3 className="text-xl font-semibold text-light-text mb-2 flex items-center gap-2">
                  Office Details
                </h3>
                <div>
                  <label className="block text-sm font-medium text-light-text mb-1">
                    Office Name
                  </label>
                  <input
                    type="text"
                    name="officeName"
                    value={formData.officeName}
                    onChange={handleInputChange}
                    className="w-full  border border-black rounded-lg px-4 py-2   focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-text mb-1">
                    Office Map Link (Google Maps URL)
                  </label>
                  <input
                    type="text"
                    name="officeMapLink"
                    value={formData.officeMapLink}
                    onChange={handleInputChange}
                    className="w-full   border border-black rounded-lg px-4 py-2   focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4 bg-white p-6 rounded-xl border border-white/5 md:col-span-2">
              <h3 className="text-xl font-semibold text-light-text mb-2 flex items-center gap-2">
                Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    name="social_github"
                    value={formData.socialLinks.github}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    name="social_linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Twitter URL
                  </label>
                  <input
                    type="text"
                    name="social_twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
                {/* Instagram URL */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    name="social_instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
                {/* Facebook URL */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    name="social_facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleInputChange}
                    className="w-full   border border-black rounded-lg px-4 py-2 focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
                {/* Google Scholar URL */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Google Scholar URL
                  </label>
                  <input
                    type="text"
                    name="social_googleScholar"
                    value={formData.socialLinks.googleScholar}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
                {/* Gmail URL */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Gmail URL
                  </label>
                  <input
                    type="text"
                    name="social_gmail"
                    value={formData.socialLinks.gmail}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-lg px-4 py-2 focus:outline-none focus:border-[#857567] focus:ring-1 focus:ring-[#857567] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#857567] text-white rounded-lg font-medium hover:bg-[#a99888] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageContactInfo;
