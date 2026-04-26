const eventsService = require('../services/events.service');

module.exports = {
  getAll: (req, res, next) => {
    try {
      const items = eventsService.getAllEvents();
      res.status(200).json({ items });
    } catch (err) { next(err); }
  },
  
  getById: (req, res, next) => {
    try {
      const item = eventsService.getEventById(req.params.id);
      res.status(200).json(item);
    } catch (err) { next(err); }
  },
  
  create: (req, res, next) => {
    try {
      const newItem = eventsService.createEvent(req.body);
      res.status(201).json(newItem);
    } catch (err) { next(err); }
  },
  
  update: (req, res, next) => {
    try {
      const updatedItem = eventsService.updateEvent(req.params.id, req.body);
      res.status(200).json(updatedItem);
    } catch (err) { next(err); }
  },
  
  delete: (req, res, next) => {
    try {
      eventsService.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
};