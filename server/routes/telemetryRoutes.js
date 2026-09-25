const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

router.get('/', telemetryController.getTelemetry);
router.get('/:sensorNodeId', telemetryController.getTelemetryByNode);
router.post('/simulate', telemetryController.updateTelemetry);

module.exports = router;
