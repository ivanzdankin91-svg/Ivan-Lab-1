const { all, get, run } = require('../db/dbClient');

function escape(s) {
    return String(s).replace(/'/g, "''");
}

module.exports = {
  getAll: async () => {
    return await all(`SELECT * FROM Users ORDER BY id DESC;`);
  },
  
  getById: async (id) => {
    return await get(`SELECT * FROM Users WHERE id = ${Number(id)};`);
  },
  
  add: async (data) => {
    const result = await run(`
        INSERT INTO Users (name, email) 
        VALUES ('${escape(data.name)}', '${escape(data.email)}');
    `);
    return await get(`SELECT * FROM Users WHERE id = ${result.lastID};`);
  },
  
  update: async (id, data) => {
    const result = await run(`
        UPDATE Users SET name = '${escape(data.name)}', email = '${escape(data.email)}' 
        WHERE id = ${Number(id)};
    `);
    if (result.changes === 0) return null;
    return await get(`SELECT * FROM Users WHERE id = ${Number(id)};`);
  },
  
  delete: async (id) => {
    const result = await run(`DELETE FROM Users WHERE id = ${Number(id)};`);
    return result.changes > 0;
  }
};
