import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import { useRef, useState } from 'react'
import type { FormEvent, PointerEvent } from 'react'
import { socialLinks } from '../../data/socialLinks'
import type { Locale } from '../../types/content'
import { Reveal } from '../ui/Reveal'

const EMAIL = 'jcochoag18@gmail.com'
const PHONE = '+504 9682-1640'
const MAX_MESSAGE_LENGTH = 500
type SubmitStatus = 'idle' | 'success' | 'error' | 'configuration-error'

export function ContactSection({ locale }: { locale: Locale }) {
  const es = locale === 'es'
  const [copied, setCopied] = useState(false)
  const [messageLength, setMessageLength] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const moveContactLight = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return
    const section = sectionRef.current
    if (!section) return
    const bounds = section.getBoundingClientRect()
    section.style.setProperty('--contact-x', `${event.clientX - bounds.left}px`)
    section.style.setProperty('--contact-y', `${event.clientY - bounds.top}px`)
    section.style.setProperty('--contact-active', '1')
  }

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '')
    const senderEmail = String(data.get('email') ?? '')
    const subject = String(data.get('subject') ?? '')
    const message = String(data.get('message') ?? '')
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setSubmitStatus('configuration-error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
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
      setMessageLength(0)
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="section-shell contact-section"
      id="contact"
      onPointerLeave={() =>
        sectionRef.current?.style.setProperty('--contact-active', '0')
      }
      onPointerMove={moveContactLight}
      ref={sectionRef}
    >
      <div aria-hidden="true" className="contact-cursor-layer">
        <span />
      </div>
      <Reveal className="contact-heading">
        <p className="technical-label">{es ? '06 / Contacto' : '06 / Contact'}</p>
        <h2>
          {es
            ? 'Convirtamos una idea en algo útil.'
            : 'Let’s turn an idea into something useful.'}
        </h2>
        <p>
          {es
            ? 'Cuéntame el contexto, el problema y qué necesitas poner en marcha.'
            : 'Tell me the context, the problem, and what you need to get moving.'}
        </p>
      </Reveal>

      <div className="contact-grid">
        <Reveal className="contact-card contact-information">
          <div className="contact-card-heading">
            <p className="technical-label">{es ? 'Canal directo' : 'Direct line'}</p>
            <h3>{es ? 'Información de contacto' : 'Contact information'}</h3>
          </div>

          <div className="contact-methods">
            <a href={`mailto:${EMAIL}`}>
              <span className="contact-method-icon">
                <Mail aria-hidden="true" size={19} />
              </span>
              <span>
                <small>Email</small>
                <strong>{EMAIL}</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <a href="tel:+50496821640">
              <span className="contact-method-icon">
                <Phone aria-hidden="true" size={19} />
              </span>
              <span>
                <small>{es ? 'Teléfono' : 'Phone'}</small>
                <strong>{PHONE}</strong>
              </span>
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <div className="contact-method">
              <span className="contact-method-icon">
                <MapPin aria-hidden="true" size={19} />
              </span>
              <span>
                <small>{es ? 'Ubicación' : 'Location'}</small>
                <strong>Siguatepeque, Comayagua · Honduras</strong>
              </span>
            </div>
          </div>

          <button className="copy-button" onClick={copyEmail} type="button">
            <Copy aria-hidden="true" size={15} />
            {copied
              ? es ? 'Correo copiado' : 'Email copied'
              : es ? 'Copiar correo' : 'Copy email'}
          </button>

          <div className="contact-socials">
            <span>{es ? 'Encuéntrame en' : 'Find me on'}</span>
            <div>
              {socialLinks
                .filter((link) => link.kind !== 'email')
                .map((link) => (
                  <a
                    href={link.href}
                    key={link.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden="true" size={14} />
                  </a>
                ))}
            </div>
          </div>

          <div className="availability-card">
            <CheckCircle2 aria-hidden="true" size={18} />
            <div>
              <strong>
                {es
                  ? 'Disponible para nuevos proyectos'
                  : 'Available for new projects'}
              </strong>
              <span>
                {es
                  ? 'Normalmente respondo en menos de 24 horas.'
                  : 'I usually reply within 24 hours.'}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal className="contact-card contact-form-card" delay={0.08}>
          <div className="contact-card-heading">
            <p className="technical-label">{es ? 'Nuevo mensaje' : 'New message'}</p>
            <h3>{es ? 'Escríbeme' : 'Send me a message'}</h3>
          </div>
          <form onSubmit={sendMessage} ref={formRef}>
            <label>
              <span>{es ? 'Nombre completo' : 'Full name'} *</span>
              <input
                autoComplete="name"
                name="name"
                placeholder={es ? 'Tu nombre completo' : 'Your full name'}
                required
                type="text"
              />
            </label>
            <label>
              <span>Email *</span>
              <input
                autoComplete="email"
                name="email"
                placeholder="tu@email.com"
                required
                type="email"
              />
            </label>
            <label>
              <span>{es ? 'Asunto' : 'Subject'} *</span>
              <input
                name="subject"
                placeholder={
                  es ? '¿En qué puedo ayudarte?' : 'How can I help?'
                }
                required
                type="text"
              />
            </label>
            <label>
              <span>{es ? 'Mensaje' : 'Message'} *</span>
              <textarea
                maxLength={MAX_MESSAGE_LENGTH}
                name="message"
                onChange={(event) => setMessageLength(event.target.value.length)}
                placeholder={
                  es
                    ? 'Cuéntame sobre el proyecto, la idea o el problema...'
                    : 'Tell me about the project, idea, or problem...'
                }
                required
                rows={6}
              />
              <small className="message-counter">
                {messageLength}/{MAX_MESSAGE_LENGTH}
              </small>
            </label>
            <button
              className="contact-submit"
              disabled={isSubmitting}
              type="submit"
            >
              <Send aria-hidden="true" size={17} />
              {isSubmitting
                ? es ? 'Enviando...' : 'Sending...'
                : es ? 'Enviar mensaje' : 'Send message'}
            </button>
            <div aria-live="polite" className="contact-submit-feedback">
              {submitStatus === 'success' && (
                <p className="is-success">
                  <CheckCircle2 aria-hidden="true" size={15} />
                  {es
                    ? 'Mensaje enviado. Te responderé lo antes posible.'
                    : 'Message sent. I’ll get back to you as soon as possible.'}
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="is-error">
                  {es
                    ? 'No se pudo enviar. Intenta nuevamente o utiliza el correo directo.'
                    : 'Unable to send. Try again or use the direct email link.'}
                </p>
              )}
              {submitStatus === 'configuration-error' && (
                <p className="is-error">
                  {es
                    ? 'El formulario no está configurado todavía. Utiliza el correo directo.'
                    : 'The form is not configured yet. Please use the direct email link.'}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
