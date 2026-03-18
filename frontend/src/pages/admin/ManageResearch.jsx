import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Trash2, Edit, Plus } from "lucide-react";

const ManageResearch = () => {
  const [research, setResearch] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    year: "",
    tags: "",
    link: "",
  });
  const [pdfLink, setPdfLink] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const { data } = await api.get("/research");
      setResearch(data);
    } catch (error) {
      toast.error("Failed to load research");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      abstract: formData.abstract,
      year: formData.year,
      tags: formData.tags,
      link: formData.link || "",
      pdfFile: pdfLink || "",
    };

    try {
      if (editId) {
        await api.put(`/research/${editId}`, payload);
        toast.success("Research updated");
      } else {
        await api.post("/research", payload);
        toast.success("Research added");
      }
      resetForm();
      fetchResearch();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this research item?")) {
      try {
        await api.delete(`/research/${id}`);
        toast.success("Deleted");
        fetchResearch();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    const tagsString = Array.isArray(item.tags)
      ? item.tags.join(", ")
      : item.tags;
    setFormData({
      title: item.title,
      abstract: item.abstract,
      year: item.year,
      tags: tagsString || "",
      link: item.link || "",
    });
    setPdfLink(item.pdfFile || "");
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ title: "", abstract: "", year: "", tags: "", link: "" });
    setPdfLink("");
  };

  return (
    <div className="bg-[#ded6cc] text-light-text p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#857567]">
        Manage Research Papers
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Title</label>
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
          <label className="block text-sm font-semibold mb-1">Abstract</label>
          <textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567] h-24"
            value={formData.abstract}
            onChange={(e) =>
              setFormData({ ...formData, abstract: e.target.value })
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
            Tags (Comma separated)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            External Visit Link (Optional)
          </label>
          <input
            type="url"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={formData.link || ""}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://example.com/paper"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            PDF Link (Optional)
          </label>
          <input
            type="url"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#857567]"
            value={pdfLink}
            onChange={(e) => setPdfLink(e.target.value)}
            placeholder="https://example.com/paper.pdf"
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
            {editId ? "Update Research" : "Add Research"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {research.map((item) => (
          <div
            key={item._id}
            className="bg-dark-base text-light-text p-5 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <div className="text-sm text-light-text my-1 flex gap-3">
                  <span>Year: {item.year}</span>
                  {item.tags && item.tags.length > 0 && (
                    <span>Tags: {item.tags.join(", ")}</span>
                  )}
                </div>
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
            <p className="mt-3 text-sm line-clamp-2 text-light-text">
              {item.abstract}
            </p>
            {item.pdfFile && (
              <div className="flex flex-wrap gap-2 mt-3">
                <a
                  href={item.pdfFile}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-sm text-black bg-blue-300 rounded-lg px-3 py-1.5 hover:text-blue-100 hover:underline"
                >
                  View PDF Link
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageResearch;
