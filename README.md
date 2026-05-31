# Smart Campus Navigation System  
### *A real-time, interactive, shortest-path navigation tool for college campuses*

## Project Overview  
The **Smart Campus Navigation System** is a web-based application designed to help students, faculty, and visitors navigate the campus efficiently. It provides **shortest path routing**, **via stops**, **building search**, **dark mode**, **live temperature**, and **step-by-step route guidance** using an interactive map.

This project uses **React + Leaflet**, real campus coordinates, and **Dijkstra’s algorithm** for routing.

---

##  Features

### 1. Interactive Campus Map  
- All buildings and landmarks plotted using real coordinates  
- Click any building → View info + set Start/End/Via  
- Smooth zoom and fly-to animations  

###  2. Smart Building Search  
- Search by full name or **aliases**  
- Shows suggestions as you type  
- Auto-jumps to the selected building  

### 3. Shortest Path Navigation  
- Powered by **Dijkstra’s Algorithm**  
- Supports:
  - Start → End  
  - Start → Via1 → Via2 → End  
- Displays:
  - Total distance  
  - Turn-by-turn instructions  
  - Animated route playback  

### 4. Via Stops  
- Add multiple via points  
- Route recalculates instantly  
- Remove via stops from sidebar  

###  5. Dark Mode  
- Full dark UI  
- Only OSM map tiles get dark-filtered  
- Sidebar + map UI adapt automatically  

###  6. Live Temperature  
- Shows **your current location temperature**  
- If a building is selected → temperature for that building is shown  
- Uses OpenWeatherMap API  

### 7. Building Info Panel  
Shows:
- Building name  
- Description  
- Coordinates  

###  8. Instructions Panel  
- Designed using Framer Motion  
- Explains all major features  
- Opens from the sidebar  

###  9. Mobile Responsive  
- Sidebar moves to bottom on small screens  
- Search and map scale properly  

###  10. Hosted Online  
The project is deployed and available publicly.

---

##  Tech Stack

### Frontend
- React.js  
- React-Leaflet  
- Framer Motion  
- CSS Variables  

### Algorithms
- Dijkstra’s Algorithm  
- Custom turn-by-turn instruction generator  

### APIs
- OpenStreetMap  
- OpenWeatherMap  
- AllOrigins CORS Proxy  

---

## Project Structure
```txt
src/
├── components/
│   ├── MapView.jsx
│   ├── Sidebar.jsx
│   ├── SearchBar.jsx
│   ├── InstructionsPanel.jsx
│   ├── FloatingStepMarkers.jsx
│   ├── FitBounds.jsx
│   ├── RouteDirectionArrows.jsx
│
├── utils/
│   ├── graph.js
│   ├── geo.js
│   ├── generateGraph.jsx
│
├── data/
│   ├── places.js
│   ├── adjacency_list.js
│   ├── paths.js
│
├── App.jsx
├── App.css
```


##  How to Run Locally

### 1️ Clone the repository
```bash
git clone  https://github.com/JUTURUVENKATROHTH/Smart_Campus_Navigation.git
cd smart-campus-navigation
```
###  Install dependencies
```bash
npm install
```
### Start the app
```bash
npm run dev
```

### Weather API Setup

    Signup at OpenWeatherMap, then insert the API key:

    const apiKey = "YOUR_API_KEY";


## Mentor

    -Dr. Krithika Ramaswamy

## Student Developers

    -Gampa Abhinay (142201013)
    -J Venkat Rohith (112201018)
    -Karun Jacob Philip(112501014)
