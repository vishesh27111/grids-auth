import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/Login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await fetch("https://node-g8h4gherfbejfqbq.eastus2-01.azurewebsites.net/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const otp = data.otp; // Get OTP from server response
          localStorage.setItem("otp", otp); // Temporarily store OTP
          localStorage.setItem("email", email); // Store email for OTP verification
          navigate("/otp-verification"); // Redirect to OTP page
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } catch (error) {
        console.error("Login failed:", error);
        setError("Login failed. Please try again.");
      }
    } else {
      setError("Please enter both email and password.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginPage;
