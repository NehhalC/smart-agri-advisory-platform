const express = require('express');
const router = express.Router();
const cropScanController = require('../controllers/cropScanController');

router.get('/scans', cropScanController.getCropScans);
router.post('/diagnose', cropScanController.diagnoseCrop);

module.exports = router;
