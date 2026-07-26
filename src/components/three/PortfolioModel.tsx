import { Center, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'

export function PortfolioModel() {
  const group = useRef<Group>(null)
  const entryProgress = useRef(0)
  const spinTarget = useRef(0)
  const clickKick = useRef(0)
  const { scene } = useGLTF('/models/funkopop.glb')
  const model = useMemo(() => scene.clone(), [scene])

  useFrame((state, delta) => {
    if (!group.current) return
    const time = state.clock.elapsedTime
    entryProgress.current = Math.min(1, entryProgress.current + delta * 1.45)
    clickKick.current += (0 - clickKick.current) * delta * 4.8
    const entryEase = 1 - Math.pow(1 - entryProgress.current, 3)
    const targetX =
      state.pointer.y * 0.12 +
      Math.sin(time * 0.7) * 0.018 +
      clickKick.current
    const targetY =
      state.pointer.x * 0.26 +
      Math.sin(time * 0.45) * 0.045 +
      spinTarget.current
    const targetZ = state.pointer.x * -0.035
    const targetPositionX = state.pointer.x * 0.1
    const targetPositionY =
      Math.sin(time * 1.15) * 0.055 - (1 - entryEase) * 0.3

    group.current.rotation.x +=
      (targetX - group.current.rotation.x) * delta * 2.8
    group.current.rotation.y +=
      (targetY - group.current.rotation.y) * delta * 2.8
    group.current.rotation.z +=
      (targetZ - group.current.rotation.z) * delta * 2.4
    group.current.position.x +=
      (targetPositionX - group.current.position.x) * delta * 2.2
    group.current.position.y +=
      (targetPositionY - group.current.position.y) * delta * 2.2
    group.current.scale.setScalar(1.25 * (0.72 + entryEase * 0.28))
  })

  return (
    <group
      onClick={(event) => {
        event.stopPropagation()
        spinTarget.current += Math.PI * 2
        clickKick.current = 0.24
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      ref={group}
      scale={0.9}
    >
      <Center>
        <primitive object={model} />
      </Center>
    </group>
  )
}

useGLTF.preload('/models/funkopop.glb')
