const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const resizeCanvas = (w, h) => {
    canvas.width = w;
    canvas.height = h;
}
resizeCanvas(window.innerWidth, window.innerHeight)

window.addEventListener("resize", e => {
    resizeCanvas(window.innerWidth, window.innerHeight)
})

let flows = {};

const Flow = function (arr, top = 0, left = 0, size = 30, speed) {
    this.top = top;
    this.left = left;
    this.height = size * arr.length;
    this.id = Math.random();
    flows[this.id] = this;

    let updatePeriod = getRandomInt(40, 200);
    let lastStep = 0;

    const checkRemove = (e, h) => {
        if (e > window.innerHeight + h) {
            delete flows[this.id]
        }
    }

    this.update = e => {
        this.top += speed;
        if (Date.now() - lastStep > updatePeriod) {
            lastStep = Date.now();
            arr[arr.length - 1] = kanji[getRandomInt(0, kanji.length - 1)];
            updatePeriod = getRandomInt(40, 200);
            if (getRandomInt(0, 100) > 50) {
                arr[getRandomInt(0, arr.length - 1)] = kanji[getRandomInt(0, kanji.length - 1)];
            }
        }
        for (let i = 0; i < arr.length; i++) {
            ctx.font = `bold ${size}px Ms Gothic`;
            ctx.fillStyle = `rgba(0, 255, 0, ${(size / 100) * 3}`;
            ctx.textAlign = "center";
            ctx.fillText(arr[i], this.left, (i * size) + this.top);
            checkRemove(this.top, this.height)
        }
    }
}

function debug() {
    ctx.font = `15px Courier New`;
    ctx.fillStyle = `white`;
    ctx.textAlign = "left";
    ctx.fillText(`Rendering: ${Object.keys(flows).length}`, 10, 30);
    ctx.fillText(`fps      : ${fps}`, 10, 50);
    ctx.fillText(`step     : 70`, 10, 70);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(e => {
    let speed = getRandomInt(10, 30);
    let length = getRandomInt(5, 10);
    let start = getRandomInt(length, kanji.length);
    new Flow(kanji.slice(start - length, start), -250, Math.floor(Math.random() * window.innerWidth - 50) + 50, speed, speed / 10)
}, 70)

let times = [];
let fps;

const animate = e => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    fps = times.length;

    debug();

    for (let f in flows) {
        flows[f].update();
    }

    window.requestAnimationFrame(animate);
}

animate();