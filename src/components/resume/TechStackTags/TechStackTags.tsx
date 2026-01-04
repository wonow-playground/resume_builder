/**
 * 기술 스택 태그 컴포넌트
 * 기술 스택 목록을 태그로 렌더링
 */
import React from 'react';
import { clsx } from 'clsx';

interface TechStackTagsProps {
  /** 기술 스택 배열 */
  techStack: string[];
  /** 커스텀 클래스네임 */
  className?: string;
  /** 태그 사이즈 */
  size?: 'sm' | 'md';
  /** 최대 표시 개수 */
  maxVisible?: number;
}

/**
 * 기술 스택 태그 컴포넌트
 * 
 * @example
 * <TechStackTags 
 *   techStack={['React', 'TypeScript', 'Node.js']} 
 *   size="sm" 
 * />
 */
export const TechStackTags: React.FC<TechStackTagsProps> = ({ 
  techStack, 
  className,
  size = 'md',
  maxVisible
}) => {
  if (!techStack || techStack.length === 0) {
    return null;
  }

  const displayTechStack = maxVisible ? techStack.slice(0, maxVisible) : techStack;
  const hasMore = maxVisible && techStack.length > maxVisible;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <div className={clsx('flex flex-wrap gap-1 mt-2', className)}>
      {displayTechStack.map((tech, index) => (
        <span
          key={index}
          className={clsx(
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full',
            sizeClasses[size]
          )}
        >
          {tech}
        </span>
      ))}
      {hasMore && (
        <span className={clsx(
          'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full',
          sizeClasses[size]
        )}>
          +{techStack.length - maxVisible}
        </span>
      )}
    </div>
  );
};