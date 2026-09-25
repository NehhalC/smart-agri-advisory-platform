const Recommendation = require('../models/Recommendation');
const { getIsMongoConnected, getMemoryStore } = require('../config/db');

// GET /api/recommendations - Get all AI recommendations
exports.getRecommendations = async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const recs = await Recommendation.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: recs.length, dataSource: 'MongoDB', recommendations: recs });
    }

    const memoryStore = getMemoryStore();
    res.json({ 
      success: true, 
      count: memoryStore.recommendations.length, 
      dataSource: 'MemoryStore', 
      recommendations: memoryStore.recommendations 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATCH /api/recommendations/:recId/status - Update recommendation status (Applied / Dismissed)
exports.updateStatus = async (req, res) => {
  try {
    const { recId } = req.params;
    const { status } = req.body; // 'Applied' or 'Dismissed'

    if (!['Active', 'Applied', 'Dismissed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (getIsMongoConnected()) {
      const updated = await Recommendation.findOneAndUpdate({ recId }, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Recommendation not found' });
      return res.json({ success: true, recommendation: updated });
    }

    const memoryStore = getMemoryStore();
    const rec = memoryStore.recommendations.find(r => r.recId === recId);
    if (!rec) return res.status(404).json({ success: false, message: 'Recommendation not found' });

    rec.status = status;
    
    // If applied irrigation rec, auto update soil moisture in telemetry memory store!
    if (status === 'Applied' && rec.category === 'Irrigation') {
      const targetNode = memoryStore.telemetry['SNODE-104'];
      if (targetNode) {
        targetNode.soilMoisturePercent = Math.min(85, targetNode.soilMoisturePercent + 35);
      }
    }

    res.json({ success: true, dataSource: 'MemoryStore', recommendation: rec });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/recommendations/generate - Dynamic AI Engine Recommendation Generator
exports.generateCustomRecommendation = async (req, res) => {
  try {
    const { fieldId, cropType, soilMoisture, soilPh, nitrogenLevel, weatherCondition } = req.body;

    let category = 'Irrigation';
    let priority = 'Medium';
    let title = '';
    let summary = '';
    let aiRationale = '';
    let suggestedAction = '';
    let estimatedImpact = '';

    const moisture = parseFloat(soilMoisture) || 40;
    const nitrogen = parseFloat(nitrogenLevel) || 100;
    const ph = parseFloat(soilPh) || 6.5;

    if (moisture < 25) {
      category = 'Irrigation';
      priority = 'Critical';
      title = `Urgent Hydration Advisory for ${cropType || 'Crop'}`;
      summary = `Soil moisture is severely depleted at ${moisture}%. Root zone wilting threshold imminent.`;
      aiRationale = `Evapotranspiration rate exceeds standard absorption. Moisture deficit at ${moisture}% will cause vascular collapse if unwatered within 12 hours.`;
      suggestedAction = `Schedule immediate drip irrigation pulse of 3.5 hours delivering ~32,000 Liters of water per acre.`;
      estimatedImpact = `Prevents 30% yield penalty ($1,800 saved per acre)`;
    } else if (nitrogen < 90) {
      category = 'Fertilization';
      priority = 'High';
      title = `Nitrogen Replenishment Protocol for ${cropType || 'Crop'}`;
      summary = `Sub-optimal soil Nitrogen (${nitrogen} ppm). Foliar chlorosis risk detected.`;
      aiRationale = `Leaf canopy expansion requires minimum 120 ppm Nitrogen for active photosynthesis during vegetative stage.`;
      suggestedAction = `Apply Fertigation liquid Urea (46% N) @ 15kg/acre blended with humic acid solution.`;
      estimatedImpact = `Boosts chlorophyll density by +22%`;
    } else if (ph < 5.8) {
      category = 'Fertilization';
      priority = 'High';
      title = `Soil Acidification Correction for ${cropType || 'Crop'}`;
      summary = `Soil pH ${ph} is acidic. Micro-element nutrient lock-up occurring.`;
      aiRationale = `Acidic pH below 6.0 locks Phosphorus and Potassium, preventing root transport despite high soil content.`;
      suggestedAction = `Apply Agricultural Gypsum/Lime @ 200 kg/acre broadcasted uniformly before next irrigation.`;
      estimatedImpact = `Restores nutrient availability index by +40%`;
    } else {
      category = 'Harvesting';
      priority = 'Low';
      title = `Optimized Maintenance Window for ${cropType || 'Crop'}`;
      summary = `Micro-climate and soil parameters are balanced (Moisture: ${moisture}%, pH: ${ph}).`;
      aiRationale = `Current growth conditions align with peak yield index. Weather forecast is stable for next 5 days.`;
      suggestedAction = `Maintain standard monitoring protocol. Prepare storage facilities for upcoming harvest phase.`;
      estimatedImpact = `Preserves 100% peak quality grade`;
    }

    const newRec = {
      recId: `REC-${Date.now().toString().slice(-6)}`,
      fieldId: fieldId || 'FIELD-01',
      category,
      priority,
      title,
      summary,
      aiRationale,
      suggestedAction,
      estimatedImpact,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    const memoryStore = getMemoryStore();
    memoryStore.recommendations.unshift(newRec);

    if (getIsMongoConnected()) {
      const dbRec = new Recommendation(newRec);
      await dbRec.save();
    }

    res.status(201).json({ success: true, recommendation: newRec });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
