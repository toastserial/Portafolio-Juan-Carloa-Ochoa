import { useInView } from '../../hooks/useInView'

export function TextReveal({ text }: { text: string }) {
  const { ref, hasEntered } = useInView<HTMLSpanElement>('0px')
  return (
    <span className={`text-reveal${hasEntered ? ' is-entered' : ''}`} ref={ref}>
      <span className="sr-only">{text}</span>
      {text.split(/(\s+)/).map((part, index) =>
        /^\s+$/.test(part) ? (
          <span aria-hidden="true" key={index}>{part}</span>
        ) : (
          <span aria-hidden="true" className="text-reveal-mask" key={index}>
            <span
              className="text-reveal-word"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              {part}
            </span>
          </span>
        ),
      )}
    </span>
  )
}
