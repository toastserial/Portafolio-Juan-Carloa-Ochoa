// src/components/sections/Contact.tsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin /*Twitter*/,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import emailjs from "emailjs-com";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("contact-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t(
        "contact.form.validation.nameRequired",
        "El nombre es requerido"
      );
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t(
        "contact.form.validation.nameMin",
        "El nombre debe tener al menos 2 caracteres"
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t(
        "contact.form.validation.emailRequired",
        "El email es requerido"
      );
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t(
        "contact.form.validation.emailInvalid",
        "Por favor ingresa un email válido"
      );
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = t(
        "contact.form.validation.subjectRequired",
        "El asunto es requerido"
      );
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = t(
        "contact.form.validation.subjectMin",
        "El asunto debe tener al menos 5 caracteres"
      );
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t(
        "contact.form.validation.messageRequired",
        "El mensaje es requerido"
      );
    } else if (formData.message.trim().length < 20) {
      newErrors.message = t(
        "contact.form.validation.messageMin",
        "El mensaje debe tener al menos 20 caracteres"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await emailjs.send(
        "service_wzlz7gp", // Reemplaza con tu Service ID de EmailJS
        "template_9i5uu1f", // Reemplaza con tu Template ID de EmailJS
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          time: new Date().toLocaleString("es-HN", {
            timeZone: "America/Tegucigalpa",
          }),
        },
        "BwBzznphHrwQlV-8C" // Reemplaza con tu Public Key de EmailJS
      );
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t("contact.info.email", "Email"),
      value: "jcochoag18@gmail.com",
      href: "mailto:jcochoag18@gmail.com",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Phone,
      label: t("contact.info.phone", "Teléfono"),
      value: "+504 96821640",
      href: "whatsapp://send?phone=50496821640",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: MapPin,
      label: t("contact.info.location", "Ubicación"),
      value: "Siguatepeque, Comayagua.",
      href: "https:google.com/maps?q=Siguatepeque,Comayagua",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/toastserial",
      color: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/tu-perfil",
      color: "hover:text-blue-600 dark:hover:text-blue-400",
    },
    /*{
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com/tu-usuario',
      color: 'hover:text-blue-400 dark:hover:text-blue-300'
    }*/
  ];

  return (
    <section
      id="contact-section"
      className="py-20 transition-colors duration-300 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            {t("contact.title")}{" "}
            <span className="text-gradient">
              {t("contact.titleHighlight", "Proyecto")}
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="p-8 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
              <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {t("contact.info.title")}
              </h3>

              <div className="mb-8 space-y-6">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center p-4 space-x-4 transition-colors duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group"
                    >
                      <div
                        className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:scale-110 transition-transform duration-200 ${item.color}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.label}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {t("contact.info.follow")}
                </p>
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 transition-all duration-200 hover:scale-110 ${link.color}`}
                        title={link.label}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Availability Status */}
              <div className="p-4 mt-8 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium text-green-800 dark:text-green-400">
                    {t("contact.available")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                  {t("contact.respond")}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="p-8 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
              <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {t("contact.form.msgme")}
              </h3>

              {/* Success/Error Messages */}
              {submitStatus === "success" && (
                <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-800 dark:text-green-400">
                      {t('contact.form.success')}
                    </span>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="font-medium text-red-800 dark:text-red-400">
                      {t('contact.form.error')}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("contact.form.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.name
                        ? "border-red-300 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder={t("contact.form.namePlaceholder")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.email
                        ? "border-red-300 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder={t("contact.form.emailPlaceholder")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("contact.form.subject")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.subject
                        ? "border-red-300 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder={t("contact.form.subjectPlaceholder")}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                      errors.message
                        ? "border-red-300 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder={t("contact.form.messagePlaceholder")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.message.length}/500 {t("contact.form.quantity")}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-medium transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl"
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      <span>{t("contact.form.sending")}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t("contact.form.send")}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  💡 <strong>Tip:</strong> {t("contact.extras")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          className={`mt-20 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t("faq.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-200">
              {t("faq.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
              <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {t("faq.items.question1")}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("faq.items.answer1")}
              </p>
            </div>

            <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
              <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {t("faq.items.question2")}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("faq.items.answer2")}
              </p>
            </div>

            <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
              <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {t("faq.items.question3")}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("faq.items.answer3")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
