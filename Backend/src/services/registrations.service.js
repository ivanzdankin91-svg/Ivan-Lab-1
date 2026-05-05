const regRepo = require('../repositories/registrations.repository');
const { ApiError } = require('../middleware/error.middleware');

module.exports = {
  getAllRegistrations: async () => await regRepo.getAll(),
  
  createRegistration: async (dto) => {
    if (!dto.eventId || !dto.userId) {
      throw new ApiError(400, "VALIDATION_ERROR", "eventId та userId є обов'язковими");
    }
    return await regRepo.add(dto.eventId, dto.userId);
  },
  
  deleteRegistration: async (id) => {
    const deleted = await regRepo.delete(Number(id));
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Реєстрацію не знайдено");
    return true;
  }
};