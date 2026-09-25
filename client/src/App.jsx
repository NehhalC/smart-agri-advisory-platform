import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GisMap from './components/GisMap';
import AiAdvisor from './components/AiAdvisor';
import TelemetryDashboard from './components/TelemetryDashboard';
import CropHealthDiagnostics from './components/CropHealthDiagnostics';
import MarketTrends from './components/MarketTrends';
import IrrigationScheduler from './components/IrrigationScheduler';
import { Layers, Bot, Wifi, Camera, TrendingUp, Power, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('gis'); // 'gis', 'ai', 'telemetry', 'health', 'market', 'irrigation'
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [telemetryData, setTelemetryData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [cropScans, setCropScans] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [irrigationData, setIrrigationData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isMongoConnected, setIsMongoConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial data from backend API
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Check API Health
      const healthRes = await fetch('/api/health');
      const healthJson = await healthRes.json();
      setIsMongoConnected(healthJson.mongoDBConnected);

      // Fetch GIS Fields
      const gisRes = await fetch('/api/gis/fields');
      const gisJson = await gisRes.json();
      if (gisJson.fields) {
        setFields(gisJson.fields);
        if (!selectedField) setSelectedField(gisJson.fields[0]);
      }

      // Fetch Telemetry
      const teleRes = await fetch('/api/telemetry');
      const teleJson = await teleRes.json();
      if (teleJson.telemetry) setTelemetryData(teleJson.telemetry);

      // Fetch AI Recommendations
      const recRes = await fetch('/api/recommendations');
      const recJson = await recRes.json();
      if (recJson.recommendations) setRecommendations(recJson.recommendations);

      // Fetch Crop Health Scans
      const scanRes = await fetch('/api/crop-health/scans');
      const scanJson = await scanRes.json();
      if (scanJson.scans) setCropScans(scanJson.scans);

      // Fetch Market Prices
      const mktRes = await fetch('/api/market/prices');
      const mktJson = await mktRes.json();
      if (mktJson.prices) setMarketPrices(mktJson.prices);

      // Fetch Irrigation Status
      const irrRes = await fetch('/api/irrigation/schedule');
      const irrJson = await irrRes.json();
      if (irrJson.currentStatus) {
        setIrrigationData(irrJson);
        setWeather(irrJson.weatherSummary);
      }
    } catch (err) {
      console.error('Error fetching data from backend API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update Recommendation Status API call
  const handleRecommendationStatusUpdate = async (recId, status) => {
    try {
      const res = await fetch(`/api/recommendations/${recId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setRecommendations(prev => prev.map(r => r.recId === recId ? { ...r, status } : r));
        fetchAllData(); // Refresh telemetry if irrigation rec was applied
      }
    } catch (err) {
      console.error('Failed to update recommendation status:', err);
    }
  };

  // Generate Custom AI Recommendation API call
  const handleGenerateCustomRecommendation = async (formData) => {
    try {
      const res = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId: selectedField?.fieldId || 'FIELD-01',
          ...formData
        })
      });
      const data = await res.json();
      if (data.success) {
        setRecommendations(prev => [data.recommendation, ...prev]);
        setActiveTab('ai');
      }
    } catch (err) {
      console.error('Failed to generate custom recommendation:', err);
    }
  };

  // Telemetry Simulation API call
  const handleSimulateTelemetry = async (sensorNodeId, soilMoisturePercent) => {
    try {
      const res = await fetch('/api/telemetry/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorNodeId, soilMoisturePercent })
      });
      const data = await res.json();
      if (data.success) {
        setTelemetryData(prev => prev.map(t => t.sensorNodeId === sensorNodeId ? data.telemetry : t));
      }
    } catch (err) {
      console.error('Failed to simulate telemetry:', err);
    }
  };

  // Crop Disease Diagnosis API call
  const handleDiagnoseCrop = async (sampleType) => {
    try {
      const res = await fetch('/api/crop-health/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId: selectedField?.fieldId || 'FIELD-01',
          cropName: selectedField?.cropType || 'Tomato',
          sampleType
        })
      });
      const data = await res.json();
      if (data.success) {
        setCropScans(prev => [data.scan, ...prev]);
        return data.scan;
      }
    } catch (err) {
      console.error('Failed to diagnose crop:', err);
    }
    return null;
  };

  // Profit Calculator API call
  const handleCalculateProfit = async (inputs) => {
    try {
      const res = await fetch('/api/market/calculate-profit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to calculate profit:', err);
    }
    return null;
  };

  // Toggle Pump API call
  const handleTogglePump = async (action, mode) => {
    try {
      const res = await fetch('/api/irrigation/toggle-pump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, mode })
      });
      const data = await res.json();
      if (data.success) {
        setIrrigationData(prev => ({
          ...prev,
          currentStatus: data.irrigationStatus
        }));
        fetchAllData(); // Refresh telemetry values
      }
    } catch (err) {
      console.error('Failed to toggle pump:', err);
    }
  };

  // Create new GIS Field API call
  const handleCreateField = async (newFieldData) => {
    try {
      const res = await fetch('/api/gis/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFieldData)
      });
      const data = await res.json();
      if (data.success) {
        setFields(prev => [...prev, data.field]);
        setSelectedField(data.field);
      }
    } catch (err) {
      console.error('Failed to create new field:', err);
    }
  };

  const navTabs = [
    { id: 'gis', label: 'GIS Map & Zoning', icon: <Layers size={18} /> },
    { id: 'ai', label: 'AI Advisory Engine', icon: <Bot size={18} />, count: recommendations.filter(r => r.status === 'Active').length },
    { id: 'telemetry', label: 'Environmental Telemetry', icon: <Wifi size={18} /> },
    { id: 'health', label: 'Crop Health Scanner', icon: <Camera size={18} /> },
    { id: 'market', label: 'Market Trends & APMC', icon: <TrendingUp size={18} /> },
    { id: 'irrigation', label: 'Smart Irrigation', icon: <Power size={18} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Navbar */}
      <Navbar 
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        fields={fields}
        weather={weather}
        isMongoConnected={isMongoConnected}
        onRefresh={fetchAllData}
        loading={loading}
      />

      <div style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '0 24px 36px 24px', flex: 1 }}>
        
        {/* Navigation Tabs bar */}
        <nav style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '0.88rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: activeTab === tab.id ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.1) 100%)' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <span style={{ 
                  background: '#f43f5e', 
                  color: '#fff', 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  padding: '2px 6px', 
                  borderRadius: '10px' 
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Tab Content Render */}
        <main style={{ minHeight: '600px' }}>
          {activeTab === 'gis' && (
            <GisMap 
              fields={fields} 
              selectedField={selectedField} 
              setSelectedField={setSelectedField}
              telemetryData={telemetryData}
              onAddField={handleCreateField}
            />
          )}

          {activeTab === 'ai' && (
            <AiAdvisor 
              recommendations={recommendations}
              onStatusUpdate={handleRecommendationStatusUpdate}
              onGenerateRec={handleGenerateCustomRecommendation}
            />
          )}

          {activeTab === 'telemetry' && (
            <TelemetryDashboard 
              telemetryData={telemetryData}
              selectedField={selectedField}
              onSimulateTelemetry={handleSimulateTelemetry}
            />
          )}

          {activeTab === 'health' && (
            <CropHealthDiagnostics 
              cropScans={cropScans}
              onDiagnoseCrop={handleDiagnoseCrop}
            />
          )}

          {activeTab === 'market' && (
            <MarketTrends 
              marketPrices={marketPrices}
              onCalculateProfit={handleCalculateProfit}
            />
          )}

          {activeTab === 'irrigation' && (
            <IrrigationScheduler 
              irrigationData={irrigationData}
              onTogglePump={handleTogglePump}
            />
          )}
        </main>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '16px 24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-subtle)', background: 'rgba(0,0,0,0.3)' }}>
        AgriPulse AI & GIS Farm Advisory Platform • Full Stack Development (FSD) Project • React.js + Node.js + Express + MongoDB
      </footer>

    </div>
  );
}
