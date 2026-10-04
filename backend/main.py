import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from datetime import datetime
import os
if os.environ.get("AWS_EXECUTION_ENV"):
    DB_PATH = "/tmp/flood_data.db"
else:
    DB_PATH = os.path.join(os.path.dirname(__file__), "flood_data.db")

app = FastAPI(
    title="Hyperlocal Flood Risk Prediction API",
    description="AWS-Based Hyperlocal Flood Risk Prediction and Intelligent Alert System"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- ML MODEL ----------------


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "ml",
    "flood_model.pkl"
)

model = joblib.load(MODEL_PATH)

print("Flood ML model loaded successfully!")


# ---------------- DATABASE ----------------

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT,
            latitude REAL,
            longitude REAL,
            rainfall_mm REAL,
            water_level_cm REAL,
            temperature_c REAL,
            humidity REAL,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()


init_db()


# ---------------- DATA MODEL ----------------

class SensorData(BaseModel):
    location: str
    latitude: float
    longitude: float
    rainfall_mm: float
    water_level_cm: float
    temperature_c: float
    humidity: float


# ---------------- PREDICTION FUNCTION ----------------

def predict_risk(data: SensorData):

    features = [[
        data.rainfall_mm,
        data.water_level_cm,
        data.temperature_c,
        data.humidity
    ]]

    # ML prediction
    risk = model.predict(features)[0]

    # Prediction probabilities
    probabilities = model.predict_proba(features)[0]

    probability_map = dict(
        zip(model.classes_, probabilities)
    )

    # Convert prediction probabilities into a 0-100 risk score
    risk_score = (
        probability_map.get("LOW", 0) * 0 +
        probability_map.get("MEDIUM", 0) * 50 +
        probability_map.get("HIGH", 0) * 100
    )

    risk_score = round(risk_score, 2)

    # Explain the prediction
    reasons = []

    if data.rainfall_mm >= 100:
        reasons.append("Very heavy rainfall")
    elif data.rainfall_mm >= 50:
        reasons.append("Heavy rainfall")
    elif data.rainfall_mm >= 20:
        reasons.append("Moderate rainfall")

    if data.water_level_cm >= 100:
        reasons.append("Very high water level")
    elif data.water_level_cm >= 60:
        reasons.append("High water level")
    elif data.water_level_cm >= 30:
        reasons.append("Elevated water level")

    if data.humidity >= 90:
        reasons.append("Very high humidity")

    if not reasons:
        reasons.append("Environmental conditions within normal range")

    return risk, risk_score, reasons


# ---------------- HOME ----------------

@app.get("/")
def home():
    return {
        "message": "Hyperlocal Flood Prediction API is running"
    }


# ---------------- HEALTH ----------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "Random Forest",
        "model_loaded": True
    }


# ---------------- SAVE SENSOR DATA ----------------

@app.post("/sensor-data")
def save_sensor_data(data: SensorData):

    timestamp = datetime.now().isoformat()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO sensor_data
        (
            location,
            latitude,
            longitude,
            rainfall_mm,
            water_level_cm,
            temperature_c,
            humidity,
            timestamp
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.location,
        data.latitude,
        data.longitude,
        data.rainfall_mm,
        data.water_level_cm,
        data.temperature_c,
        data.humidity,
        timestamp
    ))

    conn.commit()
    record_id = cursor.lastrowid

    conn.close()

    return {
        "message": "Sensor data stored successfully",
        "record_id": record_id,
        "timestamp": timestamp,
        "data": data
    }


# ---------------- ML FLOOD PREDICTION ----------------

@app.post("/predict")
def predict(data: SensorData):

    risk, risk_score, reasons = predict_risk(data)

    return {
        "location": data.location,
        "risk_score": risk_score,
        "risk_level": risk,
        "alert": risk == "HIGH",
        "reasons": reasons
    }


# ---------------- LATEST SENSOR DATA ----------------

@app.get("/latest-data")
def latest_data():

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM sensor_data
        ORDER BY id DESC
        LIMIT 20
    """)

    rows = cursor.fetchall()
    conn.close()

    data = []

    for row in rows:
        data.append({
            "id": row[0],
            "location": row[1],
            "latitude": row[2],
            "longitude": row[3],
            "rainfall_mm": row[4],
            "water_level_cm": row[5],
            "temperature_c": row[6],
            "humidity": row[7],
            "timestamp": row[8]
        })

    return {
        "count": len(data),
        "data": data
    }


# ---------------- HISTORY ----------------

@app.get("/history")
def history():

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM sensor_data ORDER BY timestamp DESC
""")

    rows = cursor.fetchall()
    conn.close()

    data = []

    for row in rows:
        data.append({
            "id": row[0],
            "location": row[1],
            "latitude": row[2],
            "longitude": row[3],
            "rainfall_mm": row[4],
            "water_level_cm": row[5],
            "temperature_c": row[6],
            "humidity": row[7],
            "timestamp": row[8]
        })

    return {
        "count": len(data),
        "data": data
    }
@app.post("/analyze")
def analyze(data: SensorData):

    # ---------- STORE DATA ----------

    timestamp = datetime.now().isoformat()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO sensor_data
        (
            location,
            latitude,
            longitude,
            rainfall_mm,
            water_level_cm,
            temperature_c,
            humidity,
            timestamp
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.location,
        data.latitude,
        data.longitude,
        data.rainfall_mm,
        data.water_level_cm,
        data.temperature_c,
        data.humidity,
        timestamp
    ))

    conn.commit()

    record_id = cursor.lastrowid

    conn.close()

    # ---------- ML PREDICTION ----------

    input_data = pd.DataFrame([{
        "rainfall_mm": data.rainfall_mm,
        "water_level_cm": data.water_level_cm,
        "temperature_c": data.temperature_c,
        "humidity": data.humidity
    }])

    prediction = model.predict(input_data)[0]

    risk = str(prediction)

    # ---------- CONFIDENCE ----------

    probabilities = model.predict_proba(input_data)[0]

    confidence = float(max(probabilities) * 100)

    # ---------- REASONS ----------

    reasons = []

    if data.rainfall_mm >= 100:
        reasons.append("Very heavy rainfall")
    elif data.rainfall_mm >= 50:
        reasons.append("Heavy rainfall")
    elif data.rainfall_mm >= 20:
        reasons.append("Moderate rainfall")

    if data.water_level_cm >= 100:
        reasons.append("Very high water level")
    elif data.water_level_cm >= 60:
        reasons.append("High water level")
    elif data.water_level_cm >= 30:
        reasons.append("Elevated water level")

    if data.humidity >= 90:
        reasons.append("Very high humidity")

    # ---------- RESPONSE ----------

    return {
        "record_id": record_id,
        "location": data.location,
        "risk_level": risk,
        "confidence": round(confidence, 2),
        "alert": risk == "HIGH",
        "reasons": reasons,
        "timestamp": timestamp
    }
from mangum import Mangum

handler = Mangum(app)