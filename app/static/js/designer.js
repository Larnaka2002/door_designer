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

        // обновляем отображение размеров
        document.getElementById('widthDisplay').textContent = `${newWidth} мм`;
        document.getElementById('heightDisplay').textContent = `${newHeight} мм`;
    } else {
        alert("Введите корректные значения ширины и высоты.");
    }
}

function drawDoor() {
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // рамка двери
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    // профили
    drawProfiles();
    drawInserts();

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

        if (verticals.length >= 1) {
            left = verticals[0].profileWidth;
        }
        if (verticals.length >= 2) {
            right = verticals[1].profileWidth;
        }

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
    // Считываем параметры из формы
    const type = document.getElementById('insertType').value;
    const thickness = parseInt(document.getElementById('insertThickness').value);
    const gap = parseInt(document.getElementById('insertGap').value);

    // Пытаемся вычислить область между профилями
    const area = calculateInsertArea();

    if (!area) {
        alert("Невозможно добавить вставку: необходимо минимум 2 стоевых и 2 поперечных профиля.");
        return;
    }

    // Создаём объект вставки
    const insert = {
        id: Date.now(),
        type: type,
        thickness: thickness,
        gap: gap,
        x: area.x + gap,
        y: area.y + gap,
        width: area.width - gap * 2,
        height: area.height - gap * 2
    };

    // Сохраняем вставку в массив
    doorData.inserts.push(insert);

    // Перерисовываем дверь с учётом новой вставки
    drawDoor();
}

function drawInserts() {
    doorData.inserts.forEach(insert => {
        // Цвет вставки — зависит от типа
        if (insert.type === 'glass') {
            ctx.fillStyle = 'rgba(173, 216, 230, 0.6)'; // голубоватое стекло
        } else {
            ctx.fillStyle = '#aaa'; // сероватый для панелей
        }

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;

        const x = insert.x * scale;
        const y = insert.y * scale;
        const w = insert.width * scale;
        const h = insert.height * scale;

        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
    });
}


function calculateInsertArea() {
    const verticals = doorData.profiles.filter(p => p.type === 'vertical');
    const horizontals = doorData.profiles.filter(p => p.type === 'horizontal');

    // Должно быть минимум по 2 вертикальных и 2 горизонтальных профиля
    if (verticals.length < 2 || horizontals.length < 2) return null;

    const left = verticals[0].profileWidth;
    const right = verticals[1].profileWidth;
    const top = horizontals[0].height;
    const bottom = horizontals[1].height;

    return {
        x: left,
        y: top,
        width: doorData.width - left - right,
        height: doorData.height - top - bottom
    };
}


// Пустые функции-заглушки для кнопок
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
    if (confirm("Очистить все профили?")) {
        doorData.profiles = [];
        doorData.inserts = [];
        drawDoor();
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
