class Colorpicker {

    constructor(parentNode) {
        this.canvas = this.createHiDPICanvas(300, 200);
        this.canvasContext = this.canvas.getContext("2d");
        this.colorCanvas;
        this.colorContext;

        this.backgroundGradient;

        this.mousePos = { x: 100, y: 100 };
        this.foregroundColor = "cyan";

        this.colorDiv;
        this.colorSpan;

        this.color;

        this.isDown = false;

        this.parentNode = parentNode;

        this.initialize = function () {
            this.loadHTML();
            this.applyEventListeners(this.canvas);
            this.applyStyle(this.canvas);
            parentNode.appendChild(this.canvas);

            this.createForegroundColor();
            this.createBackgroundGradient();
            this.createForegroundSelector();

            this.colorDiv = document.createElement("div");
            this.colorDiv.style.width = "100px";
            this.colorDiv.style.height = "100px";
            this.colorDiv.style.marginLeft = "10px";
            this.colorDiv.style.borderRadius = "6px";
            parentNode.appendChild(this.colorDiv);

            this.colorSpan = document.createElement("span");
            parentNode.appendChild(this.colorSpan);
        };

        this.initialize();
    }

    createBackgroundGradient() {
        if (this.backgroundGradient == null) {
            this.backgroundGradient = this.canvasContext.createLinearGradient(0, 0, 0, 200);
            this.backgroundGradient.addColorStop(0, "transparent");
            this.backgroundGradient.addColorStop(1, "black");
        }

        this.canvasContext.fillStyle = this.backgroundGradient;
        this.canvasContext.fillRect(0, 0, 300, 200);
    }

    createForegroundColor() {
        var gradient = this.canvasContext.createLinearGradient(0, 0, 300, 0);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, this.foregroundColor);

        this.canvasContext.fillStyle = gradient;
        this.canvasContext.fillRect(0, 0, 300, 200);
    }

    createForegroundSelector(anchor = null) {
        this.colorCanvas = document.createElement("canvas");
        this.colorCanvas.width = 600;
        this.colorCanvas.height = 10;
        this.colorContext = this.colorCanvas.getContext("2d");

        this.applyStyle(this.colorCanvas);

        var div = document.createElement("div");
        div.classList.add("sliderContainer");
        div.appendChild(this.colorCanvas);

        if (anchor != null) {
            anchor.appendChild(div);
        } else {
            this.parentNode.appendChild(div);
        }

        this.drawForegroundSelectorGradient();
        this.createSlider(div);
    }

    /**
     * adds some basic style
     */
    applyStyle(element) {
        element.style.borderRadius = "6px";
        element.style.display = "block";
        element.style.margin = "10px";
    }

    drawForegroundSelectorGradient() {
        var gradient = this.colorContext.createLinearGradient(0, 0, 600, 0);
        gradient.addColorStop(0, 'red'); // 255 0   0
        gradient.addColorStop(1 / 6, 'yellow'); // 255 255 0
        gradient.addColorStop(2 / 6, 'lime'); // 0   255 0
        gradient.addColorStop(3 / 6, 'cyan'); // 0   255 255
        gradient.addColorStop(4 / 6, 'blue'); // 0   0   255
        gradient.addColorStop(5 / 6, 'magenta'); // 255 0   255
        gradient.addColorStop(1, 'red'); // 255 0   0

        this.colorContext.fillStyle = gradient;
        this.colorContext.fillRect(0, 0, 600, 10);
    }

    createSlider(parent) {
        var slider = document.createElement("input");
        slider.type = "range";
        slider.classList.add("slider");
        slider.min = "1";
        slider.max = "600";
        slider.value = "300";

        var cp = this;

        slider.oninput = function (event) {
            var sliderVal = event.target.value;
            var p = cp.colorContext.getImageData(sliderVal, 5, 1, 1).data;
            cp.foregroundColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
            cp.outputColor();
        }.bind(cp);

        parent.appendChild(slider);
    }

    applyEventListeners() {
        this.canvas.addEventListener("mousedown", function (event) {
            this.isDown = true;
        }.bind(this), false);

        this.canvas.addEventListener("mousemove", function (event) {
            console.log(this.isDown);
            if (this.isDown) {
                this.outputColor(this.canvas);
            }
        }.bind(this), false);

        this.canvas.addEventListener("mouseup", function (event) {
            this.isDown = false;
        }.bind(this), false);
    }

    outputColor(canvas) {
        this.createForegroundColor();
        this.createBackgroundGradient();
        this.mousePos = canvas == null ? this.mousePos : this.getMousePos(canvas, event);

        this.createCircles();

        var p = this.canvasContext.getImageData(this.mousePos.x * this.PIXEL_RATIO, this.mousePos.y * this.PIXEL_RATIO, 1, 1).data;
        this.color = rgbToHex(p[0], p[1], p[2]);

        function rgbToHex(r, g, b) {
            if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
            return ((r << 16) | (g << 8) | b).toString(16);
        }

        this.colorDiv.style.background = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
        this.colorSpan.innerHTML = `#${this.color.toUpperCase()}<br>rgb(${p[0]}, ${p[1]}, ${p[2]})`;
    }

    createCircles() {
        // white circle
        this.canvasContext.beginPath();
        this.canvasContext.arc(this.mousePos.x, this.mousePos.y, 5, 0, 2 * Math.PI);
        this.canvasContext.lineWidth = 3;
        this.canvasContext.strokeStyle = "white";
        this.canvasContext.stroke();

        // grey circle
        this.canvasContext.beginPath();
        this.canvasContext.arc(this.mousePos.x, this.mousePos.y, 8, 0, 2 * Math.PI);
        this.canvasContext.lineWidth = 3;
        this.canvasContext.strokeStyle = "#2e2e2e";
        this.canvasContext.stroke();
    }

    loadHTML() {
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

    /* https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas */
    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    createHiDPICanvas(w, h, ratio) {
        if (!ratio) { ratio = this.PIXEL_RATIO; }
        var can = document.createElement("canvas");
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }

}

/* https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas */
Colorpicker.prototype.PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();
