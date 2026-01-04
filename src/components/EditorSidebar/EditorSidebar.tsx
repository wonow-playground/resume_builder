/**
 * 에디터 사이드바 컴포넌트
 * 이력서 내용 및 디자인 편집
 */
import React, { useState, useCallback } from 'react';
import { ResumeConfig, SectionItem } from '@/types/resume';
import { ResumeStyle, ThemeCategory } from '@/types/style';
import { Button } from '@/components/ui';
import { Slider } from '@/components/ui';
import { 
  ChevronDown, 
  ChevronRight, 
  Save, 
  Layout, 
  Type, 
  Sun, 
  Moon,
  RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import { ProfileEditor } from '@/components/resume/ProfileEditor';
import { SortableSectionList } from '@/components/SortableSectionList';
import { notify } from '@/utils/notify';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  DragEndEvent,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface EditorSidebarProps {
  /** 이력서 데이터 */
  data: ResumeConfig;
  /** 데이터 변경 핸들러 */
  onDataChange: (data: ResumeConfig) => void;
  /** 스타일 설정 */
  styles: ResumeStyle;
  /** 스타일 변경 핸들러 */
  onStyleChange: (styles: ResumeStyle) => void;
  /** 저장 핸들러 */
  onSave: () => Promise<void>;
  /** 저장 중 상태 */
  isSaving?: boolean;
  /** 다크 모드 상태 */
  isDarkMode: boolean;
  /** 테마 토글 핸들러 */
  onThemeToggle: () => void;
  /** 커스텀 클래스네임 */
  className?: string;
}

/**
 * 에디터 사이드바 컴포넌트
 * 
 * @example
 * <EditorSidebar
 *   data={data}
 *   onDataChange={setData}
 *   styles={styles}
 *   onStyleChange={setStyles}
 *   onSave={handleSave}
 *   isSaving={isSaving}
 *   isDarkMode={isDarkMode}
 *   onThemeToggle={toggleTheme}
 * />
 */
export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  data,
  onDataChange,
  styles,
  onStyleChange,
  onSave,
  isSaving = false,
  isDarkMode,
  onThemeToggle,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['profile']));
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>('profile');

  // DND 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.sections.findIndex((section) => section.id === active.id);
      const newIndex = data.sections.findIndex((section) => section.id === over.id);
      
      const newSections = arrayMove(data.sections, oldIndex, newIndex);
      onDataChange({ ...data, sections: newSections });
    }
  }, [data, onDataChange]);

  // 섹션 토글
  const toggleSection = useCallback((sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // 프로필 변경 핸들러
  const handleProfileChange = useCallback((field: string, value: string) => {
    onDataChange({
      ...data,
      profile: { ...data.profile, [field]: value },
    });
  }, [data, onDataChange]);

  // 연락처 변경 핸들러
  const handleContactChange = useCallback((field: string, value: string) => {
    onDataChange({
      ...data,
      profile: {
        ...data.profile,
        contact: { ...data.profile.contact, [field]: value },
      },
    });
  }, [data, onDataChange]);

  // 섹션 제목 변경 핸들러
  const handleSectionTitleChange = useCallback((sectionId: string, title: string) => {
    const newSections = data.sections.map((section) =>
      section.id === sectionId ? { ...section, title } : section
    );
    onDataChange({ ...data, sections: newSections });
  }, [data, onDataChange]);

  // 섹션 가시성 토글 핸들러
  const handleSectionVisibilityToggle = useCallback((sectionId: string) => {
    const newSections = data.sections.map((section) =>
      section.id === sectionId 
        ? { ...section, visible: section.visible === undefined ? false : !section.visible }
        : section
    );
    onDataChange({ ...data, sections: newSections });
  }, [data, onDataChange]);

  // 섹션 항목 변경 핸들러
  const handleSectionItemChange = useCallback((
    sectionId: string, 
    itemId: string, 
    field: keyof SectionItem, 
    value: unknown
  ) => {
    const newSections = data.sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      return {
        ...section,
        items: section.items.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    });
    onDataChange({ ...data, sections: newSections });
  }, [data, onDataChange]);

  // 섹션 항목 추가 핸들러
  const handleSectionItemAdd = useCallback((sectionId: string) => {
    const newSections = data.sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      const newItem: SectionItem = {
        id: Date.now().toString(),
        title: '새 항목',
        subtitle: '',
        date: '',
        description: '',
        points: [],
      };
      
      return { ...section, items: [newItem, ...section.items] };
    });
    onDataChange({ ...data, sections: newSections });
  }, [data, onDataChange]);

  // 섹션 항목 제거 핸들러
  const handleSectionItemRemove = useCallback((sectionId: string, itemId: string) => {
    if (notify.confirm) {
      notify.confirm('정말로 이 항목을 삭제하시겠습니까?', () => {
        const newSections = data.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return { ...section, items: section.items.filter((item) => item.id !== itemId) };
        });
        onDataChange({ ...data, sections: newSections });
        if (notify.success) {
          notify.success('항목이 삭제되었습니다.');
        }
      });
    } else {
      // confirm 함수가 없을 경우 바로 삭제
      const newSections = data.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return { ...section, items: section.items.filter((item) => item.id !== itemId) };
      });
      onDataChange({ ...data, sections: newSections });
      if (notify.success) {
        notify.success('항목이 삭제되었습니다.');
      }
    }
  }, [data, onDataChange]);

  // 포인트 추가 핸들러
  const handlePointAdd = useCallback((sectionId: string, itemId: string) => {
    const newSections = data.sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      return {
        ...section,
        items: section.items.map((item) =>
          item.id === itemId 
            ? { ...item, points: [...(item.points || []), '새 불렛 포인트'] }
            : item
        ),
      };
    });
    onDataChange({ ...data, sections: newSections });
  }, [data, onDataChange]);

  // 포인트 제거 핸들러
  const handlePointRemove = useCallback((sectionId: string, itemId: string, pointIndex: number) => {
    const newSections = data.sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      return {
        ...section,
        items: section.items.map((item) => {
          if (item.id !== itemId) return item;
          const newPoints = [...(item.points || [])];
          newPoints.splice(pointIndex, 1);
          return { ...item, points: newPoints };
        }),
      };
    });
    onDataChange({ ...data, sections: newSections });
  }, [data, onDataChange]);

  // 포인트 변경 핸들러
  const handlePointChange = useCallback((sectionId: string, itemId: string, pointIndex: number, value: string) => {
    const newSections = data.sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      return {
        ...section,
        items: section.items.map((item) => {
          if (item.id !== itemId) return item;
          const newPoints = [...(item.points || [])];
          newPoints[pointIndex] = value;
          return { ...item, points: newPoints };
        }),
      };
    });
    onDataChange({ ...data, sections: newSections });
  }, [data, onDataChange]);

  // 테마 변경 핸들러
  const handleThemeChange = useCallback((field: keyof typeof styles.theme[ThemeCategory], value: number) => {
    const newTheme = { ...styles.theme };
    newTheme[activeCategory] = {
      ...newTheme[activeCategory],
      [field]: value
    };
    onStyleChange({ ...styles, theme: newTheme });
  }, [styles, activeCategory, onStyleChange]);

  // 전체 적용 핸들러
  const handleApplyToAll = useCallback(() => {
    const categoryName = activeCategory === 'profile' 
      ? '프로필' 
      : (data.sections.find(s => s.type === activeCategory)?.title || activeCategory);
      
    if (notify.confirm) {
      notify.confirm(
        `현재 '${categoryName}' 섹션의 디자인 설정을 다른 모든 섹션에도 동일하게 적용하시겠습니까?`,
        () => {
          const currentTheme = styles.theme[activeCategory];
          const newTheme = {
            global: { ...currentTheme },
            profile: { ...currentTheme },
            experience: { ...currentTheme },
            project: { ...currentTheme },
            education: { ...currentTheme },
            activity: { ...currentTheme },
          };
          
          onStyleChange({ ...styles, theme: newTheme });
          if (notify.success) {
            notify.success('전체 섹션에 디자인이 적용되었습니다.');
          }
        }
      );
    }
  }, [activeCategory, data.sections, styles, onStyleChange]);

  const currentTheme = styles.theme[activeCategory];

  return (
    <aside className={clsx(
      'w-96 bg-[var(--bg-card)] border-l border-[var(--border)] flex flex-col h-screen',
      'no-print',
      className
    )}>
      {/* 헤더 */}
      <header className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-title)]">
            에디터
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              title="테마 변경"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              loading={isSaving}
            >
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 mt-4 p-1 bg-[var(--bg)] rounded-lg">
          <button
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'content' 
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
            onClick={() => setActiveTab('content')}
          >
            <Layout size={16} />
            내용
          </button>
          <button
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'design' 
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
            onClick={() => setActiveTab('design')}
          >
            <Type size={16} />
            디자인
          </button>
        </div>
      </header>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 내용 탭 */}
        {activeTab === 'content' && (
          <div className="p-4 space-y-4">
            {/* 프로필 에디터 */}
            <ProfileEditor
              profile={data.profile}
              onProfileChange={handleProfileChange}
              onContactChange={handleContactChange}
              isExpanded={openSections.has('profile')}
              onToggle={() => toggleSection('profile')}
            />

            {/* 섹션 목록 */}
            <SortableSectionList
              sections={data.sections}
              sensors={sensors}
              openSections={openSections}
              onSectionToggle={toggleSection}
              onSectionTitleChange={handleSectionTitleChange}
              onSectionVisibilityToggle={handleSectionVisibilityToggle}
              onSectionItemAdd={handleSectionItemAdd}
              onSectionItemRemove={handleSectionItemRemove}
              onSectionItemChange={handleSectionItemChange}
              onPointAdd={handlePointAdd}
              onPointRemove={handlePointRemove}
              onPointChange={handlePointChange}
              onDragEnd={handleDragEnd}
            />
          </div>
        )}

        {/* 디자인 탭 */}
        {activeTab === 'design' && (
          <div className="p-4 space-y-6">
            {/* 카테고리 선택 */}
            <div className="space-y-4 pb-4 border-b border-[var(--border)]">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  설정 대상 (Target)
                </label>
                <select 
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--bg)] text-[var(--text-primary)]"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value as ThemeCategory)}
                >
                  <option value="profile">프로필 (Profile)</option>
                  {data.sections.map((section) => (
                    <option key={section.id} value={section.type}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleApplyToAll}
                className="w-full"
                iconLeft={<RefreshCw size={14} />}
              >
                현재 설정을 모든 섹션에 적용하기
              </Button>
            </div>

            {/* 스타일 설정 */}
            <div className="space-y-6">
              <StyleSlider
                label="헤더 크기 (이름/섹션명)"
                value={currentTheme.headerSize}
                min={1}
                max={4}
                step={0.1}
                unit="rem"
                onChange={(value) => handleThemeChange('headerSize', value)}
              />

              <StyleSlider
                label="항목 제목 크기"
                value={currentTheme.itemTitleSize}
                min={0.8}
                max={2}
                step={0.05}
                unit="rem"
                onChange={(value) => handleThemeChange('itemTitleSize', value)}
              />

              <StyleSlider
                label="부제/메타 크기"
                value={currentTheme.subtitleSize}
                min={0.7}
                max={1.5}
                step={0.05}
                unit="rem"
                onChange={(value) => handleThemeChange('subtitleSize', value)}
              />

              <StyleSlider
                label="본문 크기"
                value={currentTheme.textSize}
                min={0.6}
                max={1.2}
                step={0.025}
                unit="rem"
                onChange={(value) => handleThemeChange('textSize', value)}
              />

              <StyleSlider
                label="내부 간격 (Spacing)"
                value={currentTheme.spacing}
                min={0.5}
                max={2}
                step={0.1}
                unit="x"
                onChange={(value) => handleThemeChange('spacing', value)}
              />

              <div className="pt-4 border-t border-[var(--border)]">
                <StyleSlider
                  label="섹션 간 간격 (Global)"
                  value={styles.sectionSpacing}
                  min={0.5}
                  max={2}
                  step={0.1}
                  unit="x"
                  onChange={(value) => onStyleChange({ ...styles, sectionSpacing: value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

/**
 * 스타일 슬라이더 컴포넌트
 */
interface StyleSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

const StyleSlider: React.FC<StyleSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
        <span className="text-sm font-mono text-[var(--text-primary)] bg-[var(--bg)] px-2 py-1 rounded">
          {value}{unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number((e.target as HTMLInputElement).value))}
        className="w-full"
      />
    </div>
  );
};