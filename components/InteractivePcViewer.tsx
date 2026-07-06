"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

type PartKey =
  | "processors"
  | "graphics-cards"
  | "motherboards"
  | "memory"
  | "storage"
  | "power-supply"
  | "cabinets";

interface PcPart {
  key: PartKey;
  label: string;
  description: string;
  color: string;
  href: string;
}

const PC_PARTS: PcPart[] = [
  {
    key: "processors",
    label: "Processor (CPU)",
    description: "Click to view all available processors in the catalog.",
    color: "#00AFB9",
    href: "/categories/processors",
  },
  {
    key: "motherboards",
    label: "Motherboard",
    description: "ATX and mATX boards with M.2 slots, RAM support, and expansion ports.",
    color: "#F97316",
    href: "/categories/motherboards",
  },
  {
    key: "memory",
    label: "RAM (Memory)",
    description: "DDR4 and DDR5 memory options for office and gaming builds.",
    color: "#A855F7",
    href: "/categories/memory",
  },
  {
    key: "graphics-cards",
    label: "Graphics Card (GPU)",
    description: "Browse available NVIDIA and AMD graphics card options.",
    color: "#EF4444",
    href: "/categories/graphics-cards",
  },
  {
    key: "storage",
    label: "Storage (SSD/HDD)",
    description: "SSD, NVMe, and hard drive storage options.",
    color: "#14B8A6",
    href: "/categories/storage",
  },
  {
    key: "power-supply",
    label: "Power Supply (PSU)",
    description: "SMPS and power supplies for stable PC builds.",
    color: "#EAB308",
    href: "/categories/power-supply",
  },
  {
    key: "cabinets",
    label: "Cabinet / Case",
    description: "PC cabinets, airflow cases, and build enclosures.",
    color: "#3B82F6",
    href: "/categories/cabinets",
  },
];

const partByKey = Object.fromEntries(PC_PARTS.map((part) => [part.key, part])) as Record<
  PartKey,
  PcPart
>;

function makeCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function makePcbTexture() {
  const texture = makeCanvasTexture(512, 512, (ctx, width, height) => {
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);

    for (let index = 0; index < 150; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = 20 + Math.random() * 90;
      ctx.strokeStyle = `rgba(245, 158, 11, ${0.28 + Math.random() * 0.28})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + length * (Math.random() > 0.5 ? 1 : -1), y);
      ctx.lineTo(x + length * (Math.random() - 0.5), y + length * (Math.random() - 0.5));
      ctx.stroke();
    }

    for (let index = 0; index < 80; index += 1) {
      ctx.fillStyle = "rgba(229, 231, 235, 0.35)";
      ctx.fillRect(Math.random() * width, Math.random() * height, 12 + Math.random() * 26, 2);
    }
  });
  texture.repeat.set(2, 2);
  return texture;
}

function makeBrushedTexture(base: string, stroke: string) {
  const texture = makeCanvasTexture(256, 256, (ctx, width, height) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 900; index += 1) {
      ctx.globalAlpha = 0.08 + Math.random() * 0.12;
      ctx.strokeStyle = stroke;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + (Math.random() - 0.5) * 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
  texture.repeat.set(2, 2);
  return texture;
}

function makeLabelTexture(title: string, subtitle: string, color: string) {
  return makeCanvasTexture(512, 256, (ctx, width, height) => {
    ctx.fillStyle = "#070B12";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.strokeRect(14, 14, width - 28, height - 28);
    ctx.fillStyle = "#F8FAFC";
    ctx.font = "700 82px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, width / 2, height / 2 - 18);
    ctx.fillStyle = color;
    ctx.font = "700 34px Arial";
    ctx.fillText(subtitle, width / 2, height / 2 + 58);
  });
}

export function InteractivePcViewer() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [hoveredPart, setHoveredPart] = useState<PcPart | null>(null);
  const [selectedPart, setSelectedPart] = useState<PcPart>(partByKey.processors);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const container = host;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");

    const camera = new THREE.PerspectiveCamera(
      42,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const interactiveMeshes: THREE.Mesh[] = [];
    const spinningMeshes: THREE.Object3D[] = [];

    const pcbTexture = makePcbTexture();
    const brushedDark = makeBrushedTexture("#1F2937", "#64748B");
    const brushedBlack = makeBrushedTexture("#0F172A", "#334155");

    const materials = {
      frame: new THREE.MeshStandardMaterial({
        map: brushedBlack,
        color: "#1E293B",
        roughness: 0.42,
        metalness: 0.75,
      }),
      pcb: new THREE.MeshStandardMaterial({
        map: pcbTexture,
        roughness: 0.76,
        metalness: 0.18,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#93C5FD",
        transparent: true,
        opacity: 0.18,
        roughness: 0.04,
        metalness: 0,
        transmission: 0.55,
        thickness: 0.2,
        side: THREE.DoubleSide,
      }),
      metal: new THREE.MeshStandardMaterial({
        map: brushedDark,
        color: "#475569",
        roughness: 0.28,
        metalness: 0.85,
      }),
      black: new THREE.MeshStandardMaterial({
        color: "#0B1020",
        roughness: 0.45,
        metalness: 0.35,
      }),
      gpu: new THREE.MeshStandardMaterial({
        color: "#111827",
        roughness: 0.34,
        metalness: 0.7,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: "#D6A329",
        roughness: 0.3,
        metalness: 0.9,
      }),
    };

    scene.add(new THREE.AmbientLight(0x94a3b8, 1.25));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 6, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x00afb9, 4, 6);
    cyanLight.position.set(-2.7, 1.6, 2.7);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xa855f7, 2.5, 5);
    magentaLight.position.set(2.2, -0.8, 2.4);
    scene.add(magentaLight);

    const rig = new THREE.Group();
    rig.rotation.x = -0.08;
    scene.add(rig);

    function mark(mesh: THREE.Mesh, key: PartKey) {
      mesh.userData.partKey = key;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      interactiveMeshes.push(mesh);
      return mesh;
    }

    function box(
      key: PartKey | null,
      size: [number, number, number],
      pos: [number, number, number],
      material: THREE.Material
    ) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...pos);
      if (key) mark(mesh, key);
      else {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
      rig.add(mesh);
      return mesh;
    }

    function makeFan(x: number, y: number, z: number, radius: number, key: PartKey) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, radius * 0.08, 10, 34),
        new THREE.MeshStandardMaterial({
          color: "#111827",
          roughness: 0.35,
          metalness: 0.55,
        })
      );
      mark(ring, key);
      group.add(ring);

      const blades = new THREE.Group();
      for (let index = 0; index < 7; index += 1) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(radius * 0.15, radius * 0.66, radius * 0.03),
          materials.black
        );
        blade.position.y = radius * 0.34;
        blade.rotation.z = (Math.PI * 2 * index) / 7 + 0.35;
        mark(blade, key);
        blades.add(blade);
      }
      spinningMeshes.push(blades);
      group.add(blades);

      const glow = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.86, radius * 0.035, 8, 32),
        new THREE.MeshStandardMaterial({
          color: "#020617",
          emissive: new THREE.Color(partByKey[key].color),
          emissiveIntensity: 1.6,
          roughness: 0.35,
          metalness: 0.2,
        })
      );
      mark(glow, key);
      group.add(glow);
      rig.add(group);
      return group;
    }

    // Cabinet frame and glass.
    const frameW = 4.3;
    const frameH = 3.25;
    box("cabinets", [frameW, 0.1, 0.12], [0, frameH / 2, -0.15], materials.frame);
    box("cabinets", [frameW, 0.1, 0.12], [0, -frameH / 2, -0.15], materials.frame);
    box("cabinets", [0.1, frameH, 0.12], [-frameW / 2, 0, -0.15], materials.frame);
    box("cabinets", [0.1, frameH, 0.12], [frameW / 2, 0, -0.15], materials.frame);
    box("cabinets", [frameW - 0.16, frameH - 0.16, 0.05], [0, 0, -0.56], materials.black);

    const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(frameW - 0.14, frameH - 0.14, 0.03), materials.glass);
    glassPanel.position.set(0, 0, 0.48);
    mark(glassPanel, "cabinets");
    rig.add(glassPanel);

    // Motherboard.
    box("motherboards", [2.05, 2.35, 0.08], [-0.48, 0.08, 0.02], materials.pcb);
    box("motherboards", [0.5, 0.16, 0.12], [-1.18, 0.88, 0.12], materials.metal);
    box("motherboards", [0.58, 0.42, 0.1], [0.2, -0.72, 0.12], materials.metal);

    // CPU and cooler.
    const cpuPlate = box("processors", [0.48, 0.48, 0.08], [-0.6, 0.45, 0.18], materials.metal);
    const cpuLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.38, 0.2),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture("CPU", "LGA", partByKey.processors.color),
        transparent: true,
      })
    );
    cpuLabel.position.set(cpuPlate.position.x, cpuPlate.position.y, 0.23);
    mark(cpuLabel, "processors");
    rig.add(cpuLabel);

    const coolerBlock = box("processors", [0.66, 0.66, 0.16], [-0.6, 0.45, 0.34], materials.black);
    const coolerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.025, 10, 40),
      new THREE.MeshStandardMaterial({
        color: "#020617",
        emissive: "#00AFB9",
        emissiveIntensity: 1.75,
      })
    );
    coolerRing.position.copy(coolerBlock.position);
    coolerRing.position.z = 0.44;
    mark(coolerRing, "processors");
    rig.add(coolerRing);

    // RAM sticks.
    for (let index = 0; index < 4; index += 1) {
      box("memory", [0.14, 1.1, 0.08], [0.42 + index * 0.18, 0.3, 0.22], materials.metal);
      box(
        "memory",
        [0.08, 0.98, 0.08],
        [0.42 + index * 0.18, 0.3, 0.32],
        new THREE.MeshStandardMaterial({
          color: "#1E1B4B",
          emissive: new THREE.Color(index % 2 ? "#A855F7" : "#00AFB9"),
          emissiveIntensity: 1.1,
          roughness: 0.35,
          metalness: 0.2,
        })
      );
    }

    // GPU.
    box("graphics-cards", [1.92, 0.45, 0.36], [-0.42, -0.78, 0.34], materials.gpu);
    box("graphics-cards", [1.86, 0.06, 0.12], [-0.42, -1.05, 0.12], materials.gold);
    const gpuLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.22),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture("RTX", "GPU", partByKey["graphics-cards"].color),
        transparent: true,
      })
    );
    gpuLabel.position.set(-0.42, -0.78, 0.53);
    mark(gpuLabel, "graphics-cards");
    rig.add(gpuLabel);
    makeFan(-1.0, -0.78, 0.56, 0.23, "graphics-cards");
    makeFan(-0.42, -0.78, 0.56, 0.23, "graphics-cards");
    makeFan(0.16, -0.78, 0.56, 0.23, "graphics-cards");

    // Storage bay and M.2.
    box("storage", [0.7, 0.95, 0.18], [1.43, 0.42, 0.2], materials.metal);
    const storageLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.22),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture("SSD", "1TB", partByKey.storage.color),
        transparent: true,
      })
    );
    storageLabel.position.set(1.43, 0.42, 0.31);
    mark(storageLabel, "storage");
    rig.add(storageLabel);
    box("storage", [0.55, 0.16, 0.08], [0.4, -0.2, 0.18], materials.metal);

    // PSU.
    box("power-supply", [1.15, 0.68, 0.55], [-1.16, -1.25, 0.15], materials.black);
    const psuLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.62, 0.28),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture("750W", "PSU", partByKey["power-supply"].color),
        transparent: true,
      })
    );
    psuLabel.position.set(-1.16, -1.25, 0.46);
    mark(psuLabel, "power-supply");
    rig.add(psuLabel);

    // Case fans.
    makeFan(1.9, 0.88, 0.22, 0.27, "cabinets");
    makeFan(1.9, 0.17, 0.22, 0.27, "cabinets");
    makeFan(1.9, -0.54, 0.22, 0.27, "cabinets");
    makeFan(-1.92, 0.9, 0.22, 0.27, "cabinets");

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 48),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.05;
    floor.receiveShadow = true;
    scene.add(floor);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let radius = 6.2;
    let yaw = 0.08;
    let pitch = 0.1;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;
    let frameId = 0;
    let currentHover: PartKey | null = null;

    function updateCamera() {
      camera.position.set(Math.sin(yaw) * radius, 0.05 + pitch * 2.0, Math.cos(yaw) * radius);
      camera.lookAt(0, -0.05, 0);
    }
    updateCamera();

    function setPointer(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function findPart(event: PointerEvent) {
      setPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      const partKey = hits[0]?.object.userData.partKey;
      return typeof partKey === "string" ? (partKey as PartKey) : null;
    }

    function onPointerDown(event: PointerEvent) {
      dragging = true;
      moved = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      container.classList.add("cursor-grabbing");
    }

    function onPointerMove(event: PointerEvent) {
      if (dragging) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        yaw -= dx * 0.006;
        pitch = Math.max(-0.35, Math.min(0.55, pitch + dy * 0.003));
        lastX = event.clientX;
        lastY = event.clientY;
        updateCamera();
        return;
      }

      const key = findPart(event);
      if (key !== currentHover) {
        currentHover = key;
        setHoveredPart(key ? partByKey[key] : null);
        renderer.domElement.style.cursor = key ? "pointer" : "grab";
      }
    }

    function onPointerUp(event: PointerEvent) {
      dragging = false;
      container.classList.remove("cursor-grabbing");
      renderer.domElement.releasePointerCapture(event.pointerId);
      if (moved < 8) {
        const key = findPart(event);
        if (key) {
          const part = partByKey[key];
          setSelectedPart(part);
          router.push(part.href);
        }
      }
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      radius = Math.max(4.2, Math.min(9.5, radius + event.deltaY * 0.004));
      updateCamera();
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const zoomIn = () => {
      radius = Math.max(4.2, radius - 0.7);
      updateCamera();
    };
    const zoomOut = () => {
      radius = Math.min(9.5, radius + 0.7);
      updateCamera();
    };
    const reset = () => {
      radius = 6.2;
      yaw = 0.08;
      pitch = 0.1;
      updateCamera();
    };

    container.addEventListener("pc-viewer-zoom-in", zoomIn);
    container.addEventListener("pc-viewer-zoom-out", zoomOut);
    container.addEventListener("pc-viewer-reset", reset);

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    function animate() {
      const delta = clock.getDelta();
      spinningMeshes.forEach((mesh) => {
        mesh.rotation.z += delta * 7;
      });
      rig.rotation.y += dragging ? 0 : delta * 0.09;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      container.removeEventListener("pc-viewer-zoom-in", zoomIn);
      container.removeEventListener("pc-viewer-zoom-out", zoomOut);
      container.removeEventListener("pc-viewer-reset", reset);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      renderer.domElement.remove();
    };
  }, [router]);

  function dispatchViewerEvent(name: string) {
    hostRef.current?.dispatchEvent(new Event(name));
  }

  return (
    <section className="px-4 py-16 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#00AFB9]">
              Interactive PC Builder
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Click a part to browse matching hardware
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Rotate and zoom the assembled PC. Tap the CPU, GPU, RAM, storage, PSU,
              motherboard, or cabinet to open available options in the catalog.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-[#00AFB9] hover:text-[#00AFB9]"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,#1E293B_0%,#020617_60%)] shadow-2xl">
            <div
              ref={hostRef}
              className="h-[430px] cursor-grab touch-none sm:h-[540px]"
              aria-label="Interactive assembled PC viewer"
            />

            <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur">
              Drag to rotate - scroll to zoom - click a component
            </div>

            {hoveredPart && (
              <div className="absolute bottom-4 left-4 rounded-2xl border border-[#00AFB9]/40 bg-slate-950/80 p-4 shadow-xl backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#00AFB9]">
                  Hovering
                </p>
                <p className="mt-1 text-lg font-bold">{hoveredPart.label}</p>
                <p className="mt-1 text-xs text-slate-300">{hoveredPart.description}</p>
              </div>
            )}

            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
              <button
                type="button"
                onClick={() => dispatchViewerEvent("pc-viewer-zoom-in")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur hover:border-[#00AFB9] hover:text-[#00AFB9]"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => dispatchViewerEvent("pc-viewer-zoom-out")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur hover:border-[#00AFB9] hover:text-[#00AFB9]"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => dispatchViewerEvent("pc-viewer-reset")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur hover:border-[#00AFB9] hover:text-[#00AFB9]"
                aria-label="Reset view"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Component shortcuts
            </p>
            <div className="mt-4 space-y-2">
              {PC_PARTS.map((part) => (
                <Link
                  key={part.key}
                  href={part.href}
                  onMouseEnter={() => setSelectedPart(part)}
                  className="group block rounded-2xl border border-white/10 bg-slate-900/70 p-4 hover:border-[#00AFB9]/70 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{part.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{part.description}</p>
                    </div>
                    <span
                      className="h-3 w-3 shrink-0 rounded-full shadow-[0_0_16px_currentColor]"
                      style={{ color: part.color, backgroundColor: part.color }}
                    />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[#00AFB9]/25 bg-[#00AFB9]/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00AFB9]">
                Selected
              </p>
              <p className="mt-2 text-lg font-bold">{selectedPart.label}</p>
              <p className="mt-1 text-sm text-slate-300">{selectedPart.description}</p>
              <Link
                href={selectedPart.href}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#00AFB9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#009AA3]"
              >
                Browse options
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
