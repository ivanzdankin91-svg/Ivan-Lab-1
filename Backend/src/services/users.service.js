const usersRepo = require('../repositories/users.repository');
const { ApiError } = require('../middleware/error.middleware');

function requireString(value, fieldName, minLen = 1) {
  if (typeof value !== "string" || value.trim().length < minLen) {
    return { field: fieldName, message: `${fieldName} має містити мінімум ${minLen} символів` };
  }
  return null;
}

function validateUserDto(dto) {
  const errors = [];
  const e1 = requireString(dto.name, "name", 2);
  if (e1) errors.push(e1);
  const e2 = requireString(dto.email, "email", 5);
  if (e2) errors.push(e2);
  return errors;
}

module.exports = {
  getAllUsers: async () => await usersRepo.getAll(),
  
  getUserById: async (id) => {
    const user = await usersRepo.getById(Number(id));
    if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
    return user;
  },
  
  createUser: async (dto) => {
    const errors = validateUserDto(dto);
    if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації", errors);
    return await usersRepo.add(dto);
  },
  
  updateUser: async (id, dto) => {
    const errors = validateUserDto(dto);
    if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації", errors);
    const updated = await usersRepo.update(Number(id), dto);
    if (!updated) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
    return updated;
  },
  
  deleteUser: async (id) => {
    const deleted = await usersRepo.delete(Number(id));
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
    return true;
  }
};
