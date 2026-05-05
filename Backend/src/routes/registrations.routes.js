const express = require('express');
const router = express.Router();
const regController = require('../controllers/registrations.controller');

router.get('/', regController.getAll);
router.post('/', regController.create);
router.delete('/:id', regController.delete);

module.exports = router;