const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let rect = canvas.getBoundingClientRect();
let offsetX = rect.left, offsetY = rect.top;

const cw = canvas.width;
const ch = canvas.height;

let mouse = { x: 0, y: 0 };
const total = 36525;
const step = 4;

const Render = () => {

    let x = 0, y = 40;

    let imageData = ctx.createImageData(cw, ch);

    let days = 1 + (mouse.x / step + cw / step * (mouse.y / step | 0)) | 0;
    let years = days / 365.25 | 0;

    if (days < 0) days = 0, years = 0;
    if (days > total) days = total, years = 100;

    for (let i = 0; i < total; i++) {

        let col = days > i ? 242 : 96;

        addPixel(imageData, x, y, col);

        if (x < cw - step) {
            x += step
        } else {
            x = 0;
            y += step
        }
    }

    ctx.putImageData(imageData, 0, 0);

    let yeartxt = 'лет', daytxt = 'дней';

    let ld = Number([...days + ''].pop());
    let ly = Number([...years + ''].pop());

    if (ld == 1 && days != 11) daytxt = "день";
    if (ld > 1 && ld < 5 && (days < 5 || days > 14)) daytxt = "дня";

    if (ly == 1 && years != 11) yeartxt = "год";
    if (ly > 1 && ly < 5 && (years < 5 || years > 14)) yeartxt = "года";

    ctx.font = "20px Arial";
    ctx.fillStyle = "#999";
    ctx.fillText(`${days} ${daytxt} (${years} ${yeartxt})`, 420, 16);
}

const addPixel = (imageData, x, y, c) => {
    let d = imageData.data;
    let i = (x << 2) + (y * imageData.width << 2);
    d[i] += c;
    d[i + 1] += c;
    d[i + 2] += c;
    d[i + 3] += 255;
}

Render();

canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX - offsetX;
    mouse.y = e.clientY - offsetY - 40;

    requestAnimationFrame(Render);
});
