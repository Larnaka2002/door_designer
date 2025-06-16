let canvas, ctx;
let scale = 0.3;

let doorData = {
    width: 800,
    height: 2000,
    profiles: [],
    inserts: []
};

window.onload = function () {
    canvas = document.getElementById('doorCanvas');
    ctx = canvas.getContext('2d');

    updateCanvasSize();
    drawDoor();

    window.addEventListener('resize', () => {
        updateCanvasSize();
        drawDoor();

    });

    canvas.addEventListener('click', handleCanvasClick);
};

function updateCanvasSize() {
    const container = document.querySelector('.canvas-container');
    const padding = 40;
    const maxWidth = container.clientWidth - padding * 2;
    const maxHeight = container.clientHeight - padding * 2;

    scale = Math.min(maxWidth / doorData.width, maxHeight / doorData.height, 0.5);

    canvas.width = doorData.width * scale;
    canvas.height = doorData.height * scale;
}

function updateDoorSize() {
    const widthInput = document.getElementById('doorWidth');
    const heightInput = document.getElementById('doorHeight');

    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);

    if (!isNaN(newWidth) && !isNaN(newHeight)) {
        doorData.width = newWidth;
        doorData.height = newHeight;

        updateCanvasSize();
        drawDoor();

        document.getElementById('widthDisplay').textContent = `${newWidth} мм`;
        document.getElementById('heightDisplay').textContent = `${newHeight} мм`;
    } else {
        alert("Введите корректные значения ширины и высоты.");
    }
}

function drawDoor() {
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ✅ РАМКА ДВЕРИ
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    drawProfiles();
    drawInserts();
}

function showInsertEditor(insert) {
    document.getElementById('insertEditor').style.display = 'block';
    document.getElementById('editX').value = Math.round(insert.x);
    document.getElementById('editY').value = Math.round(insert.y);
    document.getElementById('editWidth').value = Math.round(insert.width);
    document.getElementById('editHeight').value = Math.round(insert.height);
}

function updateInsertPosition() {
    const selected = doorData.inserts.find(i => i.selected);
    if (!selected) return;

    selected.x = parseInt(document.getElementById('editX').value);
    selected.y = parseInt(document.getElementById('editY').value);
    drawDoor();
}

function updateInsertSize() {
    const selected = doorData.inserts.find(i => i.selected);
    if (!selected) return;

    selected.width = parseInt(document.getElementById('editWidth').value);
    selected.height = parseInt(document.getElementById('editHeight').value);
    drawDoor();
}

function deleteInsert() {
    doorData.inserts = doorData.inserts.filter(i => !i.selected);
    document.getElementById('insertEditor').style.display = 'none';
    drawDoor();
}


function drawProfiles() {
    doorData.profiles.forEach(profile => {
        ctx.fillStyle = '#333';
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 2;

        const x = profile.x * scale;
        const y = profile.y * scale;
        const w = profile.width * scale;
        const h = profile.height * scale;

        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
    });
}

function addProfile() {
    const type = document.getElementById('profileType').value;
    const width = parseInt(document.getElementById('profileWidth').value);
    const thickness = parseInt(document.getElementById('profileThickness').value);
    const groove = parseInt(document.getElementById('grooveDepth').value);
    const allowance = parseInt(document.getElementById('profileAllowance').value);

    let profile = {
        id: Date.now(),
        type: type,
        profileWidth: width,
        thickness: thickness,
        grooveDepth: groove,
        allowance: allowance,
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    if (type === 'vertical') {
        profile.width = width;
        profile.height = doorData.height;

        const verticals = doorData.profiles.filter(p => p.type === 'vertical');
        profile.x = verticals.length === 0 ? 0 : doorData.width - width;
        profile.y = 0;
    } else {
        const verticals = doorData.profiles.filter(p => p.type === 'vertical');

        let left = 0;
        let right = 0;

        if (verticals.length >= 1) left = verticals[0].profileWidth;
        if (verticals.length >= 2) right = verticals[1].profileWidth;

        profile.x = left;
        profile.width = doorData.width - left - right;
        profile.height = width;

        const horizontals = doorData.profiles.filter(p => p.type === 'horizontal');
        profile.y = horizontals.length === 0 ? 0 : doorData.height - width;
    }

    doorData.profiles.push(profile);
    drawDoor();
}

function addInsert() {
    const type = document.getElementById('insertType').value;
    const thickness = parseInt(document.getElementById('insertThickness').value);
    const gap = parseInt(document.getElementById('insertGap').value);
    const offsetTop = parseInt(document.getElementById('insertOffsetTop').value);
    const offsetLeft = parseInt(document.getElementById('insertOffsetLeft').value);

    const areas = getInsertAreas();

    if (areas.length === 0) {
        alert("Нет доступной области: добавьте 2 стоевых и 2 поперечных профиля.");
        return;
    }

    const area = areas[0]; // пока берём первую подходящую область


    if (!area) {
        alert("Невозможно добавить вставку: минимум 2 стоевых и 2 поперечных профиля.");
        return;
    }

    // Снимаем выделение со всех предыдущих
    doorData.inserts.forEach(ins => ins.selected = false);

    const insert = {
        id: Date.now() + Math.random(),
        type: type,
        thickness: thickness,
        gap: gap,
        x: area.x + offsetLeft + gap,
        y: area.y + offsetTop + gap,
        width: area.width - offsetLeft * 2 - gap * 2,
        height: area.height - offsetTop * 2 - gap * 2,
        selected: true
    };

    doorData.inserts.push(insert);
    drawDoor();
    showInsertEditor(insert);
}


function drawInserts() {
    doorData.inserts.forEach(insert => {
        ctx.fillStyle = insert.type === 'glass'
            ? 'rgba(173, 216, 230, 0.6)'
            : '#aaa';

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;

        const x = insert.x * scale;
        const y = insert.y * scale;
        const w = insert.width * scale;
        const h = insert.height * scale;

        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        if (insert.selected) {
            ctx.strokeStyle = '#ff6b6b';  // красный контур для выделенной
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 2, y - 2, w + 4, h + 4); // выделение снаружи
        }


    });
}

function getInsertAreas() {
    const verticals = doorData.profiles.filter(p => p.type === 'vertical');
    const horizontals = doorData.profiles.filter(p => p.type === 'horizontal');

    if (verticals.length < 2 || horizontals.length < 2) return [];

    const areas = [];

    // Обход всех пар горизонтальных профилей
    for (let i = 0; i < horizontals.length - 1; i++) {
        const top = horizontals[i].y + horizontals[i].height;
        const bottom = horizontals[i + 1].y;

        const left = verticals[0].profileWidth;
        const right = verticals[1].profileWidth;

        areas.push({
            x: left,
            y: top,
            width: doorData.width - left - right,
            height: bottom - top
        });
    }

    return areas;
}

// --- Заглушки ---

function exportToPDF() {
    alert("Экспорт в PDF пока не реализован.");
}

function exportToExcel() {
    alert("Экспорт в Excel пока не реализован.");
}

function saveDoor() {
    alert("Сохранение пока не реализовано.");
}

function clearDoor() {
    if (confirm("Очистить всё?")) {
        doorData.profiles = [];
        doorData.inserts = [];
        drawDoor();
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / scale;
    const mouseY = (event.clientY - rect.top) / scale;

    const selectedInsert = doorData.inserts.find(ins => ins.selected);
    if (!selectedInsert) return;

    // Центр вставки станет под курсором
    selectedInsert.x = mouseX - selectedInsert.width / 2;
    selectedInsert.y = mouseY - selectedInsert.height / 2;

    drawDoor();
}

