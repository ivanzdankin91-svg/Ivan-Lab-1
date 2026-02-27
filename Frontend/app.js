let events = [];
let nextId = 1; 

const form = document.getElementById("eventForm");
const tbody = document.getElementById("eventsTableBody");


form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    
    const dto = readForm();
    if (validate(dto)) {
        addItem(dto);
        form.reset(); 
        render();
    }
});

document.getElementById("resetBtn").addEventListener("click", () => {
    form.reset();
    clearErrors();
});

tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const idToDelete = Number(e.target.dataset.id);
        deleteItem(idToDelete);
        render();
    }
});


function readForm() {
    return {
        title: document.getElementById("titleInput").value.trim(),
        date: document.getElementById("dateInput").value,
        location: document.getElementById("locationInput").value.trim(),
        capacity: document.getElementById("capacityInput").value,
        description: document.getElementById("descInput").value.trim()
    };
}

function validate(dto) {
    let isValid = true;
    clearErrors();

    if (dto.title.length < 4) {
        showError("titleInput", "titleError", "Назва має бути не менше 4 символів");
        isValid = false;
    }

    if (!dto.date) {
        showError("dateInput", "dateError", "Дата є обов'язковою");
        isValid = false;
    }

    const capacityNum = Number(dto.capacity);
    if (!dto.capacity || isNaN(capacityNum) || capacityNum < 1 || capacityNum > 500) {
        showError("capacityInput", "capacityError", "Вкажіть число від 1 до 500");
        isValid = false;
    }

    if (dto.description.length < 5) {
        showError("descInput", "descError", "Опис має бути довшим (мін. 5 симв.)");
        isValid = false;
    }

    return isValid;
}

function addItem(dto) {
    const newEvent = {
        id: nextId++, 
        ...dto
    };
    events.push(newEvent);
}

function deleteItem(id) {
    events = events.filter(item => item.id !== id);
}

function render() {
    tbody.innerHTML = ""; 

    if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Подій поки немає</td></tr>';
        return;
    }

    events.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${item.id}</td>
            <td>${item.title}</td>
            <td>${item.date}</td>
            <td>${item.capacity}</td>
            <td>
                <button class="delete-btn" data-id="${item.id}">Видалити</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).innerText = message;
}

function clearErrors() {
    const fields = ["titleInput", "dateInput", "locationInput", "capacityInput", "descInput"];
    const errors = ["titleError", "dateError", "locationError", "capacityError", "descError"];
    
    fields.forEach(f => document.getElementById(f).classList.remove("invalid"));
    errors.forEach(e => document.getElementById(e).innerText = "");
}