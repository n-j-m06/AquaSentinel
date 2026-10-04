# 🌊 AquaSentinel Backend

### AI-Powered Flood Risk Prediction API

The **AquaSentinel Backend** provides the API, machine learning prediction, and environmental data management layer for the AquaSentinel flood intelligence platform.

It is responsible for receiving environmental conditions from the frontend, processing them through a machine learning model, generating flood-risk predictions, storing environmental readings, and returning structured responses to the AquaSentinel dashboard.

---

# 📌 Overview

The backend acts as the bridge between the AquaSentinel frontend and the machine learning prediction system.

The primary workflow is:

```text
User
 │
 ▼
React Frontend
 │
 │ HTTP Request
 ▼
AquaSentinel Backend
 │
 ├───────────────┐
 │               │
 ▼               ▼
ML Model      SQLite Database
 │               │
 └───────┬───────┘
         │
         ▼
   Prediction Response
         │
         ▼
   React Frontend