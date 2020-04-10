var canvasContext;
var colorContext;
var colorDiv;
var foregroundColor = "blue";

function initialize() {
    var canvas = createHiDPICanvas(300, 200);
    canvasContext = canvas.getContext("2d");

    applyEventListeners(canvas);

    applyStyle(canvas);
    document.body.appendChild(canvas);
    
    createForegroundColor();
    createBackgroundGradient();
    createForegroundSelector();

    colorDiv = document.createElement("div");
    colorDiv.style.width = "100px";
    colorDiv.style.height = "100px";
    document.body.appendChild(colorDiv);
}

function createBackgroundGradient() {
    var gradient = canvasContext.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(1, "black");

    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, 300, 200);
}

function createForegroundColor() {
    var gradient = canvasContext.createLinearGradient(0, 0, 300, 0);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, foregroundColor);

    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, 300, 200);
}

/* variables for mouse events */
var isDown = false;
function applyEventListeners(canvas) {
    canvas.addEventListener("mousedown", function(event) {
        isDown = true;
    }, false);

    canvas.addEventListener("mousemove", function(event) {
        if (isDown) {
            createForegroundColor();
            createBackgroundGradient();
            mousePos = getMousePos(canvas, event);

            // white circle
            canvasContext.beginPath();
            canvasContext.arc(mousePos.x, mousePos.y, 5, 0, 2 * Math.PI);
            canvasContext.lineWidth = 3;
            canvasContext.strokeStyle = "white";
            canvasContext.stroke();

            // grey circle
            canvasContext.beginPath();
            canvasContext.arc(mousePos.x, mousePos.y, 8, 0, 2 * Math.PI);
            canvasContext.lineWidth = 3;
            canvasContext.strokeStyle = "#2e2e2e";
            canvasContext.stroke();

            var p = canvasContext.getImageData(mousePos.x * PIXEL_RATIO, mousePos.y * PIXEL_RATIO, 1, 1).data;
            console.log(p);
            var color = "#" + p[0].toString(16) + p[1].toString(16) + p[2].toString(16);

            colorDiv.style.background = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
        }
    }.bind(canvas), false);

    canvas.addEventListener("mouseup", function(event) {
        isDown = false;
    }, false);
}

var isDownColorSel = false;
function applyEventListeners2(canvas) {
    canvas.addEventListener("mousedown", function(event) {
        isDownColorSel = true;
    }, false);

    canvas.addEventListener("mousemove", function(event) {
        if (isDownColorSel) {
            drawForegroundSelectorGradient();
            mousePos = getMousePos(canvas, event);

            var p = colorContext.getImageData(mousePos.x, mousePos.y, 1, 1).data;
            console.log(p);
            var color = "#" + p[0].toString(16) + p[1].toString(16) + p[2].toString(16);
            colorDiv.style.background = foregroundColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
        }
    }.bind(canvas), false);

    canvas.addEventListener("mouseup", function(event) {
        isDownColorSel = false;
    }, false);
}

function createForegroundSelector() {
    var canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 10;
    colorContext = canvas.getContext("2d");

    applyStyle(canvas);
    document.body.appendChild(canvas);

    drawForegroundSelectorGradient();

    applyEventListeners2(canvas);
}

function drawForegroundSelectorGradient() {
    var gradient = colorContext.createLinearGradient(0, 0, 600, 0);
    gradient.addColorStop(0, 'red');        // 255 0   0
    gradient.addColorStop(1 / 6, 'yellow'); // 255 255 0
    gradient.addColorStop(2 / 6, 'lime');   // 0   255 0
    gradient.addColorStop(3 / 6, 'cyan');   // 0   255 255
    gradient.addColorStop(4 / 6, 'blue');   // 0   0   255
    gradient.addColorStop(5 / 6, 'magenta');    // 255 0   255
    gradient.addColorStop(1, 'red');        // 255 0   0

    colorContext.fillStyle = gradient;
    colorContext.fillRect(0, 0, 600, 10);
}

function applyStyle(element) {
    element.style.borderRadius = "6px";
    element.style.display = "block";
    element.style.margin = "10px";
}

/* https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/* https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas */
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}
