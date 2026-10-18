import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import type { PointerEvent } from 'react'
import { ScrollLyricsText } from '../effects/ScrollLyricsText'
import { playClick, playHover } from '../../lib/soundEffects'
import type { Locale } from '../../types/content'

interface WhatIDoItem {
  id: string
  title: Record<Locale, string>
  tools: string
  detail: Record<Locale, string>
}

const whatIDoItems: WhatIDoItem[] = [
  {
    id: 'interfaces',
    title: { es: 'Interfaces de producto', en: 'Product interfaces' },
    tools: 'REACT / TYPESCRIPT / NEXT.JS / TAILWIND CSS',
    detail: {
      es: 'Construyo flujos responsive que hacen más clara cada tarea.',
      en: 'I build responsive flows that make each task clearer.',
    },
  },
  {
    id: 'systems',
    title: { es: 'Sistemas conectados', en: 'Connected systems' },
    tools: 'APIS / NODE.JS / PHP / SQL',
    detail: {
      es: 'Conecto interfaces con servicios y datos para completar el flujo.',
      en: 'I connect interfaces to services and data to complete the flow.',
    },
  },
  {
    id: 'data',
    title: { es: 'Datos y automatización', en: 'Data & automation' },
    tools: 'POWER QUERY / PYTHON / EXCEL / DATA PIPELINES',
    detail: {
      es: 'Preparo y valido información para que el análisis sea confiable.',
      en: 'I prepare and validate information so analysis is dependable.',
    },
  },
  {
    id: 'reporting',
    title: { es: 'Dashboards operativos', en: 'Operational dashboards' },
    tools: 'POWER BI / DATA MODELS / OPERATIONAL REPORTING',
    detail: {
      es: 'Organizo métricas para que los equipos encuentren lo importante.',
      en: 'I organize metrics so teams can find what matters.',
    },
  },
  {
    id: 'motion',
    title: { es: 'Interacción y 3D', en: 'Interaction & 3D' },
    tools: 'FRAMER MOTION / THREE.JS / CSS',
    detail: {
      es: 'Uso movimiento para orientar, dar feedback y aportar profundidad.',
      en: 'I use motion to guide, give feedback, and add depth.',
    },
  },
  {
    id: 'delivery',
    title: { es: 'Calidad y entrega', en: 'Quality & delivery' },
    tools: 'FUNCTIONAL TESTING / GIT / BITBUCKET',
    detail: {
      es: 'Valido los flujos y colaboro para entregar cambios mantenibles.',
      en: 'I validate flows and collaborate to ship maintainable changes.',
    },
  },
]

function WhatIDoRow({ item, index, locale, reduceMotion }: {
  item: WhatIDoItem
  index: number
  locale: Locale
  reduceMotion: boolean | null
}) {
  const [pinned, setPinned] = useState(false)
  const es = locale === 'es'

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') playHover()
  }

  return (
    <motion.button
      aria-label={`${item.title[locale]}. ${item.tools}. ${item.detail[locale]}. ${es ? 'Fijar resaltado' : 'Pin highlight'}`}
      aria-pressed={pinned}
      className={`whatido-row${pinned ? ' is-pinned' : ''}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      onClick={() => {
        setPinned((current) => !current)
        playClick()
      }}
      onPointerEnter={handlePointerEnter}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      type="button"
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <span aria-hidden="true" className="whatido-track">
        <span className="whatido-layer">
          <span className="whatido-title">
            <ScrollLyricsText
              accentColor="var(--color-accent)"
              end={0.65}
              initialColor="#5b5660"
              start={0.95}
              text={item.title[locale]}
            />
          </span>
          <span className="whatido-meta">{item.tools}</span>
        </span>
        <span className="whatido-layer whatido-layer-active">
          <span className="whatido-title">{item.title[locale]}</span>
          <span className="whatido-detail">{item.detail[locale]}</span>
        </span>
      </span>
    </motion.button>
  )
}

export function CapabilitiesSection({ locale }: { locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const es = locale === 'es'

  return (
    <section aria-labelledby="whatido-heading" className="section-shell whatido-section" id="capabilities">
      <h2 className="whatido-heading technical-label" id="whatido-heading">
        {es ? 'LO QUE HAGO' : 'WHAT I DO'}
      </h2>
      <div className="whatido-list">
        {whatIDoItems.map((item, index) => (
          <WhatIDoRow item={item} index={index} key={item.id} locale={locale} reduceMotion={reduceMotion} />
        ))}
      </div>
    </section>
  )
}
