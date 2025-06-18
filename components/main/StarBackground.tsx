"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

const StarBackground = (props: any) => {
  const ref: any = useRef();
  // Reduced number of stars from 5000 to 2000 for better performance
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(2000), { radius: 1.2 })
  );

  // Slowed down rotation for better performance
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta/15;
    ref.current.rotation.y -= delta/20;
  })

  return (
    <group rotation={[0,0, Math.PI / 4]}>
        <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled
        {...props}
        >
            <PointMaterial
                transparent
                color="$fff"
                size={0.002}
                sizeAttenuation={true}
                depthWrite={false} // Fixed typo: dethWrite to depthWrite
            />
        </Points>
    </group>
  )
};

const StarsCanvas = () => (
    <div className="w-full h-auto fixed inset-0 z-[20]">
        <Canvas camera={{position: [0, 0, 1]}}>
        <Suspense fallback={null}>
            <StarBackground />
        </Suspense>
        </Canvas>
    </div>
)

export default StarsCanvas;
