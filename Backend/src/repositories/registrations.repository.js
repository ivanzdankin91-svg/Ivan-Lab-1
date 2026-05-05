const { all, get, run } = require('../db/dbClient');

module.exports = {
  getAll: async () => {
    return await all(`
      SELECT r.id, r.registeredAt, 
             u.id as userId, u.name as userName, u.email as userEmail,
             e.id as eventId, e.title as eventTitle, e.date as eventDate
      FROM Registrations r
      JOIN Users u ON r.userId = u.id
      JOIN Events e ON r.eventId = e.id
      ORDER BY r.id DESC;
    `);
  },
  
  add: async (eventId, userId) => {
    const now = new Date().toISOString();
    const result = await run(`
        INSERT INTO Registrations (eventId, userId, registeredAt) 
        VALUES (${Number(eventId)}, ${Number(userId)}, '${now}');
    `);
    return await get(`SELECT * FROM Registrations WHERE id = ${result.lastID};`);
  },
  
  delete: async (id) => {
    const result = await run(`DELETE FROM Registrations WHERE id = ${Number(id)};`);
    return result.changes > 0;
  }
};