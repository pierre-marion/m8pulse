import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import './Globe.css';

const GLOBE_RADIUS = 100;
const GLOBE_SIZE = { width: 4098 / 2, height: 1968 / 2 };
const ZOOM_DISTANCE = 150;
const INITIAL_CAMERA_Z = 300;

const CAPITALS = [
  { name: 'Madrid', x: 1996.5, y: 561.5 },
  { name: 'Rome', x: 2191.5, y: 546.5 },
  { name: 'Washington DC', x: 1201.5, y: 561.5 },
  { name: 'Manille', x: 3421.5, y: 846.5 },
  { name: 'Varsovie', x: 2311.5, y: 441.5 },
];

const Globe = forwardRef(({ onPlayerSelect }, ref) => {
  const { isDarkMode } = useDarkMode();
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const capitalMeshesRef = useRef([]);
  const [isZoomed, setIsZoomed] = useState(false);

  const convertToSphereCoords = useCallback((x, y) => {
    const latitude = ((x - GLOBE_SIZE.width) / GLOBE_SIZE.width) * -180 * Math.PI / 180;
    const longitude = ((y - GLOBE_SIZE.height) / GLOBE_SIZE.height) * -90 * Math.PI / 180;
    const radius = Math.cos(longitude) * GLOBE_RADIUS;
    
    return {
      x: Math.cos(latitude) * radius,
      y: Math.sin(longitude) * GLOBE_RADIUS,
      z: Math.sin(latitude) * radius
    };
  }, []);

  const animateCamera = useCallback((targetPos, duration = 1.5, onComplete) => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    gsap.to(cameraRef.current.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration,
      ease: "power2.inOut",
      onUpdate: () => {
        cameraRef.current.lookAt(0, 0, 0);
        controlsRef.current.update();
      },
      onComplete
    });
  }, []);

  const zoomToCity = useCallback((cityName) => {
    const cityPoint = capitalMeshesRef.current.find(m => m.userData.name === cityName);
    if (!cityPoint || !cameraRef.current || !controlsRef.current) return;

    console.log('🎯 Zoom vers:', cityName);
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    
    console.log('Position actuelle:', camera.position.x, camera.position.y, camera.position.z);
    
    controls.autoRotate = false;
    controls.enabled = false;
    
    gsap.killTweensOf(camera.position);
    
    const cityPos = cityPoint.position.clone();
    const direction = cityPos.normalize();
    const targetPos = direction.multiplyScalar(ZOOM_DISTANCE);
    
    console.log('Position cible:', targetPos.x, targetPos.y, targetPos.z);
    
    const startPos = camera.position.clone();
    const distance = startPos.distanceTo(targetPos);
    
    const midHeight = Math.max(startPos.length(), targetPos.length()) + 100;
    const midPos = new THREE.Vector3()
      .addVectors(startPos, targetPos)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(midHeight);

    const path = { t: 0 };
    gsap.to(path, {
      t: 1,
      duration: 2,
      ease: "power2.inOut",
      onStart: () => console.log('🚀 Animation démarrée'),
      onUpdate: () => {
        const t = path.t;
        const t1 = 1 - t;
        
        camera.position.x = t1 * t1 * startPos.x + 2 * t1 * t * midPos.x + t * t * targetPos.x;
        camera.position.y = t1 * t1 * startPos.y + 2 * t1 * t * midPos.y + t * t * targetPos.y;
        camera.position.z = t1 * t1 * startPos.z + 2 * t1 * t * midPos.z + t * t * targetPos.z;
        
        camera.lookAt(0, 0, 0);
      },
      onComplete: () => {
        console.log('✅ Animation terminée');
        controls.enabled = true;
        setIsZoomed(true);
      }
    });

    if (onPlayerSelect) onPlayerSelect(cityName);
  }, [onPlayerSelect]);

  const resetZoom = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    const controls = controlsRef.current;
    const camera = cameraRef.current;
    
    controls.enabled = false;
    setIsZoomed(false);
    
    gsap.killTweensOf(camera.position);
    
    const startPos = camera.position.clone();
    const targetPos = new THREE.Vector3(0, 0, INITIAL_CAMERA_Z);
    
    const midHeight = Math.max(startPos.length(), targetPos.length()) + 100;
    const midPos = new THREE.Vector3()
      .addVectors(startPos, targetPos)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(midHeight);

    const path = { t: 0 };
    gsap.to(path, {
      t: 1,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = path.t;
        const t1 = 1 - t;
        
        camera.position.x = t1 * t1 * startPos.x + 2 * t1 * t * midPos.x + t * t * targetPos.x;
        camera.position.y = t1 * t1 * startPos.y + 2 * t1 * t * midPos.y + t * t * targetPos.y;
        camera.position.z = t1 * t1 * startPos.z + 2 * t1 * t * midPos.z + t * t * targetPos.z;
        
        camera.lookAt(0, 0, 0);
      },
      onComplete: () => {
        controls.autoRotate = true;
        controls.enabled = true;
      }
    });

    if (onPlayerSelect) onPlayerSelect(null);
  }, [onPlayerSelect]);

  useImperativeHandle(ref, () => ({ zoomToCity, resetCamera: resetZoom }), [zoomToCity, resetZoom]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = INITIAL_CAMERA_Z;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, canvas);
    Object.assign(controls, {
      enableDamping: true,
      dampingFactor: 0.05,
      enableZoom: false,
      enablePan: false,
      autoRotate: true,
      autoRotateSpeed: 0.8
    });
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(5, 3, 5);
    scene.add(light);

    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 24, 24);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0xffffff : 0x000000,
      transparent: true,
      opacity: isDarkMode ? 0.05 : 0.08,
      side: THREE.DoubleSide
    });
    scene.add(new THREE.Mesh(globeGeometry, globeMaterial));

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredPoint = null;
    const allMeshes = [];

    const pointColor = isDarkMode ? 0x626177 : 0x888888;
    const capitalColor = 0xff0000;

    fetch('./points.json')
      .then(res => res.json())
      .then(data => {
        CAPITALS.forEach(capital => {
          const pos = convertToSphereCoords(capital.x, capital.y);
          if (!pos.x) return;

          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 8, 8),
            new THREE.MeshBasicMaterial({ color: capitalColor })
          );
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.userData = { name: capital.name, isCapital: true };
          scene.add(mesh);
          allMeshes.push(mesh);
          capitalMeshesRef.current.push(mesh);
        });

        data.points.forEach(point => {
          if (CAPITALS.some(c => c.x === point.x && c.y === point.y)) return;
          
          const pos = convertToSphereCoords(point.x, point.y);
          if (!pos.x) return;

          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 6, 6),
            new THREE.MeshBasicMaterial({ color: pointColor })
          );
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.userData = { isCapital: false };
          scene.add(mesh);
          allMeshes.push(mesh);
        });
      })
      .catch(err => console.error('Erreur chargement points:', err));

    const handleMouse = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(allMeshes);

      if (hoveredPoint) {
        hoveredPoint.scale.setScalar(1);
        canvas.style.cursor = 'default';
        hoveredPoint = null;
      }

      if (intersects.length > 0) {
        hoveredPoint = intersects[0].object;
        hoveredPoint.scale.setScalar(2);
        canvas.style.cursor = 'pointer';
      }
    };

    const handleClick = () => {
      if (hoveredPoint?.userData.isCapital && hoveredPoint.userData.name) {
        zoomToCity(hoveredPoint.userData.name);
      }
    };

    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('click', handleClick);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      controls.dispose();
      capitalMeshesRef.current = [];
    };
  }, [isDarkMode, convertToSphereCoords]);

  return (
    <div className="globe-container">
      <canvas ref={canvasRef}></canvas>
      {isZoomed && (
        <button className="reset-zoom-btn" onClick={resetZoom} title="Retour à la vue globale">
          <span className="reset-icon">↺</span>
          <span className="reset-text">Vue Globale</span>
        </button>
      )}
    </div>
  );
});

export default Globe;
