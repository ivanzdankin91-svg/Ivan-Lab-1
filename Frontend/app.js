const STORAGE_KEY = "lab1";
let events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editId = null;

const form = document.getElementById("eventForm");
const tbody = document.getElementById("eventsTableBody");

render();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dto = {
        title: document.getElementById("titleInput").value.trim(),
        date: document.getElementById("dateInput").value,
        location: document.getElementById("locationInput").value.trim(),
        capacity: Number(document.getElementById("capacityInput").value),
        description: document.getElementById("descInput").value.trim()
    };

    if (validate(dto)) {
        if (editId) {
            const index = events.findIndex(ev => ev.id === editId);
            events[index] = { id: editId, ...dto };
            exitEditMode();
        } else {
            const newId = events.length > 0 ? Math.max(...events.map(ev => ev.id)) + 1 : 1;
            events.push({ id: newId, ...dto });
        }
        saveAndRender();
        form.reset();
    }
});

function validate(dto) {
    clearErrors();
    let isValid = true;
    if (dto.title.length < 2) { showError("titleInput", "titleError", "Вкажіть назву"); isValid = false; }
    if (!dto.date) { showError("dateInput", "dateError", "Оберіть дату"); isValid = false; }
    if (dto.location === "") { showError("locationInput", "locationError", "Вкажіть локацію"); isValid = false; }
    if (dto.capacity < 1) { showError("capacityInput", "capacityError", "Мін. 1 місце"); isValid = false; }
    if (dto.description.length < 5) { showError("descInput", "descError", "Додайте ПІБ та опис (мін. 5 симв.)"); isValid = false; }
  if (isValid && isDuplicate(dto)) {
        showError("capacityInput", "capacityError", "Це місце вже зареєстровано!");
        isValid = false;
    }
    return isValid; 
}

tbody.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains("delete-btn")) {
        events = events.filter(ev => ev.id !== id);
        saveAndRender();
    } else if (e.target.classList.contains("edit-btn")) {
        enterEditMode(id);
    }
});

function isDuplicate(dto) {
    return events.some(item => 
        item.date === dto.date && 
        item.location.toLowerCase() === dto.location.toLowerCase() &&
        Number(item.capacity) === Number(dto.capacity) && 
        item.id !== editId 
    );
}

function enterEditMode(id) {
    const item = events.find(ev => ev.id === id);
    editId = id;
    document.getElementById("titleInput").value = item.title;
    document.getElementById("dateInput").value = item.date;
    document.getElementById("locationInput").value = item.location;
    document.getElementById("capacityInput").value = item.capacity;
    document.getElementById("descInput").value = item.description;
    
    document.getElementById("submitBtn").innerText = "Оновити";
    document.getElementById("cancelBtn").classList.remove("hidden");
}

function exitEditMode() {
    editId = null;
    form.reset();
    document.getElementById("submitBtn").innerText = "Зберегти";
    document.getElementById("cancelBtn").classList.add("hidden");
}

function saveAndRender() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); 
    render();
}

function render() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    let filtered = events.filter(ev => ev.title.toLowerCase().includes(term));

    tbody.innerHTML = filtered.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.date}</td>
            <td>${item.location}</td>
            <td>${item.capacity}</td>
            <td>${item.description}</td>
            <td class="actions-cell">
                <button class="edit-btn" data-id="${item.id}">Ред.</button>
                <button class="delete-btn" data-id="${item.id}">Вид.</button>
            </td>
        </tr>
    `).join("");
}

function showError(inputId, errorId, msg) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).innerText = msg;
}

function clearErrors() {
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error-text").forEach(el => el.innerText = "");
}

document.getElementById("searchInput").addEventListener("input", render);

document.getElementById("cancelBtn").addEventListener("click", exitEditMode);

