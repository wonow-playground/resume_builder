/**
 * 버튼 컴포넌트
 * 다양한 스타일과 사이즈를 지원하는 재사용 가능한 버튼
 * Tailwind CSS를 사용하여 스타일링
 */
import React from 'react';
import { clsx } from 'clsx';

// 버튼 변형 타입
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
// 버튼 사이즈 타입
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 변형 스타일 */
  variant?: ButtonVariant;
  /** 버튼 사이즈 */
  size?: ButtonSize;
  /** 로딩 상태 */
  loading?: boolean;
  /** 아이콘 (왼쪽) */
  iconLeft?: React.ReactNode;
  /** 아이콘 (오른쪽) */
  iconRight?: React.ReactNode;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 자식 요소 */
  children: React.ReactNode;
}

/**
 * 재사용 가능한 버튼 컴포넌트
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   저장하기
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}) => {
  // 비활성화 상태: 로딩 중이거나 명시적으로 disabled일 때
  const isDisabled = disabled || loading;

  // 기본 클래스네임
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 relative whitespace-nowrap';
  
  // 변형별 클래스네임
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 focus:ring-blue-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };
  
  // 사이즈별 클래스네임
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };
  
  // 상태별 클래스네임
  const stateClasses = clsx(
    isDisabled && 'opacity-50 cursor-not-allowed',
    fullWidth && 'w-full'
  );

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        stateClasses,
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* 로딩 스피너 */}
      {loading && (
        <div className="flex gap-1" aria-hidden="true">
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
      
      {/* 왼쪽 아이콘 */}
      {iconLeft && !loading && (
        <span className="flex items-center" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      
      {/* 버튼 텍스트 */}
      <span>{children}</span>
      
      {/* 오른쪽 아이콘 */}
      {iconRight && !loading && (
        <span className="flex items-center" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
};