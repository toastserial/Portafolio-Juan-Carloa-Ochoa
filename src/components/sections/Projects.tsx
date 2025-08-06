// src/components/sections/Projects.tsx
import React, { useState, useEffect } from 'react';
import { Filter, Grid3X3, List, Search } from 'lucide-react';
import { ProjectCard } from '../common/ProjectCard';
import { projects } from '../../data/projects';
import type { Project } from '../../types/project';

type FilterType = 'all' | 'web' | 'mobile' | 'desktop' | 'api';
type ViewType = 'grid' | 'list';

export const Projects: React.FC = () => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('projects-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filter by category
    if (activeFilter !== 'all') {
      filtered = filtered.filter(project => project.category === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredProjects(filtered);
  }, [activeFilter, searchTerm]);

  const filterOptions = [
    { key: 'all', label: 'Todos', count: projects.length },
    { key: 'web', label: 'Web', count: projects.filter(p => p.category === 'web').length },
    { key: 'mobile', label: 'Móvil', count: projects.filter(p => p.category === 'mobile').length },
    { key: 'api', label: 'API', count: projects.filter(p => p.category === 'api').length },
  ];

  return (
    <section 
      id="projects-section" 
      className="py-20 transition-colors duration-300 bg-gray-50 dark:bg-gray-900"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            Mis <span className="text-gradient">Proyectos</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Una colección de proyectos que demuestran mis habilidades en desarrollo web, 
            móvil y backend. Cada proyecto está construido con las mejores prácticas y tecnologías modernas.
          </p>
        </div>

        {/* Controls */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Buscar proyectos o tecnologías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center space-x-4">
              {/* Category Filters */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div className="flex p-1 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                  {filterOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setActiveFilter(option.key as FilterType)}
                      className={`px-4 py-2 text-sm font-medium rounded transition-all duration-200 ${
                        activeFilter === option.key
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                      <span className={`ml-2 text-xs ${
                        activeFilter === option.key ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        ({option.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex p-1 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <button
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewType === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  title="Vista en grilla"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewType === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  title="Vista en lista"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={`transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {filteredProjects.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                No se encontraron proyectos
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Intenta ajustar los filtros o el término de búsqueda
              </p>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewType === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};