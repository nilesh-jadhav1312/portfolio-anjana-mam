import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const ManageAdminCredentials = () => {
  const { admin, updateCredentials } = useContext(AuthContext);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (admin?.username) {
      setNewUsername(admin.username);
    }
  }, [admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUsername = newUsername.trim();
    const usernameChanged =
      trimmedUsername && trimmedUsername !== (admin?.username || "");

    if (!usernameChanged && !newPassword) {
      toast.error("Provide a new username or a new password");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const success = await updateCredentials({
      newUsername: usernameChanged ? trimmedUsername : undefined,
      newPassword: newPassword || undefined,
    });

    if (success) {
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="bg-[#ded6cc] text-light-text p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#5a5047" }}>
        Admin Credentials
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Current Username
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded bg-white"
            value={admin?.username || ""}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            New Username
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded bg-white"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded bg-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded bg-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg text-black font-bold hover:opacity-90 transition-opacity text-lg"
          style={{ backgroundColor: "#41bc34ff" }}
        >
          Update Credentials
        </button>
      </form>
    </div>
  );
};

export default ManageAdminCredentials;
