const regService = require('../services/registrations.service');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const items = await regService.getAllRegistrations();
      res.status(200).json({ items });
    } catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const newItem = await regService.createRegistration(req.body);
      res.status(201).json(newItem);
    } catch (err) { next(err); }
  },
  delete: async (req, res, next) => {
    try {
      await regService.deleteRegistration(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
};