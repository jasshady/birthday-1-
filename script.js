// Waits for the page to load before running to prevent blank screen
window.addEventListener('load', () => {
    
    // --- 1. Scene Setup ---
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffdde1, 0.002); // Pink fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff6b81, 1);
    pointLight.position.set(10, 10, 20);
    scene.add(pointLight);

    // --- 3. Heart Mesh ---
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const extrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xff0040, 
        shininess: 100, 
        specular: 0x222222 
    });

    const heartMesh = new THREE.Mesh(geometry, material);
    geometry.center();
    heartMesh.rotation.z = Math.PI; 
    heartMesh.rotation.x = Math.PI; 
    scene.add(heartMesh);

    // --- 4. Particles ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xff0040,
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- 5. Controls & Animation ---
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let isPulsing = true;
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);

        if (isPulsing) {
            time += 0.03;
            const scale = 1 + Math.sin(time) * 0.1;
            heartMesh.scale.set(scale, scale, scale);
        }

        heartMesh.rotation.y += 0.005;
        particlesMesh.rotation.y -= 0.002;
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // --- 6. Resize Handling ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- 7. Button Interactions ---
    const music = document.getElementById('bg-music');
    const letterModal = document.getElementById('letter-modal');
    const closeBtn = document.querySelector('.close-btn');

    document.getElementById('music-btn').addEventListener('click', () => {
        if (music.paused) {
            music.play().catch(e => alert("Please click on the page first to enable audio!"));
        } else {
            music.pause();
        }
    });

    document.getElementById('pulse-btn').addEventListener('click', function() {
        isPulsing = !isPulsing;
        this.innerHTML = isPulsing ? "💓 Stop Pulse" : "💓 Start Pulse";
        if (!isPulsing) heartMesh.scale.set(1, 1, 1);
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        controls.reset();
    });

    // This opens the letter modal
    document.getElementById('letter-btn').addEventListener('click', () => {
        letterModal.style.display = 'flex';
    });

    // This closes the letter modal
    closeBtn.addEventListener('click', () => {
        letterModal.style.display = 'none';
    });

    // Closes modal if you click outside the letter box
    window.addEventListener('click', (event) => {
        if (event.target == letterModal) {
            letterModal.style.display = 'none';
        }
    });
});
