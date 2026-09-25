<<<<<<< HEAD
# smart-agri-advisory-platform
=======
# 🌾 AgriPulse AI — GIS Visualization & Smart Farm Advisory Platform

**Full Stack Development (FSD) Project**  
*Built with HTML5, Custom Glassmorphism CSS3, JavaScript, React.js (Vite), Node.js, Express, and MongoDB (Mongoose).*

---

## 🌟 Executive Summary & Problem Statement

Farmers require timely, localized recommendations based on dynamic weather patterns, soil nutrient levels, crop growth stages, pest/disease outbreaks, irrigation schedules, and market pricing trends. 

**AgriPulse AI** is an end-to-end intelligent agricultural decision-support system that combines:
1. **AI-Driven Recommendation Engine**: Generates real-time, actionable advisories (Irrigation pulses, fertigation top-dressing, pest alerts, harvest planning) with AI rationale, audio readouts, and expected yield impacts.
2. **Geospatial GIS Visualization Map**: Interactive Leaflet.js GIS map providing farm boundary polygons, NDVI crop health overlays, soil moisture radius heatmaps, and pinpoint IoT sensor telemetry nodes.
3. **IoT Environmental Monitoring**: Live telemetry stream of soil moisture, ambient/soil temperature, relative humidity, soil pH, and N-P-K mineral levels (Nitrogen, Phosphorus, Potassium).
4. **AI Crop Health Pathology Scanner**: Computer vision disease classification engine that diagnoses foliar pathogens (Early Blight, Stripe Rust, Pink Bollworm, Rice Blast) with confidence scoring and treatment remedies.
5. **APMC Market Trends & Financial Modeling**: Real-time commodity liquidation rates from APMC Mandis, 7-day predictive AI price forecasts, and an interactive Farm Profit Margin & ROI Calculator.
6. **Smart Adaptive Irrigation Scheduler**: Water balancing using Penman-Monteith evapotranspiration ($ET_0$) calculations and automated rain-skip calendar rules.

---

## 🏗️ Architecture & Technology Stack

```
 ┌─────────────────────────────────────────────────────────────┐
 │               React.js Frontend (Port 3000)                │
 │  • Glassmorphism CSS3 Design System (Inter / Outfit fonts)  │
 │  • Leaflet.js GIS Map & Heatmaps                            │
 │  • Chart.js Interactive Telemetry & Price Trend Charts     │
 │  • Web Speech Audio Advisory Readouts                       │
 └──────────────────────────────┬──────────────────────────────┘
                                │ REST APIs (CORS)
 ┌──────────────────────────────▼──────────────────────────────┐
 │              Node.js + Express Backend (Port 5001)           │
 │  • GIS Field & Boundary Controller                          │
 │  • IoT Telemetry & Sensor Simulator Controller             │
 │  • AI Advisory Generator Controller                         │
 │  • Crop Pathology Scanner Controller                        │
 │  • APMC Market Price & Profit Calculator Controller        │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Mongoose ODM
 ┌──────────────────────────────▼──────────────────────────────┐
 │             MongoDB Database / Memory Engine                 │
 │  • MongoDB (`mongodb://127.0.0.1:27017/agripulse`)           │
 │  • Auto In-Memory Data Engine (Zero-Downtime Fallback)       │
 └─────────────────────────────────────────────────────────────┘
```

### Stack Breakdown:
- **Frontend**: React 18, Vite, Lucide Icons, Leaflet & React-Leaflet, Chart.js & React-ChartJS-2, SpeechSynthesis API.
- **Backend**: Node.js, Express.js, CORS, Dotenv.
- **Database**: MongoDB with Mongoose Schemas + Auto In-Memory Data Fallback.

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **MongoDB**: Running locally at `mongodb://127.0.0.1:27017` (If MongoDB is offline, the backend automatically engages its built-in memory engine!).

### 1. Clone & Install Dependencies
From the root workspace directory, run:
```bash
# Install root concurrency runner
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Launch Development Servers
To start both the Node.js backend (Port 5001) and Vite React frontend (Port 3000) concurrently:
```bash
npm run dev
```

Alternatively, you can run them in separate terminals:
- **Backend**: `npm run server`
- **Frontend**: `npm run client`

Open your browser at: **`http://localhost:3000`**

---

## 📡 REST API Endpoint Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check & MongoDB connection status |
| `GET` | `/api/gis/fields` | Retrieve all GIS farm field zones & polygon coordinates |
| `GET` | `/api/gis/fields/:fieldId` | Retrieve details for a specific field |
| `POST` | `/api/gis/fields` | Add a new farm field zone |
| `GET` | `/api/telemetry` | Retrieve live IoT environmental sensor telemetry |
| `POST` | `/api/telemetry/simulate` | Trigger real-time telemetry stress test override |
| `GET` | `/api/recommendations` | Fetch active AI farm recommendations |
| `PATCH` | `/api/recommendations/:recId/status` | Update recommendation status (`Active` ➔ `Applied`) |
| `POST` | `/api/recommendations/generate` | Generate dynamic custom AI advisory |
| `GET` | `/api/crop-health/scans` | List past crop disease diagnostic scans |
| `POST` | `/api/crop-health/diagnose` | Run AI computer vision pathology scanner |
| `GET` | `/api/market/prices` | Fetch APMC Mandi prices & 7-day price forecasts |
| `POST` | `/api/market/calculate-profit` | Calculate total investment, gross revenue, net profit & ROI % |
| `GET` | `/api/irrigation/schedule` | Retrieve smart watering calendar & $ET_0$ calculation |
| `POST` | `/api/irrigation/toggle-pump` | Activate or deactivate submersible water pump station |

---

## 🍃 MongoDB Models & Schemas

1. **Field Schema** (`server/models/Field.js`): Coordinates (`gisCoordinates`), area in acres, crop variety, growth stage, soil type.
2. **Telemetry Schema** (`server/models/Telemetry.js`): Sensor node ID, soil moisture %, air/soil temperature, humidity %, soil pH, N-P-K (ppm), solar radiation.
3. **Recommendation Schema** (`server/models/Recommendation.js`): Category, priority badge, AI rationale, suggested action, estimated yield impact, status (`Active` / `Applied`).
4. **CropScan Schema** (`server/models/CropScan.js`): Diagnosis, health status, confidence score, symptoms list, organic remedy vs chemical remedy.
5. **MarketPrice Schema** (`server/models/MarketPrice.js`): Commodity, current mandi price, daily change %, AI 7-day prediction, price history.

---

## 🎨 Design Highlights
- **Curated Palette**: Deep Obsidian Background (`#0a0f1d`), Glowing Emerald (`#10b981`), Cyber Cyan (`#06b6d4`), Warm Amber (`#f59e0b`), Rose Alerts (`#f43f5e`).
- **Typography**: Google Fonts Outfit & Plus Jakarta Sans.
- **Glassmorphism**: Backdrop blur filters, subtle border glows, dynamic card micro-interactions.
>>>>>>> 8ec78e2 (Initial commit: AgriPulse AI & GIS Farm Advisory Platform (Full Stack React + Node.js + Express + MongoDB))
