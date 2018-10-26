const express = require('express');
const checkRole = require('../middleware/check-role');

const router = express.Router();
const applicationsController = require('../controllers/applications');

router.post('/create', checkRole('super_admin'), applicationsController.applications_create);

module.exports = router;
