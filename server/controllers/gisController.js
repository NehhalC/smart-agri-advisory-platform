const Field = require('../models/Field');
const { getIsMongoConnected, getMemoryStore } = require('../config/db');

// GET /api/gis/fields - Get all GIS farm field zones
exports.getFields = async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const fields = await Field.find();
      return res.json({ success: true, count: fields.length, dataSource: 'MongoDB', fields });
    }
    
    // In-memory fallback
    const memoryStore = getMemoryStore();
    res.json({ success: true, count: memoryStore.fields.length, dataSource: 'MemoryStore', fields: memoryStore.fields });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/gis/fields/:fieldId - Get detailed field info by ID
exports.getFieldById = async (req, res) => {
  try {
    const { fieldId } = req.params;
    
    if (getIsMongoConnected()) {
      const field = await Field.findOne({ fieldId });
      if (!field) return res.status(404).json({ success: false, message: 'Field not found' });
      return res.json({ success: true, field });
    }
    
    const memoryStore = getMemoryStore();
    const field = memoryStore.fields.find(f => f.fieldId === fieldId);
    if (!field) return res.status(404).json({ success: false, message: 'Field not found' });
    
    res.json({ success: true, dataSource: 'MemoryStore', field });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/gis/fields - Add new farm zone
exports.createField = async (req, res) => {
  try {
    const newFieldData = {
      fieldId: `FIELD-0${Date.now().toString().slice(-2)}`,
      ...req.body
    };

    if (getIsMongoConnected()) {
      const field = new Field(newFieldData);
      await field.save();
      return res.status(201).json({ success: true, field });
    }

    const memoryStore = getMemoryStore();
    memoryStore.fields.push(newFieldData);
    res.status(201).json({ success: true, dataSource: 'MemoryStore', field: newFieldData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
