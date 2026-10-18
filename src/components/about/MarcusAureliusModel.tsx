import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF, useProgress, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef, Suspense } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'

const MODEL_PATH = '/models/marcus_aurelius.glb'
const GOGGLES_PATH = '/images/about/goggles.webp'

// Start fetching the model and glasses as soon as this section's lazy chunk loads.
useGLTF.preload(MODEL_PATH)
useTexture.preload(GOGGLES_PATH)

function Goggles() {
  const texture = useTexture(GOGGLES_PATH)

  return (
    <mesh position={[-0.06, 0.2, 0.14]} renderOrder={999} rotation={[0, 0, 0.2]} scale={[0.16, 0.08, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial depthTest={false} map={texture} transparent />
    </mesh>
  )
}
function ModelLoadingIndicator() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div aria-live="polite" className="philosophy-model-loading" role="status">
        <span aria-hidden="true" className="philosophy-model-loader-orbit" />
        <span>{Math.round(progress)}%</span>
      </div>
    </Html>
  )
}
function Bust({ containerRef, showGoggles }: { containerRef: RefObject<HTMLElement | null>; showGoggles: boolean }) {
  const { scene } = useGLTF(MODEL_PATH)
  const clonedScene = useMemo(() => scene.clone(true), [scene])
  const groupRef = useRef<THREE.Group>(null)
  const mouseOffset = useRef({ x: 0, y: 0 })
  const targetOffset = useRef({ x: 0, y: 0 })
  const scrollOffset = useRef(0)
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateScroll = () => {
      const rect = element.getBoundingClientRect()
      scrollOffset.current = THREE.MathUtils.clamp(
        (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.0006,
        -0.35,
        0.35,
      )
      invalidate()
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = element.getBoundingClientRect()
      targetOffset.current = {
        y: 0.35 * ((event.clientX - rect.left) / rect.width - 0.5),
        x: 0.25 * ((event.clientY - rect.top) / rect.height - 0.5),
      }
      invalidate()
    }
    const handleLeave = () => {
      targetOffset.current = { x: 0, y: 0 }
      invalidate()
    }

    updateScroll()
    element.addEventListener('pointermove', handleMove)
    element.addEventListener('pointerleave', handleLeave)
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    return () => {
      element.removeEventListener('pointermove', handleMove)
      element.removeEventListener('pointerleave', handleLeave)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [containerRef, invalidate])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const easing = 1 - Math.exp(-5 * delta)
    mouseOffset.current.x += (targetOffset.current.x - mouseOffset.current.x) * easing
    mouseOffset.current.y += (targetOffset.current.y - mouseOffset.current.y) * easing

    group.position.y += (-0.45 - scrollOffset.current - group.position.y) * easing
    group.rotation.x = mouseOffset.current.x
    group.rotation.y = 6.5 + 0.35 * scrollOffset.current + mouseOffset.current.y
    if (
      Math.abs(targetOffset.current.x - mouseOffset.current.x) > 0.0005 ||
      Math.abs(targetOffset.current.y - mouseOffset.current.y) > 0.0005 ||
      Math.abs(-0.45 - scrollOffset.current - group.position.y) > 0.0005
    ) invalidate()
  })

  return (
    <group position={[0, -0.45, 0]} ref={groupRef} rotation={[0, 6.5, 0]} scale={3}>
      <primitive object={clonedScene} />
      {showGoggles && <Goggles />}
    </group>
  )
}

export default function MarcusAureliusModel({
  containerRef,
  showGoggles = false,
}: {
  containerRef: RefObject<HTMLElement | null>
  showGoggles?: boolean
}) {
  return (
    <div className="philosophy-model">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} dpr={[1, 1.1]} frameloop="demand" gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}>
        <ambientLight intensity={0.9} />
        <directionalLight intensity={1.6} position={[10, 10, 5]} />
        <directionalLight color="#b28ad6" intensity={0.6} position={[-5, -2, -2]} />
        <Suspense fallback={<ModelLoadingIndicator />}>
          <Bust containerRef={containerRef} showGoggles={showGoggles} />
        </Suspense>
      </Canvas>
    </div>
  )
}

