import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Trash2, Edit, Plus } from "lucide-react";

const ManageInteractions = () => {
  const [interactions, setInteractions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    type: "Conference",
    date: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    try {
      const { data } = await api.get("/interactions");
      setInteractions(data);
    } catch (error) {
      toast.error("Failed to load interactions");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/interactions/${editId}`, formData);
        toast.success("Interaction updated");
      } else {
        await api.post("/interactions", formData);
        toast.success("Interaction added");
      }
      resetForm();
      fetchInteractions();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      try {
        await api.delete(`/interactions/${id}`);
        toast.success("Deleted");
        fetchInteractions();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      type: item.type,
      date: item.date,
      description: item.description || "",
    });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ title: "", type: "Conference", date: "", description: "" });
  };

  return (
    <div className="bg-[#ded6cc] text-light-base p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#857567]">
        Manage Outside Interactions
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Event Title
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
        <div>
          <label className="block text-sm font-semibold mb-1">
            Category  
          </label>
          <input
            type="text"
            list="interactionTypes"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="e.g. Guest Lecture, Conference, etc."
            required
          />
          <datalist id="interactionTypes">
            {Array.from(new Set(interactions.map((i) => i.type))).map(
              (type) => (
                <option key={type} value={type} />
              ),
            )}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Date String (e.g. October 2023)
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
            {editId ? "Update Event" : "Add Event"}
          </button>
        </div>
      </form>

      <div className="space-y-8">
        {Object.entries(
          interactions.reduce((acc, curr) => {
            const category = curr.type || "Other";
            if (!acc[category]) acc[category] = [];
            acc[category].push(curr);
            return acc;
          }, {}),
        ).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded bg-[#857567] text-white uppercase tracking-widest">
                {category}
              </span>
              <span className="text-sm text-[#857567] font-semibold">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            {items.map((item) => (
              <div
                key={item._id}
                className="bg-dark-base text-light-text p-5 rounded-lg shadow flex justify-between items-center border-l-4 border-[#857567]"
              >
                <div>
                  <h3 className="text-md font-bold">{item.title}</h3>
                  <p className="text-black mt-1 text-sm">{item.date}</p>
                  {item.description && (
                    <p className="mt-2 text-sm text-black">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 ml-4">
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
        ))}
      </div>
    </div>
  );
};

export default ManageInteractions;
