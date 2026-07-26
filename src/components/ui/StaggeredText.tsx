import { motion, useReducedMotion } from 'framer-motion'

interface StaggeredTextProps {
  children: string
  className?: string
}

export function StaggeredText({ children, className }: StaggeredTextProps) {
  const reduceMotion = useReducedMotion()
  const words = children.split(' ')

  return (
    <span aria-label={children} className={className}>
      {words.map((word, index) => (
        <span className="staggered-word-mask" key={`${word}-${index}`}>
          <motion.span
            aria-hidden="true"
            animate={reduceMotion ? undefined : { y: '0%', filter: 'blur(0px)' }}
            className="staggered-word"
            initial={reduceMotion ? false : { y: '115%', filter: 'blur(4px)' }}
            transition={{
              delay: 0.12 + index * 0.075,
              duration: 0.72,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && <>&nbsp;</>}
        </span>
      ))}
    </span>
  )
}
