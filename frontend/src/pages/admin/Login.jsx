import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-base text-light-text px-4">
      <div className="bg-soft-bg text-dark-base p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: "#857567" }}
        >
          Admin Portal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300  text-black rounded focus:outline-none focus:ring-2 focus:ring-[#857567] bg-white transition-shadow"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#857567] bg-white transition-shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded text-black font-medium hover:opacity-90 transition-opacity mt-4"
            style={{ backgroundColor: "#857567" }}
          >
            Sign In
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Back to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
