# 🌊 3D 海底瀑布 - Three.js

一个令人惊艳的 WebGL 3D 海底瀑布场景，使用 Three.js 构建，具有逼真的水流效果、粒子系统和交互控制。

## 🎨 特性

✨ **逼真的海洋效果**
- 动态波浪模拟
- 正弦波和Perlin噪声结合
- 实时法线计算
- 精美的水面反射效果

💧 **粒子瀑布系统**
- 5000+ 可配置粒子
- 流畅的下落动画
- 动态飞溅效果
- 生命周期管理

🏔️ **海底地形**
- 程序生成的地形
- 噪声函数生成高度图
- 自然的地形起伏
- 岩石和水草装饰

🎮 **交互控制**
- 鼠标拖拽旋转视角
- 滚轮缩放
- 实时参数调整
- 双击重置相机

## 🚀 快速开始

### 方式一：直接在线查看
[点击这里查看演示](https://Y1221ting.github.io/3d-ocean-waterfall/)

### 方式二：本地运行

1. **克隆仓库**
```bash
git clone https://github.com/Y1221ting/3d-ocean-waterfall.git
cd 3d-ocean-waterfall
```

2. **启动本地服务器**
```bash
# 使用 Python 3
python -m http.server 8000

# 或者使用 Node.js 的 http-server
npx http-server
```

3. **打开浏览器**
访问 `http://localhost:8000`

## 📁 项目结构

```
3d-ocean-waterfall/
├── index.html              # 主HTML文件
├── style.css              # 样式表
├── README.md              # 项目说明
└── js/
    ├── main.js            # 主程序和场景初始化
    ├── ocean.js           # 海洋和地形效果
    ├── waterfall.js       # 瀑布粒子系统
    └── utils.js           # 工具函数
```

## 🎛️ 控制面板

### 参数调整

| 参数 | 范围 | 说明 |
|------|------|------|
| 海水波动强度 | 0 - 2 | 控制波浪的振幅 |
| 瀑布粒子数量 | 1000 - 10000 | 粒子总数（步长1000） |
| 瀑布流速 | 0 - 0.5 | 粒子下落速度 |
| 光照强度 | 0 - 2 | 直接光的强度 |

### 按钮

- **重置场景**: 恢复所有参数到默认值
- **显示/隐藏信息**: 切换信息面板可见性

## 🖱️ 交互操作

| 操作 | 效果 |
|------|------|
| 左键拖拽 | 旋转场景视角 |
| 滚轮滚动 | 缩放视角 |
| 双击 | 重置相机位置 |
| 右键拖拽 | 平移视角 |

## 🔧 技术栈

- **Three.js r128** - 3D图形库
- **OrbitControls** - 相机控制
- **WebGL** - 图形渲染
- **HTML5 Canvas** - 动态纹理生成
- **JavaScript (ES6+)** - 核心逻辑

## 📊 性能指标

- **FPS**: 实时显示帧率
- **粒子数**: 可扩展至10000+
- **视距**: 200-300单位
- **阴影**: 2048x2048分辨率

## 🎯 核心模块

### Ocean 类
处理海洋水面效果
```javascript
const ocean = new Ocean(scene, width, height, segmentsX, segmentsY);
ocean.setWaveAmplitude(0.5);
ocean.setWaveFrequency(0.05);
ocean.update(deltaTime);
```

### Waterfall 类
管理瀑布粒子系统
```javascript
const waterfall = new Waterfall(scene, position, config);
waterfall.setParticleCount(5000);
waterfall.setSpeed(0.1);
waterfall.update();
```

### SeafloorTerrain 类
生成海底地形
```javascript
const terrain = new SeafloorTerrain(scene, width, height);
```

### OceanDecorations 类
添加装饰物（水草、岩石）
```javascript
const decorations = new OceanDecorations(scene);
```

## 🛠️ 自定义扩展

### 修改瀑布位置
编辑 `js/main.js` 中的 `setupObjects()` 方法：
```javascript
this.waterfall = new Waterfall(this.scene, 
    { x: 0, y: 10, z: -50 },  // 修改这里的坐标
    { particleCount: 5000, speed: 0.1 }
);
```

### 添加更多装饰物
在 `js/ocean.js` 中修改 `OceanDecorations` 类：
```javascript
addSeaweed(count)  // 增加水草数量
addRocks(count)    // 增加岩石数量
```

### 调整灯光效果
修改 `js/main.js` 中的 `setupLights()` 方法：
```javascript
this.lights.ambient = new THREE.AmbientLight(0x4488cc, intensity);
this.lights.directional = new THREE.DirectionalLight(0xffffff, intensity);
```

## 📱 浏览器兼容性

| 浏览器 | 支持 |
|--------|------|
| Chrome | ✅ 60+ |
| Firefox | ✅ 55+ |
| Safari | ✅ 11+ |
| Edge | ✅ 79+ |
| IE | ❌ 不支持 |

## 🎓 学习资源

- [Three.js 官方文档](https://threejs.org/docs/)
- [WebGL 教程](https://webglfundamentals.org/)
- [粒子系统教程](https://threejs.org/examples/#webgl_particles_random)

## 🐛 常见问题

### Q: 页面加载缓慢？
A: 检查网络连接，Three.js 库需要从CDN加载。可以本地下载库文件。

### Q: 粒子数太多导致卡顿？
A: 降低粒子数量到 3000-5000，或者使用较新的显卡。

### Q: 在移动设备上性能不好？
A: 降低分辨率、粒子数量，关闭阴影效果。

## 📄 许可证

MIT License

## 👨‍💻 开发者

由 [Y1221ting](https://github.com/Y1221ting) 开发

## 🙏 致谢

感谢 Three.js 社区的优秀资源和示例。

---

⭐ 如果你喜欢这个项目，请给个 Star！
