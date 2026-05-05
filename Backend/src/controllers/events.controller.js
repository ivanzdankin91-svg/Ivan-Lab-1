const eventsService = require('../services/events.service');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const items = await eventsService.getAllEvents(req.query, req.query.sort, req.query.order);
      res.status(200).json({ items });
    } catch (err) { next(err); }
  },
  getById: async (req, res, next) => {
    try {
      const item = await eventsService.getEventById(req.params.id);
      res.status(200).json(item);
    } catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const newItem = await eventsService.createEvent(req.body);
      res.status(201).json(newItem);
    } catch (err) { next(err); }
  },
  update: async (req, res, next) => {
    try {
      const updatedItem = await eventsService.updateEvent(req.params.id, req.body);
      res.status(200).json(updatedItem);
    } catch (err) { next(err); }
  },
  delete: async (req, res, next) => {
    try {
      await eventsService.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
};
