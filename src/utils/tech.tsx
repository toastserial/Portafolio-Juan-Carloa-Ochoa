import { 
  FaReact, 
  FaJs, 
  FaPython, 
  FaNodeJs, 
  FaCss3Alt, 
  FaHtml5, 
  FaGitAlt, 
  FaFigma,
  FaPhp,
  FaDocker
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiTailwindcss, 
  SiNextdotjs, 
  SiExpress, 
  SiMysql, 
  SiPostgresql,
  SiExcalidraw
} from 'react-icons/si';

export const TechIcons = {
  React: ({ className }: { className?: string }) => (
    <FaReact className={`${className} text-[#61DAFB] animate-spin-slow`} />
  ),
  JavaScript: ({ className }: { className?: string }) => (
    <FaJs className={`${className} text-[#F7DF1E] hover:animate-bounce`} />
  ),
  TypeScript: ({ className }: { className?: string }) => (
    <SiTypescript className={`${className} text-[#3178C6] hover:animate-pulse`} />
  ),
  'Next.js': ({ className }: { className?: string }) => (
    <SiNextdotjs className={`${className} text-black dark:text-white hover:animate-pulse`} />
  ),
  Python: ({ className }: { className?: string }) => (
    <FaPython className={`${className} text-[#3776AB] hover:animate-wiggle`} />
  ),
  'Node.js': ({ className }: { className?: string }) => (
    <FaNodeJs className={`${className} text-[#339933] hover:animate-bounce`} />
  ),
  'Express.js': ({ className }: { className?: string }) => (
    <SiExpress className={`${className} text-black dark:text-white hover:animate-pulse`} />
  ),
  PHP: ({ className }: { className?: string }) => (
    <FaPhp className={`${className} text-[#777BB4] hover:animate-bounce`} />
  ),
  MySQL: ({ className }: { className?: string }) => (
    <SiMysql className={`${className} text-[#4479A1] hover:animate-pulse`} />
  ),
  PostgreSQL: ({ className }: { className?: string }) => (
    <SiPostgresql className={`${className} text-[#336791] hover:animate-pulse`} />
  ),
  'Tailwind CSS': ({ className }: { className?: string }) => (
    <SiTailwindcss className={`${className} text-[#06B6D4] hover:animate-wiggle`} />
  ),
  CSS: ({ className }: { className?: string }) => (
    <FaCss3Alt className={`${className} text-[#1572B6] hover:animate-pulse`} />
  ),
  HTML: ({ className }: { className?: string }) => (
    <FaHtml5 className={`${className} text-[#E34F26] hover:animate-pulse`} />
  ),
  Git: ({ className }: { className?: string }) => (
    <FaGitAlt className={`${className} text-[#F05032] hover:animate-spin`} />
  ),
  Docker: ({ className }: { className?: string }) => (
    <FaDocker className={`${className} text-[#2496ED] hover:animate-bounce`} />
  ),
  Figma: ({ className }: { className?: string }) => (
    <FaFigma className={`${className} text-[#F24E1E] hover:animate-bounce`} />
  ),
  Excalidraw: ({ className }: { className?: string }) => (
    <SiExcalidraw className={`${className} text-[#FF61F6] hover:animate-bounce`} />
  )
};
