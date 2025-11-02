
// src/pages/Login.jsx
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "./Context";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  // Local login (email/password)
  const handleLocalLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://graphizinebackend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Backend response:", data);
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Local login error:", err);
      alert("Something went wrong. Try again.");
    }
  };


  // Google login
  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      console.log("Google Login Success:", tokenResponse);

      try {
        const res = await fetch("https://graphizinebackend.onrender.com/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: tokenResponse.code }),
        });

        const data = await res.json();
        console.log("Backend response:", data);

        if (res.ok) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user)
          navigate("/");
        } else {
          alert(data.message || "Google authentication failed");
        }
      } catch (err) {
        console.error("Google login error:", err);
        alert("Google Login failed. Try again.");
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      alert("Google Login Failed. Try again!");
    },
  });

  return (
    <div className=" min-h-screen flex items-center justify-center ">
      {/* Local Login */}
      <form onSubmit={handleLocalLogin} className="bg-brown/60 p-8 rounded-xl shadow-lg max-w-md mx-auto flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-beige text-center mb-4">
          Login Page
        </h2>
        <div style={{ margin: "10px" }}>
          <label className="text-beige">Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border border-beige text-beige bg-transparent placeholder-beige
             shadow-sm focus:outline-none focus:ring-2 focus:ring-beige focus:border-transparent transition"
          />
        </div>
        <div style={{ margin: "10px" }}>
          <label className="text-beige">Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border  border-beige text-beige bg-transparent placeholder-transparent 
             shadow-sm focus:outline-none focus:ring-2 focus:ring-beige focus:border-transparent transition"
          />
        </div>
        <div className="flex flex-col items-center gap-4 mt-6">
          <button type="submit" className="w-1/2 cursor-pointer border border-beige   text-beige font-bold py-2 rounded-md shadow-md transition duration-300">
            Login
          </button>

          <p className="text-center font-semibold text-beige">or</p>

          {/* Google Login */}
          <button
            onClick={() => loginWithGoogle()}
            className="w-1/2 cursor-pointer border border-beige   text-beige font-bold py-2 rounded-md shadow-md transition duration-300"
          >
            Login with Google
          </button>
        </div>
      </form>

    </div>
  );
}

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}
