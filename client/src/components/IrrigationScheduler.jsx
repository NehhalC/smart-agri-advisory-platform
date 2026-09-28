import React, { useState } from 'react';
import { Power, CloudRain, Calendar, Gauge, Zap, CheckCircle2, Play, Square } from 'lucide-react';

export default function IrrigationScheduler({ irrigationData, onTogglePump }) {
  const status = irrigationData?.currentStatus || { pumpActive: false, mode: 'Auto' };
  const schedule = irrigationData?.weeklySchedule || [];
  const et0 = irrigationData?.evapotranspirationEt0MmDay || 4.8;

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePumpClick = async (action) => {
    setIsProcessing(true);
    await onTogglePump(action, status.mode);
    setIsProcessing(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#ebf8ff' }}>
              <Power size={22} color="var(--accent-cyan)" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-heading)' }}>Smart Irrigation Controller & ET0 Scheduler</h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Automated water balancing using Penman-Monteith evapotranspiration & rain-forecast skip rules
          </p>
        </div>

        <span className={`badge ${status.pumpActive ? 'badge-optimal' : 'badge-cyan'}`}>
          <span className="pulse-dot"></span> Pump: {status.pumpActive ? 'WATERING ACTIVE' : 'IDLE / STANDBY'}
        </span>
      </div>

      {/* Main Grid: Control Station & Weekly Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Left Column: Pump Station Control */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', border: status.pumpActive ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '14px' }}>
            Submersible Pump Station #4 Control
          </h3>

          {/* Animated Water Pump Gauge circle */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: status.pumpActive ? 'radial-gradient(circle, rgba(45,106,79,0.2) 0%, rgba(212,163,115,0.1) 100%)' : '#f5ebe0',
            border: status.pumpActive ? '3px solid #2d6a4f' : '3px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: status.pumpActive ? '0 0 25px rgba(45,106,79,0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <Power size={48} color={status.pumpActive ? '#2d6a4f' : '#8d7a6b'} />
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-heading)', fontWeight: 600, marginBottom: '4px' }}>
            Mode: <span style={{ color: 'var(--accent-emerald)' }}>{status.mode} Smart Adaptive</span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Evapotranspiration Rate (ET0): <strong>{et0} mm/day</strong> (Daily Water Loss)
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {status.pumpActive ? (
              <button 
                onClick={() => handlePumpClick('STOP')} 
                className="btn-secondary" 
                style={{ background: '#fff5f5', color: '#c05621', border: '1px solid #fbd5d5', padding: '10px 20px' }}
                disabled={isProcessing}
              >
                <Square size={16} /> Stop Water Pump
              </button>
            ) : (
              <button 
                onClick={() => handlePumpClick('START')} 
                className="btn-primary"
                style={{ padding: '10px 20px' }}
                disabled={isProcessing}
              >
                <Play size={16} /> Activate Water Pump
              </button>
            )}
          </div>
        </div>

        {/* Right Column: 7-Day Watering Calendar */}
        <div className="glass-panel" style={{ padding: '20px', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--accent-cyan)" /> 7-Day Irrigation Schedule & Rain Skip
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {schedule.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: item.rainProbability > 60 ? '#fff5f5' : '#faf7f2',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <strong style={{ color: 'var(--text-heading)', width: '36px' }}>{item.day}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {item.durationMinutes > 0 ? `⏱️ ${item.durationMinutes} min (${item.waterVolumeLiters}L)` : 'No watering needed'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.rainProbability > 60 ? (
                    <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      <CloudRain size={12} /> Rain Skip ({item.rainProbability}%)
                    </span>
                  ) : item.durationMinutes > 0 ? (
                    <span className="badge badge-optimal" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      <CheckCircle2 size={12} /> Scheduled
                    </span>
                  ) : (
                    <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      Optimal Soil
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
