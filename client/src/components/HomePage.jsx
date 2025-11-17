import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import combinedLogo from "../assets/FINAL_ATTEMPT-removebg-preview.png"; // ✅ Your combined logo

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* === Header with Combined Logo === */}
      <header className="home-header">
        <div className="logo-row">
          <img
            src={combinedLogo}
            alt="Veterinary Services Directorate and FHI 360 Partnership"
            className="combined-logo"
          />
        </div>

        <h1>Veterinary Services Directorate Data Portal</h1>
        <p>Integrated One Health Surveillance & Laboratory Data System</p>
      </header>

      {/* === Main Menu === */}
      <div className="home-grid">
        {/* Case Reporting System */}
        <div className="home-card" onClick={() => navigate("/case-reporting")}>
          <span className="emoji">🩺</span>
          <h3>Case Reporting System</h3>
          <p>Submit and manage zoonotic disease case reports.</p>
        </div>

        {/* AMR Data */}
        <div className="home-card" onClick={() => navigate("/amr-data")}>
          <span className="emoji">🧫</span>
          <h3>AMR / AST Results</h3>
          <p>Upload, view, and analyze antimicrobial resistance data.</p>
        </div>

        {/* SOP Repository */}
        <div className="home-card" onClick={() => navigate("/sops")}>
          <span className="emoji">📄</span>
          <h3>SOP Repository</h3>
          <p>Access or upload Standard Operating Procedures (SOPs).</p>
        </div>

        {/* Dashboard */}
        <div className="home-card" onClick={() => navigate("/dashboard")}>
          <span className="emoji">📊</span>
          <h3>Data Dashboard</h3>
          <p>Visualize and analyze disease and AMR trends.</p>
        </div>
      </div>

      {/* === Footer === */}
      <footer className="home-footer">
        <p>
          © {new Date().getFullYear()} Veterinary Services Directorate, Ghana. <br />
          Developed in partnership with FHI 360.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
