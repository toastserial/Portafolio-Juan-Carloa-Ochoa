import { motion, useReducedMotion } from 'framer-motion'

export function SVGReveal() {
  const reduceMotion = useReducedMotion()
  return (
    <svg aria-hidden="true" className="svg-reveal" viewBox="0 0 160 24" preserveAspectRatio="none">
      <motion.path
        d="M1 12H138M131 5L139 12L131 19"
        fill="none"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        stroke="currentColor"
        strokeWidth="1.5"
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
      />
    </svg>
  )
}
