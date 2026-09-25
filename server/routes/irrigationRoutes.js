const express = require('express');
const router = express.Router();
const irrigationController = require('../controllers/irrigationController');

router.get('/schedule', irrigationController.getIrrigationStatus);
router.post('/toggle-pump', irrigationController.togglePump);

module.exports = router;
