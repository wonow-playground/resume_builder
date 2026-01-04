/**
 * 이력서 아이템 컴포넌트
 * 개별 이력서 항목(경력, 프로젝트 등)을 표시
 */
import React from 'react';
import { SectionItem } from '@/types/resume';
import { formatText } from '@/utils/format';
import { ExternalLink } from 'lucide-react';

interface ResumeItemProps {
  /** 아이템 데이터 */
  item: SectionItem;
}

/**
 * 이력서 아이템 컴포넌트
 * 개별 항목의 상세 정보를 표시
 */
export const ResumeItem: React.FC<ResumeItemProps> = ({ item }) => {
  return (
    <div className="space-y-3">
      {/* 아이템 헤더 (제목, 부제, 날짜) */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 
            className="text-gray-900 font-semibold"
            style={{ fontSize: 'var(--sz-item-title)' }}
          >
            {item.title}
          </h3>
          
          {(item.subtitle || item.links) && (
            <div className="flex items-center gap-2 mt-1">
              {item.subtitle && (
                <span 
                  className="text-gray-600"
                  style={{ fontSize: 'var(--sz-subtitle)' }}
                >
                  {item.subtitle}
                </span>
              )}
              
              {/* 링크들 */}
              {item.links?.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 opacity-60 hover:opacity-100 transition-opacity"
                  title={link.label}
                  style={{ fontSize: 'var(--sz-text)' }}
                >
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          )}
        </div>
        
        {/* 날짜 */}
        {item.date && (
          <span 
            className="text-gray-500 whitespace-nowrap"
            style={{ fontSize: 'var(--sz-subtitle)' }}
          >
            {item.date}
          </span>
        )}
      </div>

      {/* 설명 */}
      {item.description && (
        <div 
          className="text-gray-700 leading-relaxed"
          style={{ fontSize: 'var(--sz-text)', lineHeight: 'var(--line-height)' }}
        >
          {formatText(item.description)}
        </div>
      )}

      {/* 상세 설명 (불렛 포인트) */}
      {item.points && item.points.length > 0 && (
        <ul className="space-y-2">
          {item.points.map((point, index) => (
            <li 
              key={index} 
              className="flex gap-3 text-gray-700"
              style={{ fontSize: 'var(--sz-text)', lineHeight: 'var(--line-height)' }}
            >
              <span className="text-gray-400 mt-1">•</span>
              <span className="flex-1">
                {formatText(point)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 기술 스택 */}
      {item.techStack && item.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {item.techStack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              style={{ fontSize: 'calc(var(--sz-text) * 0.875)' }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* 위치 정보 */}
      {item.location && (
        <div 
          className="text-gray-500"
          style={{ fontSize: 'var(--sz-subtitle)' }}
        >
          📍 {item.location}
        </div>
      )}

      {/* 중첩 아이템들 */}
      {item.subItems && item.subItems.length > 0 && (
        <div className="ml-8 pl-6 border-l-2 border-gray-200 space-y-4">
          {item.subItems.map((subItem) => (
            <ResumeItem key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};