import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Trash2, Edit, Plus } from "lucide-react";

const ManageTeaching = () => {
  const [teachings, setTeachings] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    link: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTeachings();
  }, []);

  const fetchTeachings = async () => {
    try {
      const { data } = await api.get("/teaching");
      setTeachings(data);
    } catch (error) {
      toast.error("Failed to load teaching data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/teaching/${editId}`, formData);
        toast.success("Teaching course updated");
      } else {
        await api.post("/teaching", formData);
        toast.success("Teaching course added");
      }
      resetForm();
      fetchTeachings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this taught course?")) {
      try {
        await api.delete(`/teaching/${id}`);
        toast.success("Taught course deleted");
        fetchTeachings();
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      year: item.year,
      link: item.link || "",
    });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ title: "", description: "", year: "", link: "" });
  };

  return (
    <div className="bg-[#ded6cc] text-dark-base p-8 rounded-xl shadow-lg text-light-text">
      <h1 className="text-3xl font-bold mb-6 text-light-text">
        Manage Teaching (Courses Taught)
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Course Title
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="e.g. Data Structures and Algorithms"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567] h-24"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            placeholder="Describe the topics covered in this course..."
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
            placeholder="e.g. 2023 - Present"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            External Link (Optional)
          </label>
          <input
            type="url"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://university.edu/syllabus"
          />
        </div>
        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
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
            {editId ? "Update Taught Course" : "Add Taught Course"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {teachings.map((item) => (
          <div
            key={item._id}
            className="bg-dark-base text-light-text p-5 rounded-lg shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-light-text">{item.title}</h3>
              <p className="text-[#000000] font-bold my-1">{item.year}</p>
              <p className="text-sm text-[#000000] line-clamp-3 mt-2">
                {item.description}
              </p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-blue-800 hover:text-blue-500 mt-2 inline-block hover:underline"
                >
                  Visit Course Link →
                </a>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#857567]/30">
              <button
                onClick={() => handleEdit(item)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {teachings.length === 0 && (
        <p className="text-center text-[#857567] font-bold mt-4">
          No taught courses added yet.
        </p>
      )}
    </div>
  );
};

export default ManageTeaching;
