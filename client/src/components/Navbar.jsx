import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import combinedLogo from "../assets/FINAL_ATTEMPT-removebg-preview.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Read user from localStorage
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar">
      {/* === Logo === */}
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={combinedLogo}
            alt="VSD–FHI360 Logo"
            className="navbar-logo-img"
          />
        </Link>
      </div>

      {/* === Navigation Links === */}
      <ul className="navbar-links">

        {/* Show links ONLY if user is logged in */}
        {user && (
          <>
            <li className={isActive("/")}>
              <Link to="/">Home</Link>
            </li>

            <li className={isActive("/case-reporting")}>
              <Link to="/case-reporting">Case Reporting</Link>
            </li>

            <li className={isActive("/amr-data")}>
              <Link to="/amr-data">AMR Data</Link>
            </li>

            <li className={isActive("/sops")}>
              <Link to="/sops">SOPs</Link>
            </li>

            <li className={isActive("/dashboard")}>
              <Link to="/dashboard">Dashboard</Link>
            </li>

            {/* Superuser Only */}
            {user.role === "superuser" && (
              <li className={isActive("/officer-setup")}>
                <Link to="/officer-setup">Officer Setup</Link>
              </li>
            )}
          </>
        )}
      </ul>

      {/* === Login / Logout Button === */}
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