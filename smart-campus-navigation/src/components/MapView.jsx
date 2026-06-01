// src/components/MapView.jsx
import React, { useState, useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    LayersControl,
    useMapEvents,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import { PLACES } from "../data/places.js";
import { PATHS } from "../data/paths.js";
import FitBounds from "./FitBounds.jsx";
import RouteDirectionArrows from "./RouteDirectionArrows.jsx";

// import FloatingStepMarkers from "./FloatingStepMarkers.jsx";

const { BaseLayer } = LayersControl;
const StartIcon = new L.DivIcon({
    html: `<div style="
    width:14px;
    height:14px;
    background:#16a34a;
    border-radius:50%;
    border:2px solid #fff;
    box-shadow:0 0 8px rgba(22,163,74,0.6);
  "></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

const ViaIcon = new L.DivIcon({
    html: `<div style="
    width:14px;
    height:14px;
    background:#facc15;
    border-radius:50%;
    border:2px solid #fff;
    box-shadow:0 0 8px rgba(22,163,74,0.6);
  "></div>`,
    className: "",
    iconSize: [2, 2],
    iconAnchor: [1, 1],
});

const EndIcon = new L.DivIcon({
    html: `<div style="
    width:14px;
    height:14px;
    background:#dc2626;
    border-radius:50%;
    border:2px solid #fff;
    box-shadow:0 0 8px rgba(220,38,38,0.6);
  "></div>`,
    className: "",
    iconSize: [2, 2],
    iconAnchor: [1, 1],
});

/* --- building dot icon --- */
const DotIcon = new L.DivIcon({
    className: "custom-dot-marker",
    html: `<div class="dot"></div>`,
    iconSize: [2, 2],
    iconAnchor: [1, 1],
});

/* --- Traveller (blue dot) --- */
const TravellerIcon = new L.DivIcon({
    className: "traveller-icon",
    html: `<div style="
    width:16px;height:16px;border-radius:50%;
    background:#00b4d8;border:2px solid white;
    box-shadow:0 0 10px rgba(0,180,216,0.9);
  "></div>`,
    iconSize: [2, 2],
    iconAnchor: [1, 1],
});

/* --- Live Location Tracker --- */
function LiveLocationTracker({
    routeLatLngs,
    routeSteps,
    isNavigating,
    setIsNavigating,
    setLiveGps,
    onNavigateFromLocation,
}) {
    const map = useMap();
    const [watching, setWatching] = useState(false);
    const [currentInstruction, setCurrentInstruction] = useState("");
    const [arrived, setArrived] = useState(false);

    const watchIdRef = useRef(null);
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const completedLineRef = useRef(null);
    const remainingLineRef = useRef(null);
    const firstFixRef = useRef(true);
    const latestGpsRef = useRef(null);

    // Stale closure fix
    const isNavigatingRef = useRef(isNavigating);
    const routeLatLngsRef = useRef(routeLatLngs);
    const routeStepsRef = useRef(routeSteps);
    useEffect(() => { isNavigatingRef.current = isNavigating; }, [isNavigating]);
    useEffect(() => { routeLatLngsRef.current = routeLatLngs; }, [routeLatLngs]);
    useEffect(() => { routeStepsRef.current = routeSteps; }, [routeSteps]);

    // Reset arrived state when a new route is chosen
    useEffect(() => {
        if (routeLatLngs && routeLatLngs.length > 1) {
            setArrived(false);
            setCurrentInstruction("");
        }
    }, [routeLatLngs]);

    // Clear split lines when navigation stops
    useEffect(() => {
        if (!isNavigating) {
            if (completedLineRef.current) {
                map.removeLayer(completedLineRef.current);
                completedLineRef.current = null;
            }
            if (remainingLineRef.current) {
                map.removeLayer(remainingLineRef.current);
                remainingLineRef.current = null;
            }
        }
    }, [isNavigating, map]);

    function distMetres(a, b) {
        const R = 6371000;
        const dLat = (b[0] - a[0]) * Math.PI / 180;
        const dLng = (b[1] - a[1]) * Math.PI / 180;
        const sin2 =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(a[0] * Math.PI / 180) *
            Math.cos(b[0] * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.asin(Math.sqrt(sin2));
    }

    function snapToRoute(latlng, route) {
        let bestSegIdx = 0;
        let bestDist = Infinity;
        let bestSnapped = route[0];

        for (let i = 0; i < route.length - 1; i++) {
            const A = route[i];
            const B = route[i + 1];
            const ax = A[1], ay = A[0];
            const bx = B[1], by = B[0];
            const px = latlng[1], py = latlng[0];
            const dx = bx - ax, dy = by - ay;
            const lenSq = dx * dx + dy * dy;
            if (lenSq === 0) continue;
            let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
            t = Math.max(0, Math.min(1, t));
            const snapped = [ay + t * dy, ax + t * dx];
            const d = distMetres(latlng, snapped);
            if (d < bestDist) {
                bestDist = d;
                bestSegIdx = i;
                bestSnapped = snapped;
            }
        }

        return {
            snapped: bestDist < 40 ? bestSnapped : latlng,
            segIdx: bestSegIdx,
            onRoute: bestDist < 40,
        };
    }

    const toggleTracking = () => {
        if (watching) {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            [dotRef, ringRef, completedLineRef, remainingLineRef].forEach(ref => {
                if (ref.current) { map.removeLayer(ref.current); ref.current = null; }
            });
            firstFixRef.current = true;
            latestGpsRef.current = null;
            setWatching(false);
            setIsNavigating(false);
            setCurrentInstruction("");
            setArrived(false);
            return;
        }

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setWatching(true);
        firstFixRef.current = true;

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                const rawLatlng = [latitude, longitude];

                latestGpsRef.current = rawLatlng;
                setLiveGps({ lat: latitude, lng: longitude });

                const currentRoute = routeLatLngsRef.current;
                const currentSteps = routeStepsRef.current;
                const navigating = isNavigatingRef.current;

                // Snap dot to route line if navigating and on route
                let displayLatlng = rawLatlng;
                let segIdx = 0;
                if (navigating && currentRoute && currentRoute.length > 1) {
                    const result = snapToRoute(rawLatlng, currentRoute);
                    displayLatlng = result.snapped;
                    segIdx = result.segIdx;
                }

                // Redraw blue dot at snapped position
                if (dotRef.current) map.removeLayer(dotRef.current);
                dotRef.current = L.circleMarker(displayLatlng, {
                    radius: 9,
                    fillColor: "#2563eb",
                    color: "white",
                    weight: 2.5,
                    fillOpacity: 1,
                    zIndexOffset: 1000,
                }).addTo(map);

                // Accuracy ring stays at real GPS
                if (ringRef.current) map.removeLayer(ringRef.current);
                ringRef.current = L.circle(rawLatlng, {
                    radius: accuracy,
                    color: "#2563eb",
                    fillColor: "#2563eb",
                    fillOpacity: 0.10,
                    weight: 1,
                }).addTo(map);

                // Only auto-pan on first GPS fix
                if (firstFixRef.current) {
                    map.flyTo(rawLatlng, 18, { animate: true, duration: 1.5 });
                    firstFixRef.current = false;
                }

                if (!navigating || !currentRoute || currentRoute.length < 2) return;

                // Arrival check — use real GPS, not snapped
                const dest = currentRoute[currentRoute.length - 1];
                if (distMetres(rawLatlng, dest) < 20) {
                    setCurrentInstruction("🎉 You have arrived at your destination!");
                    setArrived(true);
                    setIsNavigating(false);
                    return;
                }

                // BUG 1 FIX — correct denominator so last step fires
                const stepIndex = Math.min(
                    Math.floor(
                        (segIdx / Math.max(currentRoute.length - 1, 1)) * currentSteps.length
                    ),
                    currentSteps.length - 1
                );
                setCurrentInstruction(currentSteps[stepIndex] || "Continue along the path");

                // Grey = completed path up to current snapped position
                if (completedLineRef.current) map.removeLayer(completedLineRef.current);
                completedLineRef.current = L.polyline(
                    [...currentRoute.slice(0, segIdx + 1), displayLatlng],
                    { color: "#94a3b8", weight: 6, opacity: 0.8 }
                ).addTo(map);

                // Blue = remaining path from snapped position to destination
                if (remainingLineRef.current) map.removeLayer(remainingLineRef.current);
                remainingLineRef.current = L.polyline(
                    [displayLatlng, ...currentRoute.slice(segIdx + 1)],
                    { color: "#2563eb", weight: 6 }
                ).addTo(map);
            },
            (err) => {
                const msgs = {
                    1: "Location access denied. Please allow it in browser settings.",
                    2: "Location unavailable. Try stepping outdoors.",
                    3: "Location request timed out. Try again.",
                };
                alert(msgs[err.code] || "Could not get your location.");
                setWatching(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null)
                navigator.geolocation.clearWatch(watchIdRef.current);
            [dotRef, ringRef, completedLineRef, remainingLineRef].forEach(ref => {
                if (ref.current) map.removeLayer(ref.current);
            });
        };
    }, [map]);

    return (
        <>
            {/* Instruction box — top centre, visible during navigation and on arrival */}
            {(isNavigating || arrived) && currentInstruction && (
                <div style={{
                    position: "absolute",
                    top: "16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: arrived ? "#16a34a" : "rgba(37,99,235,0.95)",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: "14px",
                    fontSize: "14px",
                    fontWeight: "600",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    zIndex: 1100,
                    maxWidth: "300px",
                    textAlign: "center",
                    lineHeight: "1.5",
                    pointerEvents: "none",
                }}>
                    {currentInstruction}
                </div>
            )}

            {/* BUG 2 FIX — hint card moved to 310px so it clears all buttons */}
            {watching && !isNavigating && !arrived && (
                <div style={{
                    position: "absolute",
                    bottom: "310px",
                    right: "10px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    fontSize: "12px",
                    color: "#334155",
                    zIndex: 1000,
                    maxWidth: "190px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                    lineHeight: "1.9",
                }}>
                    <div style={{ fontWeight: "700", marginBottom: "4px", color: "#1e293b" }}>
                        How to navigate:
                    </div>
                    {routeLatLngs && routeLatLngs.length > 1 ? (
                        <>
                            <div>✅ Route is ready</div>
                            <div>👇 Tap <b>Navigate from here</b></div>
                            <div>▶️ Then <b>Start Navigation</b></div>
                        </>
                    ) : (
                        <>
                            <div>1️⃣ Tap any building</div>
                            <div>2️⃣ Tap <b>Reach here</b></div>
                            <div>3️⃣ Tap <b>Navigate from here</b></div>
                            <div>4️⃣ Tap <b>Start Navigation</b></div>
                        </>
                    )}
                </div>
            )}

            {/* Button cluster — bottom right */}
            <div style={{
                position: "absolute",
                bottom: "90px",
                right: "10px",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "flex-end",
            }}>
                {/* Recentre button */}
                {watching && (
                    <button
                        onClick={() => {
                            if (latestGpsRef.current) {
                                map.flyTo(latestGpsRef.current, 18, {
                                    animate: true,
                                    duration: 1.0,
                                });
                            }
                        }}
                        title="Recentre map on my location"
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: "white",
                            color: "#2563eb",
                            border: "2px solid #2563eb",
                            cursor: "pointer",
                            fontSize: "18px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        🎯
                    </button>
                )}

                {/* Navigate from my location */}
                {watching && (
                    <button
                        onClick={onNavigateFromLocation}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "20px",
                            background: "#16a34a",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                            whiteSpace: "nowrap",
                        }}
                    >
                        🧭 Navigate from here
                    </button>
                )}

                {/* Start / Stop Navigation */}
                {watching && routeLatLngs && routeLatLngs.length > 1 && (
                    <button
                        onClick={() => {
                            setArrived(false);
                            setIsNavigating(n => !n);
                        }}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "20px",
                            background: isNavigating ? "#ef4444" : "#f59e0b",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {isNavigating ? "⏹ Stop Navigation" : "▶ Start Navigation"}
                    </button>
                )}

                {/* Location dot toggle */}
                <button
                    onClick={toggleTracking}
                    title={watching ? "Stop tracking my location" : "Show my location"}
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: watching ? "#2563eb" : "white",
                        color: watching ? "white" : "#2563eb",
                        border: "2px solid #2563eb",
                        cursor: "pointer",
                        fontSize: "20px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    📍
                </button>
            </div>
        </>
    );
}

/* --- Route animation with Play / Pause and Directions --- */
function RouteAnimation({ routeLatLngs, routeSteps }) {
    const [playing, setPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState("");
    const markerRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!routeLatLngs || routeLatLngs.length < 2) return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!playing) return;
        let stepIndex = 0;
        setCurrentStep(routeSteps[0] || "Starting route...");
        intervalRef.current = setInterval(() => {
            stepIndex++;

            if (stepIndex >= routeSteps.length) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setPlaying(false);
                setCurrentStep("You have arrived at your destination");
                return;
            }
            const posIndex = Math.floor(
                (stepIndex / (routeSteps.length - 1)) * (routeLatLngs.length - 1)
            );
            if (markerRef.current && routeLatLngs[posIndex]) {
                markerRef.current.setLatLng(routeLatLngs[posIndex]);
            }

            // update visible text
            if (routeSteps[stepIndex]) {
                setCurrentStep(routeSteps[stepIndex]);
            }
        }, 2000); // 2s per step = slower & smoother

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [routeLatLngs, playing, routeSteps]);

    if (!routeLatLngs || routeLatLngs.length < 2) return null;

    return (
        <>
            {/* Blue moving dot */}
            <Marker
                ref={markerRef}
                position={routeLatLngs[0]}
                icon={L.divIcon({
                    html: `
            <div style="
              width:16px;
              height:16px;
              border-radius:50%;
              background:#00b4d8;
              border:2px solid white;
              box-shadow:0 0 12px rgba(0,180,216,0.8);
            "></div>
          `,
                    className: "",
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                })}
                interactive={false}
            />

            {/* Top-left direction box */}
            {currentStep && (
                <div
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        background: "rgba(37,99,235,0.96)",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                        zIndex: 1000,
                        maxWidth: "280px",
                        lineHeight: "1.4",
                    }}
                >
                    {currentStep}
                </div>
            )}

            {/* Bottom-left play/pause button */}
            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    zIndex: 1000,
                }}
            >
                <button
                    onClick={() => setPlaying((p) => !p)}
                    style={{
                        background: playing ? "#ef4444" : "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    }}
                >
                    {playing ? "Pause" : "Play"}
                </button>
            </div>
        </>
    );
}

function MapEventsHelper({ searchSelectedPlace }) {
    const map = useMap();

    useEffect(() => {
        if (!searchSelectedPlace) return;

        map.flyTo([searchSelectedPlace.lat, searchSelectedPlace.lng], 18, {
            animate: true,
            duration: 1.3
        });

    }, [searchSelectedPlace, map]);

    return null;
}
function JumpToLocationHelper({ setSelectedPlace }) {
    const map = useMap();

    useEffect(() => {
        function handleJump(e) {
            const place = e.detail;
            map.flyTo([place.lat, place.lng], 18, {
                animate: true,
                duration: 1.2,
            });
            setSelectedPlace(place);
        }

        window.addEventListener("jumpToLocation", handleJump);
        return () => window.removeEventListener("jumpToLocation", handleJump);
    }, [map]);

    return null;
}

/* -------------------- MAIN MAP COMPONENT -------------------- */
export default function MapView({
    namedPlaces,
    routeLatLngs,
    routeIds,
    showFloatingSteps,
    showRouteAnimation,
    routeSteps,
    setSelectedPlace,
    fromId,
    toId,
    setFromId,
    setToId,
    handleFind,
    darkMode,
    viaPoints,
    setViaPoints,
    searchSelectedPlace,
    setSearchSelectedPlace,
    highlightedPlaceId,
    isNavigating,
    setIsNavigating,
    setLiveGps,
    onNavigateFromLocation,
}) {
    const networkLines = PATHS.map(([a, b], i) => {
        const A = PLACES.find((p) => p.id === a);
        const B = PLACES.find((p) => p.id === b);
        return { key: i, points: [[A.lat, A.lng], [B.lat, B.lng]] };
    });



    const HighlightIcon = new L.DivIcon({
        html: `
            <div style="
            width:20px;
            height:20px;
            border-radius:50%;
            background:#FFA500;
            border:3px solid white;
            box-shadow:0 0 18px rgba(246, 190, 59, 0.9);
            "></div>`,
        className: "",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });

    const center = { lat: 10.805, lng: 76.728 };

    return (
        <MapContainer
            center={center}
            zoom={17}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
        >
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked={!darkMode} name="OpenStreetMap">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer checked={darkMode} name="OpenStreetMap">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        className="dark_only"
                    />

                </LayersControl.BaseLayer>


                <LayersControl.BaseLayer name="Esri Satellite">
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="www.arcgis.com">Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community</a>'
                        tileClassName="satellite"
                    />
                </LayersControl.BaseLayer>

            </LayersControl>
            <JumpToLocationHelper setSelectedPlace={setSelectedPlace} />

            <MapEventsHelper searchSelectedPlace={searchSelectedPlace} />

            <LiveLocationTracker
                routeLatLngs={routeLatLngs}
                routeSteps={routeSteps}
                isNavigating={isNavigating}
                setIsNavigating={setIsNavigating}
                setLiveGps={setLiveGps}
                onNavigateFromLocation={onNavigateFromLocation}
            />


            {/* Base path lines */}
            {networkLines.map((l) => (
                <Polyline
                    key={l.key}
                    positions={l.points}
                    color="#cbd5e1"
                    weight={2}
                    dashArray="6"
                />
            ))}

            {/* Named markers */}
            {namedPlaces.map((p) => {
                let icon = DotIcon;
                if (p.id === highlightedPlaceId) {
                    icon = HighlightIcon;
                }
                else if (p.id === fromId) icon = StartIcon;
                else if (p.id === toId) icon = EndIcon;

                return (
                    <Marker
                        key={p.id}
                        position={[p.lat, p.lng]}
                        icon={icon}
                        eventHandlers={{
                            click: (e) => {
                                setSelectedPlace(p);
                                const popup = L.popup().setLatLng(e.latlng)
                                    .setContent(`
                        <div style="
      font-family: Inter, sans-serif;
      padding: 10px;
      max-width: 260px;
      color: #0f172a;
      line-height: 1.25;
    ">
      <div style= display:flex; align-items:center; justify-content:space-between;">
        <div style="min-width:0">
           <strong style="
      font-size: 13px;
      display:block;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      color:#1e293b;
    ">  ${p.name || "Unnamed Location"}</strong>
          ${p.address ? `<div style="font-size:12px;color:#475569; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.address}</div>` : ''}
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
        <button id="setStart" style="
          background:#16a34a;
          color:#fff;
          border:none;
          padding:9px 12px;
          width:100%;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          font-size:13px;
        ">Start from here</button>

        <button id="addVia" style="
            background:#facc15;
            color:#111;
            border:none;
            padding:9px 12px;
            width:100%;
            border-radius:10px;
            cursor:pointer;
            font-weight:600;
            font-size:13px;
        ">Add Via Stop</button>

        <button id="setEnd" style="
          background:#dc2626;
          color:#fff;
          border:none;
          padding:9px 12px;
          width:100%;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          font-size:13px;
        ">Reach here</button>
      </div>

     
    </div>
  ` ).openOn(e.target._map);
                                setTimeout(() => {
                                    document.getElementById("setStart").onclick = () => {
                                        const newFrom = p.id;
                                        setFromId(newFrom);
                                        e.target._map.closePopup();
                                        handleFind(newFrom, toId, viaPoints);
                                    };

                                    document.getElementById("setEnd").onclick = () => {
                                        const newTo = p.id;
                                        setToId(newTo);
                                        e.target._map.closePopup();
                                        handleFind(fromId, newTo, viaPoints);
                                    };

                                    document.getElementById("addVia").onclick = () => {
                                        const updated = [...viaPoints, p.id];
                                        setViaPoints(updated);
                                        e.target._map.closePopup();

                                        handleFind(fromId, toId, updated);
                                    };

                                }, 50);

                            }
                        }}

                    />
                );
            })}

            {/* VIA STOP markers */}
            {viaPoints &&
                viaPoints.map(id => {
                    const p = PLACES.find(x => x.id === id);
                    if (!p) return null;
                    return (
                        <Marker
                            key={`via-${id}`}
                            position={[p.lat, p.lng]}
                            icon={ViaIcon}
                        />
                    );
                })}

            {/* Highlighted route */}
            {routeLatLngs.length > 1 && !isNavigating && (
                <>
                    <Polyline positions={routeLatLngs} color="#2563eb" weight={6} />
                    <RouteDirectionArrows routeLatLngs={routeLatLngs} darkMode={darkMode} />
                </>
            )}

            {/* {showFloatingSteps && routeIds.length > 0 && (
        <FloatingStepMarkers routeIds={routeIds} routeSteps={routeSteps} />
      )} */}

            {/*  Route Animation  */}
            {showRouteAnimation && routeLatLngs.length > 1 && (
                <RouteAnimation routeLatLngs={routeLatLngs} routeSteps={routeSteps} />
            )}

            <FitBounds
                ids={routeIds.length > 1 ? routeIds : namedPlaces.map((p) => p.id)}
            />
        </MapContainer>
    );
}
