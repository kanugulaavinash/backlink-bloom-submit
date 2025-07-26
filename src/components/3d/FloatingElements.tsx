import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export const FloatingElements = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(time * 2) * 0.5;
      sphereRef.current.rotation.x = time * 0.5;
    }
    
    if (boxRef.current) {
      boxRef.current.position.y = Math.cos(time * 1.5) * 0.3;
      boxRef.current.rotation.y = time * 0.3;
    }
    
    if (textRef.current) {
      textRef.current.position.y = Math.sin(time * 1.8) * 0.2;
    }
  });

  return (
    <>
      {/* Floating Sphere */}
      <Sphere ref={sphereRef} args={[0.5]} position={[2, 0, 0]}>
        <meshStandardMaterial color="#6366f1" transparent opacity={0.7} />
      </Sphere>
      
      {/* Floating Box */}
      <Box ref={boxRef} args={[0.6, 0.6, 0.6]} position={[-2, 0, 0]}>
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.6} />
      </Box>
      
      {/* Floating Text */}
      <Text
        ref={textRef}
        position={[0, 1, 0]}
        fontSize={0.5}
        color="#8b5cf6"
        anchorX="center"
        anchorY="middle"
      >
        $5
      </Text>
      
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#6366f1" />
    </>
  );
};