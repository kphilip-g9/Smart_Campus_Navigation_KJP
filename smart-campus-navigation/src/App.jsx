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
  const [fromId, setFromId] = useState("main_gate");
  const [toId, setToId] = useState("amul");
  const [routeIds, setRouteIds] = useState([]);
  const [routeMeters, setRouteMeters] = useState(0);
  const [routeSteps, setRouteSteps] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showFloatingSteps, setShowFloatingSteps] = useState(false);
  const [showRouteAnimation, setShowRouteAnimation] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const namedPlaces = useMemo(() => PLACES.filter((p) => p.name && p.name.trim() !== ""), []);
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

  // Put your API key in an env variable in production. For now using inline
  const OPENWEATHER_API_KEY = "7b26a657d4aca4e9d60281088ae5d8de";
  async function fetchWeatherData(lat, lng) {
    if (!lat || !lng) return null;

    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    // Try direct request first
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) {
        // Non-OK (4xx/5xx) — throw to go to fallback
        throw new Error(`OpenWeather response not ok: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn("Direct OpenWeather fetch failed, trying corsproxy fallback:", err);

      // Fallback: use a CORS proxy as a last resort (temporary)
      try {
        const proxyUrl = `https://corsproxy.io/?${baseUrl}`;
        const res2 = await fetch(proxyUrl);
        if (!res2.ok) {
          throw new Error(`Proxy response not ok: ${res2.status}`);
        }
        const data2 = await res2.json();
        return data2;
      } catch (err2) {
        console.error("Both direct and proxy weather fetch failed:", err2);
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

  // Get user's current location and weather on first load
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      setUserLocation({ lat: 10.805, lng: 76.728 }); // fallback: campus center
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
      () => {
        console.warn("Permission denied or unavailable");
      }
    );
  }, []);


  //  Update weather whenever a building is selected or user location changes
  useEffect(() => {
    async function fetchWeather(lat, lng) {
      try {
        setLoadingTemp(true);
        const data = await fetchWeatherData(lat, lng);
        setTemperature(data?.main?.temp ?? null);
      } catch (err) {
        console.error("Weather Error:", err);
        setTemperature(null);
      } finally {
        setLoadingTemp(false);
      }
    }

    // CASE 1 — building selected → fetch building weather
    if (selectedPlace) {
      fetchWeather(selectedPlace.lat, selectedPlace.lng);
      return;
    }

    // CASE 2 — no building selected → fetch user location weather
    if (userLocation) {
      fetchWeather(userLocation.lat, userLocation.lng);
    }

  }, [selectedPlace, userLocation]);

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
        alert("Your location isn't available yet. Make sure you've allowed location access and the blue dot is visible on the map.");
        return;
    }
    const nearestId = findNearestPlaceId(liveGps.lat, liveGps.lng);
    setFromId(nearestId);
    handleFind(nearestId, toId, viaPoints);
}
  function handleFind(nextFromId, nextToId, nextViaPoints) {
    const f = nextFromId ?? fromId;
    const t = nextToId ?? toId;
    const vias = nextViaPoints ?? viaPoints;

    if (!f || !t) return;

    let fullPath = [];
    let totalDist = 0;

    // Route sequence: [from, via1, via2, ..., to]
    const sequence = [f, ...vias, t];

    for (let i = 0; i < sequence.length - 1; i++) {
      const { path, dist } = dijkstra(GRAPH, sequence[i], sequence[i + 1]);

      if (!path || path.length === 0) continue;

      if (i === 0) {
        fullPath = [...path]; // first segment full
      } else {
        fullPath = [...fullPath, ...path.slice(1)]; // avoid duplicating nodes
      }

      totalDist += dist;
    }

    setRouteIds(fullPath);
    setRouteMeters(Math.round(totalDist));
    setRouteSteps(generateRouteSteps(fullPath));
  }


  function addViaPoint(id) {
    setViaPoints((prev) => {
      const newVia = [...prev, id];

      handleFind(fromId, toId, newVia); // route immediately

      return newVia;
    });
  }

  useEffect(() => {
    if (fromId && toId) {
      handleFind(); // will use latest fromId/toId
    }
  }, [fromId, toId]);


  function handleClear() {
    setRouteIds([]);
    setRouteMeters(0);
    setRouteSteps([]);
    setSelectedPlace(null);
    setFromId("");
    setToId("");
    setViaPoints([]);
    setHighlightedPlaceId(null);
    // do not call refreshUserWeather here automatically to avoid spamming requests
  }

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

  return (
    <div className={`layout ${darkMode ? "dark" : ""}`}>
      {/* Instructions overlay */}
      <InstructionsPanel
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        darkMode={darkMode}
      />

      {/* Sidebar */}
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

      <main className="map-section">
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
          liveGps={liveGps}
          setLiveGps={setLiveGps}
          onNavigateFromLocation={handleNavigateFromMyLocation}
        />
      </main>
    </div>
  );
}
