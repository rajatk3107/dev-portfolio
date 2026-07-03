import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroState } from "./heroState";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uPixelRatio;
varying float vIntensity;

// Simplex 3D noise — Ashima Arts / Ian McEwan (MIT), standard implementation
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 pos = position;

  // ambient drift, amplified as the user scrolls away (disperse)
  float n = snoise(vec3(pos.xy * 0.35, uTime * 0.12));
  pos.z += n * (0.35 + uScroll * 2.5);

  // cursor repulsion
  float d = distance(pos.xy, uPointer);
  float influence = smoothstep(1.6, 0.0, d);
  vec2 dir = normalize(pos.xy - uPointer + vec2(0.0001));
  pos.xy += dir * influence * 0.45;
  pos.z += influence * 0.9;

  // scroll pushes the lattice outward
  pos.xy *= 1.0 + uScroll * 0.35;

  vIntensity = clamp(influence * 1.4 + max(n, 0.0) * 0.35 + uScroll * 0.5, 0.0, 1.0);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPixelRatio * (1.2 + vIntensity * 2.6) * (6.0 / -mv.z);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uScroll;
varying float vIntensity;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  vec3 color = mix(uBase, uAccent, vIntensity);
  float alpha = (0.5 + vIntensity * 0.5) * (1.0 - uScroll * 0.6);
  gl_FragColor = vec4(color, alpha);
}
`;

export function Particles({ dense }: { dense: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, gl } = useThree();
  // Tracked at window level: the hero's z-10 text overlay sits above the
  // canvas, so canvas-targeted pointer events (R3F's state.pointer) never
  // fire over most of the hero. Null until the first real pointer move.
  const pointerNdc = useRef<THREE.Vector2 | null>(null);

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      (pointerNdc.current ??= new THREE.Vector2()).set(x, y);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);
  const cols = dense ? 140 : 80;
  const rows = dense ? 80 : 46;

  const positions = useMemo(() => {
    const w = 16;
    const h = 9;
    const arr = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        arr[i++] = (x / (cols - 1) - 0.5) * w;
        arr[i++] = (y / (rows - 1) - 0.5) * h;
        arr[i++] = 0;
      }
    }
    return arr;
  }, [cols, rows]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(100, 100) },
      uScroll: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
      uBase: { value: new THREE.Color("#3a3a3a") },
      uAccent: { value: new THREE.Color("#c6f24e") },
    }),
    [],
  );

  useFrame((state) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uScroll.value = heroState.scroll;
    // ease the pointer uniform toward the cursor's world position; until the
    // first pointer move, uPointer stays at its off-lattice default (100,100)
    const ndc = pointerNdc.current;
    if (ndc) {
      const targetX = (ndc.x * viewport.width) / 2;
      const targetY = (ndc.y * viewport.height) / 2;
      const p = m.uniforms.uPointer.value as THREE.Vector2;
      p.x += (targetX - p.x) * 0.08;
      p.y += (targetY - p.y) * 0.08;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
