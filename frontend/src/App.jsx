import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Search,
  Database,
  Gauge,
} from "lucide-react";

import "./index.css";

import {
  analyzeFloodRisk,
  getLatestData,
  getHealth,
} from "./api";


function App() {

  // --------------------------------------------------
  // FORM DATA
  // --------------------------------------------------

  const [formData, setFormData] = useState({
    location: "",
    latitude: "",
    longitude: "",
    rainfall_mm: "",
    water_level_cm: "",
    temperature_c: "",
    humidity: "",
  });


  // --------------------------------------------------
  // APPLICATION STATE
  // --------------------------------------------------

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [sensorData, setSensorData] = useState([]);

  const [historyLoading, setHistoryLoading] = useState(true);

  const [backendOnline, setBackendOnline] = useState(false);


  // --------------------------------------------------
  // LOAD INITIAL DATA
  // --------------------------------------------------

  useEffect(() => {

    loadLatestData();

    checkBackend();

    const interval = setInterval(() => {
      checkBackend();
      loadLatestData();
    }, 15000);

    return () => clearInterval(interval);

  }, []);


  // --------------------------------------------------
  // GET LATEST SENSOR DATA
  // --------------------------------------------------

  const loadLatestData = async () => {

    try {

      setHistoryLoading(true);

      const data = await getLatestData();

      setSensorData(data.data || []);

    } catch (error) {

      console.error(
        "Failed to load sensor data:",
        error
      );

    } finally {

      setHistoryLoading(false);

    }

  };


  // --------------------------------------------------
  // CHECK BACKEND
  // --------------------------------------------------

  const checkBackend = async () => {

    try {

      await getHealth();

      setBackendOnline(true);

    } catch (error) {

      setBackendOnline(false);

    }

  };


  // --------------------------------------------------
  // FORM HANDLER
  // --------------------------------------------------

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // --------------------------------------------------
  // ANALYZE FLOOD RISK
  // --------------------------------------------------

  const handleAnalyze = async (e) => {

    e.preventDefault();

    setLoading(true);

    setResult(null);

    try {

      const payload = {

        location: formData.location,

        latitude: Number(
          formData.latitude
        ),

        longitude: Number(
          formData.longitude
        ),

        rainfall_mm: Number(
          formData.rainfall_mm
        ),

        water_level_cm: Number(
          formData.water_level_cm
        ),

        temperature_c: Number(
          formData.temperature_c
        ),

        humidity: Number(
          formData.humidity
        ),

      };


      const data =
        await analyzeFloodRisk(payload);


      setResult(data);


      // Refresh table after analysis

      await loadLatestData();


    } catch (error) {

      console.error(
        "Flood analysis failed:",
        error
      );


      setResult({

        error: true,

        alert:
          "Unable to connect to the FloodGuard backend.",

      });


    } finally {

      setLoading(false);

    }

  };


  // --------------------------------------------------
  // PREPARE CHART DATA
  // --------------------------------------------------

  const chartData = [...sensorData]
    .reverse()
    .map((item) => ({
      ...item,

      displayTime: item.timestamp
        ? new Date(
            item.timestamp
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    }));


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div className="app">

      <div className="ambient-background">

    <span className="ambient-particle particle-one"></span>
    <span className="ambient-particle particle-two"></span>
    <span className="ambient-particle particle-three"></span>
    <span className="ambient-particle particle-four"></span>
    <span className="ambient-particle particle-five"></span>

  </div>
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <Droplets size={24} />
          </div>

          <div>

            <h1>FloodGuard</h1>

            <span>
              Hyperlocal Flood Intelligence
            </span>

          </div>

        </div>


        <div
          className={`system-status ${
            backendOnline
              ? "online"
              : "offline"
          }`}
        >

          <span className="status-dot"></span>

          {backendOnline
            ? "Backend Online"
            : "Backend Offline"}

        </div>

      </nav>



      {/* ==================================================
          HERO
      ================================================== */}

      <section className="hero">

        <div className="hero-content">

          <p className="eyebrow">
            AI-POWERED FLOOD MONITORING
          </p>


          <h2>

            Predict flood risk

            <br />

            <span>
              before it becomes a disaster.
            </span>

          </h2>


          <p className="hero-description">

            FloodGuard analyzes environmental
            conditions and uses machine learning
            to generate hyperlocal flood-risk
            predictions and intelligent alerts.

          </p>


          {/* HERO STATS */}

          <div className="hero-stats">

            <div className="hero-stat">

              <Activity size={17} />

              <div>

                <strong>
                  Real-Time
                </strong>

                <span>
                  Monitoring
                </span>

              </div>

            </div>


            <div className="hero-stat">

              <Gauge size={17} />

              <div>

                <strong>
                  ML Powered
                </strong>

                <span>
                  Prediction
                </span>

              </div>

            </div>


            <div className="hero-stat">

              <Database size={17} />

              <div>

                <strong>
                  Live Data
                </strong>

                <span>
                  Storage
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="hero-visual">

  <div className="monitoring-orbit">

    <div className="orbit-ring ring-one"></div>

    <div className="orbit-ring ring-two"></div>

    <div className="orbit-ring ring-three"></div>

    <div className="orbit-core">

      <Activity
        size={46}
        strokeWidth={1.5}
      />

    </div>

    <span className="signal signal-one"></span>
    <span className="signal signal-two"></span>
    <span className="signal signal-three"></span>

  </div>

</div>
        
      </section>



      {/* ==================================================
          MAIN DASHBOARD
      ================================================== */}

      <main className="dashboard">


        {/* ==================================================
            TOP ROW
        ================================================== */}

        <div className="dashboard-top">


          {/* ==============================================
              INPUT CARD
          ============================================== */}

          <section className="card input-card">

            <div className="card-header">

              <div>

                <p className="section-label">
                  ENVIRONMENTAL DATA
                </p>

                <h3>
                  Flood Risk Analysis
                </h3>

              </div>

              <div className="header-icon">
                <Activity size={22} />
              </div>

            </div>


            <form onSubmit={handleAnalyze}>


              {/* LOCATION */}

              <div className="form-section">

                <h4>

                  <MapPin size={17} />

                  Location

                </h4>


                <div className="input-grid">


                  <div className="input-group full">

                    <label>
                      Location Name
                    </label>

                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Chennai"
                      value={
                        formData.location
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="input-group">

                    <label>
                      Latitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      placeholder="13.0827"
                      value={
                        formData.latitude
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="input-group">

                    <label>
                      Longitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      placeholder="80.2707"
                      value={
                        formData.longitude
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>

              </div>



              {/* SENSOR DATA */}

              <div className="form-section">

                <h4>

                  <Activity size={17} />

                  Sensor Readings

                </h4>


                <div className="input-grid">


                  {/* RAINFALL */}

                  <div className="input-group">

                    <label>

                      <CloudRain size={14} />

                      Rainfall (mm)

                    </label>

                    <input
                      type="number"
                      step="any"
                      name="rainfall_mm"
                      placeholder="72"
                      value={
                        formData.rainfall_mm
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>



                  {/* WATER LEVEL */}

                  <div className="input-group">

                    <label>

                      <Droplets size={14} />

                      Water Level (cm)

                    </label>

                    <input
                      type="number"
                      step="any"
                      name="water_level_cm"
                      placeholder="68"
                      value={
                        formData.water_level_cm
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>



                  {/* TEMPERATURE */}

                  <div className="input-group">

                    <label>

                      <Thermometer size={14} />

                      Temperature (°C)

                    </label>

                    <input
                      type="number"
                      step="any"
                      name="temperature_c"
                      placeholder="29"
                      value={
                        formData.temperature_c
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>



                  {/* HUMIDITY */}

                  <div className="input-group">

                    <label>

                      <Wind size={14} />

                      Humidity (%)

                    </label>

                    <input
                      type="number"
                      step="any"
                      name="humidity"
                      placeholder="91"
                      value={
                        formData.humidity
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>

              </div>



              {/* ANALYZE BUTTON */}

              <button
                className="analyze-btn"
                type="submit"
                disabled={loading}
              >

                {loading ? (

                  <>
                    <Activity
                      size={18}
                      className="spin"
                    />

                    Analyzing...

                  </>

                ) : (

                  <>
                    <Search size={18} />

                    Analyze Flood Risk

                  </>

                )}

              </button>


            </form>

          </section>



          {/* ==============================================
              RESULT CARD
          ============================================== */}

          <section className="card result-card">

            <div className="card-header">

              <div>

                <p className="section-label">
                  AI PREDICTION
                </p>

                <h3>
                  Current Risk Status
                </h3>

              </div>

              <div className="header-icon">
                <ShieldCheck size={22} />
              </div>

            </div>


            {/* NO RESULT */}

            {!result ? (

              <div className="empty-result">

                <div className="empty-icon">

                  <ShieldCheck
                    size={42}
                  />

                </div>

                <h3>
                  Awaiting Analysis
                </h3>

                <p>

                  Enter environmental
                  readings on the left
                  and analyze the location
                  to generate a flood-risk
                  prediction.

                </p>

              </div>

            ) : result.error ? (

              /* ERROR */

              <div className="empty-result error-result">

                <div className="empty-icon error-icon">

                  <AlertTriangle
                    size={40}
                  />

                </div>

                <h3>
                  Backend Unavailable
                </h3>

                <p>
                  {result.alert}
                </p>

              </div>

            ) : (

              /* RESULT */

              <div className="prediction">


                {/* RISK */}

                <div className="risk-section">

                  <span className="result-caption">
                    DETECTED FLOOD RISK
                  </span>

                  <div
                    className={`risk-badge ${
                      result.risk_level
                        ?.toLowerCase()
                    }`}
                  >

                    <span></span>

                    {result.risk_level}

                    {" "}RISK

                  </div>

                </div>



                {/* CONFIDENCE */}

                <div className="confidence">

                  <div>

                    <span>
                      Prediction Confidence
                    </span>

                    <strong>
                      {result.confidence}%
                    </strong>

                  </div>

                </div>


                <div className="confidence-bar">

                  <div
                    style={{
                      width:
                        `${result.confidence}%`,
                    }}
                  />

                </div>



                {/* ALERT */}

                <div
                  className={`alert-box ${
                    result.alert
                      ? "alert-danger"
                      : "alert-safe"
                  }`}
                >

                  {result.alert ? (
                    <AlertTriangle
                      size={20}
                    />
                  ) : (
                    <ShieldCheck
                      size={20}
                    />
                  )}

                  <div>

                    <strong>

                      {result.alert
                        ? "Attention Required"
                        : "Conditions Stable"}

                    </strong>

                    <span>

                      {result.alert
                        ? "Flood conditions require immediate attention."
                        : "Current environmental conditions are within a stable range."}

                    </span>

                  </div>

                </div>



                {/* REASONS */}

                <div className="reasons">

                  <div className="reasons-title">

                    <h4>
                      Risk Factors
                    </h4>

                    <span>
                      {result.reasons?.length || 0}
                    </span>

                  </div>


                  {result.reasons?.map(
                    (reason, index) => (

                      <div
                        className="reason"
                        key={index}
                      >

                        <span>
                          ✓
                        </span>

                        {reason}

                      </div>

                    )
                  )}

                </div>


              </div>

            )}

          </section>

        </div>



        {/* ==================================================
            ANALYTICS
        ================================================== */}

        <section className="card analytics-card">

          <div className="card-header">

            <div>

              <p className="section-label">
                ENVIRONMENTAL ANALYTICS
              </p>

              <h3>
                Recent Environmental Trends
              </h3>

            </div>

            <div className="header-icon">
              <Activity size={22} />
            </div>

          </div>


          {sensorData.length === 0 ? (

            <div className="history-empty">

              No environmental data
              available yet.

            </div>

          ) : (

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: -15,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />

                  <XAxis
                    dataKey="displayTime"
                    stroke="#526a7e"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#526a7e"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#0b1b2d",

                      border:
                        "1px solid rgba(255,255,255,0.1)",

                      borderRadius:
                        "10px",

                      color: "#fff",
                    }}
                  />


                  <Line
                    type="monotone"
                    dataKey="rainfall_mm"
                    name="Rainfall"
                    stroke="#35b9ff"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                    }}
                  />


                  <Line
                    type="monotone"
                    dataKey="water_level_cm"
                    name="Water Level"
                    stroke="#25d1bd"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          )}

        </section>



        {/* ==================================================
            SENSOR HISTORY
        ================================================== */}

        <section className="card history-card">

          <div className="card-header">

            <div>

              <p className="section-label">
                LIVE DATA
              </p>

              <h3>
                Recent Sensor Readings
              </h3>

            </div>

            <div className="header-icon">
              <Database size={22} />
            </div>

          </div>


          {historyLoading ? (

            <div className="history-empty">

              Loading sensor data...

            </div>

          ) : sensorData.length === 0 ? (

            <div className="history-empty">

              No sensor readings
              available yet.

            </div>

          ) : (

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      Location
                    </th>

                    <th>
                      Rainfall
                    </th>

                    <th>
                      Water Level
                    </th>

                    <th>
                      Temperature
                    </th>

                    <th>
                      Humidity
                    </th>

                    <th>
                      Time
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {sensorData.map(
                    (item) => (

                      <tr
                        key={item.id}
                      >

                        <td>

                          <div className="location-cell">

                            <MapPin
                              size={14}
                            />

                            {item.location}

                          </div>

                        </td>


                        <td>
                          {item.rainfall_mm}
                          {" "}mm
                        </td>


                        <td>
                          {item.water_level_cm}
                          {" "}cm
                        </td>


                        <td>
                          {item.temperature_c}
                          °C
                        </td>


                        <td>
                          {item.humidity}%
                        </td>


                        <td>

                          {item.timestamp
                            ? new Date(
                                item.timestamp
                              ).toLocaleString()
                            : "—"}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


      </main>



      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer>

        <div className="footer-brand">

          <Droplets size={16} />

          <span>
            FloodGuard
          </span>

        </div>


        <span>
          AI-Powered Hyperlocal Flood Risk Prediction
        </span>


        <span>
          {backendOnline
            ? "System Operational"
            : "System Offline"}
        </span>

      </footer>


    </div>

  );

}


export default App;