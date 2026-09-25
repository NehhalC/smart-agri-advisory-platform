import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Layers, MapPin, Grid, Plus, Trash2 } from 'lucide-react';

// Custom Leaflet Pin Icon
const sensorIcon = L.divIcon({
  className: 'custom-sensor-pin',
  html: `<div style="
    background: #10b981;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 3px solid #ffffff;
    box-shadow: 0 0 10px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 13px;
  ">🌾</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export default function GisMap({ fields, selectedField, setSelectedField, telemetryData, onAddField }) {
  const [mapMode, setMapMode] = useState('osm'); // 'osm' or 'vector'
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newCropType, setNewCropType] = useState('Wheat');
  const [newArea, setNewArea] = useState('10');
  const [newLocation, setNewLocation] = useState('Punjab, India');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return '#10b981';
      case 'Attention Needed': return '#f59e0b';
      case 'Critical': return '#f43f5e';
      default: return '#3b82f6';
    }
  };

  const centerLat = selectedField?.centerPoint?.lat || 30.9015;
  const centerLng = selectedField?.centerPoint?.lng || 75.8613;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newFieldName) return;
    onAddField({
      name: newFieldName,
      cropType: newCropType,
      areaAcres: parseFloat(newArea),
      locationName: newLocation,
      growthStage: 'Vegetative',
      soilType: 'Loam Soil',
      status: 'Optimal',
      gisCoordinates: [
        [centerLat + 0.002, centerLng + 0.002],
        [centerLat + 0.005, centerLng + 0.005],
        [centerLat + 0.003, centerLng + 0.008],
        [centerLat, centerLng + 0.005]
      ],
      centerPoint: { lat: centerLat + 0.002, lng: centerLng + 0.004 },
      sensorNodeId: `SNODE-${Math.floor(100 + Math.random() * 900)}`
    });
    setNewFieldName('');
    setShowAddForm(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers color="#10b981" size={22} />
            GIS Farm Mapping & Field Management
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Interactive agricultural field zoning map (No API Key Required)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Toggle Map vs 2D Vector Grid */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setMapMode('osm')}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: mapMode === 'osm' ? '#10b981' : 'transparent',
                color: mapMode === 'osm' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600
              }}
            >
              🗺️ OpenStreetMap
            </button>
            <button 
              onClick={() => setMapMode('vector')}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: mapMode === 'vector' ? '#10b981' : 'transparent',
                color: mapMode === 'vector' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600
              }}
            >
              📐 2D Grid Map
            </button>
          </div>

          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary" 
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <Plus size={16} /> Add New Field Zone
          </button>
        </div>
      </div>

      {/* Add Field Form Modal/Card */}
      {showAddForm && (
        <form onSubmit={handleCreateSubmit} className="glass-panel animate-fade-in" style={{ padding: '16px', background: 'rgba(18, 25, 44, 0.95)', border: '1px solid var(--accent-emerald)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>➕ Add New Farm Field to Database</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Field Name</label>
              <input 
                type="text" 
                placeholder="e.g. Sector E - Corn Field" 
                value={newFieldName} 
                onChange={(e) => setNewFieldName(e.target.value)}
                style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Crop Type</label>
              <select 
                value={newCropType} 
                onChange={(e) => setNewCropType(e.target.value)}
                style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              >
                <option value="Wheat">Wheat</option>
                <option value="Tomato">Tomato</option>
                <option value="Cotton">Cotton</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize / Corn</option>
                <option value="Soybean">Soybean</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Area (Acres)</label>
              <input 
                type="number" 
                value={newArea} 
                onChange={(e) => setNewArea(e.target.value)}
                style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Location</label>
              <input 
                type="text" 
                value={newLocation} 
                onChange={(e) => setNewLocation(e.target.value)}
                style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Save to Database</button>
          </div>
        </form>
      )}

      {/* Map View Area */}
      <div style={{ height: '420px', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)' }}>
        
        {mapMode === 'osm' ? (
          <MapContainer 
            key={`${centerLat}-${centerLng}`}
            center={[centerLat, centerLng]} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Standard 100% Free OpenStreetMap Tile Server (NO API Key Needed) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {fields.map((field) => {
              const isSelected = selectedField?.fieldId === field.fieldId;
              const statusColor = getStatusColor(field.status);
              const sensor = telemetryData?.find(t => t.fieldId === field.fieldId);

              return (
                <React.Fragment key={field.fieldId}>
                  <Polygon
                    positions={field.gisCoordinates}
                    pathOptions={{
                      color: isSelected ? '#000000' : statusColor,
                      fillColor: statusColor,
                      fillOpacity: isSelected ? 0.6 : 0.4,
                      weight: isSelected ? 3 : 2
                    }}
                    eventHandlers={{ click: () => setSelectedField(field) }}
                  >
                    <Popup>
                      <div style={{ padding: '4px', minWidth: '160px' }}>
                        <h4 style={{ color: '#0f172a', margin: '0 0 4px 0', fontSize: '0.9rem' }}>{field.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569' }}>
                          Crop: <strong>{field.cropType}</strong> | Area: {field.areaAcres} Acres
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#475569' }}>
                          Status: <strong style={{ color: statusColor }}>{field.status}</strong>
                        </p>
                      </div>
                    </Popup>
                  </Polygon>

                  <Marker 
                    position={[field.centerPoint.lat, field.centerPoint.lng]}
                    icon={sensorIcon}
                    eventHandlers={{ click: () => setSelectedField(field) }}
                  >
                    <Popup>
                      <div style={{ padding: '4px' }}>
                        <strong style={{ color: '#0f172a' }}>{field.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
                          💧 Soil Moisture: <strong>{sensor?.soilMoisturePercent || 40}%</strong>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </MapContainer>
        ) : (
          /* 2D Vector Grid Visual Fallback (Works 100% offline!) */
          <div style={{ width: '100%', height: '100%', background: '#0f172a', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', overflowY: 'auto' }}>
            {fields.map(field => {
              const isSel = selectedField?.fieldId === field.fieldId;
              const statusColor = getStatusColor(field.status);
              const sensor = telemetryData?.find(t => t.fieldId === field.fieldId);
              return (
                <div 
                  key={field.fieldId}
                  onClick={() => setSelectedField(field)}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: isSel ? `2px solid ${statusColor}` : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    boxShadow: isSel ? `0 0 15px ${statusColor}40` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{field.name}</span>
                    <span className={`badge ${field.status === 'Optimal' ? 'badge-optimal' : field.status === 'Attention Needed' ? 'badge-warning' : 'badge-critical'}`} style={{ fontSize: '0.7rem' }}>
                      {field.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>
                    🌾 Crop: {field.cropType} ({field.cropVariety})<br />
                    📏 Area: {field.areaAcres} Acres | 📍 {field.locationName}
                  </div>
                  {sensor && (
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#38bdf8' }}>
                      💧 Soil Moisture: <strong>{sensor.soilMoisturePercent}%</strong> | 🌡️ Temp: <strong>{sensor.airTemperatureC}°C</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Field Cards list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {fields.map(f => {
          const isSel = selectedField?.fieldId === f.fieldId;
          return (
            <div 
              key={f.fieldId}
              onClick={() => setSelectedField(f)}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '12px 14px',
                cursor: 'pointer',
                border: isSel ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                background: isSel ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{f.name}</span>
                <span className={`badge ${f.status === 'Optimal' ? 'badge-optimal' : f.status === 'Attention Needed' ? 'badge-warning' : 'badge-critical'}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  {f.status}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {f.cropType} • {f.areaAcres} Acres • {f.locationName}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
