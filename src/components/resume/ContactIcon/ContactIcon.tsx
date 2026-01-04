/**
 * 연락처 아이콘 컴포넌트
 * 연락처 타입에 따른 아이콘 렌더링
 */
import React from 'react';
import { Mail, Github, BookOpen, Smartphone, Globe, Link } from 'lucide-react';
import { clsx } from 'clsx';

export type ContactType = 'email' | 'github' | 'blog' | 'phone' | 'website' | 'linkedin';

interface ContactIconProps {
  /** 연락처 타입 */
  type: ContactType | string;
  /** 아이콘 사이즈 */
  size?: number | 'sm' | 'md' | 'lg';
  /** 커스텀 클래스네임 */
  className?: string;
}

/**
 * 연락처 아이콘 컴포넌트
 * 
 * @example
 * <ContactIcon type="email" size="sm" />
 */
export const ContactIcon: React.FC<ContactIconProps> = ({ 
  type, 
  size = 'sm', 
  className 
}) => {
  const iconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
    email: Mail,
    github: Github,
    blog: BookOpen,
    phone: Smartphone,
    website: Globe,
    linkedin: Globe,
    default: Link,
  };

  const IconComponent = iconMap[type.toLowerCase()] || iconMap.default;
  
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  const iconSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <span className={clsx('inline-flex items-center', className)}>
      <IconComponent size={iconSize} />
    </span>
  );
};