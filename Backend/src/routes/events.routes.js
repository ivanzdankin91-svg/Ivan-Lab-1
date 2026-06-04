const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const { demoAuth } = require('../middleware/auth.middleware');

router.get('/', eventsController.getAll);
router.get('/:id', eventsController.getById);

router.post('/', demoAuth, eventsController.create);
router.put('/:id', demoAuth, eventsController.update);
router.delete('/:id', demoAuth, eventsController.delete);

module.exports = router;
