/**
 * 입력 필드 컴포넌트
 * 다양한 타입의 입력 필드를 지원하는 재사용 가능한 컴포넌트
 */
import React from 'react';
import { clsx } from 'clsx';

// 입력 필드 타입
export type InputType = 'text' | 'email' | 'tel' | 'password' | 'url' | 'number';
// 입력 필드 사이즈
export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 입력 필드 타입 */
  type?: InputType;
  /** 입력 필드 사이즈 */
  size?: InputSize;
  /** 라벨 */
  label?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 왼쪽 아이콘 */
  iconLeft?: React.ReactNode;
  /** 오른쪽 아이콘 */
  iconRight?: React.ReactNode;
}

/**
 * 재사용 가능한 입력 필드 컴포넌트
 * 
 * @example
 * <Input 
 *   label="이메일" 
 *   type="email" 
 *   placeholder="email@example.com"
 *   error={hasError}
 *   errorMessage="유효한 이메일을 입력해주세요"
 * />
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  size = 'md',
  label,
  error = false,
  errorMessage,
  fullWidth = false,
  iconLeft,
  iconRight,
  className,
  id,
  ...props
}) => {
  // 고유 ID 생성 - 컴포넌트 최상위에서 호출
  const generatedId = React.useId();
  const inputId = id || `input-${generatedId}`;
  
  // 기본 클래스네임
  const baseClasses = 'border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // 사이즈별 클래스네임
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };
  
  // 상태별 클래스네임
  const stateClasses = clsx(
    error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
    iconLeft && 'pl-10',
    iconRight && 'pr-10',
    fullWidth && 'w-full'
  );

  return (
    <div className={clsx(fullWidth && 'w-full', className)}>
      {label && (
        <label 
          htmlFor={inputId}
          className={clsx(
            'block text-sm font-medium mb-2',
            error ? 'text-red-700' : 'text-gray-700'
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* 왼쪽 아이콘 */}
        {iconLeft && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={clsx('text-gray-400', error && 'text-red-400')}>
              {iconLeft}
            </span>
          </div>
        )}
        
        {/* 입력 필드 */}
        <input
          id={inputId}
          type={type}
          className={clsx(
            baseClasses,
            sizeClasses[size],
            stateClasses
          )}
          {...props}
        />
        
        {/* 오른쪽 아이콘 */}
        {iconRight && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={clsx('text-gray-400', error && 'text-red-400')}>
              {iconRight}
            </span>
          </div>
        )}
      </div>
      
      {/* 에러 메시지 */}
      {error && errorMessage && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};