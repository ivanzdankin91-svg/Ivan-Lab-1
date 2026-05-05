const express = require('express');
const { initDb } = require('./db/initDb');

const eventsRoutes = require('./routes/events.routes');
const usersRoutes = require('./routes/users.routes');
const registrationsRoutes = require('./routes/registrations.routes');

const { logger } = require('./middleware/logger.middleware');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
app.use(express.json());
app.use(logger);

app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/registrations', registrationsRoutes);

app.use(errorHandler);

const PORT = 3000;

async function start() {
    try {
        await initDb(); 
        app.listen(PORT, () => {
            console.log(`API started on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Fatal error during startup:", err);
        process.exit(1);
    }
}

start();
