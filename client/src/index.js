// --- Imports must come first ---
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🎨 Material UI imports (must be at top)
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// --- Leaflet marker icon setup ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// --- Custom MUI theme ---
const theme = createTheme({
  palette: {
    primary: { main: "#1565c0" },
    secondary: { main: "#43a047" },
    background: { default: "#f4f6f8" },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

// --- App rendering ---
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// --- Optional: performance logging ---
reportWebVitals();
