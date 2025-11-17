import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// 🌍 Use your live Render API here
const API_BASE = "https://vsd-api.onrender.com";

const Login = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Fetch user by PIN from Render API
      const response = await fetch(`${API_BASE}/users?pin=${pin}`);
      
      if (!response.ok) {
        throw new Error("Network response not OK");
      }

      const data = await response.json();

      if (data.length === 0) {
        setError("❌ Invalid PIN. Please try again.");
        return;
      }

      const user = data[0];

      // Store logged-in user
      localStorage.setItem("loggedUser", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "superuser") {
        navigate("/officer-setup");
      } else {
        navigate("/"); // Officer goes to homepage
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Officer Login</h2>

      <form onSubmit={handleLogin} className="login-form">
        <label>Enter PIN</label>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter your PIN"
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>

        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;