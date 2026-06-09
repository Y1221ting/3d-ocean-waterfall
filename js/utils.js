// 工具函数集合

class FPSCounter {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = Date.now();
    }

    update() {
        this.frameCount++;
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastTime = currentTime;
        }

        return this.fps;
    }
}

// 创建纹理
function createOceanTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#001a33');
    gradient.addColorStop(0.5, '#003366');
    gradient.addColorStop(1, '#004d80');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // 添加波纹效果
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
        const y = (i * 51) + Math.sin(i) * 10;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.quadraticCurveTo(256, y - 10, 512, y);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

// 创建随机颜色
function randomColor() {
    return Math.random() * 0xffffff;
}

// 缓动函数
const Easing = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInSine: t => 1 - Math.cos((t * Math.PI) / 2),
    easeOutSine: t => Math.sin((t * Math.PI) / 2),
};

// 生成随机数范围
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// 向量计算
function getDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// 颜色转换
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
}

// Perlin噪声（简化版）
class SimplexNoise {
    constructor(seed = 0) {
        this.permutation = [];
        this.p = [];
        this.seed = seed;
        this.init();
    }

    init() {
        const p = [];
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }
        // Fisher-Yates洗牌
        for (let i = 255; i > 0; i--) {
            const j = Math.floor((Math.random() + this.seed) * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        // 复制排列
        this.p = p.concat(p);
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 8 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;

        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);

        const u = this.fade(xf);
        const v = this.fade(yf);

        const aa = this.p[this.p[xi] + yi];
        const ab = this.p[this.p[xi] + yi + 1];
        const ba = this.p[this.p[xi + 1] + yi];
        const bb = this.p[this.p[xi + 1] + yi + 1];

        const x1 = this.lerp(u, this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf));
        const x2 = this.lerp(u, this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1));

        return this.lerp(v, x1, x2);
    }
}

// 导出
window.FPSCounter = FPSCounter;
window.createOceanTexture = createOceanTexture;
window.randomColor = randomColor;
window.Easing = Easing;
window.randomInRange = randomInRange;
window.getDistance = getDistance;
window.hexToRgb = hexToRgb;
window.SimplexNoise = SimplexNoise;
