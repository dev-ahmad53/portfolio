/* ==========================================================================
   Ahmad Ali Portfolio V2 - Professional Constellation Three.js Background
   Features: Subtle floating nodes, interactive connecting lines, scroll fades
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('three-bg-canvas');
    if (!canvas) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Create Glowing Node Texture On-the-Fly ---
    function createCircleTexture() {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        return new THREE.CanvasTexture(canvas);
    }

    const nodeTexture = createCircleTexture();

    // --- Particle System Configuration (Optimized for lines) ---
    const count = 100; // Limit count for flawless performance with line loops
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const initialPositions = new Float32Array(count * 3);

    // Color tokens
    const yellow = new THREE.Color('#FFEB00');
    const purple = new THREE.Color('#7C5CFF');

    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 11;
        const y = (Math.random() - 0.5) * 11;
        const z = (Math.random() - 0.5) * 6;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        initialPositions[i * 3] = x;
        initialPositions[i * 3 + 1] = y;
        initialPositions[i * 3 + 2] = z;

        // Colors: 50% yellow, 50% purple
        const particleColor = Math.random() < 0.5 ? yellow : purple;
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;

        // Extremely slow speed for professional look
        speeds[i] = 0.02 + Math.random() * 0.08;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.12,
        sizeAttenuation: true,
        transparent: true,
        alphaMap: nodeTexture,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    const particleMesh = new THREE.Points(geometry, material);
    scene.add(particleMesh);

    // --- Line Segments (Constellation Lines) ---
    const maxConnections = 250;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.12, // Very faint, professional
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // --- Interactive Mouse tracking ---
    const mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    };

    window.addEventListener('mousemove', (event) => {
        mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            mouse.targetX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouse.targetY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    });

    // --- Scroll Fade Effect ---
    // Fades background out slightly as user scrolls deep into contents
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        // Fade opacity from 1 down to 0.4 at maximum scroll
        const opacity = 1 - (scrollPercent * 0.6);
        canvas.style.opacity = opacity;
    });

    // --- Window Resize ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        const positionsArr = geometry.attributes.position.array;
        const colorsArr = geometry.attributes.color.array;

        // Smooth mouse movement interpolation
        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;

        // Move and float nodes
        for (let i = 0; i < count; i++) {
            // Constant vertical float (extremely slow)
            positionsArr[i * 3 + 1] += speeds[i] * 0.005;
            
            // Loop nodes back to bottom
            if (positionsArr[i * 3 + 1] > 5.5) {
                positionsArr[i * 3 + 1] = -5.5;
                positionsArr[i * 3] = initialPositions[i * 3];
            }

            // Staggered sine oscillation
            const waveX = Math.sin(elapsedTime * 0.3 + initialPositions[i * 3 + 1]) * 0.001;
            positionsArr[i * 3] += waveX;

            // Mouse displacement
            const particleWorldX = positionsArr[i * 3];
            const particleWorldY = positionsArr[i * 3 + 1];

            const sceneMouseX = mouse.x * 4.5;
            const sceneMouseY = mouse.y * 4.5;

            const dx = particleWorldX - sceneMouseX;
            const dy = particleWorldY - sceneMouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 1.6) {
                const force = (1.6 - dist) * 0.015;
                positionsArr[i * 3] += (dx / dist) * force;
                positionsArr[i * 3 + 1] += (dy / dist) * force;
            } else {
                // Return slowly to baseline
                positionsArr[i * 3] += (initialPositions[i * 3] - positionsArr[i * 3]) * 0.008;
            }
        }
        geometry.attributes.position.needsUpdate = true;

        // Draw connections (Constellations)
        let lineIndex = 0;
        const linePosArr = lineGeometry.attributes.position.array;
        const lineColorArr = lineGeometry.attributes.color.array;

        // Reset lines to 0
        for (let i = 0; i < maxConnections * 2 * 3; i++) {
            linePosArr[i] = 0;
        }

        // Loop through pairs and connect close nodes
        for (let i = 0; i < count; i++) {
            if (lineIndex >= maxConnections) break;

            const px = positionsArr[i * 3];
            const py = positionsArr[i * 3 + 1];
            const pz = positionsArr[i * 3 + 2];

            for (let j = i + 1; j < count; j++) {
                if (lineIndex >= maxConnections) break;

                const qx = positionsArr[j * 3];
                const qy = positionsArr[j * 3 + 1];
                const qz = positionsArr[j * 3 + 2];

                // Calculate distance
                const dx = px - qx;
                const dy = py - qy;
                const dz = pz - qz;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // If close, draw a line segment connecting them
                if (dist < 1.3) {
                    const idx1 = lineIndex * 2 * 3;
                    const idx2 = (lineIndex * 2 + 1) * 3;

                    // Point A coordinates
                    linePosArr[idx1] = px;
                    linePosArr[idx1 + 1] = py;
                    linePosArr[idx1 + 2] = pz;

                    // Point B coordinates
                    linePosArr[idx2] = qx;
                    linePosArr[idx2 + 1] = qy;
                    linePosArr[idx2 + 2] = qz;

                    // Line color matches A color to B color (gradient)
                    lineColorArr[idx1] = colorsArr[i * 3];
                    lineColorArr[idx1 + 1] = colorsArr[i * 3 + 1];
                    lineColorArr[idx1 + 2] = colorsArr[i * 3 + 2];

                    lineColorArr[idx2] = colorsArr[j * 3];
                    lineColorArr[idx2 + 1] = colorsArr[j * 3 + 1];
                    lineColorArr[idx2 + 2] = colorsArr[j * 3 + 2];

                    lineIndex++;
                }
            }
        }
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;

        // Ambient rotation
        particleMesh.rotation.y = elapsedTime * 0.01;
        particleMesh.rotation.x = elapsedTime * 0.005;
        lineSegments.rotation.y = elapsedTime * 0.01;
        lineSegments.rotation.x = elapsedTime * 0.005;

        renderer.render(scene, camera);
    };

    animate();
});
