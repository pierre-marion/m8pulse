import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { playersData } from '../data/players';
import './Globe.css';

const Globe = forwardRef(({ onPlayerSelect, selectedPlayer }, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const initialCameraPosition = { x: 0, y: 0, z: -265 };
  const capitalMeshesRef = useRef([]);
  const allPointMeshesRef = useRef([]);
  const selectedPointRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = -265;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controlsRef.current = controls;

    const globeRadius = 100;
    const globeWidth = 4098 / 2;
    const globeHeight = 1968 / 2;

const capitalCoordinates = [
    // { name: 'Paris', x: 2086.5, y: 471.5 },
    // { name: 'London', x: 2041.5, y: 441.5 },
    // { name: 'Berlin', x: 2206.5, y: 426.5 },
    { name: 'Madrid', x: 1996.5, y: 561.5 },
    { name: 'Rome', x: 2191.5, y: 546.5 },
    // { name: 'Moscow', x: 2491.5, y: 396.5 },
    // { name: 'Beijing', x: 3346.5, y: 567.5 },
    // { name: 'Tokyo', x: 3646.5, y: 606.5 },
    { name: 'Washington DC', x: 1201.5, y: 561.5 },
    { name: 'Manille', x:3421.5 , y:846.5},
    { name: 'Varsovie', x: 2311.5, y: 441.5 },
    // { name: 'Brasília', x: 1516.5, y: 1191.5 },
    // { name: 'Sydney', x: 3751.5, y: 1416.5 },
];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let capitalMeshes = [];
    let hoveredCapital = null;

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

    function isCapital(x, y) {
      for (let capital of capitalCoordinates) {
        if (capital.x === x && capital.y === y) {
          return capital;
        }
      }
      return null;
    }

    async function addPoints() {
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
      const allPointMeshes = [];

      const pingGeometry = new THREE.SphereGeometry(0.5, 5, 5);
      const pingPositions = pingGeometry.attributes.position.array;
      const pingIndices = pingGeometry.index ? pingGeometry.index.array : null;
      const verticesPerSphere = pingPositions.length / 3;

      let vertexOffset = 0;

      // D'abord, créer les points rouges brillants pour toutes les capitales
      for (let capital of capitalCoordinates) {
        const pos = convertFlatCoordsToSphereCoords(capital.x, capital.y);
        
        if (pos.x && pos.y && pos.z) {
          // Créer un point rouge pour les capitales (même taille que les autres)
          const geometry = new THREE.SphereGeometry(0.5, 5, 5);
          const material = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.userData = {
            isCapital: true,
            isSpecial: true,
            name: capital.name,
            coordinates: { x: capital.x, y: capital.y },
            originalColor: 0xff0000,
            originalScale: 1
          };
          scene.add(mesh);
          allPointMeshes.push(mesh);
          capitalMeshes.push(mesh);
        }
      }

      for (let point of points) {
        // Ne pas créer de point normal si c'est une capitale (déjà créée)
        const capital = isCapital(point.x, point.y);
        if (capital) continue;

        const pos = convertFlatCoordsToSphereCoords(point.x, point.y);
        
        if (pos.x && pos.y && pos.z) {
          // Créer un mesh individuel pour chaque point normal
          const geometry = new THREE.SphereGeometry(0.5, 5, 5);
          const material = new THREE.MeshBasicMaterial({ 
            color: 0x626177 
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.userData = {
            isCapital: false,
            isSpecial: false,
            name: '',
            coordinates: { x: point.x, y: point.y },
            originalColor: 0x626177,
            originalScale: 1
          };
          scene.add(mesh);
          allPointMeshes.push(mesh);
        }
      }
      
      // Stocker capitalMeshes et allPointMeshes dans les refs
      capitalMeshesRef.current = capitalMeshes;
      allPointMeshesRef.current = allPointMeshes;
    }

    addPoints();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    function onMouseMove(event) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(allPointMeshesRef.current);

      if (hoveredCapital && (!intersects.length || intersects[0].object !== hoveredCapital)) {
        hoveredCapital.scale.setScalar(1);
        canvas.style.cursor = 'default';
        hoveredCapital = null;
      }

      if (intersects.length > 0) {
        const point = intersects[0].object;
        point.scale.setScalar(2);
        canvas.style.cursor = 'pointer';
        hoveredCapital = point;
      }
    }

    function onClick(event) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(allPointMeshesRef.current);

      if (intersects.length > 0) {
        const point = intersects[0].object;
        
        // Réinitialiser le point précédemment sélectionné
        if (selectedPointRef.current && selectedPointRef.current !== point) {
          selectedPointRef.current.material.color.setHex(selectedPointRef.current.userData.originalColor);
        }
        
        // Mettre le nouveau point en rouge
        point.material.color.setHex(0xff0000);
        selectedPointRef.current = point;
        
        // Afficher les coordonnées
        console.log(`Point cliqué - Coordonnées: x=${point.userData.coordinates.x}, y=${point.userData.coordinates.y}`);
        
        // Si c'est une capitale, animer vers elle
        if (point.userData.isCapital && point.userData.name) {
          if (ref && typeof ref === 'object' && ref.current) {
            ref.current.animateToCapital(point.userData.name);
          }
        }
      }
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    // Réinitialiser la caméra quand selectedPlayer devient null
    const resetCamera = () => {
      controls.autoRotate = true;
      gsap.to(camera.position, {
        x: initialCameraPosition.x,
        y: initialCameraPosition.y,
        z: initialCameraPosition.z,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
          controls.update();
        }
      });
    };

    function handleResize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, []);

  // Effet pour réinitialiser la caméra quand selectedPlayer devient null
  useEffect(() => {
    if (!selectedPlayer && cameraRef.current && controlsRef.current) {
      const controls = controlsRef.current;
      const camera = cameraRef.current;
      
      controls.autoRotate = true;
      
      // Réinitialiser le point sélectionné
      if (selectedPointRef.current) {
        selectedPointRef.current.material.color.setHex(selectedPointRef.current.userData.originalColor);
        selectedPointRef.current = null;
      }
    }
  }, [selectedPlayer]);

  // Exposer les méthodes animateToCapital et resetCamera via ref
  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (cameraRef.current && controlsRef.current) {
        const controls = controlsRef.current;
        const camera = cameraRef.current;
        
        controls.autoRotate = true;
        
        // Réinitialiser le point sélectionné
        if (selectedPointRef.current) {
          selectedPointRef.current.material.color.setHex(selectedPointRef.current.userData.originalColor);
          selectedPointRef.current = null;
        }
        
        const currentRadius = camera.position.length();
        const currentDir = camera.position.clone().normalize();
        const targetDir = new THREE.Vector3(0, 0, -1);
        
        const steps = 20;
        const keyframes = [];
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const intermediateDir = new THREE.Vector3()
            .copy(currentDir)
            .lerp(targetDir, t)
            .normalize();
          
          const intermediateDistance = currentRadius + (265 - currentRadius) * t;
          const pos = intermediateDir.multiplyScalar(intermediateDistance);
          
          keyframes.push({
            x: pos.x,
            y: pos.y,
            z: pos.z
          });
        }
        
        const timeline = gsap.timeline();
        keyframes.forEach((keyframe, index) => {
          timeline.to(camera.position, {
            x: keyframe.x,
            y: keyframe.y,
            z: keyframe.z,
            duration: 1 / steps,
            ease: index === 0 ? "power2.in" : (index === steps ? "power2.out" : "none"),
            onUpdate: () => {
              camera.lookAt(0, 0, 0);
              controls.update();
            }
          }, index === 0 ? 0 : ">");
        });
      }
    },
    animateToCapital: (cityName) => {
      const capital = capitalMeshesRef.current.find(
        mesh => mesh.userData.name === cityName
      );
      
      if (capital && cameraRef.current && controlsRef.current) {
        const controls = controlsRef.current;
        const camera = cameraRef.current;
        
        // Disable auto-rotation and controls during animation
        controls.autoRotate = false;
        controls.enabled = false;

        // Get the 3D position of the clicked capital
        const targetPosition = capital.position.clone();
        
        // Calculate the direction from origin to the capital
        const distance = 200;
        const direction = targetPosition.clone().normalize();
        
        // Calculate new camera position
        const newCameraPosition = direction.clone().multiplyScalar(distance);
        
        // Calculate current camera spherical position
        const currentRadius = camera.position.length();
        const currentDir = camera.position.clone().normalize();
        
        // Calculate angle between current and target position
        const angle = currentDir.angleTo(direction);
        
        // Create intermediate positions for smooth arc movement
        const steps = 20;
        const keyframes = [];
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          // Slerp between current direction and target direction
          const intermediateDir = new THREE.Vector3()
            .copy(currentDir)
            .lerp(direction, t)
            .normalize();
          
          // Interpolate distance
          const intermediateDistance = currentRadius + (distance - currentRadius) * t;
          
          // Calculate position on the arc
          const pos = intermediateDir.multiplyScalar(intermediateDistance);
          
          keyframes.push({
            x: pos.x,
            y: pos.y,
            z: pos.z
          });
        }
        
        // Animate through keyframes
        const timeline = gsap.timeline();
        keyframes.forEach((keyframe, index) => {
          timeline.to(camera.position, {
            x: keyframe.x,
            y: keyframe.y,
            z: keyframe.z,
            duration: 1 / steps,
            ease: index === 0 ? "power2.in" : (index === steps ? "power2.out" : "none"),
            onUpdate: () => {
              camera.lookAt(0, 0, 0);
              controls.update();
            }
          }, index === 0 ? 0 : ">");
        });
        
        timeline.eventCallback("onComplete", () => {
          controls.enabled = true;
          // Call the callback to update the player profile
          if (onPlayerSelect && playersData[cityName]) {
            onPlayerSelect(playersData[cityName]);
          }
        });
      }
    }
  }));

  return (
    <div className="globe-container" ref={containerRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
});

export default Globe;
