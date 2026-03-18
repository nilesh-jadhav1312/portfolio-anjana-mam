import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Save, Upload } from "lucide-react";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const ManageProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    subtitle: "",
    bio: "",
    workExperience: [],
    educationDetails: [],
    professionalMemberships: [],
  });
  const [profileImage, setProfileImage] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newWorkExp, setNewWorkExp] = useState("");
  const [newEduDetail, setNewEduDetail] = useState("");
  const [newMembership, setNewMembership] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/profile");
      if (data && Object.keys(data).length > 0) {
        setProfile(data);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch profile");
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", profile.name || "");
      formData.append("subtitle", profile.subtitle || "");
      formData.append("bio", profile.bio || "");
      formData.append(
        "workExperience",
        JSON.stringify(profile.workExperience || []),
      );
      formData.append(
        "educationDetails",
        JSON.stringify(profile.educationDetails || []),
      );
      formData.append(
        "professionalMemberships",
        JSON.stringify(profile.professionalMemberships || []),
      );

      if (profileImage) formData.append("profileImage", profileImage);
      if (cvFile) formData.append("cvFile", cvFile);

      const { data } = await api.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (cvFile && data?.cvFile) {
        window.open(resolveMediaUrl(data.cvFile), "_blank", "noopener");
      }
      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const addArrayItem = (field, value, setter) => {
    if (!value.trim()) return;
    setProfile({ ...profile, [field]: [...(profile[field] || []), value] });
    setter("");
  };

  const removeArrayItem = (field, index) => {
    const updated = [...(profile[field] || [])];
    updated.splice(index, 1);
    setProfile({ ...profile, [field]: updated });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-[#ded6cc] text-light-text p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#5a5047" }}>
        Manage Profile
      </h1>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[#a99888] pb-2">
              Basic Info
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#857567] bg-white"
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Subtitle
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#857567] bg-white"
                value={profile.subtitle || ""}
                onChange={(e) =>
                  setProfile({ ...profile, subtitle: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Bio</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#857567] bg-white h-32"
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[#a99888] pb-2">
              Files & Media
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded bg-white cursor-pointer"
              />
              {profile.profileImage && (
                <p className="text-xs text-gray-500 mt-1">
                  Current: {profile.profileImage}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                CV File (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded bg-white cursor-pointer"
              />
              {profile.cvFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Current: {profile.cvFile}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="border-t border-[#a99888] pt-6">
          <h2 className="text-xl font-semibold mb-4 text-light-text">
            Work Experience (Bullet Points)
          </h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="e.g. Teaching Experience: 23+ years"
              className="flex-1 p-2 rounded border border-gray-300 bg-white"
              value={newWorkExp}
              onChange={(e) => setNewWorkExp(e.target.value)}
            />
            <button
              type="button"
              onClick={() =>
                addArrayItem("workExperience", newWorkExp, setNewWorkExp)
              }
              className="px-4 py-2 bg-[#857567] text-white rounded hover:opacity-90"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {(profile.workExperience || []).map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-dark-base text-light-text px-3 py-2 rounded"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem("workExperience", index)}
                  className="p-1 px-2 text-white hover:text-red-300 text-sm bg-red-500 rounded-lg"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Education Details */}
        <div className="border-t border-[#a99888] pt-6">
          <h2 className="text-xl font-semibold mb-4 text-light-text">
            Education Details (Bullet Points)
          </h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="e.g. Pursing PhD at MIT ADT University"
              className="flex-1 p-2 rounded border border-gray-300 bg-white"
              value={newEduDetail}
              onChange={(e) => setNewEduDetail(e.target.value)}
            />
            <button
              type="button"
              onClick={() =>
                addArrayItem("educationDetails", newEduDetail, setNewEduDetail)
              }
              className="px-4 py-2 bg-[#857567] text-white rounded hover:opacity-90"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {(profile.educationDetails || []).map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-dark-base text-light-text px-3 py-2 rounded"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem("educationDetails", index)}
               className="p-1 px-2 text-white hover:text-red-300 text-sm bg-red-500 rounded-lg"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Professional Memberships */}
        <div className="border-t border-[#a99888] pt-6">
          <h2 className="text-xl font-semibold mb-4 text-light-text">
            Professional Memberships (Bullet Points)
          </h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="e.g. CSI membership"
              className="flex-1 p-2 rounded border border-gray-300 bg-white"
              value={newMembership}
              onChange={(e) => setNewMembership(e.target.value)}
            />
            <button
              type="button"
              onClick={() =>
                addArrayItem(
                  "professionalMemberships",
                  newMembership,
                  setNewMembership,
                )
              }
              className="px-4 py-2 bg-[#857567] text-white rounded hover:opacity-90"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {(profile.professionalMemberships || []).map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-dark-base text-light-text px-3 py-2 rounded"
              >
                <span>{item}</span>
                <button 
                  type="button"
                  onClick={() =>
                    removeArrayItem("professionalMemberships", index)
                  }
                  className="p-1 px-2 text-white hover:text-red-300 text-sm bg-red-500 rounded-lg"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg text-black font-bold hover:opacity-90 transition-opacity mt-8 text-lg"
          style={{ backgroundColor: "#41bc34ff" }}
        >
          <Save size={24} /> Save Profile Changes
        </button>
      </form>
    </div>
  );
};

export default ManageProfile;
