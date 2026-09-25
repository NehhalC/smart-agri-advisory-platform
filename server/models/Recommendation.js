const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  recId: { type: String, required: true, unique: true },
  fieldId: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Irrigation', 'Fertilization', 'Pest Control', 'Harvesting', 'Market Strategy'], 
    required: true 
  },
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  aiRationale: { type: String, required: true },
  suggestedAction: { type: String, required: true },
  estimatedImpact: { type: String }, // e.g. "+15% Yield", "Saves 12,000L Water"
  status: { type: String, enum: ['Active', 'Applied', 'Dismissed'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
