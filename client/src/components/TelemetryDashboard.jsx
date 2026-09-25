import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Droplets, Thermometer, Wind, TestTube, Sun, Sliders, Battery, Wifi } from 'lucide-react';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

export default function TelemetryDashboard({ telemetryData, selectedField, onSimulateTelemetry }) {
  const currentSensor = telemetryData?.find(t => t.fieldId === selectedField?.fieldId) || telemetryData?.[0] || {
    soilMoisturePercent: 42.5,
    soilTemperatureC: 22.4,
    airTemperatureC: 26.8,
    airHumidityPercent: 58.0,
    soilPh: 6.8,
    nitrogenPpm: 125,
    phosphorusPpm: 34,
    potassiumPpm: 185,
    solarRadiationWm2: 520,
    uvIndex: 6,
    batteryLevelPercent: 97
  };

  const [simMoisture, setSimMoisture] = useState(currentSensor.soilMoisturePercent);

  // Line Chart Data for Moisture & Temperature Trend
  const timeLabels = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', 'Current'];
  
  const lineChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Soil Moisture (%)',
        data: [48, 47, 45, 43, 41, 40, simMoisture, simMoisture],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Air Temp (°C)',
        data: [20, 23, 27, 30, 31, 29, 27, currentSensor.airTemperatureC],
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: '#cbd5e1' }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  // NPK Bar Chart Data
  const npkBarData = {
    labels: ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)'],
    datasets: [
      {
        label: 'Current Soil Nutrient (ppm)',
        data: [currentSensor.nitrogenPpm, currentSensor.phosphorusPpm, currentSensor.potassiumPpm],
        backgroundColor: ['#10b981', '#38bdf8', '#a855f7'],
        borderRadius: 8
      }
    ]
  };

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    onSimulateTelemetry(currentSensor.sensorNodeId || 'SNODE-101', parseFloat(simMoisture));
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
      
      {/* Telemetry Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)' }}>
              <Wifi size={22} color="var(--accent-cyan)" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>IoT Environmental Telemetry Monitor</h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Live telemetry feed from sensor node: <strong>{currentSensor.sensorNodeId || 'SNODE-101'}</strong> ({selectedField?.name || 'Selected Field'})
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="badge badge-optimal">
            <span className="pulse-dot"></span> Live Stream Active
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            🔋 {currentSensor.batteryLevelPercent}% Battery
          </span>
        </div>
      </div>

      {/* Sensor Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        
        {/* Soil Moisture */}
        <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
            <span>Soil Moisture</span>
            <Droplets size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {currentSensor.soilMoisturePercent}%
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${currentSensor.soilMoisturePercent}%`, 
              height: '100%', 
              background: currentSensor.soilMoisturePercent < 25 ? '#f43f5e' : 'var(--accent-cyan)' 
            }}></div>
          </div>
          <span style={{ fontSize: '0.72rem', color: currentSensor.soilMoisturePercent < 25 ? '#f43f5e' : '#34d399', marginTop: '4px', display: 'block' }}>
            {currentSensor.soilMoisturePercent < 25 ? '⚠️ Moisture Deficit' : '✓ Optimal Root Level'}
          </span>
        </div>

        {/* Ambient Air Temp */}
        <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
            <span>Air / Soil Temp</span>
            <Thermometer size={16} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {currentSensor.airTemperatureC}°C
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Soil Temp: {currentSensor.soilTemperatureC}°C
          </span>
        </div>

        {/* Humidity */}
        <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
            <span>Air Humidity</span>
            <Wind size={16} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {currentSensor.airHumidityPercent}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Transpiration factor: Moderate
          </span>
        </div>

        {/* Soil pH */}
        <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
            <span>Soil pH Level</span>
            <TestTube size={16} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {currentSensor.soilPh}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px', display: 'block' }}>
            Slightly Acidic (Ideal)
          </span>
        </div>

      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* Moisture & Temp Line Chart */}
        <div className="glass-panel" style={{ padding: '18px', height: '280px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>
            Diurnal Moisture & Temperature Curve
          </h3>
          <div style={{ height: '210px' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Soil NPK Nutrient Bar Chart */}
        <div className="glass-panel" style={{ padding: '18px', height: '280px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>
            Soil N-P-K Mineral Balance (PPM)
          </h3>
          <div style={{ height: '210px' }}>
            <Bar data={npkBarData} options={chartOptions} />
          </div>
        </div>

      </div>

      {/* Telemetry Simulator Controls */}
      <div className="glass-panel" style={{ padding: '16px', background: 'rgba(0,0,0,0.25)', border: '1px border var(--border-color)' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={16} color="var(--accent-emerald)" /> Live Telemetry Stress Testing Simulator
        </h4>
        <form onSubmit={handleSimulateSubmit} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Simulate Soil Moisture Level: <strong>{simMoisture}%</strong>
            </label>
            <input 
              type="range" 
              min="10" 
              max="95" 
              value={simMoisture} 
              onChange={(e) => setSimMoisture(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-emerald)' }} 
            />
          </div>

          <button type="submit" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            Inject Telemetry Telecasting Pulse
          </button>
        </form>
      </div>

    </div>
  );
}
