const express = require('express');
const router = express.Router();
const gisController = require('../controllers/gisController');

router.get('/fields', gisController.getFields);
router.get('/fields/:fieldId', gisController.getFieldById);
router.post('/fields', gisController.createField);

module.exports = router;
