import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle, ShieldCheck, CheckCircle2, Leaf, Bug, Sparkles, Activity } from 'lucide-react';

export default function CropHealthDiagnostics({ cropScans, onDiagnoseCrop }) {
  const [selectedScan, setSelectedScan] = useState(cropScans?.[0] || null);
  const [activeCropSample, setActiveCropSample] = useState('tomato');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const samplePresets = [
    { key: 'tomato', name: 'Tomato Leaf Sample', status: 'Diseased (Early Blight)' },
    { key: 'wheat', name: 'Wheat Canopy Sample', status: 'Warning (Stripe Rust)' },
    { key: 'cotton', name: 'Cotton Boll Sample', status: 'Warning (Pest Damage)' },
    { key: 'rice', name: 'Rice Field Leaf Sample', status: 'Diseased (Rice Blast)' },
    { key: 'healthy', name: 'Wheat Leaf Sample', status: 'Healthy Canopy' }
  ];

  const handleDiagnose = async (sampleKey) => {
    setActiveCropSample(sampleKey);
    setIsAnalyzing(true);
    
    // Simulate AI Computer Vision inference delay (1.2s)
    setTimeout(async () => {
      const newScan = await onDiagnoseCrop(sampleKey);
      if (newScan) setSelectedScan(newScan);
      setIsAnalyzing(false);
    }, 1000);
  };

  const current = selectedScan || cropScans?.[0] || {
    scanId: 'SCAN-801',
    cropName: 'Tomato',
    diagnosis: 'Tomato Early Blight (Alternaria solani)',
    healthStatus: 'Diseased',
    confidenceScore: 94.8,
    symptoms: [
      'Concentric ring spots ("bullseye") on lower mature leaves',
      'Yellow chlorotic halos surrounding brown leaf lesions'
    ],
    treatmentPlan: 'Prune infected leaves. Apply chlorothalonil or copper oxychloride spray.',
    organicRemedy: 'Bio-fungicide spray containing Bacillus subtilis twice weekly.',
    chemicalRemedy: 'Mancozeb 75% WP @ 2g/L water.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a9d?auto=format&fit=crop&w=600&q=80'
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)' }}>
              <Camera size={22} color="var(--accent-rose)" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Crop Health & Pathology Scan Diagnostics</h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Deep learning visual recognition engine for pest detection, foliar diseases & deficiency analysis
          </p>
        </div>

        <span className="badge badge-optimal">
          <Sparkles size={12} /> CV Model v3.4 Active
        </span>
      </div>

      {/* Main Grid: Left Scanner & Samples | Right Scan Diagnosis Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Left Column: Image Scanner & Presets */}
        <div>
          
          {/* Dropzone Upload Box */}
          <div className="glass-panel" style={{ 
            padding: '24px', 
            textAlign: 'center', 
            border: '2px dashed var(--border-color)', 
            marginBottom: '16px',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{ 
              width: '54px', 
              height: '54px', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Upload size={24} color="var(--accent-emerald)" />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              Upload Crop Image / Leaf Scan
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Supports JPG, PNG (Max 15MB). AI detects 80+ crop diseases & pest infestations.
            </p>
            <button 
              onClick={() => handleDiagnose('tomato')} 
              className="btn-primary" 
              style={{ fontSize: '0.82rem' }}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <Activity size={16} className="animate-spin" /> : <Camera size={16} />}
              {isAnalyzing ? 'Analyzing Neural Layers...' : 'Scan Sample Leaf'}
            </button>
          </div>

          {/* Preset Sample Selector Library */}
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
            🧪 Pre-analyzed Field Samples Library
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {samplePresets.map(preset => (
              <div 
                key={preset.key}
                onClick={() => handleDiagnose(preset.key)}
                className="glass-panel glass-panel-interactive"
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: activeCropSample === preset.key ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                  background: activeCropSample === preset.key ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{preset.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{preset.status}</div>
                </div>
                <Leaf size={16} color="var(--accent-emerald)" />
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: AI Analysis Detailed Card */}
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-color)' }}>
          
          {isAnalyzing ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: '48px', height: '48px', border: '4px solid var(--accent-emerald)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }}></div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>Processing Neural Feature Maps</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Executing convolutional disease classification model...</p>
            </div>
          ) : (
            <div>
              
              {/* Image & Bounding Box Simulator */}
              <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '16px' }}>
                <img 
                  src={current.imageUrl} 
                  alt={current.cropName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '25%', 
                  left: '30%', 
                  width: '35%', 
                  height: '45%', 
                  border: '2px dashed #f43f5e', 
                  borderRadius: '6px',
                  boxShadow: '0 0 15px rgba(244,63,94,0.6)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '4px'
                }}>
                  <span style={{ background: '#f43f5e', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 4px', borderRadius: '2px' }}>
                    Pathogen Identified ({current.confidenceScore}%)
                  </span>
                </div>
              </div>

              {/* Diagnosis Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>CROP SCAN RESULT</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{current.diagnosis}</h3>
                </div>
                <span className={`badge ${current.healthStatus === 'Healthy' ? 'badge-optimal' : current.healthStatus === 'Warning' ? 'badge-warning' : 'badge-critical'}`}>
                  {current.healthStatus}
                </span>
              </div>

              {/* Confidence Bar */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Model Confidence Score:</span>
                  <strong style={{ color: '#34d399' }}>{current.confidenceScore}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${current.confidenceScore}%`, height: '100%', background: 'var(--accent-emerald)' }}></div>
                </div>
              </div>

              {/* Symptoms List */}
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Detected Symptoms:</h4>
                <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {current.symptoms?.map((s, idx) => (
                    <li key={idx} style={{ marginBottom: '3px' }}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Treatment Protocols */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bug size={16} color="var(--accent-amber)" /> AI Treatment & Agronomist Remedy Plan
                </h4>

                {current.organicRemedy && (
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
                    🌿 <strong>Organic / Bio-remedy:</strong> {current.organicRemedy}
                  </div>
                )}

                {current.chemicalRemedy && (
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
                    🧪 <strong>Chemical Application:</strong> {current.chemicalRemedy}
                  </div>
                )}
                
                <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '8px' }}>
                  💡 <em>Note: Always wear protective masks when spraying. Apply during low wind early morning hours.</em>
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
