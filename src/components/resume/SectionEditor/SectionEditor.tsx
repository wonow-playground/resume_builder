/**
 * 섹션 편집 컴포넌트
 * 이력서 섹션(경력, 프로젝트 등)을 편집하는 컴포넌트
 */
import React from 'react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { TechStackInput } from '@/components/ui';
import { Section, SectionItem } from '@/types/resume';
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';

interface SectionEditorProps {
  /** 섹션 데이터 */
  section: Section;
  /** 섹션 열림 상태 */
  isOpen: boolean;
  /** 섹션 토글 핸들러 */
  onToggle: () => void;
  /** 섹션 표시/숨김 토글 핸들러 */
  onVisibilityToggle: () => void;
  /** 섹션 제목 변경 핸들러 */
  onTitleChange: (title: string) => void;
  /** 항목 추가 핸들러 */
  onItemAdd: () => void;
  /** 항목 삭제 핸들러 */
  onItemRemove: (itemId: string) => void;
  /** 항목 변경 핸들러 */
  onItemChange: (itemId: string, field: keyof SectionItem, value: any) => void;
  /** 포인트 추가 핸들러 */
  onPointAdd: (itemId: string) => void;
  /** 포인트 제거 핸들러 */
  onPointRemove: (itemId: string, pointIndex: number) => void;
  /** 포인트 변경 핸들러 */
  onPointChange: (itemId: string, pointIndex: number, value: string) => void;
  /** 드래그 핸들러 속성 */
  dragHandleProps?: any;
  /** 커스텀 클래스네임 */
  className?: string;
}

/**
 * 섹션 편집 컴포넌트
 * 섹션별 아이템들을 편집하고 관리
 */
export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  isOpen,
  onToggle,
  onVisibilityToggle,
  onTitleChange,
  onItemAdd,
  onItemRemove,
  onItemChange,
  onPointAdd,
  onPointRemove,
  onPointChange,
  dragHandleProps,
  className,
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className || ''}`}>
      {/* 섹션 헤더 */}
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {/* 드래그 핸들 */}
          <div 
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={16} />
          </div>
          
          {/* 펼침/접힘 아이콘 */}
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          
          {/* 섹션 제목 */}
          <span className={`font-medium ${section.visible === false ? 'text-gray-400' : 'text-gray-900'}`}>
            {section.title}
          </span>
        </div>
        
        {/* 액션 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 표시/숨김 토글 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityToggle();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={section.visible === false ? "섹션 표시" : "섹션 숨기기"}
          >
            {section.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          
          {/* 항목 추가 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onItemAdd();
            }}
            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            title="항목 추가"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* 섹션 내용 */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* 섹션 제목 편집 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              섹션 제목
            </label>
            <Input
              value={section.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="섹션 제목 (예: Projects, Experience)"
              fullWidth
            />
          </div>

          {/* 섹션 아이템들 */}
          <div className="space-y-4">
            {section.items.map((item) => (
              <SectionItemEditor
                key={item.id}
                item={item}
                onRemove={() => onItemRemove(item.id)}
                onChange={(field, value) => onItemChange(item.id, field, value)}
                onPointAdd={() => onPointAdd(item.id)}
                onPointRemove={(index) => onPointRemove(item.id, index)}
                onPointChange={(index, value) => onPointChange(item.id, index, value)}
              />
            ))}
          </div>

          {/* 새 항목 추가 버튼 */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onItemAdd}
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            새 항목 추가
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * 섹션 아이템 편집 서브컴포넌트
 */
interface SectionItemEditorProps {
  item: SectionItem;
  onRemove: () => void;
  onChange: (field: keyof SectionItem, value: any) => void;
  onPointAdd: () => void;
  onPointRemove: (index: number) => void;
  onPointChange: (index: number, value: string) => void;
}

const SectionItemEditor: React.FC<SectionItemEditorProps> = ({
  item,
  onRemove,
  onChange,
  onPointAdd,
  onPointRemove,
  onPointChange,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      {/* 삭제 버튼 */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          iconLeft={<Trash2 size={14} />}
          className="text-red-500 hover:text-red-600"
        >
          삭제
        </Button>
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="제목"
          value={item.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="예: 프로젝트명"
          fullWidth
        />
        
        <Input
          label="부제"
          value={item.subtitle || ''}
          onChange={(e) => onChange('subtitle', e.target.value)}
          placeholder="예: 역할/팀"
          fullWidth
        />
      </div>

      <Input
        label="기간"
        value={item.date || ''}
        onChange={(e) => onChange('date', e.target.value)}
        placeholder="예: 2024.01 - 2024.12"
        fullWidth
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          설명
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          value={item.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="설명을 입력하세요 (**굵게** 지원)"
        />
      </div>

      {/* 상세 설명 (포인트) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            상세 설명
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onPointAdd}
            iconLeft={<Plus size={14} />}
          >
            추가
          </Button>
        </div>
        
        <div className="space-y-2">
          {(item.points || []).map((point, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                value={point}
                onChange={(e) => onPointChange(index, e.target.value)}
                placeholder="상세 설명을 입력하세요"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPointRemove(index)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          기술 스택 (쉼표로 구분)
        </label>
        <TechStackInput
          value={item.techStack}
          onChange={(techStackArray) => onChange('techStack', techStackArray)}
          placeholder="Java, Spring Boot, React 등"
          fullWidth
        />
      </div>
    </div>
  );
};