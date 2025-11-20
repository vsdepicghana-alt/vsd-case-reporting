import React, { useEffect, useState } from "react";
import "./Dashboard.css";   // create this file for styling later
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [filters, setFilters] = useState({
    region: "",
    disease: "",
    classification: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cases") || "{}");
    const list = Object.values(stored);
    setCases(list);
  }, []);

  // Apply filters
  const filteredCases = cases.filter((c) => {
    return (
      (filters.region === "" || c.region === filters.region) &&
      (filters.disease === "" || c.priorityDiseases?.includes(filters.disease)) &&
      (filters.classification === "" || c.caseClassification === filters.classification)
    );
  });

  // Count helpers
  const countBy = (key) => {
    const result = {};
    filteredCases.forEach((c) => {
      const value = c[key] || "Unknown";
      result[value] = (result[value] || 0) + 1;
    });
    return result;
  };

  const regionCounts = countBy("region");
  const classificationCounts = countBy("caseClassification");
  const speciesCounts = countBy("species");
  const diseaseCounts = {};

  filteredCases.forEach((c) => {
    c.priorityDiseases?.forEach((d) => {
      diseaseCounts[d] = (diseaseCounts[d] || 0) + 1;
    });
  });

  return (
    <div className="dashboard-container">
      <h1>📊 VSD / EpiC PZD Surveillance Dashboard</h1>

      {/* FILTERS */}
      <div className="filters">
        <select onChange={(e) => setFilters({ ...filters, region: e.target.value })}>
          <option value="">Filter by Region</option>
          {[...new Set(cases.map((c) => c.region))].map((region) => (
            <option key={region}>{region}</option>
          ))}
        </select>

        <select onChange={(e) => setFilters({ ...filters, disease: e.target.value })}>
          <option value="">Filter by Disease</option>
          {[...new Set(cases.flatMap((c) => c.priorityDiseases || []))].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, classification: e.target.value })}
        >
          <option value="">Filter by Classification</option>
          <option value="suspected">Suspected</option>
          <option value="confirmed">Confirmed</option>
        </select>
      </div>

      {/* TOTAL COUNT */}
      <div className="total-card">
        <h2>Total Cases: {filteredCases.length}</h2>
      </div>

      <div className="charts-grid">

        {/* REGION BAR CHART */}
        <div className="chart-box">
          <h3>Cases by Region</h3>
          <Bar
            data={{
              labels: Object.keys(regionCounts),
              datasets: [
                {
                  label: "Cases",
                  data: Object.values(regionCounts),
                  backgroundColor: "#007bff",
                },
              ],
            }}
          />
        </div>

        {/* SPECIES BAR CHART */}
        <div className="chart-box">
          <h3>Cases by Species</h3>
          <Bar
            data={{
              labels: Object.keys(speciesCounts),
              datasets: [
                {
                  label: "Species",
                  data: Object.values(speciesCounts),
                  backgroundColor: "#ff9900",
                },
              ],
            }}
          />
        </div>

        {/* DISEASE PIE */}
        <div className="chart-box">
          <h3>Cases by Disease</h3>
          <Pie
            data={{
              labels: Object.keys(diseaseCounts),
              datasets: [
                {
                  data: Object.values(diseaseCounts),
                  backgroundColor: ["#ff0000", "#ff9900", "#00cc99", "#0066ff", "#6600cc"],
                },
              ],
            }}
          />
        </div>

        {/* CLASSIFICATION PIE */}
        <div className="chart-box">
          <h3>Case Classification</h3>
          <Pie
            data={{
              labels: Object.keys(classificationCounts),
              datasets: [
                {
                  data: Object.values(classificationCounts),
                  backgroundColor: ["#ff3333", "#33cc33"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;