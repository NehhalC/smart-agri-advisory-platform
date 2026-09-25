const CropScan = require('../models/CropScan');
const { getIsMongoConnected, getMemoryStore } = require('../config/db');

// GET /api/crop-health/scans - Get all crop scans
exports.getCropScans = async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const scans = await CropScan.find().sort({ scannedAt: -1 });
      return res.json({ success: true, count: scans.length, dataSource: 'MongoDB', scans });
    }

    const memoryStore = getMemoryStore();
    res.json({ 
      success: true, 
      count: memoryStore.cropScans.length, 
      dataSource: 'MemoryStore', 
      scans: memoryStore.cropScans 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/crop-health/diagnose - AI Disease Detection Simulator
exports.diagnoseCrop = async (req, res) => {
  try {
    const { cropName, fieldId, sampleType, customImageUrl } = req.body;

    const diseaseLibrary = {
      tomato: {
        diagnosis: 'Tomato Early Blight (Alternaria solani)',
        healthStatus: 'Diseased',
        confidenceScore: 96.4,
        symptoms: [
          'Concentric ring spots ("bullseye") on lower mature leaves',
          'Yellow chlorotic halos surrounding leaf lesions',
          'Stem dark sunken cankers'
        ],
        treatmentPlan: 'Prune lower infected leaves. Apply copper-based or Mancozeb fungicide spray.',
        organicRemedy: 'Neem Oil 10,000 PPM @ 5ml/L + Bacillus subtilis solution.',
        chemicalRemedy: 'Chlorothalonil 75% WP @ 2.5g/L water.',
        imageUrl: customImageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a9d?auto=format&fit=crop&w=600&q=80'
      },
      wheat: {
        diagnosis: 'Wheat Yellow Stripe Rust (Puccinia striiformis)',
        healthStatus: 'Warning',
        confidenceScore: 92.1,
        symptoms: [
          'Bright yellow linear stripe pustules along leaf veins',
          'Yellow powdery urediniospores rubbing off on touch'
        ],
        treatmentPlan: 'Apply triazole fungicides immediately upon first pustule observation to prevent yield loss.',
        organicRemedy: 'Sour buttermilk (Lassi) spray @ 10% solution + Garlic extract.',
        chemicalRemedy: 'Propiconazole 25% EC @ 1ml/L water.',
        imageUrl: customImageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
      },
      cotton: {
        diagnosis: 'Cotton Bacterial Blight / Angular Leaf Spot',
        healthStatus: 'Diseased',
        confidenceScore: 94.7,
        symptoms: [
          'Angular water-soaked leaf lesions bounded by veins',
          'Black arm symptoms on stems and boll rot pinholes'
        ],
        treatmentPlan: 'Avoid sprinkler irrigation. Destroy infected crop residue after harvest.',
        organicRemedy: 'Streptomyces rimosus bio-bactericide application.',
        chemicalRemedy: 'Streptocycline 6g + Copper Oxychloride 500g in 500L water per acre.',
        imageUrl: customImageUrl || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80'
      },
      rice: {
        diagnosis: 'Rice Blast (Magnaporthe oryzae)',
        healthStatus: 'Diseased',
        confidenceScore: 97.8,
        symptoms: [
          'Spindle-shaped or diamond leaf spots with gray centers',
          'Node rot and neck blast causing white unfilled panicles'
        ],
        treatmentPlan: 'Maintain 5cm water layer. Avoid excess Nitrogen fertilization.',
        organicRemedy: 'Pseudomonas fluorescens 10g/L foliar spray.',
        chemicalRemedy: 'Tricyclazole 75% WP @ 0.6g/L water.',
        imageUrl: customImageUrl || 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80'
      },
      healthy: {
        diagnosis: 'Healthy Crop - Zero Pathogens Detected',
        healthStatus: 'Healthy',
        confidenceScore: 99.2,
        symptoms: [
          'Optimal leaf turgidity and chlorophyll absorption',
          'Clean leaf margins free of lesions or pest punctures'
        ],
        treatmentPlan: 'Continue regular preventive care and balanced irrigation schedule.',
        organicRemedy: 'Monthly vermicompost tea drenching.',
        chemicalRemedy: 'None required.',
        imageUrl: customImageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
      }
    };

    const targetKey = (sampleType || cropName || 'healthy').toLowerCase();
    const result = diseaseLibrary[targetKey] || diseaseLibrary['healthy'];

    const newScan = {
      scanId: `SCAN-${Date.now().toString().slice(-4)}`,
      fieldId: fieldId || 'FIELD-01',
      cropName: cropName || 'Crop Sample',
      diagnosis: result.diagnosis,
      healthStatus: result.healthStatus,
      confidenceScore: result.confidenceScore,
      symptoms: result.symptoms,
      treatmentPlan: result.treatmentPlan,
      organicRemedy: result.organicRemedy,
      chemicalRemedy: result.chemicalRemedy,
      imageUrl: result.imageUrl,
      scannedAt: new Date().toISOString()
    };

    const memoryStore = getMemoryStore();
    memoryStore.cropScans.unshift(newScan);

    if (getIsMongoConnected()) {
      const dbScan = new CropScan(newScan);
      await dbScan.save();
    }

    res.status(201).json({ success: true, scan: newScan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
