import { ArrowDown, Mail } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { useRef } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import { socialLinks } from '../../data/socialLinks'
import { playClick, playHover } from '../../lib/soundEffects'
import { smoothScrollTo } from '../../lib/smoothScroll'
import { IdentityParticles } from '../effects/IdentityParticles'
import type { Locale } from '../../types/content'

const heroSocialOrder = ['linkedin', 'github', 'whatsapp', 'email']

export function HeroSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const reduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const revealPortrait = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotion || !heroRef.current) return
    const bounds = heroRef.current.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    heroRef.current.style.setProperty('--hero-shift-x', `${x * -10}px`)
    heroRef.current.style.setProperty('--hero-shift-y', `${y * -8}px`)
  }
  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    playClick()
    const target = document.getElementById(id)
    if (target) smoothScrollTo(target, reduceMotion === true)
  }
  const entrance = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section className="hero-shell" id="top" onPointerMove={revealPortrait} ref={heroRef}>
      <div aria-hidden="true" className="hero-photo">
        <img className="hero-photo-base hero-photo-dark" decoding="async" fetchPriority="high" src="/images/hero/juan-hero-editorial-v3.png" alt="" />
        <img className="hero-photo-base hero-photo-light" decoding="async" src="/images/hero/juan-hero-editorial-light.png" alt="" />
        <div className="hero-photo-wash" />
      </div>
      <div className="hero-stage page-shell">
        <div className="hero-stage-center">
          <motion.p className="hero-stage-kicker" {...entrance(0.18)}>
            JUAN CARLOS OCHOA
          </motion.p>
          <h1 className="sr-only">Juan Carlos Ochoa Guzmán — {es ? 'Creando software útil' : 'Building useful software'}</h1>
          <motion.div className="hero-stage-type" {...entrance(0.26)}>
            <IdentityParticles locale={locale} />
          </motion.div>
          <p className="hero-touch-hint">{es ? 'TOCA Y ARRASTRA LAS PALABRAS' : 'TOUCH AND DRAG THE WORDS'}</p>
          <nav aria-label={es ? 'Explorar el portafolio' : 'Explore the portfolio'} className="hero-mobile-actions">
            <a className="hero-mobile-action" href="#work" onClick={(event) => scrollToSection(event, 'work')} onMouseEnter={playHover}>
              {es ? 'Ver proyectos' : 'Explore projects'}
              <ArrowDown aria-hidden="true" size={15} />
            </a>
            <a className="hero-mobile-action hero-mobile-action-secondary" href="#about-portrait" onClick={(event) => scrollToSection(event, 'about-portrait')} onMouseEnter={playHover}>
              {es ? 'Conóceme' : 'About me'}
              <ArrowDown aria-hidden="true" size={15} />
            </a>
          </nav>
        </div>

        <motion.nav aria-label={es ? 'Redes sociales' : 'Social links'} className="hero-socials" {...entrance(0.4)}>
          {socialLinks.slice().sort((a, b) => heroSocialOrder.indexOf(a.id) - heroSocialOrder.indexOf(b.id)).map((link) => {
            const Icon = link.id === 'github' ? FaGithub : link.id === 'linkedin' ? FaLinkedin : link.id === 'whatsapp' ? FaWhatsapp : Mail
            const external = link.href.startsWith('http')
            return (
              <a aria-label={link.label} className="hero-social-link" href={link.href} key={link.id} onClick={playClick} onMouseEnter={playHover} rel={external ? 'noreferrer' : undefined} target={external ? '_blank' : undefined}>
                <span aria-hidden="true" className="hero-social-bubble">
                  <Icon aria-hidden="true" size={19} />
                  <span className="hero-social-fill" />
                </span>
                <span aria-hidden="true" className="hero-social-name">
                  {[...link.label].map((character, index) => (
                    <span key={`${link.id}-${index}`} style={{ transitionDelay: `${Math.abs(index - (link.label.length - 1) / 2) * 18}ms` }}>
                      {character}
                    </span>
                  ))}
                </span>
              </a>
            )
          })}
        </motion.nav>
      </div>
    </section>
  )
}
