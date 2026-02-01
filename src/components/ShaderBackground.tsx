// ============================================
// MiniSentinel — Shader Background Component
// ============================================

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../shaders/gridBackground.vert';
import fragmentShader from '../shaders/gridBackground.frag';

function GridPlane({ scrollProgress = 0 }: { scrollProgress?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const { viewport, size } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uScrollProgress: { value: 0 },
    }), [size.width, size.height]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
            material.uniforms.uScrollProgress.value = scrollProgress;
            material.uniforms.uResolution.value.set(size.width, size.height);
        }
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1, 1, 1]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
            />
        </mesh>
    );
}

interface ShaderBackgroundProps {
    scrollProgress?: number;
}

export function ShaderBackground({ scrollProgress = 0 }: ShaderBackgroundProps) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 1], fov: 75 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <GridPlane scrollProgress={scrollProgress} />
            </Canvas>
        </div>
    );
}

export default ShaderBackground;
