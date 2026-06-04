const { all, get, run } = require('../db/dbClient');

module.exports = {
    getAll: async (filter = {}, sortBy = 'id', order = 'DESC') => {
        const allowedSort = new Set(['id', 'title', 'date', 'capacity']);
        const allowedOrder = new Set(['ASC', 'DESC']);
        const safeSort = allowedSort.has(sortBy) ? sortBy : 'id';
        const safeOrder = allowedOrder.has((order || 'DESC').toUpperCase()) ? (order || 'DESC').toUpperCase() : 'DESC';

        let sql = `SELECT * FROM Events`;
        const params = [];

        if (filter.location) {
            sql += ` WHERE location = ?`;
            params.push(filter.location);
        }
        
        sql += ` ORDER BY ${safeSort} ${safeOrder}`;
        return await all(sql, params);
    },

    getById: async (id) => {
        return await get(`SELECT * FROM Events WHERE id = ?;`, [Number(id)]);
    },

    add: async (data, ownerId) => {
        const result = await run(`
            INSERT INTO Events (title, date, location, capacity, description, ownerUserId)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [data.title, data.date, data.location, Number(data.capacity), data.description || '', ownerId]);
        
        return await get(`SELECT * FROM Events WHERE id = ?;`, [result.lastID]);
    },

    update: async (id, data, ownerId) => {
        const result = await run(`
            UPDATE Events SET title = ?, date = ?, location = ?, capacity = ?, description = ?
            WHERE id = ? AND ownerUserId = ?
        `, [data.title, data.date, data.location, Number(data.capacity), data.description || '', Number(id), ownerId]);
        
        if (result.changes === 0) return null;
        return await get(`SELECT * FROM Events WHERE id = ?;`, [Number(id)]);
    },

    delete: async (id, ownerId) => {
        const result = await run(`DELETE FROM Events WHERE id = ? AND ownerUserId = ?;`, [Number(id), ownerId]);
        return result.changes > 0;
    }
};
