/**
 * 프로필 편집 컴포넌트
 * 이력서 프로필 정보를 편집하는 컴포넌트
 */
import React from 'react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { ResumeConfig } from '@/types/resume';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ProfileEditorProps {
  /** 프로필 데이터 */
  profile: ResumeConfig['profile'];
  /** 프로필 업데이트 핸들러 */
  onProfileChange: (field: string, value: string) => void;
  /** 연락처 업데이트 핸들러 */
  onContactChange: (field: string, value: string) => void;
  /** 섹션 열림 상태 */
  isExpanded?: boolean;
  /** 섹션 토글 핸들러 */
  onToggle?: () => void;
}

/**
 * 프로필 편집 컴포넌트
 * 기본 정보, 이미지, 연락처 등을 편집
 */
export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  onProfileChange,
  onContactChange,
  isExpanded = true,
  onToggle,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 프로필 섹션 헤더 */}
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="font-medium">프로필 (Profile)</span>
        </div>
      </div>

      {/* 프로필 내용 */}
      {isExpanded && (
        <div className="p-4 space-y-4">
      {/* 기본 정보 */}
      <div className="space-y-3">
        <Input
          label="이름"
          value={profile.name}
          onChange={(e) => onProfileChange('name', e.target.value)}
          placeholder="이름을 입력하세요"
          fullWidth
        />
        
        <Input
          label="직군/역할"
          value={profile.role}
          onChange={(e) => onProfileChange('role', e.target.value)}
          placeholder="예: 백엔드 개발자"
          fullWidth
        />
        
        <Input
          label="프로필 이미지 URL"
          value={profile.image || ''}
          onChange={(e) => onProfileChange('image', e.target.value)}
          placeholder="예: /me.jpg"
          fullWidth
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            자기소개
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            value={profile.intro}
            onChange={(e) => onProfileChange('intro', e.target.value)}
            placeholder="자기소개를 입력하세요"
          />
        </div>
      </div>

      {/* 연락처 */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700">연락처</h4>
        
        <Input
          label="이메일"
          type="email"
          value={profile.contact.email || ''}
          onChange={(e) => onContactChange('email', e.target.value)}
          placeholder="email@example.com"
          fullWidth
        />
        
        <Input
          label="전화번호"
          type="tel"
          value={profile.contact.phone || ''}
          onChange={(e) => onContactChange('phone', e.target.value)}
          placeholder="010-0000-0000"
          fullWidth
        />
        
        <Input
          label="GitHub"
          value={profile.contact.github || ''}
          onChange={(e) => onContactChange('github', e.target.value)}
          placeholder="github.com/username"
          fullWidth
        />
        
        <Input
          label="블로그/웹사이트"
          value={profile.contact.blog || ''}
          onChange={(e) => onContactChange('blog', e.target.value)}
          placeholder="https://your-blog.com"
          fullWidth
        />
          </div>
        </div>
      )}
    </div>
  );
};