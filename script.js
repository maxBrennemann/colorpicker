var canvasContext;
var colorContext;
var colorDiv;
var colorSpan;
var foregroundColor = "cyan";
var mousePos = {x : 100, y : 100};

function initialize() {
    var canvas = createHiDPICanvas(300, 200);
    canvasContext = canvas.getContext("2d");

    loadHTML();
    applyEventListeners(canvas);

    applyStyle(canvas);
    document.body.appendChild(canvas);
    
    createForegroundColor();
    createBackgroundGradient();
    createForegroundSelector();
    createCircles(mousePos.x, mousePos.y);

    colorDiv = document.createElement("div");
    colorDiv.style.width = "100px";
    colorDiv.style.height = "100px";
    colorDiv.style.marginLeft = "10px";
    colorDiv.style.borderRadius = "6px";
    document.body.appendChild(colorDiv);

    colorSpan = document.createElement("span");
    document.body.appendChild(colorSpan);
}

function loadHTML() {
    var style = document.createElement("style");
    style.innerHTML = `
        .sliderContainer {
            position: relative;
        }

        .slider {
            width: 600px;
            margin: 10px;
            position: absolute;
            top: -15px;
            -webkit-appearance: none;
            background: rgba(0,0,0,0);
        }

        .slider:focus {
            outline: 0;
        }

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none; /* Override default look */
            appearance: none;
            width: 10px;
            height: 20px;
            background: rgb(80, 80, 80); /* Green background */
            border-radius: 3px;
            cursor: pointer; /* Cursor on hover */
        }`;
    document.body.appendChild(style);
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
            outputColor(canvas);
        }
    }.bind(canvas), false);

    canvas.addEventListener("mouseup", function(event) {
        isDown = false;
    }, false);
}

function outputColor(canvas) {
    createForegroundColor();
    createBackgroundGradient();
    mousePos = canvas == null ? mousePos : getMousePos(canvas, event);

    createCircles(mousePos.x, mousePos.y);

    var p = canvasContext.getImageData(mousePos.x * PIXEL_RATIO, mousePos.y * PIXEL_RATIO, 1, 1).data;
    var color = rgbToHex(p[0], p[1], p[2]);

    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    colorDiv.style.background = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;

    colorSpan.innerHTML = `#${color.toUpperCase()}<br>rgb(${p[0]}, ${p[1]}, ${p[2]})`;
}

function createForegroundSelector() {
    var canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 10;
    colorContext = canvas.getContext("2d");

    applyStyle(canvas);

    var div = document.createElement("div");
    div.classList.add("sliderContainer");
    div.appendChild(canvas);

    document.body.appendChild(div);

    drawForegroundSelectorGradient();
    createSlider(div);
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

function createCircles(mouseX, mouseY) {
    // white circle
    canvasContext.beginPath();
    canvasContext.arc(mouseX, mouseY, 5, 0, 2 * Math.PI);
    canvasContext.lineWidth = 3;
    canvasContext.strokeStyle = "white";
    canvasContext.stroke();

    // grey circle
    canvasContext.beginPath();
    canvasContext.arc(mouseX, mouseY, 8, 0, 2 * Math.PI);
    canvasContext.lineWidth = 3;
    canvasContext.strokeStyle = "#2e2e2e";
    canvasContext.stroke();
}

function createSlider(parent) {
    var slider = document.createElement("input");
    slider.type = "range";
    slider.classList.add("slider");
    slider.min = "1";
    slider.max = "600";
    slider.value = "300";

    slider.oninput = function() {
        var sliderVal = this.value;
        var p = colorContext.getImageData(sliderVal, 5, 1, 1).data;
        foregroundColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
        outputColor();
    }

    parent.appendChild(slider);
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
