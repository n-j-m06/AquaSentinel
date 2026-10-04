# 🌊 AquaSentinel Frontend

### AI-Powered Hyperlocal Flood Risk Monitoring Dashboard

<p align="center">
  <strong>A modern React-based interface for flood-risk prediction, environmental monitoring, and AI-powered alerts.</strong>
</p>

---

## 📌 Overview

The **AquaSentinel Frontend** is the user-facing dashboard of the AquaSentinel flood intelligence platform.

It provides an interactive interface for entering environmental conditions, communicating with the backend prediction API, displaying AI-generated flood-risk predictions, visualizing environmental trends, and monitoring recent sensor readings.

The frontend is designed around a dark, ocean-inspired monitoring interface with animated elements to represent real-time environmental intelligence.

The application is built using **React and Vite** and communicates with the AquaSentinel backend through REST APIs.

---

# ✨ Features

## 🤖 AI Flood Risk Analysis

Users can enter environmental conditions and submit them to the AquaSentinel backend for analysis.

The interface accepts:

- 📍 Location
- 🌐 Latitude
- 🌐 Longitude
- 🌧️ Rainfall
- 💧 Water Level
- 🌡️ Temperature
- 💨 Humidity

The submitted data is processed by the backend's machine learning system.

---

## 🚨 Current Risk Status

After an analysis request, the dashboard displays the prediction returned by the backend.

The prediction panel can display:

- Flood risk level
- Prediction confidence
- Alert status
- Risk factors
- Current environmental assessment

Risk levels are visually distinguished to make the result easy to understand.

---

## 📊 Environmental Analytics

AquaSentinel visualizes recent environmental readings using interactive charts.

The analytics interface currently supports visualization of:

- Rainfall trends
- Water-level trends

Charts are implemented using **Recharts**.

---

## 📡 Live Sensor History

The dashboard retrieves recent environmental readings from the backend and displays them in a structured table.

The table includes:

- Location
- Rainfall
- Water level
- Temperature
- Humidity
- Timestamp

This provides a quick overview of recent environmental conditions.

---

## 🟢 Backend Connectivity

The frontend periodically checks whether the AquaSentinel backend is available.

The navigation bar displays:

```text
● Backend Online