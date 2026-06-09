// 主程序 - 3D海底瀑布场景

class OceanWaterfallScene {
    constructor() {
        // 基础变量
        this.container = document.getElementById('container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // 场景对象
        this.ocean = null;
        this.waterfall = null;
        this.waterfallSplash = null;
        this.terrain = null;
        this.decorations = null;
        
        // 灯光
        this.lights = {};
        
        // 性能监测
        this.fpsCounter = new FPSCounter();
        this.clock = new THREE.Clock();
        
        // 控制参数
        this.config = {
            waveAmplitude: 0.5,
            particleCount: 5000,
            waterfallSpeed: 0.1,
            lightIntensity: 1,
        };
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupObjects();
        this.setupControls();
        this.setupUIEvents();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        
        // 背景
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#000015');
        gradient.addColorStop(0.5, '#001a4d');
        gradient.addColorStop(1, '#003d99');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // 添加星星
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = Math.random() * 1.5;
            ctx.fillRect(x, y, size, size);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        this.scene.background = texture;
        
        // 雾效
        this.scene.fog = new THREE.Fog(0x001a4d, 200, 300);
    }

    setupCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(50, 40, 50);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        
        this.container.appendChild(this.renderer.domElement);
        
        // 处理窗口大小改变
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLights() {
        // 环境光
        this.lights.ambient = new THREE.AmbientLight(0x4488cc, 0.6);
        this.scene.add(this.lights.ambient);
        
        // 平行光（模拟阳光）
        this.lights.directional = new THREE.DirectionalLight(0xffffff, this.config.lightIntensity);
        this.lights.directional.position.set(50, 50, 30);
        this.lights.directional.castShadow = true;
        
        // 设置阴影贴图
        this.lights.directional.shadow.camera.left = -100;
        this.lights.directional.shadow.camera.right = 100;
        this.lights.directional.shadow.camera.top = 100;
        this.lights.directional.shadow.camera.bottom = -100;
        this.lights.directional.shadow.camera.near = 0.5;
        this.lights.directional.shadow.camera.far = 500;
        this.lights.directional.shadow.mapSize.width = 2048;
        this.lights.directional.shadow.mapSize.height = 2048;
        
        this.scene.add(this.lights.directional);
        
        // 点光源（模拟深海光源）
        this.lights.point = new THREE.PointLight(0x00ccff, 0.8, 100);
        this.lights.point.position.set(0, 5, 0);
        this.scene.add(this.lights.point);
    }

    setupObjects() {
        // 创建海洋
        this.ocean = new Ocean(this.scene, 200, 200, 100, 100);
        
        // 创建地形
        this.terrain = new SeafloorTerrain(this.scene, 150, 150);
        
        // 创建装饰物
        this.decorations = new OceanDecorations(this.scene);
        
        // 创建瀑布
        this.waterfall = new Waterfall(this.scene, { x: 0, y: 10, z: -50 }, {
            particleCount: this.config.particleCount,
            speed: this.config.waterfallSpeed,
            width: 15,
            height: 30,
        });
        
        // 创建飞溅效果
        this.waterfallSplash = new WaterfallSplash(this.scene, { x: 0, y: -15, z: -50 });
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1;
        this.controls.maxDistance = 200;
        this.controls.minDistance = 20;
    }

    setupUIEvents() {
        // 波动强度
        document.getElementById('waveAmplitude').addEventListener('input', (e) => {
            this.config.waveAmplitude = parseFloat(e.target.value);
            document.getElementById('waveAmplitudeValue').textContent = e.target.value;
            this.ocean.setWaveAmplitude(this.config.waveAmplitude);
        });
        
        // 粒子数量
        document.getElementById('particleCount').addEventListener('input', (e) => {
            this.config.particleCount = parseInt(e.target.value);
            document.getElementById('particleCountValue').textContent = e.target.value;
            this.waterfall.setParticleCount(this.config.particleCount);
        });
        
        // 瀑布流速
        document.getElementById('waterfallSpeed').addEventListener('input', (e) => {
            this.config.waterfallSpeed = parseFloat(e.target.value);
            document.getElementById('waterfallSpeedValue').textContent = e.target.value;
            this.waterfall.setSpeed(this.config.waterfallSpeed);
        });
        
        // 光照强度
        document.getElementById('lightIntensity').addEventListener('input', (e) => {
            this.config.lightIntensity = parseFloat(e.target.value);
            document.getElementById('lightIntensityValue').textContent = e.target.value;
            this.lights.directional.intensity = this.config.lightIntensity;
        });
        
        // 重置按钮
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetScene();
        });
        
        // 切换信息面板
        document.getElementById('toggleInfo').addEventListener('click', () => {
            const info = document.getElementById('info');
            info.style.display = info.style.display === 'none' ? 'block' : 'none';
        });
    }

    resetScene() {
        this.camera.position.set(50, 40, 50);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
        
        // 重置参数
        document.getElementById('waveAmplitude').value = 0.5;
        document.getElementById('particleCount').value = 5000;
        document.getElementById('waterfallSpeed').value = 0.1;
        document.getElementById('lightIntensity').value = 1;
        
        this.config.waveAmplitude = 0.5;
        this.config.particleCount = 5000;
        this.config.waterfallSpeed = 0.1;
        this.config.lightIntensity = 1;
        
        this.ocean.setWaveAmplitude(0.5);
        this.waterfall.setSpeed(0.1);
        this.lights.directional.intensity = 1;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        // 更新场景对象
        this.ocean.update(deltaTime);
        this.waterfall.update();
        this.waterfallSplash.update();
        
        // 随机产生飞溅
        if (Math.random() < 0.05) {
            this.waterfallSplash.createSplash(randomInRange(5, 15));
        }
        
        // 更新控制器
        this.controls.update();
        
        // 渲染
        this.renderer.render(this.scene, this.camera);
        
        // 更新FPS
        const fps = this.fpsCounter.update();
        document.getElementById('fps').textContent = fps;
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
}

// 初始化场景
window.addEventListener('load', () => {
    new OceanWaterfallScene();
});
