import { useState } from "react";
import axios from "axios";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://graphizinebackend.onrender.com/api/admin/login", {
        email: email.toLowerCase(),
        password,
      });
      const { token } = res.data;
      localStorage.setItem("adminToken", token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center mt-32">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-xs flex flex-col gap-5"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

        <label htmlFor="admin-email" className="font-semibold text-gray-800 mb-1">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          placeholder="Email"
          value={email}
          className="px-4 py-2 rounded-lg border border-gray-300 text-black"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="admin-password" className="font-semibold text-gray-800 mb-1">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          placeholder="Password"
          value={password}
          className="px-4 py-2 rounded-lg border border-gray-300 text-black"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg py-2 font-bold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
export default AdminLogin;

