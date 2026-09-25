import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, Calculator, Store, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MarketTrends({ marketPrices, onCalculateProfit }) {
  const [selectedCommodity, setSelectedCommodity] = useState(marketPrices?.[0] || null);

  // Profit Calculator State
  const [calcInputs, setCalcInputs] = useState({
    cropName: 'Wheat',
    acreArea: '5',
    seedCost: '4500',
    fertilizerCost: '8500',
    laborCost: '6000',
    expectedYieldQuintal: '22',
    marketPricePerQuintal: '2450'
  });

  const [calcResult, setCalcResult] = useState(null);

  const current = selectedCommodity || marketPrices?.[0] || {
    commodityName: 'Wheat',
    currentPrice: 2450,
    mandiName: 'Khanna APMC, Punjab',
    dailyChange: 1.8,
    trend: 'Bullish',
    aiPrediction7Days: 2580,
    priceHistory: [
      { date: 'Sep 19', price: 2380 },
      { date: 'Sep 20', price: 2395 },
      { date: 'Sep 21', price: 2410 },
      { date: 'Sep 22', price: 2400 },
      { date: 'Sep 23', price: 2425 },
      { date: 'Sep 24', price: 2440 },
      { date: 'Sep 25', price: 2450 }
    ]
  };

  // Price Trend Chart Data
  const priceChartData = {
    labels: [...(current.priceHistory?.map(p => p.date) || []), 'Forecast +7D'],
    datasets: [
      {
        label: `${current.commodityName} Price (₹/Quintal)`,
        data: [...(current.priceHistory?.map(p => p.price) || []), current.aiPrediction7Days],
        borderColor: current.dailyChange >= 0 ? '#10b981' : '#f43f5e',
        backgroundColor: current.dailyChange >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8' } }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  const handleCalculatorSubmit = async (e) => {
    e.preventDefault();
    const result = await onCalculateProfit(calcInputs);
    if (result) setCalcResult(result);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)' }}>
              <TrendingUp size={22} color="var(--accent-amber)" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>APMC Market Trends & AI Price Forecasting</h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time mandi liquidation rates, predictive market trajectory & financial margin modeling
          </p>
        </div>
      </div>

      {/* Commodity Prices Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {marketPrices?.map(item => {
          const isSel = current.commodityId === item.commodityId;
          const isUp = item.dailyChange >= 0;
          return (
            <div 
              key={item.commodityId || item.commodityName}
              onClick={() => setSelectedCommodity(item)}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '16px',
                cursor: 'pointer',
                border: isSel ? '1px solid var(--accent-amber)' : '1px solid var(--border-color)',
                background: isSel ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{item.commodityName}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isUp ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center' }}>
                  {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {item.dailyChange}%
                </span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                ₹{item.currentPrice} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {item.unit || 'Quintal'}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                📍 {item.mandiName}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Chart & Profit Calculator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Left Column: Price Forecast Chart */}
        <div className="glass-panel" style={{ padding: '20px', height: '360px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
              {current.commodityName} Price Forecast
            </h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
              7D Forecast: ₹{current.aiPrediction7Days}
            </span>
          </div>

          <div style={{ flex: 1, minHeight: '260px' }}>
            <Line data={priceChartData} options={chartOptions} />
          </div>
        </div>

        {/* Right Column: Profit Margin Calculator */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} color="var(--accent-emerald)" /> Farm Yield & Profit Margin Calculator
          </h3>

          <form onSubmit={handleCalculatorSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Land Area (Acres)</label>
                <input 
                  type="number" 
                  value={calcInputs.acreArea} 
                  onChange={(e) => setCalcInputs({...calcInputs, acreArea: e.target.value})}
                  style={{ width: '100%', padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Expected Yield (Q/Acre)</label>
                <input 
                  type="number" 
                  value={calcInputs.expectedYieldQuintal} 
                  onChange={(e) => setCalcInputs({...calcInputs, expectedYieldQuintal: e.target.value})}
                  style={{ width: '100%', padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seed (₹)</label>
                <input 
                  type="number" 
                  value={calcInputs.seedCost} 
                  onChange={(e) => setCalcInputs({...calcInputs, seedCost: e.target.value})}
                  style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fertilizer (₹)</label>
                <input 
                  type="number" 
                  value={calcInputs.fertilizerCost} 
                  onChange={(e) => setCalcInputs({...calcInputs, fertilizerCost: e.target.value})}
                  style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Labor (₹)</label>
                <input 
                  type="number" 
                  value={calcInputs.laborCost} 
                  onChange={(e) => setCalcInputs({...calcInputs, laborCost: e.target.value})}
                  style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '14px', fontSize: '0.85rem' }}>
              Calculate Net Profit & ROI
            </button>
          </form>

          {calcResult && (
            <div className="glass-panel" style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-emerald)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                <div>Total Cost: <strong>₹{calcResult.financials.totalInvestmentCost}</strong></div>
                <div>Gross Rev: <strong>₹{calcResult.financials.grossRevenue}</strong></div>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', gridColumn: 'span 2' }}>
                  💰 Net Profit: ₹{calcResult.financials.netProfit} ({calcResult.financials.roiPercent}% ROI)
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
