import React from 'react';
import { Sprout, Database, Cpu, CloudSun, MapPin, RefreshCw } from 'lucide-react';

export default function Navbar({ 
  selectedField, 
  setSelectedField, 
  fields, 
  weather, 
  isMongoConnected, 
  onRefresh, 
  loading 
}) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '14px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo & Brand Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Sprout size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(90deg, #34d399, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AgriPulse AI
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              GIS Visualization & Smart Advisory Platform
            </p>
          </div>
        </div>

        {/* Selected Field & Weather Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* Farm Field Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <MapPin size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Field:</span>
            <select 
              value={selectedField?.fieldId || ''} 
              onChange={(e) => {
                const found = fields.find(f => f.fieldId === e.target.value);
                if (found) setSelectedField(found);
              }}
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              {fields.map(f => (
                <option key={f.fieldId} value={f.fieldId} style={{ background: '#12192c', color: '#fff' }}>
                  {f.name} ({f.cropType})
                </option>
              ))}
            </select>
          </div>

          {/* Weather Widget */}
          {weather && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <CloudSun size={18} color="var(--accent-amber)" />
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{weather.temperature}°C</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: '6px', fontSize: '0.78rem' }}>{weather.condition}</span>
              </div>
            </div>
          )}

          {/* Backend DB Mode Indicator Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className={`badge ${isMongoConnected ? 'badge-optimal' : 'badge-cyan'}`}>
              <Database size={13} />
              {isMongoConnected ? 'MongoDB Live' : 'Memory Engine'}
            </div>
          </div>

          {/* Refresh Button */}
          <button 
            onClick={onRefresh} 
            className="btn-secondary" 
            style={{ padding: '8px 12px', fontSize: '0.82rem' }}
            disabled={loading}
            title="Refresh All Telemetry & Data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

      </div>
    </header>
  );
}
