const { getMemoryStore } = require('../config/db');

// GET /api/irrigation/schedule - Get smart irrigation status & 7-day water plan
exports.getIrrigationStatus = (req, res) => {
  try {
    const memoryStore = getMemoryStore();
    const weather = memoryStore.weather;
    const status = memoryStore.irrigationStatus;

    // Calculate dynamic ET0 (Penman-Monteith simplified formula demo)
    const temp = weather.temperature || 28;
    const wind = weather.windSpeedKm || 12;
    const humidity = weather.humidity || 55;
    const solar = 550; // W/m2

    // ET0 calculation in mm/day
    const et0 = parseFloat((0.0023 * (temp + 17.8) * Math.sqrt(Math.max(1, temp - 10)) * (1 + (wind / 100)) * (solar / 100)).toFixed(2));

    const weeklySchedule = [
      { day: 'Mon', targetMoisture: '50%', durationMinutes: 180, waterVolumeLiters: 18000, status: 'Completed', rainProbability: 10 },
      { day: 'Tue', targetMoisture: '50%', durationMinutes: 0, waterVolumeLiters: 0, status: 'Skipped (Optimal Soil)', rainProbability: 5 },
      { day: 'Wed', targetMoisture: '48%', durationMinutes: 210, waterVolumeLiters: 21000, status: 'Completed', rainProbability: 15 },
      { day: 'Thu', targetMoisture: '45%', durationMinutes: 0, waterVolumeLiters: 0, status: 'Scheduled (No Rain)', rainProbability: 20 },
      { day: 'Fri', targetMoisture: '52%', durationMinutes: 240, waterVolumeLiters: 24000, status: 'Pending', rainProbability: 10 },
      { day: 'Sat', targetMoisture: '--', durationMinutes: 0, waterVolumeLiters: 0, status: 'Auto-Skip (Heavy Rain Forecast)', rainProbability: 75 },
      { day: 'Sun', targetMoisture: '50%', durationMinutes: 120, waterVolumeLiters: 12000, status: 'Pending', rainProbability: 30 }
    ];

    res.json({
      success: true,
      currentStatus: status,
      weatherSummary: weather,
      evapotranspirationEt0MmDay: et0,
      weeklySchedule
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/irrigation/toggle-pump - Toggle irrigation pump state (Manual ON/OFF)
exports.togglePump = (req, res) => {
  try {
    const { action, mode } = req.body; // action: 'START' or 'STOP'
    const memoryStore = getMemoryStore();

    if (action === 'START') {
      memoryStore.irrigationStatus.pumpActive = true;
      memoryStore.irrigationStatus.lastWatered = new Date().toISOString();
      
      // Auto boost soil moisture across nodes to simulate active watering!
      Object.keys(memoryStore.telemetry).forEach(nodeId => {
        memoryStore.telemetry[nodeId].soilMoisturePercent = Math.min(85, memoryStore.telemetry[nodeId].soilMoisturePercent + 25);
      });
    } else if (action === 'STOP') {
      memoryStore.irrigationStatus.pumpActive = false;
    }

    if (mode) {
      memoryStore.irrigationStatus.mode = mode;
    }

    res.json({
      success: true,
      message: `Irrigation pump ${action === 'START' ? 'activated' : 'deactivated'} successfully`,
      irrigationStatus: memoryStore.irrigationStatus
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
