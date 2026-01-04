/**
 * 이력서 프리뷰 컴포넌트
 * 실시간으로 이력서를 미리보는 컴포넌트
 */
import React from 'react';
import Image from 'next/image';
import { ResumeConfig } from '@/types/resume';
import { ThemeCategory } from '@/types/style';
import { ResumeItem } from '../ResumeItem/ResumeItem';
import { Mail, Github, BookOpen, Smartphone, Globe } from 'lucide-react';

interface ResumePreviewProps {
  /** 이력서 데이터 */
  data: ResumeConfig;
}

/**
 * 이력서 프리뷰 컴포넌트
 * 실시간으로 이력서를 렌더링하여 보여줌
 */
export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const { profile, sections } = data;

  /**
   * 테마 스타일 생성 함수
   */
  const getThemeStyles = (category: ThemeCategory = 'global'): React.CSSProperties => {
    if (!data.styles?.theme) return {};
    const theme = data.styles.theme[category] || data.styles.theme.global;
    
    return {
      '--sz-header': `${theme.headerSize}rem`,
      '--sz-item-title': `${theme.itemTitleSize}rem`,
      '--sz-subtitle': `${theme.subtitleSize}rem`,
      '--sz-text': `${theme.textSize}rem`,
      '--scale-margin': theme.spacing,
    } as React.CSSProperties;
  };

  /**
   * 연락처 아이콘 컴포넌트
   */
  const ContactIcon: React.FC<{ type: string }> = ({ type }) => {
    const iconMap = {
      email: <Mail size={16} />,
      github: <Github size={16} />,
      blog: <BookOpen size={16} />,
      phone: <Smartphone size={16} />,
    };
    
    return iconMap[type as keyof typeof iconMap] || <Globe size={16} />;
  };

  // 전역 스타일 변수
  const globalStyles = {
    '--scale-section': data.styles?.sectionSpacing || 1,
    '--line-height': data.styles?.lineHeight || 1.6,
  } as React.CSSProperties;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg" style={globalStyles}>
      {/* 프로필 섹션 */}
      <section style={getThemeStyles('profile')} className="p-8 border-b border-gray-200">
        <header className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-gray-900 mb-2" style={{ fontSize: 'var(--sz-header)' }}>
              {profile.name}
            </h1>
            <div className="text-blue-600 mb-4" style={{ fontSize: 'var(--sz-subtitle)' }}>
              {profile.role}
            </div>
            
            {profile.intro && (
              <div 
                className="text-gray-700 mb-6 leading-relaxed"
                style={{ fontSize: 'var(--sz-text)', lineHeight: 'var(--line-height)' }}
              >
                {profile.intro}
              </div>
            )}

            {/* 연락처 목록 */}
            <div className="flex flex-wrap gap-4">
              {Object.entries(profile.contact).map(([key, value]) => {
                if (!value) return null;
                
                let href = value;
                if (key === 'email') href = `mailto:${value}`;
                else if (!value.startsWith('http')) href = `https://${value}`;

                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    style={{ fontSize: 'var(--sz-text)' }}
                  >
                    <ContactIcon type={key} />
                    <span>{value}</span>
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* 프로필 이미지 */}
          {profile.image && profile.image.trim() !== '' && (
            <Image
              src={profile.image}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              width={96}
              height={96}
            />
          )}
        </header>
      </section>

      {/* 섹션들 */}
      <div className="divide-y divide-gray-200">
        {sections.map((section) => {
          if (section.visible === false) return null;

          return (
            <section
              key={section.id}
              className="p-8"
              style={{
                ...getThemeStyles(section.type as ThemeCategory),
                margin: `calc(1rem * var(--scale-section)) 0`,
              }}
            >
              {/* 섹션 제목 */}
              <h2 
                className="text-gray-900 font-semibold mb-6"
                style={{ fontSize: 'var(--sz-header)' }}
              >
                {section.title}
              </h2>
              
              {/* 섹션 아이템들 */}
              <div className="space-y-6">
                {section.items.map((item) => (
                  <ResumeItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};