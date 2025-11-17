import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import combinedLogo from "../assets/FINAL_ATTEMPT-removebg-preview.png"; // Your combined logo

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get logged user from localStorage
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* === Left: Logo === */}
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={combinedLogo}
            alt="VSD–FHI360 Partnership Logo"
            className="navbar-logo-img"
          />
        </Link>
      </div>

      {/* === Middle: Navigation Links === */}
      <ul className="navbar-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === "/case-reporting" ? "active" : ""}>
          <Link to="/case-reporting">Case Reporting</Link>
        </li>
        <li className={location.pathname === "/amr-data" ? "active" : ""}>
          <Link to="/amr-data">AMR Data</Link>
        </li>
        <li className={location.pathname === "/sops" ? "active" : ""}>
          <Link to="/sops">SOPs</Link>
        </li>
        <li className={location.pathname === "/dashboard" ? "active" : ""}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>

      {/* === Right: Login / Logout Button === */}
      <div className="navbar-actions">
        {!user ? (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        ) : (
          <button className="login-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;