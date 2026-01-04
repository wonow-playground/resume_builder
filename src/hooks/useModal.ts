/**
 * 모달 상태 관리 훅
 * 모달의 열림/닫힘 상태와 관련 로직을 처리
 */
import React, { useState, useCallback, useEffect } from 'react';

interface UseModalOptions {
  /** 초기 열림 상태 */
  initialOpen?: boolean;
  /** ESC 키로 닫기 여부 */
  closeOnEscape?: boolean;
  /** 외부 클릭으로 닫기 여부 */
  closeOnOutsideClick?: boolean;
  /** 닫기 핸들러 */
  onClose?: () => void;
  /** 열기 핸들러 */
  onOpen?: () => void;
}

interface UseModalReturn {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 열기 함수 */
  open: () => void;
  /** 모달 닫기 함수 */
  close: () => void;
  /** 모달 토글 함수 */
  toggle: () => void;
  /** 모달 참조 (외부 클릭 감지용) */
  modalRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 모달 상태 관리 훅
 * 모달의 열림/닫힘 상태와 키보드/마우스 이벤트를 처리
 * 
 * @param options - 훅 옵션
 * @returns 모달 상태와 제어 함수들
 * 
 * @example
 * const { isOpen, open, close, toggle, modalRef } = useModal({
 *   closeOnEscape: true,
 *   closeOnOutsideClick: true
 * });
 * 
 * // JSX에서 사용
 * {isOpen && (
 *   <div ref={modalRef} className="modal">
 *     모달 내용
 *   </div>
 * )}
 */
export const useModal = (options: UseModalOptions = {}): UseModalReturn => {
  const {
    initialOpen = false,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    onClose,
    onOpen,
  } = options;

  const [isOpen, setIsOpen] = useState(initialOpen);
  const modalRef = React.useRef<HTMLDivElement>(null);

  /**
   * 모달 열기 함수
   */
  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
    
    // 스크롤 방지
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }, [onOpen]);

  /**
   * 모달 닫기 함수
   */
  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
    
    // 스크롤 복원
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
  }, [onClose]);

  /**
   * 모달 토글 함수
   */
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, close]);

  // 외부 클릭으로 닫기
  useEffect(() => {
    if (!closeOnOutsideClick || !isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [closeOnOutsideClick, isOpen, close]);

  // 컴포넌트 언마운트 시 스크롤 복원
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    modalRef,
  };
};