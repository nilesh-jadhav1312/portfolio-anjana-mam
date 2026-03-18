import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Trash2, Edit, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const ManageCreativity = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await api.get("/creativity");
      setItems(data);
    } catch (error) {
      toast.error("Failed to load items");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("description", formData.description);
    data.append("order", formData.order);
    if (imageFile) data.append("image", imageFile);

    try {
      if (editId) {
        await api.put(`/creativity/${editId}`, data);
        toast.success("Item updated");
      } else {
        if (!imageFile) return toast.error("Image is required");
        await api.post("/creativity", data);
        toast.success("Item added");
      }
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await api.delete(`/creativity/${id}`);
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
      title: item.title,
      date: item.date || "",
      description: item.description || "",
      order: item.order || 0,
    });
    setImageFile(null);
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ title: "", date: "", description: "", order: items.length });
    setImageFile(null);
  };

  const updateOrder = async (id, currentOrder, change) => {
    try {
      await api.put(`/creativity/${id}`, { order: currentOrder + change });
      fetchItems();
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="bg-[#ded6cc] text-light-text p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#857567]">
        Manage Creativity Slider
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Slide Title
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="md:col-span-2">
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
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Slide Description
          </label>
          <textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567] h-20"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Display Order (Lower = First)
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Slide Image
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
            {editId ? "Update Slide" : "Add Slide"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-dark-base text-light-text rounded-lg overflow-hidden shadow flex flex-col"
          >
            <img
              src={resolveMediaUrl(item.image)}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm text-[#000000] mt-1 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-xs font-bold text-[#000000] mt-2">
                  {item.date}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-black">
                <div className="flex gap-2">
                   
                </div>
                <div className="flex gap-3">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCreativity;
