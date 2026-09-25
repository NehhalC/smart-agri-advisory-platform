const initialFields = [
  {
    fieldId: 'FIELD-01',
    name: 'Sector A - Golden Wheat Belt',
    locationName: 'Ludhiana, Punjab',
    areaAcres: 14.5,
    cropType: 'Wheat',
    cropVariety: 'HD-3086 (Pusa Gautami)',
    growthStage: 'Grain Filling',
    soilType: 'Clay Loam',
    plantedDate: '2025-11-10',
    expectedHarvestDate: '2026-04-15',
    status: 'Optimal',
    gisCoordinates: [
      [30.9010, 75.8573],
      [30.9045, 75.8610],
      [30.9020, 75.8655],
      [30.8985, 75.8615]
    ],
    centerPoint: { lat: 30.9015, lng: 75.8613 },
    sensorNodeId: 'SNODE-101'
  },
  {
    fieldId: 'FIELD-02',
    name: 'Sector B - Organic Tomatoes',
    locationName: 'Nashik, Maharashtra',
    areaAcres: 8.2,
    cropType: 'Tomato',
    cropVariety: 'Arka Rakshak',
    growthStage: 'Flowering & Fruiting',
    soilType: 'Red Loamy',
    plantedDate: '2025-12-01',
    expectedHarvestDate: '2026-03-30',
    status: 'Attention Needed',
    gisCoordinates: [
      [20.0050, 73.7850],
      [20.0090, 73.7885],
      [20.0075, 73.7930],
      [20.0035, 73.7895]
    ],
    centerPoint: { lat: 20.0062, lng: 73.7890 },
    sensorNodeId: 'SNODE-102'
  },
  {
    fieldId: 'FIELD-03',
    name: 'Sector C - Premium Cotton',
    locationName: 'Rajkot, Gujarat',
    areaAcres: 22.0,
    cropType: 'Cotton',
    cropVariety: 'Bt Cotton RCH-2',
    growthStage: 'Boll Formation',
    soilType: 'Black Cotton Soil',
    plantedDate: '2025-09-15',
    expectedHarvestDate: '2026-05-10',
    status: 'Optimal',
    gisCoordinates: [
      [22.3039, 70.8022],
      [22.3080, 70.8060],
      [22.3060, 70.8110],
      [22.3015, 70.8070]
    ],
    centerPoint: { lat: 22.3048, lng: 70.8065 },
    sensorNodeId: 'SNODE-103'
  },
  {
    fieldId: 'FIELD-04',
    name: 'Sector D - Basmati Rice Paddy',
    locationName: 'Karnal, Haryana',
    areaAcres: 18.0,
    cropType: 'Rice',
    cropVariety: 'Pusa Basmati 1121',
    growthStage: 'Vegetative Tillering',
    soilType: 'Alluvial Soil',
    plantedDate: '2025-12-15',
    expectedHarvestDate: '2026-06-20',
    status: 'Critical',
    gisCoordinates: [
      [29.6857, 76.9905],
      [29.6895, 76.9945],
      [29.6870, 76.9990],
      [29.6830, 76.9950]
    ],
    centerPoint: { lat: 29.6863, lng: 76.9948 },
    sensorNodeId: 'SNODE-104'
  }
];

const initialTelemetry = {
  'SNODE-101': {
    sensorNodeId: 'SNODE-101',
    fieldId: 'FIELD-01',
    soilMoisturePercent: 42.5,
    soilTemperatureC: 22.4,
    airTemperatureC: 26.8,
    airHumidityPercent: 58.0,
    soilPh: 6.8,
    nitrogenPpm: 125,
    phosphorusPpm: 34,
    potassiumPpm: 185,
    solarRadiationWm2: 520,
    uvIndex: 6,
    batteryLevelPercent: 97,
    timestamp: new Date().toISOString()
  },
  'SNODE-102': {
    sensorNodeId: 'SNODE-102',
    fieldId: 'FIELD-02',
    soilMoisturePercent: 28.1, // Low!
    soilTemperatureC: 26.1,
    airTemperatureC: 31.5,
    airHumidityPercent: 44.0,
    soilPh: 6.1,
    nitrogenPpm: 88,
    phosphorusPpm: 19,
    potassiumPpm: 140,
    solarRadiationWm2: 640,
    uvIndex: 8,
    batteryLevelPercent: 91,
    timestamp: new Date().toISOString()
  },
  'SNODE-103': {
    sensorNodeId: 'SNODE-103',
    fieldId: 'FIELD-03',
    soilMoisturePercent: 55.0,
    soilTemperatureC: 24.5,
    airTemperatureC: 28.9,
    airHumidityPercent: 62.0,
    soilPh: 7.2,
    nitrogenPpm: 142,
    phosphorusPpm: 45,
    potassiumPpm: 210,
    solarRadiationWm2: 580,
    uvIndex: 7,
    batteryLevelPercent: 99,
    timestamp: new Date().toISOString()
  },
  'SNODE-104': {
    sensorNodeId: 'SNODE-104',
    fieldId: 'FIELD-04',
    soilMoisturePercent: 18.4, // Critical deficit!
    soilTemperatureC: 28.2,
    airTemperatureC: 34.1,
    airHumidityPercent: 38.0,
    soilPh: 7.8,
    nitrogenPpm: 65,
    phosphorusPpm: 12,
    potassiumPpm: 110,
    solarRadiationWm2: 710,
    uvIndex: 9,
    batteryLevelPercent: 88,
    timestamp: new Date().toISOString()
  }
};

const initialRecommendations = [
  {
    recId: 'REC-2026-001',
    fieldId: 'FIELD-04',
    category: 'Irrigation',
    priority: 'Critical',
    title: 'Immediate Paddy Inundation Advisory',
    summary: 'Soil moisture dropped to 18.4% (Threshold: 45%). High heat risk detected.',
    aiRationale: 'Basmati rice tillering stage requires minimum 5cm standing water depth. Current moisture stress will permanently restrict panicle initiation.',
    suggestedAction: 'Activate Submersible Pump Station #4 for 4.5 hours tonight (22:00-02:30). Expected water requirement: 45,000 Liters.',
    estimatedImpact: 'Prevents up to 25% yield loss ($1,400 value)',
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    recId: 'REC-2026-002',
    fieldId: 'FIELD-02',
    category: 'Pest Control',
    priority: 'High',
    title: 'Tomato Early Blight Outbreak Alert',
    summary: 'Humidity drop + 31.5°C temp spike triggers fungal sporulation probability to 82%.',
    aiRationale: 'Satellite spectral analysis indicates minor chlorophyll breakdown in Eastern sector of Tomato plot. Early intervention stops spreading.',
    suggestedAction: 'Foliar spray with Copper Oxychloride 50% WP (2.5g/L water) or Neem Oil 10,000 PPM (5ml/L) early morning.',
    estimatedImpact: 'Saves 85% crop canopy health',
    status: 'Active',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    recId: 'REC-2026-003',
    fieldId: 'FIELD-01',
    category: 'Fertilization',
    priority: 'Medium',
    title: 'Top Dressing Nitrogen Boost for Wheat',
    summary: 'Soil N levels (125 ppm) are approaching grain filling depletion stage.',
    aiRationale: 'Applying Urea before forecasted light showers on Saturday maximizes nitrogen uptake efficiency without volatilization.',
    suggestedAction: 'Apply 25 kg/acre Urea (46% N) top dressing combined with Zinc Sulphate 21%.',
    estimatedImpact: '+1.8 Quintal/Acre grain protein quality',
    status: 'Active',
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    recId: 'REC-2026-004',
    fieldId: 'FIELD-03',
    category: 'Market Strategy',
    priority: 'Low',
    title: 'Cotton Market Peak Price Window Forecast',
    summary: 'Raw cotton prices in Rajkot APMC predicted to rise +6.4% in next 10 days.',
    aiRationale: 'Global export demand surge and delayed harvest in neighboring district creates supply squeeze.',
    suggestedAction: 'Hold current harvested cotton bales in dry storage for 7-10 days before liquidation.',
    estimatedImpact: 'Additional +₹420/Quintal margin',
    status: 'Active',
    createdAt: new Date(Date.now() - 28800000).toISOString()
  }
];

const initialCropScans = [
  {
    scanId: 'SCAN-801',
    fieldId: 'FIELD-02',
    cropName: 'Tomato',
    diagnosis: 'Early Blight (Alternaria solani)',
    healthStatus: 'Diseased',
    confidenceScore: 94.8,
    symptoms: [
      'Concentric ring spots ("bullseye") on lower mature leaves',
      'Yellow chlorotic halos surrounding brown leaf lesions',
      'Mild defoliation on lower stem sections'
    ],
    treatmentPlan: 'Apply chlorothalonil or Mancozeb fungicide. Prune infected lower leaves and avoid overhead sprinkler irrigation to reduce leaf wetness duration.',
    organicRemedy: 'Bio-fungicide spray containing Bacillus subtilis or Trichoderma viride twice weekly.',
    chemicalRemedy: 'Mancozeb 75% WP @ 2g/L or Azoxystrobin 23% SC @ 1ml/L.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a9d?auto=format&fit=crop&w=600&q=80',
    scannedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    scanId: 'SCAN-802',
    fieldId: 'FIELD-01',
    cropName: 'Wheat',
    diagnosis: 'Healthy Canopy - Optimal Nitrogen Level',
    healthStatus: 'Healthy',
    confidenceScore: 98.2,
    symptoms: [
      'Vibrant deep green foliage with uniform chlorophyll distribution',
      'Robust tiller formation and zero fungal spotting'
    ],
    treatmentPlan: 'Maintain current irrigation and schedule scheduled top dressing as recommended by AI advisory.',
    organicRemedy: 'Regular vermicompost tea application.',
    chemicalRemedy: 'None required.',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    scannedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    scanId: 'SCAN-803',
    fieldId: 'FIELD-03',
    cropName: 'Cotton',
    diagnosis: 'Pink Bollworm Early Instar Larvae Detected',
    healthStatus: 'Warning',
    confidenceScore: 89.5,
    symptoms: [
      'Rosetted flowers with webbed petals',
      'Small entrance pinholes on green bolls'
    ],
    treatmentPlan: 'Install Pheromone Traps @ 5 traps/acre for monitoring. Release Trichogramma chilonis parasitoids.',
    organicRemedy: 'Neem seed kernel extract (NSKE 5%) spray.',
    chemicalRemedy: 'Profenofos 50% EC @ 2ml/L water.',
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80',
    scannedAt: new Date(Date.now() - 259200000).toISOString()
  }
];

const initialMarketPrices = [
  {
    commodityId: 'COMM-01',
    commodityName: 'Wheat (Sharbati & HD)',
    category: 'Cereals',
    currentPrice: 2450,
    unit: 'Quintal (100kg)',
    mandiName: 'Khanna APMC, Punjab',
    dailyChange: 1.8,
    trend: 'Bullish',
    aiPrediction7Days: 2580,
    priceHistory: [
      { date: 'Sep 19', price: 2380 },
      { date: 'Sep 20', price: 2395 },
      { date: 'Sep 21', price: 2410 },
      { date: 'Sep 22', price: 2400 },
      { date: 'Sep 23', price: 2425 },
      { date: 'Sep 24', price: 2440 },
      { date: 'Sep 25', price: 2450 }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    commodityId: 'COMM-02',
    commodityName: 'Tomato (Hybrid Red)',
    category: 'Vegetables',
    currentPrice: 1850,
    unit: 'Quintal (100kg)',
    mandiName: 'Pimplegaon Mandi, Nashik',
    dailyChange: -3.2,
    trend: 'Bearish',
    aiPrediction7Days: 1680,
    priceHistory: [
      { date: 'Sep 19', price: 2100 },
      { date: 'Sep 20', price: 2050 },
      { date: 'Sep 21', price: 1980 },
      { date: 'Sep 22', price: 1920 },
      { date: 'Sep 23', price: 1900 },
      { date: 'Sep 24', price: 1880 },
      { date: 'Sep 25', price: 1850 }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    commodityId: 'COMM-03',
    commodityName: 'Raw Cotton (Kapas)',
    category: 'Fiber',
    currentPrice: 7200,
    unit: 'Quintal (100kg)',
    mandiName: 'Rajkot APMC, Gujarat',
    dailyChange: 2.5,
    trend: 'Bullish',
    aiPrediction7Days: 7650,
    priceHistory: [
      { date: 'Sep 19', price: 6900 },
      { date: 'Sep 20', price: 6950 },
      { date: 'Sep 21', price: 7020 },
      { date: 'Sep 22', price: 7100 },
      { date: 'Sep 23', price: 7080 },
      { date: 'Sep 24', price: 7150 },
      { date: 'Sep 25', price: 7200 }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    commodityId: 'COMM-04',
    commodityName: 'Paddy Basmati 1121',
    category: 'Cereals',
    currentPrice: 4350,
    unit: 'Quintal (100kg)',
    mandiName: 'Karnal Grain Market',
    dailyChange: 0.5,
    trend: 'Stable',
    aiPrediction7Days: 4420,
    priceHistory: [
      { date: 'Sep 19', price: 4300 },
      { date: 'Sep 20', price: 4320 },
      { date: 'Sep 21', price: 4310 },
      { date: 'Sep 22', price: 4330 },
      { date: 'Sep 23', price: 4340 },
      { date: 'Sep 24', price: 4345 },
      { date: 'Sep 25', price: 4350 }
    ],
    lastUpdated: new Date().toISOString()
  }
];

const initialWeather = {
  location: 'Ludhiana Agromet Station',
  temperature: 27.5,
  condition: 'Partly Cloudy',
  humidity: 62,
  windSpeedKm: 12.4,
  windDirection: 'NW',
  rainfall24hMm: 0.0,
  uvIndex: 6,
  evapotranspirationEt0: 4.8, // mm/day
  forecast: [
    { day: 'Today', tempMax: 31, tempMin: 21, condition: 'Partly Cloudy', rainProb: 10 },
    { day: 'Fri', tempMax: 32, tempMin: 22, condition: 'Sunny', rainProb: 5 },
    { day: 'Sat', tempMax: 29, tempMin: 20, condition: 'Light Rain', rainProb: 65 },
    { day: 'Sun', tempMax: 28, tempMin: 19, condition: 'Thunderstorm', rainProb: 80 },
    { day: 'Mon', tempMax: 30, tempMin: 20, condition: 'Clear Sky', rainProb: 15 }
  ]
};

module.exports = {
  initialFields,
  initialTelemetry,
  initialRecommendations,
  initialCropScans,
  initialMarketPrices,
  initialWeather
};
