import React, { useState, useEffect } from 'react';
import { skills } from '../../data/skills';
import { Code, Server, Wrench, Palette, TrendingUp } from 'lucide-react';
import { TechIcons } from '../../util/tech';

interface SkillCardProps {
  skill: any;
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

  const IconComponent = TechIcons[skill.name as keyof typeof TechIcons];

  return (
    <div 
      className={`group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } border border-transparent hover:border-blue-200 dark:hover:border-blue-800`}
      style={{ 
        animationDelay: `${index * 50}ms`,
        transitionDelay: `${index * 50}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`transition-transform duration-300 ${isHovered ? 'scale-125 rotate-12' : ''}`}>
            {IconComponent ? (
              <IconComponent className="w-8 h-8" />
            ) : (
              <div 
                className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-lg"
                style={{ backgroundColor: skill.color }}
              >
                {skill.name[0]}
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 transition-colors dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {skill.name}
          </h3>
        </div>
        <span 
          className={`text-sm font-bold transition-all duration-300 ${
            isHovered ? 'scale-110 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {animatedLevel}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
          <div 
            className="relative h-3 transition-all duration-1000 ease-out rounded-full"
            style={{ 
              width: `${animatedLevel}%`,
              backgroundColor: skill.color,
              boxShadow: `0 0 15px ${skill.color}60`
            }}
          >
            {/* Animated shimmer effect */}
            <div 
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              style={{
                animation: isHovered ? 'shimmer 1.5s ease-in-out infinite' : 'none'
              }}
            />
          </div>
        </div>
        
        {/* Glow effect */}
        <div 
          className={`absolute top-0 h-3 rounded-full transition-opacity duration-300 ${
            isHovered ? 'opacity-50' : 'opacity-20'
          }`}
          style={{ 
            width: `${animatedLevel}%`,
            backgroundColor: skill.color,
            filter: 'blur(4px)'
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
    { key: 'all', label: 'Todas', icon: TrendingUp, count: skills.length },
    { key: 'frontend', label: 'Frontend', icon: Code, count: skills.filter(s => s.category === 'frontend').length },
    { key: 'backend', label: 'Backend', icon: Server, count: skills.filter(s => s.category === 'backend').length },
    { key: 'tools', label: 'Herramientas', icon: Wrench, count: skills.filter(s => s.category === 'tools').length },
    { key: 'design', label: 'Diseño', icon: Palette, count: skills.filter(s => s.category === 'design').length },
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
      className="py-20 transition-colors duration-300 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            Mis <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Habilidades</span>
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-gray-600 dark:text-gray-400">
            Tecnologías y herramientas con las que trabajo para crear experiencias increíbles
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span>Nivel promedio: {averageLevel}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span>{filteredSkills.length} tecnologías</span>
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
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeCategory === category.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
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
          <div className="p-6 text-center transition-transform duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl hover:scale-105">
            <div className="mb-3 text-3xl animate-bounce">🚀</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Aprendizaje Continuo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Siempre explorando nuevas tecnologías y mejorando mis habilidades existentes
            </p>
          </div>

          <div className="p-6 text-center transition-transform duration-300 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl hover:scale-105">
            <div className="mb-3 text-3xl animate-pulse">⚡</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Desarrollo Ágil
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Experiencia con metodologías ágiles y mejores prácticas de desarrollo
            </p>
          </div>

          <div className="p-6 text-center transition-transform duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:scale-105">
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
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
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