import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Trash2, Edit, Plus } from "lucide-react";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const ManageGallery = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    caption: "",
    date: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await api.get("/gallery");
      setItems(data);
    } catch (error) {
      toast.error("Failed to load gallery items");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("caption", formData.caption);
    data.append("date", formData.date);
    data.append("category", formData.category);
    if (imageFile) data.append("image", imageFile);

    try {
      if (editId) {
        await api.put(`/gallery/${editId}`, data);
        toast.success("Updated");
      } else {
        if (!imageFile) return toast.error("Image is required");
        await api.post("/gallery", data);
        toast.success("Added to gallery");
      }
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this image?")) {
      try {
        await api.delete(`/gallery/${id}`);
        toast.success("Deleted");
        fetchItems();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      caption: item.caption || "",
      date: item.date || "",
      category: item.category || "",
    });
    setImageFile(null);
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ caption: "", date: "", category: "" });
    setImageFile(null);
  };

  return (
    <div className="bg-[#ded6cc] text-dark-base p-8 rounded-xl shadow-lg text-light-text">
      <h1 className="text-3xl font-bold mb-6 text-light-text">Manage Gallery</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Caption / Title
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.caption}
            onChange={(e) =>
              setFormData({ ...formData, caption: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Date String (e.g. March 2024, or 25-10-2023)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Category (Optional)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full p-2 border rounded"
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
            {editId ? "Update Image" : "Add Image"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="relative group bg-dark-base rounded overflow-hidden shadow"
          >
            <img
              src={resolveMediaUrl(item.image)}
              alt={item.caption}
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-bold text-center px-2 mb-2">
                {item.caption}
              </p>
              <p className="text-[#fffefd] text-xs font-bold text-center mb-4">
                {item.date}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-300"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageGallery;
