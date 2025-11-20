import React, { useState } from "react";
import "./OfficerSetup.css";

// 🌍 Render API URL
const API_BASE = "https://vsd-api.onrender.com";

const OfficerSetup = () => {
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");   // ✅ NEW
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setMessage("");

    // ✨ Construct officer object
    const newOfficer = {
      name,
      staffId,
      jobDescription,
      contactNumber,   // ✅ ADDED
      pin,
      role: "officer",
    };

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOfficer),
      });

      if (!response.ok) {
        throw new Error("Failed to create officer");
      }

      setMessage("✅ Officer account created successfully!");

      // Clear form fields after success
      setName("");
      setStaffId("");
      setJobDescription("");
      setContactNumber("");   // ✅ CLEAR
      setPin("");

    } catch (err) {
      console.error("Officer creation error:", err);
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="setup-container">
      <h2>👨‍💼 Superuser – Create Officer Account</h2>

      <form onSubmit={handleCreateOfficer} className="setup-form">

        <label>Officer Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter officer full name"
          required
        />

        <label>Staff ID</label>
        <input
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          placeholder="Enter staff ID"
          required
        />

        <label>Job Description</label>
        <input
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="e.g. Field Technician, District Vet Officer"
          required
        />

        {/* 📞 CONTACT NUMBER FIELD */}
        <label>Contact Number</label>
        <input
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Enter phone number"
          required
        />

        <label>Assign PIN</label>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Create login PIN"
          required
        />

        <button type="submit" className="setup-btn">
          Create Officer
        </button>

        {message && <p className="setup-message">{message}</p>}
      </form>
    </div>
  );
};

export default OfficerSetup;