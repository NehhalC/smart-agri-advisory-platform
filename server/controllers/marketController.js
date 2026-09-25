const MarketPrice = require('../models/MarketPrice');
const { getIsMongoConnected, getMemoryStore } = require('../config/db');

// GET /api/market/prices - Get commodity market prices
exports.getMarketPrices = async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const prices = await MarketPrice.find();
      return res.json({ success: true, count: prices.length, dataSource: 'MongoDB', prices });
    }

    const memoryStore = getMemoryStore();
    res.json({ 
      success: true, 
      count: memoryStore.marketPrices.length, 
      dataSource: 'MemoryStore', 
      prices: memoryStore.marketPrices 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/market/calculate-profit - Profit Margin Calculator
exports.calculateProfit = (req, res) => {
  try {
    const { cropName, acreArea, seedCost, fertilizerCost, laborCost, expectedYieldQuintal, marketPricePerQuintal } = req.body;

    const area = parseFloat(acreArea) || 1;
    const seeds = parseFloat(seedCost) || 0;
    const fertilizer = parseFloat(fertilizerCost) || 0;
    const labor = parseFloat(laborCost) || 0;
    const yieldTotal = parseFloat(expectedYieldQuintal) * area || 0;
    const price = parseFloat(marketPricePerQuintal) || 0;

    const totalInvestmentCost = seeds + fertilizer + labor;
    const grossRevenue = yieldTotal * price;
    const netProfit = grossRevenue - totalInvestmentCost;
    const roiPercent = totalInvestmentCost > 0 ? parseFloat(((netProfit / totalInvestmentCost) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      cropName,
      acreArea: area,
      financials: {
        totalInvestmentCost,
        grossRevenue,
        netProfit,
        roiPercent,
        breakEvenPricePerQuintal: yieldTotal > 0 ? Math.round(totalInvestmentCost / yieldTotal) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
