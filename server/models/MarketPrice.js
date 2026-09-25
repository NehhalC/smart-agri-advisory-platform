const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  commodityId: { type: String, required: true, unique: true },
  commodityName: { type: String, required: true },
  category: { type: String, required: true }, // e.g. 'Cereals', 'Vegetables', 'Pulses', 'Oilseeds'
  currentPrice: { type: Number, required: true }, // Price per unit
  unit: { type: String, default: 'Quintal (100kg)' },
  mandiName: { type: String, required: true },
  dailyChange: { type: Number, required: true }, // Percentage change
  trend: { type: String, enum: ['Bullish', 'Bearish', 'Stable'], default: 'Stable' },
  aiPrediction7Days: { type: Number, required: true }, // Predicted price in 7 days
  priceHistory: [{
    date: String,
    price: Number
  }],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
