import React, { useState } from 'react';
import { Bot, CheckCircle, AlertOctagon, Sparkles, Volume2, Plus, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

export default function AiAdvisor({ recommendations, onStatusUpdate, onGenerateRec }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [speakingRecId, setSpeakingRecId] = useState(null);

  // Form state for custom AI generator modal
  const [formState, setFormState] = useState({
    cropType: 'Wheat',
    soilMoisture: '22',
    soilPh: '6.5',
    nitrogenLevel: '80',
    weatherCondition: 'Sunny'
  });

  const categories = ['All', 'Irrigation', 'Fertilization', 'Pest Control', 'Harvesting', 'Market Strategy'];

  const filteredRecs = filterCategory === 'All'
    ? recommendations
    : recommendations.filter(r => r.category === filterCategory);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return <span className="badge badge-critical"><AlertOctagon size={12}/> Critical</span>;
      case 'High': return <span className="badge badge-warning"><ShieldAlert size={12}/> High</span>;
      case 'Medium': return <span className="badge badge-cyan"><Zap size={12}/> Medium</span>;
      default: return <span className="badge badge-optimal"><CheckCircle size={12}/> Low</span>;
    }
  };

  const speakText = (text, id) => {
    if ('speechSynthesis' in window) {
      if (speakingRecId === id) {
        window.speechSynthesis.cancel();
        setSpeakingRecId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeakingRecId(null);
      setSpeakingRecId(id);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Voice Readout: "${text}"`);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onGenerateRec(formState);
    setIsModalOpen(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
      
      {/* Header & Generator Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)' }}>
              <Bot size={22} color="var(--accent-emerald)" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Timely Farm Recommendation Engine</h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time actionable guidance tailored to soil sensors, weather forecasts & crop growth stages
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          style={{ fontSize: '0.85rem' }}
        >
          <Sparkles size={16} />
          Generate Custom AI Advisory
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              border: filterCategory === cat ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
              background: filterCategory === cat ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
              color: filterCategory === cat ? '#34d399' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '580px', overflowY: 'auto', paddingRight: '4px' }}>
        {filteredRecs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No active recommendations for category "{filterCategory}".
          </div>
        ) : (
          filteredRecs.map(rec => (
            <div 
              key={rec.recId} 
              className="glass-panel animate-fade-in"
              style={{
                padding: '18px',
                borderLeft: rec.status === 'Applied' ? '4px solid #10b981' : rec.priority === 'Critical' ? '4px solid #f43f5e' : '4px solid #f59e0b',
                background: rec.status === 'Applied' ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)'
              }}
            >
              {/* Card Top Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {getPriorityBadge(rec.priority)}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>{rec.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>• {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{rec.title}</h3>
                </div>

                {/* Audio voice readout button */}
                <button 
                  onClick={() => speakText(`${rec.title}. ${rec.suggestedAction}`, rec.recId)}
                  style={{
                    background: speakingRecId === rec.recId ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-color)',
                    color: speakingRecId === rec.recId ? '#fff' : 'var(--text-muted)',
                    padding: '6px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  title="Listen to Audio Recommendation"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              {/* Summary & Rationale */}
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                {rec.summary}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'block', marginBottom: '2px' }}>
                  AI Rationale & Model Insight:
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {rec.aiRationale}
                </span>
              </div>

              {/* Action Plan & Impact */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>
                    💡 Action: <span style={{ color: '#cbd5e1', fontWeight: 400 }}>{rec.suggestedAction}</span>
                  </div>
                  {rec.estimatedImpact && (
                    <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '2px', fontWeight: 600 }}>
                      📈 Expected Impact: {rec.estimatedImpact}
                    </div>
                  )}
                </div>

                {rec.status === 'Applied' ? (
                  <span className="badge badge-optimal" style={{ padding: '6px 12px' }}>
                    <CheckCircle size={14} /> Applied
                  </span>
                ) : (
                  <button 
                    onClick={() => onStatusUpdate(rec.recId, 'Applied')}
                    className="btn-primary" 
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    Apply Action <ArrowRight size={14} />
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Custom AI Generator Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px', background: '#12192c', border: '1px solid var(--accent-emerald)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles color="var(--accent-emerald)" size={20} />
                Generate Custom AI Recommendation
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Crop Type</label>
                <input 
                  type="text" 
                  value={formState.cropType} 
                  onChange={(e) => setFormState({...formState, cropType: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Soil Moisture (%)</label>
                  <input 
                    type="number" 
                    value={formState.soilMoisture} 
                    onChange={(e) => setFormState({...formState, soilMoisture: e.target.value})}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Soil pH Level</label>
                  <input 
                    type="number" step="0.1" 
                    value={formState.soilPh} 
                    onChange={(e) => setFormState({...formState, soilPh: e.target.value})}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nitrogen N (ppm)</label>
                  <input 
                    type="number" 
                    value={formState.nitrogenLevel} 
                    onChange={(e) => setFormState({...formState, nitrogenLevel: e.target.value})}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Weather Condition</label>
                  <select 
                    value={formState.weatherCondition}
                    onChange={(e) => setFormState({...formState, weatherCondition: e.target.value})}
                    style={{ width: '100%', padding: '8px 12px', background: '#1e293b', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                  >
                    <option value="Sunny">Sunny / Clear</option>
                    <option value="Partly Cloudy">Partly Cloudy</option>
                    <option value="Rain Forecasted">Rain Forecasted</option>
                    <option value="Heatwave">Heatwave / Extreme Temp</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Generate Advisory</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
