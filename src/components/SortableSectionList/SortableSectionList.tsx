/**
 * 정렬 가능한 섹션 목록 컴포넌트
 * 드래그 앤 드롭으로 섹션 순서 변경
 */
import React from 'react';
import { Section, SectionItem } from '@/types/resume';
import { SectionEditor } from '@/components/resume/SectionEditor/SectionEditor';
import { 
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSectionListProps {
  /** 섹션 목록 */
  sections: Section[];
  /** DND 센서 */
  sensors: any;
  /** 확장된 섹션들 */
  openSections: Set<string>;
  /** 섹션 토글 핸들러 */
  onSectionToggle: (sectionId: string) => void;
  /** 섹션 제목 변경 핸들러 */
  onSectionTitleChange: (sectionId: string, title: string) => void;
  /** 섹션 가시성 토글 핸들러 */
  onSectionVisibilityToggle: (sectionId: string) => void;
  /** 섹션 항목 추가 핸들러 */
  onSectionItemAdd: (sectionId: string) => void;
  /** 섹션 항목 제거 핸들러 */
  onSectionItemRemove: (sectionId: string, itemId: string) => void;
  /** 섹션 항목 변경 핸들러 */
  onSectionItemChange: (sectionId: string, itemId: string, field: keyof SectionItem, value: any) => void;
  /** 포인트 추가 핸들러 */
  onPointAdd: (sectionId: string, itemId: string) => void;
  /** 포인트 제거 핸들러 */
  onPointRemove: (sectionId: string, itemId: string, pointIndex: number) => void;
  /** 포인트 변경 핸들러 */
  onPointChange: (sectionId: string, itemId: string, pointIndex: number, value: string) => void;
  /** 드래그 종료 핸들러 */
  onDragEnd: (event: DragEndEvent) => void;
  /** 커스텀 클래스네임 */
  className?: string;
}

/**
 * 정렬 가능한 섹션 목록 컴포넌트
 */
export const SortableSectionList: React.FC<SortableSectionListProps> = ({
  sections,
  sensors,
  openSections,
  onSectionToggle,
  onSectionTitleChange,
  onSectionVisibilityToggle,
  onSectionItemAdd,
  onSectionItemRemove,
  onSectionItemChange,
  onPointAdd,
  onPointRemove,
  onPointChange,
  onDragEnd,
  className
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd(event);
  };

  const activeSection = sections.find(section => section.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={className}>
          {sections.map((section) => (
            <SortableSectionItem
              key={section.id}
              section={section}
              isExpanded={openSections.has(section.id)}
              onToggle={() => onSectionToggle(section.id)}
              onTitleChange={(title) => onSectionTitleChange(section.id, title)}
              onVisibilityToggle={() => onSectionVisibilityToggle(section.id)}
              onItemAdd={() => onSectionItemAdd(section.id)}
              onItemRemove={(itemId) => onSectionItemRemove(section.id, itemId)}
              onItemChange={(itemId, field, value) => onSectionItemChange(section.id, itemId, field, value)}
              onPointAdd={(itemId) => onPointAdd(section.id, itemId)}
              onPointRemove={(itemId, pointIndex) => onPointRemove(section.id, itemId, pointIndex)}
              onPointChange={(itemId, pointIndex, value) => onPointChange(section.id, itemId, pointIndex, value)}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeSection ? (
          <div className="opacity-80">
            <SectionEditor
              section={activeSection}
              isOpen={false}
              onToggle={() => {}}
              onTitleChange={(title: string) => {}}
              onVisibilityToggle={() => {}}
              onItemAdd={() => {}}
              onItemRemove={(itemId: string) => {}}
              onItemChange={(itemId: string, field: keyof SectionItem, value: any) => {}}
              onPointAdd={(itemId: string) => {}}
              onPointRemove={(itemId: string, pointIndex: number) => {}}
              onPointChange={(itemId: string, pointIndex: number, value: string) => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

/**
 * 정렬 가능한 섹션 아이템 컴포넌트
 */
interface SortableSectionItemProps {
  section: Section;
  isExpanded: boolean;
  onToggle: () => void;
  onTitleChange: (title: string) => void;
  onVisibilityToggle: () => void;
  onItemAdd: () => void;
  onItemRemove: (itemId: string) => void;
  onItemChange: (itemId: string, field: keyof SectionItem, value: any) => void;
  onPointAdd: (itemId: string) => void;
  onPointRemove: (itemId: string, pointIndex: number) => void;
  onPointChange: (itemId: string, pointIndex: number, value: string) => void;
}

const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  section,
  isExpanded,
  onToggle,
  onTitleChange,
  onVisibilityToggle,
  onItemAdd,
  onItemRemove,
  onItemChange,
  onPointAdd,
  onPointRemove,
  onPointChange
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionEditor
        section={section}
        isOpen={isExpanded}
        onToggle={onToggle}
        onTitleChange={onTitleChange}
        onVisibilityToggle={onVisibilityToggle}
        onItemAdd={onItemAdd}
        onItemRemove={onItemRemove}
        onItemChange={onItemChange}
        onPointAdd={onPointAdd}
        onPointRemove={onPointRemove}
        onPointChange={onPointChange}
        dragHandleProps={{ ...attributes, ...listeners }}
        className={isDragging ? 'cursor-grabbing' : ''}
      />
    </div>
  );
};