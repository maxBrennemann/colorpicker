class Colorpicker{constructor(a){this.canvas=this.createHiDPICanvas(300,200);this.canvasContext=this.canvas.getContext('2d');this.mousePos={x:100,y:100};this.foregroundColor='cyan';this.isDown=!1;this.initialize=function(){this.loadHTML();this.applyEventListeners(this.canvas);this.applyStyle(this.canvas);a.appendChild(this.canvas);this.createForegroundColor();this.createBackgroundGradient();this.createForegroundSelector();this.colorDiv=document.createElement('div');this.colorDiv.style.width='100px';this.colorDiv.style.height='100px';this.colorDiv.style.marginLeft='10px';this.colorDiv.style.borderRadius='6px';a.appendChild(this.colorDiv);this.colorSpan=document.createElement('span');a.appendChild(this.colorSpan)};this.initialize()}createBackgroundGradient(){this.backgroundGradient==null&&(this.backgroundGradient=this.canvasContext.createLinearGradient(0,0,0,200),this.backgroundGradient.addColorStop(0,'transparent'),this.backgroundGradient.addColorStop(1,'black'));this.canvasContext.fillStyle=this.backgroundGradient;this.canvasContext.fillRect(0,0,300,200)}createForegroundColor(){var A=this.canvasContext.createLinearGradient(0,0,300,0);A.addColorStop(0,'white');A.addColorStop(1,this.foregroundColor);this.canvasContext.fillStyle=A;this.canvasContext.fillRect(0,0,300,200)}createForegroundSelector(){this.colorCanvas=document.createElement('canvas');this.colorCanvas.width=600;this.colorCanvas.height=10;this.colorContext=this.colorCanvas.getContext('2d');this.applyStyle(this.colorCanvas);var _=document.createElement('div');_.classList.add('sliderContainer');_.appendChild(this.colorCanvas);document.body.appendChild(_);this.drawForegroundSelectorGradient();this.createSlider(_)}applyStyle(b){b.style.borderRadius='6px';b.style.display='block';b.style.margin='10px'}drawForegroundSelectorGradient(){var B=this.colorContext.createLinearGradient(0,0,600,0);B.addColorStop(0,'red');B.addColorStop(1/6,'yellow');B.addColorStop(2/6,'lime');B.addColorStop(3/6,'cyan');B.addColorStop(4/6,'blue');B.addColorStop(5/6,'magenta');B.addColorStop(1,'red');this.colorContext.fillStyle=B;this.colorContext.fillRect(0,0,600,10)}createSlider(c){var C=document.createElement('input'),_c=this;C.type='range';C.classList.add('slider');C.min='1';C.max='600';C.value='300';C.oninput=function(_a){var p=_c.colorContext.getImageData(_a.target.value,5,1,1).data;_c.foregroundColor=`rgb(${p[0]}, ${p[1]}, ${p[2]})`;_c.outputColor()}.bind(_c);c.appendChild(C)}applyEventListeners(){this.canvas.addEventListener('mousedown',function(){this.isDown=!0}.bind(this),!1);this.canvas.addEventListener('mousemove',function(){console.log(this.isDown);this.isDown&&this.outputColor(this.canvas)}.bind(this),!1);this.canvas.addEventListener('mouseup',function(){this.isDown=!1}.bind(this),!1)}outputColor(d){this.createForegroundColor();this.createBackgroundGradient();this.mousePos=d==null?this.mousePos:this.getMousePos(d,event);this.createCircles();var p=this.canvasContext.getImageData(this.mousePos.x*this.PIXEL_RATIO,this.mousePos.y*this.PIXEL_RATIO,1,1).data;this.color=D(p[0],p[1],p[2]);function D(r,g,b){if(r>255||g>255||b>255)throw 'Invalid color component';return ((r<<16)|(g<<8)|b).toString(16)}this.colorDiv.style.background=`rgb(${p[0]}, ${p[1]}, ${p[2]})`;this.colorSpan.innerHTML=`#${this.color.toUpperCase()}<br>rgb(${p[0]}, ${p[1]}, ${p[2]})`}createCircles(){this.canvasContext.beginPath();this.canvasContext.arc(this.mousePos.x,this.mousePos.y,5,0,2*Math.PI);this.canvasContext.lineWidth=3;this.canvasContext.strokeStyle='white';this.canvasContext.stroke();this.canvasContext.beginPath();this.canvasContext.arc(this.mousePos.x,this.mousePos.y,8,0,2*Math.PI);this.canvasContext.lineWidth=3;this.canvasContext.strokeStyle='#2e2e2e';this.canvasContext.stroke()}loadHTML(){var _A=document.createElement('style');_A.innerHTML=`
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
        }`;document.body.appendChild(_A)}getMousePos(e,_B){var _C=e.getBoundingClientRect();return{x:_B.clientX-_C.left,y:_B.clientY-_C.top}}createHiDPICanvas(w,h,E){!E&&(E=this.PIXEL_RATIO);var _d=document.createElement('canvas');_d.width=w*E;_d.height=h*E;_d.style.width=`${w}px`;_d.style.height=`${h}px`;_d.getContext('2d').setTransform(E,0,0,E,0,0);return _d}}Colorpicker.prototype.PIXEL_RATIO=(function(){var aA=document.createElement('canvas').getContext('2d'),aB=window.devicePixelRatio||1,aC=aA.webkitBackingStorePixelRatio||aA.mozBackingStorePixelRatio||aA.msBackingStorePixelRatio||aA.oBackingStorePixelRatio||aA.backingStorePixelRatio||1;return aB/aC})();
