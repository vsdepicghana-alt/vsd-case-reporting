import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import FormApp from "./FormApp";
import AMRData from "./components/AMRData";

import Login from "./components/Login";
import OfficerSetup from "./components/OfficerSetup";
import CaseSuccess from "./components/CaseSuccess";
import Dashboard from "./components/Dashboard";   // ✅ NEW
import SOPRepository from "./components/SOPRepository";
// ===== Helper Functions =====

const getUser = () => {
  const user = localStorage.getItem("loggedUser");
  return user ? JSON.parse(user) : null;
};

// Protect normal logged-in routes
const ProtectedRoute = ({ children }) => {
  const user = getUser();
  return user ? children : <Navigate to="/login" replace />;
};

// Protect superuser-only routes
const SuperUserRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;

  return user.role === "superuser" ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* 🔐 Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* 👑 Superuser Panel */}
        <Route
          path="/officer-setup"
          element={
            <SuperUserRoute>
              <OfficerSetup />
            </SuperUserRoute>
          }
        />

        {/* 🏠 Home — Normal Users */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* 📝 Case Reporting Form */}
        <Route
          path="/case-reporting"
          element={
            <ProtectedRoute>
              <FormApp />
            </ProtectedRoute>
          }
        />

        {/* 🎉 Success Page */}
        <Route
          path="/case-success"
          element={
            <ProtectedRoute>
              <CaseSuccess />
            </ProtectedRoute>
          }
        />

        {/* 🧫 AMR Data */}
        <Route
          path="/amr-data"
          element={
            <ProtectedRoute>
              <AMRData />
            </ProtectedRoute>
          }
        />

        {/* 📊 Dashboard (NEW) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
         path="/sops"
         element={
            <ProtectedRoute>
              <SOPRepository />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;