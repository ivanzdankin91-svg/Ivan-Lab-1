const errorHandler = (err, req, res, next) => {
    const msg = String(err && err.message ? err.message : err);
    let status = err.status || 500;
    let message = "Внутрішня помилка сервера";
    let details = msg;
    let errors = err.errors || null;

    if (msg.includes("UNIQUE constraint failed")) {
        status = 409;
        message = "Конфлікт даних";
        details = "Такий запис вже існує в базі даних.";
    } else if (msg.includes("FOREIGN KEY constraint failed")) {
        status = 400;
        message = "Помилка зв'язку";
        details = "Вказаного користувача або події не існує.";
    } else if (msg.includes("NOT NULL constraint failed") || msg.includes("CHECK constraint failed")) {
        status = 400;
        message = "Помилка валідації";
        details = "Дані не відповідають обмеженням системи.";
    } else if (err.status) {
        message = err.message || "Помилка API";
    }

    if (status === 500) {
        console.error("Unhandled error:", err);
    }

    const isDev = process.env.NODE_ENV !== "production";

    return res.status(status).json({
        status,
        message,
        details: isDev ? details : undefined,
        errors
    });
};

module.exports = { errorHandler };
