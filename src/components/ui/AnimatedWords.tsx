import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedWordsProps {
  words: string[]
}

export function AnimatedWords({ words }: AnimatedWordsProps) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const word = words[index]

  useEffect(() => {
    if (reduceMotion) return

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [reduceMotion, words.length])

  if (reduceMotion) {
    return <span className="animated-word">{word}</span>
  }

  return (
    <span className="animated-word-frame">
      <span className="sr-only">{word}</span>
      <AnimatePresence initial={false}>
        <motion.span
          animate="visible"
          aria-hidden="true"
          className="animated-word"
          exit="exit"
          initial="hidden"
          key={word}
          variants={{
            hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                delayChildren: 0.04,
                staggerChildren: 0.035,
              },
            },
            exit: {
              opacity: 0,
              y: -12,
              filter: 'blur(8px)',
              transition: { duration: 0.18 },
            },
          }}
        >
          {word.split('').map((letter, letterIndex) => (
            <motion.span
              className="animated-letter"
              key={`${letter}-${letterIndex}`}
              variants={{
                hidden: { opacity: 0, y: 12, filter: 'blur(5px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
