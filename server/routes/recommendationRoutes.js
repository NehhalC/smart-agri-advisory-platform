const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.get('/', recommendationController.getRecommendations);
router.patch('/:recId/status', recommendationController.updateStatus);
router.post('/generate', recommendationController.generateCustomRecommendation);

module.exports = router;
