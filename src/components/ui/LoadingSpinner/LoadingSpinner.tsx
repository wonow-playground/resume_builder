/**
 * 로딩 스피너 컴포넌트
 * 다양한 사이즈의 로딩 인디케이터
 */
import React from 'react';
import { clsx } from 'clsx';

export type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  /** 스피너 사이즈 */
  size?: SpinnerSize;
  /** 커스텀 클래스네임 */
  className?: string;
  /** 접근성을 위한 라벨 */
  label?: string;
}

/**
 * 로딩 스피너 컴포넌트
 * 
 * @example
 * <LoadingSpinner size="md" label="로딩 중..." />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label = '로딩 중...',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={clsx(
        'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={label}
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        {label}
      </span>
    </div>
  );
};