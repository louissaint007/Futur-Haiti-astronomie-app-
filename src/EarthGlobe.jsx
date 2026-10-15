import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function EarthGlobe({ copy, onClose }) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    let renderer;
    let frameId = 0;
    let resizeObserver;
    let earthMaterial;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      mount.innerHTML = '<div class="webgl-error"><strong>Le globe 3D ne peut pas démarrer.</strong><span>Activez l’accélération graphique dans le navigateur, puis réessayez.</span></div>';
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.08, 3.55);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.className = 'earth-globe-canvas';
    renderer.domElement.setAttribute('aria-label', copy.globeCanvas);
    renderer.domElement.tabIndex = 0;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight('#a9d9ff', '#15243a', 1.18));
    const sunlight = new THREE.DirectionalLight('#fff1d6', 3.1);
    sunlight.position.set(-4, 2.4, 4);
    scene.add(sunlight);
    earthMaterial = new THREE.MeshStandardMaterial({ color: '#b8d9f3', roughness: 0.94, metalness: 0.01 });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 72), earthMaterial);
    earth.rotation.z = 0.055;
    scene.add(earth);
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.025, 64, 48),
      new THREE.ShaderMaterial({
        vertexShader: 'varying vec3 vNormal; void main(){ vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: 'varying vec3 vNormal; void main(){ float rim=pow(1.0-max(dot(vNormal,vec3(0.0,0.0,1.0)),0.0),2.7); gl_FragColor=vec4(0.24,0.62,1.0,rim*0.32); }',
        transparent: true, depthWrite: false, side: THREE.BackSide,
      }),
    );
    scene.add(atmosphere);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 1.65;
    controls.maxDistance = 6.2;
    controls.rotateSpeed = 0.72;
    controls.zoomSpeed = 0.8;
    controls.target.set(0, 0, 0);
    controls.update();
    controls.saveState();
    controlsRef.current = controls;

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    new THREE.TextureLoader().load('/nasa/earth-surface-texture.png', texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.wrapS = THREE.RepeatWrapping;
      if (earthMaterial.userData.disposed) {
        texture.dispose();
        return;
      }
      earthMaterial.map = texture;
      earthMaterial.color.set('#ffffff');
      earthMaterial.needsUpdate = true;
    });

    const render = () => {
      frameId = requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();
    mount.querySelector('canvas')?.focus({ preventScroll: true });
    const closeOnEscape = event => { if (event.key === 'Escape') closeRef.current(); };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      controls.dispose();
      controlsRef.current = null;
      scene.traverse(object => {
        object.geometry?.dispose?.();
        if (object.material) {
          object.material.userData.disposed = true;
          object.material.map?.dispose?.();
          object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [copy.globeCanvas]);

  const resetView = () => controlsRef.current?.reset();
  const zoomIn = () => { controlsRef.current?.dollyOut(1.25); controlsRef.current?.update(); };
  const zoomOut = () => { controlsRef.current?.dollyIn(1.25); controlsRef.current?.update(); };

  return <div className="earth-globe-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="earth-globe-dialog" role="dialog" aria-modal="true" aria-labelledby="earth-globe-title">
      <header className="earth-globe-header">
        <div><span className="eyebrow">FUTUR HAITI · {copy.globeMode}</span><h2 id="earth-globe-title">{copy.globeTitle}</h2><p>{copy.globeSubtitle}</p></div>
        <button className="earth-globe-close" onClick={onClose} aria-label={copy.close} autoFocus>×</button>
      </header>
      <div className="earth-globe-stage" ref={mountRef}/>
      <div className="earth-globe-footer">
        <p><span>◉</span>{copy.globeInstructions}</p>
        <div className="earth-globe-controls" role="group" aria-label={copy.globeControls}>
          <button onClick={zoomOut} aria-label={copy.zoomOut} title={copy.zoomOut}>−</button>
          <button onClick={resetView} aria-label={copy.globeReset} title={copy.globeReset}>↺ <span>{copy.globeReset}</span></button>
          <button onClick={zoomIn} aria-label={copy.zoomIn} title={copy.zoomIn}>+</button>
        </div>
      </div>
    </section>
  </div>;
}
