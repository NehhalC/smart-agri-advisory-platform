const mongoose = require('mongoose');

const cropScanSchema = new mongoose.Schema({
  scanId: { type: String, required: true, unique: true },
  fieldId: { type: String, required: true },
  cropName: { type: String, required: true },
  diagnosis: { type: String, required: true },
  healthStatus: { type: String, enum: ['Healthy', 'Warning', 'Diseased'], required: true },
  confidenceScore: { type: Number, required: true }, // e.g. 96.5
  symptoms: [String],
  treatmentPlan: { type: String, required: true },
  organicRemedy: { type: String },
  chemicalRemedy: { type: String },
  imageUrl: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CropScan', cropScanSchema);
