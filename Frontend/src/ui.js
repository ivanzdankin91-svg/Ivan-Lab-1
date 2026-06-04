let noticeTimer = null;

export function showNotice(text) {
    const el = document.getElementById("notice");
    el.innerHTML = text;
    if (noticeTimer) clearTimeout(noticeTimer); 
    noticeTimer = setTimeout(() => { el.innerHTML = ""; }, 5000);
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

export function renderTable(events, term, sortType, editId = null) {
    const tbody = document.getElementById("eventsTableBody");
    tbody.innerHTML = ""; 
    
    let filtered = events.filter(ev => (ev.title || "").toLowerCase().includes(term));

    if (sortType === "date") {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortType === "capacity") {
        filtered.sort((a, b) => Number(a.capacity) - Number(b.capacity));
    }

    filtered.forEach(item => {
        const isEditing = item.id === editId;
        const tr = document.createElement("tr");
        if (isEditing) tr.classList.add("editing-row");

        const cols = [
            item.id,
            item.title ?? "(без назви)",
            item.date ?? "-",
            item.location ?? "-",
            item.capacity ?? 0,
            item.description ?? ""
        ];

        cols.forEach(text => {
            const td = document.createElement("td");
            td.textContent = text;
            tr.appendChild(td);
        });

        const tdActions = document.createElement("td");
        tdActions.className = "actions-cell";

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.dataset.id = item.id;
        editBtn.textContent = "Ред.";
        editBtn.disabled = isEditing;

        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.dataset.id = item.id;
        delBtn.textContent = "Вид.";
        delBtn.disabled = isEditing;

        tdActions.append(editBtn, delBtn);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}
