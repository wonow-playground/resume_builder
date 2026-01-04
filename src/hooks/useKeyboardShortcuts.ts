/**
 * 키보드 단축키 훅
 * 키보드 단축키 이벤트 처리
 */
import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  /** 단축키 (예: 'ctrl+s', 'cmd+s') */
  key: string;
  /** 콜백 함수 */
  callback: () => void;
  /** 단축키 설명 */
  description?: string;
}

interface UseKeyboardShortcutsOptions {
  /** 단축키 활성화 여부 */
  enabled?: boolean;
  /** 단축키 목록 */
  shortcuts: KeyboardShortcut[];
}

/**
 * 키보드 단축키 훅
 * 
 * @param options - 훅 옵션
 * 
 * @example
 * useKeyboardShortcuts({
 *   shortcuts: [
 *     {
 *       key: 'ctrl+s',
 *       callback: () => handleSave(),
 *       description: '저장'
 *     }
 *   ]
 * });
 */
export const useKeyboardShortcuts = (options: UseKeyboardShortcutsOptions) => {
  const { enabled = true, shortcuts } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // 🔑 핵심: 입력 필드에 포커스가 있으면 단축키 비활성화
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT' || 
        activeElement?.tagName === 'TEXTAREA') {
      return;
    }
    
    shortcuts.forEach(shortcut => {
      const { key, callback } = shortcut;
      
      // 단축키 파싱 (예: 'ctrl+s' -> { ctrl: true, key: 's' })
      const parts = key.toLowerCase().split('+');
      const modifiers = parts.slice(0, -1);
      const mainKey = parts[parts.length - 1];
      
      // 🔑 중요: 정의된 단축키만 처리
      // 쉼표, 스페이스 등은 단축키로 정의되지 않음
      const isDefinedShortcut = mainKey && (
        mainKey === 's' || // save
        mainKey === 'p' || // print
        mainKey === 'z' || // undo
        mainKey === 'y' || // redo
        mainKey === 'c' || // copy
        mainKey === 'v' || // paste
        mainKey === 'x' || // cut
        mainKey === 'a' || // select all
        mainKey === 'f' || // find
        mainKey === 'n' || // new
        mainKey === 'o' || // open
        mainKey === 'w' || // close
        mainKey === 'q' || // quit
        mainKey === 'r' || // refresh
        mainKey === 'escape' ||
        mainKey === 'enter' ||
        mainKey === 'tab' ||
        mainKey === 'backspace' ||
        mainKey === 'delete' ||
        mainKey.includes('arrow')
      );
      
      // 정의된 단축키가 아니면 즉시 스킵
      if (!isDefinedShortcut) {
        return;
      }
      
      // 수식어 확인
      const modifierMatches = {
        ctrl: event.ctrlKey || event.metaKey,
        cmd: event.metaKey,
        shift: event.shiftKey,
        alt: event.altKey,
      };
      
      const allModifiersMatch = modifiers.every(mod => modifierMatches[mod as keyof typeof modifierMatches]);
      const keyMatches = event.key.toLowerCase() === mainKey;
      
      if (allModifiersMatch && keyMatches) {
        event.preventDefault();
        event.stopPropagation();
        callback();
      }
    });
  }, [enabled, shortcuts]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);
};