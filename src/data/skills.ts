// src/data/skills.ts
import type { Skill } from '../types/project';

export const skills: Skill[] = [
  // Frontend
  {
    name: 'React',
    level: 95,
    category: 'frontend',
    icon: '⚛️',
    color: '#61DAFB'
  },
  {
    name: 'TypeScript',
    level: 90,
    category: 'frontend',
    icon: '🔷',
    color: '#3178C6'
  },
  {
    name: 'JavaScript',
    level: 95,
    category: 'frontend',
    icon: '📜',
    color: '#F7DF1E'
  },
  {
    name: 'Next.js',
    level: 85,
    category: 'frontend',
    icon: '▲',
    color: '#000000'
  },
  {
    name: 'Tailwind CSS',
    level: 90,
    category: 'frontend',
    icon: '🎨',
    color: '#06B6D4'
  },

  // Backend
  {
    name: 'Node.js',
    level: 88,
    category: 'backend',
    icon: '🟢',
    color: '#339933'
  },
  {
    name: 'Express.js',
    level: 85,
    category: 'backend',
    icon: '🚂',
    color: '#000000'
  },
  {
    name:'PHP',
    level: 80,
    category: 'backend',
    icon: '🐘',
    color: '#777BB4'
  },
  {
    name: 'MySQL',
    level: 82,
    category: 'backend',
    icon: '🐬',
    color: '#3776AB'
  },
  {
    name: 'PostgreSQL',
    level: 50,
    category: 'backend',
    icon: '🐘',
    color: '#336791'
  },

  // Tools
  {
    name: 'Git',
    level: 90,
    category: 'tools',
    icon: '<>',
    color: '#F05032'
  },
  {
    name: 'Docker',
    level: 75,
    category: 'tools',
    icon: '🐳',
    color: '#2496ED'
  },

  // Design
  {
    name: 'Figma',
    level: 70,
    category: 'design',
    icon: '🎨',
    color: '#F24E1E'
  },
  {
    name: 'Excalidraw',
    level: 60,
    category: 'design',
    icon: '✏️',
    color: '#FF61F6'
  }
  ];