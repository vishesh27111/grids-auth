import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/otp.css";

function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = localStorage.getItem("email");
  // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleOTPVerification = async () => {
    if (otp) {
      try {
        const response = await fetch("https://node-g8h4gherfbejfqbq.eastus2-01.azurewebsites.net/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          localStorage.setItem("authToken", token);
          login(token)
          navigate("/");
        } else {
          setError("Invalid OTP. Please try again.");
        }
      } catch (error) {
        console.error("OTP verification failed:", error);
        setError("OTP verification failed. Please try again.");
      }
    } else {
      setError("Please enter the OTP.");
    }
  };

  return (
    <div className="otp-container">
      <h1>OTP Verification</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleOTPVerification}>Verify OTP</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default OTPVerificationPage;
