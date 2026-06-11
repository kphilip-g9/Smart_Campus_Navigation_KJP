// src/App.jsx
import React, { useMemo, useState, useEffect } from "react";
import { PLACES } from "./data/places.js";
import { buildGraph, dijkstra, generateRouteSteps } from "./utils/graph.js";
import MapView from "./components/MapView.jsx";
import Sidebar from "./components/Sidebar.jsx";
import "./App.css";
import { GRAPH } from "./data/adjacency_list.js";
import InstructionsPanel from "./components/InstructionsPanel.jsx";

export default function App() {
  const graph = GRAPH;

  // ── State ──────────────────────────────────────────────────────────────────
  const [fromId, setFromId] = useState("main_gate");
  const [toId, setToId] = useState("amul");
  const [routeIds, setRouteIds] = useState([]);
  const [routeMeters, setRouteMeters] = useState(0);
  const [routeSteps, setRouteSteps] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showFloatingSteps, setShowFloatingSteps] = useState(false);
  const [showRouteAnimation, setShowRouteAnimation] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viaPoints, setViaPoints] = useState([]);
  const [temperature, setTemperature] = useState(null);
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSelectedPlace, setSearchSelectedPlace] = useState(null);
  const [highlightedPlaceId, setHighlightedPlaceId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [liveGps, setLiveGps] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [arrived, setArrived] = useState(false);

  // ── Derived data ───────────────────────────────────────────────────────────
  const namedPlaces = useMemo(
    () => PLACES.filter((p) => p.name && p.name.trim() !== ""),
    []
  );

  // FIX — routeLatLngs must be declared BEFORE any useEffect that references it
  const routeLatLngs = useMemo(
    () =>
      routeIds
        .map((id) => {
          const p = PLACES.find((pl) => pl.id === id);
          return p ? [p.lat, p.lng] : null;
        })
        .filter(Boolean),
    [routeIds]
  );

  const destinationPlace = PLACES.find((p) => p.id === toId);

  // ── Weather helpers ────────────────────────────────────────────────────────
  const OPENWEATHER_API_KEY = "7b26a657d4aca4e9d60281088ae5d8de";

  async function fetchWeatherData(lat, lng) {
    if (!lat || !lng) return null;
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) throw new Error(`OpenWeather ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Direct weather fetch failed, trying proxy:", err);
      try {
        const res2 = await fetch(`https://corsproxy.io/?${baseUrl}`);
        if (!res2.ok) throw new Error(`Proxy ${res2.status}`);
        return await res2.json();
      } catch (err2) {
        console.error("Both weather fetches failed:", err2);
        return null;
      }
    }
  }

  async function refreshUserWeather() {
    if (!userLocation) return;
    try {
      setLoadingTemp(true);
      const data = await fetchWeatherData(userLocation.lat, userLocation.lng);
      setTemperature(data?.main?.temp ?? null);
    } catch (err) {
      console.error("Reload weather error:", err);
      setTemperature(null);
    } finally {
      setLoadingTemp(false);
    }
  }

  // ── Effects ────────────────────────────────────────────────────────────────

  // Auto-collapse sidebar when navigation starts
  useEffect(() => {
    setSidebarOpen(!isNavigating);
  }, [isNavigating]);

  // Reset arrived when a new route is drawn (routeLatLngs now declared above)
  useEffect(() => {
    if (routeLatLngs.length > 1) {
      setArrived(false);
      setCurrentInstruction("");
    }
  }, [routeLatLngs]);

  // Get user location + weather on first load
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      setUserLocation({ lat: 10.805, lng: 76.728 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        setUserLocation({ lat, lng });
        try {
          setLoadingTemp(true);
          const data = await fetchWeatherData(lat, lng);
          setTemperature(data?.main?.temp ?? null);
        } catch (err) {
          console.error("Weather error:", err);
          setTemperature(null);
        } finally {
          setLoadingTemp(false);
        }
      },
      () => console.warn("Location permission denied or unavailable")
    );
  }, []);

  // Update weather when selected place or user location changes
  useEffect(() => {
    async function fetchWeather(lat, lng) {
      try {
        setLoadingTemp(true);
        const data = await fetchWeatherData(lat, lng);
        setTemperature(data?.main?.temp ?? null);
      } catch (err) {
        console.error("Weather error:", err);
        setTemperature(null);
      } finally {
        setLoadingTemp(false);
      }
    }
    if (selectedPlace) {
      fetchWeather(selectedPlace.lat, selectedPlace.lng);
      return;
    }
    if (userLocation) {
      fetchWeather(userLocation.lat, userLocation.lng);
    }
  }, [selectedPlace, userLocation]);

  // Re-run route when fromId or toId changes
  useEffect(() => {
    if (fromId && toId) handleFind();
  }, [fromId, toId]);

  // ── Route helpers ──────────────────────────────────────────────────────────
  function handleFind(nextFromId, nextToId, nextViaPoints) {
    const f = nextFromId ?? fromId;
    const t = nextToId ?? toId;
    const vias = nextViaPoints ?? viaPoints;
    if (!f || !t) return;

    let fullPath = [];
    let totalDist = 0;
    const sequence = [f, ...vias, t];

    for (let i = 0; i < sequence.length - 1; i++) {
      const { path, dist } = dijkstra(GRAPH, sequence[i], sequence[i + 1]);
      if (!path || path.length === 0) continue;
      fullPath = i === 0 ? [...path] : [...fullPath, ...path.slice(1)];
      totalDist += dist;
    }

    setRouteIds(fullPath);
    setRouteMeters(Math.round(totalDist));
    setRouteSteps(generateRouteSteps(fullPath));
  }

  function addViaPoint(id) {
    setViaPoints((prev) => {
      const newVia = [...prev, id];
      handleFind(fromId, toId, newVia);
      return newVia;
    });
  }

  function handleClear() {
    setRouteIds([]);
    setRouteMeters(0);
    setRouteSteps([]);
    setSelectedPlace(null);
    setFromId("");
    setToId("");
    setViaPoints([]);
    setHighlightedPlaceId(null);
  }

  // ── Navigation helpers ─────────────────────────────────────────────────────
  function findNearestPlaceId(lat, lng) {
    let nearest = null;
    let minDist = Infinity;
    PLACES.forEach((p) => {
      const d = Math.hypot(p.lat - lat, p.lng - lng);
      if (d < minDist) { minDist = d; nearest = p.id; }
    });
    return nearest;
  }

  function handleNavigateFromMyLocation() {
    if (!liveGps) {
      alert("Location not available yet. Allow location access and try again.");
      return;
    }
    const nearestId = findNearestPlaceId(liveGps.lat, liveGps.lng);
    setFromId(nearestId);
    handleFind(nearestId, toId, viaPoints);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={`layout ${darkMode ? "dark" : ""}`}
      style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <InstructionsPanel
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        darkMode={darkMode}
      />

      {/* Collapsible sidebar */}
      <div style={{
        width: sidebarOpen ? "320px" : "0px",
        minWidth: sidebarOpen ? "320px" : "0px",
        overflow: "hidden",
        transition: "width 0.3s ease, min-width 0.3s ease",
        flexShrink: 0,
      }}>
        <Sidebar
          fromId={fromId}
          toId={toId}
          namedPlaces={namedPlaces}
          routeMeters={routeMeters}
          routeSteps={routeSteps}
          showFloatingSteps={showFloatingSteps}
          setShowFloatingSteps={setShowFloatingSteps}
          setShowRouteAnimation={setShowRouteAnimation}
          setFromId={setFromId}
          setToId={setToId}
          handleClear={handleClear}
          handleFind={handleFind}
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          temperature={temperature}
          loadingTemp={loadingTemp}
          viaPoints={viaPoints}
          setViaPoints={setViaPoints}
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setHighlightedPlaceId={setHighlightedPlaceId}
          highlightedPlaceId={highlightedPlaceId}
        />
      </div>

      {/* Map section */}
      <main className="map-section" style={{ position: "relative", flex: 1, minWidth: 0 }}>

        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1500,
            background: "white",
            border: "2px solid #2563eb",
            borderRadius: "8px",
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            lineHeight: 1,
          }}
        >
          {sidebarOpen ? "◀" : "☰"}
        </button>

        <MapView
          namedPlaces={namedPlaces}
          routeLatLngs={routeLatLngs}
          routeIds={routeIds}
          showFloatingSteps={showFloatingSteps}
          showRouteAnimation={showRouteAnimation}
          routeSteps={routeSteps}
          setSelectedPlace={setSelectedPlace}
          fromId={fromId}
          setFromId={setFromId}
          toId={toId}
          setToId={setToId}
          handleFind={handleFind}
          darkMode={darkMode}
          viaPoints={viaPoints}
          setViaPoints={setViaPoints}
          searchSelectedPlace={searchSelectedPlace}
          setSearchSelectedPlace={setSearchSelectedPlace}
          highlightedPlaceId={highlightedPlaceId}
          isNavigating={isNavigating}
          setIsNavigating={setIsNavigating}
          setLiveGps={setLiveGps}
          onNavigateFromLocation={handleNavigateFromMyLocation}
          sidebarOpen={sidebarOpen}
          setCurrentInstruction={setCurrentInstruction}
          setArrived={setArrived}
        />

        {/* Bottom bar — Google Maps style */}
        {routeLatLngs.length > 1 && (
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            background: arrived
              ? "#16a34a"
              : isNavigating
                ? "rgba(30,41,59,0.97)"
                : "white",
            color: isNavigating || arrived ? "white" : "#1e293b",
            padding: "14px 20px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
            zIndex: 1000,
            borderRadius: "16px 16px 0 0",
            transition: "background 0.3s ease",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {arrived ? (
                <div style={{ fontSize: "16px", fontWeight: 700 }}>
                  🎉 You have arrived!
                </div>
              ) : isNavigating ? (
                <div style={{ fontSize: "15px", fontWeight: 600, lineHeight: 1.4 }}>
                  {currentInstruction || "Follow the route..."}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "16px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {destinationPlace?.name ?? "Destination"}
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                    {routeMeters > 0 ? `${routeMeters} m away` : "Route ready"}
                  </div>
                </>
              )}
            </div>

            {!arrived && (
              <button
                onClick={() => setIsNavigating((n) => !n)}
                style={{
                  padding: "10px 22px",
                  borderRadius: "12px",
                  background: isNavigating ? "#ef4444" : "#2563eb",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  flexShrink: 0,
                }}
              >
                {isNavigating ? "⏹ Stop" : "▶ Start Navigation"}
              </button>
            )}

            {arrived && (
              <button
                onClick={() => {
                  setArrived(false);
                  setCurrentInstruction("");
                  handleClear();
                }}
                style={{
                  padding: "10px 22px",
                  borderRadius: "12px",
                  background: "white",
                  color: "#16a34a",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                Done
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}