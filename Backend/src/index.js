const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/initDb');

const eventsRoutes = require('./routes/events.routes');
const usersRoutes = require('./routes/users.routes');
const registrationsRoutes = require('./routes/registrations.routes');

const { logger } = require('./middleware/logger.middleware');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
app.use(express.json());
app.use(logger);

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
});

const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8080",
    "http://127.0.0.1:8080"
];

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("CORS: origin is not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Demo-UserId"]
}));

app.use('/api/v1/events', eventsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/registrations', registrationsRoutes);

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
