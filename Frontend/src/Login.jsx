/*import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

function LoginForm() {
  // Google Login Hook
const login = useGoogleLogin({
  flow: "auth-code",   // or "implicit"
  onSuccess: (tokenResponse) => {
    console.log("Google Login Success:", tokenResponse);
  },
});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Normal email/password login");
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input type="email" required />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" required />
        </div>
        <button type="submit">Login</button>
        <p>or</p>
        <div>

          <button type="button" onClick={() => login()}>
            Google
          </button>
        </div>
      </form>
    </div>
  );
}

// Wrap your app with GoogleOAuthProvider in main.jsx or App.jsx
function Login() {
  return (
    <GoogleOAuthProvider clientId="674597441052-m7ubqrd451k7ejivsk6vetg66teg2fsr.apps.googleusercontent.com">
      <LoginForm />
    </GoogleOAuthProvider>
  );
}

export default Login;







import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "auth-code", // or "implicit"
    onSuccess: (tokenResponse) => {
      console.log("Google Login Success:", tokenResponse);

      // 👉 after successful login, redirect to home
      navigate("/");
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
  });

  return (
    <div>
      <h2>Login Page</h2>
      <form>
        <div>
          <label>Email: </label>
          <input type="email" required />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" required />
        </div>
        <button type="submit">Login</button>
        <p>or</p>
        <div>
          <button type="button" onClick={() => login()}>
            Login with Google
          </button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId="674597441052-m7ubqrd451k7ejivsk6vetg66teg2fsr.apps.googleusercontent.com">
      <Login />
    </GoogleOAuthProvider>
  );
}
*/



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
      const res = await fetch("http://localhost:8080/api/auth/login", {
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
        const res = await fetch("http://localhost:8080/api/auth/google", {
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
      <form onSubmit={handleLocalLogin} className="bg-transparent p-8 rounded-xl shadow-lg max-w-md mx-auto flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-100 text-center mb-4">
          Login Page
        </h2>
        <div style={{ margin: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 
             shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
          />
        </div>
        <div style={{ margin: "10px" }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 
             shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
          />
        </div>
        <div className="flex flex-col items-center gap-4 mt-6">
          <button type="submit" className="w-1/2 cursor-pointer bg-blue-400 outline-solid outline-2 outline-blue-500 hover:bg-blue-500  hover:outline-blue-400 text-white font-bold py-2 rounded-md shadow-md transition duration-300">
            Login
          </button>

          <p className="text-center font-semibold text-gray-200">or</p>

          {/* Google Login */}
          <button
            onClick={() => loginWithGoogle()}
            className="w-1/2 cursor-pointer bg-blue-400 outline-solid outline-2 outline-blue-500 hover:bg-blue-500  hover:outline-blue-400 text-white font-bold py-2 rounded-md shadow-md transition duration-300"
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
