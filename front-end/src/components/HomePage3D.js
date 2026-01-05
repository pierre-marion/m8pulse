import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import './HomePage3D.css';

const HomePage3D = () => {
    const canvasRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1f);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x667eea,
            emissive: 0x667eea,
            emissiveIntensity: 0.3,
            shininess: 100,
            specular: 0x764ba2
        });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 200);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x764ba2, 150);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        const animate = () => {
            requestAnimationFrame(animate);

            torusKnot.rotation.x += 0.005;
            torusKnot.rotation.y += 0.008;

            particlesMesh.rotation.y += 0.0005;

            renderer.render(scene, camera);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        animate();
        setIsLoaded(true);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
        };
    }, []);

    return (
        <div className="homepage-3d">
            <canvas ref={canvasRef} className={`webgl-canvas ${isLoaded ? 'loaded' : ''}`} />
            
            <div className="homepage-overlay">
                <div className="homepage-content">
                    <h1 className="homepage-title">M8PULSE</h1>
                    <p className="homepage-subtitle">
                        Plateforme de narration interactive et de visualisation de données esports
                    </p>
                    <div className="homepage-features">
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Visualisations Dynamiques</h3>
                            <p>Créez des graphiques interactifs à partir de vos données CSV</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✍️</div>
                            <h3>Articles Personnalisés</h3>
                            <p>Rédigez des data-stories avec des blocs riches</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎨</div>
                            <h3>Thèmes Sur Mesure</h3>
                            <p>Personnalisez l'apparence de vos articles et pages</p>
                        </div>
                    </div>
                    <button className="cta-button" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                        Explorer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage3D;
