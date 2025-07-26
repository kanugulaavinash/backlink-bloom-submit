import { Canvas } from '@react-three/fiber';
import { SimpleFloatingElements } from './SimpleFloatingElements';
import { Suspense } from 'react';

export const SimpleScene3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        onCreated={(state) => {
          if (state?.gl) {
            state.gl.setClearColor('transparent');
          }
        }}
        fallback={<div />}
      >
        <Suspense fallback={null}>
          <SimpleFloatingElements />
        </Suspense>
      </Canvas>
    </div>
  );
};