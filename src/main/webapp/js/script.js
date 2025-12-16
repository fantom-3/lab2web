document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("point-form");
    const yInput = document.getElementById("y-input");
    const errorDiv = document.getElementById("error-message");
    const canvas = document.getElementById("area-canvas");

    if (!form || !yInput || !errorDiv) {
        return;
    }

    let xHidden = document.getElementById("x-hidden");
    if (!xHidden) {
        xHidden = document.createElement("input");
        xHidden.type = "hidden";
        xHidden.name = "x";
        xHidden.id = "x-hidden";
        form.appendChild(xHidden);
    }

    let errorTimeoutId = null;

    // ЧАСТЬ 1. ВАЛИДАЦИЯ ФОРМЫ
    form.addEventListener("submit", function (event) {
        const errors = [];

        const selectedX = document.querySelector('input[name="x"]:checked');
        if (!selectedX) {
            errors.push("Выберите значение X.");
        }

        const rawY = yInput.value.trim();
        if (rawY === "") {
            errors.push("Введите значение Y.");
        } else {
            const normalizedY = rawY.replace(",", ".");
            const y = parseFloat(normalizedY);

            if (isNaN(y)) {
                errors.push("Y должен быть числом.");
            } else if (y < -3 || y > 5) {
                errors.push("Y должен быть в диапазоне [-3; 5].");
            }
        }

        const selectedR = document.querySelector('input[name="r"]:checked');
        if (!selectedR) {
            errors.push("Выберите значение R.");
        }

        if (errors.length > 0) {
            event.preventDefault();

            if (errorTimeoutId !== null) {
                clearTimeout(errorTimeoutId);
                errorTimeoutId = null;
            }

            errorDiv.textContent = errors.join(" ");

            errorTimeoutId = setTimeout(function () {
                errorDiv.textContent = "";
                errorTimeoutId = null;
            }, 2000);
        } else {
            if (errorTimeoutId !== null) {
                clearTimeout(errorTimeoutId);
                errorTimeoutId = null;
            }
            errorDiv.textContent = "";
        }
    });

    form.addEventListener("reset", function () {
        if (errorTimeoutId !== null) {
            clearTimeout(errorTimeoutId);
            errorTimeoutId = null;
        }
        errorDiv.textContent = "";
        xHidden.value = "";
    });

    // ЧАСТЬ 2. ГРАФИК НА CANVAS
    if (!canvas || !canvas.getContext) {
        return;
    }

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40;

    function getSelectedR() {
        const rRadio = document.querySelector('input[name="r"]:checked');
        if (!rRadio) return null;
        return parseFloat(rRadio.value.replace(",", "."));
    }

    function drawAxes(r) {
        if (!r || r <= 0) {
            r = 2;
        }

        const tickSize = 4;
        const marks = [-r, -r / 2, r / 2, r];
        const labels = ["-R", "-R/2", "R/2", "R"];

        ctx.beginPath();

        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);

        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(width - 10, centerY - 5);
        ctx.lineTo(width, centerY);
        ctx.lineTo(width - 10, centerY + 5);

        ctx.moveTo(centerX - 5, 10);
        ctx.lineTo(centerX, 0);
        ctx.lineTo(centerX + 5, 10);
        ctx.fillStyle = "#000000";
        ctx.fill();

        ctx.font = "10px sans-serif";
        ctx.fillText("x", width - 12, centerY - 8);
        ctx.fillText("y", centerX + 8, 10);

        for (let i = 0; i < marks.length; i++) {
            const val = marks[i];
            const label = labels[i];

            const x = centerX + val * scale;

            ctx.beginPath();
            ctx.moveTo(x, centerY - tickSize);
            ctx.lineTo(x, centerY + tickSize);
            ctx.stroke();

            ctx.fillText(label, x - 10, centerY + 14);
        }

        for (let i = 0; i < marks.length; i++) {
            const val = marks[i];
            const label = labels[i];

            const y = centerY - val * scale;

            ctx.beginPath();
            ctx.moveTo(centerX - tickSize, y);
            ctx.lineTo(centerX + tickSize, y);
            ctx.stroke();

            ctx.fillText(label, centerX + 6, y + 3);
        }
    }

    function drawArea(r) {
        ctx.clearRect(0, 0, width, height);

        if (!r || r <= 0) {
            r = 2;
        }

        ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
        ctx.strokeStyle = "#0000aa";

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        const steps = 60;
        for (let i = 0; i <= steps; i++) {
            const phi = Math.PI / 2 + (Math.PI / 2) * (i / steps);
            const xMath = r * Math.cos(phi);
            const yMath = r * Math.sin(phi);
            const x = centerX + xMath * scale;
            const y = centerY - yMath * scale;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const rectX = centerX;
        const rectY = centerY - r * scale;
        const rectW = (r / 2) * scale;
        const rectH = r * scale;
        ctx.beginPath();
        ctx.rect(rectX, rectY, rectW, rectH);
        ctx.fill();
        ctx.stroke();

        const x1 = centerX - r * scale;
        const y1 = centerY;
        const x2 = centerX;
        const y2 = centerY;
        const x3 = centerX;
        const y3 = centerY + (r / 2) * scale;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        drawAxes(r);
    }

    // Точка
    function drawPoint(x, y, hit) {
        const px = centerX + x * scale;
        const py = centerY - y * scale;

        const radius = 3;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, 2 * Math.PI);
        ctx.fillStyle = hit ? "#008000" : "#ff0000";
        ctx.fill();
    }

    function drawHistoryPoints(currentR) {
        const table = document.getElementById("history-table");
        if (!table) return;

        const rows = table.getElementsByTagName("tr");
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName("td");
            if (cells.length < 4) continue;

            const xVal = parseFloat(cells[0].textContent.replace(",", "."));
            const yVal = parseFloat(cells[1].textContent.replace(",", "."));
            const rVal = parseFloat(cells[2].textContent.replace(",", "."));
            const hitText = cells[3].textContent.trim();

            if (isNaN(xVal) || isNaN(yVal) || isNaN(rVal)) continue;

            if (Math.abs(rVal - currentR) > 1e-6) continue;

            const hit = (hitText === "Да");
            drawPoint(xVal, yVal, hit);
        }
    }

    function redrawAll(r) {
        drawArea(r);
        drawHistoryPoints(r);
    }

    const rRadios = document.querySelectorAll('input[name="r"]');
    rRadios.forEach(function (radio) {
        radio.addEventListener("change", function () {
            const r = parseFloat(this.value.replace(",", "."));
            redrawAll(r);
        });
    });

    const initialR = getSelectedR() || 2;
    redrawAll(initialR);

    // ЧАСТЬ 3. КЛИК ПО ГРАФИКУ
    canvas.addEventListener("click", function (event) {
        const r = getSelectedR();
        if (!r) {
            errorDiv.textContent = "Сначала выберите значение R.";

            if (errorTimeoutId !== null) {
                clearTimeout(errorTimeoutId);
                errorTimeoutId = null;
            }
            errorTimeoutId = setTimeout(function () {
                errorDiv.textContent = "";
                errorTimeoutId = null;
            }, 2000);
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const xPixel = event.clientX - rect.left;
        const yPixel = event.clientY - rect.top;

        const xCoord = (xPixel - centerX) / scale;
        const yCoord = (centerY - yPixel) / scale;

        let xVal = xCoord;
        if (xVal < -3) xVal = -3;
        if (xVal > 5) xVal = 5;

        const xRadios = document.querySelectorAll('input[name="x"]');
        xRadios.forEach(function (radio) {
            radio.checked = false;
        });

        xHidden.value = xVal.toFixed(2);

        let yVal = yCoord;
        if (yVal < -3) yVal = -3;
        if (yVal > 5) yVal = 5;
        yInput.value = yVal.toFixed(2);

        if (errorTimeoutId !== null) {
            clearTimeout(errorTimeoutId);
            errorTimeoutId = null;
        }
        errorDiv.textContent = "";

        form.submit();
    });
});