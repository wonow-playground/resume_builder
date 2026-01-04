/**
 * 아이콘 컴포넌트
 * Lucide React 아이콘 래퍼
 */
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

interface IconProps {
  /** Lucide React 아이콘 컴포넌트 */
  icon: LucideIcon;
  /** 아이콘 사이즈 */
  size?: IconSize | number;
  /** 아이콘 색상 */
  color?: string;
  /** 커스텀 클래스네임 */
  className?: string;
  /** 접근성을 위한 라벨 */
  label?: string;
}

/**
 * 아이콘 컴포넌트
 * 
 * @example
 * <Icon icon={Save} size="md" color="blue" />
 */
export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  color,
  className,
  label,
}) => {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };

  const iconSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <span
      className={clsx('inline-flex items-center justify-center', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <IconComponent 
        size={iconSize} 
        color={color}
        style={{ color }}
      />
    </span>
  );
};