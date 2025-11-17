import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CaseSuccess.css";

const CaseSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get passed values safely
  const { caseID, region, district } = location.state || {};

  return (
    <div className="success-container">
      <div className="success-card">
        <h1>✅ Case Submitted Successfully!</h1>

        <p className="success-message">
          Your case has been recorded and stored safely in the system.
        </p>

        <div className="case-details-box">
          <h3>Case Details</h3>
          <p><strong>Case ID:</strong> {caseID}</p>
          <p><strong>Region:</strong> {region}</p>
          <p><strong>District:</strong> {district}</p>
        </div>

        <div className="success-actions">
          <button onClick={() => navigate("/")}>🏠 Return to Home</button>
          <button onClick={() => navigate("/case-reporting")}>
            ➕ Submit Another Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseSuccess;