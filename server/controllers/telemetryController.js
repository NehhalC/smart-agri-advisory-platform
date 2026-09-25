const Telemetry = require('../models/Telemetry');
const { getIsMongoConnected, getMemoryStore } = require('../config/db');

// GET /api/telemetry - Get all sensor telemetry
exports.getTelemetry = async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const telemetry = await Telemetry.find().sort({ timestamp: -1 });
      return res.json({ success: true, count: telemetry.length, dataSource: 'MongoDB', telemetry });
    }

    const memoryStore = getMemoryStore();
    // Simulate slight sensor jitter for real-time feel
    Object.keys(memoryStore.telemetry).forEach(nodeId => {
      const t = memoryStore.telemetry[nodeId];
      const jitterMoisture = (Math.random() * 0.4 - 0.2).toFixed(1);
      const jitterTemp = (Math.random() * 0.2 - 0.1).toFixed(1);
      
      t.soilMoisturePercent = Math.min(100, Math.max(10, parseFloat((t.soilMoisturePercent + parseFloat(jitterMoisture)).toFixed(1))));
      t.airTemperatureC = parseFloat((t.airTemperatureC + parseFloat(jitterTemp)).toFixed(1));
      t.timestamp = new Date().toISOString();
    });

    res.json({ 
      success: true, 
      dataSource: 'MemoryStore', 
      telemetry: Object.values(memoryStore.telemetry) 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/telemetry/:sensorNodeId - Get telemetry for specific sensor node
exports.getTelemetryByNode = async (req, res) => {
  try {
    const { sensorNodeId } = req.params;

    if (getIsMongoConnected()) {
      const nodeTelemetry = await Telemetry.findOne({ sensorNodeId }).sort({ timestamp: -1 });
      if (!nodeTelemetry) return res.status(404).json({ success: false, message: 'Sensor node not found' });
      return res.json({ success: true, telemetry: nodeTelemetry });
    }

    const memoryStore = getMemoryStore();
    const nodeTelemetry = memoryStore.telemetry[sensorNodeId];
    if (!nodeTelemetry) return res.status(404).json({ success: false, message: 'Sensor node not found' });

    res.json({ success: true, dataSource: 'MemoryStore', telemetry: nodeTelemetry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/telemetry/simulate - Trigger custom telemetry update (e.g. Irrigation simulation)
exports.updateTelemetry = async (req, res) => {
  try {
    const { sensorNodeId, soilMoisturePercent, nitrogenPpm, phosphorusPpm, potassiumPpm } = req.body;
    
    const memoryStore = getMemoryStore();
    if (memoryStore.telemetry[sensorNodeId]) {
      if (soilMoisturePercent !== undefined) memoryStore.telemetry[sensorNodeId].soilMoisturePercent = soilMoisturePercent;
      if (nitrogenPpm !== undefined) memoryStore.telemetry[sensorNodeId].nitrogenPpm = nitrogenPpm;
      if (phosphorusPpm !== undefined) memoryStore.telemetry[sensorNodeId].phosphorusPpm = phosphorusPpm;
      if (potassiumPpm !== undefined) memoryStore.telemetry[sensorNodeId].potassiumPpm = potassiumPpm;
      memoryStore.telemetry[sensorNodeId].timestamp = new Date().toISOString();
    }

    if (getIsMongoConnected()) {
      await Telemetry.findOneAndUpdate(
        { sensorNodeId },
        { 
          soilMoisturePercent, 
          nitrogenPpm, 
          phosphorusPpm, 
          potassiumPpm, 
          timestamp: new Date() 
        },
        { new: true, upsert: true }
      );
    }

    res.json({ 
      success: true, 
      message: 'Telemetry updated successfully', 
      telemetry: memoryStore.telemetry[sensorNodeId] 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
