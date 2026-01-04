/**
 * DND 컨텍스트 훅
 * 드래그 앤 드롭 기능 관리
 */
import { 
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

interface UseDndContextOptions<T> {
  /** 정렬할 아이템 목록 */
  items: T[];
  /** 재정렬 핸들러 */
  onReorder: (items: T[]) => void;
}

/**
 * DND 컨텍스트 훅
 * 
 * @param options - 훅 옵션
 * @returns 센서와 드래그 종료 핸들러
 */
export const useDndContext = <T extends { id: string }>(options: UseDndContextOptions<T>) => {
  const { items, onReorder } = options;

  // 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 움직여야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // 아이템 순서 변경
    const newItems = [...items];
    const [reorderedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, reorderedItem);

    onReorder(newItems);
  };

  return {
    sensors,
    handleDragEnd,
  };
};