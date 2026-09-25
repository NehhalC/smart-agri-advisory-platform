const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  sensorNodeId: { type: String, required: true },
  fieldId: { type: String, required: true },
  soilMoisturePercent: { type: Number, required: true }, // 0 - 100%
  soilTemperatureC: { type: Number, required: true },
  airTemperatureC: { type: Number, required: true },
  airHumidityPercent: { type: Number, required: true },
  soilPh: { type: Number, required: true }, // e.g. 6.5
  nitrogenPpm: { type: Number, required: true }, // N level in ppm
  phosphorusPpm: { type: Number, required: true }, // P level in ppm
  potassiumPpm: { type: Number, required: true }, // K level in ppm
  solarRadiationWm2: { type: Number, default: 450 },
  uvIndex: { type: Number, default: 6 },
  batteryLevelPercent: { type: Number, default: 98 },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Telemetry', telemetrySchema);
