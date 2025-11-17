import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GeneralCase = ({ formData, updateFormData, readOnly = false }) => {
  const [gpsLocation, setGpsLocation] = useState(
    formData.gpsLocation
      ? {
          lat: parseFloat(formData.gpsLocation.split(",")[0]),
          lng: parseFloat(formData.gpsLocation.split(",")[1]),
        }
      : null
  );
  const [accuracy, setAccuracy] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const watchIdRef = useRef(null);
  const refineTimerRef = useRef(null);

  /** 🔁 Reverse geocode via OpenStreetMap (Improved) */
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        {
          headers: {
            "User-Agent": "VSD-EpiC-Ghana/1.0 (vsdepicghana@gmail.com)",
            "Accept-Language": "en",
          },
        }
      );

      const data = await res.json();
      if (!data?.address) {
        console.warn("⚠️ No address found for this location:", data);
        return;
      }

      const {
        village,
        town,
        city,
        suburb,
        municipality,
        county,
        district,
        state_district,
        state,
        region,
      } = data.address;

      const community = village || town || suburb || city || "";
      const districtName =
        district || municipality || county || state_district || city || "";
      const regionName = region || state || "";

      updateFormData("community", community);
      updateFormData("district", districtName);
      updateFormData("region", regionName);

      console.log("✅ Reverse geocoded:", {
        community,
        districtName,
        regionName,
      });
    } catch (err) {
      console.error("❌ Reverse geocode failed:", err);
    }
  };

  /** 📍 Stop GPS watcher */
  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (refineTimerRef.current) {
      clearTimeout(refineTimerRef.current);
      refineTimerRef.current = null;
    }
  };

  /** ✅ High-accuracy GPS detection with refinement */
  const detectLocation = () => {
    if (readOnly) return;
    if (!navigator.geolocation) {
      alert("❌ Geolocation not supported on this device.");
      return;
    }

    stopWatching();
    setAccuracy(null);

    let best = { acc: Infinity, lat: null, lng: null };

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
        if (acc < best.acc) {
          best = { acc, lat, lng };
          setAccuracy(acc);
          setGpsLocation({ lat, lng });
          updateFormData("gpsLocation", `${lat}, ${lng}`);
          reverseGeocode(lat, lng);
        }
        if (acc <= 25) stopWatching(); // good enough
      },
      (err) => {
        console.error("GPS Error:", err);
        alert("⚠️ Could not detect location. Please enable precise location.");
        stopWatching();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    // stop after 12s if still running
    refineTimerRef.current = setTimeout(() => {
      stopWatching();
      if (!best.lat) {
        alert(
          "⚠️ Could not get a reliable GPS fix. Try moving outdoors or enabling High Accuracy mode."
        );
      }
    }, 12000);
  };

  useEffect(() => () => stopWatching(), []);

  /** 🗺️ Marker & accuracy circle on map */
  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (readOnly) return;
        const { lat, lng } = e.latlng;
        setGpsLocation({ lat, lng });
        updateFormData("gpsLocation", `${lat}, ${lng}`);
        reverseGeocode(lat, lng);
        setAccuracy(null);
      },
    });

    return gpsLocation ? (
      <>
        <Marker
          position={gpsLocation}
          draggable={!readOnly}
          eventHandlers={
            !readOnly
              ? {
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    setGpsLocation({ lat, lng });
                    updateFormData("gpsLocation", `${lat}, ${lng}`);
                    reverseGeocode(lat, lng);
                    setAccuracy(null);
                  },
                }
              : {}
          }
        />
        {accuracy && accuracy < 5000 && (
          <Circle
            center={gpsLocation}
            radius={accuracy}
            pathOptions={{ color: "#1E90FF", fillColor: "#1E90FF", fillOpacity: 0.15 }}
          />
        )}
      </>
    ) : null;
  }

  /** 🔍 Live search (Photon API) */
  const handleSearchChange = async (value) => {
    if (readOnly) return;
    setSearchQ(value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(
          value
        )}&limit=5&lang=en`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.error("Search suggestion error:", err);
    }
  };

  /** When user selects a suggestion */
  const selectSuggestion = (feature) => {
    if (readOnly) return;
    const lat = feature.geometry.coordinates[1];
    const lon = feature.geometry.coordinates[0];
    const name =
      feature.properties.name ||
      feature.properties.city ||
      feature.properties.country ||
      "";
    setGpsLocation({ lat, lng: lon });
    updateFormData("gpsLocation", `${lat}, ${lon}`);
    updateFormData("community", name);
    reverseGeocode(lat, lon);
    setSearchQ(name);
    setSuggestions([]);
  };

  /** Checkbox handler for diseases */
  const handleCheckbox = (name, value, checked) => {
    if (readOnly) return;
    const updated = checked
      ? [...(formData[name] || []), value]
      : (formData[name] || []).filter((v) => v !== value);
    updateFormData(name, updated);
  };

  return (
    <section className="form-section">
      <h3>General Case Information</h3>

      <label>Date Reported *</label>
      <input
        type="date"
        value={formData.dateReported || ""}
        onChange={(e) => updateFormData("dateReported", e.target.value)}
        required
        disabled={readOnly}
      />

      <label>Priority Zoonotic Disease(s) *</label>
      <div className="checkbox-group">
        {[
          "tuberculosis",
          "rabies",
          "viral_haemorrhagic_fever",
          "anthrax",
          "avian_influenza",
          "trypanosomiasis",
        ].map((d) => (
          <label key={d}>
            <input
              type="checkbox"
              checked={formData.priorityDiseases?.includes(d) || false}
              onChange={(e) => handleCheckbox("priorityDiseases", d, e.target.checked)}
              disabled={readOnly}
            />
            {d.replaceAll("_", " ")}
          </label>
        ))}
      </div>

      <label>Type of Case *</label>
      <select
        value={formData.typeOfCase || ""}
        onChange={(e) => updateFormData("typeOfCase", e.target.value)}
        required
        disabled={readOnly}
      >
        <option value="">-- Select --</option>
        <option value="human">Human</option>
        <option value="animal">Animal</option>
        <option value="both">Both</option>
      </select>

      <label>Number of Cases *</label>
      <input
        type="number"
        value={formData.numberOfCases || ""}
        onChange={(e) => updateFormData("numberOfCases", e.target.value)}
        required
        disabled={readOnly}
      />

      <label>Region *</label>
      <input
        type="text"
        value={formData.region || ""}
        onChange={(e) => updateFormData("region", e.target.value)}
        placeholder="Auto-filled after GPS or search"
        required
        disabled={readOnly}
      />

      <label>District (MMDA) *</label>
      <input
        type="text"
        value={formData.district || ""}
        onChange={(e) => updateFormData("district", e.target.value)}
        placeholder="Auto-filled after GPS or search"
        required
        disabled={readOnly}
      />

      <label>Community / Town</label>
      <input
        type="text"
        value={formData.community || ""}
        onChange={(e) => updateFormData("community", e.target.value)}
        placeholder="Auto-filled after GPS or search"
        disabled={readOnly}
      />

      <label>📍 GPS Location {accuracy ? `(±${Math.round(accuracy)} m)` : ""}</label>
      {!readOnly && (
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button type="button" onClick={detectLocation}>
              Use / Refine My Location
            </button>
            <input
              type="text"
              placeholder="Search landmarks, towns, or hospitals..."
              value={searchQ}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>

          {suggestions.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: "5px",
                border: "1px solid #ccc",
                background: "white",
                position: "absolute",
                width: "100%",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((s) => (
                <li
                  key={`${s.properties.osm_id}-${s.properties.name}`}
                  onClick={() => selectSuggestion(s)}
                  style={{
                    padding: "5px 8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {s.properties.name}{" "}
                  <small style={{ color: "#777" }}>
                    {s.properties.city || s.properties.country}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <MapContainer
        key={gpsLocation ? `${gpsLocation.lat},${gpsLocation.lng}` : "default"}
        center={gpsLocation || [7.9465, -1.0232]}
        zoom={gpsLocation ? 13 : 6}
        style={{ height: "300px", width: "100%", marginTop: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker />
      </MapContainer>

      <label>Or Enter Lat, Long Manually</label>
      <input
        type="text"
        placeholder="Lat, Long"
        value={formData.gpsLocation || ""}
        onChange={(e) => {
          if (readOnly) return;
          updateFormData("gpsLocation", e.target.value);
          const [lat, lng] = e.target.value.split(",").map((v) => parseFloat(v));
          if (!isNaN(lat) && !isNaN(lng)) {
            setGpsLocation({ lat, lng });
            reverseGeocode(lat, lng);
          }
        }}
        disabled={readOnly}
      />
    </section>
  );
};

export default GeneralCase;
