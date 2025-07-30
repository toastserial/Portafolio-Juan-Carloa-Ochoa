// src/components/common/ProjectCard.tsx
import React, { useState } from 'react';
import { Github, ExternalLink, Eye, Calendar, Tag } from 'lucide-react';
import type { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      web: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      mobile: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      desktop: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      api: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return colors[category as keyof typeof colors] || colors.web;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      planned: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[status as keyof typeof colors] || colors.completed;
  };

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
        project.featured ? 'ring-2 ring-blue-500/20 dark:ring-blue-400/20' : ''
      }`}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'slideUp 0.6s ease-out forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute z-20 top-4 left-4">
          <span className="px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500">
            ⭐ Destacado
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        <img 
          src={project.image} 
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Action Buttons */}
        <div className={`absolute bottom-4 right-4 flex space-x-2 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-900 transition-colors duration-200 rounded-full bg-white/90 dark:bg-gray-800/90 dark:text-white hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm"
              title="Ver proyecto"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-900 transition-colors duration-200 rounded-full bg-white/90 dark:bg-gray-800/90 dark:text-white hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm"
              title="Ver código"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 transition-colors duration-200 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {project.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{project.year}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center mb-4 space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(project.category)}`}>
            {project.category.toUpperCase()}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
            {project.status === 'in-progress' ? 'En progreso' : 
             project.status === 'completed' ? 'Completado' : 'Planeado'}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Tag className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tecnologías</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-400">
                +{project.technologies.length - 4} más
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center space-x-2 text-blue-600 transition-colors duration-200 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Ver detalles</span>
          </button>
          
          <div className="flex space-x-2">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                title="Ver proyecto"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                title="Ver código"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};