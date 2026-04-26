const express = require('express');
const eventsRoutes = require('./routes/events.routes');
const usersRoutes = require('./routes/users.routes');
const { logger } = require('./middleware/logger.middleware');;
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(express.json());

app.use(logger);

app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API started on http://localhost:${PORT}`);
});