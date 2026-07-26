import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { useEffect } from 'react'

export function InteractiveBackground() {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(-400)
  const pointerY = useMotionValue(-400)
  const x = useSpring(pointerX, { damping: 28, stiffness: 180, mass: 0.35 })
  const y = useSpring(pointerY, { damping: 28, stiffness: 180, mass: 0.35 })
  const glow = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(255, 176, 0, 0.105), transparent 72%)`

  useEffect(() => {
    if (reduceMotion) return

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
    }

    window.addEventListener('pointermove', updatePointer, { passive: true })
    return () => window.removeEventListener('pointermove', updatePointer)
  }, [pointerX, pointerY, reduceMotion])

  return (
    <div aria-hidden="true" className="interactive-background">
      <motion.div
        className="cursor-glow"
        style={reduceMotion ? undefined : { backgroundImage: glow }}
      />
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <div className="background-noise" />
    </div>
  )
}
