import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Configuration
const canvas = document.getElementById('globe-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Caméra
const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
);
camera.position.z = -265;

// Renderer
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Contrôles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;

// Paramètres du globe basés sur la projection Mercator
const globeRadius = 100;
const globeWidth = 4098 / 2;
const globeHeight = 1968 / 2;

// Coordonnées EXACTES des capitales (à partir du fichier points.json)
const capitalCoordinates = [
    { name: 'Paris', x: 2086.5, y: 471.5 },
    { name: 'London', x: 2041.5, y: 441.5 },
    { name: 'Berlin', x: 2206.5, y: 426.5 },
    { name: 'Madrid', x: 1996.5, y: 561.5 },
    { name: 'Rome', x: 2191.5, y: 546.5 },
    { name: 'Moscow', x: 2491.5, y: 396.5 },
    { name: 'Beijing', x: 3346.5, y: 567.5 },
    { name: 'Tokyo', x: 3646.5, y: 606.5 },
    { name: 'Washington DC', x: 1201.5, y: 561.5 },
    { name: 'Varsovie', x: 2311.5, y: 441.5 },
    { name: 'Brasília', x: 1516.5, y: 1191.5 },
    { name: 'Sydney', x: 3751.5, y: 1416.5 },
    { name: 'Mexico City', x: 796.5, y: 921.5 }
];

// Variables pour l'interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let capitalMeshes = [];
let hoveredCapital = null;

// Conversion des coordonnées 2D vers 3D
function convertFlatCoordsToSphereCoords(x, y) {
    let latitude = ((x - globeWidth) / globeWidth) * -180;
    let longitude = ((y - globeHeight) / globeHeight) * -90;
    latitude = (latitude * Math.PI) / 180;
    longitude = (longitude * Math.PI) / 180;
    const radius = Math.cos(longitude) * globeRadius;

    return {
        x: Math.cos(latitude) * radius,
        y: Math.sin(longitude) * globeRadius,
        z: Math.sin(latitude) * radius
    };
}

// Vérifier si un point est une capitale (correspondance exacte)
function isCapital(x, y) {
    for (let capital of capitalCoordinates) {
        if (capital.x === x && capital.y === y) {
            return capital;
        }
    }
    return null;
}

// Ajouter les points sur le globe (méthode du dépôt GitHub)
async function addPoints() {
    // Ajouter une sphère semi-transparente blanche pour le voile
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide
    });
    const globeSphere = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeSphere);
    
    const response = await fetch('./points.json');
    const data = await response.json();
    const points = data.points;
    
    const mergedGeometry = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];
    
    // Géométrie d'une petite sphère pour chaque point
    const pingGeometry = new THREE.SphereGeometry(0.5, 5, 5);
    const pingPositions = pingGeometry.attributes.position.array;
    const pingIndices = pingGeometry.index ? pingGeometry.index.array : null;
    const verticesPerSphere = pingPositions.length / 3;
    
    let vertexOffset = 0;
    
    // Convertir chaque point 2D en coordonnées 3D
    for (let point of points) {
        const capital = isCapital(point.x, point.y);
        
        // Déterminer la couleur du point
        let pointColor = null;
        let isSpecial = false;
        let pointName = '';
        
        // Points de référence pour le système de coordonnées
        if (point.x === 1.5) {
            pointColor = 0x0000ff; // Bleu pour x = 1.5 (début ouest)
            isSpecial = true;
            pointName = 'X=1.5';
        } else if (point.y === 1.5) {
            pointColor = 0x00ff00; // Vert pour y = 1.5 (début nord)
            isSpecial = true;
            pointName = 'Y=1.5';
        } else if (capital) {
            pointColor = 0xff0000; // Rouge pour les capitales
            isSpecial = true;
            pointName = capital.name;
        }
        
        // Si c'est un point spécial (bleu, vert ou rouge), créer un mesh séparé
        if (isSpecial) {
            const pos = convertFlatCoordsToSphereCoords(point.x, point.y);
            if (pos.x && pos.y && pos.z) {
                const geometry = new THREE.SphereGeometry(0.5, 5, 5);
                const material = new THREE.MeshBasicMaterial({ color: pointColor });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(pos.x, pos.y, pos.z);
                mesh.userData = {
                    isCapital: capital ? true : false,
                    name: pointName,
                    originalScale: 1
                };
                scene.add(mesh);
                if (capital) {
                    capitalMeshes.push(mesh);
                }
            }
        } else {
            // Point normal en gris - ajouté à la géométrie fusionnée
            const pos = convertFlatCoordsToSphereCoords(point.x, point.y);
            
            if (pos.x && pos.y && pos.z) {
                // Ajouter les vertices de la sphère
                for (let i = 0; i < pingPositions.length; i += 3) {
                    positions.push(
                        pingPositions[i] + pos.x,
                        pingPositions[i + 1] + pos.y,
                        pingPositions[i + 2] + pos.z
                    );
                }
                
                // Ajouter les indices
                if (pingIndices) {
                    for (let i = 0; i < pingIndices.length; i++) {
                        indices.push(pingIndices[i] + vertexOffset);
                    }
                }
                
                vertexOffset += verticesPerSphere;
            }
        }
    }
    
    mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    if (indices.length > 0) {
        mergedGeometry.setIndex(indices);
    }
    mergedGeometry.computeVertexNormals();
    
    const material = new THREE.MeshBasicMaterial({
        color: '#626177'
    });
    
    const globePoints = new THREE.Mesh(mergedGeometry, material);
    scene.add(globePoints);
}

// Initialiser le globe
addPoints();

// Gestion des événements de souris
function onMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(capitalMeshes);
    
    // Réinitialiser la capitale précédemment survolée
    if (hoveredCapital && (!intersects.length || intersects[0].object !== hoveredCapital)) {
        hoveredCapital.scale.setScalar(1);
        canvas.style.cursor = 'default';
        hoveredCapital = null;
    }
    
    // Agrandir la capitale survolée
    if (intersects.length > 0) {
        const capital = intersects[0].object;
        if (capital.userData.isCapital) {
            capital.scale.setScalar(2);
            canvas.style.cursor = 'pointer';
            hoveredCapital = capital;
        }
    }
}

function onClick(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(capitalMeshes);
    
    if (intersects.length > 0) {
        const capital = intersects[0].object;
        if (capital.userData.isCapital) {
            console.log(`Capitale cliquée: ${capital.userData.name}`);
            alert(capital.userData.name);
        }
    }
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('click', onClick);

// Éclairage
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    renderer.render(scene, camera);
}

// Gestion du redimensionnement
function handleResize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
}

window.addEventListener('resize', handleResize);

// Observer pour détecter les changements de taille du canvas
const resizeObserver = new ResizeObserver(handleResize);
resizeObserver.observe(canvas);

// Démarrer l'animation
animate();
