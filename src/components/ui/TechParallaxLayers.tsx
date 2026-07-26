import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { WorkspaceMode } from '../../types/content'

const layersPath = '/images/background_funko'

export function TechParallaxLayers({ mode }: { mode: WorkspaceMode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [isCompact, setIsCompact] = useState(
    () => window.matchMedia('(max-width: 40rem)').matches,
  )
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { damping: 34, stiffness: 80, mass: 0.8 })
  const smoothY = useSpring(pointerY, { damping: 34, stiffness: 80, mass: 0.8 })
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end start'],
  })
  const progress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 88,
    mass: 0.65,
  })

  useEffect(() => {
    if (reduceMotion) return

    const updatePointer = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5)
      pointerY.set(event.clientY / window.innerHeight - 0.5)
    }
    const resetPointer = () => {
      pointerX.set(0)
      pointerY.set(0)
    }

    window.addEventListener('pointermove', updatePointer, { passive: true })
    document.documentElement.addEventListener('mouseleave', resetPointer)
    return () => {
      window.removeEventListener('pointermove', updatePointer)
      document.documentElement.removeEventListener('mouseleave', resetPointer)
    }
  }, [pointerX, pointerY, reduceMotion])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 40rem)')
    const update = () => setIsCompact(media.matches)
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  const backgroundY = useTransform(progress, [0, 1], ['0%', '7%'])
  const backgroundScale = useTransform(progress, [0, 1], [1.035, 1.085])
  const workspaceY = useTransform(progress, [0, 1], ['0%', '18%'])
  const detailsY = useTransform(progress, [0, 1], ['0%', '29%'])
  const foregroundY = useTransform(progress, [0, 1], ['0%', '38%'])
  const particlesY = useTransform(progress, [0, 1], ['0%', '48%'])
  const fade = useTransform(progress, [0, 0.78, 1], [1, 0.78, 0])

  const workspaceX = useTransform(smoothX, [-0.5, 0.5], [-5, 5])
  const workspacePointerY = useTransform(smoothY, [-0.5, 0.5], [-3, 3])
  const detailsX = useTransform(smoothX, [-0.5, 0.5], [-13, 13])
  const detailsPointerY = useTransform(smoothY, [-0.5, 0.5], [-9, 9])
  const foregroundX = useTransform(smoothX, [-0.5, 0.5], [-18, 18])
  const particlesX = useTransform(smoothX, [-0.5, 0.5], [-25, 25])
  const particlesPointerY = useTransform(smoothY, [-0.5, 0.5], [-16, 16])

  return (
    <div
      aria-hidden="true"
      className={`tech-parallax tech-parallax-${mode}`}
      ref={rootRef}
    >
      <motion.img
        alt=""
        className="tech-image-layer tech-image-background"
        decoding="async"
        fetchPriority="high"
        src={`${layersPath}/background-base.jpg`}
        style={
          reduceMotion
            ? undefined
            : { opacity: fade, scale: backgroundScale, y: backgroundY }
        }
      />

      {!isCompact && <motion.div
        className="tech-image-motion tech-image-workspace"
        style={
          reduceMotion
            ? undefined
            : { x: workspaceX, y: workspaceY }
        }
      >
        <motion.img
          alt=""
          decoding="async"
          fetchPriority="low"
          src={`${layersPath}/layer-workspace.png`}
          style={reduceMotion ? undefined : { y: workspacePointerY }}
        />
      </motion.div>}

      {!isCompact && <motion.div
        className="tech-image-motion tech-image-details"
        style={
          reduceMotion
            ? undefined
            : { x: detailsX, y: detailsY }
        }
      >
        <motion.img
          alt=""
          decoding="async"
          fetchPriority="low"
          src={`${layersPath}/layer-personal-details.png`}
          style={reduceMotion ? undefined : { y: detailsPointerY }}
        />
      </motion.div>}

      <picture>
        <source
          media="(max-width: 40rem)"
          srcSet={`${layersPath}/layer-foreground-mobile.png`}
        />
        <motion.img
          alt=""
          className="tech-image-layer tech-image-foreground"
          decoding="async"
          fetchPriority="low"
          src={`${layersPath}/layer-foreground.png`}
          style={
            reduceMotion ? undefined : { opacity: fade, x: foregroundX, y: foregroundY }
          }
        />
      </picture>

      <motion.div
        className="tech-image-motion tech-image-particles"
        style={
          reduceMotion
            ? undefined
            : { x: particlesX, y: particlesY }
        }
      >
        <motion.img
          alt=""
          decoding="async"
          fetchPriority="low"
          src={`${layersPath}/layer-particles.png`}
          style={reduceMotion ? undefined : { y: particlesPointerY }}
        />
      </motion.div>
    </div>
  )
}
