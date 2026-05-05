const { all, get, run } = require('../db/dbClient');

function escape(s) {
    return String(s).replace(/'/g, "''");
}

module.exports = {
    getAll: async (filter = {}, sortBy = 'id', order = 'DESC') => {
        let sql = `SELECT * FROM Events`;
        if (filter.location) sql += ` WHERE location = '${escape(filter.location)}'`;
        sql += ` ORDER BY ${sortBy} ${order}`;
        return await all(sql);
    },

    getById: async (id) => {
        return await get(`SELECT * FROM Events WHERE id = ${Number(id)};`);
    },

    add: async (data) => {
        const result = await run(`
            INSERT INTO Events (title, date, location, capacity, description)
            VALUES ('${escape(data.title)}', '${escape(data.date)}', '${escape(data.location)}', ${Number(data.capacity)}, '${escape(data.description || '')}');
        `);
        return await get(`SELECT * FROM Events WHERE id = ${result.lastID};`); 
    },

    delete: async (id) => {
        const result = await run(`DELETE FROM Events WHERE id = ${Number(id)};`);
        return result.changes > 0; 
    }
};
