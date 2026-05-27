export function showNotice(text) {
    const el = document.getElementById("notice");
    el.innerHTML = text;
    setTimeout(() => { el.innerHTML = ""; }, 4000);
}

export function renderListStatus(status, error) {
    const el = document.getElementById("listStatus");
    if (status === "loading") el.innerHTML = "Завантаження...";
    else if (status === "empty") el.innerHTML = "Поки що немає записів.";
    else if (status === "error") el.innerHTML = `Помилка: ${error?.message || "невідома"}`;
    else el.innerHTML = "";
}

export function setFormEnabled(isEnabled) {
    document.getElementById("submitBtn").disabled = !isEnabled;
    const inputs = document.getElementById("eventForm").querySelectorAll("input, textarea, button");
    inputs.forEach(el => el.disabled = !isEnabled);
}

export function showError(inputId, errorId, msg) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).innerText = msg;
}

export function clearErrors() {
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error-text").forEach(el => el.innerText = "");
}

export function enterEditModeUI(item) {
    document.getElementById("titleInput").value = item.title;
    document.getElementById("dateInput").value = item.date;
    document.getElementById("locationInput").value = item.location;
    document.getElementById("capacityInput").value = item.capacity;
    document.getElementById("descInput").value = item.description || "";
    
    document.getElementById("submitBtn").innerText = "Оновити";
    document.getElementById("cancelBtn").classList.remove("hidden");
}

export function exitEditModeUI() {
    document.getElementById("eventForm").reset();
    document.getElementById("submitBtn").innerText = "Зберегти";
    document.getElementById("cancelBtn").classList.add("hidden");
    clearErrors();
}

// --- Рендер таблиці ---
export function renderTable(events, term, sortType, editId = null) {
    const tbody = document.getElementById("eventsTableBody");
    let filtered = events.filter(ev => (ev.title || "").toLowerCase().includes(term));

    if (sortType === "date") {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortType === "capacity") {
        filtered.sort((a, b) => Number(a.capacity) - Number(b.capacity));
    }

    tbody.innerHTML = filtered.map(item => {
        const isEditing = item.id === editId; 
        const rowClass = isEditing ? 'class="editing-row"' : '';
        
        return `
        <tr ${rowClass}>
            <td>${item.id}</td>
            <td>${item.title ?? "(без назви)"}</td>
            <td>${item.date ?? "-"}</td>
            <td>${item.location ?? "-"}</td>
            <td>${item.capacity ?? 0}</td>
            <td>${item.description ?? ""}</td>
            <td class="actions-cell">
                <button class="edit-btn" data-id="${item.id}" ${isEditing ? 'disabled' : ''}>Ред.</button>
                <button class="delete-btn" data-id="${item.id}" ${isEditing ? 'disabled' : ''}>Вид.</button>
            </td>
        </tr>
    `}).join("");
}