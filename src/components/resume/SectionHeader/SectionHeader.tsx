/**
 * 섹션 헤더 컴포넌트
 * 이력서 섹션의 제목 렌더링
 */
import React from 'react';
import { clsx } from 'clsx';

interface SectionHeaderProps {
  /** 섹션 제목 */
  title: string;
  /** 커스텀 클래스네임 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
}

/**
 * 섹션 헤더 컴포넌트
 * 
 * @example
 * <SectionHeader title="Experience" />
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  className,
  style 
}) => {
  return (
    <h2 
      className={clsx(
        'text-[var(--sz-header)] font-bold text-[var(--text-title)] mb-[calc(0.5rem*var(--scale-margin))]',
        className
      )}
      style={style}
    >
      {title}
    </h2>
  );
};