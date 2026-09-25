const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  fieldId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  locationName: { type: String, required: true },
  areaAcres: { type: Number, required: true },
  cropType: { type: String, required: true },
  cropVariety: { type: String, default: 'Standard' },
  growthStage: { type: String, required: true }, // e.g. 'Vegetative', 'Flowering', 'Maturation'
  soilType: { type: String, required: true }, // e.g. 'Clay Loam', 'Sandy Loam', 'Black Soil'
  plantedDate: { type: Date, default: Date.now },
  expectedHarvestDate: { type: Date },
  status: { type: String, enum: ['Optimal', 'Attention Needed', 'Critical'], default: 'Optimal' },
  gisCoordinates: {
    type: [[Number]], // Array of [lat, lng] coordinates forming a polygon
    required: true
  },
  centerPoint: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  sensorNodeId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Field', fieldSchema);
