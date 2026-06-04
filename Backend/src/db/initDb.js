const { run, get } = require("./dbClient");

async function initDb() {
    await run("PRAGMA foreign_keys = ON;");

    await run(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY,
            is_initialized INTEGER NOT NULL
        );
    `);

    const check = await get("SELECT * FROM schema_migrations WHERE id = 1");
    if (check) {
        console.log("DB schema already initialized.");
        return;
    }

    console.log("Initializing DB schema...");

    await run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Events (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            capacity INTEGER NOT NULL CHECK (capacity >= 1),
            description TEXT,
            ownerUserId INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (ownerUserId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Registrations (
            id INTEGER PRIMARY KEY,
            eventId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            registeredAt TEXT NOT NULL,
            FOREIGN KEY (eventId) REFERENCES Events(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
            UNIQUE(eventId, userId)
        );
    `);

    await run(`CREATE INDEX IF NOT EXISTS idx_events_date ON Events (date);`);

    console.log("Adding seed data...");
    const now = new Date().toISOString();
    await run(`INSERT INTO Users (name, email) VALUES ('Денис Шкарін', 'denis@gmail.com');`);
    await run(`INSERT INTO Users (name, email) VALUES ('Тураєва Єлизавета', 'turliza@gmail.com');`);
    
    await run(`INSERT INTO Events (title, date, location, capacity, description, ownerUserId) VALUES ('Сесія ОАП', '2026-06-20', 'Ауд. 315', 1, 'Основна сесія', 1);`);
    await run(`INSERT INTO Registrations (eventId, userId, registeredAt) VALUES (1, 1, '${now}');`);

    await run("INSERT INTO schema_migrations (id, is_initialized) VALUES (1, 1);");
    console.log("DB schema initialized successfully!");
}

module.exports = { initDb };
