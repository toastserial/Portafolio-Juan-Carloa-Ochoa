import { Bounds, ContactShadows, Grid, Html } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { PortfolioModel } from './PortfolioModel'
import type { WorkspaceMode } from '../../types/content'

const modeColors: Record<WorkspaceMode, string> = {
  data: '#4faabd',
  automation: '#ffb000',
  software: '#a879d8',
}

export function PortfolioCanvas({
  mode,
  onReady,
}: {
  mode: WorkspaceMode
  onReady: () => void
}) {
  const isCompact = window.matchMedia('(max-width: 47.99rem)').matches
  const modeColor = modeColors[mode]

  return (
    <Canvas
      camera={{ fov: 34, position: [0, 0.3, 6.5] }}
      dpr={isCompact ? [1, 1.2] : [1, 1.5]}
      frameloop="always"
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      shadows={false}
    >
      <ambientLight intensity={1.7} />
      <directionalLight intensity={3.2} position={[4, 6, 5]} />
      <directionalLight color={modeColor} intensity={1.35} position={[-4, 1, 2]} />
      <Suspense
        fallback={
          <Html center>
            <span className="canvas-loading">Loading 3D</span>
          </Html>
        }
      >
        <Grid
          args={[12, 12]}
          cellColor="#343943"
          cellSize={0.45}
          cellThickness={0.45}
          fadeDistance={9}
          fadeStrength={1.3}
          infiniteGrid
          position={[0, -2.08, 0]}
          sectionColor="#695022"
          sectionSize={2.25}
          sectionThickness={0.8}
        />
        <Bounds clip fit margin={1.06} observe>
          <group>
            <mesh position={[0, 0, -1]}>
              <boxGeometry args={[4.55, 4.4, 2.2]} />
              <meshBasicMaterial
                colorWrite={false}
                depthWrite={false}
                opacity={0}
                transparent
              />
            </mesh>
            <group position={[0, -1.38, 0]}>
              <mesh>
                <cylinderGeometry args={[1.1, 1.18, 0.16, 64]} />
                <meshStandardMaterial
                  color="#11151b"
                  metalness={0.72}
                  roughness={0.3}
                />
              </mesh>
              <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.88, 1.08, 64]} />
                <meshStandardMaterial
                  color={modeColor}
                  emissive={modeColor}
                  emissiveIntensity={1.4}
                  metalness={0.3}
                  roughness={0.4}
                />
              </mesh>
            </group>
            <PortfolioModel onReady={onReady} />
          </group>
        </Bounds>
        {!isCompact && (
          <ContactShadows
            blur={2.5}
            far={4}
            opacity={0.24}
            position={[0, -2.05, 0]}
            resolution={256}
            scale={5}
          />
        )}
      </Suspense>
    </Canvas>
  )
}
