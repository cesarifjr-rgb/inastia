import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export type SceneMessage =
  | {
      type: "init";
      canvas: OffscreenCanvas;
      width: number;
      height: number;
      pixelRatio: number;
      compact: boolean;
      active: boolean;
      url: string;
    }
  | { type: "resize"; width: number; height: number; compact: boolean }
  | { type: "active"; active: boolean }
  | { type: "pointer"; x: number; y: number }
  | { type: "dispose" };
export type SceneReply =
  { type: "frame"; frame: number } | { type: "fallback" };

function initialize(
  initial: Extract<SceneMessage, { type: "init" }>,
): (message: SceneMessage) => void {
  const canvas = initial.canvas;
  const context = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  if (!context) throw new Error("WebGL unavailable");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(0xf8f3e9, 0);
  renderer.setPixelRatio(Math.min(initial.pixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const model = new THREE.Group();
  scene.add(model);
  const camera = new THREE.OrthographicCamera(-7, 7, 6, -6, 0.1, 60);
  camera.position.set(4, 2.8, 18);
  camera.lookAt(0, 0.8, 0);
  scene.add(new THREE.HemisphereLight(0xdceef4, 0xd6c6a3, 2.4));
  const sun = new THREE.DirectionalLight(0xfffbef, 3.4);
  sun.position.set(-5, 7, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -8,
    right: 8,
    top: 8,
    bottom: -8,
    near: 0.5,
    far: 30,
  });
  sun.shadow.normalBias = 0.035;
  sun.shadow.bias = -0.0003;
  sun.shadow.radius = 3;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xe5f4ff, 1.3);
  rim.position.set(5, 3, 7);
  scene.add(rim);

  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();
  const textures = new Set<THREE.Texture>();
  const controller = new AbortController();
  let loaded = false;
  const loadTimeout = globalThis.setTimeout(() => controller.abort(), 25000);

  let active = initial.active;
  let compact = initial.compact;
  let disposed = false;
  let raf = 0;
  let last = 0;
  let time = 0;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let width = initial.width;
  let height = initial.height;
  function moving(): boolean {
    return loaded && active && !disposed;
  }
  function render(): void {
    if (disposed || !loaded) return;
    try {
      renderer.render(scene, camera);
      globalThis.postMessage({
        type: "frame",
        frame: ++frame,
      } satisfies SceneReply);
    } catch {
      fallback();
    }
  }
  function tick(now: number): void {
    raf = 0;
    if (!moving()) return;
    if (compact && last && now - last < 1000 / 30 - 1) {
      raf = globalThis.requestAnimationFrame(tick);
      return;
    }
    time += last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    model.rotation.y = Math.sin(time * 0.19) * 0.14 + pointerX * 0.035;
    model.rotation.x = pointerY * 0.015;
    model.position.y = Math.sin(time * 0.68) * 0.065;
    render();
    if (moving()) raf = globalThis.requestAnimationFrame(tick);
  }
  function sync(): void {
    if (raf) globalThis.cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    if (moving()) raf = globalThis.requestAnimationFrame(tick);
  }
  function resize(): void {
    if (disposed || width < 1 || height < 1) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const span = Math.max(4.25, 5.25 / aspect);
    camera.left = -span * aspect;
    camera.right = span * aspect;
    camera.top = span;
    camera.bottom = -span;
    camera.updateProjectionMatrix();
    render();
  }
  function dispose(): void {
    if (disposed) return;
    disposed = true;
    controller.abort();
    globalThis.clearTimeout(loadTimeout);
    if (raf) globalThis.cancelAnimationFrame(raf);
    canvas.removeEventListener("webglcontextlost", contextLost);
    geometries.forEach((value) => value.dispose());
    materials.forEach((value) => value.dispose());
    textures.forEach((value) => value.dispose());
    renderer.dispose();
  }
  function fallback(): void {
    dispose();
    globalThis.postMessage({ type: "fallback" } satisfies SceneReply);
  }
  function contextLost(event: Event): void {
    event.preventDefault();
    fallback();
  }
  canvas.addEventListener("webglcontextlost", contextLost);
  resize();
  // Download, glTF parsing, shader compilation and every frame run off the UI thread.
  void (async () => {
    try {
      const response = await fetch(initial.url, { signal: controller.signal });
      if (!response.ok) throw new Error("Villa unavailable");
      const bytes = await response.arrayBuffer();
      const asset = await new GLTFLoader().parseAsync(
        bytes,
        new URL(".", initial.url).href,
      );
      asset.scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        for (const mat of Array.isArray(object.material)
          ? object.material
          : [object.material]) {
          materials.add(mat);
          for (const value of Object.values(mat))
            if (value instanceof THREE.Texture) textures.add(value);
        }
        object.castShadow = true;
        object.receiveShadow = true;
      });
      if (disposed) {
        geometries.forEach((value) => value.dispose());
        materials.forEach((value) => value.dispose());
        textures.forEach((value) => value.dispose());
        return;
      }
      model.add(asset.scene);
      await renderer.compileAsync(scene, camera);
      if (disposed) return;
      loaded = true;
      globalThis.clearTimeout(loadTimeout);
      resize();
      sync();
    } catch {
      if (!disposed) fallback();
    }
  })();
  return (message) => {
    if (disposed) return;
    if (message.type === "active") {
      active = message.active;
      sync();
    }
    if (message.type === "resize") {
      width = message.width;
      height = message.height;
      compact = message.compact;
      resize();
    }
    if (message.type === "pointer") {
      pointerX = message.x;
      pointerY = message.y;
    }
    if (message.type === "dispose") dispose();
  };
}

let dispatch: ((message: SceneMessage) => void) | undefined;
globalThis.addEventListener("message", (event: MessageEvent<SceneMessage>) => {
  try {
    if (event.data.type === "init" && !dispatch)
      dispatch = initialize(event.data);
    else dispatch?.(event.data);
  } catch {
    globalThis.postMessage({ type: "fallback" } satisfies SceneReply);
  }
});
