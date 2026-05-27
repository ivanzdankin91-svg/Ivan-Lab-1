import { getList, create, update, remove } from "./apiClient.js";
import { 
    showNotice, renderListStatus, setFormEnabled, showError, clearErrors, 
    enterEditModeUI, exitEditModeUI, renderTable 
} from "./ui.js";

let events = [];
let editId = null;

async function loadList() {
    renderListStatus("loading");
    document.getElementById("eventsTableBody").innerHTML = "";
    
    try {
        const data = await getList();
        events = data.items || [];
        
        if (!events || events.length === 0) {
            renderListStatus("empty");
        } else {
            renderListStatus("success");
            triggerRender();
        }
    } catch (err) {
        events = [];
        triggerRender();
        renderListStatus("error", err);
        showNotice(`Не вдалося завантажити список: ${err.details || ""}`);
    }
}

document.getElementById("eventForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dto = {
        title: document.getElementById("titleInput").value.trim(),
        date: document.getElementById("dateInput").value,
        location: document.getElementById("locationInput").value.trim(),
        capacity: Number(document.getElementById("capacityInput").value),
        description: document.getElementById("descInput").value.trim()
    };

    if (validate(dto)) {
        setFormEnabled(false);
        try {
            if (editId) {
                await update(editId, dto);
                showNotice("Запис успішно оновлено");
                exitEditMode();
            } else {
                await create(dto);
                showNotice("Запис успішно створено");
                document.getElementById("eventForm").reset();
            }
            await loadList();
        } catch (err) {
            showNotice(`Помилка (${err.status}): ${err.message}`);
            console.error(err);
        } finally {
            setFormEnabled(true);
        }
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

function isDuplicate(dto) {
    return events.some(item => 
        item.date === dto.date && 
        item.location.toLowerCase() === dto.location.toLowerCase() &&
        Number(item.capacity) === Number(dto.capacity) && 
        item.id !== editId 
    );
}

document.getElementById("eventsTableBody").addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        if (confirm("Ви впевнені, що бажаєте видалити цей запис?")) {
            try {
                await remove(id);
                showNotice("Запис видалено");
                await loadList();
            } catch (err) {
                showNotice(`Не вдалося видалити запис: ${err.message}`);
            }
        }
    } else if (e.target.classList.contains("edit-btn")) {
        const id = Number(e.target.dataset.id);
        const item = events.find(ev => ev.id === id);
        if (item) {
            editId = id;
            enterEditModeUI(item);
            triggerRender(); 
        }
    }
});

function exitEditMode() {
    editId = null;
    exitEditModeUI();
    triggerRender();     
}

function triggerRender() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;
    renderTable(events, term, sortType, editId); 
}

document.getElementById("searchInput").addEventListener("input", triggerRender);
document.getElementById("cancelBtn").addEventListener("click", exitEditMode);
document.getElementById("sortSelect").addEventListener("change", triggerRender);

loadList();