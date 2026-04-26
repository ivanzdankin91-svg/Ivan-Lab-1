const eventsRepo = require('../repositories/events.repository');
const { ApiError } = require('../middleware/error.middleware');

function requireString(value, fieldName, minLen = 1) {
  if (typeof value !== "string" || value.trim().length < minLen) {
    return { field: fieldName, message: `${fieldName} must be a non-empty string` };
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
  getAllEvents: () => {
    return eventsRepo.getAll();
  },
  
  getEventById: (id) => {
    const event = eventsRepo.getById(Number(id));
    if (!event) {
      throw new ApiError(404, "NOT_FOUND", "Event not found");
    }
    return event;
  },
  
  createEvent: (dto) => {
    const errors = validateEventDto(dto);
    if (errors.length > 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    const isDuplicate = eventsRepo.getAll().some(e => 
      e.date === dto.date && e.location === dto.location
    );
    if (isDuplicate) {
      throw new ApiError(409, "CONFLICT", "Таке місце вже зареєстровано");
    }

    return eventsRepo.add(dto);
  },
  
  updateEvent: (id, dto) => {
    const errors = validateEventDto(dto);
    if (errors.length > 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }
    const updated = eventsRepo.update(Number(id), dto);
    if (!updated) {
      throw new ApiError(404, "NOT_FOUND", "Event not found");
    }
    return updated;
  },
  
  deleteEvent: (id) => {
    const deleted = eventsRepo.delete(Number(id));
    if (!deleted) {
      throw new ApiError(404, "NOT_FOUND", "Event not found");
    }
    return true;
  }
};