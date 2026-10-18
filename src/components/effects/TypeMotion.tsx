import { useInView } from '../../hooks/useInView'
import { TextReveal } from './TextReveal'

export const WordReveal = TextReveal

export function CharacterReveal({ text }: { text: string }) {
  const { ref, hasEntered } = useInView<HTMLSpanElement>('0px')
  return (
    <span className={`type-characters${hasEntered ? ' is-entered' : ''}`} ref={ref}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((character, index) => (
        <span
          aria-hidden="true"
          className="type-character"
          key={`${character}-${index}`}
          style={{ animationDelay: `${Math.min(index * 18, 540)}ms` }}
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </span>
  )
}

export interface HeadingLine {
  text: string
  muted?: boolean
}

export function LineReveal({ lines }: { lines: HeadingLine[] }) {
  const { ref, hasEntered } = useInView<HTMLSpanElement>('0px')
  return (
    <span className={`type-lines${hasEntered ? ' is-entered' : ''}`} ref={ref}>
      <span className="sr-only">{lines.map((line) => line.text).join(' ')}</span>
      {lines.map((line, index) => (
        <span aria-hidden="true" className="type-line-mask" key={`${line.text}-${index}`}>
          <span
            className={`type-line${line.muted ? ' text-muted' : ''}`}
            style={{ animationDelay: `${index * 105}ms` }}
          >
            {line.text}
          </span>
        </span>
      ))}
    </span>
  )
}

export function MaskedHeading({ as: Element = 'h2', lines }: { as?: 'h1' | 'h2' | 'h3'; lines: HeadingLine[] }) {
  return <Element><LineReveal lines={lines} /></Element>
}
