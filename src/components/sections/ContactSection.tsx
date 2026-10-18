import {
  AlertCircle,
  Check,
  CheckCircle2,
  LoaderCircle,
  Send,
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { socialLinks } from '../../data/socialLinks'
import { playClick, playHover } from '../../lib/soundEffects'
import type { Locale } from '../../types/content'
import { Reveal } from '../ui/Reveal'
import { TextReveal } from '../effects/TextReveal'

const EMAIL = 'jcochoag18@gmail.com'
const MAX_MESSAGE_LENGTH = 500
const contactSocialOrder = ['linkedin', 'github', 'whatsapp']
type SubmitStatus = 'idle' | 'validating' | 'sending' | 'success' | 'error' | 'configuration-error'
const socialIcon = (id: string) => id === 'github' ? FaGithub : id === 'linkedin' ? FaLinkedin : FaWhatsapp

export function ContactSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const submittingRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current) return
    playClick()
    submittingRef.current = true
    setSubmitStatus('validating')
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const senderEmail = String(data.get('email') ?? '').trim()
    const subject = es ? 'Nuevo mensaje desde el portafolio' : 'New message from the portfolio'
    const message = String(data.get('message') ?? '').trim()
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!name || !senderEmail || !message || message.length > MAX_MESSAGE_LENGTH || !event.currentTarget.checkValidity()) {
      setSubmitStatus('error')
      submittingRef.current = false
      return
    }

    if (!serviceId || !templateId || !publicKey) {
      setSubmitStatus('configuration-error')
      submittingRef.current = false
      return
    }

    try {
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
      setSubmitStatus('sending')
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
          from_email: senderEmail,
          subject,
          message,
          time: new Date().toLocaleString(es ? 'es-HN' : 'en-US', {
            timeZone: 'America/Tegucigalpa',
          }),
        },
        { publicKey },
      )
      formRef.current?.reset()
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
    } finally {
      submittingRef.current = false
    }
  }

  return (
    <section className="section-shell contact-section" id="contact">
      <div className="contact-panel">
        <div className="contact-panel-content">
          <Reveal className="contact-heading">
            <h1><TextReveal text={es ? 'Hablemos' : 'Let’s talk'} /></h1>
          </Reveal>

          <Reveal className="contact-form-card" delay={0.08}>
            <form
              aria-busy={submitStatus === 'validating' || submitStatus === 'sending'}
              onChange={() => { if (submitStatus !== 'idle' && submitStatus !== 'sending' && submitStatus !== 'validating') setSubmitStatus('idle') }}
              onSubmit={sendMessage}
              ref={formRef}
            >
              <label className="contact-field">
                <input autoComplete="name" name="name" placeholder=" " required type="text" />
                <span>{es ? '¿CUÁL ES TU NOMBRE?' : 'WHAT’S YOUR NAME?'}</span>
              </label>
              <label className="contact-field">
                <input autoComplete="email" name="email" placeholder=" " required type="email" />
                <span>{es ? '¿CUÁL ES TU CORREO?' : 'WHAT’S YOUR EMAIL?'}</span>
              </label>
              <label className="contact-field contact-field-message">
                <textarea
                  maxLength={MAX_MESSAGE_LENGTH}
                  name="message"
                  placeholder=" "
                  required
                  rows={3}
                />
                <span>{es ? 'CUÉNTAME SOBRE TU PROYECTO…' : 'TELL ME ABOUT YOUR PROJECT…'}</span>
              </label>
              <button
                className={`button-primary contact-submit contact-submit--${submitStatus}`}
                disabled={submitStatus === 'validating' || submitStatus === 'sending'}
                onMouseEnter={playHover}
                type="submit"
              >
                {submitStatus === 'sending' || submitStatus === 'validating'
                  ? <LoaderCircle aria-hidden="true" className="contact-submit-spinner" size={18} />
                  : submitStatus === 'success'
                    ? <Check aria-hidden="true" className="contact-submit-check" size={18} />
                    : submitStatus === 'error' || submitStatus === 'configuration-error'
                      ? <AlertCircle aria-hidden="true" size={18} />
                      : <Send aria-hidden="true" size={17} />}
                <span>{submitStatus === 'validating'
                  ? es ? 'Validando…' : 'Validating…'
                  : submitStatus === 'sending'
                    ? es ? 'Enviando…' : 'Sending…'
                    : submitStatus === 'success'
                      ? es ? 'Mensaje enviado' : 'Submitted'
                      : submitStatus === 'error' || submitStatus === 'configuration-error'
                        ? es ? 'Reintentar envío' : 'Try again'
                        : es ? 'Enviar' : 'Submit'}</span>
              </button>
              <div aria-live="polite" className="contact-submit-feedback">
                {submitStatus === 'success' && <p className="is-success"><CheckCircle2 aria-hidden="true" size={15} />{es ? 'Mensaje enviado. Te responderé pronto.' : 'Message sent. I’ll get back to you soon.'}</p>}
                {(submitStatus === 'error' || submitStatus === 'configuration-error') && <p className="is-error">{es ? 'No se pudo enviar. Intenta nuevamente o escríbeme directamente.' : 'Unable to send. Please try again or email me directly.'}</p>}
              </div>
            </form>
          </Reveal>
        </div>

        <footer className="contact-footer">
          <div className="contact-footer-inner">
            <div className="contact-footer-email">
              <span>{es ? 'Contacto directo' : 'Direct contact'}</span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </div>
            <nav aria-label={es ? 'Redes sociales' : 'Social links'} className="contact-footer-socials">
              {socialLinks
                .filter((link) => link.kind !== 'email')
                .sort((a, b) => contactSocialOrder.indexOf(a.id) - contactSocialOrder.indexOf(b.id))
                .map((link) => {
                const Icon = socialIcon(link.id)
                return (
                  <a aria-label={link.label} className="hero-social-link" href={link.href} key={link.id} onClick={playClick} onMouseEnter={playHover} rel="noreferrer" target="_blank">
                    <span aria-hidden="true" className="hero-social-bubble">
                      <Icon aria-hidden="true" size={19} />
                      <span className="hero-social-fill" />
                    </span>
                    <span aria-hidden="true" className="hero-social-name">
                      {[...link.label].map((character, index) => (
                        <span key={`${link.id}-${index}`} style={{ transitionDelay: `${Math.abs(index - (link.label.length - 1) / 2) * 18}ms` }}>{character}</span>
                      ))}
                    </span>
                  </a>
                )
              })}
            </nav>
            <div aria-hidden="true" className="contact-footer-spacer" />
          </div>
        </footer>
      </div>
    </section>
  )
}
