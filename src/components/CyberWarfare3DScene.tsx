import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { 
  Shield, 
  Eye, 
  Layers, 
  Compass, 
  Radio, 
  Crosshair, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Satellite, 
  ChevronUp, 
  ChevronDown,
  Info,
  CheckCircle2
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface TargetBlip3D {
  id: string;
  code: string;
  title: string;
  domain: string;
  position: [number, number, number];
  color: number;
  threatLevel: string;
}

interface CyberWarfare3DSceneProps {
  onSelectTarget?: (targetId: string) => void;
  onRequestExecution?: (targetId: string) => void;
}

export const CyberWarfare3DScene: React.FC<CyberWarfare3DSceneProps> = ({
  onSelectTarget,
  onRequestExecution
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedTarget, setSelectedTarget] = useState<TargetBlip3D | null>(null);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'NUSANTARA' | 'NATUNA' | 'SUNDA' | 'JAWA' | 'ORBIT'>('NUSANTARA');
  const [showSKKLCables, setShowSKKLCables] = useState(true);
  const [showGarudaDome, setShowGarudaDome] = useState(true);
  const [showSatellites, setShowSatellites] = useState(true);
  const [activeSpeed, setActiveSpeed] = useState<number>(1);

  // Targets in 3D space
  const TARGETS: TargetBlip3D[] = [
    {
      id: 'THREAT-03',
      code: 'THREAT 03',
      title: 'BALLISTIC MISSILE TRACK',
      domain: 'PERTAHANAN UDARA',
      position: [0.8, 1.2, -1.8], // Natuna
      color: 0xf43f5e,
      threatLevel: 'KRITIS'
    },
    {
      id: 'THREAT-02',
      code: 'THREAT 02',
      title: 'HOSTILE DRONE SWARM',
      domain: 'PERTAHANAN UDARA',
      position: [-1.4, 0.4, 1.2], // South of Java
      color: 0xf59e0b,
      threatLevel: 'TINGGI'
    },
    {
      id: 'VTS-SUNDA',
      code: 'CYBER-01',
      title: 'AIS SPOOFING & VTS JAMMING',
      domain: 'PERTAHANAN SIBER',
      position: [-3.2, 0.2, 0.4], // Sunda Strait
      color: 0x06b6d4,
      threatLevel: 'KRITIS'
    },
    {
      id: 'HOTSPOT-OKI',
      code: 'HOTSPOT-01',
      title: 'KLASTER GAMBUT OKI (112.5 MW)',
      domain: 'MONITORING KARHUTLA',
      position: [-3.6, 0.1, -0.6], // South Sumatra
      color: 0xef4444,
      threatLevel: 'TINGGI'
    },
    {
      id: 'IUU-DARK-711',
      code: 'IUU-DARK-01',
      title: 'PAIR-TRAWLER TANPA AIS',
      domain: 'IUU FISHING / ZEE',
      position: [1.6, 0.1, -2.4], // Natuna North ZEE
      color: 0x10b981,
      threatLevel: 'SEDANG'
    }
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL guard as instructed in threejs skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040812);
    scene.fog = new THREE.FogExp2(0x040812, 0.045);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 14);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Mandatory Procedural Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting Rig (Key, Fill, Rim)
    const keyLight = new THREE.DirectionalLight(0xfff3d6, 2.5);
    keyLight.position.set(8, 16, 10);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x020617, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    rimLight.position.set(-10, 6, -10);
    scene.add(rimLight);

    // 1. PROCEDURAL OCEAN GRID & HORIZON BASE
    const gridHelper = new THREE.GridHelper(32, 48, 0x1e3a8a, 0x0f224a);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Contact shadow / floor plane
    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.85,
      metalness: 0.1
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.06;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    // 2. PROCEDURAL INDONESIAN ARCHIPELAGO ISLANDS (Composite 3-12 parts)
    const archipelagoGroup = new THREE.Group();
    scene.add(archipelagoGroup);

    // Major Island Definitions [x, z, scaleX, scaleZ, label]
    const ISLAND_COORDS = [
      { name: 'Sumatera', x: -4.5, z: 0.2, sx: 2.2, sz: 3.8, rot: 0.58 },
      { name: 'Jawa', x: -1.2, z: 2.2, sx: 3.2, sz: 0.8, rot: -0.1 },
      { name: 'Kalimantan', x: -0.8, z: -0.8, sx: 2.6, sz: 2.4, rot: 0.05 },
      { name: 'Sulawesi', x: 2.0, z: -0.2, sx: 1.8, sz: 2.2, rot: -0.2 },
      { name: 'Nusa Tenggara', x: 1.6, z: 2.4, sx: 2.4, sz: 0.5, rot: 0.0 },
      { name: 'Maluku', x: 4.2, z: 0.2, sx: 1.5, sz: 2.0, rot: 0.2 },
      { name: 'Papua', x: 6.8, z: 1.0, sx: 3.4, sz: 2.2, rot: 0.12 },
      { name: 'Kepulauan Natuna', x: -0.6, z: -2.6, sx: 0.8, sz: 0.8, rot: 0.3 }
    ];

    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x0f2a4a,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: false
    });

    const islandEdgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 1.5
    });

    ISLAND_COORDS.forEach((isl) => {
      const geo = new THREE.CylinderGeometry(isl.sx * 0.5, isl.sx * 0.55, 0.18, 12);
      const mesh = new THREE.Mesh(geo, islandMat);
      mesh.scale.set(1, 1, isl.sz / isl.sx);
      mesh.rotation.y = isl.rot;
      mesh.position.set(isl.x, 0.09, isl.z);
      mesh.castShadow = !isSoftwareGl;
      mesh.receiveShadow = !isSoftwareGl;
      archipelagoGroup.add(mesh);

      // Glowing coastline rim
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeLines = new THREE.LineSegments(edgeGeo, islandEdgeMat);
      edgeLines.scale.copy(mesh.scale);
      edgeLines.rotation.y = isl.rot;
      edgeLines.position.copy(mesh.position);
      archipelagoGroup.add(edgeLines);
    });

    // 3. SUBMARINE OPTICAL FIBER CABLES (SKKL) & TACTICAL MICROWAVE ARCS
    const cablesGroup = new THREE.Group();
    scene.add(cablesGroup);

    const CABLE_NODES: [number, number, number][] = [
      [-4.5, 0.15, 0.2],   // Medan / Sumatra
      [-3.2, 0.15, 0.6],   // Palembang / Sunda
      [-1.8, 0.15, 2.1],   // Jakarta
      [-0.8, 0.15, 2.3],   // Surabaya
      [-0.6, 0.15, -2.6],  // Natuna Ranai
      [-0.6, 0.15, -0.6],  // Balikpapan (IKN)
      [2.0, 0.15, 0.8],    // Makassar
      [6.8, 0.15, 0.8]     // Jayapura
    ];

    const CABLE_LINKS = [
      [0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [2, 5], [3, 6], [5, 6], [6, 7]
    ];

    CABLE_LINKS.forEach(([startIdx, endIdx]) => {
      const p1 = new THREE.Vector3(...CABLE_NODES[startIdx]);
      const p2 = new THREE.Vector3(...CABLE_NODES[endIdx]);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += p1.distanceTo(p2) * 0.22; // Elevate in 3D arc

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.025, 6, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0891b2,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.9
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      cablesGroup.add(tubeMesh);
    });

    // 4. PROCEDURAL HOLOGRAPHIC GARUDA DOME SHIELD
    const domeGeo = new THREE.SphereGeometry(11, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.9
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.set(0.5, 0, 0);
    scene.add(domeMesh);

    // 5. PROCEDURAL 3D LEO SATELLITE (Composite 6 distinct parts)
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    // Part 1: Main Bus Body (Cuboid)
    const satBodyGeo = new THREE.BoxGeometry(0.35, 0.35, 0.6);
    const satBodyMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15
    });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satelliteGroup.add(satBody);

    // Part 2 & 3: Solar Panels Left & Right (Gold Foil)
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25
    });
    const panelGeo = new THREE.BoxGeometry(0.9, 0.02, 0.45);
    const panelL = new THREE.Mesh(panelGeo, solarMat);
    panelL.position.set(-0.65, 0, 0);
    satelliteGroup.add(panelL);

    const panelR = new THREE.Mesh(panelGeo, solarMat);
    panelR.position.set(0.65, 0, 0);
    satelliteGroup.add(panelR);

    // Part 4: Optical Earth Aperture (Cylinder)
    const satApertureGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.2, 16);
    const satApertureMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1
    });
    const satAperture = new THREE.Mesh(satApertureGeo, satApertureMat);
    satAperture.rotation.x = Math.PI / 2;
    satAperture.position.set(0, -0.22, 0);
    satelliteGroup.add(satAperture);

    // Part 5: Communications Dish (Lathe / Cone)
    const dishGeo = new THREE.ConeGeometry(0.18, 0.1, 16, 1, true);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.2
    });
    const dishMesh = new THREE.Mesh(dishGeo, dishMat);
    dishMesh.position.set(0, 0.24, 0.15);
    dishMesh.rotation.x = -Math.PI / 4;
    satelliteGroup.add(dishMesh);

    // Part 6: Ground Downlink Cone Beam
    const beamGeo = new THREE.ConeGeometry(2.5, 7, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      wireframe: true
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0, -3.5, 0);
    beamMesh.rotation.x = Math.PI;
    satelliteGroup.add(beamMesh);

    satelliteGroup.position.set(2, 7.5, -1);

    // 6. PROCEDURAL COASTAL RADAR STATION AT RANAI NATUNA (Composite 5 parts)
    const radarGroup = new THREE.Group();
    radarGroup.position.set(-0.6, 0.15, -2.6);
    scene.add(radarGroup);

    // Bunker base
    const bunkerGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 6);
    const bunkerMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.3 });
    const bunker = new THREE.Mesh(bunkerGeo, bunkerMat);
    bunker.position.y = 0.075;
    radarGroup.add(bunker);

    // Lattice Mast
    const mastGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.5, 4);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.y = 0.4;
    radarGroup.add(mast);

    // Rotating Radar Head
    const radarHeadGroup = new THREE.Group();
    radarHeadGroup.position.y = 0.65;
    radarGroup.add(radarHeadGroup);

    const dishCurvedGeo = new THREE.BoxGeometry(0.4, 0.18, 0.05);
    const dishHeadMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.9 });
    const radarDishMesh = new THREE.Mesh(dishCurvedGeo, dishHeadMat);
    radarHeadGroup.add(radarDishMesh);

    // 7. TARGET MARKER MESHES & BILLBOARDS
    const targetMeshes: { mesh: THREE.Mesh; target: TargetBlip3D }[] = [];
    const markerGeo = new THREE.OctahedronGeometry(0.18, 0);

    TARGETS.forEach((target) => {
      const markerMat = new THREE.MeshStandardMaterial({
        color: target.color,
        emissive: target.color,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.set(...target.position);
      markerMesh.userData = { targetId: target.id };
      scene.add(markerMesh);
      targetMeshes.push({ mesh: markerMesh, target });

      // Ground projection stem
      const stemGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(target.position[0], 0.1, target.position[2]),
        new THREE.Vector3(...target.position)
      ]);
      const stemMat = new THREE.LineDashedMaterial({
        color: target.color,
        dashSize: 0.1,
        gapSize: 0.05
      });
      const stem = new THREE.Line(stemGeo, stemMat);
      stem.computeLineDistances();
      scene.add(stem);
    });

    // Raycaster for interactive clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = targetMeshes.map((t) => t.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitTargetId = intersects[0].object.userData.targetId;
        const matched = TARGETS.find((t) => t.id === hitTargetId);
        if (matched) {
          tacticalAudio.playRadarPing();
          setSelectedTarget(matched);
          if (onSelectTarget) onSelectTarget(matched.id);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Target camera positions for smooth damping transitions
    const targetCameraPos = new THREE.Vector3(0, 10, 14);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    // Manual orbit drag state
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0.4;
    let sphericalPhi = 0.8;
    let sphericalRadius = 16;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = (e.clientX - prevMouseX) * 0.005;
      const deltaY = (e.clientY - prevMouseY) * 0.005;
      sphericalTheta -= deltaX;
      sphericalPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, sphericalPhi - deltaY));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetCameraPos.x = sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      targetCameraPos.y = sphericalRadius * Math.cos(sphericalPhi);
      targetCameraPos.z = sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      sphericalRadius = Math.max(6, Math.min(28, sphericalRadius + e.deltaY * 0.01));
      targetCameraPos.x = sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      targetCameraPos.y = sphericalRadius * Math.cos(sphericalPhi);
      targetCameraPos.z = sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: true });

    // Animation loop with delta time & software WebGL pacing
    let frameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function animate() {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime() * activeSpeed;

      // 1. Rotate Satellite in Orbit
      const orbitRadius = 8.5;
      satelliteGroup.position.x = Math.cos(time * 0.3) * orbitRadius;
      satelliteGroup.position.z = Math.sin(time * 0.3) * orbitRadius * 0.65;
      satelliteGroup.rotation.y = time * 0.2;

      // 2. Rotate Radar Antenna
      radarHeadGroup.rotation.y = time * 1.8;

      // 3. Bobbing Target Octahedrons
      targetMeshes.forEach(({ mesh, target }, index) => {
        mesh.rotation.y = time * 1.5 + index;
        mesh.rotation.x = Math.sin(time * 2 + index) * 0.3;
        mesh.position.y = target.position[1] + Math.sin(time * 3 + index) * 0.08;
      });

      // 4. Subtle Garuda Dome rotation
      domeMesh.rotation.y = time * 0.05;

      // 5. Silky smooth camera damping
      camera.position.lerp(targetCameraPos, delta * 3.5);
      currentLookAt.lerp(targetLookAt, delta * 3.5);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    }

    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);

      // Cleanup
      scene.clear();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [activeSpeed]);

  // Handle Preset Switching
  const handleApplyPreset = (preset: 'NUSANTARA' | 'NATUNA' | 'SUNDA' | 'JAWA' | 'ORBIT') => {
    tacticalAudio.playTacticalClick();
    setCameraPreset(preset);
  };

  return (
    <div className="relative w-full h-[640px] lg:h-[720px] rounded-xl overflow-hidden border border-[#14263e] bg-[#040812] shadow-2xl flex flex-col font-sans select-none">
      
      {/* 3D WEBGL CANVAS ISOLATED MOUNT REF */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* TOP-LEFT MINIMAL SPEC BADGE (Zero Center Occlusion) */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1 font-mono text-xs">
        <div className="flex items-center gap-2 bg-[#07101e]/90 border border-cyan-500/40 px-3 py-1.5 rounded-lg shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-bold uppercase tracking-wider">
            3D NUSANTARA C4ISR HOLOGRAPHIC DOME
          </span>
          <span className="text-slate-400 text-[10px]">THREE.JS PBR r182</span>
        </div>
        <div className="text-[11px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 w-fit">
          DRAG UNTUK ROTASI · SCROLL UNTUK ZOOM · KLIK TARGET 3D UNTUK INSPEKSI
        </div>
      </div>

      {/* TOP-RIGHT SELECTED TARGET INSPECTOR OVERLAY */}
      {selectedTarget && (
        <div className="absolute top-3 right-3 z-20 bg-[#07111e]/95 border-2 border-amber-500/80 rounded-xl p-3.5 shadow-2xl max-w-sm w-full font-mono text-xs animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-rose-500" />
              SASARAN 3D TERKUNCI: {selectedTarget.code}
            </span>
            <button
              onClick={() => setSelectedTarget(null)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="py-2.5 space-y-2">
            <div>
              <span className="text-slate-500 text-[10px] block">NAMA ANCAMAN</span>
              <span className="text-white font-bold text-sm">{selectedTarget.title}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">DOMAIN</span>
                <span className="text-cyan-400 font-semibold">{selectedTarget.domain}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">TINGKAT ANCAMAN</span>
                <span className="text-rose-400 font-bold">{selectedTarget.threatLevel}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">KOORDINAT 3D VEKTOR</span>
              <span className="text-slate-300 text-[11px]">
                X: {selectedTarget.position[0]} · Y: {selectedTarget.position[1]} · Z: {selectedTarget.position[2]}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                tacticalAudio.playDispatchConfirm();
                if (onRequestExecution) onRequestExecution(selectedTarget.id);
              }}
              className="flex-1 py-2 px-3 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-center transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>OTORISASI INTERDIKSI</span>
            </button>
          </div>
        </div>
      )}

      {/* ERGONOMIC UNIFIED BOTTOM CONTROL DOCK (Zero Center Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-all duration-300">
        
        {/* Collapse / Expand Toggle Button */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setIsControlsCollapsed(!isControlsCollapsed);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#07111e]/90 border-t border-x border-[#1a2d47] text-slate-400 hover:text-amber-400 font-mono text-[11px] font-bold shadow-lg transition-colors cursor-pointer"
          >
            {isControlsCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            <span>{isControlsCollapsed ? 'TAMPILKAN PANEL KONTROL 3D' : 'SEMBUNYIKAN (CINEMA MODE)'}</span>
          </button>
        </div>

        {/* The Sleek Horizontal Glassmorphic Control Dock */}
        {!isControlsCollapsed && (
          <div className="bg-[#07111e]/95 border border-[#1a2d47] rounded-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-slate-300">
            
            {/* Sector / Camera Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <span className="text-slate-500 text-[10px] font-bold mr-1">KAMERA:</span>
              {(['NUSANTARA', 'NATUNA', 'SUNDA', 'JAWA', 'ORBIT'] as const).map((cam) => (
                <button
                  key={cam}
                  onClick={() => handleApplyPreset(cam)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    cameraPreset === cam
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cam}
                </button>
              ))}
            </div>

            {/* Visual Layer Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setShowSKKLCables(!showSKKLCables);
                }}
                className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                  showSKKLCables
                    ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300'
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                KABEL SKKL
              </button>

              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setShowGarudaDome(!showGarudaDome);
                }}
                className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                  showGarudaDome
                    ? 'border-blue-500/50 bg-blue-950/40 text-blue-300'
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                DOME PERISAI
              </button>

              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setShowSatellites(!showSatellites);
                }}
                className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                  showSatellites
                    ? 'border-amber-500/50 bg-amber-950/40 text-amber-300'
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                SATELIT LEO
              </button>
            </div>

            {/* Speed Multiplier */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 text-[10px]">KECEPATAN:</span>
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    setActiveSpeed(spd);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeSpeed === spd
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
