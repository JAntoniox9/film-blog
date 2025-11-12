// src/ClapperModel.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls, useGLTF } from '@react-three/drei';

/*
 * Asset 3D: "Black film slate or clapper" (https://skfb.ly/oFXKN)
 * Autor: Bendar Multimedia
 * Licencia: Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/)
 */

// Componente interno que carga el modelo
function Model(props) {
  // 👇 MIRA: Aquí usamos el nombre de tu archivo
  const { scene } = useGLTF('/black_film_slate_or_clapper.glb'); 
  return <primitive object={scene} {...props} />;
}

// Pre-cargamos el modelo
useGLTF.preload('/black_film_slate_or_clapper.glb');

// Este es el componente que importarás en App.js
export default function ClapperModelViewer() {
  return (
    <Canvas 
      shadows
      dpr={[1, 2]} // Para pantallas Retina
      camera={{ fov: 45 }} // Zoom
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {/* 'Stage' añade luces de estudio y sombras bonitas */}
        <Stage environment="city" intensity={0.5}>
          <Model />
        </Stage>
      </Suspense>
      
      {/* 'OrbitControls' permite girar con el mouse y rota solo */}
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={1.0}
        enableZoom={false} // Para que no se pueda hacer zoom
      />
    </Canvas>
  );
}