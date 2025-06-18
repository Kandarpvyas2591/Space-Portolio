'use client';

import { HTMLAttributes, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface SkillCategoriesProps extends HTMLAttributes<HTMLDivElement> {
  categories: string[];
}

export function SkillCategories({
  categories,
  className,
  ...props
}: SkillCategoriesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Add a subtle bouncing animation effect with performance optimization
  useEffect(() => {
    let isActive = true;
    let timeoutId: NodeJS.Timeout;

    // Only run animation if the user is active on the page
    const handleVisibilityChange = () => {
      isActive = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animateBadge = () => {
      if (!isActive || !containerRef.current) {
        timeoutId = setTimeout(animateBadge, 3000);
        return;
      }

      const badges = containerRef.current.querySelectorAll('.skill-badge');
      if (badges.length) {
        const randomIndex = Math.floor(Math.random() * badges.length);
        const badge = badges[randomIndex];

        badge.classList.add('animate-bounce');
        setTimeout(() => {
          if (badge) badge.classList.remove('animate-bounce');
        }, 1000);
      }

      timeoutId = setTimeout(animateBadge, 3000);
    };

    timeoutId = setTimeout(animateBadge, 3000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 px-4 max-w-3xl mx-auto',
        className
      )}
      {...props}>
      {categories.map((category, index) => (
        <span
          key={index}
          className="skill-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-500/20 text-purple-200 border border-purple-500/30">
          {category}
        </span>
      ))}
    </div>
  );
}
