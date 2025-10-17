// Hyperspeed Road Effect (Simplified Three.js version)
function initHyperspeedEffect(canvasId, options = {}) {
    const container = document.getElementById(canvasId);
    if (!container || typeof THREE === 'undefined') {
        console.error('Three.js not loaded or container not found');
        return;
    }

    // Configuration
    const config = {
        roadWidth: options.roadWidth || 9,
        islandWidth: options.islandWidth || 2,
        length: options.length || 400,
        fov: options.fov || 90,
        speedFactor: options.speedFactor || 1,
        colors: {
            roadColor: options.colors?.roadColor || 0x080808,
            islandColor: options.colors?.islandColor || 0x0a0a0a,
            leftCars: options.colors?.leftCars || [0xff6ec7, 0x7b2cbf, 0xc77dff],
            rightCars: options.colors?.rightCars || [0x00d9ff, 0x4361ee, 0x4cc9f0],
            sticks: options.colors?.sticks || 0x00d9ff
        }
    };

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        config.fov,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    camera.position.set(0, 8, -5);
    camera.lookAt(0, 0, -50);

    // Fog
    scene.fog = new THREE.Fog(0x000000, 10, config.length * 0.8);

    // Create road
    function createRoad(xOffset, width, color) {
        const geometry = new THREE.PlaneGeometry(width, config.length, 20, 200);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(xOffset, 0, -config.length / 2);
        return mesh;
    }

    const leftRoad = createRoad(-(config.roadWidth / 2 + config.islandWidth / 2), config.roadWidth, config.colors.roadColor);
    const rightRoad = createRoad(config.roadWidth / 2 + config.islandWidth / 2, config.roadWidth, config.colors.roadColor);
    const island = createRoad(0, config.islandWidth, config.colors.islandColor);

    scene.add(leftRoad);
    scene.add(rightRoad);
    scene.add(island);

    // Create car lights
    function createCarLights(count, colors, side, minSpeed, maxSpeed) {
        const lights = [];
        const roadOffset = side * (config.roadWidth / 2 + config.islandWidth / 2);

        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const geometry = new THREE.CylinderGeometry(0.1, 0.15, 3, 8);
            const material = new THREE.MeshBasicMaterial({ color: color });
            const light = new THREE.Mesh(geometry, material);

            const laneOffset = (Math.random() - 0.5) * (config.roadWidth * 0.8);
            light.position.set(roadOffset + laneOffset, 0.5, -Math.random() * config.length);
            light.rotation.x = Math.PI / 2;

            light.userData = {
                speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
                initialZ: light.position.z
            };

            scene.add(light);
            lights.push(light);
        }
        return lights;
    }

    const leftLights = createCarLights(30, config.colors.leftCars, -1, 40, 60);
    const rightLights = createCarLights(30, config.colors.rightCars, 1, -80, -120);

    // Create side sticks
    function createSideSticks(count, side) {
        const sticks = [];
        const xPos = side * (config.roadWidth + config.islandWidth / 2);

        for (let i = 0; i < count; i++) {
            const geometry = new THREE.BoxGeometry(0.2, 2, 0.2);
            const material = new THREE.MeshBasicMaterial({ color: config.colors.sticks });
            const stick = new THREE.Mesh(geometry, material);

            stick.position.set(xPos, 1, -i * (config.length / count));
            scene.add(stick);
            sticks.push(stick);
        }
        return sticks;
    }

    const leftSticks = createSideSticks(50, -1);
    const rightSticks = createSideSticks(50, 1);

    // Animation variables
    const clock = new THREE.Clock();
    let disposed = false;

    // Resize handler
    function onResize() {
        if (!container) return;
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        if (width > 0 && height > 0) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    }

    window.addEventListener('resize', onResize);

    // Animation loop
    function animate() {
        if (disposed) return;

        const delta = clock.getDelta();
        const speed = config.speedFactor;

        // Update car lights
        [...leftLights, ...rightLights].forEach(light => {
            light.position.z += light.userData.speed * delta * speed;

            if (light.userData.speed > 0 && light.position.z > 20) {
                light.position.z = -config.length;
            } else if (light.userData.speed < 0 && light.position.z < -config.length) {
                light.position.z = 20;
            }

            // Fade based on distance
            const dist = Math.abs(light.position.z);
            light.material.opacity = Math.max(0, 1 - dist / (config.length * 0.5));
            light.material.transparent = true;
        });

        // Update sticks
        [...leftSticks, ...rightSticks].forEach(stick => {
            stick.position.z += 60 * delta * speed;
            if (stick.position.z > 20) {
                stick.position.z -= config.length;
            }
        });

        // Subtle camera movement
        const time = clock.getElapsedTime();
        camera.position.x = Math.sin(time * 0.3) * 0.5;
        camera.position.y = 8 + Math.sin(time * 0.2) * 0.3;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Cleanup function
    return () => {
        disposed = true;
        window.removeEventListener('resize', onResize);

        // Dispose Three.js resources
        scene.traverse(object => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        renderer.dispose();
        if (container && renderer.domElement) {
            container.removeChild(renderer.domElement);
        }
    };
}
