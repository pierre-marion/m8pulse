import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { useDarkMode } from '../contexts/DarkModeContext';
import './Globe.css';

const Globe = forwardRef(({ onPlayerSelect, selectedPlayer }, ref) => {
  const { isDarkMode } = useDarkMode();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const initialCameraPosition = { x: 0, y: 0, z: -300 };
  const capitalMeshesRef = useRef([]);
  const allPointMeshesRef = useRef([]);
  const selectedPointRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = -300;
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
      { name: 'Madrid', x: 1996.5, y: 561.5 },
      { name: 'Rome', x: 2191.5, y: 546.5 },
      { name: 'Washington DC', x: 1201.5, y: 561.5 },
      { name: 'Manille', x: 3421.5, y: 846.5 },
      { name: 'Varsovie', x: 2311.5, y: 441.5 },
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
      const globeColor = isDarkMode ? 0xffffff : 0x000000;
      const globeMaterial = new THREE.MeshBasicMaterial({
        color: globeColor,
        transparent: true,
        opacity: isDarkMode ? 0.05 : 0.08,
        side: THREE.DoubleSide
      });
      const globeSphere = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globeSphere);

      const response = await fetch('./points.json');
      const data = await response.json();
      const points = data.points;

      const allPointMeshes = [];

      // D'abord, créer les points rouges brillants pour toutes les capitales
      const capitalColor = 0xff0000;
      const normalPointColor = isDarkMode ? 0x626177 : 0x888888;
      
      for (let capital of capitalCoordinates) {
        const pos = convertFlatCoordsToSphereCoords(capital.x, capital.y);
        
        if (pos.x && pos.y && pos.z) {
          const geometry = new THREE.SphereGeometry(0.5, 5, 5);
          const material = new THREE.MeshBasicMaterial({ 
            color: capitalColor,
            emissive: capitalColor,
            emissiveIntensity: 0.5
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.userData = {
            isCapital: true,
            isSpecial: true,
            name: capital.name,
            coordinates: { x: capital.x, y: capital.y },
            originalColor: capitalColor,
            originalScale: 1
          };
          scene.add(mesh);
          allPointMeshes.push(mesh);
          capitalMeshes.push(mesh);
        }
      }

      for (let point of points) {
        const capital = isCapital(point.x, point.y);
        if (capital) continue;

        const pos = convertFlatCoordsToSphereCoords(point.x, point.y);
        
        if (pos.x && pos.y && pos.z) {
          const geometry = new THREE.SphereGeometry(0.5, 5, 5);
          const material = new THREE.MeshBasicMaterial({ 
            color: normalPointColor 
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.userData = {
            isCapital: false,
            isSpecial: false,
            name: '',
            coordinates: { x: point.x, y: point.y },
            originalColor: normalPointColor,
            originalScale: 1
          };
          scene.add(mesh);
          allPointMeshes.push(mesh);
        }
      }
      
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
        
        if (selectedPointRef.current && selectedPointRef.current !== point) {
          selectedPointRef.current.material.color.setHex(selectedPointRef.current.userData.originalColor);
        }
        
        point.material.color.setHex(0xff0000);
        selectedPointRef.current = point;
        
        console.log(`Point cliqué - Coordonnées: x=${point.userData.coordinates.x}, y=${point.userData.coordinates.y}`);
        
        if (point.userData.isCapital && point.userData.name && onPlayerSelect) {
          onPlayerSelect(point.userData.name);
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
  }, [onPlayerSelect, isDarkMode]);

  useEffect(() => {
    if (!selectedPlayer && cameraRef.current && controlsRef.current) {
      const controls = controlsRef.current;
      
      controls.autoRotate = true;
      
      if (selectedPointRef.current) {
        selectedPointRef.current.material.color.setHex(selectedPointRef.current.userData.originalColor);
        selectedPointRef.current = null;
      }
    }
  }, [selectedPlayer]);

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (cameraRef.current && controlsRef.current) {
        const controls = controlsRef.current;
        const camera = cameraRef.current;
        
        controls.autoRotate = true;
        
        if (selectedPointRef.current) {
          selectedPointRef.current.material.color.setHex(selectedPointRef.current.userData.originalColor);
          selectedPointRef.current = null;
        }
        
        gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: -350,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            camera.lookAt(0, 0, 0);
            controls.update();
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
