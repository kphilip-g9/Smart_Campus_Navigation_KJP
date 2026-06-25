import React, { useMemo, useState, useEffect } from "react";
import { PLACES } from "./data/places.js";
import { dijkstra, generateRouteSteps } from "./utils/graph.js";
import MapView from "./components/MapView.jsx";
import "./App.css";
import { GRAPH } from "./data/adjacency_list.js";

export default function App() {

  // ── Route state ────────────────────────────────────────────────────────────
  const [fromId, setFromIdRaw] = useState("");
  const [toId, setToIdRaw] = useState("");
  const [routeIds, setRouteIds] = useState([]);
  const [routeMeters, setRouteMeters] = useState(0);
  const [routeSteps, setRouteSteps] = useState([]);
  const [viaPoints, setViaPoints] = useState([]);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [useMyLocation, setUseMyLocation] = useState(false);
  const [fromSearch, setFromSearch] = useState("");
  const [fromResults, setFromResults] = useState([]);
  const [toSearch, setToSearch] = useState("");
  const [toResults, setToResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [highlightedPlaceId, setHighlightedPlaceId] = useState(null);
  const [searchSelectedPlace, setSearchSelectedPlace] = useState(null);
  const [showRouteAnimation] = useState(false);

  // ── Navigation state ───────────────────────────────────────────────────────
  const [isNavigating, setIsNavigating] = useState(false);
  const [liveGps, setLiveGps] = useState(null);
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [arrived, setArrived] = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  const namedPlaces = useMemo(
    () => PLACES.filter(p => p.name && p.name.trim() !== ""),
    []
  );

  const routeLatLngs = useMemo(
    () => routeIds
      .map(id => { const p = PLACES.find(pl => pl.id === id); return p ? [p.lat, p.lng] : null; })
      .filter(Boolean),
    [routeIds]
  );

  const destinationPlace = PLACES.find(p => p.id === toId);
  const walkMinutes = routeMeters > 0 ? Math.ceil(routeMeters / 80) : 0;

  // ── Helpers ────────────────────────────────────────────────────────────────
  function setFromId(id) {
    setFromIdRaw(id);
    setUseMyLocation(false);
    const p = namedPlaces.find(p => p.id === id);
    if (p) setFromSearch(p.name);
  }

  function setToId(id) {
    setToIdRaw(id);
    const p = namedPlaces.find(p => p.id === id);
    if (p) setToSearch(p.name);
    setToResults([]);
  }

  function findNearestPlaceId(lat, lng) {
    let nearest = null, minDist = Infinity;
    PLACES.forEach(p => {
      const d = Math.hypot(p.lat - lat, p.lng - lng);
      if (d < minDist) { minDist = d; nearest = p.id; }
    });
    return nearest;
  }

  function handleNavigateFromMyLocation() {
    if (!liveGps) return;
    const nearestId = findNearestPlaceId(liveGps.lat, liveGps.lng);
    setFromIdRaw(nearestId);
    handleFind(nearestId, toId, viaPoints);
  }

  function handleFind(nextFromId, nextToId, nextViaPoints) {
    const f = nextFromId ?? fromId;
    const t = nextToId ?? toId;
    const vias = nextViaPoints ?? viaPoints;
    if (!f || !t) return;

    let fullPath = [], totalDist = 0;
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

  function handleClear() {
    setRouteIds([]); setRouteMeters(0); setRouteSteps([]);
    setSelectedPlace(null); setFromIdRaw(""); setToIdRaw("");
    setFromSearch(""); setToSearch(""); setViaPoints([]);
    setHighlightedPlaceId(null); setUseMyLocation(false);
    setArrived(false); setCurrentInstruction(""); setShowSteps(false);
  }

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    if (isNavigating) setSidebarOpen(false);
  }, [isNavigating]);

  useEffect(() => {
    if (routeLatLngs.length > 1) { setArrived(false); setCurrentInstruction(""); }
  }, [routeLatLngs]);

  useEffect(() => {
    if (fromId && toId) handleFind();
  }, [fromId, toId]);

  // Search filtering
  useEffect(() => {
      if (useMyLocation) { setFromResults([]); return; }
      const q = fromSearch.trim().toLowerCase();
      if (!q) return; // don't show on empty — handled by onFocus
      setFromResults(
          namedPlaces.filter(p =>
              p.name.toLowerCase().includes(q) ||
              (p.aliases || []).some(a => a.toLowerCase().includes(q))
          ).slice(0, 8)
      );
  }, [fromSearch, useMyLocation]);

  useEffect(() => {
      const q = toSearch.trim().toLowerCase();
      if (!q) return; // don't show on empty — handled by onFocus
      setToResults(
          namedPlaces.filter(p =>
              p.name.toLowerCase().includes(q) ||
              (p.aliases || []).some(a => a.toLowerCase().includes(q))
          ).slice(0, 8)
      );
  }, [toSearch]);

  // ── Colours ────────────────────────────────────────────────────────────────
  const bg = darkMode ? "#0f172a" : "#ffffff";
  const surface = darkMode ? "#1e293b" : "#f8fafc";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const muted = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#1e293b" : "#f1f5f9";

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: `1.5px solid ${border}`, background: inputBg, color: text,
    fontSize: "14px", boxSizing: "border-box", outline: "none",
    fontFamily: "inherit",
  };

  const dropdownStyle = {
    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
    background: bg, border: `1px solid ${border}`, borderRadius: "10px",
    zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden",
  };

  const dropdownItemStyle = {
    padding: "11px 14px", cursor: "pointer", fontSize: "14px",
    borderBottom: `1px solid ${border}`, color: text,
    transition: "background 0.1s",
  };

  // ── Sidebar JSX ─────────────────────────────────────────────────────────────
  const sidebar = (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: bg, color: text, overflowY: "auto",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 20px 14px", borderBottom: `1px solid ${border}`,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#2563eb", lineHeight: 1.2 }}>
            Campus Navigator
          </div>
          <div style={{ fontSize: "12px", color: muted, marginTop: "2px" }}>IIT Palakkad</div>
        </div>
        <button
          onClick={() => setDarkMode(d => !d)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", padding: "2px" }}
          title="Toggle dark mode"
        >{darkMode ? "☀️" : "🌙"}</button>
      </div>

      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "22px" }}>

        {/* ── FROM ─────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", color: muted, marginBottom: "10px", textTransform: "uppercase" }}>
            Starting Point
          </div>

          {/* My Location button */}
          <button
            onClick={() => {
              setUseMyLocation(true);
              setFromIdRaw("");
              setFromSearch("");
              setFromResults([]);
            }}
            style={{
              width: "100%", padding: "11px 14px", borderRadius: "10px",
              background: useMyLocation ? "#2563eb" : inputBg,
              color: useMyLocation ? "white" : text,
              border: `1.5px solid ${useMyLocation ? "#2563eb" : border}`,
              cursor: "pointer", textAlign: "left", fontSize: "14px",
              fontWeight: 600, display: "flex", alignItems: "center",
              gap: "8px", marginBottom: "8px", fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: "18px" }}>📍</span>
            Use My Current Location
          </button>

          {/* OR separator */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}>
            <div style={{ flex: 1, height: "1px", background: border }} />
            <span style={{ fontSize: "12px", color: muted }}>or search</span>
            <div style={{ flex: 1, height: "1px", background: border }} />
          </div>

          {/* From search */}
          <div style={{ position: "relative" }}>
            <input
                value={fromSearch}
                onChange={e => {
                    setFromSearch(e.target.value);
                    setUseMyLocation(false);
                    setFromIdRaw("");
                }}
                onFocus={() => {
                    // Show all places immediately on tap
                    setFromResults(namedPlaces.slice(0, 8));
                }}
                onBlur={() => {
                    // Small delay so click on item registers before dropdown closes
                    setTimeout(() => setFromResults([]), 150);
                }}
                placeholder="Search starting building..."
                style={{
                    ...inputStyle,
                    borderColor: (!useMyLocation && fromId) ? "#2563eb" : border,
                }}
            />
            {fromResults.length > 0 && (
              <div style={dropdownStyle}>
                {fromResults.map(p => (
                  <div key={p.id}
                    onClick={() => { setFromId(p.id); setFromResults([]); }}
                    style={dropdownItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = surface}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {useMyLocation && (
            <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "6px", paddingLeft: "2px" }}>
              ✓ GPS location will be used when navigation starts
            </div>
          )}
          {!useMyLocation && fromId && (
            <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "6px", paddingLeft: "2px" }}>
              ✓ {namedPlaces.find(p => p.id === fromId)?.name}
            </div>
          )}
        </div>

        {/* ── TO ───────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", color: muted, marginBottom: "10px", textTransform: "uppercase" }}>
            Destination
          </div>

          <div style={{ position: "relative" }}>
            <input
                value={toSearch}
                onChange={e => {
                    setToSearch(e.target.value);
                    setToIdRaw("");
                }}
                onFocus={() => {
                    // Show all places immediately on tap
                    setToResults(namedPlaces.slice(0, 8));
                }}
                onBlur={() => {
                    setTimeout(() => setToResults([]), 150);
                }}
                placeholder="Search destination building..."
                style={{
                    ...inputStyle,
                    borderColor: toId ? "#2563eb" : border,
                }}
            />
            {toResults.length > 0 && (
              <div style={dropdownStyle}>
                {toResults.map(p => (
                  <div key={p.id}
                    onClick={() => {
                      setToId(p.id);
                      if (fromId || useMyLocation) handleFind(fromId, p.id, viaPoints);
                    }}
                    style={dropdownItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = surface}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    {p.address && <div style={{ fontSize: "12px", color: muted }}>{p.address}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {toId && (
            <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "6px", paddingLeft: "2px" }}>
              ✓ {destinationPlace?.name}
            </div>
          )}

          <div style={{
            marginTop: "10px", padding: "10px 12px", background: surface,
            borderRadius: "8px", fontSize: "12px", color: muted, lineHeight: 1.6,
          }}>
            💡 <strong>Tip:</strong> Tap any blue dot on the map and choose
            <em> "Start from here"</em> or <em>"Reach here"</em>
          </div>
        </div>

        {/* ── Route info ───────────────────────────────────── */}
        {routeLatLngs.length > 1 && (
          <div style={{
            background: darkMode ? "#1e3a5f" : "#eff6ff",
            borderRadius: "12px", padding: "16px",
            border: `1px solid ${darkMode ? "#2563eb44" : "#bfdbfe"}`,
          }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#2563eb" }}>
              📏 {routeMeters} m &nbsp;·&nbsp; ~{walkMinutes} min walk
            </div>
            {destinationPlace && (
              <div style={{ fontSize: "13px", color: muted, marginTop: "3px" }}>
                To {destinationPlace.name}
              </div>
            )}

            {/* Steps toggle */}
            <button
              onClick={() => setShowSteps(s => !s)}
              style={{
                marginTop: "12px", width: "100%",
                background: "none", border: `1px solid ${darkMode ? "#2563eb66" : "#bfdbfe"}`,
                borderRadius: "8px", padding: "8px 12px", cursor: "pointer",
                fontSize: "13px", color: "#2563eb", fontWeight: 600,
                fontFamily: "inherit",
              }}
            >
              {showSteps ? "▲ Hide directions" : "▼ View step-by-step directions"}
            </button>

            {showSteps && (
              <ol style={{
                margin: "12px 0 0", padding: "0 0 0 18px",
                fontSize: "13px", lineHeight: "1.8", color: text,
              }}>
                {routeSteps.map((step, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* ── Clear ────────────────────────────────────────── */}
        {(fromId || toId || useMyLocation) && (
          <button
            onClick={handleClear}
            style={{
              padding: "10px", borderRadius: "10px", background: "none",
              border: `1.5px solid ${border}`, color: muted, cursor: "pointer",
              fontSize: "14px", fontWeight: 600, fontFamily: "inherit",
            }}
          >
            ✕ Clear Route
          </button>
        )}
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={`layout ${darkMode ? "dark" : ""}`}
      style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}
    >
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1800 }}
        />
      )}

      {/* Sidebar */}
      <div style={isMobile ? {
        position: "absolute", top: 0, left: 0, height: "100%",
        width: "300px", zIndex: 1900,
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.25)" : "none",
      } : {
        width: sidebarOpen ? "340px" : "0px",
        minWidth: sidebarOpen ? "340px" : "0px",
        overflow: "hidden",
        transition: "width 0.3s ease, min-width 0.3s ease",
        flexShrink: 0,
      }}>
        {sidebar}
      </div>

      {/* Map */}
      <main className="map-section" style={{ position: "relative", flex: 1, minWidth: 0, width: "100%" }}>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            position: "absolute", top: "10px", left: "10px", zIndex: 1500,
            background: "white", border: "2px solid #2563eb", borderRadius: "8px",
            padding: "7px 11px", cursor: "pointer", fontSize: "18px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)", lineHeight: 1,
          }}
        >
          {sidebarOpen && !isMobile ? "✕" : "☰"}
        </button>

        <MapView
          namedPlaces={namedPlaces}
          routeLatLngs={routeLatLngs}
          routeIds={routeIds}
          showFloatingSteps={false}
          showRouteAnimation={showRouteAnimation}
          routeSteps={routeSteps}
          setSelectedPlace={p => {
            setSelectedPlace(p);
          }}
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

        {/* Bottom bar */}
        {routeLatLngs.length > 1 && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: arrived ? "#16a34a" : isNavigating ? "rgba(15,23,42,0.97)" : "white",
            color: isNavigating || arrived ? "white" : "#1e293b",
            padding: "14px 20px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "12px", boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
            zIndex: 1000, borderRadius: "16px 16px 0 0",
            transition: "background 0.3s ease",
            fontFamily: "Inter, system-ui, sans-serif",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {arrived ? (
                <div style={{ fontSize: "16px", fontWeight: 700 }}>🎉 You have arrived!</div>
              ) : isNavigating ? (
                <div style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.4 }}>
                  {currentInstruction || "Follow the route..."}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "16px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {destinationPlace?.name ?? "Destination set"}
                  </div>
                  <div style={{ fontSize: "13px", color: isNavigating ? "#94a3b8" : "#64748b", marginTop: "2px" }}>
                    {routeMeters}m · ~{walkMinutes} min walk
                  </div>
                </>
              )}
            </div>

            {!arrived && (
              <button
                onClick={() => setIsNavigating(n => !n)}
                style={{
                  padding: "11px 22px", borderRadius: "12px",
                  background: isNavigating ? "#ef4444" : "#2563eb",
                  color: "white", border: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)", flexShrink: 0,
                  fontFamily: "inherit",
                }}
              >
                {isNavigating ? "⏹ Stop" : "▶ Start Navigation"}
              </button>
            )}

            {arrived && (
              <button
                onClick={() => { setArrived(false); setCurrentInstruction(""); handleClear(); }}
                style={{
                  padding: "11px 22px", borderRadius: "12px",
                  background: "white", color: "#16a34a", border: "none",
                  cursor: "pointer", fontSize: "14px", fontWeight: 700,
                  flexShrink: 0, fontFamily: "inherit",
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