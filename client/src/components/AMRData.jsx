// src/components/AMRData.jsx
import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  TimeScale
);

const parseWorkbook = (file, onParsed) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    onParsed(json);
  };
  reader.readAsArrayBuffer(file);
};

const aggregateByAntibiotic = (rows, organismFilter = null) => {
  // rows: array of objects with keys: date, organism, antibiotic, result
  const stats = {}; // antibiotic -> {count, resistantCount}
  rows.forEach((r) => {
    const antibiotic = (r.antibiotic || r.Antibiotic || "").toString().trim();
    const organism = (r.organism || r.Organism || "").toString().trim();
    const result = (r.result || r.Result || "").toString().trim().toLowerCase();

    if (!antibiotic) return;
    if (organismFilter && organismFilter !== organism) return;

    if (!stats[antibiotic]) stats[antibiotic] = { total: 0, resistant: 0 };
    stats[antibiotic].total += 1;
    if (result.includes("resist")) stats[antibiotic].resistant += 1;
  });

  // convert to arrays sorted by highest resistance %
  const out = Object.entries(stats).map(([abx, s]) => ({
    antibiotic: abx,
    total: s.total,
    resistant: s.resistant,
    percent: s.total > 0 ? (s.resistant / s.total) * 100 : 0,
  }));
  out.sort((a, b) => b.percent - a.percent);
  return out;
};

const timeseriesByDateAntibiotic = (rows, antibiotic) => {
  // returns array of {date, total, resistant, percent}
  const map = {}; // dateStr -> {total,resistant}
  rows.forEach((r) => {
    const abx = (r.antibiotic || r.Antibiotic || "").toString().trim();
    if (abx !== antibiotic) return;
    const d = r.date || r.Date || r.sample_date || "";
    if (!d) return;
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) {
      // try parse simple yyyy-mm-dd text
      const fallback = new Date(d.toString());
      if (Number.isNaN(fallback.getTime())) return;
      else date.setTime(fallback.getTime());
    }
    const dateKey = date.toISOString().slice(0, 10);
    if (!map[dateKey]) map[dateKey] = { total: 0, resistant: 0 };
    map[dateKey].total += 1;
    const result = (r.result || r.Result || "").toString().toLowerCase();
    if (result.includes("resist")) map[dateKey].resistant += 1;
  });

  const arr = Object.entries(map).map(([date, v]) => ({
    date,
    total: v.total,
    resistant: v.resistant,
    percent: v.total > 0 ? (v.resistant / v.total) * 100 : 0,
  }));
  arr.sort((a, b) => (a.date > b.date ? 1 : -1));
  return arr;
};

const AMRData = () => {
  const [rows, setRows] = useState([]);
  const [organismFilter, setOrganismFilter] = useState("");
  const [selectedAntibiotic, setSelectedAntibiotic] = useState(null);

  const organisms = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => {
      const o = (r.organism || r.Organism || "").toString().trim();
      if (o) set.add(o);
    });
    return Array.from(set).sort();
  }, [rows]);

  const abxStats = useMemo(() => aggregateByAntibiotic(rows, organismFilter), [rows, organismFilter]);

  const timeseries = useMemo(
    () => (selectedAntibiotic ? timeseriesByDateAntibiotic(rows, selectedAntibiotic) : []),
    [rows, selectedAntibiotic]
  );

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    parseWorkbook(f, (json) => {
      // normalize keys to lower-case for convenience
      const normalized = json.map((r) => {
        const entry = {};
        Object.keys(r).forEach((k) => {
          entry[k.toLowerCase()] = r[k];
        });
        // also expose original common keys for convenience
        // but component functions try several variants
        return Object.keys(r).reduce((acc, k) => ({ ...acc, [k]: r[k] }), { ...entry });
      });
      setRows(normalized);
      setSelectedAntibiotic(null);
      setOrganismFilter("");
    });
  };

  // Chart data for bar chart (Resistance %)
  const barData = {
    labels: abxStats.map((a) => a.antibiotic),
    datasets: [
      {
        label: "% Resistant",
        data: abxStats.map((a) => a.percent.toFixed(1)),
        backgroundColor: "rgba(220,53,69,0.7)",
      },
      {
        label: "Total Tests",
        data: abxStats.map((a) => a.total),
        backgroundColor: "rgba(23,162,184,0.7)",
        yAxisID: "y1",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "% Resistant" } },
      y1: {
        position: "right",
        grid: { drawOnChartArea: false },
        beginAtZero: true,
        title: { display: true, text: "Total tests" },
        ticks: { stepSize: 1 },
      },
    },
  };

  // Line timeseries for selected antibiotic
  const lineData = {
    labels: timeseries.map((t) => t.date),
    datasets: [
      {
        label: "% Resistant",
        data: timeseries.map((t) => t.percent.toFixed(1)),
        borderColor: "#dc3545",
        backgroundColor: "rgba(220,53,69,0.2)",
        tension: 0.2,
      },
      {
        label: "Total tests",
        data: timeseries.map((t) => t.total),
        borderColor: "#17a2b8",
        backgroundColor: "rgba(23,162,184,0.15)",
        yAxisID: "y1",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "% Resistant" } },
      y1: { position: "right", grid: { drawOnChartArea: false }, beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AMR / AST Data</h2>

      <div style={{ marginBottom: 12 }}>
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
        <small style={{ display: "block", color: "#666" }}>
          Upload Excel/CSV with columns: date, organism, antibiotic, result
        </small>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div>
          <label>Filter by organism:</label>
          <select value={organismFilter} onChange={(e) => setOrganismFilter(e.target.value)}>
            <option value="">— All organisms —</option>
            {organisms.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Highlight antibiotic:</label>
          <select
            value={selectedAntibiotic || ""}
            onChange={(e) => setSelectedAntibiotic(e.target.value || null)}
          >
            <option value="">— Select antibiotic (for trend) —</option>
            {abxStats.map((a) => (
              <option key={a.antibiotic} value={a.antibiotic}>
                {a.antibiotic}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h4>Resistance by Antibiotic</h4>
        <Bar data={barData} options={barOptions} />
      </div>

      {selectedAntibiotic && (
        <div style={{ marginBottom: 30 }}>
          <h4>Time trend for {selectedAntibiotic}</h4>
          <Line data={lineData} options={lineOptions} />
        </div>
      )}

      <div>
        <h4>Raw rows loaded: {rows.length}</h4>
        <small style={{ color: "#555" }}>You can inspect the file in devtools console.</small>
      </div>
    </div>
  );
};

export default AMRData;
