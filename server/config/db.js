const mongoose = require('mongoose');
const { 
  initialFields, 
  initialTelemetry, 
  initialRecommendations, 
  initialCropScans, 
  initialMarketPrices,
  initialWeather
} = require('../data/seedData');

let isMongoConnected = false;

// In-Memory Data Store Fallback
const memoryStore = {
  fields: [...initialFields],
  telemetry: { ...initialTelemetry },
  recommendations: [...initialRecommendations],
  cropScans: [...initialCropScans],
  marketPrices: [...initialMarketPrices],
  weather: { ...initialWeather },
  irrigationStatus: {
    pumpActive: false,
    mode: 'Auto', // Auto or Manual
    lastWatered: new Date(Date.now() - 43200000).toISOString(),
    nextScheduled: new Date(Date.now() + 14400000).toISOString()
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agripulse';
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // Quick timeout to fallback if local mongod is absent
    });
    
    isMongoConnected = true;
    console.log('✅ MongoDB Connected successfully to:', mongoURI);
    
    // Seed MongoDB collections if empty
    await seedMongoDatabase();
  } catch (err) {
    isMongoConnected = false;
    console.log('⚠️ MongoDB connection could not be established (Service offline or uninstalled).');
    console.log('🚀 AgriPulse backend automatically engaged IN-MEMORY DATA ENGINE mode.');
    console.log('💡 All API endpoints, AI recommendations, GIS mapping & CRUD features will work seamlessly!');
  }
};

const seedMongoDatabase = async () => {
  try {
    const Field = require('../models/Field');
    const Telemetry = require('../models/Telemetry');
    const Recommendation = require('../models/Recommendation');
    const CropScan = require('../models/CropScan');
    const MarketPrice = require('../models/MarketPrice');

    const fieldCount = await Field.countDocuments();
    if (fieldCount === 0) {
      console.log('🌱 Seeding MongoDB initial dataset...');
      await Field.insertMany(initialFields);
      await Recommendation.insertMany(initialRecommendations);
      await CropScan.insertMany(initialCropScans);
      await MarketPrice.insertMany(initialMarketPrices);
      
      const telemetryArray = Object.values(initialTelemetry);
      await Telemetry.insertMany(telemetryArray);
      console.log('✨ MongoDB seeding complete!');
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err.message);
  }
};

const getIsMongoConnected = () => isMongoConnected;
const getMemoryStore = () => memoryStore;

module.exports = {
  connectDB,
  getIsMongoConnected,
  getMemoryStore
};
