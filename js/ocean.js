// 海洋水效果模块

class Ocean {
    constructor(scene, width = 200, height = 200, widthSegments = 100, heightSegments = 100) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        
        this.mesh = null;
        this.waveAmplitude = 0.5;
        this.waveFrequency = 0.05;
        this.waveSpeed = 0.01;
        this.time = 0;
        
        this.noise = new SimplexNoise();
        this.init();
    }

    init() {
        // 创建几何体
        const geometry = new THREE.PlaneGeometry(
            this.width,
            this.height,
            this.widthSegments,
            this.heightSegments
        );

        // 创建材质
        const material = new THREE.MeshPhongMaterial({
            color: 0x001a4d,
            emissive: 0x003366,
            shininess: 100,
            wireframe: false,
            side: THREE.DoubleSide,
        });

        // ��建网格
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;

        // 初始化位置数据
        this.positionAttribute = geometry.getAttribute('position');
        this.initialPositions = new Float32Array(this.positionAttribute.array);

        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        this.time += deltaTime * this.waveSpeed;
        
        const positions = this.positionAttribute.array;
        const positionCount = this.positionAttribute.count;

        for (let i = 0; i < positionCount; i++) {
            const i3 = i * 3;
            const x = this.initialPositions[i3];
            const z = this.initialPositions[i3 + 2];

            // 使用Perlin噪声生成波浪
            const wave1 = Math.sin(x * this.waveFrequency + this.time) * this.waveAmplitude;
            const wave2 = Math.sin(z * this.waveFrequency + this.time * 0.7) * this.waveAmplitude * 0.7;
            const wave3 = Math.cos((x + z) * this.waveFrequency * 0.5 + this.time * 1.3) * this.waveAmplitude * 0.5;

            positions[i3 + 1] = this.initialPositions[i3 + 1] + wave1 + wave2 + wave3;
        }

        this.positionAttribute.needsUpdate = true;
        
        // 重新计算法线
        this.mesh.geometry.computeVertexNormals();
    }

    setWaveAmplitude(amplitude) {
        this.waveAmplitude = amplitude;
    }

    setWaveFrequency(frequency) {
        this.waveFrequency = frequency;
    }

    setWaveSpeed(speed) {
        this.waveSpeed = speed;
    }

    getMesh() {
        return this.mesh;
    }
}

// 海底地形生成
class SeafloorTerrain {
    constructor(scene, width = 150, height = 150) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.terrain = null;
        this.init();
    }

    init() {
        // 创建地形几何体
        const geometry = new THREE.BufferGeometry();
        
        const vertices = [];
        const indices = [];
        const segmentsX = 30;
        const segmentsZ = 30;

        const noise = new SimplexNoise();

        for (let z = 0; z <= segmentsZ; z++) {
            for (let x = 0; x <= segmentsX; x++) {
                const px = (x / segmentsX - 0.5) * this.width;
                const pz = (z / segmentsZ - 0.5) * this.height;
                
                // 使用噪声生成高度
                const height = (
                    noise.noise(px * 0.01, pz * 0.01) * 3 +
                    noise.noise(px * 0.02, pz * 0.02) * 1.5 +
                    noise.noise(px * 0.05, pz * 0.05) * 0.5
                ) - 15;

                vertices.push(px, height, pz);
            }
        }

        // 创建面索引
        for (let z = 0; z < segmentsZ; z++) {
            for (let x = 0; x < segmentsX; x++) {
                const a = z * (segmentsX + 1) + x;
                const b = z * (segmentsX + 1) + x + 1;
                const c = (z + 1) * (segmentsX + 1) + x;
                const d = (z + 1) * (segmentsX + 1) + x + 1;

                indices.push(a, c, b);
                indices.push(b, c, d);
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
        geometry.computeVertexNormals();

        // 创建材质
        const material = new THREE.MeshPhongMaterial({
            color: 0x2d5016,
            emissive: 0x1a3009,
            shininess: 30,
        });

        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.receiveShadow = true;
        this.terrain.castShadow = true;
        this.terrain.position.y = -20;

        this.scene.add(this.terrain);
    }

    getTerrainMesh() {
        return this.terrain;
    }
}

// 海洋生物装饰
class OceanDecorations {
    constructor(scene) {
        this.scene = scene;
        this.decorations = [];
        this.init();
    }

    init() {
        // 添加水草
        this.addSeaweed(5);
        // 添加岩石
        this.addRocks(8);
    }

    addSeaweed(count) {
        for (let i = 0; i < count; i++) {
            const x = randomInRange(-80, 80);
            const z = randomInRange(-80, 80);
            
            const geometry = new THREE.BufferGeometry();
            const points = [];
            
            for (let j = 0; j < 20; j++) {
                const angle = Math.sin(j * 0.3) * 0.3;
                points.push(
                    Math.sin(angle) * (j * 0.3),
                    -j * 0.5,
                    Math.cos(angle) * (j * 0.3)
                );
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
            
            const material = new THREE.LineBasicMaterial({
                color: 0x00aa44,
                linewidth: 3,
                transparent: true,
                opacity: 0.6,
            });

            const seaweed = new THREE.Line(geometry, material);
            seaweed.position.set(x, -10, z);
            this.scene.add(seaweed);
            this.decorations.push(seaweed);
        }
    }

    addRocks(count) {
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.IcosahedronGeometry(randomInRange(1, 3), 3);
            const material = new THREE.MeshPhongMaterial({
                color: 0x4d4d4d,
                emissive: 0x262626,
                shininess: 10,
            });

            const rock = new THREE.Mesh(geometry, material);
            rock.position.set(
                randomInRange(-80, 80),
                randomInRange(-20, -5),
                randomInRange(-80, 80)
            );
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            rock.scale.set(
                randomInRange(0.8, 1.5),
                randomInRange(0.8, 1.5),
                randomInRange(0.8, 1.5)
            );
            rock.castShadow = true;
            rock.receiveShadow = true;

            this.scene.add(rock);
            this.decorations.push(rock);
        }
    }

    getDecorations() {
        return this.decorations;
    }
}

// 导出类
window.Ocean = Ocean;
window.SeafloorTerrain = SeafloorTerrain;
window.OceanDecorations = OceanDecorations;
