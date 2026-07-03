import { Canvas } from "@react-three/fiber";
import { Particles } from "./Particles";

export default function HeroCanvas() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Particles dense={!coarse} />
    </Canvas>
  );
}
