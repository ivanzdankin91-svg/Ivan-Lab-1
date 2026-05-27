import { API_BASE_URL } from "./config.js";

async function request(path, options = {}, timeoutMs = 10000) {
    const url = `${API_BASE_URL}${path}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        if (response.status === 204) {
            if (!response.ok) {
                throw { status: response.status, message: "Помилка", details: "No Content" };
            }
            return null;
        }

        const rawText = await response.text();

        if (response.ok) {
            if (!rawText) return null;
            try {
                return JSON.parse(rawText);
            } catch {
                return rawText;
            }
        }

        let errPayload = null;
        try {
            errPayload = rawText ? JSON.parse(rawText) : null;
        } catch {}

        throw {
            status: response.status,
            message: errPayload?.message || "HTTP помилка",
            details: errPayload?.details || rawText || `HTTP ${response.status}`,
            errors: errPayload?.errors || null
        };

    } catch (e) {
        if (e.name === "AbortError") {
            throw { status: 408, message: "Таймаут", details: "Сервер занадто довго не відповідає." };
        }
        if (e.status !== undefined) {
            throw e;
        }
        
        throw {
            status: 0,
            message: "Сервер API недоступний. Перевірте підключення.", 
            details: "Connection error or CORS issue"
        };
    } finally {
        clearTimeout(id);
    }
}

export async function getList() {
    return await request("/events", { method: "GET" });
}

export async function create(dto) {
    return await request("/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    });
}

export async function update(id, dto) {
    return await request(`/events/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    });
}

export async function remove(id) {
    return await request(`/events/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
}