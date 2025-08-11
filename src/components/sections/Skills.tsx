// src/components/sections/Skills.tsx
import React, { useState, useEffect } from 'react';
import { Code, Server, Wrench, Palette, TrendingUp } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { skills } from '../../data/skills';
import { TechIcons } from '../../utils/tech';
import type { Skill } from '../../types/project';

interface SkillCardProps {
  skill: Skill;
  index: number;
  isVisible: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index, isVisible }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedLevel(skill.level);
      }, index * 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, skill.level, index]);

  // Obtener el componente de icono correspondiente
  const IconComponent = TechIcons[skill.name as keyof typeof TechIcons];

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        animationDelay: `${index * 50}ms`,
        transitionDelay: `${index * 50}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`}>
            {IconComponent ? (
              <IconComponent className="w-8 h-8" />
            ) : (
              <span className="text-2xl">{skill.icon}</span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {skill.name}
          </h3>
        </div>
        <span className={`text-sm font-bold transition-all duration-300 ${
          isHovered ? 'scale-110 text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400'
        }`}>
          {animatedLevel}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
          <div 
            className="h-2 transition-all duration-1000 ease-out rounded-full"
            style={{ 
              width: `${animatedLevel}%`,
              backgroundColor: skill.color,
              boxShadow: `0 0 10px ${skill.color}30`
            }}
          />
        </div>
        <div 
          className={`absolute top-0 h-2 rounded-full transition-opacity duration-300 ${
            isHovered ? 'opacity-50' : 'opacity-30'
          }`}
          style={{ 
            width: `${animatedLevel}%`,
            backgroundColor: skill.color,
            filter: 'blur(2px)'
          }}
        />
      </div>

      {/* Skill level indicator */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {skill.level >= 90 ? '🏆 Expert' : 
         skill.level >= 80 ? '🎯 Advanced' : 
         skill.level >= 70 ? '📈 Intermediate' : '🌱 Learning'}
      </div>
    </div>
  );
};

export const Skills: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('skills-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const categories = [
    { key: 'all', label: t('skills.categories.all', 'Todas'), icon: TrendingUp, count: skills.length },
    { key: 'frontend', label: t('skills.categories.frontend'), icon: Code, count: skills.filter(s => s.category === 'frontend').length },
    { key: 'backend', label: t('skills.categories.backend'), icon: Server, count: skills.filter(s => s.category === 'backend').length },
    { key: 'tools', label: t('skills.categories.tools'), icon: Wrench, count: skills.filter(s => s.category === 'tools').length },
    { key: 'design', label: t('skills.categories.design'), icon: Palette, count: skills.filter(s => s.category === 'design').length },
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  const averageLevel = Math.round(
    filteredSkills.reduce((acc, skill) => acc + skill.level, 0) / filteredSkills.length
  );

  return (
    <section 
      id="skills-section" 
      className="py-20 transition-colors duration-300 bg-white dark:bg-gray-800"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            {t('skills.title')} <span className="text-gradient">{t('skills.titleHighlight', 'Habilidades')}</span>
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-gray-600 dark:text-gray-400">
            Un resumen de las tecnologías y herramientas que domino, organizadas por categorías. 
            Siempre aprendiendo y manteniéndome actualizado con las últimas tendencias.
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span>Nivel promedio: {averageLevel}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span>{filteredSkills.length} habilidades</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                  activeCategory === category.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeCategory === category.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {filteredSkills.map((skill, index) => (
            <SkillCard 
              key={skill.name} 
              skill={skill} 
              index={index} 
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="p-6 text-center transition-transform duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl hover:scale-105">
            <div className="mb-3 text-3xl animate-bounce">🚀</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Aprendizaje Continuo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Siempre explorando nuevas tecnologías y mejorando mis habilidades existentes
            </p>
          </div>

          <div className="p-6 text-center transition-transform duration-300 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-xl hover:scale-105">
            <div className="mb-3 text-3xl animate-pulse">⚡</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Desarrollo Ágil
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Experiencia con metodologías ágiles y mejores prácticas de desarrollo
            </p>
          </div>

          <div className="p-6 text-center transition-transform duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl hover:scale-105">
            <div className="mb-3 text-3xl animate-spin-slow">🎯</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Enfoque en Calidad
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Código limpio, testing y documentación como pilares fundamentales
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            ¿Necesitas estas habilidades en tu proyecto?
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Estoy disponible para colaborar en proyectos desafiantes y emocionantes
          </p>
          <button className="px-8 py-4 font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl">
            Colaboremos juntos
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};