import pandas as pd
import random

data = []

for _ in range(2000):

    rainfall = random.uniform(0, 200)
    water_level = random.uniform(0, 150)
    temperature = random.uniform(20, 40)
    humidity = random.uniform(40, 100)

    # Calculate risk score
    score = 0

    if rainfall >= 100:
        score += 40
    elif rainfall >= 50:
        score += 25
    elif rainfall >= 20:
        score += 10

    if water_level >= 100:
        score += 40
    elif water_level >= 60:
        score += 25
    elif water_level >= 30:
        score += 10

    if humidity >= 90:
        score += 10

    if score >= 70:
        risk = "HIGH"
    elif score >= 40:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    data.append([
        rainfall,
        water_level,
        temperature,
        humidity,
        risk
    ])

df = pd.DataFrame(data, columns=[
    "rainfall_mm",
    "water_level_cm",
    "temperature_c",
    "humidity",
    "risk_level"
])

df.to_csv("ml/flood_dataset.csv", index=False)

print("Dataset created successfully!")
print(df.head())
print("\nRisk distribution:")
print(df["risk_level"].value_counts())