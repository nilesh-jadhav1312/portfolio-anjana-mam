import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Trash2, CheckCircle, Circle } from "lucide-react";

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get("/contact");
      setMessages(data);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this message permanently?")) {
      try {
        await api.delete(`/contact/${id}`);
        toast.success("Message deleted");
        fetchMessages();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const toggleReadStatus = async (id) => {
    try {
      await api.put(`/contact/${id}`);
      fetchMessages();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="bg-[#ded6cc] text-light-text p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#64564b]">
        Contact Messages
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">
            No messages found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#857567] text-[#f3eee6]">
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Subject</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <React.Fragment key={msg._id}>
                    <tr
                      className={`border-b border-gray-400 transition ${msg.isRead ? "bg-gray-200" : "bg-white font-semibold"}`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleReadStatus(msg._id)}
                          className="text-[#857567] hover:text-[#5a5047]"
                          title={msg.isRead ? "Mark Unread" : "Mark Read"}
                        >
                          {msg.isRead ? (
                            <CheckCircle size={20} />
                          ) : (
                            <Circle
                              size={20}
                              className="fill-[#857567] text-[#857567]"
                            />
                          )}
                        </button>
                      </td>
                      <td className="p-4">{msg.name}</td>
                      <td className="p-4">
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {msg.email}
                        </a>
                      </td>
                      <td className="p-4">{msg.subject}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 flex justify-center">
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                    <tr className={msg.isRead ? "bg-gray-50" : "bg-white"}>
                      <td
                        colSpan="6"
                        className="p-4 pt-0 pb-6 border-b-2 border-black text-gray-700 text-sm whitespace-pre-wrap"
                      >
                        <strong>Message:</strong>
                        <br />
                        {msg.message}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMessages;
