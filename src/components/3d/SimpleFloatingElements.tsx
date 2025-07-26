import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SimpleFloatingElements = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!state?.clock) return;
    
    const time = state.clock.getElapsedTime();
    
    try {
      if (sphereRef.current) {
        sphereRef.current.position.y = Math.sin(time * 2) * 0.5;
        sphereRef.current.rotation.x = time * 0.5;
      }
      
      if (boxRef.current) {
        boxRef.current.position.y = Math.cos(time * 1.5) * 0.3;
        boxRef.current.rotation.y = time * 0.3;
      }
    } catch (error) {
      console.warn('Animation frame error:', error);
    }
  });

  return (
    <>
      {/* Floating Sphere */}
      <mesh ref={sphereRef} position={[2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.7} />
      </mesh>
      
      {/* Floating Box */}
      <mesh ref={boxRef} position={[-2, 0, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.6} />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#6366f1" />
    </>
  );
};