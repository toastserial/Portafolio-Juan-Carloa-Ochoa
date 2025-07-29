// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/tu-usuario',
      label: 'GitHub',
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/juan-carlos-ochoa-guzm%C3%A1n-28a256373/',
      label: 'LinkedIn',
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    {
      icon: Mail,
      href: 'mailto:tu@email.com',
      label: 'Email',
      color: 'hover:text-red-600 dark:hover:text-red-400'
    }
  ];

  const quickLinks = [
    { name: 'Inicio', href: 'inicio' },
    { name: 'Proyectos', href: 'projects-section' },
    { name: 'Habilidades', href: 'skills-section' },
    { name: 'Contacto', href: 'contact-section' }
  ];

  const services = [
    'Desarrollo Frontend',
    'Desarrollo Full Stack',
    'UI/UX Design',
    'Consultoría Tech'
  ];

  return (
    <footer className="relative overflow-hidden text-white bg-gray-900 dark:bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-block mb-4 text-2xl font-bold text-gradient">
                Juan Carlos Ochoa
              </Link>
              <p className="mb-6 leading-relaxed text-gray-400">
                Desarrollador apasionado por crear experiencias web excepcionales 
                usando las últimas tecnologías y mejores prácticas.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 bg-gray-800 dark:bg-gray-900 rounded-full text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-gray-700 dark:hover:bg-gray-800 ${link.color}`}
                      aria-label={link.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        const section = document.getElementById(link.href);
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center text-gray-400 transition-colors duration-200 hover:text-white group"
                      style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
                    >
                      <span className="w-2 h-2 mr-3 transition-transform duration-200 transform scale-0 bg-blue-500 rounded-full group-hover:scale-100" />
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">Experiencia</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <span className="w-2 h-2 mr-3 bg-purple-500 rounded-full" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="flex-shrink-0 w-5 h-5 mt-1 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <a 
                      href="mailto:jcochoag18@gmail.com" 
                      className="text-white transition-colors duration-200 hover:text-blue-400"
                    >
                      jcochoag18@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-5 h-5 mt-1 bg-green-500 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Estado</p>
                    <p className="font-medium text-green-400">Disponible para proyectos</p>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-8">
                <h4 className="mb-3 text-sm font-semibold text-white">Newsletter</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="flex-1 px-3 py-2 text-sm text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-l-lg dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 transition-colors duration-200 bg-blue-600 rounded-r-lg hover:bg-blue-700">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Recibe actualizaciones sobre mis proyectos y artículos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-gray-900">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>© {currentYear} Juan Carlos Ochoa Guzman | Siguatepeque, Comayagua.</span>
              </div>

              {/* Tech Stack */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Construido con:</span>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-blue-400 bg-gray-800 rounded dark:bg-gray-900">React</span>
                  <span className="px-2 py-1 text-blue-600 bg-gray-800 rounded dark:bg-gray-900">TypeScript</span>
                  <span className="px-2 py-1 bg-gray-800 rounded dark:bg-gray-900 text-cyan-400">Tailwind</span>
                </div>
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 text-gray-400 transition-colors duration-200 hover:text-white group"
                aria-label="Volver arriba"
              >
                <span className="text-sm">Volver arriba</span>
                <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute w-20 h-20 rounded-full top-10 right-10 bg-blue-500/5 animate-pulse" />
        <div className="absolute w-16 h-16 delay-1000 rounded-full bottom-20 left-10 bg-purple-500/5 animate-pulse" />
      </div>
    </footer>
  );
};