"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Box, Image as ImageIcon, Pause, Play, RotateCcw } from "lucide-react";
import type { Game } from "./catalog";
import { boxFaces } from "./box-faces";

// Same scene as the reference's collection-3d viewer: a lit three.js big box,
// camera fov 38 at z=3, auto-spin with a slow tilt wobble, drag to orbit with inertia, wheel to zoom.
const TILT = .06, START = .22, DISTANCE = 3, LIGHT = 1.13;
type View = { auto: boolean; spin: number; wobble: number; yaw: number; pitch: number; vx: number; vy: number; dragging: boolean; distance: number; last: number };
const fresh = (): View => ({ auto: true, spin: START, wobble: 0, yaw: 0, pitch: 0, vx: 0, vy: 0, dragging: false, distance: DISTANCE, last: 0 });

export default function BoxViewer({ game, title }: { game: Game; title: string }) {
  const { cover } = game;
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<View>(fresh());
  const [auto, setAuto] = useState(true);
  const [flat, setFlat] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element || flat) return;
    let disposed = false, frame = 0, cleanup = () => {};
    void import("three").then(async THREE => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { setFlat(true); return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setClearColor(0, 0);
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
      const key = new THREE.DirectionalLight(0xffffff, 1.75);
      const fill = new THREE.DirectionalLight(0xffffff, .8);
      const radius = Math.hypot(10, 5);
      key.position.set(Math.cos(LIGHT) * radius, 1.5, Math.sin(LIGHT) * radius);
      fill.position.set(-10, -10, -5);
      scene.add(new THREE.AmbientLight(0xffffff, .8), key, fill);
      // the reference's lights, plus soft room reflections on the laminated cardboard
      const [{ RoomEnvironment }, { RoundedBoxGeometry }] = await Promise.all([
        import("three/examples/jsm/environments/RoomEnvironment.js"),
        import("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
      ]);
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
      scene.environmentIntensity = .35;
      const cardboard = new THREE.MeshStandardMaterial({ color: 0x4a3220, roughness: .9 });
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(1.4 / 1.5, 1.4, .3, 4, .014), Array(6).fill(cardboard));
      scene.add(mesh);
      const load = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => { const image = new window.Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = url; });
      const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src === cover ? `${src}?v=ad1996` : src)}&w=640&q=75`;
      void Promise.all([
        load(optimized(cover)),
        game.back ? load(optimized(game.back)).catch(() => null) : null,
        game.spine ? load(optimized(game.spine)).catch(() => null) : null,
      ]).then(([front, back, spine]) => {
        if (disposed) return;
        const max = renderer.capabilities.getMaxAnisotropy();
        mesh.material = boxFaces(front, back, spine, game, title).map(source => {
          const texture = new THREE.Texture(source);
          texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = max; texture.needsUpdate = true;
          return new THREE.MeshPhysicalMaterial({ map: texture, roughness: .52, clearcoat: .55, clearcoatRoughness: .32 });
        });
        setReady(true);
      }).catch(() => setFlat(true));

      const resize = () => {
        const { clientWidth: width, clientHeight: height } = element;
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(1, height);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      resize();

      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const render = (now: number) => {
        frame = requestAnimationFrame(render);
        const v = view.current, dt = v.last ? Math.min(64, now - v.last) : 16;
        v.last = now;
        if (!v.dragging && !v.auto && (Math.abs(v.vx) > 2e-5 || Math.abs(v.vy) > 2e-5)) {
          v.yaw += v.vx * dt; v.pitch = Math.max(-1.52, Math.min(1.52, v.pitch + v.vy * dt));
          const decay = Math.pow(.94, dt / 16); v.vx *= decay; v.vy *= decay;
        }
        if (v.auto) {
          mesh.rotation.y = v.spin; mesh.rotation.x = TILT + Math.sin(v.wobble) * .18;
          if (!reduced) { v.spin = (v.spin + 8e-4 * dt) % (Math.PI * 2); v.wobble += 3e-4 * dt; }
        } else { mesh.rotation.y = v.yaw; mesh.rotation.x = v.pitch; }
        camera.position.set(0, 0, v.distance);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(render);
      cleanup = () => {
        cancelAnimationFrame(frame); observer.disconnect();
        mesh.geometry.dispose();
        (mesh.material as InstanceType<typeof THREE.MeshStandardMaterial>[]).forEach(material => { material.map?.dispose(); material.dispose(); });
        scene.environment?.dispose(); pmrem.dispose();
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { if (!disposed) setFlat(true); });   // 3D code unavailable (offline, flaky network): show the flat cover
    return () => { disposed = true; cleanup(); };
  }, [cover, flat, game, title]);

  // leaving auto-rotate keeps the box exactly where it was, like the reference
  const grab = () => {
    const v = view.current;
    if (v.auto) { v.yaw = v.spin; v.pitch = TILT + Math.sin(v.wobble) * .18; v.auto = false; setAuto(false); }
  };
  const down = (event: React.PointerEvent) => {
    grab(); view.current.dragging = true; view.current.vx = view.current.vy = 0; view.current.last = 0;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };
  const lastMove = useRef(0);
  const move = (event: React.PointerEvent) => {
    const v = view.current;
    if (!v.dragging) return;
    const dx = event.movementX * .01, dy = event.movementY * .01, now = performance.now();
    const dt = lastMove.current ? Math.max(4, Math.min(64, now - lastMove.current)) : 16;
    lastMove.current = now;
    v.yaw += dx; v.pitch = Math.max(-1.52, Math.min(1.52, v.pitch + dy));
    v.vx = v.vx * .45 + dx / dt * .55; v.vy = v.vy * .45 + dy / dt * .55;
  };
  const up = () => { view.current.dragging = false; lastMove.current = 0; };
  const wheel = (event: React.WheelEvent) => { grab(); view.current.distance = Math.max(1.2, Math.min(9, view.current.distance + event.deltaY * .005)); };
  const toggle = () => {
    const v = view.current;
    if (v.auto) grab(); else { v.spin = v.yaw; v.wobble = 0; v.auto = true; setAuto(true); }
  };

  return <div className="box-viewer">
    {flat
      ? <div className="box-flat"><Image src={`${cover}?v=ad1996`} alt={`${title} cover art`} width={400} height={600} sizes="320px" /></div>
      : <div className={`box-stage${ready ? " is-ready" : ""}`} ref={host} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={wheel} role="img" aria-label={`${title} box in 3D, drag to rotate`}>
          {!ready && <div className="box-loading"><span>Loading 3D</span><i /></div>}
        </div>}
    <div className="viewer-controls">
      <button onClick={toggle} aria-label={auto ? "Pause rotation" : "Resume rotation"} disabled={flat}>{auto ? <Pause /> : <Play />}</button>
      <button onClick={() => setFlat(value => !value)} aria-label={flat ? "Show 3D box" : "Show cover art"} aria-pressed={flat}>{flat ? <Box /> : <ImageIcon />}</button>
      <button onClick={() => { view.current = fresh(); setAuto(true); setFlat(false); }} aria-label="Reset view"><RotateCcw /></button>
    </div>
  </div>;
}
