import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Trash2, Edit, Plus } from "lucide-react";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    platform: "",
    year: "",
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await api.get("/certificates");
      setCertificates(data);
    } catch (error) {
      toast.error("Failed to load certificates");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("platform", formData.platform);
    data.append("year", formData.year);
    if (certificateFile) data.append("certificateFile", certificateFile);

    try {
      if (editId) {
        await api.put(`/certificates/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Certificate updated");
      } else {
        await api.post("/certificates", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Certificate added");
      }
      resetForm();
      fetchCertificates();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      try {
        await api.delete(`/certificates/${id}`);
        toast.success("Certificate deleted");
        fetchCertificates();
      } catch (error) {
        toast.error("Failed to delete certificate");
      }
    }
  };

  const handleEdit = (certificate) => {
    setEditId(certificate._id);
    setFormData({
      title: certificate.title,
      platform: certificate.platform,
      year: certificate.year,
    });
    setCertificateFile(null); // Keep existing unless changed
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ title: "", platform: "", year: "" });
    setCertificateFile(null);
  };

  return (
    <div className="bg-[#ded6cc] text-dark-base p-8 rounded-xl shadow-lg text-light-text">
      <h1 className="text-3xl font-bold mb-6 text-light-text">
        Manage Certifications
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">
            Certification Title
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-light-text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Platform (e.g., Coursera, Udemy)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.platform}
            onChange={(e) =>
              setFormData({ ...formData, platform: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Year</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Certificate File (PDF or Image)
          </label>
          <input
            type="file"
            onChange={(e) => setCertificateFile(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-2">
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#857567] text-white rounded font-bold hover:bg-[#5a5047] transition"
          >
            {editId ? <Edit size={18} /> : <Plus size={18} />}{" "}
            {editId ? "Update Certificate" : "Add Certificate"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {certificates.map((certificate) => (
          <div
            key={certificate._id}
            className="bg-dark-base text-light-text p-5 rounded-lg shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold truncate">
                {certificate.title}
              </h3>
              <p className="text-[#a99888]">
                {certificate.platform} | {certificate.year}
              </p>
              {certificate.certificateFile && (
                <a
                  href={resolveMediaUrl(certificate.certificateFile)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-800 hover:text-blue-500 mt-2 block hover:underline"
                >
                  View Certificate
                </a>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#857567]/30">
              <button
                onClick={() => handleEdit(certificate)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => handleDelete(certificate._id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {certificates.length === 0 && (
        <p className="text-center text-[#857567] font-bold mt-4">
          No certificates added yet.
        </p>
      )}
    </div>
  );
};

export default ManageCertificates;
