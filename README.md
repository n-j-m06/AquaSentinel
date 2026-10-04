# 🌊 AquaSentinel

### AI-Powered Hyperlocal Flood Risk Prediction & Monitoring Platform

<p align="center">
  <strong>Predict flood risk before it becomes a disaster.</strong>
</p>

<p align="center">
  AquaSentinel combines environmental sensor data, machine learning, and cloud-ready APIs
  to provide intelligent, hyperlocal flood-risk predictions and monitoring.
</p>

---

## 📌 Overview

**AquaSentinel** is an AI-powered flood monitoring and prediction platform designed to analyze environmental conditions and estimate the potential risk of flooding for a specific location.

The system accepts environmental parameters such as:

- 🌧️ Rainfall
- 💧 Water level
- 🌡️ Temperature
- 💨 Humidity
- 📍 Geographic location

These parameters are processed by a machine learning model to generate a flood-risk prediction along with a confidence score, risk factors, and an alert status.

The project consists of a modern React-based frontend, a Python/FastAPI backend, and a machine learning pipeline for flood-risk prediction.

The architecture is also being prepared for **AWS cloud integration using AWS Lambda and API Gateway**, allowing the backend functionality to be migrated from a local development environment to a serverless cloud architecture.

---

# 🎯 Objectives

The primary objectives of AquaSentinel are:

1. **Predict flood risk using environmental parameters**
2. **Provide hyperlocal flood-risk analysis**
3. **Present predictions through an intuitive dashboard**
4. **Store and visualize recent environmental readings**
5. **Provide confidence-based AI predictions**
6. **Generate intelligent flood alerts**
7. **Create a cloud-ready serverless architecture**
8. **Integrate the application with AWS Lambda and API Gateway**
9. **Provide a scalable foundation for future real-time sensor integration**

---

# ✨ Key Features

## 🤖 AI-Based Flood Risk Prediction

AquaSentinel uses a trained machine learning model to analyze environmental conditions and classify the current flood risk.

The system evaluates parameters including:

- Rainfall
- Water level
- Temperature
- Humidity
- Location coordinates

The prediction includes:

- Flood risk level
- Prediction confidence
- Risk factors
- Alert status

---

## 📊 Environmental Monitoring Dashboard

The frontend provides a centralized dashboard where users can enter environmental readings and analyze flood risk.

The dashboard contains:

- Environmental data input
- Location information
- AI prediction results
- Prediction confidence
- Flood alerts
- Risk factors
- Environmental trend visualization
- Recent sensor readings
- Backend connectivity status

---

## 📍 Hyperlocal Analysis

Users can provide a location name along with:

```text
Latitude
Longitude