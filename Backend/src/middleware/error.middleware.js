class ApiError extends Error {
  constructor(status, code, message, details = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError || err.status) {
        return res.status(err.status || 400).json({
            error: { code: err.code || "ERROR", message: err.message, details: err.details || [] }
        });
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Внутрішня помилка сервера" }
    });
};

module.exports = { ApiError, errorHandler };