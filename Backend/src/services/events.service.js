const eventsRepo = require('../repositories/events.repository');
const { ApiError } = require('../middleware/error.middleware');

function requireString(value, fieldName, minLen = 1) {
  if (typeof value !== "string" || value.trim().length < minLen) {
    return { field: fieldName, message: `${fieldName} має містити мінімум ${minLen} символів` };
  }
  return null;
}

function validateEventDto(dto) {
  const errors = [];
  const e1 = requireString(dto.title, "title", 2);
  if (e1) errors.push(e1);
  const e2 = requireString(dto.date, "date", 1);
  if (e2) errors.push(e2);
  const e3 = requireString(dto.location, "location", 2);
  if (e3) errors.push(e3);
  return errors;
}

module.exports = {
  getAllEvents: async (filter, sort, order) => await eventsRepo.getAll(filter, sort, order),
  
  getEventById: async (id) => {
    const event = await eventsRepo.getById(Number(id));
    if (!event) throw new ApiError(404, "NOT_FOUND", "Подію не знайдено");
    return event;
  },
  
  createEvent: async (dto) => {
    const errors = validateEventDto(dto);
    if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації", errors);
    return await eventsRepo.add(dto);
  },
  
  updateEvent: async (id, dto) => {
    const errors = validateEventDto(dto);
    if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації", errors);
    const updated = await eventsRepo.update(Number(id), dto);
    if (!updated) throw new ApiError(404, "NOT_FOUND", "Подію не знайдено");
    return updated;
  },
  
  deleteEvent: async (id) => {
    const deleted = await eventsRepo.delete(Number(id));
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Подію не знайдено");
    return true;
  }
};
