const errorHandler = (err, req, res, next) => {
    const msg = String(err && err.message ? err.message : err);

    if (msg.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: "Такий запис вже існує в базі даних." });
    }
    if (msg.includes("FOREIGN KEY constraint failed")) {
        return res.status(400).json({ error: "Помилка: вказаного користувача або події не існує." });
    }
    if (msg.includes("NOT NULL constraint failed") || msg.includes("CHECK constraint failed")) {
        return res.status(400).json({ error: "Дані не відповідають обмеженням системи." });
    }

    if (err.status) {
        return res.status(err.status).json({ error: { message: err.message } });
    }

    console.error("Unhandled error:", err);
    return res.status(500).json({ error: "Внутрішня помилка сервера" });
};

module.exports = { errorHandler };
